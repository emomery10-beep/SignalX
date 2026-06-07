import { AcademyArticle } from "@/types/academy";

export const batch226Articles: AcademyArticle[] = [
  {
    slug: "competitive-intelligence-and-market-monitoring",
    title: "Competitive Intelligence and Market Monitoring: Staying Ahead of Competition",
    description: "Master competitive intelligence. Monitor competitors, stay informed, adapt strategy.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "competitive intelligence",
      "market monitoring",
      "competitors",
      "competitive analysis",
      "market intelligence",
      "benchmarking",
      "threat analysis",
    ],
    keyTakeaways: [
      "Monitor quarterly: Competitor announcements, feature releases, pricing changes, customer wins. Tools: G2 (reviews), Crunchbase (funding/news), Twitter/LinkedIn (announcements), Win/loss analysis (your sales team). Example: Competitor raised £50M Series B (bigger threat), launched new feature (copy/differentiate?), reduced pricing (respond). Decision framework: If direct threat (stealing customers), respond quickly. If not threat (niche competitor), monitor but don't react. Time: 4 hours/quarter per team lead (not full-time).",
      "Win/loss analysis: When you lose deal, call customer (\"Why chose competitor?\"). Patterns: 30% price-sensitive → review pricing. 30% features → accelerate roadmap. 20% relationship → improve sales. 20% product-market fit → reconsider target. Act: If 30% losing to price, likely can't compete on cost (differentiate instead). If 30% features, prioritize roadmap.",
      "Competitive positioning: You vs 3-5 main competitors. Matrix: Price (Y-axis) vs features (X-axis). Position: Are you low-cost/low-features (SMB) or premium/high-features (enterprise)? Defend: If premium, emphasize support/moat. If low-cost, emphasize simplicity. Watch: If new entrant at lower price, prepare to defend (improve features, reduce costs, or accept losing SMB tier). Example: Slack vs Teams = Slack lost SMB (free Teams offer), won enterprise (better features).",
    ],
    content: [
      {
        heading: "Competitive Monitoring Framework",
        body: "**Quarterly competitive review**\n\nChecklist:\n1. Funding: Any competitor raised money? (More resources = threat)\n2. Features: Any competitor launched major feature? (Copy, differentiate, or ignore?)\n3. Pricing: Any competitor changed pricing? (Market signaling)\n4. Partnerships: Any strategic partnerships announced? (Expand reach)\n5. Hiring: Competitor hiring spree? (Growing team, expanding markets)\n6. Wins/losses: Which deals you lost to competitor? (Pattern analysis)\n\n**Win/loss analysis**\n\nProcess:\n- Sales team logs all losses (competitor name, reason)\n- Monthly: Aggregate (which competitors winning, on what?)\n- Pattern: If losing 30% of deals to price, problem is pricing (not features)\n- Action: Adjust strategy based on pattern\n\nExample patterns:\n| Loss reason | % | Action |\n|---|---|---|\n| Price | 35% | Review pricing (too high?) or differentiate (don't compete on price) |\n| Features | 30% | Accelerate roadmap (ship features faster) |\n| Relationship | 20% | Train sales (better sales process) |\n| Product-market fit | 15% | Reassess if right target |\n\n**Competitive positioning**\n\nMatrix (simple):\n- X-axis: Price (low to high)\n- Y-axis: Features (basic to advanced)\n\nPositioning:\n- Low price, basic features: SMB, self-serve (Canva, Notion)\n- High price, advanced features: Enterprise, support-heavy (Salesforce, Adobe)\n- Low price, advanced features: Rare (race to bottom)\n- High price, basic features: Niche (premium brand)\n\nYour position: Where do you fit? Defend it or move?",
      },
    ],
    relatedSlugs: [
      "competitive-analysis-and-market-positioning",
      "product-roadmap-planning-and-prioritization",
      "pricing-strategy-and-price-optimization",
    ],
    faq: [
      {
        q: "How often should I monitor competitors?",
        a: "Quarterly: 4 hours/quarter review (funding, features, pricing, partnerships). Track: G2 reviews, Crunchbase updates, Twitter announcements. Act: If direct threat (stealing customers), respond. If not threat (niche), monitor but don't overreact.",
      },
      {
        q: "What should I do if competitor undercuts price?",
        a: "Analyze: Are you losing deals to price? (Track win/loss). If yes: Option 1 (lower price, reduce margin), Option 2 (differentiate, emphasize value), Option 3 (accept losing SMB, focus enterprise). Decision: Based on strategy and margin impact.",
      },
    ],
    videoUrl: "",
  },
];

export default batch226Articles;
