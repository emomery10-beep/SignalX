import { AcademyArticle } from "@/types/academy";

export const batch371Articles: AcademyArticle[] = [
  {
    slug: "debt-financing-and-venture-debt-strategy",
    title: "Debt Financing and Venture Debt Strategy: Non-Dilutive Capital for SaaS",
    description: "Master debt financing. Use venture debt, revenue-based financing, and credit lines to extend runway without dilution.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["venture debt", "debt financing", "revenue-based financing", "non-dilutive", "credit facility"],
    keyTakeaways: [
      "Venture debt: Typically 25-35% of last equity round. Example: Raised £10M Series A, qualify for £2.5-3.5M venture debt. Cost: 8-14% interest rate + warrants (0.1-0.5% equity dilution). Term: 3-4 year loan, 12-month interest-only, then 24-month amortisation. Use case: Extend runway 3-6 months between equity rounds. ROI: If venture debt costs 12% but avoids 20% dilution from premature equity raise, net benefit is significant.",
      "Revenue-based financing (RBF): Borrow against future recurring revenue. Typical: 3-6x monthly recurring revenue. Example: £200K MRR qualifies for £600K-1.2M. Repayment: Fixed % of monthly revenue (5-10%) until repaid at 1.3-1.8x multiple. Cost: Effective APR 15-30%. No equity dilution, no board seats. Best for: Companies with strong MRR that want to fund growth without equity. Avoid if: Revenue is volatile or declining.",
      "When to use debt vs equity: Debt is best for: Extending runway (bridge to next round), funding specific ROI projects (marketing spend with known return), working capital. Equity is best for: Major growth investment, uncertain outcomes, long time horizons. Rule of thumb: If payback is <18 months, use debt. If payback is uncertain or >24 months, use equity. Never use debt to fund operating losses without a clear path to profitability."
    ],
    content: [
      {
        heading: "Using Debt Financing Strategically in SaaS",
        body: `Leveraging non-dilutive capital to extend runway and fund growth.

**Venture debt fundamentals**

What is venture debt:
- Term loan from specialist lender (not traditional bank)
- Typically follows an equity round
- Sized as percentage of equity raised
- Includes interest + warrants (small equity component)

Key terms:

Loan amount:
- 25-35% of last equity round
- Example: £10M Series A → £2.5-3.5M venture debt

Interest rate:
- 8-14% (floating or fixed)
- Higher than bank loans (risk premium)
- Example: £3M loan at 10% = £300K annual interest

Warrants:
- Right to purchase equity at agreed price
- Typically 0.1-0.5% of company
- Example: 0.25% warrants on £40M post-money = £100K value
- Much less dilutive than equity round

Loan structure:
- Term: 36-48 months
- Interest-only period: 6-12 months
- Amortisation: 24-36 months (principal + interest payments)

Example payment schedule (£3M loan, 10% rate, 12-month IO):

Months 1-12 (interest only):
- Monthly payment: £3M × 10% / 12 = £25K
- Total year 1 payments: £300K

Months 13-36 (amortisation):
- Monthly principal: £3M / 24 = £125K
- Monthly interest: Declining (on outstanding balance)
- Month 13 payment: £125K + £25K = £150K
- Month 24 payment: £125K + £12.5K = £137.5K

Total cost:
- Interest paid: ~£450K over 3 years
- Warrants: £100K equivalent
- Total cost: £550K for £3M capital
- Effective annual cost: ~6% (much cheaper than equity dilution)

When to use venture debt:

Good use cases:
- Bridge to next equity round (3-6 months additional runway)
- Fund specific growth initiative (marketing spend, new market entry)
- Working capital for seasonal cash needs
- Equipment or infrastructure investment

Bad use cases:
- Cover ongoing operating losses (debt doesn't fix unit economics)
- When company is struggling to raise equity (signals to lenders)
- When revenue is declining
- When no clear path to repay

**Revenue-based financing (RBF)**

How RBF works:

Step 1: Qualify based on MRR
- Minimum: Usually £50K+ MRR
- Typical: £100K-500K MRR
- Assessment: Revenue quality, growth, churn

Step 2: Receive capital
- Amount: 3-6x monthly recurring revenue
- Example: £200K MRR → £600K-1.2M capital
- Disbursement: Usually within 2-4 weeks

Step 3: Repay from revenue
- Fixed % of monthly revenue (5-10%)
- Until total repayment reaches agreed multiple (1.3-1.8x)
- Example: £800K received, repay until £1.2M paid (1.5x multiple)

Repayment example:

Capital received: £800K
Repayment multiple: 1.5x (total repay: £1.2M)
Revenue share: 8% of monthly revenue

| Month | MRR | Payment (8%) | Cumulative paid |
|---|---|---|---|
| 1 | £200K | £16K | £16K |
| 6 | £230K | £18.4K | £103K |
| 12 | £265K | £21.2K | £221K |
| 18 | £305K | £24.4K | £360K |
| 24 | £350K | £28K | £524K |
| 30 | £400K | £32K | £714K |
| 36 | £460K | £36.8K | £935K |
| 40 | £500K | £40K | £1,200K (done) |

Total repaid: £1.2M over ~40 months
Effective cost: £400K (50% of capital)
Effective APR: ~18%

RBF providers (UK):
- Uncapped, Pipe, Capchase, Clearco
- Each has different terms and focus

**Bank credit facilities**

Revolving credit line:

What it is:
- Pre-approved borrowing limit
- Draw down and repay as needed
- Only pay interest on amount drawn

Typical terms:
- Facility size: Based on revenue and assets
- Interest: Bank base rate + 2-5% (currently 6-10%)
- Commitment fee: 0.25-0.5% on undrawn amount
- Term: 12-36 months, renewable

Example:

£500K revolving facility at base rate + 3% (8% total):
- Draw £200K for 3 months
- Interest: £200K × 8% × 3/12 = £4K
- Repay £200K after 3 months
- Total cost: £4K

Use cases:
- Smooth out lumpy cash flow
- Fund seasonal marketing spend
- Bridge between customer payments
- Working capital during growth

Requirements:
- Usually need 12+ months trading history
- Recurring revenue base
- Personal guarantees may be required (early stage)
- Financial covenants (revenue targets, cash minimums)

**Comparing financing options**

| Feature | Venture debt | RBF | Bank credit | Equity |
|---|---|---|---|---|
| Amount | £1-10M | £200K-2M | £100K-1M | £2M+ |
| Cost | 8-14% + warrants | 15-30% effective | 6-10% | 20-30% dilution |
| Dilution | 0.1-0.5% | None | None | 15-30% |
| Term | 3-4 years | 2-4 years | 1-3 years | Permanent |
| Requirements | Post-equity round | Strong MRR | Trading history | Growth story |
| Speed | 4-8 weeks | 2-4 weeks | 4-12 weeks | 3-6 months |
| Board seat | No | No | No | Usually yes |
| Covenants | Light | Revenue share | Financial | Investor rights |

Decision framework:

Need £500K for marketing with 6-month payback:
→ RBF or bank credit (cheap, fast, no dilution)

Need £3M to extend runway 6 months before Series B:
→ Venture debt (sized right, extends runway)

Need £10M for major product build with uncertain ROI:
→ Equity (long-term investment, uncertain payback)

Need £200K for seasonal cash flow gap:
→ Revolving credit (cheapest, most flexible)

**Debt covenants and risks**

Common covenants:

Financial covenants:
- Minimum cash balance (e.g., must maintain £500K)
- Revenue growth targets (e.g., MRR must not decline >10%)
- Maximum burn rate (e.g., net burn <£200K/month)
- Debt service coverage ratio (revenue / debt payments > 1.5x)

Reporting covenants:
- Monthly financial statements
- Quarterly board packages
- Annual audited accounts
- Prompt notification of material events

Negative covenants:
- No additional debt without consent
- No dividends or distributions
- No change of control without consent
- Asset disposal restrictions

Risks of debt:

Risk 1: Cash flow squeeze
- Debt payments reduce available cash
- If revenue drops, payments become difficult
- Example: £150K/month payments on £300K MRR = 50% of revenue

Risk 2: Covenant breach
- Breaching covenant triggers default provisions
- Lender can accelerate repayment (demand full balance)
- Can force renegotiation at worse terms

Risk 3: Down round interaction
- If raising equity at lower valuation while debt outstanding
- Venture debt lender may have acceleration rights
- Complicates fundraising negotiations

Risk 4: Personal guarantees
- Some early-stage debt requires founder personal guarantee
- Significant personal financial risk
- Negotiate to remove as company grows

**Best practices**

1. Time venture debt with equity round:
- Negotiate venture debt during/after equity close
- Best terms when you have fresh cash and strong position

2. Size appropriately:
- Don't over-lever (debt payments shouldn't exceed 10-15% of revenue)
- Keep debt-to-equity ratio reasonable (<0.5x)

3. Use for specific purposes:
- Earmark debt capital for specific ROI initiatives
- Track return on borrowed capital separately

4. Maintain cushion:
- Keep 3+ months cash after debt payments
- Don't draw full facility unless needed

5. Plan repayment:
- Model debt service in cash flow forecasts
- Ensure revenue growth covers increased payments
- Have contingency if growth slows

`
      }
    ],
    relatedSlugs: ["fundraising-and-investor-relations", "cash-flow-forecasting-and-treasury", "cash-flow-management-and-working-capital", "financial-planning-and-budgeting", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "What is venture debt and when should I use it?", a: "Venture debt is a term loan (25-35% of last equity round) from specialist lenders. Cost: 8-14% interest + 0.1-0.5% warrants. Use it to: extend runway 3-6 months between equity rounds, fund specific growth initiatives with known ROI, or bridge to profitability. Don't use it to cover ongoing losses. Example: £10M Series A → £3M venture debt at 10% + 0.25% warrants." },
      { q: "How does revenue-based financing work?", a: "RBF: Borrow 3-6x MRR, repay as fixed % of monthly revenue (5-10%) until reaching 1.3-1.8x repayment multiple. Example: £200K MRR → £800K capital, repay 8% of revenue until £1.2M repaid (~40 months). Effective APR: 15-30%. No dilution, no board seats. Best for: Strong MRR, known use of funds. Providers: Uncapped, Pipe, Capchase." },
      { q: "Should I use debt or equity financing?", a: "Debt if: Payback <18 months, specific ROI project, want to avoid dilution. Equity if: Uncertain outcomes, long time horizon, need large amount (>£5M), funding operating losses. Rule: Never use debt to fund ongoing losses without path to profitability. Venture debt costs 8-14% vs 20-30% equity dilution. RBF costs 15-30% APR. Bank credit costs 6-10%." }
    ],
    videoUrl: ""
  }
];

export default batch371Articles;
