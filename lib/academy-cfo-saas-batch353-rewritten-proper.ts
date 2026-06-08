import { AcademyArticle } from "@/types/academy";

export const batch353Articles: AcademyArticle[] = [
  {
    slug: "board-meeting-preparation-and-governance",
    title: "Board Meeting Preparation and Governance: Managing the Board Effectively",
    description: "Master board governance. Prepare materials, run effective meetings, manage board.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["board meetings", "governance", "board management", "corporate governance", "board materials"],
    keyTakeaways: [
      "Board responsibility: Hire/fire CEO, set strategy, approve budget, oversee risk. Board typical: 3-5 people (CEO + founder, 1-2 investors, maybe independent). Meetings quarterly minimum (monthly better). Preparation: Materials 1 week before (board members read ahead, come prepared). Effective: 2-3 hour meeting (agenda, decision-making, not just information). Value: Strategy alignment, expert advice, accountability.",
      "Board materials: Executive summary (1 page, key metrics), financial statements, monthly operations update, strategic decisions needed. Format: Clear, data-driven, action-oriented (not just reporting). Example: \"Revenue below plan (£80K vs £100K), analyzing why (CAC up, conversion down), plan to fix in Q2 (retarget ads, improve landing page).\"",
      "Board dynamics: CEO must manage board (not vice versa). Key: Be honest (don't hide bad news), solicit advice (board is valuable), be responsive (answer questions quickly), follow up (implement decisions). Red flags: Board surprises about problems, missing meetings, misalignment on strategy. Better: Regular communication, alignment, proactive engagement."
    ],
    content: [
      {
        heading: "Preparing for and Running Effective Board Meetings",
        body: `Optimizing board governance and decision-making effectiveness.

**Board fundamentals**

Board role:
- Strategic oversight (is company going in right direction?)
- Financial accountability (are numbers healthy?)
- Risk management (what could go wrong?)
- CEO oversight (is CEO performing?)
- Decision-making (approve major decisions)

Typical board composition:

Early stage (pre-Series A):
- CEO (founder)
- Advisor investor (1 advisor)
- Independent director (maybe)
- Total: 2-3 people

Series A:
- CEO (founder)
- Lead investor (representative)
- Maybe one more investor
- Independent director (maybe)
- Total: 3-4 people

Series B+:
- CEO (founder)
- 2-3 investor representatives
- 1 independent director (operations expert, etc.)
- Total: 4-5 people

Meeting frequency:
- Minimum: Quarterly (4 times/year)
- Better: Monthly (during rapid changes)
- Emergency: Ad-hoc (urgent decisions)

**Board meeting materials**

Executive summary (1 page):

Format:
- Key metrics (vs plan):
  - Revenue: £120K (plan £150K, -20%)
  - Churn: 5% (plan 3%, +2%)
  - Runway: 10 months (plan 12, -2 months)
  - Progress: 2 of 4 strategic goals on track

- Highlights (2-3 bullets):
  - "Launched new tier, early adoption 20% of new customers"
  - "Closed strategic partnership with [customer]"
  - "Product roadmap: AI features launching next quarter"

- Challenges (2-3 bullets):
  - "Revenue below plan, investigating CAC inflation"
  - "Customer concentration (top 3 = 40%), diversifying"
  - "Key hire fell through, restarting search"

- Ask/decisions needed:
  - "Board approval for additional £500K debt facility"
  - "Feedback on pricing strategy (testing 2 new tiers)"

Financials:

P&L summary:
- Revenue vs budget
- Gross profit, margins
- Operating expenses, burn rate
- Net profit/loss
- Runway

Example:

| Item | Actual | Budget | Variance |
|---|---|---|---|
| Revenue | £120K | £150K | -20% |
| COGS | £36K | £45K | -20% |
| Gross profit | £84K | £105K | -20% |
| Opex | £110K | £110K | On |
| Net income | -£26K | -£5K | -£21K variance |
| Cash balance | £220K | £300K | -£80K |
| Runway | 10 mo | 12 mo | -2 months |

Operations update:

What happened:
- Hired 2 engineers, 1 CS manager
- Lost 1 engineer (offer accepted elsewhere)
- Headcount: 8 → 9
- Key challenge: Hiring competition in market

Customer update:
- 425 customers (vs plan 450, -6%)
- NPS: 35 (vs plan 40, -5 points)
- Key win: Closed 3 enterprise customers
- Key loss: 1 mid-market customer churned

Product update:
- Completed: Real-time collaboration (shipped)
- In progress: Enterprise tier (launch month 2)
- Upcoming: API integrations (month 3)

Strategic decisions needed (if any):
- Decision 1: Approve hiring plan for next quarter
- Decision 2: Feedback on international expansion plan
- Decision 3: Approve board observer seat for new investor

**Running board meetings**

Meeting structure (2-3 hours):

00:00-00:10 (10 min): Update on last meeting action items
- "In January, we decided to pursue enterprise market"
- "Status: 3 enterprise customers signed, pipeline strong"
- Mark complete or discuss if blocked

00:10-00:45 (35 min): Executive update
- CEO presents executive summary (5-10 slides)
- Review metrics, challenges, highlights
- Q&A from board

00:45-01:15 (30 min): Deep dives
- Finance: Review P&L in detail, explain variance
- Operations: Team status, hiring, culture
- Product: Roadmap, technical decisions

01:15-01:45 (30 min): Strategic discussion
- Market evolution (competition, customer trends)
- Strategy adjustment (if needed)
- Long-term vision (where are we going?)

01:45-02:00 (15 min): Decisions + action items
- Vote on any decisions needed (board approval)
- Assign action items (who, by when)
- Confirm next meeting date

Board materials preparation:

1 week before:
- Draft materials (metrics, financials, summaries)
- Share with CFO/finance for review
- Get feedback from other executives

2-3 days before:
- Finalize materials
- Distribute to board (PDF email or shared folder)
- Include agenda

Day of meeting:
- Confirm attendance
- Technical setup (video if remote)
- Print materials (if in-person)
- Have backup plan (if tech fails)

**Decision-making and governance**

Types of decisions:

Strategic decisions (board approval):
- Major product bets (pivot, new market)
- Large hiring (CTO, VP, etc.)
- Significant capital (raise, debt, M&A)
- Exit (acquire, go public)
- Major business changes (model, pricing)

Approval process:
- Present options (pros/cons for each)
- Board discussion (debate, questions)
- Vote (majority rules, in some cases unanimous)
- Document (minutes note decision, reasoning)

Example decision:

Motion: "Raise Series B funding of £3-5M"

Presentation:
- Why now? (runway, growth trajectory, market opportunity)
- How much? (18-month runway, £1M burn = need ~£1.5M)
- Timeline? (close by Q3)
- Use of funds? (50% sales/marketing, 25% product, 25% ops)
- Expected outcome? (£250M ARR by year 5)

Board discussion:
- Is timing right? (is traction sufficient?)
- What valuation? (what will investors pay?)
- What investors? (who fits culture, expertise?)
- What else could we do? (bootstrap, debt, strategic)

Vote:
- Board votes (usually unanimous, sometimes 2-1)
- Record: "Motion to authorize CEO to raise Series B for board approval, passed 3-0"
- Next: CEO executes (investor outreach, negotiations)

**Common board mistakes**

Mistake 1: No materials, show up unprepared
- Problem: Board members unprepared, meeting unfocused
- Fix: Materials 1 week before, agenda clear
- Impact: Better decisions (prepared board)

Mistake 2: Hide bad news
- Problem: Don't tell board about problems until too late
- Fix: Be transparent (board can help)
- Impact: Board can advise, help navigate

Mistake 3: No agenda
- Problem: Rambling meetings, don't cover key topics
- Fix: Clear agenda, time-boxed items
- Impact: Efficient meetings, action-oriented

Mistake 4: Not following up
- Problem: Board votes on decision, nothing happens
- Fix: Track action items, report at next meeting
- Impact: Accountability (decisions matter)

Mistake 5: Board doesn't add value
- Problem: Board is just rubber stamp
- Fix: Solicit advice (what would you do?), debate
- Impact: Better decisions (advisory input)

`
      }
    ],
    relatedSlugs: ["investor-relations-and-stakeholder-communication", "financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking", "cap-table-management-and-equity-tracking", "scenario-planning-and-sensitivity-analysis"],
    faq: [
      { q: "What should be in board materials?", a: "Executive summary: Metrics vs plan, highlights, challenges, decisions needed. Financials: P&L, cash, runway. Operations: Headcount, customer updates, product status. Strategic: Market, competition, long-term vision. Format: 1-page summary + detailed appendix. Distribute: 1 week before meeting (board reads ahead)." },
      { q: "How often should I have board meetings?", a: "Minimum: Quarterly (4 times/year). Better: Monthly (especially during rapid changes). Emergency: Ad-hoc if urgent decisions needed. Structure: 2-3 hours (update, financials, strategy, decisions). Preparation: Materials 1 week before, agenda clear, attendees know what to expect." },
      { q: "What decisions need board approval?", a: "Major decisions: Fundraising, debt, M&A, exit, major hires (CTO, VP), pivots, large budget changes. Board approval = vote (majority rules). Document in minutes (decision, reasoning). Operational decisions (hiring, spending within budget) = CEO prerogative. Key: Be transparent with board, get input, execute decisions." }
    ],
    videoUrl: ""
  }
];

export default batch353Articles;
