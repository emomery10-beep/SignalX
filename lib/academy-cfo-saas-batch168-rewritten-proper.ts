import { AcademyArticle } from "@/types/academy";

export const batch168Articles: AcademyArticle[] = [
  {
    slug: "cohort-analysis-and-customer-segmentation",
    title: "Cohort Analysis and Customer Segmentation: Understanding Your Customer Base",
    description: "Master cohort analysis. Segment customers by acquisition date or characteristic, analyze behavior, and optimize by segment.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "cohort analysis",
      "customer segmentation",
      "retention curves",
      "cohort retention",
      "customer behavior",
      "customer tracking",
      "acquisition cohorts",
      "segment analysis",
      "customer lifecycle",
      "customer groups"
    ],
    keyTakeaways: [
      "Cohort analysis: Group customers by acquisition month, track behavior over time. Example: Jan 2024 cohort (100 customers) → Feb 98 (2% churn) → Jun 94 (6% cumulative churn). Compare cohorts: If Jan cohort 90% after 6 months, Feb 85%, Mar 75% = retention declining (product getting worse?). Actionable: Investigate what changed in March (new feature bug? pricing change?). Spot trends in product quality.",
      "Retention curves: Plot retention % by customer age (months). Example: Most cohorts drop steeply month 1-2 (expected onboarding drop), then flatten. If flattens at 60% = good cohort retention. If continues declining = churn problem. Compare curves across cohorts (Jan cohort flat at 60%, Mar cohort flat at 40%) = March onboarding worse. Fix it (improves future cohort quality).",
      "Segmentation levers: By acquisition channel (organic vs paid vs sales → different retention), by customer size (SMB vs enterprise → different LTV), by use case (power users vs casual → different value), by geography (US vs EU → different churn). Example: Organic cohort 70% retention vs paid ads cohort 50% retention = quality difference. Action: Double down on organic channel (better retention) or improve ads targeting (worse cohort)."
    ],
    content: [
      {
        heading: "Understanding Cohort Analysis",
        body: `Grouping and tracking customers over time.

**Cohort Definition**

Cohort: Group of customers acquired in same time period (usually month).

Example:

January 2024 cohort:
- First customer acquired: Jan 1
- Last customer acquired: Jan 31
- Total customers: 50

February 2024 cohort:
- First customer acquired: Feb 1
- Last customer acquired: Feb 29
- Total customers: 55

**Retention Cohort Table**

Track each cohort's retention % over time.

| Cohort | Cohort Size | Month 0 | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|-------------|--------|---------|---------|---------|----------|
| Jan | 50 | 100% | 98% | 94% | 90% | 80% |
| Feb | 55 | 100% | 97% | 91% | 85% | 75% |
| Mar | 48 | 100% | 95% | 88% | 80% | 68% |
| Apr | 52 | 100% | 93% | 82% | 72% | 55% |

Interpretation:
- Jan cohort strongest (80% after 12 months)
- Apr cohort weakest (55% after 12 months)
- Trend: Declining retention over time (products getting worse?)

**Why Cohort Analysis Matters**

Aggregate data hides trends:
- Total retention: 70% (looks okay)
- But cohorts: Jan 80%, Apr 55% (shows decline)

Aggregate view misses:
- Onboarding improvements (didn't help Apr cohort)
- Product regression (Apr cohort worse)
- Acquisition quality changes (paid ads bringing worse customers)

Cohort view reveals:
- When problems started (April)
- Root cause (acquisition, product, or both)
- Trends (improving or declining)

**Cohort Patterns**

Expected pattern:
- Month 0: 100% (all customers)
- Month 1: 80-90% (onboarding drop, normal)
- Month 3: 70-80% (early churn)
- Month 6: 60-70% (stabilizing)
- Month 12: 50-70% (mature)

Red flags:
- Month 1 churn >15% (bad onboarding)
- Month 1-6 steep decline (fundamental issues)
- Month 6+ continued decline (customers still leaving, not getting value)

Good signs:
- Steep drop month 0-1 (expected onboarding)
- Then flattens and stable (customers stick)
- Month 12 retention 60%+ (strong)

`
      },
      {
        heading: "Retention Curves and Patterns",
        body: `Visualizing cohort retention over time.

**The S-Curve of Retention**

Most healthy cohorts follow S-curve pattern:

\`\`\`
100% |●
     |  ●
 80% |    ●●
     |       ●●
 60% |          ●●
     |             ●●●
 40% |                 ●●●●●
     |______________________
     0   3   6   9  12  15  18
        Months
\`\`\`

Pattern:
- Steep drop month 0-3 (onboarding, early issues)
- Curve flattens month 3+ (stable cohort)
- Flattens out at ~50-70% (mature retention)

Interpretation: Customers who survive month 3 tend to stick.

**Unhealthy Pattern 1: Continued Decline**

\`\`\`
100% |●
     |  ●
 80% |    ●
     |     ●
 60% |      ●
     |       ●
 40% |        ●
     |         ●
     |__________
     0  3  6  9 12
        Months
\`\`\`

Indicates: Fundamental issue
- Product not delivering value
- Customers eventually leave
- Even long-term customers churning

Action: Fix product issues (not acquisition).

**Unhealthy Pattern 2: Steep Initial Drop**

\`\`\`
100% |●
     |  ●
 60% | ●
     |   ●●●●●
 40% |       ●●●
     |
 20% |
     |__________
     0  3  6  9 12
        Months
\`\`\`

Indicates: Onboarding issues
- Customers struggle to get value
- High early churn (month 0-1)
- Those who survive stay (if they get past onboarding)

Action: Fix onboarding (reduce month 1 drop).

**Comparing Cohorts**

Strong cohort (Jan):
\`\`\`
100% |●
     |  ●●
 80% |     ●●●
     |         ●●●●
     |_____________
     0  3  6  9 12
\`\`\`

Weak cohort (Apr):
\`\`\`
100% |●
     | ●
 60% |●
     |  ●●
 40% |    ●●●●
     |_____________
     0  3  6  9 12
\`\`\`

Difference: Jan cohort retains 80% at month 6, Apr only 60% (major gap).

Questions:
- What changed between Jan and Apr?
- Onboarding? (Jan onboarding better)
- Product? (Jan acquired before bug? Apr after?)
- Acquisition? (Jan higher quality customers?)

Action: Identify and fix the difference.

`
      },
      {
        heading: "Segmentation and Analysis",
        body: `Breaking down cohorts by customer characteristics.

**Segmentation Dimensions**

Segment by acquisition channel:

| Channel | Cohort Size | Month 6 Retention | Quality |
|---------|-------------|---|---|
| Organic | 20 | 80% | High |
| Paid ads | 30 | 50% | Lower |
| Sales | 5 | 70% | Medium |

Insight: Organic customers most valuable (best retention).

Action: Double down on organic (content, referrals, partnerships).

Segment by customer size:

| Segment | Cohort Size | Month 6 Retention | LTV |
|---------|-------------|---|---|
| SMB (<5 people) | 30 | 60% | £2K |
| Mid-market (5-50) | 15 | 75% | £8K |
| Enterprise (50+) | 5 | 90% | £30K |

Insight: Enterprise most sticky (quality accounts). SMB high churn.

Action: Focus sales on mid-market and enterprise (better economics).

Segment by use case:

| Use case | Cohort Size | Month 6 Retention |
|----------|-------------|---|
| Core use case (primary) | 35 | 75% |
| Secondary use case | 12 | 50% |
| Peripheral use case | 3 | 25% |

Insight: Primary use case customers stick, peripheral leave.

Action: Better onboarding for primary use case (lock in early). De-prioritize peripheral.

**Cohort Economics**

Calculate LTV/CAC by cohort:

| Cohort | CAC | 6-Month Retention | LTV | LTV/CAC |
|--------|-----|---|-----|-------|
| Jan (organic) | £1K | 80% | £8K | 8x |
| Feb (organic) | £1K | 78% | £7.8K | 7.8x |
| Mar (paid ads) | £3K | 60% | £6K | 2x |
| Apr (paid ads) | £3K | 55% | £5.5K | 1.8x |

Insight:
- Organic cohorts: Excellent economics (8x)
- Paid ads cohorts: Poor economics (2x)

Decision: Stop paid ads (unprofitable), invest in organic.

**Identifying Cohort Issues**

Problem 1: One bad cohort
- April cohort 55% retention vs Jan 80%
- What happened in April?
  - New product launch? (might have broken something)
  - Price increase? (lost price-sensitive customers)
  - Sales team change? (different ICP?)
  - Competitive pressure? (lost deals)
- Fix: Investigate root cause, adjust April acquisition if possible

Problem 2: Declining trend
- Jan 80%, Feb 78%, Mar 76%, Apr 55% (all declining)
- Indicates: Systematic degradation
- Causes: Product getting worse, onboarding declining, market change
- Fix: Deep investigation, product/onboarding improvement

Problem 3: Segment-specific issue
- Organic cohorts fine (75% retention)
- Paid ads cohorts bad (50% retention)
- Indicates: Acquisition channel bringing wrong customers
- Fix: Improve targeting, pause paid ads, focus on organic

`
      },
      {
        heading: "Using Cohort Analysis for Decisions",
        body: `Taking action based on cohort insights.

**Onboarding Optimization**

Data: Jan cohort 95% month-1 retention, Apr cohort 80%

Question: Why 15% difference?

Hypothesis: Onboarding changed between Jan and Apr

Investigation:
- Jan onboarding: 1-hour call, in-app walkthrough, check-in day 2
- Apr onboarding: Email template, self-serve docs

Test:
- Run Jan-style onboarding with May cohort
- Measure month-1 retention

Result: May cohort 92% (matches Jan, validates hypothesis)

Action: Revert to Jan-style onboarding, improve hiring calls

**Acquisition Channel Shift**

Data:
- Organic cohorts: 75% retention, 8x LTV/CAC
- Paid ads cohorts: 50% retention, 2x LTV/CAC

Decision: Shift budget from paid to organic

Implementation:
- Pause paid ads (unprofitable)
- Double down on content marketing (lower CAC, higher retention)
- Hire partnerships manager (more organic channels)

Expected impact:
- Slower growth month 1-2 (less paid volume)
- Better quality customers month 2+ (organic ramp)
- Better retention overall (fewer low-quality paid customers)

**Pricing Tier Optimization**

Segment cohorts by pricing tier:

| Tier | Cohort Size | Month 6 Retention |
|------|-------------|---|
| Starter (£50/mo) | 25 | 50% |
| Pro (£200/mo) | 15 | 75% |
| Enterprise (£2K+/mo) | 5 | 90% |

Insight: Higher tier = better retention (more committed customers).

Decision: Focus sales on Pro and Enterprise (better economics).

Action:
- Improve Starter onboarding (it's weak)
- Or: Increase Starter price to £100 (upsell to Pro instead)
- Or: Discontinue Starter (focus on Pro/Enterprise)

**Predicting Churn by Cohort**

Use cohort patterns to predict future churn:

Jan cohort: 80% at month 6, 70% at month 12
- Monthly churn: 2% in months 6-12 (stable)

Apr cohort: 55% at month 6
- If follows Jan pattern: Will churn 2% in months 6-12
- Projected 12-month: 55% × 0.88 = 48%
- vs Jan's 70% (22 point gap)

Action: Analyze Apr cohort churn drivers, fix before month 12.

`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "growth-accounting-and-advanced-unit-economics",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What is a cohort?",
        a: "Group of customers acquired in same time period (usually monthly). Example: January 2024 cohort = all customers who signed up Jan 1-31. Track cohort retention over time (Jan cohort 100% month 0, 98% month 1, 94% month 3). Compare cohorts to spot product improvements or degradation."
      },
      {
        q: "Why is cohort analysis important?",
        a: "Reveals trends hidden by aggregate data. Aggregate retention 70% looks okay, but cohorts show: Jan 80%, Apr 55% (declining). Identifies exactly when problems started (April) and helps diagnose cause (acquisition channel, product issue, onboarding)."
      },
      {
        q: "What does a healthy retention curve look like?",
        a: "Steep drop month 0-1 (normal onboarding attrition), then flattens month 1+ (stable customers). Month 6 retention 60%+ is healthy. Red flag: Continued decline month 6+ (product issues). Or steep month 1 drop >20% (onboarding problems)."
      },
      {
        q: "How do I segment my cohorts?",
        a: "By acquisition channel (organic vs paid), by customer size (SMB vs enterprise), by use case (primary vs secondary), by geography. Compare retention/LTV across segments to identify best customers. Example: Organic 75% retention vs paid ads 50% → focus on organic acquisition."
      }
    ],
    videoUrl: ""
  }
];

export default batch168Articles;
