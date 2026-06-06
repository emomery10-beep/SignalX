import { AcademyArticle } from "@/types/academy";

export const batch125Articles: AcademyArticle[] = [
  {
    slug: "investor-dashboard-and-metrics-reporting",
    title: "Investor Dashboard and Metrics Reporting: Communicating Financial Health to Stakeholders",
    description: "Master investor reporting. Build dashboards, present metrics, and communicate your company's financial health clearly and consistently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "investor dashboard",
      "metrics reporting",
      "board reporting",
      "financial statements",
      "key metrics",
      "dashboard design",
      "reporting cadence",
      "investor communication",
      "fundraising metrics",
      "transparency"
    ],
    keyTakeaways: [
      "Investor dashboard includes: MRR/ARR, growth %, churn, NRR, CAC, LTV, cash runway, burn rate, headcount, profitability. Example dashboard: MRR £100K, growth 8% MoM, churn 2%, NRR 115%, CAC £50K, LTV £150K (3x ratio), runway 18 months, burn £400K/month, 35 people. Update monthly, share with board and key investors.",
      "Reporting cadence: Monthly board deck (1-2 pages, key metrics + narrative), Quarterly detailed financials (P&L, cash flow, balance sheet), Annual audited financials (if raised institutional capital). Board members expect: metric trends (is growth accelerating?), variance to plan (did we hit forecast?), risks and mitigations.",
      "Key investor metrics: Revenue growth (target 30%+ YoY), unit economics (LTV/CAC >3x, CAC payback <12 months), retention (churn <5% monthly), cash runway (12+ months), path to profitability (when?). Investors care less about profit today (expect losses early-stage), more about trajectory. Example: £5M ARR, 40% growth, path to profit in 18 months = attractive. £5M ARR, 5% growth, no profit plan = unattractive."
    ],
    content: [
      {
        heading: "Building an Investor Dashboard",
        body: `An investor dashboard is a one-page visual summary of your company's financial health.

**What Goes on an Investor Dashboard**

Essential metrics:

Revenue metrics:
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- MoM growth rate (month-over-month % change)
- Bookings (pipeline in motion)

Retention metrics:
- Monthly churn rate
- Net Revenue Retention (NRR)
- Customer count

Unit economics:
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- LTV/CAC ratio

Financial health:
- Operating burn (monthly)
- Cash on hand
- Runway (months of cash)

Operational:
- Headcount
- Employee productivity (revenue per employee)

Example dashboard for £1M ARR company:

| Metric | Current | Target | Trend |
|--------|---------|--------|--------|
| MRR | £83K | £90K | ↑ (on track) |
| ARR | £1M | £1.2M | ↑ (8% growth YoY) |
| MoM Growth | 3% | 5% | ↓ (slowing) |
| Monthly Churn | 2% | <2% | ✓ (on track) |
| NRR | 110% | >100% | ✓ (expansion) |
| Customers | 50 | 60 | ↑ (growing) |
| CAC | £5K | <£5K | ✗ (increasing) |
| LTV | £20K | >£15K | ✓ (strong) |
| LTV/CAC | 4x | >3x | ✓ (efficient) |
| Burn | £40K/month | £35K/month | ↑ (slightly worse) |
| Cash runway | 16 months | 12+ months | ✓ (healthy) |
| Headcount | 12 | 15 | ↑ (planned hires) |
| Rev/employee | £83K | >£100K | ↓ (slowing) |

Each metric shows:
- Current value
- Target value
- Trend (↑ improving, ↓ worsening, ✓ on track, ✗ off track)

This one-page summary tells the story: Growing well, unit economics strong, but growth slowing and headcount not yet productive.

**Metrics by Company Stage**

Early stage (£100K-1M ARR):

Focus on:
- Growth rate (30%+ MoM is strong)
- Unit economics fundamentals (CAC payback, LTV)
- Retention (churn rate)
- Cash runway (can we reach next milestone?)

Don't stress about:
- Profitability (not expected)
- Absolute revenue (focus on growth rate)
- Revenue per employee (not important early)

Growth stage (£1-10M ARR):

Focus on:
- Consistent growth (30%+ YoY or 5-8% MoM)
- Unit economics optimization (improve CAC payback)
- Churn reduction (expand NRR)
- Path to profitability (when will we be cash flow positive?)

Late stage (£10M+ ARR):

Focus on:
- Growth deceleration is normal (20-30% YoY expected)
- Margin expansion (gross margin, operating margin)
- Cash flow profitability (operating cash flow positive)
- Capital efficiency (capital raised / revenue generated)

**Dashboard Design**

Good investor dashboard:

1. One page (two pages maximum)
2. Visual (charts/graphs, not all text)
3. Metric trends (show direction, not just values)
4. Comparison to targets (is metric on track?)
5. Easy narrative (red/green indicators for quick scan)

Example visual design:

Top row: Key revenue metrics
- MRR (large number, trend arrow)
- Growth % (large number, trend arrow)
- ARR run-rate

Second row: Unit economics
- CAC (with trend)
- LTV (with trend)
- LTV/CAC ratio (color-coded: green >3x, yellow 2-3x, red <2x)

Third row: Retention
- Churn % (with trend, color-coded)
- NRR % (with trend)
- Customer count

Bottom row: Financial health
- Monthly burn
- Cash runway
- Headcount

This layout tells the story: Revenue growing, unit economics improving, retention strong, cash position healthy.

**Metrics That Tell the Story**

What investors want to know:

Question 1: Are you growing?
- Answer: MoM growth rate, ARR trend
- Context: Growth rate relative to target (are you decelerating?)

Question 2: Are you efficient?
- Answer: LTV/CAC ratio, CAC payback period
- Context: Is unit economics improving (CAC declining, LTV improving)?

Question 3: Are customers staying?
- Answer: Churn rate, NRR
- Context: Can you retain customers or are you losing them?

Question 4: Can you survive?
- Answer: Cash runway, monthly burn
- Context: How long until you need to raise again?

Question 5: Are you on path to profitability?
- Answer: Operating margin, path to break-even
- Context: When will company generate cash (not lose it)?

Example narrative:

"We're growing 8% MoM (on target), LTV/CAC is 4x (strong unit economics), churn is 2% (excellent retention), and we have 18 months of cash runway (healthy). We're on path to profitability in 20 months based on current trajectory."

This answers all 5 questions in one paragraph.

**Real-Time vs Monthly Reporting**

Real-time dashboard:
- Updated daily or weekly
- For CEO/team to monitor
- Granular detail (by customer segment, channel, etc.)

Monthly reporting:
- Updated once per month
- For board/investors to see
- High-level summary (key metrics only)

Monthly is standard for investor communication (too much noise if daily).

**Presentation Format**

Monthly board deck:

Slide 1: Dashboard (key metrics summary)
Slide 2: Revenue and growth (chart showing MRR trend, breakdown by segment)
Slide 3: Unit economics (CAC, LTV, payback period, LTV/CAC ratio)
Slide 4: Retention (churn rate, NRR, cohort analysis)
Slide 5: Financial summary (burn, cash runway, headcount, path to profitability)
Slide 6: Risks and mitigations (what are we worried about? how are we addressing it?)

This structure covers all investor questions.
`
      },
      {
        heading: "Key Metrics to Report",
        body: `Which metrics matter most to investors, and how to present them.

**Revenue Metrics**

Monthly Recurring Revenue (MRR):
- Monthly subscription revenue run-rate
- Annualized: MRR × 12 = ARR
- Growth rate: (Month 2 MRR - Month 1 MRR) / Month 1 MRR = MoM growth %

Example:

Jan MRR: £80K
Feb MRR: £86K
Growth: (86 - 80) / 80 = 7.5% MoM

Annual run-rate: £86K × 12 = £1.032M ARR

Board cares about: MRR and MoM growth % (is growth accelerating or decelerating?)

Bookings (aka Sales):
- Revenue committed in contracts (not yet recognized)
- Different from revenue (which is recognized)

Example:

Sign £1M contract in Jan, recognize £83K/month revenue over 12 months
- Bookings: £1M (committed)
- Revenue Jan: £83K (earned)

Investors care about bookings as leading indicator of future revenue.

**Growth Rate Analysis**

Track growth rate over time:

| Month | Revenue | MoM Growth | 3-Month Avg |
|-------|---------|-----------|------------|
| Jan | £80K | — | — |
| Feb | £86K | 7.5% | — |
| Mar | £92K | 7% | 7.3% |
| Apr | £97K | 5.4% | 6.4% |
| May | £101K | 4.1% | 5.3% |

This shows growth decelerating (7.5% → 5.3%).

Question for CEO: Why is growth slowing? Market saturation? Reduced spend on marketing? (Need explanation.)

**Churn and Retention Metrics**

Monthly Churn Rate:
- % of customers lost each month
- Example: Start 100 customers, lose 3 = 3% churn

Net Revenue Retention (NRR):
- Revenue from existing customers month 1 / Revenue from same customers month 0
- Example: 100 customers in Jan at £100K total, same 100 customers in Feb at £110K (expansion) = 110% NRR

Investors prefer NRR (shows expansion, not just retention).

Report both:
- Churn rate (should be <3% for healthy SaaS)
- NRR (should be >100% for growth, >110% for strong expansion)

**Unit Economics**

Customer Acquisition Cost (CAC):
- Total sales/marketing spend / # new customers acquired
- Example: £500K spend / 100 customers = £5K CAC

CAC Payback Period:
- Months to recover CAC from customer revenue
- Example: £5K CAC / £500 MRR per customer = 10 months payback

Lifetime Value (LTV):
- Total revenue from customer over lifetime
- Example: £500 MRR × 24-month customer life = £12K LTV

LTV/CAC Ratio:
- Should be >3x (ideally >5x)
- Example: £12K LTV / £5K CAC = 2.4x (concerning, <3x)

Report:
- CAC (should be declining over time, or stable)
- CAC payback (should be <12 months)
- LTV/CAC ratio (should be improving)

If LTV/CAC is declining, investors see red flag (your acquisition getting more expensive, or retention declining).

**Profitability Metrics**

Gross Margin:
- (Revenue - COGS) / Revenue
- Example: £1M revenue - £200K COGS = £800K gross profit = 80% margin
- SaaS targets: 70%+ gross margin

Operating Margin:
- (Revenue - All expenses) / Revenue
- Example: £1M revenue - £900K expenses = £100K = 10% operating margin
- SaaS early-stage targets: Negative (expected to lose money), path to 20%+ by maturity

Report both gross and operating margin:
- Gross margin stable or improving? (shows product efficiency)
- Operating margin trending toward profitability? (shows unit economics improving)

**Cash Metrics**

Monthly Burn:
- Net monthly cash spent
- Example: Revenue £100K, expenses £140K = -£40K monthly burn

Burn Rate:
- Months of cash / Monthly burn
- Example: £2M cash / £40K burn = 50 months runway

Cash Runway:
- How long until cash runs out
- Important for fundraising (can't let it fall below 6 months)

Report:
- Monthly burn (is burn increasing or decreasing?)
- Cash runway in months (is it improving or declining?)
- Projection (will runway reach 6 months or below, triggering need to fundraise?)

**Headcount and Productivity**

Headcount:
- Total employees
- Report by department (engineering, sales, support, etc.)

Revenue per employee:
- ARR / Headcount
- Example: £10M / 50 employees = £200K/employee
- Should be 150K-300K for healthy SaaS

Report:
- Total headcount (growing or stable?)
- Revenue per employee (improving or declining?)
- Planned hires (are we investing in growth?)

If revenue/employee declining, it means you're hiring faster than revenue growing (concerning).
`
      },
      {
        heading: "Reporting Cadence and Format",
        body: `When and how to report to investors.

**Monthly Reporting**

For board and key investors, send monthly (within 5 days of month-end):

1. One-page dashboard
   - Key metrics snapshot
   - Trends (is metric up/down/stable?)
   - Comparison to forecast

2. Monthly narrative (brief)
   - Highlights (what went well?)
   - Challenges (what went wrong?)
   - Forecast vs actual (did we hit plan?)

3. CEO commentary
   - One paragraph on business health
   - Key wins and challenges
   - Next month focus

Example monthly email:

Subject: [Company] Monthly Metrics - [Month]

Dashboard:
MRR: £95K (target £100K) [↑ from £90K]
Growth: 5.6% MoM (target 8%) [↓ from 6.2% last month]
Churn: 2.1% (target 2%) [↑ from 1.8%]
Burn: £45K/month (budget £40K) [↑ from £40K]
Runway: 15 months [↓ from 16 months]

Highlights:
- Closed 3 enterprise deals this month (£45K ACV each)
- Completed product release (new reporting feature)
- Hired 2 engineers (on schedule)

Challenges:
- 1 large customer at risk (negotiating terms)
- Growth slowing (marketing campaign underperformed)
- Churn uptick (investigating, likely seasonal)

Forecast:
Month end: £100K MRR expected (catching up from slower start)
Q2: £130K MRR target (30% quarterly growth)

**Quarterly Deep Dive**

Every quarter, provide detailed financials (P&L, cash flow, balance sheet) and analysis:

1. P&L statement
   - Revenue by segment
   - COGS, gross profit, gross margin
   - Operating expenses by department
   - Operating income
   - Path to profitability timeline

2. Cash flow statement
   - Operating cash flow
   - Free cash flow (after capex)
   - Uses of cash (headcount, spend increases, etc.)

3. Balance sheet
   - Cash, AR, other assets
   - Deferred revenue, debt, other liabilities
   - Equity

4. Variance analysis
   - Revenue vs forecast (did we hit plan? why/why not?)
   - Expenses vs budget (over/under budget? why?)
   - Cash impact (what drove cash change?)

5. Unit economics analysis
   - CAC trend (are we acquiring more/less efficiently?)
   - LTV/CAC ratio (is unit economics healthy?)
   - Cohort analysis (which customer cohort is most profitable?)

**Annual Audited Financials**

If raised institutional capital (Series A+), provide annual audited financials:

1. Auditor's opinion
   - Are financials fairly presented?
   - Are there going concern issues? (can company continue?)

2. Full P&L, balance sheet, cash flow for year and comparison to prior year

3. Notes to financial statements
   - Revenue recognition policy (ASC 606 compliance)
   - Deferred revenue detail
   - Debt terms
   - Equity structure (cap table)
   - Contingencies or litigation

4. Management's discussion and analysis (MD&A)
   - Overview of year
   - Results analysis
   - Financial position
   - Liquidity and capital resources
   - Critical accounting policies

This is submitted to audit firm and provided to all investors (typically 90 days after year-end).

**Investor Conference Calls**

For larger rounds or mature companies:

Quarterly call with all investors:
- Present quarterly dashboard (5 minutes)
- Present detailed results (10 minutes)
- Q&A (30 minutes)

Use slides:
Slide 1: Quarterly highlights
Slide 2: Dashboard metrics
Slide 3: Revenue growth chart
Slide 4: Unit economics update
Slide 5: Cash and runway
Slide 6: Strategic focus for next quarter

Keep calls concise (1 hour max, most investors have other calls).

**Red Flags Investors Watch For**

Certain trends trigger immediate investor concern:

1. Growth slowing rapidly
   - 8% → 5% → 2% = Red flag (growth cliff)
   - Requires explanation and mitigation plan

2. Churn increasing
   - 2% → 3% → 4% = Red flag (retention problem)
   - Indicates customer dissatisfaction

3. CAC increasing
   - £4K → £5K → £6K = Red flag (acquisition efficiency declining)
   - Either customer willingness declining or spend increasing

4. Cash runway declining
   - Approaching <6 months = Red flag (must fundraise soon)
   - Creates pressure on valuation

5. Forecast misses
   - Consistently missing revenue/burn targets = Red flag (poor planning/execution)
   - Investors lose confidence in CEO

If these trends appear, address them head-on in reports:
- "Churn increased to 3% because [reason]. We're addressing it by [action], and expect to return to 2% by [date]."

This shows awareness and plan, which investors prefer.

**Tools for Dashboards**

Common tools for investor reporting:

1. Spreadsheet (Google Sheets, Excel)
   - Simple, flexible
   - Manual updates (slower)

2. BI tools (Tableau, Looker, Mode)
   - Automated, real-time
   - More setup

3. Investor reporting platforms (Carta, Visible, Lattice)
   - Designed for investor communication
   - Includes cap table, documents, etc.

Most early-stage companies use spreadsheet (simple). Grow into BI tools as scale.

Bottom line: Consistent monthly reporting builds trust with investors. Missing reports or inconsistent metrics destroy credibility.
`
      },
      {
        heading: "Communicating Challenges and Course Corrections",
        body: `How to communicate when things go wrong.

**The Bad News First Principle**

If you're missing targets, don't hide it. Report it upfront:

Bad: Dashboard looks good, but in the narrative you mention "some churn pressure"
Good: Dashboard prominently shows churn 2.5% vs 2% target, narrative explains why and action plan

Investors respect honesty. They dislike surprises.

**Example: Communicating a Challenge**

Scenario: Churn increased 1% (from 2% to 3%), slowing growth

Month 1 report:

Dashboard: Churn 2% (normal, no mention of issue)
Problem: Next month, churn is actually 3%, surprises investor

Month 2 report: "Churn increased to 3%"
Investor reaction: Why didn't you mention this last month?

Better approach (Month 1):

Dashboard: Churn 2% (show it stable)
Narrative: "Monitoring: One large customer at risk (represents 0.5% of potential churn). We're in remediation conversations. Expect 2.2% churn next month, improving to 2% by month 3 if resolved."

Investor reaction: Good, you're aware and addressing it.

**Course Correction Communication**

If you need to adjust strategy, communicate clearly:

Before: "We planned to hire 10 salespeople. Growth is slowing, so we're cutting hiring to 3 salespeople."

Better: "We planned to hire 10 salespeople based on forecast of 8% MoM growth. Growth is trending 5% (3% miss). We're investigating root cause: [reason 1], [reason 2]. Action plan: [mitigation 1], [mitigation 2]. We're adjusting hiring to 5 people (not 3, still investing) while we address growth issue. Expect to return to 8% growth by Q2."

This shows:
- You understand the problem
- You have analysis (why it happened)
- You have action plan (not just cutting)
- You have timeline (when you'll recover)

**Transparency vs Oversharing**

Share metrics and progress. Don't overshare internal debate.

Share: "Churn increased because customer support response time degraded. We're hiring 2 support engineers to fix it."

Don't: "We had argument about whether to hire support people or sales people. Sales team wanted sales, support team wanted support. We're going with support."

Share: "We missed revenue target due to longer sales cycles. We're shortening implementation cycle from 6 weeks to 4 weeks to improve close rate."

Don't: "Our sales team isn't performing. We think we need better people."

**Frequency of Communication**

Regular communication > surprises

Monthly dashboard: Expected
Quarterly calls: Expected
Annual audits: Expected

Surprise investor email: "We need to cut headcount" → Red flag

Better: Monthly dashboard shows burn increasing, narrative says "we're evaluating headcount changes to improve efficiency" → January quarter call announces "we're optimizing headcount, reducing by 10%"

This gradual communication is less jarring.

**Handling the Bad News Call**

Sometimes you need to call investors with bad news (major customer churn, product crisis, etc.):

Good structure:

1. Acknowledge problem
   - "We had a significant customer churn event yesterday"

2. Explain what happened
   - "Large customer (£X ARR, Y% of revenue) indicated they're switching to competitor"

3. Impact
   - "This reduces Q2 revenue forecast by £X, impact timeline is [when they leave]"

4. Why it happened
   - "Customer wasn't satisfied with product feature X, competitor has better solution"

5. Your response
   - "We're developing feature X improvement (timeline: Z), reaching out to similar customers to assess satisfaction"

6. Larger implications
   - "Indicates gap in product roadmap. We're reprioritizing to address"

This turns crisis into learning opportunity.

**Annual Review with Investors**

Once per year, do detailed review:

1. Performance vs plan (did you hit targets?)
2. What went well (wins, breakthroughs)
3. What didn't work (misses, challenges)
4. Lessons learned
5. Plan for next year (roadmap, targets)

This builds long-term relationship and trust with investors.

Example:

"2024 Plan was: £1M ARR, 40% growth, 35 headcount, £2M cash burn
2024 Actual: £950K ARR (95% of plan), 35% growth (missed by 5%), 38 headcount (above plan, due to hiring more engineers for product), £2.2M burn (above budget due to headcount)

What went well:
- Retention improved (churn 2.5% → 2%)
- Product development on track
- Customer satisfaction (NPS increased to 55)

What didn't work:
- Sales hiring (only filled 3 of 5 planned roles, market was tight)
- Marketing efficiency (CAC increased 15% due to higher ad costs)

Lessons learned:
- Sales hiring in competitive market requires higher comp/longer recruitment
- Need to focus on organic/word-of-mouth growth (lower CAC)

2025 Plan:
- £1.4M ARR (48% growth)
- Churn <2%, NRR >110%
- 50 headcount (focus on sales+marketing)
- Path to cash flow positive in Q4"

This is transparent, honest, and forward-looking.
`
      }
    ],
    relatedSlugs: [
      "board-reporting-investor-communications",
      "financial-forecasting-modeling",
      "saas-benchmarking-peer-comparison",
      "metrics-dashboard-design-kpi-tracking",
      "funding-and-investment-strategy"
    ],
    faq: [
      {
        q: "What metrics should be on an investor dashboard?",
        a: "Core: MRR/ARR, growth %, churn, NRR, CAC, LTV, LTV/CAC ratio, burn rate, cash runway, headcount. Optional: gross margin, operating margin, customer count, revenue per employee. One-page summary, updated monthly. Show trends (is metric improving/declining?) and comparison to targets."
      },
      {
        q: "How often should I report to investors?",
        a: "Monthly one-page dashboard (standard), quarterly detailed financials, annual audited (if institutional investors). Monthly consistency builds trust. Missing reports or sporadic updates damage credibility. Send by 5th of following month so data is fresh."
      },
      {
        q: "What should I do if I'm missing targets?",
        a: "Report it honestly and early. Don't hide it and hope it improves. Explain why you missed (root cause), what you're doing about it (action plan), when you expect to recover (timeline). Investors respect honesty more than perfect metrics. Surprises destroy trust."
      },
      {
        q: "How do I present challenges to investors without causing panic?",
        a: "Acknowledge problem, explain cause, present solution. Example: 'Churn increased 1% due to [reason]. We're addressing by [action]. Expect to return to target by [date].' Shows awareness and control. Avoid oversharing internal drama. Focus on facts and forward-looking action."
      }
    ],
    videoUrl: ""
  }
];

export default batch125Articles;
