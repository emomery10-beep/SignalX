import { AcademyArticle } from "@/types/academy";

export const batch349Articles: AcademyArticle[] = [
  {
    slug: "debt-management-and-financing-obligations",
    title: "Debt Management and Financing Obligations: Handling Financial Commitments",
    description: "Master debt management. Manage loans, understand obligations, optimize capital structure.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["debt management", "loan financing", "financial obligations", "debt covenants", "credit facilities"],
    keyTakeaways: [
      "Debt types: (1) Term loan (borrow lump sum, repay over time), (2) Line of credit (borrow as needed, pay interest), (3) Equipment financing (borrow to buy equipment), (4) Revenue-based financing (borrow based on revenue, repay % of revenue). Cost: Interest rate (5-15%+ typical), origination fees (1-5%), covenants (restrictions). Use debt when: CAC payback clear (certain revenue), interest rate <expected ROI. Avoid: High interest + uncertain revenue = risky.",
      "Debt covenants: Lender-imposed restrictions (e.g., maintain £500K cash minimum, <3:1 debt-to-equity ratio). Breach = forced repayment (fast-track loan due). Planning: Understand covenants, track to avoid breach. Impact: High (breach can force company into cash crisis). Monitoring: Monthly (cash balance, ratios, revenue).",
      "Capital structure: Equity (founder investment, investors) vs debt (borrowed money). Ratio: Early stage 100% equity, growth stage 80% equity / 20% debt, mature stage 60% equity / 40% debt (depends on industry). Benefit debt: Lower cost than equity (interest deductible, keeps control). Cost debt: Fixed obligation (must pay regardless of performance, limits flexibility)."
    ],
    content: [
      {
        heading: "Managing Debt and Financial Obligations Effectively",
        body: `Understanding and optimizing debt as part of capital structure.

**Debt fundamentals**

Definition:
- Borrowing money, obligation to repay with interest
- Lender (bank, credit fund) loans money at interest rate
- Borrower (company) repays principal + interest

Pros:
- Lower cost than equity (interest ~8%, equity dilution ~20%)
- Keep control (no new shareholders)
- Tax deductible (interest reduces taxable income)

Cons:
- Fixed obligation (must pay even if unprofitable)
- Covenants (restrictions on business)
- Personal guarantee (founder liable)
- Interest cost (8-15% typical)

**Debt types**

Type 1: Term loan

Structure:
- Borrow: Lump sum upfront
- Repay: Fixed payments monthly for fixed period (3-7 years typical)
- Rate: Fixed (8-12% typical) or variable

Example:
- Borrow: £500K
- Term: 5 years
- Rate: 10%
- Monthly payment: £10.6K (calculated)
- Total paid: £636K (interest £136K)

Use case: Equipment purchase, expansion, bridge financing

Type 2: Line of credit

Structure:
- Borrow: As needed (up to limit, e.g., £200K)
- Repay: Monthly payments on what you owe
- Rate: Prime + margin (usually variable, 6-12%)

Example:
- Limit: £200K
- Borrowed: £100K in month 1
- Interest: 10% annually = £833/month
- Repay: £100K over 12 months + interest

Use case: Cash flow management, working capital, flexibility

Type 3: Equipment financing

Structure:
- Lender: Finances equipment purchase
- Collateral: Equipment itself (lender can repossess)
- Term: Life of equipment (3-7 years)
- Rate: 6-10% (secured, lower rate)

Example:
- Buy: Servers costing £100K
- Finance: £100K over 5 years at 8%
- Monthly: £2.4K payment

Use case: Hardware purchase (servers, office equipment)

Type 4: Revenue-based financing

Structure:
- Lender: Gives money in advance
- Repay: % of monthly revenue until cap
- Cap: Usually 1.3-1.5x borrowed amount

Example:
- Borrow: £500K
- Revenue: £100K/month
- Repay: 10% of revenue = £10K/month
- Total repay: £500K (cap)
- Timeline: 50 months (4+ years)
- Cost: Implicit interest (£500K repaid on £500K borrowed, but 4 years, =~10-12% annual cost)

Use case: Fast-growing SaaS (predictable revenue), no collateral needed

**Cost of debt**

Interest rate factors:
- Credit score (higher = lower rate)
- Collateral (secured = lower rate, unsecured = higher)
- Loan size (larger = lower rate, economies of scale)
- Lender type (banks lower, credit funds higher)
- Maturity (shorter term = lower rate, longer = higher)

Typical rates by type:

| Type | Rate | Notes |
|---|---|---|
| Bank term loan | 6-10% | Secured, good credit |
| Unsecured credit line | 10-15% | Higher risk |
| Equipment financing | 6-9% | Secured by equipment |
| Revenue-based financing | 10-15% | Implicit (% of revenue) |
| Credit card | 15-25% | Expensive, avoid for capital |

All-in cost:
- Interest: 10% annual
- Origination fee: 2% upfront (£10K on £500K)
- Admin/documentation: £1-5K
- Total: 10% + 2% + fees = ~12% year 1, 10% ongoing

**Debt covenants**

Definition:
- Lender-imposed restrictions to protect lender's interests
- Breach = forced repayment (entire loan due immediately)

Common covenants:

Covenant 1: Minimum cash balance
- Requirement: "Maintain £500K cash minimum"
- Breach: If cash falls below £500K, full loan due
- Impact: Forces company to raise funds or cut spending

Covenant 2: Debt-to-equity ratio
- Requirement: "Debt < 2x equity (debt ≤ 40% of capital)"
- Example: £500K debt, equity ≥ £250K
- Breach: If company takes more debt without more equity, covenant breached

Covenant 3: Revenue/EBITDA targets
- Requirement: "Maintain £1M MRR" or "EBITDA ≥ £100K"
- Breach: If revenue falls below target, lender can call loan
- Impact: Enforces minimum performance

Covenant 4: Limitation on additional debt
- Requirement: "No additional debt without lender approval"
- Breach: If company borrows from another lender, covenant breached
- Impact: Limits flexibility to raise capital

Covenant 5: Key person insurance
- Requirement: "Key employee insured for £X (if dies, payout goes to lender)"
- Impact: Protects lender if key person leaves

Managing covenants:
- Track monthly (cash balance, ratios, revenue vs target)
- Plan (if approaching breach, discuss with lender)
- Communicate (update lender if problems brewing)
- Renegotiate (may be able to modify covenants if reasonable)

**When to use debt vs equity**

Equity (investors):
- Raises: Capital + expertise + network
- Cost: Dilution (15-20% per round typical)
- Best: Early stage (need mentoring, network)

Debt (lenders):
- Raises: Capital
- Cost: Interest (10-15% annual)
- Best: Predictable revenue (can service debt)

Decision framework:

1. Do you have predictable revenue?
   - Yes (SaaS, recurring): Debt works (can forecast payments)
   - No (project-based, lumpy): Equity better (flexibility)

2. Can you afford interest payments?
   - Yes (gross margin >70%, CAC payback clear): Debt viable
   - No (pre-PMF, uncertain): Equity better

3. Do you need investors for other reasons?
   - Yes (need board help, mentorship): Equity
   - No (have operator CEO, experienced team): Debt can work

4. What's the interest rate vs ROI?
   - Interest 8%, expected ROI 30%: Use debt (20% spread)
   - Interest 12%, expected ROI 15%: Maybe not (tight spread)

Example decisions:

Company A: £5M ARR, 70% margin, stable, experienced CEO
- Decision: Can use debt (£1-2M to scale marketing)
- Structure: Term loan £1M at 8%, 5 years = £20K/month
- Use: Scale sales (expect 30% ROI, debt cost 8% = 22% spread, good)

Company B: £500K ARR, early PMF, first-time founder
- Decision: Equity better (need guidance, pivot possible)
- Structure: Raise Series A from VC (equity), get mentor board

**Debt monitoring and management**

Monthly tracking:

| Metric | Required | Actual | Status |
|---|---|---|---|
| Cash minimum | £500K | £520K | OK |
| Debt-to-equity | <2:1 | 1.5:1 | OK |
| Revenue | ≥£1M MRR | £1.05M | OK |
| Monthly debt payment | £20K | £20K | Paid |

Quarterly:
- Review covenant status (any at risk?)
- Forecast 12 months (will we stay in compliance?)
- Plan (if at risk, what actions?)

If approaching breach:
- Communicate to lender (proactive, not surprised)
- Modify covenants (may be willing to adjust)
- Refinance (restructure debt on new terms)
- Accelerate revenue or reduce burn (fix underlying issue)

**Common debt mistakes**

Mistake 1: Too much debt
- Problem: Monthly payments £50K on £100K revenue (50% of revenue!)
- Fix: Debt should be 10-20% of revenue (rule of thumb)
- Impact: Over-leveraged (risk of breach, financial stress)

Mistake 2: Not understanding covenants
- Problem: Covenant breach surprises (cash dropped below £500K, lender calls loan)
- Fix: Understand covenants, track actively, communicate
- Impact: Prevent forced repayment (cash crisis)

Mistake 3: Debt with no plan for revenue
- Problem: Borrow £1M with "hope" revenue will grow
- Fix: Only borrow if clear path to revenue (PMF proven, CAC payback known)
- Impact: Avoid debt trap (can't service debt without revenue)

Mistake 4: Ignoring personal guarantee
- Problem: CEO personally liable for debt (if company fails, CEO responsible)
- Impact: Personal assets at risk (home, savings)
- Better: Negotiate to limit personal guarantee

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "cash-runway-and-burn-rate-management", "startup-grants-and-non-dilutive-funding", "fundraising-strategy-and-investor-outreach", "working-capital-management-and-cash-optimization"],
    faq: [
      { q: "What are the main types of debt for startups?", a: "Types: (1) Term loan (borrow lump sum, repay monthly), (2) Line of credit (borrow as needed), (3) Equipment financing (borrow for equipment), (4) Revenue-based financing (repay % of revenue). Rates: 6-15% depending on type and credit. Use when: Predictable revenue (can service debt), high ROI (interest <expected return). Avoid: High interest + uncertain revenue (too risky)." },
      { q: "What are debt covenants and why do they matter?", a: "Covenants: Lender-imposed restrictions (maintain cash minimum, debt-to-equity <2:1, minimum revenue). Breach = forced loan repayment (entire loan due immediately). Impact: Critical (breach can cause cash crisis). Management: Track monthly, forecast quarterly, communicate if at risk. Can negotiate to modify covenants if needed." },
      { q: "Should I use debt or equity to raise capital?", a: "Debt better if: Predictable revenue (SaaS, recurring), can afford interest payments, experienced team. Equity better if: Pre-PMF (uncertain), need investor guidance, complex pivots possible. Rule of thumb: Debt 10-20% of revenue (not over-leveraged). Cost: Interest 8-15%, equity dilution 15-25%. Debt cheaper but less flexible." }
    ],
    videoUrl: ""
  }
];

export default batch349Articles;
