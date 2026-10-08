import { NextResponse } from "next/server";
import { getMediaContent } from "@/lib/media-store";
import type { MediaInstagramPost } from "@/lib/media-types";

export const dynamic = "force-dynamic";

type InstagramApiItem = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
};

function response(posts: MediaInstagramPost[], source: "instagram" | "editor") {
  return NextResponse.json(
    { posts, source },
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=900",
      },
    },
  );
}

export async function GET() {
  const media = await getMediaContent();
  const fallback = media.instagramPosts.slice(0, 6);
  const token = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();

  if (!token) return response(fallback, "editor");

  try {
    const endpoint = new URL("https://graph.instagram.com/me/media");
    endpoint.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp",
    );
    endpoint.searchParams.set("limit", "6");

    const request = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 300 },
    });
    if (!request.ok) return response(fallback, "editor");

    const payload = await request.json() as { data?: InstagramApiItem[] };
    const posts = (payload.data || []).map((item, index): MediaInstagramPost | null => {
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

    return posts.length ? response(posts, "instagram") : response(fallback, "editor");
  } catch {
    return response(fallback, "editor");
  }
}
