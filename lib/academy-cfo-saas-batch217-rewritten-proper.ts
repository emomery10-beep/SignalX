import { AcademyArticle } from "@/types/academy";

export const batch217Articles: AcademyArticle[] = [
  {
    slug: "m-and-a-integration-and-acquisition-strategy",
    title: "M&A Integration and Acquisition Strategy: Growing Through Acquisition",
    description: "Master M&A. Acquire companies, integrate teams, and realize synergies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["M&A", "acquisition", "integration", "synergies", "post-acquisition", "deal strategy", "valuation", "acquires", "merger", "customer retention"],
    keyTakeaways: [
      "Acquisition thesis: Why acquire? (1) Technology (buy product to integrate), (2) Talent (buy team, product secondary), (3) Customers (buy revenue, CAC efficiency), (4) Market share (eliminate competitor). Synergy: What value created post-acquisition? Example: Acquire competitor (£5M revenue), integrate product → cross-sell to your base (£2M additional revenue), eliminate duplicate costs (£500K savings). Total synergy: £2.5M incremental (justifies premium). Valuation: 2-5x revenue (depending on growth, margins, strategic value). Example: £5M revenue × 3x multiple = £15M acquisition cost. If synergy £2.5M annually, payback 6 years (acceptable).",
      "Integration planning: 100-day plan (post-close). Day 1-30 (stabilize): Keep target company running, build integration team, communicate with employees/customers. Day 31-60 (consolidate): Merge sales/marketing, align product roadmaps, consolidate tools/systems. Day 61-100 (optimize): Cross-sell customers, eliminate duplicate costs, execute cultural integration. Risk: Customer churn (10-20% post-acquisition if not handled well), talent retention (top employees leave if unclear about role). Mitigation: Transparent communication, clear role definition, early wins (show value of acquisition).",
      "Execution risks: Most acquisitions underperform (70% miss synergy targets). Reasons: Integration costs higher than expected, talent leaves, customers churn faster. Mitigation: (1) Conservative synergy estimates (don't oversell), (2) Dedicated integration team (full-time), (3) Retention bonuses for key employees (lock in talent), (4) Early customer calls (reassure they're priorities), (5) Transparent integration plan (explain to teams). Cost: Integration £1-2M for £20M acquisition (10%) typical."
    ],
    content: [
      {
        heading: "Acquisition Strategy and Valuation",
        body: `Planning and executing acquisitions.

**Acquisition types**

Strategic acquisition (buy technology/product):
- Target: Company with product you want
- Price: 2-3x revenue (technology-focused, lower revenue)
- Goal: Integrate product into yours (platform expansion)
- Example: Acquire competitor £3M revenue, 2.5x = £7.5M. Integrate product, cross-sell to your customers (£2M new revenue). Payback: 4 years.

Talent acquisition:
- Target: Small team with specialized expertise
- Price: Low (team value), sometimes acqui-hires
- Goal: Hire team, may shut down target product
- Example: Acquire 5-person team specializing in AI (£1M salary / 5 = £200K per person, pay £1M all-in). Get talent for £200K per person (cheaper than recruiting + hiring cost).

Revenue acquisition:
- Target: Mature company, profitable, good margins
- Price: 3-5x revenue (profitable + recurring revenue stable)
- Goal: Customers + revenue
- Example: Acquire £5M recurring revenue at 4x = £20M. Upsell your products (£1-2M new revenue). Retain existing (£4M)

**Valuation multiples**

Typical SaaS multiples:
- Early stage (£<1M revenue, high growth): 5-10x revenue
- Growth stage (£1-10M, 40%+ growth): 3-5x
- Mature (£10M+, 20% growth): 1-2x

Adjusts for:
- Growth rate (higher growth = higher multiple)
- Margins (higher margin = higher multiple)
- Churn (lower churn = higher multiple)
- Strategic value (buyer sees synergy = higher price)

Example:
- Target: £5M revenue, 50% growth, 70% margin, 1% churn
- Multiple: 3x (growth stage) → base £15M
- Adjustment: +20% for strategic fit = £18M offer

**Synergy calculation**

Revenue synergies (cross-sell, upsell):
- Your customer base: 1000 customers
- Target product: 50% of your customers would buy
- Penetration: 500 × £5K ACV = £2.5M new revenue
- Conservative: 30% = £1.5M

Cost synergies (eliminate duplicate):
- Duplicate costs: Sales, marketing, ops, some engineering
- Current: Target company sales £1M, you save 50% = £500K
- Current: Target company marketing £500K, you save 40% = £200K
- Total: £700K savings

Total synergy: £1.5M new revenue + £700K saved = £2.2M incremental

Justification:
- Acquisition price: £15M
- Synergy: £2.2M annually
- Payback: 6.8 years (longer than ideal, but acceptable for strategic reasons)

`
      },
      {
        heading: "100-Day Integration Plan",
        body: `Post-acquisition integration framework.

**Days 1-30: Stabilize**

Communication:
- Day 1: All-hands meeting (CEO explains why acquisition, vision)
- Target employees: Clear role definition (staying, reporting structure)
- Customers: Email/call (assure of commitment, service continuity)
- Board/investors: Update on integration plan, timelines

Stabilization:
- Keep target operating as-is (no major changes day 1)
- Build integration team (dedicated project manager, cross-functional)
- Freeze major decisions (except integration priorities)
- Identify quick wins (easy cost savings, customer communications)

**Days 31-60: Consolidate**

Sales/marketing integration:
- Align product positioning (unified messaging)
- Cross-sell training (your team sells target products)
- Integrated sales team (eliminate redundancy, assign territories)

Product alignment:
- Target product roadmap → your platform (integration plan)
- Technical review (architecture, systems compatibility)
- Timeline: 6-12 months for full integration (plan)

Systems integration:
- CRM consolidation (merge customer data, align processes)
- Billing systems (if different, consolidate)
- Infrastructure (combine if beneficial)

**Days 61-100: Optimize**

Revenue initiatives:
- Launch cross-sell campaign (your customers → target product)
- Target customer upsell (new tiers, bundles)
- Measure: How many customers bought, what's revenue impact?

Cost elimination:
- Redundant teams consolidated
- Duplicate tools turned off
- Target: Realize 70% of planned cost savings

Talent retention:
- Bonuses paid (retention targets)
- Career path clarity (how target employees grow)
- Culture integration (working style, values)

**Risk mitigation**

Customer churn:
- Expected: 10-20% of target customers churn post-acquisition
- Mitigation: Executive calls within 30 days, listening tours, product roadmap transparency
- Measurement: Track retention weekly, escalate if >15%

Talent retention:
- Expected: 20-30% resignation (uncertainty)
- Mitigation: Retention bonuses (50% paid at close, 50% at 12 months), clear role definition, career path
- Cost: Retention bonuses 10-20% of salary (expected cost)

`
      }
    ],
    relatedSlugs: ["exit-planning-and-m-and-a-preparation", "organizational-structure-and-team-design", "risk-management-and-contingency-planning"],
    faq: [
      {
        q: "What multiple should I pay for an acquisition?",
        a: "Typical: 2-5x revenue (depends on growth, margins). High growth (50%+) = 4-5x. Mature (20% growth) = 1-2x. Calculate synergy: Cross-sell opportunity, cost savings. Price = base multiple + 20% strategic premium. Example: £5M revenue at 3x base (£15M) + 20% strategic (£3M) = £18M offer."
      },
      {
        q: "What are typical acquisition synergies?",
        a: "Revenue: Cross-sell to your customer base (most common, 20-50% penetration × £X ACV). Cost: Eliminate duplicate functions (sales, marketing, ops). Example: Buy £5M revenue company, cross-sell to 500 of your customers at £5K ACV = £2.5M new revenue. Cost savings (duplicate sales/marketing) = £500K. Total synergy: £3M (improves ROI)."
      },
      {
        q: "How long does integration take?",
        a: "100-day plan (post-close): Stabilize (30 days), consolidate (30 days), optimize (40 days). Full product integration: 6-12 months. Synergy realization: 1-2 years to realize all. Risk: Most acquisitions underperform (synergy targets often 30-40% missed). Mitigation: Conservative estimates, dedicated integration team, frequent communication."
      },
      {
        q: "What's the biggest risk in acquisitions?",
        a: "Customer churn: 10-20% of acquired customers leave. Mitigation: Executive calls within 30 days, clear product roadmap. Talent retention: 20-30% leave (uncertainty). Mitigation: Retention bonuses, clear roles. Synergy underperformance: Often miss 30-40% of targets. Mitigation: Conservative estimates, dedicated integration team."
      }
    ],
    videoUrl: ""
  }
];

export default batch217Articles;
