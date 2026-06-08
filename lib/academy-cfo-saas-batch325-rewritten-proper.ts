import { AcademyArticle } from "@/types/academy";

export const batch325Articles: AcademyArticle[] = [
  {
    slug: "cap-table-management-and-equity-tracking",
    title: "Cap Table Management and Equity Tracking: Organizing Ownership",
    description: "Master cap tables. Organize equity, track dilution, manage vesting.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cap table", "capitalization table", "equity ownership", "equity dilution", "stock vesting"],
    keyTakeaways: [
      "Cap table basics: Document showing who owns what % of company. Columns: (1) Shareholder name, (2) Shares held, (3) % ownership. Example: Founder A (500K shares, 50%), Founder B (500K shares, 50%), Investor (200K shares post-funding, ownership dilutes to ~33% each). Critical: Accurate cap table = foundation for equity compensation, fundraising, exit planning. Cost: Low (spreadsheet or software), time to maintain. Benefit: Know exactly who owns what, avoid disputes.",
      "Dilution mechanics: When company raises money, existing shareholders get diluted. Example: Pre-funding (2 founders, 1M shares, 50% each), Series A (raise £2M, issue 500K new shares). Result: Founders each drop to 33% (diluted by 33%). Preferred stock: Investor gets special rights (liquidation preference, voting, participation). Impact: Founder ownership percentage drops with each round. Strategy: Plan for dilution (how much raise needed? What % will I own afterward?).",
      "Vesting schedule: Equity vests over time (typically 4 years, 1-year cliff). Example: Employee gets 40K shares, 4-year vesting, 1-year cliff. After 1 year, 10K shares vested. After 4 years, all 40K vested. Benefit: Retention (people stay to get equity), fairness (rewards tenure). Cliff: Employee leaves month 12? Get cliff equity, but lose everything earned. Leavers: Update cap table, subtract unvested equity (return to pool)."
    ],
    content: [
      {
        heading: "Managing Cap Tables and Equity Ownership",
        body: `Organizing and tracking company ownership accurately.

**Cap table fundamentals**

Definition:
- Capitalization table (cap table)
- Shows who owns what % of company
- Single source of truth for ownership
- Updated with every equity transaction

Basic structure:

| Shareholder | Share Type | Shares | % Ownership |
|---|---|---|---|
| Founder A | Common | 500,000 | 50.0% |
| Founder B | Common | 500,000 | 50.0% |
| Total | | 1,000,000 | 100.0% |

Share types:
- Common: Standard shares held by founders, employees
- Preferred: Special shares held by investors (extra rights)
- Options: Earned through vesting (not yet owned)

Key metrics:
- Fully diluted ownership: % ownership after all options vested/exercised
- Voting rights: What decisions need approval?
- Liquidation preference: Order of who gets paid on exit

**Cap table examples**

Example 1: Pre-fundraising (seed stage)

| Shareholder | Share Type | Shares | % Ownership |
|---|---|---|---|
| Founder A | Common | 500,000 | 50.0% |
| Founder B | Common | 500,000 | 50.0% |
| **Total** | | 1,000,000 | 100.0% |

Notes:
- 2 equal founders
- No employees yet (startup stage)
- Simple cap table

Example 2: Post-Series A (investor funding)

Before funding:
- Founders: 1M common shares (50% each)

Funding event:
- Raise: £2M
- New shares issued: 500K preferred (investor) + 100K option pool
- Total post-funding: 1.6M shares

| Shareholder | Share Type | Shares | % Ownership |
|---|---|---|---|
| Founder A | Common | 500,000 | 31.3% |
| Founder B | Common | 500,000 | 31.3% |
| Investor | Preferred | 500,000 | 31.3% |
| Option pool | Common | 100,000 | 6.3% |
| **Total** | | 1,600,000 | 100.0% |

Notes:
- Founders diluted from 50% to 31.3% each
- Investor holds 31.3%
- 100K shares in option pool for employees
- Preferred stock has special rights

**Share dilution analysis**

Dilution = percentage ownership decrease after funding round

Formula:
- Pre-funding ownership: X%
- Post-funding ownership: Y%
- Dilution: X% - Y%

Example:

Founder pre-funding: 50% (500K of 1M shares)

Fundraising:
- Issue 500K new preferred shares (investor)
- Issue 100K option pool
- Total new shares: 600K
- Post-funding total: 1.6M shares (1M + 600K)

Founder post-funding: 500K / 1.6M = 31.3%

Dilution: 50% - 31.3% = 18.7 percentage points

Founder impact:
- Owned 50%, now owns 31.3%
- Diluted by ~37% relative (50% → 31.3%)

Managing dilution:
- Plan ahead (how much capital needed? What ownership afterwards?)
- Estimate future rounds (Series A, B, C = cumulative dilution)
- Example projection:
  - Seed: 20% dilution (80% founder ownership)
  - Series A: 30% dilution (56% founder ownership)
  - Series B: 25% dilution (42% founder ownership)
  - Series C: 20% dilution (33% founder ownership)

Cumulative dilution: Founder starts at 50%, ends at 33% after 3 rounds

**Equity compensation and vesting**

Equity grants:
- Employee receives grant of options/shares
- Example: 40K shares, 4-year vesting, 1-year cliff
- Vesting: Ownership accrued over time (can't cash out until vested)

Vesting schedule mechanics:

Standard 4-year vesting with 1-year cliff:
- Year 0 (Month 0): Employee granted 40K shares (no vesting yet)
- Year 1 (Month 12): Cliff date, 10K shares vest (25%), 30K remaining
- Year 2 (Month 24): Another 10K vest, total 20K vested
- Year 3 (Month 36): Another 10K vest, total 30K vested
- Year 4 (Month 48): Final 10K vest, 100% vested

Cliff purpose:
- Retention: If employee leaves before 1 year, gets nothing
- Incentive: Employee has reason to stay past year 1
- Fairness: Only reward people who stay meaningful time

Accelerated vesting:
- Double trigger: All equity vests if company acquired AND employee let go
- Retention: Some equity vests faster (retention bonus)
- Example: 50% vesting on acquisition, 50% vesting on termination

**Cap table changes and updates**

Transaction 1: New employee grant

Before:
- Founder A: 500K common (50%)
- Founder B: 500K common (50%)
- Option pool: 100K ungranted
- Total: 1.6M

Transaction:
- Grant: 40K options to new employee, 4-year vesting
- Effect: 40K moved from pool to granted options
- Status: Unvested (will vest over 4 years)

After:
- Founder A: 500K common (31.3%)
- Founder B: 500K common (31.3%)
- Investor: 500K preferred (31.3%)
- Employee: 40K options (unvested, 0% vested) (2.5%)
- Ungranted pool: 60K
- Total: 1.6M (unchanged)

Notes:
- Ownership % unchanged (options are contingent)
- Fully diluted ownership changes (if all options vest)

Transaction 2: Employee departure (before vesting)

Scenario: Employee granted 40K, 1-year cliff, leaves at month 6

Effect:
- Employee owns 0 shares (no cliff yet)
- 40K shares return to option pool
- No equity value to employee

Transaction 3: Employee departure (after vesting)

Scenario: Employee granted 40K, vested 20K over 2 years, leaves

Effect:
- Employee owns 20K vested shares
- 20K unvested shares return to pool
- Employee has equity value (20K shares)

Transaction 4: Series B fundraising

Before Series B:
- Current shares: 1.6M
- Series A valuation: £10M (£2M at £10M = 20% dilution, roughly)

Series B funding:
- Raise: £5M
- Pre-money valuation: £20M (value before new money)
- Post-money valuation: £25M (value after new money)
- New shares: £5M / £25M valuation = 20% = 320K new shares (at post-money of 1.92M total, roughly)
- Investor gets: Preferred shares = 320K

Impact:
- Founders: 31.3% → 26% (another round of dilution)
- Series A investor: 31.3% → 26%
- Series B investor: 20%
- Employees: 2.5% → 2%

**Cap table management best practices**

Best practice 1: Use cap table software

Options:
- Simple: Google Sheets (free, but manual)
- Medium: Pulley, Carta, Ledgy (dedicated cap table software)
- Advanced: Carta (comprehensive, including option management)

Benefits of software:
- Automation (dilution calculations automatic)
- Accuracy (less error-prone)
- Reporting (easy to generate reports)
- Integration (connects to payroll for equity accounting)

Cost: £100-1000/month depending on complexity

Best practice 2: Update cap table monthly

Actions:
- New grants: Add immediately
- Vesting: Track (may not change cap table, but important)
- Departures: Remove unvested, retain vested
- Conversions: Preferred → common at exit
- Board approval: Review/approve cap table changes

Cadence:
- Monthly cap table review
- Quarterly board updates
- Annual audit (accuracy check)

Best practice 3: Track fully diluted ownership

Definition:
- % ownership if all options vested and exercised
- Important for fundraising (investors care about this)

Example:

Current cap table (common only):
- Founder A: 500K (31.3%)
- Founder B: 500K (31.3%)
- Investor: 500K (31.3%)
- Unexercised options: 60K ungranted
- Total: 1.6M

Fully diluted (all options vested):
- Founder A: 500K (27%)
- Founder B: 500K (27%)
- Investor: 500K (27%)
- Employees (if all options granted and vested): 160K (9% + some vesting into future)
- Total: 1.76M

Fully diluted ownership: 27% (down from 31% due to employee pool)

Best practice 4: Liquidation preferences

Definition:
- Order in which shareholders get paid on exit (acquisition or IPO)

Example preferences:
- 1x non-participating preferred: Investor gets £2M back first, then profits shared
- 1x participating preferred: Investor gets £2M back, then shares in profits equally
- Senior to common: Preferred gets paid before common shareholders

Impact:
- Founder might get £0 if exit <£2M (liquidation preference barrier)
- Important to negotiate in fundraising (affects founder upside)

**Fundraising and dilution planning**

Example 5-year plan:

Year 0 (Seed): 2 founders, 1M shares
- Fundraising: Seed round (£500K)
- Founder ownership post-seed: 80%
- Founders: 800K shares, Seed investor: 200K shares

Year 1 (Series A): 5 employees, 80M ARR
- Fundraising: Series A (£2M)
- Founder ownership post-A: 56%
- Founders: ~500K shares each, Series A: 400K shares

Year 2 (Series B): 15 employees, £250K ARR
- Fundraising: Series B (£5M)
- Founder ownership post-B: 42%
- Similar dilution pattern

Cumulative dilution: 50% founder ownership → 42% after Series B

Key:
- Plan equity upfront (how much dilution acceptable?)
- Use option pool (attracts talent without over-diluting founders)
- Negotiate terms (liquidation preference, vesting, etc.)

`
      }
    ],
    relatedSlugs: ["equity-compensation-and-vesting-schedules", "fundraising-strategy-and-investor-outreach", "due-diligence-preparation-for-investment", "financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What is a cap table?", a: "Cap table: Document showing who owns what % of company. Columns: Shareholder, Share type (common/preferred/options), Shares held, % ownership. Example: Founder A (50%), Founder B (50%), Investor (30% after funding). Key: Accurate cap table = foundation for equity compensation, fundraising, exit planning. Update with every equity transaction (grants, vesting, departures)." },
      { q: "How does dilution work?", a: "Dilution: Ownership % decreases when new shares issued. Example: Founder owns 50% (500K of 1M shares). Series A funding: Issue 500K new shares (investor). Founder now owns 500K of 1.5M = 33.3% (diluted from 50%). Cumulative: Multiple rounds = significant dilution. Plan ahead: How much capital needed? What ownership acceptable post-funding?" },
      { q: "What is equity vesting?", a: "Vesting: Equity earned over time. Standard: 4-year vesting with 1-year cliff. Example: 40K shares granted. After 1 year (cliff), 10K vest. After 4 years, all 40K vest. Purpose: Retention (stay to earn equity), fairness (reward tenure). Cliff: Leave before 1 year = get nothing. Leave after 2 years = keep 20K vested shares. Track vesting monthly (important for recruiting, retention)." }
    ],
    videoUrl: ""
  }
];

export default batch325Articles;
