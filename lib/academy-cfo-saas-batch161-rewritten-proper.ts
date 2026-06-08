import { AcademyArticle } from "@/types/academy";

export const batch161Articles: AcademyArticle[] = [
  {
    slug: "burn-rate-and-cash-runway-analysis",
    title: "Burn Rate and Cash Runway Analysis: Managing Your Company's Lifespan",
    description: "Master burn rate and runway. Calculate how long your cash will last, understand burn drivers, and plan your path to profitability or next funding round.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "burn rate",
      "cash runway",
      "cash management",
      "cash flow",
      "profitability",
      "funding runway",
      "cash burn",
      "burn calculation",
      "cash reserves",
      "financial planning"
    ],
    keyTakeaways: [
      "Burn rate definition: Monthly cash spent (cash outflow minus inflow). Formula: (Starting cash - Ending cash) / Month count = monthly burn. Example: Jan £100K cash, Feb £80K = £20K monthly burn. At £20K/month, £100K runway = 5 months until zero cash (critical!). Key: Track actual burn monthly, project runway quarterly. Runway = Current cash / Monthly burn rate.",
      "Profitability math: Monthly revenue £100K, monthly costs £120K = £20K monthly burn (unprofitable). To break even: Either increase revenue 20% to £120K (hard), or cut costs 17% to £100K (easier). Path: Show board when breakeven (month 24?), what needs to change (revenue growth, cost cuts).",
      "Runway sensitivity: Starting cash £500K, monthly burn £30K = 16.7 month runway. But burn increases: Month 6 burn £35K → 14.3 month runway (recalculate). Sensitivity: Each 10% burn increase = 10-15% runway reduction. Monthly forecasting: Actual burn vs budget, adjust runway forecast."
    ],
    content: [
      {
        heading: "Understanding Burn Rate",
        body: `Calculating and tracking cash consumption.

**Burn Rate Definition**

Burn rate: Amount of cash company spends monthly.

Formula: (Starting cash balance - Ending cash balance) / Months = Monthly burn

Example month:
- Jan 1 cash: £100K
- Jan 31 cash: £80K
- Monthly burn: (£100K - £80K) / 1 = £20K

**Simple Burn Calculation**

Monthly P&L to cash burn:

| Item | Amount |
|------|--------|
| Revenue | £50K |
| COGS | -£10K |
| Gross Profit | £40K |
| Operating Expenses | -£60K |
| Operating Loss | -£20K |
| + Non-cash charges | £0 |
| **Net Monthly Cash Burn** | **£20K** |

Interpretation: Company spends £20K more cash than it receives monthly.

**Runway Calculation**

Runway: How many months until cash hits zero.

Formula: Current cash balance / Monthly burn rate = Months of runway

Example:
- Current cash: £100K
- Monthly burn: £20K
- Runway: £100K / £20K = 5 months

Critical: At 5 months runway, need to either:
1. Reach profitability (zero burn)
2. Raise funding (increase cash)
3. Cut costs (reduce burn)

**Burn Trajectory**

Burn rate changes over time (usually increases as company grows):

| Month | Headcount | Monthly Burn | Cumulative Burn | Remaining Cash |
|-------|-----------|---|---|---|
| Jan | 5 | £20K | £20K | £80K |
| Feb | 6 | £22K | £42K | £58K |
| Mar | 7 | £24K | £66K | £34K |
| Apr | 8 | £26K | £92K | £8K |
| May | - | - | - | ZERO (ran out) |

Insight: Company out of cash in May if burn continues increasing.

**Fixed vs Variable Burn**

Fixed burn (doesn't scale):
- Salaries, rent, tools
- Example: £15K/month fixed

Variable burn (scales with growth):
- Sales commissions, hosting costs
- Example: 5% of revenue

Total burn = Fixed + Variable

If revenue growing, variable burn increases → total burn increases.

`
      },
      {
        heading: "Profitability Path",
        body: `Planning the journey to cash-positive.

**Unprofitable → Profitable Transition**

Current state: Unprofitable (burning cash).

Example:
- Monthly revenue: £100K
- Monthly costs: £120K
- Monthly burn: £20K

To reach profitability (zero burn):

Option A: Grow revenue 20% → £120K revenue, break even
- Challenge: Market conditions, sales capacity
- Timeline: 6-12 months realistic

Option B: Cut costs 17% → £100K costs, break even
- Easier: Reduce hiring, eliminate projects, negotiate vendor costs
- Timeline: Immediate (1-3 months)

Option C: Balanced approach
- Grow revenue 10% → £110K
- Cut costs 8.3% → £110K
- Timeline: 6 months

**Unit Economics Path**

Improve profitability by improving unit economics:

Current:
- CAC: £4K
- LTV: £60K
- LTV/CAC: 15x (healthy)
- But: Current burn £20K because of heavy sales/marketing spend

Option: Shift to lower CAC channel
- Current: £200K S&M spend → 50 customers
- New: £150K S&M spend → 40 customers (20% less spend, 20% fewer customers)
- Burn: £20K → £15K (25% reduction)
- Runway improves from 5 months to 6.7 months

Trade-off: Slower growth for longer runway.

**Profitability Timeline**

Build a roadmap:

| Quarter | Revenue | Costs | Burn | Cumulative Burn | Cash Remaining |
|---------|---------|-------|------|---|---|
| Q1 (now) | £100K | £120K | £20K | £60K | £40K |
| Q2 | £120K | £130K | £10K | £90K | £10K |
| Q3 | £150K | £150K | £0K | £90K | £10K |
| Q4 | £180K | £160K | -£20K | £70K | £30K |

Timeline: Break even Q3, profitable Q4. But tight — if Q2 misses, out of cash.

Better strategy: Build profitability buffer by raising funding or cutting earlier.

`
      },
      {
        heading: "Burn Rate Management",
        body: `Controlling and forecasting burn.

**Monthly Burn Tracking**

Track actual burn vs budget:

| Month | Budgeted Burn | Actual Burn | Variance |
|-------|---|---|---|
| Jan | £20K | £20K | On track |
| Feb | £20K | £22K | +£2K (2% overspend) |
| Mar | £20K | £24K | +£4K (4% overspend) |

Insight: Actual burn trending higher. Reasons:
- Hiring ahead of schedule
- Tool costs higher than expected
- Revenue lower than forecast (burn %, not absolute)

Action: Investigate overspend, adjust forecast.

**Controllable Burn Levers**

Variable costs (can reduce):
- Sales commissions: 5% of revenue → cut to 4% (£5K savings if £100K revenue)
- Hosting costs: Optimize infrastructure → 10% savings (£1K savings)
- Contractors/agencies: Reduce spending → £2K savings
- Total potential: £8K savings (40% burn reduction)

Fixed costs (harder to reduce):
- Salaries: Cut headcount or freeze hiring (3 month delay = £15K savings)
- Rent: Renegotiate or move office (costly, slow)
- Tools: Consolidate, cancel unused (£1K savings)
- Total potential: £16K savings (80% burn reduction)

Strategy: Variable cost cuts first (fastest). Fixed cost cuts if critical.

**Runway Sensitivity Analysis**

Base case: £100K cash, £20K burn = 5 month runway

Scenarios:

Optimistic:
- Revenue +30% → burn £10K (only variable costs)
- Runway: £100K / £10K = 10 months

Pessimistic:
- Revenue -20% → burn £30K (fixed costs remain)
- Runway: £100K / £30K = 3.3 months

Insight: Revenue changes impact runway significantly.

**Burn Forecast Updates**

Update runway quarterly:

Q1 actual: £100K opening, £60K closing = £40K burn (£20K/month)
Q2 forecast: Assuming £50K monthly burn (higher due to hiring)
- Remaining: £40K
- Q2 projected close: £40K - £150K burn = NEGATIVE (problem!)
- Action: Cut burn by 30% or raise funding before Q2 starts

Time-sensitivity: Update forecasts early, act before crisis.

`
      },
      {
        heading: "Planning for Profitability",
        body: `Building the path to sustainability.

**Profitability Scenarios**

Scenario 1: Revenue growth (path up)
- Current: £100K revenue, £120K costs
- Month 6: £150K revenue, £130K costs (profitable!)
- Requires: Sales capacity, market demand, execution

Scenario 2: Cost reduction (path down)
- Current: £100K revenue, £120K costs
- Month 3: £100K revenue, £100K costs (profitable!)
- Requires: Difficult decisions (cut headcount, eliminate projects)

Scenario 3: Funding + time (path forward)
- Raise £300K funding in month 2
- Use to extend runway to 15 months
- Target: Reach profitability month 8-12
- Requires: Investor support, clear path to profitability

Most realistic: Combination
- Grow revenue (20% → £120K)
- Cut costs (8% → £110K)
- Raise small round (£200K)
- Timeline: Profitable month 12

**Runway vs Profitability Trade-off**

Conservative (protect runway):
- Slow hiring (extend runway longer)
- Cut aggressive experiments
- Improve unit economics first
- Result: 12+ month runway, slower growth

Aggressive (go for growth):
- Hire fast (reduce runway)
- Invest in marketing (burn faster)
- Bet on revenue growth
- Result: Shorter runway (6-8 months), faster growth

Best approach: Start conservative (build runway buffer), turn aggressive once unit economics prove.

**Communication to Board/Investors**

Show profitability path clearly:

"Path to profitability:
- Current: £100K MRR, unprofitable (£20K monthly burn)
- Target: Profitability by Q4 2024 (month 9)
- Strategy:
  1. Grow revenue 50% (£150K MRR by month 9)
  2. Maintain costs flat (ops efficiency)
  3. Result: Profitable at £150K MRR
- Risk: Revenue growth misses, churn increases
- Mitigation: Cost cuts prepared if revenue targets missed"

Clear roadmap builds investor confidence.

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "p-l-statement-architecture-profitability",
      "unit-economics-ltv-cac-payback",
      "funding-and-investment"
    ],
    faq: [
      {
        q: "How do I calculate my burn rate?",
        a: "Simple: (Starting cash - Ending cash) / Months = Monthly burn. Example: Jan £100K, Feb £80K = £20K monthly burn. Or: Actual monthly revenue minus actual monthly expenses (excluding non-cash charges). Track both methods to ensure accuracy."
      },
      {
        q: "How do I calculate runway?",
        a: "Runway = Current cash balance / Monthly burn rate. Example: £100K cash / £20K burn = 5 months. Update monthly. Critical milestones: 6 months runway (safe), 3 months runway (urgent to act), <1 month (crisis)."
      },
      {
        q: "What should my burn rate be?",
        a: "Depends on stage/growth. Early stage: 20-40% monthly burn acceptable if reaching profitability path. Growth stage: <10% burn rate expected. Profitable stage: 0% burn (or positive). Key: Show clear path to profitability. Investors care less about current burn, more about trajectory."
      },
      {
        q: "How do I extend my runway?",
        a: "Three levers: (1) Reduce burn (cut costs 20-30% if needed), (2) Increase revenue (even small improvements help), (3) Raise funding (immediate but dilutive). Best: Combination of all three. Act early when runway >6 months, not when desperate."
      }
    ],
    videoUrl: ""
  }
];

export default batch161Articles;
