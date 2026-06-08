import { AcademyArticle } from "@/types/academy";

export const batch244Articles: AcademyArticle[] = [
  {
    slug: "organizational-structure-and-team-design",
    title: "Organizational Structure and Team Design: Building Scalable Teams",
    description: "Master org design. Build structure, manage span of control, scale teams effectively.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["organizational structure", "team design", "org chart", "span of control", "management structure", "team scaling", "organizational design"],
    keyTakeaways: [
      "Org design principles: Span of control (how many reports per manager: 4-8 optimal, lower = more managers cost, higher = overloaded). Early (£0-1M): Flat (CEO + 3-5 direct reports). Growth (£1-10M): 2 levels (CEO → VPs → ICs). Scaling (>£10M): 3+ levels (CEO → VPs → Directors → Managers → ICs). Example: £5M ARR, 20 people. Org: CEO → VP Sales (6 reports), VP Eng (8 reports), VP CS (3 reports), CFO (3 reports). Cost: Each manager level adds 15-20% overhead. Benefit: Clearer decisions, career path, accountability. Rule: Don't add manager unless span > 8 (pain outweighs cost).",
      "Functional structure (typical): Sales (AEs, SDRs, Sales ops), Marketing (demand gen, product marketing), Engineering (backend, frontend, infra), Product (PM, design, research), CS (CSMs, support, onboarding), Finance (accounting, FP&A), People (recruiting, ops). Each function = cost center (except sales/CS = revenue generating). Efficiency: Cost per revenue. Sales/CS 30-40% of spend, Engineering 20-30%, Marketing 10-15%, Support 5%, Admin 10%. Monitor: By function monthly (is budget on track?). Adjust: If marketing CAC rising, shift spend to higher-ROI channels.",
      "Team scaling: Hire ahead of need (3-month lead time, onboarding ramp), or lag (minimize cost, reactively hire). Strategy: Ahead for mission-critical (sales, product), lag for support (scale ops). Example: Plan £2M new ARR (need 3 new AEs). Hire in month 1 (start month 2), productive month 4 (ramp time 3 months). Revenue impact: Month 5+ get new AE contribution (£500K annual). Cost: Salary + ramp cost (inefficiency) = £300K total. Payback: 7-8 months (acceptable). Avoid: Hiring 20 at once (culture shock, management overhead, hard to integrate)."
    ],
    content: [
      {
        heading: "Designing Scalable Organizations",
        body: `Building teams that grow efficiently.

**Organizational structure evolution**

Stage 1: Startup (0-20 people)
- Flat: CEO + 3-5 direct reports (all senior)
- No managers (ICs report to VPs/founders)
- Quick decisions, low overhead
- Works while small (CEO can know everyone)

Stage 2: Growth (20-50 people)
- Functional: CEO → 4-5 VPs (Sales, Eng, CS, Marketing, Finance)
- VPs manage ICs (4-8 reports each)
- Specialization (roles more defined)
- First level of management added

Stage 3: Scaling (50-200 people)
- Multi-level: CEO → VPs → Directors → Managers → ICs
- Specialization (functions split further)
- Example: Sales = VP → Director sales → 3 sales managers → AEs

Stage 4: Enterprise (>200 people)
- Matrix: Functional + geographic (Europe, APAC, Americas)
- Complex: More layers, coordination cost
- Scale challenge: Keeping culture, velocity

**Span of control guidelines**

Optimal: 4-8 direct reports per manager
- 3-4: Under-leveraged (manager not needed, promote)
- 4-8: Healthy (manager bandwidth utilized)
- 8-12: Strained (manager stretched, add manager)
- 12+: Broken (manager can't support, definitely add)

Example team sizes:
| Level | Company size | Typical span |
|---|---|---|
| Startup | 10 people | CEO manages 4 |
| Early growth | 30 people | VP manages 6 ICs |
| Growth | 75 people | Manager manages 5 ICs |
| Scaling | 200 people | Directors manage managers (4-6 each) |

**Functional budget allocation**

Typical SaaS budget split (% of total spend):
| Function | % | Rationale |
|---|---|---|
| Engineering | 25-30% | Core product, infrastructure |
| Sales | 20-25% | Revenue generation |
| Customer success | 10-15% | Retention, expansion |
| Marketing | 10-15% | Demand generation |
| Finance/Admin | 10-15% | Operations, finance |
| Executive | 5% | Leadership, strategy |

Monitor monthly:
- Is each function on budget?
- Are metrics improving (sales: CAC, product: feature velocity)?
- Any functions bloated (cost > efficiency)?

**Hiring and team scaling**

Forecast headcount:
- Start of year: 20 people
- Grow 50% (10 new): Need £500K headcount cost
- Plan: Hire 2/quarter, onboard over 3 months

Hiring ahead vs lag:
- Ahead: Hire before revenue (pay upfront, bet on growth)
  - Pro: Ready when growth happens
  - Con: Overspend if growth slows
  - Use for: Sales (long ramp), engineering (critical)

- Lag: Hire after demand (reactive, lower cost)
  - Pro: Lower risk, only hire if growth realized
  - Con: Miss growth if can't hire fast enough
  - Use for: Support, admin, non-core

Typical ramp timeline:
- Month 1: Hire
- Month 1-2: Onboarding, not productive
- Month 2-3: Ramping, 50% productivity
- Month 4+: Fully productive
- Cost: Salary + ramp inefficiency (15-30% cost buffer)

`
      }
    ],
    relatedSlugs: ["hiring-and-talent-acquisition-strategy", "financial-planning-and-budgeting", "building-sustainable-company-culture-and-values"],
    faq: [
      { q: "What's the right org structure for my stage?", a: "Startup: Flat (CEO + 4-5 direct reports). Growth: Functional VPs (Sales, Eng, CS, Marketing). Scaling: Multi-level (VP → Director → Manager). Enterprise: Functional + geographic. Add manager when: Span > 8 or VPs overwhelmed. Cost: Each manager 15-20% overhead (so only add if needed)." },
      { q: "What span of control should I target?", a: "4-8 direct reports per manager (optimal). 3-4: Under-leveraged (don't need manager). 8-12: Strained (add manager). 12+: Broken (definitely add). Monitor: If manager visible stressed, likely too many reports." },
      { q: "When should I hire ahead vs wait?", a: "Hire ahead: Sales, engineering (long ramp, critical path). Hire lag: Support, admin, non-core. Typical: Hire 3 months before need. Cost: Salary + 2-3 month ramp inefficiency. Payback: Usually 6-12 months (acceptable for revenue-generating roles)." }
    ],
    videoUrl: ""
  }
];

export default batch244Articles;