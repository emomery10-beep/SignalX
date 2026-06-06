import { AcademyArticle } from "@/types/academy";

export const batch93Articles: AcademyArticle[] = [
  {
    slug: "quick-ratio-liquidity-analysis",
    title: "Quick Ratio and Liquidity Analysis: Understanding Short-Term Financial Health",
    description: "Analyze liquidity: measure quick ratio, understand cash position, and ensure ability to pay short-term obligations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "quick ratio",
      "liquidity",
      "liquidity analysis",
      "cash position",
      "working capital",
      "liquid assets",
      "current ratio",
      "financial health",
      "short-term obligations",
      "balance sheet"
    ],
    keyTakeaways: [
      "Quick ratio = (Cash + Accounts receivable) ÷ Current liabilities; measures ability to pay bills in next 90 days; example: £500K cash + £200K AR = £700K liquid assets; current liabilities (payroll, vendor bills, debt) = £600K; quick ratio = 1.17x (healthy, >1.0 = can pay bills); <0.8x = risky (not enough liquid assets)",
      "SaaS liquidity is unique: Deferred revenue is liability (not cash, but obligation already paid for); example: £1M deferred revenue + £500K cash = £1.5M liquid position (customers already prepaid); cash poor but revenue strong SaaS still solvent (deferred revenue > liabilities); pure cash position misses this",
      "Improve liquidity: Accelerate collections (collect customer payments faster), negotiate longer payment terms with vendors (pay later), raise capital (deferred revenue or funding), or reduce burn (cut costs). Most common liquidity crisis: fast growth company, customers pay 60+ days late, but you pay vendors 30 days early = cash crunch despite growing revenue"
    ],
    content: [
      {
        heading: "Understanding Liquidity and the Quick Ratio",
        body: `Liquidity measures your ability to pay bills in the near term (next 90 days).

**Why Liquidity Matters**

Example: Two companies, same ARR, different liquidity

Company A (healthy liquidity):
- Cash: £500K
- Accounts receivable: £200K
- Current liabilities: £400K
- Quick ratio: (£500K + £200K) ÷ £400K = 1.75x
- Assessment: Can pay bills 1.75x over

Company B (poor liquidity):
- Cash: £100K
- Accounts receivable: £50K
- Current liabilities: £400K
- Quick ratio: (£100K + £50K) ÷ £400K = 0.375x
- Assessment: Can only pay 37% of bills (must get more cash or cut costs)

Same revenue, vastly different financial health. Company B is at risk of not making payroll or paying vendors.

**Quick Ratio Formula**

\`\`\`
Quick ratio = (Cash + Accounts receivable) ÷ Current liabilities
\`\`\`

Or more detailed:
\`\`\`
Quick ratio = (Current assets − Inventory) ÷ Current liabilities
\`\`\`

For SaaS (no inventory, deferred revenue is special):
\`\`\`
Quick ratio = (Cash + AR) ÷ (Payables + Payroll + Debt due)
\`\`\`

**Why AR and not inventory?**
- AR (accounts receivable): Money owed by customers (will be cash soon, usually 30-60 days)
- Inventory: Goods on shelves (harder to convert to cash quickly)

For SaaS, inventory is £0 (no physical goods), so quick ratio = (Cash + AR) ÷ Liabilities.

**Quick Ratio Benchmarks**

| Quick ratio | Health | Action |
|---|---|---|
| >1.5x | Excellent | No liquidity concerns |
| 1.0-1.5x | Healthy | Adequate |
| 0.8-1.0x | Caution | Monitor closely |
| <0.8x | Poor | Risk of not meeting obligations |
| <0.5x | Critical | Immediate action needed |

Healthy SaaS: 0.9-1.5x (slightly below 1.0 is OK if revenue growing fast and AR collectable soon).

**SaaS Liquidity Nuance: Deferred Revenue**

Deferred revenue complicates liquidity analysis.

Example:

Company with £1M deferred revenue:
- Cash: £500K
- Deferred revenue: £1M (customer already paid)
- Payables: £400K

Standard quick ratio: £500K ÷ £400K = 1.25x (healthy)

But reality:
- You have £500K cash (real)
- Customers already paid you £1M (cash already received, spread in revenue)
- You owe vendors £400K
- Effective liquid position: £500K + (portion of deferred revenue you'll collect as revenue) = much better

Adjusted liquidity: £500K + (£1M ÷ 12 months) ÷ £400K = very healthy (using first month of deferred revenue).

**Components of Current Liabilities**

What counts as "current liabilities" (due within 90 days)?

✓ Included:
- Accounts payable (vendor bills)
- Payroll payable (salaries, taxes)
- Debt due within year (portion of loans)
- Accrued expenses (expenses incurred, not yet paid)
- Deferred revenue (obligation to deliver service)

✗ Not included:
- Long-term debt (due >1 year)
- Equity (not a liability)

**Liquidity Analysis Example**

SaaS company balance sheet:

Assets:
- Cash: £500K
- Accounts receivable: £200K
- Prepaid expenses: £50K
- Equipment: £300K
- **Total current assets: £750K**

Liabilities:
- Accounts payable: £200K
- Payroll payable: £100K
- Deferred revenue: £400K
- Debt (due within year): £50K
- **Total current liabilities: £750K**

**Quick ratio** = (£500K + £200K) ÷ £750K = 0.93x (slightly tight, but acceptable)

If deferred revenue wasn't a true liability (should it count?):
- Adjusted quick ratio = (£500K + £200K) ÷ (£750K − £400K) = £700K ÷ £350K = 2.0x (excellent)

This shows why understanding what counts as "liability" matters.

**Improving Liquidity**

Three levers:

1. **Accelerate collections** (increase AR conversion to cash)
   - Current: Customers pay 60 days after invoice
   - Target: Customers pay 30 days after invoice
   - Action: Shorter payment terms, early payment discounts
   - Impact: AR decreases, cash increases

2. **Slow down payables** (extend payment terms)
   - Current: Pay vendors 30 days
   - Target: Pay vendors 45-60 days
   - Action: Negotiate extended terms
   - Impact: Payables increase (liability), but you keep cash longer

3. **Reduce burn** (spend less cash)
   - Current: Burn £100K/month
   - Target: Burn £80K/month
   - Action: Cut costs, improve efficiency
   - Impact: Cash lasts longer (improved runway)

**Working capital optimization:**
- Accelerate collections (AR conversion faster)
- Defer payments (payables longer)
- Combined: Can improve liquidity 30-60 days

**Liquidity vs. Profitability**

Don't confuse the two:

**Profitable but illiquid:**
- Growing fast (100% YoY)
- Revenue >costs (profitable on paper)
- But customers pay 60 days late
- You pay vendors 30 days early
- Cash position negative (can't pay bills)
- Example: Many venture-backed SaaS during rapid growth

**Unprofitable but liquid:**
- Losses (costs > revenue)
- But huge cash reserves (raised capital)
- Can pay bills for 24+ months
- Company survives despite losses
- Example: Pre-revenue startups with funding

Ideal: Both profitable and liquid. If choose one, choose liquid (you can't operate without cash).

**Liquidity Crisis Signs**

Red flags:
- Quick ratio <0.8x
- Cash decreasing while revenue growing (collections lag)
- Payables aging (vendors not getting paid on time)
- Delayed payroll
- Line of credit drawn (accessing emergency credit)

These indicate cash crisis imminent.

**Liquidity Management Checklist**

Weekly:
- [ ] Monitor cash balance
- [ ] Track AR aging (how old are invoices?)
- [ ] Verify payroll funds (always pay on time)
- [ ] Monitor new payables

Monthly:
- [ ] Calculate quick ratio
- [ ] Compare to prior month (trend?)
- [ ] Review AR aging (invoice >60 days = follow up)
- [ ] Negotiate vendor terms (extend payment if possible)

Quarterly:
- [ ] Review 13-week cash forecast
- [ ] Plan for any large payments (payroll, taxes, debt)
- [ ] Consider raising capital (if runway <6 months)
- [ ] Consider customer prepayment incentives (accelerate cash)

Liquidity management is often overlooked until it's a crisis. Stay ahead of it.
`
      }
    ],
    relatedSlugs: [
      "cash-management-and-forecasting",
      "burn-rate-runway-planning",
      "revenue-recognition-accrual-accounting",
      "financial-forecasting-modeling",
      "profitability-mechanics"
    ],
    faq: [
      {
        q: "What's a healthy quick ratio?",
        a: "1.0-1.5x is healthy. <0.8x is concerning. SaaS with growing revenue and deferred revenue can be below 1.0 if AR is collectable soon."
      },
      {
        q: "Should deferred revenue count in current liabilities?",
        a: "Yes, technically (obligation to deliver service). But remember it's cash already received. Use adjusted ratio for true liquidity picture."
      },
      {
        q: "How do I improve quick ratio?",
        a: "Accelerate collections (shorter payment terms), extend payables (negotiate longer vendor terms), or reduce burn (cut costs). Most impactful: faster collections."
      },
      {
        q: "Can a company be profitable but have liquidity issues?",
        a: "Yes. Fast growth + slow customer payments + fast vendor payments = cash crunch despite profit on paper. This is common in venture SaaS."
      }
    ],
    videoUrl: ""
  }
];

export default batch93Articles;
