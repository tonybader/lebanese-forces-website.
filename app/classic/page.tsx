import type { Metadata } from "next";
import { HomePage } from "@/app/page";

export const metadata: Metadata = {
  title: "Lebanese Forces — Classic homepage",
  description: "The classic Lebanese Forces homepage design.",
};

export default function ClassicHomepage() {
  return <HomePage heroVariant="current" />;
}
