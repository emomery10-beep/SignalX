import { AcademyArticle } from "@/types/academy";

export const batch191Articles: AcademyArticle[] = [
  {
    slug: "customer-advisory-board-and-voice-of-customer",
    title: "Customer Advisory Board and Voice of Customer: Building Product Together",
    description: "Master customer feedback. Build advisory boards, gather insights, and validate product decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "customer advisory board",
      "voice of customer",
      "customer feedback",
      "customer interviews",
      "advisory board",
      "customer insights",
      "product validation",
      "customer council",
      "feedback collection",
      "customer collaboration"
    ],
    keyTakeaways: [
      "CAB structure: 8-12 customers representing different segments (SMB, mid-market, enterprise; by use case; by tenure). Meet 2x/year (spring + fall planning cycles). Members: Pay expenses (hotel, meals £2K per customer per meeting). In return: Product input, early feature access, case studies. ROI: £10 customers × £2K = £20K investment. Value: Insights prevent £500K wasted on wrong features, case studies drive £2M new revenue (100x ROI).",
      "Customer interviews: Do 5-10 per quarter (15 min calls, ask open-ended questions). Ask: What problems unsolved? What features missing? What would make you expand? How are you using product vs intent? Synthesize: Pattern analysis (80% ask for feature X = real need vs 1 person = nice to have). Don't ask: 'Do you want feature Y?' (biases toward yes). Instead: 'What's your biggest pain?' (unprompted feedback).",
      "Voice of Customer program: Centralized feedback system. Tools: Segment (customer data), Intercom (user feedback), Typeform (surveys). Track: Feature requests by frequency, impact on churn, CAC/LTV. Quarterly synthesis: \"Top 10 requests this quarter\". Roadmap: Top 3 features make next quarter plan, communicate back to customers (\"You asked, we listened\"). Outcome: Customer retention improves 1-2% (more engaged, feel heard)."
    ],
    content: [
      {
        heading: "Customer Advisory Board Setup",
        body: `Building a formal advisory group.

**CAB Structure**

Typical size: 8-12 customers
- Not too small (lack diversity), not too large (hard to manage)
- Diverse: Different segments, use cases, tenure, company sizes

Composition example (12-member CAB):
- 3 Enterprise (£50K+/year): Strategic customers, high influence
- 4 Mid-Market (£10-50K/year): Balanced customer base
- 3 SMB (£1-10K/year): Price-sensitive, volume segment
- Mix by industry: 4 in vertical A, 3 in vertical B, 2 in vertical C, 3 other
- Mix by tenure: 2 <6 months (new), 4 6-18 months (established), 6 >18 months (loyal)
- Mix by use case: Finance ops (4), FP&A (3), Audit/Controls (2), Other (3)

Selection criteria:
- Engaged customers (frequent logins, high feature adoption)
- Willing to give feedback (responsive to surveys, participate in calls)
- Diverse perspectives (different problems, industries, company sizes)
- Strategic importance (either revenue or influence in market)

Meeting cadence:
- 2 meetings per year (spring planning + fall strategic) = 4 hours each
- Quarterly check-in calls (optional, optional, 30 min with random subset)
- Annual strategy summit (optional, full day with all customers + board)

Compensation:
- Pay travel expenses (hotel, meals): £1K-2K per meeting
- Provide meals and beverages at meeting
- Early access to new features (before general release)
- Discounted pricing (10-15% for participation)
- Brand recognition (logo on website, case study, press)
- Some pay honorarium (£500-1K per meeting, less common for SaaS but used in enterprise)

Typical cost:
- 12 customers × 2 meetings/year × £2K per meeting = £48K/year
- Plus internal time (product manager, CEO involvement): 50 hours/year = £5K
- Total: ~£50K/year

ROI:
- Prevents wrong product investments (saves £500K+)
- Improves churn 1-2% (engaged customers stay longer) = £100K+ value
- Case studies and references drive 5-10 new deals = £500K+ revenue
- Total value: £1M+
- ROI: 20x (£50K investment → £1M value)

**CAB Meeting Structure**

Spring Planning Meeting (4 hours):
1. Welcome and state of company (30 min)
   - CEO shares: Revenue growth, major wins, challenges
   - Product vision: Where are we going?

2. Current roadmap review (45 min)
   - Product manager presents: Q2-Q3 planned features
   - Customer feedback: "We heard you ask for X, building in Q2"

3. Customer breakout discussions (60 min)
   - Small groups (2-3 customers + product team)
   - Deep-dive on specific pain points or features
   - Capture feedback on design, functionality, launch timeline

4. Feedback synthesis and prioritization (45 min)
   - What are the top 3 problems customers face?
   - What features matter most?
   - Where should we focus?

5. Next steps and closing (30 min)
   - Commit: "Based on your input, we're building X, Y, Z"
   - Timeline: When will customers see results?
   - Invite next advisory call

Fall Strategic Summit (4 hours):
1. Year-end review and demo (45 min)
   - Show progress: What shipped this year
   - Demo: Show new features customers requested
   - Celebrate: Show usage metrics (adoption of features)

2. Strategic direction (60 min)
   - CEO: Market outlook, competitive landscape, long-term vision
   - Board member: Strategic priorities, investment areas
   - Customers: Questions, reactions, opportunities

3. Customer share-outs (45 min)
   - 3-4 customers present: How are they using product?
   - Success stories: Real examples of value
   - Challenges: What's hard? What could be easier?

4. Feedback and forward-looking (30 min)
   - Next 12 months: What should we be thinking about?
   - Emerging needs: Market changes, competitive moves

**CAB Management**

Recruitment:
- Identify candidates (high-usage, engaged, strategic accounts)
- Personal outreach from CEO (not salespeople)
- Explain value: "We want your input, exclusive access, help shape product"
- Ask 1-year commitment (can renew or rotate)

Retention:
- Keep engaged: Quarterly email updates on progress
- Deliver on commitments: Feature you heard about actually ships
- Recognize: Mention customers' input when announcing features
- Surprise: Extend discounts, gift early access to new products
- Rotate: After 2 years, rotate out some members (keep fresh perspectives)

Confidentiality:
- NDA: Customers sign agreement (protect roadmap, strategy)
- Discretion: Don't share competitors' info or specific customer data across board

Governance:
- Document decisions: "Based on CAB input, we're prioritizing X"
- Track impact: "Feature X shipped because customer requested it, now used by 60% of customers"
- Report back: "You asked for this in Feb, shipped in June, adoption 45%"

`
      },
      {
        heading: "Voice of Customer Program",
        body: `Systematizing customer feedback collection and synthesis.

**Feedback Collection Methods**

Customer interviews (quarterly):
- Goal: 5-10 calls per quarter (20-40 per year)
- Duration: 15-30 minutes
- Format: Open-ended questions, listen more than talk
- Examples:
  - "What problems are you trying to solve?"
  - "What features would make you expand usage?"
  - "What's most frustrating about the product?"
  - "How do you measure success with our product?"

In-app surveys:
- Goal: Capture moment-of-use feedback
- Tool: Typeform, Intercoms, or native survey
- Example: After completing a task, ask "Was this easy?" (yes/no)
- Frequency: 2-4 surveys per customer per year (don't over-survey)
- Focus: Specific features, not satisfaction (NPS is separate)

NPS (Net Promoter Score):
- Quarterly survey: "How likely to recommend us? 0-10"
- 9-10 = Promoters, 7-8 = Passives, 0-6 = Detractors
- NPS = % Promoters - % Detractors
- Follow-up: Ask "why?" to understand drivers
- Target: >50 NPS (excellent), >40 (good), <0 (bad)

Churn interviews:
- Goal: Exit interviews with churned customers
- Duration: 20 min
- Ask: "Why are you leaving?" "What would make you stay?" "What did competitor offer?"
- Track: Reasons for churn (feature gaps, price, product fit, service)
- Value: Identify patterns (80% leave for feature X = real problem)

Quarterly business reviews (for larger customers):
- Goal: Understand how customer uses product, what works, what doesn't
- Duration: 60 minutes
- Participants: CS team + product manager + customer
- Agenda: Recap usage metrics, ask open-ended questions, understand ROI
- Capture: Feedback on features, roadmap ideas, expansion opportunities

Usage analytics:
- Track: Which features used most, least?
- Insight: Feature gaps shown by low adoption (customers want, but missing)
- Example: 20% of customers turn on feature X = low feature adoption = maybe missing, or unused
- Question: Ask customers why (feedback interview)

**Feedback Organization**

Centralized tool (choose one):
- Slack channel: #voice-of-customer (capture feedback in real-time)
- Spreadsheet: Track feedback by source, date, customer, topic
- Product management tool: Aha, ProductBoard, Notion
- CRM: Salesforce, HubSpot (track in customer record)

Data structure:
- Customer name / ID
- Date received
- Source (interview, survey, support ticket, usage)
- Feedback (quote or summary)
- Topic (feature request, bug, enhancement, workflow)
- Priority (must-have, nice-to-have, research)
- Frequency (how many customers mentioned?)
- Impact (churn risk? revenue impact?)

Synthesis (quarterly):
- Review all feedback from quarter
- Group by topic (feature requests, pain points, workflows)
- Rank by frequency + impact
- Create list: "Top 10 feature requests this quarter"
- Identify patterns: "80% ask for X, 60% ask for Y, 30% ask for Z"

**Roadmap Translation and Communication**

Translating feedback to features:
- Top 10 requests: Which can we build?
- Feasibility: Engineering effort (quick win vs complex)
- Impact: How many customers want? How much would it improve churn?
- Priority: Quick wins (high impact, low effort) first

Example:
- Feedback: "Customers want better reporting (5 customers) + export to Excel (8 customers)"
- Feasibility: Excel export = 1 week, advanced reporting = 4 weeks
- Impact: Export = 25% churn reduction (easy to use elsewhere), reporting = 5% (nice to have)
- Decision: Do export in Q2 (quick win), research advanced reporting for Q3

Communicating back:
- "You asked for X, we heard you. Building in Q2, here's why..."
- "You asked for Y, considering for Q4. Here's why taking longer..."
- "You asked for Z, not on roadmap yet. Here's why..."
- Include: Timeline, rationale, link to customer feedback

Celebration:
- Feature ship: "You requested this feature. Here it is. You were right to ask."
- Measure adoption: "This feature you requested: 60% adoption in first month"
- Case study: "Customer story: How feature X helped achieve Y"

**Turning Voice of Customer into Action**

Churn prevention:
- Identify: Customer feedback shows feature X is pain point
- Risk: 20% of customers at risk because of this
- Action: Prioritize feature X
- Measure: After launch, track if churn improves

Expansion opportunities:
- Feedback: "Customers want to use for use case B (different from current)"
- Opportunity: New revenue stream
- Action: Build features for use case B, market to those customers
- Measure: Revenue from new use case

Pricing decisions:
- Feedback: "Price is too high" vs "You're underpriced, we'd pay more"
- Insight: Willingness to pay
- Action: Test price increase (10-15%), measure impact
- Measure: Churn, new customer acquisition, revenue impact

Product positioning:
- Feedback: How customers describe your product vs how you market it
- Gap: Messaging doesn't match customer reality
- Action: Adjust marketing, website, pitch
- Measure: Messaging resonance, conversion rates

`
      },
      {
        heading: "Managing Feedback and Building Culture",
        body: `Creating a feedback-driven organization.

**Team Involvement**

Who participates in customer interviews:
- Product team: Every feature designer should do interviews
- Engineering: Lead engineer attends quarterly QBRs
- Sales: Attends CAB meetings (hear feedback firsthand)
- Marketing: Attends strategic summits (understand positioning)
- CEO/Founder: Attends CAB, personally does interviews

Why: Organizations that hear customer voice directly are more customer-centric.

Impact: Engineers who hear "I love this feature" or "This is broken" more motivated than if told via email.

**Feedback Prioritization Framework**

Impact × Frequency / Effort = Priority

Example feedback scoring:
- Export to Excel: Frequency 8 (customers), Impact 5 (would reduce churn), Effort 1 week = 40
- Advanced reporting: Frequency 4, Impact 3, Effort 4 weeks = 3
- API access: Frequency 2, Impact 4, Effort 8 weeks = 1
- Mobile app: Frequency 6, Impact 2, Effort 12 weeks = 1

Priority: Export first (40), then advanced reporting (3), then API/mobile

**Feedback-Driven Culture**

Quarterly showcase:
- Share customer feedback with entire company
- "Here's what customers asked for this quarter"
- "Here's why we chose these 3 priorities"
- "Here's what we shipped based on your feedback"
- Impact: Everyone feels connection to customers

Metrics to track:
- Monthly: Feedback submissions (capture activity)
- Quarterly: Feature requests by category (understand priorities)
- Quarterly: % of shipped features from customer requests (accountability)
- Annual: Customer satisfaction with feature roadmap (feedback on process)

Target:
- >50% of shipped features from customer requests (customer-driven)
- Customers feel heard (NPS correlates with feature adoption)
- Churn reduces (more engaged customers, right product)

Accountability:
- Product manager: Owns feedback synthesis, roadmap translation
- Engineering lead: Owns shipping features from feedback
- Sales: Owns communicating back to customers ("We heard you, here's what shipped")
- CEO: Owns culture (everyone should be listening to customers)

`
      }
    ],
    relatedSlugs: [
      "product-roadmap-planning-and-prioritization",
      "customer-success-metrics-and-program-design",
      "metrics-dashboard-design-kpi-tracking",
      "churn-analysis-retention-improvement",
      "competitive-analysis-and-market-positioning"
    ],
    faq: [
      {
        q: "Should I build a customer advisory board?",
        a: "Yes, if you have >20 customers (or >£1M ARR). Cost: £50K/year (12 customers × 2 meetings × £2K expenses). ROI: Prevents £500K wrong feature investments, improves churn 1-2% (£100K), drives case studies (£500K+ revenue). Total value: £1M+. Payback: <2 months. Size: 8-12 customers (diverse segments, company sizes, use cases). Meet 2x/year + quarterly updates."
      },
      {
        q: "How do I collect customer feedback effectively?",
        a: "Methods: Quarterly interviews (5-10 customers, open-ended questions), in-app surveys (after tasks), NPS (quarterly), churn interviews (exit feedback), QBRs (deeper dives). Do 5-10 interviews per quarter. Track: Customer name, source, topic, priority, frequency. Synthesize quarterly: Top 10 feature requests + patterns. Don't ask 'Do you want feature X?' (biased). Ask 'What's your biggest pain?' (unprompted)."
      },
      {
        q: "How do I prioritize feature requests?",
        a: "Use: Impact × Frequency / Effort = Priority. Example: Export to Excel (frequent request, high impact, low effort) = priority 1. Advanced reporting (less frequent, medium impact, medium effort) = priority 2. Communicate back: 'You asked, here's why we're building X before Y.' Track: % of features from customer requests (target >50%, shows customer-driven). Celebrate: When feature ships, tell customers 'You requested this.'"
      },
      {
        q: "How do I measure impact of advisory board?",
        a: "Track: Feature adoption by CAB priority (is what CAB asked for being used?). Churn: CAB customers churn <2% (vs 2.5% overall, shows higher retention). Case studies: How many from CAB? (referrals, social proof). Revenue: CAB customers expand 2-3x faster (more engaged). Overall: Is NPS improving? Are customers feeling heard? Qualitative: Customer quotes on feeling listened to."
      }
    ],
    videoUrl: ""
  }
];

export default batch191Articles;
