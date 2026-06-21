"use client";

import Link from "next/link";
import { useLang } from "@/components/LanguageProvider";

const buildTools = (tc: (key: string) => string) => [
  {
    href: "/free-tools/landed-cost-calculator",
    icon: "🚢",
    title: tc("freetools.tool_landed_title"),
    tagline: tc("freetools.tool_landed_tagline"),
    description: tc("freetools.tool_landed_desc"),
    features: [0, 1, 2, 3, 4, 5].map((i) => tc("freetools.tool_landed_feat_" + i)),
    cta: tc("freetools.tool_landed_cta"),
    color: "#d08a59",
    popular: true,
  },
  {
    href: "/free-tools/fx-risk-modeller",
    icon: "💱",
    title: tc("freetools.tool_fx_title"),
    tagline: tc("freetools.tool_fx_tagline"),
    description: tc("freetools.tool_fx_desc"),
    features: [0, 1, 2, 3, 4, 5].map((i) => tc("freetools.tool_fx_feat_" + i)),
    cta: tc("freetools.tool_fx_cta"),
    color: "#3b82f6",
    popular: false,
  },
  {
    href: "/free-tools/vat-calculator",
    icon: "🧾",
    title: tc("freetools.tool_vat_title"),
    tagline: tc("freetools.tool_vat_tagline"),
    description: tc("freetools.tool_vat_desc"),
    features: [0, 1, 2, 3, 4, 5].map((i) => tc("freetools.tool_vat_feat_" + i)),
    cta: tc("freetools.tool_vat_cta"),
    color: "#16a34a",
    popular: false,
  },
  {
    href: "/free-tools/profit-margin-calculator",
    icon: "💰",
    title: tc("freetools.tool_margin_title"),
    tagline: tc("freetools.tool_margin_tagline"),
    description: tc("freetools.tool_margin_desc"),
    features: [0, 1, 2, 3, 4, 5].map((i) => tc("freetools.tool_margin_feat_" + i)),
    cta: tc("freetools.tool_margin_cta"),
    color: "#16a34a",
    popular: true,
  },
  {
    href: "/free-tools/cogs-calculator",
    icon: "🧮",
    title: tc("freetools.tool_cogs_title"),
    tagline: tc("freetools.tool_cogs_tagline"),
    description: tc("freetools.tool_cogs_desc"),
    features: [0, 1, 2, 3, 4, 5].map((i) => tc("freetools.tool_cogs_feat_" + i)),
    cta: tc("freetools.tool_cogs_cta"),
    color: "#7c3aed",
    popular: false,
  },
  {
    href: "/free-tools/break-even-calculator",
    icon: "📐",
    title: tc("freetools.tool_breakeven_title"),
    tagline: tc("freetools.tool_breakeven_tagline"),
    description: tc("freetools.tool_breakeven_desc"),
    features: [0, 1, 2, 3, 4, 5].map((i) => tc("freetools.tool_breakeven_feat_" + i)),
    cta: tc("freetools.tool_breakeven_cta"),
    color: "#7c3aed",
    popular: false,
  },
];

const buildFaqs = (tc: (key: string) => string) =>
  [0, 1, 2, 3, 4, 5].map((i) => ({
    q: tc("freetools.faq_" + i + "_q"),
    a: tc("freetools.faq_" + i + "_a"),
  }));

export default function FreeToolsClient() {
  const { tc } = useLang();
  const TOOLS = buildTools(tc);
  const FAQS = buildFaqs(tc);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: tc("freetools.schema_page_name"),
              description: tc("freetools.schema_page_desc"),
              url: "https://askbiz.co/free-tools",
              offers: TOOLS.map((t) => ({
                "@type": "Offer",
                name: t.title,
                price: "0",
                priceCurrency: "GBP",
                url: `https://askbiz.co${t.href}`,
              })),
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
        }}
      />

      <div className="ft-root">
        {/* ── Nav ── */}
        <nav className="ft-nav">
          <div className="ft-nav-inner">
            <Link href="/" className="ft-nav-logo">AskBiz</Link>
            <div className="ft-nav-links">
              <Link href="/help" className="ft-nav-link">{tc("freetools.nav_help")}</Link>
              <Link href="/free-tools/landed-cost-calculator" className="ft-nav-link">{tc("freetools.nav_landed")}</Link>
              <Link href="/free-tools/vat-calculator" className="ft-nav-link">{tc("freetools.nav_vat")}</Link>
              <Link href="/free-tools/profit-margin-calculator" className="ft-nav-link">{tc("freetools.nav_margin")}</Link>
              <Link href="/free-tools/cogs-calculator" className="ft-nav-link">{tc("freetools.nav_cogs")}</Link>
              <Link href="/free-tools/break-even-calculator" className="ft-nav-link">{tc("freetools.nav_breakeven")}</Link>
              <Link href="/#pricing" className="ft-nav-cta">{tc("freetools.nav_cta")}</Link>
            </div>
          </div>
        </nav>

        {/* ── Hero — left-aligned, no badge, no stats row, no blobs ── */}
        <section className="ft-hero">
          <div className="ft-hero-inner">
            <p className="ft-hero-label">{tc("freetools.hero_label")}</p>
            <h1 className="ft-hero-title">
              {tc("freetools.hero_title_line1")}<br />{tc("freetools.hero_title_line2")}
            </h1>
            <p className="ft-hero-sub">
              {tc("freetools.hero_sub")}
            </p>
          </div>
        </section>

        {/* ── Tool cards ── */}
        <section className="ft-tools" aria-labelledby="tools-heading">
          <div className="ft-tools-inner">
            <h2 id="tools-heading" className="ft-section-title">{tc("freetools.tools_heading")}</h2>
            <div className="ft-tool-grid">
              {TOOLS.map((tool) => (
                <div key={tool.href} className="ft-tool-card">
                  <div className="ft-tool-icon" aria-hidden>{tool.icon}</div>
                  <h3 className="ft-tool-title">{tool.title}</h3>
                  <p className="ft-tool-tagline">{tool.tagline}</p>
                  <p className="ft-tool-desc">{tool.description}</p>
                  <ul className="ft-tool-features">
                    {tool.features.map((f) => (
                      <li key={f}>
                        <span aria-hidden>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link href={tool.href} className="ft-tool-cta" style={{ background: tool.color }}>
                    {tool.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why landed cost matters ── */}
        <section className="ft-why">
          <div className="ft-why-inner">
            <div className="ft-why-text">
              <h2 className="ft-why-title">{tc("freetools.why_title")}</h2>
              <p className="ft-why-body">
                {tc("freetools.why_body_1_prefix")}<strong>{tc("freetools.why_body_1_strong")}</strong>{tc("freetools.why_body_1_suffix")}
              </p>
              <p className="ft-why-body">
                {tc("freetools.why_body_2")}
              </p>
              <p className="ft-why-body">
                {tc("freetools.why_body_3")}
              </p>
            </div>
            <div className="ft-why-example">
              <div className="ft-example-card">
                <div className="ft-example-title">{tc("freetools.example_title")}</div>
                <div className="ft-example-rows">
                  {[
                    [tc("freetools.example_row_supplier"), "£2,800", false],
                    [tc("freetools.example_row_freight"), "£380", false],
                    [tc("freetools.example_row_duty"), "£384", true],
                    [tc("freetools.example_row_vat"), "£713", true],
                    [tc("freetools.example_row_clearance"), "£25", true],
                    [tc("freetools.example_row_insurance"), "£16", true],
                    ["", "", false],
                    [tc("freetools.example_row_landed"), "£4,318", false],
                    [tc("freetools.example_row_naive"), "£3,180", false],
                    [tc("freetools.example_row_difference"), "+£1,138 (36%)", true],
                  ].map(([label, val, highlight], i) =>
                    label ? (
                      <div key={i} className={`ft-example-row ${highlight ? "ft-example-row--highlight" : ""}`}>
                        <span>{label}</span>
                        <span>{val}</span>
                      </div>
                    ) : <div key={i} className="ft-example-divider" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="ft-faq" aria-labelledby="faq-heading">
          <div className="ft-faq-inner">
            <h2 id="faq-heading" className="ft-section-title">{tc("freetools.faq_heading")}</h2>
            <div className="ft-faq-grid">
              {FAQS.map((faq) => (
                <div key={faq.q} className="ft-faq-item">
                  <h3 className="ft-faq-q">{faq.q}</h3>
                  <p className="ft-faq-a">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="ft-cta-section">
          <div className="ft-cta-inner">
            <div className="ft-cta-text">
              <h2 className="ft-cta-title">{tc("freetools.cta_title")}</h2>
              <p className="ft-cta-sub">
                {tc("freetools.cta_sub")}
              </p>
            </div>
            <div className="ft-cta-actions">
              <Link href="/" className="ft-cta-btn ft-cta-btn--primary">{tc("freetools.cta_primary")}</Link>
              <Link href="/help" className="ft-cta-btn ft-cta-btn--ghost">{tc("freetools.cta_ghost")}</Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="ft-footer">
          <div className="ft-footer-inner">
            <span>{tc("freetools.footer_copyright")}</span>
            <div className="ft-footer-links">
              {[
                ["/", tc("freetools.footer_link_home")],
                ["/free-tools/landed-cost-calculator", tc("freetools.footer_link_landed")],
                ["/free-tools/fx-risk-modeller", tc("freetools.footer_link_fx")],
                ["/free-tools/vat-calculator", tc("freetools.footer_link_vat")],
                ["/free-tools/profit-margin-calculator", tc("freetools.footer_link_margin")],
                ["/free-tools/cogs-calculator", tc("freetools.footer_link_cogs")],
                ["/free-tools/break-even-calculator", tc("freetools.footer_link_breakeven")],
                ["/help", tc("freetools.footer_link_help")],
                ["/rules", tc("freetools.footer_link_rules")],
                ["/privacy", tc("freetools.footer_link_privacy")],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="ft-footer-link">{label}</Link>
              ))}
            </div>
            <p className="ft-footer-disclaimer">
              {tc("freetools.footer_disclaimer")}
            </p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        :root {
          --acc: #d08a59; --acc-dark: #b8743e; --acc-light: #f5ebe0;
          --tx: #1a1916; --tx2: #6b6760; --tx3: #a39e97;
          --sf: #ffffff; --bg: #f9f8f6; --el: #f3f2ef;
          --b: rgba(0,0,0,.08);
          --font-head: 'Sora', 'DM Sans', system-ui, sans-serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --shadow-md: 0 4px 16px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.04);
          --shadow-lg: 0 8px 32px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06);
          --r: 14px; --r-sm: 8px;
        }
        * { box-sizing: border-box; }
        .ft-root { min-height: 100vh; background: var(--bg); font-family: var(--font-body); color: var(--tx); }

        /* Nav */
        .ft-nav { background: var(--sf); border-bottom: 1px solid var(--b); padding: 0 24px; position: sticky; top: 0; z-index: 100; }
        .ft-nav-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 60px; }
        .ft-nav-logo { font-family: var(--font-head); font-size: 18px; font-weight: 800; color: var(--tx); text-decoration: none; }
        .ft-nav-links { display: flex; align-items: center; gap: 20px; }
        .ft-nav-link { font-size: 14px; color: var(--tx2); text-decoration: none; transition: color .15s; }
        .ft-nav-link:hover { color: var(--tx); }
        .ft-nav-cta { font-size: 13px; font-weight: 700; background: var(--acc); color: #fff; padding: 8px 16px; border-radius: 8px; text-decoration: none; transition: background .15s; }
        .ft-nav-cta:hover { background: var(--acc-dark); }

        /* Hero — left-aligned, clean light background */
        .ft-hero { background: var(--sf); border-bottom: 1px solid var(--b); padding: clamp(48px,6vw,80px) 24px; }
        .ft-hero-inner { max-width: 1100px; margin: 0 auto; }
        .ft-hero-label { font-size: 11px; font-weight: 700; color: var(--acc); letter-spacing: .16em; text-transform: uppercase; margin: 0 0 16px; }
        .ft-hero-title { font-family: var(--font-head); font-size: clamp(28px, 4vw, 48px); font-weight: 700; color: var(--tx); margin: 0 0 16px; line-height: 1.08; letter-spacing: -.03em; max-width: 540px; }
        .ft-hero-sub { color: var(--tx2); font-size: 15px; margin: 0; line-height: 1.7; max-width: 420px; }

        /* Tools section */
        .ft-tools { padding: 72px 24px; }
        .ft-tools-inner { max-width: 1100px; margin: 0 auto; }
        .ft-section-title { font-family: var(--font-head); font-size: 26px; font-weight: 700; color: var(--tx); margin: 0 0 32px; letter-spacing: -.01em; }
        .ft-tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(460px, 1fr)); gap: 24px; }
        .ft-tool-card { background: var(--sf); border: 1px solid var(--b); border-radius: var(--r); padding: 36px; position: relative; overflow: hidden; transition: box-shadow .2s, transform .2s; }
        .ft-tool-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
        .ft-tool-icon { font-size: 40px; margin-bottom: 16px; display: block; }
        .ft-tool-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; color: var(--tx); margin: 0 0 6px; }
        .ft-tool-tagline { font-size: 14px; font-weight: 600; color: var(--tx3); margin: 0 0 14px; }
        .ft-tool-desc { font-size: 15px; color: var(--tx2); line-height: 1.65; margin: 0 0 20px; }
        .ft-tool-features { list-style: none; margin: 0 0 28px; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .ft-tool-features li { font-size: 14px; color: var(--tx2); display: flex; align-items: center; gap: 8px; }
        .ft-tool-features span { color: var(--acc); font-weight: 700; }
        .ft-tool-cta { display: inline-flex; align-items: center; justify-content: center; width: 100%; padding: 14px; border-radius: 10px; color: #fff; font-size: 15px; font-weight: 700; text-decoration: none; transition: opacity .15s, transform .15s; }
        .ft-tool-cta:hover { opacity: .9; transform: translateY(-1px); }

        /* Why section */
        .ft-why { background: var(--el); padding: 72px 24px; }
        .ft-why-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
        .ft-why-title { font-family: var(--font-head); font-size: 28px; font-weight: 700; color: var(--tx); margin: 0 0 20px; line-height: 1.25; letter-spacing: -.01em; }
        .ft-why-body { font-size: 15px; color: var(--tx2); line-height: 1.75; margin: 0 0 14px; }
        .ft-why-body:last-child { margin-bottom: 0; }
        .ft-why-body strong { color: var(--tx); font-weight: 700; }
        .ft-example-card { background: var(--sf); border: 1.5px solid var(--b); border-radius: var(--r); padding: 24px; box-shadow: var(--shadow-md); }
        .ft-example-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--tx2); margin-bottom: 16px; text-transform: uppercase; letter-spacing: .04em; }
        .ft-example-rows { display: flex; flex-direction: column; gap: 0; }
        .ft-example-row { display: flex; justify-content: space-between; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--b); font-size: 14px; color: var(--tx2); }
        .ft-example-row:last-child { border-bottom: none; font-weight: 700; color: var(--tx); font-size: 15px; }
        .ft-example-row--highlight { color: #b45309; font-weight: 600; }
        .ft-example-divider { height: 8px; }

        /* FAQ */
        .ft-faq { padding: 72px 24px; }
        .ft-faq-inner { max-width: 1100px; margin: 0 auto; }
        .ft-faq-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 24px; }
        .ft-faq-item { background: var(--sf); border: 1.5px solid var(--b); border-radius: var(--r); padding: 24px; }
        .ft-faq-q { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--tx); margin: 0 0 10px; }
        .ft-faq-a { font-size: 14px; color: var(--tx2); line-height: 1.7; margin: 0; }

        /* CTA section */
        .ft-cta-section { background: linear-gradient(135deg, #1a1916 0%, #2d2a26 100%); padding: 72px 24px; }
        .ft-cta-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
        .ft-cta-title { font-family: var(--font-head); font-size: 26px; font-weight: 700; color: #fff; margin: 0 0 12px; }
        .ft-cta-sub { font-size: 15px; color: rgba(255,255,255,.72); line-height: 1.65; margin: 0; max-width: 560px; }
        .ft-cta-actions { display: flex; gap: 12px; flex-shrink: 0; flex-wrap: wrap; }
        .ft-cta-btn { display: inline-flex; align-items: center; padding: 13px 24px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all .2s; }
        .ft-cta-btn--primary { background: var(--acc); color: #fff; }
        .ft-cta-btn--primary:hover { background: var(--acc-dark); transform: translateY(-1px); }
        .ft-cta-btn--ghost { background: rgba(255,255,255,.08); color: rgba(255,255,255,.8); border: 1px solid rgba(255,255,255,.15); }
        .ft-cta-btn--ghost:hover { background: rgba(255,255,255,.14); color: #fff; }

        /* Footer */
        .ft-footer { background: var(--sf); border-top: 1px solid var(--b); padding: 28px 24px; }
        .ft-footer-inner { max-width: 1100px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .ft-footer-inner > span { font-size: 13px; color: var(--tx3); }
        .ft-footer-links { display: flex; gap: 16px; flex-wrap: wrap; }
        .ft-footer-link { font-size: 13px; color: var(--tx3); text-decoration: none; transition: color .15s; }
        .ft-footer-link:hover { color: var(--acc); }
        .ft-footer-disclaimer { font-size: 11px; color: var(--tx3); margin: 0; width: 100%; }

        /* Responsive */
        @media (max-width: 900px) {
          .ft-tool-grid { grid-template-columns: 1fr; }
          .ft-why-inner { grid-template-columns: 1fr; }
          .ft-faq-grid { grid-template-columns: 1fr; }
          .ft-cta-inner { flex-direction: column; align-items: flex-start; }
          .ft-nav-links { display: none; }
        }
      `}</style>
    </>
  );
}
