import { AcademyArticle } from "@/types/academy";

export const batch348Articles: AcademyArticle[] = [
  {
    slug: "working-capital-management-and-cash-optimization",
    title: "Working Capital Management and Cash Optimization: Maximizing Cash Flow",
    description: "Master working capital. Manage AR/AP, optimize cash flow, improve efficiency.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["working capital", "cash flow", "accounts receivable", "accounts payable", "cash optimization"],
    keyTakeaways: [
      "Working capital: Cash needed to fund operations (AR + inventory - AP = working capital). Improve: Faster collections (AR), slower payments (AP), less inventory. Example: 100 customers, £1K each, 30-day payment terms = £1M AR (cash tied up). Speed collection to 15 days = £500K AR (half the cash needed). Cost: Discount for early payment (2% discount vs 30 days typical). ROI: High (improve cash without raising capital).",
      "Collections: Faster AR = faster cash. Tactics: (1) Invoice immediately (not delayed), (2) Offer payment discount (2/10 net 30 = 2% discount if paid in 10 days), (3) Follow-up on overdue (call on day 31, not after 90 days), (4) Auto-renewal (recurring charges automatic, not one-time). Impact: Reduce DSO (days sales outstanding) from 45 to 30 days = 33% cash improvement.",
      "Payments: Slower AP = keep more cash. Tactics: (1) Pay on due date (not early, keep cash), (2) Negotiate terms (30 day standard, negotiate 45-60 for key suppliers), (3) Bundle payments (monthly vs weekly, fewer transactions). But: Balance with relationships (don't abuse vendors, they're partners). Opportunity: Use supply chain financing (pay early for discount, but finance it)."
    ],
    content: [
      {
        heading: "Managing Working Capital and Optimizing Cash Flow",
        body: `Improving cash position through efficient working capital management.

**Working capital fundamentals**

Definition:
- Current assets - current liabilities
- Focus: Cash tied up in operations

Formula:
- Working capital = AR (Accounts Receivable) + Inventory - AP (Accounts Payable)
- Higher = more cash tied up (bad)
- Lower = less cash tied up (good)

Example calculation:

Current assets:
- Cash: £100K
- AR: £200K (customers owe us)
- Inventory: £50K
- Total: £350K

Current liabilities:
- AP: £100K (we owe vendors)
- Payroll payable: £30K
- Total: £130K

Working capital: £350K - £130K = £220K (cash tied up)

**Accounts receivable (AR) management**

Definition:
- Money customers owe us
- Goal: Get paid faster (improve cash flow)

Key metric:
- DSO (Days Sales Outstanding): Average days to collect payment
- Formula: AR / (Revenue / 365)
- Example: £200K AR, £1M annual revenue = (£200K / £2,740/day) = 73 days

Benchmark:
- 30 days: Great (paid within a month)
- 45 days: Okay (month and a half)
- 60+ days: Poor (taking too long)

Collection tactics:

Tactic 1: Invoice immediately
- Current: Invoice at month-end (delays)
- Better: Invoice at service delivery (same day)
- Impact: 5-10 day improvement in DSO

Tactic 2: Clear terms
- Invoice must include: Due date, payment method, early payment discount
- Example: Net 30 (due in 30 days), 2/10 (2% discount if paid by day 10)

Tactic 3: Early payment discount
- Offer: 2% discount if paid within 10 days (vs 30-day terms)
- Cost: 2% of revenue
- Benefit: 20-day faster collection (reduces AR by 20-30%)
- ROI: 2% cost, 30% cash improvement = usually worth it

Example:
- Current AR: £200K (73-day DSO)
- With 2/10 net 30: 40% of customers pay early (faster), 60% pay at 30 days
- New DSO: (40% × 10 days) + (60% × 30 days) = 4 + 18 = 22 days
- New AR: (£1M annual / 365) × 22 = £60K AR (huge improvement!)
- Cost: 40% × 2% = 0.8% of revenue (£8K annually)
- Benefit: £140K less AR (£200K → £60K), meaning £140K more cash available
- ROI: £140K cash improvement for £8K cost (17.5x return)

Tactic 4: Follow-up system
- Process: Overdue invoice 5 days, call customer (payment reminder)
- Overdue 15 days, escalate (ask why?)
- Overdue 30 days, decision (pause service? escalate?)
- Impact: Catch issues early, reduce bad debt

Tactic 5: Recurring/automatic billing
- For subscriptions: Auto-charge credit card (vs invoice + manual payment)
- Benefit: Guaranteed payment (customer authorized upfront)
- Impact: Near 100% collection rate (only failed card declines)

**Accounts payable (AP) management**

Definition:
- Money we owe vendors
- Goal: Pay slower (keep cash as long as possible)

Key metric:
- DPO (Days Payable Outstanding): Average days before payment
- Formula: AP / (COGS / 365)
- Example: £100K AP, £300K annual COGS = (£100K / £822/day) = 122 days

Strategy:
- Increase DPO (pay slower = keep cash longer)
- But: Balance with relationships (don't damage vendor relationships)

Tactics:

Tactic 1: Negotiate terms
- Standard: Net 30 (pay in 30 days)
- Negotiate: Net 45-60 (pay in 45-60 days)
- Benefit: 15-30 extra days of float (keep cash)
- Cost: May be no discount, but vendor willing if large customer

Example:
- 10 vendors, average £10K per month per vendor
- Current terms: Net 30 (average DPO 45 days, floating £15K)
- Negotiate: Net 60 (DPO 60 days, floating £20K)
- Benefit: £5K extra cash float (£20K - £15K)

Tactic 2: Bundle payments
- Current: Pay vendors weekly (many transactions, costs)
- Better: Pay vendors monthly (fewer transactions, less processing)
- Benefit: Timing (can batch, last minute payment)
- Impact: Negotiate better terms (monthly vs weekly = can offer steady payments)

Tactic 3: Volume discounts or early pay incentives
- Offer: "Pay £3K this month, save 2% on next £10K purchase"
- Trade-off: Discount cost vs cash needs
- Use: When cash is abundant, want to reduce AP

Tactic 4: Supply chain financing
- Mechanism: "Pay vendor day 60 via financing company, they get paid day 10"
- Benefit: Vendor gets cash fast (happy), you pay after 60 days (cash preserved)
- Cost: Small fee (1-3% of transaction)
- When to use: Need vendors happy, have short-term cash flow dip

**Working capital optimization**

Example: Improving working capital by £200K

Current state:
- AR: £200K (73-day DSO)
- Inventory: £50K
- AP: £100K (45-day DPO)
- Net working capital: £200K + £50K - £100K = £150K

Targets:
- AR: £60K (implement early payment discount, 22-day DSO)
- Inventory: £50K (no change, not main focus)
- AP: £200K (negotiate 60-day terms, double DPO)
- Net working capital: £60K + £50K - £200K = -£90K (negative!)

Impact:
- Improvement: £150K → -£90K = £240K cash improvement
- Benefit: £240K more cash available (without raising capital)
- Achieved: Better AR collection, better vendor payment terms

**Cash conversion cycle**

Metric: Days of cash in operations

Formula:
- CCC = DSO + DIO - DPO
- DSO: Days sales outstanding (how long to collect from customers)
- DIO: Days inventory outstanding (how long inventory sits)
- DPO: Days payable outstanding (how long to pay vendors)

Example:

Current:
- DSO: 73 days (collect from customers)
- DIO: 30 days (inventory)
- DPO: 45 days (pay vendors)
- CCC: 73 + 30 - 45 = 58 days

This means you need 58 days of operating cash (to fund gap between paying vendors and collecting from customers)

Optimized:
- DSO: 22 days (faster collection)
- DIO: 30 days (same)
- DPO: 60 days (slower payment)
- CCC: 22 + 30 - 60 = -8 days (negative!)

Negative CCC means vendors finance you (they pay before customers)

**Working capital monitoring**

Monthly metrics:

| Item | Current | Target | Status |
|---|---|---|---|
| AR (£) | £200K | £60K | £140K excess |
| DSO (days) | 73 | 22 | 51 days over |
| AP (£) | £100K | £200K | £100K under-utilized |
| DPO (days) | 45 | 60 | 15 days short |
| Working capital | £150K | -£90K | £240K excess |

Actions:
- Implement early payment discount (reduce AR)
- Negotiate vendor terms (increase AP)
- Follow-up on overdue AR (accelerate collection)

**Common working capital mistakes**

Mistake 1: Ignoring AR
- Problem: Customers take 90 days to pay, cash problems
- Fix: Enforce terms (follow-up, discount for early payment)
- Impact: £100K+ cash improvement possible

Mistake 2: Paying early (cash conservation forgotten)
- Problem: "We have cash, pay vendor early"
- Fix: Pay on due date, not early (keep cash)
- Impact: £50K+ monthly cash preservation

Mistake 3: No inventory management
- Problem: Overstocked inventory ties up cash
- Fix: JIT (just-in-time) inventory, turn faster
- Impact: 10-20% inventory reduction possible

Mistake 4: Not measuring DSO/DPO
- Problem: Don't know how long to collect/pay
- Fix: Track monthly (DSO trend, DPO trend)
- Impact: Focus attention on biggest opportunities

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "cash-runway-and-burn-rate-management", "metrics-dashboard-design-kpi-tracking", "accounting-for-startups-and-small-businesses", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "What is working capital and why does it matter?", a: "Working capital: Cash tied up in operations. Formula: AR + Inventory - AP. Example: £200K AR (customers owe), £50K inventory, £100K AP (we owe) = £150K working capital. Lower = less cash tied up (better). Improve: Faster collections (AR), slower payments (AP), less inventory. Potential: £200K+ cash improvement (without raising capital)." },
      { q: "How do I improve collections?", a: "Tactics: (1) Invoice immediately (not delayed), (2) Offer early payment discount (2/10 net 30), (3) Follow-up on overdue (day 5 reminder), (4) Auto-billing (credit card, vs invoice). Metrics: DSO (days sales outstanding, target <30 days). Example: Reduce from 73 days to 22 days = 70% AR reduction = huge cash improvement." },
      { q: "How do I optimize payable payments?", a: "Tactics: (1) Negotiate terms (net 30 → net 60), (2) Bundle payments (weekly → monthly), (3) Use supply chain financing (if needed). Metrics: DPO (days payable outstanding, target 45-60 days). Balance: Keep vendors happy (don't abuse), but maximize float. Cost: May lose discount (1-2%), but cash preservation worth it." }
    ],
    videoUrl: ""
  }
];

export default batch348Articles;
