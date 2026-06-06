import { AcademyArticle } from "@/types/academy";

export const batch109Articles: AcademyArticle[] = [
  {
    slug: "growth-accounting-advanced-unit-economics",
    title: "Growth Accounting and Advanced Unit Economics: Understanding Revenue Growth Drivers",
    description: "Master growth accounting. Decompose growth into new customers, expansion, and churn. Understand which drives matter most.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "growth accounting",
      "revenue decomposition",
      "unit economics",
      "new customer revenue",
      "expansion revenue",
      "churn revenue",
      "growth drivers",
      "revenue attribution",
      "retention revenue",
      "efficient growth"
    ],
    keyTakeaways: [
      "Growth accounting decomposes revenue change into: (1) new customer acquisition (bookings from new customers), (2) expansion revenue (upsell/cross-sell to existing), (3) churn (lost revenue from cancellations); example: Month 1 ARR £1M, Month 2 ARR £1.15M = +£150K growth split into: +£200K new customers, +£50K expansion, −£100K churn = net +£150K. Understand which driver matters most (for this company, churn is biggest problem)",
      "Efficient growth metrics: Magic Number = (New ARR acquired ÷ Previous spend on sales/marketing) = should be >0.7; Unit economics efficiency = (LTV ÷ CAC) = should be >3x, Magic Number focus on efficiency of recent growth, unit economics on lifetime efficiency. Both matter: company can be efficient on unit economics but inefficient on recent growth (vice versa)",
      "Target growth accounting allocation by stage: Startup (focus on new customer acquisition, expansion secondary), growth (balance new customers + expansion, reduce churn), scale (expand existing, reduce CAC, focus on efficiency), mature (maximize expansion, minimize churn, defend against competition). Allocation should match business stage; if early stage focusing only on expansion = missing growth opportunity"
    ],
    content: [
      {
        heading: "Understanding Growth Accounting",
        body: `Growth accounting decomposes revenue growth into component sources: new customers, expansion, and churn.

**Growth Accounting Formula**

ARR (Month 2) = ARR (Month 1) + New customer ARR + Expansion ARR − Churn ARR

Example:

Month 1:
- ARR: £1,000,000

Month 2:
- New customer ARR: +£200,000 (10 new customers at £20K each)
- Expansion ARR: +£50,000 (5 existing customers upgraded to higher tier)
- Churn ARR: -£100,000 (4 customers canceled, £25K average)
- Net change: +£200K + £50K − £100K = +£150K
- Month 2 ARR: £1,150,000

Growth rate: +£150K ÷ £1M = +15% monthly

This seems healthy, but let's analyze:
- New customer acquisition: Strong (+£200K)
- Expansion: Moderate (+£50K)
- Churn: Concerning (−£100K, 4 customers)

If churn continues, it will kill growth. Fix: Improve retention.

**New Customer Revenue (Bookings)**

Definition: Revenue from customers who didn't exist last month.

Calculation:
- Count new customers acquired this month
- Multiply by average contract value (ACV)
- Example: 10 new customers × £20K ACV = £200K new ARR

Drivers:
- Sales team size (more reps = more deals)
- Sales productivity (deals closed per rep)
- Marketing efficiency (qualified leads generated)
- Conversion rate (leads → customers)

To increase new customer revenue:
- Hire more sales reps (scale linearly)
- Improve sales productivity (training, better tools)
- Improve marketing efficiency (better campaigns, lower CAC)
- Expand target market (TAM expansion)

Example impact:
- Current: 10 new customers/month × £20K = £200K
- Add sales rep: 12 new customers/month = £240K (+20%)
- Improve conversion: 12 × £22K = £264K (+32% from higher ACV)
- Combined: Both levers = £264K (32% improvement)

**Expansion Revenue**

Definition: Additional revenue from existing customers (upsell, cross-sell).

Calculation:
- Track existing customers from prior month
- Measure ARPU increase from cohort
- Example: 100 existing customers in Month 1, average £10K ARPU
- Month 2: Same 100 customers, average £10.5K ARPU
- Expansion revenue: £0.5K × 100 = £50K

Drivers:
- Product value increase (more features, more usage)
- Customer success (helping customers get value)
- Pricing increases (raise prices on renewal)
- Cross-sell (sell adjacent products)
- Upsell (sell higher tier)

To increase expansion revenue:
- Improve product (more features = more value)
- Improve customer success (help customers get ROI)
- Increase pricing (10-15% annual price increase)
- Land-and-expand (sell to more departments)

Example impact:
- Current: 100 customers × £10K = £1M ARR, 0% expansion
- Improve CS: 100 customers × £10.5K = £1.05M (5% expansion)
- Pricing increase: 100 customers × £11K = £1.1M (10% expansion)
- Combined: Both levers = £1.15M (15% expansion)

Expansion revenue is high-margin (no acquisition cost) and compounding (improves LTV).

**Churn Revenue (Lost Revenue)**

Definition: Revenue from customers who canceled.

Calculation:
- Track customers from prior month
- Identify who canceled
- Sum their cancelled MRR
- Example: 4 customers canceled, average £25K each = £100K churn

Drivers:
- Product issues (customers unhappy with product)
- Competitive pressure (competitor's product better)
- Customer success issues (not getting value)
- Financial pressure (customer can't afford)
- Company/market changes (customer's business changed)

To decrease churn:
- Improve product (address feature gaps)
- Improve customer success (help customers get value)
- Improve onboarding (faster time-to-value)
- Improve pricing (flexible pricing options)
- Build switching costs (deeper integration)

Example impact:
- Current churn: 4 customers × £25K = £100K (10% monthly churn rate)
- Improve onboarding: Reduce churn to 3 customers = −£75K (7.5% monthly churn)
- Improve CS: Reduce churn to 2 customers = −£50K (5% monthly churn)
- Combined: Both levers = −£50K (50% reduction in churn)

**Growth Accounting Analysis**

Use growth accounting to understand what's driving (or slowing) growth:

Scenario A: Growth-stage company
- Prior ARR: £5M
- Current ARR: £6.5M (+£1.5M, +30%)
- New customer: +£1.2M (80% of growth)
- Expansion: +£0.3M (20% of growth)
- Churn: −£0M (essentially zero)

Analysis: Strong new customer acquisition, but expansion weak.
Action: Focus on expanding existing customers (more upside, higher margin).

Scenario B: Mature company
- Prior ARR: £50M
- Current ARR: £55M (+£5M, +10%)
- New customer: +£2M (40% of growth)
- Expansion: +£5M (50% of growth)
- Churn: −£2M (40% loss)

Analysis: New customer acquisition low, expansion strong, but churn high.
Action: Focus on retention (fix churn problem), improve new customer efficiency (CAC too high relative to growth).

Scenario C: Struggling company
- Prior ARR: £10M
- Current ARR: £9.8M (−£0.2M, −2%)
- New customer: +£1M (healthy)
- Expansion: +£0.5M (healthy)
- Churn: −£1.7M (killing growth)

Analysis: Churn is catastrophic (17% monthly). New customer acquisition can't offset.
Action: Emergency retention focus. Fix product, improve CS, understand why churn so high.

**Unit Economics and Efficiency**

Advanced unit economics frameworks:

Framework 1: CAC Payback by Cohort
- Track each customer cohort (acquired in Month X)
- Calculate payback (months to recover CAC)
- Plot payback trend over time
- Example: Month 1 cohort = 12-month payback, Month 6 cohort = 8-month payback (improving)

Framework 2: LTV Calculation by Cohort
- Track LTV of each cohort
- Plot LTV trend
- Example: Month 1 cohort = £50K LTV, Month 6 cohort = £60K LTV (improving, better retention)

Framework 3: Expansion Rate by Cohort
- Track expansion revenue by customer cohort
- Example: Month 1 cohort = 5% expansion, Month 6 cohort = 8% expansion (improving, better product-market fit)

Framework 4: Magic Number by Quarter
- Magic Number = (New ARR this quarter ÷ S&M spend last quarter)
- Example: Q2 new ARR £500K ÷ Q1 S&M spend £300K = 1.67 magic number
- Benchmark: >0.7 is healthy, >1.0 is excellent
- Trend: Track quarterly to see if improving

Framework 5: Rule of 40
- Growth rate + operating margin = should be >40
- Example: 30% growth + 15% margin = 45 (healthy)
- Example: 50% growth + −15% margin = 35 (concerning, trading margin for growth)

**Efficient Growth Playbook**

Stage 1: Product-market fit (Year 1)
- Focus: New customer acquisition (prove demand)
- Growth target: 100%+ YoY
- Expansion: Secondary (don't know what features customers need yet)
- Churn: Accept higher churn (still finding fit)
- Metric: Growth rate >100%, CAC < LTV

Stage 2: Growth (Years 2-3)
- Focus: Balance new customer + expansion
- Growth target: 50-100% YoY
- Expansion: Parallel (learn what customers want)
- Churn: Reduce below 5% monthly
- Metric: Magic Number >0.7, LTV/CAC >3x

Stage 3: Scale (Years 4-5)
- Focus: Maximize expansion, improve efficiency
- Growth target: 25-50% YoY
- Expansion: Primary (most revenue from existing)
- Churn: Below 3% monthly
- Metric: Magic Number >1.0, expansion >20% of growth

Stage 4: Mature (Year 5+)
- Focus: Defend market, profitability
- Growth target: 10-25% YoY
- Expansion: Dominates (80%+ of growth)
- Churn: <2% monthly
- Metric: Operating margin >25%, NRR >110%

**Common Growth Mistakes**

Mistake 1: Ignore churn while chasing new customers
- Problem: New customers at £1M/mo, churn £1M/mo = zero net growth
- Solution: Parallel focus on retention and acquisition

Mistake 2: Overinvest in expansion before product-market fit
- Problem: Spend on customer success before you've proven customers want product
- Solution: Build new customer acquisition first, expansion second

Mistake 3: Focus only on revenue growth, ignore unit economics
- Problem: Acquire customers at £10K CAC, but LTV £15K = bad economics
- Solution: Monitor both growth rate AND unit economics

Mistake 4: Benchmark against wrong peer
- Problem: Compare growth to 100% growth startup when your stage is mature
- Solution: Benchmark against peer of similar stage and market

Mistake 5: Not track growth accounting
- Problem: Don't know if growth coming from new customers or expansion
- Solution: Implement growth accounting dashboard, review monthly

Growth accounting shows you exactly where your growth comes from. This insight is invaluable for strategic decisions.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-deep-dive",
      "customer-acquisition-cost-optimization",
      "net-revenue-retention-nrr-mastery",
      "customer-lifetime-value-calculation",
      "sales-efficiency-magic-number"
    ],
    faq: [
      {
        q: "What's a healthy growth accounting breakdown?",
        a: "Depends on stage. Early: 90% new customers, 10% expansion. Growth: 60% new, 40% expansion. Mature: 40% new, 60% expansion. Churn should be <5% monthly throughout."
      },
      {
        q: "How do I calculate expansion revenue?",
        a: "Track existing customers from prior month. Measure ARPU change in cohort. Example: 100 customers, ARPU went from £10K to £10.5K = £50K expansion revenue."
      },
      {
        q: "What's a good Magic Number?",
        a: ">0.7 is healthy, >1.0 is excellent. Calculated as: (New ARR this quarter ÷ S&M spend last quarter). Benchmark quarter-over-quarter to see if improving."
      },
      {
        q: "How do I reduce churn?",
        a: "Improve product (address issues), improve onboarding (faster time-to-value), improve customer success (help customers succeed), build switching costs. Track churn by cohort to understand root cause."
      }
    ],
    videoUrl: ""
  }
];

export default batch109Articles;
