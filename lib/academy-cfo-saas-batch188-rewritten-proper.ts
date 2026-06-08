import { AcademyArticle } from "@/types/academy";

export const batch188Articles: AcademyArticle[] = [
  {
    slug: "sales-compensation-and-incentive-structures",
    title: "Sales Compensation and Incentive Structures: Aligning Performance with Growth",
    description: "Master sales pay. Design comp plans, set commission structure, and incentivize growth efficiently.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "sales compensation",
      "commission structure",
      "sales incentives",
      "variable pay",
      "quota setting",
      "compensation plan",
      "sales rep pay",
      "base salary",
      "commission rate",
      "sales bonus"
    ],
    keyTakeaways: [
      "Compensation mix: Base + commission/bonus. SMB: 70% base, 30% variable (lower risk). Mid-market: 60% base, 40% variable (more leverage). Enterprise: 50% base, 50% variable (high leverage). Example: £50K base + £20K commission (70/30) vs £40K base + £30K commission (57/43). Higher variable = more incentive but also more churn risk (reps leave if can't hit quota). Choose based on: Market (enterprise has more $ at stake), risk tolerance, sales cycle predictability.",
      "Quota setting: Based on territory and achievable targets. Method: Bottom-up (ask reps), top-down (divide revenue goal by headcount), peer benchmark. Example: Territory potential £150K ARR, reps achieve 80% = £120K quota. Set quota at 80% of capacity (stretch goal). Commission: If you want £5K per £100K quota (50 KBPs - keeping best percentage), set commission ~4-5%. Cap commission? Yes (prevents too-high payouts). Example: 4% commission, cap at £30K/rep/quarter (ceiling prevents distortions).",
      "Acceleration structure: Bonus when overquota (incentivize overachievement). Tiered: <80% quota = 0%, 80-100% = 2%, 100-120% = 4%, >120% = 5%. Or accelerated (higher rate on overquota). Example: £50K quota at 4% base, but 6% above quota. Hit £60K = (50×4%) + (10×6%) = £2K + £600 = £2.6K (incentivizes £10K overage). Clawback: Miss quota by >20%? Reduce by 25%. Prevents reps gaming system. Quarterly reset: Most SaaS use quarterly (aligns to business planning)."
    ],
    content: [
      {
        heading: "Sales Comp Structure and Mix",
        body: `Designing base salary and variable compensation.

**Compensation Mix by Segment**

SMB (small contract values, large volume):
- Base salary: £40K
- Commission/bonus: £10K (25% variable)
- Target OTE (on-target earnings): £50K
- Rationale: Lower individual deal value, lower risk, predictable income important for reps

Mid-Market (medium contracts, sales cycle):
- Base salary: £45K
- Commission/bonus: £25K (36% variable)
- Target OTE: £70K
- Rationale: Higher deal value, more leverage needed, longer sales cycle (base provides stability)

Enterprise (large deals, long cycle):
- Base salary: £50K
- Commission/bonus: £50K (50% variable)
- Target OTE: £100K
- Rationale: Very high deal value (£500K+), requires significant incentive alignment, reps willing to take risk for upside

SaaS benchmark:
- Average: 50-60% base, 40-50% variable
- Trend: Increasing variable (push for performance)
- Peer: Check competitors (if market paying 40% base, you need to compete)

**Calculating OTE (On-Target Earnings)**

OTE = salary + expected incentive (assuming quota attainment)

Example SMB:
- Salary: £40K
- Expected commission: £10K (at quota)
- OTE: £50K

Setting compensation:
- Market rate: Research salary.com, Glassdoor, industry surveys
- Competitiveness: Pay 50th percentile (median) to attract decent talent
- Productivity: Higher OTE ÷ lower % of revenue = sign of leverage (good)

Example:
- Market rate OTE: £50K (50th percentile for SMB)
- Budget: Can afford 25% of expected revenue for sales comp
- Expected revenue per rep: £300K (based on territory)
- Budget: £75K per rep
- Offer: £50K OTE (attracts decent talent), remainder goes to other sales costs

**Common Mistakes**

Too high OTE:
- Over-pays for average performance
- Reduces profitability
- Example: £60K base (no commission) = no incentive to perform
- Better: £45K base + £15K commission (incentivizes growth)

Too low OTE:
- Can't attract talent
- High turnover (reps leave for better opportunities)
- Example: £25K OTE vs £50K market = churn 80% (unsustainable)

Misaligned variable:
- Too much fixed: Reps coast (no incentive)
- Too much variable: Reps burn out (quota too hard)
- Sweet spot: 30-50% variable (achievable but motivating)

`
      },
      {
        heading: "Commission Structure and Quota Setting",
        body: `Designing commission rates and quota targets.

**Commission Calculation**

Simple commission:
- Rate: 4-6% of ACV (Annual Contract Value)
- Example: £100K ACV × 5% = £5K commission
- Frequency: Paid upon signature or first payment (varies)
- Clawback: Refund if customer churns within 6-12 months

Example scenario:
- 10 deals closed in quarter
- Total ACV: £500K (50 deals × £10K avg)
- Commission rate: 5%
- Total commission: £25K (divided by reps who touched deal)

Commission variations:
1. ACV-based (above)
2. MRR-based (for SMB): Monthly recurring revenue
   - Example: £5K MRR × 12 months × 4% = £2.4K commission
3. Gross profit-based: For low-margin products
   - Example: £100K ACV, 70% gross margin = £70K × 5% = £3.5K
4. Tiered: Different rates for different customer types
   - SMB: 3% ACV
   - Mid-market: 4% ACV
   - Enterprise: 5% ACV (or flat fee £10K)

**Quota Setting**

Bottom-up method:
- Ask each rep: "What can you achieve in territory?"
- Aggregate reps' answers = total company quota
- Pros: Reps buy-in, realistic
- Cons: Reps conservative (under-promise)

Top-down method:
- Company goal: £5M revenue this year
- Sales team: 10 reps
- Per-rep quota: £500K
- Pros: Aligned to company goal
- Cons: May be unrealistic for some territories

Peer benchmark:
- Historical: Last year reps closed £450K avg
- Stretch: +20% = £540K new quota
- Pros: Based on actual performance
- Cons: Doesn't account for market changes or rep changes

Blended approach (recommended):
- Historical avg: £450K
- Stretch adjustment: +15% = £517K
- Ask reps opinion: "Is £517K achievable?" (adjust if 50% say no)
- Final quota: £510K (consensus)

**Quota Attainment Distribution**

Realistic distribution (if quotas well-set):
- 60% of reps hit quota (80-120%)
- 20% exceed quota (120%+)
- 20% miss quota (<80%)

If different distribution:
- Too many missing (>30%): Quota too high or reps weak
- Too many exceeding (>40%): Quota too low, missing leverage
- Adjust quarterly

Example:
- Q1: 40% reps exceeded quota → Q2 raise quota by 10%
- Q2: 65% hit quota → Q3 quota is right, keep same

**Acceleration and Caps**

Acceleration (incentivize overachievement):
- Base commission: 4% of ACV
- Accelerated: 6% for deals above quota
- Example: Quota £500K
  - Achieve £400K: £400K × 4% = £16K
  - Achieve £550K: (£500K × 4%) + (£50K × 6%) = £20K + £3K = £23K
  - Incentivizes pushing above quota

Commission cap (prevent extreme payouts):
- Cap: £5K per month or £20K per quarter
- Rationale: Protects budget, prevents one deal windfall
- Downside: Reduces incentive above cap (rep goes lazy)
- Alternative: No cap (riskier, but more motivating)

Clawback (if customer churns):
- Typical: 50% clawback within 6 months, 25% clawback 6-12 months
- Rationale: Incent reps to sell "sticky" customers, not just close-and-move-on
- Example: Rep closes £100K deal (£5K commission), customer churns month 3 → Clawback £2.5K

Bonus (separate from commission):
- Annual bonus: 10% of target comp (e.g., £5K bonus for £50K OTE)
- Trigger: Hit annual quota (all-or-nothing)
- Rationale: Incentivize full-year performance, not just last quarter

`
      },
      {
        heading: "Advanced Structures and Management",
        body: `Managing complex comp plans and team dynamics.

**Team Leads and Tiered Compensation**

Account Executive (AE):
- £50K base + £25K commission = £75K OTE
- Responsibility: Closing deals

Sales Development Rep (SDR):
- £35K base + £5K bonus (based on meetings booked) = £40K OTE
- Responsibility: Prospecting, qualification
- Why lower: Less revenue impact (doesn't close), but enables AEs

Sales Manager:
- Option 1 (individual commission): £60K base + commission on own deals + team bonus
  - Example: £60K + (deals closed £5K) + (team hits quota bonus £10K) = £75K+
- Option 2 (team-based): £65K base + team attainment bonus (e.g., £10K if team hits)
  - Rationale: Aligns manager to team success (not just own deals)
- Most common: Hybrid (manager gets small commission on own deals + team bonus)

Director of Sales:
- Pure salary + equity + bonuses
- Example: £100K salary + 0.5% equity + bonus if org hits revenue target
- Rationale: Focused on building machine, not individual sales

**Accelerators and Decelerators**

Accelerator (increased rate above quota):
- SMB: 4% base, 6% above quota
- Enterprise: 5% base, 8% above quota
- Psychology: Tells reps "we reward overachievement"

Decelerator (lower rate below quota):
- Less common (riskier, demotivates)
- Alternative: Clawback or miss bonus instead

Example:
- Quota: £500K
- 70% of quota (£350K): 2% = £7K
- 80-100% quota: 4% = £16K
- Above 100%: 6% = £30K+
- This creates "cliff" at quota (incentives strong)

**Managing Team Dynamics**

Territory management:
- Equal territories? Experienced reps resent assigned low-potential
- Incentivize finding: Top performer gets best next territory?
- Downside: Discourages moving experienced reps to weak territories
- Solution: Commission higher % for growing underperforming territory (+1%)

Cross-selling:
- Standard: Rep owns AE relationship (gets full credit)
- Cross-sell comp: If rep A introduces customer to Product B (rep B sells):
  - Rep B gets 80% commission, Rep A gets 20% (finder's fee)
  - Incentivizes collaboration, not silos

Retention bonus:
- If high churn among sales reps (can't keep talent):
  - Offer: £10K bonus upon 1-year anniversary (if still employed)
  - Or: Quarterly bonus if below 15% turnover
  - Expensive but cheaper than constant hiring

**Comp Plan Changes and Timing**

When to change:
- Market changed (pricing increased, products changed)
- Reps consistently over/under quota (25%+ variance)
- Profitability needs (reduce commission, increase base)

Transition:
- 90-day notice: Announce new plan, effective next quarter
- Grandfather: Keep old comp for 3 months on new business (smooth transition)
- Example: Jan 1 new plan, but commission on deals signed Dec 1-31 still paid at old rate

Communication:
- Show reps new plan is better (or explain necessity)
- Illustrate with examples: "At this quota, you'd earn £X vs old plan £Y"
- Get buy-in: Ask for feedback, show you listened

Annual review:
- Each year, adjust for inflation and market changes
- Typical: Raise base 3-5%, adjust quota +5-10% (if revenue growing)
- Rationalize: "Market increased, we're raising to match (keep competitiveness)"

`
      }
    ],
    relatedSlugs: [
      "sales-pipeline-management-and-forecasting",
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-ltv-cac-payback",
      "pricing-strategy-and-price-optimization",
      "financial-forecasting-modeling"
    ],
    faq: [
      {
        q: "What's a typical sales comp mix?",
        a: "Varies by segment: SMB 70% base / 30% variable (£40K salary + £10K commission = £50K OTE). Mid-market 60% base / 40% variable (£45K + £25K = £70K). Enterprise 50% base / 50% variable (£50K + £50K = £100K). Higher deal value = more variable. Choose based on market rate and risk tolerance."
      },
      {
        q: "How do I set commission rate?",
        a: "Typical: 4-6% of ACV. Example: £100K ACV × 5% = £5K commission. Varies by product mix (higher margin = higher %, lower margin = lower %). Test: If commission too high, profits suffer. Too low, reps unmotivated. Sweet spot: 40-50% of gross margin goes to sales comp (salaries + commission). Example: 70% gross margin × £100K = £70K GP. Sales comp £30K (43% of GP) is reasonable."
      },
      {
        q: "How do I set quota?",
        a: "Three methods: (1) Bottom-up: Ask reps, aggregate. (2) Top-down: Divide revenue goal by reps. (3) Peer benchmark: Last year performance + stretch. Best: Blended. Example: Historical £450K per rep + 15% stretch = £517K quota (with rep input). Quota should be achievable by 60-70% (stretch goal, not impossible)."
      },
      {
        q: "Should I use acceleration or caps?",
        a: "Acceleration: Incentivizes overachievement (good). Example: 4% base, 6% above quota. Caps: Limits payouts (protects budget, but reduces incentive). Use caps if: Budget tight or historical overpayments. Use acceleration if: Want reps pushing hard. Clawback: Refund commission if customer churns <12 months (incentivizes sticky deals, not just closes)."
      }
    ],
    videoUrl: ""
  }
];

export default batch188Articles;
