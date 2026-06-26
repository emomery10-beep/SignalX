"use client";

import Link from "next/link";
import { useState } from "react";
import { withUtm } from "@/lib/utm";
import { useLang } from "@/components/LanguageProvider";
import { localePath } from "@/lib/i18n-locale";
import type { TransparencyArticle, TransparencySection } from "@/lib/transparency-content";

function renderBody(body: string): React.ReactNode {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="ta-list">
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
    if (trimmed.startsWith("- ")) { listItems.push(trimmed.slice(2)); }
    else { flushList(); elements.push(<p key={key++} dangerouslySetInnerHTML={{ __html: inlineFormat(trimmed) }} />); }
  }
  flushList();
  return elements;
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

interface Props {
  article: TransparencyArticle;
  section: TransparencySection | undefined;
  sectionArticles: TransparencyArticle[];
}

export default function TransparencyArticleClient({ article, section, sectionArticles }: Props) {
  const { lang, tc } = useLang();
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(withUtm(window.location.href, "share", "referral", "transparency_share"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="ta-root">
      {/* Breadcrumb */}
      <nav className="ta-breadcrumb" aria-label="Breadcrumb">
        <ol className="ta-breadcrumb-list">
          <li><Link href={localePath('/help', lang)} className="ta-bc-link">Help Center</Link></li>
          <li aria-hidden><span className="ta-sep">›</span></li>
          <li><Link href={localePath('/transparency', lang)} className="ta-bc-link">Transparency</Link></li>
          <li aria-hidden><span className="ta-sep">›</span></li>
          <li><Link href={localePath(`/transparency#${article.sectionSlug}`, lang)} className="ta-bc-link">{article.sectionTitle}</Link></li>
          <li aria-hidden><span className="ta-sep">›</span></li>
          <li className="ta-bc-current" aria-current="page">{article.title}</li>
        </ol>
      </nav>

      <div className="ta-layout">
        {/* Sidebar */}
        <aside className="ta-sidebar" aria-label="Section navigation">
          <div className="ta-sidebar-inner">
            <div className="ta-sidebar-section">
              <span className="ta-sidebar-section-icon" aria-hidden>{section?.icon}</span>
              <Link href={localePath(`/transparency#${article.sectionSlug}`, lang)} className="ta-sidebar-section-title">
                {article.sectionTitle}
              </Link>
            </div>
            <nav>
              <ul className="ta-sidebar-list">
                {sectionArticles.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={localePath(`/transparency/${a.slug}`, lang)}
                      className={`ta-sidebar-link ${a.slug === article.slug ? "ta-sidebar-link--active" : ""}`}
                      aria-current={a.slug === article.slug ? "page" : undefined}
                    >
                      <span>{a.title}</span>
                      {a.slug === article.slug && <span className="ta-sidebar-dot" aria-hidden />}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="ta-sidebar-divider" />
            <Link href={localePath('/transparency', lang)} className="ta-sidebar-back">← All topics</Link>
            <Link href={localePath('/help', lang)} className="ta-sidebar-back" style={{ marginTop: "6px" }}>← Help Center</Link>
          </div>
        </aside>

        {/* Main */}
        <main className="ta-main">
          {/* Header */}
          <header className="ta-header">
            <div className="ta-header-meta">
              <span className="ta-section-pill">{article.sectionTitle}</span>
              <span className="ta-sep-dot">·</span>
              <span className="ta-read">{article.readTime} min read</span>
              <span className="ta-sep-dot">·</span>
              <span className="ta-updated">Updated {new Date(article.lastUpdated).toLocaleDateString(lang, { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <h1 className="ta-title">{article.title}</h1>
            <p className="ta-desc">{article.description}</p>
            <button className="ta-copy-btn" onClick={copyLink}>
              {copied ? "✓ Copied" : "Copy link"}
            </button>
          </header>

          {/* Live metrics */}
          {article.metrics && article.metrics.length > 0 && (
            <div className="ta-metrics">
              <p className="ta-metrics-label">Live metrics</p>
              <div className="ta-metrics-grid">
                {article.metrics.map((m) => (
                  <div key={m.label} className="ta-metric-card">
                    <span className="ta-metric-value">
                      {m.value}
                      {m.trend && (
                        <span className={`ta-metric-trend ${m.trend}`}>
                          {m.trend === "up" ? "↑" : m.trend === "down" ? "↓" : "→"}
                        </span>
                      )}
                    </span>
                    <span className="ta-metric-label">{m.label}</span>
                    {m.note && <span className="ta-metric-note">{m.note}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TOC */}
          {article.content.length >= 3 && (
            <nav className="ta-toc" aria-label="Contents">
              <p className="ta-toc-label">On this page</p>
              <ol className="ta-toc-list">
                {article.content.map((c, i) => (
                  <li key={i}>
                    <a href={`#section-${i}`} className="ta-toc-link">{c.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Body */}
          <div className="ta-body">
            {article.content.map((section, i) => (
              <section key={i} id={`section-${i}`} className="ta-section">
                <h2 className="ta-section-heading">{section.heading}</h2>
                <div className="ta-section-body">{renderBody(section.body)}</div>
              </section>
            ))}
          </div>

          {/* Related */}
          {article.related && article.related.length > 0 && (
            <section className="ta-related">
              <h2 className="ta-related-title">Related Articles</h2>
              <div className="ta-related-grid">
                {article.related.map((slug) => {
                  const { getArticleBySlug } = require("@/lib/transparency-content");
                  const rel = getArticleBySlug(slug);
                  if (!rel) return null;
                  return (
                    <Link key={slug} href={localePath(`/transparency/${slug}`, lang)} className="ta-related-card">
                      <span className="ta-related-section">{rel.sectionTitle}</span>
                      <span className="ta-related-card-title">{rel.title}</span>
                      <span className="ta-related-arrow">Read →</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="ta-footer-note">
            <p>
              This article was last reviewed in <strong>{new Date(article.lastUpdated).toLocaleDateString(lang, { month: "long", year: "numeric" })}</strong>.
              If something is unclear or you believe it is inaccurate, email{" "}
              <a href="mailto:support@askbiz.co" className="ta-inline-link">support@askbiz.co</a>.
            </p>
          </div>
        </main>
      </div>

      <style jsx global>{`
        :root {
          --acc:#d08a59; --acc-light:#f5ebe0; --acc-dark:#b8743e;
          --tx:#1a1916; --tx2:#6b6760; --tx3:#a39e97;
          --sf:#ffffff; --bg:#f9f8f6; --el:#f3f2ef;
          --b:rgba(0,0,0,.08); --r:12px; --r-sm:8px;
          --font-head:'Sora','DM Sans',system-ui,sans-serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --font-mono:'JetBrains Mono','Fira Code',ui-monospace,monospace;
          --shadow-md:0 4px 16px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);
        }
        .ta-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        .ta-breadcrumb { background:var(--sf); border-bottom:1px solid var(--b); padding:12px 24px; }
        .ta-breadcrumb-list { list-style:none; margin:0; padding:0; display:flex; align-items:center; flex-wrap:wrap; gap:4px; max-width:1100px; margin:0 auto; font-size:13px; }
        .ta-bc-link { color:var(--tx2); text-decoration:none; transition:color .15s; }
        .ta-bc-link:hover { color:#3b82f6; }
        .ta-sep { color:var(--tx3); margin:0 2px; }
        .ta-bc-current { color:var(--tx); font-weight:500; max-width:240px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        .ta-layout { max-width:1100px; margin:0 auto; padding:40px 24px 80px; display:grid; grid-template-columns:260px 1fr; gap:48px; align-items:start; }

        /* Sidebar */
        .ta-sidebar { position:sticky; top:24px; }
        .ta-sidebar-inner { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:20px; }
        .ta-sidebar-section { display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid var(--b); }
        .ta-sidebar-section-icon { font-size:18px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:var(--el); border-radius:7px; flex-shrink:0; }
        .ta-sidebar-section-title { font-family:var(--font-head); font-size:13px; font-weight:700; color:var(--tx); text-decoration:none; }
        .ta-sidebar-section-title:hover { color:#3b82f6; }
        .ta-sidebar-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:2px; }
        .ta-sidebar-link { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border-radius:var(--r-sm); text-decoration:none; color:var(--tx2); font-size:13px; line-height:1.4; transition:background .15s,color .15s; }
        .ta-sidebar-link:hover { background:var(--el); color:var(--tx); }
        .ta-sidebar-link--active { background:#eff6ff; color:#1d4ed8; font-weight:600; }
        .ta-sidebar-link--active:hover { background:#eff6ff; }
        .ta-sidebar-dot { width:6px; height:6px; border-radius:50%; background:#3b82f6; flex-shrink:0; }
        .ta-sidebar-divider { height:1px; background:var(--b); margin:16px 0; }
        .ta-sidebar-back { font-size:13px; color:var(--tx3); text-decoration:none; display:block; padding:3px 0; transition:color .15s; }
        .ta-sidebar-back:hover { color:#3b82f6; }

        /* Main */
        .ta-main { min-width:0; }
        .ta-header { margin-bottom:28px; padding-bottom:24px; border-bottom:1px solid var(--b); }
        .ta-header-meta { display:flex; align-items:center; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
        .ta-section-pill { font-size:11px; font-weight:700; color:#1d4ed8; background:#eff6ff; padding:4px 10px; border-radius:100px; text-transform:uppercase; letter-spacing:.06em; }
        .ta-sep-dot { color:var(--tx3); }
        .ta-read,.ta-updated { font-size:13px; color:var(--tx3); }
        .ta-title { font-family:var(--font-head); font-size:clamp(20px,3.5vw,30px); font-weight:700; color:var(--tx); margin:0 0 12px; line-height:1.2; letter-spacing:-.02em; }
        .ta-desc { font-size:15px; color:var(--tx2); line-height:1.65; margin:0 0 16px; }
        .ta-copy-btn { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:var(--tx3); background:var(--el); border:1px solid var(--b); border-radius:8px; padding:6px 12px; cursor:pointer; font-family:var(--font-body); transition:all .15s; }
        .ta-copy-btn:hover { background:var(--b); color:var(--tx); }

        /* Metrics */
        .ta-metrics { background:var(--sf); border:1.5px solid #bfdbfe; border-radius:var(--r); padding:20px 24px; margin-bottom:28px; }
        .ta-metrics-label { font-size:11px; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:.08em; margin:0 0 14px; }
        .ta-metrics-grid { display:flex; flex-wrap:wrap; gap:20px; }
        .ta-metric-card { display:flex; flex-direction:column; gap:3px; min-width:120px; }
        .ta-metric-value { font-family:var(--font-head); font-size:22px; font-weight:700; color:var(--tx); display:flex; align-items:center; gap:4px; }
        .ta-metric-trend { font-size:14px; font-weight:700; }
        .ta-metric-trend.up,.ta-metric-trend.down { color:#10b981; }
        .ta-metric-trend.stable { color:var(--tx3); }
        .ta-metric-label { font-size:12px; color:var(--tx2); font-weight:500; }
        .ta-metric-note { font-size:11px; color:var(--tx3); }

        /* TOC */
        .ta-toc { background:var(--el); border:1px solid var(--b); border-radius:var(--r); padding:18px 22px; margin-bottom:28px; }
        .ta-toc-label { font-size:11px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.08em; margin:0 0 10px; }
        .ta-toc-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:5px; counter-reset:toc; }
        .ta-toc-list li { counter-increment:toc; }
        .ta-toc-link { font-size:13px; color:var(--tx2); text-decoration:none; display:flex; align-items:baseline; gap:8px; transition:color .15s; }
        .ta-toc-link::before { content:counter(toc); font-size:10px; font-weight:700; color:#3b82f6; background:#eff6ff; width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
        .ta-toc-link:hover { color:#3b82f6; }

        /* Body */
        .ta-body { margin-bottom:48px; }
        .ta-section { margin-bottom:36px; scroll-margin-top:24px; }
        .ta-section-heading { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:0 0 12px; padding-bottom:10px; border-bottom:1px solid var(--b); letter-spacing:-.01em; }
        .ta-section-body p { font-size:15px; line-height:1.75; color:#3a3835; margin:0 0 12px; }
        .ta-section-body p:last-child { margin-bottom:0; }
        .ta-section-body strong { font-weight:700; color:var(--tx); }
        .ta-section-body code { font-family:var(--font-mono); font-size:13px; background:var(--el); border:1px solid var(--b); padding:2px 6px; border-radius:4px; color:#1d4ed8; }
        .ta-list { list-style:none; margin:0 0 12px; padding:0; display:flex; flex-direction:column; gap:5px; }
        .ta-list li { font-size:15px; line-height:1.65; color:#3a3835; padding-left:20px; position:relative; }
        .ta-list li::before { content:'—'; position:absolute; left:0; color:#3b82f6; font-weight:700; }

        /* Related */
        .ta-related { margin-bottom:40px; }
        .ta-related-title { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:0 0 14px; }
        .ta-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:10px; }
        .ta-related-card { display:flex; flex-direction:column; gap:4px; padding:16px; background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); text-decoration:none; transition:border-color .2s,transform .15s; }
        .ta-related-card:hover { border-color:#3b82f6; transform:translateY(-2px); }
        .ta-related-section { font-size:10px; font-weight:700; color:#3b82f6; text-transform:uppercase; letter-spacing:.07em; }
        .ta-related-card-title { font-size:13px; font-weight:700; color:var(--tx); line-height:1.35; flex:1; }
        .ta-related-arrow { font-size:12px; color:#3b82f6; font-weight:600; margin-top:4px; }

        /* Footer */
        .ta-footer-note { background:var(--el); border:1px solid var(--b); border-radius:var(--r); padding:18px 22px; }
        .ta-footer-note p { font-size:13px; color:var(--tx2); margin:0; line-height:1.6; }
        .ta-inline-link { color:#3b82f6; text-decoration:underline; }

        /* Responsive */
        @media (max-width:768px) {
          .ta-layout { grid-template-columns:1fr; gap:0; padding:24px 20px 60px; }
          .ta-sidebar { display:none; }
          .ta-toc { display:none; }
          .ta-related-grid { grid-template-columns:1fr; }
          .ta-metrics-grid { gap:14px; }
        }
        @media (max-width:480px) {
          .ta-bc-current { max-width:120px; }
          .ta-read,.ta-updated,.ta-sep-dot { display:none; }
        }
      `}</style>
    </div>
  );
}
