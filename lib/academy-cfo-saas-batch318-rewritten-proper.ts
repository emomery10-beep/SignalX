import { AcademyArticle } from "@/types/academy";

export const batch318Articles: AcademyArticle[] = [
  {
    slug: "recurring-revenue-models-and-optimization",
    title: "Recurring Revenue Models and Optimization: Maximizing Predictable Revenue",
    description: "Master recurring revenue. Design models, optimize MRR, build predictable business.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["recurring revenue", "MRR", "subscription model", "revenue predictability", "ARR"],
    keyTakeaways: [
      "Recurring revenue model: Customer pays monthly/annually for access (vs one-time purchase). Benefit: Predictable revenue (forecast easily), customer lifetime value (long-term thinking), compounding growth (expansion from existing customers). Cost: More complex billing, customer retention critical. Example: £100K/month MRR, 50 customers, £2K per customer. If 5% monthly churn, lose £5K/month (need £5K new to stay flat). Benefit: Can forecast Year 1 as 12 × £100K = £1.2M (predictable).",
      "MRR vs ARR: MRR = monthly recurring revenue (£100K/month). ARR = annual run rate (£100K × 12 = £1.2M annual). NRR = net revenue retention (new + expansion revenue, minus churn). Example: £1M ARR, 30% NRR = £1.3M next year (30% growth from existing customers alone, without new sales).",
      "Models: Flat-rate (everyone pays same), tiered (Starter/Pro/Enterprise), usage-based (pay for consumption), hybrid (base + usage). Cost: Varies by model (usage-based needs metering). Benefit: Alignment (customers pay for value). Optimize: Test pricing, measure conversion (what price maximizes MRR?), expand (longer contract terms = more predictable)."
    ],
    content: [
      {
        heading: "Building and Optimizing Recurring Revenue",
        body: `Creating predictable, scalable revenue streams.

**Recurring revenue models**

Model 1: Flat-rate (most common)
- Structure: Single price, everyone pays same
- Example: £100/month for everyone
- Pros: Simple, easy to communicate, easy to forecast
- Cons: Unfair for different customer sizes (SMB pays same as enterprise)
- Best for: Horizontal SaaS, early stage

Model 2: Tiered pricing
- Structure: Multiple tiers (Starter, Pro, Enterprise) at different prices
- Example: Starter £50, Pro £200, Enterprise custom
- Pros: Align price to customer value, capture more revenue
- Cons: More complex, customer confusion (which tier?)
- Best for: Growth-stage SaaS, different use cases

Model 3: Usage-based
- Structure: Pay based on consumption (per user, per transaction, per GB)
- Example: £0.50 per API call, £20 per user per month
- Pros: Perfect alignment (customer pays for value used)
- Cons: Revenue unpredictable (customer usage varies), complex billing
- Best for: Infra/platform SaaS (AWS, Stripe model)

Model 4: Hybrid (flat + usage)
- Structure: Base fee + overage
- Example: £100/month (10 users), £10 per additional user
- Pros: Predictability (base) + alignment (usage)
- Cons: Complex, potential for surprise bills
- Best for: Growth-stage with multiple pricing dimensions

**MRR vs ARR**

MRR (Monthly Recurring Revenue):
- Definition: Revenue from subscriptions in a single month
- Example: 100 customers × £100/month = £10K MRR
- Use: Current month, month-to-month tracking
- Volatility: Varies with churn/new customers

ARR (Annual Recurring Revenue):
- Definition: MRR × 12
- Example: £10K MRR × 12 = £120K ARR
- Use: Valuation, annual planning, investor communication
- Benefit: Annualizes (smooths out monthly variance)

Net Revenue Retention (NRR):
- Definition: (Beginning ARR + expansion - churn) / Beginning ARR
- Example:
  - Start month: £100K ARR
  - Expansion: +£20K (customers upgrading, upsells)
  - Churn: -£5K (customers leaving)
  - End: £115K
  - NRR: £115K / £100K = 115% (strong)

NRR >100% = healthy SaaS (growing from existing, not just new)
NRR <100% = shrinking (churn > expansion, problematic)

**Optimizing recurring revenue**

Lever 1: Increase price

Mechanism: Raise price on renewals (2-5% annually typical)
- Example: Year 1 = £100/month, Year 2 = £105/month (+5%)
- Revenue impact: 5% increase on all customers
- Risk: Some churn from price increase (typical 0-2%)
- Net: Usually positive (gain more than lose)

Pricing optimization:
- Test: 50% of customers at new price, 50% at old price
- Measure: Churn rates (new vs old price)
- Decide: If new price churn acceptable, roll out to all

Example test:
- Price A (£100): 100 customers, 5% churn (5 lost)
- Price B (£110): 100 customers, 7% churn (7 lost)
- Revenue A: (100-5) × £100 = £9,500
- Revenue B: (100-7) × £110 = £10,230
- Win: Price B increases revenue (+£730 monthly, +7.7%)

Lever 2: Reduce churn

Mechanism: 1% monthly churn reduction = 10% LTV improvement
- Example: 5% churn → 4% churn
- Lifetime: 20 months → 25 months (+25%)
- Revenue: Same MRR but customer stays 25% longer
- Implementation: Better onboarding, customer success, product improvements

Example impact:

5% churn (baseline):
- 100 customers month 1
- 95 customers month 2
- 90 customers month 3
- Month 3 MRR: 90 × £100 = £9,000

4% churn (improved):
- 100 customers month 1
- 96 customers month 2
- 92 customers month 3
- Month 3 MRR: 92 × £100 = £9,200 (+£200)

Lever 3: Increase ARPU through expansion

Mechanism: Upsell/cross-sell existing customers
- Example: 30% of customers upgrade from Starter (£50) to Pro (£200)
- ARPU: (70% × £50) + (30% × £200) = £35 + £60 = £95
- Original: £50
- Improvement: +90% ARPU

NRR impact:
- Base: £1M ARR, 100 customers, £10K per customer
- Expansion: 30 customers upgrade (+£5K each) = +£150K ARR
- Churn: 5 customers leave (-£50K ARR)
- NRR: (£1M + £150K - £50K) / £1M = 110% (excellent)

**Contract length optimization**

Monthly vs annual:
- Monthly: Flexible for customer, uncertain for company (easy to churn)
- Annual: Locked in (less churn), revenue upfront (cash flow benefit)

Annual contracts:
- Revenue impact: Same annual revenue, but collected monthly vs upfront
- Cash flow: Massive benefit (get year's revenue day 1, vs drip over 12 months)
- Example: 100 customers × £1200/year
  - Monthly billing: £100K/month revenue, £100K/month cash
  - Annual upfront: £120K revenue, £120K cash upfront (month 1)

Multi-year contracts:
- Benefit: Super predictable (customer locked 3 years)
- Discount offered: Offer 10-15% discount to incentivize (still wins on cash flow)
- Example: £100/month (monthly) vs £1,080/year (10% discount annually) vs £3,000 (15% discount for 3 years)

Strategy:
- Encourage annual (discount 10%)
- Offer multi-year (discount 20%, huge value)
- Expected: 30-50% of customers on annual/multi-year

**Billing and payment**

Billing system requirements:
- Recurring: Monthly/annual automatic renewal
- Flexible: Pause, cancel, upgrade/downgrade mid-cycle
- Tax: Calculate and collect tax (VAT, sales tax)
- Internationalization: Multiple currencies, local compliance

Platform options:
- Stripe Billing: Comprehensive (recommended for SaaS)
- Zuora: Enterprise-grade (complex, powerful)
- Recurly: SaaS-focused
- Custom: Build your own (expensive, not recommended)

Cost: £0 (processing fee 2.2% + £0.30) to £500-1000/month (enterprise)

**Revenue forecasting**

Month-to-month forecast:

Starting MRR: £100K (100 customers × £1K)
- New customers: +10/month (£10K)
- Expansion: +£5K/month (existing customers upgrade)
- Churn: -5% of base (£5K)
- Monthly change: +£10K (new) + £5K (expansion) - £5K (churn) = +£10K

Month 1: £100K
Month 2: £110K
Month 3: £120K
Month 4: £130K
(Assuming constant rates)

Yearly projection:
- Month 1-12 average: ~£115K (growing)
- ARR equivalent: £115K × 12 = £1.38M annual revenue

But reality more complex:
- New customer growth may accelerate (more sales investment)
- Churn may increase (product issues, market shift)
- Expansion may plateau (saturation of upgrade market)

Best practice: Monthly forecast, update as you learn

**Optimization roadmap**

Month 1: Baseline
- Calculate: Current MRR, ARR, NRR, churn, expansion
- Benchmark: How do we compare to SaaS peers?
- Identify: What's lowest-hanging fruit?

Month 2-3: Quick wins
- Price increase: Test 2-3% increase on 50% of customers
- Expand upsell: Promote higher tiers to eligible customers
- Churn analysis: Why are customers leaving? Fix top issue
- Contract length: Encourage annual (offer 10% discount)

Month 4-6: Optimization
- Measure: Impact of changes (improved NRR? Higher ARPU?)
- Double down: What worked? Roll out to all customers
- Iterate: Continue testing and measuring
- Target: 10-15% improvement in overall revenue

Month 6-12: Scale
- ARR growth: Track MRR growth trajectory
- NRR target: Target >110% (expansion > churn)
- Long-term: Build sustainable recurring revenue model

**Key metrics to track**

Monthly dashboard:

| Metric | Current | Target | Trend |
|---|---|---|---|
| MRR | £100K | £120K | +5% MoM |
| ARR | £1.2M | £1.44M | Good |
| Churn | 5% | 3% | Needs work |
| Expansion | £5K | £8K | Below |
| ARPU | £1K | £1.2K | Below |
| NRR | 100% | 110%+ | Below |

Actions:
- Churn high: Improve onboarding, customer success
- Expansion low: Better upsell, product education
- ARPU low: Price increase testing, better tier positioning

**Common mistakes**

Mistake 1: Ignoring churn
- Problem: Focus on new customers, ignore that churn eats growth
- Fix: Monitor churn weekly, investigate increases immediately
- Impact: 5% churn reduces growth 50% vs 3% churn

Mistake 2: Monthly-only billing
- Problem: Revenue unpredictable, customer can leave easily
- Fix: Encourage annual (10% discount), offer multi-year (20%)
- Impact: Predictability + cash flow benefit

Mistake 3: No expansion strategy
- Problem: Customers stuck on starter tier, no upsells
- Fix: Product tiers clearly positioned, CS team upsells, pricing tested
- Impact: 20-40% revenue from expansion possible

Mistake 4: Pricing never tested
- Problem: Set price once, never change (leaving money on table)
- Fix: Annual price increase testing, test tiers
- Impact: 5-10% annual revenue improvement possible

`
      }
    ],
    relatedSlugs: ["subscription-billing-models-and-pricing-architecture", "pricing-strategy-and-price-optimization", "unit-economics-ltv-cac-payback", "customer-lifetime-value-optimization", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How do I calculate MRR and ARR?", a: "MRR = Monthly Recurring Revenue = total subscription revenue in a month. Example: 100 customers × £1000/month = £100K MRR. ARR = Annual Run Rate = MRR × 12 = £1.2M. NRR = (Beginning ARR + expansion - churn) / Beginning ARR. Target NRR >110% (expansion > churn)." },
      { q: "What's a healthy churn rate?", a: "Depends on stage: Early (<3% monthly = 40+ month lifetime, excellent). Growth (2-4% = 25-50 month, acceptable). Mature (1-3% = 33-100 month, good). Monthly churn compounds: 5% churn = lose 50% of customers in 13 months (problem). Impact: 1% churn reduction = 10% LTV improvement (high leverage)." },
      { q: "How do I increase recurring revenue without more customers?", a: "Three levers: (1) Price increase (2-5% annually, test before rolling out), (2) Reduce churn (improve onboarding/CS, highest ROI), (3) Expand existing (upsell 30% of customers = double ARPU). Combined: 30-50% revenue increase possible without new customer acquisition. NRR >110% target (expansion > churn)." }
    ],
    videoUrl: ""
  }
];

export default batch318Articles;