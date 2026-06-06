import { AcademyArticle } from "@/types/academy";

export const batch107Articles: AcademyArticle[] = [
  {
    slug: "competitive-analysis-market-positioning",
    title: "Competitive Analysis and Market Positioning: Winning Against Competitors",
    description: "Master competitive analysis. Understand your competitive position, track competitor metrics, and identify strategic opportunities.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "competitive analysis",
      "competitor benchmarking",
      "market positioning",
      "competitive advantage",
      "competitor pricing",
      "SWOT analysis",
      "competitive strategy",
      "market share",
      "differentiation",
      "competitive landscape"
    ],
    keyTakeaways: [
      "Competitive analysis framework: Identify 3-5 direct competitors (solving same problem for same customer); map their positioning (price, feature set, target customer); track their metrics (ARR, growth, funding, features); identify gaps (what they don't do well = your opportunity); example: Slack vs Teams: Slack premium UX & ecosystem, Teams has low cost & Office 365 integration; Slack positioned as best-in-class experience, Teams as economical alternative",
      "SWOT analysis: Strengths (what you're better at: product, team, brand), Weaknesses (what competitors better at: price, market share, features), Opportunities (market gaps, new customer segments, adjacent markets), Threats (competitive moves, market contraction, new entrants). Run quarterly to track changes. Use to prioritize roadmap (address weaknesses, exploit opportunities)",
      "Pricing competitiveness: Monitor competitor pricing monthly (what changed?); price 10-30% premium if truly differentiated product (justify with features/quality), at-market price if commodity (hard to differentiate on price), lower price only if cost advantage (can sustain). Example: Figma premium positioned vs Adobe at 1/3 price but better UX = won market share. Don't compete on price unless cost advantage exists"
    ],
    content: [
      {
        heading: "Conducting Competitive Analysis",
        body: `Competitive analysis identifies your competitors, their strengths/weaknesses, and your positioning.

**Identifying Your Competitors**

Direct competitors: Solve same problem for same customer

Example: Project management SaaS
- Direct competitors: Asana, Monday.com, Notion, ClickUp
- Solve: Team collaboration and task management
- Target: Agencies, software teams, enterprises

Indirect competitors: Solve same problem differently

Example: Same project management space
- Indirect: Email (teams use email for task management)
- Indirect: Spreadsheets (teams track tasks in Excel)
- Indirect: Slack + linear notes (team uses for project management)

Positioning competitors: Solve adjacent problem for same customer

Example: Same project management space
- Time tracking (Toggl, Harvest) - adjacent problem, same user
- Invoicing (QuickBooks, Stripe) - adjacent problem, same user

Focus on direct competitors (3-5 main ones). Track indirect competitors but less important.

**Competitive Positioning Matrix**

Map competitors on two key dimensions (usually price vs. features):

Example: Project management market

Axis 1 (X): Price (low to high)
Axis 2 (Y): Feature richness (basic to advanced)

Positioning:

Monday.com: High price, advanced features (premium, complex)
Asana: Mid-high price, advanced features (premium, user-friendly)
Notion: Low price, moderately advanced (good value)
ClickUp: Mid price, very advanced features (feature-rich, steep learning curve)
Slack + native: Very low price (free), basic features (team chat only)

Your positioning (new entrant):
- "Simple, beautiful project management at mid-price"
- Position between Notion (simple, cheap) and Asana (feature-rich, expensive)
- Different positioning = different customers

This matrix helps you see your competitive position and target customer.

**Competitor Metrics to Track**

Monthly (or quarterly) competitive tracking:

1. Pricing
   - List all plans and pricing
   - Note any changes
   - Example: Competitor raised price 15% = market signal

2. Feature set
   - Document major features
   - Note any new feature launches
   - Example: Competitor added AI, you need roadmap response

3. Customer count (if public)
   - Public companies: Revenue visible, estimate customer count
   - Private companies: Crunchbase, Pitchbook estimate

4. Growth rate
   - Public companies: Revenue growth quarterly visible
   - Monitor growth rate vs. yours

5. Funding
   - Funding raises signal ambition, resources
   - Example: Competitor raised £50M Series C = expect aggressive growth

6. Team size
   - Company LinkedIn profile shows headcount
   - Large team = deep R&D, customer success
   - Example: Competitor hired 50 engineers = expect product improvements

7. Customer segments
   - Review company messaging, case studies
   - Understand who they target
   - Example: Competitor focused on enterprises, you focus on SMB = less direct competition

**Competitive Advantage Assessment**

Use SWOT to assess your competitive position:

Strengths (internal, what you're better at):
- Example: Better UX than Competitor A
- Example: 10x faster implementation than Competitor B
- Example: Lower price than Competitor C
- Strengths should be defensible (hard to replicate)

Weaknesses (internal, what you're worse at):
- Example: Smaller team (limited R&D)
- Example: Less funding (limited marketing spend)
- Example: Newer product (fewer customers = fewer case studies)
- Weaknesses should focus on areas competitors ahead

Opportunities (external, what's available):
- Example: Market growing 40% YoY = market expansion
- Example: Competitor has no mobile app = build mobile first
- Example: New customer segment entering market = expand upmarket
- Opportunities should be defensible (hard for competitors to copy)

Threats (external, what could hurt):
- Example: New competitor entering market
- Example: Market consolidation (larger player enters)
- Example: Changing customer needs (shift to cloud, shift to mobile)
- Threats should be monitored and mitigated

Example SWOT for new project management SaaS:

Strengths:
- Superior UX (spend time on design)
- 2x faster than competitors (engineering focus)
- Better onboarding (customer success focus)

Weaknesses:
- Smaller team (limited R&D speed)
- Lower brand awareness
- Smaller customer base (fewer integrations)

Opportunities:
- Mobile-first market (competitors weak on mobile)
- AI-powered features (competitors not investing)
- Vertical-specific versions (HR teams, creative teams)

Threats:
- Slack integrating project management (kills positioning)
- Enterprise competitors moving downmarket
- Developer tools integrating task management

Use SWOT to prioritize roadmap:
- Invest in strengths (design, speed) to maintain advantage
- Address weaknesses (brand, integrations) to compete
- Pursue opportunities (mobile, AI) to differentiate
- Prepare for threats (monitor Slack, prepare for downmarket competition)

**Pricing Competitiveness**

How to price relative to competitors:

Scenario 1: Premium positioning (better product)
- Competitors: £200/mo, £500/mo, £1000/mo (market range)
- You: £300/mo, £750/mo, £1500/mo (30% premium)
- Justification: Better UX, faster, better support
- Risk: Customers may perceive as overpriced if not differentiated

Scenario 2: Value positioning (similar product, lower cost)
- Competitors: £200/mo, £500/mo, £1000/mo
- You: £150/mo, £400/mo, £800/mo (25% discount)
- Justification: More efficient ops, lower cost structure
- Risk: Race to bottom if competitors match price

Scenario 3: Market positioning (at-market pricing)
- Competitors: £200/mo, £500/mo, £1000/mo
- You: £200/mo, £500/mo, £1000/mo (same pricing)
- Justification: Standard for market segment
- Strategy: Differentiate on value, not price

Price strategy options:

High price + differentiation: Works if you have clear advantage (Slack vs Teams)
- Slack: Premium, more expensive, but better UX/integrations
- Market result: Slack won market despite higher price

Low price + cost advantage: Works if you have structural cost advantage (Stripe vs legacy processors)
- Stripe: Lower price due to cloud-native (no infrastructure)
- Market result: Stripe took market share from legacy

At-market price + superior product: Works if product clearly better
- Asana vs Monday: Similar pricing, Asana won on UX
- Market result: Asana stronger in mid-market

At-market price + weak product: Difficult, likely to lose
- Many SaaS fail here (not differentiated, not cheaper)

Don't compete on price unless you have structural cost advantage. Price competition is race to bottom.

**Competitive Moves and Responses**

Monitor competitor moves and respond strategically:

Competitor move: Raises price 20%
- Your response: Not to match, but understand why. If justified (better product), stay at-market. If unjustified (market change), capture their price-sensitive customers.

Competitor move: Launches major new feature
- Your response: Evaluate feature importance. If critical (many customers need it), add to roadmap. If niche (few customers want), ignore.

Competitor move: Raises funding
- Your response: Monitor for aggressive growth. If competitor invested for sales team, expect increased competition. If invested for product R&D, expect features.

Competitor move: Acquires customer base
- Your response: Reassess competitive positioning. If acquired customers in your target market, expect churn. Focus on retention and expansion.

**Competitive Advantage Sources**

Sustainable competitive advantages:

1. Network effects
   - Value increases as more users join
   - Example: Slack (better as more teammates on platform)
   - Hard to replicate: Requires critical mass

2. Switching costs
   - Expensive to switch to competitor
   - Example: Once you integrate 50 tools with platform, hard to switch
   - Hard to replicate: Requires deep integration

3. Data advantage
   - Proprietary data competitors don't have
   - Example: Pricing tool with millions of pricing transactions
   - Hard to replicate: Requires time to build data set

4. Brand
   - Customers perceive value in brand
   - Example: Slack brand = reliability, quality
   - Hard to replicate: Requires years to build

5. Product superiority
   - Consistently better product
   - Example: Figma superior design collaboration
   - Hard to replicate: Requires product focus

6. Cost advantage
   - Structural cost advantage (cloud-native vs legacy)
   - Example: Stripe lower cost than legacy processors
   - Hard to replicate: Requires different business model

7. Distribution advantage
   - Better go-to-market (sales, marketing)
   - Example: SalesForce has best sales team
   - Hard to replicate: Requires sales team investment

Build advantage in one of these areas. Competitors will copy features (easy), but hard to copy network effects, data, brand, or structural advantages.

**Market Share Strategy**

How to gain market share:

Strategy 1: Undercut on price
- Price 20% lower than competitors
- Gain price-sensitive customers
- Risk: Race to bottom, margin compression

Strategy 2: Differentiate on product
- Better features, UX, speed
- Gain customers who value quality
- Risk: Competitors copy features

Strategy 3: Target unserved segment
- Find customer segment competitors ignore
- Example: Competitors focus on enterprises, you focus on SMB
- Gain entire segment
- Risk: Limited market size if segment small

Strategy 4: Vertical specialization
- Build for specific vertical (HR tech, real estate tech)
- Better fit for vertical than horizontal competitors
- Gain vertical-specific customers
- Risk: Limited market if vertical small

Best strategy: Combination
- Build superior product (differentiate)
- Target underserved segment (SMB when competitors focus on enterprise)
- Maintain sustainable pricing (not race to bottom)
- Build defensible advantage (network, data, switching costs)

Market share gains from combination are durable (competitors harder to replicate).
`
      }
    ],
    relatedSlugs: [
      "pricing-psychology-and-packaging",
      "saas-benchmarking-peer-comparison",
      "saas-valuation-and-multiples",
      "customer-acquisition-cost-optimization",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "How many competitors should I monitor?",
        a: "3-5 direct competitors (same problem, same customer). Also track indirect competitors (solve problem differently) and positioning competitors (adjacent problems)."
      },
      {
        q: "How should I price vs. competitors?",
        a: "Premium (10-30% higher) if you have clear differentiation. At-market if similar product. Lower price only if you have structural cost advantage. Avoid pure price competition."
      },
      {
        q: "What metrics should I track from competitors?",
        a: "Pricing, features, customer count, growth rate, funding, team size, customer segments. Track monthly to catch changes and plan responses."
      },
      {
        q: "How do I build sustainable competitive advantage?",
        a: "Network effects, switching costs, data advantage, brand, product superiority, cost advantage, or distribution advantage. Focus on one defensible advantage, not multiple weak ones."
      }
    ],
    videoUrl: ""
  }
];

export default batch107Articles;
