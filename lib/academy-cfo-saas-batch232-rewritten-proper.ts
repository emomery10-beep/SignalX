import { AcademyArticle } from "@/types/academy";

export const batch232Articles: AcademyArticle[] = [
  {
    slug: "pricing-strategy-and-price-optimization",
    title: "Pricing Strategy and Price Optimization: Capturing Value",
    description: "Master pricing. Position price, optimize willingness to pay, implement pricing strategy.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["pricing", "price optimization", "pricing strategy", "pricing tiers", "pricing model", "willingness to pay", "price elasticity", "pricing psychology"],
    keyTakeaways: [
      "Pricing fundamentals: Price reflects value, not cost. Waterfall: Price → Volume → Revenue. Raise price 10% → lose 5% volume (typical price elasticity -0.5) = 5% net revenue gain. Example: £500/month price, 100 customers = £60K MRR. Raise to £550 (10%), lose 5 customers (5%) = 95 customers × £550 = £52.25K (13% gain). Cost: Minimal (marketing message). Benefit: 13% revenue, same cost = 13% profit improvement. Pricing sweet spot: Find where MR = MC (maximize profit). Tools: Pricing tests, surveys (willingness to pay), willingness to pay analysis (value stacks).",
      "Pricing models: Flat-rate (simple, easy to understand), tiered (segment by use case/budget), usage-based (variable cost customer). Flat: Easier selling, less negotiation, lower LTV (price for median = lose high-value). Tiered: Capture more value (segment, high-value pay more), common (SMB/mid/enterprise). Usage: Align price with value (customer success, lower risk), hard to forecast (unpredictable revenue). Hybrid: Tiered + usage (base fee + overages). Example: Slack = tiered (free/pro/business+). Salesforce = tiered + usage (base + custom). Choose: Based on value metric (storage, users, transactions) and customer preference.",
      "Price increases: Manage carefully (churn risk vs revenue gain). Strategy: 5-10% yearly, communicative (explain value), segment (existing < new), incentive (lock 2-year at old price). Example: Increase base 8%, existing locked 2 years at old price, new customers at new price. Result: 50% of base at old price (revenue impact 4% this year), new pricing model (8% higher revenue for new). Churn: If >0.5% (lose $50K ARR on price increase), too aggressive. Most companies: 0-0.2% churn on 8% increase (acceptable)."
    ],
    content: [
      {
        heading: "Pricing Strategy and Optimization",
        body: `Building a pricing strategy that captures value.

**Pricing model selection**

Flat-rate (single price):
- Example: Notion free/£80/month
- Pros: Simple, easy to understand, low sales friction
- Cons: Leaves money on table (high-value customers pay same as low)
- Best for: Self-serve, simple product, mass market

Tiered pricing (3-4 tiers):
- Example: Slack (free/£68/£120/custom)
- Pros: Segment customers, capture more value, common in SaaS
- Cons: More complexity, which tier to choose
- Tiers: Starter (SMB, self-serve), Growth (mid-market, low touch), Enterprise (custom, high touch)

Usage-based (meter-driven):
- Example: AWS (compute hours), Stripe (per transaction)
- Pros: Align price with value, customer success aligned
- Cons: Unpredictable revenue, customer hesitation
- Best for: Infrastructure, per-transaction, per-seat variable

Hybrid (tiered + usage):
- Example: GitHub (base seats + usage), Salesforce (base + overages)
- Pros: Predictable base + upside from usage growth
- Cons: More complex

**Pricing tiers: anatomy of good structure**

| Tier | Use case | ARPU | Features | Support |
|---|---|---|---|---|
| Starter | SMB, self-serve | £100/mo | Core features, 50 customers | Email |
| Professional | Mid-market, low touch | £500/mo | Advanced features, 500 customers | Email + chat |
| Enterprise | Large, high touch | £2K+/mo | All features, custom limits | Dedicated support |

Rules for tier design:
- Price gap: 3-5x between tiers (too close = cannibalize lower tier)
- Feature differentiation: Clear why upgrade (unlock high-demand features)
- Anchor pricing: Highest tier appears most valuable
- Expansion path: Customer can grow without switching

**Price optimization framework**

Willingness to Pay analysis:
1. Segment customers (SMB vs enterprise)
2. Survey: "At what price, no value?", "At what price, great deal?", "Preferred price?"
3. Analyze responses (distribution shows willingness to pay)
4. Set price at 80-90th percentile (capture most value)

Price testing:
- A/B test: Show 20% segment new price, 80% old price
- Measure: Conversion rate, revenue per customer
- Analyze: Is new price better? (higher revenue per customer despite lower conversion?)
- Decision: Switch if >5% revenue uplift and <0.5% churn

Price increase strategy:
- Frequency: Annual 5-10% increase
- Announcement: Early notice, explain value increase
- Grandfathering: Lock existing customers at old price 2 years
- Result: 3-4% net revenue increase (new pricing, plus existing at old)

`
      }
    ],
    relatedSlugs: ["customer-segmentation-and-personalization", "unit-economics-ltv-cac-payback", "subscription-billing-models-and-pricing-architecture"],
    faq: [
      { q: "How should I price my product?", a: "Analyze willingness to pay (survey, data). Choose model: Flat-rate (simple), tiered (segment), usage-based (align value). Set price at 80-90th percentile of willingness to pay. Test: A/B test 10-20% segment new price, measure revenue impact. Increase: 5-10% annually with advance notice and grandfathering." },
      { q: "Should I use tiered or flat-rate pricing?", a: "Tiered: Better for capturing value (segment, high-value pay more). Flat-rate: Simpler, easier to sell. Most SaaS: Tiered (3-4 tiers: starter/professional/enterprise). Usage-based: If value metric is clear and variable (storage, transactions). Hybrid: If want predictable base + usage upside." },
      { q: "How much can I raise prices without losing customers?", a: "Typical elasticity: -0.5 (raise 10%, lose 5%). Test: A/B test, measure conversion and churn. Most companies: Can raise 5-10% annually with <0.2% incremental churn. Communicate: Explain value, offer existing customers old pricing locked (migration strategy)." }
    ],
    videoUrl: ""
  }
];

export default batch232Articles;