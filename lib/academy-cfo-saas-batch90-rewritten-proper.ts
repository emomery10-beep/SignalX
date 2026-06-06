import { AcademyArticle } from "@/types/academy";

export const batch90Articles: AcademyArticle[] = [
  {
    slug: "saas-valuation-multiples",
    title: "SaaS Valuation and Multiples: Understanding How SaaS Companies Are Valued",
    description: "Master SaaS valuation: understand ARR multiples, how they vary by growth and profitability, and what determines company value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "SaaS valuation",
      "valuation multiple",
      "ARR multiple",
      "company valuation",
      "exit valuation",
      "acquisition price",
      "IPO valuation",
      "Rule of 40",
      "DCF valuation",
      "comparable companies"
    ],
    keyTakeaways: [
      "SaaS valuation multiple = Post-money valuation ÷ ARR; public SaaS companies trade 5-20x ARR depending on growth and profitability (Salesforce 8x, Datadog 30x, mature SaaS 5x); private SaaS raise at 50-70% of public comps (illiquidity discount); acquisition price = 4-8x ARR (buyer synergies, no IPO multiple). Understanding multiples helps with negotiating fundraising valuations and acquisition offers.",
      "Valuation drivers: Growth rate (50% YoY = higher multiple than 20%), profitability (positive margin = higher multiple, -20% margin = lower), NRR (>120% = higher, <100% = lower), CAC payback (<9mo = higher, >18mo = lower), churn rate (<1% enterprise = higher), market size (large TAM = higher); growth + profitability (Rule of 40) = most important",
      "Valuation by stage: Seed 3-4x ARR (pre-product), Series A 6-8x ARR (£1-2M), Series B 10-15x ARR (£5-10M), Series C 12-20x ARR (£20M+, profitable); IPO 10-30x ARR (public market premium); acquisition 4-8x ARR (depends on buyer synergy). Use Rule of 40 to estimate: companies with 40+ get highest multiples, <30 get lowest."
    ],
    content: [
      {
        heading: "Understanding SaaS Valuation Multiples",
        body: `SaaS companies are valued using the ARR multiple method: Post-money valuation = ARR × Multiple.

**Why Multiples?**

Traditional businesses are valued by EBITDA (earnings before interest, tax, depreciation, amortization):
- Valuation = EBITDA × Multiple (typically 8-12x)

SaaS businesses are valued by ARR (Annual Recurring Revenue):
- Valuation = ARR × Multiple (typically 5-30x, depending on stage and growth)

Why? SaaS companies are typically unprofitable when young (investing in growth), so EBITDA-based valuation doesn't work. ARR captures the recurring revenue stream (more predictable than profit).

**Example: Valuation Calculation**

Company with £2M ARR, raising Series A.

Valuation = £2M ARR × 7x multiple = £14M post-money

If raising £3M:
- Investor owns: £3M ÷ £14M = 21%
- Founders own: 79%

If raising £4M at 8x multiple:
- Valuation = £2M × 8x = £16M
- Investor owns: £4M ÷ £16M = 25%
- Founders own: 75%

Higher multiple = better valuation for founders (own more % for same amount raised).

**Valuation Multiples by Stage**

| Stage | Typical ARR | Multiple | Valuation | Why |
|-------|----------|----------|----------|-----|
| Seed | £0-1M | 3-5x | £0-5M | Pre-traction, high risk |
| Series A | £1-3M | 6-10x | £6-30M | Proven product-market fit |
| Series B | £5-10M | 10-15x | £50-150M | Unit economics proven |
| Series C | £20-50M | 12-20x | £240-1,000M | Approaching profitability |
| Pre-IPO | £50M+ | 15-25x | £750M+ | Path to profitability clear |
| Public | £100M+ | 8-30x | £800M-3B+ | Market dependent |

Note: Public companies trade at lower multiples on average (8x) despite being mature and profitable. This is because growth slows at scale.

Examples:
- Datadog (50%+ growth, negative margin): 30x ARR (premium growth multiple)
- Zoom (40% growth, positive margin): 15x ARR
- Salesforce (20% growth, positive margin): 8x ARR (mature, slower growth)

**What Drives Multiples?**

Multiple varies based on six factors:

1. **Growth rate** (most important)
   - 80%+ growth: 20-30x multiple
   - 50%+ growth: 10-15x multiple
   - 30% growth: 7-10x multiple
   - 10% growth: 4-6x multiple

   Rule: Each 10% growth = ~1-2x multiple premium

2. **Profitability**
   - Positive margin (>10%): +3-5x multiple premium
   - Breakeven: Baseline
   - Negative margin (>-20%): -2-3x multiple discount

3. **Net Revenue Retention (NRR)**
   - NRR >120%: +3-5x multiple premium (organic growth)
   - NRR 100-110%: Baseline
   - NRR <100%: -2-3x discount (contraction)

4. **CAC Payback**
   - <9 months: +2-3x premium
   - 9-12 months: Baseline
   - >18 months: -2-3x discount

5. **Churn rate**
   - <1% monthly (enterprise): +2-3x premium
   - 2-3% monthly (SMB): Baseline
   - >5% monthly: -1-2x discount

6. **Market size**
   - Large TAM (£100B+): +1-2x premium
   - Medium TAM (£10-50B): Baseline
   - Small TAM (<£5B): -1-2x discount

A company with all positive factors (high growth, profitable, high NRR, good payback, low churn, large market) commands a 20x+ multiple.

A company with all negative factors (low growth, unprofitable, low NRR, high payback, high churn, small market) trades 4x multiple.

**Valuation Formula: Rule of 40**

A shortcut to estimate appropriate multiple:

Rule of 40 score = Growth % + Operating margin %

Valuation multiple ≈ Rule of 40 score / 2

Example:

Company A:
- Growth: 50%
- Operating margin: −20%
- Rule of 40: 30
- Expected multiple: 30 ÷ 2 = 15x

Company B:
- Growth: 30%
- Operating margin: +20%
- Rule of 40: 50
- Expected multiple: 50 ÷ 2 = 25x

Company C:
- Growth: 20%
- Operating margin: −10%
- Rule of 40: 10
- Expected multiple: 10 ÷ 2 = 5x

This shows why profitability-focused companies with lower growth (Company B) command higher multiples than pure growth companies (Company A).

**Valuation Changes Over Time**

Company valuation typically increases each round (improving metrics, reducing risk):

Series A: £1M ARR, 80% growth, −40% margin, Rule of 40 = 40, multiple ≈ 20x, valuation = £20M

Series B (2 years later): £5M ARR, 50% growth, −10% margin, Rule of 40 = 40, multiple ≈ 20x, valuation = £100M

Series C (3 years later): £20M ARR, 30% growth, +15% margin, Rule of 40 = 45, multiple ≈ 22x, valuation = £440M

Growth accelerates valuation (£20M → £100M → £440M).

But if metrics decline:

Series B (worse case): £3M ARR, 20% growth, −30% margin, Rule of 40 = -10, multiple ≈ 8x, valuation = £24M

Even though revenue grew 3x (£1M → £3M), valuation barely improved (£20M → £24M) because growth slowed and burn increased.

This shows: Metrics matter more than revenue size.

**Valuation at Exit**

When you sell the company (acquisition or IPO), valuation changes:

**Acquisition:**
- Strategic buyer (use synergies): 4-8x ARR
- Financial buyer (no synergies): 3-5x ARR
- Distressed sale (forced): 2-4x ARR

Example: £50M ARR company
- Strategic buyer: £50M × 6x = £300M
- Financial buyer: £50M × 4x = £200M
- Distressed: £50M × 3x = £150M

**IPO:**
- High growth (>40%): 15-30x ARR
- Moderate growth (20-40%): 8-15x ARR
- Mature (10-20%): 5-10x ARR

Example: £100M ARR, 25% growth
- Public market valuation: £100M × 10x = £1B

Same company:
- Acquisition: £100M × 5x = £500M
- IPO: £100M × 10x = £1B

IPO is 2x better valuation (but riskier, more complex).

**Valuation Benchmarks**

Current public SaaS multiples (as of 2026):

High growth (>50%): Datadog 30x, CrowdStrike 15x, Nvidia 25x
Moderate growth (30-50%): Zoom 12x, Okta 10x, Atlassian 20x
Mature (10-30%): Salesforce 8x, ServiceNow 9x, Adobe 7x

Note: These vary daily (stock market changes multiples in real-time).

Private companies typically raise at 50-70% of public comp multiples (illiquidity discount).

Example:
- Datadog trading 30x (public)
- Private SaaS with similar metrics: 15-20x (50-67% of public)
`
      }
    ],
    relatedSlugs: [
      "funding-and-investment-strategy",
      "rule-of-40-growth-profitability-balance",
      "unit-economics-deep-dive",
      "saas-benchmarking-metrics-comparison",
      "net-revenue-retention-nrr-mastery"
    ],
    faq: [
      {
        q: "What's a fair valuation multiple for Series A?",
        a: "6-10x ARR typical, depending on growth and unit economics. 50%+ growth and LTV/CAC >3x = 8-10x. 30% growth and 2x ratio = 6-7x."
      },
      {
        q: "How does Rule of 40 relate to valuation?",
        a: "Rule of 40 score roughly equals 2x the ARR multiple. Company with 40+ score gets 20x multiple. Company with 50+ score gets 25x multiple."
      },
      {
        q: "Why do mature SaaS companies trade lower multiples?",
        a: "Growth slows at scale (law of large numbers). Datadog at 50% growth = 30x. Salesforce at 20% growth = 8x. Lower growth = lower multiple, despite being profitable."
      },
      {
        q: "Should I optimize for higher valuation multiple?",
        a: "Not primarily. Optimize for unit economics and growth (which drive multiple). Higher multiple = better exit, but shouldn't be the goal. Focus on building sustainable business."
      }
    ],
    videoUrl: ""
  }
];

export default batch90Articles;
