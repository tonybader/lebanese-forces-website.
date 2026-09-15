import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  EDITOR_COOKIE,
  hasValidRequestOrigin,
  verifyAdminSession,
  verifyEditorSession,
} from "@/lib/admin-auth";
import { deleteArticle, updateArticle } from "@/lib/article-store";

export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ id: string }> };

function value(form: FormData, key: string): string {
  const entry = form.get(key);
  return typeof entry === "string" ? entry : "";
}

async function isAuthorized(): Promise<boolean> {
  const cookieStore = await cookies();
  return (
    verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value) ||
    verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value)
  );
}

export async function PUT(request: Request, { params }: RouteContext) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const form = await request.formData();
    const imageEntry = form.get("image");
    const image = imageEntry instanceof File && imageEntry.size
      ? {
          bytes: new Uint8Array(await imageEntry.arrayBuffer()),
          contentType: imageEntry.type,
        }
      : undefined;
    const title = {
      ar: value(form, "titleAr"),
      en: value(form, "titleEn"),
      fr: value(form, "titleFr"),
    };
    const body = {
      ar: value(form, "bodyAr"),
      en: value(form, "bodyEn"),
      fr: value(form, "bodyFr"),
    };

    if (title.ar.length > 240 || title.en.length > 240 || title.fr.length > 240) {
      return NextResponse.json({ error: "The title is too long." }, { status: 400 });
    }
    if (body.ar.length > 40_000 || body.en.length > 40_000 || body.fr.length > 40_000) {
      return NextResponse.json({ error: "The article is too long." }, { status: 400 });
    }

    const article = await updateArticle({ id: decodeURIComponent(id), title, body, image });
    return NextResponse.json({ article });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The article could not be updated.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteArticle(decodeURIComponent(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The article could not be deleted.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
