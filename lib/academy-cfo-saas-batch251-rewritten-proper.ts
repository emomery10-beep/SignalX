import { AcademyArticle } from "@/types/academy";

export const batch251Articles: AcademyArticle[] = [
  {
    slug: "subscription-billing-models-and-pricing-architecture",
    title: "Subscription Billing Models and Pricing Architecture: Optimizing Billing",
    description: "Master subscription billing. Build billing models, optimize for cash, reduce complexity.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["billing", "subscription billing", "pricing model", "billing system", "revenue recognition", "Stripe", "SaaS billing", "metering"],
    keyTakeaways: [
      "Billing models: Flat-rate (simple, low revenue per customer), tiered (better revenue capture, more complex), usage-based (meter consumption, highest revenue potential, unpredictable). Flat-rate: Netflix (£12.99/month flat). Benefit: Simple for customer (know cost), simple for company (no metering). Risk: Leave money on table (power users pay same as light users). Tiered: Slack (free/pro/business). Benefit: Capture value (segment, higher price for power users), clear upgrade path. Usage-based: AWS (pay per compute hour), Stripe (per transaction). Benefit: Align price with value (customer success = customer pays more), no upfront commitment. Risk: Unpredictable revenue, customers sensitive to costs. Hybrid: Base tier + overages (Salesforce: base + add-on features).",
      "Billing system: Choose: Stripe (best for SaaS, £2.2% fee), Recurly (specialized, higher fee), Zuora (enterprise, expensive). Build vs buy: Buy (Stripe) unless >£10M revenue (then build custom). Cost: Stripe (included in revenue %), custom build (£100K dev). Complexity: Manage upgrades (mid-cycle proration), downgrades (refund calculation), failed payments (retry logic), analytics (cohort billing, LTV by customer). Improve: Dunning (recover failed payments), annual upfront (improve cash flow), price locks (lock 3 years at old price for existing customers).",
      "Billing optimization: Move customers to annual (collect upfront, improve cash, improve retention). Price increase (5-10% annual raise, existing grandfathered if annual). Consumption forecasting (if usage-based, estimate customer LTV variance). Credit usage (free credits for early customers, burn over time, increase LTV). Free tier strategy (acquisition play, convert 5-10% to paid). Payback: Optimize billing = improve cash flow (3-6 months faster) + improve retention (1-2% lower churn) = net £500K+ value for mid-size SaaS."
    ],
    content: [
      {
        heading: "Subscription Billing Models and Systems",
        body: `Building billing architecture for scale.

**Billing model comparison**

| Model | Example | Revenue | Complexity | Predictability |
|---|---|---|---|---|
| Flat-rate | Netflix (£12.99/mo) | Low per customer | Low | High |
| Tiered | Slack (free/pro/biz+) | Medium | Medium | Medium |
| Usage-based | Stripe (% per txn) | Highest | High | Low |
| Hybrid | Salesforce (base + features) | High | Highest | Medium |

Flat-rate:
- Pros: Simple, low churn (low commitment), predictable
- Cons: Leave revenue on table (power users), low LTV
- Use when: Mass market, self-serve, simple product

Tiered:
- Pros: Capture value (higher price for power users), clear upgrade path, predictable
- Cons: More complex, confusion on which tier
- Use when: Multiple segments (SMB/mid/enterprise), SaaS

Usage-based:
- Pros: Align price with value (customer success = higher revenue), no upfront cost
- Cons: Unpredictable revenue, customer hesitation, complex metering
- Use when: Variable-cost product (compute, storage, API calls), product-driven growth

**Billing system selection**

Options:
1. Stripe Billing (best for SaaS <£10M)
   - Cost: 2.2% + £0.30 per transaction
   - Pros: Easy setup, handles subscriptions, most flexible
   - Cons: Limited advanced features, manual for complex billing

2. Recurly (subscription specialist)
   - Cost: 2-4% of revenue
   - Pros: Advanced features (usage metering, revenue recognition)
   - Cons: Expensive, more complex

3. Zuora (enterprise)
   - Cost: £5-100K+ per year
   - Pros: Complex billing, enterprise-grade
   - Cons: Very expensive, overkill for most SaaS

4. Build custom (>£10M revenue)
   - Cost: £100K-500K dev time
   - Pros: Perfect control, optimize for your model
   - Cons: Expensive, ongoing maintenance

Recommendation:
- Early stage: Stripe Billing
- Growth (£5-10M): Stripe or Recurly
- Scaling (>£10M): Custom build or Zuora

**Billing optimization tactics**

Move to annual:
- Current: 100 customers × £500/month = £60K/year
- Target: 70% annual (£490K upfront), 30% monthly
- Annual cost: 2% discount = £490K per customer per year
- Result: £343K upfront + £18K monthly (60% of cash upfront vs spread 12 months)

Failed payment recovery:
- Typical: 10-15% of charges fail initially
- Retry logic: 4 attempts over 10 days
- Recovery: 30-40% recovered = 6-7% net failure rate
- Dunning: Email → 20-30% click rate
- Impact: Failed payment recovery = save 1-2% churn

Usage-based metering:
- Meter: API calls, storage, compute time
- Bill: Measure usage, charge per unit
- Example: AWS charges per compute hour (used 100 hours = charge for 100)
- Forecasting: Track customer usage trend (growing = LTV increasing)

`
      }
    ],
    relatedSlugs: ["payment-processing-and-billing-optimization", "revenue-recognition-and-accounting-standards", "pricing-strategy-and-price-optimization"],
    faq: [
      { q: "What billing model should I use?", a: "Flat-rate: Simple, low revenue. Tiered: Standard SaaS (best balance). Usage-based: Variable cost, align with customer value. Hybrid: Base + overages (best of both). Most SaaS: Start tiered, move to hybrid as scale. Choose based on: value metric (if clear, use tiered or hybrid), market expectation, revenue potential." },
      { q: "What billing system should I choose?", a: "Early stage: Stripe Billing (simple, 2.2% fee). Growth: Stripe or Recurly (more features). Scaling (>£10M): Zuora or custom (complex needs). Build custom only if >£10M (build cost £100K+, not worth it smaller)." },
      { q: "How do I improve billing and cash?", a: "1. Move to annual (collect upfront, 2% discount). 2. Failed payment recovery (retry logic, dunning = 1-2% churn save). 3. Usage metering (forecast LTV, optimize pricing). 4. Price increase (5% annual, existing grandfathered). Combined: Improve cash flow 20-30%, improve retention 1-2%." }
    ],
    videoUrl: ""
  }
];

export default batch251Articles;