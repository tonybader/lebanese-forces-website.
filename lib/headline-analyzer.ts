import type { ArticleChannel, ArticleLanguage } from "@/lib/article-types";

export type HeadlineInput = {
  body: string;
  language: ArticleLanguage;
  channel: ArticleChannel;
  people?: string[];
  regions?: string[];
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

function searchableArabic(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
    .replace(/ـ/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/\s+/g, " ")
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

function containsAny(text: string, terms: string[]): boolean {
  return terms.some((term) => text.includes(term));
}

function cleanArabicRegion(value: string): string {
  return searchableArabic(value)
    .replace(/^(?:منسقية\s+)?(?:منطقة|قضاء|اقليم)\s+/, "")
    .replace(/\s+(?:في|ب)?\s*القوات اللبنانية.*$/, "")
    .replace(/[،,:;؛.].*$/, "")
    .trim();
}

function extractArabicRegion(text: string, regions: string[]): string {
  const taggedRegion = regions.map(cleanArabicRegion).find(Boolean);
  if (taggedRegion) return taggedRegion;

  const searchable = searchableArabic(text);
  const regionalChapter = searchable.match(
    /(?:منسقية\s+)?منطقة\s+([\p{L}][\p{L}\s-]{1,45}?)(?=\s+(?:في\s+القوات اللبنانية|بالقوات اللبنانية|بالتعاون|،|,|:|اقامت|نظمت|نظم|احيت|احيا))/u,
  )?.[1];
  if (regionalChapter) return cleanArabicRegion(regionalChapter);

  const coordinator = searchable.match(
    /(?:منسق|منسقة)\s+(?:منطقة\s+)?([\p{L}][\p{L}\s-]{1,35}?)(?=\s+(?:في\s+القوات اللبنانية|بالقوات اللبنانية|،|,|:))/u,
  )?.[1];
  return coordinator ? cleanArabicRegion(coordinator) : "";
}

function polishArabicName(value: string): string {
  return value
    .replace(/^(?:المنسق|النائب|الوزير|الدكتور|الاستاذ)\s+/, "")
    .replace(/(^|\s)ابي(?=\s|$)/g, "$1أبي")
    .replace(/(^|\s)ابو(?=\s|$)/g, "$1أبو")
    .replace(/\s+/g, " ")
    .trim();
}

function conciseArabicOrganizationalHeadline(
  text: string,
  channel: ArticleChannel,
  regions: string[],
): string {
  if (channel !== "party" && channel !== "diaspora") return "";

  const searchable = searchableArabic(text);
  if (!/تسلم\s+وتسليم/.test(searchable)) return "";

  const region = extractArabicRegion(text, regions);
  const names = searchable.match(
    /بين\s+(?:المنسق\s+)?السابق\s+([\p{L}\s]{2,35}?)\s+وخلفه\s+(?:المنسق\s+)?([\p{L}\s]{2,35}?)(?=\s+(?:وذلك|في\s+مقر|،|,|\.|$))/u,
  );
  const previousCoordinator = names?.[1] ? polishArabicName(names[1]) : "";
  const newCoordinator = names?.[2] ? polishArabicName(names[2]) : "";
  const location = region ? ` في منسقية ${region}` : "";

  if (previousCoordinator && newCoordinator) {
    return `تسلّم وتسليم${location} بين ${previousCoordinator} و${newCoordinator}`;
  }
  return region ? `تسلّم وتسليم في منسقية ${region}` : "حفل تسلّم وتسليم حزبي";
}

function conciseArabicEventHeadline(text: string, channel: ArticleChannel, regions: string[]): string {
  if (channel !== "party" && channel !== "diaspora") return "";

  const searchable = searchableArabic(text);
  const region = extractArabicRegion(text, regions);

  if (/قداس/.test(searchable) && /شهداء|شهيد/.test(searchable)) {
    return region
      ? `قداس شهداء منطقة ${region} في القوات اللبنانية`
      : "قداس لشهداء القوات اللبنانية";
  }

  if (channel === "diaspora" && /عشاء/.test(searchable) && /دعم/.test(searchable) && /طلاب/.test(searchable)) {
    return region
      ? `عشاء للقوات اللبنانية في ${region} لدعم الطلاب اللبنانيين`
      : "عشاء اغترابي لدعم الطلاب اللبنانيين";
  }

  const eventTypes = [
    { match: "قداس", label: "قداس" },
    { match: "حفل", label: "حفل" },
    { match: "احتفال", label: "احتفال" },
    { match: "ندوة", label: "ندوة" },
    { match: "موتمر", label: "مؤتمر" },
    { match: "لقاء", label: "لقاء" },
    { match: "زيارة", label: "زيارة" },
    { match: "عشاء", label: "عشاء" },
  ];
  const eventType = eventTypes.find((type) => searchable.includes(type.match))?.label;
  if (!eventType || !region) return "";
  return channel === "diaspora"
    ? `${eventType} القوات اللبنانية في ${region}`
    : `${eventType} القوات اللبنانية في منطقة ${region}`;
}

function conciseArabicNewsHeadline(
  text: string,
  channel: ArticleChannel,
  actor: string,
  people: string[],
  regions: string[],
): string {
  const searchable = searchableArabic(text);
  const subject = actor || (searchable.includes("القوات اللبنانية") ? "القوات اللبنانية" : "");
  const region = extractArabicRegion(text, regions);
  const secondPerson = people[1]?.trim() ? shortArabicActor(people[1]) : "";

  if (
    subject &&
    containsAny(searchable, ["الاعتكاف", "معتكف", "يعتكف"]) &&
    containsAny(searchable, ["جلسات مجلس الوزراء", "جلسات الحكومة"])
  ) {
    if (containsAny(searchable, ["كهرباء لبنان", "قطاع الكهرباء"])) {
      return `${subject} يعتكف عن جلسات مجلس الوزراء حتى معالجة مستحقات كهرباء لبنان`;
    }
    return `${subject} يعتكف عن جلسات مجلس الوزراء حتى اتخاذ القرارات المطلوبة`;
  }

  if (subject && /رفض|يرفض/.test(searchable) && /تعديل/.test(searchable) && /تاجيل/.test(searchable) && /الانتخابات/.test(searchable)) {
    return `${subject} يرفض أي تعديل يؤجل الانتخابات النيابية`;
  }

  if (subject && /حذر|يحذر/.test(searchable) && /تاجيل/.test(searchable) && /الانتخابات/.test(searchable)) {
    return `${subject} يحذّر من تأجيل الانتخابات النيابية`;
  }

  if (
    subject &&
    containsAny(searchable, ["دعا", "يدعو", "طالب", "يطالب"]) &&
    /الانتخابات/.test(searchable) &&
    containsAny(searchable, ["موعدها", "في الموعد", "ضمن المهل"])
  ) {
    return `${subject} يدعو إلى إجراء الانتخابات النيابية في موعدها`;
  }

  if (
    subject &&
    containsAny(searchable, ["دعا", "يدعو", "طالب", "يطالب"]) &&
    /السلاح/.test(searchable) &&
    containsAny(searchable, ["بيد الدولة", "حصر السلاح", "الموسسات الشرعية"])
  ) {
    return `${subject} يدعو إلى حصر السلاح بيد الدولة`;
  }

  if (
    subject &&
    /اصلاح/.test(searchable) &&
    /اموال المودعين/.test(searchable) &&
    containsAny(searchable, ["طالب", "يطالب", "دعا", "يدعو"])
  ) {
    return `${subject} يطالب بإقرار الإصلاحات لحماية أموال المودعين`;
  }

  if (
    subject === "القوات اللبنانية" &&
    /دعم الجيش/.test(searchable) &&
    /السلاح/.test(searchable) &&
    containsAny(searchable, ["بيد الدولة", "حصرية السلاح", "حصر السلاح"])
  ) {
    return "القوات اللبنانية تؤكد دعم الجيش وحصرية السلاح بيد الدولة";
  }

  if (
    subject === "القوات اللبنانية" &&
    containsAny(searchable, ["ادانت", "تدين", "استنكرت", "تستنكر"]) &&
    /الاعتداء/.test(searchable) &&
    /الجيش اللبناني/.test(searchable)
  ) {
    return "القوات اللبنانية تدين الاعتداء على الجيش اللبناني";
  }

  if (
    subject &&
    containsAny(searchable, ["اعلن", "يطلق", "اطلق"]) &&
    /خطة/.test(searchable) &&
    /التغذية/.test(searchable) &&
    /الكهرباء/.test(searchable)
  ) {
    return `${subject} يعلن خطة لزيادة التغذية الكهربائية`;
  }

  if (
    subject &&
    /مناقصة/.test(searchable) &&
    /معامل/.test(searchable) &&
    /الطاقة المتجددة/.test(searchable)
  ) {
    return `${subject} يعلن مناقصة لمعامل إنتاج الكهرباء بالطاقة المتجددة`;
  }

  if (
    subject === "القوات اللبنانية" &&
    containsAny(searchable, ["اطلقت", "تطلق", "اطلاق"]) &&
    /حملة/.test(searchable) &&
    containsAny(searchable, ["العائلات", "العايلات"]) &&
    /الجنوب/.test(searchable)
  ) {
    return "القوات اللبنانية تطلق حملة لدعم العائلات في الجنوب";
  }

  if (
    subject && secondPerson &&
    containsAny(searchable, ["التقي", "اجتمع", "استقبل"]) &&
    containsAny(searchable, ["استجرار الكهرباء", "شراء الكهرباء"]) &&
    /سوريا/.test(searchable)
  ) {
    return `${subject} يبحث مع ${secondPerson} استجرار الكهرباء عبر سوريا`;
  }

  if (
    subject && secondPerson &&
    containsAny(searchable, ["التقي", "اجتمع", "استقبل"]) &&
    containsAny(searchable, ["التطورات السياسية", "الاوضاع السياسية", "الملفات السياسية"])
  ) {
    return `${subject} يبحث مع ${secondPerson} التطورات السياسية`;
  }

  if (
    subject && region && channel === "party" &&
    containsAny(searchable, ["زار", "زارت", "زيارة"]) &&
    !containsAny(searchable, ["لقاء", "ندوة", "مؤتمر"])
  ) {
    return `زيارة ${subject} إلى منطقة ${region}`;
  }

  return "";
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
    .map((sentence) => {
      const cleaned = sentence.replace(/^[-•*\d.)\s]+/, "").replace(/\s+/g, " ").trim();
      return cleaned.length > 320 ? cleaned.slice(0, 321).replace(/\s+\S*$/, "") : cleaned;
    })
    .filter((sentence) => sentence.length >= 18)
    .slice(0, 24);
}

function fallbackSentence(text: string, language: ArticleLanguage): string {
  const boilerplate = /^(?:صدر عن|يتم تداول|في إطار|للمزيد|تابعونا|source|read more|dans le cadre|pour en savoir plus)/i;
  const actionWords: Record<ArticleLanguage, string[]> = {
    ar: ["قرر", "قرّر", "أكد", "أكّد", "أعلن", "دعا", "حذّر", "طالب", "رفض", "شدد", "شدّد", "اعتبر", "أوضح", "افتتح", "زار", "زارت", "التقى", "نظّم", "نظمت"],
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

function arabicHeadline(text: string, channel: ArticleChannel, people: string[], regions: string[]): string {
  const organizationalHeadline = conciseArabicOrganizationalHeadline(text, channel, regions);
  if (organizationalHeadline) return organizationalHeadline;

  const searchable = searchableArabic(text);
  const actor = extractArabicActor(text, people) || (searchable.includes("القوات اللبنانية") ? "القوات اللبنانية" : "");
  const replyTarget = extractArabicReplyTarget(text);
  const topic = arabicTopic(text);

  if (/منسوب(?:ة|ات)?/.test(text) && /(?:لم يدل|لم يصرح|ينفي|نفي|لا صحة)/.test(text)) {
    const subject = actor || "الجهة المعنية";
    return `${/(?:المكتب الإعلامي|المكتب الاعلامي)/.test(text) ? `مكتب ${subject}` : subject} ينفي المواقف والتصريحات المنسوبة إليه`;
  }
  if (actor && replyTarget) {
    return `${actor} يردّ على ${replyTarget}${topic ? ` بشأن ${topic}` : ""}`;
  }

  const newsHeadline = conciseArabicNewsHeadline(text, channel, actor, people, regions);
  if (newsHeadline) return newsHeadline;

  const eventHeadline = conciseArabicEventHeadline(text, channel, regions);
  if (eventHeadline) return eventHeadline;

  const strongest = fallbackSentence(text, "ar")
    .replace(/^و(?=(?:قال|أكد|أكّد|شدد|شدّد|اعتبر|أوضح|لفت|دعا|حذر|حذّر|طالب|رفض))/, "")
    .replace(/^(?:أن|إن|ان)\s+/, "")
    .trim();
  if (actor && !searchableArabic(strongest).includes(searchableArabic(actor))) return `${actor}: ${strongest}`;
  return strongest;
}

export function generateFallbackHeadline(input: HeadlineInput): string {
  const text = cleanArticleText(input.body);
  if (text.length < 12) return "";
  if (input.language === "ar") {
    return sanitizeHeadline(arabicHeadline(text, input.channel, input.people || [], input.regions || []), "ar");
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
