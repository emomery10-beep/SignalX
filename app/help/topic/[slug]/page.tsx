import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  HELP_TOPICS,
  HELP_ARTICLES,
  getArticlesByTopic,
} from "@/lib/help-content";

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return HELP_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = HELP_TOPICS.find((t) => t.slug === params.slug);
  if (!topic) return {};

  const ogImageUrl = `https://askbiz.co/api/og?title=${encodeURIComponent(topic.title)}&category=${encodeURIComponent("AskBiz Help")}`;

  return {
    title: `${topic.title} | AskBiz Help`,
    description: topic.description,
    alternates: { canonical: `https://askbiz.co/help/topic/${topic.slug}` },
    openGraph: {
      title: `${topic.title} — AskBiz Help Center`,
      description: topic.description,
      url: `https://askbiz.co/help/topic/${topic.slug}`,
      type: "website",
      siteName: "AskBiz",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: topic.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${topic.title} | AskBiz Help`,
      description: topic.description,
      images: [ogImageUrl],
    },
  };
}

export default function TopicPage({ params }: Props) {
  const topic = HELP_TOPICS.find((t) => t.slug === params.slug);
  if (!topic) notFound();

  const articles = getArticlesByTopic(params.slug);
  const popularArticles = articles.filter((a) => a.popular);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
      { "@type": "ListItem", position: 2, name: "Help Center", item: "https://askbiz.co/help" },
      { "@type": "ListItem", position: 3, name: topic.title, item: `https://askbiz.co/help/topic/${topic.slug}` },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${topic.title} — AskBiz Help`,
    description: topic.description,
    url: `https://askbiz.co/help/topic/${topic.slug}`,
    publisher: { "@type": "Organization", name: "AskBiz", url: "https://askbiz.co" },
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      description: a.description,
      url: `https://askbiz.co/help/${a.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="hc-root">
        {/* ── Header ── */}
        <header className="hc-header">
          <div className="hc-header-inner">
            <Link href="/help" className="hc-brand">
              <svg className="hc-brand-icon" viewBox="0 0 28 28" fill="none" aria-hidden>
                <rect width="28" height="28" rx="7" fill="#d08a59"/>
                <path d="M7 14h14M14 7v14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <span className="hc-brand-name">AskBiz</span>
              <span className="hc-brand-sep">|</span>
              <span className="hc-brand-label">Help Centre</span>
            </Link>

            <nav className="hc-breadcrumb" aria-label="Breadcrumb">
              <ol className="hc-breadcrumb-list">
                <li><Link href="/help" className="hc-breadcrumb-link">Help Centre</Link></li>
                <li aria-hidden><span className="hc-breadcrumb-sep">›</span></li>
                <li className="hc-breadcrumb-current" aria-current="page">{topic.title}</li>
              </ol>
            </nav>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="hc-body">
          {/* Sidebar */}
          <aside className="hc-sidebar" aria-label="Help topics">
            <nav>
              {HELP_TOPICS.map((t) => {
                const isActive = t.slug === params.slug;
                const topicArticles = HELP_ARTICLES.filter((a) => a.topicSlug === t.slug);

                return (
                  <div key={t.slug} className="hc-nav-group">
                    <Link
                      href={`/help/topic/${t.slug}`}
                      className={`hc-nav-topic-link ${isActive ? "hc-nav-topic--active" : ""}`}
                    >
                      <span className="hc-nav-topic-icon" aria-hidden>{t.icon}</span>
                      <span className="hc-nav-topic-label">{t.title}</span>
                      {isActive && (
                        <span className="hc-nav-chevron hc-nav-chevron--open" aria-hidden>
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                      )}
                    </Link>

                    {isActive && (
                      <ul className="hc-nav-articles">
                        {topicArticles.map((a) => (
                          <li key={a.slug}>
                            <Link href={`/help/${a.slug}`} className="hc-nav-article">{a.title}</Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}

              <div className="hc-nav-divider" />
              <Link href="/rules" className="hc-nav-link">Rules &amp; Policies</Link>
              <Link href="/transparency" className="hc-nav-link">Transparency Centre</Link>
            </nav>
          </aside>

          {/* Main content */}
          <main className="hc-main tp-main">
            {/* Topic banner */}
            <div className="hc-topic-banner">
              <div className="hc-topic-banner-inner">
                <div className="hc-topic-banner-icon" aria-hidden>{topic.icon}</div>
                <div>
                  <h1 className="hc-topic-banner-title">{topic.title}</h1>
                  <p className="hc-topic-banner-desc">{topic.description}</p>
                  <span className="hc-tag">{articles.length} articles</span>
                </div>
              </div>
            </div>

            {/* Quick chips */}
            <div className="hc-quick-chips">
              {articles.slice(0, 5).map((a) => (
                <Link key={a.slug} href={`/help/${a.slug}`} className="hc-chip">{a.title}</Link>
              ))}
            </div>

            {/* Popular */}
            {popularArticles.length > 0 && (
              <section aria-labelledby="popular-heading" style={{ marginBottom: 28 }}>
                <h2 id="popular-heading" className="tp-section-title">Most Popular</h2>
                <div className="hc-article-list">
                  {popularArticles.map((a) => (
                    <Link key={a.slug} href={`/help/${a.slug}`} className="hc-article-row">
                      <div className="hc-article-row-body">
                        <span className="hc-article-row-title">{a.title}</span>
                        <span className="hc-article-row-desc">{a.description}</span>
                      </div>
                      <div className="hc-article-row-right">
                        <span className="hc-tag hc-tag--popular">Popular</span>
                        <span className="hc-tag">{a.readTime} min</span>
                        <svg className="hc-article-row-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All articles */}
            <section aria-labelledby="all-heading">
              <h2 id="all-heading" className="tp-section-title">All Articles</h2>
              <div className="hc-article-list">
                {articles.map((a) => (
                  <Link key={a.slug} href={`/help/${a.slug}`} className="hc-article-row">
                    <div className="hc-article-row-body">
                      <span className="hc-article-row-title">{a.title}</span>
                      <span className="hc-article-row-desc">{a.description}</span>
                    </div>
                    <div className="hc-article-row-right">
                      {a.popular && <span className="hc-tag hc-tag--popular">Popular</span>}
                      <span className="hc-tag">{a.readTime} min</span>
                      <svg className="hc-article-row-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --acc: #d08a59;
          --acc-light: #f5ebe0;
          --acc-dark: #b8743e;
          --tx: #1a1916;
          --tx2: #6b6760;
          --tx3: #a39e97;
          --sf: #ffffff;
          --bg: #f0f2f5;
          --el: #f3f2ef;
          --b: rgba(0,0,0,.1);
          --r: 10px;
          --r-sm: 6px;
          --font-head: 'Sora', 'DM Sans', system-ui, sans-serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
          --shadow-md: 0 4px 16px rgba(0,0,0,.08);
        }

        .hc-root { min-height: 100vh; background: var(--bg); font-family: var(--font-body); color: var(--tx); }

        /* Header */
        .hc-header { position: sticky; top: 0; z-index: 100; background: var(--sf); border-bottom: 1px solid var(--b); box-shadow: var(--shadow-sm); }
        .hc-header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; gap: 20px; }
        .hc-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
        .hc-brand-icon { width: 28px; height: 28px; flex-shrink: 0; }
        .hc-brand-name { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--tx); }
        .hc-brand-sep { color: var(--tx3); font-weight: 300; font-size: 18px; margin: 0 2px; }
        .hc-brand-label { font-size: 15px; font-weight: 500; color: var(--tx2); }
        .hc-breadcrumb { flex: 1; min-width: 0; }
        .hc-breadcrumb-list { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 2px; font-size: 13px; overflow: hidden; }
        .hc-breadcrumb-link { color: var(--tx2); text-decoration: none; white-space: nowrap; transition: color .15s; }
        .hc-breadcrumb-link:hover { color: var(--acc); }
        .hc-breadcrumb-sep { color: var(--tx3); padding: 0 4px; }
        .hc-breadcrumb-current { color: var(--tx); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }

        /* Body layout */
        .hc-body { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: flex-start; gap: 20px; min-height: calc(100vh - 56px); }

        /* Sidebar */
        .hc-sidebar { width: 260px; flex-shrink: 0; align-self: flex-start; background: var(--sf); border-right: 1px solid var(--b); height: calc(100vh - 56px); padding: 16px 0 32px; position: sticky; top: 56px; overflow-y: auto; }
        .hc-nav-group { border-bottom: 1px solid rgba(0,0,0,.05); }
        .hc-nav-topic-link { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: none; font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--tx); text-decoration: none; transition: background .12s; }
        .hc-nav-topic-link:hover { background: var(--el); }
        .hc-nav-topic--active { color: var(--acc); font-weight: 700; background: var(--acc-light); }
        .hc-nav-topic--active:hover { background: #eeddce; }
        .hc-nav-topic-icon { font-size: 16px; flex-shrink: 0; }
        .hc-nav-topic-label { flex: 1; }
        .hc-nav-chevron { color: var(--tx3); display: flex; transition: transform .2s; }
        .hc-nav-chevron--open { transform: rotate(180deg); }
        .hc-nav-articles { list-style: none; margin: 0; padding: 0 0 6px 0; background: rgba(208,138,89,.04); }
        .hc-nav-article { display: block; padding: 7px 16px 7px 42px; font-size: 13px; color: var(--tx2); text-decoration: none; transition: background .12s, color .12s; line-height: 1.4; }
        .hc-nav-article:hover { background: var(--el); color: var(--tx); }
        .hc-nav-divider { height: 1px; background: var(--b); margin: 12px 0; }
        .hc-nav-link { display: block; padding: 9px 16px; font-size: 13px; color: var(--tx2); text-decoration: none; transition: background .12s, color .12s; }
        .hc-nav-link:hover { background: var(--el); color: var(--tx); }

        /* Main */
        .hc-main { flex: 1; min-width: 0; }
        .tp-main { padding: 24px 0 48px; }
        .tp-section-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .06em; margin: 0 0 12px; }

        /* Topic banner */
        .hc-topic-banner { background: var(--sf); border: 1px solid var(--b); border-radius: var(--r); overflow: hidden; margin-bottom: 16px; }
        .hc-topic-banner-inner { padding: 28px 32px; display: flex; align-items: center; gap: 20px; }
        .hc-topic-banner-icon { font-size: 40px; width: 64px; height: 64px; display: flex; align-items: center; justify-content: center; background: var(--acc-light); border-radius: 14px; flex-shrink: 0; }
        .hc-topic-banner-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; margin: 0 0 6px; color: var(--tx); }
        .hc-topic-banner-desc { font-size: 14px; color: var(--tx2); margin: 0 0 10px; line-height: 1.5; }

        /* Chips */
        .hc-quick-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px; }
        .hc-chip { display: inline-block; padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--b); background: var(--sf); font-size: 13px; font-weight: 500; color: var(--tx); text-decoration: none; transition: border-color .15s, background .15s, color .15s; white-space: nowrap; }
        .hc-chip:hover { border-color: var(--acc); color: var(--acc-dark); background: var(--acc-light); }

        /* Article list */
        .hc-article-list { background: var(--sf); border: 1px solid var(--b); border-radius: var(--r); overflow: hidden; margin-bottom: 24px; }
        .hc-article-row { display: flex; align-items: center; gap: 16px; padding: 16px 20px; border-bottom: 1px solid rgba(0,0,0,.06); text-decoration: none; color: var(--tx); transition: background .12s; }
        .hc-article-row:last-child { border-bottom: none; }
        .hc-article-row:hover { background: var(--el); }
        .hc-article-row-body { flex: 1; min-width: 0; }
        .hc-article-row-title { display: block; font-size: 14px; font-weight: 600; color: var(--tx); margin-bottom: 3px; }
        .hc-article-row-desc { display: block; font-size: 13px; color: var(--tx2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .hc-article-row-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        .hc-article-row-arrow { color: var(--tx3); transition: color .12s, transform .12s; }
        .hc-article-row:hover .hc-article-row-arrow { color: var(--acc); transform: translateX(2px); }
        .hc-tag { font-size: 11px; font-weight: 500; color: var(--tx3); background: var(--el); padding: 3px 8px; border-radius: 100px; white-space: nowrap; }
        .hc-tag--popular { color: var(--acc-dark); background: var(--acc-light); font-weight: 600; }

        @media (max-width: 768px) {
          .hc-body { padding: 0; gap: 0; flex-direction: column; }
          .hc-sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--b); }
          .tp-main { padding: 16px 16px 40px; }
          .hc-article-row-desc { display: none; }
          .hc-tag:not(.hc-tag--popular) { display: none; }
          .hc-brand-label { display: none; }
          .hc-brand-sep { display: none; }
          .hc-breadcrumb { font-size: 11px; overflow: hidden; }
          .hc-breadcrumb-link { max-width: 60px; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }
        }
      `}}/>
    </>
  );
}
