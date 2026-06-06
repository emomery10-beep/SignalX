import { AcademyArticle } from "@/types/academy";

export const batch118Articles: AcademyArticle[] = [
  {
    slug: "burn-rate-and-cash-runway-analysis",
    title: "Burn Rate and Cash Runway: Predicting How Long Your Startup Can Survive",
    description: "Master burn rate analysis. Calculate runway, forecast cash depletion, and understand the metrics that determine how long your startup can operate.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "burn rate",
      "cash runway",
      "cash burn",
      "monthly burn",
      "runway calculation",
      "cash position",
      "operating expenses",
      "burn analysis",
      "cash forecasting",
      "survival metrics"
    ],
    keyTakeaways: [
      "Burn rate = (Beginning cash - Ending cash) / # months; example: Started with £10M, spent £2M in month 1, burn rate = £2M/month. Runway = Total cash / Monthly burn; £10M ÷ £2M/month = 5 months runway. But as you raise capital or reach profitability, runway extends. Track weekly burn (more accurate than monthly) for early-stage startups.",
      "Gross burn vs net burn: Gross = total monthly spend (salaries, servers, etc.); Net = gross burn minus revenue. Example: Gross £500K, revenue £100K, net burn £400K. Only net burn matters for runway calculation. If net burn negative (profitable), you never run out of cash. Most startups focus on delaying net burn becoming zero.",
      "Runway planning: <3 months = crisis (fundraise now!); 3-6 months = warning (have fundraise in progress); 6-12 months = normal (comfortable runway, can take risks); 12+ months = strong (time to experiment, no fundraise pressure). Each month of runway costs credibility with investors (they want £12+ months minimum). Unit economics: Cost per customer acquired vs revenue per customer (target LTV/CAC >3x to reach sustainable burn rate)"
    ],
    content: [
      {
        heading: "Understanding Burn Rate",
        body: `Burn rate is the speed at which your company spends cash each month. For early-stage startups, burn rate determines how long the company can operate before running out of money.

**Definition: Burn Rate**

Burn rate = Total monthly cash outflow

Three types:

1. Gross Burn Rate
- Total monthly operating expenses
- Includes all spend (payroll, servers, marketing, rent)
- Example: £500K/month
- Doesn't account for any revenue

2. Net Burn Rate
- Gross burn minus monthly recurring revenue
- Accounts for income
- Example: Gross £500K, revenue £150K = net burn £350K/month
- This is the REAL number that matters

3. Cash Runway
- Total cash divided by monthly burn rate
- How many months until zero cash
- Example: £5M cash, £350K net burn = 14.3 months runway

**Calculating Burn Rate**

Example startup:

Month 1:
- Starting cash: £10M
- Expenses (payroll, servers, marketing, rent): £500K
- Revenue: £100K
- Ending cash: £10M - £500K + £100K = £9.6M
- Gross burn: £500K
- Net burn: £400K

Month 2:
- Starting cash: £9.6M
- Expenses: £550K (scaled up team)
- Revenue: £150K (growing)
- Ending cash: £9.6M - £550K + £150K = £9.2M
- Gross burn: £550K
- Net burn: £400K

Month 3:
- Starting cash: £9.2M
- Expenses: £600K
- Revenue: £200K
- Ending cash: £8.8M
- Gross burn: £600K
- Net burn: £400K

Average burn (3 months): £400K net burn per month
Runway: £10M ÷ £400K = 25 months

But trajectory matters:
- If revenue growing 50% MoM and expenses flat, runway extends
- If revenue flat and expenses growing 10% MoM, runway contracts

**Weekly vs Monthly Burn**

Early-stage startups (pre-product market fit) should track weekly burn:
- Monthly averages hide big swings
- Weekly gives 4-5 data points per month
- Catch problems earlier

Example:

Week 1: £80K spend, £10K revenue, net £70K burn
Week 2: £90K spend, £12K revenue, net £78K burn
Week 3: £85K spend, £15K revenue, net £70K burn
Week 4: £95K spend, £20K revenue, net £75K burn

Monthly average: £73K net burn
Trend: Revenue growing, burn steady

If you only checked month-end, you'd miss the increasing revenue signal.

Track on spreadsheet or use tools (Baremetrics, Pilot, etc.).
`
      },
      {
        heading: "Runway Planning and Cash Management",
        body: `Runway determines how long you can operate. Most investors want to see £12+ months of runway before investing.

**Runway Categories**

Red Zone (<3 months runway):
- Company in crisis
- Must fundraise immediately or reduce burn drastically
- No room for error
- Investors will know you're desperate (bad negotiating position)

Yellow Zone (3-6 months runway):
- Comfortable 1-2 months, but fundraising should be underway
- If capital raise falls through, need backup plan
- Time to execute on plan

Green Zone (6-12 months runway):
- Healthy runway
- Can focus on business, not fundraising
- Time to improve unit economics
- Can afford to experiment

Strong Zone (12+ months runway):
- Excellent position
- Can take strategic risks
- Time to pivot if needed
- Investors love this (signal of unit economics)

**Extending Runway: Three Levers**

Lever 1: Reduce Burn

Cut expenses without damaging growth:
- Headcount: Largest expense for SaaS (typically 50-70% of burn)
- Go-to-market: Second largest (typically 20-30%)
- Infrastructure: Usually 5-15%

Example:
- Current burn: £500K/month
- Reduce headcount 20% (save £75K/month)
- Reduce marketing spend 30% (save £30K/month)
- Negotiate infrastructure costs (save £5K/month)
- New burn: £390K/month
- Runway extended from 25 months to 32 months

Risk: Growth may slow (customer acquisition down).

Lever 2: Increase Revenue

Accelerate revenue to reduce net burn:

Example:
- Gross burn: £500K/month (fixed)
- Current revenue: £100K/month (net burn £400K)
- Increase sales effort: Revenue to £300K/month (net burn £200K)
- Runway extends from 25 to 50 months

Focus areas:
- Sales team productivity (fewer, better sales people)
- Pricing optimization (increase ACV)
- Expansion revenue (existing customers expanding usage)

Lever 3: Raise Capital

Fundraise to extend runway:

Example:
- Current runway: 8 months
- Raise £3M Series A
- Monthly cash available: £10M + £3M = £13M
- New runway: 32.5 months

Timing matters:
- Start fundraising with 6-9 months of runway (don't appear desperate)
- Fundraising takes 3-4 months
- Land money before hitting red zone

**Cash Forecasting**

Simple monthly forecast template:

| Month | Revenue | Payroll | Marketing | Infrastructure | Other | Net Burn | Cumulative Cash |
|-------|---------|---------|-----------|-----------------|-------|----------|-----------------|
| M1 (Jan) | £100K | £300K | £100K | £30K | £50K | -£380K | £9.62M |
| M2 (Feb) | £150K | £320K | £100K | £35K | £50K | -£355K | £9.265M |
| M3 (Mar) | £200K | £350K | £120K | £40K | £60K | -£370K | £8.895M |
| M4 (Apr) | £250K | £400K | £150K | £45K | £70K | -£415K | £8.48M |
| M5 (May) | £300K | £450K | £150K | £50K | £80K | -£430K | £8.05M |

From this, calculate:
- Month when net burn becomes zero (profitability)
- Months of runway at current burn rate
- Cash position at each milestone (Series A close, IPO, etc.)

Update monthly as actual results come in.
`
      },
      {
        heading: "Unit Economics and Sustainable Burn",
        body: `Burn rate is only part of the story. Unit economics determine whether burn is "sustainable."

**Unit Economics Metrics**

Customer Acquisition Cost (CAC):
- Cost to acquire one customer
- Payback period: How many months to recover CAC from customer revenue
- Example: £5K CAC, £1K MRR per customer = 5-month payback

Example:
- Sales/marketing spend: £300K/month
- New customers acquired: 50
- CAC: £300K ÷ 50 = £6K per customer

Lifetime Value (LTV):
- Total revenue from customer over lifetime
- Example: £1K MRR × 24-month lifetime = £24K LTV
- LTV/CAC ratio: Should be >3x (ideally >5x)

Example:
- LTV: £24K (from above)
- CAC: £6K
- LTV/CAC: 4x (good)

This means for every £1 spent acquiring customer, you get £4 back.

**Sustainable Burn Calculation**

If LTV/CAC is healthy (>3x), burn is somewhat sustainable:

Example:
- Monthly new customers: 50
- LTV per customer: £24K
- Monthly revenue from new customers: £1K/month × 50 = £50K
- CAC per customer: £6K
- Cost to acquire 50 customers: £300K
- First-year gross profit from 50 new customers: (50 × £1K × 12) - (50 × £6K) = £600K - £300K = £300K

This shows that after accounting for customer acquisition, you generate positive margin by year 2.

**Burn Rate vs Growth Rate**

Best metric: Magic Number = (Month N Revenue - Month N-1 Revenue) / Sales & Marketing Spend from Month N-1

Example:
- Month 1 revenue: £100K
- Month 2 revenue: £150K
- Month 1 sales/marketing: £100K
- Magic number: (£150K - £100K) / £100K = 0.5x

Benchmark: >0.75x is efficient, >1.0x is very efficient

This shows how much incremental revenue you get for every £1 spent on sales/marketing.

**When Burn is a Problem**

Red flags:

1. Burn increasing month-over-month
- Growing expenses without growing revenue
- Example: £350K → £400K → £450K net burn
- Indicates inefficiency

2. LTV/CAC <2x
- Customers not profitable after acquisition cost
- Revenue won't cover customer acquisition

3. Runway <6 months with no clear path to profitability
- Ticking clock
- Limited time to improve unit economics

4. Cash consumption outpacing revenue growth
- Revenue growing 20% MoM
- Burn growing 30% MoM
- Unsustainable

**Burn Rate Targets by Stage**

Early stage (£0-1M ARR):
- Net burn: £50-200K/month typical
- Runway: 18-36 months expected (with funding)
- Focus: Achieve product-market fit

Growth stage (£1-10M ARR):
- Net burn: £200-500K/month typical
- Runway: 12-24 months expected
- Focus: Scale sales, reach profitability path

Late stage (£10M+ ARR):
- Net burn: Often profitable (positive cash flow)
- Runway: Infinite (self-sustaining)
- Focus: Optimize margins, plan exit

Investors expect:
- Early stage: High burn acceptable (investing in growth)
- Growth stage: Burn improving month-over-month
- Late stage: Clear path to profitability
`
      },
      {
        heading: "Burn Rate and Fundraising",
        body: `Burn rate is one of the most important metrics investors evaluate. It directly impacts valuation and negotiating power.

**What Investors Want to See**

Good signal:
- Burn rate stable or decreasing (expenses controlled)
- Revenue growing faster than burn increases
- Clear path to profitability or substantial revenue
- Cash runway >12 months

Bad signal:
- Burn rate increasing month-over-month (out of control)
- Revenue flat while burn growing (customer acquisition failing)
- Runway <6 months (desperation)
- No clear path to profitability

**Calculating Fundraise Needs**

Formula:
Funds needed = (Monthly net burn × Target months of runway) - Current cash on hand

Example:
- Current cash: £5M
- Monthly net burn: £400K
- Target runway after fundraise: 24 months (investor expectation)
- Funds needed: (£400K × 24) - £5M = £9.6M - £5M = £4.6M

So raise £5M Series A (round up for buffer).

**Burn Rate and Valuation**

Investors use burn rate to assess risk:

High burn (£1M+/month) = Higher risk = Lower valuation multiple
Low burn (£100K/month) = Lower risk = Higher valuation multiple

Example:
- Company A: £10M revenue, £500K net burn, 20 months runway → 8x revenue multiple = £80M valuation
- Company B: £10M revenue, £100K net burn, 100 months runway → 10x revenue multiple = £100M valuation

Same revenue, different burn → £20M difference in valuation.

Lesson: Improving burn rate directly increases company valuation.

**Runway Expectations by Funding Stage**

Seed stage: 12-18 months runway expected
Series A: 18-24 months runway expected (burn should be decreasing)
Series B: 24-36 months runway expected (path to profitability clear)
Series C+: Profitability or clear path (no more "runway" focus)

If you're raising Series B with 8 months of runway, investors will say "no" (too risky).

If you're raising Series B with 36 months of runway and improving unit economics, investors love it.

**After Fundraise: Spend vs Control**

Paradox: After raising capital, founders want to spend aggressively.

But investors track:
- Burn rate at close
- Burn rate today
- Is it increasing? Why?

Common mistakes:

Mistake 1: Raise £5M, immediately increase burn 2x
- Expected: Use capital to grow revenue
- Actual: Spend 2x more, revenue flat
- Result: New burn rate higher, next fundraise harder

Mistake 2: Raise capital, then "coast"
- Expected: Use capital to invest in growth
- Actual: Comfortable with capital, slow growth
- Result: Longer runway but slower scaling (missed opportunity)

Best practice:
- Raise capital
- Keep burn rate stable or decrease (improve efficiency)
- Invest selectively in highest-ROI channels
- Show disciplined growth (revenue accelerating faster than burn)
`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "cash-conversion-cycle",
      "funding-and-investment-strategy",
      "unit-economics-ltv-cac-payback",
      "board-reporting-investor-communications"
    ],
    faq: [
      {
        q: "What's a good monthly burn rate for a startup?",
        a: "Depends on stage and growth. Early-stage: £50-200K/month. Growth-stage: £200-500K/month. But more important than absolute burn is trend (decreasing) and runway (12+ months). Burn rate that extends runway to 24+ months is healthy."
      },
      {
        q: "How do I calculate runway?",
        a: "Runway = Total cash on hand ÷ Monthly net burn rate. Example: £10M cash ÷ £400K burn = 25 months. Update monthly as cash and burn change. When runway drops below 6 months, start serious fundraising."
      },
      {
        q: "What's the difference between gross and net burn?",
        a: "Gross burn = total monthly expenses (payroll, servers, marketing). Net burn = gross burn minus revenue. Only net burn matters for runway. If net burn is negative (revenue > expenses), you're profitable and never run out of cash."
      },
      {
        q: "How can I extend my runway without raising capital?",
        a: "Three levers: (1) Reduce burn (cut expenses, especially headcount), (2) Increase revenue (better sales, higher pricing), (3) Improve unit economics (CAC payback, LTV/CAC ratio). Focus on revenue growth first (better than cutting)."
      }
    ],
    videoUrl: ""
  }
];

export default batch118Articles;
