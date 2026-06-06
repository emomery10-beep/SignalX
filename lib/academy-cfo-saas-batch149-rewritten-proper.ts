import { AcademyArticle } from "@/types/academy";

export const batch149Articles: AcademyArticle[] = [
  {
    slug: "financial-controls-and-audit-readiness",
    title: "Financial Controls and Audit Readiness: Building Trust Through Proper Governance",
    description: "Master financial controls. Implement internal controls, prepare for audits, ensure data integrity, and build credibility with stakeholders.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "financial controls",
      "internal controls",
      "audit readiness",
      "SOX compliance",
      "segregation of duties",
      "expense controls",
      "revenue recognition",
      "account reconciliation",
      "audit trail",
      "data integrity"
    ],
    keyTakeaways: [
      "Segregation of duties (SOD): No single person approves expense and pays it (fraud risk). Example: Employee submits expense, manager approves, accountant pays (3 people). If one person: Can expense £10K to friend, approve, pay self. With SOD: Multiple approvals = harder to commit fraud. Rule: Spending authority by role (employee £1K, manager £5K, CFO £50K, CEO unlimited) + approval required before payment.",
      "Account reconciliation: Monthly bank reconciliation (verify bank statement matches accounting records). Example: Bank shows £10K, accounting records show £10K, reconcile ✓. But if bank £9.5K, accounting £10K: Find the £0.5K discrepancy (bank fee? uncleared check?). Do monthly, investigate variance >£100. Prevents fraud (embezzlement caught quickly).",
      "Audit readiness: Keep clean records (can auditor verify transactions?). Example: Invoice £1K to customer, received £1K payment, revenue recognized (auditor can verify). Vs: Revenue recorded with no invoice or payment documentation (red flag). Maintain documentation for all transactions. Costs: Accountant £50-100K/year (worth it for credibility, investor confidence)."
    ],
    content: [
      {
        heading: "Internal Control Framework",
        body: `Building systems to prevent errors and fraud.

**Segregation of Duties (SOD)**

Principle: No one person handles entire transaction (approval, execution, reconciliation).

Example (good controls):
1. Employee submits expense report (driver: receipt, business justification)
2. Manager reviews and approves (verifies business purpose)
3. Accountant verifies budget (checks spending authority)
4. Finance team processes payment (transfers funds)
5. CFO reviews monthly (spot-check accuracy)

Result: 5 people involved, hard to commit fraud (would need 2+ conspirators).

Example (bad controls):
1. Employee submits expense
2. Same person approves and processes payment

Result: One person = fraud risk (can expense personal items, approve, pay self).

**Spending Authorities**

Define spending limits by role:

| Role | Limit | Approval Required | Department |
|------|-------|------------------|-----------|
| Individual contributor | £1K | Manager | Any |
| Manager | £5K | Director | Any |
| Director | £25K | CFO | Any |
| CFO | £100K | CEO | Any |
| CEO | Unlimited | Board | Any |

Example:
- Employee wants to buy £800 laptop: Manager approval (within limit)
- Department wants £30K contract: CFO approval (exceeds director limit)
- CEO hires consultant £200K: Board approval (above CEO limit)

Enforce: System blocks purchases exceeding authority level.

**Expense Categories and Approval Rules**

Different categories require different controls:

Routine (fast-track):
- Office supplies (<£1K): Manager approval
- Software subscriptions (<£5K): Director approval
- Travel (<£2K): Department head approval

Special (require extra review):
- Consulting contracts (£25K+): Legal review + CFO approval
- Related-party (CEO pays company bill): Board approval + audit review
- Large contracts (£100K+): 2 CFO-level approvals + legal

Risk-based: Higher risk categories require more approval levels.

**Access Controls**

Who can access bank accounts, accounting systems?

Best practice:
- CEO: Can transfer >£100K (not routine)
- CFO: Can transfer up to £50K (daily operations)
- Accountant: Can view all (posting, reconciling), not transfer
- Intern: Read-only access (learning)

Principle: Read access liberal (transparency), write access restricted (control).

Audit trail: All changes logged (who, when, what changed).

Example: Accountant changes invoice amount from £1K to £2K. Log shows:
- Accountant Name, Date/time, Changed from £1K to £2K, Reason: "corrected typo"

Auditor can verify changes are appropriate.

**Fraud Indicators**

Red flags to watch:

1. Round-number expenses (£10K, £5K, not £4,743)
   - Suggests manual entry, not real receipt
   - Review: Require detailed expense reports, receipt images

2. Personal expenses (gym membership, personal phone)
   - Not business use
   - Reject: Policy clear on what's reimbursable

3. Missing documentation (no receipt, no invoice)
   - Can't verify legitimacy
   - Reject: Require documentation for all expenses >£500

4. Unusual vendors (employee owns vendor, personal friend)
   - Related-party risk
   - Review: Disclose relationships, get approvals

5. Frequency spikes (suddenly 10x normal expense)
   - Could be legitimate (project), could be fraud
   - Review: Understand spike, approve if appropriate

Monitor monthly: Flag items for investigation.

`
      },
      {
        heading: "Financial Reporting and Reconciliation",
        body: `Accurate accounting that can withstand audit.

**Bank Reconciliation**

Monthly reconciliation: Compare bank statement to accounting records.

Process:
1. Get bank statement (Jan 1-31)
2. List all transactions in accounting (checks, deposits, transfers)
3. Match each line item (deposit in bank = revenue recorded, check = expense recorded)
4. Find differences:
   - Bank shows £10K deposit, accounting shows £10K ✓
   - Bank shows £500 fee, accounting doesn't ✓ (add to accounting)
   - Bank shows £100 check not yet cleared ✓ (record as pending)
5. Reconcile: Bank balance = Accounting balance

Typical differences:
- Uncleared checks (written but not cashed yet)
- Bank fees (not recorded until bank statement received)
- Timing differences (check deposited end of month, cleared early next month)

Investigate: Variances >£100 (could be error or fraud).

**Revenue Recognition**

Record revenue when earned (accrual accounting), not when cash received.

Example (monthly subscription):
- Jan 1: Customer signs £1,200 annual contract, pays £1,200 upfront
- Accounting entry: Dr. Cash £1,200, Cr. Deferred Revenue £1,200
- Monthly (Jan-Dec): Dr. Deferred Revenue £100, Cr. Revenue £100
- By Dec 31: All revenue recognized, deferred revenue zero

Document: For each revenue transaction, file:
- Contract (proof of agreement)
- Invoice (billing)
- Payment proof (bank statement, receipt)
- Delivery proof (customer used service, or terms met)

Auditor verifies: For sample of revenue, can trace back to contract and payment.

**Expense Recognition**

Record expenses when incurred (accrual accounting).

Example:
- Jan 15: Receive invoice for Feb office rent £5K
- Jan: Accrue expense (Dr. Expense £5K, Cr. Accrued Expense £5K)
- Feb 1: Pay invoice (Dr. Accrued Expense £5K, Cr. Cash £5K)
- Result: Expense recognized in Jan (when incurred), not Feb (when paid)

Document: For each expense, file:
- Invoice (amount, date, vendor, description)
- Receipt (proof of payment)
- Approval (manager sign-off)
- P&L category (correctly categorized)

**Trial Balance and Ledger**

General ledger: All accounts (assets, liabilities, equity, revenue, expenses)

Example ledger:
| Account | Debit | Credit | Balance |
|---------|-------|--------|---------|
| Cash | £10K | £5K | £5K (debit) |
| Accounts Receivable | £20K | £15K | £5K (debit) |
| Software Subscription | | £2K | £2K (credit) |
| Revenue | | £100K | £100K (credit) |

Trial balance: Sum debits = sum credits (if not, error exists)

Close monthly:
- Prepare trial balance
- Post all adjusting entries (accruals, depreciation)
- Prepare financial statements
- File accounting records

**Account Mapping and Chart of Accounts**

Define consistent account structure:

Assets:
- Current: Cash, Accounts Receivable, Prepaid Expenses
- Fixed: Equipment, Furniture, Accumulated Depreciation

Liabilities:
- Current: Accounts Payable, Accrued Expenses, Deferred Revenue
- Long-term: Debt, Lease Obligations

Equity:
- Common Stock, Retained Earnings

Revenue:
- Subscription Revenue (by customer type: SMB, mid-market, enterprise)
- Professional Services Revenue
- Other Revenue

Expenses:
- COGS (hosting, support, payment fees)
- Sales & Marketing
- Engineering
- General & Administrative

Consistent mapping: Every transaction mapped to account. No ambiguity.

Example: Invoice for Slack (communication tool)
- Category A: Software Expense (operating expense)
- Category B: G&A (general & admin)
- Only one correct (consistency)

`
      },
      {
        heading: "Audit Readiness and Preparation",
        body: `Getting ready for external audit.

**What Auditors Look For**

External auditor reviews:
1. Financial statements accuracy (revenue, expenses match records)
2. Internal controls effectiveness (can fraud be prevented?)
3. Compliance with laws (GAAP, tax law, regulations)
4. Significant transactions (large expenses, related-party deals)
5. Management estimates (depreciation, reserves, valuations)

Audit process:
- Planning (understand business, risks)
- Testing (sample transactions, verify accuracy)
- Reporting (financial statements certified as accurate)
- Recommendations (improvements to controls)

**Documentation Standards**

For every material transaction, maintain:
1. Source document (invoice, receipt, contract)
2. Authorization (approval signature or email)
3. Transaction entry (accounting record)
4. Reconciliation (verified accurate)

Example: £100K consulting contract
- Source: Contract with consultant, statement of work
- Authorization: CEO email approving engagement
- Entry: Invoice received, payment made, recorded as expense
- Reconciliation: Monthly review, accrued vs. paid tracking

For audit: Produce transaction within 5 minutes (efficient audit, lower cost).

**Preparing for Audit**

Pre-audit checklist (2 weeks before):
- [ ] Bank reconciliation complete and accurate
- [ ] All revenue documented (contract, invoice, payment)
- [ ] All major expenses documented (invoice, approval, payment)
- [ ] Accounts receivable aged (how old are outstanding invoices?)
- [ ] Inventory verified (physical count matches records)
- [ ] Fixed assets listed (equipment, depreciation schedule)
- [ ] Debt documented (terms, payment schedule)
- [ ] Equity structure (cap table accurate)
- [ ] Related-party transactions disclosed (any deals with founders, board members)
- [ ] Compliance checks (tax filings, regulatory compliance)

If audit starts and records disorganized:
- Cost: Extra audit time = £5K-20K in audit fees
- Findings: Deficiencies in controls (negative report)

If records are clean:
- Cost: Standard audit fees (budgeted)
- Findings: Unqualified opinion (clean bill of health)

Invest in clean records upfront (saves money, improves opinion).

**Common Audit Findings**

Finding 1: Inadequate segregation of duties
- Impact: Risk of fraud not mitigated
- Fix: Implement approval workflows

Finding 2: Lack of documentation
- Impact: Can't verify transaction authenticity
- Fix: Require receipts, invoices, approvals for all transactions >£1K

Finding 3: Untimely reconciliations
- Impact: Errors not caught early
- Fix: Monthly bank, AR, AP reconciliations

Finding 4: Related-party transactions not disclosed
- Impact: Conflicts of interest
- Fix: Disclose all related-party transactions upfront

Findings = recommendations, not show-stoppers. Address them next year (improvement plan).

**Cost of Audit**

Early stage (£1-5M revenue): £20-50K per audit
Growth stage (£5-50M revenue): £50-150K per audit
Scale stage (>£50M revenue): £150K+

Factors affecting cost:
- Complexity (number of locations, currencies)
- Controls (strong controls = less testing = lower cost)
- Records organization (messy = more time = higher cost)
- Audit scope (full vs. limited)

**Audit Committee**

Once company scales (or preparing for IPO):
- Board-level audit committee (oversees audit)
- Meetings with external auditor (independent from management)
- Reviews audit findings, remediation plans

For startup: CEO + CFO + 1 board member typically sufficient (informal audit committee).

`
      },
      {
        heading: "Building a Scalable Finance Function",
        body: `Processes that grow with the company.

**Stage 1: Founder CFO (0-£500K ARR)**

Founder handles all finance:
- Invoicing, payment collection, bank reconciliation
- Expense approval, accounting entries
- Tax compliance, financial reporting
- Time: 10-20 hours/week

Systems: Spreadsheet or simple accounting software (QuickBooks, Xero).

Controls: Minimal (founder owns all decisions).

**Stage 2: Part-time Accountant (£500K-£2M ARR)**

Hire 1 part-time accountant (10-20 hours/week):
- Daily accounting (invoicing, expense processing)
- Monthly reconciliations and reporting
- Tax preparation (work with CPA)
- Frees founder for strategy

Systems: Accounting software (QuickBooks, Xero, Sage).

Controls: Basic (founder approval on large items, accountant on routine).

**Stage 3: Full-time Finance Team (£2M-£10M ARR)**

Hire CFO + 1-2 accountants:
- CFO: Strategy, forecasting, investor relations, board reporting
- Accountants: Daily operations, reconciliations, compliance

Systems: Enterprise accounting (NetSuite, Intacct), billing automation (Zuora).

Controls: Formal (SOD, spending authorities, approval workflows).

**Stage 4: Mature Finance Department (>£10M ARR)**

Expand team:
- VP Finance: Strategy, FP&A, planning
- Controller: Accounting, controls, compliance
- Senior Accountants: Revenue, expense, tax, reporting
- Accounting Manager: Team coordination, process improvement

Systems: Enterprise (NetSuite, SAP), integrated CRM/billing.

Controls: Robust (audit committee, SOX-ready controls, regular audits).

**Financial System Implementation**

Choose tools by stage:

Early (£0-£1M): Free or cheap ($10-50/month)
- Stripe for billing
- Xero for accounting
- Google Sheets for forecasting

Growth (£1-£10M): Moderate ($200-500/month)
- Zuora or Paddle for billing
- Xero or QuickBooks
- Google Sheets or Tableau for reporting

Scale (>£10M): Enterprise ($1000+/month)
- Zuora, Salesforce billing
- NetSuite accounting
- Tableau, Looker for analytics

Integration: Billing → Accounting (automated) → Reporting (daily dashboards).

ROI: Automation reduces manual work 50-70%, freeing CFO for strategy.

**Culture: Finance for the Company**

Finance team shouldn't be "cost center cops" (blocking all spending).

Better: Finance as enabler ("How do we fund this growth?").

Examples:
- Question: "Can we hire 2 sales reps?"
- Finance: "That costs £200K. Current revenue growth 5%. Hire 1 rep, measure ROI, then decide on 2nd."
- Result: Informed decision, faster hiring

vs.

- Finance: "No, too expensive."
- Result: Company resentful, finance seen as blocker.

Good finance: Trust, transparency, partnership with leadership.

`
      }
    ],
    relatedSlugs: [
      "bookings-vs-revenue-recognition",
      "p-l-statement-architecture-profitability",
      "financial-forecasting-modeling",
      "exit-planning-m-a-preparation",
      "tax-planning-for-saas-and-startups"
    ],
    faq: [
      {
        q: "What are the basic internal controls I should implement?",
        a: "Segregation of duties: No one person approves and pays. Spending authorities: Employee £1K, Manager £5K, CFO £50K. Approval workflows: Manager approves, accountant pays. Monthly reconciliation: Bank statement matches accounting. Documentation: Receipt + approval for all expenses >£500. These prevent fraud and catch errors early."
      },
      {
        q: "How do I prepare for an external audit?",
        a: "2 weeks before: Complete bank reconciliation, verify all revenue documented (contract, invoice, payment), major expenses documented, accounts receivable aging, fixed assets list, debt schedule. Have invoices, approvals, receipts organized. If records clean, audit costs less and findings fewer. If messy, audit expensive (£5K-20K extra) and findings likely."
      },
      {
        q: "What's the difference between cash and accrual accounting?",
        a: "Cash: Record when money changes hands (simple, used for taxes). Accrual: Record when earned/owed (accurate, used for reporting). Example: Jan contract £1K, paid Feb. Cash: Jan £0, Feb £1K. Accrual: Jan £1K, Feb £0 (recognizes when earned). SaaS should use accrual (shows true economics, deferred revenue matters)."
      },
      {
        q: "When should I hire a CFO?",
        a: "Sooner = better, but depends on funding. Bootstrapped: Hire at £1-2M ARR (complexity warrants). Funded: Hire before Series A (investors expect CFO for financial oversight). Typical: CFO takes 10-20% CFO work initially (other role), becomes full-time at £5-10M ARR. Key: Having oversight/accountability, not necessarily full-time person."
      }
    ],
    videoUrl: ""
  }
];

export default batch149Articles;
