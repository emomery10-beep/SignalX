import type { Metadata } from "next";
import Link from "next/link";
import "../help.css";

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
    images: [{ url: "https://askbiz.co/api/og?title=FAQ&category=AskBiz%20Help", width: 1200, height: 630, alt: "AskBiz FAQ" }],
  },
};

const FAQ_SECTIONS = [
  {
    title: "Getting Started", icon: "🚀",
    items: [
      { q: "What is AskBiz?", a: "AskBiz is an AI-powered business intelligence platform for small and medium-sized businesses. It connects to your existing tools — Shopify, QuickBooks, Stripe, Amazon, Xero, and more — and lets you ask plain-English questions about your business data, track KPIs, set up automated alerts, and generate reports.", slug: "what-is-askbiz" },
      { q: "How long does it take to set up?", a: "Most users are seeing real insights within 5 minutes of signing up. Connect your first data source (e.g. Shopify or QuickBooks), wait for the initial sync (1–5 minutes), and your Business Pulse score and dashboard populate automatically. No data team or technical knowledge required.", slug: "first-5-minutes" },
      { q: "Do I need technical skills or a data team?", a: "No. AskBiz is designed for business owners and managers, not analysts. You interact with your data using plain English — just ask a question. There's nothing to code or configure.", slug: "onboarding-guide" },
      { q: "Can I try AskBiz before paying?", a: "Yes. AskBiz offers a 14-day free trial with full access to all features. No credit card required to start. After the trial, you choose a plan that fits your business size.", slug: "plans-comparison" },
    ],
  },
  {
    title: "Data & Integrations", icon: "🔌",
    items: [
      { q: "Which tools does AskBiz connect to?", a: "AskBiz connects to Shopify, Amazon, WooCommerce, Etsy, eBay, TikTok Shop, QuickBooks, Xero, Stripe, PayPal, Google Analytics, and more. New integrations are added regularly.", slug: "connect-first-data-source" },
      { q: "Is my data secure?", a: "Yes. AskBiz uses bank-grade AES-256 encryption for data at rest and TLS 1.3 in transit. All connections to your tools are read-only. We are GDPR compliant with data stored on EU servers.", slug: "data-security" },
      { q: "Can AskBiz change or delete my data?", a: "No. AskBiz only requests read-only access to your connected tools. It cannot create, modify, or delete any records in your source systems.", slug: "data-security" },
      { q: "How often does data sync?", a: "Sync frequency depends on your plan: Starter syncs daily, Growth every 6 hours, Business every hour, Enterprise near real-time. You can also trigger a manual sync at any time.", slug: "data-delayed" },
      { q: "My dashboard is empty after connecting — what do I do?", a: "The first sync can take a few minutes for larger accounts. Refresh after 5 minutes. If still empty, check Settings → Integrations for sync status.", slug: "dashboard-is-empty" },
    ],
  },
  {
    title: "Pricing & Billing", icon: "💳",
    items: [
      { q: "How much does AskBiz cost?", a: "AskBiz has four plans: Starter, Growth, Business, and Enterprise. Pricing is based on connected data sources and team members. See the Plans & Pricing page for current pricing.", slug: "plans-comparison" },
      { q: "Can I cancel anytime?", a: "Yes. Cancel at any time from Settings → Billing → Cancel Plan. Your access continues until the end of your current billing period. No cancellation fees.", slug: "cancel-subscription" },
      { q: "Do you offer annual billing discounts?", a: "Yes — annual billing saves approximately 20% compared to monthly billing.", slug: "plans-comparison" },
      { q: "What happens if I go over my plan limits?", a: "AskBiz will notify you before you hit plan limits. You won't be charged automatically — you'll be prompted to upgrade.", slug: "plans-comparison" },
    ],
  },
  {
    title: "AI & Features", icon: "🤖",
    items: [
      { q: "What is the Business Pulse score?", a: "Business Pulse is a 0–100 score summarising your overall business health. It weighs revenue growth, profit margin, cash flow, customer retention, and other key metrics into a single number.", slug: "business-pulse-score-explained" },
      { q: "How does Ask AskBiz (the AI chat) work?", a: "Ask AskBiz is a conversational AI trained on your connected business data. Ask a plain-English question and it queries your live data to give you an accurate, specific answer.", slug: "ask-first-question" },
      { q: "Can I set up automated alerts?", a: "Yes. Go to Alerts → New Alert and define a condition. Alerts run automatically and notify you by email.", slug: "custom-alert-setup" },
      { q: "Does AskBiz work for businesses outside the UK?", a: "Yes. AskBiz supports businesses globally. The platform works in any currency, and integrations work across all regions.", slug: "connect-first-data-source" },
    ],
  },
  {
    title: "Account & Privacy", icon: "🔒",
    items: [
      { q: "Can I invite team members?", a: "Yes. Go to Settings → Team → Invite Member. You can assign roles (Admin, Analyst, Viewer) to control access.", slug: "invite-team-member" },
      { q: "Where is my data stored?", a: "AskBiz stores data on AWS servers located in the EU (Ireland, eu-west-1). Custom data residency options are available for Enterprise customers.", slug: "gdpr-compliance" },
      { q: "Can I delete my data?", a: "Yes. Request deletion at any time from Settings → Privacy → Delete Account, or email hello@askbiz.co. Deletion is completed within 30 days per GDPR.", slug: "gdpr-compliance" },
      { q: "How do I contact support?", a: "Email hello@askbiz.co — we typically respond within 2 business hours (Mon–Fri, 8am–6pm GMT). Business plan users get priority support.", slug: "getting-support" },
    ],
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_SECTIONS.flatMap((s) =>
    s.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
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
                <li className="hc-breadcrumb-current">FAQ</li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="hc-body">
          {/* Sidebar */}
          <aside className="hc-sidebar" aria-label="FAQ sections">
            <p className="hc-nav-label">Sections</p>
            {FAQ_SECTIONS.map((section) => (
              <a
                key={section.title}
                href={`#${section.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}`}
                className="hc-nav-topic"
                style={{ textDecoration: 'none' }}
              >
                <span className="hc-nav-topic-icon">{section.icon}</span>
                <span className="hc-nav-topic-label">{section.title}</span>
              </a>
            ))}
            <div className="hc-nav-divider" />
            <Link href="/help" className="hc-nav-link">← All Help Topics</Link>
            <Link href="/help/glossary" className="hc-nav-link">Glossary</Link>
          </aside>

          {/* Main */}
          <main className="faq-main">
            <div className="faq-hero">
              <h1 className="faq-title">Frequently Asked Questions</h1>
              <p className="faq-sub">
                Quick answers to the most common questions about AskBiz.
                Can&apos;t find what you need?{" "}
                <a href="mailto:hello@askbiz.co" className="faq-link">Email our team</a>.
              </p>
            </div>

            {FAQ_SECTIONS.map((section) => {
              const id = section.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
              return (
                <section key={section.title} id={id} className="faq-section">
                  <h2 className="faq-section-title">
                    <span className="faq-section-icon">{section.icon}</span>
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
              <div className="faq-cta-icon">💬</div>
              <div>
                <p className="faq-cta-title">Still have a question?</p>
                <p className="faq-cta-sub">Our team typically responds within 2 business hours, Mon–Fri 8am–6pm GMT.</p>
              </div>
              <a href="mailto:hello@askbiz.co" className="faq-cta-btn">Email Support</a>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
