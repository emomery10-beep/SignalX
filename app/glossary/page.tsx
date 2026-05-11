// app/glossary/page.tsx
// Auto-generates from all academyArticles — zero manual maintenance

import { Metadata } from "next";
import { academyArticles, academyCategories } from "@/lib/academy-content";
import GlossaryClient from "./GlossaryClient";

export const metadata: Metadata = {
  title: "Business Glossary — 300 Terms Explained | AskBiz",
  description:
    "Free business glossary covering 300 terms across strategy, finance, eCommerce, FX, marketing, HR, tax, retail, and AI — explained in plain English for SME founders.",
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
  openGraph: {
    title: "Business Glossary — 300 Terms Explained | AskBiz",
    description:
      "300 business terms explained in plain English. From ARR to Zero-based budgeting — the complete SME founder glossary.",
    url: "https://askbiz.co/glossary",
    type: "website",
    siteName: "AskBiz",
  },
  twitter: {
    card: "summary",
    title: "Business Glossary — 300 Terms | AskBiz",
    description: "300 business terms explained in plain English for SME founders.",
  },
  alternates: {
    canonical: "https://askbiz.co/glossary",
  },
};

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
