import { AcademyArticle } from "@/types/academy";

export const batch105Articles: AcademyArticle[] = [
  {
    slug: "debt-financing-capital-structure",
    title: "Debt Financing and Capital Structure: Optimizing Growth with Debt and Equity",
    description: "Master debt financing options for SaaS. Understand when to use debt vs. equity, how to structure debt, and optimize your capital structure.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "debt financing",
      "SaaS lending",
      "capital structure",
      "debt vs equity",
      "credit facilities",
      "venture debt",
      "revenue-based financing",
      "interest rates",
      "dilution",
      "leverage"
    ],
    keyTakeaways: [
      "Debt vs. equity trade-off: Equity (VC funding) = no repayment required, but dilutes ownership (founder 50% → 30% after Series A); debt (bank loan) = must repay with interest (5-15% annual rate typical), but you keep ownership, no dilution. Choose debt if: profitable/cash-flowing, don't need cash urgently. Choose equity if: need growth capital fast, not yet cash-flowing, risk is high",
      "SaaS lending options: (1) Traditional bank loans (5-8% interest, require cash flow, 3-year terms), (2) Venture debt (10-15% interest, provided by specialized VCs, 2-year terms, often paired with equity rounds), (3) Revenue-based financing (6-10% monthly revenue share for 5-7 years, better for growth companies not yet profitable). SaaS-specific lenders: Silicon Valley Bank, Lighter Capital, Clearco, Stripe Capital",
      "Optimal capital structure for SaaS: Equity for first 2-3 rounds (get to £2-10M ARR, prove model), then add debt for growth acceleration; example: raised £10M Series B at £1B valuation, take £5M venture debt to accelerate sales (double sales team, marketing), debt repaid in 3 years from improved profitability/cash flow. Debt to equity ratio: 0.3-0.5 (conservative), 0.5-1.0 (moderate leverage), >1.0 (high leverage, risky)"
    ],
    content: [
      {
        heading: "Understanding Debt vs. Equity Financing",
        body: `Two main sources of capital: debt (borrowed money) and equity (investor ownership stake).

**Equity Financing (Venture Capital)**

How it works:
- You give up ownership stake (e.g., 20% of company)
- Investor gives you cash (e.g., £10M)
- No repayment obligation
- Investor exits when company gets acquired or IPOs

Example:

Pre-Series A:
- You own 100% of company
- Valuation: £5M (post-money)

Series A investment:
- Investor invests £10M at £50M post-money valuation
- New shares issued: £10M ÷ £50M post-money = 20% of company
- You now own: 80% of £50M = £40M (vs £5M pre-Series A)

Your net benefit:
- Company valuation increased from £5M to £50M (10x value creation)
- You own 80% (down from 100%)
- Worth £40M (up from £5M)
- Gave up 20% but gained £35M

**Debt Financing (Bank Loans, Venture Debt)**

How it works:
- You borrow money from bank or lender
- Must repay over agreed time period with interest
- Keep 100% ownership
- No dilution

Example:

Company situation:
- ARR: £5M (growing 50% YoY)
- Cash position: £500K
- Not yet profitable (−10% operating margin)

Option 1: Raise equity (Series A)
- Raise £5M Series A at £25M post-money valuation
- Give up 17% ownership (£5M ÷ £25M)
- Cash available: £500K + £5M = £5.5M
- Ownership: 83%

Option 2: Take on debt
- Borrow £3M from venture debt lender
- Interest rate: 12%/year
- Repayment: 3-year term
- Cash available: £500K + £3M = £3.5M
- Ownership: 100%

Which is better?

Case A: If you hit profitability in 12 months
- Debt path: Owe £3M + interest (£360K/year), but profitable
- Can repay from cash flow
- Ownership: 100%
- Outcome: Better (avoid dilution)

Case B: If you don't hit profitability
- Debt path: Owe £3M + interest, but not profitable
- Cash burns fast, can't repay debt
- Must raise dilutive equity anyway (or default on debt)
- Outcome: Worse (forced to raise equity under bad terms)

Decision: Use debt if confident in profitability. Use equity if uncertain.

**Debt vs. Equity: Key Differences**

| Factor | Equity | Debt |
|--------|--------|------|
| Ownership dilution | Yes (you own less) | No |
| Repayment | None | Required |
| Interest/return to investor | Equity upside (exit) | Interest (5-15%) |
| When to use | High growth, uncertain | Profitable, predictable |
| Board seat | Usually yes | No |
| Control | Shared | Retained |
| Cost of capital | 20-30% annually (implicit) | 5-15% interest |
| Impact on valuation | Lower (dilution) | None |

The "cost of capital" is real. Equity gives up 20-30% annual returns (if company grows), while debt costs 5-15% explicitly.

**Types of Debt for SaaS**

Traditional Bank Loans:

Characteristics:
- Interest rate: 5-8% (depends on creditworthiness)
- Repayment: 3-5 years
- Collateral: Often require personal guarantee or company assets
- Covenants: Restrictions (maintain certain ratios, minimum cash balance)
- Lender: Traditional banks (JPMorgan, HSBC, NatWest)

Best for:
- Profitable companies (banks lend to profitable businesses)
- Cash-flowing businesses (can afford monthly payments)
- Mature companies (>£10M ARR)

Challenge:
- Hard to get for pre-profitable startups
- Banks require financial history
- Monthly payments = cash flow strain

Venture Debt:

Characteristics:
- Interest rate: 10-15% (higher than traditional banks, more risk)
- Repayment: 2-3 years
- Often includes equity kickers (lender gets warrant to buy company stock)
- Non-dilutive (no equity given up, but warrant gives minor upside)
- Lender: Specialized venture debt funds (Horizon Tech Finance, Western Technology Investment, SVB)

Best for:
- High-growth SaaS companies (Series A, B, C stage)
- Recently raised equity round (easier to get venture debt after VC funding)
- Companies that will be profitable in 18-24 months

Advantages:
- Available even if not yet profitable (VC already vetted you)
- Can be raised quickly (60-90 days)
- Doesn't require personal guarantee

Example:

Just raised Series B (£10M equity at £50M post-money valuation).
Venture debt lender offers:
- £3M loan, 12% interest
- 2-year repayment
- Warrant to buy 2% of company at Series B valuation

Cost:
- Interest: £360K/year
- Warrant: 2% ownership (dilution), but at Series B valuation (small)

Benefit:
- £3M additional capital without diluting existing round
- Can accelerate sales team, marketing, product

Revenue-Based Financing (RBF):

Characteristics:
- You pay back a % of monthly revenue (e.g., 5%)
- Repayment: Until you've paid back 1.3-1.5x principal
- No fixed repayment term (depends on revenue)
- Often faster to get than VC debt
- Lender: Clearco, Lighter Capital, Stripe Capital

Example:

Company with £1M/month revenue.
RBF provider offers:
- £500K advance
- Repay 5% of monthly revenue
- Until you've paid back £750K (1.5x)

Repayment:
- Month 1: Pay £1M × 5% = £50K (balance: £450K)
- Month 2: Pay £1M × 5% = £50K (balance: £400K)
- ...
- Month 15: Pay remaining balance

Total repaid: £750K (vs £500K borrowed)
Effective interest rate: ~50% (higher than VC debt, but spread over time)

Best for:
- High-growth, recurring revenue (£500K+ MRR)
- Not yet profitable (more forgiving than banks)
- Need capital quickly

**Optimal Capital Structure**

Stage 1: Early-stage (< £1M ARR)
- Financing: Equity only (seed, Series A)
- Debt not available (too risky for lenders)
- Focus: Achieve product-market fit, get to £1M ARR

Stage 2: Growth (£1-10M ARR)
- Financing: Equity (Series A, B) + maybe some venture debt
- Debt becoming available as you derisk
- Example: Raise £5M Series A, add £1M venture debt (25% debt/equity ratio)

Stage 3: Scale (> £10M ARR)
- Financing: Mix of equity (late-stage rounds) + meaningful debt
- Now profitable or close, can take on debt safely
- Example: Raise £20M Series C + £5M venture debt (20% debt/equity ratio)

Stage 4: Late-stage (approaching exit)
- Financing: Debt can be larger portion
- Using debt to accelerate path to profitability/exit
- Example: Already profitable at £50M ARR, take £10M debt (17% debt/equity ratio)

Debt to Equity Ratio Guidelines:

Conservative (low risk):
- Debt/Equity < 0.3
- Meaning: £1 of debt for every £3 of equity funding
- Low financial risk, less aggressive growth
- Lenders comfortable, interest rates lower

Moderate (balanced):
- Debt/Equity 0.3-0.5
- Meaning: £1 of debt for every £2-3 of equity
- Balanced growth and financial stability
- Most companies in this range

Aggressive (high leverage):
- Debt/Equity 0.5-1.0
- Meaning: £1 of debt for every £1-2 of equity
- High growth focus, more financial risk
- Can work if cash-flowing and growing fast

Very high leverage:
- Debt/Equity > 1.0
- High financial risk
- Not recommended unless exceptional (profitable, growing >50%)

**When to Use Debt**

Use debt when:

1. You're profitable or close to it
   - Can repay from cash flow
   - Interest payments manageable

2. You have predictable recurring revenue
   - SaaS subscription = predictable
   - Seasonal business = risky for debt

3. You need capital for specific use case
   - Example: Debt to hire sales team (grows revenue to repay)
   - Not for general corporate purposes

4. You want to avoid equity dilution
   - Example: Next equity round would dilute you 20%
   - Debt avoids that dilution

5. Growth capital can create enough value to cover cost
   - Example: Borrow £5M at 10% = £500K/year cost
   - If you can generate £2M+ incremental profit = good ROI

**Debt Covenants and Restrictions**

Lenders often require covenants (restrictions on your business):

Financial covenants:
- Maintain minimum cash balance (e.g., £500K)
- Keep debt service coverage ratio above 1.5x (earnings > debt payments)
- Don't raise more debt above certain limit

Operational covenants:
- Don't change major business activities without lender approval
- Don't make acquisitions above certain size without approval
- Don't pay dividends
- Must maintain certain business metrics (ARR, customer count)

These can constrain your flexibility. Factor into decision.

**Debt in the Capital Stack**

How debt fits in your total capital:

Example company with £100M post-money valuation:

Capital stack:
- Preferred equity (investors): £50M (Series B, C investors)
- Common equity (founders, employees): £40M
- Debt (lenders): £10M
- Total capitalization: £100M

In a sale at £500M:
- Debt paid off first: £10M
- Preferred equity paid next: £50M
- Remaining £440M split between preferred and common

Debt is "senior" (paid first), equity is "junior" (paid last).

Lenders like this (get paid first). Equity holders don't (less security).

This is why debt gets lower interest rates and equity demands higher returns.

**Decision Framework: Debt vs. Equity**

Use this framework:

Question 1: Are you profitable or will you be in 18-24 months?
- Yes: Debt is viable
- No: Stick with equity

Question 2: Do you have predictable recurring revenue?
- Yes: Debt is safe
- No: Equity is safer

Question 3: Do you want to avoid equity dilution?
- Yes: Consider debt
- No: Equity is fine

Question 4: Is the capital for growth or operations?
- Growth (revenue-generating): Debt can work
- Operations (general): Equity better

Question 5: Can the growth generate enough profit to cover debt cost?
- Yes: Debt has positive ROI
- No: Don't take on debt

If you answer yes to 3+ questions, debt is a good option.
If you answer no to 2+ questions, stick with equity.

Debt is a powerful tool to accelerate growth without dilution, but use it only when the fundamentals support repayment.
`
      }
    ],
    relatedSlugs: [
      "funding-and-investment-strategy",
      "profitability-mechanics",
      "cash-management-and-forecasting",
      "financial-forecasting-modeling",
      "saas-valuation-and-multiples"
    ],
    faq: [
      {
        q: "Should I use debt or equity for growth?",
        a: "Equity if: uncertain future, early-stage, need capital urgently. Debt if: profitable/nearly profitable, predictable revenue, want to avoid dilution. Best: mix of both."
      },
      {
        q: "What's typical interest rate for SaaS debt?",
        a: "Traditional bank: 5-8%. Venture debt: 10-15%. Revenue-based financing: 6-10% monthly (50%+ annual). Rate depends on stage, growth, profitability."
      },
      {
        q: "What's a safe debt-to-equity ratio?",
        a: "Conservative: <0.3 (low risk). Moderate: 0.3-0.5 (balanced). Aggressive: 0.5-1.0 (high growth). >1.0: risky unless very profitable."
      },
      {
        q: "Can I use debt if I'm not profitable?",
        a: "Venture debt: Yes (if you've raised VC equity and are growing). Revenue-based financing: Yes (if high revenue). Traditional bank: No (require profitability or strong cash flow)."
      }
    ],
    videoUrl: ""
  }
];

export default batch105Articles;
