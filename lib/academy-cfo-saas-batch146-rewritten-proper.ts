import { AcademyArticle } from "@/types/academy";

export const batch146Articles: AcademyArticle[] = [
  {
    slug: "employee-equity-and-stock-options",
    title: "Employee Equity and Stock Options: Aligning Incentives and Retaining Talent",
    description: "Master equity compensation. Design stock option plans, manage dilution, understand tax implications, and use equity to attract and retain top talent.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "stock options",
      "employee equity",
      "equity compensation",
      "vesting",
      "strike price",
      "option pool",
      "dilution",
      "equity grants",
      "tax implications",
      "incentive alignment"
    ],
    keyTakeaways: [
      "Option pool allocation: Startups typically reserve 10-20% of cap table for employee options. Example: Seed round £10M post-money valuation, 15% pool = 1.5M options available. As company raises more capital, option pool dilutes founder equity (new investors negotiate pool separately). Rule: Grant 0.5-2% of company to early employees (CEO 0.5%, VP 0.25%, engineer 0.1-0.2%). Later hires get less (pool depletes).",
      "Vesting schedule: Standard = 4-year vest, 1-year cliff. Example: Grant 100K options, 25K vest after year 1, then 25K/year × 3 years. If employee leaves month 13, gets 25K vested options (1 year cliff). If leaves year 3, gets 75K vested. Cliff prevents quick exits with full vesting. Vesting over time = retention (stay to vest).",
      "Tax treatment: US: Options typically use Incentive Stock Options (ISOs, tax-favored) or Non-Qualified Stock Options (NSOs, taxable as income). At exercise: Gap between strike price and fair market value = taxable income. Example: £1 strike, £10 FMV, exercise 100K = £900K taxable income at exercise (even if no money made yet!). NSOs have immediate tax on grant, ISOs deferred until sale. Planning needed to avoid surprises."
    ],
    content: [
      {
        heading: "Understanding Stock Options Basics",
        body: `Foundation concepts for equity compensation.

**What is a Stock Option?**

Stock option: Right (but not obligation) to buy shares at predetermined price (strike price) at future date.

Example:
- Grant: 100,000 stock options
- Strike price: £1.00 per share
- Expiration: 10 years
- Right: Can buy 100,000 shares at £1.00 anytime in next 10 years

Value only if share price rises above strike price.

Example scenarios:

Scenario 1 (Company fails):
- Share price: £0.50
- Strike price: £1.00
- Option value: £0 (out of the money)
- Employee loses nothing (doesn't have to exercise)

Scenario 2 (Company succeeds):
- Share price: £5.00
- Strike price: £1.00
- Option value: £4.00 per share × 100K = £400K (in the money)
- Employee exercises, buys 100K shares at £1, immediately worth £5 = £400K gain

**Key Terms**

Vesting: When employee actually owns options
- 4-year vesting, 1-year cliff: 25% vests per year, can't leave before year 1
- Example: Month 13 = 25K vested, month 25 = 50K vested, month 37 = 75K vested, month 49 = 100K vested

Strike price: Price employee pays to buy shares
- Usually set at fair market value (FMV) on grant date
- Example: Company worth £10M on grant date, share price = £0.10, strike = £0.10

Expiration: When options expire (usually 10 years from grant)
- If not exercised within 10 years, option expires worthless

Exercise: When employee buys shares at strike price
- Example: 100K options × £0.10 strike = £10K to buy 100K shares

**Incentive Stock Options (ISO) vs Non-Qualified (NSO)**

ISO (tax-favored, US only):
- Hold 2+ years from grant, 1+ year from exercise: Long-term capital gains (15-20% tax)
- Example: Grant at £0.10, exercise at £1.00 (£90K gain), sell at £5.00 (£400K gain)
- Tax: £90K ordinary income + £310K long-term capital gains = more favorable

NSO (simpler, taxed as income):
- Ordinary income tax on spread at exercise
- Example: Grant at £0.10, exercise at £1.00 = £90K ordinary income (20-40% tax = £18-36K owed)
- Simpler but more expensive

Most founders grant ISOs to US employees (tax advantage). Non-US: NSOs (different tax rules).

**Option Pool and Dilution**

Option pool: Reserved shares for future employee grants

Example cap table (Series A):

| Holder | Shares | % (Pre-pool) | % (Post-pool) |
|--------|--------|-------------|---------------|
| Founders | 5M | 50% | 42.5% |
| Series A | 4M | 40% | 34% |
| Option pool | 1M (new) | — | 8.5% |
| **Total** | **10M** | **90%** | **100%** |

Observation: Adding option pool dilutes founder and investor ownership.

Typical: 10-15% option pool for early stage, 5-10% for later stage.

Rule: Negotiate pool size separately from investment (investors want small pool to minimize dilution).

`
      },
      {
        heading: "Designing Equity Compensation Plans",
        body: `How to structure equity to attract and retain talent.

**Grant Sizes by Role**

Early employees (scarce, high risk):
- CEO: 0.5-1% of company
- VP (first hire in function): 0.25-0.5%
- Senior engineer: 0.1-0.2%
- Mid-level engineer: 0.05-0.1%
- Junior employee: 0.02-0.05%

Rationale: Early employees take salary cuts (equity upside), so grants larger.

Later employees (more available, lower risk):
- VP (later hire): 0.1-0.2%
- Senior engineer: 0.05-0.1%
- Mid-level: 0.02-0.05%
- Junior: 0.01-0.02%

Example: £100M post-money Series A
- CEO granted year 1: 0.75% = 750K shares
- VP Sales hired year 2: 0.3% = 300K shares
- Engineer hired year 3: 0.1% = 100K shares

Note: Grants occur throughout career, not all at hire.

**Equity vs Cash Trade-off**

Early stage (high risk, limited cash):
- Salary: £40K (below market)
- Equity: 0.5% of company
- Rationale: Cash conservation, equity upside incentive

Growth stage (lower risk, more cash):
- Salary: £80K (market rate)
- Equity: 0.1% of company
- Rationale: Can pay more cash, equity less critical retention

Late stage (lower risk, abundant cash):
- Salary: £120K (above market)
- Equity: 0.05% of company
- Rationale: Equity less valuable (valuation high), cash more important

Negotiation: If candidate asks for more equity, can reduce salary (trade-off).

**Equity Refresh Grants**

Problem: Initial grants vest out after 4 years, equity value erodes if company doesn't exit.

Solution: New grants every 2-3 years to refresh equity compensation.

Example:

Year 0 (hire):
- Grant: 100K options, 4-year vest
- Year 1-4: 25K vests each year

Year 2 (refresh):
- Grant: 50K new options, 4-year vest
- Now has: 100K original + 50K new
- This keeps employee motivated to stay

Year 4:
- Original 100K fully vested
- Second grant: 50K vested, 50K remaining
- Total vested: 100K original + 25K refresh = 125K

Refresh grants: Standard practice for retention, especially in high-growth companies.

**Equity Communication**

Many employees don't understand equity value.

Better communication:

"You have 100,000 stock options.
- Strike price: £0.10 per share
- Company is now worth £100M (£10 per share)
- If company valued at £1B in 5 years: (£100 per share)
- Your equity worth: 100K × £100 = £10M (minus taxes)

This assumes company gets to £1B valuation and you can sell."

Emphasize: Equity only valuable if company succeeds and you can exit (IPO, acquisition, secondary sale).

**Equity Leakage and Forfeiture**

Risk: Employees leave, forfeit unvested equity (lost to pool).

Example:
- Employee granted 100K, vests 25K per year
- Leaves year 2: Gets 50K vested, loses 50K unvested
- Company reclaims 50K to pool (redeploys)

This is why cliff matters: 1-year cliff = can't leave before year 1 without forfeiting everything.

Without cliff: Employee leaves month 6, forfeits 75K but keeps 25K (expensive for company).

`
      },
      {
        heading: "Tax Implications and Planning",
        body: `Financial and tax considerations for equity.

**Exercise Tax**

ISO (Incentive Stock Option):
- At exercise: No ordinary income tax (favorable!)
- At sale >2 years from grant, >1 year from exercise: Long-term capital gains tax (15-20%)
- Example: Grant at £0.10, exercise at £1.00 (no tax at exercise), sell at £5.00
  - Gain: £5.00 - £0.10 = £4.90 per share × 100K = £490K
  - Tax: £490K × 20% = £98K (long-term capital gains)

NSO (Non-Qualified Stock Option):
- At exercise: Ordinary income tax on spread (strike to FMV)
- Example: Grant at £0.10, exercise at £1.00
  - Spread: £1.00 - £0.10 = £0.90 per share × 100K = £90K
  - Tax: £90K × 40% (top marginal) = £36K owed at exercise (even if no liquidity!)
- At sale: Capital gains tax on appreciation from FMV
  - Example: Sell at £5.00, FMV was £1.00
  - Gain: £5.00 - £1.00 = £4.00 per share × 100K = £400K
  - Tax: £400K × 20% = £80K (capital gains)
  - Total tax: £36K + £80K = £116K

ISO much more favorable (£98K vs £116K), why founders prefer ISOs for US employees.

**Alternative Minimum Tax (AMT)**

US-specific issue: ISO can trigger AMT (minimum tax) in year of exercise.

If exercising large gain:
- Regular income tax: £36K
- AMT: £45K
- Owe: Maximum = £45K (AMT trumps regular tax)

This can create surprise tax bills. Plan with CPA.

**Secondary Liquidity Events**

Before IPO/exit, employees might have secondary market sales (selling to growth investors).

Example:
- Company Series C at £100 per share valuation
- Employee has 100K shares (vested from options)
- Secondary buyer buys shares at £100 per share
- Employee sells all: £10M proceeds
- Tax: Capital gains on the gain (from strike price to sale price)

Secondary sales: Taxable event (need to understand tax impact before selling).

**Exercise without Liquidity Problem**

Challenge: Exercise requires cash, but no liquid market to sell yet.

Example:
- Employee has 100K NSOs, strike £0.10
- Company valued £1.00 (based on investor round, not public market)
- To exercise: £0.10 × 100K = £10K cash needed
- But no way to sell shares (illiquid)
- Employee must pay £10K + tax (£4K at 40% marginal) = £14K total, for illiquid shares

Solution:
- Exercise early (lower spread, lower tax)
- Cashless exercise (broker lends money, sells shares to repay)
- Wait for liquidity event (IPO, secondary sale)

**Planning Before Exit**

Before IPO/acquisition, tax planning matters:

If being acquired:
- Equity value might be £10M
- Tax impact: Long-term capital gains £2M
- Net: £8M after tax

If IPO:
- Can sell over time, spread tax
- Control timing of gains
- Use capital losses to offset

Work with CPA to minimize tax impact.

`
      },
      {
        heading: "Managing Equity Through Company Growth",
        body: `How equity landscape changes as company scales.

**Option Pool Dilution Over Funding Rounds**

Example company over 5 years:

Seed (£2M post-money):
- Founders: 80%
- Investors: 20%
- Option pool: 10% (built into 80% founder ownership)

Series A (£20M post-money):
- Founders: 50%
- Series A investors: 30%
- Previous investors: 10%
- Option pool: 10% (negotiated at round)

Series B (£100M post-money):
- Founders: 25%
- Series A: 15%
- Series B: 40%
- Previous: 5%
- Option pool: 15% (larger for hiring)

Series C (£500M post-money):
- Founders: 10%
- All investors: 70%
- Option pool: 20% (more needed for scaling)

Note: Founder ownership declines, but company value increases (potentially net-positive).

Seed: Founder owns 80% of £2M = £1.6M value
Series C: Founder owns 10% of £500M = £50M value (1000x more, despite dilution)

**Secondary Sales**

Late-stage employees might sell shares before exit:

Series C company, employee has 50K vested shares worth £5M (£100 per share fair value).

Growth equity fund offers: "We'll buy your shares at £100 per share"

Employee sells £5M to fund (gets liquidity before IPO).

Tax: Capital gains on gain from strike price (£0.10) to sale price (£100) = £4.99 gain × 50K = £249.5K gain.

Secondary sales: Attractive for employees needing liquidity, but taxable.

**Equity After Exit (IPO/Acquisition)**

IPO path:
- Employees can sell immediately (public market liquidity)
- Usually lock-up period 90-180 days (can't sell immediately)
- After lock-up: Free to sell, subject to capital gains tax

Acquisition path:
- Equity converts to cash (or acquirer stock)
- If cash: Taxable immediately
- If stock: Taxable at receipt (value at closing)

Example acquisition:
- Acquirer buys company for £500M in cash
- Employee has 100K shares worth £5M (at £50 per share)
- Receives £5M in cash at closing
- Tax: Capital gains on gain from strike (£0.10) to proceeds (£50) = £4.99 per share × 100K = £499K
- Tax due: £499K × 20% (long-term cap gains) = ~£100K

**Equity Retention Post-Exit**

If acquisition with earn-out (retention bonus):

"You have £5M in equity at close, plus £1M earn-out if company hits 2024 revenue targets"

This incentivizes staying post-acquisition to hit targets.

Equity: Motivates for exit success.

`
      },
      {
        heading: "Common Equity Mistakes and How to Avoid Them",
        body: `Pitfalls in equity compensation design.

**Mistake 1: Oversized Early Grants**

Granting too much to early hires:
- Early engineer: 2% of company (massive)
- Later hires: 0.05% (resentment gap)

Why problematic:
- Creates equity inflation (pool exhausted)
- Makes later hires unhappy (huge disparity)
- Hard to attract experienced hires (they'd demand 1%+ to justify risk)

Solution: Grade grants by role/timing
- CEO: 0.5-1%
- VP: 0.2-0.5%
- Early engineer: 0.1-0.2%
- Later employees: 0.02-0.05%

Rationale: Early employees take risk, deserve more. Later employees join proven company, take less risk, deserve less.

**Mistake 2: No Refresh Grants**

Grant once, never again.

Problem: After 4 years, grant fully vested, no equity upside. Employee leaves for new opportunity (more equity opportunity).

Solution: Refresh grants every 2-3 years for top performers.

Keeps team motivated long-term.

**Mistake 3: Options Only, No Cash**

Giving massive equity grants but minimal salary.

Problem: Employee can't pay rent/taxes, forced to sell shares (or leave).

Example:
- Salary: £30K
- Options: 1% of company
- Problem: £30K not enough to live on in expensive city, employee forced to negotiate salary or leave

Solution: Competitive salary + meaningful equity.
- Salary: £60K (livable)
- Options: 0.5% (meaningful upside)

Both matter.

**Mistake 4: Misunderstanding Tax Impact**

Exercising options without understanding tax.

Example:
- 100K NSOs, strike £0.10
- Company at £1.00 (paper valuation)
- Employee exercises to own shares (expects future gain)
- Exercise spread: £90K, owes tax £36K (40% marginal)
- Employee has no liquidity, must pay £36K from personal cash
- Years pass, company fails, options worth £0
- Employee lost £36K on failed bet

Solution: Understand tax before exercising. Consider:
- ISO vs NSO (ISOs favor long-term holding)
- Exercise timing (exercise early to reduce spread, reduce tax)
- Liquidity (only exercise if can afford tax)
- Company risk (only exercise if bullish on exit)

**Mistake 5: Option Pool Too Small**

Setting option pool at 5%, running out after 20 hires.

Problem: Can't hire more employees without renegotiating pool (dilutes investors, lengthy process).

Solution: Set pool large enough for 3-5 year hiring plan (10-15% typical).

Negotiate once, use for years.

**Mistake 6: No Documentation**

Granting equity informally, no written grant agreements.

Problem: Employee thinks they own 0.5%, documentation shows 0.1% (conflict).

Solution: Proper grant agreements (legal, clear), communicate in writing.

Protects both sides.

`
      }
    ],
    relatedSlugs: [
      "funding-strategy-and-investor-relations",
      "exit-planning-m-a-preparation",
      "financial-controls-audit-readiness",
      "tax-planning-for-saas-and-startups",
      "burn-rate-and-cash-runway-analysis"
    ],
    faq: [
      {
        q: "How much equity should I grant to early employees?",
        a: "Rule: CEO 0.5-1%, VP 0.2-0.5%, senior engineer 0.1-0.2%, mid-level 0.05-0.1%, junior 0.02-0.05%. Scale down for later hires (equity pool limited). Consider: Earlier hire = more risk = more equity. Later hire = proven company = less equity needed. Don't overgrant early (creates resentment with later hires)."
      },
      {
        q: "What's the difference between ISO and NSO?",
        a: "ISO (Incentive Stock Option): Tax-deferred until sale, long-term gains 15-20% tax (favorable). NSO (Non-Qualified): Taxed at exercise as ordinary income 20-40% (unfavorable). Spread at exercise = strike price to fair market value. Example: Strike £0.10, FMV £1.00, NSO spread £0.90 = £36K tax on £90K spread. Use ISOs for US employees (tax advantage), NSOs for international."
      },
      {
        q: "Should I do refresh equity grants?",
        a: "Yes, critical for retention. Grant once at hire, vests over 4 years. After 4 years, grant fully vested = no ongoing upside. Refresh grant every 2-3 years keeps employee motivated. Example: Initial 100K grant vests by year 4, refresh 50K grant in year 2 (vests year 6). Keeps total unvested equity ~2 years ahead."
      },
      {
        q: "How big should the option pool be?",
        a: "Typical: 10-15% for early stage, 5-10% for late stage. Set pool large enough for 3-5 years of hiring (don't run out mid-growth). Negotiate at funding round (separate from investment). Pool grows at each round, but negotiated each time. Example: 10% at seed, 15% at Series A (new pool for hiring), 20% at Series B."
      }
    ],
    videoUrl: ""
  }
];

export default batch146Articles;
