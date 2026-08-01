import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies, headers } from 'next/headers';
import { resolveLocale, localePath, ACTIVE_LOCALES, isRTL } from '@/lib/i18n-locale';
import { academyCategories, academyArticles } from "@/lib/academy-content";
import { preloadLocaleTranslations, getLocalizedListFields, getLocalizedSlug } from "@/lib/academy-i18n-loader";
import LanguageToggle from '@/components/LanguageToggle';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return academyCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = academyCategories.find((c) => c.slug === params.slug);
  if (!category) return {};

  const locale = resolveLocale({ urlLocale: headers().get('x-locale'), cookie: cookies().get('askbiz_lang')?.value });
  const path = `/academy/category/${category.slug}`;
  const canonical = `https://askbiz.co${localePath(path, locale)}`;

  // Reciprocal hreflang set — same "x-default" + one entry per active locale
  // pattern as the homepage (see HREFLANG_LANGUAGES in lib/landing-meta.ts /
  // the so/so-SO/so-DJ entries in app/layout.tsx), generated here via
  // localePath() so it stays correct if ACTIVE_LOCALES ever changes.
  const languages: Record<string, string> = {
    "x-default": `https://askbiz.co${path}`,
  };
  for (const l of ACTIVE_LOCALES) {
    languages[l] = `https://askbiz.co${localePath(path, l)}`;
  }

  const ogImageUrl = `https://askbiz.co/api/og?title=${encodeURIComponent(category.title)}&category=${encodeURIComponent("AskBiz Academy")}`;

  return {
    title: `${category.title} Guides | AskBiz Academy`,
    description: `${category.description} Browse ${category.articleCount}+ free guides written for SME founders.`,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: `${category.title} — Free Business Guides | AskBiz Academy`,
      description: category.description,
      url: canonical,
      type: "website",
      siteName: "AskBiz Academy",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: category.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title} Guides | AskBiz Academy`,
      description: category.description,
      images: [ogImageUrl],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const lang = resolveLocale({ urlLocale: headers().get('x-locale'), cookie: cookies().get('askbiz_lang')?.value })
  const rtl = isRTL(lang)
  const category = academyCategories.find((c) => c.slug === params.slug);
  if (!category) notFound();

  const articles = academyArticles.filter((a) => a.categorySlug === params.slug);
  // List-friendly localization — English fallback today (no translations
  // authored yet), forward-compatible once lib/academy-i18n/<locale> gains
  // content. See lib/academy-i18n-loader.ts.
  const translations = await preloadLocaleTranslations(lang);

  // Build a map of article English slugs to their locale-specific slugs
  const articleSlugMap: Record<string, string> = {};
  for (const article of articles) {
    articleSlugMap[article.slug] = await getLocalizedSlug(article.slug, lang);
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
      { "@type": "ListItem", position: 2, name: "Academy", item: "https://askbiz.co/academy" },
      { "@type": "ListItem", position: 3, name: category.title, item: `https://askbiz.co/academy/category/${category.slug}` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.title} — AskBiz Academy`,
    description: category.description,
    url: `https://askbiz.co/academy/category/${category.slug}`,
    inLanguage: lang,
    publisher: { "@type": "Organization", name: "AskBiz", url: "https://askbiz.co" },
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      description: a.description,
      url: `https://askbiz.co/academy/${articleSlugMap[a.slug]}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <main style={{ fontFamily: "DM Sans, sans-serif", background: "#f9f8f6", minHeight: "100vh" }}>
        <style>{`
          a:focus-visible, button:focus-visible {
            outline: 2px solid #d08a59;
            outline-offset: 2px;
            border-radius: 4px;
          }
        `}</style>
        {/* Breadcrumb */}
        <div style={{ background: "#fff", borderBottom: "1px solid #eee", padding: "12px 24px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 11, color: "#6a655c" }}>
              <Link href={localePath('/', lang)} style={{ color: "#6a655c", textDecoration: "none" }}>Home</Link>
              {" / "}
              <Link href={localePath('/academy', lang)} style={{ color: "#6a655c", textDecoration: "none" }}>Academy</Link>
              {" / "}
              <span style={{ color: "#1a1a2e" }}>{category.title}</span>
            </div>
            <LanguageToggle compact />
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
          {/* Category Header */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ fontSize: 38, marginBottom: 12 }}>{category.icon}</div>
            <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 700, color: "#1a1a2e", margin: "0 0 12px" }}>
              {category.title}
            </h1>
            <p style={{ fontSize: 16, color: "#555", lineHeight: 1.7, maxWidth: 640, margin: "0 0 8px" }}>
              {category.description}
            </p>
            <p style={{ fontSize: 12, color: "#6a655c" }}>{articles.length} articles</p>
          </div>

          {/* Article Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
            {articles.map((article) => {
              const { title, description } = getLocalizedListFields(article, lang, translations);
              const localizedSlug = articleSlugMap[article.slug] ?? article.slug;
              return (
                <Link
                  key={article.slug}
                  href={localePath(`/academy/${localizedSlug}`, lang)}
                  style={{
                    display: "block",
                    background: "#fff",
                    borderRadius: 12,
                    border: "1px solid #eee",
                    padding: "20px 22px",
                    textDecoration: "none",
                    color: "#1a1a2e",
                    transition: "box-shadow 0.15s",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 9, fontWeight: 600, color: "#6a655c", background: "#f5f5f5", padding: "3px 8px", borderRadius: 10 }}>
                      {article.difficulty}
                    </span>
                    <span style={{ fontSize: 9, color: "#bbb", padding: "3px 0" }}>
                      {article.readTime} min
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "Sora, sans-serif", fontSize: 14, fontWeight: 700, margin: "0 0 8px", lineHeight: 1.3 }}>
                    {title}
                  </h2>
                  <p style={{ fontSize: 11, color: "#666", lineHeight: 1.6, margin: 0 }}>
                    {description}
                  </p>
                </Link>
              );
            })}
          </div>

          {articles.length === 0 && (
            <p style={{ color: "#6a655c", textAlign: "center", padding: "60px 0" }}>
              No articles in this category yet. Check back soon.
            </p>
          )}

          <div style={{ marginTop: 48, textAlign: "center" }}>
            <Link href={localePath('/academy', lang)} style={{ color: "#d08a59", fontWeight: 600, textDecoration: "none", fontSize: 13 }}>
              {rtl ? '→' : '←'} Back to all Academy articles
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
