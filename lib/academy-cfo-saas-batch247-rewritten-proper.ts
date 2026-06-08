import { AcademyArticle } from "@/types/academy";

export const batch247Articles: AcademyArticle[] = [
  {
    slug: "contract-negotiation-and-terms-optimization",
    title: "Contract Negotiation and Terms Optimization: Improving Deal Terms",
    description: "Master contract negotiation. Optimize terms, improve unit economics, lock revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["contract negotiation", "terms optimization", "contract terms", "payment terms", "multi-year", "deal terms", "negotiation strategy"],
    keyTakeaways: [
      "Contract fundamentals: Optimize for cash and predictability (not just ACV). Key terms: Contract length (1 vs 2 vs 3 years), payment (upfront vs monthly vs arrears), price locks (lock price X years?), termination (how easy to cancel?). Example: 3-year deal, annual upfront payment (cash collected upfront, easier to retain because switching cost higher), price locked (no increases, customer confident), termination for convenience (easy to cancel = riskier). Tradeoff: Easier terms (monthly, cancel anytime) = lose upfront cash and customer commitment. Harder terms (3-year, upfront, locked) = get cash upfront but lose some customers (churn on smaller deals).",
      "Payment term optimization: Upfront (collect 100% year 1, improve cash flow, improve retention because sunken cost). Monthly (less commitment, easier to get customers, but cash flow worse). Annual upfront (collect £1M immediately = immediate cash, no DPO impact, customer more committed = lower churn). Impact: Enterprise deal £500K/year. Monthly pay = £500K/month collect. Annual upfront = £500K immediate (4 months faster). For company: Accelerates payback (cash now vs spread 12 months). For customer: Better discount (1-2% discount for annual = trade upfront payment for discount). ROI: 2% discount = £10K cost, gain £500K upfront (improve cash flow) = net positive.",
      "Multi-year optimization: Lock revenue (reduce churn risk, improve predictability). Price locks (customer wants no increase certainty, company wants leverage). Example: 3-year deal £500K/year, price locked (£1.5M commitment, no increase). ROI: Customer less likely to churn (sunk cost, switching cost), company gets committed revenue. Cost: Lose pricing leverage (can't raise prices). Tradeoff: Lock 70% of customers at year-ago pricing, allow 30% month-to-month at current pricing (higher churn, but higher price). Net: Some revenue locked, some flexible."
    ],
    content: [
      {
        heading: "Contract Negotiation and Deal Optimization",
        body: `Structuring deals for better cash and retention.

**Key contract terms**

| Term | Option A (customer-friendly) | Option B (company-friendly) |
|---|---|---|
| Length | 1 year, cancel anytime | 3 year, 90 day exit notice |
| Payment | Monthly in arrears | Annual upfront |
| Price | Increase 10% yearly | Price locked 3 years |
| Term | Easy exit | Commitment |
| Support | Community forum | Dedicated support included |

Negotiation approach:
- Offer multiple options (customer chooses)
- Bundle terms (if customer wants easy exit, charge more)
- Example: Month-to-month + pay monthly = 10% higher price (cost of flexibility)

**Payment term strategies**

Monthly in arrears (weakest position):
- Customer pays £42K/month (£500K / 12)
- Company receives month-to-month (customer can cancel anytime)
- Cash flow: Spread 12 months
- Churn: Easy to cancel (high churn risk)

Monthly upfront:
- Customer pays £42K/month upfront
- Company receives monthly (still month-to-month contract)
- Cash flow: Slightly better (prepay 1 month)
- Churn: Still high

Annual upfront:
- Customer pays £500K upfront
- Company receives immediately (year 1 cash)
- Cash flow: Best (immediate £500K)
- Churn: Lower (customer invested, sunken cost)
- Incentive: Offer 1-2% discount (£5-10K discount for upfront = worth it for company)

Example value:
- Annual upfront at 2% discount: Customer pays £490K upfront = £10K discount
- Company benefit: Get £490K cash immediately (4 months faster than monthly)
- Payback: 2% discount cost (£10K) worth it for £490K upfront cash (25% net benefit)

**Multi-year contracts**

Benefits:
- Locked revenue (customer committed, less churn)
- Predictability (forecast 3 years ahead)
- Price locks (customer certainty, company sacrifice pricing power)
- LTV improvement (customer stays longer = higher LTV)

Negotiation:
- 1-year: Standard terms
- 2-year: 2-3% discount (for commitment)
- 3-year: 5% discount (longer commitment, better deal for customer)

Example:
- 1-year: £500K (standard)
- 2-year: £500K × 0.97 = £485K/year (£970K total, £30K discount)
- 3-year: £500K × 0.95 = £475K/year (£1.425M total, £75K discount)

ROI: 3-year locked deal (even with 5% discount) = retain customer 3 years (unlikely to churn = 50%+ lower churn probability). Discount cost: £75K, churn reduction value: £500K + expansion opportunity = 10x+ payback.

**Termination and exit clauses**

Easy exit (customer-friendly):
- Cancel anytime (month-to-month)
- Risk: High churn (easy to leave)

90-day notice:
- Customer can cancel, but 90-day notice
- Middle ground (some commitment, not locked)

Locked term:
- Can't cancel until term end (unless bankruptcy, etc.)
- Company-friendly (customer committed)

Combined with payment:
- Annual upfront + 90-day exit: Balanced (customer paid upfront, but can exit)
- 3-year locked + annual upfront: Company-strong (locked revenue, upfront cash)

`
      }
    ],
    relatedSlugs: ["cash-flow-management-and-working-capital", "subscription-billing-models-and-pricing-architecture", "customer-concentration-risk-and-mitigation"],
    faq: [
      { q: "What payment terms should I offer?", a: "Best for company: Annual upfront (cash now). Best for customer: Monthly in arrears (flexibility). Typical: Annual upfront with 1-2% discount (trade discount for cash). Example: £500K deal, offer 2% discount (£10K) for annual upfront = win-win (customer saves money, company gets cash). Medium: Monthly upfront (customer prepays 1 month)." },
      { q: "Should I lock prices in multi-year deals?", a: "Lock pros: Customer certainty, commitment (lower churn). Lock cons: Lose pricing leverage (can't raise prices). Strategy: Lock 70% of revenue (committed, long-term), 30% month-to-month (flexibility, adjust pricing). Or: Offer 3-year lock at 5% discount vs annual without lock (customer choice)." },
      { q: "How do I negotiate better contract terms?", a: "1. Offer options (customer chooses). 2. Bundle terms (easy exit = higher price). 3. Incentivize annual (discount for upfront). 4. Lock pricing for long-term (discount for multi-year). 5. Lock revenue (lower churn risk). Example: Annual upfront at 2% discount + 3-year lock at 5% discount = stronger position than monthly in arrears." }
    ],
    videoUrl: ""
  }
];

export default batch247Articles;