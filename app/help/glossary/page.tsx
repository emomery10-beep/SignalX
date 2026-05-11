import type { Metadata } from "next";
import Link from "next/link";

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
    images: [
      {
        url: "https://askbiz.co/api/og?title=Glossary&category=AskBiz%20Help",
        width: 1200,
        height: 630,
        alt: "AskBiz Business Glossary",
      },
    ],
  },
};

const GLOSSARY: {
  term: string;
  definition: string;
  category: string;
  relatedSlug?: string;
  relatedLabel?: string;
}[] = [
  // ── AskBiz-specific ──
  { term: "Business Pulse", definition: "AskBiz's 0–100 health score for your business. It weighs revenue, profit, cash flow, growth, and customer metrics into a single number. Above 70 is strong; below 50 means action is needed.", category: "AskBiz", relatedSlug: "business-pulse-score-explained", relatedLabel: "Business Pulse explained" },
  { term: "Ask AskBiz", definition: "The AI chat feature in AskBiz. Ask any plain-English question about your business data — sales, costs, customers, trends — and get an instant, data-backed answer.", category: "AskBiz", relatedSlug: "ask-first-question", relatedLabel: "Ask your first question" },
  { term: "Data Source", definition: "Any external tool or platform connected to AskBiz — for example Shopify, QuickBooks, Stripe, or Amazon. AskBiz pulls data from these sources to build your dashboard and answer questions.", category: "AskBiz", relatedSlug: "connect-first-data-source", relatedLabel: "Connect a data source" },
  { term: "Sync", definition: "The process by which AskBiz fetches the latest data from your connected sources. Syncs happen automatically on a schedule (daily, hourly, or near-real-time depending on plan) and can also be triggered manually.", category: "AskBiz", relatedSlug: "data-delayed", relatedLabel: "Data sync guide" },
  { term: "Integration", definition: "A connection between AskBiz and a third-party platform (e.g. Shopify, QuickBooks). Each integration allows AskBiz to read data from that platform.", category: "AskBiz" },
  { term: "Alert", definition: "An automated notification in AskBiz. You define a condition (e.g. 'revenue drops 20% vs last week') and AskBiz emails you when it's triggered. Alerts run automatically — no manual checking needed.", category: "AskBiz", relatedSlug: "setting-up-alerts", relatedLabel: "Setting up alerts" },
  { term: "Business Pulse Categories", definition: "The five dimensions that make up the Business Pulse score: Revenue Health, Profit & Margin, Cash Flow, Customer Metrics, and Growth Momentum. Each is scored 0–100 and weighted to produce the overall Pulse.", category: "AskBiz" },

  // ── Revenue & Sales ──
  { term: "Revenue", definition: "The total amount of money your business earns from selling products or services before any costs are deducted. Also called 'top line' or 'gross revenue'. Not the same as profit.", category: "Revenue & Sales" },
  { term: "Net Revenue", definition: "Revenue after deducting returns, refunds, and discounts. For e-commerce, net revenue is the more accurate figure because gross revenue includes orders that may be refunded.", category: "Revenue & Sales" },
  { term: "Average Order Value (AOV)", definition: "The average amount spent by a customer per transaction. Calculated as: Total Revenue ÷ Number of Orders. A useful indicator of upsell and cross-sell effectiveness.", category: "Revenue & Sales" },
  { term: "Conversion Rate", definition: "The percentage of visitors or leads who complete a desired action (e.g. making a purchase). E-commerce conversion rate = Orders ÷ Sessions × 100.", category: "Revenue & Sales" },
  { term: "Monthly Recurring Revenue (MRR)", definition: "The predictable, normalised monthly revenue from subscriptions. Used by SaaS and subscription businesses. Annual plans are divided by 12 to get their MRR contribution.", category: "Revenue & Sales" },
  { term: "Annual Recurring Revenue (ARR)", definition: "MRR × 12. The annualised value of your subscription revenue. Used as a key metric for SaaS and subscription business valuation.", category: "Revenue & Sales" },
  { term: "Revenue Run Rate", definition: "A projection of annual revenue based on current performance. If you earned £50,000 last month, your run rate is £600,000/year. Useful for early-stage businesses without 12 months of data.", category: "Revenue & Sales" },

  // ── Profit & Margin ──
  { term: "Gross Profit", definition: "Revenue minus Cost of Goods Sold (COGS). It shows how much money you make from selling products before overhead, payroll, and other operating expenses.", category: "Profit & Margin" },
  { term: "Gross Margin", definition: "Gross Profit expressed as a percentage of Revenue. Formula: (Revenue − COGS) ÷ Revenue × 100. A 60% gross margin means you keep 60p for every £1 of revenue before operating costs.", category: "Profit & Margin" },
  { term: "Net Profit", definition: "What remains after all costs — COGS, operating expenses, taxes, and interest — are deducted from revenue. Also called 'bottom line'. The most important profitability measure for most businesses.", category: "Profit & Margin" },
  { term: "Net Margin", definition: "Net Profit as a percentage of Revenue. A 10% net margin means you keep £10 for every £100 of revenue. Industry averages vary widely — retail typically 2–5%, SaaS typically 10–30%.", category: "Profit & Margin" },
  { term: "EBITDA", definition: "Earnings Before Interest, Taxes, Depreciation, and Amortisation. A measure of core operating profitability used to compare businesses before financing and accounting decisions. Often used in valuations.", category: "Profit & Margin" },
  { term: "Cost of Goods Sold (COGS)", definition: "The direct costs involved in producing or purchasing the products you sell — materials, manufacturing, and fulfilment. For e-commerce, COGS includes product cost, shipping, and packaging.", category: "Profit & Margin" },

  // ── Cash Flow ──
  { term: "Cash Flow", definition: "The movement of money in and out of your business over a period. Positive cash flow means more money came in than went out. A business can be profitable but still have negative cash flow if customers pay slowly.", category: "Cash Flow" },
  { term: "Operating Cash Flow", definition: "Cash generated from normal business operations. Excludes investment and financing activities. A strong indicator of whether a business can sustain itself without raising money.", category: "Cash Flow" },
  { term: "Cash Runway", definition: "How long your current cash reserves will last at your current burn rate. Common in startups: if you have £100,000 and spend £20,000/month, your runway is 5 months.", category: "Cash Flow" },
  { term: "Burn Rate", definition: "The rate at which a business spends its cash reserves. Monthly burn rate = Cash at start of month − Cash at end of month. High burn with low runway is a critical warning sign.", category: "Cash Flow" },
  { term: "Accounts Receivable", definition: "Money owed to your business by customers who haven't paid yet (e.g. on invoice). High accounts receivable can indicate collection problems and is a common cause of cash flow issues.", category: "Cash Flow" },
  { term: "Days Sales Outstanding (DSO)", definition: "The average number of days it takes to collect payment after a sale. DSO = (Accounts Receivable ÷ Annual Revenue) × 365. Lower is better.", category: "Cash Flow" },

  // ── Customer Metrics ──
  { term: "Customer Acquisition Cost (CAC)", definition: "The total cost of acquiring one new customer. Formula: Total Sales & Marketing Spend ÷ New Customers Acquired. Needs to be significantly lower than LTV for a sustainable business.", category: "Customer Metrics" },
  { term: "Customer Lifetime Value (LTV or CLV)", definition: "The total revenue expected from a customer over their entire relationship with your business. LTV = Average Order Value × Purchase Frequency × Average Customer Lifespan.", category: "Customer Metrics" },
  { term: "LTV:CAC Ratio", definition: "Compares how much value a customer generates versus what it costs to acquire them. A ratio of 3:1 or higher is generally considered healthy. Below 1:1 means you're spending more to acquire customers than they're worth.", category: "Customer Metrics" },
  { term: "Churn Rate", definition: "The percentage of customers (or revenue) lost in a given period. Monthly churn = Customers lost in month ÷ Customers at start of month × 100. Even small churn rates compound significantly over time.", category: "Customer Metrics" },
  { term: "Retention Rate", definition: "The percentage of customers who continue to buy from you over a period. Retention Rate = 1 − Churn Rate. High retention is strongly correlated with profitability.", category: "Customer Metrics" },
  { term: "Net Promoter Score (NPS)", definition: "A measure of customer loyalty based on the question: 'How likely are you to recommend us?' Scores range from −100 to +100. Above 50 is excellent; above 70 is world-class.", category: "Customer Metrics" },
  { term: "Repeat Purchase Rate", definition: "The percentage of customers who make more than one purchase. Formula: Customers with 2+ orders ÷ Total customers × 100. A key metric for e-commerce businesses.", category: "Customer Metrics" },

  // ── Inventory ──
  { term: "Inventory Turnover", definition: "How many times inventory is sold and replaced in a period. Formula: COGS ÷ Average Inventory Value. Higher turnover generally means you're managing stock efficiently.", category: "Inventory" },
  { term: "Days of Inventory Outstanding (DIO)", definition: "How long, on average, inventory sits before being sold. Formula: (Average Inventory ÷ COGS) × 365. High DIO can indicate overstocking or slow-moving products.", category: "Inventory" },
  { term: "Stockout", definition: "When a product is out of stock and unavailable for sale. Stockouts cause lost sales and can damage customer relationships — especially in e-commerce where alternatives are one click away.", category: "Inventory" },
  { term: "Reorder Point", definition: "The inventory level that triggers a new purchase order. Formula: (Average Daily Usage × Lead Time) + Safety Stock. Setting reorder points prevents stockouts without overstocking.", category: "Inventory" },
  { term: "Dead Stock", definition: "Inventory that hasn't sold and is unlikely to sell — often seasonal goods past their season, discontinued products, or items with poor demand. Ties up cash and takes up warehouse space.", category: "Inventory" },
  { term: "Safety Stock", definition: "Extra inventory held as a buffer against demand spikes or supply delays. Formula: Safety Stock = (Max Daily Usage − Average Daily Usage) × Lead Time.", category: "Inventory" },

  // ── Growth ──
  { term: "Month-on-Month Growth (MoM)", definition: "The percentage change in a metric from one month to the next. Formula: (Current Month − Prior Month) ÷ Prior Month × 100. Useful for tracking short-term trends.", category: "Growth" },
  { term: "Year-on-Year Growth (YoY)", definition: "The percentage change in a metric compared to the same period last year. More reliable than MoM for seasonal businesses because it removes seasonal distortions.", category: "Growth" },
  { term: "Compound Annual Growth Rate (CAGR)", definition: "The mean annual growth rate over multiple years, smoothing out year-to-year variation. Formula: (Ending Value ÷ Beginning Value)^(1/Years) − 1. Used to compare growth across different time periods.", category: "Growth" },
];

// Group by first letter for alphabetical index
const byLetter: Record<string, typeof GLOSSARY> = {};
GLOSSARY.forEach((item) => {
  const letter = item.term[0].toUpperCase();
  if (!byLetter[letter]) byLetter[letter] = [];
  byLetter[letter].push(item);
});
const letters = Object.keys(byLetter).sort();

// Group by category for sidebar
const categories = [...new Set(GLOSSARY.map((g) => g.category))];

// Schema
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

      <div className="gl-root">
        {/* Header */}
        <header className="gl-header">
          <div className="gl-header-inner">
            <Link href="/help" className="gl-brand">
              <svg className="gl-brand-icon" viewBox="0 0 28 28" fill="none" aria-hidden>
                <rect width="28" height="28" rx="7" fill="#d08a59"/>
                <path d="M7 14h14M14 7v14" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
              <span className="gl-brand-name">AskBiz</span>
              <span className="gl-brand-sep">|</span>
              <span className="gl-brand-label">Help Centre</span>
            </Link>
            <nav className="gl-breadcrumb" aria-label="Breadcrumb">
              <ol className="gl-bc-list">
                <li><Link href="/help" className="gl-bc-link">Help Centre</Link></li>
                <li aria-hidden><span className="gl-bc-sep">›</span></li>
                <li className="gl-bc-current" aria-current="page">Glossary</li>
              </ol>
            </nav>
          </div>
        </header>

        <div className="gl-body">
          {/* Sidebar */}
          <aside className="gl-sidebar" aria-label="Glossary navigation">
            <nav>
              <p className="gl-sidebar-label">By category</p>
              {categories.map((cat) => (
                <a key={cat} href={`#cat-${cat.toLowerCase().replace(/\s+&?\s*/g, "-")}`} className="gl-sidebar-link">
                  {cat}
                </a>
              ))}
              <div className="gl-sidebar-divider" />
              <p className="gl-sidebar-label">By letter</p>
              <div className="gl-letter-index">
                {letters.map((l) => (
                  <a key={l} href={`#letter-${l}`} className="gl-letter-btn">{l}</a>
                ))}
              </div>
              <div className="gl-sidebar-divider" />
              <Link href="/help/faq" className="gl-sidebar-link">← FAQ</Link>
              <Link href="/help" className="gl-sidebar-link">← All Help Topics</Link>
            </nav>
          </aside>

          {/* Main */}
          <main className="gl-main">
            <div className="gl-hero">
              <h1 className="gl-title">Business & AskBiz Glossary</h1>
              <p className="gl-sub">Plain-English definitions for {GLOSSARY.length}+ business metrics and AskBiz-specific terms.</p>
            </div>

            {/* Render by category */}
            {categories.map((cat) => {
              const terms = GLOSSARY.filter((g) => g.category === cat);
              const catId = `cat-${cat.toLowerCase().replace(/\s+&?\s*/g, "-")}`;
              return (
                <section key={cat} id={catId} className="gl-section" aria-labelledby={`${catId}-heading`}>
                  <h2 id={`${catId}-heading`} className="gl-section-title">{cat}</h2>
                  <dl className="gl-list">
                    {terms.map((item) => {
                      const letterId = `letter-${item.term[0].toUpperCase()}`;
                      return (
                        <div key={item.term} id={letterId} className="gl-item">
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

            {/* CTA */}
            <div className="gl-cta">
              <p className="gl-cta-text">Missing a term? <a href="mailto:hello@askbiz.co?subject=Glossary suggestion" className="gl-cta-link">Suggest a definition</a> and we'll add it.</p>
            </div>
          </main>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --acc: #d08a59; --acc-light: #f5ebe0; --acc-dark: #b8743e;
          --tx: #1a1916; --tx2: #6b6760; --tx3: #a39e97;
          --sf: #ffffff; --bg: #f0f2f5; --el: #f3f2ef;
          --b: rgba(0,0,0,.1); --r: 10px;
          --font-head: 'Sora','DM Sans',system-ui,sans-serif;
          --font-body: 'DM Sans',system-ui,sans-serif;
          --shadow-sm: 0 1px 3px rgba(0,0,0,.08);
        }
        .gl-root { min-height:100vh; background:var(--bg); font-family:var(--font-body); color:var(--tx); }

        /* Header */
        .gl-header { position:sticky; top:0; z-index:100; background:var(--sf); border-bottom:1px solid var(--b); box-shadow:var(--shadow-sm); }
        .gl-header-inner { max-width:1200px; margin:0 auto; padding:0 24px; height:56px; display:flex; align-items:center; gap:20px; }
        .gl-brand { display:flex; align-items:center; gap:8px; text-decoration:none; flex-shrink:0; }
        .gl-brand-icon { width:28px; height:28px; }
        .gl-brand-name { font-family:var(--font-head); font-size:16px; font-weight:700; color:var(--tx); }
        .gl-brand-sep { color:var(--tx3); font-weight:300; font-size:18px; margin:0 2px; }
        .gl-brand-label { font-size:15px; font-weight:500; color:var(--tx2); }
        .gl-breadcrumb { flex:1; min-width:0; }
        .gl-bc-list { list-style:none; margin:0; padding:0; display:flex; align-items:center; gap:2px; font-size:13px; }
        .gl-bc-link { color:var(--tx2); text-decoration:none; transition:color .15s; }
        .gl-bc-link:hover { color:var(--acc); }
        .gl-bc-sep { color:var(--tx3); padding:0 4px; }
        .gl-bc-current { color:var(--tx); font-weight:500; }

        /* Layout */
        .gl-body { max-width:1200px; margin:0 auto; padding:0 24px; display:flex; align-items:flex-start; gap:20px; min-height:calc(100vh - 56px); }

        /* Sidebar */
        .gl-sidebar { width:200px; flex-shrink:0; align-self:flex-start; background:var(--sf); border-right:1px solid var(--b); height:calc(100vh - 56px); padding:16px 0 32px; position:sticky; top:56px; overflow-y:auto; }
        .gl-sidebar-label { font-size:10px; font-weight:700; color:var(--tx3); text-transform:uppercase; letter-spacing:.06em; padding:0 14px; margin:12px 0 6px; display:block; }
        .gl-sidebar-link { display:block; padding:8px 14px; font-size:13px; color:var(--tx2); text-decoration:none; transition:background .12s, color .12s; }
        .gl-sidebar-link:hover { background:var(--el); color:var(--tx); }
        .gl-sidebar-divider { height:1px; background:var(--b); margin:10px 0; }
        .gl-letter-index { display:flex; flex-wrap:wrap; gap:4px; padding:4px 14px; }
        .gl-letter-btn { display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border-radius:6px; font-size:12px; font-weight:700; color:var(--tx2); text-decoration:none; background:var(--el); transition:background .12s, color .12s; }
        .gl-letter-btn:hover { background:var(--acc-light); color:var(--acc-dark); }

        /* Main */
        .gl-main { flex:1; min-width:0; padding:28px 0 64px; }
        .gl-hero { margin-bottom:32px; padding-bottom:24px; border-bottom:1px solid var(--b); }
        .gl-title { font-family:var(--font-head); font-size:26px; font-weight:700; margin:0 0 8px; color:var(--tx); }
        .gl-sub { font-size:15px; color:var(--tx2); margin:0; }

        /* Section */
        .gl-section { margin-bottom:40px; scroll-margin-top:72px; }
        .gl-section-title { font-family:var(--font-head); font-size:17px; font-weight:700; color:var(--tx); margin:0 0 16px; padding-bottom:10px; border-bottom:2px solid var(--acc-light); }

        /* Term list */
        .gl-list { margin:0; padding:0; background:var(--sf); border:1px solid var(--b); border-radius:var(--r); overflow:hidden; }
        .gl-item { padding:16px 20px; border-bottom:1px solid rgba(0,0,0,.06); scroll-margin-top:72px; }
        .gl-item:last-child { border-bottom:none; }
        .gl-term { font-size:14px; font-weight:700; color:var(--tx); margin:0 0 6px; display:block; }
        .gl-def { font-size:13px; line-height:1.7; color:var(--tx2); margin:0; }
        .gl-related-link { display:inline-block; margin-top:6px; font-size:12px; font-weight:600; color:var(--acc); text-decoration:none; }
        .gl-related-link:hover { color:var(--acc-dark); text-decoration:underline; }

        /* CTA */
        .gl-cta { margin-top:12px; padding:16px 20px; background:var(--sf); border:1px solid var(--b); border-radius:var(--r); text-align:center; }
        .gl-cta-text { font-size:14px; color:var(--tx2); margin:0; }
        .gl-cta-link { color:var(--acc); text-decoration:underline; font-weight:600; }

        /* Responsive */
        @media (max-width:768px) {
          .gl-body { padding:0; flex-direction:column; gap:0; }
          .gl-sidebar { width:100%; height:auto; position:static; border-right:none; border-bottom:1px solid var(--b); }
          .gl-main { padding:16px 16px 48px; }
          .gl-brand-label { display:none; }
          .gl-brand-sep { display:none; }
        }
      `}}/>
    </>
  );
}
