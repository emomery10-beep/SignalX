import { AcademyArticle } from "@/types/academy";

export const batch259Articles: AcademyArticle[] = [
  {
    slug: "infrastructure-scaling-and-technical-debt-management",
    title: "Infrastructure Scaling and Technical Debt Management: Building for Scale",
    description: "Master infrastructure. Plan scaling, manage technical debt, optimize costs.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["infrastructure", "technical debt", "scaling", "system architecture", "cloud costs", "performance", "engineering efficiency"],
    keyTakeaways: [
      "Infrastructure costs: Typical SaaS 5-10% of revenue. Example: £1M revenue, £50-100K infrastructure (hosting, databases, CDN, monitoring). Scale: Cost should be ~linear with customers (if not, architecture problem). Optimization: Right-size infrastructure (don't overprovision), use auto-scaling (scale with demand), negotiate cloud discounts (commitments at £500K+ annual = 10-30% discount). Example: AWS costs growing 20% YoY while revenue grows 50% = problem (costs should grow slower as scale). Action: Architecture review (find bottlenecks), optimize database queries, reduce unnecessary replication.",
      "Technical debt: Accumulated shortcuts (quick code, lack of testing, old libraries) = slow down future development. Cost: Each sprint, team spends 20-30% effort on bugs/debt (not features). ROI: 1 sprint refactoring = 3+ sprints new features after (recover time cost). Manage: Spend 20% of engineering time on debt/quality. Kill tech debt: Every major version bump, modernize (upgrade libraries, refactor core, improve tests). Example: Major version update costs £100K (dev time) but gains £500K/year velocity = 5-year payback excellent.",
      "Cloud cost optimization: Pick right cloud (AWS = general, Google = analytics, Azure = enterprise Microsoft). Right-size instances (don't use too large). Reserved instances (1-3 year commitment = 20-40% discount). Spot instances (temporary, 50-70% discount). Monitor: Cost per customer should decrease as scale (leverage). Example: 100 customers, £1K/customer infrastructure cost. 1000 customers, £50/customer cost (same workload, better leverage). Tool: Use AWS Cost Explorer, GCP Cost Analysis (find waste)."
    ],
    content: [
      {
        heading: "Managing Infrastructure and Technical Debt",
        body: `Scaling systems and managing quality.

**Infrastructure cost analysis**

Cost breakdown (typical SaaS):
| Component | % of revenue | £1M revenue |
|---|---|---|
| Compute (servers) | 3-4% | £30-40K |
| Database | 1-2% | £10-20K |
| Storage | 0.5-1% | £5-10K |
| CDN/networking | 0.5-1% | £5-10K |
| Monitoring/logging | 0.5-1% | £5-10K |
| Total | 5-10% | £50-100K |

Cost per customer:
- 100 customers, £100K cost = £1,000 per customer
- 1,000 customers, £150K cost = £150 per customer (same workload, better leverage)
- If cost per customer increasing = architecture problem (not scaling efficiently)

Optimization levers:
1. Right-size: Use appropriate instance size (not oversized)
2. Auto-scaling: Scale up/down with demand
3. Reserved instances: 1-3 year commitment = 20-40% discount
4. Spot instances: Interruptible = 50-70% discount (for non-critical workloads)
5. Regional arbitrage: Move non-critical workload to cheaper region

Example optimization:
- Current: On-demand instances (£100K/year)
- Reserved instances (3-year commitment): -30% = £70K/year
- Right-size (remove oversized): -10% = £63K/year
- Spot for non-critical (50-70% save): -£10K = £53K/year
- Total savings: £47K/year (47% reduction)

**Technical debt management**

What is technical debt:
- Shortcuts taken (quick implementation, not clean)
- Lack of tests (risky, hard to refactor)
- Outdated libraries (slow, vulnerable)
- Incomplete documentation (hard to onboard)

Cost of debt:
- Each sprint: 20-30% engineering time on bugs/debt (not features)
- New developers slow to contribute (poor code quality, docs)
- Refactors take longer (entangled code, poor architecture)
- Customers see bugs (poor quality perception)

Management strategy:
1. Allocate: 20% of engineering effort to debt/quality
2. Track: Backlog of known debt items (with impact)
3. Prioritize: Tackle high-impact debt first (biggest speed benefit)
4. Rotate: Quarterly debt sprint (focus on debt, minimal features)

ROI example:
- Debt: Refactor core module (2 weeks dev, £20K cost)
- Benefit: Future features 30% faster (save 1 week per feature)
- Over 12 months: 12 features = 12 weeks saved = £120K value
- ROI: £120K value / £20K cost = 6x (excellent)

**Version upgrade and modernization**

Major version upgrades (yearly or every 2 years):
- Upgrade libraries (security, performance)
- Refactor core (improve architecture)
- Improve tests (coverage, reliability)
- Update documentation (current state)

Cost: 1-2 sprints (£50-100K dev)
Benefit: 20-40% faster development, better reliability, modern stack
Payback: 3-6 months (from velocity improvement)

Do it when:
- Libraries 2+ major versions behind (security risk)
- Tech debt accumulating (slowing development)
- Hiring new engineers (need clean code for onboarding)
- Before scaling customers (need reliable, scalable code)

Example:
- Current state: Old framework (3 years old), 60% test coverage, poor docs
- Investment: Rewrite core (£100K), update framework (£30K), improve tests (£20K), docs (£10K) = £160K
- Benefit: Development speed +30% (save 1 week per sprint), reliability +50% (fewer bugs)
- Payback: 12 months from development savings + 6+ months from fewer production issues

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "risk-management-and-contingency-planning", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "What should my infrastructure costs be?", a: "5-10% of revenue (typical). Example: £1M revenue = £50-100K/year infrastructure. Track per customer: £1M revenue / 100 customers = £10K per customer spend. As scale: Cost per customer should decrease (better leverage). If increasing, architecture problem (not scaling efficiently)." },
      { q: "How do I reduce cloud costs?", a: "Right-size (use appropriate instances, not oversized). Reserved instances (1-3 year = 20-40% discount). Spot instances (interruptible = 50-70% discount). Monitor (use Cost Explorer, find waste). Target: 20-30% reduction possible (combined tactics)." },
      { q: "How much engineering time should I spend on technical debt?", a: "Allocate: 20% of engineering time. Benefit: Every 1 sprint on debt = 3+ sprints future velocity (recover and more). Do major upgrade: Every 1-2 years (framework update, refactoring, tests, docs). Cost: 1-2 sprints, Payback: 3-6 months from velocity improvement." }
    ],
    videoUrl: ""
  }
];

export default batch259Articles;