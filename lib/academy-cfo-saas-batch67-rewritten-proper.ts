import { AcademyArticle } from "@/types/academy";

export const batch67Articles: AcademyArticle[] = [
  {
    slug: "product-led-growth-analytics-metrics",
    title: "Product-Led Growth (PLG): Metrics and Analytics for Self-Serve Growth",
    description: "Measure product-led growth: activation, engagement, expansion, and retention within the product. Optimize for self-serve conversion.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "product-led growth",
      "PLG",
      "self-serve growth",
      "product engagement",
      "activation",
      "expansion",
      "product metrics",
      "feature adoption",
      "engagement metrics",
      "conversion analytics"
    ],
    keyTakeaways: [
      "PLG differs from sales-led: No sales team in early motion; customers adopt through product, convert on their own; metrics: % of users who activate (take key action), % of activated who engage regularly (weekly active users %), % who upgrade (expansion), % who churn (retention); each metric is actionable (design change impacts activation, feature improves engagement, pricing impacts expansion)",
      "Activation is critical: If <50% of trial users activate (take first key action), drop-off is too high; design for day-1 activation: in-app walkthrough, email sequence, guide customers to aha moment (first value); most PLG product prioritizes activation > feature richness",
      "Expansion in PLG: Upsell through product (hit feature limit, show premium tier), seat expansion (add more users), usage-based expansion (charge per unit consumed); all triggerable within product without sales intervention; PLG companies get 30-50% of revenue from expansion (vs. land-and-expand with manual upsell)"
    ],
    content: [
      {
        heading: "PLG Metrics Framework",
        body: `Product-led growth (PLG) relies on the product itself to drive adoption and conversion.

Traditional: Sales team → Customer
PLG: Product experience → Customer adoption → Conversion

PLG metrics track the product funnel:

**Activation Funnel**

| Stage | Metric | Benchmark |
|-------|--------|-----------|
| Signup | Users signing up | Volume metric |
| Email verified | % of signups who verify email | 70%+ |
| First login | % of verified who log in day 1 | 50-60% |
| Key action (activation) | % of first-time users who take key action (create project, upload data, make first query) | 40-50% |
| Activated users | Cumulative activated | 25-40% of all signups |

Example: 1000 signups
- 700 verify email (70%)
- 420 log in day 1 (60% of 700)
- 200 activate (47% of 420, take key action)
- Activation rate: 20% (200 ÷ 1000)

This is typical for PLG product: 20% of signups activate.

If <10%, product doesn't deliver quick value (fix onboarding).
If >30%, good activation (most signups see value).

**Engagement Metrics**

After activation, measure ongoing engagement:

DAU/WAU/MAU (Daily/Weekly/Monthly Active Users):
- DAU: % of users logging in daily
- WAU: % of users logging in weekly
- MAU: % of users logging in monthly

Example: 1000 active users
- DAU: 150 (15% daily active)
- WAU: 350 (35% weekly active)
- MAU: 600 (60% monthly active)

Engagement ratio: DAU ÷ WAU = 15% ÷ 35% = 43% (healthy if >30%)

Feature adoption:
- % of users who use key features
- Example: 80% use reporting, 50% use integrations, 20% use API
- Track which features drive stickiness (correlate with retention)

Session length:
- Average time spent in product per session
- Benchmark: 15-30 minutes for productivity tool
- If trending down, engagement declining (red flag)

**Expansion Metrics**

Conversion from free to paid:

Free-to-paid conversion rate:
- % of free users who upgrade to paid
- Benchmark: 2-5% (low, most free users don't convert)
- Depends on: Free tier constraints, pricing, value proposition

Expansion rate:
- % of paid users who upgrade to higher tier or add seats
- Benchmark: 10-30% per year
- Track by: Cohort, feature, usage pattern

ARPU (Average Revenue Per User):
- Total revenue ÷ Total users
- Tracks: As you expand within product, ARPU grows
- Example: £1M revenue ÷ 1000 users = £1K ARPU
- Growing ARPU indicates expansion working

NRR (Net Revenue Retention):
- (Beginning revenue + Expansion - Churn) ÷ Beginning revenue
- For PLG: Often >100% (expansion > churn)
- Example: Start month with £100K revenue, expand £20K, churn £10K, NRR = 110%

**Retention Metrics**

PLG lives or dies by retention:

Retention curve:
- % of users still active at week 1, 2, 4, 12
- Healthy: 60%+ week 1, 40%+ week 4, 20%+ week 12

Example:
- Week 1: 400 (60% of 666 cohort) still active
- Week 2: 320 (48%)
- Week 4: 200 (30%)
- Week 12: 100 (15%)
- Month 12: 50 (7%)

If retention drops to <50% week 1, product has activation or UX issue.

Churn curve:
- % of users leaving per week
- Track by cohort (week 1 churn, week 2 churn, etc.)
- If churn >10% per week, attrition too high

**Correlation Analysis**

Correlate engagement metrics with retention:

Question: What predicts if user stays?
- Users who log in weekly have 60% 3-month retention
- Users who log in monthly have 20% 3-month retention
- Insight: Weekly engagement is stickiness threshold

Question: What feature drives retention?
- Users who use reporting have 70% 3-month retention
- Users who don't use reporting have 30% 3-month retention
- Insight: Prioritize reporting feature (drives stickiness)

Question: What's the activation → retention correlation?
- Activated users (took key action day 1): 50% 3-month retention
- Non-activated users (never took key action): 5% 3-month retention
- Insight: Activation (day 1 key action) is critical (10x retention impact)

These correlations drive product roadmap (prioritize features that drive retention).

**PLG Product Optimization**

Levers to improve activation (increase % from 20% to 30%):

1. **Faster time to value**
   - Current: User needs 10 minutes to see first result
   - Target: 2 minutes (remove friction)
   - How: Faster onboarding, pre-loaded sample data, guided workflow
   - Impact: More users activate day 1

2. **Clear value prop in product**
   - Current: Generic "Get started" prompt
   - Target: "Create your first report in 5 minutes" (specific, timed)
   - How: Contextual help, in-app guidance, progress indication
   - Impact: More clarity, higher conversion

3. **Remove signup friction**
   - Current: 5-field signup form, email verification
   - Target: 2-field form, auto-email verification
   - How: Progressive profiling (ask more after signup)
   - Impact: More people reach product

4. **Product-qualified leads**
   - Identify high-engagement signups (logged in day 1, tried 3 features)
   - Sales reaches out to these users (high conversion)
   - Impact: Convert engaged free users to paid

Levers to improve expansion (increase ARPU):

1. **Usage-based pricing**
   - Current: Tier-based (basic, pro, enterprise)
   - Target: Charge per unit consumed (seats, API calls, storage)
   - How: Show consumption in product, upgrade prompt when limit hit
   - Impact: Seamless expansion, no friction

2. **Feature gating**
   - Premium features locked behind paywall
   - Users who need feature see upgrade prompt
   - Current: No feature limits
   - Target: Advanced reporting locked at Pro tier
   - Impact: Expansion based on actual need

3. **Expansion email campaigns**
   - Monthly: "You've used feature X, did you know Y might help?" (suggest next feature)
   - If approaching limits: "You're near seat limit, upgrade to remove limits"
   - Impact: Guide users to upsell without sales

4. **Seat expansion**
   - Show team members who could benefit
   - "Invite [teammate] to collaborate, add 1 seat"
   - Current: Single-user product
   - Target: Multi-user with seat expansion
   - Impact: Revenue per company grows

**PLG Unit Economics**

PLG changes unit economics compared to sales-led:

Sales-led (enterprise):
- CAC: £50K (expensive sales)
- ACV: £500K (high)
- Payback: 12 months
- LTV ÷ CAC: 20x

PLG (self-serve):
- CAC: £500 (cheap marketing)
- ACV: £5K (lower)
- Payback: 3 months
- LTV ÷ CAC: 100x

PLG has better unit economics (much lower CAC) but lower ACV. Trade-off: Need more volume to reach same total revenue.

**PLG + Sales Hybrid**

Many successful SaaS use hybrid:
- PLG: Free tier with trial/freemium (high volume, low CAC)
- Sales: Sales team engages high-engagement users (high ACV, warm conversion)

Example:
- Free tier: 50K signups, 2% convert to paid = 1000 customers at £1K/year = £1M
- Sales-sourced (from free tier): 100 of those high-engagement users upgrade to enterprise at £100K = £10M
- Total: £11M revenue with combined model

Best of both: PLG's volume + Sales' high-ACV revenue.

**PLG Product Metrics Checklist**

Weekly review:
- [ ] Activation rate (% of signups activating)
- [ ] DAU/WAU ratio (engagement)
- [ ] Free-to-paid conversion (% upgrading)
- [ ] ARPU (average revenue per user)
- [ ] Retention curve (% active at week 1, 4, 12)
- [ ] Feature adoption (% using key features)
- [ ] NRR (organic growth from expansion)

If activation dropping: Fix onboarding
If retention dropping: Identify feature driving stickiness
If ARPU flat: Improve expansion (upsells, seat expansion)
If free-to-paid conversion low: Check pricing strategy (maybe too high)

PLG success requires obsessive focus on metrics. Unlike sales-led (AE-driven), PLG depends on product engagement metrics to identify opportunities. Track these metrics weekly, not quarterly.
`
      }
    ],
    relatedSlugs: [
      "free-trial-freemium-conversion-optimization",
      "product-adoption-feature-analytics",
      "customer-success-operations",
      "metrics-dashboard-design-kpi-tracking",
      "conversion-funnel-optimization"
    ],
    faq: [
      {
        q: "What activation rate should I target?",
        a: "30%+ is good (30% of signups take key action). <20% indicates onboarding friction. >50% is excellent (very quick value)."
      },
      {
        q: "How do I know if my product is engaging?",
        a: "DAU/WAU ratio >30% is healthy. If <20%, engagement is low (product not sticky). Also check: What % of users use key features? If low, feature usage issue."
      },
      {
        q: "What's a good free-to-paid conversion rate?",
        a: "2-5% is typical for PLG. Higher (5-10%) is excellent (strong value prop). Lower (<2%) indicates pricing or positioning issue."
      },
      {
        q: "Should I prioritize growth or retention?",
        a: "Retention first. If retention is 20% month 3, growth is wasted (churn too high). Fix retention (activation, engagement, retention curve), then scale with confidence."
      }
    ],
    videoUrl: ""
  }
];

export default batch67Articles;
