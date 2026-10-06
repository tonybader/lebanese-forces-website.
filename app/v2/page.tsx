import type { Metadata } from "next";
import { HomePage } from "@/app/page";

export const metadata: Metadata = {
  title: "Lebanese Forces — Homepage V2",
  description: "A preview of the Lebanese Forces website with the new cinematic hero.",
};

export default function HomepageV2() {
  return <HomePage heroVariant="v2" />;
}
