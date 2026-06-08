import { AcademyArticle } from "@/types/academy";

export const batch203Articles: AcademyArticle[] = [
  {
    slug: "subscription-billing-models-and-pricing-architecture",
    title: "Subscription Billing Models and Pricing Architecture: Optimizing Revenue Models",
    description: "Master billing models. Design subscription tiers, pricing architecture, and optimize revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "subscription billing",
      "pricing tiers",
      "billing model",
      "SaaS pricing",
      "billing architecture",
      "revenue optimization",
      "tiered pricing",
      "usage-based pricing",
      "payment processing",
      "subscription management"
    ],
    keyTakeaways: [
      "Pricing models: (1) Flat-rate (£100/month, simple, miss monetization), (2) Tiered (basic £50, pro £150, enterprise £500, good alignment), (3) Usage-based (£0.10 per API call, aligns with value, unpredictable revenue), (4) Hybrid (base + usage, best flexibility). Choose: B2B SMB/mid-market = tiered. Enterprise = custom. API/dev tools = usage-based. Optimize: Move upmarket (enterprise = 5-10x margin), or land-and-expand (land cheap, upsell).",
      "Billing strategy: Annual vs monthly. Annual upfront = cash flow advantage (collect £1200 year 1), monthly = customer preference but cash drag. Hybrid: Encourage annual (10-15% discount), offer monthly (pay 10% more). Example: Monthly £100 = annual £1080 (10% discount), vs monthly £110 = no discount. 50% choose annual = strong cash impact. Payback: Benefits show in first few months (cash). Churn: Higher on monthly (easier cancel), lower on annual (committed).",
      "Add-ons and seat pricing: Tier = 5 users included, add users £50/month each. Example: Tier pro £150 + 10 users = £150 + (5×£50) = £400/month. Advantage: Incentivizes larger teams (more users = more revenue), fair pricing (companies pay for value). Challenge: Requires seat counting (audit risk, enforcement needed). Alternative: Feature-based (pro tier gets feature A, not feature B, simpler to enforce)."
    ],
    content: [
      {
        heading: "Subscription Pricing Models",
        body: `Choosing and designing pricing structure.

**Pricing Model Comparison**

1. Flat-rate (single price):
- Example: £99/month for all customers
- Pros: Simple, easy to understand, easy to upsell (upgrade = different product)
- Cons: Customer with 1 user pays same as customer with 100 users (unfair), miss monetization (large customers want more features)
- Use case: Early-stage, need to validate market, simple product

2. Tiered (feature-based):
- Pricing structure:
  | Tier | Price | Features | Target |
  |------|-------|----------|--------|
  | Starter | £50/mo | Basic features, 1 user | SMB testing |
  | Pro | £150/mo | Advanced features, 5 users, API | Growing SMB |
  | Enterprise | Custom | All features, unlimited users, support | Enterprise |

- Pros: Aligns customer to tier (willingness to pay), drives upgrade as customer grows, simple to understand
- Cons: Tier gaps (customer at tier 2 ceiling doesn't want to pay 3x for tier 3), feature lock-in (upgrade just to unlock feature)
- Use case: Most SaaS use this, optimal for B2B

3. Usage-based (consumption):
- Example: £0.10 per API call, or £0.01 per GB stored
- Pros: Customer pays for value (fairness), aligns revenue with usage growth, no artificial tiers
- Cons: Unpredictable revenue (spiky), customer resistance (no monthly budget), may hide costs (customer surprised by large bill)
- Use case: Developer tools, infrastructure (AWS, Stripe), where usage varies wildly

4. Hybrid (tiered + usage):
- Example: Base tier £150/mo (includes 10K API calls) + £0.05 per additional call
- Pros: Predictable base revenue + upside from usage, fair pricing, good for growth (scale doesn't cap revenue)
- Cons: Complex (confusing pricing), hard to model revenue
- Use case: Companies with unpredictable usage (infrastructure, analytics)

**Pricing level (entry point + premium)**

Research: What do customers pay for alternatives?
- Competitor A: £100/month
- Competitor B: £80/month
- DIY cost: £500/month (salary to manage manually)
- Willingness to pay: £150-300/month (based on DIY vs competitor)

Entry point:
- Too high (£300+): Misses SMB, too risky for new category
- Too low (£30): Position as cheap (wrong), hard to raise later, poor gross margin
- Right (£50-150): SMB happy, room to go up market

Premium tier:
- Entry at £50, premium at 3x = £150 (good spread)
- Or premium at £200-500 (if targeting SMB + enterprise)
- Psychology: Good-better-best works (3 tiers optimal)

**Annual vs monthly pricing**

Monthly:
- Customer preference (lower commitment, cancel anytime)
- Churn: Higher (easy to cancel)
- Revenue: Less predictable

Annual:
- Better revenue visibility (collect upfront)
- Churn: Lower (committed for year)
- Cash flow: Excellent (collect day 1, recognize monthly)

Example financial impact (100 customers, £100/month):
- Monthly billing: £100/month × 100 = £10K/month revenue, £10K cash/month
- Annual billing: £1200/year × 100 = £120K upfront, £10K/month recognized revenue
- Cash advantage: £120K upfront vs £10K month 1 (12x better!)

Incentive structure:
- Monthly: £100/month
- Annual: £1200 (10% discount, vs £1200 full price)
- Expected adoption: 50% annual, 50% monthly
- Blended ARPU: (50% × £1200) + (50% × £100 × 12) = £600 + £600 = £1200 (same)
- But cash: 50% customers prepay (£600 per customer, £60K total)
- Strategic: Offer annual heavily (marketing, sales incentive, UI default)

Alternative: Annual + monthly:
- Monthly: £110/month (no discount, 10% premium)
- Annual: £1200/year (10% discount)
- Psychology: Annual discount incentivizes prepay
- Cash flow: If 70% choose annual, £60K + monthly £33K = £93K month 1, then £33K month 2+

`
      },
      {
        heading: "Billing Architecture and Implementation",
        body: `Building billing systems and payment processing.

**Billing system components**

1. Pricing engine (calculate subscription cost)
   - Input: Customer tier, seat count, add-ons, usage
   - Output: Monthly/annual invoice amount
   - Tool: Custom code or Zuora, Stripe Billing, Fastspring

2. Payment processor (collect money)
   - Stripe: 2.2% + £0.30 per transaction (cards), 1% ACH (bank transfer)
   - Square: 2.6% + £0.30 (cards)
   - PayPal: 3.49% + £0.49 (platform)
   - Choose: Stripe for SaaS (lowest cost, best for recurring)

3. Invoice generation
   - Auto-generate monthly invoices
   - Include: Billing period, amount, line items (tiers, seats, add-ons)
   - Tool: Stripe invoicing, custom

4. Subscription management
   - Upgrade/downgrade (mid-cycle proration)
   - Pause/resume
   - Cancellation handling
   - Tool: Stripe, Zuora, custom

5. Dunning (failed payment recovery)
   - Retry logic: Attempt payment 3-4 times over 7 days
   - Communication: Email customer (card declined, update payment)
   - Fallback: Pause account, notify
   - Recovery: 30-40% of failed payments recovered via retry

**Billing models and revenue recognition**

Monthly subscription:
- Billing: £100 on 1st of month
- Revenue recognition: Straight-line £100/month
- Cash: £100 received month 1

Annual subscription:
- Billing: £1200 on day 1
- Revenue recognition: £100/month straight-line (12 months)
- Cash: £1200 received month 1

Usage-based:
- Billing: Cumulative usage billed monthly (£0.10 per API call)
- Revenue recognition: £X per month (actual usage recognized)
- Cash: £X received (variable per month)

Accounting: Under IFRS 15 / ASC 606
- Revenue recognized when performance obligation satisfied
- Subscription = performed monthly (revenue recognized monthly)
- Upfront annual payment = deferred (liability), recognized monthly

Example (100 customers, 60% annual at £1200, 40% monthly at £100):
- Month 1 cash: (60 × £1200) + (40 × £100) = £72K + £4K = £76K
- Month 1 revenue recognized: (100 × £100) = £10K
- Deferred revenue (liability): £72K - £12K (month 1 of annual) = £60K (to be recognized months 2-12)

**Pricing optimization**

Test 1: Annual discount impact
- Control: Monthly £100 (10% premium on annual £1200)
- Variant: Monthly £110 (no premium, annual £1200 unchanged)
- Measure: % choosing annual, blended ARPU
- Expected: 50% baseline → 60% with premium removed → slightly lower ARPU but more cash

Test 2: Tier pricing
- Control: Starter £50, Pro £150, Enterprise custom
- Variant: Starter £75, Pro £200, Enterprise custom (higher pricing)
- Measure: Conversion by tier, churn by tier
- Expected: Higher ASP, but lower tier conversion

Test 3: Usage-based vs flat
- For subset (new feature), test £0.10 per unit vs £50/month base
- Measure: Adoption, revenue by customer
- Expected: Heavy users save money (prefer usage-based), light users cost-conscious

`
      }
    ],
    relatedSlugs: [
      "pricing-strategy-and-price-optimization",
      "unit-economics-ltv-cac-payback",
      "revenue-recognition-and-accounting-standards",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What pricing model should I use?",
        a: "Depends on business: (1) Flat-rate (£99/mo, simple, early stage). (2) Tiered (best for B2B SaaS: starter £50, pro £150, enterprise custom). (3) Usage-based (developer tools, infrastructure). (4) Hybrid (base + usage, for variable consumption). Choose tiered for most SaaS (aligns customer to value, drives upgrades). Test with A/B test to optimize."
      },
      {
        q: "Should I offer monthly or annual billing?",
        a: "Both: Monthly preferred (customer choice), annual upfront (cash flow). Incentivize annual: 10-15% discount. Example: Monthly £100 = annual £1200 (10% off vs £1200 full). Expected adoption: 50-60% annual. Cash advantage: Huge (collect upfront, recognize monthly). Overall ARPU same, but cash flow much better."
      },
      {
        q: "How do I calculate pricing to maximize revenue?",
        a: "Research customer willingness to pay (competitor, DIY cost, survey). Set entry tier 30-50% below willingness to pay (£50-100 for £150-300 willingness). Premium tier 3-5x higher (£150-500). Test: A/B test price changes, measure impact on conversion + churn + ARPU. Optimize for LTV (don't chase max price, focus on customer lifetime value)."
      },
      {
        q: "What should I charge for add-ons?",
        a: "Seat-based: £50-100/additional user (if base includes 5 users). Feature-based: Add-on £50-200/month (more complex feature). API calls: £0.01-0.10 per call (usage-based). Strategy: Price add-ons to encourage adoption (not too high), as they expand existing customers (cheaper than new customer acquisition). Example: Additional user £50/month = £600/year, 6-month payback = good ROI for expansion."
      }
    ],
    videoUrl: ""
  }
];

export default batch203Articles;
