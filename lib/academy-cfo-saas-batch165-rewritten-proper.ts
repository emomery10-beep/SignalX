import { AcademyArticle } from "@/types/academy";

export const batch165Articles: AcademyArticle[] = [
  {
    slug: "product-market-fit-and-validation",
    title: "Product-Market Fit and Validation: Proving Your Idea Has a Market",
    description: "Master product-market fit. Validate your market, iterate on product-market fit, and recognize when you've achieved it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 8,
    keywords: [
      "product-market fit",
      "market validation",
      "customer validation",
      "product iteration",
      "market demand",
      "customer feedback",
      "market research",
      "MVP testing",
      "product development",
      "customer discovery"
    ],
    keyTakeaways: [
      "Product-market fit: Customers want your product, willing to pay, and use it regularly. Signs: Word-of-mouth growth (10%+ monthly organic), high retention (>90% after 3 months), <2% churn, strong NPS (>50), customers asking for features (not you selling). Don't confuse vanity (signups, downloads) with fit (usage, retention, willingness to pay). Test: Launch to 100 real customers, measure retention. If 50%+ still use after 3 months, likely fit.",
      "Validation framework: (1) Problem validation (customers have pain, willing to pay to fix). (2) Solution validation (your solution solves their pain, not just a nice-to-have). (3) Market validation (big enough market to be material). (4) Business model validation (unit economics work at scale). Each validates separately. Example: Good problem (validation 1) but wrong solution (fail #2). Or good solution but tiny market (fail #3).",
      "Iterating to fit: Start with hypothesis (\"agencies need better scope management\"). Test with 10 customers (conduct interviews, prototype, mock-ups). Gather feedback (\"yes, scope problems, but billing is bigger\"). Iterate (pivot to billing focus, repeat). Measure: Track customer interviews, feedback patterns, feature requests. 3 months of consistent feedback signals fit. Without fit = spinning wheels, eventually fail."
    ],
    content: [
      {
        heading: "Understanding Product-Market Fit",
        body: `What is product-market fit and why it matters.

**Product-Market Fit Definition**

Product-market fit: The state where product resonates deeply with market.

Signs of fit:
- Customers using product regularly
- High retention (customers staying)
- Word-of-mouth growth (organic)
- Customers asking for features (not you selling)
- Willingness to pay (customers see value)
- NPS >50 (customers recommending)

Absence of fit:
- High churn (customers leaving)
- No word-of-mouth growth
- Hard to sell (lots of convincing needed)
- Features not used
- Customers paying but not using (forced)

Importance:
- Without fit: Expensive to acquire, customers leave, hard to scale
- With fit: Customers attract other customers, retention strong, growth is easy

**Vanity Metrics vs True Fit**

Vanity metrics (don't indicate fit):
- Total signups (people trying)
- Total downloads (not necessarily using)
- Website visitors (awareness, not fit)
- Total customers acquired (could be one-time buyers)

Real indicators (show actual fit):
- % active users (using regularly)
- Retention rate (staying after initial)
- NPS (recommending to others)
- Churn rate (how fast leaving)
- Revenue concentration (customers willing to pay)

Example:
- App: 10,000 downloads (wow!)
- But: 1,000 active users (10%), 50% churn monthly (bad)
- Verdict: No product-market fit (vanity metrics high, real metrics poor)

vs

- App: 1,000 downloads, 800 active users (80%), 5% churn (good)
- Verdict: Likely product-market fit

Lesson: Focus on real metrics, ignore vanity.

**The S-Curve of Growth**

Growth trajectory from idea to fit:

Phase 1: Flat (pre-fit)
- Lots of activity, slow growth
- 3-6 months (or longer) of effort, small traction
- High churn, hard to convince
- Feels like "pushing rope"

Phase 2: Inflection (achieving fit)
- Growth accelerates
- Month 6-12, suddenly customers come faster
- Word-of-mouth kicks in
- Churn drops, retention improves

Phase 3: Growth (post-fit)
- Exponential growth
- Month 12+, efficient scaling
- Operations focus, can raise funding

Most founders give up in Phase 1 (thinking they're wrong).

Reality: Phase 1 is normal. Push through.

Metrics:
- Phase 1: 1-5% monthly growth, high churn (3-5%)
- Inflection: 10%+ monthly growth, churn dropping (2-3%)
- Phase 3: 20%+ monthly growth, churn <2%

`
      },
      {
        heading: "Validating Product-Market Fit",
        body: `Testing whether fit exists.

**The Four Validations**

Problem validation: Does the problem exist and matter?
- Test: Interview 20 target customers (ask about their pain)
- Success: 80%+ confirm problem is real and painful
- Failure: <50% validate problem

Solution validation: Does your solution fix the problem?
- Test: Show 20 customers your solution (prototype, mockup, working MVP)
- Ask: Would you use this? Would you pay?
- Success: 80%+ say yes, could see themselves using it
- Failure: <50% see yourself using it

Market validation: Is the market big enough?
- Test: How many customers have the problem?
- Research: TAM (Total Addressable Market) analysis
- Success: >£10M market opportunity (material for startup)
- Failure: <£1M (too small)

Business model validation: Do unit economics work?
- Test: Do CAC/LTV work at scale?
- Formula: LTV/CAC > 3x (profitable)
- Success: Unit economics viable (can raise capital)
- Failure: CAC too high, LTV too low (not viable)

Example: Project management for agencies
- Problem validation: Talked to 15 agencies, 14 confirmed scope management pain ✓
- Solution validation: Showed prototype to 10 agencies, 8 said they'd use it ✓
- Market validation: ~5,000 agencies in UK, £1-2K/year per customer = £5-10M market ✓
- Business model: CAC £500, LTV £2K, 4x ratio ✓
- Verdict: All four validated, likely fit exists

**Testing for Fit**

Build a small test:

1. Create simple MVP (not perfect, just works)
2. Find 100 real customers (target audience)
3. Ship to them
4. Measure:
   - Usage: % actively using daily
   - Retention: % still using week 4, month 3
   - Churn: % cancelling monthly
   - NPS: Would recommend to others
   - Willingness to pay: % willing to pay

Retention curve success:
- Week 1: 80% active (onboarding drop OK)
- Month 1: 50% retained (acceptable)
- Month 3: 40% retained (good indicator of fit)

If 40%+ still using after 3 months: Likely product-market fit.
If <20% using after 3 months: No fit yet, iterate.

**Feedback Loops**

Gather feedback constantly:

Weekly customer interviews (5-10 customers):
- What did you love?
- What frustrated you?
- What would make you pay?
- Would you recommend to others?

Monthly product reviews:
- Consolidate feedback
- Identify patterns
- Prioritize next build
- Measure retention improvement

Patterns to look for:
- "Everyone asks for feature X" → Build it
- "People churn after month 2 because Y" → Fix Y
- "They love Z, recommend it" → Double down on Z

React to patterns:
- If pattern emerges, test it
- If confirmed, build it
- If not confirmed, ignore it

`
      },
      {
        heading: "Iterating to Product-Market Fit",
        body: `The journey from idea to fit.

**The Iteration Cycle**

Hypothesis → Test → Learn → Iterate

Example: Video conferencing startup

**Hypothesis 1:** "Small companies want cheaper Zoom alternative"
- Test: Build basic video conference, launch to 50 SMBs
- Learn: They use it, but churn 50% month 1 (video quality issues)
- Iterate: Fix video compression, retry

**Hypothesis 2:** "Video quality matters most"
- Test: Focus on HD, launch to 100 customers
- Learn: HD works, but 30% still churn (lack of integrations)
- Iterate: Add Slack/Teams integration

**Hypothesis 3:** "Integrations drive retention"
- Test: Launch with 5 integrations, target Slack users
- Learn: Retention improves to 70%, NPS improves
- Iterate: Confirm (likely fit) or add more integrations

Timeline: Each cycle = 2-4 weeks (fast feedback).

Total time to fit: 3-6 months typical (3-6 hypothesis cycles).

**Common Pivots During Iteration**

Pivot 1: Problem pivot
- Original: Video conferencing for SMBs
- Discover: Users don't care about video, want async support
- Pivot: Async-first communication tool
- Why: Market signals say different problem is bigger

Pivot 2: Customer pivot
- Original: Target SMBs (20 people)
- Discover: SMBs don't value it, but agencies love it
- Pivot: Target creative agencies
- Why: Feedback shows better fit with different segment

Pivot 3: Solution pivot
- Original: Full video conferencing
- Discover: People only use screen share + chat
- Pivot: Screen share + chat tool (remove video)
- Why: Simplify, focus on what customers want

Pivot 4: Pricing pivot
- Original: £99/month per team
- Discover: Too expensive, customers won't pay
- Pivot: £29/month per user (usage-based)
- Why: Aligns with customer willingness to pay

Pivots are normal. Don't see as failure.

**Measuring Progress to Fit**

Track three metrics month-by-month:

| Month | Cohort | 4-Week Retention | NPS | Churn |
|-------|--------|---|---|---|
| 1 | First 20 | 40% | 20 | 8% |
| 2 | Next 30 | 45% | 25 | 7% |
| 3 | Next 40 | 55% | 35 | 5% |
| 4 | Next 50 | 65% | 42 | 3% |
| 5 | Next 60 | 70% | 48 | 2% |

Trend: Improving (good sign).
Inflection: Month 4-5, retention 60%+, NPS >40, churn <3%.
Verdict: Achieved fit.

`
      },
      {
        heading: "Recognizing Product-Market Fit",
        body: `How to know when you've achieved it.

**Signs You've Achieved Fit**

✓ 60%+ 3-month retention (customers staying)
✓ NPS >50 (customers recommending)
✓ <2% monthly churn (stable customer base)
✓ Word-of-mouth growth >10% monthly (organic)
✓ Customers asking for features (not you selling features)
✓ LTV/CAC >3x (economics work)
✓ Organic signups >30% of total (not all paid ads)

If most checkboxes yes: Likely fit.
If most checkboxes no: Not fit yet, iterate.

**What Fit Enables**

Funding:
- VCs want to see fit before Series A
- Fit signals: "This will work at scale"
- Without fit: VCs won't fund (too risky)

Scaling:
- Fit = can spend more on acquisition
- Every customer you acquire has high LTV
- Can raise capital to scale

Hiring:
- Fit = product vision clear
- Can hire team confidently
- Pitch: "We have product-market fit, now scaling"

Without fit: Scaling is expensive and wasteful.

**Beyond Fit: Optimizing for Growth**

Once fit achieved, focus shifts:

Phase 1: Finding fit (achieve retention, NPS, churn metrics)
Phase 2: Scaling growth (invest in acquisition, sales, marketing)

Scaling levers:
- Increase marketing spend (CAC predictable)
- Build sales team (enterprise sales)
- Expand to new segments (proven fit in one, test new)
- Build integrations (switching costs)

Metrics to track:
- CAC (should be stable/decreasing as you scale)
- LTV (should be stable/increasing with cross-sell)
- Retention (should stay strong, don't sacrifice it for growth)
- NPS (measure satisfaction)

Rule: Scale acquisition only after fit confirmed.
Scaling before fit = fast burn, low retention (wasteful).

**When to Declare Fit**

Declare fit when:
- 3 consecutive months of strong metrics (60%+ retention, churn <2%)
- External validation (VCs interested, customers referring, press)
- Product is stable enough to scale
- Team aligned on go-to-market

DON'T declare fit:
- Just because growth is fast (vanity, could be paid traffic)
- After one successful cohort (need multiple)
- Without measuring retention (need 3+ month history)

Conservative approach: Require 6 months of consistent strong metrics.

`
      }
    ],
    relatedSlugs: [
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-ltv-cac-payback",
      "competitive-analysis-and-market-positioning",
      "pricing-strategy-and-price-optimization",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What is product-market fit?",
        a: "State where product resonates with market: customers use regularly, high retention (60%+ after 3 months), recommend to others (NPS >50), <2% churn, word-of-mouth growth. Not signups/downloads (vanity). Not early traction (could be friends). Real fit = sustained, organic, profitable. Takes 3-6 months of testing and iteration."
      },
      {
        q: "How do I test for product-market fit?",
        a: "Build MVP, launch to 100 real customers, measure: (1) Usage (% active weekly), (2) Retention (% still using month 3), (3) NPS (willing to recommend), (4) Churn (monthly). If 60%+ retained after 3 months, NPS >50, churn <2%, likely fit. If <30% retained, iterate and test again."
      },
      {
        q: "Is fast growth a sign of product-market fit?",
        a: "Not necessarily. Fast growth from paid ads = vanity. True fit = organic growth, word-of-mouth, customers recruiting other customers. Signs of true fit: Growth continues even if you pause paid ads. Organic signups >30% of total. Word-of-mouth >10% monthly. Measure both growth rate AND origin (organic vs paid)."
      },
      {
        q: "What should I do if I don't have product-market fit yet?",
        a: "Iterate: Gather customer feedback, identify patterns, test hypotheses. Each cycle: hypothesis → test → learn → iterate (2-4 weeks). Common iterations: pivot customer segment, change pricing, adjust features, solve different problem. Don't scale until fit confirmed. Be patient, stay lean, iterate quickly."
      }
    ],
    videoUrl: ""
  }
];

export default batch165Articles;
