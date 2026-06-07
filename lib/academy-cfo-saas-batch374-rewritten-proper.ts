import { AcademyArticle } from "@/types/academy";

export const batch374Articles: AcademyArticle[] = [
  {
    slug: "saas-cost-of-revenue-and-gross-margin-optimisation",
    title: "Cost of Revenue and Gross Margin Optimisation: Maximising SaaS Profitability",
    description: "Master COGS management. Optimise cloud costs, improve gross margins, and scale infrastructure efficiently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cost of revenue", "gross margin", "cloud costs", "COGS", "infrastructure optimisation"],
    keyTakeaways: [
      "SaaS COGS breakdown: Hosting/infrastructure (5-15% of revenue), customer support (3-8%), customer success (3-7%), payment processing (2-3%), third-party APIs (1-5%). Target gross margin: >75% for pure SaaS. Example: £5M revenue, £1.1M COGS = 78% gross margin. Best-in-class: >85%. If below 70%, investigate hosting costs and support efficiency. Each 1% gross margin improvement at £5M = £50K additional gross profit.",
      "Cloud cost optimisation: Typically 30-50% of COGS. Key strategies: (1) Reserved instances (30-60% savings on committed compute), (2) Right-sizing (most instances are over-provisioned by 40-60%), (3) Spot/preemptible instances for batch workloads (60-80% savings), (4) Auto-scaling (match capacity to demand). Example: £500K annual cloud spend optimised to £300K (40% savings = £200K margin improvement).",
      "Support cost scaling: As customer base grows, support must scale sub-linearly. Strategies: (1) Self-serve knowledge base (deflect 40-60% of tickets), (2) In-app guidance and tooltips, (3) Tiered support (basic for low-tier, premium for enterprise), (4) AI-assisted support (handle 20-30% of tickets automatically). Example: 1,000 customers, 500 tickets/month. With knowledge base: 300 tickets (40% deflection). Cost saving: £4K/month in agent time."
    ],
    content: [
      {
        heading: "Optimising SaaS Cost of Revenue and Gross Margins",
        body: `Driving profitability by managing what it costs to deliver your product.

**Understanding SaaS COGS**

What belongs in Cost of Revenue:

Direct costs of delivering the service:

1. Hosting and infrastructure:
   - Cloud computing (AWS, Azure, GCP)
   - CDN and content delivery
   - Monitoring and observability tools
   - Database services
   - Example: £400K/year (8% of £5M revenue)

2. Customer support:
   - Support team salaries
   - Support tools (Zendesk, Intercom)
   - Phone/chat infrastructure
   - Example: £250K/year (5% of revenue)

3. Customer success:
   - CSM team (portion allocated to COGS vs S&M)
   - Onboarding costs
   - Training delivery
   - Example: £200K/year (4% of revenue)

4. Payment processing:
   - Stripe/payment gateway fees (2.5-3.5% of transaction)
   - Example: £5M revenue × 2.9% = £145K/year (3% of revenue)

5. Third-party services:
   - APIs consumed in product delivery
   - Data services
   - Licensing fees for embedded technology
   - Example: £100K/year (2% of revenue)

What does NOT belong in COGS:
- R&D / Engineering (goes to operating expenses)
- Sales and marketing
- General and administrative
- Depreciation of capitalised development costs (debatable)

Gross margin calculation:

Revenue: £5,000K
- Hosting: -£400K
- Support: -£250K
- Customer success: -£200K
- Payment processing: -£145K
- Third-party: -£100K
- Total COGS: -£1,095K

Gross profit: £3,905K
Gross margin: 78.1%

**Cloud cost optimisation**

Current state assessment:

Step 1: Audit cloud spending

Break down by service:
| Service | Monthly cost | % of cloud |
|---|---|---|
| Compute (EC2/VMs) | £15K | 45% |
| Database (RDS/Cloud SQL) | £8K | 24% |
| Storage (S3/Blob) | £3K | 9% |
| Networking | £2K | 6% |
| Other services | £5K | 16% |
| Total | £33K | 100% |

Annual cloud cost: £396K

Step 2: Identify waste

Common waste areas:
- Idle instances (running but unused): 10-20% waste
- Over-provisioned instances: 20-40% waste
- Unattached storage volumes: 5-10% waste
- Old snapshots: 3-5% waste

Typical finding: 30-50% of cloud spend is waste or inefficiency

Optimisation strategies:

Strategy 1: Reserved instances / savings plans

On-demand vs reserved pricing (example AWS):
- On-demand m5.xlarge: £0.20/hour
- 1-year reserved (no upfront): £0.13/hour (35% saving)
- 1-year reserved (all upfront): £0.12/hour (40% saving)
- 3-year reserved (all upfront): £0.08/hour (60% saving)

Action:
- Identify instances running 24/7
- Purchase reserved capacity for baseline workload
- Keep on-demand for variable/burst capacity

Example:
- 10 instances running 24/7 at £0.20/hour = £17.5K/month
- Convert to 1-year reserved: £11.4K/month (35% saving)
- Annual saving: £73K

Strategy 2: Right-sizing

Most instances are over-provisioned:
- Check CPU utilisation (target 40-60% average)
- Check memory utilisation (target 50-70%)
- Downsize if consistently under 30% utilisation

Example:
- Current: m5.2xlarge (£0.40/hour) at 15% CPU utilisation
- Right-sized: m5.large (£0.10/hour) at 60% CPU utilisation
- Saving: 75% per instance

Strategy 3: Auto-scaling

Match capacity to demand:
- Business hours: Scale up (more instances)
- Off-hours: Scale down (fewer instances)
- Weekend: Minimum capacity

Example:
- Peak (9am-6pm weekdays): 10 instances
- Off-peak (evenings): 5 instances
- Weekend: 3 instances

Weighted average: 6.5 instances vs 10 always-on
Saving: 35%

Strategy 4: Spot/preemptible instances

For interruptible workloads:
- Batch processing, data analytics, CI/CD
- 60-80% cheaper than on-demand
- Risk: Instance can be reclaimed (2-minute warning)

Example:
- CI/CD pipeline: 20 hours/day of compute
- On-demand: £0.20/hour × 20 = £4/day
- Spot: £0.06/hour × 20 = £1.20/day
- Monthly saving: £84 per pipeline

Strategy 5: Storage optimisation

Lifecycle policies:
- Hot storage (frequent access): Standard tier
- Warm storage (monthly access): Infrequent access tier (40% cheaper)
- Cold storage (archive): Glacier/Archive tier (80% cheaper)

Example:
- 10TB hot storage at £0.023/GB = £230/month
- Move 6TB to infrequent access (£0.0125/GB): £75/month
- Move 2TB to archive (£0.004/GB): £8/month
- New cost: £46 + £75 + £8 = £129/month (44% saving)

**Support cost optimisation**

Scaling support sub-linearly:

Target metrics:
- Tickets per customer per month: <0.5 (target <0.3)
- First response time: <4 hours (business)
- Resolution time: <24 hours
- Customer satisfaction (CSAT): >90%

Current state example:
- 1,000 customers
- 500 tickets/month (0.5 per customer)
- 3 support agents at £35K each = £105K/year
- Cost per ticket: £17.50

Optimisation path:

Step 1: Knowledge base and self-serve
- Build comprehensive help docs
- In-app contextual help
- Video tutorials for common tasks
- Expected ticket deflection: 30-40%
- New ticket volume: 300-350/month

Step 2: Chatbot / AI-assisted support
- Handle common questions automatically
- Route complex issues to agents
- Expected automation: 20-30% of remaining tickets
- New agent workload: 210-280 tickets/month

Step 3: Tiered support
- Basic tier: Email only, 24-hour response
- Pro tier: Chat + email, 4-hour response
- Enterprise: Phone + chat + email, 1-hour response
- Allocate agents to highest-value customers

After optimisation:
- 1,000 customers, 210 tickets/month handled by agents
- 2 agents (reduced from 3): £70K/year
- Cost per ticket: £27.78 (higher per ticket, but fewer tickets)
- Total support cost: £70K vs £105K (33% saving)
- Support as % of revenue: 1.4% vs 2.1%

**Payment processing optimisation**

Reducing payment processing costs:

Standard Stripe pricing: 2.9% + £0.20 per transaction

Optimisation strategies:

Strategy 1: Annual billing
- Fewer transactions = fewer per-transaction fees
- Monthly: 12 transactions × (2.9% + £0.20) per year
- Annual: 1 transaction × (2.9% + £0.20) per year
- Example: £1,200/year customer
  - Monthly: 12 × (£2.90 + £0.20) = £37.20
  - Annual: 1 × (£34.80 + £0.20) = £35.00
  - Saving: £2.20 per customer (small but scales)

Strategy 2: Negotiate volume discounts
- Stripe offers custom pricing above £500K volume
- Typical: 2.5% + £0.20 (vs 2.9%)
- On £5M revenue: £20K annual saving

Strategy 3: Direct debit (BACS/SEPA)
- Lower fees than card payments
- BACS: ~£0.20-0.50 per transaction (no %)
- On £1,200/year customer: £0.50 vs £35 = 98.6% saving
- Challenge: Requires customer buy-in

**Gross margin improvement roadmap**

Phase 1 (0-3 months): Quick wins
- Right-size cloud instances (5-10% cloud saving)
- Clean up unused resources (3-5% cloud saving)
- Knowledge base expansion (10-20% ticket reduction)
- Target: 1-2% gross margin improvement

Phase 2 (3-6 months): Structured optimisation
- Reserved instance purchases (20-30% cloud saving)
- Auto-scaling implementation (15-20% cloud saving)
- Support chatbot deployment (20-30% ticket reduction)
- Target: 3-5% gross margin improvement

Phase 3 (6-12 months): Strategic changes
- Architecture optimisation (reduce compute per customer)
- Payment method migration (reduce processing costs)
- Support tier restructuring
- Target: 2-3% additional improvement

Total potential: 6-10% gross margin improvement over 12 months

On £5M revenue:
- Starting margin: 78% (£3.9M gross profit)
- After optimisation: 85% (£4.25M gross profit)
- Improvement: £350K additional gross profit

`
      }
    ],
    relatedSlugs: ["profitability-analysis-and-operating-leverage", "operating-expense-management-and-control", "saas-metrics-benchmarking-and-peer-comparison", "financial-planning-and-budgeting", "scaling-operations-and-systems-building"],
    faq: [
      { q: "What is a good gross margin for SaaS?", a: "Target: >75% for pure SaaS, best-in-class >85%. COGS includes: hosting (5-15%), support (3-8%), customer success (3-7%), payment processing (2-3%), third-party APIs (1-5%). Below 70% indicates issues with hosting costs or support scaling. Each 1% improvement on £5M revenue = £50K additional gross profit. Optimise cloud costs first (typically 30-50% of COGS)." },
      { q: "How do I reduce cloud hosting costs?", a: "Top strategies: (1) Reserved instances for always-on workloads (30-60% savings), (2) Right-size over-provisioned instances (most are 40-60% over-provisioned), (3) Spot instances for batch workloads (60-80% savings), (4) Auto-scaling (match capacity to demand, 15-35% savings), (5) Storage tiering (move cold data to archive, 40-80% savings). Typical total savings: 30-50% of cloud spend." },
      { q: "How do I scale support without linear cost growth?", a: "Scale sub-linearly with: (1) Knowledge base (deflect 30-40% of tickets), (2) AI chatbot (automate 20-30% of remaining), (3) In-app guidance (prevent issues before they become tickets), (4) Tiered support (allocate agents to high-value customers). Target: <0.3 tickets per customer per month. Example: 1,000 customers, reduce from 500 to 210 agent-handled tickets, cut support team by 33%." }
    ],
    videoUrl: ""
  }
];

export default batch374Articles;
