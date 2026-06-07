import { AcademyArticle } from "@/types/academy";

export const batch380Articles: AcademyArticle[] = [
  {
    slug: "saas-data-analytics-and-business-intelligence",
    title: "Data Analytics and Business Intelligence: Data-Driven SaaS Decision Making",
    description: "Master SaaS analytics. Build BI dashboards, track leading indicators, and make data-driven decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["data analytics", "business intelligence", "dashboards", "KPIs", "data-driven decisions"],
    keyTakeaways: [
      "SaaS analytics stack: Three layers. (1) Data sources: Billing (Stripe/Chargebee), CRM (Salesforce/HubSpot), product analytics (Mixpanel/Amplitude), support (Zendesk). (2) Data warehouse: Centralise in BigQuery/Snowflake/Redshift. ETL tools: Fivetran, Stitch, Airbyte. (3) BI layer: Metabase (free), Looker, Tableau, or Mode for dashboards. Cost: £500-2K/month for mid-stage SaaS. ROI: One data-driven decision that saves £50K/year pays for the entire stack.",
      "Leading vs lagging indicators: Lagging indicators tell you what happened (revenue, churn rate). Leading indicators predict what will happen. Key leading indicators: (1) Product engagement (login frequency dropping = future churn), (2) Pipeline coverage (below 3x = revenue miss), (3) NPS trend (declining = churn risk), (4) Feature adoption (new feature <20% adoption = product-market fit risk), (5) Support ticket volume (rising = product quality issue). Track both, but act on leading indicators.",
      "Dashboard hierarchy: Three levels. (1) Executive dashboard (CEO/board): 5-7 KPIs, updated weekly. ARR, growth rate, burn, runway, NRR, pipeline coverage. (2) Departmental dashboards: 10-15 metrics per department, updated daily. Sales: pipeline, conversion, quota attainment. Engineering: velocity, uptime, deploy frequency. (3) Operational dashboards: Real-time, detailed. Server health, payment failures, support queue. Rule: If a metric isn't driving a decision, remove it from the dashboard."
    ],
    content: [
      {
        heading: "Building a Data-Driven SaaS Organisation",
        body: `Using analytics and BI to make better, faster decisions.

**SaaS analytics architecture**

Data sources:

| Source | Data | Key metrics | Tool examples |
|---|---|---|---|
| Billing | Revenue, subscriptions | MRR, ARR, churn | Stripe, Chargebee, Recurly |
| CRM | Pipeline, deals, contacts | Pipeline, conversion, ACV | Salesforce, HubSpot |
| Product | Usage, features, events | DAU, feature adoption, engagement | Mixpanel, Amplitude, Heap |
| Support | Tickets, satisfaction | CSAT, response time, volume | Zendesk, Intercom |
| Marketing | Campaigns, attribution | CAC, lead quality, conversion | Google Analytics, HubSpot |
| Finance | P&L, cash, expenses | Burn, runway, gross margin | Xero, QuickBooks, NetSuite |

Data warehouse:

Why centralise:
- Single source of truth (no conflicting numbers)
- Cross-functional analysis (combine product + billing data)
- Historical analysis (track trends over time)
- Self-serve reporting (team can build own queries)

Options by stage:

| Stage | Tool | Cost | Best for |
|---|---|---|---|
| Seed | Google Sheets | Free | <£1M ARR, simple needs |
| Series A | BigQuery | £100-500/mo | Growing data needs |
| Series B | Snowflake | £500-2K/mo | Complex analytics |
| Series C+ | Redshift/Databricks | £2K+/mo | Enterprise scale |

ETL (Extract, Transform, Load):

Tools to connect data sources to warehouse:
- Fivetran: £500-2K/month (premium, reliable)
- Stitch: £100-500/month (mid-range)
- Airbyte: Free/open-source (requires engineering)

Example pipeline:
Stripe → Fivetran → BigQuery → Metabase (dashboard)

BI and dashboarding:

| Tool | Cost | Complexity | Best for |
|---|---|---|---|
| Metabase | Free (self-hosted) | Low | Startups, simple dashboards |
| Looker (Google) | £3K+/mo | High | Complex analytics, governed |
| Tableau | £50-70/user/mo | Medium | Visual analytics |
| Mode | £500+/mo | Medium | SQL-heavy teams |
| ChartMogul | £100-500/mo | Low | SaaS-specific metrics |

Recommendation by stage:
- Seed: Google Sheets + ChartMogul
- Series A: ChartMogul + Metabase
- Series B: BigQuery + Looker or Metabase
- Series C+: Snowflake + Looker

**Executive dashboard design**

The 7 metrics every SaaS CEO needs:

1. ARR and growth rate
   - Chart: Line chart, 12-month trend
   - Target: Stage-appropriate growth rate
   - Red flag: Growth decelerating faster than expected

2. Net new ARR (with waterfall)
   - Chart: Waterfall (new + expansion - churn - contraction)
   - Target: Monthly net new ARR target
   - Red flag: Churn exceeding new business

3. Monthly burn and runway
   - Chart: Bar chart (burn) + line (runway months)
   - Target: 12+ months runway
   - Red flag: Below 6 months

4. Net revenue retention
   - Chart: Line chart, trailing 12-month
   - Target: >110% (mid-market), >120% (enterprise)
   - Red flag: Below 100% (shrinking customer base)

5. Gross margin
   - Chart: Line chart, monthly
   - Target: >75%
   - Red flag: Declining trend

6. Pipeline coverage
   - Chart: Bar chart (weighted pipeline vs quota)
   - Target: 3-4x coverage
   - Red flag: Below 2.5x

7. Cash balance
   - Chart: Line chart, with forecast
   - Target: Above minimum threshold
   - Red flag: Declining faster than plan

Dashboard rules:
- Update weekly (automated if possible)
- Show trend (not just current value)
- Include target/benchmark
- Traffic light status (green/amber/red)
- Click-through to detail

**Departmental dashboards**

Sales dashboard:

| Metric | Frequency | Source |
|---|---|---|
| Pipeline by stage | Daily | CRM |
| Weighted pipeline vs quota | Weekly | CRM |
| New deals created | Daily | CRM |
| Deals closed (won/lost) | Daily | CRM |
| Average deal size | Weekly | CRM |
| Sales cycle length | Monthly | CRM |
| Win rate by stage | Monthly | CRM |
| Rep quota attainment | Weekly | CRM |
| Activity metrics (calls, demos) | Daily | CRM |

Engineering dashboard:

| Metric | Frequency | Source |
|---|---|---|
| Sprint velocity | Bi-weekly | Jira/Linear |
| Deploy frequency | Daily | CI/CD |
| Uptime / availability | Real-time | Monitoring |
| Incident count and severity | Daily | PagerDuty |
| Bug backlog | Weekly | Jira/Linear |
| Feature ship rate | Monthly | Jira/Linear |
| P95 response time | Real-time | APM |

Customer success dashboard:

| Metric | Frequency | Source |
|---|---|---|
| Health scores distribution | Daily | CS platform |
| At-risk accounts | Daily | CS platform |
| NPS/CSAT scores | Monthly | Survey tool |
| Onboarding completion rate | Weekly | Product |
| Expansion pipeline | Weekly | CRM |
| Churn forecast | Monthly | CS platform |
| Support ticket volume | Daily | Zendesk |
| Time to first value | Monthly | Product |

Marketing dashboard:

| Metric | Frequency | Source |
|---|---|---|
| Website visitors | Daily | Google Analytics |
| Lead volume (MQL, SQL) | Daily | CRM/HubSpot |
| Conversion rates (visitor→lead→MQL→SQL) | Weekly | CRM |
| CAC by channel | Monthly | Finance + CRM |
| Content engagement | Weekly | CMS |
| Email metrics (open, click) | Weekly | Email platform |
| Paid ad performance (CPC, CAC) | Daily | Ad platforms |

**Leading indicator framework**

Leading indicators for key outcomes:

Revenue growth:
- Leading: Pipeline coverage, lead volume, conversion rate
- Lagging: ARR, MRR, new ARR

Churn:
- Leading: Health score changes, login decline, NPS drop, support spikes
- Lagging: Churn rate, churned ARR

Profitability:
- Leading: Gross margin trend, headcount-to-revenue ratio, cloud cost per customer
- Lagging: EBITDA, operating margin

Cash:
- Leading: DSO trend, burn rate trend, pipeline coverage
- Lagging: Cash balance, runway

How to act on leading indicators:

Example: Product engagement declining

Signal: Average weekly logins dropped from 4.2 to 3.1 over 3 months

Investigation:
- Which customer segment? (Enterprise stable, SMB declining)
- Which features? (Core features stable, new feature low adoption)
- Correlation with churn? (Customers with <2 logins/week churn at 3x rate)

Action:
- SMB onboarding improvement (drive feature adoption)
- In-app engagement campaign (drive login frequency)
- CSM outreach to declining accounts

Expected impact:
- Prevent 5% of at-risk SMB churn
- Estimated ARR saved: £50K

**Data governance**

Metric definitions:

Create and maintain a data dictionary:

| Metric | Definition | Calculation | Owner | Source |
|---|---|---|---|---|
| ARR | Annual recurring subscription revenue | Sum of active subscription values × 12 | Finance | Stripe |
| MRR | Monthly recurring revenue | ARR ÷ 12 | Finance | Stripe |
| New ARR | ARR from new customers | Sum of first subscription values (annualised) | Sales | CRM + Stripe |
| Churn rate | Monthly customer churn | Customers cancelled ÷ starting customers | CS | Stripe |

Data quality rules:
- Single source of truth per metric (no conflicting reports)
- Automated data pipelines (reduce manual error)
- Regular audits (monthly spot-check)
- Access controls (who can modify base data)
- Documentation (how each metric is calculated)

Common data pitfalls:

Pitfall 1: Multiple ARR numbers
- CRM shows £1.2M, billing shows £1.15M, spreadsheet shows £1.25M
- Fix: Define one source of truth (usually billing system)

Pitfall 2: Inconsistent time periods
- Marketing reports monthly, sales reports quarterly
- Fix: Standardise on monthly with quarterly roll-ups

Pitfall 3: Vanity metrics
- Tracking metrics that don't drive decisions
- Fix: For each metric, ask "What decision does this inform?"
- If no answer, remove from dashboard

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "saas-metrics-benchmarking-and-peer-comparison", "saas-financial-reporting-and-investor-updates", "saas-churn-analysis-and-retention-strategy", "saas-revenue-forecasting-models"],
    faq: [
      { q: "What analytics tools should a SaaS company use?", a: "By stage: Seed (Google Sheets + ChartMogul, <£100/month). Series A (ChartMogul + Metabase + Fivetran, £500-1K/month). Series B (BigQuery + Looker/Metabase, £1-3K/month). Key data sources: Billing (Stripe), CRM (HubSpot/Salesforce), Product (Mixpanel/Amplitude), Support (Zendesk). One good data-driven decision pays for the entire analytics stack." },
      { q: "What are the most important leading indicators for SaaS?", a: "Leading indicators predict future outcomes. For revenue: pipeline coverage, lead volume, conversion rate. For churn: health score changes, login frequency decline, NPS drops, support ticket spikes. For profitability: gross margin trend, headcount-to-revenue ratio. Act on leading indicators before they become lagging problems. Example: Declining product engagement predicts churn 2-3 months before cancellation." },
      { q: "How many metrics should be on a CEO dashboard?", a: "5-7 key metrics maximum. Essential: ARR + growth rate, net new ARR waterfall, burn + runway, NRR, gross margin, pipeline coverage, cash balance. Update weekly. Show 12-month trends, targets, and traffic light status. Rule: If a metric doesn't drive a decision, remove it. Department dashboards can have 10-15 metrics; operational dashboards can be real-time and detailed." }
    ],
    videoUrl: ""
  }
];

export default batch380Articles;
