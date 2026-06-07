import { AcademyArticle } from "@/types/academy";

export const batch199Articles: AcademyArticle[] = [
  {
    slug: "organizational-structure-and-team-design",
    title: "Organizational Structure and Team Design: Building Scalable Teams",
    description: "Master org design. Structure teams, define roles, and build effective organizations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "organizational structure",
      "team design",
      "org chart",
      "reporting structure",
      "roles and responsibilities",
      "team scaling",
      "functional teams",
      "matrix organization",
      "span of control",
      "organizational design"
    ],
    keyTakeaways: [
      "Org structure evolution: Startup (flat, 5 people, 1 manager). Scaling (functional, 20 people, 4-5 managers, 1 CEO). Growth (multi-team, 50+ people, multiple layers, clear hierarchy). Principle: Span of control (manager responsible for 4-8 people, 6 optimal). Reporting: Clear (each person has 1 manager), short chain (CEO → director → manager → IC, max 4 layers for 100-person company). Design: Build around customer value (not convenience). Example: Sales team reports to VP Sales (not split between two managers).",
      "Functional vs matrix: Functional (engineer reports to eng manager, only). Matrix (engineer reports to eng manager + product manager). Pros matrix (faster cross-functional, accountability). Cons matrix (confusing, conflicts). Most SaaS: Functional + cross-functional teams (not formal matrix). Example: Marketing has own org, works cross-functionally with Sales (no split reporting). Clear primary manager (owns career, reviews), dotted-line relationships (project basis).",
      "Expanding roles: Junior IC → Senior IC (expert, mentors). Senior IC → Manager (8 people team, 2x productivity). Manager → Director (2-3 teams, 20-30 people). Director → VP (3-4 directors, 50-100 people). Don't promote unless: (1) Ready (has capability), (2) Role needs them (expansion), (3) Willing (not everyone wants management). Example: Great engineer not good manager = keep as senior engineer (architect role), promote adjacent (not up). Growth path = merit-based, not tenure."
    ],
    content: [
      {
        heading: "Organizational Evolution and Structure",
        body: `How organizations evolve with scale.

**Stage 1: Startup (0-5 people)**

Structure: Flat, no managers
- Founder/CEO: Everything (product, sales, ops, finance)
- Everyone reports to CEO
- Roles undefined, everyone does everything
- Decision-making: Fast (CEO decides)

Example:
\`\`\`
CEO
├── CTO (engineer)
├── Head of Sales (1 salesperson)
├── Head of Ops (1 operations)
└── Consultant (part-time CFO)
\`\`\`

Challenges:
- CEO bottleneck (everything needs CEO decision)
- No clear roles (overlap, confusion)
- Limited expertise (CEO usually founder, may not be CFO-skilled)

**Stage 2: Scaling (10-25 people)**

Structure: Functional (by role)
- CEO
- VP of Product/Engineering (oversees engineering, product)
- VP of Sales (oversees sales, CS)
- VP of Finance (oversees finance, HR, ops)
- Managers under each VP (4-6 people per manager)

Example org chart:
\`\`\`
CEO
├── VP Product/Eng
│   ├── Engineering Manager
│   │   ├── Engineer 1
│   │   └── Engineer 2
│   ├── Product Manager
│   └── QA Lead
├── VP Sales
│   ├── Sales Manager
│   │   ├── AE 1
│   │   └── AE 2
│   ├── SDR Manager
│   └── CS Manager
└── VP Finance/Ops
    ├── Finance Manager
    └── HR/Ops
\`\`\`

Decision-making:
- Clear authority (VP decides for their team)
- CEO for cross-functional decisions (product roadmap, pricing)
- Faster than startup (less CEO involvement)

**Stage 3: Growth (50-100 people)**

Structure: Multi-team, clear hierarchy
- CEO
- C-suite (VP/Director level, 6-8 people)
- Managers (15-20 people)
- ICs (individual contributors, 40-50 people)

Example:
\`\`\`
CEO
├── CTO/VP Eng
│   ├── Eng Manager (team A, 4 engineers)
│   ├── Eng Manager (team B, 4 engineers)
│   └── QA Lead (2 QA)
├── Chief Revenue Officer (VP Sales)
│   ├── Sales Director (mid-market + enterprise, 8 AEs)
│   ├── SMB Manager (SMB sales, 4 AEs)
│   ├── SDR Manager (4 SDRs)
│   └── CS Manager (4 CS reps)
├── VP Product
│   ├── Product Manager (core product)
│   └── Product Manager (growth/new features)
├── VP Marketing
│   ├── Content Manager
│   └── Growth Manager
└── VP Finance/Ops
    ├── Controller
    ├── HR Manager
    └── Finance Analyst
\`\`\`

Span of control: Average manager has 5-6 direct reports (4-8 acceptable)

**Stage 4: Scale (100+ people)**

Structure: More layers, specialization
- CEO
- C-suite (5-8 people)
- Directors (10-15 people)
- Managers (20-30 people)
- ICs (50-70 people)

Challenges of scale:
- Communication harder (many teams)
- Coordination overhead (more meetings)
- Career paths (fewer manager roles, more IC growth)
- Culture drift (less direct CEO connection)

Mitigation:
- Clear communication (all-hands monthly)
- Cross-functional teams (product + eng + design + marketing)
- IC growth paths (senior engineer, staff engineer, architect)

`
      },
      {
        heading: "Span of Control and Manager Ratios",
        body: `Optimal team sizes and hierarchies.

**Span of Control**

Definition: How many direct reports a manager has
- Too few (<3): Manager underutilized, unnecessary layer
- Too many (>8): Manager overwhelmed, can't manage well
- Optimal: 5-6 direct reports

By role:
- Engineering manager: 5-8 direct reports (ICs similar skill level)
- Sales manager: 5-8 direct reports (AEs similar performance level)
- CS manager: 6-10 direct reports (CSRs routine work)
- Director/VP: 4-6 direct reports (managers, higher complexity)

Example company (50 people):
- 1 CEO
- 5 VPs (VP eng, VP sales, VP product, VP marketing, VP finance)
- 12 managers (under VPs)
- 32 ICs (under managers)
- Avg manager span: 32/12 = 2.7 ICs per manager
- Ratio: Too many managers relative to ICs (top-heavy)

After restructure (better balance):
- 1 CEO
- 4 VPs (consolidate marketing + product)
- 8 managers (reduce management layer)
- 37 ICs
- Ratio: 4.6 ICs per manager (healthier)

**Manager Ratio and Efficiency**

Target: 1 manager per 5-6 ICs = 0.17-0.2 managers per IC

Example calculations:
- 100-person company: 100 × 0.18 = 18 managers (+ 5 VPs = 23 managers/directors, 77 ICs)
- 50-person company: 50 × 0.18 = 9 managers (+ 4 VPs = 13 managers/directors, 37 ICs)
- 20-person company: 20 × 0.25 = 5 managers (early stage, less formal ratio)

If over-managed:
- Too many layers (CEO → VP → Director → Manager → IC = 4 layers)
- Slows decisions (more approvals)
- Higher cost (managers expensive)
- Solution: Flatten (CEO → VP → Manager → IC = 3 layers)

**Career Paths**

Individual Contributor (IC) path:
- Junior IC → Senior IC → Staff/Principal IC → Distinguished Engineer
- Scope: Deepens expertise (not team size)
- Leadership: Technical leadership (mentors, architecture)
- Compensation: Can match manager compensation (specialized expertise valuable)
- Example: Principal engineer = company expert in area, guides decisions

Manager path:
- Manager (5-6 people) → Senior Manager / Director (2-3 teams, 15-20 people) → VP (4-5 teams, 50-100 people)
- Scope: Expands team size
- Leadership: People management (hiring, development, performance)
- Compensation: Higher in early stages, levels off as scale limited

Hybrid path (best practice):
- Engineer → Senior engineer (IC path) → Engineering manager (manager path) → Director (manager path)
- Choice point: Promote to manager or stay as IC
- Not automatic: Just because senior engineer doesn't mean good manager
- Test: Manager for 6 months, if not working, revert to senior IC

Examples:
- ✓ Great engineer, poor manager = keep as senior engineer (architect), special projects
- ✗ Great engineer, forced to be manager = resentment, both roles suffer
- ✓ Great engineer, great manager = promote, develop in management

**Hiring to Org Plan**

Annual headcount plan (example, 50 → 70 people):
- Engineering: 12 → 16 (+4 engineers)
- Sales: 10 → 15 (+5 salespeople)
- Product: 3 → 4 (+1 PM)
- Marketing: 5 → 7 (+2)
- Finance/Ops: 5 → 5 (no change)
- CS: 8 → 10 (+2 CSMs)
- Other: 7 → 13 (+6 operations, finance, HR)

Hiring priority: Revenue-generating teams first (sales, engineering), then support

`
      },
      {
        heading: "Cross-Functional Teams and Collaboration",
        body: `Optimizing for customer value.

**Functional vs Matrix vs Cross-Functional**

Functional (most SaaS):
- Engineer reports to eng manager (only)
- PM reports to product manager (only)
- Designer reports to design manager (only)
- Pro: Clear accountability, career paths
- Con: Slow cross-functional decisions, silos

Matrix:
- Engineer reports to eng manager + product manager
- Dual accountability, both managers evaluate
- Pro: Cross-functional prioritization
- Con: Confusing, conflicts, unclear authority

Cross-functional teams (best for SaaS):
- Functional reporting (engineer reports to eng manager)
- Project-based collaboration (engineer assigned to product team, works cross-functionally)
- Product team: 4-5 people (engineers, PM, designer, maybe CS)
- Clear owner: Product manager owns outcome
- Primary manager: Still eng manager (career, reviews)
- Pro: Fast decisions, aligned to customer, clear accountability
- Con: More meetings, coordination overhead

Example cross-functional structure:
\`\`\`
VP Engineering
├── Eng Manager (owns career, reviews)
│   ├── Engineer A (primary: core product team)
│   ├── Engineer B (primary: growth team)
│   └── Engineer C (primary: infrastructure)

VP Product
├── Product Manager (owns core product outcome)
│   Team: Engineer A, Designer 1, CS rep 1
├── Product Manager (owns growth outcome)
│   Team: Engineer B, Engineer (growth), Designer 2

Infrastructure team
├── Staff engineer (owns infrastructure)
│   Team: Engineer C, Engineer (SRE)
\`\`\`

**Cross-Functional Decision-Making**

Product roadmap decision example:
- Team: Product manager (owns decision), engineers, designer, CS
- Discussion: What feature should we build next?
- Input: Engineering (effort), design (complexity), CS (customer need)
- Decision: Product manager (final call, owns outcome)
- Approval: VP engineering approves engineering resources
- Execution: Team executes

Conflict resolution:
- If eng says "can't build" and PM says "must build": VP eng decides (resource owner)
- If CS says "wrong feature, customers want X" and PM wants Y: Go back to customers, validate
- Escalation: Unresolved conflicts go to CPO/CTO (not CEO unless critical)

Sprint/planning:
- Weekly: Team syncs (15-30 min, decide day's priorities)
- Bi-weekly: Planning (week-long sprint, team plans 2 weeks)
- Monthly: Retrospective (what worked, what didn't)

`
      }
    ],
    relatedSlugs: [
      "department-budgeting-and-headcount-planning",
      "employee-equity-and-stock-options",
      "sales-compensation-and-incentive-structures",
      "hiring-and-talent-acquisition",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's the right organizational structure for my company?",
        a: "Stage-based: Startup (<10): Flat (no managers). Scaling (10-50): Functional VPs + managers (VP eng, VP sales, VP finance). Growth (50-100+): Multiple teams under directors. Principle: Span of control 5-6 people per manager, clear reporting (1 manager per person), build around customer value. Example: 50-person company = 1 CEO + 4 VPs + 8 managers + 37 ICs."
      },
      {
        q: "How many managers do I need?",
        a: "Target ratio: 1 manager per 5-6 ICs (0.17-0.2 managers per IC). Example: 100-person company = 18 managers + 5 VPs = 23 managers/leaders, 77 ICs. If ratio higher (more managers) = top-heavy, inefficient. Flatten organization if over-managed (reduce layers, increase span of control)."
      },
      {
        q: "Should I promote my best IC to manager?",
        a: "Not always. Great engineer may be poor manager. Options: (1) IC path = senior/staff engineer (deep expertise, mentorship, no team), (2) Manager path = manage people (hiring, development), (3) Hybrid = manager for 6 months, if not working, revert to IC. Best practice: Let people choose path. Not automatic promotion = retain specialized experts in IC roles."
      },
      {
        q: "What's better: functional or matrix organization?",
        a: "Cross-functional teams (best for SaaS): Engineer reports to eng manager (functional), but assigned to product team (cross-functional). Clear primary manager (career, reviews), project-based collaboration. Pro: Fast decisions, aligned to customer. Con: More meetings, coordination overhead. Avoid: Pure matrix (confusing dual reporting)."
      }
    ],
    videoUrl: ""
  }
];

export default batch199Articles;
