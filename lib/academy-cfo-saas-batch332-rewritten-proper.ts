import { AcademyArticle } from "@/types/academy";

export const batch332Articles: AcademyArticle[] = [
  {
    slug: "pricing-strategy-and-price-optimization",
    title: "Pricing Strategy and Price Optimization: Maximizing Revenue Value",
    description: "Master pricing strategy. Test prices, optimize models, increase revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["pricing strategy", "price optimization", "value-based pricing", "price testing", "price increase"],
    keyTakeaways: [
      "Pricing fundamentals: Set price based on (1) cost (what does it cost to deliver?), (2) value (how much is it worth to customer?), (3) market (what do competitors charge?). Cost-plus pricing: Cost + 50% margin (wrong, ignores value). Value-based pricing: What customer would pay (right). Example: Infrastructure cost £10, competitors charge £100, customer value £500 = price at £75-150 (below competitor, but above cost). Test: Always test prices (A/B test price, measure conversion).",
      "Price testing process: (1) Current price: £50/month, 100 customers. (2) Test price: £60/month on 50% of new customers. (3) Measure: Conversion rate (how many convert?), churn (do people leave?). (4) Calculate impact: If conversion drops <20%, increase price. If churn spikes >3%, hold. (5) Roll out: Implement on all customers (existing get grandfathered at old price). Typical: 5-10% price increase sustainable (converts 95%+ of price-insensitive customers).",
      "Annual price increases: Standard practice (2-5% annually). Communication: Announce 30 days in advance (no surprise). Exceptions: Early customers locked for year, long-term contracts fixed. Impact: 3% annual increase = 3% revenue increase (no new customer needed). Combined with growth: Inflation + growth = revenue compound faster."
    ],
    content: [
      {
        heading: "Developing and Executing Pricing Strategy",
        body: `Strategic pricing approaches and optimization methods.

**Pricing foundations**

Three pricing philosophies:

Cost-plus pricing:
- Formula: Cost + markup
- Example: Cost £10, 100% markup = £20 price
- Problem: Ignores customer value, leaves money on table
- Use: Only for commodity products (little differentiation)
- Not recommended for SaaS (value much higher than cost)

Competitive pricing:
- Formula: Competitor price ± adjustment
- Example: Competitor charges £100, we charge £90 (undercut)
- Problem: Reacts to market (not proactive)
- Use: Mature markets, commoditized products
- Trade-off: Lower price = lower margin, need more volume

Value-based pricing:
- Formula: What customer would pay based on value created
- Example: Save customer £100K/year in labor = can price at £20K/year (20% of value)
- Benefit: Maximize revenue, align with customer success
- Use: Recommended for all SaaS
- Key: Understand customer value (how much does they save/earn with product?)

Decision: Use value-based pricing (maximize revenue per customer, align incentives)

**Understanding customer value**

Value calculation framework:

Component 1: Time saved
- Current process: 40 hours/week manual
- With software: 5 hours/week manual
- Saved: 35 hours/week
- Cost per hour: £50 (labor cost)
- Annual value: 35 hours × 50 weeks × £50 = £87.5K

Component 2: Revenue generated
- Without software: 1000 customers acquired/year
- With software: 1500 customers acquired/year
- Additional revenue: 500 customers × £5K average = £2.5M
- Profit margin: 30% = £750K additional profit
- Value: £750K (annual profit increase)

Component 3: Risk reduction
- With software: Reduce errors by 90%
- Cost of errors: £100K/year (current)
- Reduction: £90K savings
- Value: £90K

Total value = £87.5K + £750K + £90K = £927.5K annually

Recommended price = 10-30% of value
- 10%: £92.75K (below customer ROI threshold)
- 20%: £185.5K (good deal for customer)
- 30%: £278.25K (excellent value, customer sees strong ROI)

Typical pricing = 15-25% of value (balance: customer sees ROI, company gets fair margin)

**Tiered pricing strategy**

Why tiers:
- Different customers, different values
- Avoid one-size-fits-all
- Maximize revenue from high-value users
- Segment: Light users, mid-market, enterprise

Tier design:

Starter tier:
- Price: £29/month
- Target: Solo, early stage
- Value: Core features only
- Limit: 1 user, 5K transactions/month
- Typical: Solo founders, side projects

Pro tier:
- Price: £99/month
- Target: Growing companies
- Value: All features, API access
- Limit: 5 users, 100K transactions/month
- Typical: £1-10M revenue companies

Enterprise tier:
- Price: Custom (£500-5000+/month)
- Target: Large companies
- Value: White-label, custom integration, dedicated support
- Limit: Unlimited
- Typical: £10M+ revenue companies

Tier positioning (feature matrix):

| Feature | Starter | Pro | Enterprise |
|---|---|---|---|
| Core analytics | ✓ | ✓ | ✓ |
| Custom reports | | ✓ | ✓ |
| API access | | ✓ | ✓ |
| White-label | | | ✓ |
| Dedicated support | | | ✓ |
| SLA | 99% | 99.5% | 99.99% |

Expected distribution:
- Starter: 40% of customers, 10% of revenue (price sensitive)
- Pro: 50% of customers, 50% of revenue (value seekers)
- Enterprise: 10% of customers, 40% of revenue (premium buyers)

Total MRR example:
- Starter: 200 × £29 = £5.8K
- Pro: 250 × £99 = £24.75K
- Enterprise: 50 × £1000 = £50K
- Total: £80.55K MRR (with 500 customers)

**Price testing**

A/B testing methodology:

Step 1: Define test
- Control: Current price (£50)
- Test: New price (£60 or £40)
- Population: New customers only (don't upset existing)
- Duration: 4 weeks (full sales cycle)

Step 2: Track metrics
- Conversion rate: % leads → paying customers
- Cost per conversion: Acquisition cost / conversions
- Churn rate: % customers leaving
- ARPU: Revenue per customer

Step 3: Analyze results

Scenario A - Price increase test (£50 → £60)

| Metric | Control | Test | Change |
|---|---|---|---|
| Leads | 100 | 100 | - |
| Conversions | 20 | 19 | -5% |
| Conversion rate | 20% | 19% | -5% |
| ARPU | £50 | £60 | +20% |
| Revenue impact | £1000 | £1140 | +14% |

Outcome: Test wins! (-5% conversions, +20% price = +14% revenue)
Decision: Implement price increase

Scenario B - Price reduction test (£50 → £40)

| Metric | Control | Test | Change |
|---|---|---|---|
| Leads | 100 | 100 | - |
| Conversions | 20 | 28 | +40% |
| Conversion rate | 20% | 28% | +40% |
| ARPU | £50 | £40 | -20% |
| Revenue impact | £1000 | £1120 | +12% |

Outcome: Test wins (+40% conversions > -20% price = +12% revenue)
Decision: Lower price, increase volume

Step 4: Decide

Decision rule:
- If test revenue ≥ control revenue: Implement
- If test revenue < control revenue: Hold (test failed)
- If tie or close: Run longer (need more data)

**Price increase execution**

Timeline:

Current state:
- 500 existing customers at £50
- Monthly revenue: £25K

Decision: Increase price to £55 (10% increase)

Announcement (week 1):
- Email customers: "Starting [date 30 days out], price increases to £55"
- Reason: "Product improvements, new features, better support"
- Grandfathering: "Current customers stay at £50 for 12 months"
- New customers: Immediately on new price

Transition (weeks 2-4):
- Monitor churn (are customers leaving?)
- Support: Answer questions about price increase
- New sales: All new customers at £55

New state (month 2):
- Existing customers: 500 at £50 (grandfathered) = £25K
- New customers: 10 at £55 (new pricing) = £550
- Total: £25.55K (minimal churn, healthy transition)

Ongoing:
- Track: Churn from price increase (monitor for 90 days)
- Adjust: If churn >5%, may need to change strategy
- Next increase: Schedule for year 2 (another 5-10%)

**International pricing**

Complexity: Different markets, different ability to pay

Strategy 1: Uniform global pricing
- Same price for all countries (in local currency)
- Pros: Simple, fair
- Cons: Too expensive for developing markets, may lose customers

Strategy 2: Localized pricing
- Different prices by country/region
- Example: US £100, EU £80, India £20
- Pros: Optimize conversion by market
- Cons: Complex, perception of unfairness
- Use: If big geographic differences in ability to pay

Strategy 3: PPP (Purchasing Power Parity)
- Adjust prices based on country's purchasing power
- Tools: Stripe Billing has PPP pricing
- Example: Notion, Figma use PPP (India customers pay much less)
- Pros: Fair, optimizes revenue globally
- Cons: Complexity, potential arbitrage

Recommendation:
- Start with uniform global pricing (simple)
- If low conversion in certain countries: Test localized pricing
- Scale with PPP pricing (more sophisticated)

**Annual planning**

12-month pricing roadmap:

Q1 (Jan-Mar):
- Review current pricing (working? Leaving revenue on table?)
- Test 1: Price increase on new customers (£50 → £55)
- Measure: Conversion impact

Q2 (Apr-Jun):
- Decision: If test worked, implement for all new customers
- Test 2: Tier pricing (current flat £50, test Starter £40/Pro £70)
- Measure: Conversion, ARPU

Q3 (Jul-Sep):
- Decide on tier implementation
- Annual price increase: Existing customers (grandfathering approach)
- Announcement: 30 days notice

Q4 (Oct-Dec):
- Execute annual price increase
- Plan for next year: New features → new tier?
- Analyze: Full-year pricing impact on revenue

Expected impact:
- Uniform pricing: +3% revenue (annual inflation increase)
- Tier pricing: +30% ARPU (mix improves, more high-value customers)
- Tier + annual increase: +35% revenue potential

**Common pricing mistakes**

Mistake 1: Price never tested
- Problem: Set price once, never update (leaving money on table)
- Fix: Regular testing (quarterly)
- Impact: 5-15% potential revenue improvement

Mistake 2: Price increases shock customers
- Problem: Announce day before, customers churn
- Fix: 30-day notice, clear communication, grandfathering
- Impact: Minimize involuntary churn

Mistake 3: No value communication
- Problem: Price is arbitrary (why £50 not £49?)
- Fix: Communicate value (save X hours, earn Y revenue)
- Impact: Customers understand, willing to pay more

Mistake 4: Too complex pricing
- Problem: 10 tiers, customers confused
- Fix: 3 tiers max (Starter, Pro, Enterprise)
- Impact: Higher conversion, easier to understand

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "subscription-billing-models-and-pricing-architecture", "recurring-revenue-models-and-optimization", "metrics-dashboard-design-kpi-tracking", "customer-acquisition-strategy-and-marketing-roi"],
    faq: [
      { q: "How do I determine pricing?", a: "Value-based pricing recommended: Calculate customer value (time saved, revenue generated, risk reduction). Price at 10-30% of value. Example: Software saves £100K/year, price at £15-30K (15-30% of value). Competitive pricing: Check what competitors charge. Cost-plus: Cost + margin (not recommended, ignores value). Test: A/B test prices on new customers (measure conversion, revenue impact), implement if positive." },
      { q: "Should I use tiered pricing?", a: "Yes, if different customer segments with different needs. Tiers: Starter (light users, price-sensitive), Pro (growing, features), Enterprise (large, custom). Distribution: 40% Starter (10% revenue), 50% Pro (50% revenue), 10% Enterprise (40% revenue). Typical ARPU uplift: 30-50% vs flat-rate. Complexity: Keep to 3 tiers max (clarity)." },
      { q: "How often should I increase prices?", a: "Annual: Standard practice (2-5% annually for inflation). Process: (1) Test on new customers first, (2) If working, announce 30 days before, (3) Grandfather existing (keep old price 12 months), (4) New customers at new price. Churn impact: Typically <1-2% involuntary churn if communicated well. Revenue impact: 3% annual increase = 3% revenue (automatic). Avoid: Shocking customers (no notice), complex changes." }
    ],
    videoUrl: ""
  }
];

export default batch332Articles;
