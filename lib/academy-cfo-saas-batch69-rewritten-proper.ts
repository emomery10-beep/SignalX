import { AcademyArticle } from "@/types/academy";

export const batch69Articles: AcademyArticle[] = [
  {
    slug: "payback-period-cac-calculation",
    title: "Payback Period and CAC Calculation: When Do You Recover Customer Acquisition Costs?",
    description: "Calculate your customer acquisition cost (CAC) and payback period. Understand how long it takes to recover what you spend acquiring a customer.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer acquisition cost",
      "CAC",
      "payback period",
      "CAC payback",
      "unit economics",
      "customer unit economics",
      "acquisition efficiency",
      "sales efficiency",
      "revenue payback",
      "customer profitability"
    ],
    keyTakeaways: [
      "CAC payback period = months of gross margin revenue needed to recover acquisition spend; formula: CAC ÷ (average monthly revenue per customer × gross margin %); example: £1000 CAC, £200/month revenue, 70% GM = £1000 ÷ (£200 × 0.7) = 7.1 months; benchmark: <12 months healthy, <9 months excellent, >18 months risky; CAC payback drives business model viability",
      "Calculate CAC by channel separately: Marketing CAC (spend ÷ customers from ads), Sales CAC (AE salary + commission ÷ customers closed), Product CAC (free-tier conversion); example: £100K marketing spend ÷ 50 customers = £2K CAC from ads; £150K AE spend ÷ 100 customers = £1.5K CAC from sales; channel CAC varies 10-50x; allocate budget to lowest-CAC channels",
      "Payback period impacts cash flow and profitability: 6-month payback = positive cash contribution year 1; 12-month payback = breakeven by year 2; 18+ month payback = cash drain for years, requires high growth to offset; optimize by: reducing CAC (more efficient marketing), improving retention (lower churn), increasing ACV (upsell), or improving GM (lower COGS); each lever impacts payback differently"
    ],
    content: [
      {
        heading: "Understanding CAC and Payback Period",
        body: `Customer acquisition cost (CAC) is how much you spend to acquire one customer. Payback period is how long it takes to recover that cost through the customer's revenue.

**CAC Definition**

CAC is the total cost to acquire a customer, including:
- Sales team salary + commission
- Marketing spend (ads, content, events)
- Tools and software
- Support and onboarding (sometimes included)

Formula:
\`\`\`
CAC = Total acquisition spend ÷ Number of customers acquired
\`\`\`

Example: You spend £500K annually on sales and marketing. You acquire 200 customers. CAC = £500K ÷ 200 = £2,500 per customer.

**Payback Period Definition**

Payback period is the number of months until you recover your CAC investment. It accounts for gross margin (the revenue left after COGS).

Formula:
\`\`\`
Payback period (months) = CAC ÷ (Average monthly revenue per customer × Gross margin %)
\`\`\`

Example:
- CAC: £2,500
- Average monthly recurring revenue per customer: £500
- Gross margin: 70%
- Gross margin contribution per month: £500 × 70% = £350
- Payback period: £2,500 ÷ £350 = 7.1 months

You break even on that customer acquisition in 7 months.

**Why Payback Period Matters**

Payback period drives business model viability and cash flow:

1. **Cash flow impact**: If payback is 6 months, you're cash-positive after month 6 on that customer. If payback is 18 months, you're burning cash for a year and a half.

2. **Profitability**: Payback <12 months = healthy. Payback 12-18 months = acceptable. Payback >18 months = risky (requires high growth to offset).

3. **Growth viability**: Payback of 24 months means you need 2x ARR growth to break even year 1. That's hard to sustain.

Example:
- Company A: £2M ARR, payback 8 months
  - Acquires £500K in new customers by month 8
  - Gross margin contribution: £500K × 70% = £350K
  - Payback period costs recovered: £350K ÷ £2M = 17.5% of ARR payback
  - Remaining for operation: £2M − £350K = £1.65M for R&D, S&M, G&A
  - Scalable business model

- Company B: £2M ARR, payback 20 months
  - Acquires £500K in new customers by month 20
  - Gross margin contribution: £500K × 70% = £350K
  - Payback period costs recovered: £350K ÷ £2M = 17.5% of ARR payback (same)
  - But takes 20 months vs. 8 months = 2.5x longer to break even
  - Higher risk of cash runway issues

**Payback Period Benchmarks**

By business model:

| Model | Typical Payback | Why |
|-------|--------|-----|
| Self-serve SaaS | 4-8 months | Low CAC, fast adoption |
| SMB sales-led | 12-18 months | Moderate CAC, medium deal size |
| Mid-market/enterprise | 12-24 months | High CAC, long sales cycle, high ACV |
| PLG (product-led) | 3-6 months | Very low CAC |
| Strategic/land deals | 18-36 months | Massive CAC, long contract |

Healthy benchmarks by stage:

- Series A: 12-18 months acceptable (proving unit economics)
- Series B: <12 months expected (unit economics proven, efficient)
- Series C: <9 months required (mature, optimized)

If your payback is >18 months, you have a unit economics problem.
`
      },
      {
        heading: "Calculating CAC by Channel",
        body: `Different acquisition channels have different CACs. You must calculate CAC separately by channel to allocate budget efficiently.

**Marketing Channel CAC**

Formula: Marketing CAC = Marketing spend ÷ Customers acquired from marketing

Example breakdown:

| Channel | Monthly spend | Customers | CAC |
|---------|----------|-----------|-----|
| Google Ads | £10K | 20 | £500 |
| LinkedIn Ads | £8K | 10 | £800 |
| Content marketing | £5K | 15 | £333 |
| Events | £7K | 8 | £875 |
| **Total** | **£30K** | **53** | **£566 (blended)** |

CAC varies 2.5x across channels (£333 to £875). You should:
1. Increase spend on content marketing (lowest CAC)
2. Optimize or reduce events (highest CAC)
3. A/B test LinkedIn vs. Google to improve one

**Sales Channel CAC**

Formula: Sales CAC = Total sales spend ÷ Customers acquired by sales

Components of sales spend:
- Account executive (AE) salary
- Sales commission (typically 5-10% of ACV)
- Sales operations tools
- Sales enablement (training, content)
- Allocated management overhead

Example:

| Role | Annual cost |
|------|----------|
| 2 AEs (salary + commission) | £200K |
| Sales operations | £30K |
| Tools (CRM, etc.) | £15K |
| Management (20% of AE time) | £40K |
| **Total** | **£285K** |

If these 2 AEs close 100 customers per year:
Sales CAC = £285K ÷ 100 = £2,850 per customer

**Blended CAC**

Blended CAC combines all channels:

Example company:
- Marketing generated 100 customers (cost: £50K) = £500 CAC
- Sales generated 80 customers (cost: £240K) = £3,000 CAC
- Product/self-serve generated 120 customers (cost: £20K) = £167 CAC
- **Total**: 300 customers, £310K spend = **£1,033 blended CAC**

But breakdown matters:
- Self-serve CAC: £167 (2x more efficient than blended)
- Sales CAC: £3,000 (3x less efficient than blended)
- Marketing CAC: £500 (2x more efficient than blended)

If you only look at blended (£1,033), you miss that self-serve is your best channel. You should optimize self-serve further and consider reducing sales headcount if CAC is too high.

**CAC Payback by Channel**

Payback differs by channel, which affects profitability:

Example company with 70% gross margin:

| Channel | CAC | Monthly revenue per customer | Payback |
|---------|-----|-----|-----|
| Self-serve | £167 | £150 | 4.7 months |
| Marketing | £500 | £150 | 14.8 months |
| Sales | £3,000 | £300 (higher ACV) | 30.0 months |

The self-serve channel is highly profitable (payback 4.7 months). The sales channel has terrible payback (30 months) despite higher ACV. This suggests:
- Scale self-serve aggressively
- Sales channel only works if ACV is much higher than £300
- Or reduce sales CAC (smaller team, more efficient sales)

**CAC Payback Formula Rearranged**

To improve payback, you can:

1. **Reduce CAC**: Spend less on acquisition
   - More efficient marketing (organic, content)
   - Smaller sales team
   - Product-led growth (free tier driving conversions)

2. **Increase monthly revenue per customer**:
   - Increase ACV (higher pricing)
   - Upsell and cross-sell (expand revenue)
   - Target higher-value customers (enterprise vs. SMB)

3. **Improve gross margin**:
   - Negotiate better AWS costs
   - Optimize infrastructure (fewer servers)
   - Automation (lower support costs)

Example of improving payback from 14 months to 9 months:

Scenario A (current):
- CAC: £2,000
- Monthly revenue: £250
- Gross margin: 70%
- Payback: £2,000 ÷ (£250 × 0.70) = 11.4 months

Scenario B (reduce CAC 20%):
- CAC: £1,600 (more efficient marketing)
- Monthly revenue: £250
- Gross margin: 70%
- Payback: £1,600 ÷ (£250 × 0.70) = 9.1 months

Scenario C (increase ACV 20%):
- CAC: £2,000
- Monthly revenue: £300 (higher pricing)
- Gross margin: 70%
- Payback: £2,000 ÷ (£300 × 0.70) = 9.5 months

Scenario D (improve GM 5 points):
- CAC: £2,000
- Monthly revenue: £250
- Gross margin: 75% (better infrastructure)
- Payback: £2,000 ÷ (£250 × 0.75) = 10.7 months

Each lever independently gets you closer to 9 months. Combined improvements can get you there faster.
`
      },
      {
        heading: "CAC Payback and Business Model Sustainability",
        body: `CAC payback period determines whether your business model is sustainable. It affects cash flow, profitability, and growth potential.

**Cash Flow Impact**

Payback period determines when you see positive cash flow from a customer:

Example: £1M revenue goal

- **Payback 6 months**:
  - Acquire customers with 6-month payback
  - By month 6: First cohort cash-positive
  - By month 12: Can reinvest month 6 cohort profits into new acquisition
  - Monthly cohorts: Jan, Feb, Mar, Apr, May, Jun (6 cohorts active at once)
  - Cash-positive cycles quickly

- **Payback 18 months**:
  - By month 18: First cohort cash-positive
  - By month 24: Can reinvest month 6 cohort profits
  - Monthly cohorts: Jan, Feb, Mar...Jun (18 cohorts active)
  - Need 3x more capital to reach same revenue
  - Cash flow stretched

**Runway and Growth Relationship**

Runway × Payback period = Maximum growth rate you can sustain without additional funding

Example:

Company with:
- Burn rate: £50K/month
- Runway: 12 months (£600K in bank)
- CAC payback: 6 months
- Monthly acquisition: £50K (matching burn rate)
- Growth rate: (£50K acquisition × 0.7 GM ÷ current MRR) = depends on base

vs.

Company with:
- Burn rate: £50K/month
- Runway: 12 months
- CAC payback: 18 months
- Monthly acquisition: £50K (matching burn rate)
- Runway problem: Won't break even on early cohorts until month 18
- Growth is constrained (must burn cash longer)

A company with 6-month payback can be cash-flow positive at £10M ARR. A company with 18-month payback might still be burning cash at £10M ARR.

**Profitability at Scale**

Payback period determines margins at scale:

Example:

- **Company A (6-month payback, 70% GM)**:
  - £10M ARR
  - Annual acquisition: £10M × 0.2 (typical ratio) = £2M CAC spend
  - CAC payback: 6 months = £1M gross margin spent
  - Remaining for operations: £7M − £1M = £6M
  - Operating margin potential: 60% (highly profitable)

- **Company B (18-month payback, 70% GM)**:
  - £10M ARR
  - Annual acquisition: £10M × 0.2 = £2M CAC spend
  - CAC payback: 18 months = £3M gross margin spent (must amortize)
  - Remaining for operations: £7M − £3M = £4M
  - Operating margin potential: 40% (less profitable, more reinvestment needed)

Shorter payback = higher profit potential and cleaner business model.

**Growth Rate Sustainability**

Companies with long payback periods must grow faster to offset delayed profitability:

- Payback 6 months: Can grow 30% YoY profitably
- Payback 12 months: Need 50%+ YoY growth to stay profitable
- Payback 18 months: Need 80%+ YoY growth to stay profitable

Why? Because you're carrying more unpaid customer acquisition debt. You must grow faster to cover it.

**Risk and Payback**

Longer payback = higher business risk:

- **Short payback (6-8 months)**: Low risk
  - Quick return on investment
  - Forgiving of mistakes (fail fast, move on)
  - Sustainable with lower growth

- **Medium payback (12 months)**: Medium risk
  - Standard for sales-led SaaS
  - Need consistent growth to break even
  - Some runway risk if market slows

- **Long payback (18+ months)**: High risk
  - Requires sustained high growth
  - Major risk if market slows or churn increases
  - Difficult to achieve profitability
  - Common cause of SaaS failures (good growth, unsustainable unit economics)

**Optimizing Payback**

Prioritize improvements in this order:

1. **Reduce CAC first** (fastest impact, reduces acquisition risk)
   - Shift to lower-CAC channels (organic, content)
   - Improve sales process (close faster, higher win rate)
   - Reduce sales friction

2. **Increase ACV second** (higher risk, but sustainable)
   - Raise pricing (signal quality, may slow growth)
   - Target higher-value segments
   - Improve product-market fit first, then upsell

3. **Improve retention third** (indirect but important)
   - Lower churn = customers generate more lifetime revenue
   - Increases monthly revenue per customer over time
   - Improves payback (same acquisition cost, more revenue)

4. **Improve gross margin last** (incremental, requires operational maturity)
   - Negotiate better costs
   - Optimize infrastructure
   - Scale support efficiency

Most successful SaaS companies: Reduce CAC + increase ACV + improve retention = sub-12-month payback naturally.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-deep-dive",
      "customer-lifetime-value-ltv-calculation",
      "sales-efficiency-magic-number",
      "gross-margin-expansion",
      "churn-analysis-retention-improvement"
    ],
    faq: [
      {
        q: "What's a healthy CAC payback period?",
        a: "Under 12 months is healthy, under 9 months is excellent. Over 18 months is risky and indicates unit economics problems. Benchmark against your stage and industry."
      },
      {
        q: "How do I calculate CAC if I don't track acquisition costs by channel?",
        a: "Start simple: Total annual S&M spend ÷ total customers acquired = blended CAC. Then break down by channel (ads vs. sales vs. product) once you have tracking in place."
      },
      {
        q: "Does payback period account for churn?",
        a: "No, payback is gross margin recovery only. LTV (lifetime value) accounts for churn. A 12-month payback is only profitable if customer LTV is 3-5x CAC after accounting for churn."
      },
      {
        q: "Should I optimize for lower CAC or higher ACV?",
        a: "Start with reducing CAC (faster, less risky). Once payback is healthy, increase ACV through pricing and upsells. Both matter, but CAC reduction first."
      }
    ],
    videoUrl: ""
  }
];

export default batch69Articles;
