import { AcademyArticle } from "@/types/academy";

export const batch228Articles: AcademyArticle[] = [
  {
    slug: "metrics-dashboard-design-kpi-tracking",
    title: "Metrics Dashboard Design and KPI Tracking: Building the Metrics That Matter",
    description: "Master dashboard design. Track KPIs, spot trends, drive data-informed decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["dashboard", "KPI", "metrics", "analytics", "data visualization", "performance tracking", "key metrics", "reporting", "business intelligence"],
    keyTakeaways: [
      "Dashboard structure: 1-page executive (top 7-10 metrics: ARR, MRR, churn, CAC, LTV, NRR, payback, burn, runway, conversion). 2-page operational (by team: Sales dashboard = pipeline, CAC, deals by stage; Marketing dashboard = leads, conversion, CAC by channel; CS dashboard = churn, NRR, support tickets). Frequency: Executive daily (pulse), operational weekly (actions). Tools: Metabase, Tableau, Looker (cost £500-5K/month depends on volume). Benefit: Team sees data daily (builds culture), spot issues 1-2 weeks faster than manual reporting.",
      "KPI selection: Choose 7-10 company KPIs (too many = noise, too few = blind spots). Example for £1M ARR company: ARR (target £5M), MRR (growth %/month), churn (target <2%), NRR (target >120%), CAC (under £5K), LTV (£50K+), payback (12 months), magic number (>0.75), burn rate (£100K/month), runway (18+ months). Update monthly. Each metric owns goal + owner (VP Sales owns CAC, VP CS owns churn). Review: Monthly (all metrics), quarterly (deep dive on 2-3).",
      "Visualization principles: Use tables for comparisons (region vs region, month vs month), line charts for trends (churn over time), bar charts for distribution (CAC by channel), funnels for conversion (visitors → leads → customers). Avoid: 3D charts (hard to read), pie charts (use bar instead), too many colors (highlight exceptions only, gray for baseline). Interactivity: Drill-down (click company → see cohort). Filters (by segment, geography, customer type). Export (for board presentations). Governance: One source of truth (update daily auto-sync from data warehouse), no manual updates (brittleness + errors)."
    ],
    content: [
      {
        heading: "Building an Executive Dashboard",
        body: `Creating dashboards that drive decisions.

**Key metrics to track**

Executive dashboard (7-10 metrics):
- ARR / MRR (growth %)
- Churn rate (monthly %)
- NRR (expansion %)
- CAC (average cost)
- LTV / CAC ratio
- Payback period
- Burn rate / Runway
- Win rate / Pipeline
- Conversion rate (overall)
- Magic number (revenue growth / sales spend)

Operational dashboards by function:
- Sales: Pipeline value, conversion funnel, CAC by source, deal cycle time
- Marketing: Lead volume, conversion rate, CAC by channel, SQL quality
- CS: Churn reasons, NRR drivers, support tickets, CSAT
- Finance: Cash burn, headcount spend, unit economics by cohort

**Dashboard design principles**

Layout:
- Executive (1 page): Most important 7-10 metrics, trends, status (green/yellow/red)
- Operational (2-3 pages): By function, detailed + actions
- Daily check-in (pulse): 3-5 critical metrics only

Visualization:
| Metric | Chart type | Why |
|---|---|---|
| Growth over time | Line chart | See trend direction |
| Comparison (region vs region) | Bar chart | Easy comparison |
| Conversion flow | Funnel | See drop-off points |
| Distribution (CAC by channel) | Bar chart | See concentration |
| Retention cohorts | Heat map | See pattern by cohort |

Interaction:
- Drill-down (click metric → underlying data)
- Filters (by segment, time period, region)
- Year-over-year / Month-over-month toggles
- Alerts (when metric breaches threshold)

**Data infrastructure**

Architecture:
1. Data source: Billing system (Stripe, Zuora), analytics (Segment, Amplitude), CRM (Salesforce)
2. Warehouse: Consolidate data (Snowflake, BigQuery, Redshift)
3. Transformation: Clean + aggregate (dbt, custom SQL)
4. Visualization: Dashboard tool (Metabase, Tableau, Looker)
5. Governance: Update frequency (daily ideal, min weekly), single source of truth

Best practice:
- Auto-sync (don't manual update, brittleness)
- Data validation (alert if missing)
- Documentation (what each metric means, how calculated)
- Access control (finance sees revenue, sales sees only leads/CAC)

`
      }
    ],
    relatedSlugs: ["decision-making-frameworks-and-data-analytics", "advanced-analytics-and-data-visualization", "unit-economics-ltv-cac-payback"],
    faq: [
      { q: "What metrics should my executive dashboard include?", a: "7-10 key metrics: ARR, MRR (growth %), churn, NRR, CAC, LTV, payback, burn, runway, conversion. Add: Magic number, win rate. Update monthly. Set targets and owners for each metric." },
      { q: "How often should I update dashboards?", a: "Executive: Daily (morning pulse). Operational: Weekly (actions). Monthly: Deep review all KPIs. Quarterly: Strategy review. Automate: Daily sync from data warehouse (avoid manual updates, brittleness)." },
      { q: "What tools should I use for dashboards?", a: "Metabase (free/open-source, easy setup), Tableau (enterprise, powerful), Looker (built-in to Google Cloud). Cost: £0-5K/month. Pick: Ease of use vs features needed. Must-have: Auto-sync, drill-down, filters, export." }
    ],
    videoUrl: ""
  }
];

export default batch228Articles;