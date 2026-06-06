import { AcademyArticle } from "@/types/academy";

export const batch140Articles: AcademyArticle[] = [
  {
    slug: "board-reports-and-financial-statements",
    title: "Board Reports and Financial Statements: Building Trust and Transparency with Stakeholders",
    description: "Master board reporting. Create clear P&L statements, cash flow reports, and metrics dashboards that tell a compelling story to investors and board members.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "board reporting",
      "financial statements",
      "income statement",
      "P&L statement",
      "cash flow statement",
      "balance sheet",
      "investor reporting",
      "monthly updates",
      "financial transparency",
      "metrics dashboard"
    ],
    keyTakeaways: [
      "Monthly board package: (1) P&L summary (revenue, costs, net income), (2) SaaS metrics dashboard (MRR, growth, churn, CAC, LTV), (3) Cash flow statement (cash in, cash out, runway), (4) Narrative (what happened, why, impact on business). Pages: 5-10. Time: CFO/CEO 2-3 hours/month to produce.",
      "P&L structure for SaaS: Revenue (from subscriptions, support, etc.) - Cost of Goods Sold (hosting, support staff) = Gross Profit → Operating Expenses (sales, marketing, G&A, product dev) = Operating Income → Financing costs, taxes = Net Income. Example: £1M revenue - £200K COGS = £800K gross margin (80%) - £600K opex = £200K operating income (20% margin).",
      "Red flag metrics in board reports: (1) Churn >3% monthly (unsustainable), (2) CAC payback >12 months (too long), (3) Cash runway <12 months (raise now), (4) Negative operating leverage (opex growing faster than revenue). Always highlight improvements to these metrics (board cares about trends, not absolutes)."
    ],
    content: [
      {
        heading: "The Monthly Board Package Structure",
        body: `What to include in monthly reporting to investors and board.

**Components of Monthly Board Package**

Typical structure (5-10 pages):

Page 1: Executive summary
- Headline (1 sentence): "Strong month: Revenue beat, churn improved, cash runway extended"
- Key metrics (3-5): MRR £130K (+4% MoM), Churn 2.3% (improved from 2.8%), CAC £4.2K (reduced from £4.5K), Runway 22mo
- Visual: Simple dashboard showing key metrics

Page 2: P&L statement
- Revenue breakdown
- Cost breakdown
- Net income / margin
- Comparison to forecast

Page 3: SaaS metrics dashboard
- MRR, growth, ARR, customers
- Churn, NRR, retention curves
- CAC, LTV, payback, LTV/CAC ratio
- Historical trends (3-6 months)

Page 4: Cash flow statement
- Beginning cash balance
- Cash in (revenue, funding)
- Cash out (expenses)
- Ending cash balance / runway

Page 5: Narrative summary
- What happened this month
- Why key metrics moved (positive and negative)
- Upcoming priorities
- Risks and mitigations

**Frequency and Timing**

Timing: Board meeting frequency
- Monthly board meetings: Send report 2 days before meeting (allows review)
- Quarterly board meetings: Send at meeting, present findings
- Annual planning: Comprehensive financial review, forecast for next year

Monthly investor updates (even if no board):
- Email update sent monthly (transparency)
- Quick summary format (2-3 slides)
- Key metrics + narrative + challenges

Most healthy SaaS: Monthly board meetings and investor updates.

**Executive Summary Format**

One-page summary covering:

Headline: (1 sentence capturing month's story)
"Strong execution: Revenue beat 12% vs forecast, churn improved, path to profitability on track"

Key metrics (table format):

| Metric | Current | Last month | YTD | Target |
|--------|---------|------------|-----|--------|
| MRR | £130K | £125K | £128K avg | £135K |
| Growth | 4% | 3% | 3.8% | 5% |
| Churn | 2.3% | 2.8% | 2.6% | 2.0% |
| NRR | 106% | 104% | 105% | 110% |
| CAC | £4.2K | £4.5K | £4.4K | £4.0K |
| Runway | 22mo | 20mo | — | 18mo+ |

Visual: Simple chart showing:
- MRR trend (chart showing growth)
- Churn trend (chart showing improvement)
- Runway trend (chart showing months runway)

**Key Insights Box**

3-5 key points from the month:

1. Revenue: Beat forecast by 12% (£130K actual vs £116K forecast)
   - Reason: Larger-than-expected mid-market customer acquisition (3 customers vs forecast 2)
   - Impact: +£14K MRR above plan

2. Churn: Improved to 2.3% from 2.8% last month
   - Reason: CS program launch improving retention
   - Impact: NRR improved to 106%

3. CAC: Down to £4.2K from £4.5K (improving)
   - Reason: Organic/referral channel growing (£2K CAC) vs paid ads (£6K CAC)
   - Impact: Better unit economics, can accelerate growth

4. Runway: Extended to 22 months from 20 months
   - Reason: Better revenue + controlled burn
   - Impact: No fundraising pressure, focus on growth

5. Risks: Churn still above 2% target
   - Mitigation: CS program ramping up, expect 1.8% by Q2
   - Impact: Monitor weekly, escalate if reverts

**Who Should Receive**

Monthly board package recipients:

- Board members (all)
- Investors (all)
- Internal team (optional, but builds transparency)

Some SaaS send to all employees (radical transparency, builds alignment).

`
      },
      {
        heading: "P&L Statement Structure for SaaS",
        body: `How to present income statement in clear, understandable format.

**P&L Format (Simplified)**

| Line item | Month | YTD | YoY | % Revenue |
|-----------|-------|-----|-----|-----------|
| **Revenue** | £130K | £1.2M | £600K | 100% |
| Hosting costs | (£20K) | (£180K) | (£80K) | -15% |
| Support staff | (£25K) | (£220K) | (£100K) | -19% |
| **Gross profit** | £85K | £800K | £420K | 65% |
| **Operating expenses** | | | | |
| Sales & Marketing | (£45K) | (£420K) | (£200K) | -35% |
| Engineering | (£35K) | (£320K) | (£150K) | -27% |
| G&A (finance, admin) | (£12K) | (£110K) | (£50K) | -9% |
| **Operating income** | (£7K) | (£50K) | £20K | -4% |
| Financing costs | (£2K) | (£15K) | (£5K) | -1% |
| **Net income** | (£9K) | (£65K) | £15K | -5% |
| Net margin | -7% | -5% | 2.5% | — |

**Key Lines to Call Out**

Gross margin:
- SaaS target: 70-85%
- This company: 65% (lower than target)
- Reason: High support costs (growing team)
- Action: Automate support, reduce costs

Operating margin:
- Current: -4% (unprofitable)
- Target (6 months): 5% (profitability path)
- Path: Reduce S&M (more efficient), grow revenue

Burn rate:
- Monthly: £9K net loss
- Runway: 22 months with £200K cash
- Target: Profitability within 12 months

**Variance Analysis (Forecast vs Actual)**

Show how actual compares to forecast:

| Line item | Forecast | Actual | Variance | % |
|-----------|----------|--------|----------|----|
| Revenue | £116K | £130K | +£14K | +12% ✓ |
| COGS | (£42K) | (£45K) | (£3K) | -7% |
| Gross profit | £74K | £85K | +£11K | +15% ✓ |
| S&M | (£50K) | (£45K) | +£5K | +10% ✓ |
| Eng | (£38K) | (£35K) | +£3K | +8% ✓ |
| G&A | (£12K) | (£12K) | — | 0% |
| Operating income | (£26K) | (£9K) | +£17K | +65% ✓ |
| Net income | (£28K) | (£9K) | +£19K | +68% ✓ |

Narrative: Strong month vs forecast. Revenue beat from larger deals. Costs below forecast (S&M, Eng). Results in £19K better net income than expected. On track for profitability in Q2.

**Comparing to Historical**

Show trends over 6-12 months:

| Month | Revenue | Gross Margin | OpEx | Op Margin | Net Margin | Runway |
|-------|---------|--------------|------|-----------|------------|--------|
| Aug | £90K | 60% | £105K | -17% | -19% | 25mo |
| Sep | £100K | 62% | £100K | -11% | -13% | 24mo |
| Oct | £110K | 63% | £95K | -5% | -8% | 23mo |
| Nov | £120K | 64% | £92K | 2% | -2% | 22mo |
| Dec | £130K | 65% | £88K | 4% | -5% | 22mo |

Trend: Revenue +44% (Aug to Dec), gross margin improving, opex declining %, profitability improving path.

**Gross Margin Component Breakdown**

Show what's driving COGS:

| Component | Cost | % of Revenue |
|-----------|------|--------------|
| Hosting/infrastructure | £10K | 8% |
| Support team | £15K | 11% |
| Credit card fees | £3K | 2% |
| Other | £2K | 1.5% |
| **Total COGS** | **£30K** | **23%** |
| **Gross margin** | **£100K** | **77%** |

Commentary: Hosting flat (good scale). Support team cost growing (hiring), but efficiency improving (support tickets per team member up). Credit card fees stable.

`
      },
      {
        heading: "Cash Flow Statement and Runway Analysis",
        body: `Show where cash is coming and going.

**Cash Flow Statement Format**

| Category | Month | YTD | Comments |
|----------|-------|-----|----------|
| **Operating cash** | | | |
| Cash revenue received | £125K | £1.1M | Slightly behind accrual (customers paying net-30) |
| Operating expenses paid | (£88K) | (£820K) | On budget |
| **Operating cash flow** | £37K | £280K | Positive, good sign |
| **Investing cash** | | | |
| Equipment / software | (£5K) | (£40K) | Development tools, laptops |
| **Investing cash flow** | (£5K) | (£40K) | Minimal |
| **Financing cash** | | | |
| Loan repayment | (£3K) | (£30K) | Debt service |
| **Financing cash flow** | (£3K) | (£30K) | Manageable |
| **Net cash change** | £29K | £210K | Cash balance growing |
| Beginning cash balance | £600K | £390K | |
| **Ending cash balance** | **£629K** | **£600K** | **Healthy** |

**Runway Calculation**

Runway = Cash balance / Monthly burn rate

Burn rate = Operating cash outflow - Operating cash inflow

Example:

Cash balance: £629K
Monthly burn: £51K (operating opex of £88K - revenue received £125K = -£37K, but adjust for non-cash items)

Actual monthly burn (cash basis): £20K (after accounting for prepaid expenses, deferred revenue timing)

Runway: £629K / £20K = 31 months (not 22 months as stated in summary)

Adjust for growth:
- If burn increasing 5% per month (growth in team)
- Runway calculation more complex

Conservative runway: Assume 10% burn growth
- Months 1-6: £20K/month = £120K
- Months 7-12: £22K/month = £132K
- Months 13-18: £24K/month = £144K
- Total: £396K (5 months of growing burn)

Remaining: £629K - £396K = £233K (12 months more)

Total runway: 18-24 months (depending on growth trajectory)

**Runway Scenarios**

Build three scenarios:

Base case (80% probability):
- Revenue growth 5% monthly
- OpEx growth 5% monthly
- Runway: 24 months
- Path to profitability: Month 18

Bull case (10% probability):
- Revenue growth 8% monthly
- OpEx growth 3% monthly
- Runway: 36 months
- Path to profitability: Month 12

Bear case (10% probability):
- Revenue growth 2% monthly
- OpEx growth 5% monthly
- Runway: 12 months
- Action: Raise capital urgently

Share all three with board (transparency on risks).

**Cash Conversion Cycle**

Days Sales Outstanding (DSO): Days to collect payment
- Example: £130K MRR, customers on net-30 terms = 30 DSO (typical)

Days Inventory Outstanding (DIO): N/A for SaaS

Days Payable Outstanding (DPO): Days before paying suppliers
- Example: £30K COGS, suppliers on net-30 = 30 DPO

CCC = DSO + DIO - DPO = 30 + 0 - 30 = 0 (ideal, no working capital needed)

Monitor CCC:
- If DSO increasing: Collections slowing (red flag)
- If DPO increasing: Paying suppliers slower (good for cash, risk relationships)

**Cash Reserves by Scenario**

Project 12 months forward:

| Month | Revenue | Burn | Cash | Runway |
|-------|---------|------|------|--------|
| Current | £130K | £20K | £629K | 31mo |
| +3mo | £142K | £22K | £747K | 34mo |
| +6mo | £156K | £24K | £870K | 36mo |
| +9mo | £171K | £26K | £996K | 38mo |
| +12mo | £187K | £28K | £1.1M | 39mo |

Trend: Runway extending (good). But assumes growth continues. Baseline: 31 months.

`
      },
      {
        heading: "SaaS Metrics Dashboard for Investors",
        body: `Key metrics board members care about.

**Core Metrics Table**

| Metric | Current | Last 3mo | Target | YoY |
|--------|---------|----------|--------|-----|
| **Customers** | 850 | 820 | 950 | +42% |
| **MRR** | £130K | £125K | £150K | +47% |
| **ARR** | £1.56M | £1.5M | £1.8M | +47% |
| **Growth rate (MoM)** | 4% | 3.5% | 5% | — |
| **Churn (monthly)** | 2.3% | 2.6% | 2.0% | -0.5pp |
| **NRR** | 106% | 104% | 110% | +6pp |
| **CAC** | £4.2K | £4.4K | £4.0K | -14% |
| **LTV** | £118K | £116K | £130K | +18% |
| **LTV/CAC** | 28x | 26x | 32x | +8% |
| **Payback (months)** | 5.1 | 5.3 | 4.8 | -0.2mo |
| **Gross margin** | 77% | 76% | 80% | +3pp |
| **Operating margin** | 4% | -2% | 15% | +6pp |
| **Cash runway** | 31mo | 28mo | 24mo+ | — |

Green for improving metrics, red for declining.

**Narrative by Metric**

Customers:
- 850 current, +30 net add this month (+3.7%)
- New: 35 customers (+2.4% growth)
- Churn: 5 customers (-2.3% churn)
- Net: +30 (healthy growth)

MRR:
- £130K, +5K vs last month (+4% growth)
- New customer: £2K (acquisitions)
- Expansion: £2K (upsells, NRR benefit)
- Churn: -£1K
- Net: +£3K → but £5K total (net effect £2K from new revenue recognitions)

Churn:
- 2.3% monthly, down from 2.8% last month
- Reason: CS program impact, retention improving
- Path: Target 2.0% by Q2
- Risk: Still above 2% target

CAC:
- £4.2K, down from £4.5K
- Reason: Organic/referral growing (cheaper channel)
- Impact: Better unit economics, accelerating growth
- Strategy: Double down on referral program

LTV/CAC:
- 28x ratio (excellent, >10x healthy)
- Implies: Every £1 CAC generates £28 lifetime value
- Allows: Aggressive growth investment

**Waterfall Chart**

Show MRR change graphically:

Previous month: £125K
- New customers: +£2K
- Expansion revenue: +£2K
- Churn: -£1K
- Contraction: -£0.5K
Current month: £128.5K

(Simplified, actual £130K includes rounding)

Visual: Waterfall showing bars for each component, easy to see growth drivers.

**Highlights and Challenges Box**

Monthly narrative:

Highlights:
- Revenue beat forecast by 12%
- Churn improved 50bps (CS program working)
- CAC declining (organic growth scaling)

Challenges:
- Churn still above 2% target (working on it)
- OpEx growing 8% (hiring, needed to scale)
- Gross margin pressure from support costs (optimizing)

Mitigations:
- CS program on track, expect 1.8% churn by Q2
- Head count plan balanced with revenue growth
- Support automation rollout planned (expect 5pp margin improvement)

**Forward-Looking Metrics**

Forecast next quarter:

Q2 forecast (3 months ahead):
- MRR: £145K (12% growth from current £130K)
- Customers: 920 (+70, +8%)
- Churn: 2.1% (improving)
- CAC: £4.0K (continued efficiency)
- Runway: 33 months (improving)

Confidence level: 80% (based on pipeline, growth trajectory)

This gives board visibility into planned business.

**Red Flags to Highlight**

Always call out problems early:

- Churn inflection: "Churn ticked up to 2.5%, investigating customer interviews"
- Revenue miss: "MRR missed by £5K, one deal slipped to next month"
- Burn acceleration: "OpEx grew 15% vs expected 8%, due to unplanned hires"
- Customer concentration: "Top 5 customers now 35% of revenue, diversifying"
- Runway compression: "With this burn rate, runway now 18mo, fundraising in Q1"

Early visibility helps board help you (investors can make intros, advise, etc.).

`
      }
    ],
    relatedSlugs: [
      "financial-forecasting-modeling",
      "burn-rate-and-cash-runway-analysis",
      "funding-strategy-and-investor-relations",
      "p-l-statement-architecture-profitability",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What should be in a monthly board package?",
        a: "Must-haves: (1) Executive summary (headline metrics), (2) P&L statement (revenue, costs, margin), (3) SaaS metrics dashboard (MRR, growth, churn, CAC, LTV), (4) Cash flow and runway, (5) Narrative (what happened, why, risks). Optional: Cohort analysis, customer stories, market updates. Length: 5-10 pages. Time: CFO 2-3 hours/month."
      },
      {
        q: "How do I calculate cash runway accurately?",
        a: "Formula: Cash balance ÷ Monthly burn rate = months of runway. Burn rate = Operating expenses - Operating cash revenue. Example: £600K cash ÷ £20K monthly burn = 30 months. Account for growth: If burn increasing 5%/month, runway less. Conservative estimate: Assume 10% burn growth. Update monthly. Target: 12+ months (healthy), <6 months (raise capital soon)."
      },
      {
        q: "What SaaS metrics does the board care most about?",
        a: "Top 5: (1) MRR and growth rate (shows traction), (2) Churn (unsustainable if >3%), (3) CAC and payback (shows unit economics), (4) Runway (shows how long before raise), (5) Path to profitability (when positive cash flow?). Track these monthly. Celebrate improvements, explain declines. Board evaluates: Is company healthy? Do we need to intervene?"
      },
      {
        q: "How should I present bad news to the board?",
        a: "Be early, be honest, bring solutions. Example: \"We missed MRR target by £8K this month due to one customer delay. We've adjusted forecast, expect recovery next month. Mitigations: Two backup deals closing week 1.\" Board prefers surprises communicated early. Red flags: Hiding bad news, surprises at meeting, inconsistent metrics (CFO loses credibility)."
      }
    ],
    videoUrl: ""
  }
];

export default batch140Articles;
