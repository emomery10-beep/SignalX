import { Metadata } from "next";
import { academyArticles } from "@/lib/academy-content";
import { getLocale } from "@/lib/i18n-server";
import { ACTIVE_LOCALES, localePath } from "@/lib/i18n-locale";
import AcademyClient from "./AcademyClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const canonical = `https://askbiz.co${localePath("/academy", locale)}`;

  // Reciprocal hreflang set — same "x-default" + one entry per active locale
  // pattern as the homepage (see HREFLANG_LANGUAGES in lib/landing-meta.ts /
  // the so/so-SO/so-DJ entries in app/layout.tsx), generated here via
  // localePath() so it stays correct if ACTIVE_LOCALES ever changes.
  const languages: Record<string, string> = {
    "x-default": "https://askbiz.co/academy",
  };
  for (const l of ACTIVE_LOCALES) {
    languages[l] = `https://askbiz.co${localePath("/academy", l)}`;
  }

  return {
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
      url: canonical,
      type: "website",
      siteName: "AskBiz",
    },
    twitter: {
      card: "summary",
      title: "AskBiz Academy — 420+ Free Business Intelligence Guides",
      description: "420+ free BI guides for SME founders. No jargon. No paywalls.",
    },
    alternates: {
      canonical,
      languages,
    },
  };
}

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
