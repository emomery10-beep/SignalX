import { AcademyArticle } from "@/types/academy";

export const batch370Articles: AcademyArticle[] = [
  {
    slug: "saas-metrics-benchmarking-and-peer-comparison",
    title: "SaaS Metrics Benchmarking and Peer Comparison: How You Stack Up",
    description: "Master SaaS benchmarking. Compare your metrics to industry standards and identify improvement areas.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["benchmarking", "SaaS metrics", "peer comparison", "industry standards", "performance metrics"],
    keyTakeaways: [
      "Growth rate benchmarks by ARR: £0-1M ARR target 3x YoY growth (T2D3 framework). £1-5M target 2x-3x. £5-20M target 1.5x-2x. £20-50M target 1.3x-1.5x. £50M+ target 1.2x-1.3x. Example: £5M ARR company growing 80% YoY = below median (target 100-200%). Top quartile at £5M ARR = 150%+ growth. Track against stage-appropriate benchmarks, not absolute numbers.",
      "Efficiency benchmarks: Rule of 40 (growth % + margin % ≥ 40%). Burn multiple: Net new ARR ÷ net burn (target >1.0x). Magic Number >0.75 (good), >1.0 (excellent). CAC payback <18 months. Net revenue retention >110% (good), >130% (excellent). Gross margin >70% (target >80%). Example: 60% growth + (-20%) margin = 40% (at Rule of 40). These metrics matter most for Series B+ companies.",
      "Operational benchmarks: Gross margin: >75% (SaaS benchmark), best-in-class >85%. Sales efficiency: CAC payback <12 months (excellent). Employee efficiency: £200-400K revenue per employee. Engineering spend: 15-25% of revenue. Sales & marketing: 30-50% of revenue (growth stage), 20-30% (mature). G&A: 10-15% of revenue. Customer success: 5-10% of revenue. Use these to identify where you're overspending relative to peers."
    ],
    content: [
      {
        heading: "Benchmarking Your SaaS Metrics Against Industry Standards",
        body: `Understanding where your company stands relative to peers.

**Growth benchmarks by stage**

T2D3 framework (Triple, Triple, Double, Double, Double):

Year 1: £0 → £500K ARR
Year 2: £500K → £1.5M (Triple)
Year 3: £1.5M → £4.5M (Triple)
Year 4: £4.5M → £9M (Double)
Year 5: £9M → £18M (Double)
Year 6: £18M → £36M (Double)

This is the path to £100M ARR in ~8 years

Reality check:

| ARR range | Top quartile growth | Median growth | Bottom quartile |
|---|---|---|---|
| £0-1M | 300%+ | 150% | 50% |
| £1-5M | 200%+ | 100% | 40% |
| £5-20M | 100%+ | 60% | 25% |
| £20-50M | 60%+ | 35% | 15% |
| £50-100M | 40%+ | 25% | 10% |

How to use:
- Find your ARR range
- Compare your growth rate to quartiles
- Top quartile = fundraising leverage
- Bottom quartile = investigate root causes

Example assessment:

Company: £8M ARR, growing 55% YoY

Benchmark range: £5-20M
- Top quartile: 100%+ → You're below
- Median: 60% → You're slightly below
- Bottom quartile: 25% → You're above

Assessment: Below median but above bottom quartile
Action: Focus on growth acceleration (marketing, sales, product)

**Retention benchmarks**

Gross revenue retention (GRR):

| Segment | Top quartile | Median | Bottom quartile |
|---|---|---|---|
| Enterprise | >95% | 90% | 85% |
| Mid-market | >92% | 87% | 80% |
| SMB | >85% | 78% | 70% |
| Self-serve | >80% | 72% | 60% |

Net revenue retention (NRR):

| Segment | Top quartile | Median | Bottom quartile |
|---|---|---|---|
| Enterprise | >130% | 115% | 100% |
| Mid-market | >120% | 108% | 95% |
| SMB | >110% | 100% | 90% |
| Self-serve | >105% | 95% | 85% |

How to interpret:

NRR > 100%: Revenue from existing customers growing (expansion > churn)
NRR < 100%: Revenue from existing customers shrinking (churn > expansion)

Example:

Company NRR: 108% (mid-market segment)
- Median benchmark: 108% → Exactly at median
- Means: For every £100 of revenue at start of year, you have £108 at end
- Expansion: £15 from upsells
- Churn: -£7 from lost customers
- Net: +£8 (108%)

**Unit economics benchmarks**

LTV:CAC ratio:

| Stage | Top quartile | Median | Minimum viable |
|---|---|---|---|
| Seed | >5:1 | 3:1 | 2:1 |
| Series A | >5:1 | 3:1 | 3:1 |
| Series B+ | >5:1 | 4:1 | 3:1 |

CAC payback period:

| Stage | Top quartile | Median | Maximum acceptable |
|---|---|---|---|
| Seed | <6 months | 12 months | 18 months |
| Series A | <9 months | 15 months | 24 months |
| Series B+ | <12 months | 18 months | 24 months |

Gross margin:

| Type | Top quartile | Median | Minimum |
|---|---|---|---|
| Pure SaaS | >85% | 78% | 70% |
| SaaS + services | >75% | 65% | 55% |
| Usage-based | >70% | 60% | 50% |

**Efficiency benchmarks**

Rule of 40:

Growth rate + profit margin ≥ 40%

| Scenario | Growth | Margin | Score | Status |
|---|---|---|---|---|
| High growth | 80% | -30% | 50% | Above 40 ✓ |
| Balanced | 40% | 5% | 45% | Above 40 ✓ |
| Profitable | 20% | 25% | 45% | Above 40 ✓ |
| Struggling | 30% | -5% | 25% | Below 40 ✗ |

Burn multiple:

Net new ARR / Net burn = Burn multiple

| Stage | Top quartile | Median | Minimum |
|---|---|---|---|
| Seed | >2.0x | 1.0x | 0.5x |
| Series A | >1.5x | 0.8x | 0.5x |
| Series B+ | >1.5x | 1.0x | 0.7x |

Example:
- Net new ARR this year: £2M
- Net burn this year: £3M
- Burn multiple: £2M / £3M = 0.67x (below median for Series B+)

**Operational spending benchmarks**

As % of revenue:

| Function | Early stage | Growth stage | Mature |
|---|---|---|---|
| Cost of revenue | 20-30% | 15-25% | 15-20% |
| R&D / Engineering | 25-40% | 20-30% | 15-20% |
| Sales & Marketing | 40-60% | 30-50% | 20-30% |
| G&A | 15-25% | 10-15% | 8-12% |

How to use:

Example company (£10M ARR, growth stage):

| Function | Your spend | Benchmark | Status |
|---|---|---|---|
| COGS | 22% (£2.2M) | 15-25% | In range ✓ |
| R&D | 35% (£3.5M) | 20-30% | Above range ✗ |
| S&M | 45% (£4.5M) | 30-50% | In range ✓ |
| G&A | 18% (£1.8M) | 10-15% | Above range ✗ |
| Total opex | 120% | 75-120% | At ceiling ✗ |
| Operating margin | -20% | -20% to +5% | In range ✓ |

Action: R&D and G&A are above benchmarks — investigate if spending is driving proportional value

**Revenue per employee benchmarks**

| ARR range | Top quartile | Median | Bottom quartile |
|---|---|---|---|
| £1-5M | >£300K | £200K | £100K |
| £5-20M | >£350K | £250K | £150K |
| £20-50M | >£400K | £300K | £200K |
| £50M+ | >£500K | £350K | £250K |

Example:
- Company: £15M ARR, 60 employees
- Revenue per employee: £250K
- Benchmark (£5-20M range): Median = £250K
- Status: At median

Target: Growing revenue per employee over time (improving efficiency)

**How to benchmark effectively**

Step 1: Know your cohort

Compare against similar companies:
- Same ARR range
- Same segment (SMB vs enterprise)
- Same geography (UK vs US vs global)
- Same vertical (horizontal vs vertical SaaS)

Step 2: Select 5-7 key metrics

Recommended dashboard:

1. ARR growth rate (vs stage benchmark)
2. Net revenue retention (vs segment benchmark)
3. Gross margin (vs model benchmark)
4. Burn multiple (vs stage benchmark)
5. CAC payback (vs stage benchmark)
6. Rule of 40 score (universal benchmark)
7. Revenue per employee (vs stage benchmark)

Step 3: Track quarterly

| Metric | Q1 | Q2 | Q3 | Q4 | Benchmark |
|---|---|---|---|---|---|
| Growth | 65% | 58% | 52% | 48% | 60% |
| NRR | 105% | 108% | 110% | 112% | 108% |
| Gross margin | 76% | 77% | 78% | 79% | 78% |

Step 4: Identify gaps and prioritise

Priority matrix:
- Far below benchmark + high impact → Urgent fix
- Slightly below benchmark → Monitor and improve
- At or above benchmark → Maintain
- Well above benchmark → Potential to invest elsewhere

**Data sources for benchmarking**

Free sources:
- OpenView Partners SaaS Benchmarks (annual report)
- Bessemer Cloud Index (public SaaS metrics)
- KeyBanc SaaS Survey (annual)
- SaaStr benchmarks (conference data)

Paid sources:
- PitchBook / CB Insights
- SaaSGrid by ChartMogul
- Meritech Capital Public SaaS dashboard
- Industry analyst reports

Peer networks:
- CFO peer groups (e.g., SaaS CFO community)
- Board connections (VCs share portfolio benchmarks)
- Industry conferences

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "unit-economics-ltv-and-cac-payback", "profitability-analysis-and-operating-leverage", "rule-of-40-and-growth-efficiency", "financial-planning-and-budgeting"],
    faq: [
      { q: "What growth rate should my SaaS company target?", a: "Depends on ARR stage. £0-1M: 150-300%+ YoY. £1-5M: 100-200%. £5-20M: 60-100%. £20-50M: 35-60%. £50M+: 25-40%. Top quartile companies grow 2-3x faster than median. T2D3 framework (Triple, Triple, Double, Double, Double) is the gold standard path to £100M ARR. Compare against stage-appropriate benchmarks, not absolute numbers." },
      { q: "What is a good net revenue retention rate?", a: "Depends on segment. Enterprise: >130% top quartile, 115% median. Mid-market: >120% top quartile, 108% median. SMB: >110% top quartile, 100% median. NRR >100% means existing customers grow faster than churn. Example: 115% NRR means every £100 becomes £115 after one year. Best-in-class companies (Snowflake, Twilio) achieve 130-170%." },
      { q: "How do I know if my SaaS spending is efficient?", a: "Compare operational spending as % of revenue to benchmarks. Growth stage targets: COGS 15-25%, R&D 20-30%, S&M 30-50%, G&A 10-15%. Rule of 40: Growth + margin ≥ 40%. Burn multiple: Net new ARR ÷ burn >1.0x. Revenue per employee: £200-350K. If spending exceeds benchmarks, investigate whether extra spend drives proportional value." }
    ],
    videoUrl: ""
  }
];

export default batch370Articles;
