import { get } from "@vercel/blob";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const pathname = new URL(request.url).searchParams.get("pathname")?.trim() || "";
  if (!pathname.startsWith("publications/") || pathname.includes("..")) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode === 304 || !result.stream) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }

  const headers = new Headers();
  headers.set("Content-Type", result.blob.contentType || "application/octet-stream");
  headers.set("Content-Length", String(result.blob.size));
  headers.set("Content-Disposition", `inline; filename="${pathname.split("/").pop()?.replace(/[^a-zA-Z0-9._-]/g, "-") || "document"}"`);
  headers.set("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return new Response(result.stream, { headers });
}
