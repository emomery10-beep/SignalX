import { AcademyArticle } from "@/types/academy";

export const batch110Articles: AcademyArticle[] = [
  {
    slug: "financial-controls-audit-readiness",
    title: "Financial Controls and Audit Readiness: Building Trust and Compliance",
    description: "Master financial controls and audit preparation. Build systems for accuracy, detect fraud, and prepare for investor/bank audits.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "financial controls",
      "internal controls",
      "audit readiness",
      "SOC 2",
      "fraud detection",
      "financial reporting",
      "compliance",
      "segregation of duties",
      "expense reconciliation",
      "audit trail"
    ],
    keyTakeaways: [
      "Core financial controls: (1) Segregation of duties (don't let one person approve + execute + reconcile expense), (2) Approval workflows (all expenses >£1K require approval), (3) Monthly reconciliation (bank statements, AR aging, accruals), (4) Document retention (keep all receipts, contracts, invoices for 7 years), (5) Audit trail (system logs who changed what, when). Good controls = fewer errors, faster audits, more investor confidence",
      "Audit preparation: Build documentation (P&L reconciled to GL, AR aged and collected, accruals documented), implement review cycle (monthly close checklist, CFO review, sign-off), maintain audit-ready files (organized by GL account, backup files, change logs). Cost to build: £20-50K one-time, saves £200K+ in audit costs (faster audit = lower fees, fewer rework cycles)",
      "Red flags auditors look for: Missing documentation (can't prove transaction), round numbers (£100K exactly suggests estimate not actual), transactions without approval, personal expenses mixed with company, revenue recognized before delivery, related-party transactions at unfair terms. If controls weak, auditors will require more testing (costs money, takes time). Strong controls = faster, cheaper audit"
    ],
    content: [
      {
        heading: "Understanding Financial Controls",
        body: `Financial controls are systems designed to ensure accuracy, prevent fraud, and ensure compliance.

**Why Controls Matter**

Example: SaaS company without controls

Scenario:
- Finance manager has access to: bank account, invoice creation, approval authority
- Finance manager processes own expense reimbursement (£50K for "consulting")
- No one questions it
- At audit, auditors discover unexplained £50K expense
- Investigation reveals fraud (wasn't legitimate)
- Company reputation damaged, finance manager fired, possible legal action

Cost of no controls: Fraud + audit rework + reputation damage = £500K+

With controls:
- Finance manager can't approve own expenses (segregation of duties)
- Expense >£5K requires CFO approval
- CFO would question £50K consulting expense
- Expense denied or reduced
- No fraud

Cost of controls: System implementation £5K, training £2K
Benefit: Prevented £50K fraud

This is why controls matter. They prevent expensive problems.

**Core Financial Controls**

Control 1: Segregation of Duties (SOD)

Definition: No single person should have end-to-end control of transaction.

Principle: Separate authorization → execution → reconciliation

Example transaction (payment approval):
- Authorization: Manager approves invoice (£5K)
- Execution: Finance team processes payment from bank
- Reconciliation: Accounting reviews bank statement to verify

Bad setup (no segregation):
- Finance manager: Approves invoice → processes payment → reconciles

Problem: Manager could approve fake invoice, process payment to personal account, hide in reconciliation.

Good setup (with segregation):
- Department head: Approves invoice
- Finance team: Processes payment (can't approve)
- Accounting: Reconciles bank statement (separate from execution)

Result: Three people needed to commit fraud. Unlikely.

Apply to all major transaction types:
- Revenue recognition (sales creates deal → accounting recognizes revenue → finance verifies)
- Expense approval (department approves → finance executes → accounting reconciles)
- Payroll (HR approves → payroll processes → accounting verifies)

Control 2: Approval Workflows

Definition: Expenses above certain threshold require supervisory approval.

Example policy:
- < £1K: Finance team approves (low risk)
- £1K-£5K: Director approves (medium risk)
- > £5K: CFO approves (high risk)
- > £25K: CFO + board approval (very high risk)

Implementation:
- Use expense management software (Concur, Expensify, Brex)
- Configure approval rules by amount and category
- Automate notifications to approvers

Benefit:
- Catches unusual expenses before processing
- Creates audit trail (who approved, when, why)
- Prevents rogue spending

Control 3: Monthly Close Process

Definition: Standardized process for closing books each month.

Steps:
1. Revenue reconciliation
   - Invoice list vs. GL revenue entry
   - Verify all invoices recorded
   - Check for duplicates

2. AR aging review
   - Invoice aging (which invoices not yet paid)
   - Follow up on overdue invoices
   - Calculate allowance for doubtful accounts

3. COGS reconciliation
   - Invoice list vs. GL COGS entry
   - Verify all infrastructure costs recorded
   - Check for double-payments

4. Expense review
   - Expense report review (all approved?)
   - Category verification (coded correctly?)
   - Scan for unusual expenses

5. Accrual entries
   - Accrue for services received but not invoiced
   - Accrue for payroll not yet paid
   - Accrue for taxes owed

6. Bank reconciliation
   - Bank statement vs. GL bank account
   - Identify outstanding deposits/checks
   - Investigate discrepancies

7. CFO review and sign-off
   - CFO reviews all entries
   - CFO signs reconciliation (takes ownership)
   - Issues to accounting team for corrections

Timeline: 2-3 days after month-end

Control 4: Documentation and Records

Definition: Keep all records to prove transactions.

What to keep:
- Invoices (from suppliers)
- Receipts (expenses, supplier payments)
- Contracts (customer agreements, vendor terms)
- Correspondence (emails approving expenses, confirming delivery)
- Timesheets (for payroll verification)
- Bank statements (reconciliation evidence)
- Invoices to customers (revenue proof)
- Signed documents (contracts, LOIs, agreements)

How long:
- UK: Minimum 7 years
- Audit requirement: 6 years minimum
- Best practice: 7 years after tax closure

Organization:
- By GL account (revenue, COGS, R&D, S&M, G&A)
- By transaction type (invoices to vendors, invoices from customers)
- By date (month/year)
- Digital or physical (doesn't matter, both must be kept)

Cost of keeping:
- Storage (cloud storage £100/month for all digital)
- Organization (2 hours/month to organize)
- Total: £1,500/year

Cost of not keeping (audit issue):
- Auditor can't verify transaction (assume worst-case)
- May reject expense or revenue (reduce financials)
- Costs time in audit (£500/hour × 10+ hours = £5K+)

Control 5: Audit Trail

Definition: System records who did what, when, and why.

Requirement:
- System logs should show:
  - Who created transaction
  - Who approved transaction
  - Who modified transaction
  - Timestamp of each action
  - What was the transaction

Example (accounting system):
- Jan 5, 10:00 - Jane (finance) created invoice #2001 for £50K
- Jan 5, 14:00 - John (director) approved invoice #2001
- Jan 6, 09:00 - Jane (finance) processed payment for invoice #2001

Benefit:
- Can trace any transaction back to person responsible
- Can prove approval chain
- Can identify unusual patterns

Implementation:
- Use modern accounting software (QuickBooks, Xero, NetSuite)
- All have audit trail feature
- Enable and review quarterly

**Audit-Ready Checklist**

Before audit (1 month prior):

Documentation:
- [ ] P&L reconciled to GL
- [ ] AR aging list prepared
- [ ] Accruals documented and justified
- [ ] COGS recalculated and verified
- [ ] Intercompany transactions documented
- [ ] Related-party transactions listed and justified
- [ ] Revenue contracts reviewed for compliance
- [ ] Expense categories verified

Reconciliations:
- [ ] Bank reconciliation (all discrepancies resolved)
- [ ] AP aging (outstanding invoices documented)
- [ ] Deferred revenue (billings vs. revenue recognized)
- [ ] Inventory (if applicable, count and value)

Policies and Procedures:
- [ ] Revenue recognition policy documented
- [ ] Expense policy documented
- [ ] Related-party policy documented
- [ ] Capitalization policy documented

Management Discussion:
- [ ] Significant transactions explained
- [ ] Changes in accounting policy documented
- [ ] Estimates and judgments justified
- [ ] Unusual items explained

Systems:
- [ ] Audit trail enabled in all systems
- [ ] User access restricted (principle of least privilege)
- [ ] Backups verified
- [ ] Change log available

Week Before Audit:
- [ ] Organize all documents by GL account
- [ ] Create index of where documents are
- [ ] Identify audit contact (who they'll call with questions)
- [ ] Prepare conference room with space for auditors

**Common Audit Issues**

Issue 1: Missing documentation
- Problem: Auditor asks for invoice supporting £50K expense, can't find it
- Impact: Auditor disallows expense (reduces profit), or requires significant testing

Issue 2: Revenue recognition errors
- Problem: Recognize revenue before delivery, or for cancelled orders
- Impact: Auditor requires adjustment (reduces revenue), audit costs increase

Issue 3: Accrual mistakes
- Problem: Forget to accrue for benefits payable, or accrue twice
- Impact: Costs overstate (if don't accrue) or P&L distorted (if double-accrue)

Issue 4: Segregation of duties failures
- Problem: One person approves, processes, and reconciles
- Impact: Auditor flags control weakness, requires additional testing (costs time/money)

Issue 5: Related-party transactions at unfair terms
- Problem: Pay friend's company £100K for work worth £20K
- Impact: Auditor disputes transaction, may disallow or require adjustment

Issue 6: Unusual or round numbers
- Problem: Accrue £100,000 (exact round number, seems estimated not actual)
- Impact: Auditor questions estimate, requires documentation

Issue 7: Missing approval signatures
- Problem: Expense >£5K approved but no signature/email proof
- Impact: Auditor can't verify approval, may disallow expense

**Audit Cost Reduction**

Good controls = lower audit cost

Example:

Company A (weak controls):
- Missing documentation for 20% of expenses
- No monthly close process
- Segregation of duties issues
- Audit time required: 200 hours
- Audit cost: £40K (200 hours × £200/hour)
- Audit findings: 10 items requiring adjustment

Company B (strong controls):
- All documentation complete
- Monthly close process, audit-ready
- Strong segregation of duties
- Audit time required: 80 hours
- Audit cost: £16K (80 hours × £200/hour)
- Audit findings: 2 items (minor)

Difference: £24K audit cost savings

Cost to build Company B's controls: £20K
Payback: <1 year

This is why investors want to see strong controls. They reduce audit costs and financial risk.

**SOC 2 Compliance (for SaaS)**

Definition: SOC 2 is security and compliance standard for SaaS companies.

What it covers:
- Security (data encrypted, access controlled)
- Availability (uptime SLA met)
- Processing integrity (transactions accurate)
- Confidentiality (customer data private)
- Privacy (data used per privacy policy)

Why it matters:
- Enterprise customers often require SOC 2 compliance
- Shows you have serious security and controls
- Credibility with investors and partners

Cost:
- Audit cost: £10-30K (annual)
- Implementation: £20-50K (one-time)
- Staff time: 1-2 hours/month ongoing

Is it worth it?
- If targeting enterprise: Yes (required for deals)
- If targeting SMB: No (not required)

**Building a Controls Culture**

Best practice:
1. Document policies (in writing, clear, distributed)
2. Train team (everyone knows the policy)
3. Monitor compliance (check policy followed)
4. Review regularly (quarterly assessment of controls)
5. Improve (fix gaps, improve processes)

Benefits:
- Fewer errors
- Faster audits
- Better investor confidence
- Easier integrations/partnerships

This is table stakes for growing SaaS companies.
`
      }
    ],
    relatedSlugs: [
      "board-reporting-investor-communications",
      "p-l-statement-architecture-profitability",
      "tax-planning-saas-companies",
      "financial-forecasting-modeling",
      "funding-and-investment-strategy"
    ],
    faq: [
      {
        q: "What's the most important financial control?",
        a: "Segregation of duties: no single person should approve, execute, and reconcile transactions. Prevents fraud and catches errors."
      },
      {
        q: "How long do I need to keep financial records?",
        a: "UK requires 7 years. Auditors typically need 6 years. Keep digitally for cost efficiency (cloud storage £100/month)."
      },
      {
        q: "What can I do to reduce audit costs?",
        a: "Strong controls, monthly close process, complete documentation, audit-ready files. Good controls save £20K+ in audit fees by reducing audit time."
      },
      {
        q: "Is SOC 2 compliance worth the cost?",
        a: "Yes if targeting enterprise customers (required for deals). No if targeting SMB (not required). Cost £10-30K annual audit + £20-50K implementation."
      }
    ],
    videoUrl: ""
  }
];

export default batch110Articles;
