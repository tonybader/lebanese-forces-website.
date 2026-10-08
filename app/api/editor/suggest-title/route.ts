import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { ArticleChannel, ArticleLanguage } from "@/lib/article-types";
import {
  generateFallbackHeadline,
  isPlausibleHeadline,
  sanitizeHeadline,
} from "@/lib/headline-analyzer";
import { publicProfiles } from "@/lib/people";
import {
  EDITOR_COOKIE,
  hasValidRequestOrigin,
  verifyEditorSession,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

const languages = new Set<ArticleLanguage>(["ar", "en", "fr"]);
const channels = new Set<ArticleChannel>(["statements", "positions", "party", "special", "diaspora"]);
const articleAnalysisSchema = z.object({
  title: z.string().min(8).max(150),
  regions: z.array(z.string().min(2).max(80)).max(8),
  activityTypes: z.array(z.string().min(2).max(80)).max(8),
  people: z.array(z.string().min(2).max(100)).max(16),
});

type SuggestTitleBody = {
  body?: string;
  currentTitle?: string;
  language?: ArticleLanguage;
  channel?: ArticleChannel;
  people?: string[];
  regions?: string[];
  activityTypes?: string[];
};

function cleanList(value: unknown, maximum: number): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.normalize("NFKC").replace(/\s+/g, " ").trim().slice(0, 100))
    .filter(Boolean)
    .slice(0, maximum);
}

function unique(values: string[], maximum: number): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const value of values) {
    const key = value.normalize("NFKC").toLocaleLowerCase("ar-LB");
    if (!key || seen.has(key)) continue;
    seen.add(key);
    result.push(value);
    if (result.length >= maximum) break;
  }
  return result;
}

const regionalNames = [
  "بيروت", "بعبدا", "المتن", "عاليه", "الشوف", "كسروان", "جبيل", "بشري",
  "الكورة", "البترون", "طرابلس", "عكار", "زحلة", "البقاع", "بعلبك ـ الهرمل",
  "جزين", "صيدا", "الجنوب", "الشمال", "الولايات المتحدة", "كندا", "أستراليا",
  "فرنسا", "أوروبا", "الخليج",
];

const partyPeople = [
  ["طوني بدر", ["طوني بدر", "tony bader"]],
  ["سليم أبي ضاهر", ["سليم أبي ضاهر", "سليم ابي ضاهر", "selim abi daher", "salim abi daher"]],
  ["إميل مكرزل", ["إميل مكرزل", "اميل مكرزل", "emile moukarzel", "emil moukarzel"]],
  ["جورج عيد", ["جورج عيد", "georges eid", "george eid"]],
] as const;

function fallbackTags(body: string, channel: ArticleChannel, existing: { regions: string[]; activityTypes: string[]; people: string[] }) {
  const haystack = body.normalize("NFKC").toLocaleLowerCase("ar-LB");
  const people = publicProfiles
    .filter((profile) => profile.aliases.some((alias) => haystack.includes(alias.normalize("NFKC").toLocaleLowerCase("ar-LB"))))
    .map((profile) => profile.name.ar);
  for (const [name, aliases] of partyPeople) {
    if (aliases.some((alias) => haystack.includes(alias.toLocaleLowerCase("ar-LB")))) people.push(name);
  }
  const isRegionalStatement = /منسقية|منطقة|مكتب القوات|مركز القوات|regional chapter|regional office/i.test(haystack);
  const regions = (channel !== "statements" || isRegionalStatement)
    ? regionalNames.filter((region) => haystack.includes(region.toLocaleLowerCase("ar-LB")))
    : [];
  const activityTypes: string[] = [];
  if (/تسل[ّ]?م\s+وتسليم|مقر المنسقية|رؤساء المراكز|عمل حزبي|منسق المنطقة/.test(haystack)) activityTypes.push("نشاط حزبي");
  if (/قداس|قدّاس/.test(haystack)) activityTypes.push("قداس");
  if (/مؤتمر صحافي|مؤتمر صحفي/.test(haystack)) activityTypes.push("مؤتمر صحافي");
  if (/اجتماع|لقاء/.test(haystack)) activityTypes.push("اجتماع");
  if (/اقتراح قانون|مجلس النواب|لجنة نيابية/.test(haystack)) activityTypes.push("عمل نيابي");
  return {
    regions: unique([...existing.regions, ...regions], 8),
    activityTypes: unique([...existing.activityTypes, ...activityTypes], 8),
    people: unique([...existing.people, ...people], 16),
  };
}

function languageName(language: ArticleLanguage): string {
  return language === "ar" ? "Arabic" : language === "fr" ? "French" : "English";
}

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
  const currentTitle = typeof payload.currentTitle === "string" ? payload.currentTitle.normalize("NFKC").trim().slice(0, 240) : "";
  const existing = {
    people: cleanList(payload.people, 16),
    regions: cleanList(payload.regions, 8),
    activityTypes: cleanList(payload.activityTypes, 8),
  };
  if (body.length < 20) {
    return NextResponse.json({ error: "Add more article text before analyzing it." }, { status: 400 });
  }

  const deterministicTags = fallbackTags(body, channel, existing);
  const fallbackTitle = generateFallbackHeadline({ body, language, channel, people: deterministicTags.people, regions: deterministicTags.regions });

  try {
    const model = process.env.AI_GATEWAY_MODEL?.trim() || "openai/gpt-5.4-mini";
    const { output } = await generateText({
      model,
      output: Output.object({ schema: articleAnalysisSchema }),
      reasoning: "low",
      maxOutputTokens: 700,
      prompt: `You are the senior digital editor of a Lebanese political party newsroom. Analyze the article and return a publishable headline plus editable metadata tags.

HEADLINE RULES
- Write the headline in ${languageName(language)}.
- Identify the actual news event, principal action, institution, region and key actor. Do not copy or truncate the article's opening sentence.
- Do not headline ceremony mechanics such as "the event began with the anthem", attendance lists, greetings, or the first quotation unless that is genuinely the news.
- For a party activity, name the event and place directly. Example: "قداس شهداء منطقة عاليه في القوات اللبنانية".
- For a handover event, a good pattern is: "تسلّم وتسليم في منسقية عاليه بين طوني بدر وسليم أبي ضاهر".
- For a ministerial position, lead with the decision and reason, not "in a press conference he said".
- Keep Arabic headlines normally between 6 and 14 words. Never end mid-sentence. Do not add quotation marks or labels such as "العنوان المقترح".

TAG RULES
- Return region tags in Arabic, including "عاليه" when the article concerns Aley.
- Return activity types in Arabic. Organizational ceremonies, chapter handovers and coordination meetings should include "نشاط حزبي".
- Return the full Arabic names of every materially involved named person: organizers, outgoing/incoming coordinators, principal speakers, MPs and ministers. For this text, never omit names merely because they are not MPs.
- For a statement, do not add a region unless a regional chapter or office issued the statement.
- Tags must be concise nouns, not sentences. Do not invent people absent from the article.

Channel: ${channel}
Current draft title (may be wrong): ${currentTitle || "none"}
Existing region hints: ${existing.regions.join(", ") || "none"}
Existing activity hints: ${existing.activityTypes.join(", ") || "none"}
Existing people hints: ${existing.people.join(", ") || "none"}

ARTICLE:
${body}`,
    });

    const title = sanitizeHeadline(output.title, language);
    const tags = {
      regions: unique([...deterministicTags.regions, ...output.regions], 8),
      activityTypes: unique([...deterministicTags.activityTypes, ...output.activityTypes], 8),
      people: unique([...deterministicTags.people, ...output.people], 16),
    };
    if (!isPlausibleHeadline(title, language)) throw new Error("AI returned an implausible headline.");
    return NextResponse.json({ title, ...tags, source: "ai" });
  } catch (error) {
    console.error("AI article analysis failed; using the newsroom fallback", error);
    if (!fallbackTitle) {
      return NextResponse.json({ error: "A reliable title could not be generated from this text." }, { status: 422 });
    }
    return NextResponse.json({ title: fallbackTitle, ...deterministicTags, source: "fallback" });
  }
}
