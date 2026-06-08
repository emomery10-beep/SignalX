import { AcademyArticle } from "@/types/academy";

export const batch221Articles: AcademyArticle[] = [
  {
    slug: "advanced-financial-modeling-and-forecasting",
    title: "Advanced Financial Modeling and Forecasting: Building Sophisticated Models",
    description: "Master advanced modeling. Build dynamic models, stress test, and forecast under uncertainty.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["financial modeling", "forecasting", "modeling", "projection", "financial analysis", "scenario analysis", "sensitivity", "modeling tools", "forecast accuracy", "dynamic models"],
    keyTakeaways: [
      "Model architecture: Input sheet (assumptions), Calculation sheet (formulas), Output sheet (results). Inputs: Growth rate (%), churn (%), CAC (£), pricing (£). Calculations: Customer count (growing), revenue (by cohort), expenses (scaling). Output: P&L (monthly), cash flow, metrics. Update: Monthly with actuals, recalculate forecast. Tools: Excel (simple, portable), Sheets (collaborative), Anaplan (enterprise, complex). Build incrementally: Start simple (3-year monthly), add complexity (by segment, by product, by geography). Avoid: Over-engineering (model time wasting), too simple (miss insights).",
      "Cohort-based modeling: Most accurate for SaaS (subscription = predictable). Model: Customers acquired month 1, cohort retention curve, cohort lifetime value. Example: Jan cohort 100 customers, 10% churn month 2 = 90 retain. Feb cohort 120 customers (15% growth), 10% churn = 108 retain. By month 12, combine all cohorts = total customers. Revenue = sum of all cohorts × ARPU × retention. Benefit: More accurate (accounts for varying cohorts), enables scenario analysis (change retention, see impact). Complexity: More inputs, harder to manage, but worth for precision.",
      "Rolling forecasts: Instead of fixed 3-year plan, rolling 13-week cash forecast (updated weekly). Benefit: Closer to reality (only forecast what you can see), catch risks early, adapt faster. Example: Week 1 forecast months 1-13, week 2 forecast months 2-14. Compare actual to forecast (track variance), adjust. Use for: Weekly cash check-ins, board updates (forward-looking), risk management (spot shortfalls early). Tools: Simple (Google Sheets, updated manually), Advanced (Anaplan, auto-updated from actuals)."
    ],
    content: [
      {
        heading: "Building Dynamic Financial Models",
        body: `Constructing sophisticated forecasting models.

**Model structure**

Best practice architecture:
1. Inputs sheet
   - Assumptions (growth %, churn %, CAC, pricing)
   - Drivers (headcount plan, marketing spend)
   - Scenario toggle (switch between base/upside/downside)

2. Calculation sheet
   - Customer cohort calculation (by acquisition month)
   - Revenue calculation (by cohort, by tier)
   - Operating expense calculation (by department)
   - Cash flow calculation (revenue - expenses + financing)

3. Output sheet (charts and summary)
   - Monthly P&L (revenue, COGS, OpEx, profit)
   - Cash flow statement (cash in/out, ending balance)
   - Key metrics (MRR, churn, CAC/LTV, runway)
   - Variance analysis (actual vs forecast)

**Example cohort model**

Inputs:
- Initial customers: 100
- Monthly growth: 10% (new customers added)
- Churn: 2% (monthly)
- ARPU: £1000

Calculation (by month):
- Month 1: 100 × (1-0.02)^0 × £1000 = £100K
- Month 2: (100 × 0.98) + (10 new) × £1000 = (98 + 10) × £1000 = £108K
- Month 3: (108 × 0.98) + (12 new) × £1000 = (105.84 + 12) × £1000 = £117.84K
- Continue 36 months

Output: Monthly MRR shows compounding growth (new customers) offset by churn

**Model validation**

Sanity checks:
- Does revenue grow at expected rate? (Compare to plan)
- Does churn seem realistic? (Compare to historical)
- Do expenses scale logically? (Headcount growing with revenue)
- Is cash positive by target date? (Profitability realistic)

Sensitivity:
- Change churn +0.5% = what impact? (Should be significant)
- Change growth -10% = what impact? (Should reduce revenue 30%+)
- Change CAC +20% = what impact? (Should reduce profitability)

Compare to actuals:
- After 3 months, compare forecast to actual
- Variance analysis: Why different?
- Adjust model if systematic error (forecast consistently high/low)

`
      }
    ],
    relatedSlugs: ["financial-forecasting-modeling", "scenario-planning-and-sensitivity-analysis", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      {
        q: "What's the best way to structure a financial model?",
        a: "Three sheets: (1) Inputs (assumptions like growth rate, churn), (2) Calculations (formulas, cohort modeling), (3) Outputs (P&L, cash flow, metrics). Build incrementally: Start simple, add complexity. Validate: Compare to actuals, adjust if off. Tools: Excel (portable), Google Sheets (collaborative), Anaplan (complex/enterprise)."
      },
      {
        q: "What's cohort-based modeling?",
        a: "Model customers acquired each month as separate cohorts, track retention. Example: Jan cohort 100, Feb 10% churn = 90 survive. Feb new cohort 110. By month 3, combine both cohorts = total customers. Benefit: More accurate (accounts for varying cohorts, retention curves), enables what-if analysis (change retention = see impact)."
      },
      {
        q: "How often should I update my forecast?",
        a: "Monthly: Update with actuals, recalculate (variance analysis). Weekly: Cash flow updates (rolling 13-week forecast, updated each Friday). Quarterly: Full model refresh (new 3-year plan). Adjust: If actual varies >10% from forecast, investigate why and adjust assumptions."
      }
    ],
    videoUrl: ""
  }
];

export default batch221Articles;
