import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseStudy, CASE_STUDIES } from "@/lib/case-studies-content";
import CaseStudyArticle from "./CaseStudyArticle";

export async function generateStaticParams() {
  return CASE_STUDIES.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const cs = getCaseStudy(params.slug);
  if (!cs) return {};
  return {
    title: `${cs.headline} | AskBiz Case Study`,
    description: cs.metaDescription,
    openGraph: {
      title: cs.headline,
      description: cs.metaDescription,
      url: `https://askbiz.co/case-studies/${cs.slug}`,
      siteName: "AskBiz",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: cs.headline,
      description: cs.metaDescription,
    },
    alternates: { canonical: `https://askbiz.co/case-studies/${cs.slug}` },
    robots: { index: true, follow: true },
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const cs = getCaseStudy(params.slug);
  if (!cs) notFound();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: cs.headline,
              description: cs.metaDescription,
              datePublished: cs.publishDate,
              author: { "@type": "Organization", name: "AskBiz" },
              publisher: { "@type": "Organization", name: "AskBiz", url: "https://askbiz.co" },
              url: `https://askbiz.co/case-studies/${cs.slug}`,
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
                { "@type": "ListItem", position: 2, name: "Case Studies", item: "https://askbiz.co/case-studies" },
                { "@type": "ListItem", position: 3, name: cs.company, item: `https://askbiz.co/case-studies/${cs.slug}` },
              ],
            },
          ]),
        }}
      />
      <CaseStudyArticle slug={params.slug} />
    </>
  );
}
