import { AcademyArticle } from "@/types/academy";

export const batch164Articles: AcademyArticle[] = [
  {
    slug: "competitive-analysis-and-market-positioning",
    title: "Competitive Analysis and Market Positioning: Knowing Your Place in the Market",
    description: "Master competitive analysis. Understand your competitors' strengths and weaknesses, position your company strategically, and find your defensible niche.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "competitive analysis",
      "market positioning",
      "competitor research",
      "competitive advantage",
      "market strategy",
      "positioning strategy",
      "competitive landscape",
      "differentiation",
      "market share",
      "competitive moat"
    ],
    keyTakeaways: [
      "Identify direct competitors (solve same problem), indirect competitors (alternative solutions), and new entrants (startup threats). Map on 2D matrix: Price (low/high) vs Feature richness (simple/complex). Example: Slack (premium, feature-rich), Telegram (free, feature-rich), email (free, simple). Find white space on matrix (opportunity gap). Example: Mid-market, mid-price, industry-specific = unserved niche.",
      "Win/loss analysis: Talk to 10 customers who chose you, 10 who chose competitor, 10 who churned. Ask: Why did you choose X? Why not Y? What would change your mind? Pattern: You win on ease of use, lose on missing feature Z, competitor wins on price. Act: Improve feature Z, emphasize ease of use in marketing, adjust pricing.",
      "Competitive advantage: Have defensible moat (hard to copy). Examples: (1) Network effects (more users = more valuable), (2) Switching costs (expensive to leave), (3) Brand (premium perception), (4) Technology (hard to replicate), (5) Data/AI (needs scale). Without moat: Compete on price (race to bottom, bad). Clarify your moat, invest there."
    ],
    content: [
      {
        heading: "Identifying Your Competitors",
        body: `Mapping the competitive landscape.

**Direct vs Indirect Competitors**

Direct competitors: Solve exact same problem
- Example: If you're Slack, direct competitors are Teams, Discord, Telegram (messaging platforms)
- Same customer jobs to be done
- Direct price comparison

Indirect competitors: Solve same problem differently
- Example: Email is indirect competitor to Slack (both for team communication)
- Alternative to your solution
- Different UX, different pricing

New entrants: Potential future competitors
- Startups building in your space
- Larger companies expanding into your space
- Different threat level (startups nimble, large companies have resources)

Strategy: Monitor all three. Direct = urgent focus. Indirect = understand why customers prefer them. New entrants = learn from their differentiation.

**Competitive Landscape Matrix**

Map competitors on 2D grid: Price (X-axis) vs Feature Richness (Y-axis)

Example: Project management tools

\`\`\`
HIGH
|  Monday.com    Asana
|      ($$)     ($$)
|   Tableau    Notion
|  ($)   ()    ($)
|     Trello
|    ($)
|      Airtable  Excel
|     ($)   (free)
|
+-----|----------|-----------> FEATURES
   Simple      Moderate       Complex
\`\`\`

Insight:
- Expensive + complex: Asana, Monday (enterprise focus)
- Cheap + moderate: Notion, Airtable (SMB focus)
- Free/cheap + simple: Trello, Excel (very basic)

Opportunity gap (white space):
- Example: Mid-price, mid-features, vertical-specific (industry-focused)
- Could position as "Asana for agencies" or "Notion for finance"

**Competitive Positioning**

Your position: The specific place you own in customer's mind.

Formula: "For [customer], [offering] that [key benefit] unlike [competitor], [differentiation]."

Example positioning statements:

Slack: "For distributed teams, Slack is team messaging that replaces email, unlike email, because it's threaded, searchable, and real-time."

Monday: "For enterprises, Monday is project management that scales across teams, unlike Excel, because it's automated, collaborative, and visual."

Notion: "For creators and small teams, Notion is an all-in-one workspace, unlike specialized tools (Asana + Docs + Wiki), because you own your data and it's customizable."

Your positioning determines:
- Pricing
- Feature prioritization
- Marketing messaging
- Customer segment

**Positioning Statement Workthrough**

Start with customer problem:
- Problem: "Teams struggle to coordinate work across timezones"

Possible positioning:

Option A: "Async-first project management"
- Customer: Remote/distributed teams
- Key benefit: Works in async workflows
- vs Competitors: Asana/Monday (built for synchronous)
- Differentiation: Async collaboration, timezone-friendly

Option B: "AI-powered project assistant"
- Customer: Busy PMs and managers
- Key benefit: AI automates routine tasks
- vs Competitors: Manual tools
- Differentiation: AI suggests timelines, flags risks, auto-updates status

Option C: "Industry-specific PM (for agencies)"
- Customer: Creative agencies
- Key benefit: Built for agency workflows
- vs Competitors: Generic tools
- Differentiation: Retainer tracking, scope management, client portal

Choose the positioning you can defend best.

`
      },
      {
        heading: "Competitive Research",
        body: `Understanding competitor strengths and weaknesses.

**Competitor Deep Dive**

For each top 3 competitors, document:

1. Positioning: How do they position themselves?
2. Pricing: Price tiers, what's included, positioning (premium, discount, middle)
3. Features: Core features, differentiating features, missing features
4. Target customer: Who do they target? (SMB, enterprise, specific vertical)
5. Go-to-market: How do they sell? (Sales, self-serve, channels, partnerships)
6. Strengths: What are they good at?
7. Weaknesses: Where do they struggle?

Example: Asana vs Monday

| Factor | Asana | Monday |
|--------|-------|--------|
| Positioning | Enterprise PM at scale | Visual, flexible workflows |
| Pricing | £14-29/user/month | £8-15/user/month |
| Core features | Timeline, dependencies, portfolios | Kanban, Gantt, automations |
| Target | Enterprise (50+) | Mid-market (10-100) |
| GTM | Sales team | Self-serve + sales |
| Strength | Enterprise trust | User-friendly |
| Weakness | Complex UX | Less flexible |

Insight: Asana wins enterprise (trust), Monday wins mid-market (UX).

**Win/Loss Analysis**

Talk to:
1. 10 customers who chose you (why?)
2. 10 customers who chose competitor (why them, why not you?)
3. 10 customers who churned (why did you fail?)

Key questions:
- What was most important in decision? (feature, price, ease, support)
- What would change your mind? (missing feature, lower price, better support)
- How did we rank on key criteria? (1-5 scale)

Pattern from wins:
- "We chose you because of ease of use and pricing"
- "Asana was too complex for our team size"
- Insight: You win on simplicity + affordability

Pattern from losses:
- "We chose Asana because of timeline/dependencies"
- "You don't have X feature we need"
- Insight: You lose on advanced features, win on simplicity (trade-off)

Pattern from churn:
- "You didn't grow with us, eventually needed Asana"
- "Support was slow"
- Insight: Upgrade path weak, support needs improvement

Actions:
1. Double down on wins (ease of use, pricing)
2. Address losses (roadmap for advanced features)
3. Fix churn (support + upgrade path)

`
      },
      {
        heading: "Building Competitive Advantage",
        body: `Creating a defensible moat.

**Types of Competitive Moats**

1. Network effects (most valuable)
- More users = more valuable product
- Example: Slack (more people join = more valuable for communication)
- Hard to compete: New entrant needs users to be valuable
- Defensibility: Very high

2. Switching costs
- Expensive/painful to switch
- Example: Salesforce (CRM deeply integrated into processes, switching = costly)
- Hard to compete: Once locked in, hard to leave
- Defensibility: High

3. Brand / perception
- Premium brand = command premium price
- Example: Slack (cool, loved, premium brand)
- Hard to compete: Brand built over time, can't buy it
- Defensibility: High (takes time to build)

4. Technology / patents
- Proprietary technology hard to copy
- Example: Zoom (compression tech, reliability)
- Hard to compete: Requires R&D to replicate
- Defensibility: Medium (patents expire, tech evolves)

5. Data advantage
- More data = better product (AI/ML)
- Example: Google Search (data on user intent, better results)
- Hard to compete: Needs scale and time to accumulate
- Defensibility: Medium-high

6. Cost advantage
- Lower cost to operate = lower price
- Example: AWS (economies of scale, cheaper than competitors)
- Hard to compete: Requires scale
- Defensibility: Medium (competitors can scale too)

**Building Your Moat**

Most startups start with: Technology or Brand.

Example: Slack
- Started with: Better UX + easier setup (technology/design moat)
- Built to: Network effects (more team integration = stickier)
- Reinforced with: Brand (Slack = modern communication)

Strategy for your company:

Year 1: Build best product in your niche (technology moat)
Year 2-3: Grow user base (build toward network effects or switching costs)
Year 3+: Leverage brand, deepen moat

Without moat: You compete on price (bad, race to bottom).
With moat: You compete on value (good, defensible).

**Assessing Your Moat**

Ask yourself:
1. Can a well-funded competitor copy me in 6 months? If yes, moat weak.
2. Would my customers leave if price went up 20%? If yes, switching costs low.
3. Do customers choose me because of technology, brand, or network effects? (strongest = network)

Example: Notion
- Network effects: Users invite others (teams), become stickier
- Switching costs: Heavy investment in setup, hard to leave
- Brand: Cool, loved, strong brand
- Moat: Multiple reinforcing factors (strong)

Example: Generic project management clone
- No network effects
- Low switching costs
- No brand
- Moat: None (compete only on price)

`
      },
      {
        heading: "Using Competitive Insights for Strategy",
        body: `Turning research into action.

**Positioning Decision Framework**

Question 1: Can we win in the main market?
- If no (competitors too strong): Find white space niche
- If yes: Compete on key dimension (features, price, brand)

Question 2: What's our sustainable advantage?
- Technology: Build feature/performance advantage
- Brand: Build perception advantage
- Switching costs: Build integration/lock-in
- Network effects: Grow user base, create viral

Question 3: Which competitors are threats?
- Direct (same positioning): Most urgent
- Indirect (different positioning): Watch them
- New entrants: Learn what they're doing differently

Action: Pick positioning that:
1. Customers want (win/loss confirms)
2. You can execute (team skills)
3. Is defensible (moat in place or buildable)

**Pricing Strategy Based on Competitors**

Competitive pricing (match competitors):
- Pros: Safe, market validation
- Cons: Race to bottom, no differentiation
- When: You have parity features, compete on service/brand

Value-based pricing (price by value delivered):
- Pros: Higher margins, defensible
- Cons: Requires strong positioning, education
- When: You have clear differentiation, strong moat

Penetration pricing (cheap to gain market share):
- Pros: Fast growth, market share
- Cons: Hard to raise prices later
- When: You need scale quickly, network effects matter

Example: Project management pricing
- Asana: Value-based (expensive, enterprise value)
- Monday: Competitive (mid-market pricing)
- Notion: Penetration (cheap, grow community)

Your choice depends on positioning and strategy.

**Product Roadmap Based on Competitors**

Competitive analysis should drive roadmap decisions:

From win/loss: Customers lost because "missing feature X" → Prioritize X
From positioning: "Easier than Asana" → Prioritize UX improvements
From opportunity gap: "No mid-market + mid-complexity solution" → Build for that

Don't just copy competitors. Differentiate on specific dimension.

Example roadmap:
- Q1: Advanced features (catch up to Asana)
- Q2: UX overhaul (differentiate on ease)
- Q3: Integrations (switching cost)
- Q4: AI features (new moat)

`
      }
    ],
    relatedSlugs: [
      "pricing-strategy-and-price-optimization",
      "metrics-dashboard-design-kpi-tracking",
      "growth-accounting-and-advanced-unit-economics",
      "unit-economics-ltv-cac-payback",
      "saas-valuation-and-multiples"
    ],
    faq: [
      {
        q: "How do I identify my competitors?",
        a: "Direct: Solve exact same problem. Indirect: Alternative solutions to same problem. New entrants: Potential startups in space. List 3-5 direct competitors, understand their positioning (price, features, target customer). Map on matrix: price vs complexity. Find white space gaps for positioning."
      },
      {
        q: "What's a competitive moat?",
        a: "Defensible advantage hard to copy. Types: (1) Network effects (more users = more valuable), (2) Switching costs (expensive to leave), (3) Brand (strong perception), (4) Technology (hard to replicate), (5) Data (needs scale). Without moat, you compete only on price (bad). Build moat through product, brand, integrations."
      },
      {
        q: "How do I do win/loss analysis?",
        a: "Interview 10 customers who chose you, 10 who chose competitor, 10 who churned. Ask: Why them? Why not the other? What matters most? What would change your mind? Look for patterns. Example: You win on ease of use (differentiate there), lose on advanced features (accept or build), churn on lack of scaling (build upgrade path)."
      },
      {
        q: "How do I position my company?",
        a: "Formula: \"For [customer], [offering] that [key benefit] unlike [competitor], [differentiation].\" Example: \"For agencies, Monday is project management that scales across teams, unlike Asana, because it's visual and user-friendly.\" Positioning drives pricing, features, marketing. Make sure it's defensible and customers want it."
      }
    ],
    videoUrl: ""
  }
];

export default batch164Articles;
