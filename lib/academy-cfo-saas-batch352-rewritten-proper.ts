import { AcademyArticle } from "@/types/academy";

export const batch352Articles: AcademyArticle[] = [
  {
    slug: "risk-management-and-contingency-planning",
    title: "Risk Management and Contingency Planning: Preparing for Challenges",
    description: "Master risk management. Identify risks, plan contingencies, prepare for challenges.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["risk management", "contingency planning", "business risk", "crisis planning", "risk mitigation"],
    keyTakeaways: [
      "Risk management: Identify potential problems (competition, market shift, key person loss), assess likelihood (high/medium/low), plan response (mitigation, contingency). Examples: Key person risk (document processes, cross-train), market risk (diversify segments), financial risk (maintain runway cushion, credit line). Cost: Time to plan. ROI: Avoid crises (prepared beats surprised).",
      "Risk types: (1) Market risk (demand drops, competition increases), (2) Customer risk (concentration, churn), (3) Product risk (technical debt, security), (4) Team risk (key person leaves, turnover high), (5) Financial risk (cash shortage, profitability). Mitigate: Diversify (segment, revenue), build (product quality, team), plan (contingency, reserve). Communicate: Board, investors (transparency).",
      "Contingency plan: \"If X happens, we will do Y\". Example: \"If top 3 customers leave (20% revenue loss), we will (1) reduce burn 30% (hiring freeze, marketing cut), (2) accelerate fundraising (bridge round), (3) pivot focus (different market). Timeline: Implement within 1-2 weeks.\" Having plan beforehand = faster response in crisis."
    ],
    content: [
      {
        heading: "Identifying and Managing Business Risks",
        body: `Building resilience through risk identification and contingency planning.

**Risk management fundamentals**

Process:
1. Identify risks (what could go wrong?)
2. Assess likelihood (high/med/low) and impact (severe/moderate/minor)
3. Plan mitigation (reduce likelihood)
4. Plan contingency (respond if happens)
5. Monitor (track risk indicators)

Risk matrix (likelihood vs impact):

| | Low impact | Medium impact | High impact |
|---|---|---|---|
| High likelihood | Monitor | Mitigate | Urgent action |
| Med likelihood | Monitor | Mitigate | Prepare contingency |
| Low likelihood | Accept | Plan contingency | Plan contingency |

Example risks:

| Risk | Likelihood | Impact | Priority |
|---|---|---|---|
| Churn increases | Medium | High | Mitigate |
| Top customer leaves | Low | High | Contingency |
| Competitor enters | Medium | Medium | Monitor |
| Key engineer leaves | Low | High | Contingency |
| Cash runs out | Low | Severe | Contingency |

**Market risks**

Risk: Market demand drops (recession, shift)

Impact: Revenue contracts 20-30%

Likelihood: Medium (cycles happen)

Mitigation:
- Diversify customer base (not dependent on one segment)
- Build high switching costs (product stickiness)
- Maintain financial reserves (5-10% additional buffer)

Contingency plan (if demand drops):
- Month 1: Reduce burn 30% (hiring freeze, marketing cut)
- Month 2: Prioritize profitability (cut low-margin products)
- Month 3: Explore pivots (adjacent markets, product extensions)

Risk: Competitor enters with lower price

Impact: May lose price-sensitive customers

Likelihood: Medium (happens in growing markets)

Mitigation:
- Differentiate (not just price, UX, features, brand)
- Build moats (network effects, switching costs, data)
- Lock in customers (long-term contracts)

Contingency plan (if competitor enters):
- Accelerate differentiation (product improvements)
- Improve customer success (reduce churn)
- Communicate value (marketing, messaging)

**Customer risks**

Risk: Customer concentration (top 3 = 50% revenue)

Impact: Losing top customers = 50% revenue drop

Likelihood: Medium (customers change, get acquired)

Mitigation:
- Diversify (cap single customer at 15% revenue)
- Long contracts (lock in customers)
- Expand accounts (land and expand, deepen relationships)

Contingency plan (if top customer leaves):
- Month 1: Immediately reduce burn (cut expenses)
- Month 2: Accelerate new customer acquisition
- Result: Minimize revenue impact through quick action

Risk: Churn increases (5% → 10%)

Impact: Revenue contracts, harder to grow

Likelihood: Medium (product issues, market shift)

Mitigation:
- Monitor churn monthly (early warning)
- Invest in product quality (reduce reasons to leave)
- Build customer success program (engagement)

Contingency plan (if churn spikes):
- Week 1: Investigate (why are customers leaving?)
- Week 2: Fix issues (product, support, pricing)
- Week 3: Re-engage churned customers (win-back)

**Team risks**

Risk: Key person leaves (CEO, CTO, top salesperson)

Impact: Company disrupted, customers may follow

Likelihood: Low (usually <1% per key person annually)

Mitigation:
- Cross-train team (no one indispensable)
- Document processes (knowledge transfer)
- Build bench (develop potential replacement)
- Offer retention (equity, incentives)

Contingency plan (if key person leaves):
- Succession plan: Pre-identified replacement (trained, ready)
- Communications: Immediate customer communication (assurance)
- Transition: 2-4 week overlap (knowledge transfer)

Risk: High turnover (key team members leave)

Impact: Loss of expertise, culture damage

Likelihood: Medium (especially early stage)

Mitigation:
- Competitive compensation (match market)
- Culture investment (engagement, values)
- Growth opportunities (career path)
- Equity (long-term alignment)

Contingency plan (if turnover spikes):
- Exit interviews (understand why leaving)
- Retention bonuses (keep critical people)
- Accelerated hiring (backfill roles)

**Financial risks**

Risk: Cash runs out (runway exhausted)

Impact: Forced shutdown, layoffs, or crisis fundraising

Likelihood: Low if well-managed, but possible in downturns

Mitigation:
- Monitor runway (weekly)
- Maintain cash buffer (18 months comfortable)
- Plan profitability path (know when to cut)
- Maintain credit line (emergency cash access)

Contingency plan (if cash crisis):
- Week 1: Reduce burn 40% (hiring freeze, marketing cut, executive cuts)
- Week 2: Emergency fundraising (bridge round, credit line)
- Week 3: Decide (profitability path or exit?)

Risk: Profitability doesn't materialize

Impact: Company can't support itself (dependent on capital raises)

Likelihood: Medium (many SaaS companies struggle)

Mitigation:
- Unit economics discipline (LTV > 3x CAC)
- Monitor margins (gross margin 70%+)
- Plan path to profitability (know timeline)

Contingency plan (if profitability stalls):
- Review unit economics (is model broken?)
- Adjust strategy (different segment, pricing, product)
- Plan timeline (when will profitability happen?)

**Product/Technical risks**

Risk: Security breach

Impact: Customer trust destroyed, legal liability

Likelihood: Low if secure, but increasing risk as grow

Mitigation:
- Security best practices (encryption, access control)
- Regular audits (penetration testing)
- Insurance (cyber liability coverage)
- Incident response plan (ready to respond)

Contingency plan (if breach occurs):
- Hour 1: Contain (isolate system)
- Hour 2: Assess (what was accessed?)
- Hour 4: Notify (inform affected customers)
- Day 1: Legal (inform lawyers, insurance)
- Day 1+: Remediate (fix, communicate plan)

Risk: Technical debt (legacy code, hard to maintain)

Impact: Slow development, quality issues, bugs

Likelihood: High (accumulates over time)

Mitigation:
- Engineering discipline (code reviews, testing)
- Refactoring sprints (allocate 20% time)
- Hiring great engineers (quality focus)

Contingency plan (if debt becomes crisis):
- Pause new features (focus on stability)
- Refactoring sprint (dedicated time)
- May slow growth 2-3 months to stabilize

**Risk dashboard**

Monthly monitoring:

| Risk | Indicator | Target | Status |
|---|---|---|---|
| Churn | Monthly % | 3% | 4.5% (elevated) |
| Customer concentration | Top 3 % | <30% | 45% (high risk) |
| Key person dependency | Process docs | 100% | 60% (gap) |
| Cash runway | Months | 18+ | 12 (adequate) |
| Gross margin | % | 70%+ | 68% (declining) |

Red indicators:
- Churn above target = priority (improve retention)
- Concentration high = priority (diversify)
- Runway dropping = warning (plan fundraising)
- Margin declining = investigate (cost control)

Quarterly risk review:
- What risks materialized? (lessons)
- What new risks emerged? (market, competition)
- Are mitigations working? (adjust)

**Common risk mistakes**

Mistake 1: No risk planning
- Problem: Crisis happens, caught unprepared
- Fix: Identify risks, plan responses upfront
- Impact: Faster response, better outcomes

Mistake 2: All mitigation, no contingency
- Problem: Spend resources preventing unlikely risks
- Fix: Mitigation for likely risks, contingency for unlikely high-impact
- Impact: Resource efficiency

Mistake 3: Ignoring key person risk
- Problem: CEO leaves, company falls apart
- Fix: Cross-train, document, succession plan
- Impact: Company survives key changes

Mistake 4: No financial reserves
- Problem: Market downturn, no cash cushion, crisis
- Fix: Maintain 6-month extra runway (rainy day fund)
- Impact: Weather downturns

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "scenario-planning-and-sensitivity-analysis", "investor-relations-and-stakeholder-communication", "cash-runway-and-burn-rate-management", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What risks should I plan for?", a: "Common: Market risk (demand drops), customer risk (concentration, churn), team risk (key person leaves), financial risk (cash shortage), product risk (security, tech debt). Assess: Likelihood (high/med/low), impact (severe/moderate/minor). Mitigate: High-likelihood, high-impact risks (diversify, improve quality). Plan contingency: Low-likelihood, high-impact (what will we do if happens?)." },
      { q: "How do I create a contingency plan?", a: "Format: \"If X happens, we will do Y (timeline, responsible person)\". Example: \"If churn increases to 6% (vs target 3%), we will (1) investigate root cause (week 1), (2) improve onboarding (month 1-2), (3) re-engage customers (ongoing). Responsible: VP CS.\" Have plan before crisis (easier to execute under pressure)." },
      { q: "What's the best way to monitor risks?", a: "Dashboard: Key risk indicators (churn rate, customer concentration, cash runway, margin). Monthly review: Are indicators in green zone? If red, activate contingency. Quarterly: What new risks emerged? Are mitigations working? Update risk list as business changes." }
    ],
    videoUrl: ""
  }
];

export default batch352Articles;
