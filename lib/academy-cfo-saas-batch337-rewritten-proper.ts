import { AcademyArticle } from "@/types/academy";

export const batch337Articles: AcademyArticle[] = [
  {
    slug: "metrics-dashboard-design-kpi-tracking",
    title: "Metrics Dashboard Design and KPI Tracking: Monitoring Business Health",
    description: "Master metrics. Design dashboards, track KPIs, make data-driven decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["KPI", "metrics dashboard", "business metrics", "key performance indicators", "dashboard design"],
    keyTakeaways: [
      "Dashboard purpose: Single source of truth for business health. Metrics by role: CEO dashboard (revenue, burn, runway, growth), CFO dashboard (cash, burn, profitability, margins), Sales dashboard (pipeline, CAC, conversion), CS dashboard (churn, CSAT, NPS). Design: 1-page dashboard (5-10 metrics max, refresh daily/weekly). Key: Actionable metrics (metric + target + variance), not vanity metrics (look good but not actionable).",
      "KPI selection: Start with one metric (revenue), add supporting (CAC, LTV, churn, burn). Rule: Each KPI has owner (CEO owns revenue, CFO owns cash, Sales owns CAC). Metric hierarchy: Lead metrics (predict future: CAC, LTV, churn) vs lag metrics (historic: revenue, profit). Both needed: Lead metrics to adjust, lag to verify.",
      "Dashboard tools: Spreadsheet (Google Sheets, simple, free), BI platform (Tableau, Looker, powerful but complex), accounting software (QuickBooks, Xero, built-in), custom (Metabase, Amplitude). Choice: Start with spreadsheet, graduate to BI as scale. Update: Daily/weekly (timely), monthly close (accurate). Share: Company-wide visibility (transparency)."
    ],
    content: [
      {
        heading: "Designing and Implementing Metrics Dashboards",
        body: `Building information systems for data-driven decision-making.

**Dashboard fundamentals**

Purpose:
- Single source of truth for business metrics
- Quick snapshot of health (1-page, no scrolling)
- Actionable data (metric + target + actual + variance)
- Role-specific (different people need different metrics)

Key principles:

Principle 1: One page
- Maximum 10 metrics (focus, not noise)
- Visual (graphs, charts, colors)
- Updated regularly (daily or weekly)
- No scrolling (everything visible at once)

Principle 2: Lead + lag metrics
- Lead metrics (predict future)
- Lag metrics (measure past, verify)
- Both needed (early warning + confirmation)

Principle 3: Actionable
- Each metric has target (where should we be?)
- Variance (actual vs target)
- Owner (who is accountable?)
- Action (if off-track, what to do?)

**Dashboard by role**

CEO dashboard

Goal:
- Company health snapshot
- Revenue, profitability, growth, runway
- Weekly or monthly review

Metrics:

| Metric | Description | Target | Status |
|---|---|---|---|
| MRR | Monthly recurring revenue | £120K | £108K (-10%) |
| Growth (MoM) | Month-over-month growth | 5% | 2% (-3%) |
| ARR | Annual run rate (MRR × 12) | £1.44M | £1.30M |
| Runway (months) | Cash / monthly burn | 12+ | 8 (-4) |
| Burn rate | Monthly expenses | £100K | £105K (+£5K) |
| Customers | Total active customers | 500 | 450 (-50) |
| Gross margin | Revenue × margin | 70% | 68% (-2%) |

Insights:
- Revenue down (-10% vs target)
- Runway shortened (8 months vs 12+ target)
- Customers declining (churn issue?)
- Burn increasing (spending up)
- Action: (1) Investigate revenue miss, (2) Reduce burn, (3) Address churn

CFO dashboard

Goal:
- Cash and profitability focus
- Monthly P&L, cash flow, margins
- Monthly close review

Metrics:

| Metric | Current | Budget | Variance |
|---|---|---|---|
| Revenue | £108K | £120K | -£12K |
| COGS | £32K | £36K | +£4K (good) |
| Gross profit | £76K | £84K | -£8K |
| Opex | £105K | £100K | -£5K (bad) |
| Operating loss | -£29K | -£16K | -£13K (bad) |
| Cash balance | £420K | £450K | -£30K |
| Runway | 8 months | 12+ months | Short! |

Key areas:
- Revenue miss (top-line issue)
- Gross margin good (COGS down)
- Opex over budget (spending control issue)
- Cash runway shortened (must address)

Sales dashboard

Goal:
- Pipeline and acquisition metrics
- Weekly update (fast-moving)

Metrics:

| Metric | Current | Target | Status |
|---|---|---|---|
| Pipeline | £300K | £500K | 60% |
| Closed new (month) | £45K | £60K | 75% |
| Conversion (lead to customer) | 8% | 10% | 80% |
| CAC | £1200 | £1000 | 120% (over) |
| Payback period | 12 months | <12 months | At limit |
| Sales cycle | 45 days | 30 days | Long |

Actions:
- Pipeline low (increase outreach or improve conversion)
- CAC high (optimize targeting or improve conversion)
- Sales cycle long (streamline process)

CS/Support dashboard

Goal:
- Customer health and retention
- Weekly or daily update

Metrics:

| Metric | Current | Target | Status |
|---|---|---|---|
| Monthly churn | 5% | 3% | High |
| Churn reasons: Product | 40% | 20% | Problem |
| NPS | 28 | 40 | Low |
| CSAT (support) | 4.1/5 | 4.5/5 | Below |
| Support tickets/customer | 2.1 | 1.5 | High |
| Avg response time | 8 hours | <4 hours | Slow |
| Customers with red flags | 12 | <5 | Monitor |

Actions:
- Churn high (address product and support issues)
- Response time slow (hire/train support)
- Escalate red flag customers (proactive retention)

**KPI selection process**

Step 1: Define strategy

Question: What does success look like?

Example: "We want to build a £10M ARR SaaS company in 5 years"

Implications:
- Year 1: £500K ARR (high growth)
- Year 2: £1.5M ARR (3x growth)
- Year 3: £4M ARR (3x growth)
- Year 4: £8M ARR (2x growth)
- Year 5: £15M ARR (2x growth)

Step 2: Identify leading indicators

Question: What predicts revenue growth?

Answer: (1) Customer acquisition (CAC, payback), (2) Retention (churn, NRR), (3) Expansion (NRR, ARPU growth)

Metrics:
- MRR (lag metric, result)
- New customer growth (lead, predicts future MRR)
- Churn rate (lead, predicts retention)
- NRR (lead, predicts expansion)

Step 3: Identify constraints

Question: What's holding us back?

Example: "We have product-market fit, but constrained by cash"

Metrics:
- Burn rate (how long can we survive?)
- Runway (when do we run out of cash?)
- Profitability path (can we reach breakeven?)

Step 4: Assign ownership

Each metric has owner (accountable for result):

| Metric | Owner | Check-in |
|---|---|---|
| MRR / Revenue | CEO/Head of Sales | Weekly |
| CAC / Conversion | VP Sales/Marketing | Weekly |
| Churn / NPS | VP CS | Weekly |
| Burn / Cash | CFO | Daily |
| Runway | CFO | Daily |
| Margin / Opex | CFO | Monthly |

**Dashboard creation**

Tool selection:

Google Sheets
- Pros: Free, familiar, easy to set up, collaborate
- Cons: Manual updates, not real-time
- Best for: Early stage, simple metrics

Tableau / Looker
- Pros: Real-time, powerful, beautiful visuals
- Cons: Expensive (£100-1000+/month), learning curve
- Best for: Mature companies, complex analysis

Metabase
- Pros: Open-source (free), self-hosted, SQL-based
- Cons: Requires setup, less polished
- Best for: Technical teams, cost-conscious

Native tools
- Stripe dashboard: Payment metrics
- QuickBooks: Financial metrics
- Google Analytics: Web metrics
- HubSpot: Sales metrics
- Many tools have built-in dashboards

Recommendation: Start with Google Sheets (simple, free) → Upgrade to Tableau/Looker at scale

**Dashboard best practices**

Practice 1: Use traffic light colors
- Red: Off-track (>20% variance)
- Yellow: Caution (10-20% variance)
- Green: On-track (<10% variance)

Visual clarity: Instant understanding (green = good, red = action needed)

Practice 2: Show trend
- Current value
- Previous period value
- Trend (up/down/flat)

Example:
- MRR: £108K ↓ (vs £110K last month, -1.8% decline)
- Customer: 450 ↓ (vs 460 last month, -2.2% churn)

Visual: Trend arrow shows direction immediately

Practice 3: Monthly and quarterly views
- Daily: Limited dashboards (cash, critical metrics)
- Weekly: Sales, CS dashboards
- Monthly: P&L, comprehensive review

Cadence: Different updates for different frequencies

Practice 4: Drill-down capability
- Dashboard shows summary (MRR £108K)
- Click to drill (MRR by customer type: SMB £30K, Mid-market £50K, Enterprise £28K)
- Identify outliers (Enterprise dipped £10K, investigate why)

Depth: Start high-level, drill when needed

**Using dashboards for decisions**

Monthly rhythm:

Day 1-3: Close month
- Final P&L ready
- Update dashboard
- Identify variances

Day 4-5: Review meeting
- Leadership reviews dashboard
- Discuss variances (why off-track?)
- Assign actions (if >10% variance, understand why)

Day 6-7: Planning
- Based on results, adjust plan
- Next month forecast
- Budget adjustments if needed

Example decision:
- Dashboard shows: Revenue -10%, churn +2%
- Root cause analysis: New competitor, price increase drove churn
- Actions: (1) Improve product (differentiation), (2) Adjust price (discount for existing), (3) Marketing (new positioning)
- Track: Monitor churn next month (did actions help?)

**Common dashboard mistakes**

Mistake 1: Too many metrics
- Problem: 50-metric dashboard (information overload)
- Fix: Start with 5-7 core, add more as needed
- Impact: Clear, actionable (not confusing)

Mistake 2: Vanity metrics
- Problem: Track "page views" or "total users" (not actionable)
- Fix: Track "active users", "revenue per user" (actionable)
- Impact: Focus on what matters (revenue, profitability)

Mistake 3: No targets
- Problem: Know revenue is £108K, don't know if that's good or bad
- Fix: Set target (£120K), show variance (-£12K)
- Impact: Clear accountability (on-track or off-track)

Mistake 4: No owner
- Problem: Revenue down, no one is accountable
- Fix: Assign owner ("Sales VP owns revenue growth")
- Impact: Accountability, action

Mistake 5: Stale data
- Problem: Dashboard updated monthly, data 3 weeks old
- Fix: Update weekly or daily (depending on metric)
- Impact: Timely decisions (catch issues early)

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "profitability-analysis-and-operating-leverage", "unit-economics-ltv-cac-payback", "growth-rate-analysis-and-benchmarking", "scenario-planning-and-sensitivity-analysis"],
    faq: [
      { q: "What metrics should I track?", a: "Start with 5-7 core: (1) Revenue/MRR, (2) CAC, (3) Churn, (4) Burn rate, (5) Runway, (6) Gross margin, (7) NRR. Add by role: Sales (pipeline, conversion), CS (CSAT, NPS), Finance (cash, profitability). Rule: Each metric has owner and target. Avoid vanity metrics (page views, total users). Focus: Revenue, growth, retention, profitability." },
      { q: "How should I design a dashboard?", a: "One-page rule: Max 10 metrics, no scrolling. Include: Current value, target, variance, trend. Colors: Green (on-track <10% variance), Yellow (caution 10-20%), Red (off-track >20%). Update: Daily (cash), weekly (sales/CS), monthly (P&L). Share: Company-wide visibility (transparency). Tools: Start with Google Sheets (free), upgrade to Tableau at scale." },
      { q: "How do I use dashboards for decision-making?", a: "Monthly rhythm: (1) Close month, update dashboard, (2) Review meeting (discuss variances >10%), (3) Root cause analysis (why off-track?), (4) Actions (adjust plan), (5) Track results next month. Example: Revenue -10%, investigate (competition? churn?), act (adjust product, pricing, marketing), monitor (did it help?). Key: Accountability (each metric has owner, responsible for result)." }
    ],
    videoUrl: ""
  }
];

export default batch337Articles;
