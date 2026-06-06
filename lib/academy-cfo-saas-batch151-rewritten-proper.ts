import { AcademyArticle } from "@/types/academy";

export const batch151Articles: AcademyArticle[] = [
  {
    slug: "department-budgeting-and-headcount-planning",
    title: "Department Budgeting and Headcount Planning: Allocating Resources Across Teams",
    description: "Master departmental budgeting. Plan headcount by function, allocate budgets, forecast costs, and align hiring with business growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "budgeting",
      "headcount planning",
      "department budget",
      "hiring plan",
      "cost allocation",
      "burn rate",
      "salary planning",
      "team scaling",
      "resource allocation",
      "workforce planning"
    ],
    keyTakeaways: [
      "Headcount distribution by function: Sales 30%, Engineering 35%, Customer Success 15%, G&A 20%. Rule: As company grows, keep ratio similar (add sales = add CS proportionally, otherwise sales won't deliver on expectations). Example: £1M ARR company 10 people → £10M ARR should be 100 people (10x scale, same ratio).",
      "Salary ranges by seniority: Junior £40-60K, Mid £60-100K, Senior £100-150K, Lead/Manager £150-200K, Director £200-300K. By location: London 1.0x, San Francisco 1.3x, Eastern Europe 0.6x. Budget: Salary + 30-40% (payroll taxes, benefits). Example: £80K salary = £104-112K fully-loaded cost.",
      "Hiring calendar: Plan 3 months ahead (hiring takes time). Example: Want 2 engineers by Q2, start recruiting Q1. Build pipeline: 10 applicants → 3 interviews → 1 offer. Timeline: 8 weeks from job post to start. Budget: Recruitment costs £5-10K per hire (recruiter fees, interviewing time)."
    ],
    content: [
      {
        heading: "Department Budget Framework",
        body: `How to allocate budget across teams.

**Budget by Function**

Typical distribution (% of operating expense):

Sales & Marketing: 40-50%
- Sales team (reps, managers, ops): 20%
- Marketing (campaigns, tools, team): 15%
- Revenue operations: 5%

Engineering & Product: 30-35%
- Engineers (frontend, backend, infrastructure): 25%
- Product management, design: 5%
- Technical operations: 3-5%

Customer Success: 10-15%
- Customer success managers: 8-10%
- Support (technical support team): 3-5%
- Training, onboarding: 2%

General & Administrative (G&A): 10-15%
- Finance, accounting, legal: 4%
- HR, recruiting: 3%
- Executive team: 3%
- Other (office, insurance, etc): 2-3%

Example: £1M company, £500K operating expense budget

| Function | % | Budget |
|----------|---|--------|
| Sales & Marketing | 45% | £225K |
| Engineering | 35% | £175K |
| Customer Success | 12% | £60K |
| G&A | 12% | £60K |
| **Total** | **100%** | **£500K** |

Adjust based on stage:
- Early (product-market fit): More engineering (build product)
- Growth (selling): More sales & marketing
- Scale (retention): More customer success

**Budget vs Actual Tracking**

Monthly review:

| Department | Budget | YTD Actual | Variance | % |
|------------|--------|-----------|----------|---|
| Sales | £20K | £18.5K | -£1.5K | -7% |
| Engineering | £16K | £16.2K | +£0.2K | +1% |
| Customer Success | £5K | £5.1K | +£0.1K | +2% |
| G&A | £5K | £5.7K | +£0.7K | +14% |
| **Total** | **£46K** | **£45.5K** | **-£0.5K** | **-1%** |

G&A over (legal fees, unexpected costs). Sales under (open headcount). Engineering on track.

Investigate variances >5% (over/under).

**Headcount Planning Template**

Plan 12 months ahead:

| Quarter | Target Revenue | Headcount | Cost | Cost/Revenue |
|---------|---|---|---|---|
| Q1 | £2M | 20 | £90K | 4.5% |
| Q2 | £2.5M | 22 | £98K | 3.9% |
| Q3 | £3M | 25 | £110K | 3.7% |
| Q4 | £3.5M | 28 | £122K | 3.5% |

Pattern: Revenue +75%, headcount +40% (leverage improves margin).

`
      },
      {
        heading: "Salary and Compensation Planning",
        body: `Budget for people costs accurately.

**Salary Benchmarking**

By role and location:

| Role | Junior | Mid | Senior | Manager |
|------|--------|-----|--------|---------|
| Engineer | £60K | £90K | £130K | £160K |
| Product Manager | £55K | £85K | £120K | £150K |
| Designer | £50K | £75K | £110K | £140K |
| Sales Rep | £40K | £70K | £100K | £140K |

Location multiplier:
- London: 1.0x (base)
- San Francisco: 1.4x (expensive)
- New York: 1.3x
- Berlin: 0.85x
- Eastern Europe: 0.6x

Example: Senior engineer in SF = £130K × 1.4 = £182K

**Fully-Loaded Cost**

Base salary + benefits + overhead = fully-loaded

Example (base £80K):

| Component | % | Amount |
|-----------|---|--------|
| Base salary | 100% | £80K |
| Payroll taxes | 15% | £12K |
| Benefits (health, 401k) | 10% | £8K |
| Equipment, tools | 5% | £4K |
| Office space | 8% | £6.4K |
| Recruiting cost | 5% | £4K |
| **Fully-loaded** | **143%** | **£114.4K** |

Rule: Fully-loaded = base × 1.35-1.45 (30-45% overhead).

**Equity Grants**

Add to compensation:

| Role | Salary | Equity (% of company) | Annual value |
|------|--------|----------------------|--------------|
| Engineer | £80K | 0.1% | £80K + equity |
| Manager | £120K | 0.2% | £120K + equity |
| VP | £200K | 0.5% | £200K + equity |

Equity value depends on company valuation (unknown until exit).

Total compensation:
- Cash (salary): Known
- Equity: Potential (if company exits well)

`
      },
      {
        heading: "Hiring Plan and Recruiting Budget",
        body: `Plan hiring 3 months in advance.

**Hiring Timeline**

Q1 plan (for Q2 hiring):
- Month 1: Identify needs, post job, start recruiting
- Month 2: Interview candidates, narrow to top 3-5
- Month 3: Offer and negotiation, start by month end or early Q2

Process timeline: 8-12 weeks from post to start.

**Recruiting Costs**

Internal recruiting: 40 hours per hire × £50/hour = £2K per hire
External recruiter: 15-20% of first-year salary
- Example: £80K salary × 20% = £16K fee

Cost comparison:
- 10 internal hires: 400 hours (2 FTE recruiter) + tools (£20K) = £40K + £20K = £60K total = £6K/hire
- 10 external hires: £80K × 20% × 10 = £160K

Internal + external hybrid: Use external for hard-to-fill roles (VP, specialized engineers).

**Department Hiring Plans**

Sales team (grow from 3 to 5 reps by Q3):
- Q2: Hire 1 rep (8 weeks recruiting)
- Q3: Hire 1 rep (8 weeks recruiting)
- Cost: 2 hires × £12K recruiting fee = £24K

Engineering team (grow from 6 to 10 by Q4):
- Q2: Hire 1 engineer
- Q3: Hire 2 engineers
- Q4: Hire 1 engineer
- Cost: 4 engineers × £16K recruiting fee = £64K

Customer Success (grow from 2 to 4):
- Q2: Hire 1 CSM
- Q4: Hire 1 CSM
- Cost: 2 hires × £8K recruiting fee = £16K

**Budget by Department (Annual)**

| Department | Headcount | Avg Salary | Salary Cost | Overhead (40%) | Total |
|---|---|---|---|---|---|
| Sales | 5 | £70K | £350K | £140K | £490K |
| Engineering | 10 | £100K | £1M | £400K | £1.4M |
| Customer Success | 4 | £60K | £240K | £96K | £336K |
| G&A | 4 | £100K | £400K | £160K | £560K |
| **Total** | **23** | **£90K** | **£1.99M** | **£796K** | **£2.786M** |

Cost as % of revenue:
- Revenue: £10M
- Operating cost: £2.786M
- Operating margin: 72% (healthy)

`
      }
    ],
    relatedSlugs: [
      "headcount-planning-and-compensation",
      "burn-rate-and-cash-runway-analysis",
      "financial-forecasting-modeling",
      "p-l-statement-architecture-profitability",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What's the right headcount distribution?",
        a: "Typical: Sales 30%, Engineering 35%, Customer Success 15%, G&A 20%. Adjust by stage: Early = more engineering. Growth = more sales. Scale = more customer success. Keep ratio consistent as you grow (add people proportionally). Example: £1M ARR = 10 people, £10M ARR = 100 people (10x scale, similar ratio)."
      },
      {
        q: "How much should I budget for salaries?",
        a: "Budget fully-loaded (salary + 35-45% overhead): Junior £54-86K, Mid £81-129K, Senior £176-231K, Manager £216-288K. By location: London 1.0x, SF 1.4x, Eastern Europe 0.6x. Example: £80K base = £108-116K fully-loaded (35-45% overhead includes payroll taxes, benefits, recruiting, equipment)."
      },
      {
        q: "When should I hire for a role?",
        a: "Plan 3 months ahead (hiring takes time). Timeline: 1 month recruiting, 1 month interviews, 1 month offer/start. Example: Want engineer Q2, start recruiting Q1. Budget: Internal recruiting £2K/hire, external recruiter 15-20% first-year salary. Recruit early for key roles (engineering, sales)."
      },
      {
        q: "How do I forecast operating costs?",
        a: "Build by department: Sum salary × headcount + overhead (35-45%) + non-personnel budget (tools, marketing spend, etc). Example: 23 people at £90K avg = £1.99M salaries + £796K overhead = £2.786M total cost. Forecast 12 months quarterly (hire ramp over time = costs increase gradually)."
      }
    ],
    videoUrl: ""
  }
];

export default batch151Articles;
