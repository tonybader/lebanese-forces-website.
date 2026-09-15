import "server-only";

import seedHomepageData from "@/data/homepage.json";
import type {
  HomepageContent,
  HomepageLocalizedText,
  HomepageTextSection,
} from "@/lib/homepage-types";

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

  return {
    updatedAt: text(candidate.updatedAt, fallback.updatedAt, 80),
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
    president: {
      kicker: localized(president.kicker, fallback.president.kicker, 160),
      title: localized(president.title, fallback.president.title, 300),
      role: localized(president.role, fallback.president.role, 500),
      bio: localized(president.bio, fallback.president.bio, 5000),
      bio2: localized(president.bio2, fallback.president.bio2, 5000),
      imageUrl: imageUrl(president.imageUrl, fallback.president.imageUrl),
      imageAlt: localized(president.imageAlt, fallback.president.imageAlt, 300),
      imageCredit: localized(president.imageCredit, fallback.president.imageCredit, 500),
    },
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
  content.updatedAt = new Date().toISOString();

  await putRepositoryFile({
    path: HOMEPAGE_PATH,
    base64Content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`).toString("base64"),
    message: "Update homepage content",
    sha: current.sha,
  });
  return content;
}
