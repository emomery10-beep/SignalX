import { Metadata } from "next";
import { academyArticles } from "@/lib/academy-content";
import AcademyClient from "./AcademyClient";

export const metadata: Metadata = {
  title: "AskBiz Academy — 420+ Free Business Intelligence Guides for SME Founders",
  description:
    "420+ free guides explaining business metrics, KPIs, financial intelligence, eCommerce analytics, FX risk, inventory management, marketing attribution, and AI — written for UK and global SME founders. No jargon.",
  keywords: [
    "business intelligence guides",
    "what is gross margin",
    "eCommerce KPIs",
    "financial metrics explained",
    "SME business metrics",
    "what is a KPI",
    "FX risk management",
    "inventory management metrics",
    "marketing attribution explained",
    "business analytics for founders",
  ].join(", "),
  openGraph: {
    title: "AskBiz Academy — 420+ Free Business Intelligence Guides",
    description:
      "420+ free guides on business metrics, KPIs, eCommerce analytics, FX risk, and AI — written for SME founders. No jargon. No paywalls.",
    url: "https://askbiz.co/academy",
    type: "website",
    siteName: "AskBiz",
  },
  twitter: {
    card: "summary",
    title: "AskBiz Academy — 420+ Free Business Intelligence Guides",
    description: "420+ free BI guides for SME founders. No jargon. No paywalls.",
  },
  alternates: {
    canonical: "https://askbiz.co/academy",
  },
};

export default function AcademyPage() {
  // ItemList schema — all article URLs for Google
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "AskBiz Academy — Business Intelligence Guides",
    description:
      "420+ free guides covering business intelligence, financial metrics, eCommerce analytics, FX risk, inventory, marketing, and AI for SME founders.",
    url: "https://askbiz.co/academy",
    numberOfItems: academyArticles.length,
    itemListElement: academyArticles.map((article, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: article.title,
      url: `https://askbiz.co/academy/${article.slug}`,
      description: article.description,
    })),
  };

  // WebSite schema with sitelinks searchbox hint
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AskBiz Academy",
    url: "https://askbiz.co/academy",
    description:
      "420+ free business intelligence guides for SME founders. Covers KPIs, financial metrics, eCommerce analytics, FX risk, inventory, marketing, and AI.",
    publisher: {
      "@type": "Organization",
      name: "AskBiz",
      url: "https://askbiz.co",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <AcademyClient />
    </>
  );
}
