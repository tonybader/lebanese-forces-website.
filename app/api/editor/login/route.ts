import { NextResponse } from "next/server";
import {
  EDITOR_COOKIE,
  createEditorSession,
  hasValidRequestOrigin,
  isEditorConfigured,
  managementCookieOptions,
  verifyEditorCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!isEditorConfigured()) {
    return NextResponse.json(
      { error: "The editor password has not been configured in Vercel yet." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { username?: string; password?: string };
  if (!verifyEditorCredentials(body.username || "", body.password || "")) {
    return NextResponse.json({ error: "Incorrect username or password." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(EDITOR_COOKIE, createEditorSession(), managementCookieOptions());
  return response;
}
