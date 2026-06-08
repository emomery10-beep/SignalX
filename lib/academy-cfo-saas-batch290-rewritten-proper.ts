import { AcademyArticle } from "@/types/academy";

export const batch290Articles: AcademyArticle[] = [
  {
    slug: "employee-retention-and-turnover-analysis",
    title: "Employee Retention and Turnover Analysis: Measuring Team Stability",
    description: "Master retention metrics. Track turnover, analyze causes, reduce attrition.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["employee retention", "turnover", "attrition rate", "retention metrics", "employee churn", "engagement"],
    keyTakeaways: [
      "Turnover basics: Annual turnover = (# departures / avg headcount) × 100. Healthy: 10-15% annually (5-20% depending on stage/industry). Cost per departure: 50-200% annual salary (recruiting, training, lost productivity). Example: 50-person company, 5 departures/year = 10% turnover, 1 engineer at £120K salary = £60-240K total cost. Priority: Reduce key role departures (engineering, sales leadership). Monitor: Monthly/quarterly turnover rate by department.",
      "Root causes of turnover: (1) Compensation (underpaid vs market), (2) Career growth (no advancement), (3) Manager quality (bad relationship), (4) Culture fit (values mismatch), (5) Burnout (overwork), (6) Lack of autonomy (micromanagement). Action: Stay interviews (when considering leaving, why? what keeps you?), exit interviews (what went wrong?), engagement surveys (track satisfaction). Cost: 5-10 hours per interview. Benefit: Identify fixable issues before people leave.",
      "Retention strategy: (1) Competitive pay (benchmark market), (2) Career paths (clear advancement), (3) Equity (long-term incentives), (4) Work environment (remote, flexibility), (5) Manager quality (hire good managers), (6) Learning (training, growth). Cost: Varies (pay = 2-5% raises, equity = dilution, training = time/money). Benefit: 1% improvement in retention = 50K employee × 50% cost savings = £25K saved × company size. Focus: First fix pay, then culture, then growth."
    ],
    content: [
      {
        heading: "Analyzing and Improving Employee Retention",
        body: `Building a stable, engaged team.

**Measuring turnover and retention**

Key metrics:
- Turnover rate: (# departures in period / avg headcount) × 100
  - Monthly: Compare each month (spot trends early)
  - Annually: Standard industry comparison

- Regrettable vs unregrettable:
  - Regrettable: Good performer you wanted to keep
  - Unregrettable: Poor performer, good to see go
  - Track separately (regrettable = problem)

- Voluntary vs involuntary:
  - Voluntary: Employee quit (concern)
  - Involuntary: Fired/laid off (necessary)
  - Focus on reducing voluntary

Benchmarks by stage:
| Stage | Healthy Annual Turnover | Cost Impact |
|---|---|---|
| Seed (1-10) | 10-15% | Very high (rebuilding team) |
| Growth (10-50) | 15-20% | High (ramp pain) |
| Scaling (50-200) | 10-15% | Medium (replace + train) |
| Mature (200+) | 5-10% | Lower (larger bench) |

Example calculation:
- Company: 50 people
- 5 departures in year = 10% turnover
- Average cost per departure:
  - Recruiting cost: £10K (recruiter fee, ads, time)
  - Training cost: £20K (ramp time, mentor time)
  - Lost productivity: 3-6 months
  - Knowledge loss: Institutional knowledge
  - Total cost: £50-120K per person (average £80K)
- Total annual turnover cost: 5 × £80K = £400K

**Root cause analysis**

Interview departing employees:
- What triggered decision to look?
- What did we do well? (praise)
- What could we improve? (constructive)
- Where are you going? Why? (competitive intelligence)
- Would you come back? (understand finality)

Common patterns:
| Reason | % of departures | Fix |
|---|---|---|
| Compensation (underpaid) | 25% | Competitive salary review |
| No career growth | 20% | Clear advancement path |
| Bad manager | 20% | Manager training or replacement |
| Burnout/work-life balance | 15% | Workload review, flexibility |
| Culture fit | 10% | Hiring or culture improvement |
| Layoff/restructure | 5% | Strategic changes |
| Other | 5% | Varied |

Stay interviews (critical):
- Interview high performers NOT considering leaving
- Why do they stay? (key retention factors)
- What would make them leave? (risk factors)
- What do they need? (career growth, pay, learning)
- Cost: 1 hour per person, 5-10 key people quarterly
- Benefit: Prevent departures (£80K+ cost each)

**Retention strategy by level**

Engineering retention:
- Compensation: Top quartile (recruit competitively)
- Growth: Clear senior engineer path (not always management)
- Autonomy: Let them own projects
- Learning: Budget for conferences, certifications
- Challenge: Interesting problems, not boring code
- Cost: 5-10% higher pay, conference budget
- Benefit: Lose 1 engineer = 6 months to replace

Sales retention:
- Compensation: Base + commission structure (align incentives)
- Predictability: Clear commission rules (not arbitrary)
- Advancement: Sales team lead, sales management path
- Support: Good marketing, product support (make them successful)
- Culture: Competitive (healthy, not toxic)
- Cost: Competitive comp, support investment
- Benefit: Lose 1 sales person = lost pipeline, team demoralization

Leadership retention:
- Compensation: Market rate + equity (vesting)
- Authority: Real decision-making power
- Vision: Alignment on strategy
- Support: Board/CEO backing
- Equity: Long-term incentive (stay multiple years)
- Cost: Higher pay, meaningful equity
- Benefit: Lose VP = 12+ months to replace, knowledge loss

**Retention initiatives**

Career development:
- Title progression: Junior → Senior → Lead → Manager → Director
- Skill development: Budget £2K-5K per person annually
- Mentorship: Pair juniors with seniors
- Leadership training: Manager development program
- Cost: Budget £50-100 per employee/year
- Benefit: Employees see growth path, stay longer

Compensation review:
- Benchmark: Salary against market (Levels.fyi, Blind, etc.)
- Equity: Ensure competitive grants and vesting
- Bonuses: Performance-based (clear metrics)
- Benefits: Health, retirement, flexibility
- Cost: 2-5% annual increases (inflation + equity)
- Benefit: Retain top talent, improve recruitment

Work environment:
- Remote/hybrid: Flexibility if sustainable
- Work hours: Reasonable expectations
- Equipment: Good hardware, software
- Office/space: Comfortable, collaborative
- Time off: Generous vacation, mental health days
- Cost: £1-3K per employee initial, low ongoing
- Benefit: Better morale, retention, productivity

Culture and engagement:
- All-hands meetings: Quarterly communication
- One-on-ones: Monthly check-ins with managers
- Team events: Quarterly team building (not expensive)
- Feedback: Regular, constructive, not just annual review
- Recognition: Public praise for good work
- Cost: Manager time, occasional events
- Benefit: Better culture, retention, engagement

**Tracking and action**

Dashboard by department:
| Department | Headcount | Departures YTD | Turnover % | Trend | Action |
|---|---|---|---|---|---|
| Engineering | 15 | 2 | 13% | Stable | Monitor |
| Sales | 10 | 3 | 30% | Rising | Investigate |
| Operations | 5 | 0 | 0% | Good | Maintain |
| Total | 30 | 5 | 17% | - | Sales focus |

Monthly monitoring:
- Departures: Track new resignations
- Trend: 3-month moving average (spot trends)
- Action: High-risk departments get attention
- Stay interviews: Schedule with high performers
- Compensation: Review if turnover spiking

Annual planning:
- Retention audit: Department-by-department analysis
- Benchmarking: How do we compare to peers?
- Investment: Where to invest in retention?
- Goals: Reduce turnover by X% (realistic targets)
- Cost-benefit: How much to invest vs cost of turnover?

Example ROI:
- Initiative: Manager training program
- Cost: £20K (training, time)
- Benefit: Reduce turnover 2% (1 less departure)
- Savings: £80K (avoided recruiting, training, lost productivity)
- Net benefit: £60K (3x ROI)

`
      }
    ],
    relatedSlugs: ["hiring-and-talent-acquisition-strategy", "organizational-structure-and-team-design", "founder-compensation-and-equity-structure", "building-sustainable-company-culture-and-values", "executive-presence-and-leadership"],
    faq: [
      { q: "What's a healthy employee turnover rate?", a: "Depends on stage: Early (seed/series A) 15-20% expected (team building). Growth (series B+) 10-15%. Mature 5-10%. Each departure costs 50-200% of salary (recruiting, training, lost productivity). Track regrettable vs unregrettable (focus on keeping good people)." },
      { q: "How do I reduce turnover?", a: "Top reasons to leave: Low pay (fix with market benchmarking), no growth (clear career path), bad manager (training), burnout (workload review). Action: Exit interviews (understand why), stay interviews (prevent departures), compensation review (stay competitive), career development (advancement path)." },
      { q: "How much should I invest in retention?", a: "Cost of one departure: £80-120K (recruiting + training + lost productivity). Retention investment £5-10K per employee/year (training, benefits, environment) worth it if prevents 1 departure per 5-10 employees. Simple ROI: Prevention of 1 departure = 8-12x cost of retention initiative." }
    ],
    videoUrl: ""
  }
];

export default batch290Articles;