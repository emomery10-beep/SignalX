import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { academyArticles } from "@/lib/academy-content";
import { getAllPosts } from "@/lib/blog-content";
import { parseYoutubeId } from "@/lib/youtube-feed";
import { getLocalizedArticle, getLocalizedSlug } from "@/lib/academy-i18n-loader";
import { resolveLocale, localePath, ACTIVE_LOCALES, type Locale } from "@/lib/i18n-locale";
import AcademyArticleClient from "./AcademyArticleClient";

interface Props {
  params: { article: string };
}

export async function generateStaticParams() {
  const params: { article: string }[] = [];

  // Generate params for English slugs (base case — no locale prefix)
  for (const article of academyArticles) {
    params.push({ article: article.slug });
  }

  // Generate params for each non-English locale's translated slugs
  for (const locale of ACTIVE_LOCALES.filter((l) => l !== "en")) {
    for (const article of academyArticles) {
      const translatedSlug = await getLocalizedSlug(article.slug, locale);
      if (translatedSlug !== article.slug) {
        params.push({ article: translatedSlug });
      }
    }
  }

  return params;
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

// Looks up an article by either English slug or locale-specific translated slug.
// Returns the article if found, or undefined if no match in any form.
async function findArticleByAnySlug(paramSlug: string, locale: Locale) {
  // First, try direct English slug match
  let article = academyArticles.find((a) => a.slug === paramSlug);
  if (article) return article;

  // If not found and we're in a non-English locale, check if paramSlug
  // is a translated slug that maps to an English one
  if (locale !== "en") {
    const { slugMap } = await import(`@/lib/academy-slugs/${locale}/index`)
      .catch(() => ({ slugMap: {} }));

    // slugMap is English -> translated, so we need the reverse lookup
    for (const [englishSlug, translatedSlug] of Object.entries(slugMap)) {
      if (translatedSlug === paramSlug) {
        return academyArticles.find((a) => a.slug === englishSlug);
      }
    }
  }

  return undefined;
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
  const locale = getRequestLocale();
  const article = await findArticleByAnySlug(params.article, locale);
  if (!article) return {};

  const localized = await getLocalizedArticle(article, locale);

  // Build locale-specific URLs using translated slugs
  const localizedSlug = await getLocalizedSlug(article.slug, locale);
  const canonicalUrl = `https://askbiz.co${localePath(`/academy/${localizedSlug}`, locale)}`;
  const ogImageUrl = `https://askbiz.co/api/og?title=${encodeURIComponent(localized.title)}&category=${encodeURIComponent(article.category)}&difficulty=${encodeURIComponent(article.difficulty)}&readTime=${article.readTime}`;
  const enhancedDesc = enhanceAcademyDescription({ ...article, title: localized.title, description: localized.description });

  // hreflang alternates — one per ACTIVE_LOCALES entry using locale-specific slugs
  const languages: Record<string, string> = {};

  // x-default points to the English unprefixed URL with the English slug
  languages["x-default"] = `https://askbiz.co/academy/${article.slug}`;

  // For each locale, build the URL with that locale's translated slug
  for (const l of ACTIVE_LOCALES) {
    const altSlug = await getLocalizedSlug(article.slug, l);
    languages[l] = `https://askbiz.co${localePath(`/academy/${altSlug}`, l)}`;
  }

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
  const locale = getRequestLocale();
  const article = await findArticleByAnySlug(params.article, locale);
  if (!article) notFound();

  const localizedArticle = await getLocalizedArticle(article, locale);

  // Build the canonical URL with the locale-specific slug
  const localizedSlug = await getLocalizedSlug(article.slug, locale);
  const canonicalUrl = `https://askbiz.co${localePath(`/academy/${localizedSlug}`, locale)}`;

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

  // Build a map of English slugs to their locale-specific slugs for the client
  // to use when building links. This ensures related article links use the
  // appropriate slugs for the current locale.
  const relatedSlugMap: Record<string, string> = {};
  for (const relArticle of relatedRaw) {
    relatedSlugMap[relArticle.slug] = await getLocalizedSlug(relArticle.slug, locale);
  }

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
      <AcademyArticleClient article={localizedArticle} blogCrossLinks={blogCrossLinks} relatedArticles={relatedArticles} relatedSlugMap={relatedSlugMap} />
    </>
  );
}
