import { AcademyArticle } from "@/types/academy";

export const batch89Articles: AcademyArticle[] = [
  {
    slug: "funding-and-investment-strategy",
    title: "Funding and Investment Strategy: When to Raise, How Much, and What to Expect",
    description: "Understand SaaS funding rounds, dilution, valuations, and how to raise capital for your business stage.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "funding",
      "venture capital",
      "seed round",
      "Series A",
      "Series B",
      "valuation",
      "dilution",
      "equity",
      "raising capital",
      "investor"
    ],
    keyTakeaways: [
      "Funding rounds by stage: Seed (£0.5-2M, prove product-market fit), Series A (£2-5M, prove unit economics and growth), Series B (£5-20M, scale to £10M+ ARR), Series C+ (£20M+, path to profitability/exit); typical dilution: Seed 20%, Series A 20-25%, Series B 15-20% (total ~60% by Series C); founders own remaining 40%, enough to stay motivated",
      "Valuation formula: Post-money = ARR × Multiple (typically 5-10x for early stage, 3-5x for later stage); example: £1M ARR, 6x multiple = £6M post-money valuation; raising £2M Series A = owns 33% of £6M; earlier stage = lower multiple (more risk), later stage = higher multiple (lower risk, but slower growth)",
      "Fundraising timeline and metrics: Seed (£0-1M ARR): Prove product works + early traction. Series A (£1-5M ARR): Unit economics proven (CAC payback <12 months, LTV/CAC >3x), 30-50% growth. Series B (£5-20M ARR): Path to profitability clear, 50%+ growth, strong retention. Series C+: Already raising on profitability, not just growth"
    ],
    content: [
      {
        heading: "SaaS Funding Stages",
        body: `SaaS companies typically raise capital in stages, each with different goals and expectations.

**Seed Stage**

Goal: Prove product-market fit and acquire first customers

Metrics when raising:
- Product: Built (MVP or early product)
- Customers: 5-50 (early adopters, not yet paying or small amounts)
- Revenue: £0-100K (optional, nice if paying)
- MRR growth: Unknown (not enough data)

Typical seed round: £0.5-2M
- Use: Salaries, product development, initial sales/marketing
- Runway: 12-18 months (hiring team, building product)

Example: Figma raised £600K seed in 2016 (pre-revenue, just design tool).

**Series A**

Goal: Scale to £1-5M ARR with proven unit economics

Metrics when raising:
- Revenue: £0.5-2M ARR (at least some traction)
- Growth: 50%+ YoY (rapid growth trajectory)
- Unit economics: CAC payback <12 months, LTV/CAC >3x (proven model)
- Team: 5-15 people (built early team)
- Runway: 6-12 months (or burning after seed capital)

Typical Series A: £2-5M
- Use: Hire sales team, scale marketing, expand product
- Runway: 18-24 months to Series B

Investor focus: Unit economics and growth rate (not revenue size)

Example: Slack raised $15M (about £10M) Series A in 2014 at £1M+ ARR.

**Series B**

Goal: Scale from £5-20M ARR, approach profitability

Metrics when raising:
- Revenue: £5-20M ARR (significant revenue)
- Growth: 30-50% YoY (still high growth)
- Profitability: Approaching or path clear (burn ratio improving)
- Unit economics: Proven and optimized
- Team: 30-100 people (full organization)
- Runway: <6 months (need to raise)

Typical Series B: £5-20M
- Use: Scale operations, expand to new markets, hire leadership
- Runway: 24+ months

Investor focus: Path to scale and profitability (not just growth)

**Series C and Beyond**

Goal: Scale to £50M+ ARR, achieve profitability or clear exit path

Metrics when raising:
- Revenue: £20M+ ARR (large business)
- Growth: 20%+ YoY (slower growth, but larger base)
- Profitability: Positive or clear timeline
- Unit economics: Mature and optimized
- Team: 100+ people (sophisticated org)

Typical Series C: £20-100M
- Use: Geographic expansion, M&A, profitability investment, exit preparation
- Runway: 36+ months

Investor focus: Profitability, path to exit (IPO or acquisition)

**Valuation**

How are SaaS companies valued?

SaaS valuation multiple = Post-money valuation ÷ ARR

Example:

£1M ARR company
- Seed valuation: 4-6x ARR = £4-6M post-money
- Series A valuation: 6-10x ARR = £6-10M post-money
- Series B valuation: 8-15x ARR = £8-15M post-money
- Series C valuation: 10-20x ARR = £10-20M post-money (if high growth)

Multiples vary by:
- Growth rate: Faster growth = higher multiple
- Unit economics: Better unit economics = higher multiple
- Market: Hot market = higher multiples, cold market = lower
- Stage: Earlier = lower multiple (more risk), later = higher (less risk but slower growth)

Example comparison:

Company A: £2M ARR, 100% growth, 5x LTV/CAC = 10x multiple = £20M valuation
Company B: £2M ARR, 20% growth, 2x LTV/CAC = 5x multiple = £10M valuation

Same revenue, but Company A valued 2x higher due to growth and unit economics.

**Dilution**

Each funding round dilutes founders' ownership.

Example:

Seed round:
- Founders own: 100%
- Raise: £1M at £5M post-money valuation
- Seed investors own: £1M ÷ £5M = 20%
- Founders own: 80%

Series A:
- Post-money before: £5M (before round)
- Raise: £3M at £12M post-money valuation
- Series A investors own: £3M ÷ £12M = 25%
- Founders own: 80% × 75% = 60%
- Seed investors own: 20% × 75% = 15%

Series B:
- Post-money before: £12M
- Raise: £8M at £32M post-money valuation
- Series B investors own: £8M ÷ £32M = 25%
- Founders own: 60% × 75% = 45%

By Series B: Founders own 45%, Seed owns 15%, Series A owns 35%, Series B owns 25%.

Total dilution = 55% (founders went from 100% to 45%).

This is normal. Founders should expect to own 20-40% post-Series C (enough for motivation, plenty of room for employees).

**When to Raise**

Ideal fundraising timing:

**Too early:**
- Pre-product (very risky, harder to raise)
- No traction (can't prove anything)
- Result: Lower valuation, harder to close

**Right time (optimal):**
- Product-market fit proven
- Initial traction (revenue or strong engagement)
- Clear next milestone (Series A is scaling to £5M ARR)
- Runway: 6-12 months (feel urgency, but not panic)
- Result: Best valuation, investors confident

**Too late:**
- Runway <3 months (panic fundraising = weak position)
- Growth stalled (hard to raise if metrics declining)
- Result: Bad valuation, forced to give away equity

**Ideal schedule:**
- Seed: Raise when you have first customers (proof of concept)
- Series A: Raise when you have £1M+ ARR and unit economics (usually 18-24 months after seed)
- Series B: Raise when approaching £5M ARR with team and processes (usually 18-24 months after Series A)

This allows enough runway between rounds (18-24 months) to hit milestones before next raise.

**Fundraising Mistakes**

Mistake 1: Raising too early
- Overexposed to uncertainty
- Lower valuation (more risk)
- Dilution steeper

Mistake 2: Raising too late
- Desperation valuation (bad terms)
- May miss opportunity (best markets move fast)
- Runway pressure

Mistake 3: Raising wrong amount
- Too little: Back to fundraising soon (constant distraction)
- Too much: Overspending, wasting capital, more dilution

Right amount: 18-24 months of runway.

Mistake 4: Focusing on valuation over investors
- Better to raise at lower valuation from great investor
- Bad investor with high valuation = torture (bad advice, pressure)

Mistake 5: Not preparing
- No financial model
- No unit economics proof
- No growth plan
- Result: Can't get institutional funding

Preparation: Numbers ready, story clear, growth plan documented.

**The Fundraising Process**

Timeline: 3-4 months from start to close

Month 1:
- Prepare pitch deck
- Create financial model
- Build target investor list
- Start introductions

Month 2:
- Meet with 20-30 investors
- Get feedback, iterate pitch
- Identify interested parties

Month 3:
- Run due diligence with 3-5 interested investors
- Close 1-2 investors
- Sign term sheet

Month 4:
- Final legal documentation
- Wire funds

Total: 4 months, very accelerated.

More typical: 5-6 months (slower feedback loop, more investors to meet).

Key: Start when you have 6-12 months runway, finish before runway <3 months.
`
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-planning",
      "saas-valuation-multiples",
      "rule-of-40-growth-profitability-balance",
      "unit-economics-deep-dive",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "When should I raise my first round?",
        a: "When you have product-market fit proof (early customers, engagement) and runway <12 months. Ideal: £0.5-2M ARR with >50% growth, ready to scale."
      },
      {
        q: "How much dilution is acceptable?",
        a: "Founders should own 40-50% post-Series C. If more, you're conserving equity well. If less, you gave away too much. 20-30% dilution per round is normal."
      },
      {
        q: "What valuation multiple should I expect?",
        a: "Seed: 4-6x ARR. Series A: 6-10x ARR. Series B: 8-15x ARR. Varies by growth (50%+ = higher multiple), unit economics (LTV/CAC >3x = higher), and market."
      },
      {
        q: "Is it worth raising if I'm profitable?",
        a: "Depends. If you can grow 30%+ with capital, raise. If capped at 10-20% growth, capital not as valuable. Profitable companies can raise at premium valuations."
      }
    ],
    videoUrl: ""
  }
];

export default batch89Articles;
