import { NextResponse } from "next/server";
import { getMediaContent } from "@/lib/media-store";
import type { MediaInstagramPost } from "@/lib/media-types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type InstagramApiItem = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

type InstagramSource = "instagram-login" | "facebook-login" | "editor";

function response(
  posts: MediaInstagramPost[],
  source: InstagramSource,
  status: "live" | "fallback" = "live",
) {
  return NextResponse.json(
    { posts, source, status, fetchedAt: new Date().toISOString() },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "CDN-Cache-Control": "no-store",
        "Vercel-CDN-Cache-Control": "no-store",
      },
    },
  );
}

function normalizePosts(payload: { data?: InstagramApiItem[] }): MediaInstagramPost[] {
  return (payload.data || []).map((item, index): MediaInstagramPost | null => {
    const imageUrl = item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
    if (!imageUrl || !item.permalink) return null;
    const caption = item.caption?.trim() || "";
    return {
      id: item.id || `instagram-live-${index}`,
      caption: { ar: caption, en: caption, fr: caption },
      imageUrl,
      permalink: item.permalink,
      publishedAt: item.timestamp || "",
      mediaType: item.media_type === "VIDEO"
        ? "VIDEO"
        : item.media_type === "CAROUSEL_ALBUM"
          ? "CAROUSEL_ALBUM"
          : "IMAGE",
    };
  }).filter((item): item is MediaInstagramPost => Boolean(item));
}

async function fetchLivePosts(
  endpoint: URL,
  token: string,
): Promise<MediaInstagramPost[]> {
  endpoint.searchParams.set(
    "fields",
    "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
  );
  endpoint.searchParams.set("limit", "6");

  const request = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!request.ok) throw new Error(`Instagram returned ${request.status}.`);
  return normalizePosts(await request.json() as { data?: InstagramApiItem[] });
}

export async function GET() {
  const media = await getMediaContent();
  const fallback = media.instagramPosts.slice(0, 6);
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();

  if (!token) return response(fallback, "editor", "fallback");

  const sources: { endpoint: URL; source: Exclude<InstagramSource, "editor"> }[] = [
    ...(businessAccountId ? [{
      endpoint: new URL(`https://graph.facebook.com/${encodeURIComponent(businessAccountId)}/media`),
      source: "facebook-login" as const,
    }] : []),
    {
      endpoint: new URL("https://graph.instagram.com/me/media"),
      source: "instagram-login" as const,
    },
  ];

  for (const { endpoint, source } of sources) {
    try {
      const posts = await fetchLivePosts(endpoint, token);
      if (posts.length) return response(posts, source);
    } catch (error) {
      console.error(`Unable to refresh Instagram using ${source}`, error);
    }
  }

  return response(fallback, "editor", "fallback");
}
