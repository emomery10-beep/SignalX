import { AcademyArticle } from "@/types/academy";

export const batch179Articles: AcademyArticle[] = [
  {
    slug: "subscription-metrics-and-mrr-calculations",
    title: "Subscription Metrics and MRR Calculations: Tracking Recurring Revenue",
    description: "Master subscription metrics. Calculate MRR accurately, track metrics precisely, and understand drivers of recurring revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "MRR",
      "ARR",
      "subscription metrics",
      "recurring revenue",
      "monthly recurring revenue",
      "annual recurring revenue",
      "net MRR",
      "gross MRR",
      "churn",
      "retention metrics"
    ],
    keyTakeaways: [
      "MRR definition: Monthly Recurring Revenue (predictable, recurring). Calculation: Sum of all active monthly subscriptions. Example: 100 customers × £1K/month = £100K MRR. Exclude: One-time fees, non-recurring. Why: SaaS valuation depends on MRR (multiple of MRR). Higher MRR = higher company value.",
      "MRR components: (1) New MRR (new customer acquisitions), (2) Expansion MRR (existing customer upgrades), (3) Churn MRR (cancellations, negative). Formula: Starting MRR + New + Expansion - Churn = Ending MRR. Example: £100K + £20K (new 20 customers) + £5K (expansion) - £2K (churn 2%) = £123K. Track monthly to see growth breakdown (is it new customers or expansion?).",
      "Growth rates: MoM% (month-over-month %) shows growth rate. Example: Month 1 £100K, Month 2 £123K = 23% growth. Deceleration: If growth slowing (25% → 20% → 15%) = warning sign (acquisition slowing or churn increasing). Benchmark: Healthy growth 5-10% monthly for growth stage SaaS (50-120% annual)."
    ],
    content: [
      {
        heading: "MRR Fundamentals",
        body: `Understanding and calculating monthly recurring revenue.

**MRR Definition**

MRR: Monthly Recurring Revenue

Sum of all predictable, recurring subscription revenue.

Includes:
- Monthly subscriptions (£1K/month customer = £1K MRR)
- Annual subscriptions (£12K/year customer = £1K MRR, divided by 12)
- Variable pricing (% of revenue model = predictable portion)

Excludes:
- One-time fees (setup fees, professional services)
- Non-recurring revenue (consulting, training sold separately)
- Credits/discounts (adjust downward if applicable)

Example:
- Customer A: £1K/month subscription = £1K MRR
- Customer B: £500/month subscription = £500 MRR
- Customer C: £12K/year annual = £1K MRR (12K/12)
- Customer D: 10% of revenue (variable) = £2K MRR (if avg annual revenue £20K)
- **Total MRR: £4.5K**

**Why MRR Matters**

Valuation:
- SaaS valued as multiple of MRR
- Example: £100K MRR × 5x = £500K valuation
- Higher MRR = higher company value
- Investors focus on MRR (not total revenue)

Predictability:
- MRR = recurring, predictable
- Makes forecasting easier
- Easier to plan headcount, spending

Growth metric:
- MoM growth shows momentum
- 25% MoM = healthy
- 5% MoM = slowing

**ARR from MRR**

ARR = MRR × 12

Example:
- MRR: £100K
- ARR: £1.2M

Why report both:
- MRR: Shows monthly performance, growth rate
- ARR: Shows annual scale (investors like big number)

`
      },
      {
        heading: "Calculating MRR Accurately",
        body: `Methods to ensure accurate MRR tracking.

**Calculation Methods**

Method 1: Sum of active subscriptions
- List all active customers
- Multiply quantity × monthly contract value (MCV)
- Sum total

Example:
| Customer | Monthly Value |
|----------|---|
| Customer A | £1,000 |
| Customer B | £500 |
| Customer C | £200 |
| Customer D | £300 |
| **Total MRR** | **£2,000** |

Simple, accurate if small customer base.

Method 2: Billing records
- Pull monthly billing data
- Sum all invoices issued this month (recurring only)
- Exclude one-time charges

Example:
- April billing total: £100K
- Less one-time setup fees: -£5K
- Less professional services: -£10K
- **April MRR: £85K**

Accurate if invoicing system accurate.

Method 3: Database query
- Query subscription database
- Filter for active subscriptions (status = active)
- Calculate monthly value (annual contract / 12)
- Sum

SELECT SUM(monthly_value) FROM subscriptions WHERE status='active'

Most accurate if data clean.

**Timing Issues**

When to count subscription:
- Start: When customer pays first invoice (cash collected)
- Not: When contract signed (could be pre-payment)
- Not: When service enabled (timing gap)

Annual subscriptions:
- Count: MCV = annual contract value / 12
- Not: Full amount upfront (would skew to lump-sum)

Timing example:
- Customer pays annually (£12K upfront)
- Received April 1
- Count as: £1K MRR (from April onward for 12 months)

**MRR Adjustments**

Downgrades/upgrades (within month):
- Track net change (downgrade -£500, upgrade +£200, net -£300)
- Apply as Churn MRR or Expansion MRR

Prorations:
- Mid-month start (customer starts April 15, pay pro-rata £500)
- Count as £500 MRR (actual monthly value going forward)

Credits:
- Customer credit (£100 credit applied to next bill)
- MRR unchanged (they still subscribed, just discounted this month)

`
      },
      {
        heading: "MRR Growth Breakdown",
        body: `Understanding what drives MRR changes.

**Monthly MRR Movement**

Example:

| Component | Amount |
|-----------|--------|
| Starting MRR | £100,000 |
| + New customers | +£20,000 |
| - Churn | -£2,000 |
| + Expansion | +£5,000 |
| = Ending MRR | £123,000 |
| Growth % | 23% |

Breakdown:
- New customer growth: 20% (new MRR / starting)
- Churn drag: -2% (churn MRR / starting)
- Expansion boost: +5% (expansion MRR / starting)
- Net: 23%

**Growth Rate Trends**

Track MoM% month-by-month:

| Month | MRR | Growth % |
|-------|-----|----------|
| Jan | £100K | - |
| Feb | £115K | 15% |
| Mar | £130K | 13% |
| Apr | £145K | 12% |
| May | £156K | 7.6% |

Trend: Decelerating (15% → 13% → 12% → 7.6%).

Questions:
- Why slowing? (acquisition down, churn up, expansion down?)
- Is it expected? (seasonal? competitive pressure?)
- What to do? (increase marketing, improve onboarding, launch new feature?)

Healthy: 5-10% monthly for growth stage (50-120% annual).

**Cohort-Based MRR**

Track MRR by cohort (acquisition month):

| Cohort | Month 0 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| Jan | £20K | £18K | £16K | £12K |
| Feb | £22K | £20K | £18K | - |
| Mar | £20K | £18K | - | - |

Insight:
- Jan cohort declining (churn, no expansion?)
- Feb cohort similar pattern
- Earlier cohorts declining = retention issue

Action: Investigate retention (product issues? support quality? churn rate too high?).

`
      },
      {
        heading: "MRR Metrics Dashboard",
        body: `Tracking key subscription metrics.

**Core Metrics to Track**

MRR:
- Current: £100K
- MoM growth: +15%
- YoY growth: +80%

New MRR:
- This month: +£20K
- Last month: +£18K
- Trend: Stable

Churn MRR:
- This month: -£2K
- Last month: -£2.2K
- Trend: Improving

Expansion MRR:
- This month: +£5K
- Last month: +£4K
- Trend: Growing

NRR:
- Current: 105% (expansion > churn)
- Healthy >100%

**Dashboard Example**

| Metric | Current | Target | Trend | Status |
|--------|---------|--------|-------|--------|
| MRR | £100K | £110K | ↑ 15% MoM | 91% |
| New MRR | £20K/mo | £25K/mo | ↓ | 80% |
| Churn MRR | -£2K/mo | -£2K/mo | ↑ | ✓ |
| Expansion | £5K/mo | £6K/mo | ↓ | 83% |
| NRR | 105% | 110% | ↓ | 95% |

Interpretation:
- MRR on track but growth slowing
- New customer acquisition down (target missed 20%)
- Churn stable (good)
- Expansion down (opportunity to improve)
- NRR healthy but declining

Actions:
- Boost new customer acquisition (increase marketing)
- Improve expansion (launch expansion program)
- Maintain churn (keep current initiatives)

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "growth-accounting-and-advanced-unit-economics",
      "metrics-dashboard-design-kpi-tracking",
      "churn-analysis-retention-improvement",
      "expansion-revenue-and-upsell-strategy"
    ],
    faq: [
      {
        q: "How do I calculate MRR?",
        a: "Sum all active monthly subscription values. Example: 100 customers × £1K/month = £100K MRR. For annual subscriptions, divide by 12 (£12K annual = £1K MRR). Exclude one-time fees and non-recurring revenue. Use database query (most accurate) or billing records (if clean)."
      },
      {
        q: "What's the difference between MRR and ARR?",
        a: "MRR = Monthly Recurring Revenue (monthly snapshot). ARR = Annual Recurring Revenue (MRR × 12). Both used: MRR for tracking monthly growth, ARR for investor reporting and valuation. Example: £100K MRR = £1.2M ARR."
      },
      {
        q: "How do I break down MRR growth?",
        a: "MRR growth = New MRR - Churn MRR + Expansion MRR. Track each component. Example: Starting £100K + £20K new - £2K churn + £5K expansion = £123K (23% growth). If growth slowing: New down? Churn up? Expansion flat? Diagnose and fix root cause."
      },
      {
        q: "What growth rate should I aim for?",
        a: "Healthy: 5-10% monthly MoM growth (50-120% annually) for growth stage SaaS. Early stage: 20-50% MoM possible (fast doubling). Mature: 2-5% MoM (slowing as base grows). Trend matters: Accelerating = good, decelerating = investigate why."
      }
    ],
    videoUrl: ""
  }
];

export default batch179Articles;
