import { AcademyArticle } from "@/types/academy";

export const batch129Articles: AcademyArticle[] = [
  {
    slug: "saas-valuation-and-multiples",
    title: "SaaS Valuation and Multiples: Valuing Your Company and Understanding Market Benchmarks",
    description: "Master SaaS valuation. Understand how SaaS companies are valued, apply appropriate multiples, and benchmark your valuation.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "SaaS valuation",
      "valuation multiple",
      "revenue multiple",
      "ARR multiple",
      "company valuation",
      "enterprise value",
      "valuation benchmarks",
      "comparable companies",
      "DCF valuation",
      "valuation framework"
    ],
    keyTakeaways: [
      "SaaS valuation = Revenue × Multiple. Example: £10M ARR × 8x multiple = £80M valuation. Multiple depends on: growth (50% growth gets 10x, 20% gets 5x), profitability (profitable gets premium), churn (low churn gets premium), unit economics (LTV/CAC >5x gets premium). Formula: Base multiple 5x + 0.5 × growth % = simple estimate (5 + 0.5 × 50 = 30x for 50% growth is too high; real: 8-10x).",
      "Factors affecting multiples: (1) Growth rate (biggest factor), (2) Churn/retention (NRR >100% premium), (3) Unit economics (LTV/CAC ratio), (4) Profitability (path to profit matters), (5) Market (large TAM premium), (6) Concentration (low concentration premium). Example: High growth (50%), low churn, profitable = 12-15x. Slow growth (5%), high churn, unprofitable = 3-5x.",
      "Public SaaS multiples benchmark (Salesforce 6.9x, Zoom 11x, Slack ~2-3x, Atlassian 10x). Private earlier-stage typically 5-8x (pre-IPO). Seed-stage not typically valued on multiples (valued on potential, VC rounds). Use comparable companies to benchmark your valuation."
    ],
    content: [
      {
        heading: "Understanding SaaS Valuation",
        body: `SaaS companies are typically valued on revenue multiples, not earnings multiples.

**Why Revenue Multiples for SaaS?**

Traditional businesses valued on earnings:
- Manufacturing: 10-15x earnings
- Retail: 1-5x earnings

SaaS valued on revenue because:
1. Most SaaS are unprofitable (especially growth-stage), so can't use earnings multiples
2. Profitability is choice (spend on growth now, profit later)
3. Recurring revenue is asset (customer base worth multiple of annual revenue)
4. Growth rate is predictor of future profitability

Example:

Company: £10M revenue, -£5M EBITDA (unprofitable)
Can't use earnings multiple (negative earnings)
Use revenue multiple instead (8x revenue = £80M valuation)

**Revenue Multiple Framework**

Basic formula: Enterprise value = ARR × Multiple

Example:

£10M ARR × 8x = £80M enterprise value

Adjustment for cash/debt:
Enterprise value - Net debt = Equity value

Example:

Enterprise value: £80M
Less: Debt: £5M
Plus: Cash: £3M
Net debt: £2M
Equity value: £80M - £2M = £78M

**Factors Affecting Valuation Multiple**

Factor 1: Growth Rate (Biggest driver)

50%+ growth: 12-15x multiple
30-50% growth: 8-12x multiple
20-30% growth: 6-8x multiple
10-20% growth: 4-6x multiple
<10% growth: 2-4x multiple

Rule of thumb: "Rule of 40"
- If growth % + margin % > 40, premium multiple
- If sum < 40, discount multiple

Example:
- 50% growth, -10% margin (sum 40) = 8-10x
- 30% growth, 10% margin (sum 40) = 6-8x
- 50% growth, 10% margin (sum 60) = 12-15x (premium, exceeds 40)

Factor 2: Churn and Retention (NRR)

NRR >120%: Premium (strong expansion)
NRR 100-120%: Normal
NRR <100%: Discount (declining revenue)

Example multiple impact:
- 50% growth, 100% NRR = 10x multiple
- 50% growth, 120% NRR = 12x multiple (20% premium for expansion)

Factor 3: Unit Economics (LTV/CAC)

LTV/CAC >5x: Premium (very efficient)
LTV/CAC 3-5x: Normal
LTV/CAC <3x: Discount (inefficient)

Example:
- 40% growth, 6x LTV/CAC = 10x multiple
- 40% growth, 2x LTV/CAC = 6x multiple (discount for inefficiency)

Factor 4: Profitability and Path to Profit

Profitable (>10% margin): Premium
Near profitable (0-10% margin): Normal
Unprofitable, path to profit: Normal
Unprofitable, no path to profit: Discount

Example:
- 40% growth, unprofitable but 18-month path to profit = 8x
- 40% growth, unprofitable, no clear path = 5x

Factor 5: Market Size and TAM

Large TAM (>£10B): Premium
Medium TAM (£1-10B): Normal
Small TAM (<£1B): Discount

Example:
- 30% growth, large TAM = 8x
- 30% growth, small TAM = 5x

Factor 6: Customer Concentration

Top 3 customers <30% of revenue: Normal
Top 3 customers 30-50% of revenue: Slight discount
Top 3 customers >50% of revenue: Large discount (deal risk)

Example:
- 40% growth, <30% concentration = 8x
- 40% growth, >50% concentration = 5x

**SaaS Valuation Multiple Table**

| Metric | Value | Multiple |
|--------|-------|----------|
| Growth | 50% | +2x |
| NRR | 120% | +1x |
| LTV/CAC | 5x | +1x |
| Margin | 10% | +0.5x |
| TAM | Large | +1x |
| Concentration | <30% | +0.5x |
| **Base** | | **5x** |
| **Total** | | **~11x** |

Base 5x + premiums for strong metrics = 11x multiple.

Same company with weak metrics:
| Metric | Value | Multiple |
|--------|-------|----------|
| Growth | 20% | -1x |
| NRR | 95% | -1x |
| LTV/CAC | 2.5x | -1.5x |
| Margin | -10% | -1x |
| TAM | Small | -0.5x |
| Concentration | >50% | -1x |
| **Base** | | **5x** |
| **Total** | | **~0.5x** |

Same 20% growth, but all weak metrics = 0.5x multiple (fire sale).

**Comparable Company Valuation**

Find public comparables (similar companies, later stage):

Example comps:

| Company | ARR | Market Cap | Multiple |
|---------|-----|------------|----------|
| Salesforce | £26B | £180B | 6.9x |
| HubSpot | £1.4B | £15B | 10.7x |
| Datadog | £800M | £30B | 37.5x |
| Atlassian | £2.8B | £28B | 10x |

Interesting: Datadog valued 37.5x (much higher growth, 70%+ YoY).

For your company:
- Find 3-5 public comps in similar space
- Note their growth, margins, churn
- Calculate average multiple
- Adjust for your company (if worse metrics, lower multiple; if better, higher)

Example:

Your company: £10M ARR, 40% growth
Comps: 6 companies averaging 8x multiple
Adjusted for your metrics (slightly weaker than comps): 7x multiple
Valuation: £10M × 7x = £70M

**Venture Capital Valuation Framework**

VCs typically use venture multiples (different from comparable companies):

Post-money valuation = Investment amount / Ownership %

Example:

Raising £5M Series A
Investor wants 20% ownership
Post-money: £5M / 20% = £25M
Pre-money: £25M - £5M = £20M

Pre-money based on:
- Traction (£1M ARR, some customers, product-market fit)
- Growth rate (30-40% expected)
- Team quality
- Market opportunity

Rule of thumb:
- Seed (£0-100K ARR): £1-5M pre-money
- Series A (£500K-2M ARR): £5-25M pre-money
- Series B (£5-10M ARR): £25-100M pre-money

Reflects growth potential, not current revenue multiples.

**DCF (Discounted Cash Flow) Valuation**

More theoretical but useful for understanding value:

Formula: Sum of (future cash flows / discount rate ^ years)

Example:

Project cash flow for 5 years:
- Year 1: £0 (break-even)
- Year 2: £1M
- Year 3: £2M
- Year 4: £3M
- Year 5: £4M

Discount rate: 15% (typical VC hurdle rate)

DCF = 0 / 1.15^1 + 1M / 1.15^2 + 2M / 1.15^3 + 3M / 1.15^4 + 4M / 1.15^5
= 0 + 0.76M + 1.31M + 1.72M + 1.99M = £5.78M

Plus terminal value (assuming company worth 5x year 5 cash flow):
Terminal: 4M × 5 = £20M, discounted 5 years: £20M / 1.15^5 = £9.9M

Total DCF: £5.78M + £9.9M = £15.68M valuation

This is lower than revenue multiple approach (£10M × 8x = £80M), reflecting risk (DCF more conservative).
`
      },
      {
        heading: "Valuation by Funding Stage",
        body: `Valuation methodology varies by funding stage.

**Pre-Seed and Seed (£0-500K ARR)**

Valuation method:
- Often no formal valuation (SAFE/convertible notes)
- When valued: £1-10M pre-money typical
- Based on: Founder experience, market opportunity, team

Example:

Two co-founders, £50K revenue, minimal product
Pre-money: £3M
Raising: £500K
Ownership: 500K / (3M + 500K) = 14%

This is high for early stage (reflects founder reputation, market).

**Series A (£500K-3M ARR)**

Valuation method:
- Revenue multiple + DCF blend
- £5-30M pre-money typical

Example:

£1.5M ARR, 50% growth
Comps: 8-10x multiple
Basic valuation: £1.5M × 9x = £13.5M

Adjusted for stage (Series A gets discount to public comps):
- Public: 8-10x, Series A: 5-8x (lower due to risk)
- Valuation: £1.5M × 6.5x = £9.75M pre-money

Raising: £5M Series A
Post-money: £14.75M
Ownership: 34%

**Series B (£3-10M ARR)**

Valuation method:
- Revenue multiple (most common)
- £30-150M pre-money typical

Example:

£5M ARR, 40% growth, unit economics strong
Multiple: 6-8x (less discount than Series A, more traction)
Valuation: £5M × 7x = £35M pre-money

Raising: £15M Series B
Post-money: £50M
Ownership: 30%

**Series C+ (£10M+ ARR)**

Valuation method:
- Revenue multiple + comparable companies
- £150M-1B+ pre-money typical

Example:

£15M ARR, 35% growth, approaching profitability
Comps: 6-8x
Valuation: £15M × 7x = £105M pre-money

Raising: £50M Series C
Post-money: £155M
Ownership: 32%

**Late-Stage / Pre-IPO (£50M+ ARR)**

Valuation method:
- Public comparable multiple
- £1-10B+ pre-money typical

Example:

£75M ARR, 30% growth, 10% EBITDA margin
Comps (Salesforce, HubSpot, etc.): 7-10x
Valuation: £75M × 8.5x = £637M pre-money

Raising: £200M late-stage
Post-money: £837M

**Valuation Trends During Fundraising Rounds**

Healthy company:
- Seed: £3M pre
- Series A: £10M pre (3.3x from seed)
- Series B: £50M pre (5x from Series A)
- Series C: £250M pre (5x from Series B)

Each round 3-5x increase from prior (reflects revenue growth, reduced risk).

Problem company:
- Seed: £5M pre
- Series A: £8M pre (1.6x, slower growth than expected)
- Series B: £12M pre (1.5x, stalled)

Not hitting growth milestones = smaller increase in valuation.

**Valuation and Dilution**

Each fundraising round dilutes existing shareholders:

Example:

Seed round:
- Founders own 100% (before outside investment)
- Raise £500K at £3M post (500K / 3.5M = 14% to investor)
- Founders now own 86%

Series A:
- Founders own 86%
- Raise £5M at £14.75M post (5M / 19.75M = 25% to investor)
- Founders now own 86% × 75% = 64.5%

Series B:
- Founders own 64.5%
- Raise £15M at £50M post (15M / 65M = 23% to investor)
- Founders now own 64.5% × 77% = 49.7%

By Series B, founders ~50% (split with many investors).

By Series C: Founders often <40% (if multiple rounds with full dilution).

This is why founder ownership decreases with funding rounds (unavoidable with external capital).
`
      },
      {
        heading: "Valuation Methodology for Acquirers",
        body: `When selling your company, acquirers use different valuation approach.

**Strategic Acquirer Valuation**

Strategic acquirer (large company buying you):

Valuation drivers:
1. Revenue and growth (similar to VC approach)
2. Synergies (cost savings, revenue uplift from acquisition)
3. Market power (eliminate competitor, consolidate market)

Formula: (Revenue × Multiple) + Synergies - Liabilities

Example:

Target company:
- Revenue: £50M, 40% growth
- Acquirer synergies: £10M/year (cost savings)

Valuation:
- Base: £50M × 8x = £400M
- Synergies: £10M × 5x (typical synergy multiple) = £50M
- Less: Debt: £5M
- Enterprise value: £445M

The acquirer can afford to pay more (value from synergies).

**Financial Buyer Valuation**

Financial buyer (PE firm):

Valuation drivers:
1. Revenue and growth (similar)
2. EBITDA (actual operating profit matters more)
3. 3-5x cash-on-cash return target (PE requirement)

Formula: EBITDA × Multiple (PE typically 8-12x EBITDA)

Example:

Target:
- Revenue: £50M
- EBITDA: £5M (10% margin)

Valuation: £5M × 10x = £50M

PE internal return:
- Buy at £50M
- Improve margins (cost cuts, revenue growth)
- Sell in 5 years at £200M
- Cash return: (£200M - £50M) / £50M = 3x (acceptable for PE)

PE focuses on profitability and margin improvement, not just growth.

**Earnout Structures**

Not all acquisition price paid upfront:

Example:

Total deal: £100M
Cash at close: £60M
Earnout (if targets hit): £40M

Targets over next 2 years:
- Revenue: £70M (from £50M)
- EBITDA: 15% (from 10%)

If targets hit: Seller gets full £100M.
If targets missed: Earnout reduced pro-rata.

Earnout alignment: Both seller and buyer focused on hitting targets post-close.

**Valuation Negotiation**

Typical range:

Seller's ask: High end (10x revenue for strong company)
Buyer's offer: Low end (5x revenue, 5x EBITDA for PE)
Settlement: Middle (7x revenue, or 7x EBITDA for PE)

Both sides negotiate on:
- Base valuation multiple
- Earnout targets and percentage
- Synergies (buyer wants to claim most of synergy value)
- Representations and warranties insurance

Final deal often 20-30% below initial ask (both sides compromise).
`
      },
      {
        heading: "Benchmarking Your Valuation",
        body: `Compare your valuation to peers and benchmarks.

**Public Company Benchmarks**

Public SaaS companies (as of 2024):

| Company | ARR | Market Cap | Multiple | Growth |
|---------|-----|------------|----------|--------|
| Salesforce | £26B | £180B | 6.9x | 15% |
| HubSpot | £1.4B | £15B | 10.7x | 35% |
| Atlassian | £2.8B | £28B | 10x | 30% |
| Datadog | £0.8B | £30B | 37.5x | 70% |
| Zoom | £4B | £45B | 11x | 12% |

Pattern: Higher growth = Higher multiple.

Datadog (70% growth) valued 37.5x.
Salesforce (15% growth) valued 6.9x.

**Private Company Data**

Crunchbase, PitchBook, Carta track private company valuations.

Example query: "SaaS companies £5-10M ARR funded in last 2 years"

Results might show:
- 15 companies similar size
- Average pre-money: £40-50M (6-8x ARR multiple)
- Median: £45M
- Range: £25M-£100M (wide, reflects differences in metrics)

Use this to benchmark your expectations.

**Valuation Sanity Check**

Calculate multiple scenarios:

Conservative (weak metrics): 4x revenue
Base case (typical metrics): 7x revenue
Optimistic (strong metrics): 10x revenue

Example for £5M ARR company:

Conservative: £5M × 4x = £20M
Base: £5M × 7x = £35M
Optimistic: £5M × 10x = £50M

Use base case for planning (35M pre-money).
Conservative for worst-case (if metrics weaken).
Optimistic for best-case (if metrics improve).

**Improving Your Valuation**

Before fundraising, focus on:

1. Increase growth rate (biggest multiple driver)
   - Current: 30% growth → Target: 40% growth (+1-2x multiple)

2. Reduce churn, increase NRR
   - Current: 95% NRR → Target: 110% NRR (+0.5-1x multiple)

3. Improve unit economics (LTV/CAC)
   - Current: 3x ratio → Target: 5x ratio (+1x multiple)

4. Improve margins
   - Current: -5% → Target: 0% (+1x multiple)

Focus on these 4 in 6-12 months pre-fundraise.

Example impact:

Before: £10M ARR, 30% growth, 95% NRR, 3x LTV/CAC, -5% margin
Valuation: 6x = £60M pre-money

After (6 months later):
- £12M ARR, 40% growth, 110% NRR, 5x LTV/CAC, 0% margin
- Valuation: 10x = £120M pre-money

Same company, improved metrics = 2x valuation increase.
`
      }
    ],
    relatedSlugs: [
      "funding-and-investment-strategy",
      "financial-forecasting-modeling",
      "exit-planning-m-a-preparation",
      "unit-economics-ltv-cac-payback",
      "board-reporting-investor-communications"
    ],
    faq: [
      {
        q: "How are SaaS companies valued?",
        a: "Typically on revenue multiples: ARR × Multiple = Enterprise Value. Multiple depends on: growth rate (biggest factor), churn/NRR, unit economics (LTV/CAC), profitability, TAM, concentration. 50% growth = 10-15x, 30% growth = 6-8x, 10% growth = 3-5x. Adjust for your metrics vs benchmarks."
      },
      {
        q: "What multiple should I use for my company?",
        a: "Find 3-5 public comparables in similar space, note their growth/margins, calculate average multiple. Adjust for your company (lower if weaker metrics, higher if stronger). Or use simple framework: 5x base + adjustments (0.5-1x per strong metric). Example: 5x base + 1x growth + 0.5x unit econ + 0.5x margin = 7x."
      },
      {
        q: "How does growth rate affect valuation?",
        a: "Biggest impact. 50% growth = 2-3x higher multiple than 20% growth. Every 10% additional growth adds ~0.5-1x multiple. Example: 30% growth at 7x, 40% growth at 8x, 50% growth at 10x. This is why growth is CEO's #1 job (directly increases valuation)."
      },
      {
        q: "How much dilution happens with each funding round?",
        a: "Each round dilutes ownership. Seed: 10-20%, Series A: 20-30%, Series B: 20-30%. Cumulative dilution by Series C: 50-60% (founders own ~40%). This is normal and expected (reflects external capital, reduced founder risk). Minimize by negotiating lower stakes per round."
      }
    ],
    videoUrl: ""
  }
];

export default batch129Articles;
