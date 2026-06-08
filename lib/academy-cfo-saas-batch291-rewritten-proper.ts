import { AcademyArticle } from "@/types/academy";

export const batch291Articles: AcademyArticle[] = [
  {
    slug: "product-market-fit-assessment-and-validation",
    title: "Product-Market Fit Assessment and Validation: Know When You Have It",
    description: "Master product-market fit. Assess market readiness, validate demand, scale with confidence.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["product-market fit", "PMF", "market validation", "customer demand", "product fit", "growth trajectory"],
    keyTakeaways: [
      "PMF definition: When customers desperately want product, willing to pay, coming to you, engaged long-term. Signals: MRR 40%+ growth, 3%- or lower churn, NRR >110%, positive word-of-mouth (inbound leads), retention cohorts stable. Cost: Qualitative assessment + data analysis. Benefit: Confidence to scale (invest in growth, hire). Risk: Scaling without PMF = waste money, fail. Timeline: Usually 12-24 months post-launch.",
      "Validation methods: Quantitative - MRR growth rate (>30% monthly = strong PMF), churn cohorts (stable = good retention), NRR (>110% = expansion), qualitative - customer interviews (would you recommend?), feature requests (organic demand for features?), usage patterns (daily/weekly engagement?). Red flags: MRR stalling, churn 5%+, customers not renewing, slow feature adoption. Example: SaaS at 3-month PMF, 40% MRR growth, 2% churn, NRR 115% = PMF validated.",
      "Action by PMF stage: Pre-PMF (validate > grow, focus on customer feedback, iterate fast). PMF achieved (can scale, invest in sales/marketing, optimize unit economics). Beyond PMF (scale confidently, geographic expansion, adjacent markets). Cost: Varies (early = low spend, scaling = high spend). Benefit: PMF validated = fundraising easier, investor confidence, grow aggressively. Mistake: Scaling too early (waste) or staying in PMF validation too long (opportunity cost)."
    ],
    content: [
      {
        heading: "Assessing and Validating Product-Market Fit",
        body: `Knowing when you're ready to scale.

**What is product-market fit?**

Definition:
- Customers desperately want product
- Willing to pay (or highly engaged if free)
- Using regularly (daily/weekly engagement)
- Renewing (low churn)
- Expanding (upsell, NRR >100%)
- Referring others (word-of-mouth)

Indicators (quantitative):
- MRR growth: >30% monthly (strong signal)
- Churn rate: <3-5% monthly (retention)
- NRR: >110% (expansion revenue)
- CAC payback: <12 months (efficient acquisition)
- Engagement: Daily/weekly active users (not just signup)

Indicators (qualitative):
- Customers excited: Would pay more? Would switch if could?
- Organic growth: Inbound leads? Referrals?
- Usage patterns: Using core features? Daily?
- Support volume: Customer questions (engaged, not lost)?
- Switching resistance: Hard for customer to leave?

**Assessing current PMF stage**

Pre-PMF stage:
- Growth: MRR growing but erratic (some months up, some down)
- Churn: 5%+ monthly (losing customers regularly)
- NRR: <110% (or unknown, low engagement)
- Engagement: Some customers using, many inactive
- Feedback: Customers like some features, not core ones
- Issues: "Nice to have" rather than "must have"

Moving toward PMF:
- Growth: 20-30% MRR monthly (consistent)
- Churn: 3-5% monthly (improving)
- NRR: 100-110% (some expansion)
- Engagement: 30-50% weekly active users
- Feedback: Customers asking for more features
- Issues: Core use case clear, needs refinement

Achieved PMF:
- Growth: 30%+ MRR monthly (consistent)
- Churn: <3% monthly (stable cohorts)
- NRR: >110% (strong expansion)
- Engagement: 60%+ weekly active, 30%+ daily
- Feedback: Customers say would be lost without you
- Issues: Feature requests clear (prioritization problem)

**Validation framework**

Cohort analysis (retention):
- Cohort 1: Customers acquired month 1
  - Month 1: 100% (baseline)
  - Month 2: 95% (5% churn)
  - Month 3: 91% (4% additional churn)
  - Month 4: 88% (3% additional churn)
  - Trend: Flattening (good, stabilized)

- Cohort 2: Customers acquired month 3
  - Month 1: 100%
  - Month 2: 94% (better!)
  - Month 3: 91%
  - Trend: Better retention than earlier cohort

- Interpretation: If recent cohorts have better retention, product improving (PMF trajectory)

Engagement metrics:
- DAU/WAU ratio: % daily active of weekly active
  - Pre-PMF: 20-30% DAU/WAU (using weekly, not daily)
  - PMF: 40-60% DAU/WAU (daily engagement)
  - Strong PMF: 60%+ (habitual usage)

- Feature adoption: Core feature adoption in first week
  - Pre-PMF: 30-40% (many skip core)
  - PMF: 70-80% (most adopt core)

Customer interviews:
- Question: Would you describe this as essential to your work?
  - Pre-PMF: "It would help"
  - PMF: "I can't do my job without it"

- Question: If you couldn't use this, what would you do?
  - Pre-PMF: "Try alternatives"
  - PMF: "I don't know, I need this"

- Question: Who should we hire/fire?
  - Engaged: Excited to help, referrals
  - Disengaged: Non-responsive, no referrals

**PMF progression timeline**

Typical SaaS timeline:
- Month 0-6: Private alpha, core customer feedback
- Month 6-12: Public launch, PMF search (erratic growth)
- Month 12-18: PMF signals emerging (growth 20-30%)
- Month 18-24: PMF achieved (growth 30%+, churn stable, NRR >110%)
- Month 24+: Scale phase (invest heavily in growth)

Acceleration strategies:
- Narrow focus: Target specific use case (faster to PMF)
- Customer intimacy: Deeply understand customer needs
- Iterate fast: Weekly releases based on feedback
- Measure rigorously: Track metrics, don't guess
- Cost: Time and focus trade-off

Slower paths:
- Trying to be everything: PMF harder (takes longer)
- No customer feedback loop: Guessing (wrong direction)
- Infrequent iteration: Miss signals (slow course correction)
- Vanity metrics: Signups ≠ PMF (misleading)

**Scaling decisions based on PMF**

Pre-PMF (don't scale):
- Action: Focus on product, customer feedback
- Investment: Sales/marketing minimal
- Hiring: Limited (core team)
- Cost: Low (focused, lean)
- Risk: Scaling too early wastes money

PMF achieved (scale):
- Action: Invest in growth (sales, marketing)
- Investment: 30-50% of revenue into growth
- Hiring: Sales, marketing, customer success
- Cost: Higher (growth spending)
- Opportunity: Win market, establish leadership

Beyond PMF (expansion):
- Action: Geographic expansion, adjacent markets
- Investment: New market expansion projects
- Hiring: New vertical managers, localization
- Cost: High (new initiatives)
- ROI: Higher (proven model, replicate)

Example decision:
- Current state: 40% MRR growth, 2% churn, NRR 115%, stable retention cohorts
- Assessment: PMF achieved
- Decision: Scale aggressively
- Actions:
  - Hire VP Sales (£150K) + 3 AEs (£100K each)
  - Budget 40% revenue for marketing
  - Implement CRM, expand CS team
  - Build partner program
- Timeline: Next 12 months
- Expected outcome: 3-4x revenue growth

**Common PMF mistakes**

Claiming PMF too early:
- Risk: Hire too fast, overinvest (bad ROI)
- Fix: Validate with 6+ months data, multiple cohorts
- Wait for: Stable churn, clear retention patterns

Scaling before PMF:
- Risk: Burn cash, churn eats acquisition
- Example: £2K CAC, 5% churn (payback 40+ months = losing money)
- Fix: Optimize unit economics first, then scale

Missing PMF signals:
- Risk: Stay in product mode too long
- Example: Could scale at month 18, waiting until month 30 (miss market)
- Fix: Dashboard of PMF metrics (monitor monthly)

Wrong metrics for PMF:
- Vanity: Signups (not engagement)
- Misleading: Revenue (could be one whale, not repeatable)
- Right: Cohort retention, engagement, NRR

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "customer-success-metrics-and-program-design", "customer-acquisition-strategy-and-marketing-roi", "retention-and-churn-reduction-mechanics", "market-sizing-and-tam-analysis"],
    faq: [
      { q: "How do I know if I have product-market fit?", a: "Key signals: 30%+ MRR growth (consistent), <3% churn (stable), NRR >110% (expansion), 60%+ weekly active users (engagement), customers say product is essential. Track cohort retention (recent cohorts better = PMF improving). Interviews: Would you be lost without us? = PMF achieved." },
      { q: "What metrics prove product-market fit?", a: "Quantitative: MRR growth >30%, churn <3%, NRR >110%, retention cohorts stabilizing. Qualitative: Customer interviews (essential vs nice-to-have), organic growth (word-of-mouth), engagement patterns (daily usage). Combine metrics + feedback (data + anecdotes)." },
      { q: "When should I scale after PMF?", a: "After PMF validated (6+ months data, stable cohorts): Hire growth team, invest 30-50% revenue in sales/marketing. Before PMF: Stay lean, focus on product/customers. Too early = waste money. Too late = miss market. Benchmark: When retention cohorts plateau and NRR stabilizes." }
    ],
    videoUrl: ""
  }
];

export default batch291Articles;