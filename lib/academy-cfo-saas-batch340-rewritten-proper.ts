import { AcademyArticle } from "@/types/academy";

export const batch340Articles: AcademyArticle[] = [
  {
    slug: "gross-margin-optimization-and-cost-of-revenue",
    title: "Gross Margin Optimization and Cost of Revenue: Improving Unit Economics",
    description: "Master gross margin. Analyze COGS, reduce costs, improve profitability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["gross margin", "COGS", "cost of revenue", "margin optimization", "variable costs"],
    keyTakeaways: [
      "Gross margin definition: (Revenue - COGS) / Revenue. COGS = direct costs to deliver product (hosting, support, payment processing). Example: £100K revenue, £30K COGS = £70K gross profit (70% margin). Benchmark: SaaS 70-85% (good), <50% problematic. Impact: High margin = more money for operating (growth, salaries). Low margin = need high volume to be profitable.",
      "COGS components: (1) Cloud hosting (5-15% typical), (2) Payment processing (2-3%), (3) Support costs (3-5%), (4) COGS of goods (if product), (5) Other direct costs. Optimize: Each component can be improved 10-30% (£100K COGS → £70-80K COGS possible). Tools: Monitor per-customer COGS (should decrease as scale, not increase).",
      "Operating leverage: As scale, COGS per customer decreases. Example: £10K hosting serves 100 customers (£100/customer), then 500 customers (£20/customer). Gross margin: 60% → 80% (huge improvement). Key: Don't waste leverage (avoid expensive features, optimize infrastructure). Target: 75%+ gross margin for sustainable SaaS business."
    ],
    content: [
      {
        heading: "Analyzing and Optimizing Gross Margin and Cost of Revenue",
        body: `Building sustainable unit economics through cost optimization.

**Gross margin fundamentals**

Definition:
- Gross margin = (Revenue - COGS) / Revenue
- COGS = Cost of Goods Sold (direct costs to deliver product)
- Shows: How much of each revenue dollar is available for operations

Formula example:

Revenue: £100K
COGS: £30K (direct costs)
Gross profit: £70K (£100K - £30K)
Gross margin: 70% (£70K / £100K)

Interpretation:
- 70% margin: 70 cents per pound available for operations
- 30% to COGS: 30 cents per pound spent on delivery

Benchmark by business model:

| Model | Margin | Notes |
|---|---|---|
| Pure SaaS | 75-90% | Mostly hosting + payment |
| SaaS + consulting | 60-75% | Some service delivery |
| Marketplace | 20-40% | High payment to partners |
| Product + support | 50-70% | Mix of product and labor |
| B2B services | 30-50% | Labor-intensive |

Target: 70%+ for sustainable SaaS

**COGS components and analysis**

Component 1: Cloud hosting (infrastructure)

Typical cost: 5-15% of revenue

Calculation example:
- AWS bill: £10K/month
- Revenue: £100K/month
- Hosting as % of revenue: 10%

Per-customer cost (scaling indicator):
- 100 customers: £10K / 100 = £100 per customer/month
- 500 customers: Same £10K (optimized) = £20 per customer (4x leverage!)
- 1000 customers: £12K (minimal overhead increase) = £12 per customer (still very efficient)

Key insight: Cloud hosting should decrease per-customer as scale (if architected right)

Optimization tactics:

Tactic 1: Right-sizing
- Current: Overprovisioned (more capacity than needed)
- Fix: Reduce instance sizes, use cheaper regions, rightsizing tools
- Expected: Save 20-30% of hosting costs

Tactic 2: Auto-scaling
- Current: Static capacity, pay for peak even in off-hours
- Fix: Auto-scale infrastructure (scale down at night, weekends)
- Expected: Save 15-25% (depends on usage pattern)

Tactic 3: Caching and optimization
- Current: Every request hits database
- Fix: Cache frequently accessed data, optimize queries
- Expected: Reduce CPU/bandwidth, save 10-20%

Tactic 4: Negotiate better rates
- Current: Standard cloud pricing
- Fix: Volume discounts (Amazon credits, reserved instances)
- Expected: Save 10-15% at scale (£5M+ spend)

Combined potential: Reduce hosting from 10% → 6-7% of revenue (30-35% reduction)

Component 2: Payment processing

Typical cost: 2-3% of revenue

Calculation:
- Stripe charges: 2.2% + £0.30 per transaction
- £100K revenue, 500 transactions
- Cost: (£100K × 2.2%) + (500 × £0.30) = £2,200 + £150 = £2,350 (2.35%)

Optimization:
- Negotiate lower rate (Stripe volume discounts)
- Reduce failed payments (lower retries = fewer charges)
- Optimize transaction size (batch vs individual)
- Expected: Reduce from 2.35% → 2.0% (save £350/month on £100K revenue)

Component 3: Support and hosting costs

Typical cost: 3-5% of revenue

Calculation:
- Support team: 2 people × £30K = £60K/year
- Customers: 500 (200 who use support heavily)
- Cost per customer: £60K / 500 = £120/customer/year
- As % of revenue: (£60K / £100K × 12 months) = 60% = 5% (if £100K/month)

Optimization tactics:

Tactic 1: Self-service
- Current: Support team handles common questions
- Fix: Build self-serve knowledge base, chatbot
- Expected: Reduce support tickets 30%, lower cost to 3.5%

Tactic 2: Improve product (reduce support need)
- Current: Confusing UI, bugs, missing docs
- Fix: Improve UX, fix bugs, add help text
- Expected: Fewer support requests, reduce to 3%

Tactic 3: Community support
- Current: All support from company
- Fix: Build community (Slack, forums, peer support)
- Expected: Customers help each other, reduce cost to 2%

Component 4: COGS of goods (if applicable)

For product-based businesses:

Typical cost: 30-50% of revenue

Example:
- Product cost: £30 per unit
- Price: £100 per unit
- COGS: 30%

Optimization:
- Negotiate better supplier rates
- Improve manufacturing efficiency
- Economies of scale (buy in bulk)
- Expected: Reduce from 30% → 25% (17% improvement)

**Gross margin trends and targets**

Early stage (pre-revenue to £1M ARR):
- Gross margin: 60-75% typical
- Focus: Build product, not yet optimized
- Target: 65%+

Growth stage (£1M-10M ARR):
- Gross margin: 70-80%
- Focus: Optimize infrastructure, improve efficiency
- Target: 75%+

Scale stage (£10M-100M ARR):
- Gross margin: 75-85%
- Focus: Leverage (infrastructure costs fixed, spreading)
- Target: 80%+

Mature stage (£100M+):
- Gross margin: 80-90%
- Focus: Pure leverage (scale)
- Target: 85%+

**Gross margin by customer segment**

Enterprise customers:
- Margin: 80-90% (economies of scale)
- Reason: Hosting cost per customer low, payment processing low (large transactions), support efficient

Mid-market customers:
- Margin: 75-80% (good leverage)
- Reason: Some hosting cost, moderate support

SMB/self-serve customers:
- Margin: 60-70% (less leverage, more support)
- Reason: Support cost per customer higher (relative), more payment processing cost

Strategy: Enterprise most profitable, focus there

**Operating leverage in action**

Scenario: SaaS company scaling

Month 1: £10K revenue
- Hosting: £2K (20% COGS)
- Payment: £250 (2.5% COGS)
- Support: £1.5K (15% COGS)
- Total COGS: £3.75K (37.5% COGS, 62.5% margin)

Month 6: £30K revenue
- Hosting: £3K (10%, optimized, same infrastructure)
- Payment: £750 (2.5%, scales with revenue)
- Support: £2K (6.7%, better processes)
- Total COGS: £5.75K (19.2% COGS, 80.8% margin)

Month 12: £100K revenue
- Hosting: £7K (7%, more optimized)
- Payment: £2.5K (2.5%, same rate)
- Support: £4K (4%, self-serve reduces ticket volume)
- Total COGS: £13.5K (13.5% COGS, 86.5% margin)

Trend: Margin improves from 62.5% → 80.8% → 86.5% (operating leverage in action)

**Margin dashboard and monitoring**

Monthly metrics:

| Item | Amount | % of revenue | Target | Status |
|---|---|---|---|---|
| Revenue | £100K | 100% | £120K | -17% |
| Hosting | £7K | 7% | 6% | Over |
| Payment processing | £2.5K | 2.5% | 2% | Over |
| Support | £4K | 4% | 3% | Over |
| Other COGS | £1K | 1% | 1% | On |
| Total COGS | £14.5K | 14.5% | 12% | Over |
| Gross profit | £85.5K | 85.5% | 88% | Under |

Analysis:
- Revenue below target (-17%, investigate)
- Gross margin below target (14.5% vs 12% target)
- Hosting high (7% vs 6%), needs optimization
- Payment processing high (2.5% vs 2%), negotiate rates

Actions:
- Fix hosting (optimize, reduce from 7% to 6%)
- Negotiate payment (get down from 2.5% to 2%)
- Support efficient (already 4%, on track to 3% with scale)

Expected improvement:
- Reduce COGS from 14.5% to 12% (2.5% improvement)
- Gross margin: 85.5% → 88% (target achieved)

**Common margin mistakes**

Mistake 1: Ignore COGS as scale
- Problem: Assume COGS stays same (doesn't increase as revenue grows)
- Reality: Some COGS grows with revenue (payment processing, support), some is fixed (hosting)
- Fix: Track COGS as % of revenue, optimize components separately
- Impact: Margin degradation caught early

Mistake 2: No per-customer tracking
- Problem: Know average margin (80%), don't know if expensive customers have low margin
- Fix: Calculate margin per customer segment
- Impact: Identify unprofitable segments, adjust pricing or support

Mistake 3: Neglect support cost
- Problem: Build product, skip on support efficiency
- Fix: Invest in self-serve, community, automation
- Expected: Support cost reduce from 5% to 2% (3% margin improvement, material)

Mistake 4: Expensive features
- Problem: Build features that increase hosting cost (no ROI analysis)
- Fix: Analyze feature cost/benefit (does new feature justify hosting increase?)
- Impact: Margin discipline

`
      }
    ],
    relatedSlugs: ["profitability-analysis-and-operating-leverage", "unit-economics-ltv-cac-payback", "pricing-strategy-and-price-optimization", "metrics-dashboard-design-kpi-tracking", "financial-planning-and-budgeting"],
    faq: [
      { q: "What is gross margin and why does it matter?", a: "Gross margin = (Revenue - COGS) / Revenue. COGS = direct costs (hosting, payment processing, support). Example: £100K revenue, £30K COGS = 70% margin. Benchmark: SaaS 70-85% healthy. Matters: More margin = more for operations (growth, salaries). Low margin = need volume to be profitable. Target: 75%+ for sustainable SaaS." },
      { q: "What are the main COGS components?", a: "Cloud hosting: 5-15% (optimize with auto-scaling, caching). Payment processing: 2-3% (negotiate volume discounts). Support: 3-5% (improve with self-serve, chatbot, community). Other: 1-3% (various). Total: Target 12-25% COGS (75-88% margin). Optimize each: Hosting 20-30% savings possible (right-size, optimize), support 30-50% (self-serve), payment 10-15% (negotiate)." },
      { q: "How do I improve gross margin?", a: "Tactics: (1) Reduce hosting (auto-scale, caching, negotiate volume), expect 20-30% savings. (2) Reduce support (self-serve, chatbot, community), expect 30-50% savings. (3) Negotiate payments, expect 10-15% savings. (4) Improve product (fewer support questions). Combined: Improve margin from 70% to 80%+ (operating leverage). Monitor: Track as % of revenue (should decrease as scale)." }
    ],
    videoUrl: ""
  }
];

export default batch340Articles;
