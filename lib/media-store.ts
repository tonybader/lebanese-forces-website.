import "server-only";

import seedMediaData from "@/data/media.json";
import type {
  MediaContent,
  MediaDocument,
  MediaLocalizedText,
  MediaPhoto,
  MediaSong,
} from "@/lib/media-types";

const DEFAULT_REPOSITORY = "tonybader/lebanese-forces-website.";
const DEFAULT_BRANCH = "main";
const MEDIA_PATH = "data/media.json";

type GitHubFile = { content?: string; encoding?: string; sha?: string };

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
  if (authenticated && !token) throw new Error("Media publishing is not connected to GitHub yet.");
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

function cleanText(value: unknown, fallback = "", maximum = 3000): string {
  return typeof value === "string" ? value.trim().slice(0, maximum) : fallback;
}

function localized(value: unknown, fallback?: MediaLocalizedText): MediaLocalizedText {
  const candidate = value && typeof value === "object" ? value as Partial<MediaLocalizedText> : {};
  return {
    ar: cleanText(candidate.ar, fallback?.ar),
    en: cleanText(candidate.en, fallback?.en),
    fr: cleanText(candidate.fr, fallback?.fr),
  };
}

function safeUrl(value: unknown, fallback = ""): string {
  const url = cleanText(value, fallback, 2500);
  return url.startsWith("/") || url.startsWith("https://") ? url : fallback;
}

function normalizeSong(value: unknown, index: number): MediaSong | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<MediaSong>;
  const audioUrl = safeUrl(item.audioUrl);
  const title = localized(item.title);
  if (!audioUrl || !title.ar) return null;
  return { id: cleanText(item.id, `song-${index}`, 100), title, audioUrl };
}

function normalizePhoto(value: unknown, index: number): MediaPhoto | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<MediaPhoto>;
  const imageUrl = safeUrl(item.imageUrl);
  const title = localized(item.title);
  if (!imageUrl || !title.ar) return null;
  return {
    id: cleanText(item.id, `photo-${index}`, 100),
    title,
    imageUrl,
    credit: cleanText(item.credit, "", 500),
    sourceUrl: safeUrl(item.sourceUrl, "/"),
    fit: item.fit === "contain" ? "contain" : "cover",
  };
}

function normalizeDocument(value: unknown, index: number): MediaDocument | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<MediaDocument>;
  const title = localized(item.title);
  const fileUrl = safeUrl(item.fileUrl);
  const coverUrl = safeUrl(item.coverUrl);
  if (!title.ar || !fileUrl || !coverUrl) return null;
  return {
    id: cleanText(item.id, `document-${index}`, 100),
    section: item.section === "legislative"
      ? "legislative"
      : item.section === "charter"
        ? "charter"
        : "political",
    title,
    description: localized(item.description),
    fileUrl,
    coverUrl,
  };
}

export function normalizeMedia(value: unknown): MediaContent {
  const fallback = seedMediaData as MediaContent;
  const candidate = value && typeof value === "object" ? value as Partial<MediaContent> : {};
  const songs = Array.isArray(candidate.songs)
    ? candidate.songs.map(normalizeSong).filter((item): item is MediaSong => Boolean(item)).slice(0, 40)
    : fallback.songs;
  const photos = Array.isArray(candidate.photos)
    ? candidate.photos.map(normalizePhoto).filter((item): item is MediaPhoto => Boolean(item)).slice(0, 24)
    : fallback.photos;
  const documents = Array.isArray(candidate.documents)
    ? candidate.documents.map(normalizeDocument).filter((item): item is MediaDocument => Boolean(item)).slice(0, 80)
    : fallback.documents;

  return {
    updatedAt: cleanText(candidate.updatedAt, fallback.updatedAt, 80),
    officialYouTubeUrl: safeUrl(candidate.officialYouTubeUrl, fallback.officialYouTubeUrl),
    songs: songs.length ? songs : fallback.songs,
    photos: photos.length ? photos : fallback.photos,
    documents,
  };
}

async function readMediaDocument(): Promise<{ content: MediaContent; sha?: string }> {
  const response = await fetch(contentApiUrl(MEDIA_PATH), {
    cache: "no-store",
    headers: githubHeaders(false),
  });
  if (response.status === 404) return { content: normalizeMedia(seedMediaData) };
  if (!response.ok) throw new Error(`GitHub returned ${response.status} while loading media content.`);
  const file = await response.json() as GitHubFile;
  if (file.encoding !== "base64" || !file.content) throw new Error("The media file returned by GitHub is invalid.");
  const parsed = JSON.parse(Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8"));
  return { content: normalizeMedia(parsed), sha: file.sha };
}

export async function getMediaContent(): Promise<MediaContent> {
  try {
    return (await readMediaDocument()).content;
  } catch (error) {
    console.error("Unable to refresh media content from GitHub", error);
    return normalizeMedia(seedMediaData);
  }
}

export async function updateMediaContent(value: unknown): Promise<MediaContent> {
  const current = await readMediaDocument();
  const content = normalizeMedia(value);
  content.updatedAt = new Date().toISOString();
  const { owner, repository, branch } = repositoryParts();
  const encodedPath = MEDIA_PATH.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodedPath}`,
    {
      method: "PUT",
      headers: { ...githubHeaders(true), "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "Update media and documents",
        content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`).toString("base64"),
        branch,
        ...(current.sha ? { sha: current.sha } : {}),
      }),
    },
  );
  if (!response.ok) {
    const detail = await response.text();
    console.error("GitHub media write failed", response.status, detail);
    throw new Error(response.status === 409
      ? "Media content changed while you were editing it. Reload and submit again."
      : "GitHub could not save the media content. Check the repository token permissions.");
  }
  return content;
}
