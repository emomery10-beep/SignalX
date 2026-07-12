import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  HELP_TOPICS,
  HELP_ARTICLES,
  getArticlesByTopic,
} from "@/lib/help-content";
import "../../help.css";

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
        {/* Header */}
        <header className="hc-header">
          <div className="hc-header-inner">
            <Link href="/help" className="hc-brand">
              <div className="hc-brand-icon">
                <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                  <rect x="3" y="22" width="5" height="7" rx="1.5" fill="white" opacity="0.5"/>
                  <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                  <rect x="19" y="9" width="5" height="20" rx="1.5" fill="white"/>
                </svg>
              </div>
              <span className="hc-brand-name">AskBiz</span>
            </Link>
            <div className="hc-brand-divider" />
            <Link href="/help" className="hc-brand-label" style={{ textDecoration: 'none' }}>Help Centre</Link>

            <nav className="hc-breadcrumb" aria-label="Breadcrumb">
              <ol className="hc-breadcrumb-list">
                <li><Link href="/help" className="hc-breadcrumb-link">Help Centre</Link></li>
                <li><span className="hc-breadcrumb-sep">›</span></li>
                <li className="hc-breadcrumb-current">{topic.title}</li>
              </ol>
            </nav>
          </div>
        </header>

        {/* Body */}
        <div className="hc-body">
          {/* Sidebar */}
          <aside className="hc-sidebar" aria-label="Help topics">
            <p className="hc-nav-label">Topics</p>
            {HELP_TOPICS.map((t) => {
              const isActive = t.slug === params.slug;
              const topicArticles = HELP_ARTICLES.filter((a) => a.topicSlug === t.slug);

              return (
                <div key={t.slug} className="hc-nav-group">
                  <Link
                    href={`/help/topic/${t.slug}`}
                    className={`hc-nav-topic ${isActive ? "hc-nav-topic--active" : ""}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <span className="hc-nav-topic-icon">{t.icon}</span>
                    <span className="hc-nav-topic-label">{t.title}</span>
                    <span className="hc-nav-topic-count">{topicArticles.length}</span>
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
            <Link href="/rules" className="hc-nav-link">Rules & Policies</Link>
            <Link href="/transparency" className="hc-nav-link">Transparency Centre</Link>
          </aside>

          {/* Main */}
          <main className="hc-main" style={{ padding: '32px 0 64px 40px' }}>
            {/* Topic banner */}
            <div className="hc-topic-banner">
              <div className="hc-topic-banner-icon">{topic.icon}</div>
              <div>
                <h1 className="hc-topic-banner-title">{topic.title}</h1>
                <p className="hc-topic-banner-desc">{topic.description}</p>
                <span className="hc-tag">{articles.length} articles</span>
              </div>
            </div>

            {/* Quick chips */}
            <div className="hc-chips">
              {articles.slice(0, 5).map((a) => (
                <Link key={a.slug} href={`/help/${a.slug}`} className="hc-chip">{a.title}</Link>
              ))}
            </div>

            {/* Popular */}
            {popularArticles.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <h2 className="hc-section-title" style={{ fontSize: 12, color: 'var(--hc-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Most Popular</h2>
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
                        <svg className="hc-article-row-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All articles */}
            <section>
              <h2 className="hc-section-title" style={{ fontSize: 12, color: 'var(--hc-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>All Articles</h2>
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
                      <svg className="hc-article-row-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
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
    </>
  );
}
