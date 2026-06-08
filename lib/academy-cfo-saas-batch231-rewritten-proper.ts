import { AcademyArticle } from "@/types/academy";

export const batch231Articles: AcademyArticle[] = [
  {
    slug: "financial-planning-and-budgeting",
    title: "Financial Planning and Budgeting: Building Predictable Growth",
    description: "Master financial planning. Build budgets, forecast financials, manage to plan.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["budgeting", "financial planning", "forecasting", "budget variance", "planning process", "headcount planning", "spending plan"],
    keyTakeaways: [
      "Annual budget process: Build bottom-up (sales forecast from pipeline/conversion, marketing cost from CAC/acquisition targets, engineering from headcount + infrastructure). Top-down (investors/board expectation: growth 50% YoY, path to profitability). Reconcile: If bottom-up misses target, optimize (lower CAC, reduce headcount growth, prioritize). Build: Monthly detail (Q1 detailed, Q2-4 directional), quarterly reviews (adjust if market changes). Timeline: Build budget Oct/Nov for next year (allow 6-8 weeks), present Dec, execute Jan. Cost: Finance team, tools (Anaplan, Adaptive Insights). Benefit: Alignment (everyone knows targets), accountability (track vs plan), agility (replan quarterly).",
      "Budget categories: Revenue (forecast by product, segment, geography), COGS (infrastructure, payment processing), operating expenses (salaries, marketing, admin). SaaS typical: 40% COGS, 20% R&D, 20% S&M, 10% G&A, 10% other. Monitor: Monthly variance (actual vs plan, % difference). Investigate if >10% variance. Adjust: Reforecast Q+2/Q+3 quarterly (market feedback). Avoid: Rigid budgets (miss growth opportunities, cut necessary spend). Aim: Rolling 4-quarter forecast (always 4 quarters out).",
      "Headcount planning: Largest budget item (typically 40-60% of spending). Map: Roles needed, growth trajectory, ramp time (new hire takes 3 months productive). Example: Sales team grow 50% (4 to 6 AEs). Cost: £200K base + £50K ramp costs (training, productivity loss) per AE = £300K per new hire. Build: Quarterly headcount plan (who, when, cost). Bonus/equity plan (annual 10-15% salary). Avoid: Hiring 20 people at once (management overhead, culture risk). Pace: New person per 2-3 people existing (sustainable growth)."
    ],
    content: [
      {
        heading: "Building a Financial Plan",
        body: `Creating a predictable financial roadmap.

**Annual budgeting process**

Timeline:
- August-September: Gather inputs (sales forecast, product roadmap, hiring plans)
- September-October: Build budget (reconcile top-down vs bottom-up)
- November: Present to board/investors
- December: Finalize and approve
- January: Execute and monitor

Structure:
| Category | Process | Owner |
|---|---|---|
| Revenue forecast | Pipeline analysis + historical conversion | VP Sales |
| COGS | Infrastructure scaling, payment fees | VP Eng + Finance |
| Marketing | CAC × acquisition targets × channel mix | VP Marketing |
| Sales | Headcount + variable comp | VP Sales |
| Engineering | Headcount + tools + infrastructure | VP Eng |
| G&A | Admin, finance, legal, insurance | CFO |

**Budget allocation by stage**

Early stage (£0-1M ARR):
- Product: 40% (engineering, design)
- Sales: 30% (founding sales, initial AE)
- Marketing: 15% (content, trial setup)
- Admin: 15% (operations, finance, legal)

Growth stage (£1-10M):
- Product: 30% (engineering, grow team)
- Sales: 35% (grow AE, account managers)
- Marketing: 20% (demand gen, ABM)
- Admin: 15% (systems, finance, compliance)

Scaling stage (>£10M):
- Product: 25% (engineering, design, data)
- Sales: 40% (ramp AE, expand territories)
- Marketing: 20% (brand, events, ABM)
- Admin: 15% (finance, legal, compliance)

**Variance tracking and reforecasting**

Monthly tracking:
- Actual vs plan by category
- % variance (target <10%)
- Root cause (forecast wrong, spending overrun, opportunity)

| Category | Plan | Actual | Variance | Reason |
|---|---|---|---|---|
| Revenue | £150K | £145K | -3% | Slower sales cycle |
| Headcount | £300K | £310K | +3% | New hire started early |
| Marketing | £50K | £65K | +30% | Campaign overspend |

Quarterly reforecasting:
- Review actuals (what happened)
- Adjust Q+2 and beyond (market feedback, new info)
- Don't reforecast Q1 (too late, execute plan)

`
      }
    ],
    relatedSlugs: ["cash-flow-management-and-working-capital", "metrics-dashboard-design-kpi-tracking", "strategic-planning-and-quarterly-goal-setting"],
    faq: [
      { q: "What percentage of budget should I allocate to each department?", a: "Early stage (£0-1M): 40% product, 30% sales, 15% marketing, 15% admin. Growth (£1-10M): 30% product, 35% sales, 20% marketing, 15% admin. Scaling (>£10M): 25% product, 40% sales, 20% marketing, 15% admin. Adjust based on growth strategy and market." },
      { q: "How often should I reforecast?", a: "Build: Annual (Oct-Nov for next year). Monitor: Monthly (track vs plan). Reforecast: Quarterly (adjust Q+2 and beyond based on market). Don't reforecast current quarter (too late to adjust). Rolling 4-quarter approach (always forecast 4 quarters ahead)." },
      { q: "What budget variance is acceptable?", a: "Target: <10% monthly variance. Investigate: >10% (is forecast wrong, opportunity, or overspend?). Adjust: If pattern (multiple months), reforecast next quarter. Rigid budgets: Miss growth, cut necessary spending. Flexible budgets: Replan quarterly, maintain optionality." }
    ],
    videoUrl: ""
  }
];

export default batch231Articles;