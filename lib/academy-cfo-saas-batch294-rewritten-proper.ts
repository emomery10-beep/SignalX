import { AcademyArticle } from "@/types/academy";

export const batch294Articles: AcademyArticle[] = [
  {
    slug: "customer-acquisition-playbooks-by-channel",
    title: "Customer Acquisition Playbooks by Channel: Building Repeatable Processes",
    description: "Master channel-specific playbooks. Build repeatable acquisition by channel.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer acquisition", "acquisition channels", "sales playbook", "marketing playbook", "CAC", "channel strategy"],
    keyTakeaways: [
      "Playbook structure: Define ideal customer, top-of-funnel strategy (how attract), engagement (how nurture), conversion (how close), retention (how keep). Cost per channel: Organic £0 (time), paid £5-20K/month, sales £5-15K/month, partnership varies. Benefit: Repeatable (scalable). Example: Self-serve SaaS needs 1 playbook. Enterprise needs different (AE-led). Example: Cold email playbook: 100 prospects → 5 meetings → 1 customer (5% conversion, £5K CAC if 1 FTE running).",
      "Channel characteristics: Organic (slow, cheap, sustainable), Paid (fast, expensive, dependent on ad spend), Sales (high-touch, expensive, higher value), Partnerships (scalable, requires work). Best strategy: Mix (don't depend on one). Example: 40% organic, 30% paid, 20% sales, 10% partnerships. Monitor: Cost per customer by channel, conversion rate, customer quality (retention), LTV by channel.",
      "Optimization approach: (1) Pick 2-3 channels to master (depth > breadth), (2) Build playbooks (repeatable, documented), (3) Measure (track metrics), (4) Optimize (test variations), (5) Scale (invest more in best channels). Cost: Varies (measurement/optimization time). Benefit: CAC optimization (30-50% improvement typical), predictable revenue. Timeline: 3-6 months to mature playbook."
    ],
    content: [
      {
        heading: "Building Repeatable Customer Acquisition Channels",
        body: `Creating scalable sales and marketing processes.

**Channel comparison**

| Channel | CAC | Sales Cycle | Quality | Scalability | Effort |
|---|---|---|---|---|---|
| Organic/Content | £500-2K | 2-4 months | High | High | High initial |
| Paid ads | £1-5K | 1-3 months | Medium | High | Ongoing spend |
| Sales/AE | £3-10K | 2-6 months | High | Medium | Team-based |
| Partnerships | £2-8K | 2-4 months | High | Medium-High | Relationship-based |
| Referral | £500-1K | 1-2 months | Highest | Medium | Word-of-mouth |
| Inbound/Brand | £1-3K | 2-4 months | High | High | Long-term investment |

Ideal mix by stage:
- Early (pre-PMF): Organic/content + direct sales (build brand, land anchor customers)
- Growth (PMF): Organic + paid + sales (scale proven channels)
- Scale (£10M+): Balanced mix (reduce individual channel dependency)

**Cold email playbook (sales channel)**

Target: Mid-market SaaS (£1-10M ARR), 50-500 employees

Process:
1. Build list: 100-200 qualified prospects
   - Job titles: VP Sales, CFO, CRO
   - Company size: £10-50M revenue
   - Technology: Using competitor product
   - Tools: LinkedIn Sales Navigator, Hunter.io
   - Cost: £200/month for tools

2. Outreach: Sequence of emails
   - Email 1 (day 1): Personalized (reference their company/job)
   - Email 2 (day 3): Follow-up (value prop)
   - Email 3 (day 7): Social proof (case study link)
   - Goal: 5-10% response rate

3. Meetings: Calendar link if interested
   - Qualification call (15 min): Confirm fit
   - Demo call (30 min): Product overview
   - Close: Proposal to contract (30-60 days)

4. Conversion rate:
   - List to response: 5-10% (10-20 responses from 100)
   - Response to meeting: 30-50% (3-10 meetings)
   - Meeting to close: 10-30% (0.3-3 customers)
   - Overall: 100 → 1-2 customers

5. Cost:
   - Labor: 1 AE (£80K/year) ÷ 20 customers = £4K CAC
   - Tools: £200/month × 12 ÷ 20 = £120 CAC
   - Total CAC: ~£4.1K

Optimization:
- Improve open rate: Better subject lines, personalization
- Improve response rate: Stronger value prop, social proof
- Improve conversion: Better qualifying, demo skills
- Goal: 1-2 → 3-5 customers (2.5x improvement)

**Paid ads playbook (paid channel)**

Platform: Google/LinkedIn ads, targeting decision-makers

Funnel:
1. Ad spend: £2K/month
2. Click-through rate: 2-3% (£2K ad → 40-60 clicks)
3. Landing page conversion: 5-10% (40-60 → 2-6 leads)
4. Sales conversion: 20-30% (2-6 → 0.4-1.8 customers)
5. Monthly customers: 1-2
6. Monthly CAC: £2K / 1.5 = £1.3K per customer

Optimization:
- A/B test creative: Different ad copy, images
- Refine targeting: Narrower audience (higher conversion)
- Improve landing page: Higher conversion rate
- Improve sales: Better qualification, faster close
- Goal: Reduce CAC 20-30% (£1.3K → £900-1K)

Break-even analysis:
- CAC: £1.3K
- ACV: £3K (monthly), LTV: £36K (annual)
- Payback: £1.3K / (£3K × 0.7 margin) = 2.5 months (healthy)

Scaling:
- If CAC £1.3K and payback 2.5 months: scale up ad spend
- Double ad spend (£4K/month) → 3-4 customers/month
- Revenue: £9-12K/month (new ads)
- Cost: £4K (ads) (ROI 2-3x)

**Content marketing playbook (organic channel)**

Strategy: SEO-driven blog content, build authority

Content:
1. Topic selection: High-volume keywords
   - "SaaS pricing strategy" (5K monthly searches)
   - "Unit economics for startups" (2K searches)
   - "CAC payback period" (1K searches)

2. Content creation: Target top 10 ranking keywords
   - 10 articles/month (£500-1K per article from freelancer)
   - Cost: £5-10K/month

3. SEO timeline:
   - Month 1-3: Publish, no traffic (building domain authority)
   - Month 4-6: Organic traffic starting (few hundred/month)
   - Month 7-12: Growing (thousand+ visits/month)
   - Month 12+: Compound growth (referral traffic)

4. Conversion:
   - Traffic: 5K monthly visitors (12+ months in)
   - Email signup: 2% (100 leads)
   - Free trial: 10% (10 trials)
   - Paid: 25% (2-3 customers)

5. CAC:
   - Content cost: £5K/month × 12 months = £60K/year
   - Customers: 2-3/month = 24-36/year
   - CAC: £60K / 30 = £2K per customer

Optimization:
- Content quality: Better articles → higher traffic
- Keyword research: Target easier keywords first (faster ranking)
- Link building: Backlinks from authority sites → faster ranking
- Goal: Same content, 2x traffic → CAC £1K (50% reduction)

Long-term benefit:
- Compounding: Same effort, traffic keeps growing
- Brand: Content establishes authority
- Inbound: Leads come to you (vs cold outreach)
- Cost efficiency: £2K CAC scales to £500 CAC after 2 years

**Partnership playbook**

Strategy: Partner with complementary companies for referrals

Identify partners:
- Complementary, not competitive
- Same target customer
- Larger audience/customer base
- Example: If we're SaaS metrics tool, partner with CFO advisor

Process:
1. Outreach: Warm intro or LinkedIn
2. Meeting: Pitch partnership (mutual benefit)
3. Agreement: Referral fee, commission structure
4. Enablement: Give partner resources, training
5. Tracking: Set up referral link, track conversions
6. Reward: Pay commission on customers referred

Economics:
- Referral fee: 20% of first-year ACV (example)
- Example: Partner refers customer, £3K ACV = £600 fee paid
- Partner perspective: Easy money for recommending
- Our perspective: £600 CAC (if customer retained)

ROI:
- Find 5 good partners → 2-3 active referrers
- 1-2 referrals/month per partner → 3-5 customers/month
- CAC: £600-1K (commission paid)
- Cost: 5 hours/month managing partnerships
- Result: 3-5 customers/month at low CAC

**Optimizing across channels**

Measurement:
- Track CAC by channel (google sheets or Mixpanel)
- Track payback period by channel (important metric)
- Track customer quality (retention, expansion by channel)

Monthly review:
| Channel | Spend | Customers | CAC | Payback | LTV |
|---|---|---|---|---|---|
| Cold email | £4K | 2 | £2K | 6 mo | £20K |
| Paid ads | £2K | 1.5 | £1.3K | 4 mo | £20K |
| Content | £5K | 2.5 | £2K | 5 mo | £25K |
| Partnerships | £3K | 3 | £1K | 3 mo | £22K |

Best performing: Partnerships (lowest CAC, fastest payback, good LTV)
Action: Invest more in partnerships (find more partners)

Worst: Paid ads (highest CAC, though fast payback)
Action: Optimize (better targeting, improve conversion) or reduce spend

Scaling strategy:
- Double down on partnerships and content (best CAC)
- Optimize paid ads (improve CAC)
- Maintain cold email (reliable, predictable)
- Goal: Reduce overall blended CAC 20-30%, double customer volume

`
      }
    ],
    relatedSlugs: ["unit-economics-ltv-cac-payback", "customer-acquisition-strategy-and-marketing-roi", "sales-pipeline-management-and-forecasting", "marketing-automation-and-lead-nurturing", "partner-strategy-and-ecosystem-development"],
    faq: [
      { q: "What CAC should I aim for?", a: "Depends on ACV and LTV. Rule: CAC payback <12 months (healthy). Example: £3K ACV, 70% margin = payback 4-5 months = healthy CAC £1.5-2K. Monitor by channel: cold email might be £2-3K, paid ads £1-2K, partnerships £500-1K. Goal: Optimize channels, reduce blended CAC 20-30%." },
      { q: "How do I build repeatable sales/marketing?", a: "Define playbook: ideal customer → acquisition strategy → engagement → conversion → retention. Document process (repeatable). Measure metrics (CAC, conversion, payback). Optimize (A/B test, improve weak areas). Scale (invest more in best channels). Typical: 3-6 months to mature playbook." },
      { q: "Should I focus on one channel or many?", a: "Start: 2-3 channels (depth > breadth). Examples: content + cold email, or paid + partnerships. Build playbooks in chosen channels (repeatable, optimized). Then: Add channels (once first channels mature). Diversify: Don't depend on single channel (risky, Google algorithm changes, etc.)." }
    ],
    videoUrl: ""
  }
];

export default batch294Articles;