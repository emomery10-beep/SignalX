import { AcademyArticle } from "@/types/academy";

export const batch181Articles: AcademyArticle[] = [
  {
    slug: "p-l-statement-architecture-profitability",
    title: "P&L Statement Architecture and Profitability: Building Sustainable Business",
    description: "Master P&L statements. Structure expenses properly, understand profitability drivers, and build path to sustainable profit.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 8,
    keywords: [
      "P&L statement",
      "income statement",
      "profitability",
      "operating margin",
      "expense categorization",
      "cost structure",
      "breakeven",
      "profit and loss",
      "financial performance",
      "cost analysis"
    ],
    keyTakeaways: [
      "P&L structure: Revenue - COGS = Gross Profit - Operating Expenses = Operating Profit - Interest/Tax = Net Profit. Example: £100K revenue - £20K COGS = £80K GP (80%) - £50K opex = £30K operating profit (30%). Healthy SaaS: 30%+ operating margin at scale. Early stage: -20% to 0% (spending for growth) acceptable.",
      "Expense categories: COGS (direct costs), OpEx (salaries, rent, tools), Sales/Marketing (acquisition), G&A (admin, finance). Track by function: CEO should know department budgets. Example: Sales/Marketing 30% of revenue, Engineering 25%, G&A 15%, total 70%, gross profit 30% margin leaves 0% profit (breakeven). Optimize: Reduce OpEx 10% or increase revenue 15% to reach 30% profit.",
      "Profitability drivers: Revenue growth (top-line) + margin expansion (bottom-line). Example: £1M → £2M revenue (growth) but margin drops 30% → 20% (expenses growing faster). Better: £1M → £1.5M revenue + margin improves 30% → 35% (growing + getting more efficient). Both matter for shareholder value."
    ],
    content: [
      {
        heading: "P&L Structure and Components",
        body: `Building a proper income statement.

**Full P&L Format**

| Line | Amount |
|------|--------|
| Revenue | £100K |
| - Cost of Goods Sold (COGS) | -£20K |
| **Gross Profit** | **£80K** |
| **Gross Margin %** | **80%** |
| Operating Expenses: | |
| - Sales & Marketing | -£20K |
| - Engineering | -£25K |
| - General & Admin | -£10K |
| **Total OpEx** | **-£55K** |
| **Operating Profit** | **£25K** |
| **Operating Margin %** | **25%** |
| Other Income/Expense: | |
| - Interest expense | -£2K |
| - Investment income | £1K |
| **Pre-tax Income** | **£24K** |
| Taxes | -£5K |
| **Net Income** | **£19K** |
| **Net Margin %** | **19%** |

**Key Ratios**

Gross Margin = Gross Profit / Revenue = £80K / £100K = 80%
- Shows profitability of core business (before overhead)
- Healthy: 70-85% for SaaS
- Declining = product/delivery problem

Operating Margin = Operating Profit / Revenue = £25K / £100K = 25%
- Shows profitability after all operating costs
- Healthy: 15-25% for growth SaaS, 25%+ for mature
- Indicates ability to scale profitably

**Expense Categorization**

COGS (variable with revenue):
- Hosting costs
- Payment processing fees
- Support/onboarding staff
- Scales with customer count

Sales & Marketing (semi-variable):
- Sales salaries + commissions
- Marketing spend
- Can be controlled, but needed for growth

Engineering (mostly fixed):
- Engineers' salaries
- Infrastructure for product
- Should stay stable as % of revenue (improve efficiency)

G&A (overhead, mostly fixed):
- Finance, HR, Legal, Admin
- Doesn't scale much
- As % of revenue: Should decrease with scale

`
      },
      {
        heading: "Profitability Analysis",
        body: `Understanding what drives profit and loss.

**Breakeven Analysis**

Breakeven: Revenue = Total Expenses (Profit = 0)

Example:
- Fixed costs (salaries, rent): £60K/month
- Variable costs: 20% of revenue
- Revenue needed: X
- Equation: X - (0.2 × X) - 60K = 0
- Solve: 0.8X = 60K → X = £75K/month

Meaning: Need £75K revenue to cover all costs (zero profit).

Below £75K: Loss
Above £75K: Profit

Contribution margin (CM) = Revenue - Variable Costs = Revenue - COGS
- Example: £100K revenue - £20K COGS = £80K CM
- Covers fixed costs + profit
- If CM < Fixed costs, unprofitable

**Profitability Waterfall**

Starting: £0 (break-even, £75K revenue)

| Item | Amount | Cumulative |
|------|--------|-----------|
| Starting (at £75K revenue) | £0 | £0 |
| Revenue increase (to £100K) | +£25K | +£25K |
| COGS increase (20% × £25K) | -£5K | +£20K |
| OpEx increase (partially variable) | -£5K | +£15K |
| **Profit at £100K revenue** | **+£15K** | **+£15K** |

Shows how profit grows with revenue (if margins improve/costs controlled).

**Margin Compression Risk**

Problem: Revenue growing but expenses growing faster.

Example:

Year 1:
- Revenue £100K, COGS £20K, OpEx £50K → £30K profit (30% margin)

Year 2:
- Revenue £150K (+50%), COGS £35K (+75%), OpEx £80K (+60%) → £35K profit (23% margin!)
- Margin compressed despite revenue growth

Red flag: Revenue up 50% but margin down to 23%. Unsustainable.

Solution: Control OpEx growth (<40% if revenue growing 50%).

`
      },
      {
        heading: "Building Sustainable Profitability",
        body: `Path from losses to profit at scale.

**Growth vs Profitability Trade-off**

Early stage: Lose money, invest for growth.
- Example: £1M revenue, £1.5M costs = -£500K loss
- Invest in sales/marketing to grow
- Acceptable: Path to profitability clear

Mature stage: Balanced.
- Example: £10M revenue, £9M costs = £1M profit (10% margin)
- Still invest for growth, but also profitable
- Healthy: Profitable + growing

**Cost Structure by Stage**

Early (£500K ARR):
- COGS: 30%
- S&M: 40% (high acquisition spend)
- Engineering: 25% (building product)
- G&A: 10%
- Total OpEx: 75%, Loss: 5%

Growth (£5M ARR):
- COGS: 20% (scaling down)
- S&M: 25% (more efficient, leverage)
- Engineering: 20% (leverage)
- G&A: 10% (leverage)
- Total OpEx: 55%, Profit: 25%

Mature (£50M ARR):
- COGS: 15% (highly optimized)
- S&M: 15% (brand, less spend needed)
- Engineering: 15% (scale)
- G&A: 10% (leverage)
- Total OpEx: 40%, Profit: 45%

Key: As scale increases, OpEx % decreases (leverage).

**Path to Profitability Plan**

Current: -£20K/month loss
Goal: +£20K/month profit (£40K improvement)

Options:

Option A: Grow revenue 40%
- Revenue £100K → £140K
- COGS £20K → £28K
- Contribution margin improves £20K
- Still need £20K more (OpEx reduction)

Option B: Reduce OpEx 40%
- OpEx £100K → £60K
- Reduces burn £40K
- Unprofitable but less loss

Option C: Balanced approach
- Grow revenue 20% (£100K → £120K)
- COGS 20% × £20K = £4K increase
- Contribution margin improves £16K
- Reduce OpEx 10% (£100K → £90K)
- Net improvement: £16K + £10K = £26K
- New profit: -£20K + £26K = +£6K (close to goal)

Timeline:
- Q1: Implement cost cuts + launch growth initiatives
- Q2-Q3: Revenue growth + margin discipline
- Q4: Reach profitability (or close)

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "burn-rate-and-cash-runway-analysis",
      "metrics-dashboard-design-kpi-tracking",
      "gross-margin-expansion-and-cost-optimization",
      "quarterly-business-reviews-and-planning"
    ],
    faq: [
      {
        q: "What is a good operating margin for SaaS?",
        a: "Early stage: -20% to 0% (spending for growth). Growth stage: 0-20% (balancing growth/profit). Mature: 25%+ (profitable and efficient). Rule of 40: Growth % + Margin % > 40 indicates healthy business. Example: 30% growth + 15% margin = 45 (good)."
      },
      {
        q: "How do I structure my P&L for growth?",
        a: "COGS should improve with scale (% of revenue). OpEx should stay similar or decrease as % (leverage). Example: COGS 20% → 15%, OpEx 75% → 60%, margin improves 30% → 45%. Focus: Control OpEx growth (less than revenue growth). Don't sacrifice profit for short-term growth."
      },
      {
        q: "What's my breakeven point?",
        a: "Breakeven: Revenue = All Expenses. Calculate: (Fixed Costs) / (1 - Variable Cost %). Example: £60K fixed, 20% variable = £60K / 0.8 = £75K revenue breakeven. Above breakeven = profitable. Below = loss."
      },
      {
        q: "How do I achieve profitability?",
        a: "Two levers: (1) Grow revenue (increase denominator, improves margins naturally), (2) Control costs (reduce numerator, especially OpEx). Balanced: Grow 20% + cut OpEx 10% = path to profitability. Avoid: Growing revenue while OpEx grows 60%+ (margin compression)."
      }
    ],
    videoUrl: ""
  }
];

export default batch181Articles;
