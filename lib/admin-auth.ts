import { createHmac, timingSafeEqual } from "node:crypto";

export const ADMIN_COOKIE = "lf_admin_session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12;

function configuredUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || "LFadmin";
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function constantTimeEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function signature(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && sessionSecret());
}

export function isPublishingConfigured(): boolean {
  return Boolean(process.env.GITHUB_CONTENT_TOKEN);
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword || !sessionSecret()) return false;
  return (
    constantTimeEqual(username, configuredUsername()) &&
    constantTimeEqual(password, expectedPassword)
  );
}

export function createAdminSession(): string {
  const payload = Buffer.from(
    JSON.stringify({
      username: configuredUsername(),
      expiresAt: Date.now() + SESSION_LIFETIME_SECONDS * 1000,
    }),
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function verifyAdminSession(token: string | undefined): boolean {
  if (!token || !sessionSecret()) return false;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return false;

  const expectedSignature = signature(payload);
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      username?: string;
      expiresAt?: number;
    };
    return (
      session.username === configuredUsername() &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_LIFETIME_SECONDS,
  };
}

export function hasValidRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
