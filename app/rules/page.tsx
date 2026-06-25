"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  POLICY_CATEGORIES,
  POLICY_ARTICLES,
  searchPolicies,
  LAST_REVIEWED,
  EFFECTIVE_DATE,
} from "@/lib/rules-content";

export default function RulesPage() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query.length > 1 ? searchPolicies(query) : []), [query]);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "AskBiz Rules & Policies",
            description: "AskBiz's complete rules, policies, and regulatory compliance documentation.",
            url: "https://askbiz.co/rules",
            publisher: { "@type": "Organization", name: "AskBiz", url: "https://askbiz.co" },
            lastReviewed: "2026-04-01",
          }),
        }}
      />

      <div className="rl-root">
        {/* ── Hero ── */}
        <section className="rl-hero">
          <div className="rl-hero-inner">
            <div className="rl-hero-top">
          <Link href="/help" className="rl-help-back">← Help Center</Link>
          <div className="rl-hero-badge">Rules & Policies</div>
        </div>
            <h1 className="rl-hero-title">How AskBiz Works — and What We Expect</h1>
            <p className="rl-hero-sub">
              Our policies explain what AskBiz can be used for, how we protect your data,
              how we use AI responsibly, and how we comply with UK, EU, and US law.
              Last reviewed: <strong>{LAST_REVIEWED}</strong>. Effective: <strong>{EFFECTIVE_DATE}</strong>.
            </p>

            {/* Search */}
            <div className="rl-search-wrap">
              <span className="rl-search-icon" aria-hidden>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.7" />
                  <path d="M13 13l2.5 2.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </span>
              <input
                className="rl-search-input"
                type="search"
                placeholder="Search policies — e.g. GDPR, copyright, API abuse…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search policies"
              />
              {query && (
                <button className="rl-search-clear" onClick={() => setQuery("")} aria-label="Clear">×</button>
              )}
            </div>

            {query.length > 1 && (
              <div className="rl-search-results">
                {results.length === 0 ? (
                  <div className="rl-search-empty">
                    <p>No results for <strong>"{query}"</strong></p>
                    <p className="rl-search-empty-sub">Try different keywords or <a href="mailto:legal@askbiz.co">email our legal team</a>.</p>
                  </div>
                ) : (
                  <>
                    <p className="rl-search-count">{results.length} result{results.length !== 1 ? "s" : ""} for "{query}"</p>
                    <ul className="rl-search-list">
                      {results.map((a) => (
                        <li key={a.slug}>
                          <Link href={`/rules/${a.slug}`} className="rl-search-item">
                            <span className="rl-search-item-cat">{a.category}</span>
                            <span className="rl-search-item-title">{a.title}</span>
                            <span className="rl-search-item-desc">{a.description}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="rl-hero-deco" aria-hidden>
            <div className="rl-blob b1" /><div className="rl-blob b2" />
          </div>
        </section>

        {/* ── Legal notice banner ── */}
        <div className="rl-notice">
          <div className="rl-notice-inner">
            <span className="rl-notice-icon" aria-hidden>⚖️</span>
            <p>
              These policies are legally binding and form part of AskBiz's Terms of Service.
              They apply to all users worldwide, with jurisdiction-specific provisions noted where applicable.
              For legal queries: <a href="mailto:legal@askbiz.co">legal@askbiz.co</a>
            </p>
          </div>
        </div>

        <div className="rl-content">
          {/* ── Category grid ── */}
          <section className="rl-section" aria-labelledby="categories-heading">
            <h2 id="categories-heading" className="rl-section-title">Policy Categories</h2>
            <div className="rl-cat-grid">
              {POLICY_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`#${cat.slug}`}
                  className="rl-cat-card"
                >
                  <span className="rl-cat-icon" aria-hidden>{cat.icon}</span>
                  <div className="rl-cat-body">
                    <h3 className="rl-cat-title">{cat.title}</h3>
                    <p className="rl-cat-desc">{cat.description}</p>
                    <span className="rl-cat-count">{cat.articles.length} polic{cat.articles.length !== 1 ? "ies" : "y"}</span>
                  </div>
                  <span className="rl-cat-arrow" aria-hidden>→</span>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Compliance badges ── */}
          <section className="rl-compliance" aria-labelledby="compliance-heading">
            <h2 id="compliance-heading" className="rl-section-title">Regulatory Compliance</h2>
            <div className="rl-badges">
              {[
                { label: "UK GDPR", sub: "Data Protection Act 2018", color: "#003399" },
                { label: "EU GDPR", sub: "Regulation 2016/679", color: "#003399" },
                { label: "EU AI Act", sub: "Regulation 2024/1689", color: "#6b21a8" },
                { label: "UK OSA", sub: "Online Safety Act 2023", color: "#c2410c" },
                { label: "CCPA / CPRA", sub: "California Privacy Law", color: "#065f46" },
                { label: "FTC Act", sub: "Section 5 Compliance", color: "#1e40af" },
                { label: "CAN-SPAM", sub: "Email Compliance", color: "#1e40af" },
                { label: "ICO Registered", sub: "UK Data Protection", color: "#075985" },
              ].map((b) => (
                <div key={b.label} className="rl-badge" style={{ "--bc": b.color } as React.CSSProperties}>
                  <span className="rl-badge-label">{b.label}</span>
                  <span className="rl-badge-sub">{b.sub}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── Per-category policy lists ── */}
          {POLICY_CATEGORIES.map((cat) => {
            const articles = POLICY_ARTICLES.filter((a) => a.categorySlug === cat.slug);
            return (
              <section
                key={cat.slug}
                id={cat.slug}
                className="rl-section rl-cat-section"
                aria-labelledby={`cat-${cat.slug}`}
              >
                <div className="rl-cat-section-header">
                  <span className="rl-cat-section-icon" aria-hidden>{cat.icon}</span>
                  <div>
                    <h2 id={`cat-${cat.slug}`} className="rl-section-title rl-section-title--sm">
                      {cat.title}
                    </h2>
                    <p className="rl-cat-section-desc">{cat.description}</p>
                  </div>
                </div>
                <div className="rl-policy-list">
                  {articles.map((a) => (
                    <Link key={a.slug} href={`/rules/${a.slug}`} className="rl-policy-row">
                      <div className="rl-policy-row-main">
                        <span className="rl-policy-row-title">{a.title}</span>
                        <span className="rl-policy-row-desc">{a.description}</span>
                      </div>
                      <div className="rl-policy-row-meta">
                        {a.legalBasis && a.legalBasis.length > 0 && (
                          <span className="rl-policy-law">{a.legalBasis[0].split("(")[0].trim()}</span>
                        )}
                        <span className="rl-policy-read">{a.readTime} min</span>
                        <span className="rl-policy-arrow" aria-hidden>→</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          {/* ── Contact section ── */}
          <section className="rl-contact" aria-labelledby="contact-heading">
            <div className="rl-contact-inner">
              <div className="rl-contact-col">
                <h2 id="contact-heading" className="rl-contact-title">Legal Contacts</h2>
                <p className="rl-contact-sub">For policy-related enquiries, use the appropriate contact below. General support questions should go to <a href="mailto:support@askbiz.co">support@askbiz.co</a>.</p>
              </div>
              <div className="rl-contact-cards">
                {[
                  { label: "Legal & Compliance", email: "legal@askbiz.co", desc: "Copyright claims, law enforcement requests, regulatory enquiries" },
                  { label: "Privacy", email: "privacy@askbiz.co", desc: "GDPR data subject requests, DPA requests, data deletion" },
                  { label: "Security", email: "security@askbiz.co", desc: "Vulnerability disclosure, account compromise, security incidents" },
                  { label: "Appeals", email: "appeals@askbiz.co", desc: "Appealing enforcement decisions, account reinstatement" },
                ].map((c) => (
                  <a key={c.email} href={`mailto:${c.email}`} className="rl-contact-card">
                    <span className="rl-contact-card-label">{c.label}</span>
                    <span className="rl-contact-card-email">{c.email}</span>
                    <span className="rl-contact-card-desc">{c.desc}</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --acc: #d08a59; --acc-light: #f5ebe0; --acc-dark: #b8743e;
          --tx: #1a1916; --tx2: #6b6760; --tx3: #a39e97;
          --sf: #ffffff; --bg: #f9f8f6; --el: #f3f2ef;
          --b: rgba(0,0,0,.08); --r: 12px; --r-sm: 8px;
          --font-head: 'Sora','DM Sans',system-ui,sans-serif;
          --font-body: 'DM Sans',system-ui,sans-serif;
          --shadow-md: 0 4px 16px rgba(0,0,0,.08),0 1px 4px rgba(0,0,0,.04);
        }
        .rl-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        /* Hero */
        .rl-hero { position:relative; overflow:hidden; background:linear-gradient(160deg,#1a1916 0%,#2d2a26 60%,#3d3530 100%); padding:80px 24px 100px; text-align:center; }
        .rl-hero-inner { position:relative; z-index:2; max-width:700px; margin:0 auto; }
        .rl-hero-top { display:flex; flex-direction:column; align-items:center; gap:10px; margin-bottom:20px; }
        .rl-help-back {
          font-size:13px; font-weight:600;
          color:rgba(255,255,255,.5);
          text-decoration:none;
          border:1px solid rgba(255,255,255,.12);
          padding:5px 14px; border-radius:100px;
          transition:color .15s, border-color .15s;
        }
        .rl-help-back:hover { color:rgba(255,255,255,.85); border-color:rgba(255,255,255,.25); }
        .rl-hero-badge { display:inline-block; background:rgba(208,138,89,.18); border:1px solid rgba(208,138,89,.35); color:#e8a87a; font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; padding:5px 14px; border-radius:100px; margin-bottom:20px; }
        .rl-hero-title { font-family:var(--font-head); font-size:clamp(24px,4vw,42px); font-weight:700; color:#fff; margin:0 0 14px; line-height:1.18; letter-spacing:-.02em; }
        .rl-hero-sub { color:rgba(255,255,255,.55); font-size:16px; margin:0 0 32px; line-height:1.6; }
        .rl-hero-sub strong { color:rgba(255,255,255,.8); }

        /* Search */
        .rl-search-wrap { position:relative; max-width:540px; margin:0 auto; }
        .rl-search-icon { position:absolute; left:16px; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.4); pointer-events:none; display:flex; }
        .rl-search-input { width:100%; box-sizing:border-box; padding:15px 44px 15px 48px; border-radius:12px; border:1.5px solid rgba(255,255,255,.12); background:rgba(255,255,255,.08); backdrop-filter:blur(12px); color:#fff; font-size:15px; font-family:var(--font-body); outline:none; transition:border-color .2s,box-shadow .2s; }
        .rl-search-input::placeholder { color:rgba(255,255,255,.35); }
        .rl-search-input:focus { border-color:rgba(208,138,89,.6); box-shadow:0 0 0 4px rgba(208,138,89,.12); }
        .rl-search-clear { position:absolute; right:14px; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.15); border:none; color:rgba(255,255,255,.7); width:24px; height:24px; border-radius:50%; cursor:pointer; font-size:17px; display:flex; align-items:center; justify-content:center; transition:background .15s; }
        .rl-search-clear:hover { background:rgba(255,255,255,.25); }

        .rl-search-results { position:absolute; top:calc(100% + 8px); left:0; right:0; background:var(--sf); border:1px solid var(--b); border-radius:var(--r); box-shadow:var(--shadow-md); text-align:left; max-height:440px; overflow-y:auto; z-index:50; }
        .rl-search-count { font-size:12px; color:var(--tx3); padding:12px 16px 0; margin:0; }
        .rl-search-list { list-style:none; margin:0; padding:8px; }
        .rl-search-item { display:block; padding:12px; border-radius:var(--r-sm); text-decoration:none; transition:background .15s; }
        .rl-search-item:hover { background:var(--el); }
        .rl-search-item-cat { display:block; font-size:11px; font-weight:700; color:var(--acc); text-transform:uppercase; letter-spacing:.06em; margin-bottom:2px; }
        .rl-search-item-title { display:block; font-size:14px; font-weight:600; color:var(--tx); margin-bottom:3px; }
        .rl-search-item-desc { display:block; font-size:13px; color:var(--tx2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .rl-search-empty { padding:28px 20px; text-align:center; color:var(--tx2); }
        .rl-search-empty p { margin:4px 0; }
        .rl-search-empty-sub { font-size:13px; color:var(--tx3); }
        .rl-search-empty a { color:var(--acc); }

        .rl-hero-deco { position:absolute; inset:0; pointer-events:none; z-index:1; }
        .rl-blob { position:absolute; border-radius:50%; filter:blur(80px); opacity:.12; }
        .b1 { width:350px; height:350px; background:var(--acc); top:-80px; left:-80px; }
        .b2 { width:280px; height:280px; background:#3b82f6; bottom:-60px; right:-60px; }

        /* Notice */
        .rl-notice { background:#fefce8; border-bottom:1px solid #fde68a; padding:14px 24px; }
        .rl-notice-inner { max-width:960px; margin:0 auto; display:flex; align-items:flex-start; gap:12px; }
        .rl-notice-icon { font-size:18px; flex-shrink:0; margin-top:1px; }
        .rl-notice p { font-size:13px; color:#92400e; margin:0; line-height:1.55; }
        .rl-notice a { color:#b45309; font-weight:600; text-decoration:underline; }

        /* Content */
        .rl-content { max-width:960px; margin:0 auto; padding:56px 24px 80px; }
        .rl-section { margin-bottom:64px; scroll-margin-top:32px; }
        .rl-section-title { font-family:var(--font-head); font-size:22px; font-weight:700; color:var(--tx); margin:0 0 24px; letter-spacing:-.01em; }
        .rl-section-title--sm { font-size:18px; }

        /* Category grid */
        .rl-cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }
        .rl-cat-card { display:flex; align-items:flex-start; gap:14px; padding:18px; background:var(--sf); border:1.5px solid var(--b); border-radius:var(--r); text-decoration:none; color:var(--tx); transition:border-color .2s,box-shadow .2s,transform .15s; }
        .rl-cat-card:hover { border-color:var(--acc); box-shadow:var(--shadow-md); transform:translateY(-2px); }
        .rl-cat-icon { font-size:24px; width:40px; height:40px; display:flex; align-items:center; justify-content:center; background:var(--el); border-radius:9px; flex-shrink:0; }
        .rl-cat-body { flex:1; min-width:0; }
        .rl-cat-title { font-family:var(--font-head); font-size:14px; font-weight:700; margin:0 0 5px; }
        .rl-cat-desc { font-size:12px; color:var(--tx2); line-height:1.5; margin:0 0 6px; }
        .rl-cat-count { font-size:11px; color:var(--tx3); font-weight:500; }
        .rl-cat-arrow { color:var(--tx3); font-size:16px; flex-shrink:0; transition:color .15s,transform .15s; }
        .rl-cat-card:hover .rl-cat-arrow { color:var(--acc); transform:translateX(2px); }

        /* Compliance badges */
        .rl-compliance { margin-bottom:64px; }
        .rl-badges { display:flex; flex-wrap:wrap; gap:10px; }
        .rl-badge { display:flex; flex-direction:column; padding:10px 16px; background:color-mix(in srgb, var(--bc,var(--acc)) 6%, var(--sf)); border:1.5px solid color-mix(in srgb, var(--bc,var(--acc)) 30%, var(--b)); border-radius:var(--r-sm); min-width:120px; }
        .rl-badge-label { font-size:13px; font-weight:700; color:var(--tx); }
        .rl-badge-sub { font-size:11px; color:var(--tx3); margin-top:2px; }

        /* Policy list */
        .rl-cat-section { border-top:1px solid var(--b); padding-top:48px; }
        .rl-cat-section-header { display:flex; align-items:flex-start; gap:14px; margin-bottom:20px; }
        .rl-cat-section-icon { font-size:22px; width:38px; height:38px; display:flex; align-items:center; justify-content:center; background:var(--el); border-radius:8px; flex-shrink:0; }
        .rl-cat-section-desc { font-size:14px; color:var(--tx2); margin:4px 0 0; line-height:1.5; }
        .rl-policy-list { border:1.5px solid var(--b); border-radius:var(--r); background:var(--sf); overflow:hidden; }
        .rl-policy-row { display:flex; align-items:center; gap:16px; padding:16px 20px; text-decoration:none; color:var(--tx); border-bottom:1px solid var(--b); transition:background .15s; }
        .rl-policy-row:last-child { border-bottom:none; }
        .rl-policy-row:hover { background:var(--el); }
        .rl-policy-row-main { flex:1; min-width:0; }
        .rl-policy-row-title { display:block; font-size:14px; font-weight:600; color:var(--tx); margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .rl-policy-row-desc { display:block; font-size:13px; color:var(--tx2); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .rl-policy-row-meta { display:flex; align-items:center; gap:8px; flex-shrink:0; }
        .rl-policy-law { font-size:11px; color:#1e40af; background:#eff6ff; padding:3px 8px; border-radius:100px; font-weight:600; white-space:nowrap; }
        .rl-policy-read { font-size:11px; color:var(--tx3); background:var(--el); padding:3px 8px; border-radius:100px; }
        .rl-policy-arrow { color:var(--tx3); font-size:16px; transition:color .15s,transform .15s; }
        .rl-policy-row:hover .rl-policy-arrow { color:var(--acc); transform:translateX(2px); }

        /* Contact */
        .rl-contact { background:linear-gradient(135deg,#1a1916 0%,#2d2a26 100%); border-radius:var(--r); padding:48px; overflow:hidden; position:relative; }
        .rl-contact-inner { position:relative; z-index:2; }
        .rl-contact-col { margin-bottom:28px; }
        .rl-contact-title { font-family:var(--font-head); font-size:22px; font-weight:700; color:#fff; margin:0 0 10px; }
        .rl-contact-sub { font-size:15px; color:rgba(255,255,255,.55); line-height:1.6; margin:0; }
        .rl-contact-sub a { color:#e8a87a; text-decoration:underline; }
        .rl-contact-cards { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
        .rl-contact-card { display:flex; flex-direction:column; gap:4px; padding:18px; background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.1); border-radius:var(--r); text-decoration:none; transition:background .15s,border-color .15s; }
        .rl-contact-card:hover { background:rgba(255,255,255,.1); border-color:rgba(208,138,89,.4); }
        .rl-contact-card-label { font-size:12px; font-weight:700; color:#e8a87a; text-transform:uppercase; letter-spacing:.06em; }
        .rl-contact-card-email { font-size:14px; font-weight:600; color:#fff; }
        .rl-contact-card-desc { font-size:12px; color:rgba(255,255,255,.45); line-height:1.4; margin-top:4px; }

        /* Responsive */
        @media (max-width:640px) {
          .rl-hero { padding:60px 20px 80px; }
          .rl-content { padding:40px 20px 60px; }
          .rl-cat-grid { grid-template-columns:1fr; }
          .rl-contact { padding:28px 20px; }
          .rl-contact-cards { grid-template-columns:1fr; }
          .rl-policy-row-desc { display:none; }
          .rl-policy-law { display:none; }
        }
      `}</style>
    </>
  );
}
