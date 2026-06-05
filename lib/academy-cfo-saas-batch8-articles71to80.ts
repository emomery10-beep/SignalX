import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_8_ARTICLES_71_TO_80: AcademyArticle[] = [
  {
    slug: "saas-revenue-recognition-deferred-revenue-accounting",
    title: "SaaS Revenue Recognition: ASC 606 and Deferred Revenue",
    description: "Learn how SaaS revenue is recognized for accounting and how deferred revenue affects your balance sheet.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 4,
    keywords: ["revenue recognition", "ASC 606", "deferred revenue", "accounting", "accrual", "SaaS"],
    keyTakeaways: [
      "SaaS revenue is recognized over time as you deliver service, not when cash is collected. Monthly subscriptions are recognized monthly, annual prepayments over 12 months.",
      "Deferred revenue (also called unearned revenue) is a liability: cash collected but service not yet delivered. It decreases as you deliver the service.",
      "ASC 606 (revenue recognition standard) requires recognizing revenue when control of the service transfers to the customer, usually ratably over the contract period."
    ],
    content: [
      {
        heading: "Revenue Recognition: Cash vs. Accrual",
        body: "Two ways to recognize revenue:\n\n**Cash Basis**: Recognize revenue when cash is collected.\n- Example: Customer pays €1,200 upfront for annual service. You recognize €1,200 revenue on day 1.\n- Problem: Doesn't match when you deliver the service.\n\n**Accrual Basis**: Recognize revenue when you've delivered the service.\n- Example: Customer pays €1,200 upfront for annual service. You recognize €100/month revenue each month (€1,200 ÷ 12 months).\n- Better: Matches revenue to service delivery. Required by ASC 606.\n\n**For SaaS**, accrual basis is required:\n- Monthly subscription: Recognize €100 monthly revenue (not when annual plan is paid)\n- Annual prepayment: Recognize €100 monthly, even if customer paid €1,200 upfront\n- Usage-based SaaS: Recognize revenue as usage occurs (harder to predict)\n\n**Impact on financials**:\n- Year 1 Jan: Collect €1,200 cash, recognize €100 revenue, defer €1,100\n- Year 1 Feb–Dec: Recognize €100 revenue each month, reduce deferred revenue\n- Year 2 Jan: Cash deferred revenue from prior year is now recognized\n\nCash and revenue diverge significantly. This is why many early-stage founders are confused: \"We collected €1.2M in January, why does the P&L only show €100k revenue?\""
      },
      {
        heading: "Deferred Revenue (Unearned Revenue): The Hidden Liability",
        body: "Deferred revenue = Cash collected but service not yet delivered\n\n**Example**:\n- Jan 1: Customer pays €12,000 for annual service\n- You now have €12,000 cash (asset)\n- But you owe them 12 months of service (liability)\n- **Deferred Revenue (balance sheet): €12,000**\n- **Monthly Revenue (P&L): €1,000** (as you deliver service)\n\nMonth by month:\n- Jan: DR €1,000 (recognize revenue), reduce Deferred Revenue to €11,000\n- Feb: DR €1,000, reduce Deferred Revenue to €10,000\n- ...continue each month\n- Dec: DR €1,000, Deferred Revenue = €0\n\n**Why this matters for investors**:\nDeferred revenue is cash you've already collected but haven't earned yet. It's a leading indicator of future revenue.\n\n**Magic metric**: Annual Recurring Revenue + Change in Deferred Revenue = True annual cash collected\n\nExample:\n- ARR: €10M\n- Deferred Revenue increased from €1M to €2M (customers paying upfront increasingly)\n- **True cash collected: €10M + (€2M - €1M) = €11M**\n\nInvestors love this: increasing deferred revenue means customer prepayments are rising, giving you better cash flow.\n\n**Deferred revenue by customer segment**:\n- SMB monthly customers: Low deferred revenue (month-to-month, low upfront)\n- SMB annual customers: Medium deferred revenue (€5k–€50k prepayment)\n- Enterprise annual: High deferred revenue (€100k–€1M+ prepayment)\n\nTracking deferred revenue by cohort helps you understand customer prepayment trends and cash flow seasonality."
      },
      {
        heading: "ASC 606: The Revenue Recognition Framework",
        body: "ASC 606 (Accounting Standards Codification 606) is the standard for when to recognize revenue. Five-step process:\n\n**Step 1: Identify the contract with a customer**\n- Do you have a valid contract? (Order, email, T&Cs)\n- Is there commitment from both sides?\n\n**Step 2: Identify the performance obligations**\n- What service(s) are you delivering? (Monthly SaaS access, premium features, support)\n- Single obligation (basic SaaS) or multiple (SaaS + professional services)?\n\n**Step 3: Determine transaction price**\n- What will the customer pay? (Fixed €100/month, usage-based, mixed)\n- Any variable consideration? (Discounts, refunds, success fees)\n\n**Step 4: Allocate transaction price**\n- If multiple performance obligations, split the price accordingly\n- Example: €1,200/year for SaaS (€1,000) + support (€200). Allocate based on standalone selling prices.\n\n**Step 5: Recognize revenue**\n- When is each performance obligation satisfied?\n- For SaaS: Over time (ratably each month)\n- For professional services: Point in time (when project completes)\n\n**Practical example**:\n- Customer signs €10,000 annual SaaS contract + €2,000 implementation service\n- Total transaction price: €12,000\n- Performance obligations: SaaS (€10k, recognized monthly over 12 months) + Implementation (€2k, recognized on completion, day 30)\n- **Month 1 revenue: €833 (SaaS) + €0 (implementation pending) = €833**\n- **Month 1 + day 30 revenue: €833 (SaaS) + €2,000 (implementation complete) = €2,833**\n- **Months 2–12 revenue: €833/month (SaaS only)**\n\n**For most SaaS**, this is straightforward (single performance obligation, recognized ratably). For mixed services, it gets complex."
      },
      {
        heading: "Impact on Financial Statements and Fundraising",
        body: "Revenue recognition significantly affects your financial statements:\n\n**P&L Impact**:\n- Monthly Recurring Revenue (€100k/month collected) becomes €33k–€100k revenue depending on mix of monthly vs. annual customers\n- Investors see slower revenue growth than cash collected, which can be confusing\n- Strong deferred revenue growth signals future revenue, which sophisticated investors love\n\n**Balance Sheet Impact**:\n- Deferred Revenue liability: €300k–€1M (depending on annual adoption)\n- This balance sheet liability is often worth more than equity in early-stage SaaS (negative working capital = good)\n\n**Investor questions**:\n- \"What's your ARR vs. your deferred revenue?\"\n- \"Is deferred revenue growing faster than ARR?\" (Yes = good, customers paying more upfront)\n- \"What's your implied revenue next year based on current deferred revenue?\" (Helps project future revenue)\n\n**Due diligence red flags**:\n- High ARR but low/declining deferred revenue: Customers are switching from annual to monthly (bad)\n- High deferred revenue but customers haven't started using service yet: Risk of refunds (bad)\n- Deferred revenue doesn't reconcile to contracts: Accounting error or policy mistake (red flag)\n\n**In fundraising decks**:\nShow both:\n- **Accrual Revenue (GAAP)**: What accountants recognize\n- **Cash Collected**: What investors care about (especially if annual prepayments are high)\n\nExample: \"We recognize €5M in revenue (accrual) but collected €7M in cash because 50% of customers prepay annually.\""
      }
    ],
    relatedSlugs: [
      "understanding-4-cfo-metric-cards",
      "series-a-prep-uk-cfo-financial-requirements",
      "what-is-cash-flow"
    ],
    faq: [
      {
        q: "Should I track cash or accrual revenue?",
        a: "Both. For financial statements and tax, use accrual (ASC 606). For cash flow and fundraising, show both accrual and cash-basis. Investors want to see both to understand your true economics."
      },
      {
        q: "Does deferred revenue affect my taxes?",
        a: "Depends on your jurisdiction. In most cases, you're taxed on accrual revenue (ASC 606), not cash. Annual prepayments show as revenue in the year received, spread across months."
      },
      {
        q: "What if a customer requests a refund?",
        a: "You reverse the revenue you've recognized and reduce deferred revenue. Example: €1,200 annual prepayment, refund requested at month 3. Reverse €900 revenue (months 4–12), reduce deferred revenue from €900 to €0."
      }
    ],
    videoUrl: ""
  }
];
