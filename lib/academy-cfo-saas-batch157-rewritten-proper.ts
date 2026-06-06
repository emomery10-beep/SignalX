import { AcademyArticle } from "@/types/academy";

export const batch157Articles: AcademyArticle[] = [
  {
    slug: "building-a-financial-forecasting-model",
    title: "Building a Financial Forecasting Model: Planning the Future with Data",
    description: "Master financial forecasting. Build bottom-up models, project revenue and expenses, run scenarios, and make data-driven decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "financial forecasting",
      "financial model",
      "revenue forecast",
      "expense forecast",
      "scenario planning",
      "cash flow forecast",
      "revenue projections",
      "bottom-up forecasting",
      "financial planning",
      "forecasting accuracy"
    ],
    keyTakeaways: [
      "Bottom-up forecasting: Build from components (each customer, each expense) rather than extrapolating past. Example: Don't say \"30% growth every month.\" Instead: \"50 new customers/month at £1K ACV = £50K new MRR, minus 2% churn on £500K base = £50K - £10K = £40K net.\". More accurate because accounts for churn, expansion, real drivers.",
      "Three scenarios: Bull (25% probability, 8% monthly growth), Base (50%, 5% growth), Bear (25%, 2% growth). Example: Base case £100K month 1 → £500K month 12. Bull case £100K → £600K. Bear case £100K → £300K. Share all three with board (not just rosy case). Base case is most likely (plan on that), Bull/Bear show upside/downside.",
      "Updating forecast: Monthly vs quarterly plan. Monthly: Adjust for actuals (track variance). Quarterly: Full reforecast based on new information (market change, new hires, product launch). Example: Forecast January, actual revenue 10% below, adjust February forecast down 10%. New information Q2 (big customer won), reforecast full year up 20%."
    ],
    content: [
      {
        heading: "Building a Bottom-Up Revenue Forecast",
        body: `Forecasting from first principles.

**Components of Revenue Forecast**

Revenue = Function of:
1. New customer acquisition (salespeople, marketing efficiency)
2. Existing customer retention (churn rate)
3. Expansion revenue (upsells, upgrades)

Example build:

| Factor | Month 1 | Month 2 | Month 3 | Note |
|--------|---------|---------|---------|------|
| **New customers** | 50 | 60 | 70 | Ramp: Hiring 2 sales reps |
| **Avg ACV** | £1K | £1K | £1K | Stable |
| **New MRR** | £50K | £60K | £70K | 50 × £1K, etc |
| **Existing revenue** | £100K | £150K | £210K | Prior month + new |
| **Churn** | 2% | 2% | 2% | Historical |
| **Churn MRR** | -£2K | -£3K | -£4.2K | 2% of month start |
| **Expansion** | £5K | £6K | £7K | 5% of existing |
| **End MRR** | £153K | £213K | £282.8K | New - Churn + Expansion |
| **Growth %** | 53% | 39% | 33% | Month-over-month |

Pattern: New customer growth strong, but growth rate decelerates (normal as base gets bigger).

**Key Drivers to Estimate**

1. Sales capacity (new customers/month)
   - Current: 2 sales reps, 25 customers per rep = 50/month
   - Month 3: Hire 2 more reps = 100/month
   - Requires: Forecasting hiring plan aligned with growth

2. ACV (Average Contract Value)
   - Current: £1K/month
   - Stable or growing (if expanding to larger customers)
   - Forecast by segment (SMB £500, mid-market £2K, enterprise £5K)

3. Churn rate
   - Historical: 2% monthly
   - Assume stable (unless CS changes expected)
   - Could improve with product updates (model conservatively)

4. Expansion rate
   - Historical: 5% of existing revenue
   - Assume stable (unless expansion program starting)
   - Could improve with upsell initiatives (model conservatively)

**Building the Model in Spreadsheet**

Structure (Google Sheets or Excel):

Columns: Month 1 to Month 12 (or Month 1 to Month 24)

Rows: New customers, ACV, new MRR, churn rate, churn MRR, expansion %, expansion MRR, ending MRR

Formulas:
- New MRR = New customers × ACV
- Churn MRR = Beginning MRR × Churn rate
- Expansion MRR = Beginning MRR × Expansion rate
- Ending MRR = Beginning MRR + New MRR - Churn MRR + Expansion MRR

Chart:
- MRR trend (line chart showing growth over 12 months)
- Growth rate trend (declining as scale up, normal)

`
      },
      {
        heading: "Building an Expense Forecast",
        body: `Forecasting costs to match growth.

**Fixed vs Variable Costs**

Fixed costs (don't scale):
- Office rent: £10K/month (same whether 10 or 100 employees)
- Executive salaries: £30K/month (CEO + CFO)
- Licenses: £5K/month (Salesforce, HubSpot, etc)
- Total fixed: ~£45K/month

Variable costs (scale with business):
- Sales commissions: 5% of new MRR (new customer incentive)
- Hosting: £0.10 per customer (scales with customer count)
- Support staff: 1 per 200 customers (hire as grow)

**Building Headcount Plan**

Forecast hiring by department:

| Month | Sales | Engineering | CS | G&A | Total | Monthly Cost |
|-------|-------|---|---|---|---|---|
| Month 1 | 2 | 4 | 1 | 2 | 9 | £60K |
| Month 3 | 4 | 5 | 2 | 2 | 13 | £80K |
| Month 6 | 6 | 7 | 3 | 3 | 19 | £110K |
| Month 12 | 10 | 10 | 5 | 4 | 29 | £160K |

Assumptions:
- Sales rep: £50K salary, 3 months ramp
- Engineer: £100K salary
- CS: £50K salary
- Manager/G&A: £70K salary

Monthly cost = Headcount × average salary / 12 months + overhead

**Expense Categories**

Typical SaaS expense breakdown:

| Category | Month 1 | Month 12 | Note |
|----------|---------|----------|------|
| **Personnel** | £60K | £160K | Salaries + benefits |
| **COGS** | £20K | £60K | Hosting, support materials |
| **Sales & Marketing** | £15K | £50K | Ads, tools, commissions |
| **Tech & Infrastructure** | £8K | £20K | Cloud, security, tools |
| **G&A** | £10K | £20K | Legal, accounting, admin |
| **Other** | £5K | £15K | Travel, misc |
| **Total OpEx** | £118K | £325K | Increases with scale |

Operating margin = (Revenue - OpEx) / Revenue
- Month 1: (£150K - £118K) / £150K = 21%
- Month 12: (£282K - £325K) / £282K = -15% (unprofitable, plan to cut or grow faster)

`
      },
      {
        heading: "Scenario Planning and Sensitivity",
        body: `Planning for different futures.

**Three Scenarios**

Bull case (upside, 25% probability):
- New customers +20% faster (60 → 72)
- Churn improves 0.5% (2% → 1.5%, from better CS)
- ACV grows 10% (£1K → £1.1K, larger deals)
- Result: Month 12 MRR £350K (vs base £282K)

Base case (most likely, 50% probability):
- New customers stable (50/month baseline)
- Churn stable (2%)
- ACV stable (£1K)
- Result: Month 12 MRR £282K (base forecast)

Bear case (downside, 25% probability):
- New customers -30% (50 → 35)
- Churn increases 1% (2% → 3%, from poor product)
- ACV flat (£1K)
- Result: Month 12 MRR £150K (vs base £282K)

**Sensitivity Analysis**

How sensitive is result to key assumptions?

Example: If churn changes 0.5%, what happens to MRR?
- 1.5% churn: MRR higher (less attrition)
- 2.5% churn: MRR lower (more attrition)
- Sensitivity: ±0.5% churn ≈ ±15% MRR impact (significant)

Build sensitivity table:

| Churn % | Month 12 MRR |
|---------|---|
| 1% | £320K |
| 1.5% | £300K |
| 2% | £282K |
| 2.5% | £265K |
| 3% | £248K |

Insight: Churn is high-impact metric (focus on improving).

**Forecasting Cash Flow**

Revenue vs cash (timing difference):

Monthly billing: Customer pays £1K/month, you get cash month 1
Annual billing: Customer pays £12K upfront, you get cash month 1, recognize revenue monthly (deferred revenue)

Forecast:
- Cash in: Consider payment terms (net-30 = 1 month delay)
- Cash out: Salaries (month 1), expenses (month 1), but some delayed (net-30 payables)

Example:
- Month 1 revenue: £150K
- Cash collected: £140K (some invoiced month-end, not collected)
- Month 1 expenses: £118K
- Cash out: £118K
- Net cash: +£22K

Cash forecast different from revenue forecast (important for runway).

`
      },
      {
        heading: "Updating and Managing Your Forecast",
        body: `Keeping forecast accurate as business evolves.

**Monthly vs Quarterly Updates**

Monthly update (lightweight):
- Actual revenue vs forecast (variance analysis)
- Adjust next month if different (if revenue down 10%, reduce forecast 10%)
- Keep spreadsheet formula-based (easy to update)
- 1-2 hour monthly review

Quarterly reforecast (comprehensive):
- Actual vs plan for full quarter
- New information? Market change? Product launch? Hiring plan?
- Reforecast full 12 months with new assumptions
- Deep review: What changed? Why? Impact?
- 4-8 hour quarterly deep-dive

**Forecasting Accuracy**

Track variance: Actual vs forecast

| Month | Forecast | Actual | Variance | % |
|-------|----------|--------|----------|---|
| Month 1 | £150K | £148K | -£2K | -1% |
| Month 2 | £210K | £205K | -£5K | -2% |
| Month 3 | £280K | £275K | -£5K | -2% |

Bias: Consistently forecast higher (overly optimistic). Adjust model.

Accuracy targets:
- Within 5% monthly: Good
- Within 3% monthly: Excellent
- Within 10% annually: Acceptable for long-term forecast

**Common Forecasting Mistakes**

Mistake 1: Hockey stick (exponential growth)
- Forecast: 5% month 1, 10% month 2, 20% month 3, 40% month 4
- Reality: Doesn't happen (growth plateaus, competition, market saturation)
- Better: Smooth growth with realistic deceleration

Mistake 2: Ignoring churn
- Forecast: 50 new customers × £1K = £50K new MRR
- Forget: 100 existing customers × 2% churn = -£2K churn
- Reality: Net +£48K, not +£50K
- Better: Always account for churn and expansion

Mistake 3: Fixed ACV
- Assume: All customers £1K ACV forever
- Reality: Sales team lands larger customers (ACV grows) or smaller customers (ACV shrinks)
- Better: Model ACV by customer segment, trend over time

Mistake 4: No variance
- Forecast: Exact numbers (£150K, £210K, £280K)
- Reality: Range more accurate (£140-160K, £200-220K, £270-290K)
- Better: Show ranges (low/base/high case)

**Communicating Forecasts**

To board:
- \"Base case: £282K MRR month 12 (3x current), 32% operating margin\"
- \"Bull case: £350K (8% upside if churn improves + ACV grows)\"
- \"Bear case: £150K (if new customer growth slows due to market)\"
- \"Most likely: Base case, plan on that\"

To team:
- \"We're forecasting 5% monthly growth (50 new customers/month)\"
- \"That means hiring 2 sales reps by month 6\"
- \"On track: Revenue tracking to forecast (actual £148K vs £150K forecast)\"

Transparency: Share forecast, explain assumptions, track actual vs plan.

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "burn-rate-and-cash-runway-analysis",
      "p-l-statement-architecture-profitability",
      "metrics-dashboard-design-kpi-tracking",
      "quarterly-business-reviews-and-planning"
    ],
    faq: [
      {
        q: "How do I build a financial forecast?",
        a: "Start with components: (1) New customer forecast (sales capacity × ACV), (2) Churn (% customers lost), (3) Expansion (growth from existing). Formula: End MRR = Start MRR + New - Churn + Expansion. Build in spreadsheet with monthly columns for 12 months. Chart the result. Update monthly (adjust for actuals), reforecast quarterly (new assumptions)."
      },
      {
        q: "What assumptions should I make?",
        a: "Key assumptions: (1) New customers/month (sales ramp?), (2) ACV (average contract value), (3) Churn (%, monthly), (4) Expansion (% of existing), (5) Headcount plan (hiring timeline), (6) Unit costs (hosting, support). Be conservative (better to beat, worse to miss). Document assumptions (easy to test sensitivity)."
      },
      {
        q: "Should I forecast best case or realistic case?",
        a: "Both. Build three scenarios: Bull (upside, 25% prob, +50% growth), Base (most likely, 50% prob, 5% growth), Bear (downside, 25% prob, 2% growth). Plan on Base case (most likely). Share all three with board (shows risks). Investors want realistic, not rosy."
      },
      {
        q: "How often should I update my forecast?",
        a: "Monthly: Quick review, adjust if materially different (actual <5% off = no change, actual >10% off = adjust). Quarterly: Full reforecast with new assumptions (new information, market change, hiring plan change, product impact). Keep spreadsheet formula-based (easy to recalculate). Track actual vs forecast (identify bias)."
      }
    ],
    videoUrl: ""
  }
];

export default batch157Articles;
