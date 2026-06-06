import { AcademyArticle } from "@/types/academy";

export const batch88Articles: AcademyArticle[] = [
  {
    slug: "cash-management-and-forecasting",
    title: "Cash Management and Forecasting: Predicting and Managing Cash Flow",
    description: "Master cash management: forecast cash position, manage collections, optimize burn, and ensure runway safety.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "cash management",
      "cash forecasting",
      "cash flow",
      "cash position",
      "collections",
      "payables management",
      "cash runway",
      "cash reserve",
      "liquidity",
      "working capital"
    ],
    keyTakeaways: [
      "Cash ≠ Revenue: Company can be profitable (revenue > costs) but cash negative (collected cash < spent cash); example: £1M annual revenue but customers pay 60 days late = no cash collected month 1-2 (but revenue recorded month 1); must forecast cash weekly for startups (daily for seed stage), monthly for growth stage; deferred revenue is a cash asset (customer already paid you)",
      "Cash forecast = beginning cash + cash collected (revenue) − cash spent (expenses) = ending cash; track by: collections (when customers pay), payables (when you pay bills), headcount changes (salary timing), debt payments; most common mistake: assuming revenue = cash collected (actual lag is 30-60 days for B2B)",
      "Improve cash position: Accelerate collections (bill faster, 30-day terms vs. 60-day), defer payables (negotiate 45-60 day terms with vendors), increase deferred revenue (bill annually vs. monthly, customers pay upfront), reduce burn (cut costs), raise money; typical SaaS needs 3-6 months cash reserve for safety (covers unforeseen issues)"
    ],
    content: [
      {
        heading: "Understanding Cash vs. Revenue",
        body: `Cash and revenue are different. Revenue is recorded when earned, cash is when collected.

**Cash vs. Revenue Example**

Month 1:
- Invoice customer: £10K (revenue recorded)
- Payment terms: Net 30 (customer pays in 30 days)
- Cash collected: £0 (payment not received yet)

**Accounting perspective (revenue):**
- Month 1 revenue: +£10K

**Cash perspective:**
- Month 1 cash: £0 (nothing collected)
- Month 2 cash: +£10K (customer paid)

This is the biggest difference between growing revenue and growing cash.

**Real Example: SaaS Company**

Monthly recurring revenue: £100K (customers paying monthly)
Customer payment terms: Net 30 (pay within 30 days)

Scenario 1: Stable customers, new = old

Month 1:
- Beginning cash: £500K
- Revenue billed: £100K (recorded)
- Cash collected: £70K (last month's invoice)
- Expenses: £80K
- Ending cash: £500K + £70K − £80K = £490K

Revenue looks good (£100K), but cash position declining (−£10K).

Scenario 2: Growing company (100% growth)

Month 1:
- Beginning cash: £500K
- Revenue billed: £200K (100% growth)
- Cash collected: £100K (last month, smaller cohort)
- Expenses: £150K
- Ending cash: £500K + £100K − £150K = £450K

Revenue doubling, but cash declining faster (−£50K) because new customers haven't paid yet.

This is why fast-growing companies can run out of cash despite "growing revenue."

**Deferred Revenue: The Cash Asset**

When customer prepays (annual contract, pay upfront):
- Customer pays: £10K cash
- You record: £833/month revenue (spread over 12 months)
- Deferred revenue: £10K liability (obligation to deliver)

Cash impact:
- Month 0: Receive £10K cash
- Month 1-12: Recognize £833 revenue, reduce deferred revenue by £833

Deferred revenue is shown as a liability on the balance sheet, but it's actually a cash asset (customer already paid you).

Example:
- Customers with annual contracts, all paid upfront
- Total deferred revenue: £1M
- This £1M is cash already in your bank

This is why deferred revenue is a leading indicator of business health (customers already committed).

**Cash Runway Calculation**

Runway = Cash in bank ÷ Monthly burn rate

Example:
- Cash in bank: £2M
- Monthly burn: £200K
- Runway: £2M ÷ £200K = 10 months

But this assumes:
- Burn rate stays flat (often doesn't)
- No new cash collected (revenue stops)
- No additional fundraising

More realistic:
- Cash: £2M
- Burn: £200K/month
- Revenue collected: £100K/month (net burn £100K)
- Runway: £2M ÷ £100K = 20 months

Adding revenue completely changes runway (2x improvement).

**Cash Forecasting**

Build a cash forecast (usually 13 weeks rolling forecast):

| Week | Beginning cash | Revenue collected | Expenses | Ending cash |
|-----|----------|----------|--------|----------|
| 1 | £500K | £20K | £60K | £460K |
| 2 | £460K | £25K | £60K | £425K |
| 3 | £425K | £30K | £65K | £390K |
| 4 | £390K | £35K | £70K | £355K |
| — | — | — | — | — |
| 13 | £100K | £50K | £80K | £70K |

This forecast shows:
- Week 3: Lowest cash position (£390K)
- By week 13: Cash declining (£70K, risky level)

Actions:
- Week 3: Expensive, but manageable
- Week 13: Critical, need to:
  - Reduce burn (cut costs)
  - Accelerate collections (push invoicing forward)
  - Raise money (needed before week 13)

**Improving Cash Position**

Three levers:

1. **Accelerate collections** (get paid faster)
   - Shorter payment terms: 60 days → 30 days
   - Early payment discounts: "Pay now, 2% discount"
   - Credit card: Immediate collection (but fee)
   - Impact: 30-day improvement in cash cycle

2. **Defer payments** (pay later)
   - Negotiate longer terms: 30 days → 45-60 days with vendors
   - Stagger hiring (reduce expense spike)
   - Negotiate volume discounts with SaaS tools
   - Impact: 15-30 day improvement in cash cycle

3. **Increase deferred revenue** (customer pays upfront)
   - Offer annual contracts (vs. monthly)
   - Discount for annual (20% off = incentive to prepay)
   - Require upfront payment for new customers
   - Impact: Immediate cash injection

**Working Capital Optimization**

Working capital = Accounts receivable − Accounts payable

Example:

Company A (poor working capital):
- AR (money owed by customers): £300K (slow payers)
- AP (money you owe vendors): £100K (fast payment)
- Working capital: £200K (tied up in AR)

Company B (optimized working capital):
- AR: £100K (fast collections, shorter terms)
- AP: £200K (slow payment, negotiated)
- Working capital: −£100K (customers pay before you pay vendors)

Company B has £100K more free cash (difference of £300K in working capital optimization).

This is why mature SaaS companies have negative working capital (customers prepay, you pay vendors later).

**Cash Forecast by Scenario**

Build multiple scenarios:

**Base case:**
- Revenue growth: 30% YoY
- Customer payment delay: 30 days
- Expense growth: 20% YoY
- Ending cash week 13: £150K (adequate)

**Upside:**
- Revenue growth: 50% YoY
- Payment delay: 15 days (better collection)
- Expense growth: 15%
- Ending cash: £250K (healthy)

**Downside:**
- Revenue growth: 10% YoY (market slowdown)
- Payment delay: 60 days (customers slower)
- Expense growth: 25%
- Ending cash: £50K (critical)

If downside scenario leaves you <3 months cash, you have a problem.

Action: Raise money before entering downside scenario.

**Cash Management Checklist**

Weekly actions:
- [ ] Update 13-week cash forecast
- [ ] Track collections (follow up on late invoices)
- [ ] Verify bank balance against forecast
- [ ] Identify any variance (actual vs. forecast)

Monthly actions:
- [ ] Review AR aging (how old are outstanding invoices?)
- [ ] Negotiate payment terms with top vendors
- [ ] Optimize expense timing (any large bills coming?)
- [ ] Model impact of new hires on cash

Quarterly actions:
- [ ] Review working capital (AR, AP, inventory if applicable)
- [ ] Update annual cash forecast
- [ ] Plan fundraising (if runway <12 months)
- [ ] Consider prepayment incentives (accelerate cash)

Cash management is the job of the CFO, but CEO must understand it.

Most startups fail not from lack of revenue, but from lack of cash.
`
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-planning",
      "financial-forecasting-modeling",
      "revenue-recognition-accrual-accounting",
      "profitability-mechanics",
      "funding-and-investment-strategy"
    ],
    faq: [
      {
        q: "Why can a company be revenue-positive but cash-negative?",
        a: "Revenue is recorded when earned. Cash is recorded when collected. If customers pay 60 days late, you have revenue month 1 but cash month 3. Fast growth makes this worse (new customers not paying yet)."
      },
      {
        q: "How often should I forecast cash?",
        a: "Early stage: Weekly or daily. Growth stage: Weekly. Mature: Monthly. More frequent = better control. Use 13-week rolling forecast (update every week)."
      },
      {
        q: "How much cash should I have in reserve?",
        a: "3-6 months of operating expenses minimum. 6-12 months if you're fundraising (gives time to close). If <3 months, you're in crisis mode."
      },
      {
        q: "Should I accelerate collections or defer payments?",
        a: "Both. Accelerate collections (shorter terms, incentives). Defer payments (negotiate longer terms with vendors). Both together improve cash position 30-60 days."
      }
    ],
    videoUrl: ""
  }
];

export default batch88Articles;
