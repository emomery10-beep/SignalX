import { AcademyArticle } from "@/types/academy";

export const batch61Articles: AcademyArticle[] = [
  {
    slug: "account-based-marketing-abm-strategy",
    title: "Account-Based Marketing (ABM): Targeting High-Value Accounts with Precision",
    description: "Implement account-based marketing to target specific high-value accounts. Align sales and marketing, personalize outreach, and improve conversion rates.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "account-based marketing",
      "ABM",
      "target accounts",
      "enterprise sales",
      "marketing alignment",
      "personalized marketing",
      "account targeting",
      "sales and marketing",
      "high-value accounts",
      "ABM strategy"
    ],
    keyTakeaways: [
      "ABM = identifying 10-50 high-value target accounts and treating each as a market of one; vs. traditional marketing (spray and pray to 1000s of leads), ABM focuses resources on accounts most likely to convert (industry, company size, fit, budget aligned)",
      "ABM economics: Traditional: 1000 leads → 10% reach → 100 conversations → 5% close → 5 customers @ £25K each = £125K spend to generate £125K revenue (1x ROI). ABM: 20 target accounts → 80% reach → 16 conversations → 50% close → 8 customers @ £100K each = £30K spend to generate £800K revenue (26.7x ROI)",
      "ABM execution: 1) Identify 10-50 target accounts (ICP fit, revenue, budget), 2) Research key stakeholders (LinkedIn, web research), 3) Personalized outreach (email, LinkedIn, ads), 4) Sales-marketing alignment (AE owns each account, marketer supports with content), 5) Measure account progression (% reaching pilot, % closing)"
    ],
    content: [
      {
        heading: "Account-Based Marketing Fundamentals",
        body: `Account-Based Marketing (ABM) is a B2B marketing strategy that targets specific high-value accounts with personalized campaigns.

Traditional marketing: Create content → Buy ads → Drive leads → Sales follows up → Hope some convert

ABM: Identify target accounts → Research → Personalize outreach → Sales + marketing execute together → Close deals

Why ABM?

For enterprise SaaS (£50K+ ACV):
- Long sales cycles (6-12 months)
- Multiple stakeholders (5-7 decision makers)
- Complex buying process (RFP, legal, procurement)
- Traditional marketing inefficient (spray-and-pray)

ABM is more efficient:
- Focus on accounts most likely to buy
- Align sales and marketing on same accounts
- Personalize based on company research
- Higher conversion rates (50%+ vs. 2-5% traditional)

**ABM Model: One-to-One vs. One-to-Few**

One-to-One ABM (enterprise):
- Target: 5-20 accounts
- ACV: £500K+ (enterprise)
- Effort: Very high (dedicated team per account)
- Conversion: 30-50%
- Example: 10 target accounts, 5 close = 50% conversion

One-to-Few ABM (mid-market):
- Target: 20-100 accounts
- ACV: £50-200K (mid-market)
- Effort: Medium (one AE per account, shared marketing support)
- Conversion: 15-30%
- Example: 50 target accounts, 10 close = 20% conversion

One-to-Many ABM (SMB):
- Target: 100-1000 accounts
- ACV: £5-50K (SMB)
- Effort: Low (self-serve, marketing-led)
- Conversion: 5-10%
- Example: 500 target accounts, 25 close = 5% conversion

Most mid-market SaaS use One-to-Few (best balance of effort and ROI).

**Selecting Target Accounts**

ICP (Ideal Customer Profile) definition:

Firmographic filters:
- Industry: Financial services, healthcare, tech, retail, etc.
- Company size: 100-500 employees (for mid-market example)
- Revenue: £10-100M annually
- Location: US, UK, Europe

Behavioral filters:
- Using competitive product (competitive intelligence)
- Hiring in your space (job postings)
- Recent funding/growth (Crunchbase, news)
- Published budget/RFP

Example: Select 50 accounts matching:
- Industry: Financial services or healthcare
- Size: 200-1000 employees
- Revenue: £20-200M
- Recent funding or headcount growth (last 12 months)
- Currently using competitor

Result: 50 target accounts (one-to-few ABM), each AE gets 5-10 accounts.

**ABM Campaign Design**

For each target account:

Research phase (1 week):
- Company website: Business, products, culture
- LinkedIn: Key stakeholders (CEO, CFO, VP Operations, etc.)
- Recent news: Funding, acquisitions, product launches
- Current vendors: What tools do they use?
- Technical stack: What infrastructure do they have? (Capterra, G2, public APIs)

Personalized outreach (ongoing):
- Email: Personalized to each stakeholder (not generic template)
  - "Hi [Name], I noticed [Company] launched [product] last month, congrats! That probably required rethinking your operations workflow. We help companies like [competitor name they use] improve that process by 40%. Worth a quick chat?"

- LinkedIn: Connection + DM (if natural)
  - Connection message: Personalized reference to company/role
  - Follow-up DM if no response in 1 week

- Targeted ads: Retargeting account employees
  - Company-based targeting: LinkedIn, 6sense (IP-based targeting)
  - Ad message: Personalized to company (not generic)
  - Example: "Financial services leaders optimizing operations: Here's how [case study company] saved 30% on workflow costs"

- Webinar/event: Invite key stakeholders
  - Personalized invite email
  - Topic relevant to their company
  - Small group (5-10 people from target accounts) vs. large webinar

Content marketing:
- Research-based content addressing their specific pain points
- Case studies from competitors/similar companies
- ROI calculator for their use case
- Executive brief (1-page, specific to their industry)

Sales + marketing alignment:
- AE owns account relationship
- Marketer creates personalized content for account
- Marketing also supports with: introductions, webinars, research, competitor intel

**ABM Measurement**

Track by account:

| Account | Status | Engagement | Conversations | Stage | Progress |
|---------|--------|-----------|-----------|-------|----------|
| Bank A | Active | LinkedIn connection, 2 emails opened | 1 discovery call | Qualified | 25% |
| Bank B | Active | Webinar attended, 3 emails opened | 2 calls | Discovery | 40% |
| Bank C | Active | No engagement yet | 0 calls | Prospect | 0% |
| Bank D | Closed | Email opened, 1 call | 3 calls, demo | Closed Won | 100% |
| Bank E | Churned | 0 engagement | 0 calls | Prospect | 0% |

Metrics:

1. **Engagement rate**
   - % of target accounts engaging (email open, click, form fill, webinar attend)
   - Healthy: 40-50% (half of targets engaged)

2. **Conversation rate**
   - % of engaged accounts that have discovery conversation
   - Healthy: 50-75% (half of engaged convert to conversation)

3. **Qualified rate**
   - % of conversation accounts that qualify to pipeline
   - Healthy: 50-75%

4. **Close rate**
   - % of qualified accounts that close
   - Healthy: 30-50% (much higher than traditional 2-5%)

5. **Time to close**
   - Days from first engagement to close
   - Typical: 90-180 days (long enterprise cycles)

6. **ABM ROI**
   - Revenue closed from ABM accounts ÷ ABM spend
   - Healthy: 10-20x ROI

Example ABM campaign:

50 target accounts → 25 engaged (50%) → 15 conversations (60% of engaged) → 10 qualified (67% of conversation) → 5 close (50% of qualified)

Revenue: 5 customers @ £100K each = £500K
Cost: ABM team (1 marketer, coordination) £50K + tools £10K = £60K
ROI: £500K ÷ £60K = 8.3x

**ABM Tools and Technology**

6sense, Demandbase, LinkedIn Sales Navigator:
- Account targeting (identify in-market accounts)
- Buying signals (AI detects accounts showing purchase intent)
- Waterfall accounts (prioritize by buying stage)
- Advertising (account-based ads on LinkedIn, web)

Cost: £5-50K annually depending on scale

Without tools:
- Manual research (LinkedIn, Crunchbase, ZoomInfo)
- Manual email/outreach (cold email tools like Outreach)
- Manual tracking (spreadsheet)
- Works, but not scalable

**ABM vs. Traditional Marketing**

ABM:
- Pros: Higher conversion (30-50%), higher ROI, better sales/marketing alignment
- Cons: Requires dedicated resources, not scalable to thousands of leads, long sales cycles
- Best for: Enterprise/mid-market, high ACV (£50K+)

Traditional:
- Pros: Scalable, can reach many leads, lower effort per lead
- Cons: Lower conversion (2-5%), lower ROI, less alignment with sales
- Best for: SMB, low ACV (<£10K)

Most companies: Hybrid
- ABM for top-tier accounts (50-100 target accounts)
- Traditional marketing for inbound/leads

**ABM Success Factors**

1. **Sales-marketing alignment**
   - Marketing and sales meet weekly on ABM accounts
   - Shared KPIs (both own account progression)
   - No finger-pointing ("marketing didn't qualify", "sales didn't follow up")

2. **Dedicated resources**
   - Can't do ABM as side project
   - Assign AE per account (5-10 accounts)
   - Assign marketer supporting multiple AEs

3. **Personalization at scale**
   - Templates OK for efficiency, but personalize each touchpoint
   - Use data (company research) to inform personalization

4. **Persistence**
   - Enterprise sales cycles 6-12 months
   - Multiple touchpoints (email, call, event, content) over time
   - Don't give up after 2 emails

5. **Account intelligence**
   - Invest in research tools (ZoomInfo, LinkedIn, Crunchbase)
   - Know more about target accounts than competitors
   - Use intel to personalize

ABM is high-touch, resource-intensive, but dramatically more effective than traditional marketing for enterprise SaaS. If you're selling £100K+ contracts, ABM is likely more efficient than broad-based marketing.
`
      }
    ],
    relatedSlugs: [
      "enterprise-sales-strategy-tactics",
      "demand-generation-roi",
      "sales-pipeline-health-forecasting",
      "revenue-operations-revops-strategy",
      "competitive-intelligence-positioning"
    ],
    faq: [
      {
        q: "How many target accounts should I have?",
        a: "20-100 for one-to-few ABM (mid-market). More accounts = less personalization, lower conversion. Fewer accounts = more conversion but less volume."
      },
      {
        q: "What's the right ABM budget?",
        a: "Typically 1 marketer + 1 AE per 50-100 target accounts. So 50 accounts = £100K annually (marketer + tools). If average deal is £100K, 1 close = 1x ROI. 5 closes = 5x ROI (typical)."
      },
      {
        q: "How do I measure ABM success?",
        a: "Track by account: engagement rate, conversation rate, qualified rate, close rate. Target: 50% engagement, 50-75% close rate (vs. 2-5% traditional). ROI: 5-10x typical."
      },
      {
        q: "Is ABM only for enterprise?",
        a: "Works best for enterprise/mid-market (high ACV). For SMB (low ACV), traditional marketing more efficient. Hybrid: ABM for top tier, traditional for rest."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "competitive-intelligence-market-analysis",
    title: "Competitive Intelligence and Market Analysis: Understanding Your Position",
    description: "Gather competitive intelligence systematically. Analyze competitors, track positioning, identify market trends, and adjust strategy accordingly.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "competitive intelligence",
      "competitor analysis",
      "market analysis",
      "market positioning",
      "competitive positioning",
      "competitor benchmarking",
      "market trends",
      "competitive advantage",
      "market research",
      "industry analysis"
    ],
    keyTakeaways: [
      "Competitive intelligence gathering: Monitor 3-5 key competitors across pricing, features, messaging, customer reviews, hiring, funding; update quarterly; assign owner (VP Product or Marketing); use tools (G2, Capterra, LinkedIn, job postings, web scraping) to automate; avoid: making assumptions without data, obsessing over every competitor move, paranoia",
      "Positioning = how you want to be perceived vs. competitors; examples: \"Easiest to implement\" (vs. competitors' complex setup), \"Best for SMB\" (vs. enterprise-focused competitors), \"Most affordable\" (vs. premium competitors); positioning should be defensible (true, hard to copy, valued by customers) and differentiated",
      "Market trends to track: TAM (total addressable market) growth, customer buying patterns (shift from on-premise to cloud?), new entrants vs. consolidation, feature parity (commoditization), pricing trends (race to bottom?); trends inform whether to enter market, move upmarket, defend territory, or pivot"
    ],
    content: [
      {
        heading: "Competitive Intelligence Framework",
        body: `Competitive intelligence is systematic gathering and analysis of information about competitors and market.

Why it matters:

Without intelligence: Decisions based on assumptions ("We think customers want X")
With intelligence: Decisions based on data ("Competitors offer X, we don't, customers want it")

**Identifying Competitors**

Direct competitors: Do same thing for same customer
- Example: Salesforce, HubSpot, Pipedrive (all CRM)

Indirect competitors: Solve same problem differently
- Example: Excel, Airtable, Zapier (all manage business data)

Emerging competitors: Not yet established, but growing
- Example: New startup with novel approach

Benchmark competitors: Similar stage/size to learn from
- Example: Your company £5M ARR, want to learn from £10M ARR company in adjacent space

Competitive set: Typically 3-5 key competitors (focus, not 20)

How to identify:
- Customer mentions: Ask customers "Who else did you consider?"
- Job postings: See who's hiring similar roles
- Industry reports: Gartner magic quadrant lists competitors
- G2/Capterra: Review sites show similar products

**What to Track**

For each competitor, track quarterly:

1. **Pricing**
   - List price, tiers, per-seat, usage-based?
   - Discount strategy: Are they discounting heavily?
   - Annual vs. monthly, contract length
   - Example: Competitor A £100/month, Competitor B £50/month (you're at £75/month)

2. **Features**
   - Feature list: What do they have that you don't?
   - Roadmap: Any announced features coming?
   - Integration: What integrations do they support?
   - Example: Competitor has API (you don't) - red flag

3. **Messaging/positioning**
   - Tagline: How do they describe themselves?
   - Target: What customer size/industry?
   - Value prop: What do they emphasize in marketing?
   - Example: Competitor focuses on "Enterprise" (you focused on SMB) - opportunity or threat?

4. **Customer reviews**
   - G2, Capterra, Gartner: What do customers praise/complain about?
   - NPS/satisfaction scores
   - Common complaints: Weak features, poor support, expensive, hard to use
   - Example: Competitor has 4.2/5 stars, main complaint "Hard to implement" (your strength!)

5. **Hiring/growth signals**
   - LinkedIn: Are they hiring? What roles? (expansion signal)
   - Job postings: Product, engineering, sales growth indicators
   - Example: Competitor hiring 20 sales reps (aggressive growth, maybe they smell market opportunity)

6. **Funding/financial**
   - Crunchbase: Funding rounds, investors, valuation
   - News: Acquisitions, partnerships, revenue announcements
   - Example: Competitor raised Series C (more capital than you), can outspend on marketing

7. **Customer base**
   - LinkedIn: Who works there? (hints at customer base)
   - Case studies: Published success stories
   - Website: Customer logos
   - Example: Competitor has large enterprise customers (they're moving upmarket)

**Competitive Analysis Process**

Monthly update (assign to one person):

Week 1: Price/features update
- Check competitor websites for pricing changes
- Document feature additions (track feature parity)
- Update spreadsheet

Week 2: Review analysis
- Read G2/Capterra reviews (sort by recent)
- Identify trends (what are customers complaining about?)
- Summarize in "competitive brief"

Week 3: Market signal tracking
- Job postings: Are they hiring? In what areas?
- News: Any announcements?
- LinkedIn: Who's joining them? (talent movement)

Week 4: Meeting + strategy
- Share brief with leadership
- Discuss: Opportunities or threats?
- Decision: Any strategic response needed?

Output: Monthly competitive brief (1-2 pages) shared with team

**Competitive Positioning**

Positioning = How you want to be perceived relative to competitors

Formula: Positioning = Target + Problem + Solution + Reason to believe

Example positioning statements:

"For mid-market sales teams who struggle with forecasting, [Your product] is the easiest forecasting tool that integrates with Salesforce. Unlike [Competitor] which requires data cleanup, we work with your existing data."

- Target: Mid-market sales teams
- Problem: Struggle with forecasting
- Solution: Easiest forecasting tool
- Reason: Works with existing data

"For finance teams tired of spreadsheets, [Your product] is the only planning tool built for cloud costs. Unlike [Competitor] which is generic budgeting, we're built specifically for AWS/cloud spending."

- Target: Finance teams
- Problem: Tired of spreadsheets
- Solution: Planning tool for cloud costs
- Reason: Built specifically for cloud

Strong positioning is:
- Differentiated (not same as competitors)
- Defensible (hard for competitors to copy)
- Valued (customers care about this difference)
- Clear (easy to understand)

Weak positioning:
- "Better, faster, cheaper" (not specific, hard to prove)
- "Enterprise-grade" (meaningless, everyone claims it)
- "Best features" (not positioned, just claims)

**Market Trends Analysis**

Track quarterly:

Trend 1: Market growth (TAM expansion or contraction)
- Is the overall market growing? By how much?
- If market shrinking, all players suffer
- If market growing 30%, everyone growing
- Example: CRM market growing 12% annually (healthy)

Trend 2: Customer buying patterns (changing preferences)
- Shift from on-premise to cloud? (happened 2010-2020)
- Shift from licensed to usage-based? (happening now)
- Shift from complex to simple? (always)
- Example: Customers prefer AI-powered, not manual (strategic implication: invest in AI)

Trend 3: Consolidation vs. fragmentation
- Consolidation: Large players acquiring small competitors (market maturing)
- Fragmentation: New entrants, ecosystem opening (market emerging)
- Example: If consolidation, be acquired or grow large. If fragmentation, niches are opportunity

Trend 4: Feature parity (commoditization)
- If all competitors have similar features, differentiation harder
- Commoditization = price competition intensifies
- Example: All CRMs have contact management (table stakes), differentiation is elsewhere

Trend 5: Pricing pressure (race to bottom?)
- Are competitors lowering prices?
- Is anyone raising prices successfully?
- Example: Competitors dropping from £100/month to £50/month (pressure on margins)

**Competitive Threats and Opportunities**

Quadrant analysis:

| Strength of position | Threat level | Action |
|---|---|---|
| Strong | Low | Defend position (protect customers, maintain) |
| Strong | High | Invest (strengthen advantage against emerging threat) |
| Weak | Low | Differentiate (fix weakness, or reposition) |
| Weak | High | Exit or pivot (market not favorable for you) |

Example:

Threat 1: Competitor launches feature you don't have
- Assessment: Is this critical? Do customers ask for it?
- If yes: Build it (defend)
- If no: Ignore it (not a threat)

Threat 2: Competitor lowers prices 20%
- Assessment: Can you match? Will margins survive?
- If yes: Match price (defend)
- If no: Differentiate on value/service (don't compete on price)

Threat 3: New entrant with novel approach (AI-powered)
- Assessment: Will this displace traditional approach?
- If yes: Invest in AI roadmap immediately (innovate)
- If no: Monitor but don't overreact

Opportunity: Competitor raises prices significantly
- Action: Lower prices slightly, market as "better value"
- Example: Competitor raises from £100 to £120/month, you lower from £100 to £85/month

**Competitive Messaging**

Use competitive intelligence in marketing:

Do:
- Highlight differentiation ("Unlike [Competitor], we have X")
- Address common objections ("Customers worry about implementation; our time-to-value is 1 week")
- Benchmark pricing ("Similar competitors cost £100+, we're £75")

Don't:
- FUD (Fear, uncertainty, doubt): "Competitor will go out of business" (unprofessional)
- Misrepresent: "Competitor doesn't have API" (verify, be accurate)
- Obsess: "Here's why we're better than 10 competitors" (focuses on them, not you)

**Tools for Competitive Intelligence**

Automated:
- G2, Capterra: Customer reviews, ratings, pricing
- Crunchbase: Funding, hiring, news
- LinkedIn: Employee movements, hiring
- ZoomInfo: Company data, employee info
- SEMrush, SimilarWeb: Web traffic, marketing spend estimates

Manual:
- Company website: Pricing, messaging, features
- LinkedIn Sales Navigator: Competitor employee tracking
- Twitter/Reddit: Industry discussions
- Industry reports: Gartner, Forrester

Cost: £100-1000/month for tools (varies)

**Competitive Intelligence Pitfalls**

Mistake 1: Obsessing over competitor moves
- "Competitor launched feature X, we're doomed"
- Reality: One feature rarely changes market
- Fix: Evaluate impact, don't panic

Mistake 2: Assuming features mean success
- "Competitor has 100 features, we have 20, we're losing"
- Reality: Customers want 5 features really well, not 100 barely
- Fix: Focus on what customers actually use

Mistake 3: Over-reacting to pricing
- "Competitor dropped price 30%, we must match"
- Reality: Might not be sustainable for them
- Fix: Match selectively (not all customers), or differentiate

Mistake 4: Missing emerging threats
- Didn't notice new entrant until they had 1000 customers
- Fix: Systematic scanning (monthly review, not reactive)

Competitive intelligence is about informed decisions, not paranoia. Track systematically, analyze thoughtfully, respond strategically.
`
      }
    ],
    relatedSlugs: [
      "competitive-pricing-analysis",
      "customer-segmentation-economics",
      "saas-benchmarking-competitive-positioning",
      "board-reporting-governance",
      "data-driven-decision-making-analytics"
    ],
    faq: [
      {
        q: "How many competitors should I track?",
        a: "3-5 key competitors (direct). More than 10 = distraction. Focus on direct competitors in your segment."
      },
      {
        q: "How often should I update competitive analysis?",
        a: "Monthly for price/features, quarterly deep dive. Don't obsess weekly (wastes time, causes over-reaction)."
      },
      {
        q: "How do I know if a competitor threat is real?",
        a: "Ask customers. If 3+ customers mention losing deals to competitor X, it's real. If only 1 customer mentions, it's not a trend."
      },
      {
        q: "Should we use FUD (fear) in marketing?",
        a: "No. \"Our competitor is bad\" is unprofessional. Instead: \"Here's what we do better [specific, provable].\" Positions you as confident, not scared."
      }
    ],
    videoUrl: ""
  }
];

export default batch61Articles;
