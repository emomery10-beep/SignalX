import { AcademyArticle } from "@/types/academy";

export const batch86Articles: AcademyArticle[] = [
  {
    slug: "unit-economics-deep-dive",
    title: "Unit Economics Deep Dive: Understanding the Fundamental Economics of Your Business",
    description: "Master unit economics: CAC, LTV, payback period, and how they interact. Unit economics determine if your business model is viable.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "unit economics",
      "CAC",
      "LTV",
      "payback period",
      "unit profitability",
      "customer economics",
      "business model",
      "profitability analysis",
      "unit margin",
      "cohort economics"
    ],
    keyTakeaways: [
      "Unit economics = CAC, LTV, payback, margin per customer; example: CAC £1.5K, LTV £7K, payback 9 months, gross margin 70% per customer; LTV/CAC = 4.67x (healthy); if any metric is broken (LTV/CAC <2x), business model is broken; unit economics must be positive before scaling (spending £1.5K to acquire customer worth £7K doesn't scale if churn is high)",
      "Calculate unit economics by cohort (customers acquired in same month) to isolate true economics from aggregate blends; example: January 2025 cohort CAC £1.5K, month 12 LTV £4K (due to 4% churn, lower than expected), payback 18 months = marginal economics; February cohort CAC £1.5K, month 12 LTV £8K = healthy economics (lower churn), suggests product improvements working",
      "Unit economics determines scalability: If unit economics positive (LTV/CAC >3x), you can spend more acquiring customers (compound growth); if negative or marginal, you cannot scale (you lose money on each customer, losses compound). Most failed SaaS spent billions acquiring customers with broken unit economics (chasing growth without fixing profitability)"
    ],
    content: [
      {
        heading: "What Are Unit Economics?",
        body: `Unit economics measures the profitability of acquiring and serving a single customer.

**The Unit Economics Framework**

Key metrics:

1. **CAC (Customer Acquisition Cost)**: How much you spend to acquire a customer
2. **LTV (Customer Lifetime Value)**: Total profit from a customer over their lifetime
3. **Payback Period**: Months to recover CAC through customer revenue
4. **Gross Margin**: % of revenue left after COGS
5. **LTV/CAC Ratio**: Profit per acquisition dollar spent

These five metrics tell you everything about whether your business model works.

**Unit Economics Example**

Customer profile: Mid-market SaaS customer

Acquisition:
- Marketing spend to acquire: £500
- Sales spend to acquire: £800
- Implementation/onboarding: £200
- **Total CAC: £1,500**

Revenue:
- Monthly revenue: £300
- Annual contract: £3,600
- Gross margin: 70%
- Gross contribution per month: £210

Retention:
- Monthly churn: 2%
- Expected lifetime: 50 months (1 ÷ 0.02)
- LTV: (£300 × 0.70) ÷ 0.02 = £10,500

Payback:
- CAC ÷ (Monthly revenue × GM) = £1,500 ÷ £210 = 7.1 months

Profitability:
- LTV/CAC = £10,500 ÷ £1,500 = 7x
- Profit per customer: £10,500 − £1,500 = £9,000

**Assessment: Excellent unit economics**
- Payback <12 months (profitable within first year)
- LTV/CAC >5x (very healthy)
- High profit per customer (£9K)

This customer is highly profitable and the business model scales.

**Unit Economics Red Flags**

Red flag 1: LTV/CAC <2x
- Example: CAC £2K, LTV £3K
- You barely make money per customer
- If churn increases slightly, becomes unprofitable
- Can't invest in growth (no margin for error)

Red flag 2: Payback >18 months
- Example: CAC £2K, monthly contribution £100
- Payback: £2,000 ÷ £100 = 20 months
- Customer must stay >20 months to break even
- High churn (>5%) makes this impossible

Red flag 3: Declining LTV
- Example: Year 1 LTV £5K, Year 2 LTV £3K
- Churn increasing or expansion decreasing
- If LTV drops below 2x CAC, business breaks

Red flag 4: CAC increasing faster than LTV
- Example: CAC £1.5K → £2K (+33%), LTV flat
- Sales/marketing efficiency declining
- Can't scale profitably

**Cohort-Based Unit Economics**

Best way to analyze unit economics: by cohort (customers acquired in same month/quarter).

Cohort example:

January 2025 cohort (100 customers acquired):

| Metric | Value | Status |
|--------|-------|--------|
| CAC | £1,500 | Standard |
| Month 1 revenue | £300/customer | — |
| Month 6 LTV | £1,800 (assuming 2% churn, 50% still active) | — |
| Month 12 LTV | £3,500 | Marginal (3.5x still paying) |
| Month 24 LTV | £5,200 | Healthy (5.2x at 2-year mark) |
| LTV/CAC at month 12 | 3.5 ÷ 1.5 = 2.33x | Acceptable |
| Payback period | 5 months to initial recovery, but payback usually longer in unit economics | 10 months |

Assessment: Acceptable unit economics (2.33x ratio), but requires 10-month payback.

Compare to February 2025 cohort:

| Metric | January cohort | February cohort |
|--------|----------|----------|
| CAC | £1,500 | £1,400 (improved) |
| Month 12 churn | 24% (2% monthly) | 18% (1.5% monthly, lower) |
| Month 12 LTV | £5,200 | £7,000 (higher due to better retention) |
| LTV/CAC | 3.47x | 5.0x (much better) |
| Payback | 10 months | 7 months (faster) |

Insight: February cohort has better unit economics (lower churn, faster payback). Suggests product improvements or better customer fit.

**Unit Economics Levers**

To improve unit economics, you can:

1. **Reduce CAC** (spend less to acquire)
   - More efficient marketing (lower spend, same customers)
   - Better targeting (higher conversion rate)
   - Product-led growth (organic channel)
   - Impact: 20% CAC reduction = 20% unit economics improvement

2. **Increase LTV** (customer more valuable)
   - Reduce churn (customer lasts longer)
   - Increase expansion (upsells, seat growth)
   - Increase ACV (raise prices)
   - Impact: 20% LTV increase = 20% unit economics improvement

3. **Improve payback** (recover CAC faster)
   - Lower CAC (less to recover)
   - Increase monthly revenue (faster recovery)
   - Improve onboarding (faster to value)
   - Impact: 3-month faster payback = can reinvest profits faster

**Scaling and Unit Economics**

Unit economics determine scalability:

**Positive unit economics (LTV/CAC >3x):**
- Can spend more on acquisition
- Profitable growth (compound effect)
- Example: Spend £10M acquiring customers with LTV £30M
- Lifetime profit: £20M (pays for itself)

**Marginal unit economics (LTV/CAC 1-2x):**
- Limited scaling ability
- Can grow but with thin margins
- Example: Spend £10M, LTV £15M
- Lifetime profit: £5M (pays for itself, but barely)

**Broken unit economics (LTV/CAC <1x):**
- Cannot scale
- Losing money on every customer
- Must fix before scaling
- Example: Spend £10M, LTV £5M
- Lifetime loss: £5M (loses money)

Most SaaS failures: Founded with broken unit economics, founders raised money and scaled, losses compounded.

Correct approach: Prove unit economics work, then scale with confidence.
`
      },
      {
        heading: "Advanced Unit Economics Concepts",
        body: `Beyond basic metrics: cohort curves, benchmarking, and optimization.

**LTV Curve Analysis**

Track LTV as it develops over customer lifetime:

January 2025 cohort LTV progression:

| Month | Churn to date | Customers remaining | Cumulative revenue | Cumulative profit | LTV |
|-------|----------|----------|----------|----------|------|
| 1 | 2% | 98 | £29.4K | £20.6K | £210 |
| 3 | 5% | 95 | £88.2K | £61.7K | £649 |
| 6 | 11% | 89 | £176.4K | £123.5K | £1,388 |
| 12 | 22% | 78 | £352.8K | £247.0K | £3,167 |
| 24 | 38% | 62 | £705.6K | £494.0K | £7,968 |

LTV grows over time (new customers stay longer, contribute more).

At month 1: LTV only £210 (looks bad)
At month 12: LTV £3,167 (3x better)
At month 24: LTV £7,968 (35x better than month 1)

This shows: Early months underestimate true LTV. Must wait 12+ months to measure real LTV.

**Benchmarking Unit Economics**

Compare your unit economics to industry benchmarks:

| Model | Typical CAC | Typical LTV | LTV/CAC |
|-------|----------|----------|---------|
| Self-serve SaaS | £500-1K | £5K-10K | 5-10x |
| Product-led SaaS | £200-500 | £3K-8K | 6-15x |
| SMB sales-led | £1K-2K | £3K-6K | 2-4x |
| Mid-market sales-led | £5K-15K | £20K-50K | 3-5x |
| Enterprise sales | £20K-50K | £100K-500K | 3-8x |

Your unit economics: CAC £1.5K, LTV £10.5K = 7x
Benchmark: Mid-market sales-led = 3-5x
Assessment: You're outperforming benchmark (7x vs. 3-5x)

This means your business model is more efficient than typical, giving competitive advantage.

**Scenario Analysis**

What if key metrics change?

Base case:
- CAC £1.5K, LTV £10.5K, LTV/CAC 7x

Scenario 1: Market downturn (churn increases 2%)
- Churn: 2% → 4%/month
- LTV: £10.5K → £5.25K (cut in half)
- LTV/CAC: 7x → 3.5x (still acceptable but risky)

Scenario 2: Pricing increase (10%)
- Monthly revenue: £300 → £330
- LTV: £10.5K → £11.55K (+10%)
- LTV/CAC: 7x → 7.7x (slight improvement, if no churn from price increase)

Scenario 3: New competitor (CAC increases 25%)
- CAC: £1.5K → £1.875K
- LTV: £10.5K (unchanged)
- LTV/CAC: 7x → 5.6x (worse, but still healthy)

These scenarios help you understand business resilience.

**Unit Economics and Profitability Timeline**

Unit economics determine when you're profitable:

Company with positive unit economics:
- Year 1: Spend heavily, CAC payback, negative margin (−20%)
- Year 2: Revenue grows faster than CAC, approaching breakeven (−5%)
- Year 3: Profitability from operating leverage (+10%)

Company with broken unit economics:
- Year 1: Spend heavily, LTV/CAC <1x (−50%)
- Year 2: Revenue grows, but CAC burden increases (−60%)
- Year 3: Losses accelerate (−70%), company fails

The difference: Unit economics.

Most VCs prioritize unit economics over growth (because broken economics can never be fixed by scaling).
`
      }
    ],
    relatedSlugs: [
      "customer-acquisition-cost-optimization",
      "customer-lifetime-value-ltv-calculation",
      "payback-period-cac-calculation",
      "profitability-mechanics",
      "gross-margin-expansion"
    ],
    faq: [
      {
        q: "What's the most important unit economics metric?",
        a: "LTV/CAC ratio. If >3x, business scales. If <2x, business is marginal. <1x, business loses money. Everything else flows from this ratio."
      },
      {
        q: "When should I measure unit economics?",
        a: "Month 12 at earliest (gives time for churn to develop). Better: Month 24 (true LTV picture). Calculate by cohort, not blended."
      },
      {
        q: "Can I improve unit economics after launch?",
        a: "Yes. Reduce CAC (more efficient marketing), reduce churn (retention features), increase ACV (upsells). All levers are available before scaling."
      },
      {
        q: "Should I scale if unit economics are marginal?",
        a: "No. Fix unit economics first (get LTV/CAC to 3x+), then scale. Scaling with broken unit economics = losses compound."
      }
    ],
    videoUrl: ""
  }
];

export default batch86Articles;
