import { AcademyArticle } from "@/types/academy";

export const batch126Articles: AcademyArticle[] = [
  {
    slug: "cash-flow-management-and-working-capital-optimization",
    title: "Cash Flow Management and Working Capital Optimization: Keeping Cash Moving",
    description: "Master cash flow management. Optimize working capital, accelerate collections, and manage cash cycles for healthy business operations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "cash flow management",
      "working capital",
      "cash conversion cycle",
      "accounts receivable",
      "accounts payable",
      "cash optimization",
      "payment terms",
      "inventory management",
      "cash timing",
      "liquidity management"
    ],
    keyTakeaways: [
      "Cash conversion cycle (CCC) = Days inventory + Days sales outstanding - Days payable outstanding. Example: Collect revenue 60 days after sale, pay suppliers 30 days, no inventory = 30-day CCC. This means you need 30 days of working capital (cash) on hand. Reduce CCC by collecting faster (DSO), paying slower (DPO), or reducing inventory.",
      "Working capital formula: Current assets - Current liabilities. For SaaS: Manage AR (collect faster), AP (extend payment terms), and deferred revenue (customer pays upfront = improves cash). Example: £10M revenue, 60-day DSO = £500K in AR (tied up cash). Reduce DSO to 30 days = £250K AR (frees £250K cash).",
      "Cash flow timing: SaaS with annual contracts = huge upfront cash inflow but deferred revenue liability (you'll deliver it over 12 months). Create working capital model: Month-by-month cash in/out. Identify months with cash gaps (pay salaries but haven't collected yet). Plan for those gaps with credit lines or cash reserves."
    ],
    content: [
      {
        heading: "Understanding Cash Flow and Working Capital",
        body: `Cash flow is not the same as profit. You can be profitable but cash-negative if customers pay late and suppliers demand early payment.

**Cash vs Profit**

Example:

Month 1:
- Revenue (P&L): £100K (recognized)
- Cash received: £0 (customer pays in 60 days)
- Expenses paid: £80K (payroll, contractors)
- Net cash: -£80K (negative, despite £20K profit)

The company is profitable (£20K profit) but cash-negative (-£80K).

This is common for growing companies (collect later, spend now).

**Working Capital Definition**

Working capital = Current assets - Current liabilities

Current assets:
- Cash
- Accounts receivable (AR)
- Inventory (for product companies)
- Other liquid assets

Current liabilities:
- Accounts payable (AP)
- Short-term debt
- Deferred revenue
- Accrued expenses

Example:

Current assets: £500K (cash) + £250K (AR) + £0 (inventory) = £750K
Current liabilities: £200K (AP) + £100K (debt) + £350K (deferred revenue) = £650K

Working capital: £750K - £650K = £100K

This means company has £100K cushion to operate (can cover short-term obligations).

Working capital ratio = Current assets / Current liabilities = 750 / 650 = 1.15x

Benchmark: >1.0x is healthy (can cover liabilities). <1.0x is risky.

**The Cash Conversion Cycle (CCC)**

CCC = Days Inventory Outstanding (DIO) + Days Sales Outstanding (DSO) - Days Payable Outstanding (DPO)

This measures how long cash is tied up in the business.

Example SaaS (no inventory):

DIO = 0 (no inventory)
DSO = 60 days (customer pays in 60 days)
DPO = 30 days (pay suppliers in 30 days)

CCC = 0 + 60 - 30 = 30 days

This means cash is tied up for 30 days on average.

Example product company:

DIO = 30 days (hold inventory for 30 days before sale)
DSO = 45 days (customer pays in 45 days)
DPO = 45 days (pay supplier in 45 days)

CCC = 30 + 45 - 45 = 30 days

Same 30-day CCC, but through different combination.

Negative CCC example (ideal):

DIO = 10 days
DSO = 30 days
DPO = 60 days

CCC = 10 + 30 - 60 = -20 days

Negative CCC means you collect from customers before you pay suppliers (suppliers finance your growth).

**Calculating Each Component**

Days Sales Outstanding (DSO):
- Formula: (Accounts Receivable / Revenue) × Days in period

Example:

Revenue (annual): £10M
Accounts receivable (balance sheet): £1M
DSO = (£1M / £10M) × 365 = 36.5 days

This means it takes 36.5 days on average to collect payment.

Benchmark: SaaS should be <30 days (monthly invoicing), Subscription <10 days (most prepaid)

Days Payable Outstanding (DPO):
- Formula: (Accounts Payable / Cost of Goods Sold) × Days in period

Example:

COGS (annual): £2M
Accounts payable (balance sheet): £200K
DPO = (£200K / £2M) × 365 = 36.5 days

This means it takes 36.5 days to pay suppliers on average.

Benchmark: Negotiate 30-60 days with suppliers. Higher DPO = better cash management (as long as supplier relationships stay healthy).

Days Inventory Outstanding (DIO):
- Formula: (Inventory / COGS) × Days in period

Example:

COGS (annual): £2M
Inventory (balance sheet): £300K
DIO = (£300K / £2M) × 365 = 54.75 days

This means inventory sits for 54.75 days before sale.

Benchmark: Lower is better. High DIO means capital tied up in unsold inventory.

**Improving Cash Conversion Cycle**

Lever 1: Reduce DSO (collect faster)
- Invoice immediately (don't wait to batch invoices)
- Offer discount for early payment (2% for payment within 10 days)
- Automate billing (monthly subscriptions vs manual invoices)
- Follow up on overdue invoices (calls, email, escalation)

Example impact:

Current DSO: 45 days
New DSO: 30 days (15-day improvement)

Revenue: £10M
Cash freed: (£10M / 365) × 15 = £411K

Reducing DSO by 15 days frees £411K cash.

Lever 2: Extend DPO (pay slower)
- Negotiate payment terms with suppliers (30 → 45 → 60 days)
- Take advantage of discounts only if cash allows (don't turn down terms)
- Set up automated payments (control payment timing)

Example impact:

Current DPO: 30 days
New DPO: 45 days (15-day extension)

COGS: £2M
Cash freed: (£2M / 365) × 15 = £82K

Extending DPO by 15 days frees £82K cash.

Lever 3: Reduce inventory (DIO)
- Forecast demand accurately (don't overbuy)
- Use just-in-time inventory (order only when needed)
- Liquidate slow-moving inventory

Example impact:

Current DIO: 60 days
New DIO: 45 days (15-day reduction)

COGS: £2M
Cash freed: (£2M / 365) × 15 = £82K

Reducing DIO by 15 days frees £82K cash.

Combined impact of all three: £411K + £82K + £82K = £575K cash freed (significant).

**Working Capital by Business Model**

SaaS (subscription, annual contracts):
- High DSO: 0-7 days (most customers pre-pay or pay upfront)
- High DPO: 30-60 days (negotiate with suppliers)
- No DIO: 0 days (software, no physical inventory)
- CCC: Often negative (prepayment improves cash)
- Example: CCC = 0 + 2 - 45 = -43 days (very efficient)

E-commerce (inventory-based):
- Moderate DSO: 15-30 days (customers pay at purchase or shortly after)
- Moderate DPO: 30-60 days
- High DIO: 45-90 days (hold inventory weeks/months)
- CCC: Often positive (inventory ties up cash)
- Example: CCC = 60 + 20 - 45 = 35 days

Service business (labor-intensive):
- High DSO: 30-60 days (invoice clients monthly, collect 30 days later)
- High DPO: 30-60 days (negotiate contractor/vendor terms)
- No DIO: 0 days (services, no inventory)
- CCC: Often positive
- Example: CCC = 0 + 45 - 45 = 0 days (balanced)

**Seasonality and Cash Flow**

Many businesses have seasonal cash needs:

Example retail business:

Q4 (holiday season):
- Sales peak (high revenue)
- Collections peak (customers pay)
- But must buy inventory upfront (cash outflow before revenue)
- Inventory buildup (months before sale)

Q1 (post-holiday):
- Sales decline
- Collections decline
- Inventory clears

Cash needs most acute in Q3 (must build inventory for Q4 sales, but haven't collected Q4 revenue yet).

Solution:
- Line of credit to fund Q3 buildup
- Collect Q4 revenue, repay in Q1
- Seasonal financing is common

For SaaS, seasonality less common (subscription model smooths cash). But year-end sales push creates timing issues (December sales, January collection).
`
      },
      {
        heading: "Accounts Receivable Management and Collection",
        body: `Accounts receivable (AR) is cash you haven't collected yet. Managing AR is critical for cash flow.

**AR Aging Analysis**

Track how long invoices remain unpaid:

| Age | Amount | % of Total |
|-----|--------|-----------|
| Current (0-30) | £400K | 70% |
| 31-60 days | £100K | 18% |
| 61-90 days | £40K | 7% |
| 90+ days | £20K | 5% |
| **Total AR** | **£560K** | **100%** |

Red flag: Large balance in 90+ days (customers not paying).

Healthy: Most AR is current or 31-60 days.

**Collection Actions by Age**

0-30 days (current):
- Expected behavior
- Send invoice
- Friendly reminder if not paid by day 30

31-60 days (overdue):
- Send first payment reminder
- Call customer (check if invoice received, any questions?)
- Confirm payment date

61-90 days (seriously overdue):
- Escalate to management
- Call customer directly
- Understand why not paying (financial issues? dispute?)
- Renegotiate terms if needed

90+ days (severe):
- Legal escalation (threat of collection/lawsuit)
- Consider writing off if payment unlikely
- Document reason (bad debt expense)

**Accelerating Collections**

Method 1: Discounts for early payment
- Standard term: Net 30 (pay within 30 days)
- Early payment discount: 2/10, Net 30 (2% discount if pay within 10 days)

Example:

Invoice: £10K
If pay in 10 days: £10K × 98% = £9.8K
If pay in 30 days: £10K

Most customers won't take discount (requires cash early). But some will.

Cost: 2% discount = £200 per £10K invoice
Benefit: Collect 20 days earlier (frees cash earlier)

ROI: If 50% of customers take discount:
- Cost: 0.5 × 2% = 1% of revenue (£100K on £10M revenue = £100K cost)
- Benefit: Free up cash 20 days early (£10M / 365 × 20 × 0.5 = £274K freed)

High ROI if many customers take discount.

Method 2: Shorter payment terms
- Instead of Net 30, negotiate Net 15
- Or Net 10 for small invoices
- Smaller customers more likely to accept

Impact: Collect 15 days earlier, same math as above.

Method 3: Upfront/prepayment
- Best for SaaS: Annual contract, pay upfront
- "Prepay annual to get 15% discount"

Example:

Monthly subscription: £1K/month = £12K/year
Annual prepay with discount: £12K × 85% = £10.2K upfront

Benefit: Collect all £10.2K on day 1, not £1K monthly for 12 months.
Deferred revenue created (£10.2K liability, recognized monthly).

Method 4: Credit card/automated payment
- Customer authorizes recurring charge
- Automatic payment each month
- Eliminates AR (customer pays immediately or at defined interval)

Example: Stripe subscriptions (charge card each month, no AR balance).

SaaS companies heavily use this (low AR because recurring charges automated).

**Allowance for Doubtful Accounts**

Not all AR will be collected. Set aside reserve:

Example:

Total AR: £1M
Historical bad debt rate: 2%
Allowance for doubtful accounts: £1M × 2% = £20K

Balance sheet:
- Accounts receivable (gross): £1M
- Less: Allowance for doubtful: (£20K)
- Accounts receivable (net): £980K

P&L impact:
- Bad debt expense: £20K (each period, adjust as AR grows)

If customer defaults:
- Write off specific AR: £50K
- Reduce allowance: -£50K
- No P&L impact (already reserved)

This ensures financial statements reflect realistic AR (net of expected non-collection).

**AR and Cash Flow Forecasting**

Model AR explicitly in cash flow:

Month 1:
- Revenue (accrual): £100K
- Cash collected (assuming 50% current, 50% next month): £50K

Month 2:
- Revenue (accrual): £100K
- Cash collected (50% this month £100K + 50% from prior month £50K): £100K

This shows cash lags revenue by one month (£50K gap).

If you grow revenue:
Month 3:
- Revenue (accrual): £150K
- Cash collected (50% + 50% from prior): £125K

The gap increases as you grow (tie up more cash in AR).

Solution: Accelerate collection or get credit line to fund gap.
`
      },
      {
        heading: "Accounts Payable Management and Payment Timing",
        body: `Accounts payable (AP) is money you owe suppliers. Strategic AP management improves cash flow.

**Negotiating Payment Terms**

Standard terms by industry:

SaaS vendors: Net 30 (30 days to pay invoice)
Manufacturing suppliers: Net 30-60
Payroll: Weekly or bi-weekly (fast payment expected)
Utilities: Monthly (bill received, pay on due date)

Negotiation tactics:

1. Volume discount: "We'll pay within 15 days if you give 5% discount"
   - Supplier gets cash faster (worth 5%)
   - You get working capital benefit (pay slower normally)

2. Extended terms: "Can we move to Net 45 or Net 60?"
   - Suppliers prefer earlier payment (cash flow priority)
   - But may negotiate if you're reliable customer

3. Seasonal terms: "Normal Net 30, but Net 60 during Q4 buildup"
   - Suppliers often accept (understand cash flow needs)
   - Helps manage seasonal cash gaps

4. Tiered terms: "Pay Net 15 if full payment, Net 30 if half payment"
   - Supplier incentivizes faster cash
   - You get flexibility

**Optimizing Payment Timing**

Month-to-month cash management:

Track payment obligations:

| Due Date | Vendor | Amount | Impact |
|----------|--------|--------|--------|
| Jan 10 | Payroll | £400K | Must pay (employees) |
| Jan 20 | Vendors | £100K | Pay only if cash available |
| Feb 5 | Rent | £50K | Must pay |

Use AP strategically:

- Pay payroll on time (required, impacts morale)
- Delay vendor payments (negotiate if cash tight)
- Negotiate rent (sometimes can delay, renegotiate terms)

Example cash prioritization:

Available cash: £600K
Obligations: £550K

Choices:
1. Pay everything on time (£600K spent, £50K left)
2. Delay non-critical vendors (pay £450K, keep £150K buffer)

Healthy business: Pay everything on time
Tight cash: Prioritize payroll, stretch other payments

**Payment Terms and Supplier Relationships**

Risk: Stretch payment too far, supplier cuts off

Example:

Supplier expected Net 30
You pay Net 60 (double the term)

Supplier impacts:
- Month 1-2: Waiting for payment (may stop shipments)
- Month 3: Payment finally comes
- Relationship damaged (supplier less willing to work with you)

Better approach:

Supplier expected Net 30
You negotiate Net 45 upfront:
- "We'd like to pay in 45 days. You'll still get paid, just slightly later."
- Supplier agrees (prefers guaranteed 45-day payment vs surprised 60-day payment)

Transparency builds relationships. Surprises damage them.

**Early Payment Discounts**

Some suppliers offer discounts for early payment:

Example:

Invoice: £10K
Terms: 2/10, Net 30 (2% discount if pay within 10 days)

Calculate ROI of taking discount:

Discount: 2% × £10K = £200
Time saved: 20 days (pay day 10 vs day 30)
Annual rate: (2% / 20 days) × 365 = 36.5% annual return

If you can borrow at 8%, taking discount saves 8% cost = excellent.

But if you have to deplete cash reserves to take discount, better to pay on time and keep cash.

Decision rule:
- Take discount if: Cost to borrow <discount % (borrow to pay early)
- Skip discount if: Cash more valuable than discount (hold cash)

**AP Aging and Health**

Just like AR aging, track AP aging:

| Age | Amount | % of Total |
|-----|--------|-----------|
| Current (0-30) | £300K | 60% |
| 31-60 days | £150K | 30% |
| 60+ days | £50K | 10% |
| **Total AP** | **£500K** | **100%** |

Normal: Most AP is current (you pay on time)
Problem: Large 60+ balance (you're delaying payments)

High 60+ balance signals:
- Cash shortage (can't pay suppliers)
- Supplier relationships at risk
- Reputation damage

Goal: Keep most AP current, only delay when strategic need.
`
      },
      {
        heading: "Cash Flow Forecasting and Management",
        body: `Building a cash flow forecast is critical for managing working capital.

**Monthly Cash Flow Projection**

Simple template:

| Line Item | Month 1 | Month 2 | Month 3 |
|-----------|---------|---------|---------|
| **Cash In** | | | |
| Customer payments | £100K | £110K | £120K |
| Loan proceeds | £0 | £0 | £0 |
| **Total Cash In** | **£100K** | **£110K** | **£120K** |
| | | | |
| **Cash Out** | | | |
| Payroll | £80K | £80K | £85K |
| Vendor payments | £30K | £30K | £35K |
| Rent | £10K | £10K | £10K |
| **Total Cash Out** | **£120K** | **£120K** | **£130K** |
| | | | |
| **Net Cash Flow** | **-£20K** | **-£10K** | **-£10K** |
| | | | |
| **Beginning Cash** | £200K | £180K | £170K |
| **Ending Cash** | **£180K** | **£170K** | **£160K** |

This shows:
- Month 1: -£20K cash burn, ending with £180K
- Month 2: -£10K burn, ending £170K
- Month 3: -£10K burn, ending £160K

Problem: At this rate, cash runs out in month 20 (£160K / £10K burn).

Action: Increase revenue, reduce expenses, or secure credit line.

**Working Capital Needs by Stage**

Startup (£0-1M revenue):
- Low cash balance needed (£100K-£300K)
- High burn rate (cash depletes quickly)
- Need credit line or frequent fundraising

Growth (£1-10M revenue):
- Moderate cash balance (£500K-£2M)
- Manage AR and AP strategically
- Line of credit helpful for seasonal needs

Mature (£10M+ revenue):
- Large cash balance (£2M-£10M+)
- Operating cash flow positive (generate more than spend)
- May use credit for growth acceleration only

**Cash Metrics to Track**

Monthly metrics:

1. Days Cash on Hand (DCOH):
   - Formula: Cash on hand / Daily burn rate
   - Example: £1M cash / £10K daily burn = 100 days
   - Tells you months of runway

2. Cash Runway:
   - Days cash on hand / 30
   - Example: 100 days / 30 = 3.3 months
   - How long until cash depleted

3. Free Cash Flow:
   - Operating cash flow - Capital expenditures
   - Positive = generating cash (good)
   - Negative = consuming cash (bad)

4. Operating Cash Flow Ratio:
   - Operating cash flow / Monthly burn
   - >1.5x = positive (generating more than spending)
   - <1.0x = negative (spending more than generating)

Track these monthly. Trending shows health.

**Cash Management During Growth**

Paradox: Fastest-growing companies often have cash problems.

Reason:
- Growing revenue requires upfront investment (payroll, inventory, marketing)
- Collections lag (customer pays 30-60 days later)
- Gap between spend and collection widens

Example:

Month 1: Revenue £100K (collect £50K), spend £80K, net -£30K
Month 2: Revenue £150K (collect £100K), spend £90K, net +£10K
Month 3: Revenue £200K (collect £125K), spend £100K, net +£25K

Growing from £100K to £200K revenue (100% growth)
But Month 1-2 cash is negative (burn cash despite growth)

Solution:
- Working capital loan (short-term credit to fund gap)
- Collect upfront or faster (reduce AR)
- Slow hiring temporarily (reduce spend)
- Delay non-critical expenses

Most growing companies use working capital line of credit (£500K-£1M available) to smooth these gaps.
`
      }
    ],
    relatedSlugs: [
      "cash-conversion-cycle",
      "days-sales-outstanding-ar-management",
      "burn-rate-and-cash-runway-analysis",
      "financial-forecasting-modeling",
      "accounts-receivable-management-credit-terms"
    ],
    faq: [
      {
        q: "What's a healthy cash conversion cycle?",
        a: "Negative is best (collect before you pay suppliers). SaaS should be <0 (annual upfront). Product companies 30-60 days typical. Services 0-30 days. Calculate as: Days inventory + Days sales outstanding - Days payable. Lower is better (frees cash). Target: Reduce by extending payment terms and accelerating collections."
      },
      {
        q: "How do I improve cash flow without cutting expenses?",
        a: "Three levers: (1) Collect faster (reduce DSO: invoice immediately, offer early payment discount, use subscriptions). (2) Pay slower (extend DPO: negotiate longer terms with suppliers). (3) Reduce inventory (minimize days held). Combined, these can free £100K-£500K+ without cutting. Trade-off: Supplier relationships (pay slow carefully)."
      },
      {
        q: "What's the difference between profit and cash flow?",
        a: "Profit = Revenue minus expenses (timing of revenue recognition). Cash = Actual money in/out. Example: £100K revenue on invoice (profit), customer pays 60 days later (cash). You're profitable but cash-negative. Growing companies common problem: revenue grows but cash lags collections."
      },
      {
        q: "Should I negotiate longer payment terms with suppliers?",
        a: "Yes, but carefully. Negotiate upfront (ask for Net 45 instead of Net 30) rather than delay surprise. Supplier relationships are asset—don't damage them. If supplier offers 2/10 Net 30 discount, take it only if you have cash (don't deplete reserves to pay early unless borrowing rate lower than discount)."
      }
    ],
    videoUrl: ""
  }
];

export default batch126Articles;
