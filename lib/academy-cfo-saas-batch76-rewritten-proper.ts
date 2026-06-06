import { AcademyArticle } from "@/types/academy";

export const batch76Articles: AcademyArticle[] = [
  {
    slug: "customer-segmentation-ltv-by-segment",
    title: "Customer Segmentation and LTV by Segment: Understanding Which Customers Are Most Valuable",
    description: "Segment customers by profile, industry, or ACV. Calculate LTV separately for each segment to identify your most profitable customer types.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer segmentation",
      "customer segments",
      "lifetime value",
      "LTV by segment",
      "customer profitability",
      "segment analysis",
      "customer cohorts",
      "profitable segments",
      "customer targeting",
      "go-to-market strategy"
    ],
    keyTakeaways: [
      "Segment customers by: company size (SMB £1-10K ACV vs. mid-market £10-50K vs. enterprise £50K+), industry (fintech churn 1% vs. marketing churn 4%), or source (organic search LTV £20K vs. cold email £5K); same product, wildly different unit economics by segment; example: Enterprise customers stay 4 years (36% annual, 97% LTV/CAC), SMB stay 1.5 years (50% annual churn, 2.5x LTV/CAC) — completely different GTM required",
      "LTV by segment = different churn, ACV, and GM by customer type; enterprise high ACV + low churn = high LTV, justifies expensive sales team; SMB low ACV + high churn = low LTV, needs self-serve model; mismatched model (expensive sales for SMB, self-serve for enterprise) destroys unit economics; align GTM to segment LTV",
      "Identify best segment: Highest LTV/CAC ratio (revenue per acquisition), fastest payback period, fastest expansion, lowest support cost; concentrate hiring/product on winning segment, deprioritize losing segments; mature SaaS: 60% revenue from top 2-3 segments, focus on those, minimize distraction"
    ],
    content: [
      {
        heading: "Understanding Customer Segmentation",
        body: `Not all customers are created equal. Different customer types have different economics, churn rates, and value.

**Why Segment?**

Segmentation reveals which customer types drive your business:

Example: SaaS with £1M ARR, appears healthy, but breakdown by segment tells different story:

| Segment | Customers | ACV | Revenue | Churn | LTV | GTM cost |
|---------|-----------|-----|---------|-------|-----|----------|
| Enterprise | 10 | £50K | £500K | 5% | £1M | High (sales) |
| SMB | 100 | £5K | £500K | 40% | £50K | Low (self-serve) |
| **Total** | **110** | — | **£1M** | — | — | — |

Blended metrics (hiding true story):
- Average ACV: £1M ÷ 110 = £9K
- Blended churn: (5% × 10 + 40% × 100) ÷ 110 = 37% (very high!)
- Blended LTV: £300K ÷ 110 = £2.7K

Without segmentation, you'd think:
- ACV is £9K (actually ranges £5K-£50K)
- Churn is 37% (actually 5% or 40%)
- Typical customer LTV is £2.7K (actually £50K or £1M)

Segmentation reveals:
- Enterprise customers are 2x more valuable per customer
- SMB customers are churning at disaster levels (40%!)
- Two completely different businesses bundled into one

**Common Segmentation Approaches**

1. **By company size (employee count)**
   - Freelancers: 1 person, £20-50/month
   - SMB: 2-50 people, £50-500/month
   - Mid-market: 50-500 people, £500-5K/month
   - Enterprise: 500+ people, £5K+/month

2. **By ACV (Annual Contract Value)**
   - Low: <£1K ACV
   - Mid: £1K-£10K ACV
   - High: £10K-£50K ACV
   - Enterprise: >£50K ACV

3. **By industry**
   - Finance tech
   - HR tech
   - Marketing tech
   - Operations
   - Etc.

4. **By acquisition source**
   - Organic (search, word-of-mouth)
   - Paid ads
   - Sales outreach
   - Partnerships
   - Product-led (free trial)

5. **By use case**
   - Department-level (single team using product)
   - Company-wide (entire organization)
   - Enterprise deployment (customization required)

Different segments have different:
- Churn rates
- Expansion potential
- Support costs
- Sales cycle length
- Payback period
- Go-to-market model

**Key Metrics by Segment**

Track these metrics separately for each segment:

| Metric | Meaning |
|--------|---------|
| Customers | Volume acquired in segment |
| ACV | Average contract value per customer |
| Revenue | Total revenue from segment |
| Churn | % of customers lost monthly/annually |
| Expansion | % of customers who upgrade |
| NRR | Net Revenue Retention (expansion − churn) |
| CAC | Customer Acquisition Cost in segment |
| CAC payback | Months to recover acquisition cost |
| LTV | Lifetime Value of customer in segment |
| LTV/CAC | Payback ratio (>3 is healthy) |
| Time to profitability | Months from acquisition to break-even |
| Support cost | Cost to support per customer |
| Upsell potential | Revenue growth from customer over lifetime |

Different segments have different profiles. Don't use blended metrics.
`
      },
      {
        heading: "Calculating LTV by Segment",
        body: `LTV varies dramatically by segment. Here's how to calculate and compare.

**LTV Formula (Reminder)**

\`\`\`
LTV = (Monthly revenue per customer × Gross margin %) ÷ Monthly churn %
\`\`\`

Or for annual metrics:
\`\`\`
LTV = (Annual revenue per customer × Gross margin %) ÷ Annual churn %
\`\`\`

**LTV by Customer Size Segment**

Example SaaS with three customer segments:

**Segment 1: Enterprise (500+ employees)**
- ACV: £50K/year
- Monthly: £4,167
- Gross margin: 75% (high, enterprise customers support themselves)
- Monthly churn: 0.5% (very sticky, hard to leave)
- LTV = (£4,167 × 0.75) ÷ 0.005 = £625K per customer

**Segment 2: Mid-market (50-500 employees)**
- ACV: £10K/year
- Monthly: £833
- Gross margin: 70%
- Monthly churn: 2% (moderate, some attrition)
- LTV = (£833 × 0.70) ÷ 0.02 = £29K per customer

**Segment 3: SMB (2-50 employees)**
- ACV: £2K/year
- Monthly: £167
- Gross margin: 65% (lower, more support needed)
- Monthly churn: 4% (high, easy to switch)
- LTV = (£167 × 0.65) ÷ 0.04 = £2.7K per customer

Huge differences:
- Enterprise LTV: £625K per customer
- Mid-market LTV: £29K per customer
- SMB LTV: £2.7K per customer

Enterprise is 230x more valuable than SMB!

**CAC by Segment**

CAC also varies by segment (different go-to-market):

**Enterprise CAC**
- Sales team: £500K/year salary
- Closes: 4 deals/year
- CAC per deal: £125K
- Plus marketing support: +£25K
- Total CAC: £150K

**Mid-market CAC**
- Sales team: £250K/year salary
- Closes: 12 deals/year
- CAC per deal: £20K
- Plus marketing: +£5K
- Total CAC: £25K

**SMB CAC**
- Mostly marketing (ads, content)
- Cost: £5K-10K per customer acquired
- Total CAC: £7.5K

CAC by segment:
- Enterprise: £150K
- Mid-market: £25K
- SMB: £7.5K

**LTV/CAC Ratio by Segment**

This reveals unit economics viability:

| Segment | LTV | CAC | LTV/CAC | Payback |
|---------|-----|-----|---------|---------|
| Enterprise | £625K | £150K | 4.2x | 36 months (3 years) |
| Mid-market | £29K | £25K | 1.2x | 30 months (2.5 years) |
| SMB | £2.7K | £7.5K | 0.36x | 90 months (7.5 years!) |

Interpretation:
- **Enterprise**: Unit economics excellent (4.2x LTV/CAC, payback 3 years)
- **Mid-market**: Unit economics breakeven (1.2x LTV/CAC, payback 2.5 years)
- **SMB**: Unit economics broken (0.36x LTV/CAC, payback 7.5 years, will never make money)

SMB segment is losing money. You're spending £7.5K to acquire customers worth £2.7K. You'll never break even.

**Strategic Implication**

With these unit economics, the strategy is clear:

1. **Double down on enterprise** (highest unit economics, 4.2x LTV/CAC)
   - Invest more in sales team
   - Focus enterprise features
   - Build dedicated enterprise sales process

2. **Optimize mid-market** (breakeven unit economics, 1.2x LTV/CAC)
   - Improve mid-market CAC (more efficient sales)
   - Target mid-market-specific features (team collaboration)
   - Try to move mid-market closer to enterprise economics

3. **Shut down or reshape SMB** (broken unit economics, 0.36x LTV/CAC)
   - Can't sell with expensive sales team (CAC too high)
   - Need free trial or self-serve model (reduce CAC to £1-2K)
   - Then calculate if £2.7K LTV + £1.5K CAC = 1.8x (still marginal, but possible)

Most successful SaaS companies: Dominate one segment, ignore others.

**LTV by Acquisition Source**

Different channels acquire different quality customers:

| Source | CAC | ACV | LTV | LTV/CAC | Payback |
|--------|-----|-----|-----|---------|---------|
| Organic (SEO, referral) | £2K | £8K | £40K | 20x | 6 months |
| Paid ads | £5K | £6K | £30K | 6x | 10 months |
| Cold email | £3K | £5K | £25K | 8x | 12 months |
| Sales team | £20K | £15K | £75K | 3.75x | 16 months |
| Product-led trial | £1K | £4K | £20K | 20x | 6 months |

Insights:
- Organic and product-led have best unit economics (20x)
- Sales team has high ACV but high CAC (moderate 3.75x)
- Paid ads are worst (lowest ACV, high CAC, 6x ratio)

Strategy:
- Invest in organic (highest ROI)
- Build product-led channel (second highest ROI)
- Use paid ads sparingly (lowest ROI)
- Sales team for high-ACV customers only (enterprise)

**Segment-Specific Strategy**

Once you identify segments and their unit economics, tailor your approach:

**Enterprise segment (high LTV, high CAC)**
- Go-to-market: Direct sales (AEs, demos)
- Product: Enterprise features (APIs, SSO, compliance)
- Pricing: High (£20K+ ACV)
- Support: Dedicated CSM
- Goal: 3-5 year customer lifetime

**Mid-market segment (moderate LTV, moderate CAC)**
- Go-to-market: Sales + self-serve hybrid
- Product: Collaboration features (team workflows)
- Pricing: Moderate (£5-20K ACV)
- Support: Email/chat support
- Goal: 2-3 year customer lifetime

**SMB segment (low LTV, low CAC)**
- Go-to-market: Self-serve (free trial, freemium)
- Product: Simple, easy onboarding
- Pricing: Low (£500-3K ACV)
- Support: Help center, chatbot
- Goal: 1-2 year customer lifetime (lower expectations)

**Profitability by Segment**

Some segments are profitable, others are not:

Example company with mixed segments:

| Segment | Revenue | CAC cost | Payback cost | Break-even month | Profitable |
|---------|---------|----------|----------|---------|-----------|
| Enterprise | £500K | £100K | £12 months cost | Month 12 | ✓ |
| Mid-market | £300K | £75K | £30 months cost | Month 30+ | ✗ (barely) |
| SMB | £200K | £50K | £90 months cost | Month 90+ | ✗ (never) |

Enterprise is profitable (payback 12 months, generates £500K revenue/year).
Mid-market is marginal (payback 30 months, need 2.5+ years to break even per cohort).
SMB is unprofitable (payback 90 months, customer gone before breaking even).

**Most successful SaaS companies**:
- 60-70% revenue from best segment (enterprise or mid-market)
- 20-30% from secondary segment
- <10% from remaining (acceptable but deprioritized)

Don't try to serve all segments equally. Dominate your best segment, treat others as secondary.
`
      },
      {
        heading: "Identifying and Optimizing Your Best Segment",
        body: `How to find your highest-value segment and double down.

**Step 1: Analyze All Segments**

Create a spreadsheet of all customer segments:

| Segment | Customers | ACV | Churn | LTV | CAC | LTV/CAC | NRR | Expansion |
|---------|-----------|-----|-------|-----|-----|---------|-----|-----------|
| Enterprise | 5 | £50K | 5% | £625K | £150K | 4.2x | 110% | 20% |
| Mid-market | 15 | £12K | 15% | £60K | £25K | 2.4x | 105% | 15% |
| SMB | 80 | £2K | 40% | £3K | £5K | 0.6x | 80% | 5% |
| Total | 100 | — | — | — | — | — | — | — |

**Step 2: Rank by Unit Economics**

Rank by LTV/CAC ratio:

1. Enterprise: 4.2x (best)
2. Mid-market: 2.4x (good)
3. SMB: 0.6x (bad)

Also rank by:
- Payback period (lower is better)
- NRR (higher is better, shows expansion potential)
- Expansion rate (higher is better, means customers grow over time)

**Step 3: Identify Your Wedge**

Wedge = segment with highest unit economics. Usually where you have product-market fit first.

In this example: Enterprise is the wedge (4.2x LTV/CAC).

**Step 4: Double Down on Wedge**

Resources should flow to the wedge segment:

| Function | Current | Target |
|----------|---------|--------|
| Sales headcount | 3 (1 for each segment) | 5 (4 for enterprise, 1 for mid-market) |
| Product roadmap | 50% enterprise, 30% mid-market, 20% SMB | 70% enterprise, 20% mid-market, 10% SMB |
| Marketing spend | 40% enterprise, 30% mid-market, 30% SMB | 50% enterprise, 30% mid-market, 20% SMB |
| Pricing | £50K, £12K, £2K all equal | £80K enterprise (raise), £12K mid (hold), £1.5K SMB (lower) |

Result: Concentrate 70% of resources on enterprise (wedge), optimize unit economics further.

**Step 5: Test Segment Improvements**

For each segment, test improvements:

Enterprise improvements (goal: increase LTV/CAC from 4.2x to 5x):
- Increase ACV: Raise pricing 10% (£50K → £55K) = +10% revenue per customer
- Reduce churn: Add enterprise features (SSO, compliance) = reduce churn from 5% to 4% = +1% annual retention
- Reduce CAC: Better sales targeting (ICP clear) = close higher % of prospects = CAC stays same
- Result: New LTV/CAC ≈ 4.8x (near 5x goal)

Mid-market improvements (goal: increase LTV/CAC from 2.4x to 3x):
- Improve expansion: Add collaboration features = expand NRR from 105% to 115% = +10% LTV
- Reduce CAC: More efficient sales process = CAC down 20% = LTV/CAC 2.4 × 1.2 = 2.9x
- Result: New LTV/CAC ≈ 3.1x (above 3x goal)

SMB improvements (goal: increase LTV/CAC from 0.6x to 1.5x, minimum viable):
- Shift go-to-market: Move from sales to self-serve = CAC down from £5K to £2K = LTV/CAC 0.6 × 2.5 = 1.5x
- Reduce churn: Better onboarding = churn from 40% to 25% = +20% LTV = new LTV £4.5K
- Result: New LTV/CAC ≈ 2.25x (above goal, but requires shifting model)

**Step 6: Redeploy Resources Based on Results**

If enterprise improves to 5x and mid-market to 3.5x, but SMB stuck at 1.2x (even with self-serve):
- Keep enterprise at 70% of resources (best performing)
- Increase mid-market to 20% (second best)
- Reduce SMB to 10% (underperforming)

This is continuous optimization.

**Segment Maturity Model**

As segments mature, optimize differently:

**Growth phase** (new segment, building market fit):
- Goal: Prove product-market fit (LTV/CAC >1)
- Action: Flexible positioning, test messaging
- Metrics: Churn, CAC, time to profitability

**Scale phase** (segment proven, expanding):
- Goal: Improve unit economics (LTV/CAC >2)
- Action: Streamline sales, optimize pricing
- Metrics: LTV/CAC, payback, NRR

**Mature phase** (segment saturated, focus on retention):
- Goal: Maximize LTV (reduce churn, increase expansion)
- Action: Customer success, expansion offerings
- Metrics: NRR, expansion rate, customer lifetime

**Optimization Metrics by Segment**

Track and optimize quarterly:

| Segment | Growth phase | Scale phase | Mature phase |
|---------|----------|----------|----------|
| Enterprise | CAC <£100K | CAC £100-150K | CAC £150K, LTV >£500K |
| Mid-market | CAC <£15K | CAC £15-25K | CAC £20-25K, NRR >110% |
| SMB | CAC <£5K | CAC £2-5K | CAC <£3K or exit |

Different phases have different targets. Know which phase each segment is in.

**Avoiding Common Mistakes**

Mistake 1: Treating all segments the same
- Solution: Calculate LTV/CAC by segment. Invest accordingly.

Mistake 2: Sticking with bad segments
- Solution: If LTV/CAC <1 and not improving, exit segment or pivot model.

Mistake 3: Not investing enough in wedge
- Solution: Concentrate 60%+ of resources on best segment. Starving wedge kills growth.

Mistake 4: Ignoring segment evolution
- Solution: Segments change over time. Re-analyze quarterly. What was best 6 months ago may not be today.

Mistake 5: Losing focus by chasing multiple segments
- Solution: Pick one wedge segment. Dominate it. Then expand to secondary segments.

Rule of thumb: 80% revenue from 20% of segments. Find those segments, and concentrate.
`
      }
    ],
    relatedSlugs: [
      "customer-lifetime-value-ltv-calculation",
      "unit-economics-deep-dive",
      "customer-acquisition-cost-optimization",
      "sales-efficiency-magic-number",
      "net-revenue-retention-nrr-mastery"
    ],
    faq: [
      {
        q: "How do I identify customer segments?",
        a: "Start with what's easy to measure: company size (employees), ACV, industry, or source. Segment by one dimension first (e.g., size), then analyze LTV/CAC for each. Segment by a second dimension (industry) if you see big variations within size."
      },
      {
        q: "Which segment should I focus on?",
        a: "Focus on the segment with highest LTV/CAC ratio (unit economics). Usually enterprise or mid-market. If SMB has broken unit economics (LTV/CAC <1), either fix it (shift to self-serve model) or exit it."
      },
      {
        q: "How often should I re-analyze segments?",
        a: "At least quarterly. Segments evolve: new competitors, product changes, market shifts. What was best last quarter may be different this quarter. Re-calculate LTV/CAC, NRR, payback by segment."
      },
      {
        q: "What if I have no clear wedge segment (all similar economics)?",
        a: "Either you're early-stage (not yet found PMF), or you have a truly horizontal product. Pick segment with highest churn/LTV potential, or segment you enjoy most. Focus until you prove 3x LTV/CAC in that segment."
      }
    ],
    videoUrl: ""
  }
];

export default batch76Articles;
