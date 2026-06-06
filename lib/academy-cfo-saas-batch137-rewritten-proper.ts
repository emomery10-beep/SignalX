import { AcademyArticle } from "@/types/academy";

export const batch137Articles: AcademyArticle[] = [
  {
    slug: "cohort-analysis-and-customer-segmentation",
    title: "Cohort Analysis and Customer Segmentation: Understanding Your Customers Beyond Aggregate Metrics",
    description: "Master cohort analysis. Track customer behavior by acquisition date, segment by characteristics, and optimize retention and lifetime value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "cohort analysis",
      "customer segmentation",
      "cohort retention",
      "behavioral cohorts",
      "acquisition cohorts",
      "retention curves",
      "customer lifetime",
      "segment analysis",
      "cohort tracking",
      "customer groups"
    ],
    keyTakeaways: [
      "Cohort analysis: Group customers by acquisition date (or other characteristic), track their behavior over time. Example: January 2025 cohort: Month 1 = 100% retention, Month 2 = 95%, Month 3 = 88%, Month 6 = 72%. Shows true retention curve (not masked by new customer growth). Reveals cohort quality: newer cohorts better (88% vs 72%) = improving retention.",
      "Segmentation dimensions: By acquisition channel (direct vs partner vs paid ad), by company size (SMB vs mid-market vs enterprise), by product tier (free vs pro vs enterprise), by geography, by industry. Track each segment: CAC, payback, NRR, churn. Example: Enterprise CAC £20K, payback 1.2mo, NRR 115%. SMB CAC £2K, payback 0.4mo, NRR 95%. Enterprise more valuable (higher NRR), SMB faster payback.",
      "Improving cohort quality: Better onboarding = higher M1 retention (Month 1 survival 92% vs 85%), faster time-to-value. Better CS = lower churn (6mo retention 75% vs 65%). Track M1, M3, M6, M12 benchmarks per cohort. Set targets: M1 >90%, M3 >80%, M6 >70%, M12 >50%. Improvements in earlier cohorts cascade to LTV (better M1 = better lifetime)."
    ],
    content: [
      {
        heading: "Understanding Cohort Analysis",
        body: `Cohort analysis groups customers by a common characteristic and tracks their behavior over time.

**What is a Cohort?**

A cohort is a group of customers who share a common experience during a defined time period.

Most common: Acquisition cohort (by sign-up month/quarter)

Example:

January 2025 cohort: All customers who signed up in January 2025 (100 customers)
Track over 12 months:
- Month 1 (Feb 2025): 95 still active (95% retention)
- Month 2 (Mar 2025): 90 still active (90% retention)
- Month 3 (Apr 2025): 85 still active (85% retention)
- Month 6 (Jul 2025): 75 still active (75% retention)
- Month 12 (Jan 2026): 60 still active (60% retention)

This shows the "survival curve" — how many customers stay over time.

**Why Cohort Analysis?**

Aggregate metrics mask issues:

Example (aggregate view):
- MRR: £100K (Month 1) → £105K (Month 2) → £110K (Month 3)
- Looks like retention improving!

Cohort view (same data):
- Jan cohort: £10K → £8K → £6K (40% churn!)
- Feb cohort: £5K → £5.5K → £6K (stable)
- Mar cohort: £85K → £91.5K (new customer growth masking churn)

Cohort reveals the truth: Jan cohort is churning hard. New customer acquisition masks the problem. Company appears healthy aggregate, but retention is failing.

**Cohort Table Example**

Track retention month-by-month:

| Cohort | M0 (Active) | M1 (Retained) | M2 | M3 | M6 | M12 |
|--------|-------------|---------------|----|----|----|----|
| Jan 2025 | 100 | 95 | 90 | 85 | 75 | 60 |
| Feb 2025 | 120 | 114 | 108 | 105 | 95 | 78 |
| Mar 2025 | 150 | 150 | 150 | 147 | 140 | — |
| Apr 2025 | 180 | 175 | — | — | — | — |

Read horizontally: Cohort over time (age of customer)
Read vertically: Across cohorts (improving quality?)

Trends:
- Jan cohort: 60% retention by month 12
- Feb cohort: 65% retention by month 12 (improving)
- Mar cohort: 93% retention by month 3 (much better onboarding or product)
- Apr cohort: Early stage, tracking well

This suggests product improvements or onboarding changes happening between Jan and Mar.

**Retention Curves**

Plot retention % over months:

Jan cohort: 100% → 95% → 90% → 85% → 75% → 60% (declining curve)
Feb cohort: 100% → 95% → 90% → 87.5% → 79% → 65% (similar pattern, slightly better)
Mar cohort: 100% → 100% → 98% → 93% (steeper drop later)

Healthy curve: Steep initial drop (first 3 months), then flattening
- M1 retention 85-90% (inevitable early churn)
- M3 retention 75-85% (settled customers)
- M6 retention 60-75% (long-term customers)
- M12 retention 50-65% (very committed)

Bad curve: Continuous linear decline (suggests persistent problems)
- M1 retention 95% (good)
- M3 retention 80% (expected)
- M6 retention 40% (too much churn, every month people leave)
- M12 retention 10% (disaster)
`
      },
      {
        heading: "Customer Segmentation Strategy",
        body: `Segment customers to understand differences in behavior and value.

**Segmentation Dimensions**

Acquisition channel:
- Organic (direct/SEO): Usually best retention, most engaged
- Paid ads (Google/Facebook): Decent retention, cost-sensitive
- Partnerships: Variable, depends on partner quality
- Enterprise sales (sales team): High value, long sales cycle, high retention
- Free trial: Lowest retention (unqualified leads)

Example:

| Channel | CAC | M3 Retention | NRR | LTV |
|---------|-----|--------------|-----|-----|
| Organic | £500 | 88% | 105% | £45K |
| Paid ads | £2K | 80% | 98% | £28K |
| Partners | £1.5K | 75% | 95% | £18K |
| Enterprise sales | £15K | 95% | 120% | £200K |
| Free trial | £0 | 50% | 80% | £3K |

Insights:
- Organic: Most efficient (high LTV/CAC ratio)
- Enterprise sales: High CAC but massive LTV (80x payback)
- Free trial: Lowest retention, lowest value

Company strategy: Double down on organic and enterprise sales. Free trial: either improve product fit or stop offering.

**Company Size Segmentation**

Segment by annual revenue or headcount:

SMB (< £2M revenue):
- CAC: £2K
- Churn: 5% monthly
- NRR: 95% (low expansion)
- LTV: £20K
- Payback: 0.5 months (very fast)
- Margin: High (simple product, low support)

Mid-market (£2M-50M revenue):
- CAC: £8K
- Churn: 2.5% monthly
- NRR: 105% (moderate expansion)
- LTV: £100K
- Payback: 2 months
- Margin: Medium (custom implementation needed)

Enterprise (>£50M revenue):
- CAC: £30K
- Churn: 1% monthly
- NRR: 120% (high expansion, upsells)
- LTV: £500K
- Payback: 6 months
- Margin: Low (heavy CS support, discounts)

Strategy implications:
- SMB: Maximize volume, automate everything
- Mid-market: Balance growth and margin
- Enterprise: High-touch sales, dedicated CS, less price-sensitive

**Behavioral Segmentation**

Segment by product usage:

Power users (using >80% of features):
- Churn: 1% monthly (sticky)
- NRR: 125% (high expansion)
- LTV: 3x average

Light users (using <20% of features):
- Churn: 8% monthly (at risk)
- NRR: 80% (shrinking)
- LTV: 1/3 average

Strategy: Improve onboarding to convert light users to power users (increases LTV 9x).

**Geographic Segmentation**

Segment by region:

US:
- CAC: £2K (competitive market, low conversion)
- Churn: 4% monthly
- LTV: £30K

UK:
- CAC: £1.5K (less competitive, better conversion)
- Churn: 2.5% monthly
- LTV: £40K

EU:
- CAC: £3K (harder to reach, language barriers)
- Churn: 3% monthly
- LTV: £25K

Insights: UK most efficient. US volume opportunity. EU niche play.

**Prioritizing Segments**

Focus on segments that are:
1. Large (enough customers to matter)
2. Profitable (good unit economics)
3. Growing (demand increasing)

Example priority:
- Enterprise segment: Small volume, massive LTV (worth 10x SMB). Invest heavily.
- Mid-market: Growing fast, good economics. Scale up.
- SMB: Mature, competitive, lower margin. Maintain, don't grow.
`
      },
      {
        heading: "Using Cohort Data to Improve Retention",
        body: `Cohort analysis reveals where retention problems exist and what to improve.

**Identifying Retention Problems**

Cohort view shows problems hidden in aggregate:

Scenario 1: M1 churn problem
- Jan cohort: 100 → 75 (25% churn in month 1!)
- Feb cohort: 100 → 75
- Mar cohort: 100 → 75
- Root cause: Onboarding, time-to-value, bad product fit

Solution: Improve onboarding. Target: Get M1 retention to 90%+.

Scenario 2: M3 cliff
- Jan cohort: 100 → 95 → 85 → 60 (big drop month 2-3)
- Feb cohort: 100 → 95 → 85 → 60
- Mar cohort: 100 → 95 → 85 → 60
- Root cause: Trial ending, value not proven, usage plateaus

Solution: Engagement campaigns, feature updates, CS outreach. Target: Get M3 retention >80%.

Scenario 3: Improving cohorts
- Jan cohort: 100 → 80 → 65 → 55
- Feb cohort: 100 → 85 → 75 → 65
- Mar cohort: 100 → 90 → 85 → 80
- Root cause: Improving (onboarding improved? Product got better?)

Action: Scale what's working. Invest more in acquisition (payoff is improving).

**Cohort-Specific Strategies**

Older cohorts (Jan, Feb) have low retention. New cohorts (Mar, Apr) higher. Investigate changes:

- Product changes: Any feature launches in Feb that improved onboarding?
- Support changes: Improved CS program?
- Sales/marketing changes: Different customer segment being attracted?

Once you identify the change, replicate it:

- If product: Rollout to all customers
- If support: Expand CS team, apply to all cohorts
- If marketing: Double down on that channel

**Cohort Economics**

LTV of each cohort:

| Cohort | M3 Retention | M6 Retention | M12 Retention | Implied LTV |
|--------|--------------|--------------|---------------|------------|
| Jan 2025 | 85% | 75% | 60% | £36K |
| Feb 2025 | 88% | 80% | 70% | £42K |
| Mar 2025 | 92% | 88% | 80% | £48K |

Trend: Newer cohorts worth 33% more (£36K to £48K).

This is huge. If you can replicate Mar cohort quality:
- Double customer value
- Can pay 2x CAC and maintain same payback
- Can reinvest in growth 2x faster

**Action Items from Cohort Analysis**

1. Build cohort table (track monthly)
2. Identify where retention drops (M1? M3? M6?)
3. Find root cause (product, support, fit, marketing quality)
4. Fix root cause
5. Measure impact on next cohort
6. Repeat

Example timeline:

Month 1-2: Analyze cohorts, find M1 retention 75% (vs target 85%)
Month 3: Improve onboarding (hypothesis: better time-to-value)
Month 4-5: Measure May/June cohort (did M1 retention improve?)
Result: May cohort M1 retention 88% ✓
Payoff: 13% improvement × LTV = 13% revenue improvement

Repeat this cycle quarterly.
`
      },
      {
        heading: "Cohort Metrics to Track",
        body: `Key metrics to measure cohort health and guide improvement.

**Retention Metrics**

M1 Retention (Month 1): % of customers still active 30 days after signup
- Healthy: 85-95%
- Poor: <80%
- Excellent: >95%
- Benchmark depends on product type (self-serve products typically lower, enterprise higher)

M3 Retention: % still active at 90 days
- Healthy: 75-85%
- Poor: <70%
- Excellent: >90%

M6 Retention: % still active at 180 days
- Healthy: 60-75%
- Poor: <50%
- Excellent: >80%

M12 Retention: % still active at 1 year
- Healthy: 50-65%
- Poor: <40%
- Excellent: >75%

**Churn Curve**

Plot retention over time:

Healthy: Steep initial decline (0-3 months), then flattens
- M1: 90%, M2: 85%, M3: 80%, M6: 70%, M12: 60%
- Shape: Steep drop then plateau

Poor: Continuous decline
- M1: 95%, M2: 80%, M3: 65%, M6: 40%, M12: 15%
- Shape: Linear decline (suggests ongoing issues)

**Cohort Age Analysis**

Track customers by age:

| Cohort | Customers | Revenue per Customer | Churn Rate | NRR |
|--------|-----------|---------------------|-----------|-----|
| 0-3mo (new) | 500 | £1K | 5% monthly | 90% |
| 3-6mo | 300 | £1.2K | 3% monthly | 105% |
| 6-12mo | 150 | £1.4K | 1.5% monthly | 115% |
| 12mo+ (mature) | 100 | £1.5K | 1% monthly | 120% |

Insights:
- Older customers worth more (higher ARPU due to expansion)
- Older customers more loyal (lower churn)
- Older customers expand more (higher NRR)
- New cohorts have most growth opportunity (500 customers) but highest risk (5% churn)

**Segment Comparison**

Compare retention across segments:

| Segment | M1 Retention | M6 Retention | M12 Retention | Trend |
|---------|--------------|--------------|---------------|-------|
| Enterprise | 98% | 95% | 90% | Stable, high |
| Mid-market | 90% | 80% | 70% | Declining |
| SMB | 78% | 60% | 40% | Declining fast |
| Free trial | 50% | 20% | 5% | Collapsing |

Strategy:
- Enterprise: Already high, maintain quality
- Mid-market: Improve CS, target M1 retention to 95%
- SMB: Automate/self-serve, reduce support costs (not viable at current churn)
- Free trial: Improve conversion, reduce trial length

**Cohort Dashboard**

Track cohort health monthly:

Cohort: January 2025 (100 customers at signup)
- M1: 95 (95%)
- M2: 90 (90%)
- M3: 85 (85%)
- M4: 82 (82%)
- M5: 80 (80%)
- M6: 78 (78%)
- Current: 78 customers remaining

Current MRR (M6): £1.5K/customer × 78 = £117K revenue from this cohort

Projected LTV: If M6-M12 churn follows pattern, expect ~70 customers remain at M12 = £105K additional revenue. Total LTV: ~£140K per £2K CAC = 70x payback.

Build this dashboard for all cohorts. Set targets for each milestone. Track progress monthly. Adjust retention strategies based on cohort performance.
`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "growth-accounting-and-advanced-unit-economics",
      "customer-lifetime-value-calculation",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What's the difference between cohort analysis and aggregate metrics?",
        a: "Aggregate metrics (MRR, growth %) hide churn with new customer growth. Example: MRR £100K to £105K looks good, but older cohorts churning 40% (new customers mask problem). Cohort analysis reveals the truth: track each cohort separately over time. Shows actual retention rates and quality of each customer group."
      },
      {
        q: "What should my target retention rates be?",
        a: "Depends on product type. SaaS: M1 85-95%, M3 75-85%, M6 60-75%, M12 50-65%. Enterprise: Higher (>90% M1). SMB: Lower (70-80% M1). Free trial: Much lower (40-50% M1). Track your baseline, then set improvement targets. Each 5% M1 retention improvement = 5%+ LTV improvement."
      },
      {
        q: "How do I use cohort analysis to improve retention?",
        a: "Compare cohorts: Identify where retention drops (M1? M3?). Find root cause (onboarding? Product fit? Support?). Implement fix. Measure next cohort. Example: M1 retention dropped, improved onboarding in May, June cohort M1 retention improved 10% = success. Repeat quarterly."
      },
      {
        q: "Which customer segment should I focus on?",
        a: "Prioritize by: (1) Size (enough customers to matter), (2) Profitability (good unit economics), (3) Growth (expanding). Example: Enterprise segment small volume but 10x LTV = focus there. SMB large volume but low margin = maintain. Mid-market: balance. Segment your data, compare cohorts by segment, optimize highest-value segments first."
      }
    ],
    videoUrl: ""
  }
];

export default batch137Articles;
