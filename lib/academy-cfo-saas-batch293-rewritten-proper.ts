import { AcademyArticle } from "@/types/academy";

export const batch293Articles: AcademyArticle[] = [
  {
    slug: "revenue-per-employee-and-productivity-metrics",
    title: "Revenue Per Employee and Productivity Metrics: Team Efficiency Measures",
    description: "Master productivity metrics. Measure team efficiency, identify optimization areas.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["revenue per employee", "productivity metrics", "team efficiency", "output per person", "organizational efficiency"],
    keyTakeaways: [
      "Revenue per employee (RPE): Annual revenue / headcount. Benchmark: £500K-£1M per employee (depends on stage). Example: £5M revenue, 10 people = £500K RPE. Insight: More revenue per employee = more efficient (lower overhead). Growth: RPE should improve as scale (less hiring to double revenue). Cost: Easy calculation. Use: Benchmark against competitors, track improvement over time.",
      "Improving RPE: (1) Increase revenue (grow ARR), (2) Decrease headcount (optimize, eliminate low-value roles), (3) Increase productivity (tools, training, automation). Example: £500K RPE, goal £750K. Options: Grow revenue 50% (+£2.5M), reduce headcount 25% (save overhead), or combination. Cost: Varies. Benefit: More profit, more attractive to investors.",
      "Role-specific metrics: Engineering = Features shipped/engineer, Sales = ARR per AE, Support = Tickets handled per rep, Marketing = CAC efficiency per marketer. Track by department (accountability). Example: Engineering team: 3 engineers, 2 major features/month = 0.67 features/engineer. Goal: Improve tools, eliminate meetings → 1.0 features/engineer. Benefit: Visibility into team performance, identify bottlenecks."
    ],
    content: [
      {
        heading: "Measuring and Improving Team Productivity",
        body: `Analyzing revenue efficiency per employee.

**Revenue per employee fundamentals**

Definition and calculation:
- RPE = Annual revenue / Full-time equivalent employees
- Example: £5M revenue, 10 FTE = £500K RPE

Benchmarks by stage:
| Stage | Company Size | Typical RPE | Notes |
|---|---|---|---|
| Early (seed) | 1-10 | £200-400K | Lower (pre-revenue or early) |
| Growth | 10-50 | £400-800K | Scaling, improving |
| Scaling | 50-200 | £700K-£1.2M | Mature, efficient |
| Mature | 200+ | £800K-£1.5M+ | Optimized, high efficiency |

SaaS-specific:
- High gross margin (70-80%) → higher RPE sustainable
- Software licensing → high RPE (low COGS)
- Enterprise SaaS → higher RPE (fewer, larger customers)
- SMB SaaS → lower RPE (more support, lower prices)

Tracking improvement:
| Year | Revenue | Headcount | RPE | Growth |
|---|---|---|---|---|
| 2022 | £2M | 10 | £200K | - |
| 2023 | £4M | 15 | £267K | +33% |
| 2024 | £8M | 22 | £364K | +36% |
| 2025 | £15M | 32 | £469K | +29% |

Healthy trend: RPE improving each year (more revenue per person = scaling efficiently)

**Levers to improve RPE**

Lever 1: Increase revenue
- Grow ARR 50% (same team) → RPE improves 50%
- Cost: Sales/marketing spend, product investment
- Timeline: 12-24 months
- Example: RPE £500K → £750K

Lever 2: Reduce headcount (optimization)
- Keep revenue, reduce team 20% → RPE improves 25%
- Cost: Layoff impact, potential service issues
- Timeline: Immediate (but risks churn)
- Example: Same, eliminate redundancy

Lever 3: Increase productivity (same team, more output)
- Same team delivers 2x → RPE improves 100%
- Cost: Tools, training, automation (£50-200K)
- Timeline: 6-12 months
- Example: RPE £500K → £1M

Combination approach (most effective):
- Grow revenue 30% (£500K → £650K)
- Reduce headcount 10% (optimization)
- Increase productivity 20% (tools)
- Net: RPE £500K → £793K (57% improvement)

**Department-specific productivity metrics**

Engineering:
- Metric: Features shipped per engineer per month
- Benchmark: 1-3 features/engineer (depends on feature size)
- Improvement:
  - Better tools: IDE, deployment, testing → 20-30% gain
  - Eliminate meetings: Async communication → 15-20% gain
  - Clear priorities: No context switching → 25% gain
  - Example: 0.5 → 0.75 features/engineer (50% improvement)

Sales:
- Metric: ARR per account executive
- Benchmark: £500K-£1.5M per AE (depends on ACV)
- Improvement:
  - Better leads: Higher quality → close rate + 10-15%
  - Sales tools: CRM, documents → 15% productivity
  - Coaching: Better mgmt → 10-20% improvement
  - Example: £500K → £650K per AE (30% improvement)

Customer success:
- Metric: Customers per CS rep
- Benchmark: 50-200 customers (depends on ACV)
- Improvement:
  - Automation: Self-service → 30-50% more customers
  - Playbooks: Repeatable → 20% efficiency
  - Tools: Better software → 15% gain
  - Example: 100 → 150 customers per rep (50% improvement)

Marketing:
- Metric: CAC per marketing dollar
- Benchmark: £1 CAC per £2-3 spend (efficient to inefficient)
- Improvement:
  - Optimization: A/B testing → 20-30% improvement
  - Channels: Move to efficient → 30-50% improvement
  - Tools: Better martech → 15% improvement
  - Example: £0.5 CAC per £1 spend → £0.35 CAC per £1 (30% improvement)

Operations:
- Metric: Cost per £1 revenue
- Benchmark: 20-35% (depends on stage)
- Improvement:
  - Automation: Reduce manual work → 10-20% savings
  - Outsourcing: Non-core → 15-30% savings
  - Example: 30% → 20% cost ratio (33% improvement)

**Organizational scaling dynamics**

Expected staffing at different revenue levels:
| Revenue | Efficient Headcount | RPE |
|---|---|---|
| £1M | 3-4 | £250-333K |
| £2M | 5-6 | £333-400K |
| £5M | 8-12 | £416-625K |
| £10M | 12-18 | £556-833K |
| £20M | 20-30 | £667-1M |
| £50M | 40-60 | £833K-1.25M |

Headcount additions as revenue grows:
- Each engineer: Adds 1 feature/month (£50K cost)
- Each AE: Adds £600K ARR (£100K cost)
- Each CS rep: Adds 100 customers (£60K cost)
- Support: Scales with customer base

Example hiring plan:
- Current: £5M, 8 people, £625K RPE
- Goal: £10M in 2 years, improve to £833K RPE
- Calculation: Need £10M / £833K = 12 people
- Hires: +4 people (from 8 to 12)
- Cost: 4 × £80K average = £320K overhead
- Revenue requirement: £320K new overhead support

Pitfall: Hiring too fast
- Hire 10 people, revenue doesn't grow → RPE crashes
- Example: £5M, hire 10 → 18 people, still £5M
- Result: RPE £625K → £278K (55% decline)
- Cost: Wasted £800K annually on excess headcount

**Monitoring and action**

Dashboard metrics:
| Metric | Current | Target | Status |
|---|---|---|---|
| RPE (company) | £500K | £600K | Below target |
| RPE (engineering) | £300K | £350K | Below target |
| Eng features/month | 6 | 8 | Below target |
| Sales ARR per AE | £500K | £600K | On target |
| CS customers per rep | 120 | 150 | Below target |

Monthly review:
- Total RPE: Improving or declining?
- Department RPE: Which department is lagging?
- Productivity trend: Per-person output improving?
- Headcount trend: Growing faster than revenue?

Quarterly decisions:
- If RPE improving: Continue strategy, maybe increase hires
- If RPE flat: Productivity not improving (investigate)
- If RPE declining: Hiring too fast (slow hiring, optimize)
- If RPE declining faster: Revenue declining (bigger problem)

Action triggers:
- RPE declining >10%: Urgent review (reduce headcount, boost revenue)
- Productivity metrics declining: Tool investment, training needed
- Cost per person increasing: Salary inflation, add higher-value roles
- Department lagging: Coach manager, add tools, reallocate

Investment in productivity:
- Engineering tools: £20-50K/year (IDE licenses, CI/CD, testing)
- Sales tools: £10-30K/year (CRM, calling, documents)
- CS tools: £20-40K/year (ticketing, knowledge base, automation)
- ROI: £50K investment → £200K+ in productivity gains (typical)

`
      }
    ],
    relatedSlugs: ["organizational-structure-and-team-design", "hiring-and-talent-acquisition-strategy", "metrics-dashboard-design-kpi-tracking", "employee-retention-and-turnover-analysis", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "What's a good revenue per employee?", a: "Depends on stage: Early (seed) £200-400K. Growth £400-800K. Scaling £700K-1.2M. Mature £800K-1.5M+. SaaS typically higher (70-80% margins). Benchmark against peers in same stage/market. Track: Should improve 10-20% annually (scaling efficiently)." },
      { q: "How do I calculate RPE for my company?", a: "RPE = Annual revenue / Full-time equivalents. Example: £5M revenue ÷ 10 people = £500K RPE. Track quarterly or annually (shows trend). Department-level: Division revenue by dept headcount (reveals where to optimize)." },
      { q: "How can I improve revenue per employee?", a: "Three levers: (1) Grow revenue 30% (same team), (2) Optimize headcount 10% (reduce waste), (3) Improve productivity (tools, training). Best: Combination (modest revenue growth + small headcount reduction + productivity tools = 30-50% RPE improvement)." }
    ],
    videoUrl: ""
  }
];

export default batch293Articles;