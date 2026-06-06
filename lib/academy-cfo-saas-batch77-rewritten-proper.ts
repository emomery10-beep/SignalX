import { AcademyArticle } from "@/types/academy";

export const batch77Articles: AcademyArticle[] = [
  {
    slug: "churn-analysis-retention-improvement",
    title: "Churn Analysis and Retention Improvement: Stopping Customer Attrition",
    description: "Analyze churn by type and cause. Implement retention strategies that reduce customer loss and improve lifetime value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "churn rate",
      "customer churn",
      "retention",
      "churn analysis",
      "customer attrition",
      "churn prevention",
      "retention strategies",
      "involuntary churn",
      "voluntary churn",
      "churn cohort"
    ],
    keyTakeaways: [
      "Churn rate = % of customers lost monthly; formula: (customers lost in month ÷ customers start of month) × 100%; example: 1000 customers, 30 churned = 3% monthly churn = 30% annual churn; healthy: <3% monthly (30% annual); enterprise <1% monthly (10% annual); SMB 5%+ monthly (50%+ annual); every 1% improvement in churn = 10-20% LTV increase",
      "Two churn types: Involuntary (failed payment, payment expired, company closed) = easy fix (retry logic, payment updates), Voluntary (switched to competitor, found cheaper option, no longer needs product) = hard fix (requires product/GTM improvement); track both separately; involuntary should be <20% of total churn (rest is fixable)",
      "Improve retention: Fix activation (day-1 aha moment), improve features used (feature adoption), reduce friction (support, bugs), increase stickiness (expand features, multi-user adoption, integrations); monitor cohort retention, not blended churn (cohort reveals retention improvement trends); if churn flat despite product improvements, problem is GTM/messaging (wrong customer acquired), not product"
    ],
    content: [
      {
        heading: "Understanding Churn Rate and Its Impact",
        body: `Churn is the percentage of customers you lose each period. It's the metric that most directly impacts profitability and growth.

**Churn Definition**

Monthly churn rate = (Customers lost in month ÷ Customers at start of month) × 100

Example:

Start of month: 1,000 customers
During month: 30 customers cancel/don't renew
End of month: 970 customers
Monthly churn: (30 ÷ 1,000) × 100 = 3%

**Annual churn** (derived from monthly):
Annual churn ≈ (1 − (1 − monthly churn)^12) × 100

Example:
- 3% monthly churn = (1 − 0.97^12) × 100 = 30.5% annual churn

Interpretation: Over 12 months, you lose 30% of customers at 3% monthly churn.

**Churn Benchmarks**

| Customer type | Healthy churn | Acceptable | Concerning |
|---|---|---|---|
| Enterprise (500+) | <1% monthly | 1-2% | >2% |
| Mid-market (50-500) | 1-2% monthly | 2-3% | >3% |
| SMB (2-50) | 3-5% monthly | 5-8% | >8% |
| Freemium/free tier | 8-15% monthly | — | >15% |

Why churn varies:
- Enterprise: Hard to switch (integration costs, switching risk)
- SMB: Easy to switch (lower integration costs)
- Free tier: No commitment (easy to abandon)

**Churn and Business Viability**

Churn determines whether your business can scale:

Example with 5% monthly churn:

| Month | Customers start | Churn (5%) | New acquired | Customers end |
|-------|----------|----------|-----------|----------|
| 1 | 100 | 5 | 10 | 105 |
| 2 | 105 | 5.25 | 12 | 111.75 |
| 3 | 111.75 | 5.59 | 14 | 120.16 |
| 6 | — | — | — | 165 |
| 12 | — | — | — | 380 |

With 5% churn and constant acquisition, you grow 280% in 12 months.

With 10% monthly churn:

| Month | Customers start | Churn (10%) | New acquired | Customers end |
|-------|----------|----------|-----------|----------|
| 1 | 100 | 10 | 10 | 100 |
| 2 | 100 | 10 | 10 | 100 |
| 3 | 100 | 10 | 10 | 100 |
| 12 | 100 | 10 | 10 | 100 |

With 10% churn and same acquisition, you're flat (churn = new customers).

**This is the churn cliff**: At some churn rate, you can't grow no matter how much you acquire. That rate is your CAC payback threshold.

If CAC payback = 12 months, you need <8% monthly churn to scale (because customer needs to last longer than payback to be profitable).

**Churn and Customer Lifetime Value**

Churn directly determines LTV:

LTV = (Monthly revenue × Gross margin) ÷ Monthly churn rate

With £200/month revenue and 70% GM:

| Monthly churn | LTV |
|---|---|
| 1% | £14,000 |
| 2% | £7,000 |
| 3% | £4,667 |
| 5% | £2,800 |
| 10% | £1,400 |

At 1% churn, customer is worth £14K. At 10% churn, worth £1.4K (10x less valuable).

Reducing churn is the highest-leverage lever for improving LTV.
`
      },
      {
        heading: "Analyzing Churn Types and Root Causes",
        body: `Not all churn is equal. Different churn has different causes and fixes.

**Involuntary Churn**

Involuntary churn: Customer wants to stay but can't (payment failed, card expired, company closed).

Example:

Customer signs annual contract in January, pays £1,000 via card. In March, card expires (customer forgets to update). Payment fails. After 2 retry attempts, account is suspended. Customer churns (involuntarily).

Involuntary churn should be <20% of total churn (easy to fix).

Fixes:

1. **Payment retry logic**
   - Retry failed payment 2-3 times over week
   - Example: Failed on day 1, retry day 3 and day 7
   - Recovers 20-30% of failed payments

2. **Payment updates**
   - Email reminder when card expiring (30 days before)
   - In-app prompt to update payment method
   - Proactive (before failure) vs. reactive (after failure)

3. **Dunning flows**
   - Clear communication on failed payment
   - Don't immediately suspend (give grace period)
   - Example: 3 failed attempts = 7-day warning before suspension

Example impact:
- Baseline involuntary churn: 0.5% of customers
- Implement retry logic: Reduce to 0.35% (30% recovery)
- Add payment reminders: Reduce to 0.2% (60% recovery)
- Total improvement: 0.3% monthly churn saved

**Voluntary Churn**

Voluntary churn: Customer actively decides to leave (found cheaper option, switched to competitor, no longer needs product).

This is harder to prevent (requires product/GTM improvement).

Common reasons for voluntary churn:

1. **Price objection** (20% of voluntary churn)
   - Customer found cheaper alternative
   - Fix: Improve value perception (highlight ROI), tier pricing lower, offer discounts

2. **Product doesn't match needs** (30%)
   - Customer's use case evolved
   - Competitor better matches new use case
   - Fix: Add features, improve onboarding, pivot positioning

3. **Lack of support** (15%)
   - Slow response, unhelpful support team
   - Fix: Improve support quality, response time, knowledge base

4. **Product issues/bugs** (15%)
   - Product crashes, slow, unreliable
   - Fix: Improve stability, performance, reliability

5. **Switching to free/freemium** (10%)
   - Found cheaper open-source alternative
   - Fix: Freemium tier, lower entry price, bundled offering

6. **No longer relevant** (10%)
   - Company pivoted, product no longer needed
   - Fix: None (expected churn, accept it)

**Analyzing Churn by Cohort**

Churn varies by cohort (acquisition month/source).

Example:

| Cohort | Month 1 | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|---------|
| Jan 2025 | 10% | 25% | 40% | 65% |
| Feb 2025 | 12% | 27% | 42% | 63% |
| Mar 2025 | 10% | 26% | 41% | 64% |
| Apr 2025 | 8% | 24% | 39% | — |
| May 2025 | 6% | 22% | — | — |

Insights:
1. **Month 1 churn improving** (10% → 6%): Onboarding improvements working
2. **Later month churn also improving** (65% → maybe 60%): Product stickiness improving
3. **Consistent decline**: Product and GTM changes both helping

If churn was flat (10% every cohort), you'd know product improvements aren't working.

**Segmented Churn Analysis**

Churn varies by customer segment:

| Segment | Monthly churn | Annual | LTV (£200/mo, 70% GM) |
|---------|---|---|---|
| Enterprise | 1% | 12% | £14K |
| Mid-market | 3% | 30% | £4.7K |
| SMB | 5% | 50% | £2.8K |

Enterprise is 5x stickier than SMB.

Strategy:
- Enterprise: Focus on stickiness (premium support, integrations)
- SMB: Focus on efficiency (self-serve, lower CAC)

If enterprise churn increases from 1% to 2%, that's a red flag (2x worse).
If SMB churn increases from 5% to 6%, that's normal variance.

**Predictive Churn Signals**

You can predict churn before it happens:

Signs a customer is at risk of churning (next 30 days):

1. **Engagement drop**: Usage declining (features used less frequently)
2. **Support tickets increase**: More complaints = dissatisfaction
3. **Feature adoption low**: Not using key features (no aha moment)
4. **No expansion**: Hasn't upgraded or added seats (stagnation)
5. **Payment issues**: Failed payment or dispute (financial stress)
6. **Downgrade request**: Customer asked to move to lower tier
7. **Long payment delays**: Invoices unpaid 60+ days (financial health)

If customer has 3+ of these signals, churn probability is 50%+.

Action: Proactive outreach (customer success call, offer, discount, feature request).

Recovery rate for at-risk customers: 30-50% (if you act quickly).
`
      },
      {
        heading: "Retention Strategies and Measurement",
        body: `How to reduce churn and improve customer retention.

**Retention Levers**

1. **Improve onboarding (day 1 activation)**
   - Goal: Get customer to first value in <1 hour
   - Current: 50% of users activate on day 1
   - Target: 70% activate on day 1 (+20% improvement)
   - Impact: Day 1 activation cohort has 60% 3-month retention vs. 20% non-activated
   - Result: 40% reduction in early-stage churn

2. **Feature adoption (within 30 days)**
   - Goal: Customers use 5+ key features by day 30
   - Current: 40% use 5+ features
   - Target: 60% use 5+ features
   - Impact: Features drive stickiness (customers who use 5+ have 50% 3-month retention vs. 20% for <5)
   - Result: 30% reduction in month 1 churn

3. **Improve support quality**
   - Goal: <4 hour response time, 80% first-response resolution
   - Current: 12 hour response, 40% first-response resolution
   - Impact: Fast support = 90% satisfaction, slow support = 40% satisfaction
   - Result: 20% reduction in mid-stage churn (due to support issues)

4. **Build stickiness (integrations, multi-user)**
   - Goal: 60% of customers have 3+ integrations or 5+ team members
   - Current: 30% have high integration/team adoption
   - Impact: High integration customers have 5% monthly churn vs. 8% low integration
   - Result: 40% reduction in long-term churn

5. **Proactive retention campaigns**
   - Goal: Reach out to at-risk customers before they churn
   - Tactic: Emails, calls, offers
   - Recovery rate: 30-50% (if you act within 7 days of risk signal)
   - Result: 5-10% reduction in churn overall

6. **Win-back campaigns (for churned customers)**
   - Goal: Re-acquire churned customers at low cost
   - Tactic: Special offer, new features, improved product
   - Win-back rate: 10-20% of churned customers
   - CAC for win-back: 50-70% of original CAC (cheaper to reacquire)
   - Result: 5% additional revenue from win-backs

**Retention by Customer Lifecycle**

Different retention strategies for different customer ages:

**Days 1-7 (Activation phase)**
- Risk: 40% of users never activate (high churn)
- Strategy: Guided onboarding, in-app help, progress tracking
- Goal: 70% day-1 activation
- Metric: % of users completing key action

**Days 8-30 (Feature adoption phase)**
- Risk: 30% users stick around but don't adopt key features
- Strategy: Feature education emails, in-app prompts, use-case guides
- Goal: 80% users using 5+ features
- Metric: Feature adoption %, DAU/WAU

**Month 2-3 (Evaluation phase)**
- Risk: 20% users still evaluating, comparing to competitors
- Strategy: ROI calculator, case studies, customer stories
- Goal: 90% of remaining users satisfied
- Metric: NPS, support satisfaction

**Month 4-12 (Stickiness phase)**
- Risk: 10% churn/month (expected baseline)
- Strategy: Expansion (upsells, integrations), proactive support
- Goal: <5% monthly churn
- Metric: NRR, retention rate by segment

**Measuring Retention**

Track these metrics:

| Metric | Formula | Target |
|--------|---------|--------|
| Monthly churn | (Customers lost ÷ Customers start) × 100 | <3% |
| Cohort retention at month 3 | (Active month 3 ÷ Cohort size) × 100 | >60% |
| Gross revenue retention | (Revenue kept ÷ Beginning revenue) × 100 | >95% |
| Net revenue retention | (Revenue kept + expansion ÷ Beginning revenue) × 100 | >100% (ideal) |
| Customer satisfaction (NPS) | Net Promoter Score | >50 |
| Support satisfaction | % satisfied with support | >80% |

**Retention Roadmap**

Quarterly roadmap to improve churn:

**Q1: Activation (reduce day-1 churn)**
- Goal: Improve day-1 activation from 50% to 65%
- Actions:
  - Simplify signup (3 fields instead of 10)
  - Add in-app walkthrough
  - Pre-load sample data
- Target churn improvement: −2% monthly

**Q2: Feature adoption (reduce month 1 churn)**
- Goal: Improve feature adoption from 40% to 60%
- Actions:
  - Add feature education emails
  - In-app prompts for underused features
  - Create feature-specific use case guides
- Target churn improvement: −2% monthly

**Q3: Support & stickiness**
- Goal: Reduce support-driven churn, increase integrations
- Actions:
  - Improve support response time (12h → 4h)
  - Add key integrations
  - Enable multi-user adoption
- Target churn improvement: −1.5% monthly

**Q4: Proactive retention**
- Goal: Reduce overall churn through at-risk identification
- Actions:
  - Build churn prediction model
  - Launch proactive outreach campaigns
  - Win-back program for recent churns
- Target churn improvement: −1.5% monthly

Total improvement by Q4: −7% monthly churn reduction (from 10% to 3%).

**Churn Benchmarking**

How does your churn compare to peers?

| Metric | Weak | Average | Good | Excellent |
|--------|------|---------|------|-----------|
| Monthly churn | >8% | 5-8% | 2-5% | <2% |
| Retention at 12 months | <40% | 40-60% | 60-75% | >75% |
| NRR | <95% | 95-105% | 105-120% | >120% |
| Customer satisfaction | <60 NPS | 60-70 NPS | 70-80 NPS | >80 NPS |

Use benchmarks to set realistic improvement goals.

Example: If you're at 5% monthly churn and target is 3%, that's a 40% improvement (ambitious but achievable over 12 months).
`
      }
    ],
    relatedSlugs: [
      "customer-lifetime-value-ltv-calculation",
      "customer-success-operations",
      "cohort-analysis-retention-curves",
      "net-revenue-retention-nrr-mastery",
      "unit-economics-deep-dive"
    ],
    faq: [
      {
        q: "What's a healthy monthly churn rate?",
        a: "Enterprise: <1%. Mid-market: 1-3%. SMB: 3-5%. Free tier: 8-15%. Below these rates is excellent, above is concerning. Every 1% improvement = 10-20% LTV increase."
      },
      {
        q: "How do I calculate churn?",
        a: "Monthly churn = (Customers lost in month ÷ Customers at start of month) × 100. Annual churn ≈ (1 − (1 − monthly)^12) × 100."
      },
      {
        q: "What's the difference between voluntary and involuntary churn?",
        a: "Involuntary: Payment failed, card expired, company closed (fix: payment retry logic). Voluntary: Switched to competitor, price too high (fix: product/GTM improvement). Involuntary should be <20% of total churn."
      },
      {
        q: "How do I predict churn before it happens?",
        a: "Watch for: declining usage, support complaints, low feature adoption, failed payments, no expansion, downgrade requests. Customers with 3+ signals have 50%+ churn probability. Reach out proactively."
      }
    ],
    videoUrl: ""
  }
];

export default batch77Articles;
