import { AcademyArticle } from "@/types/academy";

export const batch55Articles: AcademyArticle[] = [
  {
    slug: "sales-pipeline-optimization-velocity",
    title: "Sales Pipeline Optimization: Increasing Velocity and Win Rate",
    description: "Optimize sales pipeline velocity and win rates. Reduce sales cycles, improve conversion rates, and increase revenue per deal.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "sales velocity",
      "pipeline velocity",
      "sales cycle",
      "win rate",
      "sales optimization",
      "conversion rate",
      "deal velocity",
      "sales process",
      "sales efficiency",
      "average deal size"
    ],
    keyTakeaways: [
      "Sales velocity = (Avg deal size × Win rate × Avg pipeline value) ÷ Sales cycle length; improving any lever increases velocity: shorter cycle (60 → 45 days) = 33% faster, higher win rate (30% → 40%) = 33% faster, larger deals (£50K → £75K) = 50% faster",
      "Typical SMB sales cycle: 6-8 weeks. Mid-market: 8-12 weeks. Enterprise: 16-26 weeks. If your cycle is 2x longer than benchmark, diagnose: longer discovery (process issue), more stakeholders (org issue), or deal complexity (product issue)",
      "Win rate benchmarks: SMB 40-50%, Mid-market 30-40%, Enterprise 20-30%. If win rate <benchmarks, diagnose: weak sales process (not qualifying early enough), poor messaging (not resonating with buyer), or weak competition/positioning"
    ],
    content: [
      {
        heading: "Sales Velocity Framework",
        body: `Sales velocity measures how quickly revenue is generated from pipeline.

Formula: Revenue velocity = (Average deal size × Win rate × Deal count) ÷ Sales cycle length

Example:

Sales metrics:
- Average deal size (ADS): £50K
- Win rate: 30%
- Deals in pipeline: 20
- Sales cycle: 90 days

Calculation:
- Revenue velocity = (£50K × 30% × 20) ÷ 90 days
- = (£300K) ÷ 90 days
- = £3,333 per day
- Annualized: £3,333 × 365 = £1.22M per year

This means: With current pipeline and process, this team generates £1.22M annually.

**Velocity Levers**

Four ways to improve velocity:

Lever 1: Increase average deal size (ADS)
- From: £50K
- To: £60K (20% increase)
- Impact: Revenue velocity +20%
- How: Upsell customers at close, improve pricing/packaging, target larger customers

Lever 2: Improve win rate
- From: 30%
- To: 36% (20% improvement, hitting 36% from 30%)
- Impact: Revenue velocity +20%
- How: Improve sales process, better qualification, stronger differentiation

Lever 3: Increase pipeline (deal count)
- From: 20 deals
- To: 25 deals (25% increase)
- Impact: Revenue velocity +25%
- How: More prospecting, higher lead flow, better lead nurture

Lever 4: Shorten sales cycle
- From: 90 days
- To: 72 days (20% reduction)
- Impact: Revenue velocity +25%
- How: Streamline approval process, reduce stakeholders, faster implementation

**Diagnosing Low Win Rate**

If win rate <benchmarks, diagnose:

Benchmark win rates:
- SMB: 40-50%
- Mid-market: 30-40%
- Enterprise: 20-30%

Diagnosis questions:

Q1: How many deals enter proposal stage?
- Healthy: 50%+ of qualified leads enter proposal
- Low: <30% of leads progress (early qualification failure)
- Fix: Improve qualification (SAL → SQL process)

Q2: How many proposals convert to close?
- Healthy: 50%+ of proposals close
- Low: <35% of proposals close (weak competitive position, pricing issue)
- Fix: Improve proposal (value-based, not features), better sales execution

Q3: What's the close rate by rep?
- If one rep has 40% close rate and another 15%, it's a skills/process issue
- High-performer's approach can be documented and taught
- Fix: Sales training, coaching, best practice sharing

Q4: What's the churn reason on lost deals?
- Competitive loss: 40% (lost to better competitor)
- Budget: 30% (customer can't afford)
- Fit: 20% (wrong use case)
- Price: 10% (too expensive)
- Fix depends on root cause (competitive training, lower pricing, better qualification)

**Diagnosing Long Sales Cycles**

If sales cycle >benchmark, diagnose:

Benchmark sales cycles:
- SMB: 6-8 weeks
- Mid-market: 8-12 weeks
- Enterprise: 16-26 weeks

Diagnosis questions:

Q1: Where do deals get stuck?
- Track time in each stage: Prospecting → Qualified → Discovery → Proposal → Negotiation → Closed
- If stuck in Discovery (4+ weeks), customers slow to engage (low priority) or sales slow to move forward
- Fix: Faster discovery process (prep agendas, ask better questions, move to proposal quickly)

Q2: How many stakeholders are involved?
- Typical: 3-5 stakeholders (user, manager, finance, legal)
- Long cycle: 7+ stakeholders (org complexity, consensus required)
- Fix: Map stakeholders early, identify champion, build stakeholder coalition

Q3: What's the purchasing process?
- Procurement required? Legal review? Multiple approval gates?
- Fix: Map buying process upfront, align with customer's timelines

Q4: Is implementation timeline affecting sales cycle?
- If customer requires 2-month implementation before paying, your sales cycle is effectively longer
- Fix: Offer faster implementation (SaaS should be quick onboarding)

**Example: Velocity Improvement Program**

Baseline metrics:
- Average deal size: £40K
- Win rate: 25%
- Pipeline: 30 deals
- Sales cycle: 100 days
- Velocity: (£40K × 25% × 30) ÷ 100 = £3K per day = £1.1M annual revenue generation

Goal: Increase velocity to £4K per day (+33%) through balanced improvement:

Target metrics:
- ADS: £50K (+25%)
- Win rate: 30% (+20%)
- Pipeline: 35 deals (+17%)
- Sales cycle: 80 days (-20%)

Calculation:
- Velocity: (£50K × 30% × 35) ÷ 80 = £6,562.5 per day = £2.4M annual

This is a 2.2x improvement in revenue generation.

How to achieve:

1. **Improve ADS (+25% to £50K)** (Quarter 1)
   - Evaluate pricing: Is current pricing too low?
   - Add premium tier or add-ons (target existing customers for upsell)
   - Sales training: Pitch higher value/larger customers, not SMB
   - Segment: Focus on mid-market (higher ADS) over SMB (lower ADS)
   - Investment: 2 weeks of pricing analysis, 4 weeks of sales training

2. **Improve win rate (+20% to 30%)** (Quarter 1-2)
   - Competitive analysis: Why are we losing to competitors?
   - Sales process: Tighten qualification (don't take unqualified deals to proposal)
   - Messaging: Improve value prop (speak to customer's pain, not features)
   - Objection handling: Train on common objections
   - Sales coaching: 1-on-1 coaching with reps below win rate target
   - Investment: Competitive training, sales coaching (ongoing)

3. **Increase pipeline (+17% to 35 deals)** (Quarter 1-2)
   - Demand generation: More leads (increase marketing spend)
   - Sales development: Hire SDR to focus on prospecting
   - Qualification: Faster qualification so reps focus on real opportunities
   - Lead nurture: Improve nurture to move leads to qualified faster
   - Investment: 1 new SDR hire (£50K) + marketing spend increase

4. **Shorten sales cycle (-20% to 80 days)** (Quarter 2-3)
   - Map buying process: Understand customer approval timeline
   - Discovery agendas: Pre-plan discovery calls, shorten time to proposal
   - Proposal speed: Template proposals, faster turnaround
   - Negotiation: Authority to close at lower negotiation burden (avoid long drawn-out deals)
   - Reduce scope: Faster initial sale, expansion later (land and expand model)
   - Investment: Sales process documentation, proposal templates

**Measuring Velocity Improvements**

Track weekly:

| Metric | Baseline | Month 2 | Month 4 | Month 6 |
|--------|----------|--------|--------|--------|
| ADS | £40K | £43K | £46K | £50K |
| Win rate | 25% | 27% | 28% | 30% |
| Pipeline | 30 | 31 | 33 | 35 |
| Sales cycle | 100 days | 95 | 87 | 80 |
| Daily velocity | £3K | £3.2K | £3.6K | £4K |
| Annual | £1.1M | £1.17M | £1.31M | £1.46M |

By month 6, team is generating £1.46M annually (vs. £1.1M baseline), a 33% improvement.

**Sales Cycle Reduction Strategies**

Specific tactics to reduce sales cycle:

1. **Sales acceleration**
   - Parallel processing: Move deal through multiple stages simultaneously
   - Traditional: Discover → Propose (sequential)
   - Accelerated: Discover + prep proposal while discovering (parallel)
   - Benefit: Saves 1-2 weeks per deal

2. **Economic buyer access**
   - Engage decision maker early (not just user)
   - Typical: User engagement, then escalate to manager/director
   - Accelerated: User + economic buyer in initial meeting
   - Benefit: Avoid surprises late in deal when economic buyer says "no"

3. **Compressed implementation**
   - Fast SaaS onboarding (should be 1 week, not 8 weeks)
   - If implementation is slow, delay purchasing (customer wants to see it work first)
   - Benefit: Remove implementation blocker from sales cycle

4. **Proposal templates**
   - Pre-built proposals reduce turnaround (from 3 days to 1 day)
   - Personalization still needed, but structure is ready
   - Benefit: Reduce proposal-to-close time

5. **Authority and approval limits**
   - Reps empowered to offer concessions (discount, extended terms) within limits
   - Avoid: "Let me check with my manager" on every question
   - Benefit: Faster negotiation, fewer approval loops

6. **Clear next steps**
   - Every call ends with explicit next step and deadline
   - "Let's reconnect Friday with your finance team"
   - Avoid: Vague "We'll follow up" (customer deprioritizes)
   - Benefit: Momentum, clear expectations

**Sales Cycle by Segment**

Typical cycles and reduction opportunities:

SMB (Self-serve, 6-8 week cycle):
- Baseline: 6-8 weeks
- Reduction target: 4-6 weeks
- Levers: Faster trials (1 week), quick demo, self-service options
- Implementation: Super-fast onboarding (existing customers support ramp)

Mid-market (Sales-led, 8-12 week cycle):
- Baseline: 8-12 weeks
- Reduction target: 6-10 weeks
- Levers: Multi-stakeholder meetings, faster procurement, clear ROI case
- Implementation: Sales playbook, ROI calculator, reference customers

Enterprise (Complex, 16-26 week cycle):
- Baseline: 16-26 weeks
- Reduction target: 12-20 weeks (small improvement, limited by org complexity)
- Levers: Executive sponsor, legal review in parallel, early budget confirmation
- Implementation: Customer advisory program, reference customer involvement

**Velocity Tradeoffs**

Warning: Optimizing for velocity can have downsides:

Risk 1: Larger deals with longer cycles
- Trying to shorten sales cycle might push reps to smaller deals (faster)
- But larger deals are often higher-value, worth the longer cycle
- Balance: Don't sacrifice deal quality for speed

Risk 2: Lower-quality leads
- Pushing for more pipeline quantity might lower quality
- Low-quality deals have low win rate (counterproductive)
- Balance: Increase pipeline, but maintain quality standards

Risk 3: Worse unit economics
- Shorter sales cycle + higher velocity might require more CAC spend
- Higher CAC might make unit economics worse (CAC payback longer)
- Monitor: Ensure CAC payback improves or stays same with velocity improvements

Sales velocity is a great high-level metric, but understand the components (ADS, win rate, pipeline, cycle) and optimize thoughtfully.
`
      }
    ],
    relatedSlugs: [
      "sales-pipeline-health-forecasting",
      "sales-efficiency-magic-number",
      "customer-acquisition-cost-optimization",
      "revenue-operations-revops-strategy",
      "sales-compensation-commissions"
    ],
    faq: [
      {
        q: "What's a good sales cycle for my business?",
        a: "SMB: 6-8 weeks. Mid-market: 8-12 weeks. Enterprise: 16-26 weeks. If 2x longer than benchmark, diagnose: discovery taking too long? Too many stakeholders? Implementation delay?"
      },
      {
        q: "How do I reduce sales cycle without sacrificing deal quality?",
        a: "Compress time-wasting stages (discovery agendas, proposal templates), not the important ones (qualification, stakeholder alignment). Parallel processing: engage economic buyer while discovering user needs."
      },
      {
        q: "What win rate should I target?",
        a: "SMB: 40-50%. Mid-market: 30-40%. Enterprise: 20-30%. If below, diagnose: qualification, competitive positioning, or messaging."
      },
      {
        q: "Can I increase ADS without losing deals?",
        a: "Yes, through upsells at close or targeting larger customers. But risky if forced: raises sticker shock, lowers conversion. Test slowly with specific customer segment."
      }
    ],
    videoUrl: ""
  }
];

export default batch55Articles;
