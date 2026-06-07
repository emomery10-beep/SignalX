import { AcademyArticle } from "@/types/academy";

export const batch400Articles: AcademyArticle[] = [
  {
    slug: "saas-cfo-toolkit-and-monthly-close-process",
    title: "CFO Toolkit and Monthly Close Process: Running SaaS Finance Operations",
    description: "Master the monthly close. Build your CFO toolkit, streamline financial operations, and deliver timely reporting.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["monthly close", "CFO toolkit", "finance operations", "financial close", "reporting cadence"],
    keyTakeaways: [
      "Monthly close process: Target close within 5-10 business days of month end. Steps: (1) Cut off transactions (day 1), (2) Reconcile bank and billing (day 2-3), (3) Post accruals and adjustments (day 3-4), (4) Revenue recognition review (day 4-5), (5) Review and sign off (day 5-7), (6) Generate reports (day 7-8), (7) Distribute to stakeholders (day 8-10). Common bottleneck: Revenue reconciliation (billing system vs accounting). Solution: Automate data flow between Stripe/Chargebee and Xero/NetSuite.",
      "CFO monthly calendar: Week 1: Close books, reconcile, post adjustments. Week 2: Generate reports, variance analysis, update forecast. Week 3: Board prep (if board month), strategic planning, investment decisions. Week 4: Cash management, vendor reviews, team 1:1s. Recurring: Weekly cash check (15 min), weekly CEO sync (30 min), monthly investor update (2 hours), quarterly board meeting (full day prep + meeting). Time allocation: 40% strategic, 30% reporting, 20% operations, 10% team management.",
      "Essential CFO reports: (1) P&L vs budget (monthly), (2) Cash flow statement and forecast (monthly), (3) SaaS KPI dashboard (weekly), (4) ARR bridge / waterfall (monthly), (5) Headcount and payroll report (monthly), (6) AR ageing report (monthly), (7) Runway analysis (monthly). Each report should take <1 hour to produce if systems are set up correctly. If reports take >4 hours each: invest in automation (data pipeline + BI tool). Target: 80% of reporting automated."
    ],
    content: [
      {
        heading: "Running Efficient SaaS Finance Operations",
        body: `Building the operational backbone of the finance function.

**Monthly close process**

Close checklist (10-day close):

Day 1: Cut-off and preparation
- [ ] Lock prior month in accounting system
- [ ] Ensure all invoices are entered
- [ ] Verify payroll is posted
- [ ] Close expense reports for the month
- [ ] Download bank statements

Day 2-3: Reconciliation
- [ ] Bank reconciliation (all accounts)
- [ ] Billing system to accounting reconciliation (Stripe → Xero)
- [ ] Accounts receivable reconciliation
- [ ] Accounts payable reconciliation
- [ ] Intercompany reconciliation (if applicable)

Day 4-5: Adjustments
- [ ] Post accruals (expenses incurred not yet invoiced)
- [ ] Post prepayments (expenses paid in advance, spread)
- [ ] Revenue recognition adjustments (deferred revenue)
- [ ] Depreciation and amortisation
- [ ] FX adjustments (if multi-currency)
- [ ] Stock-based compensation expense

Day 5-7: Review
- [ ] Review P&L (compare to prior month and budget)
- [ ] Review balance sheet (material changes explained)
- [ ] Check for unusual transactions
- [ ] CFO sign-off on financial statements

Day 7-8: Reporting
- [ ] Generate management accounts
- [ ] Update KPI dashboard
- [ ] Prepare variance analysis
- [ ] Update cash flow forecast

Day 8-10: Distribution
- [ ] Send management pack to leadership team
- [ ] Update investor dashboard (if applicable)
- [ ] Prepare monthly investor update
- [ ] File reports in document management system

Reducing close time:

| Improvement | Time saved | How |
|---|---|---|
| Auto-sync billing → accounting | 4 hours | Stripe-Xero integration |
| Automated bank reconciliation | 2 hours | Bank feed + matching rules |
| Template management accounts | 2 hours | Pre-built templates |
| Automated KPI dashboard | 3 hours | BI tool (Metabase) |
| Standardised accruals | 1 hour | Recurring journal templates |
| Total savings | 12 hours | Per monthly close |

Target: 5-day close (top performing companies)

**CFO monthly calendar**

Week 1 (days 1-7): Close and report

| Day | Activity | Time |
|---|---|---|
| Mon | Kick off close process, bank reconciliation | 3 hours |
| Tue | Revenue reconciliation, AR/AP reconciliation | 4 hours |
| Wed | Post adjustments, accruals, depreciation | 3 hours |
| Thu | Review financials, variance analysis | 3 hours |
| Fri | CFO sign-off, generate reports | 2 hours |

Week 2 (days 8-14): Analyse and forecast

| Day | Activity | Time |
|---|---|---|
| Mon | Management accounts distribution | 1 hour |
| Tue | Update rolling forecast | 3 hours |
| Wed | Investor update preparation | 2 hours |
| Thu | Strategic finance work (pricing, M&A, modelling) | 4 hours |
| Fri | CEO sync, department reviews | 2 hours |

Week 3 (days 15-21): Strategy and planning

| Day | Activity | Time |
|---|---|---|
| Mon | Board prep (if board month) / strategic projects | 4 hours |
| Tue | Investment decision analysis | 3 hours |
| Wed | Vendor reviews, contract negotiations | 2 hours |
| Thu | Team 1:1s, HR/comp topics | 2 hours |
| Fri | Cash management, treasury | 1 hour |

Week 4 (days 22-28): Optimise and prepare

| Day | Activity | Time |
|---|---|---|
| Mon | Process improvement projects | 2 hours |
| Tue | Cross-functional meetings (product, sales) | 3 hours |
| Wed | Compliance and controls review | 2 hours |
| Thu | Pre-close preparation (next month) | 1 hour |
| Fri | Week ahead planning, investor calls | 2 hours |

**Essential CFO reports**

Report 1: Management P&L

| Line item | Actual | Budget | Variance | Variance % | Prior month |
|---|---|---|---|---|---|
| Revenue | £420K | £400K | +£20K | +5% | £390K |
| COGS | -£84K | -£80K | -£4K | -5% | -£78K |
| Gross profit | £336K | £320K | +£16K | +5% | £312K |
| Engineering | -£120K | -£115K | -£5K | -4% | -£118K |
| Sales & marketing | -£140K | -£150K | +£10K | +7% | -£135K |
| G&A | -£45K | -£50K | +£5K | +10% | -£44K |
| EBITDA | £31K | £5K | +£26K | +520% | £15K |

Key commentary:
- Revenue ahead of plan (2 enterprise deals closed early)
- S&M under plan (1 hire delayed to next month)
- EBITDA significantly ahead (timing benefit)

Report 2: Cash flow statement

| Category | This month | Last month | YTD |
|---|---|---|---|
| Cash from operations | -£20K | -£35K | -£150K |
| Cash from investing | -£5K | -£10K | -£40K |
| Cash from financing | £0 | £0 | £2,000K |
| Net cash change | -£25K | -£45K | £1,810K |
| Opening cash | £2,025K | £2,070K | £215K |
| Closing cash | £2,000K | £2,025K | £2,000K |
| Runway (months) | 14.3 | 13.5 | - |

Report 3: SaaS KPI dashboard

| Metric | This month | Last month | 3-month avg | Target |
|---|---|---|---|---|
| ARR | £5,040K | £4,800K | £4,700K | £5,000K |
| MRR | £420K | £400K | £392K | £417K |
| New ARR | £300K | £250K | £267K | £250K |
| Expansion ARR | £60K | £50K | £53K | £50K |
| Churned ARR | -£100K | -£80K | -£87K | -£80K |
| Contraction | -£20K | -£20K | -£20K | -£15K |
| Net new ARR | £240K | £200K | £213K | £205K |
| NRR (trailing 12mo) | 112% | 110% | 109% | >110% |
| Gross margin | 80% | 80% | 79.7% | 80% |
| Burn rate | £25K | £45K | £37K | <£50K |
| Runway | 14.3 mo | 13.5 mo | 13.9 mo | >12 mo |

Report 4: ARR waterfall (monthly)

Opening ARR: £4,800K
+ New business: +£300K
+ Expansion: +£60K
- Gross churn: -£100K
- Contraction: -£20K
= Closing ARR: £5,040K

Net new ARR: +£240K (5% monthly growth)

Report 5: Headcount and payroll

| Department | Headcount | Monthly payroll | Avg salary | Open roles |
|---|---|---|---|---|
| Engineering | 18 | £112K | £75K | 2 |
| Sales | 10 | £62K | £55K* | 1 |
| Marketing | 5 | £27K | £52K | 0 |
| Customer success | 7 | £30K | £43K | 1 |
| G&A | 5 | £28K | £56K | 0 |
| Total | 45 | £259K | £60K | 4 |

*Sales base salary (excludes commission)

**Finance technology stack**

Essential tools by function:

| Function | Tool | Cost/month | Critical? |
|---|---|---|---|
| Accounting | Xero / QuickBooks / NetSuite | £30-1K+ | Yes |
| Billing | Stripe / Chargebee / Maxio | £0-500+ | Yes |
| SaaS metrics | ChartMogul / Baremetrics | £100-500 | Yes |
| Expense management | Pleo / Spendesk | £0-200 | High |
| Payroll | PayFit / Gusto | £50-300 | Yes |
| FP&A | Google Sheets → Pigment | £0-2K+ | Medium |
| BI | Metabase / Looker | £0-3K+ | Medium |
| Banking | Revolut Business / Airwallex | £0-50 | Yes |
| Corporate card | Brex / Pleo | £0-100 | High |

Total monthly cost:
- Seed: £200-500/month
- Series A: £500-2K/month
- Series B+: £2-10K/month

Integration is key:
- Stripe → Xero (auto-sync revenue)
- Payroll → Xero (auto-sync salaries)
- Bank → Xero (auto-sync transactions)
- ChartMogul → Dashboard (auto-sync SaaS metrics)

Target: 80% of data flows automatically

**Finance team productivity**

Measuring finance team efficiency:

| Metric | Current | Target | Best-in-class |
|---|---|---|---|
| Close time (days) | 10 | 7 | 5 |
| Reports produced per month | 8 | 8 | 8 |
| Time per report (hours) | 4 | 2 | 1 |
| Automation rate | 40% | 60% | 80% |
| Strategic time (%) | 25% | 40% | 50% |
| Revenue per finance FTE | £2.5M | £3M | £5M |

Improving productivity:

Quick wins (month 1):
- Set up auto bank feeds
- Create report templates
- Implement recurring journals
- Automate billing → accounting sync

Medium term (month 2-3):
- Build KPI dashboard (Metabase)
- Create month-end checklist (shared document)
- Implement expense automation (Pleo)
- Set up data pipeline for reporting

Long term (month 4-6):
- Full BI implementation
- FP&A tool for forecasting
- Automated variance analysis
- Self-serve reporting for departments

**Best practices**

1. Consistency: Same reports, same format, same time every month
2. Accuracy: Better to be slightly late and accurate than fast and wrong
3. Commentary: Numbers without context are useless — explain the why
4. Forward-looking: Reports should inform decisions, not just record history
5. Automation: If you do it manually every month, automate it
6. Audit trail: Document all adjustments and their rationale
7. Continuous improvement: Shave 1 day off close time every quarter

`
      }
    ],
    relatedSlugs: ["saas-financial-reporting-and-investor-updates", "saas-budget-planning-and-variance-analysis", "saas-founder-cfo-relationship-and-finance-function", "metrics-dashboard-design-kpi-tracking", "saas-financial-controls-and-fraud-prevention"],
    faq: [
      { q: "How long should the monthly close take?", a: "Target: 5-10 business days. Steps: Day 1: Transaction cut-off. Day 2-3: Reconciliation (bank, billing, AR/AP). Day 4-5: Adjustments (accruals, revenue recognition, depreciation). Day 5-7: Review and sign-off. Day 7-10: Reporting and distribution. Top companies close in 5 days. Key bottleneck: Revenue reconciliation — automate data flow between Stripe/Chargebee and accounting system. Automation saves ~12 hours per close." },
      { q: "What reports should a SaaS CFO produce monthly?", a: "Essential 7: (1) P&L vs budget with variance analysis, (2) Cash flow statement and forecast, (3) SaaS KPI dashboard (ARR, NRR, churn, margins), (4) ARR bridge/waterfall (new + expansion - churn), (5) Headcount and payroll report, (6) AR ageing report, (7) Runway analysis. Each should take <1 hour to produce with proper automation. Target: 80% of reporting automated. Invest in data pipeline + BI tool if reports take >4 hours each." },
      { q: "How should a SaaS CFO spend their time?", a: "Target allocation: 40% strategic (pricing, M&A, investment decisions, fundraising), 30% reporting (close, analysis, board prep, investor updates), 20% operations (controls, vendor management, compliance), 10% team management. Most CFOs spend too much time on reporting (50-60%). Fix: Automate reporting to shift time to strategic work. Weekly rhythm: Monday cash check (15 min), CEO sync (30 min). Monthly: Close (week 1), analyse/forecast (week 2), strategy (week 3), optimise (week 4)." }
    ],
    videoUrl: ""
  }
];

export default batch400Articles;
