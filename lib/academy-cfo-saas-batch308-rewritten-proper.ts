import { AcademyArticle } from "@/types/academy";

export const batch308Articles: AcademyArticle[] = [
  {
    slug: "esop-and-equity-pool-management",
    title: "ESOP and Equity Pool Management: Employee Ownership Strategies",
    description: "Master equity pools. Design ESOP, manage equity, align team ownership.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["ESOP", "equity pool", "employee stock ownership", "equity grant", "stock ownership"],
    keyTakeaways: [
      "ESOP basics: Employee Stock Ownership Plan - company sets aside equity for employees (pool). Benefits: Retention (shares vest over time), alignment (employees own part of company), wealth building (employees benefit on exit). Typical: 10-20% of company reserved for employee pool. Example: 1M shares total, 150K (15%) in employee pool. Vesting: 4 years with 1-year cliff (earn 25K/year after year 1). Cost: Accounting (setup £2-5K), ongoing administration (£1-2K/year), dilution to founders. Benefit: Significant retention lever.",
      "Pool sizing and distribution: Pool size = hiring plans + retention goals. Example: Hire 10 people/year for 3 years = 30 people. 0.5% per person = 1.5% equity = 15K shares (0.15M from 1M pool = 15% of company). Distribute: VP 0.5-1%, senior engineer 0.2-0.3%, mid-level 0.1%, junior 0.05%. Cost: Dilution to founders (founders own less %). Benefit: Team motivation, ability to attract talent without high salary.",
      "Challenges: Complexity (accounting, tax, administration). Underwater options (if company value drops, options worthless). Dilution perception (founders own less). Liquidity (illiquid until exit). Solution: Use standard grants (no complexity), professional admin (remove burden), clear communication (explain value to team), secondary sales (give liquidity if possible)."
    ],
    content: [
      {
        heading: "Designing and Managing Employee Equity Programs",
        body: `Building employee ownership and alignment.

**ESOP fundamentals**

What is ESOP?
- Employee Stock Ownership Plan
- Company sets aside equity for employees (share pool)
- Employees earn shares over time (vesting)
- On exit (acquisition, IPO), employees benefit (get proceeds)

Why ESOP?
- Retention: Employees with vested equity more likely to stay
- Alignment: Employees have financial interest in success
- Wealth: Employees participate in exit proceeds
- Attraction: Offer equity to offset lower salary vs competitors
- Culture: Ownership mentality (act like owners)

When to set up?
- Ideal: Before hiring first employees (establish pool from start)
- Latest: Before Series A (investors require pool)
- Risk: Late ESOP (difficult to retroactively grant options)

**Pool sizing and design**

Determining pool size:

Factors:
- Hiring plans (how many employees?)
- Retention goals (keep people 4+ years)
- Market competition (how much equity offer typical?)
- Stage (early = larger pool, mature = smaller)

Approach 1: Hiring-based
- Plan: Hire 30 people over next 3 years
- Grant per person: 0.5% (typical for growth-stage SaaS)
- Total pool: 30 × 0.5% = 15% of company

Approach 2: Retention-based
- Goal: Retain 80% of team past 4-year vest
- Assume: 20% leave before vest (lose equity)
- Needed: 25% of team with equity to achieve 80% retention
- Plan: Expand pool to 20% (accommodate churn)

Typical pool sizes by stage:
| Stage | Pool Size | Notes |
|---|---|---|
| Seed (1-5 people) | 15-20% | Larger relative pool, founders negotiate ownership |
| Series A (5-20) | 10-15% | Established company, less pool needed |
| Series B+ (20+) | 10% | Mature, smaller % needed |
| Pre-exit (100+) | 5-8% | May reduce pool if fully diluted |

Example company:
- Seed: 1M shares, 150K in pool (15%)
- Series A: Dilution to 1.2M shares (post-raise), pool refreshed to 120K (10%)
- Series B: Dilution to 2M shares, pool refreshed to 200K (10%)

**Grant levels by role**

Typical grants (percentage of company):

| Role | Level | Typical Grant | Vesting | Example |
|---|---|---|---|---|
| VP Sales | Director | 0.5-1.5% | 4 years | 5-15K shares |
| Senior engineer | Senior IC | 0.2-0.5% | 4 years | 2-5K shares |
| Mid-level engineer | IC | 0.1-0.2% | 4 years | 1-2K shares |
| Junior engineer | Junior IC | 0.05-0.1% | 4 years | 0.5-1K shares |
| Operations | Support | 0.05-0.1% | 4 years | 0.5-1K shares |

Example distribution (30-person company):
| Role | Count | Per Person | Total | % Company |
|---|---|---|---|---|
| Founders | 2 | N/A | 400K shares | 40% |
| VPs (3) | 3 | 0.75% | 23K | 2.3% |
| Senior engineers (5) | 5 | 0.3% | 15K | 1.5% |
| Mid-level engineers (8) | 8 | 0.15% | 12K | 1.2% |
| Junior engineers (4) | 4 | 0.075% | 3K | 0.3% |
| Operations (4) | 4 | 0.075% | 3K | 0.3% |
| Sales (2) | 2 | 0.2% | 2K | 0.2% |
| Total team | 28 | - | 58K | 5.8% |
| Pool remaining | - | - | 92K | 9.2% |
| Investors + cap table | - | - | 450K | 45% |
| **Total** | - | - | **1M** | **100%** |

**Vesting mechanics**

Standard vesting: 4-year vest, 1-year cliff
- Year 0-1: 0% vested (all-or-nothing at cliff)
- Year 1: 25% vested (cliff date = quarter 1 of year 2)
- Year 2: 50% vested (1/48 per month after cliff)
- Year 3: 75% vested
- Year 4: 100% vested (all shares vested)

Example: 10,000 option grant
- Leave month 13: 0 vested (cliff not hit)
- Leave month 25: 2,500 vested (25%, hit cliff)
- Leave month 37: 5,000 vested (50%)
- Leave month 49: 7,500 vested (75%)
- Stay 4 years: 10,000 vested (100%)

Cost to employee (to exercise):
- Strike price: Usually fair market value (FMV) at grant
- Example: Grant at £5/share, company now worth £10/share
- Exercise cost: 10,000 shares × £5 = £50K (cash required)
- Value: 10,000 shares × £10 = £100K
- Gain: £50K (if company worth £10/share)

Early exercise (optional):
- Benefit: Exercise before fully vested (can do once vested)
- Tax advantage: 83(b) election (treat as grant date, not exercise date, for tax purposes)
- Strategy: Minimize tax (earlier FMV lower = less tax)

**Administration and tracking**

Setup (one-time):
- Document: Stock option plan (legal document)
- Grant: Issue option letters to each employee
- Valuation: 409A valuation (IRS-required to set strike price)
- Cost: Accountant + legal (£2-5K)

Ongoing (annual):
- Track: Vesting schedules (who's vested what)
- Report: Update capitalization table (who owns what %)
- Award: Grant new options (new hires, refresher grants)
- Admin: Maintain records (7 years minimum)
- Cost: Accountant or admin person (1-2 hours/month)

Tools:
- Shareworks (Dell): Professional-grade, expensive (£1000+/month)
- Carta: Lower-cost, user-friendly (£200-500/month)
- Spreadsheet: DIY (free, but error-prone)

Example admin tracking:

| Employee | Grant Date | Vesting | Exercised | Current |
|---|---|---|---|---|
| Alice (VP) | 2021-01 | 10K shares | Yes | 10K vested, £50K cash |
| Bob (Engineer) | 2022-06 | 5K shares | Partial | 2.5K vested, 1.25K exercised |
| Charlie (New) | 2024-01 | 2K shares | No | 0 vested |

**Liquidity and exits**

Challenge: Illiquid until exit
- Problem: Employees can't sell options (no public market)
- Solution: Secondary sales (rare, usually only for mature companies)
- Alternative: Buyback programs (company buys back vested shares at FMV)

Secondary markets (mature startups):
- Platforms: EquityZen, Forge (connect buyers + sellers)
- Typical: 20-30% discount to FMV (for illiquidity)
- Example: Stock FMV £100/share, secondary market £70-80/share
- Benefit: Employees get some liquidity before exit

On acquisition/IPO:
- Typical: Employee proceeds = vested shares × exit price
- Example:
  - 10K shares vested at time of £500M exit (post-money)
  - If ownership = 0.5%, share value = £500M × 0.5% / shares outstanding = £250/share
  - Proceeds: 10K × £250 = £2.5M

**Common mistakes**

Mistake 1: Pool too small
- Problem: Can't attract talent, retention issues
- Solution: Refresh pool periodically (add more shares)

Mistake 2: Strike price too high
- Problem: Options underwater (worthless if company FMV < strike)
- Solution: 409A valuation (realistic, defensible FMV)

Mistake 3: Poor communication
- Problem: Employees don't understand value
- Solution: Annual updates (share price, pool size, dilution), explain vesting

Mistake 4: Accidental cliffs
- Problem: Vesting cliff too long (employees leave month 12, get nothing)
- Solution: Shorten cliff (6-month cliff, or no cliff)

Mistake 5: Neglected administration
- Problem: Lost records, disputes over vesting
- Solution: Use tool (Carta, Shareworks) for tracking

**Implementation roadmap**

Before first hire (Pre-employee):
- Create stock plan (legal documents)
- Define pool (typically 10-15%)
- Set up 409A valuation (for strike price)
- Cost: £3-5K legal + accounting

First hires (Employees 1-5):
- Grant options (per person grant)
- Issue offer letters (include equity terms)
- Educate: Explain vesting, value, path to liquidity
- Cost: Minimal (already have plan)

Growth (Employees 5-50):
- Monitor: Track vesting, pool depletion
- Refresh: May need to add pool (if running low)
- Audit: 409A valuation annually (keep strike prices realistic)
- Cost: £1-2K annually (admin + audit)

Maturity (50+ employees):
- Professional admin: Use Carta or similar tool
- Secondary: May offer secondary sales (give liquidity)
- Tax planning: Optimize equity tax strategy
- Cost: £500-1000/month (tools) + £5-10K annually (admin)

Exit (M&A or IPO):
- Exercise: Help employees exercise pre-exit
- Paperwork: Ensure all options properly documented (critical for close)
- Tax: Plan for tax implications (80% vs 20% treatment)
- Communication: Clear explanation of payout process
- Cost: Legal + accounting (£20-50K for small exit)

**Impact summary**

Retention impact:
- Without equity: Turnover 30-50% annually
- With equity: Turnover 10-20% annually
- Benefit: 60-70% reduction in turnover
- Value: Avoid £50-200K cost per employee replaced (recruiting, training, ramp)

Attraction impact:
- Equity offering: Attract talent willing to take lower salary (accept growth bet)
- Salary saved: 10-20% lower salary by offering equity
- Example: VP takes £150K salary (vs £180K at public company) = £30K saved
- Value: Significant for cash-constrained startups

Financial impact:
- Dilution cost: Founders own 10-15% less (for employee pool)
- Offset: Achieve higher exit value (better retained team, better company)
- Net: Usually positive (exit value increase > dilution cost)

`
      }
    ],
    relatedSlugs: ["equity-compensation-and-vesting-schedules", "founder-compensation-and-equity-structure", "employee-retention-and-turnover-analysis", "hiring-and-talent-acquisition-strategy", "organizational-structure-and-team-design"],
    faq: [
      { q: "What size equity pool should I set up?", a: "Typical: 10-15% of company reserved for employee pool. Calculation: Project hiring (30 employees × 0.5% per person = 15% pool). Early-stage: Larger pool (15-20%, more hiring uncertainty). Growth-stage: Smaller pool (10-12%, hiring more predictable). Refresh: May need to add to pool as you hire (if pool depletion). Set up before hiring first employees (easier than retroactive)." },
      { q: "How much equity should I grant each employee?", a: "Rule of thumb: VPs 0.5-1.5%, senior engineers 0.2-0.5%, mid-level 0.1-0.2%, junior 0.05-0.1%. Standard vesting: 4 years with 1-year cliff (earn 25% at year 1, then 1/48 per month after). Market: Check comparable companies (same stage, size). Stage: More generous early (seed), less generous as you raise (post-Series A). Example: VP at seed gets 1%, post-Series B gets 0.3% (post-dilution)." },
      { q: "What's the cost of setting up and maintaining an ESOP?", a: "Setup: £2-5K legal + accounting (one-time). Annual: £1-2K admin + annual 409A validation (£500-1000). Tools: Carta or similar (£300-500/month for professional admin). Total: £5-8K first year, £2-3K annually after. Cost-benefit: Strong (avoid high salary costs, improve retention, attract talent)." }
    ],
    videoUrl: ""
  }
];

export default batch308Articles;