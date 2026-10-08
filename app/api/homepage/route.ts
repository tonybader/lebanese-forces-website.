import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  hasValidRequestOrigin,
  verifyAdminSession,
} from "@/lib/admin-auth";
import { getHomepageContent, updateHomepage } from "@/lib/homepage-store";
import type { HomepageContent } from "@/lib/homepage-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getHomepageContent();
  return NextResponse.json(
    { content },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}

function optionalImage(form: FormData, key: string): File | undefined {
  const entry = form.get(key);
  return entry instanceof File && entry.size ? entry : undefined;
}

async function imageMap(form: FormData, prefix: string): Promise<Record<string, { bytes: Uint8Array; contentType: string }>> {
  const images: Record<string, { bytes: Uint8Array; contentType: string }> = {};
  for (const [key, entry] of form.entries()) {
    if (!key.startsWith(prefix) || !(entry instanceof File) || !entry.size) continue;
    const id = key.slice(prefix.length);
    if (!id || id.length > 120) continue;
    images[id] = { bytes: new Uint8Array(await entry.arrayBuffer()), contentType: entry.type };
  }
  return images;
}

export async function PUT(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const cookieStore = await cookies();
  if (!verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const contentEntry = form.get("content");
    if (typeof contentEntry !== "string" || contentEntry.length > 500_000) {
      return NextResponse.json({ error: "The homepage content is invalid." }, { status: 400 });
    }
    const content = JSON.parse(contentEntry) as HomepageContent;
    const heroFile = optionalImage(form, "heroImage");
    const presidentFile = optionalImage(form, "presidentImage");
    const personImages = await imageMap(form, "personImage:");
    const historyImages = await imageMap(form, "historyImage:");
    const secretariatImages = await imageMap(form, "secretariatImage:");
    const updated = await updateHomepage({
      content,
      ...(heroFile ? { heroImage: { bytes: new Uint8Array(await heroFile.arrayBuffer()), contentType: heroFile.type } } : {}),
      ...(presidentFile ? { presidentImage: { bytes: new Uint8Array(await presidentFile.arrayBuffer()), contentType: presidentFile.type } } : {}),
      personImages,
      historyImages,
      secretariatImages,
    });
    return NextResponse.json({ content: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The homepage could not be saved.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
