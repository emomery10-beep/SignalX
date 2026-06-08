import { AcademyArticle } from "@/types/academy";

export const batch252Articles: AcademyArticle[] = [
  {
    slug: "revenue-recognition-and-accounting-standards",
    title: "Revenue Recognition and Accounting Standards: Getting Finance Right",
    description: "Master accounting. Understand ASC 606, recognize revenue correctly, manage reporting.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["revenue recognition", "ASC 606", "accounting standards", "deferred revenue", "GAAP", "financial reporting", "revenue accounting"],
    keyTakeaways: [
      "ASC 606 fundamentals: Revenue recognition principle - recognize revenue when performance obligation satisfied (deliver product/service). For SaaS: Recognize monthly as customer uses product (not upfront). Example: £1,000/month contract, recognize £1,000/month (not £12,000 upfront). Deferred revenue (liability): Customer pays upfront (say £12,000 annual), but revenue only recognized as delivered. Balance sheet impact: Cash £12,000 (asset), deferred revenue £12,000 (liability). As months pass: Recognize £1,000 revenue, deferred revenue decreases £1,000. Impact: ARR vs revenue (ARR = annualized, revenue = recognized this period). Investor metric: Use ARR for growth (measure), but financial statements use revenue (accounting rule).",
      "Deferred revenue mechanics: Upfront payment = deferred revenue (balance sheet liability). Monthly recognition = revenue (income statement). Example: Customer pays £12K upfront (annual). Dec revenue: £1K (1 month), deferred rev £11K. Jan: revenue £1K, deferred rev £10K. Impact on cash: Get cash upfront (good for cash flow), but revenue recognized monthly (good for accounting). Cash ≠ Revenue (don't confuse). Implication: Company with upfront contracts = high cash but recognized revenue lags (billing period vs recognition period).",
      "Accounting implications: Multiple performance obligations (SaaS + support = separate obligations, recognize separately). Contract modifications (upgrade mid-year = adjust revenue recognition). Returns and allowances (refunds = reduce revenue). Tax implications: Revenue recognition affects tax (recognize when paid vs when earned, jurisdiction-specific). Hire: Accountant or firm (£5-20K/year) to manage ASC 606, tax, audit. Investor requirement: Clean accounting (audited financials, ASC 606 compliance) before Series B (investors need confidence in numbers)."
    ],
    content: [
      {
        heading: "Revenue Recognition under ASC 606",
        body: `Understanding subscription accounting.

**ASC 606 five-step model**

1. Identify the contract (customer, product, price, term)
2. Identify performance obligations (what are we delivering?)
3. Determine transaction price (how much paid?)
4. Allocate price to performance obligations (if multiple)
5. Recognize revenue when obligation satisfied

SaaS example:
- Contract: Customer, SaaS platform, £1,000/month, 12-month term
- Performance obligation: Provide access to platform (satisfied monthly)
- Price: £1,000
- Allocation: 100% to platform access
- Recognition: £1,000/month (as customer uses platform)

**Deferred revenue accounting**

Journal entry (customer pays annually upfront):
- Cash: £12,000 (debit)
- Deferred revenue: £12,000 (credit, liability)

Each month (recognize revenue):
- Deferred revenue: £1,000 (debit, reduce liability)
- Revenue: £1,000 (credit, income statement)

Balance sheet impact:
| Month | Cash | Deferred revenue | % recognized |
|---|---|---|---|
| Jan (paid) | £12,000 | £12,000 | 0% |
| Jan (recognize) | £12,000 | £11,000 | 8% |
| Feb | £12,000 | £10,000 | 17% |
| Jun | £12,000 | £6,000 | 50% |
| Dec | £12,000 | £0 | 100% |

Key point: Cash ≠ Revenue
- Cash collected: £12,000 upfront
- Revenue recognized: £1,000/month (even though received upfront)

**Impact on financial statements**

P&L impact:
- Year 1: Recognize 12 months revenue (even if some paid in year 2)
- Example: Dec pays for Jan-Dec next year = Jan revenue next year (not current year)

Cash flow impact:
- Upfront payment improves cash position (get cash immediately)
- Revenue lags cash by contract period
- Example: Annual upfront customers = cash up 50%, revenue same

Investor focus:
- Growth metric: ARR (annualized, all contracts regardless of payment)
- Accounting metric: Revenue (recognized per ASC 606)
- Typical: ARR 20% growth, Revenue 15% growth (lag due to recognition timing)

**Implementation tips**

Documentation:
- Contract terms (price, duration, obligations)
- Performance obligation (when is customer obligation satisfied?)
- Recognition policy (monthly, upfront, etc.)

Systems:
- Track deferred revenue by customer/contract
- Automate monthly recognition
- Tools: NetSuite (ERP, handles ASC 606), Stripe (integrates with accounting)

Audit:
- Accountant reviews (for Series B, need audited financials)
- Review for: Contract terms, recognition timing, tax implications
- Cost: £5-20K/year (accountant/firm)

Common mistakes:
- Recognize upfront (non-compliant)
- Confuse cash and revenue (different concepts)
- Miss multiple obligations (should separate)
- Ignore tax implications (timing impacts taxes)

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "cash-flow-management-and-working-capital", "subscription-billing-models-and-pricing-architecture"],
    faq: [
      { q: "How do I recognize SaaS revenue?", a: "Monthly as customer uses platform (ASC 606 compliant). Customer pays upfront = deferred revenue (liability) → recognize monthly (asset/revenue). Example: £12K annual contract = recognize £1K/month, not £12K upfront. Impact: Cash and revenue differ (cash upfront, revenue monthly). Investor metric: ARR. Accounting metric: Revenue (recognized)." },
      { q: "What's deferred revenue?", a: "Liability on balance sheet = customer paid upfront but we haven't delivered. As we deliver (monthly), reduce deferred revenue and recognize revenue. Example: Customer pays £12K upfront → deferred revenue £12K → recognize £1K/month → after 12 months, deferred revenue = £0." },
      { q: "Do I need an accountant for ASC 606?", a: "Yes, if raising money (Series A+). Investors require clean accounting and ASC 606 compliance. Cost: £5-20K/year (accountant or firm). Must-haves: ASC 606 compliant revenue recognition, deferred revenue tracking, audit-ready financials (for Series B)." }
    ],
    videoUrl: ""
  }
];

export default batch252Articles;