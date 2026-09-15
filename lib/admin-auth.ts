import { createHmac, timingSafeEqual } from "node:crypto";

export type ManagementRole = "admin" | "editor";

export const ADMIN_COOKIE = "lf_admin_session";
export const EDITOR_COOKIE = "lf_editor_session";
const SESSION_LIFETIME_SECONDS = 60 * 60 * 12;

function adminUsername(): string {
  return process.env.ADMIN_USERNAME?.trim() || "LFadmin";
}

export function configuredUsername(role: ManagementRole): string {
  if (role === "admin") return adminUsername();
  if (process.env.EDITOR_USERNAME?.trim()) return process.env.EDITOR_USERNAME.trim();
  return process.env.EDITOR_PASSWORD ? "LFeditor" : adminUsername();
}

function configuredPassword(role: ManagementRole): string {
  if (role === "admin") return process.env.ADMIN_PASSWORD || "";
  return process.env.EDITOR_PASSWORD || process.env.ADMIN_PASSWORD || "";
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

export function isRoleConfigured(role: ManagementRole): boolean {
  return Boolean(configuredPassword(role) && sessionSecret());
}

export function isAdminConfigured(): boolean {
  return isRoleConfigured("admin");
}

export function isEditorConfigured(): boolean {
  return isRoleConfigured("editor");
}

export function isPublishingConfigured(): boolean {
  return Boolean(process.env.GITHUB_CONTENT_TOKEN);
}

export function verifyCredentials(
  role: ManagementRole,
  username: string,
  password: string,
): boolean {
  const expectedPassword = configuredPassword(role);
  if (!expectedPassword || !sessionSecret()) return false;
  return (
    constantTimeEqual(username, configuredUsername(role)) &&
    constantTimeEqual(password, expectedPassword)
  );
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  return verifyCredentials("admin", username, password);
}

export function verifyEditorCredentials(username: string, password: string): boolean {
  return verifyCredentials("editor", username, password);
}

export function createSession(role: ManagementRole): string {
  const payload = Buffer.from(
    JSON.stringify({
      role,
      username: configuredUsername(role),
      expiresAt: Date.now() + SESSION_LIFETIME_SECONDS * 1000,
    }),
  ).toString("base64url");
  return `${payload}.${signature(payload)}`;
}

export function createAdminSession(): string {
  return createSession("admin");
}

export function createEditorSession(): string {
  return createSession("editor");
}

export function verifySession(
  token: string | undefined,
  expectedRole: ManagementRole,
): boolean {
  if (!token || !sessionSecret()) return false;
  const [payload, suppliedSignature] = token.split(".");
  if (!payload || !suppliedSignature) return false;

  const expectedSignature = signature(payload);
  if (!constantTimeEqual(suppliedSignature, expectedSignature)) return false;

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      role?: ManagementRole;
      username?: string;
      expiresAt?: number;
    };
    return (
      session.role === expectedRole &&
      session.username === configuredUsername(expectedRole) &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export function verifyAdminSession(token: string | undefined): boolean {
  return verifySession(token, "admin");
}

export function verifyEditorSession(token: string | undefined): boolean {
  return verifySession(token, "editor");
}

export function managementCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_LIFETIME_SECONDS,
  };
}

export const adminCookieOptions = managementCookieOptions;

export function hasValidRequestOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}
