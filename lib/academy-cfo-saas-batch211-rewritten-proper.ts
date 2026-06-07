import { AcademyArticle } from "@/types/academy";

export const batch211Articles: AcademyArticle[] = [
  {
    slug: "advanced-analytics-and-data-visualization",
    title: "Advanced Analytics and Data Visualization: Creating Insight from Data",
    description: "Master analytics. Build dashboards, analyze trends, create actionable insights from data.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "analytics",
      "data visualization",
      "dashboard",
      "data analysis",
      "business intelligence",
      "visualization",
      "data modeling",
      "analytics tools",
      "reporting",
      "insights"
    ],
    keyTakeaways: [
      "Visualization principles: 1 metric = 1 chart. 5-10 metrics = dashboard (not 50). Color coding: Red (bad), yellow (warning), green (good). Time series: Show trend over time (not just current). Comparison: Side-by-side for context. Don't: 3D pie charts (hard to read), dual-axis charts (confusing), too many colors. Good: Line charts (trend), bar charts (comparison), heat maps (correlation). Tools: Tableau, Looker, Mode (professional), Google Data Studio (free), custom dashboards (Metabase). Cost: £5K-50K annually (depends on tool and team).",
      "Data modeling and transformation: Raw data → clean data → insights. Example: Payment events (customer_id, amount, date) → aggregate by customer/month → calculate MRR. Transformation logic: Deduplication (remove duplicates), joining (combine tables), aggregation (sum/count), filtering (exclude test data). Automate: Daily/weekly ETL (extract-transform-load) jobs. Tools: dbt (modern standard, transforms data in warehouse), SQL (direct queries), Python (complex logic). Invest: Good data modeling saves hours of analysis.",
      "Predictive analytics: Use historical patterns to predict future. Examples: Churn prediction (which customers likely to leave), LTV prediction (lifetime value by cohort), growth forecast (next quarter revenue). Methods: Cohort analysis (simple, pattern-based), regression (mathematical modeling), machine learning (complex, but accurate). Value: Identify at-risk customers (intervene early), forecast revenue (plan spending), optimize pricing (test impact). Cost: Analytics engineer £80-120K salary or outsourced consultant £150-300/hr. ROI: Prevent 10% churn = £1M+ value."
    ],
    content: [
      {
        heading: "Dashboard Design and Visualization",
        body: `Creating effective data visualizations.

**Visualization principles**

Rule 1: Simplicity
- One metric = one chart
- Don't combine multiple metrics in one chart (confusing)
- Dashboard should be readable in 5 minutes

Rule 2: Context
- Always show: Actual vs target vs trend
- Example: MRR £95K, target £100K, trend up 2% last 4 weeks
- Helps: Understand if on track, improving, or worrying

Rule 3: Hierarchy
- Most important metrics at top
- Supporting metrics below
- Priority: Revenue, churn, cash, growth (in that order)

Rule 4: Color coding
- Red: Below 90% of target (attention needed)
- Yellow: 90-100% of target (monitor)
- Green: Above 100% of target (good)
- Reduces cognitive load (visual at a glance)

Rule 5: Time series
- Always show trend over time (not just current value)
- Example: Churn 2.2%, but trend up last 3 months (bad)
- Reveal patterns (seasonal, growth, decline)

**Common chart types**

Line chart (trends):
- Use for: Revenue, MRR, growth rate over time
- Example: MRR Jan £80K → Feb £85K → Mar £90K (trend up)
- Best for: Time series, showing direction

Bar chart (comparison):
- Use for: Revenue by segment, churn by cohort, CAC by channel
- Example: Organic CAC £500 vs Paid £2K (comparison)
- Best for: Side-by-side comparison

Waterfall chart (composition):
- Use for: Revenue build-up (new + expansion - churn)
- Example: Start £10M + new £2M + expansion £1M - churn £0.5M = £12.5M
- Best for: Understanding drivers of metric

Heat map (correlation):
- Use for: Feature adoption by customer segment
- Example: Feature A 80% adoption in enterprise, 20% in SMB
- Best for: Identifying patterns, correlations

**Example dashboard layout**

Executive dashboard (1 page):

\`\`\`
METRICS OVERVIEW | Last 30 days

[MRR: £95K (Target £100K)] [Churn: 2.2% (Target 2%)] [CAC: £1.2K] [Cash: £5M (Runway 18mo)]

[Revenue Trend Chart - Line - Last 12 months, up 2% trend]

[Churn by Cohort - Bar - Compare cohorts]  [CAC by Channel - Bar - Organic £500, Paid £2K]

[Top Risks - Table] [Action Items - List]
\`\`\`

Team dashboard (detailed):

\`\`\`
SALES DASHBOARD | Real-time

Pipeline: £5M (Actual) [Target £7M] - Deal count: 45
New MRR: £50K (Target £60K)
Win rate: 25% (Target 30%)
Sales cycle: 95 days (Target 75 days)

[Pipeline by stage - Bar] [Win rate trend - Line] [Deal size distribution - Bar]
[Top customers this month - Table] [Forecast vs actual - Line]
\`\`\`

`
      },
      {
        heading: "Data Modeling and Transformation",
        body: `Preparing data for analysis.

**ETL process (Extract-Transform-Load)**

Extract:
- Source: Billing system (Stripe), CRM (Salesforce), product (analytics DB)
- Frequency: Daily (most common), or real-time for critical metrics

Transform:
- Clean: Remove duplicates, fix errors, standardize formats
- Join: Combine data from multiple sources
- Aggregate: Sum, count, average across dimensions
- Filter: Remove test data, outliers

Load:
- Target: Data warehouse (Snowflake, BigQuery, Redshift)
- Frequency: Daily, after transformation
- Update: Refresh dashboards from warehouse

Example: Customer revenue calculation
\`\`\`
Raw data:
- Transactions table: customer_id, amount, date, status
- Customers table: customer_id, name, tier, created_date

Transform:
1. Filter: status = 'completed' (exclude failed)
2. Join: transactions + customers (add tier)
3. Aggregate: Sum amount by customer_id, month
4. Calculate: MRR (monthly recurring revenue)

Result:
MRR by customer: customer_id, month, amount, tier
\`\`\`

**Data quality and validation**

Checks to ensure data is clean:
- Null values: Are required fields populated?
- Duplicates: Any transactions counted twice?
- Outliers: Any suspicious values (negative revenue, extreme numbers)?
- Consistency: Do totals match across systems?

Example validation:
\`\`\`
Stripe transactions total: £95K
P&L revenue: £93K
Difference: £2K (investigate)
Reason: £2K in pending payments (not yet cleared)
Action: Clarify definition (cleared vs pending)
\`\`\`

**Data warehouse and SQL**

Modern approach: Use SQL to query raw data directly
\`\`\`sql
SELECT
  DATE_TRUNC('month', transaction_date) as month,
  customer_id,
  SUM(amount) as monthly_revenue,
  (SELECT tier FROM customers WHERE id = customer_id) as tier
FROM transactions
WHERE status = 'completed'
GROUP BY month, customer_id
ORDER BY month DESC
\`\`\`

Alternative: Use dbt (modern standard)
- dbt = data build tool
- Write SQL, dbt transforms into tables
- Version control (track changes)
- Documentation (what each table means)
- Testing (validate data quality)

`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "decision-making-frameworks-and-data-analytics",
      "financial-forecasting-modeling",
      "unit-economics-ltv-cac-payback",
      "cohort-analysis-and-customer-lifecycle"
    ],
    faq: [
      {
        q: "What should my dashboard include?",
        a: "Executive: 4-6 metrics (MRR, churn, CAC, cash, growth, NPS). Show: Actual vs target vs trend. Format: Traffic light (red/yellow/green). Team dashboards: Add detail (by segment, channel, cohort). Rule: 1 metric = 1 chart, readable in 5 min. Don't: Too many charts, 3D pie charts, dual-axis confusing visuals. Tool: Tableau, Looker, or Google Data Studio."
      },
      {
        q: "How do I set up data pipelines?",
        a: "ETL: Extract (Stripe, Salesforce), Transform (clean, join, aggregate), Load (warehouse). Frequency: Daily (most common). Tools: dbt (modern), SQL, Python (complex logic). Alternative: Use tool with built-in connectors (Looker, Tableau connect directly). Cost: Analytics engineer £80-120K, or consultant £150-300/hr. ROI: Good data saves hours of manual analysis."
      },
      {
        q: "How do I use data to predict churn?",
        a: "Methods: (1) Cohort analysis (compare retention curves), (2) Scoring (low usage + declining NPS = high churn risk), (3) ML (build model from historical churn). Action: Identify at-risk customers, CS intervenes. Measure: If predict churn and intervene, what % can we save? ROI: If save 10% churn = £1M+ value. Investment: Analyst time or ML engineer (expensive but valuable)."
      },
      {
        q: "What's the difference between a metric and a KPI?",
        a: "Metric: Data point (MRR £95K). KPI: Metric with target/meaning (MRR £95K vs target £100K, 95% of goal). Dashboard should focus on KPIs (have context), not just metrics. Example good: MRR £95K (95% of target) in red. Example bad: MRR £95K (no target, no context)."
      }
    ],
    videoUrl: ""
  }
];

export default batch211Articles;
