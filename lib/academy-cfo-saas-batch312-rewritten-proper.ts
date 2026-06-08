import { AcademyArticle } from "@/types/academy";

export const batch312Articles: AcademyArticle[] = [
  {
    slug: "technical-support-and-ticket-analytics",
    title: "Technical Support and Ticket Analytics: Optimizing Customer Support Operations",
    description: "Master support ops. Manage tickets, analyze metrics, reduce resolution time.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["technical support", "support tickets", "help desk", "support analytics", "customer support"],
    keyTakeaways: [
      "Support metrics fundamentals: Response time (how fast respond to first message), resolution time (close to resolution), CSAT (customer satisfaction, 1-5 scale), NPS (how likely recommend, -100 to 100). Target: <4 hour first response, <24 hour resolution for urgent, >80% CSAT, >40 NPS. Cost: Support team (£30-50K per person/year), tools (£50-200/month). Benefit: Happy customers (better retention, NRR), operational efficiency (reduce wasted time).",
      "Ticket categorization: By category (product, billing, feature request), by priority (urgent = down time, high = blocker, normal = convenience, low = nice-to-have), by stage (open, in-progress, waiting customer, closed). Use: Track metrics by category (what's causing most tickets?), by priority (urgent handling), identify patterns (what's broken?). Cost: Categorization discipline. Benefit: Understand what's problematic, prioritize fixes.",
      "Analytics and optimization: Most common issues = fix in product (reduce tickets). Escalation patterns = improve training. First response time = hire or tools. Resolution time = improve docs (answer in docs). Measurement: Dashboard (daily review), monthly review (trends), quarterly (strategy). Cost: Tool setup (analytics in help desk platform). Benefit: Identify leverage points (what fix reduces most tickets?)."
    ],
    content: [
      {
        heading: "Building High-Performing Support Operations",
        body: `Managing and optimizing customer support.

**Support fundamentals**

Support channels:
- Email: Asynchronous, lower urgency (24-hour response OK)
- Chat/Zendesk: Medium urgency (2-4 hour response)
- Phone: High urgency (immediate, rarely used in SaaS)
- In-app: Help while using product (lower urgency)
- Community: Peer support, unofficial help

Best practice: Multiple channels (let customer choose), but consolidate to single ticket system (one view of all)

Ticket lifecycle:
1. Create: Customer reaches out (email, chat, form)
2. Receive: Ticket created, assigned to support person
3. Acknowledge: Support person says "got it, working on it"
4. Investigate: Understand issue, gather information
5. Resolve: Provide solution
6. Close: Customer confirms, ticket marked closed

Timeline: <1 hour first response (urgent), <4 hours (normal), <24 hours (low priority)

**Key support metrics**

Response time:
- Definition: How long until first response to customer
- Target: <30 min (urgent), <2 hours (normal), <4 hours (low)
- Importance: Perception is critical (customer worries if no response)
- Improvement: Staffing (coverage during business hours), automation (acknowledgement bots)

Resolution time:
- Definition: Time from first ticket to close
- Target: <2 hours (urgent, production down), <24 hours (high, blocker), <3 days (normal)
- Importance: Customer frustration (longer = more frustrated)
- Improvement: Documentation (reduce investigation time), automation (known solutions), escalation (complex issues to engineers)

First contact resolution (FCR):
- Definition: % of issues resolved in first interaction
- Target: >60% (good support team)
- Improvement: Better documentation, training, empowerment (support can solve more)

Customer satisfaction (CSAT):
- Definition: Post-resolution survey (1-5 scale, or Net Promoter)
- Target: >80% satisfaction (good), >90% great
- Importance: Correlate with retention (satisfied = stay, frustrated = leave)
- Improvement: Faster resolution, better communication, follow-up

Net Promoter Score (NPS):
- Definition: "How likely recommend to peer?" (-100 to 100)
- Segments: Detractors (<7), Passives (7-8), Promoters (9-10)
- Target: >40 (good), >50 (excellent)
- Importance: Predict churn + growth (detractors churn, promoters refer)

Ticket volume and trends:
- Track: Tickets per day, tickets per customer (normalize by size)
- Trend: Should be decreasing (as product matures) or flat (growth cancels improvements)
- Increasing: Red flag (bugs introduced, UX problem, new customer type not familiar)

Example support dashboard:

| Metric | Current | Target | Status |
|---|---|---|---|
| First response time | 1.2 hours | <1 hour | ⚠ |
| Resolution time (avg) | 18 hours | <12 hours | ⚠ |
| First contact resolution | 55% | >60% | ⚠ |
| CSAT | 78% | >80% | ⚠ |
| NPS | 35 | >40 | ⚠ |
| Tickets/day | 25 | <20 | ⚠ |

Action: Understaffed or process inefficiencies (all metrics lagging)

**Ticket categorization and analysis**

Categorize by issue type:

| Category | % of Volume | Urgency | Solution |
|---|---|---|---|
| Product bug | 20% | High | Engineers, hotfix |
| Feature request | 15% | Low | Product roadmap |
| Billing | 10% | Medium | Finance, documentation |
| Setup/onboarding | 25% | Medium | Documentation, templates |
| How-to/feature use | 25% | Low | Documentation, video |
| Account/admin | 5% | Medium | Admin tools |

Analysis:
- High-volume categories = high leverage (fixing one solution helps many)
- Setup + How-to = 50% of volume = improve documentation (reduce tickets 50%)
- Product bug = engineer time (fix issue in product)
- Feature request = prioritize roadmap

Categorize by priority:

| Priority | Response | Resolution | Example |
|---|---|---|---|
| Critical | 15 min | 1 hour | Production down |
| High | 1 hour | 4 hours | Major feature broken, customer blocked |
| Normal | 4 hours | 24 hours | Minor issue, workaround exists |
| Low | 24 hours | 3 days | Feature request, nice-to-have |

By urgency:
- Critical: Direct to on-call engineer
- High: Senior support, escalate if needed
- Normal: Standard support process
- Low: Can batch, lower staff needed

**Optimization strategies**

Strategy 1: Improve documentation (highest ROI)
- Action: Create FAQ, how-to guides, video tutorials
- Impact: Self-service answers 30-50% of questions (reduce support tickets)
- Cost: 20-40 hours initial, 5 hours/month to maintain
- ROI: 1 hour documentation saves 10+ hours support time

Example:
- 25 tickets/day, 25% how-to category = 6 tickets/day
- Create how-to guide (4 hours), reduces tickets to 3/day
- Savings: 3 tickets/day × 15 min average = 45 min/day = 6 hours/week
- Payback: 4 hours investment paid back in first week

Strategy 2: Improve resolution time
- Action: Give support team tools, train on solutions
- Examples: (1) Script library (common answers), (2) admin access (self-service resets), (3) database of solutions (searchable)
- Impact: Reduce resolution time 20-30%
- Cost: Tool setup (2-4 weeks) + training (1 week)
- ROI: Faster resolution = happier customers, higher CSAT

Strategy 3: Improve response time
- Action: Staffing (more people), automation (auto-response + queuing)
- Examples: (1) Hire support person (£35K cost), (2) chatbot for acknowledgment (£50/month)
- Impact: Better response time perception (customer doesn't worry)
- Cost: Varying (hiring vs tools)
- ROI: Reduced churn (perceived responsiveness)

Strategy 4: Escalation and specialization
- Action: Have support tiers (L1 = triage, L2 = complex, L3 = engineering)
- Impact: Complex issues resolved faster (specialized expertise), support team focused on their level
- Cost: Requires training, clear escalation rules
- ROI: Better resolution rate, faster resolution, happier customers

Example escalation:
- L1 (support team): Tries FAQ, known solutions (70% of issues)
- L2 (senior support): Deeper investigation, scripts, configurations (25% of issues)
- L3 (engineering): Code issues, bugs, deep troubleshooting (5% of issues)

**Tools and setup**

Help desk platform (required):
- Options: Zendesk, Freshdesk, Help Scout, Intercom
- Features: Ticket management, knowledge base, reporting, automation
- Cost: £25-100/month (varies by features)
- Integration: Connect to CRM (customer context), billing (payment history)

Knowledge base (included or separate):
- Help scout, Zendesk built-in: Good for simple needs
- Separate tool (Notion): More flexible, better design
- Cost: Included in help desk or £5-20/person/month

Analytics (included):
- Reporting: Tickets/day, resolution time, CSAT, NPS
- Dashboards: Real-time metrics
- Alerts: Flag issues (spike in tickets, low CSAT)
- Cost: Usually included in help desk platform

Chatbot (optional):
- Purpose: Auto-acknowledge, collect info, simple FAQ answers
- Tools: Intercom, Drift, ChatBot
- Cost: £50-200/month
- ROI: Reduce response time perception (auto-acknowledge = customer knows we got it)

**Implementation roadmap**

Month 1: Foundation
- Select tool: Zendesk or Freshdesk (full-featured)
- Setup: Configure channels, ticket routing, categories
- Baseline: Measure current metrics (response, resolution, CSAT)
- Documentation: Create FAQ for top 5 issue categories
- Cost: Setup time (2-3 weeks) + tool

Month 2: Optimization
- Categorization: All tickets categorized consistently
- Analysis: Dashboard showing top issues, trends
- Documentation: Expand to top 10 categories
- Escalation: Define L1/L2/L3 routes
- Staffing: Evaluate if need more support people

Month 3: Continuous improvement
- Monitoring: Daily review of metrics, trends
- Improvements: Implement fixes (documentation, processes)
- Automation: Set up chatbot for acknowledgment
- Training: Support team training on solutions
- Measurement: Track improvement (response time, resolution, CSAT)

**Measuring success**

Initial state (Month 1):
- Response time: 4 hours (slow)
- Resolution: 2 days
- FCR: 50%
- CSAT: 75%
- Tickets/day: 30

Target (Month 6):
- Response time: 1 hour (improved 4x)
- Resolution: 18 hours (5x improvement)
- FCR: 65% (higher with better solutions)
- CSAT: 85% (improved from 75%)
- Tickets/day: 20 (25% reduction, documentation working)

Path to target:
- Month 2: Response 2 hours (auto-acknowledge helps), CSAT 78%
- Month 3: Response 1.5 hours, resolution 24 hours, FCR 60%, CSAT 82%
- Month 4-6: Continued improvement, stabilize at targets

Revenue impact:
- Better CSAT = lower churn (1% improvement = £30K retained per year if £3K ACV, 1000 customers)
- Faster resolution = better perception = higher NPS = more referrals
- Reduced tickets = cost savings (efficiency)
- Total: 5-10% improvement in retention + efficiency

`
      }
    ],
    relatedSlugs: ["customer-success-metrics-and-program-design", "knowledge-management-and-documentation", "metrics-dashboard-design-kpi-tracking", "organizational-structure-and-team-design", "scalable-operations-and-systems-thinking"],
    faq: [
      { q: "What are the key support metrics I should track?", a: "Core metrics: (1) First response time (<1 hour), (2) Resolution time (<12-24 hours depending on priority), (3) CSAT (>80%), (4) NPS (>40), (5) Ticket volume trend (should be flat or declining). Dashboard: Daily monitoring. Monthly/quarterly: Trend analysis. Action: Lagging metrics = staffing issue or process inefficiency." },
      { q: "How do I reduce support ticket volume?", a: "High leverage: Documentation (FAQ, how-to guides) = 50% tickets are how-to or setup (address with docs). Lower leverage: Product improvements (reduce bugs), better onboarding (new customers confused). Measurement: Categorize tickets (what % are how-to?), create docs for top categories, measure reduction. Expected: 20-30% reduction from documentation improvement." },
      { q: "What's the cost of support operations?", a: "Staffing: £30-50K per support person per year. Tools: £50-200/month (help desk, knowledge base). Rule of thumb: 1 support person per 100-200 customers (depends on product complexity, customer type). Small company (20-50 customers): Part-time support. Growth (100+ customers): Full-time support person needed. Mature (500+ customers): Dedicated support team (L1, L2, L3)." }
    ],
    videoUrl: ""
  }
];

export default batch312Articles;