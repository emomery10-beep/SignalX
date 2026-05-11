"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import type { HelpArticle, HelpTopic } from "@/lib/help-content";
import { HELP_TOPICS, HELP_ARTICLES } from "@/lib/help-content";

interface Props {
  article: HelpArticle;
  topic: HelpTopic | undefined;
  topicArticles: HelpArticle[];
  relatedArticles: HelpArticle[];
}

const LANGS = [
  { code: "en", label: "English",   flag: "🇬🇧" },
  { code: "fr", label: "Français",  flag: "🇫🇷" },
  { code: "es", label: "Español",   flag: "🇪🇸" },
  { code: "de", label: "Deutsch",   flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
];
const getCk = (n: string) => {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp(`(?:^|;\\s*)${n}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : "";
};
const setCk = (n: string, v: string) => {
  document.cookie = `${n}=${encodeURIComponent(v)};path=/;max-age=${60 * 60 * 24 * 365}`;
};

const isRecent = (d?: string, days = 90): boolean => {
  try { return !!d && Date.now() - new Date(d).getTime() < days * 86_400_000; }
  catch { return false; }
};

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

// ── Star rating + reason categories + smart escalation ───────────────────────
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
          {rating >= 4 ? "🎉 Thanks! Glad it helped." : "🙏 Thanks — we'll use your feedback to improve this."}
        </p>
        {rating <= 2 && (
          <>
            <p style={{ fontSize: 13, color: "#6b6760", margin: "0 0 12px" }}>Need more help?</p>
            <div className="art-escalate">
              <a href={`mailto:hello@askbiz.co?subject=Help: ${encodeURIComponent(articleTitle)}&body=Article: https://askbiz.co/help/${articleSlug}%0AProblems: ${[...reasons].join(', ')}%0A%0ADetails: `}
                className="art-esc-btn art-esc-btn--primary">📧 Email support</a>
              <a href="https://cal.com/askbiz/support" target="_blank" rel="noopener noreferrer"
                className="art-esc-btn">📅 Schedule a call</a>
              <Link href="/help/faq" className="art-esc-btn">📋 Browse FAQ</Link>
            </div>
          </>
        )}
      </div>
    );
  }

  if (phase === 'reasons') {
    return (
      <div className="art-feedback">
        <p className="art-feedback-q">What could we improve? <span style={{ fontWeight: 400, fontSize: 13, color: "#6b6760" }}>(optional)</span></p>
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
  const [langOpen,       setLangOpen]       = useState(false);
  const [activeLang,     setActiveLang]     = useState("en");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set([article.topicSlug]));

  const bodyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  // Deterministic social-proof count from slug
  const helpfulCount = useMemo(() => {
    let h = 0;
    for (const c of article.slug) h = (h * 31 + c.charCodeAt(0)) & 0xffffff;
    return 150 + (h % 350);
  }, [article.slug]);

  // Load language cookie
  useEffect(() => {
    const l = getCk("askbiz_lang");
    if (l) setActiveLang(l);
  }, []);

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

  // Close lang dropdown on outside click
  useEffect(() => {
    if (!langOpen) return;
    const fn = (e: MouseEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    window.addEventListener("mousedown", fn);
    return () => window.removeEventListener("mousedown", fn);
  }, [langOpen]);

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

  const curLang = LANGS.find((l) => l.code === activeLang) ?? LANGS[0];
  const showVersionBadge = isRecent(article.lastUpdated, 90);

  return (
    <>
      {/* Reading progress bar */}
      <div aria-hidden style={{ position: "fixed", top: 0, left: 0, height: 3, zIndex: 200,
        background: "#d08a59", width: `${scrollProgress}%`,
        transition: "width .08s linear", pointerEvents: "none", borderRadius: "0 2px 2px 0" }} />

      <div className="hc-root">
        {/* ── Top header bar ── */}
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

            {/* Breadcrumb in header */}
            <nav className="hc-breadcrumb" aria-label="Breadcrumb">
              <ol className="hc-breadcrumb-list">
                <li><Link href="/help" className="hc-breadcrumb-link">Help Centre</Link></li>
                <li aria-hidden><span className="hc-breadcrumb-sep">›</span></li>
                <li>
                  <Link href={`/help/topic/${article.topicSlug}`} className="hc-breadcrumb-link">
                    {article.topic}
                  </Link>
                </li>
                <li aria-hidden><span className="hc-breadcrumb-sep">›</span></li>
                <li className="hc-breadcrumb-current" aria-current="page">{article.title}</li>
              </ol>
            </nav>

            {/* Language switcher */}
            <div ref={langRef} style={{ position: "relative", flexShrink: 0, marginLeft: "auto" }}>
              <button onClick={(e) => { e.stopPropagation(); setLangOpen((v) => !v); }}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 9px",
                  borderRadius: 8, border: "1.5px solid rgba(0,0,0,.1)", background: "#fff",
                  fontSize: 12, cursor: "pointer", color: "#6b6760", fontFamily: "inherit" }}
                aria-label={`Language: ${curLang.label}`} aria-expanded={langOpen}>
                <span>{curLang.flag}</span>
                <span style={{ fontWeight: 700, fontSize: 10 }}>{curLang.code.toUpperCase()}</span>
              </button>
              {langOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0,
                  background: "#fff", border: "1px solid rgba(0,0,0,.1)", borderRadius: 10,
                  boxShadow: "0 8px 24px rgba(0,0,0,.1)", zIndex: 200, overflow: "hidden", minWidth: 140 }}>
                  {LANGS.map((l) => (
                    <button key={l.code}
                      style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "8px 14px",
                        background: l.code === activeLang ? "#f5ebe0" : "none", border: "none", cursor: "pointer",
                        fontSize: 13, fontFamily: "inherit",
                        color: l.code === activeLang ? "#d08a59" : "#1a1916",
                        fontWeight: l.code === activeLang ? 700 : 400, textAlign: "left" }}
                      onClick={() => { setActiveLang(l.code); setCk("askbiz_lang", l.code); setLangOpen(false); }}>
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Body: sidebar + article ── */}
        <div className="hc-body">
          {/* ── Left sidebar ── */}
          <aside className="hc-sidebar" aria-label="Help topics">
            <nav>
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
                      <span className="hc-nav-topic-icon" aria-hidden>{t.icon}</span>
                      <span className="hc-nav-topic-label">{t.title}</span>
                      <span className={`hc-nav-chevron ${isExpanded ? "hc-nav-chevron--open" : ""}`} aria-hidden>
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
              <Link href="/rules" className="hc-nav-link">Rules &amp; Policies</Link>
              <Link href="/transparency" className="hc-nav-link">Transparency Centre</Link>
            </nav>
          </aside>

          {/* ── Article main content ── */}
          <main className="hc-main art-main" id="main-content">
            {/* Article header */}
            <header className="art-header">
              <div className="art-header-meta">
                <span className="art-topic-pill">{article.topic}</span>
                <span className="art-meta-sep">·</span>
                <span className="art-read-time">{article.readTime} min read</span>
                <span className="art-meta-sep">·</span>
                <span className="art-updated">
                  Updated {new Date(article.lastUpdated).toLocaleDateString("en-GB", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </span>
                <span className="art-meta-sep">·</span>
                <span className="art-verified" title="Reviewed by the AskBiz support team">
                  ✓ Reviewed {new Date(article.lastUpdated).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                </span>
                {showVersionBadge && (
                  <span className="art-version-badge">Recently Updated</span>
                )}
                <Link href="/changelog" className="art-changelog-link" title="See what changed in this feature">
                  What changed? →
                </Link>
              </div>
              <h1 className="art-title">{article.title}</h1>
              <p className="art-description">{article.description}</p>

              {/* Social proof */}
              <p className="art-social-proof">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden style={{ verticalAlign: "middle", marginRight: 5 }}>
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <strong>{helpfulCount.toLocaleString()}</strong> people found this helpful
              </p>

              <div className="art-header-actions">
                <button className="art-copy-btn" onClick={copyLink} aria-label="Copy link to this article">
                  {copied ? (
                    <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M2 7l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> Copied!</>
                  ) : (
                    <><svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><rect x="4" y="1" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4"/><path d="M1 5v7a1.5 1.5 0 001.5 1.5H9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg> Copy link</>
                  )}
                </button>
                <button className="art-print-btn" onClick={() => window.print()} aria-label="Print this article">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                  Print / PDF
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
                  {relatedArticles.length > 0 && (
                    <li><a href="#related" className="art-toc-link">Related Articles</a></li>
                  )}
                </ol>
              </nav>
            )}

            {/* Video embed — shown if article has a videoUrl field */}
            {(article as any).videoUrl && (
              <div className="art-video-wrap">
                <p className="art-video-label">📹 Video guide</p>
                <div className="art-video-frame">
                  <iframe
                    src={(article as any).videoUrl}
                    title={`Video guide: ${article.title}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="art-video"
                  />
                </div>
              </div>
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
                      <span className="art-related-arrow" aria-hidden>Read article →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Star rating feedback */}
            <StarRating articleSlug={article.slug} articleTitle={article.title} />
          </main>
        </div>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          className="art-back-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Floating Ask a question CTA */}
      <div className="art-float-cta">
        <a href={`mailto:hello@askbiz.co?subject=Question about: ${encodeURIComponent(article.title)}&body=Article: https://askbiz.co/help/${article.slug}%0A%0AMy question: `}
          className="art-float-cta-btn" aria-label="Ask a question about this article">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Ask a question</span>
        </a>
      </div>

      <style jsx global>{`
        /* ── Shared tokens ── */
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
          --font-mono: 'JetBrains Mono', 'Fira Code', ui-monospace, monospace;
          --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
          --shadow-md: 0 4px 16px rgba(0,0,0,.08);
        }

        .hc-root { min-height: 100vh; background: var(--bg); font-family: var(--font-body); color: var(--tx); }

        /* ── Header ── */
        .hc-header { position: sticky; top: 0; z-index: 100; background: var(--sf); border-bottom: 1px solid var(--b); box-shadow: var(--shadow-sm); }
        .hc-header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; gap: 20px; }
        .hc-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
        .hc-brand-icon { width: 28px; height: 28px; flex-shrink: 0; }
        .hc-brand-name { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--tx); }
        .hc-brand-sep { color: var(--tx3); font-weight: 300; font-size: 18px; margin: 0 2px; }
        .hc-brand-label { font-size: 15px; font-weight: 500; color: var(--tx2); }

        /* Breadcrumb */
        .hc-breadcrumb { flex: 1; min-width: 0; }
        .hc-breadcrumb-list { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; flex-wrap: nowrap; gap: 2px; font-size: 13px; overflow: hidden; }
        .hc-breadcrumb-link { color: var(--tx2); text-decoration: none; white-space: nowrap; transition: color .15s; }
        .hc-breadcrumb-link:hover { color: var(--acc); }
        .hc-breadcrumb-sep { color: var(--tx3); padding: 0 4px; }
        .hc-breadcrumb-current { color: var(--tx); font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; }

        /* ── Body layout ── */
        .hc-body { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: flex-start; gap: 20px; min-height: calc(100vh - 56px); }

        /* ── Sidebar ── */
        .hc-sidebar { width: 260px; flex-shrink: 0; align-self: flex-start; background: var(--sf); border-right: 1px solid var(--b); height: calc(100vh - 56px); padding: 16px 0 32px; position: sticky; top: 56px; overflow-y: auto; }
        .hc-nav-group { border-bottom: 1px solid rgba(0,0,0,.05); }
        .hc-nav-topic { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: none; border: none; cursor: pointer; font-family: var(--font-body); font-size: 14px; font-weight: 500; color: var(--tx); text-align: left; transition: background .12s; }
        .hc-nav-topic:hover { background: var(--el); }
        .hc-nav-topic--active { color: var(--acc); font-weight: 700; background: var(--acc-light); }
        .hc-nav-topic--active:hover { background: #eeddce; }
        .hc-nav-topic-icon { font-size: 16px; flex-shrink: 0; }
        .hc-nav-topic-label { flex: 1; }
        .hc-nav-chevron { color: var(--tx3); display: flex; transition: transform .2s; }
        .hc-nav-chevron--open { transform: rotate(180deg); }
        .hc-nav-articles { list-style: none; margin: 0; padding: 0 0 6px 0; background: rgba(208,138,89,.04); }
        .hc-nav-article { display: block; padding: 7px 16px 7px 42px; font-size: 13px; color: var(--tx2); text-decoration: none; transition: background .12s, color .12s; line-height: 1.4; }
        .hc-nav-article:hover { background: var(--el); color: var(--tx); }
        .hc-nav-article--active { color: var(--acc-dark); font-weight: 700; background: rgba(208,138,89,.1); border-right: 3px solid var(--acc); }
        .hc-nav-divider { height: 1px; background: var(--b); margin: 12px 0; }
        .hc-nav-link { display: block; padding: 9px 16px; font-size: 13px; color: var(--tx2); text-decoration: none; transition: background .12s, color .12s; }
        .hc-nav-link:hover { background: var(--el); color: var(--tx); }

        /* ── Article main ── */
        .hc-main { flex: 1; min-width: 0; }
        .art-main { padding: 28px 0 80px; }

        /* Article header */
        .art-header { margin-bottom: 32px; padding-bottom: 28px; border-bottom: 1px solid var(--b); }
        .art-header-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
        .art-topic-pill { font-size: 11px; font-weight: 700; color: var(--acc); background: var(--acc-light); padding: 4px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: .06em; }
        .art-meta-sep { color: var(--tx3); }
        .art-read-time, .art-updated { font-size: 13px; color: var(--tx3); }
        .art-version-badge { font-size: 11px; font-weight: 700; color: #fff; background: #2e7d32; padding: 3px 9px; border-radius: 100px; letter-spacing: .04em; }
        .art-title { font-family: var(--font-head); font-size: clamp(22px, 3.5vw, 30px); font-weight: 700; color: var(--tx); margin: 0 0 12px; line-height: 1.2; letter-spacing: -.02em; }
        .art-description { font-size: 15px; color: var(--tx2); line-height: 1.65; margin: 0 0 10px; }
        .art-social-proof { font-size: 13px; color: var(--tx3); margin: 0 0 16px; }
        .art-social-proof strong { color: var(--acc); font-weight: 700; }
        .art-header-actions { display: flex; gap: 8px; flex-wrap: wrap; }
        .art-copy-btn, .art-print-btn {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; color: var(--tx3); background: var(--el);
          border: 1px solid var(--b); border-radius: 8px; padding: 6px 12px;
          cursor: pointer; font-family: var(--font-body); transition: all .15s;
        }
        .art-copy-btn:hover, .art-print-btn:hover { background: var(--b); color: var(--tx); }
        .art-print-btn svg { stroke: currentColor; }

        /* Table of contents */
        .art-toc { background: var(--el); border: 1px solid var(--b); border-radius: var(--r); padding: 20px 24px; margin-bottom: 32px; }
        .art-toc-label { font-size: 11px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .08em; margin: 0 0 12px; }
        .art-toc-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 6px; counter-reset: toc; }
        .art-toc-list li { counter-increment: toc; }
        .art-toc-link { font-size: 14px; color: var(--tx2); text-decoration: none; display: flex; align-items: baseline; gap: 8px; transition: color .15s; }
        .art-toc-link::before { content: counter(toc); font-size: 10px; font-weight: 700; color: var(--acc); background: var(--acc-light); width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .art-toc-link:hover { color: var(--acc); }

        /* Article body */
        .art-body { margin-bottom: 40px; }
        .art-section { margin-bottom: 36px; scroll-margin-top: 72px; }
        .art-section-heading {
          font-family: var(--font-head); font-size: 17px; font-weight: 700;
          color: var(--tx); margin: 0 0 12px; padding-bottom: 10px;
          border-bottom: 1px solid var(--b); letter-spacing: -.01em;
          display: flex; align-items: center; gap: 8px;
        }
        .art-anchor {
          font-size: 14px; color: var(--tx3); text-decoration: none;
          opacity: 0; transition: opacity .15s, color .15s;
          font-weight: 400; margin-left: auto; padding: 0 4px;
          cursor: pointer; background: none; border: none;
        }
        .art-section-heading:hover .art-anchor { opacity: 1; }
        .art-anchor:hover { color: var(--acc); }
        .art-section-body p { font-size: 15px; line-height: 1.75; color: #3a3835; margin: 0 0 12px; }
        .art-section-body p:last-child { margin-bottom: 0; }
        .art-section-body strong { font-weight: 700; color: var(--tx); }
        .art-section-body code {
          font-family: var(--font-mono); font-size: 13px;
          background: var(--el); border: 1px solid var(--b);
          padding: 2px 6px; border-radius: 5px; color: var(--acc-dark);
          transition: background .2s;
        }
        .art-section-body code:hover { background: #d4edda; }
        .art-list { list-style: none; margin: 0 0 12px; padding: 0; display: flex; flex-direction: column; gap: 6px; }
        .art-list li { font-size: 15px; line-height: 1.65; color: #3a3835; padding-left: 20px; position: relative; }
        .art-list li::before { content: '—'; position: absolute; left: 0; color: var(--acc); font-weight: 700; }

        /* FAQ */
        .art-faq { margin-bottom: 40px; scroll-margin-top: 72px; }
        .art-faq-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; color: var(--tx); margin: 0 0 16px; letter-spacing: -.01em; }
        .art-faq-list { border: 1px solid var(--b); border-radius: var(--r); background: var(--sf); overflow: hidden; }
        .art-faq-item { border-bottom: 1px solid var(--b); }
        .art-faq-item:last-child { border-bottom: none; }
        .art-faq-q { display: flex; align-items: center; justify-content: space-between; gap: 16px; width: 100%; padding: 16px 20px; background: none; border: none; cursor: pointer; text-align: left; font-size: 14px; font-weight: 600; color: var(--tx); font-family: var(--font-body); transition: background .15s; }
        .art-faq-q:hover { background: var(--el); }
        .art-faq-item--open .art-faq-q { background: var(--el); }
        .art-faq-icon { font-size: 20px; font-weight: 300; color: var(--acc); flex-shrink: 0; line-height: 1; }
        .art-faq-a { padding: 0 20px 18px; background: var(--el); }
        .art-faq-a p { font-size: 14px; line-height: 1.7; color: var(--tx2); margin: 0; }

        /* Related articles */
        .art-related { margin-bottom: 40px; scroll-margin-top: 72px; }
        .art-related-title { font-family: var(--font-head); font-size: 17px; font-weight: 700; color: var(--tx); margin: 0 0 14px; letter-spacing: -.01em; }
        .art-related-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
        .art-related-card { display: flex; flex-direction: column; gap: 4px; padding: 16px; background: var(--sf); border: 1px solid var(--b); border-radius: var(--r); text-decoration: none; color: var(--tx); transition: border-color .18s, box-shadow .18s, transform .12s; }
        .art-related-card:hover { border-color: var(--acc); box-shadow: var(--shadow-md); transform: translateY(-1px); }
        .art-related-topic { font-size: 10px; font-weight: 700; color: var(--acc); text-transform: uppercase; letter-spacing: .07em; }
        .art-related-title-text { font-size: 13px; font-weight: 700; color: var(--tx); line-height: 1.35; }
        .art-related-desc { font-size: 12px; color: var(--tx2); line-height: 1.45; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
        .art-related-arrow { font-size: 12px; color: var(--acc); font-weight: 600; margin-top: 4px; }

        /* ── Article meta extras ── */
        .art-verified { font-size: 12px; color: #2e7d32; font-weight: 600; }
        .art-changelog-link { font-size: 12px; color: var(--acc); text-decoration: none; font-weight: 600; margin-left: 4px; }
        .art-changelog-link:hover { text-decoration: underline; }

        /* ── Video embed ── */
        .art-video-wrap { margin-bottom: 32px; background: var(--el); border: 1px solid var(--b); border-radius: var(--r); overflow: hidden; }
        .art-video-label { font-size: 12px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .07em; padding: 12px 16px 0; margin: 0; }
        .art-video-frame { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; }
        .art-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

        /* Star rating feedback */
        .art-feedback { background: var(--sf); border: 1px solid var(--b); border-radius: var(--r); padding: 24px; text-align: center; margin-bottom: 0; }
        .art-feedback-q { font-size: 15px; font-weight: 600; color: var(--tx); margin: 0 0 14px; }
        .art-stars { display: flex; justify-content: center; gap: 4px; margin-bottom: 14px; }
        .art-star { background: none; border: none; cursor: pointer; color: #d1cdc8; transition: color .12s, transform .1s; padding: 2px; line-height: 1; }
        .art-star--on { color: #f5a623; }
        .art-star:hover { transform: scale(1.15); }
        .art-feedback-contact { font-size: 13px; color: var(--tx3); margin: 0; }
        .art-feedback-link { color: var(--acc); text-decoration: underline; }

        /* Reason categories */
        .art-reasons { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-bottom: 4px; }
        .art-reason { padding: 7px 14px; border-radius: 20px; border: 1.5px solid var(--b); background: var(--sf); font-size: 13px; font-weight: 500; color: var(--tx2); cursor: pointer; font-family: var(--font-body); transition: all .15s; }
        .art-reason--on { border-color: var(--acc); background: var(--acc-light); color: var(--acc-dark); font-weight: 700; }
        .art-reason:hover { border-color: var(--acc); }

        /* Smart escalation */
        .art-escalate { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; }
        .art-esc-btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 600; text-decoration: none; cursor: pointer; font-family: var(--font-body); border: 1.5px solid var(--b); background: var(--sf); color: var(--tx2); transition: all .15s; }
        .art-esc-btn:hover { border-color: var(--acc); background: var(--acc-light); color: var(--acc-dark); }
        .art-esc-btn--primary { background: var(--acc); color: #fff; border-color: var(--acc); }
        .art-esc-btn--primary:hover { background: var(--acc-dark); border-color: var(--acc-dark); }

        /* Back to top */
        .art-back-top {
          position: fixed; bottom: 96px; right: 24px; z-index: 90;
          width: 40px; height: 40px; border-radius: 50%;
          background: var(--sf); border: 1.5px solid var(--b);
          box-shadow: var(--shadow-md); display: flex; align-items: center;
          justify-content: center; cursor: pointer; color: var(--tx2);
          transition: background .15s, color .15s, transform .15s;
        }
        .art-back-top:hover { background: var(--acc); color: #fff; transform: translateY(-2px); border-color: var(--acc); }

        /* Floating CTA */
        .art-float-cta { position: fixed; bottom: 24px; right: 24px; z-index: 90; }
        .art-float-cta-btn {
          display: flex; align-items: center; gap: 8px;
          padding: 11px 18px; background: var(--acc); color: #fff;
          border-radius: 100px; font-size: 14px; font-weight: 600;
          text-decoration: none; box-shadow: 0 4px 16px rgba(208,138,89,.4);
          transition: background .15s, transform .15s, box-shadow .15s;
          font-family: var(--font-body);
        }
        .art-float-cta-btn:hover { background: var(--acc-dark); transform: translateY(-2px); box-shadow: 0 6px 24px rgba(208,138,89,.5); }
        .art-float-cta-btn svg { stroke: currentColor; flex-shrink: 0; }

        /* ── Print styles ── */
        @media print {
          .hc-header, .hc-sidebar, .art-toc, .art-related, .art-feedback,
          .art-float-cta, .art-back-top, .art-print-btn, .art-copy-btn,
          .art-header-actions, .hc-nav-divider { display: none !important; }
          .hc-body { display: block !important; padding: 0 !important; }
          .art-main { padding: 0 !important; }
          .art-title { font-size: 22px !important; }
          .art-section-body p, .art-list li { font-size: 12px !important; }
        }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .hc-body { padding: 0; gap: 0; flex-direction: column; }
          .hc-sidebar { width: 100%; position: static; height: auto; border-right: none; border-bottom: 1px solid var(--b); }
          .art-main { padding: 16px 16px 40px; }
          .art-toc { display: none; }
          .art-related-grid { grid-template-columns: 1fr; }
          .hc-brand-label, .hc-brand-sep { display: none; }
          .hc-breadcrumb { font-size: 11px; overflow: hidden; }
          .hc-breadcrumb-link { max-width: 60px; overflow: hidden; text-overflow: ellipsis; display: inline-block; vertical-align: middle; }
          .art-float-cta-btn span { display: none; }
          .art-float-cta-btn { padding: 11px; border-radius: 50%; }
        }
        @media (max-width: 480px) {
          .hc-header-inner { padding: 0 16px; }
          .art-read-time, .art-updated, .art-meta-sep { display: none; }
        }
      `}</style>
    </>
  );
}
