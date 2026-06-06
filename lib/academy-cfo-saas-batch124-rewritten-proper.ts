import { AcademyArticle } from "@/types/academy";

export const batch124Articles: AcademyArticle[] = [
  {
    slug: "revenue-recognition-and-asc-606",
    title: "Revenue Recognition and ASC 606: Recording Revenue the Right Way",
    description: "Master revenue recognition. Understand ASC 606, deferred revenue, and how to recognize revenue correctly for financial reporting.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "revenue recognition",
      "ASC 606",
      "deferred revenue",
      "accrual accounting",
      "revenue timing",
      "subscription revenue",
      "performance obligations",
      "contract accounting",
      "revenue model",
      "financial reporting"
    ],
    keyTakeaways: [
      "ASC 606 principle: Recognize revenue when (or as) you satisfy a performance obligation (deliver value to customer). For SaaS: Monthly subscription recognized monthly (month 1 = £1K revenue, even if customer paid £12K upfront for annual). Deferred revenue = customer paid upfront, but you haven't delivered yet. Example: £12K annual contract = £1K revenue recognized Month 1, £11K remains deferred.",
      "Timing mismatches: Customer pays upfront (month 1 cash +£12K), but you recognize revenue monthly (£1K/month over 12 months). This creates deferred revenue liability (on balance sheet), which shrinks monthly as revenue recognized. Example: Collect £100K from 10 annual customers Month 1 → Deferred revenue = £100K, Recognized revenue = £8.3K.",
      "Complexity: Multiple performance obligations (SaaS + setup fees + implementation hours); variable pricing (usage-based billing, where revenue unknown until usage measured); long-term contracts with milestones. Rule: Recognize revenue only when probable you'll receive payment and amount is determinable. For variable pricing, only recognize when certain. Example: Stripe transaction fees earned when transaction processed (determinable)."
    ],
    content: [
      {
        heading: "Understanding Revenue Recognition and ASC 606",
        body: `Revenue recognition is how you record when you've earned revenue in your financial statements. ASC 606 is the accounting standard that defines when to recognize revenue.

**The Core Principle of ASC 606**

ASC 606 says: Recognize revenue when (or as) you satisfy a performance obligation by transferring control of promised goods or services to a customer.

Translation: You recognize revenue when you deliver value, not just when you receive cash.

**SaaS Example**

Customer buys £12K annual subscription (paid upfront):

Month 1:
- Cash received: £12K (all upfront)
- Revenue recognized: £1K (1 month of service)
- Deferred revenue: £11K (obligation to deliver 11 more months)

Month 2:
- Cash received: £0 (already paid upfront)
- Revenue recognized: £1K (2nd month of service)
- Deferred revenue: £10K (remaining obligation)

...continues for 12 months until deferred revenue is £0

This is the key difference:
- Cash basis: Recognize all £12K revenue when cash received (wrong for SaaS)
- Accrual basis (ASC 606): Recognize £1K each month as service delivered (correct)

**Revenue vs Cash**

Example company:

Jan: 10 customers sign annual contracts at £10K each
- Cash received Jan: £100K
- Revenue recognized Jan: £8.3K (£100K ÷ 12 months)

Feb: 10 more customers sign annual contracts
- Cash received Feb: £100K
- Revenue recognized Feb: £16.7K (Month 2 of first 10 customers + Month 1 of new 10)

By month 6:
- Cumulative cash collected: £600K (60 customers × £10K upfront)
- Cumulative revenue: £175K (only 6 months recognized)
- Deferred revenue liability: £425K (obligation to deliver remaining 6 months)

This misalignment is why deferred revenue is critical to track.

**Deferred Revenue (Liability)**

Deferred revenue is money collected but not yet earned.

Balance sheet:

Liabilities:
- Deferred revenue: £425K (current, will be revenue in next 12 months)

P&L:
- Revenue: £175K (earned this period)

Connection:
- Each month, as revenue is recognized, deferred revenue decreases by same amount
- Month 6 revenue: £175K (reduce deferred revenue by £175K)
- Month 7 deferred revenue: £425K - £175K = £250K (and so on)

This is very important for SaaS companies (often have massive deferred revenue).

**Multi-Year Contracts**

If customer buys 3-year contract for £30K (£10K/year):

Year 1 P&L:
- Revenue: £10K

Year 2 P&L:
- Revenue: £10K

Year 3 P&L:
- Revenue: £10K

Balance sheet (end of Year 1):
- Deferred revenue: £20K (obligation to deliver Years 2-3)
- Current portion: £10K (next 12 months)
- Non-current portion: £10K (beyond 12 months)

Key insight: Even though customer paid £30K upfront, you only recognize £10K revenue in Year 1.

This is critical for understanding SaaS profitability:
- High upfront cash collection (looks great for cash flow)
- Spread revenue over time (shows sustainable recurring revenue)

**Performance Obligations**

A performance obligation is a promise to deliver something to the customer.

Example SaaS contract with multiple obligations:

1. Monthly software access: £100/month (performance obligation 1)
2. Setup/implementation: £5K (performance obligation 2)
3. Onboarding training: £2K (performance obligation 3)

Total contract value: £12K upfront + £1.2K/month recurring

For revenue recognition:
- Setup (£5K): Recognize when implementation complete (point in time)
- Training (£2K): Recognize when training delivered (point in time)
- Monthly access (£1.2K): Recognize monthly (over time)

Timeline:
- Month 1: Recognize setup (£5K) + training (£2K) + monthly (£1.2K) = £8.2K
- Months 2-12: Recognize only monthly (£1.2K/month) = £14.4K
- Total Year 1 revenue: £8.2K + £14.4K = £22.6K

This is more complex, but necessary if contract has multiple components.

**Stand-Alone Selling Price (SSP)**

When recognizing revenue from separate obligations, allocate based on stand-alone selling price.

Example:

Customer buys:
- Software + setup for £12K

If sold separately:
- Software (annual): £10K standalone price
- Setup: £3K standalone price

Allocation:
- Total SSP: £13K
- Software % of total: 10/13 = 77%
- Setup % of total: 3/13 = 23%

Of the £12K customer paid:
- Allocate to software: £12K × 77% = £9.2K
- Allocate to setup: £12K × 23% = £2.8K

This ensures proper allocation when bundled pricing differs from SSP.

**Cash vs Revenue Timing Issues**

Problem: Growing SaaS company
- Jan revenue: £50K (earned)
- Jan cash: £500K (collected for full year of customers)
- Deferred revenue: £450K

CFO might ask: "Why does P&L show £50K revenue but we collected £500K cash?"

Answer: "ASC 606 requires we recognize revenue monthly as we deliver service. The £450K collected but not yet earned is deferred revenue (liability). As months pass, we'll convert deferred to recognized revenue."

This confuses many people, but it's correct under accrual accounting.

**Tracking Deferred Revenue**

Build a deferred revenue schedule:

| Month | New Contracts | Cash Collected | Revenue Recognized | Deferred Revenue (End) |
|-------|-------|-------------|-----------|---------|
| Jan | 50 cust × £10K | £500K | £41.7K | £458.3K |
| Feb | 50 cust × £10K | £500K | £83.3K | £916.7K |
| Mar | 50 cust × £10K | £500K | £125K | £1.375M |
| Apr | 30 cust × £10K | £300K | £125K | £1.55M |

This shows growth in deferred revenue (good sign, means you've sold the year).

Declining deferred revenue (bad sign) means customers churning and not being replaced by new sales.
`
      },
      {
        heading: "Recognizing Revenue in Different SaaS Models",
        body: `How revenue recognition works for different SaaS business models.

**Subscription SaaS (Monthly Billing)**

Customer pays monthly (not upfront):

Month 1:
- Cash received: £1K (monthly payment)
- Revenue recognized: £1K (1 month delivered)
- Deferred revenue: £0 (no upfront payment)

This is simple (cash = revenue for that month).

Monthly billing SaaS is straightforward for revenue recognition.

**Subscription SaaS (Annual Billing)**

Customer pays annually:

Month 1:
- Cash received: £12K (annual payment)
- Revenue recognized: £1K (1 month delivered)
- Deferred revenue: £11K (11 months remaining)

This requires tracking deferred revenue.

Annual billing SaaS requires more revenue accounting complexity.

**Usage-Based/Metered SaaS**

Customer pays based on usage (API calls, etc.):

Month 1:
- Usage: 1M API calls
- Price per unit: £0.01 per call
- Invoice: £10K

Revenue recognition:
- Recognize £10K in month usage occurred
- This is variable consideration

Challenge: You don't know the £10K until month is over (usage measured).

Rule: Only recognize when amount becomes determinable.

**Professional Services + SaaS**

Contract includes services + software:

£100K contract includes:
- Software (12-month license): £60K (separate performance obligation)
- Implementation services: £30K (separate performance obligation)
- Training: £10K (separate performance obligation)

Recognize:
- Implementation: £30K when complete (point-in-time obligation)
- Training: £10K when delivered (point-in-time obligation)
- Software: £60K spread over 12 months (over-time obligation)

Timeline:
- Months 1-3 (implementation period): Recognize implementation (£30K) + training (£10K) + 3 months software (£15K) = £55K
- Months 4-12 (post-implementation): Recognize only software (£5K/month) = £45K
- Total Year 1 revenue: £100K

**Commission Revenue with Clawback**

Contract includes commission on customer's sales:

Setup: £5K (upfront, recognize immediately)
Commission: 5% of customer's sales (capped at £50K)

For commission:
- Only recognize when customer's sales are certain
- If customer doesn't hit sales target, commission doesn't apply
- Revenue uncertain, so don't recognize until certain

Example:

Year 1 projections show £1M customer sales (£50K commission)

But you don't recognize full commission Year 1 because:
- Clawback exists (if customer sales decline Year 2, you owe refund)
- Revenue uncertain
- Only recognize when you're confident it's earned

Conservative approach: Recognize commission only after clawback period expires (Year 2).

Aggressive approach: Recognize commission when customer achieves sales (but set aside reserve for possible clawback).

Most companies are conservative (recognize commission only when certain).

**Enterprise Deals with Milestones**

Contract: £1M over 3 years, paid upon milestones

- Milestone 1 (Month 3): Deliver Phase 1 software → £300K payment
- Milestone 2 (Month 6): Go-live → £350K payment
- Milestone 3 (Month 12): Train 100 users → £350K payment

Revenue recognition:
- Month 3: Recognize £300K when Phase 1 delivered
- Month 6: Recognize £350K when go-live occurs
- Month 12: Recognize £350K when 100 users trained

This is performance obligation (milestone-based).

Total Year 1 revenue: £1M (all milestones hit in Year 1)

If milestones extend beyond Year 1, revenue extends too.

**Example Complex Contract**

5-year enterprise deal, £2M total:

- Year 1: £400K (software license)
- Years 2-5: £400K each year (software license)
- Setup (Month 1-2): £100K
- Implementation services: £200K over 6 months
- Support hours: £100K/year for 5 years

Performance obligations:
1. Setup: £100K (point in time, Month 2)
2. Implementation: £200K (over 6 months, recognized ratable)
3. Software license: £2M total (recognized annually, £400K/year)
4. Support: £500K total (recognized annually, £100K/year)

Year 1 revenue:
- Setup: £100K (Month 2)
- Implementation: £200K (6 months)
- Software: £400K (12 months)
- Support: £100K (12 months)
- Total Year 1: £800K

Years 2-5 revenue (each year):
- Software: £400K
- Support: £100K
- Total per year: £500K

This shows how complex multi-component contracts need structured revenue recognition.
`
      },
      {
        heading: "Building a Revenue Recognition Policy",
        body: `Every company should have a documented revenue recognition policy.

**Key Components of Revenue Policy**

1. Revenue recognition method
   - When is revenue recognized? (upfront, over time, when payment received?)
   - Different by contract type

2. Performance obligations
   - What are we promising customers?
   - Software access, implementation, support, etc.
   - When is each satisfied?

3. Deferred revenue treatment
   - How to track and recognize deferred revenue?
   - When to move from balance sheet liability to P&L revenue?

4. Variable consideration
   - If pricing is variable (usage-based), when is amount known?
   - Estimate or actual?

5. Refund/clawback policy
   - If customer gets refund, how is revenue adjusted?
   - If clawback period exists, when is revenue final?

6. Documentation requirements
   - What documents show revenue is earned?
   - Invoice, contract, delivery proof, etc.

**Example Revenue Recognition Policy**

SaaS Company - Subscription Revenue:

"We recognize revenue monthly as we deliver software access to customers.

For upfront annual contracts: Customer pays 12 months upfront (£12K). We record cash received (£12K) as deferred revenue (liability). Each month, as we deliver 1 month of service, we recognize £1K revenue and reduce deferred revenue by £1K.

For professional services: We recognize revenue when services are delivered (implementation complete, training conducted). If bundled with software, we allocate contract price based on standalone selling prices.

For usage-based pricing: We recognize revenue in the month usage occurs, once the usage amount becomes determinable (typically end of month when usage data collected).

For discounts: We reduce revenue to reflect actual contract price (not list price).

Refunds: If customer cancels, we reverse previously recognized revenue (debit revenue, credit cash) and adjust deferred revenue."

**Audit and Compliance**

If audited, auditors will review:
- Revenue policy is documented
- Revenue recognition follows ASC 606
- Sample of contracts reviewed to verify revenue recognized correctly
- Deferred revenue schedule reconciles to balance sheet
- Adjusting entries for revenue recognition made properly

This is why clean revenue accounting is important.

**Common Revenue Recognition Mistakes**

Mistake 1: Recognizing revenue on cash received (not accrual)
- Cash basis: Wrong for most SaaS
- Accrual basis: Correct

Mistake 2: Recognizing upfront annual revenue all at once
- Wrong: Contract signed, recognize full £12K Month 1
- Right: Recognize £1K each month over 12 months

Mistake 3: Not tracking deferred revenue
- Results: P&L revenue doesn't match cash
- Creates audit risk

Mistake 4: Ignoring clawbacks
- Example: Commission on sales, clawback if sales decline
- Wrong: Recognize full commission Year 1
- Right: Recognize commission only after clawback period passes

Mistake 5: Not documenting policy
- Auditors require documented policy
- Without it, audit issues arise
- Makes transfer difficult (buyer wants to understand revenue)

**Revenue Recognition and Growth Metrics**

Be careful with reporting:

ARR (Annual Recurring Revenue):
- Only count committed revenue (not variable/uncertain)
- Exclude one-time professional services fees
- Count only subscription portion

MRR (Monthly Recurring Revenue):
- Annualized monthly subscription revenue
- Exclude usage-based and services

These metrics exclude variable/services revenue, so they might be lower than actual revenue (which includes all).

Example company:

Subscription revenue (accrual): £10M
Professional services revenue: £1M
Total revenue: £11M

But ARR metric: Only £10M (excludes one-time services)

Both are correct (revenue = £11M, ARR = £10M), but easy to confuse.
`
      },
      {
        heading: "Deferred Revenue Management",
        body: `Deferred revenue is a key metric for SaaS companies. Manage it carefully.

**Deferred Revenue as Business Health Indicator**

Growing deferred revenue = Good sign
- Shows you're collecting cash
- Indicates future revenue (backlog)

Declining deferred revenue = Bad sign
- Customers churning and not replaced
- Not enough new sales

Example:

Company A:
- Q1 Deferred revenue: £1M
- Q2 Deferred revenue: £1.2M (+20%)
- Q3 Deferred revenue: £1.5M (+25%)
- Health: Good (collecting and growing)

Company B:
- Q1 Deferred revenue: £1M
- Q2 Deferred revenue: £950K (-5%)
- Q3 Deferred revenue: £850K (-15%)
- Health: Bad (losing backlog)

Deferred revenue trend is leading indicator of future revenue.

**Deferred Revenue and Cash Flow**

Large deferred revenue is good for cash flow:

Scenario 1: Booked revenue (ASC 606)
- Customers pay £1M annual upfront
- Record as deferred revenue
- Recognize as revenue monthly

Cash flow benefit:
- Month 1: +£1M cash (have the money)
- Year 1 P&L: Shows only £12 months × customer count in revenue

Scenario 2: Monthly billing
- Customer pays £83K/month
- Record as revenue immediately
- Year 1 revenue: £1M

Cash flow is same (£1M/year), but timing different:
- Annual upfront: Cash all Month 1
- Monthly billing: Cash spread across 12 months

Most SaaS prefer annual billing (better cash flow timing).

**Balance Sheet Deferred Revenue**

Track on balance sheet:

Current deferred revenue: £500K (to be recognized in next 12 months)
Non-current deferred revenue: £200K (beyond 12 months, rare in SaaS)

Unusual for SaaS to have non-current deferred revenue (most contracts <12 months).

Example 3-year contract would have:
- Current: Year 1 revenue (1 year)
- Non-current: Years 2-3 revenue (2 years)

**Working Capital and Deferred Revenue**

Deferred revenue improves working capital:

Working capital = Current assets - Current liabilities

Example:

Current assets: £2M (cash, AR, inventory)
Current liabilities: £1M (AP, short-term debt, deferred revenue)
Working capital: £1M

If deferred revenue increases (customer pays upfront):
Current assets: £2.5M (£500K more cash)
Current liabilities: £1.5M (£500K more deferred revenue)
Working capital: £1M (unchanged!)

But cash improved by £500K, which is good.

This is why investors like SaaS with upfront customer payments (improve cash flow without changing net working capital too much).

**End-of-Period Adjustments**

At month/quarter end, adjust revenue:

Example:

Jan invoice to customer: £12K (annual contract)
- Record as deferred revenue: £12K (liability)
- Month-end close: Recognize £1K revenue (1/12 of contract)

Journal entry:
- Debit: Deferred revenue £1K
- Credit: Revenue £1K

This happens automatically in most accounting systems (Stripe Billing, Zuora, etc. handle this).

For month-end close checklist:
1. Collect all new contracts signed
2. Calculate revenue earned each month (based on policy)
3. Update deferred revenue schedule
4. Adjust deferred revenue and revenue to actual
5. Verify P&L and balance sheet match

This reconciliation is critical for accuracy.
`
      }
    ],
    relatedSlugs: [
      "bookings-vs-revenue-recognition",
      "p-l-statement-architecture-profitability",
      "financial-forecasting-modeling",
      "financial-controls-audit-readiness",
      "subscription-economics-contractual-mechanics"
    ],
    faq: [
      {
        q: "When do I recognize revenue for a SaaS annual contract?",
        a: "Recognize monthly over the 12-month contract. Customer pays £12K upfront, but you only recognize £1K revenue in month 1 (as you deliver 1 month of service). Remaining £11K stays as deferred revenue (liability) on balance sheet. Each month, move £1K from deferred to revenue."
      },
      {
        q: "What's the difference between cash and revenue in SaaS?",
        a: "Cash = money you receive. Revenue = value delivered to customer. SaaS with annual upfront contracts: Month 1 cash = £12K (full year), Month 1 revenue = £1K (one month). Deferred revenue (liability) = £11K. This gap is normal and correct under ASC 606."
      },
      {
        q: "How do I handle multi-component contracts (software + services)?",
        a: "Identify separate performance obligations (software, implementation, support). Allocate contract price to each based on standalone selling price. Recognize implementation/services revenue when complete (point-in-time). Recognize software monthly (over-time). Example: £100K contract = £60K software (monthly), £30K implementation (when complete), £10K training (when delivered)."
      },
      {
        q: "What's deferred revenue and why does it matter?",
        a: "Deferred revenue = cash you've collected but haven't earned yet. Customer paid £12K annual, month 1 revenue = £1K, deferred = £11K. Grows when you make sales, shrinks monthly as revenue recognized. Growing deferred revenue = good (backlog), declining = bad (churn > new sales). Key leading indicator of future revenue."
      }
    ],
    videoUrl: ""
  }
];

export default batch124Articles;
