import { AcademyArticle } from "@/types/academy";

export const batch320Articles: AcademyArticle[] = [
  {
    slug: "growth-rate-analysis-and-benchmarking",
    title: "Growth Rate Analysis and Benchmarking: Understanding Company Velocity",
    description: "Master growth metrics. Analyze rates, benchmark performance, optimize scaling.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["growth rate", "company growth", "revenue growth", "growth benchmarking", "scaling metrics"],
    keyTakeaways: [
      "Growth rate calculation: (Current revenue - Prior revenue) / Prior revenue × 100 = Growth %. Example: £1M revenue (year 1), £1.5M (year 2) = 50% growth. Monthly growth: (£100K month 1 → £110K month 2) = 10% MoM. Benchmark: Seed companies 10-20% MoM, Series A 5-10%, Series B 3-7%, mature <5%. Cost: Tracking (analytics). Benefit: Know if scaling appropriately, compare to peers.",
      "Growth levers: (1) Increase CAC spending (more acquisition = more growth), (2) Improve conversion (better sales/product = more revenue per lead), (3) Expand existing customers (NRR, LTV), (4) Improve retention (churn reduction extends runway). Cost: Varies by lever. Benefit: Understand which lever to pull (where to invest).",
      "Growth sustainability: Is growth sustainable? If 50% growth from one customer leaving (contraction), vs real growth, different. Track: Organic growth (customers renewing + expansion), new growth (new customers), total growth. Analyze: If new customer growth slowing but NRR strong = still healthy. If all growth new customers, no expansion = red flag."
    ],
    content: [
      {
        heading: "Analyzing and Optimizing Growth Rates",
        body: `Understanding and benchmarking company velocity.

**Growth rate fundamentals**

Definition:
- Growth rate = (Current - Prior) / Prior × 100
- Annual growth: Compare year-over-year (YoY)
- Monthly growth: Compare month-over-month (MoM)
- Quarter growth: Compare quarter-over-quarter (QoQ)

Example calculations:

Annual growth:
- Year 1: £1M revenue
- Year 2: £1.5M revenue
- Growth: (£1.5M - £1M) / £1M = 50% YoY growth

Monthly growth:
- Month 1: £100K revenue
- Month 2: £110K revenue
- Growth: (£110K - £100K) / £100K = 10% MoM growth

Compounding effect (MoM → annual):
- Month 1: £100K
- 10% MoM growth: £110K, £121K, £133K, £146K...
- Month 12: £313K (compound growth to 3.1x in year 1)

Benchmark growth rates by stage:

| Stage | Growth Rate | Notes |
|---|---|---|
| Seed (£0-1M ARR) | 20%+ MoM | Early traction |
| Series A (£1-5M) | 10-15% MoM | Product-market fit |
| Series B (£5-20M) | 5-10% MoM | Scaling |
| Series C (£20M+) | 3-7% MoM | Growth slowing (math) |
| Mature (£50M+) | <5% MoM | Law of large numbers |

**Understanding growth drivers**

MoM growth breakdown:

MoM growth = (New revenue) + (Expansion revenue) - (Churn) / Prior MRR

Example:

Prior MRR: £100K
- New customers: +£20K (20 new customers × £1K)
- Expansion: +£5K (existing customers upgrade)
- Churn: -£4K (4 customers × £1K leaving)
- Net growth: (£20K + £5K - £4K) / £100K = 21% growth

Next month MRR: £121K

Growth composition:
- 66% from new customers (£20K)
- 17% from expansion (£5K)
- -13% from churn (£4K lost)

Interpretation:
- Strong new customer growth (66%)
- Good expansion (17%, should be 15-25%)
- Acceptable churn (4%, should be <5%)
- Sustainable growth? (yes, multiple sources)

**Growth quality analysis**

Organic vs inorganic growth:

Organic:
- Existing customer expansion (NRR >100%)
- Customer churn reduction (improving retention)
- Price increases (more revenue, same customers)
- Sustainable (not dependent on new acquisition)

Inorganic:
- New customer acquisition only
- Acquisition slowing? = Growth slows
- Risk: Dependent on constant acquisition spending

Example comparison:

Company A (2024 Q2 → Q3):
- Growth: 20%
- Breakdown: 15% new customers, 5% expansion
- Concern: 75% from new acquisition only

Company B (2024 Q2 → Q3):
- Growth: 15%
- Breakdown: 5% new customers, 8% expansion, 2% price increases
- Healthier: Diversified sources

Analysis: Company B growth more sustainable (expansion + pricing, less acquisition dependent)

**Benchmarking company growth**

Compare to peers:

| Company | Stage | ARR | Growth (YoY) | Notes |
|---|---|---|---|---|
| Company A | Series A | £3M | 150% | Exceptional (earlier stage) |
| Company B | Series A | £3M | 80% | Good |
| Company C | Series B | £12M | 50% | Good (larger base) |
| Company D | Series B | £12M | 20% | Concerning (falling behind) |

Insight: Company D growth slower than expected for stage/size (may be market saturation, competition, execution issues)

Growth deceleration (normal):
- Year 1: 100% growth (£0 → £1M)
- Year 2: 50% growth (£1M → £1.5M)
- Year 3: 30% growth (£1.5M → £2M)
- Year 4: 20% growth (£2M → £2.4M)

Reason: Law of large numbers (harder to double £10M than £1M)

Target: Maintain growth rate (don't decline below benchmark for stage)

**Analyzing growth sustainability**

Questions to ask:

Q1: Is growth from new customers or expansion?
- New only: Risk (dependent on acquisition)
- Expansion strong: Good (leverage existing base)
- Balanced: Best (multiple sources)

Q2: Is CAC payback getting better or worse?
- Improving: Sustainable (more efficient)
- Worsening: Unsustainable (CAC increasing or revenue per customer declining)
- Stable: Okay (not improving or declining)

Q3: Is churn improving or worsening?
- Improving: Growth may accelerate (retaining more)
- Worsening: Growth may decelerate (losing more customers)
- Stable: Consistent (but opportunity to improve)

Q4: Is growth from price increases or new features?
- Price increases: Solid (shows pricing power)
- Features: Product-driven (new capabilities)
- Market: Market growth (tailwind, not company-specific)
- Combination: Best (multiple drivers)

Example analysis:

Company: £5M ARR, 50% YoY growth

Breakdown:
- New customers: 60% of growth (30 points)
- Expansion: 20% of growth (10 points)
- Churn: -30% of growth (-15 points)
- Price increases: -5% of growth (-2.5 points)
- Net: 50% growth ✓

Sustainability assessment:
- New customer growth strong ✓
- Expansion decent (20%), could improve
- Churn concerning (30% of growth = 15 points drag)
- Price increases slight (could push more)

Recommendations:
1. Maintain new customer acquisition (working)
2. Improve expansion (target 25-30% of growth)
3. Reduce churn (highest leverage, could add 10+ points)
4. Test price increases (could add 2-3 points)

Potential: 50% → 70% growth (by improving these)

**Growth forecasting**

Simple projection:

Current: £5M ARR, 50% growth

Scenario 1 (maintain):
- Year 2: £5M × 1.50 = £7.5M (+50%)
- Year 3: £7.5M × 1.50 = £11.25M (+50%)
- Year 4: £11.25M × 1.50 = £16.9M (+50%)

Scenario 2 (decelerate to 30%):
- Year 2: £5M × 1.30 = £6.5M (+30%)
- Year 3: £6.5M × 1.30 = £8.45M (+30%)
- Year 4: £8.45M × 1.30 = £11M (+30%)

Scenario 3 (accelerate to 70%):
- Year 2: £5M × 1.70 = £8.5M (+70%)
- Year 3: £8.5M × 1.70 = £14.45M (+70%)
- Year 4: £14.45M × 1.70 = £24.6M (+70%)

Impact of 1-2% change: Material over time (compounding)

**Growth investment strategy**

When to invest in growth:

Invest more when:
- CAC payback <12 months (efficient acquisition)
- NRR >110% (expansion strong)
- Churn declining (product improving)
- Market opportunity large (TAM significant)

Conservative when:
- CAC payback 12-18 months (getting expensive)
- NRR <105% (expansion weak)
- Churn stable/increasing (product issue)
- Market saturating (TAM shrinking)

Example investment:

Current: £5M ARR, 50% growth, CAC payback 8 months

Options:
1. Invest more (double acquisition budget)
   - Expected: Growth to 70-80%
   - Risk: CAC payback extends (still <12 months OK)
   - Upside: Accelerate to unicorn trajectory

2. Maintain spending
   - Expected: 50% growth continues
   - Risk: Competitors scale faster
   - Upside: Steady, predictable growth

3. Reduce spending (optimize for profitability)
   - Expected: 30-40% growth
   - Risk: Fall behind competitors
   - Upside: Hit profitability sooner

Decision factors:
- Stage: Series B? → Invest (growth priority)
- Runway: 18 months? → Can afford growth
- Competition: Many competitors? → Invest (win market)
- Market: Early stage? → Invest (capture)

**Monitoring growth health**

Monthly dashboard:

| Metric | Current | Target | Status |
|---|---|---|---|
| MoM growth | 4% | 5% | Below |
| YoY growth | 50% | 50% | On target |
| New customers | 20 | 25 | Below |
| Expansion | £5K | £7K | Below |
| Churn | £4K | £3K | Needs work |
| CAC payback | 8 mo | <12 mo | Good |
| NRR | 110% | 115% | Below |

Actions:
- New customer growth low: Increase acquisition investment?
- Expansion low: Better upsell, product improvements?
- Churn high: Improve onboarding, CS?
- CAC payback rising: Check acquisition quality

Quarterly review:
- Growth rate trend: Accelerating/decelerating?
- Growth composition: Balanced (new + expansion)?
- Sustainability: From pricing, acquisition, or product?
- vs benchmark: On track for stage?

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "unit-economics-ltv-cac-payback", "customer-acquisition-strategy-and-marketing-roi", "retention-and-churn-reduction-mechanics", "market-sizing-and-tam-analysis"],
    faq: [
      { q: "How do I calculate growth rate?", a: "Growth rate = (Current - Prior) / Prior × 100. Example: £1M → £1.5M = 50% growth. Monthly: (£100K → £110K = 10% MoM). Benchmark: Seed 20% MoM, Series A 10-15%, Series B 5-10%, Series C 3-7%, Mature <5%. Track: YoY (annual), MoM (momentum), QoQ (quarterly)." },
      { q: "What's a healthy growth rate for my stage?", a: "Depends on stage: Seed £0-1M (20%+ MoM = traction), Series A £1-5M (10-15% MoM = product-market fit), Series B £5-20M (5-10% MoM = scaling), Series C £20M+ (3-7% = larger base). Growth slows as company grows (law of large numbers). Maintain rate appropriate to stage. Compare to peers (benchmark)." },
      { q: "How do I improve growth rate?", a: "Analyze breakdown: New customer % + Expansion % - Churn %. Levers: (1) New customer growth (increase CAC spending if payback <12 months), (2) Expansion revenue (upsell, cross-sell = 20-30% of growth), (3) Reduce churn (1% reduction = significant impact), (4) Price increases (2-3% annually). Typical: 30-50% growth improvement possible by optimizing all levers." }
    ],
    videoUrl: ""
  }
];

export default batch320Articles;