import { AcademyArticle } from "@/types/academy";

export const batch208Articles: AcademyArticle[] = [
  {
    slug: "profitability-analysis-and-operating-leverage",
    title: "Profitability Analysis and Operating Leverage: Building Sustainable Economics",
    description: "Master profitability. Calculate unit economics, improve leverage, and build path to profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "profitability",
      "operating leverage",
      "unit economics",
      "gross margin",
      "operating margin",
      "breakeven analysis",
      "fixed costs",
      "variable costs",
      "leverage",
      "profitability path"
    ],
    keyTakeaways: [
      "Operating leverage: As revenue grows, fixed costs (R&D, admin) spread across more customers = improving margins. Example: £1M revenue, £800K fixed costs + £200K variable = 20% net margin. £5M revenue, same £800K fixed costs + £1M variable = (£5M - £800K - £1M) / £5M = 52% net margin (same spend, 2.5x revenue). Key: Keep fixed costs flat as revenue grows (leverage). Risk: Add headcount = increases fixed costs (reduces leverage). Target: 40%+ operating margin by £10M ARR (healthy SaaS).",
      "Path to profitability: Time = revenue growth + cost control. Example: £10M ARR company, 30% growth (£3M new), 10% OpEx growth (£300K new spending). If £3.3M revenue increase exceeds £300K cost increase, move closer to profitability. Conservative: Assume breakeven when operating expenses = gross profit. At £10M ARR, 75% gross margin = £7.5M gross profit. If OpEx £3M, operate at +£4.5M profit. If OpEx £4M, operate at +£3.5M profit. Plan: Manage OpEx growth ≤ gross profit growth (or face losses).",
      "Unit economics at scale: Per-customer COGS decreases as scale. Example: £1M ARR, 100 customers, £200K COGS = £2K per customer. £5M ARR, 250 customers, £250K COGS = £1K per customer (50% improvement). Drivers: Infrastructure cost spread (AWS gets cheaper with volume), shared support (1 CS person serves more customers as they self-serve), automation (less manual work per customer). Optimize: Invest in automation (self-serve, chatbots, knowledge base) = reduces per-customer cost = improves margin."
    ],
    content: [
      {
        heading: "Operating Leverage and Margin Expansion",
        body: `Understanding how profitability improves with scale.

**Fixed vs. Variable Costs**

Fixed costs (don't change with revenue):
- R&D (salaries, tools, infrastructure)
- Sales leadership (VP sales salary)
- Admin (finance, HR, operations)
- Office rent
- Example: £1M startup, fixed costs £800K (regardless of revenue)

Variable costs (scale with revenue):
- Payment processing (2% of revenue)
- Cloud infrastructure (scales with usage)
- Support (one CS person handles more customers, but ramp-up)
- Customer success tools
- Example: £1M revenue, variable cost £200K (20% of revenue)

Example margin at different scales:
| ARR | Revenue | Fixed costs | Variable costs | Total COGS | Net profit | Margin |
|---|---|---|---|---|---|---|
| £1M | £1M | £800K | £200K | £1M | £0 | 0% |
| £5M | £5M | £800K | £1M | £1.8M | £3.2M | 64% |
| £10M | £10M | £1M | £2M | £3M | £7M | 70% |
| £20M | £20M | £1.2M | £4M | £5.2M | £14.8M | 74% |

Key insight: Fixed costs spread across more revenue = improving margin

**Path to operating profitability**

Current state: £10M ARR, 30% growth rate (£3M new), OpEx growing at 10%
- Current OpEx: £3M
- Current net profit: £10M - £3M (COGS) - £3M (OpEx) = £4M (40% margin)
- Already profitable! (not common until scale)

Example: £5M ARR, break-even (not yet profitable)
- Revenue: £5M
- COGS: £1.8M (variable + fixed portion)
- Gross profit: £3.2M
- OpEx: £3M (sales, marketing, admin)
- Net profit: £0.2M (barely profitable)

To accelerate to profitability:
Option 1: Grow revenue faster (30% → 40%)
- New revenue: £6.5M
- Gross profit: £4.55M
- If OpEx flat £3M: Net profit £1.55M (24% margin)

Option 2: Reduce OpEx (without impacting growth)
- Revenue: £5M (unchanged)
- Gross profit: £3.2M
- OpEx reduced: £2.8M (cut 7%, consolidate vendors, reduce travel)
- Net profit: £0.4M (8% margin, improved)

Option 3: Balanced (grow 5%, reduce OpEx 3%)
- Revenue: £5.25M
- Gross profit: £3.36M
- OpEx reduced: £2.91M
- Net profit: £0.45M (9% margin)

**Gross margin expansion**

Three levers to improve gross margin:
1. Increase pricing (same cost = higher margin)
2. Reduce COGS (automation, efficiency, scale)
3. Shift product mix (higher-margin products)

Typical gross margin by product:
- Infrastructure/compute: 60-70% (variable costs high)
- Finance/analytics SaaS: 75-85% (lower variable costs)
- Marketplace/platform: 50-70% (highly variable, depends on model)
- SaaS average: 75% (healthy)

Improving gross margin example:
- Current: 75% margin, £1M COGS on £4M revenue
- Target: 78% margin (by reducing support costs 20%)
- New COGS: £800K (save £200K)
- New gross profit: £3.2M (gain £200K)

How:
- Implement chatbot (reduce support volume 20%)
- Build knowledge base (self-service, reduce tickets)
- Automate billing (reduce manual processing)

`
      },
      {
        heading: "Unit Economics and Profitability Metrics",
        body: `Analyzing profitability per customer.

**Per-customer profitability**

Customer lifetime profit:
- LTV (lifetime value): ARPU × months until churn
- CAC (customer acquisition cost): Sales + marketing spend / new customers
- Profit per customer: LTV - CAC - (COGS per customer × months)

Example:
- ARPU: £100/month
- Months until churn: 50 months (2% monthly churn)
- LTV: £5K
- CAC: £1K
- COGS per customer per month: £20
- COGS lifetime: £20 × 50 = £1K
- Profit per customer: £5K - £1K - £1K = £3K

Improving unit economics:
1. Increase ARPU (£100 → £120) = LTV £6K, profit £4K (+33%)
2. Reduce CAC (£1K → £800) = profit £3.2K (+7%)
3. Reduce COGS per month (£20 → £15) = COGS lifetime £750, profit £3.25K (+8%)
4. Reduce churn (50 months → 60 months) = LTV £6K, profit £4K (+33%)

Ranking impact: Reduce churn > increase ARPU > reduce COGS > reduce CAC

**Blended unit economics (portfolio)**

Company with multiple products:
| Product | ARPU | LTV | CAC | Profit per customer |
|---|---|---|---|---|
| Core | £100 | £5K | £1K | £3K |
| Add-on | £30 | £1.5K | £200 | £1K |
| Enterprise | £1K | £50K | £5K | £40K |
| Blended | £200 | £10K | £1.5K | £6.5K |

Portfolio optimization:
- Current: 50% core, 30% add-on, 20% enterprise
- Better: 40% core, 25% add-on, 35% enterprise (more enterprise, higher profit)
- Impact: Profit per customer £6.5K → £8K (+23%)

Strategy: Shift product mix toward high-profit products (upsell enterprise, reduce unprofitable segments)

**Operating leverage by ARR stage**

| Stage | ARR | Customers | ARPU | COGS % | OpEx % | Net margin |
|---|---|---|---|---|---|---|
| Early | £1M | 100 | £10K | 30% | 80% | -10% |
| Growing | £5M | 500 | £10K | 25% | 60% | 15% |
| Scale | £10M | 1000 | £10K | 22% | 40% | 38% |
| Mature | £25M | 2500 | £10K | 20% | 30% | 50% |

Key insight: Each doubling of revenue, margin improves 10-15% (operating leverage)

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "gross-margin-expansion-and-cost-optimization",
      "p-l-statement-architecture-profitability",
      "financial-forecasting-modeling",
      "pricing-strategy-and-price-optimization"
    ],
    faq: [
      {
        q: "What's operating leverage?",
        a: "As revenue grows, fixed costs spread across more customers = improving margins. Example: £1M ARR with £800K fixed costs = 0% margin. £5M ARR, same £800K fixed costs = 60%+ margin. Key: Don't increase fixed costs with revenue (keep headcount growth ≤ revenue growth). Target: 40%+ operating margin by £10M ARR (sign of healthy leverage)."
      },
      {
        q: "How do I improve profitability?",
        a: "Three levers: (1) Grow revenue (30% YoY), (2) Reduce OpEx (keep growth ≤ revenue growth), (3) Improve gross margin (automation, reduce COGS). Example: £5M, break-even. Grow to £6.5M (+30%), reduce OpEx 3% → net profit 24% margin. Or reduce COGS via chatbot/automation → save £200K, improve margin 3%."
      },
      {
        q: "What's a unit economic and why does it matter?",
        a: "Profit per customer = LTV - CAC - (COGS per customer × lifetime). Example: LTV £5K, CAC £1K, COGS lifetime £1K = £3K profit per customer. Improve: Reduce churn (50 → 60 months) = £4K profit (33% improvement). Most impactful: Reduce churn > increase price > reduce acquisition cost. Focus: Highest-ROI lever for profitability."
      },
      {
        q: "At what revenue does a SaaS company become profitable?",
        a: "Typical: £5-10M ARR (2-3 years after seed). Depends on: Gross margin (75%+), OpEx efficiency (keep growth ≤ revenue growth), unit economics (LTV > CAC). Example: £5M ARR, 75% gross margin = £3.75M gross profit. If OpEx £3M, net profit £750K (15% margin, profitable). If OpEx £4M, still losing £250K. Goal: Path to profitability clear by Series A (40%+ margin by exit)."
      }
    ],
    videoUrl: ""
  }
];

export default batch208Articles;
