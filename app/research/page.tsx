import type { Metadata } from "next";
import ResearchClient from "./ResearchClient";

export const metadata: Metadata = {
  title: "Research & Writing — Idarus Ali | AskBiz",
  description:
    "Research papers and writing by Idarus Ali, Founder of AskBiz — on informal business, micro-enterprise, poverty, and livelihoods across East Africa and the Middle East.",
  keywords:
    "Idarus Ali research, informal economy Kenya, micro-enterprise research, jua kali, livelihoods, AskBiz research, East Africa business research",
  openGraph: {
    title: "Research & Writing — Idarus Ali",
    description:
      "Field-level, evidence-led research on informal business and livelihoods across East Africa and the Middle East.",
    url: "https://askbiz.co/research",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/research" },
  robots: { index: true, follow: true },
};

export default function ResearchPage() {
  return <ResearchClient />;
}
