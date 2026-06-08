import { AcademyArticle } from "@/types/academy";

export const batch175Articles: AcademyArticle[] = [
  {
    slug: "partnership-and-channel-strategy",
    title: "Partnership and Channel Strategy: Growing Through Partners",
    description: "Master partnership strategy. Build channel partners, manage relationships, and scale through indirect sales.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "partnership strategy",
      "channel partners",
      "reseller partners",
      "integration partners",
      "channel management",
      "partner economics",
      "partner recruitment",
      "indirect sales",
      "partner incentives",
      "strategic partnerships"
    ],
    keyTakeaways: [
      "Partnership types: (1) Resellers (sell your product, take margin), (2) Integration partners (integrate your product with theirs), (3) Referral partners (recommend your product, get commission), (4) Strategic partners (joint go-to-market, co-marketing). Economics: Reseller takes 20-40% margin (your cost of sale), integration partners drive adoption (customer stickier), referral partners low-cost acquisition (only pay on results).",
      "Partner economics: Direct sales CAC £4K, payback 5 months. Partner CAC £1K (partner brings customer cheaper), payback 2 months. Tradeoff: Lower margin (give partner 20%), but faster payback (lower cost). At scale, partners 30-50% of revenue common. Example: £10M ARR company might be 60% direct (high margin), 40% partner channel (volume).",
      "Partner management: Select carefully (not all partners good), train (product knowledge, sales skills), incentivize (commission, marketing funds, sales tools). Measure: Partner satisfaction (NPS), partner growth (revenue, customer count), partner retention (% staying). Bad partners hurt brand (poor CS, wrong customers). Good partners grow business (bring right customers, support them well)."
    ],
    content: [
      {
        heading: "Types of Partnerships",
        body: `Different partnership models and their benefits.

**Reseller Partners**

Resellers: Buy from you at wholesale, sell to end customer

Economics:
- You sell to reseller: £100 (wholesale price)
- Reseller sells to customer: £150 (retail price)
- Reseller margin: £50 (33%)

For you:
- Lower margin (£100 vs £150 direct)
- Faster growth (reseller brings customers you wouldn't reach)
- Less support (reseller handles customer)

Example: SaaS CAC £4K direct, but through reseller partner only £1K (partner brings cheaper).

When to use:
- Penetrating new market (reseller knows local customers)
- Scaling volume (resellers amplify reach)
- Enterprise (resellers have relationships)

**Integration Partners**

Integration partners: Integrate your product with theirs, drive mutual adoption

Economics:
- Both products benefit (customers use more because integrated)
- No margin transfer (no discount)
- Revenue growth from stickiness

Example: CRM partner integrates with email tool
- CRM customer happier (can send emails from CRM)
- Email tool customer acquired (via CRM)
- Both products stickier (usage higher)

When to use:
- Complementary products (not competing)
- Shared customer base
- Easy technical integration

**Referral Partners**

Referral: Partner recommends you, you pay commission

Economics:
- You pay commission: 10-25% of customer value
- Partner brings warm customer (high conversion)
- No marketing cost for partner

Example:
- Accountant recommends your accounting software
- You pay accountant: 20% of first year value
- Customer value: £1K first year
- Commission: £200

Cost: Only pay when customer acquired (no upfront).

When to use:
- Low cost customer acquisition (commission-based)
- Partners with your target customer
- Easy to measure (referral code, tracking)

**Strategic Partnerships**

Strategic: Joint go-to-market, co-marketing, shared resources

Economics:
- Informal, often no money exchanged
- Both benefit from market reach
- Example: Slack partners with productivity tools

Example partnership:
- You + Project management tool = "Integrated productivity suite"
- Co-market: Joint webinars, content, go-to-market
- Both drive customer acquisition
- Revenue: Customers pay both (or integrated version)

When to use:
- Large, complementary players
- Aligned customers
- Long-term strategic fit

`
      },
      {
        heading: "Partner Economics and Management",
        body: `Building sustainable partner relationships.

**Partner Pricing and Margins**

Standard reseller margins:
- Software: 20-30% discount from list (partner makes 20-30%)
- Hardware: 30-40% discount (cost-of-goods higher)
- Services: 20-25% discount

Tiered margins:
- Volume discounts (higher volume = higher margin)
- Loyalty bonuses (higher performer = bonus)
- Exclusive deals (exclusive territory = premium margin)

Example:
- Base discount: 25%
- If >$100K/year: Additional 5% (30% total)
- If exclusive territory: Additional 5% (35% total)

Partner incentives:
- MDF (Marketing Development Funds): Co-market, build mindshare
- Spiffs (sales bonuses): Close deal, get bonus
- Deal registration: Partner identifies customer, gets discount on that deal
- Training: Free training on your product

**Partner Recruiting**

Where to find partners:
- Existing customers (often become partners)
- Industry associations (meet potential partners)
- Consultants (sell your product as recommendation)
- Agencies (integration partners, resellers)
- Competitors (find their partners, recruit them)

Recruitment process:
1. Identify target (who is aligned customer)
2. Approach (outbound, conference, intro)
3. Qualification (are they serious, capable)
4. Proposal (offer terms, territory, support)
5. Onboarding (training, tools, go-live)

Partner success factors:
- Technical competence (can they implement)
- Sales ability (can they sell)
- Customer focus (do they take care of customers)
- Brand alignment (do they fit our brand)

**Partner Support and Enablement**

Training:
- Product training (how does it work)
- Sales training (how to position, overcome objections)
- Implementation training (how to deploy for customer)
- Certification (prove competence)

Tools and resources:
- Sales collateral (slides, one-pagers, case studies)
- Demo environment (sandbox to practice)
- Sales tools (CRM integration, lead scoring)
- Pricing tools (deal configurator)

Ongoing:
- Regular check-ins (monthly partner calls)
- Sales support (help close deals)
- Technical support (help implement)
- Marketing support (joint campaigns, events)

**Partner Performance Management**

Track metrics:
- Revenue (how much partner bringing in)
- Growth (is partner growing or flat)
- Customer satisfaction (partner treating customers well)
- Partner satisfaction (is partner happy with us)

Dashboard:
| Partner | YTD Revenue | Growth | Customer NPS | Satisfaction |
|---------|------------|--------|---|---|
| Partner A | £200K | 20% | 45 | Good |
| Partner B | £50K | -10% | 30 | At risk |
| Partner C | £100K | 50% | 55 | Excellent |

Actions:
- Partner C (excellent): Invest more, exclusive deal
- Partner B (at risk): Support (training, leads), or exit
- Partner A (good): Maintain, look for growth opportunities

`
      },
      {
        heading: "Channel Strategy",
        body: `Building a balanced go-to-market across channels.

**Channel Mix**

Typical SaaS mix:
- 60% direct (self-serve + direct sales)
- 30% channel partners (resellers, referral)
- 10% strategic partnerships (integration, co-marketing)

By stage:
- Early: 80% direct, 20% channel (build direct first)
- Growth: 60% direct, 40% channel (scale via partners)
- Scale: 50% direct, 50% channel (balanced)

Economics comparison:
- Direct: Higher margin (100%), higher CAC (£4K), longer payback (5 mo)
- Channel: Lower margin (75%), lower CAC (£1K), shorter payback (2 mo)

Strategy:
- Direct: Higher LTV customers (enterprise), strategic focus
- Channel: Volume customers (SMB), fast scaling
- Mix: Both (balance growth and margin)

**Channel Conflicts**

Problem: Your direct sales compete with partners

Example:
- Partner reselling to UK market
- Your direct sales also selling to UK
- Partner loses deal to your sales team
- Partner unhappy

Solutions:
1. Territory exclusivity (partner gets exclusive region)
   - Partner: Gets exclusive UK market
   - You: Can't sell direct in UK (but partner must perform)

2. Account assignment (who owns each customer)
   - Partner A owns their customers
   - You own direct customers
   - Clear assignment prevents conflicts

3. Deal registration (partner identifies deal)
   - Partner: Identifies opportunity with customer
   - You: Register deal (partner gets credit)
   - Prevents: You stealing partner's deal

**Channel Expansion Timeline**

Year 1:
- Direct sales strong
- Start recruiting partners (1-2)
- 80% direct, 20% partner

Year 2:
- Expand partner base (5-10 partners)
- Scale direct
- 70% direct, 30% partner

Year 3+:
- Large partner ecosystem (20-50 partners)
- Mature direct
- 50-60% direct, 40-50% partner

Growth through channel: Compound effect (partners grow faster than direct).

`
      }
    ],
    relatedSlugs: [
      "competitive-analysis-and-market-positioning",
      "unit-economics-ltv-cac-payback",
      "sales-pipeline-management-and-forecasting",
      "pricing-strategy-and-price-optimization",
      "expansion-revenue-and-upsell-strategy"
    ],
    faq: [
      {
        q: "What types of partnerships should I pursue?",
        a: "Four types: (1) Resellers (sell your product at margin), (2) Integration partners (integrate products, mutual benefit), (3) Referral partners (recommend, earn commission), (4) Strategic partners (joint go-to-market). Choose based on your strategy. Early stage: Referral (low cost). Growth stage: Resellers (volume). Large scale: Mix of all."
      },
      {
        q: "What margin should I offer resellers?",
        a: "Typical: 20-30% discount from list price. Tier it: Base 25%, higher volume gets 30%, exclusive gets 35%. Offer incentives: Marketing development funds (co-market), sales bonuses, deal registration. Avoid too high margin (erodes your revenue) or too low (partners won't sell)."
      },
      {
        q: "How do I recruit and support partners?",
        a: "Recruit: Target aligned customers, consultants, agencies. Propose: Clear terms (margin, territory, support). Onboard: Product and sales training, sales collateral, demo environment. Support: Regular check-ins, sales help, marketing support, certification. Measure: Revenue, growth, customer satisfaction, partner satisfaction."
      },
      {
        q: "What channel mix should I aim for?",
        a: "Early: 80% direct, 20% partner (build direct first). Growth: 60% direct, 40% partner (scale via partners). Mature: 50-60% direct, 40-50% partner (balanced). Partner channel: Lower CAC, lower margin, faster payback, but less control. Direct: Higher margin, more control, but higher CAC."
      }
    ],
    videoUrl: ""
  }
];

export default batch175Articles;
