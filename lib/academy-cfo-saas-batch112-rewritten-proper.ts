import { AcademyArticle } from "@/types/academy";

export const batch112Articles: AcademyArticle[] = [
  {
    slug: "product-roadmap-planning-prioritization",
    title: "Product Roadmap Planning and Prioritization: Building for Growth and Retention",
    description: "Master product roadmap planning. Prioritize features based on impact, align with business strategy, and communicate roadmap.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "product roadmap",
      "feature prioritization",
      "product strategy",
      "roadmap communication",
      "impact vs effort",
      "customer requests",
      "product-market fit",
      "feature dependencies",
      "roadmap planning",
      "product development"
    ],
    keyTakeaways: [
      "Roadmap prioritization: Use impact vs. effort matrix; high-impact low-effort features first (quick wins), then high-impact high-effort (strategic bets), avoid low-impact features (time sinks); example: GDPR compliance = high-impact (required), medium-effort = do it; custom reporting for one customer = low-impact, high-effort = skip unless strategic. Metrics for impact: revenue impact, customer satisfaction, churn reduction, feature adoption.",
      "Roadmap timeline: 12-month view (quarterly breakdown) shows direction; detailed only for next quarter (projects change too fast); beyond quarter 2-3, show directional roadmap (themes) not specific features. Share roadmap with customers to build confidence, but emphasize plans change. Update quarterly as market/customers evolve. Roadmap discipline prevents feature bloat and keeps team focused.",
      "Roadmap governance: Product manager prioritizes features (input from sales, customer success, engineering), engineering estimates effort, leadership approves quarterly themes; don't let sales/customers demand override prioritization (they have different incentives); customers want everything now, sales wants all customer requests done; product manager balances broader business strategy. Stakeholder management: Sales needs features for deals (legitimate input), engineering needs time for tech debt, customers need fixes for their pain points"
    ],
    content: [
      {
        heading: "Building a Product Roadmap",
        body: `A product roadmap aligns the organization on what to build and why.

**Why Roadmaps Matter**

Without roadmap:
- Sales team builds features for their deals
- Engineering builds what they think is cool
- Product team builds what they think customers want
- Result: Fragmented product, high technical debt, customer confusion

With roadmap:
- Clear priorities (what to build first)
- Strategic alignment (why we build this)
- Stakeholder alignment (sales, engineering, customers know what's coming)
- Resource allocation (team focused on high-impact work)

A good roadmap costs 20-40 hours to create quarterly, saves hundreds of hours in execution.

**Roadmap Planning Process**

Step 1: Inputs (gathering data)

Collect requests from:
- Customers (feature requests, pain points)
- Sales (features needed to win deals)
- Engineering (tech debt, infrastructure improvements)
- Customer success (churn reasons, expansion opportunities)
- Analytics (usage data, where are customers struggling?)
- Strategy (company direction, growth goals)

Example: 50 feature requests collected

Step 2: Assessment (impact vs. effort analysis)

For each request, estimate:
- Impact: How much does this help business? (1-5 scale)
  - 5 = major impact (enables new market, drives 20%+ growth)
  - 4 = significant impact (enables expansion, drives 10-20% growth)
  - 3 = moderate impact (improves product, small growth)
  - 2 = minor impact (nice-to-have, internal improvement)
  - 1 = minimal impact (almost irrelevant)

- Effort: How much work is this? (1-5 scale)
  - 5 = major effort (6+ months, significant engineering)
  - 4 = significant effort (3-6 months)
  - 3 = moderate effort (4-8 weeks)
  - 2 = minor effort (1-4 weeks)
  - 1 = minimal effort (days)

Step 3: Prioritization (impact-effort matrix)

Plot all features on matrix:

High Impact, Low Effort (Quick Wins):
- Do immediately
- Example: GDPR compliance, security patch, UI improvement
- Priority: Now

High Impact, High Effort (Strategic Bets):
- Schedule for medium-term
- Example: Mobile app, new integration platform, enterprise SSO
- Priority: Q2-Q3

Low Impact, Low Effort (Filler):
- Do when have spare capacity
- Example: Dark mode, emoji support
- Priority: Later

Low Impact, High Effort (Time Sinks):
- Avoid (opportunity cost is high)
- Example: Custom feature for one customer, niche reporting
- Priority: Skip

Example prioritization:

Feature | Impact | Effort | Priority
Mobile app | 5 | 5 | Q2
GDPR compliance | 5 | 3 | Now
Custom reporting | 2 | 4 | Skip
Dark mode | 2 | 1 | Later
API improvements | 4 | 4 | Q1
Self-service onboarding | 4 | 3 | Q1
Customer integrations | 4 | 2 | Q1
Advanced analytics | 3 | 3 | Q2

Step 4: Build roadmap (theme-based)

Organize by theme rather than individual features:

Q1 2025: Growth and Efficiency
- Self-service onboarding (reduce implementation time)
- API improvements (enable integrations)
- Customer integrations (expand ecosystem)

Q2 2025: Compliance and Enterprise
- GDPR compliance (required, 5-state law)
- Advanced analytics (enterprise demand)

Q3 2025: Mobile and Expansion
- Mobile app (new market, high impact)
- Advanced reporting (enterprise expansion)

Q4 2025: Consolidation
- Performance improvements
- Bug fixes and tech debt
- Prepare for next year

This shows direction without over-committing.

Step 5: Socialize roadmap (get buy-in)

Before finalizing:
- Review with leadership (alignment on strategy)
- Review with sales (can they sell against this?)
- Review with engineering (are estimates realistic?)
- Review with customer advisory board (does this address key needs?)

Iterate based on feedback.

Step 6: Communicate roadmap (build confidence)

Share with:
- Entire company (all-hands)
- Customers (quarterly customer advisory call, in-app announcements)
- Investors (board updates, investor calls)
- Prospective customers (during sales process)

Example communication:
"Q1 focus: Ease of implementation. We're investing in self-service onboarding to get customers live in days (not weeks). We're also investing in API and integrations so you can connect your entire stack.

Q2 focus: Enterprise and compliance. GDPR is critical (we're implementing), and enterprise customers need advanced analytics (we're building).

Q3 focus: Mobile first. 60% of our customers are asking for mobile. We're shipping a mobile app in Q3."

**Roadmap Communication**

Key principles:
- Be specific about near-term (next quarter)
- Be vague about far-term (beyond 2 quarters)
- Emphasize plans change (don't commit too hard)
- Listen to feedback (customers may highlight issues)

Example roadmap communication:

Q1 (Firm commitments):
- Self-service onboarding: In beta next month, GA in 6 weeks
- API improvements: Beta in 2 weeks
- Stripe integration: GA in 8 weeks

Q2-Q3 (Directional):
- Mobile app (Q3 timeframe)
- Advanced analytics (Q2 timeframe)
- More integrations (ongoing)

Post-2023 (Themes):
- Mobile-first experience
- Enterprise features (multi-seat, advanced permissioning)
- AI-powered insights

This balances commitment (near-term specificity) with flexibility (far-term directional).

**Managing Roadmap Changes**

Plans change. Here's how to handle it:

Scenario: Major feature planned for Q2 blocked by engineering complexity discovered in Q1

Response:
- Acknowledge the change (transparency)
- Explain what happened (learning)
- Show new plan (what moves?)
- Communicate timeline (when will it ship?)

Example: "We planned advanced analytics for Q2. During Q1 planning, we discovered our data architecture needs significant work first (causing 2-month delay). We're moving analytics to Q3 and shifting Q2 focus to [alternative]. This is better long-term (more stable foundation for analytics)."

Customers respect transparency more than perfect plans. Bad surprises (delayed without explanation) damage trust.

**Roadmap Governance**

Who decides what gets prioritized?

Product Manager leads, with input from:
- Sales: "Customers need X to win deals"
- Customer Success: "Customers churn because of missing Y"
- Engineering: "We need to fix tech debt Z"
- Leadership: "Strategy requires A, B, C"

But key principle: No single stakeholder unilaterally decides.

Common mistake: Letting sales drive product roadmap
- Problem: Build features only for one customer
- Result: Product unfocused, tech debt increases, can't scale
- Solution: Product manager arbitrates (does this feature serve broader market?)

Common mistake: Ignoring customer requests
- Problem: "We know better than customers"
- Result: Product misses real customer needs
- Solution: Product manager listens to customers but prioritizes by impact (not volume of requests)

**Roadmap Metrics**

Track roadmap execution:

- % of planned features shipped on time
- % of roadmap items completed (track if planned items still relevant)
- Customer satisfaction with roadmap
- Feature adoption (% of users using new features)
- Impact on key metrics (revenue, NRR, churn, CAC)

Example:

Q1 Roadmap: 12 planned items
- Completed on time: 10 (83%)
- Completed late: 2 (17%)
- Overall completion: 100%

Customer satisfaction with roadmap: 7.5/10 NPS
- Feedback: "Appreciate mobile app commitment, want it faster"

Impact:
- Self-service onboarding reduced implementation time: 20 days → 5 days
- Stripe integration enabled 50 new customers (would have used competitors)
- API improvements enabled 5 customer integrations

This shows roadmap effectiveness and informs next roadmap.

**Common Roadmap Mistakes**

Mistake 1: Roadmap driven by sales pipeline
- Problem: Build features only because one enterprise customer wants it
- Result: Unfocused product, low adoption for 90% of customers
- Solution: Prioritize by customer count served, not customer size

Mistake 2: Roadmap driven by loudest voice
- Problem: Most vocal customer gets priority
- Result: Not necessarily best features for business
- Solution: Data-driven prioritization (impact metrics)

Mistake 3: Roadmap too detailed long-term
- Problem: Plan every feature 18 months out
- Result: Plans always wrong, team frustrated by unrealistic targets
- Solution: Detailed only Q1, directional Q2-3, themes beyond

Mistake 4: No roadmap (everything ad-hoc)
- Problem: Team chaos, no alignment, constant context switching
- Result: Low productivity, high burnout
- Solution: Plan quarterly (minimum), communicate roadmap

Mistake 5: Roadmap never changes
- Problem: Stick to plan even when market changes
- Result: Build irrelevant features, miss opportunities
- Solution: Quarterly review and update roadmap

**Roadmap Template**

Simple template:

Quarter: Q2 2025

Strategic Theme: "Enterprise Readiness"
Rationale: Enterprise customers asking for features, 3 deals stalled waiting for these.

Planned Features:
1. Advanced analytics dashboard (impact 5, effort 3, owner: Jane)
2. Custom report builder (impact 4, effort 4, owner: John)
3. SSO integration (impact 4, effort 2, owner: Sarah)
4. Role-based access control (impact 4, effort 3, owner: Engineering)

Dependencies:
- RBAC must complete before custom reporting (needs permissions model)

Success metrics:
- 3 stalled deals close
- Enterprise NRR improves 5+ points
- Feature adoption >60% within 30 days of launch

Communications:
- Customer webinar in 3 weeks (preview)
- In-app announcement 2 weeks before launch
- Sales enablement (product training for sales team)

This is a simple but complete roadmap.

A good product roadmap takes time to build but saves ten times that in execution. It's one of the highest-leverage activities a product leader can do.
`
      }
    ],
    relatedSlugs: [
      "customer-success-metrics-health-scoring",
      "churn-analysis-retention-improvement",
      "customer-acquisition-cost-optimization",
      "metrics-dashboard-design-kpi-tracking",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "How should I prioritize roadmap features?",
        a: "Use impact vs. effort matrix. Do high-impact/low-effort first (quick wins), then high-impact/high-effort (strategic bets). Avoid low-impact/high-effort (time sinks)."
      },
      {
        q: "How far ahead should I plan?",
        a: "Detailed for next quarter, directional for next 2 quarters, themes beyond that. Plans change too fast to commit further ahead."
      },
      {
        q: "Should I let sales drive the roadmap?",
        a: "No. Sales has important input but product manager prioritizes by broader impact. Don't build features only for one customer (doesn't scale)."
      },
      {
        q: "How often should I update the roadmap?",
        a: "Review quarterly at minimum. Communicate changes transparently. Customers respect flexibility more than perfect execution of a plan."
      }
    ],
    videoUrl: ""
  }
];

export default batch112Articles;
