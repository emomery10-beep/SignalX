"use client";

import Link from "next/link";
import type { PolicyArticle, PolicyCategory } from "@/lib/rules-content";

function renderBody(body: string): React.ReactNode {
  const lines = body.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="pol-list">
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
  article: PolicyArticle;
  category: PolicyCategory | undefined;
  categoryPolicies: PolicyArticle[];
}

export default function PolicyClient({ article, category, categoryPolicies }: Props) {
  return (
    <div className="pol-root">
      {/* Breadcrumb */}
      <nav className="pol-breadcrumb" aria-label="Breadcrumb">
        <ol className="pol-breadcrumb-list">
          <li><Link href="/rules" className="pol-breadcrumb-link">Rules & Policies</Link></li>
          <li aria-hidden><span className="pol-sep">›</span></li>
          <li><Link href={`/rules#${article.categorySlug}`} className="pol-breadcrumb-link">{article.category}</Link></li>
          <li aria-hidden><span className="pol-sep">›</span></li>
          <li className="pol-breadcrumb-current" aria-current="page">{article.title}</li>
        </ol>
      </nav>

      <div className="pol-layout">
        {/* Sidebar */}
        <aside className="pol-sidebar" aria-label="Category navigation">
          <div className="pol-sidebar-inner">
            <div className="pol-sidebar-cat">
              <span className="pol-sidebar-cat-icon" aria-hidden>{category?.icon}</span>
              <Link href={`/rules#${article.categorySlug}`} className="pol-sidebar-cat-title">
                {article.category}
              </Link>
            </div>
            <nav aria-label="Policies in this category">
              <ul className="pol-sidebar-list">
                {categoryPolicies.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/rules/${p.slug}`}
                      className={`pol-sidebar-link ${p.slug === article.slug ? "pol-sidebar-link--active" : ""}`}
                      aria-current={p.slug === article.slug ? "page" : undefined}
                    >
                      <span className="pol-sidebar-link-title">{p.title}</span>
                      {p.slug === article.slug && <span className="pol-sidebar-indicator" aria-hidden />}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="pol-sidebar-divider" />
            <Link href="/rules" className="pol-sidebar-back">← All Policies</Link>
          </div>
        </aside>

        {/* Main */}
        <main className="pol-main" id="main-content">
          {/* Header */}
          <header className="pol-header">
            <div className="pol-header-meta">
              <span className="pol-cat-pill">{article.category}</span>
              <span className="pol-sep-dot">·</span>
              <span className="pol-read-time">{article.readTime} min read</span>
              <span className="pol-sep-dot">·</span>
              <span className="pol-updated">Effective {new Date(article.effectiveDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
            <h1 className="pol-title">{article.title}</h1>
            <p className="pol-description">{article.description}</p>

            {/* Legal basis tags */}
            {article.legalBasis && article.legalBasis.length > 0 && (
              <div className="pol-legal-basis">
                <span className="pol-legal-basis-label">Legal basis:</span>
                {article.legalBasis.map((l) => (
                  <span key={l} className="pol-legal-tag">{l}</span>
                ))}
              </div>
            )}

            {/* Last updated */}
            <p className="pol-last-updated">
              Last updated: {new Date(article.lastUpdated).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              {" · "}
              Questions? <a href="mailto:legal@askbiz.co" className="pol-inline-link">legal@askbiz.co</a>
            </p>
          </header>

          {/* Table of contents */}
          {article.content.length >= 3 && (
            <nav className="pol-toc" aria-label="Table of contents">
              <p className="pol-toc-label">On this page</p>
              <ol className="pol-toc-list">
                {article.content.map((s, i) => (
                  <li key={i}>
                    <a href={`#section-${i}`} className="pol-toc-link">{s.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Body */}
          <div className="pol-body">
            {article.content.map((section, i) => (
              <section key={i} id={`section-${i}`} className="pol-section">
                <h2 className="pol-section-heading">{section.heading}</h2>
                <div className="pol-section-body">{renderBody(section.body)}</div>
              </section>
            ))}
          </div>

          {/* Related */}
          {article.related && article.related.length > 0 && (
            <section className="pol-related" aria-labelledby="related-heading">
              <h2 id="related-heading" className="pol-related-title">Related Policies</h2>
              <div className="pol-related-grid">
                {article.related.map((slug) => {
                  const { getPolicyBySlug } = require("@/lib/rules-content");
                  const rel = getPolicyBySlug(slug);
                  if (!rel) return null;
                  return (
                    <Link key={slug} href={`/rules/${slug}`} className="pol-related-card">
                      <span className="pol-related-cat">{rel.category}</span>
                      <span className="pol-related-title-text">{rel.title}</span>
                      <span className="pol-related-arrow">Read policy →</span>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Footer */}
          <div className="pol-footer-note">
            <p>
              This policy is effective as of <strong>{new Date(article.effectiveDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</strong> and forms part of AskBiz's Terms of Service.
              For questions or to exercise your legal rights: <a href="mailto:legal@askbiz.co" className="pol-inline-link">legal@askbiz.co</a> or <a href="mailto:privacy@askbiz.co" className="pol-inline-link">privacy@askbiz.co</a>.
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
        .pol-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        .pol-breadcrumb { background:var(--sf); border-bottom:1px solid var(--b); padding:12px 24px; }
        .pol-breadcrumb-list { list-style:none; margin:0; padding:0; display:flex; align-items:center; flex-wrap:wrap; gap:4px; max-width:1100px; margin:0 auto; font-size:13px; }
        .pol-breadcrumb-link { color:var(--tx2); text-decoration:none; transition:color .15s; }
        .pol-breadcrumb-link:hover { color:var(--acc); }
        .pol-sep { color:var(--tx3); margin:0 2px; }
        .pol-breadcrumb-current { color:var(--tx); font-weight:500; max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }

        .pol-layout { max-width:1100px; margin:0 auto; padding:40px 24px 80px; display:grid; grid-template-columns:260px 1fr; gap:48px; align-items:start; }

        /* Sidebar */
        .pol-sidebar { position:sticky; top:24px; }
        .pol-sidebar-inner { background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); padding:20px; }
        .pol-sidebar-cat { display:flex; align-items:center; gap:10px; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid var(--b); }
        .pol-sidebar-cat-icon { font-size:18px; width:32px; height:32px; display:flex; align-items:center; justify-content:center; background:var(--el); border-radius:7px; flex-shrink:0; }
        .pol-sidebar-cat-title { font-family:var(--font-head); font-size:13px; font-weight:700; color:var(--tx); text-decoration:none; }
        .pol-sidebar-cat-title:hover { color:var(--acc); }
        .pol-sidebar-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:2px; }
        .pol-sidebar-link { display:flex; align-items:center; justify-content:space-between; padding:8px 10px; border-radius:var(--r-sm); text-decoration:none; color:var(--tx2); font-size:13px; line-height:1.4; transition:background .15s,color .15s; }
        .pol-sidebar-link:hover { background:var(--el); color:var(--tx); }
        .pol-sidebar-link--active { background:var(--acc-light); color:var(--acc-dark); font-weight:600; }
        .pol-sidebar-link--active:hover { background:var(--acc-light); }
        .pol-sidebar-indicator { width:6px; height:6px; border-radius:50%; background:var(--acc); flex-shrink:0; }
        .pol-sidebar-divider { height:1px; background:var(--b); margin:16px 0; }
        .pol-sidebar-back { font-size:13px; color:var(--tx3); text-decoration:none; display:block; padding:4px 0; transition:color .15s; }
        .pol-sidebar-back:hover { color:var(--acc); }

        /* Main */
        .pol-main { min-width:0; }
        .pol-header { margin-bottom:32px; padding-bottom:28px; border-bottom:1px solid var(--b); }
        .pol-header-meta { display:flex; align-items:center; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
        .pol-cat-pill { font-size:11px; font-weight:700; color:var(--acc); background:var(--acc-light); padding:4px 10px; border-radius:100px; text-transform:uppercase; letter-spacing:.06em; }
        .pol-sep-dot { color:var(--tx3); }
        .pol-read-time,.pol-updated { font-size:13px; color:var(--tx3); }
        .pol-title { font-family:var(--font-head); font-size:clamp(20px,3.5vw,30px); font-weight:700; color:var(--tx); margin:0 0 12px; line-height:1.2; letter-spacing:-.02em; }
        .pol-description { font-size:15px; color:var(--tx2); line-height:1.65; margin:0 0 16px; }

        .pol-legal-basis { display:flex; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
        .pol-legal-basis-label { font-size:12px; font-weight:600; color:var(--tx3); margin-right:2px; }
        .pol-legal-tag { font-size:11px; background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; padding:3px 9px; border-radius:100px; font-weight:500; white-space:nowrap; }
        .pol-last-updated { font-size:12px; color:var(--tx3); margin:0; }
        .pol-inline-link { color:var(--acc); text-decoration:underline; }

        /* TOC */
        .pol-toc { background:var(--el); border:1px solid var(--b); border-radius:var(--r); padding:18px 22px; margin-bottom:32px; }
        .pol-toc-label { font-size:11px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.08em; margin:0 0 10px; }
        .pol-toc-list { list-style:none; margin:0; padding:0; display:flex; flex-direction:column; gap:5px; counter-reset:toc; }
        .pol-toc-list li { counter-increment:toc; }
        .pol-toc-link { font-size:13px; color:var(--tx2); text-decoration:none; display:flex; align-items:baseline; gap:8px; transition:color .15s; }
        .pol-toc-link::before { content:counter(toc); font-size:10px; font-weight:700; color:var(--acc); background:var(--acc-light); width:18px; height:18px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; flex-shrink:0; }
        .pol-toc-link:hover { color:var(--acc); }

        /* Body */
        .pol-body { margin-bottom:48px; }
        .pol-section { margin-bottom:36px; scroll-margin-top:24px; }
        .pol-section-heading { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:0 0 12px; padding-bottom:10px; border-bottom:1px solid var(--b); letter-spacing:-.01em; }
        .pol-section-body p { font-size:15px; line-height:1.75; color:#3a3835; margin:0 0 12px; }
        .pol-section-body p:last-child { margin-bottom:0; }
        .pol-section-body strong { font-weight:700; color:var(--tx); }
        .pol-section-body code { font-family:var(--font-mono); font-size:13px; background:var(--el); border:1px solid var(--b); padding:2px 6px; border-radius:4px; color:var(--acc-dark); }
        .pol-list { list-style:none; margin:0 0 12px; padding:0; display:flex; flex-direction:column; gap:5px; }
        .pol-list li { font-size:15px; line-height:1.65; color:#3a3835; padding-left:20px; position:relative; }
        .pol-list li::before { content:'—'; position:absolute; left:0; color:var(--acc); font-weight:700; }

        /* Related */
        .pol-related { margin-bottom:40px; }
        .pol-related-title { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:0 0 14px; }
        .pol-related-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:10px; }
        .pol-related-card { display:flex; flex-direction:column; gap:4px; padding:16px; background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); text-decoration:none; transition:border-color .2s,box-shadow .2s,transform .15s; }
        .pol-related-card:hover { border-color:var(--acc); box-shadow:var(--shadow-md); transform:translateY(-2px); }
        .pol-related-cat { font-size:10px; font-weight:700; color:var(--acc); text-transform:uppercase; letter-spacing:.07em; }
        .pol-related-title-text { font-size:13px; font-weight:700; color:var(--tx); line-height:1.35; flex:1; }
        .pol-related-arrow { font-size:12px; color:var(--acc); font-weight:600; margin-top:6px; }

        /* Footer note */
        .pol-footer-note { background:var(--el); border:1px solid var(--b); border-radius:var(--r); padding:20px 22px; }
        .pol-footer-note p { font-size:13px; color:var(--tx2); margin:0; line-height:1.6; }

        /* Responsive */
        @media (max-width:768px) {
          .pol-layout { grid-template-columns:1fr; gap:0; padding:24px 20px 60px; }
          .pol-sidebar { display:none; }
          .pol-toc { display:none; }
          .pol-related-grid { grid-template-columns:1fr; }
        }
        @media (max-width:480px) {
          .pol-breadcrumb-current { max-width:120px; }
          .pol-read-time,.pol-updated,.pol-sep-dot { display:none; }
        }
      `}</style>
    </div>
  );
}
