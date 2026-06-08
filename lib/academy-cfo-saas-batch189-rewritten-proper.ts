import { AcademyArticle } from "@/types/academy";

export const batch189Articles: AcademyArticle[] = [
  {
    slug: "scenario-planning-and-sensitivity-analysis",
    title: "Scenario Planning and Sensitivity Analysis: Model Risk and Uncertainty",
    description: "Master forecasting under uncertainty. Build scenarios, test assumptions, and prepare for outcomes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "scenario planning",
      "sensitivity analysis",
      "financial forecast",
      "risk modeling",
      "best case",
      "worst case",
      "assumptions testing",
      "probability weighting",
      "variance analysis",
      "downside planning"
    ],
    keyTakeaways: [
      "Three scenarios: Base case (most likely), Upside (20%+ growth), Downside (miss by 20%). Example: Base case £10M revenue (40% growth), Upside £12M (50% growth), Downside £8M (30% growth). Model: Show path to profitability in each. Upside = extra hires, M&A. Downside = cost cuts, reduced hiring. Board loves seeing all three (shows planning for reality).",
      "Sensitivity analysis: Which variable most impacts profit? Example: Change churn 2% → 2.5% = impact -£500K profit. Change CAC £1K → £1.2K = impact -£200K profit. Churn is more sensitive (5x impact). Focus on: High sensitivity variables (churn, pricing power, sales ramp). Lower sensitivity (minor cost changes) don't matter much.",
      "Assumption testing: 'What if' questions. Example: What if CAC takes 2 months longer to payback? What if 50% of customers don't renew (vs 2% assumed)? What if we lose top 10 customers? Build: Stress test model against these. Downside case = worst realistic scenario (not Armageddon), should still reach profitability by year 3."
    ],
    content: [
      {
        heading: "Scenario Planning Framework",
        body: `Building multiple financial outcomes.

**Three-Scenario Model**

Base Case (Most Likely, 50% probability):
- Revenue grows 40% YoY
- Churn stays 2% (stable)
- CAC payback 12 months
- Reach profitability year 3
- Example: Year 1 £5M → Year 2 £7M → Year 3 £10M (operating profit 15%)

Upside Case (Optimistic, 20% probability):
- Revenue grows 60% YoY (vs 40% base)
- Churn improves to 1.5%
- CAC payback 10 months (better)
- Reach profitability year 2.5
- Example: Year 1 £5M → Year 2 £8M → Year 3 £12.8M (operating profit 25%)
- Driver: New market expansion, product innovation, enterprise success

Downside Case (Pessimistic, 30% probability):
- Revenue grows 20% YoY (vs 40% base)
- Churn worsens to 2.5%
- CAC payback 15 months
- Reach profitability year 4
- Example: Year 1 £5M → Year 2 £6M → Year 3 £7.2M (operating profit 5%, profit year 4)
- Driver: Market slowdown, competitive pressure, product issues

Probability weighting:
- Weighted revenue: (50% × Base) + (20% × Upside) + (30% × Downside)
- Example Year 2: (50% × £7M) + (20% × £8M) + (30% × £6M) = £3.5M + £1.6M + £1.8M = £6.9M expected

**Variance Drivers in Each Scenario**

Base case assumptions:
- CAC £1K per customer
- Lifetime value £10K (50-month payback of gross margin)
- Customer count growth 40% YoY
- Operating margin target: 5% (year 3)

Upside case changes:
- CAC £900 (sales efficiency improves) → -10%
- LTV £12K (pricing power, higher margins) → +20%
- Growth 60% YoY (market expansion) → +50%
- Operating margin 25% (leverage)

Downside case changes:
- CAC £1.2K (harder to acquire) → +20%
- LTV £8K (lower pricing, higher churn) → -20%
- Growth 20% YoY (slow market) → -50%
- Operating margin 5% (no leverage, still spending heavily)

**Example Scenario Model (£5M current ARR)**

| Metric | Downside | Base | Upside |
|--------|----------|------|--------|
| Year 1 revenue | £6.0M | £7.0M | £8.0M |
| Year 2 revenue | £7.2M | £9.8M | £12.8M |
| Year 3 revenue | £8.6M | £13.7M | £20.5M |
| Year 1 gross margin % | 75% | 75% | 76% |
| Year 3 gross margin % | 72% | 78% | 80% |
| Year 1 OpEx | £6.5M | £6.5M | £6.8M |
| Year 3 OpEx | £7.8M | £8.2M | £10.0M |
| Year 1 operating profit | -£0.5M | +£0.05M | +£0.25M |
| Year 3 operating profit | +£0.3M | +£2.5M | +£6.1M |
| Path to profitability | Year 4 | Year 2.5 | Year 1.5 |

Insight: Even downside reaches profitability by year 4, which is acceptable for Series B company.

**When to Use Scenarios**

Board presentations:
- Show three cases (board expects this)
- Emphasize base case as most likely
- Use upside/downside to show risk management

Fundraising:
- Upside: "If we execute well, £20M revenue by year 3"
- Base: "We're confident in £13.7M"
- Downside: "Even conservatively, £8.6M and profitable"

Decision-making:
- Deciding to hire: "In downside, can we still afford this?"
- Pricing decision: "How sensitive is profit to 10% price increase?"
- M&A decision: "Does this help downside case? Upside?"

`
      },
      {
        heading: "Sensitivity Analysis",
        body: `Testing which assumptions matter most.

**One-Variable Sensitivity**

Test: What if this variable changes 10-20%?

Example (Base case Year 3: £10M revenue, £1.5M operating profit):

Churn (2% → 2.5%):
- Fewer retained customers
- Year 3 revenue: £10M → £8.5M (-15%)
- Operating profit: £1.5M → £0.7M (-53% impact!)
- Conclusion: Churn is HIGHLY sensitive

CAC (£1K → £1.2K):
- More expensive customer acquisition
- Less money for OpEx
- Year 3 revenue: £10M (unchanged), but OpEx increases £200K
- Operating profit: £1.5M → £1.3M (-13% impact)
- Conclusion: Moderate sensitivity

Gross margin (75% → 73%):
- Lower unit economics
- Year 3 gross profit: £7.5M → £7.3M (-2.7%)
- Operating profit: £1.5M → £1.3M (-13% impact)
- Conclusion: Moderate sensitivity

Sales efficiency (time to close 90 days → 120 days):
- Slower revenue realization
- Year 3 revenue: £10M → £9.5M (-5%)
- Operating profit: £1.5M → £1.3M (-13% impact)
- Conclusion: Lower sensitivity (still close to target)

**Multi-Variable Sensitivity (The Table)**

Create a table: "What if CAC changed AND churn changed?"

| CAC / Churn | 1.5% | 2.0% | 2.5% |
|-------------|------|------|------|
| £800 | £2.0M | £1.8M | £1.5M |
| £1000 | £1.8M | £1.5M | £1.2M |
| £1200 | £1.6M | £1.3M | £1.0M |

Red (worse), yellow (okay), green (good).

Use: "We can handle CAC going to £1.2K, but MUST keep churn below 2.5%"

**Tornado Diagram**

Visual: Shows sensitivity ranking.

1. Churn: -£800K if worse, +£800K if better (HIGHEST impact)
2. CAC: -£300K if worse, +£300K if better
3. Pricing: -£200K if worse, +£200K if better
4. OpEx: -£150K if worse, +£150K if better
5. Sales ramp: -£100K if worse, +£100K if better

Chart looks like tornado (widest at top = most sensitive).

Use: Focus strategy on reducing churn risk (highest sensitivity).

**Stress Testing**

"What's the worst realistic scenario?"

Stress test example:
- Assume: Top 3 customers leave (30% of revenue lost)
- Assume: Churn rises 3% (worst case)
- Assume: CAC goes up 50% (market gets competitive)
- Result: Revenue drops 40%, reach profitability year 5 (vs year 2.5)

But: Allows planning. What would you do?
- Cut costs 20%? (Reduce team growth)
- Raise prices 15%? (Keep margins up)
- Focus on retention? (Reduce churn to 2%)

Build a "stress case" that shows what you'd do if things went bad.

`
      },
      {
        heading: "Building and Maintaining Scenario Models",
        body: `Creating and updating models over time.

**Model Setup in Excel**

Structure:
- Input sheet: All assumptions (CAC, churn, growth rates, headcount costs)
- Calculation sheet: Formulas pulling from inputs
- Output sheet: Results (revenue, profit, key metrics) by scenario
- Charts: Visual comparisons (base vs upside vs downside)

Inputs (by scenario):
- Revenue growth rate (annual %)
- Churn rate (monthly %)
- Customer acquisition cost (£)
- Average revenue per user / customer (£)
- Operating expenses (by department)
- Headcount plan (by role)

Calculations:
- Month 1: Customers × ARPU × Retention = Revenue
- Month 2: (Month 1 customers + new customers - churned) × ARPU = Revenue
- COGS: Revenue × (1 - gross margin %)
- OpEx: (Salaries + tools + facilities)
- Operating profit: Revenue - COGS - OpEx

Output:
- Three columns: Downside, Base, Upside
- Show: Revenue, GM$, OpEx, Operating profit, Runway (months), key metrics

**Updating and Refreshing**

Quarterly:
- Update actuals (compare to forecast)
- Adjust assumptions if variance >10%
- Rerun scenarios
- Communicate: "In Q2 churn improved to 1.8%, so downside case now shows profitability year 3.5 (vs year 4)"

Annual:
- Full model rewrite (new fiscal year)
- Incorporate learnings from past year
- Extend forecast 3 years out (rolling 3-year)

Common updates:
- Churn improved: Downside case improves (more customers retained)
- CAC increased: All cases worsen (harder to grow profitably)
- Pricing raised: Upside case improves (higher ARPU)
- New market entered: Upside case improves (new growth driver)

**Communicating Scenarios to Leadership**

Investors/Board:
- Lead with Base case (this is what we believe)
- "Upside: If market expands faster, we could hit £20M"
- "Downside: Even if we miss growth targets, we're profitable by year 4"
- Show sensitivities: "Churn is our biggest risk" (helps board understand strategy)

Team:
- Share base case + upside (motivating)
- Use to cascade goals: "If we hit base case, we need 50 new customers/month"
- Don't share downside (demoralizing), but reference in planning: "Contingency: If we miss by 20%, we cut hiring in Q4"

Recruitment:
- Reference upside in pitches: "If we execute, £30M revenue in 3 years"
- Mention growth trajectory (attracts good people)

**Red Flags in Scenarios**

Warning sign: Downside case shows bankruptcy (negative runway)
- Action: Adjust model or business plan (cut costs, raise prices, extend runway via capital)
- Example: Downside shows £2M cash burn, only £5M cash raised = runway 2.5 years (tight)
- Better: Raise $10M to give 5-year runway (reduces stress, allows more experiments)

Warning sign: All three cases require doubling headcount next year (unrealistic)
- Action: More conservative headcount plan in model
- Reality: Usually harder to hire than planned

Warning sign: Upside case still doesn't hit profitability (business fundamentally broken)
- Action: Rethink business model (maybe SaaS not right, need more margin, different market)

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "burn-rate-and-cash-runway-analysis",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "p-l-statement-architecture-profitability"
    ],
    faq: [
      {
        q: "What are the three scenarios I should model?",
        a: "Base case (most likely, 50% prob): 40% growth, 2% churn, profitability year 3. Upside (optimistic, 20%): 60% growth, 1.5% churn, profitable year 2.5. Downside (pessimistic, 30%): 20% growth, 2.5% churn, profitable year 4. Even downside should reach profitability (or business is broken). Example Year 3: Base £10M, Upside £12.8M, Downside £8.6M."
      },
      {
        q: "How do I do sensitivity analysis?",
        a: "Test: What if variable changes 10-20%? Example: Churn 2% → 2.5% = -£500K profit (SENSITIVE). CAC £1K → £1.2K = -£100K profit (less sensitive). Create tornado chart ranking by impact. Focus strategy on high-sensitivity variables (churn, pricing, CAC). Also test multi-variable tables: 'What if CAC AND churn both worsen?'"
      },
      {
        q: "Should I share downside case with investors?",
        a: "Yes. Investors expect three scenarios (shows mature planning). Lead with base case, reference upside for opportunity, mention downside for risk-awareness. Example: 'Conservative scenario, we still reach profitability by year 4.' Shows you're realistic, not naive. Investors trust leaders who plan for multiple outcomes."
      },
      {
        q: "How often should I update scenarios?",
        a: "Quarterly: Update actuals, adjust assumptions if variance >10%, rerun. Communicate changes. Annual: Full model rewrite for new fiscal year. Rolling: Always maintain 3-year forward forecast. Example: Q2 actuals show better churn (1.8% vs 2% assumed) → Downside case improves → Communicate to team and board."
      }
    ],
    videoUrl: ""
  }
];

export default batch189Articles;
