import { AcademyArticle } from "@/types/academy";

export const batch113Articles: AcademyArticle[] = [
  {
    slug: "gross-margin-deep-dive-cost-structure",
    title: "Gross Margin Deep Dive: Optimizing Cost Structure and Profitability",
    description: "Master gross margin optimization. Understand cost structure, identify leverage opportunities, and improve profitability at scale.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "gross margin",
      "COGS",
      "cost of goods sold",
      "cost optimization",
      "infrastructure costs",
      "payment processing",
      "unit economics",
      "margin expansion",
      "cost structure",
      "operational leverage"
    ],
    keyTakeaways: [
      "Gross margin = (Revenue − COGS) ÷ Revenue; SaaS COGS includes: hosting (AWS, Azure), payment processing (Stripe fees), support salaries (allocated to delivery), third-party SaaS used to deliver; NOT included: sales salaries, R&D, admin; example: £10M revenue, £2M COGS (hosting £1M, Stripe £0.3M, support £0.7M) = 80% gross margin. Benchmark: SaaS should target 75%+ gross margin; below 70% means product too expensive to deliver",
      "Cost structure breakdown: Hosting costs scale with usage (more customers = higher AWS), payment processing scales with revenue (Stripe % fee), support salaries semi-fixed (increases with customers but in steps, not linear). Example: If double revenue, hosting might double (scale), Stripe same %, but support only +50% (fixed leverage). This is operational leverage − revenue grows faster than COGS.",
      "Margin improvement levers: (1) Negotiate infrastructure costs (move to cheaper cloud, optimize database usage), (2) Optimize payment processing (reduce Stripe %, use local payment methods), (3) Improve support efficiency (automation, self-service, knowledge base reduces support headcount), (4) Increase prices (if margins low relative to value delivered, pricing too low). Most impactful: support efficiency (20-30% improvement possible)"
    ],
    content: [
      {
        heading: "Understanding Cost Structure",
        body: `Gross margin is the profit remaining after paying the direct costs of delivering your service.

**Gross Margin Formula and Benchmark**

Gross Margin = (Revenue − COGS) ÷ Revenue

Example:

Revenue: £10M
COGS: £2M (cost to deliver the product)
Gross Profit: £8M
Gross Margin: 80%

Interpretation: For every £1 of revenue, you keep 80p after paying delivery costs.

SaaS benchmarks:

Early-stage (< £1M ARR):
- Gross margin: 60-75% (not yet optimized)
- Problem: High support costs per customer (small base)
- Plan: Improve margin as scale

Growth-stage (£1-10M ARR):
- Gross margin: 75-85% (improving)
- Problem: Infrastructure costs increasing with scale
- Plan: Negotiate better terms, improve support efficiency

Scale-stage (£10-100M ARR):
- Gross margin: 80-90% (optimized)
- Benefit: Scale provides leverage on costs
- Strategy: Maintain or improve margin

Mature (> £100M ARR):
- Gross margin: 85%+ (highly optimized)
- Leverage: Large enough to negotiate best rates

If below 70%: Your product is too expensive to deliver profitably.

**Components of COGS (Cost of Goods Sold)**

What counts as COGS for SaaS:

1. Infrastructure Costs (40-50% of COGS)
   - Cloud hosting (AWS, Azure, Google Cloud)
   - Database services (scale with data)
   - CDN (content delivery)
   - Backup and disaster recovery

   Example: £10M revenue SaaS
   - AWS costs: £400K/year (4% of revenue)
   - This is typical for typical SaaS
   - Some data-intensive SaaS: 8-10% of revenue

2. Payment Processing (10-15% of COGS)
   - Stripe: 2.2% + £0.30 per transaction
   - Local payment processors: 2-5% depending on country
   - Chargeback fees: 0.1-0.3%

   Example: £10M revenue
   - Stripe fees: 2.2% × £10M = £220K
   - = 2.2% of revenue

3. Support Salaries (allocated, 20-30% of COGS)
   - Customer support team cost allocated to COGS
   - How much to allocate? Support cost ÷ Revenue

   Example: 10-person support team
   - Cost: £400K/year (salaries, benefits)
   - Revenue: £10M
   - Allocation: £400K ÷ £10M = 4% of revenue

4. Third-party SaaS (5-10% of COGS)
   - Twilio (SMS/calls): If using for product features
   - Stripe (for payment): Already counted above
   - SendGrid (email): If core to product
   - Data providers: If core to product

   Example: £10M revenue SaaS
   - Twilio for SMS feature: £100K/year (1% of revenue)

Total COGS example:
- AWS: 4%
- Stripe: 2.2%
- Support (allocated): 4%
- Third-party SaaS: 1.5%
- Total COGS: 11.7% of revenue
- Gross Margin: 88.3%

What NOT to include:
- Sales salaries (included in S&M, not COGS)
- R&D/engineering salaries (included in R&D, not COGS)
- Admin salaries (included in G&A, not COGS)
- Office rent (included in G&A, not COGS)
- Marketing spend (included in S&M, not COGS)

**Cost Structure Analysis**

Analyze your COGS to find improvement opportunities:

Example company, £5M revenue:

COGS Breakdown:
- AWS: £300K (6% of revenue)
- Stripe: £120K (2.4% of revenue)
- Support: £200K (4% of revenue)
- Third-party: £50K (1% of revenue)
- Total COGS: £670K (13.4% of revenue)
- Gross Margin: 86.6%

This is healthy. But let's look for improvement opportunities:

AWS costs (£300K):
- Analyze: Are databases optimized? Redundancy needed?
- Benchmark: 6% is average, industry range 3-8%
- Opportunity: Optimize databases, reduce redundancy → save £50K (1% of revenue)

Stripe fees (£120K):
- Analyze: Using Stripe for all payments? International customers?
- Benchmark: 2.4% is high (standard 2.2%)
- Opportunity: Negotiate better rates or use local processors for international → save £30K (0.6%)

Support (£200K):
- Analyze: 10 support reps × £20K/year = £200K. Is this right?
- Benchmark: 4% is typical, range 2-6%
- Opportunity: Build self-service knowledge base, reduce rep headcount by 2 → save £40K (0.8%)

Third-party (£50K):
- Analyze: Necessary or nice-to-have?
- Opportunity: Build in-house for 1 service → save £20K (0.4%)

Total potential savings: £140K (2.8% of revenue)
New gross margin: 89.4% (from 86.6%)

This is material. Margin improvements compound.

**Operational Leverage**

Key insight: COGS grows slower than revenue at scale.

Example:

Year 1: £5M revenue
- COGS: £670K (13.4%)
- Gross profit: £4.33M

Year 2: £7.5M revenue (50% growth)
- AWS: increased to £375K (but scales with usage, not revenue %, so might only be 5% now)
- Stripe: £180K (same %, but on higher base)
- Support: £240K (added 1 rep, not proportional)
- Third-party: £70K
- Total COGS: £865K (11.5% of revenue, improved!)
- Gross profit: £6.64M

Margin improved from 86.6% to 88.5% just by scaling.

This is operational leverage. Revenue grows 50% (£5M → £7.5M), but COGS only grew 29% (£670K → £865K).

The reason:
- Some costs fixed (support reps are hired in increments)
- Infrastructure gets more efficient (per-unit costs decrease)
- Payment processing % doesn't change but might negotiate better terms

This is why growing SaaS becomes more profitable. Not because you raise prices, but because costs don't scale linearly.

**Margin Expansion Opportunities**

Lever 1: Negotiate Infrastructure Costs

AWS costs typically 4-6% of revenue.

Leverage points:
- Reserved instances (commit to 1-3 year usage, get 30-50% discount)
- Spot instances (unused compute, 60-90% cheaper, but variable)
- Move to cheaper regions (some regions cheaper than US)
- Optimize database (unused indexes, bad queries cost a lot)
- CDN compression (smaller files = cheaper CDN)

Potential savings: 20-30% of infrastructure costs

Example:
- Current AWS: £300K/year
- Optimize and negotiate: £220K/year
- Savings: £80K (1.6% of revenue)

Lever 2: Optimize Payment Processing

Stripe charges 2.2% for US cards. But can do better:

- Local payment processors (1.5-2.5%): Lower costs in some regions
- ACH payments (£0.25-1%): Much cheaper than credit cards
- Direct bank transfers: Essentially free
- Volume discounts: Negotiate with Stripe if >£1M/month

Example:
- 70% customers on Stripe (2.2%): 70% × 2.2% = 1.54%
- 20% on local processors (1.8%): 20% × 1.8% = 0.36%
- 10% on ACH (1%): 10% × 1% = 0.10%
- Blended rate: 2%
- Savings: 0.4% of revenue (£20K on £5M)

Lever 3: Improve Support Efficiency

Support is often 3-5% of revenue. Improvement opportunities:

- Self-service knowledge base (reduce tickets by 20-30%)
- Chatbot for common questions (handle 30-50% of tickets)
- Community forums (customers help each other, reduce support load)
- Tiered support (community/email/chat, then paid for phone)
- Hire in lower-cost regions (£10K/year support rep in Philippines vs £20K in UK)

Example:
- Current: 10 support reps × £20K = £200K (4% of revenue)
- Build knowledge base: Reduce tickets 20% → need 9 reps = £180K (3.6%)
- Add chatbot: Reduce tickets 15% more → need 8 reps = £160K (3.2%)
- Hire 2 reps in Philippines (£10K each): 6 UK reps (£120K) + 2 Phil (£20K) = £140K (2.8%)
- Savings: £60K (1.2% of revenue)

Total is material: support is often your biggest COGS opportunity.

Lever 4: Increase Prices

If margins low, pricing might be too low.

Example: 70% margin (vs 85% benchmark)
- This suggests pricing 20% too low
- Raise prices 10%: Gross margin improves to 75%
- Raise prices 15%: Gross margin improves to 78%

But risk: Volume might decrease if price-sensitive market.

Test with:
- New customers only (don't risk existing)
- Negotiate with at-risk customers (give them discount to renew)
- Tiered pricing (better tier has higher price)

Example:
- Current: £100/mo for 1000 customers = £1.2M annual revenue
- Increase 10%: £110/mo, might lose 5% of customers = 950 customers × £110 × 12 = £1.254M (4% growth in revenue)
- Gross margin improves from 70% to 73% + 4% growth = strong result

**Margin Dashboard**

Track monthly:

| Metric | Target | Actual | Trend |
|--------|--------|--------|--------|
| Gross Margin % | 80% | 78% | ↓ |
| AWS % of revenue | 4% | 4.5% | ↑ (concerning) |
| Stripe % of revenue | 2% | 2.2% | = |
| Support % of revenue | 3% | 4% | ↑ (hiring) |
| Third-party % | 1% | 1.2% | = |

Watch for trends:
- If margin declining, drill into which cost category increasing
- If AWS increasing, might need to optimize or negotiate
- If support increasing faster than revenue, hiring too fast

Margin should improve as you scale. If not, something's wrong (either pricing, costs, or mix changing).
`
      }
    ],
    relatedSlugs: [
      "profitability-mechanics",
      "p-l-statement-architecture-profitability",
      "unit-economics-deep-dive",
      "pricing-psychology-and-packaging",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's a healthy gross margin for SaaS?",
        a: "70%+ is acceptable, 75%+ is good, 80%+ is excellent. Below 70% means your product is too expensive to deliver. Track by stage: lower early-stage, higher at scale."
      },
      {
        q: "What counts as COGS for SaaS?",
        a: "Infrastructure (AWS, CDN), payment processing (Stripe), support salaries (allocated to delivery), third-party SaaS used in product. NOT included: sales, R&D, admin."
      },
      {
        q: "How do I improve gross margin?",
        a: "Negotiate infrastructure costs (20-30% savings possible), optimize payment processing (0.3-0.5%), improve support efficiency (1-2% savings), increase prices (if margins low). Support efficiency is often highest-impact lever."
      },
      {
        q: "Why does margin improve at scale?",
        a: "Operational leverage: Some costs fixed (support hired in increments), infrastructure more efficient per unit, payment processing may negotiate better terms. Revenue grows 50%, costs grow 20-30%."
      }
    ],
    videoUrl: ""
  }
];

export default batch113Articles;
