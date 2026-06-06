import { AcademyArticle } from "@/types/academy";

export const batch131Articles: AcademyArticle[] = [
  {
    slug: "unit-economics-deep-dive-ltv-cac-payback",
    title: "Unit Economics Deep Dive: Understanding LTV, CAC, and Payback Period",
    description: "Master unit economics fundamentals. Calculate LTV and CAC accurately, understand payback period, and optimize for profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "unit economics",
      "LTV",
      "CAC",
      "lifetime value",
      "customer acquisition cost",
      "payback period",
      "CAC payback",
      "gross margin",
      "unit profitability",
      "economic model"
    ],
    keyTakeaways: [
      "LTV calculation: (ARPU × Gross margin %) × Customer lifetime months. Example: £100K annual ARPU × 80% margin = £80K annual profit per customer. If 3-year lifetime = 36 months = £20K monthly profit × 36 = £720K LTV. Or monthly: (£6.67K monthly ARPU × 80%) × (1 / 2% monthly churn) = £5.3K monthly × 50 months = £265K LTV.",
      "CAC calculation: Total sales & marketing spend / # new customers acquired. Example: £500K marketing spend, acquire 100 customers = £5K CAC per customer. CAC payback = months to recover CAC = CAC / (Monthly ARPU × Gross margin %). Example: £5K CAC / (£6.67K × 80%) = £5K / £5.3K = 0.94 months (very efficient).",
      "Unit economics benchmark: LTV/CAC >3x is breakeven acceptable, >5x is healthy, >10x is excellent. Payback <12 months is healthy, <6 months is excellent. Gross margin >70% for SaaS is standard. Example: £100K ARPU, 80% margin, £5K CAC, 3-year life = LTV £720K, LTV/CAC 144x, payback 1 month (exceptional)"
    ],
    content: [
      {
        heading: "Calculating Customer Acquisition Cost (CAC)",
        body: `CAC is how much you spend to acquire one customer.

**CAC Formula**

CAC = Total Sales & Marketing Spend / Number of New Customers Acquired

Example:

Month 1 S&M spend: £500K
- Sales team salaries: £200K
- Marketing spend: £200K
- Tools and overhead: £100K

New customers acquired: 100

CAC = £500K / 100 = £5K per customer

**Fully-Loaded CAC**

Simple CAC above only counts direct S&M. Fully-loaded includes overhead:

Direct S&M: £500K
Allocated overhead (office, management, etc.): £100K
Total: £600K

Fully-loaded CAC: £600K / 100 = £6K per customer

Most investors want fully-loaded CAC (more honest).

**CAC by Channel**

Different acquisition channels have different CACs:

Direct sales:
- Spend: Sales team salary + travel + tools
- CAC: £50K-£100K per enterprise deal

Inbound marketing:
- Spend: Content creation, SEO, tools
- CAC: £5K-£20K per customer

Product-led growth (self-serve):
- Spend: Product development + minimal marketing
- CAC: £1K-£5K per customer

Partnerships:
- Spend: Partnership team + revenue share
- CAC: £0-£5K (sometimes negative if partner pays you)

Channel mix affects blended CAC (average across all channels).

**Cohort CAC Analysis**

CAC varies by customer cohort:

| Cohort | Spend | Customers | CAC |
|--------|-------|-----------|-----|
| Q1 2024 | £500K | 100 | £5K |
| Q2 2024 | £600K | 150 | £4K |
| Q3 2024 | £700K | 175 | £4K |
| Q4 2024 | £800K | 160 | £5K |

Trends:
- Q2 CAC improved (more efficient, £4K vs £5K)
- Q4 CAC increased (less efficient, back to £5K)

Questions:
- Why did Q2 improve? More organic/word-of-mouth? Better targeting?
- Why did Q4 increase? Market saturation? Holiday seasonality? Increased competition?

Understanding CAC trends informs marketing strategy.

**CAC Payback Period**

How long to recover the CAC from customer revenue:

Formula: CAC / (Monthly ARPU × Gross Margin %)

Example:

CAC: £5K
Monthly ARPU: £8.3K (£100K annual)
Gross margin: 80%

CAC Payback = £5K / (£8.3K × 80%) = £5K / £6.64K = 0.75 months (about 3 weeks)

Interpretation: Takes 3 weeks of customer profit to recover acquisition cost.

After payback, customer profit is pure contribution to company (until churn).

**CAC Payback Benchmarks**

<3 months: Excellent (recover investment quickly)
3-6 months: Good (acceptable)
6-12 months: Acceptable (longer, but viable)
>12 months: Concerning (takes year to break even)

Example payback timelines:

Enterprise SaaS:
- CAC: £100K (expensive sales)
- Monthly ARPU: £15K, margin 80%
- Payback: £100K / £12K = 8.3 months (acceptable for enterprise)

SMB SaaS:
- CAC: £5K (marketing-driven)
- Monthly ARPU: £1K, margin 75%
- Payback: £5K / £0.75K = 6.7 months (acceptable)

Self-serve SaaS:
- CAC: £2K (low-touch)
- Monthly ARPU: £200, margin 80%
- Payback: £2K / £0.16K = 12.5 months (concerning, too long)

Self-serve typically needs lower CAC or higher ARPU to be viable.

**CAC and Growth Rate**

If growing fast (>50% YoM), higher CAC acceptable:
- Fast-growing company: 50% growth, 12-month CAC payback acceptable
- Slow-growing: 20% growth, >12-month payback is problem

Rule of thumb: If CAC payback < 12 months and growth >30%, acceptable.
If CAC payback > 12 months and growth <30%, concerning.

The payback needs to be short enough to recover before customer churn.

Example:

Company A: CAC payback 6 months, 40% growth
- Recover CAC fast
- Have 30 more months of profit (if 36-month customer lifetime)
- Healthy

Company B: CAC payback 18 months, 20% growth
- Take 18 months to recover CAC
- If customer lifetime 36 months, only 18 months of profit remains
- Marginal (barely break even when churn happens)

Company A more profitable per customer.
`
      },
      {
        heading: "Customer Lifetime Value Deep Dive",
        body: `LTV is the total profit you expect from a customer.

**LTV Calculation (Multiple Methods)**

Method 1: Simple

LTV = Annual ARPU × Customer Lifetime (years)

Example:
- Annual ARPU: £100K
- Customer lifetime: 3 years
- LTV: £100K × 3 = £300K

Simple but ignores margins and churn.

Method 2: With Gross Margin

LTV = (Annual ARPU × Gross Margin %) × Customer Lifetime (years)

Example:
- Annual ARPU: £100K
- Gross margin: 80%
- Annual profit: £80K
- Customer lifetime: 3 years
- LTV: £80K × 3 = £240K

Better (accounts for cost of delivery).

Method 3: With Churn (Most Accurate)

LTV = (Monthly ARPU × Gross Margin % × (1 / Monthly Churn Rate)

Example:
- Monthly ARPU: £8.3K
- Gross margin: 80%
- Monthly churn: 2%

LTV = (£8.3K × 80%) × (1 / 0.02)
= £6.64K × 50
= £332K

This accounts for actual churn (2% = 50-month lifetime).

**Why Method 3 is Most Accurate**

Assumes churn is constant each month.

If 2% monthly churn:
- Month 1: 100 customers remain
- Month 2: 98 customers (2% lost)
- Month 3: 96 customers (2% of 98)
- ...
- Month 50: ~37 customers remain

Revenue over 50 months (assuming flat ARPU):
- Sum = £8.3K × [100 + 98 + 96 + ... + 37]
- ≈ £8.3K × 3,700 customers-months
- ≈ £307K total revenue
- With 80% margin: £245K profit

(Slight difference from formula due to rounding, but close.)

**LTV Variation by Customer Segment**

LTV differs by customer type:

Enterprise customers:
- Higher ARPU: £200K annual
- Higher margin: 85% (less support needed)
- Lower churn: 1% monthly
- LTV: (£16.7K × 85%) × (1 / 0.01) = £14.2K × 100 = £1.42M

Mid-market:
- ARPU: £50K annual
- Margin: 80%
- Churn: 2%
- LTV: (£4.1K × 80%) × (1 / 0.02) = £3.28K × 50 = £164K

SMB:
- ARPU: £10K annual
- Margin: 75% (more support)
- Churn: 4% (less sticky)
- LTV: (£833 × 75%) × (1 / 0.04) = £625 × 25 = £15.6K

Enterprise customers worth 90x more than SMB (£1.42M vs £15.6K).

This is why enterprise sales teams can spend £100K+ on CAC.

**Net Revenue Retention (NRR) Impact**

If customers expand (NRR >100%), LTV increases:

Example:

Standard customer (flat ARPU):
- Monthly ARPU: £8.3K
- Grows 0% (flat)
- 3-year revenue: £299K

Expanding customer (NRR 110%):
- Month 1 ARPU: £8.3K
- Month 2 ARPU: £9.1K (10% expansion)
- Month 3 ARPU: £10K (10% more)
- ...continues growing

3-year revenue with NRR 110%: £450K+ (50% more!)

NRR is powerful LTV multiplier.

SaaS with NRR >120% generates massive LTV (expansion exceeds churn).

**Cohort LTV Tracking**

Track actual customer cohorts over time:

| Cohort | M1 Revenue | M12 Revenue | Implied LTV |
|--------|-----------|------------|------------|
| Jan 2023 | £830K (100 customers) | £520K (65 customers) | £312K/customer |
| Apr 2023 | £1M (120 customers) | £680K (80 customers) | £340K/customer |
| Jul 2023 | £1.25M (150 customers) | £900K (100 customers) | £360K/customer |

Trends:
- Newer cohorts have higher LTV (trending up)
- Year 1 retention improving (65% → 67%)
- ARPU stable (no expansion, but churn not worsening)

This is how you validate LTV assumptions against reality.
`
      },
      {
        heading: "LTV/CAC Ratio and Unit Economics Health",
        body: `The LTV/CAC ratio is the ultimate unit economics metric.

**LTV/CAC Ratio**

Formula: LTV / CAC

Example:

LTV: £240K
CAC: £5K

Ratio: 240 / 5 = 48x

Interpretation: For every £1 spent acquiring customer, you get £48 lifetime profit.

**Benchmarks**

<3x: Bad (losing money, barely break even)
3-5x: Acceptable (break even acceptable, typical for growth-stage)
5-10x: Good (solid unit economics)
>10x: Excellent (exceptional unit economics)

Why 3x minimum?

At 3x ratio:
- Spend £1K to acquire customer
- Get £3K LTV
- Profit: £2K per customer
- But need to cover overhead (not all profit goes to company)

At <3x ratio, hard to be profitable at scale.

**Improving Unit Economics**

To improve LTV/CAC ratio:

Increase LTV:
1. Increase ARPU (pricing, upselling)
2. Improve retention (reduce churn)
3. Improve NRR (expansion revenue)
4. Improve margins (reduce COGS)

Decrease CAC:
1. Improve conversion (better product, clearer messaging)
2. Leverage word-of-mouth (lower spend per customer)
3. Optimize channels (focus on lowest-CAC channels)
4. Improve sales efficiency (close faster, less touches)

Example improvement:

Current state:
- LTV: £240K
- CAC: £5K
- Ratio: 48x (already excellent)

Improvement areas:
- Increase ARPU 20% (pricing) → LTV £288K
- Reduce churn 0.5% → LTV £320K (cumulative)
- Reduce CAC 10% through efficiency → CAC £4.5K
- New ratio: £320K / £4.5K = 71x (20% improvement)

**Unit Economics by Business Model**

SaaS with annual contracts (upfront):
- High LTV (full-year collected)
- Low CAC per customer (leverage word-of-mouth)
- LTV/CAC: 10-50x typical

SaaS with monthly contracts:
- Lower LTV (customer leaves each month)
- Higher CAC (need more customers to replace churn)
- LTV/CAC: 3-10x typical

High-touch enterprise:
- Very high LTV (large deals, sticky)
- Very high CAC (expensive sales)
- LTV/CAC: 5-20x typical

Self-serve product-led:
- Low LTV (low-value customers)
- Very low CAC (self-serve, organic)
- LTV/CAC: 5-30x typical (efficient despite low LTV)

Different models have different ratios. Don't compare directly across models.

**Unit Economics and Growth Rate**

Investors care about unit economics AND growth:

Good: High growth + good unit economics
- 50% growth, 10x LTV/CAC
- Can scale profitably

Bad: High growth + poor unit economics
- 50% growth, 2x LTV/CAC
- Growing by losing money (unsustainable)

Acceptable: Lower growth + excellent unit economics
- 20% growth, 15x LTV/CAC
- Sustainable, can be profitable

Critical: Low growth + poor unit economics
- 10% growth, 2x LTV/CAC
- Nothing working, likely to fail

Best combination: High growth + good unit economics = valuable company.

**Unit Economics Dashboard**

Track monthly:

| Metric | Value | Target | Trend |
|--------|-------|--------|--------|
| CAC | £5K | £4.5K | ↑ (bad) |
| LTV | £240K | £260K | ↓ (bad) |
| LTV/CAC | 48x | 58x | ↓ (bad) |
| CAC payback | 0.75 mo | <1 mo | ↓ (bad) |
| Churn | 2% | <2% | ↑ (bad) |
| NRR | 105% | >110% | ↓ (bad) |

Trends show unit economics deteriorating:
- CAC increasing (less efficient acquisition)
- LTV decreasing (churn increasing, NRR decreasing)
- Both reducing LTV/CAC ratio

Action: Investigate root causes (are we acquiring wrong customers? is product changing? is market shifting?).

**Payback and Sustainability**

CAC payback matters for sustainability:

If payback <6 months:
- Recover investment fast
- Have plenty of time for profit before churn
- Can spend more on customer acquisition (leverage payback speed)

If payback 6-12 months:
- Recover investment slowly
- Limited profit window before churn
- Be careful not to over-spend

If payback >12 months:
- Recovery slow
- Risky if churn rate increases
- Likely unsustainable unless LTV very high

Rule: CAC payback should be <1/3 of customer lifetime.

If 36-month lifetime, payback should be <12 months (leaves 24 months profit).
If 24-month lifetime, payback should be <8 months (leaves 16 months profit).
If 12-month lifetime, payback should be <4 months (leaves 8 months profit).

This ensures enough profit window to cover overhead and reinvestment.
`
      },
      {
        heading: "Modeling Unit Economics Scenarios",
        body: `Build financial model to test unit economics scenarios.

**Base Case Model**

Build spreadsheet with unit economics:

| Metric | Value |
|--------|-------|
| **Customers & Revenue** | |
| New customers/month | 50 |
| Monthly churn | 2% |
| Monthly ARPU | £8.3K |
| **Costs** | |
| S&M spend/month | £500K |
| COGS % | 20% |
| Gross margin | 80% |
| **Unit Economics** | |
| CAC | £10K (£500K / 50) |
| LTV | £332K ((£8.3K × 80%) / 2%) |
| LTV/CAC | 33x |
| CAC payback | 0.6 months |

**Sensitivity Analysis**

Test how metrics change if variables shift:

Scenario: Churn increases to 3% (instead of 2%)

New LTV: (£8.3K × 80%) / 3% = £221K
New ratio: 221 / 10 = 22x (vs 33x base)

Churn increase reduces LTV 33% → Huge impact.

Scenario: CAC increases to £12K (less efficient)

LTV/CAC: £332K / £12K = 28x (vs 33x base)
Impact: Ratio decreases 15%

Scenario: Both churn +1% and CAC +£2K

New LTV: (£8.3K × 80%) / 3% = £221K
New CAC: £12K
New ratio: 221 / 12 = 18x (vs 33x base)

Combined: Ratio drops 45% (compound impact).

**Build Growth Model**

Model customer base over time:

| Month | Customers | Churn | New Cust | Revenue | S&M Spend | Profit |
|-------|-----------|-------|----------|---------|-----------|---------|
| 1 | 100 | 2 | 50 | 830K | 500K | 164K |
| 2 | 148 | 3 | 50 | 1,229K | 500K | 246K |
| 3 | 195 | 4 | 50 | 1,619K | 500K | 324K |
| 4 | 241 | 5 | 50 | 2,000K | 500K | 400K |
| 5 | 286 | 6 | 50 | 2,374K | 500K | 475K |
| 6 | 330 | 7 | 50 | 2,740K | 500K | 548K |

Shows:
- Customers growing (from 100 to 330 in 6 months)
- Revenue accelerating (£830K to £2.74M)
- Profit improving (£164K to £548K)
- Eventually achieves profitability (even with constant S&M spend)

This is the power of unit economics: Customer base compounds, coverage ratio grows, profit emerges.

**Test Improvement Scenarios**

Scenario: Improve CAC payback by 50% (more efficient acquisition)

From 0.6 months to 0.3 months
- Means CAC £5K instead of £10K
- Use same S&M budget (£500K) but acquire 100 customers instead of 50
- Double growth rate

6-month customer base (with 100/month new customers): 600 customers (vs 330)
6-month revenue: £4.98M (vs £2.74M)
6-month profit: £996K (vs £548K)

Improving CAC payback from 0.6 to 0.3 months could 2x growth in 6 months.

This shows why CAC payback is leverage point (small improvement = large impact).

**Monitor Unit Economics Over Time**

Track quarterly:

| Quarter | CAC | LTV | Ratio | Churn | NRR |
|---------|-----|-----|-------|-------|-----|
| Q1 2024 | £10K | £332K | 33x | 2% | 105% |
| Q2 2024 | £11K | £310K | 28x | 2.2% | 103% |
| Q3 2024 | £12K | £280K | 23x | 2.5% | 100% |
| Q4 2024 | £12K | £250K | 21x | 2.8% | 98% |

Concerning trend: Unit economics deteriorating
- CAC increasing (less efficient)
- LTV decreasing (churn increasing, NRR declining)
- Ratio declining 33x → 21x (36% drop in 1 year)

Action: Find root causes and fix before unit economics break.
`
      }
    ],
    relatedSlugs: [
      "customer-lifetime-value-calculation",
      "customer-acquisition-cost-optimization",
      "financial-forecasting-modeling",
      "saas-benchmarking-peer-comparison",
      "pricing-psychology-and-packaging"
    ],
    faq: [
      {
        q: "How do I calculate CAC (Customer Acquisition Cost)?",
        a: "Formula: Total S&M spend / # new customers acquired. Example: £500K spend, 100 customers = £5K CAC. Include fully-loaded costs (salaries, overhead). CAC varies by channel (direct sales expensive, self-serve cheap). Track by cohort to spot efficiency trends."
      },
      {
        q: "What's a good LTV/CAC ratio?",
        a: ">3x is minimum breakeven. 3-5x is typical growth-stage. 5-10x is good, >10x is excellent. Higher ratios allow more S&M spend per customer (sustainable growth). If <3x, unit economics weak (either raise LTV or lower CAC)."
      },
      {
        q: "How do I improve unit economics?",
        a: "Increase LTV: (1) Raise pricing/ARPU, (2) Reduce churn, (3) Improve NRR. Decrease CAC: (1) Improve conversion, (2) Leverage word-of-mouth, (3) Optimize best-performing channels. Focus on CAC payback <6 months (recover investment fast) and LTV/CAC >5x (healthy ratio)."
      },
      {
        q: "What's CAC payback period and why does it matter?",
        a: "Payback = CAC / (Monthly ARPU × Gross margin %). Example: £5K CAC / £5.3K monthly profit = 0.94 months. Shows how long to recover acquisition cost. <3 months excellent, 3-6 months good. Should be <1/3 of customer lifetime (if 36-month life, payback <12 months)."
      }
    ],
    videoUrl: ""
  }
];

export default batch131Articles;
