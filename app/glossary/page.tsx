// app/glossary/page.tsx
// Auto-generates from all academyArticles — zero manual maintenance

import type { Metadata } from "next";
import { academyArticles, academyCategories } from "@/lib/academy-content";
import { getLocale, getT } from "@/lib/i18n-server";
import { localePath } from "@/lib/i18n-locale";
import GlossaryClient from "./GlossaryClient";

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  const t = getT();
  const title = t("glossary.meta_title");
  const description = t("glossary.meta_description");
  const canonical = `https://askbiz.co${localePath("/glossary", locale)}`;
  return {
    title,
    description,
    keywords: [
      "business glossary",
      "business terms explained",
      "what is gross margin",
      "business metrics glossary",
      "eCommerce glossary",
      "finance glossary for founders",
      "startup glossary",
      "SME business terms",
    ].join(", "),
    openGraph: { title, description, url: canonical, type: "website", siteName: "AskBiz" },
    twitter: { card: "summary", title, description },
    alternates: {
      canonical,
      languages: {
        en: "https://askbiz.co/glossary",
        es: "https://askbiz.co/es/glossary",
        fr: "https://askbiz.co/fr/glossary",
        de: "https://askbiz.co/de/glossary",
        nl: "https://askbiz.co/nl/glossary",
        ar: "https://askbiz.co/ar/glossary",
      },
    },
  };
}

export default function GlossaryPage() {
  // ── JSON-LD: DefinedTermSet schema ─────────────────────────────────────────
  const glossarySchema = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: "AskBiz Business Glossary",
    description:
      "300 business terms explained in plain English for SME founders — covering strategy, finance, eCommerce, FX, marketing, HR, tax, and retail.",
    url: "https://askbiz.co/glossary",
    publisher: {
      "@type": "Organization",
      name: "AskBiz",
      url: "https://askbiz.co",
    },
    hasDefinedTerm: academyArticles.map((article) => ({
      "@type": "DefinedTerm",
      name: article.title.replace(/^What Is (An? )?/i, "").replace(/\?$/, ""),
      description: article.description,
      url: `https://askbiz.co/academy/${article.slug}`,
      inDefinedTermSet: "https://askbiz.co/glossary",
    })),
  };

  // ── BreadcrumbList ──────────────────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
      { "@type": "ListItem", position: 2, name: "Glossary", item: "https://askbiz.co/glossary" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(glossarySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <GlossaryClient articles={academyArticles} categories={academyCategories} />
    </>
  );
}
