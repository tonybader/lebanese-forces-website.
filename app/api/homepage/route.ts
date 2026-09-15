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
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
  );
}

function optionalImage(form: FormData, key: string): File | undefined {
  const entry = form.get(key);
  return entry instanceof File && entry.size ? entry : undefined;
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
    if (typeof contentEntry !== "string" || contentEntry.length > 120_000) {
      return NextResponse.json({ error: "The homepage content is invalid." }, { status: 400 });
    }
    const content = JSON.parse(contentEntry) as HomepageContent;
    const heroFile = optionalImage(form, "heroImage");
    const presidentFile = optionalImage(form, "presidentImage");
    const updated = await updateHomepage({
      content,
      ...(heroFile ? { heroImage: { bytes: new Uint8Array(await heroFile.arrayBuffer()), contentType: heroFile.type } } : {}),
      ...(presidentFile ? { presidentImage: { bytes: new Uint8Array(await presidentFile.arrayBuffer()), contentType: presidentFile.type } } : {}),
    });
    return NextResponse.json({ content: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The homepage could not be saved.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
