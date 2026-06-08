import { AcademyArticle } from "@/types/academy";

export const batch338Articles: AcademyArticle[] = [
  {
    slug: "customer-success-metrics-and-program-design",
    title: "Customer Success Metrics and Program Design: Building Retention Programs",
    description: "Master CS programs. Design metrics, build teams, drive retention.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer success", "CS metrics", "customer retention", "CS program", "customer health"],
    keyTakeaways: [
      "CS program purpose: Ensure customers achieve desired outcome (ROI). Traditional support: Answer questions. CS: Proactive (make customer successful). Example: Customer buys to save £100K/year labor. CS job: Make sure they actually save it (usage, training, engagement). Cost: CS team £50-200K/person/year. ROI: Each 1% churn reduction = 5+ month lifetime extension (huge value).",
      "CS metrics: (1) NPS (net promoter score, loyalty indicator), (2) CSAT (satisfaction with support), (3) Health score (product usage + engagement, predicts churn), (4) Time-to-value (how long until customer sees ROI?), (5) Churn/Retention rate. Lead metric: Health score (predicts churn). Lag metric: NPS/churn (measure satisfaction after fact). Combine both.",
      "CS program structure: Tier by customer value (high-touch for enterprise, low-touch for SMB). High-touch: Quarterly business review, dedicated CS manager, training. Low-touch: Self-serve, email drip campaigns, chatbot. Expected: 3 CS tiers (based on ARPU or customer size). Cost: Scales with revenue (1 CS manager per £500K-1M ARR of customer base)."
    ],
    content: [
      {
        heading: "Designing and Implementing Customer Success Programs",
        body: `Building retention through proactive customer engagement.

**Customer success fundamentals**

Definition:
- Proactive approach to ensuring customers achieve desired outcome
- Difference from support: Support answers questions, CS ensures success
- Accountability: CS team owns churn/retention metric

CS vs support (comparison):

| Dimension | Support | CS |
|---|---|---|
| Trigger | Customer problem | Proactive outreach |
| Timing | Reactive | Preventive |
| Goal | Answer question | Ensure ROI |
| Success metric | Response time | Customer success |
| Team size | Grows with customers | Based on value |

Why CS matters:

Economic argument:
- Cost to acquire customer (CAC): £1,200
- Value from customer (LTV): £2,000
- Margin: £800
- Time to payback: 14 months
- Lose customer at month 10: Only recover £700 (not profitable)
- Retain customer 3 years: Recover £2,800 (profitable)

CS role:
- Shorten time to value (make customer successful faster)
- Improve retention (keep customers longer)
- Increase NRR (expand revenue from existing)

Result: 3-5% improved retention = 15-25% LTV improvement

**CS program structure**

Tier 1: Enterprise (£500K+ annual value)

Service level:
- Dedicated CS manager (1 per 5-10 customers)
- Quarterly business reviews (QBR)
- Executive sponsor (customer's direct line to company)
- Training and onboarding support (weeks)
- Monthly check-in calls

Cost: £50K/person/year CS manager, supports ~£5M customer base = £0.01 cost per £1 revenue (1% of revenue for CS)

Example: 10 enterprise customers at £500K each = £5M revenue, need 2 full CS managers = £100K cost

Tier 2: Mid-market (£50K-500K annual value)

Service level:
- Shared CS manager (1 per 20-30 customers)
- Quarterly check-ins (email-based or occasional call)
- Group training (webinars)
- Self-serve onboarding (product-led)
- Email campaigns (educational)

Cost: £50K/person supports ~£1.5M customer base, lower cost per dollar

Example: 100 mid-market customers at £150K each = £15M revenue, need 10 CS managers = £500K cost (3% of revenue)

Tier 3: SMB/self-serve (£5K-50K annual value)

Service level:
- Self-serve onboarding (product itself teaches)
- Automated email campaigns (drip sequences)
- Knowledge base + chatbot support
- Community (peer support)
- Minimal direct contact

Cost: Mostly automation, £20-50K software + team, serves thousands = <0.5% of revenue

Example: 1,000 SMB customers at £20K each = £20M revenue, £50K automation cost = 0.25% of revenue

**CS metrics and health scoring**

Lead metric: Health score

Definition:
- Predictive indicator of customer health
- Combines: Product usage, engagement, support sentiment
- Predicts: Churn risk (early warning)

Health score formula:

| Component | Weight | Calculation | Status |
|---|---|---|---|
| Active users | 25% | (Active users / licensed users) | 80% |
| Feature adoption | 25% | (Features used / available) | 60% |
| Engagement | 25% | (Days active last 30 / 30) | 70% |
| Support sentiment | 25% | (Positive sentiments) | 90% |
| **Health score** | | | **75%** |

Interpretation:
- 80%+: Healthy (at risk low)
- 60-80%: At risk (monitor, intervene)
- <60%: Critical (high churn risk, urgent action)

Actions by health score:

Healthy (80%+):
- Quarterly check-in (maintain relationship)
- Upsell opportunity (they're successful, can upgrade)
- Feedback (understand what's working)

At risk (60-80%):
- Monthly check-in (increase touchpoints)
- Understand blockers (why usage declining?)
- Training (improve feature adoption)
- Offer support (help them succeed)

Critical (<60%):
- Weekly check-in (intensive support)
- Product support (bugs? Missing features?)
- Executive call (escalate, show we care)
- Offer discount (retention discount vs churn)

Lag metric: NPS

Definition:
- Net promoter score (loyalty indicator)
- Question: "How likely recommend to colleague?" (0-10)
- NPS = % promoters (9-10) - % detractors (0-6)

Benchmark: SaaS typical 30-40, excellent >40

Action: Interview detractors (why unhappy?), address issues

Churn/Retention rate

Definition:
- % customers retained (opposite of churn)
- Retention rate = 1 - churn rate
- Example: 5% monthly churn = 95% retention

Target: 95%+ monthly (5% churn) acceptable, 97%+ (3% churn) good, 99%+ (1% churn) excellent

**Onboarding and time-to-value**

Goal: Get customer to "aha moment" (value) quickly

Time-to-value definition:
- Days from activation to customer achieving first tangible value
- Example: Software saves 10 hours/week, achieve value when using 8+ hours/week
- Typical: 14-30 days for good SaaS

Onboarding flow:

Day 0: Activation
- Customer logs in
- Automated welcome email
- Product intro (in-app)
- Assign CS manager (if tier 1/2)

Day 1-3: Basics
- Email: "Getting started guide"
- In-app: Checklist of key setup tasks
- Call: 15-min kickoff call (if high-touch tier)

Day 4-7: Core value
- Training: How to accomplish primary job
- Example: SaaS for analytics, train on dashboard creation
- Support: Answer setup questions

Day 8-14: Second value
- Advanced features
- More sophisticated use cases
- Check-in: Are they getting value?

Day 15-30: Optimization
- Best practices
- Upsell opportunities (additional users, advanced tier)
- Feedback: "How's it going?"

Success: Customer seeing meaningful value (reduced hours, increased revenue, better decisions) by day 30

**QBR (Quarterly business review) process**

Preparation (1 week before):
- Gather customer data
  - Product usage metrics
  - ROI analysis (are they getting value?)
  - Support interactions (any issues?)
  - Expansion opportunities (upsells, new features)
- Build presentation
  - Recap Q (what we delivered)
  - Usage analysis (how you're using product)
  - ROI calculation (value achieved)
  - Q outlook (what's coming next)

During QBR (60 minutes):
- Attendees: Customer (exec + users), CS manager, account executive
- Agenda:
  - Q review (product updates, feature rollout)
  - Usage analysis (dashboard walkthrough)
  - ROI validation (are they achieving goals?)
  - Feedback (what's working, what's not)
  - Q outlook (exciting things coming)
  - Expansion (opportunity for higher tier, more users)

Outcome:
- Customer satisfied (validated value)
- Relationship strengthened (direct contact with company)
- Growth opportunity identified (upsell/expansion)
- Action items (product improvements, training)

Expected outcomes:
- NPS improvement (customer feels valued)
- Churn reduction (proactive engagement prevents churn)
- Expansion rate (20-30% of QBR customers upgrade/expand)

**CS team building**

Hiring:

Tier 1/2 (high-touch, consultative):
- Title: Customer Success Manager, Account Manager
- Skill: Consultative, deep product knowledge, business acumen
- Salary: £40-60K (varies by region)
- Ratio: 1 per £1-5M customer revenue

Tier 3 (low-touch, efficient):
- Title: CS Specialist, Support, Operations
- Skill: Process, automation, efficiency
- Salary: £25-40K
- Ratio: 1 per £5-10M customer revenue

Total team size at scale:

| Revenue | Customers | Tier 1/2 team | Tier 3 team | Total CS |
|---|---|---|---|---|
| £5M | 50 enterprises | 5 managers | 1 support | 6 |
| £20M | 200 mid-market | 15 managers | 2 support | 17 |
| £50M | 1000+ mixed | 30 managers | 5 support | 35 |
| £100M | 5000+ mixed | 50 managers | 10 support | 60 |

Cost as % of revenue:
- Early (pre-£5M): 5-8% of revenue (building team)
- Growth (£5-50M): 3-5% of revenue (operational leverage)
- Mature (£50M+): 2-3% of revenue (highly efficient)

**CS program ROI**

Example calculation:

Scenario: £10M revenue SaaS company, 80 customers

Current state:
- Monthly churn: 5% (poor)
- LTV: £1,500
- CS investment: £0 (no team)
- Annual revenue loss to churn: 5% × 12 × £10M = £6M revenue lost

Implement CS program:
- Cost: 4 CS managers, 1 support = 5 people × £45K = £225K
- Targeted reduction: Improve churn 5% → 3% (2% improvement)
- Revenue saved: 2% × 12 × £10M = £2.4M (annual impact)
- Additional expansion from CS: NRR improvement 1% = £100K additional revenue
- Total benefit: £2.4M + £100K = £2.5M
- CS cost: £225K
- ROI: (£2.5M - £225K) / £225K = 1,011% ROI (11:1 return)

Payback period: 1 month (£225K cost, £2.5M annual benefit, payback in 1 month)

**Common CS mistakes**

Mistake 1: No CS (pure support only)
- Problem: Reactive (answer questions), not proactive (ensure success)
- Result: High churn (customers not successful)
- Fix: Hire CS team, build program
- Impact: 2-3% churn reduction potential

Mistake 2: High-touch for all customers
- Problem: CS expensive, can't scale profitably
- Fix: Tiered approach (high-touch enterprise, low-touch SMB)
- Impact: Profitable CS operations

Mistake 3: No health scoring
- Problem: Don't know which customers are at risk
- Fix: Build health score, intervene early
- Impact: Catch churn before it happens

Mistake 4: No product data
- Problem: CS team doesn't have usage data
- Fix: Integrate product data into CS tools
- Impact: Informed conversations, better interventions

`
      }
    ],
    relatedSlugs: ["retention-and-churn-reduction-mechanics", "customer-lifetime-value-optimization", "metrics-dashboard-design-kpi-tracking", "net-promoter-score-and-customer-satisfaction", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "What is a CS program and why does it matter?", a: "CS (Customer Success) = proactive program ensuring customers achieve desired outcome. Difference from support: Support is reactive (answer questions), CS is proactive (ensure ROI). ROI: Each 1% churn reduction = 5-10 month lifetime extension = huge value. Cost: 2-5% of revenue for CS team. Payback: Usually <1 month (£2M churn saved vs £200K CS cost)." },
      { q: "What CS metrics should I track?", a: "Lead metrics (predict future): Health score (product usage + engagement, predicts churn), Time-to-value (days to customer seeing ROI). Lag metrics (measure past): NPS (loyalty), Churn/Retention (result). Dashboard: Health score by customer, NPS trend, churn rate by segment. Actions: Health <60% = urgent intervention, 60-80% = monthly check-in, 80%+ = maintain." },
      { q: "How do I structure a CS program?", a: "Tiered approach by customer value: (1) Enterprise (£500K+): Dedicated CS manager, quarterly reviews, training. (2) Mid-market (£50K-500K): Shared CS manager, email + quarterly. (3) SMB (£5K-50K): Self-serve, automation, community. Cost: Enterprise 1% of revenue, SMB 0.25%. Expected: 2-3% churn improvement, 20% expansion rate (high ROI)." }
    ],
    videoUrl: ""
  }
];

export default batch338Articles;
