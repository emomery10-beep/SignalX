import { AcademyArticle } from "@/types/academy";

export const batch173Articles: AcademyArticle[] = [
  {
    slug: "financial-controls-and-audit-readiness",
    title: "Financial Controls and Audit Readiness: Building Trust in Your Numbers",
    description: "Master financial controls. Build systems that ensure accuracy, prevent fraud, and pass audits with confidence.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "financial controls",
      "internal controls",
      "audit preparation",
      "fraud prevention",
      "segregation of duties",
      "reconciliation",
      "financial accuracy",
      "audit readiness",
      "compliance",
      "SOX controls"
    ],
    keyTakeaways: [
      "Core controls: (1) Segregation of duties (one person approves, another processes, third reconciles). (2) Authorization limits (CEO approves >£10K, CFO approves £1-10K, manager approves <£1K). (3) Monthly reconciliations (bank rec, AR aging, AP aging). (4) Documented procedures (written, everyone knows). Example: Purchase order → approval → receipt → invoice matching → payment. No single person does all 5 steps (prevents fraud, catches errors).",
      "Financial close: End of month, close books in 3-5 days (depends on size). Process: Collect all transactions, record accruals, reconcile accounts, prepare statements. Checklist: Bank rec, AR aging, AP aging, revenue recognition, inventory count, fixed assets, payroll. Late close = sign of weak controls. Early close = sign of discipline.",
      "Audit readiness: Auditors test controls and financials. They expect: Complete documentation (expense receipts, invoices), accurate records (no manual adjustments, all documented), segregation of duties (evidence in system). If pass audit = clean opinion (valuations acceptable). If issues = qualified opinion (auditors noted problems). Raising capital or M&A requires clean audit opinion."
    ],
    content: [
      {
        heading: "Designing Financial Controls",
        body: `Building systems to ensure accuracy and prevent fraud.

**Segregation of Duties**

Principle: No single person should handle entire transaction from start to finish.

Example: Purchase process
- Step 1: Manager requests purchase (initiates need)
- Step 2: Finance approves (checks budget, vendor)
- Step 3: Vendor ships
- Step 4: Operations receives and inspects
- Step 5: Finance matches invoice (3-way match: PO, receipt, invoice)
- Step 6: Finance pays

If one person did all steps, could:
- Approve fake purchase (from friend's company)
- Receive payment (send fake invoice)
- Reconcile books (hide the fraud)

With segregation:
- Manager requests, finance questions unbudgeted purchase
- Operations checks receipt, questions duplicate orders
- Finance reconciles, catches invoice didn't match PO

**Authorization Limits**

Define spending authority:

| Amount | Approver | Process |
|--------|----------|---------|
| <£1K | Manager | Email approval |
| £1-10K | CFO | Form + approval |
| £10-50K | CEO | Form + CFO recommend |
| >£50K | Board | Board approval |

Example:
- Manager spends £500 on supplies (approves self)
- Manager wants to spend £5K on training (needs CFO approval)
- Manager wants to spend £50K on software (needs CEO approval)

System prevents:
- Excessive spending (one person can't approve large amounts)
- Fraud (someone else approves unusual purchases)

**Account Reconciliation**

Monthly reconciliation: Match records to external sources.

Bank reconciliation:
- Company books: £50K balance
- Bank statement: £48K balance
- Difference: £2K (investigate)
- Reason: Checks in transit (company has recorded, bank hasn't cleared)
- Result: Books correct, bank statement will catch up

AR aging:
- Customer owes £10K (per contract)
- But has only paid £8K (per cash record)
- Investigation: Customer dispute or slow payer?
- Action: Follow up on collection

AP aging:
- Owe vendor £5K per invoice
- But only recorded £3K per PO mismatch
- Investigation: Extra charges or invoice not received
- Action: Clarify with vendor

Missing: Red flag. Fraud indicator?
- Example: £10K invoice received, but can't find supporting PO
- Investigation: Rogue purchase? Fraudulent invoice?
- Action: Confirm with vendor, department before paying

`
      },
      {
        heading: "Financial Close Process",
        body: `Closing the books accurately and on time.

**Monthly Close Timeline**

Day 1 (Month end):
- Record all transactions (last day of month)
- No journal entries after month-end (prevents gaming)

Day 2-3 (Month end + 1-2):
- Collect all invoices and receipts
- Record accruals (expenses incurred, not yet billed)
- Record revenue (all earned revenue recorded)

Day 3-4:
- Perform reconciliations
  - Bank rec
  - AR aging
  - AP aging
  - Fixed assets
  - Payroll
- Resolve differences

Day 4-5:
- Prepare financial statements (P&L, Balance Sheet, Cash Flow)
- Review for accuracy (look for unusual items)
- Prepare notes (explain changes)

Day 5:
- Management review (CFO, CEO review statements)
- Identify questions/clarifications needed

Target: Close by 5th of following month (allows timely reporting).

**Accrual Accounting Example**

June purchase:
- Order from vendor (June 15)
- Vendor invoices (June 20)
- Deliver in June
- You pay in July
- Question: When record the expense?

Answer (accrual): June (when incurred)
- June 30: Record accrual (debit expense, credit liability)
- July: Record payment (debit liability, credit cash)

Result:
- June books: Expense recorded (accurate P&L)
- July books: No expense (already recorded)
- Cash flow: Payment in July (separate, correct)

vs Cash accounting:
- June books: No expense (hasn't been paid)
- July books: Record expense (when paid)
- Problem: June profitability overstated

GAAP requires accrual (correct).

**Documentation**

Every transaction needs support:
- Expense: Receipt, business purpose, approval
- Revenue: Customer contract, invoice, delivery proof
- Fixed asset: Purchase order, receipt, depreciation schedule
- Bank transaction: Bank statement, reconciliation

Auditors check:
- Sample 50-100 transactions
- Verify support exists
- Verify amounts correct
- Verify approval obtained

Missing documentation = audit issue.

`
      },
      {
        heading: "Preparing for Audit",
        body: `Getting ready for external audit.

**Audit Process**

Step 1: Planning (2 weeks before)
- Auditor reviews prior year
- Identifies risk areas (cash, revenue, large transactions)
- Develops audit plan

Step 2: Interim (4 weeks before year-end)
- Auditor tests controls
- Samples transactions
- Identifies control issues

Step 3: Final (2 weeks after year-end)
- Auditor performs final tests
- Tests all major transactions
- Tests period-end accruals
- Reviews subsequent events

Step 4: Reporting (4 weeks after year-end)
- Auditor drafts report
- Discusses findings with management
- Issues audit opinion

**Audit Opinion Types**

Unqualified (clean):
- "In our opinion, financial statements fairly represent financial position"
- Means: No issues found
- Used for: Raising capital, M&A, public company

Qualified:
- "In our opinion, except for [X], financial statements fairly represent..."
- Means: Minor issue, doesn't affect overall validity
- Example: Inventory not fully counted (minor, immaterial)

Adverse:
- "In our opinion, financial statements do NOT fairly represent..."
- Means: Major issue, misstates financial position
- Rare, serious problem

Disclaimer:
- "We cannot express an opinion..."
- Means: Too many issues, couldn't complete audit
- Rare, very serious

Most companies: Unqualified opinion (clean).

**Common Audit Issues**

1. Revenue recognition
   - Issue: Revenue recorded before earned (aggressive)
   - Fix: Clear policy, documented
   - Prevention: Revenue recognition checklist

2. Expense accruals
   - Issue: Missing accruals (understated expenses)
   - Fix: Accrual analysis, month-end checklist
   - Prevention: Documented procedures

3. Customer concentration
   - Issue: Too much revenue from one customer
   - Note: Not a problem, but auditor notes
   - Prevention: Disclose in notes

4. Subsequent events
   - Issue: Major event after year-end affects valuation
   - Example: Customer bankruptcy, lawsuit
   - Prevention: Disclose in notes

`
      },
      {
        heading: "Building Audit Readiness",
        body: `Preparing documentation year-round.

**Documentation to Prepare**

Before audit (1 month prior):
- Prior year audit findings and follow-up
- New accounting policies (documented)
- Significant transactions (>£50K, documented)
- Accrual analysis (employee bonuses, contingent items)
- Revenue contracts (top 10 customers)
- Fixed assets (additions, disposals)
- Debt agreements (compliance with covenants)
- Related party transactions
- Litigation (pending lawsuits, exposure)
- Subsequent events (post year-end events)

During audit (provide to auditors):
- General ledger (all transactions)
- Customer/vendor listings
- Bank statements and reconciliations
- AR aging, allowance analysis
- Inventory listings (if applicable)
- Fixed assets schedule, depreciation
- Payroll summary, employee roster
- Board minutes (decisions, approvals)
- Loan agreements, terms

Post-audit (items to address):
- Management letter comments (recommendations)
- Findings (control issues or accounting problems)
- Follow-up plan (how will you fix issues)
- Timeline (when will you implement)

**Getting to Unqualified Opinion**

Requirements:
1. Clean accounting (no errors, all GAAP compliant)
2. Good controls (segregation of duties, reconciliations)
3. Documentation (support for all transactions)
4. Transparency (disclose issues in notes)
5. Management representation (CFO confirms accuracy)

Example journey:

Year 1: Qualified opinion (missing revenue documentation)
- Action: Implement contract review process
- Result: Year 2 unqualified opinion

Year 2: Unqualified opinion
- Maintain controls
- Continue good documentation
- Annual cleanups

Year 3+: Consistent unqualified opinions
- Build confidence with investors/acquirers
- Easier to raise capital or sell

`
      }
    ],
    relatedSlugs: [
      "board-reports-and-financial-statements",
      "p-l-statement-architecture-profitability",
      "exit-planning-and-m-and-a-preparation",
      "burn-rate-and-cash-runway-analysis",
      "quarterly-business-reviews-and-planning"
    ],
    faq: [
      {
        q: "What are the core financial controls?",
        a: "Segregation of duties (no one person does entire transaction), authorization limits (CFO approves £1-10K, CEO >£10K), monthly reconciliations (bank rec, AR aging, AP aging), documented procedures. Example: Purchase order → approval → receipt inspection → invoice matching → payment. No single person does all steps (prevents fraud and catches errors)."
      },
      {
        q: "How quickly should I close my books?",
        a: "Target: 5th of following month for monthly close. Indicates: Good controls and discipline. Fast close (3-4 days) = strong processes. Slow close (10+ days) = weak controls, investigate. For raising capital or M&A, investors expect timely closes."
      },
      {
        q: "What do auditors look for?",
        a: "Controls: Segregation of duties, approvals, reconciliations. Documentation: Support for transactions (receipts, invoices, approvals). Accuracy: No errors or significant misstatements. GAAP compliance: Revenue recognition, accruals, depreciation. They sample 50-100 transactions, verify support exists, verify amounts correct."
      },
      {
        q: "How do I prepare for an audit?",
        a: "1 month before: Gather documentation (contracts, board minutes, litigation summary). During: Provide ledger, contracts, bank statements, reconciliations. After: Address auditor recommendations. Get clean opinion by: Accurate accounting, good controls, complete documentation, transparency (disclose issues in notes)."
      }
    ],
    videoUrl: ""
  }
];

export default batch173Articles;
