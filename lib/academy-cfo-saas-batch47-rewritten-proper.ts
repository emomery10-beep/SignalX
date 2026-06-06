import { AcademyArticle } from "@/types/academy";

export const batch47Articles: AcademyArticle[] = [
  {
    slug: "saas-benchmarking-competitive-positioning",
    title: "SaaS Benchmarking: Comparing Your Metrics Against Industry Standards",
    description: "How to benchmark your company against industry peers, understand where you stand, and identify improvement opportunities.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "SaaS benchmarking",
      "industry benchmarks",
      "performance metrics",
      "competitive benchmarking",
      "metric comparison",
      "industry standards",
      "peer comparison",
      "performance analysis",
      "growth benchmarks",
      "efficiency metrics"
    ],
    keyTakeaways: [
      "Benchmark against revenue cohort, not absolute size: A £5M ARR company should compare to other £3-10M ARR companies, not £100M companies; metrics vary dramatically by scale",
      "Key benchmarks by stage: Series A (30%+ growth, 3:1+ LTV:CAC, <5% churn), Series B (25%+ growth, 3:1+ LTV:CAC, <5% churn), Series C (20%+ growth, focus on profitability)",
      "Benchmark sources: Public company filings (SaaS companies, quarterly earnings), industry reports (Tomtom, ProfitWell, Lattice), peer conversations (off-record with founders), investor databases"
    ],
    content: [
      {
        heading: "Key SaaS Benchmarks by Stage and Growth Rate",
        body: `Benchmarking is comparing your metrics against industry peers. It answers: "Are we ahead or behind?"

**Critical benchmarks to track**:

1. **Growth Rate** (% annual growth)
   - Series A (£1-3M ARR): 50-100% annual growth (doubling revenue year-over-year)
   - Series B (£3-10M ARR): 30-50% annual growth
   - Series C (£10-30M ARR): 25-40% annual growth
   - Series D+ (£30M+ ARR): 20-30% annual growth

   If you're below these ranges, growth is slowing. If above, you're in top quartile.

2. **CAC Payback Period** (months to recover acquisition cost)
   - Series A: 12-24 months (acceptable, can be longer)
   - Series B: 12-18 months (should be tightening)
   - Series C: 10-15 months (approaching optimization)
   - Series D+: 8-12 months (optimized)

   If payback is extending, CAC is rising or LTV is declining (investigate).

3. **LTV:CAC Ratio** (lifetime value to acquisition cost ratio)
   - All stages: 3:1+ is target (£3 lifetime value per £1 acquisition cost)
   - Series A: 2:1+ is acceptable
   - Series C+: <3:1 is underperforming (should be better by this stage)

4. **Gross Margin** (revenue minus COGS)
   - Series A: 60-70% (acceptable)
   - Series B: 65-75% (should be improving)
   - Series C: 70-80% (mature margins)
   - Series D+: 75-85% (optimized)

   If declining, check for infrastructure bloat or service costs.

5. **Net Revenue Retention** (NRR, expansion + retention)
   - Series A: 100%+ desired, 95-100% acceptable
   - Series B: 105-110% desired (strong expansion)
   - Series C: 110-120% excellent (company growing from existing customers)
   - Series D+: 120%+ (world-class)

6. **Churn Rate** (% of customers lost monthly)
   - Enterprise (high-ACV): 2-5% annual churn (0.2-0.4% monthly)
   - Mid-market (medium-ACV): 5-15% annual churn (0.4-1.2% monthly)
   - SMB (low-ACV): 20-40% annual churn (1.7-3.3% monthly)

   If your churn is 2x peer average, product retention needs work.

**Using Benchmarks for Strategic Direction**:

Example company: £5M ARR, Series B

Current metrics:
- Growth rate: 20% annually
- CAC payback: 18 months
- LTV:CAC: 2.5:1
- Gross margin: 65%
- NRR: 100%
- Churn: 5% monthly (60% annual)

Benchmark comparison:
- Growth: Target 30-50%, actual 20% → Below benchmark (concern)
- CAC payback: Target 12-18 months, actual 18 months → At benchmark (acceptable)
- LTV:CAC: Target 3:1, actual 2.5:1 → Below benchmark (concern)
- Gross margin: Target 65-75%, actual 65% → At benchmark (acceptable)
- NRR: Target 105-110%, actual 100% → Below benchmark (concern)
- Churn: Target <3% monthly, actual 5% → Way above benchmark (crisis)

Diagnosis:
- Growth is slowing (likely due to churn, not acquisition)
- Churn is too high (core problem to fix)
- Unit economics are weak (LTV:CAC is too low)
- NRR is flat (no expansion revenue)

Actions:
1. Focus on churn reduction (customer success investment)
2. Improve NRR (expansion strategy)
3. Improve LTV:CAC (higher prices or lower CAC)
4. Growth will improve once retention improves

**Benchmarking Sources**:

1. **Public company filings** (most reliable):
   - Salesforce, HubSpot, Slack, Datadog, etc.
   - Quarterly earnings reports include growth rate, churn, NRR
   - Free on SEC.gov or company websites
   - Limitation: Only large companies (£100M+ ARR), may not reflect your stage

2. **Industry research** (credible aggregation):
   - ProfitWell benchmarks (thousands of SaaS companies)
   - Tomtom research (detailed metrics by segment)
   - Lattice Industry benchmarks
   - Cost: Usually £500-5K annually for detailed reports

3. **Peer conversations** (accurate, but biased):
   - Coffee chats with founders at similar stage
   - Ask: "What's your growth rate, churn, NRR?"
   - Limitation: People bias toward good news (may overstate metrics)
   - Best if you ask specific questions, not general

4. **Investor data** (comprehensive, if you ask):
   - VCs have benchmarks across their portfolio
   - If fundraising, ask your investors what peers are doing
   - Limitation: Mostly larger companies in their portfolio

**Interpreting Benchmark Gaps**:

When you're below benchmark on a metric, investigate why:

Below-benchmark churn (good news):
- You're doing something right (great product, great CS)
- Benefit: Higher LTV, lower CAC impact
- Action: Document what you're doing, leverage for fundraising

Below-benchmark growth (concern):
- Market is saturated (limited white space)
- CAC is too high (unprofitable to scale)
- Product isn't resonating (product-market fit issue)
- Action: Understand root cause (CAC, churn, or market?), fix accordingly

Below-benchmark LTV:CAC (concern):
- CAC is too high: Reduce through efficient marketing/sales
- LTV is too low: Improve through pricing, retention, expansion
- Unit economics are broken: Fix before scaling

Above-benchmark margins (good news):
- You're operating more efficiently than peers
- Better positioned for profitability
- Potential pricing opportunity (customers willing to pay more)

**Using Benchmarking for Goal Setting**:

Example: You're at £5M ARR, want to reach Series C (£10M+) in 2 years.

Benchmark research shows:
- Series B companies growing 30-50% annually to reach Series C
- CAC payback of 12-15 months is target
- NRR of 105-110% is expected

Your plan:
- Year 1: Grow to £7M ARR (40% growth) via NRR improvement
- Year 2: Grow to £10M ARR (42% growth) via new logo acquisition
- CAC payback: Improve from 18 to 15 months
- NRR: Improve from 100% to 110%

This plan is benchmarked (aligns with peer expectations for Series C readiness).

**When Benchmarking Can Mislead**:

Benchmarks are useful, but context matters:

1. **Different business models have different benchmarks**:
   - High-touch (sales-heavy): Lower growth rate, higher CAC, longer payback
   - Product-led (self-serve): Higher growth rate, lower CAC, faster payback
   - Don't compare PLG company to sales-heavy company (different worlds)

2. **Market maturity matters**:
   - Mature market (CRM, project management): Lower growth expected
   - Emerging market (AI, blockchain): Higher growth expected
   - Don't compare mature market SaaS to emerging market SaaS

3. **Survivorship bias**:
   - Public companies are the winners (survivors)
   - Failed companies aren't in benchmarks
   - Benchmark shows winners, not average

4. **Timing matters**:
   - Growth rates vary by year (year 1 vs. year 3 different)
   - Don't compare £1-3M to £5M company (different dynamics)
   - Compare to similar-sized peers

Use benchmarks as guide, not gospel. They show what's possible, but your company has unique dynamics.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-saas",
      "saas-metrics-dashboard-design",
      "growth-metrics-benchmarking",
      "competitive-pricing-analysis",
      "financial-modeling-saas"
    ],
    faq: [
      {
        q: "Where do I find reliable SaaS benchmarks?",
        a: "ProfitWell (free public benchmarks), Tomtom research, public company earnings, peer conversations. Avoid generic \"all SaaS\" benchmarks (too broad)."
      },
      {
        q: "Should I benchmark against revenue size or growth rate?",
        a: "Revenue size primarily, then growth rate. £3-10M ARR company should benchmark to other £3-10M companies, then segment by 30% vs. 50% growth companies."
      },
      {
        q: "How often should I benchmark?",
        a: "Quarterly at leadership level (awareness), annually for detailed benchmarking (research, competitive analysis). Don't obsess monthly (metrics are noisy)."
      },
      {
        q: "What if I'm significantly above benchmark?",
        a: "Good news. Ask why: Are you exceptional, or benchmarks are conservative? Validate with investors/peers. Could mean pricing opportunity."
      },
      {
        q: "What if I'm significantly below benchmark?",
        a: "Diagnose why: Is it market dynamics (mature market), business model (different GTM), or underperformance? Get specific before deciding to change strategy."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "cap-table-dilution-management",
    title: "Cap Table & Dilution Management: Maintaining Founder Ownership Through Funding",
    description: "How to understand cap tables, manage dilution through funding rounds, and structure equity for optimal founder outcomes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "cap table",
      "capitalization table",
      "ownership dilution",
      "equity dilution",
      "founder equity",
      "stock options",
      "fundraising dilution",
      "share structure",
      "equity management",
      "shareholder value"
    ],
    keyTakeaways: [
      "Each funding round dilutes founder ownership 15-30%: Raising Series A at £5M pre-money with £1M investment = 17% dilution; founder goes from 100% to 83%; by Series D, founders typically 20-40% ownership",
      "Employee option pools dilute founders: 10-15% option pool created at Series A; options vest as employees are hired; prevents separate dilution later but reduces founder ownership up-front",
      "Ownership matters less than value at scale: Founder with 30% of £100M company (£30M worth) is better off than 100% of £5M company (£5M worth), especially after taxes"
    ],
    content: [
      {
        heading: "Understanding Cap Tables and Ownership Dilution",
        body: `A cap table (capitalization table) shows who owns what in the company.

Simple cap table example at founding:

| Shareholder | Shares | % Ownership |
|-------------|--------|------------|
| Founder A | 5M | 50% |
| Founder B | 4.5M | 45% |
| Employee Pool | 0.5M | 5% |
| **Total** | **10M** | **100%** |

This cap table shows Founder A owns 50%, Founder B owns 45%, employees have 5% option pool.

**Cap Table After Series A Funding**:

Series A raise: £1M at £5M pre-money valuation

This means:
- Pre-money valuation: £5M (company value before investment)
- Investor gets: £1M ÷ £5M = 20% of company
- Post-money valuation: £6M (£5M + £1M invested)

New cap table:

| Shareholder | Shares | % Ownership |
|-------------|--------|------------|
| Founder A | 5M | 35.7% |
| Founder B | 4.5M | 32.1% |
| Employee Pool | 0.5M | 3.6% |
| Series A Investor | 5M | 28.6% |
| **Total** | **14M** | **100%** |

Note: Total shares increase from 10M to 14M. Founder A's shares stayed at 5M, but % ownership dropped from 50% to 35.7% (dilution of 14.3 points).

This is how dilution works: Your ownership % decreases as new shares are issued, even if your share count stays constant.

**Dilution Through Multiple Funding Rounds**:

Tracking dilution across funding rounds:

| Round | Pre-Money | Investment | Investor Share | Founder % After |
|-------|-----------|-----------|-----------------|------------------|
| Seed | — | £500K | — | 100% |
| Series A | £5M | £1M | 20% | 80% |
| Series B | £15M | £3M | 17% | 67% |
| Series C | £50M | £10M | 17% | 56% |
| Series D | £150M | £25M | 14% | 48% |

By Series D, founder ownership has declined from 100% to 48%, despite owning same share count.

But value has increased dramatically:
- Seed: 100% of £500K = £500K
- Series A: 80% of £6.5M = £5.2M
- Series B: 67% of £21M = £14.1M
- Series C: 56% of £72M = £40.3M
- Series D: 48% of £200M = £96M

Founder is worth £96M with 48% ownership vs. £500K with 100% ownership. The value creation far exceeds ownership dilution.

**Managing Dilution Strategically**:

Option 1: Aggressive growth (accept higher dilution)
- Raise at lower valuations (£3M pre-money instead of £5M)
- Larger rounds (£3M instead of £1M for Series A)
- Result: More dilution (25%+ per round) but faster growth

Option 2: Conservative growth (minimize dilution)
- Raise at higher valuations (£8M pre-money)
- Smaller rounds (£500K instead of £1M)
- Extend runway with capital efficiency
- Result: Less dilution (10-15% per round) but slower growth

Option 3: Balanced (typical venture path)
- Raise at market-rate valuations
- Round sizes match growth needs
- Result: Moderate dilution (15-20% per round), healthy growth

Most venture-backed founders choose Option 3 (typical venture path).

**Employee Option Pools and Dilution**:

Companies create option pools when raising capital to share equity with employees.

Example: Series A creates 10% option pool

| Shareholder | Pre-Series A | Series A | Post-Series A |
|-------------|------------|----------|---------------|
| Founder A | 5M | — | 4.5M (40.9%) |
| Founder B | 4.5M | — | 4.05M (36.8%) |
| New Option Pool | 0.5M | +1M | 1.5M (13.6%) |
| Series A Investor | — | 5M | 5M (45.5%) |
| **Total** | **10M** | **+6M** | **11M** |

The option pool increased from 0.5M (5%) to 1.5M (13.6%). This comes from founder dilution (founders go from 95% to 77.7% combined ownership).

The tradeoff: Founders give up equity upfront to allow hiring without future dilution. This is strategic—better to build option pool upfront than to dilute again when hiring at Series B.

**Anti-Dilution Provisions**:

In some fundraising, investors get anti-dilution protection. This protects them if company raises at lower valuation later.

Example:
- Series A at £5M pre-money
- Series B at £3M pre-money (valuation down)

Without anti-dilution: Series A investor loses value (bad for them)

With weighted-average anti-dilution: Series A investor gets additional shares to protect their ownership %

This can hurt founders significantly (more dilution for them, less for investor).

Recommendation: Negotiate narrow weighted-average anti-dilution (not full ratchet, which is very dilutive).

**Secondary Transactions and Founder Liquidity**:

Founders don't have to wait for IPO/acquisition to monetize equity.

Options:
1. **Secondary sales**: Founders sell some shares to investors/employees
   - Allows founders to diversify, capture upside
   - Tax implications (capital gains)
   - Company doesn't raise capital (just equity moves hands)

2. **Employee stock purchases**: Employees buy shares from founders at fair market value
   - Rare, but possible with 409A valuation
   - Founders get liquidity, employees get ownership

3. **Share buyback program**: Company buys back shares from employees/founders
   - Reduces shares outstanding
   - Increases % ownership for remaining shareholders

Most founder liquidity comes at exit (IPO, acquisition) or through secondary sales to investors.

**Cap Table Management Practices**:

1. **Maintain accurate cap table**:
   - Update after each option grant, investment, and vesting
   - Use cap table software (Pulley, Carta) vs. spreadsheet
   - Audit quarterly

2. **Plan option pool sizing**:
   - At Series A: 10-15% option pool
   - At Series B: Refresh if depleted
   - By Series C: 10% is standard

3. **Document equity clearly**:
   - Equity agreements signed
   - Vesting schedules documented
   - 409A valuation current
   - Cap table accessible to employees

4. **Communicate dilution transparently**:
   - Explain to investors what dilution means
   - Help employees understand their option value
   - Show long-term value creation

Most founders obsess over ownership %, but value creation is what matters. A founder with 40% of a £100M company is wealthier than one with 80% of a £10M company. Focus on building valuable company, not just preserving ownership %.
`
      }
    ],
    relatedSlugs: [
      "equity-compensation-share-options",
      "series-a-fundraising-preparation",
      "saas-valuation-methods",
      "exit-planning-ma",
      "tax-planning-founders"
    ],
    faq: [
      {
        q: "How much dilution is normal through fundraising?",
        a: "Series A: 15-25%. Series B: 15-20%. Series C: 15-20%. By Series D, typical founder dilution is 40-60% cumulative (but company value increased 100x+)."
      },
      {
        q: "Should I try to minimize dilution?",
        a: "No. Growth > ownership %. Raising capital at fair terms beats trying to minimize dilution. Bigger pie with smaller slice > smaller pie with bigger slice."
      },
      {
        q: "What's a good pre-money valuation to target?",
        a: "Series A: 3-5x ARR (£1M ARR = £3-5M pre-money). Series B: 5-8x ARR. But focus on fair valuation, not highest bid (relationship with investor matters)."
      },
      {
        q: "How do I calculate founder ownership after dilution?",
        a: "New ownership % = Old ownership % × (Pre-money value) ÷ (Post-money value). Example: 50% × £5M ÷ £6M = 41.7%."
      },
      {
        q: "Should I negotiate anti-dilution provisions?",
        a: "Yes, but narrow. Narrow weighted-average is standard (protects investor, not too punitive for founders). Full ratchet is too dilutive."
      }
    ],
    videoUrl: ""
  }
];

export default batch47Articles;