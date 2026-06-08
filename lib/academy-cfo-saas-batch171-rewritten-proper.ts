import { AcademyArticle } from "@/types/academy";

export const batch171Articles: AcademyArticle[] = [
  {
    slug: "board-reports-and-financial-statements",
    title: "Board Reports and Financial Statements: Communicating Financial Health",
    description: "Master board reporting. Prepare financial statements, communicate performance, and present metrics that matter to your board.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 8,
    keywords: [
      "board reports",
      "financial statements",
      "quarterly reporting",
      "board presentation",
      "financial statements",
      "P&L",
      "balance sheet",
      "cash flow statement",
      "investor reporting",
      "board communication"
    ],
    keyTakeaways: [
      "Board reporting cadence: Monthly internal reporting (management team), quarterly board meetings (with investors/board members), annual audit (external). Each has different format and depth. Monthly: 5-page dashboard (KPIs, variance, forecast). Quarterly: 15-page deck (results, strategy, risks, ask). Annual: Full financial statements (GAAP/IFRS compliant, audited).",
      "Core financial statements: (1) P&L (revenue, expenses, profit), (2) Balance sheet (assets, liabilities, equity), (3) Cash flow (cash in, cash out, change in balance). Example P&L: £100K revenue - £30K COGS - £40K opex = £30K profit (30% margin). Example: Cash flow different from P&L (revenue invoiced but not collected = positive P&L, negative cash flow). Boards care about both profitability and cash.",
      "Presenting to board: Tell story (narrative, not just numbers). Format: 1) Business summary (what we do, market), 2) Results vs plan (actual vs forecast, variances explained), 3) Key metrics (KPIs, health), 4) Risks and opportunities, 5) Plan forward (next quarter, annual). Avoid: Too many slides (max 20), technical jargon (explain clearly), bad news surprise (communicate early)."
    ],
    content: [
      {
        heading: "Board Meeting Structure and Cadence",
        body: `Planning and running board meetings effectively.

**Board Meeting Frequency**

Typical cadence:
- Monthly: Internal reporting (leadership team review)
- Quarterly: Board meeting (1-2 hours, investors/board members attend)
- Annual: Board meeting + annual audit (full day)

Monthly internal:
- Participants: CEO, CFO, VPs
- Agenda: KPI review, variance analysis, forecast update
- Output: Monthly board package (5-10 pages)
- Format: Dashboard + narrative

Quarterly board:
- Participants: Full board + CEO + CFO + select VPs
- Agenda: Results, strategy, risks, Q&A
- Output: Board deck (15-20 pages) + financials
- Format: Presentation (1.5 hours) + discussion (30 min)

Annual:
- Participants: Full board + leadership team
- Agenda: Year review, strategy, budget, audit review
- Output: Annual financials + 10-K filing (if public)
- Format: Full day meeting

**Board Deck Structure**

Typical board deck outline:

1. Executive Summary (2 pages)
   - Key results (hit targets or not)
   - Major milestones (products launched, partnerships)
   - Outlook (next quarter, on track or adjusting)

2. Financial Performance (3 pages)
   - Revenue vs plan
   - Profitability
   - Unit economics (CAC, LTV, payback)
   - Cash position and runway

3. Key Metrics (2 pages)
   - Growth rate
   - Churn
   - NRR
   - Other KPIs

4. Risks and Opportunities (2 pages)
   - What could go wrong
   - What we're excited about
   - Mitigations

5. Ask (1 page)
   - What do we need from board
   - Feedback requested
   - Next steps

Total: 10-12 pages (concise, readable).

`
      },
      {
        heading: "Financial Statements Basics",
        body: `Understanding P&L, Balance Sheet, and Cash Flow Statement.

**Income Statement (P&L)**

Format:
| Line | Amount |
|------|--------|
| Revenue | £100K |
| Cost of Goods Sold | -£20K |
| **Gross Profit** | **£80K** |
| Operating Expenses | -£50K |
| **Operating Income** | **£30K** |
| Interest and other | -£2K |
| **Pre-tax Income** | **£28K** |
| Taxes | -£6K |
| **Net Income** | **£22K** |

Margins:
- Gross margin: £80K / £100K = 80%
- Operating margin: £30K / £100K = 30%
- Net margin: £22K / £100K = 22%

**Balance Sheet**

Assets = Liabilities + Equity

| Assets | Amount |
|--------|--------|
| Cash | £50K |
| Accounts Receivable | £30K |
| Equipment | £20K |
| **Total Assets** | **£100K** |

| Liabilities | Amount |
|-------------|--------|
| Accounts Payable | £20K |
| Debt | £30K |
| **Total Liabilities** | **£50K** |

| Equity | Amount |
|--------|--------|
| Common Stock | £40K |
| Retained Earnings | £10K |
| **Total Equity** | **£50K** |

**Cash Flow Statement**

| Section | Amount |
|---------|--------|
| Operating cash flow | £25K |
| Investing cash flow | -£10K |
| Financing cash flow | £5K |
| **Net change in cash** | **£20K** |

Key insight: £22K net income but only £25K operating cash (not same because of timing).

`
      },
      {
        heading: "Preparing Financial Statements",
        body: `Accurate and timely financial reporting.

**Accounting Standards**

US: GAAP (Generally Accepted Accounting Principles)
UK/International: IFRS (International Financial Reporting Standards)

Both acceptable, choose one and stick with it.

Key differences:
- Revenue recognition (when to record revenue)
- Depreciation (how to spread asset costs)
- Inventory valuation (how to value stock)

Most startups: Use accrual accounting (GAAP/IFRS compliant).

**Monthly Close Process**

Timeline: Complete by 5th of following month

1. Collect transactions (week 1)
   - All invoices recorded
   - All expenses coded
   - All receipts filed

2. Reconciliations (week 2)
   - Bank reconciliation (match bank to books)
   - AP/AR aging (verify what's owed/owe)
   - Inventory count (if applicable)

3. Adjustments (week 2-3)
   - Accruals (accrue expenses)
   - Depreciation (monthly depreciation)
   - Revenue adjustments (returns, discounts)

4. Financial statements (week 3-4)
   - Generate P&L, Balance Sheet, Cash Flow
   - Review for accuracy
   - Prepare notes

5. Analysis and narrative (week 4)
   - Variance analysis
   - Forecast update
   - Commentary

**Audit and Controls**

Internal controls:
- Segregation of duties (one person approves, another pays)
- Approval limits (CFO approves <£10K, CEO approves >£10K)
- Reconciliations (monthly bank rec, AR/AP aging)

External audit (if raising capital or required):
- Annual audit by external auditor
- Tests financial statements for accuracy
- Issues audit opinion (unqualified = clean, qualified = issues)
- Cost: £20-50K typically

`
      },
      {
        heading: "Presenting Performance to Board",
        body: `Communicating results and strategy effectively.

**Narrative Structure**

Don't just present numbers. Tell a story:

1. Context
   - What we're building and why
   - Market opportunity

2. Results
   - Actual vs plan (on track or adjusted)
   - Key achievements this quarter

3. Trends
   - Are we improving or declining
   - Benchmarked to peers

4. Risks
   - What could go wrong
   - How we're mitigating

5. Outlook
   - Next quarter / year plan
   - Path to profitability (if not yet)

Example narrative:

"We're building project management for agencies. £50M market opportunity, 10K agencies in UK, underserved by generic tools.

Q3 results:
- MRR £120K (target £110K, +9% vs target) ✓
- Churn 2.3% (target 2%, -0.3% worse) ✗
- Gross margin 78% (target 75%, +3% better) ✓
- Runway 14 months (target 18, -4 months worse)

Trend: Growth accelerating (25% MoM), churn creeping up (investigate), burn increasing (hiring spree Q3).

Risks: Churn increasing (need to address), cash runway shortening (may need funding Q1). Opportunity: Large customer (£50K deal) in late stage, would solve runway issue.

Next quarter: Focus on churn (improve to 2%), close large deal (£50K), reduce burn (hiring freeze). Path to profitability: Month 12 (plan)."

(Clear story, addresses concerns, provides direction)

`
      }
    ],
    relatedSlugs: [
      "p-l-statement-architecture-profitability",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "burn-rate-and-cash-runway-analysis",
      "quarterly-business-reviews-and-planning"
    ],
    faq: [
      {
        q: "What should I include in a board presentation?",
        a: "Executive summary (key results), financial performance (revenue, margins, unit economics), KPIs (growth, churn, CAC, LTV), risks and opportunities, and an ask. 10-15 pages maximum. Tell a story: context → results → trends → risks → outlook. Numbers without narrative are boring and confusing."
      },
      {
        q: "What financial statements do I need?",
        a: "Three core statements: (1) P&L (revenue - expenses = profit), (2) Balance Sheet (assets = liabilities + equity), (3) Cash Flow (where cash came from and went). Prepare monthly for internal management, quarterly for board/investors."
      },
      {
        q: "How do I explain variances to the board?",
        a: "Don't hide misses. Explain root causes: \"We missed revenue target by £10K because sales cycle extended 2 months (3 deals pushed to Q4).\" Quantify impact: \"Impact: £10K revenue miss, but Q4 pipeline strong (£200K in late stage).\" Show recovery plan: \"Q4 target adjusted to £115K (realistic), then Q1 acceleration to £140K.\""
      },
      {
        q: "What's the difference between profit and cash?",
        a: "Profit (P&L): Revenue minus expenses (accrual basis). Cash flow: Actual cash in and out. Example: £100K revenue invoiced but not paid = profit +£100K, cash flow £0. Boards care about both. Show both P&L and cash flow statement."
      }
    ],
    videoUrl: ""
  }
];

export default batch171Articles;
