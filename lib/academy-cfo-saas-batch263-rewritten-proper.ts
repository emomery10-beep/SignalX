import { AcademyArticle } from "@/types/academy";

export const batch263Articles: AcademyArticle[] = [
  {
    slug: "mna-integration-and-acquisition-strategy",
    title: "M&A Integration and Acquisition Strategy: Buying and Scaling",
    description: "Master M&A. Identify acquisition targets, integrate successfully, create value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["M&A", "acquisition", "integration", "due diligence", "acquisition strategy", "post-acquisition", "integration plan"],
    keyTakeaways: [
      "Acquisition rationale: Buy for revenue (add £X ARR fast), technology (buy roadmap), team (get talent), market share (eliminate competitor), capability (product expansion). Typical SaaS acquisition: Buy £5-20M ARR company at 3-5x multiple (£15-100M cost). ROI: If acquire £10M ARR company at 3x = £30M, integrate successfully (20% churn post-acquisition) = keep £8M = cost £30M for £8M = 30% premium acceptable (vs organic growth). Due diligence: 4-8 weeks (financials, customers, product, team). Cost: Lawyers, accountants (£100-300K). Integration: 3-6 months (product, team, customers). Risk: Cultural mismatch (50%+ acquisitions fail on integration, not deal).",
      "Target profile: Early stage (£2-5M ARR, founder burnout, limited growth runway). High growth (£5-20M ARR, great metrics, want exit). Strategic fit (complementary product, same customers, adjacent market). Culture fit (shared values, team stays). Due diligence: Revenue (is it real?), customers (churn, concentration), product (tech debt?), team (key people?). Walk away if: >30% customer churn expected, tech debt too high (years to fix), key people leaving, culture misaligned.",
      "Integration 100-day plan: Day 1-30 (stabilization: keep customers, assess team/product). Day 30-60 (integration (combine operations, duplicate functions, technical integration). Day 60-100 (acceleration: leverage combined company, drive growth). Success metrics: Customer retention >85%, team retention >90%, synergies realized (cost saves or revenue growth). Typical post-acquisition: 10-20% ARR churn (normal if acquired company was struggling), 30-50% synergies captured (cost saves, revenue expansion). Cost: Integration effort (CFO, product, ops time 100+ hours). Benefit: ARR growth (accelerate vs organic), market position (eliminate competitor), capability (access to product/team)."
    ],
    content: [
      {
        heading: "Acquisition Strategy and Integration",
        body: `Buying and integrating companies.

**Acquisition rationale and targets**

Why acquire:
1. Revenue (add ARR fast): Buy £5M ARR company = 5-year organic equivalent
2. Technology (buy roadmap): Acquire smaller product, integrate into platform
3. Team (get talent): Acquire engineering team, keep top talent
4. Market share (competitive): Buy competitor, consolidate market
5. Capability (expand offering): Buy complementary product for product expansion

Target profile:
| Profile | Why acquire | Price | Risk |
|---|---|---|---|
| Early stage (£2-5M) | Growth stalled, team tired | 1-2x revenue (£2-10M) | Churn risk, integration hard |
| Growth (£5-20M) | Great metrics, founder wants exit | 3-5x revenue (£15-100M) | Expensive, integration complex |
| Struggling (£2-5M) | Buy for technology, not revenue | 0.5-1x revenue (£1-5M) | Negative revenue (churn), cultural issues |
| Niche leader (£1-2M) | Market leader in small vertical | 2-3x revenue (£2-6M) | Small revenue, market risk |

Due diligence (4-8 weeks):
- Financial: Revenue real? (check contracts, customers paying?), growth sustainable?
- Customer: Churn rate? top customer %, NRR?, concentration risk?
- Product: Technical debt? Scalable? Moat? (hard to copy)
- Team: Key people? Will they stay? Culture fit?
- Legal: Litigation? IP clear? Contracts assignable?

Red flags (walk away):
- Customer churn >30% expected (losing revenue on day 1)
- Key people leaving (loss of core capability)
- Technical debt severe (years to fix)
- Culture incompatible (team won't integrate)
- Customer concentration >50% (risk if customer leaves)

**Acquisition valuation**

Multiples approach:
- SaaS growth companies: 3-5x revenue (example: £10M ARR = £30-50M price)
- Declining/stalling: 1-2x revenue (recovering, discount)
- High growth (>50%): 5-7x revenue (premium for growth)

Formula: Valuation = Annual recurring revenue × Multiple

Example:
- Target: £10M ARR, 40% growth, 2% churn
- Market comparable: £10M ARR SaaS companies sell for 3-4x = £30-40M valuation
- Offer: £35M (3.5x middle estimate)
- Payment: 50% cash (£17.5M), 50% stock (£17.5M earn-out or restricted stock)

Negotiation:
- Founders want: High price, low earnout (immediate return)
- Buyer wants: Low price, high earnout (performance-based, recover if churn)
- Middle ground: 50% cash, 50% earnout tied to retention/growth

**100-day integration plan**

Days 1-30 (Stabilization):
- Customer comms: Announce acquisition (positive), reassure (will support)
- Keep team: Offer retention bonuses (key people stay through integration)
- Assess: Product, team, financial, customer (understand what you bought)
- No changes: Minimize disruption, "steady as she goes"

Days 30-60 (Integration):
- Consolidate duplicates: Combine finance, ops, duplicate functions
- Technical integration: Merge code bases, consolidate infrastructure
- Team decisions: Who stays, who goes, integration roles
- Customer migration: Move to consolidated platform (if applicable)

Days 60-100 (Acceleration):
- Revenue expansion: Cross-sell (your customers to their product)
- Cost synergies: Eliminate duplicate spend (one CFO, not two)
- Product roadmap: Combined vision for both products
- Retention focus: Ensure customers happy, churn minimal

Success metrics:
| Metric | Target | Typical |
|---|---|---|
| Customer retention | >90% | 85-95% |
| Team retention | >90% | 85-95% |
| Synergies captured | 50%+ | 30-50% |
| Revenue growth | +20% | +10-20% |
| Time to profitability | <12 months | 6-18 months |

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "organizational-structure-and-team-design", "strategic-planning-and-quarterly-goal-setting"],
    faq: [
      { q: "When should I acquire a company?", a: "When: Organic growth plateau, need technology/team/market share, target is available at good price. Target: £2-20M ARR, growth company (metrics matter), strategic fit (product/customer overlap). Price: 2-5x revenue (varies by growth, metrics). Avoid: Acquiring to fix churn (own problem first), distressed companies (integration risk)." },
      { q: "How much should I pay?", a: "Formula: Annual recurring revenue × Multiple. Multiple: 2-3x (struggling/slow growth), 3-5x (healthy growth), 5-7x (high growth >50%). Payment: Mix of cash + earnout (50/50 typical). Earnout: Tied to customer retention/growth (protects buyer). Negotiate: Start low, go to middle." },
      { q: "How do I integrate successfully?", a: "100-day plan: Days 1-30 (stabilize, keep customers/team), Days 30-60 (consolidate duplicates, integrate), Days 60-100 (accelerate, realize synergies). Focus: Customer retention (>85%), team retention (>90%), cost synergies, revenue expansion. Typical: 10-20% customer churn (expected if distressed), 30-50% synergies (cost saves or revenue growth)." }
    ],
    videoUrl: ""
  }
];

export default batch263Articles;