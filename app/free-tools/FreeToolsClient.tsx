"use client";

import Link from "next/link";

const TOOLS = [
  {
    href: "/free-tools/landed-cost-calculator",
    icon: "🚢",
    title: "Landed Cost Calculator",
    tagline: "What does your shipment actually cost?",
    description:
      "Calculate the true landed cost of any imported product. Enter your supplier price, origin country, HS code, freight method, and destination — get a full breakdown of import duty, VAT, freight, insurance, and FX conversion cost.",
    features: [
      "Duty rates for 25+ import destinations",
      "28 HS code categories covered",
      "Sea, air, and road freight options",
      "VAT/GST calculation by country",
      "True per-unit cost in your currency",
      "Compare freight methods side by side",
    ],
    cta: "Calculate Landed Cost →",
    color: "#d08a59",
    popular: true,
  },
  {
    href: "/free-tools/fx-risk-modeller",
    icon: "💱",
    title: "FX Risk Modeller",
    tagline: "How much does currency risk cost you?",
    description:
      "Model how exchange rate movements affect your profit margins. Enter your selling price, supplier currency, and target margin — see your break-even rate and margin impact across mild, moderate, and severe depreciation scenarios.",
    features: [
      "15 currency pairs covered",
      "3 depreciation scenarios (mild/moderate/severe)",
      "Break-even exchange rate calculation",
      "Per-product margin impact table",
      "Annualised volatility context",
      "Rebalancing price suggestions",
    ],
    cta: "Model FX Risk →",
    color: "#3b82f6",
    popular: false,
  },
  {
    href: "/free-tools/vat-calculator",
    icon: "🧾",
    title: "VAT / Sales Tax Calculator",
    tagline: "Add or remove tax in one click",
    description:
      "Calculate VAT, GST, or sales tax for 30 countries. Add tax to a net price or extract tax from a gross price. Supports standard, reduced, and zero rates with country-specific rules.",
    features: [
      "30 countries covered",
      "Add VAT or extract from gross",
      "Standard, reduced & zero rates",
      "US state-level sales tax",
      "Auto-detects VAT / GST / Sales Tax label",
      "Full rate reference table",
    ],
    cta: "Calculate VAT →",
    color: "#16a34a",
    popular: false,
  },
  {
    href: "/free-tools/break-even-calculator",
    icon: "📐",
    title: "Break-Even Calculator",
    tagline: "How many units until you're profitable?",
    description:
      "Enter your fixed costs, selling price, and variable cost per unit. Instantly see your break-even point in units and revenue, contribution margin, profit scenarios at different volumes, and price sensitivity analysis.",
    features: [
      "Break-even in units & revenue",
      "Contribution margin calculation",
      "6 profit/loss scenarios",
      "Price sensitivity analysis",
      "Monthly or yearly fixed costs",
      "12 currencies supported",
    ],
    cta: "Calculate Break-Even →",
    color: "#7c3aed",
    popular: false,
  },
];

const FAQS = [
  {
    q: "Are these tools really free?",
    a: "Yes — completely free, no sign-up required. You can use them as many times as you like. They are powered by AskBiz, a business intelligence platform for SME founders. If you find them useful, there's a link to learn more about AskBiz at the bottom.",
  },
  {
    q: "How accurate are the duty rates?",
    a: "Duty rates are sourced from the UK Global Tariff, US HTS, and EU Combined Nomenclature, updated quarterly. They are indicative — always verify with a customs broker or the official tariff database before making a significant import decision. Rates can change with trade agreements and budget announcements.",
  },
  {
    q: "What is a landed cost?",
    a: "Landed cost is the total cost of getting a product from your supplier to your warehouse, including supplier price, international freight, import duty, VAT/GST, customs clearance, insurance, and currency conversion. Many importers underestimate their true cost by 15–30% by ignoring one or more of these elements.",
  },
  {
    q: "What is FX risk for importers?",
    a: "If you price your products in GBP but pay your suppliers in USD or CNY, a change in the exchange rate changes your effective cost — even if the supplier price stays the same. A 10% GBP depreciation against USD means your USD-priced goods cost 10% more in GBP. The FX Risk Modeller shows you exactly how much margin you lose at different exchange rate levels.",
  },
  {
    q: "What is an HS code?",
    a: "An HS (Harmonised System) code is a 6-digit number used by customs authorities worldwide to classify traded goods. Your HS code determines your import duty rate. The Landed Cost Calculator includes the most common categories — if you need a specific code, the UK Trade Tariff (gov.uk/trade-tariff) is the official reference.",
  },
  {
    q: "Can I use these for my business planning?",
    a: "Yes — these tools are designed for business planning. Use the Landed Cost Calculator to set accurate product pricing and the FX Risk Modeller to stress-test your margins before a large purchase order. For deeper analysis connected to your live sales data, AskBiz's full platform goes significantly further.",
  },
];

export default function FreeToolsClient() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Free Business Tools — AskBiz",
              description: "Free business calculators — landed cost, FX risk, VAT, and break-even analysis for SME founders.",
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
              <Link href="/help" className="ft-nav-link">Help Center</Link>
              <Link href="/free-tools/landed-cost-calculator" className="ft-nav-link">Landed Cost</Link>
              <Link href="/free-tools/vat-calculator" className="ft-nav-link">VAT Calculator</Link>
              <Link href="/free-tools/break-even-calculator" className="ft-nav-link">Break-Even</Link>
              <Link href="/#pricing" className="ft-nav-cta">Try AskBiz Free →</Link>
            </div>
          </div>
        </nav>

        {/* ── Hero ── */}
        <section className="ft-hero">
          <div className="ft-hero-inner">
            <div className="ft-hero-badge">Free Tools — No Sign-Up Required</div>
            <h1 className="ft-hero-title">
              Know Your True Costs<br />
              <span className="ft-hero-accent">Before You Order</span>
            </h1>
            <p className="ft-hero-sub">
              Free calculators for importers, exporters, and business owners. Landed cost, FX risk,
              VAT, and break-even analysis — in seconds, with no account needed.
            </p>
            <div className="ft-hero-stats">
              {[
                ["30+", "Countries covered"],
                ["4", "Free calculators"],
                ["12", "Currencies supported"],
                ["Free", "No sign-up"],
              ].map(([val, label]) => (
                <div key={label} className="ft-hero-stat">
                  <span className="ft-hero-stat-val">{val}</span>
                  <span className="ft-hero-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="ft-hero-deco" aria-hidden>
            <div className="ft-blob b1"/><div className="ft-blob b2"/>
          </div>
        </section>

        {/* ── Tool cards ── */}
        <section className="ft-tools" aria-labelledby="tools-heading">
          <div className="ft-tools-inner">
            <h2 id="tools-heading" className="ft-section-title">Choose a Tool</h2>
            <div className="ft-tool-grid">
              {TOOLS.map((tool) => (
                <div key={tool.href} className="ft-tool-card" style={{ "--tc": tool.color } as React.CSSProperties}>
                  {tool.popular && <div className="ft-tool-popular">Most used</div>}
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
              <h2 className="ft-why-title">Why Most Importers Underestimate Their Costs</h2>
              <p className="ft-why-body">
                Most importers calculate: <strong>Supplier price + freight = landed cost.</strong> That's wrong by 15–30%.
              </p>
              <p className="ft-why-body">
                The true landed cost includes import duty (0–45% depending on product and destination), VAT or GST on the full CIF value, customs clearance fees, insurance, and the hidden cost of currency conversion. A shipment that looks profitable at the supplier quote stage can be loss-making by the time it reaches your warehouse.
              </p>
              <p className="ft-why-body">
                Our Landed Cost Calculator adds all of these. Our FX Risk Modeller shows you what happens to your margin if the exchange rate moves 5%, 10%, or 20% against you — before you commit to a large purchase order.
              </p>
            </div>
            <div className="ft-why-example">
              <div className="ft-example-card">
                <div className="ft-example-title">Example: 1,000 cotton T-shirts from China to UK</div>
                <div className="ft-example-rows">
                  {[
                    ["Supplier price (ex-works)", "£2,800", false],
                    ["Sea freight (LCL)", "£380", false],
                    ["Import duty (12% on CIF)", "£384", true],
                    ["UK VAT (20% on CIF + duty)", "£713", true],
                    ["Customs clearance", "£25", true],
                    ["Insurance (0.5%)", "£16", true],
                    ["", "", false],
                    ["True landed cost", "£4,318", false],
                    ["vs. naive estimate", "£3,180", false],
                    ["Difference", "+£1,138 (36%)", true],
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
            <h2 id="faq-heading" className="ft-section-title">Frequently Asked Questions</h2>
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
              <h2 className="ft-cta-title">Want These Calculations Connected to Your Live Data?</h2>
              <p className="ft-cta-sub">
                AskBiz connects to your Shopify, Amazon, or QuickBooks account and pre-fills these
                tools with your real products, prices, and margins. Ask questions in plain English
                and get answers grounded in your actual numbers.
              </p>
            </div>
            <div className="ft-cta-actions">
              <Link href="/" className="ft-cta-btn ft-cta-btn--primary">Try AskBiz Free →</Link>
              <Link href="/help" className="ft-cta-btn ft-cta-btn--ghost">Help Center</Link>
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="ft-footer">
          <div className="ft-footer-inner">
            <span>© 2026 AskBiz</span>
            <div className="ft-footer-links">
              {[
                ["/", "Home"],
                ["/free-tools/landed-cost-calculator", "Landed Cost Calculator"],
                ["/free-tools/fx-risk-modeller", "FX Risk Modeller"],
                ["/free-tools/vat-calculator", "VAT Calculator"],
                ["/free-tools/break-even-calculator", "Break-Even Calculator"],
                ["/help", "Help Center"],
                ["/rules", "Rules & Policies"],
                ["/privacy", "Privacy"],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="ft-footer-link">{label}</Link>
              ))}
            </div>
            <p className="ft-footer-disclaimer">
              Rates are indicative and updated quarterly. Always verify with official tariff databases before making import decisions.
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

        /* Hero */
        .ft-hero { position: relative; overflow: hidden; background: linear-gradient(150deg, #1a1916 0%, #2d2a26 55%, #1a2030 100%); padding: 80px 24px 100px; text-align: center; }
        .ft-hero-inner { position: relative; z-index: 2; max-width: 680px; margin: 0 auto; }
        .ft-hero-badge { display: inline-block; background: rgba(208,138,89,.18); border: 1px solid rgba(208,138,89,.3); color: #e8a87a; font-size: 12px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; padding: 5px 14px; border-radius: 100px; margin-bottom: 24px; }
        .ft-hero-title { font-family: var(--font-head); font-size: clamp(30px, 5vw, 52px); font-weight: 800; color: #fff; margin: 0 0 16px; line-height: 1.12; letter-spacing: -.025em; }
        .ft-hero-accent { color: var(--acc); }
        .ft-hero-sub { color: rgba(255,255,255,.55); font-size: 18px; margin: 0 0 40px; line-height: 1.6; }
        .ft-hero-stats { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
        .ft-hero-stat { display: flex; flex-direction: column; align-items: center; gap: 3px; }
        .ft-hero-stat-val { font-family: var(--font-head); font-size: 28px; font-weight: 800; color: #fff; }
        .ft-hero-stat-label { font-size: 12px; color: rgba(255,255,255,.45); text-transform: uppercase; letter-spacing: .05em; }
        .ft-hero-deco { position: absolute; inset: 0; pointer-events: none; z-index: 1; }
        .ft-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: .12; }
        .b1 { width: 500px; height: 500px; background: var(--acc); top: -150px; left: -150px; }
        .b2 { width: 400px; height: 400px; background: #3b82f6; bottom: -100px; right: -100px; }

        /* Tools section */
        .ft-tools { padding: 72px 24px; }
        .ft-tools-inner { max-width: 1100px; margin: 0 auto; }
        .ft-section-title { font-family: var(--font-head); font-size: 26px; font-weight: 700; color: var(--tx); margin: 0 0 32px; letter-spacing: -.01em; }
        .ft-tool-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(460px, 1fr)); gap: 24px; }
        .ft-tool-card { background: var(--sf); border: 1.5px solid var(--b); border-radius: var(--r); padding: 36px; position: relative; overflow: hidden; transition: box-shadow .2s, transform .2s; }
        .ft-tool-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
        .ft-tool-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px; background: var(--tc); }
        .ft-tool-popular { position: absolute; top: 20px; right: 20px; background: var(--acc-light); color: var(--acc-dark); font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: .06em; }
        .ft-tool-icon { font-size: 40px; margin-bottom: 16px; display: block; }
        .ft-tool-title { font-family: var(--font-head); font-size: 22px; font-weight: 700; color: var(--tx); margin: 0 0 6px; }
        .ft-tool-tagline { font-size: 14px; font-weight: 600; color: var(--tx3); margin: 0 0 14px; }
        .ft-tool-desc { font-size: 15px; color: var(--tx2); line-height: 1.65; margin: 0 0 20px; }
        .ft-tool-features { list-style: none; margin: 0 0 28px; padding: 0; display: flex; flex-direction: column; gap: 7px; }
        .ft-tool-features li { font-size: 14px; color: var(--tx2); display: flex; align-items: center; gap: 8px; }
        .ft-tool-features span { color: var(--tc); font-weight: 700; }
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
        .ft-cta-sub { font-size: 15px; color: rgba(255,255,255,.5); line-height: 1.65; margin: 0; max-width: 560px; }
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
