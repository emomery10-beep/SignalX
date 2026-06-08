import { AcademyArticle } from "@/types/academy";

export const batch182Articles: AcademyArticle[] = [
  {
    slug: "sales-pipeline-management-and-forecasting",
    title: "Sales Pipeline Management and Forecasting: Predicting Revenue with Confidence",
    description: "Master sales pipeline. Build accurate forecasts, manage deals, and predict revenue with confidence.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "sales pipeline",
      "sales forecasting",
      "deal pipeline",
      "sales stages",
      "win rate",
      "sales cycle",
      "pipeline management",
      "forecast accuracy",
      "sales metrics",
      "revenue prediction"
    ],
    keyTakeaways: [
      "Pipeline structure: Prospects → Leads → Qualified → Proposal → Negotiation → Closed Won. Track deals at each stage with $ amount. Example: 50 prospects → 20 leads → 10 qualified → 5 proposals → 2 negotiating → 1 closed = 2% conversion. Pipeline health: Need 5-10x revenue target in pipeline (if target £100K/month, need £500K-1M in pipeline). Quarterly: Review pipeline, add new leads if depleting.",
      "Forecasting: Use historical win rates. Example: 20% conversion rate from qualified to closed = if £500K qualified, expect £100K closed (5-month cycle). Conservative forecast: Only count deals 50%+ likely (in proposal stage or later). Aggressive: Count all qualified. Report both (best/worst case) to leadership.",
      "Sales cycle: Time from first contact to close. Example: 3-month cycle typical for SMB SaaS, 6-12 months for enterprise. Longer cycle = harder to forecast (many variables), need larger pipeline. Monitor: If cycle extending, investigate (product demos taking longer? decision-making slower?). Shorten: Better sales process, faster demos, executive champion = close faster."
    ],
    content: [
      {
        heading: "Building a Sales Pipeline",
        body: `Creating a framework for managing deals.

**Pipeline Stages**

Stage 1: Prospect
- Raw lead (from marketing, outbound, referral)
- Unknown qualification
- Action: Do they fit ICP?
- Example: 100 prospects identified

Stage 2: Qualified Lead
- Confirmed fit (problem, budget, timeline)
- Action: Schedule demo
- Example: 30 qualified leads (30% conversion)

Stage 3: Demo/Evaluation
- Product demo scheduled/completed
- Action: Interest or not?
- Example: 15 in evaluation (50% of qualified)

Stage 4: Proposal
- Official proposal sent
- Action: Waiting for response
- Example: 10 proposals sent (67% of evaluation)

Stage 5: Negotiation
- Deal in discussion (price, terms, scope)
- Action: Close objections
- Example: 3 in negotiation (30% of proposals)

Stage 6: Closed Won
- Deal signed
- Action: Onboard customer
- Example: 1-2 deals closed per month (30-50% of negotiation)

**Pipeline Value**

Track dollar amount at each stage:

| Stage | Deals | Avg Deal | Total Value |
|-------|-------|----------|------------|
| Prospect | 100 | £1K | £100K |
| Qualified | 30 | £2K | £60K |
| Demo | 15 | £3K | £45K |
| Proposal | 10 | £4K | £40K |
| Negotiation | 3 | £5K | £15K |
| Closed | 1 | £5K | £5K |

Pipeline: £305K total value (in various stages)

Win rate: 1 closed / 30 qualified = 3.3%

**Pipeline Sizing**

Rule: Need 5-10x revenue target in pipeline.

Example:
- Monthly revenue target: £100K
- Needed pipeline: £500K-1M
- Current pipeline: £305K (below target!)
- Action: Need more lead generation

If pipeline £1M:
- 3.3% win rate (from above)
- Expected revenue: £33K (too low)
- Improve: Increase win rate to 10% (better sales process) or increase pipeline to £3M

`
      },
      {
        heading: "Sales Forecasting",
        body: `Predicting revenue outcomes.

**Forecast Methods**

Method 1: Historical Conversion
- Track win rates by stage
- Qualified → Closed: 30% historical
- If 10 qualified, expect 3 closed

Example:
- 10 proposals (67% expected close rate): 6-7 expected closes
- 3 negotiating (50% expected close): 1-2 expected closes
- Forecast next 30 days: 7-9 deals

Method 2: Sales Rep Forecast
- Ask each rep: What will you close?
- Pros: Include risk factors, rep confidence
- Cons: Often optimistic (reps overestimate)
- Better: Rep forecast + adjustment factor (80% of stated)

Example:
- Rep says £200K closing next month
- Adjustment (80%): £160K actual forecast

Method 3: Conservative vs Aggressive
- Conservative: Only count 50%+ probability deals
- Aggressive: Count all proposals
- Report both to board

Example:
- Conservative forecast: £80K (only sure deals)
- Aggressive forecast: £150K (all opportunities)
- Expected: £100K (middle)

**Forecast Accuracy**

Track actual vs forecast monthly:

| Month | Forecast | Actual | Variance |
|-------|----------|--------|----------|
| Jan | £100K | £95K | -5% |
| Feb | £110K | £100K | -9% |
| Mar | £120K | £115K | -4% |

Insight: Forecasts consistently low by 5-10%. Adjust next forecast +7%.

Targets:
- Accuracy within 10%: Good
- Within 5%: Excellent
- Within 15%: Acceptable

**Quarterly Forecast**

Rolling 3-month forecast (updated weekly):

Week 1:
- Month 1: £100K (committed, 90% confidence)
- Month 2: £80K (probable, 60% confidence)
- Month 3: £50K (possible, 30% confidence)
- Quarterly total: £230K

Week 4:
- Month 1: £105K (actuals come in)
- Month 2: £90K (new deals added)
- Month 3: £70K (pipeline built)
- Quarterly total: £265K (updated forecast)

`
      },
      {
        heading: "Sales Cycle and Pipeline Health",
        body: `Managing deal velocity and predictability.

**Sales Cycle Length**

Time from first contact to close.

Typical:
- SMB (self-serve + sales): 1-3 months
- Mid-market (sales + demos): 3-6 months
- Enterprise (complex, executive buy-in): 6-12 months

Longer cycle challenges:
- Harder to forecast (more dropoff risk)
- Slower revenue realization
- Requires larger pipeline

Shorter cycle advantages:
- Predictable (can forecast easier)
- Faster revenue realization
- Smaller pipeline needed

Optimizing:
- Sales training (faster closes)
- Product demos (show value quickly)
- Executive sponsor (bypass internal delays)
- Clear pricing (faster negotiations)

Tracking:
- Measure: Days from first contact to close (average)
- If extending: Investigate (deals stalling?)
- If shortening: Celebrate (process improving)

**Pipeline Health Metrics**

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Pipeline size | £500K | £305K | Low |
| Avg deal size | £5K | £4.2K | Low |
| Win rate | 10% | 3.3% | Low |
| Sales cycle | 90 days | 120 days | Long |
| Qualified leads | 30/mo | 20/mo | Low |

Overall: Pipeline unhealthy (too small, win rate low, cycle long).

Actions:
- Increase lead generation (30 → 50 qualified/month)
- Improve sales process (win rate 3% → 7%)
- Shorten cycle (120 days → 90 days)

Result: Pipeline improves from £305K → £600K (healthier).

`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-ltv-cac-payback",
      "pricing-strategy-and-price-optimization",
      "competitive-analysis-and-market-positioning",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What should my sales pipeline look like?",
        a: "Need 5-10x revenue target in pipeline. Example: Target £100K/month = £500K-1M pipeline. Track deals by stage: Prospects → Qualified → Demo → Proposal → Negotiation → Closed. Measure: Conversion rates at each stage (30% qualified → closed is good). Pipeline shrinking = warning sign (add more leads)."
      },
      {
        q: "How do I forecast accurately?",
        a: "Use historical conversion rates by stage. Example: 30% close rate from proposal = 10 proposals expected close rate 3. Compare: Historical forecast vs rep forecast (reps often optimistic). Conservative: Count only 50%+ probability deals. Aggressive: Count all opportunities. Report range (£80K-150K) rather than exact number."
      },
      {
        q: "What's a typical sales cycle?",
        a: "SMB: 1-3 months. Mid-market: 3-6 months. Enterprise: 6-12 months. Longer cycles = harder to forecast (more risk). Shorten by: Better sales process, faster demos, executive champion. Monitor: If extending, investigate (product issue? slower decisions?). Short = predictable."
      },
      {
        q: "How do I know if my pipeline is healthy?",
        a: "Healthy: 5-10x revenue target in pipeline. Deals flowing through stages steadily (20-30% conversion qualified → closed). Sales cycle stable (not extending). Forecast accurate (within 10%). Unhealthy: Pipeline shrinking, win rate declining, cycle extending = action needed (lead gen, sales training, process improvement)."
      }
    ],
    videoUrl: ""
  }
];

export default batch182Articles;
