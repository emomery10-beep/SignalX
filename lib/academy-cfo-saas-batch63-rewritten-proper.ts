import { AcademyArticle } from "@/types/academy";

export const batch63Articles: AcademyArticle[] = [
  {
    slug: "customer-segmentation-by-profitability",
    title: "Customer Segmentation by Profitability: Identifying Your Most Valuable Segments",
    description: "Segment customers by profitability, LTV, churn, and CAC. Allocate resources to most valuable segments and optimize low-value segments.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "customer segmentation",
      "profitability",
      "customer value",
      "LTV",
      "CAC",
      "segment analysis",
      "high-value customers",
      "customer economics",
      "segment optimization",
      "customer mix"
    ],
    keyTakeaways: [
      "Segment matrix: Plot LTV (y-axis) vs. CAC (x-axis); high-LTV/low-CAC (top-left quadrant) = cash cows (best segment), invest more here; high-LTV/high-CAC (top-right) = potential (growth opportunity), improve CAC; low-LTV/low-CAC (bottom-left) = marginal, minimize waste; low-LTV/high-CAC (bottom-right) = avoid (unprofitable)",
      "Profitability by segment varies 5-10x: enterprise segment (LTV £500K, CAC £50K = 10x ratio) vs. SMB segment (LTV £50K, CAC £20K = 2.5x ratio); knowing this distribution is essential for allocating sales/marketing budget (prioritize enterprise, minimize SMB)",
      "Segment optimization: High-value segment with low CAC → Keep, invest more. High-value segment with high CAC → Improve CAC (better qualification, sales process efficiency). Low-value segment → Automate (self-serve), don't allocate humans. Unprofitable segment → Eliminate or reposition"
    ],
    content: [
      {
        heading: "Customer Segmentation Framework",
        body: `Not all customers are equally valuable. Segment your customer base by profitability to allocate resources strategically.

Common segmentation dimensions:

By company size:
- Enterprise (1000+ employees)
- Mid-market (100-1000 employees)
- SMB (10-100 employees)
- Self-serve (1-10 employees)

By industry:
- Financial services
- Healthcare
- Retail
- Technology
- Etc.

By geography:
- US, UK, Europe, Asia

By acquisition channel:
- Direct sales
- Self-serve
- Partner/reseller
- Referral

**Profitability Analysis**

For each segment, calculate:

1. **ACV (Average Contract Value)**
   - Enterprise: £500K
   - Mid-market: £50K
   - SMB: £10K
   - Self-serve: £1K

2. **CAC (Customer Acquisition Cost)**
   - Enterprise: £50K (complex sales, executive engagement)
   - Mid-market: £10K (sales-led)
   - SMB: £2K (lower touch)
   - Self-serve: £0.5K (marketing/freemium)

3. **Gross margin**
   - Enterprise: 75% (higher price, premium support)
   - Mid-market: 70%
   - SMB: 65% (lower price, lower margin)
   - Self-serve: 85% (no support, fully self-service)

4. **Churn rate**
   - Enterprise: 1% monthly (sticky, high switching costs)
   - Mid-market: 2% monthly
   - SMB: 5% monthly (price-sensitive, high churn)
   - Self-serve: 8% monthly (low commitment, easy to churn)

5. **LTV (Lifetime Value)**
   - Enterprise: (£500K × 75%) × (1 ÷ 0.01) = £37.5M (very high, long life)
   - Mid-market: (£50K × 70%) × (1 ÷ 0.02) = £1.75M (high)
   - SMB: (£10K × 65%) × (1 ÷ 0.05) = £130K (medium)
   - Self-serve: (£1K × 85%) × (1 ÷ 0.08) = £10.6K (low)

6. **LTV ÷ CAC ratio**
   - Enterprise: £37.5M ÷ £50K = 750x (excellent)
   - Mid-market: £1.75M ÷ £10K = 175x (excellent)
   - SMB: £130K ÷ £2K = 65x (excellent)
   - Self-serve: £10.6K ÷ £0.5K = 21x (very good)

All segments look profitable, but unit economics vary wildly.

**Profitability Matrix**

Plot each segment on a 2x2 matrix:

Y-axis: LTV (high to low)
X-axis: CAC (low to high)

Quadrants:

1. **Cash Cows** (High LTV, Low CAC) - TOP LEFT
   - Example: Enterprise segment
   - LTV £37.5M, CAC £50K = 750x ratio
   - Action: Invest heavily, expand presence
   - These customers drive profitability

2. **Potential** (High LTV, High CAC) - TOP RIGHT
   - Example: Mid-market segment
   - LTV £1.75M, CAC £10K = 175x ratio
   - Action: Scale up, improve CAC efficiency
   - High-value if you can reduce CAC

3. **Marginal** (Low LTV, Low CAC) - BOTTOM LEFT
   - Example: Self-serve segment
   - LTV £10.6K, CAC £0.5K = 21x ratio
   - Action: Minimize cost, don't invest heavily
   - Keep but automate

4. **Avoid** (Low LTV, High CAC) - BOTTOM RIGHT
   - Example: (Hypothetical) Complex SMB with long sales cycle
   - LTV £50K, CAC £20K = 2.5x ratio
   - Action: Eliminate or drastically change
   - Profitability too low

**Segment Optimization**

Strategy by segment:

Enterprise (cash cow):
- Invest: Dedicated AE per account, executive sponsorship
- Target: 10-20 new customers/year (not volume play)
- CAC payback: Acceptable to be 24 months (high LTV supports it)
- Retention focus: 95%+ renewal rate
- Growth: Land and expand (expand revenue per account)
- Result: Highest ROI, most profitable

Mid-market (potential):
- Invest: AE team, but scalable model (1 AE per 10-15 customers)
- Target: 50-100 new customers/year
- CAC payback: 12-18 months
- Retention focus: 90%+ renewal rate
- Growth: Mix of land-and-expand and volume
- Result: Good ROI, scales better than enterprise

SMB (marginal):
- Minimize: Self-serve or light-touch AE
- Target: High volume (500+ customers, low touch)
- CAC payback: <12 months (must be fast)
- Retention focus: 80%+ acceptable (higher churn tolerance)
- Growth: Sales efficiency critical (magic number >0.75)
- Result: Lower ROI, but volume profitable

Self-serve (low-value):
- Automate: Freemium, trials, no human touch
- Target: Highest volume (10,000+ users)
- CAC payback: <6 months (must be very fast)
- Retention focus: 70%+ acceptable (high churn expected)
- Growth: Viral/organic (low CAC)
- Result: Minimal CAC, large volume, but low LTV

**Segment Financial Impact**

Example: £10M ARR SaaS

Segment breakdown:
- Enterprise (£6M): 12 customers at £500K each
- Mid-market (£3M): 60 customers at £50K each
- SMB (£0.8M): 80 customers at £10K each
- Self-serve (£0.2M): 200 customers at £1K each

Profitability analysis:

| Segment | Revenue | Customers | Margin % | Gross profit | CAC spend | CAC payback | Profitability |
|---------|---------|----------|----------|----------|----------|----------|----------|
| Enterprise | £6M | 12 | 75% | £4.5M | £600K | 20 months | £4.5M net |
| Mid-market | £3M | 60 | 70% | £2.1M | £600K | 18 months | £1.5M net |
| SMB | £0.8M | 80 | 65% | £0.52M | £160K | 12 months | £0.36M net |
| Self-serve | £0.2M | 200 | 85% | £0.17M | £100K | 8 months | £0.07M net |
| **Total** | **£10M** | **352** | **71.7%** | **£7.3M** | **£1.46M** | - | **£6.43M net** |

Insight: Enterprise is 69% of profitability (£4.5M ÷ £6.43M), despite only 60% of revenue (£6M ÷ £10M).

Decision: Invest more in enterprise (highest ROI), reduce SMB/self-serve effort.

**Optimizing Low-Profitability Segments**

Low-profitability segment (e.g., SMB with 12-month payback):

Option 1: Reduce CAC
- Current: £2K CAC, 12-month payback
- Target: £1.5K CAC (25% reduction), 9-month payback
- How: Improve qualification (don't take bad-fit customers), optimize sales process
- Impact: Shorter payback, higher profitability

Option 2: Increase ACV
- Current: £10K ACV
- Target: £12.5K ACV (25% increase), improve pricing/packaging
- How: Add features, upsell at close, land and expand
- Impact: Higher revenue per customer, better profitability

Option 3: Improve margin
- Current: 65% gross margin
- Target: 72% (reduce COGS 7 points)
- How: Optimize infrastructure, negotiate vendor costs
- Impact: More profit per customer

Option 4: Shift to self-serve
- Current: 1 AE touches SMB (high CAC)
- Target: Self-serve (minimal CAC)
- How: Build freemium trial, self-service onboarding, chat support
- Impact: CAC £2K → £0.5K, payback improves from 12 to 3 months

Option 5: Stop pursuing that segment
- If no easy improvements, exit gracefully
- Current SMB customers: Keep, don't invest in new ones
- Redirect sales to more profitable segments

**Segment Monitoring**

Track quarterly:

| Segment | # Customers | Avg LTV | Avg CAC | LTV÷CAC | NRR | Health |
|---------|----------|---------|---------|---------|------|--------|
| Enterprise | 12 | £37.5M | £50K | 750x | 120% | Healthy |
| Mid-market | 60 | £1.75M | £10K | 175x | 110% | Healthy |
| SMB | 80 | £130K | £2K | 65x | 95% | Monitor |
| Self-serve | 200 | £10.6K | £0.5K | 21x | 80% | Monitor |

Red flags:

- LTV trending down (customers churn faster, less expansion)
- CAC trending up (harder to acquire in segment)
- LTV÷CAC below 3x (unprofitable)
- NRR below 90% (churn exceeding expansion)

If red flag: Investigate cause, decide: invest to fix or deprioritize.

**Segment Allocation (Sales + Marketing budget)**

Allocate by potential ROI:

Enterprise: 60% of sales/marketing budget
- Highest ROI, worth the investment
- 1 AE per 10-15 accounts, plus CSM
- Dedicated marketing support

Mid-market: 30% of budget
- Good ROI, scales well
- 1 AE per 15-20 accounts
- Marketing support shared

SMB: 8% of budget
- Lower ROI, minimize spend
- 1 AE per 50+ accounts
- Self-serve marketing

Self-serve: 2% of budget
- Minimal spend
- Marketing-led, no sales
- Viral/organic growth focus

Result: Resources concentrated on high-ROI segments, minimized on low-ROI.

Customer segmentation is the lens for allocating finite resources (sales time, marketing budget, engineering investment). Most companies underspend on high-LTV segments and overspend on low-LTV. Correcting this allocation improves overall profitability without increasing revenue.
`
      }
    ],
    relatedSlugs: [
      "customer-lifetime-value-calculation",
      "customer-acquisition-cost-optimization",
      "unit-economics-deep-dive",
      "enterprise-sales-strategy-tactics",
      "marketing-roi-and-attribution"
    ],
    faq: [
      {
        q: "How many segments should I track?",
        a: "3-5 (company size, geography, or industry). More than 5 = too granular, harder to manage. Fewer than 2 = hiding material differences."
      },
      {
        q: "What if all segments are equally profitable?",
        a: "Rare. Most companies have 1 star segment (3-5x more profitable). Find it, invest there. If truly equal, pick 1 to focus (easier)."
      },
      {
        q: "How often should I recalculate segment economics?",
        a: "Quarterly minimum, more frequently if segments shifting. Segment health changes as you scale or market changes."
      },
      {
        q: "Should I eliminate unprofitable segments?",
        a: "Not immediately. First: try to improve (reduce CAC, increase ACV). If no improvement, gradually deprioritize. Don't abruptly cut customers."
      }
    ],
    videoUrl: ""
  }
];

export default batch63Articles;
