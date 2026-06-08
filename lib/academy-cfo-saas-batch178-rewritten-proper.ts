import { AcademyArticle } from "@/types/academy";

export const batch178Articles: AcademyArticle[] = [
  {
    slug: "employee-equity-and-stock-options",
    title: "Employee Equity and Stock Options: Aligning Incentives",
    description: "Master employee equity. Structure option pools, grant options fairly, and use equity to align team incentives.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "employee equity",
      "stock options",
      "option pool",
      "vesting",
      "strike price",
      "dilution",
      "option grants",
      "equity incentives",
      "startup equity",
      "stock plan"
    ],
    keyTakeaways: [
      "Option pool sizing: Typical 10-15% of fully-diluted shares for employee pool (larger if early stage, smaller if mature). Example: 10M shares outstanding, 10% pool = 1M option shares. Distribute to employees based on: Role (CEO more than engineer), seniority (senior more than junior), stage (earlier grant, later smaller). Refresh pool if depleted (common practice).",
      "Vesting schedule: Typical 4-year vest with 1-year cliff. Meaning: Employee gets 0 shares if leave before 1 year, then 25% after 1 year (1/4th of grant), then monthly 1/48th for 3 years. Example: 100K option grant vests over 4 years. If leave after 1 year, get 25K shares. If stay 4 years, get all 100K. Rationale: Retain employees (cliff discourages leaving early).",
      "Strike price: Price employee pays to exercise options. Typically set at fair market value (FMV) of common stock at grant date. Example: Stock FMV £1/share, grant 100K options at £1 strike. If company exits at £5/share, employee exercises (pays £100K), gets shares worth £500K (£400K profit). Fairness: Strike at FMV (not below) to avoid tax penalties."
    ],
    content: [
      {
        heading: "Structuring Equity",
        body: `Building a fair and effective option program.

**Option Pool**

Option pool: Shares reserved for future employee grants.

Typical size:
- Early stage (<£1M ARR): 15-20% pool (larger, need to attract talent)
- Growth stage (£1-10M): 10-15% pool (smaller, fewer new hires)
- Mature (>£10M): 5-10% pool (small, don't need to grant many)

Calculation:
| Stage | Shares Outstanding | Pool % | Pool Size |
|-------|---|---|---|
| Early | 10M | 15% | 1.5M |
| Growth | 50M | 12% | 6M |
| Mature | 100M | 8% | 8M |

Benefit: Pool grows with company (50M shares mature stage, 8% = still meaningful).

**Ownership Dilution**

Each option grant dilutes ownership.

Example:
- Early: 10M shares, 15% pool = 1.5M options
- After funding round: 15M shares (5M new shares), pool diluted
- Later: 20M shares, pool still 1.5M = now only 7.5% (diluted)

Refresh pool:
- As pool depletes, refresh it
- Add new options to pool (refresh grant)
- Dilutes all shareholders proportionally
- Necessary to continue attracting talent

Process:
- Every 2-3 years, propose option pool refresh
- Get board approval
- Update option plan

**Equity Breakdown**

Example early-stage cap table:

| Holder | Shares | % Ownership |
|--------|--------|---|
| Founder A | 3M | 30% |
| Founder B | 3M | 30% |
| Early investors | 2M | 20% |
| Option pool | 1.5M | 15% |
| **Total** | **9.5M** | **100%** |

Note: Pool is ungranted shares (reserved for future employees).

Fully diluted:
- Assumes all options exercised
- Example: 9.5M + (future rounds) = 15M at Series A
- Founders now 30% each but on larger base

`
      },
      {
        heading: "Vesting Schedules",
        body: `When employees get their equity.

**Standard Vesting Schedule**

4-year vest with 1-year cliff:

Timeline:
- Year 0: 0 vested (cliff period, nothing earned)
- Year 1: 25% vested (1M of 4M grant)
- Year 2: 50% vested (2M of 4M grant)
- Year 3: 75% vested
- Year 4: 100% vested

Monthly:
- Vest 1/48th of grant each month (after 1-year cliff)
- Example: 4M grant = ~83K per month vests

**Why 4-year vest?**

Retention incentive:
- If leave before cliff (1 year): Get 0 (strong retention signal)
- If stay 4 years: Get 100% (reward loyalty)
- Incentivizes staying through ups and downs

Fairness:
- 1-year cliff: Normal for early employees (not super short or long)
- 4-year total: Aligns with company growth stage (can take 5+ years to exit)

**Alternative Schedules**

2-year vest with 6-month cliff:
- Earlier vesting (good if company accelerating)
- Used sometimes in competitive markets

3-year vest with no cliff:
- Monthly vesting from day 1 (unusual, not typical)
- Rarely used (doesn't retain if person leaves month 1)

Cliff deeper (3-year cliff):
- Longer cliff (extreme, rarely)
- Only for specific roles or situations

Standard: 4-year vest, 1-year cliff (use this).

**Double-Trigger**

Change of control (acquisition):
- Normally, unvested options are forfeited
- Double-trigger: Options accelerate vesting if company acquired AND employee fired

Example:
- Employee has 4M grant, 2 years vested (50%), 2 years unvested
- Company acquired
- Without double-trigger: Lose 2M unvested options (bad)
- With double-trigger: Vest all 4M if fired post-acquisition (good)

Benefit: Protects employees if acquired and laid off.

Cost: Company must account for acceleration (increases earnout/seller proceeds).

Negotiation: More senior employees (CEO, VP) often get double-trigger. Junior get single-trigger (standard).

`
      },
      {
        heading: "Option Grants and Equity Communication",
        body: `Granting and communicating equity.

**Grant Levels**

Different roles get different grants:

| Role | Years at company | Grant |
|------|---|---|
| Founder | Early | 10-30% |
| CEO (hired) | Ongoing | 0.5-2% |
| VP | Ongoing | 0.2-1% |
| Director | Ongoing | 0.1-0.5% |
| Senior engineer | Ongoing | 0.05-0.2% |
| Junior engineer | Ongoing | 0.01-0.05% |

Note: Percentages on fully diluted basis (post-future-rounds).

Factors:
- Seniority (more senior = more options)
- Stage (early = more, later = less)
- Role (business roles typically less than engineering)

Example offer:
- Senior engineer hire at Series B
- "We offer: £80K salary + 0.1% equity (16K options, 4-year vest with 1-year cliff, £0.05 strike)"

**Strike Price**

Price employee pays to exercise options:

Typically: Fair market value (FMV) of common stock at grant date.

Example:
- Grant date: FMV is £0.50/share
- Grant: 100K options at £0.50 strike
- Employee pays: £50K to exercise, gets 100K shares

Exit scenario:
- Company sold for £10/share
- Employee exercises (pays £50K), gets shares worth £1M
- Profit: £950K

Tax implications (509A):
- Strike at FMV: No immediate tax on grant (incentive stock options, ISO)
- Strike below FMV: Immediate tax on discount (not typical)
- Strike above FMV: Illegal/not allowed

ISO vs NSO:
- ISO (Incentive Stock Option): Grant at FMV, favorable tax treatment
- NSO (Non-qualified Option): Grant above FMV (unusual)

Standard: Use ISO, strike at FMV.

**Communication and Documentation**

Stock option agreement:
- Grant details (number of shares, strike price, vesting)
- Vesting schedule (4-year, 1-year cliff)
- Exercise process (how to exercise, cost)
- Taxes (employee responsible for taxes on exercise)
- Change of control (what happens if company acquired)

Signed: Employee must sign agreement.

Annual statements:
- Share number of vested options
- Number of unvested options
- Strike price
- Current FMV (so employee can calculate value)

Example statement:
- "You have been granted 100K options"
- "Vested: 25K (after 1 year), Unvested: 75K"
- "Strike: £0.50, Current FMV: £5.00"
- "Value if exercised: (25K × £5) - (25K × £0.50) = £112.5K"

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling",
      "board-reports-and-financial-statements",
      "exit-planning-and-m-and-a-preparation",
      "department-budgeting-and-headcount-planning"
    ],
    faq: [
      {
        q: "How much equity should I allocate to employees?",
        a: "Option pool: 10-15% of fully diluted shares. Distribute based on: Role (CEO > VP > engineer), seniority (senior > junior), stage (earlier grant, later smaller). Example: 10M shares outstanding, 10% pool = 1M options for all employees. Refresh pool every 2-3 years as you grow and grant more."
      },
      {
        q: "What's a standard vesting schedule?",
        a: "4-year vest with 1-year cliff. Employee gets 0 if leave in first year (cliff), then 25% after 1 year, then monthly 1/48th for next 3 years. Rationale: Retain employees (cliff discourages leaving), reward loyalty (full vesting after 4 years). Standard in tech industry."
      },
      {
        q: "How do I set the strike price?",
        a: "Set at fair market value (FMV) of common stock at grant date. Example: FMV £0.50/share, grant 100K options at £0.50 strike. No tax on grant (ISO benefits), employee exercises later at hopefully higher price. Use independent valuation (§409A) to determine FMV."
      },
      {
        q: "What should I communicate to employees about equity?",
        a: "Annual statement showing: Number of options granted, number vested, number unvested, strike price, current FMV. Also: Vesting schedule (4-year, 1-year cliff), exercise process (how to buy shares), taxes (employee pays taxes on exercise). Make it transparent (employees should know the value)."
      }
    ],
    videoUrl: ""
  }
];

export default batch178Articles;
