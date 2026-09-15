export type ArticleLanguage = "ar" | "en" | "fr";

export type LocalizedArticleText = {
  ar: string;
  en: string;
  fr: string;
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
  externalUrl?: string;
};

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
  return article.externalUrl || `/news/${encodeURIComponent(article.slug)}`;
}
