import { AcademyArticle } from "@/types/academy";

export const batch196Articles: AcademyArticle[] = [
  {
    slug: "retention-and-churn-reduction-mechanics",
    title: "Retention and Churn Reduction Mechanics: Building Sticky Products",
    description: "Master retention strategy. Analyze churn, identify risk factors, and build retention playbooks.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "churn rate",
      "retention",
      "customer retention",
      "churn analysis",
      "retention strategy",
      "retention cohort",
      "churn reduction",
      "customer lifecycle",
      "early churn",
      "expansion retention"
    ],
    keyTakeaways: [
      "Churn drivers: Month 1 (onboarding failure, product didn't solve problem = 5-10% early churn). Months 2-3 (lack of engagement, feature gaps = 2-3% per month). Months 6-12 (mature customer, may outgrow = 1-2% per month). Total healthy churn: 2% monthly (24% annual). High churn (>3% monthly): Product-market fit issue. Low churn (<1% monthly): Strong retention. Measure by cohort: Customers acquired month 1 cohort, track churn % per month. Pattern: Month 1 spike (poor onboarding), then stable 2-3% (normal). Fix: Improve onboarding (reduce month 1 spike), reduce 2-3% monthly (CS engagement).",
      "Churn reason analysis: Exit surveys (why leave?), support data (complaints), usage data (feature adoption low = predict churn), NPS follow-ups (Detractors = churn risk). Top 5 reasons usually capture 80% of churn. Example: 30% leave due to price (too expensive), 25% competitor features (we missing feature), 20% didn't get value (onboarding failed), 15% company folding, 10% other. Fix top 3: Price (add cheaper tier), features (accelerate roadmap), value (improve onboarding) = reduce churn 20-30%.",
      "Retention economics: 1 customer churned = lose LTV (£10K). Prevent churn = save LTV. Churn reduction 2% to 1.5% = 0.5% of customer base retained. Example: 10,000 customers, 0.5% × £10K = £50K value. CS cost prevent £1 churn = spend £200/customer. If save £10K LTV, ROI 50x. Expansion from retention: Happy customers expand 30-50% more. Focus: Reduce churn 0.5% per quarter (compounds) + expand existing customers (easier than new acquisition)."
    ],
    content: [
      {
        heading: "Measuring and Analyzing Churn",
        body: `Understanding churn patterns and causes.

**Churn Metrics and Definitions**

Monthly churn rate:
- Definition: % of customers lost each month
- Formula: (Customers lost this month) / (Customers at start of month)
- Example: Start with 100 customers, lose 2 = 2% monthly churn
- Annualized: (1 - 0.98)^12 = 22% annual churn (high for SaaS)

Net retention (includes expansion):
- Definition: % of revenue retained + expanded
- Formula: [(Starting revenue) + (Expansion) - (Churn)] / (Starting revenue)
- Example: Start £100K revenue, expand £20K, lose £5K = (100 + 20 - 5) / 100 = 115% NRR
- Target: >100% NRR (growing despite churn), >110% healthy, >130% excellent

Gross retention:
- Definition: % of original customers/revenue retained (no expansion)
- Formula: (Revenue kept from original customers) / (Starting revenue)
- Example: Start £100K, keep £95K (lose £5K to churn) = 95% GR
- Target: >95% GR, >97% excellent

Cohort retention:
- Definition: Track specific cohort (customers acquired same month) over time
- Example: Customers acquired Jan 2024, track % remaining each month
- Month 1: 100% (new), Month 2: 92%, Month 3: 88%, Month 6: 80%, Month 12: 60%
- Insight: 40% lost within year (high), compared to peer 20% lost (low)

**Churn Curve Analysis**

Typical churn pattern (healthy):
- Month 1: 10% early churn (onboarding failures, product-market fit check)
- Month 2-3: 2-3% per month (settling, usage stabilizing)
- Month 6+: 1-2% per month (stable, long-term customers)
- Cumulative at month 12: 1-(0.9 × 0.97 × 0.97 × 0.98 × 0.98 × 0.98 × 0.98 × 0.98 × 0.98 × 0.98 × 0.98 × 0.98) = ~28% annual

If different pattern (problem signals):
- High month 1 churn (>15%): Onboarding broken, product not meeting expectations
- High month 2-3 churn (>5%): Product problems discovered after onboarding
- Rising churn over time: Product staling, competitors pulling customers away

**Churn Reason Analysis**

Collect reasons (multiple methods):
1. Exit surveys: "Why are you leaving?" (multiple choice + open response)
2. Exit interviews: Sales calls with churning customers
3. Support data: Search for complaints, frustrations, feature requests
4. Usage data: Feature adoption, login frequency (if low = predict churn)
5. Feedback: NPS detractors (low score customers), comments

Analyze and categorize:
- Price too high: "£500/month is expensive vs competitor at £300"
- Missing features: "We need multi-user, you only have single-user"
- Competitor wins: "Switched to competitor X"
- Company folding: "Out of business, no longer need"
- Better alternative: "Found free tool that works for us"
- Product issues: "Too many bugs, support unhelpful"

Top reasons (80/20 rule):
- Usually top 3-5 reasons account for 80% of churn
- Example breakdown: Price 30%, features 25%, value 20%, competitor 15%, other 10%

**Impact of Churn on Growth**

Example: Company with £10M ARR, 2% monthly churn:
- Existing revenue: £10M
- Churn impact: £10M × 2% per month = £200K monthly loss
- Annual churn: £10M × (1 - (1-0.02)^12) = £2.2M lost annually
- To stay flat: Need £2.2M new revenue annually (via new customers + expansion)
- To grow 20%: Need £2M growth + £2.2M to offset churn = £4.2M new revenue needed (40% growth in new sales)

Retention improvement impact:
- If reduce churn 2% to 1.5%:
  - New annual churn: £10M × (1 - (1-0.015)^12) = £1.7M
  - Savings: £2.2M - £1.7M = £500K (no additional new revenue needed!)
  - Or: Growth target only needs £1.5M new revenue (vs £4.2M before)
- Lesson: 0.5% reduction in churn = significant impact (equivalent to £500K new revenue)

`
      },
      {
        heading: "Root Cause Analysis and Intervention",
        body: `Identifying and fixing churn drivers.

**Churn Root Causes by Stage**

Early churn (Month 1, >10% means problem):
- Cause: Onboarding failure, product doesn't solve stated problem, UX too complex
- Indicators: Customer doesn't log in beyond day 3, doesn't complete setup
- Fix:
  - Improve onboarding (walkthrough, templates, getting-started guide)
  - Reduce time to first value (days to see benefit)
  - Check product-market fit (are we solving the right problem?)

Mid-stage churn (Month 2-3, >3% means problem):
- Cause: Feature gaps discovered, integration painful, support slow
- Indicators: Feature requests spike, support tickets increase, NPS drops
- Fix:
  - Accelerate roadmap (highest-requested features)
  - Improve support (faster response, better knowledge base)
  - Gather feedback (what's frustrating?)

Mature churn (Month 6+, 1-2% healthy):
- Cause: Outgrew product, competitive displacement, budget cuts
- Indicators: Customer expanding elsewhere (adding competitor tool), fewer logins
- Fix:
  - Expansion playbook (upsell to higher tier, adjacent products)
  - Executive reviews (QBR to refresh relationship, showcase ROI)
  - Competitive monitoring (customer buying competitor? why? respond)

**Churn Intervention Playbook**

At-risk customer identification:
- Use health score: Low feature adoption, infrequent logins, NPS declining, missing QBR
- Proactive flag: Health score <50 = at-risk
- Action: CS outreach (check-in call, ask how we can help)

Example intervention:
- Customer: Health score 40 (at-risk), low adoption, QBR missed
- CS outreach: "Noticed you haven't been as active, wanted to check in"
- Conversation: "We're busy, considering if we still need this"
- Discovery: Customer in cost-cutting mode, price is concern
- Solution: Offered 20% discount for 1 more year (locks in, shows value)
- Result: Prevented churn (saved £50K LTV)

Win-back of churned customers:
- Monitor: Churned 3 months ago, now they may be regretting
- Outreach: "We've made improvements to X (feature they wanted), want to try again?"
- Offer: Special return offer (discount, free tier upgrade)
- Expected: 10-20% win-back rate (of recent churners)
- ROI: Win-back customer cost £500 (discount), value £10K LTV = 20x ROI

**Building Retention Playbook**

Onboarding playbook:
- Day 1: Welcome email, kickoff call, resources
- Day 2-7: Daily check-ins, quick wins (set up first report, add first data)
- Week 2: Training session, best practices
- Month 1: Monthly review, set goals for month 2
- Metric: 80%+ customers complete onboarding, first value <7 days

Engagement playbook:
- Monthly email: "You're using feature X (great!), try feature Y (new, can help)"
- Quarterly QBR: Review progress, ROI, feedback, next steps
- Triggered interventions: If usage drops, email "Miss seeing you, need help?"
- Feature announcements: "Rolled out feature you requested"

Health check cadence:
- Weekly: Auto-calculate health scores, alert CS to at-risk (score <50)
- Monthly: CS team reviews at-risk customers, take action
- Quarterly: Executive review with churning customers (why?), win-back planning
- Annual: Retention retrospective (what worked, what didn't)

**Expansion from Retention**

Expand existing customers (easier than new acquisition):
- Cost: Expansion CAC = £500 (touch from existing CS team)
- Value: Expansion ACV = £5K (lower price, but same or higher margin)
- Payback: 1.2 months (vs new customer 12 months payback)

Expansion triggers:
- Usage-based: Customer using 80%+ features, requesting more capacity = upsell
- Engagement-based: Active customer, high NPS, healthy = right time for conversation
- Time-based: After 6 months stable, revisit plan, offer higher tier
- Request-based: Customer requesting feature only in higher tier = upsell

Expansion example:
- Customer: Started at £500/month (basic tier)
- Usage: Using 90% of features, adding new team
- Expansion conversation: "You've outgrown basic tier, recommend pro tier (£1500, includes team)"
- Close rate: 40% of engaged customers expand
- Annual expansion revenue: 1000 customers × 40% × (£1500-£500) = £400K expansion ARR

`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "customer-success-metrics-and-program-design",
      "unit-economics-ltv-cac-payback",
      "expansion-revenue-and-upsell-strategy",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "What's a healthy churn rate?",
        a: "Healthy: 1-2% monthly (12-25% annual). Problem: >3% monthly (>35% annual). Excellent: <1% monthly (<12% annual). Varies by segment: SMB higher (3-5% monthly), enterprise lower (0.5-1% monthly). Track by cohort: Customers from month 1 cohort, month 2, etc. Pattern: Should show 10% early churn (month 1), then stable 1-2% (months 2+)."
      },
      {
        q: "How do I identify why customers are churning?",
        a: "Methods: (1) Exit surveys (why leave?), (2) Exit interviews (sales calls), (3) Support data (complaints/frustrations), (4) Usage data (low adoption predicts churn), (5) NPS feedback. Usually top 3 reasons = 80% of churn. Example: Price 30%, missing features 25%, didn't get value 20%, competitor 15%, other 10%. Fix top 3 = reduce churn 20-30%."
      },
      {
        q: "What's the economic impact of reducing churn?",
        a: "Reduce churn 2% to 1.5% = 0.5% of base retained. For £10M ARR: 0.5% × £10K LTV = £50K value created. Investment: CS intervention cost £200 per customer. If save 250 customers, invest £50K, save £2.5M LTV = 50x ROI. Churn reduction is high-ROI (easier than new customer acquisition)."
      },
      {
        q: "What's the best retention strategy?",
        a: "Three-pronged: (1) Reduce early churn (improve onboarding, day 1-7 critical). (2) Maintain engagement (QBRs, check-ins, feature announcements). (3) Expand existing (upsell engaged customers, CAC £500 vs new customer £1K+). Track: Health score (usage, engagement, NPS) → at-risk flag (intervention) → win-back. Result: Stable 1-2% monthly churn + 10-20% expansion = profitable growth."
      }
    ],
    videoUrl: ""
  }
];

export default batch196Articles;
