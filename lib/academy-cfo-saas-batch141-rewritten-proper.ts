import { AcademyArticle } from "@/types/academy";

export const batch141Articles: AcademyArticle[] = [
  {
    slug: "customer-success-metrics-and-program-design",
    title: "Customer Success Metrics and Program Design: Building a Retention Machine",
    description: "Master customer success. Design CS programs, measure health, reduce churn, and drive expansion revenue from existing customers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer success",
      "CS metrics",
      "health scores",
      "customer health",
      "retention strategy",
      "churn reduction",
      "customer advocacy",
      "program design",
      "NPS",
      "CSAT"
    ],
    keyTakeaways: [
      "CS team impact: £1M company, 2% monthly churn = £20K MRR lost/month. With CS program, reduce to 1.5% = save £5K/month = £60K/year. CS cost £50K/year (1 CSM), ROI 1.2x year 1. But LTV improves 15-20% long-term (customers stay longer) = compounding value. CS team not cost center, revenue generator.",
      "Customer health score: (Product usage % × 0.4) + (Support ticket ratio × 0.2) + (NPS score × 0.3) + (Renewal date × 0.1). Red flags: Score <50 (at-risk), trending down, usage declining. Proactive approach: High score = upsell, low score = engagement. Examples: Score >75 (expand), 50-75 (monitor), <50 (save).",
      "CS program maturity: Stage 1 (reactive): Support only, respond to issues. Stage 2 (proactive): Check-ins, onboarding, prevent issues. Stage 3 (strategic): Expansion focus, QBRs, business reviews, strategic accounts. Budget: Stage 1 = £30K/CSM. Stage 2 = £50K/CSM. Stage 3 = £80K+ (includes tools, training). Move from reactive → proactive when churn >2%, expansion opportunity >5%."
    ],
    content: [
      {
        heading: "Customer Success Program Foundations",
        body: `Design a program that keeps customers happy and reduces churn.

**Why CS Matters (Economics)**

Scenario: 1000 customers, £100/customer/month, 2% monthly churn

Without CS program:
- Monthly churn: 20 customers (£2K MRR lost)
- Annual revenue: £1.2M (accounting for replacement new customers)
- Churn cost: £24K annually in lost revenue

With CS program (reduce churn to 1.5%):
- Monthly churn: 15 customers (£1.5K MRR lost)
- Annual revenue: £1.35M (+£150K)
- Net benefit: £150K - £60K (CS program cost) = £90K
- ROI: 150% year 1

Impact: CS program pays for itself 2.5x over.

Plus: Better customer lifetime, more likely to expand (NRR improves 5-10%).

**CS Program Components**

1. Onboarding (weeks 1-4)
   - Goal: Customer achieves first value quickly
   - Activities: Training, setup, integration, goal-setting
   - Metric: % customers achieving "aha moment" by week 4 (target >85%)

2. Quarterly Business Reviews (QBRs, ongoing)
   - Goal: Strategic alignment, growth planning
   - Activities: Review usage, goals, ROI, roadmap feedback
   - Frequency: Annual for SMB, Quarterly for mid-market, Monthly for enterprise
   - Metric: QBR attendance rate (target >80%)

3. Health monitoring (ongoing)
   - Goal: Early churn detection
   - Activities: Health score tracking, risk flagging, proactive outreach
   - Metric: % customers with healthy score >70 (target >75%)

4. Expansion initiatives (ongoing)
   - Goal: Revenue growth from existing
   - Activities: Identify use cases, offer upgrades, feature education
   - Metric: % customers expanding annually (target 3-5% monthly)

5. Community/advocacy (ongoing)
   - Goal: Customer retention via engagement
   - Activities: User groups, case studies, referral program
   - Metric: NPS score, case studies completed, referrals generated

**Organizing CS by Customer Segment**

Model 1 (Tech-touch / Self-serve):
- Best for: SMB, price-sensitive
- Approach: In-app guidance, email campaigns, knowledge base, self-service onboarding
- Cost: £5-10/customer/month
- Suitable for: £10-50/month customer

Model 2 (High-touch):
- Best for: Enterprise, complex implementations
- Approach: Dedicated CSM, regular calls, custom training, proactive support
- Cost: £200-500/customer/month (fully loaded CSM cost / number of accounts)
- Suitable for: £1000+/month customer

Model 3 (Hybrid):
- Best for: Mid-market
- Approach: CSM assigned to cohorts (10-20 customers), quarterly check-ins, in-app tools
- Cost: £50-100/customer/month
- Suitable for: £100-1000/month customer

**Segment Decision Matrix**

| Segment | Count | ACV | Churn Risk | Model | CSM:Customer Ratio |
|---------|-------|-----|-----------|-------|------------------|
| SMB (< £100/mo) | 700 | £30 | High | Tech-touch | 1:500 |
| Mid-market (£100-1K) | 250 | £500 | Medium | Hybrid | 1:15 |
| Enterprise (> £1K) | 50 | £5K | Low | High-touch | 1:5 |

Cost analysis:
- SMB: 1 CSM managing via automation = £40K/year for 350 customers = £114/customer
- Mid-market: 20 CSMs for 250 customers = £1M/year = £4K/customer
- Enterprise: 10 CSMs for 50 customers = £500K/year = £10K/customer

Check: Enterprise ACV £5K, CS cost £10K = pay back in first month, then profit. Worth it.

**CS Onboarding Program Design**

Week 1: Kickoff
- Day 1: Welcome call, goals setting
- Days 2-5: Setup support, environment preparation
- Metric: 100% onboarding completion

Week 2: Value realization
- Day 1-3: Feature training
- Day 4-5: Integration (connect to customer's systems)
- Metric: % complete integration

Week 3: Productivity
- Day 1-5: Power-user training, best practices
- Metric: Product usage >50% of available features

Week 4: Optimization
- Day 1-5: Performance review, optimization, roadmap alignment
- Metric: Aha moment achieved (customer sees ROI)

Success metric: >85% customers reach "aha moment" by week 4 (using core feature for business value).

Failure: <60% at aha moment = churn risk increases 50%.

`
      },
      {
        heading: "Health Scoring and Risk Management",
        body: `Predict which customers will churn before it happens.

**Building a Health Score**

Components of health:

1. Product usage (40% weight)
   - Monthly active users as % of company size
   - Feature breadth (# different features used)
   - Engagement trend (increasing, flat, declining?)

   Score: (% Active users + % Features used) / 2
   Examples:
   - 80% users, 70% features = 75 score
   - 30% users, 20% features = 25 score

2. Support engagement (20% weight)
   - Support ticket count per month
   - Self-service vs support ratio (higher self-service = better)
   - Resolution satisfaction (% resolved on first contact)

   Score: (100 - (tickets/month / avg)) × resolution_quality
   Examples:
   - 2 tickets/month, 80% resolution = 80 score
   - 15 tickets/month, 40% resolution = 20 score

3. NPS/Satisfaction (30% weight)
   - NPS survey quarterly
   - Feature request sentiment (more = engaged)
   - Support satisfaction score

   Score: NPS/10 (ranges 0-10)
   Examples:
   - NPS 50 = 5 score
   - NPS 70 = 7 score
   - NPS -10 = -1 score

4. Business metrics (10% weight)
   - Expansion likelihood (growing company size)
   - Commitment (annual vs monthly terms)
   - Contract age (newer = at-risk, older = stable)

   Score: (company_growth + tenure_factor + contract_type) / 3
   Examples:
   - Growing company, 2-year contract, 18 months in = 8 score
   - Declining company, monthly, 3 months in = 3 score

**Combined Health Score**

Health = (Usage × 0.4) + (Support × 0.2) + (NPS × 0.3) + (Business × 0.1)

Example customer:
- Usage: 75 (good engagement)
- Support: 80 (efficient, satisfied)
- NPS: 7 (promoter)
- Business: 8 (growing, annual contract)
- Health: (75 × 0.4) + (80 × 0.2) + (7 × 0.3) + (8 × 0.1) = 30 + 16 + 2.1 + 0.8 = 48.9

Interpretation: 48.9 is mid-range (at-risk). Monitor closely, action needed.

**Health Score Segmentation**

Green (75+): Healthy, expansion ready
- Action: Upsell, QBR for future planning
- Monitor: Quarterly
- Expansion target: 30-50% of green customers

Yellow (50-74): At-risk, needs attention
- Action: Engagement campaign, proactive check-in
- Monitor: Monthly
- Goal: Move to green within 60 days

Red (<50): Churn risk, save immediately
- Action: Executive check-in, problem resolution, discounts
- Monitor: Weekly
- Goal: Move to yellow within 30 days

**Predictive Churn Analysis**

Track health score trends over time:

Customer A: 85 → 82 → 80 → 75 (declining, but gradual, monitor)
Customer B: 80 → 75 → 40 → 20 (steep drop, intervention needed immediately)
Customer C: 40 → 45 → 50 → 55 (recovering from red, good sign)

Alert conditions:
- Drop >20 points in 1 month (usually indicates customer issue, reach out within 24 hours)
- <50 for 2+ months (churn probability >60%, escalate)
- Trend declining for 3+ months (on path to churn)

**Dashboard Visualization**

Health score dashboard shows:

By segment:
- % Green, Yellow, Red per segment (target: >75% green)
- Average health trend (improving, stable, declining)
- Churn risk customers (list of red customers for action)

By cohort:
- Health by acquisition cohort (newer cohorts health trend?)
- Health by product tier (Pro customers healthier than Starter?)

Metric: Monitor monthly, track improvements quarter-over-quarter.

`
      },
      {
        heading: "CS Metrics and Program Optimization",
        body: `Track CS program effectiveness and improve continuously.

**Core CS Metrics**

1. Churn rate (most important)
   - Measure: % customers lost per month
   - Target: <2% for healthy SaaS
   - Relationship: 1% improvement in churn = 15%+ LTV improvement
   - Monitor: Weekly by cohort, monthly aggregate

2. Health score (leading indicator)
   - Measure: % customers with health >70
   - Target: >75%
   - Leading: Correlates 0.7+ to churn (lower health = higher churn)
   - Monitor: Weekly, early warning

3. NPS (customer satisfaction)
   - Measure: Net Promoter Score
   - Target: 50+ (healthy), 70+ (excellent)
   - Calculation: % Promoters (9-10) - % Detractors (0-6)
   - Monitor: Quarterly surveys

4. Expansion rate (revenue growth)
   - Measure: % customers expanding annually
   - Target: 3-5% monthly, 30-50% annually
   - Linked: Health score >75 predicts higher expansion rate
   - Monitor: Monthly

5. Onboarding completion (efficiency)
   - Measure: % customers reaching aha moment by week 4
   - Target: >85%
   - Linked: Better onboarding = lower M1 churn
   - Monitor: Cohort-based, monthly

6. QBR attendance (engagement)
   - Measure: % customers attending QBRs
   - Target: >80% for assigned accounts
   - Linked: Higher QBR attendance = lower churn
   - Monitor: Quarterly

**Benchmarking CS Performance**

| Metric | Poor | Okay | Good | Excellent |
|--------|------|------|------|-----------|
| Churn | >4% | 2-4% | 1.5-2% | <1.5% |
| Health >70 | <50% | 50-65% | 65-75% | >75% |
| NPS | <20 | 20-40 | 40-60 | >60 |
| Expansion rate | <2%/mo | 2-3% | 3-5% | >5% |
| Onboarding success | <70% | 70-80% | 80-90% | >90% |

Track company progress against benchmarks. Healthy SaaS: All metrics in "Good" or "Excellent" range.

**CS Program ROI Calculation**

Year 1 investment: £60K (1 FTE CSM + tools)

Benefits:
- Churn reduction: £2% → £1.5% = £5K MRR saved × 12 = £60K
- Expansion: Additional 1% growth = £2K MRR × 12 = £24K
- Retention: Reduces CAC payback (customers stay longer)
- Total: £84K benefit

Year 1 ROI: (£84K - £60K) / £60K = 40% (breakeven + 40%)

Year 2+ (continued):
- Churn stays at 1.5% (maintained)
- Expansion grows to 5% (program improved)
- Additional benefit: £100K
- ROI: 167%

Multi-year value: CS program pays 2-4x cost over first 3 years.

**Optimizing CS Efficiency**

Scale problem: As customer base grows, CS cost grows faster than revenue.

Solution: Tiered model
- Tech-touch (automation): £10K tools, supports 1000 customers = £10/customer
- Hybrid (1 CSM per 20): £50K salary supports 20 customers = £2.5K/customer
- High-touch (1:5): £50K salary supports 5 customers = £10K/customer

Mixed: 800 tech-touch (£10/customer) + 150 hybrid (£2.5K/customer) + 50 high-touch (£10K/customer)
- Cost: £800K + £375K + £500K = £1.675M for 1000 customers
- Per customer: £1.675K

But revenue:
- Tech-touch: £100 ACV × 800 = £80K MRR
- Hybrid: £500 ACV × 150 = £75K MRR
- High-touch: £5K ACV × 50 = £250K MRR
- Total: £405K MRR = £4.86M ARR

CS cost as % of revenue: £1.675M / £4.86M = 34% (healthy, <40%)

`
      },
      {
        heading: "Scaling CS as Company Grows",
        body: `How to grow CS program without losing quality.

**Stage 1: Founder-Led CS (0-50 customers)**

Founder/CEO handles all CS.
- Advantages: Direct customer relationships, fast feedback, personal touch
- Activities: Onboarding calls, check-ins, issue resolution
- Time: 20-30 hours/week on CS work
- Churn: Typically 0-2% (high attention)

When to hire: 30+ customers, CEO spending >50% time on CS.

**Stage 2: First CSM Hire (50-300 customers)**

Hire first dedicated CSM.
- Responsibilities: Onboarding, QBRs, churn prevention, upsells
- Model: Hybrid (per-company segments), some tech-touch
- Customers per CSM: 100-200
- Churn: Stabilizes around 2-3%

Support process:
- Tiers 1-2 (basic) handled by CSM
- Tier 3 (technical) escalated to engineering

When to hire second CSM: 200+ customers, churn trending up, expansion lagging.

**Stage 3: CS Team (300-1000 customers)**

Expand to 3-5 CSMs + CS manager.
- Specialization: By segment (SMB, mid-market, enterprise)
- Tool investment: Salesforce/HubSpot, health score automation
- Process formalization: QBR playbooks, onboarding templates
- Churn: Improves to 1.5-2%

Structure:
- 1 CS Manager (oversees program, metrics, strategy)
- 2-3 CSMs handling mid/enterprise accounts
- 1 onboarding specialist or automation
- 1 part-time operations person

When to formalize: 400+ customers, need structured program.

**Stage 4: Dedicated CS Department (1000+ customers)**

Full CS organization with specializations.
- Director of CS (reports to CEO/COO)
- Manager of onboarding (focuses on week 1-4)
- Manager of retention (focuses on churn, health)
- Manager of expansion (focuses on upsells)
- 8-12 CSMs (by segment/geography)
- Support/Operations team (admin, tooling)

Structure:
- Enterprise team (1:5 CSM:customer ratio)
- Mid-market team (1:15 CSM:customer ratio)
- SMB team (1:50 with automation)
- Onboarding/Expansion specialists

Churn: Can reach <1% with mature program.

**Hiring CS Team Members**

Attributes to look for:
- Customer empathy (genuinely cares about customer success)
- Problem-solving mindset (doesn't pass problems, solves them)
- Communication skills (clear, thoughtful, proactive)
- SaaS experience (understands metrics, business drivers)

Avoid:
- Pure support background (can become order-takers)
- No SaaS experience (lacks context for business reviews)
- Weak communication (customers won't engage)

Interview questions:
- "Tell me about a customer you helped succeed. How did you identify the need?"
- "Describe a customer who was at risk of churning. What did you do?"
- "How do you balance expansion conversations with customer needs?"

**Metrics by Stage**

| Stage | Customers | CSMs | Churn Target | Health Target | Expansion Target |
|-------|-----------|------|-------------|--------------|-----------------|
| Stage 1 | 0-50 | 0 | 2% | 80% | — |
| Stage 2 | 50-300 | 1 | 2.5% | 75% | 2%/mo |
| Stage 3 | 300-1000 | 3-5 | 2% | 77% | 3%/mo |
| Stage 4 | 1000+ | 8-12 | 1.5% | 80% | 5%/mo |

Progress: As scale increases, churn decreases (program improves), expansion increases (focus improves).

`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "customer-lifetime-value-calculation",
      "expansion-revenue-and-upsell-strategy",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "Do I need a CS team at my stage?",
        a: "Rule: When churn >2% or expansion <2%/month, CS investment pays off. Early (0-50 customers): Founder-led. 50-300 customers: Hire first CSM (ROI 40-100%). 300+ customers: Team needed (multiple CSMs, specialization). Test with one CSM first, measure impact on churn/expansion. If churn improves >0.5%, CS works for you."
      },
      {
        q: "What should I measure to track CS program effectiveness?",
        a: "Top 5: (1) Churn rate (% customers lost, target <2%), (2) Health score (% customers >70, target >75%), (3) NPS score (satisfaction), (4) Expansion rate (% expanding annually, target 3-5%/month), (5) Onboarding success (% reaching aha moment week 4, target >85%). Track monthly, benchmark against peers."
      },
      {
        q: "How do I calculate CS team ROI?",
        a: "Cost: CSM salary + tools + overhead = ~£50-80K/year per CSM. Benefit: Churn reduction (1% churn = £20K MRR saved on 1000-customer base = £240K/year), expansion revenue, retention. Example: £60K cost, £100K benefit = 67% ROI year 1. Usually breakeven year 1, 2-3x ROI year 2+."
      },
      {
        q: "How do I build a customer health score?",
        a: "Components: (1) Product usage (40%: % active users, feature breadth), (2) Support engagement (20%: support ticket efficiency), (3) NPS/satisfaction (30%: NPS score), (4) Business metrics (10%: growth, contract type). Combined score 0-100. Green >75, Yellow 50-75, Red <50. Monitor monthly, automate scoring with tools."
      }
    ],
    videoUrl: ""
  }
];

export default batch141Articles;
