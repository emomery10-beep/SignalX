import { AcademyArticle } from "@/types/academy";

export const batch120Articles: AcademyArticle[] = [
  {
    slug: "financial-forecasting-and-scenario-planning",
    title: "Financial Forecasting and Scenario Planning: Predicting Your Company's Financial Future",
    description: "Master financial forecasting. Build 3-statement models, plan for multiple scenarios, and use forecasts to drive business strategy.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "financial forecasting",
      "scenario planning",
      "financial modeling",
      "3-statement model",
      "P&L forecast",
      "balance sheet forecast",
      "cash flow projection",
      "revenue forecast",
      "expense forecast",
      "sensitivity analysis"
    ],
    keyTakeaways: [
      "Three-statement model: P&L (income statement), Balance Sheet, Cash Flow Statement. P&L: Revenue - Expenses = Profit. Balance Sheet: Assets = Liabilities + Equity. Cash Flow: Operating + Investing + Financing. Example: £10M revenue, £9M expenses = £1M profit (P&L), but if collect revenue in 60 days, might be cash-negative in month 1. Forecast all three, not just P&L.",
      "Revenue forecast models: Bottom-up (# customers × ACV = ARR) is most accurate. Example: 50 customers × £200K ACV = £10M ARR. Top-down (market × penetration %) useful for validation but less accurate. Scenario planning: Base case (most likely), Bull case (50%+ growth), Bear case (flat/decline). Sensitivity: If CAC increases 20%, does profitability timeline change?",
      "Forecast horizon: 12 months is standard (monthly detail useful for cash planning). 3-year forecast at annual level (for fundraising, board). Key drivers: # customers acquired, churn, ACV, COGS, payroll growth, rent, infrastructure. Example: If churn increases 1%, how does £10M ARR drop? If sales productivity declines, when does company reach profitability? Model the drivers, not just the outputs."
    ],
    content: [
      {
        heading: "Understanding Financial Statements",
        body: `Financial forecasting starts with understanding the three core financial statements.

**The Three-Statement Model**

Statement 1: Income Statement (P&L)

Shows: Profit or loss over a period (month, year)

Formula: Revenue - Expenses = Net Income

Example:

| Line Item | £ |
|-----------|-----|
| Subscription Revenue | 1,000K |
| Professional Services | 100K |
| **Total Revenue** | **1,100K** |
| Cost of Goods Sold | (200K) |
| **Gross Profit** | **900K** |
| Operating Expenses: | |
| Payroll | (500K) |
| Marketing | (150K) |
| Infrastructure | (50K) |
| G&A | (75K) |
| **Total OpEx** | **(775K)** |
| **Operating Income** | **125K** |
| Interest/other | (10K) |
| **Net Income** | **115K** |

This company is profitable (£115K net income per month).

Gross margin = Gross profit / Revenue = £900K / £1,100K = 82%
Operating margin = Operating income / Revenue = £125K / £1,100K = 11%
Net margin = Net income / Revenue = £115K / £1,100K = 10%

Statement 2: Balance Sheet

Shows: What you own (assets), what you owe (liabilities), what's left (equity)

Formula: Assets = Liabilities + Equity

Example:

| Asset | £ |
|-------|-----|
| Cash | 5,000K |
| Accounts receivable | 500K |
| Equipment | 300K |
| **Total Assets** | **5,800K** |
| | |
| **Liability** | |
| Accounts payable | 200K |
| Debt | 1,000K |
| Deferred revenue | 300K |
| **Total Liabilities** | **1,500K** |
| | |
| **Equity** | |
| Common stock | 100K |
| Retained earnings | 4,200K |
| **Total Equity** | **4,300K** |

Check: Assets = Liabilities + Equity = £5,800K (balances)

Key metrics:
- Current ratio = Current assets / Current liabilities = Health of near-term cash
- Debt-to-equity = Total debt / Total equity = Leverage

Statement 3: Cash Flow Statement

Shows: Actual cash in/out (different from P&L profit)

Example:

| Activity | £ |
|----------|-----|
| **Operating Cash Flow** | |
| Net income | 115K |
| Add back depreciation | 10K |
| Changes in working capital: | |
| - Increase in A/R | (50K) |
| - Increase in A/P | 25K |
| **Operating Cash Flow** | **100K** |
| | |
| **Investing Cash Flow** | |
| Capital expenditures | (20K) |
| **Investing Cash Flow** | **(20K)** |
| | |
| **Financing Cash Flow** | |
| Debt repayment | (50K) |
| Equity raised | 0K |
| **Financing Cash Flow** | **(50K)** |
| | |
| **Net change in cash** | **30K** |

This company:
- Makes £115K profit (P&L)
- But generates £100K actual cash (cash flow)
- Spends £20K on capital, £50K on debt repayment
- Net cash increases £30K

The difference: Customer paying in 60 days (A/R increase), vendor paying in 30 days (A/P).

**Why All Three Matter**

A company can be:
- Profitable but cash-negative (growing fast, customers pay late)
- Cash-positive but unprofitable (collecting in advance, e.g., annual contracts)
- Profitable and cash-positive (healthy, mature company)

SaaS example: Early-stage company

P&L:
- £1M revenue, £1.5M expenses = -£500K net loss

Cash flow:
- £2M collected upfront (annual contracts paid yearly)
- £500K operating expenses in cash
- Net: £1.5M cash in (positive cash despite P&L loss)

This is why SaaS companies can raise capital and grow: Revenue upfront, expenses over time.

**Forecasting Each Statement**

Start with revenue forecast (driver of everything):

1. Revenue forecast = # customers × ACV (average contract value)

Example:
- Month 1: 100 customers × £10K ACV = £1M MRR
- Month 2: 110 customers × £10K = £1.1M MRR
- Month 3: 120 customers × £10K = £1.2M MRR

2. Cost of goods sold = % of revenue

Example:
- SaaS hosting/infrastructure: 20% of revenue
- Professional services: 10% of revenue
- COGS: 30% of revenue total

3. Operating expenses = Fixed (mostly payroll)

Example:
- Payroll: £500K fixed (scales over year as you hire)
- Marketing: £150K (variable, tied to customer acquisition)
- Other: £100K (facilities, tools, etc.)

4. Build P&L for each month

5. From P&L, build cash flow:
- Adjust for working capital (when customers pay, when you pay vendors)
- Starting cash + operating cash flow - investing - financing = ending cash

6. From cash position + balance sheet, track equity
- Revenue growth increases retained earnings
- Raising capital increases equity
- Losses decrease retained earnings
`
      },
      {
        heading: "Building a 12-Month Financial Forecast",
        body: `Here's how to build a realistic forecast that you can use for planning.

**Step 1: Revenue Forecast**

Start with bottom-up by customer segment:

Segment A (Enterprise, £100K ACV):
- Current customers: 50
- Monthly churn: 1%
- New customers/month: 3
- Month 1: 50 customers
- Month 2: 50 × (1-1%) + 3 = 52 customers
- Month 3: 52 × (1-1%) + 3 = 54 customers
- Revenue/month: Customers × £100K ÷ 12 = £417K in month 1, growing

Segment B (Mid-market, £50K ACV):
- Current customers: 100
- Monthly churn: 3%
- New customers/month: 8
- Similar calculation...

Total Revenue Month 1: £1.2M (from both segments)
Total Revenue Month 12: £1.8M (growing from improved sales, lower churn)

**Step 2: Expense Forecast**

COGS:
- SaaS infrastructure: 20% of revenue (variable)
- Month 1: £1.2M × 20% = £240K

Payroll:
- Current: 30 people, £150K fully-loaded each = £4.5M/year = £375K/month
- Hire 5 engineers by month 6: +£75K/month → £450K/month by month 6

Marketing:
- Month 1-3: £150K/month (aggressive)
- Month 4-12: £100K/month (become more efficient)

Other OpEx:
- Fixed: £100K/month (office, tools)

Total Expenses Month 1:
- COGS: £240K
- Payroll: £375K
- Marketing: £150K
- Other: £100K
- Total: £865K

Month 6 (with additional headcount):
- COGS: £250K (revenue higher)
- Payroll: £450K (additional hires)
- Marketing: £100K
- Other: £100K
- Total: £900K

**Step 3: P&L Projection**

| Month | Revenue | COGS | Gross Profit | OpEx | Operating Income |
|-------|---------|------|----------|------|-----------------|
| 1 | 1,200K | 240K | 960K | 625K | 335K |
| 2 | 1,300K | 260K | 1,040K | 625K | 415K |
| 3 | 1,400K | 280K | 1,120K | 625K | 495K |
| 4 | 1,500K | 300K | 1,200K | 625K | 575K |
| 5 | 1,550K | 310K | 1,240K | 650K | 590K |
| 6 | 1,600K | 320K | 1,280K | 700K | 580K |
| 7 | 1,650K | 330K | 1,320K | 700K | 620K |
| ... | ... | ... | ... | ... | ... |
| 12 | 1,800K | 360K | 1,440K | 700K | 740K |

This company is profitable every month and growing.

Gross margin: 80% (healthy for SaaS)
Operating margin: Month 1: 28%, Month 12: 41% (improving)

**Step 4: Cash Flow Projection**

Same P&L, but adjust for timing:

Assumptions:
- Customers pay 50% upfront (invoice), 50% in 30 days
- You pay COGS in 30 days
- You pay payroll/other in month incurred

Month 1:
- P&L revenue: £1.2M
- Cash collected: £1.2M × 50% = £600K (upfront) + £0 (prior month) = £600K
- Cash spent: £240K (COGS) + £625K (payroll/OpEx) = £865K
- Operating cash: £600K - £865K = -£265K (negative)

Month 2:
- P&L revenue: £1.3M
- Cash collected: £1.3M × 50% (upfront) + £1.2M × 50% (from last month) = £650K + £600K = £1,250K
- Cash spent: £260K (COGS) + £625K (payroll/OpEx) = £885K
- Operating cash: £1,250K - £885K = £365K

Month 12 (steady state):
- Cash collected: £1.8M × 50% + £1.8M × 50% = £1.8M (full month collected)
- Cash spent: £360K + £700K = £1,060K
- Operating cash: £1.8M - £1,060K = £740K

**Balance Sheet and Cash Position**

Starting cash: £5M (from prior fundraise)

Month 1 ending cash: £5M - £265K = £4.735M
Month 2 ending cash: £4.735M + £365K = £5.1M
Month 3: £5.1M + cash flow = ?
...
Month 12: ?

Track cash each month to ensure runway (never go below £1M buffer).

If Month X cash drops below £2M, signal for fundraising.
`
      },
      {
        heading: "Scenario Planning and Sensitivity Analysis",
        body: `Real forecasting isn't a single number—it's a range of possibilities.

**Base, Bull, and Bear Scenarios**

Build three versions of the forecast:

Base Case (Most likely):
- Customer acquisition: Target growth (50% YoY)
- Churn: Expected level (3%)
- Pricing: No change
- Expenses: Planned hiring

Bull Case (50%+ growth):
- Customer acquisition: Above target (75% YoY)
- Churn: Lower than expected (2%)
- Pricing: Increase prices 10% mid-year
- Expenses: Hire faster

Bear Case (Flat or decline):
- Customer acquisition: Miss target (25% YoY)
- Churn: Higher than expected (5%)
- Pricing: No increase (pressure)
- Expenses: Slow hiring

Example with numbers:

**Base Case** (£1.2M Month 1 → £1.8M Month 12)
- Final cash: £6.5M
- Operating income Month 12: £740K
- Path: Moderately profitable

**Bull Case** (£1.2M Month 1 → £2.4M Month 12, 100% growth)
- Customer acquisition faster: 4 new enterprise per month instead of 3
- Lower churn: 2% instead of 3%
- Price increase realized
- Final cash: £8M (much better)
- Operating income Month 12: £1.2M

**Bear Case** (£1.2M Month 1 → £1.5M Month 12, only 25% growth)
- Customer acquisition slower: 2 new enterprise per month instead of 3
- Higher churn: 4% instead of 3%
- Cost pressures force slower hiring plan
- Final cash: £4.8M (tighter)
- Operating income Month 12: £350K (half of base case)

**Sensitivity Analysis**

How much does ONE variable change impact the outcome?

Key variables:

1. CAC (Customer Acquisition Cost)
- Base: £50K per enterprise customer
- If CAC increases 20% (£60K), does profitability change?
- Impact: Payback period extends 1-2 months
- Action: If CAC increasing, need to improve retention or pricing

2. Churn
- Base: 3% monthly
- If churn increases to 5%, what's Month 12 revenue?
- Month 12 base: 140 customers
- Month 12 with 5% churn: 110 customers
- Revenue impact: -20%
- Action: Focus on retention initiatives

3. New customer acquisition
- Base: 3/month
- If ramp to 5/month (better sales), what's Month 12 revenue?
- Month 12 with 5/month: 180 customers
- Revenue impact: +30%
- Action: Invest in sales if acquisition ramping

4. Pricing
- Base: £100K ACV
- If raise prices 15% to £115K, what's impact?
- Revenue impact: +15% (assuming no churn from price increase)
- Action: Test pricing increase (usually 5-10% feasible)

Build a sensitivity table:

| Churn | 2% | 3% | 4% | 5% |
|-------|-----|-----|-----|-----|
| New/month: 2 | £1.4M | £1.3M | £1.2M | £1.1M |
| New/month: 3 | £1.7M | £1.6M | £1.5M | £1.4M |
| New/month: 4 | £2.0M | £1.9M | £1.8M | £1.7M |
| New/month: 5 | £2.3M | £2.2M | £2.1M | £2.0M |

This shows: If churn is 4% and acquisition is only 2/month, Month 12 revenue is only £1.2M. But if acquisition ramps to 5/month, revenue becomes £2.0M.

Focus on levers that move the needle most (usually acquisition and churn).

**Using Forecast for Decisions**

Decision framework:

Q: Should we hire 5 more salespeople?
A: Build forecast with additional sales hires
- Cost: £75K/month (5 people)
- Expected impact: Customer acquisition 3 → 4/month
- Additional Month 12 revenue: £300K
- Payoff: Pays for itself in 3 months (£75K × 3 = £225K < £300K additional revenue)
- Decision: YES

Q: Should we raise Series B?
A: Look at cash runway in base case
- Current cash: £5M
- Monthly burn: -£740K (profitable)
- Runway: Infinite (already profitable)
- Decision: NO need to raise (or raise for growth acceleration, not survival)

Q: Should we cut costs to reach profitability faster?
A: Compare payoff periods
- Current path: 12 months to £740K monthly profit
- Cut costs path: 8 months to £500K monthly profit (slower growth but faster profit)
- Decision: Depends on growth ambitions (keep growth or slow for profitability?)

Financial forecast is a tool to test decisions, not predict the future.
`
      },
      {
        heading: "Common Forecasting Mistakes",
        body: `How to avoid the most common forecasting errors.

**Mistake 1: Top-Down Revenue Forecast**

Wrong:
- "Market is £10B, we'll get 1% = £100M"
- No basis in customer acquisition reality
- Leads to unrealistic expectations

Right:
- Calculate from customers: # of customers acquired per month × ACV
- Tied to sales capacity, marketing spend, conversion rate
- Grounded in reality

Example:
- Sales team: 5 people
- Sales productivity: 1 new customer per person per month
- New customers: 5/month
- ACV: £100K
- Monthly revenue: £500K

This is real. "1% of market" is fiction.

**Mistake 2: Assuming Linear Growth**

Wrong:
- Forecast £1M revenue, grow 10% monthly forever
- Month 1: £1M, Month 12: £3.1M
- Doesn't account for churn, CAC, saturation

Right:
- Customer count: 100, growing 5% monthly
- Churn: 2% monthly
- Net growth: 3% monthly
- Month 12: 134 customers (not 160)
- Revenue: Lower than linear assumption

Lesson: Model customer cohorts, churn, and growth separately.

**Mistake 3: Underestimating Expenses**

Wrong:
- Forecast revenue, assume expenses flat
- Miss "cost creep" (salaries increase, tools expand)
- Overestimate profitability

Right:
- Track payroll growth with headcount
- Marketing spend tied to customer acquisition plan
- Infrastructure costs grow with scale
- Expenses have momentum (once hired, hard to cut)

Example:
- Start with £300K payroll
- Hire 5 people per quarter
- By Month 12: £400K payroll (increases)
- Expenses never flat; they compound

**Mistake 4: Ignoring Working Capital**

Wrong:
- "Profitable on P&L, so we're fine on cash"
- Collect revenue in 90 days, pay vendors in 30
- Cash-negative despite profitability

Right:
- Model A/R (accounts receivable) explicitly
- Model payment terms (when customers pay)
- Cash flow ≠ profit

Example:
- Month 1 revenue: £1M
- Collected upfront: £500K (50%)
- Collected Month 2: £500K (other half)
- Month 1 cash impact: -£500K (negative)
- Month 1 P&L: +£1M (positive)

SaaS mitigates this with upfront payment, but it's still a real issue.

**Mistake 5: Not Updating Forecast**

Wrong:
- Build forecast once, never update
- Reality diverges from plan
- Decisions based on stale forecast

Right:
- Update monthly with actual results
- Adjust forward forecast based on variance
- Track vs plan (what went right/wrong?)

Example:
- Forecast: 3 new customers/month
- Actual Month 1: 2 customers
- Actual Month 2: 2 customers
- Action: Revise Month 3+ forecast from 3 to 2/month
- New projected revenue: 20% lower

**Mistake 6: Over-Relying on Forecast Accuracy**

Wrong:
- Build detailed 24-month forecast (waste of time)
- Believe the numbers beyond 6 months
- Make big decisions based on Month 18 forecast

Right:
- Detailed forecast for 12 months (useful)
- Directional forecast for 24 months (for planning)
- Monthly forecast useful, quarterly forecast enough
- Sensitivity analysis more valuable than accuracy

The further out you forecast, the less accurate. Better to plan what you control (hires, spend, CAC) than predict the future (customer behavior, market).

**Best Practices**

1. Update forecast monthly (takes 2 hours, massive value)
2. Track actual vs forecast (variance analysis)
3. Build scenarios (base, bull, bear)
4. Model the drivers (customers, churn, ACV, headcount)
5. Use forecast to test decisions ("if we hire 5 engineers, when's profitability?")
6. Share forecast with team (everyone understands the plan)
7. Trust the forecast for next 6 months, directional for 12+

Financial forecasting is a CEO/CFO tool. Master it, and you'll make better decisions.
`
      }
    ],
    relatedSlugs: [
      "burn-rate-and-cash-runway-analysis",
      "headcount-planning-and-compensation-strategy",
      "p-l-statement-architecture-profitability",
      "cash-conversion-cycle",
      "unit-economics-ltv-cac-payback"
    ],
    faq: [
      {
        q: "What's the difference between profit and cash flow?",
        a: "Profit (P&L) = Revenue - Expenses. Cash flow = Actual cash in/out. If customers pay in 60 days, you have revenue (P&L) but no cash (cash flow) until payment. SaaS mitigates this with upfront contracts. Always model both, not just profit."
      },
      {
        q: "How far ahead should I forecast?",
        a: "12 months detailed (monthly), 24 months directional (annual). Beyond 12 months, forecast is rarely accurate—focus on drivers (CAC, churn, headcount) rather than exact revenue numbers. Update monthly with actual results."
      },
      {
        q: "What's the most important number to forecast?",
        a: "Cash position. Cash out = you're done (company dies). Revenue and profit are secondary to not running out of cash. Forecast monthly cash, ensure it never drops below 3 months of burn. Everything else flows from cash survival."
      },
      {
        q: "Should I build base, bull, and bear cases?",
        a: "Yes. Base case is most likely (50% probability). Bull case (30% probability) if things go well. Bear case (20% probability) if headwinds hit. Present all three to investors—shows realistic thinking. Plan to base case, hope for bull, prepare for bear."
      }
    ],
    videoUrl: ""
  }
];

export default batch120Articles;
