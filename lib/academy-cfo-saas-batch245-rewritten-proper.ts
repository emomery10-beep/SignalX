import { AcademyArticle } from "@/types/academy";

export const batch245Articles: AcademyArticle[] = [
  {
    slug: "hiring-and-talent-acquisition-strategy",
    title: "Hiring and Talent Acquisition Strategy: Building Your Team",
    description: "Master hiring. Plan headcount, recruit effectively, close top talent.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["hiring", "recruitment", "talent acquisition", "team building", "hiring strategy", "interview process", "compensation planning"],
    keyTakeaways: [
      "Hiring plan: Annual (budget headcount by role), quarterly (refine plan based on growth). Formula: Revenue per employee (£250-500K typical SaaS). Example: £5M ARR, target £350K per employee = 14 people needed. Current 12, hire 2. Priorities: Sales (revenue-generating), engineering (product), CS (retention). Typical split: Sales 30%, Engineering 30%, CS/support 15%, Marketing 10%, Admin 15%. Timeline: Hire 3 months ahead (long ramp). Cost: £500K salary + £100K recruiting cost + £150K ramp inefficiency = £750K per senior hire (payback 12-18 months).",
      "Recruitment channels: Job boards (LinkedIn, AngelList), recruiting firm (20-30% commission, faster), employee referral (best quality, fastest), networks (founders reach out). Funnel: 100 applications → 10 interviews → 2 offers → 1 hire (typical ratios). Cost: Internal recruiting £50K/year, firm 20-30% commission, time/opportunity cost. Quality: Employee referral > internal recruiting > job boards > firm. Strategy: Heavy employee referral (gift/bonus for hire), recruiting firm for hard-to-fill (senior eng, CFO).",
      "Interview process: 1) Phone screen (5 min, basic qualification), 2) Technical interview (skills, 30-60 min), 3) Hiring manager (role fit, 30 min), 4) Culture interview (team fit, 30 min), 5) Reference checks (do it before offer). Timeline: 2-3 weeks (quick beats slow). Offer: Base salary + equity (vesting 4 years, 1-year cliff). Comp: Benchmark similar companies + stage (early = lower salary, higher equity; mature = higher salary, lower equity). Onboarding: Assigned buddy, 30-60-90 day milestones, regular check-ins (first 3 months critical)."
    ],
    content: [
      {
        heading: "Building a High-Performing Hiring Process",
        body: `Attracting and hiring the right people.

**Hiring plan and budget**

Annual planning:
1. Forecast revenue growth (e.g., 50% growth)
2. Target headcount (revenue per employee, typical £250-500K)
3. Current team size
4. Gap = hire plan

Example:
- Target revenue: £5M
- Revenue per employee: £350K
- Headcount needed: 14
- Current: 12
- Hire: 2 additional (1 sales, 1 CS)

Budget per hire:
- Salary: £80K (avg for growth company)
- Recruiting cost: £5-10K
- Ramp cost (3 months inefficiency): £20K
- Total: £105-115K per hire

**Recruitment strategy**

Channel effectiveness:
| Channel | Cost | Speed | Quality | Volume |
|---|---|---|---|---|
| Employee referral | £2-5K bonus | Very fast | High | Steady |
| Internal recruiting | £40K annual | 4-6 weeks | Medium | 3-5/year |
| Job boards | £0-300/post | 4-8 weeks | Low | High volume |
| Recruiting firm | 20-30% commission | 2-4 weeks | Medium | Steady |
| Networks (founder network) | Relationship | Varies | High | Dependent |

Recommended mix:
- 50% employee referral (best talent, fastest, cheapest)
- 30% internal recruiting team
- 20% recruiting firm (for hard-to-fill roles)

Funnel ratios (typical):
- 100 applications → 10 interviews (10%)
- 10 interviews → 3 offers (30%)
- 3 offers → 2 accepts (67%)
- 2 accepts → 1 start (effective conversion: 1 per 100 applications)

**Interview process and timeline**

5-step process (2-3 weeks total):

Step 1: Phone screen (5 min, recruiter)
- Basic qualification (role fit, expectations)
- Sell role/company

Step 2: Technical screen (30-60 min, hiring manager)
- Assess core skills (for technical roles)
- Can they do the job?

Step 3: Hiring manager interview (30 min, hiring manager)
- Assess fit for role
- Will they succeed?

Step 4: Culture fit interview (30 min, peer/team)
- Assess team culture fit
- Will they thrive here?

Step 5: Reference checks (2-3 references)
- Verify track record
- Avoid surprises

Offer:
- Base salary: Market rate for role + stage
- Equity: 4-year vest, 1-year cliff (typical)
- Sign-on: £5-20K (sign-on bonus, negotiate if needed)

Compensation:
- Early stage (pre-revenue): Low salary, high equity (£60K + 0.5-1%)
- Growth (£1-5M): Medium salary + medium equity (£80K + 0.1-0.5%)
- Scaling (>£5M): Higher salary, lower equity (£100K + 0.05-0.2%)

**Onboarding**

First 30 days (critical for retention):
- Day 1: Welcome, computer setup, office/team intro
- Week 1: Role overview, team meetings, product deep-dive
- Week 2: First projects, pair with buddy
- Week 4: 30-day check-in (how going?)
- Month 3: 90-day review (role fit, ready to ramp?)

Success metrics:
- 90-day retention: 95%+ (if not, hiring problem)
- Time to productivity: 3-6 months (fully productive)
- Satisfaction: Regular check-ins, address issues

`
      }
    ],
    relatedSlugs: ["organizational-structure-and-team-design", "building-sustainable-company-culture-and-values", "financial-planning-and-budgeting"],
    faq: [
      { q: "How do I create a hiring plan?", a: "1. Forecast revenue growth (50% = plan higher headcount). 2. Calculate revenue per employee (£300-400K typical). 3. Determine headcount needed (revenue / per employee). 4. Current team size. 5. Gap = hire plan. Example: £5M revenue, £350 per employee = 14 people, currently 12, hire 2." },
      { q: "What's the best way to recruit?", a: "Best: Employee referral (quality, speed, cost). Second: Internal recruiting team. Third: Recruiting firm (expensive, faster for hard-to-fill). Mix: 50% referral, 30% internal, 20% firm. Funnel: 100 applications → 10 interviews → 3 offers → 2 accepts (1-2% conversion)." },
      { q: "What should I pay?", a: "Benchmark: Similar role, similar company stage. Early (pre-revenue): £60-70K + 0.5-1% equity. Growth (£1-5M): £80-100K + 0.1-0.5%. Scaling (>£5M): £100-130K + 0.05-0.2%. Offer: Base + equity + sign-on (if negotiate). Equity vests 4 years with 1-year cliff." }
    ],
    videoUrl: ""
  }
];

export default batch245Articles;