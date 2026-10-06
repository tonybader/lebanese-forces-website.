import { createHmac, randomInt } from "node:crypto";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function secret(): string {
  return process.env.CONTACT_CAPTCHA_SECRET || process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function GET() {
  if (!secret()) return NextResponse.json({ error: "The contact form is not configured." }, { status: 503 });
  const left = randomInt(2, 10);
  const right = randomInt(2, 10);
  const payload = Buffer.from(JSON.stringify({ answer: left + right, expiresAt: Date.now() + 10 * 60 * 1000 })).toString("base64url");
  return NextResponse.json(
    { question: `${left} + ${right}`, token: `${payload}.${sign(payload)}` },
    { headers: { "Cache-Control": "no-store" } },
  );
}
