import { AcademyArticle } from "@/types/academy";

export const batch73Articles: AcademyArticle[] = [
  {
    slug: "cohort-analysis-retention-curves",
    title: "Cohort Analysis and Retention Curves: Measuring and Improving Product Stickiness",
    description: "Analyze customer cohorts to understand retention patterns. Use retention curves to measure product-market fit and identify churn drivers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "cohort analysis",
      "retention curves",
      "cohort retention",
      "churn analysis",
      "user retention",
      "retention curve",
      "cohort metrics",
      "retention cohorts",
      "product stickiness",
      "survival analysis"
    ],
    keyTakeaways: [
      "Cohort = group of customers acquired in same period (month, week); cohort analysis separates acquisition trends from retention: 100 customers month 1, 200 month 2 might show growth, but if month 1 cohort 50% churn and month 2 cohort 40% churn, retention actually improving (decouples volume from stickiness); cohort retention = % of that cohort still active at month X",
      "Retention curve shape predicts business health: Ideal curve (60%→50%→40%→30% by month 12 with steady decline) shows stable churn; cliff curve (60%→20% by month 3, then flat) shows onboarding issue (activation fails); hockey stick curve (40%→80% by month 6) shows compound improvements (product improvements increasing retention); analyze shape to diagnose problems",
      "Cohort size calculation: N-month retention = (customers active in month N ÷ cohort size) × 100%; example: January cohort 1000 customers, 600 active month 3 = 60% retention at month 3; calculate for multiple months (week 1, 2, 4, 12) to see pattern; mature SaaS: 70% week 1 retention (good onboarding), 40% week 4, 20% month 3 = acceptable (monthly churn ~3%)"
    ],
    content: [
      {
        heading: "Cohort Analysis Framework",
        body: `Cohort analysis separates acquisition trends from retention trends. It's the key to understanding real product stickiness.

**What is a Cohort?**

A cohort is a group of customers acquired in the same time period (typically, one month).

Example:

January 2026 cohort: 100 customers acquired in January
- Includes all signups, trials, and paid conversions in January
- All customers acquired via any channel (ads, organic, sales)
- All customer segments (SMB, enterprise, freelancer)

February 2026 cohort: 150 customers acquired in February

Tracking cohorts separately allows you to measure:
- Did acquisition grow (100 → 150 customers/month)? Yes.
- Did retention improve (% staying after month 1)? Need cohort data.

Without cohorts, you can't tell if revenue is growing because:
1. You acquired more customers (good), or
2. Fewer customers are churning (also good), or
3. Customers are expanding (good), or
4. Combination of all three

Cohort analysis isolates each lever.

**Cohort Retention Calculation**

For each cohort, track what % is still active at each month:

January 2026 cohort (1000 customers):

| Month | Still active | Retention % |
|-------|----------|----------|
| 0 (cohort start) | 1000 | 100% |
| 1 | 800 | 80% |
| 2 | 700 | 70% |
| 3 | 600 | 60% |
| 6 | 450 | 45% |
| 12 | 300 | 30% |

This cohort has 30% annual retention (70% annual churn).

Intuition: Of every 100 customers you acquire, 30 are still paying after a year.

**Cohort Analysis Example**

Looking at multiple cohorts reveals retention trends:

| Cohort | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|---------|
| Jan 2025 | 80% | 60% | 45% | 30% |
| Feb 2025 | 82% | 62% | 48% | 32% |
| Mar 2025 | 84% | 65% | 50% | 35% |
| Apr 2025 | 85% | 67% | 52% | 37% |
| May 2025 | 86% | 70% | 55% | 40% |
| Jun 2025 | 88% | 72% | 58% | 42% |

Insights:
1. **Retention improving**: Early cohorts (Jan-Mar) have lower retention than later cohorts (Apr-Jun)
2. **Improvement slope**: 80% → 88% month 1 retention = 1% per month improvement
3. **Acceleration**: Newer cohorts have steeper improvement (suggests product changes working)

Hypothesis: Product improvements in Q1 2025 increased activation and retention. Early cohorts (acquired pre-improvement) have lower retention. Later cohorts acquired post-improvement have higher retention.

**Monthly Cohort Retention vs. Annual Cohort Retention**

Two common ways to organize cohorts:

1. **Monthly cohorts**: All customers acquired in January, February, etc.
   - Best for: Monthly recurring revenue (MRR) trending
   - Granular enough to see trends
   - Standard for SaaS

2. **Quarterly or annual cohorts**: All customers acquired in Q1, Q2, etc.
   - Best for: Trend analysis over longer periods
   - Less noisy than monthly
   - Better for large customer volumes

For most SaaS, monthly cohorts are standard.

**Cohort Analysis vs. Overall Churn Rate**

Example: Company with flat overall churn rate (2%/month), but cohort analysis reveals:

| Cohort | Month 1 retention | Month 12 retention |
|--------|---------|---------|
| Jan (old pricing) | 70% | 20% |
| Feb (old pricing) | 70% | 20% |
| Mar (old pricing) | 70% | 20% |
| Apr (new pricing, cheaper) | 75% | 25% |
| May (new pricing) | 78% | 28% |
| Jun (new pricing) | 80% | 30% |

Overall churn rate is 2%/month (appears stable), but cohort analysis reveals:
- Old pricing cohorts: 30% annual retention (poor)
- New pricing cohorts: 30%+ annual retention (better, improving)

Overall churn hides improvement. Cohort analysis reveals the truth.

Without cohorts: You'd think churn is flat (2%/month consistent). With cohorts: You see that product improvements are working (newer cohorts better).

**Cohort Retention Interpretation**

A healthy SaaS product typically shows:

| Timeframe | Healthy retention |
|-----------|----------|
| Week 1 | 60-70% (day-1 activation important) |
| Week 2 | 50-60% (early churn happens here) |
| Month 1 | 40-50% |
| Month 3 | 30-40% |
| Month 6 | 20-30% |
| Month 12 | 10-20% |

If your cohort retention is lower:
- Week 1 <60%: Onboarding issue (product doesn't deliver value quickly)
- Month 1 <40%: Activation problem (product isn't sticky)
- Month 3 <30%: Product-market fit issue (product not valuable enough)
- Month 12 <10%: No enterprise customers (high churn across board)

If your retention is higher, that's excellent (you have strong product-market fit).

**Lifetime Value Tie-in**

Cohort retention directly determines LTV:

LTV = (Monthly revenue per customer × Gross margin) ÷ Monthly churn rate

If Jan cohort has 2% monthly churn:
- LTV = (£200/month revenue × 70% GM) ÷ 0.02 = £7,000 per customer

If Jun cohort (with better retention) has 1.5% monthly churn:
- LTV = (£200/month revenue × 70% GM) ÷ 0.015 = £9,333 per customer

Cohort analysis quantifies the business impact of retention improvements.
`
      },
      {
        heading: "Retention Curve Shapes and Diagnosis",
        body: `Different retention curves tell different stories about your product. Learn to read your curve.

**Ideal Retention Curve**

Ideal retention curve: Smooth, steady decline with flattening at the end.

| Month | Retention | Monthly churn |
|-------|-----------|----------|
| 0 | 100% | — |
| 1 | 85% | 15% |
| 2 | 75% | 10% |
| 3 | 67% | 8% |
| 6 | 50% | 3% |
| 12 | 35% | 2% |

Interpretation:
- Early churn (month 1): 15% (people using and not getting value)
- Middle churn (month 3): 8% (natural attrition)
- Late churn (month 12): 2% (stable base, low attrition)

This is healthy. Early, heavy churn (the tire-kickers), then stabilization.

**Cliff Curve (Problematic)**

Retention drops sharply in first month, then plateaus.

| Month | Retention | Monthly churn |
|-------|-----------|----------|
| 0 | 100% | — |
| 1 | 40% | 60% |
| 2 | 38% | 2% |
| 3 | 37% | 1% |
| 6 | 36% | 0.2% |

Interpretation:
- 60% of customers churn in month 1 (onboarding failure)
- But those who survive month 1 are very sticky (1-2% monthly churn after)
- Split into two segments: "right-fit" (survive month 1) and "wrong-fit" (churn)

Root cause: Onboarding issue
- Product doesn't deliver value quickly enough
- Users can't find key features
- Activation flow too complex
- Product doesn't match expectations

Fix: Improve activation
- Faster onboarding (reduce time to first value)
- In-app walkthrough (show where key features are)
- Guided workflows (step-by-step setup)
- Lower barrier to first action (simpler signup, sample data)

Goal: Move that 40% month 1 retention up to 70%.

**Hockey Stick Curve (Excellent)**

Retention dips early, then actually increases (or flattens very high).

| Month | Retention | Monthly churn |
|-------|-----------|----------|
| 0 | 100% | — |
| 1 | 60% | 40% |
| 2 | 50% | 10% |
| 3 | 45% | 5% |
| 6 | 50% | 0% (plateau) |

Interpretation:
- Initial churn in month 1 (40%, same as cliff curve)
- But then retention stays steady or improves
- Month 6+: Customers finding value, engaging more, staying longer

Root cause: Product is getting better for long-tail customers
- New features added (month 3-6 cohorts see better product)
- Customers learning the product (later months more engaged)
- Network effects (multi-user product, more value as team joins)

This is ideal. Early churn of wrong-fit customers, then sticky base.

**Declining Curve (Very Problematic)**

Retention declines continuously without plateau.

| Month | Retention | Monthly churn |
|-------|-----------|----------|
| 0 | 100% | — |
| 1 | 80% | 20% |
| 2 | 64% | 20% |
| 3 | 51% | 20% |
| 6 | 33% | 20% |
| 12 | 7% | 20% |

Interpretation:
- Constant 20% monthly churn (no plateau)
- Even long-time customers are churning
- No segment of "sticky" customers (everyone leaves eventually)

Root cause: Product not valuable enough long-term
- Initial novelty (customers try for a month or two)
- But never becomes essential (low switching costs)
- Competitive alternatives (customers try something better)
- Use case limited (product only solves one problem, people need more)

Fix: Product roadmap
- Add features that increase stickiness
- Integrate with customers' workflows (hard to leave)
- Land-and-expand (start small, grow with customer)
- Multi-user adoption (more valuable with team)

This is common with products that solve a one-off problem (migrating data, cleaning database) but not recurring use cases.

**Reading Your Retention Curve**

To diagnose problems, ask:

1. **What's the week-1 retention?**
   - <50%: Activation issue (product doesn't show value immediately)
   - 50-70%: Normal (expected initial churn)
   - >70%: Good (strong product-market fit)

2. **What's the slope from week 1 to month 3?**
   - Steep decline (week 1: 70%, month 3: 30%): Onboarding works, but long-term stickiness issue
   - Flat decline (week 1: 50%, month 3: 45%): Retention is stable (good or bad depending on baseline)

3. **What's the month 6 retention?**
   - <20%: High churn business (only suited for enterprise where expensive to implement, hard to switch)
   - 20-40%: Normal SaaS (healthy)
   - >40%: Excellent (very sticky)

4. **Does the curve plateau?**
   - Yes (month 3 churn ≈ month 12 churn): Healthy (stabilized base)
   - No (consistent decline): Problematic (no durable customer base)

**Cohort Comparison**

Compare cohorts to understand if product is improving:

| Cohort | Month 1 | Month 3 | Month 6 |
|--------|---------|---------|---------|
| Jan 2025 | 70% | 50% | 35% |
| Feb 2025 | 72% | 52% | 37% |
| Mar 2025 | 75% | 55% | 40% |
| Apr 2025 | 78% | 58% | 43% |
| May 2025 | 80% | 62% | 46% |
| Jun 2025 | 82% | 65% | 48% |

Trend: Every month, cohort retention improving 1-2% at each checkpoint.

This indicates:
- Product improvements working
- Activation better (higher month 1)
- Long-term stickiness better (higher month 6)
- Trajectory: Keep improving at this rate, month 12 retention will improve by 6 percentage points (35% → 41%)

If comparing cohorts and seeing:
- No improvement: Product changes not helping, need different approach
- Regression: Newer cohorts have worse retention, something broke (feature removed, pricing changed, competitor entered)

Cohort comparison is your leading indicator of product health.
`
      },
      {
        heading: "Advanced Cohort Analysis and Segmentation",
        body: `Advanced cohort techniques: Segment by acquisition source, customer segment, or product feature to find high-performing cohorts.

**Cohort Analysis by Acquisition Channel**

Different channels acquire different quality customers.

Example:

| Channel | January cohort | Acquisition quality | Month 3 retention |
|---------|----------|----------|----------|
| Organic search | 200 customers | High intent | 65% |
| Paid search | 150 customers | Medium intent | 55% |
| Display ads | 100 customers | Low intent | 40% |
| Sales outreach | 50 customers | Pre-qualified | 80% |

Insights:
1. **Organic search**: High retention (65%) - customers find you when they have problem, well-qualified
2. **Paid search**: Medium retention (55%) - competitive market, some unqualified clickers
3. **Display ads**: Low retention (40%) - awareness ads, not high intent, attract wrong customers
4. **Sales**: Highest retention (80%) - pre-qualified, matched to use case

Action: Allocate more budget to organic and sales (higher quality), less to display (waste money on low-quality).

Calculation:
- CAC payback by channel:
  - Organic: Low CAC, 65% retention → 8-month payback
  - Sales: High CAC, 80% retention → 14-month payback
- Organic ROI is better. But sales gets higher ACV (enterprise). Combined strategy is best.

**Cohort Analysis by Customer Segment**

Different customer segments have different retention.

| Segment | Size | Month 1 retention | Month 6 retention |
|---------|------|----------|----------|
| Freelancers | 60% of cohort | 70% | 40% |
| Small teams (2-10) | 30% of cohort | 80% | 55% |
| Growing companies (10-50) | 8% of cohort | 85% | 65% |
| Enterprise (50+) | 2% of cohort | 90% | 80% |

Insights:
1. **Freelancers**: High churn (40% month 6) - solo products often have limited stickiness
2. **Small teams**: Better retention (55%) - collaboration features add stickiness
3. **Growing companies**: Excellent retention (65%) - product fits use case as they scale
4. **Enterprise**: Best retention (80%) - high switching costs, must-have

Action:
- Focus on small teams / growing companies (best retention)
- Build team collaboration features (increases stickiness)
- Add enterprise features (land in growing companies, upsell as they scale to enterprise)

**Cohort Analysis by Feature Adoption**

What features predict retention?

| Feature adoption | Cohort size | Month 1 | Month 6 |
|---|------|----------|---------|
| Activated (used key feature day 1) | 40% | 85% | 60% |
| Non-activated (never used key feature) | 60% | 50% | 15% |

Insights:
1. **Activation is critical**: Users who activate on day 1 have 60% month 6 retention. Users who don't have only 15%.
2. **4x impact**: Activation → retention multiplier is 4x (60% ÷ 15%)

Action:
- Prioritize day-1 activation in product
- Focus onboarding on getting users to key feature
- Maybe shift business model (charge after day-1 activation, refund if no activation)

**Churn Prediction using Cohorts**

Use cohort data to predict future churn and identify at-risk customers.

If month 1 retention drops from 80% to 75%, that's a 5% drop.

Trend analysis:
- Jan cohort: 80% month 1 → 50% month 6 (40% lost by month 6)
- Feb cohort: 79% month 1 → 49% month 6 (trending similar)
- Mar cohort: 78% month 1 → ? (predict 48% month 6)
- Apr cohort: 75% month 1 → ? (predict 45% month 6 if trend continues)

If April cohort actually achieves 45% month 6, that indicates:
- Trend is real (confirmed)
- Need to fix activation (month 1 retention declining)

This is your early warning system. Don't wait until month 6 to find out retention is bad—watch month 1 retention trend and act.

**Cohort Economics: LTV Calculation by Cohort**

Different cohorts have different lifetime values due to retention differences.

Jan 2025 cohort:
- Month 1 retention: 80%, Churn rate: 2.5%/month
- Monthly revenue: £200/customer
- Gross margin: 70%
- LTV = (£200 × 70%) ÷ 0.025 = £5,600

Jun 2025 cohort (better retention):
- Month 1 retention: 82%, Churn rate: 2.0%/month
- Monthly revenue: £200/customer
- Gross margin: 70%
- LTV = (£200 × 70%) ÷ 0.020 = £7,000

Jun cohort is 25% more valuable (£5,600 → £7,000) just from better retention.

If CAC is same (£2,000), then:
- Jan cohort: LTV/CAC = 2.8x
- Jun cohort: LTV/CAC = 3.5x

Jun cohort is more profitable. This is the compounding power of retention improvement.

**Key Cohort Metrics to Track**

Daily:
- Week 1 retention (% cohort active after 7 days)
- Day 1 activation (% cohort took key action day 1)

Weekly:
- Week 1-4 retention curve
- Compare to same week last month (is trend positive?)

Monthly:
- Full month 1 retention
- Month 3 retention (3-month look-back)
- Month 6 retention (6-month look-back, if available)
- Compare cohorts month-over-month (is new cohort better than last?)

Quarterly:
- Month 12 retention (annual review)
- Cohort LTV calculation
- Channel comparison (which acquisition source has best retention?)
- Segment comparison (which customer type has best retention?)

If week 1 retention declining:
- Activation issue (fix immediately, impacts all downstream metrics)

If month 1 retention declining but week 1 steady:
- Something broken in days 2-30 (check feature changes, customer success changes)

If month 6 retention declining but month 1 steady:
- Long-term stickiness issue (product becoming less valuable over time)

Each metric tells a different story. Monitor cohorts religiously.
`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "product-led-growth-analytics-metrics",
      "customer-lifetime-value-ltv-calculation",
      "metrics-dashboard-design-kpi-tracking",
      "data-driven-decision-making-analytics"
    ],
    faq: [
      {
        q: "What's a good month 6 retention rate?",
        a: "20-40% is typical, 40%+ is excellent. If below 20%, investigate activation/onboarding issues. Monthly churn should be 2-3% by month 6 (stable base)."
      },
      {
        q: "How do I calculate cohort retention?",
        a: "Retention = (active customers month X ÷ cohort size) × 100%. Example: 1000 customers in January cohort, 600 active in April (month 3) = 60% month 3 retention."
      },
      {
        q: "Why do newer cohorts have better retention than older ones?",
        a: "Product usually improves over time. Older cohorts saw worse product. Check when big features launched—retention should improve in cohorts acquired after launch."
      },
      {
        q: "What if my week 1 retention is dropping?",
        a: "Emergency—this is activation problem. Check: Did onboarding change? Is product slower? Check signup experience, first-time user flow. This cascades to all future months."
      }
    ],
    videoUrl: ""
  }
];

export default batch73Articles;
