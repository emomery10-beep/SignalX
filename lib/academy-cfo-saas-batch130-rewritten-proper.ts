import { AcademyArticle } from "@/types/academy";

export const batch130Articles: AcademyArticle[] = [
  {
    slug: "metrics-dashboard-design-and-kpi-tracking",
    title: "Metrics Dashboard Design and KPI Tracking: Building the Dashboard That Drives Decisions",
    description: "Master dashboard design. Build effective metrics dashboards, select meaningful KPIs, and use data to drive business decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "metrics dashboard",
      "KPI tracking",
      "dashboard design",
      "business metrics",
      "performance indicators",
      "real-time dashboards",
      "business intelligence",
      "data visualization",
      "metric definitions",
      "dashboard tools"
    ],
    keyTakeaways: [
      "Dashboard design principle: One page, <10 metrics, clear trends. Include: revenue (MRR, growth %), retention (churn, NRR), unit economics (CAC, LTV, ratio), operations (burn, headcount, runway). Example dashboard: 3 rows, 3 columns, 9 metrics. Each metric shows: current value, target, trend (up/down/flat), comparison. Update daily or weekly, share with team/board.",
      "KPI selection: Start with 3-5 top metrics (what defines success?). Example for SaaS: Growth % (top KPI), churn (defines sustainability), LTV/CAC (defines efficiency). Not every metric is KPI—only ones tied to company goals. Avoid metric creep (don't track 50 metrics, focus on few that matter).",
      "Leading vs lagging: Lagging metrics (revenue, profit) show what happened. Leading metrics (pipeline, feature adoption, signup rate) predict what will happen. Dashboard should include both. Example: MRR (lagging), pipeline (leading). Use leading metrics to steer, lagging to confirm."
    ],
    content: [
      {
        heading: "Dashboard Design Principles",
        body: `A well-designed dashboard is one page, visual, and focused.

**Dashboard Elements**

Good dashboard includes:

1. Time period at top (January 2025)
2. Key metrics (9-12 metrics max)
3. Trends (up/down arrows or sparklines)
4. Comparisons (vs target, vs prior month)
5. Color coding (green = good, red = bad, yellow = watch)

Example layout:

Top row (Revenue):
- MRR £100K (target £100K) ↑ +8% MoM
- Growth 8% MoM (target 10%) ↓ -2%
- ARR £1.2M (running rate)

Middle row (Retention):
- Monthly churn 2.1% (target 2%) ↗ +0.1%
- NRR 115% (target >110%) ✓
- Customer count 125 (up from 123)

Bottom row (Health):
- Burn £40K/month (budget £35K) ↑
- Runway 20 months (target 12+) ✓
- Headcount 15 (planned 16 by month-end)

**Visual Design Principles**

1. Color coding
   - Green: On target or exceeding
   - Yellow: Close to target, watch
   - Red: Missing target, needs action

2. Trend indicators
   - ↑ Improving (good or bad depending on metric)
   - ↓ Declining (good or bad depending on metric)
   - → Flat (depends on metric)

Example:
- Revenue ↑ = Good
- Churn ↑ = Bad
- Burn ↓ = Good
- Growth ↓ = Bad (unless declining from unsustainable level)

3. Sparklines vs numbers
   - Number: 125 customers
   - Sparkline: Small chart showing 120, 121, 123, 125 (trend over time)
   - Combined: 125 ↑ [small upward chart]

4. Meaningful precision
   - Don't show: MRR £100,247.38 (too precise, not meaningful)
   - Show: MRR £100K (rounded, clear)
   - Exception: Customer churn 2.1% (precision matters for small %)

**Dashboard Update Frequency**

Daily (real-time):
- For very fast-moving metrics (viral products, e-commerce)
- Usually not necessary for SaaS

Weekly:
- Standard for SaaS dashboards
- Sufficient for board visibility
- Captures weekly patterns

Monthly:
- For detailed analysis (P&L, full financials)
- Board review once per month

Most effective: Weekly dashboards for team, monthly detailed for board.

**Tools for Building Dashboards**

Spreadsheet (Google Sheets, Excel):
- Pros: Simple, familiar, flexible
- Cons: Manual updates, error-prone, not real-time
- Best for: Early-stage, simple dashboards

BI Tools (Tableau, Looker, Mode):
- Pros: Automated updates, real-time, beautiful
- Cons: Expensive (£500-5K+/month), requires setup
- Best for: Growth-stage, complex dashboards, data team

Investor platforms (Carta, Visible, Lattice):
- Pros: Built for investors, includes cap table
- Cons: Expensive, less flexible
- Best for: Raising capital, board management

Native product dashboards (Mixpanel, Segment, Stripe):
- Pros: Real-time, integrated
- Cons: Only own metrics, not integrated across company
- Best for: Specific function (product usage, payments)

Most early-stage SaaS start with spreadsheet, graduate to BI tool at £5-10M ARR.

**Example Dashboards by Role**

CEO Dashboard:

| Metric | Value | Target | Trend |
|--------|-------|--------|--------|
| MRR | £100K | £105K | ↑ 8% |
| Growth | 8% MoM | 10% MoM | ↓ |
| Churn | 2.1% | 2% | ↑ |
| Burn | £40K | £35K | ↑ |
| Runway | 20 mo | 12+ mo | ✓ |
| Customers | 125 | 130 | ↑ |

Sales Dashboard:

| Metric | Value | Target | Trend |
|--------|-------|--------|--------|
| Pipeline | £500K | £600K | ↓ |
| Deal win rate | 25% | 30% | ↓ |
| Sales quota attainment | 85% | 100% | ↓ |
| New customers | 8 | 10 | ↑ |
| CAC | £6K | £5K | ↑ |

Engineering Dashboard:

| Metric | Value | Target | Trend |
|--------|-------|--------|--------|
| Deploy frequency | 5/week | 5/week | ✓ |
| Bug escape rate | 2% | <2% | ✓ |
| Performance (P95) | 150ms | <200ms | ✓ |
| Feature adoption | 60% | >50% | ✓ |
| Tech debt | 15% | <20% | ✓ |

Different dashboards for different functions. One CEO dashboard per board, departmental dashboards for teams.
`
      },
      {
        heading: "Selecting and Defining KPIs",
        body: `KPI = Key Performance Indicator (the few metrics that matter most).

**What Makes a Good KPI?**

Good KPI:
1. Tied to business goal (why are we measuring this?)
2. Measurable (can track quantitatively)
3. Actionable (can do something to improve it)
4. Owned by a person/team (clear responsibility)

Bad KPI:
- Vanity metric (looks good but doesn't drive decisions)
- Lagging-only (can't act on it)
- Unclear ownership (nobody responsible)

Example good KPI:
- "Monthly churn <2%" (goal: retention, measurable, sales/CS owns it, actionable: improve onboarding)

Example bad KPI:
- "Website visitors" (vanity metric, doesn't drive revenue, hard to act on)

**KPI by Function**

Sales KPIs:
- New customer acquisition (target: 10/month)
- Sales productivity (£1M ARR per salesperson)
- Win rate (% of qualified leads that convert)
- Sales cycle (average days from first call to close)
- Pipeline coverage (pipeline / quota ratio, target 3-4x)

Marketing KPIs:
- Cost per acquisition (target: <£5K)
- Marketing pipeline contribution (% of qualified leads from marketing)
- CAC payback period (target: <12 months)
- Brand awareness (survey/research metric)
- Organic traffic (% of traffic from organic search)

Product KPIs:
- Feature adoption (% of customers using key features)
- User engagement (daily/monthly active users)
- Product health score (composite of engagement + NPS + churn)
- Time to value (days until customer sees first value)
- Support deflection (% of issues resolved by product/docs)

CS KPIs:
- Customer retention (% of customers who renew)
- Net Revenue Retention (revenue from existing customers)
- Customer satisfaction (NPS, CSAT)
- Time to resolution (average days to resolve support ticket)
- Health score accuracy (% of at-risk customers flagged correctly)

Finance KPIs:
- Monthly Recurring Revenue (growth indicator)
- Gross Margin (profitability)
- Burn Rate (runway indicator)
- Payback period (customer acquisition efficiency)
- Cash runway (months until out of cash)

**KPI Cadence**

Frequency of review:

Daily: Sales pipeline, website downtime, critical bugs
Weekly: MRR, growth %, churn, new customers, support backlog
Monthly: Unit economics, customer health scores, expenses vs budget
Quarterly: NRR, market analysis, strategic progress
Annual: Market share, competitive position, long-term goals

Not all metrics reviewed daily. Focus on fastest-moving.

**KPI Targets**

Set targets based on:
1. Historical performance (how have we done?)
2. Benchmarks (what do peers do?)
3. Strategic goals (where do we want to go?)

Example target-setting:

Current: 6% MoM growth
Benchmark: 8% MoM (fast SaaS)
Goal: 10% MoM (aggressive)

Targets:
- Month 1: 7% (increase from 6%)
- Month 2: 8% (continue increase)
- Month 3: 8% (stabilize)
- Month 4+: 9-10% (reach goal)

Targets should stretch but be achievable (if miss consistently, morale drops).

**Tracking KPI Progress**

Chart KPIs over time:

Example MRR tracking:

Month: Jan, Feb, Mar, Apr, May
MRR: 80K, 86K, 93K, 100K, 108K
Target: 85K, 90K, 97K, 105K, 113K
Status: On/Below/Below/Below/Below

MRR tracking shows growth slowing (starting below target by Apr).

Action: Investigate growth drivers (sales productivity? churn increase?).

**KPI vs Vanity Metrics**

Vanity metrics look good but don't drive decisions:

Vanity: "Website visitors up 50% YoY"
Real metric: "Website to trial conversion rate 5%" (shows quality)

Vanity: "£10M fundraise!"
Real metric: "Runway extended to 24 months" (shows impact)

Vanity: "5000 customers"
Real metric: "Average ARR per customer £10K, 95% NRR" (shows quality)

Focus on metrics that matter, not those that sound good.

**Reporting KPIs to Stakeholders**

Monthly deck for board should include:

Slide 1: Key metrics snapshot
- MRR and growth %
- Churn and NRR
- Burn and runway

Slide 2: KPI variance
- Which KPIs on target? Which off?
- Why are we off target?
- What are we doing about it?

Slide 3: Key wins (progress on goals)
- "Launched feature X (increased adoption to 60%)"
- "Improved CAC payback from 10 to 8 months"
- "New customer segment launched (targeting Y)"

Slide 4: Challenges (risks to KPIs)
- "Growth slowing (need sales productivity improvement)"
- "Churn up in SMB segment (investigating product fit)"
- "Burn increasing faster than expected (hiring ahead of revenue)"

This format shows KPI performance and explains the story.
`
      },
      {
        heading: "Leading vs Lagging Metrics",
        body: `Not all metrics are equal. Some predict the future, others confirm the past.

**Lagging Indicators (Outcome)**

Measure what already happened:
- Revenue (money received)
- Profit (money left after expenses)
- Customer churn (customers who left)
- Market share (our % of market today)

Problem with lagging only:
- Can't act on them (event already occurred)
- By the time you see decline, problem happened months ago

Example:
- Month 1: See revenue decline
- But sales pipeline was weak 2 months ago (cause happened months earlier)
- Now too late to fix current month

**Leading Indicators (Input)**

Predict what will happen:
- Pipeline (potential revenue in future)
- Website traffic/trial signups (future customers)
- Feature adoption (future expansion revenue)
- Customer health scores (future churn)
- Employee satisfaction (future turnover/productivity)

Advantage:
- Can act on them (time to fix before problem)
- Month-to-month early warning system

Example:
- Month 1: See weak pipeline (early warning)
- Action: Hire sales support, increase marketing
- Month 2-3: Pipeline fills, revenue protected

**Leading/Lagging by Function**

Sales:

Leading:
- Pipeline (£500K in opportunities)
- Qualified leads (50 in sales process)
- Sales conversation rate (% of leads who meet sales)

Lagging:
- Revenue (deals closed)
- Win rate (% of deals that close)
- Sales cycle length (how long deals take)

Product:

Leading:
- Trial conversion rate (% who try who convert)
- Feature adoption (% using new feature)
- NPS trend (sentiment changing)

Lagging:
- Customer churn (customers who left)
- Renewal rate (% who renew)
- Revenue per customer (actual spend)

Support:

Leading:
- Support ticket volume (early signal of issues)
- First response time (quick feedback)
- Issue resolution time (fixing fast)

Lagging:
- Customer satisfaction (CSAT, NPS)
- Support-related churn (customers leaving due to support)
- Repeat tickets (same issue, multiple times)

**Dashboard Mix**

Best dashboards mix both:

Example dashboard:

Leading (what we expect):
- Sales pipeline: £500K (expect £80K revenue next month)
- Trial signups: 200 (expect 10 to convert, assuming 5% conversion)
- Feature adoption: 60% (expect expansion revenue)

Lagging (what happened):
- MRR: £100K (actual revenue achieved)
- Churn: 2% (customers who left)
- Revenue per customer: £8K/month

Together they tell story:
- Pipeline strong (leading) → expect good month
- MRR hitting target (lagging) → pipeline prediction confirmed

If pipeline weak but MRR strong:
- Discrepancy (doesn't match)
- Question: What's driving current revenue? Is pipeline weakening real?
- Action: Investigate leading indicator (is pipeline actually weak, or measurement wrong?)

**Using Leading Metrics to Steer**

Example: Monitor trial signup rate

Week 1: 30 signups (on track for 120/month)
Week 2: 28 signups (below pace)
Week 3: 22 signups (concerning trend)

Action (at week 3):
- Increase marketing spend
- Improve website conversion
- Run test campaign

Result (if fixed by week 4):
- Week 4: 32 signups (recovery)
- Month total: 112 signups (slight miss, but recovered)

If waited until month-end to see lower revenue:
- Too late to fix current month
- Would see impact in next month's revenue

Leading metrics allow faster response.

**Dashboard Example: Full Mix**

Daily standup dashboard:

| Metric | Type | Value | Target | Trend |
|--------|------|-------|--------|--------|
| Website traffic | Leading | 5K/day | 6K/day | ↓ |
| Trial signups | Leading | 50/week | 60/week | ↓ |
| Sales pipeline | Leading | £400K | £600K | ↓ |
| Support tickets | Leading | 200/week | 180/week | ↑ |
| **MRR** | **Lagging** | **£100K** | **£100K** | **✓** |
| Churn | Lagging | 2.1% | 2% | ↑ |
| Revenue/cust | Lagging | £8K/mo | £8K/mo | ✓ |
| NPS | Lagging | 45 | >50 | ↓ |

This shows:
- Leading: Website traffic and pipeline weak (warning signs)
- Lagging: MRR still on target (because pipeline was strong last month)
- Action: Address traffic and pipeline decline now (before it impacts next month's MRR)

**Connecting Leading to Lagging**

Build model showing relationship:

Website traffic → Trial signups → Customer acquisition → MRR
(2-3 month lag)

Month 1:
- Traffic: 5K/day (down 10%)
- Prediction: 2-3 months later, MRR will decline (if not fixed)

Month 2:
- Traffic still down
- Actions in Month 1-2 not working
- Prediction: MRR decline imminent (Month 3-4)

Month 3-4:
- MRR declines (prediction confirmed)
- Too late to fix current month
- But leading indicators warned 2 months earlier

Use leading metrics to predict, act before problem reaches lagging metrics.
`
      },
      {
        heading: "Common Dashboard Mistakes",
        body: `How to avoid dashboard pitfalls.

**Mistake 1: Too Many Metrics**

Wrong: 50 metrics on dashboard (overwhelming)
Right: 9-12 metrics max (focused)

Every metric dilutes focus. More metrics = harder to see what matters.

Solution: Start with 3 core KPIs, add others only if actionable.

**Mistake 2: Metrics Without Context**

Wrong: "MRR £100K" (no target, no trend)
Right: "MRR £100K (target £105K) ↑ +8% MoM"

Context matters:
- Target (are we on track?)
- Trend (is it improving?)
- Prior period (what changed?)

**Mistake 3: No Ownership**

Wrong: "Churn 2%" (nobody responsible)
Right: "Churn 2% (owned by VP CS) ↑" (clear owner)

Clear ownership enables accountability.

**Mistake 4: Lagging-Only**

Wrong: Dashboard with only MRR, churn, profit (all lagging)
Right: Mix of leading (pipeline, trial signups) and lagging

Leading metrics allow faster response.

**Mistake 5: Vanity Metrics**

Wrong: "Website visitors up 50%" (feels good, doesn't drive decisions)
Right: "Trial signups up 20%, conversion rate 5%" (actionable)

Focus on metrics that drive decisions, not those that sound good.

**Mistake 6: No Updates**

Wrong: Dashboard built once, never updated
Right: Daily or weekly updates

Stale dashboards create distrust (are these numbers real?).

Commit to update cadence and stick to it.

**Mistake 7: Wrong Audience**

Wrong: One dashboard for CEO, Sales, Product, Support (too detailed for each)
Right: Dashboard tailored to audience

CEO needs: Revenue, churn, burn, runway
Sales needs: Pipeline, win rate, sales cycle
Product needs: Adoption, NPS, support tickets
Support needs: Ticket volume, resolution time, CSAT

Different roles care about different metrics.

**Mistake 8: Metric Creep**

Wrong: Start with 5 metrics, end up with 30 (scope creep)
Right: Keep metric count stable, rotate as priorities change

Once a year, audit metrics: Still relevant? Or can we retire?

**Effective Dashboard Checklist**

- [ ] One page (or one screen)
- [ ] 9-12 metrics max
- [ ] Each metric has target and trend
- [ ] Mix of leading and lagging
- [ ] Color-coded (green/yellow/red)
- [ ] Clear ownership for each metric
- [ ] Updated on cadence (daily/weekly)
- [ ] Tailored to audience (different for CEO, team, board)
- [ ] Visual and easy to scan (no numbers overload)
- [ ] Actionable (can do something if metric is off)
`
      }
    ],
    relatedSlugs: [
      "investor-dashboard-and-metrics-reporting",
      "board-reporting-investor-communications",
      "financial-forecasting-modeling",
      "saas-benchmarking-peer-comparison",
      "customer-success-metrics-health-scoring"
    ],
    faq: [
      {
        q: "What metrics should be on my SaaS dashboard?",
        a: "Core: MRR/ARR, growth %, churn, NRR, CAC, LTV, LTV/CAC, burn, runway. Optional: customer count, NPS, gross margin. Focus on 9-12 max. Each metric should have: current value, target, trend. Different roles get different dashboards (CEO, sales, product, support have different priorities)."
      },
      {
        q: "How often should I update my dashboard?",
        a: "Weekly is standard for SaaS. Daily if fast-moving (e-commerce). Monthly for detailed board review. Set cadence and stick to it (stale dashboards kill trust). Automate updates if possible (BI tools) vs manual (spreadsheets, slower)."
      },
      {
        q: "What's the difference between KPI and metric?",
        a: "All KPIs are metrics, but not all metrics are KPIs. KPI = Key Performance Indicator (tied to business goal, measurable, actionable, owned by someone). Example: 'Churn <2%' is KPI (goal-tied). 'Website traffic' is metric (useful but not tied to goal, less actionable)."
      },
      {
        q: "Why should I track leading indicators?",
        a: "Lagging indicators (revenue, churn) show what happened but too late to fix. Leading indicators (pipeline, trial signups, adoption) predict what will happen, allowing time to act. Example: Low pipeline (leading) → predict low revenue (lagging) 2-3 months later. Use leading to steer, lagging to confirm."
      }
    ],
    videoUrl: ""
  }
];

export default batch130Articles;
