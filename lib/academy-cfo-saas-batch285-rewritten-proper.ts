import { AcademyArticle } from "@/types/academy";

export const batch285Articles: AcademyArticle[] = [
  {
    slug: "exit-strategy-and-exit-planning",
    title: "Exit Strategy and Exit Planning: Planning for Your End Game",
    description: "Master exit planning. Plan acquisition, IPO, or other exit strategies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["exit strategy", "acquisition", "exit planning", "M&A", "strategic sale", "founder exit", "succession"],
    keyTakeaways: [
      "Exit types: Acquisition (strategic buyer or financial buyer), IPO (public markets), buyout (founder buys back), private equity (private equity firm buys), secondary sale (founder sells shares, company private), dead (company shuts down). Most likely: Acquisition (90% of startups). Timing: 7-10 years typical (early: 3-5 years, late: 10-15 years). Valuation: 3-10x revenue (depends on growth, profitability, market). Cost: 5-10% of deal value (legal, advisory). Benefit: Liquidity (founder money), next chapter (new challenge), team (acquirer often integrates talent).",
      "Acquisition prep: Clean financials (audited, ASC 606 compliant), strong metrics (growth, churn, NRR), diverse customer base (no customer >20% revenue), great product (defensible moat), strong team (will they stay post-acquisition?). Process: Inbound interest (buyers approach) vs outbound (you shop company). Inbound easier (buyer already interested). Timeline: 3-6 months from interest to closing. Valuation: Depends on buyer (strategic pay premium for synergies, financial pay multiple). Deal structure: Cash vs stock, earn-out, retention bonuses for team.",
      "Planning ahead: Build company for acquisition (strong metrics, clean operations, great product). Don't optimize for exit (optimize for company, exit happens naturally). Consider: What acquirer would want (vertical, horizontal, or consolidator)? What would they pay (based on comparable deals)? What happens post-acquisition (team stays, you lead or exit)? Timeline: 3-5 years before selling (give yourself time to build). Founders: Can stay (usually 2-3 years post-acquisition), sell shares (some liquidity), or start new company (sequence of acquisitions)."
    ],
    content: [
      {
        heading: "Planning and Executing a Company Exit",
        body: `Preparing for and executing an exit.

**Exit types and timelines**

Strategic acquisition:
- Buyer: Larger company in same/adjacent market
- Why: Acquire product, team, customers, technology
- Valuation: 4-8x revenue (pays premium for synergies)
- Timeline: 3-6 months process
- Example: Facebook acquires Instagram (product + users)

Financial acquisition:
- Buyer: Private equity, financial buyer
- Why: Investment returns, consolidation play
- Valuation: 2-4x revenue (lower multiple, no synergies)
- Timeline: 3-6 months
- Example: Apollo Global acquires SaaS portfolio

IPO (rare for SaaS):
- Public markets, £100M+ revenue required
- Timeline: 2-3 years preparation
- Cost: £5-15M (process, compliance)
- Valuation: Market sets (depends on market conditions)

Secondary sale:
- Founder sells shares (not full company sale)
- Buyer: Secondary fund, other investors
- Timeline: 1-2 months
- Benefit: Founder liquidity, company stays independent
- Example: Stripe secondary (founder sells, company stays private)

**Exit preparation checklist**

Financial:
- Audited financials (3+ years)
- ASC 606 compliant (revenue recognition correct)
- Clean cap table (no ghost equity, vesting clear)
- Customer contracts (clear terms, assignable to buyer)

Operational:
- Diversified customers (no customer >20% revenue)
- Repeatable sales process (not founder-dependent)
- Strong team (key people, not founder-dependent)
- Documented processes (playbooks, procedures)

Product:
- Defensible moat (not easily replicable)
- Clear roadmap (what's coming next?)
- Technical debt managed (not a mess)
- Scalable architecture (can grow with acquirer)

Strategic:
- Clear mission, vision
- Competitive positioning (why unique?)
- Market opportunity (size, growth)
- Growth trajectory (where heading?)

**Valuation expectations**

By stage:
| Stage | Revenue | Multiple | Valuation | Notes |
|---|---|---|---|---|
| Seed to Series A | £0-2M | 2-4x | £0-8M | Early stage, lower multiple |
| Series A/B | £2-10M | 3-6x | £6-60M | Growth, higher multiple |
| Series B/C | £10-50M | 4-8x | £40-400M | Proven, premium multiple |
| Growth/mature | £50M+ | 5-10x | £250M+ | Highly proven, mature |

Example: £10M revenue startup
- Low: 2x = £20M (struggling growth, declining)
- Mid: 4x = £40M (steady growth, average)
- High: 6x = £60M (strong growth, great metrics)

Factors affecting valuation:
- Growth rate: Higher growth = higher multiple
- Profitability: Profitable = higher multiple
- Market: Hot market = higher multiple
- Competition: Defensible = higher multiple
- Team: Great team = higher multiple

**Exit execution**

Inbound process (buyer approaches):
1. Discuss: Buyer expresses interest
2. Evaluate: Assess fit, valuation, terms
3. NDA: Confidentiality agreement
4. Due diligence: 4-8 weeks (buyer investigates)
5. Term sheet: Draft deal terms
6. Negotiation: Price, terms, retention
7. Legal: 4-8 weeks (final legal docs)
8. Close: Signature, payment, transition

Outbound process (you shop company):
1. Prepare: Clean financials, metrics, story
2. Identify buyers: 5-10 strategic + financials
3. Approach: Reach out (warm intro preferred)
4. Meetings: Multiple buyer conversations
5. Interest: Generate competitive tension
6. Term sheet: Multiple offers (negotiate best)
7. Due diligence: Winner conducts diligence
8. Close: Same as inbound

Timeline: 3-6 months typical (can be faster or slower)

**Post-acquisition planning**

Typical deal structure:
- Cash: Upfront payment (usually 60-70% of deal)
- Earn-out: Additional payment based on metrics (usually 20-30%)
- Retention bonuses: To keep team post-acquisition (usually 10-20%)

Example £40M deal:
- Cash: £24M (upfront)
- Earn-out: £10M (if hit targets year 1-2)
- Retention: £6M (bonuses for team over 2 years)

Founder timeline post-acquisition:
- Year 0-1: Integration (keep existing role, high visibility)
- Year 1-2: Transition (reduce role gradually, mentor)
- Year 2-3: Exit (leave or take new role in acquirer)

Many founders:
- Stay 2-3 years (see integration through)
- Move to new company or advisory (next chapter)
- Become investor/advisor (give back)

`
      }
    ],
    relatedSlugs: ["mna-integration-and-acquisition-strategy", "financial-planning-and-budgeting", "building-investor-relationships-and-follow-on-rounds"],
    faq: [
      { q: "What's a typical exit valuation?", a: "Strategic acquisition: 4-8x revenue. Financial acquisition: 2-4x. Factors: Growth rate (higher = higher multiple), profitability, market (hot = higher), defensibility. Example: £10M revenue = £20-60M valuation depending on above." },
      { q: "How should I prepare for exit?", a: "Financial: Audited financials, clean cap table. Operational: Diversified customers (no >20%), repeatable sales, strong team. Product: Clear roadmap, managed tech debt, scalable. Strategic: Clear positioning, market opportunity, growth trajectory." },
      { q: "How long is M&A process?", a: "Total timeline: 3-6 months typically. Due diligence: 4-8 weeks. Legal: 4-8 weeks. Negotiation: 2-4 weeks. Inbound (buyer approaches) often faster than outbound (you shop). Accelerators: Competitive bids, clear valuation." }
    ],
    videoUrl: ""
  }
];

export default batch285Articles;