import { Metadata } from "next";
import { notFound } from "next/navigation";
import { academyArticles } from "@/lib/academy-content";
import AcademyArticleClient from "./AcademyArticleClient";

interface Props {
  params: { article: string };
}

export async function generateStaticParams() {
  return academyArticles.map((a) => ({ article: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = academyArticles.find((a) => a.slug === params.article);
  if (!article) return {};

  const ogImageUrl = `https://askbiz.co/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}&difficulty=${encodeURIComponent(article.difficulty)}&readTime=${article.readTime}`;

  return {
    title: `${article.title} | AskBiz Academy`,
    description: article.description,
    keywords: article.keywords.join(", "),
    alternates: {
      canonical: `https://askbiz.co/academy/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      url: `https://askbiz.co/academy/${article.slug}`,
      type: "article",
      siteName: "AskBiz Academy",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
      images: [ogImageUrl],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = academyArticles.find((a) => a.slug === params.article);
  if (!article) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    keywords: article.keywords.join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://askbiz.co/academy/${article.slug}`,
    },
    author: {
      "@type": "Organization",
      name: "AskBiz",
      url: "https://askbiz.co",
    },
    publisher: {
      "@type": "Organization",
      name: "AskBiz",
      url: "https://askbiz.co",
      logo: {
        "@type": "ImageObject",
        url: "https://askbiz.co/favicon.svg",
      },
    },
    articleSection: article.category,
    timeRequired: `PT${article.readTime}M`,
    educationalLevel: article.difficulty,
    url: `https://askbiz.co/academy/${article.slug}`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://askbiz.co",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Academy",
        item: "https://askbiz.co/academy",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.category,
        item: `https://askbiz.co/academy/category/${article.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `https://askbiz.co/academy/${article.slug}`,
      },
    ],
  };

  const faqSchema =
    article.faq && article.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: article.faq.map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.a,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <AcademyArticleClient article={article} />
    </>
  );
}
