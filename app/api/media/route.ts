import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  EDITOR_COOKIE,
  hasValidRequestOrigin,
  verifyEditorSession,
} from "@/lib/admin-auth";
import { getMediaContent, updateMediaContent } from "@/lib/media-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { content: await getMediaContent() },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}

export async function PUT(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const cookieStore = await cookies();
  if (!verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value)) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }
  try {
    const raw = await request.text();
    if (raw.length > 400_000) return NextResponse.json({ error: "The media library is too large." }, { status: 413 });
    const content = await updateMediaContent(JSON.parse(raw));
    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The media library could not be saved.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
