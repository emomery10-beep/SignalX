// app/transparency/[article]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getSectionBySlug,
  getArticlesBySection,
  getAllArticles,
} from "@/lib/transparency-content";
import TransparencyArticleClient from "./TransparencyArticleClient";

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({ article: a.slug }));
}

export async function generateMetadata({ params }: { params: { article: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.article);
  if (!article) return { title: "Not Found" };
  const url = `https://askbiz.co/transparency/${article.slug}`;
  return {
    title: `${article.title} | AskBiz Transparency`,
    description: article.description,
    keywords: article.keywords?.join(", "),
    openGraph: { title: article.title, description: article.description, url, siteName: "AskBiz", type: "article", modifiedTime: article.lastUpdated },
    alternates: { canonical: url },
    robots: { index: true, follow: true },
  };
}

export default function TransparencyArticlePage({ params }: { params: { article: string } }) {
  const article = getArticleBySlug(params.article);
  if (!article) notFound();

  const section = getSectionBySlug(article.sectionSlug);
  const sectionArticles = getArticlesBySection(article.sectionSlug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    dateModified: article.lastUpdated,
    author: { "@type": "Organization", name: "AskBiz" },
    publisher: { "@type": "Organization", name: "AskBiz" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://askbiz.co/transparency/${article.slug}` },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Help Center", item: "https://askbiz.co/help" },
        { "@type": "ListItem", position: 2, name: "Transparency Centre", item: "https://askbiz.co/transparency" },
        { "@type": "ListItem", position: 3, name: article.sectionTitle },
        { "@type": "ListItem", position: 4, name: article.title },
      ],
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TransparencyArticleClient article={article} section={section} sectionArticles={sectionArticles} />
    </>
  );
}
