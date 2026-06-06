import { AcademyArticle } from "@/types/academy";

export const batch71Articles: AcademyArticle[] = [
  {
    slug: "burn-rate-runway-planning",
    title: "Burn Rate and Runway: How Long Until You Run Out of Money?",
    description: "Calculate your monthly burn rate and runway. Plan fundraising and profitability timelines based on cash consumption.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: [
      "burn rate",
      "monthly burn",
      "runway",
      "cash runway",
      "cash consumption",
      "profitability planning",
      "fundraising timeline",
      "burn down",
      "burn analysis",
      "cash management"
    ],
    keyTakeaways: [
      "Burn rate = monthly cash expense (not accounting profit); formula: (total monthly spend − monthly revenue) = monthly burn; example: £500K monthly spend, £150K revenue = £350K burn; runway: cash in bank ÷ burn rate; with £1.4M in bank, £350K burn = 4 months runway; burn rate is lifeblood metric—raises money before runway depletes",
      "Runway planning: Series A (raise every 18-24 months), Series B (raise every 24 months), Series C (raise every 24-36 months); 12+ months runway is comfort zone, <6 months is crisis; common mistake: founders underestimate burn or overestimate revenue, runway shrinks faster than expected",
      "Burn vs. profitability: Burn £350K/month at £2M ARR (21% burn ratio) = growth mode (acceptable); burn £350K at £500K ARR (84% burn ratio) = unsustainable (need unit economics fix or cost cut); burning should slow as you scale (improving leverage), not stay flat; monitor burn trajectory"
    ],
    content: [
      {
        heading: "Understanding Burn Rate and Runway",
        body: `Burn rate is how fast you're spending money. Runway is how long you can operate before running out of cash. Both are critical survival metrics for SaaS companies.

**Burn Rate Definition**

Burn rate is monthly cash consumption (negative cash flow).

Formula:
\`\`\`
Monthly burn rate = Total monthly cash expenses − Monthly cash revenue
\`\`\`

Cash expenses include:
- Salaries and benefits
- Server/infrastructure costs
- Software licenses and tools
- Marketing and sales spend
- Facilities, insurance, legal

Important: Use cash expenses, not GAAP accounting. Don't include non-cash items (depreciation, stock option expense).

Example:

| Item | Monthly |
|------|---------|
| Salaries (5 people, £60K avg) | £300K |
| AWS and infrastructure | £40K |
| Tools (Salesforce, Analytics, etc.) | £15K |
| Marketing spend | £30K |
| Rent and facilities | £10K |
| Other (legal, insurance, etc.) | £15K |
| **Total monthly expenses** | **£410K** |
| Monthly revenue (MRR) | £100K |
| **Monthly burn** | **£310K** |

**Runway Definition**

Runway is how many months you can operate at current burn rate before cash depletes.

Formula:
\`\`\`
Runway (months) = Cash in bank ÷ Monthly burn rate
\`\`\`

Example:

Bank balance: £1,550,000
Monthly burn: £310,000
Runway: £1,550K ÷ £310K = 5 months

You have 5 months to reach profitability or raise money.

**Runway Benchmarks by Stage**

| Stage | Typical runway | Comfort threshold |
|-------|--------|--------|
| Series A | 12-18 months | 12+ months (comfortable) |
| Series B | 18-24 months | 18+ months (comfortable) |
| Series C | 24-36 months | 24+ months (comfortable) |
| Growth stage (pre-IPO) | 36-60 months | 36+ months (comfortable) |

Rules of thumb:
- <3 months runway: Crisis (must fundraise or cut immediately)
- 3-6 months runway: Warning (start fundraising)
- 6-12 months runway: Acceptable (should fundraise, but not panic)
- 12-24 months runway: Healthy (comfortable position)
- 24+ months runway: Strong (can weather market changes)

**Why Burn Rate Matters**

Burn rate determines:
1. **Fundraising urgency**: Need to raise before cash runs out
2. **Growth constraints**: Can't outspend runway
3. **Hiring capacity**: Limits headcount growth
4. **Product priorities**: Must focus on what drives revenue

Example:

Company A:
- Burn: £100K/month
- Runway: 24 months
- Can experiment, take risks, hire aggressively

Company B:
- Burn: £100K/month (same)
- Runway: 4 months
- Must hit milestones or cut costs
- Any delay in fundraising is catastrophic

Same burn rate, different runway = completely different strategy.

**Burn Rate Trends**

Burn rate should improve over time:

| Month | Burn | Revenue | Burn ratio | Status |
|-------|------|---------|-----------|--------|
| 1 | £300K | £20K | 93% | Heavy burn, early stage |
| 6 | £350K | £75K | 78% | Growing but still burning |
| 12 | £380K | £150K | 60% | Revenue growing faster than burn |
| 18 | £400K | £250K | 38% | Approaching breakeven |
| 24 | £400K | £400K | 0% | Breakeven |

Burn rate absolute £ may increase (hiring, expansion), but burn ratio (% of revenue) should decrease. If burn ratio flat or increasing, you have efficiency problem.

Red flag: Burn increasing faster than revenue.

Example:
- Month 1: £200K burn, £50K revenue, 75% burn ratio
- Month 6: £400K burn, £100K revenue, 80% burn ratio (getting worse)
- This trajectory is unsustainable

**Cash Runway Scenarios**

Scenario A: Runway extends as revenue grows

Month 1: £1M cash, £300K burn, £50K revenue → 3.3 months runway
Month 6: £1.2M cash, £350K burn, £150K revenue → 3.4 months runway
Month 12: £1.5M cash, £380K burn, £250K revenue → 3.9 months runway
Month 18: £1.8M cash, £400K burn, £400K revenue → 4.5 months runway
Month 24: £1.8M cash, £400K burn, £500K revenue → 4.5 months runway

Runway improves steadily. Revenue growth + modest burn = lengthening runway.

Scenario B: Runway collapses if expenses grow but revenue stalls

Month 1: £1M cash, £300K burn, £50K revenue → 3.3 months runway
Month 6: £1.2M cash, £400K burn (new hires), £100K revenue → 3 months runway
Month 12: £1.5M cash, £450K burn (more hiring), £120K revenue → 3.3 months runway
Month 18: £1.8M cash, £500K burn, £140K revenue → 3.6 months runway

Runway stable but tight. One market slowdown and runway collapses.

This happens when:
- Hiring > revenue growth
- Burn acceleration > revenue acceleration
- Classic mistake of early-stage companies

**Profitability Timeline**

Burn rate determines when you reach profitability (revenue = expenses).

If:
- Current burn: £300K/month
- Current revenue: £50K/month
- Burn rate declining: 10% per month (improving leverage)

Then:

| Month | Revenue growth | Burn improvement | Monthly result |
|-------|--------|--------|--------|
| 1 | £50K | £300K | -£250K |
| 6 | £85K | £255K | -£170K |
| 12 | £145K | £216K | -£71K |
| 18 | £248K | £184K | +£64K (breakeven) |

You reach profitability in 18 months if you execute (improve leverage, grow revenue).

If revenue growth stalls but burn stays flat:
- Month 1: £50K revenue, £300K burn
- Month 12: £60K revenue, £300K burn (growth stopped)
- Profitability: Never (unless you cut costs)

Profitability requires both: Revenue growth + burn discipline.
`
      },
      {
        heading: "Managing Burn Rate and Planning Fundraising",
        body: `Burn rate is a tool for planning fundraising, hiring, and profitability. Use it strategically.

**Burn Rate Types**

1. **Net burn**: Revenue − total expenses
   - Most conservative (what actually depletes cash)
   - Formula: Total cash expenses − cash revenue

2. **Gross burn**: Total cash expenses only
   - Ignores revenue (how much you're spending)
   - Useful for comparing to peers (who also have varying revenue)
   - Formula: Total monthly expenses

3. **Payback burn**: How long to break even on cash burn
   - Formula: Cash in bank ÷ (burn − revenue growth rate)
   - More nuanced (accounts for revenue trajectory)

Example:

Total expenses: £400K/month
Revenue: £100K/month

Net burn: £300K/month
Gross burn: £400K/month
If revenue growing 10%/month: Net burn declining 10%/month

Different perspectives, all useful.

**Burn Rate Planning: Raise Amount**

How much should you raise based on burn rate?

Standard framework: Raise for 18-24 months of runway

Calculation:
\`\`\`
Raise amount = Monthly burn × Number of months to profitability (or next raise)
\`\`\`

Typically: Raise for 18-24 months

Example:
- Monthly burn: £300K
- Raise for 20 months
- Raise amount: £300K × 20 = £6M
- Add 20% buffer for contingencies
- Target raise: £7.2M

Why 18-24 months?
- Series A rounds take 2-4 months to close
- You want 6+ months runway left when closing Series B
- Market conditions can change (want time to pivot or extend runway)

If you raise for <12 months:
- Back to fundraising immediately
- No time to hit milestones
- Weak negotiating position for next round

If you raise for >30 months:
- Dilution too high (giving up too much equity)
- Removes fundraising pressure (less discipline)
- Market may shift during that time

18-24 months is the sweet spot.

**Burn Rate by Milestone**

Adjust burn rate expectations by stage:

| Stage | Revenue | Typical burn | Burn ratio |
|-------|---------|----------|-----------|
| Pre-product | £0 | £150K/month | 100% |
| Product-market fit | £50-100K MRR | £250-300K | 80% |
| Product-led growth | £200-500K MRR | £300-400K | 60-75% |
| Sales-led scaling | £500K-2M MRR | £400-600K | 30-50% |
| Growth stage | £2M-5M MRR | £500-1M | 20-40% |
| Profitability path | £5M+ MRR | £500K-1M | <20% |

The burn ratio (burn as % of revenue) should steadily decline.

Red flags:
- Burn ratio increasing (efficiency degrading)
- Burn increasing while revenue flat (adding costs without revenue)
- Absolute burn £ spiking unexpectedly (loss of cost control)

**Cutting Burn Rate**

If you need to extend runway, cut burn strategically:

Option 1: Salary cuts (fastest, most damaging)
- Cut salaries 10-20% across board
- Fast, but kills morale
- Typically 40-50% of burn (biggest expense)
- Impact: Reduces burn 5-10% quickly

Option 2: Headcount reduction (fastest, most permanent)
- Cut 10-20% of headcount
- Immediate impact on burn
- Typical: Remove middle-tier sales people (lowest ROI)
- Impact: Reduces burn 15-25%, slows growth

Option 3: Marketing spend reduction (safest)
- Cut marketing 30-50%
- Slows customer acquisition growth
- Burn reduction: 5-10% (smaller portion of budget)
- But also reduces revenue growth rate

Option 4: Infrastructure/ops optimization
- Renegotiate AWS, SaaS tools
- Optimize code (fewer servers)
- Typical savings: £20-50K/month
- Burn reduction: 5-15%, takes time to implement

Option 5: Raise prices (best, hardest)
- Increase pricing 20-30%
- Improves revenue without spending more
- But may reduce growth rate (customer acquisition)
- Net impact: Positive if churn stays flat

Best approach: Combination
- Cut lowest-ROI marketing (5%)
- Optimize infrastructure (5%)
- Raise prices on new customers (10-15% revenue improvement)
- Small headcount adjustment if needed (5-10%)

This gets you 25-45% burn reduction without destroying business.

**Monthly Burn Monitoring**

Track burn rate monthly:

| Month | Expenses | Revenue | Burn | Runway |
|-------|----------|---------|------|--------|
| May | £350K | £100K | £250K | 6.0 months |
| June | £365K | £110K | £255K | 5.8 months |
| July | £375K | £125K | £250K | 5.7 months |
| August | £385K | £140K | £245K | 5.9 months |
| Sept | £395K | £160K | £235K | 6.2 months |
| Oct | £400K | £185K | £215K | 6.8 months |

Watch for:
- Burn increasing month-over-month (need to address)
- Runway declining despite raising money (burn > expectations)
- Revenue growth stalling (runway problem)

Red flag: Runway declining 0.1-0.2 months every month. That's death spiral. At that rate, you go from 6 months to crisis in 12 months.

**Fundraising Timeline Based on Burn**

When to start fundraising:

| Runway | Action |
|--------|--------|
| >24 months | No rush (can wait 6+ months) |
| 18-24 months | Start prep (Q&A, pitch deck) |
| 12-18 months | Begin fundraising process |
| 6-12 months | Urgent (must close within 6 months) |
| <6 months | Crisis (any delay is catastrophic) |

Typical fundraising timeline: 3-4 months from start to close

If at 12 months runway and typical 4-month fundraising:
- Start in month 8 (runway falls to 8 months while fundraising)
- Close in month 12 (runway near 4 months)
- Tight but workable

If at 8 months runway and typical 4-month fundraising:
- Start immediately (month 0)
- Close in month 4 (runway 4 months)
- Success depends on no delays

If at 3 months runway:
- Already too late for standard process
- Emergency fundraising (bridge notes, extension from investors)
- Weak negotiating position
- Avoid at all costs

Plan to raise when runway = 12-18 months.
`
      },
      {
        heading: "Burn Rate Optimization and Path to Profitability",
        body: `The goal is to reduce burn rate and increase revenue until you reach positive unit economics and profitability.

**Burn Rate Curves**

There are three burn rate curves:

1. **Unsustainable burn** (exponential increase)
   - Burn growing faster than revenue
   - Example: £200K → £300K → £400K burn while revenue £50K → £75K
   - Runway shrinking month-over-month
   - Result: Forced to cut costs dramatically or fundraise at bad terms

2. **Sustainable burn** (linear or declining)
   - Burn flat or slightly increasing while revenue growing
   - Example: £300K burn, revenue £50K → £150K → £250K
   - Runway stable or improving
   - Result: Can reach profitability through execution

3. **Improving burn** (burn declining)
   - Burn decreasing as revenue grows
   - Example: Burn £300K → £280K → £250K while revenue growing
   - Runway improving significantly
   - Result: Path to profitability clear and accelerating

You want curve #2 or #3.

**Burn Improvement Levers**

To improve burn (reduce burn rate or accelerate revenue):

1. **Reduce COGS** (direct margin improvement)
   - Negotiate better AWS pricing (bulk discounts)
   - Optimize infrastructure (fewer servers = lower costs)
   - Typical savings: £10-30K/month (3-10% burn reduction)

2. **Improve gross margin** (revenue efficiency)
   - Increase pricing (20% higher ACV = 10-15% revenue improvement)
   - Reduce support costs (self-serve help, automation)
   - Typical improvement: 5-10% gross margin (2-5% burn improvement)

3. **Increase customer acquisition** (revenue growth)
   - More sales spend (if unit economics positive)
   - Better marketing channels
   - Product-led growth optimization
   - Typical impact: 20-50% revenue growth (if CAC payback <12 months)

4. **Improve retention** (stabilize revenue)
   - Reduce churn (retention features, customer success)
   - Increase LTV (expansion, upsell)
   - Typical impact: 10-20% revenue stability improvement

5. **Cut low-ROI costs** (burn reduction)
   - Reduce marketing spend on inefficient channels
   - Consolidate tools and SaaS subscriptions
   - Outsource non-core functions
   - Typical savings: £20-50K/month (5-15% burn reduction)

6. **Improve sales efficiency** (same revenue, lower spend)
   - Better sales playbooks (faster close)
   - Better lead qualification (focus on high-fit customers)
   - Automation (less manual work)
   - Typical impact: 20-30% improvement in sales productivity

Example improvement plan:

Current state:
- Burn: £300K/month
- Revenue: £100K/month
- Runway: 5 months (with £1.5M cash)

Target: Reach profitability in 18 months

Plan:
1. Increase sales efficiency (+£20K revenue): Now £120K revenue
2. Improve gross margin (+£5K): Now £115K revenue (net)
3. Optimize infrastructure (−£20K burn): Now £280K burn
4. Reduce marketing (−£30K burn): Now £250K burn
5. Cut low-ROI projects (−£10K burn): Now £240K burn

New metrics:
- Burn: £240K/month (20% reduction)
- Revenue: £120K/month (20% improvement)
- Combined impact: 40% improvement in burn ratio

Month 1-18 trajectory (with continued improvements):
- Month 1: £120K revenue, £240K burn = -£120K
- Month 6: £160K revenue, £225K burn = -£65K
- Month 12: £220K revenue, £210K burn = +£10K (breakeven)
- Month 18: £280K revenue, £200K burn = +£80K (profitable)

With focus on these improvements, you can reach profitability.

**Unit Economics Tie-in**

Burn rate is fundamentally tied to unit economics:

Poor unit economics = High burn required = Unsustainable

Example:
- CAC: £3,000 (too high)
- Monthly revenue: £200 (too low)
- Payback: 15 months (too long)
- To acquire customers profitably: Need £3,000 ÷ 10 = £300/month revenue
- Current customers only £200/month = Loss on every customer
- To hit £100K revenue (500 customers): Must acquire 500 × £3K = £1.5M spend
- But only generating £100K revenue from them
- Burn: £1.5M spend − £100K revenue = £1.4M/month (unsustainable)

Good unit economics = Lower burn required = Sustainable

Example:
- CAC: £1,000
- Monthly revenue: £250
- Payback: 5 months (healthy)
- To acquire customers profitably: Need £1,000 ÷ 5 = £200/month is break-even
- Current customers £250/month = Profit on every customer
- To hit £100K revenue (400 customers): Must acquire 400 × £1K = £400K spend
- Generating £100K revenue = Profitable cohort (payback 4 months)
- Burn: £400K spend − £100K revenue = £300K in month 1
- But month 2, previous cohort payback, revenue grows while burn stays flat
- Burn sustainable (declining ratio as revenue grows)

Fix unit economics, burn becomes manageable.

**Dashboard to Monitor**

Daily/weekly:
- Cash in bank
- Monthly burn rate (trailing 3-month average)
- Runway months
- Revenue (monthly)
- Burn ratio (burn ÷ revenue)

Monthly:
- Detailed expense breakdown
- Revenue by channel
- CAC and LTV by channel
- Customer churn
- Plan vs. actual spend

Quarterly:
- Burn trend (improving, flat, declining?)
- Profitability timeline (updated)
- Funding needs (updated)
- Path to profitability (confidence level)

Monitoring burn rate is not finance work—it's survival work. Everyone should understand it.
`
      }
    ],
    relatedSlugs: [
      "unit-economics-deep-dive",
      "profitability-mechanics",
      "cash-management-and-forecasting",
      "operating-leverage-and-scaling",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "How much runway should I maintain?",
        a: "12+ months is comfortable, 6-12 months is acceptable, <6 months is concerning. Raise when you have 12-18 months left to avoid panic fundraising."
      },
      {
        q: "Should I cut costs or raise money?",
        a: "Depends: If unit economics good (CAC payback <12 months), raise and grow. If unit economics poor (payback >18 months), cut costs and fix metrics first, then raise."
      },
      {
        q: "How do I forecast burn rate 12 months out?",
        a: "Project hiring plan (cost growth), project revenue growth, assume 80% of planned revenue (conservative). Model several scenarios: upside (execute perfectly), base (on track), downside (20% slower growth)."
      },
      {
        q: "What burn rate is acceptable for Series A?",
        a: "Varies, but typical: 60-80% burn ratio (burn as % of revenue). If you're not burning (profitable), you don't need Series A. If burning >90%, you have efficiency problem."
      }
    ],
    videoUrl: ""
  }
];

export default batch71Articles;
