import { AcademyArticle } from "@/types/academy";

export const batch132Articles: AcademyArticle[] = [
  {
    slug: "competitive-analysis-and-market-intelligence",
    title: "Competitive Analysis and Market Intelligence: Understanding Your Market Position",
    description: "Master competitive analysis. Benchmark against competitors, size your market, and understand your competitive advantage.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "competitive analysis",
      "market intelligence",
      "market sizing",
      "TAM",
      "total addressable market",
      "competitive positioning",
      "competitor benchmarking",
      "market trends",
      "competitive advantage",
      "moat"
    ],
    keyTakeaways: [
      "TAM (Total Addressable Market) = Total potential revenue available. Example: Email marketing software market = £10B globally. Your serviceable addressable market (SAM) = portion you can realistically reach (your vertical + geography) = maybe £1B. Your serviceable obtainable market (SOM) = what you can capture = maybe 5% = £50M. TAM >£1B is typical VC investment threshold.",
      "Competitive positioning: Map competitors on growth (Y-axis) vs unit economics (X-axis). Enterprise competitors slow-growth, high-margin (profitable, sticky). Startup competitors high-growth, lower-margin (investing, scaling). Position yourself against direct competitors. Example: Slack positioned as 'faster than email' (competitive angle vs Email + Chat competitors).",
      "Benchmarking metrics: Compare your growth, churn, LTV/CAC, margins against public comps and peers. Your growth should be top-tier in your category (if not, why not?). Churn should match or beat peers. Unit economics should be competitive. If losing on all metrics, question product-market fit. If winning on most, investable story."
    ],
    content: [
      {
        heading: "Understanding Market Size and TAM",
        body: `Before you can be competitive, you need to understand your market.

**TAM, SAM, and SOM**

TAM (Total Addressable Market):
- Total revenue available if you captured 100% of your market
- Global potential

Example: Email marketing software
- Every business needs email marketing
- Global B2B software market: £500B+
- Email marketing portion: £10B
- TAM: £10B

SAM (Serviceable Addressable Market):
- Portion of TAM you can realistically reach (geography, vertical, customer type)
- Geographic scope (US? Europe? Global?)
- Vertical scope (SMB? Enterprise? Both?)

Example: Email marketing, US-only SMB focus
- US market: 60% of £10B = £6B
- SMB portion: 70% of US = £4.2B
- SAM: £4.2B

SOM (Serviceable Obtainable Market):
- Realistic capture in next 5-10 years (your sales/marketing plan)
- Ambitious but achievable

Example: Email marketing, US SMB, capture 2% in 10 years
- SOM: £4.2B × 2% = £84M

**TAM Framework**

Build bottom-up TAM:

Target segments:
- Segment A: US SMB (£100K-1M revenue)
  - Count: 5M businesses
  - Spending on email marketing: £5K/year average
  - TAM: 5M × £5K = £25B

- Segment B: US mid-market (£1M-100M revenue)
  - Count: 100K businesses
  - Spending on email marketing: £50K/year average
  - TAM: 100K × £50K = £5B

- Segment C: US enterprise (>£100M revenue)
  - Count: 5K businesses
  - Spending on email marketing: £500K/year average
  - TAM: 5K × £500K = £2.5B

Total TAM (US): £32.5B

This is bottom-up TAM (building from customer count + spend).

Top-down TAM (from analyst reports): Often £10-15B (different methodology, narrower scope).

Use both to triangulate realistic TAM estimate.

**TAM and Funding**

VCs care about TAM (determines growth ceiling):

- TAM <£500M: Hard to get funded (too small)
- TAM £500M-5B: Good (venture-scale)
- TAM >5B: Excellent (huge potential)

Example:

Company in £3B TAM:
- Capture 1% = £30M revenue (achievable venture outcome)
- Capture 5% = £150M revenue (exceptional outcome)
- Capture 10% = £300M revenue (rare, dominant player)

Company in £50B TAM:
- Capture 1% = £500M (typical venture outcome)
- Capture 5% = £2.5B (exceptional)
- Capture 10% = £5B (dominant)

Larger TAM allows larger revenue potential (more attractive to investors).

**TAM Trends**

Some markets growing, others shrinking:

Growing TAM:
- Cloud infrastructure (moving from on-prem to cloud)
- AI/ML tools (new market, growing fast)
- Privacy/security software (regulatory requirements increasing spend)
- TAM expanding 20-50% annually

Declining TAM:
- On-premise software (shifting to cloud)
- Fax/traditional comms (declining technology)
- TAM declining 5-10% annually

It's easier to win in growing TAM (rising tide lifts boats).

**Competitive Position in TAM**

Market leadership:
- Leader: 30-50% market share (Salesforce in CRM)
- Strong #2: 15-25% market share (Microsoft Dynamics)
- Contenders: 5-15% market share (SAP, Oracle, others)
- Niche players: <5% market share

Your positioning relative to TAM:
- If TAM £3B and you're £100M revenue = 3.3% market share
- Possible outcomes: Reach #2 (15-25%), or become niche player
- Growth trajectory needs to support ambition

**Market Sizing Exercise**

Example: SaaS project management tool

TAM estimate:

Segment 1: Software development teams
- Count: 50K engineering teams globally (£0-50B revenue companies)
- Project management spend/team: £2K/year average
- TAM: 50K × £2K = £100M

Segment 2: Professional services
- Count: 10K professional services firms
- Project management spend/firm: £10K/year average
- TAM: 10K × £10K = £100M

Segment 3: IT operations/infrastructure
- Count: 5K IT operations teams
- Project management spend/team: £5K/year average
- TAM: 5K × £5K = £25M

Total TAM estimate: £225M

This is smaller than expected (if hoped for £1B+ TAM).

Question: Is £225M TAM enough? (Only if can dominate segment or expand to adjacent markets.)
`
      },
      {
        heading: "Competitive Positioning and Differentiation",
        body: `How you position yourself relative to competitors.

**Competitive Landscape Mapping**

Plot competitors on key axes:

Axis 1: Growth rate (Y-axis)
Axis 2: Unit economics / Profitability (X-axis)

Example: Email marketing software market

High growth, low profitability:
- Startup competitor A: 80% growth, -10% margin (investing in growth)
- Startup competitor B: 60% growth, 0% margin (breaking even)

Moderate growth, moderate profitability:
- Mid-size player: 30% growth, 15% margin (balanced)

Low growth, high profitability:
- Incumbent: 10% growth, 40% margin (established, profitable)

Where to position yourself?
- If aspiring to be highest growth: Invest in growth (compete with startups)
- If want to be profitability leader: Focus on margins (compete with incumbents)
- If want to compete in middle: Balanced strategy

Most startups position as "high growth, negative margin" (accepting losses for growth).

**Differentiation Strategies**

How to win in competitive market:

Strategy 1: Product differentiation
- Build better product (faster, more features, better UX)
- Example: Slack (better than email + chat alternatives)

Strategy 2: Price differentiation
- Price lower (volume play) or higher (premium quality)
- Example: Zapier (lower price, self-serve) vs Custom solutions (high price, enterprise)

Strategy 3: Service differentiation
- Superior customer success, support, onboarding
- Example: Salesforce (expensive, but best support)

Strategy 4: Vertical differentiation
- Focus on specific industry/vertical (SMB vs Enterprise)
- Example: Klaviyo (focus on e-commerce, beat general email tools)

Strategy 5: Market access differentiation
- Unique go-to-market (partnerships, channel)
- Example: Shopify app store (app distribution, partner ecosystem)

Most successful startups use combination:
- Better product + Lower price (disruption)
- Or Better service + Higher price (premium)

**Competitive Advantage (Moat)**

What prevents competitors from catching you?

Moat types:

1. Network effects
- More customers = More value (example: Stripe, where more merchants = better liquidity = better rates)

2. Switching costs
- Hard to leave once adopted (example: Salesforce, where data lock-in, customization make switching expensive)

3. Brand
- Customers prefer your brand (example: Slack, iconic brand)

4. Cost advantage
- You can produce cheaper (example: AWS, scale advantages)

5. Technology/patents
- You have proprietary tech (example: Datadog's monitoring stack)

6. Data advantage
- More data = Better product (example: Google Search, more search data = better results)

Without moat, easy for competitors to copy.

**Benchmarking Against Competitors**

Compare metrics against public comps:

| Metric | You | Competitor A | Competitor B | Benchmark |
|--------|-----|--------------|--------------|-----------|
| Growth | 40% | 30% | 20% | You winning |
| Churn | 2.5% | 2% | 3% | Competitor A winning |
| LTV/CAC | 4x | 6x | 3x | Competitor A winning |
| CAC Payback | 9 mo | 6 mo | 12 mo | You middle |
| Gross Margin | 75% | 80% | 70% | Competitor A winning |
| NRR | 110% | 120% | 100% | Competitor A winning |

Assessment: Competitor A better across the board (strong position).
You have growth advantage but unit econ disadvantages.

Questions:
- Why is your churn higher? (Product issue?)
- Why is your LTV/CAC lower? (Less efficient acquisition or lower ARPU?)
- Can you close gaps? (Improve retention, raise pricing)

**Competitive Intelligence**

Gather competitive data:

1. Public company reports (10-K, earnings calls)
2. Analyst reports (Gartner, Forrester)
3. Customer interviews ("Why did you choose competitor?")
4. Product analysis (try competitor product, audit features)
5. Pricing intelligence tools (Airtable Pricing, etc.)
6. Sales intel (talk to sales reps, get pricing)

Organize in competitive analysis document:

Competitor A:
- Founded: 2015
- Funding: £500M Series D
- ARR estimate: £100M (50% growth)
- Churn estimate: 2-3% (calculated from funding + growth)
- Positioning: "Enterprise-first, vertical-specific"
- Strengths: Strong brand, established customer base
- Weaknesses: Slow to innovate, expensive
- Opportunity: Be faster, cheaper, more innovative

Use competitive analysis to refine strategy.
`
      },
      {
        heading: "Market Trends and Category Dynamics",
        body: `Understanding where your market is heading.

**Growth Trajectory of Category**

Market growth rate affects company valuation:

Growing category (AI tools, cloud infrastructure):
- TAM expanding 30-50% annually
- Easy to find growth (rising tide)
- Multiple valuation premium (8-12x vs 5-8x mature)

Flat category (email, CRM):
- TAM growing 5-10% annually
- Growth comes from market share, not category growth
- Standard valuation multiple

Declining category (on-prem software):
- TAM shrinking 10-20% annually
- Headwind to growth
- Valuation discount (3-5x multiple)

If in growing category, easier to grow company (category tailwind).
If in flat/declining, need to be better than competitors.

**Category Maturity**

Adoption curve:

Early stage (< 10% adoption):
- High growth potential (lots of non-adopters)
- Examples: AI tools, blockchain, Web3

Growth stage (10-50% adoption):
- Strong growth, increasing competition
- Examples: Cloud infrastructure, SaaS

Mature stage (50%+ adoption):
- Consolidation, competition on features + price
- Examples: Email, CRM

Positioning in mature category:
- Hard to get funded (growth limited to market share gains)
- Better to focus on profitability and returns
- M&A likely outcome (not independent billion-dollar exit)

Positioning in growth category:
- Easy to get funded (growth from category adoption)
- Better to focus on growth, accept losses
- Exit through IPO or strategic acquisition at high multiple

**Emerging Trends in Your Category**

Monitor industry trends:

Trends in email marketing (example):
- Consolidation (Klaviyo acquired Privy, Klaviyo bought SMSBump)
- Feature expansion (email + SMS + push notifications = unified platform)
- AI integration (AI-powered copy, send-time optimization)
- Privacy changes (Apple Mail Privacy Protection impacting open rates)

Each trend is opportunity or threat:

Consolidation trend:
- Threat: Larger players acquire niche competitors
- Opportunity: Sell to larger player, acquire smaller competitors

Feature expansion:
- Threat: General email tools adding SMS (eroding SMS specialists)
- Opportunity: Add SMS yourself, become unified platform

AI integration:
- Threat: Competitors incorporating AI
- Opportunity: Lead on AI, differentiate

Monitor trends and adjust product roadmap / positioning.

**Sizing Competitive Opportunity**

If win market share in TAM:

Assume TAM £2B:
- Your target: Capture 5% = £100M ARR
- How long: 10 years (ambitious but achievable)
- Growth path: Start at £1M, double every 18-24 months

Timeline:
- Year 1: £1M
- Year 2: £2M
- Year 3: £4M
- Year 4: £8M
- Year 5: £16M
- Year 6: £32M
- Year 7: £64M
- Year 8: £128M (exceeds 5% TAM target)

This is 50% CAGR (compound annual growth rate) for 8 years.
Achievable for hot startup with good market fit.

**Concentration Risk in Competition**

If market highly concentrated (few large players):

- HubSpot dominates marketing automation (40%+ market share)
- Salesforce dominates CRM (25%+ market share)

Risk: Incumbent advantage (hard to dislodge).
Opportunity: Adjacent market (Hubspot expanded from marketing to sales to service).

If market fragmented (many small players):

- Email marketing (many tools, no dominant player)
- Risk: Low barriers to entry, intense competition, low margins
- Opportunity: Consolidate market (acquire competitors, become leader)

Market structure affects strategy (fight incumbent vs compete on features).
`
      },
      {
        heading: "Using Competitive Analysis for Strategy",
        body: `How competitive analysis drives business decisions.

**Competitive Positioning Statement**

Based on analysis, write positioning:

Example 1 (Startup disrupting incumbent):
"While [Incumbent] focuses on [segment] with [weakness], we serve [your target] with [strength]. Our [differentiation] is faster, cheaper, better."

Example 2 (Niche player):
"For [specific vertical], we are the only [product type] that does [unique capability]. Competitors either don't serve this vertical or lack [key feature]."

Example 3 (Premium player):
"Unlike [mass-market competitors], we offer [premium features] for enterprises that need [advanced capability]. Worth 2-3x price for [specific ROI]."

**Competitive Strategy Decisions**

Use analysis to make strategic choices:

Should we match competitor pricing?
- If competitor lower-cost leader: No, compete on quality/service instead
- If competitor in premium: Maybe (position between premium/budget)
- If competitor near your price: Yes, maintain price parity

Should we copy competitor features?
- If feature table showing missing features: Maybe (close gap)
- If feature barely used by customers: No (distraction)
- If feature creates switching costs: Yes (must-have)

Should we enter adjacent market?
- If adjacent market has same customer, different problem: Yes (upsell)
- If adjacent has different customer, same problem: Maybe (different sales model)
- If adjacent market shrinking: No (declining opportunity)

**Competitive Win/Loss Analysis**

Track deal outcomes against competitors:

Won deals:
- Reason: "Better onboarding", "Lower price", "Faster implementation"
- Pattern: If 70% wins say "lower price", maybe you're price leader

Lost deals:
- Reason: "Competitor had feature X", "Better support", "Cheaper"
- Pattern: If 50% losses say "feature X", prioritize that feature

Use patterns to refine product, positioning, pricing.

**Market Share Targets**

Based on competitive position, set ambitions:

Conservative: Capture 2% market share in TAM
- TAM £2B × 2% = £40M revenue target
- Timeline: 8-10 years
- Implies steady growth, not blockbuster

Aggressive: Capture 5-10% market share
- TAM £2B × 5-10% = £100-200M revenue target
- Timeline: 7-10 years
- Requires winning against incumbents, strong execution

Dominant: Capture 20%+ market share
- TAM £2B × 20% = £400M revenue target
- Timeline: 10-15 years
- Rare outcome, requires exceptional team + product + luck

Pick target that matches your ambitions and fundraising strategy.
`
      }
    ],
    relatedSlugs: [
      "product-market-fit-definition-measurement",
      "saas-valuation-and-multiples",
      "pricing-psychology-and-packaging",
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's TAM and why does it matter?",
        a: "TAM (Total Addressable Market) = total revenue available if you captured 100% of market. Example: Email marketing TAM £10B. VCs care about TAM (determines growth ceiling). TAM <£500M hard to fund, £500M-5B good venture-scale, >£5B excellent. Build TAM bottom-up (# customers × spend) to be realistic."
      },
      {
        q: "How do I compare myself to competitors?",
        a: "Benchmark metrics: Growth %, churn, LTV/CAC, margins. Compare against public comps (if available) or peer estimates. Questions: Where are you winning? Where losing? Can you close gaps? Use competitive analysis to inform product, pricing, positioning. Win/loss analysis (why did we win/lose deals?) reveals competitive gaps."
      },
      {
        q: "What's a competitive moat and do I need one?",
        a: "Moat = advantage preventing competitors from catching you. Types: Network effects, switching costs, brand, cost advantage, proprietary tech, data. Not all companies need moat (some win on execution). But defensible moat (hard to copy) makes company valuable long-term. Build moat through switching costs or network effects if possible."
      },
      {
        q: "Should I focus on TAM growth or market share?",
        a: "If TAM growing 30%+ (category tailwind), focus on growth (TAM expansion carries you). If TAM flat/shrinking (no tailwind), focus on market share (steal from competitors). Growing category easier to fund/grow. Declining category requires being exceptional to grow."
      }
    ],
    videoUrl: ""
  }
];

export default batch132Articles;
