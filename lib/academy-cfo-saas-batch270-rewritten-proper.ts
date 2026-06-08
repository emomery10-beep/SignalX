import { AcademyArticle } from "@/types/academy";

export const batch270Articles: AcademyArticle[] = [
  {
    slug: "scalable-operations-and-systems-thinking",
    title: "Scalable Operations and Systems Thinking: Building for Growth",
    description: "Master scalable operations. Build systems, reduce complexity, grow efficiently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["operations", "scalability", "systems thinking", "process optimization", "operational efficiency", "scaling operations"],
    keyTakeaways: [
      "Systems thinking: Every system has input (what goes in), process (how it works), output (what comes out). Goal: Optimize the system (more output with same input). Example: Customer onboarding. Input: New customers. Process: Kickoff call, training, setup, first success. Output: Activated customers. Optimize: Add automated onboarding, template setup, AI support → same input, faster output. Cost: Systems design (2-4 weeks), automation (£5-20K). Benefit: Onboard 2x more customers with same team (scale without headcount).",
      "Operational leverage: As company scales, cost per unit should decrease. Example: £1M revenue, 20 people = £50K per person. £10M revenue, 50 people = £200K per person (4x leverage). Goal: Grow headcount slower than revenue (operational leverage). Math: Revenue grows 50% YoY, headcount grows 30% = leverage (margins improve). How: Automate (reduce manual), delegate (higher-leverage roles), improve systems (eliminate waste). Cost: £50-200K upfront (automation, tools, systems build). Benefit: 20-40% margin improvement over 3 years (huge profit upside).",
      "Systems documentation: Write down how everything works (onboarding, customer support, sales, finance). Benefit: (1) Training new hires (faster ramp), (2) Consistency (processes repeated), (3) Optimization (identify waste). Format: Playbooks (step-by-step), SLAs (service levels), ownership (who does what). Cost: 2-4 weeks documentation, ongoing updates. ROI: Hiring 20% faster (better onboarding), consistency (fewer mistakes), flexibility (delegation easier)."
    ],
    content: [
      {
        heading: "Building Scalable, Systems-Based Operations",
        body: `Creating operations that scale.

**Systems thinking framework**

Components:
1. Input: What enters the system (customers, data, requests)
2. Process: How the system transforms input (workflow, steps)
3. Output: What leaves the system (activated customers, resolved issues, revenue)
4. Feedback: How output informs future input (learning loop)

Example: Customer support system
| Component | Detail |
|---|---|
| Input | Support tickets (inbound requests) |
| Process | Triage (categorize), assign (to support agent), resolve (fix or escalate), close |
| Output | Resolved tickets, customer satisfaction (CSAT) |
| Feedback | CSAT → improve process, hire if bottleneck |

Optimization levers:
- Reduce process steps (faster, fewer errors)
- Automate (remove manual work)
- Delegate (assign to better-suited person)
- Improve information (better tools, visibility)
- Reduce waste (eliminate non-value-add steps)

Example optimization:
- Current: Ticket → email to agent → manual research → respond → close = 1 day, 5 steps
- Optimized: Ticket → AI categorizes → knowledge base → if known issue auto-resolve → close = 1 hour, 2 steps
- Benefit: Resolve 90% of tickets without human intervention, reduce cost 70%

**Operational leverage metrics**

Revenue per employee:
- Early stage (0-10 people): £200-500K per employee (high variation)
- Growth (10-50): £300-700K per employee (leverage building)
- Scaling (50-200): £500-1M per employee (strong leverage)
- Mature (200+): £700-1.5M per employee (optimized)

Tracking:
- Month 1: 2 people, £100K revenue = £50K per person
- Month 12: 5 people, £600K revenue = £120K per person (2.4x leverage)
- Month 24: 10 people, £2M revenue = £200K per person (4x leverage)

Goal: Revenue grows 50% YoY, headcount grows 30% = leverage (improving unit economics)

Metrics to monitor:
| Metric | Formula | Target |
|---|---|---|
| Revenue per employee | Total revenue / headcount | Growing >10% YoY |
| Cost per customer served | Support costs / customers | Declining <5% YoY |
| Time per task | Hours spent / output volume | Declining >10% YoY |
| Automation rate | Automated transactions / total | Increasing >20% YoY |

**Systems documentation**

Core playbooks:
1. Onboarding (new employee, new customer)
   - Steps (what happens, in order)
   - Owners (who does what, when)
   - Success criteria (how know it worked)
   - Time estimate (how long should take)

2. Customer support
   - Triage (how categorize tickets)
   - SLA (response time, resolution time)
   - Escalation (when to escalate)
   - Closure (how mark resolved)

3. Sales process
   - Qualification (who is prospect)
   - Discovery (what do they need)
   - Proposal (what offering)
   - Closing (terms negotiation)

4. Finance/reporting
   - Monthly close process (steps, timeline, owners)
   - Reporting cadence (what metrics, when, to whom)
   - Forecasting process (how built, updated, communicated)

Documentation benefits:
1. Training faster: New hires learn faster (playbook + mentorship)
2. Consistency: Same process every time (fewer errors, repeatable)
3. Scalability: Easy to add people (they follow playbook)
4. Efficiency: Identify waste (document to optimize)
5. Delegation: Clear responsibilities (people know what to do)

Cost-benefit:
- Writing playbooks: 2-4 weeks initial, £2-5K cost
- Updating: 1-2 weeks quarterly
- Benefit: Hire 20-30% faster (better onboarding), consistency (fewer mistakes), delegation (easier)
- ROI: Break-even on 3-4 new hires

`
      }
    ],
    relatedSlugs: ["organizational-structure-and-team-design", "profitability-analysis-and-operating-leverage", "financial-planning-and-budgeting"],
    faq: [
      { q: "How do I improve operational leverage?", a: "1. Automate (eliminate manual work). 2. Delegate (assign to right person). 3. Improve systems (document processes, eliminate waste). 4. Optimize metrics (revenue per employee should grow). Target: Revenue +50% YoY, headcount +30% = improving leverage." },
      { q: "What should I document?", a: "Core playbooks: Onboarding (employee, customer), support (process, SLAs), sales (funnel, stages), finance (monthly close, reporting). Benefits: Faster hiring, consistency, scalability, delegation. Cost: 2-4 weeks initial. ROI: Break-even on 3-4 new hires." },
      { q: "How do I optimize a system?", a: "Map: Input → Process → Output. Identify waste: Unnecessary steps, manual work, delays. Optimize: Reduce steps (faster), automate (remove manual), delegate (better person). Cost: £5-20K typically. Benefit: 20-50% improvement (faster, cheaper, more consistent)." }
    ],
    videoUrl: ""
  }
];

export default batch270Articles;