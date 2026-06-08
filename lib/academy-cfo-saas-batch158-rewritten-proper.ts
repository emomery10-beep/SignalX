import { AcademyArticle } from "@/types/academy";

export const batch158Articles: AcademyArticle[] = [
  {
    slug: "churn-analysis-retention-improvement",
    title: "Churn Analysis and Retention Improvement: Keeping Your Customers",
    description: "Master churn analysis. Identify why customers leave, predict churn, and implement retention strategies that improve LTV and profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 8,
    keywords: [
      "churn analysis",
      "customer retention",
      "retention strategies",
      "customer lifetime value",
      "churn rate",
      "cohort analysis",
      "retention metrics",
      "customer satisfaction",
      "expansion revenue",
      "retention programs"
    ],
    keyTakeaways: [
      "Churn definition and impact: Monthly churn % = (customers lost last month / customers start of month) × 100. Example: 100 customers, 2 cancel = 2% churn. Impact on LTV: Customer LTV = ARPU × (1 / churn rate). At 2% churn, LTV = £100 × (1 / 0.02) = £5,000. At 4% churn, LTV = £2,500 (50% drop!). Small churn changes = massive LTV impact. Therefore: 1% churn improvement = huge company value increase.",
      "Cohort-based churn analysis: Slice customers by acquisition month. Example: Jan cohort (100 customers) → Feb 98 (2% churn) → Mar 96 (2% churn) → Apr 94 (2% churn). Trend: Is churn stable or worsening by cohort? Worsening = product issue (fix before scaling). Stable = acceptable. Early cohorts better retention = past improvements working. Early cohorts worse = product regression (investigate).",
      "Retention levers: (1) Onboarding (get to value faster = lower early churn). (2) Product quality (fix bugs = lower churn). (3) Customer success (check-ins, training = lower churn). (4) Pricing (align to value). (5) Expansion (make customers stickier by selling more). ROI on retention: Improve 1% churn = 10-20% LTV improvement (huge value). Cost-benefit: CS spend £50K/year → churn -1% → LTV improvement £300K+ → 6x+ ROI."
    ],
    content: [
      {
        heading: "Understanding Churn and Its Impact",
        body: `What is churn and why it matters.

**Churn Definition**

Churn: % of customers who cancel/don't renew in a given period.

Monthly churn:
- Calculation: (Customers lost last month / Customers start of month) × 100
- Example: Month start = 100 customers. Month end = 98 (2 cancelled). Churn = 2%

Annual churn:
- Same calculation but over 12 months
- Example: Start 100, end 85. Churn = 15%

Churn rate targets:
- Healthy SMB SaaS: 2-3% monthly (24-36% annual)
- Healthy enterprise SaaS: 0.5-1% monthly (6-12% annual)
- Bad: 5%+ monthly (accelerating decline)

**Impact on LTV (Customer Lifetime Value)**

Simple LTV formula:
LTV = ARPU / Churn rate

Where ARPU = Average Revenue Per User (monthly).

Example:
- ARPU: £100/month
- Churn 2%: LTV = £100 / 0.02 = £5,000
- Churn 4%: LTV = £100 / 0.04 = £2,500
- Churn 1%: LTV = £100 / 0.01 = £10,000

Insight: Double churn = half LTV.

Impact on company value:
- Company valued at LTV multiples (3-5x ARR for SaaS)
- £1M ARR × 4x = £4M valuation
- If churn increases 1%, LTV drops 50%, valuation drops significantly
- Conversely: Churn -1% = major valuation uplift

**Churn vs Retention**

Retention rate = 1 - Churn rate.

Example: 2% churn = 98% retention.

Why talk about churn, not retention?
- Churn is the problem (focus on fix)
- Retention is the solution (measure improvement)

Industry standard: Track churn (easier to benchmark against peers).

`
      },
      {
        heading: "Analyzing Churn by Cohort",
        body: `Understanding which customers are at risk.

**Cohort-Based Churn Analysis**

Cohort: Group of customers acquired in same month.

Example: January 2024 cohort

| Month | Customers | Cumulative Churn |
|-------|-----------|---|
| Jan (month 0) | 100 | 0% |
| Feb (month 1) | 98 | 2% |
| Mar (month 2) | 96 | 4% |
| Apr (month 3) | 94 | 6% |
| May (month 4) | 92 | 8% |

Insight: Stable 2% monthly churn (expected).

**Retention Curves by Cohort**

Compare multiple cohorts:

| Month | Jan Cohort | Feb Cohort | Mar Cohort | Apr Cohort |
|-------|---|---|---|---|
| Month 0 | 100% | 100% | 100% | 100% |
| Month 1 | 98% | 98% | 98% | 97% |
| Month 2 | 96% | 96% | 96% | 94% |
| Month 3 | 94% | 94% | 94% | 91% |

Insight: Apr cohort worse retention (97% vs 98% month 1). Why? Investigation needed:
- Onboarding change in April?
- Product issue in April?
- Market change (economy, competition)?

**Segmenting Churn**

Churn varies by segment (SMB vs Enterprise, use case, etc):

| Segment | Customers | Churn | LTV Impact |
|---------|-----------|-------|---|
| SMB | 300 | 3% | Higher churn, lower LTV |
| Mid-market | 150 | 2% | Moderate |
| Enterprise | 50 | 0.5% | Very sticky, high LTV |

Action: Reduce SMB churn (biggest impact).

**Early Churn vs Long-tail Churn**

Early churn (month 0-3): High-risk window
- Example: Jan cohort loses 10% in first 3 months (3.3% monthly)
- Root cause: Onboarding, product-market fit for segment

Long-tail churn (month 12+): Stable/declining
- Example: Jan cohort stable 2% monthly after month 3
- Indicates: Once customers get value, they stick

Focus: Reduce early churn (biggest impact on LTV).

`
      },
      {
        heading: "Root Cause Analysis of Churn",
        body: `Discovering why customers leave.

**Common Churn Reasons**

Survey churned customers:

| Reason | Percentage | Impact |
|--------|-----------|--------|
| Product doesn't meet needs | 30% | Product issue |
| Too expensive | 20% | Pricing issue |
| Switched to competitor | 25% | Competition |
| No longer need product | 15% | Market change |
| Poor support/service | 10% | CS issue |

**Root Cause Deep Dives**

Product doesn't meet needs (30%):
- Investigation: Feature gap? Bug? UX confusing?
- Data: Compare feature usage (churned vs retained)
- Action: Build missing feature, fix bug, improve UX

Too expensive (20%):
- Investigation: Pricing vs value? Price increase?
- Data: Compare price point (churned vs retained)
- Action: Adjust pricing, add lower-tier plan, improve value communication

Switched to competitor (25%):
- Investigation: Which competitor? What features better?
- Data: Lost deal analysis, sales feedback
- Action: Competitive feature development, sales messaging

**Predicting Churn**

Leading indicators of churn:

| Indicator | Risk Level |
|-----------|---|
| No login for 30 days | High |
| Feature usage declined 50% | High |
| Support tickets >3 unresolved | Medium |
| NPS score <0 | High |
| No expansions in 6 months | Medium |

Action: Identify at-risk customers, proactive outreach (CS check-in, incentive, etc).

Example: Customer no login for 30 days:
- Reach out: "We miss you! How can we help?"
- Offer: 20% discount for 3 months, free training, integration help
- Success rate: 40% re-engagement

`
      },
      {
        heading: "Retention Strategies and ROI",
        body: `Implementing programs that reduce churn.

**Retention Lever 1: Onboarding**

Impact: Reduces early churn (month 0-3).

Early churn = customers don't get to value quickly.

Solution: Structured onboarding
- Month 0: Welcome, initial setup, first win
- Week 1: Training, best practices
- Month 1: Check-in, measure value, identify issues
- Month 3: Review, ROI demonstration, next steps

ROI example:
- Cost: 10 hours onboarding specialist × £50/hour = £500 per customer
- Benefit: Reduce early churn 5% → 2% = 3% improvement
- On 500-customer base: 15 customers saved × £5,000 LTV = £75,000 impact
- ROI: 150x

**Retention Lever 2: Product Quality**

Impact: Reduces ongoing churn.

Bugs and issues = customers leave.

Solution: Prioritize bug fixes
- Track bug reports (high volume = problem)
- Tier bugs (critical = fix immediately)
- CS feedback loop (customers mention bugs → product fixes)

ROI example:
- Cost: Engineering time to fix bugs, £100K/year
- Benefit: Churn -1% on 500-customer base = £300K LTV improvement
- ROI: 3x

**Retention Lever 3: Customer Success**

Impact: Proactive retention.

Solution: CS programs
- Regular check-ins (quarterly for SMB, monthly for enterprise)
- Training sessions, webinars
- Expansion selling (customer has need, offer new feature/plan)
- NPS surveys, satisfaction tracking

ROI example:
- Cost: 1 CS specialist × £50K/year (for 100 customers)
- Benefit: Churn -1.5% = £150K LTV improvement
- ROI: 3x

**Retention Lever 4: Pricing and Packaging**

Impact: Reduces price-driven churn.

Solution: Flexible pricing
- Tiered plans (startup, growth, enterprise)
- Usage-based pricing (pay for value)
- Annual discounts (lock in retention)
- Transparent pricing (no surprises)

ROI example:
- Cost: Pricing review, tier restructure, £20K
- Benefit: Reduce price-driven churn 50% (10% → 5%) = significant impact
- ROI: High

**Retention Lever 5: Expansion (Upsell/Cross-sell)**

Impact: Higher NRR, lower effective churn.

Solution: Expansion program
- Identify expansion opportunities (new use case, power user)
- Offer new features, plans, add-ons
- Bundled pricing (loyalty discount for multi-product)

ROI example:
- Cost: Expansion team, tools, £100K/year
- Benefit: Increase NRR from 105% to 110% = 5% uplift
- On £1M ARR: +£50K ARR
- ROI: 50% benefit, good ROI

`
      }
    ],
    relatedSlugs: [
      "customer-success-metrics-and-program-design",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "financial-forecasting-modeling",
      "expansion-revenue-and-upsell-strategy"
    ],
    faq: [
      {
        q: "What is a healthy churn rate?",
        a: "SMB SaaS: 2-3% monthly (24-36% annual). Enterprise SaaS: 0.5-1% monthly (6-12% annual). Rule of thumb: Lower is better. Every 1% improvement = significant LTV increase. Target: Match or beat industry benchmark for your segment."
      },
      {
        q: "How does churn impact LTV?",
        a: "LTV = ARPU / Churn rate. Example: £100 ARPU with 2% churn = £5K LTV. If churn doubles to 4%, LTV halves to £2.5K. Small churn changes = big LTV impact. This is why retention is so valuable."
      },
      {
        q: "How do I analyze churn by cohort?",
        a: "Group customers by acquisition month. Track retention % for each cohort over time. Compare: Do newer cohorts have better/worse retention? This reveals if product changes, pricing changes, or onboarding improvements are working. Early cohorts with 95%+ 6-month retention = good product-market fit."
      },
      {
        q: "What's the ROI on retention programs?",
        a: "High. Example: CS program costs £50K/year, reduces churn -1% on 500-customer base = £300K+ LTV improvement = 6x+ ROI. Expansion selling: £100K cost → increase NRR 5% → £50K annual revenue = 50% return. Retention is one of highest ROI investments."
      }
    ],
    videoUrl: ""
  }
];

export default batch158Articles;
