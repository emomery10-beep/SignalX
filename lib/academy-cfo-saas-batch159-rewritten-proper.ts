import { AcademyArticle } from "@/types/academy";

export const batch159Articles: AcademyArticle[] = [
  {
    slug: "growth-accounting-and-advanced-unit-economics",
    title: "Growth Accounting and Advanced Unit Economics: Breaking Down Your Growth",
    description: "Master growth accounting. Decompose your growth into components (new customers, expansion, churn), understand unit economics deeply, and identify growth levers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 9,
    keywords: [
      "growth accounting",
      "unit economics",
      "revenue growth",
      "customer economics",
      "expansion revenue",
      "payback period",
      "customer cohort",
      "revenue retention",
      "magic number",
      "efficiency metrics"
    ],
    keyTakeaways: [
      "Growth accounting equation: MRR(t) = MRR(t-1) + New MRR - Churn MRR + Expansion MRR. Example: £100K starting → +£20K new customers - £2K churn + £3K expansion = £121K (21% growth). Insights: Where is growth coming from? New customers (acquisition), expansion (NRR), or both? Example: Growth 30% but all from new customers (no expansion) = fragile (churn hits hard). Better: Mixed (new + expansion) = sustainable.",
      "Unit economics pyramid: (1) Acquisition (CAC), (2) Retention (churn, LTV), (3) Monetization (ARPU, ACV). Deep metrics: Payback period = CAC / monthly gross profit per customer (target <12 months). CAC Ratio = Revenue year 1 / CAC (target >5x). Magic Number = (Revenue this quarter - Revenue last quarter) × 4 / Sales & Marketing spend previous quarter (target >0.75). Example: Q1 £100K, Q2 £120K, S&M spend Q1 £30K → Magic = (20K) × 4 / 30K = 2.67 (excellent).",
      "Cohort-level unit economics: Analyze by acquisition cohort (Jan, Feb, Mar, etc). Metrics: MRR per cohort over time, retention %, expansion rate. Example: Jan cohort 100 customers → Dec (12 months later) £8K MRR. Compare to Feb cohort £7.5K MRR (worse, investigate). This reveals: Product improvements working, pricing changes working, or acquisition quality declining."
    ],
    content: [
      {
        heading: "Growth Accounting Decomposition",
        body: `Breaking down where your growth comes from.

**The Growth Accounting Equation**

MRR(t) = MRR(t-1) + New MRR - Churn MRR + Expansion MRR

Where:
- MRR(t-1): Last month's revenue
- New MRR: Revenue from new customers
- Churn MRR: Revenue lost from churned customers
- Expansion MRR: Revenue growth from existing customers

Example month-by-month:

| Metric | Jan | Feb | Change |
|--------|-----|-----|--------|
| Starting MRR | £100K | £121K | - |
| New customers | 20 × £1K | 20 × £1K | +£20K |
| Churn MRR | 2% × £100K | 2% × £121K | -£2K /-£2.4K |
| Expansion MRR | 5% × £100K | 5% × £121K | +£5K / +£6.05K |
| Ending MRR | £121K | £147.65K | +21% / +22% |

**Growth Source Analysis**

Decompose growth into components:

Growth = 21% / 22%
- New customer contribution: 20% (new MRR / starting)
- Expansion contribution: 5%
- Churn impact: -2%
- Net: 20% + 5% - 2% = 23% (rounding difference)

Insight:
- New customers = 87% of growth
- Expansion = 21% of growth
- Churn = drag (13%)

Strategic implication: Growth heavily dependent on acquisition (risky). If acquisition slows, growth drops fast.

**Sustainable Growth**

Growth sources matter for sustainability:

Scenario A (Acquisition-heavy):
- New customers: +30% growth
- Expansion: +0% (no upsells)
- Churn: -5% (natural attrition)
- Net: 25% (fragile if acquisition stops)

Scenario B (Balanced):
- New customers: +15% growth
- Expansion: +10% (NRR >100%)
- Churn: -3% (good retention)
- Net: 22% (more durable)

Better: Scenario B. More resilient to acquisition fluctuations.

**Metrics to Track by Month**

| Month | MRR | % Growth | New % | Expansion % | Churn % |
|-------|-----|---------|-------|------------|---------|
| Jan | £100K | - | - | - | - |
| Feb | £121K | 21% | 20% | 5% | -2% |
| Mar | £143K | 18% | 18% | 4% | -2% |
| Apr | £165K | 15% | 17% | 4% | -3% |

Insight: Growth decelerating (21% → 15%) while new customer acquisition stable. Reason: Churn increasing, expansion stable. Action: Focus on retention.

`
      },
      {
        heading: "Advanced Unit Economics",
        body: `Deep metrics for understanding profitability.

**The Unit Economics Pyramid**

Foundation: Acquisition

CAC (Customer Acquisition Cost):
- Total sales & marketing / new customers acquired
- Example: £200K budget / 50 customers = £4K CAC
- Healthy: CAC < ⅓ LTV (payback in 3-4 months)

Second level: Retention

Churn rate (monthly):
- % customers lost per month
- Example: 2% monthly
- Healthy: <2% for SMB

NRR (Net Revenue Retention):
- Expansion revenue growth + retention
- Formula: (Starting MRR + Expansion - Churn) / Starting MRR
- Example: £100K start, £5K expansion, -£2K churn = 103% NRR
- Healthy: 100%+ (zero net churn or growth)

Third level: Monetization

ARPU (Average Revenue Per User):
- Total revenue / active customers
- Example: £100K / 100 = £1K ARPU
- Healthy: Growing over time (price increases, expansion)

**Payback Period**

How long until a customer pays for their acquisition cost.

Formula: CAC / (Monthly Gross Profit per Customer)

Where Monthly Gross Profit = ARPU × Gross Margin %

Example:
- CAC: £4K
- ARPU: £1K
- Gross margin: 80%
- Monthly gross profit: £1K × 80% = £800
- Payback: £4K / £800 = 5 months

Interpretation:
- 5 months payback = good (recover CAC quickly)
- 12 months payback = risky (long time to profitability)
- 3 months payback = excellent (aggressive expansion justified)

**CAC Payback Ratio**

CAC Payback = Total Revenue Year 1 / CAC

Example:
- CAC: £4K
- Year 1 revenue: £12K (£1K ARPU × 12 months)
- CAC Payback: £12K / £4K = 3x

Interpretation:
- 3x: Good (year 1 revenue covers CAC 3x)
- 5x: Excellent (very profitable)
- 1.5x: Poor (barely recover CAC in year 1)

Target: 5x or higher for growth stage.

**Magic Number (Growth Efficiency)**

How efficiently company converts S&M spending to revenue growth.

Formula: (Revenue Q(t) - Revenue Q(t-1)) × 4 / Sales & Marketing Spend Q(t-1)

Where ×4 annualizes the quarterly number.

Example:
- Q1 revenue: £100K
- Q2 revenue: £120K
- Q1 S&M spend: £30K
- Magic number: (£20K) × 4 / £30K = 2.67

Interpretation:
- >0.75: Healthy growth efficiency
- 1.0+: Excellent
- 2.0+: Outstanding
- <0.5: Inefficient (scale back spending or improve conversion)

`
      },
      {
        heading: "Cohort-Level Unit Economics",
        body: `Understanding customer economics by acquisition cohort.

**Cohort Analysis Framework**

Cohort: Group of customers acquired in same month.

Example: January 2024 cohort (50 customers, avg £1K ACV)

Month 0 (Jan): 50 customers × £1K = £50K MRR
Month 1 (Feb): 49 customers × £1K + expansions = £49.5K
Month 2 (Mar): 48 customers × £1.02K (10% expansion rate) = £48.96K
Month 3 (Apr): 47 customers × £1.04K = £48.88K

MRR evolution for Jan cohort over 12 months:

| Month | Customers | ARPU | MRR | Growth |
|-------|-----------|------|-----|--------|
| 0 | 50 | £1.00K | £50K | - |
| 3 | 47 | £1.04K | £48.9K | -2% |
| 6 | 46 | £1.08K | £49.7K | -1% (expansion recovered) |
| 12 | 44 | £1.14K | £50.2K | +0.4% (durable!) |

Insight: Jan cohort MRR stable over 12 months despite 2% churn. Expansion offsets churn (healthy).

**Comparing Cohorts**

Compare different cohort acquisition months:

| Jan Cohort | Feb Cohort | Mar Cohort | Apr Cohort | Metric |
|---|---|---|---|---|
| £50K (month 0) | £52K | £51K | £49K | Starting MRR |
| £50.2K (month 12) | £51.8K | £50.4K | £47.5K | 12-month MRR |
| 0.4% | -0.4% | -1.2% | -3% | 12-month growth |

Insight:
- Jan, Feb cohorts stable/growing (product working well)
- Mar cohort declining 1.2% (investigate)
- Apr cohort declining 3% (major issue)

Hypothesis for Apr decline:
- Onboarding change (worse) → lower expansion
- Pricing change (higher) → more churn
- Product regression → churn increase
- Market change → SMB customers less likely to expand

Action: Investigate Apr cohort churn/expansion drivers.

**Cohort Economics Table**

Detailed unit economics by cohort:

| Cohort | CAC | LTV | LTV/CAC | Payback | Status |
|--------|-----|-----|---------|---------|--------|
| Jan | £4K | £60K | 15x | 4 mo | Good |
| Feb | £4.2K | £60K | 14.3x | 4.2 mo | Good |
| Mar | £4K | £55K | 13.75x | 4.3 mo | Fair |
| Apr | £3.8K | £48K | 12.6x | 4.8 mo | Poor |

Insight:
- Apr cohort: Lower CAC (cheaper acquisition) but much lower LTV (poor quality)
- Maybe cheaper channel attracted wrong customers
- Action: Adjust acquisition strategy (higher CAC but better quality)

**Retention Curves**

Visualize retention by cohort:

Jan cohort: 100% → 98% (month 1) → 96% (month 3) → 94% (month 6) → 90% (month 12)
Feb cohort: 100% → 98% → 95% → 92% → 88%
Mar cohort: 100% → 96% → 92% → 88% → 82%
Apr cohort: 100% → 94% → 88% → 80% → 70%

Insight: Apr cohort retention much worse. Early red flag (month 1 already 6% churn vs 2% for Jan). Action: Investigate onboarding, product, pricing for Apr cohort issue.

`
      },
      {
        heading: "Optimizing Unit Economics",
        body: `Improving profitability and growth.

**Levers to Improve Unit Economics**

Lever 1: Reduce CAC

Method 1: Improve conversion (same spend, more customers)
- Current: £200K spend → 50 customers = £4K CAC
- Improve conversion 20% → 60 customers = £3.3K CAC
- Savings: £0.7K per customer × 50 = £35K/year

Method 2: Lower CAC channel (cheaper but same quality)
- Shift from paid ads (£4K CAC) to self-serve (£2K CAC)
- Savings: £2K per customer × 50 = £100K/year

Lever 2: Increase LTV

Method 1: Reduce churn
- Current: 2% churn → £5K LTV
- Improve to 1% churn → £10K LTV
- Improvement: +100% LTV

Method 2: Increase ARPU (price or expansion)
- Current: £1K ARPU
- Increase to £1.2K (price increase + expansion)
- Impact: +20% ARPU = +20% LTV

Method 3: Extend customer lifetime
- Better onboarding → longer time to value → lower early churn
- Cost: £5K onboarding program
- Benefit: 1% early churn reduction → £150K+ LTV improvement
- ROI: 30x

**CAC Payback Optimization**

Current: 5 month payback

Option A: Reduce CAC
- CAC: £4K → £3K (20% reduction)
- Payback: 5 months → 3.75 months
- Benefit: Recover investment faster, can reinvest sooner

Option B: Increase gross margin
- Gross margin: 80% → 85% (reduce COGS)
- Monthly gross profit: £800 → £850
- Payback: 5 months → 4.7 months
- Modest improvement

Option C: Increase ARPU
- ARPU: £1K → £1.2K
- Monthly gross profit: £800 → £960
- Payback: 5 months → 4.2 months
- Better than margin improvement

Best combo: Reduce CAC 10% + increase ARPU 10% + improve margin 2% = significant payback acceleration.

**Magic Number Improvement**

Current: Magic Number 0.75 (just healthy, want 1.0+)

Method 1: Improve sales efficiency (revenue growth per S&M $)
- Increase conversion: 5% → 7% = 40% more customers
- Same spend → more revenue
- Magic number 0.75 → 1.05

Method 2: Reduce S&M spend (same revenue with less spend)
- Revenue growth: 20% (unchanged)
- S&M spend: £30K → £20K
- Magic number 0.75 → 1.33 (excellent)

Better: Combination
- Improve conversion 20% (more revenue)
- Optimize S&M spend 15% (less spend)
- Net: Magic number 0.75 → 1.38

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "financial-forecasting-modeling",
      "churn-analysis-retention-improvement",
      "expansion-revenue-and-upsell-strategy"
    ],
    faq: [
      {
        q: "What is growth accounting?",
        a: "Growth accounting breaks down your month-over-month growth into components: New MRR (new customers), Expansion MRR (upsells), and Churn MRR (cancellations). Formula: MRR(t) = MRR(t-1) + New - Churn + Expansion. Example: 20% growth might be 25% new customers, +5% expansion, -2% churn. Tells you where growth is coming from and sustainability."
      },
      {
        q: "What is a good payback period?",
        a: "Target: <12 months (recover CAC within first year). Healthy: <6 months. Excellent: <3 months. Formula: CAC / monthly gross profit per customer. Example: £4K CAC ÷ £800 monthly gross profit = 5 month payback. Shorter payback = faster reinvestment in growth, more sustainable."
      },
      {
        q: "What is the Magic Number?",
        a: "Measures growth efficiency: (Revenue growth this quarter) × 4 / S&M spend last quarter. Target: >0.75 (healthy), >1.0 (excellent), >2.0 (outstanding). Example: Q1→Q2 revenue growth £20K, Q1 S&M spend £30K → Magic = (20K × 4) / 30K = 2.67 (excellent). Shows how much revenue growth each £1 of S&M spending generates."
      },
      {
        q: "Why analyze unit economics by cohort?",
        a: "Reveals trends: Are recent cohorts better or worse than old ones? Example: Jan cohort LTV £60K, Apr cohort LTV £48K = quality declining (investigate acquisition source, pricing, product). Shows if improvements (onboarding, pricing, product) are working. Compare retention curves to identify when issues started."
      }
    ],
    videoUrl: ""
  }
];

export default batch159Articles;
