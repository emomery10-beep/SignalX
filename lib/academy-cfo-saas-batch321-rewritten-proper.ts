import { AcademyArticle } from "@/types/academy";

export const batch321Articles: AcademyArticle[] = [
  {
    slug: "burn-rate-optimization-and-runway-extension",
    title: "Burn Rate Optimization and Runway Extension: Extending Time to Profitability",
    description: "Master runway extension. Optimize burn, extend runway, improve efficiency.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["burn rate", "runway optimization", "cash efficiency", "cost management", "expense reduction"],
    keyTakeaways: [
      "Burn rate = monthly cash spend. Example: £100K/month spend, £50K revenue = £50K net monthly burn. Runway = cash reserve / monthly burn (in months). £600K cash, £50K burn = 12 months runway. Problem: If burn increases or revenue decreases, runway shrinks fast. Opportunity: Optimize burn to extend runway (buy time to profitability). Cost: Usually requires cuts (hiring freeze, reduce spend). Benefit: More time (raises later, better terms), approach profitability (higher valuation).",
      "Burn reduction levers: (1) Reduce headcount (highest impact, 50-60% of costs), (2) Cut low-ROI spend (marketing, tools, contractors), (3) Optimize infrastructure (reduce hosting/cloud costs), (4) Renegotiate contracts (vendor costs). Cost: Headcount cuts = layoffs (difficult). Benefit: 30-50% burn reduction typical (extends runway significantly).",
      "Profitability path: When gross margin >operating costs = breakeven. Example: £100K revenue, 70% gross margin (£70K), £60K operating costs = £10K profit (profitable). Path: Grow revenue + reduce burn = approach profitability. Timeline: 12-24 months realistic with intentional focus. Impact: Dramatically improved position (can raise on better terms, or self-fund)."
    ],
    content: [
      {
        heading: "Optimizing Burn and Extending Runway",
        body: `Managing cash efficiency and path to profitability.

**Burn rate fundamentals**

Definition:
- Gross burn: Total monthly expenses
- Net burn: Monthly expenses minus revenue
- Example:
  - Expenses: £100K/month
  - Revenue: £30K/month
  - Net burn: £70K/month

Runway calculation:
- Runway (months) = Cash reserve / Monthly net burn
- Example: £500K cash, £50K net burn = 10 months

Runway scenarios:

| Months Left | Action |
|---|---|
| 24+ | Comfortable (invest in growth) |
| 18-24 | Plan ahead (fundraising, profitability) |
| 12-18 | Active planning (don't wait) |
| 6-12 | Urgent (must reduce burn or fundraise) |
| <6 | Crisis (immediate action needed) |

**Burn breakdown by function**

Typical startup (£100K/month burn):

| Function | Cost | % of Burn |
|---|---|---|
| Payroll | £60K | 60% |
| Infrastructure | £15K | 15% |
| Tools/Software | £10K | 10% |
| Marketing | £10K | 10% |
| Other | £5K | 5% |

Insight: Payroll = largest lever (60%)

**Burn optimization levers**

Lever 1: Reduce headcount (highest impact)

Option A: Hiring freeze
- Mechanism: Stop hiring, let attrition reduce headcount
- Timeline: 3-6 months to see impact (slow)
- Impact: -£5K/month per person not hired
- Example: Planned 10 hires this year → freeze → save £50K/month

Option B: Layoffs
- Mechanism: Reduce team significantly
- Cost: Severance, morale impact
- Timeline: Immediate
- Impact: -£60K if lay off 6 people (20% of team)
- Example: 30-person team, lay off 6 → £100K → £40K burn

Strategy: Hire freeze first (slow, less painful), layoffs last (painful but faster)

Lever 2: Reduce infrastructure costs

Cloud cost optimization:
- Audit: What's actually used? (often waste)
- Right-size: Stop over-provisioning
- Auto-scaling: Use when needed, reduce when not
- Typical savings: 20-30% (easy wins)

Example optimization:
- Current cloud spend: £15K/month
- Audit finds: 30% underutilized resources
- Optimization: Stop over-provisioning
- Savings: £4.5K/month (£15K × 30%)

CDN optimization:
- Current: £2K/month
- Optimization: Use caching better, reduce transfers
- Savings: £500/month (25%)

Total infrastructure savings: £4.5K + £500 = £5K/month (33% reduction)

Lever 3: Reduce marketing spend

Current marketing: £10K/month
- Paid ads: £6K
- Content: £2K
- Events: £2K

Optimization:
- Paid ads: Pause low-ROI channels, keep high-ROI only → -£2K
- Content: Reduce to critical posts only → -£500
- Events: Pause events, keep webinars → -£1K
- Total savings: £3.5K (35% reduction)

New marketing: £6.5K (still marketing, just more efficient)

Lever 4: Reduce other tools/services

Current tools: £10K/month
- SaaS platforms: £5K
- Contractors: £3K
- Software licenses: £2K

Optimization:
- SaaS: Cancel low-use services (£1K)
- Contractors: Pause non-critical projects (£1K)
- Licenses: Negotiate better rates (£500)
- Total savings: £2.5K (25% reduction)

**Combined optimization example**

Starting state:
- Payroll: £60K
- Infrastructure: £15K
- Tools: £10K
- Marketing: £10K
- Other: £5K
- Total: £100K/month

Actions:
1. Hiring freeze (save 5 planned hires) = -£20K payroll
2. Infrastructure optimization = -£5K
3. Marketing reduction = -£3.5K
4. Tool reduction = -£2.5K
5. Optional: Lay off 2 people = -£12K payroll

Scenario A (freeze + optimization, no layoffs):
- New burn: £100K - £20K - £5K - £3.5K - £2.5K = £69K
- Reduction: 31% (extends runway significantly)
- Example: 10 months → 13 months (3 extra months)

Scenario B (freeze + optimization + 2 layoffs):
- New burn: £69K - £12K = £57K
- Reduction: 43% (major extension)
- Example: 10 months → 15 months (5 extra months)

Impact: 5 extra months may be difference between fundraising success and failure

**Path to profitability**

Definition: Revenue ≥ Operating expenses

Equation: Gross profit (revenue × margin) ≥ Operating costs

Example:

Current state (not profitable):
- Revenue: £50K/month
- Gross margin: 70%
- Gross profit: £35K
- Operating costs: £70K
- Loss: -£35K/month

Profitability path 1: Grow revenue
- Target: Gross profit £70K to breakeven
- Need revenue: £100K/month (at 70% margin)
- Growth: 100% increase (£50K → £100K)
- Timeline: 12 months
- Investment: Continue growth spending (don't cut, invest more)

Profitability path 2: Reduce costs
- Target: Operating costs £35K to match current gross profit
- Reduction: 50% (£70K → £35K)
- Timeline: 3-4 months
- Method: Cut spending aggressively
- Risk: May impact growth (can't invest)

Profitability path 3: Combination (recommended)
- Grow revenue 30% (£50K → £65K, gross profit £45.5K)
- Reduce costs 25% (£70K → £52.5K)
- New result: £45.5K gross profit vs £52.5K costs = still -£7K
- Not quite there yet, but close
- Continue: Another quarter of growth + small cuts = breakeven

Timeline to profitability:

Month 1-3: Optimization (cut 25%, extend runway)
Month 4-12: Growth (grow revenue while maintaining efficiency)
Month 13+: Approaching breakeven (profitability possible)

**Efficiency metrics**

CAC payback:
- Current: £500 CAC, payback 8 months (good)
- Opportunity: Reduce CAC spend to lower burn
- Trade-off: May reduce growth (acquire fewer customers)
- Decision: Short-term (optimize for cash) vs growth (invest for future)

LTV:
- Current: £2K LTV (over customer lifetime)
- Improve: Reduce churn (extend lifetime)
- Impact: Higher LTV = can spend more on CAC later
- Strategy: Optimize retention (improves profitability)

Rule: LTV / CAC > 3 (healthy unit economics)
- If ratio falling → problem (inefficient acquisition)
- If ratio rising → good (more efficient growth)

**Profitability planning**

12-month plan:

Month 1-3: Foundation
- Reduce burn 25% (hiring freeze, cost cuts)
- Maintain revenue (don't cut customer-impacting functions)
- Runway extends: 10 months → 13 months
- Cost: Slower growth (hiring freeze)

Month 4-9: Growth
- Increase revenue 50% (£50K → £75K)
- Costs: Continue at reduced £75K (stable)
- Gross profit: £52.5K (at 70% margin)
- Path: Getting closer to breakeven
- Cost: Need to invest in growth (sales, marketing)

Month 10-12: Final push
- Revenue: £75K → £100K (30% growth)
- Costs: Reduce further to £65K (small optimization)
- Gross profit: £70K
- Costs: £65K
- Result: Breakeven (£5K monthly profit!)

Timeline: 12 months to profitability

Impact:
- Improved negotiating position (approach profitability = lower risk)
- Option for later fundraising (don't need it urgently)
- Possibility of self-funding growth (profits reinvested)

**Dashboard and monitoring**

Monthly metrics:

| Metric | Current | Target | Status |
|---|---|---|---|
| Monthly burn | £100K | £70K | On track (-30%) |
| Runway | 10 months | 15+ months | Target |
| Revenue | £50K | £65K | In progress |
| Gross margin | 70% | 70% | Stable |
| Gross profit | £35K | £45.5K | In progress |
| Operating costs | £70K | £52.5K | In progress |

Weekly tracking:
- Cash balance: Monitor daily (know exact runway)
- Spending: Any unexpected costs? (stay on budget)
- Revenue: On track to target?
- Attrition: Anyone leaving? (manage payroll)

Quarterly review:
- Profitability progress: Still on track?
- Market conditions: Has anything changed?
- Adjustments: Need to accelerate or decelerate plan?

**Common mistakes**

Mistake 1: Cut too aggressively
- Problem: Lay off talented people, kill growth initiatives
- Result: Company grows slower (hard to rebuild)
- Better: Gradual optimization (hiring freeze, efficiency)

Mistake 2: Cut wrong things
- Problem: Cut customer success (save cost, lose customers)
- Result: Churn increases, revenue decreases (backfires)
- Better: Cut non-core (marketing, tools, overhead)

Mistake 3: No growth mindset
- Problem: Pure cost-cutting focus (100% efficiency mode)
- Result: Company stagnates (zero growth)
- Better: Balance (maintain growth, just more efficient)

Mistake 4: Wait too long
- Problem: Runway 3 months, then panic (no time to optimize)
- Result: Emergency layoffs, bad outcomes
- Better: Plan when runway 12+ months (time to execute properly)

`
      }
    ],
    relatedSlugs: ["cash-runway-and-burn-rate-management", "financial-planning-and-budgeting", "profitability-analysis-and-operating-leverage", "metrics-dashboard-design-kpi-tracking", "scenario-planning-and-sensitivity-analysis"],
    faq: [
      { q: "How do I calculate burn rate and runway?", a: "Burn rate = monthly expenses - revenue (net monthly cash burn). Runway = cash reserve / monthly burn. Example: £100K/month spend, £50K revenue = £50K burn. £500K cash, £50K burn = 10 months runway. Action: When runway <12 months, start optimizing (freeze hiring, cut costs) or fundraising." },
      { q: "What's the fastest way to reduce burn?", a: "Fastest: Hiring freeze (stop new hires, 30-40% burn reduction typical). Next: Cut marketing/travel (10-15% reduction). Then: Infrastructure optimization (5-10% reduction). Combined: 45-65% possible. Cost: Slower growth (but extends runway 12+ months)." },
      { q: "How do I plan path to profitability?", a: "Two paths: (1) Grow revenue (hard, takes time), (2) Reduce costs (fast, but hurts growth). Best: Combination (grow 30% + reduce costs 25% = approach profitability). Timeline: 12 months typical. Monthly plan: Monitor revenue + costs, adjust as needed. Goal: Breakeven within 12 months (dramatically improves position)." }
    ],
    videoUrl: ""
  }
];

export default batch321Articles;