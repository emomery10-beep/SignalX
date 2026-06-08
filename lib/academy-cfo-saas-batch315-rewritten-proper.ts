import { AcademyArticle } from "@/types/academy";

export const batch315Articles: AcademyArticle[] = [
  {
    slug: "sales-methodology-and-frameworks",
    title: "Sales Methodology and Frameworks: Structured Sales Excellence",
    description: "Master sales frameworks. Implement methodology, scale sales, improve close rates.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["sales methodology", "sales framework", "consultative selling", "sales process", "deal management"],
    keyTakeaways: [
      "Sales methodology basics: Structured process for selling (discovery, qualification, proposal, negotiation, close). Popular: Sandler, Challenger Sale, Solution Selling, Consultative Selling. Benefit: Consistent results (all AEs follow same process), scalability (easy to train new AEs), predictability (forecast with confidence), repeatability (improve through iteration). Cost: Training (£5-20K), tool implementation (CRM, sales enablement). ROI: 20-40% improvement in win rate (first year typical).",
      "Process stages: (1) Lead generation (inbound/outbound), (2) Discovery (understand customer problem), (3) Qualification (is this a good fit?), (4) Solution development (build proposal), (5) Negotiation (terms discussion), (6) Close (signature). Timeline: 1-3 months typical for SMB SaaS, 3-6 months for enterprise. AE discipline: Follow process (don't skip steps), document (track in CRM), review (manager coaching).",
      "Metrics and monitoring: Win rate (% of qualified deals close), deal cycle (days from qualification to close), deal size (average ACV), pipeline (qualified opportunities), forecast accuracy (predict month revenue). Dashboard: Weekly review (pipeline health, deals at risk), monthly (won/lost analysis). Coaching: Manager reviews deals, identifies improvements (objection handling, discovery depth, proposal quality)."
    ],
    content: [
      {
        heading: "Building a Scalable Sales Process",
        body: `Creating repeatable, high-performing sales methodology.

**Sales methodology overview**

What is sales methodology?
- Structured approach to selling (defined stages, activities, deliverables)
- Consistency: All AEs follow same process (vs each doing their own thing)
- Scalability: New AEs trained on process (ramp faster)
- Improvement: Analyze what works, optimize process over time

Popular methodologies:

Consultative Selling:
- Focus: Customer's problem (not your product)
- Process: Deep discovery → tailor solution → present → negotiate
- Best for: Solutions selling, complex deals, high ACV
- Strength: High trust, strong close rates, larger deal size

Sandler Methodology:
- Focus: Qualification (don't pursue bad fits), agreement (customer commitment)
- Process: Build rapport → qualify budget/authority/need/timeline → present → close
- Best for: Efficient selling, aggressive targets, inside sales
- Strength: Efficient (avoid time wasters), predictable

Challenger Sale:
- Focus: Teach customer (challenge their thinking), align to your solution
- Process: Teach about market/trends → tailor → collaborate → close
- Best for: B2B, enterprise, need to differentiate
- Strength: Establish authority, win large deals

MEDDIC:
- Focus: Deal qualification (Metrics, Economic buyer, Decision criteria, Decision process, Identify pain, Champion)
- Process: Deep qualification → build champion → navigate politics → close
- Best for: Enterprise deals, long cycles, complex decisions
- Strength: Predictable, repeatable, high close rate for qualified deals

**Building your sales process**

Stage 1: Inbound leads
- Source: Website, community, referrals, content
- Activity: Lead assignment, quick qualification call (15 min)
- Gate: Does customer fit basic profile? (right company size, problem)
- Output: If yes → discovery meeting scheduled

Stage 2: Discovery
- Activity: 30-60 min call (understand customer problem)
- Goals: (1) Understand their business, (2) Understand their problem, (3) Assess if solution fit
- Questions: What are you trying to solve? Who else is involved? Timeline?
- Output: Decision → qualified opportunity or no-fit close

Stage 3: Qualification
- Activity: Gather detailed info (budget, authority, timeline, decision process)
- Qualification criteria: Budget (do they have it?), Authority (is this person decision-maker?), Need (is our solution right?), Timeline (when decide?)
- Output: Qualified opportunity (move to proposal) or disqualified (stop pursuing)

Stage 4: Solution development
- Activity: Build proposal (customized to their needs)
- Content: Problem restatement, solution overview, pricing, timeline, ROI
- Review: Manager reviews before sending (quality control)
- Output: Proposal sent (wait for response)

Stage 5: Negotiation
- Activity: Discuss terms, address objections, negotiate price/timeline
- Typical: Customer asks for discount, longer trial, feature request
- Strategy: Listen to real objection (don't discount immediately), offer alternatives
- Output: Agreement on terms (move to close)

Stage 6: Close
- Activity: Contract signature, payment, implementation kickoff
- Common delays: Legal review, approvals, budget confirmation
- Push: Momentum (don't let deal stall), urgency (deadline if available)
- Output: Closed/won, customer onboarded

Example timeline:

| Week | Activity | Duration | Notes |
|---|---|---|---|
| Week 1 | Lead in → discovery call | 1 week | Fast conversion |
| Week 2 | Discovery → demo → qualification | 1 week | Gather info |
| Week 3-4 | Proposal creation + review | 2 weeks | Customized proposal |
| Week 5 | Negotiation | 1 week | Address objections |
| Week 6 | Close (signature + payment) | 1 week | Final execution |
| **Total** | **Lead to close** | **6 weeks** | **Typical SMB SaaS** |

**Sales metrics and discipline**

Pipeline metrics:

| Stage | Count | Conversion | Win Rate |
|---|---|---|---|
| Leads | 100 | 20% → | 20 opportunities |
| Qualified opps | 20 | 50% → | 10 in negotiation |
| Proposals sent | 10 | 70% → | 7 close |
| Won | 7 | 100% | 7 customers |

Overall: 100 leads → 7 customers = 7% conversion rate

Sales efficiency:
- Sales cycle: 6 weeks average (lead to close)
- Deal size: £10K ACV average
- Win rate: 70% of proposals (industry benchmark 40-60%)
- Productivity: 1 AE → 1 customer/week = £40K MRR per AE

CRM discipline:

Required:
- Log all activity (calls, emails, meetings) in CRM
- Update deal status (stage accurate)
- Document next steps (what's happening next?)
- Add notes (context for other team members)
- Close/loss reason (why did we win/lose?)

Weekly manager review:
- Pipeline review: Total pipeline, conversion by stage
- At-risk deals: Deals that might stall/close lost
- New opportunities: New deals in pipeline
- Forecast: Month revenue prediction
- Coaching: Deals with issues (help AE succeed)

Example review:

AE: Alice
- Pipeline: £100K (5 deals)
- This month forecast: £20K (2 deals closing)
- At-risk: Deal A (customer quiet 1 week, need follow-up), Deal B (waiting on legal)
- New: Deal C came in, opportunity looks good
- Issue: Only 7% of deals closing, benchmark 20% (problem?)
- Plan: Review sales calls, improve discovery, shorten cycle

**Sales coaching and improvement**

Common issues and coaching:

Issue: Long discovery (wasting time on bad fits)
- Root cause: Not qualifying hard enough
- Coaching: Ask harder questions, be willing to disqualify
- Metric: Reduce discovery meetings that don't advance, increase win rate (fewer bad fits)

Issue: Low close rate (30% vs 60% benchmark)
- Root cause: Weak proposal, poor objection handling, or bad customer fit
- Diagnosis: Review closed/lost (why did we lose?), listen to calls
- Coaching: Improve proposal quality, handle objections better, disqualify early

Issue: Long sales cycle (10 weeks vs 6 week target)
- Root cause: Long negotiation, slow customer decision, poor urgency
- Coaching: Create urgency (deadline), follow up faster, push for decisions
- Metric: Reduce average cycle time

Role-playing and training:
- Common: Objection handling (customer says "too expensive", "need to think", "competitor better")
- Practice: Manager plays customer, AE practices response
- Feedback: What worked, what could improve?
- Frequency: Monthly training session (30 min)

**Sales territory and quota**

Territory planning:

| Territory | Target | Customers | ACV | Quota |
|---|---|---|---|---|
| East | 10 | 10 new customers | £10K | £100K |
| West | 10 | 10 new customers | £10K | £100K |
| Mid | 5 | 5 new customers | £15K | £75K |
| Enterprise | 2 | 2 new customers | £50K | £100K |

Quota setting:
- Bottom-up: Territory potential (how many customers possible?)
- Top-down: Company target (£375K total / 3 AEs = average quota)
- Fair: Account for territory differences, AE experience

Quota assignment:
- New AE: 60-70% quota (learning curve)
- Experienced AE: 100-120% quota (stretch)
- Superstar: 150%+ quota (achieve and excel)

**Scaling sales with process**

Hire AE 1:
- You (founder) + 1 AE = 2 people selling
- Process: Informal, lots of ad-hoc
- Problem: Doesn't scale

Hire AE 2:
- 2 AEs need process (consistency)
- Create: Sales playbook, CRM setup, sales meetings
- Benefit: Can train AE 2 faster, predict results

Hire AE 3-5:
- Hire VP Sales (if 5+ AEs)
- Process: Formal, weekly meetings, sales coaching
- Scaling: Onboarding faster (clear process), predictable results

Example scaling:
- AE 1: Ad-hoc, learning = 5-10 deals/month
- AE 2-3: Process, formal = 8-12 deals/month each
- AE 4-5: Optimized = 10-15 deals/month each
- Total: 1 AE = 7 deals, 5 AEs = 50+ deals (7x efficiency with process)

**Implementation roadmap**

Month 1: Foundation
- Define process: Map sales stages, activities, gates
- Documentation: Write sales playbook (1-2 pages per stage)
- CRM setup: Sales stages in CRM match your process
- Training: Train all AEs on new process
- Cost: 1-2 weeks time

Month 2: Execution
- Track: All deals in CRM, discipline on stages
- Review: Weekly pipeline review with AEs
- Coaching: Help AEs follow process
- Refinement: Adjust process based on learning

Month 3+: Optimization
- Analysis: Win/loss analysis (why we win/lose?)
- Improvement: Refine process based on data
- Scaling: Use process to train new AEs
- Measurement: Track metrics (win rate, cycle time, deal size)

**Success metrics**

Baseline (no process):
- Win rate: 40% (inconsistent)
- Sales cycle: 10 weeks (varies 2-16 weeks)
- Deal size: £8K (varies wide)
- Forecast accuracy: 50% (hard to predict)
- Ramp time (new AE): 6 months (long learning curve)

After implementing process:
- Win rate: 60%+ (consistent, coachable)
- Sales cycle: 6 weeks (predictable)
- Deal size: £10K (more consistent)
- Forecast accuracy: 80%+ (predictable)
- Ramp time: 3 months (process helps train)

Impact:
- Same AE with good process: 50% more deals (better execution)
- New AE adoption faster: Trained on proven process
- Revenue predictability: Better forecasting

`
      }
    ],
    relatedSlugs: ["sales-pipeline-management-and-forecasting", "sales-compensation-structures-and-incentives", "hiring-and-talent-acquisition-strategy", "customer-acquisition-strategy-and-marketing-roi", "win-loss-analysis-and-competitive-intelligence"],
    faq: [
      { q: "What sales process should I implement?", a: "Core stages: (1) Lead generation, (2) Discovery (understand problem), (3) Qualification (budget/authority/need/timeline), (4) Proposal (customized solution), (5) Negotiation (terms), (6) Close. Document process (playbook), train all AEs, track in CRM. Discipline: All deals follow process (no skipping), manager reviews weekly (coaching). Popular frameworks: Consultative Selling, Sandler, Challenger Sale, MEDDIC." },
      { q: "What's the typical ROI of implementing sales process?", a: "Improvement: Win rate +20% (40% → 60%), sales cycle -30% (10 weeks → 6 weeks), deal size +25% (£8K → £10K). Revenue impact: Same AE produces 40-50% more revenue. Scaling: New AEs ramp faster (3 months vs 6 months). Cost: Training (£5-20K), CRM setup (£0-10K). ROI: Positive within first month (better execution)." },
      { q: "How do I improve sales metrics?", a: "Weekly review: Pipeline (total, by stage), win rate, cycle time. Analysis: Which deals are stuck? Why? Coaching: AEs following process? Improve discovery, objection handling. Refinement: Track what works (win/loss analysis), iterate process. Measurement: Win rate, cycle time, deal size trends. Goal: Consistent improvement (1-2% month)." }
    ],
    videoUrl: ""
  }
];

export default batch315Articles;