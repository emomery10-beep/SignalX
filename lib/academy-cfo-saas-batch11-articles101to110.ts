import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_11_ARTICLES_101_TO_110: AcademyArticle[] = [
  {
    slug: "saas-financial-forecasting-3-statement-models",
    title: "SaaS Financial Forecasting: Building 3-Statement Models",
    description: "Learn to build a comprehensive financial forecast (P&L, balance sheet, cash flow) that investors expect.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["financial forecasting", "3-statement model", "P&L", "balance sheet", "cash flow forecast"],
    keyTakeaways: [
      "A 3-statement model links P&L, balance sheet, and cash flow. Changes in one statement affect the others (revenue growth affects receivables, which affects cash).",
      "SaaS forecasts should project 3–5 years ahead (annual detail for years 1–2, then quarterly for year 3). Investors expect detailed assumptions underneath.",
      "Key drivers in SaaS forecasts: customer acquisition rate, churn rate, ARPU growth, payroll and hiring schedule, COGS as % of revenue."
    ],
    content: [
      {
        heading: "The Three Financial Statements and How They Connect",
        body: "**Profit & Loss (P&L): Revenue − Costs = Profit**\n- Income statement\n- Shows profitability over a period (monthly, quarterly, annual)\n- Key metrics: revenue, gross margin, operating margin, net income\n\n**Balance Sheet: Assets = Liabilities + Equity**\n- Shows financial position at a point in time\n- Key items: cash, receivables, payables, deferred revenue, debt\n\n**Cash Flow: Operating + Investing + Financing = Net Cash Change**\n- Shows actual cash movement (different from P&L profit)\n- Key items: cash from operations, capital expenditures, investor capital, loan payments\n\n**How they connect**:\n1. P&L profit flows to balance sheet (retained earnings increase)\n2. Changes in working capital (receivables, payables) flow from balance sheet to cash flow\n3. Capital expenditures from cash flow affect balance sheet (fixed assets)\n\n**Example**: You forecast €1M revenue and €600k costs, so P&L shows €400k profit. But 50% of revenue is unpaid (€500k receivables on balance sheet), so cash flow from operations is only €200k. The P&L and cash flow diverge because of working capital timing."
      },
      {
        heading: "Building the Forecast: Revenue Up, Everything Downstream",
        body: "Start with revenue forecast (usually the most certain input):\n\n**Revenue Forecast Drivers**:\n- **Existing customers (base revenue)**: Current MRR × 12 months\n- **Churn (losses)**: Base revenue × monthly churn rate\n- **Net New Customers**: Sales team quota and conversion rate\n- **Expansion revenue**: Upsells and price increases\n- **Net revenue = Base − Churn + New + Expansion**\n\n**Example**: €5M current ARR\n- Base: €5M\n- Churn (-5%): -€250k\n- New customers (25% growth): +€1.25M\n- Expansion (+€200k/year): +€200k\n- **Year 2 revenue: €6.2M**\n\n**From revenue, derive everything else**:\n\n**P&L**:\n- Revenue: €6.2M (from above)\n- COGS (10% of revenue): €620k\n- Gross profit: €5.58M (90% margin)\n- Operating expenses: Salary + tools + rent\n  - Engineering: €1.5M (based on hiring plan)\n  - Sales & marketing: €1M (based on customer acquisition targets)\n  - G&A: €500k\n  - Total OpEx: €3M\n- Operating profit: €2.58M\n\n**Balance Sheet**:\n- Receivables: €6.2M revenue × 30 days / 365 = €510k (based on DSO assumption)\n- Deferred revenue: €6.2M × 40% (assuming 40% of revenue is annual prepayments) = €2.48M\n- Cash: Depends on operating cash flow (see below)\n- Debt/Equity: Depends on financing decisions\n\n**Cash Flow**:\n- Operating cash flow = P&L profit ± changes in working capital\n- Example: €2.58M profit, but receivables grew by €50k (cash tied up), deferred revenue grew by €480k (cash received)\n- Operating cash flow: €2.58M - €50k + €480k = €3.01M\n- Investing (capital expenditures): €200k\n- Financing (new investor capital or loan repayment): depends on plan\n- Net cash change: €3.01M - €200k = €2.81M\n\nEverything flows from the revenue forecast."
      },
      {
        heading: "Key Assumptions and Sensitivity Analysis",
        body: "Every forecast is built on assumptions. Document these:\n\n**Revenue assumptions**:\n- New customer growth rate (10%, 20%, 30% per year)\n- Churn rate (2%, 5%, 8% per month)\n- ARPU growth (flat, 5%, 10% per year)\n- Mix of annual vs. monthly customers\n\n**Cost assumptions**:\n- Payroll growth (hiring plan: X engineers Q1, X sales reps Q2, etc.)\n- COGS as % of revenue (10%, 12%, 15%)\n- S&M spend as % of revenue (15%, 20%, 25%)\n\n**Working capital assumptions**:\n- DSO (Days Sales Outstanding): 15 days, 30 days, 45 days\n- DPO (Days Payable Outstanding): 30 days, 60 days\n\n**Sensitivity analysis**: Test multiple scenarios\n\n| Scenario | Customer Growth | Churn | Year 3 ARR |\n|----------|-----------------|-------|----------|\n| Conservative | 15% | 4% | €8.2M |\n| Base Case | 25% | 2.5% | €11.5M |\n| Optimistic | 40% | 1.5% | €16.8M |\n\nInvestors want to see all three scenarios. They typically plan for \"base case\" but stress-test against conservative scenario."
      },
      {
        heading: "Forecasting for Fundraising: What Investors Expect",
        body: "**Timeframe**: 3–5 years forward\n- Years 1–2: Monthly detail\n- Year 3–5: Quarterly or annual\n\n**Level of detail**:\n- Year 1: Very detailed (monthly revenue by product, monthly hiring plan, detailed P&L)\n- Years 2–3: Moderate detail (quarterly revenue, summarized costs)\n- Years 4–5: High-level (annual, showing path to profitability)\n\n**Red flags that turn off investors**:\n- Revenue forecast that's too aggressive (80%+ YoY growth for mature SaaS)\n- Costs that don't scale with revenue (claiming you can grow 50% with 0% cost increase)\n- Unrealistic hiring plan (plan to hire 10 engineers in Q1 when you currently have 2)\n- Weak assumptions (\"we'll achieve 1% churn\" without explanation)\n- No sensitivity analysis (only one scenario)\n\n**What investors are really testing**:\n- Is the math internally consistent? (Does hiring plan match revenue goals?)\n- Are the growth assumptions realistic? (Do they align with your sales pipeline?)\n- What's the path to profitability? (When do you break even?)\n- How much capital do you need? (Based on forecast cash flow)\n\n**Series A investor expectation**:\n- 3–5 year forecast showing path to $100M+ ARR\n- Breakeven or near-breakeven by year 4–5\n- Detailed Year 1 assumptions, sensible future years\n- Monthly cash flow modeling (\"how much capital do you need?\")"
      }
    ],
    relatedSlugs: [
      "series-a-prep-uk-cfo-financial-requirements",
      "saas-cash-flow-fundamentals-inflows-outflows",
      "understanding-4-cfo-metric-cards"
    ],
    faq: [
      {
        q: "How often should I update my financial forecast?",
        a: "Monthly for early-stage, quarterly for growth-stage. As actuals come in, update next year's assumptions. Compare forecast vs. actuals to validate/adjust your model."
      },
      {
        q: "Should I show investors my detailed assumptions?",
        a: "Yes. In diligence, you'll share a detailed model with assumptions clearly labeled. Investors will challenge you on each assumption. Be prepared to defend your numbers."
      },
      {
        q: "What if my forecast is wrong?",
        a: "All forecasts are wrong; that's expected. What matters is that your assumptions are reasonable and you can explain your thinking. Investors are more concerned about your judgment than your ability to predict the future perfectly."
      }
    ],
    videoUrl: ""
  }
];
