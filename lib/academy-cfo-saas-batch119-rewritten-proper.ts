import { AcademyArticle } from "@/types/academy";

export const batch119Articles: AcademyArticle[] = [
  {
    slug: "headcount-planning-and-compensation-strategy",
    title: "Headcount Planning and Compensation: Building Your Team Without Breaking the Budget",
    description: "Master headcount planning. Right-size your team, plan compensation budgets, and align head count with revenue growth for sustainable scaling.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "headcount planning",
      "team composition",
      "compensation",
      "salary budget",
      "equity compensation",
      "headcount ratio",
      "engineering headcount",
      "sales headcount",
      "team scaling",
      "payroll management"
    ],
    keyTakeaways: [
      "Payroll is largest expense: typically 50-70% of burn for SaaS. £500K monthly burn → £250-350K payroll. Headcount rule of thumb: Revenue per employee = £200K-400K ARR per FTE (fully-loaded). Example: £10M ARR target → need 25-50 people depending on stage. Most startups over-hire (too many people for revenue), under-utilize (people not productive).",
      "Headcount expansion: Early stage (£0-1M) = lean, 5-15 people; Growth (£1-10M) = expand 1 person per £100-150K new ARR; Scale (£10M+) = expand 1 person per £200-300K new ARR. Bad pattern: hire person before revenue justifies (burn increases, payroll 80%+ of burn). Good pattern: revenue growth first, then hire to support growth.",
      "Compensation structure: Base salary (70-80% of comp), bonus (5-10% for on-target), equity (10-20% for vesting 4 years). Example: £100K base, £10K bonus, £30K equity value = £140K total comp. Equity: £30K grant vests over 48 months (4 years) = £625/month value. Fully-loaded cost: Add 25% for taxes, benefits, infrastructure (£140K comp → £175K fully-loaded cost)"
    ],
    content: [
      {
        heading: "Understanding Headcount and Payroll",
        body: `Payroll is the largest expense for most SaaS companies. Understanding how many people you need and how much they cost is critical for financial planning.

**Payroll as % of Burn**

Typical SaaS breakdown:

Early stage (pre-product-market fit):
- Payroll: 60-70% of expenses
- Go-to-market (marketing, sales): 20-30%
- Infrastructure (servers, tools): 5-10%

Growth stage (post-PMF, scaling):
- Payroll: 50-60% of expenses
- Go-to-market: 30-40%
- Infrastructure: 5-10%

Example startup:

Total monthly burn: £500K
- Payroll: £300K (60%)
- Marketing: £150K (30%)
- Infrastructure/other: £50K (10%)

If average fully-loaded comp = £150K/year = £12.5K/month:
- £300K ÷ £12.5K = 24 employees

This startup has 24 people and burns £500K/month.

**Revenue Per Employee**

Key metric: Annual Revenue / Number of Employees

Example:

Company A:
- ARR: £10M
- Headcount: 50 people
- Revenue per employee: £200K/year

Company B:
- ARR: £10M
- Headcount: 30 people
- Revenue per employee: £333K/year

Company B is more efficient (same revenue with fewer people).

Benchmarks by stage:
- Early stage: £50-100K revenue per employee (losing money, investing in growth)
- Growth stage: £150-250K revenue per employee (improving)
- Mature SaaS: £300-500K revenue per employee (efficient)

To reach SaaS efficiency (£300K/employee):
- Target ARR: £10M
- Need headcount: 30-35 people
- Current headcount: 50 people
- Action: Either grow ARR to £15M or reduce headcount

**Headcount Composition**

Typical SaaS company structure:

Company at £1M ARR (10 people):
- CEO: 1
- Engineering: 4
- Sales/Business development: 2
- Operations/Finance: 1
- Marketing: 1
- Customer success: 1

Company at £10M ARR (35 people):
- Executive (CEO, CTO, CFO): 3
- Engineering: 12
- Sales/Account management: 8
- Operations/Finance: 2
- Marketing: 4
- Customer success: 4
- Other/HR: 2

Ratios matter:
- Engineers: 1 engineer per £1-1.5M ARR (£10M = 7-10 engineers)
- Sales: 1 salesperson per £1-1.5M ARR (enterprise) or 1 per £500K-1M (SMB)
- Customer success: 1 CSM per £500K-1M ARR
- Marketing: 1 per £2-5M ARR
- Operations: 1 per £5-10M ARR (mostly at scale)

Overcommon mistake: Too many managers, too few individual contributors.

Good structure: 1 manager per 4-6 direct reports.
Bad structure: 1 manager per 2 direct reports (top-heavy).

**Fully-Loaded Cost**

Salary is not total cost. Fully-loaded cost includes:

Base salary: £100K
Taxes (employer): 15% = £15K
Benefits (health insurance, 401k match): 10% = £10K
Equipment/workspace: 3% = £3K
Tools/training: 2% = £2K

Fully-loaded cost: £130K (not £100K)

When budgeting, use 25-35% overhead multiplier:
- Base salary × 1.25 to 1.35 = Fully-loaded cost

Example:
- Average base salary: £100K
- Fully-loaded multiplier: 1.30x
- Fully-loaded cost per employee: £130K/year = £10.8K/month

For 24 people:
- Total monthly cost: 24 × £10.8K = £259K

This aligns to earlier example of £300K payroll with £500K total burn (though simplified).
`
      },
      {
        heading: "Headcount Planning by Growth Stage",
        body: `How many people do you hire at each stage? This depends on revenue growth and stage.

**Early Stage: £0-1M ARR**

Goal: Find product-market fit, not scale

Typical headcount: 5-15 people

Composition:
- 1 CEO/founder
- 2-4 engineers
- 1-2 sales/business development
- 0-1 marketing
- 1 operations (if £1M ARR)

Hiring philosophy:
- Hire only for critical roles (product, sales)
- Founders wear multiple hats
- Keep lean (extend runway)

Payroll: 70% of burn (company focused on product, not yet revenue)

Example:
- Monthly burn: £100K
- Payroll: £70K
- Headcount: 6 people
- Average comp: £11.7K/month = £140K/year (all-in)

**Growth Stage: £1-10M ARR**

Goal: Scale the business, build repeatable sales

Hiring accelerates:
- Expansion ratio: 1 new hire per £100-150K new ARR

Example:

Year 1: £1M ARR, 10 people, £100K revenue/person
Year 2: £5M ARR, target is 35-50 people
- Need to add: 25-40 people
- ARR growth: £4M
- New hires per £1M ARR: 6-10 people

Year 2 headcount plan:
- Engineering: Add 5 (build scalable product)
- Sales: Add 10 (build repeatable sales process)
- Customer success: Add 3 (support growing customer base)
- Operations/Finance: Add 2 (build infrastructure)
- Marketing: Add 2 (build demand)
- Total: Add 22 people (10 → 32)

This accelerates payroll:
- Year 1 payroll: £140K × 10 = £1.4M/year = £116K/month
- Year 2 payroll: £140K × 32 = £4.5M/year = £375K/month

If revenue grows £4M and payroll grows £250K/month, is that good?
- Add £250K/month payroll
- Generate £330K/month revenue (£4M ÷ 12)
- Net margin: 25% (good)

**Scale Stage: £10M+ ARR**

Goal: Achieve efficiency, prepare for profitability or exit

Hiring philosophy: Be more selective
- Growth: 1 new hire per £200-300K new ARR
- Hiring decelerates as company matures

Example:

Year 1: £10M ARR, 35 people
Year 2: £20M ARR, 50-55 people
- Need to add: 15-20 people
- ARR growth: £10M
- New hires per £1M ARR: 1.5-2 people (vs 6-10 at growth stage)

This improves unit economics:
- Year 1: £10M ÷ 35 = £286K revenue per person
- Year 2: £20M ÷ 53 = £377K revenue per person (improving)

Payroll as % of revenue:
- Year 1: (35 × £175K) ÷ £10M = 61% of revenue
- Year 2: (53 × £175K) ÷ £20M = 46% of revenue (improved)

This is the path to profitability: Maintain/grow payroll at slower rate while revenue accelerates.

**Hiring Mistakes**

Mistake 1: Hire ahead of revenue
- Increase payroll before revenue justifies it
- Example: £2M ARR, but payroll structure for £5M ARR
- Result: 60%+ payroll ratio, burning cash fast

Mistake 2: Hire managers before builders
- Too many directors, not enough engineers
- Example: 3 engineering managers, 6 engineers (bad ratio)
- Result: Low productivity, slow product development

Mistake 3: Backfill roles too late
- Don't hire for critical function until crisis
- Example: Don't hire finance person until audit time
- Result: Reactive, disorganized

Mistake 4: Higher salaries than market
- Pay top-market for every role
- Result: Payroll 80%+ of revenue
- Example: £150K base for mid-level engineer (market £100K)

Better: Pay market rate, offer equity upside.
`
      },
      {
        heading: "Compensation Structure and Equity",
        body: `How do you structure compensation to attract talent while managing costs?

**Compensation Components**

Total compensation has three parts:

1. Base Salary (70-80% of comp)
- Annual fixed payment
- Paid monthly or biweekly
- Guaranteed regardless of performance

2. Cash Bonus (5-10% of comp)
- Annual bonus (or quarterly)
- Based on hitting targets
- "On-target earnings" (OTE) assumes bonus achieved

3. Equity (10-20% of comp)
- Stock options or RSUs (restricted stock units)
- Vest over 4 years
- Value depends on future company exit

Example: Senior engineer

Base salary: £120K
Target bonus: £12K (10% of base)
Equity grant: £40K (4-year vest at £10K/year)

Total comp: £120K base + £12K bonus + £40K equity value = £172K

But how to count equity value?

**Equity Accounting**

Stock options = right to buy shares at strike price

Example:
- Grant: 20,000 options
- Strike price: £0.50 per share (price when granted)
- 4-year vest = 5,000 options per year
- Value today: 20,000 × £0.50 = £10K grant
- Annual value (year 1): £10K ÷ 4 = £2.5K/year
- Or: 5,000 options vesting × £0.50 = £2.5K/year

If company raised Series A at £1.00/share:
- Options still worth £0.50 (granted at old price)
- But option value = £1.00 - £0.50 = £0.50 per option
- 20,000 options × £0.50 upside = £10K unrealized gain

(This gets complex; point is equity vests over time and has uncertain value).

**Market Compensation by Role**

Engineer:
- Early-stage (Series A): £80-120K base + £15-25K equity
- Growth-stage (Series B/C): £120-150K base + £30-60K equity

Sales (quota-carrying):
- Early-stage: £50-70K base + £20-40K bonus + £10-20K equity
- Growth-stage: £80-120K base + £40-80K bonus + £20-40K equity

Customer success manager:
- Early-stage: £40-50K base + £5K bonus
- Growth-stage: £50-70K base + £10K bonus

CFO/Finance:
- Early-stage: £100-140K base + £20-40K equity
- Growth-stage: £150-200K base + £40-80K equity

These are £ UK salaries (adjust for your market).

**Equity Grants and Dilution**

Equity grant pool: Typically 10-20% of company shares reserved for employees.

Example:

Company cap table at Series A:
- Founders: 70 shares (70%)
- Investors: 30 shares (30%)
- Employee pool: Reserved 10 shares from founder shares (now founders 60 shares = 60%)

Over time:
- Employee 1 (engineer): 1 share
- Employee 2 (sales): 0.5 share
- Employee 3 (finance): 0.7 share
- Total granted: 2.2 shares (22% of pool)
- Remaining pool: 7.8 shares for future hires

When company raises Series B at higher valuation, employee options become more valuable (same options, higher future company value).

**Total Cost of Hiring**

When budgeting new headcount:

Annual cost = Base salary × 1.30 (fully-loaded)

Example:
- New engineer at £120K base
- Fully-loaded annual cost: £120K × 1.30 = £156K/year
- Monthly cost: £13K/month
- Includes: Salary, taxes, benefits, equipment, tools, workspace

This £156K is what reduces your runway.

**Compensation and Cash Flow**

Salary is paid monthly, so headcount decisions impact cash immediately.

Example:

Hire 10 engineers at £120K base = £1.2M/year = £100K/month payroll

When hiring:
- Day 1: No cash impact
- End of Month 1: Pay £100K salary (cash out)
- Every month after: £100K salary (ongoing)

This is different from building product (one-time cost) or marketing (pay for results).

Hiring is the highest-leverage financial decision (each person affects monthly cash burn forever until they leave).
`
      },
      {
        heading: "Building a Budget and Managing Headcount",
        body: `How to build a headcount budget and manage hiring against that budget.

**Creating a Headcount Budget**

Step 1: Forecast revenue

Target 2-year revenue: £20M ARR

Step 2: Calculate target unit economics

Target: £300K revenue per employee (typical for growth-stage SaaS)
Required headcount: £20M ÷ £300K = 67 people

Step 3: Determine hiring path

Year 1 (£10M ARR): 35 people (currently 10)
- Hire: 25 people
- Growth rate: 250%

Year 2 (£20M ARR): 67 people (from 35)
- Hire: 32 people
- Growth rate: 91%

Step 4: Build department headcounts

Year 1 (£10M, 35 people):
- Engineering: 12 (+8 vs now)
- Sales: 8 (+4)
- Customer Success: 4 (+2)
- Marketing: 3 (+1)
- Finance/Ops: 2 (+1)
- Executive: 3
- Other: 3
- Total: 35

Year 2 (£20M, 67 people):
- Engineering: 20 (+8)
- Sales: 15 (+7)
- Customer Success: 8 (+4)
- Marketing: 6 (+3)
- Finance/Ops: 6 (+4)
- Executive: 4 (+1)
- Other: 8 (+5)
- Total: 67

Step 5: Calculate payroll budget

Assume average fully-loaded cost £160K/year (varies by role, location):

Year 1:
- Current payroll: 10 × £160K = £1.6M
- New hires: 25 × £160K × (6 months average, hired mid-year) = £2.0M
- Total Year 1 payroll: £3.6M

Year 2:
- Base (35 people from Year 1): 35 × £160K = £5.6M
- New hires: 32 × £160K × (6 months average) = £2.56M
- Total Year 2 payroll: £8.16M

As % of revenue:
- Year 1: £3.6M ÷ £10M = 36% (good, below 50%)
- Year 2: £8.16M ÷ £20M = 41% (good, stable)

**Headcount Forecasting Tools**

Use spreadsheet with columns:
- Department
- Current headcount
- Q1 target (new hires)
- Q2 target
- Q3 target
- Q4 target
- Annual fully-loaded cost per role
- Total budget

Update quarterly as actual hiring happens vs plan.

**Common Headcount Mistakes**

Mistake 1: Hire without plan
- Hire friends or good candidates without strategy
- Result: Team composition misaligned with business needs

Mistake 2: Manager creep
- Every hire adds manager layer
- Example: 35 people, 12 managers (1 per 3 reports)
- Result: Inefficient, high cost

Mistake 3: Hire during fundraising
- Raise capital, immediately 2x payroll
- Result: Burn accelerates, next fundraise harder

Mistake 4: Keep people who don't produce
- Avoid firing underperformers to preserve "culture"
- Result: Dead weight, lower productivity

Good practice:
- Plan headcount tied to revenue
- Hire disciplined (only when revenue justifies)
- Remove low performers (high cost of underproductive person)
- Keep payroll ratio <50% of revenue

This is how efficient SaaS companies scale: Revenue first, then strategic hiring, not the reverse.
`
      }
    ],
    relatedSlugs: [
      "burn-rate-and-cash-runway-analysis",
      "financial-forecasting-modeling",
      "gross-margin-deep-dive-cost-structure",
      "unit-economics-ltv-cac-payback",
      "board-reporting-investor-communications"
    ],
    faq: [
      {
        q: "How many employees do I need for my revenue target?",
        a: "Depends on stage. Early-stage: £50-100K revenue per employee. Growth-stage: £150-250K per employee. Mature SaaS: £300-500K per employee. Example: £10M ARR target, growth-stage = 40-67 people. Focus on revenue per employee, not absolute headcount."
      },
      {
        q: "What's a good payroll ratio?",
        a: "50-60% of revenue for growth-stage SaaS is typical. Below 50% is excellent, above 60% is concerning. If you're at £10M ARR and 60 people (£600K revenue/person is low), your payroll is too high relative to revenue."
      },
      {
        q: "How much equity should I grant new hires?",
        a: "Depends on role and stage. Early-stage engineering: 0.1-0.5%. Series B engineering: 0.05-0.2%. Senior roles (VP): 0.2-1.0%. CEO: 1-10% (negotiated). Use online calculators (Carta, Pulley) to benchmark market rates."
      },
      {
        q: "Should I hire before revenue justifies it?",
        a: "No. Hire after revenue growth validates the need. Bad: Hire 5 engineers, then revenue doesn't justify. Good: Revenue growing, engineering bottleneck, then hire. Hire to support growth you see, not growth you hope for."
      }
    ],
    videoUrl: ""
  }
];

export default batch119Articles;
