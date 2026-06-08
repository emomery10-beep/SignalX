import { AcademyArticle } from "@/types/academy";

export const batch254Articles: AcademyArticle[] = [
  {
    slug: "board-governance-and-fiduciary-duties",
    title: "Board Governance and Fiduciary Duties: Managing the Board",
    description: "Master board governance. Understand fiduciary duties, run effective meetings, manage directors.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["board governance", "fiduciary duties", "board meetings", "board directors", "audit committee", "governance", "board responsibility"],
    keyTakeaways: [
      "Fiduciary duties: Duty of care (make informed decisions, diligent), duty of loyalty (act in company interest, not self), duty of good faith (honest, transparent). Example: Board votes on acquisition. Duty of care = board members reviewed financials, asked questions. Duty of loyalty = didn't vote for personal benefit (family deal). Duty of good faith = disclosed conflicts, honest discussion. Violation: Director sued (personally liable). Cost: Director liability insurance £10-30K/year. Reality: Rarely enforced for early-stage private, more common as company matures.",
      "Board structure: Odd number (3, 5, 7) = tie-breaking. Typical Series A: 3 directors (CEO + 2 VCs, or 1 investor + 1 independent). Series B: 5 directors (CEO + 2 VCs + 1-2 independent). Independent director: Not investor, no material business relationship. Committee: Audit (financial oversight), Comp (salary, options), Nominating (board composition). Cost: Director fees (not common for VC-backed, but paid for independent directors £25-50K/year). Time: 6-8 board meetings/year, prep time 10+ hours/board member/meeting.",
      "Board meeting best practices: Agenda (distributed 48 hours prior, focused). Materials (financials, narrative, decisions needed). Time: 2-3 hours (1 hour metrics, 1 hour strategy, 30 min approvals). Notes: Minutes (decisions made, action items, owners, deadlines). Closed session: Board only, no management (for performance, strategy). Frequency: Monthly informal (email update), quarterly formal (2-3 hour meeting), annual (strategy + comp planning). Culture: Transparent (share both good and bad), collaborative (board as resource, not oversight police), action-oriented (make decisions, execute)."
    ],
    content: [
      {
        heading: "Board Governance and Effective Oversight",
        body: `Building a high-functioning board.

**Fiduciary duties of directors**

Duty of care:
- Make informed decisions (review materials, ask questions)
- Diligent (spend adequate time, investigate thoroughly)
- Conflict check (disclose conflicts, recuse if needed)

Example: Board votes on acquisition
- Review: Terms, valuation, synergies, risks
- Questions: Ask CEO hard questions
- Challenge: Dissent if don't agree
- Document: Minutes show diligence

Duty of loyalty:
- Act in company best interest, not personal
- No self-dealing (except disclosed)
- Majority vote (conflicts don't vote)

Example: Director's brother has vendor company
- Disclose: Tell board the relationship
- Recuse: Don't vote on vendor approval
- Vote: Rest of board votes without conflict

Duty of good faith:
- Honest and transparent
- Follow process (respect bylaws, governance)
- Act reasonably (not reckless)

Violation consequences:
- Personal liability (director sued personally)
- Directors & officers insurance (covers legal costs)
- Reputational (can't serve on future boards)

**Board structure and composition**

Board size:
- 3 directors: Too small (no diversity), works for seed/early
- 5 directors: Ideal (enough diversity, efficient decisions)
- 7+ directors: Complex (slower, more coordination)

Typical composition (Series A):
- CEO (founder/hired)
- 2 VC investor directors (voting control)
- 0-1 independent director (outside perspective)

Typical composition (Series B):
- CEO
- 2 VC investor directors
- 1-2 independent directors

Independent director:
- Not investor, no material business relationship
- Often hired (paid £25-50K/year)
- Benefit: Outside perspective, credibility

Board committees:
1. Audit: Oversee financials, accounting, internal controls
   - Meets quarterly
   - Reviews: Financials, independent audit results

2. Comp: Oversee salary, bonus, options
   - Meets annually
   - Reviews: CEO compensation, option pool, vesting

3. Nominating: Oversee board composition, refreshment
   - Meets annually
   - Reviews: Board skills, independence, succession

**Board meeting best practices**

Quarterly board meeting:
- Timing: Each quarter
- Duration: 2-3 hours
- Format: In-person or video (monthly email updates in between)

Agenda:
| Time | Topic | Owner |
|---|---|---|
| 0:00-0:20 | Financials (KPIs, P&L, cash) | CFO |
| 0:20-1:00 | Business update (sales, products, ops) | CEO |
| 1:00-1:45 | Strategy discussion (2-3 key topics) | CEO + board |
| 1:45-2:00 | Approvals (consent items, resolutions) | Board |
| 2:00-2:15 | Closed session (board only) | Board |

Materials (distributed 48 hours prior):
- 1-page board summary (headline, metrics, risks)
- Financial package (P&L, balance sheet, cash)
- Deck (strategy, decisions needed)

Minutes:
- Decisions made
- Action items (who, by when)
- Dissenters (if any)
- Attendance

Closed session (board only, no management):
- CEO performance
- Compensation decisions
- Strategic options (fundraising, M&A)
- Director evaluation
- Succession planning

Culture:
- Transparency (share good and bad)
- Collaboration (board as advisor, not adversary)
- Focus (clear decisions, not endless discussion)
- Action (execute, then report results)

`
      }
    ],
    relatedSlugs: ["investor-relations-and-communications", "financial-planning-and-budgeting", "strategic-planning-and-quarterly-goal-setting"],
    faq: [
      { q: "What are board fiduciary duties?", a: "Duty of care: Make informed decisions, diligent, investigate. Duty of loyalty: Act in company interest, not personal. Duty of good faith: Honest, transparent, follow process. Violation = personal liability (insurance covers). Rare for early private companies, more common as you scale." },
      { q: "What board composition should I have?", a: "Early stage (seed/Series A): 3-5 directors (CEO + 2 VCs + 0-1 independent). Series B: 5 directors (CEO + 2 VCs + 1-2 independent). Independent director: Not investor, no material business relationship. Paid £25-50K/year. Benefit: Outside perspective, credibility." },
      { q: "How often should we have board meetings?", a: "Formal: Quarterly (2-3 hour meeting, in-person ideal). Informal: Monthly (email update, 30 min). Annual: Strategy (1-2 days off-site). Materials: Distributed 48 hours before. Agenda: Financials (30 min), business (30 min), strategy (45 min), approvals (15 min), closed (15 min)." }
    ],
    videoUrl: ""
  }
];

export default batch254Articles;