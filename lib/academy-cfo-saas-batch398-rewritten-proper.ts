import { AcademyArticle } from "@/types/academy";

export const batch398Articles: AcademyArticle[] = [
  {
    slug: "saas-capital-allocation-and-investment-decisions",
    title: "Capital Allocation and Investment Decisions: Deploying SaaS Resources",
    description: "Master capital allocation. Make data-driven investment decisions, prioritise initiatives, and maximise ROI.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["capital allocation", "investment decisions", "ROI", "resource allocation", "priority framework"],
    keyTakeaways: [
      "Capital allocation framework: Every pound has an opportunity cost. Compare all investments on same basis: (1) Expected ROI (return per pound invested), (2) Payback period (months to recover investment), (3) Risk level (probability of achieving expected return), (4) Strategic alignment (does it advance core strategy?). Example: £100K to invest — Option A: Hire 2 SDRs (expected £300K ARR in 12 months, payback 8 months). Option B: New product feature (expected £150K ARR, payback 18 months). Option C: Marketing campaign (expected £200K ARR, payback 6 months). Rank by risk-adjusted ROI.",
      "Investment prioritisation matrix: Plot initiatives on 2x2: Impact (high/low) vs Effort (high/low). Quadrant 1 (high impact, low effort): Do first — quick wins. Quadrant 2 (high impact, high effort): Plan and commit — strategic bets. Quadrant 3 (low impact, low effort): Fill gaps — nice to have. Quadrant 4 (low impact, high effort): Don't do — distractions. Example: AI feature (Q2: high impact, high effort), pricing page redesign (Q1: high impact, low effort), office upgrade (Q4: low impact, high effort).",
      "Growth vs efficiency trade-off: At each stage, decide between investing for growth vs investing for efficiency. Rule of thumb: If LTV:CAC >3:1 and payback <18 months, invest in growth. If LTV:CAC <3:1 or payback >18 months, invest in efficiency first. Example: Company at 2:1 LTV:CAC with 22-month payback. Before adding more sales reps, improve conversion rates (cheaper) and reduce churn (increases LTV). Spending more on broken unit economics = burning cash faster."
    ],
    content: [
      {
        heading: "Making Strategic Capital Allocation Decisions in SaaS",
        body: `Deploying resources where they generate the highest risk-adjusted returns.

**Capital allocation fundamentals**

The opportunity cost principle:

Every pound invested in one area can't be invested elsewhere.

Example allocation decision:

Available capital: £500K for next quarter

| Initiative | Investment | Expected ARR | Payback | Risk | ROI |
|---|---|---|---|---|---|
| 3 new sales reps | £150K | £450K (18mo) | 10 months | Medium | 3.0x |
| Product feature X | £100K | £200K (12mo) | 12 months | High | 2.0x |
| Marketing campaign | £80K | £250K (12mo) | 8 months | Medium | 3.1x |
| CS investment | £50K | £150K saved | 8 months | Low | 3.0x |
| Engineering tools | £30K | £50K saved | 12 months | Low | 1.7x |
| International entry | £200K | £300K (24mo) | 24 months | High | 1.5x |

Prioritised allocation:

| Priority | Initiative | Investment | Rationale |
|---|---|---|---|
| 1 | Marketing campaign | £80K | Highest ROI, fastest payback |
| 2 | CS investment | £50K | Low risk, strong ROI, compounds |
| 3 | 2 sales reps (not 3) | £100K | Good ROI, manageable ramp |
| 4 | Engineering tools | £30K | Efficiency gain, low risk |
| 5 | Product feature X | £100K | High impact but higher risk |
| - | International entry | Defer | Too expensive with current cash |
| Total | | £360K | £140K reserve |

Always keep a reserve (10-20% of budget) for unexpected opportunities or risks

**Investment decision framework**

For each proposed investment, answer:

1. What is the expected return?
   - Revenue generated (new ARR)
   - Revenue protected (churn prevented)
   - Cost saved (efficiency gain)
   - Quantify in £ per year

2. What is the investment required?
   - One-time costs (build, buy, implement)
   - Ongoing costs (team, tools, infrastructure)
   - Total over relevant timeframe

3. What is the payback period?
   - Investment ÷ monthly net benefit
   - Target: <12 months (excellent), <18 months (good), <24 months (acceptable)

4. What is the risk?
   - Probability of achieving expected return
   - What could go wrong?
   - Downside scenario (minimum expected return)

5. What is the strategic value?
   - Does this advance core strategy?
   - Does this create a moat or competitive advantage?
   - Does this enable future investments?

Risk-adjusted ROI calculation:

Example: New product feature

Expected case (60% probability):
- Revenue: £300K ARR
- ROI: 3x

Downside case (30% probability):
- Revenue: £100K ARR
- ROI: 1x

Failure case (10% probability):
- Revenue: £0
- ROI: -1x (lose investment)

Expected ROI = (60% × 3x) + (30% × 1x) + (10% × -1x)
= 1.8 + 0.3 + (-0.1) = 2.0x risk-adjusted ROI

Compare this 2.0x to other initiatives' risk-adjusted ROI

**Growth vs efficiency allocation**

Stage-appropriate allocation:

| Stage | Growth allocation | Efficiency allocation | Focus |
|---|---|---|---|
| Pre-PMF | 80% | 20% | Find product-market fit |
| Post-PMF, pre-scale | 70% | 30% | Prove unit economics |
| Growth (Series A/B) | 60% | 40% | Scale what works |
| Efficiency (Series C+) | 40% | 60% | Optimise for profitability |
| Pre-IPO | 30% | 70% | Demonstrate operating leverage |

Growth investments:
- New sales reps
- Marketing campaigns
- New product features
- International expansion
- Channel partnerships

Efficiency investments:
- Automation and tooling
- Process optimisation
- Infrastructure improvements
- Team training
- Technical debt reduction

When to shift from growth to efficiency:

Signals to invest more in growth:
- LTV:CAC >3:1 (unit economics work)
- CAC payback <18 months
- NRR >100% (existing customers growing)
- Pipeline coverage >3x
- Strong product-market fit (NPS >40)

Signals to invest more in efficiency:
- LTV:CAC <3:1 (fix before scaling)
- CAC payback >18 months
- Gross margin declining
- Revenue per employee declining
- Churn increasing

Example: Growth company hitting efficiency wall

Current state:
- £5M ARR, growing 80% YoY
- LTV:CAC: 2.5:1 (below target)
- CAC payback: 20 months (too long)
- Gross margin: 72% (below benchmark)

Allocation recommendation:
- 40% to growth (maintain momentum)
- 60% to efficiency (fix unit economics)

Efficiency priorities:
1. Improve conversion rate (reduce CAC by 20%): £30K investment
2. Reduce churn (improve LTV by 15%): £50K investment
3. Cloud cost optimisation (improve gross margin): £20K investment
4. Automate onboarding (reduce cost to serve): £25K investment

Impact after 6 months:
- LTV:CAC: 2.5:1 → 3.5:1
- CAC payback: 20 → 14 months
- Gross margin: 72% → 78%

Now growth investment delivers better returns

**Department-level allocation**

Engineering allocation:

How to allocate engineering time:

| Category | Target % | Description |
|---|---|---|
| New features | 40-50% | Revenue-generating features |
| Platform/infrastructure | 15-25% | Scalability, reliability |
| Technical debt | 10-15% | Code quality, performance |
| Bug fixes | 5-10% | Customer-reported issues |
| Maintenance | 5-10% | Updates, security patches |

Track actual vs target quarterly:

| Category | Target | Q1 actual | Q2 actual | Trend |
|---|---|---|---|---|
| New features | 45% | 35% | 40% | Improving |
| Platform | 20% | 30% | 25% | Decreasing |
| Tech debt | 12% | 15% | 12% | On target |
| Bug fixes | 13% | 12% | 15% | Increasing |
| Maintenance | 10% | 8% | 8% | Below target |

Action: Bug fixes increasing suggests quality issue — investigate root cause

Sales & marketing allocation:

| Channel | Current spend | Current ROI | Recommended |
|---|---|---|---|
| Content/SEO | £10K/mo | 5x (long-term) | ↑ Increase |
| Paid search | £15K/mo | 2x | → Maintain |
| Events | £8K/mo | 1.5x | ↓ Reduce |
| Outbound | £20K/mo | 3x | → Maintain |
| Partnerships | £5K/mo | 4x | ↑ Increase |

Reallocation: Shift £5K from events to content + partnerships

**Making the business case**

Business case template:

1. Executive summary (1 paragraph)
   - What we want to do, why, and expected ROI

2. Problem statement
   - What problem this solves
   - Impact of not solving it

3. Proposed solution
   - What we'll build/buy/do
   - Timeline and milestones

4. Financial analysis
   - Investment required (one-time + ongoing)
   - Expected revenue/savings
   - Payback period
   - Risk-adjusted ROI
   - NPV calculation (for major investments)

5. Risk assessment
   - What could go wrong
   - Mitigation plans
   - Downside scenario

6. Alternatives considered
   - Option A (proposed)
   - Option B (alternative)
   - Option C (do nothing)
   - Why Option A is recommended

7. Decision requested
   - Approval to proceed
   - Budget allocation
   - Timeline

Example executive summary:

"Investing £80K in a targeted content marketing programme will generate an estimated £250K in new ARR within 12 months, based on our proven content-to-lead conversion rates. At a 3.1x ROI and 8-month payback, this is our highest-return available investment. The primary risk is content production capacity, mitigated by contracting two freelance writers. I recommend approval to proceed with a £80K budget allocation for Q2."

**Post-investment tracking**

Track every major investment against its business case:

| Initiative | Investment | Expected return | Actual return (6mo) | Status |
|---|---|---|---|---|
| Marketing campaign | £80K | £250K ARR | £120K ARR | On track |
| CS investment | £50K | £150K saved | £80K saved | On track |
| 2 sales reps | £100K | £300K ARR | £50K ARR | Below plan |
| Eng tools | £30K | £50K saved | £45K saved | On track |

Review quarterly:
- On track: Continue investment
- Below plan: Investigate and course-correct
- Above plan: Consider increasing investment
- Failed: Document learnings, reallocate resources

Build institutional memory:
- What investments worked?
- What didn't?
- Why?
- How to improve decision-making?

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "saas-budget-planning-and-variance-analysis", "profitability-analysis-and-operating-leverage", "saas-revenue-forecasting-models", "saas-scenario-planning-and-stress-testing"],
    faq: [
      { q: "How should I allocate capital across growth and efficiency?", a: "Stage-dependent. Pre-PMF: 80% growth, 20% efficiency. Growth stage (Series A/B): 60% growth, 40% efficiency. Pre-IPO: 30% growth, 70% efficiency. Key signal: If LTV:CAC >3:1 and payback <18 months, invest in growth. If LTV:CAC <3:1, fix efficiency first (scaling broken unit economics = burning cash faster). Always keep 10-20% reserve for unexpected opportunities." },
      { q: "How do I prioritise competing investment proposals?", a: "Score each on: (1) Expected ROI (return per pound invested), (2) Payback period (<12 months excellent), (3) Risk level (probability of success), (4) Strategic alignment. Calculate risk-adjusted ROI: Probability-weight each scenario. Plot on impact vs effort matrix. Do high-impact/low-effort first, plan high-impact/high-effort, skip low-impact/high-effort. Always compare to doing nothing." },
      { q: "How do I track ROI on investments?", a: "Track every major investment against its business case quarterly. Compare: Expected return vs actual return at 3, 6, 12 months. On track: Continue. Below plan: Investigate and adjust. Failed: Document learnings, reallocate. Build institutional memory of what works. Example: £80K marketing campaign expected £250K ARR. At 6 months: £120K ARR (on track to exceed). Continue investment." }
    ],
    videoUrl: ""
  }
];

export default batch398Articles;
