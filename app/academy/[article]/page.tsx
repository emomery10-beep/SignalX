import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { academyArticles } from "@/lib/academy-content";
import { getAllPosts } from "@/lib/blog-content";
import { parseYoutubeId } from "@/lib/youtube-feed";
import { getLocalizedArticle } from "@/lib/academy-i18n-loader";
import { resolveLocale, localePath, ACTIVE_LOCALES, type Locale } from "@/lib/i18n-locale";
import AcademyArticleClient from "./AcademyArticleClient";

interface Props {
  params: { article: string };
}

export async function generateStaticParams() {
  return academyArticles.map((a) => ({ article: a.slug }));
}

// Same locale-resolution pattern as app/academy/category/[slug]/page.tsx and
// app/for/[segment]/page.tsx: URL prefix (via middleware's x-locale header)
// wins, falling back to the askbiz_lang cookie. Reading headers()/cookies()
// opts this route into per-request dynamic rendering (same tradeoff those
// routes already made) so the right locale's content can be served.
function getRequestLocale(): Locale {
  return resolveLocale({
    urlLocale: headers().get("x-locale"),
    cookie: cookies().get("askbiz_lang")?.value,
  });
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

  const locale = getRequestLocale();
  const localized = await getLocalizedArticle(article, locale);

  const canonicalUrl = `https://askbiz.co${localePath(`/academy/${article.slug}`, locale)}`;
  const ogImageUrl = `https://askbiz.co/api/og?title=${encodeURIComponent(localized.title)}&category=${encodeURIComponent(article.category)}&difficulty=${encodeURIComponent(article.difficulty)}&readTime=${article.readTime}`;
  const enhancedDesc = enhanceAcademyDescription({ ...article, title: localized.title, description: localized.description });

  // hreflang alternates — one per ACTIVE_LOCALES entry for this article's URL
  // (mirroring the reciprocal-map approach used for the Somali/Swahili entries
  // in app/layout.tsx, adapted here to a generic per-locale loop via
  // localePath() instead of hand-listed country variants), plus x-default
  // pointing at the unprefixed English URL.
  const languages: Record<string, string> = {
    "x-default": `https://askbiz.co/academy/${article.slug}`,
  };
  ACTIVE_LOCALES.forEach((l) => {
    languages[l] = `https://askbiz.co${localePath(`/academy/${article.slug}`, l)}`;
  });

  return {
    title: `${localized.title} | AskBiz Academy`,
    description: enhancedDesc,
    keywords: localized.keywords.join(", "),
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      title: localized.title,
      description: enhancedDesc,
      url: canonicalUrl,
      type: "article",
      siteName: "AskBiz Academy",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: localized.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: localized.title,
      description: enhancedDesc,
      images: [ogImageUrl],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = academyArticles.find((a) => a.slug === params.article);
  if (!article) notFound();

  const locale = getRequestLocale();
  const localizedArticle = await getLocalizedArticle(article, locale);
  const canonicalUrl = `https://askbiz.co${localePath(`/academy/${article.slug}`, locale)}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: localizedArticle.title,
    description: localizedArticle.description,
    keywords: localizedArticle.keywords.join(", "),
    inLanguage: locale,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
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
    url: canonicalUrl,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    inLanguage: locale,
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
        name: localizedArticle.title,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema =
    localizedArticle.faq && localizedArticle.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          inLanguage: locale,
          mainEntity: localizedArticle.faq.map((item) => ({
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
          name: localizedArticle.title,
          description: localizedArticle.description,
          inLanguage: locale,
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
  const stepSections = localizedArticle.content.filter((s) => /^step\s+\d+/i.test(s.heading));
  const howToSchema =
    stepSections.length >= 2
      ? {
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: localizedArticle.title,
          description: localizedArticle.description,
          inLanguage: locale,
          step: stepSections.map((s) => ({
            "@type": "HowToStep",
            name: s.heading.replace(/^step\s+\d+\s*[—-]\s*/i, ""),
            text: s.body,
          })),
        }
      : null;

  // Cross-link to blog articles: find blog posts relevant to this academy topic.
  // Deliberately matched against the RAW ENGLISH article (not localizedArticle)
  // — blog content itself has no locale overlay, so matching translated
  // keywords/title against English blog text would silently break this
  // discovery for every non-English locale.
  const _academyWords = (article.title + ' ' + article.description + ' ' + article.keywords.join(' ')).toLowerCase()
  const allPosts = getAllPosts()
  const blogCrossLinks = allPosts
    .filter(p => {
      const postText = (p.title + ' ' + (p.metaDescription || '')).toLowerCase()
      return article.keywords.some(kw => postText.includes(kw.toLowerCase()))
    })
    .slice(0, 4)
    .map(p => ({ slug: p.slug, title: p.title, cluster: p.cluster, readTime: p.readTime }))

  // Related articles — localized so a reader in a non-English locale sees
  // translated titles for related articles too, once they exist. Forward-
  // compatible only right now: getLocalizedArticle falls back to English for
  // any slug with no translation yet, so this is not visibly different today.
  const relatedRaw = academyArticles.filter((a) => article.relatedSlugs.includes(a.slug));
  const relatedArticles = await Promise.all(relatedRaw.map((a) => getLocalizedArticle(a, locale)));

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
      <AcademyArticleClient article={localizedArticle} blogCrossLinks={blogCrossLinks} relatedArticles={relatedArticles} />
    </>
  );
}
