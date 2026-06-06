import { AcademyArticle } from "@/types/academy";

export const batch91Articles: AcademyArticle[] = [
  {
    slug: "sales-pipeline-management-forecasting",
    title: "Sales Pipeline Management and Forecasting: Predicting Revenue from the Sales Funnel",
    description: "Manage your sales pipeline effectively. Forecast revenue from pipeline, track deal velocity, and improve win rates.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "sales pipeline",
      "pipeline management",
      "sales forecasting",
      "deal velocity",
      "win rate",
      "pipeline forecast",
      "sales funnel",
      "opportunity management",
      "revenue forecast",
      "sales metrics"
    ],
    keyTakeaways: [
      "Sales pipeline forecast = sum of (deal value × win probability × % of sales cycle complete) for each deal; example: 10 deals × £50K avg value × 60% win rate × 70% complete = £210K forecasted; multiply by historical conversion to validate (if pipeline £1M and historical 30% conversion = £300K expected new ARR); track pipeline monthly, compare to bookings target",
      "Pipeline health metrics: (1) Pipeline coverage ratio = pipeline value ÷ bookings target (should be 3-5x: need 3-5x pipeline to hit target), (2) Deal velocity = average days in each stage (if stuck >30 days in demo stage, investigate why), (3) Win rate = closed/won ÷ all closed deals (should be 20-30% for sales-led; improve with better qualification), (4) Sales cycle length = days from first touch to close (typical 60-90 days for mid-market)",
      "Improve pipeline: (1) Increase pipeline value (more inbound, longer sales cycles), (2) Improve win rate (better qualification, better pitching), (3) Accelerate velocity (reduce days stuck in stages). Most impactful: improve win rate (20% → 25% = +25% revenue from same pipeline). Common mistake: celebrate large pipeline, but low quality (many deals that won't close)"
    ],
    content: [
      {
        heading: "Understanding the Sales Pipeline",
        body: `A sales pipeline is the collection of all active sales opportunities at different stages of the buying process.

**Pipeline Stages**

Standard B2B SaaS pipeline has 5-7 stages:

1. **Prospect/Lead** (not yet qualified)
   - Inbound inquiry or outreach
   - Not yet qualified (may not be buyer)
   - Action: Qualify or disqualify quickly

2. **Qualified Lead (SQL)**
   - Met qualification criteria (budget, timeline, authority)
   - Assigned to sales rep
   - Action: Schedule discovery call

3. **Discovery/Needs Analysis**
   - Initial conversation (understanding needs)
   - Still evaluating if fit
   - Typical duration: 1-2 weeks

4. **Proposal/Demo**
   - Product demo provided
   - Proposal sent with pricing
   - Evaluating fit vs. other options
   - Typical duration: 2-4 weeks

5. **Negotiation**
   - Discussing terms, pricing, contract
   - Legal review (if enterprise)
   - Typical duration: 1-3 weeks

6. **Closed-Won**
   - Deal signed
   - Booked (recognized as revenue)

7. **Closed-Lost**
   - Deal lost to competitor or no decision
   - Track lost reason

**Pipeline Example**

Sales team pipeline snapshot:

| Stage | # of deals | Avg deal value | Total value | Win probability |
|-------|----------|----------|----------|----------|
| Prospect | 50 | £5K | £250K | 10% |
| SQL | 20 | £20K | £400K | 30% |
| Discovery | 15 | £30K | £450K | 50% |
| Proposal | 10 | £40K | £400K | 70% |
| Negotiation | 5 | £50K | £250K | 90% |
| **Total pipeline** | **100** | — | **£1.75M** | — |

**Weighted forecast** (sum of deal value × win probability):
- Prospect: £250K × 10% = £25K
- SQL: £400K × 30% = £120K
- Discovery: £450K × 50% = £225K
- Proposal: £400K × 70% = £280K
- Negotiation: £250K × 90% = £225K
- **Total forecast: £875K**

This means: With this pipeline, you're likely to close £875K this quarter (if nothing changes).

**Pipeline Coverage Ratio**

Coverage ratio = Total pipeline value ÷ Quarterly bookings target

Healthy ratio: 3-5x

Example:
- Quarterly bookings target: £500K
- Current pipeline: £1.75M
- Coverage: 1.75M ÷ 500K = 3.5x (healthy)

If coverage <2x:
- Pipeline too small
- At risk of missing target
- Action: Build more pipeline (more prospecting)

If coverage >5x:
- Pipeline too large
- May indicate qualification issues
- Or very early-stage deals
- Action: Focus on closing (less prospecting)

**Deal Velocity**

Deal velocity = How fast deals move through pipeline.

Tracked by: Average days in each stage

Example:

| Stage | Avg days | Status |
|-------|----------|--------|
| Prospect → SQL | 3 days | Fast (good qualification) |
| SQL → Discovery | 7 days | OK |
| Discovery → Proposal | 10 days | OK |
| Proposal → Negotiation | 14 days | Slow (long demos) |
| Negotiation → Close | 5 days | Fast (clear terms) |
| **Total sales cycle** | **39 days** | Good (under 45 days) |

If proposal stage stuck at 30+ days:
- Investigate: Why long demos?
- Customer indecision? More features needed?
- Competitor evaluation?
- Action: Shorten proposal (decide faster)

Improving velocity: Each week faster = 4-5 additional closes per year (compounding).

**Win Rate**

Win rate = Closed-won deals ÷ (Closed-won + Closed-lost)

Example:
- Closed-won this quarter: 20 deals
- Closed-lost this quarter: 5 deals
- Win rate: 20 ÷ (20 + 5) = 80%

Benchmark:
- Early-stage (product-market fit unproven): 10-20% win rate
- Growth-stage (proven): 20-30% win rate
- Mature (market leader): 30-50% win rate

Improving win rate from 20% to 25%:
- Same pipeline (£1.75M), same velocity
- Revenue improvement: +25%
- This is most impactful lever (vs. adding more pipeline)

**Forecasting Revenue from Pipeline**

Method 1: Weighted forecast (already shown)
- Sum of deal value × win probability
- Best for predicting actual closes

Method 2: Historical conversion
- Pipeline value × Historical close %
- Example: £1.75M × 50% close rate = £875K

Method 3: By stage
- Proposal stage: 100% will likely close or lose (next month)
- Negotiation: 90% will close (next month)
- Discovery: 30% will reach proposal next month
- Action: Forecast Proposal + Negotiation for next month, proportional of earlier for future

**Pipeline Metrics Dashboard**

Track weekly or monthly:

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Pipeline value | £1.5M | £1.75M | ✓ |
| Coverage ratio | 3x | 3.5x | ✓ |
| Weighted forecast | £500K | £600K | ✓ |
| Win rate | 25% | 22% | ⚠ |
| Avg sales cycle | <60 days | 65 days | ⚠ |
| Discovery → Proposal | <15 days | 18 days | ⚠ |

Red flags (investigate):
- Coverage ratio <2x (too little pipeline)
- Win rate declining (quality issue)
- Sales cycle lengthening (friction somewhere)
- Stage velocity increasing (deals getting stuck)

**Common Pipeline Mistakes**

Mistake 1: Sandbag pipeline
- Sales reps inflate deal values
- Report 80% close probability on all deals
- Forecast becomes meaningless

Fix: Enforce realistic win probability by stage (Proposal should be 50-70%, not 90%)

Mistake 2: Pipeline inflation
- Too many unqualified leads
- Pipeline looks big, but close rate low
- Coverage ratio 10x+ (unrealistic)

Fix: Improve qualification (only add real SQLs, not all leads)

Mistake 3: Ignore pipeline build
- Focus only on closing current deals
- Don't prospect (build future pipeline)
- Next quarter, pipeline empty

Fix: Enforce 30-40% of time on prospecting (pipeline building)

Mistake 4: Forecast without validation
- Forecast from pipeline without comparing to actuals
- Learn win rate, conversion each month
- Adjust next forecast

Fix: Track actual closes vs. forecast monthly, refine model
`
      }
    ],
    relatedSlugs: [
      "sales-efficiency-magic-number",
      "customer-acquisition-cost-optimization",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "revenue-recognition-accrual-accounting"
    ],
    faq: [
      {
        q: "What's a healthy pipeline coverage ratio?",
        a: "3-5x is healthy. If your quarterly target is £500K, you want £1.5-2.5M pipeline. <2x = too little pipeline, >5x = poor qualification."
      },
      {
        q: "How do I forecast revenue from pipeline?",
        a: "Multiply deal value by win probability (by stage) and sum. Or use historical close rate (pipeline × avg close %). Update weekly as deals move."
      },
      {
        q: "How long should sales cycle be?",
        a: "30-45 days for SMB, 45-90 days for mid-market, 90-180+ days for enterprise. Typical is 60-90 days. Track by stage to find bottlenecks."
      },
      {
        q: "How do I improve win rate?",
        a: "Better qualification (disqualify early, save time), better pitch (tailor to customer), better product fit (solve real problem). Most impact: qualify better."
      }
    ],
    videoUrl: ""
  }
];

export default batch91Articles;
