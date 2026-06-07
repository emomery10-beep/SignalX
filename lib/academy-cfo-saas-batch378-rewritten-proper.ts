import { AcademyArticle } from "@/types/academy";

export const batch378Articles: AcademyArticle[] = [
  {
    slug: "saas-budget-planning-and-variance-analysis",
    title: "Budget Planning and Variance Analysis: SaaS Financial Control",
    description: "Master budget planning. Build annual budgets, track variance, and make data-driven resource allocation decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["budget planning", "variance analysis", "financial planning", "FP&A", "resource allocation"],
    keyTakeaways: [
      "Annual budget process: Start 2-3 months before fiscal year. Steps: (1) CEO/board sets top-down targets (revenue, profitability), (2) Department heads submit bottom-up plans, (3) CFO reconciles top-down vs bottom-up gaps, (4) Iterate until aligned (usually 2-3 rounds), (5) Board approves final budget. Example: Board targets £5M ARR (+100%). Sales submits plan needing £2M S&M. Engineering requests £1.5M. Total spend exceeds cash. CFO facilitates trade-offs.",
      "Variance analysis framework: Monthly compare actuals vs budget. Categories: Favourable (spend less or earn more) vs Unfavourable (spend more or earn less). Material threshold: >5% or >£10K variance requires explanation. Example: Revenue £95K vs £100K budget = -5% unfavourable. Investigate: Were fewer deals closed? Smaller deal sizes? Delayed starts? Root cause analysis prevents repeating. Track cumulative YTD variance (not just monthly).",
      "Rolling forecast vs static budget: Static budget set once annually becomes stale. Rolling forecast: Update monthly, always looking 12-18 months ahead. Example: In March, forecast April through next March. Each month, drop the completed month and add one more. Benefits: More accurate planning, faster response to changes. Cost: 2-4 hours CFO time monthly. Best practice: Keep static budget for board accountability, use rolling forecast for operational decisions."
    ],
    content: [
      {
        heading: "Building and Managing SaaS Budgets",
        body: `Creating financial plans that drive growth while maintaining control.

**Annual budget process**

Timeline (for January fiscal year):

October: Planning kickoff
- CEO sets strategic priorities and growth targets
- CFO distributes budget templates to department heads
- Finance team prepares baseline (current run-rate projection)

November: Department submissions
- Each department submits budget request with justification
- Include: Headcount plan, tool/vendor costs, project costs
- CFO consolidates into draft company budget

December: Reconciliation and approval
- Compare bottom-up requests vs top-down targets
- Identify gaps and trade-offs
- 2-3 rounds of revision
- Board approval in December board meeting

January: Execution
- Distribute approved budget to department heads
- Set up tracking and reporting
- Monthly variance review begins

Top-down targets example:

Board sets:
- Revenue target: £5M ARR (from £2.5M, 100% growth)
- Burn target: <£200K/month net burn
- Runway: Maintain 12+ months
- Key hires: VP Sales, 5 engineers, 3 SDRs

These create the envelope for bottom-up plans.

Bottom-up budget template:

Engineering budget request:

| Line item | Q1 | Q2 | Q3 | Q4 | Annual |
|---|---|---|---|---|---|
| Existing team (8) | £160K | £160K | £160K | £160K | £640K |
| New hires (5) | £25K | £75K | £100K | £100K | £300K |
| Cloud infrastructure | £30K | £35K | £40K | £45K | £150K |
| Tools and licences | £10K | £10K | £10K | £10K | £40K |
| Training | £5K | £5K | £5K | £5K | £20K |
| Total engineering | £230K | £285K | £315K | £320K | £1,150K |

Sales & marketing budget request:

| Line item | Q1 | Q2 | Q3 | Q4 | Annual |
|---|---|---|---|---|---|
| Sales team (VP + 3 reps) | £80K | £95K | £95K | £95K | £365K |
| Commissions | £20K | £30K | £40K | £50K | £140K |
| New SDRs (3) | £15K | £35K | £35K | £35K | £120K |
| Marketing team | £40K | £40K | £40K | £40K | £160K |
| Paid advertising | £25K | £30K | £35K | £40K | £130K |
| Events | £10K | £15K | £10K | £15K | £50K |
| Tools (CRM, etc.) | £8K | £8K | £8K | £8K | £32K |
| Total S&M | £198K | £253K | £263K | £283K | £997K |

**Budget reconciliation**

Consolidation:

| Department | Request | Target | Gap |
|---|---|---|---|
| Engineering | £1,150K | £1,000K | +£150K over |
| Sales & marketing | £997K | £900K | +£97K over |
| Customer success | £350K | £300K | +£50K over |
| G&A | £400K | £350K | +£50K over |
| Total OpEx | £2,897K | £2,550K | +£347K over |

Revenue plan: £3,500K (recognised revenue from £5M ARR target)
COGS: -£700K (20% of revenue)
Gross profit: £2,800K
OpEx (requested): -£2,897K
Operating loss: -£97K

vs Target:
OpEx (target): -£2,550K
Operating profit: +£250K

Gap: £347K spending above target

Resolution options:

Option 1: Reduce headcount
- Delay 2 engineering hires to Q3 (save £50K)
- Reduce SDR hires from 3 to 2 (save £40K)
- Total saving: £90K

Option 2: Reduce discretionary spend
- Cut paid advertising 20% (save £26K)
- Reduce events budget 40% (save £20K)
- Defer tool upgrades (save £15K)
- Total saving: £61K

Option 3: Increase revenue target
- If pipeline supports it, increase revenue target £200K
- Requires higher conversion or larger deals

Option 4: Accept higher burn
- If cash supports it (check runway impact)
- Board needs to approve deviation from target

Typically: Combination of options 1-3 to close gap

**Monthly variance analysis**

Variance report template:

| Line item | Budget | Actual | Variance £ | Variance % | Status |
|---|---|---|---|---|---|
| Revenue | £100K | £95K | -£5K | -5% | 🟡 |
| COGS | -£20K | -£19K | +£1K | +5% | 🟢 |
| Gross profit | £80K | £76K | -£4K | -5% | 🟡 |
| Engineering | -£95K | -£92K | +£3K | +3% | 🟢 |
| Sales & marketing | -£85K | -£90K | -£5K | -6% | 🟡 |
| G&A | -£30K | -£28K | +£2K | +7% | 🟢 |
| Total OpEx | -£210K | -£210K | £0 | 0% | 🟢 |
| Operating loss | -£130K | -£134K | -£4K | -3% | 🟡 |

Analysis:

Revenue (-5%): 🟡 Amber
- Root cause: 2 deals slipped to next month (£8K), offset by £3K upsell
- Impact: Revenue timing, not demand issue
- Action: Deals expected to close next month
- Risk: If deals don't close, cumulative gap grows

S&M (+6% over budget): 🟡 Amber
- Root cause: Event sponsorship pulled forward from Q2
- Impact: One-time (Q2 will be under budget)
- Action: No action needed (timing difference)

Year-to-date tracking:

| Metric | YTD budget | YTD actual | YTD variance | Trend |
|---|---|---|---|---|
| Revenue | £300K | £290K | -£10K (-3%) | Improving |
| OpEx | -£630K | -£620K | +£10K (2%) | Stable |
| Net loss | -£390K | -£384K | +£6K (2%) | Positive |
| Cash used | -£390K | -£370K | +£20K | Positive |

**Rolling forecast methodology**

How rolling forecast works:

Static budget: Set in December for full year (Jan-Dec)
Problem: By June, H2 budget is based on 6-month-old assumptions

Rolling forecast: Each month, update the next 12-18 months

Example (in March):

Static budget (set in December):
| Month | Apr | May | Jun | Jul | Aug | Sep |
|---|---|---|---|---|---|---|
| Revenue | £110K | £115K | £120K | £125K | £130K | £135K |

Rolling forecast (updated in March with current data):
| Month | Apr | May | Jun | Jul | Aug | Sep |
|---|---|---|---|---|---|---|
| Revenue | £105K | £112K | £118K | £128K | £135K | £142K |

Changes: April lower (deal slipped), but strong pipeline for Jul+ (enterprise deal expected)

Rolling forecast process:

Monthly update (2-4 hours):
1. Record actuals for completed month
2. Update next 3 months with latest pipeline/data
3. Extend forecast by 1 month
4. Compare to static budget (track variance)
5. Highlight risks and opportunities

What to update:
- Revenue: Based on pipeline and close rates
- Headcount: Based on hiring progress
- Variable costs: Based on actuals run rate
- One-off items: As they become known

Best practice:
- Keep static budget for board accountability (actual vs budget)
- Use rolling forecast for operational decisions (hiring, spending)
- Present both in board meetings ("on plan" for budget, "expect" for forecast)

**Zero-based budgeting**

When to use:
- Company needs to cut costs significantly
- Post-fundraise budget reset
- New fiscal year with major strategic shift

How it works:
- Start every budget line at £0
- Justify every pound of spending from scratch
- Don't assume last year's budget is the baseline

Example:

Traditional approach:
- Last year marketing: £500K
- This year: £500K + 10% = £550K (automatic increase)

Zero-based approach:
- Marketing budget: £0
- Justify each initiative:
  - Content marketing: £80K (drives 30% of leads, proven ROI)
  - Paid search: £120K (CAC of £3K, positive ROI)
  - Events: £50K (networking value, 5 deals attributed last year)
  - Brand campaign: £100K (hard to measure ROI) → Cut or reduce
  - PR agency: £60K (3 press mentions in 6 months) → Cut
  - Total justified: £350K (vs £550K traditional)

Saving: £200K (36% reduction)

**Budget ownership and accountability**

RACI for budget management:

| Activity | CEO | CFO | Dept Head | Finance team |
|---|---|---|---|---|
| Set targets | A | R | I | I |
| Build dept budget | I | C | R/A | S |
| Consolidate | I | R/A | C | S |
| Approve | A | R | I | I |
| Track monthly | I | A | R | R |
| Variance analysis | I | A | R | R |
| Re-forecast | C | A | R | R |

R = Responsible, A = Accountable, C = Consulted, I = Informed, S = Support

Department head accountability:
- Own their budget (not finance's job to manage it)
- Explain variances monthly
- Request approval for budget changes
- Cannot overspend without CEO/CFO approval

Spending authority matrix:

| Spend amount | Approval needed |
|---|---|
| <£1K | Department head |
| £1-5K | Department head + CFO |
| £5-25K | CFO + CEO |
| £25K+ | CEO + Board (if material) |

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "financial-modeling-and-forecasting-techniques", "saas-financial-reporting-and-investor-updates", "operating-expense-management-and-control", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How do I build a SaaS annual budget?", a: "Start 2-3 months before fiscal year. Process: (1) CEO/board sets top-down targets (revenue, burn), (2) Department heads submit bottom-up plans with justification, (3) CFO consolidates and identifies gap (requests usually exceed targets by 10-25%), (4) Iterate trade-offs over 2-3 rounds, (5) Board approves. Include: headcount plan, tool costs, marketing spend. Key: Revenue plan must support expense plan." },
      { q: "How should I do monthly variance analysis?", a: "Compare actuals vs budget for every line item monthly. Flag material variances (>5% or >£10K). For each variance: identify root cause, determine if timing or permanent, state action plan. Track YTD cumulative (monthly variances wash out, YTD shows true trend). Traffic light system: Green (<5%), Amber (5-10%), Red (>10%). Present to leadership monthly." },
      { q: "Should I use rolling forecast or static budget?", a: "Use both. Static budget: Set annually, use for board accountability (actual vs budget). Rolling forecast: Update monthly, always look 12-18 months ahead, use for operational decisions. Rolling forecast takes 2-4 hours monthly but is far more accurate than 6-month-old static budget. Present both in board meetings." }
    ],
    videoUrl: ""
  }
];

export default batch378Articles;
