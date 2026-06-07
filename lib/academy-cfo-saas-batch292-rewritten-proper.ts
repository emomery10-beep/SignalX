import { AcademyArticle } from "@/types/academy";

export const batch292Articles: AcademyArticle[] = [
  {
    slug: "cohort-retention-curves-and-analysis",
    title: "Cohort Retention Curves and Analysis: Measuring Lifecycle Patterns",
    description: "Master cohort analysis. Track retention curves, spot trends, optimize lifecycle.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cohort retention", "retention curves", "churn analysis", "customer lifecycle", "retention patterns"],
    keyTakeaways: [
      "Cohort basics: Group customers by acquisition month, track retention over time. Reveals: How long do customers stay? Does newer cohorts retain better? Is onboarding improving? Example: Cohort Jan 2024 starts 100%, month 2 = 95%, month 3 = 90% (5% month 1 churn, 5% month 2). Benefit: See trends early (improving or declining retention). Cost: Data analysis (spreadsheet). Importance: Retention curve shape reveals business health (steep decline = problem, flat = healthy).",
      "Curve shape interpretation: Steep cliff (first month): Onboarding problem (improve activation). Steady decline (months 1-6): Normal churn (lifecycle). Then flat (month 6+): Stable retention (mature customers). Target: Minimize cliff, flat retention by month 6-9. Comparison: Recent cohorts vs old. Better retention = product/onboarding improving. Worse retention = product degrading. Red flag: All cohorts declining (structural problem). Green flag: Recent cohorts better (improvement).",
      "Action triggers: Cliff too steep (>5% month 1 churn) = fix onboarding (activation work). Month 2-4 churn high (>5%) = fix value realization (customers not realizing ROI). Flat section declining = improve retention (CS, engagement). Newer cohorts worse = recently something broke (product? market?). Cost: Varies (onboarding = product time, CS = hiring). Benefit: Fix problems early, retain more customers, higher LTV."
    ],
    content: [
      {
        heading: "Analyzing Cohort Retention Curves",
        body: `Understanding customer lifecycle patterns.

**Building cohort retention analysis**

Setup:
- Cohort dimension: Acquisition month (most common)
- Retention metric: % of cohort still active at each month
- Activity definition: Logged in? Used feature? Paid (if SaaS)?
- Timeframe: 12+ months (see full lifecycle)

Example cohort table:

| Cohort | M0 | M1 | M2 | M3 | M4 | M6 | M12 |
|---|---|---|---|---|---|---|---|
| Jan 2024 | 100% | 95% | 90% | 87% | 85% | 83% | 80% |
| Feb 2024 | 100% | 96% | 92% | 90% | 88% | 86% | 82% |
| Mar 2024 | 100% | 94% | 89% | 86% | 84% | 82% | - |
| Apr 2024 | 100% | 97% | 94% | 91% | 89% | - | - |
| May 2024 | 100% | 95% | 91% | 88% | - | - | - |
| Jun 2024 | 100% | 96% | 93% | - | - | - | - |

Interpretation:
- Jan: Steeper decline (5% month 1, then flattens 2-3% monthly)
- Jun: Better early retention (4% month 1, similar trajectory)
- Trend: Improving retention in recent cohorts

Calculating month-over-month retention:
- Month 0 to 1: 95/100 = 95% (5% churn)
- Month 1 to 2: 90/95 = 94.7% (5.3% churn)
- Month 2 to 3: 87/90 = 96.7% (3.3% churn)

Churn calculation:
- Cohort Jan, monthly churn:
  - M0-M1: 5%
  - M1-M2: 5.3%
  - M2-M3: 3.3%
  - Trend: Declining churn (good)

**Curve shape analysis**

Healthy retention curve:

\`\`\`
100% ┐
     │  ╱╲ (cliff)
  90%│ ╱  ╲
     │╱    ╲___
  80%│        ╲___
     │            ╲___
  70%│                ╲_____
     └─────────────────────
     0  3  6  9  12 months
\`\`\`

Characteristics:
- Initial cliff (M0-M1): 5-10% churn (normal)
- Rapid decline (M1-M3): 3-5% monthly churn
- Stabilization (M3+): <2% monthly churn
- Plateau (M6+): Flat line (stable, mature customers)

Comparison to industry:
| Stage | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|
| SaaS average | 92-95% | 80-85% | 70-80% | 60-70% |
| High retention | 96-98% | 88-92% | 80-85% | 75-80% |
| Low retention | 85-90% | 70-75% | 50-60% | 30-40% |

Problem curves:

Steep cliff (M0-M1):
\`\`\`
100% ┐
     │
     │  ╱╲
  80%│ ╱  ╲___
     │
  60%│        ╲_____
     └─────────────────
     0  3  6  9  12
\`\`\`
- Indicates: Onboarding/activation problem
- Risk: High early churn (customer not getting value quickly)
- Fix: Improve activation, faster time-to-value

Continuous decline:
\`\`\`
100% ┐
     │
     │  ╱
  75%│ ╱    ╲
     │        ╲
  50%│         ╲___
     └─────────────────
     0  3  6  9  12
\`\`\`
- Indicates: Retention problem throughout lifecycle
- Risk: No stable customer base (constant churn)
- Fix: Identify what makes customers leave (CS, product)

Cohort degradation:
\`\`\`
         Jan    Apr    Jul
100% │   ━━━    ╱      ╱
  90%│       ╲─╱  ╲───╱
  80%│              ╲╱
     └─────────────────
     0  3  6  9  12
\`\`\`
- Indicates: Recent product change, market shift
- Risk: Something broke (product, market, competition)
- Fix: Diagnose what changed (features? pricing? market?)

**Drilling down on problem areas**

Steep cliff (onboarding issue):
- Check: Are customers completing activation steps?
- Metrics: % completing setup, first feature use, first "aha" moment
- Fix: Speed up onboarding, simplify setup, clearer value
- Timeline: 2-4 week experiment (test onboarding changes)

Month 2-4 churn spike:
- Check: When do customers realize value? Why do they leave?
- Surveys: Ask churning customers "why did you leave?"
- Usage: Are they using core features?
- Fix: Improve value realization (CS check-in, more guidance)

Gradual decline without stabilization:
- Check: Are any customers staying long-term?
- Product: Is product solving the problem?
- Competition: Any new competitors? Customers switching?
- Fix: Feature improvements, CS engagement, pricing alignment

Cohort degradation:
- Timeline: When did trend reverse?
- Changes: What launched/changed around that time?
- Examples:
  - Pricing increase → higher churn
  - Feature removal → higher churn
  - New competitor → higher churn
  - Holiday season → lower engagement
- Fix: Revert change? Mitigate competition? Seasonal adjustment?

**Segmented cohort analysis**

Segment by acquisition channel:

| Channel | M1 | M3 | M6 | M12 | Notes |
|---|---|---|---|---|---|
| Organic | 97% | 88% | 82% | 75% | Best retention |
| Sales/AE | 94% | 82% | 70% | 55% | High early value, higher churn |
| Paid ads | 90% | 75% | 60% | 40% | Poorest retention |
| Partner | 95% | 85% | 78% | 70% | Good retention |

Insights:
- Organic: More self-selected, better fit
- Paid ads: Lower quality leads
- Sales: High-touch closes, but not best long-term fit
- Action: Shift acquisition to organic/partner (better economics)

Segment by customer value (ACV):

| ACV | M1 | M3 | M6 | M12 | Notes |
|---|---|---|---|---|---|
| <£1K | 92% | 78% | 60% | 40% | Lower retention, easier to churn |
| £1-5K | 95% | 85% | 75% | 60% | Better retention |
| £5K+ | 98% | 92% | 88% | 85% | Highest retention |

Insights:
- Higher ACV = better retention (more invested)
- Action: Focus on higher ACV customers (better LTV)

**Predicting and improving retention**

Prediction model:
- If cohort X has 90% M3 retention (industry avg 80%)
- Expect M6 retention: ~82% (apply average decline trajectory)
- If M6 actual is 75%, underperforming

Leading indicators:
- Track M0-M1 churn (early warning signal)
- Week 1 activation % (predicts M1 retention)
- First 30-day engagement (predicts M3 retention)
- CS sentiment (predicts future churn)

Monthly monitoring:
- Dashboard: Latest cohort M1 retention (is it 95%+?)
- Trend: Recent cohorts vs average
- Alerts: If M1 churn spikes >8%, investigate
- Actions: Monthly retention review, quarterly strategy

`
      }
    ],
    relatedSlugs: ["retention-and-churn-reduction-mechanics", "customer-success-metrics-and-program-design", "metrics-dashboard-design-kpi-tracking", "unit-economics-ltv-cac-payback", "product-market-fit-assessment-and-validation"],
    faq: [
      { q: "How do I read a cohort retention curve?", a: "Group customers by acquisition month, track retention over time (M0=100%, M1, M2, etc.). Healthy curve: 5-10% cliff month 1, then 3-5% monthly decline, stabilizing by month 6 (60-80% retained). Compare recent cohorts to old: improving = good. Recent worse = problem." },
      { q: "What does a steep cliff mean?", a: "Steep month 0-1 churn (>10%) = onboarding/activation problem. Customers not getting value quickly. Fix: Improve activation, faster time-to-value, better onboarding UX. Monitor week 1 metrics: % completing setup, % using core features." },
      { q: "How do I use cohort analysis to improve retention?", a: "Identify problem area: Steep cliff = onboarding. Month 2-4 churn = value realization. Gradual decline = engagement/product. Cohort degradation = recent change. Segment by channel: Organic better than paid (improve acquisition quality). Target: Improve weakest cohort segment, measure impact, iterate." }
    ],
    videoUrl: ""
  }
];

export default batch292Articles;