import { AcademyArticle } from "@/types/academy";

export const batch311Articles: AcademyArticle[] = [
  {
    slug: "knowledge-management-and-documentation",
    title: "Knowledge Management and Documentation: Building Institutional Memory",
    description: "Master knowledge systems. Document processes, reduce key-person risk, scale operations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["knowledge management", "documentation", "tribal knowledge", "process documentation", "institutional knowledge"],
    keyTakeaways: [
      "Knowledge management challenges: Tribal knowledge (in people's heads, hard to scale), context loss (person leaves, knowledge goes), inconsistency (no standard process), rework (same problem solved multiple times). Cost: Time (documentation), discipline (keep current). Benefit: Scalability (new people can do job without hand-holding), risk reduction (not dependent on one person), efficiency (reduce rework). Example: Customer integration process undocumented = every new person learns by trial-error (2 weeks). Documented = 2 days onboarding (10x improvement).",
      "Documentation types: Processes (step-by-step procedures), decisions (why we chose X), decisions (architecture, strategy), reference (APIs, tools, contacts), guides (how-to for customers). Tool: Wiki (Notion, Confluence) = central source of truth. Cost: £5-20/person/month (tool) + time (1-2 hours per week to maintain). Benefit: Massive (scale, reduce errors, onboarding speed).",
      "Implementation: Start with critical processes (onboarding, customer success, product launches). Ask: What takes longest to teach? What would break if person left? Those are priorities. Maintain: Keep current (outdated docs worse than no docs), version control (track changes), easy to find (good indexing, search). Measurement: Time-to-productivity for new hires (goal: halve it), help desk tickets (questions answered in docs = fewer tickets)."
    ],
    content: [
      {
        heading: "Building a Knowledge Management System",
        body: `Creating institutional memory and scalable processes.

**Knowledge management framework**

What to document:

Processes (most critical):
- Customer onboarding: Step-by-step (how to get customer started)
- Sales process: CRM workflow, deal stages, handoff to CS
- Product launches: Checklist, communication plan, rollout
- Customer support: Troubleshooting, escalation, common issues
- Financial close: Month-end procedures, reconciliations
- Hiring: Job description, interview process, offer process

Decisions:
- Architecture decisions: Why we chose tech stack
- Product decisions: Why we built feature X, roadmap thinking
- Strategic: Market positioning, customer segmentation
- Process changes: Why we changed how we do X

Reference:
- Contacts: Key vendor contacts, customer contacts
- Systems: List of tools (password, access, admin)
- Customer data: Account structure, important accounts
- Vendor agreements: Terms, renewal dates, key contacts

Guides:
- How-to for customers: Getting started, troubleshooting
- How-to for team: Using internal tools, procedures
- Templates: Email templates, proposals, contracts
- FAQs: Common questions, answers

**Tools for knowledge management**

Wiki (Notion, Confluence):
- Use: Central repository for all documentation
- Features: Pages, databases, relationships, templates, search
- Cost: £5-10/person/month
- Structure:
  - People & Roles (who is who, responsibilities)
  - Processes (step-by-step procedures)
  - Decisions (decisions log with rationale)
  - Reference (contacts, vendors, systems)
  - Customer (account structure, key customers)
  - Product (roadmap, features, technical docs)

Version control (GitHub):
- Use: Code documentation, architecture decisions
- Features: Markdown files, version history, collaboration
- Cost: Free or £4-21/person/month (GitHub Enterprise)
- Structure:
  - README (project overview)
  - ARCHITECTURE.md (system design)
  - DECISIONS.md (decision log)
  - API documentation (OpenAPI/Swagger)

Help desk (Zendesk, Freshdesk):
- Use: Customer-facing knowledge base
- Features: Articles, search, customer community
- Cost: £25-500/month (varies by features)
- Structure:
  - Getting started (onboarding guides)
  - Troubleshooting (common issues)
  - Feature guides (how to use features)
  - FAQs (frequently asked questions)

**Implementation roadmap**

Phase 1: Foundation (Month 1-2)
- Select tool: Choose wiki (Notion recommended for non-technical)
- Structure: Create main categories (people, processes, decisions, reference)
- Initial docs: Document 3-5 most critical processes
  - Example: Customer onboarding (critical to support and success)
  - Example: Hiring process (needed soon, complex)
  - Example: Financial close (needed monthly)
- Cost: Setup time (10-20 hours), tool subscription (£5/person/month)

Phase 2: Core documentation (Month 2-3)
- Critical processes: Document remaining important processes
  - Sales process (shared with team)
  - Product launch checklist
  - Customer support troubleshooting
- Decisions: Document key strategic decisions + rationale
- Reference: Compile contacts, vendors, systems
- Cost: 20-40 hours documentation time

Phase 3: Culture and maintenance (Month 3-4)
- Culture: Make documentation requirement for processes
  - New process? Document it before rolling out
  - Decision? Document + share with team
- Maintenance: Update docs as things change
- Sharing: Regular wiki updates (share in all-hands, team meetings)
- Cost: Ongoing (5-10 hours per week)

**Effective documentation practices**

Principle 1: Comprehensive but concise
- Don't: 50-page manual (nobody reads)
- Do: 2-3 page summary + videos for complex parts
- Format: Bullet points, clear headings, examples
- Test: Can new person follow without asking questions?

Principle 2: Searchable and discoverable
- Search: Good search function (wiki should have)
- Index: Navigation clear (not buried 5 levels deep)
- Links: Hyperlink between related docs (interconnected)
- Example: Customer onboarding links to common troubleshooting

Principle 3: Visual documentation
- Screenshots: Show step-by-step (worth 1000 words)
- Diagrams: Complex processes as flowcharts
- Videos: Demo walkthrough (Loom, 3-5 min)
- Use: Mix formats (people learn different ways)

Principle 4: Maintained and current
- Version dates: Docs show "last updated" (builds trust)
- Outdated warning: Flag if docs might be old
- Update trigger: When process changes, doc updates immediately
- Ownership: Assign owner (person responsible for keeping current)

Example document:

Title: Customer Onboarding Process
Last updated: Jan 2024 (owner: Sarah, CS Manager)

Overview:
- Goal: Get customer successful, using core features within 1 week
- Timeline: 1 week from signup to first value
- Owner: CS team

Process:
1. Signup (customer): Customer creates account, logs in
2. Welcome email (auto): Automated welcome email (within 1 hour)
3. Kick-off call (day 1-2): CS person calls customer, schedules training
4. Training session (day 3-4): Walk through core features, 1 hour
5. Data setup (day 5-6): Help customer set up their data
6. First value (day 7): Customer sees first dashboard/results
7. Follow-up (day 10): Check in, answer questions

Video walkthrough: [Loom video link, 5 min]

Common issues: [Links to troubleshooting docs]

Related: [Links to customer success strategy, support escalation]

**Knowledge transfer for critical processes**

Challenge: Person leaving takes critical knowledge

Prevention:

Documentation:
- Document critical processes while person still there
- While documenting, person can explain (completeness)

Knowledge transfer sessions:
- Record: Meeting where expert explains process to team
- Distribute: Team watches, takes notes
- Follow-up: Q&A session with expert

Pair programming/shadowing:
- New person shadows expert (2-4 days)
- Watch real work, learn details
- Then expert shadows new person (validate learning)
- Cost: 1-2 weeks overlap (if person not fully leaving)

Succession planning:
- Identify: Who would take over if person left?
- Cross-train: Begin training second person (backup)
- Transition: Gradual handoff (old person still available)
- Timeline: 1-2 months overlap before departure

**Scaling with documentation**

Challenge: Manual processes break as scale up
- Inconsistency: Each person does slightly different
- Training burden: Takes weeks to teach new people
- Errors: Mistakes from inconsistency

Solution: Documentation + process automation

Example: Customer onboarding
- Manual: CS person does each step (1 week per customer)
- Documented: Process doc + training (new person 3 days per customer)
- Partial automation: Email sequence automation (2 days per customer)
- Full automation: Self-service onboarding (customer 1 day, company 2 hours support)

Cost of automation:
- Partial automation (email sequence): £50/month + 20 hours setup
- Full automation (self-service flow): £5K-20K development

ROI:
- Manual: 1 person does 2 customers/week (£50K salary = £1250/customer cost)
- Documented: 1 person does 3 customers/week (£833/customer cost)
- Partial automation: 1 person does 5 customers/week (£500/customer cost)
- Full automation: 1 person monitors 20+ customers (£50/customer cost)
- Benefit: 25x cost improvement (from manual to full automation)

**Measurement and optimization**

Metrics:

| Metric | Target | Current | Action |
|---|---|---|---|
| Onboarding time (new hire) | 2 weeks to productivity | 4 weeks | Document more, improve training |
| Support ticket % answerable from docs | 30%+ | 10% | Expand docs, improve search |
| Docs kept current | 80%+ up-to-date | 60% | Assign owners, make updating easier |
| New process % with docs | 100% | 30% | Make documentation required |
| Customer self-service % | 50%+ | 20% | Improve FAQ, self-service docs |

Quarterly review:
- Coverage: Which processes still missing docs?
- Freshness: Which docs are outdated?
- Usage: Are people using docs (search analytics)?
- Effectiveness: Are docs solving problems (support ticket reduction)?
- Gaps: Where do people struggle (interview new hires)?

Continuous improvement:
- Feedback: Ask team "What would help you?"
- Priority: Document highest-impact processes first
- Consolidate: Remove redundant docs
- Simplify: Make complex docs simpler (videos, diagrams)

**Common mistakes**

Mistake 1: Documentation becomes outdated
- Problem: Doc says "use Tool A", company switched to Tool B
- Solution: Assign owner, set "review by" dates, flag outdated
- Impact: Outdated docs worse than no docs (misleading)

Mistake 2: Over-documentation
- Problem: 100+ page guide nobody reads
- Solution: Keep concise (2-3 pages) + videos for complexity
- Impact: Too much = nobody reads, too little = confusion

Mistake 3: Documentation not discoverable
- Problem: Docs exist but people don't know about them
- Solution: Good search, clear navigation, link from relevant places
- Impact: Docs don't help if people can't find them

Mistake 4: No culture of documentation
- Problem: Documentation is optional
- Solution: Make it requirement (new process must be documented)
- Impact: Gradual build of knowledge base vs sporadic docs

Mistake 5: Documentation in wrong place
- Problem: Process docs in Slack history, wiki, email (scattered)
- Solution: Single source of truth (all in one place)
- Impact: Confusion, outdated copies, poor search

**Best practices summary**

1. Start small (3-5 critical processes)
2. Use single tool (not scattered across tools)
3. Assign owners (responsible for updates)
4. Make it searchable (good search, good navigation)
5. Keep current (flag if outdated)
6. Make documentation required (new process = doc)
7. Use visuals (screenshots, diagrams, videos)
8. Keep concise (2-3 pages, not 50)
9. Measure impact (time to productivity, support reduction)
10. Iterate (get feedback, improve)

`
      }
    ],
    relatedSlugs: ["remote-team-management-and-operations", "organizational-structure-and-team-design", "hiring-and-talent-acquisition-strategy", "employee-retention-and-turnover-analysis", "scalable-operations-and-systems-thinking"],
    faq: [
      { q: "What should I document first?", a: "Prioritize: (1) Critical processes (what would break if person left?), (2) Most time-consuming (customer onboarding, hiring, product launch), (3) Most complex (hardest to learn). Start with 3-5 processes (not everything). Tools: Wiki (Notion recommended). Cost: 20-40 hours setup, then 5-10 hours/week to maintain." },
      { q: "How do I keep documentation current?", a: "Assign owners (person responsible for each doc), set review dates (every 3-6 months), flag if outdated, make updates when process changes (immediate). Culture: Documentation is required before rolling out process changes. Tools: Version tracking, update notifications. Cost: 5-10 hours/week maintenance." },
      { q: "What's the ROI of knowledge management?", a: "Significant: Onboarding time halves (1 week → 2 days = £5K saved per person), support tickets reduce 30% (answers in docs), process consistency improves (fewer errors = reduced rework), risk reduces (not dependent on 1 person). Total: £20-50K benefit per person for knowledge-intensive roles. One good wiki investment (£5K setup) pays for itself with 1-2 new hires." }
    ],
    videoUrl: ""
  }
];

export default batch311Articles;