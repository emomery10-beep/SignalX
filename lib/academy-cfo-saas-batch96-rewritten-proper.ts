import { AcademyArticle } from "@/types/academy";

export const batch96Articles: AcademyArticle[] = [
  {
    slug: "dso-accounts-receivable-management",
    title: "Days Sales Outstanding (DSO) and AR Management: Accelerating Customer Collections",
    description: "Master DSO metrics and accounts receivable management. Optimize collection cycles and improve cash flow through better AR policies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "DSO",
      "days sales outstanding",
      "accounts receivable",
      "AR management",
      "collections",
      "collection cycle",
      "invoice aging",
      "credit policy",
      "payment terms",
      "cash flow"
    ],
    keyTakeaways: [
      "DSO = (Average AR ÷ Daily revenue) or (AR ÷ Total revenue) × number of days; example: £1M monthly revenue, £500K AR = DSO of 15 days (customers pay in 15 days avg); industry average: SaaS 30-45 days, B2B services 45-60 days, B2C retail 5-15 days; reducing DSO by 10 days frees up significant working capital (£1M monthly revenue × 10 ÷ 30 = £333K cash freed)",
      "DSO improves with: (1) upfront/prepaid pricing (SaaS contracts), (2) shorter payment terms (net-15 vs net-45), (3) automated billing/collection (ACH, credit card auto-pay), (4) early payment incentives (1% discount for 10-day payment), (5) better credit screening (avoid slow-pay customers), (6) aggressive collections (follow up past-due invoices within 3 days)",
      "AR aging analysis: track invoices by age bucket (current 0-30 days, 30-60 days, 60-90 days, >90 days); if >30% of AR is >60 days old, you have collection problem; use aging report to identify problem customers and prioritize follow-up; typical healthy: 70% current, 20% 30-60 days, 10% >60 days"
    ],
    content: [
      {
        heading: "Understanding Days Sales Outstanding (DSO)",
        body: `DSO measures the average number of days it takes to collect payment from customers after invoicing.

**Why DSO Matters**

Example: SaaS company

Revenue: £1M/month
Accounts receivable: £500K
DSO = (£500K ÷ £1M) × 30 days = 15 days

Interpretation: On average, it takes 15 days to collect from customers.

Cash impact:

Day 1: Invoice customer £50K
Day 15: Customer pays £50K (on average)
Working capital gap: 15 days × £50K daily invoicing = £750K tied up

If you reduce DSO to 10 days:
Day 1: Invoice £50K
Day 10: Customer pays £50K
New working capital gap: 10 days × £50K = £500K (frees up £250K)

For a £12M annual revenue company (£1M/month):
- Current: DSO 45 days = £1.5M tied up in AR
- Target: DSO 30 days = £1M tied up in AR
- Cash freed: £500K (equivalent to interest-free financing)

**How to Calculate DSO**

Formula 1 (Quick):
DSO = (Total AR ÷ Total revenue this period) × Number of days

Example:
- Revenue this quarter (90 days): £3M
- AR at quarter end: £450K
- DSO = (£450K ÷ £3M) × 90 = 13.5 days

Formula 2 (Average AR):
DSO = (Average AR ÷ Daily revenue)

Example:
- AR beginning of quarter: £400K
- AR end of quarter: £500K
- Average AR: £450K
- Daily revenue: £3M ÷ 90 = £33.3K/day
- DSO = £450K ÷ £33.3K = 13.5 days

**DSO Benchmarks by Industry**

| Industry | Typical DSO | Target |
|----------|-----------|--------|
| SaaS (monthly billing) | 30-45 days | <30 days |
| SaaS (annual prepaid) | 5-15 days | <10 days |
| B2B Services | 45-60 days | <45 days |
| Manufacturing | 45-75 days | <60 days |
| B2C Retail | 5-15 days | <15 days |
| Government contracts | 60-120 days | 60+ days (slower) |

SaaS with monthly subscription + net-30 payment terms = 30-40 days DSO (expected).
SaaS with annual prepaid = 5-15 days DSO (ideal).

**Accounts Receivable (AR) Composition**

AR includes:

1. **Active invoices** (waiting for payment)
   - Example: Invoice sent Jan 1, due Jan 31, customer hasn't paid yet (Jan 15)
   - This is normal float (expected delay)

2. **Overdue invoices** (past due date)
   - Example: Invoice due Jan 31, customer hasn't paid as of Feb 5
   - These are problem invoices (need follow-up)

3. **Disputed invoices** (customer disputes amount)
   - Example: Customer claims service not delivered, won't pay
   - Needs resolution before payment

4. **Uncollectible invoices** (will likely never be paid)
   - Example: Customer went bankrupt, account written off
   - Reported as "allowance for doubtful accounts" (reduces AR)

Healthy AR:
- 70% current (not yet due)
- 20% overdue 0-30 days
- 10% overdue 30+ days
- <1% uncollectible

**AR Aging Report**

A critical management tool showing AR composition by age:

Example aging report:

| Age bucket | Amount | % of total | Status |
|-----------|---------|-----------|--------|
| 0-30 days (current) | £700K | 70% | ✓ Normal |
| 30-60 days | £200K | 20% | ⚠ Monitor |
| 60-90 days | £70K | 7% | ⚠ Problem |
| >90 days | £30K | 3% | 🔴 Action needed |
| **Total AR** | **£1M** | **100%** | |

Action items by bucket:

- **Current (0-30 days)**: No action, payment expected soon
- **30-60 days**: Automated reminder email sent, contact customer
- **60-90 days**: Phone call to customer, understand issue
- **>90 days**: Escalation to management, consider write-off or legal collection

**Improving DSO**

Lever 1: Change payment terms (biggest impact)

Current: Net 45 (customer pays 45 days after invoice)
- Average collection: 50 days (some customers late)

Target: Net 15
- Average collection: 20 days (faster payment)

Impact: Reduces DSO by 30 days

Action:
- Renegotiate with new customers (Net 15 is standard in SaaS)
- Offer incentive for faster payment (1% discount if paid in 10 days)
- Require credit card on file for auto-payment

Lever 2: Require upfront/prepaid payment

Current: Monthly billing, net-30 (invoice after service delivered)
- DSO: 30-40 days

Target: Quarterly or annual prepaid
- DSO: <5 days (customer pays upfront)

Action:
- Change pricing to annual prepayment
- Offer 15% discount for annual prepay (attracts customers, improves cash)
- Example: £12K/year service, pay £10.2K upfront = 15% savings for customer, DSO improves

Lever 3: Automate collections

Current: Manual invoicing, customers write checks
- Delays in payment, lost invoices

Target: Automated billing system
- Automatic ACH or credit card charging on due date

Action:
- Implement integrated billing (Stripe, Zuora, Chargebee)
- Require payment method on file (credit card or bank account)
- Set up automatic invoicing and payment reminders
- Impact: Reduces DSO by 5-10 days, increases on-time payment

Lever 4: Improve credit screening

Current: Accept all customers (even risky ones)
- Some customers never pay (write-off as uncollectible)

Target: Credit check before onboarding
- Reject high-risk customers or require prepayment

Action:
- Run credit check on enterprise customers
- Require personal guarantee on larger deals
- Start high-risk customers on prepaid or shorter terms
- Impact: Reduces bad debt, improves DSO (fewer collection problems)

Lever 5: Aggressive collections

Current: Send invoice, wait 45 days, then follow up
- Many customers forget, pay late

Target: Proactive follow-up
- Reminder 3 days before due date
- Follow-up 3 days after due date if unpaid
- Phone call if still unpaid after 15 days

Action:
- Automated reminder emails (before due date)
- Manual follow-up for overdue invoices
- Finance team calls customers with invoices >30 days old
- Impact: Reduces DSO by 5-15 days, improves compliance

**Combined Impact Example**

Company with £5M annual revenue:

Current state:
- DSO: 45 days
- AR: £750K
- Payment terms: Net 45
- Collection method: Manual (invoices sent, customers write checks)

Improvements implemented:
1. Reduce payment terms Net 45 → Net 15 (−20 days DSO)
2. Implement automated billing (−10 days DSO)
3. Offer 2% discount for 10-day payment (−10 days DSO)
4. Aggressive collections on overdue (−5 days DSO)

New state:
- DSO: 45 − 45 = 0 days (overstated, but directionally correct)
- Realistic new DSO: 15 days (conservative estimate)
- New AR: £625K × (15 ÷ 45) = £208K
- Cash freed: £750K − £208K = £542K

This £542K is equivalent to a interest-free loan (or line of credit not needed).

**DSO and Cash Flow Forecasting**

DSO is critical for cash forecasting:

Example: SaaS startup

Month 1: Revenue £50K (30% collected, 70% on credit terms)
- Cash collected: £50K × 30% = £15K
- AR created: £50K × 70% = £35K

Month 2: Revenue £100K + Collect Month 1 AR
- Cash collected: £100K × 30% + £35K (Month 1 AR) = £65K
- AR created: £100K × 70% = £70K
- Total AR: £70K

Month 3: Revenue £150K + Collect Month 2 AR
- Cash collected: £150K × 30% + £70K (Month 2 AR) = £115K
- AR created: £150K × 70% = £105K
- Total AR: £105K

As you grow, AR grows (working capital financing needed for growth).

This is why improving DSO is critical—each 10-day improvement in DSO saves working capital that can be reinvested in growth.

**AR Write-Off and Bad Debt**

Uncollectible AR (customer won't or can't pay):

Accounting treatment:

Option 1: Direct write-off
- Invoice £50K to customer
- After 6 months of collection efforts, customer bankrupt
- Write off: Debit Bad Debt Expense £50K, Credit AR £50K
- Cash impact: £0 (it was never collected)

Option 2: Allowance for doubtful accounts
- Revenue £1M
- Estimate 2% will be uncollectible = £20K
- Debit Bad Debt Expense £20K
- Credit Allowance for Doubtful Accounts £20K
- Net AR: £1M − £20K = £980K (more conservative)

For DSO calculation:
- Use Gross AR (before allowance) for DSO
- The allowance is a separate accounting reserve

Red flags for uncollectible AR:
- Invoice >90 days overdue with no payment plan
- Customer stopped responding to collection attempts
- Customer in bankruptcy or financial distress
- Industry decline (customer's industry folded)

Strategy: Write off early if uncollectible, don't waste collection resources.
`
      }
    ],
    relatedSlugs: [
      "cash-conversion-cycle-working-capital",
      "quick-ratio-liquidity-analysis",
      "cash-management-and-forecasting",
      "bookings-vs-revenue-recognition",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's a good DSO target?",
        a: "SaaS should target <30 days (ideally <15 for prepaid). B2B services 40-50 days. Every 10-day improvement frees up significant working capital."
      },
      {
        q: "How do I reduce DSO?",
        a: "Shorter payment terms (Net 15 vs Net 45), require upfront payment, automate billing/collections, offer early payment discounts, and aggressively follow up on overdue invoices."
      },
      {
        q: "What does AR aging tell me?",
        a: "If >30% of AR is >60 days old, you have a collection problem. Healthy: 70% current, 20% in 30-60 day bucket, 10% in 60+ bucket."
      },
      {
        q: "How do I forecast cash with DSO?",
        a: "Revenue × DSO ÷ days = AR balance. Example: £1M monthly × 30 DSO ÷ 30 days = £1M AR. As DSO improves, AR decreases, freeing up cash."
      }
    ],
    videoUrl: ""
  }
];

export default batch96Articles;
