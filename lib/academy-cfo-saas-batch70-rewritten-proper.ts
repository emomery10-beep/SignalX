import { AcademyArticle } from "@/types/academy";

export const batch70Articles: AcademyArticle[] = [
  {
    slug: "expansion-revenue-upsell-cross-sell",
    title: "Expansion Revenue and Upsell Strategy: Growing Revenue from Existing Customers",
    description: "Grow revenue from existing customers through upsells and cross-sells. Measure expansion revenue and optimize for maximum customer lifetime value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "expansion revenue",
      "upsell",
      "cross-sell",
      "net revenue retention",
      "NRR",
      "expansion revenue growth",
      "customer expansion",
      "account expansion",
      "revenue growth",
      "customer lifetime value"
    ],
    keyTakeaways: [
      "Expansion revenue = revenue growth from existing customers (upgrade pricing tier, add seats, usage-based increases); measured by Net Revenue Retention (NRR): (revenue start + expansion − churn) ÷ revenue start; example: Start £100K, expand £20K, churn £5K, NRR = 115%; NRR >100% means organic growth (expansion > churn); typical SaaS: 110-120% NRR is healthy, 130%+ is exceptional",
      "Expansion mechanics: Seat expansion (add users), tier upgrade (basic→pro→enterprise), usage-based (more API calls, more storage), feature adoption (pay for premium features); example: Product seats 10 users at £50/user/month = £500/month; company grows, needs 20 seats = £1000/month = £500 expansion; expansion motion: usage trigger → in-app prompt → upgrade → new revenue",
      "Expansion drives unit economics: Company with £1M ARR, no expansion (churn 3% = £30K loss) = £970K next year; same company with 15% expansion (£150K new) = £1.12M next year (15% growth); no expansion = churn spiral, expansion = profitable growth; focus: 80% expansion > 20% new customer acquisition for mature SaaS"
    ],
    content: [
      {
        heading: "Understanding Expansion Revenue and NRR",
        body: `Expansion revenue is additional revenue from existing customers who upgrade, add more usage, or expand to more users.

**Expansion Revenue Types**

1. **Seat expansion (multi-user): Customer adds more team members**
   - Current: 5 users at £50/user/month = £250/month
   - Expands to: 10 users at £50/user/month = £500/month
   - Expansion revenue: £250/month

2. **Tier upgrade (feature expansion): Customer moves to higher-priced tier**
   - Current: Pro tier at £200/month
   - Upgrades to: Enterprise tier at £500/month
   - Expansion revenue: £300/month

3. **Usage-based expansion: Customer consumes more of the product**
   - Current: 100K API calls/month at £0.01 per call = £1,000/month
   - Expands to: 500K API calls/month = £5,000/month
   - Expansion revenue: £4,000/month

4. **Feature add-ons: Customer enables premium features**
   - Current: Base product £200/month
   - Adds: Advanced analytics (£50/month) + integrations (£30/month)
   - Expansion revenue: £80/month

**Net Revenue Retention (NRR)**

NRR measures organic growth from your existing customer base. It's the most important SaaS metric because it shows business health independent of new customer acquisition.

Formula:
\`\`\`
NRR = (Beginning revenue + Expansion revenue − Churn revenue) ÷ Beginning revenue
\`\`\`

Example:

Beginning of month: £1,000,000 in MRR
- Expansion from existing customers: +£150,000 (upgrades, seat expansion, usage)
- Churn from existing customers: −£100,000 (customers cancelled, downgraded)
- Net change: +£50,000
- NRR = (£1M + £150K − £100K) ÷ £1M = 105%

This company grew 5% just from existing customers (before new customer acquisition).

**NRR Benchmarks**

| NRR | Status | Health |
|-----|--------|--------|
| <100% | Contraction (churn > expansion) | Declining business |
| 100% | Flat (churn = expansion) | Plateauing |
| 100-110% | Low expansion | Healthy but slow growth |
| 110-120% | Healthy expansion | Good business model |
| 120-130% | Strong expansion | Excellent product fit |
| 130%+ | Exceptional expansion | Best-in-class |

Examples by company maturity:

- **Early stage (Series A)**: 100-110% NRR typical (focus on retention, some expansion)
- **Growth stage (Series B)**: 110-120% NRR expected (proven expansion strategy)
- **Mature stage (Series C+)**: 120%+ NRR required (mature expansion metrics)

Top-tier SaaS companies (Salesforce, Slack, Atlassian) have 130%+ NRR, meaning they grow organically even without acquiring new customers.

**Why NRR Matters More Than Growth**

Example: Two companies, both growing 50% YoY, but different NRR:

Company A: 50% growth, 100% NRR
- £10M ARR today
- Needs 100% new customer acquisition to grow 50% (adding £5M in new revenue)
- High CAC required, lots of customer acquisition

Company B: 50% growth, 120% NRR
- £10M ARR today
- Needs only 30% new customer acquisition to grow 50% (adding £3M in new)
- Lower CAC sufficient, more efficient growth

Company B will be more profitable long-term (lower CAC needed, same growth).

**Expansion vs. Churn Dynamics**

NRR is really about expansion offsetting churn:

Example:

- Churn only: £100K revenue, 5% monthly churn = £95K retained
  - Next year: £95K × (0.95)^12 = £59K (massive decline)

- Churn + 10% expansion: £100K + £10K expansion, 5% monthly churn
  - Month 1: £100K + £10K − £5K = £105K
  - Month 2: £105K + £10.5K − £5.2K = £110.3K
  - By month 12: £130K+ (growing despite churn)

With expansion at 110% NRR, you can maintain growth indefinitely. Without expansion, churn spirals downward.
`
      },
      {
        heading: "Expansion Mechanics and Strategies",
        body: `Expansion revenue comes from intentional product and GTM strategies. Here's how to build expansion into your business.

**Seat Expansion Strategy**

Seat expansion is the simplest expansion motion: More users = higher cost.

How it works:

1. **Single-user product initially**
   - Customer signs up: 1 user, £50/month
   - Customer grows: Team of 5, add 4 more seats
   - Cost: 5 seats × £50 = £250/month (£200 expansion)

2. **Trigger expansion prompts**
   - In-app alert: "You have 3 users, but 5 team members need access"
   - Prompt: "Add them now for £50/user/month"
   - Friction: Removed (easy upgrade flow)
   - Result: 60-70% convert to adding seats

3. **Pricing psychology**
   - Per-user pricing is transparent (customers understand cost)
   - Creates expansion trigger as team grows
   - Aligns pricing with customer value (more users = more value)

Example playbook:

| Month | Users | Price/user | MRR | Expansion | Churn |
|-------|-------|-----------|-----|-----------|-------|
| 1 | 2 | £50 | £100 | — | — |
| 2 | 2 | £50 | £100 | — | — |
| 3 | 4 | £50 | £200 | £100 | — |
| 6 | 8 | £50 | £400 | £200 | — |
| 12 | 15 | £50 | £750 | £350 | (none) |

This customer expanded from £100 to £750/month = 650% expansion (7x revenue growth in 12 months).

**Tier Upgrade Strategy**

Tier upgrades move customers from basic → pro → enterprise.

How it works:

1. **Tier structure**
   - Basic: £200/month (core features)
   - Pro: £500/month (advanced features, priority support)
   - Enterprise: Custom (premium features, dedicated support, SLAs)

2. **Feature gating triggers upgrades**
   - Customer tries to use "Advanced reporting" (Pro-only feature)
   - Upgrade prompt: "This feature requires Pro, upgrade now"
   - Friction: Low (customer already wants the feature)
   - Result: 40-50% upgrade

3. **Expansion trigger criteria**
   - Usage: "You've used X% of your limits, consider upgrading"
   - Team size: "Your team is 50 people, consider Enterprise"
   - Value-add: "You're in Y industry, you should see Z feature (Pro only)"

Example playbook:

| Cohort | Baseline | Month 6 upgrade | Month 12 upgrade | ARPU |
|--------|----------|--------|--------|------|
| 100 customers | £200 | 20 to Pro (£500) | 5 Pro→Enterprise (£2000) | £370 avg |
| | £20K MRR | +£6K MRR | +£10K MRR | +50% from base |

Starting 100 customers at £200 = £20K MRR. By month 12, through tier upgrades:
- 80 still at Basic: £16K
- 15 at Pro: £7.5K
- 5 at Enterprise: £10K
- Total: £33.5K MRR from same 100 customers

67.5% expansion revenue in 12 months.

**Usage-Based Expansion**

Usage-based pricing (pay per unit consumed) creates organic expansion as customer grows.

How it works:

1. **Consumption model**
   - API calls: £0.01 per call
   - Storage: £0.05 per GB/month
   - Seats: £30 per active seat/month
   - Transactions: £0.10 per transaction processed

2. **Expansion triggers automatically**
   - Customer grows business → more API calls
   - More API calls → higher bill
   - No need for sales motion (automatic expansion)
   - In-app prompt: "You're approaching usage limit, upgrade plan"

3. **Expansion is aligned with customer success**
   - If customer uses more, they're likely getting more value
   - Price increase is proportional to value (customer benefits)
   - Less price objection than "raise list price"

Example playbook:

| Month | API calls | Unit price | MRR | Expansion |
|-------|-----------|-----------|-----|-----------|
| 1 | 100K | £0.01 | £1,000 | — |
| 3 | 300K | £0.01 | £3,000 | £2,000 |
| 6 | 800K | £0.01 | £8,000 | £5,000 |
| 12 | 2M | £0.01 | £20,000 | £12,000 |

Same customer, 20x expansion in 12 months, without sales intervention.

**Expansion Velocity**

Expansion velocity is how quickly customers expand spending.

| Business type | Typical expansion velocity |
|-------|-----------|
| SMB self-serve | £50 → £200/month in 6 months (4x) |
| Mid-market sales-led | £500 → £2,000/month in 12 months (4x) |
| Enterprise | £5,000 → £30,000/month in 18 months (6x) |
| Usage-based API | £100 → £1,000/month in 6 months (10x) |

Fast expansion velocity (4-6 months to significant uplift) is a sign of strong product-market fit.

**Measuring Expansion Efficiency**

Track expansion rate:

\`\`\`
Expansion rate = Expansion revenue ÷ Beginning revenue
\`\`\`

Example: £500K beginning revenue, £100K expansion = 20% expansion rate.

Healthy expansion rates by stage:
- Series A: 10-15% per month
- Series B: 15-25% per month
- Series C: 20-30% per month

If expansion rate is declining month-over-month, it indicates:
- Market saturation (customers already at maximum seats)
- Competitive pressure (customers using alternative products)
- Product stagnation (no new features to upgrade for)
- Pricing power loss (can't justify higher tiers)

Investigate and fix.
`
      },
      {
        heading: "Building Expansion into Unit Economics",
        body: `Expansion revenue is critical to SaaS unit economics. It determines profitability and allows scaling without acquiring new customers.

**Expansion Math: The £10M ARR Example**

Scenario A: No expansion (100% NRR)

Starting position:
- MRR: £833K (£10M ARR)
- Monthly churn: 3% = £25K loss
- New customer acquisition: £250K/month spend
- New customers acquired: ~50/month (at typical CAC/ACV)
- New MRR: £50K/month
- Net change: −£25K + £50K = +£25K (3% growth)

Year 1 result:
- Revenue: £12.5M (3% growth)
- Burn on acquisition: £3M annually
- Operating margin: Negative (growth dependent)

Scenario B: Strong expansion (120% NRR)

Starting position:
- MRR: £833K
- Expansion: +£83K/month (10% of base)
- Churn: £25K loss
- Net from existing: +£58K/month (6.9% organic growth)
- New customer acquisition: £250K/month spend
- New customers acquired: ~50/month
- New MRR: £50K/month
- Total net change: +£58K + £50K = +£108K (13% growth)

Year 1 result:
- Revenue: £20M (13% growth, same as Scenario A in terms of effort)
- Burn on acquisition: £3M annually (same)
- Operating margin: Positive (expansion provides cushion)
- Growth is organic + efficient

Expansion provides 6.9% organic growth. Same acquisition spend drives 13% total growth instead of 3%.

**LTV Impact**

Expansion increases customer lifetime value (LTV), which improves unit economics:

Formula: LTV = ARPU × gross margin % × (1 ÷ monthly churn %)

Example customer:

Without expansion:
- ARPU: £200/month (no increase)
- Gross margin: 70%
- Monthly churn: 3%
- Lifetime months: 1 ÷ 0.03 = 33 months
- LTV: £200 × 0.70 × 33 = £4,620

With 15% annual expansion:
- ARPU grows: £200 → £230 by month 12, £265 by month 24
- Average ARPU lifetime: £240
- Gross margin: 70%
- Monthly churn: 3%
- Lifetime months: 33
- LTV: £240 × 0.70 × 33 = £5,544

Same customer, +20% LTV due to expansion (£924 additional lifetime value).

**Payback Period with Expansion**

Expansion reduces effective CAC payback:

Standard payback calculation (ignores expansion):
- CAC: £2,000
- Monthly revenue: £250
- Gross margin: 70%
- Payback: £2,000 ÷ (£250 × 0.70) = 11.4 months

With 10% annual expansion:
- Month 1-12: £250/month revenue
- Month 13+: £275/month (10% expansion)
- Average revenue per month (lifetime): ~£300
- Effective payback: £2,000 ÷ (£300 × 0.70) = 9.5 months

Expansion shortens payback by ~2 months without changing CAC or base pricing.

**Profitability at Scale: Expansion Imperative**

At £10M+ ARR, expansion becomes survival metric:

Company without expansion (100% NRR):
- Revenue: £10M
- Churn: 3% = £300K/month loss
- To grow: Must acquire £300K/month in new customers just to offset churn
- New acquisition: ~60 customers at £5K ACV
- CAC spend required: £300K-£600K/month (80% gross margin)
- Operating margin: Negative

Company with expansion (120% NRR):
- Revenue: £10M
- Base churn: £300K loss
- Expansion: +£1M/month
- Net organic growth: +£700K/month
- Can grow without acquisition or with minimal acquisition
- Operating margin: Positive

At scale, expansion is not optional. It's the difference between profitable and burning cash.

**Expansion Roadmap**

Build expansion sequentially:

1. **Months 1-6: Enable seat expansion**
   - Multi-user support
   - Per-user pricing
   - Simple add-user flow
   - Target: 20-30% of customers add seats

2. **Months 6-12: Introduce tier upgrades**
   - Feature gates at higher tiers
   - Usage-based upsell triggers
   - Sales outreach to upgrade candidates
   - Target: 10-15% of customers upgrade tier

3. **Months 12-18: Usage-based expansion**
   - Track usage metrics
   - Set consumption limits
   - Trigger upgrades when approaching limits
   - Target: Automatic expansion as customers grow

4. **Months 18+: Optimize expansion**
   - A/B test upgrade messaging
   - Personalize expansion offers (by segment)
   - Predictive churn & expansion offers (save at-risk customer with upgrade)
   - Target: 120%+ NRR

By month 18, you should have multiple expansion motions generating 110-130% NRR. This becomes the core growth engine.

**Expansion Metrics to Track Daily**

- NRR % (overall health)
- Expansion revenue (£ amount)
- Expansion rate (%)
- Churn revenue
- Seat expansion rate
- Tier upgrade rate
- Usage growth per customer
- Expansion velocity (months to first expansion)

If any metric trends down, investigate and act immediately. Expansion is fragile (requires continuous product iteration).
`
      }
    ],
    relatedSlugs: [
      "net-revenue-retention-nrr-mastery",
      "customer-lifetime-value-ltv-calculation",
      "churn-analysis-retention-improvement",
      "pricing-strategy-and-tier-design",
      "product-led-growth-analytics-metrics"
    ],
    faq: [
      {
        q: "What's a good NRR?",
        a: "100-110% is healthy, 110-120% is good, 120%+ is excellent. Below 100% means churn > expansion (business contracting). Top SaaS companies have 130%+ NRR."
      },
      {
        q: "How do I calculate NRR if I have monthly churn?",
        a: "NRR = (Begin revenue + Expansion − Churn) ÷ Begin revenue. Churn includes customers who cancel and those who downgrade. Expansion includes upgrades, seat additions, and usage increases."
      },
      {
        q: "Should I focus on expansion or new customer acquisition?",
        a: "Early stage: 70% acquisition, 30% expansion. Mature: 40% acquisition, 60% expansion. As you scale, expansion becomes more important (lower CAC, higher LTV)."
      },
      {
        q: "How do I trigger expansion without being too pushy?",
        a: "Usage-based triggers are best (customer approaching limit, offering upgrade solves their problem). Feature gates work (premium feature, prompt to upgrade). Sales outreach for high-value expansion (enterprise upsells)."
      }
    ],
    videoUrl: ""
  }
];

export default batch70Articles;
