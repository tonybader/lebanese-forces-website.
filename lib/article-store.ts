import "server-only";

import seedArticleData from "@/data/articles.json";
import type { Article, LocalizedArticleText } from "@/lib/article-types";

const DEFAULT_REPOSITORY = "tonybader/lebanese-forces-website.";
const DEFAULT_BRANCH = "main";
const ARTICLES_PATH = "data/articles.json";
const MAX_IMAGE_BYTES = 3_500_000;

type GitHubFile = {
  content?: string;
  encoding?: string;
  sha?: string;
};

export type NewArticleInput = {
  title: LocalizedArticleText;
  body: LocalizedArticleText;
  image: {
    bytes: Uint8Array;
    contentType: string;
  };
};

export type UpdateArticleInput = {
  id: string;
  title: LocalizedArticleText;
  body: LocalizedArticleText;
  image?: {
    bytes: Uint8Array;
    contentType: string;
  };
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
    throw new Error("Article publishing has not been connected to GitHub yet.");
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

function normalizeArticles(value: unknown): Article[] {
  if (!Array.isArray(value)) return [];
  return (value as Article[])
    .filter(
      (article) =>
        article &&
        typeof article.id === "string" &&
        typeof article.slug === "string" &&
        typeof article.publishedAt === "string" &&
        typeof article.title?.ar === "string" &&
        typeof article.body?.ar === "string" &&
        typeof article.imageUrl === "string",
    )
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime(),
    );
}

async function readArticleDocument(): Promise<{ articles: Article[]; sha?: string }> {
  const response = await fetch(contentApiUrl(ARTICLES_PATH), {
    cache: "no-store",
    headers: githubHeaders(false),
  });
  if (!response.ok) {
    throw new Error(`GitHub returned ${response.status} while loading articles.`);
  }

  const file = (await response.json()) as GitHubFile;
  if (file.encoding !== "base64" || !file.content) {
    throw new Error("The article file returned by GitHub is invalid.");
  }
  const parsed = JSON.parse(
    Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8"),
  );
  return { articles: normalizeArticles(parsed), sha: file.sha };
}

export async function listArticles(): Promise<Article[]> {
  try {
    const { articles } = await readArticleDocument();
    return articles.length ? articles : normalizeArticles(seedArticleData);
  } catch (error) {
    console.error("Unable to refresh articles from GitHub", error);
    return normalizeArticles(seedArticleData);
  }
}

export async function findArticle(slug: string): Promise<Article | null> {
  const articles = await listArticles();
  return articles.find((article) => article.slug === slug) || null;
}

export async function findArticleById(id: string): Promise<Article | null> {
  const articles = await listArticles();
  return articles.find((article) => article.id === id) || null;
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

function cleanLocalized(value: LocalizedArticleText): LocalizedArticleText {
  return {
    ar: value.ar.trim(),
    en: value.en.trim(),
    fr: value.fr.trim(),
  };
}

function slugify(title: string): string {
  const cleaned = title
    .normalize("NFKC")
    .toLocaleLowerCase("ar-LB")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
  return cleaned || "article";
}

async function putRepositoryFile(options: {
  path: string;
  base64Content: string;
  message: string;
  sha?: string;
}): Promise<void> {
  const { owner, repository, branch } = repositoryParts();
  const encodedPath = options.path.split("/").map(encodeURIComponent).join("/");
  const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodedPath}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      ...githubHeaders(true),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: options.message,
      content: options.base64Content,
      branch,
      ...(options.sha ? { sha: options.sha } : {}),
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    console.error("GitHub write failed", response.status, detail);
    throw new Error(
      response.status === 409
        ? "Another article was published at the same time. Please submit again."
        : "GitHub could not save the article. Check the repository token permissions.",
    );
  }
}

async function deleteRepositoryFile(path: string, message: string): Promise<void> {
  const currentResponse = await fetch(contentApiUrl(path), {
    cache: "no-store",
    headers: githubHeaders(true),
  });
  if (currentResponse.status === 404) return;
  if (!currentResponse.ok) {
    throw new Error("GitHub could not load the photograph before deleting it.");
  }

  const current = (await currentResponse.json()) as GitHubFile;
  if (!current.sha) return;

  const { owner, repository, branch } = repositoryParts();
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  const response = await fetch(
    `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/contents/${encodedPath}`,
    {
      method: "DELETE",
      headers: {
        ...githubHeaders(true),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, sha: current.sha, branch }),
    },
  );
  if (!response.ok && response.status !== 404) {
    throw new Error("GitHub could not delete the old photograph.");
  }
}

function uploadedImagePath(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    if (url.hostname !== "raw.githubusercontent.com") return null;
    const decoded = decodeURIComponent(url.pathname);
    const marker = "/public/uploads/";
    const index = decoded.indexOf(marker);
    return index >= 0 ? decoded.slice(index + 1) : null;
  } catch {
    return null;
  }
}

async function saveArticleDocument(
  articles: Article[],
  sha: string | undefined,
  message: string,
): Promise<void> {
  await putRepositoryFile({
    path: ARTICLES_PATH,
    base64Content: Buffer.from(`${JSON.stringify(normalizeArticles(articles), null, 2)}\n`).toString("base64"),
    message,
    sha,
  });
}

export async function createArticle(input: NewArticleInput): Promise<Article> {
  if (!input.title.ar.trim() || !input.body.ar.trim()) {
    throw new Error("The Arabic title and article text are required.");
  }
  if (!input.image.bytes.length || input.image.bytes.length > MAX_IMAGE_BYTES) {
    throw new Error("The photograph must be smaller than 3.5 MB.");
  }

  const extension = imageExtension(input.image.contentType);
  const publishedAt = new Date().toISOString();
  const shortId = crypto.randomUUID().split("-")[0];
  const slug = `${slugify(input.title.ar)}-${shortId}`;
  const imagePath = `public/uploads/${Date.now()}-${shortId}.${extension}`;
  const { owner, repository, branch } = repositoryParts();

  const article: Article = {
    id: crypto.randomUUID(),
    slug,
    publishedAt,
    title: cleanLocalized(input.title),
    body: cleanLocalized(input.body),
    category: {
      ar: "أخبار القوات",
      en: "Lebanese Forces news",
      fr: "Actualités des Forces Libanaises",
    },
    imageUrl: `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/${encodeURIComponent(branch)}/${imagePath
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
    imageAlt: cleanLocalized(input.title),
  };

  const current = await readArticleDocument();
  await putRepositoryFile({
    path: imagePath,
    base64Content: Buffer.from(input.image.bytes).toString("base64"),
    message: `Add article image: ${input.title.ar.slice(0, 60)}`,
  });

  const articles = normalizeArticles([article, ...current.articles]);
  await putRepositoryFile({
    path: ARTICLES_PATH,
    base64Content: Buffer.from(`${JSON.stringify(articles, null, 2)}\n`).toString("base64"),
    message: `Publish article: ${input.title.ar.slice(0, 60)}`,
    sha: current.sha,
  });

  return article;
}

export async function updateArticle(input: UpdateArticleInput): Promise<Article> {
  if (!input.title.ar.trim() || !input.body.ar.trim()) {
    throw new Error("The Arabic title and article text are required.");
  }
  if (input.image && (!input.image.bytes.length || input.image.bytes.length > MAX_IMAGE_BYTES)) {
    throw new Error("The photograph must be smaller than 3.5 MB.");
  }

  const current = await readArticleDocument();
  const index = current.articles.findIndex((article) => article.id === input.id);
  if (index < 0) throw new Error("The selected article no longer exists.");

  const previous = current.articles[index];
  let imageUrl = previous.imageUrl;
  let replacementImagePath: string | null = null;

  if (input.image) {
    const extension = imageExtension(input.image.contentType);
    const shortId = crypto.randomUUID().split("-")[0];
    replacementImagePath = `public/uploads/${Date.now()}-${shortId}.${extension}`;
    const { owner, repository, branch } = repositoryParts();
    imageUrl = `https://raw.githubusercontent.com/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}/${encodeURIComponent(branch)}/${replacementImagePath
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`;

    await putRepositoryFile({
      path: replacementImagePath,
      base64Content: Buffer.from(input.image.bytes).toString("base64"),
      message: `Replace article image: ${input.title.ar.slice(0, 60)}`,
    });
  }

  const updated: Article = {
    ...previous,
    title: cleanLocalized(input.title),
    body: cleanLocalized(input.body),
    imageUrl,
    imageAlt: cleanLocalized(input.title),
  };
  const articles = [...current.articles];
  articles[index] = updated;
  await saveArticleDocument(
    articles,
    current.sha,
    `Update article: ${input.title.ar.slice(0, 60)}`,
  );

  if (replacementImagePath) {
    const oldImagePath = uploadedImagePath(previous.imageUrl);
    if (oldImagePath && oldImagePath !== replacementImagePath) {
      try {
        await deleteRepositoryFile(oldImagePath, `Remove replaced article image: ${input.title.ar.slice(0, 50)}`);
      } catch (error) {
        console.error("The old article image could not be removed", error);
      }
    }
  }

  return updated;
}

export async function deleteArticle(id: string): Promise<void> {
  const current = await readArticleDocument();
  const article = current.articles.find((item) => item.id === id);
  if (!article) throw new Error("The selected article no longer exists.");

  await saveArticleDocument(
    current.articles.filter((item) => item.id !== id),
    current.sha,
    `Delete article: ${article.title.ar.slice(0, 60)}`,
  );

  const imagePath = uploadedImagePath(article.imageUrl);
  if (imagePath) {
    try {
      await deleteRepositoryFile(imagePath, `Remove article image: ${article.title.ar.slice(0, 50)}`);
    } catch (error) {
      console.error("The deleted article image could not be removed", error);
    }
  }
}
