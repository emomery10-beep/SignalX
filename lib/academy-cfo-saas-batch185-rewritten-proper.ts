import { AcademyArticle } from "@/types/academy";

export const batch185Articles: AcademyArticle[] = [
  {
    slug: "department-budgeting-and-headcount-planning",
    title: "Department Budgeting and Headcount Planning: Building a Scalable Team",
    description: "Master budgeting. Plan headcount, allocate budgets, and build teams that scale efficiently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "budgeting",
      "headcount planning",
      "departmental budget",
      "team planning",
      "headcount forecast",
      "budget allocation",
      "hiring plan",
      "payroll planning",
      "team growth",
      "cost per employee"
    ],
    keyTakeaways: [
      "Headcount ratio: Most SaaS 3-6 employees per £1M ARR. Example: £1M ARR = 3-6 people (lean) to (well-staffed). £10M ARR = 30-60 people. Watch this metric: If ratio getting worse (more people per £M), inefficiency. Use to plan: Target £3M ARR in 2 years, need 9-18 people (plan hiring).",
      "Department budgets: Sales/Marketing 30-40% of revenue (customer acquisition), Engineering 25-30% (product), G&A 10-15% (admin), Other 5-15%. Example: £1M revenue → Sales/Marketing £350K, Engineering £275K, G&A £125K, Other £75K. As revenue scales, OpEx % should decrease (leverage).",
      "Headcount planning: Build hiring plan aligned to revenue. Example: Month 1 (£100K revenue, 5 people) → Month 12 (£150K revenue, 7 people). Plan: 2 sales reps (revenue driver) + 1 CS (retention). Run scenario: If miss revenue, reduce hiring (save burn). Plan conservatively, adjust quarterly."
    ],
    content: [
      {
        heading: "Headcount Ratio and Scaling",
        body: `Building teams proportional to revenue.

**Employees per Million ARR**

Metric: Headcount / (ARR / £1M) = employees per million

Healthy benchmarks:
- Efficient: 3 people per £1M ARR (lean, high productivity)
- Typical: 4-5 people per £1M ARR (well-staffed)
- Heavy: 6+ people per £1M ARR (overstaffed or heavy professional services)

Example:

| ARR | Employees | Ratio | Status |
|-----|-----------|-------|--------|
| £1M | 4 | 4:1 | Typical |
| £2M | 8 | 4:1 | Scaling well |
| £3M | 10 | 3.3:1 | Improving! (leverage) |
| £5M | 15 | 3:1 | Efficient! |

Insight: As revenue grows, ratio improves (leverage). Company getting more productive.

Avoid:
- Ratio worsening (means hiring too fast, inefficient)
- Extreme (0.1:1 = 10 people per £1M = overstaffed)

Use to plan:
- Target: £5M ARR in 3 years
- Efficient ratio: 3:1
- Needed headcount: 15 employees
- Current: 5 employees
- Plan: Hire 10 people over 3 years (3-4 per year)

`
      },
      {
        heading: "Department Budgets by Function",
        body: `Allocating budget across departments.

**Budget Allocation by Department**

| Department | % of Revenue | Example (£100K revenue) |
|------------|---|---|
| Sales & Marketing | 35% | £35K |
| Engineering | 27% | £27K |
| G&A (Finance, HR, Legal) | 13% | £13K |
| Customer Success | 10% | £10K |
| Other | 15% | £15K |
| **Total** | **100%** | **£100K** |

Operating margin: -0% (breakeven at this stage)

As scale improves:
- Sales/Marketing: 35% → 20% (leverage, brand)
- Engineering: 27% → 20% (leverage)
- G&A: 13% → 10% (leverage)
- CS: 10% → 5% (automation, leverage)
- Total OpEx: 85% → 55%
- Operating margin: 15% (profitable!)

**Headcount Breakdown**

Example: 5 people, £1M revenue

| Department | Headcount | Cost | Per-person Cost |
|-----------|-----------|------|---|
| Sales & Marketing | 1.5 | £75K | £50K |
| Engineering | 2 | £150K | £75K |
| G&A | 0.5 | £40K | £80K (higher, often senior) |
| CS | 1 | £40K | £40K |
| **Total** | **5** | **£305K** | **£61K average** |

Note: Cost includes salary + benefits (30% add-on typical).

Budget by headcount:
- Salaries: £305K / 1.3 = £235K (70%)
- Benefits/payroll tax: £70K (20%)
- Tools/equipment: £40K (10%)
- Total: £345K (~3.5% of £10M ARR for 5 people)

`
      },
      {
        heading: "Headcount Planning and Hiring",
        body: `Building a hiring plan aligned to growth.

**Annual Hiring Plan**

Current state: 5 people, £1M revenue, losing money

Goal: £1.5M revenue year-end, breakeven or better

Plan:
- Hire 2 sales reps (drive £500K new revenue)
- Hire 1 engineer (build to support scaling)
- Hire 1 CS person (support growth, reduce churn)
- Total: 4 new hires

Cost:
- Salaries: 4 × £50K avg = £200K
- Benefits/payroll: £60K
- Tools/equipment: £20K
- Total: £280K

Impact:
- New revenue: +£500K (2 reps × £250K each)
- Total revenue: £1.5M
- Total headcount: 9 people
- Ratio: 6:1 (slightly heavy, but on growth trajectory)
- Gross profit: £1.5M × 80% - £280K = £1,200K - £280K = £920K
- Margin improvement: 30% → 61% (significant!)

**Scenario Planning**

Plan conservatively:
- Assume each sales rep closes £200K (not £250K)
- Actual new revenue: 2 × £200K = £400K
- Total revenue: £1.4M

Adjust hiring:
- If miss revenue target, reduce hiring in Q4
- Save £150K (don't hire 4th person)
- Extend to next year

Flexibility:
- Plan Q1-Q3 in detail
- Plan Q4 based on actuals
- Adjust hiring pace if growth slower/faster

**Hiring Timeline**

Month 1-2: Recruit sales reps
Month 2: Sales rep 1 starts
Month 3: Sales rep 2 starts (ramp together)
Month 4: Hire engineer
Month 6: Hire CS person

Total onboarding: 3 months (hiring → onboarded → productive)
Plan accordingly: Need revenue before hiring 6 months later.

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "p-l-statement-architecture-profitability",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "employee-equity-and-stock-options"
    ],
    faq: [
      {
        q: "What's the right headcount for my company?",
        a: "Benchmark: 3-6 employees per £1M ARR. Example: £1M ARR = 3-6 people (lean to typical). £5M ARR = 15-30 people. Track ratio: Should stay stable or improve (not worsen). If ratio worsening, you're hiring too fast (inefficiency). Use to plan: £5M ARR target = 15-20 people. Hire accordingly."
      },
      {
        q: "How do I allocate budget across departments?",
        a: "Typical: Sales/Marketing 35%, Engineering 27%, G&A 13%, CS 10%, Other 15% (totals 100%). As you scale, all improve (leverage): Sales/Marketing drops to 20%, Engineering to 20%, G&A to 10%, CS to 5%, OpEx total 55% (profit 45%)."
      },
      {
        q: "How do I plan hiring?",
        a: "Build plan aligned to revenue goals. Example: Target £1.5M (up from £1M), hire 2 sales reps (£500K new revenue), 1 engineer, 1 CS. Total 4 hires. Cost £280K. Revenue increase £500K → profit improves significantly. Plan conservatively (assume 80% of targets). Adjust quarterly if revenue trending off."
      },
      {
        q: "How much does each employee cost?",
        a: "Salary + benefits (30% add-on) + tools/equipment (5-10%). Example: £50K salary + £15K benefits + £5K tools = £70K total cost. Track: Total payroll should be 50-60% of revenue (healthy ratio). If above 70%, overspending on headcount."
      }
    ],
    videoUrl: ""
  }
];

export default batch185Articles;
