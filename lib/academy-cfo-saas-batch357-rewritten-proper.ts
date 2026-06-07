import { AcademyArticle } from "@/types/academy";

export const batch357Articles: AcademyArticle[] = [
  {
    slug: "scaling-operations-and-systems-building",
    title: "Scaling Operations and Systems Building: Growing Operational Efficiency",
    description: "Master ops scaling. Build systems, automate processes, scale operations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["scaling operations", "operational efficiency", "systems building", "process automation", "ops scaling"],
    keyTakeaways: [
      "Scaling operations: As company grows (10 people → 50 → 200), operations become complex. Challenges: (1) Coordination (who decides what?), (2) Processes (document or chaos), (3) Systems (manual or automated), (4) Quality (consistency). Solutions: (1) Clear org structure, (2) Document processes, (3) Automate repetitive, (4) Hire operations people. Cost: Time, people. ROI: Massive (company doesn't fall apart as grow).",
      "Process documentation: Write down how we do things (onboarding, sales, customer support, hiring). Benefit: (1) New people can learn, (2) Consistency (everyone does same thing), (3) Scalability (can delegate). Format: Simple (step-by-step), with examples, video if complex. Maintenance: Review quarterly (update if changed). Cost: Initial time, then minimal maintenance.",
      "Automation: Identify repetitive (billing, invoicing, customer onboarding, reporting). Automate: (1) If >10 hours/month, worth automating, (2) Tools (Zapier, integrations) or code (build custom). ROI: Fast (save hours = save salary). Example: Automatic invoice generation saves 5 hours/month (£500+/month if manual)."
    ],
    content: [
      {
        heading: "Building Scalable Operations",
        body: `Creating systems and processes for sustainable growth.

**Scaling challenges**

Stage 1: Early (10 people)
- Informal (lots of ad-hoc)
- Founder has strong hand in everything
- Communication easy (all-hands, casual)
- Decision-making: Founder decides

Stage 2: Growth (50 people)
- Emerging chaos (too many decisions, process gaps)
- More departments (engineering, sales, CS, ops)
- Communication harder (multiple levels)
- Decision-making: Needs clarity (who decides what?)

Stage 3: Scale (200 people)
- Potential chaos (without systems)
- Or well-oiled (with strong ops)
- Complex workflows (cross-team dependencies)
- Geographic spread (multiple offices, timezones)

Key challenges by scale:

Communication:
- 10 people: Direct (anyone talks to anyone)
- 50 people: Layers (needs structure)
- 200 people: Layers + async (can't all sync)

Decision-making:
- 10 people: Founder decides (fast)
- 50 people: Needs approvals (slower, more input)
- 200 people: Policies (speed, consistency)

Quality/consistency:
- 10 people: Ad-hoc (founder ensures quality)
- 50 people: Process documentation (how we do things)
- 200 people: Formal systems (policies, automation)

**Process documentation**

What to document:

Core processes (do these first):
1. Onboarding (new employee, new customer)
2. Sales (lead to close)
3. Customer support (ticket handling)
4. Finance (invoicing, expense reporting)
5. Hiring (job posting to offer)

Format:

Title: "Customer support ticket handling"

Step-by-step:
1. Ticket arrives (Slack, email, chat)
2. Initial triage (category, priority)
3. Route to right person (by expertise)
4. Respond (target: within 4 hours)
5. Resolve (customer feedback)
6. Close (template + archive)

Timeline: Each step should have target time

Example:
- Triage: 15 min from receipt
- Initial response: 4 hours
- Resolution: 24 hours (or escalate)

Owner: Who is responsible?

Output: Process document (Google Doc, wiki page)

Benefits of documentation:
- New team members can learn (faster onboarding)
- Consistency (everyone does same thing)
- Quality (fewer mistakes)
- Scalability (can hand off without supervision)

**Automation**

What to automate:

High-value automation (do first):
- Invoicing (automatic monthly invoice)
- Customer onboarding (automated emails, setup)
- Expense reporting (auto-categorize from credit card)
- Reporting (automatic dashboard updates)

ROI calculation:

Task: Manual invoice generation
- Frequency: 100 invoices/month
- Time per invoice: 3 minutes
- Total: 300 minutes = 5 hours/month
- Cost: 5 hours × £200/hour = £1,000/month

Automation:
- Tool: Stripe Billing (automatic invoices)
- Setup: 2 hours (one-time)
- Ongoing cost: £100/month (built into Stripe)
- Savings: £1,000 - £100 = £900/month
- ROI: Pays for itself in 1 week!

Process:

1. Identify repetitive (what takes most time, is repetitive?)
2. Estimate time savings (how much would automate save?)
3. Find tool or build (can we automate with existing tool?)
4. Implement (set up automation)
5. Monitor (is it working correctly?)

Example automation tools:

- Zapier: Connect apps (Slack to Google Sheets, etc.)
- IFTTT: If this then that (simple automations)
- Custom code: Build if complex (hire engineer)
- Native integrations: Use app's built-in automation

**Decision-making frameworks**

As grow, can't have founder decide everything (bottleneck)

Establish decision-making rules:

Who decides:
- $0-1K: Team member can decide (spend authority)
- $1-5K: Manager approval
- $5-10K: Director approval
- >$10K: CEO approval

This pushes decisions down (faster, more empowerment)

Strategic decisions (always CEO):
- Major product direction
- Fundraising, debt
- Mergers, partnerships
- Hiring executives
- Pricing changes

Operational decisions (team level):
- Hiring (within approved budget)
- Marketing tactics (within budget)
- Process changes
- Tool purchases (within budget)

Communication about decisions:

- Log decisions (who decided what, when, why)
- Share with team (especially if affects them)
- Explain reasoning (people accept better)
- Document (future reference, consistency)

**Org structure for scale**

Stage 2 (50 people):

\`\`\`
CEO
├─ CTO (Engineering)
├─ VP Sales (Sales)
├─ VP Product (Product)
└─ CFO (Finance/Operations)
\`\`\`

Clear reporting (who reports to whom)

Stage 3 (200 people):

\`\`\`
CEO
├─ CTO (Engineering)
│  ├─ Backend Lead
│  ├─ Frontend Lead
│  └─ DevOps Lead
├─ VP Sales
│  ├─ Sales Manager
│  ├─ SDR Manager
│  └─ CS Manager
├─ VP Product
│  ├─ Product Manager
│  └─ Design Lead
└─ CFO
   ├─ Controller
   ├─ HR
   └─ Operations
\`\`\`

Benefits of clear structure:
- Know who decides (decision rights clear)
- Know who to talk to (no confusion)
- Know career path (how do you advance?)
- Accountability (clear owners)

**Scaling mistakes**

Mistake 1: No structure (chaos)
- Problem: 50 people, no org chart, no clear decision-making
- Result: Bottlenecks, confusion, slow decisions
- Fix: Create org structure, decision rules
- Impact: Clarity, speed

Mistake 2: Process but not automated
- Problem: Document process (good), but no automation
- Result: Process followed, but still manual/slow
- Fix: Automate after documenting
- Impact: Efficiency

Mistake 3: Over-document early
- Problem: Document everything (waste of time for 10 people)
- Fix: Document as need (when scaling, when new people)
- Impact: Efficiency of effort

Mistake 4: No accountability for operations
- Problem: "Operations is everyone's job" = no one owns it
- Fix: Hire operations person or dedicate manager
- Impact: Consistent, good operations

`
      }
    ],
    relatedSlugs: ["annual-planning-and-strategy-execution", "stakeholder-alignment-and-communication-cadence", "metrics-dashboard-design-kpi-tracking", "financial-planning-and-budgeting", "continuous-improvement-and-operational-excellence"],
    faq: [
      { q: "What processes should I document first?", a: "Core processes: (1) Onboarding (employee/customer), (2) Sales (lead to close), (3) Customer support, (4) Finance (invoicing, expense), (5) Hiring. Format: Step-by-step with timelines, owner, outcome. Benefit: New people learn faster, consistency, quality. When: Start at 20-30 people (need structure before chaos)." },
      { q: "What should I automate?", a: "High-ROI: Invoicing, customer onboarding, expense reporting, reporting/dashboards. Rule: If >10 hours/month, worth automating (ROI is usually quick). Tools: Zapier (connect apps), Stripe (billing), native integrations, custom code (complex). Example: Manual invoicing 5 hours/month (£1K cost) → automate with Stripe (£100/month) = £900 savings/month." },
      { q: "How do I structure decision-making?", a: "Decision rights by amount: $0-1K team member, $1-5K manager, $5-10K director, >$10K CEO. Strategic (always CEO): product direction, fundraising, partnerships. Operational (team level): hiring, marketing, tools. Log decisions (who, what, when, why). Share with team (transparency). Benefit: Speed (don't bottleneck CEO), empowerment." }
    ],
    videoUrl: ""
  }
];

export default batch357Articles;
