import { AcademyArticle } from "@/types/academy";

export const batch46Articles: AcademyArticle[] = [
  {
    slug: "renewal-expansion-management",
    title: "Renewal & Expansion Management: Maximizing Revenue From Existing Customers",
    description: "How to manage customer renewals, identify expansion opportunities, and structure renewal processes to maximize retention and growth.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "renewal management",
      "customer renewal",
      "expansion management",
      "renewal process",
      "renewal strategy",
      "revenue retention",
      "customer lifecycle",
      "renewal negotiations",
      "customer value",
      "renewal forecasting"
    ],
    keyTakeaways: [
      "Renewal process should start 120 days before expiration (not 30 days): early engagement dramatically improves renewal rate and expansion opportunity identification",
      "Renewal rate (% of customers renewing) directly predicts NRR: 90% renewal + 5% expansion = 95% NRR (declining); 95% renewal + 10% expansion = 105% NRR (healthy growth)",
      "Expansion during renewal: Customers are 3-5x more likely to expand during renewal conversation than mid-contract; build expansion opportunities into renewal process"
    ],
    content: [
      {
        heading: "Renewal Process and Economics",
        body: `Renewals are where you realize return on your customer acquisition investment.

Example customer economics:

Year 1 (acquisition):
- CAC: £20K (customer acquisition cost)
- Revenue: £50K
- Gross margin: £35K
- Year 1 profit: -£20K (acquisition loss)

Year 2 (renewal):
- Renewal fee: £50K
- Gross margin: £40K (improved from year 1)
- Profit: £40K
- Cumulative profit: £20K

Year 3 (renewal + expansion):
- Renewal: £50K
- Expansion: £10K (upsell, seat expansion)
- Revenue: £60K
- Gross margin: £48K
- Profit: £48K
- Cumulative profit: £68K

By year 3, you've recovered acquisition cost and generated £68K profit. This is why retention matters more than acquisition at scale.

**Renewal Timing and Process**:

Standard renewal process (for annual contracts):

12 months before renewal: Strategic planning
- Identify if customer is "at-risk" (low usage, support issues)
- Plan expansion opportunities

6 months before renewal (180 days):
- First outreach: CSM touches base, reviews success
- Success review: "You've achieved X, Y, Z with our product"
- Expansion exploration: "Have you considered expanding to Z team?"

4 months before renewal (120 days):
- Formal renewal conversation: Pricing, terms, expansion
- Quote delivery: Send renewal proposal (same price or discounted for multi-year)
- Negotiation: Address customer concerns, finalize terms

2 months before renewal (60 days):
- Legal review: Customer legal team reviews contract
- Purchase order: Customer procurement generates PO
- Deal closing: Signature and payment arrangement

1 month before renewal (30 days):
- Final confirmation: Verify payment method, renewal date
- Onboarding for renewals: Set expectations for year 2

This timeline is critical. Companies that start renewal conversations at 120 days have 95%+ renewal rates. Companies that wait until 30 days have 70-80% renewal rates (too late to address concerns, expand, or retain).

**Renewal Metrics**:

Track monthly:

1. **Renewal Rate**: % of contracts renewing
   - Healthy: >90% for mid-market/enterprise, >80% for SMB
   - Red flag: <80% overall

2. **Expansion Rate During Renewal**: % of renewals that expand
   - Healthy: 20-30% for mid-market, 10-20% for SMB
   - Expand means: Customer spends more on renewal (tier upgrade, additional seats, new modules)

3. **Time to Renewal Decision**: Days from first outreach to signature
   - Healthy: 30-45 days (aligned with 120-day start)
   - Poor: >60 days (misaligned process)

4. **Renewal Revenue Growth**: Change in renewal contract value vs. original
   - Healthy: +5-15% (customer expanding/staying longer)
   - Decline: <0% (customer downsizing)

5. **Churn Timing**: Do churned customers churn at renewal or mid-contract?
   - At renewal: Easier to prevent (engagement conversation)
   - Mid-contract: Harder to prevent (surprise departure)

**Renewal Negotiation**:

Most renewals involve some negotiation.

Customer asks: "Can we get a discount?"
Your response: "What are you looking for?"

Common scenarios:

Scenario 1: Price Reduction Request
- Customer: "Can you do 10% discount? Competitor is cheaper."
- Your options:
  a) Offer discount for multi-year commitment (£50K annual becomes £45K annually, 3-year = £135K locked in)
  b) Counter with expanded scope (10% discount if they add team, more total spend)
  c) Hold price (if customer is strategic/satisfied)

Scenario 2: Budget Constraint
- Customer: "We can only allocate £40K this year (vs. £50K)"
- Your options:
  a) Offer scaled tier (fewer features/seats at £40K)
  b) Offer discount with expansion commitment ("£45K now, commit to £55K in year 2")
  c) Offer payment plan (£35K upfront, £7.5K in 6 months)

Scenario 3: Expansion Negotiation
- Customer: "We want to add 5 more seats (£10K additional)"
- Your options:
  a) Bundle discount: "£50K + £8K (instead of £10K) if you extend to 3 years"
  b) Volume discount: "£50K + £7.5K (25% discount) for the expansion"

The goal: Keep the customer, ideally grow their spend, accept some negotiation.

**Proactive Renewal vs. Auto-Renewal**:

Proactive renewal (your team touches customer):
- Higher renewal rate (85-95%, customer feels valued)
- More expansion opportunities (team discusses expansion)
- Higher cost (CSM time, sales involvement)
- Better customer relationships

Auto-renewal (automatic charge, no conversation):
- Lower renewal rate (70-80%, no touch, customers forget and churn)
- Less expansion opportunities (no conversation = no expansion idea)
- Lower cost (automated)
- Riskier (customers surprised by charge, may churn)

Most SaaS companies use hybrid: Auto-renew but with proactive team touchpoint 60 days before.

**Renewal Forecasting**:

Critical for predicting annual revenue.

Forecast model:

Beginning ARR (from existing customers): £5M
Expected renewals (90% renewal rate): £5M × 90% = £4.5M
Expansion during renewals (15% of renewing customers expand 10%): £4.5M × 15% × 10% = £67.5K
Churn (10% of customers don't renew): £5M × 10% = -£500K
Projected renewal revenue: £4.5M + £67.5K = £4.567M

Plus new customer acquisition (separate forecast): £1.5M
Total projected revenue: £4.567M + £1.5M = £6.067M

This forecast shows:
- Renewal revenue: 75% of total (£4.567M)
- New revenue: 25% of total (£1.5M)

Most mature SaaS has 60-80% of revenue from renewals, 20-40% from new customers. This is healthy (recurring, predictable revenue base + growth from new logos).

**Renewal Management Best Practices**:

1. **Calendar-based renewal management**:
- Track every customer contract expiration date
- 180-day alert: CSM initiates engagement
- 120-day alert: Quote sent, negotiation begins
- 60-day alert: Legal/procurement phase
- 30-day alert: Final confirmation

2. **Renewal success playbook**:
- Quarterly business reviews with mid-market/enterprise (positions expansion)
- Health score monitoring (flag at-risk customers early)
- Proactive support (fix issues before they become churn drivers)

3. **Expansion identification during renewal**:
- Review usage data: Which features do they use?
- Identify gaps: Where could they expand?
- Proposal during renewal: "You've added 3 team members, consider expanding tier"
- Expansion target: 20-30% of renewals should expand

4. **Churn analysis**:
- For customers who don't renew, understand why
- "Did they churn due to: price, product fit, competition, budget cuts, internal changes?"
- Use learnings to prevent future churn

Renewal management is underappreciated. Most companies focus on new customer acquisition, but renewals are where money compounds. A mature SaaS with 95% renewal rate and 15% expansion during renewal grows predictably and sustainably.
`
      }
    ],
    relatedSlugs: [
      "churn-cohort-analysis",
      "expansion-revenue-strategies",
      "customer-success-economics",
      "customer-lifetime-value-calculation",
      "revenue-operations-revops-strategy"
    ],
    faq: [
      {
        q: "When should renewal conversations start?",
        a: "120 days before expiration. 180 days is ideal for enterprise. Starting <60 days dramatically reduces renewal rate."
      },
      {
        q: "What's a healthy renewal rate?",
        a: "Mid-market/enterprise: 90-95%. SMB: 80-85%. Below these rates indicates product/service issues, not pricing."
      },
      {
        q: "Should I offer discount for multi-year commitment?",
        a: "Yes. 5-10% discount for 2-year, 10-15% for 3-year is standard. Locks in revenue, reduces churn risk."
      },
      {
        q: "How do you prevent renewals from slipping?",
        a: "Calendar-based alerts (180/120/60 days before). CSM accountability (tied to renewal metrics). Automated reminders (email sequence)."
      },
      {
        q: "What's the relationship between renewal rate and NRR?",
        a: "NRR = (Renewal % + Expansion %) × 100. If 90% renew + 10% expand, NRR = 100%. Better renewal/expansion = higher NRR."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "infrastructure-cost-optimization",
    title: "Infrastructure Cost Optimization: Reducing Cloud Spending While Maintaining Performance",
    description: "How to optimize cloud infrastructure costs, identify waste, and scale efficiently without sacrificing performance or reliability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "infrastructure costs",
      "cloud cost optimization",
      "AWS optimization",
      "cost reduction",
      "cloud spending",
      "infrastructure efficiency",
      "server optimization",
      "resource optimization",
      "cost management",
      "operational efficiency"
    ],
    keyTakeaways: [
      "Cloud waste is endemic: Most companies overspend on infrastructure 20-40% due to idle resources, inefficient configurations, and lack of monitoring; audit every 6 months",
      "Quick wins for cost reduction: Reserved instances (25-40% discount), rightsizing (shut down unused resources), auto-scaling (scale down nights/weekends), data transfer optimization (10-15% savings)",
      "Infrastructure cost as % of revenue: Early stage 10-15%, growth stage 5-10%, mature stage 3-5%; if you're above these, infrastructure is being over-provisioned"
    ],
    content: [
      {
        heading: "Understanding Infrastructure Costs",
        body: `For most SaaS companies, cloud infrastructure is 10-30% of COGS (cost of goods sold).

Example £5M ARR SaaS:
- Gross margin target: 70% (£3.5M gross profit)
- COGS: 30% of revenue = £1.5M
- Infrastructure portion: 50-70% of COGS = £750K-1M annually
- Per customer: £750K ÷ 100 customers = £7.5K infrastructure per customer annually
- Or: £1M ÷ £5M revenue = 20% of revenue on infrastructure

This is typical for software-heavy SaaS. If you're >30% on infrastructure, you're likely over-provisioned.

**Common Infrastructure Costs**:

Compute (servers, EC2 instances): 40-50% of infrastructure budget
- Web servers (customer-facing)
- Background workers (processing, jobs)
- Database servers
- Cache servers

Storage (databases, file storage): 20-30%
- Database (Postgres, MySQL)
- Object storage (S3, backups)
- CDN (content delivery)

Data transfer (networking): 10-15%
- Egress (data leaving your servers)
- Inter-region transfer

Services and managed databases: 10-20%
- Managed services (RDS, ElastiCache)
- Third-party integrations

**Identifying Infrastructure Waste**:

Audit your infrastructure quarterly:

1. **Idle resources**: Servers running but not being used
   - Check: CPU/memory utilization (CloudWatch, New Relic)
   - Typical finding: 30-40% of resources are idle
   - Action: Shut down idle resources
   - Savings: 10-20% of compute cost

2. **Over-provisioning**: Servers sized larger than needed
   - Check: Instance type vs. utilization (are you using 20% of capacity?)
   - Typical finding: Many servers 2-3x oversized
   - Action: Right-size to match actual usage
   - Savings: 20-30% of compute cost

3. **Reserved instances not purchased**: Paying on-demand when cheaper reserved options exist
   - Check: On-demand vs. reserved pricing
   - On-demand: £0.10/hour
   - Reserved (1-year): £0.06/hour (40% discount)
   - Reserved (3-year): £0.05/hour (50% discount)
   - Typical finding: Most capacity should be reserved
   - Action: Purchase reserved instances for stable workload
   - Savings: 25-40% of compute cost

4. **Data transfer costs**: Unnecessary egress and cross-region transfer
   - Check: CloudFront/CDN not optimized
   - Typical finding: 10-20% cost reduction through data transfer optimization
   - Action: Use CDN, compress data, optimize image sizes
   - Savings: 10-20% of transfer cost

5. **Expensive storage**: Keeping unnecessary backups, old data
   - Check: S3 bucket sizes, backup retention
   - Typical finding: Backups older than 1 year, rarely needed
   - Action: Tiered storage (old data to cheaper storage tiers)
   - Savings: 5-15% of storage cost

**Infrastructure Cost Optimization Plan**:

Month 1: Audit
- Inventory all infrastructure resources
- Identify waste (idle, over-provisioned, no reserved instances)
- Estimate savings

Month 2: Quick wins (high-impact, low-effort)
- Shut down idle resources (immediately)
- Purchase reserved instances (for 3 years, max discount)
- Enable auto-scaling (scale down at night, weekends)
- Optimize data transfer (enable CDN, compression)

Month 3-4: Medium-effort improvements
- Right-size instances (move from large to medium)
- Consolidate databases (fewer instances, better utilization)
- Implement caching (reduce database load)
- Optimize queries (database efficiency)

Month 5-6: Architecture improvements
- Migrate to managed services (RDS instead of self-hosted DB)
- Implement microservices (scale independently)
- Containerization (more efficient resource usage)

Realistic savings:
- Month 1-2 (quick wins): 15-20% cost reduction
- Month 3-4 (medium-effort): Additional 10-15% reduction
- Month 5-6 (architecture): Additional 10-15% reduction
- Total: 35-50% infrastructure cost reduction possible

**Example infrastructure optimization**:

Current state: £1M annually on AWS
- Compute: £500K (EC2, over-provisioned)
- Storage: £300K (databases, backups)
- Data transfer: £150K
- Services: £50K

Quick wins (month 1-2):
- Shut down idle resources: -£50K (5%)
- Purchase reserved instances: -£100K (20%)
- Optimize data transfer: -£30K (20%)
- Total savings: £180K (18%)

New cost: £820K

Medium-effort improvements (month 3-4):
- Right-size instances: -£75K (15% of compute)
- Implement caching: -£50K (reduces database load)
- Tiered storage: -£30K (10% of storage)
- Total savings: £155K (19%)

New cost: £665K

Architecture improvements (month 5-6):
- Migrate to managed RDS: -£40K (better efficiency)
- Microservices: -£30K (better scaling)
- Total savings: £70K (11%)

Final cost: £595K (40% reduction from original £1M)

This is realistic. Most companies can achieve 30-50% infrastructure cost reduction through systematic optimization.

**Cost Monitoring**:

Implement monthly monitoring:
- Set infrastructure budget (e.g., £60K/month)
- Alert when spend exceeds budget (email when >£65K)
- Monthly review (is cost going up or down?)
- Quarterly deep dive (identify new optimization opportunities)

Assign ownership: One engineer responsible for infrastructure costs. Incentivize: Tie compensation to cost targets (reduce costs, share savings).

Infrastructure optimization is ongoing (not a one-time project). Set a culture of cost awareness where engineers think about efficiency, not just features.
`
      }
    ],
    relatedSlugs: [
      "gross-margin-expansion",
      "cost-management-optimization",
      "vendor-management-cost-optimization",
      "operational-efficiency-metrics",
      "profitability-mechanics"
    ],
    faq: [
      {
        q: "How often should I audit infrastructure costs?",
        a: "Quarterly minimum. Monthly review of trends. Annual deep dive with infrastructure partner or consultant."
      },
      {
        q: "What's a normal infrastructure cost %?",
        a: "Early stage: 10-15% of revenue. Growth stage: 5-10%. Mature: 3-5%. If higher, infrastructure is over-provisioned."
      },
      {
        q: "Should I use reserved instances or on-demand?",
        a: "Hybrid: 70-80% reserved (stable workload), 20-30% on-demand (variable workload). Reserved instances give 25-50% discount."
      },
      {
        q: "How much can I realistically save?",
        a: "Conservative: 15-20% savings. Aggressive: 35-50% savings. Most companies find 25-30% without major architecture changes."
      },
      {
        q: "Should infrastructure optimization delay features?",
        a: "No. Both happen in parallel. Dedicate one engineer to optimization while team builds features. Savings fund more hiring."
      }
    ],
    videoUrl: ""
  }
];

export default batch46Articles;