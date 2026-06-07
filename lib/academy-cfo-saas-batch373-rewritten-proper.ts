import { AcademyArticle } from "@/types/academy";

export const batch373Articles: AcademyArticle[] = [
  {
    slug: "saas-revenue-forecasting-models",
    title: "SaaS Revenue Forecasting Models: Building Accurate Projections",
    description: "Master revenue forecasting. Build bottom-up models, forecast ARR, and improve forecast accuracy.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["revenue forecasting", "ARR forecast", "financial model", "projection", "bottom-up forecast"],
    keyTakeaways: [
      "Bottom-up ARR forecasting: Start with existing ARR, then model each component. Formula: Next month ARR = Current ARR + New ARR + Expansion ARR - Churned ARR - Contraction ARR. Example: £1M ARR + £80K new + £30K expansion - £20K churn - £5K contraction = £1.085M. Project each component monthly using pipeline data (new), historical rates (expansion/churn). Accuracy: Bottom-up is 85-95% accurate for 3-month forecasts.",
      "Pipeline-based forecasting: Weight pipeline by stage probability. Stages: Discovery (10%), Qualified (25%), Proposal (50%), Negotiation (75%), Verbal commit (90%). Example: £500K pipeline at Discovery = £50K weighted, £200K at Proposal = £100K weighted. Total weighted pipeline: £150K expected new ARR. Compare weighted pipeline to quota (pipeline coverage ratio target: 3-4x quota). If quota is £100K and pipeline is £300K weighted = 3x coverage (adequate).",
      "Forecast accuracy measurement: Track forecast vs actuals monthly. Metrics: (1) Mean Absolute Percentage Error (MAPE) — target <15%, (2) Forecast bias (consistently over/under), (3) Weighted pipeline accuracy by stage. Example: Forecasted £100K new ARR, actual £92K = 8% error (good). Track by sales rep (identify optimists/pessimists). Calibrate stage probabilities quarterly based on historical conversion rates."
    ],
    content: [
      {
        heading: "Building Accurate SaaS Revenue Forecasting Models",
        body: `Creating reliable revenue projections for planning and investor reporting.

**Bottom-up ARR forecast model**

The ARR bridge framework:

Opening ARR
+ New ARR (new logos)
+ Expansion ARR (upsells, cross-sells)
- Churned ARR (lost customers)
- Contraction ARR (downgrades)
= Closing ARR

Monthly forecast example:

| Component | Jan | Feb | Mar | Q1 total |
|---|---|---|---|---|
| Opening ARR | £1,000K | £1,085K | £1,173K | £1,000K |
| + New ARR | £80K | £85K | £90K | £255K |
| + Expansion | £30K | £28K | £35K | £93K |
| - Churn | -£20K | -£22K | -£18K | -£60K |
| - Contraction | -£5K | -£3K | -£7K | -£15K |
| Closing ARR | £1,085K | £1,173K | £1,273K | £1,273K |

Forecasting each component:

New ARR:

Source: Sales pipeline
Method: Weight by stage probability

Pipeline snapshot:

| Deal | Value | Stage | Probability | Weighted |
|---|---|---|---|---|
| Acme Corp | £50K | Negotiation | 75% | £37.5K |
| Beta Inc | £30K | Proposal | 50% | £15K |
| Gamma Ltd | £20K | Qualified | 25% | £5K |
| Delta Co | £40K | Discovery | 10% | £4K |
| Total | £140K | | | £61.5K |

Expected new ARR from pipeline: £61.5K
Add: Deals not yet in pipeline (historical run-rate): £20K
Total forecast new ARR: ~£81.5K

Expansion ARR:

Method: Historical expansion rate × eligible base

Historical data:
- Average monthly expansion rate: 2.5% of eligible ARR
- Eligible ARR (customers >6 months old): £800K
- Expected expansion: £800K × 2.5% = £20K

Adjust for known upsells:
- Customer X committed to upgrade: £10K
- Total expansion forecast: £30K

Churn:

Method: Historical churn rate × ARR base

Historical data:
- Average monthly gross churn rate: 1.8%
- Current ARR: £1,000K
- Expected churn: £1,000K × 1.8% = £18K

Adjust for known risks:
- Customer Y signalled potential churn: £5K (weight 50% = £2.5K)
- Total churn forecast: £20.5K

Contraction:

Method: Historical contraction rate

Historical data:
- Average monthly contraction: 0.5% of ARR
- Expected: £1,000K × 0.5% = £5K

**Top-down forecast model**

When to use top-down:
- Long-range planning (12-36 months)
- Board presentations
- Fundraising projections
- Scenario planning

Method: Apply growth rates to current ARR

Simple growth model:

Current ARR: £1,000K
Historical monthly growth rate: 8%

| Month | ARR | Monthly growth |
|---|---|---|
| Jan | £1,000K | base |
| Feb | £1,080K | +8% |
| Mar | £1,166K | +8% |
| Jun | £1,469K | +8% |
| Sep | £1,851K | +8% |
| Dec | £2,332K | +8% |

Annual growth: 133% (£1M → £2.33M)

Adjusted growth model (growth deceleration):

Growth typically decelerates as ARR increases:
- £0-1M: 10-15% monthly
- £1-5M: 5-10% monthly
- £5-20M: 3-5% monthly
- £20M+: 2-3% monthly

Apply deceleration:

| Quarter | Starting ARR | Monthly growth | Ending ARR |
|---|---|---|---|
| Q1 | £1,000K | 8% | £1,260K |
| Q2 | £1,260K | 7% | £1,543K |
| Q3 | £1,543K | 6% | £1,837K |
| Q4 | £1,837K | 5% | £2,127K |

Annual growth: 113% (more realistic with deceleration)

**Scenario planning**

Three-scenario model:

Base case (most likely):
- Assumptions: Current growth trajectory continues, moderate improvement in retention, planned hiring executed
- Monthly growth: 7% declining to 5%
- Year-end ARR: £2,127K

Upside case (optimistic):
- Assumptions: New product launch successful, large enterprise deal closes, expansion rate improves
- Monthly growth: 10% declining to 7%
- Year-end ARR: £2,800K

Downside case (conservative):
- Assumptions: Market slowdown, key customer churns, hiring delayed
- Monthly growth: 4% declining to 3%
- Year-end ARR: £1,500K

Scenario probability:
- Upside: 20% probability
- Base: 60% probability
- Downside: 20% probability

Expected value: (20% × £2,800K) + (60% × £2,127K) + (20% × £1,500K) = £2,136K

Use for:
- Budget: Base case
- Fundraising deck: Base case with upside potential
- Cash planning: Downside case (conservative)
- Board reporting: All three with probability weights

**Forecast accuracy tracking**

Monthly tracking template:

| Month | Forecast | Actual | Variance | % error |
|---|---|---|---|---|
| Jan new ARR | £80K | £75K | -£5K | -6.3% |
| Jan expansion | £30K | £35K | +£5K | +16.7% |
| Jan churn | £20K | £18K | -£2K | -10.0% |
| Jan net new | £85K | £87K | +£2K | +2.4% |

MAPE (Mean Absolute Percentage Error):

MAPE = Average of |% errors|
= (6.3% + 16.7% + 10.0% + 2.4%) / 4
= 8.85% (good — target <15%)

Forecast bias analysis:

Over-forecasting (optimistic bias):
- Sales team consistently overestimates pipeline
- Action: Apply haircut to pipeline (e.g., reduce by 15%)

Under-forecasting (conservative bias):
- Team sandbagging to beat forecast
- Action: Adjust stage probabilities upward

Track bias by sales rep:

| Rep | 3-month avg forecast | 3-month avg actual | Bias |
|---|---|---|---|
| Rep A | £50K | £42K | -16% (optimist) |
| Rep B | £40K | £38K | -5% (accurate) |
| Rep C | £35K | £45K | +29% (sandbagger) |

Adjust rep-level forecasts by their historical bias

**Stage probability calibration**

Quarterly calibration:

Analyse deals that closed in last quarter:

| Stage | Deals entering | Deals closed | Actual probability |
|---|---|---|---|
| Discovery | 100 | 8 | 8% |
| Qualified | 60 | 12 | 20% |
| Proposal | 35 | 14 | 40% |
| Negotiation | 20 | 15 | 75% |
| Verbal commit | 16 | 15 | 94% |

Compare to assumed probabilities:
- Discovery: Assumed 10%, actual 8% → Adjust down
- Qualified: Assumed 25%, actual 20% → Adjust down
- Proposal: Assumed 50%, actual 40% → Adjust down
- Negotiation: Assumed 75%, actual 75% → Keep
- Verbal: Assumed 90%, actual 94% → Keep

Impact of calibration:

Before calibration:
- Pipeline: £500K at Discovery
- Weighted: £500K × 10% = £50K

After calibration:
- Same pipeline: £500K at Discovery
- Weighted: £500K × 8% = £40K

Difference: £10K per month forecast (significant over time)

**Advanced forecasting techniques**

Cohort-based forecasting:

Instead of single churn rate, use cohort-specific rates:

| Cohort age | Monthly churn rate | ARR in cohort |
|---|---|---|
| 0-3 months | 3.0% | £200K |
| 3-6 months | 2.5% | £150K |
| 6-12 months | 1.5% | £250K |
| 12-24 months | 1.0% | £200K |
| 24+ months | 0.5% | £200K |

Weighted churn forecast:
= (£200K × 3%) + (£150K × 2.5%) + (£250K × 1.5%) + (£200K × 1%) + (£200K × 0.5%)
= £6K + £3.75K + £3.75K + £2K + £1K
= £16.5K

vs simple average: £1,000K × 1.65% = £16.5K (happens to match, but cohort method is more accurate when cohort mix changes)

Seasonal adjustment:

SaaS often has quarterly patterns:
- Q1: Slowest (budget cycle recovery)
- Q2: Average
- Q3: Below average (summer)
- Q4: Strongest (year-end budget flush)

Seasonal factors (example):
- Q1: 0.85x (15% below average)
- Q2: 1.00x
- Q3: 0.90x (10% below average)
- Q4: 1.25x (25% above average)

Apply to forecast:
- Average monthly new ARR: £80K
- January forecast: £80K × 0.85 = £68K
- October forecast: £80K × 1.25 = £100K

`
      }
    ],
    relatedSlugs: ["financial-modeling-and-forecasting-techniques", "sales-forecasting-and-pipeline-management", "metrics-dashboard-design-kpi-tracking", "financial-planning-and-budgeting", "saas-metrics-benchmarking-and-peer-comparison"],
    faq: [
      { q: "How do I build a bottom-up ARR forecast?", a: "Start with current ARR, then model: + New ARR (from weighted pipeline by stage probability) + Expansion (historical rate × eligible base) - Churn (historical rate × ARR base) - Contraction (historical rate). Example: £1M + £80K new + £30K expansion - £20K churn - £5K contraction = £1.085M. Project monthly. Bottom-up is 85-95% accurate for 3-month forecasts." },
      { q: "What pipeline coverage ratio should I target?", a: "Target 3-4x weighted pipeline coverage of quota. Example: £100K monthly quota needs £300-400K in weighted pipeline. Weight by stage: Discovery (10%), Qualified (25%), Proposal (50%), Negotiation (75%), Verbal (90%). Calibrate probabilities quarterly against actual close rates. If coverage is below 3x, either pipeline generation or conversion needs improvement." },
      { q: "How do I measure forecast accuracy?", a: "Track MAPE (Mean Absolute Percentage Error) — target <15%. Compare forecast vs actual monthly for each component (new, expansion, churn). Track forecast bias by rep (optimists vs sandabaggers). Calibrate stage probabilities quarterly. Example: Forecasted £100K new ARR, actual £92K = 8% error (good). Consistent over/under-forecasting indicates systematic bias to correct." }
    ],
    videoUrl: ""
  }
];

export default batch373Articles;
