import { AcademyArticle } from "@/types/academy";

export const batch81Articles: AcademyArticle[] = [
  {
    slug: "net-revenue-retention-nrr-mastery",
    title: "Net Revenue Retention (NRR) Mastery: Understanding Organic Growth from Existing Customers",
    description: "Master NRR to understand how much your business grows from existing customers. NRR >100% means profitable, organic growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 7,
    keywords: [
      "net revenue retention",
      "NRR",
      "revenue retention",
      "organic growth",
      "expansion revenue",
      "customer expansion",
      "retention metric",
      "revenue growth",
      "SaaS metric",
      "customer value"
    ],
    keyTakeaways: [
      "NRR = (Beginning revenue + Expansion − Churn) ÷ Beginning revenue; example: Start £1M, expand £200K, churn £100K, NRR = (£1M + £200K − £100K) ÷ £1M = 110%; NRR >100% = growing without new customers (organic growth), NRR <100% = contracting despite new acquisition (bad); NRR is most important metric because it decouples growth from acquisition",
      "NRR >100% is magic threshold: Company is profitable on day 1 with new customers (payback < contract period); at £1M MRR with 120% NRR, you grow £200K/month just from existing customers; new acquisition is optional (icing on cake); company can reach £10M+ ARR without proportional sales team growth",
      "Improve NRR: Reduce churn (retention features), increase expansion (upsells, seat growth, usage-based billing), improve payback period (higher ACV, lower CAC); each 5% NRR improvement = 10-20% faster path to profitability; NRR trajectory matters more than absolute number (improving from 105% to 120% over 12 months = great progress)"
    ],
    content: [
      {
        heading: "Understanding Net Revenue Retention (NRR)",
        body: `Net Revenue Retention (NRR) measures how much revenue you retain and grow from existing customers.

**NRR Formula**

NRR = (Beginning revenue + Expansion revenue − Churn revenue) ÷ Beginning revenue × 100

Or simplified:
NRR = (Beginning revenue + Net change from existing customers) ÷ Beginning revenue × 100

Where:
- Beginning revenue: Revenue at start of period
- Expansion revenue: Upsells, seat additions, usage increases from existing customers
- Churn revenue: Customers who cancelled or downgraded

**NRR Examples**

Example 1: Simple case

Beginning MRR: £100K
- Customer A (£10K): Stays (no change)
- Customer B (£20K): Upgrades to £25K (expansion +£5K)
- Customer C (£15K): Cancels (churn −£15K)
- Customer D (£55K): Stays (no change)

Calculation:
- Beginning: £100K
- Expansion: +£5K
- Churn: −£15K
- Net: £100K + £5K − £15K = £90K
- NRR: £90K ÷ £100K = 90%

Interpretation: Retained 90% of revenue from existing customers.

Example 2: Growth case

Beginning MRR: £100K
- Expansion: +£20K (upsells, seat growth)
- Churn: −£5K (one customer cancelled)
- Net: £100K + £20K − £5K = £115K
- NRR: £115K ÷ £100K = 115%

Interpretation: Grew 15% from existing customers (expansion exceeded churn).

**NRR Benchmarks**

| NRR | Status | Health |
|-----|--------|--------|
| <100% | Contraction | Poor (losing revenue) |
| 100% | Flat | Marginal (no growth from existing) |
| 100-110% | Modest growth | Acceptable (some expansion) |
| 110-120% | Strong growth | Good (healthy expansion) |
| 120%+ | Exceptional | Excellent (best-in-class) |

By stage:
- Series A: 95-105% NRR typical (focus on retention)
- Series B: 105-120% NRR target (proven expansion)
- Series C: 120%+ NRR expected (mature expansion)
- Public SaaS: 130%+ NRR (best-in-class)

**Why NRR Matters**

NRR is the most important SaaS metric because it shows:

1. **Product-market fit**: High NRR means customers see value (willing to expand)
2. **Scalability**: High NRR = can scale without proportional sales team growth
3. **Profitability path**: High NRR = likely to be profitable at scale
4. **Competitive advantage**: High NRR = harder for competitors to displace you

Example: Two companies, both growing 50% YoY, but different NRR:

**Company A: 50% growth, 105% NRR**
- £10M ARR, £1M new customers/month
- NRR tells us: £10M × 0.05 = £500K per month organic growth
- Needs to acquire £500K new to hit 50% growth
- Efficient: Can scale growth organically

**Company B: 50% growth, 95% NRR**
- £10M ARR, £1M new customers/month
- NRR tells us: £10M × (−0.05) = −£500K per month contraction from churn
- Needs to acquire £1M new to offset churn + growth
- Inefficient: Burning through new customers to offset churn

Company A is more valuable (organic growth is sustainable). Company B has to grow faster to stay flat (unsustainable).

**NRR vs. Churn vs. Expansion**

NRR is the combination of churn and expansion:

NRR = (1 − Monthly churn %) × (1 + Monthly expansion %)

If monthly churn = 2% and monthly expansion = 3%:
NRR = (1 − 0.02) × (1 + 0.03) = 0.98 × 1.03 = 1.0094 = 100.94% (approximately)

This shows:
- Low churn (2%/month = 22% annual) = good baseline
- Low expansion (3%/month = 43% annual) = not enough to offset churn
- Result: Barely growing organically

If you improve expansion from 3% to 6% per month:
NRR = 0.98 × 1.06 = 1.0388 = 103.88%

3% expansion improvement → 3% NRR improvement.

Similarly, if you improve churn from 2% to 1% per month:
NRR = 0.99 × 1.03 = 1.0197 = 101.97%

1% churn improvement → 1% NRR improvement.

Both levers (reducing churn and increasing expansion) have equal impact on NRR.

**NRR and Profitability**

High NRR companies reach profitability faster:

Example: £5M ARR, 20% target margin

**Low NRR (100%):**
- Can't grow from existing customers
- Must acquire all growth from new customers
- CAC payback must be <12 months to scale
- Difficult to reach 20% margin at scale (new acquisition cost too high)

**High NRR (120%):**
- Grow £1M organically per year (20% of base)
- Only need to acquire £500K incremental for 30% YoY growth
- Lower CAC payback needed (<18 months)
- Easy to reach 20%+ margin (lower CAC burden)

At scale (£50M ARR):
- Low NRR company: Must acquire £15M/year (30% growth) = high CAC burden
- High NRR company: Organic growth £10M + acquire £5M = lower CAC burden

High NRR unlocks profitability.
`
      },
      {
        heading: "Calculating and Improving NRR",
        body: `How to calculate NRR precisely and identify levers to improve it.

**Calculating NRR by Cohort**

NRR is best calculated by cohort (customers acquired in same period):

January 2025 cohort (100 customers, £100K MRR):

| Month | Customers | MRR | Expansion | Churn | Net change |
|-------|-----------|-----|-----------|-------|-----------|
| Jan | 100 | £100K | — | — | — |
| Feb | 98 | £104K | £5K | −£1K | +£4K |
| Mar | 96 | £107K | £4K | −£1K | +£3K |
| Apr | 94 | £110K | £3K | −£2K | +£1K |
| May | 91 | £112K | £3K | −£1K | +£2K |
| Jun | 89 | £114K | £2K | −£2K | 0 |

NRR by month (compared to January):
- Feb: (£104K − £1K) ÷ £100K = 103% (lost 2 customers, expansion offset churn)
- Mar: (£107K − £1K) ÷ £100K = 106%
- Jun: (£114K − £3K) ÷ £100K = 111%

The cohort went from £100K to £114K in 6 months = 114% MRR, but £3K churn, so 111% NRR.

**Improving NRR: Levers**

NRR = (1 − Churn %) × (1 + Expansion %)

To improve NRR, you can:

1. **Reduce churn**
   - Current: 2% monthly = 22% annual
   - Target: 1% monthly = 12% annual
   - Impact: −1% churn → +1% NRR

   Tactics:
   - Improve product stickiness (features customers depend on)
   - Better onboarding (activation reduces early churn)
   - Proactive support (reduce friction)
   - Integrate deeply (hard to switch if integrated)

2. **Increase expansion**
   - Current: 3% monthly = 43% annual
   - Target: 6% monthly = 80% annual
   - Impact: +3% expansion → +3% NRR

   Tactics:
   - Seat expansion (more users)
   - Tier upgrades (basic → pro → enterprise)
   - Usage-based billing (charge as customer grows)
   - Feature upsells (advanced features at higher tiers)

3. **Combined approach** (most effective)
   - Reduce churn 1% + increase expansion 3% = +4% NRR improvement
   - From 100% NRR (baseline) to 104% NRR (healthy)

**NRR Levers by Customer Segment**

Different segments respond to different levers:

**Enterprise (high-touch):**
- Best lever: Reduce churn (hard to leave once integrated)
- Expansion limited (already on enterprise tier)
- Target: 110-120% NRR (most from churn prevention)

**Mid-market (balanced):**
- Both levers work (reduce churn + increase expansion)
- Churn: 2-3% monthly
- Expansion: 5-8% monthly
- Target: 110-120% NRR (balanced approach)

**SMB (self-serve):**
- Best lever: Increase expansion (easy to add users/features)
- Hard to reduce churn (easy to switch)
- Churn: 5-8% monthly
- Expansion: 3-5% monthly
- Target: 95-105% NRR (focus on expansion to offset churn)

**Measuring NRR Quarterly**

Track quarterly cohort NRR:

| Cohort | Q1 | Q2 | Q3 | Q4 | Annual NRR |
|--------|----|----|----|----|-----------|
| 2024 Q1 | 100% | 104% | 108% | 112% | 112% |
| 2024 Q2 | 100% | 105% | 110% | — | — |
| 2024 Q3 | 100% | 102% | — | — | — |
| 2024 Q4 | 100% | — | — | — | — |

Insights:
- Q1 2024 cohort: Strong NRR (112% annual)
- Q2 2024 cohort: Similar trajectory (105% at 6 months)
- Q3 2024 cohort: Lower NRR (102% at 3 months, concerning)

Action: Investigate Q3 cohort decline. What changed?

**NRR Waterfall Analysis**

Visualize how NRR changes month-to-month:

Starting MRR: £1M
- Expansion: +£150K (15% of base)
- Churn: −£100K (−10% of base)
- Ending MRR: £1.05M
- NRR: 105%

Waterfall visualization:
\`\`\`
£1M (start) → +£150K (expansion) → −£100K (churn) → £1.05M (end)
     100%         +15%                −10%            105% NRR
\`\`\`

This makes it clear: Expansion (+15%) exceeds churn (−10%), yielding net +5% NRR.

**NRR Targets by Path to Profitability**

Your NRR target depends on your profitability timeline:

**Path 1: Rapid profitability (year 2)**
- Target: 130%+ NRR (very high expansion)
- Allows company to reach margin at lower scale
- Example: Stripe, Plaid (high NRR companies)

**Path 2: Standard path (year 3-4)**
- Target: 110-120% NRR (strong expansion)
- Industry standard
- Most SaaS companies target this

**Path 3: Growth-focused (year 5+)**
- Target: 100-110% NRR (modest expansion)
- OK if you're funding growth aggressively
- Common for Series B companies burning cash

Your NRR target should align with your profitability timeline.

**Improving NRR: Implementation Timeline**

Quarterly roadmap to improve NRR from 105% to 120%:

**Q1: Reduce churn (1% improvement)**
- Build retention features (user stickiness)
- Improve onboarding (day-1 activation)
- Proactive support (CS outreach)
- Target: Churn from 2.5% to 1.8% monthly

**Q2: Increase expansion (2% improvement)**
- Launch tier upgrades
- Add seat expansion pricing
- Feature upsells
- Target: Expansion from 3% to 5% monthly

**Q3: Optimize both (1% improvement)**
- Double down on what's working
- Test new expansion motions
- Target: 118% NRR (very close)

**Q4: Reach target (1% improvement)**
- Fine-tune and stabilize
- Measure NRR by cohort
- Document playbook
- Target: 120% NRR (achievement)

Total improvement: 105% → 120% = +15 percentage points over 12 months.
`
      }
    ],
    relatedSlugs: [
      "expansion-revenue-upsell-cross-sell",
      "churn-analysis-retention-improvement",
      "customer-lifetime-value-ltv-calculation",
      "unit-economics-deep-dive",
      "profitability-mechanics"
    ],
    faq: [
      {
        q: "What's a good NRR?",
        a: "100% = flat (no growth from existing). 100-110% = acceptable. 110-120% = good. 120%+ = excellent. Top SaaS companies have 130%+ NRR."
      },
      {
        q: "How do I calculate NRR?",
        a: "NRR = (Beginning revenue + Expansion − Churn) ÷ Beginning revenue. Example: Start £100K, expand £20K, churn £10K = (£100K + £20K − £10K) ÷ £100K = 110%."
      },
      {
        q: "Should I focus on reducing churn or increasing expansion?",
        a: "Both equally impact NRR. But psychologically, reducing churn (preventing loss) feels better than expansion. Start with whichever is easier for your product."
      },
      {
        q: "How does NRR affect profitability?",
        a: "High NRR (120%+) means you grow organically without new customer acquisition. Low NRR (95%) means you're declining and need aggressive acquisition just to stay flat. NRR >100% is the profitability threshold."
      }
    ],
    videoUrl: ""
  }
];

export default batch81Articles;
