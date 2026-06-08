import { AcademyArticle } from "@/types/academy";

export const batch258Articles: AcademyArticle[] = [
  {
    slug: "scenario-planning-and-sensitivity-analysis",
    title: "Scenario Planning and Sensitivity Analysis: Stress Testing Assumptions",
    description: "Master scenario planning. Test sensitivity, plan for downside, maximize upside.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["scenario planning", "sensitivity analysis", "stress testing", "financial scenarios", "downside planning", "upside opportunity"],
    keyTakeaways: [
      "Sensitivity analysis: Change one variable, measure impact on outcome. Example: Revenue forecast = 100 customers × £10K ARPU × 80% GRoss margin = £800K. Sensitivity: If churn +1% (100 → 99 customers) = £792K (-1%). If ARPU -10% (£10K → £9K) = £720K (-10%). If gross margin -5% (80% → 75%) = £750K (-6.25%). Most sensitive: ARPU and gross margin (biggest % impact). Action: Focus on controllable (ARPU = pricing + expansion, gross margin = reduce COGS). Chart: Show sensitivity as % change (tornado chart = show which variables matter most).",
      "Scenario planning (three scenarios): Base case (70% probability, expected outcome). Upside (20% probability, better than expected), Downside (10% probability, worse than expected). Example base: 50% growth, 2% churn, £2K CAC. Upside: 100% growth, 1% churn, £1.5K CAC (better execution). Downside: 25% growth, 3% churn, £2.5K CAC (slower market, worse execution). Model each: P&L, cash, runway. Use: For planning (if upside, hire more; if downside, cut costs), investor communication (show range), board reporting (track vs scenarios).",
      "Stress testing (extreme scenarios): Recession (growth -50%, CAC +30%). Competitive threat (churn +2%, CAC +20%). Key customer loss (revenue -25%). Major failure (product outage 1 week = -2% revenue + brand damage). Pandemic-like (everyone remote, sales cycle +50%). Plan: For each stress, have response (cut costs, accelerate product, raise prices?). Build resilience: Diversified customer base, strong cash buffer (18+ months), flexible cost structure. Cost: Planning (low), building resilience (higher but worth it)."
    ],
    content: [
      {
        heading: "Sensitivity and Scenario Analysis",
        body: `Testing assumptions and planning for uncertainty.

**Sensitivity analysis: one-variable changes**

Example model (£1M revenue forecast):
- Starting customers: 100
- Monthly churn: 2%
- New customers: 10/month
- ARPU: £10K
- Gross margin: 75%

Base case: 100 × £10K × 75% = £750K revenue

Sensitivity (change one variable at a time):
| Variable | Change | New revenue | Impact |
|---|---|---|---|
| Starting customers | +10 (110) | £825K | +10% |
| Churn | +1% (3%) | £735K | -2% |
| New customers/mo | +5 (15/mo) | £800K | +6.7% |
| ARPU | -10% (£9K) | £675K | -10% |
| Gross margin | -10% (65%) | £650K | -13% |

Tornado chart (rank by sensitivity):
1. Gross margin: -13% to +13% (most sensitive)
2. ARPU: -10% to +10%
3. Churn: -2% to +2%
4. New customers: -6.7% to +6.7%
5. Starting customers: -10% to +10%

Insight: Focus on gross margin (reduce COGS) and ARPU (price increases, expansion)

**Three-scenario planning**

Base case (expected, 70% probability):
- Growth: 50% YoY
- Churn: 2% monthly
- CAC: £2K, payback 10 months
- New customers/month: 10
- Result: Revenue grows £1M → £1.5M (year 2)
- Cash: Positive, 12-month runway

Upside case (20% probability, execution better than expected):
- Growth: 100% YoY (market is big, execution excellent)
- Churn: 1% monthly (product-market fit tight, users sticky)
- CAC: £1.5K (marketing efficient, word-of-mouth)
- New customers/month: 20
- Result: Revenue grows £1M → £2M (year 2)
- Cash: Very positive, 18-month runway

Downside case (10% probability, market/execution issues):
- Growth: 25% YoY (slower market, execution lagging)
- Churn: 3% monthly (product-market fit weak, users leaving)
- CAC: £2.5K (marketing less efficient, high cost)
- New customers/month: 5
- Result: Revenue grows £1M → £1.25M (year 2)
- Cash: Tight, 9-month runway (need to cut costs)

Using scenarios:
- Plan hiring by scenario (hire aggressive if upside trajectory, conservative if downside)
- Board communication: Show range (not single number, more honest)
- Track actuals vs scenarios monthly (which scenario tracking toward?)

**Stress testing: extreme scenarios**

Recession scenario:
- Growth: -50% (customers cut budget)
- Churn: +3% (monthly 2% → 5%)
- CAC: +30% (market less responsive)
- Response: Cut costs 30% (cut marketing, defer hiring), focus on profitability
- Impact: Revenue drops 50%, but margins improve (lower costs) → profitable faster

Competitive threat:
- Growth: -30% (new competitor stealing deals)
- Churn: +2% (customers tempted by competitor)
- CAC: +20% (need better messaging)
- Response: Accelerate product (differentiate), lock customers (multi-year contracts)

Key customer loss (30% of revenue):
- Impact: Revenue drops 30% immediately
- Response: Accelerate other deals, raise price 5-10% (improve per-customer economics), cut costs
- Plan: Multi-year contracts (reduce this risk), diversify (no customer >20%)

Product outage (1 week downtime):
- Impact: -2% revenue (1/52 weeks), -5% NPS (lost trust)
- Response: Communicate transparently, fix root cause (tech investment)
- Plan: Redundancy, disaster recovery, monitoring

**Building resilience**

Cost structure flexibility:
- Fixed costs: Salaries (hard to cut), infrastructure (somewhat flexible)
- Variable costs: Marketing (cut immediately), contractor spend (cut immediately)
- Flexible: Hiring (can pause), bonuses (can reduce)
- Strategy: Keep 50% variable costs (can cut 50% quickly if needed)

Cash buffer:
- Target: 18+ months runway in base case
- Allows: 6-12 month downturn before crisis
- Example: £10M ARR, £500K/month burn → £9M cash (18 months)

Customer diversification:
- Target: Top 10 customers <70% revenue, top customer <20%
- Reduces: Impact of single customer leaving

Revenue diversification:
- Multiple products (not dependent on one)
- Multiple segments (not dependent on one customer type)
- Multiple channels (not dependent on one sales channel)

`
      }
    ],
    relatedSlugs: ["advanced-financial-modeling-and-forecasting", "financial-planning-and-budgeting", "risk-management-and-contingency-planning"],
    faq: [
      { q: "What variables should I do sensitivity analysis on?", a: "Focus on high-impact variables: Churn (revenue), ARPU (revenue), CAC (margin), Gross margin (profitability). Create tornado chart (rank by impact). Optimize most sensitive. Example: If churn -1% most sensitive, focus on retention = biggest revenue impact." },
      { q: "What scenarios should I plan for?", a: "Base case (expected, 70%), upside (better execution, 20%), downside (slower growth, 10%). Plus stress tests: recession, competitive threat, customer loss, product failure. Use for planning (hiring, costs), investor comms (show range), tracking (which scenario tracking toward?)." },
      { q: "How do I build resilience to downside?", a: "1. Flexible costs (50% variable = can cut if needed). 2. Cash buffer (18+ months runway minimum). 3. Customer diversification (top customer <20%, top 10 <70%). 4. Revenue diversification (multiple products, segments, channels). 5. Plan responses (if recession, cut costs X%; if competitor, accelerate product Y)." }
    ],
    videoUrl: ""
  }
];

export default batch258Articles;