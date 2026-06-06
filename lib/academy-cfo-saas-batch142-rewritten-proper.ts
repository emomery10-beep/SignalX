import { AcademyArticle } from "@/types/academy";

export const batch142Articles: AcademyArticle[] = [
  {
    slug: "sales-pipeline-management-and-forecasting",
    title: "Sales Pipeline Management and Forecasting: Predictable Revenue Through Disciplined Selling",
    description: "Master sales pipeline management. Track opportunities, forecast revenue accurately, improve win rates, and build predictable growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "sales pipeline",
      "sales forecasting",
      "pipeline management",
      "win rate",
      "deal velocity",
      "sales cycle",
      "pipeline stages",
      "sales forecast",
      "deal probability",
      "opportunity tracking"
    ],
    keyTakeaways: [
      "Pipeline equation: Expected revenue = Sum(deal value × win probability × stage conversion). Example: 10 deals, £10K average, 50% win rate, 70% stage conversion = £35K expected. Vs forecast £50K (naive) reveals gap. Monitor pipeline health: >3x monthly target = healthy (enough opportunities). <2x = pipeline risk (not enough deals to hit targets).",
      "Sales cycle metrics: Average deal size (£X), sales cycle length (weeks), win rate (%). Example: £5K ACV, 8-week cycle, 30% win rate. Need (£50K MRR target / (£5K × 30%)) = 333 deals starting per month. With 8-week cycle = 666 active opportunities required. Calculate needed pipeline size based on target, cycle, win rate.",
      "Forecast accuracy: Company targets £100K MRR, rep pipeline £150K (weighted by probability). Actual closes £90K (10% miss). Improve by: (1) Better probability calibration (reps optimistic?), (2) Longer pipeline visibility (see issues earlier), (3) Deal discipline (weed out weak deals). Track forecast vs actual monthly, adjust model."
    ],
    content: [
      {
        heading: "Pipeline Structure and Stages",
        body: `Design a sales process that enables forecasting.

**Pipeline Stages (Standard Model)**

Stage 1: Prospecting / Lead (Probability: 0%)
- Definition: Leads identified but no outreach yet
- Activities: List building, lead scoring, initial targeting
- Duration: Varies, could be weeks
- Conversion: 5-10% to stage 2 (outreach response)
- Note: Not in forecast (0% probability)

Stage 2: Initial Contact / Interest (Probability: 5%)
- Definition: Contact made, initial conversation scheduled
- Activities: Cold email, call, meeting scheduled
- Duration: 1-2 weeks
- Conversion: 30-50% to stage 3
- Note: Low probability, rough indication

Stage 3: Qualification / Discovery (Probability: 15-20%)
- Definition: Customer need confirmed, basic fit established
- Activities: Discovery call, understanding use case, budget/timeline check
- Duration: 1-3 weeks
- Conversion: 40-60% to stage 4
- Key question: "Does customer have the problem we solve?"

Stage 4: Proposal / Evaluation (Probability: 40-50%)
- Definition: Detailed proposal sent, customer evaluating
- Activities: Demo, technical evaluation, ROI discussion
- Duration: 2-4 weeks
- Conversion: 50-70% to stage 5
- Key question: "Is our solution the best fit?"

Stage 5: Negotiation / Closing (Probability: 70-80%)
- Definition: Final negotiations, contract review, approaching signature
- Activities: Legal review, pricing negotiation, final stakeholder approval
- Duration: 1-3 weeks
- Conversion: 80-95% to close (should be high)
- Key question: "Are we going to win the deal?"

Stage 6: Closed Won (Probability: 100%)
- Definition: Contract signed, customer onboarded
- Activities: Setup, payment processing, implementation
- Duration: Ongoing (post-sales)

Closed Lost (Probability: 0%)
- Definition: Deal lost to competitor or customer decided against
- Reason: Reasons tracked (no budget, chose competitor, timing, etc.)
- Importance: Learn from losses, improve positioning

**Pipeline Example**

Sales rep: Sarah, Target: £50K MRR per month

| Stage | Deals | Avg Deal | Total | Probability | Expected |
|-------|-------|----------|-------|-------------|----------|
| Prospecting | 50 | £5K | £250K | 0% | £0 |
| Initial Contact | 15 | £5K | £75K | 5% | £3.75K |
| Discovery | 10 | £5K | £50K | 20% | £10K |
| Proposal | 8 | £5K | £40K | 50% | £20K |
| Negotiation | 5 | £5K | £25K | 75% | £18.75K |
| **Total Pipeline** | **88** | — | **£440K** | — | **£52.5K** |
| Target needed | — | — | — | — | **£50K** |
| Status | — | — | — | — | **✓ On track** |

Pipeline health: £440K total, £50K expected = 8.8x coverage ratio (healthy, >3x needed).

**Probability Assignment**

Conservative approach: Use stage-based probabilities
- Prospecting: 0%
- Initial Contact: 5%
- Discovery: 20%
- Proposal: 50%
- Negotiation: 75%
- Closed: 100%

Customized approach: Adjust by company/product
- Long sales cycle (enterprise): Higher probabilities in earlier stages (more time to convert)
- Short sales cycle (SMB): Lower probabilities in earlier stages (quick drop-off)

Example enterprise vs SMB:

Enterprise (12-week cycle):
- Discovery: 25% (customers can't drop out early, longer decision)
- Proposal: 55%
- Negotiation: 80%

SMB (4-week cycle):
- Discovery: 15% (quick nos)
- Proposal: 45%
- Negotiation: 70%

**Deal Health Indicators**

Red flags (weak deals, likely to stall/close low/loss):
- No identified champion (no internal sponsor)
- Budget not confirmed (financial approval unclear)
- Competition not discussed (hasn't evaluated alternatives)
- No next meeting scheduled (stalled)
- Delayed past expected timeline (slipping)

Green flags (strong deals, likely to close):
- Multiple stakeholders engaged
- Budget committed
- Decision timeline clear
- Regular contact (momentum)
- Champion actively advocating

Discipline: Reps remove red flags before deal advances to later stages. Move slow deals to lower probabilities or mark as "inactive".

**Pipeline Review Process**

Weekly pipeline review (rep + manager):
- Inspect new deals: Are they real? Correct stage?
- Review stage movements: Did deals progress? Why stalled?
- Identify risk deals: Any at risk of loss?
- Pipeline health: On track for monthly target?

Cadence:
- Weekly: Individual rep reviews with manager
- Bi-weekly: Team pipeline review (all reps)
- Monthly: Executive review (CEO, CFO, VP Sales)

**Cleaning the Pipeline**

Remove deals that are no longer viable:

Stalled rules:
- No contact in 3 weeks → move to stalled or close lost
- Past expected close date + no update → escalate for follow-up
- Lost to competitor → log and close lost

Disqualified:
- Customer no longer has budget
- Problem not urgent (deprioritized)
- Product isn't right fit (technical mismatch)
- Decision moved beyond timeline (lost opportunity)

Healthy pipeline: Clean, realistic, actively progressing.

`
      },
      {
        heading: "Sales Cycle Metrics and Velocity",
        body: `Understand what drives sales speed and predictability.

**Sales Cycle Analysis**

Average sales cycle: Time from first contact to close

Calculation:
- Avg time in stage 2: 2 weeks
- Avg time in stage 3: 2 weeks
- Avg time in stage 4: 3 weeks
- Avg time in stage 5: 2 weeks
- **Total average: 9 weeks** (2 months)

Importance: Longer cycle = longer to revenue visibility = need bigger pipeline.

Example impact:
- £50K target / £5K deal = 10 deals needed
- 9-week cycle, 30% win rate = need 10 / 30% = 33 deals progressing
- If month 1: 33 deals in pipeline
- Month 2: First batch closes (3-5 deals close)
- Month 3: Second batch closes (3-5 deals close)
- Full ramp: Month 4-5 (hitting £50K as deals flow)

New hire ramp: 4-5 months to full productivity (pipeline takes time to fill).

**Win Rate Analysis**

Overall win rate: Total closed won / Total closed deals

Example:
- Month: 10 deals closed won, 15 deals closed lost
- Win rate: 10 / (10 + 15) = 40%

Benchmark: 20-40% typical for SaaS
- SMB SaaS: 30-40% (less competition, faster sales)
- Enterprise SaaS: 20-30% (more competition, deliberate decision)

Win rate by stage:
- Negotiation → Closed: 85% (should be high)
- Proposal → Negotiation: 60% (good filtering)
- Discovery → Proposal: 50% (qualify here)
- Initial Contact → Discovery: 40% (qualification starts)

Poor metrics indicate:
- Early stage issues: Not qualifying properly → wasting time
- Late stage issues: Proposals not compelling → not differentiating
- Overall: Sales process is weak

**Deal Velocity Metrics**

Days in each stage (average):

| Stage | Avg Days | Variance | Issues |
|-------|----------|----------|--------|
| Discovery | 10 | ±3 | Good, consistent |
| Proposal | 18 | ±8 | Inconsistent, some drag |
| Negotiation | 12 | ±4 | Okay |
| **Average Cycle** | **40 days** | — | **Target: 35** |

Opportunities to accelerate:
- Proposal stage: 18 days avg, some taking 30+ days = standardize proposal template, faster turnaround
- Discovery stage: 10 days good, some less = rigor in discovery questions

If cycle can be reduced from 40 to 35 days:
- 5 days faster = ~12.5% faster
- Same team closes 12.5% more revenue
- Example: £50K/month target with 40-day cycle vs 35-day cycle = £56K/month (same headcount)

**Activity Metrics**

Track leading indicators of pipeline:

| Activity | Target | Conversion | Revenue Impact |
|----------|--------|------------|-----------------|
| Outreach (emails/calls) | 50/week | 10% → Stage 2 | 5 into initial contact |
| Meetings | 10/week | 40% → Stage 3 | 4 into discovery |
| Proposals sent | 2/week | 60% → Stage 4/5 | 1-2 into evaluation |
| Deals closed | 2/month | 40% win rate | £10K closed (at £5K ACV) |

Activity drives pipeline:
- More outreach → more meetings → more proposals → more closes
- Less activity → dry pipeline in 6-8 weeks

Activity rules:
- Minimum activity: 40-50 outreach/week per rep
- At least 2 proposals/week to maintain pipeline flow
- Review monthly: Is rep hitting activity targets?

**Forecasting with Velocity**

Use pipeline × velocity to forecast:

Current pipeline: 20 deals in "proposal" stage, £5K average = £100K

Historical: 60% of proposals move to negotiation this month
Expected to negotiate: 20 × 60% = 12 deals = £60K expected

Historical: 85% of negotiation deals close
Expected to close: 12 × 85% = 10 deals = £50K expected close

Forecast: £50K new MRR this month (from current pipeline)

Plus: New deals created this month flowing into pipeline.

This is more accurate than naive pipeline sum.

`
      },
      {
        heading: "Sales Forecasting and Accuracy",
        body: `Predict revenue with enough accuracy to manage the business.

**Simple Forecasting Model**

Formula: Expected revenue = Pipeline × Stage probability × Conversion rate

Example:

Discovery stage pipeline: £100K
- Stage probability: 20%
- Conversion (stage to close): 60%
- Expected: £100K × 20% × 60% = £12K

Proposal stage pipeline: £80K
- Stage probability: 50%
- Conversion: 70%
- Expected: £80K × 50% × 70% = £28K

Negotiation stage: £40K
- Stage probability: 75%
- Conversion: 85%
- Expected: £40K × 75% × 85% = £25.5K

**Total forecast: £65.5K** (expected revenue)

vs. Pipeline sum: £220K (if counted at 100%) — massive difference!

**Three Forecasts**

Communicate three scenarios:

Optimistic (best case):
- Assume all deals close, faster timeline
- Useful: Upside visibility
- Reality: 10% probability

Realistic (base case):
- Use historical win rates and timelines
- Adjusted for visibility (some deals certain, some risky)
- Reality: 60-70% probability (most likely outcome)

Pessimistic (downside):
- Assume some deals slip, lower conversion
- Account for macro headwinds
- Reality: 20% probability

Example:

| Scenario | Pipeline | Win Rate | Conversion | Forecast |
|----------|----------|----------|------------|----------|
| Optimistic | £300K | 45% | 95% | £128K |
| Realistic | £280K | 35% | 75% | £74K |
| Pessimistic | £250K | 25% | 60% | £38K |

Target: £75K
- Optimistic: 71% above target (unlikely)
- Realistic: 1% below target (on track)
- Pessimistic: 49% below target (miss)

Board communication: "We're likely to hit target (realistic scenario). Upside of £50K if deals accelerate. Downside of £35K if macro weakens."

**Improving Forecast Accuracy**

Measure: Actual closes vs forecast, by rep

Example:

| Rep | Forecast | Actual | Accuracy | Pattern |
|-----|----------|--------|----------|---------|
| Sarah | £50K | £48K | 96% | Accurate |
| Mike | £60K | £40K | 67% | Optimistic |
| Lisa | £40K | £42K | 105% | Conservative |
| **Team** | **£150K** | **£130K** | **87%** | — |

Observations:
- Sarah: Calibrated well, trust her forecast
- Mike: Optimistic (probabilities too high), coach on qualification
- Lisa: Conservative (may be sandbagging or underestimating), encourage more pipeline

Accuracy improvements:
- <80% accuracy: Rep probabilities miscalibrated, coach on deal assessment
- >90% accuracy: Rep well calibrated, use as benchmark
- Team accuracy >85%: Good forecast capability, can make decisions with confidence

**Using Forecast for Operations**

Revenue plan: £100K MRR month 5

Pipeline forecast shows realistic scenario: £75K expected
- Gap: £25K shortfall
- Action: (1) Increase pipeline (more outreach), (2) Improve conversion (better positioning), or (3) Reduce timeline (accelerate deals)

Option 1: Increase pipeline
- Need additional £25K expected = £25K / (35% win rate) = £71K additional pipeline
- With 8-week cycle, start now to close month 5

Option 2: Improve conversion
- Current: 35% win rate
- Need: 47% win rate to hit £100K (35% × 35% = 47%)
- Improvement: Better sales training, stronger positioning, product improvements

Option 3: Accelerate
- Current: 8-week cycle
- Compress to 6 weeks (faster evaluation, decision)
- Effect: Same team closes 25% faster = £94K (close to target)

Realistic plan: Combination of all three.

**Sandbagging and Optimism Bias**

Risk 1: Reps sandbagging (under-forecasting to exceed targets)
- Impact: Management makes conservative decisions, misses opportunity
- Mitigation: Use historical accuracy, incentivize transparency

Risk 2: Reps overly optimistic (over-forecasting to look good)
- Impact: Miss targets, erode trust, wrong decisions
- Mitigation: Deal scrutiny, probability audits, separate forecast vs commit

Approach:
- Rep forecast (what they think will close, includes optimism bias)
- Manager-adjusted forecast (manager scrutinizes deals, adjusts probabilities)
- Board forecast (even more conservative, only deals in negotiation counted high)

Example:

Rep forecast: £100K (reps include optimistic deals)
Manager adjustment: £75K (removes optimistic deals, adjusts probabilities)
Board forecast: £60K (only near-certain deals counted high)

Reality: £65K (manager forecast was quite close, board conservative)

`
      },
      {
        heading: "Sales Compensation and Incentive Alignment",
        body: `Align incentives so reps pursue right behavior.

**Quota and Commission Structure**

Quota (target):
- Individual quota: £50K MRR per rep per month
- Ramp: New hire £30K month 1-3, ramp to £50K by month 6
- Seasonal: Adjust for company seasonality

Commission:
- Standard: 5-10% of new MRR (capped or uncapped)
- Example: Close £50K MRR = £2.5K-5K commission (at 5-10%)

Accelerators:
- Over quota: Bonus for exceeding (e.g., 15% for >120% of quota)
- Team bonus: Shared bonus for team hitting target (aligns collaboration)

**Behavior Alignment**

Commission on MRR drives right incentives:
- Reps pursue recurring revenue (subscriptions), not one-time
- Reps expand customers (NRR improves)
- Reps retain customers (commission claws back if customer churns in first year)

Wrong incentives:
- Commission on deals closed (reps cherry-pick easy deals, ignore expansion)
- Flat bonuses (reps hit minimum and coast)

**Activity Metrics and Compensation**

Tie bonuses to activity quality:
- 80% commission on revenue closed
- 20% bonus on metrics:
  - Pipeline coverage (maintain >3x coverage ratio)
  - Forecast accuracy (within 10% actual vs forecast)
  - Customer satisfaction (NPS score, CS feedback)

Example:
- £50K closed × 80% = £40K commission (performance bonus)
- Bonus metrics hit = 20% additional = £10K
- Total: £50K compensation potential (salary + variable)

Drives behavior: High revenue + healthy pipeline + accurate forecasting.

**Quota Setting**

Bottom-up: Build from team
- 5 reps × £50K quota each = £250K target for month

Top-down: What can market support?
- TAM £10M, penetration 5%, typical deal £5K = £500K addressable MRR
- Realistic capture: 20% = £100K MRR total → divide by reps

Balanced approach:
- Market supports £100K/month
- 5 reps → £20K average quota
- Top performers: £30K, new reps: £10K (ramping)
- Team total: 3×£30K + 2×£5K = £100K

Review quarterly:
- Quota too high: Reps consistently miss, morale drops
- Quota too low: Reps hit easily, no stretch, wasted potential

Target: 60-70% of reps hitting quota (challenging but achievable).

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "sales-compensation-and-commission-structures",
      "customer-success-metrics-and-program-design"
    ],
    faq: [
      {
        q: "What's a healthy sales pipeline and how much should I have?",
        a: "Rule: Pipeline should be 3-4x monthly target. Example: £50K target = £150-200K pipeline. More specifically: 4x coverage ratio = 2 months visibility (if win rate stable, 50% of current pipeline closes in next 2 months). <3x = pipeline risk (not enough deals). >5x = either optimistic reps or weak selling."
      },
      {
        q: "How do I forecast sales revenue accurately?",
        a: "Use weighted pipeline: Sum(deal size × stage probability × historical conversion). Example: £100K discovery pipeline × 20% prob × 60% conversion = £12K expected. Build three scenarios (optimistic, realistic, pessimistic). Compare forecast to actuals monthly, adjust probabilities. Target: Forecast within 10% of actual (good accuracy)."
      },
      {
        q: "What sales metrics should I track?",
        a: "Core 5: (1) Pipeline size (coverage ratio >3x), (2) Win rate (target 30-40%), (3) Average deal size (consistency indicator), (4) Sales cycle (time to close), (5) Activity (outreach, meetings, proposals). Track monthly by rep and team. Trends matter: Is pipeline growing? Win rate improving? Cycle compressing?"
      },
      {
        q: "How should I set sales quotas?",
        a: "Build from market: Calculate TAM, realistic penetration (5-10%), typical deal size. Divide by number of reps. Example: £10M TAM × 5% penetration × 20% deal close = £100K target / 5 reps = £20K quota each. Adjust for experience (ramp new hires 50-80% of quota). Review quarterly. Target: 60-70% of reps hitting quota."
      }
    ],
    videoUrl: ""
  }
];

export default batch142Articles;
