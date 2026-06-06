import { AcademyArticle } from "@/types/academy";

export const batch104Articles: AcademyArticle[] = [
  {
    slug: "m-a-acquisition-strategy",
    title: "M&A and Acquisition Strategy: Buying Companies to Accelerate Growth",
    description: "Master acquisition strategy. Evaluate targets, structure deals, and integrate acquisitions to achieve synergies and growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "M&A",
      "acquisitions",
      "mergers",
      "acquisition strategy",
      "target evaluation",
      "deal structure",
      "integration",
      "synergies",
      "purchase price allocation",
      "accretion"
    ],
    keyTakeaways: [
      "Acquisition rationale: SaaS companies acquire to (1) accelerate growth (buy customer base, £10M ARR company acquired saves 2-3 years of sales effort), (2) acquire technology (buy engineering team, accelerate product roadmap), (3) acquire talent (hire multiple specialists at once), (4) expand market (buy company in adjacent market, cross-sell); typical deal size: £5-50M (smaller: not worth distraction, larger: more risk); multiple typical: 4-8x revenue (SaaS standard)",
      "Target evaluation: Look at (1) customer overlap (how many customers already use your product? Reduce integration risk), (2) technology fit (does their product complement yours or duplicate?), (3) team (are key people staying post-acquisition?), (4) culture (will your teams work together?), (5) customer health (are customers healthy, sticky? Or will they churn post-acquisition?); run detailed due diligence: review financials, contracts, IP, legal, customer satisfaction",
      "Integration planning: Create 100-day plan (first 100 days post-close): retain key employees (retention bonuses, clear role), communicate to customers (new product roadmap, investment in their success), realize synergies (combine sales teams, product roadmaps, eliminate duplicate costs), cultural integration (team building, align values). Typical cost of integration: 10-20% of purchase price, timeline: 6-12 months to full integration"
    ],
    content: [
      {
        heading: "Acquisition Strategy and Rationale",
        body: `Acquisitions allow companies to grow by purchasing other companies rather than building from scratch.

**Why Acquire?**

Rationale 1: Accelerate customer growth

Without acquisition:
- Current sales: 50 customers/year
- Target: 1000 customers in 5 years
- Timeline: 20 years at current rate

With acquisition of £10M ARR company (100 customers):
- Add 100 customers immediately
- Combine sales forces
- Cross-sell opportunities
- Timeline: Reach 1000 customers in 3 years (vs 20)

Benefit: 6-year acceleration of growth

Rationale 2: Acquire technology

Scenario: You want to build new product feature (estimated 12-month engineering effort)

Option A: Build it
- Cost: £500K (engineering team for year)
- Timeline: 12 months

Option B: Acquire company with feature
- Cost: £2M (acquire team of 5 engineers)
- Timeline: 3 months (integration)

Choice depends on cost/benefit. If feature is critical, acquisition makes sense.

Rationale 3: Acquire talent

Scenario: You want to hire specialized team (machine learning engineers)

Option A: Hire individually
- Cost: £200K × 5 = £1M/year salary + benefits
- Timeline: 6-12 months (hiring cycle)
- Risk: Hiring difficult market, might not find 5 people

Option B: Acquire company with ML team
- Cost: £3M (acquire team + company)
- Timeline: 3 months (close deal)

Benefit: Get entire team at once, faster onboarding, team cohesion

Rationale 4: Expand into new market

Scenario: You want to expand from HR tech to Finance tech

Option A: Build new product
- Cost: £2M (team to build)
- Timeline: 18-24 months to get traction

Option B: Acquire small Finance tech company (£2M ARR, £8M valuation)
- Cost: £8M
- Timeline: 3 months to integrate
- Benefit: Instant £2M ARR, customer base, product

If you value the growth/market position, acquisition faster.

**Typical Acquisition Multiples**

SaaS acquisition prices are typically 4-8x revenue (depends on growth, profitability, margins):

Fast-growth SaaS (>50% YoY):
- Acquisition multiple: 6-8x revenue
- Example: £5M ARR company worth £30-40M

Healthy SaaS (30-50% growth):
- Acquisition multiple: 5-6x revenue
- Example: £5M ARR company worth £25-30M

Mature SaaS (10-30% growth):
- Acquisition multiple: 4-5x revenue
- Example: £5M ARR company worth £20-25M

Declining/unprofitable SaaS:
- Acquisition multiple: 2-4x revenue (or lower)
- Example: £5M ARR company worth £10-20M (only if strategic)

Multiples vary by:
- Acquisition market (hot market = higher multiples)
- Buyer type (large acquirer pays premium, small acquirer conservative)
- Synergies (if you can cut costs / cross-sell, you value higher)

**Evaluating Acquisition Targets**

Key criteria:

1. Fit with your product

Ideal:
- Target product complements yours (adjacent, not duplicate)
- Combined offering makes sense to customers
- Example: HR software acquiring payroll software (natural fit)

Poor:
- Target product duplicates yours (competitor, not acquiree)
- Customers have no overlap
- Example: Email tool acquiring project management (different audiences)

2. Customer overlap and retention risk

Ideal:
- 30-50% customer overlap with your product
- These customers likely to use combined offering
- Minimal churn risk post-acquisition

Risk:
- <10% customer overlap (why acquire if no synergy?)
- >70% overlap (customers might leave if product consolidates)

3. Technology and product roadmap

Ideal:
- Target's technology fills your gap
- Engineers stay post-acquisition (retention critical)
- Can integrate technology into your product

Risk:
- Outdated technology (expensive to modernize)
- Key engineers leave after close (product knowledge lost)
- Technology so different it's hard to integrate

4. Team retention

Critical:
- Are key employees willing to stay?
- Offer retention packages (equity, sign-on bonus)
- Loss of key people = loss of value

5. Customer health

Ideal:
- High NRR (>100%, customers expanding)
- Low churn (<2%)
- Happy customers (high satisfaction scores)

Risk:
- Declining customers (churn >5%)
- Unhappy customers (recent complaints)
- Customer concentration risk (few large customers)

**Due Diligence Process**

Before acquiring, perform due diligence:

Financial due diligence:
- Review 3 years of financials (audited if available)
- Verify revenue (sales contracts, customer payments)
- Understand COGS, unit economics, margins
- Check cash position, liabilities, debt

Legal due diligence:
- Contracts (customer agreements, vendor contracts)
- IP (patents, trademarks, any disputes?)
- Litigation (any legal issues?)
- Regulatory (compliance issues?)

Customer due diligence:
- Call 10-15 major customers (are they happy?)
- Review customer contracts (any unusual terms?)
- Check NRR, churn, expansion (are customers growing with product?)
- Concentration (how many large customers?)

Technology due diligence:
- Code review (is technology clean, maintainable?)
- Security review (any vulnerabilities?)
- Architecture (cloud-native? Outdated tech?)
- Team assessment (how many engineers? Experience level?)

Typical timeline: 4-8 weeks of due diligence

Cost: £50-100K in advisor fees (lawyers, accountants)

**Deal Structure**

How to structure the purchase price:

Example: Acquiring £5M ARR company

Valuation: £5M × 6x = £30M

Payment structure:

Option 1: All cash at close
- Buyer pays £30M on day 1
- Seller gets all money immediately
- Least risk for seller, most cash for buyer

Option 2: Cash at close + earnout
- Cash at close: £20M
- Earnout if customer targets met: £10M (over 12-24 months)
- Seller incentivized to stay, ensure transition

Earnout example:
- If £5M customers renew: Seller gets £10M earnout
- If only £4M customers renew (£1M churn): Seller gets £8M earnout (proportional)
- Aligns seller incentives with customer retention

Option 3: Stock consideration
- Instead of cash, buyer gives stock
- Used by larger public companies
- Sellers believe stock will appreciate

Example:
- Buyer stock trading at £50/share
- Seller receives 600K shares = £30M value
- If stock appreciates to £60 = £36M value (seller profits)
- If stock depreciates to £40 = £24M value (seller loses)

**Integration Planning**

Post-acquisition integration is critical. Plan for first 100 days:

Day 1-7: Communication
- Announce to employees (internal all-hands)
- Announce to customers (email, product announcement)
- Announce to investors, board
- Message: "We're combining [Company A] and [Company B] to deliver better product and service"

Day 1-30: Retain key talent
- Meet with all leadership, engineers, salespeople
- Offer retention packages (cash bonus, equity grants)
- Communicate role clarity (who's in charge? What's their new role?)
- Typical retention package: 1x salary (to stay 12 months)

Day 1-60: Develop integration plan
- Sales team integration (combine customer bases, cross-sell plan)
- Product integration (how to combine products? What's the roadmap?)
- Engineering integration (align on technology stack, combine teams)
- Cost reduction (identify duplicate functions to eliminate)

Day 60-100: Execute synergies
- Combine sales teams
- Launch cross-sell motions (offer [Company B] customers [Company A] product)
- Combine customer support (single support team)
- Eliminate duplicate roles (finance, HR, G&A)

Synergies:
- Revenue synergies: Cross-sell customers (add £2M ARR)
- Cost synergies: Eliminate duplicate functions (save £1M/year opex)
- Total synergies: £3M (justifies acquisition premium)

**Integration Risks and Failures**

Why acquisitions fail:

1. Cultural clash
- Different work styles, values
- Teams don't mesh
- Key people leave
- Example: Acquired company culture is "work hard" but your culture is "work-life balance"

2. Customer churn
- Customers acquired to use [Company B], offered [Company A] instead
- Customers unhappy with forced migration
- Higher churn than expected
- Example: Slack acquired Screenhero, shut it down, users fled to competitors

3. Loss of key people
- Engineers leave because role unclear
- Sales team leaves because compensation/commission changes
- Management leaves because reporting lines change

4. Technology integration issues
- Combining codebases takes longer than expected
- Duplicate features create confusion
- Users upset about migration pain

Risk mitigation:
- Clear retention agreements (stay 12+ months, get bonus)
- Careful due diligence on customer health (understand churn risk)
- Transparent communication (why this acquisition? What's changing? What's staying?)
- Phased integration (don't try to integrate everything day 1)

**Accretion/Dilution Analysis**

Will acquisition increase or decrease earnings per share (EPS)?

Accretive: Increases EPS
Dilutive: Decreases EPS

Example:

Your company (Buyer):
- Revenue: £100M
- Net income: £10M
- Shares: 10M
- EPS: £1.00/share

Acquisition target:
- Revenue: £5M
- Net income: £0.5M (10% margin)
- Cost: £30M (6x revenue)

Post-acquisition:
- Combined revenue: £105M
- Combined net income: £10.5M (assuming no synergies lost)
- Shares: 10M (all cash deal, no new shares issued)
- EPS: £1.05/share (accretive)

If financed with debt:
- Interest cost: £1.5M (5% on £30M debt)
- Net income: £10.5M − £1.5M = £9M
- EPS: £0.90/share (dilutive)

The financing method matters. Cash deals more likely to be accretive (assuming target profitable).

**Post-Acquisition Performance**

Track acquisition performance 6-12 months post-close:

Metrics:
- Customer retention rate (% of acquired customers retained)
- NRR (are customers expanding with you?)
- Revenue synergies realized (cross-sell revenue)
- Cost synergies realized (cost savings)
- Employee retention (% of key employees still there)
- Integration timeline (how long did it take to fully integrate?)

Example result:

Acquisition of £5M ARR company for £30M

6 months post-close:
- Customer retention: 95% (lost £250K ARR, but acceptable)
- Cross-sell: £1M new ARR (customers buying your products)
- Cost savings: £300K (eliminated duplicate functions)
- Net outcome: £5M + £1M − £250K + £300K savings = £5.75M net revenue (vs £5M pre-acquisition, +15%)
- Payback: £30M cost ÷ (£750K net impact) = 40 years (long, but acquisition was for growth/strategic, not simple ROI)

This is typical. Acquisitions are about growth and strategy, not pure financial returns.
`
      }
    ],
    relatedSlugs: [
      "saas-valuation-and-multiples",
      "funding-and-investment-strategy",
      "financial-forecasting-modeling",
      "customer-concentration-risk",
      "unit-economics-deep-dive"
    ],
    faq: [
      {
        q: "What's a typical SaaS acquisition multiple?",
        a: "4-8x revenue depending on growth rate. Fast-growing (>50%): 6-8x. Healthy (30-50%): 5-6x. Mature (<30%): 4-5x."
      },
      {
        q: "What should I look for in an acquisition target?",
        a: "Complementary product (not duplicate), customer overlap (30-50%), healthy technology, strong team (willing to stay), low customer churn. Avoid concentrated customers or outdated tech."
      },
      {
        q: "How long does due diligence take?",
        a: "4-8 weeks typically. Includes financial review, legal review, customer calls, technology assessment. Cost: £50-100K in advisor fees."
      },
      {
        q: "What are the biggest acquisition failure risks?",
        a: "Cultural clash, customer churn, loss of key employees, technology integration challenges. Mitigate with clear communication, retention packages, phased integration."
      }
    ],
    videoUrl: ""
  }
];

export default batch104Articles;
