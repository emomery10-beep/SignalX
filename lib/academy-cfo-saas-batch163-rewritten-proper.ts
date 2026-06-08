import { AcademyArticle } from "@/types/academy";

export const batch163Articles: AcademyArticle[] = [
  {
    slug: "cash-flow-management-and-working-capital",
    title: "Cash Flow Management and Working Capital: Timing Is Everything",
    description: "Master cash flow. Manage the timing of cash inflows and outflows, optimize working capital, and never run out of cash due to timing issues.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "cash flow",
      "working capital",
      "cash timing",
      "accounts receivable",
      "accounts payable",
      "payment terms",
      "cash position",
      "invoice timing",
      "customer payment",
      "vendor payment"
    ],
    keyTakeaways: [
      "Revenue vs cash timing: £100K revenue ≠ £100K cash in bank same month. If customers pay net-30, cash arrives month 2. If company pays vendors upfront, cash goes out month 1. Example: Month 1 revenue £100K (cash month 2), costs £60K (paid month 1) = month 1 cash flow -£60K despite £100K revenue. Working capital = timing gap between payables and receivables. Manage this gap or run out of cash despite being profitable.",
      "Days Sales Outstanding (DSO): How many days until customers pay. Formula: (Accounts Receivable / Revenue) × days in period. Example: £30K AR, £100K monthly revenue = 9 day DSO (customers pay in 9 days). Bad: 45 day DSO (45 days to get cash). Impact: £30K AR vs £150K AR = 5x cash trapped. Improve: Net-15 instead of net-30 (£75K AR instead of £150K) = free £75K cash.",
      "Working capital optimization: (1) Reduce DSO (invoice immediately, incentivize early payment). (2) Increase DPO (Days Payable Outstanding) - negotiate 60-day terms instead of 30 (delays outflow). (3) Use prepayment/annual billing (get cash upfront). Example: Annual billing 20% of customers = £240K cash upfront instead of £20K monthly. Impact: Improves cash position £220K permanently."
    ],
    content: [
      {
        heading: "Revenue vs Cash Flow",
        body: `The timing gap between revenue and cash.

**Revenue vs Cash Difference**

Revenue: When service is delivered (accrual accounting).
Cash: When money is actually received.

Example month:
- Revenue invoice (accrual): £100K (service delivered)
- Cash received (actual payment): £70K (some customers haven't paid yet)
- Profit (accrual): £100K revenue - £60K costs = £40K profit
- Cash flow: £70K received - £60K paid = £10K cash flow

Looks profitable (£40K) but cash position only +£10K (critical difference).

**Payment Terms Impact**

Payment terms determine cash timing.

Net 30: Customer has 30 days to pay
- Invoice date: Jan 1
- Payment date: Jan 31 (30 days later)
- Cash received: Late by 1 month

Net 15: Customer has 15 days to pay
- Payment date: Jan 15 (15 days later)
- Cash received: Half-month delay

Net 45: Customer has 45 days to pay
- Payment date: Feb 14 (45 days later)
- Cash received: 1.5 months delay

Impact on cash position:

| Term | Monthly Revenue | AR (cash trapped) | Cash Flow Delay |
|------|---|---|---|
| Net 15 | £100K | £50K | 15 days |
| Net 30 | £100K | £100K | 30 days |
| Net 45 | £100K | £150K | 45 days |

At Net 45, company has £150K sitting in AR (not accessible for operations).

**Monthly Cash Flow Example**

Scenario: £100K monthly revenue, £60K monthly costs

Month 1:
- Revenue invoiced: £100K
- Cash received from prior month: £0 (new customer)
- Costs paid: £60K
- Net cash flow: -£60K (negative despite profitable)
- Bank balance: Start £100K → End £40K (depleted!)

Month 2:
- Revenue invoiced: £100K
- Cash received from Month 1: £100K (net 30)
- Costs paid: £60K
- Net cash flow: +£40K
- Bank balance: Start £40K → End £80K

Implication: First month is painful (negative cash flow) despite profitable operations.

`
      },
      {
        heading: "Working Capital Management",
        body: `Optimizing cash tied up in operations.

**Working Capital Definition**

Working capital: Current assets - Current liabilities

Current assets:
- Cash in bank
- Accounts receivable (money owed by customers)
- Inventory (if applicable)

Current liabilities:
- Accounts payable (money owed to vendors)
- Short-term debt

Example:
- Cash: £50K
- AR: £100K
- Inventory: £20K
- Total assets: £170K

- AP: £30K
- Short-term debt: £10K
- Total liabilities: £40K

Working capital: £170K - £40K = £130K

High working capital = cash tied up in operations (not ideal).
Low working capital = efficient use of cash.

**Days Sales Outstanding (DSO)**

Metric: How many days until customers pay.

Formula: (Accounts Receivable / Daily Revenue) = DSO

Example:
- Monthly revenue: £100K
- Daily revenue: £100K / 30 = £3.33K
- AR: £100K
- DSO: £100K / £3.33K = 30 days (customers pay in 30 days)

Benchmark:
- Good: DSO 15-30 days (SaaS typical)
- Average: DSO 30-45 days
- Bad: DSO >60 days (cash stuck)

Impact: Every 10 day reduction in DSO = 10 days worth of revenue freed up as cash.

Example:
- Current DSO 45 days, revenue £100K monthly = £150K AR
- Improve to DSO 30 days = £100K AR
- Cash freed: £50K (immediate benefit)

**Days Payable Outstanding (DPO)**

Metric: How many days company takes to pay vendors.

Formula: (Accounts Payable / Daily COGS)

Example:
- Monthly COGS: £30K
- Daily COGS: £1K
- AP: £30K
- DPO: £30K / £1K = 30 days (company pays in 30 days)

Strategy: Increase DPO (delay payments, improve cash position).

Current: Net 30 with vendors → DPO 30 days
Improved: Net 60 with vendors → DPO 60 days

Impact: Extra 30 days of vendor payments = extra cash in bank.

Example:
- Monthly COGS £30K, DPO 30 days = £30K AP
- Negotiate to DPO 60 days = £60K AP
- Cash freed: £30K (vendor gives 30-day interest-free loan)

**Negative Working Capital**

Ideal scenario: DPO > DSO

Example:
- DSO 15 days (get cash from customers fast)
- DPO 60 days (pay vendors slow)
- Gap: 45 days (company has 45 days of revenue in cash before paying costs)

Implication: Growing revenue actually improves cash position (doesn't hurt it).

Example at scale:
- Monthly revenue £500K (DSO 15 = £250K AR)
- Monthly COGS £100K (DPO 60 = £200K AP)
- Working capital: £250K - £200K = £50K (but revenue is £500K)
- Company turns over working capital 10x per year = efficient

`
      },
      {
        heading: "Optimizing Cash Flow",
        body: `Strategies to improve cash position.

**Lever 1: Reduce DSO (Get Paid Faster)**

Strategy A: Invoice immediately
- Current: Invoice at end of month
- New: Invoice same day (3-5 day difference)
- Impact: 3-5 days faster cash

Strategy B: Incentivize early payment
- Offer 2% discount for payment within 10 days
- Customer saves 2%, company gets cash 20 days faster
- Example: £100K invoice, -£2K for paying in 10 days
- If customers take discount: Net benefit (lost 2% margin gains 20 days cash = profitable trade)

Strategy C: Require upfront payment
- Current: Net 30 (pay after delivery)
- New: Prepay or net 15
- Challenge: Customers may resist
- Mitigate: Offer discount for prepay (Net 0 with 5% discount)

Example impact:
- Current DSO 45 days, revenue £100K/month
- AR tied up: £150K
- Reduce DSO to 15 days
- AR freed: £50K (immediate cash)

**Lever 2: Increase DPO (Delay Payments)**

Strategy A: Negotiate longer payment terms
- Current: Net 30 with suppliers
- Target: Net 60
- Approach: "We're growing, need working capital flexibility, can you do Net 60?"
- Impact: 30 extra days of cash

Strategy B: Use vendor financing
- Supplier offers payment plans or financing
- Cost: Interest or fee, but spreads payments
- When to use: One-time equipment or bulk purchases

Strategy C: Strategic timing
- Pay invoices on the last day of terms (not early)
- Example: Net 30 means pay on day 30, not day 20
- Small impact but adds up

Example impact:
- Current DPO 30 days, COGS £30K/month
- AP: £30K
- Increase DPO to 60 days
- AP: £60K
- Cash freed: £30K

**Lever 3: Upfront Payment Models**

Strategy A: Annual billing
- Monthly SaaS: £1K/month = £12K/year
- Annual billing: £12K upfront (offer 10% discount = £10.8K)
- Impact: Get cash 12 months early

Example:
- 20% of customers switch to annual
- Monthly revenue £100K, 30 customers
- 6 customers × £12K = £72K cash upfront
- Monthly recurring from those 6: £6K (baked in)
- Net: +£72K cash, -£6K monthly (year 1 break-even, year 2 pure benefit)

Strategy B: Multi-year contracts
- 3-year contract at £12K/year = £36K upfront
- Risk: Long-term lock-in, but better cash position

Impact: Upfront billing = permanent improvement in cash position.

**Combined Optimization**

Current state:
- DSO 45 days (AR £150K)
- DPO 30 days (AP £30K)
- Net working capital: £120K tied up
- Monthly revenue £100K

Actions:
1. Reduce DSO to 20 days (incentive for early pay) → -£83K AR
2. Increase DPO to 50 days (negotiate terms) → +£50K AP
3. Move 20% of customers to annual billing → +£180K upfront

Results:
- Immediate cash impact: £83K freed + £50K freed + £180K upfront = £313K
- Company goes from £120K tied-up to £50K tied-up (63% improvement)
- Plus £180K one-time boost

`
      },
      {
        heading: "Forecasting Cash Flow",
        body: `Planning cash position ahead.

**13-Week Cash Flow Forecast**

Build rolling 13-week (3-month) forecast updated weekly.

Inputs:
- Projected revenue (by customer/contract)
- Known receivables (AR aging)
- Known payables (AP aging)
- Planned expenses (payroll, vendor commitments)

| Week | Revenue | AR Collections | Payables | Operating Costs | Ending Cash |
|------|---------|---|---|---|---|
| 1 | £20K | £35K | -£10K | -£15K | £60K |
| 2 | £25K | £25K | -£10K | -£15K | £85K |
| 3 | £20K | £20K | -£30K (vendor bill) | -£15K | £60K |
| 4 | £30K | £30K | -£10K | -£15K | £95K |

Insight: Week 3 dip (large vendor bill). Plan ahead.

**Scenario Planning**

What if scenarios:

Best case:
- All customers pay on time
- Revenue +10%
- Ending cash: £100K (comfortable)

Base case:
- 90% on-time payment
- Revenue on track
- Ending cash: £85K (adequate)

Worst case:
- 70% on-time payment, one large customer delayed
- Revenue -10%
- Ending cash: £50K (need action)

Actions for worst case (prepared):
- Cut discretionary spending (-£5K)
- Accelerate collections (+£10K from AR)
- Negotiate payment delay with vendors

Preparation prevents crisis.

**Cash Minimum Threshold**

Set minimum cash required:
- 3-month operating budget minimum
- Example: Monthly burn £30K → keep £90K minimum

Alert system:
- >£120K cash: Safe
- £90-120K cash: Monitor
- £60-90K cash: Action (reduce burn)
- <£60K cash: Crisis (urgent funding or cost cuts)

Monitor weekly.

`
      }
    ],
    relatedSlugs: [
      "burn-rate-and-cash-runway-analysis",
      "p-l-statement-architecture-profitability",
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "Why is cash flow different from profit?",
        a: "Profit is accrual (when earned), cash is actual (when received). Example: £100K revenue invoiced, £60K costs paid = £40K profit. But if customers haven't paid yet, only -£60K cash flow. On net-30 terms, cash arrives next month. Profitable companies can fail from cash flow (timing mismatch). Manage both."
      },
      {
        q: "What is a good Days Sales Outstanding (DSO)?",
        a: "15-30 days is healthy for SaaS (customers pay relatively fast). Over 45 days is slow (cash stuck). Reduce by: invoicing immediately, offering early payment discounts, requiring prepayment/upfront billing. Every 10-day reduction = 10 days of monthly revenue freed as cash."
      },
      {
        q: "How can I improve working capital?",
        a: "Three levers: (1) Reduce DSO (get paid faster: 10-15 days), (2) Increase DPO (pay vendors slower: 45-60 days), (3) Use upfront billing (annual contracts get cash immediately). Example: Move 20% of customers to annual = £180K upfront cash, frees £30K AR, improves cash by £210K permanently."
      },
      {
        q: "What's a good working capital ratio?",
        a: "Lower is better (less cash tied up). Ideal: Working capital < 10-20% of annual revenue. Example: £1M ARR = £100-200K working capital. High ratio (>30%) means cash inefficient (collect slower, pay faster). Formula: (AR - AP) / (monthly revenue × 12)"
      }
    ],
    videoUrl: ""
  }
];

export default batch163Articles;
