import { AcademyArticle } from "@/types/academy";

export const batch341Articles: AcademyArticle[] = [
  {
    slug: "operating-expense-management-and-control",
    title: "Operating Expense Management and Control: Managing Spending",
    description: "Master opex management. Control spending, optimize allocation, maintain discipline.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["operating expenses", "expense management", "cost control", "spending discipline", "opex optimization"],
    keyTakeaways: [
      "Opex definition: Operating expenses (all non-COGS costs). Breakdown: Payroll (60-70% typical), tools (5-10%), marketing (10-20%), operations (5-10%). Control: Budget by category, require approval for spending. Higher amounts need higher approval. Example: <£1K anyone approves, £1-5K manager, >£5K CFO/CEO. Discipline: Prevents overspending, forces prioritization.",
      "Payroll control: Largest expense, hardest to cut. Approach: Hiring freeze before layoffs (less painful). Measure: Revenue per employee (should increase as scale). Benchmark: £100K-£300K revenue per employee typical. Ratio: If £100K revenue, 1-3 employees (depends on business). Monitor: Headcount plan (planned hires vs actual), salary increases, benefits cost.",
      "Tool expense management: Many low-cost SaaS tools add up (£1K/month easy). Audit: Quarterly review of all subscriptions (cancel unused). Negotiate: As company grows, negotiate volume discounts on key tools. Target: Tool cost 3-5% of revenue (5-10% is overspending). Combined payroll + tools = 65-85% of opex."
    ],
    content: [
      {
        heading: "Managing and Optimizing Operating Expenses",
        body: `Building expense discipline and operational efficiency.

**Operating expenses fundamentals**

Definition:
- All non-COGS business expenses
- Includes: Payroll, marketing, tools, rent, legal, etc.
- Key metric: Opex as % of revenue (lower is better)

Typical opex breakdown (£100K/month):

| Category | Amount | % of opex |
|---|---|---|
| Payroll | £60K | 60% |
| Marketing | £15K | 15% |
| Tools/SaaS | £8K | 8% |
| Rent/facilities | £4K | 4% |
| Professional services | £2K | 2% |
| Travel | £2K | 2% |
| Other | £9K | 9% |
| **Total** | **£100K** | **100%** |

Opex as % of revenue:
- Early stage (£100K revenue): 100-150% opex (losing money, investing)
- Growth stage (£1M revenue): 60-80% opex (approaching breakeven)
- Scale stage (£10M+ revenue): 30-40% opex (profitable)

Target: <60% opex by breakeven (£40K opex on £100K revenue = profitable)

**Payroll management**

Payroll breakdown:
- Salaries/wages: Base compensation
- Benefits: Health insurance, retirement, PTO (20-25% of salary)
- Taxes: Employer taxes (15-20% of salary)
- Recruitment: Cost to hire (5-10% of salary annually)

Total cost per employee:
- Base salary: £50K
- Benefits (25%): £12.5K
- Taxes (15%): £7.5K
- Total compensation cost: £70K

Hiring plan impact:
- Current: 10 employees @ £70K average = £700K
- Planned: Add 3 engineers @ £80K = £240K additional
- New total: £940K (+34% payroll increase)

Headcount control:

Philosophy: "Hire slowly, fire fast"
- Hiring: Thoughtful process (do we need this role? Can we wait?)
- Firing: Quick if not working (don't waste compensation on wrong fit)

Approval process:
- New role: CEO/board approval (significant expense)
- Salary: Based on market (£50-100K range for engineers)
- Benefits: Standard across company (no cherry-picking)
- Raises: Annual review (3-5% typical), promotions (10-15%)

Cost control mechanisms:
- Hiring freeze: Stop new hires when runway tight
- Salary bands: Prevent overpaying for roles
- Benefits cap: Offer good benefits, but cap cost (e.g., 80% health insurance)
- Bonus cap: Align with company performance

Revenue per employee:
- Metric: Total revenue / headcount
- Target: £100K-300K per employee (depends on business)
- Example: £1M revenue, 5 people = £200K per employee (healthy)
- Growth: As revenue grows faster than headcount, RPE improves

Monitoring:
- Monthly: Headcount report (actual vs plan)
- Quarterly: RPE analysis (is productivity improving?)
- Annual: Salary benchmarking (are we competitive?)

**Tool and software expense management**

Audit example: 50-person company typical tools

| Tool | Monthly | Annual | Use |
|---|---|---|---|
| Slack | £600 | £7.2K | Communication |
| Google Workspace | £200 | £2.4K | Email, docs, sheets |
| Salesforce | £2000 | £24K | CRM |
| Asana | £500 | £6K | Project management |
| Figma | £400 | £4.8K | Design |
| GitHub | £300 | £3.6K | Code repository |
| AWS | £3000 | £36K | Infrastructure |
| Stripe | £0 (2.2% processing) | Varies | Payments |
| Calendly | £100 | £1.2K | Scheduling |
| Zoom | £200 | £2.4K | Video meetings |
| Quadrant (analytics) | £150 | £1.8K | Analytics |
| Amplitude | £200 | £2.4K | Product analytics |
| Loom | £100 | £1.2K | Video recording |
| Notion | £100 | £1.2K | Internal wiki |
| Intercom | £250 | £3K | Customer chat |
| Other | £500 | £6K | Various |
| **Total** | **£8.5K** | **£102K** | |

Analysis:
- AWS: £36K (largest, necessary for infrastructure)
- Salesforce: £24K (necessary for sales)
- Everything else: £42K (smaller tools adding up)

Opportunity: Review "everything else"
- Cancel unused: Quadrant (analytics), Loom (not used)
- Renegotiate: Intercom (too expensive for use case, switch to Zendesk)
- Consolidate: Multiple analytics tools (keep one)
- Expected savings: £10-15K annually (10-15% of non-core tools)

Approval process for new tools:
- Under £100/month: Approver (person needing tool)
- £100-500/month: Manager approval
- £500-1000/month: Finance approval
- >£1000/month: CEO approval

Requirement: Business case (what problem does this solve? What's ROI?)

Example:
- Tool: Chorus (sales call recording)
- Cost: £500/month
- Business case: Improve sales coaching, reduce ramp time
- Expected: 2 week faster ramp per rep × £0.5K per week = £1K savings per hire
- ROI: £1K saving × 5 new hires per year = £5K benefit, £6K cost = -£1K (not approved)

Alternative: Use free Loom instead of Chorus

**Marketing spend control**

Budget allocation:

- Paid ads (Facebook, Google, LinkedIn): £10K/month
- Content marketing (blog, webinars, guides): £3K/month (freelancers, tools)
- Events (sponsorship, booth): £2K/month
- Email campaigns (automation, list management): £1K/month
- Sales enablement (collateral, training): £1K/month
- Public relations/analyst relations: £1K/month
- Total: £18K/month (18% of £100K opex)

Optimization:

ROI tracking:
- Paid ads: £10K spend, 20 customers acquired, £500 CAC, 12-month payback = acceptable
- Content: £3K spend, 5 customers/month acquired organically (hard to track), assume low CAC = excellent
- Events: £2K spend, 3 customers from events, £667 CAC, 20-month payback = expensive

Actions:
- Maintain paid ads (working)
- Invest in content (best ROI, scale)
- Reduce events (slow payback, reconsider)
- Kill low-ROI channel if any

Expected allocation:
- Paid ads: £8K (more efficient, scale)
- Content: £5K (invest, best ROI)
- Events: £1K (minimal)
- Other: £4K
- Total: £18K (same budget, different allocation = better ROI)

**Facility and administrative costs**

Rent/facilities:
- Office space: £4K/month
- Utilities: £500/month
- Internet: £200/month
- Insurance: £300/month
- Total: £5K/month

With remote work (shift to hybrid):
- Office downsized 50% (London expensive)
- New rent: £2K/month
- Utilities: £200/month
- Internet: £100/month
- Insurance: £150/month
- Total: £2.5K/month (50% savings)

Remote work benefit: 30-person team, 30% want office space occasionally = book shared space (£500/month) instead of permanent lease

Savings: £2.5K from opex (2.5% of opex, material at scale)

**Expense approval process**

Policy example:

| Amount | Approval | Speed | Use case |
|---|---|---|---|
| <£500 | Manager | Next business day | Supplies, small tools |
| £500-2K | Finance | 2-3 days | Larger purchases |
| £2K-10K | CFO | 3-5 days | Significant spend |
| >£10K | CEO/Board | 1-2 weeks | Major commitments |

Controls:
- Budget: Department must have budget approved (no surprise spending)
- Receipts: Keep all receipts (audit trail, tax deduction)
- PO: Use purchase orders for >£1K (binding commitment)
- Vendor vetting: Check vendor reliability (don't work with unknown suppliers)

**Opex monitoring dashboard**

Monthly metrics:

| Category | Budgeted | Actual | Variance | Status |
|---|---|---|---|---|
| Payroll | £60K | £61K | +£1K | +1.7% |
| Marketing | £15K | £16K | +£1K | +6.7% |
| Tools | £8K | £8.2K | +£0.2K | +2.5% |
| Rent/facilities | £5K | £5K | £0 | On |
| Professional | £2K | £1.5K | -£0.5K | -25% |
| Travel | £2K | £1K | -£1K | -50% |
| Other | £8K | £7.5K | -£0.5K | -6.3% |
| **Total** | **£100K** | **£100.2K** | **+£0.2K** | **+0.2%** |

Analysis:
- Payroll slightly over (1 person not budgeted?)
- Marketing over (need to investigate, reduce elsewhere)
- Professional services under (good, less need for contractors)
- Travel under (team not traveling)
- Overall: On budget (total £100.2K vs £100K)

Quarterly review:
- Trend: Is opex creeping up? (should decrease as % of revenue)
- Efficiency: RPE (revenue per employee) improving?
- Allocation: Is money going to right places (growth channels)?

Target: Opex from 100% revenue → 60% by breakeven (2-3 years)

**Common opex mistakes**

Mistake 1: No budget discipline
- Problem: Spend without planning, budget useless
- Fix: Monthly actuals vs budget, variance review
- Impact: Catch overspending early, adjust course

Mistake 2: Ignore small expenses
- Problem: £100/month tools × 50 = £5K/month waste
- Fix: Quarterly tool audit (cancel unused)
- Impact: Easy 5-10% savings

Mistake 3: Hiring without planning
- Problem: Hire for growth, then burn rate spikes
- Fix: Headcount plan (when to hire, for what)
- Impact: Controlled payroll growth

Mistake 4: No approval limits
- Problem: Anyone can spend anything (chaos)
- Fix: Tiered approval (amount determines who approves)
- Impact: Accountability, discipline

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "profitability-analysis-and-operating-leverage", "metrics-dashboard-design-kpi-tracking", "burn-rate-optimization-and-runway-extension", "cash-runway-and-burn-rate-management"],
    faq: [
      { q: "What should I track for opex management?", a: "Categories: Payroll (60-70% typical), marketing (10-20%), tools (5-10%), operations (5-10%). Track: Budget vs actual monthly, variance >5% investigate. Key metric: Opex as % of revenue (should decrease as scale). Approval limits: <£500 manager, £500-2K finance, >£2K CFO. Discipline: Prevents overspending, forces prioritization." },
      { q: "How do I control payroll costs?", a: "Payroll is 60-70% of opex. Approach: Hiring freeze before layoffs (less painful). Metric: Revenue per employee (£100K-300K typical). Control: Salary bands (prevent overpaying), benefits standard, bonus tied to performance. Monitor: Headcount plan vs actual, RPE improving? Benchmark: Annually check market rates." },
      { q: "How do I manage tool costs?", a: "Audit quarterly: List all subscriptions, identify unused (cancel them). Cost control: <£100/month individual approval, >£500/month needs business case (ROI). Consolidate: Multiple tools for same function = choose best. Negotiate: As company grows, get volume discounts. Target: 3-5% of revenue for tools (5-10% is overspending)." }
    ],
    videoUrl: ""
  }
];

export default batch341Articles;
