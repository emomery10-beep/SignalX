import { AcademyArticle } from "@/types/academy";

export const batch255Articles: AcademyArticle[] = [
  {
    slug: "advanced-financial-modeling-and-forecasting",
    title: "Advanced Financial Modeling and Forecasting: Building Predictive Models",
    description: "Master financial modeling. Build flexible models, forecast accurately, stress test scenarios.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["financial modeling", "forecasting", "cohort modeling", "scenario analysis", "P&L model", "cash flow forecast", "growth model"],
    keyTakeaways: [
      "Model architecture: Bottom-up (sales forecast from pipeline, headcount from plan, spend from budget) vs top-down (% of revenue, %). Hybrid: Sales bottom-up (most important), overhead top-down (% of revenue). Dynamic: Update monthly (actual results, new info) vs static (set and forget). Example: £1M revenue goal. Bottom-up: 50 customers at £20K ACV, 5 AEs each closing 10 → 50 deals. Cost: 5 AEs × £150K each = £750K (60% OpEx). Top-down: Overhead 15% revenue = £150K, total cost £900K. Tools: Excel (simple, 100% useful), Anaplan (complex, auto-calc), custom Python (for ML models). Recommendation: Excel for early (under £10M), Anaplan for scaling.",
      "Cohort-based modeling: Model customers by cohort (cohorts starting same month have similar behavior). Retention: Use historical cohort retention curves. Example: Cohort Jan start, 95% month 1, 75% month 3, 50% month 12 (historical). Forecast: If Jan cohort 100 customers, expect month 12 = 50 customers. CAC and LTV by cohort: Early cohorts higher CAC (less efficient), newer cohorts lower CAC (better marketing). Revenue by cohort: Jan cohort grows as onboards, stabilizes, then churns (predictable curve). Sum all cohorts = total forecast. Benefit: More accurate (cohort patterns repeat) vs high-level (arbitrary assumptions).",
      "Scenario planning: Base case (expected, 70% probability), upside (50% growth, better unit economics), downside (25% growth, higher churn). Stress test: Major customer leaves (20% revenue loss), recession (growth -50%), competitive threat (churn +2%). Build model = run scenarios monthly. Adjust: If heading toward downside, cut costs (extend runway). If upside trajectory, accelerate hiring. Cost: Model build (4 weeks dev), monthly updates (2 hours). Benefit: Early warning (see cash crisis coming 6 months early, have time to fix), confidence (board/investors understand scenarios)."
    ],
    content: [
      {
        heading: "Building Financial Models and Scenarios",
        body: `Creating flexible, predictive models.

**Financial model structure**

Inputs (assumptions):
- Sales: Deal size, win rate, sales cycle, number of salespeople
- Marketing: Leads, conversion rate, CAC by channel
- Retention: Monthly churn rate (by cohort), NRR expansion
- Pricing: ARPU, price increases, mix of tiers
- Hiring: Headcount plan, ramp time, salary structure
- Infrastructure: Cost scales with revenue or headcount

Calculations (derived):
- Revenue: From sales model (cohort-based)
- COGS: Infrastructure, payment processing (% of revenue)
- Operating expense: Salaries + tools + other (% or fixed)
- P&L: Revenue - COGS - OpEx = profit/loss
- Cash: Adjust for timing (upfront payments, payables)
- Runway: Cash on hand / monthly burn

Example inputs:
| Input | Value |
|---|---|
| Starting customers | 50 |
| New customers/month | 10 |
| Churn rate | 2% |
| ARPU | £5,000 |
| COGS | 20% |
| OpEx | 60% of revenue |

Calculated:
- Month 1: 50 customers × £5K × 80% (COGS) = £200K revenue, cost £120K COGS + £120K OpEx = loss £40K
- Month 2: (50 + 10 - 1) = 59 customers, £236K revenue...

**Cohort-based revenue model**

Model customers by cohort:

| Cohort | Customers | Month 1 | Month 3 | Month 6 | Month 12 |
|---|---|---|---|---|---|
| Jan | 10 | 9.5 | 7.5 | 5.0 | 2.5 |
| Feb | 12 | 11.4 | 9.0 | 6.0 | 3.0 |
| Mar | 15 | 14.25 | 11.25 | 7.5 | 3.75 |
| Apr | 18 | 17.1 | 13.5 | 9.0 | 4.5 |

Retention: 95% month 1, 75% month 3, 50% month 6, 25% month 12

Revenue by cohort:
- Jan cohort: 10 customers, £5K ARPU = £50K/month
- Expand: Growth from 50K (month 1) → 38K (month 3) → 25K (month 6) → 13K (month 12)

Total revenue:
- Sum all cohorts (Jan + Feb + Mar + Apr...)
- Forecast future cohorts (assume 12-15 new customers/month)
- Total forecast = growing (new cohorts) but existing churn

**Scenario modeling**

Base case (expected):
- Revenue growth: 50% YoY
- Churn: 2% monthly
- CAC: £2K, payback 10 months
- Runway: 12 months (assuming £100K burn)

Upside case:
- Growth: 100% YoY (double base case)
- Churn: 1% (better retention)
- CAC: £1.5K (better efficiency)
- Runway: 18+ months (margin improvement)

Downside case:
- Growth: 25% YoY (half base)
- Churn: 3% (worse retention)
- CAC: £2.5K (spending more for same results)
- Runway: 8 months (cash crisis likely)

Stress tests:
- Top customer (30%) leaves: Revenue -30%, impact major
- Recession: Growth -50%, churn +2%, need to cut costs
- Competitor: Churn +1%, need to differentiate or lower price

Implementation:
- Build base model (accurate to actuals)
- Copy tabs for upside/downside
- Change key assumptions (growth, churn, CAC)
- Show P&L impact quarterly
- Adjust assumptions as actuals come in

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "scenario-planning-and-sensitivity-analysis", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "Should I build a financial model?", a: "Yes, if raising money (Series A+). Build: Bottom-up sales forecast, cohort-based revenue model, OpEx as % of revenue. Tools: Excel (most flexible), Anaplan (automated). Monthly updates: Compare actual to forecast, adjust assumptions. Cost: 4 weeks build, 2 hours/month updates." },
      { q: "What modeling approach is best?", a: "Cohort-based revenue model: Most accurate for SaaS (customers by signup cohort, predict based on historical retention). Top-down sales: 50 customers × £20K ACV × 80% close = £800K. Bottom-up: 5 AEs × 10 deals × £20K = £1M. Combine: Sales bottom-up (accurate), overhead top-down (% of revenue)." },
      { q: "How do I do scenario planning?", a: "Base case: Expected, 70% probability. Upside: 100% growth, lower churn/CAC. Downside: 25% growth, higher churn/CAC. Stress test: Major customer loss, recession, competitor. Model: Base scenario → inputs → P&L → cash → runway. Compare scenarios quarterly, adjust if heading toward downside." }
    ],
    videoUrl: ""
  }
];

export default batch255Articles;