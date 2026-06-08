import { AcademyArticle } from "@/types/academy";

export const batch180Articles: AcademyArticle[] = [
  {
    slug: "gross-margin-expansion-and-cost-optimization",
    title: "Gross Margin Expansion and Cost Optimization: Improving Profitability",
    description: "Master gross margin. Reduce COGS, improve unit economics, and build a path to profitability at scale.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "gross margin",
      "COGS",
      "cost optimization",
      "profitability",
      "unit economics",
      "margin expansion",
      "cost reduction",
      "operational efficiency",
      "scaling costs",
      "contribution margin"
    ],
    keyTakeaways: [
      "Gross margin definition: (Revenue - COGS) / Revenue. Example: £100K revenue, £20K COGS (hosting, payment fees, support) = £80K gross profit = 80% margin. Healthy SaaS: 70-85% margin. Why: Pays for operations, sales/marketing, profit. Low margin = unsustainable growth (unprofitable even if growing). Improve by: Reduce COGS (optimize infrastructure, negotiate vendor fees), increase pricing (pass costs to customer).",
      "Cost categories in COGS: (1) Infrastructure (hosting, data centers, compute). (2) Payment processing (Stripe fees, 2-3% of revenue). (3) Support costs (tier 1: email/chat support, includes customer success time). (4) Cost of goods (if physical). As company scales, COGS usually 15-30% of revenue (if pure software). Track by customer to see unit economics clarity.",
      "Margin improvement levers: (1) Negotiate vendor costs (save 10-20% on infrastructure). (2) Improve efficiency (automate support via chatbot, save labor). (3) Raise pricing (1-5% increase improves margin 1-5% bottom line). (4) Reduce lower-margin customers (fire low-value customers). Combined: 70% margin → 80% margin = 14% profitability improvement."
    ],
    content: [
      {
        heading: "Understanding Gross Margin",
        body: `Calculating and improving profitability at the unit level.

**Gross Margin Calculation**

Gross Margin % = (Revenue - COGS) / Revenue

COGS (Cost of Goods Sold): Direct costs to serve customer.

Example:
| Item | Amount |
|------|--------|
| Revenue (customer pays) | £100K |
| Hosting/infrastructure | -£10K |
| Payment processing | -£3K |
| Support costs | -£7K |
| **Gross Profit** | **£80K** |
| **Gross Margin %** | **80%** |

Interpretation:
- For every £1 of revenue, keep 80p (after COGS)
- 20p goes to direct costs
- 80p available for: Operating expenses, sales/marketing, profit

**COGS Components**

Infrastructure (largest cost for SaaS):
- Cloud hosting (AWS, Azure, GCP): 2-5% of revenue typical
- Data storage (databases, backups): 1-3% of revenue
- CDN (content delivery): 0.5-2% of revenue
- Total infrastructure: 5-10% of revenue

Payment processing:
- Credit card fees: 2-3% of revenue (Stripe standard)
- ACH fees: 0.5-1% for bank transfers
- Currency conversion: 0.5-1% if international
- Total payment: 2-3% of revenue

Support costs:
- Email/chat support: 2-4% of revenue
- Onboarding/CS: 2-5% of revenue
- Tool costs (ticketing system, etc): 0.5-1% of revenue
- Total support: 5-10% of revenue

Other:
- Payment to partners/affiliates: Variable
- Cost of goods (if physical): Variable
- Total other: 0-5% of revenue

**Typical Margin by Stage**

| Stage | COGS | Gross Margin |
|-------|------|---|
| Early (£500K ARR) | 25% | 75% |
| Growth (£5M ARR) | 20% | 80% |
| Scale (£20M ARR) | 18% | 82% |
| Mature (£50M+) | 15% | 85% |

Trend: COGS % decreases with scale (fixed costs spread over more customers).

`
      },
      {
        heading: "Cost Reduction Strategies",
        body: `Tactics to reduce COGS and improve margins.

**Infrastructure Optimization**

Current:
- Using expensive cloud (unoptimized)
- Costs: 5% of revenue (£50K on £1M revenue)

Optimization options:

1. Reduce compute usage
   - Cache aggressively (less database hits)
   - CDN for static assets (reduce server requests)
   - Result: 20% reduction (£50K → £40K)

2. Negotiate with provider
   - AWS: Commit to 1-year or 3-year (get discount)
   - Discount: 10-30% possible
   - Result: 20% reduction (£50K → £40K)

3. Multi-region optimization
   - Run only in regions customers use (not global)
   - Result: 10% reduction (£50K → £45K)

4. Use reserved instances
   - Pre-purchase capacity (cheaper than on-demand)
   - Result: 25% reduction (£50K → £37.5K)

Combined impact:
- Current: £50K (5% of revenue)
- After optimization: £30K (3% of revenue)
- Savings: £20K/year (2% revenue improvement)

**Support Automation**

Current:
- Email-only support
- Cost: 4% of revenue (£40K on £1M revenue)

Automation:

1. Chatbot (FAQ, password reset)
   - Handles 30% of questions
   - Savings: £12K/year

2. Self-service KB (knowledge base)
   - Reduces repeat questions 20%
   - Savings: £8K/year

3. In-app help (tooltips, walkthroughs)
   - Reduces onboarding support
   - Savings: £5K/year

Combined impact:
- Current: £40K (4% of revenue)
- After automation: £15K (1.5% of revenue)
- Savings: £25K/year (2.5% revenue improvement)

**Payment Processing**

Current:
- Stripe: 2.9% + £0.30 per transaction
- Cost: 3% of revenue (£30K)

Optimization:

1. Batch processing
   - Combine payments (fewer transactions)
   - Savings: £0.30 × 1,000 saved transactions = £300/month = £3.6K/year

2. ACH payments
   - For enterprise customers (0.8% vs 2.9%)
   - If 30% customers switch: 0.9% saved
   - Savings: £9K/year

3. Direct integrations
   - Partner with bank (custom rates)
   - For large companies (possible 0.5% discount)
   - Savings: £3K/year (if processing £1M/year with 10 large customers)

Combined impact:
- Current: £30K (3% of revenue)
- After optimization: £18K (1.8% of revenue)
- Savings: £12K/year (1.2% improvement)

`
      },
      {
        heading: "Pricing and Margin Expansion",
        body: `Using pricing to improve profitability.

**Price Increase Impact**

Scenario: 10% price increase, assume 0% churn (customers don't leave).

Current:
- Revenue: £1M
- COGS: £200K (20%)
- Gross profit: £800K
- Gross margin: 80%

After 10% increase:
- Revenue: £1.1M (+ £100K)
- COGS: £220K (stays proportional)
- Gross profit: £880K
- Gross margin: 80% (unchanged %)
- Improvement: £80K additional gross profit (10% uplift)

Reality: Some churn from price increase.

Scenario: 10% increase, 3% churn from higher price.

Result:
- Revenue: £1.067M (+6.7%, not 10%)
- COGS: £213K
- Gross profit: £854K (+6.75% vs +10%)
- Still higher absolute dollars (worth it if 3% churn acceptable)

**Tiered Pricing for Margin**

Lower tier (low margin to acquire volume):
- Price: £50/month
- COGS: £25 (50%)
- Gross profit: £25/month

Higher tier (high margin, premium features):
- Price: £500/month
- COGS: £50 (10%)
- Gross profit: £450/month

Company margin:
- 60% customers on lower (profit £25 each = £15K/month)
- 40% customers on higher (profit £450 each = £18K/month)
- Total profit: £33K/month
- Blended margin: (£33K / £27K revenue) = 82%

Strategy: Offer high-margin tier for power users (drives overall margin).

**Eliminating Low-Margin Customers**

Analyze by customer:

| Customer | Revenue | COGS | Margin | Notes |
|----------|---------|------|--------|-------|
| Customer A | £2K | £500 | 75% | Good |
| Customer B | £5K | £1K | 80% | Excellent |
| Customer C | £1K | £1K | 0% | Break-even! |
| Customer D | £3K | £900 | 70% | Okay |

Customer C break-even (0% margin).

Action: Fire customer C (or raise price 50% to make profitable).

Impact:
- Remove £1K revenue
- Remove £1K COGS
- Remove break-even customer
- Remaining customers: Higher average margin

Sometimes: Unprofitable customers dilute margins. Better to focus on profitable ones.

`
      },
      {
        heading: "Path to Profitability",
        body: `Using margin expansion to reach profitability.

**Current State**

Revenue: £100K
COGS: £20K (20%)
Gross profit: £80K
Operating expenses: £100K
**Operating loss: -£20K**

Gross margin healthy (80%), but total burn (COGS + OpEx > Revenue).

**Margin Expansion Plan**

Year 1 (current):
- Reduce infrastructure 1% (save £1K)
- Improve payment processing 0.5% (save £0.5K)
- New gross margin: 81.5% (was 80%)

Year 2 (growth):
- Scale reduces infrastructure cost to 3.5% (save £2K more)
- Support automation save 1% (save £1K)
- Raise prices 5% (if no churn: +£5K revenue, +£1K COGS, +£4K GP)
- New gross margin: 84% on £105K revenue = £88.2K gross profit

Year 3 (scale):
- Infrastructure optimized (3% of revenue)
- Automation done (1% support)
- Total COGS: 16% (hardware/hosting/payment/support)
- Gross margin: 84% on £130K revenue = £109.2K gross profit

Profitability path:
- Control OpEx growth (hire slower than revenue growth)
- Year 1: -£20K loss (OpEx £100K, GP £80K)
- Year 2: -£8K loss (OpEx £96K, GP £88.2K) - improving
- Year 3: +£9K profit (OpEx £100K, GP £109.2K) - breakeven!

Key: Margin expansion + controlled OpEx growth = path to profitability.

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "p-l-statement-architecture-profitability",
      "financial-forecasting-modeling",
      "metrics-dashboard-design-kpi-tracking",
      "pricing-strategy-and-price-optimization"
    ],
    faq: [
      {
        q: "What is gross margin and why does it matter?",
        a: "(Revenue - COGS) / Revenue = gross margin %. Example: £100K revenue, £20K COGS = 80% margin. Healthy SaaS: 70-85%. Matters because: Pays for operations, sales/marketing, profit. Low margin = unsustainable (unprofitable even if growing). High margin = scales well."
      },
      {
        q: "What should my COGS be?",
        a: "Typical pure SaaS: 15-25% of revenue. Components: Infrastructure 2-5%, payment processing 2-3%, support 5-10%, other 0-5%. As you scale, COGS % decreases (fixed costs spread over more customers). Healthy trajectory: 20% COGS as early stage → 15% as mature."
      },
      {
        q: "How do I improve my gross margin?",
        a: "Three levers: (1) Reduce COGS (infrastructure optimization, support automation, payment processing negotiation = 2-3% improvement possible). (2) Raise prices (1-5% increase improves margin 1-5% bottom-line if low churn). (3) Cut low-margin customers (fire unprofitable ones). Combined: 70% margin → 80-85% margin realistic."
      },
      {
        q: "How can I reach profitability?",
        a: "Path: Expand margins (COGS reduction + pricing) + control OpEx growth (hire slower than revenue growth). Example: £80K loss year 1 → profitable year 3 via margin expansion and OpEx discipline. Key: Margins improve with scale (infrastructure costs decrease %), but only if you optimize COGS actively."
      }
    ],
    videoUrl: ""
  }
];

export default batch180Articles;
