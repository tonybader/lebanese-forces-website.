import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ArticleChannel, ArticleLanguage } from "@/lib/article-types";
import { generateFallbackHeadline } from "@/lib/headline-analyzer";
import {
  EDITOR_COOKIE,
  hasValidRequestOrigin,
  verifyEditorSession,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const languages = new Set<ArticleLanguage>(["ar", "en", "fr"]);
const channels = new Set<ArticleChannel>(["statements", "positions", "party", "diaspora"]);

type SuggestTitleBody = {
  body?: string;
  language?: ArticleLanguage;
  channel?: ArticleChannel;
  people?: string[];
};

export async function POST(request: Request) {
  if (!hasValidRequestOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }
  const cookieStore = await cookies();
  if (!verifyEditorSession(cookieStore.get(EDITOR_COOKIE)?.value)) {
    return NextResponse.json({ error: "Editor sign-in required." }, { status: 401 });
  }

  const payload = (await request.json()) as SuggestTitleBody;
  const language = payload.language && languages.has(payload.language) ? payload.language : "ar";
  const channel = payload.channel && channels.has(payload.channel) ? payload.channel : "party";
  const body = typeof payload.body === "string" ? payload.body.normalize("NFKC").trim().slice(0, 40000) : "";
  const people = Array.isArray(payload.people)
    ? payload.people.filter((person): person is string => typeof person === "string").map((person) => person.trim()).filter(Boolean).slice(0, 8)
    : [];
  if (body.length < 20) {
    return NextResponse.json({ error: "Add more article text before suggesting a title." }, { status: 400 });
  }

  const input = { body, language, channel, people };
  const title = generateFallbackHeadline(input);
  if (!title) {
    return NextResponse.json({ error: "A reliable title could not be generated from this text." }, { status: 422 });
  }
  return NextResponse.json({ title, source: "newsroom-analyzer" });
}
