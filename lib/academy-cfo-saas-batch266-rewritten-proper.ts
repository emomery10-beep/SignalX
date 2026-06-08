import { AcademyArticle } from "@/types/academy";

export const batch266Articles: AcademyArticle[] = [
  {
    slug: "customer-advisory-board-and-voice-of-customer",
    title: "Customer Advisory Board and Voice of Customer: Staying Close to Customers",
    description: "Master customer advisory boards. Build CAB, gather feedback, drive product decisions.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer advisory board", "CAB", "voice of customer", "customer feedback", "customer council", "customer input", "product feedback"],
    keyTakeaways: [
      "CAB fundamentals: Select 10-20 customers (mix of sizes, use cases) → quarterly meetings (half-day in-person or virtual) → discuss roadmap, market trends, competitive threats. Goal: Direct feedback (understand customer needs), product validation (roadmap resonates), retention (customers feel heard = less churn). Members: Pay nothing (honor) or small perks (dinner, merchandise), expect attendance (commitment). Cost: 2-3 days/quarter organizing, meetings (CFO + product time 10+ hours). ROI: CAB feedback prevents product misses (build wrong thing), improves product-market fit (customers understand roadmap), improves retention (0.5% churn reduction = £100K+ value).",
      "CAB structure: Member selection (mix: large customers, innovative users, industry veterans, skeptics). Mix: Don't select only happy customers (confirmation bias). Cadence: Quarterly (3-4 hours, virtual or in-person). Agenda: Product roadmap (get feedback), market trends (what seeing in market?), competitive threats (how are competitors?), customer success stories (learning from each other). Output: Product feedback (what matters most?), market intel (industry trends), positioning (how should we position?). Rotating: Add new members (prevent echo chamber), remove inactive (keep commitment high).",
      "Feedback to action: CAB provides input → Product prioritizes (3-5 high-priority items from CAB) → Communicate back (shows we listened, close feedback loop = retention boost). Example: CAB says 'need HIPAA compliance' → Product prioritizes (roadmap #1) → Announce (CAB members feel heard) → Deploy (customers happy). Avoid: Collect feedback, ignore (trust destroyed, customers leave). Communication: Monthly email (progress on CAB feedback), quarterly meeting (discuss, explain tradeoffs). Success: Customers see their input impacting product = invested (low churn)."
    ],
    content: [
      {
        heading: "Customer Advisory Board Structure and Execution",
        body: `Building a strategic customer advisory board.

**CAB member selection**

Ideal profile:
- Large customer (high ACV, important to revenue)
- Fast-growing customer (ambitious, driving usage growth)
- Industry veteran (understands market, trend setter)
- Innovator (early adopter, uses product differently)
- Skeptic (honest feedback, not just yes-men)

Selection process:
1. Identify candidates (top 20-30 customers, mix of above)
2. Outreach (personal invite from CEO, not salesforce)
3. Select (10-20 members, diverse perspectives)
4. Onboard (explain commitment, schedule meetings)

Avoid: Only selecting happy customers (echo chamber, miss real issues)

Member expectations:
- Attendance: Quarterly in-person or virtual meetings (4 hours)
- Preparation: Review materials before (1 hour)
- Participation: Share honest feedback, not just praise
- Confidentiality: CAB discussions private (not shared publicly until released)
- Term: Typically 1-2 years (rotate members to refresh perspectives)

**CAB meeting structure**

Quarterly meeting (4 hours, usually half-day):
| Time | Topic | Owner | Purpose |
|---|---|---|---|
| 0:00-0:15 | Welcome, agenda | CEO | Set tone, explain decision request |
| 0:15-1:00 | Market trends | CFO/VP | What are you seeing in market? Competitive threats? |
| 1:00-2:00 | Product roadmap | CPO | Here's what we're building. Feedback? Priorities? |
| 2:00-2:45 | Breakout discussions | Product team | Deep-dive on 2-3 specific topics (features, pricing, segments) |
| 2:45-3:00 | Next steps, wrap-up | CEO | What did we learn? How will we use input? |
| Post-meeting | Relationships | CEO/CSO | Dinner, cocktails (informal relationship building) |

Agenda template:
- Market context: Your business trends, industry outlook, competitive threats
- Product strategy: Here's our vision, here's roadmap next 12-18 months
- Decisions needed: Which direction should we go? What matters most?
- Learning: What seeing in market we should know?
- Collaboration: How can we work together better?

**Capturing and acting on feedback**

Documentation:
- Record themes (not individual feedback, protect confidentiality)
- Prioritize (vote on importance, rapid decision-making)
- Example: "70% mention HIPAA compliance as critical, prioritize for Q2"

Communication loop:
1. Gather feedback (CAB meeting)
2. Synthesize (product team reviews, identifies themes)
3. Decide (product roadmap prioritizes based on feedback)
4. Announce (communicate back to CAB: "You mentioned HIPAA, we're prioritizing this")
5. Deliver (ship feature, notify CAB)
6. Close loop (show impact: "You requested this, here it is, here's what customers say")

Example timeline:
- Q1 meeting: CAB says "need integrations with Salesforce"
- Q1-Q2: Product builds integration (prioritized)
- Q2 meeting: Share progress (show we listened)
- Q3: Launch integration, announce to CAB
- Q3 meeting: Show usage (15 customers using), ask for feedback
- Q4: Announce expansion (new integrations)

Impact metrics:
- Churn: CAB members should have lower churn (0.5-1% vs 2% overall = 1% improvement)
- NRR: CAB members should have higher expansion (120%+ vs baseline)
- Retention: CAB impact obvious (they see product improving based on their input)

**Managing CAB effectively**

Diversity of opinions:
- Include skeptics (not just happy customers)
- Invite different roles (CTO, CFO, CEO)
- Mix industries/sizes (avoid groupthink)
- Rotate members every 2 years (fresh perspectives)

Confidentiality and transparency:
- CAB discussions confidential (trust required)
- Public-ready announcements shared with CAB first (respect)
- Post-meeting: Communicate progress to all CAB members (show actions taken)

Relationship investment:
- CEO attends all meetings (shows importance)
- Individual check-ins (CEO to each member quarterly)
- Thank-you dinners (value appreciation)
- Public recognition (case studies, speaking opportunities)

Frequency:
- Quarterly meetings (standard)
- Monthly email updates (progress on CAB feedback)
- Annual in-depth (strategy, multi-year roadmap)

`
      }
    ],
    relatedSlugs: ["customer-feedback-loops-and-product-iteration", "product-roadmap-planning-and-prioritization", "customer-success-metrics-and-program-design"],
    faq: [
      { q: "Should I have a customer advisory board?", a: "Yes, if: >£5M ARR (enough customers), want product-market fit input, need customer retention insights. Size: 10-20 members (diverse perspectives). Cost: Time (CEO, product team 20+ hours/quarter), logistics (meetings). ROI: Product better aligned (fewer misses), customers feel heard (0.5% churn reduction = £100K+ value)." },
      { q: "How do I select CAB members?", a: "Diverse: Mix large/small, fast-growing, skeptics, innovators. Avoid: Only happy customers (echo chamber). Selection: Personal invite from CEO (not sales). Term: 1-2 years (rotate for fresh perspectives). Expectations: Quarterly attendance, honest feedback." },
      { q: "How do I use CAB feedback?", a: "1. Gather (quarterly meeting, structured discussion). 2. Synthesize (product team reviews themes). 3. Decide (prioritize roadmap based on feedback). 4. Announce (tell CAB what you're doing). 5. Deliver (ship features, notify CAB). 6. Close loop (show impact, impact metrics). Goal: Close feedback loop = customers feel heard = retention." }
    ],
    videoUrl: ""
  }
];

export default batch266Articles;