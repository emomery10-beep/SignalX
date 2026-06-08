import { AcademyArticle } from "@/types/academy";

export const batch346Articles: AcademyArticle[] = [
  {
    slug: "investor-relations-and-stakeholder-communication",
    title: "Investor Relations and Stakeholder Communication: Managing Expectations",
    description: "Master investor relations. Update stakeholders, manage expectations, build trust.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["investor relations", "stakeholder communication", "board updates", "investor expectations", "communication"],
    keyTakeaways: [
      "Investor relations: Keep investors informed (prevent surprises). Cadence: Monthly board updates (1-2 pages), quarterly deep dives, annual strategy reviews. Content: Progress (vs plan), challenges, financial highlights, next steps. Tone: Honest (don't hide problems), confident (have plan to address). Benefit: Trust (transparency), alignment (everyone knows direction), support (investors help when problems arise).",
      "Board meetings: Quarterly (minimum), 2-3 hours. Agenda: (1) Financials (vs plan), (2) Operations (team, progress), (3) Strategy (market, competition), (4) Decisions (need approval?). Attendees: CEO, board members, maybe key managers. Preparation: Board materials 1 week before (read ahead, come prepared). Follow-up: Minutes, action items, next meeting date.",
      "Bad communication: Radio silence (investors hear nothing for months), surprises (miss target, investors shocked), vague updates (no concrete metrics). Good communication: Regular (predictable), transparent (honest about problems), metric-driven (data, not just stories). Cost: Time (CEO effort), maybe investor relations hire at scale. ROI: Huge (trust enables support, follow-on rounds easier)."
    ],
    content: [
      {
        heading: "Building Effective Investor and Stakeholder Communication",
        body: `Maintaining relationships and managing expectations with key stakeholders.

**Investor relations fundamentals**

Definition:
- Ongoing communication with investors (board members, investors)
- Goal: Keep informed, manage expectations, build trust
- Benefit: Early warning (investors help with problems), support (follow-on funding), network

Cadence:
- Monthly: Brief update (email, 1-2 pages)
- Quarterly: Board meeting (2-3 hours, deep dive)
- As needed: Crisis communication (important changes)

Trust building:
- Transparency: Be honest about problems (not hiding)
- Predictability: Update on schedule (not ad-hoc)
- Credibility: Say what you'll do, then do it
- Responsiveness: Answer investor questions promptly

**Monthly investor update**

Format:
- Email: Subject "Company X - [Month] [Year] Update"
- Length: 1-2 pages (quick read)
- Frequency: Same day each month (predictable)

Content:

Section 1: Executive summary (2-3 sentences)
- Key highlight of month
- Example: "Grew revenue 15% MoM, added 25 customers, closed partnership deal"

Section 2: Metrics (table format)

| Metric | Current | Prior month | Target | Status |
|---|---|---|---|---|
| Revenue | £105K | £100K | £120K | -13% target |
| Customers | 425 | 410 | 450 | -6% target |
| Churn | 4% | 5% | 3% | Improving |
| CAC | £450 | £500 | £400 | Over |
| NPS | 35 | 32 | 40 | Improving |
| Runway | 10 months | 11 months | 12+ | Shortening |

Section 3: Progress vs plan
- Hitting targets? Where and where not?
- Example: "Customers on track (+2% vs plan), revenue below (-13% vs plan due to lower ARPU)"

Section 4: Challenges
- What went wrong? What are you doing about it?
- Example: "Churn above plan (4% vs 3%), working on onboarding improvements, expect impact in 2 months"

Section 5: Next month priorities
- What's focus? What needs attention?
- Example: "Launch new tier (higher ARPU), hire CS manager (improve retention)"

Section 6: Request for input
- Any questions? Need investor help?
- Example: "Exploring partnerships with [vendor], know someone? Let me know"

Tone: Honest, confident (problems + plan to fix)

**Quarterly board meetings**

Frequency: Every 3 months (minimum)

Duration: 2-3 hours

Attendees:
- CEO (always)
- Investors/board members
- Maybe: CTO, VP Sales (specific topics)

Preparation:
- Materials: Slides, financial statements, board materials (1 week before)
- Agenda: Share with attendees (they know what to expect)
- Reading: Expect board members to read materials (come prepared)

Agenda (example 2-hour meeting):

Time: 00:00-00:15 (15 min)
- CEO update: Business highlights, challenges, vision
- Format: 5-10 slide presentation

Time: 00:15-00:45 (30 min)
- Financials: Review P&L, cash, runway
- Format: Dive into numbers, explain variance vs plan
- Example: "Revenue down 10%, churn up 2% (why?), plan to fix in 2 months"

Time: 00:45-01:15 (30 min)
- Operations: Team updates, hiring, culture
- Format: Headcount, key changes, any concerns
- Example: "Hired 2 engineers, planning sales hire in Q3"

Time: 01:15-01:45 (30 min)
- Strategy: Market, competition, roadmap
- Format: Product direction, competitive positioning, 1-year plan
- Example: "Launching new tier (upsell opportunity), adding integrations (customer request)"

Time: 01:45-02:00 (15 min)
- Decisions: Vote on any decisions needed
- Example: "Board approves additional £500K funding to extend runway"

Follow-up:
- Minutes: Email to attendees within 1 day
- Action items: Who's doing what? Deadlines?
- Next meeting: Schedule next quarter

**Handling difficult conversations**

Scenario 1: Missing targets

Situation: Revenue £80K (target £120K), 33% miss

Communication:
1. Don't hide it (investors will find out)
2. Explain why (churn up, CAC inefficient, market slower than expected)
3. Have a plan (how will we fix it? Timeline?)
4. Show accountability (take responsibility, don't blame others)

Example:
"Revenue this month £80K vs plan £120K. Root cause: Churn increased 2% (onboarding issues) and CAC increased 50% (market cost inflation). Plan: Fix onboarding (CS hire, better training), shift to lower-CAC channels. Expected: Back on track Q3 (2-3 month delay)."

Investor response:
- Good: "Appreciate transparency, plan sounds solid, we're here to help"
- Bad: "Why didn't you tell us earlier? We would have helped"

Lesson: Early communication > late communication

Scenario 2: Need to change strategy

Situation: Original plan was "enterprise focus", but SMB segment growing faster

Communication:
1. Acknowledge: Original plan was X, but market showing Y
2. Explain: Customer feedback, market dynamics, unit economics
3. Propose: New focus on SMB (shorter sales cycle, easier scaling)
4. Impact: Revenue different (higher volume, lower ARPU), runway changes, hiring different

Example:
"Original focus was enterprise (12-month sales cycle, high ARPU). Market feedback: SMB wanting product, buying faster (2-month cycle). Unit economics: Enterprise higher LTV (£50K), SMB lower (£5K), but SMB volume 10x. Pivot: Focus on SMB (scale revenue faster), serve enterprise later. Impact: Revenue trajectory different but potentially higher."

Investor response:
- Good: "Makes sense, pivot is smart, we support it"
- Bad: "You're changing direction? Why didn't you know this before?"

Lesson: Market feedback justifies pivots, investors often expect iterations

Scenario 3: Runway shortening

Situation: Planned 18-month runway, now 9 months (burn rate higher than expected)

Communication:
1. Acknowledge: Burn higher, runway shortened
2. Explain: Why (higher than expected marketing spend, new hires)
3. Propose: Options
   - Reduce burn (hiring freeze, cut marketing)
   - Fundraise sooner (bridge round, Series B)
   - Extend runway (profitability path)
4. Get investor input: What do you recommend?

Example:
"Burn rate increased to £150K/month (planned £100K). Runway now 9 months (was 18). Root: Higher acquisition spending (working well, CAC payback 10 months), new hires. Options: (1) Hiring freeze (keep runway 12-15 months), (2) Fundraise now (bridge £2M), (3) Profitability plan (cut marketing 30%, reduce burn to 12 month runway). Seeking board input: What's the right call?"

Investor response:
- Good: "Let's fundraise, momentum is good, we can raise Series B"
- Good: "Hiring freeze makes sense, let's extend runway"
- Bad: "You should have planned this better"

Lesson: Runway is critical, get investor alignment early on options

**Investor expectations management**

Set realistic expectations:

Early stage: "Expect volatility, learning mode, iterations"
- Revenue may fluctuate (early customers, product still improving)
- Hiring may be slow (recruiting difficult)
- Strategy may pivot (market feedback drives changes)

Growth stage: "Expect steady metrics, fewer surprises"
- Revenue trajectory more predictable (growing month-over-month)
- Hiring accelerating (team building for scale)
- Strategy clarifying (PMF achieved, focus on execution)

Mature stage: "Expect predictability, execution focus"
- Revenue stable (growing, but less volatility)
- Hiring planned (specific roles, timelines)
- Strategy set (focus on market capture)

By communicating stage expectations, investors are less surprised by volatility.

**Building investor advisory board**

Beyond board members, get advisor investors:
- Meet quarterly (coffee, 30 min)
- Ask specific questions (feedback on pivot, intro to customers, talent)
- Keep them updated (same monthly updates)
- Benefit: Additional perspectives, extended network, future support

Selection: Investors who add value (not just capital)
- Domain expertise (understand your market)
- Network (know customers, partners, talent)
- Operational experience (have built companies)

Cost: Usually £0 (advisors expect equity or good will)

Benefit: Huge (advice is often worth more than capital)

**Common IR mistakes**

Mistake 1: Radio silence
- Problem: Investors hear nothing for 6 months
- Fix: Monthly email (quick update, predictable)
- Impact: Trust (they don't worry), support (they help)

Mistake 2: Surprises
- Problem: Call investor with bad news (runway 3 months, need help)
- Fix: Communicate early (runway 9 months, planning next steps)
- Impact: Investors have time to help, still trusting

Mistake 3: All good stories
- Problem: Only share wins, hide problems
- Fix: Transparent (wins + challenges + plans)
- Impact: Credibility (they trust you're real)

Mistake 4: No data
- Problem: "Revenue is good" (no numbers)
- Fix: Metrics dashboard (specific numbers, vs targets)
- Impact: Confidence (concrete, not vague)

`
      }
    ],
    relatedSlugs: ["fundraising-strategy-and-investor-outreach", "due-diligence-preparation-for-investment", "financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking", "scenario-planning-and-sensitivity-analysis"],
    faq: [
      { q: "How often should I update investors?", a: "Cadence: Monthly email (1-2 pages, quick), quarterly board meeting (2-3 hours, deep dive). Monthly email: Metrics vs plan, challenges, next steps. Board meeting: Financials, operations, strategy, decisions. Tone: Honest (don't hide problems), confident (have plan to fix). Benefit: Trust, alignment, support when problems arise." },
      { q: "What should I include in investor updates?", a: "Monthly: Metrics (revenue, churn, CAC, runway), progress vs plan, challenges, priorities, request for input. Format: 1-2 pages, table format for metrics, honest tone. Quarterly board: Same metrics + detailed P&L, operations update (team, hiring), strategy (market, competition, roadmap), decisions needed. Key: Don't hide bad news (early communication > late)." },
      { q: "How do I handle bad news with investors?", a: "Approach: (1) Don't hide it (they'll find out), (2) Explain why (root cause), (3) Have a plan (how will you fix it?), (4) Take accountability (own the problem). Example: Missing revenue target → explain (churn up, CAC high), plan (fix onboarding, shift channels), timeline (back on track in 2-3 months). Investor response: \"Appreciate transparency, plan sounds solid\" if communicated well early." }
    ],
    videoUrl: ""
  }
];

export default batch346Articles;
