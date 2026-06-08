import { AcademyArticle } from "@/types/academy";

export const batch330Articles: AcademyArticle[] = [
  {
    slug: "accounting-for-startups-and-small-businesses",
    title: "Accounting for Startups and Small Businesses: Financial Foundation",
    description: "Master startup accounting. Set up books, track transactions, prepare financials.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["startup accounting", "small business accounting", "bookkeeping", "chart of accounts", "financial records"],
    keyTakeaways: [
      "Accounting setup: (1) Choose accounting method (cash or accrual), (2) Set up chart of accounts (income, expenses, assets, liabilities, equity), (3) Select accounting software (QuickBooks, Xero, FreshBooks), (4) Monthly close process (reconcile accounts, review P&L). Cost: Accounting software £30-300/month, accountant/bookkeeper £2-5K/month. Benefit: Know finances, tax-ready, audit trail.",
      "Chart of accounts: Framework for categorizing transactions. Revenue: Product revenue, service revenue, other. Expenses: Payroll, marketing, tools, rent, etc. Assets: Cash, AR, equipment. Liabilities: AP, debt. Equity: Founder equity, retained earnings. Example: All invoices go to Product Revenue account, all salaries to Payroll account. Purpose: Aggregate similar transactions, prepare financial statements.",
      "Monthly close process: (1) Record all transactions (invoices, bills, payments), (2) Reconcile accounts (cash matches bank, AR matches invoices), (3) Accrue expenses (bills received but not paid), (4) Adjust entries (depreciation, amortization), (5) Generate P&L (review, analyze), (6) Approval (CEO/board reviews). Timeline: 3-5 days monthly. Benefit: Current financials (know real position), audit-ready (all documented)."
    ],
    content: [
      {
        heading: "Setting Up and Managing Startup Accounting",
        body: `Building financial foundation and managing daily accounting.

**Accounting fundamentals for startups**

Accounting methods:

Cash basis:
- Record transactions when cash moves (received or paid)
- Simple, easy to understand
- Problem: Revenue overstated (billed but not paid), expenses understated
- Use: Very early stage (bootstrap, simple business)
- Not recommended for investors (they want accrual)

Accrual basis:
- Record transactions when earned (revenue) or incurred (expense)
- Example: Invoice sent month 1 (record revenue), payment received month 2 (no additional revenue)
- Accurate: Reflects real economic activity
- Required: For any investor-backed company, most lenders
- Recommended: Use accrual from day one

Decision: Start with accrual (better, investors expect it)

**Chart of accounts structure**

Definition:
- Framework for categorizing all financial transactions
- Foundation for P&L, balance sheet, tax reporting

Account structure:

1xxx series: Assets (what you own)
- 1010: Cash/checking account
- 1020: Savings account
- 1030: Accounts receivable (customers owe you)
- 1040: Prepaid expenses (paid in advance)
- 1100: Equipment
- 1110: Accumulated depreciation

2xxx series: Liabilities (what you owe)
- 2010: Accounts payable (vendors you owe)
- 2020: Credit card payable
- 2030: Payroll payable (wages owed not yet paid)
- 2100: Deferred revenue (customer prepaid, you owe service)
- 2200: Loan payable

3xxx series: Equity (ownership)
- 3010: Founder equity (initial investment)
- 3020: Retained earnings (profit reinvested)

4xxx series: Revenue (income)
- 4010: Product revenue (SaaS subscription, licenses)
- 4020: Service revenue (consulting, implementation)
- 4030: Other revenue

5xxx series: Cost of goods sold (direct costs)
- 5010: Cloud hosting costs
- 5020: Payment processing fees
- 5030: Customer support costs
- 5040: Cost of goods (if product-based)

6xxx series: Operating expenses (indirect costs)

- 6100: Payroll (salaries, wages)
- 6110: Payroll taxes (employer taxes)
- 6120: Employee benefits (health insurance, retirement)
- 6200: Rent/facilities
- 6300: Marketing and advertising
- 6310: Sales commissions
- 6400: Software tools and subscriptions
- 6500: Professional services (legal, accounting)
- 6600: Travel
- 6700: Office supplies
- 6800: Other operating expenses

Example transaction posting:

Event: Pay £5K for AWS hosting (credit card)
- Debit (increase): 5010 Cloud hosting costs £5K
- Credit (increase): 2020 Credit card payable £5K
- Journal entry: Dr. 5010 £5K, Cr. 2020 £5K

Event: Receive payment from customer for £10K invoice
- Debit (increase): 1010 Cash £10K
- Credit (decrease): 1030 Accounts receivable £10K
- Journal entry: Dr. 1010 £10K, Cr. 1030 £10K

**Accounting software selection**

QuickBooks Online:

Features:
- Invoice generation (send to customers)
- Bill payment (track what you owe)
- Bank reconciliation (auto-connect to bank)
- Reports (P&L, balance sheet, tax)
- Integration (with Stripe, Salesforce, payroll)

Cost: £20-100/month depending on plan
Best for: Growing companies (more features needed)
Learning curve: Moderate (full-featured, some complexity)

Xero:

Features:
- Similar to QuickBooks (invoicing, bills, reports)
- Slightly simpler UI (easier to use)
- Integration (bank feeds, payroll)
- Mobile app (approve invoices on phone)

Cost: £20-40/month
Best for: Small to mid-size businesses (international)
Learning curve: Lower (simpler than QB)

FreshBooks:

Features:
- Invoicing and time tracking
- Client portal (customers pay directly)
- Expense tracking (capture receipts)
- Reports (simpler than QB)

Cost: £15-40/month
Best for: Service businesses, freelancers
Learning curve: Very low (focused on invoicing)

Spreadsheet (Google Sheets/Excel):

Features:
- Manual entry (no automation)
- Custom (build exactly what you want)
- Free (no software cost)

Cost: Free
Best for: Pre-revenue, very simple business
Downsides: Error-prone, hard to scale, not audit-ready
Recommended: Only for bootstrap, switch to software by £50K ARR

Recommendation: Start with Xero (simple, affordable) → Upgrade to QuickBooks (more features) as grow

**Monthly accounting close process**

Timeline: 1st-5th of following month (complete prior month's accounting)

Day 1: Record transactions

Tasks:
- Invoice customers (all work completed)
- Record income (from invoices sent, from received cash)
- Record expenses (bills received)
- Record payroll (salaries, taxes, benefits)
- Record other (interest income, one-time items)

Checklist:
- All sales recorded (check: invoices sent = revenue recognized)
- All expenses recorded (check: bills received + credit card charges)
- Payroll processed (check: payroll run completed, taxes recorded)

Day 2: Bank reconciliation

Process:
1. Export bank statement from bank
2. Import into accounting software
3. Match transactions (software matches automatically)
4. Flag differences (transaction in bank, not in software, or vice versa)
5. Investigate (outstanding checks? Uncleared deposits?)
6. Record missing items (bank charges, interest)
7. Approve reconciliation (mark as complete)

Example:
- Bank statement: £50,000
- Outstanding checks: -£5,000
- Uncleared deposits: +£3,000
- Software books should show: £48,000 (match bank)

Accounts to reconcile:
- Checking account (daily)
- Savings account (daily)
- Credit cards (weekly)
- Accounts receivable (monthly, confirm customers paying)

Day 3: AR and AP review

Accounts receivable (AR):
- List all unpaid invoices
- Age by days outstanding (30, 60, 90+ days)
- Follow up on old invoices (should be paid)
- Write off uncollectible (bad debt)

Example AR:
- Customer A: £2K (30 days old) - Follow up
- Customer B: £1K (60 days old) - Call directly
- Customer C: £500 (90+ days old) - Consider bad debt write-off

Accounts payable (AP):
- List all bills received
- Pay by due date (avoid penalties)
- Take early payment discounts (if 2/10 net 30, pay day 10)
- Communicate delays (if can't pay on time, contact vendor)

Example AP:
- Vendor A: £5K (due day 10, pay early for 2% discount)
- Vendor B: £3K (due day 30, pay by day 25)
- Vendor C: £2K (due day 60, negotiate extended terms)

Day 4: Accrual adjustments

Expenses incurred but not paid:
- Payroll: Salaries accrued (even if pay on different day)
- Vacation accrual: Employees earn PTO, need to accrue liability
- Bonus accrual: Accrued when earned (not when paid)
- Utilities: Use estimate if bill not received yet

Example:
- Payroll: Employees worked March 1-31, paid April 5
  - March: Dr. Payroll expense £50K, Cr. Payroll payable £50K
  - April 5: Dr. Payroll payable £50K, Cr. Cash £50K

Benefits:
- Accurate profit (expense in right month)
- Audit trail (accrual documented)

Day 5: Generate and review reports

P&L statement (profit and loss):

| Category | Amount |
|---|---|
| Revenue | £100K |
| Cost of goods sold | (£10K) |
| Gross profit | £90K |
| Operating expenses: | |
| - Payroll | (£60K) |
| - Marketing | (£10K) |
| - Tools | (£5K) |
| - Other | (£10K) |
| Total opex | (£85K) |
| Operating profit | £5K |
| Other income/expenses | (£2K) |
| Net profit | £3K |

Analysis:
- Revenue: On track vs. plan?
- Gross margin: 90% (healthy for SaaS)
- Opex: 85% of revenue (target <80%)
- Net profit: 3% (becoming profitable!)

Balance sheet (snapshot of assets, liabilities, equity):

| Item | Amount |
|---|---|
| Assets: | |
| - Cash | £200K |
| - AR | £30K |
| - Equipment | £50K |
| Total assets | £280K |
| Liabilities: | |
| - AP | £20K |
| - Debt | £100K |
| Total liabilities | £120K |
| Equity: | |
| - Founder equity | £100K |
| - Retained earnings | £60K |
| Total equity | £160K |
| Total liabilities + equity | £280K |

Check: Assets = Liabilities + Equity (£280K = £120K + £160K) ✓

Cash flow statement:

| Category | Amount |
|---|---|
| Operating activities | £50K |
| Investing activities | (£10K) |
| Financing activities | £0 |
| Net change in cash | £40K |

Key insight: Profitable (£3K) but cash flow positive (£50K) - great!

Review checklist:
- P&L matches budget (within 5-10%)
- Balance sheet balanced
- Cash flow positive
- AR aging not too old (collect outstanding)
- AP managed (no late payments)

**Tax and compliance**

Monthly tasks:
- Sales tax: Track if collecting (depends on state/country)
- Payroll tax: Withheld from employees, paid to government
- Quarterly estimated taxes: Pay estimated income tax (if profitable)

Annual tasks:
- Tax return preparation (with accountant, file by deadline)
- W-2 preparation (employee wages, withholding)
- 1099 preparation (contractor payments)
- Depreciation schedule (equipment, tax deduction)
- Audit prep (if raising capital)

Cost: Accountant 50-100 hours × £200/hour = £10-20K annually

**Common accounting mistakes**

Mistake 1: Mixing personal and business accounts
- Problem: Can't separate business from personal (tax nightmare)
- Fix: Separate bank account and credit card (business only)
- Impact: Clean accounting, easier taxes

Mistake 2: Not reconciling regularly
- Problem: Accounting software ≠ bank (surprises at year-end)
- Fix: Reconcile cash weekly, full close monthly
- Impact: Catch errors early, correct quickly

Mistake 3: No documented support for entries
- Problem: £50K payment, no invoice (auditor can't verify)
- Fix: Keep all receipts, invoices, contracts (paper or digital)
- Impact: Audit-ready, proof of all transactions

Mistake 4: Revenue recognition errors
- Problem: Invoice month 1, customer doesn't use until month 3 (wrong period)
- Fix: Accrual accounting (record when earned, not when paid)
- Impact: Accurate financials

`
      }
    ],
    relatedSlugs: ["revenue-recognition-and-accounting-standards", "financial-controls-and-audit-readiness", "financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking", "tax-planning-for-startups"],
    faq: [
      { q: "What accounting method should I use?", a: "Use accrual accounting (record when earned/incurred, not when cash moves). Better than cash basis (which overstates revenue, understates expenses). Investors require accrual. Required for businesses >£85K revenue. Setup: Chart of accounts (assets, liabilities, equity, revenue, expenses), accounting software (Xero, QuickBooks), monthly close process. Cost: Software £30-100/month, accountant support varies." },
      { q: "What is a chart of accounts?", a: "Framework for categorizing transactions: Assets (cash, AR, equipment), Liabilities (AP, debt), Equity (founder investment, retained earnings), Revenue (sales income), COGS (hosting, support), Expenses (payroll, marketing, tools). Purpose: Organize similar transactions, prepare P&L, balance sheet, tax filing. Example: All AWS charges go to Cloud Hosting account, all salaries to Payroll. Result: Aggregate by category, easy to analyze." },
      { q: "What's involved in monthly accounting close?", a: "5-day process: (1) Record transactions (invoices, bills, payroll), (2) Reconcile cash (bank matches software), (3) Review AR/AP (collect outstanding, pay on time), (4) Accrue expenses (wages accrued before payment), (5) Generate reports (P&L, balance sheet, analyze). Result: Current financial position, audit-ready records, identify trends. Key: Close by 5th of following month (timely reporting)." }
    ],
    videoUrl: ""
  }
];

export default batch330Articles;
