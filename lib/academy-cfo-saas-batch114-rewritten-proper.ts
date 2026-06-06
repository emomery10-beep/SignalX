import { AcademyArticle } from "@/types/academy";

export const batch114Articles: AcademyArticle[] = [
  {
    slug: "subscription-economics-contractual-mechanics",
    title: "Subscription Economics and Contractual Mechanics: Structuring Agreements for Growth",
    description: "Master subscription models and contract structures. Optimize terms, manage renewals, and align incentives with customer success.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "subscription model",
      "contract terms",
      "renewal management",
      "payment terms",
      "billing mechanics",
      "contract negotiation",
      "auto-renewal",
      "multi-year deals",
      "usage-based billing",
      "pricing mechanics"
    ],
    keyTakeaways: [
      "Subscription mechanics: Monthly = predictable but churn risk (monthly 3% = 35% annual churn); annual = lower churn (5-10% annual vs 35% for monthly equivalent), but requires working capital (collect upfront, deliver over 12 months). Example: £1M monthly customers, convert to annual → churn reduces from 35% to 7%, revenue becomes more predictable, cash collected upfront improves runway. Incentive: Annual pricing discount (10-15% cheaper per month) drives conversions.",
      "Multi-year contracts (2-3 years): Typical for enterprise (£100K+ annual value); offers 15-20% discount vs annual; locks in revenue for 2-3 years (planning certainty); trade-off: customer locked in (less flexibility), company committed to not raising prices as much. Example: £100K annual contract with 15% discount = £85K/year for 3 years locked in (£255K total guaranteed). Risk: If product doesn't deliver, customer stuck but won't renew (total 3-year problem, not just one year).",
      "Usage-based billing: Customer pays for what they use (API calls, data processed, users); incentive: customer aligns with growing use (good thing!). Risk: Revenue unpredictable (can't forecast), high usage customers cheaper per-unit (economies of scale favor big customers), need sophisticated billing. Example: Stripe charges per transaction (2.2% + £0.30). Works great for Stripe (predictable per-transaction fee), harder for SaaS with variable usage patterns."
    ],
    content: [
      {
        heading: "Subscription Models and Economics",
        body: `The subscription model has several variations, each with different economics and implications.

**Monthly Subscription**

How it works:
- Customer pays £100/mo
- Billing on same day each month
- Can cancel anytime (usually 30-day notice)
- Revenue recognized monthly as service delivered

Economics:
- Predictable monthly revenue (if customers stable)
- High churn risk (customers can leave any month)
- Typical monthly churn: 3-5% (annual equivalent: 35-50%)
- Requires strong customer success (keep customers each month)
- Cash flow: Monthly payments (steady)

Example company:
- 1000 customers at £100/mo = £100K MRR
- Monthly churn: 3% = 30 customers lost
- To grow 10%: Need 100 new customers (30 replacement + 70 growth)
- At 20% MoM growth: Need 130 new customers/month
- After 12 months, still only £200K MRR (if starts at £100K growing 20%)

Advantages:
- Easy to cancel (low friction for customer)
- No long-term commitment (good for smaller budgets)
- Month-to-month recalibration (adjust usage/seats)

Disadvantages:
- High churn (especially SMB)
- Revenue unpredictable
- High customer acquisition cost relative to LTV (short lifespan)

**Annual Subscription**

How it works:
- Customer pays £1000/year upfront (or in installments)
- Billing once per year on anniversary
- Usually 30-60 day cancellation notice (non-refundable)
- Revenue recognized monthly as service delivered (for accounting)

Economics:
- Large cash collection upfront (improves runway)
- Lower churn (30-50% lower than monthly equivalent)
- Typical annual churn: 5-10% (much better than monthly 35-50%)
- Incentive: Offer 10-15% discount vs. monthly (£100/mo × 12 = £1,200/year, offer £1,000/year = 16% discount)

Example company:
- 1000 customers at £1,000/year = £83.3K MRR (recognized)
- But cash collected: £1M upfront (huge)
- Churn: 5% = 50 customers lost per year
- Only need 50 + 100 new (if growing 100) = 150 new customers/year vs. 1,560/month for growth

Advantages:
- Much lower churn (customers committed for year)
- Upfront cash (improves cash position, runway)
- Revenue predictable (customers locked in for year)
- Discount incentives adoption (10-15% cheaper on annual)

Disadvantages:
- Lower cash initially from new customers (committed to annual billing)
- Customer hesitation (annual commitment harder to justify)
- Requires capital to fund operations until year 2 (less revenue in year 1)

**Multi-Year Contracts (Enterprise)**

How it works:
- 2-3 year contract (often annual billing, multi-year term)
- £100K/year × 3 years = £300K contract value
- Usually 15-20% discount for multi-year commitment
- Example: £100K annual = £85K/year for 3 years

Economics:
- Revenue locked in for 2-3 years (planning certainty)
- Upfront payment per year (cash positive)
- Very low churn (only 2-3% annual, and usually for good reason)
- Net Retention typically high (enterprise expands within commitment)

Example:
- Sign 10 enterprise customers at £85K/year × 3 years = £2.55M contract value
- Year 1 cash: £850K
- Year 2 cash: £850K
- Year 3 cash: £850K
- Total: £2.55M paid by customer
- Recognition: £850K/year revenue each year

Advantages:
- Revenue and cash highly predictable (3 years certain)
- Customer expansion within contract (NRR often >100%)
- Customer stickiness (locked in, unlikely to leave)
- Enterprise sales team loves it (big deal, high commission)

Disadvantages:
- Massive churn if customer unhappy (stuck for 3 years, won't renew)
- Price locked in (can't raise prices mid-contract)
- Customer negotiation leverage (bigger deals, more flexibility requested)

**Usage-Based Billing**

How it works:
- Customer pays based on usage (API calls, data processed, users)
- Example: Stripe charges 2.2% + £0.30 per transaction
- Billing monthly, customer charged for actual usage
- Revenue unpredictable (depends on customer usage)

Economics:
- Revenue scales with customer success (good thing!)
- Unpredictable revenue (hard to forecast)
- Price per unit typically decreases at scale (volume discounts)
- Requires sophisticated billing systems

Example:

Customer A: Minimal usage
- 100 API calls/month × £0.001/call = £0.10

Customer B: Moderate usage
- 1M API calls/month × £0.001/call = £1,000

Customer C: Heavy usage
- 100M API calls/month × £0.0001/call = £10,000 (volume discount kicks in)

Advantages:
- Customer aligned with their own success (pay for value)
- No customer friction (only pay for what use)
- Scales naturally (growing customers pay more)

Disadvantages:
- Revenue unpredictable (hard to forecast)
- High-usage customers cheap per-unit (lose margin)
- Billing complexity (need sophisticated system)
- Customer surprise (unexpected high bill)

**Hybrid Models**

Many SaaS use combinations:

Model 1: Seat-based + Usage
- Base price for 5 seats
- Extra £50/month per additional seat
- Plus overage for API calls above limit

Model 2: Tiered + Usage
- Starter plan: £50/mo (basic features, 1000 API calls/mo)
- Growth plan: £200/mo (advanced features, 10K API calls/mo)
- Enterprise: Custom (unlimited)

Model 3: Freemium + Premium
- Free tier: Basic features, limited usage
- Premium: £99/mo, full features, unlimited
- Enterprise: Custom pricing

**Contract Negotiation**

Common customer requests:

Request 1: Multi-year discount
- Customer: "Will you discount if we commit 3 years?"
- Your response: 10-15% discount for 3-year vs. annual
- Risk: Locked in price, can't raise prices
- Benefit: Revenue certainty

Request 2: Longer payment terms
- Customer: "Can we pay net-30 instead of upfront?"
- Your response: Yes, but might require more frequent renewal (monthly vs annual)
- Risk: Cash flow delay, customer default risk
- Benefit: Customer easier sale

Request 3: Custom features
- Customer: "Can you build X for us?"
- Your response: Yes, as part of enterprise contract
- Risk: Custom features distract from core product
- Benefit: Higher ACV, stickier customer

Request 4: Discounts
- Customer: "Best price you can do?"
- Strategy: Offer annual or multi-year discount, not monthly discount
- Example: Monthly at £1,000 but annual at £10K (15% savings)
- Avoid: Straight percentage off (erodes brand value)

**Managing Renewals**

Key dates for annual subscriptions:

90 days before renewal:
- Sales team reaches out
- Confirm customer will renew
- Discuss expansion (upsell)
- Negotiate if needed

60 days before:
- If hesitant: Escalate to executive
- Offer incentives (discounts, new features)
- Address any issues

30 days before:
- Should be decided
- Process renewal in billing system
- Confirm payment method

15 days before:
- Final reminder
- Process payment

At renewal:
- Celebrate renewal
- Plan for next year

After renewal:
- If didn't renew: Exit interview (why?)
- If renewed: Expansion planning

Renewal rate (% of customers who renew) is key metric:
- 80%+ renewal = healthy churn (<5% annually)
- 70-80% = concerning (5-15% churn)
- <70% = major problem (>15% churn)

**Contract Documentation**

Key elements:

1. Term: When does contract start/end?
2. Renewal: Auto-renew or manual renewal?
3. Payment: When is payment due? How much?
4. Services: What exactly is customer paying for?
5. Termination: Can customer cancel early? Penalties?
6. Liability: Limitations (capped damages, etc.)
7. SLA: Uptime/performance guarantees
8. Confidentiality: NDA terms
9. IP: Who owns code/customizations?
10. Governing law: Which jurisdiction/law?

Template contract should be reviewed by lawyer once, then reused (only customize for enterprise deals).

Cost: Lawyer review £3-5K, saves time and liability.

**Billing Systems**

Modern SaaS billing systems:
- Stripe Billing
- Zuora
- Chargebee
- Recurly
- Fastspring

Key features needed:
- Recurring billing (monthly/annual)
- Dunning (retry failed payments)
- Proration (mid-cycle upgrades)
- Usage metering (for usage-based billing)
- Revenue recognition (for accounting)

Cost: £500-10K/month depending on scale and complexity

Essential for SaaS (manual billing doesn't scale).

**Subscription Economics Summary**

| Model | Churn | Predictability | Upfront Cash | Discount | Best For |
|-------|-------|--------|--------|----------|-----------|
| Monthly | 3-5% | Low | Low | None | SMB, price-sensitive |
| Annual | 0.5-1% | High | High | 10-15% | Mid-market, growth |
| Multi-year | 0.2-0.5% | Very High | High | 15-20% | Enterprise |
| Usage-based | 1-2% | Very Low | Variable | Scale discount | API/data intensive |

Choose based on target customer and business stage.
`
      }
    ],
    relatedSlugs: [
      "pricing-psychology-and-packaging",
      "customer-acquisition-cost-optimization",
      "net-revenue-retention-nrr-mastery",
      "bookings-vs-revenue-recognition",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "Should I offer monthly or annual subscriptions?",
        a: "Both. Annual has much lower churn (1% vs 3-5% monthly). Offer 10-15% discount for annual to drive conversion. Most SaaS: 60-70% annual, 30-40% monthly."
      },
      {
        q: "How much discount for multi-year contracts?",
        a: "10-15% for 2-year, 15-20% for 3-year. This locks in revenue predictability but commits you to that price (can't raise prices mid-contract)."
      },
      {
        q: "What's a good renewal rate?",
        a: "80%+ is healthy. 70-80% is concerning. <70% is major problem. Track by cohort (what's the renewal rate for customers acquired 12 months ago?)"
      },
      {
        q: "Should I use usage-based billing?",
        a: "Yes if your cost/value scales with usage (API calls, data). No if fixed cost (per-user tool). Usage-based aligns incentives but makes revenue unpredictable."
      }
    ],
    videoUrl: ""
  }
];

export default batch114Articles;
