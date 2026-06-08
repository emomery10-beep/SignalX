import { AcademyArticle } from "@/types/academy";

export const batch359Articles: AcademyArticle[] = [
  {
    slug: "rule-of-40-and-growth-efficiency",
    title: "Rule of 40 and Growth Efficiency: Balancing Growth and Profitability",
    description: "Master the Rule of 40. Balance growth and profitability, optimize for long-term value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["Rule of 40", "growth efficiency", "profitability", "SaaS metrics", "company health"],
    keyTakeaways: [
      "Rule of 40: Growth rate (%) + profitability (%) should total 40+ for healthy company. Example: 50% growth - 15% burn = 35% (below 40, need improvement). Trade-off: 80% growth + 0% burn = 80% (excellent), 30% growth + 20% profit = 50% (healthy), 0% growth + 50% profit = 50% (mature). Cost: Management focus (balance). ROI: High (signals long-term value, investor favorite metric, avoids growth-at-all-costs trap).",
      "Growth rate: YoY revenue growth %. Calculated: (This year revenue - Last year revenue) / Last year revenue × 100. Example: £10M last year → £15M this year = 50% growth. Public SaaS average: 20-30% (scale-up), private SaaS average: 50%+ (early growth). Benchmarking: 80%+ excellent, 50%+ strong, 30%+ healthy, <20% slow.",
      "Burn rate (opposite of profitability): Monthly cash burned / runway. Better metric: EBITDA margin (% of revenue that's profit). Example: £1M revenue, £600K costs = 40% EBITDA margin. Rule of 40 logic: If burning cash, it's negative profitability. At £10M revenue with 30% burn (spending 130% of revenue), Rule of 40: 50% growth - 30% burn = 20% (bad). Focus: Reduce burn to breakeven, then focus on pure growth."
    ],
    content: [
      {
        heading: "Measuring Company Health with Rule of 40",
        body: `Understanding the balance between growth and profitability.

**Rule of 40 fundamentals**

Definition:
Growth rate (%) + Profitability (%) ≥ 40

This is a single metric that balances two opposite forces:
- High growth requires investment (hiring, marketing, infrastructure)
- Profitability requires efficiency (low burn, high margins)

The sweet spot: Balance both

Why it matters:
- Venture capital (traditional metric, investors understand it)
- Long-term health (can't grow forever at massive burn)
- Sustainability (without profits, need continuous fundraising)
- Valuation (profitable growth valued highest)

Components:

Growth rate: YoY revenue growth %
Profitability: EBITDA margin % (or if burning cash, negative %)

Examples:

Company A: 80% growth, -10% margin (burning 10% of revenue)
- Rule of 40: 80% - 10% = 70% (Excellent!)
- Narrative: Growing fast, reasonable burn, healthy

Company B: 50% growth, 0% margin (breakeven)
- Rule of 40: 50% + 0% = 50% (Healthy)
- Narrative: Strong growth, no burn, sustainable

Company C: 30% growth, 20% margin (profitable)
- Rule of 40: 30% + 20% = 50% (Healthy)
- Narrative: Slower growth, profitable, sustainable

Company D: 100% growth, -50% margin (high burn)
- Rule of 40: 100% - 50% = 50% (OK)
- Narrative: Explosive growth but burning too much (not sustainable)

Company E: 10% growth, 30% margin (very profitable)
- Rule of 40: 10% + 30% = 40% (Just hitting Rule of 40)
- Narrative: Slow growth, profitable, mature business

Company F: 20% growth, 10% margin
- Rule of 40: 20% + 10% = 30% (Below 40, unhealthy)
- Narrative: Neither growing fast nor profitable, no value creation

**Growth rate calculation**

Definition:
YoY revenue growth = (Current year revenue - Prior year revenue) / Prior year revenue

Timeline: Calendar year or fiscal year

Example:

Year 1: £10M revenue
Year 2: £15M revenue

Growth = (£15M - £10M) / £10M = 50%

Quarterly growth (annualized):

Q2 revenue: £3M
Q1 revenue: £2.5M

QoQ growth = (£3M - £2.5M) / £2.5M = 20%

Annualized growth = (1.20^4 - 1) × 100 = 107% (if sustain Q2's growth rate for full year)

But use YoY for Rule of 40 (more stable)

Benchmarks by stage:

Early stage (Series A):
- Target: 80%+ growth (venture should be growing explosively)
- Reality: 50-150% range

Growth stage (Series B):
- Target: 60%+ growth (still rapid, some profitability pressure)
- Reality: 40-100% range

Mature stage (Series C+):
- Target: 40-60% growth (slower, more profitable)
- Reality: 20-50% range

Public SaaS average:
- Early: 50%+ growth
- Mature: 20-30% growth (slower, profitable)

**Profitability metric for Rule of 40**

Options:

Option 1: EBITDA margin (best)
- Definition: (Revenue - Operating expenses) / Revenue
- Calculated: Net income + Interest + Taxes + Depreciation/Amortization
- Formula: (EBITDA) / Revenue

Example:

Revenue: £10M
Salaries: £5M
Marketing: £2M
Infrastructure: £500K
Tools/Other: £1M
Total OpEx: £8.5M

EBITDA: £10M - £8.5M = £1.5M
EBITDA margin: £1.5M / £10M = 15%

Rule of 40: 50% growth + 15% margin = 65% (Healthy!)

Option 2: Net income margin (if publicly reported)
- Definition: (Revenue - All expenses) / Revenue
- Includes taxes, interest, depreciation

Option 3: Burn rate (if not profitable)
- Definition: Monthly cash burn / ARR (expressed as %)
- Example: £1M ARR, £100K/month burn = 12% annual burn
- In Rule of 40 terms: -12% (negative profitability)

Example with burn rate:

Revenue: £10M ARR (£833K/month)
Monthly burn: £1M

Annual cash burn: £1M × 12 = £12M
Burn rate %: £12M / £10M ARR = 120% (burning 120% of revenue!)

Rule of 40 (if 50% growth): 50% - 120% = -70% (Very bad!)

**Interpreting Rule of 40 by stage**

Exceptional (>50):
- 80% growth, 0% margin (exceptional growth, no burn)
- 60% growth, 10% margin (strong growth + profitability)
- 40% growth, 20% margin (balanced growth + profit)
- 100% growth, -30% margin (massive growth, high burn, but worth it)

Healthy (40-50):
- 50% growth, 0% margin
- 40% growth, 10% margin
- 60% growth, -20% margin

At risk (30-40):
- 30% growth, 10% margin (slow growth, some profit)
- 40% growth, -10% margin (good growth but burning)
- 20% growth, 20% margin (slow growth + profit)

Red flag (<30):
- 20% growth, 5% margin (slow growth, little profit)
- 40% growth, -20% margin (good growth but high burn)
- 10% growth, 10% margin (low growth + low profit)

**Common Rule of 40 trade-offs**

Trade-off 1: High growth, high burn
- Profile: 100% growth, -40% margin = 60% (Good)
- Decision: OK to burn cash if growth is exceptional
- Constraint: Must have runway (18+ months ideally)
- Risk: If growth slows, burn is unsustainable

Trade-off 2: Slow growth, high profit
- Profile: 20% growth, 30% margin = 50% (Good)
- Decision: Mature business, focus on profit
- Constraint: Revenue is growing slowly
- Risk: Market saturation (why growth slow?)

Trade-off 3: Moderate growth, moderate burn
- Profile: 40% growth, -10% margin = 30% (Below 40)
- Decision: Not hitting Rule of 40
- Action: Either accelerate growth OR reduce burn
- Option A: Spend more on growth (hit 60% growth)
- Option B: Reduce burn (hit 20% margin, then 60% Rule of 40)

**Optimizing for Rule of 40**

If below 40, options:

Path 1: Accelerate growth
- Spend more on sales/marketing
- Launch new products
- Enter new markets
- Partner with larger companies

Path 2: Reduce burn
- Optimize operating expenses
- Reduce headcount
- Renegotiate vendor contracts
- Focus on high-margin products

Path 3: Combination
- Moderate growth increase + moderate burn reduction
- Often best (balance risk)

Example:

Current: 25% growth, 5% margin = 30% (below 40)

Option A (Accelerate):
- Hire 5 sales people (+£250K/year)
- Increase marketing (+£200K/year)
- New growth trajectory: 40% growth, -15% margin = 25% (worse!)

Option B (Reduce burn):
- Cut low-performing projects (save £300K)
- Renegotiate tools (save £50K)
- New profitability: 25% growth, 15% margin = 40% (just hits!)

Option C (Both):
- Hire 2 sales people (not 5) (+£100K)
- Cut lower-priority projects (save £200K)
- Growth increases to 35%, burn reduces to -5%
- New Rule of 40: 35% - 5% = 30% (still below)

Option D (Strategic change):
- Identify that growth is slow due to product-market fit issue
- Invest in product improvements (costs £300K)
- This improves positioning, grow to 50%
- New Rule of 40: 50% - 20% = 30% (still below, but growth trajectory better)

**Common Rule of 40 mistakes**

Mistake 1: Chase growth at all costs
- Problem: 100% growth, -80% margin = 20% (burning unsustainably)
- Fix: Sustainable growth model (can't burn indefinitely)
- Impact: Business becomes viable

Mistake 2: Over-optimize for profitability
- Problem: 5% growth, 50% margin = 55% (profitable but dying)
- Fix: Market is growing, need to invest to capture share
- Impact: Revenue growth returns (but requires investment)

Mistake 3: Use net income instead of EBITDA
- Problem: Net income includes taxes, one-time charges, making it volatile
- Fix: Use EBITDA margin (operating profit, more stable)
- Impact: Clearer picture of operational health

Mistake 4: Ignore Rule of 40 until fundraising
- Problem: Build for 5 years, realize Rule of 40 is 25%
- Fix: Monitor quarterly (adjust if drift below 40)
- Impact: Strategic decisions made proactively

Mistake 5: Compare to wrong benchmark
- Problem: Series B company comparing to public SaaS (20% growth, 30% margin)
- Fix: Compare to similar stage companies
- Impact: Realistic goals

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "metrics-dashboard-design-kpi-tracking", "financial-modeling-and-forecasting-techniques", "profitability-analysis-and-operating-leverage", "investor-relations-and-stakeholder-communication"],
    faq: [
      { q: "What is the Rule of 40?", a: "Growth rate (%) + Profitability (%) should equal or exceed 40 for a healthy company. Example: 50% growth + 0% margin = 50% (healthy), 30% growth + 20% margin = 50% (healthy), 100% growth - 30% burn = 70% (excellent). Below 40 = red flag. Helps balance growth vs. sustainability." },
      { q: "How do I calculate growth rate for Rule of 40?", a: "YoY revenue growth % = (Current year revenue - Prior year revenue) / Prior year revenue. Example: £10M → £15M = (£15-10)/10 = 50% growth. Use annual numbers (not quarterly) for stability. Benchmark: 80%+ early stage, 50%+ growth stage, 20-30% mature." },
      { q: "What profitability metric should I use?", a: "Use EBITDA margin = (Revenue - OpEx) / Revenue. Example: £10M revenue, £8.5M expenses = 15% EBITDA margin. If burning cash, it's negative (ex: 120% burn = -120% profitability). Rule of 40 with burn: 50% growth - 20% burn = 30% (below 40, unsustainable)." }
    ],
    videoUrl: ""
  }
];

export default batch359Articles;