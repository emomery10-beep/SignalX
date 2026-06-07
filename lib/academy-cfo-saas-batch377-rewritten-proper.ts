import { AcademyArticle } from "@/types/academy";

export const batch377Articles: AcademyArticle[] = [
  {
    slug: "saas-financial-reporting-and-investor-updates",
    title: "Financial Reporting and Investor Updates: Communicating SaaS Performance",
    description: "Master financial reporting. Build investor updates, present metrics effectively, and manage board communications.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["financial reporting", "investor updates", "board reporting", "SaaS metrics", "investor relations"],
    keyTakeaways: [
      "Monthly investor update template: 5 sections in 1 page. (1) Key metrics dashboard (ARR, MRR growth, burn, runway), (2) Highlights (top 3 wins), (3) Lowlights (top 2-3 challenges — be honest), (4) Key asks (specific help needed from investors), (5) Financial summary (cash, burn, P&L snapshot). Send within 10 business days of month end. Consistency builds trust. Example: 'ARR grew 8% to £1.2M. Closed 2 enterprise deals. Lost key engineer. Cash: £1.5M, 12 months runway. Ask: Intro to [Company] for partnership.'",
      "Board deck structure: 10-15 slides max. (1) Agenda, (2) Executive summary (1 slide), (3) Key metrics vs plan, (4) Revenue deep dive (ARR bridge, pipeline), (5) Product update (shipped, roadmap), (6) Team update (hires, org changes), (7) Financial review (P&L, cash flow), (8) Strategic topics (1-2 discussion items), (9) Asks and decisions needed. Send 3-5 days before board meeting. Never surprise the board — pre-wire controversial topics with lead investor.",
      "Metrics presentation best practices: Always show trends (not just current month). Use consistent definitions (define metrics once, never change mid-report). Show vs plan/budget (variance analysis). Traffic light system: Green (on track), Amber (watch), Red (action needed). Cohort views for retention. Waterfall charts for ARR bridge. Example: ARR waterfall showing +£80K new, +£30K expansion, -£20K churn, -£5K contraction = +£85K net = clear visual of growth drivers."
    ],
    content: [
      {
        heading: "Building Effective Financial Reports and Investor Communications",
        body: `Creating reports that build trust and drive informed decision-making.

**Monthly investor update**

Why send monthly updates:
- Builds trust and transparency
- Keeps investors engaged (they can help more when informed)
- Creates accountability
- Documents company history
- Bad news early is better than bad news late

Update template:

Section 1: Key metrics (top of page)

| Metric | This month | Last month | YoY | vs Plan |
|---|---|---|---|---|
| ARR | £1,200K | £1,115K | +120% | +5% |
| MRR | £100K | £93K | +120% | +5% |
| Net new ARR | £85K | £78K | +95% | +8% |
| Customers | 180 | 172 | +80% | On plan |
| Gross margin | 79% | 78% | +3pp | +1pp |
| Monthly burn | £150K | £145K | +20% | -3% |
| Cash | £1,500K | £1,650K | n/a | On plan |
| Runway | 10 months | 11.4 months | n/a | On plan |

Section 2: Highlights (3-5 bullet points)

- Closed Acme Corp (£50K ACV) — largest deal to date
- Launched new analytics module — 40% adoption in first 2 weeks
- Hired VP Engineering (starts next month) from [Known Company]
- Churn decreased to 1.5% (from 2.0% three months ago)

Section 3: Lowlights (2-3 bullet points)

- Pipeline for Q2 is lighter than expected (2.5x coverage vs 3x target)
- Lost senior developer (replacement search underway)
- Enterprise deal with Beta Corp pushed to next quarter (procurement delay)

Section 4: Asks (specific, actionable)

- Intro to [Person] at [Company] for partnership discussion
- Recommendation for fractional CFO (finance hire needed Q2)
- Feedback on pricing page redesign (link attached)

Section 5: Financial summary

| P&L | This month | Budget | Variance |
|---|---|---|---|
| Revenue | £100K | £95K | +£5K |
| COGS | -£21K | -£20K | -£1K |
| Gross profit | £79K | £75K | +£4K |
| OpEx | -£229K | -£235K | +£6K |
| Net loss | -£150K | -£160K | +£10K |
| Cash balance | £1,500K | £1,480K | +£20K |

**Board deck structure**

Slide 1: Agenda (1 minute)
- List topics with time allocation
- Flag discussion items vs information items

Slide 2: Executive summary (5 minutes)
- 3 bullet points: What happened, what's working, what's not
- State of the business in one sentence
- Example: "Strong revenue month (+8% ARR growth) offset by pipeline concerns for Q2. Team execution improving. Cash position healthy at 10 months runway."

Slides 3-4: Key metrics (10 minutes)

Dashboard slide:
- ARR trend (12-month chart)
- Growth rate trend
- Burn rate and runway
- Key efficiency metrics

Metrics vs plan:
| Metric | Actual | Plan | Variance | Status |
|---|---|---|---|---|
| ARR | £1.2M | £1.14M | +5% | 🟢 |
| New customers | 12 | 10 | +20% | 🟢 |
| Churn | 1.5% | 2.0% | Better | 🟢 |
| Pipeline | 2.5x | 3.0x | -17% | 🟡 |
| Burn | £150K | £160K | Better | 🟢 |
| Headcount | 18 | 20 | -2 | 🟡 |

Slides 5-6: Revenue deep dive (10 minutes)

ARR bridge (waterfall):
Opening ARR: £1,115K
+ New business: £80K
+ Expansion: £30K
- Churn: -£20K
- Contraction: -£5K
= Closing ARR: £1,200K

Pipeline review:
- Current pipeline: £500K weighted
- Coverage: 2.5x (below 3x target)
- Key deals in flight
- Expected close dates

Slide 7: Product update (5 minutes)
- What shipped this quarter
- Key metrics impact of new features
- Roadmap for next quarter (high level)

Slide 8: Team update (5 minutes)
- Recent hires and departures
- Key open roles and search status
- Organisational changes

Slides 9-10: Financial review (10 minutes)
- P&L vs budget (quarter and YTD)
- Cash flow forecast (13-week)
- Runway analysis by scenario

Slides 11-12: Strategic discussion (15 minutes)
- 1-2 strategic topics for board input
- Example: "Should we pursue enterprise segment?"
- Present data and options, not just questions

Slide 13: Asks and decisions (5 minutes)
- Specific decisions needed from board
- Help requests (intros, advice, resources)
- Next meeting date and preview of agenda

**Metrics consistency and definitions**

Define metrics once and never change:

Create a metrics glossary:

| Metric | Definition | Calculation | Source |
|---|---|---|---|
| ARR | Annual Recurring Revenue | Sum of active subscription values, annualised | Billing system |
| MRR | Monthly Recurring Revenue | ARR ÷ 12 | Calculated |
| Logo churn | Customer churn rate | Customers lost ÷ starting customers (monthly) | CRM |
| Revenue churn | Gross revenue churn | ARR lost ÷ starting ARR (monthly) | Billing |
| NRR | Net Revenue Retention | (Starting ARR + expansion - churn - contraction) ÷ Starting ARR | Billing |
| CAC | Customer Acquisition Cost | Total S&M spend ÷ new customers (quarterly) | Finance |
| Burn | Net burn rate | Total expenses - total revenue (monthly) | Finance |
| Runway | Months of cash remaining | Cash balance ÷ average monthly burn (trailing 3-month) | Finance |

Rules:
- Never change metric definitions without explicit board discussion
- If changing, show both old and new definition for 3 months
- Note any one-time adjustments clearly

**Common reporting mistakes**

Mistake 1: Vanity metrics
- Problem: Report metrics that look good but don't matter
- Example: "Total registered users: 50,000" (but only 200 paying)
- Fix: Focus on revenue, retention, efficiency metrics

Mistake 2: No trend context
- Problem: Show current month only
- Fix: Always show 12-month trend and vs plan
- Context: "Churn is 2%" means nothing without "vs 3% six months ago" or "vs 1.5% target"

Mistake 3: Hiding bad news
- Problem: Omit negative developments
- Fix: Include lowlights section, be honest about challenges
- Trust is built by transparency, not by painting a rosy picture

Mistake 4: Inconsistent timing
- Problem: Updates arrive at random intervals
- Fix: Send by 10th business day of each month, every month
- If data isn't ready, send preliminary update and follow up

Mistake 5: No asks
- Problem: Investors want to help but don't know how
- Fix: Include specific, actionable asks every update
- "Intro to X" is better than "help with partnerships"

Mistake 6: Too long
- Problem: 10-page monthly update (nobody reads it)
- Fix: One page (max two) for monthly update
- Save depth for quarterly board meeting

**Financial reporting calendar**

Monthly (by day 10):
- Close books
- Update KPI dashboard
- Send investor update
- Review budget variance

Quarterly (board meeting):
- Full board deck
- Detailed financial review
- Strategic discussion topics
- Updated financial model/forecast

Annually:
- Annual plan and budget
- Audited financial statements (if required)
- Board strategy session
- Compensation review

**Building credibility with investors**

1. Consistency: Send updates on time, every time
2. Honesty: Share bad news early and directly
3. Context: Explain why, not just what
4. Follow-through: Reference previous asks and their outcomes
5. Accuracy: Never misrepresent metrics (investors will find out)
6. Preparation: Pre-wire board members before meetings on controversial topics
7. Action-oriented: Every challenge should have a plan to address it

`
      }
    ],
    relatedSlugs: ["fundraising-and-investor-relations", "board-meeting-preparation-and-governance", "metrics-dashboard-design-kpi-tracking", "financial-planning-and-budgeting", "stakeholder-alignment-and-communication-cadence"],
    faq: [
      { q: "What should a monthly investor update include?", a: "Five sections on one page: (1) Key metrics dashboard (ARR, growth, burn, runway, customers), (2) Highlights (top 3-5 wins), (3) Lowlights (2-3 challenges — be honest), (4) Asks (specific help needed — intros, advice), (5) Financial summary (P&L snapshot, cash position). Send within 10 business days of month end, every month. Consistency builds trust." },
      { q: "How should I structure a board deck?", a: "10-15 slides, 60-minute meeting: (1) Agenda, (2) Executive summary (1 slide), (3-4) Key metrics vs plan, (5-6) Revenue deep dive with ARR bridge, (7) Product update, (8) Team update, (9-10) Financial review, (11-12) Strategic discussion (1-2 topics), (13) Asks and decisions. Send 3-5 days before meeting. Pre-wire controversial topics with lead investor." },
      { q: "What metrics should I report to investors?", a: "Core SaaS metrics: ARR/MRR (with growth rate), net new ARR (with waterfall bridge), churn/NRR, gross margin, burn rate and runway, pipeline coverage, CAC and LTV:CAC. Always show trends (12 months), variance vs plan, and traffic light status. Create a metrics glossary with definitions. Never change definitions without board discussion." }
    ],
    videoUrl: ""
  }
];

export default batch377Articles;
