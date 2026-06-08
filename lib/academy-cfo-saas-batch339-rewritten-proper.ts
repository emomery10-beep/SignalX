import { AcademyArticle } from "@/types/academy";

export const batch339Articles: AcademyArticle[] = [
  {
    slug: "cohort-economics-and-unit-profitability",
    title: "Cohort Economics and Unit Profitability: Understanding Cohort Performance",
    description: "Master cohort analysis. Analyze profitability, identify trends, optimize segments.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cohort analysis", "unit economics", "cohort profitability", "cohort retention", "customer profitability"],
    keyTakeaways: [
      "Cohort definition: Group of customers acquired in same time period (month, quarter). Analysis: Track cohort over time (does Q1 2024 cohort stay, spend, expand?). Metrics: Retention curve (% retained over time), revenue per cohort member, lifetime value by cohort. Purpose: (1) Understand product quality (better product = better retention cohorts), (2) Identify acquisition quality (expensive customer source = slower payback), (3) Measure improvements (new onboarding better retention).",
      "Cohort economics: (1) CAC for cohort (how much spent to acquire), (2) Revenue per customer (ARPU × lifetime), (3) Profitability (revenue - CAC). Compare cohorts: Q1 cohort £1500 LTV, Q2 £1700 LTV (20% improvement = better product or cheaper CAC). Identify trends: Improving cohorts = product/retention getting better. Declining = problem (churn worsening, or expensive acquisition).",
      "Analysis example: Q1 cohort (100 customers, £500 CAC each). Month 1 revenue: £100 × £200 = £20K. Month 3: 85 customers (15% churn) = £17K. Month 6: 70 customers (30% total churn) = £14K. Month 12: 54 customers (46% churn) = £10.8K. LTV: (£20K + £17K + £14K + ... over 12 months) / 100 = ~£150K total / £50K CAC = £100K net LTV. Profitable if revenue exceeds CAC quickly enough."
    ],
    content: [
      {
        heading: "Analyzing Cohort Economics and Profitability",
        body: `Understanding unit profitability through cohort-level analysis.

**Cohort analysis fundamentals**

Definition:
- Cohort: Group of customers acquired in same period (month, quarter, year)
- Analysis: Track cohort's revenue, retention, spending over time
- Purpose: Understand customer quality and profitability by acquisition period

Why cohorts matter:

Example: Two cohorts, same £500 CAC, different results

Cohort Q1 (jan-mar 2024):
- Acquisition CAC: £500 per customer
- Month 1 retention: 95%
- Month 6 retention: 80%
- Month 12 retention: 60%

Cohort Q2 (apr-jun 2024):
- Acquisition CAC: £500 per customer
- Month 1 retention: 92%
- Month 6 retention: 75%
- Month 12 retention: 50%

Both cost £500, but Q1 retains 60% vs Q2 50% = Q1 is 20% more valuable

Insight: Q1 acquisition source better (higher-quality customers) OR onboarding improved (Q1 got better training)

**Cohort retention curves**

Definition:
- Visualization of cohort retention over time
- X-axis: Months since activation
- Y-axis: % of cohort retained

Example cohort table:

| Cohort | Month 0 | Month 1 | Month 3 | Month 6 | Month 12 | Month 24 |
|---|---|---|---|---|---|---|
| Jan 2023 | 100 | 95 | 85 | 72 | 54 | 38 |
| Feb 2023 | 100 | 96 | 87 | 75 | 58 | 42 |
| Mar 2023 | 100 | 97 | 89 | 78 | 62 | 45 |

Interpretation:
- Retention improving (Mar cohort better than Jan)
- Jan cohort: Lose 46% in 12 months, 62% in 24 months
- Mar cohort: Lose 38% in 12 months, 55% in 24 months
- Product or onboarding improving (later cohorts retain better)

**Cohort revenue analysis**

Definition:
- Revenue per cohort member over time
- Tracks: ARPU growth, expansion, downgrades

Example: 100 customers per cohort, £100/month starting price

| Cohort | Month 1 | Month 3 | Month 6 | Month 12 | Total revenue |
|---|---|---|---|---|---|
| Jan 2024 | £10K | £8.5K | £7.2K | £5.4K | £102K per 100 |
| Feb 2024 | £10K | £8.7K | £7.5K | £5.8K | £106K per 100 |
| Mar 2024 | £10K | £8.9K | £7.8K | £6.2K | £111K per 100 |

Interpretation:
- Revenue declining over time (churn = fewer customers)
- Later cohorts generating more revenue (better retention)
- Total 12-month revenue: Jan £1.02K per customer, Mar £1.11K per customer (9% higher)

**Cohort profitability analysis**

Formula:

Cohort profitability = Total revenue - CAC - COGS

Example: Jan 2024 cohort

| Item | Amount |
|---|---|
| 100 customers acquired | 100 |
| CAC per customer | £500 |
| Total acquisition cost | £50K |
| 12-month revenue per cohort | £102K (from above) |
| COGS (30% of revenue) | £30.6K |
| Gross profit | £71.4K |
| Acquisition cost | -£50K |
| Net profit | £21.4K |
| Profit per customer | £214 |
| Payback period | 7.1 months |

Calculation detail:
- First month: Revenue £10K, COGS £3K, gross profit £7K
- Acquisition cost was £50K (all upfront)
- Profit per month: £10K × 70% = £7K
- Payback: £50K / £7K = 7.1 months
- After month 7.1, customer is profitable (every month adds profit)

Comparison across cohorts:

| Cohort | Revenue | COGS | Gross | CAC | Net profit | Payback |
|---|---|---|---|---|---|---|
| Q1 2023 | £102K | £30.6K | £71.4K | £50K | £21.4K | 7.1 months |
| Q2 2023 | £106K | £31.8K | £74.2K | £50K | £24.2K | 6.8 months |
| Q3 2023 | £111K | £33.3K | £77.7K | £50K | £27.7K | 6.4 months |

Insight: Later cohorts more profitable (faster payback, higher revenue)

Reasons:
- Better product (fewer bugs = less support costs = lower COGS)
- Better onboarding (customers adopt faster = lower early churn = higher revenue)
- Better CAC (more efficient acquisition = lower cost)

**Cohort economics by segment**

Different segments, different economics:

Enterprise cohort (£1000 CAC, £5000 ARPU):
- 100 customers × £1000 CAC = £100K acquisition
- Month 1 retention: 98%
- Month 12 retention: 88%
- 12-month revenue: £5K × 10 months average = £50K per customer
- Total revenue: £5M
- COGS (20% for enterprise): £1M
- Gross profit: £4M
- Net profit: £4M - £100K = £3.9M
- Payback: 2.4 months (very fast)
- Profit per customer: £39K (excellent)

SMB cohort (£300 CAC, £50 ARPU):
- 1000 customers × £300 CAC = £300K acquisition
- Month 1 retention: 80%
- Month 12 retention: 40%
- 12-month revenue: £50 × 6 months average = £300 per customer
- Total revenue: £300K
- COGS (40% for SMB): £120K
- Gross profit: £180K
- Net profit: £180K - £300K = -£120K (UNPROFITABLE!)
- Payback: Never (loses money)
- Profit per customer: -£120 (negative)

Insight: Enterprise very profitable, SMB not. Strategy:
- Invest in enterprise (high CAC justified by LTV)
- Reduce SMB CAC (move to self-serve, reduce acquisition cost) OR
- Increase SMB LTV (reduce churn, improve retention) OR
- Exit SMB (focus on higher-margin)

**Using cohort analysis for optimization**

Scenario 1: Declining retention cohorts

Observation: Jan 2024 cohort 60% retention, Feb 65%, Mar 70% (improving trend)

Hypothesis: Onboarding improvement in March

Actions:
- Measure: What changed in March? (new onboarding process? CS team hired?)
- Replicate: Apply March process to all customers
- Expected: Future cohorts all retain 70% (instead of varying 60-70%)

Impact: If average prior retention 65%, improve to 70% = 7.7% retention improvement

Revenue impact (1000 customer base):
- 12-month revenue at 65% retention: 1000 × £100 × 7 months average = £700K
- 12-month revenue at 70% retention: 1000 × £100 × 7.5 months average = £750K
- Improvement: £50K (7% revenue increase)

Scenario 2: Expensive cohort (slow payback)

Observation: Q1 cohort 7.1 month payback, Q2 6.8 months, Q3 6.4 months (improving)

But Q1 acquisition source still expensive. Payback still slow vs target 4 months.

Actions:
- Identify Q1 source (which channel cost £500 CAC?)
- Compare to Q3 (which achieved £500 CAC with 6.4 month payback)
- Shift budget to Q3 source (more efficient)
- Kill Q1 channel (too expensive)

Expected: Shift acquisition budget to efficient channels, improve payback to 5-6 months

Scenario 3: Product quality signal

Observation: Retention curves improving over time

Jan cohort: 60% month 12
Feb cohort: 62% month 12
Mar cohort: 65% month 12
Apr cohort: 68% month 12 (projected)

Insight: Product quality improving (product updates, features, bug fixes)

Validate: Check feature releases, customer feedback, churn reason data

Confidence: Cohort trend is strong signal (consistent improvement)

**Cohort dashboard**

Monthly monitoring:

| Cohort | Size | Retention | Revenue/customer | LTV | CAC | Net LTV | Status |
|---|---|---|---|---|---|---|---|
| Jan 24 | 50 | 60% | £1000 | £1500 | £500 | £1000 | Good |
| Feb 24 | 60 | 62% | £1050 | £1575 | £500 | £1075 | Better |
| Mar 24 | 70 | 65% | £1100 | £1650 | £500 | £1150 | Better |
| Apr 24 | 75 | 67% | £1120 | £1680 | £520 | £1160 | Better |

Metrics to watch:
- Retention trend (improving, flat, declining?)
- LTV trend (getting better, worse?)
- CAC stability (staying consistent?)
- Net LTV (profit per customer)

Quarterly review:
- Compare to prior quarter (are cohorts getting better?)
- Identify inflection points (when did something change?)
- Correlate with product/operational changes (what drove improvement?)

**Common cohort analysis mistakes**

Mistake 1: No cohort analysis (aggregate only)
- Problem: Know overall 5% churn, don't know if cohorts differ
- Fix: Segment by cohort, compare retention curves
- Impact: Identify trends, product improvements

Mistake 2: Analyze retention without revenue
- Problem: Track retention, miss that some cohorts have lower ARPU
- Fix: Combine retention + revenue per cohort
- Impact: Understand true profitability

Mistake 3: No connection to product/operations
- Problem: See cohort trends, don't investigate root cause
- Fix: Correlate cohort trends with product changes, acquisitions changes
- Impact: Validate product improvements work, identify what drove changes

Mistake 4: Ignore expensive cohorts
- Problem: Some cohorts have 10-month payback (slow), don't act
- Fix: Kill expensive acquisition sources, shift budget to efficient
- Impact: Improve unit economics, payback

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "retention-and-churn-reduction-mechanics", "metrics-dashboard-design-kpi-tracking", "profitability-analysis-and-operating-leverage", "customer-acquisition-strategy-and-marketing-roi"],
    faq: [
      { q: "What is cohort analysis?", a: "Cohort analysis: Group customers by acquisition period (month, quarter), track their behavior over time. Metrics: Retention (% staying), revenue per cohort member, lifetime value. Purpose: Identify product improvements (retention improving = product better), acquisition quality (expensive source = slow payback), profitability trends. Example: Q1 cohort 60% retained at 12 months, Q2 62%, Q3 65% (improving trend = product/onboarding better)." },
      { q: "How do I calculate cohort profitability?", a: "Formula: Cohort profitability = Total revenue - CAC - COGS. Example: 100 customers, £500 CAC each = £50K cost. 12-month revenue £102K, COGS 30% = £30.6K. Gross profit £71.4K. Net profit £21.4K (£214 per customer). Payback: 7.1 months (when acquisition cost recovered). Compare across cohorts: Later cohorts might be more profitable (better product or cheaper CAC)." },
      { q: "How do I use cohort analysis for optimization?", a: "Pattern recognition: If retention improving by cohort, investigate why (product improvement? Better onboarding?). Replicate: Apply best practice to all cohorts. If payback slow for some cohorts, identify acquisition source (expensive channel). Shift budget to efficient sources. Quarterly review: Compare retention curves, revenue trends, payback across cohorts. Target: Improving trends = good, flat/declining = problem." }
    ],
    videoUrl: ""
  }
];

export default batch339Articles;
