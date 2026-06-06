import { AcademyArticle } from "@/types/academy";

export const batch154Articles: AcademyArticle[] = [
  {
    slug: "scaling-customer-support-operations",
    title: "Scaling Customer Support Operations: Delivering Great Support Without Breaking Budget",
    description: "Master support operations. Scale support team, optimize costs, measure quality, and maintain satisfaction as you grow.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer support",
      "support operations",
      "support team",
      "support costs",
      "ticketing system",
      "support metrics",
      "response time",
      "support quality",
      "support scaling",
      "first contact resolution"
    ],
    keyTakeaways: [
      "Support cost as % of revenue: Should improve with scale. Early (£1M ARR): 10-15% of revenue. Mature (£10M ARR): 3-5%. Reason: Fixed costs (tools, training) spread over more customers. Lever: Automation (chatbot 30% of questions), knowledge base (reduce repeat questions), tier-based (free/email, premium/chat). Budget £50-100K/year setup, saves £100K+/year in headcount.",
      "Support metrics to track: (1) Response time (first response <1 hour healthy), (2) Resolution time (close ticket in <24 hours typical), (3) First-contact resolution (resolve on first response = good), (4) CSAT (customer satisfaction, target >85%), (5) NPS (net promoter score, support contribution). Monitor monthly, improve annually.",
      "Tier-based support: Tier 1 (self-service/bot): Free, fast. Tier 2 (email): Included in product. Tier 3 (chat/phone): Premium tier extra cost. Customers choose based on needs/budget. Company: Reduces headcount (less email handling), improves revenue (premium customers pay for faster support)."
    ],
    content: [
      {
        heading: "Support Cost Structure and Scaling",
        body: `How support costs change with company size.

**Support Costs as % of Revenue**

| Stage | ARR | Customers | Support Team | Annual Cost | % of Revenue |
|-------|-----|-----------|---|---|---|
| Early | £1M | 100 | 1 FTE | £50K | 5% |
| Growth | £5M | 500 | 2 FTE | £90K | 1.8% |
| Scale | £10M | 1000 | 3 FTE | £130K | 1.3% |
| Mature | £50M | 5000 | 12 FTE | £500K | 1% |

Pattern: Costs grow slower than revenue (leverage).

Key drivers:
- Fixed costs (tools, management): Spread over more customers
- Automation (chatbot, KB): Reduces per-customer cost
- Efficiency (team improves): Handles more tickets per person

**Early Stage Support (0-£1M ARR)**

Setup: Founder or 1 part-time support person
- Hours: 5-10 hours/week
- Tools: Email + spreadsheet tracking
- Cost: £25K part-time salary + tools (£5K/year)

Approach:
- Response time: Within 24 hours
- Channel: Email only
- Ticket tracking: Basic spreadsheet

Metrics:
- Tickets/day: 5-10
- Resolution time: 1-2 days
- Customer satisfaction: Not formally tracked

**Growth Stage Support (£1-5M ARR)**

Setup: 1-2 full-time support people + manager
- Hire: Dedicated support person (1 FTE)
- Tools: Zendesk or Intercom (£500-1000/month)
- Cost: £60K salary + £10K tools + 20% overhead = £85K

Approach:
- Response time: Within 4 hours (SLA improvement)
- Channels: Email + in-app chat
- Ticket tracking: Support ticketing system

Metrics:
- Tickets/day: 20-30
- Resolution time: 4-8 hours (faster)
- Customer satisfaction: 75-85% (track formally)

**Scale Stage Support (£5-50M ARR)**

Setup: 3-5 support people + manager + lead
- Team: 3 support specialists (1 per shift for coverage)
- Manager: 1 support manager
- Specialization: Tier 1 (triage), Tier 2 (technical), Tier 3 (escalation)
- Cost: £3 people × £50K + manager £60K + tools £2K/month = £240K

Approach:
- Response time: <1 hour (fast)
- Channels: Email, chat, phone
- Ticket tracking: Advanced system with workflows

Metrics:
- Tickets/day: 100+
- Resolution time: <8 hours (85% of tickets)
- Customer satisfaction: 85%+

**Cost Optimization Levers**

Automation (chatbot):
- Handles 30% of questions (FAQs, password reset, billing)
- Cost: £200/month SaaS
- Savings: 0.5 FTE per year = £25K
- ROI: 125x

Knowledge base:
- Reduce repeat questions 20-30%
- Cost: £10K setup, £2K/year maintenance
- Savings: 0.3 FTE per year = £15K
- ROI: 1.5x (good, worth it)

Tiered support:
- Premium tier pays extra for faster support
- Revenue: 10% of customers × £1000/year extra = £10K
- Reduces support cost (free tier via KB + bot, premium via support)

Outsourcing:
- Contract support for overflow
- Cost: £20/ticket (vs £40 internal)
- Use for 20% of tickets
- Savings: 10% cost reduction overall

`
      },
      {
        heading: "Support Operations and Metrics",
        body: `Running efficient support operations.

**Key Metrics**

Response time (first response):
- Target: <1 hour (good SaaS standard)
- Healthy: 85%+ of tickets <1 hour
- Track: SLA dashboard

Resolution time (time to close):
- Target: <24 hours (most tickets)
- Healthy: 80% of tickets <24 hours
- Track: Average by ticket type

First-contact resolution (FCR):
- Target: >50% (customer resolved on first contact)
- Healthy: 60%+
- Impact: High FCR = low cost (1 contact vs 2-3)

Customer satisfaction (CSAT):
- Target: >85%
- Method: Post-ticket survey (1-5 star)
- Healthy: 4+ stars average

NPS (Net Promoter Score):
- Target: >50 (very good)
- Healthy: 40+ (acceptable)
- From support: "Would you recommend this support?"

**Ticket Categorization**

Track ticket types (understand support load):

| Type | Examples | Volume | Avg Time | Solution |
|------|----------|--------|----------|----------|
| Password reset | "Forgot password" | 20% | 5 min | Automation (self-service) |
| Feature question | "How do I...?" | 30% | 15 min | Knowledge base |
| Bug report | "Feature broken" | 15% | 1 hour | Engineering coordination |
| Billing | "Charge wrong" | 10% | 20 min | Automation (billing system) |
| Account issue | "Can't login" | 15% | 30 min | Account support workflow |
| Technical | Complex issues | 10% | 2 hours | Specialist escalation |

Insight: 50% of tickets (password + billing) automatable.

**Support SLAs and Tiers**

Free tier:
- Response: 24-48 hours
- Resolution: Best effort
- Channels: Email only

Pro tier (included):
- Response: <4 hours
- Resolution: <24 hours
- Channels: Email + chat

Enterprise tier:
- Response: <1 hour
- Resolution: <4 hours
- Channels: Email + chat + phone + dedicated CSM

Pricing:
- Free: Included
- Pro: Included in £500/month plan
- Enterprise: Added cost (£1000/month support, separate from platform)

`
      },
      {
        heading: "Support Team Structure and Culture",
        body: `Building a support team that customers love.

**Support Hiring**

Traits to look for:
- Customer empathy (genuine desire to help)
- Problem-solving (figures out solutions)
- Communication (clear, friendly tone)
- Patience (handles frustrated customers)
- Technical basics (understands products, learns quickly)

Avoid:
- "Just a job" mentality (won't go extra)
- Poor written communication (customer facing)
- Impatience with repetitive questions

**Support Training**

Product training:
- Month 1: Deep dive into product (all features)
- Month 2: Customer workflows (how do customers use product)
- Month 3: Advanced scenarios (complex use cases)

Customer empathy training:
- Understand customer context (why do they need this feature?)
- De-escalation (frustrated customer = calm approach)
- Ownership (customer problem = my problem)

Tools training:
- Ticketing system (Zendesk, Intercom)
- Knowledge base (search, update articles)
- CRM (customer history, account info)

**Support Culture**

Good culture:
- Empower support to make decisions (refund on the spot if needed)
- Celebrate wins (customer saved, issue resolved)
- Cross-functional (product hears from support about feature requests)
- Career growth (support leads to CS, product, or other roles)

Bad culture:
- Support as lowest status (dismissive)
- No autonomy (every decision needs approval)
- Ignored feedback (support sees bugs, product doesn't care)

**Retention**

High turnover = low quality (new reps slower).

Target: Keep team 2+ years average.

Levers:
- Competitive salary (benchmark vs industry)
- Career path (support → specialist → manager)
- Work-life balance (not on-call 24/7)
- Autonomy (empower decisions)
- Tools (good system, not spreadsheets)

`
      },
      {
        heading: "Using Support for Product Improvement",
        body: `Support feedback drives product decisions.

**Support as Product Input**

Support team hears customer feedback continuously:
- "This feature is confusing"
- "Why isn't there an integration with X?"
- "Competitors have feature Y"
- "This bug happens to everyone"

Product should listen:
- Monthly support review (top issues, patterns)
- Feedback loop (support → product → roadmap)
- Bugs (prioritize high-impact support tickets)

Example impact:
- Support reports: 20% of tickets = password reset
- Product action: Build password reset in app (self-service)
- Result: Support time -20%, customer satisfaction up

**Measuring Support's Impact on Revenue**

Support affects:
- Churn: Great support = lower churn
- Expansion: Supported customers = happier = more likely to expand
- NPS: Support quality = customer satisfaction = NPS

Example:
- Support quality improves (CSAT 75% → 85%)
- Churn improves 1% (2% → 1% monthly)
- On 500-customer base: 5 customers saved × £1K = £5K MRR improvement
- Annualized: £60K impact (worth the investment in support)

**Support Escalation Matrix**

Map issues to resolver:

Tier 1 (support agent):
- Password resets, billing questions, basic troubleshooting
- Can resolve 60% of tickets

Tier 2 (support specialist):
- Technical issues, API questions, custom implementation
- Can resolve 30% of tickets

Tier 3 (engineering):
- Bugs, feature requests, complex technical issues
- 10% of tickets need engineering input

Escalation criteria:
- If Tier 1 can't resolve after 1 hour → escalate to Tier 2
- If Tier 2 can't resolve after 2 hours → escalate to engineering

SLA: Escalate within SLA time (never leave ticket hanging).

`
      }
    ],
    relatedSlugs: [
      "customer-success-metrics-and-program-design",
      "churn-analysis-retention-improvement",
      "unit-economics-ltv-cac-payback",
      "metrics-dashboard-design-kpi-tracking",
      "department-budgeting-and-headcount-planning"
    ],
    faq: [
      {
        q: "How much should I spend on support?",
        a: "Early (£1M ARR): 5-10% of revenue. Growth (£5M): 2-3%. Mature (£10M+): 1-2%. Improve through: Automation (chatbot, KB reduce 20-30%), tiering (premium support = extra revenue), outsourcing (overflow). Budget £50-100K setup (tools, KB), saves £100K+/year in headcount."
      },
      {
        q: "What support metrics should I track?",
        a: "Top 5: (1) Response time (target <1 hour), (2) Resolution time (target <24 hours), (3) First-contact resolution (target >50%), (4) CSAT (target >85%), (5) NPS contribution (support's impact). Monitor monthly, improve quarterly. Track by ticket type to identify automation opportunities."
      },
      {
        q: "Should I hire support or outsource?",
        a: "Hybrid best: Hire in-house for core support (builds culture), outsource overflow (cost savings). Outsource 20-30% of volume (handle peaks). Cost: Internal £40-50K/year per person, outsource £20/ticket. Use outsource for: Tier 1 simple questions, off-hours coverage, seasonal spikes."
      },
      {
        q: "How do I reduce support costs as I scale?",
        a: "Levers: (1) Automation (chatbot 30% tickets), (2) Self-service KB (reduce 20-30%), (3) Tier-based (premium for fast support, free for email), (4) Outsourcing (overflow), (5) Product fixes (reduce bug-related tickets). Combination can reduce cost 40-50% while improving quality."
      }
    ],
    videoUrl: ""
  }
];

export default batch154Articles;
