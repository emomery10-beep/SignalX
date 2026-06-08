import { AcademyArticle } from "@/types/academy";

export const batch236Articles: AcademyArticle[] = [
  {
    slug: "cohort-analysis-and-customer-lifecycle",
    title: "Cohort Analysis and Customer Lifecycle: Understanding Customer Behavior",
    description: "Master cohort analysis. Track customer groups, measure lifecycle, optimize by cohort.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cohort analysis", "cohort retention", "customer lifecycle", "lifecycle analysis", "retention curves", "cohort cohesion", "customer behavior"],
    keyTakeaways: [
      "Cohort fundamentals: Cohort = group of customers who signed up in same time period (month, quarter). Track cohort retention (% still active month 1, 2, 3, etc.). Reveals: If product quality improving (newer cohorts retain better), if marketing quality changing (older cohorts may have churned due to poor fit). Example: Cohort Q1 (50 customers) → 45 month 1 (90% retention), 38 month 3 (76%), 25 month 12 (50% annual). Cohort Q2 (80 customers) → 76 month 1 (95%), 70 month 3 (87%), target month 12 = 60-80. Comparison: Q2 cohort better (higher retention curve) = product improvement, marketing quality, or both.",
      "Retention curve analysis: Plot: Months on X, retention % on Y (separate line per cohort). Patterns: Flat (stable churn), declining (increasing churn), improving (product fixes/onboarding working). Inflection points: Identify where churn happens (month 3 = common, often onboarding ends). Early churn (month 1-2): Onboarding/product issue. Late churn (month 6+): Value realization or external (budget cuts). Cost: 4 weeks dev to build cohort analysis, free data warehouse tools (Metabase, Amplitude). Benefit: Diagnostics (pinpoint when customers leave, why) → drives improvements.",
      "Cohort-based improvements: Identify improvements (Q2 cohort 5% higher retention than Q1). Root cause analysis: What changed? (New onboarding, product feature, marketing channel). A/B test: Run improvement on subset, measure impact. Rollout: If validated, apply to all new customers. Track: Next 3 cohorts, confirm improvement sustained. Example: Change onboarding (month 3 retention Q1 76% → Q2 82%) = 6% improvement = 0.06 × LTV = significant value impact. Cadence: Quarterly analysis (new cohort data complete, 3-month trends clear). Build culture: Discuss quarterly (product, marketing, CS teams) = aligned on improvements."
    ],
    content: [
      {
        heading: "Cohort Analysis Framework",
        body: `Understanding customer behavior through cohorts.

**Cohort definition and retention tracking**

Cohort = customers grouped by signup month/quarter

Example cohort table (retention %):
| Cohort | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| Q1 2024 | 95% | 75% | 50% | 30% |
| Q2 2024 | 97% | 82% | 60% | 40% |
| Q3 2024 | 96% | 80% | 58% | - |
| Q4 2024 | 98% | - | - | - |

Interpretation:
- Row = cohort retention curve (track specific cohort over time)
- Column = comparison (month 3 retention improving quarter to quarter)
- Diagonal = time period comparison (how Q1 doing in Sept vs Q2 doing in Sept?)

**Analyzing retention curves**

Healthy curve (declining gradually):
- Month 1-2: 95% (normal onboarding fallout)
- Month 3: 80% (product fit assessment)
- Month 6-12: Stable 60-70% (committed users, low churn)

Unhealthy patterns:
- Cliff drop (month 2 from 95% to 50%): Onboarding fails
- Flat improvement (95% → 94% → 93%): Slow, steady churn = product issue
- Cohort divergence: Newer cohorts better = recent improvement (onboarding, product)

Cohort comparison analysis:
- Q1 retention: 95% → 75% → 50% (declining quickly)
- Q2 retention: 97% → 82% → 58% (better curve)
- Hypothesis: Q2 improved onboarding or product
- Validation: Identify change (onboarding redesign, feature launch)
- Confirm: If Q3/Q4 sustain improvement, validated

**Cohort-based improvement cycle**

Monthly:
- Track active customers by cohort
- Calculate retention curve
- Flag outliers (cohort underperforming)

Quarterly:
- Deep analysis: Which cohort has best curve?
- Root cause: What was different? (Product feature, onboarding, marketing)
- Hypothesis: If we apply to other cohorts, expect X% improvement

Test:
- A/B test improvement with new cohort (50% new customers)
- Measure: If new customers show 5% higher retention, validate
- Rollout: Apply to 100% if validated

Track:
- Next 3 cohorts (confirm improvement sustained)
- Measure financial impact (retention improvement × LTV × cohort size)

Example calculation:
- Cohort size: 100 customers
- Baseline month 6 retention: 50%
- Improvement: 5% higher retention = 55% month 6
- Additional retained: 5 customers
- LTV per customer: £20,000
- Value: 5 × £20,000 = £100,000 impact

`
      }
    ],
    relatedSlugs: ["retention-and-churn-reduction-mechanics", "metrics-dashboard-design-kpi-tracking", "customer-success-metrics-and-program-design"],
    faq: [
      { q: "How do I define a cohort?", a: "By signup month (most common). Group all customers who signed up in Jan 2024, Feb 2024, etc. Track each cohort's retention over time. Other: By channel (organic vs paid), by segment (SMB vs enterprise). Start simple: Monthly cohorts. Measure: % active in month 1, 3, 6, 12." },
      { q: "What retention curve should I expect?", a: "Healthy: 90-95% month 1 (onboarding), 70-80% month 3, 50-70% month 6, 30-50% month 12. Depends on segment: Enterprise higher (30-40% churn/year), SMB lower (50-70% churn/year). Improvement: Each new cohort should show better retention (indicates improvements working)." },
      { q: "How do I use cohort analysis to improve?", a: "1. Identify cohort with best retention. 2. Find what was different (product, onboarding, marketing). 3. Test with new cohort (A/B test). 4. Measure impact (5% improvement × LTV = financial benefit). 5. Rollout if validated. Cadence: Quarterly analysis and improvement cycle." }
    ],
    videoUrl: ""
  }
];

export default batch236Articles;