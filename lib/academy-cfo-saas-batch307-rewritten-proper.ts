import { AcademyArticle } from "@/types/academy";

export const batch307Articles: AcademyArticle[] = [
  {
    slug: "tax-planning-for-startups",
    title: "Tax Planning for Startups: Optimizing Tax Strategy and Compliance",
    description: "Master startup tax. Plan strategy, optimize deductions, ensure compliance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["startup tax", "tax planning", "tax deductions", "corporate tax", "tax compliance"],
    keyTakeaways: [
      "Tax fundamentals: Companies pay corporate tax on profit (19% UK example). Early startups: Often loss-making (expenses > revenue), so no tax owed initially. Strategy: Use losses (carry-forward to future years when profitable, offset against future profits). Cost: Accountant (£1-3K/year setup, £2-5K annually). Benefit: Pay less tax long-term (through planning), avoid penalties (through compliance). Example: £1M annual revenue, £1.2M expenses (£200K loss), £0 tax owed (loss carried forward).",
      "Tax planning tactics: (1) R&D tax credit (recover 20% of qualifying R&D spend), (2) Expense timing (accelerate expenses before profitable year), (3) Salary vs dividends (tax-efficient mix), (4) Pension contributions (pre-tax, tax-free growth), (5) Equipment write-off (capitalexpense deductions). Cost: Varies (some require no cost, some need accountant). Benefit: Reduce effective tax rate 5-15% through optimization.",
      "Compliance requirements: File tax return by deadline (usually March 15 for prior year). Maintain records (7 years minimum). Pay quarterly estimates (if needed). Handle payroll tax (employee withholding). Cost: Penalties if non-compliant (5-10% of unpaid tax). Tool: Accountant (£2-5K annually), accounting software (£500-2K/year). Benefit: Peace of mind, avoid penalties."
    ],
    content: [
      {
        heading: "Strategic Tax Planning and Compliance for Startups",
        body: `Optimizing tax position while staying compliant.

**Tax landscape for startups**

Corporate tax rates (UK example):
- Profit up to £50K: 19% (small profit rate)
- Profit over £50K: 19% standard rate
- Special: Prior loss carry-forward (offset future profits)

Example progression:

Year 1:
- Revenue: £500K
- Expenses: £700K
- Profit/(Loss): (£200K)
- Tax: £0 (no profit, no tax owed)
- Loss carry-forward: £200K (use next year)

Year 2:
- Revenue: £1M
- Expenses: £800K
- Profit before offset: £200K
- Less: Prior loss carry-forward (£200K)
- Taxable income: £0
- Tax: £0 (loss offsets profit)

Year 3:
- Revenue: £2M
- Expenses: £1M
- Profit: £1M
- Taxable: £1M
- Tax: £190K (19% × £1M)

Impact: By using losses, avoided £38K tax in year 2 (£200K × 19%)

**Tax planning tactics**

Tactic 1: R&D tax credit
- Eligibility: Software development (most SaaS qualifies)
- Qualifying: Engineers' time on R&D (not operations)
- Claim: File claim with tax return, recover 20%+ of qualifying spend
- Example:
  - 2 engineers at £80K salary = £160K
  - 50% on R&D = £80K qualifying
  - Credit: £80K × 20% = £16K refund (or offset against taxes)
  - Can reduce effective tax rate significantly

Process:
- Track: Document engineers' time on R&D (time tracking)
- Organize: Keep records (designs, code reviews, tests)
- File: Include R&D claim with tax return
- Cost: Accountant help (£1-2K to prepare claim)
- Timeline: File by deadline, claim processed next quarter (or take credit)

Tactic 2: Equipment expense write-off
- Asset: Computer, server, office equipment
- Benefit: Depreciate over 3-7 years or expense immediately (section 179)
- Example:
  - Buy £50K server: Depreciate £50K / 5 years = £10K expense/year
  - OR immediately expense (section 179): £50K in year 1 expense
  - Impact: Reduce profit £10K (depreciate) vs £50K (immediate) = £7.6K tax savings (19% rate)

Strategy: Expense immediately when possible (larger tax deduction upfront)

Tactic 3: Salary vs dividend optimization
- Salary: Employee social security (8%), employer social security (15%) = 23% overhead
- Dividend: Dividend tax (7.5% over £1000), no social security
- Optimization: Take salary up to £12,570 (personal allowance, no tax), then dividends

Example (owner is employee):
- Profit to distribute: £50K
- Strategy A (all salary): Salary £50K = 23% overhead = £11.5K cost, net £38.5K (after 19% income tax on excess)
- Strategy B (salary + dividend): Salary £12.5K (no tax), dividend £37.5K = £2.8K dividend tax, net £47.2K
- Benefit: £8.7K more net (17% improvement) through optimization

Tactic 4: Pension contribution
- Contribution: Employer contributes to employee pension (tax-deductible)
- Benefit: Pension grows tax-free
- Example:
  - Contribution: £20K to employee pension
  - Tax savings: £20K × 19% = £3.8K
  - Net cost: £16.2K (not £20K)
  - Employee retirement benefit: Tax-free growth

Strategy: Max out pension as tax-efficient distribution

Tactic 5: Timing of expenses
- Strategy: Accelerate expenses before profitable year
- Example:
  - December: Know company will be profitable next year
  - Action: Buy equipment, prepay insurance, accrue bonuses (expense in current loss year)
  - Benefit: Deduct expenses against losses (use losses), keep profit lower next year

**Tax compliance essentials**

Filing deadline:
- UK: Usually March 15 (for prior year tax return)
- Penalty: 5% of unpaid tax if late (plus interest)
- Action: File early (December) to get refund sooner

Record keeping:
- Requirement: Keep for 7 years minimum
- What: Invoices (received and issued), bank statements, receipts, payroll records
- How: Digital (cloud backup recommended), organized by category
- Cost: Minimal (accounting software handles organization)

Quarterly estimates (if applicable):
- Rule: If expecting to owe >£1K in taxes, pay quarterly (Jan, Apr, Jul, Oct)
- Amount: Based on prior year tax, adjusted if expected to change
- Penalty: Underpay by >£1K = interest charged
- Action: Calculate estimate with accountant, set calendar reminders

Payroll tax:
- Withheld: Income tax from employees (employer collects, remits to HMRC)
- Social security: Employer contribution (15% over threshold)
- Filing: Monthly or quarterly (PAYE returns to HMRC)
- Failure: Penalties 5-10% of underpaid amount

Sales tax (VAT in UK, sales tax in US):
- Rule: Collect VAT on revenue (invoice customer + VAT)
- Rate: 20% UK (varies by country)
- File: Quarterly (VAT returns to HMRC)
- Complexity: Service-based often exempt, software varies

**Implementation roadmap**

Year 1 (Startup, pre-profit):
- Hire accountant (£1-2K initial setup)
- Set up bookkeeping (software like Xero, QuickBooks)
- Document business structure (LLC, S-corp, Ltd)
- Track expenses (receipts, invoices)
- Estimate tax (likely $0 if loss-making)
- Cost: £3-5K

Year 2 (Growth, toward profitability):
- R&D tax credit: Begin tracking engineer time
- Expense timing: Plan year-end expenses
- Quarterly estimates: Begin paying if approaching profit
- Equipment: Buy strategically (time for tax deduction)
- Cost: £5-8K (accountant + software)

Year 3+ (Profitable):
- R&D credit: Claim £20-50K typically
- Salary/dividend optimization: Plan distribution strategy
- Pension: Maximize contributions
- Loss carry-forward: Use any prior losses
- Likely tax owed: Calculate, plan payment
- Cost: £8-15K (more complex, accounting-intensive)

**Tax strategy checklist**

Annual:
- [ ] File tax return by deadline
- [ ] Pay any taxes owed
- [ ] File quarterly estimates (if needed)
- [ ] Claim R&D tax credit
- [ ] Review salary/dividend split
- [ ] Plan next year expenses
- [ ] Review insurance needs (coverage may be tax-deductible)
- [ ] Audit records (completeness, accuracy)

Quarterly:
- [ ] Review profit/loss (on track for tax?)
- [ ] Accrue taxes (reserve for taxes owed)
- [ ] Pay quarterly estimates (if applicable)
- [ ] Review deductions (capturing all expenses?)

Monthly:
- [ ] Reconcile accounts (bank to software)
- [ ] Process payroll (if employees)
- [ ] Track expenses (receipts filed)

**Red flags and risks**

Risk 1: Misclassification of contractors
- Problem: Pay contractor as employee (or vice versa)
- Penalty: Reclassification + back taxes + penalties (20-40% of amount)
- Prevention: Use clear contract, check employment status rules

Risk 2: Inadequate records
- Problem: Can't document deductions (lost receipts)
- Penalty: Disallow deduction, pay tax on disputed amount
- Prevention: Use accounting software, digital receipts

Risk 3: Late filing/payment
- Problem: Miss deadline
- Penalty: 5% of unpaid tax (first penalty), 5% more if 6 months late, 5% more if 12 months late = 15%
- Prevention: Calendar reminders, accountant coordination

Risk 4: Incorrect tax rate calculation
- Problem: Use wrong rate (confusion with VAT vs income tax)
- Penalty: Underpayment penalties, interest, potential audit
- Prevention: Use accountant (worth the cost for accuracy)

Risk 5: Personal/business expense mixing
- Problem: Claim personal expenses as business (car, rent, meals)
- Penalty: Disallowance, penalties, potential fraud charges
- Prevention: Separate accounts, clear business purpose for all expenses

**Cost-benefit analysis**

Investment: £5-10K/year (accountant + software)
Benefit:
- R&D credit: £20-50K (may offset or refund)
- Deduction optimization: £10-30K additional deductions
- Tax savings: (£20K deductions + £30K benefit) × 19% = £9.5K
- Penalties avoided: If filed incorrectly, could be £20K+
- Total benefit: £30K+ (3-6x cost)

ROI: 3-6x return on investment (strong case for good accounting support)

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "compliance-and-regulatory-considerations", "revenue-recognition-and-accounting-standards", "founder-compensation-and-equity-structure", "advanced-financial-modeling-and-forecasting"],
    faq: [
      { q: "How do I optimize my startup's tax?", a: "Key strategies: (1) R&D tax credit (recover 20% of engineer time), (2) Equipment write-off (expense immediately), (3) Salary vs dividends (optimize split for lower tax), (4) Pension contributions (pre-tax), (5) Expense timing (accelerate before profitable year). Use accountant to plan (£1-2K investment saves £10-30K in taxes). ROI: 3-6x." },
      { q: "Do I owe taxes if I'm not profitable?", a: "No: Losses carry forward (use against future profits). Example: Year 1 loss £200K, Year 2 profit £200K = £0 tax (loss offsets). Benefit: Significant tax savings when finally profitable (losses reduce taxable income). Track losses carefully (critical for tax planning)." },
      { q: "What's the R&D tax credit and how much can I claim?", a: "Credit: Recover 20% of qualifying R&D spend (for loss-making companies, refundable). Qualifying: Software development, engineering, new technology. Example: 2 engineers at £80K salary, 50% on R&D = £80K qualifying, claim £16K credit. Process: File with tax return, claim processed next quarter. Worth: Can be £20-50K for typical SaaS startup (significant benefit)." }
    ],
    videoUrl: ""
  }
];

export default batch307Articles;