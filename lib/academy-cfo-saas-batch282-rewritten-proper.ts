import { AcademyArticle } from "@/types/academy";

export const batch282Articles: AcademyArticle[] = [
  {
    slug: "building-investor-relationships-and-follow-on-rounds",
    title: "Building Investor Relationships and Follow-On Rounds: Fundraising Strategy",
    description: "Master investor relations. Build relationships, raise follow-on capital, manage dilution.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["investor relations", "follow-on rounds", "Series A", "Series B", "fundraising", "cap table", "investor management"],
    keyTakeaways: [
      "Investor relationship building: Monthly updates (metrics, progress, asks), quarterly calls (deeper discussion), annual meetings (strategy). Authenticity: Share good and bad (honesty > spin). Asks: What help do you need? (investors are network). Cost: Time (CEO time = 10-20% annual). Benefit: Future fundraising easier (relationships established), advice/connections (leverage network). Example: Monthly update to Series A investors (ARR, churn, CAC), quarterly call (strategy check-in), ask for customer intro (leverage network). Investors expect ongoing engagement (not just fundraising).",
      "Follow-on round strategy: Series A (£2-5M, product-market fit, £1M+ ARR). Series B (£5-15M, proven growth, £5M+ ARR). Series C (£15-50M+, rapid growth, £20M+ ARR). Timeline: Series A after £1M ARR (12-18 months after seed). Series B after £5M ARR (18-24 months after Series A). Avoid: Raising too early (weak metrics), too late (runway concerns). Prepare: Updated deck (new metrics), financial model (3-year plan), due diligence materials (clean cap table, audited financials). Cost: Process (2-4 months from decision to close). Dilution: Series A dilutes founders 25-30%, Series B another 20-25% (founders own 50-60% combined after Series B).",
      "Cap table management: Track ownership (who owns what, how much dilution). Each round dilutes everyone (new investors get equity). Insider selling: Founders can sell small amount (liquidity, not full exit). Anti-dilution: Some investors have anti-dilution (protection if price goes down). Down round: If next round valued lower (problematic, dilutes everyone more). Strategy: Plan cap table (who are investors? how diluted?), understand anti-dilution terms (impacts future rounds), minimize dilution (extend runway, stronger metrics = higher valuation)."
    ],
    content: [
      {
        heading: "Investor Relations and Follow-On Fundraising",
        body: `Building relationships and raising capital.

**Investor relationship cadence**

Monthly update (email):
- Metrics: ARR, MRR growth %, churn, NRR, CAC, magic number
- Progress: What shipped, what learned
- Risks: Top 3 risks + mitigation
- Asks: Any introductions or advice?
- Tone: Honest (good and bad news)

Quarterly call (30-60 min):
- Business review: Deeper dive on strategy
- Customer feedback: Market trends, competitive threats
- Discussion: Board input on decisions
- Relationship: Check in, understand investor needs

Annual meeting:
- Strategy: 3-year plan, long-term vision
- Performance: Full year results, learnings
- Board decisions: Compensation, hiring, M&A, strategic decisions
- Celebration: Wins, milestones

Benefits of consistent engagement:
- Next fundraising easier (relationship established, warm intro)
- Advice: Leverage investor network, experience
- Introductions: Customer, partner, talent connections
- Trust: Built through transparency, follow-through

**Follow-on round strategy**

Series A (seed extension):
- Metrics: £1M+ ARR, product-market fit clear
- Timeline: 12-18 months after seed
- Size: £2-5M typical
- Dilution: 25-30% (investors get 25-30%, founders diluted to 70-75%)
- Valuation: 3-5x revenue (£1M ARR = £3-5M post-money valuation)

Series B (growth):
- Metrics: £5M+ ARR, 40%+ growth, clear unit economics
- Timeline: 18-24 months after Series A
- Size: £5-15M typical
- Dilution: 20-25% (founders diluted further to 50-60% combined after A+B)
- Valuation: 4-8x revenue (£5M ARR = £20-40M post-money valuation)

Series C (scaling):
- Metrics: £20M+ ARR, 30%+ growth, profitable or clear path
- Timeline: 18-24 months after Series B
- Size: £15-50M+ typical
- Valuation: 5-10x revenue (£20M ARR = £100-200M+ post-money valuation)

Fundraising timeline:
- Month 1-2: Prepare (deck, financials, materials)
- Month 1-4: Initial conversations (warm intros, meetings)
- Month 4-6: Due diligence (deeper review)
- Month 6-8: Term sheet + negotiation
- Month 8-10: Legal + closing

**Cap table planning**

Example cap table evolution:

Pre-fundraising:
| Party | Shares | % |
|---|---|---|
| Founder A | 500K | 50% |
| Founder B | 500K | 50% |
| Total | 1M | 100% |

Post-Series A (£5M raised, £20M post-money valuation):
| Party | Shares | % |
|---|---|---|
| Founder A | 500K | 31% (diluted) |
| Founder B | 500K | 31% (diluted) |
| Series A investors | 500K | 38% |
| Employee pool | 0K | 0% (set aside below) |
| Total | 1.6M | 100% |

Post-Series A with employee pool:
| Party | Shares | % |
|---|---|---|
| Founder A | 500K | 29% |
| Founder B | 500K | 29% |
| Series A investors | 450K | 34% |
| Employee pool | 180K | 8% |
| Total | 1.63M | 100% |

Insider selling (optional):
- Founders can sell small amount to early investors (liquidity, not exit)
- Example: Founder sells 10% of vested shares to Series A investors (£100K payment)
- Benefit: Founder has some cash, investor gets more equity (show of confidence)
- Risk: Signals doubt (why sell if company doing well?)

Anti-dilution clauses (watch out):
- Full ratchet: If down-round (lower price), investor's price resets (very bad for later investors)
- Broad-based weighted average: Fair compromise (typical)
- Narrow-based weighted average: Investor-friendly (less bad)
- No anti-dilution: Founder-friendly (none taken)
- Standard: Broad-based weighted average (most common)

`
      }
    ],
    relatedSlugs: ["investor-relations-and-communications", "board-governance-and-fiduciary-duties", "due-diligence-preparation-for-investment"],
    faq: [
      { q: "How often should I update investors?", a: "Monthly (email): Metrics, progress, asks. Quarterly (call): Deep-dive strategy. Annual (meeting): Full review. Consistency matters (builds trust). Honesty key (good and bad news = trust). Benefits: Future fundraising easier, investor network access, advice." },
      { q: "When should I raise Series A/B/C?", a: "Series A: £1M+ ARR, product-market fit clear (12-18 months after seed). Series B: £5M+ ARR, 40%+ growth (18-24 months after A). Series C: £20M+ ARR, 30%+ growth (18-24 months after B). Timeline: Each fundraise = 2-4 months process. Plan 6-12 months ahead." },
      { q: "How much dilution should I expect?", a: "Series A: 25-30% dilution (founders 70-75%). Series B: 20-25% more (founders 50-60% after A+B). Series C: 15-20% more (founders 40-50% after A+B+C). Plan: Each round dilutes everyone. Cap table management critical (understand who owns what)." }
    ],
    videoUrl: ""
  }
];

export default batch282Articles;