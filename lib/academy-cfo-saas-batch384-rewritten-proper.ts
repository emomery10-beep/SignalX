import { AcademyArticle } from "@/types/academy";

export const batch384Articles: AcademyArticle[] = [
  {
    slug: "saas-scenario-planning-and-stress-testing",
    title: "Scenario Planning and Stress Testing: Preparing for SaaS Uncertainty",
    description: "Master scenario planning. Build financial stress tests, plan for downturns, and make resilient decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["scenario planning", "stress testing", "financial resilience", "contingency", "downturn planning"],
    keyTakeaways: [
      "Three-scenario framework: Build base, upside, and downside models. Base case: Current trajectory (60% probability). Upside: Everything goes right — key deals close, product launch succeeds, expansion accelerates (20% probability). Downside: Economic downturn — churn increases 50%, new sales slow 30%, fundraising delayed (20% probability). Use expected value for planning, downside for cash management. Example: Base runway 14 months, downside runway 8 months — act on downside for cash decisions.",
      "Stress test variables: Test each independently then combined. Key variables: (1) Churn doubles (2% → 4% monthly), (2) New sales drop 50%, (3) Average deal size decreases 25%, (4) Sales cycle lengthens 50%, (5) Fundraising delayed 6 months, (6) Key customer churns (largest customer leaves). For each: Model cash impact and runway impact. Combined stress test (multiple simultaneously) shows worst case. Example: Churn doubles + new sales halve = runway drops from 14 to 6 months.",
      "Contingency action plans: Pre-define triggers and actions. Level 1 (runway <12 months): Freeze non-essential hiring, cut marketing by 20%, renegotiate vendor contracts. Level 2 (runway <9 months): Hiring freeze, cut marketing 50%, defer product initiatives. Level 3 (runway <6 months): Layoffs (10-20%), cut all discretionary spend, emergency fundraise or bridge. Having pre-defined plans means faster response. Delay costs: Every month of delayed action in a downturn costs 1-2 months of runway."
    ],
    content: [
      {
        heading: "Building Financial Resilience Through Scenario Planning",
        body: `Preparing for uncertainty so you can respond quickly and confidently.

**Three-scenario financial model**

Building the base case:

Start with current trajectory:
- Revenue: Current growth rate continues (with seasonal adjustment)
- Expenses: Planned headcount + committed costs
- Cash: Current balance minus projected burn

Base case assumptions example:

| Assumption | Value | Basis |
|---|---|---|
| Monthly ARR growth | 7% | Trailing 6-month average |
| Monthly churn | 2.0% | Trailing 12-month average |
| Expansion rate | 1.0%/month | Trailing 6-month average |
| New hires | 3/quarter | Approved hiring plan |
| S&M spend growth | 5%/quarter | Budget |
| Cloud cost growth | 3%/month | Aligned with customer growth |

Base case 12-month projection:

| Quarter | ARR | Revenue | Expenses | Net burn | Cash |
|---|---|---|---|---|---|
| Q1 | £1,300K | £325K | £450K | £375K | £2,125K |
| Q2 | £1,560K | £390K | £480K | £270K | £1,855K |
| Q3 | £1,870K | £468K | £510K | £126K | £1,729K |
| Q4 | £2,244K | £561K | £540K | +£63K | £1,792K |

Runway: Cash-flow positive by Q4 (base case)

Building the upside case:

Assumptions changed from base:
- ARR growth: 10% monthly (strong pipeline converts)
- Churn: 1.5% (retention initiatives succeed)
- Expansion: 1.5% (new pricing tier drives upsells)
- New hires: 4/quarter (accelerated hiring)
- Enterprise deal: £200K ACV closes in Q2

Upside 12-month projection:

| Quarter | ARR | Revenue | Expenses | Net burn | Cash |
|---|---|---|---|---|---|
| Q1 | £1,400K | £350K | £460K | £330K | £2,170K |
| Q2 | £1,850K | £463K | £500K | £111K | £2,059K |
| Q3 | £2,400K | £600K | £540K | +£180K | £2,239K |
| Q4 | £3,100K | £775K | £580K | +£585K | £2,824K |

Runway: Cash-flow positive by Q2, growing cash by Q4

Building the downside case:

Assumptions changed from base:
- ARR growth: 3% monthly (market slowdown)
- Churn: 3.5% (economic pressure on customers)
- Expansion: 0.5% (customers tightening budgets)
- New hires: 1/quarter (cautious hiring)
- Key customer churns: £80K ARR lost in Q2

Downside 12-month projection:

| Quarter | ARR | Revenue | Expenses | Net burn | Cash |
|---|---|---|---|---|---|
| Q1 | £1,180K | £295K | £440K | £435K | £2,065K |
| Q2 | £1,200K | £300K | £450K | £450K | £1,615K |
| Q3 | £1,250K | £313K | £460K | £441K | £1,174K |
| Q4 | £1,310K | £328K | £465K | £411K | £763K |

Runway: 6 months remaining at Q4 (critical)

**Stress test scenarios**

Individual stress tests:

Test 1: Churn doubles
- Current: 2% monthly → Stress: 4% monthly
- Impact: ARR growth drops from 7% net to 4% net
- Cash impact: £200K additional revenue loss over 12 months
- Runway impact: Reduced by 3 months

Test 2: New sales halve
- Current: £80K new ARR/month → Stress: £40K
- Impact: ARR growth drops from 7% to 3.5%
- Cash impact: £480K less revenue over 12 months
- Runway impact: Reduced by 5 months

Test 3: Average deal size drops 25%
- Current: £8K ACV → Stress: £6K ACV
- Impact: Same number of deals, 25% less revenue per deal
- Cash impact: £120K less revenue over 12 months
- Runway impact: Reduced by 2 months

Test 4: Sales cycle lengthens 50%
- Current: 60 days → Stress: 90 days
- Impact: Delayed revenue recognition, pipeline conversion slows
- Cash impact: £100K delayed revenue (timing shift)
- Runway impact: Reduced by 1-2 months

Test 5: Key customer churns
- Largest customer: £120K ARR (12% of total)
- Impact: Immediate ARR drop of £120K
- Cash impact: £120K lost revenue over 12 months
- Runway impact: Reduced by 2 months

Combined stress test:

Scenario: Economic recession
- Churn doubles (4%)
- New sales halve
- Deal size drops 25%
- Sales cycle lengthens 50%

Combined impact:
- ARR barely grows (possibly shrinks)
- Cash burn accelerates
- Runway: Drops from 14 months to 5-6 months (critical)

This is the scenario you must be prepared for

**Contingency action plans**

Pre-defined response levels:

Level 1: Caution (runway 10-12 months)

Trigger: Downside indicators appearing (churn up, pipeline soft)

Actions:
| Action | Monthly savings | Implementation |
|---|---|---|
| Freeze non-critical hiring | £15K | Immediate |
| Cut discretionary marketing | £10K | 2 weeks |
| Renegotiate vendor contracts | £5K | 4-6 weeks |
| Pause non-critical projects | £5K | 2 weeks |
| Total monthly savings | £35K | |

Impact: Extends runway 3-4 months
Trade-off: Slightly slower growth, preserves optionality

Level 2: Alert (runway 7-9 months)

Trigger: Confirmed downturn, metrics deteriorating

Actions:
| Action | Monthly savings | Implementation |
|---|---|---|
| Full hiring freeze | £25K | Immediate |
| Cut marketing 50% | £20K | 2 weeks |
| Defer product initiatives | £15K | 2 weeks |
| Reduce travel to zero | £5K | Immediate |
| Negotiate rent reduction | £5K | 4-8 weeks |
| Total monthly savings | £70K | |

Impact: Extends runway 5-7 months
Trade-off: Growth slows significantly, but company survives

Level 3: Emergency (runway <6 months)

Trigger: Severe downturn, fundraising not possible

Actions:
| Action | Monthly savings | Implementation |
|---|---|---|
| Layoffs (15-20%) | £50K | 2-4 weeks |
| Cut all non-essential spend | £30K | Immediate |
| Reduce founder salary | £10K | Immediate |
| Emergency bridge financing | - | 4-8 weeks |
| Explore strategic options | - | Ongoing |
| Total monthly savings | £90K | |

Impact: Extends runway 8-12 months
Trade-off: Painful, but survival focused

**Layoff planning (if needed)**

Decision framework:

When to cut:
- Only when other cost reductions are insufficient
- When runway is below 6 months without action
- When growth doesn't justify current team size

How to size:
- Calculate target burn rate (based on required runway)
- Example: Need £100K/month net burn (from £180K current)
- Savings needed: £80K/month
- Salary savings needed: £60K (after other cuts)
- Average salary: £60K/year = £5K/month
- Headcount reduction: 12 people

Who to retain:
- Revenue-generating roles (sales with pipeline)
- Product-critical engineers (core product)
- Customer-facing roles (protect revenue base)
- Leadership (strategic decision-making)

Who to reduce:
- Support roles that can be consolidated
- Non-critical projects
- Roles with overlapping responsibilities
- Recent hires still in ramp period

Execution:
- Do it once (one round of cuts, not multiple smaller rounds)
- Be generous with severance (1-3 months)
- Communicate honestly to remaining team
- Support departing employees (references, job search help)

Cost of layoffs:
- Severance: 1-3 months salary per person
- Legal: £5-10K for employment law advice
- Productivity loss: 2-4 weeks of reduced productivity
- Recruitment cost to rehire later: £20-30K per person

Example:
- 12 people at £60K average
- 2 months severance: 12 × £10K = £120K one-time
- Monthly savings: 12 × £5K = £60K
- Breakeven on severance: 2 months
- Runway extension: 8+ months

**Monitoring and early warning**

Weekly health dashboard (during uncertainty):

| Indicator | Green | Amber | Red | Current |
|---|---|---|---|---|
| Cash runway | >12 mo | 8-12 mo | <8 mo | 11 mo |
| Pipeline coverage | >3x | 2-3x | <2x | 2.5x |
| Monthly churn | <2% | 2-3% | >3% | 2.2% |
| New deal velocity | Growing | Flat | Declining | Flat |
| Customer sentiment | Positive | Mixed | Negative | Mixed |
| Team morale | High | Moderate | Low | Moderate |

When 2+ indicators are Amber: Move to Level 1 contingency
When any indicator is Red: Evaluate Level 2 contingency
When 2+ indicators are Red: Implement Level 2 immediately

Response speed matters:

Delayed action compounds:
- Month 1: Don't act, burn £180K
- Month 2: Don't act, burn £180K (total: £360K lost)
- Month 3: Finally act, save £70K/month going forward

If acted in Month 1:
- Month 1: Act, burn £130K (save £50K)
- Month 2: Full savings, burn £110K
- Month 3: Full savings, burn £110K (total: £350K vs £470K)

Early action preserves options. Late action forces harder decisions.

`
      }
    ],
    relatedSlugs: ["risk-management-and-contingency-planning", "cash-flow-management-and-working-capital", "financial-planning-and-budgeting", "saas-budget-planning-and-variance-analysis", "saas-revenue-forecasting-models"],
    faq: [
      { q: "How do I build scenario models for my SaaS company?", a: "Build three scenarios: Base (60% probability, current trajectory), Upside (20%, everything goes right), Downside (20%, economic downturn). Key variables to adjust: growth rate, churn rate, deal size, sales cycle, hiring pace. Use base case for planning, downside for cash management. Example: Base runway 14 months, downside 8 months — make cash decisions based on downside." },
      { q: "What should I stress test in my financial model?", a: "Test individually then combined: (1) Churn doubles, (2) New sales halve, (3) Deal size drops 25%, (4) Sales cycle lengthens 50%, (5) Key customer churns, (6) Fundraising delayed 6 months. Combined stress test (recession scenario) shows worst case. Example: Churn doubles + new sales halve = runway drops from 14 to 5-6 months. This is what you must be prepared for." },
      { q: "When should I cut costs and how much?", a: "Pre-define triggers: Level 1 (runway 10-12 months): Freeze hiring, cut discretionary spend (save ~£35K/month). Level 2 (runway 7-9 months): Full hiring freeze, cut marketing 50% (save ~£70K/month). Level 3 (runway <6 months): Layoffs 15-20%, cut all non-essential (save ~£90K/month). Every month of delayed action costs 1-2 months of runway. Act early — late action forces harder decisions." }
    ],
    videoUrl: ""
  }
];

export default batch384Articles;
