import { AcademyArticle } from "@/types/academy";

export const batch342Articles: AcademyArticle[] = [
  {
    slug: "market-sizing-and-tam-analysis",
    title: "Market Sizing and TAM Analysis: Understanding Market Opportunity",
    description: "Master market sizing. Calculate TAM, identify opportunity, validate demand.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["TAM", "total addressable market", "market sizing", "SAM", "SOM", "market opportunity"],
    keyTakeaways: [
      "TAM (Total Addressable market): Total value if company captured 100% of market. Calculated: (# potential customers) × (annual spend per customer). Example: 10M companies in US, spend £5K/year on HR software = £50B TAM. Importance: Investors care (is market big enough?), strategy (which segments to target?). Large TAM (£10B+) needed for venture-scale returns.",
      "Market sizing methods: (1) Top-down (market research, analyst reports), (2) Bottom-up (count customers, calculate unit economics), (3) Comparison (similar companies, market share extrapolation). Each method has errors (±50% typical). Use multiple methods (validate across approaches). Example: Top-down £50B TAM, bottom-up £30B TAM, average £40B (reasonable estimate).",
      "TAM segmentation: Break into SAM (Serviceable Addressable Market, what you can reach) and SOM (Serviceable Obtainable Market, what you realistically capture). Example: HR software £50B TAM, but you focus on SMB (£10B SAM). Year 1 goal 1% of SAM = £100M revenue (realistic? £50M 5-year plan = 50% of SAM ambitious but possible). Planning: Start narrow (SOM), expand over time (SAM, TAM)."
    ],
    content: [
      {
        heading: "Sizing Markets and Calculating Addressable Opportunity",
        body: `Understanding market potential and identifying addressable segments.

**Market sizing fundamentals**

Definition:
- TAM (Total Addressable Market): Total revenue opportunity if 100% capture
- SAM (Serviceable Addressable Market): Market you can realistically reach
- SOM (Serviceable Obtainable Market): Market you expect to capture in planning horizon

Relationship:
- TAM: Entire market (broadest)
- SAM: Segment you target (narrower)
- SOM: Your realistic capture (narrowest, 5-10 year plan)

Example:

All companies globally need HR software: £500B TAM
Companies in US/UK needing HR: £80B SAM (geographic focus)
SMB companies in US/UK (your segment): £15B SAM (size focus)
Your realistic capture (5-year plan): £500M SOM (3% of SMB segment)

**TAM calculation methods**

Method 1: Top-down (market research)

Approach:
- Find market research (analyst firms, industry reports)
- Look for "market size" and "CAGR" (compound annual growth rate)
- Example: Gartner reports HR software market £20B in 2023, growing 8% annually

Calculation:
- Current TAM: £20B (from report)
- Growth rate: 8% annually
- 5-year TAM: £20B × (1.08^5) = £29.4B

Pros:
- Uses professional research (credible)
- Considers market trends

Cons:
- Reports expensive (£5-50K)
- May not match your definition (too broad/narrow)
- Historical data (may be outdated)

Method 2: Bottom-up (customer-based)

Approach:
- Count potential customers (addressable market)
- Estimate annual spend per customer
- Multiply

Example:

Define customer:
- Target: US mid-market companies (100-1000 employees)
- Count: Market research or LinkedIn suggests 50,000 such companies

Estimate spend:
- Current: Companies spend £2-5K/year on HR tools (includes payroll, benefits, recruitment)
- Your focus: Recruitment automation = £200-500/year
- Estimate: £350/year average

TAM calculation:
- 50,000 companies × £350/year = £17.5M TAM (just recruitment piece)

Note: Much smaller than top-down (£20B), because focused narrowly

Pros:
- Custom to your segment
- More realistic for your market

Cons:
- Hard to count customers accurately
- Spend estimates may be wrong
- Time-consuming

Method 3: Comparison (analogous markets)

Approach:
- Find similar company, their TAM
- Scale to your market

Example:

Similar company: Recruitment.com (recruitment software)
- TAM: £10B (from analyst report)
- Market penetration: 2% (they have 1% market share)

Your market: HR software
- Similar size to recruitment (slightly larger)
- Estimate TAM: £15-20B
- Adjust: Your focus (SMB only) = £5B SAM

Pros:
- Uses precedent (less guessing)
- Grounded in reality

Cons:
- Markets may not be truly comparable
- Historical data

**Example TAM analysis**

Product: Sales analytics for mid-market companies

Top-down approach:

Research:
- Sales Tech market: $10B globally (analyst report)
- Growth: 10% CAGR
- Your segment (mid-market, $5-100M revenue): ~30% of market = $3B

Bottom-up approach:

Define customer:
- Mid-market companies: ~30,000 globally
- Average software spend on sales tools: $15-25K/year per company
- Estimate: $20K/year

TAM:
- 30,000 × $20K = $600M

Comparison approach:

Similar products:
- Salesforce: Dominates market, ~$30B revenue (but all market, not just mid-market)
- Pipedrive: $150M revenue, mid-market focused (2% share)
- Extrapolate: If Pipedrive is 2% market share, total market = $150M / 2% = $7.5B

Average of methods:
- Top-down: $3B
- Bottom-up: $600M
- Comparison: $7.5B
- Average: $3.7B (order of magnitude, $1-5B range)

Reasonable estimate: $3-5B TAM for your segment

**SAM and SOM planning**

TAM to SAM (narrowing down)

Full TAM: Sales analytics across all companies = $50B globally
Geographic focus: US/EU only = $30B
Company size: Mid-market (€5-100M revenue) = $10B SAM

That's your addressable market (can realistically reach)

SAM to SOM (5-year planning)

SAM: $10B (what you can reach)
Market share target: 2% (realistic, not dominated by incumbents)
SOM: $10B × 2% = $200M 5-year revenue goal

Sanity check:
- Current: $0 (new company)
- Year 1: $2M revenue (20 customers at $100K each)
- Year 2: $8M (20 → 80 customers, 50% CAC payback)
- Year 3: $25M (80 → 250 customers)
- Year 4: $65M (250 → 650 customers)
- Year 5: $150M (650 → 1,500 customers)

Feasibility:
- Growth 50%+ annually (reasonable for $1-10M stage)
- Customer count: 1,500 customers in year 5 (out of 30,000 = 5% market share)
- Realistic: Yes, if execution good

**Market sizing mistakes**

Mistake 1: Enormous TAM

Problem:
- "Total market if everyone used software = $100B!"
- Reality: Not everyone will adopt (incumbents, price sensitivity)

Fix:
- SAM (realistic addressable) more important
- Focus on who you can actually reach

Mistake 2: No segmentation

Problem:
- Treat market as homogeneous (all customers same)
- Reality: Enterprise ≠ SMB ≠ non-profit (different needs, pricing)

Fix:
- Segment by customer type
- Calculate SAM for each
- Strategy: Start narrow (SOM in one segment), expand

Mistake 3: Cherry-picked methods

Problem:
- Use only top-down when it shows big TAM
- Ignore bottom-up if it shows small TAM

Fix:
- Use multiple methods
- If divergent, investigate (might discover real market issue)
- Average (acknowledge range of estimates)

Mistake 4: Static TAM

Problem:
- Calculate once, never update
- Reality: Markets grow/shrink, competition evolves

Fix:
- Annually revisit TAM (market research, competitive changes)
- Adjust strategy (market shrinking = pivot needed?)

**Using TAM for strategy**

TAM informs:

Strategy question 1: Is market big enough?

Rule of thumb: £1B+ TAM needed for venture-scale returns (100x)
- If £100M TAM, hard to reach £10B company (math doesn't work)
- If £10B TAM, possible to reach £1B company (10% market share)

Implication: Don't start company in tiny market (exit potential limited)

Strategy question 2: Which segment to target first?

Large TAM can be achieved through different segments:
- Enterprise: £5B TAM, high ARPU, slow to land
- Mid-market: £10B TAM, mid ARPU, medium speed
- SMB: £20B TAM, low ARPU, quick to land

Choose based on:
- Capital available: Enterprise requires sales team + funding
- Timeline: SMB faster to revenue, enterprise faster to large revenue
- Competition: Enterprise crowded, SMB less so

Example: Early-stage startup should start SMB (can build to revenue quickly) then expand up-market

Strategy question 3: When to pivot?

TAM analysis helps validate market fit:
- If market too small (£50M TAM), pivot to larger market
- If market saturated (incumbents control 80%), pivot to underserved segment
- If market shrinking, exit/pivot

Signal: TAM declining 20%+ annually = red flag

**Market sizing in pitch decks**

Investor expectations:

Typical investor questions:
- "What's your TAM?" (How big is market?)
- "Can you explain SAM?" (What can you realistically reach?)
- "What's your SOM?" (What's your 5-year revenue goal?)

Pitch deck slide:

Title: Market Opportunity

Content:
- TAM: $50B (global sales analytics market)
- SAM: $10B (US/EU mid-market focus)
- SOM: $200M (2% market share, 5-year goal)

Visual: Chart showing TAM → SAM → SOM (funnel visualization)

Key messages:
- "Huge TAM (investors want big upside potential)"
- "Realistic SAM (we can reach with reasonable effort)"
- "Achievable SOM (our plan is credible)"

Red flags investors worry about:
- "TAM too small, exit can't be big enough"
- "TAM calculation seem made up (no sources)"
- "SAM unrealistic (claim 50% market share with no moat)"

Better:
- "Conservative TAM (£3-5B estimate based on multiple methods)"
- "Clear SAM logic (US/EU mid-market, 30K companies)"
- "Realistic SOM (2% market share based on comparable companies)"

`
      }
    ],
    relatedSlugs: ["product-market-fit-assessment-and-validation", "growth-rate-analysis-and-benchmarking", "financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking", "competitive-positioning-and-differentiation"],
    faq: [
      { q: "What is TAM and how do I calculate it?", a: "TAM (Total Addressable Market) = total revenue if you capture 100% of market. Formula: (# potential customers) × (annual spend per customer). Example: 50K mid-market companies × £350/year spend = £17.5B TAM. Methods: (1) Top-down (analyst reports), (2) Bottom-up (count customers), (3) Comparison (similar companies). Use multiple (validate). Investor requirement: TAM £1B+ for venture-scale company." },
      { q: "What's the difference between TAM, SAM, and SOM?", a: "TAM (Total Addressable Market) = entire market (broadest). SAM (Serviceable Addressable Market) = market you can realistically reach (narrower, geographic or segment focus). SOM (Serviceable Obtainable Market) = your 5-year revenue goal (narrowest). Example: All HR software £500B TAM, US SMB £15B SAM, your 5-year plan £500M SOM. Strategy: Start with SOM, expand to SAM, eventually TAM." },
      { q: "How do I validate my TAM?", a: "Methods: (1) Top-down (research firms, analyst reports), (2) Bottom-up (count customers, estimate spend), (3) Comparison (similar company market share). If methods diverge (£3-10B range), investigate. Use average, acknowledge uncertainty. Sanity check: 5-year plan should be 1-5% of TAM (credible, not monopolistic). Annual review: Update as market evolves." }
    ],
    videoUrl: ""
  }
];

export default batch342Articles;
