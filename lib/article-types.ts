export type ArticleLanguage = "ar" | "en" | "fr";

export const ARTICLE_CHANNELS = [
  "statements",
  "positions",
  "party",
  "diaspora",
] as const;

export type ArticleChannel = (typeof ARTICLE_CHANNELS)[number];
export type ArticleTagKind = "region" | "activity" | "person";

export type LocalizedArticleText = {
  ar: string;
  en: string;
  fr: string;
};

export type ArticleImagePosition = {
  x: number;
  y: number;
};

export type Article = {
  id: string;
  slug: string;
  publishedAt: string;
  title: LocalizedArticleText;
  body: LocalizedArticleText;
  category: LocalizedArticleText;
  imageUrl: string;
  imageAlt: LocalizedArticleText;
  imagePosition?: ArticleImagePosition;
  externalUrl?: string;
  sourceUrl?: string;
  pinned?: boolean;
  channel?: ArticleChannel;
  regions?: string[];
  activityTypes?: string[];
  people?: string[];
};

export function getArticleImagePosition(
  article: Pick<Article, "imagePosition">,
): ArticleImagePosition {
  const x = Number(article.imagePosition?.x);
  const y = Number(article.imagePosition?.y);
  return {
    x: Number.isFinite(x) ? Math.min(100, Math.max(0, x)) : 50,
    y: Number.isFinite(y) ? Math.min(100, Math.max(0, y)) : 50,
  };
}

export function articleImageObjectPosition(
  article: Pick<Article, "imagePosition">,
): string {
  const position = getArticleImagePosition(article);
  return `${position.x}% ${position.y}%`;
}

const channelLabels: Record<ArticleChannel, LocalizedArticleText> = {
  statements: {
    ar: "البيانات",
    en: "Statements",
    fr: "Communiqués",
  },
  positions: {
    ar: "مواقف النواب والوزراء",
    en: "MPs & ministers’ positions",
    fr: "Positions des députés et ministres",
  },
  party: {
    ar: "أخبار ونشاطات الحزب",
    en: "Party news & activities",
    fr: "Actualités et activités du parti",
  },
  diaspora: {
    ar: "نشاطات الانتشار",
    en: "Diaspora activities",
    fr: "Activités de la diaspora",
  },
};

const tagLabels: Record<ArticleTagKind, LocalizedArticleText> = {
  region: { ar: "المنطقة", en: "Region", fr: "Région" },
  activity: { ar: "نوع النشاط", en: "Activity", fr: "Activité" },
  person: { ar: "الشخصية", en: "Public figure", fr: "Personnalité" },
};

export function isArticleChannel(value: unknown): value is ArticleChannel {
  return ARTICLE_CHANNELS.includes(value as ArticleChannel);
}

export function getArticleChannel(article: Article): ArticleChannel {
  if (isArticleChannel(article.channel)) return article.channel;

  // Keep the original seed stories in useful sections until an editor resaves them.
  if (article.id === "seed-annual-mass-2026") return "diaspora";
  if (article.id === "seed-state-decision-2026") return "statements";
  return "party";
}

export function articleChannelText(
  channel: ArticleChannel,
  language: ArticleLanguage,
): string {
  return articleText(channelLabels[channel], language);
}

export function articleChannelCategory(channel: ArticleChannel): LocalizedArticleText {
  return { ...channelLabels[channel] };
}

export function articleTagKindText(
  kind: ArticleTagKind,
  language: ArticleLanguage,
): string {
  return articleText(tagLabels[kind], language);
}

export function articleChannelHref(channel: ArticleChannel): string {
  return `/news?channel=${encodeURIComponent(channel)}`;
}

export function articleTagHref(kind: ArticleTagKind, value: string): string {
  return `/news?${kind}=${encodeURIComponent(value)}`;
}

export function articleText(
  value: LocalizedArticleText,
  language: ArticleLanguage,
): string {
  return value[language]?.trim() || value.ar?.trim() || value.en?.trim() || value.fr?.trim() || "";
}

export function formatArticleDate(
  publishedAt: string,
  language: ArticleLanguage,
): string {
  const locales = { ar: "ar-LB", en: "en-GB", fr: "fr-FR" } as const;
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(locales[language], {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Beirut",
  }).format(date);
}

export function articleHref(article: Article): string {
  return `/news/${encodeURIComponent(article.slug)}`;
}
