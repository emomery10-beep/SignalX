import { AcademyArticle } from "@/types/academy";

export const batch155Articles: AcademyArticle[] = [
  {
    slug: "financial-literacy-for-non-finance-team",
    title: "Financial Literacy for Non-Finance Team: Understanding Your Company's Numbers",
    description: "Build financial literacy across the team. Teach non-finance employees to understand P&L, metrics, and how their work drives financial results.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Beginner",
    readTime: 6,
    keywords: [
      "financial literacy",
      "P&L",
      "financial understanding",
      "company metrics",
      "revenue",
      "expenses",
      "profit margins",
      "financial dashboards",
      "team education",
      "business fundamentals"
    ],
    keyTakeaways: [
      "P&L basics: Revenue - Expenses = Profit. Example: £100K revenue, £30K COGS, £40K operating costs = £30K profit (30% margin). Non-finance employees often don't understand this. Impact: Sales rep says \"give 50% discount to win deal\". Should say: \"50% discount = reduce profit from £30K to £5K (83% loss). Only worth if closes 10x deal size\". Financial literacy = better decisions.",
      "Revenue vs margin: Doubling revenue from £500K to £1M is good. But if margin drops 20% to 10% (vs 30%), profit only goes 67% (£150K to £250K, not 100%). Growth without margin = not actually improving (all costs, no profit). Teach: Growth + Margin both matter.",
      "Key metrics everyone should know: MRR/ARR (company growth), CAC (cost to acquire customer), LTV (lifetime value customer generates), Churn (% customers lost monthly), Gross margin (revenue - COGS %), Operating margin (after all costs). If every employee understood these 6, decisions would be better (less wasteful spending, more aligned incentives)."
    ],
    content: [
      {
        heading: "P&L Basics for Everyone",
        body: `Understanding the income statement.

**Simple P&L**

Income Statement:
Revenue: £100K (customers paying for product)
- COGS (£20K): Hosting, support costs
= Gross Profit: £80K (80% margin)
- Operating Expenses (£50K): Sales, engineering, G&A
= Operating Profit: £30K (30% margin)
- Taxes (£6K): Corporate taxes
= Net Profit: £24K (24% net margin)

Meaning:
- Revenue: Money customers pay
- COGS: Direct costs to serve customers
- Gross profit: Revenue after direct costs (health of business)
- Operating expenses: Overhead to run company
- Net profit: Bottom line (actual profit)

**What Each Line Means**

Revenue (£100K):
- Example: 100 customers × £1,000/month
- Grows when: New customers, price increases, expansion
- Risk: If decrease (churn), revenue down

COGS (£20K):
- Hosting: £12K (servers, infrastructure)
- Support: £6K (salaries for support team)
- Payment processing: £2K (Stripe fees)
- Should stay ~20% of revenue (as you grow, hopefully decreases %)

Gross Profit (£80K):
- Leftover to pay overhead
- Should be >70% for healthy SaaS (yours is 80%, excellent)
- If declining, something wrong (costs growing faster than revenue)

Operating Expenses (£50K):
- Sales & Marketing: £20K
- Engineering: £20K
- G&A: £10K
- Should be <50% of revenue at healthy growth stage (yours is 50%, on edge)

Net Profit (£24K):
- Actual profit after everything
- Can invest in growth, pay dividends, or save

**Why This Matters**

Example decision: Sales rep wants 50% discount to close customer

Naive decision: "More customers = good"
- Sell at £500/month instead of £1,000
- But gross margin drops to £400 (80% of £500)
- Operating costs still £500 (fixed per customer)
- Net = -£100 (lose money per customer!)

Smart decision: "Only if deal is much larger"
- 50% discount = -£500 gross profit per customer
- Need 2x customer size to break even
- Example: If customer worth 3x normal = £3K/month, discount worth it

Financial literacy changes behavior.

`
      },
      {
        heading: "Key Metrics Everyone Should Know",
        body: `The 6 metrics that matter most.

**#1: MRR / ARR (Revenue)**

MRR = Monthly Recurring Revenue
- Sum of all subscriptions
- Example: 100 customers × £1,000 = £100K MRR
- Growth: If MRR increasing 5-10% monthly = healthy

ARR = Annual Recurring Revenue
- MRR × 12
- Example: £100K MRR × 12 = £1.2M ARR
- Used for reporting (investors like big numbers)

Why it matters:
- Employees should know company revenue
- Sales: \"Our customer adds this month = £50K new MRR\" (celebrate wins)
- Engineering: \"That outage cost £5K MRR (what customers lost) plus reputation\" (understand impact)

**#2: CAC (Customer Acquisition Cost)**

How much spent to acquire customer.
- Example: Sales & marketing budget £200K, acquired 50 customers = £4K CAC
- If CAC too high, unprofitable (customer won't generate enough LTV to pay back)
- Healthy: CAC <⅓ LTV (payback in 3-4 months)

Why it matters:
- Sales: Understand CAC explains why we can't offer unlimited discounts
- Marketing: Know budget constraints (£200K to acquire 50 customers, limited reach)
- Product: Better product = higher conversion = lower CAC

**#3: LTV (Customer Lifetime Value)**

How much revenue customer generates over lifetime.
- Example: Customer pays £1K/month, stays 5 years = £60K LTV
- Healthy: LTV > 3× CAC (customer generates 3x what it cost to acquire)

Why it matters:
- CS: Value of retention (if 1% churn improvement = £100K customer × 1 = £100K LTV improvement annually)
- Engineering: Product quality directly impacts LTV (better product = longer customer stays)
- Pricing: If increase price 10% = 10% LTV improvement (significant)

**#4: Churn (% Customers Lost Monthly)**

% of customers who cancel each month.
- Example: 100 customers, 2 cancel = 2% monthly churn
- Healthy: <2% monthly (for SMB SaaS)
- If increasing = problem (needs investigation)

Why it matters:
- CS: Goal is reduce churn (each 0.5% improvement = major money)
- Product: Churn reasons often product (improve product = lower churn)
- Sales: Growing but churn high = expensive treadmill (acquire, lose, repeat)

**#5: Gross Margin (Revenue - COGS %)**

Profit after direct costs.
- Example: £100K revenue, £20K COGS = £80K gross profit = 80% margin
- Should improve with scale (costs decrease %)
- Healthy: 70-85% for SaaS

Why it matters:
- Operations: If increasing (good), if decreasing (problem)
- Support: High support costs = low margin (balance quality vs cost)
- Engineering: Infrastructure costs matter (optimize for performance + cost)

**#6: Operating Margin (Revenue - All Costs %)**

Profit after all expenses.
- Example: £100K revenue, £70K total costs = £30K profit = 30% margin
- Healthy: 15-25% growing, >30% mature

Why it matters:
- Every department: Operating costs include your salary/budget
- Finance: Show path to profitability (when does company make money?)
- Strategy: Growth + margin both matter (sacrifice margin for growth, but not too much)

`
      },
      {
        heading: "How Decisions Impact Financials",
        body: `Connecting daily work to financial outcomes.

**Sales Example**

Sales rep closes £50K deal (great!)

Financial impact:
- New MRR: +£4.2K (£50K annual / 12 months, if monthly billing)
- Customer acquisition cost: £4K (already spent in marketing budget)
- LTV if customer stays 2 years: £100K (£4.2K × 24 months)
- Net impact: +£96K to LTV (£100K LTV - £4K CAC)
- Profit improvement: +£3.4K (£4.2K revenue - estimated COGS £0.8K)

**Engineering Example**

Engineer fixes critical bug (faster load times).

Financial impact:
- Churn reduction: -0.2% (customers less frustrated)
- On 500-customer base: 1 customer saved = £1K/month LTV improvement
- Annualized: £12K
- Cost of fix: 1 week engineering time = £2K cost
- ROI: 6x (£12K benefit vs £2K cost)

**Marketing Example**

Marketing spends £100K on new campaign.

Financial impact:
- Expected new customers: 25
- Average CAC: £4K per customer
- Cost: £100K / 25 = £4K CAC (expected)
- LTV per customer: £60K (over lifetime)
- ROI: 6x (£60K benefit vs £10K cost... wait, £60K × 25 = £1.5M vs £100K spend)

Marketing impact huge if LTV high.

**CS Example**

CS team spends £50K to improve retention (training, tools).

Financial impact:
- Churn reduction: -1% (from 3% to 2%)
- Customer base: 500
- Customers saved: 5 per month
- Annual savings: 60 customers × £60K LTV = £3.6M
- Cost: £50K
- ROI: 72x

CS has huge financial leverage.

`
      },
      {
        heading: "Building Financial Culture",
        body: `Making finance visible and understood.

**Monthly All-Hands Reporting**

Share with entire company:

1. Revenue: \"We hit £120K MRR this month (+5% vs last month)\"
   - Celebrate wins (new customers, customer expansions)
   - Acknowledge challenges (churn, pipeline)

2. Key metrics: \"Churn 2.2% (target 2%), CAC £4.2K, LTV/CAC 15x\"
   - Show trends (improving or declining?)
   - Context (how we doing?)

3. Runway: \"Cash runway 18 months at current burn\"
   - If improving (great, on path to sustainability)
   - If declining (need to act)

4. Outlook: \"Next quarter targeting £140K MRR (+17%)\"
   - Growth plan (how will we get there?)
   - What each department contributing

**Dashboard for Visibility**

Post financial dashboard in office (physical or Slack):

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| MRR | £120K | £135K | 89% |
| Churn | 2.2% | 2% | 110% ✗ |
| CAC | £4.2K | £4K | 105% ✗ |
| Runway | 18mo | 24mo | 75% |

Simple, visible, everyone sees status.

**Financial Training**

Quarterly training for team:
- \"How P&L works\" (intro)
- \"How your department impacts financials\" (role-specific)
- \"How to think about ROI\" (decision-making)

Cost: 1 hour per employee per quarter = minimal.

Impact: Better decision-making, aligned incentives.

**Connecting Bonuses to Metrics**

If team understands metrics, tie bonuses to them:

Example:
- Base salary: £50K
- Bonus: +£5K if company hits Q1 revenue target (£140K MRR)
- Bonus: +£2.5K if churn <2%
- Total: £57.5K if both targets hit

Result:
- Everyone has skin in game (care about company metrics)
- Aligned incentives (bonus = company success)
- Behavior change (sales doesn't give 50% discount, understands CAC impact)

`
      }
    ],
    relatedSlugs: [
      "p-l-statement-architecture-profitability",
      "metrics-dashboard-design-kpi-tracking",
      "burn-rate-and-cash-runway-analysis",
      "financial-forecasting-modeling",
      "quarterly-business-reviews-and-planning"
    ],
    faq: [
      {
        q: "What's the most important metric for my role?",
        a: "Sales: CAC (cost to acquire) and LTV (lifetime value, determines if profitable). Engineering: Gross margin (infrastructure cost) and churn (product quality). CS: Churn (retention) and NPS (satisfaction). Marketing: CAC (spending efficiency) and conversion rate. All: MRR (company health) and runway (how long before money runs out)."
      },
      {
        q: "How do I understand P&L?",
        a: "Simple: Revenue - Expenses = Profit. Example: £100K revenue, £30K COGS, £40K operating costs = £30K profit. Gross margin = (Revenue - COGS) / Revenue = 70%. Operating margin = profit / revenue = 30%. Track both. Gross should improve with scale (leverage in overhead)."
      },
      {
        q: "How do my decisions impact the company financially?",
        a: "Example: Closing £50K deal = +£4.2K MRR, -£4K CAC cost, +£100K LTV if stays 2 years. Example: CS fixing churn -1% = 5 customers × £60K LTV = £300K annual value. Every decision has financial impact. Understand yours and make it positive."
      },
      {
        q: "What should the company be transparent about financially?",
        a: "Share: MRR/ARR (revenue), churn (health), runway (survival), profitability path (when profitable?). Hide: Individual salaries, specific customer names (privacy), detailed cost breakdown (competitive). Monthly all-hands: Review metrics, celebrate wins, show progress toward goals."
      }
    ],
    videoUrl: ""
  }
];

export default batch155Articles;
