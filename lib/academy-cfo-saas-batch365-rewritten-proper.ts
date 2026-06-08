import { AcademyArticle } from "@/types/academy";

export const batch365Articles: AcademyArticle[] = [
  {
    slug: "hiring-and-team-building-economics",
    title: "Hiring and Team Building Economics: Building Efficient Teams",
    description: "Master hiring economics. Plan headcount, control costs, optimize team efficiency.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["hiring", "headcount planning", "payroll", "team economics", "hiring cost"],
    keyTakeaways: [
      "Headcount planning: Track employees per £1M ARR (efficiency metric). Example: £10M revenue with 50 people = 5 employees per £1M (target 3-4 for mature SaaS). Cost: Payroll is typically 25-35% of revenue (largest expense). ROI: Right-sized team hits growth targets without excessive burn. Formula: Annual salary × headcount = annual payroll. Track ramp (new hire takes 3 months to full productivity).",
      "Hiring cost: Average £20-40K per hire (recruiter fees 20% of salary, onboarding costs, lost productivity during ramp). Cost benefit: Hire when expected revenue from new person exceeds hiring cost. Example: Hire salesperson (£60K salary) if they'll close £500K revenue in year 1 (ROI = 8x). Bad hire: Costs £30K to hire, fires at 6 months = £30K sunk (no return).",
      "Team efficiency metrics: Revenue per employee (£1M ARR / 50 people = £200K per employee). Magic Number per rep (sales rep efficiency). Payroll as % of revenue (25-35% target). Hiring pacing (match revenue growth). Red flags: Hiring 20% faster than revenue growth (burn too high), churn >15% (losing people). Cost: CFO owns payroll budget. ROI: Control payroll = profitability."
    ],
    content: [
      {
        heading: "Planning and Managing Team Growth Economics",
        body: `Building cost-efficient teams aligned with revenue growth.

**Team economics fundamentals**

Headcount to revenue ratio:

Metric: Employees per £1M ARR

Early stage (Series A):
- Target: 5-8 employees per £1M revenue
- Reason: Lean, everyone does multiple things, lots of overhead not yet built
- Example: £1M revenue, 6 people

Growth stage (Series B):
- Target: 4-5 employees per £1M revenue
- Reason: Still lean, some specialization, but not bloated
- Example: £10M revenue, 45 people

Mature stage (Series C+):
- Target: 3-4 employees per £1M revenue
- Reason: Specialized teams, processes in place, efficient
- Example: £100M revenue, 350 people

Payroll as % of revenue:

Total annual payroll / Total annual revenue

Target: 25-35% of revenue

Example:

Revenue: £10M
Headcount: 50 people
Average salary: £70K
Total payroll: 50 × £70K = £3.5M
Payroll %: £3.5M / £10M = 35% (at target)

If growing revenue to £15M without hiring:
- Same £3.5M payroll
- £3.5M / £15M = 23% (improving efficiency!)

If hiring to 70 people for growth:
- New payroll: 70 × £70K = £4.9M
- £4.9M / £15M = 32.7% (still healthy)

**Hiring cost and ROI**

Hiring cost per employee:

Direct costs:
- Recruiter fee: 20-25% of first year salary (if external recruiter)
- Example: £60K salary × 20% = £12K

Indirect costs:
- Onboarding (HR time, systems setup): £2K
- Training (manager time): £5K
- Overhead (desk, equipment): £2K

Total hiring cost: £21K

Ramp period:
- New hire productivity timeline:
  - Month 1: 30% productive (learning)
  - Month 2: 60% productive (training)
  - Month 3: 80% productive (still learning)
  - Month 4+: 100% productive (full contribution)

Lost productivity cost:
- Average: 3 months × (100% - 60% avg productivity) × salary
- Example: 3 months × 40% × (£60K/12 months) = 3 months × 40% × £5K = £6K

Total first-year cost: £21K direct + £6K ramp = £27K

ROI calculation:

Hire salesperson (£60K salary):
- Expected first year revenue: £400K (closing deals)
- Gross margin on £400K: 60% = £240K
- Less commission (10% of £400K): £40K
- Contribution: £200K
- Cost to hire: £27K
- Net value in year 1: £200K - £27K - £60K (salary) = £113K
- ROI: £113K / £87K (total year 1 cost) = 130% (good!)

Bad hire example:

Hire person for £50K, terminate after 6 months:
- Salary paid: £25K (6 months)
- Hiring cost: £15K
- Total cost: £40K
- Revenue generated: £5K (minimal during ramp)
- Loss: -£35K

Impact: Every bad hire is expensive

**Headcount planning by function**

Engineering:

Headcount efficiency:
- Early stage (Series A): 1 engineer per £2M revenue
- Growth stage (Series B): 1 engineer per £3M revenue
- Mature stage (Series C+): 1 engineer per £4M+ revenue

Example:

£10M revenue, target: 1 engineer per £3M = 3-4 engineers

Cost:
- Senior engineer: £100K
- Mid-level engineer: £80K
- Junior engineer: £50K
- Average: £75K per engineer
- 3 engineers = £225K annual

Sales:

Headcount efficiency:
- 1 salesperson per £500K-1M revenue generated
- Depends on deal size and sales cycle

Example:

Target: £5M new revenue annually
- Enterprise (large deals): 1 rep per £1M = 5 reps
- SMB (small deals): 1 rep per £500K = 10 reps
- Mixed: 1 rep per £750K = 6-7 reps

Cost:
- Enterprise rep: £40K base + £30K commission (at quota) = £70K OTE
- SMB rep: £35K base + £20K commission = £55K OTE
- 6-7 reps: £390-385K

Marketing:

Headcount efficiency:
- 1 marketer per £3-5M revenue
- Small team scaled with product-led or self-serve

Example:

£10M revenue:
- 2 marketing people (content + demand generation)
- 1 marketing operations/analytics
- Total: 3 people

Cost:
- Content lead: £60K
- Demand gen: £50K
- Ops: £45K
- Total: £155K

Customer success:

Headcount efficiency:
- SMB: 1 CSM per 50-100 customers
- Enterprise: 1 CSM per 5-10 large customers

Example:

500 SMB customers:
- 1 CSM per 75 = 6.7 CSMs
- Rounding to 7 CSMs at £50K average = £350K

Operations/Finance:

Headcount efficiency:
- Early stage: 1 ops person per £5M revenue
- Growth stage: 1 ops person per £3M revenue
- Includes: finance, HR, legal, admin, IT

Example:

£10M revenue:
- CFO/Controller: £80K
- Finance/accounting: £50K
- HR: £45K
- Total: £175K

**Hiring pacing and headcount growth**

Healthy hiring pace:

Headcount growth should track revenue growth

Example:

Year 1: £1M revenue, 6 people
- Hiring: +3 people (target £3M with 9 people = 3.3 per £1M, acceptable early)

Year 2: £3M revenue, 9 people
- Hiring: +6 people (target £9M with 15 people = 1.6 per £1M, improving)

Year 3: £9M revenue, 15 people
- Hiring: +10 people (target £20M with 25 people = 1.25 per £1M, excellent)

Pattern: Hiring grows slower than revenue (productivity improvement)

Warning signs:

Hiring faster than revenue growth:

Example:
- Year 1: £1M revenue, 6 people = 6 per £1M
- Year 2 (projecting): 50 employees, only £5M revenue = 10 per £1M (getting worse!)
- Signal: Company is burning cash faster than revenue growth

Action:
- Slow hiring (wait for revenue to catch up)
- Improve productivity (do more with same people)
- Identify issue (is revenue stuck? Team not productive?)

Churn:

Monitor voluntary employee churn:
- <10% annual churn: Healthy
- 10-15% churn: Investigate (might be OK, industry dependent)
- >15% churn: Problem (losing talent, culture issue, comp issue)

Cost of churn:
- Each departure: £30K hiring cost for replacement
- 20 people, 15% churn = 3 departures
- Cost: 3 × £30K = £90K annually just on replacement hiring
- Plus lost productivity

**Optimizing team efficiency**

Leverage tools and automation:

Instead of hiring:
- Use automation (tools, scripts)
- Use off-shore/lower-cost resources
- Use freelancers/contractors (if don't need full-time)
- Use software to scale (fewer people needed)

Example:

Current: 3 customer success people at £150K (supporting 500 customers)
Productivity: 166 customers per CSM

Optimization:
- Build CSM tools (in-app health tracking, automated alerts)
- Hire CSM coordinator (£40K) to handle admin
- Now 2 CSMs + 1 coordinator still supports 500 (maybe more)
- Cost: £40K + £100K (1.5 CSMs) = £140K (saving £10K!)

Cross-functional teams:

Instead of large specialized teams:
- Have smaller cross-functional teams
- Each person wears multiple hats

Example:

Product team:
- Traditional: 3 product managers, 10 engineers
- Cost: £230K (product) + £750K (engineering) = £980K

Cross-functional:
- 2 product managers (each owns product area)
- Paired with 4 engineers (each knows their product area)
- Total: 6 people at £450K (saves £530K!)

Trade-off: Less specialization, but faster decision-making

Productivity improvements:

Track productivity metrics:

| Role | Metric | Target | Current |
|---|---|---|---|
| Engineer | Revenue per engineer | £3M | £2.5M |
| Sales rep | Revenue per rep | £1M | £900K |
| CSM | Customers per CSM | 100 | 80 |
| Marketer | Lead quality | - | Improving |

If productivity low:
- Training? (skills gaps)
- Tools? (outdated systems)
- Process? (inefficient workflows)
- Staffing? (understaffed, too busy)

Adjust and remeasure monthly

**Common hiring mistakes**

Mistake 1: Hire too fast

Problem: Revenue £5M, hire 20 people to support £15M growth (optimistic)
Result: Revenue misses, payroll is 40% of revenue (unsustainable)

Fix: Hire to current + growth visibility
Impact: Lean, sustainable payroll

Mistake 2: Hire wrong roles

Problem: Hire VP Sales before having repeatable sales process
Result: VP expensive (£150K+) but can't scale what doesn't exist

Fix: Hire sales rep first, prove model, then add manager
Impact: Efficient scaling

Mistake 3: Don't measure hiring impact

Problem: Hire engineer, don't track if revenue grows
Result: Can't tell if hiring is working

Fix: Track revenue per engineer (or role)
Impact: Know if hiring is paying off

Mistake 4: Don't account for ramp time

Problem: Hire 5 people in month 1, expect full productivity month 1
Result: Disappointed with low output initially

Fix: Plan for 3-month ramp, set expectations
Impact: Realistic planning

Mistake 5: Ignore comp competitiveness

Problem: Pay below market rate
Result: Can't hire good talent, lose people to competitors

Fix: Benchmark salaries annually, stay competitive (not necessarily highest, but reasonable)
Impact: Attract and retain talent

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "operating-expense-management-and-control", "sales-compensation-and-incentive-structures", "metrics-dashboard-design-kpi-tracking", "risk-management-and-contingency-planning"],
    faq: [
      { q: "What's a healthy headcount to revenue ratio?", a: "Metric: Employees per £1M ARR. Early stage (Series A): 5-8 per £1M. Growth stage (Series B): 4-5 per £1M. Mature (Series C+): 3-4 per £1M. Example: £10M revenue with 40 employees = 4 per £1M (healthy growth stage). Monitor monthly and track trends (hiring should pace slower than revenue growth, not faster)." },
      { q: "How much does it cost to hire someone?", a: "Direct cost: £20-25% of first year salary as recruiter fee. Indirect: £2-5K onboarding and training. Ramp cost: Lost productivity for 3 months (40% productivity gap × 3 months × salary). Total: £25-35K per hire. Example: £60K salary hire costs £27K total. ROI: Hire if expected contribution exceeds cost (salesperson generating £400K revenue = good ROI)." },
      { q: "What headcount should I plan for each function?", a: "Engineering: 1 per £3M revenue (growth stage). Sales: 1 per £750K revenue generated. Marketing: 1-2 per £10M revenue. Customer success: 1 per 50-100 SMB customers (1 per 5-10 enterprise). Finance/Ops: 1 per £3-5M revenue. Example: £10M company might have ~50 people (25 engineers, 7 sales, 3 marketing, 8 CS, 7 admin/finance/HR)." }
    ],
    videoUrl: ""
  }
];

export default batch365Articles;