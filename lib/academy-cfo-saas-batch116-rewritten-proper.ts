import { AcademyArticle } from "@/types/academy";

export const batch116Articles: AcademyArticle[] = [
  {
    slug: "customer-onboarding-time-to-value",
    title: "Customer Onboarding and Time-to-Value: Accelerating Customer Success",
    description: "Master customer onboarding. Reduce time-to-value, improve adoption, and drive expansion revenue through effective implementation.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "onboarding",
      "time-to-value",
      "customer implementation",
      "adoption",
      "feature adoption",
      "customer success",
      "implementation timeline",
      "training",
      "customer enablement",
      "go-live"
    ],
    keyTakeaways: [
      "Time-to-value (TTV) = days until customer sees value; industry benchmark: 30-60 days for SMB, 60-180 days for enterprise; customers with fast TTV (30 days) have 50% lower churn than slow TTV (120 days); example: reduce TTV from 60 to 30 days = 20-30% churn reduction. Impact: Every 10-day reduction = 3-5% improvement in retention and expansion likelihood",
      "Onboarding phases: (1) Pre-implementation (kickoff, technical setup) = 5-10 days, (2) Configuration and data migration (set up their data) = 20-40 days, (3) Testing and training (customer team learns) = 5-15 days, (4) Go-live (activate in production) = 1-5 days, (5) Success verification (confirm value) = 10-20 days. Total: 40-90 days typical. Compress by parallelizing phases and having strong playbooks.",
      "Expansion revenue from onboarding: Customers who have good onboarding expand 40-60% more than average; customers reaching value proof point within 30 days have 2x expansion revenue vs 60+ day customers. Metric: Track TTV cohorts, measure expansion revenue by TTV bucket. Invest in onboarding = doubles expansion upside (not just retention, also revenue growth)"
    ],
    content: [
      {
        heading: "Understanding Time-to-Value",
        body: `Time-to-Value (TTV) is the duration between contract signature and when customer achieves measurable value from your product.

**The TTV Impact**

Example: SaaS company with 100 customers

Group A: TTV 30 days (fast onboarding)
- Adoption: 85% of features adopted within 30 days
- Churn: 2% within first year
- Expansion: 40% upgrade to higher tier
- NRR: 125%

Group B: TTV 60 days (standard onboarding)
- Adoption: 70% of features adopted within 60 days
- Churn: 4% within first year
- Expansion: 25% upgrade to higher tier
- NRR: 110%

Group C: TTV 120 days (slow onboarding)
- Adoption: 50% of features adopted within 120 days
- Churn: 8% within first year
- Expansion: 15% upgrade to higher tier
- NRR: 100%

Difference between Group A and C:
- Churn: 2% vs 8% (4x difference)
- Expansion: 40% vs 15% (2.7x difference)
- NRR: 125% vs 100% (25% difference)

Revenue impact (£1M ACV per customer):
- Group A: £100M ARR × 125% NRR = £125M value
- Group C: £100M ARR × 100% NRR = £100M value
- Difference: £25M annually from faster TTV

This is massive. TTV is high-leverage.

**Measuring TTV**

Definition: When customer achieves first value.

Value indicators:
- Technical: System live in production
- Functional: Customer can perform core use case
- Business: Customer sees measurable outcome (revenue, efficiency, cost savings)

Example SaaS company (analytics platform):

TTV checkpoint: "First dashboard with real customer data"

Milestone timeline:
- Day 1: Kickoff meeting (understand customer goals)
- Day 5: Data integration complete (customer data flowing to platform)
- Day 15: First dashboard configured
- Day 20: First dashboard shows customer their metrics
- Day 25: Customer understands the insights

TTV: 25 days (when customer understands insights)

But could also measure:
- Technical TTV: Day 5 (system live)
- Functional TTV: Day 15 (first dashboard)
- Business TTV: Day 25 (insights understood)

Choose one and track consistently.

**Onboarding Phases**

Phase 1: Pre-Implementation (Days 1-5)

Activities:
- Kickoff meeting (align on goals, timeline, success criteria)
- Technical setup (access provisioned, environments created)
- Team alignment (customer identifies key users, team on our side assigned)

Deliverable: Implementation plan (activities, timeline, owners)

Phase 2: Configuration and Data (Days 5-40)

Activities:
- Data migration (extract customer data, cleanse, load to platform)
- Configuration (set up customer's specific workflows, rules, settings)
- Integration (connect to customer's other systems)
- Customization (if needed, build custom features)

Deliverable: System configured, data loaded, ready for testing

Phase 3: Testing and Training (Days 40-55)

Activities:
- User acceptance testing (customer tests scenarios)
- Training (customer team learns system)
- Documentation (how-to guides, best practices)
- Issue resolution (fix bugs, refine configuration)

Deliverable: Customer team trained, ready for go-live

Phase 4: Go-Live (Days 55-60)

Activities:
- Cut-over (switch from old system to new)
- Monitoring (watch for issues first week)
- Support (dedicated support during cut-over)

Deliverable: System live in production, customer using live data

Phase 5: Success Verification (Days 60-80)

Activities:
- Usage monitoring (is customer using the system?)
- Impact measurement (are they seeing the value we promised?)
- Optimization (refine configuration based on usage patterns)
- Expansion planning (what features come next?)

Deliverable: Documented value achievement, expansion roadmap

**Improving TTV**

Lever 1: Pre-built Templates and Configurations

Instead of building from scratch:
- Create industry-specific templates (retail, SaaS, manufacturing)
- Pre-built dashboards for common use cases
- Configuration library (copy from similar customers)

Impact: Compress Phase 2 from 35 days to 10 days

Lever 2: Data Migration Automation

Instead of manual data loading:
- Automated data connectors (APIs to customer systems)
- Bulk data import tools
- Data validation and cleansing automation

Impact: Compress data migration from 10 days to 2 days

Lever 3: Self-Service Training and Documentation

Instead of relying on training sessions:
- In-app guided tours (learn as you use)
- Video tutorials (quick reference)
- Knowledge base (searchable documentation)
- Community forums (peer support)

Impact: Reduce training time, improve adoption

Lever 4: Parallel Execution

Instead of waterfall (phase 1 → 2 → 3):
- Start Phase 2 while Phase 1 finishing
- Start Phase 3 while Phase 2 in progress
- Have team ready before config done

Impact: Compress timeline 30%

Lever 5: Product Onboarding

Instead of external team handling onboarding:
- Product guides (in-product, first-time user experience)
- Interactive tours (teach features as customer discovers)
- Smart defaults (system suggests right settings)

Impact: Self-serve customers can get value in days, not weeks

**Onboarding Economics**

Cost analysis:

Phase 1: Pre-implementation
- Cost: £2K (manager time)

Phase 2: Configuration and data
- Cost: £8K (engineer + consultant time)
- Can compress by 60% with templates and automation

Phase 3: Training
- Cost: £4K (trainer time)
- Can reduce by 50% with self-service

Phase 4: Go-live
- Cost: £3K (support, monitoring)

Phase 5: Success verification
- Cost: £2K (CSM time)

Total cost: £19K per customer

Example economics:

Customer ACV: £100K
Onboarding cost: £19K (19% of ACV)
Acceptable margin: <25% of ACV (£25K)
Profitable margin: Present

But for £20K ACV customers:
- Onboarding cost: £19K (95% of ACV)
- Not economically viable for 1-year customer
- Need 3+ year contract to justify

This is why enterprise sales focus on larger deals (justifies high onboarding cost).

**Onboarding Metrics Dashboard**

Track monthly:

| Metric | Target | Actual | Trend |
|--------|--------|--------|--------|
| Avg TTV | 45 days | 48 days | ↑ (bad) |
| % on-time go-live | 90% | 85% | ↓ |
| Onboarding cost/customer | £15K | £19K | ↑ |
| Feature adoption at 30d | 80% | 72% | ↓ |
| Customer satisfaction with onboarding | 4.5/5 | 4.0/5 | ↓ |

Watch for trends:
- If TTV increasing: Something slowing process (need to diagnose)
- If adoption low: Training ineffective (need better materials)
- If cost increasing: Team growing too fast (or scope creep)

**Common Onboarding Mistakes**

Mistake 1: Customization hell
- Problem: Every customer gets custom configuration, custom development
- Result: TTV 120+ days, cost £30K+ per customer
- Solution: Limit customization to 20% of customers, use templates for 80%

Mistake 2: Waiting for customer engagement
- Problem: Waiting for customer to provide data, make decisions
- Result: Project stalls, TTV extends 2-3x
- Solution: Set clear customer responsibilities, weekly check-ins, escalate blocks

Mistake 3: No clear success criteria
- Problem: Don't know when customer "has value"
- Result: Onboarding drags on indefinitely
- Solution: Define value criteria upfront (must be in kickoff)

Mistake 4: Insufficient training
- Problem: Train once, customer forgets, struggles post-go-live
- Result: Low adoption, churn within 6 months
- Solution: Ongoing training, in-app guidance, knowledge base, community

Mistake 5: No post-go-live support
- Problem: Handoff to support team without context
- Result: Customer issues unresolved, frustration
- Solution: Dedicated CSM for first 90 days post-go-live
`
      }
    ],
    relatedSlugs: [
      "customer-success-metrics-health-scoring",
      "net-revenue-retention-nrr-mastery",
      "churn-analysis-retention-improvement",
      "customer-lifetime-value-calculation",
      "product-roadmap-planning-prioritization"
    ],
    faq: [
      {
        q: "What's a good time-to-value target?",
        a: "30-45 days for SMB, 60-90 days for mid-market, 90-180 days for enterprise. Faster TTV = lower churn, higher expansion. Every 10 days faster = 3-5% churn reduction."
      },
      {
        q: "How do I measure time-to-value?",
        a: "Define value criteria in kickoff (e.g., 'first dashboard with live data'). Track days from signature to value achieved. Measure separately by customer segment and cohort."
      },
      {
        q: "What's the biggest TTV improvement opportunity?",
        a: "Templates and automation. Pre-built configurations and automated data migration can cut TTV 40-50%. Second is self-service training (reduce trainer time 50%)."
      },
      {
        q: "How much should onboarding cost?",
        a: "10-20% of ACV is typical. £100K ACV = £10-20K onboarding. Lower-ACV customers (£10-20K) may not justify £15K onboarding (need longer contracts)."
      }
    ],
    videoUrl: ""
  }
];

export default batch116Articles;
