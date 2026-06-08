import { AcademyArticle } from "@/types/academy";

export const batch355Articles: AcademyArticle[] = [
  {
    slug: "continuous-improvement-and-operational-excellence",
    title: "Continuous Improvement and Operational Excellence: Building a Learning Culture",
    description: "Master continuous improvement. Build feedback loops, optimize processes, improve culture.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["continuous improvement", "operational excellence", "process optimization", "learning culture", "kaizen"],
    keyTakeaways: [
      "Continuous improvement: Small, regular improvements beat one-time big changes. Example: 1% monthly improvement = 12% annual improvement (compound). Process: (1) Identify bottleneck (what's slowing us down?), (2) Measure (how bad is it?), (3) Implement change (small test), (4) Measure impact (did it help?), (5) Scale or iterate (keep if works, adjust if not). Cost: Time (maybe £0 money). ROI: Very high (efficiency gains, cost reduction, team engagement).",
      "Retrospectives: \"What went well? What didn't? What will we change?\" Format: Team meeting (30-60 min), honest feedback, psychological safety, action items. Frequency: Monthly (team retro) or quarterly (all-company retro). Example: \"Marketing campaign had low ROI, analyzing why (bad targeting, creatives), will adjust channels next quarter.\" Benefit: Team learns, processes improve, people feel heard.",
      "Metrics-driven improvement: Identify key metric, measure baseline, set target, implement changes, measure impact. Example: CAC baseline £500, target £300, implement new channels (save £100), improve conversion (save £100), iterate. Timeline: 3-6 months for major changes. Key: Data shows what works (not opinions, intuition)."
    ],
    content: [
      {
        heading: "Building a Culture of Continuous Improvement",
        body: `Creating systems and practices for ongoing optimization.

**Continuous improvement fundamentals**

Philosophy:
- Small, regular improvements > one-time big changes
- Everyone contributes (not just management)
- Data-driven (measure, don't guess)
- Learning culture (failures are learning)

Math of improvement:

1% monthly improvement:
- Month 1: 100% (baseline)
- Month 12: 100% × 1.01^12 = 112.7% (12.7% improvement)
- Year 5: 100% × 1.01^60 = 181.7% (81.7% improvement!)

5% annual improvement (ambitious):
- Year 1: 105%
- Year 5: 127.6%
- Year 10: 162.9%

Consistency matters (small regular > occasional big)

Process:

Step 1: Identify bottleneck
- Where is most friction (slowest, most expensive, most error-prone)?
- Ask team (they know where problems are)
- Measure (quantify the problem)

Step 2: Measure baseline
- Current state: How long does it take? How much does it cost? How many errors?
- Example: Onboarding process takes 2 weeks, 30% new customers churn in month 1

Step 3: Implement change (small)
- Test: Don't change whole process, just one part
- Example: Add personal onboarding call (week 1), see if churn improves
- Cost: Minimal (time to run experiment)

Step 4: Measure impact
- Did it help? By how much?
- Example: Churn reduced from 30% to 25% (5% improvement)
- Timeframe: 2-4 weeks to measure (depending on metric)

Step 5: Scale or iterate
- If it works: Implement for everyone
- If mixed results: Refine and test again
- If doesn't work: Try something else (learn and move on)

**Retrospectives (feedback loops)**

Monthly retrospective:

Purpose:
- What went well? (celebrate)
- What didn't? (learn)
- What will we change? (improve)

Format:
- Team meeting (30-60 min)
- Participants: Team that worked together (e.g., all of marketing)
- Facilitator: Manager or neutral person

Process (1 hour):

00:00-00:15: What went well?
- Good work: What are we proud of?
- Example: "Launched new feature, customers loved it"
- Celebrate (morale)

00:15-00:35: What didn't go well?
- Challenges: What was hard?
- Mistakes: What did we miss?
- Example: "Launch took 2 weeks longer than planned (why?), timeline planning was poor"
- Honest feedback (psychological safety)

00:35-00:50: What will we change?
- Action items: What will we do differently?
- Owner: Who is responsible?
- Timeline: When will we implement?
- Example: "Improve timeline planning (owner: PM, timeline: implement in next sprint)"

00:50-01:00: Commit and document
- Document (record decisions)
- Commit (everyone agrees)
- Schedule next retro (same time next month)

Quarterly company retrospective:

Same format, but company-wide:
- CEO facilitates
- All-hands (whole company)
- Company-level wins (product launch, fundraising, team growth)
- Company-level challenges (market shift, competition, execution issues)
- Changes (company-wide improvements)

Example agenda:

"Q2 retrospective"
- Wins: Launched tier, closed 3 enterprise customers, grew from 8 to 10 people
- Challenges: CAC increased (market cost inflation), churn spiked (product issue), hiring slower than planned
- Changes: (1) Shift marketing to lower-cost channels, (2) Product focus on retention, (3) Partner with recruiter (speed up hiring)

**Identifying and fixing bottlenecks**

Common bottlenecks:

Bottleneck 1: Slow hiring
- Baseline: 2 months to hire per role
- Cost: Unfilled role = lost revenue (product team 20% slower)
- Solution: Partner with recruiter (shorten to 6 weeks), improve job description, expand pool
- Impact: 50% faster hiring

Bottleneck 2: Poor customer onboarding
- Baseline: 30% churn in month 1
- Cost: 30 customers × £100 LTV = £3K lost monthly
- Solution: Personal onboarding call, improved docs, in-app tutorials
- Impact: Reduce to 15% churn = £1.5K savings monthly = £18K annual

Bottleneck 3: Slow sales cycle
- Baseline: 60-day sales cycle (slow)
- Cost: Slower revenue growth, deals pile up
- Solution: Improve discovery (sales training), streamline process, faster approvals
- Impact: Reduce to 45 days = 20% faster = 20% more deals closed

Bottleneck 4: Too many meetings
- Baseline: 30 hours/week in meetings
- Cost: No time for actual work
- Solution: Reduce meetings (cut low-value), consolidate, make async
- Impact: Reclaim 10 hours/week = major productivity boost

**Metrics-driven improvement**

Framework:

Step 1: Pick metric
- What matters most? (revenue, churn, CAC, NPS, efficiency)
- Example: CAC (customer acquisition cost) is £500, want £300

Step 2: Understand drivers
- What causes this metric?
- Example: CAC = (marketing spend) / (new customers)
  - Current: £100K spend / 200 customers = £500 CAC
  - To improve: Spend less OR acquire more

Step 3: Test levers
- Which lever will move the needle?
- Lever A: Reduce spending on low-ROI channels
- Lever B: Improve conversion (more customers from same spend)
- Lever C: Shift to lower-cost channels

Step 4: Implement and measure
- Try lever A: Cut Adwords (£20K spend, 40 customers) → spend £80K
- New CAC: £80K / 200 = £400 (£100 improvement, 20% reduction!)
- BUT: Lost Adwords customers (40), so new customers only 160
- New spend/customer: £80K / 160 = £500 (no improvement)
- Conclusion: Cutting Adwords doesn't help (needed those customers)

Step 5: Try different lever
- Lever B: Improve conversion (better landing page, CTA)
- Test: 50% of traffic gets new landing page
- Result: +25% conversion
- Impact: Same £100K spend, 250 customers (vs 200 before)
- New CAC: £100K / 250 = £400 (£100 improvement!)
- Scalable: Roll out to all traffic

**Continuous improvement metrics dashboard**

Track improvement:

| Category | Metric | Baseline | Target | Current | Progress |
|---|---|---|---|---|---|
| Sales | CAC | £500 | £300 | £400 | -20% (on track) |
| Sales | Sales cycle | 60 days | 45 days | 50 days | +16% (improving) |
| CS | Onboarding churn | 30% | 15% | 22% | +26% (improving) |
| Ops | Hiring time | 60 days | 45 days | 50 days | +16% (improving) |
| Product | NPS | 25 | 40 | 32 | +28% (improving) |

Review monthly: Are we trending toward targets?

**Common improvement mistakes**

Mistake 1: Change everything at once
- Problem: Too many changes, can't tell what worked
- Fix: One change at a time, measure impact, then next
- Impact: Clear learning (what works, what doesn't)

Mistake 2: Change without measurement
- Problem: "We'll improve the process" but don't measure
- Fix: Baseline first (current state), then measure post-change
- Impact: Know if improvement actually worked

Mistake 3: Don't get team input
- Problem: Manager decides changes, team doesn't buy in
- Fix: Involve team (retrospective, brainstorm solutions)
- Impact: Team ownership (changes stick)

Mistake 4: Large changes instead of small
- Problem: Big reorg takes 3 months, risky, hard to rollback
- Fix: Small experiment (2-week test), measure, then scale
- Impact: Lower risk (fast to test, easy to rollback)

Mistake 5: No accountability
- Problem: "We'll improve" but no one owns it
- Fix: Assign owner (who is responsible?), deadline (when?)
- Impact: Actually happens (accountability)

`
      }
    ],
    relatedSlugs: ["metrics-dashboard-design-kpi-tracking", "annual-planning-and-strategy-execution", "stakeholder-alignment-and-communication-cadence", "financial-planning-and-budgeting", "profitability-analysis-and-operating-leverage"],
    faq: [
      { q: "How do I create a culture of continuous improvement?", a: "Mechanisms: (1) Monthly retrospectives (team feedback), (2) Identify bottlenecks (what's slowing us?), (3) Small experiments (test change, measure), (4) Data-driven (measure, don't guess). Benefits: 1% monthly = 12% annual, team engaged, processes improve. Cost: Time (meetings). ROI: High (efficiency + engagement)." },
      { q: "What should we discuss in retrospectives?", a: "Format: \"What went well? What didn't? What will we change?\" Time: 30-60 minutes, monthly (team) or quarterly (company). Participants: Team that worked together. Purpose: Celebrate wins, learn from mistakes, improve process. Action items: What will we change (owner, timeline)? Document and implement." },
      { q: "How do I use metrics to drive improvement?", a: "Process: (1) Pick metric (baseline: CAC £500, target £300), (2) Understand drivers (marketing spend, conversion), (3) Test levers (reduce spend, improve conversion), (4) Measure impact (did it work?), (5) Scale (if works). Timeline: 2-4 weeks per test. Data-driven: Facts, not opinions." }
    ],
    videoUrl: ""
  }
];

export default batch355Articles;
