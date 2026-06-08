import { AcademyArticle } from "@/types/academy";

export const batch230Articles: AcademyArticle[] = [
  {
    slug: "cash-flow-management-and-working-capital",
    title: "Cash Flow Management and Working Capital: Keeping the Lights On",
    description: "Master cash flow. Optimize working capital, extend runway, manage cash cycles.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cash flow", "working capital", "cash management", "cash cycle", "runway", "DSO", "DPO", "cash forecasting"],
    keyTakeaways: [
      "Cash flow fundamentals: Operating cash flow = cash in (customer payments, investments) - cash out (salaries, infrastructure, CAC). Runway = cash on hand / monthly burn. Example: £500K cash, £100K/month burn = 5 months runway. Critical: Monitor weekly (not monthly). Forecast: 3-month rolling (account for one-time costs, seasonality). Improve: Increase pricing (more cash in), reduce burn (efficiency), extend payment terms (more cash timing buffer). Real risk: Companies with great unit economics die from cash crisis (don't manage working capital).",
      "Working capital optimization: Cash conversion cycle = DSO (days sales outstanding, time to collect payment) + DIO (days inventory outstanding) + DPO (days payable outstanding). For SaaS: Target DSO 30-45 days (monthly billing), DIO minimal (no inventory), DPO 30-60 days (pay vendors later). Example: Collect £1M customers 40 days late = £1.3M in float (opportunity cost). Improve collection: Incentivize annual billing (upfront cash), offer 1-2% discount (worth it), automate invoicing/reminders, dunning emails for failed payments. Impact: 15-30 day DSO improvement = £100K-500K cash freed up.",
      "Cash forecasting and planning: Build rolling 13-week cash forecast (week-by-week, high detail). Inputs: MRR growth, churn (customer losses), upfront annual deals, payroll (fixed), infrastructure (grow with scale), CAC spend. Stress test: What if churn doubles? Growth slows 50%? Major customer leaves? Plan: If runway drops to 6-9 months, start fundraising (takes 3-6 months). Don't wait until 3 months (too late). Build 18+ month runway buffer (safety, optionality). Tools: Spreadsheet (simple), Lattice, Causal (forecasting automation)."
    ],
    content: [
      {
        heading: "Managing Cash and Working Capital",
        body: `Keeping your company solvent while scaling.

**Cash flow fundamentals**

Cash flow waterfall:
- Starting cash: Balance from prior period
- + Inflows: Customer payments (MRR × customers), investments, debt
- - Outflows: Salaries (payroll), infrastructure (servers, tools), marketing (CAC spend), other (rent, etc.)
- = Ending cash (runway = cash / burn rate)

Example monthly:
| Item | Amount |
|---|---|
| Starting cash | £500K |
| Customer revenue (MRR) | £150K |
| Investment | £0 |
| Salaries | -£80K |
| Infrastructure | -£20K |
| Marketing spend | -£30K |
| Other | -£15K |
| Ending cash | £505K |
| Monthly burn | -£65K |
| Runway | 7.8 months |

**Working capital metrics**

Days Sales Outstanding (DSO):
- Formula: (Accounts receivable / Revenue) × days in period
- Example: £100K AR / (£500K revenue / 30 days) = 6 days
- Target: 30-45 days (monthly billing), 10-15 days (credit card)
- Improve: Invoice faster, incentivize early payment, automate collection

Days Inventory Outstanding (DIO):
- Only relevant for hardware/product SaaS
- Target: Minimal for pure SaaS

Days Payable Outstanding (DPO):
- Formula: (Accounts payable / COGS) × days
- Example: £50K AP / (£100K spend / 30 days) = 15 days
- Target: 30-60 days (negotiate vendor terms)
- Strategy: Pay vendors slower (within terms) = float benefit

Cash Conversion Cycle:
- Formula: DSO + DIO - DPO
- Example: 35 + 0 - 45 = -10 days (positive = they finance you)
- Goal: Negative or <15 days

**13-week cash forecast**

Structure (weekly detail):
| Week | MRR | Churn | Revenue | Payroll | Spend | Net | Cash balance |
|---|---|---|---|---|---|---|---|
| W1 | £150K | -2 customers | £148K | -£20K | -£15K | £113K | £613K |
| W2 | £150K | -1 customer | £149K | -£20K | -£15K | £114K | £727K |
| ... | ... | ... | ... | ... | ... | ... | ... |

Inputs:
- Growth assumptions: MRR growth %, churn rate
- Fixed costs: Payroll (grows with hiring), rent, insurance
- Variable costs: Infrastructure (scales with customers), CAC spend
- One-time: Bonuses, conferences, equipment

Stress tests:
- Downside: Growth 50% lower, churn doubles
- Severe: Major customer leaves (>5% revenue), fundraising fails
- Upside: Grow faster, reduce churn

**Optimization tactics**

Increase inflows:
- Annual billing (collect upfront, £1M annual = immediate cash)
- 1-2% discount for annual (worth it for cash)
- Raise prices (more cash per customer)
- Accelerate revenue (land faster, onboard faster)

Extend outflows:
- Negotiate vendor terms (60+ days)
- Manage payroll timing (mid-month payroll = more buffer)
- Discretionary spend control (defer non-critical)
- Fundraising (extends runway, buys time)

Example impact:
- Move 30% of customers to annual = £45K upfront (3-week boost)
- Extend payables from 30 to 60 days = £50K float
- Combined = £95K immediate cash improvement

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "revenue-recognition-and-accounting-standards", "unit-economics-ltv-cac-payback"],
    faq: [
      { q: "How do I calculate runway?", a: "Runway = Cash on hand / Monthly burn rate. Example: £500K cash, £100K burn = 5 months. Monitor weekly (not monthly). Forecast: 13-week rolling cash forecast (include growth/churn). Action: If <9 months, start fundraising planning." },
      { q: "What's a good DSO (Days Sales Outstanding)?", a: "Target: 30-45 days (monthly billing), 10-15 days (credit card). Improve: Invoice faster, automate reminders, incentivize payment (1-2% discount for annual). Example: Move from 45 to 30 days = £500K revenue × 15/365 = £20K cash freed up." },
      { q: "How do I extend runway without raising funds?", a: "Increase cash in: Annual billing (upfront collection), price increase, accelerate onboarding. Reduce burn: Efficiency (lower CAC, reduce spend), defer hiring. Extend payables: Negotiate 60-day terms with vendors. Impact: Combine all 3 = 2-3 months extended runway, low cost." }
    ],
    videoUrl: ""
  }
];

export default batch230Articles;