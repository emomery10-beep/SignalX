import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | AskBiz Help",
  description:
    "Quick answers to the most common AskBiz questions — pricing, data sources, security, integrations, billing, and how the AI works.",
  keywords:
    "askbiz faq, askbiz questions, askbiz pricing, askbiz security, askbiz integrations, how does askbiz work, askbiz free trial",
  alternates: { canonical: "https://askbiz.co/help/faq" },
  openGraph: {
    title: "AskBiz FAQ — Frequently Asked Questions",
    description: "Quick answers to the most common questions about AskBiz.",
    url: "https://askbiz.co/help/faq",
    siteName: "AskBiz",
    type: "website",
    images: [
      {
        url: "https://askbiz.co/api/og?title=FAQ&category=AskBiz%20Help",
        width: 1200,
        height: 630,
        alt: "AskBiz FAQ",
      },
    ],
  },
};

const FAQ_SECTIONS = [
  {
    title: "Getting Started",
    icon: "🚀",
    items: [
      {
        q: "What is AskBiz?",
        a: "AskBiz is an AI-powered business intelligence platform for small and medium-sized businesses. It connects to your existing tools — Shopify, QuickBooks, Stripe, Amazon, Xero, and more — and lets you ask plain-English questions about your business data, track KPIs, set up automated alerts, and generate reports.",
        slug: "what-is-askbiz",
      },
      {
        q: "How long does it take to set up?",
        a: "Most users are seeing real insights within 5 minutes of signing up. Connect your first data source (e.g. Shopify or QuickBooks), wait for the initial sync (1–5 minutes), and your Business Pulse score and dashboard populate automatically. No data team or technical knowledge required.",
        slug: "first-5-minutes",
      },
      {
        q: "Do I need technical skills or a data team?",
        a: "No. AskBiz is designed for business owners and managers, not analysts. You interact with your data using plain English — just ask \"What was my best-selling product last month?\" or \"Is my profit margin improving?\" There's nothing to code or configure.",
        slug: "onboarding-guide",
      },
      {
        q: "Can I try AskBiz before paying?",
        a: "Yes. AskBiz offers a 14-day free trial with full access to all features. No credit card required to start. After the trial, you choose a plan that fits your business size.",
        slug: "plans-comparison",
      },
    ],
  },
  {
    title: "Data & Integrations",
    icon: "🔌",
    items: [
      {
        q: "Which tools does AskBiz connect to?",
        a: "AskBiz connects to Shopify, Amazon, WooCommerce, Etsy, eBay, TikTok Shop, QuickBooks, Xero, Stripe, PayPal, Google Analytics, and more. New integrations are added regularly. Check Settings → Integrations for the full current list.",
        slug: "connect-first-data-source",
      },
      {
        q: "Is my data secure?",
        a: "Yes. AskBiz uses bank-grade AES-256 encryption for data at rest and TLS 1.3 in transit. All connections to your tools are read-only — AskBiz can never modify or delete your data. We are GDPR compliant with data stored on EU servers. See our Security Centre for full details.",
        slug: "data-security",
      },
      {
        q: "Can AskBiz change or delete my data?",
        a: "No. AskBiz only requests read-only access to your connected tools. It cannot create, modify, or delete orders, transactions, customers, or any other records in your source systems.",
        slug: "data-security",
      },
      {
        q: "How often does data sync?",
        a: "Sync frequency depends on your plan: Starter syncs daily, Growth every 6 hours, Business every hour, Enterprise near real-time (every 5–15 minutes). You can also trigger a manual sync at any time from Settings → Integrations.",
        slug: "data-delayed",
      },
      {
        q: "My dashboard is empty after connecting — what do I do?",
        a: "The first sync can take a few minutes for larger accounts. Refresh after 5 minutes. If still empty, go to Settings → Integrations to check the sync status. See our full troubleshooting guide for all common causes.",
        slug: "dashboard-is-empty",
      },
    ],
  },
  {
    title: "Pricing & Billing",
    icon: "💳",
    items: [
      {
        q: "How much does AskBiz cost?",
        a: "AskBiz has four plans: Starter (free trial → paid), Growth, Business, and Enterprise. Pricing is based on the number of connected data sources and team members. See the Plans & Pricing page for current pricing, or go to Settings → Billing in your account.",
        slug: "plans-comparison",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. You can cancel your subscription at any time from Settings → Billing → Cancel Plan. Your access continues until the end of your current billing period. There are no cancellation fees.",
        slug: "cancel-subscription",
      },
      {
        q: "Do you offer annual billing discounts?",
        a: "Yes — annual billing saves you approximately 20% compared to monthly billing. Switch at any time from Settings → Billing → Change Plan → Annual.",
        slug: "plans-comparison",
      },
      {
        q: "What happens if I go over my plan limits?",
        a: "AskBiz will notify you before you hit plan limits. You won't be charged automatically — you'll be prompted to upgrade if you need more. You can also contact us to discuss custom limits for Enterprise use cases.",
        slug: "plans-comparison",
      },
    ],
  },
  {
    title: "AI & Features",
    icon: "🤖",
    items: [
      {
        q: "What is the Business Pulse score?",
        a: "Business Pulse is a 0–100 score that summarises your overall business health. It weighs revenue growth, profit margin, cash flow, customer retention, and other key metrics into a single number — updated every time your data syncs. A score above 70 is strong; below 50 means action is needed.",
        slug: "business-pulse-score-explained",
      },
      {
        q: "How does Ask AskBiz (the AI chat) work?",
        a: "Ask AskBiz is a conversational AI trained on your connected business data. You ask a plain-English question and it queries your live data to give you an accurate, specific answer. It doesn't make up numbers — if it can't find the data, it tells you. Ask anything from 'What were my top 5 products last month?' to 'Am I on track to hit my revenue goal?'",
        slug: "ask-first-question",
      },
      {
        q: "Can I set up automated alerts?",
        a: "Yes. Go to Alerts → New Alert and define a condition (e.g. 'Notify me if daily revenue drops more than 20% vs last week'). Alerts run automatically and notify you by email. You can have unlimited alerts on Growth, Business, and Enterprise plans.",
        slug: "custom-alert-setup",
      },
      {
        q: "Does AskBiz work for businesses outside the UK?",
        a: "Yes. AskBiz supports businesses globally. The platform works in any currency, and integrations like Shopify, Amazon, and Stripe work across all regions. UK, US, EU, and Australian tax frameworks are supported in accounting integrations.",
        slug: "connect-first-data-source",
      },
    ],
  },
  {
    title: "Account & Privacy",
    icon: "🔒",
    items: [
      {
        q: "Can I invite team members?",
        a: "Yes. Go to Settings → Team → Invite Member. You can assign roles (Admin, Analyst, Viewer) to control what each person can see and do. Business and Enterprise plans support multiple team members; Starter and Growth plans have seat limits.",
        slug: "invite-team-member",
      },
      {
        q: "Where is my data stored?",
        a: "AskBiz stores data on AWS servers located in the EU (Ireland, eu-west-1). For Enterprise customers, custom data residency options (UK, US, EU) are available. See our GDPR & Privacy documentation for full details.",
        slug: "gdpr-compliance",
      },
      {
        q: "Can I delete my data?",
        a: "Yes. You have the right to request deletion of all your data at any time. Go to Settings → Privacy → Delete Account, or email hello@askbiz.co. Deletion is permanent and completed within 30 days in compliance with GDPR.",
        slug: "gdpr-compliance",
      },
      {
        q: "How do I contact support?",
        a: "Email hello@askbiz.co — we typically respond within 2 business hours (Mon–Fri, 8am–6pm GMT). Business plan users get priority support with a 1-hour response time. Enterprise customers have a dedicated account manager.",
        slug: "getting-support",
      },
    ],
  },
];

// FAQ structured data (FAQPage schema)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((s) =>
    s.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
    { "@type": "ListItem", position: 2, name: "Help Centre", item: "https://askbiz.co/help" },
    { "@type": "ListItem", position: 3, name: "FAQ", item: "https://askbiz.co/help/faq" },
  ],
};

export default function FAQPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="faq-root">
        {/* Header */}
        <header className="faq-header">
          <div className="faq-header-inner">
            <Link href="/help" className="faq-brand">
              <svg className="faq-brand-icon" viewBox="0 0 28 28" fill="none" aria-hidden>
                <rect width="28" height="28" rx="7" fill="#d08a59"/>
                <path d="M7 14h14M14 7v14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <span className="faq-brand-name">AskBiz</span>
              <span className="faq-brand-sep">|</span>
              <span className="faq-brand-label">Help Centre</span>
            </Link>
            <nav className="faq-breadcrumb" aria-label="Breadcrumb">
              <ol className="faq-breadcrumb-list">
                <li><Link href="/help" className="faq-bc-link">Help Centre</Link></li>
                <li aria-hidden><span className="faq-bc-sep">›</span></li>
                <li className="faq-bc-current" aria-current="page">FAQ</li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="faq-body">
          {/* Sidebar */}
          <aside className="faq-sidebar" aria-label="FAQ sections">
            <nav>
              <p className="faq-sidebar-label">Jump to section</p>
              {FAQ_SECTIONS.map((section) => (
                <a
                  key={section.title}
                  href={`#${section.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                  className="faq-sidebar-link"
                >
                  <span className="faq-sidebar-icon" aria-hidden>{section.icon}</span>
                  {section.title}
                </a>
              ))}
              <div className="faq-sidebar-divider" />
              <Link href="/help" className="faq-sidebar-link faq-sidebar-link--back">← All Help Topics</Link>
              <Link href="/help/glossary" className="faq-sidebar-link">📖 Glossary</Link>
            </nav>
          </aside>

          {/* Main */}
          <main className="faq-main">
            <div className="faq-hero">
              <h1 className="faq-title">Frequently Asked Questions</h1>
              <p className="faq-sub">
                Quick answers to the most common questions about AskBiz.
                Can't find what you need?{" "}
                <a href="mailto:hello@askbiz.co" className="faq-link">Email our team</a>.
              </p>
            </div>

            {FAQ_SECTIONS.map((section) => {
              const id = section.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
              return (
                <section key={section.title} id={id} className="faq-section" aria-labelledby={`${id}-heading`}>
                  <h2 id={`${id}-heading`} className="faq-section-title">
                    <span className="faq-section-icon" aria-hidden>{section.icon}</span>
                    {section.title}
                  </h2>
                  <dl className="faq-list">
                    {section.items.map((item, i) => (
                      <div key={i} className="faq-item">
                        <dt className="faq-q">{item.q}</dt>
                        <dd className="faq-a">
                          <p>{item.a}</p>
                          <Link href={`/help/${item.slug}`} className="faq-article-link">
                            Read full article →
                          </Link>
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              );
            })}

            {/* Contact CTA */}
            <div className="faq-cta">
              <div className="faq-cta-icon" aria-hidden>💬</div>
              <div>
                <p className="faq-cta-title">Still have a question?</p>
                <p className="faq-cta-sub">Our team typically responds within 2 business hours, Mon–Fri 8am–6pm GMT.</p>
              </div>
              <a href="mailto:hello@askbiz.co" className="faq-cta-btn">Email Support</a>
            </div>
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
          --font-head: 'Sora', 'DM Sans', system-ui, sans-serif;
          --font-body: 'DM Sans', system-ui, sans-serif;
          --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
          --shadow-md: 0 4px 16px rgba(0,0,0,.08);
        }

        .faq-root { min-height: 100vh; background: var(--bg); font-family: var(--font-body); color: var(--tx); }

        /* Header */
        .faq-header { position: sticky; top: 0; z-index: 100; background: var(--sf); border-bottom: 1px solid var(--b); box-shadow: var(--shadow-sm); }
        .faq-header-inner { max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 56px; display: flex; align-items: center; gap: 20px; }
        .faq-brand { display: flex; align-items: center; gap: 8px; text-decoration: none; flex-shrink: 0; }
        .faq-brand-icon { width: 28px; height: 28px; }
        .faq-brand-name { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--tx); }
        .faq-brand-sep { color: var(--tx3); font-weight: 300; font-size: 18px; margin: 0 2px; }
        .faq-brand-label { font-size: 15px; font-weight: 500; color: var(--tx2); }
        .faq-breadcrumb { flex: 1; min-width: 0; }
        .faq-breadcrumb-list { list-style: none; margin: 0; padding: 0; display: flex; align-items: center; gap: 2px; font-size: 13px; }
        .faq-bc-link { color: var(--tx2); text-decoration: none; transition: color .15s; }
        .faq-bc-link:hover { color: var(--acc); }
        .faq-bc-sep { color: var(--tx3); padding: 0 4px; }
        .faq-bc-current { color: var(--tx); font-weight: 500; }

        /* Body layout */
        .faq-body { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: flex-start; gap: 20px; min-height: calc(100vh - 56px); }

        /* Sidebar */
        .faq-sidebar { width: 220px; flex-shrink: 0; align-self: flex-start; background: var(--sf); border-right: 1px solid var(--b); height: calc(100vh - 56px); padding: 20px 0 32px; position: sticky; top: 56px; overflow-y: auto; }
        .faq-sidebar-label { font-size: 11px; font-weight: 700; color: var(--tx3); text-transform: uppercase; letter-spacing: .06em; padding: 0 16px; margin: 0 0 8px; }
        .faq-sidebar-link { display: flex; align-items: center; gap: 8px; padding: 9px 16px; font-size: 13px; font-weight: 500; color: var(--tx2); text-decoration: none; transition: background .12s, color .12s; }
        .faq-sidebar-link:hover { background: var(--el); color: var(--tx); }
        .faq-sidebar-link--back { color: var(--tx3); }
        .faq-sidebar-icon { font-size: 15px; }
        .faq-sidebar-divider { height: 1px; background: var(--b); margin: 12px 0; }

        /* Main */
        .faq-main { flex: 1; min-width: 0; padding: 32px 0 64px; }
        .faq-hero { margin-bottom: 40px; padding-bottom: 28px; border-bottom: 1px solid var(--b); }
        .faq-title { font-family: var(--font-head); font-size: 28px; font-weight: 700; margin: 0 0 10px; color: var(--tx); }
        .faq-sub { font-size: 15px; color: var(--tx2); margin: 0; line-height: 1.6; }
        .faq-link { color: var(--acc); text-decoration: underline; }

        /* Section */
        .faq-section { margin-bottom: 48px; scroll-margin-top: 72px; }
        .faq-section-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; color: var(--tx); margin: 0 0 20px; display: flex; align-items: center; gap: 10px; }
        .faq-section-icon { font-size: 20px; }

        /* FAQ list */
        .faq-list { margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0; background: var(--sf); border: 1px solid var(--b); border-radius: var(--r); overflow: hidden; }
        .faq-item { border-bottom: 1px solid rgba(0,0,0,.06); padding: 20px 24px; }
        .faq-item:last-child { border-bottom: none; }
        .faq-q { font-size: 15px; font-weight: 700; color: var(--tx); margin: 0 0 10px; display: block; }
        .faq-a { margin: 0; }
        .faq-a p { font-size: 14px; line-height: 1.7; color: var(--tx2); margin: 0 0 10px; }
        .faq-article-link { font-size: 13px; font-weight: 600; color: var(--acc); text-decoration: none; transition: color .15s; }
        .faq-article-link:hover { color: var(--acc-dark); text-decoration: underline; }

        /* Contact CTA */
        .faq-cta { margin-top: 16px; background: var(--sf); border: 1px solid var(--b); border-radius: var(--r); padding: 24px 28px; display: flex; align-items: center; gap: 20px; }
        .faq-cta-icon { font-size: 28px; flex-shrink: 0; }
        .faq-cta-title { font-size: 15px; font-weight: 700; color: var(--tx); margin: 0 0 4px; }
        .faq-cta-sub { font-size: 13px; color: var(--tx2); margin: 0; }
        .faq-cta-btn { display: inline-flex; align-items: center; padding: 9px 20px; background: var(--acc); color: #fff; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; white-space: nowrap; flex-shrink: 0; margin-left: auto; transition: background .15s; }
        .faq-cta-btn:hover { background: var(--acc-dark); }

        /* Responsive */
        @media (max-width: 768px) {
          .faq-body { padding: 0; flex-direction: column; gap: 0; }
          .faq-sidebar { width: 100%; height: auto; position: static; border-right: none; border-bottom: 1px solid var(--b); padding: 12px 0; }
          .faq-main { padding: 20px 16px 48px; }
          .faq-brand-label { display: none; }
          .faq-brand-sep { display: none; }
          .faq-cta { flex-wrap: wrap; }
          .faq-cta-btn { margin-left: 0; width: 100%; justify-content: center; }
        }
      `}}/>
    </>
  );
}
