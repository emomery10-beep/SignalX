import { AcademyArticle } from "@/types/academy";

export const batch37Articles: AcademyArticle[] = [
  {
    slug: "magic-number-efficiency",
    title: "Magic Number & Sales Efficiency: Measuring Capital-Efficient Growth",
    description: "How to calculate and optimize the Magic Number to demonstrate efficient growth and attract investors.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "magic number",
      "sales efficiency",
      "growth efficiency",
      "S&M efficiency",
      "sales productivity",
      "CAC payback",
      "growth metrics",
      "capital efficiency",
      "operating leverage",
      "unit economics"
    ],
    keyTakeaways: [
      "Magic Number = (Current Quarter ARR - Prior Quarter ARR) × 4 ÷ Prior Quarter S&M spend; a Magic Number of 0.7+ is healthy, 1.0+ is excellent, <0.5 signals inefficient spend",
      "Magic Number tells investors how much new ARR you generate per £1 of sales/marketing spend; a company generating £1.40 new ARR per £1 spent (Magic Number 1.4) is highly efficient",
      "Track quarterly to monitor trends; Magic Number improving suggests optimization working, declining suggests CAC inflation or market saturation"
    ],
    content: [
      {
        heading: "Understanding the Magic Number Formula",
        body: `The Magic Number (also called Growth Efficiency, Sales Efficiency, or Payback Multiple) measures how efficiently you're converting sales and marketing spend into new ARR.

**Formula**:

Magic Number = (ARR_end_quarter - ARR_start_quarter) × 4 ÷ S&M Spend in Quarter

Breaking it down:
- (ARR_end - ARR_start): Net new ARR from the quarter
- × 4: Annualize the quarterly growth (quarter × 4 = annual equivalent)
- ÷ S&M spend: Divide by sales and marketing spend (salaries + campaigns)

Example calculation:

Quarter start ARR: £1M
Quarter end ARR: £1.1M
Quarterly net new ARR: £100K
S&M spend (salaries + marketing): £140K

Magic Number = (£1.1M - £1M) × 4 ÷ £140K
Magic Number = £100K × 4 ÷ £140K
Magic Number = £400K ÷ £140K
Magic Number = 2.86

Interpretation: For every £1 spent on S&M, you generate £2.86 in new ARR. That's efficient.

**Typical Magic Numbers by Company Stage**:

Series A (0.5-1.0):
- Company is investing in growth
- Spending more on S&M than they're growing ARR
- Example: Spend £500K/quarter, add £250-400K ARR = Magic Number 0.5-0.8
- This is acceptable for early growth phase

Series B (0.7-1.2):
- Company is scaling sales team
- Should be approaching or exceeding break-even on S&M spend
- Example: Spend £1M/quarter, add £700-1,200K ARR = Magic Number 0.7-1.2
- Target: 1.0+ (for every £1 spent, generate £1 in new ARR)

Series C+ (0.8-1.5):
- Company has mature sales engine
- Should be highly efficient (Magic Number close to 1.0 or better)
- Example: Spend £2M/quarter, add £1.6-3M ARR = Magic Number 0.8-1.5
- Companies with <0.7 are underperforming (either spend is high or growth is slow)

**Perfect vs. Imperfect Magic Numbers**:

High Magic Number (1.5+): Very efficient (rare)
- Generating £1.50+ of new ARR per £1 S&M spend
- Usually achieved by product-led growth (low-cost customer acquisition)
- Example: Spend £200K on marketing, add £400K ARR (product generates its own demand)

Magic Number 1.0: Break-even on S&M spend
- Generating £1 of new ARR per £1 S&M spend
- This is the inflection point (company becoming efficient)
- Example: Spend £1M, add £1M ARR (S&M spend pays for itself through growth)

Magic Number 0.75: Acceptable efficiency
- Generating £0.75 of new ARR per £1 S&M spend
- You're losing money on S&M spend in isolation (but accounts for payback period)
- Example: Spend £1M, add £750K ARR (need 18-month customer payback to break even)

Magic Number <0.5: Inefficient
- Generating <£0.50 of new ARR per £1 S&M spend
- Suggests either: (1) You're overspending on acquisition, (2) Growth is slowing
- Red flag for investors (spending without commensurate growth return)

**Magic Number vs. CAC Payback**:

Magic Number and CAC payback are related but different metrics.

Magic Number is macro (total S&M spend → total new ARR)
CAC payback is micro (cost per customer → revenue per customer)

Example:
- Total S&M spend: £1M
- New customers acquired: 50
- Average new customer ARR: £20K
- Total new ARR: £1M

Magic Number: (£1M) × 4 ÷ £1M = 4.0 (efficient!)

But per customer:
- CAC per customer: £1M ÷ 50 = £20K
- Customer ARR: £20K
- Payback: 12 months (CAC is immediately recovered, excellent)

In this case, Magic Number and CAC payback both show efficiency.

But consider:
- Total S&M spend: £1M
- New customers acquired: 50
- Average new customer ARR: £20K
- But customers have 50% annual churn
- Effective LTV: £20K × 2 years = £40K (accounting for churn)

CAC payback is 12 months (initial payback), but LTV:CAC is 2:1 (somewhat weak).

Magic Number is 4.0 (looks efficient), but if you account for churn, it's less attractive.

This is why Magic Number is useful (shows immediate growth efficiency) but must be paired with churn and retention metrics.`
      },
      {
        heading: "Improving Your Magic Number",
        body: `Most companies can improve Magic Number from 0.5-0.7 to 0.8-1.0 through focused optimization.

**Lever 1: Increase New ARR (Numerator)**

This is growth. Options:
- Improve sales execution (higher conversion rates)
- Increase sales team size
- Enter new markets or segments
- Raise prices (same customers, higher ARR)

Example:
- Current state: Spend £1M/quarter, add £600K ARR (Magic Number 0.6)
- Sales team improves: Win rate increases from 30% to 40% (16.7% improvement)
- New ARR: £600K × 1.167 = £700K
- New Magic Number: £700K ÷ £1M = 0.7 (improvement of 0.1 points)

This is hard work (requires sales execution improvement), but sustainable.

**Lever 2: Reduce S&M Spend (Denominator)**

Spend less while maintaining same growth:
- Shift from paid acquisition to organic/virality
- Reduce contractor spend
- Consolidate marketing tools
- Improve sales productivity (fewer people generating same revenue)

Example:
- Current state: Spend £1M/quarter (£700K salaries + £300K marketing), add £600K ARR (Magic Number 0.6)
- Reduce marketing spend to £200K (optimize campaigns): Saves £100K
- Keep salespeople, but improve productivity: Same £600K ARR
- New S&M spend: £700K + £200K = £900K
- New Magic Number: £600K ÷ £900K = 0.67 (improvement of 0.07 points)

This is immediate (can implement quarterly), but has limits (can't keep cutting indefinitely).

**Lever 3: Optimize Sales Efficiency**

Mix of improving per-customer economics:

Example:
- Current CAC: £20K per customer
- Current customer ARR: £40K
- Current payback: 6 months

Actions to improve:
1. Shift to higher-ACV customers (£60K vs. £40K): CAC stays £20K, payback improves
2. Reduce CAC through channel shift (product-led growth lower CAC): New CAC £12K, payback becomes 2.4 months
3. Improve gross margin: More gross profit available, effective CAC payback improves

These compounds to significant Magic Number improvement over quarters.

**Tracking Magic Number Trend**:

Monitor quarterly:

| Quarter | ARR Start | ARR End | New ARR | S&M Spend | Magic # |
|---------|----------|--------|---------|-----------|---------|
| Q1 2024 | £1M | £1.1M | £100K | £140K | 0.71 |
| Q2 2024 | £1.1M | £1.25M | £150K | £145K | 1.04 |
| Q3 2024 | £1.25M | £1.5M | £250K | £200K | 1.25 |
| Q4 2024 | £1.5M | £2.0M | £500K | £250K | 2.0 |

This company improved from 0.71 (Q1) to 2.0 (Q4). This shows:
- Sales team ramping (new hires producing)
- Efficiency improving (better processes)
- Market resonance (growing demand)

Investors would see this trajectory and be impressed (Magic Number improving dramatically).

**Common Magic Number Pitfalls**:

Pitfall 1: Including customer success in S&M spend
- Some companies include CS in S&M (inflates spend, lowers Magic Number)
- Standard: S&M = sales team salaries + marketing spend only
- Don't include: CS team, implementation, support (those are COGS or G&A)

Pitfall 2: Counting only new bookings, not new ARR
- New bookings: £1.5M (includes multi-year contracts upfront)
- Magic Number using bookings: Artificially inflated
- Standard: Use new ARR added (quarterly annualized), not gross bookings

Pitfall 3: Not accounting for seasonality
- Q4 (holiday season) might be down for B2B SaaS (budget freezes)
- Magic Number could look worse in Q4, even if year-round trend is good
- Solution: Compare quarters year-over-year (Q4 2024 vs. Q4 2023), not sequential

Pitfall 4: Confusing Magic Number with payback period
- Magic Number 0.7 doesn't mean 0.7-year payback
- Magic Number is annual efficiency metric
- CAC payback period is separate (often 12-18 months)
- They're related but different metrics

**Communicating Magic Number to Investors**:

Good:
- "Our Magic Number is 0.85 and improving. Q2 was 0.75, Q3 was 0.80. We're targeting 1.0 by Q4."
- "We spent £1M on sales and marketing and generated £850K in new ARR. That's capital-efficient growth at scale."

Poor:
- "Our Magic Number is 0.7." (No context, unclear if good or bad)
- "Our CAC is £20K." (Different metric, doesn't convey growth efficiency)

Context matters. Investors comparing companies use Magic Number to assess growth efficiency. A company with 0.85 Magic Number at £5M ARR is more impressive than 0.85 at £500K ARR (has achieved scale + efficiency).
`
      }
    ],
    relatedSlugs: [
      "unit-economics-saas",
      "cac-payback-period-optimization",
      "customer-acquisition-cost",
      "sales-efficiency-metrics",
      "growth-metrics-benchmarking"
    ],
    faq: [
      {
        q: "What's a good Magic Number target?",
        a: "Series A: 0.5-0.75. Series B: 0.75-1.0. Series C+: 0.8-1.2+. Anything >1.0 is excellent (generating more ARR than S&M spend). <0.5 is concerning."
      },
      {
        q: "Should I include customer success in S&M spend?",
        a: "No. S&M = sales team + marketing. CS team is separate (part of COGS or G&A). If you include CS, Magic Number is artificially low and not comparable."
      },
      {
        q: "How do you improve Magic Number quickly?",
        a: "Short-term: Reduce marketing spend (cut low-ROI channels). Long-term: Improve sales team productivity, shift to more efficient channels, optimize pricing."
      },
      {
        q: "What if my Magic Number is negative?",
        a: "This shouldn't happen. If you're adding negative ARR (customers churning faster than acquiring), you have deeper problems than Magic Number. Fix retention first."
      },
      {
        q: "How often should I calculate Magic Number?",
        a: "Quarterly minimum. Monthly if you're actively optimizing. Quarterly is standard and matches typical sales cycles."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "customer-segmentation-economics",
    title: "Customer Segmentation Economics: Analyzing Profitability and CAC by Segment",
    description: "How to segment customers by size/type, analyze economics by segment, and optimize GTM strategy based on segment profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer segmentation",
      "segment economics",
      "customer profitability",
      "CAC by segment",
      "LTV by segment",
      "segment analysis",
      "customer analysis",
      "go-to-market strategy",
      "pricing by segment",
      "segment targeting"
    ],
    keyTakeaways: [
      "Segment customers by revenue tier (enterprise/mid-market/SMB) and analyze CAC, LTV, payback by segment; typical finding: enterprise has highest LTV but longest payback, SMB has lower LTV but faster payback",
      "GTM strategy should follow segment profitability; if enterprise CAC is £30K for £100K LTV (3.3:1) and SMB CAC is £2K for £10K LTV (5:1), SMB is more efficient despite lower absolute LTV",
      "Most companies start with one segment (often wherever founder had network), then expand; systematic segmentation analysis reveals where to invest next growth dollar"
    ],
    content: [
      {
        heading: "Defining and Analyzing Customer Segments",
        body: `Customer segmentation by size/type reveals different economics for different customer profiles.

**Common Segmentation Approaches**:

By Revenue Tier (most common for B2B SaaS):
- Enterprise: £50K+ ARR customer
- Mid-market: £10-50K ARR customer
- SMB: <£10K ARR customer

By Industry Vertical:
- Financial services
- Healthcare
- Retail
- Manufacturing
- Technology
- etc.

By Business Model:
- B2B2C (our customer is a platform)
- Direct B2B (our customer is the end user)
- Marketplace (varied business models)

By Geography:
- US
- EU
- APAC
- etc.

For most SaaS, start with Revenue Tier (size), then add Vertical for deeper analysis.

**Segment Economics Analysis**:

Track by segment:

| Metric | Enterprise | Mid-Market | SMB |
|--------|-----------|-----------|-----|
| # Customers | 5 | 30 | 200 |
| Avg ARR per Customer | £100K | £25K | £3K |
| Total Revenue | £500K | £750K | £600K |
| Gross Margin | 75% | 70% | 65% |
| CAC per Customer | £30K | £8K | £2K |
| Payback Period | 4.8 mo | 13.7 mo | 30.8 mo |
| LTV (2yr assumed) | £300K | £60K | £6K |
| LTV:CAC Ratio | 10:1 | 7.5:1 | 3:1 |
| Churn Rate (annual) | 5% | 12% | 25% |
| NRR | 130% | 110% | 100% |

This table reveals:

1. **Enterprise has best unit economics**
   - Highest LTV:CAC (10:1) and lowest payback (4.8 months)
   - Low churn (5%) and strong NRR (130%, expansion revenue)
   - But: Lowest customer count (5) means customer concentration risk

2. **Mid-Market is balanced**
   - Good unit economics (7.5:1 LTV:CAC)
   - Reasonable payback (13.7 months)
   - Moderate customer count (30) diversifies risk

3. **SMB is high-volume, lower margin**
   - Lowest CAC (£2K, easiest to acquire)
   - But also lowest LTV (£6K)
   - Long payback (30.8 months) ties up capital
   - Highest churn (25%) suggests product doesn't deliver sticky value

**Interpreting the Data**:

Naive interpretation: "Enterprise is best, focus all energy there."
- Problem: Only 5 customers, if any churn, massive revenue impact
- Scaling sales team to enterprise is slow (long sales cycles)

Better interpretation: Each segment has different role.

Enterprise: High-value, low-risk (in terms of unit economics), but slow to scale
Mid-Market: Sweet spot (balanced economics, reasonable scale)
SMB: High-volume but capital-intensive (long payback, high churn)

Strategic question: Where should you invest next growth dollar?

**Dollar of Revenue Allocation Analysis**:

If you have £1 to invest in growth, where does it generate best return?

Enterprise: £1 spent generates
- £1 × (10:1 LTV:CAC) ÷ 4.8 month payback = £2.5 return per month
- Per £1 of revenue added (£30K CAC ÷ £100K ARR = 0.30), get £100K LTV = £333 LTV per £1 revenue

Mid-Market: £1 spent generates
- £1 × (7.5:1 LTV:CAC) ÷ 13.7 month payback = £0.55 return per month
- Per £1 of revenue added (£8K CAC ÷ £25K ARR = 0.32), get £60K LTV = £187 LTV per £1 revenue

SMB: £1 spent generates
- £1 × (3:1 LTV:CAC) ÷ 30.8 month payback = £0.097 return per month
- Per £1 of revenue added (£2K CAC ÷ £3K ARR = 0.67), get £6K LTV = £9 LTV per £1 revenue

Enterprise returns £2.5/month per £1 invested, SMB returns £0.10/month. Enterprise is 25x more efficient.

This analysis suggests: Double down on enterprise.

But: Reality is more complex. Enterprise sales cycles are 6-12 months (high risk of deals slipping). SMB is immediate (close within 1 month). Enterprise requires specialized sales team (hiring challenge). SMB is self-serve (lower resource intensive).

A balanced portfolio approach:

Allocate sales budget:
- 50% to enterprise (best unit economics, willing to wait for deals)
- 40% to mid-market (good efficiency, reasonable scale)
- 10% to SMB (for volume and product-led growth viral loop)

By revenue:
- Enterprise: 45% of revenue (5 customers at £100K average)
- Mid-market: 40% of revenue (30 customers at £25K average)
- SMB: 15% of revenue (200 customers at £3K average)

Total: 235 customers, £1.85M revenue

This portfolio balance:
- Doesn't over-concentrate in enterprise
- Maintains healthy mix
- Allows test-and-learn (how much can you scale each segment?)

After 12 months of execution, re-analyze. If enterprise is performing better (faster ramp, better retention), shift allocation 60% enterprise, 30% mid-market, 10% SMB. If SMB is over-delivering (lower CAC than expected, better product-market fit), shift upward.

The discipline of segmentation analysis allows dynamic reallocation based on real data.`
      }
    ],
    relatedSlugs: [
      "unit-economics-saas",
      "customer-lifetime-value-calculation",
      "cac-payback-period-optimization",
      "customer-acquisition-cost",
      "pricing-strategy-saas"
    ],
    faq: [
      {
        q: "What's the best way to segment customers?",
        a: "Start with revenue tier (enterprise/mid/SMB). Then add vertical (industry) for deeper analysis. By geography if international. Avoid over-segmentation (creates noise)."
      },
      {
        q: "Should I target the most profitable segment only?",
        a: "No. Best practice: 60-70% of investment in most profitable segment, 20-30% in secondary. Diversification reduces risk and allows discovery of emerging opportunities."
      },
      {
        q: "How do I calculate CAC by segment?",
        a: "Segment S&M spend by segment (track sales rep time, marketing campaign spend by target segment). Divide by segment new customers. Result: CAC by segment."
      },
      {
        q: "What if one segment has much higher CAC?",
        a: "Investigate: Is CAC justified by higher LTV? If enterprise CAC is 3x mid-market CAC but LTV is 10x higher, enterprise is worth higher CAC. If LTV is only 2x, consider deprioritizing."
      },
      {
        q: "How often should I re-analyze segment economics?",
        a: "Quarterly for companies <£5M ARR, semi-annually for larger. Segment economics shift with pricing changes, competition, product improvements. Keep analysis current."
      }
    ],
    videoUrl: ""
  }
];

export default batch37Articles;