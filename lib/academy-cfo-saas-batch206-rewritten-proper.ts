import { AcademyArticle } from "@/types/academy";

export const batch206Articles: AcademyArticle[] = [
  {
    slug: "account-management-and-expansion-revenue",
    title: "Account Management and Expansion Revenue: Growing Existing Customers",
    description: "Master account management. Grow customer spend, manage accounts strategically, maximize LTV.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "account management",
      "account expansion",
      "customer growth",
      "expansion revenue",
      "upsell strategy",
      "cross-sell",
      "NRR",
      "customer lifetime value",
      "customer retention",
      "account strategy"
    ],
    keyTakeaways: [
      "Expansion revenue: NRR >100% = customers expanding (best outcome). Example: £10M start, lose 2% churn (-£200K), gain expansion +£500K = NRR 103% (£10.3M). vs NRR <100% = churn exceeds expansion (declining). Drive: Proactive expansion (CS-led conversations), feature adoption (more usage = more value), product roadmap (features customers need). Economics: Expansion revenue lower CAC (no acquisition), higher margin (existing customer), shorter cycle (known customer). Focus: Expand 50% of customers 10% = +5% revenue (huge impact).  ",
      "Account tiers and ownership: SMB (self-serve, no account manager), Mid-market (dedicated account executive), Enterprise (senior account executive + CSM + executive sponsor). Coverage: 1 AE per 10 mid-market accounts, 1 AE per 3-5 enterprise accounts. Compensation: AE gets credit for expansion (incentivizes growth, not just new). Example: New ACV £30K + expansion £5K = AE comp on both (motivates account growth). Relationship: Quarterly business reviews (show value, plan growth), executive sponsor (C-level relationship, strategic alignment, cross-sell opportunities).",
      "Expansion playbook: Triggers = customer expanding usage (more users, more volume). Actions: (1) Congratulate/recognize, (2) Schedule expansion conversation, (3) Identify unmet needs, (4) Propose upgraded plan/add-ons, (5) Close deal. Example: Customer started 5 users (basic tier £100/month), now 15 users → offer pro tier (5 users + £50 each = £400, vs basic £100 = £300 additional). Revenue impact: Expansion conversation closed 50% of time = 10 customers × £300 = £3K expansion per 20 basic customers (good ROI on CS time)."
    ],
    content: [
      {
        heading: "Expansion Revenue and NRR",
        body: `Maximizing growth from existing customers.

**Net Revenue Retention (NRR) Formula**

NRR = [(Start revenue) + (Expansion) - (Churn)] / (Start revenue)

Example:
- Start: £10M (100 customers at £100K each)
- Churn: Lost 2 customers (-£200K)
- Expansion: Remaining 98 customers expanded 5% on average (£10M × 98% × 5% = £490K)
- Calculation: (£10M + £490K - £200K) / £10M = £10.29M / £10M = 102.9% NRR

Interpretation:
- >100%: Growing despite churn (healthy, expansion exceeds churn)
- 100%: Flat (expansion = churn, no net growth)
- <100%: Declining (churn > expansion, shrinking)

Benchmark:
- <90% NRR: Problem (serious churn or low expansion)
- 90-100% NRR: Acceptable (churn/expansion balanced)
- 100-110% NRR: Good (expansion > churn)
- >110% NRR: Excellent (strong expansion)

**Impact on growth trajectory**

Without expansion (NRR = 98% due to 2% churn, no expansion):
- Year 1: £10M (start)
- Year 2: £10M × 98% = £9.8M (decline)
- Year 3: £9.8M × 98% = £9.6M (decline)
- Path: Flat or declining (unsustainable)

With expansion (NRR = 110%):
- Year 1: £10M (start)
- Year 2: £10M × 110% = £11M (grow 10%)
- Year 3: £11M × 110% = £12.1M (grow 10% again)
- Path: Compounding growth (sustainable)

Implication: NRR >100% = growth machine (can invest heavily, profitable long-term)

**Building expansion team and goals**

Account management structure:
- SMB (£1-5K ACV): Self-serve (no AM), use email/in-app
- Mid-market (£10-100K ACV): Account executive owned
- Enterprise (£100K+ ACV): Senior AE + dedicated CSM + exec sponsor

Coverage ratios:
- Mid-market AE: 10 accounts per AE (40% of time selling new, 60% on expansion)
- Enterprise AE: 3-5 accounts per AE (high touch, quarterly reviews)

Incentives:
- AE comp: 50% from new customers, 50% from expansion (aligns to NRR growth)
- Example: Close new customer £30K = £5K comp. Expand existing customer £5K = £2.5K comp (same effort, both incentivized)
- Annual bonus: If achieve NRR target (e.g., >105%), bonus pool for expansion team

Goals:
- Expand 50% of customer base 10% annually = +5% revenue
- Example: 100 customers, expand 50 at £100K average (£50K to £110K) = £500K expansion revenue

`
      },
      {
        heading: "Expansion Triggers and Playbook",
        body: `Identifying and executing expansion opportunities.

**Expansion triggers (signals to expand)**

Usage-based triggers:
- Usage exceeding plan (customer using more than contracted for)
- Feature adoption: Using 80%+ of features (indicates value, ready for more)
- Team expansion: Adding more users (indicates growth, willingness to pay more)

Engagement-based triggers:
- Health score high (usage, NPS, engagement all strong)
- NPS >8 (detractors unlikely to expand)
- Recent win or milestone (customer success, receptive to conversations)

Business triggers:
- Time-based: After 6-12 months stable (customer and you know each other)
- Renewal time: Proactive conversation during renewal negotiation
- New use case: Customer asking for new features (adjacent problem)

**Expansion playbook**

Step 1: Identify (monthly or quarterly)
- Analytics: Which customers meet expansion criteria?
- CS insight: Which customers are engaged, likely to expand?
- Build list: Top 30% expansion candidates for quarter

Step 2: Segment by type
- Seat expansion: Add users to same tier
- Tier upgrade: Move to higher tier (more features)
- Add-on purchase: New product or service
- Example: 30 candidates, segment: 10 seat, 15 tier, 5 add-on

Step 3: Execute playbook
For each candidate:
1. Prepare (understand: current usage, upcoming needs, budget)
2. Outreach: Personalized email or call
   - Example: "We noticed you're using feature X heavily, love your engagement"
3. Discover: Why are they expanding? What pain point?
   - Ask: "What features would help you the most?"
   - Listen: Understand unmet needs
4. Propose: Solution tailored to need
   - Example: "Based on your usage, pro tier unlocks advanced reporting and team collaboration"
5. Close: Negotiate, get approval, implement
   - Example: "Let's upgrade to pro tier (£400/month vs £100), effective next month"

Step 4: Monitor and measure
- Success rate: % of expansion conversation → closed
- Target: 40-50% close rate (engaged customers, well-scoped)
- Revenue impact: £X per conversation (average deal size)
- Cycle time: Days from outreach to close (should be <30 days)

**Expansion deal mechanics**

Seat expansion (customer adds users):
- Current: 5 users at £50 each = £250/month
- Add: 5 more users
- New: 10 users at £50 each = £500/month
- Expansion revenue: £250/month (new seats)
- Mid-cycle: Prorate if mid-month (add £125 to current month)

Tier upgrade:
- Current: Basic tier £100/month
- Upgrade: Pro tier £300/month
- Expansion revenue: £200/month (net increase)
- Timing: Effective next billing cycle (clean)

Add-on purchase:
- Current: Core product £100/month
- Add: Advanced analytics add-on £50/month
- Expansion revenue: £50/month
- Revenue recognition: New line item, same billing

**Expansion ROI and investment**

Cost of expansion:
- AE time: 5 hours per deal (research, outreach, call, close) at £100/hour = £500
- Proposal/docs: 1 hour = £100
- Implementation/setup: CS time 2 hours = £200
- Total: ~£800 per expansion deal

Revenue impact:
- Average expansion deal: £5K ACV (monthly £417)
- Payback: £5K / £800 = 6.25 month payback
- vs New customer CAC £2K, LTV £60K, payback 12 months

Conclusion: Expansion highly attractive (lower CAC, faster payback, higher margin)

`
      }
    ],
    relatedSlugs: [
      "expansion-revenue-and-upsell-strategy",
      "unit-economics-ltv-cac-payback",
      "customer-success-metrics-and-program-design",
      "metrics-dashboard-design-kpi-tracking",
      "pricing-strategy-and-price-optimization"
    ],
    faq: [
      {
        q: "What's a good NRR target?",
        a: "Target: >100% (growth despite churn). Benchmark: >110% excellent, 100-110% good, 90-100% acceptable, <90% problem. Example: Start £10M, lose 2% churn (-£200K), expand 5% (+£500K) = 103% NRR (£10.3M). How to improve: Reduce churn (retention focus), increase expansion (CS conversations, new features). Impact: NRR >100% = sustainable growth (can invest in growth, profitable long-term)."
      },
      {
        q: "How do I expand existing customers?",
        a: "Playbook: (1) Identify triggers (heavy usage, team expansion, health score high), (2) Segment by type (seat, tier, add-on), (3) Outreach (personalized, value-focused), (4) Discover (understand needs), (5) Propose (tailored solution), (6) Close (negotiate, implement). Close rate: 40-50% of conversations. Example: 30 candidates per quarter, 12-15 closed, £5K average = £60-75K expansion revenue per quarter."
      },
      {
        q: "What's the ROI on account management?",
        a: "Cost per expansion deal: £800 (AE time £500, CS £200, misc £100). Revenue per deal: £5K average. Payback: 6.25 months. vs New customer: CAC £2K, LTV £60K, payback 12 months. Expansion much more attractive (lower cost, faster payback). Invest: 1 AE per 10 mid-market accounts (focused on expansion), incentivize AE 50/50 new vs expansion."
      },
      {
        q: "When should I talk to customers about expansion?",
        a: "Timing: After 6-12 months (customer stable, knowing you). Triggers: Usage high, feature adoption strong, team expanding, engaged (NPS >8). Frequency: Quarterly (casual check-in), renewal time (formal conversation). Proactive: Don't wait for customer to ask (AE/CS proactive outreach). Message: 'You're using X heavily, we have feature Y to help even more' (value-driven, not sales-driven)."
      }
    ],
    videoUrl: ""
  }
];

export default batch206Articles;
