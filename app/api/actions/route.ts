import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { addActionSubmission, type ActionKind } from "@/lib/action-store";
import { hasValidRequestOrigin } from "@/lib/admin-auth";

type ActionPayload = {
  kind?: string;
  language?: string;
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  topic?: string;
  dateOfBirth?: string;
  availability?: string;
  message?: string;
  captchaAnswer?: string;
  captchaToken?: string;
  website?: string;
};

const kinds = new Set<ActionKind>(["enroll", "idea", "volunteer", "newsletter"]);
const recent = new Map<string, number[]>();

function secret(): string {
  return process.env.CONTACT_CAPTCHA_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function safeEqual(left: string, right: string): boolean {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function verifyCaptcha(token: string, answer: string): boolean {
  const [payload, supplied] = token.split(".");
  if (!payload || !supplied || !secret()) return false;
  const expected = createHmac("sha256", secret()).update(payload).digest("base64url");
  if (!safeEqual(supplied, expected)) return false;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { answer?: number; expiresAt?: number };
    return typeof decoded.answer === "number" && decoded.answer === Number(answer) && typeof decoded.expiresAt === "number" && decoded.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function clean(value: unknown, maximum: number): string {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function rateLimited(request: Request): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const cutoff = Date.now() - 15 * 60 * 1000;
  const attempts = (recent.get(ip) || []).filter((timestamp) => timestamp > cutoff);
  attempts.push(Date.now());
  recent.set(ip, attempts);
  return attempts.length > 8;
}

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (rateLimited(request)) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

  let payload: ActionPayload;
  try {
    payload = await request.json() as ActionPayload;
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (clean(payload.website, 200)) return NextResponse.json({ ok: true });
  const kind = clean(payload.kind, 30) as ActionKind;
  const name = clean(payload.name, 120);
  const email = clean(payload.email, 180);
  const phone = clean(payload.phone, 80);
  const region = clean(payload.region, 120);
  const topic = clean(payload.topic, 200);
  const dateOfBirth = clean(payload.dateOfBirth, 20);
  const availability = clean(payload.availability, 200);
  const message = clean(payload.message, 5000);
  const language = clean(payload.language, 10) || "ar";

  if (!kinds.has(kind)) return NextResponse.json({ error: "Please choose a valid action." }, { status: 400 });
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  if (kind === "newsletter") {
    if (!email || !phone) return NextResponse.json({ error: "An email address and phone number are required for the newsletter." }, { status: 400 });
  } else if (!name || (!email && !phone) || !region) {
    return NextResponse.json({ error: "Please add your name, region, and at least one contact method." }, { status: 400 });
  }
  if (kind === "idea" && (!topic || message.length < 10)) return NextResponse.json({ error: "Please enter a topic and describe your idea." }, { status: 400 });
  if (kind === "volunteer" && (!topic || !availability)) return NextResponse.json({ error: "Please enter a topic and your availability." }, { status: 400 });
  if (!verifyCaptcha(clean(payload.captchaToken, 1000), clean(payload.captchaAnswer, 20))) {
    return NextResponse.json({ error: "The security answer is incorrect or expired." }, { status: 400 });
  }

  try {
    await addActionSubmission({ kind, language, name, email, phone, region, topic, dateOfBirth, availability, message });
  } catch (error) {
    console.error("Action storage failed", error);
    return NextResponse.json({ error: "Your request could not be saved. Please try again later." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
