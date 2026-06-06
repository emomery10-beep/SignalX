import { AcademyArticle } from "@/types/academy";

export const batch41Articles: AcademyArticle[] = [
  {
    slug: "data-driven-decision-making-analytics",
    title: "Data-Driven Decision Making: Using Analytics to Drive Business Strategy",
    description: "How to collect, analyze, and act on data to make better business decisions and improve financial outcomes.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "data analytics",
      "business intelligence",
      "decision making",
      "data-driven decisions",
      "analytics strategy",
      "metrics analysis",
      "business intelligence tools",
      "data interpretation",
      "analytical thinking",
      "performance metrics"
    ],
    keyTakeaways: [
      "Most companies have data but don't use it: 70% of metrics go unexamined; starting with 5-7 core metrics (ARR, churn, CAC, payback, NRR) is better than tracking 50 metrics nobody looks at",
      "Data quality matters more than data volume: Garbage in = garbage out; spend 20% of analytics time on data validation (is this number accurate?) vs. 80% on visualization",
      "Decision velocity improves with dashboards: Moving from weekly manual reports (3 days to create) to daily dashboards (2 seconds to view) enables faster decision-making and course corrections"
    ],
    content: [
      {
        heading: "Building a Data Culture Around Key Metrics",
        body: `Most SaaS founders suffer from analysis paralysis: Too many metrics, unclear which ones matter, unsure how to act on findings.

The solution: Start with 5-7 core metrics, track them religiously, and use them to inform decisions.

**Core Metrics for Every SaaS (non-negotiable)**:

1. **ARR/MRR**: Current annual/monthly recurring revenue (revenue health)
2. **Growth Rate**: MoM or YoY growth % (growth trajectory)
3. **Churn Rate**: % of customers lost monthly (retention health)
4. **CAC**: Cost to acquire one customer (efficiency)
5. **NRR**: Net revenue retention % (expansion vs. churn)

These 5 metrics tell the story of your business:
- Growing ARR? → Business is scaling
- High churn? → Retention issues need fixing
- High CAC? → Acquisition is inefficient, needs optimization
- Low NRR? → Not expanding existing customers, missing growth lever
- Declining growth rate? → Market saturation or execution problems

**Secondary Metrics** (important but not core):

6. **Payback Period**: How long to recover CAC (unit economics health)
7. **Gross Margin**: Revenue minus COGS (profitability/scalability)

These 7 metrics provide complete visibility:
- Revenue health (ARR)
- Growth trajectory (growth rate)
- Customer retention (churn, NRR)
- Acquisition efficiency (CAC, payback)
- Unit economics (margins)

Most decisions flow from these 7. Don't track 50 metrics and forget the core 7.

**Implementing Metrics Discipline**:

Monthly review (60 minutes):
- CFO prepares dashboard (ARR, growth rate, churn, CAC, NRR, payback, margins)
- Leadership team reviews (15 min for numbers, 30 min for analysis, 15 min for decisions)
- Document decisions: \"If churn stays above 5% for 2 months, we'll invest £200K in retention\"

Weekly operational review (30 minutes):
- Sales team: Pipeline, conversion rate, forecast
- CS team: Churn, expansion revenue, NPS
- Product team: Feature adoption, bugs
- Finance: Cash, burn rate, payroll

This rhythm ensures metrics aren't just collected but acted upon.

**From Metrics to Decisions**:

The metric identifies a problem. The decision defines the response.

Example:
- Metric: CAC increased from £10K to £15K (50% increase)
- Problem diagnosis: Paid advertising channels degraded, CPM increased
- Decision: Shift marketing budget from paid ads to content marketing
- Timeline: 30 days
- Expected impact: CAC back to £12K
- Metric tracking: Measure CAC weekly for 3 months

This creates accountability: You made a decision, you measured its impact.

**Avoiding Analysis Paralysis**:

Many companies get stuck in analysis:
- \"We need to understand why churn increased before acting\"
- Result: Months of analysis, no action, churn continues climbing

Better approach: Act on hypothesis, measure results, adjust.

- Hypothesis: Churn increased due to product bugs
- Action: Hire engineer, reduce bug rate
- Metric: Measure churn weekly
- Timeline: 2 months
- Result: Churn drops from 5% to 3.5% → hypothesis confirmed, continue investing
  OR Churn stays at 5% → hypothesis wrong, explore other causes

This fast iteration (hypothesis → action → measurement → learning) is better than perfect analysis with no action.'`
      }
    ],
    relatedSlugs: [
      "saas-metrics-dashboard-design",
      "unit-economics-saas",
      "forecasting-accuracy-planning",
      "business-intelligence-analytics",
      "financial-reporting-metrics"
    ],
    faq: [
      {
        q: "How many metrics should I track?",
        a: "5-7 core metrics maximum (ARR, growth, churn, CAC, NRR, payback, margins). More than 10 becomes noise. Focus on actionable metrics only."
      },
      {
        q: "How often should I review metrics?",
        a: "Weekly operational (sales, CS, product focus). Monthly strategic (board-level decisions). Real-time dashboards for daily reference."
      },
      {
        q: "What's the most important metric?",
        a: "Depends on stage. Early: churn and NRR (product-market fit). Growth: CAC and payback (unit economics). Late: margins and profitability."
      },
      {
        q: "How do you prevent metrics from becoming vanity metrics?",
        a: "Only track metrics where you have a clear action if it changes. If churn increases, what do you do? If you don't know, don't track it."
      },
      {
        q: "Should I track metrics in spreadsheets or dashboards?",
        a: "Dashboards (real-time, automated). Spreadsheets are error-prone and outdated by next day. Use tools (Tableau, Looker, even Google Data Studio)."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "competitor-intelligence-positioning",
    title: "Competitive Intelligence & Market Positioning: Staying Ahead of Competition",
    description: "How to track competitors, analyze their strategies, and position your company for competitive advantage.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "competitive intelligence",
      "competitor analysis",
      "market positioning",
      "competitive advantage",
      "competitor benchmarking",
      "market analysis",
      "strategic positioning",
      "competitive landscape",
      "differentiation strategy",
      "market positioning"
    ],
    keyTakeaways: [
      "Monitor 3-5 direct competitors continuously: pricing, features, customer count (estimate), messaging, hiring; set up alerts for web changes, job postings, funding announcements",
      "Competitive advantage lasts 6-24 months: Technology advantage fades as competitors copy; build sustainable advantages (customer relationships, switching costs, brand) that improve over time",
      "Pricing is the visible signal of market positioning: If competitors are 20% more expensive, they perceive themselves as premium; if 20% cheaper, they're competing on value"
    ],
    content: [
      {
        heading: "Building Competitive Intelligence Systems",
        body: `Most founders ignore competitors or obsess over them. The right approach: Systematic monitoring that informs strategy without paralyzing execution.

**Identify Your Competitive Set**:

Direct competitors: Products solving the same problem for the same customer.

Example: Slack's direct competitors were Microsoft Teams, Telegram, Discord (group chat/messaging).

Indirect competitors: Different products solving the same underlying need.

Example: Slack's indirect competitors were email, in-person meetings (communication alternatives).

For your SaaS, list:
- 3-5 direct competitors (strongest, most similar)
- 5-10 indirect competitors (alternative solutions)

Focus your intelligence on direct competitors (they're stealing your customers).

**Competitive Monitoring Framework**:

Create a spreadsheet tracking 3-5 direct competitors:

| Metric | Company A | Company B | Company C | Your Company |
|--------|----------|----------|----------|-------------|
| Pricing | £99-999/mo | £49-499/mo | £199/mo | £99-499/mo |
| Features | 50+ | 20 | 30 | 40 |
| Customers (est) | 5,000+ | 10,000+ | 2,000 | 3,000 |
| GTM | Self-serve + enterprise | Self-serve | Enterprise | Balanced |
| Funding | £100M+ | £50M | £10M | £15M (Series B) |
| Growth est | 30% | 50% | 20% | 40% |
| Market positioning | Premium | Value leader | Enterprise | Balanced/hybrid |

Update quarterly. This gives strategic context:
- Pricing trends: Are competitors moving premium or value?
- Feature gaps: What features are competitors adding?
- Growth rates: Who's winning the market?
- Go-to-market: Are competitors shifting strategies?

**Pricing Intelligence**:

Competitor pricing reveals positioning:

Premium positioning (higher pricing):
- Slack: Premium features, advanced support, enterprise focus
- Pricing: £99-500/month
- Message: \"Best-in-class, invest in us\"

Value positioning (lower pricing):
- Discord: Free tier (large) + premium tier at lower cost
- Pricing: Free, then £10/month
- Message: \"Affordable, accessible to everyone\"

Balanced positioning (market price):
- Teams: Mid-range pricing, bundled with enterprise solutions
- Pricing: Included in enterprise bundles or £5-10/user/month standalone
- Message: \"Good value, integrated with your ecosystem\"

If competitors are all premium and you're value, you're explicitly competing on affordability (defensible if you have unit economics to support it).

**Tracking Competitor Activity**:

Tools for monitoring:

1. **Price tracking**: Manually check pricing quarterly (Capterra, G2, company website)
2. **Feature tracking**: Follow release notes, customer-facing changelogs (RSS feeds)
3. **Job postings**: Monitor LinkedIn/Indeed for new hiring (signals growth, product focus)
4. **Funding**: Track Crunchbase for funding rounds (capital influx = growth investment)
5. **News**: Set up Google Alerts for competitor mentions, press releases
6. **Customer reviews**: Monitor G2, Capterra for customer sentiment and feature requests

Weekly check (15 minutes): Scan alerts, note any major changes
Quarterly deep dive (2 hours): Review all monitoring data, update strategy

**Using Competitive Intelligence to Inform Strategy**:

Observations should drive decisions, not paranoia.

Example analysis:
- Observation: Competitor A just raised £50M, growing 60% YoY
- Question: Are they cannibalizing our market?
- Investigation: Their focus is enterprise (our focus is SMB/mid-market)
- Decision: No immediate threat, but watch for downmarket expansion
- Action: Accelerate SMB product improvements (strengthen defensibility)

vs.

- Observation: Competitor B launched feature similar to our roadmap
- Question: Should we copy them?
- Investigation: Their implementation is basic, ours is superior
- Decision: Launch as planned, emphasize differences
- Action: Accelerate launch, position as better alternative

Intelligence should reduce uncertainty, not create panic.

**Competitive Positioning Statement**:

Use competitive intelligence to craft positioning:

\"We're the [category] for [target customer] who care about [key value]. Unlike [competitor], we [differentiation]."

Example positioning:
\"We're the customer data platform for SaaS companies who care about retention. Unlike segment.com (expensive, bloated), we're focused and affordable for growing companies.\"

This positioning guides everything:
- Product: Focus on retention use cases, not general analytics
- Pricing: Undercut Segment on price (£99-499 vs. £1,200+)
- Marketing: Position against bloatware
- Sales: \"Too expensive for Segment? Try us.\"

Strong positioning comes from understanding competitive landscape and choosing distinct territory.'`
      }
    ],
    relatedSlugs: [
      "pricing-strategy-saas",
      "competitive-pricing-analysis",
      "market-positioning-strategy",
      "product-differentiation",
      "growth-metrics-benchmarking"
    ],
    faq: [
      {
        q: "How often should I monitor competitors?",
        a: "Weekly scanning (5 min), monthly analysis (30 min), quarterly deep dive (2 hours). Don't obsess, but don't ignore."
      },
      {
        q: "Should I copy competitor features?",
        a: "Copy proven features, add differentiation. Don't copy everything (makes you generic). Copy strategically to close gaps, innovate to win."
      },
      {
        q: "How do you estimate competitor customer count?",
        a: "Use public data: G2 reviews, Capterra reviews, LinkedIn followers (rough correlation). For privately held, estimate from funding/growth rate."
      },
      {
        q: "What if a competitor is growing faster than me?",
        a: "Investigate why. Better product? Lower price? Better marketing? Understand their advantage, then either copy, differentiate, or find different niche."
      },
      {
        q: "How much should competitive intelligence influence strategy?",
        a: "Input, not driver. Use competitive intelligence to inform positioning and identify gaps, but focus on customer problems, not competitor moves."
      }
    ],
    videoUrl: ""
  }
];

export default batch41Articles;