import { AcademyArticle } from "@/types/academy";

export const batch237Articles: AcademyArticle[] = [
  {
    slug: "profitability-analysis-and-operating-leverage",
    title: "Profitability Analysis and Operating Leverage: Building a Scalable Business",
    description: "Master profitability. Measure operating leverage, scale fixed costs, drive margins.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["profitability", "operating leverage", "margin", "fixed costs", "variable costs", "unit economics", "scalability", "operating expenses"],
    keyTakeaways: [
      "Operating leverage fundamentals: Revenue grows faster than costs (fixed costs absorbed by growth). Example: £100K revenue, £80K costs (80% OpEx ratio). Grow to £200K revenue, costs only £120K (60% OpEx ratio). Benefit: Profitability improves without effort (just scale). SaaS advantage: High fixed costs (engineering, platform), low marginal cost per customer (add customer = add infrastructure ~£0.50, not £100). At scale: £10M ARR at 30% OpEx ratio = £3M profit. Trajectory: Start unprofitable (invest), 0% margin at inflection (all revenue = profit at that exact point), then increasing margins as scale (fixed costs diluted).",
      "Fixed vs variable cost management: Fixed: Salaries (engineering, sales, admin), infrastructure base cost (servers for scale). Variable: CAC (per customer), infrastructure growth (servers for growth). Strategy: Automate variable (reduce CAC through self-serve, automation) to improve margins. Example: CAC £2K with sales team. Build self-serve → CAC £500. Revenue same, CAC lower = better margin (same revenue, higher profit). Monitor: Fixed cost ratio (should decline as revenue grows). Watch: If fixed costs grow faster than revenue = negative leverage (improving margin ratio).",
      "Margin expansion roadmap: Year 1: 60-70% OpEx ratio (building, investing). Year 2: 50-60% (starting to scale). Year 3: 40-50% (operating leverage kicks in). Year 4+: 30-40% (mature SaaS). Path: Grow revenue 50% YoY (scale), grow costs 30% YoY (leverage). Tactics: Improve automation (reduce CAC), improve productivity (engineer/AE output), raise prices (revenue without cost), reduce churn (improve LTV without new CAC). Example: Combine all = 30% revenue growth with 10% cost growth = margin expansion from 40% to 65% in 3 years."
    ],
    content: [
      {
        heading: "Building Operating Leverage",
        body: `Achieving profitability through scale.

**Operating leverage mechanics**

Definition: As revenue grows, profit grows faster (fixed costs leveraged)

Example:
| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Revenue | £1,000,000 | £2,000,000 | £4,000,000 |
| Fixed costs (salaries, base infra) | £600,000 | £800,000 | £1,200,000 |
| Variable costs (CAC, scaling infra) | £200,000 | £300,000 | £500,000 |
| Total costs | £800,000 | £1,100,000 | £1,700,000 |
| OpEx ratio | 80% | 55% | 42% |
| Profit | £200,000 | £900,000 | £2,300,000 |

Key insight: Revenue doubled, profit grew 4.5x (operating leverage)

**Cost structure by function**

Fixed costs (scale slower):
- Engineering: Salary + benefits (1 engineer at £150K)
- Leadership: Salary + benefits (VP at £300K)
- Platform infrastructure: Base cost (£10-50K/month)

Variable costs (scale with growth):
- CAC: Sales + marketing spend per customer
- Infrastructure: Servers scale with customer count
- Support: CS team grows with customers (ratio-based)

Goal: Maximize fixed costs (amortized across customers), minimize variable

**Margin expansion through scale**

Timeline to profitability:
- Year 1 (£1M ARR): 80% OpEx, -£200K profit (investing)
- Year 2 (£2M ARR): 60% OpEx, £400K profit (inflection)
- Year 3 (£5M ARR): 50% OpEx, £2.5M profit
- Year 4 (£10M ARR): 40% OpEx, £6M profit

Path to profitability:
1. Grow revenue (increase denominator, absorb fixed costs)
2. Improve metrics (reduce CAC, improve retention, raise prices)
3. Automate processes (reduce manual effort)
4. Consolidate infrastructure (better utilization)

Tactics to accelerate:
- Automation: Self-serve reduces CAC 70% (£2K → £500)
- Pricing: Raise 10% = +10% revenue, same cost = +10% profit
- Retention: Reduce churn 1% = extend LTV, amortize CAC
- Efficiency: Reduce CAC spend 20% (optimize channels) = -£50K cost

Example combined impact:
- Revenue 50% growth (focus on NRR, reduce CAC)
- Cost growth 30% (automation, efficiency)
- Result: Margin expansion from 40% to 70% in 3 years

**Profitability metrics to track**

| Metric | Target | Formula |
|---|---|---|
| Gross margin | 70-80% | (Revenue - COGS) / Revenue |
| Operating margin | 30-40%+ | (Revenue - OpEx) / Revenue |
| CAC payback | 6-12 months | CAC / (ARPU × Gross margin) |
| Magic number | >0.75 | Revenue growth / Sales + Marketing spend |
| Rule of 40 | 40%+ | Growth rate + Profit margin (shows balance) |

Monitor: Monthly (gross margin stable?), quarterly (operating leverage improving?)

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "financial-planning-and-budgeting", "cash-flow-management-and-working-capital"],
    faq: [
      { q: "When should my SaaS company be profitable?", a: "Typical: Year 2-3 at £2-5M ARR. Formula: 3-5 year path to profitability. Early: Invest heavily (negative margin), expect 3-4 years breakeven. Mature: 30-40%+ operating margin (revenue scale, fixed costs amortized). Path: Revenue 50% growth, cost growth 25-30% = improving margins." },
      { q: "How do I improve operating leverage?", a: "1. Grow revenue faster (scale fixed costs). 2. Reduce CAC (automation, channel optimization). 3. Raise prices (same cost, more revenue). 4. Improve retention (extend LTV, amortize CAC). 5. Automate processes (reduce manual effort). Combined: 50% revenue growth + 30% cost growth = margin expansion." },
      { q: "What's a good OpEx ratio?", a: "Early stage (£0-1M): 70-80% (investing, building). Growth (£1-5M): 50-60% (leverage starting). Scaling (£5-20M): 40-50% (operating leverage). Mature (>£20M): 30-40% (efficient at scale). Target: Improve 10-15% per year (revenue growing faster than costs)." }
    ],
    videoUrl: ""
  }
];

export default batch237Articles;