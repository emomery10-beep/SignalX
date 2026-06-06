import { AcademyArticle } from "@/types/academy";

export const batch121Articles: AcademyArticle[] = [
  {
    slug: "sales-compensation-and-commission-structures",
    title: "Sales Compensation and Commission Structures: Aligning Incentives for Growth",
    description: "Master sales compensation design. Build commission plans that drive desired behavior, manage payroll costs, and attract top talent.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "sales compensation",
      "commission structure",
      "sales incentives",
      "bonus plans",
      "on-target earnings",
      "OTE",
      "base salary",
      "commission rate",
      "sales quota",
      "variable compensation"
    ],
    keyTakeaways: [
      "Sales comp structure: Base salary (40-60%) + Commission (40-60%). Example: £100K base + £100K commission potential = £200K OTE (on-target earnings). Base attracts quality people, commission aligns to revenue. Commission calculation: Deal size × Commission % = Payout. Example: £500K deal × 3% commission = £15K. Cap commissions at reasonable levels (prevent runaway payouts).",
      "Commission structure design: Accelerators (higher %) on higher quotas reward top performers; tiered (increase % as cumulative revenue grows); or flat (same % on all deals). Example: 2% on first £500K, 3% on £500K-£1M, 4% on £1M+. Accelerators motivate push to quota. Tiered simplifies. Choose one structure, stick with it.",
      "Account-based pay: Enterprise deals complex (takes 6-9 months to close). Pay upfront? Commission on close? Split (deposit on signed LOI, rest on implementation)? For SaaS: Pay 70% on signed contract, 30% on go-live ensures customer success. For self-serve: Pay on revenue recognition (customer paid). Align commission timing to cash collection."
    ],
    content: [
      {
        heading: "Sales Compensation Fundamentals",
        body: `Sales compensation is one of the largest expenses for SaaS companies, yet many get it wrong. Good compensation aligns salesperson behavior with company goals.

**The Components of Sales Comp**

Base Salary:
- Guaranteed annual payment
- Provides stability and security
- Typical range: 40-60% of total compensation
- Example: £100K base salary

Commission:
- Earned based on deal closures or revenue achieved
- Varies with performance
- Typical range: 40-60% of total compensation
- Example: £100K annual commission target

Bonus (optional):
- Paid for achieving non-revenue metrics (customer retention, product adoption)
- Typical: 5-10% of base
- Example: £5K bonus for NPS score >50

Total On-Target Earnings (OTE):
- What a salesperson makes if they hit 100% of quota
- Base + Commission + Bonus
- Example: £100K + £100K + £5K = £205K OTE

**Base vs Commission Split**

Debate: How much base vs commission?

Option 1: High Base, Lower Commission (£140K + £60K)
- Pros: Attracts experienced salespeople, less financial stress
- Cons: Harder to control payroll, less incentive to sell
- Use when: Selling complex/enterprise deals (longer sales cycle, need stable people)

Option 2: Low Base, High Commission (£60K + £140K)
- Pros: Pays for results, controls fixed cost
- Cons: Attracts commission-hungry hunters, can burn through salespeople
- Use when: Selling simple/transactional products (fast sales cycle, need aggressive sellers)

Option 3: Balanced (£80K + £120K)
- Pros: Good middle ground, attracts both stability-seekers and hunters
- Cons: Jack of all trades, master of none
- Use when: Not sure, most common approach

Example: Enterprise SaaS

Enterprise deal: £200K ACV, 6-month sales cycle
- High base makes sense: £120K base + £80K commission potential
- Salesperson can survive on base while closing long deals
- Commission on deal closure motivates the close

Example: SMB SaaS

SMB deal: £30K ACV, 2-week sales cycle
- Low base works: £60K base + £140K commission potential
- Quick sales cycle means commission earned frequently
- No long waiting periods between payouts

**Commission Calculation**

Simple commission: Deal size × Commission %

Example:

Salesperson closes £500K deal
Commission rate: 3%
Commission earned: £500K × 3% = £15K

Salesperson total comp year:
- Base: £100K
- Commission: £15K × 12 deals = £180K
- Total: £280K

But commission formulas can be more complex:

Tiered commission:
- First £1M in annual revenue: 2% commission
- £1M-£2M: 3% commission
- Over £2M: 4% commission

Example:

Salesperson closes £300K, £400K, £500K deals (total £1.2M)
- First £1M: £1M × 2% = £20K
- Remaining £200K: £200K × 3% = £6K
- Total commission: £26K

Accelerator commission:
- If hit quota: 3% on all deals
- If exceed quota by 20%: 3.5% on all deals
- If exceed quota by 40%: 4% on all deals

Example:

Quota: £2M annual
Salesperson closes: £2.5M (125% of quota, 25% above target)
- Commission rate: 3.5% (accelerator kicks in)
- Commission: £2.5M × 3.5% = £87.5K

Accelerators reward high performers and incentivize overachievement.

**Quota Setting**

Quota should be achievable but challenging.

Method 1: History-based
- Last year: Team closed £10M
- Quota for next year: £10M × 1.20 = £12M (20% growth)
- Per salesperson (8 people): £12M ÷ 8 = £1.5M per person

Method 2: Capacity-based
- Sales cycle: 3 months average
- Deal size: £100K average
- Deals per person per year: 4 × (12 ÷ 3) = 16 deals
- Quota: 16 × £100K = £1.6M per person

Method 3: Market-based
- Total addressable market: £50M
- Market penetration goal: 3% = £1.5M revenue target
- Team size: 10 people
- Quota per person: £1.5M ÷ 10 = £150K per person

(Varies by sales model, product complexity, and market maturity.)

**Commission Cap and Floor**

Commission cap: Maximum payout per deal or year
- Prevents runaway payouts
- Example: Cap at £50K per deal or £500K per year
- Protects company from outsized payouts

Commission floor: Minimum to earn commission
- Prevents tiny deals
- Example: Only earn commission on deals >£10K
- Encourages focus on meaningful deals

Example:

Salesperson closes:
- £5K deal → No commission (below floor)
- £20K deal → Commission of £600 (3% × £20K)
- £300K deal → Commission capped at £50K (could be £9K at 3%, but capped)

Floors and caps align incentives with company goals.
`
      },
      {
        heading: "Designing Compensation Plans",
        body: `How to build a compensation structure that works for your business model.

**Enterprise vs SMB Commission Structures**

Enterprise Sales (£100K+ deals, 6-12 month sales cycles):

Base: £120K
Commission: 2-3% of contract value
Annual commission potential: £80-120K (hits if closing 2-3 large deals)

Example plan:
- 0% commission until quota met (encourage focus)
- 3% commission on deals above quota
- 4% accelerator if exceed quota by 25%

SMB Sales (£5K-£50K deals, 1-4 week sales cycles):

Base: £50K
Commission: 5-8% of contract value
Annual commission potential: £50-150K (higher because deals close faster)

Example plan:
- 5% commission on all deals
- 6% commission if hit quota
- 7% if exceed quota

Product-Led Growth (PLG) Sales:
- Lower base: £40K
- Higher commission: 10% of first-year revenue on converted trials
- Commission paid monthly (revenue recognized, not deal signed)
- Incentivizes conversions, not just deal size

**Annual Comp Payout Examples**

Enterprise Salesperson:

Quota: £5M revenue
Actual: £5.2M (104% of quota)

Base: £120K
Commission: £5.2M × 2% = £104K
Bonus: £5K (retention) + £3K (NPS) = £8K
Total: £232K

Mid-Market Salesperson:

Quota: £1.5M revenue
Actual: £1.8M (120% of quota)

Base: £80K
Commission: £1.8M × 3% = £54K
Accelerator: Additional 0.5% on overachievement = £9K
Bonus: £5K
Total: £148K

SMB Salesperson:

Quota: £500K revenue (20 deals)
Actual: £600K revenue (24 deals)

Base: £50K
Commission: £600K × 5% = £30K
Accelerator: 1% on overachievement = £6K
Bonus: £3K
Total: £89K

Each works for the business model (enterprise slower, SMB faster).

**Payroll Impact**

Sales comp is typically 10-15% of revenue in healthy SaaS.

Example:

£10M ARR company
Sales team: 12 people
Average compensation: £150K all-in (base + commission + benefits)

Total sales payroll: 12 × £150K = £1.8M/year = 18% of revenue

This is on-target. If exceeds 20%, commission structure needs adjustment (lower %), or hiring discipline (fewer salespeople, higher productivity).

**Common Commission Mistakes**

Mistake 1: Commission on bookings vs revenue
- Pay commission when contract signed (bookings)
- Problem: Salesperson closes £1M, gets paid, customer churns in month 3
- Solution: Pay 70% on close, 30% on renewal (aligns to retention)

Mistake 2: No cap on commission
- Salesperson wins one huge deal, payroll explodes
- Example: £10M deal at 3% = £300K commission
- Solution: Cap per deal (£50K) or annual (£300K)

Mistake 3: Quota too high or too low
- Quota too high: No one hits commission, team demoralized
- Quota too low: Everyone rich, company can't afford it
- Solution: 70% of team should hit quota

Mistake 4: Changing commission mid-year
- Salesperson was closing on old terms, you change it
- Creates resentment and legal risk
- Solution: Announce changes early, grandfather in-progress deals

Mistake 5: Ignoring admin/legal work
- Salesperson closes deal but doesn't implement/onboard
- Commission incentivizes deal closure, not customer success
- Solution: Split commission (sales + CS team earns completion bonus)
`
      },
      {
        heading: "Commission Payout Timing and Clawbacks",
        body: `When and how to pay commission is as important as how much.

**Payout Timing by Business Model**

SaaS Subscription:
- Payout 70% on contract signature (legally binding)
- Payout 30% on customer go-live (ensures implementation)
- Timing: Close in Jan, go-live in Feb → Full commission in Feb

Why split?
- Incentivizes sales to work with CS (not hand-off and disappear)
- Protects company if customer cancels during implementation

Project/Services:
- Payout 33% on contract signature
- Payout 33% on project kickoff
- Payout 34% on project completion
- Timing: Ensures salesperson supports delivery

Why staged?
- Long project timelines require ongoing motivation
- Reduces risk of customer dissatisfaction

One-Time Sales:
- Payout on revenue recognition
- For SaaS, that's when customer payment received
- Timing: Pay in month customer pays (monthly or annual)

Why wait for revenue?
- Payment risk (customer fails to pay, salesperson keeps commission)
- Company has actual cash in hand

**Clawback Provisions**

Clawback: Recovery of commission if deal fails.

Example clawback:
- Customer churns within 12 months: Recover 25% of commission
- Customer defaults on payment: Recover 100% of commission
- Customer implements fraud: Recover 100% of commission

Protection for company, but controversial with salespeople.

Clawback Example:

Salesperson closes £500K deal
Commission: £15K (3%)
Customer pays first year, then churns in month 9

Clawback: £15K × 25% = £3.75K recovered
Salesperson retains: £11.25K

This incentivizes sales to focus on customers they can keep, not just close.

**Retention Commission**

Alternative to clawback: Pay commission on retention.

Example:

Deal closed: £100K ACV
Commission on close: £2K (2%)
Commission on year-2 renewal: £2K (if they renew)
Commission on year-3 renewal: £2K (if they renew)

Salesperson incentivized to keep customer happy, not just close deal.

Total commission over 3 years: £6K (same as upfront, but spread).

This aligns sales to long-term customer value.

**Accelerators and Decelerators**

Accelerator: Higher % commission for overachievement.

Example:
- 100% quota: 3% commission
- 110% quota: 3.5% commission
- 120% quota: 4% commission
- 150% quota: 5% commission

Decelerator: Lower % commission for underachievement (rare, controversial).

Example:
- 100% quota: 3% commission
- 80% quota: 2% commission
- 60% quota: 1% commission

Used rarely (punitive, demotivates).

Better: Use base salary to protect downside, accelerators for upside.

**Team vs Individual Commission**

Team commission: All reps share commission pool.

Example:
- Team closes £10M
- Commission pool: £300K (3% of revenue)
- Split equally: £300K ÷ 10 reps = £30K per person

Pros: Encourages teamwork, no fierce competition
Cons: Underperformers get paid same as overperformers, demotivates

Individual commission: Each person earns on own deals.

Example:
- Rep A closes £1.5M → Earns £45K
- Rep B closes £500K → Earns £15K
- Rep C closes £0 → Earns £0

Pros: Clear incentive, high performers rewarded
Cons: Discourages collaboration, knowledge hoarding

Hybrid: Individual commission with team bonus.

Example:
- Individual commission on personal deals (3%)
- Team bonus if team exceeds revenue goal (5% of extra commission pool)

This encourages both individual excellence and teamwork.
`
      },
      {
        heading: "Sales Compensation ROI and Payoff",
        body: `How to calculate whether your sales compensation structure is working.

**Sales Compensation as % of Revenue**

Target: 10-15% of revenue in healthy SaaS

Calculation:
(Total sales team compensation ÷ Revenue) × 100

Example:

Sales team: 10 people
Average comp: £150K per person
Total comp: £10 × £150K = £1.5M

Revenue: £15M

Sales comp ratio: (£1.5M ÷ £15M) × 100 = 10% (healthy)

If this ratio exceeds 20%, commission structure needs adjustment.

**Sales Productivity Metrics**

Revenue per salesperson:

Example:
£15M revenue ÷ 10 salespeople = £1.5M per salesperson

Benchmark: £1M-£3M per person depending on deal size and sales cycle.

If productivity declining:
- Hiring wrong people (wrong skills for product)
- Compensation not competitive (people leaving)
- Quota too high (demoralized)
- Sales process broken (long sales cycles, low close rates)

**Commission Cost per Deal**

Calculate actual commission as % of deal size.

Example:

Deal size: £300K ACV
Commission plan: 3% on close
Commission paid: £9K
Commission as % of deal: £9K ÷ £300K = 3%

But fully-loaded cost (benefits, taxes, etc.):
£9K × 1.25 = £11.25K fully-loaded
Fully-loaded %: £11.25K ÷ £300K = 3.75%

LTV of customer: £300K ACV × 3 years (36% annual churn) = £600K LTV
Commission paid: £11.25K
Commission as % of LTV: £11.25K ÷ £600K = 1.9% (very healthy)

Rule of thumb: Commission should be <3% of LTV (ideally <2%).

**Sales Efficiency Ratio (Magic Number)**

Magic Number = Revenue gain ÷ Sales + Marketing spend in prior month

Example:

Month 1 revenue: £800K
Month 2 revenue: £850K
Revenue gain: £50K

Month 1 sales + marketing spend: £150K

Magic number: £50K ÷ £150K = 0.33x

Benchmark:
- >0.75x = Efficient
- >1.0x = Very efficient
- <0.5x = Inefficient (spending too much on sales/marketing)

High magic number = Salespeople and marketing efficient. Commission is reasonable.
Low magic number = Too much spend for revenue gain. Need to adjust commission or hiring.

**ROI on New Salesperson**

Cost to hire new salesperson:

Year 1:
- Base salary: £60K
- Commission (at quota): £60K
- Benefits/fully-loaded: £30K
- Total cost: £150K

Revenue generated (at quota):
- £1.5M (their quota)

Revenue minus commission:
- £1.5M - £60K (commission paid) = £1.44M gross revenue
- Minus other COGS (20% of revenue): £300K
- Gross profit: £1.14M

Gross profit minus fully-loaded cost: £1.14M - £150K = £990K net profit

ROI: £990K ÷ £150K = 6.6x return

This shows that hiring a salesperson (at quota) is highly profitable.

Problem: New salespeople rarely hit quota in year 1 (usually 60-80%).

Year 1 with 70% quota achievement:
- Revenue: £1.5M × 70% = £1.05M
- Commission: £60K × 70% = £42K
- Gross profit: £1.05M × 80% = £840K
- Cost: £150K
- Net profit: £840K - £150K = £690K
- ROI: £690K ÷ £150K = 4.6x

Still excellent, but lower ramp matters for cash planning.

Use this calculation to justify sales hiring and commission spend to investors.
`
      }
    ],
    relatedSlugs: [
      "sales-pipeline-management-forecasting",
      "customer-acquisition-cost-optimization",
      "headcount-planning-and-compensation-strategy",
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's a typical base vs commission split for salespeople?",
        a: "Enterprise SaaS: 60% base / 40% commission (longer cycles, need stability). SMB SaaS: 40% base / 60% commission (shorter cycles, faster payouts). On-target earnings: base + commission if hitting quota. Example: £80K base + £120K commission = £200K OTE."
      },
      {
        q: "How do I set sales quota?",
        a: "Three methods: (1) Historical: Last year revenue × growth target. (2) Capacity: Deals per year × average deal size. (3) Market: Total addressable market × market share goal ÷ team size. Quota should be achievable by 70% of team; 30% will exceed it."
      },
      {
        q: "Should I pay commission on bookings or revenue?",
        a: "For SaaS: Split it. Pay 70% on contract signature, 30% on go-live. Incentivizes sales to work with CS (not hand-off). Protects company if customer churns during implementation. For self-serve: Pay on revenue recognition (when customer payment received)."
      },
      {
        q: "What if my sales commission costs exceed 15% of revenue?",
        a: "Adjust the commission plan: (1) Lower commission % (2-3% instead of 3-5%). (2) Raise quota so fewer people hit big commissions. (3) Cap commission per deal or year. (4) Shift mix: Higher base, lower commission (attracts different sellers). (5) Review if salespeople quota attainment; if low, quota may be unrealistic."
      }
    ],
    videoUrl: ""
  }
];

export default batch121Articles;
