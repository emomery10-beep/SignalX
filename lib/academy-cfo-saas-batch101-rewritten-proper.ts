import { AcademyArticle } from "@/types/academy";

export const batch101Articles: AcademyArticle[] = [
  {
    slug: "scenario-planning-sensitivity-analysis",
    title: "Scenario Planning and Sensitivity Analysis: Modeling Different Futures",
    description: "Master scenario planning and sensitivity analysis. Model best/base/worst case outcomes and understand which assumptions matter most.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "scenario planning",
      "sensitivity analysis",
      "financial modeling",
      "what-if analysis",
      "assumption testing",
      "forecast scenarios",
      "risk modeling",
      "base case",
      "upside case",
      "downside case"
    ],
    keyTakeaways: [
      "Scenario planning: Build three forecasts (base/conservative/upside); base case = most likely outcome (80% confidence); conservative = downside risk (20% probability, 20% lower growth, higher churn); upside = opportunity case (10% probability, faster adoption, lower CAC); helps board/investors understand range of outcomes, not just one forecast",
      "Sensitivity analysis: Test how forecast changes when you vary one assumption; example: what if CAC increases 20%? What if churn increases 1%? What if pricing increases 15%? Rank by impact (CAC, growth rate, payback most sensitive); use tornado diagram to visualize which assumptions matter most; focus planning/management on high-sensitivity drivers",
      "Key assumptions to stress-test: Growth rate (churn +/−1%, new logo acquisition ±20%, expansion ±20%), Unit economics (CAC ±20%, payback ±2 months), Pricing (increase ±15%), Market size (TAM ±30%); model 2-3 year horizon, monthly detail first year then quarterly; sensitivity helps identify risks and opportunities to manage"
    ],
    content: [
      {
        heading: "Building Scenario Models",
        body: `Scenario planning creates multiple forecasts to show range of possible outcomes.

**Three-Scenario Framework**

Conservative (20% probability, downside risk):
- Lower growth (60% of base case growth)
- Higher churn (current + 1%)
- Higher CAC (current × 1.2)
- Result: Slower expansion, more cash burn

Base Case (60% probability, most likely):
- Expected growth (based on current trajectory)
- Current churn trends
- Current CAC and payback
- Result: What you expect to achieve

Upside Case (20% probability, opportunity):
- Faster growth (140% of base case)
- Lower churn (current − 1%)
- Lower CAC (current × 0.8)
- Result: Accelerated expansion, strong profitability

**Example Scenario Model**

SaaS company, 3-year forecast:

BASE CASE (Most likely):

Year 1:
- Starting ARR: £5M
- Growth rate: 40% (from current pipeline, sales efficiency)
- Ending ARR: £7M

Year 2:
- Starting ARR: £7M
- Growth rate: 35% (market maturation, larger base)
- Ending ARR: £9.45M

Year 3:
- Starting ARR: £9.45M
- Growth rate: 25% (even larger base, market saturation)
- Ending ARR: £11.8M

Unit Economics (Base):
- CAC: £8K (current)
- Payback: 9 months (current)
- Churn: 3% monthly (current)

Profitability (Base):
- Year 1: -20% operating margin (investment phase)
- Year 2: -5% operating margin (approaching breakeven)
- Year 3: +10% operating margin (profitable)

CONSERVATIVE CASE (Downside risk):

Year 1:
- Starting ARR: £5M
- Growth rate: 24% (60% of base 40%, slower adoption)
- Ending ARR: £6.2M

Year 2:
- Starting ARR: £6.2M
- Growth rate: 21% (60% of base 35%)
- Ending ARR: £7.5M

Year 3:
- Starting ARR: £7.5M
- Growth rate: 15% (60% of base 25%)
- Ending ARR: £8.6M

Unit Economics (Conservative):
- CAC: £9.6K (+20% higher, harder to acquire customers)
- Payback: 11 months (+2 months, slower)
- Churn: 4% monthly (+1%, customer retention issues)

Profitability (Conservative):
- Year 1: -40% operating margin (slower growth, higher costs)
- Year 2: -30% operating margin (still in investment mode)
- Year 3: -10% operating margin (struggles to profitability)

UPSIDE CASE (Opportunity):

Year 1:
- Starting ARR: £5M
- Growth rate: 56% (140% of base 40%, strong adoption)
- Ending ARR: £7.8M

Year 2:
- Starting ARR: £7.8M
- Growth rate: 49% (140% of base 35%)
- Ending ARR: £11.6M

Year 3:
- Starting ARR: £11.6M
- Growth rate: 35% (140% of base 25%, market expands)
- Ending ARR: £15.7M

Unit Economics (Upside):
- CAC: £6.4K (20% lower, efficient customer acquisition)
- Payback: 7 months (2 months faster)
- Churn: 2% monthly (1% lower, strong product-market fit)

Profitability (Upside):
- Year 1: 0% operating margin (growth investments, but profitable)
- Year 2: +20% operating margin (clear path to profitability)
- Year 3: +35% operating margin (highly profitable, scale)

**Why Three Scenarios Matter**

Board decision-making:

Conservative case answers: "What's our downside if things don't go as planned?"
- Helps determine cash runway, fundraising need
- Shows risks to manage

Base case answers: "What should we plan for?"
- Guides hiring, spending decisions
- Aligns team on targets

Upside case answers: "What's our opportunity if execution is exceptional?"
- Motivates team with potential
- Shows path to significant exit value

Example impact on fundraising decision:

Conservative case: ARR £8.6M by year 3, operating margin -10%
- Conclusion: Need additional funding, not clear path to profitability

Base case: ARR £11.8M by year 3, operating margin +10%
- Conclusion: Can be profitable with current capital, minimal additional raise needed

Upside case: ARR £15.7M by year 3, operating margin +35%
- Conclusion: Strong opportunity, can fundraise at premium to show board investors upside

The board uses all three to make capital decisions.

**Sensitivity Analysis**

Sensitivity analysis tests how sensitive your forecast is to changes in key assumptions.

Example: Base case forecast shows £11.8M ARR year 3.

Key assumptions:
- Growth rate 40% → 35% → 25%
- CAC £8K
- Churn 3%
- Payback 9 months

Test each assumption:

Growth Rate Sensitivity:
- If growth 40% (base) → Year 3 ARR: £11.8M
- If growth 35% (−5%) → Year 3 ARR: £10.4M (−12%)
- If growth 45% (+5%) → Year 3 ARR: £13.5M (+14%)

Impact: 1% growth change = ~2% ARR impact (moderate sensitivity)

CAC Sensitivity:
- If CAC £8K (base) → Year 3 ARR: £11.8M (payback 9 months)
- If CAC £9.6K (+20%) → Year 3 ARR: £9.2M (payback 11 months, more expensive to acquire)
- If CAC £6.4K (−20%) → Year 3 ARR: £14.2M (payback 7 months, efficient acquisition)

Impact: 20% CAC change = ~20% ARR impact (high sensitivity, very important)

Churn Sensitivity:
- If churn 3% (base) → Year 3 ARR: £11.8M
- If churn 4% (+1%) → Year 3 ARR: £9.1M (−23%)
- If churn 2% (−1%) → Year 3 ARR: £15.2M (+29%)

Impact: 1% churn change = ~25% ARR impact (very high sensitivity, critical)

Payback Sensitivity:
- If payback 9 months (base) → Year 3 cash position healthy
- If payback 12 months (+3) → Cash consumed faster, runway concern
- If payback 6 months (−3) → Cash generated faster, funding not needed

Impact: Payback affects cash runway significantly

Pricing Sensitivity:
- If increase price 15% → ARPU increases, revenue higher, same customers
- If decrease price 15% → Grow faster, lower ASP but more volume

Impact: Depends on price elasticity (how demand changes with price)

**Tornado Diagram (Sensitivity Visualization)**

A tornado diagram shows which assumptions matter most:

Example (ranked by sensitivity impact):

Assumption | Impact on Year 3 ARR
− Churn (±1%) | ±£2.7M (23%)
− CAC (±20%) | ±£2.4M (20%)
− Growth rate (±5%) | ±£1.7M (14%)
− Payback (±3 months) | ±£1.2M (10%, indirect via cash)
− Pricing (±15%) | ±£1M (8%)

Visualization:
                ← Downside | Base | Upside →
Churn        [←←←←←]┃[→→→→→]
CAC          [←←←←]┃[→→→→]
Growth rate  [←←←]┃[→→→]
Payback      [←←]┃[→→]
Pricing      [←]┃[→]

The wider the bar, the more sensitive the outcome is to that assumption.

Action: Focus management attention on wide-bar items (churn, CAC, growth).

**Using Sensitivity for Decision-Making**

Example: Decision on pricing strategy

Current pricing: £5K/month

Option A: Increase to £5.75K/month (+15%)
- ARPU increases 15%
- Assume demand decreases 10% (some customers don't upgrade)
- Net revenue impact: +15% − 10% = +5%

Option B: Decrease to £4.25K/month (−15%)
- ARPU decreases 15%
- Assume demand increases 30% (more customers sign up)
- Net revenue impact: −15% + 30% = +15%

Option B has higher revenue impact (15% vs 5%), so lower price is better if demand elastic (price-sensitive).

But need to model:
- Does lower CAC in Option B (more volume, better acquisition efficiency)?
- Does higher churn in Option B (lower-value customers)?
- What's the customer lifetime value in each case?

Sensitivity analysis reveals these trade-offs.

**Three-Year Financial Projection Template**

Base case model (monthly year 1, quarterly year 2-3):

Revenue:
- New logos: [# customers] × [ASP]
- Expansion revenue: [existing customers] × [ARPU increase]
- Churn impact: [lost ARR from churn]
- Total revenue

Operating expenses:
- COGS (scales with revenue)
- S&M (acquisition, customer success)
- R&D (product development)
- G&A (overhead)
- Total opex

Profitability:
- Gross margin
- Operating margin
- Cash runway (if not profitable)

Key metrics:
- ARR
- Customer count
- NRR
- CAC
- Payback

Then build conservative and upside cases with 60%/140% adjustments.

**Updating Scenarios Quarterly**

Don't build scenarios once and forget them. Update quarterly:

Q1 actual results:
- Actual growth: 38% (vs. base 40%, close)
- Actual CAC: £8.2K (vs. base £8K, slightly higher)
- Actual churn: 2.8% (vs. base 3%, better)

Update three scenarios with new actual data points:

Base case: Was 40% growth, now revise to 38% (based on Q1 actual trend)
Conservative: Was 24% growth, now revise to 23% (tracking actual)
Upside: Was 56% growth, now revise to 53% (still ambitious but adjusted)

This rolling update keeps scenarios grounded in reality while maintaining forward-looking planning.

**Board Presentation of Scenarios**

Don't just present base case. Show all three:

Slide: "Three-Year Scenarios"

| Metric | Conservative | Base | Upside |
|--------|-------------|------|--------|
| Year 3 ARR | £8.6M | £11.8M | £15.7M |
| Year 3 Growth | 15% | 25% | 35% |
| Year 3 Op Margin | -10% | +10% | +35% |
| Year 3 Customers | 400 | 550 | 750 |
| Probability | 20% | 60% | 20% |

Narrative:

"Our base case assumes 40% year 1 growth moderating to 25% by year 3, reaching £11.8M ARR. We believe this is 60% likely given current trajectory.

Conservative case (20% probability) assumes slower growth (24-40% lower) and higher churn, reaching £8.6M ARR and operating margin of -10%. This is our downside if market adoption slower than expected.

Upside case (20% probability) assumes faster growth (140% of base) and improved unit economics, reaching £15.7M ARR and +35% operating margin. This is possible if we achieve exceptional product-market fit and scale efficiently.

We're planning for base case but have mitigation strategies for conservative outcome (cost controls) and execution plans for upside opportunity (hiring, marketing investment)."

Scenarios show you've thought through risks and opportunities, not just blindly forecast one number.
`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "profitability-mechanics",
      "p-l-statement-architecture-profitability",
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-deep-dive"
    ],
    faq: [
      {
        q: "What probability should I assign to each scenario?",
        a: "Base case 60% (most likely), upside 20% (opportunity), conservative 20% (downside risk). Adjust based on your confidence in execution."
      },
      {
        q: "Which assumptions are most important to test?",
        a: "Growth rate, churn, and CAC are typically most sensitive. Use tornado diagram to identify your specific top 3 drivers and focus there."
      },
      {
        q: "How often should I update scenarios?",
        a: "Quarterly. Compare actual results to forecast, adjust assumptions, rebuild all three scenarios. This keeps planning grounded in reality."
      },
      {
        q: "What's the difference between scenario and sensitivity analysis?",
        a: "Scenario: Creates complete 3-case models with multiple assumptions changed. Sensitivity: Tests one assumption at a time to see impact."
      }
    ],
    videoUrl: ""
  }
];

export default batch101Articles;
