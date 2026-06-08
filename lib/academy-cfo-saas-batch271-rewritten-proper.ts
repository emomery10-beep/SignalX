import { AcademyArticle } from "@/types/academy";

export const batch271Articles: AcademyArticle[] = [
  {
    slug: "economic-moats-and-competitive-advantages",
    title: "Economic Moats and Competitive Advantages: Building Defensibility",
    description: "Master competitive advantage. Build moats, defend market position, create barriers to entry.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["moats", "competitive advantage", "defensibility", "barriers to entry", "network effects", "switching costs", "brand"],
    keyTakeaways: [
      "Types of moats: Network effects (more customers = more value, hard to leave), switching costs (expensive to change, locked in), brand (trusted, premium pricing), data (accumulated data = competitive edge), technology (patents, proprietary), scale (cost advantages). Example: Salesforce (switching costs: migrating 10K+ records expensive), Slack (network effects: whole team on platform), Amazon (scale: logistics, AWS infrastructure). Strongest moat: Combination (Salesforce = switching + network + scale). Build moat from day 1 (hard to add later): Choose one, deepen over time. Cost: Embedded in product (not separate cost). Benefit: Command premium pricing, lower churn, defensible business.",
      "Switching costs: Lock customers in (expensive/time-consuming to leave). Tactics: (1) Data lock-in (customer data deeply integrated, hard to export), (2) Integration (connect to many other tools, leaving breaks workflow), (3) Customization (product customized to company, generic competitors don't fit), (4) Training (employees trained, retraining costly). Cost to build: Moderate (product design choices). Impact: Churn -1-2% (customers stay despite better alternatives), pricing power +10-20% (can raise prices, customers won't leave). Example: HubSpot has high switching costs (all customer data, workflows, customizations intertwined).",
      "Network effects: More valuable with more users (Slack, Salesforce). Types: (1) Same-side (more users = more value to all users), (2) Cross-side (more of type A = more value to type B, like Uber drivers/riders). Build: Start small (hard to get first users), then accelerates (viral growth). Cost: Substantial upfront (need to subsidize early users to reach critical mass). Payoff: Once achieved, nearly unbeatable (competitor can't easily outcompete). Example: Slack network effects are indirect (your whole team on Slack = valuable, other platforms not worth switching to for features alone)."
    ],
    content: [
      {
        heading: "Building Sustainable Competitive Moats",
        body: `Creating defensible market advantages.

**Types of economic moats**

| Moat type | How it works | Example | Strength |
|---|---|---|---|
| Network effects | More users = more valuable | Slack, Facebook | Very strong |
| Switching costs | Expensive to leave | Salesforce, Oracle | Very strong |
| Brand | Trusted, premium pricing | Apple, Nike | Strong |
| Scale | Cost advantages | Amazon, Walmart | Strong |
| Data | Accumulated advantage | Netflix, Google | Medium-strong |
| Technology | Patents, proprietary tech | Pharma, Tesla | Medium |

Combination moats (strongest):
- Salesforce: Switching costs + network effects + brand + scale
- Slack: Network effects + switching costs + brand
- Netflix: Data + technology + scale + network effects

**Building switching costs**

Tactics:

1. Data lock-in:
   - Store customer data (hard to export)
   - Custom fields/records (unique to your system)
   - Cost to leave: Re-entering data (weeks of work, £10K+ cost)

2. Integration web:
   - Connect to 100+ third-party tools
   - If customer leaves, lose all integrations
   - Cost to leave: Rebuilding integration (expensive, time-consuming)

3. Customization:
   - Allow deep product customization
   - Competitor's generic product won't fit
   - Cost to leave: Reconfiguring competitor product (weeks)

4. Training:
   - Employees trained on your product
   - Retraining on competitor (cost + time)
   - Organizational muscle memory (how we work)

Example impact:
- New customer evaluation: Look at competitor (might be better)
- Existing customer decision: Too expensive to switch (lock-in)
- Churn: 3% baseline → 1% with high switching costs (2% improvement)
- Pricing power: Raise 10% → lose 1-2% to churn (acceptable, net revenue increase)

**Network effects strategy**

Same-side network effects:
- Example: Slack (more team members = more channels, more value)
- Growth: Start with internal team (critical mass), then expand
- Barrier: Hard for new competitor (need critical mass to compete)

Cross-side network effects:
- Example: Uber (more drivers = less wait, more riders; more riders = more surge, more drivers)
- Bootstrap: Subsidize one side (Uber gave free rides initially to attract riders, then drivers)
- Timing: Critical mass needed (hard to get there, expensive to subsidize)

Achieving critical mass:
- Phase 1: Manual growth (viral invitations, founder recruiting)
- Phase 2: Inflection (word-of-mouth, network effects kick in)
- Phase 3: Viral (exponential growth, hard to acquire new competitors)

Cost to build:
- Subsidize early users: £100K-1M depending on market
- Time: 6-18 months to critical mass
- Payoff: Once achieved, nearly unbeatable moat

**Measuring moat strength**

Metrics:
- Churn: Lower churn = stronger moat (customers stay despite alternatives)
- Pricing power: Higher pricing = stronger moat (customers pay premium)
- Win rate: Higher win rate = stronger moat (displace competitors easier)
- NPS: Higher NPS = stronger moat (emotional attachment)

Example moat strengths:
| Company | Churn | NPS | Pricing | Moat assessment |
|---|---|---|---|---|
| Salesforce | <2% | 50+ | Premium (10x+ vs Pipedrive) | Very strong |
| HubSpot | 2-3% | 40+ | Premium (3-5x vs alternatives) | Strong |
| Slack | <3% | 60+ | Premium (2-3x vs Discord) | Very strong |
| Generic SaaS | 4-5% | 30+ | Commodity | Weak |

Strong moat (churn <2%, NPS 50+, pricing power 3-5x) = defensible business

`
      }
    ],
    relatedSlugs: ["competitive-intelligence-and-market-monitoring", "pricing-strategy-and-price-optimization", "retention-and-churn-reduction-mechanics"],
    faq: [
      { q: "What moat should I build?", a: "Start with one (switching costs easiest, network effects powerful but hard). Build into product design (not bolt-on). Examples: Switching costs (data lock-in, integration, customization), network effects (more users = valuable), brand (trust, positioning). Combination strongest (e.g., Salesforce = switching + network + scale)." },
      { q: "How do I create switching costs?", a: "Data lock-in (hard to export), integrations (many third-party connections), customization (deep personalization), training (employees trained). Cost: Moderate (product design). Payoff: 1-2% churn reduction, pricing power increase." },
      { q: "How do I measure moat strength?", a: "Churn <2% (customers stay), NPS 50+ (loyal), pricing power 3-5x vs alternatives (premium pricing possible). Combination: Very strong moat. Single metric <benchmark: Weak moat (improve)." }
    ],
    videoUrl: ""
  }
];

export default batch271Articles;