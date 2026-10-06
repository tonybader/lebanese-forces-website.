import "server-only";

import seedHomepageData from "@/data/homepage.json";
import type {
  HomepageContent,
  HomepageHistoryMilestone,
  HomepageInterfaceText,
  HomepageLocalizedText,
  HomepagePerson,
  HomepagePresidentPage,
  HomepagePresidentMilestone,
  HomepageTextSection,
} from "@/lib/homepage-types";
import { publicProfiles } from "@/lib/people";

const DEFAULT_REPOSITORY = "tonybader/lebanese-forces-website.";
const DEFAULT_BRANCH = "main";
const HOMEPAGE_PATH = "data/homepage.json";
const MAX_IMAGE_BYTES = 3_500_000;

type GitHubFile = { content?: string; encoding?: string; sha?: string };
type ImageUpload = { bytes: Uint8Array; contentType: string };

export type HomepageUpdateInput = {
  content: HomepageContent;
  heroImage?: ImageUpload;
  presidentImage?: ImageUpload;
  personImages?: Record<string, ImageUpload>;
  historyImages?: Record<string, ImageUpload>;
};

function repositoryParts(): { owner: string; repository: string; branch: string } {
  const configured = process.env.CONTENT_REPOSITORY?.trim() || DEFAULT_REPOSITORY;
  const separator = configured.indexOf("/");
  if (separator < 1 || separator === configured.length - 1) {
    throw new Error("CONTENT_REPOSITORY must use the owner/repository format.");
  }
  return {
    owner: configured.slice(0, separator),
    repository: configured.slice(separator + 1),
    branch: process.env.CONTENT_BRANCH?.trim() || DEFAULT_BRANCH,
  };
}

function githubHeaders(authenticated = false): HeadersInit {
  const token = process.env.GITHUB_CONTENT_TOKEN;
  if (authenticated && !token) {
    throw new Error("Homepage publishing has not been connected to GitHub yet.");
  }
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "lebanese-forces-website",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function contentApiUrl(path: string): string {
  const { owner, repository, branch } = repositoryParts();
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
}

function text(value: unknown, fallback: string, maximum = 5000): string {
  return typeof value === "string" ? value.trim().slice(0, maximum) : fallback;
}

function localized(
  value: unknown,
  fallback: HomepageLocalizedText,
  maximum = 5000,
): HomepageLocalizedText {
  const candidate = value && typeof value === "object" ? value as Partial<HomepageLocalizedText> : {};
  return {
    ar: text(candidate.ar, fallback.ar, maximum),
    en: text(candidate.en, fallback.en, maximum),
    fr: text(candidate.fr, fallback.fr, maximum),
  };
}

function section(value: unknown, fallback: HomepageTextSection): HomepageTextSection {
  const candidate = value && typeof value === "object" ? value as Partial<HomepageTextSection> : {};
  return {
    kicker: localized(candidate.kicker, fallback.kicker, 120),
    title: localized(candidate.title, fallback.title, 500),
    text: localized(candidate.text, fallback.text, 5000),
  };
}

function imageUrl(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim();
  if (cleaned.startsWith("/") || cleaned.startsWith("https://")) return cleaned.slice(0, 2000);
  return fallback;
}

function linkUrl(value: unknown, fallback = ""): string {
  if (typeof value !== "string") return fallback;
  const cleaned = value.trim().slice(0, 2000);
  return !cleaned || cleaned.startsWith("https://") || cleaned.startsWith("/") ? cleaned : fallback;
}

function defaultPeople(): HomepagePerson[] {
  return publicProfiles.map((profile) => ({
    slug: profile.slug,
    name: profile.name,
    office: profile.office,
    imageUrl: profile.imageUrl,
    summary: profile.summary,
    bio: {
      ar: [profile.summary.ar, ...profile.highlights.map((item) => item.ar)].join("\n\n"),
      en: [profile.summary.en, ...profile.highlights.map((item) => item.en)].join("\n\n"),
      fr: [profile.summary.fr, ...profile.highlights.map((item) => item.fr)].join("\n\n"),
    },
    socials: {
      x: profile.socials?.x || "",
      instagram: profile.socials?.instagram || "",
      facebook: profile.socials?.facebook || "",
    },
  }));
}

function normalizePeople(value: unknown, fallback?: HomepagePerson[]): HomepagePerson[] {
  const candidate = Array.isArray(value) ? value : [];
  const defaults = fallback?.length ? fallback : defaultPeople();
  return defaults.map((person) => {
    const override = candidate.find((item) => item && typeof item === "object" && (item as Partial<HomepagePerson>).slug === person.slug) as Partial<HomepagePerson> | undefined;
    const socials: Partial<HomepagePerson["socials"]> = override?.socials && typeof override.socials === "object" ? override.socials : {};
    return {
      slug: person.slug,
      name: localized(override?.name, person.name, 160),
      office: localized(override?.office, person.office, 300),
      imageUrl: imageUrl(override?.imageUrl, person.imageUrl),
      summary: localized(override?.summary, person.summary, 2000),
      bio: localized(override?.bio, person.bio, 12_000),
      socials: {
        x: linkUrl(socials.x, person.socials.x),
        instagram: linkUrl(socials.instagram, person.socials.instagram),
        facebook: linkUrl(socials.facebook, person.socials.facebook),
      },
    };
  });
}

function identifier(value: unknown, fallback: string): string {
  const cleaned = text(value, fallback, 100).replace(/[^a-zA-Z0-9_-]/g, "-");
  return cleaned || fallback;
}

function normalizeHistoryTimeline(
  value: unknown,
  fallback: HomepageHistoryMilestone[],
): HomepageHistoryMilestone[] {
  const candidate = Array.isArray(value) ? value : [];
  const normalized = candidate.slice(0, 30).map((raw, index) => {
    const item = raw && typeof raw === "object" ? raw as Partial<HomepageHistoryMilestone> : {};
    const fallbackItem = fallback.find((entry) => entry.id === item.id) || fallback[index];
    return {
      id: identifier(item.id, fallbackItem?.id || `history-${index + 1}`),
      year: text(item.year, fallbackItem?.year || "", 40),
      title: localized(item.title, fallbackItem?.title || { ar: "", en: "", fr: "" }, 300),
      body: localized(item.body, fallbackItem?.body || { ar: "", en: "", fr: "" }, 5000),
      imageUrl: imageUrl(item.imageUrl, fallbackItem?.imageUrl || "/lf-logo.png"),
    };
  }).filter((item) => item.year && item.title.ar && item.body.ar);
  return normalized.length ? normalized : fallback;
}

function normalizePresidentMilestones(
  value: unknown,
  fallback: HomepagePresidentMilestone[],
): HomepagePresidentMilestone[] {
  const candidate = Array.isArray(value) ? value : [];
  const normalized = candidate.slice(0, 30).map((raw, index) => {
    const item = raw && typeof raw === "object" ? raw as Partial<HomepagePresidentMilestone> : {};
    const fallbackItem = fallback.find((entry) => entry.id === item.id) || fallback[index];
    return {
      id: identifier(item.id, fallbackItem?.id || `president-milestone-${index + 1}`),
      year: text(item.year, fallbackItem?.year || "", 40),
      title: localized(item.title, fallbackItem?.title || { ar: "", en: "", fr: "" }, 300),
      text: localized(item.text, fallbackItem?.text || { ar: "", en: "", fr: "" }, 3000),
    };
  }).filter((item) => item.year && item.title.ar && item.text.ar);
  return normalized.length ? normalized : fallback;
}

function normalizePresidentPage(value: unknown, fallback: HomepagePresidentPage): HomepagePresidentPage {
  const candidate = value && typeof value === "object" ? value as Partial<HomepagePresidentPage> : {};
  return {
    backLabel: localized(candidate.backLabel, fallback.backLabel, 160),
    kicker: localized(candidate.kicker, fallback.kicker, 160),
    title: localized(candidate.title, fallback.title, 300),
    role: localized(candidate.role, fallback.role, 600),
    intro: localized(candidate.intro, fallback.intro, 3000),
    storyTitle: localized(candidate.storyTitle, fallback.storyTitle, 300),
    story: localized(candidate.story, fallback.story, 20_000),
    timelineTitle: localized(candidate.timelineTitle, fallback.timelineTitle, 300),
    sourceLabel: localized(candidate.sourceLabel, fallback.sourceLabel, 300),
    sourceUrl: linkUrl(candidate.sourceUrl, fallback.sourceUrl),
    socialsLabel: localized(candidate.socialsLabel, fallback.socialsLabel, 300),
    milestones: normalizePresidentMilestones(candidate.milestones, fallback.milestones),
  };
}

export function normalizeHomepage(
  value: unknown,
  fallback: HomepageContent = seedHomepageData as HomepageContent,
): HomepageContent {
  const candidate = value && typeof value === "object" ? value as Partial<HomepageContent> : {};
  const hero: Partial<HomepageContent["hero"]> =
    candidate.hero && typeof candidate.hero === "object" ? candidate.hero : {};
  const president: Partial<HomepageContent["president"]> =
    candidate.president && typeof candidate.president === "object" ? candidate.president : {};
  const footer: Partial<HomepageContent["footer"]> =
    candidate.footer && typeof candidate.footer === "object" ? candidate.footer : {};
  const candidateSocials: Partial<HomepageContent["socials"]> = candidate.socials && typeof candidate.socials === "object" ? candidate.socials : {};
  const presidentSocials: Partial<HomepageContent["president"]["socials"]> = president.socials && typeof president.socials === "object" ? president.socials : {};
  const interfaceCandidate = candidate.interfaceText && typeof candidate.interfaceText === "object" ? candidate.interfaceText as Partial<HomepageInterfaceText> : {};
  const navigationCandidate = Array.isArray(candidate.navigation) ? candidate.navigation : [];
  const statsCandidate = Array.isArray(candidate.stats) ? candidate.stats : [];
  const valuesCandidate = Array.isArray(candidate.values) ? candidate.values : [];

  return {
    updatedAt: text(candidate.updatedAt, fallback.updatedAt, 80),
    navigation: fallback.navigation.map((item) => {
      const override = navigationCandidate.find((candidateItem) => candidateItem?.id === item.id);
      return { id: item.id, label: localized(override?.label, item.label, 100) };
    }),
    stats: fallback.stats.map((item) => {
      const override = statsCandidate.find((candidateItem) => candidateItem?.id === item.id);
      return {
        id: item.id,
        value: text(override?.value, item.value, 40),
        label: localized(override?.label, item.label, 160),
      };
    }),
    values: fallback.values.map((item) => {
      const override = valuesCandidate.find((candidateItem) => candidateItem?.id === item.id);
      return {
        id: item.id,
        title: localized(override?.title, item.title, 160),
        text: localized(override?.text, item.text, 1000),
      };
    }),
    interfaceText: {
      historyCta: localized(interfaceCandidate.historyCta, fallback.interfaceText.historyCta, 160),
      mediaCta: localized(interfaceCandidate.mediaCta, fallback.interfaceText.mediaCta, 160),
      allNews: localized(interfaceCandidate.allNews, fallback.interfaceText.allNews, 160),
      bioLink: localized(interfaceCandidate.bioLink, fallback.interfaceText.bioLink, 160),
      leadershipCta: localized(interfaceCandidate.leadershipCta, fallback.interfaceText.leadershipCta, 160),
      songsTitle: localized(interfaceCandidate.songsTitle, fallback.interfaceText.songsTitle, 160),
      videosTitle: localized(interfaceCandidate.videosTitle, fallback.interfaceText.videosTitle, 160),
      photosTitle: localized(interfaceCandidate.photosTitle, fallback.interfaceText.photosTitle, 160),
      contactKicker: localized(interfaceCandidate.contactKicker, fallback.interfaceText.contactKicker, 160),
      contactTitle: localized(interfaceCandidate.contactTitle, fallback.interfaceText.contactTitle, 160),
      contactText: localized(interfaceCandidate.contactText, fallback.interfaceText.contactText, 1200),
    },
    socials: {
      facebook: linkUrl(candidateSocials.facebook, fallback.socials.facebook),
      instagram: linkUrl(candidateSocials.instagram, fallback.socials.instagram),
      x: linkUrl(candidateSocials.x, fallback.socials.x),
      youtube: linkUrl(candidateSocials.youtube, fallback.socials.youtube),
      newsWebsite: linkUrl(candidateSocials.newsWebsite, fallback.socials.newsWebsite),
    },
    people: normalizePeople(candidate.people, fallback.people),
    hero: {
      eyebrow: localized(hero.eyebrow, fallback.hero.eyebrow, 160),
      title: localized(hero.title, fallback.hero.title, 600),
      intro: localized(hero.intro, fallback.hero.intro, 2500),
      imageUrl: imageUrl(hero.imageUrl, fallback.hero.imageUrl),
      imageAlt: localized(hero.imageAlt, fallback.hero.imageAlt, 300),
    },
    vision: section(candidate.vision, fallback.vision),
    news: section(candidate.news, fallback.news),
    history: section(candidate.history, fallback.history),
    historyTimeline: normalizeHistoryTimeline(candidate.historyTimeline, fallback.historyTimeline),
    president: {
      kicker: localized(president.kicker, fallback.president.kicker, 160),
      title: localized(president.title, fallback.president.title, 300),
      role: localized(president.role, fallback.president.role, 500),
      bio: localized(president.bio, fallback.president.bio, 5000),
      bio2: localized(president.bio2, fallback.president.bio2, 5000),
      imageUrl: imageUrl(president.imageUrl, fallback.president.imageUrl),
      imageAlt: localized(president.imageAlt, fallback.president.imageAlt, 300),
      imageCredit: localized(president.imageCredit, fallback.president.imageCredit, 500),
      socials: {
        x: linkUrl(presidentSocials.x, fallback.president.socials.x),
        instagram: linkUrl(presidentSocials.instagram, fallback.president.socials.instagram),
        facebook: linkUrl(presidentSocials.facebook, fallback.president.socials.facebook),
      },
    },
    presidentPage: normalizePresidentPage(candidate.presidentPage, fallback.presidentPage),
    leadership: section(candidate.leadership, fallback.leadership),
    publications: section(candidate.publications, fallback.publications),
    media: section(candidate.media, fallback.media),
    footer: { line: localized(footer.line, fallback.footer.line, 800) },
  };
}

async function readHomepageDocument(): Promise<{ content: HomepageContent; sha?: string }> {
  const response = await fetch(contentApiUrl(HOMEPAGE_PATH), {
    cache: "no-store",
    headers: githubHeaders(false),
  });
  if (response.status === 404) {
    return { content: normalizeHomepage(seedHomepageData) };
  }
  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while loading the homepage.`);
  }
  const file = (await response.json()) as GitHubFile;
  if (file.encoding !== "base64" || !file.content) {
    throw new Error("The homepage file returned by GitHub is invalid.");
  }
  const parsed = JSON.parse(
    Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8"),
  );
  return { content: normalizeHomepage(parsed), sha: file.sha };
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    return (await readHomepageDocument()).content;
  } catch (error) {
    console.error("Unable to refresh homepage content from GitHub", error);
    return normalizeHomepage(seedHomepageData);
  }
}

function imageExtension(contentType: string): string {
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensions[contentType];
  if (!extension) throw new Error("Only JPG, PNG and WebP photographs are accepted.");
  return extension;
}

async function putRepositoryFile(options: {
  path: string;
  base64Content: string;
  message: string;
  sha?: string;
}): Promise<void> {
  const { owner, repository, branch } = repositoryParts();
  const encodedPath = options.path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodedPath}`,
    {
      method: "PUT",
      headers: { ...githubHeaders(true), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: options.message,
        content: options.base64Content,
        branch,
        ...(options.sha ? { sha: options.sha } : {}),
      }),
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    console.error("GitHub homepage write failed", response.status, detail);
    throw new Error(
      response.status === 409
        ? "The homepage changed while you were editing it. Reload and submit again."
        : "GitHub could not save the homepage. Check the repository token permissions.",
    );
  }
}

async function uploadImage(image: ImageUpload, label: string): Promise<string> {
  if (!image.bytes.length || image.bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("Each photograph must be smaller than 3.5 MB.");
  }
  const extension = imageExtension(image.contentType);
  const shortId = crypto.randomUUID().split("-")[0];
  const path = `public/uploads/home-${label}-${Date.now()}-${shortId}.${extension}`;
  await putRepositoryFile({
    path,
    base64Content: Buffer.from(image.bytes).toString("base64"),
    message: `Update homepage ${label} image`,
  });
  const { owner, repository, branch } = repositoryParts();
  return `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/${encodeURIComponent(branch)}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}

export async function updateHomepage(input: HomepageUpdateInput): Promise<HomepageContent> {
  const current = await readHomepageDocument();
  const content = normalizeHomepage(input.content, current.content);
  if (input.heroImage) content.hero.imageUrl = await uploadImage(input.heroImage, "hero");
  if (input.presidentImage) content.president.imageUrl = await uploadImage(input.presidentImage, "president");
  for (const [slug, image] of Object.entries(input.personImages || {})) {
    const person = content.people?.find((item) => item.slug === slug);
    if (person) person.imageUrl = await uploadImage(image, `person-${identifier(slug, "profile")}`);
  }
  for (const [id, image] of Object.entries(input.historyImages || {})) {
    const milestone = content.historyTimeline.find((item) => item.id === id);
    if (milestone) milestone.imageUrl = await uploadImage(image, `history-${identifier(id, "milestone")}`);
  }
  content.updatedAt = new Date().toISOString();

  await putRepositoryFile({
    path: HOMEPAGE_PATH,
    base64Content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`).toString("base64"),
    message: "Update homepage content",
    sha: current.sha,
  });
  return content;
}
