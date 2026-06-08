import { AcademyArticle } from "@/types/academy";

export const batch242Articles: AcademyArticle[] = [
  {
    slug: "account-management-and-expansion-revenue",
    title: "Account Management and Expansion Revenue: Growing Customer Value",
    description: "Master account management. Grow accounts, expand revenue, maximize customer lifetime value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["account management", "expansion revenue", "upsell", "cross-sell", "account expansion", "customer growth", "ACV growth"],
    keyTakeaways: [
      "Account management fundamentals: CAM (Customer Account Manager) owns relationship post-sale (unlike CSM who owns success). CAM responsibility: Relationship health, expansion revenue (upsell, cross-sell), renewal. Ratio: Enterprise 1:5-10 customers (deep relationships), mid-market 1:15-20 (moderate touch). Cost: CAM salary £100-150K + 10-20% variable comp on expansion. Payback: If CAM adds £100K expansion ARR (10% of customer base), cost £120K (salary + comp) payback 14 months (acceptable). Target: Enterprise CAM drives 30-50% NRR expansion (high-touch accounts grow significantly).",
      "Expansion motions: Upsell (move customer to higher tier, more features). Cross-sell (sell new product to existing customer). Price increase (annual raise, typically 5-10%). Seat growth (customer adds users, auto-scaling revenue). Usage growth (customer uses more, pay more if usage-based). Example: Customer £5K/year → upgrade to higher tier (upsell) +£2K → add new product (cross-sell) +£1K → 10% price increase +£0.8K → 3x more users (seat growth) +£1.5K = £10.3K (106% expansion, double lifetime value).",
      "Expansion strategy: Identify expansion triggers (ROI achieved, feature limits hit, seasonal expansion need). Build account maps (identify multiple buyers, expansion paths). Relationship building (regular QBRs, executive sponsorship, community). Compensation: Tie CAM bonus to expansion (NRR improvement, ACV growth). Target: Grow account £100K → £120K over 2 years (20% growth). Cost: CAM time, tools, incentive. Benefit: 20% account growth = 20% revenue growth (compounding, huge impact). Expected: CAM team drives 5-20% NRR improvement depending on maturity."
    ],
    content: [
      {
        heading: "Account Management and Expansion Strategy",
        body: `Growing revenue from existing customers.

**Account management structure**

Responsibilities:
- Relationship: Executive sponsor, regular business reviews
- Expansion: Identify and pursue upsell/cross-sell opportunities
- Renewal: Ensure smooth renewals, improve terms
- Retention: Prevent churn, keep customer healthy

By segment:
| Segment | Title | Ratio | Focus | Comp |
|---|---|---|---|---|
| Enterprise | Account Executive / CAM | 1:5-10 | Expansion + retention | Base + 10-20% variable |
| Mid-market | Account Manager | 1:15-20 | Relationship + some expansion | Base + 5-10% variable |
| SMB | Self-serve + email | 1:500+ | Automated (minimal touch) | N/A |

**Expansion mechanics**

Types of expansion:
1. Upsell: Upgrade to higher tier (more features, capacity)
   - Example: Customer starts "Pro" (£500/mo), upgrades to "Enterprise" (£2K/mo)
   - Trigger: Customer hitting limits, feature requests

2. Cross-sell: New product to existing customer
   - Example: CRM customer → add Analytics product
   - Trigger: Customer mature on core, adjacent need

3. Price increase: Annual raise (5-10%)
   - Example: Renew at £550/mo (up from £500/mo)
   - Trigger: Annual renewal, new tier pricing

4. Seat/user growth: More users = higher MRR
   - Example: Customer grows from 10 to 30 users
   - Trigger: Customer expansion, business growth

5. Usage growth: Variable pricing expands
   - Example: API calls increase, more billing
   - Trigger: Customer success, product adoption

**Expansion strategy**

Account mapping:
1. Identify stakeholders (who uses product, who decides budget)
2. Power users (expand product usage)
3. New use cases (adjacent needs)
4. Geographic expansion (new office, new country)

Example account map (target customer):
- Finance (CFO, controller): Budget, ROI-focused
- Operations (COO): Process efficiency, integration
- Sales (VP Sales): Pipeline visibility, forecast accuracy
- Tech (CTO, systems admin): Implementation, uptime

Expansion paths:
- Finance: Reporting features, analytics
- Operations: Workflow automation, integrations
- Sales: Forecasting, pipeline visibility
- Tech: API, security features

**Expansion execution**

Quarterly business review (QBR) with customer:
- Review: Achievements, ROI, usage trends
- Challenges: What's not working?
- Future: New business goals, new use cases
- Expansion: Identify adjacent needs, upsell opportunities

Example QBR conversation:
"You've doubled team size (10 → 20 users), which typically creates new needs. Let's discuss: (1) Advanced reporting (finance team asked), (2) Workflow automation (ops team mentioned). Both unlock in Enterprise tier. Would exploring either of these make sense?"

CAM compensation:
- Base: £100-120K
- Variable: 10-20% bonus on expansion revenue
- Example: CAM drives £200K expansion across 10 accounts = £20K bonus (10% × £200K)
- Incentive: Aligns CAM with expansion

Expected outcomes:
- NRR improvement: 5-20% (CAM-driven expansion)
- ACV growth: 15-25% over 2 years (account maturity)
- Retention: CAM relationships improve retention

`
      }
    ],
    relatedSlugs: ["net-revenue-retention-and-expansion-metrics", "customer-success-metrics-and-program-design", "sales-pipeline-management-and-forecasting"],
    faq: [
      { q: "When should I hire account managers vs CSMs?", a: "CSM: Post-sale success, onboarding, retention (owns first 90 days). CAM: Post-success expansion, relationship (owns growth). Typical: Small company (CS only), larger (CS + CAM). CAM ratio: Enterprise 1:5-10, mid-market 1:15-20, SMB self-serve. Hire CAM when: Have 10+ enterprise customers or NRR plateau <120%." },
      { q: "How do I identify expansion opportunities?", a: "QBR (quarterly business review): Review customer outcomes, challenges, future plans. Account map: Identify stakeholders, use cases, adjacent needs. Triggers: Feature requests, user growth, new department, seasonal needs. Sell: Upsell (higher tier), cross-sell (new product), price increase, seat growth." },
      { q: "What's CAM compensation?", a: "Base salary: £100-150K (varies by geography, experience). Variable: 10-20% on expansion revenue. Example: Drive £200K expansion = £20K bonus. Bonus calculation: Expansion revenue × commission % = bonus. Incentive: Aligns CAM with company NRR goal." }
    ],
    videoUrl: ""
  }
];

export default batch242Articles;