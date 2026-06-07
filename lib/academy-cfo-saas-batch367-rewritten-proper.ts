import { AcademyArticle } from "@/types/academy";

export const batch367Articles: AcademyArticle[] = [
  {
    slug: "equity-compensation-and-stock-options",
    title: "Equity Compensation and Stock Options: Structuring Employee Ownership",
    description: "Master equity compensation. Structure option pools, manage dilution, align team incentives.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["equity compensation", "stock options", "EMI options", "dilution", "option pool"],
    keyTakeaways: [
      "EMI options (Enterprise Management Incentives): UK tax-advantaged scheme for companies with <£30M gross assets. Employees pay no income tax on exercise (if exercised at or above grant price). Capital gains tax only on sale (currently 20%). Example: Grant 10,000 options at £1, exercise at £1, sell at £10 = £90K gain taxed at 20% = £18K tax. Without EMI: £90K taxed as income at 45% = £40.5K tax. Saving: £22.5K per employee.",
      "Option pool sizing: Standard is 10-15% of fully diluted shares reserved for employees. Series A: 10-15% pool (refreshed at each round). Series B: Additional 5-10%. Example: 10M shares outstanding, 15% pool = 1.5M options available. Allocation: CTO 1-2%, VP-level 0.5-1%, senior engineer 0.1-0.25%, mid-level 0.05-0.1%. Vesting: 4-year vesting with 1-year cliff (standard).",
      "Dilution management: Each funding round dilutes existing shareholders. Example: Pre-Series A founders own 100% (10M shares). Series A: Issue 3.3M new shares (25% to investors). Post-money: 13.3M shares, founders own 75%. Series B: Issue 4.4M shares (25% to investors). Post-money: 17.7M shares, founders own 56%. Track dilution per round and cumulative. Option pool comes from existing shareholders (pre-money) not new investors."
    ],
    content: [
      {
        heading: "Structuring Equity Compensation for SaaS Teams",
        body: `Designing option plans that attract talent and align incentives.

**EMI options (UK tax-advantaged scheme)**

Eligibility:

Company requirements:
- Gross assets under £30M
- Fewer than 250 employees
- Trading company (not investment company)
- Must be independent (not subsidiary of large group)

Employee requirements:
- Must work at least 25 hours/week (or 75% of working time)
- Cannot hold more than 30% of shares
- Each employee can hold up to £250K worth of options (at grant)

Tax treatment:

At grant:
- No tax (no income tax, no NI)
- Must notify HMRC within 92 days of grant

At exercise:
- No income tax (if exercise price ≥ market value at grant)
- No employer NI
- Example: Grant at £1, exercise at £1 = no tax event

At sale:
- Capital gains tax on gain (sale price - exercise price)
- Business Asset Disposal Relief may apply (10% rate on first £1M)
- Example: Exercise at £1, sell at £10 = £9 gain per share
- 10,000 shares × £9 = £90K gain
- With BADR: £90K × 10% = £9K tax
- Without BADR: £90K × 20% = £18K tax

Comparison with unapproved options:

Unapproved options:
- Income tax on exercise (difference between market value and exercise price)
- Employer NI on exercise (13.8%)
- Then CGT on subsequent gain

Example comparison (10,000 options, grant £1, exercise £1, sell at £10):

EMI:
- Exercise: £0 tax
- Sale: £90K × 10% (BADR) = £9K tax
- Total: £9K

Unapproved:
- Exercise: (£10 - £1) × 10,000 = £90K income
- Income tax: £90K × 45% = £40.5K
- Employer NI: £90K × 13.8% = £12.4K (company pays)
- Total: £52.9K

EMI saving: £43.9K per employee

**Option pool design**

Pool sizing by stage:

Pre-seed/Seed:
- Reserve: 10-15% of fully diluted shares
- Typically for first 5-10 hires
- Example: 10M shares, 1.5M in pool (15%)

Series A:
- Top up to 15% (or create fresh 10-15%)
- Refresh pool as part of funding round
- Example: Post-money 13.3M shares, 15% pool = 2M options

Series B:
- Additional 5-10% refresh
- Example: Post-money 17.7M shares, 7% refresh = 1.24M new options

Series C+:
- 3-5% refresh per round
- Pool gets harder to refresh (more dilutive)

Allocation guidelines:

C-suite (CTO, CFO, COO):
- 1-3% each (founding CTO higher)
- Example: CTO joining at Series A = 1.5-2%
- On 13.3M shares: 2% = 266K options

VP level:
- 0.25-1% each
- Example: VP Engineering at Series A = 0.5%
- On 13.3M shares: 0.5% = 66.5K options

Director level:
- 0.1-0.25% each
- Example: Director of Product = 0.15%
- On 13.3M shares: 0.15% = 20K options

Senior individual contributor:
- 0.05-0.15% each
- Example: Senior Engineer = 0.1%
- On 13.3M shares: 0.1% = 13.3K options

Mid-level:
- 0.02-0.05% each
- Example: Mid-level Engineer = 0.03%
- On 13.3M shares: 0.03% = 4K options

Junior:
- 0.01-0.02% each
- Example: Junior Developer = 0.01%
- On 13.3M shares: 0.01% = 1.3K options

**Vesting schedules**

Standard vesting:

4-year vesting with 1-year cliff:
- Year 1: 25% vests at 1-year anniversary (cliff)
- Years 2-4: Monthly vesting (1/48 per month)
- If leave before 1 year: 0 options vest

Example:

Grant: 48,000 options
- Month 1-11: 0 vested
- Month 12 (cliff): 12,000 vest (25%)
- Month 13: 12,750 (another 750)
- Month 24: 24,000 (50%)
- Month 36: 36,000 (75%)
- Month 48: 48,000 (100%)

Alternative vesting:

Back-weighted vesting:
- Year 1: 10%, Year 2: 20%, Year 3: 30%, Year 4: 40%
- Used by some large companies to retain talent longer

Milestone-based vesting:
- Vest on achievement of specific goals
- Example: 25% on product launch, 25% on £1M ARR, etc.

Acceleration clauses:

Single trigger acceleration:
- All options vest on change of control (acquisition)
- Less common (investors dislike)

Double trigger acceleration:
- Options vest if: (1) Change of control AND (2) Employee terminated within 12 months
- More common and investor-friendly
- Protects employees from being fired post-acquisition

**Dilution tracking**

Cap table management:

Pre-funding example:

| Shareholder | Shares | % |
|---|---|---|
| Founder A | 5,000,000 | 50% |
| Founder B | 3,000,000 | 30% |
| Option pool | 2,000,000 | 20% |
| Total | 10,000,000 | 100% |

Post-Series A (25% to investors):

| Shareholder | Shares | % |
|---|---|---|
| Founder A | 5,000,000 | 37.5% |
| Founder B | 3,000,000 | 22.5% |
| Option pool | 2,000,000 | 15.0% |
| Series A investors | 3,333,333 | 25.0% |
| Total | 13,333,333 | 100% |

Post-Series B (25% to new investors):

| Shareholder | Shares | % |
|---|---|---|
| Founder A | 5,000,000 | 28.1% |
| Founder B | 3,000,000 | 16.9% |
| Option pool (refreshed) | 2,666,667 | 15.0% |
| Series A investors | 3,333,333 | 18.8% |
| Series B investors | 3,777,778 | 21.2% |
| Total | 17,777,778 | 100% |

Dilution per round:

Founder A dilution:
- Pre-funding: 50%
- Post-Series A: 37.5% (25% dilution)
- Post-Series B: 28.1% (25% dilution)
- Cumulative dilution: 43.8%

Anti-dilution protection:
- Investors typically get anti-dilution (weighted average or full ratchet)
- Founders and employees do NOT get anti-dilution
- Down round impact: Investors get more shares, founders diluted further

**409A / market value considerations**

Setting exercise price:

EMI requirement:
- Exercise price must be agreed with HMRC
- Typically at current market value (or above)
- HMRC valuation: Submit on Form Val 231

Valuation methods:
- Discounted cash flow (DCF)
- Comparable company analysis
- Recent funding round price (with appropriate discount)
- Net asset value (for early-stage)

Discount for illiquidity:
- Private company shares are illiquid
- Typical discount: 20-40% from last round price
- Example: Series A price £5/share, EMI exercise price £3-4/share

**Communicating equity to employees**

What employees need to understand:

1. Number of options (not just % — meaningless without context)
2. Current share price / last valuation
3. Total shares outstanding (to calculate %)
4. Vesting schedule
5. Exercise price
6. Tax treatment (EMI vs unapproved)
7. What happens on exit (acquisition / IPO)

Example scenario for employee:

Grant: 10,000 EMI options at £2 exercise price
Company valuation: £20M (10M shares at £2/share)
Your ownership: 0.1% (10K / 10M)

If company sells for £100M:
- Your shares worth: 0.1% × £100M = £100K
- Less exercise cost: 10K × £2 = £20K
- Gain: £80K
- Tax (BADR): £80K × 10% = £8K
- Net: £72K

If company sells for £500M:
- Your shares worth: 0.1% × £500M = £500K
- Less exercise cost: £20K
- Gain: £480K
- Tax: Complex (BADR on first £1M, then 20% CGT)
- Approximate net: ~£400K

`
      }
    ],
    relatedSlugs: ["hiring-and-team-building-economics", "fundraising-and-investor-relations", "financial-planning-and-budgeting", "sales-compensation-and-incentive-structures", "operating-expense-management-and-control"],
    faq: [
      { q: "What are EMI options and why use them?", a: "EMI (Enterprise Management Incentives) are UK tax-advantaged stock options for companies with <£30M gross assets. No income tax on exercise (if at/above grant price), only CGT on sale. With Business Asset Disposal Relief: 10% on first £1M gain. Example: £90K gain = £9K tax (vs £40.5K without EMI). Saving of £30K+ per employee. Must notify HMRC within 92 days of grant." },
      { q: "How large should the option pool be?", a: "Standard: 10-15% of fully diluted shares. Seed: 10-15% (first 5-10 hires). Series A: Refresh to 15%. Series B: Add 5-10%. Allocation: CTO 1-2%, VP 0.5-1%, senior IC 0.1-0.15%, mid-level 0.03-0.05%. Standard vesting: 4 years with 1-year cliff. Pool comes from pre-money (existing shareholders), not new investors." },
      { q: "How does dilution work across funding rounds?", a: "Each round dilutes existing shareholders proportionally. Example: Founders own 100% pre-funding. Series A (25% to investors): founders now own 75%. Series B (25% more): founders own ~56%. Cumulative dilution ~44%. Investors typically get anti-dilution protection; founders/employees do not. Track dilution on cap table after each round." }
    ],
    videoUrl: ""
  }
];

export default batch367Articles;
