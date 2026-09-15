import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  createAdminSession,
  hasValidRequestOrigin,
  isAdminConfigured,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "The administration password has not been configured in Vercel yet." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { username?: string; password?: string };
  if (!verifyAdminCredentials(body.username || "", body.password || "")) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, createAdminSession(), adminCookieOptions());
  return response;
}
