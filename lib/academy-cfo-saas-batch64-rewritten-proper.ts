import { AcademyArticle } from "@/types/academy";

export const batch64Articles: AcademyArticle[] = [
  {
    slug: "investor-updates-and-reporting",
    title: "Investor Updates and Reporting: Communicating Progress to Your Board",
    description: "Write effective monthly investor updates. Report metrics, celebrate wins, address challenges, and maintain investor confidence.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "investor updates",
      "board reporting",
      "metrics reporting",
      "investor communication",
      "monthly updates",
      "transparency",
      "performance reporting",
      "stakeholder reporting",
      "financial reporting",
      "KPI communication"
    ],
    keyTakeaways: [
      "Monthly update format: 1-page summary, never longer (executives busy, attention limited); sections: headline (one-line summary of month), metrics (ARR, churn, CAC, magic number), highlights (2-3 wins), challenges (2-3 issues with mitigation), hiring (who we added, who we're hiring), and ask (what we need from investors: introductions, capital, strategic advice)",
      "Metric transparency: Share actual numbers, not spin (if ARR missed target, say so, explain why); investors value honesty over cheerleading (getting bad news monthly is fine, surprises in board meeting = bad); share trailing 3-month average (smooths single-month noise) plus trend (are metrics improving or worsening?)",
      "Good update tone: Professional but honest, optimistic but realistic; never exaggerate (kills credibility), never hide bad news (will come out in board meeting anyway); focus on what you're learning and fixing, not excuses"
    ],
    content: [
      {
        heading: "Monthly Investor Update Framework",
        body: `A monthly investor update is a 1-page email to your investors (board, angels, VCs) that reports progress, metrics, and issues.

Purpose: Keep investors informed, maintain confidence, surface early problems.

Without updates: Investors surprised in board meeting, lose confidence ("Why didn't we know about this?")
With updates: Investors see progress, trust leadership

**Format: 1 Page Maximum**

Sections (in order):

**1. Headline (1 sentence)**
- Captures the essence of the month
- Example: "Strong revenue growth offset by higher-than-expected churn; implementing retention plan"
- Not: Long narrative, too detailed

**2. Metrics (key numbers)**
- ARR (and change from last month)
- MRR and churn rate (monthly retention %)
- CAC and payback period
- Runway (months of cash remaining)
- Number of customers
- Magic number (sales efficiency)

Format: Show current number + change
- ARR: £4.5M (↑6% from last month, ↑30% YoY)
- Churn: 2.1% monthly (stable vs. last month, slight uptick from 2% target)
- Runway: 14 months (↑2 months from cash addition)

**3. Highlights (2-3 wins)**
- Major customer wins (£100K+ deals)
- Product launches or improvements
- Team additions (key hires)
- Partnerships or integrations
- Awards or recognition

Example:
- Closed £500K enterprise deal with FinServ customer (largest ACV to date)
- Launched API integration with Salesforce (requested by 20+ customers)
- Hired VP Sales (started this month, former HubSpot leader)

**4. Challenges (2-3 issues)**
- Revenue misses (if behind target)
- Churn spikes (if worse than expected)
- Hiring delays (key roles unfilled)
- Product issues (bug, regression)
- Market headwinds (competitor launched, economic slowdown)

Format: Issue + Mitigation
- Churn ticked up to 2.1% (vs. 1.8% target) due to [reason]. Mitigation: Implemented customer health scoring to catch at-risk accounts earlier. Expecting improvement next month.

**5. Hiring (team updates)**
- New hires: Title, start date, background
- Open roles: What you're hiring, when you want to fill
- Ask: Do you know anyone? (networking for recruiting)

Example:
- Started: Sarah Chen as VP Sales (ex-Salesforce, 10 years enterprise sales)
- Starting next: John Smith as Principal Engineer (currently at Google, starting Jan 15)
- Open: 2 customer success managers, 1 data analyst (targeting January starts)

**6. The Ask (what you need)**
- Capital: "Raising Series B, targeting close Q2"
- Introductions: "Looking for CTO hire, do you know good engineering leaders?"
- Strategic advice: "Considering moving upmarket to mid-market enterprise, would value your perspective"
- Customer intros: "Trying to break into financial services, do you know fintech CFOs?"

**Example Monthly Update**

---

**January Monthly Update — [Company Name]**

**Headline:** Strong growth continuing, exceeded ARR target but churn remains elevated; implementing focused retention program.

**Metrics:**
- ARR: £5.2M (↑5% from Dec, ↑35% YoY)
- Monthly recurring revenue: £433K (stable)
- Churn: 2.3% monthly (vs. 2% target, up from 2.1% last month)
- CAC: £8.5K (↓5% from improving sales efficiency)
- Payback period: 11 months (↓1 month, on track)
- Runway: 16 months (↑2 months from previous raise)
- Customers: 115 (↑4 from Dec)

**Highlights:**
- Closed £600K enterprise deal (our largest ACV, financial services)
- Product launch: Advanced reporting module (customer #1 request)
- Hired Sarah Chen as VP Sales (ex-Salesforce, strong enterprise background)

**Challenges:**
- Churn elevated at 2.3% vs. 2% target, driven by 2 mid-market customers citing budget cuts (economic headwind)
- Implementation timeline slipped on 1 large deal (scope creep, now closing Feb instead of Jan)
- Engineering sprint one week behind (junior engineer onboarding slower than expected)

**Mitigations:**
- Implemented customer health scoring (launched week 1 of Feb) to catch at-risk accounts
- Engaged executive sponsor with budget-cut customer (negotiated renewal at 80% value)
- Engineering process review scheduled, hiring additional mid-level engineer

**Hiring:**
- Started: Sarah Chen, VP Sales (Jan 2)
- Open: 1 principal engineer (critical hire for roadmap), 2 customer success managers
- Closing: 1 data analyst by end of month

**The Ask:**
- Introductions: Do you know strong engineering leaders (VP of Engineering level)? We're trying to strengthen technical team
- Perspective: Considering shift toward enterprise segment (higher ACV, lower churn). Would value your thoughts on market size and competition
- Customer intros: Any financial services CTOs or finance operations leaders in your network? Trying to expand in FS vertical

---

**Tone and Style**

Good:
- Professional but warm ("We had a strong month…")
- Honest ("Churn is above target…")
- Specific numbers (not "strong revenue" but "£5.2M ARR")
- Forward-looking ("Implementing X to address Y")

Bad:
- Overly sales-y ("Crushing it!" kills credibility)
- Excuses ("Churn up because market is hard" – own the issue)
- Vague ("Making progress" – too vague)
- Dwelling on problems ("We're worried…" – solution focus instead)

**What NOT to Do**

Mistake 1: Making it too long (more than 1 page)
- Investors are busy, won't read 3 pages
- If important detail needed, add 1-page appendix

Mistake 2: Hiding bad news
- If you miss target, say so (don't bury it)
- Investors find out anyway, better to tell them

Mistake 3: Making it too positive (tone-deaf)
- If revenue missed, don't lead with small win
- Balance good news with challenges

Mistake 4: No ask (missed opportunity)
- Use updates to ask for help (introductions, strategic guidance)
- Investors want to help, but don't know what you need

Mistake 5: Inconsistent metrics
- Don't change what you report month-to-month
- Same metrics every month = easy comparison

**Update Schedule**

Timing:
- Monthly: Send on same day each month (e.g., first business day)
- Consistency: Investors expect it, mark their calendars
- Delays: If you miss monthly schedule, resend and apologize

Distribution:
- Email: Send to all board members + key investors
- Optional: Post to a shared drive (Google Drive, Notion) for historical record
- Don't use: Mass communications tools (feels impersonal)

**Sample Metrics Dashboard in Update**

| Metric | This month | Last month | Target | Status |
|--------|----------|----------|--------|--------|
| ARR | £5.2M | £4.95M | £5.0M | 🟢 |
| Churn | 2.3% | 2.1% | 2.0% | 🔴 |
| CAC payback | 11 months | 12 months | <12 months | 🟢 |
| Customers | 115 | 111 | 110 | 🟢 |
| Runway | 16 months | 14 months | >12 months | 🟢 |

This gives snapshot: 4 green, 1 red, easy to scan.

Investor updates are your main communication channel with board. Make them consistent, honest, and actionable. A founder who sends monthly updates with transparency and clear asks builds investor trust. A founder who's silent until board meeting (with surprises) loses it.

Most important: Send on time, every month, no excuses.
`
      }
    ],
    relatedSlugs: [
      "board-reporting-governance",
      "financial-modeling-for-saas",
      "metrics-dashboard-design-kpi-tracking",
      "forecasting-accuracy-planning",
      "data-driven-decision-making-analytics"
    ],
    faq: [
      {
        q: "How long should an investor update be?",
        a: "1 page maximum (400-600 words). If more detail needed, add 1-page appendix. Investors are busy, keep it concise."
      },
      {
        q: "Should I hide bad news?",
        a: "No. Report honestly. Investors would rather get bad news monthly than be surprised in board meeting. Transparency builds trust."
      },
      {
        q: "What if I missed my target?",
        a: "Report it. Explain why. Show what you're doing to fix it. Example: \"Missed ARR target by 5% due to X. Implemented Y to improve for next month.\""
      },
      {
        q: "Should updates be identical for all investors?",
        a: "Same content, potentially personalized closing. Main update for all, but tailor 'ask' if specific investor needs different support."
      }
    ],
    videoUrl: ""
  }
];

export default batch64Articles;
