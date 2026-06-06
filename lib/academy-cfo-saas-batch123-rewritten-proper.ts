import { AcademyArticle } from "@/types/academy";

export const batch123Articles: AcademyArticle[] = [
  {
    slug: "debt-management-and-credit-facilities",
    title: "Debt Management and Credit Facilities: Using Leverage to Accelerate Growth",
    description: "Master debt financing. Understand credit facilities, term loans, and when debt makes sense for SaaS growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "debt financing",
      "credit facility",
      "term loan",
      "revenue-based financing",
      "venture debt",
      "bank loan",
      "interest rate",
      "debt covenants",
      "leverage",
      "debt-to-equity ratio"
    ],
    keyTakeaways: [
      "Types of debt: (1) Bank term loan (5-7 years, 8-12% interest, requires profitability/cash flow), (2) Revenue-based financing (pay 5-10% of revenue until 1.3-1.5x repaid, no equity dilution), (3) Venture debt (shorter term, higher rates, paired with equity rounds). Example: £1M revenue-based at 8% = £80K annual payment until £1.3M repaid (then stops).",
      "When to use debt: (1) Post-PMF, profitable or near-profitable, need capital to scale sales; (2) Don't have equity to raise or want to minimize dilution; (3) Have predictable recurring revenue (MRR stability). Don't use debt if: Burning cash, unprofitable, revenue unstable. Debt accelerates what's working, but magnifies losses if not.",
      "Leverage ratio: Debt-to-equity or debt-to-revenue. Example: £1M debt, £3M equity = 0.33x debt-to-equity (healthy). £1M debt, £500K revenue = 2x debt-to-revenue (high, risky). SaaS healthy range: <0.5x debt-to-revenue. Avoid exceeding 1x."
    ],
    content: [
      {
        heading: "Types of Debt and Credit Facilities",
        body: `There are several types of debt available to SaaS companies. Each has different terms, rates, and appropriate use cases.

**Bank Term Loans**

Structure:
- Borrow lump sum upfront
- Repay over 3-7 years with fixed interest
- Requires personal guarantee from founders (usually)
- Requires financial covenants (maintain certain ratios)

Terms:
- Loan amount: £100K to £5M+ (depends on revenue/profitability)
- Interest rate: 8-12% typical for SaaS (vs 4-6% for established businesses)
- Monthly payments: Fixed amount (principal + interest)
- Prepayment: Usually allowed without penalty

Example:

Borrow: £1M
Interest rate: 10%
Term: 5 years

Monthly payment: £21.2K

Over 5 years:
- Total paid: £21.2K × 60 = £1.27M
- Interest cost: £270K

Who qualifies:
- £2M+ ARR preferred
- Positive EBITDA or clear path to profitability
- Stable cash flow (predictable MRR)
- Strong management team

Pros:
- Fixed payment, predictable cost
- Long repayment term (less strain on cash)
- No equity dilution

Cons:
- High interest rate (10%+)
- Requires profitability or strong cash flow
- Personal guarantee (founder liable if company fails)
- Restrictive covenants (limits on other debt, minimum cash balance, etc.)

**Revenue-Based Financing (RBF)**

Structure:
- Lender gives upfront capital
- You repay percentage of monthly revenue (5-10%) until cap reached (usually 1.3-1.5x borrowed amount)
- Then payments stop

Terms:
- Loan amount: £100K to £2M typical
- Repayment %: 5-10% of monthly revenue
- Repayment cap: 1.3-1.5x of amount borrowed
- No dilution (no equity given)

Example:

Borrow: £500K
Repayment %: 8% of revenue
Revenue: £100K/month

Monthly payment: £100K × 8% = £8K

How long to repay:
- Total to repay: £500K × 1.3 = £650K
- At £8K/month: £650K ÷ £8K = 81 months (6.75 years)

But if revenue grows:
- Month 12: Revenue £150K, payment £12K/month
- Month 24: Revenue £200K, payment £16K/month
- Repayment accelerates

Who qualifies:
- £500K+ ARR preferred
- Strong MRR growth (20%+ monthly growth ideal)
- Not required to be profitable

Pros:
- No equity dilution (no founder ownership loss)
- Payments scale with revenue (if grow fast, repay fast)
- Faster approval than bank loans
- Flexible (no covenants)

Cons:
- Payment indefinite until cap hit (not like loan with end date)
- If revenue declines, still paying % of revenue
- Can become expensive if high repayment % and slow payback
- Growth feels "taxed" by revenue share

**Venture Debt**

Structure:
- High-interest short-term loan
- Usually paired with equity round (bank financing for Series A/B investors)
- Subordinate to equity (if company fails, equity holders paid before debt)

Terms:
- Loan amount: £500K to £5M (usually 10-15% of equity raise size)
- Interest rate: 12-18% typical
- Term: 2-4 years
- Warrant coverage: 10-30% of borrowed amount (right to buy shares)

Example:

Raising Series B: £5M equity
Take venture debt: £750K
Interest rate: 14%

Cost:
- Annual interest: £750K × 14% = £105K/year
- Warrants: £750K × 20% = £150K warrant value (right to buy stock at discount)

Purpose:
- Extend runway while fundraising next round
- Increase total capital raised without more equity dilution
- Bridge between Series A and Series B

Who uses it:
- Growth-stage companies raising institutional capital
- Need additional runway to hit next milestone
- Want to minimize additional equity dilution

Pros:
- Extends runway without equity dilution (or less dilution)
- Expected payoff if successful exit (warrants convert)
- Relatively quick funding process

Cons:
- High interest rate (expensive)
- Dilution from warrants (hidden equity cost)
- Subordinate debt (if company fails, might not get repaid)

**Line of Credit**

Structure:
- Credit facility (revolving line)
- Draw up to max amount, pay interest only on what's drawn
- Repay as business generates cash

Terms:
- Limit: £100K to £1M (depends on company)
- Interest rate: 8-12%
- Fees: Annual fee (0.5-1%) + usage fee
- Flexible: Borrow/repay as needed

Example:

Line of credit: £500K limit
Interest rate: 10%
Use: Draw £200K to cover payroll during seasonal dip

Costs:
- Annual fee: £500K × 1% = £5K
- Interest on drawn: £200K × 10% = £20K/year
- Interest only paid on drawn amount (efficient)

Who uses it:
- Companies with seasonal revenue (dips and peaks)
- Seasonal cash flow needs (customer pays in lump sum, not monthly)
- Working capital management

Pros:
- Flexible (draw/repay as needed)
- Efficient (only pay interest on used portion)
- Lower cost than term loan

Cons:
- Smaller amounts available
- May require to prepay with cash when available
- Requires good credit/relationship with bank

**Accounts Receivable (AR) Financing**

Structure:
- Lender advances cash based on customer invoices
- You repay when customer pays
- Effectively converts AR into cash

Terms:
- Advance %: 75-90% of invoice value
- Fees: 2-4% of invoiced amount
- Repayment: When customer pays invoice

Example:

Issue £1M invoice to customer
AR financing: 85% advance = £850K upfront
Fee: 2% = £20K

Customer pays in 60 days:
- You receive: £1M from customer
- Lender repaid: £850K
- Cost: £20K fee
- Net: £850K - £20K = £830K to you

Who uses it:
- Companies with long sales cycles (invoices issued, customers pay 60+ days later)
- Need cash before customer payment arrives

Pros:
- Converts future cash into current cash
- Helps with cash flow timing mismatches

Cons:
- Expensive (2-4% fees)
- Only works if you have invoices (B2B sales model)
`
      },
      {
        heading: "Debt Covenants and Risk Management",
        body: `Debt comes with requirements and restrictions. Understand what you're agreeing to.

**Common Debt Covenants**

Affirmative covenants (must do):
1. Maintain minimum cash balance
   - Example: "Maintain £250K minimum cash at all times"
   - If cash falls below, you're in breach (risky)

2. Maintain debt service ratio
   - Example: "EBITDA must be 1.5x of annual debt service"
   - If profitability declines, breach risk

3. Maintain debt-to-equity ratio
   - Example: "Debt <1x equity"
   - Can't borrow more debt if this ratio exceeded

4. Annual financial statements
   - Must provide audited financials within 90 days of year-end
   - Allows lender to monitor your health

5. Insurance requirements
   - Must maintain D&O insurance
   - Lender wants to be protected

Negative covenants (must not do):
1. Can't take on additional debt without lender approval
2. Can't change ownership (sell company, merge)
3. Can't make large capital expenditures without approval
4. Can't pay dividends to shareholders
5. Can't change business model significantly

Example covenant: "Cannot raise debt beyond £2M total without lender consent"

This restricts your flexibility.

**Financial Covenants Example**

Term loan from bank requires:

"Must maintain debt service coverage ratio (DSCR) >1.25x"

DSCR = Operating cash flow / Debt service

Example:

Annual operating cash flow: £500K
Annual debt service: £350K
DSCR: 500 / 350 = 1.43x (compliant, >1.25x)

If cash flow declines:
- Cash flow falls to £300K
- DSCR becomes: 300 / 350 = 0.86x (breached, <1.25x)
- Bank has right to demand repayment immediately
- This is called "acceleration"

Acceleration risk: If you breach covenant, lender can demand full balance repaid immediately. This is catastrophic.

**Personal Guarantees**

Bank loans typically require personal guarantee from founder/CEO.

What this means:
- If company can't repay loan, founder is personally liable
- Bank can pursue personal assets (house, savings)
- Not dischargeable in bankruptcy (usually)

Example:

Take £1M loan with personal guarantee
Company hits hard times, only has £300K
Lender demands full £1M
You have to pay personal £700K from personal assets

This is serious. Understand the risk before signing.

**Leverage Ratios**

Monitor these to avoid over-leveraging:

Debt-to-Equity Ratio:
- Formula: Total debt ÷ Total equity
- Example: £1M debt, £3M equity = 0.33x ratio
- SaaS healthy: <0.5x
- Concerning: >1.0x

Debt-to-Revenue Ratio:
- Formula: Total debt ÷ Annual revenue
- Example: £1M debt, £5M revenue = 0.2x ratio
- SaaS healthy: <0.5x
- Concerning: >1.0x

Debt Service Coverage Ratio:
- Formula: Operating cash flow ÷ Annual debt service
- Should be >1.5x for comfort
- <1.25x is risky (tight cash flow)

Example company at risk:

Annual revenue: £3M
Operating cash flow: £300K (10% margin)
Debt outstanding: £2M
Annual debt service: £400K (principal + interest)
DSCR: 300 / 400 = 0.75x (breached, <1.25x minimum)

This company is overleveraged. Interest payments consuming cash flow.

Action: Either increase cash flow (cut costs, grow revenue) or pay down debt.
`
      },
      {
        heading: "When to Use Debt for SaaS Growth",
        body: `Debt is a tool. Use it when it makes sense, avoid when it doesn't.

**Good Use Cases for Debt**

Case 1: Near-profitable, need growth capital
- Company: £5M revenue, £200K operating profit (4% margin)
- Problem: Profitable but not generating enough excess cash to hire sales team
- Solution: Borrow £1M at 10% = £100K/year cost
- Use: Hire 2 salespeople, drive £2M new revenue
- Payoff: £2M new revenue > £100K interest cost

This works: Borrow to accelerate growth when underlying unit economics are good.

Case 2: Strong ARR, need working capital
- Company: £10M ARR, growing 30% YoY, but annual contracts create payment lumpiness
- Problem: Collect £5M in Jan, must cover 12 months of expenses
- Solution: Line of credit to smooth cash flow
- Use: Borrow in Feb-Nov, repay from Jan collection

This works: Borrow short-term to manage cash timing.

Case 3: Minimize dilution
- Company: Series B, raising £5M equity
- Want to preserve founder ownership
- Solution: Take £1M venture debt alongside equity
- Total capital: £6M with less equity dilution

This works: Venture debt reduces equity dilution.

**Bad Use Cases for Debt**

Case 1: Burning cash
- Company: £1M ARR, monthly burn £50K, 8 months runway
- Solution: Take £500K debt to extend runway
- Problem: Won't fix unit economics, just delays the problem
- In 10 months: Debt due + burn rate = crisis

This doesn't work: Debt doesn't fix fundamentals.

Case 2: Unpredictable revenue
- Company: SaaS with 50% churn rate, revenue unpredictable
- Problem: Committed to £50K/month debt service, but revenue varies £30K-£100K
- Risk: Month with £30K revenue can't pay £50K service
- Lender will demand repayment or take assets

This doesn't work: Debt with unpredictable revenue is risky.

Case 3: Early stage
- Company: £500K ARR, Series A stage
- Thinking: Borrow £1M at 10% vs raise equity
- Problem: At 10% interest, need to service £100K/year
- With margins of 20-30%, need £500K-£1M new ARR just to cover interest
- High pressure, high risk

Better to raise equity when early stage (less pressure, more runway).

**Decision Framework**

Ask these questions:

1. Are we profitable or approaching profitability?
   - Yes: Debt can work
   - No: Avoid debt (cash burn is problem, not growth opportunity)

2. Is our revenue predictable?
   - Yes: Debt is safer
   - No: Avoid debt (unpredictable revenue = can't cover payments)

3. Are our unit economics good (LTV/CAC >3x)?
   - Yes: Borrowing to grow makes sense
   - No: Fix unit economics first, then debt

4. Do we need debt or equity?
   - Need capital for growth = Equity better (less pressure)
   - Have profitability, want to minimize dilution = Debt better
   - Have short-term working capital gap = Debt/LOC better

5. Can we afford the payments?
   - Operating cash flow >2x debt service? = Safe
   - Operating cash flow <1.5x debt service? = Risky

**Comparing Debt vs Equity**

Same growth scenario:

Scenario 1: Raise £1M equity
- Give up 10% ownership (valued at £10M post-money)
- No interest payments
- No repayment obligation
- Dilution: Founder goes from 70% to 63%

Scenario 2: Borrow £1M at 10%
- Keep 100% ownership (same £10M valuation)
- Pay £100K interest/year (or £8.3K/month)
- Must repay in 5 years (£21K/month)
- If company grows to £20M valuation, founder still owns 100%

Which is better?
- If company succeeds: Debt is better (founder retains more equity)
- If company struggles: Equity is better (no debt repayment pressure)

Most SaaS founders choose equity when young (less pressure), debt when mature (more ownership preservation).
`
      },
      {
        heading: "Debt on the Balance Sheet and Tax Impact",
        body: `How debt shows up in financial statements and tax implications.

**Balance Sheet Impact**

Debt appears as liability:

Balance Sheet:

Assets:
- Cash (increased by borrowed amount)
- Other assets

Liabilities:
- Debt: £1M (long-term liability)
- Interest payable: £50K (current liability)

Equity:
- Common stock
- Retained earnings

When you borrow £1M:
- Cash +£1M (asset increases)
- Debt +£1M (liability increases)
- Equity unchanged (just borrowed, not earned)

When you repay principal £100K/month:
- Cash -£100K
- Debt -£100K (balance sheet shrinks)

When you pay interest £50K/month:
- Cash -£50K
- Interest expense +£50K (on P&L)
- No change to debt balance (interest is expense, not principal)

**P&L Impact**

Interest is an expense on P&L:

Example:

Revenue: £1M
Operating expenses: £800K
Operating income: £200K
Interest expense: -£50K (from £1M debt at 5%)
Pretax income: £150K
Taxes: -£37.5K (25%)
Net income: £112.5K

Impact:
- Interest reduced profit by £50K
- This is tax-deductible (reduces taxable income)

**Tax Benefits of Debt**

Interest is tax-deductible.

Example:

No debt:
- Operating income: £200K
- Taxes (25%): £50K
- Net income: £150K

With debt:
- Operating income: £200K
- Interest expense: £50K
- Pretax income: £150K
- Taxes (25%): £37.5K
- Net income: £112.5K

Tax savings: £50K - £37.5K = £12.5K

So true cost of £50K interest is £37.5K after tax (25% tax savings).

This is why debt can be cheaper than it appears.

**Debt and Financial Ratios**

Investors look at these:

1. Debt-to-Equity
- Higher debt = Higher leverage (riskier)
- <0.5x is comfortable
- >1.0x is risky

2. Interest Coverage
- Formula: Operating income ÷ Interest expense
- Example: £200K op income ÷ £50K interest = 4x
- Should be >2x (comfortable margin)
- <1.5x is risky (tight on covering interest)

3. Debt Service Coverage
- Formula: Operating cash flow ÷ (Principal + Interest)
- Example: £300K cash flow ÷ £150K service = 2x
- Should be >1.5x
- <1.25x is breach risk

**When Debt Matters in Valuation**

Enterprise Value vs Equity Value:

Enterprise value = What company is worth (asset-based)
Equity value = Enterprise value - Net debt

Example:

Enterprise value: £50M (what company is worth)
Debt: £5M
Cash: £2M
Net debt: £3M

Equity value = £50M - £3M = £47M

This is what founders/shareholders own (after debt paid off).

Lesson: High debt reduces equity value, even if enterprise value is same.
`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "burn-rate-and-cash-runway-analysis",
      "p-l-statement-architecture-profitability",
      "funding-and-investment-strategy",
      "saas-valuation-and-multiples"
    ],
    faq: [
      {
        q: "What type of debt is best for SaaS companies?",
        a: "Revenue-based financing (5-10% of revenue until cap reached) is popular for growth-stage SaaS. Bank term loans work if profitable. Venture debt is common alongside equity rounds. Line of credit for working capital management. Each has different cost/risk trade-offs. Choose based on: profitability, revenue predictability, growth needs."
      },
      {
        q: "How much debt can I safely take on?",
        a: "Debt-to-revenue ratio should be <0.5x (healthy). Debt-to-equity should be <0.5x. Debt service coverage ratio (operating cash flow ÷ debt service) should be >1.5x. If any ratio exceeds these, you're overleveraged. Rule of thumb: Only borrow what you can repay from operating cash flow in 3-5 years."
      },
      {
        q: "Should I use debt or raise equity?",
        a: "Equity if: early-stage, unprofitable, want to minimize pressure. Debt if: profitable/near-profitable, predictable revenue, want to minimize dilution. Both: Venture debt (smaller amount, higher rate) alongside equity rounds. Most founders choose equity early (less risky), debt later (ownership preservation)."
      },
      {
        q: "What happens if I breach a debt covenant?",
        a: "Lender can demand immediate repayment (acceleration clause). Catastrophic for cash flow if you can't repay immediately. Avoid breaching covenants by understanding them in advance. Monitor financial ratios monthly. If trending toward breach, discuss with lender before problem occurs (usually more flexible than after breach)."
      }
    ],
    videoUrl: ""
  }
];

export default batch123Articles;
