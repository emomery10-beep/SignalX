import { AcademyArticle } from "@/types/academy";

export const batch322Articles: AcademyArticle[] = [
  {
    slug: "financial-controls-and-audit-readiness",
    title: "Financial Controls and Audit Readiness: Preparing for Due Diligence",
    description: "Master financial controls. Implement systems, prepare audits, ensure compliance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["financial controls", "audit", "SOX compliance", "internal controls", "financial audit"],
    keyTakeaways: [
      "Financial controls: Systems ensuring accurate financial reporting, preventing errors and fraud. Key controls: Revenue recognition (correct invoicing, timing), expense tracking (all expenses recorded), bank reconciliation (accounts match bank), approval workflows (spending authorized). Cost: Accounting staff time, tools. Benefit: Accurate financials (better decisions), audit-ready (faster fundraising), fraud prevention (reduce risk).",
      "Audit preparation: Be ready for investor audits (Series A+) or external audits (IPO). Requirements: Clean books (all transactions recorded), documented processes (how are we accounting?), strong internal controls. Cost: Accountant time (prep, coordination), auditor fees (£5-50K depending on size). Benefit: Credibility (audited = trustworthy), faster closing (less questions).",
      "Controls by function: Revenue (contracts, invoicing, revenue recognition), expenses (approval, coding, monthly close), payroll (withholding, records, compliance), cash (reconciliation, controls). Implementation: Start with small company basics (monthly close, reconciliation), mature to formal controls (segregation of duties, documented procedures, audits)."
    ],
    content: [
      {
        heading: "Building Financial Controls and Audit Readiness",
        body: `Establishing systems for accuracy and compliance.

**Financial controls framework**

Definition:
- Policies and procedures ensuring:
  - Accurate financial reporting
  - Compliance with laws/standards
  - Fraud prevention
  - Asset protection

Core controls:

Authorization:
- Spending approved before payment (no unauthorized spend)
- Approval limits (£500 approver, £5K manager, £50K CEO)
- Documented (trail of approvals)

Segregation of duties:
- Requestor ≠ Approver ≠ Processor ≠ Reconciler
- Prevents one person from committing fraud
- Example: Sales requests order, finance approves, ops processes, accounting reconciles

Reconciliation:
- Bank account: Reconcile monthly (deposits/withdrawals match)
- Balance sheet: Reconcile accounts quarterly (add up correctly)
- Aging reports: AR, AP aged (who owes us, who we owe)

Documentation:
- Contracts: Signed (proof of transaction)
- Invoices: Detailed (description, amounts, terms)
- Receipts: Kept (backup for expenses)
- Journals: Trail of entries (how recorded)

**Revenue controls**

Contracts:
- Standard terms: Payment terms, conditions, deliverables
- Approval: CFO signs (legal authority)
- Storage: Filed and indexed
- Risk: Missing contract = dispute (who agreed to what?)

Invoicing:
- Template: Consistent format
- Details: Customer, amount, invoice number, date, payment terms
- Timing: Invoice when service delivered (revenue recognition rule)
- Tracking: Invoice number sequence (can't skip, no gaps = fewer errors)

Revenue recognition:
- Method: Recognize when earned (not when paid)
- Example: 12-month contract (£12K), recognize £1K/month
- Rule: ASC 606 (accounting standard)
- Documentation: Journal entry showing calculation

Billing system:
- Automated: Reduces errors, faster invoicing
- Reconciliation: Billing vs revenue recognized (should match)
- Tools: Stripe, Zuora, bill.com

**Expense controls**

Approval workflow:
- Request: Employee submits (amount, purpose)
- Manager approval: Is this necessary? Is amount reasonable?
- Finance approval: Is it coded correctly? Do we have budget?
- Payment: Approved invoice paid

Example amounts:
- <£500: Manager approval only
- £500-2K: Manager + Finance approval
- £2K-10K: Manager + Finance + Department head
- >£10K: Manager + Finance + Executive approval

Documentation:
- Expense approval form (what is being spent, why)
- Receipt (proof of cost)
- Coding (what account to charge to)
- PO number (for tracking)

Monthly expense review:
- All expenses reconciled to invoices (amounts match)
- All expenses coded correctly (tax, department, etc.)
- No duplicate payments (same invoice paid twice)
- Unusual items flagged (one-time items, large amounts)

**Payroll controls**

Setup:
- Written policy (salary, benefits, PTO terms)
- Employment agreements (job title, compensation, terms)
- Tax setup (W-4s, tax withholding)

Processing:
- Time tracking: Hours worked (for hourly)
- Approval: Manager approves timesheet
- Payroll run: Payroll processed correctly
- Taxes: Correct withholding applied
- Compliance: Payroll taxes filed/paid correctly

Monthly verification:
- Headcount: Who's on payroll? (catch errors)
- Amounts: Did people get paid correctly?
- Deductions: Were benefits, taxes deducted?
- Reconciliation: Payroll expense reconciled to GL

Annual:
- W-2 prep: Total compensation, withholding correct
- Tax filing: All taxes paid, files submitted
- Audit: Payroll records organized for auditor

**Cash controls**

Bank reconciliation:
- Monthly: Compare bank statement to accounting books
- Timing: Cash in bank should match cash in accounting
- Investigation: Any differences explained (outstanding checks, deposits)
- Frequency: Monthly minimum, some companies weekly/daily for large balances

Example reconciliation:

Bank statement: £50,000
- Outstanding checks: -£5,000 (checks written not cleared)
- Deposits in transit: +£3,000 (deposits not yet shown)
- Adjusted bank: £48,000

Accounting books: £48,000 ✓ (Match!)

Internal controls:
- Segregation: Approver ≠ Signer ≠ Reconciler
- Dual signature: Large checks require two signatures
- Monitoring: CFO reviews all bank transfers
- Security: Limited access to bank portal

**Audit readiness**

Preparation timeline:

6 months before (planning):
- Meet with auditor (understand scope, timeline)
- Assess readiness (what needs fixing?)
- Create checklist (documents needed)

3 months before (organizing):
- Organize documents (contracts, invoices, payroll)
- Reconcile accounts (make sure books clean)
- Prepare schedules (list of accounts, amounts)
- Draft footnotes (explain significant items)

1 month before (finalization):
- Final reconciliations (everything agrees)
- Walk-through meeting (auditor reviews scope)
- Gather missing docs (resolve any gaps)

During audit (2-4 weeks):
- Auditor reviews sample of transactions
- Tests controls (are they working?)
- Interviews staff (understand processes)
- Requests documentation (contracts, approvals, reconciliations)

Post-audit:
- Review findings (issues, recommendations)
- Corrective action plan (how will we fix?)
- Signed audit report (auditor certifies financials)

Typical audit fees by company size:

| Revenue | Employees | Cost |
|---|---|---|
| £1-5M | 5-20 | £5-15K |
| £5-20M | 20-100 | £15-40K |
| £20-50M | 100-300 | £40-80K |
| £50M+ | 300+ | £80K+ |

**Controls maturity by stage**

Early stage (seed, <10 people):
- Basic: Monthly close, bank reconciliation
- Tools: Spreadsheet, basic accounting software
- Process: Founder does accounting, accountant does taxes
- Audits: None (bootstrap)

Growth stage (Series A/B, 10-50 people):
- Intermediate: Monthly close, revenue controls, expense approvals
- Tools: Accounting software (Xero, Quickbooks, FreshBooks)
- Process: Dedicated accountant, outsourced bookkeeper
- Audits: Internal review (accountant), no external audit yet

Scale stage (Series B/C, 50-200 people):
- Advanced: Monthly/quarterly close, full controls, internal audit
- Tools: Enterprise accounting system (NetSuite, Workday)
- Process: Accounting team (general ledger, AR, AP, payroll)
- Audits: Annual external audit (prepare for Series C investor requirements)

Mature stage (IPO-ready, 200+ people):
- Formal: Monthly close, quarterly review, annual external audit
- Tools: Enterprise systems with strong controls
- Process: Internal audit team, CFO, audit committee
- Audits: External auditor, SEC compliance (if public)

**Implementation roadmap**

Month 1-2: Foundation
- Document current processes (how are we doing things?)
- Create approval policy (who approves what)
- Set up chart of accounts (consistent coding)
- Monthly close process (document steps)

Month 3-4: Revenue controls
- Contract template (standard terms)
- Revenue recognition policy (when to invoice)
- Reconciliation: Billing vs revenue
- Testing: Walk through revenue cycle

Month 5-6: Expense controls
- Approval workflow (documented, implemented)
- Chart of accounts (full coding structure)
- Monthly reconciliation (expenses → GL)
- Testing: Walk through expense cycle

Month 7-8: Payroll controls
- Policy document (compensation, PTO, benefits)
- Payroll process (how salary determined, taxes calculated)
- Monthly verification (headcount, amounts)
- Annual reconciliation (W-2s, tax filings)

Month 9+: Audit readiness
- Organize documents (contracts, invoices, payroll records)
- Reconcile all accounts (make sure everything agrees)
- Controls testing (are they working?)
- Prepare audit schedules (summary of amounts)

**Common control failures**

Failure 1: Lack of approval
- Risk: Unauthorized spending, fraud
- Example: Employee approves own expenses
- Fix: Segregation of duties, approval workflow

Failure 2: Poor documentation
- Risk: Can't audit transactions, fraud undetected
- Example: Large payment with no explanation
- Fix: Require documentation (invoice, contract, memo)

Failure 3: Revenue timing errors
- Risk: Revenue recognized in wrong period (over/under statements)
- Example: Invoice month 12, collect month 1 (which period?)
- Fix: Revenue recognition policy (when earned, not when paid)

Failure 4: Missing reconciliations
- Risk: Bank account errors, GL discrepancies undetected
- Example: Missing deposit, never found out
- Fix: Monthly bank reconciliation, monthly GL review

Failure 5: No segregation of duties
- Risk: One person can commit fraud, not caught
- Example: One person approves and processes payments
- Fix: Different people for approve/process/reconcile

`
      }
    ],
    relatedSlugs: ["compliance-and-regulatory-considerations", "revenue-recognition-and-accounting-standards", "due-diligence-preparation-for-investment", "financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What financial controls do I need to implement?", a: "Core controls: (1) Revenue - contracts, invoicing, revenue recognition. (2) Expenses - approval workflow, documentation, reconciliation. (3) Payroll - policy, timesheets, tax compliance. (4) Cash - bank reconciliation, segregation of duties. (5) Documentation - keep contracts, invoices, receipts. Cost: Accounting staff, tools. ROI: Accurate financials, audit-ready, fraud prevention." },
      { q: "How do I prepare for an audit?", a: "Timeline: (1) 6 months before - plan with auditor. (2) 3 months before - organize documents, reconcile accounts. (3) 1 month before - finalization, walk-through. During audit: Auditor tests controls, requests documents. Cost: £5-50K depending on size. Benefit: Audited financials (credible, faster closing), no surprises." },
      { q: "What's needed for audit readiness?", a: "Requirements: Clean books (all transactions recorded), documented processes (how do we account for things?), strong controls (segregation of duties, approvals). Specific: Revenue recognized correctly, expenses approved and documented, payroll accurate, cash reconciled, balance sheet items reconciled. Preparation: Organize documents 1-2 months before, walk-through with auditor." }
    ],
    videoUrl: ""
  }
];

export default batch322Articles;