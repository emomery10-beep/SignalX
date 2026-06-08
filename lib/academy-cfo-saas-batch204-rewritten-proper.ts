import { AcademyArticle } from "@/types/academy";

export const batch204Articles: AcademyArticle[] = [
  {
    slug: "revenue-recognition-and-accounting-standards",
    title: "Revenue Recognition and Accounting Standards: Complying with IFRS and ASC 606",
    description: "Master revenue recognition. Apply ASC 606 / IFRS 15, handle deferred revenue, and report correctly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "revenue recognition",
      "ASC 606",
      "IFRS 15",
      "deferred revenue",
      "performance obligation",
      "revenue accounting",
      "financial reporting",
      "accounting standards",
      "subscription revenue",
      "revenue timing"
    ],
    keyTakeaways: [
      "ASC 606 rule: Revenue recognized when performance obligation satisfied (customer gets promised goods/service). SaaS subscription: Monthly service delivered = monthly revenue. Example: £1200 annual payment (day 1), recognize £100/month (12 months). Month 1: Cash £1200, revenue £100, deferred revenue liability £1100. Upfront billing advantage (cash benefit) vs revenue timing (spread 12 months). Good news: Doesn't change actual economics, just timing of P&L reporting.",
      "Performance obligations: Identify what you promised customer. Example: SaaS = (1) Software access (monthly), (2) Support (monthly), (3) Updates (monthly). Each is performance obligation satisfied monthly = monthly revenue. Bundled services: Allocate price proportionally (if bundle = 70% product, 30% support, split revenue accordingly). Standalone selling price: Use to allocate (if sell product separately at £100/month, support separately at £50, bundle at £120, allocate 67%/33%).",
      "Deferred revenue timing: Important for cash vs. earnings. High deferred revenue (good cash, low revenue) = growing cash (upfront billings). Example: £10M revenue company with annual billing, 90-day sales cycle. Starting deferred revenue £3M (3 months ahead), growing to £4M. This cash is working capital (helps runway). But P&L doesn't show it (spread over 12 months). Monitor: Deferred revenue growth should track revenue growth (if lagging, contraction risk)."
    ],
    content: [
      {
        heading: "ASC 606 and Revenue Recognition Principles",
        body: `Understanding when to recognize revenue.

**ASC 606 Framework (5-step model)**

Step 1: Identify the contract
- Customer and company agree to exchange goods/services for payment
- Contract must have commercial substance (will happen, likely payment)
- Example: Customer signs SaaS subscription agreement for £100/month

Step 2: Identify performance obligations
- What has the company promised to deliver?
- Each distinct good/service = separate obligation
- Example: SaaS subscription includes:
  - Software access (monthly)
  - Support (monthly)
  - Updates (monthly)
  - Is each distinct? Yes (could sell separately)

Step 3: Determine transaction price
- How much is the customer paying?
- Adjust for: Discounts, refunds, variable components
- Example: £1200/year, but 10% discount if paid upfront = £1080

Step 4: Allocate price to obligations
- If multiple obligations, allocate based on standalone selling price
- Example: Software (60% price), support (30%), updates (10%)
- If bundled at £1200: Software £720, support £360, updates £120

Step 5: Recognize revenue when obligation satisfied
- Recognize revenue as/when performance obligation satisfied
- SaaS: Monthly service provided = monthly revenue recognition
- Upfront payment (day 1) ≠ upfront revenue (spread over subscription period)

**Example: Annual subscription with upfront payment**

Customer signs 1-year subscription, £1200 paid upfront

Accounting:
- Day 1 (payment received):
  - Cash: +£1200 (balance sheet asset)
  - Deferred revenue: +£1200 (balance sheet liability)
  - Revenue: £0 (no revenue yet, obligation not satisfied)

- Month 1 (service provided):
  - Revenue: +£100 (P&L, obligation 1/12 satisfied)
  - Deferred revenue: -£100 (liability reduced)
  - Cash: No change (already received day 1)

- Month 12 (final month):
  - Revenue: +£100 (final month)
  - Deferred revenue: -£100 (fully satisfied)
  - Cash: No change

Summary after 12 months:
- Total revenue recognized: £1200 (straight-line)
- Total cash received: £1200 (day 1)
- Deferred revenue: £0 (fully recognized)

**Deferred Revenue Impact**

Growing company (monthly billings, upfront payment):
- Month 1: 10 customers × £100 = £10K cash, £10K deferred revenue
- Month 2: +5 new customers (15 total), £1.5K cash (new), £0.8K deferred (month 2 of month 1 customers), £500 deferred (month 2 of new customers) = total £1.3K deferred increase
- Month 12: 50 customers, £5K cash (new), larger deferred balance

Quarterly deferred revenue balance:
- Start: £0 (no upfront billings)
- Q1: £15K (3 months of billings, quarterly commitment)
- Q2: £25K (growing customer base, longer average subscription life)
- Q3: £40K (strong growth)
- Q4: £50K (mature, deferred revenue = 3-5 months of revenue, depending on payment frequency)

Deferred revenue as % of ARR:
- Healthy: 25-35% (3-4 months of annual revenue deferred)
- Low: <15% (monthly billing mostly, lower deferred)
- High: >50% (very upfront heavy, good cash but concentrated revenue)

**Revenue recognition under different scenarios**

Scenario 1: Month-to-month subscription (no upfront)
- Payment: £100 on 1st of each month
- Revenue: £100 recognized same month
- Deferred: £0 (no deferred revenue)
- Cash flow: Lagging (cash received end of month, revenue recognized start)

Scenario 2: Annual upfront (as above)
- Payment: £1200 upfront
- Revenue: £100 per month
- Deferred: £1200 → £0 over 12 months

Scenario 3: 3-year contract, billed annually
- Payment: £3600 year 1 (£1200 × 3)
- Revenue: £100 per month (only for year 1)
- Deferred: £2400 (years 2-3 obligation, not yet satisfied)
- Recognition: Month 1-12 (£100/month), month 13-24 (£100/month), month 25-36 (£100/month)

Scenario 4: Usage-based (variable consideration)
- Payment: Based on actual usage (variable monthly)
- Example: £0.10 per API call, customer makes 10K calls in month = £1000
- Revenue: £1000 when service provided (monthly)
- Deferred: £0 (monthly billing, immediate revenue)
- Challenge: Can't estimate in advance (unpredictable revenue)

`
      },
      {
        heading: "Accounting Treatment and Financial Reporting",
        body: `Recording and reporting revenue properly.

**Deferred Revenue Liability**

Balance sheet classification:
- Current liability: Revenue expected to be recognized within 12 months
- Non-current liability: Revenue for goods/services beyond 12 months

Example (4-year contract, £4800 paid upfront):
- Month 1-12: Deferred revenue current liability £1200 (expected to recognize next 12 months)
- Month 13-48: Deferred revenue non-current liability £3600 (beyond 12 months)

Quarterly reporting:
- Track deferred revenue balance sheet item
- Growing = good (upfront cash inflow)
- Declining = caution (not adding new upfront billings)

**P&L revenue line items**

SaaS company reporting:

Revenue:
- Subscription revenue: £10M (recurring monthly/annual)
- Professional services: £500K (setup, training, implementation)
- Add-on revenue: £200K (additional features, usage overage)
- **Total revenue: £10.7M**

Alternatively (more detail):
- Subscription revenue: £10M
  - Product (software access): £7M
  - Support: £2M
  - Updates: £1M
- Professional services: £500K
- **Total revenue: £10.5M**

Gross margin:
- COGS (cost of goods sold):
  - Cloud infrastructure: £500K
  - Payment processing: £300K
  - Support (salaries): £1M
  - Professional services COGS: £250K
  - **Total COGS: £2.05M**
- Gross profit: £10.5M - £2.05M = £8.45M
- Gross margin: 80%

**Audit and Compliance**

Auditor review (if raising capital or going public):
- Verify revenue recognition policy documented
- Sample customer contracts (verify ASC 606 compliance)
- Confirm deferred revenue balances (recalculate)
- Review judgment calls (ambiguous performance obligations)

Common audit issues:
- Side letters (verbal promises not in contract, need documentation)
- Variable consideration (discounts, refunds, need estimates)
- Performance obligations (bundled services, need allocation)
- Cut-off (revenue in correct month, not misaligned)

Red flags:
- Revenue concentrated in last month of quarter (cut-off issue)
- Deferred revenue declining (could indicate churn/issues)
- Revenue recognition policy vague (needs clarity)

**Cash vs. Revenue (key insight)**

SaaS advantage: Upfront billing creates cash advantage

Example:
- £10M ARR company, 100% annual upfront billing
- Year 1: Cash received £10M day 1, revenue recognized £10M (12 months)
- Year 2: Cash received £12M (10% growth), revenue recognized £12M
- Cash position: £10M in month 1, used over year for operations
- P&L: Revenue £10M year 1, expenses £3M (costs), operating profit £7M

Key management:
- Monitor: Deferred revenue (cash surrogate)
- High deferred revenue = strong cash position
- Plan: Don't confuse cash (received) vs revenue (recognized)

`
      }
    ],
    relatedSlugs: [
      "p-l-statement-architecture-profitability",
      "subscription-billing-models-and-pricing-architecture",
      "financial-forecasting-modeling",
      "financial-controls-and-audit-readiness",
      "board-reports-and-financial-statements"
    ],
    faq: [
      {
        q: "When do I recognize revenue from a subscription?",
        a: "ASC 606: Recognize when performance obligation satisfied. SaaS subscription = monthly service, so recognize monthly. Example: £1200 paid upfront (year 1) = recognize £100/month over 12 months. Month 1: Cash +£1200, revenue +£100, deferred revenue +£1100. The upfront payment doesn't create upfront revenue, it creates a liability (deferred revenue) that converts to revenue monthly."
      },
      {
        q: "What's the difference between cash and revenue?",
        a: "Cash = money received. Revenue = performance obligation satisfied. Example: Receive £1200 upfront = £1200 cash day 1. But revenue = £100/month (monthly service). So month 1: cash +£1200, revenue +£100 (huge gap!). Deferred revenue (liability) tracks the gap (£1100). Over 12 months: cash received once, revenue recognized monthly. This is why growing SaaS companies show strong cash but lower revenue (upfront billings)."
      },
      {
        q: "What is deferred revenue?",
        a: "Liability (balance sheet) = cash received but not yet earned. Example: £1200 annual subscription = £1200 deferred revenue (liability) on day 1. Each month, as service delivered, deferred revenue decreases (£1200 → £1100 after month 1). Healthy sign: Growing deferred revenue = upfront cash inflow. Shrinking = churn or less upfront billing. Monitor: If deferred revenue is 25-35% of ARR, that's typical for SaaS with annual billing."
      },
      {
        q: "How do I allocate price if I sell bundled services?",
        a: "Use standalone selling price. Example: Product (if sold separately) = £1000/year, support = £300/year, updates = £200/year. Bundle price = £1200 (vs £1500 separate). Allocate: Product 1000/1500 = 67%, support 300/1500 = 20%, updates 200/1500 = 13%. Revenue recognition: Each portion recognized monthly per its obligation (product monthly, support monthly, updates monthly, but at allocated proportion)."
      }
    ],
    videoUrl: ""
  }
];

export default batch204Articles;
