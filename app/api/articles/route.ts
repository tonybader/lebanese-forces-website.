import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  EDITOR_COOKIE,
  hasValidRequestOrigin,
  verifyAdminSession,
  verifyEditorSession,
} from "@/lib/admin-auth";
import { createArticle, listArticles } from "@/lib/article-store";
import { isArticleChannel } from "@/lib/article-types";

export const dynamic = "force-dynamic";

export async function GET() {
  const articles = await listArticles();
  return NextResponse.json(
    { articles },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}

function value(form: FormData, key: string): string {
  const entry = form.get(key);
  return typeof entry === "string" ? entry : "";
}

function tagList(form: FormData, key: string): string[] {
  try {
    const parsed = JSON.parse(value(form, key));
    return Array.isArray(parsed) ? parsed.filter((tag): tag is string => typeof tag === "string") : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const cookieStore = await cookies();
  const authenticated =
    verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value) ||
    verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
  if (!authenticated) {
    return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  }

  try {
    const form = await request.formData();
    const image = form.get("image");
    if (!(image instanceof File)) {
      return NextResponse.json({ error: "Please select a photograph." }, { status: 400 });
    }

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
    const channel = value(form, "channel");
    if (!isArticleChannel(channel)) {
      return NextResponse.json({ error: "Please choose a publishing section." }, { status: 400 });
    }

    if (title.ar.length > 240 || title.en.length > 240 || title.fr.length > 240) {
      return NextResponse.json({ error: "The title is too long." }, { status: 400 });
    }
    if (body.ar.length > 40_000 || body.en.length > 40_000 || body.fr.length > 40_000) {
      return NextResponse.json({ error: "The article is too long." }, { status: 400 });
    }

    const article = await createArticle({
      title,
      body,
      channel,
      regions: tagList(form, "regions"),
      activityTypes: tagList(form, "activityTypes"),
      people: tagList(form, "people"),
      image: {
        bytes: new Uint8Array(await image.arrayBuffer()),
        contentType: image.type,
      },
    });

    return NextResponse.json({ article }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The article could not be published.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
