import type { ArticleChannel, ArticleLanguage } from "@/lib/article-types";

export type HeadlineInput = {
  body: string;
  language: ArticleLanguage;
  channel: ArticleChannel;
  people?: string[];
};

const wordLimits: Record<ArticleLanguage, number> = { ar: 14, en: 16, fr: 16 };

function cleanArticleText(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/<[^>]*>/g, " ")
    .replace(/https?:\/\/\S+|\S+@\S+/g, " ")
    .replace(/\r/g, "")
    .replace(/[\t ]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function sanitizeHeadline(value: string, language: ArticleLanguage): string {
  const firstLine = value
    .replace(/```(?:json)?|```/gi, "")
    .replace(/\*\*/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean) || "";
  const withoutLabel = firstLine.replace(
    /^(?:العنوان(?: المقترح)?|headline|suggested headline|titre(?: proposé)?)\s*[:：-]\s*/i,
    "",
  );
  const words = withoutLabel
    .replace(/^["'“”«»\s]+|["'“”«»\s.!?؟؛،]+$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
  let headline = words.slice(0, wordLimits[language]).join(" ");
  if (headline.length > 150) headline = headline.slice(0, 151).replace(/\s+\S*$/, "");
  return headline.replace(/[\s.!?؟؛،]+$/g, "").trim();
}

function shortArabicActor(value: string): string {
  const cleaned = value
    .replace(/^(?:المكتب الإعلامي ل|المكتب الاعلامي ل)/, "")
    .replace(/^(?:رئيس حزب القوات اللبنانية|رئيس القوات اللبنانية|النائب|الوزير|الدكتور|الشيخ)\s+/, "")
    .replace(/[،,:].*$/, "")
    .trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  return words.length > 4 ? words.slice(-2).join(" ") : cleaned;
}

function extractArabicActor(text: string, people: string[]): string {
  if (people[0]?.trim()) return shortArabicActor(people[0]);
  const issuer = text.match(
    /صدر عن\s+(.{3,90}?)(?=،|,|\s+البيان\s+التالي|\s+التصريح\s+التالي|\s+ما يلي|:)/u,
  )?.[1];
  if (issuer) return shortArabicActor(issuer);
  const attributed = text.match(
    /(?:قال|أكد|أكّد|شدد|شدّد|أعلن|اعتبر|أوضح|لفت|دعا|حذّر|حذر)\s+(.{3,55}?)(?=\s+(?:إن|أن|ان|خلال|في|لدى)|،|,|:)/u,
  )?.[1];
  return attributed ? shortArabicActor(attributed) : "";
}

function extractArabicReplyTarget(text: string): string {
  const match = text.match(
    /(?:رد(?:ًا|ا)?\s+على|يرد(?:ّ)?\s+على|ما قاله|تصريحات|كلام)\s+(?:الرئيس|الشيخ|النائب|الوزير|السيد|الدكتور)?\s*([\p{L}][\p{L}\s]{1,36}?)(?=،|,|\.|:|«|")/u,
  )?.[1];
  return match?.replace(/\s+/g, " ").trim() || "";
}

function arabicTopic(text: string): string {
  const topics = [
    { label: "السلاح ودور الدولة", terms: ["السلاح", "الدولة", "قرار الحرب", "القرار الاستراتيجي"] },
    { label: "الانتخابات النيابية", terms: ["الانتخابات", "قانون الانتخاب", "اقتراع"] },
    { label: "السيادة والقرار الوطني", terms: ["السيادة", "القرار الوطني", "سيادة"] },
    { label: "الأوضاع الاقتصادية والمعيشية", terms: ["الاقتصاد", "المعيشة", "الفجوة المالية", "الأوضاع الاقتصادية"] },
    { label: "العدوان والوضع في الجنوب", terms: ["العدوان", "إسرائيل", "الجنوب", "تحرير الأرض"] },
  ];
  let best = { label: "", score: 0 };
  for (const topic of topics) {
    const score = topic.terms.reduce((total, term) => total + text.split(term).length - 1, 0);
    if (score > best.score) best = { label: topic.label, score };
  }
  return best.label;
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?:\n+|(?<=[.!?؟؛])\s+)/u)
    .map((sentence) => sentence.replace(/^[-•*\d.)\s]+/, "").replace(/\s+/g, " ").trim())
    .filter((sentence) => sentence.length >= 18 && sentence.length <= 320)
    .slice(0, 24);
}

function fallbackSentence(text: string, language: ArticleLanguage): string {
  const boilerplate = /^(?:صدر عن|يتم تداول|في إطار|للمزيد|تابعونا|source|read more|dans le cadre|pour en savoir plus)/i;
  const actionWords: Record<ArticleLanguage, string[]> = {
    ar: ["أكد", "أكّد", "أعلن", "دعا", "حذّر", "طالب", "شدد", "شدّد", "اعتبر", "أوضح", "افتتح", "زار", "التقى", "نظّم", "نظمت"],
    en: ["said", "announced", "called", "warned", "urged", "confirmed", "met", "visited", "launched", "organized"],
    fr: ["a déclaré", "a annoncé", "a appelé", "a averti", "a confirmé", "a rencontré", "a visité", "a lancé", "a organisé"],
  };
  const ranked = splitSentences(text).map((sentence, index) => ({
    sentence,
    score:
      (actionWords[language].some((verb) => sentence.toLocaleLowerCase().includes(verb)) ? 6 : 0) +
      Math.max(0, 5 - index) -
      (boilerplate.test(sentence) ? 8 : 0) +
      (sentence.length >= 45 && sentence.length <= 180 ? 3 : 0),
  }));
  ranked.sort((first, second) => second.score - first.score);
  return ranked[0]?.sentence || text;
}

function arabicHeadline(text: string, channel: ArticleChannel, people: string[]): string {
  const actor = extractArabicActor(text, people);
  const replyTarget = extractArabicReplyTarget(text);
  const topic = arabicTopic(text);

  if (/منسوب(?:ة|ات)?/.test(text) && /(?:لم يدل|لم يصرح|ينفي|نفي|لا صحة)/.test(text)) {
    const subject = actor || "الجهة المعنية";
    return `${/(?:المكتب الإعلامي|المكتب الاعلامي)/.test(text) ? `مكتب ${subject}` : subject} ينفي المواقف والتصريحات المنسوبة إليه`;
  }
  if (actor && replyTarget) {
    return `${actor} يردّ على ${replyTarget}${topic ? ` بشأن ${topic}` : ""}`;
  }

  const eventMatch = text.match(
    /((?:نظّم|نظم|نظّمت|نظمت|أقام|أقامت|افتتح|افتتحت|زار|زارت|التقى|التقت|شارك|شاركت)\s+[^.!؟\n]{12,150})/u,
  )?.[1];
  if ((channel === "party" || channel === "diaspora") && eventMatch) return eventMatch;

  const strongest = fallbackSentence(text, "ar")
    .replace(/^(?:وقال|وأكّد|وأكد|وشدّد|وشدد|واعتبر|وأوضح|ولفت)\s+/, "")
    .replace(/^(?:أن|إن|ان)\s+/, "")
    .trim();
  if (actor && !strongest.startsWith(actor)) return `${actor}: ${strongest}`;
  return strongest;
}

export function generateFallbackHeadline(input: HeadlineInput): string {
  const text = cleanArticleText(input.body);
  if (text.length < 12) return "";
  if (input.language === "ar") {
    return sanitizeHeadline(arabicHeadline(text, input.channel, input.people || []), "ar");
  }
  const actor = input.people?.[0]?.trim() || "";
  const sentence = fallbackSentence(text, input.language)
    .replace(/^(?:according to|in a statement|dans un communiqué|selon)\s+/i, "")
    .trim();
  return sanitizeHeadline(actor && !sentence.toLocaleLowerCase().startsWith(actor.toLocaleLowerCase()) ? `${actor}: ${sentence}` : sentence, input.language);
}

export function isPlausibleHeadline(value: string, language: ArticleLanguage): boolean {
  const headline = sanitizeHeadline(value, language);
  if (headline.length < 10 || headline.split(/\s+/).length < 3) return false;
  if (language === "ar") return /[\u0600-\u06ff]/.test(headline);
  return /[A-Za-zÀ-ÿ]/.test(headline);
}
