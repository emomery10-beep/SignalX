import { AcademyArticle } from "@/types/academy";

export const batch200Articles: AcademyArticle[] = [
  {
    slug: "risk-management-and-contingency-planning",
    title: "Risk Management and Contingency Planning: Preparing for Uncertainty",
    description: "Master risk management. Identify risks, plan mitigations, and build resilience.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "risk management",
      "contingency planning",
      "business continuity",
      "scenario planning",
      "risk assessment",
      "mitigation strategy",
      "crisis management",
      "resilience",
      "risk monitoring",
      "business resilience"
    ],
    keyTakeaways: [
      "Risk categories: Market (competitor, slowdown), Product (bugs, outages, market-fit), Team (key person leaves, turnover), Financial (cash flow, bad debt), Operational (vendor failure, security breach). Rate each: Probability (likely/possible/unlikely) × Impact (severe/moderate/minor) = priority. Example: Key CTO leaves (likely to happen in SaaS, severe impact on product) = high priority. Vendor failure AWS down (unlikely, severe) = medium priority. Mitigate: Succession plan for CTO, multi-cloud for AWS. Review quarterly, update as company grows.",
      "Contingency planning: What if revenue misses 30%? Immediate: Cut discretionary spend 20%, reduce hiring, delay non-critical projects. Timeline: Month 1 (stabilize), months 2-3 (optimize), months 4-6 (recovery plan). Example: £10M ARR, miss to £7M. Normal burn £300K/month. Cut to £250K/month. Runway extends from 20 months to 24 months (buys time). Avoid: Panic cuts (damage culture), too late (crisis mode). Best: Build 24-month runway buffer (5 months more = planning time).",
      "Crisis playbook: (1) Activate crisis team (CEO, CFO, lead investor). (2) Assess severity (financial impact, customer impact, press impact). (3) Communicate (internally honest, externally transparent). (4) Execute mitigation (cost cuts, adjust timeline). (5) Monitor (daily check-ins, weekly board updates). (6) Adapt (learn, adjust strategy). Example crisis: Major customer wants to leave (20% revenue). Response: Escalate to CEO, offer discount to stay, buy 3 months to improve product, if leaves still execute cost cuts. Culture: Not if but when crisis hits (plan in advance, reduce panic)."
    ],
    content: [
      {
        heading: "Risk Identification and Assessment",
        body: `Finding and prioritizing risks.

**Risk Categories**

1. Market risks:
   - Competition: New entrant, price war, feature parity
   - Slowdown: Recession, customer budget cuts
   - Market exit: Consolidation (customer acquired by non-user)

2. Product risks:
   - Outage: Major service down (AWS failure, bug)
   - Security breach: Data loss, customer data exposure
   - Market-fit: Product no longer solving problem

3. Team risks:
   - Key person: CTO, sales lead leaves (high impact)
   - Retention: Turnover spike (loss of momentum)
   - Hiring: Can't hire fast enough (miss growth targets)

4. Financial risks:
   - Cash flow: Burn faster than expected, need to raise
   - Bad debt: Customer doesn't pay, credit loss
   - Currency: Foreign exchange, if multi-currency operations

5. Operational risks:
   - Vendor failure: Stripe down, can't process payments
   - Supplier: Cloud provider outage
   - Regulatory: Compliance issue, legal action

6. Execution risks:
   - Product delay: Launch slips 2+ months
   - Sales failure: Can't close deals in target segment
   - Integration: Acquisition integration fails

**Risk Assessment Matrix**

Rate each risk: Probability × Impact = Priority

Probability:
- Likely: >50% chance in next 12 months (will happen)
- Possible: 20-50% chance (may happen)
- Unlikely: <20% chance (less likely, but possible)

Impact:
- Severe: Threatens company survival (lost >50% revenue, key person leaves)
- Moderate: Significant impact (lost 20-50% revenue, miss growth target)
- Minor: Manageable (lost <20% revenue, contained issue)

Priority = Probability × Impact:
- High priority (address immediately): Likely + severe, or possible + severe
- Medium priority (address this quarter): Likely + moderate, or possible + moderate
- Low priority (monitor): Unlikely + moderate, or any + minor

Example risk matrix:

| Risk | Probability | Impact | Priority | Mitigation |
|------|-------------|--------|----------|------------|
| Competitor with better product | Possible | Severe | High | Accelerate roadmap, differentiate |
| Key CTO leaves | Likely | Severe | High | Succession plan, equity, retention |
| AWS outage | Unlikely | Severe | Medium | Multi-cloud, backup region |
| Recession, customer cuts budget | Possible | Severe | High | Diversify revenue, reduce costs |
| Vendor (Stripe) down | Unlikely | Moderate | Low | Secondary payment processor ready |
| Sales team turnover | Likely | Moderate | High | Compensation review, culture |

**Risk Monitoring**

Quarterly risk review:
- Did any risks materialize?
- New risks emerged?
- Mitigations working?
- Update priority/assessment

Example quarterly update:
- Q1: Competitor released new feature (materialized), but our roadmap ahead, low impact
- New: Hiring slower (only hired 2 of 5 planned), now possible + moderate = high priority
- AWS outage (1 hour, caught by backup) = mitigation worked
- Next steps: Address hiring (review comp, recruiting, culture)

Risk dashboard (update monthly):
- Top 5 risks by priority
- Mitigation status (green/yellow/red)
- Action owner (who's responsible)

`
      },
      {
        heading: "Contingency Planning and Downside Scenarios",
        body: `Preparing for worst-case outcomes.

**Revenue Miss Contingency**

Scenario: Projected £10M revenue, likely miss to £7M (30% miss)

Immediate (week 1):
- Activate cost reduction (reduce discretionary spend)
- Freeze non-critical hiring (leave offers open 1 month, evaluate)
- Delay non-critical projects (roadmap, infrastructure)
- No executive salary cut (maintain confidence)

Month 1 actions:
- Reduce contractor spend (end non-critical contracts)
- Reduce marketing spend (pause experiments, focus efficiency)
- Reduce office (cancel unused space, move smaller)
- Reduce travel (cancel non-essential)
- Expected savings: £50K/month (cost base from £300K to £250K)

Outcome:
- Original runway (£2M cash / £300K burn): 6.7 months
- New runway (£2M / £250K burn): 8 months (1.3 month buffer gained)

Longer-term (months 2-6):
- Reassess business (why did we miss? Market? Product? Execution?)
- Adjust strategy (double down on what's working, cut what's not)
- Alternative: Raise capital (Series A earlier, if not ready, difficult)
- Goal: Get to 18-24 months runway (planning time)

**Key Person Contingency**

Risk: CTO (only person who understands infrastructure) leaves

Mitigation plan:
1. Build team: Hire 2-3 engineers now (don't wait until CTO leaves)
2. Documentation: CTO documents all systems, architecture, roadmap
3. Succession: Identify engineer who can step up to lead
4. Retention: Equity, bonuses, project leadership for likely successor
5. Training: Successor shadows CTO, leads projects under mentorship

If CTO leaves:
- Successor takes over (with 3-month support from CTO via consultant)
- Team empowered (you've built depth)
- Impact: Low (prepared vs surprised)

**Major Customer Loss**

Risk: Top customer (20% revenue) leaves

Immediate:
- Escalate to CEO (personal relationship call, why are they leaving?)
- Identify pain point (product issue, pricing, competitor?)
- Offer solution (discount, custom feature, dedicated support)
- Timeline: If decision final, 30-day notice period (time to adjust

Impact assessment:
- Revenue impact: -£2M annual (20% of £10M)
- Customer concentration: Reduce from 20% to ~17% (1 less large customer)
- Morale: Significant (loss is visible, may trigger other customer questions)

Response:
- Communicate to team (explain what happened, learning)
- Accelerate customer success (reach out to other top customers, ensure happy)
- Adjust forecast (year 1 now £8M instead of £10M, triggers contingency planning above)

**Failure Mode and Effects Analysis (FMEA)**

Systematic approach to identifying risks:

Process: "Customer signs up"
| Step | Failure | Impact | Probability | Mitigation |
|------|---------|--------|-------------|------------|
| Payment processing | Card decline | Lost customer | Possible | Retry logic, email support |
| Account creation | Email spam, bounce | Can't activate | Possible | Double opt-in, email verify |
| Onboarding | Product too complex | Early churn | Likely | Guided onboarding, templates |
| Support | No response | Frustration | Possible | SLA, escalation |

Outcome: Identify top failures, prioritize fixing

**Crisis Playbook**

Trigger: Revenue miss >25%, major outage, security breach, key person leaves

Phase 1: Activate (Hour 0-4)
- CEO calls emergency meeting (CEO, CFO, lead investor, 1-2 advisors)
- Assess: Severity, timeline, impact
- Decide: Crisis team (who manages what)

Phase 2: Assess (Hour 4-24)
- Gather data: How severe? How long? What's the impact?
- Model impact: Revenue impact, cash impact, timeline
- Identify options: Cost cuts, capital raise, strategic pivot

Phase 3: Communicate (Hour 24-48)
- Internal: Honest update to team, no sugar-coating
- Investors: Update major shareholders, get support
- Customers: If relevant (outage, service disruption), communicate plan

Phase 4: Execute (Days 2-30)
- Cost reductions (if cash issue)
- Product fixes (if quality issue)
- Customer outreach (if customer issue)
- Daily standups (crisis team, close coordination)

Phase 5: Monitor (Days 30-90)
- Weekly status updates
- Track KPIs (recovery progress)
- Assess: Are actions working?

Phase 6: Learn (After recovery)
- Retrospective: What caused crisis? How do we prevent?
- Update processes: Add safeguards, improve monitoring
- Culture: Acknowledge team effort, celebrate recovery

`
      }
    ],
    relatedSlugs: [
      "scenario-planning-and-sensitivity-analysis",
      "financial-forecasting-modeling",
      "burn-rate-and-cash-runway-analysis",
      "board-governance-and-fiduciary-duties",
      "exit-planning-and-m-and-a-preparation"
    ],
    faq: [
      {
        q: "What are the main risks I should be concerned about?",
        a: "Six categories: (1) Market (competition, slowdown), (2) Product (bugs, outages, market-fit), (3) Team (key person leaves, turnover), (4) Financial (cash flow, bad debt), (5) Operational (vendor failure, security), (6) Execution (delays, missed targets). Assess each: Probability × Impact = priority. Example: Key CTO leaves (likely + severe = high priority). AWS down (unlikely + severe = medium). Mitigate top risks first."
      },
      {
        q: "How do I plan for a revenue miss?",
        a: "Scenario: £10M projected, miss to £7M (30%). Immediate: Cut discretionary spend 20%. Expected savings: £50K/month (£300K → £250K burn). Impact: Runway extends from 6.7 to 8 months (gain 1.3 months planning time). Longer-term (months 2-6): Reassess business, adjust strategy, target 18-24 month runway. Goal: Plan in advance (don't panic), have cost-cutting options ready."
      },
      {
        q: "What if my key person leaves?",
        a: "Mitigation: (1) Build team (hire now, don't wait), (2) Document (systems, architecture, decisions), (3) Succession plan (identify replacement, develop), (4) Retain (equity, bonuses, leadership opportunities). If they leave: Successor takes over with transition support. Impact: Low if prepared, severe if surprised. Culture: Plan before crisis, reduce shock."
      },
      {
        q: "What's a crisis playbook?",
        a: "Phases: (1) Activate (CEO emergency meeting, assess severity), (2) Assess (gather data, model impact, identify options), (3) Communicate (internal honest update, investor notification, customer communication), (4) Execute (cost cuts/fixes, daily standups), (5) Monitor (weekly status, track recovery), (6) Learn (retrospective, prevent future). Timeline: Hours 0-48 for assessment/communication, days 2-30 for execution, months 1-3 for recovery. Culture: Prepare in advance (don't panic under pressure)."
      }
    ],
    videoUrl: ""
  }
];

export default batch200Articles;
