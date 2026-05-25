"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { HelpArticle, HelpTopic } from "@/lib/help-content";
import { HELP_TOPICS, HELP_ARTICLES } from "@/lib/help-content";
import "../help.css";

interface Props {
  article: HelpArticle;
  topic: HelpTopic | undefined;
  topicArticles: HelpArticle[];
  relatedArticles: HelpArticle[];
}

// ── Simple markdown-lite renderer ────────────────────────────────────────────
function renderBody(body: string): React.ReactNode {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="art-list">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: inlineFormat(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) { flushList(); continue; }
    if (trimmed.startsWith("- ")) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList();
      elements.push(<p key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />);
    }
  }
  flushList();
  return elements;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

// ── FAQ Accordion ────────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`art-faq-item ${open ? "art-faq-item--open" : ""}`}>
      <button className="art-faq-q" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{q}</span>
        <span className="art-faq-icon" aria-hidden>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="art-faq-a">
          <p dangerouslySetInnerHTML={{ __html: inlineFormat(a) }} />
        </div>
      )}
    </div>
  );
}

// ── Star rating + feedback ──────────────────────────────────────────────────
const FEEDBACK_REASONS = ['Inaccurate', 'Outdated', 'Too technical', 'Missing info', 'Other'];

function StarRating({ articleSlug, articleTitle }: { articleSlug: string; articleTitle: string }) {
  const [rating,  setRating]  = useState(0);
  const [hover,   setHover]   = useState(0);
  const [phase,   setPhase]   = useState<'rate' | 'reasons' | 'done'>('rate');
  const [reasons, setReasons] = useState<Set<string>>(new Set());

  const toggle = (r: string) => setReasons(prev => {
    const n = new Set(prev); n.has(r) ? n.delete(r) : n.add(r); return n;
  });

  if (phase === 'done') {
    return (
      <div className="art-feedback">
        <p className="art-feedback-q" style={{ color: "#2e7d32", marginBottom: 8 }}>
          {rating >= 4 ? "Thanks for your feedback!" : "Thanks — we'll use your feedback to improve this article."}
        </p>
        {rating <= 2 && (
          <>
            <p style={{ fontSize: 13, color: "var(--hc-secondary)", margin: "0 0 12px" }}>Still need help?</p>
            <div className="art-escalate">
              <a href={`mailto:hello@askbiz.co?subject=Help: ${encodeURIComponent(articleTitle)}&body=Article: https://askbiz.co/help/${articleSlug}%0AProblems: ${[...reasons].join(', ')}%0A%0ADetails: `}
                className="art-esc-btn art-esc-btn--primary">Email support</a>
              <a href="https://cal.com/askbiz/support" target="_blank" rel="noopener noreferrer"
                className="art-esc-btn">Schedule a call</a>
              <Link href="/help/faq" className="art-esc-btn">Browse FAQ</Link>
            </div>
          </>
        )}
      </div>
    );
  }

  if (phase === 'reasons') {
    return (
      <div className="art-feedback">
        <p className="art-feedback-q">What could we improve? <span style={{ fontWeight: 400, fontSize: 13, color: "var(--hc-secondary)" }}>(optional)</span></p>
        <div className="art-reasons">
          {FEEDBACK_REASONS.map(r => (
            <button key={r}
              className={`art-reason ${reasons.has(r) ? "art-reason--on" : ""}`}
              onClick={() => toggle(r)}>
              {r}
            </button>
          ))}
        </div>
        <button className="art-esc-btn art-esc-btn--primary" style={{ marginTop: 14 }}
          onClick={() => setPhase('done')}>
          Submit feedback
        </button>
      </div>
    );
  }

  return (
    <div className="art-feedback">
      <p className="art-feedback-q">Was this article helpful?</p>
      <div className="art-stars" role="group" aria-label="Rate this article">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} className={`art-star ${n <= (hover || rating) ? "art-star--on" : ""}`}
            onClick={() => { setRating(n); setPhase(n <= 3 ? 'reasons' : 'done'); }}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </button>
        ))}
      </div>
      <p className="art-feedback-contact">
        Still stuck?{" "}
        <a href="mailto:hello@askbiz.co" className="art-feedback-link">Email our support team</a>.
      </p>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function ArticleClient({ article, topic, topicArticles, relatedArticles }: Props) {
  const [copied,         setCopied]         = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop,  setShowBackToTop]  = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set([article.topicSlug]));

  const bodyRef = useRef<HTMLDivElement>(null);

  // Reading progress + back-to-top
  useEffect(() => {
    const fn = () => {
      const el  = document.documentElement;
      const scrolled = el.scrollTop;
      const total    = el.scrollHeight - el.clientHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
      setShowBackToTop(scrolled > 400);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Click-to-copy on inline <code> elements
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const codes = body.querySelectorAll<HTMLElement>("code");
    codes.forEach((code) => {
      if (code.dataset.cp) return;
      code.dataset.cp = "1";
      code.title = "Click to copy";
      code.style.cursor = "pointer";
      code.addEventListener("click", () => {
        navigator.clipboard.writeText(code.textContent || "").then(() => {
          const was = code.style.background;
          code.style.background = "#d4edda";
          setTimeout(() => { code.style.background = was; }, 1200);
        });
      });
    });
  }, [article.slug]);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleTopic = (slug: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) { next.delete(slug); } else { next.add(slug); }
      return next;
    });
  };

  return (
    <>
      {/* Reading progress bar */}
      <div className="art-progress" aria-hidden style={{ width: `${scrollProgress}%` }} />

      <div className="hc-root">
        {/* ── Header ── */}
        <header className="hc-header">
          <div className="hc-header-inner">
            <Link href="/help" className="hc-brand">
              <div className="hc-brand-icon">
                <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
                  <rect x="3"  y="22" width="5" height="7"  rx="1.5" fill="white" opacity="0.5"/>
                  <rect x="11" y="16" width="5" height="13" rx="1.5" fill="white" opacity="0.75"/>
                  <rect x="19" y="9"  width="5" height="20" rx="1.5" fill="white"/>
                </svg>
              </div>
              <span className="hc-brand-name">AskBiz</span>
            </Link>
            <div className="hc-brand-divider" />
            <Link href="/help" className="hc-brand-label" style={{ textDecoration: 'none' }}>Help Centre</Link>

            {/* Breadcrumb */}
            <nav className="hc-breadcrumb" aria-label="Breadcrumb">
              <ol className="hc-breadcrumb-list">
                <li><Link href="/help" className="hc-breadcrumb-link">Help Centre</Link></li>
                <li><span className="hc-breadcrumb-sep">›</span></li>
                <li><Link href={`/help/topic/${article.topicSlug}`} className="hc-breadcrumb-link">{article.topic}</Link></li>
                <li><span className="hc-breadcrumb-sep">›</span></li>
                <li className="hc-breadcrumb-current">{article.title}</li>
              </ol>
            </nav>
          </div>
        </header>

        {/* ── Body ── */}
        <div className="hc-body">
          {/* ── Sidebar ── */}
          <aside className="hc-sidebar" aria-label="Help topics">
            <p className="hc-nav-label">Topics</p>
            {HELP_TOPICS.map((t) => {
              const isCurrentTopic = t.slug === article.topicSlug;
              const isExpanded = expandedTopics.has(t.slug);
              const articles = HELP_ARTICLES.filter((a) => a.topicSlug === t.slug);

              return (
                <div key={t.slug} className="hc-nav-group">
                  <button
                    className={`hc-nav-topic ${isCurrentTopic ? "hc-nav-topic--active" : ""}`}
                    onClick={() => toggleTopic(t.slug)}
                    aria-expanded={isExpanded}
                  >
                    <span className="hc-nav-topic-icon">{t.icon}</span>
                    <span className="hc-nav-topic-label">{t.title}</span>
                    <span className={`hc-nav-chevron ${isExpanded ? "hc-nav-chevron--open" : ""}`}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </button>

                  {isExpanded && (
                    <ul className="hc-nav-articles">
                      {articles.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={`/help/${a.slug}`}
                            className={`hc-nav-article ${a.slug === article.slug ? "hc-nav-article--active" : ""}`}
                          >
                            {a.title}
                          </Link>
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

          {/* ── Article content ── */}
          <main className="hc-main art-main" id="main-content">
            {/* Article header */}
            <header className="art-header">
              <div className="art-header-meta">
                <span className="hc-tag hc-tag--topic">{article.topic}</span>
                <span className="art-meta-sep">·</span>
                <span className="art-read-time">{article.readTime} min read</span>
                <span className="art-meta-sep">·</span>
                <span className="art-updated">
                  Updated {new Date(article.lastUpdated).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </span>
              </div>
              <h1 className="art-title">{article.title}</h1>
              <p className="art-description">{article.description}</p>

              <div className="art-actions">
                <button className="art-btn" onClick={copyLink}>
                  {copied ? (
                    <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied!</>
                  ) : (
                    <><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="4" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 5v7a1.5 1.5 0 001.5 1.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> Copy link</>
                  )}
                </button>
                <button className="art-btn" onClick={() => window.print()}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polyline points="6 9 6 2 18 2 18 9" stroke="currentColor" strokeWidth="1.6"/>
                    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" stroke="currentColor" strokeWidth="1.6"/>
                    <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                  Print
                </button>
              </div>
            </header>

            {/* Table of contents */}
            {article.content.length >= 3 && (
              <nav className="art-toc" aria-label="Table of contents">
                <p className="art-toc-label">On this page</p>
                <ol className="art-toc-list">
                  {article.content.map((section, i) => (
                    <li key={i}>
                      <a href={`#section-${i}`} className="art-toc-link">{section.heading}</a>
                    </li>
                  ))}
                  {article.faq && article.faq.length > 0 && (
                    <li><a href="#faq" className="art-toc-link">Frequently Asked Questions</a></li>
                  )}
                </ol>
              </nav>
            )}

            {/* Article sections */}
            <div className="art-body" ref={bodyRef}>
              {article.content.map((section, i) => (
                <section key={i} id={`section-${i}`} className="art-section">
                  <h2 className="art-section-heading">
                    {section.heading}
                    <a href={`#section-${i}`} className="art-anchor" aria-label={`Link to section: ${section.heading}`}
                      onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(`${window.location.href.split('#')[0]}#section-${i}`); }}>
                      #
                    </a>
                  </h2>
                  <div className="art-section-body">{renderBody(section.body)}</div>
                </section>
              ))}
            </div>

            {/* FAQ */}
            {article.faq && article.faq.length > 0 && (
              <section id="faq" className="art-faq" aria-labelledby="faq-heading">
                <h2 id="faq-heading" className="art-faq-title">Frequently Asked Questions</h2>
                <div className="art-faq-list">
                  {article.faq.map((item, i) => (
                    <FAQItem key={i} q={item.q} a={item.a} />
                  ))}
                </div>
              </section>
            )}

            {/* Related articles */}
            {relatedArticles.length > 0 && (
              <section id="related" className="art-related" aria-labelledby="related-heading">
                <h2 id="related-heading" className="art-related-title">Related Articles</h2>
                <div className="art-related-grid">
                  {relatedArticles.map((a) => (
                    <Link key={a.slug} href={`/help/${a.slug}`} className="art-related-card">
                      <span className="art-related-topic">{a.topic}</span>
                      <span className="art-related-title-text">{a.title}</span>
                      <span className="art-related-desc">{a.description}</span>
                      <span className="art-related-arrow">Read article →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Still need help? — X-style self-service first, then escalation */}
            <div style={{
              borderTop: '1px solid var(--hc-border)',
              paddingTop: 32,
              marginBottom: 32,
            }}>
              <StarRating articleSlug={article.slug} articleTitle={article.title} />
            </div>
          </main>
        </div>
      </div>

      {/* Back to top */}
      {showBackToTop && (
        <button
          className="art-back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}
    </>
  );
}
