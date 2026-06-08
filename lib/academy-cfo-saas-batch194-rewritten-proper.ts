import { AcademyArticle } from "@/types/academy";

export const batch194Articles: AcademyArticle[] = [
  {
    slug: "market-sizing-and-tam-analysis",
    title: "Market Sizing and TAM Analysis: Understanding Market Opportunity",
    description: "Master market sizing. Calculate TAM/SAM/SOM, validate market opportunity, and plan expansion.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "TAM analysis",
      "market sizing",
      "SAM",
      "SOM",
      "total addressable market",
      "serviceable market",
      "market opportunity",
      "market research",
      "addressable market",
      "market validation"
    ],
    keyTakeaways: [
      "TAM/SAM/SOM: TAM (total addressable market, all possible customers worldwide) = £10B. SAM (serviceable addressable market, realistic addressable given strategy) = £1B. SOM (serviceable obtainable market, realistic in 5 years) = £100M. Example: Finance software TAM £50B (all companies), SAM £5B (mid-market + enterprise), SOM £500M (if win 10% of SAM). Investors want: TAM >£1B (large enough), SOM >£100M (realistic upside). Red flag: TAM £100M (too small, not venture-scale).",
      "Two methods: Top-down (£ revenue in market from analyst reports) vs Bottom-up (# of companies × price per company). Example top-down: Research says midmarket SaaS market £5B → SAM for FP&A software 10% = £500M. Bottom-up: 5000 mid-market companies × £50K average spend = £250M (compare, should roughly align). Validate: Interview 10 customers, ask 'What else do you pay for this category?' to find true market. Beware: Analysis paralysis (takes months, but TAM is directional anyway).",
      "Use in strategy: Small TAM (£500M) = need 20% market share for £100M revenue (aggressive, risky). Large TAM (£50B) = can be 0.2% share for £100M revenue (more achievable). Expansion: If current market (£5B) plateau at £50M revenue, expand to adjacent market (new use case, new geography, £10B TAM) to grow beyond. Example: Start in Finance, expand to HR (new market, 5x more opportunity)."
    ],
    content: [
      {
        heading: "TAM/SAM/SOM Framework",
        body: `Defining market opportunity.

**Definitions**

TAM (Total Addressable Market):
- Entire market opportunity available
- If everyone in the world bought your product, what's the £ size?
- Example: Finance software TAM = all companies globally needing finance tools
- Size: Typically £10B-100B+ for large categories

SAM (Serviceable Addressable Market):
- Market you can realistically target given your strategy
- Subset of TAM based on geography, customer size, use case
- Example: Finance software SAM (if targeting mid-market + enterprise in US/Europe only) = £5B (vs £50B global)
- Size: Typically £1B-£10B

SOM (Serviceable Obtainable Market):
- What you realistically can capture in 5-10 years
- Based on your growth rate, competitive position, market share goals
- Example: Finance software SOM (if win 10% of SAM) = £500M
- Size: Typically £100M-£1B (for venture-scale company)

Example: Expense management software
- TAM: £100B (all companies globally spend on expenses)
- SAM: £10B (mid-market companies US/Europe willing to adopt SaaS)
- SOM: £1B (if win 10% of SAM)

Example 2: Vertical SaaS (finance software for non-profits only)
- TAM: £10B (all non-profits globally with budgets)
- SAM: £500M (non-profits in US/UK with >£1M budgets)
- SOM: £50M (if win 10% of SAM)

**Investor Perspective**

Investor thesis:
- TAM must be >£1B (venture-scale opportunity)
- If TAM <£1B, company capped at £100M revenue (less interesting for VC)
- SOM must be >£100M (realistic upside, allows 5-10x growth)
- If SOM <£100M, path to venture outcomes limited

Example evaluations:
- ✓ Company 1: TAM £50B, SAM £5B, SOM £500M (attractive, venture-scale)
- ✗ Company 2: TAM £500M (too small, not venture-scale)
- ✓ Company 3: TAM £10B, SAM £1B, SOM £100M (minimum threshold, acceptable)
- ✗ Company 4: SOM £50M (even if large TAM, capped returns)

Expansion thesis:
- Start in market 1 (£2B TAM, target £100M SOM)
- At £50M revenue, plateau (market saturation)
- Expand to adjacent market 2 (£10B TAM, target £200M additional)
- Now path to £250M (multi-market approach)

Example: Slack
- Start: Chat for teams (£3B TAM, SOM £500M)
- Expand: Workflow automation (£10B TAM, SOM £2B additional)
- Path: Multi-product, multi-market, now £5B+ valuation company

**Market Sizing Formula**

Top-down:
- Research: What's analyst estimate for market?
- Example: Gartner says FP&A software market £3B annually
- Adjust: What % is US vs Europe vs Asia? (80%, 15%, 5%)
- Refine: What % is mid-market vs enterprise? (60%, 40%)
- SAM: If targeting mid-market in US, SAM = £3B × 80% × 60% = £1.44B

Bottom-up:
- Count: How many potential customers exist?
- Example: £100K+ revenue companies in target market = 50,000 globally
- Price: What would they spend annually? £30K average
- TAM: 50,000 × £30K = £1.5B

Validation:
- Top-down and bottom-up should be within 2-3x (if 10x apart, one method is wrong)
- Interview customers: "What do you currently spend on this problem?" "What else do you use?"
- Competitive data: How big are competitors? Revenue / market share = market size
- Example: Competitor £100M revenue, 10% market share = £1B market

`
      },
      {
        heading: "Two Approaches to Market Sizing",
        body: `Detailed methodology.

**Top-Down Approach**

Start with analyst report:
- Gartner, Forrester, IDC publish market size reports
- Example: "SaaS market size £150B in 2024, growing 20% annually"
- Refine: Find reports specific to your category
  - Example: "FP&A software market £3B in 2024"

Adjust for geography:
- Is report global? US? Europe?
- Refine: If global report, research geographic split
- Example: £3B market = 50% US (£1.5B), 30% Europe (£900M), 20% rest (£600M)
- Your target: £1.5B US + £900M Europe = £2.4B (if targeting US/Europe)

Adjust for customer segment:
- Is report all company sizes? Or specific (SMB, mid-market, enterprise)?
- Example: £2.4B market split by company size = 20% SMB, 50% mid-market, 30% enterprise
- Your target (if mid-market + enterprise): £2.4B × 80% = £1.92B

Adjust for use case:
- Does your solution address only part of category?
- Example: If you're FP&A tool but broader "finance software" market includes AP, AR, GL
- Your share: 30% of finance software is FP&A = £1.92B × 30% = £576M (SAM)

Result: SAM ≈ £600M (example)

Validation:
- Does this feel right? Interview 5 customers: "Total market for FP&A?" Usually they have a sense
- Competitive check: If top 3 competitors have £500M combined revenue at 10% market share, market is £5B (vs your £600M, off by order of magnitude, revise)

**Bottom-Up Approach**

Identify total universe:
- How many potential customers exist in target market?
- Example: Companies with £1M-£100M revenue (mid-market) in US/Europe
- Data sources: Apollo, ZoomInfo, LinkedIn (€ spend for lists)
- Count: 50,000 companies fit profile

Estimate average spend:
- Survey: Ask 10 customers "How much do you spend on FP&A tools per year?"
- Typical answer: £20K-£50K, average £30K
- Validate: Look at competitor pricing (SaaS typical £2K-£5K per user, 4-8 users average = £8K-£40K)
- Estimate: £30K average annual spend

Calculate TAM:
- 50,000 companies × £30K per year = £1.5B
- This is TAM (all possible companies worldwide willing to spend on category)

Adjust to SAM:
- Above was global. If you're only targeting US/Europe, adjust
- Example: 50,000 global, 70% in US/Europe = 35,000 addressable
- SAM: 35,000 × £30K = £1.05B

Validation:
- Sanity check: Does £30K average feel right?
- Interview: "Are there cheaper alternatives? More expensive?" to confirm range
- Competitive: Are competitors' pricing aligned? (If market average £30K and competitor charges £200K, either premium player or market smaller than estimated)

**Comparison and Reconciliation**

Compare top-down (analyst) vs bottom-up (customer count):
- Top-down SAM: £600M
- Bottom-up SAM: £1B
- Gap: 40% difference (within 2x, acceptable)

If gap >2x:
- Diagnose: Which method wrong?
- Top-down: Analyst data may be dated or incorrect (validate with other reports)
- Bottom-up: Customer count or average spend may be off (interview more customers)
- Iterate: Use both approaches, triangulate

Best practice:
- Use both methods
- Report range: "SAM is £600M-£1B (analyst reports) to (bottom-up customer count)"
- Use midpoint for planning: £800M SAM

`
      },
      {
        heading: "Market Expansion and SOM Planning",
        body: `Planning growth through market expansion.

**Expanding Beyond Core Market**

Core market plateau:
- Start: Finance software for mid-market companies (£1B SAM)
- Growth: Win market share → £50M revenue (5% of SAM)
- Plateau: Hard to grow beyond £50M in single market (might be <10% share reachable)

Expansion strategy:
- Option 1: Vertical expansion (same customer type, new use case)
  - Example: Finance software → HR software (same mid-market, different problem)
  - New TAM: £10B (all mid-market problems)
  - Additional SOM: £500M (if win 5% of HR market)
  - Path to £500M total revenue

- Option 2: Horizontal expansion (same use case, new customer type)
  - Example: Finance software for mid-market → enterprise
  - New SAM: £5B (enterprise finance software)
  - Additional SOM: £500M (if win 10%)
  - Path to £500M total revenue

- Option 3: Geographic expansion (same product, new geography)
  - Example: Finance software in US → Europe, Asia
  - Current: US £500M SAM, you at £50M revenue
  - Expand: Europe £400M SAM, Asia £300M SAM
  - If mature in US at £100M, expand to Europe (£50M opportunity), then Asia (£50M)
  - Path: £50M (US) + £50M (Europe) + £50M (Asia) = £150M

- Option 4: Segment expansion (same product, different company sizes)
  - Example: Finance software for mid-market → enterprise + SMB
  - Current: Mid-market £1B SAM, you at £50M revenue
  - Expand: Enterprise (more complex, higher ACV) £5B SAM
  - Expand: SMB (simpler, self-serve) £10B SAM
  - Multi-segment path: £50M (mid-market) + £100M (enterprise) + £200M (SMB self-serve) = £350M

**SOM Calculation by Stage**

Stage 1 (Years 1-2): Core market penetration
- Market: Finance software for mid-market
- SAM: £1B
- Market share goal: 2-3%
- SOM: £20M-£30M
- Revenue target: £20M by year 2

Stage 2 (Years 3-5): Expand to adjacent market
- Add: Enterprise segment (£5B SAM)
- Market share goal: 1% enterprise
- SOM: £20M-£30M (additional)
- Total SOM: £50M (core) + £50M (enterprise) = £100M
- Revenue target: £100M by year 5

Stage 3 (Years 5-10): Build multi-product, multi-market platform
- Add: New verticals (HR, operations, etc.)
- Market: £50B+ multi-product opportunity
- Market share: 1-2% of total
- SOM: £500M+
- Path to unicorn status

**Validating Market Opportunity**

Talk to customers:
- Interview 10 customers in target market
- Ask: "What other products do you use for this category?"
- Identify: Who's a competitor? What's the incumbent solution?
- Learn: Where do customers want innovation? What's missing?

Monitor competitor growth:
- If competitor raising £100M Series B at £1B valuation, market is real
- If all competitors failing to scale, maybe market is smaller than estimated

Watch for market shifts:
- New entrant disrupting category = market expanding or consolidating
- Emerging use cases = new adjacent markets opening

`
      }
    ],
    relatedSlugs: [
      "competitive-analysis-and-market-positioning",
      "product-market-fit-and-validation",
      "funding-and-investment-rounds",
      "pricing-strategy-and-price-optimization",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's the difference between TAM, SAM, and SOM?",
        a: "TAM (Total Addressable Market): All possible customers globally. Example: Finance software TAM = £50B (all companies). SAM (Serviceable Addressable Market): Market you can realistically target. Example: Mid-market + enterprise in US/Europe = £5B (vs £50B global). SOM (Serviceable Obtainable Market): What you can capture in 5-10 years. Example: If win 10% of SAM = £500M. Investor wants: TAM >£1B (venture-scale), SOM >£100M (realistic upside)."
      },
      {
        q: "How do I calculate market size?",
        a: "Two methods: (1) Top-down: Research analyst report (£3B market), adjust for geography and segment (80% US, 60% mid-market = £1.44B). (2) Bottom-up: Count customers (50,000 mid-market companies) × average spend (£30K) = £1.5B. Both methods should be within 2x. If not, one is wrong (revise). Best: Use both, report range, use midpoint."
      },
      {
        q: "What if my TAM is small?",
        a: "Problem: If TAM <£1B, company capped at £100M revenue (hard to grow beyond that). Solution: Expand to adjacent markets (add new use case, new segment, new geography). Example: Finance software (£1B TAM) + HR software (£10B TAM) = £11B total TAM. Or: Expand vertically (same problem, different industries). Plan expansion from day one."
      },
      {
        q: "How should I expand to new markets?",
        a: "Stage 1: Dominate core market (reach £50M revenue in £1B SAM = 5%). Stage 2: Expand to adjacent market (new use case or customer segment). Stage 3: Multi-product, multi-market platform. Example: Start finance mid-market (£1B) → add enterprise (£5B) → add SMB (£10B) → add other verticals (£50B+). Each expansion takes 2-3 years (new GTM, different sales motion)."
      }
    ],
    videoUrl: ""
  }
];

export default batch194Articles;
