import { AcademyArticle } from "@/types/academy";

export const batch395Articles: AcademyArticle[] = [
  {
    slug: "saas-accounts-receivable-and-collections",
    title: "Accounts Receivable and Collections: Getting Paid on Time",
    description: "Master AR management. Reduce DSO, automate collections, and minimise bad debt in SaaS.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["accounts receivable", "collections", "DSO", "invoicing", "bad debt"],
    keyTakeaways: [
      "Days Sales Outstanding (DSO): Average time to collect payment. Formula: (Accounts Receivable ÷ Revenue) × Days in period. SaaS target: <30 days (self-serve/auto-billing), <45 days (SMB), <60 days (enterprise). Example: £400K AR on £200K monthly revenue = (£400K / £200K) × 30 = 60 days DSO. Improvement: Move to auto-billing = DSO drops to <5 days. Every 10-day DSO improvement on £5M ARR = £137K working capital released.",
      "Collection process automation: Tiered approach. Day 0: Invoice sent automatically. Day 1: Payment confirmation or retry. Day 7: Friendly reminder email. Day 14: Second reminder + phone call (enterprise). Day 30: Formal overdue notice. Day 45: Account manager escalation. Day 60: Service suspension warning. Day 90: Send to collections or write off. Automating days 0-30 saves 80% of collection effort. Tools: Stripe auto-billing, GoCardless, Chargebee dunning.",
      "Bad debt management: SaaS bad debt should be <1% of revenue. Provision: Set aside 1-2% of AR as bad debt reserve. Write-off criteria: >90 days overdue + no payment plan + no response. Example: £5M revenue, 0.5% bad debt = £25K/year written off. Prevention: Credit checks for enterprise (>£50K ACV), require payment upfront for SMB, auto-billing for all self-serve. Impact on cash flow: Every £1 of bad debt costs £1 in cash + acquisition cost to replace."
    ],
    content: [
      {
        heading: "Managing Accounts Receivable and Collections in SaaS",
        body: `Ensuring timely payment collection to maintain healthy cash flow.

**DSO analysis and benchmarking**

Calculating DSO:

Formula: (Accounts Receivable ÷ Monthly Revenue) × 30

Example:
| Month | Revenue | AR balance | DSO |
|---|---|---|---|
| January | £200K | £350K | 52.5 days |
| February | £210K | £380K | 54.3 days |
| March | £220K | £320K | 43.6 days |

Trend: Improving (DSO decreasing)

DSO benchmarks by billing model:

| Billing model | DSO target | Typical range |
|---|---|---|
| Self-serve (auto-billing) | <5 days | 0-10 days |
| SMB (credit card) | <15 days | 5-30 days |
| Mid-market (invoice) | <45 days | 30-60 days |
| Enterprise (invoice) | <60 days | 45-90 days |

Blended DSO target: Depends on customer mix
- Self-serve heavy: <15 days
- Enterprise heavy: <50 days
- Mixed: <30 days

Working capital impact:

Every 10 days of DSO on £5M ARR:
- AR = (£5M / 365) × 10 = £137K
- This is cash you've earned but don't have
- Reducing DSO by 10 days releases £137K in working capital

Example improvement:
- Current DSO: 55 days on £5M ARR
- Target DSO: 35 days
- Improvement: 20 days
- Cash released: £274K (significant for growing company)

**Invoicing best practices**

Invoice accuracy and timing:

Send immediately:
- Invoice on day of service start (not end of month)
- Reduces payment delay by 15-30 days
- Example: Customer starts January 5, invoice January 5 (not February 1)

Include on every invoice:
- Clear payment terms (net-30, net-60)
- Payment methods accepted
- Bank details or payment link
- Purchase order number (if required)
- Contact for billing queries
- Due date (prominently displayed)

Format:
- PDF attachment to email
- Include payment link (click to pay)
- Integrate with accounting system

Payment methods:

Conversion rate by payment method:

| Method | Setup friction | On-time payment | Cost |
|---|---|---|---|
| Credit card (auto) | Low | 95% | 2.5-3.5% |
| Direct debit (auto) | Medium | 98% | £0.20-0.50 |
| Bank transfer (manual) | Low | 70% | Free |
| Cheque (manual) | High | 60% | £5 processing |

Recommendation:
- Self-serve/SMB: Credit card or direct debit (auto-billing)
- Mid-market: Direct debit preferred, bank transfer accepted
- Enterprise: Bank transfer (most will only do this)

**Automated collection workflow**

Phase 1: Pre-due date (automated)

Day -7: Payment reminder
- Email: "Your invoice of £X is due in 7 days"
- Include: Payment link, amount, due date

Day -3: Payment reminder (enterprise only)
- Email to finance contact
- Confirm PO and payment details correct

Phase 2: Due date (automated)

Day 0: Auto-collect attempt
- Credit card: Auto-charge
- Direct debit: Auto-collect
- Invoice: Mark as due

Day +1: Payment confirmation or retry
- If collected: Thank you email
- If failed: Retry payment + notify customer

Phase 3: Follow-up (semi-automated)

Day +7: First follow-up
- Automated email: "Your payment is overdue"
- Include: Outstanding amount, payment link
- Tone: Friendly, helpful

Day +14: Second follow-up
- Automated email + personal note from account manager
- For enterprise: Phone call from CSM
- Tone: Concerned, offering help

Day +21: Third follow-up
- Email from finance team
- For enterprise: Escalate to senior contact
- Mention: Service continuity

Phase 4: Escalation (manual)

Day +30: Formal overdue notice
- Formal letter from CFO
- Payment plan option offered
- Service impact warning

Day +45: Account manager escalation
- Direct conversation about payment
- Negotiate payment plan if needed
- Document all communications

Day +60: Service suspension warning
- Written notice: 14 days to pay or service suspended
- Copy legal if large amount

Day +75: Service suspended
- Read-only access (data preserved)
- Final payment demand

Day +90: Final action
- Write off or send to collections
- Collections agency typically takes 25-40% of amount
- Legal action if >£10K (consider cost vs recovery)

**AR ageing analysis**

Monthly AR ageing report:

| Ageing bucket | Amount | % of AR | # invoices |
|---|---|---|---|
| Current (not yet due) | £150K | 37.5% | 45 |
| 1-30 days overdue | £120K | 30.0% | 30 |
| 31-60 days overdue | £80K | 20.0% | 15 |
| 61-90 days overdue | £30K | 7.5% | 8 |
| 90+ days overdue | £20K | 5.0% | 5 |
| Total AR | £400K | 100% | 103 |

Analysis:
- 67.5% is current or <30 days (healthy)
- 12.5% is >60 days (concerning)
- Focus: 8 invoices aged 61-90 days (£30K at risk)

Collection probability by age:

| Age | Collection probability |
|---|---|
| Current | 99% |
| 1-30 days | 95% |
| 31-60 days | 85% |
| 61-90 days | 70% |
| 90-120 days | 50% |
| 120+ days | 25% |

Expected collection:
= (£150K × 99%) + (£120K × 95%) + (£80K × 85%) + (£30K × 70%) + (£20K × 50%)
= £148.5K + £114K + £68K + £21K + £10K
= £361.5K

Expected bad debt: £400K - £361.5K = £38.5K

**Bad debt management**

Bad debt provision:

Create provision based on AR ageing:

| Ageing | AR balance | Provision % | Provision amount |
|---|---|---|---|
| Current | £150K | 1% | £1.5K |
| 1-30 days | £120K | 3% | £3.6K |
| 31-60 days | £80K | 10% | £8K |
| 61-90 days | £30K | 25% | £7.5K |
| 90+ days | £20K | 50% | £10K |
| Total | £400K | - | £30.6K |

Bad debt provision: £30.6K (7.65% of AR)

P&L impact:
- Bad debt expense: £30.6K (charged to operating expenses)
- Adjust monthly as AR ages

Write-off process:

Criteria for write-off:
- >90 days overdue
- No response to 3+ collection attempts
- No payment plan agreed
- Customer confirmed insolvent/closed

Approval:
- <£5K: Finance manager
- £5-25K: CFO
- >£25K: CEO + board notification

Documentation:
- Record of all collection attempts
- Customer communication
- Reason for write-off
- Accounting entry (debit bad debt expense, credit AR)

**Improving collection rates**

Strategy 1: Auto-billing (biggest impact)
- Implement for all self-serve and SMB
- Target: 80%+ of customers on auto-billing
- Impact: DSO drops to <5 days for these customers

Strategy 2: Payment terms in contract
- Specify: Net-30 (standard), Net-15 (preferred)
- Enterprise: Net-45 maximum (push back on net-60)
- Include: Late payment interest clause (1.5-2% per month)

Strategy 3: Early payment discount
- Offer 2% discount for payment within 10 days (2/10 net 30)
- Example: £10K invoice, pay within 10 days = £9.8K (save £200)
- Your cost: 2% discount = £200
- Your benefit: Cash 20 days earlier
- Annualised cost: 2% × (365/20) = 36.5% APR (expensive, use selectively)

Strategy 4: Deposit for large deals
- Enterprise deals >£50K: Request 25-50% deposit on signing
- Example: £100K annual deal, 50% deposit = £50K upfront
- Reduces AR and improves cash flow

Strategy 5: Credit assessment
- For enterprise (>£50K ACV): Run credit check before signing
- Use: Experian, Dun & Bradstreet, CreditSafe
- Cost: £10-50 per check
- Reject or require prepayment for high-risk customers

`
      }
    ],
    relatedSlugs: ["cash-flow-management-and-working-capital", "saas-financial-reporting-and-investor-updates", "saas-contract-negotiation-and-commercial-terms", "saas-operational-efficiency-and-automation", "revenue-recognition-and-deferred-revenue"],
    faq: [
      { q: "What DSO should a SaaS company target?", a: "Depends on billing model. Self-serve/auto-billing: <5 days. SMB (credit card): <15 days. Mid-market (invoice): <45 days. Enterprise (invoice): <60 days. Blended target: <30 days for mixed customer base. Every 10-day DSO improvement on £5M ARR releases £137K in working capital. Biggest impact: Move customers to auto-billing (credit card or direct debit)." },
      { q: "How should I structure my collection process?", a: "Tiered timeline: Day 0: Invoice sent. Day +7: Automated reminder. Day +14: Second reminder + personal outreach (enterprise). Day +30: Formal overdue notice. Day +45: Account manager escalation. Day +60: Service suspension warning. Day +90: Write off or collections. Automate days 0-30 (saves 80% of effort). Use dunning tools: Stripe, GoCardless, Chargebee. Most SaaS collections resolve within 30 days if automated." },
      { q: "How much bad debt is acceptable in SaaS?", a: "Target: <1% of revenue. Provision based on AR ageing: 1% for current, 3% for 1-30 days, 10% for 31-60 days, 25% for 61-90 days, 50% for 90+ days. Write off criteria: >90 days overdue + no response to 3+ attempts + no payment plan. Prevention: Auto-billing for SMB, credit checks for enterprise (>£50K), deposits for large deals. Every £1 of bad debt costs £1 cash + acquisition cost to replace that revenue." }
    ],
    videoUrl: ""
  }
];

export default batch395Articles;
