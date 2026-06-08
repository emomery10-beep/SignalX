import { AcademyArticle } from "@/types/academy";

export const batch327Articles: AcademyArticle[] = [
  {
    slug: "financial-planning-and-budgeting",
    title: "Financial Planning and Budgeting: Building Financial Discipline",
    description: "Master financial planning. Build budgets, forecast, control spending.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["financial planning", "budgeting", "financial forecasting", "expense planning", "cash flow planning"],
    keyTakeaways: [
      "Financial planning cycle: (1) Forecast revenue (based on pipeline, growth assumptions), (2) Plan expenses (by function: payroll, tools, marketing), (3) Set targets (profitability path, runway goal), (4) Monitor actuals (vs budget, track variance). Benefit: Know where money goes, spot problems early, make data-driven decisions. Cost: Time (monthly P&L close, variance analysis). ROI: High (prevents overspending, improves efficiency).",
      "Budget categories: (1) Payroll (60-70% of burn, highest lever), (2) Infrastructure/tools (10-15%, lower priority), (3) Marketing (10-20%, variable by strategy), (4) Operations (5-10%, overhead). Typical startup £100K/month: Payroll £60K, Infrastructure £15K, Marketing £15K, Operations £10K. Optimize: Cut tools first (easy), payroll last (painful). Growth lever: Reallocate to highest ROI (usually sales/product).",
      "Budget process: Q1 planning (set annual budget, monthly targets), Q2-Q4 execution (track actuals, manage variance), quarterly reforecasting (update based on reality). Variance: <5% good, 5-15% acceptable, >15% investigate (something changed). Key: Budget is guide not gospel (adjust as learn), but discipline prevents chaos."
    ],
    content: [
      {
        heading: "Building and Managing Financial Plans and Budgets",
        body: `Creating financial discipline through planning and monitoring.

**Financial planning fundamentals**

Definition:
- Process of forecasting revenue and expenses
- Setting targets (runway, profitability, growth)
- Monitoring actual vs budget
- Making adjustments as needed

Annual planning cycle:

Q1 (Jan-Mar):
- Forecast revenue for year (based on pipeline, growth assumptions)
- Plan expenses for year (by function, by month)
- Set targets (profitability timeline, runway goal, growth targets)
- Board approval (if applicable)

Q2-Q4 (Apr-Dec):
- Monthly tracking (actual revenue vs forecast, actual expenses vs budget)
- Variance analysis (why are we different from plan?)
- Reforecasting (update projections based on actual)
- Adjustments (if trajectory changed significantly)

Key benefits:
- Visibility (know where money goes)
- Control (identify overspending before crisis)
- Planning (make data-driven decisions)
- Accountability (team owns their budget)

**Building an annual budget**

Step 1: Forecast revenue

Base revenue (known):
- Current MRR: £100K
- Contract length: Mix of monthly (50%), annual (50%)
- Probability of churn: 5% monthly
- Example: Start of year £100K MRR

Revenue forecast:
- Month 1: £100K (current baseline)
- Add new: +5 customers/month × £2K = +£10K
- Minus churn: -5% × £100K = -£5K
- Net: +£5K/month
- Month 2: £105K, Month 3: £110K... Month 12: £155K

Annual revenue: Average of months = ~£127K/month × 12 = £1.52M

Reality check:
- Base case: £1.5M (conservative)
- Upside case: £2M (if acquisition improves)
- Downside case: £1M (if churn increases)
- Use base case for planning

Step 2: Plan expenses

Function 1: Payroll

Components:
- Salaries: Current employees + planned hires
- Example: £35K salary × 4 engineers = £140K annual
- Benefits: 20-25% of salary (health, 401k, etc.) = £140K × 20% = £28K
- Taxes: 15-20% of salary (employer taxes) = £140K × 15% = £21K
- Total: £140K + £28K + £21K = £189K

Headcount plan:
- Jan-Mar: Current team (4 eng, 2 sales, 1 ops = 7 people)
- Apr-Jun: Add 2 engineers (9 people)
- Jul-Sep: Add 1 sales, 1 CS (11 people)
- Oct-Dec: Add 1 ops (12 people)

Monthly payroll:
- Jan-Mar: 7 people × average £8K = £56K
- Apr-Jun: 9 people × average £8K = £72K
- Jul-Sep: 11 people × average £8K = £88K
- Oct-Dec: 12 people × average £8K = £96K

Annual payroll: (£56K × 3) + (£72K × 3) + (£88K × 3) + (£96K × 3) = £912K

Function 2: Infrastructure/tools

SaaS software (cloud, tools, services):
- Cloud hosting: £5K/month (scales with usage)
- SaaS platforms: £3K/month (Stripe, Salesforce, etc.)
- Monitors/security: £1K/month
- Total: £9K/month = £108K annual

Function 3: Marketing/sales

Growth spend:
- Paid ads: £5K/month (Facebook, Google, LinkedIn)
- Content/PR: £2K/month (freelancers, tools)
- Events/sponsorship: £3K/month (quarterly events + sponsorship)
- Total: £10K/month = £120K annual

Function 4: Operations/other

Admin costs:
- Office/space: £2K/month
- Legal/accounting: £2K/month
- Insurance: £1K/month
- Misc: £1K/month
- Total: £6K/month = £72K annual

Total annual budget:

| Function | Monthly | Annual |
|---|---|---|
| Payroll | £72-96K | £912K |
| Infrastructure | £9K | £108K |
| Marketing | £10K | £120K |
| Operations | £6K | £72K |
| Total | £97-121K | £1.212M |

Monthly average: £101K/month

Step 3: Determine cash runway

Starting cash: £600K
Monthly burn: £101K
Runway: £600K / £101K = 5.9 months

Problem: Only 6 months runway, too short!

Options:
1. Reduce burn: Cut costs by 30% (get to 14-month runway)
2. Increase revenue: Grow faster (extend runway through revenue)
3. Fundraise: Raise capital (common solution)

Step 4: Set targets

Profitability goal:
- When will company break even?
- Gross profit > Operating costs = breakeven
- Current: £100K revenue × 70% margin = £70K gross profit
- Operating costs: £101K (not profitable)
- Target: Need £144K revenue (at 70% margin = £100.8K gross profit)
- Timeline: 12 months to profitability (with growth plan)

Runway goal:
- Current: 6 months (too low)
- Target: 18 months (comfortable, time to fundraise)
- Solution: Fundraise (raise £1.2M to extend runway)

Growth targets:
- Revenue: £100K → £150K MRR by year-end (50% growth)
- Headcount: 7 → 12 people (adding talent)
- Unit economics: Maintain 70% gross margin, improve LTV/CAC

**Monthly budget monitoring**

Monthly budget template:

| Category | Budget | Actual | Variance | % Variance |
|---|---|---|---|---|
| Revenue | £100K | £98K | -£2K | -2% |
| COGS | £30K | £31K | -£1K | -3% |
| Gross profit | £70K | £67K | -£3K | -4% |
| Payroll | £80K | £82K | -£2K | -3% |
| Infrastructure | £9K | £9K | £0 | 0% |
| Marketing | £10K | £12K | -£2K | -20% |
| Operations | £6K | £5K | £1K | +17% |
| Operating expenses | £105K | £108K | -£3K | -3% |
| Operating loss | -£35K | -£41K | -£6K | variance |

Analysis:
- Revenue missed (£98K vs £100K, -2%, acceptable)
- Gross profit lower (due to COGS spike, investigate)
- Marketing overspent (£12K vs £10K, +20%, why?)
- Operations under (£5K vs £6K, under budget)
- Overall variance: -3% on operating expenses (acceptable)

Variance rules:
- <5% variance: On track
- 5-10% variance: Monitor (acceptable but watch)
- >10% variance: Investigate (something changed, needs explanation)

**Quarterly reforecasting**

Q1 planning: Set budget
- Revenue forecast: £1.5M for year
- Expense plan: £1.2M
- Expected loss: £300K for year

Q2 reality: Actual is different
- Q1 actual revenue: £285K (vs £300K budgeted, -5%)
- Q1 actual expenses: £301K (vs £300K, on track)
- Issue: Revenue missing, churn higher than expected

Q2 reforecast:
- Revise annual revenue down: £1.4M (5% lower than plan)
- Keep expenses (payroll locked in)
- New projected loss: £400K (vs £300K planned, additional £100K burn)
- Runway reduced: From 6 months to 5 months
- Action: Need to fundraise sooner, or cut costs

Quarterly review:

| Item | Plan | Actual (Q1) | Revised Plan | Status |
|---|---|---|---|---|
| Annual revenue | £1.5M | (£285K Q1) | £1.4M | -7% |
| Annual expenses | £1.2M | (£301K Q1) | £1.2M | On track |
| Runway (months) | 6 | (5 at new burn) | 4.5 | Shortened |
| Action | Fundraise | Emergency | Fundraise ASAP | Red |

**Budget controls and discipline**

Control 1: Approval limits

Policy:
- <£1K: Any manager can approve
- £1-5K: Department head approval
- £5-10K: CFO approval
- >£10K: CEO/board approval

Purpose:
- Prevent overspending
- Catch mistakes early
- Accountability (people responsible for budget)

Control 2: Hiring freeze triggers

Policy:
- If runway falls below 12 months: Hiring freeze
- If revenue misses forecast by >10%: Review hires
- If burn increases >10%: Reassess headcount plan

Purpose:
- Flexible adjustment (can reduce payroll if needed)
- Prevents overcommitment (payroll is fixed cost)

Control 3: Monthly closing

Process:
- Month-end: Close P&L (confirm revenue, expenses)
- Week 1 of next month: Management review (why variance?)
- Week 2: Board/team communication (here's how we did)
- Week 3: Planning (adjustments needed?)

Purpose:
- Discipline (close quickly)
- Visibility (everyone knows numbers)
- Accountability (manage to budget)

**Common budgeting mistakes**

Mistake 1: Overly optimistic forecasts

Problem:
- Forecast 100% growth (unlikely)
- Revenue plan impossible (stretch goal, not plan)
- Reality: 20-50% growth more realistic
- Result: Always under budget (demoralization)

Fix:
- Conservative assumptions (what's most likely?)
- Base case (realistic), upside (if everything goes well), downside (if market shifts)
- Use base case for planning

Mistake 2: Not adjusting for reality

Problem:
- Set budget January, never update
- June revenue £20K below plan, ignore it
- Still plan for same expense level

Fix:
- Quarterly reforecasting (adjust based on actual)
- Monthly variance review (understand why different)
- Adjust expenses if revenue missing (reduce burn)

Mistake 3: No owner accountability

Problem:
- Marketing team: "We have £10K budget, spent £12K" (no consequence)
- No one responsible for staying within budget

Fix:
- Assign owner (person responsible for each category)
- Monthly check-in (variance review, explain over/unders)
- Tie to goals (bonus for coming in under budget on high ROI spend)

Mistake 4: Budget vs actual not reconciled

Problem:
- Budget says £100K revenue, actual shows £98K
- But no one reconciles them (so no learning)

Fix:
- Monthly reconciliation (budget vs actual)
- Variance analysis (why are we different?)
- Document findings (improve forecasting)

`
      }
    ],
    relatedSlugs: ["burn-rate-optimization-and-runway-extension", "metrics-dashboard-design-kpi-tracking", "profitability-analysis-and-operating-leverage", "scenario-planning-and-sensitivity-analysis", "cash-runway-and-burn-rate-management"],
    faq: [
      { q: "How do I build an annual budget?", a: "Steps: (1) Forecast revenue (based on current MRR, growth assumptions), (2) Plan expenses by function (payroll 60%, tools 15%, marketing 15%, ops 10%), (3) Set targets (profitability timeline, runway goal), (4) Finalize (board approval). Example: £100K MRR, 50% growth path → £150K by year-end. Expense plan: £101K/month → £1.2M annual. Determine runway (cash / monthly burn)." },
      { q: "What should I do if I'm over budget?", a: "First: Investigate (why are we over? One-time or trend?). If <5% variance: Normal, acceptable. If 5-10%: Monitor. If >10%: Action needed. Options: (1) Cut expenses (marketing often first, payroll last), (2) Accelerate revenue (sales push), (3) Extend timeline (adjust profitability goal). Monthly reconciliation: Track budget vs actual, understand variance, adjust forecast." },
      { q: "When should I reforecast?", a: "Quarterly reforecasting (Q1, Q2, Q3, Q4 planning). Process: (1) Actual through end of prior quarter, (2) Remaining quarters adjusted based on reality, (3) Update runway (when will cash run out?), (4) Adjust plans (hiring, marketing, fundraising). Rule: If variance >10% in any month, reforecast immediately (don't wait for quarter-end). Share with team/board (transparency builds trust)." }
    ],
    videoUrl: ""
  }
];

export default batch327Articles;
