import { AcademyArticle } from "@/types/academy";

export const batch289Articles: AcademyArticle[] = [
  {
    slug: "equity-compensation-and-vesting-schedules",
    title: "Equity Compensation and Vesting Schedules: Building Incentive Structures",
    description: "Master equity grants. Design vesting schedules, grant options, align incentives.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["equity compensation", "stock options", "vesting schedule", "equity grants", "option pool", "cliff period"],
    keyTakeaways: [
      "Equity basics: Stock options (right to buy at strike price), ISOs vs NSOs (tax treatment differs), vesting schedule (earn over time). Purpose: Retain talent (can't leave before vesting), align incentives (benefit from company success), conserve cash (pay with equity instead of salary). Vesting structure: 4-year vest with 1-year cliff (earn 0% year 1, then 1/48 each month after). Example: 100K options, 4-year vest, 1-year cliff = 0 after year 1, 25K after year 2, 50K after year 3, 100K after year 4. Cost: Shares dilute founders but minimal if granted thoughtfully.",
      "Option pool sizing: Set aside 10-20% for employee options (standard 15%). Example: 1M shares total, 150K option pool. Exercise price: Set at fair market value (FMV) at grant (audit-proof). Vesting terms: 4-year vest, 1-year cliff (standard). Early exercise: Let employees buy vested shares before resignation (saves taxes). Acceleration: Full vest on exit (acquisition) if included in offer letter (controversial, but common). Cost: Track carefully (ASC 718 expense = dilutes earnings).",
      "Tax treatment: ISOs (incentive stock options) = better tax (capital gains), NSOs = ordinary income tax. Strategy: ISOs for employees <£10M options granted, NSOs for large grants or non-employees. Timing: Exercise early if cheap (lower tax cost). Hold 2+ years post-exercise for ISO tax treatment. Example: ISO £2 strike, stock worth £10, exercise gains £8, hold 2 years, sell at £15 = £13 capital gain (better tax). Cost: Track ISO limits (£100K FMV per year), exercise timing carefully."
    ],
    content: [
      {
        heading: "Designing Equity Compensation Programs",
        body: `Retaining talent with equity.

**Understanding equity grants**

Types of equity:
- Restricted stock: Shares issued immediately, vesting over time
  - Pros: Simpler accounting, immediate ownership
  - Cons: Tax hit upfront (FMV at grant)
  - Use for: Early employees, founders

- Stock options: Right to buy shares at set price (strike)
  - Pros: Upside if share price rises, better tax treatment
  - Cons: Requires cash to exercise, complexity
  - Use for: Most employees (standard practice)

- Phantom shares: Cash payout based on share value
  - Pros: No equity given away (retention via cash)
  - Cons: Cash expense, not real ownership
  - Use for: When don't want dilution (rare)

Exercise price (strike):
- Set at fair market value (FMV) on grant date
- Example: Company worth £5M, 1M shares = £5 per share strike
- Must document FMV (409A valuation for tax compliance)
- Cannot be below FMV (tax rules)

Vesting schedule (standard):
- 4-year vest: Earn equity over 4 years
- 1-year cliff: Nothing vests year 1, then monthly after
- Timeline:
  - Month 0-12: 0% vested (cliff period)
  - Month 12: 25% vested (cliff date)
  - Month 13-48: 1/48 each month
  - Month 48: 100% vested

- Example: 100K options
  - After 1 year: 0K vested (cliff not hit if left)
  - After 2 years: 25K vested
  - After 3 years: 50K vested
  - After 4 years: 100K vested

**Option pool and sizing**

Standard sizing:
- Early stage (seed): 20% pool (larger for team building ahead)
- Growth stage (Series A+): 15% pool (smaller as larger cap table)
- Formula: 15-20% of total shares reserved for employees

Example cap table with option pool:

| Party | Shares | % | Notes |
|---|---|---|---|
| Founder A | 400K | 40% | Full vesting |
| Founder B | 400K | 40% | Full vesting |
| Option pool | 150K | 15% | Reserved for employees |
| Early investor | 50K | 5% | Seed round |
| Total | 1M | 100% | - |

Granting strategy:
- New hire: £50K-200K range depending on level/stage
- VP-level: 0.5-2% of company (£5-20K shares)
- Senior engineer: 0.1-0.5% (£1-5K shares)
- Junior engineer: 0.05-0.15% (£0.5-1.5K shares)
- Non-technical: 0.05-0.2% (£0.5-2K shares)

Example: 1M share company
| Role | Expected % | Shares | FMV at £5/share | Value |
|---|---|---|---|---|
| VP Sales | 1% | 10K | £50K | - |
| Senior eng | 0.25% | 2.5K | £12.5K | - |
| Mid engineer | 0.1% | 1K | £5K | - |
| Junior | 0.05% | 0.5K | £2.5K | - |

**Vesting mechanics and acceleration**

Typical vesting terms:
- Vest period: 4 years (standard)
- Cliff: 1 year (all-or-nothing at 1 year mark)
- Acceleration: Full vest on acquisition (negotiable)

Cliff impact:
- If quit month 13: 25K vested (loss £75K if month 12 quit)
- If quit month 24: 50K vested
- Protects company (retain year 1)

Acceleration types:
- Single-trigger: Automatic on acquisition
  - Example: Acquired at month 24, all 100K grants fully vest
  - Pro: Founder retains full upside
  - Con: Expensive, reduces acquisition attractiveness

- Double-trigger: Acquisition + job loss required
  - Example: Acquired, employee stays 6 months, loses job = accelerate remainder
  - More common (employer-friendly)

- Partial acceleration: Vest X% on acquisition (compromise)
  - Example: 50% acceleration + new employment agreement

Early exercise:
- Allows employees to exercise vested portions immediately
- Benefit: Tax advantage (time to hold before sale)
- Example: Exercise 25K shares at £5 strike = £125K cost
  - If hold 2+ years and company sells for £15/share
  - Stock gains: (£15-£5) × 25K = £250K (capital gains, better tax)

**Cap table and dilution tracking**

Post-Series A example:

| Party | Pre-A | Post-A % | Post-A Shares |
|---|---|---|---|
| Founder A | 40% | 30% | 300K |
| Founder B | 40% | 30% | 300K |
| Option pool | 15% | 11% | 110K |
| Early investor | 5% | 4% | 40K |
| Series A investor | 0% | 25% | 250K |
| Total | 100% | 100% | 1M |

Employee grants from pool:
- VP Sales: 0.5% of post-A = 5K shares
- 3 senior engineers: 0.15% each = 1.5K shares each = 4.5K total
- 2 mid engineers: 0.1% each = 1K shares each = 2K total
- 3 junior: 0.05% each = 0.5K each = 1.5K total
- Total pool usage: 5 + 4.5 + 2 + 1.5 = 13K / 110K = 12% of pool (leaves 97K for future)

**Accounting and tax considerations**

ASC 718 (stock-based compensation):
- Expense recognized over vesting period
- Cost: Value at grant date / vesting months
- Example: 10K shares at £5 FMV, 4-year vest
  - Total expense: £50K spread over 48 months
  - Monthly P&L impact: £1,042 (non-cash, but P&L hit)

- Dilutes earnings but non-cash (important for VC metrics)

Tax treatment:
- ISO (incentive stock option):
  - Tax on gain when sold (capital gains rates)
  - Requires 2-year hold to qualify
  - Limited to £100K FMV per year
  - Better for employees

- NSO (non-qualified option):
  - Tax at exercise (ordinary income on gain)
  - Exercised at £5, stock worth £10 = £5 × shares = taxable income
  - Then capital gains on further appreciation
  - Used for large grants or non-employees

Strategy:
- Grant ISOs up to £100K limit
- Use NSO for amounts over limit
- Early exercise allows long-term holding before liquidity event
- Track 83(b) elections (if restricted stock)

`
      }
    ],
    relatedSlugs: ["founder-compensation-and-equity-structure", "hiring-and-talent-acquisition-strategy", "organizational-structure-and-team-design", "employee-retention-and-turnover-analysis", "revenue-recognition-and-accounting-standards"],
    faq: [
      { q: "What's a standard vesting schedule?", a: "4-year vest with 1-year cliff (standard). Means: 0% vests year 1, then 1/48 each month. Example: 100K options = 0 year 1, 25K year 2, 50K year 3, 100K year 4. Cliff protects company (employee leaves early, loses all). Monthly vesting after cliff is standard." },
      { q: "How much equity should I grant?", a: "Depends on role and stage: VP-level 0.5-2%, senior engineer 0.1-0.5%, mid-engineer 0.1%, junior 0.05-0.1%. Set option pool at 15-20% of company. Example: 1M shares = 150K-200K pool. Grant based on hire level and experience." },
      { q: "What's the difference between ISOs and NSOs?", a: "ISOs: Better tax (capital gains if held 2+ years), limited to £100K FMV/year per employee. NSOs: Ordinary income tax at exercise, no limit, used for large grants. Strategy: Grant ISOs first (up to limit), then NSO for additional grants." }
    ],
    videoUrl: ""
  }
];

export default batch289Articles;