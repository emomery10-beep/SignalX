import { AcademyArticle } from "@/types/academy";

export const batch190Articles: AcademyArticle[] = [
  {
    slug: "board-governance-and-fiduciary-duties",
    title: "Board Governance and Fiduciary Duties: Building Trust and Compliance",
    description: "Master board dynamics. Structure governance, understand fiduciary duties, and build effective boards.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "board governance",
      "fiduciary duty",
      "board meetings",
      "director responsibilities",
      "board committees",
      "shareholder rights",
      "board independence",
      "conflict of interest",
      "board composition",
      "corporate governance"
    ],
    keyTakeaways: [
      "Board composition: Seed stage (3 members: 2 founders + 1 investor), Series A+ (5 members: founder CEO, founder + investor board seat, independent director). Independence: At least 1 independent (not investor, not employee) by Series A+. Rationale: Investor seats = conflict if trying to liquidate/extend funding. Independent director = neutral, protects all shareholders. Example: Founder CEO + CTO + Investor (VC) + Independent (CFO from other company).",
      "Fiduciary duties: Duty of care (make informed decisions), duty of loyalty (act in company interest, not personal), duty of disclosure (tell board all material facts). Example breach: Founder doesn't disclose founder conflict (selling house to company at markup). Board can sue founder personally (directors, investors at risk). Insurance: D&O insurance covers legal costs (£500K-2M limit, 1-2% premium of annual revenue). Must buy before Series A (investor requirement).",
      "Board cadence: Monthly operational check-ins (management + board, 60 min), quarterly board meetings (4 hrs, with all materials 5 days early), annual strategy + board review. Meeting agenda: 1) Financials (actuals vs forecast), 2) Board report (CEO update), 3) Metrics (KPIs), 4) Risks (what could go wrong), 5) Decisions (vote on items). No surprises: Board should know about major issues before meeting (CEO pre-call with lead investor/chair 1 week prior)."
    ],
    content: [
      {
        heading: "Board Structure and Composition",
        body: `Building an effective board of directors.

**Board Size by Stage**

Seed (£0-500K raised):
- Typical: 3 members
- Members: Founder/CEO, Co-founder (often CTO/COO), Angel investor (optional)
- Purpose: Lightweight governance, operational decision-making
- No independent director yet (too early, expensive)

Series A (£500K-2M raised):
- Typical: 5 members
- Members: Founder/CEO, Co-founder, VC investor, Second investor (if raised from 2 VCs), Independent director
- Purpose: More formal governance, protect investors, bring expertise
- Independent director required by many VCs (conflicts of interest)

Series B+ (>£2M raised):
- Typical: 5-7 members
- Members: Founder/CEO, 1-2 co-founders (declining as company grows), 2-3 VC investors, 1-2 independent directors, potentially Chair (non-executive)
- Purpose: Professional governance, prepare for exit, bring operational expertise

Public company:
- Typical: 7-10 members
- Majority independent directors (regulatory requirement)
- Separate CEO and Board Chair (CEO doesn't run own board)
- Audit committee (independent directors only)

**Board Composition Rules**

Independence:
- Definition: No financial interest in company (not investor, not employee, not family)
- Rationale: Conflicts of interest removed (independent director protects all shareholders)
- Requirement: By Series A, need at least 1 independent director (investor preference)
- Example: VC investor NOT independent (has financial interest, voting power over future rounds)

Investor board seats:
- Typical: Lead investor gets 1 seat per financing round
- Co-investor: Typically doesn't get seat (but can attend as observer)
- Future rounds: New investor may demand seat (negotiate, or keep as observer)
- Seat = voting rights on major decisions (veto over financing, exit, salary changes)

Founder representation:
- Founder/CEO always has seat (by right, usually)
- Co-founders: Have seats while at company (as officers), lose if depart or demoted
- Post-exit: Founder may stay on board for transition, then departs

Independent directors:
- CFO/finance person from bigger company (brings financial acumen)
- Head of sales from adjacent market (brings go-to-market experience)
- Board veteran (multiple board experiences, knows governance)
- Cost: £2K-5K per meeting + equity (0.25-0.5% for Series A, declining with size)

**Board Term Limits**

Typical:
- 3-year terms (annual election, re-elect if desired)
- At-will removal (company can remove for cause)
- Investor seat: Continues while investor owns equity

Turnover:
- Independent directors: Rotate off after 2-3 terms (fresh perspective)
- Investor directors: Stay as long as investor holds significant stake
- Founder: Typically stays through company life (or steps down as CEO)

Example:
- Year 0: Founder, co-founder, seed investor (3 board)
- Year 1 (Series A): Add VC investor + independent director (5 board)
- Year 3 (Series B): Add second VC investor, independent director rotates off, add new independent (5 board)
- Year 5: Independent director 1 term complete, rotate off, add new (5 board)

`
      },
      {
        heading: "Fiduciary Duties and Legal Responsibilities",
        body: `Understanding director obligations and liability.

**Three Core Fiduciary Duties**

1. Duty of Care:
- Definition: Make informed decisions, use reasonable diligence, consult experts if needed
- Example BREACH: Vote on £5M acquisition without reviewing financials or customer base
- Example GOOD: Review detailed analysis, talk to references, ask questions at board meeting
- Standard: Gross negligence is required for breach (simple mistake/bad decision not enough)

2. Duty of Loyalty:
- Definition: Act in company's interest, not personal. Disclose conflicts. Don't self-deal.
- Example BREACH: Founder negotiates a side deal with investor (selling company before full board vote), then votes to accept offer
- Example BREACH: Director votes to buy real estate from related company at premium price
- Example GOOD: Founder discloses personal use of company assets (office space in their building), recuses from vote
- Consequence: Board can sue director personally, clawback personal gain

3. Duty of Disclosure:
- Definition: Tell board all material information. No hiding bad news.
- Example BREACH: CEO knows churn spiked 3% but doesn't mention in board meeting
- Example BREACH: Founder in negotiations with competitor for acquisition but doesn't disclose
- Example GOOD: CEO proactively flags "churn increasing, investigating causes"
- Consequence: Can't claim board approved bad decision if board wasn't informed

**Personal Liability and Insurance**

Director liability:
- Directors personally liable for breaches of duty
- Shareholders can sue directors
- Investors can sue directors (especially if company fails)

D&O Insurance (Directors and Officers):
- Covers legal costs and settlements from shareholder lawsuits
- Coverage: £500K-£2M (depending on company size and stage)
- Cost: 1-2% of annual revenue (plus adjustment premium)
- Example: £10M revenue, £100K premium = £500K coverage
- Investors require: D&O insurance by Series A (mandatory)
- Claims: "Employment practices liability" (wrongful termination suits), "management liability" (shareholder derivative suits)

Caps and exclusions:
- Fraud: Not covered (intentional bad acts)
- Prior acts: Coverage only after policy start (watch for gaps between insurance updates)
- Deductible: Usually £25K-£50K (company pays first)

Indemnification:
- Company indemnifies directors (agrees to cover liability)
- Allows company to reimburse directors for legal costs
- Note: If company fails, indemnification may not help (no funds)
- That's why D&O insurance critical (insurance company pays, not company)

**Conflicts of Interest**

Disclosure requirement:
- Any director with conflict must disclose
- Must recuse from discussion and vote
- Document in board minutes

Common conflicts:
1. Financial interest in decision:
   - Example: Founder voting on acquisition price (founder gets more in deal)
   - Solution: Disclose, recuse from vote

2. Related-party transactions:
   - Example: Company buys software from vendor where director has interest
   - Solution: Disclose, competitive bid process, independent review, disclose price

3. Outside employment:
   - Example: Director taking job at competitor (may steal trade secrets/customers)
   - Solution: Disclose, enforce non-compete, maybe require resignation from board

4. Investor seats:
   - Inherent conflict: VC investor directing company for investor benefit, not company benefit
   - Example: Pushing for acquisition at lower price (VC wants liquidity)
   - Mitigation: Independent directors + independent chair + shareholder vote on major deals

**Managing Conflicts**

Approval processes:
- Related-party transaction: Board votes without related director, must be fair to company
- Major decision with conflict: Independent committee votes (independent directors only)
- Executive compensation: Independent directors vote (CEO can't vote on own raise)

Documentation:
- Board minutes must document conflict disclosed
- Rationale for approval despite conflict
- Price/terms justified as arm's length

Example:
- Founder negotiating personal real estate lease with company
- Disclose in board: "I own building, proposing £100K/yr lease"
- Independent directors review market rates (£95K-£110K typical)
- Vote: "Lease approved at £100K, representing fair market value per independent appraisal"
- Minutes document decision and reasoning (protects directors from liability)

`
      },
      {
        heading: "Board Meetings and Decision-Making",
        body: `Running effective board meetings and governance processes.

**Board Meeting Cadence**

Monthly management meeting (optional):
- 30-60 minutes, CEO + board
- Purpose: Quick update, flag issues, seek advice
- Agenda: Financials, key metrics, near-term risks
- No formal voting (operational)

Quarterly board meeting (required):
- 3-4 hours, full board, formal agenda
- Held within 30 days of quarter-end
- Materials: 5-7 days before (financial statements, board report, metrics)
- Purpose: Review quarter, approve major decisions, strategy discussion

Annual board meeting:
- 4-6 hours (extended)
- Quarterly review + strategy + board evaluation
- Agenda: Annual budget review, equity grants, long-term strategy
- Board evaluation: How's the board performing? What expertise gaps?

Ad-hoc meeting:
- If urgent decision needed (crisis, offer, major customer)
- Board consent via written approval (can be email)
- Ratify in minutes at next quarterly meeting

**Board Meeting Agenda**

Typical 4-hour quarterly meeting:
1. Minutes and approvals (30 min)
   - Approve prior minutes, review action items
   - Approve any written consent items (prior ad-hoc decisions)

2. CEO board report (45 min)
   - State of the company (1 slide)
   - Top wins/losses (what went well, what didn't)
   - Headcount, product progress, customer wins/losses
   - Key risks and mitigations

3. Financials (30 min)
   - Actual vs budget vs forecast (3-way comparison)
   - Cash position and runway
   - Variance explanation (why under/over?)
   - Path to profitability

4. Key metrics and KPIs (30 min)
   - Revenue, growth rate, churn, CAC/LTV
   - Sales pipeline and forecast
   - Hiring plan vs headcount

5. Risk review (15 min)
   - What could derail company? (customer concentration, market, competitive, regulatory)
   - Mitigation plan (what are we doing about it)

6. Decisions/votes (30 min)
   - Any items requiring board approval:
     - Equity grants
     - Significant contracts >£500K
     - Acquisition or divestiture
     - Financing terms (if raising)
     - Management changes (hiring/firing executives)

7. Strategy discussion (30 min)
   - Quarterly focus: What are we optimizing for? (growth, profitability, market share)
   - Long-term vision: Where are we heading? (exit strategy, market position)
   - Board feedback: What should we be thinking about?

8. Closed session (15 min)
   - Directors only (no management)
   - Board discussions about management performance
   - Compensation, strategy, concerns

Materials to provide:
- Board package (financials, CEO report, metrics) 5 days early
- Monthly flash report (interim financials, major news)
- Investor updates (if relevant)

**Documentation and Minutes**

Board minutes:
- Formal record of board decisions
- What was discussed, what was decided, who voted how
- Action items and owners
- Due dates

Key items to document:
- Quorum present (how many directors attended)
- Conflicts of interest disclosed
- Votes (unanimous vs split, how did each vote)
- Dissents (if director disagreed, document)
- Rationale (why did we approve this)

Example:
"Board voted 4-1 to approve acquisition of XYZ Inc for £5M. Director Smith abstained due to prior relationship with target. Board unanimously agreed price is fair based on independent valuation analysis. Effective date: Jan 1. CEO authorized to sign definitive agreement."

Duration: Minutes should be filed with corporate records (required by law).

`
      }
    ],
    relatedSlugs: [
      "financial-controls-and-audit-readiness",
      "exit-planning-and-m-and-a-preparation",
      "board-reports-and-financial-statements",
      "funding-and-investment-rounds",
      "employee-equity-and-stock-options"
    ],
    faq: [
      {
        q: "What should my board look like?",
        a: "Seed: 3 members (2 founders + investor). Series A: 5 members (founder CEO, co-founder, 2 VC investors, 1 independent director). Series B+: 5-7 (add more independent directors, potential chair). Need at least 1 independent director (not investor, not employee) by Series A. Independent director brings expertise, protects all shareholders from conflicts."
      },
      {
        q: "What are fiduciary duties?",
        a: "Three: (1) Duty of care (make informed decisions), (2) Duty of loyalty (act in company interest, disclose conflicts), (3) Duty of disclosure (tell board all material facts). Breach = personal liability. Mitigation: D&O insurance (£500K-2M coverage, required by Series A investors). Cost: 1-2% of revenue. Covers legal costs and settlements."
      },
      {
        q: "How often should the board meet?",
        a: "Monthly operational update (optional, 30-60 min). Quarterly formal board meeting (3-4 hours, required, with materials 5 days prior). Annual extended meeting (4-6 hours, includes strategy + board evaluation). Ad-hoc if needed (major decision, crisis). Most important: Quarterly + quarterly materials."
      },
      {
        q: "What decisions require board approval?",
        a: "Major items: Equity grants (>0.5%), significant contracts (>£500K), acquisition/divestiture, financing terms, management changes. Minor items: Day-to-day operations (CEO can do). Routine: Budget, hiring within plan. Delegate to board committees if large company. Document all approvals in board minutes (required for liability protection)."
      }
    ],
    videoUrl: ""
  }
];

export default batch190Articles;
