import { notFound } from "next/navigation";
import { getMediaContent } from "@/lib/media-store";
import type { MediaDocument } from "@/lib/media-types";
import { PublicationLibrary } from "./publication-library";

export const dynamic = "force-dynamic";

type PublicationPageProps = {
  params: Promise<{ section: string }>;
};

const validSections = new Set<MediaDocument["section"]>(["legislative", "political", "charter"]);

export default async function PublicationPage({ params }: PublicationPageProps) {
  const { section } = await params;
  if (!validSections.has(section as MediaDocument["section"])) notFound();
  const media = await getMediaContent();
  return <PublicationLibrary section={section as MediaDocument["section"]} documents={media.documents.filter((document) => document.section === section)} />;
}
