import { AcademyArticle } from "@/types/academy";

export const batch98Articles: AcademyArticle[] = [
  {
    slug: "equity-dilution-stock-options",
    title: "Equity Dilution and Stock Options: Managing Ownership and Employee Incentives",
    description: "Understand equity dilution, option pools, and stock compensation. Calculate dilution impact and design option programs effectively.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "equity dilution",
      "stock options",
      "option pool",
      "capitalization table",
      "fully diluted shares",
      "vesting",
      "strike price",
      "stock compensation",
      "employee ownership",
      "option grants"
    ],
    keyTakeaways: [
      "Equity dilution occurs when new shares are issued, reducing your ownership percentage; example: founder owns 100% of 10M shares; raises £10M at £1/share valuation, 10M new shares issued; new dilution: founder now owns 10M ÷ 20M = 50% (diluted from 100%); each funding round dilutes existing shareholders; carefully track cap table (capitalization table showing all shares, options, and ownership)",
      "Option pool reserves shares for employees; typical: 10-20% of fully diluted shares reserved for option pool; if 50M total shares and 10% pool = 5M shares available for employees; vesting schedule common: 4-year vest with 1-year cliff (if employee leaves year 1, lose all options; after year 1, vested monthly); strike price usually £0 (or nominal, like £0.00001) so employees only pay taxes on appreciation",
      "Fully diluted shares = all outstanding shares + all option pool + all convertible securities; matters for ownership %, investor meetings, and exit outcomes; example: 100M outstanding shares, 15M option pool, 5M convertible notes = 120M fully diluted; if you own 10M shares, you own 10M ÷ 120M = 8.3% fully diluted (vs 10M ÷ 100M = 10% on-the-books)"
    ],
    content: [
      {
        heading: "Understanding Equity Dilution",
        body: `Equity dilution occurs when a company issues new shares, reducing the ownership percentage of existing shareholders.

**Simple Dilution Example**

Founder's stake before funding round:

Company capitalization:
- Total shares: 10M
- Founder shares: 10M (100% ownership)
- Valuation: £10M (implicit, based on later rounds)

Series A funding round:

New investor invests £10M at £1/share valuation.
New shares issued: 10M shares

Post-round capitalization:
- Total shares: 20M (10M original + 10M new)
- Founder shares: 10M (same number, but diluted ownership)
- Investor shares: 10M (new)

Ownership dilution:
- Founder ownership: 10M ÷ 20M = 50% (was 100%, now 50%)
- Investor ownership: 10M ÷ 20M = 50%

The founder's ownership percentage dropped from 100% to 50%, even though they still own 10M shares.

Cash impact on founder: None (no cash received, but ownership diluted).
Future exit impact: If company exits at £100M valuation, founder gets 50% × £100M = £50M (vs 100% × £100M = £100M if no dilution).

**Capitalization Table (Cap Table)**

A cap table shows all shares and ownership:

Example pre-Series A:

| Holder | Shares | % Ownership |
|--------|--------|------------|
| Founder 1 | 5M | 50% |
| Founder 2 | 5M | 50% |
| **Total** | **10M** | **100%** |

Example post-Series A (£10M raised at £1/share, 10M new shares):

| Holder | Shares | % Ownership |
|--------|--------|------------|
| Founder 1 | 5M | 25% |
| Founder 2 | 5M | 25% |
| Series A Investor | 10M | 50% |
| **Total** | **20M** | **100%** |

Each founder went from 50% → 25% (diluted).

Why track cap table?
- Understand ownership after each funding round
- Calculate fully diluted ownership (including options)
- Forecast exit proceeds (what each founder gets if company sold)
- Manage option pool allocations

**Fully Diluted vs. Basic Shares**

Basic shares: All issued shares (no options, no convertibles).

Fully diluted shares: All issued shares PLUS all potential shares from options, convertibles, warrants.

Example:

Issued shares: 50M
Employee option pool: 10M (unissued)
Convertible notes (convert to 5M shares): 5M

Basic shares: 50M
Fully diluted shares: 50M + 10M + 5M = 65M

Why it matters:

Example exit at £100M valuation:

If valued on basic shares (50M):
- Price per share: £100M ÷ 50M = £2/share
- Founder ownership (10M shares): £20M

If valued on fully diluted shares (65M):
- Price per share: £100M ÷ 65M = £1.54/share
- Founder ownership (10M shares): £15.4M

The difference (£4.6M) goes to option holders and convertible note holders.

Always negotiate on fully diluted basis, not basic.

**Stock Options and the Option Pool**

An option gives an employee the right to buy company shares at a fixed price (strike price) in the future.

Example option grant:

Grant: 100K options at £0.10 strike price
Vesting: 4-year vest, 1-year cliff

Year 0 (grant date):
- Options granted: 100K
- Vested: 0
- Can exercise: 0
- Employee value: £0 (not yet vested)

Year 1 (cliff):
- Options granted: 100K
- Vested: 25K (1 year of vesting complete)
- Can exercise: 25K
- If exercised at £0.10/share: Employee pays £2.5K, gets 25K shares

Year 2:
- Options granted: 100K
- Vested: 50K (2 years of vesting complete)
- Can exercise: 50K (25K already exercised)
- New shares available: 25K more

Year 4:
- Options granted: 100K
- Vested: 100K (4 years complete, fully vested)
- Can exercise: 100K
- Employee can purchase all 100K shares at £0.10/share

**Why Vesting?**

Vesting aligns employee incentives with company success:

- 1-year cliff: Ensures employee commits 1 year before any options vest
- 4-year vest: Long-term incentive to stay and help company succeed
- Forfeiture: If employee leaves before cliff, loses all options (no vesting)
- Golden handcuffs: Options only valuable if employee stays (encourages retention)

**Option Pool Management**

Company typically reserves 10-20% of fully diluted shares for employee options.

Example:

Post-Series A capitalization:
- Founder shares: 10M
- Series A investor: 10M
- Option pool: 5M (reserved for future employees)
- Total shares: 25M

Option pool size:
- £5M ÷ £25M = 20% (typical for Series A company)

As company grows and issues options:

Year 1: Grant 2M options to first 20 employees (average 100K per employee)
Remaining pool: 5M − 2M = 3M

Year 2: Grant 2M more options to second round of hires
Remaining pool: 3M − 2M = 1M

Once pool runs out, must refresh or dilute existing shareholders to create more options.

**Strike Price**

Strike price: The price at which an option holder can buy shares.

Typical for early-stage SaaS:
- Strike price: £0 or nominal (£0.00001)
- Rationale: Company valuation uncertain, keeps strike low to retain talent

Tax benefit:
- If strike price = £0, employee has no cost basis
- Upon vesting, taxed on FMV (fair market value) at vesting date
- Upon exercise, no additional tax (already paid at vesting)

Later stage (post-Series C):
- Strike price: Recent valuation (e.g., £5/share in Series B)
- Ensures options retain incentive value
- Strike price must be ≥FMV or IRS disallows tax treatment

**Dilution Impact Over Time**

Series A → Series B → Series C progression:

Series A:
- Pre-money: £10M valuation
- Investor invests: £10M at £1/share
- Shares issued: 10M new
- Post-money: £20M valuation

Founder ownership impact:
- Pre-Series A: 100% of 10M = 100%
- Post-Series A: 50% of 20M = 50%
- Dilution: 50%

Series B:
- Pre-money: £40M valuation (company grew)
- Investor invests: £10M at £2/share (price increased)
- Shares issued: 5M new
- Post-money: £50M valuation

Founder ownership impact:
- Pre-Series B: 50% of 20M = 50%
- Post-Series B: 50% of 25M = 40%
- Additional dilution: 10% (from 50% to 40%)
- Cumulative dilution from founding: 60% (from 100% to 40%)

Series C:
- Pre-money: £80M valuation
- Investor invests: £20M at £4/share
- Shares issued: 5M new
- Post-money: £100M valuation

Founder ownership impact:
- Pre-Series C: 40% of 25M = 40%
- Post-Series C: 40% of 30M = 33%
- Additional dilution: 7% (from 40% to 33%)
- Cumulative dilution: 67% (from 100% to 33%)

By Series C, founder typically owns 20-40% (depending on number of rounds and option issuances).

**Managing Dilution**

Strategies to minimize dilution:

1. Bootstrap / Slow growth (avoid capital raises)
   - No dilution, but slower growth
   - Limited to cash flow financing

2. Larger early rounds (raise once, not multiple times)
   - Fewer dilution events
   - But larger single dilution hit

3. Secondary sales (investors buy from founders)
   - Founder gets cash without issuing new shares
   - But gives up ownership (same dilution effect)

4. Convertible notes / SAFEs (delay pricing)
   - Defer dilution to next priced round
   - Timing of dilution pushed out, but eventually occurs

5. Control terms (keep voting control despite ownership dilution)
   - Multi-class shares: Founder keeps high-vote shares, investors get low-vote
   - Board seats: Founder retains board position despite lower ownership %

**Option Value at Exit**

Scenario: Employee with 100K options, strike price £0.10, 4-year vest, 1-year cliff.

After 2 years (50K vested):

Company exit at £50M valuation.

Option value:
- Shares bought: 50K at £0.10 = £5K cost
- Shares worth: 50K × (£50M ÷ fully diluted shares)
- If fully diluted 100M shares: 50K × (£50M ÷ 100M) = 50K × £0.50 = £25K value
- Net gain: £25K − £5K = £20K

Time to exit matters:

If exit at year 3 (75K vested):
- 75K × (£50M ÷ 100M) − 75K × £0.10 = £37.5K − £7.5K = £30K value

If exit at year 1 (25K vested, before cliff):
- £0 value (cliff not reached)

The 1-year cliff is critical — timing of exit relative to cliff can make a £30K difference.

**Cap Table Management**

Best practices:

1. Update cap table after every financing round and option grant
2. Model fully diluted ownership (including unexercised options)
3. Forecast option pool exhaustion (when will you run out?)
4. Plan option pool refresh if needed (propose to investors)
5. Communicate clearly with employees (show option grant value clearly)

Example communication to new hire:

"We're offering 100,000 options at $0.001 strike price. With our current fully diluted shares of 50 million, and assuming a future Series B at a 4x higher valuation, your options could be worth $X at exit."

(Be conservative in projections, but help employee understand potential value.)

Dilution is inevitable in venture-backed companies, but managing it strategically helps align incentives and retain talent.
`
      }
    ],
    relatedSlugs: [
      "funding-and-investment-strategy",
      "saas-valuation-and-multiples",
      "financial-forecasting-modeling",
      "profitability-mechanics",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What's a typical option pool size?",
        a: "10-20% of fully diluted shares. Early-stage 15-20%, later-stage 10%. Make sure to refresh when pool runs low."
      },
      {
        q: "How does dilution affect founders?",
        a: "Each funding round dilutes existing ownership percentage. Founder might go from 100% pre-Series A to 50% post-Series A. Track this via cap table."
      },
      {
        q: "What's the difference between basic and fully diluted shares?",
        a: "Basic = current shares only. Fully diluted = basic + all options + convertibles. Valuation negotiations should use fully diluted."
      },
      {
        q: "When should I refresh the option pool?",
        a: "When remaining pool is 10% or less of total shares, or when hiring rate increases. Propose refresh to board/investors before running out."
      }
    ],
    videoUrl: ""
  }
];

export default batch98Articles;
