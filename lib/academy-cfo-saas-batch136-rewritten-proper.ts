import { AcademyArticle } from "@/types/academy";

export const batch136Articles: AcademyArticle[] = [
  {
    slug: "quarterly-business-reviews-and-planning",
    title: "Quarterly Business Reviews and Planning: Strategic Rhythm for Growth Companies",
    description: "Master quarterly planning. Run effective QBRs, set targets, track progress, and align teams on quarterly goals.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "quarterly business review",
      "QBR",
      "quarterly planning",
      "business planning",
      "quarterly goals",
      "OKRs",
      "quarterly targets",
      "progress tracking",
      "strategic planning",
      "team alignment"
    ],
    keyTakeaways: [
      "QBR structure: 1-day offsite, review prior quarter (what happened? why?), plan next quarter (goals, initiatives, owners). Example: Q1 review - MRR £100K → £130K (30% growth, beat target £125K), churn 2.5% (worse than 2% target, action needed). Q2 plan - Target £165K MRR (27% growth), reduce churn to 2%, launch new product.",
      "Goal setting: Use OKRs (Objectives + Key Results). Objective = qualitative goal (\"improve retention\"). Key Result = measurable outcome (\"reduce churn from 2.5% to 2%\"). Example: Objective \"dominate SMB segment\", KRs = 50 new SMB customers, £500K SMB ARR, 95% SMB retention. 3-5 OKRs per quarter (focused, not everything).",
      "Accountability: Each OKR has owner (VP responsible for success). Weekly 1-1s between owner and CEO to track progress. Monthly town halls to update all-hands. Transparency = every employee knows quarter goals and progress. Q-end: Grade OKRs (0-100% achievement). Document learnings, adjust next quarter."
    ],
    content: [
      {
        heading: "Understanding Quarterly Cadence",
        body: `Most growth companies operate on quarterly rhythm (3-month cycles).

**Why Quarterly?**

Monthly: Too short (hard to move needle, churn noise)
Annual: Too long (hard to course-correct, miss opportunities)
Quarterly: Goldilocks (long enough for execution, short enough to adjust)

Quarterly rhythm:
- Month 1-2: Execute on plan
- Month 3: Review + plan for next quarter
- Month 1-2: Execute new plan
- ...repeats

This creates rhythm: Plan → Execute → Review → Adjust → Repeat

**Quarterly Business Review (QBR) Structure**

QBR is typically 1-day offsite for leadership team (CEO, VPs, possibly board).

Agenda:

Morning Session (Review):
9am-10am: Prior quarter results (what happened?)
- Revenue: £100K → £130K (30% MoM growth)
- Churn: 2.5% (target was 2%, miss)
- Customers: 150 (target 160, miss)
- Burn: £40K (budget £35K, over)

10am-11am: Analysis (why did it happen?)
- Growth beat: Better-than-expected sales productivity
- Churn miss: New competitor entered market, took 5 customers
- Customer count miss: Sales slower than forecast
- Burn over: Unexpected contractor costs

11am-12pm: Wins and learnings
- Launched new feature (drove adoption)
- Hired new sales person (high productivity)
- Fixed support issue (improved NPS)

Afternoon Session (Plan):
1pm-2pm: Next quarter priorities
- Focus: Reduce churn (address competitor threat)
- Focus: Accelerate sales (hit growth targets)
- Focus: Improve margins (reduce burn)

2pm-3pm: Goal setting (OKRs)
- See OKRs section below

3pm-4pm: Finalize plan
- Department-level goals tied to company OKRs
- Resource allocation
- Key initiatives and timelines

**Metrics to Review**

Standard QBR metrics:

Revenue:
- MRR, growth %, ARR
- Revenue by segment
- Bookings vs revenue

Retention:
- Monthly churn %
- NRR %
- Customer count

Unit economics:
- CAC, LTV
- LTV/CAC ratio
- CAC payback

Operations:
- Burn rate, cash runway
- Headcount, hiring progress
- Gross margin

Example dashboard:

| Metric | Q1 Target | Q1 Actual | Status | Q2 Target |
|--------|-----------|-----------|--------|-----------|
| MRR | £125K | £130K | ✓ Beat | £165K |
| Growth | 25% | 30% | ✓ Beat | 27% |
| Churn | 2% | 2.5% | ✗ Miss | 2% |
| NRR | >100% | 105% | ✓ | >110% |
| Customers | 160 | 150 | ✗ Miss | 175 |
| CAC | £5K | £5.2K | ↑ | £4.8K |
| LTV/CAC | >5x | 4.6x | ↓ | >5.5x |
| Burn | £35K | £40K | ↑ | £37K |
| Runway | 18+ mo | 16 mo | ↓ | 18+ mo |

This snapshot tells the story: Beat on growth, missed on retention and headcount, CAC increasing (concerning), burn above budget.

**Frequency and Timing**

QBR usually held in first 2 weeks of new quarter:
- Q1 QBR: Early January (review Q4, plan Q1)
- Q2 QBR: Early April
- Q3 QBR: Early July
- Q4 QBR: Early October

Plus Annual Planning in November (full year ahead).

**Communication After QBR**

Post-QBR, communicate to all-hands:
- All-hands meeting or video
- Share Q1 results and Q2 priorities
- Transparency: Everyone knows what matters

Example all-hands message:
"Q1 was great (30% growth), but churn upticked (2.5% vs 2% target). This is due to new competitor. In Q2, we're focusing on: (1) Retention improvements, (2) Accelerating growth, (3) Improving margins. Here are the initiatives and who's leading them."

This creates alignment (everyone working toward same goals).
`
      },
      {
        heading: "OKRs: Objectives and Key Results",
        body: `OKRs are how you set and track quarterly goals.

**OKR Framework**

Objective:
- Qualitative, directional
- Inspirational but achievable
- Example: "Become the fastest-growing segment"

Key Results:
- Quantitative, measurable
- 3-5 per objective typically
- Example: "Acquire 50 new enterprise customers, reach £2M enterprise ARR, maintain 95% enterprise retention"

Example OKR:

Objective: Reduce churn and improve retention
Key Results:
- Reduce monthly churn from 2.5% to 2%
- Improve NRR from 105% to 110%
- Achieve 95% Year-1 retention

This OKR is SMART (Specific, Measurable, Achievable, Relevant, Time-bound).

**Company-Level vs Department-Level OKRs**

Company OKRs (set by CEO, leadership):
1. Achieve £165K MRR (27% growth from £130K)
2. Reduce churn to 2% (from 2.5%)
3. Maintain burn <£37K/month

Department OKRs (cascade from company):

Sales OKRs (tied to revenue):
- Acquire 50 new customers
- Achieve 110% of sales quota
- Improve CAC payback from 9 to 8 months

CS OKRs (tied to retention):
- Reduce churn to 2%
- Improve NPS from 45 to 50
- Increase customer expansion revenue 15%

Engineering OKRs (tied to product):
- Launch new feature (improves retention)
- Reduce support tickets 20% (product quality)
- Achieve 99.5% uptime

Each department's OKRs contribute to company OKRs.

**Writing Good OKRs**

Bad OKR:
"Improve product" (too vague)
"Hit sales targets" (not inspiring)

Good OKR:
"Become the easiest-to-use product in our category" (inspiring, clear direction)

Bad Key Result:
"Work on feature X" (activity, not outcome)

Good Key Result:
"Increase feature adoption from 30% to 70%" (outcome-focused)

**OKR Grading**

At end of quarter, grade each OKR:

Grading scale:
- 1.0: Achieved 100% (exceeded expectations)
- 0.7: Achieved 70% (on track, good)
- 0.5: Achieved 50% (partially achieved)
- 0.3: Achieved <50% (missed significantly)
- 0.0: Did not achieve (failed)

Target: Aim for 0.7 on average (about 70% achievement).
- All 1.0: Targets too easy (set higher next quarter)
- All 0.3-0.5: Targets too hard (set lower next quarter)
- Mix of 0.7-1.0: Goldilocks (good goal-setting)

Example grading:

| OKR | Target | Actual | Grade |
|-----|--------|--------|-------|
| £165K MRR | 100% | £160K (97%) | 0.97 |
| Churn 2% | 100% | 2.1% (95%) | 0.95 |
| Burn £37K | 100% | £38K (103%) | 0.8 |
| NPS 50 | 100% | 48 (96%) | 0.96 |

Average: 0.92 (very strong quarter).

**OKR Tracking**

During quarter, track progress:

Weekly: Team lead updates progress on OKRs
- MRR on pace for £165K? (Current £140K, on track)
- Churn improving? (Currently 2.3%, target 2.0%, needs work)

Monthly: CEO reviews with department heads
- Are we tracking toward OKRs?
- Any blockers or changes needed?
- Course-correct if needed

This isn't about hitting 100% (might indicate targets too low).
It's about pushing hard and learning from results.

**Common OKR Mistakes**

Mistake 1: Too many OKRs
- Company OKRs should be 3-5 (focused, not everything)
- Department OKRs should be 3-5
- Anything more dilutes focus

Mistake 2: Confusing OKRs with tasks
- Bad: "Launch feature X" (task, activity)
- Good: "Increase feature adoption 40%" (outcome)

Mistake 3: Setting OKRs in vacuum
- Bad: Sales OKR disconnected from product roadmap
- Good: Sales, CS, engineering OKRs aligned

Mistake 4: Not grading OKRs
- Bad: Set OKRs, never look back
- Good: Grade at end of quarter, learn from results

Mistake 5: OKRs too easy or too hard
- Bad: Hit 100% every quarter (targets too easy)
- Bad: Hit 20% every quarter (targets too hard)
- Good: Aim for 70-80% (challenging but achievable)
`
      },
      {
        heading: "Running Effective QBRs",
        body: `How to actually execute a good QBR.

**Before the QBR (1 week prep)**

Assign prep work:
- Finance: Prepare financial results (P&L, metrics, dashboards)
- Sales: Prepare revenue analysis (by segment, channel, rep)
- CS: Prepare retention analysis (churn, NRR, customer health)
- Product: Prepare feature metrics (adoption, impact)

Create pre-read document:
- All metrics, charts, analysis
- Sent 2 days before QBR
- Leadership reads in advance
- Saves 1-2 hours of meeting time during QBR

Set agenda:
- Review (2 hours)
- Analyze (1 hour)
- Plan (2 hours)
- Total: 5 hours (can fit in one day with lunch break)

**During the QBR**

Review session:
- Present results vs targets
- Celebrate wins (team morale)
- Acknowledge misses (honesty)
- No blame (focus on what happened)

Example review narrative:
"Q1 was strong: hit revenue targets (£130K actual vs £125K target), beat growth (30% vs 25% target). Churn upticked to 2.5% (target 2%) due to new competitor entering market. We've identified 5 customers at risk, CS team is working with them. Headcount miss (150 vs 160 customers) due to slower sales ramp (new SDR ramping now, expect acceleration Q2)."

This is honest, acknowledges both wins and misses, provides context.

Analysis session:
- Why did wins happen? (replicate)
- Why did misses happen? (avoid or fix)
- What changed in market? (adapt)

Example analysis:
- Q1 growth beat: Better sales productivity (new sales person onboarded, becoming top performer)
- Churn uptick: New competitor launched, undercutting on price. We're responding with: (1) Superior feature set, (2) Customer success attention, (3) Value messaging
- Headcount miss: Sales cycle longer than forecast (more discovery needed). Adjusted forecast for Q2

This informs planning (what to do next).

Plan session:
- Set company OKRs for next quarter
- Department heads align (departments → company OKRs)
- Resource allocation
- Key initiatives and owners

Document and communicate:
- QBR summary (1-page results + OKRs)
- All-hands presentation
- Department-specific priorities

**Common QBR Pitfalls**

Mistake 1: QBR as blame session
- Bad: Focus on who missed targets (demotivating)
- Good: Focus on what happened and how to improve (learning)

Mistake 2: QBR too long
- Bad: 8-hour QBR (draining, loses focus)
- Good: 5-hour offsite (productive, day trip)

Mistake 3: Not enough data preparation
- Bad: CEO gathering numbers during meeting (wastes time)
- Good: Pre-read document circulated, discussion ready

Mistake 4: Disconnected OKRs
- Bad: Sales OKRs about revenue, Product OKRs about features (not aligned)
- Good: All OKRs tie back to company strategy

Mistake 5: No follow-up
- Bad: Set OKRs, never mention them again
- Good: Weekly updates on progress, adjust mid-quarter if needed
`
      }
    ],
    relatedSlugs: [
      "board-reporting-investor-communications",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "investor-dashboard-and-metrics-reporting",
      "growth-accounting-and-advanced-unit-economics"
    ],
    faq: [
      {
        q: "How often should we do QBRs?",
        a: "Every quarter (4x per year): Q1 (Jan), Q2 (Apr), Q3 (Jul), Q4 (Oct). Plus annual planning in Nov/Dec (plan full next year). Typically 1-day offsite for leadership team. Followed by all-hands communication (share results and priorities with full team)."
      },
      {
        q: "What metrics should we review in QBRs?",
        a: "Revenue (MRR, growth %, ARR), retention (churn, NRR, customer count), unit economics (CAC, LTV, ratio, payback), operations (burn, runway, headcount, margin). Create dashboard with actual vs target for each. Use to tell story: What happened? Why? What's next?"
      },
      {
        q: "What are OKRs and how do we set them?",
        a: "OKRs = Objectives (qualitative, inspirational) + Key Results (quantitative, measurable). Example: Objective \"Dominate SMB segment\" with KRs \"50 new SMB customers, £500K SMB ARR, 95% SMB retention.\" Set 3-5 company OKRs per quarter, cascade to department OKRs. Grade at end of quarter (aim for 70% achievement)."
      },
      {
        q: "How do we ensure accountability for OKRs?",
        a: "Each OKR has an owner (VP responsible). Weekly 1-1s with CEO to track progress. Monthly town halls to update team. End of quarter: Grade OKRs (0-100% achievement). Document learnings, adjust next quarter. Transparency (everyone knows goals and progress) drives accountability."
      }
    ],
    videoUrl: ""
  }
];

export default batch136Articles;
