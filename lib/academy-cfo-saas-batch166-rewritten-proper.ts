import { AcademyArticle } from "@/types/academy";

export const batch166Articles: AcademyArticle[] = [
  {
    slug: "unit-economics-ltv-cac-payback",
    title: "Unit Economics: LTV, CAC, and Payback Period",
    description: "Master unit economics. Calculate LTV and CAC precisely, understand payback period, and use these metrics to drive profitability and growth decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 8,
    keywords: [
      "unit economics",
      "LTV",
      "CAC",
      "customer lifetime value",
      "customer acquisition cost",
      "payback period",
      "profitability",
      "customer economics",
      "revenue per customer",
      "acquisition efficiency"
    ],
    keyTakeaways: [
      "LTV calculation: Gross profit per customer ÷ churn rate. Formula: LTV = (ARPU × Gross Margin %) ÷ Monthly Churn %. Example: £100 ARPU, 80% gross margin, 2% churn = (£100 × 0.8) / 0.02 = £4,000 LTV. Alternatively: (ARPU - COGS) / churn = LTV. More accurate: Cohort-based LTV (track actual revenue customer generates over lifetime, typically 3-5 years for SaaS). Insight: Small churn changes = big LTV changes (2% vs 3% churn = 33% LTV drop).",
      "CAC calculation: Total S&M spend ÷ new customers acquired. Formula: CAC = (Sales + Marketing spend) / New customers. Example: £200K S&M / 50 new customers = £4K CAC. More precise: CAC by channel (organic vs paid, inbound vs outbound). Track CAC payback = CAC / monthly gross profit per customer. Example: £4K CAC, £80 monthly gross profit = 50 month payback (bad, ideally <12 months). Implication: Profitable CAC requires LTV > 3x CAC (£4K CAC needs £12K+ LTV).",
      "Healthy unit economics: LTV/CAC ratio 3x+ is healthy (break-even on customer value). CAC payback <12 months (ideally 4-6 months). Monthly contribution margin >0 by month 6-12 (after accounting for CAC). Example healthy: £4K CAC, £12K LTV (3x), 50/month revenue, £40 COGS = £10 monthly gross profit, 4 month payback, profitable month 5. Poor: £4K CAC, £3K LTV (0.75x) = never profitable on customer basis."
    ],
    content: [
      {
        heading: "Calculating Customer Lifetime Value (LTV)",
        body: `Understanding the total value each customer generates.

**LTV Simple Formula**

LTV = Gross Profit per Customer / Monthly Churn Rate

Where:
- Gross Profit per Customer = ARPU × Gross Margin %
- Monthly Churn Rate = % of customers lost monthly

Example:
- ARPU (Average Revenue Per User): £100/month
- Gross Margin: 80% (revenue - COGS)
- Gross profit per customer: £100 × 0.8 = £80/month
- Monthly churn: 2%
- LTV = £80 / 0.02 = £4,000

Interpretation: Each customer generates £4,000 in gross profit over lifetime.

**LTV Variations**

Cohort-based LTV (most accurate):
- Track actual revenue per customer over time
- Example: Jan 2024 customer acquired at £100/month
- Month 1: £100 revenue
- Month 2: £100 (no churn)
- Month 3: £100, then churn
- Total: £300 gross profit = that customer's LTV

Average cohort 12-month LTV:
- 100 customers, £3,000 avg total revenue per customer = £3,000 LTV
- More accurate than formula (accounts for expansion, churn patterns)

Segment-based LTV:
- Enterprise LTV different from SMB LTV
- Track by segment:
  - SMB: 3 months average, £800 LTV
  - Mid-market: 18 months average, £6,000 LTV
  - Enterprise: 4+ years, £50,000+ LTV

**LTV Sensitivity**

LTV heavily dependent on churn:

| Churn | Monthly GP | LTV | Impact |
|-------|------------|-----|--------|
| 1% | £80 | £8,000 | Excellent |
| 1.5% | £80 | £5,333 | Good |
| 2% | £80 | £4,000 | Healthy |
| 3% | £80 | £2,667 | Risky |
| 5% | £80 | £1,600 | Poor |

Insight: 2% to 3% churn = 33% LTV drop. Churn is critical.

**LTV with Expansion**

If customers expand (upsell, cross-sell), LTV increases.

Example without expansion:
- ARPU: £100 (flat)
- Monthly GP: £80
- Churn: 2%
- LTV: £4,000

Example with expansion (NRR 110%):
- Year 1 ARPU: £100, Year 2: £110, Year 3: £120
- Average ARPU over lifetime: £110
- Monthly GP: £88
- Churn: 2%
- LTV: £4,400 (10% improvement from expansion)

More expansion = higher LTV = more valuable per customer.

`
      },
      {
        heading: "Calculating Customer Acquisition Cost (CAC)",
        body: `Understanding what you spend to acquire customers.

**CAC Simple Formula**

CAC = Total S&M Spend / New Customers Acquired

Where:
- S&M Spend: Sales + Marketing budget
- New Customers: Number of new customers acquired

Example:
- Monthly S&M spend: £200K
- New customers acquired: 50
- CAC = £200K / 50 = £4,000 per customer

**CAC by Channel**

Different acquisition channels have different CAC:

| Channel | Spend | Customers | CAC |
|---------|-------|-----------|-----|
| Paid ads | £100K | 30 | £3,333 |
| Sales team | £80K | 15 | £5,333 |
| Content/organic | £20K | 5 | £4,000 |
| **Total** | **£200K** | **50** | **£4,000** |

Insight:
- Paid ads cheapest (£3.3K)
- Sales team expensive (£5.3K)
- Organic good value (£4K)

Strategy: Scale cheap channels (paid ads), de-prioritize expensive (sales).

**CAC Payback Period**

How many months until a customer pays back their acquisition cost.

Formula: CAC / Monthly Gross Profit Per Customer

Example:
- CAC: £4,000
- Monthly gross profit per customer: £80
- Payback: £4K / £80 = 50 months (4+ years!)

That's bad (customer needs 4 years to "pay for" their acquisition).

Better example:
- CAC: £2,000
- Monthly gross profit: £100
- Payback: £2K / £100 = 20 months (acceptable)

Healthy targets:
- Excellent: <6 months payback
- Good: 6-12 months payback
- Acceptable: 12-18 months payback
- Poor: >18 months payback

**CAC Fully Loaded**

Include all costs of acquiring customer:

Direct:
- Ad spend: £100K
- Sales salaries: £80K
- Tools (CRM, email, etc): £10K

Indirect:
- Marketing team overhead: £20K
- Sales management: £15K
- Finance/operations support: £5K

Fully loaded CAC: (£100K + £80K + £10K + £20K + £15K + £5K) / 50 = £6,000 per customer (vs £4K direct).

More realistic view of true acquisition cost.

`
      },
      {
        heading: "LTV/CAC Ratio and Profitability",
        body: `Understanding sustainable unit economics.

**LTV/CAC Ratio**

Ratio: LTV ÷ CAC

Example:
- LTV: £4,000
- CAC: £2,000
- Ratio: 2x (not healthy)

Healthy benchmarks:
- <1x: Unprofitable (customer doesn't generate value to cover acquisition)
- 1-2x: Poor (barely break even)
- 2-3x: Acceptable (profitable but thin)
- 3-5x: Good (healthy, can scale)
- 5x+: Excellent (very profitable, can invest heavily)

Example interpretations:

2x ratio:
- £2K CAC, £4K LTV
- Gross profit (£4K) just covers CAC cost
- No room for overhead, burning money on growth

3x ratio:
- £2K CAC, £6K LTV
- Gross profit (£6K) covers CAC (£2K) + overhead
- Sustainable model

5x ratio:
- £2K CAC, £10K LTV
- Gross profit (£10K) covers CAC + overhead + profit
- Very efficient, can scale aggressively

**Relationship Between CAC and LTV**

If you want 3x ratio (healthy):
- LTV target = 3 × CAC
- Example: If CAC is £3K, need LTV of £9K+

How to achieve 3x:

Option A: Reduce CAC (improve efficiency)
- Current: £3K CAC, £6K LTV = 2x
- New: £2K CAC, £6K LTV = 3x (reduce CAC 33%)
- How: Improve conversion, focus on cheap channel

Option B: Increase LTV (improve customer value)
- Current: £3K CAC, £6K LTV = 2x
- New: £3K CAC, £9K LTV = 3x (increase LTV 50%)
- How: Reduce churn, expand revenue per customer

Option C: Combination
- Reduce CAC 20% to £2.4K
- Increase LTV 25% to £7.5K
- New ratio: 3.1x

**Profitability Timeline**

Track month-by-month contribution margin:

| Month | Revenue | COGS | Gross Profit | CAC (1x) | Net Margin |
|-------|---------|------|--------------|----------|------------|
| 1 | £100 | £20 | £80 | -£2,000 | -£1,920 |
| 3 | £300 | £60 | £240 | -£2,000 | -£1,760 |
| 6 | £600 | £120 | £480 | -£2,000 | -£1,520 |
| 12 | £1,200 | £240 | £960 | -£2,000 | -£1,040 |
| 24 | £2,400 | £480 | £1,920 | -£2,000 | -£80 |
| 36 | £3,600 | £720 | £2,880 | -£2,000 | +£880 |

Insight:
- Month 1-23: Net negative (customer paying back CAC)
- Month 24-36: Positive (customer now profitable)
- At month 24: Cumulative gross profit £960 covers CAC (breakeven)

Payback = month when cumulative gross profit > CAC cost.

`
      },
      {
        heading: "Using Unit Economics for Decisions",
        body: `Applying metrics to drive strategy.

**Growth Decisions**

Question: Should we increase S&M spend by £100K?

Data:
- Current LTV/CAC: 3x (healthy)
- Current CAC: £2K
- New spend would reduce CAC to £1.8K (30% cheaper at higher volume)
- LTV stays £6K

Decision:
- New ratio: £6K / £1.8K = 3.3x (even healthier)
- Can acquire more customers profitably
- Action: Increase spending

vs Counter-example:
- Current LTV/CAC: 1.5x (poor)
- New spend wouldn't change LTV
- Ratio would stay 1.5x (unprofitable)
- Action: Don't spend more, fix unit economics first

**Retention Decisions**

Question: Should we invest £50K in customer success to reduce churn from 2% to 1%?

Data:
- Current LTV (2% churn): £4,000
- New LTV (1% churn): £8,000
- Increase in LTV: £4,000 per customer
- Customer base: 500 customers
- Total LTV improvement: 500 × £4,000 = £2M value

Decision:
- Cost: £50K
- Benefit: £2M LTV improvement
- ROI: 40x
- Action: Definitely invest

This is why retention is so valuable.

**Pricing Decisions**

Question: Should we increase price by 10%?

Data:
- Current ARPU: £100/month
- Current churn: 2%
- Current LTV: £4,000
- If price increases 10%, churn might increase to 3% (lose price-sensitive customers)

Scenarios:

Option A: Price up 10%, churn stays 2%
- New ARPU: £110
- New LTV: (£110 × 0.8) / 0.02 = £4,400
- Improvement: +10% LTV (£400 per customer)

Option B: Price up 10%, churn increases to 3%
- New ARPU: £110
- New LTV: (£110 × 0.8) / 0.03 = £2,933
- Decline: -27% LTV (catastrophic)

Decision:
- Test with subset of customers
- Measure churn impact
- If churn stays stable, raise price
- If churn increases significantly, don't

**Acquisition Channel Decisions**

Data:

| Channel | CAC | LTV | Ratio | Volume |
|---------|-----|-----|-------|--------|
| Paid ads | £3K | £6K | 2x | 30/month |
| Inbound | £1K | £6K | 6x | 10/month |
| Sales | £5K | £6K | 1.2x | 10/month |

Decision:
- Kill sales (1.2x unprofitable)
- Scale inbound (6x healthy, highest ROI)
- Keep paid ads for volume (2x acceptable)
- Action: Reallocate sales budget to inbound marketing

This transforms unit economics across company.

`
      }
    ],
    relatedSlugs: [
      "burn-rate-and-cash-runway-analysis",
      "growth-accounting-and-advanced-unit-economics",
      "pricing-strategy-and-price-optimization",
      "expansion-revenue-and-upsell-strategy",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "How do I calculate LTV?",
        a: "Formula: (ARPU × Gross Margin %) / Monthly Churn Rate. Example: £100 ARPU, 80% margin, 2% churn = (£100 × 0.8) / 0.02 = £4,000 LTV. Or track cohort-based: actual revenue per customer over lifetime (more accurate, accounts for expansion/churn patterns). Small churn changes = big LTV changes."
      },
      {
        q: "What's a good LTV/CAC ratio?",
        a: "Healthy: 3x+ (customer value is 3x acquisition cost). Good: 4-5x+. Excellent: 5x+. Below 3x is risky (barely profitable). Example: £2K CAC needs £6K+ LTV to be healthy. Use this to guide acquisition spending and pricing."
      },
      {
        q: "How do I improve unit economics?",
        a: "Three levers: (1) Reduce CAC (improve conversion, focus on cheap channels, 10-20% improvement typical), (2) Increase LTV (reduce churn, expand revenue per customer, 20-50% improvement common), (3) Improve gross margin (reduce COGS, 5-10% improvement). Best: Combination of all three."
      },
      {
        q: "What is CAC payback period and why does it matter?",
        a: "Payback = CAC / monthly gross profit. Example: £2K CAC ÷ £100 GP = 20 month payback. Target: <12 months (ideally 4-6 months). Long payback = risky (customer takes years to become profitable). Indicator of unit economics health. Shorter payback = can invest more in growth."
      }
    ],
    videoUrl: ""
  }
];

export default batch166Articles;
