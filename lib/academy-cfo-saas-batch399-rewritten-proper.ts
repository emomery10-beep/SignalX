import { AcademyArticle } from "@/types/academy";

export const batch399Articles: AcademyArticle[] = [
  {
    slug: "saas-financial-controls-and-fraud-prevention",
    title: "Financial Controls and Fraud Prevention: Protecting SaaS Company Assets",
    description: "Master financial controls. Prevent fraud, implement segregation of duties, and build internal controls.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["financial controls", "fraud prevention", "internal controls", "segregation of duties", "audit"],
    keyTakeaways: [
      "Segregation of duties (SoD): No single person should control all aspects of a financial transaction. Key separations: (1) Person who approves purchase ≠ person who pays, (2) Person who records transactions ≠ person who reconciles bank, (3) Person who sets up vendors ≠ person who authorises payments. Example: Employee sets up fake vendor, approves invoice, and processes payment = £50K fraud over 6 months. With SoD: Three different people involved, fraud detected at approval stage.",
      "Essential financial controls for SaaS: (1) Bank reconciliation (monthly, by someone other than AP), (2) Expense approval (multi-level for >£1K), (3) Access controls (limit who can authorise payments), (4) Vendor verification (new vendor requires verification before payment), (5) Revenue reconciliation (billing system vs accounting system monthly), (6) Payroll review (manager verifies headcount and amounts). Cost of controls: 2-4 hours/week of finance team time. Cost of not having controls: Average fraud loss for SME is £100-250K.",
      "Control environment by stage: Pre-Series A: Basic controls (bank reconciliation, expense approval, dual signatory on bank). Series A: Add vendor management, revenue reconciliation, access controls. Series B: Full SoD, documented processes, quarterly internal review. Series C+: Internal audit function, SOX-lite controls, board audit committee. Scale controls with company size — too little is risky, too much is bureaucratic. Sweet spot: Controls that prevent >£5K fraud without slowing operations."
    ],
    content: [
      {
        heading: "Building Financial Controls for SaaS Companies",
        body: `Protecting company assets without creating bureaucratic overhead.

**Financial control framework**

Control categories:

Preventive controls (stop fraud/errors before they happen):
- Approval workflows
- Access restrictions
- Segregation of duties
- Vendor verification

Detective controls (find fraud/errors after they occur):
- Bank reconciliation
- Revenue reconciliation
- Expense audits
- Anomaly detection

Corrective controls (fix issues when found):
- Investigation procedures
- Adjustment processes
- Policy updates
- Training programmes

**Core controls by process**

Control 1: Cash and banking

| Control | Frequency | Owner | Details |
|---|---|---|---|
| Bank reconciliation | Monthly | Finance (not AP) | Match bank to books |
| Dual signatory | Per transaction >£5K | 2 authorised signers | Both must approve |
| Payment authorisation | Per payment | Budget holder + finance | Two-step approval |
| Bank access review | Quarterly | CFO | Review who has access |

Bank reconciliation process:
1. Download bank statement at month end
2. Match each transaction to accounting record
3. Investigate unmatched items
4. Document reconciliation
5. Second person reviews and signs off
6. Complete within 5 business days of month end

Red flags:
- Unmatched transactions (payments with no invoice)
- Round number payments (£5,000 exactly — may be fabricated)
- Payments to unknown parties
- Duplicate payments
- Unusual payment timing (weekends, holidays)

Control 2: Accounts payable

| Control | Frequency | Owner | Details |
|---|---|---|---|
| Invoice approval | Per invoice | Budget holder | Verify goods/services received |
| Three-way match | Per invoice >£1K | AP | PO + invoice + receipt match |
| Vendor verification | New vendors | Finance manager | Verify legitimacy before first payment |
| Payment batch review | Per payment run | CFO | Review before release |

Vendor setup process:
1. Request from department with business justification
2. Finance verifies vendor (company registration, VAT number)
3. Obtain bank details directly from vendor (not from email chain)
4. Set up in accounting system
5. CFO approves vendor setup

Fraud prevention:
- Never change vendor bank details based on email alone (phone call verification required)
- Match invoice amounts to PO/contract
- Review vendor addresses (PO Box or residential = investigate)
- Periodic vendor audit (are all vendors legitimate?)

CEO fraud (common SaaS scam):
- Scammer sends email appearing to be from CEO
- Requests urgent payment to new bank account
- "Need you to process this wire immediately, will explain later"
- Prevention: Verbal confirmation for any unusual payment request

Control 3: Revenue and billing

| Control | Frequency | Owner | Details |
|---|---|---|---|
| Billing reconciliation | Monthly | Finance | Stripe/billing system vs accounting |
| Contract review | Monthly | Finance + Sales | New contracts match system |
| Discount approval | Per deal | VP Sales or CFO | Discount >15% needs approval |
| Credit note review | Monthly | CFO | All credit notes reviewed |

Revenue reconciliation process:
1. Extract billing data (Stripe, Chargebee)
2. Extract accounting revenue (Xero, NetSuite)
3. Reconcile: Billing total = Accounting total ± timing differences
4. Investigate discrepancies
5. Document and sign off

Common discrepancies:
- Timing differences (payment received but not yet recognised)
- Failed payments (billed but not collected)
- Manual adjustments (credits, refunds)
- Currency differences

Control 4: Payroll

| Control | Frequency | Owner | Details |
|---|---|---|---|
| Payroll review | Monthly | Finance manager | Verify headcount and amounts |
| New hire verification | Per hire | HR + Finance | Match offer letter to payroll |
| Leaver processing | Per departure | HR + Finance | Remove from payroll promptly |
| Payroll reconciliation | Monthly | Finance | Payroll system vs bank vs accounting |

Ghost employee fraud:
- Fictitious employee added to payroll
- Salary paid to fraudster's account
- Prevention: Monthly headcount verification by department managers
- Each manager confirms their team list is correct

Control 5: Expenses

| Control | Frequency | Owner | Details |
|---|---|---|---|
| Expense approval | Per expense | Manager | Approve before reimbursement |
| Receipt requirement | Per expense >£25 | Employee | Attach receipt to claim |
| Policy compliance | Per expense | Finance | Check against expense policy |
| Expense audit | Quarterly | Finance | Sample check 10% of expenses |

Expense policy essentials:
- Spending limits by category (meals: £50pp, travel: economy class)
- Pre-approval for >£500 expenses
- No personal expenses on company card
- Alcohol limits (reasonable with meals)
- Same-day submission of receipts

**Access controls**

Financial system access matrix:

| System | Role | Access level |
|---|---|---|
| Banking (Barclays) | CEO, CFO | Admin (payments) |
| Banking (Barclays) | Finance manager | View + prepare (no release) |
| Accounting (Xero) | CFO, Controller | Admin |
| Accounting (Xero) | Finance team | Standard (no delete) |
| Billing (Stripe) | CFO, Head of Sales | Admin |
| Billing (Stripe) | Sales reps | View only |
| Payroll (PayFit) | HR manager, CFO | Admin |
| Payroll (PayFit) | Managers | View own team only |

Access review:
- Quarterly: Review who has access to each system
- On departure: Immediately revoke all financial system access
- On role change: Adjust access to match new role

**Control environment by company stage**

Stage 1: Pre-Series A (5-15 people)

Minimum controls:
- Dual signatory on bank account (2 founders)
- Monthly bank reconciliation
- Expense approval by founder
- Separate personal and company finances

Time investment: 2 hours/month
Cost: £0 (founder time)

Stage 2: Series A (15-50 people)

Add:
- Formal expense policy
- Vendor verification process
- Revenue reconciliation (billing vs accounting)
- Segregation of duties (where possible)
- Quarterly access review

Time investment: 4-8 hours/month
Cost: Finance manager handles (part of role)

Stage 3: Series B (50-150 people)

Add:
- Full segregation of duties
- Documented control procedures
- Internal control testing (quarterly)
- Board audit committee (or finance subcommittee)
- External audit preparation

Time investment: 15-20 hours/month
Cost: Controller/compliance role (part of team)

Stage 4: Series C+ (150+ people)

Add:
- Internal audit function (or outsourced)
- SOX-lite control framework
- Continuous monitoring and automation
- Whistleblower hotline
- Regular fraud risk assessment

Time investment: Full-time role
Cost: Internal auditor (£50-80K) or outsourced (£30-60K/year)

**Fraud risk assessment**

Common SaaS fraud risks:

| Risk | Likelihood | Impact | Control |
|---|---|---|---|
| Expense fraud | Medium | Low | Approval + audit |
| Vendor fraud | Medium | Medium | Verification + SoD |
| Payroll fraud | Low | Medium | Manager verification |
| Revenue manipulation | Low | High | Revenue reconciliation |
| CEO email fraud | High | High | Verbal confirmation |
| Card misuse | Medium | Low | Spending limits + review |

Annual fraud risk review:
- Identify top 10 fraud risks
- Assess likelihood and impact
- Review controls in place
- Identify gaps
- Implement improvements
- Report to board

Cost-benefit of controls:

Investment in controls: £30-60K/year (team time + tools)
Average prevented loss: £100-250K/year (based on SME fraud statistics)
ROI: 3-8x (controls pay for themselves)

Additional benefits:
- Audit readiness (cleaner financials)
- Investor confidence (governance)
- Insurance benefit (lower premiums with good controls)
- Operational efficiency (less fixing errors)

`
      }
    ],
    relatedSlugs: ["saas-compliance-and-regulatory-finance", "saas-financial-reporting-and-investor-updates", "risk-management-and-contingency-planning", "saas-founder-cfo-relationship-and-finance-function", "operating-expense-management-and-control"],
    faq: [
      { q: "What financial controls does a SaaS startup need?", a: "Minimum: Dual bank signatory, monthly bank reconciliation, expense approval. Series A add: Vendor verification, revenue reconciliation, access controls, expense policy. Series B add: Full segregation of duties, documented procedures, quarterly control testing. Time investment: 2 hours/month (pre-Series A) to 15-20 hours/month (Series B). Cost of controls: £30-60K/year. Cost of not having: Average SME fraud loss £100-250K." },
      { q: "What is segregation of duties and why does it matter?", a: "SoD means no single person controls all aspects of a financial transaction. Key separations: Approver ≠ payer, recorder ≠ reconciler, vendor setup ≠ payment authoriser. Example without SoD: Employee creates fake vendor, approves invoice, processes payment = £50K fraud. With SoD: Three different people involved, fraud caught at approval. Challenge for small teams: Can't fully segregate with 2-3 finance people. Compensating control: CFO reviews all payments." },
      { q: "How do I prevent CEO email fraud?", a: "CEO email fraud (BEC): Scammer impersonates CEO, requests urgent wire transfer. Prevention: (1) Verbal confirmation for any unusual payment request (phone call, not email), (2) Never change vendor bank details based on email alone, (3) Train all finance staff on common scam patterns, (4) Implement email authentication (DMARC, SPF), (5) Two-person approval for payments >£5K. This is the #1 cyber fraud affecting SMEs — average loss £50-100K per incident." }
    ],
    videoUrl: ""
  }
];

export default batch399Articles;
