import { AcademyArticle } from "@/types/academy";

export const batch239Articles: AcademyArticle[] = [
  {
    slug: "decision-making-frameworks-and-data-analytics",
    title: "Decision-Making Frameworks and Data Analytics: Data-Driven Leadership",
    description: "Master decision frameworks. Use data, analyze tradeoffs, make confident decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["decision making", "frameworks", "data analytics", "analytics", "decision framework", "data-driven", "quantitative analysis", "decision process"],
    keyTakeaways: [
      "Decision frameworks: RAPID (Recommend, Agree, Perform, Input, Decide) defines who makes decisions (clarity prevents confusion). For high-impact decisions (>£100K impact): CFO/CEO + team input. Medium (£10K-100K): Team lead decides with feedback. Small (<£10K): Team decides. Example: Hire engineer (£150K total cost). CFO recommends (budget check), engineering lead agrees (need), CEO decides (final approval). Process: Gather data (options, tradeoffs), present to decision-maker with recommendation (not just data dump). Decision: Clear owner, clear deadline. Action: Execute quickly (momentum). Review: Track outcome vs hypothesis (learning).",
      "Quantitative analysis: Option A vs B framework. Option A (hire enterprise sales): Cost £200K/year (2 AEs), expected ROI £500K new ARR (2.5x), timeline 6 months, risk 30% (could miss sales). Option B (improve product): Cost £100K (dev sprint), expected ROI £200K new ARR via improved retention (2x), timeline 3 months, risk 10%. Decision: Option B better (lower cost, lower risk, faster). Avoid: Gut feel. Require: Quantified impact, cost, timeline, risk. Present: Option A, Option B, Option C (do nothing), recommend which. Let decision-maker choose.",
      "Data analytics best practices: Quality data (single source of truth, validated), automation (daily refresh, no manual), dashboards (visual, interactive, drill-down), storytelling (headline first, 'ARR grew 40%', then detail). Review cadence: Daily (pulse check), weekly (team dashboard), monthly (financial deep-dive, variance analysis), quarterly (strategic review, 3-month lookahead). Avoid: Data hoarding (share openly), analysis paralysis (good data beats perfect), data democracy (any employee can access, interpret, learn)."
    ],
    content: [
      {
        heading: "Decision-Making and Analytics Framework",
        body: `Using data to make confident decisions.

**Decision frameworks**

RAPID decision model:
- Recommend: Who brings recommendation (usually domain expert)
- Agree: Who signs off (usually manager)
- Perform: Who executes (usually owner)
- Input: Who provides input (advisors, stakeholders)
- Decide: Who makes final call (usually leader)

Example (hire vs build):
| Role | RAPID |
|---|---|
| Engineering Lead | Recommend (need assessment) |
| VP Engineering | Agree |
| Finance | Input (budget, cost analysis) |
| CEO | Decide (strategy trade-off) |
| Sales Lead | Input (impact on roadmap) |

Clarity: Before meeting, assign roles. Decision timeline: By Friday EOD.

High-impact decisions (>£100K):
- Quantify: Cost, expected benefit, timeline, risk
- Present: 3 options + recommendation
- Decision-maker: Chooses option, owns outcome

Medium-impact (£10K-100K):
- Team lead recommends with brief analysis
- Manager approves
- Execute

Low-impact (<£10K):
- Team decides
- Inform manager

**Quantitative comparison framework**

Option evaluation:
| Criterion | Option A | Option B | Winner |
|---|---|---|---|
| Cost | £200K/year | £100K/year | B (1/2 cost) |
| Expected benefit | £500K ARR | £200K ARR | A (2.5x) |
| Benefit/Cost ratio | 2.5x | 2x | A (better ratio) |
| Timeline | 6 months | 3 months | B (faster) |
| Risk | 30% | 10% | B (lower risk) |
| **Recommendation** | Enterprise sales | Product improvement | **B** (lower risk, faster) |

Recommendation: Option B (better risk/reward, faster payback)

**Data analytics discipline**

Daily:
- Pulse metrics: ARR growth, customer count, top issues
- Owner: CFO / Finance (5 min check-in)

Weekly:
- Team dashboards: Sales pipeline, marketing leads, CS churn
- Owner: Team leads (30 min review)
- Action: Unblock obstacles

Monthly:
- Detailed review: P&L, variance analysis, unit economics
- Owner: CFO + leadership (2 hours)
- Output: Monthly board update

Quarterly:
- Strategic review: Progress vs plan, market changes, strategy adjustment
- Owner: Leadership + team (4 hours)
- Output: Next quarter plan

Best practices:
1. Single source of truth (data warehouse)
2. Automated refresh (daily, no manual)
3. Clear ownership (who maintains each metric?)
4. Storytelling (headline first, then details)
5. Drill-down (dashboard interactive, dive deeper)
6. Access (share data openly, democratize)

Data visualization:
- Tables: Comparisons
- Line charts: Trends over time
- Bar charts: Distribution
- Funnels: Drop-off analysis
- Heat maps: Patterns

Avoid:
- Too many metrics (focus on 10-15 key)
- Stale data (update daily minimum)
- Manual updates (brittleness, errors)
- Analysis paralysis (good data beats perfect)

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "strategic-planning-and-quarterly-goal-setting", "advanced-analytics-and-data-visualization"],
    faq: [
      { q: "How do I make better decisions?", a: "1. Define decision type (high/medium/low impact). 2. Quantify options (cost, benefit, timeline, risk). 3. Present: 3 options + recommendation. 4. Clarify RAPID (who decides). 5. Decide by deadline. 6. Execute quickly. 7. Track outcome vs hypothesis (learn). Avoid gut feel (require data)." },
      { q: "What data should I track?", a: "Daily: ARR, customers, churn. Weekly: Pipeline, marketing leads, CS issues. Monthly: P&L, unit economics, variance to plan. Quarterly: Strategy progress, market changes. Total: 7-15 key metrics (avoid too many). Automate: Daily refresh, single source of truth." },
      { q: "How do I avoid analysis paralysis?", a: "1. Set decision deadline (by Friday). 2. Use available data (good data beats perfect). 3. Quantify 3 options (don't compare infinite choices). 4. Recommend (don't just present). 5. Decide and commit (momentum). 6. Review outcome (learn and improve). Time boxed: Don't spend more than 20% of project time on analysis." }
    ],
    videoUrl: ""
  }
];

export default batch239Articles;