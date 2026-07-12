import type { Metadata } from "next";
import ResearchClient from "./ResearchClient";
import { RESEARCH_PAPERS } from "@/lib/research-papers";

const SITE = "https://askbiz.co";

export const metadata: Metadata = {
  title: "Research & Writing — Idarus Ali | AskBiz",
  description:
    "Research papers and writing by Idarus Ali, Founder of AskBiz — on informal business, micro-enterprise, poverty, and livelihoods across East Africa and the Middle East.",
  keywords:
    "Idarus Ali, Idarus Ali research, informal economy Kenya, micro-enterprise research, jua kali, livelihoods, poverty, AskBiz research, East Africa business research",
  authors: [{ name: "Idarus Ali" }],
  creator: "Idarus Ali",
  openGraph: {
    title: "Research & Writing — Idarus Ali",
    description:
      "Field research on informal business and livelihoods across East Africa and the Middle East.",
    url: `${SITE}/research`,
    siteName: "AskBiz",
    type: "profile",
    images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: "Idarus Ali — Research & Writing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Research & Writing — Idarus Ali",
    description:
      "Field research on informal business and livelihoods across East Africa and the Middle East.",
    images: [`${SITE}/og-image.png`],
  },
  alternates: { canonical: `${SITE}/research` },
  robots: { index: true, follow: true },
};

// Structured data — helps Google rich results AND AI answer engines
// (ChatGPT, Perplexity, Google AI) understand the author entity and cite the
// papers. Built from RESEARCH_PAPERS so it never drifts from the visible list.
function jsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${SITE}/research#idarus-ali`,
    name: "Idarus Ali",
    jobTitle: "Founder",
    email: "mailto:idarus@askbiz.co",
    image: `${SITE}/images/founder.jpg`,
    url: `${SITE}/research`,
    description:
      "Entrepreneur and researcher with 15+ years across East Africa and the Middle East, focused on informal business and livelihoods. Founder of AskBiz.",
    knowsAbout: [
      "Informal economy",
      "Micro-enterprise",
      "Poverty and livelihoods",
      "East Africa",
      "Business intelligence",
    ],
    worksFor: { "@type": "Organization", name: "AskBiz", url: SITE },
    alumniOf: [
      { "@type": "EducationalOrganization", name: "BSc, Computer Science" },
      { "@type": "EducationalOrganization", name: "MA, Applied Linguistics" },
    ],
    hasCredential: [
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "BSc Computer Science" },
      { "@type": "EducationalOccupationalCredential", credentialCategory: "degree", name: "MA Applied Linguistics" },
    ],
  };

  const articles = RESEARCH_PAPERS.map((p) => ({
    "@type": "ScholarlyArticle",
    "@id": `${SITE}/research#${p.slug}`,
    headline: p.title,
    name: p.title,
    abstract: p.summary,
    datePublished: p.date,
    inLanguage: "en",
    keywords: p.tags.join(", "),
    author: { "@id": `${SITE}/research#idarus-ali` },
    publisher: { "@type": "Organization", name: "AskBiz", url: SITE },
    url: `${SITE}${p.file}`,
    encoding: { "@type": "MediaObject", encodingFormat: "application/pdf", contentUrl: `${SITE}${p.file}` },
    isAccessibleForFree: true,
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE}/research`,
        url: `${SITE}/research`,
        name: "Research & Writing — Idarus Ali",
        mainEntity: { "@id": `${SITE}/research#idarus-ali` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Research", item: `${SITE}/research` },
        ],
      },
      person,
      ...articles,
    ],
  };
}

export default function ResearchPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <ResearchClient />
    </>
  );
}
