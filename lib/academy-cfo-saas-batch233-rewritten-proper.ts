import { AcademyArticle } from "@/types/academy";

export const batch233Articles: AcademyArticle[] = [
  {
    slug: "customer-success-metrics-and-program-design",
    title: "Customer Success Metrics and Program Design: Building Retention",
    description: "Master customer success. Build CS program, measure outcomes, retain customers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer success", "CS metrics", "retention", "CS program", "customer onboarding", "health scoring", "expansion revenue"],
    keyTakeaways: [
      "CS fundamentals: CS team owns retention (opposite of sales = acquisition). KPI: Churn rate (target <2% monthly), NRR (target >120%). Program structure: By size (SMB self-serve, mid-market CSM-lite, enterprise dedicated CSM). CSM responsibilities: Onboarding, health tracking (proactive check-ins), expansion (identify upsell/cross-sell), at-risk recovery. Example: Health scoring (engagement + ROI realization + NPS) predicts churn. At-risk flagged weekly, CSM reaches out. Recovery: 30-50% of flagged at-risk saved (cost: CS team, impact: 0.5-1% churn reduction = £100K+ value).",
      "CS program design: Onboarding (first 30-90 days, critical for retention). Playbook: Day 1 (welcome), Week 1 (training), Week 2 (first use), Month 1 (success milestone), Month 3 (ROI check-in). Owner: CS + product + sales. Metrics: Onboarding completion (%), time to first value, month 1 retention. Cost: £1-5K per customer (automation scales). Result: 70%+ month 1 retention → 90%+ month 3 retention (strong). Bad onboarding: 50% month 1 retention → 60% month 3 (weak, churn accumulates).",
      "CS staffing and cost: CSM ratio (customers per CSM): Enterprise 5-10 customers (deep relationships, expansion focus), mid-market 20-30 customers (balanced), SMB >50 or self-serve (leverage technology). Cost: CSM salary £80-150K + benefits + tools. CAC = £2K, LTV = £20K, CS cost = £5K/customer = 25% of LTV (acceptable, drives retention). Example: 100 customers, mid-market CSM ratio 20:1 = 5 CSMs, cost £500K/year. NRR improvement 10% = £200K ARR increase = 0.25 year ROI. Profitability: CS team is cost, but drives unit economics (retention, NRR). Prioritize."
    ],
    content: [
      {
        heading: "Building an Effective Customer Success Program",
        body: `Creating a CS function that retains and grows customers.

**Customer success model by segment**

| Segment | Model | CSM:Customer | Engagement | Cost | NRR target |
|---|---|---|---|---|---|
| SMB | Self-serve + email | 1:500+ | Email automation, in-app | £200-500/customer | 100-110% |
| Mid-market | CSM-lite | 1:20-30 | Monthly check-in, Slack | £2-5K/customer | 115-125% |
| Enterprise | Dedicated CSM | 1:5-10 | Weekly QBRs, executive engagement | £5-15K/customer | 125%+ |

**Onboarding playbook**

30-90 day critical period (sets trajectory):
- Day 1: Welcome email, login setup, product tour video
- Week 1: Live training session, Slack community invite
- Week 2: First use milestone (customer completes first action in product)
- Week 4: Check-in call (ROI validation, early blockers)
- Week 8: 30-day ROI assessment (did product deliver promised value?)
- Week 12: Quarterly business review (expansion opportunity, next quarter goals)

Metrics:
| Milestone | Target | Below target action |
|---|---|---|
| Login within 3 days | 90% | Automated email reminders |
| Complete training | 85% | Offer one-on-one coaching |
| First action | 80% | Hands-on onboarding call |
| 30-day ROI validation | 75% | ROI realization meeting |
| Month 3 renewal intent | 90% | Expansion conversation |

Cost:
- Automated: £200-500/customer (email, video, in-app guides)
- Touch: £1-3K/customer (CSM time, training)
- White-glove: £5-10K/customer (executive engagement)

**Health scoring and at-risk management**

Health score (0-100):
- Engagement: Login frequency, features used, data depth = 40 points
- Outcome realization: ROI metrics (revenue increase, cost savings) = 40 points
- NPS/satisfaction: Regular check-ins = 20 points

Scoring:
- 80-100: Healthy (focus: expansion)
- 60-79: At-risk (focus: engagement)
- <60: Churn risk (focus: recovery)

At-risk playbook:
1. Automated alert (weekly check, flag if score drops)
2. CSM outreach (within 3 days, phone call)
3. Root cause analysis (engagement issue, product issue, business issue?)
4. Action plan (training, feature education, product roadmap alignment)
5. Follow-up (weekly until restored to healthy)

Recovery rate: 30-50% at-risk saved with proactive outreach

`
      }
    ],
    relatedSlugs: ["retention-and-churn-reduction-mechanics", "account-management-and-expansion-revenue", "customer-feedback-loops-and-product-iteration"],
    faq: [
      { q: "What's a good NRR (Net Revenue Retention)?", a: "Target: 120%+ (expansion revenue offsets churn). Below 100%: Negative growth (losing revenue). 100-110%: Flat to slight growth. 110-120%: Healthy growth. 120%+: Exceptional (doubling every 3-4 years). Enterprise SaaS: 130-150%+ (high expansion). SMB SaaS: 100-110% (lower expansion)." },
      { q: "How many CSMs do I need?", a: "Ratio varies by segment: Enterprise 1:5-10, mid-market 1:20-30, SMB 1:500+ (self-serve). Cost: CSM salary £80-150K. Payback: If CSM reduces churn 2-3% = £100K+ value. Hire when: LTV > 10x CS cost (profitable). Early stage: Founder as CS, hire dedicated at £5M ARR." },
      { q: "How do I reduce churn?", a: "Key drivers: Poor onboarding (fix: structured playbook), lack of ROI (fix: outcome tracking), inactivity (fix: engagement campaigns), product gaps (fix: roadmap visibility). Priority order: Onboarding (biggest impact) → ROI alignment → expansion. Typical savings: Good CS program = 0.5-1.5% monthly churn reduction = £100K-500K annual value." }
    ],
    videoUrl: ""
  }
];

export default batch233Articles;