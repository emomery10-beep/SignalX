import { AcademyArticle } from "@/types/academy";

export const batch249Articles: AcademyArticle[] = [
  {
    slug: "risk-management-and-contingency-planning",
    title: "Risk Management and Contingency Planning: Preparing for the Unexpected",
    description: "Master risk management. Identify risks, plan contingencies, manage crises.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["risk management", "contingency planning", "crisis management", "risk assessment", "business continuity", "scenario planning"],
    keyTakeaways: [
      "Risk identification: Identify top 10 risks (revenue, operational, market, competitive). Assess: Probability (1-5) × Impact (1-5) = Risk score. Example: Customer churn 3 × 4 = 12 (medium risk). Competitive threat 2 × 5 = 10 (medium). Recession 2 × 4 = 8 (low-medium). Key customer loss 3 × 5 = 15 (high). Infrastructure failure 1 × 4 = 4 (low). Prioritize: Focus on high probability + high impact. Mitigation: For each top risk, identify 2-3 mitigation steps. Example: Key customer loss (mitigate via: multi-year contracts, expansion, build relationship, have backup customers). Cost: Low (planning, some structural changes). Benefit: Avoid catastrophic failure (1 loss = company down).",
      "Contingency planning: For top 3-5 risks, develop contingency plan (if it happens, what do we do?). Format: Risk → Trigger (how know it happened) → Response (first 30 days) → Recovery (next 90 days) → Prevention (avoid next time). Example: Key customer leaves. Trigger: Customer gives notice. Response: Day 1 (CEO call to customer, understand reason), Day 5 (assess impact, activate backup plan), Day 15 (accelerate new customer sales). Recovery: Next 90 days (grow revenue to replace lost customer). Prevention: Multi-year contracts, expansion, diversify. Cost: Planning (low), execution varies. Benefit: When crisis hits, have plan (faster recovery, less panic).",
      "Crisis management: When major event happens (breach, customer loss, recession, competitive threat). Crisis team: CEO, CFO, Head of relevant function. Plan: Daily updates to board, customer comms, employee comms. Message: Be honest (people trust transparency more than spin), action-oriented (here's what we're doing), timeline (when things normalize). Example: Data breach crisis. Day 1: Notify affected customers, pause sales (don't sell while investigating), security audit. Day 5: Root cause + fix. Day 15: Notify customers of remediation, offer credit. Recovery: Invest in security (prevent next time). Insurance: Cyber insurance covers costs."
    ],
    content: [
      {
        heading: "Managing Risk and Preparing for Crises",
        body: `Identifying and mitigating business risks.

**Risk assessment framework**

Risk identification:
- Revenue risks: Customer churn, sales miss, market downturn
- Operational risks: Key person departure, infrastructure failure, hiring delays
- Market risks: Competitive threat, new entrant, market shift
- Financial risks: Cash flow, funding, recession

Risk matrix (Probability × Impact):
| Risk | Probability | Impact | Score | Priority |
|---|---|---|---|---|
| Key customer loss | 3/5 | 5/5 | 15 | High |
| Competitive threat | 2/5 | 4/5 | 8 | Medium |
| Recession | 2/5 | 4/5 | 8 | Medium |
| Key person departure | 2/5 | 4/5 | 8 | Medium |
| Infrastructure failure | 1/5 | 3/5 | 3 | Low |
| Fundraising failure | 2/5 | 5/5 | 10 | High |

Scoring: 1-5 for probability/impact. Score = P × I
- 15+: High priority (plan contingency)
- 8-14: Medium (monitor, have plan)
- <8: Low (track, but not urgent)

**Contingency planning**

For top 3-5 risks, develop plan:

Risk: Key customer (30% of revenue) leaves
- Trigger: Customer gives notice (90-day exit clause)
- Day 1-7 response:
  - CEO calls customer (understand why, attempt retain)
  - Finance models impact (update forecast, runway)
  - Sales focuses on accelerating other deals
- Day 7-30:
  - Stabilize: Cut costs if needed (preserve runway)
  - Replace: Accelerate new customer sales
  - Expand: Grow existing customers (increase ARPU)
- Day 30-90:
  - Recover: Close new customers to replace revenue
  - Prevent: Diversify (no customer >20%)
- Prevention:
  - Multi-year contracts (lock customer)
  - Expansion (customer more integrated, less likely to leave)
  - Relationship (executive sponsor, regular reviews)

Risk: Major recession (market shrinks 50%)
- Trigger: GDP downturn, customer budget cuts
- Day 1-7 response:
  - Prepare: Cut costs (pause hiring, reduce spend)
  - Communicate: Tell board/investors early
  - Focus: Improve unit economics (CAC reduction, profitability)
- Day 7-30:
  - Extend runway: 18+ months (no funding risk)
  - Accelerate profitability (path to breakeven)
  - Maintain sales (lower volume expected)
- Day 30-90:
  - Stabilize: New cost structure
  - Grow: Resume hiring when safe
  - Improve: Better unit economics for new normal
- Prevention:
  - Cash buffer (18+ months runway before crisis)
  - Diversification (not dependent on one segment)
  - Cost discipline (know how to scale down efficiently)

**Crisis communication**

When major event happens:
1. Acknowledge (be honest about issue)
2. Explain (what happened, why)
3. Action (what are we doing, timeline)
4. Transparency (admit unknowns, what we're learning)

Bad crisis comms:
"We have a small issue with some customer data. We're looking into it. Everything is fine."

Good crisis comms:
"We discovered a data breach affecting 1,000 customers. Root cause: [specific]. We've: (1) notified affected customers, (2) fixed vulnerability, (3) have cyber team on it. Next: Security audit by external firm (week 2). We're offering [credit/compensation]. Questions? Email [contact]."

Key principles:
- Be fast (don't hide, announce early)
- Be honest (admit mistakes, don't spin)
- Be action-oriented (here's what we're doing)
- Be transparent (admit what we don't know)
- Follow up (regular updates until resolved)

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "cash-flow-management-and-working-capital", "compliance-and-regulatory-considerations"],
    faq: [
      { q: "How do I identify key risks?", a: "1. List top 10 business risks (revenue, operational, market, competitive). 2. Assess probability (1-5) and impact (1-5). 3. Calculate score (P × I). 4. Prioritize top 5 (score 10+). 5. For each, develop contingency plan. Review: Quarterly (update as company evolves)." },
      { q: "What should my contingency plan include?", a: "Risk → Trigger (how know it happened) → Response (first 30 days) → Recovery (next 90 days) → Prevention (avoid next time). Example: Key customer loss → customer gives notice → CEO calls + assess impact → accelerate other deals → multi-year contracts to prevent." },
      { q: "How should I communicate during a crisis?", a: "Be honest, be fast, be action-oriented. Acknowledge issue, explain what happened, share what you're doing, admit unknowns. Example: Breach → announce to customers → explain vulnerability → share fix → offer compensation → external security audit → regular updates. Transparency beats spin (people trust honesty)." }
    ],
    videoUrl: ""
  }
];

export default batch249Articles;