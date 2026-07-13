import type { Metadata } from "next";
import Link from "next/link";
import "../help.css";

export const metadata: Metadata = {
  title: "Business & AskBiz Glossary | Help Centre",
  description:
    "Plain-English definitions for business metrics and AskBiz-specific terms — CAC, LTV, churn, gross margin, Business Pulse, and more.",
  keywords:
    "business glossary, business metrics definitions, CAC meaning, LTV meaning, churn rate definition, gross margin explained, business pulse score, askbiz glossary",
  alternates: { canonical: "https://askbiz.co/help/glossary" },
  openGraph: {
    title: "Business & AskBiz Glossary",
    description: "Plain-English definitions for business metrics and AskBiz terms.",
    url: "https://askbiz.co/help/glossary",
    siteName: "AskBiz",
    type: "website",
    images: [{ url: "https://askbiz.co/api/og?title=Glossary&category=AskBiz%20Help", width: 1200, height: 630, alt: "AskBiz Business Glossary" }],
  },
};

const GLOSSARY: {
  term: string;
  definition: string;
  category: string;
  relatedSlug?: string;
  relatedLabel?: string;
}[] = [
  // AskBiz-specific
  { term: "Business Pulse", definition: "AskBiz's 0–100 health score for your business. It weighs revenue, profit, cash flow, growth, and customer metrics into a single number. Above 70 is strong; below 50 means action is needed.", category: "AskBiz", relatedSlug: "business-pulse-score-explained", relatedLabel: "Business Pulse explained" },
  { term: "Ask AskBiz", definition: "The AI chat feature in AskBiz. Ask any plain-English question about your business data — sales, costs, customers, trends — and get an instant, data-backed answer.", category: "AskBiz", relatedSlug: "ask-first-question", relatedLabel: "Ask your first question" },
  { term: "Data Source", definition: "Any external tool or platform connected to AskBiz — for example Shopify, QuickBooks, Stripe, or Amazon. AskBiz pulls data from these sources to build your dashboard and answer questions.", category: "AskBiz", relatedSlug: "connect-first-data-source", relatedLabel: "Connect a data source" },
  { term: "Sync", definition: "The process by which AskBiz fetches the latest data from your connected sources. Syncs happen automatically on a schedule and can also be triggered manually.", category: "AskBiz", relatedSlug: "data-delayed", relatedLabel: "Data sync guide" },
  { term: "Integration", definition: "A connection between AskBiz and a third-party platform. Each integration allows AskBiz to read data from that platform.", category: "AskBiz" },
  { term: "Alert", definition: "An automated notification in AskBiz. You define a condition and AskBiz emails you when it's triggered.", category: "AskBiz", relatedSlug: "setting-up-alerts", relatedLabel: "Setting up alerts" },
  { term: "Business Pulse Categories", definition: "The five dimensions that make up the Business Pulse score: Revenue Health, Profit & Margin, Cash Flow, Customer Metrics, and Growth Momentum.", category: "AskBiz" },
  // Revenue & Sales
  { term: "Revenue", definition: "The total amount of money your business earns from selling products or services before any costs are deducted. Also called 'top line' or 'gross revenue'.", category: "Revenue & Sales" },
  { term: "Net Revenue", definition: "Revenue after deducting returns, refunds, and discounts. For e-commerce, net revenue is the more accurate figure.", category: "Revenue & Sales" },
  { term: "Average Order Value (AOV)", definition: "The average amount spent by a customer per transaction. Calculated as: Total Revenue / Number of Orders.", category: "Revenue & Sales" },
  { term: "Conversion Rate", definition: "The percentage of visitors or leads who complete a desired action (e.g. making a purchase). E-commerce conversion rate = Orders / Sessions * 100.", category: "Revenue & Sales" },
  { term: "Monthly Recurring Revenue (MRR)", definition: "The predictable, normalised monthly revenue from subscriptions.", category: "Revenue & Sales" },
  { term: "Annual Recurring Revenue (ARR)", definition: "MRR * 12. The annualised value of your subscription revenue.", category: "Revenue & Sales" },
  { term: "Revenue Run Rate", definition: "A projection of annual revenue based on current performance.", category: "Revenue & Sales" },
  // Profit & Margin
  { term: "Gross Profit", definition: "Revenue minus Cost of Goods Sold (COGS). Shows how much money you make from selling products before overhead.", category: "Profit & Margin" },
  { term: "Gross Margin", definition: "Gross Profit expressed as a percentage of Revenue. Formula: (Revenue - COGS) / Revenue * 100.", category: "Profit & Margin" },
  { term: "Net Profit", definition: "What remains after all costs are deducted from revenue. Also called 'bottom line'.", category: "Profit & Margin" },
  { term: "Net Margin", definition: "Net Profit as a percentage of Revenue.", category: "Profit & Margin" },
  { term: "EBITDA", definition: "Earnings Before Interest, Taxes, Depreciation, and Amortisation. A measure of core operating profitability.", category: "Profit & Margin" },
  { term: "Cost of Goods Sold (COGS)", definition: "The direct costs involved in producing or purchasing the products you sell.", category: "Profit & Margin" },
  // Cash Flow
  { term: "Cash Flow", definition: "The movement of money in and out of your business over a period.", category: "Cash Flow" },
  { term: "Operating Cash Flow", definition: "Cash generated from normal business operations. Excludes investment and financing activities.", category: "Cash Flow" },
  { term: "Cash Runway", definition: "How long your current cash reserves will last at your current burn rate.", category: "Cash Flow" },
  { term: "Burn Rate", definition: "The rate at which a business spends its cash reserves.", category: "Cash Flow" },
  { term: "Accounts Receivable", definition: "Money owed to your business by customers who haven't paid yet.", category: "Cash Flow" },
  { term: "Days Sales Outstanding (DSO)", definition: "The average number of days it takes to collect payment after a sale.", category: "Cash Flow" },
  // Customer Metrics
  { term: "Customer Acquisition Cost (CAC)", definition: "The total cost of acquiring one new customer. Formula: Total Sales & Marketing Spend / New Customers Acquired.", category: "Customer Metrics" },
  { term: "Customer Lifetime Value (LTV or CLV)", definition: "The total revenue expected from a customer over their entire relationship with your business.", category: "Customer Metrics" },
  { term: "LTV:CAC Ratio", definition: "Compares how much value a customer generates versus what it costs to acquire them. A ratio of 3:1 or higher is considered healthy.", category: "Customer Metrics" },
  { term: "Churn Rate", definition: "The percentage of customers (or revenue) lost in a given period.", category: "Customer Metrics" },
  { term: "Retention Rate", definition: "The percentage of customers who continue to buy from you over a period. Retention Rate = 1 - Churn Rate.", category: "Customer Metrics" },
  { term: "Net Promoter Score (NPS)", definition: "A measure of customer loyalty. Scores range from -100 to +100. Above 50 is excellent.", category: "Customer Metrics" },
  { term: "Repeat Purchase Rate", definition: "The percentage of customers who make more than one purchase.", category: "Customer Metrics" },
  // Inventory
  { term: "Inventory Turnover", definition: "How many times inventory is sold and replaced in a period. Formula: COGS / Average Inventory Value.", category: "Inventory" },
  { term: "Days of Inventory Outstanding (DIO)", definition: "How long, on average, inventory sits before being sold.", category: "Inventory" },
  { term: "Stockout", definition: "When a product is out of stock and unavailable for sale.", category: "Inventory" },
  { term: "Reorder Point", definition: "The inventory level that triggers a new purchase order.", category: "Inventory" },
  { term: "Dead Stock", definition: "Inventory that hasn't sold and is unlikely to sell.", category: "Inventory" },
  { term: "Safety Stock", definition: "Extra inventory held as a buffer against demand spikes or supply delays.", category: "Inventory" },
  // Growth
  { term: "Month-on-Month Growth (MoM)", definition: "The percentage change in a metric from one month to the next.", category: "Growth" },
  { term: "Year-on-Year Growth (YoY)", definition: "The percentage change in a metric compared to the same period last year. More reliable than MoM for seasonal businesses.", category: "Growth" },
  { term: "Compound Annual Growth Rate (CAGR)", definition: "The mean annual growth rate over multiple years, smoothing out year-to-year variation.", category: "Growth" },
];

const byLetter: Record<string, typeof GLOSSARY> = {};
GLOSSARY.forEach((item) => {
  const letter = item.term[0].toUpperCase();
  if (!byLetter[letter]) byLetter[letter] = [];
  byLetter[letter].push(item);
});
const letters = Object.keys(byLetter).sort();
const categories = [...new Set(GLOSSARY.map((g) => g.category))];

const definedTermSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "AskBiz Business & Analytics Glossary",
  url: "https://askbiz.co/help/glossary",
  description: "Plain-English definitions for business metrics and AskBiz-specific terms.",
  publisher: { "@type": "Organization", name: "AskBiz", url: "https://askbiz.co" },
  hasDefinedTerm: GLOSSARY.map((item) => ({
    "@type": "DefinedTerm",
    name: item.term,
    description: item.definition,
    inDefinedTermSet: "https://askbiz.co/help/glossary",
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://askbiz.co" },
    { "@type": "ListItem", position: 2, name: "Help Centre", item: "https://askbiz.co/help" },
    { "@type": "ListItem", position: 3, name: "Glossary", item: "https://askbiz.co/help/glossary" },
  ],
};

export default function GlossaryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="hc-root">
        {/* Header */}
        <header className="hc-header">
          <div className="hc-header-inner">
            <Link href="/help" className="hc-brand">
              <div className="hc-brand-icon">
                <svg width="12" height="12" viewBox="0 0 32 32" fill="none"><g fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 11 V5 H11"/><path d="M21 5 H27 V11"/><path d="M5 21 V27 H11"/><path d="M27 21 V27 H21"/></g><circle cx="16" cy="16" r="2.6" fill="white"/></svg>
              </div>
              <span className="hc-brand-name">AskBiz</span>
            </Link>
            <div className="hc-brand-divider" />
            <Link href="/help" className="hc-brand-label" style={{ textDecoration: 'none' }}>Help Centre</Link>

            <nav className="hc-breadcrumb" aria-label="Breadcrumb">
              <ol className="hc-breadcrumb-list">
                <li><Link href="/help" className="hc-breadcrumb-link">Help Centre</Link></li>
                <li><span className="hc-breadcrumb-sep">›</span></li>
                <li className="hc-breadcrumb-current">Glossary</li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="hc-body">
          {/* Sidebar */}
          <aside className="hc-sidebar" aria-label="Glossary navigation">
            <p className="hc-nav-label">By category</p>
            {categories.map((cat) => (
              <a key={cat} href={`#cat-${cat.toLowerCase().replace(/\s+&?\s*/g, "-")}`} className="hc-nav-link" style={{ paddingLeft: 16 }}>
                {cat}
              </a>
            ))}
            <div className="hc-nav-divider" />
            <p className="hc-nav-label">By letter</p>
            <div className="gl-letter-index">
              {letters.map((l) => (
                <a key={l} href={`#letter-${l}`} className="gl-letter-btn">{l}</a>
              ))}
            </div>
            <div className="hc-nav-divider" />
            <Link href="/help/faq" className="hc-nav-link">← FAQ</Link>
            <Link href="/help" className="hc-nav-link">← All Help Topics</Link>
          </aside>

          {/* Main */}
          <main className="gl-main">
            <div className="gl-hero">
              <h1 className="gl-title">Business & AskBiz Glossary</h1>
              <p className="gl-sub">Plain-English definitions for {GLOSSARY.length}+ business metrics and AskBiz-specific terms.</p>
            </div>

            {categories.map((cat) => {
              const terms = GLOSSARY.filter((g) => g.category === cat);
              const catId = `cat-${cat.toLowerCase().replace(/\s+&?\s*/g, "-")}`;
              return (
                <section key={cat} id={catId} className="gl-section">
                  <h2 className="gl-section-title">{cat}</h2>
                  <dl className="gl-list">
                    {terms.map((item, idx) => {
                      const letterId = `letter-${item.term[0].toUpperCase()}`;
                      return (
                        <div key={item.term} id={idx === 0 ? letterId : undefined} className="gl-item">
                          <dt className="gl-term">{item.term}</dt>
                          <dd className="gl-def">
                            {item.definition}
                            {item.relatedSlug && (
                              <Link href={`/help/${item.relatedSlug}`} className="gl-related-link">
                                {item.relatedLabel || "Learn more"} →
                              </Link>
                            )}
                          </dd>
                        </div>
                      );
                    })}
                  </dl>
                </section>
              );
            })}

            <div className="gl-cta">
              <p className="gl-cta-text">Missing a term? <a href="mailto:hello@askbiz.co?subject=Glossary suggestion" className="gl-cta-link">Suggest a definition</a> and we&apos;ll add it.</p>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
