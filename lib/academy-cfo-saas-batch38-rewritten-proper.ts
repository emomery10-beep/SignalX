import { AcademyArticle } from "@/types/academy";

export const batch38Articles: AcademyArticle[] = [
  {
    slug: "competitive-pricing-analysis",
    title: "Competitive Pricing Analysis: Setting Prices Based on Value and Competition",
    description: "How to analyze competitor pricing, determine your own pricing strategy, and adjust prices over time based on market positioning.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "pricing strategy",
      "competitive pricing",
      "price analysis",
      "pricing tiers",
      "price positioning",
      "competitor analysis",
      "value-based pricing",
      "price optimization",
      "market positioning",
      "pricing tiers"
    ],
    keyTakeaways: [
      "Analyze 5-10 competitors: Identify their pricing tiers, features per tier, and positioning (low-cost, premium, enterprise); your pricing should be competitive relative to similar tier (within ±30%)",
      "Price based on value delivered, not cost: If your product saves a customer £50K/year, pricing at £5K-15K annual is reasonable. Pricing at £500/year leaves money on table.",
      "Annual price increases (3-5%) are standard; communicate increases clearly and grandfather existing customers; higher growth companies can support 5-8% annual increases"
    ],
    content: [
      {
        heading: "Competitive Price Analysis Framework",
        body: `Most SaaS founders price based on cost (\"we spend £10K building this, should charge £100/month\"). Wrong approach. Price based on value and competition.

**Step 1: Competitive Set Analysis**

Identify 5-10 direct competitors. List their pricing:

| Competitor | Starter | Professional | Enterprise |
|-----------|---------|--------------|-----------|
| Competitor A | £99/mo | £499/mo | Custom |
| Competitor B | £79/mo | £399/mo | £2K+/mo |
| Competitor C | £149/mo | £599/mo | Enterprise contact |
| Average | £109/mo | £499/mo | £2K+ |
| Your Company | £99/mo | £399/mo | £1.5K+/mo |

Your pricing should be within ±30% of average in each tier (otherwise customers perceive you as unfairly priced).

**Step 2: Feature-Price Alignment**

List what each tier includes:

| Tier | Starter | Professional | Enterprise |
|-----|---------|--------------|-----------|
| Users | 1-5 | 10-50 | Unlimited |
| Features | Basic | Core | All + Custom |
| Support | Community | Email | Dedicated |
| Price (Your Co) | £99/mo | £399/mo | £1.5K+/mo |
| Competitor A | £99/mo | £499/mo | Custom |
| Competitor B | £79/mo | £399/mo | £2K+/mo |

Question: At same features, are you priced fairly?
- Starter: You're £99 (same as Competitor A, lower than C). Good.
- Professional: You're £399 (lower than A at £499, same as B). Good.
- Enterprise: You're £1.5K (lower than B at £2K+). Good.

Your pricing is competitively reasonable (lower or equal to most competitors).

**Step 3: Value Justification**

For each tier, identify value delivered:

Starter tier (£99/mo):
- Solves basic use case (individual user, simple workflows)
- Savings vs. manual: £200/month (10 hours/month at £20/hour)
- Payback: Paid for itself in 3 weeks
- Price positioning: Aggressive (under-priced relative to value), aims for volume

Professional tier (£399/mo):
- Solves team use case (10-50 people, complex workflows)
- Savings vs. manual: £2,000/month (100 hours/month team time)
- Payback: Paid for itself in 1 week
- Price positioning: Fair (reasonable price for value)

Enterprise tier (£1.5K+/mo):
- Solves company-wide use case (unlimited users, custom integrations)
- Savings vs. legacy system: £20K+/month (100+ hours, executive time)
- Payback: Paid for itself in days
- Price positioning: Conservative (under-priced, but justifies premium support)

This value-based analysis shows your pricing is conservative (you could go higher).

**Step 4: Discount and Packaging Analysis**

What discounts do competitors offer?

Common patterns:
- Annual discount: 15-20% off monthly price (incentive to buy annually)
- Volume discount: Multi-year contracts get lower rate
- Mid-market discount: Large customers (100+ seats) negotiate custom pricing
- Non-profit/education: 30-50% discount

Your company strategy:
- Offer 15% discount for annual prepayment (incentive upfront payment, improve cash flow)
- Offer 5% for 2-year prepayment (deeper commitment, more discount)
- No volume discounts unless customer >100 seats (avoid race to bottom)

This aligns with competitors.

**Market Positioning from Pricing**:

Your prices reveal your positioning:

Premium positioning (expensive relative to alternatives):
- Your Professional tier: £599/mo vs. average £499/mo (20% premium)
- Message: We're premium, support quality matters, advanced features
- Target: Customers want best-of-breed, willing to pay

Mid-market positioning (price at average):
- Your Professional tier: £399/mo vs. average £499/mo (at average)
- Message: Good value, solid product, fair pricing
- Target: Most SaaS customers (value-conscious but not cheapskates)

Value positioning (discounted relative to alternatives):
- Your Professional tier: £249/mo vs. average £499/mo (50% discount)
- Message: We're disruptors, best value in category
- Risk: Commoditization, race to bottom, implies lower quality

Most successful SaaS positions at or slightly above average (mid-market or premium positioning). Value positioning works for very large TAM (you can out-scale everyone else) or if you have genuine differentiation (product-led growth, zero acquisition cost).

**When to Change Prices**:

Most SaaS companies raise prices annually (3-7%). Reasons:

1. Inflation (costs going up)
2. Product improvements (added value)
3. Market demand (if you're full, raise price to manage demand)
4. Margin expansion (reduce burn, improve profitability)

Example pricing strategy:

Year 1: Starter £99, Professional £399, Enterprise £1.5K
Year 2: Starter £109 (+10%), Professional £439 (+10%), Enterprise £1.65K (+10%)
Year 3: Starter £119 (+9%), Professional £479 (+9%), Enterprise £1.8K (+9%)

Increases of 9-10% annually are aggressive but acceptable for growing SaaS (add product value to justify).

Conservative approach: 3-5% annual increases (easier to defend, less churn).

**Handling Price Increases**:

When you raise prices:

1. Grandfather existing customers: They keep old price for 6-12 months (or forever)
   - Reduces churn from price increase
   - Customers don't feel betrayed

2. Communicate early: Announce 30-60 days in advance
   - Email: \"We're raising prices on June 1. Your price increases from £399 to £439 in [X days].\"
   - Provide rationale: \"We've added [new feature], improved support, [etc.]. New pricing reflects this value.\"

3. Offer incentive to lock in old price: \"If you prepay annual in next 30 days, lock in current price for 2 years.\"
   - Improves cash flow (upfront payment)
   - Softens price increase (customer feels like they got a deal)

4. Monitor churn: Track if price increase causes spike in churn
   - If churn increases 50%+ post-price increase, you over-extended
   - If churn increases <10%, you're fine (some churn is normal)

Most SaaS sees 2-5% increase in churn from price increases (acceptable, outweighed by higher prices for remaining customers).'`
      }
    ],
    relatedSlugs: [
      "pricing-strategy-saas",
      "customer-lifetime-value-calculation",
      "gross-margin-expansion",
      "revenue-expansion-strategies",
      "product-adoption-analytics"
    ],
    faq: [
      {
        q: "Should I price based on cost or value?",
        a: "Value. Cost is irrelevant to customer. If your product saves a customer £100K and you charge £10K, they'll buy happily. Price based on value delivered."
      },
      {
        q: "How often should I review pricing?",
        a: "Quarterly (informal review). Annually (formal review and potential adjustments). Don't change prices constantly (creates confusion)."
      },
      {
        q: "Should I match competitor prices?",
        a: "No, but stay within ±30%. If significantly cheaper, you're leaving money on table. If significantly more, customers perceive you as overpriced."
      },
      {
        q: "How much should annual price increase be?",
        a: "3-7% for established products. 5-10% if you're adding features/value. Link to product improvements (justify the increase)."
      },
      {
        q: "Should I grandfather old customers when raising prices?",
        a: "Yes, for 6-12 months. Reduces churn and preserves customer relationships. Balance: Can't grandfather forever (legacy customers become unprofitable)."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "growth-vs-profitability-tradeoff",
    title: "Growth vs. Profitability: Navigating the Core Tension in SaaS Finance",
    description: "How to balance growth investment with path to profitability, and make strategic decisions about spending based on lifecycle stage.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "growth vs profitability",
      "profitability path",
      "spending strategy",
      "burn rate",
      "financial strategy",
      "growth investment",
      "path to profitability",
      "cash management",
      "business strategy",
      "financial tradeoffs"
    ],
    keyTakeaways: [
      "The growth/profitability tradeoff is real: Every pound spent on growth reduces near-term profitability; decide consciously whether you're optimizing for growth (and when to profitability) based on market timing",
      "Venture-backed SaaS should optimize for growth until market positioning is clear, then gradually improve margins; bootstrapped SaaS should optimize for profitability from start",
      "Benchmark: Series A-B target 30-50% YoY growth with path to breakeven in 3-4 years; Series C-D target 20-30% YoY growth with path to profitability in 2-3 years"
    ],
    content: [
      {
        heading: "The Fundamental Tradeoff",
        body: `Most SaaS companies face this decision quarterly: \"Should we spend more to grow faster, or reduce spend to improve cash flow?\"

Both approaches are defensible, depending on circumstances.

**Aggressive Growth (Venture-Backed Strategy)**:

Thesis: Market is consolidating, winner takes most. Better to grow fast, lose money short-term, gain market share, and profit later.

Example company:
- Revenue: £2M
- Operating expenses: £3M (150% of revenue)
- Operating loss: -£1M/year
- This company is burning £1M/year

Questions:
- Why spend more than you make? To acquire more customers and claim market share.
- Is this sustainable? Only with capital (venture funding).

Risk: If you don't achieve critical mass before fundraising becomes difficult, you'll be forced to profitability (or shut down).

Benefit: If you win market share, profitability comes later from operating leverage.

Example trajectory:
- Year 1: £2M revenue, -£1M loss (burn capital, gain share)
- Year 2: £4M revenue, -£1.5M loss (still unprofitable, but revenue growing)
- Year 3: £8M revenue, -£1M loss (margins improving, approaching breakeven)
- Year 4: £15M revenue, £1M profit (operating leverage kicks in)

This company went from -50% margins to +7% margins over 4 years through growth and leverage.

**Disciplined Profitability (Bootstrapped Strategy)**:

Thesis: Market is stable, multiple competitors can succeed. Better to build sustainable business that funds its own growth from profits.

Example company:
- Revenue: £2M
- Operating expenses: £1.8M (90% of revenue)
- Operating profit: £0.2M (10%)
- Reinvest profit into growth

Risk: Slower growth (can't outspend competition). May lose market to faster competitor.

Benefit: Sustainable, self-funded, no external capital needed.

Example trajectory:
- Year 1: £2M revenue, £0.2M profit (10% margins)
- Year 2: £3M revenue, £0.35M profit (reinvest into growth, 11.7% margins)
- Year 3: £4.5M revenue, £0.6M profit (12.3% margins)
- Year 4: £6.5M revenue, £1M profit (15% margins)

This company grows slower (£2M to £6.5M in 4 years vs. £2M to £15M for aggressive company), but is sustainable without external capital.

**Choosing Your Strategy**:

For Venture-Backed:
- Early stage (Series A-B, product-market fit confirmed): Grow fast, lose money, raise capital
- Later stage (Series C+, market position clear): Gradually improve margins while maintaining growth
- Pre-IPO: Move toward profitability (public investors hate unprofitable companies)

For Bootstrapped:
- All stages: Optimize for profitability, grow from profits
- Market opportunity: If huge and time-sensitive, consider raising capital to accelerate (abandoning bootstrapped model)

**The Path to Profitability Decision**:

If venture-backed, when should you shift from growth to profitability?

Signals it's time to improve margins:
1. **Market is consolidating**: You've gained market share, seen competitive winners
2. **Growth is slowing**: Previously 50% growth now 25% growth (law of large numbers)
3. **Fundraising environment deteriorates**: VCs suddenly demanding profitability plans
4. **Customer acquisition becomes harder**: CAC is rising, payback extending

Example: Company with £10M ARR, previously 50% annual growth, now 25% growth.

Old strategy (aggressive growth):
- Spend 90% of revenue on operating expenses (£9M)
- Burn £0.1M annually (minimal burn, but not investing for growth)

New strategy (improved margins):
- Spend 70% of revenue on operating expenses (£7M)
- Achieve £3M annual profit (30% margins)
- Use £1.5M for continued growth investment
- Reduce external capital needs

This transition from \"we're burning cash to grow\" to \"we're generating cash for growth\" is the inflection point for venture-backed SaaS.

**Scenario Planning**:

Build three scenarios based on strategy:

**Aggressive Growth Scenario**:
- Year 1: £2M revenue, -£1M loss, £5M raised (run 5 years on capital)
- Year 2: £4M revenue, -£1.5M loss
- Year 3: £8M revenue, -£1M loss
- Year 4: £15M revenue, +£1M profit
- Year 5+: Scale profitably

Path: Raise £5M, get to breakeven in 3-4 years.

**Balanced Growth Scenario**:
- Year 1: £2M revenue, -£0.4M loss, £1M raised
- Year 2: £3.5M revenue, -£0.2M loss
- Year 3: £6M revenue, +£0.2M profit (approach breakeven)
- Year 4: £9M revenue, +£0.6M profit
- Year 5+: Scale profitably

Path: Raise £1M, breakeven by year 3, then self-fund growth.

**Conservative Profitability Scenario**:
- Year 1: £2M revenue, +£0.2M profit
- Year 2: £3M revenue, +£0.35M profit
- Year 3: £4M revenue, +£0.5M profit
- Year 4: £5.5M revenue, +£0.8M profit
- Year 5+: Scale profitably

Path: Bootstrap, profitable from day 1, slow growth.

Visualizing these scenarios helps leadership make conscious decisions:
- Aggressive is highest risk/reward (huge upside if you win, death if you lose)
- Balanced is moderate (good growth, eventual profitability, lower risk)
- Conservative is lowest risk (sustainable, slow, steady)

Which you choose depends on: market timing, competitive landscape, founder risk tolerance, and capital availability.

**Communicating to Investors**:

Most investors expect venture-backed SaaS to be unprofitable short-term while growing. But they want clarity on profitability path:

Good: \"We're currently burn £0.5M/year on £2M revenue, but our model shows breakeven at £8M revenue (3-4 year path) with current margins. Our growth rate supports this path.\"

Poor: \"We're burning cash but we'll be profitable someday when we scale.\" (No plan, vague)

Investors want to see the math: How much growth is needed to hit profitability? Can you achieve it? If growth slows, when are you profitable?

Companies that articulate clear profitability paths (even if 3-4 years away) fundraise better than companies saying \"we'll be profitable someday.\"
`
      }
    ],
    relatedSlugs: [
      "burn-rate-management-cash-preservation",
      "financial-modeling-saas",
      "unit-economics-saas",
      "gross-margin-expansion",
      "series-a-fundraising-preparation"
    ],
    faq: [
      {
        q: "When should a venture-backed company focus on profitability?",
        a: "Series C-D, or when growth slows below 30% annual. Series A-B should optimize for growth, Series D+ should target profitability."
      },
      {
        q: "Is it ever wrong to prioritize growth?",
        a: "Yes. If: (1) Market isn't consolidating (multiple can win), (2) You lack capital for multi-year burn, (3) Competitive advantage isn't sustainable (growth rate won't survive)."
      },
      {
        q: "How do you balance growth and profitability?",
        a: "Improve unit economics to enable both. Better CAC payback (12 vs. 24 months) reduces capital burn. Better gross margins (75% vs. 65%) free up spend for growth."
      },
      {
        q: "What's a healthy burn rate for a growth-stage company?",
        a: "Monthly burn = 30-50% of monthly revenue (Series B), 50-70% of revenue (Series A). Much higher suggests inefficiency. Much lower suggests under-investing in growth."
      },
      {
        q: "Should bootstrapped companies ever raise capital?",
        a: "Yes, if: (1) Market opportunity is time-sensitive, (2) Competitors are funded and growing faster, (3) You can achieve profitability faster with capital. But it's strategic choice."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "marketplace-platform-economics",
    title: "Marketplace & Platform Economics: Unit Economics for Multi-Sided Markets",
    description: "How to analyze and optimize unit economics for marketplaces and platforms where multiple parties derive value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "marketplace economics",
      "platform economics",
      "two-sided marketplace",
      "network effects",
      "supply and demand",
      "marketplace growth",
      "platform unit economics",
      "transaction economics",
      "marketplace metrics",
      "GMV growth"
    ],
    keyTakeaways: [
      "Marketplace unit economics track: supply-side acquisition (cost to recruit sellers/suppliers), demand-side acquisition (cost to recruit buyers), transaction value (GMV), and take rate %; unlike SaaS with 1 CAC, marketplaces have 2 CACs (supply + demand)",
      "Critical metrics: take rate (%), supply utilization (% of capacity used), growth in supply and demand (must both grow for marketplace to thrive), and density (% of supply/demand matched)",
      "Network effects in marketplaces are powerful: As supply grows, demand finds more value (faster matching), demand willingness to pay increases, cost to acquire supply decreases (more demand validates seller opportunity)"
    ],
    content: [
      {
        heading: "Understanding Marketplace Economics",
        body: `Marketplaces are fundamentally different from SaaS because they have two customer bases: supply (sellers) and demand (buyers).

**SaaS Unit Economics**:
- CAC: Cost to acquire a customer (one type)
- LTV: Lifetime value (one type)
- Payback: When do you recover CAC from customer revenue?

**Marketplace Unit Economics**:
- Supply CAC: Cost to acquire a seller/supplier
- Demand CAC: Cost to acquire a buyer/consumer
- Transaction value: Average transaction size (GMV)
- Take rate: % of transaction the marketplace keeps
- Unit economics for supply: CAC recovery from take rate earned per seller
- Unit economics for demand: CAC recovery from willingness to pay (direct or indirect)

Example: Ride-sharing marketplace (Uber/Lyft model)

Supply side (drivers):
- Cost to recruit a driver: £500 (sign-up incentives, onboarding, support)
- Lifetime value per driver: £20K (net profit after subsidies, over driver lifetime)
- CAC:LTV ratio: 1:40 (excellent)
- Payback: 3-6 months

Demand side (riders):
- Cost to acquire a rider: £50 (app install marketing, sign-up incentives)
- Lifetime value per rider: £2K (net profit from take rate, over rider lifetime)
- CAC:LTV ratio: 1:40 (excellent)
- Payback: 1-2 months

Company-level:
- Acquire 100 drivers (£50K cost), 1,000 riders (£50K cost)
- Total CAC: £100K for 100 drivers + 1,000 riders
- Blended payback: ~2 months (rider payback is fast, subsidizes driver payback)
- Transaction value: £100M GMV annually (at scale)
- Take rate: 20% (marketplace keeps £20M of £100M GMV)

This shows how marketplace unit economics work: Both sides must be viable, but they reinforce each other.

**Take Rate Impact**:

Take rate is the % the marketplace keeps of each transaction.

Example: Payment processing marketplace with £10M GMV annually

At 2% take rate:
- Marketplace revenue: £200K annually
- Operating costs: £300K
- Operating loss: -£100K

At 3% take rate:
- Marketplace revenue: £300K annually
- Operating loss: -£0 (breakeven)

At 5% take rate:
- Marketplace revenue: £500K annually
- Operating profit: £200K

A 1% change in take rate changes profitability dramatically.

But: Higher take rate drives away supply (sellers) or reduces demand (buyers).

Example: If you raise take rate from 2% to 5%, supply might:
- Become less attractive (sellers earn less)
- Shift to competitors (direct sales, other marketplaces)
- Supply shrinks from 10,000 sellers to 5,000 sellers

The optimization: Find the take rate that maximizes total value, not just percentage.

At 2% take rate: £10M GMV × 2% = £200K revenue (lower percentage, but higher volume)
At 5% take rate: £5M GMV × 5% = £250K revenue (higher percentage, lower volume)

Slight revenue improvement, but at cost of reduced supply. The 5% take rate might be sub-optimal.

**Supply-Demand Balance**:

Marketplaces grow when both supply and demand grow proportionally.

Example growth scenario:

| Quarter | Sellers | Listings | Buyers | Transactions | GMV | Take Rate | Revenue |
|---------|---------|----------|--------|--------------|-----|-----------|---------|
| Q1 | 100 | 1,000 | 500 | 100 | £100K | 2% | £2K |
| Q2 | 150 | 1,800 | 900 | 250 | £300K | 2% | £6K |
| Q3 | 250 | 3,200 | 1,600 | 600 | £750K | 2.5% | £18.75K |
| Q4 | 450 | 6,000 | 3,000 | 1,500 | £2M | 3% | £60K |

This marketplace is growing:
- Supply (sellers) growing 2-3x per quarter
- Demand (buyers) growing 2-3x per quarter
- Proportional growth means no shortage of supply or demand

This is healthy.

Compare to imbalanced growth:

| Quarter | Sellers | Listings | Buyers | Transactions | Notes |
|---------|---------|----------|--------|--------------|-------|
| Q1 | 100 | 1,000 | 500 | 100 | Balanced |
| Q2 | 150 | 1,800 | 3,000 | 200 | Demand outpaced supply 3:1 |
| Q3 | 200 | 2,000 | 10,000 | 300 | Severe demand shortage |
| Q4 | 500 | 5,000 | 15,000 | 1,500 | Supply recovered, balance restored |

In Q2-Q3, demand grew 6x (500→3,000→10,000) while supply only 2x (100→150→200). This creates frustration:
- Buyers can't find sellers
- Transactions per buyer drop
- Buyer retention suffers
- Marketplace appears \"broken\"

Once supply catches up (Q4), everything works again.

The lesson: Watch supply and demand growth rates. Imbalance is temporary but damaging.

**Network Effects in Marketplaces**:

The power of marketplaces is network effects:

As supply grows → Demand experiences more choice → Demand grows faster
As demand grows → Supply sees more transaction opportunity → Supply wants to join

This positive feedback loop is why marketplaces can scale rapidly once they reach critical mass.

But: Getting to critical mass is hard.

Cold start problem:
- No supply, buyers have nothing to buy
- No demand, sellers have no one to sell to

Solution: Start with one side (usually supply), subsidize heavily, then grow demand.

Example: Food delivery marketplace (DoorDash, Uber Eats)
1. Recruit restaurants (supply) with £500-2K sign-up incentives, £0 commission for first 6 months
2. Restaurants are incentivized to join (free money, test the platform)
3. Once 100+ restaurants in city, market to consumers (demand)
4. Consumers see lots of choice, willing to pay
5. Restaurants see volume, now willing to accept normal 15-20% commission
6. Marketplace becomes self-sustaining

Network effects in action:
- Phase 1: Heavy supply subsidies (£100K/quarter)
- Phase 2: Growth accelerates (both supply and demand)
- Phase 3: Self-sustaining (supply and demand want to be on platform, minimal subsidies)

Most successful marketplaces spend 2-3 years building supply before achieving critical mass on demand.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-saas",
      "customer-acquisition-cost",
      "growth-vs-profitability-tradeoff",
      "pricing-strategy-saas",
      "network-effects-virality"
    ],
    faq: [
      {
        q: "What's a good take rate for a marketplace?",
        a: "Varies by industry: Payment processing 1-3%, logistics 15-20%, labor 10-30%, content 30-50%. Find the rate that maximizes revenue given supply/demand elasticity."
      },
      {
        q: "Should you subsidize supply or demand?",
        a: "Usually supply first (get selection), then demand. But product-dependent. Ride-sharing subsidized both. Etsy subsidized demand (quality buyers attracted sellers)."
      },
      {
        q: "How do you measure marketplace health?",
        a: "Key metrics: (1) GMV growth, (2) Seller/buyer churn, (3) Transaction frequency, (4) Take rate, (5) Gross profit per transaction, (6) CAC ratios for both sides."
      },
      {
        q: "When is a marketplace profitable?",
        a: "When gross profit per transaction (GMV × take rate - payment processing - customer support costs) is positive at scale. Usually £X million GMV annually."
      },
      {
        q: "What if supply grows faster than demand?",
        a: "Temporary surplus of supply. Sellers see low volume, may leave. Or you negotiate lower take rate to retain them. Eventually demand catches up if product is good."
      }
    ],
    videoUrl: ""
  }
];

export default batch38Articles;