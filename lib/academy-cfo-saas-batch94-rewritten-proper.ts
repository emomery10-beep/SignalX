import { AcademyArticle } from "@/types/academy";

export const batch94Articles: AcademyArticle[] = [
  {
    slug: "bookings-vs-revenue-recognition",
    title: "Bookings vs. Revenue: Understanding the Difference and Why It Matters",
    description: "Master the difference between bookings and revenue. Understand why they differ and how to forecast each.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "bookings",
      "revenue",
      "billings",
      "revenue recognition",
      "ASC 606",
      "deferred revenue",
      "cash basis",
      "accrual basis",
      "contract value",
      "performance obligation"
    ],
    keyTakeaways: [
      "Bookings = signed contract value (cash or commitment to pay); revenue = earned portion of contract (delivered service); example: customer signs £12K annual contract Jan 1, bookings = £12K (Jan 1), revenue = £1K/month Jan-Dec; bookings are financial metric (shows sales engine power), revenue is accounting metric (shows service delivery); bookings lead revenue by contract duration",
      "Billings = cash received from customer (may differ from revenue); customer pays £12K upfront Jan 1 = bookings £12K, billings £12K (cash collected), revenue £1K month 1; if customer pays 30 days late = bookings Jan 1, billings Feb 1, revenue Jan-Dec (spreads over service, not cash timing); most important for growth: bookings (shows sales success), for profitability: revenue (shows earnings)",
      "ARR can be measured two ways: revenue-based (what investors/banks see, accounting correct) or bookings-based (what sales team thinks about, forward-looking); bookings ARR = (bookings this quarter × 4), revenue ARR = (revenue this quarter × 4); bookings-based looks better (customers committed) but revenue-based is conservative (only what earned); for growth story, reference bookings; for profitability, reference revenue"
    ],
    content: [
      {
        heading: "Bookings vs. Revenue vs. Billings",
        body: `Three different metrics, all important, often confused.

**Definitions**

**Bookings** = Signed contract value (customer committed to pay)
- Timing: When contract is signed
- Amount: Total contract value
- Example: Customer signs £12K annual contract → Bookings = £12K (on day 1)

**Revenue** = Earned portion of contract (service delivered)
- Timing: As service is delivered (monthly for SaaS)
- Amount: Proportional to service delivered
- Example: Same customer, deliver 1 month service → Revenue = £1K (month 1)

**Billings** = Cash received from customer
- Timing: When customer pays invoice
- Amount: Cash actually received
- Example: Same customer, invoice due 30 days later → Billings = £12K (30 days after contract)

**Real Example**

Customer signs contract: January 1
- Contract value: £12,000 for annual subscription
- Payment terms: Net 30 (due Feb 1)

| Date | Event | Bookings | Revenue | Billings |
|------|-------|----------|---------|----------|
| Jan 1 | Sign contract | +£12K | — | — |
| Feb 1 | Receive payment | — | — | +£12K |
| Jan (month end) | Deliver service | — | +£1K | — |
| Feb (month end) | Deliver service | — | +£1K | — |
| ... | ... | — | ... | — |
| Dec (month end) | Deliver service | — | +£1K | — |

Summary:
- Total bookings: £12K (Jan 1)
- Total revenue: £12K (spread £1K × 12 months)
- Total billings: £12K (Feb 1)

Same total, but timing and delivery pattern differ.

**Impact on Metrics**

**Growth rate appears different:**

January metrics:
- Bookings: £12K booked (sales perspective)
- Revenue: £1K recognized (accounting perspective)
- Billings: £0 (cash hasn't arrived yet)

January looks dramatically different (£12K vs. £1K vs. £0) depending on metric.

This is why sales team obsesses on bookings (shows their success on day 1) while accountants care about revenue (shows true earnings).

**ARR is different by basis:**

Bookings-based ARR:
- Bookings this quarter: £50K
- Annualized: £50K × 4 quarters = £200K bookings ARR
- Forward-looking (what customers committed to)

Revenue-based ARR:
- Revenue this quarter: £25K (assuming 2-quarter lag before recognition)
- Annualized: £25K × 4 = £100K revenue ARR
- Backward-looking (what was earned this quarter)

Same company:
- Bookings ARR: £200K (sounds better)
- Revenue ARR: £100K (more conservative)

Investors want both numbers. Revenue ARR is audited (true), bookings ARR shows sales pipeline power.

**When Bookings = Revenue = Billings**

Only when customer pays upfront:

Customer pays £12K on Jan 1:
- Bookings: £12K (Jan 1, contract signed)
- Billings: £12K (Jan 1, cash received)
- Revenue: £1K/month (Jan-Dec, service delivered)

Bookings = Billings (same day), but Revenue spread over 12 months.

This is why annual prepayment is ideal (cash collected upfront, even though revenue spread over year).

**Deferred Revenue Connection**

When customer prepays:
- Cash collected: £12K
- Deferred revenue liability: £12K (obligation to deliver service)
- As service delivered monthly: Deferred revenue decreases, revenue increases

Journal entries:

Day 1 (contract signed, customer pays):
  Debit: Cash £12K
  Credit: Deferred revenue £12K
  (Bookings recorded separately)

Month 1 end (service delivered):
  Debit: Deferred revenue £1K
  Credit: Revenue £1K

Deferred revenue balance:
- Jan 1: £12K (liability, obligation to deliver)
- Jan 31: £11K (1 month delivered)
- Dec 31: £0 (full year delivered)

Bookings (£12K) are separate from revenue (£12K spread), deferred revenue (liability) tracks the obligation.

**Impact on Company Metrics**

Company booking £5M this quarter:

Bookings perspective (sales):
- £5M booked = 30% growth (vs. last quarter £3.8M)
- Sales team executed well

Revenue perspective (accounting):
- If 3-month average contract → £1.7M revenue this quarter
- Growth appears ~17% (vs. last quarter)

Same reality, different perception. Bookings show forward momentum, revenue shows near-term delivery.

**Billings and Cash Flow**

If customers pay upfront:
- Bookings = Billings (on same day)
- Revenue spread over contract term

If customers pay net-30:
- Bookings (sign date) → Billings (30 days later) → Revenue (over term)
- 3-month lag before cash, then spread over 12 months

Example:

Q1 bookings: £6M (all signed this quarter)
- Q1 billings: £4M (collected from prior quarter deals + 67% of Q1)
- Q1 revenue: £2M (from prior quarters' contracts)

Q1 bookings appear strongest (£6M), but Q1 cash only £4M (billings lag), revenue only £2M.

**Forecast by Metric**

Sales team forecasts: Bookings
- "We'll book £8M next quarter" (sales pipeline forecast)
- Based on: pipeline opportunities, win probability, deal timing

Finance forecasts: Revenue
- "We expect £3M revenue next quarter" (accounting recognition)
- Based on: prior quarter billings, contract terms, delivery schedule

Neither forecasts: Billings
- Depends on: payment terms (30, 60, 90 day lag), customer payment behavior
- Harder to predict (customer payment timing unpredictable)

**Which Metric to Communicate**

For investors/board:
- Use revenue (audited, comparable to other companies)
- Also share bookings (forward momentum)
- Example: "£3M revenue this quarter, £5M bookings (67% growth)"

For sales team:
- Use bookings (shows their success)
- Motivates for new deals (bookings = commission)

For finance/ops:
- Use revenue (actual earnings)
- Use billings (cash position)

For cash management:
- Track billings carefully (when cash actually arrives)
- Accounts receivable (invoices not yet paid)
- Example: £5M revenue, but only £3M billed/collected = £2M working capital gap

All three metrics serve different purposes. Master the differences.
`
      }
    ],
    relatedSlugs: [
      "revenue-recognition-accrual-accounting",
      "cash-management-and-forecasting",
      "financial-forecasting-modeling",
      "profitability-mechanics",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What's the difference between bookings and revenue?",
        a: "Bookings = signed contract (day 1). Revenue = earned portion (spread over service delivery). £12K annual contract = £12K bookings day 1, £1K revenue each month."
      },
      {
        q: "Should I report bookings or revenue to investors?",
        a: "Revenue (audited, conservative). But also report bookings (shows forward momentum). Example: \"£3M revenue, £5M bookings (67% growth).\"  Investors want both."
      },
      {
        q: "How does billings differ from bookings?",
        a: "Bookings = signed (commitment). Billings = cash received (actual payment). If customers pay 30 days late, bookings day 1, billings day 31."
      },
      {
        q: "How do I forecast by metric?",
        a: "Bookings: sales pipeline forecast (what deals will close). Revenue: billing schedule forecast (when signed deals will be recognized). Billings: payment term forecast (when cash arrives)."
      }
    ],
    videoUrl: ""
  }
];

export default batch94Articles;
