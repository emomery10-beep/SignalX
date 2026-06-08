import { AcademyArticle } from "@/types/academy";

export const batch238Articles: AcademyArticle[] = [
  {
    slug: "strategic-planning-and-quarterly-goal-setting",
    title: "Strategic Planning and Quarterly Goal Setting: Aligning Execution",
    description: "Master strategic planning. Set goals, execute quarterly, measure progress.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["strategic planning", "quarterly goals", "OKR", "goal setting", "execution", "quarterly planning", "strategy alignment"],
    keyTakeaways: [
      "Strategic planning cadence: Annual (set 3-year vision, 5-year direction). Quarterly (set Q goals, OKRs for team). Weekly (execution checks, blockers). Annual process: Sept-Nov (leadership + team plan next year). Draft: 3-5 company goals (growth, profitability, product, retention). OKRs: 3-5 per company, 3-5 per team (cascading). Review: Weekly standup (progress), monthly deep-dive (2-3 OKRs), quarterly business review (score OKRs, set next quarter). Success: 70-80% OKR completion (100% = too conservative, <60% = unrealistic goals or execution issues).",
      "Goal setting framework (OKR): Objective (what, 1-2 sentences qualitative). Key Results (how measure, 3-5 quantitative). Example: Obj 'Improve customer retention' → KR1: Reduce churn 1%, KR2: Improve NRR 10%, KR3: Build CS team to 5 people. Good goals: Ambitious (70% confidence), measurable, aligned with company strategy. Cascading: Company OKRs → team OKRs (sales OKR 'grow ARR' → AE OKR 'close £500K'). Avoid: Too many goals (>5 per level), misalignment (team goals don't ladder to company), vague metrics.",
      "Quarterly execution: Q goal finalization (late month before Q start), team alignment (each team knows goals), weekly tracking (progress status: green/yellow/red), blockers management (unblock at weekly standup), monthly deep-dive (2-3 OKRs deep analysis: on track? need help?). End of quarter: Score (% complete), retrospective (what worked, what didn't?), learn (apply to next quarter). Typical cadence: Jan-Mar (Q1), Apr-Jun (Q2), Jul-Sep (Q3), Oct-Dec (Q4). September crucial: Next year planning happens (set direction for following year)."
    ],
    content: [
      {
        heading: "Strategic Planning and Goal Setting",
        body: `Aligning company around clear goals.

**Annual planning process**

Timeline:
- August: Strategy discussion (leadership team)
- September: Set company goals + OKRs
- October: Teams draft OKRs (aligned to company)
- November: Finalize and communicate to company
- December: Prepare to execute

Annual goals (3-5):
- Growth: ARR target (e.g., £10M by Dec)
- Profitability: Operating margin (e.g., 15%)
- Product: Major releases (e.g., 3 new features)
- Retention: Churn reduction (e.g., <2% monthly)
- Culture: Team growth (e.g., 30-person team)

**OKR framework**

Structure:
- Objective: Qualitative goal (1-2 sentences)
- Key Results: 3-5 measurable outcomes (how track?)

Example OKRs:
| Objective | Key Results |
|---|---|
| Grow revenue to £10M | 1. Close 50 new enterprise customers (£500K/each) 2. Grow NRR to 130% (expand existing £2M) 3. Reduce churn to <1.5% (save £500K) |
| Improve product quality | 1. Reduce bugs by 50% (improve NPS 10 points) 2. Ship 4 major features 3. Improve onboarding completion to 90% |
| Build high-performing team | 1. Hire 10 people (achieve 30-person target) 2. Improve eNPS to 50 3. Reduce turnover to <5% |

Grading:
- 100%: Completed fully
- 70-99%: Mostly complete (good goal)
- 30-69%: Partial progress (learned something)
- 0-29%: Incomplete (goal too ambitious or execution issue)

Target: Average 70-80% completion (indicates good goal-setting)

**Quarterly execution rhythm**

Weekly (every Monday):
- Standup (5-10 min per team)
- Status: Green/yellow/red for each OKR
- Blockers: What's preventing progress?
- Action: Unblock immediately if possible

Monthly deep-dive:
- Pick 2-3 most important OKRs
- Deep analysis: On track? Need help? Any learnings?
- Time: 1 hour per OKR

End of quarter:
- Score: % complete for each OKR
- Retrospective: What went well? What didn't? Why?
- Learn: Apply to next quarter goals
- Celebrate: Recognize wins

**Goal cascading example**

Company goal: "Grow ARR to £10M"
| Level | Owner | Goal |
|---|---|---|
| Company | CEO | Grow ARR to £10M (£1.2M new) |
| Sales | VP Sales | Close £1M new ARR (50 customers × £20K ACV) |
| AE1 | AE1 | Close £200K (10 customers × £20K) |
| Marketing | VP Marketing | Generate £100M pipeline (5x conversion) |

Each level owns outcome, cascades down

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking", "decision-making-frameworks-and-data-analytics"],
    faq: [
      { q: "How many OKRs should I have?", a: "Company: 3-5 OKRs (focus). Team: 3-5 OKRs (aligned to company). Person: 1-3 OKRs (focus on key contributions). Too many: Unfocused, diluted effort. Too few: Missing priorities. Start: 3 company OKRs, cascade to 3-5 per team." },
      { q: "What's a good OKR completion rate?", a: "Target: 70-80% (indicates ambitious but realistic goals). Below 60%: Goals too ambitious (set lower targets). Above 90%: Goals too conservative (set higher targets). Track: Monthly (how progressing?), quarterly (score and learn)." },
      { q: "How do I align teams around OKRs?", a: "1. Set company OKRs (CEO + leadership). 2. Teams draft OKRs aligned to company (not independent). 3. Review for alignment (each team OKR supports company). 4. Weekly standup (track progress). 5. Monthly deep-dive (2-3 OKRs, help if blocked). 6. Quarterly score and retrospective (learn, improve)." }
    ],
    videoUrl: ""
  }
];

export default batch238Articles;