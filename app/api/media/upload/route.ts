import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  EDITOR_COOKIE,
  hasValidRequestOrigin,
  verifyEditorSession,
} from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const cookieStore = await cookies();
  if (!verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value)) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  try {
    const body = await request.json() as HandleUploadBody;
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!pathname.startsWith("publications/")) throw new Error("Invalid publication upload path.");
        const payload = clientPayload ? JSON.parse(clientPayload) as { kind?: string } : {};
        const pdf = payload.kind === "pdf";
        return {
          allowedContentTypes: pdf
            ? ["application/pdf"]
            : ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: pdf ? 30 * 1024 * 1024 : 6 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "The file could not be uploaded.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
