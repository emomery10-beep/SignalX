import { AcademyArticle } from "@/types/academy";

export const batch95Articles: AcademyArticle[] = [
  {
    slug: "cash-conversion-cycle-working-capital",
    title: "Cash Conversion Cycle: Optimizing Working Capital and Cash Flow",
    description: "Master the cash conversion cycle. Understand DSO, DPO, and DIO to optimize working capital and accelerate cash flow.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "cash conversion cycle",
      "CCC",
      "working capital",
      "DSO",
      "days sales outstanding",
      "DPO",
      "days payable outstanding",
      "inventory management",
      "accounts receivable",
      "accounts payable"
    ],
    keyTakeaways: [
      "Cash conversion cycle (CCC) = DSO (days to collect from customers) + DIO (days inventory sits) − DPO (days to pay vendors); example: DSO 45 days + DIO 30 days − DPO 60 days = 15 days CCC; negative CCC is ideal (vendors finance your operations); positive CCC means you fund operations before customers pay",
      "SaaS has unique CCC dynamics: DIO = £0 (no physical inventory), so CCC = DSO − DPO; enterprise SaaS with annual contracts can have negative CCC (customers prepay, vendors paid on net terms, you hold customer cash 11 months); shorten DSO by requiring upfront payment or net-15 terms; extend DPO by negotiating net-60/90 with vendors",
      "Optimizing CCC has compounding impact: reduce DSO by 10 days = £X million freed up (example: £5M monthly revenue × 30% DIO on DSO = £1.5M freed); reduce DPO by 10 days loses working capital (avoid unless necessary); combine both = major impact. Real example: SaaS company cut DSO from 60 to 45 days = £2M cash freed, 0% cost financing"
    ],
    content: [
      {
        heading: "Understanding the Cash Conversion Cycle",
        body: `The cash conversion cycle (CCC) measures how long your cash is tied up in operations before it comes back to you.

**The Problem: Cash Timing Mismatch**

Simple example:

Day 1: You buy inventory (or software licenses) for £100,000
- Cash outflow: £100K
- Payment terms: Net 30 (pay vendor in 30 days)

Day 31: You sell product for £150,000 (50% markup)
- Cash inflow: Not yet (customer pays on Net 45 terms)
- Revenue: £150K (booked)
- Cash: £0 received

Day 76: Customer pays you
- Cash inflow: £150K
- You already paid vendor on Day 31
- Net cash timing gap: 45 days (from when you paid vendor to when you received customer payment)

In this 45-day window, you needed to fund operations with working capital (line of credit, cash reserves, or equity).

This is the cash conversion cycle problem.

**Components of CCC**

\`CCC = DSO + DIO − DPO\`

Where:

1. **DSO (Days Sales Outstanding)**: How long to collect from customers
   - Example: £1M monthly revenue, £500K average accounts receivable
   - DSO = (£500K ÷ £1M) × 30 days = 15 days
   - Interpretation: Takes 15 days on average to collect from customers

2. **DIO (Days Inventory Outstanding)**: How long inventory sits before sale
   - Example: £200K inventory, £50K monthly COGS (cost of goods sold)
   - DIO = (£200K ÷ £50K) × 30 days = 120 days
   - Interpretation: Inventory turns over every 120 days

3. **DPO (Days Payable Outstanding)**: How long you take to pay vendors
   - Example: £100K accounts payable, £50K monthly COGS
   - DPO = (£100K ÷ £50K) × 30 days = 60 days
   - Interpretation: Takes 60 days to pay vendors (they finance you)

**CCC Calculation Example**

Manufacturing company:

Assets:
- Accounts receivable: £500K
- Inventory: £300K
- Monthly revenue: £1M
- Monthly COGS: £400K

Liabilities:
- Accounts payable: £200K

Calculations:
- DSO = (£500K ÷ £1M) × 30 = 15 days
- DIO = (£300K ÷ £400K) × 30 = 22.5 days
- DPO = (£200K ÷ £400K) × 30 = 15 days

**CCC = 15 + 22.5 − 15 = 22.5 days**

Interpretation: Operating cycle takes 37.5 days (receipt + inventory), but vendors finance 15 days of it, leaving net 22.5 days of working capital needed.

**Negative CCC (Ideal)**

Some businesses have negative CCC (vendors finance operations):

Example: Retail company (like Amazon pre-AWS profitability)

- DSO: 5 days (customers mostly pay immediately with credit cards)
- DIO: 30 days (inventory turns fast)
- DPO: 60 days (negotiate long payment terms)

**CCC = 5 + 30 − 60 = −25 days**

Interpretation: Customers and inventory cycle is 35 days, but you pay vendors 60 days later. Result: vendors finance 25 days of operations. You collect from customers, then 25 days later pay suppliers. You're using customer cash to operate.

This is why Amazon was once not profitable (negative operating margins) but cash-positive—negative CCC.

**SaaS Unique Dynamics**

SaaS typically has:

- DSO: 15-30 days (if monthly billing) or 0 days (if prepaid)
- DIO: £0 (no physical inventory)
- DPO: 30-60 days (negotiated with vendors, contractors)

**CCC = DSO − DPO**

Example 1: Monthly billing, net 30 payment terms
- DSO: 30 days (invoice end of month, paid net 30)
- DIO: 0
- DPO: 45 days
- **CCC = 30 − 45 = −15 days (negative, ideal)**

Example 2: Annual prepaid contract
- DSO: 0 days (customer pays upfront on contract signature)
- DIO: 0
- DPO: 45 days
- **CCC = 0 − 45 = −45 days (very negative, excellent)**

The more you shift to upfront/prepaid pricing, the more negative your CCC becomes.

**Improving Cash Conversion Cycle**

Three levers:

**1. Reduce DSO (Accelerate collections)**

Current: Customers pay 45 days after invoice
Target: 30 days

Actions:
- Net 15 payment terms (vs. net 45)
- Require credit card upfront
- Early payment discount (1% discount for 10-day payment)
- Auto-pay / ACH for recurring
- Automated invoicing and reminders

Impact:
- DSO drops from 45 to 30 days
- £5M revenue: Frees up £250K cash (£5M ÷ 365 × 15 days)

**2. Reduce DIO (Faster inventory turnover)**

Current: Inventory turns every 90 days
Target: 60 days

Actions:
- Just-in-time ordering
- Better demand forecasting
- Reduce SKU variety
- Clearance sales on slow movers

Impact:
- DIO drops from 90 to 60 days
- £3M inventory: Frees up £1M cash (£3M ÷ 90 × 30 days)

**3. Increase DPO (Extend payables)**

Current: Pay vendors 30 days
Target: 60 days

Actions:
- Negotiate extended terms with key suppliers
- Optimize payment schedule
- Take full net-30 terms (don't pay early)

Impact:
- DPO increases from 30 to 60 days
- £1M monthly COGS: Uses additional £1M working capital (extends obligations 30 days)

**Combined improvement:**
- Reduce DSO by 15 days: +£250K cash freed
- Reduce DIO by 30 days: +£1M cash freed
- Increase DPO by 30 days: +£1M additional working capital
- **Total: £2.25M cash freed (equivalent to low-cost financing)**

**CCC Impact on Growth**

Fast-growth companies often have working capital crises:

Example: SaaS company, 100% YoY growth

Month 1:
- Revenue: £1M/month
- DSO: 30 days (£1M AR)
- Monthly COGS: £300K
- DPO: 45 days (£1.35M AP)
- CCC: 30 − 45 = −15 days (negative, good)

Month 6:
- Revenue: £1.6M/month (60% growth into month 6)
- DSO: 30 days (£1.6M AR)
- Monthly COGS: £480K
- DPO: 45 days (£2.16M AP)
- CCC: 30 − 45 = −15 days (still negative)

Change in working capital:
- AR increased: £600K (£1.6M − £1M)
- AP increased: £810K (£2.16M − £1.35M)
- Net cash impact: +£210K (AP increase covers 70% of AR increase)

Even though CCC is negative, growth still strains working capital if DSO increases or AR grows faster than AP can.

**Monitoring CCC**

Track quarterly (or monthly for growth companies):

| Metric | Q1 | Q2 | Q3 | Q4 | Trend |
|--------|----|----|----|----|--------|
| DSO | 35 | 34 | 33 | 32 | ✓ Improving |
| DIO | 25 | 24 | 23 | 22 | ✓ Improving |
| DPO | 50 | 51 | 52 | 53 | ✓ Improving |
| **CCC** | **10** | **7** | **4** | **1** | ✓ Improving |

Green flags:
- CCC decreasing (or more negative)
- DSO decreasing (faster collections)
- DIO decreasing (faster inventory turnover)
- DPO increasing (longer payment terms negotiated)

Red flags:
- CCC increasing (or less negative)
- DSO increasing (collections slowing)
- DIO increasing (inventory piling up)
- DPO decreasing (vendors tightening terms)

**Working Capital Financing Strategy**

If CCC is positive (you need working capital):

Options:
1. **Line of credit** (easiest, 5-12% APR)
2. **Factoring** (sell AR at discount, 2-4% cost)
3. **Vendor financing** (negotiate longer payment terms, 0% cost)
4. **Equity** (fundraise, 25-30% annual dilution cost)

Best approach: Negotiate longer DPO with vendors first (0% cost), then use line of credit for remainder.

Example:
- CCC: 45 days
- Monthly revenue: £500K
- Working capital needed: £750K (£500K × 45 ÷ 30)
- Action 1: Extend DPO from 30 to 50 days (−20 day CCC impact) = −£333K need
- Action 2: Secure line of credit for remaining £417K (5-8% cost)
- Result: £417K × 6% = £25K annual financing cost (vs. equity dilution)

**CCC vs. Profitability**

Don't confuse the two:

- **Profitable but positive CCC**: Growing fast, needs external financing to fund working capital
- **Unprofitable but negative CCC**: Losing money on each sale, but cash-positive due to customer prepay (e.g., subscription service with annual upfront billing but high COGS)

Ideal: Profitable AND negative CCC (earn money and generate cash).

Avoid: Negative profit margin with positive CCC (cash drain despite revenue growth).
`
      }
    ],
    relatedSlugs: [
      "quick-ratio-liquidity-analysis",
      "cash-management-and-forecasting",
      "burn-rate-runway-planning",
      "bookings-vs-revenue-recognition",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's a good cash conversion cycle?",
        a: "Negative CCC is ideal (vendors finance operations). For SaaS, −15 to −30 days is healthy. Positive CCC means you fund operations; <30 days is acceptable, >60 days is concerning."
      },
      {
        q: "How do I calculate DSO, DIO, and DPO?",
        a: "DSO = (AR ÷ Revenue) × 30. DIO = (Inventory ÷ COGS) × 30. DPO = (AP ÷ COGS) × 30. Then CCC = DSO + DIO − DPO."
      },
      {
        q: "Which lever has the most impact on CCC?",
        a: "Reducing DSO (accelerating collections) frees up the most cash quickly. Extending DPO is second (but risks supplier relationships). DIO reduction is third (relevant mostly for manufacturing/retail)."
      },
      {
        q: "Can I have negative cash despite negative CCC?",
        a: "Yes, if you're unprofitable (losing money on each sale). Negative CCC helps (vendors finance losses), but profitability is what matters long-term."
      }
    ],
    videoUrl: ""
  }
];

export default batch95Articles;
