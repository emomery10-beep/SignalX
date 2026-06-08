import { AcademyArticle } from "@/types/academy";

export const batch192Articles: AcademyArticle[] = [
  {
    slug: "working-capital-optimization-and-cash-cycle-management",
    title: "Working Capital Optimization and Cash Cycle Management: Improving Cash Position",
    description: "Master working capital. Optimize DSO/DPO, manage inventory, and free up cash flow.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "working capital",
      "cash cycle",
      "DSO",
      "DPO",
      "inventory management",
      "accounts receivable",
      "accounts payable",
      "cash flow optimization",
      "payment terms",
      "cash conversion"
    ],
    keyTakeaways: [
      "Cash conversion cycle: CCC = DSO (days sales outstanding, 30-45 days) + DIO (days inventory outstanding, 5-10 days for SaaS) - DPO (days payable outstanding, 30-45 days). Example: 40 + 7 - 40 = 7 days (tight, good). But 40 + 7 - 30 = 17 days (negative working capital ideal). Formula interpretation: Money in from customers (40 days) + time to use inventory (7 days) - time to pay suppliers (40 days) = 7 days you need to fund. Optimize: Reduce DSO (invoice faster, collect faster), increase DPO (negotiate 60-90 day terms), reduce DIO (minimize inventory). SaaS advantage: DIO usually near-zero (no physical inventory), so CCC = DSO - DPO.",
      "Upfront billing advantage: Annual billing = collect cash year 1, recognize revenue monthly. Example: £100K annual contract, collect upfront = £100K cash day 1, recognize £8.3K/month revenue. Net: £100K cash covers operating costs (lasts 12 months), vs month-by-month payment (£8.3K/month, doesn't cover burn). Most efficient: Encourage annual billing (discount 10-15% off monthly price). Example: Monthly £10K (£120K annual), annual discount £108K (-10%) = incentivizes upfront cash.",
      "DSO optimization: Measure days between invoice and cash receipt. Target: 30 days (payment due net-30). Tools: Stripe, Bill.com for automation. Best practice: Offer payment plan options (ACH = faster, credit card = convenience). Track: Aging report (% of receivables 0-30 days, 30-60 days, >60 days). Collect 80%+ within 30 days = healthy. Incentivize: 2% discount for payment within 10 days (discount cost £200K revenue × 2% = £4K cost, but save £40K interest/working capital cost = good ROI)."
    ],
    content: [
      {
        heading: "Cash Conversion Cycle and Working Capital Metrics",
        body: `Understanding the operating cycle.

**Cash Conversion Cycle Formula**

CCC = DSO + DIO - DPO

Where:
- DSO (Days Sales Outstanding): How long before customer pays you
- DIO (Days Inventory Outstanding): How long inventory sits before sale
- DPO (Days Payable Outstanding): How long before you pay supplier

Example:
- DSO 40 days: Invoice Dec 1, receive payment Jan 10
- DIO 7 days: Buy inventory, sell it in average 7 days
- DPO 40 days: Receive invoice Dec 1, pay on Jan 10
- CCC: 40 + 7 - 40 = 7 days

Interpretation:
- Positive CCC (7 days): You fund operations for 7 days out of pocket
- Negative CCC: Suppliers fund you (rare, excellent)
- Goal: Minimize CCC (cash is tied up less)

SaaS example (simpler, no inventory):
- DSO 35 days (customers pay monthly, invoice due net-30, pay on average day 35)
- DIO 0 (no inventory, digital product)
- DPO 40 days (you pay suppliers in 40 days)
- CCC: 35 + 0 - 40 = -5 days (negative! suppliers fund you for 5 days)

**Trend Analysis**

Track CCC quarterly:

| Q | DSO | DIO | DPO | CCC |
|---|-----|-----|-----|-----|
| Q1 | 40 | 7 | 35 | 12 |
| Q2 | 42 | 6 | 38 | 10 |
| Q3 | 45 | 5 | 40 | 10 |
| Q4 | 42 | 5 | 42 | 5 |

Insight: CCC improved from 12 to 5 days (working capital optimization working).

Drivers:
- DSO increasing (Q1 40 → Q3 45): Customers paying slower (problem)
- DPO increasing (Q1 35 → Q4 42): You paying suppliers later (good for cash)
- DIO decreasing (Q1 7 → Q4 5): Inventory moving faster (good)

**Impact on Cash**

Example:
- Company: £10M revenue, £5M cost of sales (50% margin)
- CCC = 10 days

Cash required:
- Revenue per day: £10M / 365 = £27K per day
- Cost of sales per day: £27K × 50% = £13.5K per day
- Working capital needed: £13.5K per day × 10 days = £135K

If improve CCC to 5 days:
- Working capital needed: £13.5K × 5 = £67.5K
- Cash freed up: £135K - £67.5K = £67.5K (available for other uses!)

If worsen to 20 days:
- Working capital needed: £13.5K × 20 = £270K
- Additional cash required: £270K - £135K = £135K (need to fund, reduces profitability)

**Benchmarks**

SaaS (recurring revenue):
- DSO: 25-40 days (monthly billing is standard, some pay slower)
- DIO: 0-5 days (minimal inventory)
- DPO: 30-60 days (varies by supplier)
- CCC: -20 to +20 days (often negative, good for cash flow)

Manufacturing/physical goods:
- DSO: 40-60 days
- DIO: 30-90 days (inventory sits longer)
- DPO: 30-45 days
- CCC: 40-100+ days (lots of working capital required)

Retail:
- DSO: Low (mostly cash/credit card sales)
- DIO: 45-60 days (inventory turnover)
- DPO: 30-60 days
- CCC: Often negative (collect immediately, pay in 30-60 days)

`
      },
      {
        heading: "Optimizing Receivables (DSO)",
        body: `Accelerating customer payments.

**DSO Reduction Strategies**

Current state:
- Customer invoiced: Dec 1
- Payment received: Jan 10 (40 days)
- Target: 30 days

Method 1: Earlier invoicing
- Invoice on day 1 of service (not end of month)
- Example: Monthly service starts Dec 1, invoice Dec 1 (not Dec 31)
- Impact: Collect 1 month earlier per invoice
- Implementation: Change billing cycle in system

Method 2: Faster payment options
- Offer ACH (bank transfer): Typically clears in 1-2 days
- Credit card: Immediate authorization, clears in 3-5 days (with 2-3% fee)
- Wire transfer: Same day (but expensive for small amounts)
- Example: 60% pay via ACH (5-day payment) vs 40% check (30-day payment) = weighted 15 days average
- Target: Get 80%+ on ACH/card (reduces DSO to 20-25 days)

Method 3: Early payment discounts
- Offer: 2% discount if pay within 10 days
- Example: £1M annual customers, 50% take discount = £10K cost
- Benefit: Convert 40-day DSO to 10-day DSO = reduce working capital £1M needs by £750K
- ROI: £10K discount cost → £750K cash freed (huge!)
- Note: Only use if cash flow tight (otherwise discount isn't worth it)

Method 4: Collections process
- Day 1: Auto-invoice (email reminder)
- Day 15: Auto-reminder email (payment due in 15 days)
- Day 30: Payment due
- Day 35: First collection email (friendly reminder)
- Day 45: Second collection email + phone call
- Day 60: Escalate to management
- Goal: 90% collected by day 45 (vs 40-day average)

Method 5: Segmentation
- Enterprise customers: Often pay slower (large organizations, payment processing slower)
  - Strategy: Invoice weekly (not monthly) to accelerate payment frequency
  - Offer: Quarterly or annual billing (incentivize upfront)
- SMB customers: Usually faster
  - Strategy: Monthly billing, auto-payment (bank account)
- Example: Weighted DSO 35 days (enterprise slower, SMB faster)

**Metrics to Track**

Aging report (% of receivables):
- 0-30 days: 70% (on-time, good)
- 30-60 days: 20% (slightly late, concerning)
- 60+ days: 10% (overdue, needs collection)

Target:
- 80%+ collected within 30 days
- <5% overdue >60 days (write-off risk)

Trend:
- If aging worsening (more customers overdue), investigate
- May indicate: Customer financial distress, invoicing errors, customer satisfaction issue

**Bad Debt Reserve**

Reserve calculation:
- 0-30 days: 0% bad debt (assume 100% will pay)
- 30-60 days: 5% reserve (some won't pay)
- 60+ days: 50% reserve (high default risk)
- >120 days: 100% reserve (assume write-off)

Example:
- Receivables: £500K at 0-30 days (reserve 0) + £100K at 30-60 days (reserve 5%) + £50K at 60+ (reserve 50%)
- Bad debt reserve: £0 + £5K + £25K = £30K
- Net receivables: £650K - £30K = £620K

Write-off:
- If customer doesn't pay after 120 days, write-off (remove from receivables, charge to bad debt expense)
- Example: Write off £10K overdue customer = Bad debt expense £10K (reduces profit)

`
      },
      {
        heading: "Optimizing Payables (DPO) and Overall Working Capital",
        body: `Extending payment timeline and freeing cash.

**DPO Optimization**

Current:
- Invoice received: Dec 1
- Payment made: Jan 10 (40 days)

Negotiation:
- Request: 60-day payment terms (net-60)
- Timing: Month of service, invoice due 60 days later
- Example: December service invoiced, pay February 10
- Impact: Reduce cash outflow timing by 20 days per cycle

When to negotiate:
- Large suppliers (>£10K/month): Has leverage
- Switching cost: If hard to switch suppliers, you have leverage
- Relationships: Long-term partnership (not transactional)
- Growth: If growing fast, supplier interested in keeping you

Negotiation talking points:
- "We're growing, becoming bigger customer, want long-term partnership"
- "Competitors offer net-60, can you match?"
- "We automate invoice processing, reduces your cost to collect"

Early payment discount (reverse):
- Supplier offers: 2% discount if pay in 10 days
- Decision: Do I want the discount?
- Analysis: 2% discount for 30 days early = 24% annual return (attractive)
- If cash-rich: Take discount
- If cash-tight: Don't take, pay on day 60

**Inventory Optimization (DIO)**

For SaaS (minimal inventory):
- Usually 0-5 days (parts, supplies purchased as needed)
- Example: Software licenses for team = ordered monthly, used monthly
- Optimization: Switch to per-use cloud services (pay as you go, no inventory)

For SaaS with physical products:
- Example: SaaS company also sells hardware devices
- Current: Buy 1000 units month, sit in warehouse, sell over 2 months (DIO 45 days)
- Optimization: Just-in-time ordering
  - Forecast: Expect to sell 500 units this month
  - Order: 500 units (arrive week 1)
  - Sell: 500 units (ship throughout month)
  - DIO: Reduces to 14 days (half)
- Benefit: Free up £500K working capital (hypothetical)

Cost of inventory:
- Carrying cost: Storage, insurance, obsolescence = 20-30% of inventory value per year
- Example: £1M inventory × 25% carrying cost = £250K/year
- Reduce inventory by 50% = Save £125K/year (working capital + carrying cost)

**Overall Working Capital Optimization**

Priority actions (ROI):
1. Reduce DSO (invoice faster, collect faster): Impact £500K+ cash if successful
2. Extend DPO (negotiate longer terms): Impact £200-300K cash
3. Reduce DIO (just-in-time, drop shipping): Impact £100-200K cash
4. Total potential: £700K-1M cash freed

Timeline:
- Quick (1-2 months): Payment options, collections, invoicing automation = £200K
- Medium (3-6 months): Negotiate DPO with suppliers = £300K
- Long-term (6-12 months): Reduce DIO (inventory optimization) = £200K

**Financing Working Capital**

If CCC is long and costly:
- Working capital loan: Borrow against receivables or inventory (costs 3-5% per year)
- Example: £500K working capital needed, 4% APR = £20K/year cost
- Value: Allow company to grow without equity raise (cheaper than funding)
- Trigger: When CCC improvement isn't fast enough, or growth is faster than cash generation

`
      }
    ],
    relatedSlugs: [
      "cash-flow-management-and-working-capital",
      "burn-rate-and-cash-runway-analysis",
      "financial-forecasting-modeling",
      "p-l-statement-architecture-profitability",
      "financial-controls-and-audit-readiness"
    ],
    faq: [
      {
        q: "How do I calculate my cash conversion cycle?",
        a: "Formula: CCC = DSO + DIO - DPO. DSO = days to get paid by customers (~40 days). DIO = days inventory sits (~5 days for SaaS, 0 with digital). DPO = days before you pay suppliers (~40 days). Example: 40 + 5 - 40 = 5 days (need to fund 5 days of operations). SaaS often negative (great for cash). Track quarterly and trend. Target: <10 days for SaaS."
      },
      {
        q: "How do I reduce DSO (collect faster)?",
        a: "Strategies: (1) Invoice immediately (day 1 of service), (2) Offer ACH/credit card payment (faster than check), (3) Early payment discount (2% for 10-day payment), (4) Collections process (automated reminders, escalation), (5) Segment customers (enterprise slower, SMB faster). Target: 30-day DSO (collect within 30 days). If 40 days now: 10-day improvement frees up ~£250K cash (for £10M revenue company)."
      },
      {
        q: "Should I offer early payment discounts?",
        a: "Only if cash-tight. 2% discount to collect 30 days early = 24% annual return (good financially). But: Revenue impact (lost 2% margin). Use strategically: Only for enterprise customers, only when cash needed. Example: £10M customers, 30% take 2% discount = £60K cost, but frees £1.5M working capital = worth it if need cash."
      },
      {
        q: "How do I increase DPO (pay suppliers later)?",
        a: "Negotiate net-60 terms (vs net-30). Talking points: 'Long-term partnership, growing customer, competitors offer net-60.' Risk: Supplier relationships matter (don't push too hard). Track: If suppliers are critical, maintain goodwill. Reverse: If supplier offers early payment discount (e.g., 2% for 10 days early), only take if cash-rich (otherwise pay on day 60)."
      }
    ],
    videoUrl: ""
  }
];

export default batch192Articles;
