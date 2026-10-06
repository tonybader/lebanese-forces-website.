export type HomepageLanguage = "ar" | "en" | "fr";

export type HomepageLocalizedText = Record<HomepageLanguage, string>;

export type HomepageTextSection = {
  kicker: HomepageLocalizedText;
  title: HomepageLocalizedText;
  text: HomepageLocalizedText;
};

export type HomepageNavItem = { id: string; label: HomepageLocalizedText };
export type HomepageStat = { id: string; value: string; label: HomepageLocalizedText };
export type HomepageValueCard = { id: string; title: HomepageLocalizedText; text: HomepageLocalizedText };
export type HomepageSocialLinks = {
  facebook: string;
  instagram: string;
  x: string;
  youtube: string;
  newsWebsite: string;
};
export type HomepagePerson = {
  slug: string;
  name: HomepageLocalizedText;
  office: HomepageLocalizedText;
  socials: { x: string; instagram: string; facebook: string };
};
export type HomepageInterfaceText = {
  historyCta: HomepageLocalizedText;
  mediaCta: HomepageLocalizedText;
  allNews: HomepageLocalizedText;
  bioLink: HomepageLocalizedText;
  leadershipCta: HomepageLocalizedText;
  songsTitle: HomepageLocalizedText;
  videosTitle: HomepageLocalizedText;
  photosTitle: HomepageLocalizedText;
  contactKicker: HomepageLocalizedText;
  contactTitle: HomepageLocalizedText;
  contactText: HomepageLocalizedText;
};

export type HomepageContent = {
  updatedAt: string;
  navigation: HomepageNavItem[];
  stats: HomepageStat[];
  values: HomepageValueCard[];
  interfaceText: HomepageInterfaceText;
  socials: HomepageSocialLinks;
  people?: HomepagePerson[];
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
    socials: { x: string; instagram: string; facebook: string };
  };
  leadership: HomepageTextSection;
  publications: HomepageTextSection;
  media: HomepageTextSection;
  footer: {
    line: HomepageLocalizedText;
  };
};

export type HomepageSectionKey =
  | "navigation"
  | "hero"
  | "highlights"
  | "interface"
  | "news"
  | "vision"
  | "history"
  | "president"
  | "leadership"
  | "people"
  | "publications"
  | "media"
  | "footer";

export function homepageText(
  value: HomepageLocalizedText,
  language: HomepageLanguage,
): string {
  return value[language]?.trim() || value.ar?.trim() || value.en?.trim() || value.fr?.trim() || "";
}
