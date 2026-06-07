import { AcademyArticle } from "@/types/academy";

export const batch390Articles: AcademyArticle[] = [
  {
    slug: "saas-multi-product-strategy-and-economics",
    title: "Multi-Product Strategy and Economics: Expanding the SaaS Product Portfolio",
    description: "Master multi-product economics. Evaluate build vs buy, manage product P&Ls, and cross-sell effectively.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["multi-product", "product portfolio", "cross-sell", "build vs buy", "product P&L"],
    keyTakeaways: [
      "Multi-product economics: Adding a second product increases ACV by 30-50% and reduces churn by 25-40%. Example: Single product customers: £12K ACV, 12% annual churn. Two-product customers: £18K ACV (+50%), 7% annual churn (-42%). Three-product customers: £24K ACV (+100%), 4% annual churn (-67%). Each additional product increases switching costs and deepens relationships. Impact on NRR: Single-product NRR 105%, multi-product NRR 125%+.",
      "Build vs buy vs partner: Build: Full control, but 12-24 months and £500K-2M+ investment. Best when: Core to strategy, unique differentiation. Buy (acquire): Faster (3-6 months integration), but £5-50M+ acquisition cost. Best when: Proven product exists, speed matters. Partner: Lowest cost (integration only), but less control. Best when: Adjacent capability, not core to strategy. Decision framework: Is it core to our strategy? (Yes → Build/Buy). Does a good product exist? (Yes → Buy/Partner). Do we need it fast? (Yes → Buy).",
      "Product P&L management: Each product should have its own P&L. Track: Revenue, COGS, gross margin, allocated R&D, allocated S&M, contribution margin. Shared costs allocated by revenue %, headcount %, or usage. Example: Product A: £3M revenue, 82% gross margin, 15% R&D allocation, 12% S&M = 55% contribution margin. Product B: £1M revenue, 70% gross margin, 25% R&D (heavy investment phase), 20% S&M = 25% contribution margin. Product B is investing for growth — acceptable if improving."
    ],
    content: [
      {
        heading: "Building and Managing a Multi-Product SaaS Strategy",
        body: `Expanding the product portfolio to grow revenue and reduce churn.

**The multi-product advantage**

Why multi-product matters:

Revenue growth:
- Single product has a ceiling (TAM limitation)
- Second product opens new revenue stream
- Cross-sell to existing customers (low CAC)
- Example: £5M ARR single product, add second = £7M within 18 months

Retention impact:

| Products used | Annual churn | NRR | LTV multiple |
|---|---|---|---|
| 1 product | 12% | 105% | 1x |
| 2 products | 7% | 118% | 1.8x |
| 3 products | 4% | 128% | 2.7x |
| 4+ products | 2% | 135% | 4x+ |

Each product increases:
- Switching costs (more integrations to replace)
- Relationship depth (more stakeholders involved)
- Data lock-in (more data stored in your platform)
- Habit formation (daily usage across workflows)

Valuation impact:

Single product at £5M ARR:
- Growth: 40%, NRR: 105%, Churn: 12%
- Multiple: 8x → Valuation: £40M

Multi-product at £8M ARR (same company, 2 years later):
- Growth: 60%, NRR: 120%, Churn: 6%
- Multiple: 12x → Valuation: £96M

Difference: £56M (2.4x increase) from multi-product strategy

**Build vs buy decision framework**

Evaluation matrix:

| Factor | Build | Buy | Partner |
|---|---|---|---|
| Time to market | 12-24 months | 3-6 months | 1-3 months |
| Investment | £500K-2M+ | £5-50M+ | £50-200K |
| Control | Full | Full (post-integration) | Limited |
| Risk | Product risk | Integration risk | Dependency risk |
| IP ownership | Yes | Yes | No |
| Team impact | Need to hire | Acquire team | No team needed |

Decision tree:

Question 1: Is this core to our strategy?
- Yes → Build or Buy
- No → Partner

Question 2: Does a proven product exist in market?
- Yes → Buy or Partner
- No → Build

Question 3: Do we need it within 6 months?
- Yes → Buy
- No → Build (if core) or Partner (if not core)

Question 4: Can we afford the acquisition?
- Yes → Buy
- No → Build (slower but cheaper) or Partner

Build scenario analysis:

Product B development plan:
| Phase | Duration | Cost | Milestone |
|---|---|---|---|
| Research & design | 3 months | £100K | Product spec validated |
| MVP development | 4 months | £200K | Working prototype |
| Beta launch | 3 months | £150K | 10 beta customers |
| GA launch | 3 months | £150K | Public launch |
| Growth investment | 12 months | £400K | £500K ARR target |
| Total | 25 months | £1M | |

Projected revenue:
- Year 1: £200K (launch year)
- Year 2: £800K (growth)
- Year 3: £2M (scale)

ROI: Investment £1M, revenue by year 3: £3M cumulative
Break-even: ~18 months after launch

Buy scenario analysis:

Acquire Product B company:
- Revenue: £1M ARR
- Price: £8M (8x revenue)
- Integration cost: £200K
- Total investment: £8.2M

Expected outcomes:
- Cross-sell to existing customers: +£500K year 1
- Combined retention improvement: -2pp churn
- Year 2 product revenue: £2M (growth from distribution)

Buy vs build comparison:
| Factor | Build | Buy |
|---|---|---|
| Investment | £1M over 25 months | £8.2M immediate |
| Time to £1M ARR | 24 months | Day 1 |
| Time to £2M ARR | 30+ months | 12-18 months |
| Risk | Product may not find PMF | Integration risk |
| Cash impact | Spread over time | Large upfront |

Build is better when: You have time, uncertain product-market fit, cash constrained
Buy is better when: Speed matters, proven product exists, have capital

**Cross-sell economics**

Cross-sell to existing customers:

CAC for cross-sell vs new customer:

| Acquisition type | CAC | Conversion rate | Sales cycle |
|---|---|---|---|
| New customer | £8,000 | 15% | 90 days |
| Cross-sell (existing) | £1,500 | 30% | 30 days |
| Upsell (same product) | £500 | 40% | 14 days |

Cross-sell is 5x cheaper and 2x more likely to convert

Cross-sell motion:

Phase 1: Identify candidates
- Customers using Product A who would benefit from Product B
- Signals: Requesting features that Product B solves, using competitor for Product B

Phase 2: Enable CSMs and sales
- Training on Product B value proposition
- Cross-sell playbook (discovery questions, demo script)
- Incentivise: Cross-sell commission (8-10% of new product ACV)

Phase 3: Execute
- In-app promotion (Product A users see Product B features)
- Email campaigns to qualified customers
- CSM-driven conversations during QBRs
- Bundle pricing (discount for multi-product)

Phase 4: Measure
- Cross-sell conversion rate
- Revenue from cross-sell
- Impact on retention (multi-product vs single)
- Time to cross-sell (from first product purchase)

Cross-sell target:
- Year 1 after Product B launch: 10-15% of Product A customers adopt Product B
- Year 2: 25-35% adoption
- Year 3: 40-50% adoption

Revenue impact:
- 500 Product A customers × 15% adopt × £10K ACV = £750K year 1
- 500 × 30% × £10K = £1.5M year 2 (assuming base grows too)

**Product P&L management**

Individual product P&L example:

| Line item | Product A | Product B | Total |
|---|---|---|---|
| Revenue | £3,000K | £1,000K | £4,000K |
| COGS (hosting, support) | -£540K (18%) | -£300K (30%) | -£840K |
| Gross profit | £2,460K (82%) | £700K (70%) | £3,160K (79%) |
| R&D (allocated) | -£450K (15%) | -£250K (25%) | -£700K |
| S&M (allocated) | -£360K (12%) | -£200K (20%) | -£560K |
| G&A (allocated) | -£240K (8%) | -£100K (10%) | -£340K |
| Contribution | £1,410K (47%) | £150K (15%) | £1,560K (39%) |

Analysis:
- Product A: Mature, 47% contribution margin (healthy)
- Product B: Growth phase, 15% contribution margin (investing)
- Total company: 39% contribution (acceptable)

Product B trajectory target:

| Metric | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| Revenue | £1M | £2.5M | £5M |
| Gross margin | 70% | 75% | 80% |
| R&D % | 25% | 20% | 15% |
| S&M % | 20% | 15% | 12% |
| Contribution | 15% | 30% | 43% |

Product B should reach Product A-like margins by year 3

Cost allocation methods:

Direct costs (easy):
- Hosting: Per product (separate infrastructure)
- Support: Per product (ticket tracking)
- Product team: Per product (dedicated teams)

Shared costs (harder):

Method 1: Revenue-based allocation
- G&A allocated by revenue share
- Product A: 75% of revenue → 75% of G&A
- Simple but may over-allocate to mature product

Method 2: Headcount-based allocation
- Shared costs by headcount proportion
- Engineering: 60% Product A, 40% Product B (by engineer count)
- Better for R&D allocation

Method 3: Usage-based allocation
- Infrastructure costs by actual usage
- Example: Product A uses 70% of compute → 70% of cloud costs
- Most accurate for COGS

Best practice: Use multiple methods
- COGS: Usage-based
- R&D: Headcount-based
- S&M: Revenue-based (or attributed)
- G&A: Revenue-based

**Portfolio strategy decisions**

When to sunset a product:

Decision criteria:
- Revenue declining >20% YoY for 2+ years
- Gross margin below 50% (and not improving)
- R&D investment not driving growth
- Customer base shrinking
- Cannibalising other products

Sunset process:
1. Announce end-of-life (12 months notice)
2. Migrate customers to alternative (your other product or recommend competitor)
3. Reduce R&D to maintenance only
4. Continue support through migration period
5. Final shutdown

Financial impact of sunset:
- Revenue loss: £500K (declining product)
- Cost savings: £300K (R&D + support)
- Net impact: -£200K revenue, but improved overall margins
- Team redeployed to growth products

When to invest more in a product:

Decision criteria:
- Revenue growing >40% YoY
- Gross margin improving
- Product-market fit confirmed (NPS >40)
- TAM supports continued investment
- Cross-sell potential with other products

Investment areas:
- Additional engineering (new features)
- Dedicated sales team
- Marketing budget
- Customer success investment

`
      }
    ],
    relatedSlugs: ["land-and-expand-strategy-expansion-revenue", "saas-pricing-strategy-and-monetisation", "financial-due-diligence-for-saas-acquisitions", "post-acquisition-integration-and-success", "saas-unit-economics-deep-dive"],
    faq: [
      { q: "How does multi-product strategy impact churn?", a: "Each additional product reduces churn significantly. Single product: ~12% annual churn. Two products: ~7% (-42%). Three products: ~4% (-67%). This is because each product increases switching costs, deepens relationships, and creates data lock-in. Impact on NRR: Single-product 105%, multi-product 125%+. Impact on LTV: Two products = 1.8x LTV, three products = 2.7x. Multi-product is the most powerful retention strategy." },
      { q: "Should I build, buy, or partner for a second product?", a: "Build if: Core to strategy, uncertain PMF, cash constrained (£500K-2M, 12-24 months). Buy if: Speed matters, proven product exists, have capital (£5-50M, 3-6 months). Partner if: Adjacent capability, not core, want to test demand (£50-200K, 1-3 months). Key question: Is it core to your strategy? Yes → Build or Buy. Do you need it fast? Yes → Buy. Cash constrained? Yes → Build or Partner." },
      { q: "How should I manage product-level P&Ls?", a: "Each product gets its own P&L with: Revenue, COGS (direct), gross margin, allocated R&D, allocated S&M, allocated G&A, and contribution margin. Allocate shared costs using: COGS by usage, R&D by headcount, S&M by revenue, G&A by revenue. Growth products may have 15-25% contribution margin (investing). Mature products should reach 40-50%+. Track trajectory — new products should improve margins year-over-year." }
    ],
    videoUrl: ""
  }
];

export default batch390Articles;
