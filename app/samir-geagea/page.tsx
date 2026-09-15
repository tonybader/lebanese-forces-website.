import type { Metadata } from "next";
import { getHomepageContent } from "@/lib/homepage-store";
import { BiographyView } from "./biography-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الدكتور سمير جعجع | القوات اللبنانية",
  description: "السيرة والمسيرة السياسية لرئيس حزب القوات اللبنانية الدكتور سمير جعجع.",
};

export default async function SamirGeageaPage() {
  const homepage = await getHomepageContent();
  return <BiographyView imageUrl={homepage.president.imageUrl} />;
}
