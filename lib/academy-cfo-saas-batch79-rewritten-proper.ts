import { AcademyArticle } from "@/types/academy";

export const batch79Articles: AcademyArticle[] = [
  {
    slug: "financial-forecasting-modeling",
    title: "Financial Forecasting and Modeling: Predicting Revenue, Expenses, and Runway",
    description: "Build financial forecasts for your SaaS business. Model different scenarios and understand your path to profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "financial forecasting",
      "financial modeling",
      "revenue forecasting",
      "expense forecasting",
      "scenario planning",
      "cash flow forecast",
      "revenue model",
      "P&L forecast",
      "profitability timeline",
      "projection"
    ],
    keyTakeaways: [
      "Build three scenarios: Base case (most likely), upside (better execution), downside (market slows); base case should be 70% of upside and 130% of downside (realistic); example: £2M ARR year 1 base case = upside £3M (50% growth) and downside £1.2M (40% growth slowdown); use base case for planning, upside/downside for stress testing",
      "Forecast components: Beginning MRR, new customer acquisition (by channel), expansion revenue (upsells), churn, ending MRR; detail by: month (first 12), quarter (next 8), year (2+ years); monthly detail matters for cash planning (uneven acquisition timing), yearly detail matters for strategy",
      "Model assumptions: Customer acquisition (customers/month by channel, CAC), ACV (by segment), churn rate (by segment), expansion rate, headcount growth, burn rate; update assumptions monthly as actual results come in; forecast accuracy improves over time as assumptions harden (3-month track record = confident, 1-month = not reliable)"
    ],
    content: [
      {
        heading: "Building a Financial Forecast Model",
        body: `A financial forecast predicts future revenue, expenses, and cash position. Essential for planning and fundraising.

**Forecast Timeline**

Standard forecast:
- 12 months: Detailed monthly (planning, cash management)
- 24-36 months: Quarterly (strategy, hiring decisions)
- 5 years: Annual (board planning)

Most startups focus on 12-month detailed forecast + 3-year annual.

**Forecast Scenarios**

Build three scenarios:

1. **Base case** (most likely, 70% of upside)
   - Realistic execution of plan
   - Conservative on growth assumptions
   - Expected outcome if you execute well

2. **Upside** (excellent execution, 50%+ growth)
   - Better-than-expected customer acquisition
   - Lower churn than expected
   - High expansion rate
   - Used for maximum-case runway (everything goes right)

3. **Downside** (market slows, 40% lower growth)
   - Lower customer acquisition (market receptivity down)
   - Higher churn (competitive pressure)
   - Lower expansion (customer budget cuts)
   - Used for minimum-case runway (stress test)

Example:

Year 1 Base case: £2M ARR (50% YoY growth if starting from £1.33M)
Year 1 Upside: £3M ARR (125% YoY growth from £1.33M)
Year 1 Downside: £1.2M ARR (−10% decline from £1.33M)

**Range is 2.5x** (£1.2M to £3M). This is realistic uncertainty for early-stage SaaS.

**Forecast Components**

A SaaS revenue forecast has:

1. **Customer count** (new, expansion, churn)
2. **Average revenue per customer** (ACV changes over time)
3. **Total MRR** (monthly recurring revenue)
4. **Total ARR** (annualized)

Monthly detail:

| Month | Beginning customers | New customers | Expansion | Churn | Ending customers | MRR |
|-------|----------|----------|----------|-------|----------|------|
| Jan | 100 | 20 | 2 | 3 | 119 | £10K |
| Feb | 119 | 25 | 3 | 4 | 143 | £12K |
| Mar | 143 | 30 | 4 | 4 | 173 | £14.5K |
| — | — | — | — | — | — | — |
| Dec | — | — | — | — | 450 | £45K |

Calculations:
- New customers: Sales team, marketing, product-led
- Expansion: Upsells, seat growth, usage increases (% of existing)
- Churn: % lost (usually 2-5% monthly)
- Ending: Beginning + New − Churn + Expansion
- MRR: Ending customers × average revenue per customer

**Expense Forecast**

Parallel expense forecast:

| Month | Salaries | Marketing | Infrastructure | Other | Total OpEx | Gross margin | Burn |
|-------|----------|----------|----------|--------|-----------|----------|------|
| Jan | £50K | £20K | £5K | £10K | £85K | £7K | −£78K |
| Feb | £50K | £20K | £5K | £10K | £85K | £9K | −£76K |
| Mar | £55K (hire) | £20K | £6K | £10K | £91K | £10.1K | −£81K |
| — | — | — | — | — | — | — | — |
| Dec | £100K | £25K | £10K | £15K | £150K | £32K | −£118K |

Burn rate starts high (negative margin), improves as revenue grows faster than expenses (operating leverage).

**Building the Model**

Step 1: List all assumptions

| Assumption | Value | Rationale |
|-----------|-------|-----------|
| Customer acquisition/month | 20 | Based on 3-month sales track record |
| CAC by channel | £2K marketing, £5K sales | Historical averages |
| Churn rate | 3%/month | Cohort data from existing customers |
| ACV | £1K (growing) | Starting at £800, 5% YoY increase |
| Expansion rate | 10%/year | New features upselling |
| Headcount growth | +1 hire/quarter | Plan hiring based on revenue |
| Burn rate | £80K/month | Actual run rate from prior 3 months |

Step 2: Build the revenue model

Calculate month-by-month MRR based on assumptions.

Step 3: Build the expense model

Project hiring, marketing, and fixed costs.

Step 4: Calculate cash flow and runway

Burn = Revenue − Expenses
Runway = Cash in bank ÷ Monthly burn

Step 5: Compare scenarios

Run base/upside/downside through model. Compare outcomes.

**Realistic Assumptions**

Common forecasting mistakes:

**Mistake 1: Over-optimistic customer acquisition**
- Forecast: 50 new customers/month
- Actual: 20 new customers/month
- Why: Underestimated customer acquisition complexity

Fix: Use 3-month trailing average as baseline. Project 10-20% improvement (not 100%).

**Mistake 2: Under-forecasted churn**
- Forecast: 2% churn
- Actual: 5% churn
- Why: New product, churn higher in early-stage

Fix: Use cohort data (actual retention), not hope.

**Mistake 3: Delayed expense growth**
- Forecast: Headcount flat for 6 months
- Actual: Hire month 2 (can't hit growth without team)
- Why: Assumed you'd be more efficient than possible

Fix: Model headcount increase in line with revenue growth (plus 3-month lead time for hiring).

**Scenario Modeling**

Example 3-year forecast with three scenarios:

**Base case** (most likely):

| Year | MRR start | New CAC spend | Churn | Expansion | MRR end | Headcount | Burn |
|-----|----------|----------|--------|----------|---------|-----------|------|
| Year 1 | £100K | £60K/month | 3% | 8% | £1.5M ARR (£125K MRR) | 8 → 15 | £60K/month |
| Year 2 | £125K | £80K/month | 2.5% | 12% | £3.2M ARR (£267K) | 15 → 25 | £20K/month |
| Year 3 | £267K | £100K/month | 2% | 15% | £6.5M ARR (£542K) | 25 → 35 | +£50K/month (profitable) |

**Upside** (50% better):

| Year | MRR start | New CAC spend | Churn | Expansion | MRR end | Headcount | Burn |
|-----|----------|----------|--------|----------|---------|-----------|------|
| Year 1 | £100K | £100K/month | 2% | 12% | £2.2M ARR (£183K) | 8 → 18 | £20K/month |
| Year 2 | £183K | £150K/month | 1.5% | 15% | £5.5M ARR (£458K) | 18 → 30 | +£100K/month (profitable) |
| Year 3 | £458K | £200K/month | 1% | 18% | £12M ARR (£1M) | 30 → 40 | +£300K/month |

**Downside** (40% lower growth):

| Year | MRR start | New CAC spend | Churn | Expansion | MRR end | Headcount | Burn |
|-----|----------|----------|--------|----------|---------|-----------|------|
| Year 1 | £100K | £30K/month | 4% | 4% | £800K ARR (£67K) | 8 → 10 | −£150K/month |
| Year 2 | £67K | £20K/month | 4% | 4% | £600K ARR (£50K) | 10 → 10 | −£200K/month |
| Year 3 | £50K | £10K/month | 4% | 4% | £400K ARR (£33K) | 10 → 8 (layoffs) | −£250K/month |

**Key observations:**
- Base case: Profitability year 3
- Upside: Profitability year 2
- Downside: Never profitable, runway exhausted in 24 months

This drives fundraising need (for downside buffer).

**Using Forecast for Planning**

Forecast should answer:

1. **Runway**: How many months until cash runs out?
   - Base case: 36 months (3 years)
   - Downside: 18 months (high risk)
   - Action: Raise Series B before month 18 (downside worst case)

2. **Hiring**: When can you afford to hire?
   - Year 1: Hire 7 people (growth-stage)
   - Year 2: Hire 10 people (scaling)
   - Year 3: Hire 10 people (mature)
   - Plan headcount based on revenue, not wish list

3. **Break-even**: When is company profitable?
   - Base case: Month 34
   - Upside: Month 15
   - Action: Plan for 34-month path to profitability

4. **Fundraising**: How much to raise?
   - Runway: 18 months (downside)
   - Burn: £80-150K/month
   - Total needed: £80K × 18 = £1.44M (downside minimum)
   - Plus buffer: 20% extra = £1.73M
   - Raise target: £2M (covers downside + buffer)

**Forecast Accuracy**

Forecast accuracy improves over time:

| Time horizon | Accuracy | How to use |
|---|---|---|
| 1-month ahead | 80-90% | Operational decisions (cash timing) |
| 3-months ahead | 60-70% | Hiring, marketing spend |
| 12-months ahead | 40-50% | Strategic direction (rough estimates) |
| 3-years ahead | 20-30% | Directional only (use for scenarios) |

Don't trust 12-month forecasts as absolute truth. Use them directionally.

Update forecast monthly as actual results come in. Adjust assumptions quarterly.

**Forecast Template**

Basic forecast (Excel template):

1. **Assumptions sheet**: Customer acquisition, churn, expansion, ACV, headcount plan
2. **Revenue sheet**: Month-by-month MRR, ARR by cohort
3. **Expenses sheet**: Salaries, marketing, infrastructure, other
4. **P&L sheet**: Revenue − COGS − OpEx = Operating profit
5. **Cash flow sheet**: Beginning cash + Revenue − Expenses = Ending cash (runway)
6. **Scenarios**: Base/upside/downside scenarios for comparison

Key formula:
- MRR = (Beginning customers + New − Churn + Expansion) × ACV
- Burn = Revenue − Total OpEx
- Runway = Cash in bank ÷ Monthly burn

Most SaaS founders use templates from Sequoia, Y Combinator, or build custom models in Excel/Google Sheets.

The key is consistency: Update assumptions monthly, run model, compare to actual, refine.
`
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-planning",
      "unit-economics-deep-dive",
      "cash-management-and-forecasting",
      "metrics-dashboard-design-kpi-tracking",
      "profitability-mechanics"
    ],
    faq: [
      {
        q: "How accurate should my forecast be?",
        a: "1-month ahead: 80-90% accurate. 3-month: 60-70%. 12-month: 40-50%. Don't trust long-term forecasts as truth, use for direction. Update monthly."
      },
      {
        q: "What assumptions should I include?",
        a: "Customer acquisition (per channel), CAC, ACV, churn rate, expansion rate, headcount plan, burn rate. Base assumptions on actual 3-month data, not hopes."
      },
      {
        q: "Should I forecast upside/downside or just base case?",
        a: "All three. Base case for planning, downside for stress-testing (how bad could it get?), upside for opportunity. Investors want to see you've thought through scenarios."
      },
      {
        q: "How often should I update my forecast?",
        a: "Monthly. Compare actual results to forecast, adjust assumptions, re-run model. Quarterly, review and share with board/investors."
      }
    ],
    videoUrl: ""
  }
];

export default batch79Articles;
