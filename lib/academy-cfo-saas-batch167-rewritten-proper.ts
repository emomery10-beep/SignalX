import { AcademyArticle } from "@/types/academy";

export const batch167Articles: AcademyArticle[] = [
  {
    slug: "quarterly-business-reviews-and-planning",
    title: "Quarterly Business Reviews and Planning: Staying on Track",
    description: "Master QBRs. Run effective quarterly reviews, assess performance, adjust plans, and align the team around new priorities.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "quarterly business review",
      "QBR",
      "business planning",
      "quarterly planning",
      "performance review",
      "goal setting",
      "business metrics",
      "quarterly goals",
      "plan adjustment",
      "team alignment"
    ],
    keyTakeaways: [
      "QBR cadence: End of each quarter (or start of next). Participants: CEO, functional heads (sales, engineering, support), finance. Duration: 4-6 hours (half-day offsite ideal). Agenda: (1) Review previous quarter actual vs plan (30 min), (2) Analyze variance (why off track?) (30 min), (3) Review company metrics (KPIs, benchmarks) (30 min), (4) Adjust annual plan (60 min), (5) Set next quarter goals (60 min). Output: Updated plan, documented decisions, communicated to team.",
      "Actual vs plan analysis: For each goal, compare actual to plan. Example: Goal \"£120K MRR by Q2\" but actual £105K (88% of target). Questions: Why behind? (churn higher than forecast, new customers lower). Can we catch up? (improve churn by month 5?) If no, adjust plan (£115K MRR new target). This is normal (plans change). Don't ignore variance, investigate root cause.",
      "Quarterly goal setting: 3-5 goals per quarter (focused). Formula: \"Increase [metric] from X to Y by [date]\" with success measure. Example: \"Reduce churn from 2.5% to 2% by Q3 end\" (specific, measurable). Assign owner (person accountable). Communicate to team (all-hands, written plan). Track weekly (short interval keeps focus). At end of quarter, measure achievement (achieved/not achieved/partially)."
    ],
    content: [
      {
        heading: "Running an Effective QBR",
        body: `Structure and agenda for quarterly reviews.

**QBR Participants**

Core team:
- CEO (leads)
- CFO/Finance (brings data, forecast)
- VP Sales (revenue metrics)
- VP Engineering (product capacity, velocity)
- VP Support/CS (customer metrics, churn)

Optional:
- Board member (if startup with board)
- Investor (if raising soon)

Duration: 4-6 hours (half-day, focused)

Preparation (1 week before):
- Gather actuals (revenue, churn, metrics)
- Draft variance analysis (plan vs actual)
- Draft adjusted forecast (if plan changes)
- Create presentation deck

**QBR Agenda (6-hour format)**

**Hour 1: Welcome & Previous Quarter Review**
- CEO frames quarter (30 min)
  - Recap goals from last quarter
  - Celebrate wins
  - Acknowledge misses
- Finance presents actuals (30 min)
  - Revenue vs plan
  - Churn vs plan
  - Headcount vs plan
  - Cash position

**Hour 2: Variance Deep-Dive**
- Why were we above/below plan? (60 min)
  - Revenue miss: Sales pipeline, conversion, ASP issues?
  - Churn surprise: Product issues, CS gaps, market change?
  - Hiring variance: Timeline delays, sourcing challenges?
- Data-driven (not opinions)
- Outcomes: Understand root causes, not blame

**Hour 3: Company Health Check**
- Review all KPIs (60 min)
  - MRR/ARR and growth rate
  - Churn and NRR
  - CAC and LTV (unit economics)
  - Gross margin and burn rate
  - Runway
- Compare to benchmarks (same stage/market)
- Spot trends (improving or declining?)

**Hour 4-5: Annual Plan Adjustment**
- Are we on track to annual goals? (60 min)
  - ARR goal £2M? On track or need adjustment?
  - Profitability goal month 9? Achievable?
  - Headcount goal 30 people? Reality check?
- Adjust plan if necessary (normal!)
  - Example: Year goal £2M but pace suggests £1.5M → adjust to realistic
  - Document rationale (market change, product delays, competitive pressure)
- Revisit next 3 quarters (new forecast)

**Hour 6: Next Quarter Goals**
- Set 3-5 goals for Q+1 (60 min)
  - Each goal: Specific, Measurable, Owner, Success metric
  - Example: "Reduce churn from 2.5% to 2%" (owner: VP CS)
  - Example: "Launch feature X, get 100 customers using it" (owner: VP Eng)
  - Example: "Grow MRR from £120K to £135K" (owner: VP Sales)
- Assign owners and success measures
- Communicate goals to team

**Output from QBR**

- Updated annual plan (2-3 page document)
- Next quarter goals (1-page summary)
- Key decisions documented (pricing change, hiring pause, etc)
- All-hands presentation (share with team)

`
      },
      {
        heading: "Analyzing Variance",
        body: `Understanding what went wrong (or right).

**Variance Framework**

For each plan vs actual variance, ask:

1. What was planned?
2. What was actual?
3. Why is there a gap?
4. What does this mean?
5. What do we do about it?

Example: Revenue miss

Plan: £120K MRR by Q2
Actual: £105K MRR by Q2 end
Variance: -£15K (-12.5%)

**Why was there a gap?**

Breakdown:
- New customers plan: 20, actual: 15 (-5 customers)
- Expansion plan: £5K, actual: £3K (-£2K)
- Churn plan: 2%, actual: 2.5% (-£3K impact)

Root causes:
1. Sales pipeline weakness (missed 5 customers)
   - Cause: Sales rep left in June (open position)
   - Impact: 25% lower capacity
   - Fix: Hire replacement + catch-up

2. Expansion lower (customers not expanding)
   - Cause: CS team at capacity, not proactive
   - Impact: No upsells happening
   - Fix: Hire CS person, build expansion program

3. Churn higher (0.5% worse than plan)
   - Cause: Product bugs, poor onboarding
   - Impact: More customer loss
   - Fix: Fix bugs, improve onboarding

**Categorizing Variances**

Structural (permanent, adjust plan):
- Market change (economy down, demand lower)
- Product delay (feature took longer than expected)
- Competitive pressure (competitor launched, took share)
- Decision: Adjust annual plan downward

Temporary (catch up possible):
- Staffing gap (person left, replacement coming)
- Seasonal (Q1 always slow, Q2 catches up)
- One-time (large customer churned)
- Decision: Adjust but expect recovery

Positive (opportunity to exceed):
- Product landed well (higher adoption than expected)
- New channel works (marketing channel outperforming)
- Market tailwind (industry growth accelerating)
- Decision: Invest more to capitalize

**Communicating Variance**

Bad: "We missed revenue target" (no insight)
Better: "We missed revenue by £15K (12.5%) due to:
- Sales gap (-5 customers): Rep departure in June
- Churn increase (-£3K): Onboarding issues in product
- Expansion lower (-£2K): CS team capacity constraint

Next quarter plan adjusted from £135K to £125K.
Actions: Hire sales rep (starting month 1), improve onboarding (month 1), hire CS person (month 2)."

(Clear, root-cause focused, actionable)

`
      },
      {
        heading: "Setting Quarterly Goals",
        body: `Creating goals that drive focus and accountability.

**Goal Formula**

Each goal should be:
- Specific: Clear, measurable target
- Measurable: Can evaluate success
- Owned: One person accountable
- Time-bound: Due by quarter end

Template: "[Owner] will [action] to achieve [metric] from [current] to [target] by [date]"

Example: "VP CS will implement proactive CS program to reduce churn from 2.5% to 2% by Q3 end"

Breakdown:
- Owner: VP CS
- Action: Implement proactive CS program
- Metric: Churn
- Current: 2.5%
- Target: 2%
- Deadline: Q3 end

**Typical Quarterly Goals**

Revenue goal:
- "Grow MRR from £120K to £135K (+12.5%) by Q2 end"
- Owner: VP Sales
- Success: Hit £135K or higher

Retention goal:
- "Reduce churn from 2.5% to 2% by Q3 end"
- Owner: VP CS
- Success: Churn ≤2%

Product goal:
- "Launch feature X, achieve 100 active users by Q2 end"
- Owner: VP Engineering
- Success: 100+ users actively using feature

Profitability goal:
- "Reduce burn rate from £30K to £25K/month by Q4 end"
- Owner: CEO
- Success: Monthly burn ≤£25K

Efficiency goal:
- "Reduce CAC from £4K to £3K by Q3 end through improved conversion"
- Owner: VP Marketing
- Success: CAC ≤£3K

**Goal Setting Process**

1. Draft goals (CEO with functional heads)
   - Based on annual plan
   - Ambitious but achievable
   - 3-5 goals (not 20)

2. Socialize (gather feedback)
   - Are they realistic?
   - Do we have resources?
   - Are they aligned?

3. Finalize and assign owners
   - Owner accountable for success
   - Owner defines success metrics
   - Owner commits to achieve

4. Communicate to team
   - All-hands meeting
   - Written goal document
   - Track progress weekly

**Tracking Progress**

Weekly standup (15 min):
- Each goal owner: % complete (0-100%)
- Status: On track / At risk / Off track
- Blockers: What's needed

Example:

Week 4 of Q2:
- Revenue: 75% complete (on track for £135K)
- Churn: 60% complete (at risk, currently 2.3%, target 2%)
- Feature launch: 90% complete (feature in beta, launch next week)

Monthly deep-dive:
- Review goal progress (mid-quarter)
- Adjust if off-track
- Celebrate wins

End of quarter:
- Final measurement
- Achieved / not achieved / partially achieved
- Lessons learned for next quarter

`
      },
      {
        heading: "Quarterly Planning Best Practices",
        body: `Tips for effective planning and execution.

**Planning Principles**

Principle 1: Base plans on data
- Use actual actuals (not opinions)
- Use benchmarks (external context)
- Use cohort analysis (segment performance)
- Example: If SMB churn 3%, enterprise 1%, plan accordingly

Principle 2: Plan conservatively
- Better to beat than miss
- 80% of stretch goal more credible than 120%
- Example: Plan £130K if believe possible £150K (leave upside)

Principle 3: Adjust plans when reality changes
- Plans aren't carved in stone
- Market change, product delay, competition → adjust
- Don't force old plan when circumstances differ

Principle 4: Communicate decisions clearly
- Document what changed and why
- Tell team reasons
- Avoid flip-flopping (makes team cynical)

**Frequency Adjustments**

Typical: Quarterly review, annual plan with quarterly re-forecasts

Option for fast-changing environments:
- Monthly metrics review (quick, 1 hour)
- Quarterly deep-dive (4-6 hours, as above)
- Annual plan review (half-day, in-depth)

Option for stable environments:
- Quarterly review (as standard)
- Annual plan (set once, adjust minimally)

Customize cadence to your volatility.

**Cascading Goals**

CEO/Company goals → Departmental goals → Individual goals

Example:

Company goal: "Grow MRR from £120K to £135K"

Sales goal: "Close 15 new customers (vs 12 plan)"
- How: Improve pipeline quality, longer sales cycle, account expansion

CS goal: "Keep churn at 2%, maintain expansion at 5%"
- How: Reduce onboarding time, proactive QBRs, expand product use

Engineering goal: "Launch feature X, keep uptime >99.9%"
- How: Improves adoption, keeps customers happy

Individual goals flow from departmental goals (alignment).

**Board Communication**

If you have board or investors:
- Share actual vs plan quarterly
- Show variance analysis
- Communicate plan changes proactively
- Build confidence through transparency

Example board deck section:
"Q2 Results: MRR £105K (87% of target)

Variance: -£15K due to:
- Sales team gap (-5 customers)
- Churn spike (-£3K)
- Lower expansion (-£2K)

Q3 Plan: £125K (adjusted)
Actions: Hire sales rep, improve onboarding, expand CS

Path to annual goal (£2M) still achievable via Q4 acceleration"

Proactive communication builds trust.

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "burn-rate-and-cash-runway-analysis",
      "unit-economics-ltv-cac-payback",
      "p-l-statement-architecture-profitability"
    ],
    faq: [
      {
        q: "What should I cover in a QBR?",
        a: "Four sections: (1) Last quarter actual vs plan (variance analysis), (2) Company health (all KPIs, benchmarks), (3) Annual plan adjustment (realistic forecast), (4) Next quarter goals (3-5 goals, specific/measurable). Duration: 4-6 hours. Participants: CEO, finance, sales, engineering, CS."
      },
      {
        q: "How do I set good quarterly goals?",
        a: "Formula: \"[Owner] will [action] to achieve [metric] from [current] to [target] by [date].\" Example: \"VP Sales will improve conversion to grow MRR from £120K to £135K by Q2 end.\" Must be specific, measurable, owned, time-bound. 3-5 goals max (avoid distraction). Track weekly, adjust if off-track."
      },
      {
        q: "What if we're off plan significantly?",
        a: "Don't ignore it. Analyze root cause (data-driven): Why are we down? Is it permanent (adjust plan) or temporary (catch up)? Adjust annual plan realistically. Communicate to board/investors proactively. Focus on actions to improve next quarter."
      },
      {
        q: "How often should I do a QBR?",
        a: "Quarterly is standard (every 3 months). Option: Monthly metrics review (1 hour, quick) + quarterly deep-dive (4-6 hours, detailed). Works better as company scales. Customize to your business volatility."
      }
    ],
    videoUrl: ""
  }
];

export default batch167Articles;
