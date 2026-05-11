"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  TRANSPARENCY_SECTIONS,
  getAllArticles,
  searchTransparency,
  TRANSPARENCY_LAST_UPDATED,
  TOTAL_ARTICLES,
} from "@/lib/transparency-content";

export default function TransparencyPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.length > 1 ? searchTransparency(query) : []), [query]);

  const keyMetrics = [
    { label: "Overall AI accuracy", value: "93.0%", trend: "↑", note: "Q1 2026" },
    { label: "Hallucination rate", value: "1.2%", trend: "↓", note: "Of all responses" },
    { label: "High confidence answers", value: "71%", trend: "↑", note: "Of all queries" },
    { label: "User flags resolved", value: "847", trend: "→", note: "Q1 2026" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "AskBiz Transparency Centre",
            description: "How AskBiz's AI works, our accuracy metrics, methodology, open data, and regulatory compliance.",
            url: "https://askbiz.co/transparency",
            publisher: { "@type": "Organization", name: "AskBiz" },
            lastReviewed: "2026-04-01",
          }),
        }}
      />

      <div className="tr-root">
        {/* ── Hero ── */}
        <section className="tr-hero">
          <div className="tr-hero-inner">
            <div className="tr-hero-top">
              <Link href="/help" className="tr-back-link">← Help Center</Link>
              <div className="tr-hero-badge">Transparency Centre</div>
            </div>
            <h1 className="tr-hero-title">How AskBiz Works — In Full</h1>
            <p className="tr-hero-sub">
              We believe you deserve to understand the AI you're making business decisions with.
              This is our complete disclosure: the model we use, how answers are generated,
              our accuracy rates, our methodology, and our regulatory compliance.
              Last updated: <strong>{TRANSPARENCY_LAST_UPDATED}</strong>.
            </p>

            {/* Search */}
            <div className="tr-search-wrap">
              <span className="tr-search-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.7"/>
                  <path d="M13 13l2.5 2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
                </svg>
              </span>
              <input
                className="tr-search-input"
                type="search"
                placeholder="Search transparency docs — e.g. hallucination, confidence, churn model…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search transparency centre"
              />
              {query && (
                <button className="tr-search-clear" onClick={() => setQuery("")} aria-label="Clear">×</button>
              )}
            </div>

            {query.length > 1 && (
              <div className="tr-search-results">
                {results.length === 0 ? (
                  <div className="tr-search-empty">
                    <p>No results for <strong>"{query}"</strong></p>
                    <p className="tr-search-empty-sub">Try different keywords or <a href="mailto:support@askbiz.co">email us</a>.</p>
                  </div>
                ) : (
                  <>
                    <p className="tr-search-count">{results.length} result{results.length !== 1 ? "s" : ""}</p>
                    <ul className="tr-search-list">
                      {results.map((a) => (
                        <li key={a.slug}>
                          <Link href={`/transparency/${a.slug}`} className="tr-search-item">
                            <span className="tr-search-item-section">{a.sectionTitle}</span>
                            <span className="tr-search-item-title">{a.title}</span>
                            <span className="tr-search-item-desc">{a.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="tr-hero-deco" aria-hidden>
            <div className="tr-blob b1"/><div className="tr-blob b2"/>
          </div>
        </section>

        {/* ── Live metrics bar ── */}
        <div className="tr-metrics-bar">
          <div className="tr-metrics-inner">
            {keyMetrics.map((m) => (
              <div key={m.label} className="tr-metric">
                <span className="tr-metric-value">
                  {m.value}
                  <span className={`tr-metric-trend ${m.trend === "↑" ? "up" : m.trend === "↓" ? "down" : "stable"}`}>
                    {m.trend}
                  </span>
                </span>
                <span className="tr-metric-label">{m.label}</span>
                <span className="tr-metric-note">{m.note}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="tr-content">
          {/* ── Intro statement ── */}
          <section className="tr-intro">
            <div className="tr-intro-inner">
              <div className="tr-intro-icon" aria-hidden>🔍</div>
              <div>
                <h2 className="tr-intro-title">Built in the Open</h2>
                <p className="tr-intro-body">
                  This Transparency Centre covers {TOTAL_ARTICLES} articles across {TRANSPARENCY_SECTIONS.length} sections.
                  It is the primary way we fulfil our obligations under EU AI Act Article 13 (transparency for limited-risk AI systems),
                  and our own commitment to you as a user. Every article is reviewed quarterly.
                  If something here is unclear or incomplete, email <a href="mailto:support@askbiz.co">support@askbiz.co</a>.
                </p>
              </div>
            </div>
          </section>

          {/* ── Sections ── */}
          {TRANSPARENCY_SECTIONS.map((section) => (
            <section
              key={section.slug}
              id={section.slug}
              className="tr-section"
              aria-labelledby={`section-${section.slug}`}
            >
              <div className="tr-section-header">
                <span className="tr-section-icon" aria-hidden>{section.icon}</span>
                <div>
                  <h2 id={`section-${section.slug}`} className="tr-section-title">
                    {section.title}
                  </h2>
                  <p className="tr-section-desc">{section.description}</p>
                </div>
              </div>

              <div className="tr-article-grid">
                {section.articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/transparency/${article.slug}`}
                    className="tr-article-card"
                  >
                    <div className="tr-article-card-body">
                      <h3 className="tr-article-title">{article.title}</h3>
                      <p className="tr-article-desc">{article.description}</p>
                    </div>
                    <div className="tr-article-card-footer">
                      {article.metrics && article.metrics.length > 0 && (
                        <div className="tr-article-metrics">
                          {article.metrics.slice(0, 2).map((m) => (
                            <span key={m.label} className="tr-article-metric">
                              <strong>{m.value}</strong> {m.label}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="tr-article-meta">
                        <span className="tr-article-read">{article.readTime} min</span>
                        <span className="tr-article-arrow">Read →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ))}

          {/* ── Links to Rules & Help ── */}
          <section className="tr-related-sections">
            <h2 className="tr-related-title">Also in the Help Center</h2>
            <div className="tr-related-grid">
              {[
                { href: "/rules", icon: "⚖️", title: "Rules & Policies", desc: "Acceptable use, IP, AI policies, enforcement, and regulatory compliance across UK, EU, and US." },
                { href: "/help/data-security", icon: "🔒", title: "Data Security", desc: "How AskBiz encrypts and protects your business data at rest and in transit." },
                { href: "/help/gdpr-compliance", icon: "🇪🇺", title: "GDPR Compliance", desc: "Your rights as a data subject and AskBiz's role as a data processor." },
                { href: "/help/responsible-ai-use", icon: "🤖", title: "Responsible AI Use", desc: "Guidelines for using AI outputs responsibly, including how to disable AI learning." },
                { href: "/help/reporting-a-concern", icon: "🚨", title: "Report a Concern", desc: "How to flag security vulnerabilities, policy violations, or AI errors." },
                { href: "/help/how-we-handle-safety-incidents", icon: "🛡️", title: "Safety Incidents", desc: "How we respond to data breaches and platform safety events." },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="tr-related-card">
                  <span className="tr-related-icon" aria-hidden>{item.icon}</span>
                  <div>
                    <span className="tr-related-card-title">{item.title}</span>
                    <span className="tr-related-card-desc">{item.desc}</span>
                  </div>
                  <span className="tr-related-arrow" aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Contact ── */}
          <section className="tr-contact">
            <div className="tr-contact-inner">
              <div className="tr-contact-text">
                <h2 className="tr-contact-title">Questions About How We Work?</h2>
                <p className="tr-contact-sub">
                  If something in this Transparency Centre is unclear, incomplete, or you believe
                  it is inaccurate, we want to know. Email us and we will respond within 2 business days.
                </p>
              </div>
              <a href="mailto:support@askbiz.co?subject=Transparency Centre query" className="tr-contact-btn">
                Email us →
              </a>
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --acc:#d08a59; --acc-light:#f5ebe0; --acc-dark:#b8743e;
          --tx:#1a1916; --tx2:#6b6760; --tx3:#a39e97;
          --sf:#ffffff; --bg:#f9f8f6; --el:#f3f2ef;
          --b:rgba(0,0,0,.08); --r:12px; --r-sm:8px;
          --font-head:'Sora','DM Sans',system-ui,sans-serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --shadow-md:0 4px 16px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);
          --shadow-sm:0 1px 3px rgba(0,0,0,.06);
        }
        .tr-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        /* Hero */
        .tr-hero { position:relative; overflow:hidden; background:linear-gradient(160deg,#0f1720 0%,#1a2a3a 50%,#0f2020 100%); padding:80px 24px 100px; text-align:center; }
        .tr-hero-inner { position:relative; z-index:2; max-width:720px; margin:0 auto; }
        .tr-hero-top { display:flex; flex-direction:column; align-items:center; gap:12px; margin-bottom:20px; }
        .tr-back-link { font-size:13px; font-weight:600; color:rgba(255,255,255,.45); text-decoration:none; border:1px solid rgba(255,255,255,.12); padding:5px 14px; border-radius:100px; transition:color .15s,border-color .15s; }
        .tr-back-link:hover { color:rgba(255,255,255,.8); border-color:rgba(255,255,255,.25); }
        .tr-hero-badge { display:inline-block; background:rgba(59,130,246,.2); border:1px solid rgba(59,130,246,.35); color:#93c5fd; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; padding:5px 14px; border-radius:100px; }
        .tr-hero-title { font-family:var(--font-head); font-size:clamp(26px,5vw,46px); font-weight:700; color:#fff; margin:0 0 14px; line-height:1.15; letter-spacing:-.02em; }
        .tr-hero-sub { color:rgba(255,255,255,.5); font-size:16px; margin:0 0 32px; line-height:1.65; }
        .tr-hero-sub strong { color:rgba(255,255,255,.75); }

        /* Search */
        .tr-search-wrap { position:relative; max-width:580px; margin:0 auto; }
        .tr-search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.35); pointer-events:none; display:flex; }
        .tr-search-input { width:100%; box-sizing:border-box; padding:15px 44px 15px 48px; border-radius:12px; border:1.5px solid rgba(255,255,255,.1); background:rgba(255,255,255,.07); backdrop-filter:blur(12px); color:#fff; font-size:15px; font-family:var(--font-body); outline:none; transition:border-color .2s,box-shadow .2s; }
        .tr-search-input::placeholder { color:rgba(255,255,255,.3); }
        .tr-search-input:focus { border-color:rgba(59,130,246,.5); box-shadow:0 0 0 4px rgba(59,130,246,.1); }
        .tr-search-clear { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.12); border:none; color:rgba(255,255,255,.6); width:24px; height:24px; border-radius:50%; cursor:pointer; font-size:17px; display:flex; align-items:center; justify-content:center; }
        .tr-search-results { position:absolute; top:calc(100% + 8px); left:0; right:0; background:var(--sf); border:1px solid var(--b); border-radius:var(--r); box-shadow:var(--shadow-md); text-align:left; max-height:440px; overflow-y:auto; z-index:50; }
        .tr-search-count { font-size:12px; color:var(--tx3); padding:12px 16px 0; margin:0; }
        .tr-search-list { list-style:none; margin:0; padding:8px; }
        .tr-search-item { display:block; padding:12px; border-radius:var(--r-sm); text-decoration:none; transition:background .15s; }
        .tr-search-item:hover { background:var(--el); }
        .tr-search-item-section { display:block; font-size:11px; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:.06em; margin-bottom:2px; }
        .tr-search-item-title { display:block; font-size:14px; font-weight:600; color:var(--tx); margin-bottom:3px; }
        .tr-search-item-desc { display:block; font-size:13px; color:var(--tx2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .tr-search-empty { padding:28px 20px; text-align:center; color:var(--tx2); }
        .tr-search-empty p { margin:4px 0; }
        .tr-search-empty a { color:var(--acc); }
        .tr-hero-deco { position:absolute; inset:0; pointer-events:none; z-index:1; }
        .tr-blob { position:absolute; border-radius:50%; filter:blur(80px); opacity:.15; }
        .b1 { width:400px; height:400px; background:#3b82f6; top:-100px; left:-100px; }
        .b2 { width:300px; height:300px; background:#10b981; bottom:-80px; right:-60px; }

        /* Metrics bar */
        .tr-metrics-bar { background:var(--sf); border-bottom:1px solid var(--b); padding:20px 24px; }
        .tr-metrics-inner { max-width:960px; margin:0 auto; display:flex; justify-content:space-around; flex-wrap:wrap; gap:16px; }
        .tr-metric { display:flex; flex-direction:column; align-items:center; gap:4px; }
        .tr-metric-value { font-family:var(--font-head); font-size:24px; font-weight:700; color:var(--tx); display:flex; align-items:center; gap:4px; }
        .tr-metric-trend { font-size:14px; font-weight:700; }
        .tr-metric-trend.up { color:#10b981; }
        .tr-metric-trend.down { color:#10b981; }
        .tr-metric-trend.stable { color:var(--tx3); }
        .tr-metric-label { font-size:13px; color:var(--tx2); font-weight:500; text-align:center; }
        .tr-metric-note { font-size:11px; color:var(--tx3); }

        /* Content */
        .tr-content { max-width:960px; margin:0 auto; padding:56px 24px 80px; }

        /* Intro */
        .tr-intro { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:28px 32px; margin-bottom:56px; }
        .tr-intro-inner { display:flex; align-items:flex-start; gap:18px; }
        .tr-intro-icon { font-size:28px; flex-shrink:0; }
        .tr-intro-title { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:0 0 8px; }
        .tr-intro-body { font-size:14px; color:var(--tx2); line-height:1.65; margin:0; }
        .tr-intro-body a { color:var(--acc); text-decoration:underline; }

        /* Sections */
        .tr-section { margin-bottom:64px; scroll-margin-top:32px; }
        .tr-section-header { display:flex; align-items:flex-start; gap:16px; margin-bottom:24px; }
        .tr-section-icon { font-size:26px; width:44px; height:44px; display:flex; align-items:center; justify-content:center; background:var(--el); border-radius:10px; flex-shrink:0; }
        .tr-section-title { font-family:var(--font-head); font-size:20px; font-weight:700; color:var(--tx); margin:0 0 6px; letter-spacing:-.01em; }
        .tr-section-desc { font-size:14px; color:var(--tx2); margin:0; line-height:1.5; }
        .tr-article-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }
        .tr-article-card { display:flex; flex-direction:column; background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); text-decoration:none; color:var(--tx); transition:border-color .2s,box-shadow .2s,transform .15s; overflow:hidden; }
        .tr-article-card:hover { border-color:#3b82f6; box-shadow:var(--shadow-md); transform:translateY(-2px); }
        .tr-article-card-body { padding:20px; flex:1; }
        .tr-article-title { font-family:var(--font-head); font-size:14px; font-weight:700; color:var(--tx); margin:0 0 8px; line-height:1.35; }
        .tr-article-desc { font-size:13px; color:var(--tx2); line-height:1.5; margin:0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
        .tr-article-card-footer { padding:12px 20px; border-top:1px solid var(--b); background:var(--el); display:flex; flex-direction:column; gap:8px; }
        .tr-article-metrics { display:flex; flex-direction:column; gap:3px; }
        .tr-article-metric { font-size:11px; color:var(--tx2); }
        .tr-article-metric strong { color:#3b82f6; font-weight:700; }
        .tr-article-meta { display:flex; align-items:center; justify-content:space-between; }
        .tr-article-read { font-size:11px; color:var(--tx3); }
        .tr-article-arrow { font-size:12px; color:#3b82f6; font-weight:600; }

        /* Related sections */
        .tr-related-sections { margin-bottom:48px; border-top:1px solid var(--b); padding-top:48px; }
        .tr-related-title { font-family:var(--font-head); font-size:20px; font-weight:700; color:var(--tx); margin:0 0 20px; }
        .tr-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:12px; }
        .tr-related-card { display:flex; align-items:center; gap:14px; padding:16px; background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); text-decoration:none; color:var(--tx); transition:border-color .2s,box-shadow .2s; }
        .tr-related-card:hover { border-color:var(--acc); box-shadow:var(--shadow-sm); }
        .tr-related-icon { font-size:20px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:var(--el); border-radius:8px; flex-shrink:0; }
        .tr-related-card-title { display:block; font-size:13px; font-weight:700; color:var(--tx); margin-bottom:3px; }
        .tr-related-card-desc { display:block; font-size:12px; color:var(--tx2); line-height:1.4; }
        .tr-related-arrow { color:var(--tx3); font-size:16px; margin-left:auto; flex-shrink:0; }
        .tr-related-card:hover .tr-related-arrow { color:var(--acc); }

        /* Contact */
        .tr-contact { background:linear-gradient(135deg,#0f1720 0%,#1a2a3a 100%); border-radius:var(--r); padding:40px 48px; display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; }
        .tr-contact-title { font-family:var(--font-head); font-size:20px; font-weight:700; color:#fff; margin:0 0 8px; }
        .tr-contact-sub { font-size:14px; color:rgba(255,255,255,.5); line-height:1.6; margin:0; max-width:480px; }
        .tr-contact-btn { display:inline-flex; align-items:center; background:#3b82f6; color:#fff; font-size:14px; font-weight:700; padding:12px 24px; border-radius:10px; text-decoration:none; white-space:nowrap; flex-shrink:0; transition:background .15s,transform .15s; }
        .tr-contact-btn:hover { background:#2563eb; transform:translateY(-1px); }

        /* Responsive */
        @media (max-width:640px) {
          .tr-hero { padding:60px 20px 80px; }
          .tr-content { padding:40px 20px 60px; }
          .tr-metrics-inner { justify-content:flex-start; }
          .tr-article-grid { grid-template-columns:1fr; }
          .tr-related-grid { grid-template-columns:1fr; }
          .tr-contact { padding:28px 24px; flex-direction:column; }
          .tr-intro-inner { flex-direction:column; }
        }
      `}</style>
    </>
  );
}
