import { AcademyArticle } from "@/types/academy";

export const batch350Articles: AcademyArticle[] = [
  {
    slug: "financial-modeling-and-forecasting-techniques",
    title: "Financial Modeling and Forecasting Techniques: Predicting Future Performance",
    description: "Master financial modeling. Build forecasts, model scenarios, plan strategically.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["financial modeling", "forecasting", "revenue forecasting", "financial projections", "scenario modeling"],
    keyTakeaways: [
      "Financial model: Spreadsheet predicting future financials (revenue, expenses, cash). Inputs: Growth assumptions (new customers, ARPU, churn), expense assumptions (payroll, tools, marketing). Outputs: P&L (projected profit/loss), cash flow, runway. Update: Monthly (as learn new info). Value: Plan resource allocation (hiring, fundraising), stress-test (what if scenarios), communicate plan to investors.",
      "Revenue model: Bottom-up vs top-down. Bottom-up: Count customers × ARPU = revenue (more accurate for SaaS). Top-down: Market size × market share = revenue (macro view). Example SaaS: 100 customers, £1K ARPU, 5% monthly churn = project month 2 revenue. Combine both (validate across approaches).",
      "3-statement model: Income statement (P&L), balance sheet, cash flow statement. Connect: Revenue → Gross profit → Operating profit → Net income. Key: Model cash flow (not just profit, cash matters for runway). Tools: Excel (free, manual), Finbox (template), LivePlan (SaaS template)."
    ],
    content: [
      {
        heading: "Building Financial Models and Forecasts",
        body: `Creating predictive financial models for planning and decision-making.

**Financial model fundamentals**

Purpose:
- Predict future financial performance (revenue, expenses, cash)
- Stress-test plans (what if scenarios)
- Communicate strategy (to board, investors)
- Plan resource allocation (hiring, spending, fundraising)

Benefits:
- Better planning (data-driven, not guesses)
- Early warning (see runway issues months ahead)
- Credibility (investors trust companies with models)

**Building a revenue model**

Approach 1: Bottom-up (customer-based)

Inputs:
- Current customers: 100
- New customer acquisition: 20 per month
- Monthly churn: 5%
- ARPU: £1,000/month (average revenue per customer)

Month-by-month projection:

Month 1:
- Starting customers: 100
- New: +20
- Churn: -5
- Ending: 115
- Revenue: 115 × £1,000 = £115K

Month 2:
- Starting: 115
- New: +20
- Churn: -5.75 (5% of 115)
- Ending: 129.25 (129)
- Revenue: 129 × £1,000 = £129K

Month 3:
- Starting: 129
- New: +20
- Churn: -6.45
- Ending: 142.55 (143)
- Revenue: 143 × £1,000 = £143K

Pattern:
- Monthly growth slowing (as base larger, churn increases)
- By month 6: ~180 customers, £180K revenue
- By month 12: ~210-220 customers, £210-220K revenue

Validation:
- YoY growth: 100 → 220 = 120% (reasonable for PMF stage)

Approach 2: Top-down (market-based)

Inputs:
- TAM (Total Addressable Market): £1B
- Market share target: 0.1% (realistic)
- Market served: £1M (0.1% of £1B)
- Take rate: 10% (your cut of market)
- Revenue: £100K

Better to combine both (cross-validate)

**Building an expense model**

Payroll forecast:

Month 1: 5 people (founders + 2 engineers + 1 ops)
- Average salary: £60K annual = £5K/month
- Total payroll: 5 × £5K = £25K

Month 3: Hire 2 more engineers
- New team: 7 people
- New payroll: 7 × £5K = £35K

Month 6: Hire sales person
- New team: 8 people
- New payroll: 8 × £5K = £40K

Month 12: Full team 10 people
- New payroll: 10 × £5K = £50K

Benefits cost (25% of payroll):
- Month 1: £25K × 25% = £6.25K
- Scales with payroll

Taxes (15% of payroll):
- Month 1: £25K × 15% = £3.75K
- Scales with payroll

Marketing budget:
- Month 1: £10K (early customer acquisition)
- Month 6: £20K (scale)
- Month 12: £30K (continue scaling)

Tools/infrastructure:
- Month 1: £5K (cloud, software)
- Grows 2% per month (scales with customers)

Other expenses:
- Rent: £3K constant
- Professional services: £2K constant

Total monthly expenses projection:

| Month | Payroll | Benefits | Taxes | Marketing | Tools | Other | Total |
|---|---|---|---|---|---|---|---|
| 1 | £25K | £6.25K | £3.75K | £10K | £5K | £5K | £55K |
| 3 | £35K | £8.75K | £5.25K | £10K | £5.1K | £5K | £68.1K |
| 6 | £40K | £10K | £6K | £20K | £5.3K | £5K | £86.3K |
| 12 | £50K | £12.5K | £7.5K | £30K | £5.6K | £5K | £110.6K |

**Building P&L forecast**

Combined revenue + expenses:

| Month | Revenue | COGS | Gross profit | Opex | Net profit |
|---|---|---|---|---|---|
| 1 | £115K | £35K | £80K | £55K | +£25K |
| 3 | £143K | £43K | £100K | £68.1K | +£31.9K |
| 6 | £195K | £59K | £136K | £86.3K | +£49.7K |
| 12 | £250K | £75K | £175K | £110.6K | +£64.4K |

Observations:
- Profitable from month 1 (gross profit > opex)
- Profit growing with scale (operating leverage)
- Year 1: Cumulative ~£450K profit (approximately)

**Scenario planning**

Base case: (Above, 20% MoM growth, 5% churn, £1K ARPU)

Upside case:
- New customer growth: 30/month (vs 20)
- Churn: 3% (vs 5%, product improvements)
- ARPU: £1,200 (vs £1,000, upsell success)
- Result: Year 1 revenue £400K+ (vs £250K), profitability accelerated

Downside case:
- New customer growth: 10/month (vs 20, slower sales)
- Churn: 8% (vs 5%, retention issues)
- ARPU: £800 (vs £1,000, price sensitivity)
- Result: Year 1 revenue £140K (vs £250K), profitability delayed

Three cases provide range (£140-400K), inform planning

**Runway modeling**

Starting cash: £500K

Monthly cash flow:
- Revenue inflow: Variable (per month)
- Expense outflow: Payroll + tools + marketing + other
- Net cash flow: Revenue - all expenses (not just opex, include COGS)

Example:

Month 1:
- Starting cash: £500K
- Inflow: £115K (revenue)
- Outflow: £55K + £35K = £90K (opex + COGS)
- Net: +£25K
- Ending cash: £525K

Month 2:
- Starting: £525K
- Inflow: £122K
- Outflow: £92K
- Net: +£30K
- Ending: £555K

Pattern: Cash increasing (profitable from start)

Runway: Not an issue (positive cash flow)

Alternative scenario (burning cash):

If started unprofitable (common early stage):
- Month 1: £50K inflow (early stage revenue), £90K outflow
- Net: -£40K
- Ending: £460K

Month 2-6: Continuing burn, cash decreases
- Cumulative burn: Month 1-6 = £200K
- Month 6 ending cash: £300K
- Runway: £300K / £40K monthly burn = 7.5 months

Action: Fundraise by month 4 (before cash crisis at month 7)

**Model assumptions documentation**

Critical: Document all assumptions

Revenue assumptions:
- New customer acquisition: 20/month (justify: marketing spend, CAC, past)
- Churn: 5%/month (justify: industry bench, our measurement)
- ARPU: £1K (justify: pricing, customer mix, past)

Expense assumptions:
- Payroll growth: +2 people/quarter (justify: capacity planning, revenue growth)
- Marketing spend: £10-30K (justify: CAC target, CAC payback)
- Tools: Grow 2%/month with customers (justify: scaling costs)

Sensitivities (what if ±10%):
- If churn 6% (vs 5%): Revenue down 10%, profitability delayed
- If ARPU £900 (vs £1K): Revenue down 10%
- If customer growth 15/month (vs 20): Revenue down 25%

Impact: Understand which assumptions critical to plan

**Using model for decision-making**

Question 1: Do we need to fundraise?
- Model shows: Profitable by month 3, cash always positive
- Answer: No, self-funding
- Decision: Focus on product, growth

Question 2: When can we hire?
- Model shows: Month 1 payroll £25K, can afford growth
- Month 6: Can afford 8 people on revenue
- Month 12: Can afford 10 people
- Decision: Hire per plan (enginering month 3, sales month 6)

Question 3: Is our runway plan realistic?
- Model shows: 7.5-month runway if burn continues
- Decision: Fundraise by month 4 (before crisis)
- Alternative: Hit profitability faster (accelerate revenue)

**Common modeling mistakes**

Mistake 1: Hockey stick projections
- Problem: Flat revenue, then suddenly 200% growth
- Reality: Growth is gradual
- Fix: Model realistic growth curve (decelerate with scale)

Mistake 2: Ignore churn
- Problem: Project customers growing forever
- Reality: Churn compounds (lose 5% each month)
- Fix: Include churn in model

Mistake 3: Not update model
- Problem: Build model once, never touch
- Reality: Assumptions change monthly
- Fix: Update monthly with actuals, reforecast

Mistake 4: All assumptions optimistic
- Problem: New customers 30/month (no proof), ARPU £1.5K (not achieved yet)
- Reality: Assumptions should be conservative
- Fix: Use proven metrics, validate assumptions

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "scenario-planning-and-sensitivity-analysis", "cash-runway-and-burn-rate-management", "metrics-dashboard-design-kpi-tracking", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "How do I build a revenue forecast?", a: "Bottom-up: Count customers × ARPU = revenue. Example: 100 customers, £1K ARPU, 5% monthly churn. Project monthly (new customers, churn impacts). Validate with top-down (market size × market share). Build 12-month model (monthly detail). Update monthly (reforecast as learn). Key: Document assumptions (justify all inputs)." },
      { q: "What should my financial model include?", a: "P&L: Revenue, COGS, gross profit, opex, net income. Cash flow: Starting cash, inflows, outflows, ending cash. Balance sheet: Assets, liabilities, equity. Key metrics: Runway, profitability month, CAC payback. Scenarios: Base, upside, downside. Tools: Excel (free), Finbox (template), LivePlan (SaaS)." },
      { q: "How do I use my model for decisions?", a: "Model answers: (1) Do we fundraise? (runway shows timing), (2) When to hire? (cash flow shows affordability), (3) Is plan realistic? (sensitivities show key risks). Update monthly (actual vs forecast, identify gaps). Reforecast (if major variance). Key: Model is living document, not set-and-forget." }
    ],
    videoUrl: ""
  }
];

export default batch350Articles;
