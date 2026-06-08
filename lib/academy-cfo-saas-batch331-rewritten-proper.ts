import { AcademyArticle } from "@/types/academy";

export const batch331Articles: AcademyArticle[] = [
  {
    slug: "subscription-billing-models-and-pricing-architecture",
    title: "Subscription Billing Models and Pricing Architecture: Building Billing Systems",
    description: "Master billing systems. Design models, implement billing, optimize revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["subscription billing", "billing systems", "pricing architecture", "billing software", "recurring billing"],
    keyTakeaways: [
      "Billing system requirements: (1) Recurring billing (automatic monthly/annual renewal), (2) Flexible changes (upgrade, downgrade mid-cycle, pause), (3) Tax (calculate, collect, remit by jurisdiction), (4) Internationalization (multi-currency, local compliance). Cost: Stripe Billing (2.2% + £0.30), Zuora (enterprise, £1000+/month), Recurly (mid-market). Benefit: Automated (fewer manual invoices), flexible (keep customers happy), tax-compliant (avoid penalties).",
      "Billing models: (1) Flat-rate (everyone pays same, simple), (2) Tiered (Starter/Pro/Enterprise, capture more value), (3) Usage-based (pay for consumption, perfect alignment), (4) Hybrid (base + usage, best of both). Choose by business: SaaS = tiered, Infrastructure = usage-based. Impact: Tiered = 30-50% higher ARPU vs flat-rate.",
      "Billing operations: Prorating (charging for partial month when customer upgrades/downgrades), dunning (retry failed payments), reconciliation (invoice value = revenue recognized). Challenge: Compliance (VAT, sales tax by jurisdiction varies). Solution: Use billing platform (handles complexity). Optimize: Reduce involuntary churn (improve payment success rate from 80% to 95% = significant revenue gain)."
    ],
    content: [
      {
        heading: "Building and Managing Subscription Billing Systems",
        body: `Creating efficient billing infrastructure and revenue operations.

**Billing fundamentals**

Subscription billing definition:
- Automatic recurring charges (monthly, annual, quarterly)
- Customer doesn't have to re-enter payment info
- Renewal happens unless customer cancels
- Flexibility: Upgrade, downgrade, pause, resume

Key requirements:

1. Recurring mechanism:
- Store payment method (credit card, bank account)
- Charge automatically on renewal date
- Retry if payment fails (e.g., card expired)
- Cancel if can't collect after N retries

2. Flexibility:
- Upgrade (customer moves to higher tier mid-cycle)
- Downgrade (customer moves to lower tier)
- Pause (customer pauses, resumes later)
- Cancel (customer leaves)
- Pro-rating: Charge correct amount when mid-cycle change

3. Tax:
- Collect tax by jurisdiction (VAT in EU, sales tax in US)
- Calculate based on customer location
- Remit to tax authority
- Report (monthly/quarterly by location)

4. Internationalization:
- Multi-currency (charge customers in their currency)
- Compliance (local tax rules, payment methods)
- Localization (invoices in local language)

**Billing models**

Model 1: Flat-rate (simple, all-inclusive)

Structure:
- Single price, everyone pays same
- Example: £99/month Slack

Pros:
- Simple (easy to communicate, easy to implement)
- Easy to forecast (predictable revenue)
- Easy to expand (just increase price)

Cons:
- Unfair for different use cases (power users subsidize light users)
- Leave revenue on table (can't capture value from power users)

When to use:
- Early stage (MVP, simple offering)
- Horizontal products (works for many use cases)

Example:
- £50K MRR (500 customers × £100/month)
- Simple to forecast and bill

Model 2: Tiered pricing (value-based)

Structure:
- Multiple tiers (Starter, Pro, Enterprise) at different prices
- Example: Starter £29, Pro £99, Enterprise £500+

Pros:
- Value capture (different customers, different prices)
- Expansion revenue (upgrade customers to higher tiers)
- Segmentation (different use cases served)

Cons:
- More complex (which tier should customer choose?)
- Marketing challenge (too many options can confuse)
- Tier cannibalization (customers stay on cheaper tier)

When to use:
- Growth stage (enough customers to segment)
- Multi-use-case products (different needs)

Example tiers:

| Tier | Price | Users | Features | Typical Segment |
|---|---|---|---|---|
| Starter | £29 | 1-2 | Core features | Solo/SMB |
| Pro | £99 | 5-10 | All features, API | Growth companies |
| Enterprise | Custom | Unlimited | Custom contract | Enterprise |

Revenue impact:
- Flat-rate: 500 customers × £50 = £25K MRR
- Tiered: 200 × £29 + 250 × £99 + 50 × £500 = £5.8K + £24.75K + £25K = £55.55K MRR
- Uplift: 122% revenue increase!

Model 3: Usage-based (consumption)

Structure:
- Charge based on usage (per API call, per user, per transaction)
- Example: Stripe charges 2.2% + £0.30 per transaction

Pros:
- Perfect alignment (customer pays for value used)
- No waste (customer only pays for what use)
- Scales with customer success (more usage = higher price, but higher value)

Cons:
- Revenue unpredictable (usage varies month-to-month)
- Complex billing (requires metering, tracking usage)
- Surprise bills (customers can be shocked by high bills)

When to use:
- Infrastructure/platform SaaS (AWS, Stripe model)
- Pure consumption use case
- Enterprise (can handle billing complexity)

Example:
- Base charge: £100/month (includes 1M API calls)
- Overage: £1 per 10K API calls above 1M
- Customer A: 1.5M calls = £100 + £50 (500K overage) = £150
- Customer B: 5M calls = £100 + £400 (4M overage) = £500

Revenue impact:
- Predictable baseline: £100
- Variable upside: £0-1000+ depending on usage
- Key: Ensure metering accurate (customers trust they're charged fairly)

Model 4: Hybrid (base + usage)

Structure:
- Base monthly fee (includes minimum)
- Overage charge for usage above minimum
- Example: Twilio = £1/month + £0.0075 per SMS

Pros:
- Predictability (base revenue guaranteed)
- Alignment (usage charged fairly)
- Flexibility (works for any use case)

Cons:
- Complexity (two-part billing)
- Surprise bills (customers don't always understand overage model)

When to use:
- Growth-stage SaaS (scaling beyond single model)
- Dual-pricing needed (base + variable)

**Billing system selection**

Stripe Billing

Overview:
- Part of Stripe ecosystem (payment processing)
- Subscription management (invoices, recurring, management portal)
- Metering/usage tracking (usage-based pricing)

Features:
- Recurring: Automatic renewal, flexible scheduling
- Proration: Automatic calculations for mid-cycle changes
- Tax: Calculate tax by jurisdiction (VAT, sales tax)
- Dunning: Retry failed payments with smart logic
- Billing portal: Customers manage own subscriptions (reduce support)
- Webhooks: Events (payment succeeded, subscription created, etc.)

Cost:
- Payment processing: 2.2% + £0.30 per transaction
- Billing: Included in processing fee (no additional cost)
- Worth it: Stripe handles complexity (tax, compliance, retries)

Best for:
- All sizes (startup to enterprise)
- Global: Supports 135+ currencies
- Usage-based: Good metering/metering API

Zuora

Overview:
- Enterprise-grade billing platform
- Complex subscription management
- Deep tax/compliance

Features:
- Flexible billing models (any combination)
- Revenue recognition (ASC 606 compliant)
- Analytics (revenue metrics, cohort analysis)
- Integrations (ERP, CRM, reporting)

Cost:
- Starting: £1000+/month (expensive)
- Best for: £5M+ ARR companies

Best for:
- Enterprise SaaS (complex requirements)
- Need advanced analytics
- Compliance-heavy industry

Recurly

Overview:
- Mid-market focused billing
- Easier than Zuora, more features than Stripe
- SaaS-specific

Features:
- Subscription management (flexible)
- Revenue recognition (SaaS standard)
- Dunning (intelligent retries)
- Integrations (Salesforce, NetSuite)

Cost:
- Starting: £500-1000/month
- Mid-market pricing

Best for:
- £1-10M ARR range
- Need more features than Stripe
- Don't want Zuora complexity/cost

Recommendation:
- Pre-revenue to £500K ARR: Stripe Billing
- £500K-5M ARR: Stripe or Recurly (depends on needs)
- £5M+ ARR: Zuora or Recurly (advanced features, support)

**Billing operations**

Prorating (mid-cycle changes)

Scenario:
- Customer on Starter tier (£29/month), billed Jan 1
- Upgrades to Pro tier (£99/month) on Jan 15 (15 days into cycle)

Calculation:
- Days on Starter: 14 days (Jan 1-14)
- Days on Pro: 17 days (Jan 15-31)
- Starter daily rate: £29/31 = £0.935/day
- Pro daily rate: £99/31 = £3.19/day
- Pro-rated charge: (£0.935 × 14) + (£3.19 × 17) = £13.09 + £54.23 = £67.32
- Credit: -£29 (already paid for month)
- Due: £67.32 - £29 = £38.32

Dunning (failed payment recovery)

Payment failure scenario:
- Customer's credit card declined on renewal
- Not addressed = involuntary churn

Smart dunning process:
- Day 0: Initial charge fails
- Day 3: Send email (payment failed, action needed)
- Day 7: Retry charge
- Day 11: Email (payment still failing)
- Day 15: Final attempt
- Day 17: Cancel subscription (if all retries fail)

Impact:
- Recovery rate: ~40% of failed payments (customers fix payment method)
- Reduces involuntary churn: 5% to 2% (3% improvement)
- Significant revenue impact: 3% of MRR is material

Taxation (complexity)

VAT (EU):
- Charged to B2B: 0% (reverse charge)
- Charged to B2C: Local VAT rate (15-27% depending on country)
- Example: £100 subscription to UK B2C customer = £120 with 20% VAT

Sales tax (US):
- Varies by state (0-10%)
- Different rates in different cities/counties
- Nexus requirement: Need presence in state to charge
- Example: £100 subscription to California customer = £108.625 with 8.625% tax

Compliance:
- Collect and remit (by Stripe, Recurly, or manually)
- Report (quarterly, annually by jurisdiction)
- Audit trail (prove what collected/remitted)

Recommendation: Use billing platform (handles complexity, reduces compliance risk)

**Billing metrics and optimization**

Monthly metrics:

| Metric | Definition | Target | Actions |
|---|---|---|---|
| Revenue | Total invoiced | Growing MoM | Acquire, expand, reduce churn |
| Churn | % customers left | <3% monthly | Improve product, support |
| ARPU | Revenue/customer | Growing | Upsell, price increase |
| Payment success | % successful charges | 95%+ | Improve dunning, communication |
| Days sales outstanding | Days to collect | <30 days | Fast payment, follow up |

Optimization opportunities:

1. Reduce involuntary churn (failed payments)
- Current: 80% payment success (20% fail, some never retry)
- Target: 95%+ payment success
- Tactics: Smart dunning, payment method update reminders, retry logic
- Impact: 3-5% revenue improvement (huge!)

2. Increase payment terms/frequency
- Current: Monthly billing
- Target: Encourage annual (offer 10% discount)
- Impact: 20-30% of customers on annual = cash flow benefit + lower churn

3. Reduce refunds/disputes
- Current: 2% refund rate
- Target: <1%
- Tactics: Better onboarding, clear communication, refund policy
- Impact: 1% revenue improvement

4. Multi-currency optimization
- Current: Different prices in different currencies
- Target: Fair exchange rates (don't over-charge)
- Impact: Customer satisfaction, lower churn

**Common billing mistakes**

Mistake 1: Unclear pricing
- Problem: Customer confused about what they're paying
- Impact: Support requests, refunds, churn
- Fix: Clear pricing page, transparent billing

Mistake 2: Surprising invoices
- Problem: Customer shocked by invoice (usage spike)
- Impact: Payment disputes, churn
- Fix: Usage alerts (warn before bill), caps, soft limits

Mistake 3: Complex prorating
- Problem: Customers don't understand charge when upgrade
- Impact: Support requests, confusion
- Fix: Transparent calculation, clear communication

Mistake 4: No payment retry
- Problem: First payment fails, nothing happens
- Impact: Involuntary churn, 20% revenue loss potential
- Fix: Smart dunning (retry, communicate, recover)

`
      }
    ],
    relatedSlugs: ["recurring-revenue-models-and-optimization", "pricing-strategy-and-price-optimization", "revenue-recognition-and-accounting-standards", "metrics-dashboard-design-kpi-tracking", "unit-economics-ltv-cac-payback"],
    faq: [
      { q: "What billing model should I choose?", a: "Depends on business: (1) Flat-rate (simple, startup), (2) Tiered (capture more value, growth stage), (3) Usage-based (perfect alignment, infrastructure), (4) Hybrid (base + usage, flexible). Tiered typically increases ARPU 30-50% vs flat-rate. Test: Start with tiered for growth potential. Key: Simple to understand, fair to customers." },
      { q: "What billing platform should I use?", a: "Stripe Billing: Pre-revenue to £500K ARR (simple, affordable, no additional cost). Recurly: £500K-5M ARR (more features, £500+/month). Zuora: £5M+ ARR (enterprise, complex, expensive). Choose based on complexity and budget. All handle: Recurring, prorating, tax, dunning, integrations." },
      { q: "How do I improve payment success?", a: "Key lever: Smart dunning (retry failed payments intelligently). Current: ~80% success. Target: 95%+ (recovery of 40% of failed payments = 3-5% revenue gain). Tactics: (1) Retry logic (retry 3-5 times over 2 weeks), (2) Communication (email, SMS when fails), (3) Payment method update prompts, (4) Soft limits (warn before overage charge). ROI: High (small implementation, big revenue impact)." }
    ],
    videoUrl: ""
  }
];

export default batch331Articles;
