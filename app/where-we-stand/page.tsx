import type { Metadata } from "next";
import { PositionExplorer } from "./position-explorer";

export const metadata: Metadata = {
  title: "مواقفنا | القوات اللبنانية",
  description: "رؤية تفاعلية لمواقف القوات اللبنانية في الدولة والاقتصاد والمجتمع والمستقبل.",
};

export default function WhereWeStandPage() {
  return <PositionExplorer />;
}
