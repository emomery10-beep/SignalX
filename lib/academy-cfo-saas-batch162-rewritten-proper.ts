import { AcademyArticle } from "@/types/academy";

export const batch162Articles: AcademyArticle[] = [
  {
    slug: "metrics-dashboard-design-kpi-tracking",
    title: "Metrics Dashboard Design and KPI Tracking: What to Measure and Why",
    description: "Master dashboard design. Choose the right KPIs, build dashboards that drive decisions, and measure what matters to your business.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 8,
    keywords: [
      "metrics dashboard",
      "KPI tracking",
      "business metrics",
      "key performance indicators",
      "dashboard design",
      "performance measurement",
      "metric selection",
      "data visualization",
      "business analytics",
      "reporting"
    ],
    keyTakeaways: [
      "KPI selection: Start with company goals. If goal is \"grow to £10M ARR\", track: MRR/ARR growth, new customer acquisition, churn, NRR (expansion). If goal is \"profitability\", track: Gross margin, operating margin, CAC payback, unit economics. Choose 4-6 KPIs max (more = distraction). Each KPI should directly impact goal. Example: If not focused on churn, don't track it daily (track quarterly).",
      "Dashboard hierarchy: (1) Executive dashboard (CEO/board): 5-6 KPIs, monthly cadence, trend line, actual vs target. (2) Functional dashboards (sales, support, etc): 8-12 KPIs relevant to function, weekly updates. (3) Operational dashboards (daily): Specific metrics for roles. Example: Sales dashboard shows pipeline, CAC, win rate. Support dashboard shows response time, churn drivers. No single dashboard for all.",
      "Presentation: Show context (actual vs target, trend, benchmark). Bad: \"MRR £100K\". Good: \"MRR £100K, target £110K (91%), up 5% MoM, vs benchmark £95K (beating by 5%)\". Bad dashboard wastes everyone's time. Good dashboard makes decisions obvious (\"growth slowing, take action\")."
    ],
    content: [
      {
        heading: "Choosing Your KPIs",
        body: `Selecting metrics that matter.

**Start with Company Goals**

Define annual goals first, then select KPIs to measure them.

Example goal: "Reach £5M ARR profitably"

KPIs to track:
1. MRR (measure growth toward £5M)
2. New customer acquisition (growth driver)
3. Churn (retention, opposite of growth)
4. Gross margin (profitability component)
5. Operating margin (profitability outcome)
6. CAC payback (sustainability)

Each KPI directly supports the goal. Ignore metrics that don't.

**The 4-6 KPI Rule**

Humans can't track 50 metrics. Choose 4-6 top-level KPIs.

Bad: 25 metrics (everyone focuses on nothing)
Good: 6 metrics (everyone knows priorities)

Top SaaS KPIs (pick most relevant):

Revenue metrics:
- MRR/ARR (primary company health)

Growth metrics:
- New customer acquisition (growth driver)
- NRR (expansion, net retention)

Retention metrics:
- Churn (opposite of health)

Profitability metrics:
- Gross margin (unit economics health)
- Operating margin (path to profitability)

Unit economics:
- CAC payback (acquisition sustainability)

Efficiency:
- Magic number (growth per S&M spend)

Choose 4-6 that matter most for your company stage.

**KPI by Company Stage**

Early stage (£0-1M ARR):
- Focus: Growth (4-5 KPIs)
- Metrics: MRR, new customers, churn, CAC payback, runway
- Ignore: Margin, operating costs (not yet important)

Growth stage (£1-10M ARR):
- Focus: Growth + unit economics (5-6 KPIs)
- Metrics: MRR, new customers, churn, CAC payback, NRR, gross margin
- Ignore: Operating margin (still spending on growth)

Scale stage (£10M+ ARR):
- Focus: Profitability + growth (6 KPIs)
- Metrics: ARR, ARR growth %, gross margin, operating margin, CAC payback, churn
- Ignore: New customer count (focus on cohort quality)

**Metric Frequency**

Not all metrics need daily tracking.

| Metric | Frequency | Reason |
|--------|-----------|--------|
| MRR/ARR | Monthly | Revenue cycles |
| Churn | Monthly | Track cohort trends |
| CAC | Quarterly | Acquisitions batch together |
| NRR | Quarterly | Expansion trends smooth |
| Margin | Monthly | Cost changes frequent |
| Runway | Monthly | Cash changes frequently |

Daily tracking:
- Pipeline (sales)
- Support tickets (operations)
- Website traffic (marketing)

Weekly tracking:
- Customer growth rate
- Support metrics
- Basic operational health

Monthly tracking:
- Core financial metrics
- Churn/retention trends

Quarterly tracking:
- CAC cohort analysis
- Profitability review
- Strategic metrics

`
      },
      {
        heading: "Building Your Dashboard",
        body: `Designing dashboards that drive action.

**Dashboard Hierarchy**

Level 1: Executive Dashboard (CEO/Board)
- 5-6 KPIs
- Monthly cadence
- Trend + target
- 1-page summary

Level 2: Functional Dashboards (VP/Manager)
- 8-12 KPIs by function
- Weekly updates
- Alerts if off-track

Level 3: Operational Dashboards (Team)
- Specific to role
- Daily updates
- Real-time alerts

**Executive Dashboard Example**

| Metric | Current | Target | Trend | Status |
|--------|---------|--------|-------|--------|
| MRR | £100K | £110K | ↑ 5% | 91% |
| New Customers | 15 | 20 | ↓ 3% | 75% |
| Churn | 2.2% | 2% | ↑ 0.2% | 110% ✗ |
| Gross Margin | 78% | 75% | ↑ 2% | ✓ |
| Operating Margin | -5% | -3% | ↓ 2% | 167% ✗ |
| Runway | 12 mo | 18 mo | ↓ 1 mo | 67% |

Interpretation:
- Growth (MRR) on track
- Churn worsening (investigate)
- Margin improving
- Runway declining (keep eye on profitability)

**Sales Dashboard Example**

| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Pipeline | £500K | £600K | ↓ |
| Close Rate | 25% | 30% | ↓ |
| ACV | £10K | £10K | → |
| CAC | £4K | £4K | → |
| Sales cycle | 30 days | 25 days | ↑ |

Interpretation:
- Pipeline weak (need more leads)
- Close rate declining (improve sales process)
- Sales cycle lengthening (investigate delays)

**Support Dashboard Example**

| Metric | Current | Target | Trend |
|--------|---------|--------|-------|
| Response time | 45 min | 30 min | ↑ |
| Resolution time | 6 hours | 4 hours | ↓ |
| CSAT | 82% | 85% | ↓ |
| Churn (support-driven) | 2.2% | 1.5% | ↑ |

Interpretation:
- Response time slow (hire or train)
- Resolution improving
- CSAT declining (investigate issues)
- Support contributing to churn

`
      },
      {
        heading: "Dashboard Presentation",
        body: `Making dashboards actionable.

**Context is Everything**

Bad presentation:
- MRR: £100K
- Churn: 2.2%
- Gross margin: 78%

(Is this good or bad? No context.)

Good presentation:
- MRR: £100K (target £110K, +5% MoM, vs peer £95K)
- Churn: 2.2% (target 2%, up from 2% last month, vs peer 1.8%)
- Gross margin: 78% (target 75%, +2% QoQ, vs peer 80%)

Context enables decisions:
- MRR on track, growth happening
- Churn worsening (action needed)
- Margin ahead of plan and peers

**Actual vs Target**

Always show progress to goal.

| Metric | Actual | Target | % of Target | Status |
|--------|--------|--------|------------|--------|
| MRR | £100K | £110K | 91% | ⚠️ |
| Churn | 2.2% | 2% | 110% | ✗ |
| CAC | £4K | £4K | 100% | ✓ |

Status codes:
- ✓ (90-100% of target)
- ⚠️ (75-90% of target)
- ✗ (<75% of target)

Visual cues save time (color + icon = instant understanding).

**Trend Lines**

Show direction (up, down, flat).

Good: "MRR £100K, target £110K, +5% MoM (accelerating toward target)"
Better: Graph showing trend (line going up = confidence, line going down = concern)

Trend over time:
- Last 3-6 months
- Helps spot patterns
- Shows if improving or declining

Example:
- MRR: May £90K → Jun £95K → Jul £100K (good trend)
- Churn: May 1.8% → Jun 2% → Jul 2.2% (bad trend)

**Benchmark Context**

Compare to industry or self.

"MRR growth 5% vs peer average 3.5% (outperforming)"
"Churn 2.2% vs peer average 1.8% (underperforming, investigate)"

Benchmarks provide perspective.

`
      },
      {
        heading: "Using Dashboards to Drive Decisions",
        body: `Making dashboards actionable.

**Weekly Metrics Review**

Cadence: Every Monday morning (15 min)

Questions:
1. Are we on track to goals?
2. What's changed since last week?
3. What needs attention?

Decision framework:

On track (90%+):
- Keep doing what you're doing
- Celebrate wins

At risk (75-90%):
- Investigate causes
- Plan actions
- Review next week

Off track (<75%):
- Urgent action needed
- Adjust plan
- Daily check-ins

Example:
- MRR on track (91%)
- Churn off track (110% vs target 2%, actual 2.2%)
- Action: CS team meeting to investigate churn root causes

**Monthly Financial Review**

Cadence: End of month

Review:
- All 6 core KPIs
- Actual vs forecast
- Trends (3-month view)
- Variance (why off plan?)
- Action items for next month

Output: 1-page summary for board/investors.

**Alert System**

Set thresholds for alerts.

| Metric | Alert Threshold | Action |
|--------|---|---|
| Runway | <6 months | Board meeting on funding |
| Churn | >3% monthly | CS emergency plan |
| CAC payback | >12 months | Marketing efficiency review |
| Gross margin | <70% | Cost reduction plan |

Automated alerts (email, Slack) when thresholds hit.

**Quarterly Business Review (QBR)**

Cadence: End of quarter

Review:
- All KPIs (6-month trend)
- Performance vs annual plan
- Adjustments needed
- Next quarter targets

Participants: Full leadership team

Output: Board presentation, adjusted annual plan.

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "burn-rate-and-cash-runway-analysis",
      "financial-forecasting-modeling",
      "growth-accounting-and-advanced-unit-economics",
      "quarterly-business-reviews-and-planning"
    ],
    faq: [
      {
        q: "How many KPIs should I track?",
        a: "4-6 top-level KPIs (prevents distraction). Each KPI should directly impact your annual goal. Example: If goal is \"£5M ARR profitably\", track MRR, new customers, churn, gross margin, operating margin, CAC payback. Don't track 25 metrics (no one focuses). Start with 6, trim to what matters."
      },
      {
        q: "What KPIs should every SaaS company track?",
        a: "Top 4: (1) MRR/ARR (revenue growth), (2) Churn (retention), (3) Gross margin (unit economics), (4) CAC payback (acquisition efficiency). Optional: NRR (expansion), operating margin (profitability path), magic number (growth efficiency). Pick based on your stage and goals."
      },
      {
        q: "How often should I review dashboards?",
        a: "Daily operational metrics (pipeline, support tickets). Weekly review meeting (15 min, check if on track). Monthly deep-dive (analyze variances, adjust plan). Quarterly business review (full strategy adjustment). Cadence builds discipline and catches issues early."
      },
      {
        q: "What makes a good dashboard?",
        a: "Simplicity: 5-6 KPIs only. Context: Show actual vs target vs trend vs benchmark. Clarity: Red/yellow/green status at a glance. Actionability: When you see the dashboard, you know what to do. Bad dashboard: 50 metrics, no context, no clear actions."
      }
    ],
    videoUrl: ""
  }
];

export default batch162Articles;
