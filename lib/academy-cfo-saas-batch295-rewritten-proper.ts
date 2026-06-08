import { AcademyArticle } from "@/types/academy";

export const batch295Articles: AcademyArticle[] = [
  {
    slug: "sales-compensation-structures-and-incentives",
    title: "Sales Compensation Structures and Incentives: Aligning Motivation",
    description: "Master sales comp. Design structures, incentivize behavior, align with company goals.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["sales compensation", "commission structure", "sales incentives", "sales comp plan", "variable pay"],
    keyTakeaways: [
      "Comp structure basics: Base salary + commission + bonus. Ratios vary: SMB SaaS (60% base, 40% commission), enterprise (50% base, 50% commission). Example: £100K OTE (on-target earnings) = £50K base + £50K commission. Purpose: Retain (base), incentivize (commission), reward exceeding quota (bonus). Cost: Commission can double cost (base 50K + commission 50K). Benefit: Aligns incentives (AE wants revenue, company wants revenue).",
      "Commission design: Tiered % of revenue (example: 5% on quota, 7% above quota, 2% below quota). Or: Tiered by product (complex sales higher %), customer type (expansion lower). Goal: Incentivize right behavior (not overselling to wrong customers, not discounting). Monitor: Commission burnout (if too aggressive) or underpayment (if too low).",
      "Bonus structure: Discretionary (manager-based) or formula-based (metric-driven). Formula example: Hit quota 90-110% → bonus, exceed 110% → more bonus. Metrics beyond revenue: CAC target, NRR, customer satisfaction. Cost: Variable (only pay on performance). Benefit: Clear incentives, fairness, alignment with company goals. Pitfall: Too many metrics (confusing), too few (wrong behavior)."
    ],
    content: [
      {
        heading: "Designing Effective Sales Compensation",
        body: `Creating aligned incentive structures.

**Compensation structure basics**

Components:
- Base salary: Guaranteed income (£40-60K range typical)
- Commission: % of revenue (5-10% of ARR sold)
- Bonus: Additional for exceeding quota (10-20% of base)
- Benefits: Health, retirement, car allowance (varies)

Total comp models:

SMB SaaS (shorter sales cycle, lower ACV):
- Base: 60% (£60K)
- Commission: 40% (£40K)
- Total OTE: £100K
- Rationale: Less retention risk, quicker turnover, more volume

Enterprise SaaS (longer cycle, higher ACV):
- Base: 50% (£50K)
- Commission: 50% (£50K)
- Total OTE: £100K
- Rationale: More retention, longer cycles, higher risk

Sales development reps (SDRs/BDRs):
- Base: 70-80% (£35-40K)
- Commission: 20-30% (£10-15K)
- Total OTE: £50K
- Rationale: Measured on meetings/qualified leads, not revenue

Inside sales (customer success-led expansion):
- Base: 70% (£35K)
- Commission: 30% (£15K)
- Total OTE: £50K
- Rationale: Supporting existing customers, lower risk

**Commission structures**

Simple percentage (most common):
- 5% of ARR for new customers
- 2% of expansion ARR for existing customers
- Example: Close £10K ACV contract = £50K ARR = £2.5K commission

Tiered percentage (incentivize exceeding quota):
- 90-99% of quota: 4% commission
- 100-110% of quota: 5% commission
- 110%+ of quota: 6-7% commission
- Example: Quota £1M revenue
  - Hit £900K: 4% × £900K = £36K commission
  - Hit £1M: 5% × £1M = £50K commission
  - Hit £1.2M: 6% × £1.2M = £72K commission
  - Incentivizes exceeding (£20K more for 20% over)

Accelerated commission (aggressive growth):
- £0-500K: 3%
- £500K-£1M: 5%
- £1M+: 8%
- Incentivizes: Push for larger deals, higher volumes

Capped commission (control costs):
- Commission capped at 2x base (example)
- Base £50K → cap at £100K commission
- Protects: Company cost control
- Risk: Disincentivizes top performers at cap

**Bonus structure**

Quota attainment bonus:
- 0-90% quota: 0% bonus
- 90-100% quota: 5% bonus
- 100-110% quota: 10% bonus
- 110%+ quota: 15% bonus
- Example: Base £50K
  - Hit 100% quota: £5K bonus
  - Hit 120% quota: £7.5K bonus

Spiff (short-term incentive):
- For specific targets (new product launch, end of quarter push)
- Example: Close 5 deals of new product = £2K spiff (one-time)
- Cost-effective (short-term boost, limited cost)

Multi-metric bonus:
- Quota attainment: 60% weight
- Customer retention: 20% weight (NRR > 110%)
- Customer satisfaction (CSAT): 20% weight (> 8/10)
- Example: Hit quota + NRR target + CSAT target = full bonus
- Incentivizes: Not just closing, but closing right customers

Account value bonus:
- Bonus based on account size
- £500K+ ARR accounts: +2% commission
- £1M+ ARR accounts: +3% commission
- Incentivizes: Going after higher-value deals

**Quota setting and fairness**

Bottom-up quota (territory-based):
- Territory 1 (high-value): £1.5M quota
- Territory 2 (medium): £1M quota
- Territory 3 (new): £500K quota
- Based on: Market size, account density, account value
- Fair: Accounts for territory differences

Top-down quota (company target):
- Company target: £5M (revenue goal)
- 5 AEs → £1M per AE average
- Adjust for tenure: New AE 80% quota (£800K), Veteran 120% (£1.2M)
- Fair: Accounts for experience

Blended quota (hybrid):
- Bottom-up market potential
- Top-down company target
- Negotiate to fair middle ground
- Fair: Balances market + company needs

Quota achievement distribution (healthy):
- 10-20% beat quota 110%+ (overachievers)
- 50-70% hit quota 90-110% (on-track)
- 10-20% miss quota 80-90% (underperformers)
- 5-10% far below (issue: problem performers)
- If distribution skewed (too many above/below): quota miscalibrated

**Incentive alignment**

Wrong incentives example:
- Pure revenue commission (5% of ARR)
- Result: AE oversells, churns, churn costs more than commission earned
- Problem: Misaligned (short-term vs long-term)

Right incentives:
- Commission on revenue (5%) + penalty for churn (claw-back if customer leaves)
- Or: Commission on retention (5% if NRR >110%, 0% if churn >5%)
- Result: AE careful about fit, ensures customer success
- Benefit: Aligned (short and long-term)

Examples by company goal:
- Goal: Maximize revenue → Pure revenue commission
- Goal: Grow ACVs → Commission higher for large deals
- Goal: Expand in existing accounts → Higher commission on expansion deals
- Goal: Reduce churn → Commission tied to retention/NRR
- Goal: Grow customer lifetime value → Bonus for long-term customer health

**Comp plan design process**

Step 1: Set philosophy
- Competitive pay? (top of market = attract best)
- Performance-driven? (high commission = attract hunters)
- Balanced? (good base + commission = stability + upside)

Step 2: Determine components
- Base: Set at 50-70% of OTE (based on stage, role)
- Commission: Set at 5-10% (based on ACV, cycle)
- Bonus: Set at 10-20% (based on company priorities)
- Total OTE: £80-150K range (depends on stage/role)

Step 3: Model payouts
| Performance | Base | Commission | Bonus | Total |
|---|---|---|---|---|
| 80% quota | £50K | £24K | £0 | £74K |
| 100% quota | £50K | £30K | £5K | £85K |
| 120% quota | £50K | £36K | £7.5K | £93.5K |

Step 4: Test economics
- Revenue per AE: £1M
- Commission cost: 5% = £50K per AE
- Gross profit: 70% = £700K
- CAC: £30K (other sales costs)
- Benefit: £700K - £50K - £30K = £620K per AE (healthy)

Step 5: Communicate
- Clear written plan (no ambiguity)
- Examples (show payout scenarios)
- Scenario calculator (AE can model earnings)
- Transparency: Build trust, alignment

**Typical issues and solutions**

Issue: Top performer hits cap, leaves
- Solution: Remove caps or increase cap

Issue: Multiple changes to comp plan, confusion
- Solution: Commit to plan for 12+ months (let settle)

Issue: Commission burnout (costs too high)
- Solution: Reduce % or add cap

Issue: AEs sandbagging (pushing deals to next quarter)
- Solution: Accelerated commission (incentivize closing sooner)

Issue: Wrong customers being closed (high churn)
- Solution: Add retention metric, claw-back clause

Annual review:
- Payout % vs revenue: Is it 5-10% range (healthy)?
- Distribution: Are results distributed normally?
- Satisfaction: Are AEs happy with comp?
- Turnover: Are top performers leaving? Why?
- Adjustment: If multiple issues, redesign for next year

`
      }
    ],
    relatedSlugs: ["hiring-and-talent-acquisition-strategy", "sales-pipeline-management-and-forecasting", "unit-economics-ltv-cac-payback", "employee-retention-and-turnover-analysis", "organizational-structure-and-team-design"],
    faq: [
      { q: "What's a typical sales comp structure?", a: "SMB SaaS: 60% base + 40% commission. Enterprise: 50% base + 50% commission. Total OTE £80-150K depending on stage/role. Commission: 5-10% of ARR sold. Bonus: 10-20% for exceeding quota. Example: £100K OTE = £50K base + £40K commission + £10K bonus." },
      { q: "How should I structure commission to align incentives?", a: "Don't: Pure revenue (leads to overstuffing, churn). Do: Commission on revenue + retention metrics (tiered based on NRR, payback period). Example: 5% on quota, 7% above quota, claw-back if churn >5%. Incentivizes right behavior (good customers, not just volume)." },
      { q: "How do I set fair sales quotas?", a: "Bottom-up: Territory potential (market size, account density). Top-down: Company target / # AEs. Blended: Negotiate both inputs. Adjust for tenure: New AEs 80% quota, veterans 120%. Test: Distribution should be 10-20% beat quota, 50-70% hit, rest below. If skewed, recalibrate." }
    ],
    videoUrl: ""
  }
];

export default batch295Articles;