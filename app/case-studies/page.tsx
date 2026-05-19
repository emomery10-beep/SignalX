import type { Metadata } from "next";
import CaseStudiesClient from "./CaseStudiesClient";

export const metadata: Metadata = {
  title: "Customer Case Studies — Real Results from Real Businesses | AskBiz",
  description:
    "See how SME founders use AskBiz to grow revenue, cut costs, and make better decisions. Real case studies from e-commerce, food & beverage, import/export, and fashion businesses.",
  keywords:
    "AskBiz case studies, SME success stories, business intelligence results, Shopify analytics case study, POS case study, import export case study, small business growth",
  openGraph: {
    title: "Customer Case Studies — Real Results from Real Businesses",
    description:
      "See how real businesses use AskBiz to grow revenue, cut costs, and make data-driven decisions.",
    url: "https://askbiz.co/case-studies",
    siteName: "AskBiz",
    type: "website",
  },
  alternates: { canonical: "https://askbiz.co/case-studies" },
  robots: { index: true, follow: true },
};

export default function CaseStudiesPage() {
  return <CaseStudiesClient />;
}
