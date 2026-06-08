import { AcademyArticle } from "@/types/academy";

export const batch160Articles: AcademyArticle[] = [
  {
    slug: "saas-valuation-and-multiples",
    title: "SaaS Valuation and Multiples: Understanding Your Company's Worth",
    description: "Master SaaS valuation. Understand how SaaS companies are valued using ARR multiples, comparable company analysis, and different valuation methods.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "SaaS valuation",
      "company valuation",
      "ARR multiple",
      "revenue multiple",
      "valuation methods",
      "comparable companies",
      "funding rounds",
      "enterprise value",
      "growth rate",
      "profitability"
    ],
    keyTakeaways: [
      "SaaS valuation basics: SaaS companies valued as multiple of ARR. Formula: Company Value = ARR × Multiple. Example: £2M ARR × 5x multiple = £10M valuation. Multiple depends on: Growth rate (higher growth = higher multiple), Churn (lower churn = higher multiple), Margins (higher margins = higher multiple), Rule of 40 (growth % + operating margin % > 40 = premium). Example: 50% growth + 20% margin = 70 > 40 = premium multiple 6-8x. 25% growth - 5% burn = 20 < 40 = lower multiple 2-3x.",
      "Multiple by growth rate: Early stage (50%+ growth): 8-12x ARR. Growth stage (30-50% growth): 5-8x ARR. Scale stage (10-30% growth): 3-5x ARR. Mature (5-10% growth): 1.5-3x ARR. Example: £1M ARR company at 50% growth = £8-12M valuation (1x multiple range). Same company slowing to 30% growth = £5-8M valuation (drop due to deceleration). Growth deceleration = valuation risk.",
      "Valuation methods: (1) Revenue multiple (easiest, used most). (2) Comparable companies (public SaaS companies benchmarks). (3) Discounted cash flow (future profits discounted to today). Example: Company £1M ARR, 50% growth, 5x multiple = £5M valuation. But also profitable (20% margin) → DCF might say £6-7M (higher because profitable). Use multiple methods, triangulate value."
    ],
    content: [
      {
        heading: "SaaS Valuation Fundamentals",
        body: `How SaaS companies are valued.

**Why SaaS Multiples Are Different**

Traditional companies valued on:
- Earnings multiple (10-15x earnings typical)
- Enterprise value / EBITDA ratio

SaaS companies often not profitable (unprofitable at growth stage), so valued on:
- Revenue multiple (ARR multiple)
- Growth rate matters more than current profitability
- Retention and expansion matter (recurring revenue)

**The Revenue Multiple Approach**

Formula: Valuation = ARR × Multiple

Example:
- ARR: £2M
- Multiple: 5x
- Valuation: £10M

Multiple depends on:
1. Growth rate (higher = higher multiple)
2. Churn rate (lower = higher multiple)
3. Profit margin (higher = higher multiple, but not essential)
4. Market size (bigger = higher multiple)
5. Competitive moat (stronger = higher multiple)

**Multiple by Stage**

| Stage | Growth Rate | Typical Multiple | Example |
|-------|-----|---|---|
| Early | 80%+ | 10-15x | £1M ARR → £10-15M |
| Growth | 30-80% | 5-10x | £5M ARR → £25-50M |
| Scale | 10-30% | 2.5-5x | £20M ARR → £50-100M |
| Mature | 5-10% | 1-2.5x | £100M ARR → £100-250M |

Insight:
- Growth stage commands highest multiples (growth is rare)
- Early stage unprofitable but high growth = high multiple
- Scale stage profitable but slower growth = lower multiple (less exciting)

**Rule of 40**

Heuristic for valuation: Growth % + Operating Margin % > 40 = premium multiple

Example A:
- Growth: 50%
- Operating margin: 20%
- Rule of 40: 50 + 20 = 70 (excellent)
- Multiple: 7-10x (premium)

Example B:
- Growth: 30%
- Operating margin: 15%
- Rule of 40: 30 + 15 = 45 (good)
- Multiple: 5-7x (healthy)

Example C:
- Growth: 25%
- Operating margin: -20% (losing money)
- Rule of 40: 25 - 20 = 5 (poor)
- Multiple: 2-3x (discount)

Implication: Can't sacrifice profitability for growth (Rule of 40 keeps balance).

`
      },
      {
        heading: "Comparable Company Analysis",
        body: `Valuing based on similar companies.

**Finding Comparable Companies**

Select peers with similar characteristics:
- Similar ARR size (within 2x)
- Similar growth rate (±10%)
- Same market (SaaS vs DevTools, horizontal vs vertical)
- Similar profitability

Example comparable analysis:

| Company | ARR | Growth | Margin | Multiple | Valuation |
|---------|-----|--------|--------|----------|-----------|
| Company A (public) | £50M | 35% | 10% | 4.5x | £225M |
| Company B (public) | £40M | 32% | 8% | 4.2x | £168M |
| Company C (private) | £30M | 38% | 5% | 5.0x | £150M |
| Peer median | - | 35% | 8% | 4.5x | - |
| Your company | £5M | 36% | 2% | 4.5x (est) | £22.5M |

Your company multiple: 4.5x (matches peer median) adjusted for slightly lower margin (maybe 4.2x discount).

**Valuation Using Comps**

Your company: £5M ARR, 36% growth, 2% margin

Peer multiple: 4.5x

Valuation: £5M × 4.5x = £22.5M

Sensitivity:
- Optimistic (multiple 5x): £25M
- Conservative (multiple 4x): £20M
- Base case (4.5x): £22.5M

**Adjusting for Differences**

If your company differs from comps:

Higher growth than peers:
- If peers 30%, you 45% → +0.5-1x multiple premium
- Justifies 4.5x → 5-5.5x

Lower margins than peers:
- If peers 15% margin, you 2% margin → -0.5x multiple discount
- Justifies 4.5x → 4x

Larger market opportunity:
- If large TAM → +0.5-1x premium

Example reconciliation:
- Peer multiple: 4.5x
- +0.5x for higher growth
- -0.5x for lower margins
- Net: 4.5x (unchanged)
- Your valuation: £5M × 4.5x = £22.5M

`
      },
      {
        heading: "Valuation Methods Comparison",
        body: `Different approaches to value your company.

**Method 1: Revenue Multiple (ARR × Multiple)**

Pros:
- Simplest (one number to pick)
- Market standard for SaaS
- Works for unprofitable companies

Cons:
- Ignores profitability
- Multiple can vary widely
- Doesn't account for cash burn

Example:
- £5M ARR
- 35% growth
- Multiple: 4.5x (based on comps)
- Valuation: £22.5M

**Method 2: Discounted Cash Flow (DCF)**

Pros:
- Accounts for profitability
- Future earnings reflected
- More precise

Cons:
- Requires forecasting (uncertain)
- Small changes in assumptions = big value changes
- Complex calculation

Formula simplified:
1. Forecast cash flows 10 years
2. Discount to present value (using discount rate)
3. Sum discounted cash flows = enterprise value

Example:
- Year 1 cash flow: £200K (£5M ARR, -20% margin)
- Year 5 cash flow: £2M (assuming growth to £15M ARR, +20% margin)
- Year 10 cash flow: £5M (£25M ARR, +25% margin, mature)
- Discount rate: 10% (risk-adjusted)
- Discounted cash flows sum: £15M (less than revenue multiple method)

Valuation: £15-18M (lower than 4.5x multiple = £22.5M)

Implication: If currently unprofitable, DCF lower than revenue multiple.

**Method 3: Venture Capital Method**

Used by VCs to price funding rounds.

Pros:
- Target return based
- Accounts for risk

Cons:
- Works backwards from exit
- Requires exit assumption

Formula:
Valuation = (Target Exit Value / Return Multiple) / (1 - Dilution from this round)

Example:
- Exit value (10-year goal): £100M
- Target return for VCs: 3x
- Implied post-money valuation today: £100M / 3 = £33M
- Current valuation: ~£33M (or lower if risky)

Implication: Exit value target drives current valuation. More aggressive exit goal = higher current valuation.

**Comparing Methods**

| Method | Formula | Value | Pros | Cons |
|--------|---------|-------|------|------|
| Revenue Multiple | ARR × Multiple | £22.5M | Simple, market standard | Ignores profitability |
| DCF | PV of future cash flows | £15-18M | Accounts for profitability | Requires forecasts |
| VC Method | Exit / Target Return | £33M | Realistic for fundraising | Works backward |

For different purposes:
- Fundraising: Use both revenue multiple and VC method (VCs use VC method)
- Strategic planning: Use DCF (your actual profitability matters)
- Quick valuation: Use revenue multiple (market standard)

Best practice: Calculate all three, use as range (£15-33M in example).

`
      },
      {
        heading: "Valuation in Different Scenarios",
        body: `How valuation changes with business performance.

**Impact of Growth Rate**

Company A: £5M ARR, 50% growth
- Multiple: 5.5x (higher growth premium)
- Valuation: £27.5M

Company B: £5M ARR, 30% growth
- Multiple: 4x (moderate growth)
- Valuation: £20M

Company C: £5M ARR, 15% growth
- Multiple: 2.5x (slower growth)
- Valuation: £12.5M

Insight: 20% growth difference = £7.5M valuation difference (37%).

**Impact of Churn Rate**

Company A: £5M ARR, 50% growth, 2% churn (NRR 105%)
- Multiple: 4.5x
- Valuation: £22.5M

Company B: £5M ARR, 50% growth, 5% churn (NRR 95%)
- Multiple: 3.5x (churn discount)
- Valuation: £17.5M

Insight: High churn = significant discount even with same growth (LTV lower).

**Impact of Profitability**

Company A: £5M ARR, 30% growth, 20% margin (Rule of 40: 50)
- Multiple: 5x (premium)
- Valuation: £25M

Company B: £5M ARR, 30% growth, -10% margin (Rule of 40: 20)
- Multiple: 3x (discount)
- Valuation: £15M

Insight: Same growth but profitability difference = £10M valuation difference (40%).

**Valuation Evolution**

Example: Year 1 to Year 3 journey

| Year | ARR | Growth | Margin | Multiple | Valuation |
|-----|-----|--------|--------|----------|-----------|
| 1 | £1M | 80% | -30% | 8x | £8M |
| 2 | £2M | 50% | -10% | 5x | £10M |
| 3 | £4M | 40% | 10% | 4.5x | £18M |

Insight:
- Year 1→2: Valuation up despite lower growth (growth deceleration risk)
- Year 2→3: Valuation up significantly (growth maintained, reaching profitability)
- Rule of 40: Year 1 (50), Year 2 (40), Year 3 (50) — improving

Key driver: Profitability reached at scale (more valuable).

**Valuation Sensitivity**

Your company: £5M ARR, 35% growth, -5% margin (Rule of 40: 30)

Base case (multiple 4x): £20M

Sensitivity to changes:

| Change | New Multiple | New Valuation |
|--------|--------------|---------------|
| Growth +5% (Rule: 35) | 4.25x | £21.25M |
| Growth -5% (Rule: 25) | 3.5x | £17.5M |
| Margin +10% (Rule: 45) | 4.5x | £22.5M |
| Margin -10% (Rule: 20) | 3.5x | £17.5M |

Insight:
- 5% growth change = ±6% valuation change
- 10% margin change = ±12% valuation change
- Margin changes have bigger valuation impact

`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-ltv-cac-payback",
      "growth-accounting-and-advanced-unit-economics",
      "financial-forecasting-modeling",
      "exit-planning-and-m-and-a-preparation"
    ],
    faq: [
      {
        q: "What multiple should I use to value my SaaS company?",
        a: "Depends on growth and profitability. Early-stage 50%+ growth: 8-12x ARR. Growth-stage 30-50% growth: 5-8x ARR. Scale-stage 10-30% growth: 3-5x ARR. Mature <10% growth: 1.5-3x ARR. Use Rule of 40 (growth % + margin % > 40 = premium). Example: 40% growth + 5% margin = 45 > 40 = use 5-7x multiple."
      },
      {
        q: "How do I value my company for fundraising?",
        a: "Use multiple methods: (1) Revenue multiple (ARR × comparable company multiple), (2) VC method (target exit ÷ desired return), (3) DCF (discounted cash flows). Calculate all three, use as valuation range. Most common for SaaS: Revenue multiple. VCs focus on: Rule of 40, growth trajectory, market size."
      },
      {
        q: "What is Rule of 40?",
        a: "Growth % + Operating Margin % should be > 40 for premium valuation. Example: 50% growth + 20% margin = 70 (excellent, premium multiple 6-8x). 25% growth - 5% burn = 20 (poor, lower multiple 2-3x). Balances growth and profitability — can't sacrifice all margins for growth."
      },
      {
        q: "How does churn affect valuation?",
        a: "High churn = lower multiple. Example: Same £5M ARR, 50% growth, but 2% churn vs 5% churn = 1x multiple difference = £5M valuation difference. Churn impacts LTV, which impacts valuation multiple. Lower churn = higher valuation at same growth rate."
      }
    ],
    videoUrl: ""
  }
];

export default batch160Articles;
