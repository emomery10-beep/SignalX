import { AcademyArticle } from "@/types/academy";

export const batch169Articles: AcademyArticle[] = [
  {
    slug: "pricing-strategy-and-price-optimization",
    title: "Pricing Strategy and Price Optimization: Maximizing Revenue and Value",
    description: "Master pricing. Set prices based on value, test price increases, and optimize tiers to maximize revenue without hurting growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 8,
    keywords: [
      "pricing strategy",
      "price optimization",
      "pricing tiers",
      "price increase",
      "willingness to pay",
      "pricing model",
      "value-based pricing",
      "tiered pricing",
      "pricing psychology",
      "price elasticity"
    ],
    keyTakeaways: [
      "Pricing principles: (1) Price based on value delivered, not cost (cost-plus leaves money on table). (2) Different tiers for different customers (SMB wants cheap, enterprise wants features). (3) Test price increases (start with small 10-15%, measure churn impact). (4) Be transparent (customers respect clarity). Example: £1K ARPU at cost £200 COGS = 80% margin. Increase to £1.2K (20% increase), if churn stays same, +20% revenue (massive impact on profitability).",
      "Pricing models: (1) Per-user pricing (Slack, £6-12/user/month). (2) Flat pricing (Basecamp £99/month fixed). (3) Usage-based (AWS, pay per compute). (4) Value-based (enterprise deal negotiation). Choose based on customer perception: Per-user if customer thinks \"cost per person\", flat if usage unpredictable, usage-based if cost scales, value if large enterprise deals.",
      "Tiering strategy: Starter (cheap, acquire volume), Pro (sweet spot, majority), Enterprise (expensive, high touch). Price Starter low (£50) to get in door. Price Pro medium (£200-500) where most customers land. Price Enterprise high (custom) where customers see high value. Example: Starter 100 customers, Pro 200 customers, Enterprise 20 customers (high revenue concentration at top). When optimizing, focus on Pro/Enterprise (higher LTV)."
    ],
    content: [
      {
        heading: "Pricing Fundamentals",
        body: `Core principles for pricing decisions.

**Cost-Plus vs Value-Based Pricing**

Cost-plus (bad):
- Cost: £200 (COGS)
- Markup: 50%
- Price: £300
- Problem: Cost is internal, customer doesn't care
- Result: Leave money on table if customer would pay £1,000

Value-based (good):
- Customer gets £2,000 value annually
- Customer willing to pay 40% of value (benchmark)
- Price: £800
- Result: Align with customer value perception

Example impact:
- Cost-plus at £300: Low revenue, hard to be profitable
- Value-based at £800: 2.7x higher revenue, strong margins

**Pricing Power**

Pricing power: Ability to raise prices without losing customers.

High pricing power (can raise without churn):
- Sticky product (switching costs high)
- Unique features (no competition)
- Strong brand (customers willing to pay premium)
- Critical to business (can't afford to lose)

Example: Salesforce (CRM deeply integrated, hard to leave) → has pricing power, raises prices regularly.

Low pricing power (lose customers if raise):
- Commodity (many alternatives)
- Non-critical (nice to have)
- Weak brand (customer doesn't care who provides)
- Low switching costs

Example: Email hosting (Gmail free alternative) → low pricing power, hard to raise prices.

**Price Elasticity**

How sensitive is demand to price changes?

Elastic (demand sensitive):
- 10% price increase → 15% demand drop
- Example: SMB SaaS (budget sensitive, will churn)
- Strategy: Price increases risky, focus on retention and features

Inelastic (demand insensitive):
- 10% price increase → 2% demand drop
- Example: Enterprise SaaS (budget not constraint, strategic need)
- Strategy: Can raise prices without fear

Test elasticity:
- Increase price 10% on subset
- Measure churn impact
- If churn <2%: Inelastic (can raise more)
- If churn >10%: Elastic (risky to raise)

`
      },
      {
        heading: "Pricing Models",
        body: `Different approaches to charging customers.

**Per-User/Per-Seat Pricing**

Price per user, customer controls spend by headcount.

Example: Slack at £6/user/month
- 10-person team: £60/month
- 100-person team: £600/month
- Scales with company

Pros:
- Clear value relationship (more users = more value)
- Self-serve upgrade (add users = add cost)
- Align incentives (customer controls spend)

Cons:
- Usage unpredictable (varies by team size)
- Can backfire (customer limits users to control cost)
- Not all SaaS benefit from this (maybe usage doesn't scale per-user)

Best for: Collaboration tools, communication tools (value per additional user).

**Flat Pricing**

One price for all tiers/features.

Example: Basecamp at £99/month (all features, all users)

Pros:
- Simple (customers know exact cost)
- Predictable revenue (lock in customer spend)
- Low price elasticity (customers less likely to switch on price)

Cons:
- Doesn't scale with usage (small user might overpay, large user underpay)
- May limit upgrades (customer gets all features, won't pay more)

Best for: Products where usage reasonably predictable (project management, team tools).

**Usage-Based Pricing**

Pay per usage (compute, API calls, data transfer, etc).

Example: AWS at £0.10 per compute hour (customer pays for actual usage)

Pros:
- Fair pricing (pay for what you use)
- Align incentives (efficient customer = low bill)
- Unlimited upside (efficient customer grows without us changing price)

Cons:
- Unpredictable billing (customer surprised by bill)
- Lower revenue certainty (don't know spend upfront)
- May alienate small customers (hard to estimate costs)

Best for: Infrastructure, compute, APIs, data-heavy services.

**Tiered Pricing**

Multiple price points for different customer segments.

Example: Slack
- Free: 2GB history
- Pro: £6/user/month
- Business+: £12/user/month
- Enterprise: Custom

Strategy:
- Free: Acquire users (bottom of funnel)
- Pro: Convert paying customers (main tier)
- Business+: Expand revenue (power users)
- Enterprise: Maximize revenue (large deals)

Price positioning:
- Free low barrier (many users)
- Pro affordable (convert majority)
- Business+ premium (lock in power users)
- Enterprise custom (highest value)

**Value-Based Pricing**

Enterprise custom deals, price based on negotiation and value.

Example: Salesforce enterprise deal
- Customer: Large corporation, £2M annual savings from CRM
- Price negotiation: £400K annually (20% of value)
- No fixed tiers (negotiated per deal)

Pros:
- Maximize revenue (capture customer's value)
- Strategic pricing (large deals different terms)

Cons:
- Not scalable (require sales team per deal)
- Unpredictable revenue (deals vary)
- Sales complexity (requires negotiation)

Best for: Enterprise sales, large customer deals.

`
      },
      {
        heading: "Price Optimization and Testing",
        body: `Strategies for increasing prices and revenue.

**Price Increase Framework**

Step 1: Analyze willingness to pay
- Survey customers: "What would you pay?"
- Analyze churn data: Who leaves at what price increases?
- Analyze competitors: What do they charge?
- Estimate: Current price £100, customers might accept £120-130

Step 2: Plan increase gradually
- Current: £100
- Month 1: Increase to £110 (10%)
- Month 3: Increase to £120 (9%)
- Month 6: Increase to £130 (8%)
- Rather than: £100 → £130 (30% all at once)

Step 3: Communicate clearly
- "We've improved product significantly"
- "New price reflects value"
- "Current customers get locked rate for 12 months"
- Transparency reduces churn

Step 4: Measure impact
- Track churn rate before/after
- Compare cohorts (pre-price, post-price)
- Measure revenue impact (may be offset by churn)

**Testing Price Increases**

A/B test on subset:
- 50% of new customers at £110
- 50% of new customers at £100 (control)
- Measure: Conversion rate, churn rate, revenue

Example results:
- £100 price: 50% conversion, 2% churn → £4,800 revenue per 100 signups
- £110 price: 48% conversion, 3% churn → £5,040 revenue per 100 signups
- Winner: £110 (higher revenue despite lower conversion)

Confidence: Test at least 100-200 customers to be statistical significant.

**Packaging Optimization**

Test different tier configurations:

Option A (current):
- Starter: £50
- Pro: £200
- Enterprise: Custom

Option B (test):
- Starter: £75 (raise Starter price)
- Pro: £300 (raise Pro)
- Enterprise: Custom

Option C (test):
- Starter: £50
- Pro: £150 (lower Pro to boost conversion)
- Enterprise: £500/month flat (new lower tier for larger SMB)

Measure: Revenue per cohort, conversion rate, average customer LTV

Choose configuration that maximizes: (Revenue per customer) × (Customers acquired).

**Upgrade Dynamics**

Track how customers move between tiers:

| Movement | % of customers | Impact |
|----------|--------|--------|
| Starter → Pro | 20% | Good (expansion) |
| Pro → Enterprise | 5% | Expected |
| Starter → Churn | 30% | Bad (need improvement) |
| Pro → Churn | 10% | Acceptable |

Issues:
- Starter → Churn 30%: Starter not good entry product
- Fix: Reduce Starter price, improve onboarding, or add features

Opportunity:
- Starter → Pro only 20%: Low expansion
- Fix: Add features that make Pro more attractive, incentivize upgrade

`
      },
      {
        heading: "Annual vs Monthly Billing",
        body: `Choosing billing cadence and impact.

**Monthly vs Annual Revenue Comparison**

Monthly billing:
- £100/month per customer
- Year 1 revenue: £1,200 (12 × £100)
- Flexibility: Customer can cancel anytime
- Churn risk: Customer leaves, revenue stops

Annual billing:
- £1,000/year upfront (12 months × £100, discounted 17%)
- Year 1 revenue: £1,000 (upfront)
- Flexibility: Lock customer for year
- Retention: Customer paid, harder to churn

**Cash flow impact:**

Monthly model:
- Month 1: £100 cash (customer pays)
- Month 2: £100 cash
- Month 12: £100 cash
- Year 1 cash: £1,200 (steady, but customer can cancel)

Annual model:
- Month 1: £1,000 cash (customer pays upfront)
- Month 2-12: £0 cash (already paid)
- Year 1 cash: £1,000 (upfront, then renewable)
- Year 2: If 80% renew: £800 cash + growth

**Adoption strategy:**

Offer both:
- Monthly: £100/month (default, flexible)
- Annual: £1,000/year (17% discount, locked in)

Incentivize annual:
- Messaging: "Save 17% with annual plan"
- Psychology: Discount feels valuable
- Outcome: 30-40% of customers choose annual

Impact:
- 30% on annual: Upfront cash +£300 (customer saves £60)
- 70% on monthly: £700 monthly recurring
- Year 1 revenue improved through upfront cash

**When to use annual:**

Good for:
- Profitable business (can handle cash outlay risk)
- Predictable customers (can estimate churn)
- Trying to lock in customers (reduce churn)

Avoid if:
- Cash-constrained (can't risk upfront cash)
- High churn (refunds hurt)
- Building trust (monthly better for new market)

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "expansion-revenue-and-upsell-strategy",
      "competitive-analysis-and-market-positioning",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "How do I price my SaaS product?",
        a: "Base on value, not cost. Estimate customer's willingness to pay (survey, analyze competitors, measure willingness via churn). Price based on value delivered (e.g., if customer saves £10K/year, price £3K/year = 30% of value). Test with small price increases (10-15%), measure churn impact. If churn minimal, increase more."
      },
      {
        q: "What pricing model should I use?",
        a: "Per-user (Slack model, scales with users), flat (Basecamp, fixed price), usage-based (AWS, pay for usage), tiered (free/pro/enterprise, segment customers), or value-based (enterprise negotiation). Choose based on: (1) How customer perceives value, (2) How usage scales, (3) Competitive positioning."
      },
      {
        q: "Should I offer annual or monthly billing?",
        a: "Offer both. Monthly default (£100/month), annual discounted (£1,000/year = 17% discount). 30-40% of customers choose annual. Benefit: Upfront cash, better retention (customer paid, less likely to churn), predictable revenue. Drawback: Refund risk if customer churns."
      },
      {
        q: "How do I test a price increase?",
        a: "A/B test: 50% of new customers at current price, 50% at new price. Measure: Conversion rate, churn rate, revenue per customer. If new price wins on revenue (even if lower conversion), implement. Test 100-200 customers to be statistically significant."
      }
    ],
    videoUrl: ""
  }
];

export default batch169Articles;
