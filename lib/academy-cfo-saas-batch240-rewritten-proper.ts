import { AcademyArticle } from "@/types/academy";

export const batch240Articles: AcademyArticle[] = [
  {
    slug: "advanced-analytics-and-data-visualization",
    title: "Advanced Analytics and Data Visualization: Telling Stories with Data",
    description: "Master advanced analytics. Build models, visualize data, communicate insights.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["analytics", "data visualization", "data modeling", "advanced analytics", "predictive analytics", "business intelligence", "data storytelling"],
    keyTakeaways: [
      "Data modeling: Build clean data pipeline (source → transform → visualize). Typical: Billing system (Stripe) → Data warehouse (Snowflake) → Transform (dbt, SQL) → Dashboard (Tableau). Architecture matters: Bad data architecture = slow dashboards, manual updates, errors. Good = automated, reliable, scales. Cost: 4-6 weeks data engineer time (£2-5K cost). Benefit: Automated reporting (save 5-10 hours/month finance), better data quality, faster decision-making. Tools: Snowflake (cloud data warehouse, £1-5K/month), dbt (transform SQL, free), Tableau (visualization, £500-5K/month).",
      "Visualization principles: Different data types = different charts. Trend (line chart), comparison (bar), distribution (histogram), correlation (scatter), parts-of-whole (stacked bar, not pie). Interactivity: Drill-down (click metric → detail), filters (by segment, region), export (board presentations). Color: Use to highlight (red = at-risk, green = healthy), not for beauty. Example: Churn dashboard → Line chart (churn trend month-by-month), bar chart (churn by segment), drill-down (click segment → customers churning this month).",
      "Predictive analytics (advanced): Cohort-based forecasting (next month churn = historical churn rate × customers × cohort quality). Machine learning models (predict which customers at-risk using engagement data). ROI: Identify 50 at-risk customers, save 25 (1% churn reduction = £100K+ ARR). Cost: Data scientist 3 months build model. Benefit: Proactive vs reactive (act before churn, not after). Cadence: Refresh weekly (new at-risk predictions), CS acts immediately (outreach)."
    ],
    content: [
      {
        heading: "Advanced Analytics and Data Architecture",
        body: `Building analytics infrastructure that scales.

**Data architecture**

Pipeline:
1. Source: Billing (Stripe, Zuora), CRM (Salesforce), analytics (Amplitude, Segment)
2. Ingestion: Pull data daily (automated)
3. Warehouse: Consolidate (Snowflake, BigQuery, Redshift)
4. Transform: Clean, aggregate, model (dbt, SQL)
5. Visualization: Dashboard (Tableau, Looker, Metabase)
6. Governance: Metadata, documentation, access control

Example data model (SaaS):
- customers table: ID, name, sign-up date, plan, churn date
- contracts table: Customer ID, ARR, start date, end date
- usage table: Customer ID, month, feature usage, support tickets
- finances table: Customer ID, month, MRR, expansion, churn

Transformation (dbt):
- daily_cohorts: Customer cohorts by signup date, retention curves
- unit_economics: CAC, LTV, payback by customer
- churn_analysis: Churn by segment, cohort, reason

**Visualization design**

Chart selection:
| Data Type | Chart | Example |
|---|---|---|
| Trend over time | Line chart | Churn rate month-by-month |
| Comparison across categories | Bar chart | Revenue by region |
| Distribution | Histogram | CAC distribution by channel |
| Correlation | Scatter | NPS vs retention |
| Composition | Stacked bar | Revenue by product |
| Hierarchical | Treemap | Customer base by segment |

Color usage:
- Status: Green (good), yellow (warning), red (alert)
- Highlight: Color for focus, gray for context
- Avoid: Rainbow (confusing), too many (noisy)

Interactivity:
- Drill-down: Click bar → detail (Region → Territory → Rep)
- Filters: By date, segment, geography
- Export: PDF, CSV for presentations
- Tooltips: Hover for exact numbers

Dashboard design:
- Executive (1 page): 7-10 top metrics, status, trend
- Team (2-3 pages): Detailed metrics by function
- Ad-hoc: Flexible exploration for analysis

**Predictive analytics**

Churn prediction:
- Input: Engagement (login frequency), outcomes (ROI realized), support tickets
- Model: Logistic regression, random forest
- Output: Risk score 0-100 (predict churn probability)

Implementation:
1. Data preparation (historical churn + engagement data)
2. Train model (80% data, test 20%)
3. Validate (accuracy 80%+)
4. Deploy: Weekly refresh, score all customers
5. Action: CSM outreach to top 50 at-risk

Cost-benefit:
- Cost: Data scientist 12 weeks (£50K)
- Benefit: Identify 50 at-risk, save 25 (1% churn save = £100K+ value)
- ROI: 2x year 1

Cohort forecasting:
- Historical: Q1 cohort 50% month 12 retention
- Forecast: Q4 cohort predicts similar (50% month 12)
- Refine: If recent improvements, adjust (Q3 cohort 55%)

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "decision-making-frameworks-and-data-analytics", "financial-planning-and-budgeting"],
    faq: [
      { q: "What data warehouse should I use?", a: "Options: Snowflake (easiest, cloud, £1-5K/month), BigQuery (Google Cloud, good for startups), Redshift (AWS, mature). Start: Metabase (free, simple) or Amplitude (analytics-only, £500-5K/month). Scale: Move to Snowflake + dbt + Tableau (cost: £2K-15K/month, but powerful)." },
      { q: "How do I build a predictive churn model?", a: "1. Collect historical data (customers, churn labels). 2. Extract features (engagement, outcomes, support). 3. Train model (logistic regression, forest). 4. Validate (80%+ accuracy). 5. Deploy (score weekly). 6. Action (CSM outreach to top 50). Cost: Data scientist 12 weeks. Benefit: Proactive retention, 25+ customers saved = £100K+ value." },
      { q: "What's the most important dashboard for a SaaS CFO?", a: "Executive dashboard: ARR, MRR, churn, NRR, CAC, LTV, payback, burn, runway (update weekly). Operational: By function (sales pipeline, marketing leads, CS churn). Cohort analysis: Retention curves by month. Unit economics: LTV/CAC by segment, payback. Automate: All refresh daily from data warehouse (no manual)." }
    ],
    videoUrl: ""
  }
];

export default batch240Articles;