import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RESEARCH_PAPERS, AUTHOR, getPaper } from "@/lib/research-papers";
import ResearchPaperClient from "./ResearchPaperClient";

const SITE = "https://askbiz.co";

export function generateStaticParams() {
  return RESEARCH_PAPERS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPaper(params.slug);
  if (!p) return { title: "Research — AskBiz" };
  const url = `${SITE}/research/${p.slug}`;
  const desc = p.summary.length > 300 ? p.summary.slice(0, 297) + "…" : p.summary;
  return {
    title: `${p.title} — Idarus Ali | AskBiz`,
    description: desc,
    keywords: `${p.tags.join(", ")}, Idarus Ali, ${p.type}`,
    authors: [{ name: AUTHOR.name }],
    openGraph: {
      title: p.title,
      description: desc,
      url,
      siteName: "AskBiz",
      type: "article",
      images: [{ url: `${SITE}/og-image.png`, width: 1200, height: 630, alt: p.title }],
    },
    twitter: { card: "summary_large_image", title: p.title, description: desc, images: [`${SITE}/og-image.png`] },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

// Per-paper ScholarlyArticle JSON-LD with the full abstract — the richest
// signal for Google and for AI answer engines to cite this specific paper.
function jsonLd(p: NonNullable<ReturnType<typeof getPaper>>) {
  const url = `${SITE}/research/${p.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ScholarlyArticle",
        "@id": `${url}#article`,
        headline: p.title,
        name: p.title,
        abstract: p.abstract,
        description: p.summary,
        articleBody: p.abstract + " " + p.keyFindings.join(" "),
        datePublished: p.date,
        inLanguage: "en",
        keywords: p.tags.join(", "),
        url,
        mainEntityOfPage: url,
        author: {
          "@type": "Person",
          name: AUTHOR.name,
          jobTitle: "Founder",
          worksFor: { "@type": "Organization", name: "AskBiz", url: SITE },
          ...(AUTHOR.sameAs.length ? { sameAs: AUTHOR.sameAs } : {}),
        },
        publisher: { "@type": "Organization", name: "AskBiz", url: SITE },
        associatedMedia: { "@type": "MediaObject", encodingFormat: "application/pdf", contentUrl: `${SITE}${p.file}` },
        isAccessibleForFree: true,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Research", item: `${SITE}/research` },
          { "@type": "ListItem", position: 3, name: p.title, item: url },
        ],
      },
    ],
  };
}

export default function ResearchPaperPage({ params }: { params: { slug: string } }) {
  const paper = getPaper(params.slug);
  if (!paper) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(paper)) }} />
      <ResearchPaperClient paper={paper} />
    </>
  );
}
