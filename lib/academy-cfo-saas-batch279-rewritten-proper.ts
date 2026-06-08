import { AcademyArticle } from "@/types/academy";

export const batch279Articles: AcademyArticle[] = [
  {
    slug: "managing-through-crisis-and-downturn",
    title: "Managing Through Crisis and Downturn: Navigating Tough Times",
    description: "Master crisis management. Plan for downturns, make tough decisions, preserve value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["crisis", "downturn", "recession", "layoffs", "business resilience", "difficult decisions", "tough times"],
    keyTakeaways: [
      "Crisis indicators: Revenue declining (growth <0%), churn rising (>3%), cash flow negative (burn increasing), market contraction (customer budget cuts). Response time-critical: Every month matters (cash burn adds up). Decision: Stay course (short-term issue, will recover) vs pivot (fundamental problem, need change) vs layoff (reduce costs, extend runway). Framework: Understand severity (how bad, how long?), communicate (transparency builds trust), decide (options and tradeoffs), execute (move fast). Cost: If layoff, emotional toll + recruiting cost later. Benefit: Preserve company (alternative is closure).",
      "Layoff process (if necessary): Decide: How many cuts (25%, 50%, other?)? What functions? Impact: Remaining team does more (hire later if recover). Announce: CEO communicates transparently (why necessary, what next, how support those leaving). Humane: Severance (2 weeks per year employed typical), health insurance (COBRA), references. Morale: Remaining team stressed (might leave), communicate vision (path forward), celebrate wins (maintain culture). Cost: Severance, recruiting later. Timeline: Decision to execution 1-2 weeks (move fast, don't drag out).",
      "Path forward: Reduce burn (cut spending 30-50%, prioritize core business). Extend runway (raise prices, accelerate collection, defer hiring). Improve unit economics (focus on profitability over growth). Communicate: Tell board/investors early (surprises hurt trust), tell customers (transparency), tell employees (they'll figure it out). Timeline: Assume 12-18 month recovery (plan accordingly). Culture: Focus on survival (protect company), celebrate small wins (maintain morale), be honest (people respect truth more than spin)."
    ],
    content: [
      {
        heading: "Managing During Crisis and Downturns",
        body: `Navigating and surviving difficult times.

**Crisis indicators and response**

Warning signs:
| Indicator | Normal | Concerning | Severe |
|---|---|---|---|
| Revenue growth | 30-50% | 10-20% | Negative |
| Monthly churn | 1-2% | 2-3% | >3% |
| Cash burn | 30-40% of revenue | 50-60% of revenue | >70% of revenue |
| Runway | 18+ months | 12-18 months | <12 months |
| Customer wins | 10-20/month | 5-10/month | <5/month |

Response timeline:
- Week 1: Understand situation (is this temporary or structural?)
- Week 2: Model scenarios (what if continues 3 months? 6 months? 12 months?)
- Week 3: Decide response (stay course, pivot, layoff)
- Week 4: Communicate (board, employees, customers)

Decision framework:
| Scenario | Response |
|---|---|
| Temporary (market dip, customer budget cuts, seasonal) | Stay course + communicate (avoid overreacting) |
| Structural (product problem, market shift, competitive) | Pivot + communicate (change strategy) |
| Severe (runway <6 months, no recovery visible) | Layoff + pivot (reduce costs, extend runway) |

Example decision:
- Problem: Revenue growth 10% (down from 30%), churn 2% (up from 1%)
- Analysis: Customer budgets cut (temporary) vs product fit (structural)?
- Data: Half customers cite budget, half cite competitive
- Decision: Hypothesis temporary, pivot to address competitive (add feature)
- Plan: 3-month trial, if churn >3% next month, layoff

**Layoff execution (if necessary)**

Process:
1. Decide: Headcount reduction % (25-50% typical)
2. Prioritize: Which functions, which people?
   - Keep: Core business (sales, CS, product, engineering)
   - Cut: Non-core (marketing, admin, contractors)
   - Difficult: Mid-tier performers (don't cut best, don't cut worst)

3. Plan: Severance, logistics, communication
   - Severance: 2 weeks per year employed (minimum)
   - Health: COBRA continuation (people stay on insurance)
   - References: Agree to provide (support leaving employees)

4. Execute: Quick (don't drag out), humane (respect people)
   - Same day: Notify all impacted (don't let news leak first)
   - Immediate: Health insurance info, severance details
   - Next day: All-hands (transparency on why, what next)

5. Communicate:
   - Impacted employees: Individually, clear, compassionate
   - Remaining team: All-hands (why, what next, how support)
   - Customers: Proactive (reassure on service continuity)
   - Investors: Board meeting (transparency, new plan)

Cost:
- Severance: 50 people × 2 weeks per year avg × salary = £500K typical
- Recruiting later: If recover, rehire (cost and time)
- Productivity loss: Remaining team distracted (2-3 weeks to recover)
- Morale hit: Some people leave (announce immediately to stem)

**Surviving and recovering**

Burn reduction:
- Target: 30-50% reduction
- Actions: Cut marketing (highest variable), freeze hiring (headcount), negotiate vendor terms (extend payables), reduce discretionary spending

Extend runway:
- Price increases: 10% revenue increase (1-2 month runway gain)
- Collections: Accelerate customer payments (net 30 → net 15)
- Line of credit: If bankable, establish for emergency
- Fundraising: If possible, dilution worthwhile vs closure

Focus:
- Profitability > growth (unit economics matter now)
- Core business > new initiatives
- Customer retention > acquisition
- Cash > revenue (short-term survival)

Timeline assumptions:
- 3 months: Early recovery signs (market bottoming, churn stabilizing)
- 6 months: Growth returning (churn <2%, new customer wins picking up)
- 12 months: Back to normal (growth 20-30%, churn 1-2%)
- 18+ months: Recovered (runway restored, hiring resumed)

Culture during crisis:
- Transparency (communicate regularly, don't hide bad news)
- Small wins (celebrate what goes well)
- Purpose (remind why you exist, customer impact)
- Support (help people through stress, offer EAP)
- Honesty (people respect truth more than spin)

Example communication:
"We're facing headwinds (budget cuts, competition). We made the hard decision to reduce team by 20%. This is painful, but necessary to preserve company and build for long-term. We're confident in [product/market], and here's our 12-month plan to recovery."

`
      }
    ],
    relatedSlugs: ["risk-management-and-contingency-planning", "financial-planning-and-budgeting", "building-sustainable-company-culture-and-values"],
    faq: [
      { q: "How do I know if we're in crisis?", a: "Signs: Revenue growth declining (10% or negative), churn rising (>2-3%), cash burn accelerating, runway <12 months. Response: Understand if temporary (market dip) or structural (product/market fit issue). Decide: Stay course, pivot, or layoff (depends on severity and root cause)." },
      { q: "Should I do layoffs?", a: "If: Runway <6 months and recovery not clear. Steps: Decide % reduction, notify all same day (don't let leak), provide severance (2 weeks per year), communicate transparently (why, what next). Cost: Severance + recruiting later. Benefit: Extend runway, preserve company." },
      { q: "How do I recover from downturn?", a: "Focus: Profitability > growth, retention > acquisition, cash > revenue. Actions: Cut burn (marketing, hiring), extend runway (price, collections, line of credit), improve unit economics. Timeline: 3-6 months early signs, 12 months recovery, 18 months back to normal. Communicate: Transparency, small wins, purpose, support team." }
    ],
    videoUrl: ""
  }
];

export default batch279Articles;