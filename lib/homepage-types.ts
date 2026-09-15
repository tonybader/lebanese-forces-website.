export type HomepageLanguage = "ar" | "en" | "fr";

export type HomepageLocalizedText = Record<HomepageLanguage, string>;

export type HomepageTextSection = {
  kicker: HomepageLocalizedText;
  title: HomepageLocalizedText;
  text: HomepageLocalizedText;
};

export type HomepageContent = {
  updatedAt: string;
  hero: {
    eyebrow: HomepageLocalizedText;
    title: HomepageLocalizedText;
    intro: HomepageLocalizedText;
    imageUrl: string;
    imageAlt: HomepageLocalizedText;
  };
  vision: HomepageTextSection;
  news: HomepageTextSection;
  history: HomepageTextSection;
  president: {
    kicker: HomepageLocalizedText;
    title: HomepageLocalizedText;
    role: HomepageLocalizedText;
    bio: HomepageLocalizedText;
    bio2: HomepageLocalizedText;
    imageUrl: string;
    imageAlt: HomepageLocalizedText;
    imageCredit: HomepageLocalizedText;
  };
  leadership: HomepageTextSection;
  publications: HomepageTextSection;
  media: HomepageTextSection;
  footer: {
    line: HomepageLocalizedText;
  };
};

export type HomepageSectionKey =
  | "hero"
  | "news"
  | "vision"
  | "history"
  | "president"
  | "leadership"
  | "publications"
  | "media"
  | "footer";

export function homepageText(
  value: HomepageLocalizedText,
  language: HomepageLanguage,
): string {
  return value[language]?.trim() || value.ar?.trim() || value.en?.trim() || value.fr?.trim() || "";
}
