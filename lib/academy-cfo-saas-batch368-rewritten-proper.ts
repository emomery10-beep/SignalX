import { AcademyArticle } from "@/types/academy";

export const batch368Articles: AcademyArticle[] = [
  {
    slug: "cash-flow-management-and-working-capital",
    title: "Cash Flow Management and Working Capital: Controlling SaaS Cash Position",
    description: "Master cash flow management. Optimise working capital, extend runway, manage cash conversion.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cash flow", "working capital", "runway", "cash conversion", "treasury management"],
    keyTakeaways: [
      "Cash runway: Cash on hand ÷ monthly burn rate = months of runway. Example: £2M cash, £200K monthly burn = 10 months runway. Target: 12-18 months runway minimum. Below 6 months = urgent (start fundraising immediately). Burn rate = total monthly expenses - total monthly revenue. Net burn (including revenue) is the real metric. Track weekly during tight cash periods.",
      "Cash conversion cycle: Time from spending cash to receiving cash. For SaaS: (Days to build feature) + (Days to close sale) + (Days to collect payment). Example: 30 days build + 45 days sales cycle + 30 days collection = 105 days. Optimise: Annual prepayment (collect 12 months upfront), reduce collection days (auto-billing), shorten sales cycle. Best SaaS companies have negative cash conversion (collect before delivering).",
      "Working capital management: Current assets - current liabilities. Key levers: (1) Collect receivables faster (net-30 not net-60), (2) Negotiate longer payment terms with suppliers (net-60 not net-30), (3) Incentivise annual prepayment (10-20% discount). Example: Move 50% of customers to annual prepay at 15% discount. Cash impact: £500K ARR × 50% × 85% = £212.5K upfront (vs £20.8K/month). Working capital improvement: £191.7K."
    ],
    content: [
      {
        heading: "Managing Cash Flow and Working Capital in SaaS",
        body: `Ensuring your SaaS company never runs out of cash.

**Cash runway fundamentals**

Calculating runway:

Gross burn rate:
- Total monthly expenses (before revenue)
- Includes: Salaries, rent, cloud costs, marketing, tools
- Example: £250K monthly expenses

Net burn rate:
- Monthly expenses minus monthly revenue
- Example: £250K expenses - £100K revenue = £150K net burn

Runway:
- Cash on hand ÷ net burn rate
- Example: £1.8M cash ÷ £150K net burn = 12 months

Runway milestones:

| Runway | Status | Action |
|---|---|---|
| 18+ months | Comfortable | Focus on growth |
| 12-18 months | Healthy | Plan next fundraise |
| 6-12 months | Caution | Start fundraising now |
| 3-6 months | Urgent | Emergency measures |
| <3 months | Critical | Bridge or wind down |

Cash tracking cadence:

- Monthly: Review P&L, cash balance, runway
- Weekly: Track cash balance (during tight periods)
- Daily: Monitor during critical runway (below 3 months)

Weekly cash report template:

| Week | Opening balance | Revenue received | Expenses paid | Closing balance | Runway (months) |
|---|---|---|---|---|---|
| Week 1 | £1,800,000 | £25,000 | £62,500 | £1,762,500 | 11.75 |
| Week 2 | £1,762,500 | £25,000 | £62,500 | £1,725,000 | 11.50 |

**Cash conversion cycle for SaaS**

Understanding cash flow timing:

Traditional SaaS cash flow:

Monthly subscription model:
- Customer signs: Day 0
- First payment: Day 30 (net-30 invoice)
- Revenue recognised: Month 1
- Cash received: Day 30-60

Annual prepayment model:
- Customer signs: Day 0
- Payment: Day 0-30 (upfront)
- Revenue recognised: Spread over 12 months
- Cash received: Day 0-30 (all upfront!)

Cash flow comparison:

Monthly billing (£10K/month customer):
- Month 1: £10K
- Month 6: £60K cumulative
- Month 12: £120K cumulative

Annual prepayment (£100K/year, 17% discount):
- Month 1: £100K (all received)
- Month 6: £100K (same)
- Month 12: £100K (until renewal)

Cash flow advantage: £100K upfront vs £10K/month = £90K better cash position in month 1

**Optimising accounts receivable**

Reducing days sales outstanding (DSO):

Current state (example):
- Total monthly revenue: £200K
- Accounts receivable: £400K
- DSO: (£400K / £200K) × 30 = 60 days

Improvement strategies:

Strategy 1: Auto-billing (credit card/direct debit)
- Set up automatic collection
- No invoicing delay
- DSO: 0-3 days
- Impact: Eliminates collection risk

Strategy 2: Shorter payment terms
- Move from net-60 to net-30
- For enterprise: net-30 with 2% early payment discount (2/10 net 30)
- Impact: Reduce DSO by 30 days

Strategy 3: Upfront billing
- Bill at start of period (not end)
- Annual customers: Bill full year upfront
- Impact: Negative DSO (collect before service)

Strategy 4: Dunning automation
- Automated payment retry (failed cards)
- Email sequence: Day 1, Day 3, Day 7, Day 14
- Final: Account suspension at Day 21
- Impact: Reduce involuntary churn and accelerate collection

**Managing accounts payable**

Extending payment terms:

Key supplier categories:

Cloud infrastructure (AWS/Azure/GCP):
- Standard: Monthly billing (net-30)
- Negotiate: Reserved instances (1-3 year commit for 30-60% discount)
- Cash impact: Higher upfront, lower monthly
- Best for: Predictable workloads

SaaS tools:
- Standard: Monthly billing
- Negotiate: Annual billing (often 10-20% discount)
- Cash impact: Larger upfront payment, lower total cost

Contractors/freelancers:
- Standard: Net-14 to net-30
- Negotiate: Net-45 to net-60
- Cash impact: Delays cash outflow by 2-4 weeks

Office/facilities:
- Standard: Monthly rent
- Negotiate: Quarterly payment, rent-free period
- Cash impact: Delays outflow, rent-free improves runway

**Annual prepayment strategy**

Incentivising annual contracts:

Pricing structure:

Monthly plan: £100/month (£1,200/year)
Annual plan: £80/month equivalent (£960/year)
Discount: 20% for annual commitment

ROI of annual prepayment:

Revenue impact:
- Monthly: £1,200/year (collected over 12 months)
- Annual: £960/year (collected upfront)
- Revenue difference: -£240/year (discount cost)

Cash flow impact:
- Monthly: Collect £100/month = £600 by month 6
- Annual: Collect £960 in month 1
- Cash advantage: £360 better at month 6

Churn impact:
- Monthly churn: 5%/month → ~46% annual churn
- Annual churn: Much lower (committed for year)
- Retention value: Significant

Overall ROI:
- Discount cost: £240/year
- Cash flow benefit: Better working capital
- Retention benefit: Lower churn
- Net: Strongly positive for most SaaS companies

**Managing negative cash flow periods**

Bridge strategies:

Revenue-based financing:
- Borrow against future recurring revenue
- Example: £500K loan at 1.5x repayment (pay back £750K from revenue)
- Cost: 50% premium
- When: Short-term bridge, don't want dilution

Venture debt:
- Debt from specialist lenders (e.g., Silicon Valley Bank)
- Typically 25-30% of last equity round
- Example: Raised £5M Series A, get £1.5M venture debt
- Cost: 8-12% interest + warrants (0.5-1% dilution)
- When: Extend runway between equity rounds

Customer prepayments:
- Offer discounts for multi-year prepayment
- Example: 3-year deal at 30% discount (collect 2.1 years revenue upfront)
- Cost: Discount
- When: Enterprise customers, need cash urgently

Expense reduction:
- Cut non-essential spending
- Renegotiate contracts
- Delay hiring
- Example: Cut £50K/month expenses = extend runway by 3 months on £150K burn

**Cash flow forecasting**

13-week cash flow forecast:

| Week | Cash in | Cash out | Net | Balance |
|---|---|---|---|---|
| Week 1 | £50K | £60K | -£10K | £1,790K |
| Week 2 | £45K | £55K | -£10K | £1,780K |
| ... | ... | ... | ... | ... |
| Week 13 | £55K | £58K | -£3K | £1,660K |

Key inputs:
- Known revenue collections (contracted, invoiced)
- Known expenses (salaries, rent, subscriptions)
- Variable costs (cloud, marketing spend)
- One-off items (equipment, legal fees)

Scenario planning:

Base case:
- Revenue grows 5% monthly
- Expenses grow 3% monthly
- Runway: 12 months

Upside case:
- Revenue grows 8% monthly
- Expenses grow 2% monthly
- Runway: 18 months

Downside case:
- Revenue flat
- Expenses grow 3% monthly
- Runway: 8 months

Use downside for planning, base case for targets

**Treasury management**

Where to hold cash:

Operating account:
- 1-3 months of expenses
- Instant access
- Used for: Daily operations

Deposit account:
- 3-6 months of expenses
- Notice period (32-95 days)
- Higher interest rate
- Used for: Near-term reserves

Money market / treasury bills:
- 6+ months of expenses (excess cash)
- Low risk, moderate return
- Used for: Longer-term reserves

Rule: Never put operating cash at risk

Interest income:

Example with £3M cash:
- Operating (£500K): 0.5% = £2.5K/year
- Deposit (£1M): 4% = £40K/year
- Money market (£1.5M): 4.5% = £67.5K/year
- Total interest: £110K/year

Not trivial — treasury management pays for itself

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "cash-flow-forecasting-and-treasury", "fundraising-and-investor-relations", "revenue-recognition-and-deferred-revenue", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "How much runway should a SaaS company maintain?", a: "Target: 12-18 months minimum. Calculate: Cash on hand ÷ net monthly burn rate. Example: £2M cash, £150K net burn = 13 months. Below 6 months = urgent (start fundraising). Below 3 months = critical. Track weekly during tight periods. Net burn = expenses minus revenue (not gross burn)." },
      { q: "How do I improve SaaS cash flow?", a: "Key levers: (1) Incentivise annual prepayment (15-20% discount, collect 12 months upfront), (2) Auto-billing (reduce DSO to 0-3 days), (3) Shorter payment terms (net-30 not net-60), (4) Extend supplier terms (net-60 not net-30), (5) Dunning automation (retry failed payments). Example: Move 50% to annual prepay = immediate working capital improvement." },
      { q: "What is cash conversion cycle for SaaS?", a: "Time from spending cash to receiving cash. SaaS formula: Build time + sales cycle + collection time. Example: 30 days build + 45 days sales + 30 days collection = 105 days. Best SaaS: Negative cycle (collect annual prepayment before delivering). Optimise by: annual billing, auto-collection, shorter sales cycles. Target: Under 60 days or negative." }
    ],
    videoUrl: ""
  }
];

export default batch368Articles;
