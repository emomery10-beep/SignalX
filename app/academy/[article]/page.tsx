import { Metadata } from "next";
import { notFound } from "next/navigation";
import { academyArticles } from "@/lib/academy-content";
import { getAllPosts } from "@/lib/blog-content";
import { parseYoutubeId } from "@/lib/youtube-feed";
import AcademyArticleClient from "./AcademyArticleClient";

interface Props {
  params: { article: string };
}

export async function generateStaticParams() {
  return academyArticles.map((a) => ({ article: a.slug }));
}

// Transforms plain academy descriptions into click-worthy SERP hooks
function enhanceAcademyDescription(article: { title: string; description: string; difficulty: string; category: string; readTime: number }): string {
  const d = article.description
  const t = article.title.toLowerCase()

  // Already has a hook
  if (/^\d|how |why |most |stop |never |\d%|[£$€]\d/.test(d.toLowerCase())) return d

  if (t.includes(' vs ')) return `${d} Clear comparison with real business examples — ${article.readTime} min read.`
  if (t.includes('what is') || t.includes('what are')) return `${d} Plain-English guide for SME owners and operators.`
  if (t.includes('how to')) return `${d} Step-by-step — no jargon, no fluff.`

  const diffSuffix: Record<string, string> = {
    'Beginner':     'Start here — explained in plain English.',
    'Intermediate': 'Practical guide with worked examples.',
    'Advanced':     'Deep-dive for operators who want the full picture.',
  }

  return `${d} ${diffSuffix[article.difficulty] || 'Practical guide for SME operators.'}`
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = academyArticles.find((a) => a.slug === params.article);
  if (!article) return {};

  const ogImageUrl = `https://askbiz.co/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category)}&difficulty=${encodeURIComponent(article.difficulty)}&readTime=${article.readTime}`;
  const enhancedDesc = enhanceAcademyDescription(article);

  return {
    title: `${article.title} | AskBiz Academy`,
    description: enhancedDesc,
    keywords: article.keywords.join(", "),
    alternates: {
      canonical: `https://askbiz.co/academy/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: enhancedDesc,
      url: `https://askbiz.co/academy/${article.slug}`,
      type: "article",
      siteName: "AskBiz Academy",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: article.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: enhancedDesc,
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
        url: "https://askbiz.co/logo.svg",
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

  // VideoObject schema — lets Google/AI answer engines surface and cite the
  // embedded walkthrough directly (video rich results, AI Overviews).
  const videoSchema = article.videoUrl
    ? (() => {
        const videoId = parseYoutubeId(article.videoUrl!);
        return {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          name: article.title,
          description: article.description,
          thumbnailUrl: [`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`],
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
          publisher: {
            "@type": "Organization",
            name: "AskBiz",
            logo: { "@type": "ImageObject", url: "https://askbiz.co/logo.svg" },
          },
        };
      })()
    : null;

  // HowTo schema — many Academy articles already write their sections as
  // "Step 1 — ...", "Step 2 — ..."; surface that existing structure as
  // schema.org HowTo so step-by-step content is directly citable by AI
  // answer engines and eligible for how-to rich results.
  const stepSections = article.content.filter((s) => /^step\s+\d+/i.test(s.heading));
  const howToSchema =
    stepSections.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: article.title,
          description: article.description,
          step: stepSections.map((s) => ({
            "@type": "HowToStep",
            name: s.heading.replace(/^step\s+\d+\s*[—-]\s*/i, ""),
            text: s.body,
          })),
        }
      : null;

  // Cross-link to blog articles: find blog posts relevant to this academy topic
  const _academyWords = (article.title + ' ' + article.description + ' ' + article.keywords.join(' ')).toLowerCase()
  const allPosts = getAllPosts()
  const blogCrossLinks = allPosts
    .filter(p => {
      const postText = (p.title + ' ' + (p.metaDescription || '')).toLowerCase()
      return article.keywords.some(kw => postText.includes(kw.toLowerCase()))
    })
    .slice(0, 4)
    .map(p => ({ slug: p.slug, title: p.title, cluster: p.cluster, readTime: p.readTime }))

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
      {videoSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
        />
      )}
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}
      <AcademyArticleClient article={article} blogCrossLinks={blogCrossLinks} />
    </>
  );
}
