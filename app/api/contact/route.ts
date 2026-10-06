import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { hasValidRequestOrigin } from "@/lib/admin-auth";
import { addContactSubmission } from "@/lib/contact-store";

type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  region?: string;
  message?: string;
  captchaAnswer?: string;
  captchaToken?: string;
  website?: string;
};

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
  return attempts.length > 5;
}

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  if (rateLimited(request)) return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });

  let payload: ContactPayload;
  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  if (clean(payload.website, 200)) return NextResponse.json({ ok: true });
  const name = clean(payload.name, 120);
  const phone = clean(payload.phone, 80);
  const email = clean(payload.email, 180);
  const region = clean(payload.region, 120);
  const message = clean(payload.message, 5000);
  if (!name || !email || !region || message.length < 10 || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Please complete the required fields with a valid email." }, { status: 400 });
  }
  if (!verifyCaptcha(clean(payload.captchaToken, 1000), clean(payload.captchaAnswer, 20))) {
    return NextResponse.json({ error: "The security answer is incorrect or expired." }, { status: 400 });
  }

  try {
    await addContactSubmission({ name, phone, email, region, message });
  } catch (error) {
    console.error("Contact storage failed", error);
    return NextResponse.json({ error: "The message could not be saved. Please try again later." }, { status: 503 });
  }
  return NextResponse.json({ ok: true });
}
