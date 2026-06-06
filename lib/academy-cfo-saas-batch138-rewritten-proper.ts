import { AcademyArticle } from "@/types/academy";

export const batch138Articles: AcademyArticle[] = [
  {
    slug: "pricing-strategy-and-price-optimization",
    title: "Pricing Strategy and Price Optimization: Capturing Maximum Value Without Losing Customers",
    description: "Master pricing strategy. Understand pricing models, test price changes, optimize for revenue and margin, and avoid leaving money on the table.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "pricing strategy",
      "price optimization",
      "pricing models",
      "value-based pricing",
      "tiered pricing",
      "price testing",
      "price elasticity",
      "willingness to pay",
      "revenue maximization",
      "margin optimization"
    ],
    keyTakeaways: [
      "Pricing models: Flat fee (simplicity, predictable), per-user (scales with value), tiered (free/starter/pro/enterprise, captures different segments), usage-based (customers pay for consumption, aligns incentives). No perfect model. Example: SaaS-as-a-service = per-user (easy to understand, scales with company size). API = usage-based (usage drives value, align pricing with that).",
      "Price optimization: Most founders underprice (charge 50% less than customers willing to pay). Test increases: Raise price 10% on new signups, measure churn impact. Example: Current price £99/month, 98% retention. Raise to £109/month, 97% retention. Revenue +10% (from new), -1% (from churn) = +9% net revenue. Repeat quarterly.",
      "Willingness to pay: Different customers have different max price. Enterprise willing £10K/month, SMB £500. Tiered pricing captures this: Free tier (converts to paid), Starter £99 (SMB), Pro £499 (mid-market), Enterprise £2K+ (customized). Each tier targets different segment. Increases revenue 20-40% vs single price point."
    ],
    content: [
      {
        heading: "Understanding Pricing Models",
        body: `Different ways to charge customers align incentives differently.

**Flat Fee Pricing**

Fixed price per month/year, unlimited usage.

Example: Slack pricing (in early days)
- $8/month per user per month
- Flat: Pay same regardless of how many messages sent

Pros:
- Simple (customers know exact cost)
- Predictable revenue (easy to forecast)
- Low friction (transparent pricing, quick buying decision)

Cons:
- Doesn't scale with value (heavy users subsidize light users)
- Hard to optimize price (raise price = churn risk)

Best for: Horizontal software (applies to many users/use cases), high volume, price-sensitive customers.

**Per-User/Per-Seat Pricing**

Charge per user/seat/team member.

Example: Slack actual pricing
- £6-12/month per user
- Company with 100 users = £600-1200/month

Pros:
- Natural scaling (more users = more revenue)
- Aligns with value (more users = more value typically)
- Easier price increases (add users, not raise price)

Cons:
- Creates incentive to minimize user count (hide some users)
- Some users more valuable than others (pay same)

Best for: Team collaboration tools, seat-based software, SMB/mid-market.

**Tiered/Plan-Based Pricing**

Offer multiple tiers, each with different features/limits.

Example:

Free: 1 user, 5 projects (conversion vehicle)
Starter: £99/month, 3 users, 50 projects
Pro: £499/month, 10 users, unlimited projects
Enterprise: Custom pricing, unlimited users, dedicated support

Pros:
- Captures customer willingness to pay (different segments pay different prices)
- Increases revenue 20-40% vs single price
- Drives upgrade path (start at Starter, upgrade to Pro)

Cons:
- More complex (harder for customers to choose)
- Risk of cannibalization (customers pick lower tier than optimal)

Best for: Product-market fit, growing SaaS, many customer segments.

**Usage-Based Pricing**

Charge per unit of consumption (API calls, GB stored, hours used).

Example: AWS
- £0.0001 per API call
- Customer uses 1M calls/month = £100

Pros:
- Aligns perfectly with value (more usage = more revenue)
- No maximum price (high-usage customers pay more)
- Easy entry (start free, pay as you grow)

Cons:
- Unpredictable costs for customer (variable bill)
- Can be complex to understand
- Potential for bill shock (customer expects £100, gets £10K)

Best for: Infrastructure (AWS, APIs), highly variable usage patterns.

**Freemium**

Free product with paid upgrade.

Example: Dropbox
- Free: 2GB storage
- Paid: £100/year for 2TB storage

Pros:
- Low friction to acquire customers (free!)
- Large funnel (many free → some convert to paid)
- Natural product trial (use before buying)

Cons:
- High support costs (free users cost money)
- Low conversion rates (1-5% typical)
- Must have natural upgrade path

Best for: High growth, investor-backed, can handle free user support.

**Hybrid Models**

Combine multiple models.

Example: Stripe
- Transaction fee: 2.9% + 30¢ per transaction (usage-based)
- Plus: Monthly fee for Connect (per-user model)
- Plus: Enterprise: Custom (negotiated)

Pros:
- Aligns with multiple value drivers
- Captures different customer segments
- Flexible

Cons:
- Complex pricing (hard for customer to understand cost)
- Hard to optimize
`
      },
      {
        heading: "Setting and Testing Prices",
        body: `How to determine the right price and test changes.

**Understanding Willingness to Pay**

Before setting price, understand customer value:

Conduct willingness-to-pay survey:
- Ask customers: "What's maximum you'd pay for this solution?"
- Responses: £99, £149, £249, £499, £999
- Average: £350
- Median: £249

Price guidelines:
- Set at or below median (£249 recommended)
- Segment by type: SMB willing to pay £99, Enterprise £999

Example pricing resulting:

Free: Trial tier (acquisition)
Starter: £99/month (SMB)
Pro: £249/month (mid-market, median point)
Enterprise: Custom £999+/month (enterprise)

**Price Testing Framework**

Test price increases systematically:

Step 1: Current baseline
- Current price: £99/month
- Monthly conversions: 100 (10% of 1000 trials)
- Monthly revenue: £9,900
- Monthly churn: 2% (10 customers)

Step 2: Price increase (test with new cohort)
- New price: £109/month (+10%)
- Measure: Conversion rate, churn rate

Step 3: Results (after 1 month)
- New conversions: 98 (down from 100, 2% impact)
- Churn: 11 (up from 10, 10% impact)

Step 4: Calculate impact
- Revenue from new customers: 98 × £109 = £10,682 (vs £9,900 baseline = +7.9%)
- Revenue from existing: 89 × £99 + 11 × £109 = £9,791 (vs £10,000 = -2.1%)
- Total: £20,473 (vs £19,900 = +2.9%)

Decision: Keep price increase (net +2.9% revenue, acceptable).

**Repeat Testing**

Most companies should test price increases quarterly:

Q1: Price £99 → £109 (+10%) ✓ (keep)
Q2: Price £109 → £120 (+10%) ✓ (keep)
Q3: Price £120 → £132 (+10%) ✓ (keep)
Q4: Price £132 → £145 (+10%) ✓ (keep)

Over 1 year: 4 × 10% increases = 46% annual price increase.

But customers tolerate gradual increases. Most healthy SaaS increase price 10-20% annually.

**Price Elasticity**

Elasticity = % change in quantity / % change in price

Example:
- Price increase 10% (£99 to £109)
- Conversions decrease 5% (100 to 95)
- Elasticity = 5% / 10% = 0.5 (inelastic, small impact)

Elasticity <1: Inelastic (price-insensitive, can raise price aggressively)
Elasticity 1-2: Moderate (some price sensitivity)
Elasticity >2: Elastic (very price-sensitive, small increases hurt volume)

Most SaaS: Elasticity 0.5-1.0 (inelastic to moderate), meaning price increases are valuable.

**Tiered Pricing Optimization**

If using tiered pricing, optimize gaps and upgrades:

Current:
- Free: 1 user, 5 projects
- Starter: £99, 3 users, 50 projects
- Pro: £499, 10 users, unlimited

Issue: Big gap from Free to Starter (£99 jump). Gap from Starter to Pro (£400 jump).

Optimized:
- Free: 1 user, 5 projects (acquisition)
- Starter: £49, 2 users, 20 projects (low friction upgrade from free)
- Pro: £199, 5 users, unlimited (natural next step)
- Enterprise: £999+, unlimited, dedicated support

Result:
- More conversions from Free to Starter (smaller jump)
- More upgrades from Starter to Pro
- Higher-value customers buy Enterprise

Revenue impact: +30% (more conversions + higher upgrade rates).

**Annual vs Monthly Pricing**

Offer annual discount to lock in customers:

Monthly: £99/month = £1,188/year
Annual: £999/year (15% discount)

Benefits of annual:
- Lower churn (committed to contract)
- Better cash flow (get paid upfront)
- Higher LTV (less churn = longer lifetime)

Downside: Customer hesitation (bigger commitment).

Most SaaS: 20-30% of customers choose annual (good for cash flow, LTV).

Strategy: Offer both, use annual for churn reduction.

Example impact:
- 10% customer increase annual retention (from 95% to 98%)
- 30% of customers on annual
- Net: Churn 95% × 70% + 98% × 30% = 95.9% (50bps improvement)
- On 1000-customer base: 50 extra customers retained = +£5,940 revenue/month = +£71K/year
`
      },
      {
        heading: "Advanced Pricing Optimization",
        body: `Sophisticated tactics to maximize revenue without losing customers.

**Price Discrimination / Value-Based Pricing**

Charge different customers different prices based on value received.

Example: Salesforce
- SMB: £50/month per user (low value)
- Mid-market: £150/month per user (medium value, more advanced features)
- Enterprise: £300/month per user (high value, dedicated support)

Why: SMB willing to pay £50, Mid-market £150, Enterprise £300. Charge each at their willingness to pay.

Revenue impact:
- Single price £100: SMB pays £100 (£50 surplus), Mid £100 (£50 discount), Enterprise £100 (£200 discount) = lost £300/month per customer
- Value-based: SMB £50, Mid £150, Enterprise £300 = captured full value

Net: Value-based pricing 2-3x higher revenue vs single price.

Implementation:
- Create segments (SMB/Mid/Enterprise based on company size, revenue, industry)
- Test different prices for each
- Lock in with multi-year contracts (Enterprise)

**Usage-Based Ceiling (Cap)**

Charge usage but cap at max price (protects customers, maximizes revenue).

Example:

Usage-based: £0.01 per API call
Cap: Max £999/month

Customer A: 50K calls = £500/month (below cap)
Customer B: 500K calls = £5K → capped at £999/month

Benefits:
- Aligns with value (high-usage customers pay more)
- Protects customers (predictable max bill)
- Maximizes revenue (cap prevents below-market pricing)

**Packaging & Feature Paywalls**

Control which features are in which tier.

Free: Basic features (core product)
Starter: +Advanced features (£99)
Pro: +Integrations, API (£499)
Enterprise: +Dedicated support, SLAs, custom features (£2K+)

Price each feature:
- Integration worth £100/customer/month
- API worth £50/customer/month
- Dedicated support worth £300/customer/month

Stack features in tiers, charge incrementally.

Revenue impact: Power users buy Pro ($499 vs $99 = 5x), unlocking integration value.

**Length-Based Pricing Discounts**

Longer contracts = bigger discount.

1 month: £99
Annual: £999/year (15% discount, £83.25/month)
2-year: £1,848/2 = £77/month (22% discount)
3-year: £2,574/3 = £71.50/month (28% discount)

Why: Longer contract = lower churn risk, better cash flow.

Strategy: Offer substantial discounts for multi-year (10-20% per year locked in).

**Customer Health Scoring for Expansion**

Use engagement metrics to identify high-value customers for upsells.

Score: (Daily active users × 0.5) + (% of features used × 0.3) + (Support tickets × 0.2)

High score (>80): Expansion opportunity
- These customers heavily use product
- Likely willing to upgrade to Pro or Enterprise
- Target for account manager outreach

Low score (<40): Churn risk
- Light usage, not getting value
- May churn soon
- Target for re-engagement campaign

**Packaging Psychological Pricing**

Price psychology matters:

£99/month vs £100/month: £99 converts 10-20% better (charm pricing)

£49, £149, £499 vs £50, £150, £500: Odd prices (ending in 9) perceived as better value

£999/month (annual £999) vs £83/month: Annual anchors to higher perceived value (discount effect)

Use psychological pricing in tiered structure:
- Starter: £49 (charm pricing, low entry)
- Pro: £199 (good value anchor)
- Enterprise: £999+ (high-value anchoring)
`
      },
      {
        heading: "Pricing Metrics and KPIs",
        body: `Key metrics to optimize pricing strategy.

**Conversion Rate by Price**

Track how price affects conversion:

Price | Trials/month | Conversions | Conversion % |
£79 | 1000 | 120 | 12.0%
£99 | 1000 | 100 | 10.0%
£119 | 1000 | 85 | 8.5%
£149 | 1000 | 65 | 6.5%

Elasticity: As price increases, conversion decreases (expected).

Optimization: Find price that maximizes revenue (not conversion), not volume.
- £79: Revenue £79 × 120 = £9,480/month
- £99: Revenue £99 × 100 = £9,900/month ← optimal
- £119: Revenue £119 × 85 = £10,115/month (higher!)
- £149: Revenue £149 × 65 = £9,685/month

Best price: £119 (highest revenue).

**Plan Mix (% of customers on each tier)**

Free: 50% (acquisition funnel)
Starter: 35% (low-commitment paying)
Pro: 12% (mid-market)
Enterprise: 3% (high-value)

Revenue contribution:
- Free: 0% revenue (free)
- Starter: £99 × 35% = £34.65 per average customer
- Pro: £499 × 12% = £59.88 per average customer
- Enterprise: £2K × 3% = £60 per average customer
- Total ARPU: £154.53

Monitor plan mix monthly. Healthy SaaS:
- <50% on free (converters)
- >40% on paid (monetizing)
- >10% on premium (upsells working)

**Upgrade Rate**

% of customers upgrading from lower to higher tier.

Healthy: 5-10% annually per tier
- 5% of Starter → Pro: 3.5% × 35% × 12 = 14.7 upgrades/month (grow Pro tier)

Low upgrade rate (<2%): Pricing gaps too large, or features not compelling.

Solution: Reduce gap (add mid-tier), improve features, engage power users.

**Churn by Price/Tier**

Does higher price = higher churn?

Starter (£99): 2.5% monthly churn
Pro (£499): 1.5% monthly churn
Enterprise (£2K+): 1% monthly churn

Insight: Premium tiers have lower churn (more committed customers).

Strategy: Get more customers into premium tiers (higher commitment, higher LTV).

**CAC Payback by Tier**

How long to recover CAC from each tier?

CAC: £500 (average cost to acquire)

Starter (£99/month): Payback = £500 / £99 = 5 months
Pro (£499/month): Payback = £500 / £499 = 1 month
Enterprise (£2K/month): Payback = £500 / £2K = 0.25 months (1 week)

Insight: Premium tiers recover CAC much faster.

Strategy: Attract more high-value customers (lower payback, faster growth).

**Expansion Revenue (MRR Growth)**

Track net revenue growth from existing customers:

Base MRR: £100K (from existing)
Churn: -£2.5K
Upgrades: +£3K (Starter → Pro)
Expansion (add-ons): +£1.5K
Net: +£2K (+2% month-over-month)

NRR = (100K + 3K + 1.5K - 2.5K) / 100K = 102% (healthy).

Monitor expansion revenue specifically:
- Healthy: Upgrades + expansion > churn
- Unhealthy: Churn > upgrades + expansion

**Price-Driven Revenue Growth**

Separate growth into components:

MRR growth: 10% month-over-month

Components:
1. New customers: +6% (acquisition)
2. Price increases: +2% (existing customers, higher price)
3. Churn: -2% (natural attrition)
4. Expansion: +4% (upgrades, add-ons)

Net: 6% + 2% - 2% + 4% = 10%

Price increases are 20% of growth (6% / 10%). If you raise prices 10%/quarter, that's material.

Monitor this mix to understand growth drivers. Healthy mix:
- Acquisition 50-60% of growth
- Price/expansion 30-40% of growth
- Churn offset by above
`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "customer-lifetime-value-calculation",
      "financial-forecasting-modeling",
      "churn-analysis-retention-improvement",
      "growth-accounting-and-advanced-unit-economics"
    ],
    faq: [
      {
        q: "How do I know if my price is too low?",
        a: "Test a 10% price increase. If churn increases <5%, your price was likely too low. Example: 10% price increase, 2% churn increase = net +8% revenue (acceptable). Keep increasing 10% quarterly until you hit a point where churn exceeds the benefit. Most SaaS can raise price 15-20% annually without material churn."
      },
      {
        q: "Should I use flat fee, per-user, tiered, or usage-based pricing?",
        a: "Depends on product: Flat fee = simplicity (good for early stage). Per-user = scales with value (team tools). Tiered = captures willingness to pay (most SaaS should use this). Usage-based = aligns with value (infrastructure/APIs). Most healthy SaaS: Start with tiered, add usage-based when mature."
      },
      {
        q: "How many pricing tiers should I have?",
        a: "Recommendation: 3-4 tiers. Free (acquisition) or Starter (low friction) → Pro (mid-market) → Enterprise (custom). More tiers = more complexity, lower conversion. Fewer tiers = less segmentation, leave revenue on table. Three is sweet spot for most SaaS."
      },
      {
        q: "What discount should I offer for annual billing?",
        a: "Recommended: 15-20% annual discount. Example: £99/month = £1,188/year, annual price £999 (15% off). Benefits: Better cash flow, lower churn (customer committed). Downside: Forgone monthly revenue. Most SaaS: 20-30% of customers buy annual (good for LTV improvement)."
      }
    ],
    videoUrl: ""
  }
];

export default batch138Articles;
