import { AcademyArticle } from "@/types/academy";

export const batch287Articles: AcademyArticle[] = [
  {
    slug: "debt-financing-and-credit-facilities",
    title: "Debt Financing and Credit Facilities: Leverage Without Dilution",
    description: "Master debt financing. Access credit, understand terms, manage debt responsibly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["debt financing", "credit facility", "venture debt", "term loan", "interest rates", "non-dilutive funding"],
    keyTakeaways: [
      "Debt vs equity: Debt = borrowed money (repay with interest, no dilution), Equity = investor ownership (dilutes founders, no repayment). Debt best for: Predictable revenue (SaaS ideal), near breakeven (leverage profit), extending runway. Equity best for: Pre-revenue, rapid growth, need investor expertise. Typical structure: Venture debt (£500K-£2M) + equity round (Series A/B). Cost: 10-14% interest (vs 30% equity dilution). Benefit: Extend runway 12-18 months, bridge to next round, less founder dilution.",
      "Types of debt: Revenue-based financing (repay % of revenue), term loans (fixed monthly payment), venture debt (secured by investor commitment), lines of credit (borrow as needed). Revenue-based best for: Predictable SaaS (repay 3-8% revenue until 1.5x borrowed). Term loans best for: Strong financials, can service debt. Venture debt best for: Backing up equity raise (£2M equity = £500K-1M venture debt). Cost: RBF 6-10% annualized equivalent, term loans 10-14% APR, venture debt 12-15%.",
      "Debt planning: Calculate capacity (can we service payments?), repayment timeline (monthly payments vs milestone-based), triggers (covenants, defaults). Example: £10M ARR SaaS with 70% gross margin = £7M gross profit. £500K venture debt at 12% = £60K annual interest (less than 1% of profit, manageable). Risk: Over-leverage (too much debt, hard to service), growth slowdown (payments become burden), default (if revenue drops). Strategy: Conservative (only when near breakeven), monitored (track debt-to-revenue ratio)."
    ],
    content: [
      {
        heading: "Understanding Debt Financing for SaaS",
        body: `Accessing capital without equity dilution.

**Types of debt financing**

Revenue-based financing (RBF):
- Structure: Lend £500K, repay until £750K (1.5x) is returned
- Payment: Monthly % of revenue (3-8% typical)
- Advantage: No fixed payment, scales with business
- Cost: 6-10% annual equivalent interest
- Example: £100K/month revenue, 5% RBF, £5K/month payment
- Duration: Until 1.5x repaid (could be 18-36 months)

Venture debt:
- Structure: Traditional loan with fixed payment
- Amount: Usually £250K-£2M
- Tied to: Next equity round (investors guarantee)
- Cost: 12-15% APR
- Example: £500K venture debt, 24-month term, ~£23K/month payment
- Advantage: Backs up equity round (lender comfortable because equity coming)

Term loans:
- Structure: Bank loan, fixed payment, fixed term
- Amount: £100K-£1M (depends on creditworthiness)
- Cost: 10-14% APR
- Term: 3-5 years typical
- Qualification: Require strong financials, asset backing
- Best for: Growth-stage SaaS with predictable revenue

Lines of credit:
- Structure: Access up to limit, draw as needed
- Cost: Interest on borrowed amount only
- Advantage: Flexibility (use when need)
- Example: £500K line of credit, only draw £200K, pay interest on £200K

**Debt capacity assessment**

Can you service debt payments?

Formula: (EBITDA or gross profit) / Debt service = Debt service ratio
- Healthy ratio: >1.5x (profit 1.5x larger than debt payments)
- Example: £10M revenue SaaS, 70% gross margin = £7M gross profit
  - £500K venture debt, 12% APR = £60K/year interest (~5K/month)
  - Debt service ratio: £7M / £60K = 116x (very healthy)

Scenario analysis:

| Stage | Revenue | Gross Margin | Gross Profit | Max Debt | Annual Interest | Burden |
|---|---|---|---|---|---|---|
| Early (£1M) | £1M | 60% | £600K | £200K | £24K (4%) | Manageable |
| Growth (£5M) | £5M | 70% | £3.5M | £1M | £120K (3%) | Comfortable |
| Scale (£20M) | £20M | 75% | £15M | £3M | £360K (2%) | Easy |

**Debt vs equity decision framework**

Choose debt if:
- Predictable revenue (SaaS fits)
- Near profitability (can service payments)
- Don't need investor expertise
- Want to minimize dilution
- Have 12+ months runway

Choose equity if:
- Unpredictable revenue (pre-product)
- Burning heavily (can't service debt)
- Need investor board seat, network
- Raising for growth (equity has better terms)
- Want to hire investors as advisors

Combination (most common for growth-stage):
- Series B: £5M equity + £1M venture debt
- Use equity for product, team, growth
- Use debt to extend runway, bridge expenses

Example comparison:

| Metric | Equity Only | Debt + Equity | Difference |
|---|---|---|---|
| Capital raised | £5M equity | £5M equity + £1M debt | +£1M runway |
| Founder dilution | 25% | 20% (estimated) | -5% less dilution |
| Annual cost | £0 (no payments) | £150K (debt service) | Manageable from profit |
| Control | Diluted 25% | Less diluted (20%) | Retained more equity |

**Debt terms and covenants**

Key terms:
- Principal: Amount borrowed (£500K)
- Interest rate: 12% APR (example)
- Term: 24 months (example)
- Monthly payment: ~£23K (principal + interest)
- Maturity date: When loan fully repaid

Covenants (conditions lender enforces):
- Minimum revenue (must maintain)
- Maximum burn rate (can't exceed)
- Debt-to-revenue ratio (must stay below)
- Financial reporting (monthly financials)
- Collateral (what secures loan)

Default triggers:
- Miss payment (usually 30 days grace)
- Revenue drops below covenant
- Debt-to-revenue ratio exceeds limit
- Violate covenants
- Consequence: Lender can demand immediate repayment

**Debt management best practices**

Timing:
- Raise before desperate (not when runway = 3 months)
- Ideal: 12+ months runway remaining
- Earlier = better terms (lower interest, larger amounts)

Amount:
- Conservative: 2-3x annual cash burn (safe repayment)
- Moderate: 4-6x annual burn (stretching comfort)
- Aggressive: 8-12x annual burn (risky, may not qualify)
- Example: £50K/month burn = £600K/year = borrow £2-3M maximum

Monitoring:
- Monthly: Track debt-to-revenue ratio
- Track: Are payments manageable?
- Assess: How's business tracking vs covenant requirements?
- Plan: Will you hit milestones (revenue targets) to justify debt?

When to refinance:
- Interest rate drops (refinance at lower rate)
- Revenue increases (qualify for larger facility)
- Approaching maturity (extend before due)
- Problems arising (talk to lender early, don't hide)

`
      }
    ],
    relatedSlugs: ["cash-flow-management-and-working-capital", "cash-runway-and-burn-rate-management", "financial-planning-and-budgeting", "building-investor-relationships-and-follow-on-rounds", "risk-management-and-contingency-planning"],
    faq: [
      { q: "Should I use debt or equity to raise capital?", a: "Debt: Better if predictable revenue (SaaS), near breakeven, want less dilution. Cost ~12% APR. Equity: Better if unpredictable, need investor expertise, burning heavily. Cost ~25-30% dilution. Ideal: Use both. Debt extends runway, equity fuels growth." },
      { q: "Can my SaaS company qualify for venture debt?", a: "Yes, if: £1M+ ARR, predictable revenue, positive unit economics, backing from equity investor (usually required). Typical size: £250K-£2M. Cost: 12-15% APR. Process: 2-4 weeks (faster than equity). Terms: 24-36 month repayment." },
      { q: "How much debt can I safely take on?", a: "Max debt = 3-6x annual cash burn (conservative to moderate). Example: £50K/month burn (£600K/year) = borrow £2-3M max. Test: Will gross profit cover debt payments easily? If yes, safe. If no, risky. Monitor monthly: Debt-to-revenue ratio should stay below 0.5." }
    ],
    videoUrl: ""
  }
];

export default batch287Articles;