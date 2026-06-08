import { AcademyArticle } from "@/types/academy";

export const batch302Articles: AcademyArticle[] = [
  {
    slug: "white-label-and-reseller-programs",
    title: "White-Label and Reseller Programs: Building Distribution Channels",
    description: "Master reseller programs. Build channel partnerships, expand distribution.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["white-label", "reseller program", "channel partners", "partner distribution", "OEM"],
    keyTakeaways: [
      "White-label model: Partner sells your product under their brand (customer never sees your company). Revenue: Reseller pays you 30-50% wholesale, sells to customer at 100% (they pocket 50-70%). Cost: Development (customization, white-label setup), partner support. Benefit: Rapid distribution (partner's customer base), scale without sales team. Example: 10 resellers averaging 5 customers each = 50 customers without sales hires.",
      "Partner economics: Reseller pays 40% of retail price, sells at 100%. Example: Retail £3000/year. Reseller pays £1200, sells for £3000, keeps £1800 (60%). Your revenue: £1200 × 50 customers = £60K/year (10 resellers, 5 customers each). Compared: Direct sales (50% margin) would need 40 direct customers for same revenue but higher CAC.",
      "Program structure: Tiers (certified, preferred, partner), support (deal registration, co-marketing), pricing (volume discounts, margins), enablement (training, materials). Cost: Partner program manager (0.5 FTE), co-marketing budget (£5-10K/year), training time. Benefit: Scalable revenue, reduced CAC (partner brings customer), leverage partner's brand/relationships. Timeline: 6-12 months to mature program."
    ],
    content: [
      {
        heading: "Building Effective White-Label and Reseller Channels",
        body: `Creating partner-driven distribution.

**White-label vs reseller models**

White-label (full rebranding):
- Product: Delivered under partner's brand (no mention of you)
- Customer view: Thinks partner created product
- Typical use: Agency white-labels to their clients
- Revenue: Partner pays 30-50% of retail price
- Example: Partner charges client £5K/month, pays you £1500-2500

Reseller (partner's own brand):
- Product: You're visible (partner recommends your product)
- Customer view: Partner recommends you as solution
- Typical use: Software reseller, system integrator
- Revenue: Partner pays 40-50% wholesale
- Example: Retail £100/month, reseller pays £40-50, sells for £100

Private label (hybrid):
- You: Provide technology
- Partner: Provides customer-facing experience, branding
- Revenue: Negotiated (30-60% split typically)
- Example: Partner develops analytics dashboard on top of your API

Economics comparison:

Direct sales model:
- Customer pays: £3000/year
- Your cost: 30% (CAC, CS, overhead)
- Your margin: 70% = £2100 profit
- Timeline: 2-4 weeks sales cycle
- Headcount: 1 AE per £1M revenue

Reseller model:
- Customer pays: £3000/year (via reseller)
- Reseller pays you: £1200-1500 (40-50%)
- Your cost: 15% (partner support, billing)
- Your margin: 85% = £1020-1275 profit
- Timeline: Partner sells (varies, 1-8 weeks)
- Headcount: Same volume with fewer salespeople

Trade-off: Lower per-customer profit (£1200 vs £2100), but higher margin on cost (85% vs 70%), and no sales cost (partner pays for sales)

**Reseller program structure**

Tier 1: Authorized reseller
- Requirements: Sell minimum (£50K/year), support customers
- Pricing: 40% wholesale discount
- Support: Email/ticket-based
- Co-marketing: Logo on partner page
- Cost to you: Minimal (handle tickets)

Tier 2: Preferred reseller
- Requirements: Sell minimum (£250K/year), certify staff
- Pricing: 45% wholesale discount
- Support: Dedicated partner manager, quarterly calls
- Co-marketing: Joint case studies, events
- Cost to you: 0.25 FTE partner manager time

Tier 3: Strategic partner
- Requirements: Sell minimum (£1M/year), deep integration
- Pricing: 50% wholesale discount + volume bonuses
- Support: Custom integration, joint product development
- Co-marketing: Co-branded marketing materials, events
- Cost to you: 0.5 FTE dedicated relationship manager

Example economics:

10 authorized resellers (£50K/year each):
- Gross: 10 × £50K = £500K
- Your revenue: £500K × 40% = £200K
- Your cost: Minimal (support tickets)
- Your margin: ~85% = £170K

2 preferred resellers (£250K/year each):
- Gross: 2 × £250K = £500K
- Your revenue: £500K × 45% = £225K
- Your cost: 0.5 FTE partner manager (£50K)
- Your margin: 78% = £175K

1 strategic partner (£1M/year):
- Gross: £1M
- Your revenue: £1M × 50% = £500K
- Your cost: 1 FTE relationship manager (£80K)
- Your margin: 84% = £420K

**Partner recruitment and enablement**

Finding partners:

Ideal partner profile:
- Sells to your target customer
- Complements your product (not competes)
- Has established customer base
- Wants to expand offerings
- Examples: Consulting firms, agencies, system integrators, ISVs

Recruitment tactics:
- Direct outreach: "We notice you serve [customer type], interested in partnership?"
- Referral: Ask existing customers "Who would be good reseller?"
- Channel partners: Partner organizations (HubSpot partners, Zapier partners)
- Events: Booth at industry events, speak to potential partners
- Channel marketing: Advertise partner program on website

Onboarding:

Materials:
- Partner agreement (legal terms, pricing, exclusivity)
- Sales enablement (pitch deck, demo, case studies)
- Customer success materials (how to support customers)
- Pricing guidelines (what can they charge?)
- Marketing co-op (budget for co-marketing)

Training:
- Initial: 2-hour kickoff (product demo, sales pitch, process)
- Recurring: Monthly updates (new features, best practices)
- Certifications: Optional (staff certification, becomes "certified partners")
- Support: Access to help desk, partner portal for materials

**Managing reseller relationships**

Deal registration:
- Partner registers potential customer (before proposal)
- You confirm: Not already in pipeline with us
- Benefit: Prevents channel conflict (partner vs direct sales)
- Typical: 72-hour window (partner has protected deal)

Revenue tracking:
- Partner reports monthly sales
- You bill partner (invoice 40% of customer revenue)
- Partner bills customer (100% of retail price)
- Reconciliation: Quarterly audit (spot-check accuracy)

Support handoff:
- Customer contracts with partner (not you directly)
- Partner is customer-facing (handles support questions)
- Escalation: Partner escalates technical issues to you
- Clear lines: Partner handles billing/admin, you handle technical

Co-marketing:
- Budget: £2-5K per partner per year
- Uses: Case studies (customer success story), webinars, events, content
- Approval: Joint review before publishing (brand safety)
- Measurement: Track deals from co-marketing activity

Quarterly business review:
- Attendance: You + partner decision-makers
- Agenda: Performance review, pipeline review, forecast, opportunities
- Discussion: What's working? Challenges? Expansion opportunities?
- Commitment: Next period targets (minimum sales, investment)

**Common mistakes**

Mistake 1: Too much support burden
- Problem: Partners expect free support for their customers
- Fix: Charge for support, build it into partner economics
- Example: Partner pays 40%, reimburses you for support hours

Mistake 2: Channel conflict
- Problem: You sell direct while partner sells same customer
- Fix: Deal registration process, clear territory definitions
- Example: "Partner owns SMB in North, you own Enterprise nationwide"

Mistake 3: Poor pricing tier
- Problem: Partner margin too low (40%) or too high (60%) for market
- Fix: Research market, test pricing, adjust annually
- Example: Start 40%, move to 45% after success

Mistake 4: Weak enablement
- Problem: Partners don't know how to sell your product
- Fix: Invest in training, sales enablement, ongoing education
- Example: Monthly partner webinar (updates, best practices)

Mistake 5: No monitoring/governance
- Problem: Partner violates agreement (oversells beyond support capacity)
- Fix: Monthly reporting, quarterly business review, audit checks
- Example: Partner claims £100K sales but system shows £30K

**Growth strategy**

Year 1: Foundation
- Target: 5-10 authorized resellers
- Revenue goal: £200-300K (from resellers)
- Investment: Build program (materials, agreements, support process)
- Metric: Reseller satisfaction, repeat sales

Year 2: Scaling
- Target: 15-20 authorized, 3-5 preferred resellers
- Revenue goal: £500K-1M (from resellers)
- Investment: Partner manager hire, co-marketing budget
- Metric: Revenue per partner, partner retention

Year 3: Maturity
- Target: 20+ authorized, 5+ preferred, 1-2 strategic partners
- Revenue goal: £1-2M (from resellers)
- Investment: Partner program optimization, strategic partnerships
- Metric: Channel vs direct mix, partner profitability

Success factors:
- Clear partner economics (partners understand margin)
- Strong enablement (partners can sell effectively)
- Regular communication (quarterly business reviews)
- Co-marketing investment (help partners succeed)
- Deal registration (prevent channel conflict)
- Support quality (partners trust you for escalations)

ROI calculation:

Example 3-year program:
- Investment: £150K (tools, training, manager hiring)
- Revenue generation: Year 1 (£200K), Year 2 (£600K), Year 3 (£1.2M)
- Cumulative revenue: £2M (at 45% margin = £900K profit)
- ROI: £900K profit - £150K cost = £750K net (5x ROI)

Compare to direct sales equivalent:
- 2M revenue via direct sales = 40+ customers
- CAC (£3K) + CS (30% of revenue) = 50% cost
- Profit: £1M (vs £900K via reseller)
- Headcount: 5 AEs (vs 0.5 FTE partner manager)
- Flexibility: Fixed reseller is lower headcount, lower variable cost

Conclusion: Reseller model better for scaling (lower fixed cost, higher margin), direct sales better for control (higher margin per customer, customer relationship)

`
      }
    ],
    relatedSlugs: ["partner-strategy-and-ecosystem-development", "customer-acquisition-strategy-and-marketing-roi", "sales-pipeline-management-and-forecasting", "pricing-strategy-and-price-optimization", "unit-economics-ltv-cac-payback"],
    faq: [
      { q: "What's the difference between white-label and reseller?", a: "White-label: Partner sells under their brand (your company hidden). Customer never sees you. Reseller: Partner recommends your product (you're visible). Customer knows who you are. Both: Partner pays 40-50% wholesale, sells at 100% (keeps 50-60% margin). Choose based on partner preference and market fit." },
      { q: "How much should I pay resellers?", a: "Wholesale discount: 40-50% typical. Example: Retail £3000/year, reseller pays £1200-1500 (40-50% discount), keeps £1500-1800 (50-60% margin). Lower discount (<40%) = harder to recruit. Higher discount (>50%) = erodes your margin too much. Tier by volume: Tier 1 (40%), Tier 2 (45%), Tier 3 (50%) at higher minimums." },
      { q: "How do I prevent channel conflict?", a: "Deal registration: Partner registers prospect with you (before proposal). You confirm not in pipeline. Partner gets protected deal (72-96 hour window, or until deal closes). Territory definition: Clear geographic, vertical, or customer-size boundaries. Monitoring: Monthly/quarterly sales reporting, audit spot-checks. Support: Good partner communication, quarterly business reviews." }
    ],
    videoUrl: ""
  }
];

export default batch302Articles;