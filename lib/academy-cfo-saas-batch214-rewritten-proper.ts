import { AcademyArticle } from "@/types/academy";

export const batch214Articles: AcademyArticle[] = [
  {
    slug: "infrastructure-scaling-and-technical-debt-management",
    title: "Infrastructure Scaling and Technical Debt Management: Balancing Speed and Quality",
    description: "Master infrastructure planning. Scale systems, manage technical debt, optimize costs.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["infrastructure", "scaling", "technical debt", "performance", "cost optimization", "architecture", "database", "deployment", "DevOps", "system design"],
    keyTakeaways: [
      "Technical debt: Shortcuts taken for speed (reduce code quality, skip tests, hack features). Cost: Compounds monthly (slower velocity, more bugs). Example: Skip refactoring, code becomes 2x slower = pay now (2 weeks refactor) or pay later (1 hour per sprint × 52 weeks = full engineer lost). Rule: Spend 20% of time on technical debt / refactoring (payback in 2-3 months). Track: Measure velocity (points/sprint), if declining, probably debt. Repay debt: Quarterly sprints dedicated to refactoring, testing, performance.",
      "Infrastructure costs (AWS typical): Compute £2-5K/mo per 100 customers (scales linearly), Database £1-2K (can scale sublinearly), Storage £0.1-0.5K (cheap). Total £3-7K/mo for 100 customers = £30-70 per customer annually (1-3% of £1K ACV, acceptable). Optimize: Cache (reduce DB queries), compression (reduce bandwidth), scheduled scaling (turn off non-prod at night). Save: 20-30% possible. Danger: Over-optimize early (waste time), scale when needed.",
      "Monitoring and on-call: Uptime SLA 99.9% = 43 minutes downtime/month acceptable. Monitor: Errors, latency, throughput. Alert: Automated (PagerDuty), escalation path (on-call rota). On-call rotation: Every engineer 1 week per month (on call). Burnout: Too many alerts (alert fatigue). Reduce: Only alert on real problems. Example: Incident cost £100K (revenue lost), on-call engineer cost £5K (salary for week on alert). ROI: Prevent 1 major outage per year = prevent £1M loss."
    ],
    content: [
      {
        heading: "Technical Debt and Code Quality",
        body: `Understanding and managing technical shortcuts.

**Debt definition and cost**

Technical debt:
- Taking shortcuts (code hacks, skipping tests) to ship faster
- Pays off now (faster release), costs later (slower future development)
- Compounds (harder to fix as code grows)

Example lifecycle:
- Week 1: Build feature with hack (saves 1 week)
- Week 4-8: Slow development (hacks slow team down, 10% velocity loss)
- Week 12: Refactor hack (takes 2 weeks to fix properly)
- Total cost: 2 weeks now, 10% × 8 weeks = 0.8 weeks later + 2 weeks refactor = 2.8 weeks (2x initial shortcut)

Decision: Build with shortcuts early (speed important), but schedule repayment quarterly

**Tracking velocity and code quality**

Velocity (points shipped per sprint):
- Week 1: 50 points
- Week 2-4: 50 points (consistent)
- Week 5-8: 40 points (declining, debt accumulating)
- Week 9: Refactor sprint (20 points, debt repayment)
- Week 10+: 50 points again (velocity recovered)

Code quality metrics:
- Test coverage: Target >80% (catch bugs)
- Bug escape rate: Bugs found in prod / total bugs (target <5%)
- Code review: All code reviewed (catch debt, knowledge sharing)

**Repayment strategy**

Allocate 20% of engineering time to debt/refactoring:
- 80% new features (customer value)
- 20% technical (infrastructure, refactoring, tests)

Quarterly refactoring sprints:
- Q1: Refactor module A (improve performance)
- Q2: Refactor module B (reduce complexity)
- Q3: Improve test coverage (reduce bugs)
- Q4: Performance optimization (reduce infrastructure costs)

Example ROI:
- Refactor (2 weeks cost)
- Benefit: Velocity improves 10% = 0.5 engineer×52 weeks = 26 weeks saved annually
- ROI: 2 weeks cost, 26 weeks benefit = 13x (excellent)

`
      },
      {
        heading: "Infrastructure Costs and Scaling",
        body: `Managing and optimizing infrastructure spending.

**Cost breakdown (AWS typical)**

| Component | Cost/month | Variable | Notes |
|---|---|---|---|
| Compute (EC2, containers) | £2-5K | Per usage | Biggest cost, scales with traffic |
| Database (RDS, DynamoDB) | £1-2K | Per data | Grows with customer data |
| Storage (S3, backups) | £0.1-0.5K | Per GB | Very cheap, grow large |
| Networking | £0.2-0.5K | Per TB | Usually small |
| **Total** | **£3-8K/mo** | | Per 100 customers |

Per-customer cost: £30-80 annually (1-3% of £1K ACV, acceptable)

**Scaling considerations**

As customers grow:
- Q1 (100 customers): £3-5K/mo (simple single instance)
- Q4 (500 customers): £15-25K/mo (multiple instances, more complexity)
- Year 2 (1000 customers): £30-50K/mo (distributed, caching, optimization)

Cost can grow faster than linear if:
- Inefficient code (N+1 queries, bad caching)
- Over-provisioning (too much capacity)
- Lack of monitoring (unused resources)

Mitigation:
- Design for scale early (caching, async jobs, database optimization)
- Monitor costs (cloud spend dashboard, alerts if spikes)
- Regular optimization (quarterly performance reviews)

**Cost optimization techniques**

1. Caching (reduce database queries):
   - Add Redis cache (£500/mo)
   - Reduces database load 50% (saves £1K/mo in compute)
   - ROI: Save 2x cost

2. Compression (reduce bandwidth):
   - Gzip responses (free)
   - Reduce data transfer 80% (saves £200/mo)
   - ROI: Free, but saves money

3. Reserved instances (commit to capacity):
   - On-demand: £1 per hour
   - Reserved (1-year): £0.60 per hour (40% discount)
   - Cost: £5K upfront, save £3K annually
   - Risk: Over-commit (waste money if scale slows)

4. Scheduled scaling:
   - Turn off non-production (staging, dev) at night
   - Save 40-50% on non-prod costs
   - Example: Non-prod £1K/mo → £500/mo (save £500)

Total optimizations: Can save 20-30% on infrastructure (£5-10K/mo annually for growing company)

`
      }
    ],
    relatedSlugs: ["financial-forecasting-modeling", "burn-rate-and-cash-runway-analysis", "gross-margin-expansion-and-cost-optimization"],
    faq: [
      {
        q: "How much technical debt is acceptable?",
        a: "Allocate 20% of engineering time to debt/refactoring (80% new features). Velocity should stay constant (if declining, debt accumulating). Quarterly debt sprints (1-2 weeks per quarter). Monitor: Test coverage >80%, bug escape rate <5%. ROI: Refactor 2 weeks, save 26 weeks annually = 13x payback."
      },
      {
        q: "How much does infrastructure cost per customer?",
        a: "Typical: £30-80 annually (1-3% of £1K ACV). Breakdown: Compute £2-5K, database £1-2K, storage £0.1-0.5K per 100 customers. Scale: Costs grow sublinearly (efficiency improves with scale). Optimize: Caching saves 20-30%, compressed data saves 10-20%. Budget: Include in COGS calculation."
      },
      {
        q: "Should I optimize infrastructure costs early?",
        a: "Not too early: If <1K customers, optimization wastes time (overhead). After: 1K customers, costs become significant (£3-5K/mo). Focus: Code quality first (technical debt), then optimize infrastructure. Example: Caching project (£500/mo cost, saves £1K/mo) = 2x ROI."
      },
      {
        q: "How do I handle on-call and prevent outages?",
        a: "Uptime SLA: 99.9% = 43 min downtime/month acceptable. Monitoring: Track errors, latency, throughput. On-call: Rotate engineers (1 week per month). Alert: Only real problems (prevent alert fatigue). ROI: Prevent major outage (£100K+ cost) = on-call cost (£5K/week) is cheap insurance."
      }
    ],
    videoUrl: ""
  }
];

export default batch214Articles;
