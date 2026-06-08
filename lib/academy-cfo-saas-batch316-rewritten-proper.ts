import { AcademyArticle } from "@/types/academy";

export const batch316Articles: AcademyArticle[] = [
  {
    slug: "customer-lifetime-value-optimization",
    title: "Customer Lifetime Value Optimization: Maximizing Revenue Per Customer",
    description: "Master LTV optimization. Increase customer lifetime value, improve profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer lifetime value", "LTV", "LTV optimization", "customer profitability", "revenue per customer"],
    keyTakeaways: [
      "LTV calculation: (ARPU × gross margin × customer lifetime) = LTV. Example: £100/month ARPU, 70% margin, 36-month lifetime (3 years) = £2,520 LTV. Improvement levers: (1) Increase ARPU (upsell, premium features, price increases), (2) Improve margin (reduce COGS, increase efficiency), (3) Extend lifetime (reduce churn, improve retention). Cost: Varies by lever. Benefit: Higher LTV = can spend more on CAC = more growth. Example: 50% LTV improvement = can spend 50% more on acquisition = 2x growth with same payback period.",
      "Levers to improve LTV: (1) Upsell/cross-sell (40-60% of expansion revenue), (2) Reduce churn (1% churn improvement = 10% LTV improvement), (3) Price increase (2-5% annual increase typical), (4) Feature adoption (customers using more features = stickier). Cost: CS/sales investment (upsell), product/onboarding (adoption), pricing strategy. Benefit: 30-50% LTV improvement typical from combination.",
      "Measurement and tracking: LTV by cohort (acquisition source), by segment (company size, industry), by product tier. Compare: LTV vs CAC (goal: LTV >3x CAC), LTV vs payback (goal: payback < 12 months). Dashboard: Monthly LTV review, cohort analysis (older cohorts = higher LTV), segment analysis (which customers most valuable?). Action: Double down on high-LTV segments, improve low-LTV segments."
    ],
    content: [
      {
        heading: "Optimizing Customer Lifetime Value",
        body: `Maximizing revenue from each customer.

**LTV fundamentals**

Definition:
- LTV = Total revenue customer generates throughout lifetime
- Formula: (Monthly Revenue Per User × Gross Margin %) × Customer Lifetime Months

Example calculation:

Customer: Starter plan, £100/month
- Gross margin: 70% (typical SaaS)
- Customer lifetime: 36 months (3 years, 3% monthly churn = 33 month expected life)
- LTV = (£100 × 0.70) × 36 = £2,520

By cohort:

| Cohort | Initial Plan | Avg. Lifetime (mo) | Expansions | Final ARPU | LTV |
|---|---|---|---|---|---|
| Year 1 | £100/mo | 24 | +£200 | £300 | £5,040 |
| Year 2 | £150/mo | 30 | +£250 | £400 | £8,400 |
| Year 3 | £200/mo | 36 | +£300 | £500 | £12,600 |

Trend: Newer cohorts higher LTV (higher starting price, more expansions)

**LTV improvement levers**

Lever 1: Increase ARPU (expansion revenue)

Mechanisms:
- Upsell: Customer upgrades tier (£100 → £300/month)
- Cross-sell: Add-on features (core product + analytics = +£50)
- Usage-based: More usage = more billing (pay-per-user, pay-per-API call)
- Price increase: Raise price on renewal (2-5% annual typical)

Impact on LTV:
- Base: £100/month, 70% margin, 36 months = £2,520
- +50% ARPU (£150/month): = £3,780 LTV (+50%)
- Combined with expansion: £300/month final = £7,560 LTV (3x)

Example expansion strategy:
- Month 1-6: Customer on Starter (£100)
- Month 7-12: Upsell to Pro (£300), 30% of customers
- Month 13-24: Cross-sell add-on (£50), 50% of customers
- Average: Starter stays £100, upgraded customers £350
- Blended ARPU: 70% stay Starter (£100) + 30% upgrade (£350) = £175
- LTV improvement: £2,520 → £4,410 (+75%)

Lever 2: Improve margins
- Strategy: Reduce cost of goods sold (COGS)
- Examples: Optimize infrastructure (save 10%), outsource support (save 20%), automation (save 15%)
- Impact: Gross margin 70% → 75% = LTV improvement 7%

Lever 3: Extend customer lifetime (reduce churn)
- Mechanism: Improve retention (lower monthly churn)
- Impact: 3% churn = 33 month lifetime vs 2% churn = 50 month lifetime
- Example: Base 70% margin, £100/month ARPU
  - 3% churn: LTV = (70 × 100) × 33 = £2,310
  - 2% churn: LTV = (70 × 100) × 50 = £3,500 (+50%)
  - 1% churn: LTV = (70 × 100) × 100 = £7,000 (3x)

Churn impact (critical lever):

| Monthly Churn | Annual Churn | Avg. Lifetime | Impact |
|---|---|---|---|
| 5% | 50% | 20 months | Poor |
| 3% | 30% | 33 months | Acceptable |
| 2% | 22% | 50 months | Good |
| 1% | 11% | 100 months | Excellent |

**Calculating by segment**

LTV by acquisition source:

| Source | Customers | ARPU | Margin | Lifetime | LTV | Payback |
|---|---|---|---|---|---|---|
| Organic | 50 | £120 | 75% | 48 months | £4,320 | 4 months |
| Paid ads | 100 | £90 | 70% | 30 months | £1,890 | 6 months |
| Sales | 30 | £300 | 70% | 36 months | £7,560 | 5 months |
| Partner | 20 | £150 | 70% | 42 months | £4,410 | 5 months |

Insight: Organic source has highest LTV (better customers, longer lifetime)

Strategy: Emphasize organic (referral, content marketing), improve paid ads (cohort quality)

LTV by company size:

| Company Size | Customers | Churn | Lifetime | ARPU | LTV |
|---|---|---|---|---|---|
| SMB | 200 | 5% | 20 months | £100 | £1,400 |
| Mid-market | 100 | 2% | 50 months | £500 | £17,500 |
| Enterprise | 20 | 0.5% | 200 months | £3000 | £420,000 |

Insight: Enterprise high LTV, worth extra sales/CS investment

Strategy: Invest in enterprise sales (payback period longer but LTV huge)

**LTV vs CAC relationship**

Rule of thumb: LTV should be 3x+ CAC

Example:
- LTV: £2,520
- CAC: £500 (cost to acquire customer)
- Ratio: £2,520 / £500 = 5x (healthy)
- Payback: £500 / (£100 × 0.70) = 7 months (good, <12 months target)

If ratio low:
- LTV: £1,500
- CAC: £500
- Ratio: 3x (barely acceptable)
- Action: Improve LTV (increase ARPU, reduce churn) OR reduce CAC

Payback period (how fast recover CAC):

Formula: CAC / (Monthly revenue × Gross margin)

Example:
- CAC: £500
- Monthly revenue: £100
- Gross margin: 70%
- Payback: £500 / (£100 × 0.70) = 7 months

Target: <12 months payback (SMB SaaS)

If payback >12 months:
- Problem: Taking too long to break even
- Solutions: Reduce CAC (cheaper acquisition) or increase initial ARPU

**Improving LTV: action plan**

Analysis phase:
- Calculate current LTV (by cohort, segment)
- Identify lowest LTV cohorts/segments
- Root cause: Why is LTV low? (Churn? Low ARPU? Low margin?)

Example:

Cohort: Paid ads Q1 2024
- Current LTV: £1,890
- Issue: High churn (5% vs 3% average)
- Root cause: Ads attracting wrong customer (price-sensitive, not good fit)
- Plan: Improve targeting (show ads to higher-intent audiences)
- Expected impact: Churn 5% → 3%, LTV £1,890 → £2,550 (+35%)

Improvement initiatives:

Initiative 1: Reduce churn (highest leverage)
- Actions: Improve onboarding (faster time-to-value), customer success (check-ins), product (reliability)
- Expected impact: 5% churn → 3% = 50% LTV improvement
- Cost: CS investment (£50K/year)
- ROI: £50K investment for 50% LTV improvement = huge

Initiative 2: Expand ARPU
- Actions: Upsell to higher tiers (30% of customers), cross-sell add-ons (50%), usage-based pricing
- Expected impact: £100 → £180 ARPU = 80% LTV improvement
- Cost: Sales/CS investment (£30K/year)
- ROI: Strong (expansion easy if customer already paying)

Initiative 3: Improve customer fit
- Actions: Better targeting (ads, sales), qualification, messaging
- Expected impact: Reduce churn (better fit = stay longer), increase expansion (right customers buy more)
- Cost: Marketing/sales improvement (time)
- ROI: Compound effect (lower churn + higher expansion)

Combined example (Year 1 → Year 2):

Year 1 baseline:
- ARPU: £100
- Churn: 5% (20 month lifetime)
- Margin: 70%
- LTV: (£100 × 0.70) × 20 = £1,400

Initiatives:
- Reduce churn 5% → 3%: Lifetime 20 → 33 months (+65%)
- Increase ARPU £100 → £150: (+50%)
- Improve margin 70% → 72%: (+2.8%)

Year 2 result:
- ARPU: £150
- Churn: 3% (33 month lifetime)
- Margin: 72%
- LTV: (£150 × 0.72) × 33 = £3,564 (+155%)

Impact: 2.5x LTV improvement = can double CAC spending = 2x growth

**Measurement dashboard**

Monthly metrics:

| Metric | Current | Target | Status |
|---|---|---|---|
| Overall LTV | £2,520 | £3,500 | Below |
| LTV by organic | £4,320 | £5,000 | On track |
| LTV by paid | £1,890 | £2,500 | Below |
| LTV by enterprise | £100K | £150K | Below |
| Expansion ARPU | 1.10x | 1.25x | Below |
| Churn rate | 4% | 2% | Needs improvement |
| Payback (months) | 8 | <12 | Good |
| LTV/CAC ratio | 4.2x | 5x+ | On track |

Quarterly analysis:
- Cohort LTV: Are recent cohorts higher/lower LTV?
- Segment LTV: Which segments most valuable?
- Expansion: How much expansion revenue? (goal: 20-40% of new ARR)
- Churn: Any cohort churn issues?
- Pricing: Any price change impact?

Actions:
- Organic source strong: Double down on content/referral
- Paid source weak: Improve targeting or pause
- Enterprise strong but small: Build enterprise sales team
- Expansion weak: Improve upsell/cross-sell playbook
- Churn increasing: Investigate (product issue? Customer fit? Competition?)

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "retention-and-churn-reduction-mechanics", "pricing-strategy-and-price-optimization", "account-management-and-expansion-revenue", "customer-success-metrics-and-program-design"],
    faq: [
      { q: "How do I calculate LTV?", a: "LTV = (Monthly ARPU × Gross margin %) × Customer lifetime (months). Example: £100/month ARPU, 70% margin, 36-month lifetime = £2,520. Improve: (1) Increase ARPU (upsell, cross-sell = +50%), (2) Reduce churn (extend lifetime = +50%), (3) Improve margin (reduce costs). Combine levers for 2-3x LTV improvement." },
      { q: "What's a healthy LTV to CAC ratio?", a: "Target: LTV > 3x CAC (minimum), ideally 5x+ CAC. Example: CAC £500, LTV £2,520 = 5x (healthy). Payback period (how long to recover CAC): Target <12 months. If ratio low or payback long: Improve LTV (reduce churn, increase ARPU) or reduce CAC (more efficient acquisition)." },
      { q: "What's the fastest way to improve LTV?", a: "Highest leverage: Reduce churn (1% churn reduction = 10% LTV improvement). Second: Increase ARPU through expansion (upsell/cross-sell = 30-50% improvement). Third: Improve margins (5-10% improvement typical). Combine all three for 50-100% LTV improvement. ROI: Positive (lower CAC spend needed, higher revenue per customer)." }
    ],
    videoUrl: ""
  }
];

export default batch316Articles;