// app/help/[article]/page.tsx
// Article page — Server Component for SEO + metadata

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getArticleBySlug,
  getArticlesByTopic,
  getTopicBySlug,
  getArticleBySlug as getRelated,
  HELP_ARTICLES,
  type HelpArticle,
} from "@/lib/help-content";
import ArticleClient from "./ArticleClient";

// ── Static params for SSG ────────────────────────────────────────────────────
export async function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ article: a.slug }));
}

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { article: string };
}): Promise<Metadata> {
  const article = getArticleBySlug(params.article);
  if (!article) return { title: "Article Not Found" };

  const url = `https://askbiz.co/help/${article.slug}`;
  const ogImageUrl = `https://askbiz.co/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.topic)}`;

  return {
    title: `${article.title} | AskBiz Help`,
    description: article.description,
    keywords: article.keywords?.join(", "),
    openGraph: {
      title: article.title,
      description: article.description,
      url,
      siteName: "AskBiz",
      type: "article",
      publishedTime: article.lastUpdated,
      modifiedTime: article.lastUpdated,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "article:section": article.topic,
      // Citation hint for AI assistants and LLMs
      "citation": `AskBiz Help Centre — ${url}`,
      "content-attribution": "AskBiz Ltd",
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ArticlePage({
  params,
}: {
  params: { article: string };
}) {
  const article = getArticleBySlug(params.article);
  if (!article) notFound();

  const topic = getTopicBySlug(article.topicSlug);
  const topicArticles = getArticlesByTopic(article.topicSlug);
  const relatedArticles = (article.related || [])
    .map((slug) => getRelated(slug))
    .filter(Boolean) as HelpArticle[];

  // Detect procedural "how-to" articles: majority of headings start with "Step" or "How to"
  const isHowTo =
    article.content.length >= 3 &&
    article.content.filter((s) =>
      /^(step\s*\d|how\s+to|getting\s+started|set\s+up|connect|configure|install|create|add|enable)/i.test(s.heading)
    ).length >= Math.ceil(article.content.length * 0.4);

  // JSON-LD structured data
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
      { "@type": "ListItem", position: 2, name: "Help Center", item: "https://askbiz.co/help" },
      { "@type": "ListItem", position: 3, name: article.topic, item: `https://askbiz.co/help/topic/${article.topicSlug}` },
      { "@type": "ListItem", position: 4, name: article.title, item: `https://askbiz.co/help/${article.slug}` },
    ],
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.lastUpdated,
    dateModified: article.lastUpdated,
    author: { "@type": "Organization", name: "AskBiz" },
    publisher: {
      "@type": "Organization",
      name: "AskBiz",
      logo: { "@type": "ImageObject", url: "https://askbiz.co/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://askbiz.co/help/${article.slug}` },
    ...(article.faq && article.faq.length > 0
      ? {
          "@type": ["Article", "FAQPage"],
          mainEntity: article.faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : {}),
  };

  const howToLd = isHowTo
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: article.title,
        description: article.description,
        totalTime: `PT${article.readTime}M`,
        step: article.content.map((section, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: section.heading,
          text: section.body.replace(/\*\*(.+?)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").split("\n")[0],
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {howToLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }}
        />
      )}
      <ArticleClient
        article={article}
        topic={topic}
        topicArticles={topicArticles}
        relatedArticles={relatedArticles}
      />
    </>
  );
}
