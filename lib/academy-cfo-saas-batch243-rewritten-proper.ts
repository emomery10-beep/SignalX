import { AcademyArticle } from "@/types/academy";

export const batch243Articles: AcademyArticle[] = [
  {
    slug: "investor-relations-and-communications",
    title: "Investor Relations and Communications: Managing Board and Investor Expectations",
    description: "Master investor relations. Communicate regularly, manage expectations, build trust.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["investor relations", "board communications", "board updates", "investor updates", "fundraising", "board governance", "communications"],
    keyTakeaways: [
      "Board meeting cadence: Monthly (informal, 30 min update), quarterly (formal board meeting, 2-3 hours, on agenda). Monthly updates: Headline (ARR growth, major milestones), KPIs (churn, CAC, NRR, burn), risks (top 3 blockers, market risks). Quarterly: Deep financials (P&L, headcount, burn), strategy discussion, board consent items (approvals). Annual: Strategy refresh (3-year plan), CEO evaluation, compensation planning. Communication: Proactive (share good + bad news early), consistent (no surprises), transparent (admit issues, explain mitigation). Building trust: Over-communicate initially (weekly updates), build to monthly as trust grows.",
      "Monthly update format: Headline (1 sentence, big impact), summary (3-5 bullets, key news), metrics (5-10 KPIs with prior month, goal, status), risks (top 3 risks + mitigation), asks (anything need board help with?). Length: 1-2 pages (easy to scan). Frequency: Monthly (Monday morning routine for CEO). Sentiment: Balanced (wins + challenges). Tone: Professional, honest (celebrate wins, own challenges). Example: Headline 'Closed £500K enterprise deal, but saw churn uptick'. Explanation: Won Salesforce customer (strong), but 2 customer cancellations (minor) = net positive but acknowledge.",
      "Quarterly board meeting: Agenda (KPI review, strategic discussion, approvals, closed session). Prep: Slides (metrics, narrative), financial package (P&L, cash flow), legal docs (minutes, resolutions). Time: 2-3 hours (1 hour metrics/updates, 1 hour strategy, 30 min approvals/closed session). Input: CEO drives agenda, CFO presents financials, board asked to weigh in on strategy. Output: Minutes (decisions, approvals), action items (who, by when), feedback (what going well, what to improve)."
    ],
    content: [
      {
        heading: "Investor Relations and Board Communication",
        body: `Building strong relationships with your board and investors.

**Board cadence and structure**

Typical schedule:
- Monthly: Informal update (email, 30 min)
- Quarterly: Formal board meeting (2-3 hours in-person or virtual)
- Annual: Strategy summit (1-2 days off-site)

Board composition (typical Series A/B):
- CEO (founder)
- 2-3 investor directors (VC investors)
- 1-2 independent directors (domain experts)
- Board observers (potential investors, advisors)

**Monthly board update template**

Format:
- Headline (1 big item or summary)
- Metrics (5-10 KPIs: ARR, growth %, churn, burn, runway, key objectives progress)
- Narrative (what happened this month, why metrics moved)
- Risks (top 3 risks, mitigation plan)
- Asks (anything need board help with?)
- Length: 1-2 pages (scannable)

Metrics template:
| Metric | Prior | Current | Goal | Status |
|---|---|---|---|---|
| ARR | £1.5M | £1.6M (7%) | £2.5M | On track |
| Monthly churn | 2.5% | 2.3% | 2% | Improving |
| CAC | £2.5K | £2.3K | <£2K | On track |
| Burn | £150K | £140K | £130K | Improving |
| Runway | 11mo | 12mo | 18mo+ | Good |

Narrative example:
"ARR grew 7% MoM (£1.6M), driven by 8 new enterprise deals. Churn improved to 2.3% with new CS onboarding process. Burn improved 7% due to marketing efficiency gains. On pace to hit £2.5M goal by year-end if close 2 more $500K deals in Q4."

Risk example:
"Top risk: Competitive threat from new entrant (raising $10M Series B). Mitigation: Accelerate product roadmap, lock in enterprise contracts with multi-year terms. Impact: If mishandled, could lose 10-15% of pipeline."

**Quarterly board meeting**

Agenda (2-3 hours):
| Section | Time | Owner | Content |
|---|---|---|---|
| Financials | 30 min | CFO | P&L, cash flow, unit economics |
| Metrics | 30 min | CEO | KPI review, progress vs plan |
| Strategy | 30 min | CEO | Market updates, competitive, roadmap |
| Approvals | 30 min | CEO/legal | Consent items, resolutions |
| Closed session | 15 min | Board only | CEO performance, compensation |

Preparation:
1. Board package (distributed 48 hours prior)
   - Metrics dashboard (1 page)
   - Narrative (2-3 pages)
   - Financial statements (P&L, balance sheet, cash flow)
   - Legal docs (approval items, resolutions)

2. Meeting logistics
   - Confirm attendance
   - Send dial-in or video link
   - Materials printed/shared

**Investor communication best practices**

Good practice:
- Proactive (share news early, before problems)
- Regular (monthly minimum, even if small update)
- Transparent (admit challenges, don't hide)
- Honest (show both wins and losses)
- Ask for help (board is resource, use them)

Avoid:
- Surprises (no "board finds out from news")
- Over-promising (miss targets, lose credibility)
- Email silences (radio silence = worry)
- Hiding bad news (always comes out, trust broken)

Tone:
- Confident (you have plan, can execute)
- Humble (acknowledge unknowns, learning)
- Action-oriented (here's what we're doing)

Example bad update:
"ARR $1.5M, miss plan ($2M). Three customers churned. Don't know why. Need help."

Better update:
"ARR $1.5M (25% below plan). Three customers churned due to: (1) product issue (fixed), (2) budget cut (expected in market), (3) competitive loss (we're differentiating). In response: (1) shipped fix, (2) focus on stable segment, (3) raising price and locking enterprise deals with multi-year terms. Here's how you can help: [asks]."

`
      }
    ],
    relatedSlugs: ["board-governance-and-fiduciary-duties", "financial-planning-and-budgeting", "strategic-planning-and-quarterly-goal-setting"],
    faq: [
      { q: "How often should I communicate with my board?", a: "Monthly minimum (email update, 30 min). Quarterly (formal board meeting, 2-3 hours). Annual (strategy summit, 1-2 days). Avoid: Radio silence (creates worry). Build trust: Monthly updates initially, can reduce to quarterly as mature." },
      { q: "What should I include in board updates?", a: "Headline (1 big item). Metrics (5-10 KPIs with trend). Narrative (what happened, why). Risks (top 3 + mitigation). Asks (help needed). Length: 1-2 pages. Frequency: Monthly. Tone: Transparent, honest, action-oriented." },
      { q: "How do I manage board expectations?", a: "1. Set clear goals (quarterly OKRs). 2. Track progress (weekly internally, monthly to board). 3. Communicate early (if on track, great; if off track, explain early). 4. Adjust (reforecast if needed). 5. Over-deliver (beat expectations if possible). Key: Consistency (hit what you commit to, builds trust)." }
    ],
    videoUrl: ""
  }
];

export default batch243Articles;