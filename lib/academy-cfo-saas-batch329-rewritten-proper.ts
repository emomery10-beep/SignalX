import { AcademyArticle } from "@/types/academy";

export const batch329Articles: AcademyArticle[] = [
  {
    slug: "profitability-analysis-and-operating-leverage",
    title: "Profitability Analysis and Operating Leverage: Building a Sustainable Business",
    description: "Master profitability analysis. Calculate margins, understand leverage, achieve profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["profitability", "operating leverage", "gross margin", "net margin", "leverage metrics"],
    keyTakeaways: [
      "Gross margin: Revenue minus cost of goods sold (COGS). Example: £100K revenue, £30K COGS, £70K gross profit (70% margin). High margin (60-80%) = good (more money for operations). Low margin (20-40%) = problematic (need volume). Operating leverage: As revenue grows, fixed costs spread across more customers (margins improve). Example: £100K revenue, £80K operating costs, -£10K profit. Then £150K revenue, same £80K costs, +£70K profit. Scale is powerful.",
      "Path to profitability: Gross profit > Operating expenses = breakeven. Two levers: (1) Grow revenue (increase denominator), (2) Reduce operating costs (decrease denominator). Combined impact: 50% revenue growth + 20% cost reduction = 70% profit improvement. Timeline: Typically 12-24 months if intentional. Key: Gross margin >50% critical (need enough to cover ops).",
      "Operating leverage metrics: (1) Gross margin %: 70% excellent, 50% acceptable, 30% problematic. (2) Operating expense ratio: 80% of revenue = high, 50% = efficient. (3) Months to profitability: If profitable, how long did it take? If negative, what's plan? (4) LTV:CAC: >3.0 excellent (expansion margin), <1.5 means losing money on customers."
    ],
    content: [
      {
        heading: "Analyzing Profitability and Building Operating Leverage",
        body: `Understanding margins and scaling to profitability.

**Profitability fundamentals**

Three layers of profitability:

Layer 1: Gross profit (revenue - COGS)
- COGS: Direct cost to deliver product (payment processing, hosting, support)
- Example: £100K revenue - £30K COGS = £70K gross profit
- Gross margin: £70K / £100K = 70%

Layer 2: Operating profit (gross profit - operating expenses)
- Operating expenses: Payroll, marketing, tools, rent
- Example: £70K gross profit - £80K opex = -£10K operating profit
- Operating margin: -£10K / £100K = -10% (not profitable yet)

Layer 3: Net profit (operating profit +/- other items)
- Other: Interest income/expense, taxes, one-time items
- Example: -£10K operating profit - £2K interest = -£12K net profit
- Net margin: -£12K / £100K = -12%

Profitability milestones:
- Gross profitable: Gross margin >0% (earning something on each sale)
- Operating profitable: Opex covered by gross profit (sustainable)
- Net profitable: After all costs, earning profit (ideal)

Timeline expectations:
- Early stage (seed): Negative on all layers (invest to grow)
- Growth stage (Series A/B): Gross profitable, operating negative
- Mature stage (Series C+): Operating profitable, net profitable

**Gross margin analysis**

Definition:
- Revenue minus cost of goods sold (COGS)
- For SaaS: Hosting, payment processing, support, refunds

Components of COGS:

Cloud hosting:
- Current: £5K/month per infrastructure
- Scale: As customers grow, hosting costs scale (variable)
- Optimization: Reduce per-customer cost as scale (CDN, caching, efficient architecture)

Payment processing:
- Typical: 2.2% + £0.30 per transaction (Stripe standard)
- Volume: If processing £100K revenue, cost ~£2.5K
- Percentage of revenue: 2.5%

Support costs:
- Customer support team: £20K/month (supports 1000 customers)
- Per customer: £20/customer per year
- Percentage of revenue: If £100K ARR, 1000 customers × £100 = £20/customer

Refunds/chargebacks:
- Typical: 1-2% of revenue (unhappy customers)
- Example: £100K revenue, £1-2K in refunds
- Percentage of revenue: 1-2%

Total COGS example:
- Hosting: £5K (5% of revenue)
- Payment processing: £2.5K (2.5%)
- Support: £2K (2%)
- Refunds: £1K (1%)
- Total COGS: £10.5K (10.5% of revenue)
- Gross profit: £89.5K (89.5% margin)

Gross margin benchmark by business model:

| Model | Typical Margin | Notes |
|---|---|---|
| SaaS (pure software) | 70-85% | Mostly hosting + payment |
| Marketplace | 20-40% | Payment to suppliers, losses |
| Consulting | 40-60% | Paying contractors/team |
| Product + services | 50-70% | Mix of product and labor |

Improving gross margin:

Tactic 1: Reduce infrastructure costs
- Optimization: Right-size resources (don't over-provision)
- Efficiency: Use cheaper hosting (AWS vs premium)
- Automation: Scale horizontally (cheaper than upgrading)
- Target: Reduce from 5% to 3% of revenue (save 2% margin)

Tactic 2: Reduce payment processing
- Negotiation: If processing £10M, Stripe may offer better rates
- Optimization: Fewer payment attempts (better design), reduce chargebacks
- Target: Reduce from 2.5% to 2% of revenue (save 0.5% margin)

Tactic 3: Improve support efficiency
- Automation: Self-service docs, chatbots, reduce support team size
- Scaling: Support team = fixed cost, scales with volume
- Target: Support from £2K to £1K (5% to 2.5% revenue saving)

Combined improvement:
- Current COGS: 10.5%
- Optimizations: -2.5% (hosting) -0.5% (processing) -0.5% (support)
- New COGS: 7.5%
- Gross margin improvement: 89.5% → 92.5% (+3%)

**Operating leverage**

Definition:
- As revenue grows, fixed costs spread across larger base
- Result: Profit margins improve significantly with scale

Example: Starting state

Revenue: £100K
Fixed costs (payroll, marketing, rent): £80K
Variable costs (COGS): £10K
Operating profit: £100K - £80K - £10K = £10K
Operating margin: 10%

Scale to 2x revenue:

Revenue: £200K
Fixed costs (payroll, marketing, rent): £85K (slightly up, but not 2x)
Variable costs (COGS): £20K (scales with revenue)
Operating profit: £200K - £85K - £20K = £95K
Operating margin: 47.5%

Impact of operating leverage:
- Revenue 2x (£100K → £200K)
- Operating profit 9.5x (£10K → £95K)
- Margin 10% → 47.5% (dramatic improvement)

Reason:
- Fixed costs don't double (payroll same, rent same, some overhead savings)
- Variable costs scale linearly with revenue
- Result: Profit scales faster than revenue

**Path to profitability**

Define breakeven:
- When gross profit = operating expenses
- When operating margin = 0%

Example:

Current state:
- Revenue: £100K
- Gross margin: 70% (£70K gross profit)
- Operating expenses: £80K
- Operating loss: -£10K

Path option 1: Grow revenue

Target: £114.3K revenue
- Gross profit: £114.3K × 70% = £80K
- Operating expenses: £80K (unchanged, fixed)
- Operating profit: £0 (breakeven!)

Revenue increase needed: 14.3% (£100K → £114.3K)
Timeline: 1-2 months at current growth

Path option 2: Reduce costs

Target: £70K operating expenses (same as current gross profit)
- Revenue: £100K (unchanged)
- Gross profit: £70K
- Operating expenses: £70K
- Operating profit: £0 (breakeven!)

Cost reduction needed: 12.5% (£80K → £70K)
Timeline: 1-2 months to execute

Path option 3: Combination (recommended)

Grow revenue 7% + Reduce costs 6%:
- New revenue: £107K
- Gross profit: £107K × 70% = £74.9K
- New operating expenses: £75.2K (1-6% reduction)
- Operating profit: ~£0 (breakeven)

Combined timeline: 2-3 months (less aggressive than either option alone)

**Operating expense analysis**

Typical operating expense breakdown:

| Category | Amount | % of Revenue |
|---|---|---|
| Payroll | £50K | 50% |
| Marketing | £15K | 15% |
| Tools/software | £8K | 8% |
| Rent/facilities | £4K | 4% |
| Professional services | £2K | 2% |
| Misc | £1K | 1% |
| Total | £80K | 80% |

Optimization opportunities:

Payroll (highest impact):
- Current: 50% of revenue (£50K for 5 people)
- Target: 40% of revenue (improve efficiency)
- Tactic: Increase revenue faster than headcount
- Timeline: As grow to £150K revenue, payroll stays £50K (now 33%)

Marketing (second lever):
- Current: 15% of revenue
- Target: 10% of revenue
- Tactic: Focus on high-ROI channels (cut low performers)
- Example: Paid ads cut 30%, organic increases
- Timeline: 1-2 months to adjust

Tools (easy win):
- Current: 8% of revenue
- Target: 5% of revenue
- Tactic: Cancel unused tools, negotiate better rates
- Example: £8K → £5K (save £3K)
- Timeline: 1 month (quick fix)

Combined optimization:
- Payroll: From 50% to 45% (grow revenue, same headcount)
- Marketing: From 15% to 12% (optimize channels)
- Tools: From 8% to 5% (cancel unused)
- Net: 73% opex → 62% opex (11% improvement!)

Impact on profitability:
- Current: £100K revenue, £70K gross profit, £80K opex = -£10K loss
- Optimized: £150K revenue (growth), £105K gross profit, £93K opex = +£12K profit
- Result: Profitable in 3-6 months (from loss to profit)

**Operating leverage in practice**

Monthly progression to profitability:

| Month | Revenue | COGS | Gross Profit | Opex | Op. Profit | Op. Margin |
|---|---|---|---|---|---|---|
| 1 | £100K | £10K | £90K | £80K | +£10K | 10% |
| 2 | £107K | £10.7K | £96.3K | £79K | +£17.3K | 16% |
| 3 | £115K | £11.5K | £103.5K | £79K | +£24.5K | 21% |
| 4 | £123K | £12.3K | £110.7K | £80K | +£30.7K | 25% |
| 5 | £131K | £13.1K | £117.9K | £81K | +£36.9K | 28% |
| 6 | £140K | £14K | £126K | £82K | +£44K | 31% |

Observations:
- Revenue grows 40% (£100K → £140K)
- Operating profit grows 440% (+£10K → +£44K)
- Operating margin improves from 10% to 31%
- Operating leverage in action (small revenue growth, massive profit growth)

**Key metrics to monitor**

Dashboard:

| Metric | Current | Target | Status |
|---|---|---|---|
| Gross margin | 70% | 72% | Monitor |
| Operating expenses % | 80% | 60% | High |
| Payroll % of revenue | 50% | 40% | High |
| Operating margin | -10% | 0% (breakeven) | Negative |
| Months to profitability | TBD | 6 | Track |

Actions:
- Gross margin: Optimize infrastructure (save 1-2%)
- Opex: Cut tools (save 3%), optimize marketing (save 3%)
- Payroll: Grow revenue faster than headcount
- Target: Breakeven in 6 months (achievable with effort)

`
      }
    ],
    relatedSlugs: ["gross-margin-optimization-and-cost-of-revenue", "operating-expense-management-and-control", "financial-planning-and-budgeting", "unit-economics-ltv-cac-payback", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What is gross margin and why does it matter?", a: "Gross margin: Revenue minus COGS (hosting, payment processing, support). Example: £100K revenue - £10K COGS = £90K gross profit (90% margin). Benchmark: SaaS typically 70-85% (good), <50% problematic. Key: Gross profit must cover operating expenses (if not, not sustainable). Improve: Reduce hosting costs, negotiate payment processing, automate support." },
      { q: "What is operating leverage?", a: "Operating leverage: As revenue grows, fixed costs spread across larger base. Example: Revenue 2x (£100K → £200K), operating costs only 1.06x (£80K → £85K), profit 9.5x (£10K → £95K). Impact: Small revenue growth = large profit growth. Why: Fixed costs (payroll, rent, marketing) don't scale with revenue. Key: Scale intentionally (grow revenue, keep fixed costs flat)." },
      { q: "How do I achieve profitability?", a: "Two paths: (1) Grow revenue (increase numerator), (2) Reduce costs (decrease denominator). Combination best. Example: £100K revenue, £70K gross profit, £80K opex = -£10K loss. Target: 15% revenue growth + 10% cost reduction = breakeven in 3-4 months. Monitor: Operating margin (track month-to-month). Focus: Payroll optimization (highest impact), then marketing efficiency." }
    ],
    videoUrl: ""
  }
];

export default batch329Articles;
