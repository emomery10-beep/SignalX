import { AcademyArticle } from "@/types/academy";

export const batch183Articles: AcademyArticle[] = [
  {
    slug: "customer-success-metrics-and-program-design",
    title: "Customer Success Metrics and Program Design: Building Retention Engine",
    description: "Master customer success. Design CS programs, measure success, and build retention.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer success",
      "CS metrics",
      "retention",
      "customer satisfaction",
      "NPS",
      "CS programs",
      "customer health",
      "success metrics",
      "customer outcomes",
      "retention programs"
    ],
    keyTakeaways: [
      "CS metrics: NPS (Net Promoter Score, target >50), CSAT (Customer Satisfaction, target >85%), Churn (target <2% monthly), Health score (predictor of churn/expansion). Example: Customer using 80%+ features, high login frequency, engaged with CS team = high health score (likely to stay and expand). Customer unused, no login, unresponsive = low health score (churn risk, needs intervention).",
      "CS program design: Tier by customer value. SMB: Self-service + group training. Mid-market: Dedicated CS, quarterly reviews. Enterprise: Dedicated CSM, monthly business reviews. Cost: SMB £0, mid £500/month, enterprise £2K/month per customer. ROI: Mid-market churn 3% → 1.5% (save 1.5 customers × £2K LTV = £3K value, cost £500, ROI 6x).",
      "CS playbook: Onboarding (first 30 days critical, reduce early churn), regular check-ins (quarterly, measure health), expansion (upsells when customer expanding), renewal (60 days before, prepare for renewal). Measure: Time to first value (days until customer gets value), adoption rate (% using features), NPS by cohort (is CS improving satisfaction?), churn rate (ultimate metric)."
    ],
    content: [
      {
        heading: "CS Metrics and Health Scoring",
        body: `Measuring customer success and predicting churn.

**Core CS Metrics**

NPS (Net Promoter Score):
- Survey: "How likely to recommend on 1-10?"
- 9-10: Promoters, 7-8: Passives, 0-6: Detractors
- NPS = (Promoters% - Detractors%)
- Target: >50 (excellent), >40 (good), <0 (bad)

CSAT (Customer Satisfaction):
- Survey: "How satisfied 1-5?"
- CSAT = % responding 4-5
- Target: >85%

CES (Customer Effort Score):
- Survey: "How easy 1-5?"
- CES = % responding 4-5
- Target: >80%

Churn rate:
- % customers lost monthly
- Target: <2% (healthy)

**Customer Health Score**

Composite metric predicting churn/expansion.

Factors:
- Usage (feature adoption %, login frequency)
- Engagement (support tickets, training attendance)
- Business metrics (revenue growth, expansion)
- Sentiment (NPS, CSAT, support sentiment)

Scoring:
- 80-100: High (likely to expand, very happy)
- 60-80: Medium (stable, monitor)
- 40-60: At-risk (churn potential, intervention needed)
- 0-40: Critical (high churn risk, urgent action)

Example:
- Customer using 90% of features, monthly NPS 9, expansion 20% = High (100)
- Customer using 40% features, NPS 5, no expansion = At-risk (50)

Action:
- High: Expansion conversation (upsell)
- Medium: Quarterly check-in (maintain)
- At-risk: Health intervention (improve engagement)
- Critical: Executive outreach (save relationship)

`
      },
      {
        heading: "CS Program Design by Segment",
        body: `Structuring success programs for different customer tiers.

**SMB Tier (£50-200/month)**

Program:
- Onboarding: Self-serve + email (automated)
- Training: Group webinars (recorded)
- Support: Email (24-48hr response)
- Check-ins: None (except at renewal)

Tools:
- Knowledge base (reduce support)
- In-app tooltips (improve onboarding)
- Email nurture (training, tips)
- Chatbot (support deflection)

Cost: £2-5K setup, £0/customer ongoing
Churn: Expect 3-5% (high, SMB churn baseline)
Expansion: Low (SMB rarely expand)

**Mid-Market Tier (£500-2K/month)**

Program:
- Onboarding: Dedicated CSM support
- Training: In-person or live session
- Support: Chat + email (4hr response)
- Check-ins: Quarterly business reviews

Tools:
- CRM (track interactions)
- Health scoring (predict churn)
- Playbooks (standardized approach)
- Analytics (show customer ROI)

Cost: £500/month per customer (CSM salary + tools)
Churn: 2-3% (better than SMB with CS)
Expansion: 10-20% (mid-market more likely to expand)

ROI: Save 1% churn × £2K LTV = £20K value, cost £500/month = 40x ROI

**Enterprise Tier (£5K+/month)**

Program:
- Onboarding: Dedicated implementation team
- Training: Custom training program
- Support: Phone + email (1hr response)
- Check-ins: Monthly business reviews

Tools:
- Everything (all tools deployed)
- Executive sponsor (C-level relationship)
- Quarterly strategy session
- Expansion playbook

Cost: £2K/month per customer (CSM, support, tools)
Churn: <1% (enterprise very sticky with right CS)
Expansion: 20-40% (expand significantly year-over-year)

ROI: Save 1% churn × £20K LTV = £200K value, cost £2K/month = 100x ROI

`
      },
      {
        heading: "CS Playbook and Execution",
        body: `Building repeatable CS processes.

**Onboarding Playbook**

Day 0-1 (Welcome):
- Send welcome email
- Schedule kickoff call
- Provide training resources

Day 1-7 (Setup):
- Help customer set up
- Quick training session
- Answer initial questions
- Goal: First value in week 1

Day 7-30 (Adoption):
- Weekly check-ins
- Monitor feature usage
- Recommend best practices
- Goal: Customer using key features

Day 30+ (Optimization):
- Monthly check-in
- Identify expansion opportunities
- Plan next features
- Goal: Happy customer, sticky

Metrics:
- Time to first value (days)
- % completing setup
- Feature adoption (% using key features)
- Month 1 NPS

**Health Check Cadence**

Monthly health scoring:
- Auto-calculate health score
- Alert CSM if score drops
- CSM reviews, takes action

Quarterly business reviews:
- Meet with customer
- Review progress, ROI
- Discuss future needs
- Introduce next features

Renewal preparation:
- 90 days before renewal
- Showcase ROI/value
- Prepare renewal proposal
- Lock in early (discount for early renewal)

**Expansion Playbook**

Trigger: Customer expanding usage (new department signing up, increased volume)

Action:
1. Congratulate on expansion
2. Schedule expansion conversation
3. Identify unmet needs
4. Propose expanded plan
5. Close deal

Example:
- Customer started with 5 users (Marketing only)
- Now Sales using (5 more users)
- Expansion opportunity: Upsell to higher tier (supports unlimited users)
- Revenue: £200/month → £500/month (+£300)

`
      }
    ],
    relatedSlugs: [
      "churn-analysis-retention-improvement",
      "expansion-revenue-and-upsell-strategy",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "scaling-customer-support-operations"
    ],
    faq: [
      {
        q: "What CS metrics should I track?",
        a: "Top 4: (1) NPS (target >50), (2) CSAT (target >85%), (3) Churn (target <2%), (4) Health score (predict churn/expansion). Track by cohort and customer segment. NPS improves = CS working. Churn increasing = CS failing."
      },
      {
        q: "What's a customer health score?",
        a: "Composite metric predicting churn (low) or expansion (high). Factors: Usage, engagement, business metrics, sentiment. Scale 0-100. High (80+) = expand conversation, Medium (60-80) = maintain, At-risk (40-60) = intervention, Critical (<40) = executive outreach. Auto-calculate, alert CSM to action."
      },
      {
        q: "How much should I spend on CS by segment?",
        a: "SMB: £0/customer (self-serve). Mid-market: £500/month (dedicated CSM). Enterprise: £2K/month. ROI: Mid-market save 1% churn = 40x ROI. Enterprise = 100x ROI. Spend more on high-value customers, less on low-value."
      },
      {
        q: "What should my onboarding program include?",
        a: "Day 1-7: Welcome, setup, first training. Day 7-30: Weekly check-ins, feature adoption, best practices. Day 30+: Monthly reviews, optimization, expansion. Goal: Time to first value <7 days. Feature adoption >80% by month 1. Month 1 NPS >40. If missing, customers churn early."
      }
    ],
    videoUrl: ""
  }
];

export default batch183Articles;
