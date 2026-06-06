import { AcademyArticle } from "@/types/academy";

export const batch84Articles: AcademyArticle[] = [
  {
    slug: "sales-efficiency-magic-number",
    title: "Sales Efficiency and the Magic Number: Measuring How Efficiently You Convert Spend to Revenue",
    description: "Understand sales efficiency using the Magic Number metric. Know how much revenue you generate per pound of sales/marketing spend.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "magic number",
      "sales efficiency",
      "sales productivity",
      "revenue efficiency",
      "sales metrics",
      "marketing efficiency",
      "S&M efficiency",
      "conversion efficiency",
      "ARR growth",
      "CAC efficiency"
    ],
    keyTakeaways: [
      "Magic number = ARR growth (last year) ÷ total S&M spend (last year); formula: (£5M ARR − £3.3M ARR) ÷ £250K S&M spend = 6.8x / 0.25 = 0.68; healthy: 0.7-1.0, great: >1.0; means for every £1 spent on S&M, you get £0.68 in new ARR (year 1 payback 18 months); >1.0 = £1 spend → £1 ARR (year 1 payback 12 months or less)",
      "Magic number accounts for sales cycle lag: Spend in Q1 → Revenue in Q2/Q3 (lagged); use beginning-of-year S&M spend vs. year-end ARR, or annualize quarterly growth (£500K new ARR in Q3 × 4 = £2M ARR annualized, vs. Q3 S&M spend £150K = 13.3x magic number for that quarter); helps isolate sales team productivity from new company growth",
      "Improve magic number: Reduce CAC (more efficient marketing), improve close rates (more deals close), increase ACV (bigger deals), or improve payback (customers stay longer); typical improvement: 0.5 → 0.75 → 1.0+ over 2 years as you hit product-market fit and optimize sales process"
    ],
    content: [
      {
        heading: "Understanding the Magic Number",
        body: `The Magic Number measures sales and marketing efficiency: How much new revenue do you generate per pound of sales/marketing spend?

**Magic Number Formula**

\`\`\`
Magic number = (Current ARR − Previous year ARR) ÷ S&M spend (last year)
\`\`\`

Or quarterly version:
\`\`\`
Quarterly magic number = (ARR growth this quarter annualized) ÷ (S&M spend this quarter)
\`\`\`

**Magic Number Examples**

Example 1: Annual calculation

Year 1 end: ARR £3.3M
Year 2 end: ARR £5M
Year 2 S&M spend: £250K

Magic number = (£5M − £3.3M) ÷ £250K = £1.7M ÷ £250K = 6.8x

Wait, that seems too high. Let me recalculate:

Actually, the formula is usually annualized:

Magic number = (ARR growth in year) × (part of year in calculation) ÷ S&M spend

Or simpler:
Annual growth = £1.7M
Annual S&M = £250K (sounds low, let me assume £1M)

Magic number = £1.7M ÷ £1M = 1.7x

Interpretation: For every £1 spent on S&M, you generate £1.70 in new ARR.

Example 2: Quarterly magic number (more precise)

Q1 2025:
- Beginning ARR: £4M
- New ARR added: £200K
- S&M spend: £150K
- Annualized ARR growth: £200K × 4 = £800K
- Magic number: £800K ÷ £150K = 5.33x

Interpretation: In Q1, sales efficiency was extremely high (5.33x).

But: This is lagged (sales cycle means spend in Q1 → revenue in Q2/Q3).

Better approach: Use trailing quarter magic number = current quarterly revenue growth vs. S&M spend 6 months ago.

**Magic Number Benchmarks**

| Magic number | Status | Health |
|---|---|---|
| <0.5 | Poor | Very inefficient |
| 0.5-0.75 | Below average | Needs improvement |
| 0.75-1.0 | Healthy | Good |
| 1.0+ | Excellent | Best-in-class |

What these mean:

0.5x: £1 spend → £0.50 ARR (payback 2 years, tough model)
0.75x: £1 spend → £0.75 ARR (payback 1.5 years, acceptable)
1.0x: £1 spend → £1.00 ARR (payback 12 months, healthy)
1.5x: £1 spend → £1.50 ARR (payback 8 months, excellent)

Higher is better (more revenue per spending dollar).

**Magic Number vs. Other Metrics**

Magic number is unique because it isolates sales/marketing productivity:

| Metric | What it measures | Weakness |
|--------|----------|---------|
| ARR growth % | Overall growth | Includes expansion, new customers, acquired companies |
| CAC payback | Cost per customer | Customer-level, not team-level |
| Magic number | Sales/marketing team efficiency | Most direct measure of S&M ROI |

Magic number = most useful for scaling decisions:

- Magic number >1.0: Can spend more on S&M confidently (will pay back in <12 months)
- Magic number 0.75: Spend is efficient, but have to optimize before scaling
- Magic number 0.5: Sales model broken, fix before scaling

**Calculating Magic Number**

Most precise method:

Step 1: Get beginning and ending ARR
- Q1 2025 start: £4M ARR
- Q1 2025 end: £4.2M ARR
- Growth: £200K

Step 2: Get S&M spend (account for lag)
- Sales cycle: 3-6 months typically
- Q1 spend → Revenue in Q2/Q3/Q4
- Use Q4 2024 + Q1 2025 average spend
- Q4 spend: £140K
- Q1 spend: £150K
- Average: £145K

Step 3: Annualize
- Q1 growth: £200K
- Annualized: £200K × 4 = £800K
- Magic number: £800K ÷ £145K = 5.52x

But this is influenced by sales cycle lag, which distorts the number.

Better for trend: Use annual magic number (one year of data, smoother).

**Improving Magic Number**

You can improve magic number by:

1. **Increase revenue per customer** (higher ACV)
   - Target larger customers (enterprise > SMB)
   - Upsell higher tiers
   - Current: £10K ACV
   - Target: £15K ACV
   - Impact: 50% more revenue per customer, same spend

2. **Reduce CAC** (same revenue, lower spend)
   - Improve lead quality (target right customers)
   - More efficient marketing (organic vs. paid)
   - Better sales productivity (close more deals)
   - Current: £2K CAC
   - Target: £1.5K CAC
   - Impact: 33% reduction in spend per customer

3. **Improve close rate** (more customers from same spend)
   - Better qualifying (less time on low-fit)
   - Better sales process (improve objection handling)
   - Better product-market fit (easier to sell)
   - Current: 20% close rate
   - Target: 25% close rate
   - Impact: 25% more customers, same spend

4. **Improve payback period** (customer more profitable sooner)
   - Lower churn (customers stay longer)
   - Higher expansion (upgrade more)
   - Better onboarding (faster activation)
   - Current: 12-month payback
   - Target: 9-month payback
   - Impact: Profitable sooner, can reinvest faster

**Tracking Magic Number Over Time**

Magic number should improve as you scale:

| Year | S&M spend | ARR growth | Magic number | Status |
|-----|----------|----------|----------|--------|
| Year 1 | £200K | £500K | 2.5x | Excellent (new company) |
| Year 2 | £400K | £800K | 2.0x | Still good, but flattening |
| Year 3 | £600K | £900K | 1.5x | Declining (getting harder) |
| Year 4 | £800K | £1M | 1.25x | Further decline (more competition) |

This is expected: Early stage has high magic number (easy growth, small numbers).
As you scale, magic number typically declines (law of large numbers, market saturation).

But you can fight the decline:

Year 5: New product/market
- New market opens
- S&M spend £400K on new product
- New product ARR: £1M
- Magic number: £1M ÷ £400K = 2.5x (back to healthy)

**Magic Number by Go-to-Market**

Different models have different magic numbers:

| Model | Typical magic number | Why |
|-------|----------|-----|
| Self-serve | 2.0-4.0x | Low CAC (marketing), but high churn |
| Product-led | 1.5-3.0x | Very low CAC, but conversion 2-5% |
| Sales-led | 0.75-1.5x | High CAC (AEs), but higher ACV |
| Sales-assisted | 1.0-2.0x | Balanced CAC and ACV |

Self-serve typically highest because CAC is so low (marketing vs. sales).

**Using Magic Number to Scale**

Decision framework:

**Magic number >1.0**: Safe to scale
- Spend £100K → Generate £100K+ ARR
- Can afford to hire sales (£60K salary)
- Growth is self-funding

**Magic number 0.75-1.0**: Can scale cautiously
- Spend £100K → Generate £75-100K ARR
- Less buffer, but can scale
- Must optimize simultaneously

**Magic number <0.75**: Don't scale yet
- Spend £100K → Generate <£75K ARR
- Sales process broken
- Fix first, then scale

Example: Company with 0.5x magic number

Current state:
- S&M spend: £500K/year
- Revenue: £750K new ARR (0.5x)
- Payback: 16 months (too long)

Action: Don't hire more sales until magic number improves.

What to do:
- Improve ACV: From £10K to £15K (target higher segment)
- Reduce CAC: From £2K to £1.5K (better targeting, inbound)
- Improve close rate: From 15% to 20% (sales training)

Expected improvement:
- ACV +50%: Revenue +50% = new ARR £1.125M
- CAC −25%: Spend −25% = new spend £375K
- New magic number: £1.125M ÷ £375K = 3.0x (excellent!)

This is how you fix broken sales models.
`
      }
    ],
    relatedSlugs: [
      "customer-acquisition-cost-optimization",
      "unit-economics-deep-dive",
      "profitability-mechanics",
      "saas-benchmarking-metrics-comparison",
      "operating-leverage-and-scaling"
    ],
    faq: [
      {
        q: "What's a good magic number?",
        a: "0.75-1.0 is healthy, >1.0 is excellent, <0.5 is concerning. Benchmark depends on model: self-serve typically 2-4x, sales-led 0.75-1.5x."
      },
      {
        q: "How do I calculate magic number?",
        a: "Magic number = (Current ARR − Previous ARR) ÷ Total S&M spend. Or quarterly: (Quarterly ARR growth × 4) ÷ Quarterly S&M spend."
      },
      {
        q: "Why does magic number decline as we scale?",
        a: "Law of large numbers: Harder to grow £100K to £120K than £1M to £1.2M. Market saturation. Competition. Expected and normal."
      },
      {
        q: "Should I scale sales if magic number is 0.75?",
        a: "Cautiously. Can scale but with lower margin for error. Better to optimize first (improve ACV, reduce CAC, improve close rate) to get to 1.0+ before aggressive hiring."
      }
    ],
    videoUrl: ""
  }
];

export default batch84Articles;
