import { AcademyArticle } from "@/types/academy";

export const batch62Articles: AcademyArticle[] = [
  {
    slug: "scenario-planning-financial-stress-testing",
    title: "Scenario Planning and Financial Stress Testing: Preparing for Uncertainty",
    description: "Build financial models with scenarios (best case, base case, worst case). Stress test assumptions and plan for market downturns.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "scenario planning",
      "stress testing",
      "financial scenarios",
      "worst case",
      "best case",
      "financial modeling",
      "risk planning",
      "contingency planning",
      "sensitivity analysis",
      "financial forecasting"
    ],
    keyTakeaways: [
      "Three scenarios: Best case (70% customers renew, 20% expand = 120% NRR), Base case (85% renewal, 10% expand = 108% NRR), Worst case (75% renewal, 5% expand = 96% NRR); for each scenario, model: revenue, COGS, OpEx, cash burn, runway; planning against base case alone is naive",
      "Stress test assumptions: What if growth drops 50%? What if 30% of customers churn? What if CAC increases 25%? Build model so you can flex key variables (growth, churn, CAC, pricing) and see impact on runway/profitability; identify break-even points (if growth <X%, we're unprofitable)",
      "Use scenarios for decision-making: In base case we hit profitability in Q4. But if worst case, we run out of runway in Q2. Decision: Raise capital in Q1 (not Q3). Scenarios force proactive planning, not reactive scrambling when crisis hits"
    ],
    content: [
      {
        heading: "Three-Scenario Financial Model",
        body: `Build financial models with three scenarios: Best case, Base case, Worst case.

This forces you to think about downside risk and plan accordingly.

**Scenario Definitions**

Base case: Most likely outcome
- Assumptions: Based on current trajectory, market conditions
- Growth: 30% YoY
- Churn: 2% monthly (24% annually)
- Expansion: 12% of renewing customers expand 8%
- NRR: 108%
- CAC: £8K, LTV: £80K, payback: 12 months

Best case: Optimistic outcome
- Better execution, market tailwinds
- Growth: 50% YoY (or 60%)
- Churn: 1% monthly (12% annually)
- Expansion: 20% of renewing customers expand 12%
- NRR: 115%
- CAC: £6K (better efficiency), LTV: £100K, payback: 10 months

Worst case: Pessimistic outcome
- Execution issues, market headwinds, recession
- Growth: 10% YoY (or -10%)
- Churn: 4% monthly (40% annually)
- Expansion: 5% of renewing customers expand 5%
- NRR: 95%
- CAC: £12K (harder to sell), LTV: £60K, payback: 18 months

**Building the Model (12-month projection)**

For each scenario, project:

| Month | Revenue | Churn | Expansion | NRR % | CAC spend | Payroll | OpEx | Cash out | Cash balance | Runway |
|-------|---------|-------|----------|-------|-----------|---------|------|----------|------------|--------|
| Jan (Base) | £300K | £6K | £3K | 108% | £50K | £150K | £70K | £270K | £2.73M | 10.1 months |
| Feb | £324K | £6.5K | £3.5K | 108% | £52K | £150K | £72K | £274K | £2.46M | 9.0 months |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| Dec | £450K | £9K | £5K | 108% | £70K | £180K | £100K | £350K | £2.8M | 8.0 months |

Compare across scenarios:

| Scenario | End-of-year revenue | Monthly burn (avg) | Runway (month 12) | Profitability timeline |
|----------|----------|----------|----------|----------|
| Best case | £500K | £200K/month | 12 months | Q2 next year |
| Base case | £450K | £280K/month | 8 months | Q4 next year |
| Worst case | £330K | £350K/month | 6 months | Never (cash runs out) |

Insight: Base case is tight (8 months runway). Worst case is crisis (6 months). Decision: Raise capital at 6-month mark (month 6) even if base case looks OK. Worst case forces earlier fundraising.

**Sensitivity Analysis (Key variable changes)**

Identify 5-10 key variables that affect runway/profitability:

1. Growth rate (50% reduction in growth)
   - Base: 30% growth
   - Stress: 15% growth (50% reduction)
   - Impact on revenue: £450K → £380K
   - Impact on runway: 8 months → 7 months (1 month loss)

2. Churn rate (double churn)
   - Base: 2% monthly
   - Stress: 4% monthly
   - Impact: NRR drops from 108% to 96%, revenue growth turns negative
   - Impact on runway: 8 months → crisis (runway shrinks each month)

3. CAC (increase 25%)
   - Base: £8K
   - Stress: £10K
   - Impact: CAC payback increases from 12 to 15 months
   - Impact on runway: £50K monthly CAC spend → £62.5K, burn increases £12.5K/month

4. Gross margin (decrease 10%)
   - Base: 70%
   - Stress: 60%
   - Impact: Gross profit per customer drops
   - Impact on runway: Monthly margin dollars decrease 14% (from £210K to £180K)

5. ACV/pricing (decrease 10%)
   - Base: £50K ACV
   - Stress: £45K ACV
   - Impact: Revenue drops 10%
   - Impact on runway: £450K → £405K revenue, runway tightens

**Visualizing Scenarios**

Build charts for leadership:

Chart 1: Revenue trajectory (three lines)
- Best case: Growing 50% YoY, hits £500K by Dec
- Base case: Growing 30% YoY, hits £450K by Dec
- Worst case: Growing 10% YoY, hits £330K by Dec

Chart 2: Runway trajectory (three lines)
- Best case: Runway improving (15 months by Dec)
- Base case: Runway stable (8-10 months throughout)
- Worst case: Runway shrinking (6 months, getting tighter)

Chart 3: Break-even point
- Best case: Breakeven month 8
- Base case: Breakeven month 12 (if achievable)
- Worst case: Never breakeven (cash runs out)

These charts make scenarios visceral: CEO can see base case gets tight, worst case is crisis.

**Scenario Planning for Decisions**

Use scenarios to make proactive decisions:

Decision 1: Should we hire aggressively?
- Base case: Runway 8 months, growing 30%, can afford 3 new hires
- Worst case: Runway 6 months, growing 10%, can only afford 1 hire
- Decision: Hire 2 people, hedge between cases

Decision 2: When should we raise capital?
- Base case: Reach profitability Q4, don't need to raise
- Worst case: Run out cash month 6, must raise by month 4
- Decision: Start conversations month 3, aim to close by month 4 (buffer for worst case)

Decision 3: Should we expand to new market/product?
- Base case: Expansion costs £100K, payoff in 12 months
- Worst case: Expansion costs same, payoff delayed to 18 months, burns cash we don't have
- Decision: Wait 6 months for worst case risk to clarify

**Stress Test Triggers**

Identify "if-then" statements for stress responses:

If growth drops below 20% (vs. base 30%):
→ Then we cut marketing spend 20%, hire freeze

If churn exceeds 3% monthly:
→ Then we pause expansion, focus on retention

If CAC exceeds £10K:
→ Then we reduce targets, increase average deal size

If runway drops below 9 months:
→ Then we start fundraising conversations

If gross margin drops below 65%:
→ Then we re-negotiate vendor contracts, optimize infrastructure

Having predetermined triggers prevents emotional decisions ("Let's wait and see") and enforces discipline.

**Recession Planning**

Worst-case scenario in recession:

Revenue impact:
- Enterprise customers cut budgets → Churn 5% monthly, expansion 0%
- SMB customers cut budgets → Churn 6% monthly
- Overall: NRR drops to 88% (negative)
- Revenue shrinks 10-20% (not grows)

Cost structure:
- Can you reduce burn? Hiring freeze, contractor cuts
- Most companies cut 20-30% costs to survive downturn
- Pivot: Which products/customers are still growing? Focus there

Playbook for recession:
- Month 1 of downturn signals: Prepare for worst case
- Month 2: Implement cost reduction (£50K/month savings)
- Month 3: Reassess, if recovery happening, invest again
- If no recovery by month 6: More aggressive cuts

Example: £5M ARR company in recession
- Revenue impact: -15% = £4.25M ARR
- Cost reduction: £300K/month → £240K/month
- New runway: More cash preserved, extends runway 6+ months
- Survival strategy: Cut, conserve, wait for recovery

**Model Transparency**

Share scenarios with:
- Board: Quarterly in board deck (highlight base case, note worst case risk)
- Leadership team: Monthly updated model (sensitivity to changes)
- Investors: When fundraising (show you've stress tested)

But NOT:
- Worst case with customers or team (demoralizing, panic)
- Over-detailed assumptions (just numbers, not rationale)

Summary in board deck:
"Our base case projects profitability Q4 with £450K revenue. Our worst-case (recession, churn 4%, growth 10%) shows £6M runway at current burn, sufficient to navigate downturn. We're monitoring growth, churn, and CAC weekly to identify if we're trending toward base or worst case."

Scenario planning isn't doom-saying, it's prudent risk management. Most successful founders have run these models and know their downside. It separates panicked decisions from thoughtful strategy.
`
      }
    ],
    relatedSlugs: [
      "financial-modeling-for-saas",
      "burn-rate-management-cash-preservation",
      "cash-flow-management-for-saas",
      "forecasting-accuracy-planning",
      "profitability-targets-by-company-stage"
    ],
    faq: [
      {
        q: "What assumptions should I stress test?",
        a: "Growth rate, churn rate, CAC, pricing, gross margin, CAC payback. These 6 drive most variance in runway and profitability."
      },
      {
        q: "How pessimistic should worst case be?",
        a: "Reasonable downside (not catastrophic). If growth is 30% base, worst case is 10% (not -20%). Worst case should be survivable with cost cuts."
      },
      {
        q: "How often should I update scenarios?",
        a: "Monthly (as new data arrives). If actual results differ materially from scenarios, recalibrate assumptions."
      },
      {
        q: "Should I share worst case with investors?",
        a: "Yes, briefly. Shows you've thought about risk. \"Our base case reaches profitability. Our worst case (recession) extends runway 9 months, manageable.\""
      }
    ],
    videoUrl: ""
  }
];

export default batch62Articles;
