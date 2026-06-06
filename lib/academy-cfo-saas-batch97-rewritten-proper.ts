import { AcademyArticle } from "@/types/academy";

export const batch97Articles: AcademyArticle[] = [
  {
    slug: "p-l-statement-architecture-profitability",
    title: "P&L Statement Architecture: Understanding Cost Structure and Profitability",
    description: "Master the income statement structure. Learn cost categories, margin calculations, and how to analyze profitability drivers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "P&L statement",
      "income statement",
      "revenue",
      "cost of goods sold",
      "COGS",
      "gross margin",
      "operating expenses",
      "EBITDA",
      "net income",
      "profitability"
    ],
    keyTakeaways: [
      "P&L structure: Revenue − COGS = Gross profit; Gross profit − Operating expenses = Operating income; Operating income ± Interest/Tax = Net income; example: £1M revenue − £300K COGS (30%) = £700K gross profit; £700K − £400K opex (40%) = £300K operating income; healthy SaaS gross margin 70-85%, opex ratio 30-50% of revenue",
      "COGS includes direct delivery costs (hosting, payment processing, support salaries, cost of goods if applicable); Operating expenses include sales, marketing, R&D, G&A; SaaS typically: COGS 20-30%, S&M 30-50%, R&D 15-25%, G&A 10-15%; as you scale, COGS % decreases (leverage in cloud), S&M % may decrease (efficient scaling)",
      "Margin analysis by metric: Gross margin (profit after delivery costs), Operating margin (profit after all operating costs), Net margin (profit after taxes/interest); profitability path: increase gross margin (product efficiency) + decrease COGS % (scale) + control opex growth (operating leverage); targeting: 70%+ gross margin, +10-20% operating margin by maturity"
    ],
    content: [
      {
        heading: "The P&L Statement Structure",
        body: `The Profit & Loss statement (P&L) shows your business's profitability by tracking revenue and expenses.

**Basic P&L Structure**

Revenue
− Cost of Goods Sold (COGS)
= Gross Profit
− Operating Expenses
  − Sales & Marketing
  − Research & Development
  − General & Administrative
= Operating Income (EBIT)
± Interest Expense / Income
± Taxes
= Net Income (Bottom line)

**Real SaaS Example**

£1M SaaS company, annual:

Revenue: £1,000K

Cost of Goods Sold:
  Cloud hosting: £80K
  Payment processing: £20K
  Customer support: £60K
  Total COGS: £160K (16% of revenue)

Gross Profit: £840K (84% gross margin)

Operating Expenses:
  Sales & Marketing: £300K
  Research & Development: £200K
  General & Administrative: £100K
  Total Opex: £600K

Operating Income: £240K (24% operating margin)

Interest Expense: £10K

Income before tax: £230K
Taxes (25%): £57.5K

Net Income: £172.5K (17.25% net margin)

**Understanding Each Line Item**

**Revenue**

Total income from customers (before any deductions).

For SaaS:
- Monthly subscriptions: £500K ARR × £1M customers = £500K MRR (if 1000 customers)
- Annual prepaid contracts: recorded as revenue monthly (deferred revenue liability decreases)
- One-time setup fees: recorded as revenue upfront

**Cost of Goods Sold (COGS)**

Direct costs to deliver the service (scale with revenue).

For SaaS COGS includes:
- Cloud infrastructure (AWS, Azure hosting): £80K
- Payment processing (Stripe fees): 2.2% of revenue × £1M = £22K
- Customer support salaries: £60K (team dedicated to support)
- Data center costs: £15K
- License costs (3rd party software): £10K

COGS does NOT include:
- Sales salaries (included in S&M)
- Engineering salaries (included in R&D)
- Office rent (included in G&A)

Why separate COGS from opex?
- COGS scales with revenue (more customers = higher COGS)
- Opex is mostly fixed (same whether you have 100 or 10,000 customers, initially)

**Gross Profit & Gross Margin**

Gross Profit = Revenue − COGS
Gross Margin % = (Revenue − COGS) ÷ Revenue

Example:
- Revenue: £1M
- COGS: £160K
- Gross Profit: £840K
- Gross Margin: 84%

Interpretation: For every £1 of revenue, you keep 84p after paying direct costs (keep 84p, spend 16p on delivery).

SaaS gross margin benchmarks:
- Early stage (<£1M ARR): 60-75% (not yet optimized)
- Growth stage (£1-10M ARR): 75-80%
- Mature (>£10M ARR): 80-90%

Improving gross margin:
- Lower cloud hosting costs (negotiate with AWS, move to cheaper providers)
- Reduce payment processing fees (negotiate with Stripe, move to cheaper payment providers)
- Support efficiency (improve automation, self-service, reduce support headcount per customer)
- Increase prices (if customers willing to pay, raises revenue without proportional COGS increase)

**Operating Expenses**

Indirect costs to run the business (mostly fixed).

Sales & Marketing (S&M):
- Sales team salaries: £150K
- Marketing salaries: £80K
- Advertising spend: £50K
- Marketing tools (HubSpot, etc.): £20K
- Total S&M: £300K (30% of revenue)

Research & Development (R&D):
- Engineering salaries: £150K
- Product manager salary: £50K
- Engineering tools/licenses: £20K
- Total R&D: £220K (22% of revenue)

General & Administrative (G&A):
- CEO salary: £80K
- Finance/HR salaries: £30K
- Legal/professional services: £20K
- Office rent: £15K
- Total G&A: £145K (14.5% of revenue)

Total Opex: £665K (66.5% of revenue)

**Operating Income (EBIT)**

Operating Income = Gross Profit − Operating Expenses

Example:
- Gross Profit: £840K
- Operating Expenses: £665K
- Operating Income: £175K (17.5% operating margin)

Operating margin is the key profitability metric (excludes financing and taxes, which vary by company structure).

Healthy SaaS operating margin progression:
- Startup (pre-product-market fit): −50% to −100% (losing money on each dollar of revenue)
- Growth stage: −20% to +10% (approaching breakeven)
- Mature (achieved profitability): +15% to +30%

**Interest Expense & Taxes**

Interest Expense (if you have debt):
- Loan interest: £10K/year (on £200K debt at 5%)
- Reduces operating income

Example:
- Operating Income: £175K
- Interest Expense: −£10K
- Income Before Tax: £165K

Taxes:
- Corporate tax rate (varies by country): 25% (example UK)
- Tax = £165K × 25% = £41.25K

Net Income (Bottom Line):
- After-tax profit: £165K − £41.25K = £123.75K
- Net margin: 12.4% of revenue

**Margin Hierarchy**

| Margin | Calculation | Meaning |
|--------|-------------|---------|
| Gross margin | (Revenue − COGS) ÷ Revenue | Profit after direct delivery costs |
| Operating margin | (Revenue − COGS − Opex) ÷ Revenue | Profit after all operating costs |
| EBITDA margin | Operating margin + D&A | Profit before financing and taxes |
| Net margin | Net Income ÷ Revenue | Final profit after all expenses |

Example for £1M revenue company:
- Gross margin: 84% (£840K)
- Operating margin: 17.5% (£175K)
- EBITDA margin: 20% (if £25K depreciation/amortization)
- Net margin: 12.4% (£124K)

Each margin tells a different story:
- Gross margin: How efficient is product delivery?
- Operating margin: How efficiently is the business run?
- Net margin: What actual profit is generated after all costs?

**Cost Structure Analysis**

Breaking down your opex by category:

Example £1M revenue SaaS:

Revenue by category (where each £1 goes):

For every £1 of revenue:
- £0.16 goes to COGS (delivery)
- £0.30 goes to S&M (customer acquisition and sales)
- £0.22 goes to R&D (product development)
- £0.15 goes to G&A (overhead)
- £0.17 is net profit

This £0.17 profit is your bottom line.

Strategic question: Is this allocation optimal?

If you want to grow faster:
- Increase S&M spend to £0.40 per £1 revenue
- This trades profitability (£0.17 → £0.07) for growth (more customers acquired)

If you want to improve profitability:
- Reduce S&M to £0.20 per £1 revenue
- This trades growth for profit (£0.17 → £0.27)

**Fixed vs. Variable Costs**

Fixed costs (don't change with revenue):
- Salaries (same whether you have 100 or 10,000 customers)
- Rent (office lease is fixed)
- Management overhead

Variable costs (scale with revenue):
- COGS (hosting, support, payment processing)
- Some commission-based sales

Leverage ratio = Fixed costs ÷ Total costs

Higher leverage (more fixed costs) = More operating leverage (small revenue increases drive big profit increases at scale).

Example:
- SaaS with 70% fixed costs: Every 10% revenue increase = 20%+ profit increase (at scale)
- Service business with 80% variable costs: Every 10% revenue increase = Only 5% profit increase

This is why scaling SaaS is profitable (high leverage), while service businesses struggle to scale profitably (low leverage).

**P&L Waterfall (Quarterly Analysis)**

Tracking P&L changes quarter to quarter:

Q1 P&L:
Revenue: £900K

Q2 P&L:
Revenue: £1,000K (+£100K vs Q1)

What drove the change?

Revenue analysis:
- New customer acquisition: +£80K
- Upsell/expansion: +£30K
- Churn: −£10K
- Net change: +£100K

COGS analysis:
- Increased from 17% to 16% of revenue (efficiency improvement)
- Saved: £1,520 (17% of £900K = £153K vs 16% of £1M = £160K) - actually cost more
- Better example: COGS decreased from £153K to £160K (efficiency improved, now only 16% vs 17%)

Opex analysis:
- S&M: Up £20K (more marketing spend to drive growth)
- R&D: Up £10K (invested in new features)
- G&A: Flat (no change)
- Total opex increase: £30K

Net profit impact:
- Revenue increase: +£100K
- COGS increase: −£7K (slight increase)
- Opex increase: −£30K
- Net income improvement: +£63K

This kind of analysis helps you understand profitability drivers and make strategic decisions.
`
      }
    ],
    relatedSlugs: [
      "gross-margin-expansion",
      "profitability-mechanics",
      "unit-economics-deep-dive",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What's a healthy gross margin for SaaS?",
        a: "70-85% is healthy. Under 70% indicates delivery is too expensive; over 85% means you may be underpricing. Monitor quarterly to catch increases in COGS."
      },
      {
        q: "What's the difference between gross margin and operating margin?",
        a: "Gross margin excludes operating expenses (salaries, rent). Operating margin includes them. Operating margin is lower but shows true operational efficiency."
      },
      {
        q: "Why is COGS separate from operating expenses?",
        a: "COGS scales with revenue (more customers = higher COGS). Opex is mostly fixed. Separating them shows unit economics and leverage."
      },
      {
        q: "How do I improve operating margin?",
        a: "Increase gross margin (reduce COGS as % of revenue), slow opex growth as you scale (operating leverage), increase prices, or reduce customer acquisition cost."
      }
    ],
    videoUrl: ""
  }
];

export default batch97Articles;
