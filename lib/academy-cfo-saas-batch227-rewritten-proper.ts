import { AcademyArticle } from "@/types/academy";

export const batch227Articles: AcademyArticle[] = [
  {
    slug: "product-roadmap-planning-and-prioritization",
    title: "Product Roadmap Planning and Prioritization: Building the Right Features",
    description: "Master roadmap planning. Prioritize features, communicate strategy, balance customer needs with company goals.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["product roadmap", "prioritization", "feature planning", "roadmap communication", "product strategy", "feature prioritization", "quarterly planning", "backlog management"],
    keyTakeaways: [
      "Prioritization framework: Impact (churn reduction, NRR growth, CAC improvement) × Effort (dev cost, complexity). Matrix: High impact/low effort = ship immediately. High impact/high effort = plan multi-quarter. Low impact/low effort = ship if time. Low impact/high effort = deprioritize. Example: Feature requested by top 3 customers (save £500K combined = high impact). Dev cost 4 weeks (high effort). Rank: Important, plan for Q2. Avoid: Features requested by single customer (low impact) taking 8 weeks (high effort).",
      "Roadmap cadence: Quarterly planning (set strategy for Q+2, detailed planning for Q+1). Commitment: 60-70% roadmap to company strategy/OKRs. Flex pool: 20-30% urgent customer needs (churn, expansion, competitive threat). Innovation: 10% exploration (new ideas, bets). Execution: Ship 80% committed items (expect 20% slippage for bugs, learning). Communicate: Monthly updates (progress), quarterly reset (new priorities). Benefit: Predictability (customers/investors know direction), flexibility (respond to market), team alignment.",
      "Stakeholder management: Sales/CS input (customer feedback, churn drivers, expansion opportunities). Finance input (ROI impact, unit economics). Leadership input (strategy alignment, market position). Product owns final call (balance all inputs). Communication: Roadmap published quarterly (what, why, when), monthly updates (progress %), customer transparency (why certain features prioritized). Expectation setting: Roadmap = direction, not commitment (priorities shift with market). Transparency improves trust (customers understand trade-offs)."
    ],
    content: [
      {
        heading: "Roadmap Prioritization Framework",
        body: `Building a framework for consistent prioritization.

**Impact-Effort Matrix**

Axes:
- Impact: Churn reduction (%), NRR improvement, CAC reduction, customer expansion, competitive defense
- Effort: Dev weeks, complexity, dependencies, infrastructure changes

Quadrants:
- High impact, low effort: Ship ASAP (quick wins)
- High impact, high effort: Plan multi-quarter (strategic bets)
- Low impact, low effort: Ship if bandwidth (nice-to-have)
- Low impact, high effort: Deprioritize (opportunity cost too high)

Scoring example:
| Feature | Impact | Effort | Priority |
|---|---|---|---|
| Churn reduction feature (top 5 customers requesting) | 3% churn save = £50K ARR | 2 weeks | Ship Q1 |
| Compliance certification (customer requirement) | Unlock £200K ARR | 4 weeks | Ship Q1 |
| Nice UX improvement (1 customer) | 0.5% conversion | 3 weeks | Q3+ |
| Experimental new category | Unknown | 6 weeks | Innovation pool |

**Roadmap Allocation**

Typical quarterly roadmap:
- Strategic initiatives (OKRs): 60-70% capacity
- Customer commitments (churn/expansion): 20-30% capacity
- Innovation/exploration: 10% capacity

Example (20-week quarter):
- OKR 1 (grow NRR 5%): 8 weeks
- OKR 2 (reduce churn 1%): 6 weeks
- Urgent customer: 2 weeks
- Bug fixes/tech debt: 2 weeks
- Innovation sprint: 2 weeks

**Communication and Transparency**

Roadmap cadence:
- Quarterly: Strategy update (CEO/board level direction)
- Monthly: Progress update (tracking against plan)
- Customer: Shared roadmap (what customers can expect)

Roadmap template:
- Q1: Feature A (churn reduction), Feature B (expansion), Feature C (compliance)
- Q2: Feature A+ (improve), Feature D (competitive), Exploration

Communication principle:
- What: Which features, timeline
- Why: Impact (churn/NRR/CAC), customer feedback, strategic alignment
- Timeline: Soft (might shift), not commitment

Benefit:
- Customers see roadmap = feel heard
- Sales/CS can speak to direction = confidence
- Team aligned = no surprises
- Flexibility maintained (can shift if market changes)

`
      }
    ],
    relatedSlugs: ["data-driven-product-development", "customer-feedback-loops-and-product-iteration", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How should I prioritize features?", a: "Impact-Effort matrix: Impact (churn reduction, NRR, CAC, expansion) × Effort (dev weeks). Ship high impact/low effort immediately. Plan high impact/high effort over multiple quarters. Deprioritize low impact/high effort. Avoid single-customer features unless strategic." },
      { q: "What should my roadmap allocation be?", a: "Typical: 60-70% strategic (OKRs), 20-30% customer commitments (churn/expansion), 10% innovation. Adjust based on company stage: Early = 30% innovation, 70% OKRs. Mature = 70% core, 20% customer, 10% innovation." },
      { q: "How do I communicate roadmap to customers?", a: "Share quarterly (feature list, timing, why prioritized). Monthly updates (progress %). Be transparent: roadmap = direction (not commitment), priorities can shift. Benefit: Customers feel heard, sales confidence, team alignment." }
    ],
    videoUrl: ""
  }
];

export default batch227Articles;