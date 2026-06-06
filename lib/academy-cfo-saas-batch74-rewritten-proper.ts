import { AcademyArticle } from "@/types/academy";

export const batch74Articles: AcademyArticle[] = [
  {
    slug: "revenue-recognition-accrual-accounting",
    title: "Revenue Recognition and Accrual Accounting: Recognizing Revenue When Earned, Not When Paid",
    description: "Master revenue recognition for SaaS. Understand when to record revenue (not when cash arrives) and why it matters for financial statements.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "revenue recognition",
      "accrual accounting",
      "SaaS revenue",
      "deferred revenue",
      "revenue timing",
      "ASC 606",
      "recognizing revenue",
      "financial statements",
      "income statement",
      "accounting principles"
    ],
    keyTakeaways: [
      "Revenue recognition = when to record revenue on income statement; cash basis (record when money received) is wrong for SaaS; accrual basis (record when earned, regardless of cash) is correct; example: customer signs £10K annual contract January 1, record £833/month each month Jan-Dec (even if paid upfront or paying 30 days later); SaaS forces accrual accounting (upfront payment but revenue spread over subscription period)",
      "Deferred revenue = customer paid but you haven't earned it yet; appears as liability on balance sheet; example: £100K annual prepay on Jan 1 = £100K deferred revenue liability on balance sheet; as you deliver service (each month), deduct from deferred revenue (−£8,333/month), add to revenue (income statement +£8,333/month); by Dec 31, deferred revenue = £0, revenue recognized = £100K",
      "Revenue recognition impacts financials: Pure cash basis (wrong) shows £100K revenue month 1, £0 months 2-12; accrual basis (correct) shows £8,333 revenue each month (predictable, sustainable). Investors want accrual basis (shows true business performance). Banks want accrual basis (real revenue, not just collections)"
    ],
    content: [
      {
        heading: "Cash Basis vs. Accrual Basis Accounting",
        body: `SaaS companies must use accrual accounting to correctly measure revenue and financial health.

**Cash Basis Accounting (Wrong for SaaS)**

Cash basis: Record revenue when cash is received.

Example:

Customer pays £10,000 upfront for annual subscription on January 1.

Cash basis:
- January: Record £10,000 revenue
- February-December: Record £0 revenue (no cash received)

Problem: Looks like £10K revenue in January, nothing for 11 months (false). Actual revenue is £833/month.

Cash basis is wrong for SaaS because:
1. Overstates early revenue (lump sum in month 1)
2. Understates later months (shows £0 revenue when delivering service)
3. Makes business look lumpy and unpredictable
4. Doesn't reflect economic reality (earning monthly, not upfront)

Cash basis is used by very small businesses (freelancers, cash-only shops). Not suitable for subscription businesses.

**Accrual Basis Accounting (Correct for SaaS)**

Accrual basis: Record revenue when earned, regardless of when cash is received.

Same example:

Customer signs £10,000 annual contract on January 1 (pay upfront).

Accrual basis:
- January: Record £833 revenue (1/12 of contract)
- February: Record £833 revenue
- ... (continuing each month)
- December: Record £833 revenue
- Total by year-end: £10,000 revenue (earnings spread over service delivery period)

Accrual basis is correct because:
1. Matches revenue to when service is delivered
2. Shows sustainable, repeatable revenue (£833/month)
3. Accurately reflects business health
4. Required for audits and investor reporting

All SaaS companies use accrual accounting (legally required by auditors).

**Timing of Cash vs. Revenue**

In SaaS, cash and revenue timing mismatch:

Scenario 1: Annual prepay

| Month | Cash received | Revenue earned (accrual) |
|-------|----------|----------|
| Jan | £10,000 | £833 |
| Feb | £0 | £833 |
| Mar | £0 | £833 |
| ... | ... | ... |
| Dec | £0 | £833 |
| **Total** | **£10,000** | **£10,000** |

Cash received all at once (January), revenue earned monthly.

Scenario 2: Monthly billing, payment 30 days later

| Month | Cash received | Revenue earned |
|-------|----------|----------|
| Jan | £0 (invoice sent, bill due Feb 1) | £833 |
| Feb | £833 | £833 |
| Mar | £833 | £833 |
| ... | ... | ... |
| Dec | £833 | £833 |
| Jan (next year) | £833 | (£0 - contract ended) |

Cash received lags by one month, revenue recognized upfront.

Both scenarios show £10K total cash and £10K total revenue, but timing differs.

**Revenue Recognition Principles**

When to recognize revenue:

1. **Identify customer contract**: Do you have a binding agreement to deliver service?
2. **Identify performance obligation**: What are you delivering (access to software for period)?
3. **Determine transaction price**: What's the contract value (£10K for annual)?
4. **Allocate price to performance obligations**: How much revenue per month (£833)?
5. **Recognize revenue when satisfied**: Over service period, as customer uses the service

For SaaS, it's straightforward:
- Performance obligation: Providing software access for contract term
- Revenue recognized: Evenly over contract term (monthly/daily)
- Example: £10K annual contract → £833/month revenue

**Deferred Revenue (Liability)**

When customer prepays, you have a liability (obligation to provide service).

Example:

January 1: Customer signs £10,000 annual contract, pays £10,000 upfront

Journal entry:
Debit: Cash £10,000 (asset increases)
Credit: Deferred Revenue £10,000 (liability increases)

Balance sheet impact:
- Cash: +£10,000
- Deferred revenue liability: +£10,000

January 31: Recognize £833 revenue (1/12 of service delivered)

Journal entry:
Debit: Deferred Revenue £833 (liability decreases)
Credit: Revenue £833 (income statement)

December 31 cumulative:
- Deferred revenue drawn down: £10,000 × 12/12 = £10,000
- Deferred revenue remaining: £0 (all service delivered)
- Total revenue recognized: £10,000
- Total cash: £10,000

**Deferred Revenue on the Balance Sheet**

Deferred revenue is a liability (customer has paid, you owe them service).

Example company:

| Balance sheet item | Amount |
|---|---|
| Cash | £200K |
| Deferred revenue | £150K |
| Other assets | £100K |
| **Total assets** | **£400K** |

Deferred revenue of £150K means:
- Customers have prepaid £150K
- You must deliver £150K of service (obligation)
- As you deliver, deferred revenue decreases, revenue increases

If company has £150K deferred revenue:
- Month 1: Deliver some service, deferred revenue → £140K
- Month 2: Deliver more, deferred revenue → £130K
- By month 12: Fully delivered, deferred revenue → £0, revenue recognized £150K

Deferred revenue is "earned revenue waiting to happen." It's a strong signal of customer prepayments and predictable future revenue.

**Deferred Revenue by Billing Model**

Different billing models create different deferred revenue profiles:

1. **Annual prepay**
   - Customer pays £10K upfront for 1-year subscription
   - Creates large deferred revenue (£10K) immediately
   - Deferred revenue decreases monthly as service delivered
   - Example: SaaS with 1000 customers, all annual, £10K each = £10M deferred revenue

2. **Monthly billing, 30-day payment terms**
   - Customer invoiced monthly, pays 30 days later
   - Creates small deferred revenue (£0-1 month of revenue)
   - Deferred revenue stays small and stable
   - Example: SaaS with 1000 customers, £833/month each = £800K monthly revenue, £833K deferred revenue (average 1 month)

3. **Monthly billing, prepay**
   - Customer pays monthly, upfront (first-of-month)
   - Creates 1 month of deferred revenue
   - Stable, predictable deferred revenue
   - Example: £833K MRR = £833K deferred revenue

Deferred revenue is a key metric:
- Growing deferred revenue = customers signing bigger/longer contracts (positive)
- Declining deferred revenue = customers shortening terms (negative)
- Large deferred revenue = predictable future revenue (good for forecasting)

**Impact on Financial Statements**

Example company: £1M MRR (all annual prepay, customers pay upfront)

Cash basis (wrong):
- January: £12M cash received, £12M revenue (looks lumpy)
- February-December: £0 cash, £0 revenue
- Year end: £12M revenue, £12M cash

Accrual basis (correct):
- January-December: Each month £1M revenue (consistent)
- January: Deferred revenue £12M (cash collected)
- Month 1: Deferred revenue → £11M, Revenue → £1M
- Month 2: Deferred revenue → £10M, Revenue → £1M
- Year end: Deferred revenue £0 (all delivered), Revenue £12M (spread over 12 months)

Accrual basis shows sustainable, repeatable £1M/month revenue. Investors and banks prefer accrual basis.
`
      },
      {
        heading: "Deferred Revenue Management and Forecasting",
        body: `Deferred revenue is critical for SaaS forecasting and cash management.

**Deferred Revenue Calculation**

Deferred revenue = Future service obligation from prepaid customers

Calculation: Deferred revenue = (Total contracts × Average contract value × Average remaining contract life) ÷ Average contract length

Simpler: Deferred revenue = Sum of all prepaid, unearned customer payments

Example:

100 customers with annual contracts at £10K each, all paid upfront on Jan 1:
- Total deferred revenue on Jan 1: £100 × £10K = £1M
- Each month, £1M ÷ 12 = £83K of deferred revenue converts to revenue
- Deferred revenue on Feb 1: £917K
- Deferred revenue on Dec 1: £83K
- Deferred revenue on Jan 1 (next year): £0 (all earned)

**Deferred Revenue and Cash Runway**

Deferred revenue is NOT cash, but it's better than cash for forecasting:

Cash: What you have in bank today
Deferred revenue: What you're guaranteed to earn from customers

Example:

Company A:
- Cash in bank: £500K
- Deferred revenue: £100K
- Total liquid resources: £500K (only cash counts)
- Runway assuming £400K/month burn: 1.25 months

Company B:
- Cash in bank: £300K
- Deferred revenue: £300K
- Total liquid resources: £300K (cash only), but £300K guaranteed future revenue
- Runway assuming £400K/month burn: 0.75 months cash runway, but with deferred revenue, effective runway 1.5 months

Company B has same cash (£300K) as Company A's deferred revenue, meaning:
- Stable revenue stream (customers already committed)
- Predictable cash flow (as deferred revenue converts to cash)
- Lower risk (not dependent on new customer acquisition)

Deferred revenue is predictable, earned revenue. It's the best kind of revenue for forecasting.

**Calculating Remaining Performance Obligation (RPO)**

RPO = Deferred revenue + Future contracted revenue

Example:

Customer signs 3-year contract, £10K/year, pays annually:
- January Year 1: Pays £10K (deferred: £10K)
- January Year 2: Pays £10K (deferred: £10K)
- January Year 3: Pays £10K (deferred: £10K)

On January 1, Year 1:
- Deferred revenue: £10K (year 1 payment received)
- RPO: £10K deferred + £10K (year 2) + £10K (year 3) contracted = £30K
- Total committed: £30K

RPO is forward-looking. It shows:
- Committed revenue (already signed)
- Predictable future cash (will be collected)
- Business momentum (growing RPO = expanding commitments)

RPO > Deferred revenue. RPO is what investors really care about (shows committed runway).

Example company:

| Metric | Value |
|---|---|
| Current MRR | £1M |
| Deferred revenue | £8M |
| RPO | £20M |

Interpretation:
- Current MRR: £1M (monthly recurring)
- Deferred revenue: £8M (cash collected, will recognize over ~8 months)
- RPO: £20M (total committed contracts, will recognize over ~20 months)

With £1M MRR, this company has 20 months of committed, contracted revenue. That's a very strong position.

**Deferred Revenue and Profitability**

Deferred revenue doesn't impact profit (it's a timing issue, not a profit issue).

Over the full contract:
- Accrual basis: Revenue recognized gradually, matches economics
- Profit: Same regardless of billing model (upfront vs. monthly)

What changes:
- Cash flow: Upfront payment is better (cash now)
- Balance sheet: Large deferred revenue liability (offset by cash asset)
- Forecasting: Predictable future revenue

Example:

Scenario 1: Annual prepay
- January: +£10K cash, +£10K deferred revenue (liability)
- January-December: £833/month revenue recognized, deferred revenue decreases
- December: Fully delivered, deferred revenue £0
- Annual profit: £10K revenue − costs = £X profit

Scenario 2: Monthly billing, 30-day payment terms
- January: Bill £833, customer promises to pay (accrual revenue +£833)
- February: Collect £833 cash (previous month's invoice)
- December: Bill £833, customer promises to pay
- January next year: Collect £833 cash (previous month's invoice)
- Annual profit: £10K revenue − costs = £X profit (same as Scenario 1)

Annual profit is identical. Only timing of cash differs.

**Managing Deferred Revenue**

Monitor these metrics:

| Metric | Meaning |
|---|---|
| Deferred revenue | Total prepaid obligations |
| Deferred revenue as % of MRR | How many months of revenue prepaid |
| Deferred revenue trend | Growing (longer contracts) or declining (shorter contracts) |
| RPO | Total committed revenue |
| RPO/MRR ratio | How many months of committed revenue |

Good signals:
- Deferred revenue growing (customers prepaying longer contracts)
- RPO/MRR ratio >10 (10+ months of committed revenue = strong visibility)
- Deferred revenue >6 months of MRR (substantial prepayment)

Bad signals:
- Deferred revenue declining (customers shifting to monthly)
- RPO/MRR ratio <3 (low visibility into future revenue)
- Deferred revenue <1 month of MRR (mostly monthly billing, less prepayment)

Deferred revenue is a leading indicator of customer commitment and business health.
`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "cash-management-and-forecasting",
      "financial-forecasting-modeling",
      "unit-economics-deep-dive",
      "profitability-mechanics"
    ],
    faq: [
      {
        q: "When do I record revenue: when cash is received or when service is delivered?",
        a: "When service is delivered (accrual basis), not when cash arrives. If customer pays £10K upfront for annual subscription, record £833/month as you deliver service. This is accounting standard (ASC 606) and required for audits."
      },
      {
        q: "What's deferred revenue on the balance sheet?",
        a: "Liability (customer paid you, but you owe them service). For example, £100K deferred revenue means customers have prepaid £100K that you must deliver. As you deliver, deferred revenue decreases, revenue increases."
      },
      {
        q: "How do I forecast revenue if customers pay annually upfront?",
        a: "Use accrual revenue (spread upfront payments over contract term) not cash revenue. If £1M collected in January, recognize £83K/month Jan-Dec. Deferred revenue tells you how much you'll earn in future months."
      },
      {
        q: "Is deferred revenue cash?",
        a: "No. Deferred revenue is a liability (obligation to deliver service). Cash is the asset. They're related: cash increases when you collect, deferred revenue decreases as you earn."
      }
    ],
    videoUrl: ""
  }
];

export default batch74Articles;
