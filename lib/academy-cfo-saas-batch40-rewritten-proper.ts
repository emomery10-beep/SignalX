import { AcademyArticle } from "@/types/academy";

export const batch40Articles: AcademyArticle[] = [
  {
    slug: "exit-planning-ma-strategy",
    title: "Exit Planning & M&A Strategy: Building Toward a Successful Exit",
    description: "How to position your company for acquisition or IPO, understand M&A valuation processes, and prepare for strategic exit.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "exit planning",
      "M&A strategy",
      "acquisition strategy",
      "IPO preparation",
      "company valuation",
      "exit valuation",
      "strategic acquisition",
      "due diligence preparation",
      "business sale",
      "founder liquidity"
    ],
    keyTakeaways: [
      "Exit timelines: Bootstrap can exit at £2-5M ARR, Series A-B can exit at £10-20M ARR, Series C+ often targets £50M+ ARR IPO or strategic acquisition",
      "Two exit paths: Strategic acquisition (larger company buys you for synergies, 1-3 year payoff cycle) vs. IPO (public market, permanent exit, higher requirements)",
      "M&A due diligence process takes 3-6 months (not 2 weeks); prepare financials, customer contracts, IP, team retention, and compliance documents 6-12 months ahead"
    ],
    content: [
      {
        heading: "Exit Pathways and Timing Decisions",
        body: `Most founders don't think about exit until investors push it (\"What's the path to £100M+?\"). But exit strategy shapes business decisions from the beginning.

**Strategic Acquisition (Most Common for SaaS)**:

Acquirer: Larger software company (Salesforce, Adobe, HubSpot, etc.) looking to:
- Acquire your customer base
- Acquire your technology/IP
- Acquire your team

Timeline to sale: Usually 3-7 years from founding
- Series A (£1-2M ARR): Too early (too small)
- Series B (£5-10M ARR): Possible for strategic fit (rare)
- Series C (£20-50M ARR): Typical acquisition window
- Series D+ (£50M+ ARR): Usually held for IPO attempt (acquisition no longer makes sense)

Acquisition price: Usually 5-15x ARR (depending on growth, unit economics, strategic fit)

Example acquisitions:
- Stripe acquired Kickoff (project management) for undisclosed (estimated £20-50M)
- Slack acquired Astro (email client) for £500M+ (at £100M+ ARR Slack scale)
- HubSpot acquired Sidekick (email) for undisclosed (estimated £20-50M, at Series B-C stage)

These are strategic acquisitions: Product adds value to acquirer's platform.

**IPO (Rare for Most SaaS)**:

IPO window: Usually £100M+ ARR with clear path to profitability

Requirements:
- £50M+ ARR minimum (most recent SaaS IPOs were £80M-500M ARR)
- Profitable or near-profitable (path to profitability clear)
- Clean financial statements and governance
- Diversified customer base (no single customer >10%)
- Strong growth trajectory (25%+ annually, ideally)
- Experienced team (CFO, board, executives)

Advantages:
- Founder and early employees get liquid wealth (can sell on secondary markets)
- Company has permanent capital (no need to raise again)
- Currency for acquisitions (use stock, not cash)
- Prestige (public company status)

Disadvantages:
- Quarterly earnings pressure (growth must be consistent)
- Board governance requirements (independent directors, audit committee)
- Disclosure requirements (quarterly 10-Qs, annual 10-Ks, material events)
- Compliance costs (Sarbanes-Oxley, auditors, lawyers)
- Founder dilution often continues (public investors demand secondary offerings)

Most SaaS founders prefer acquisition to IPO (exit earlier, less pressure).

**Acquisition-Ready Positioning**:

To maximize acquisition value, position your company as attractive:

1. **Unit Economics**: 3:1+ LTV:CAC, 12-18 month payback, improving or stable (not deteriorating)
2. **Customer Base**: Diversified (no customer >15% revenue), with healthy retention (NRR 100%+)
3. **Growth**: 30%+ annual growth, accelerating or stable (not decelerating)
4. **Team**: Proven CEO/leadership, not founder-dependent (show successors could run company)
5. **Technology**: Defensible IP, clean codebase, modern architecture (not legacy tech)
6. **Compliance**: Clean cap table, no lawsuits, clear IP assignments, no founder disputes

Acquirer checklist when evaluating you:
- \"Can we retain customers post-acquisition?\" (customer concentration matters)
- \"Are these good unit economics?\" (bad unit economics = bad acquisition)
- \"Does this team have retention incentive?\" (earn-out structure, options)
- \"Are there integration risks?\" (technical, cultural)

The stronger you are on these dimensions, the higher the acquisition multiple.

**M&A Process Timeline**:

Most founders think M&A process takes 4 weeks. It actually takes 3-6 months.

Month 1: Initial conversations
- Acquirer expresses interest
- You provide \"teaser\" (non-confidential overview)
- Acquirer approves internal evaluation
- Sign NDA (confidential discussion)

Month 2: Diligence begins
- Financial diligence: Auditors review books, contracts, revenue recognition
- Technical diligence: Acquirer engineers review code, architecture, IP
- Legal diligence: Lawyers review contracts, cap table, compliance

Month 3: Deep diligence
- Customer references (acquirer calls 10-20 customers)
- Team interviews (acquirer talks to key employees)
- Integration planning (how will acquirer integrate your product)

Month 4: Negotiation
- Valuation finalized (usually based on EBITDA multiple or ARR multiple)
- Earn-out structure (30-50% held back, released over 2-3 years)
- Employee retention (RSUs or bonuses to keep team)

Month 5: Legal finalization
- Purchase agreement drafted and negotiated
- Reps and warranties (acquirer protection against hidden liabilities)
- Closing conditions (what has to be true at close?)

Month 6: Closing
- All conditions met
- Funding closes
- Founder and early shareholders get liquidity

**Preparation for Exit**:

Start 12 months before you want to exit:

1. **Financial Cleanliness**: Work with auditor to clean up books
   - Fix revenue recognition issues
   - Document all non-GAAP metrics
   - Clear up any accounting errors

2. **Customer Contracts**: Standardize and document
   - Get copies of all customer contracts
   - Document any custom terms (discounts, commitments)
   - Identify customers with termination rights at change of control

3. **Intellectual Property**: Ensure it's assigned to company
   - All employee IP assignment agreements in place
   - Contractor agreements include IP assignment
   - No disputed or ambiguous IP

4. **Cap Table Clarity**: Document all equity
   - All option grants documented and vested tracked
   - No unresolved disputes
   - All option agreements signed
   - 409A valuation current

5. **Team Retention**: Plan for post-acquisition
   - Key person insurance (protects acquirer if founder dies)
   - Retention bonuses (acquirer will require key team stays)
   - Clear succession plan (who runs company if founder leaves)

6. **Compliance Documentation**:
   - Tax filings clean
   - No pending lawsuits
   - Employment agreements in place
   - Insurance policies current

**Valuation in M&A Context**:

Acquisition valuation usually based on:

1. **Comparable Companies**: Recent acquisitions in your space
   - If Slack acquired email company for 10x ARR, and you're similar, 8-10x is comparable
   - Precedent pricing anchors the deal

2. **Strategic Premium**: How much is product worth to acquirer?
   - If acquiring your product for £50M revenue synergy, might pay 12-15x ARR
   - If acquiring for customer base only, might pay 5-8x ARR

3. **Growth and Unit Economics**: Higher growth/better margins = higher multiple
   - 50% growth: 12-15x ARR
   - 30% growth: 8-10x ARR
   - 15% growth: 5-7x ARR

Example acquisition:
- Company: £20M ARR, 35% annual growth, 70% gross margin, 105% NRR
- Comparable companies: Recently acquired at 10x ARR
- Strategic value: Acquirer sees £30M revenue synergy potential
- Valuation: £20M × 10x = £200M (comparable) to £20M × 12x = £240M (premium for growth + strategic fit)

The founder likely walks away with £100-150M (after taxes, after investor returns, after employee options exercised).

**Tax Implications of Exit**:

When you sell:
- Capital gains tax: £100M proceeds - £1M original investment = £99M gain, taxed at 20% (long-term) = £19.8M tax
- Net proceeds: £80.2M

This is why tax planning matters throughout company lifecycle. Working with tax advisors to structure equity and understand tax impact is critical.

For smaller acquisitions:
- £5M acquisition price
- Your ownership: 40% (£2M proceeds before tax)
- Long-term capital gains: £1.99M × 20% = £398K tax
- Net proceeds: £1.6M

Plan for this throughout fundraising and equity allocation.
`
      }
    ],
    relatedSlugs: [
      "series-a-fundraising-preparation",
      "saas-valuation-methods",
      "cap-table-management",
      "financial-modeling-saas",
      "tax-planning-founders"
    ],
    faq: [
      {
        q: "At what ARR should I prepare for exit?",
        a: "Strategic acquisition: £10-20M ARR. IPO: £50M+ ARR. But prepare financials and compliance from Series A (3+ years ahead)."
      },
      {
        q: "Should I try for acquisition or IPO?",
        a: "Most founders exit via acquisition (faster, less pressure). IPO only if you want permanent public company status and have strong growth trajectory."
      },
      {
        q: "How long does M&A process take?",
        a: "3-6 months typically. Can be faster (30 days) if both sides motivated. Can be slower (12+ months) if complicated or contested."
      },
      {
        q: "What should I focus on to maximize exit value?",
        a: "Unit economics (LTV:CAC, margins), growth rate (30%+ is target), retention (NRR 100%+), customer diversification (no concentration), team retention."
      },
      {
        q: "What happens to employees in acquisition?",
        a: "Typically: offer letters extended, options converted to acquirer equity, retention bonuses paid over 12-24 months, some departures (overlapping roles)"
      }
    ],
    videoUrl: ""
  },
  {
    slug: "international-expansion-economics",
    title: "International Expansion Economics: Profitably Expanding to New Markets",
    description: "How to analyze profitability of international expansion, manage currency risk, and structure pricing and operations across geographies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "international expansion",
      "expansion economics",
      "geographic expansion",
      "currency risk",
      "multi-currency pricing",
      "international operations",
      "market entry",
      "localization costs",
      "geographic strategy",
      "global expansion"
    ],
    keyTakeaways: [
      "International expansion costs: Localization (£50-200K), hiring local team (£100-300K annually), compliance/legal (£20-50K per market), customer acquisition (£50-150K to prove market viability)",
      "ROI on international markets takes 2-4 years; don't expand to international unless you've proven £10M+ ARR in home market and can afford to subsidize new region",
      "Price differently by market: UK/US pricing may be £99/month, but Germany might be £79/month (lower purchasing power parity); currency exchange variations also matter"
    ],
    content: [
      {
        heading: "International Expansion Decision Framework",
        body: `Expanding internationally is tempting (\" Let's open up Europe and Asia!\"). But it's expensive and dilutive if not done right.

**Financial Requirements for International Expansion**:

Home market: £10M+ ARR (prove model works at home scale before expanding)
- Reason: International expansion requires £1-5M investment per region
- At £5M ARR, a £3M European expansion spend is 60% of annual revenue (unsustainable)
- At £20M ARR, same £3M spend is 15% of revenue (manageable)

Home market margins: 70%+ gross margin
- Reason: International ops are less efficient initially (need to build team, infrastructure)
- If home market is 50% margin, international will be negative margin (unsustainable)

Home market growth: 25%+ YoY (expanding into new geographies should accelerate growth, not replace it)

Home market profitability path: Clear path to profitability in 2-3 years
- Reason: International doesn't subsidize home market losses
- You need home market solid before adding international complexity

**Cost Analysis for International Expansion**:

To launch successfully in Europe (mid-size market):

Infrastructure and Legal (£30-50K):
- European legal entity setup: £10K
- GDPR and data privacy compliance: £10K
- EU-specific contracts and terms: £5K
- Payment processing (multiple gateways): £3K
- Tax and VAT setup: £2K

Localization (£50-150K):
- Product localization (multiple languages): £30-60K
- Marketing and sales materials translation: £20K
- Website and content localization: £15K
- Customer support localization (initial): £10K

Team (Annual £200-400K):
- Regional VP/General Manager: £80-120K
- Sales representative: £50-80K
- Customer success manager: £40-60K
- Operations/finance support: £30-50K

Initial Customer Acquisition (£50-200K):
- Marketing spend to establish presence: £30-80K
- Sales travel and events: £20-40K
- Channel development and partnerships: £20-50K

**Total First Year Investment: £400-800K**

Expected payoff:
- Year 1: £0-500K ARR (establishment, not yet profitable)
- Year 2: £1-3M ARR (ramping, approaching breakeven)
- Year 3: £3-8M ARR (profitable, returning ROI)

If successful, you've invested £800K to generate £10M+ in revenue potential. But risk is high (market might not be receptive, team might struggle, competition might be fierce).

**Market Selection Criteria**:

Not all markets are equal. Choose based on:

1. **Pricing Power** (can you maintain/increase prices?):
   - UK/US: High (customers have budget)
   - Germany/France: Medium-high (price-conscious but wealthy)
   - Eastern Europe: Medium (price-sensitive)
   - APAC/India: Low (price-sensitive, lower budgets)

2. **Customer Willingness to Buy Online** (SaaS comfort level):
   - US/UK/Australia: High
   - Germany/France: Medium-high
   - Japan: Medium
   - Emerging markets: Low-medium

3. **Competition Intensity**:
   - Saturated markets (US, UK, Germany): Harder to gain traction
   - Emerging markets: Less competition but also less sophistication

4. **Regulatory Burden**:
   - EU: High (GDPR, complex regulation)
   - UK/US: Medium
   - APAC: Varies by country

Recommendation: Start with English-speaking, high-income markets (Canada, Australia, UK, Ireland) before tackling non-English or low-income markets.

**Pricing Strategy for International Markets**:

Same product, different prices across markets (based on purchasing power parity):

| Market | Base Price | PPP Adjustment | Final Price | Rationale |
|--------|-----------|-----------------|-------------|-----------|
| US | £99/mo | 1.0x | £99 | Base market |
| UK | £99/mo | 0.95x | £94 | Slightly lower PPP |
| Germany | £99/mo | 0.85x | £84 | Lower purchasing power |
| Canada | £99/mo | 0.85x | £85 | Lower GDP |
| Australia | £99/mo | 1.1x | £109 | Higher PPP |
| India | £99/mo | 0.15x | £15 | Much lower PPP |

The logic: £99/month in US is equivalent to £84 in Germany (accounting for income differences). If you charge £99 in Germany, you're effectively 18% more expensive to German customers.

This PPP pricing helps:
- Maintain conversion rates across markets
- Maximize revenue (not losing deals to pricing)
- Account for willingness to pay differences

Tools for PPP adjustment: World Bank PPP data, or use typical adjustment of ±15-20% per market.

**International Unit Economics**:

Track separately by geography:

| Metric | US | Europe | APAC |
|--------|----|---------|----|
| CAC | £5K | £7K | £3K |
| ARR per Customer | £2K | £1.5K | £0.5K |
| Payback Period | 30 mo | 56 mo | 72 mo |
| LTV:CAC | 4:1 | 2.1:1 | 1.7:1 |

Europe looks worse (higher CAC, lower ARR, longer payback). Is it worth it?

Depends on strategy:
- If you want to be European player, accept lower unit economics and invest for 3-5 year payoff
- If you want portfolio of global markets, Europe makes sense at 2-3 year profitability target

**Staffing Model for International**:

Option 1: Hub model (centralized support)
- Keep support in home country (US)
- Have one regional salesperson in each geography
- Minimal local ops
- Cost: £50-150K per region

Disadvantages: Customer support is in wrong timezone, no local presence, slower sales

Option 2: Local team model (distributed operations)
- Hire full team in each key geography (VP Sales, sales reps, CS, operations)
- Localized support (timezone coverage, local language)
- Higher cost but better execution
- Cost: £300-600K per region

Recommendation for most SaaS: Hybrid model
- Regional VP or manager (1 person, visible leader)
- 2-4 sales/CS people (customer-facing)
- Support and operations remain centralized initially
- Cost: £150-300K per region

This balances local presence with cost efficiency.

**Risk Management for International**:

1. **Currency risk**: Revenues in EUR, CHF, GBP, JPY, but costs often in USD
   - Hedge: Use hedging strategies or price in USD
   - Accept: Build in 5-10% margin buffer for currency fluctuation

2. **Regulatory risk**: GDPR (EU), PIPEDA (Canada), tax regulations vary
   - Mitigate: Work with local legal experts
   - Cost: Budget £20-50K annually for compliance

3. **Competition risk**: International markets often have entrenched local competitors
   - Mitigate: Focus on differentiation, partnership channels
   - Cost: Plan for higher CAC to overcome incumbents

4. **Talent risk**: Hiring good team in new market is hard
   - Mitigate: Hire expatriates initially, transition to locals
   - Cost: Expat salaries 20-30% higher than local

Plan for these risks. Don't expand to a market and hope for the best.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-saas",
      "pricing-strategy-saas",
      "customer-acquisition-cost",
      "market-expansion-strategy",
      "financial-modeling-saas"
    ],
    faq: [
      {
        q: "When should I expand internationally?",
        a: "At £10M+ ARR in home market, with 25%+ growth, and clear path to profitability. Before that, focus on home market dominance."
      },
      {
        q: "Which market should I enter first?",
        a: "English-speaking, high-income markets (UK, Canada, Australia) before non-English or lower-income markets. Easier to execute, fewer localization needs."
      },
      {
        q: "How long to profitability in new market?",
        a: "2-3 years typically. Plan for losses in year 1, break-even year 2, profit year 3. Some markets faster, some slower."
      },
      {
        q: "Should I hire local team or keep support centralized?",
        a: "Hybrid: Local sales/regional manager, centralized support initially. As market grows, transition to distributed model."
      },
      {
        q: "How do I manage currency risk?",
        a: "Hedge (use financial instruments), price in USD/home currency, or build in currency buffer (maintain 5-10% margin for fluctuation)."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "debt-financing-credit-lines",
    title: "Debt Financing & Credit Lines: Alternative Growth Funding Beyond Venture Capital",
    description: "How to structure and use debt financing, credit lines, and alternative funding to reduce dilution while funding growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "debt financing",
      "credit lines",
      "venture debt",
      "equipment financing",
      "SBA loans",
      "working capital loans",
      "alternative financing",
      "non-dilutive capital",
      "growth financing",
      "funding strategy"
    ],
    keyTakeaways: [
      "Venture debt: 1-2 year loans, 10-15% interest rate, warrants (right to buy equity at fixed price); good for bridge financing between fundraises or extending runway without dilution",
      "Revenue-based financing: Borrow against recurring revenue, repay as % of monthly revenue until cap paid; good for profitable or near-profitable SaaS (5-15% monthly repayment)",
      "Equipment/working capital loans: Lower rates than venture debt, but require collateral or personal guarantees; good for specific needs (infrastructure, inventory)"
    ],
    content: [
      {
        heading: "Debt vs. Equity: The Fundamental Tradeoff",
        body: `When you need capital, you have two choices: raise equity (give up ownership) or take debt (make a promise to repay).

**Equity**:
- Raise £1M, give up 15% of company
- No obligation to repay (investors participate in upside)
- Large dilution
- Example: You own 100%, raise £1M at £6.5M post-money, now own 86%

**Debt**:
- Borrow £1M, repay with interest
- Legal obligation to repay (regardless of success)
- No dilution
- Example: You own 100%, borrow £1M, still own 100% (but owe £1M + interest)

The trade-off is clear: Debt keeps ownership but creates financial risk.

For founders, this is attractive when:
- You're confident in revenue and can service debt
- You don't want additional dilution
- You want to maintain control

Investors usually prefer equity (they get upside if you succeed).

**Types of Debt Financing**:

1. **Venture Debt**:
Lender: Silicon Valley Bank, Horizon, Gold Hill, Clearco, etc.
Terms: 1-2 year loans, 10-15% interest, attached warrants (option to buy equity at fixed price)
Typical amount: £500K-3M
Use case: Bridge between fundraises, extend runway without dilution

Example:
- You're raising Series A, investors say \"we like you, but need 3 months for board approval\"
- You need cash to make payroll, keep team
- Take £1M venture debt (10% interest, 1-year term)
- Repay when Series A closes (use raise proceeds to pay back loan)

Economics:
- Borrow £1M at 10% interest = £100K annual interest cost
- Repay in 12 months (assume use Series A to pay back)
- Cost: £100K (vs. 10% equity dilution = £650K+ in future value if company succeeds)
- Savings: ~£550K in future value (break-even if company grows 10%+ annually)

2. **Revenue-Based Financing (RBF)**:
Lender: Clearco, Uncapped, Lightyear, etc.
Terms: 3-5 year terms, 5-15% monthly repayment until cap reached (e.g., borrow £1M, repay until £1.3M returned)
Typical amount: £100K-2M
Use case: Growth capital for SaaS with predictable recurring revenue

Example:
- Company has £1M ARR, growing 30% YoY, profitable
- Want to hire sales team (£500K cost) to accelerate growth
- Take £500K RBF at 8% monthly repayment (cap of £650K)
- Repay £40K/month (8% of revenue) until £650K paid back
- Payback period: ~16 months (£650K ÷ £40K/month)

Economics:
- Total repay: £650K (vs. £500K borrowed) = £150K fee (30% of borrowed)
- Compare to equity: 5% dilution of £2M company = £100K value given up (if revenue stays flat)
- Better than equity if you expect company to grow (£150K fee vs. £500K+ future dilution)

3. **Equipment & Asset-Based Financing**:
Lender: Traditional banks, equipment lenders
Terms: 3-5 year loans, 5-8% interest, requires collateral (the equipment itself)
Typical amount: £50K-500K
Use case: Buying servers, infrastructure, equipment

Example:
- Company buys £200K in server infrastructure
- Finance it over 3 years at 7% interest
- Monthly payment: £6,2K
- After 3 years, own the equipment

Economics:
- Total repay: ~£212K (£200K + ~£12K interest)
- Compare to cash purchase: £200K upfront
- Benefit: Preserve £200K cash, pay over time

4. **Working Capital Loans**:
Lender: Traditional banks, alternative lenders
Terms: 1-2 year loans, 8-12% interest, may require personal guarantee
Typical amount: £100K-1M
Use case: Bridge cash flow gaps, fund working capital needs

Example:
- Company has £2M annual revenue but quarterly payment cycles
- Need £500K to bridge Q3-Q4 gap (customers pay in Q4)
- Take £500K working capital loan
- Repay when Q4 revenue collected

Economics:
- Interest cost for 6-month bridge: ~£500K × 10% × 6/12 = £25K
- Compare to line of credit: Could get £500K credit line at 5% interest (only pay interest on amount drawn)

**Venture Debt: Deep Dive**:

Most common for SaaS founders.

Terms typically:
- Loan amount: 10-50% of Series A (if raising Series A)
- Interest rate: 10-15% (higher than traditional bank, lower than equity stake)
- Term: 18-24 months
- Warrants: Right to buy 0.5-1% of company at fixed price (usually 20% above valuation)

Example:
- Raising Series A at £10M pre-money valuation
- Venture debt lender offers: £2M loan, 12% interest, warrants to buy 0.5% (at £12M post-Series A valuation)
- Series A closes at £10M pre-money, £5M funded

Financial impact:
- Debt: £2M borrowed, due in 2 years
- Interest: £2M × 12% × 2 years = £480K total interest
- Warrants: Right to buy 0.5% (if company grows to £100M valuation, warrant value = £500K)

Two-year cost: £480K interest + risk of warrant dilution (estimated £500K)

Compare to all-equity raise:
- Could have raised £5M at £10M pre-money (25% dilution)
- If company grows to £100M, 25% dilution = £25M value given up

The debt is much cheaper.

**Decision Framework for Debt vs. Equity**:

Debt makes sense if:
- You're confident in revenue (can service debt obligations)
- You have recurring revenue (predictable cash flow)
- You want to minimize dilution
- You're bridge financing (between raises or before profitable)

Equity makes sense if:
- You need large capital raise (£5M+)
- You're pre-revenue or uncertain on revenue
- You want investor support/advisory
- You can't service debt (no cash flow)

For most venture-backed SaaS:
- Series A: Raise equity, don't take debt (you need investor support)
- Series B-C: Add venture debt as supplement (bridge between raises or extend runway)
- Series D+: Use debt to minimize dilution before IPO

Example path:
- Series A: Raise £2M (25% dilution), owner goes from 100% → 75%
- Series A + Venture Debt: Raise £2M + £1M debt (reduce future equity raise need)
- Series B: Raise £5M (instead of £7M if you had debt)
- Total dilution with debt: Lower, owner retains more ownership
`
      }
    ],
    relatedSlugs: [
      "cash-flow-forecasting",
      "burn-rate-management-cash-preservation",
      "series-a-fundraising-preparation",
      "cap-table-management",
      "financial-modeling-saas"
    ],
    faq: [
      {
        q: "When should I take venture debt vs. raise equity?",
        a: "Equity for large raises (£2M+) or early stage. Venture debt for bridge financing, extending runway, or supplement to equity (Series B+)."
      },
      {
        q: "What's a typical venture debt interest rate?",
        a: "10-15% for venture debt. Lower for revenue-based financing (5-10%), higher for asset-backed loans (7-12%)."
      },
      {
        q: "What do warrant terms mean?",
        a: "Right to buy X% of company at fixed price. If company is worth £100M and warrant is 1% at £10M valuation, warrant holder gets £1M value (can exercise to own 1%)."
      },
      {
        q: "Can I take debt if I'm unprofitable?",
        a: "Venture debt, yes (if backed by equity raise or strong growth). Traditional debt, no (banks require profitability or collateral)."
      },
      {
        q: "Should I prioritize paying back debt or reinvesting?",
        a: "Depends on growth opportunity. If growth yield > debt interest, reinvest. If debt is cheap (5%) and growth is slow (3%), pay back."
      }
    ],
    videoUrl: ""
  }
];

export default batch40Articles;