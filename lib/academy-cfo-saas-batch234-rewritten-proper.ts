import { AcademyArticle } from "@/types/academy";

export const batch234Articles: AcademyArticle[] = [
  {
    slug: "sales-pipeline-management-and-forecasting",
    title: "Sales Pipeline Management and Forecasting: Predictable Revenue",
    description: "Master sales pipeline. Build funnel, forecast accurately, manage deals.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["sales pipeline", "sales forecasting", "pipeline management", "sales funnel", "conversion rates", "sales cycle", "deal management", "pipeline stages"],
    keyTakeaways: [
      "Pipeline fundamentals: Pipeline = total deal value in sales process (target 3-5x quarterly revenue in pipeline). Conversion rates: Lead to SQL 10-20%, SQL to opportunity 20-30%, opportunity to close 30-50% (varies by segment). Example: £100K quota quarter, need 3x pipeline = £300K pipeline. If 30% opportunity close rate, need £1M in opportunities. Forecast: Weighted pipeline (each deal probability × deal value). Forecast accuracy: Use historical close rates by stage (not just probability). Early stage leads (5%), late stage proposals (80%) = more accurate than gut feel.",
      "Pipeline management: Weekly discipline (every deal tracked, stage updated). Tools: Salesforce, Hubspot (standard). Process: Sales rep owns deal progress (move deal forward). Manager reviews weekly (block obstacles, coach deal progression). Forecast: Roll up team pipeline → company forecast. Reconcile: Pipeline vs target (are we on pace?). If behind: Increase inbound, accelerate sales cycle, raise prices (volume or price to hit target). Example: On pace for £8M ARR, target £10M. Options: Increase pipeline 25% (more leads), or shorten sales cycle (improve close rate), or raise price 20% (same deal count, higher ACV).",
      "Deal management: Stages (lead → SQL → opportunity → proposal → close) vary by company. Criteria: What has to happen to move to next stage? Clear criteria = forecasting accuracy. Example: Opportunity stage = discovery call completed + customer has budget approved. Proposal stage = technical evaluation complete + CFO engaged. Without clear criteria: Deals linger, false hope, forecast misses. Reviews: Quarterly forecast calls with CEO/board (accuracy critical). Variance: If forecast miss >15%, issue (process needs improvement). Most: 5-10% miss acceptable (some deals slip to next quarter)."
    ],
    content: [
      {
        heading: "Building and Managing a Sales Pipeline",
        body: `Creating predictable, accurate sales forecasts.

**Pipeline stages and conversion rates**

Typical SaaS funnel:
| Stage | Definition | Conversion | Typical win probability |
|---|---|---|---|
| Inbound lead | Website, trial signup | 10-30% → SQL | 5% |
| Sales Qualified Lead (SQL) | Initial call qualified, need | 20-50% → Opp | 10% |
| Opportunity | Discovery done, budget + timeline | 30-60% → Proposal | 30% |
| Proposal | Technical fit proven, demo done | 50-70% → Negotiation | 50% |
| Negotiation | Pricing discussed, draft contract | 70-90% → Close | 80% |
| Close | Signed contract, customer live | 100% → Revenue | 100% |

Conversion example:
- 100 leads → 20 SQL (20%) → 6 opportunities (30%) → 3 proposals (50%) → 2 close (67%)
- If each deal worth £5K, 2 closes = £10K revenue
- Pipeline needed: 100 leads × £5K = £500K gross pipeline (but only £10K closes)
- Weighted pipeline: (20 × 5%) + (6 × 30%) + (3 × 50%) + (2 × 80%) = £19.8K expected value

**Pipeline forecasting**

Weighted forecast method:
- Each deal: Deal amount × Win probability (by stage)
- Total: Sum of all deals × win %
- More accurate: Use historical rates by stage, not manager estimate

Example:
| Deal | Amount | Stage | Prob % | Weighted |
|---|---|---|---|---|
| Acme Corp | £10K | Proposal | 50% | £5K |
| TechCo | £8K | Opportunity | 30% | £2.4K |
| StartupX | £5K | SQL | 10% | £0.5K |
| Total | £23K | | 30% avg | £7.9K |

Forecast accuracy:
- Use historical close rates by stage (don't estimate)
- Track monthly: Actual vs forecast, % variance
- Improve: If forecast miss >15% consistently, diagnose (poor qualification? sales cycle longer? product-market fit issue?)

**Pipeline management discipline**

Weekly:
- Sales rep: Update all deals (stage, probability, next action)
- Manager review: 15 min per rep (are we moving deals forward?)
- Blockers: Help rep unblock (customer question, technical issue, procurement)

Monthly:
- Reconcile: Pipeline vs monthly target (are we on pace for quarter?)
- Analysis: Top opportunities (which can close this quarter?), at-risk (which might slip?)
- Forecast: Update month-end deal probability

Quarterly:
- Board review: Pipeline vs target, forecast accuracy, plan to fill gaps
- Variance analysis: Why actual vs plan? (lead quality? sales cycle? win rate?)
- Course correct: If behind, increase pipeline or shorten cycle

`
      }
    ],
    relatedSlugs: ["customer-acquisition-strategy-and-marketing-roi", "account-management-and-expansion-revenue", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How much pipeline should I have?", a: "Target: 3-5x quarterly revenue in pipeline. Example: £100K quarter goal needs £300-500K pipeline. Higher: If closing ratio is lower. Lower: If closing ratio is higher. Track: Weighted pipeline (deal value × win % by stage, not gut feel)." },
      { q: "How accurate should my sales forecast be?", a: "Target: Within 5-10% of plan. Acceptable: 10-15% variance. Poor: >15% variance (indicates process issue, low data quality, or qualification problem). Improve: Use historical close rates by stage, not estimates. Weekly pipeline reviews, disciplined stage criteria." },
      { q: "How do I improve forecast accuracy?", a: "1. Clear stage definitions (what must happen to move stage?). 2. Use historical close rates by stage (not probability estimates). 3. Weekly rep updates + manager reviews. 4. Reconcile actual vs forecast monthly. 5. Root cause analysis on variances. Most SaaS: 85-90% forecast accuracy achievable with discipline." }
    ],
    videoUrl: ""
  }
];

export default batch234Articles;