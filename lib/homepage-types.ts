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
  imageUrl: string;
  summary: HomepageLocalizedText;
  bio: HomepageLocalizedText;
  socials: { x: string; instagram: string; facebook: string };
};
export type HomepageHistoryMilestone = {
  id: string;
  year: string;
  title: HomepageLocalizedText;
  body: HomepageLocalizedText;
  imageUrl: string;
};
export type HomepageSecretariatMember = {
  id: string;
  name: HomepageLocalizedText;
  role: HomepageLocalizedText;
  imageUrl: string;
};
export type HomepageSupportSection = {
  kicker: HomepageLocalizedText;
  title: HomepageLocalizedText;
  text: HomepageLocalizedText;
  buttonLabel: HomepageLocalizedText;
  url: string;
};
export type HomepagePresidentMilestone = {
  id: string;
  year: string;
  title: HomepageLocalizedText;
  text: HomepageLocalizedText;
};
export type HomepagePresidentPage = {
  backLabel: HomepageLocalizedText;
  kicker: HomepageLocalizedText;
  title: HomepageLocalizedText;
  role: HomepageLocalizedText;
  intro: HomepageLocalizedText;
  storyTitle: HomepageLocalizedText;
  story: HomepageLocalizedText;
  timelineTitle: HomepageLocalizedText;
  sourceLabel: HomepageLocalizedText;
  sourceUrl: string;
  socialsLabel: HomepageLocalizedText;
  milestones: HomepagePresidentMilestone[];
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
  support: HomepageSupportSection;
  vision: HomepageTextSection;
  news: HomepageTextSection;
  history: HomepageTextSection;
  historyTimeline: HomepageHistoryMilestone[];
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
  presidentPage: HomepagePresidentPage;
  leadership: HomepageTextSection;
  secretariat: HomepageSecretariatMember[];
  publications: HomepageTextSection;
  media: HomepageTextSection;
  footer: {
    line: HomepageLocalizedText;
  };
};

export type HomepageSectionKey =
  | "navigation"
  | "hero"
  | "support"
  | "highlights"
  | "interface"
  | "news"
  | "vision"
  | "history"
  | "president"
  | "presidentPage"
  | "leadership"
  | "secretariat"
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
