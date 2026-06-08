import { AcademyArticle } from "@/types/academy";

export const batch207Articles: AcademyArticle[] = [
  {
    slug: "cohort-analysis-and-customer-lifecycle",
    title: "Cohort Analysis and Customer Lifecycle: Understanding Customer Behavior Patterns",
    description: "Master cohort analysis. Track customer behavior, identify patterns, optimize lifetime value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "cohort analysis",
      "customer lifecycle",
      "retention cohort",
      "monthly cohort",
      "customer behavior",
      "lifecycle metrics",
      "cohort retention",
      "acquisition cohort",
      "churn pattern",
      "customer journey"
    ],
    keyTakeaways: [
      "Cohort = customers acquired same month, tracked over time. Example: Jan 2024 cohort (100 customers), Month 1 (100 active), Month 2 (92 retained, 8% churn), Month 6 (75 retained, 25% total churn), Month 12 (60 retained, 40% total churn). Trend: If Jan cohort retains 60% after 12 months, Feb cohort (same product/pricing) likely also 60% (predictable). But if Jan retains 60%, Feb only retains 50% = something changed (product, onboarding, pricing). Analyze: What changed between cohorts? (Feature launch, price increase, support downgrade). Use: Understand retention by acquisition source, product iteration, market condition.",
      "Cohort retention curve: Month 1 drop-off (early churn, onboarding failure), Month 2-6 stable decline (normal churn), Month 6+ flatten (long-term customers, mature). Best predictor: Month 3 retention (if low <50%, predict 12-month retention <30%). Measure early: Day 7, Day 30, Month 3, Month 6, Month 12. Optimize: Improve month 1-3 (biggest impact), if save 10% churn month 3, compounds to 15-20% improvement month 12.",
      "Compare cohorts by acquisition source. Example: Organic cohort vs Paid ads cohort. Organic retains 65% by month 12, Paid only 40%. Insight: Organic customers are higher quality (self-selected, product-market fit strong). Action: Increase organic acquisition (referral, content marketing), reduce paid ads (bad ROI on churn). Or: Improve paid cohort onboarding (why worse retention?). Economics: If paid cohort LTV £10K but CAC £2K = £8K net value. If improve retention 40% → 50%, LTV £12.5K, net £10.5K (31% improvement)."
    ],
    content: [
      {
        heading: "Cohort Analysis Framework",
        body: `Understanding customer cohorts and retention.

**Defining cohorts**

Monthly cohort (most common):
- Cohort = all customers acquired in month
- Tracked: Month 1 (month of acquisition), Month 2 (1 month later), ..., Month 12+

Example (Jan 2024 cohort):
| Cohort Month | Month 1 | Month 2 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|---|
| Customers | 100 | 92 | 85 | 78 | 65 |
| % Retained | 100% | 92% | 85% | 78% | 65% |
| Churn | - | 8% | 7% | 7% | 13% (month 6-12) |

Other cohort types:
- By acquisition channel (organic, paid, referral)
- By product tier (basic, pro, enterprise)
- By geography (US, EU, Asia)
- By company size (SMB, mid-market, enterprise)

**Retention curve analysis**

Healthy curve (60% retained month 12):
- Month 1: 100% (new)
- Month 2: 94% (6% early churn, onboarding failures)
- Month 3: 90% (4% churn, settling in)
- Month 6: 80% (10% total churn, normal attrition)
- Month 12: 60% (40% total churn, some expansion/contraction)
- Pattern: Steep drop month 1-2, then stable decline

Unhealthy curve (30% retained month 12):
- Month 1: 100%
- Month 2: 85% (15% early churn, big problem)
- Month 3: 75% (10% churn, continuous loss)
- Month 6: 50% (25% total churn, severe)
- Month 12: 30% (70% total churn, unsustainable)
- Pattern: Steep throughout, not stabilizing

**Predictive power of early retention**

Month 3 retention predicts month 12:
- If month 3 = 90%: Predict month 12 ~70-75% (stable decline after month 3)
- If month 3 = 70%: Predict month 12 ~35-45% (continuing decline)
- Rule of thumb: Month 12 = Month 3 - 20-25 percentage points

Example predictions:
- Jan cohort month 3 = 85% → estimate month 12 = 60-65%
- Feb cohort month 3 = 80% → estimate month 12 = 55-60%
- If actual month 12 diverges from prediction, something changed (good or bad)

Optimization leverage:
- Improve month 1 churn 6% → 4% (save 20 customers from 100 cohort)
- Compounds: Month 12, if others save same rate, retain 82 instead of 65 (26% improvement!)
- Focus: Early months (biggest ROI on investment)

`
      },
      {
        heading: "Cohort Comparison and Analysis",
        body: `Comparing cohorts to identify trends.

**Comparison by acquisition source**

Example: Organic vs Paid ads

| Month | Organic | Paid | Difference |
|---|---|---|---|
| 1 | 100% | 100% | 0% |
| 2 | 96% | 85% | -11% |
| 3 | 92% | 72% | -20% |
| 6 | 82% | 55% | -27% |
| 12 | 65% | 35% | -30% |

Insight: Paid cohort has 30 percentage point worse retention
Implication: Paid customers (lower intent, price-sensitive) churn more

Action:
1. Analyze why (paid cohort characteristics, onboarding experience, product fit)
2. Improve paid cohort (better targeting, improved onboarding, pricing test)
3. Shift strategy (increase organic, reduce paid ads)

Example economics:
- Organic: CAC £500, LTV £50K, payback 12 months
- Paid: CAC £2K, LTV £17.5K (35% retention), payback 14 months
- Organic much better (higher LTV despite similar CAC)

**Comparison by product tier**

| Month | Basic | Pro | Enterprise |
|---|---|---|---|
| 1 | 100% | 100% | 100% |
| 2 | 88% | 94% | 97% |
| 3 | 80% | 90% | 95% |
| 6 | 70% | 85% | 92% |
| 12 | 50% | 75% | 88% |

Insight: Enterprise much stickier (88% vs 50% for basic)
Drivers:
- Higher switching cost (more integrated)
- More value (higher tier features used more)
- Bigger company (less churning)

Implication: Invest in enterprise (higher LTV, lower churn, higher margin)

**Comparison by geography**

| Month | US | EU | Asia |
|---|---|---|---|
| 1 | 100% | 100% | 100% |
| 2 | 92% | 90% | 85% |
| 3 | 88% | 85% | 78% |
| 6 | 78% | 75% | 65% |
| 12 | 60% | 55% | 40% |

Insight: Asia cohort has lower retention (40% vs 60% US)
Causes: Might be price sensitivity, product-market fit issue, local competition
Action: Analyze further (customer interviews), decide to invest or de-prioritize

`
      },
      {
        heading: "Optimization and Predictive Value",
        body: `Using cohort analysis to improve business.

**Identifying optimization opportunities**

Early churn (month 1-2):
- Problem: Customers churning in first 2 months = onboarding issue
- Data: Compare month 1-2 churn across cohorts. If Jan = 6%, Feb = 10%, something changed
- Action: What changed Feb? Onboarding process, product, pricing, positioning?
- Improvement: If reduce month 1-2 churn 6% → 3%, save 3 per 100 customers = compounds to 5-10 extra retained by month 12

Mid-stage churn (month 3-6):
- Problem: Customers leaving after initial settle-in = feature gap or value realization issue
- Data: If month 3 → month 6 churn accelerates (85% → 70%, vs normal ~85% → 80%)
- Action: Customer interviews (why leaving?), feature adoption analysis (are they using product?)
- Improvement: If stabilize month 3-6 churn, retain more customers long-term

Long-term stability (month 6+):
- Problem: If cohort still declining steeply after month 6 (65% → 50%), churn not stabilizing
- Action: Check if lost customers expanding elsewhere (added competitor), need new retention feature
- Improvement: Target <2% monthly churn after month 6 (should stabilize)

**Predictive models**

Lifetime value prediction:
- Use month 3 retention as input
- Predict month 12, month 24, lifetime
- Example: Month 3 = 85% → Predict month 12 = 60-65%
- Then calculate: LTV = ARPU × Avg customer lifetime (months)
- If ARPU £100/month, avg lifetime 60 months = LTV £6K

Churn prediction:
- Identify customers at risk (low usage, NPS declining)
- Compare to early churn pattern (if Jan cohort loses 6% month 1, look for new customers with same pattern)
- Alert CS (proactive retention)
- Measure: If predict churn, intervene, measure save rate

Cohort growth impact:
- If improve month 3 retention 5% annually
- Year 1: No impact (mid-way through year)
- Year 2: Accumulate 5% improvement per 12 cohorts = ~5% overall retention improvement
- Year 2 churn 2% → 1.9% (small but compounds)

`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "customer-success-metrics-and-program-design",
      "expansion-revenue-and-upsell-strategy"
    ],
    faq: [
      {
        q: "What's a cohort and why should I analyze it?",
        a: "Cohort = customers acquired same month. Track retention: Jan cohort 100% month 1, 92% month 2, 85% month 12. Use to: Understand retention pattern, compare acquisition sources (organic vs paid), identify product/onboarding issues. Example: Organic retains 65%, paid only 40% = paid cohort has problem (targeting, onboarding, product fit). Optimize: Focus on month 1-3 (biggest ROI), improve 10% = 20%+ lifetime improvement."
      },
      {
        q: "How do I predict churn from early retention?",
        a: "Month 3 retention predicts month 12: If 85% retained month 3, expect ~60-65% month 12 (stable decline after month 3). If month 3 only 70%, expect ~45-50% month 12 (worse). Use to set expectations, identify cohorts that underperform. Example: Feb cohort month 3 = 75% (vs Jan 85%), something changed = investigate."
      },
      {
        q: "Should I analyze different cohorts separately?",
        a: "Yes: By acquisition channel (organic vs paid, different retention), by tier (enterprise stickier), by geography (some regions better). Example: Organic 65% retention, paid 40% = organic much better. Implication: Invest more in organic, improve paid onboarding, or de-prioritize paid. Compare cohorts to spot trends and optimize."
      },
      {
        q: "How do I improve cohort retention?",
        a: "Focus month 1-3 (biggest impact): Improve onboarding (reduce 6% → 3% early churn). Check month 3-6 (feature gap?): Customer interviews, usage analysis. Long-term (month 6+): <2% monthly churn target (should stabilize). Example: 100 customers, improve month 3 retention 5% = 5 extra customers, compounds to 10-15 extra by month 12."
      }
    ],
    videoUrl: ""
  }
];

export default batch207Articles;
