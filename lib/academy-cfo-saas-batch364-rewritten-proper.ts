import { AcademyArticle } from "@/types/academy";

export const batch364Articles: AcademyArticle[] = [
  {
    slug: "sales-compensation-and-incentive-structures",
    title: "Sales Compensation and Incentive Structures: Aligning Sales with Business Goals",
    description: "Master sales comp. Design incentive plans, balance base and commission, optimize behaviors.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["sales compensation", "commission structure", "sales incentives", "comp plan", "sales motivation"],
    keyTakeaways: [
      "Sales comp structure: Base salary + commission (variable). Example: £40K base + 10% commission (£50K deal = £5K commission) = total potential £60K. Balance: High base (£50K) = stability, low commission (5%) = less motivation. Low base (£20K) + high commission (15%) = high risk, high motivation. Cost: Comp is typically 5-10% of revenue (major expense). ROI: Right comp plan = motivated team, right behaviors, revenue growth.",
      "Commission mechanics: Accelerators (commission increases at higher thresholds: 10% at £100K, 15% at £200K), caps (commission capped at £15K), clawback (lose commission if customer churns within 1 year), quota (must hit target to earn commission). Target: 50-60% of reps hit quota (not all should hit it—means quota is too low).",
      "Design considerations: Align with business goals (if want expansion revenue, pay commission on upsells). Simplicity (reps must understand how much they'll make). Competitiveness (must pay market rate). Annual review (adjust based on market, company health). Cost: CFO budgets comp as % of revenue (payroll + commissions ≈ 25-35% of revenue). ROI: Right plan drives behaviors."
    ],
    content: [
      {
        heading: "Designing Effective Sales Compensation Plans",
        body: `Creating comp structures that align incentives and drive business outcomes.

**Sales compensation fundamentals**

Components:

Base salary:
- Fixed monthly payment regardless of performance
- Stability for sales reps (predictable income)
- Benefit for company (predictable cost)
- Range: £20K-£80K depending on role, market, experience

Commission:
- Variable payment based on sales
- Tied to revenue generated (e.g., 10% of deal value)
- Motivates high performers
- Variability for company (cost depends on revenue)
- Range: 5-20% depending on role, deal size, company stage

Bonus:
- Discretionary payment (company decides if earned)
- Often tied to team/company goals (hit overall revenue target)
- Can be individual (hit personal quota) or team-based
- Range: 5-20% of base salary

Total Comp (On-Target Earnings, OTE):

OTE = Base salary + Commission at quota + Bonus

Example:
- Base: £40K
- Commission at quota (£200K in deals): 10% = £20K
- Bonus at target: £8K
- Total OTE: £68K

Upside potential:
- If rep does £300K (150% of quota): Commission = £30K
- Total: £78K (115% of OTE)

**Comp structure variations**

Option 1: High base, low commission

Example: £60K base + 5% commission

Pros:
- Stability (reps know they'll make £60K minimum)
- Easier to hire (predictable income attracts risk-averse)
- Aligns with non-sales behaviors (customer support, implementation)

Cons:
- Less motivation (5% doesn't drive urgency)
- Cost fixed (can't scale down if revenue misses)
- Low overperformance incentive (5% of £300K deal = £15K, not exciting)

Best for:
- Customer success roles (need stability, less pure sales)
- Inside sales (lower commissions typical)
- Larger deals with long cycles (rep stays on deal, needs salary stability)

Option 2: Low base, high commission

Example: £20K base + 15% commission

Pros:
- High motivation (15% drives urgency to close deals)
- Cost variable (scales with revenue)
- Upside potential (£15% on £100K deal = £15K, total £35K, exciting)

Cons:
- Risk for reps (could make very little if they struggle)
- Harder to hire (unpredictability scares people)
- Can incentivize bad behavior (pushing bad deals just to get commission)

Best for:
- Enterprise sales (large deals, high commission = large dollars)
- Experienced reps (can handle risk)
- Booming market (confident in closing deals)

Option 3: Balanced (most common)

Example: £40K base + 10% commission

Pros:
- Balance stability and motivation
- Attracts decent talent (mix of safety and upside)
- Incentives are meaningful (10% is real money)
- Can manage cost (base is fixed, variable scales)

Cons:
- Requires both carrots and sticks (base + commission)
- Middle ground (not as motivational as high commission, not as stable as high base)

Best for:
- Most companies (balanced risk/reward)
- Growing companies (need to attract talent, can afford some stability)

**Commission mechanics**

Straight commission:

Formula: Revenue × Commission rate

Example:
- Rep closes £50K deal
- Commission rate: 10%
- Commission: £5K

Simple, transparent, reps love it (know exactly what they'll make)

Tiered commission (accelerators):

Commission rate increases at higher thresholds

Example:
- £0-50K revenue in quarter: 5% commission
- £50K-100K revenue: 10% commission
- £100K+ revenue: 15% commission

Rep closes £120K in quarter:
- First £50K: 5% = £2.5K
- Next £50K: 10% = £5K
- Next £20K: 15% = £3K
- Total: £10.5K

Effect: Incentivizes overachievement (accelerators reward outperformance)

Capped commission:

Commission capped at maximum amount

Example:
- 10% commission on all deals
- Maximum commission per quarter: £10K

Rep closes £200K:
- 10% = £20K
- But capped at £10K
- Pays: £10K

Effect: Cost control (company caps max commission expense), but reps don't like caps (disincentivizes overachievement)

Clawback:

Commission is taken back if customer churns within certain period

Example:
- Rep sells £50K annual deal, gets £5K commission
- Customer churns in month 6 (before annual renewal)
- Rep loses £2.5K commission (pro-rata)

Effect: Aligns rep incentives with retention (can't just sell bad customers)

Commission on profit:

Commission based on profitability, not revenue

Example:
- Rep sells £50K deal with 40% gross margin = £20K profit
- Commission: 10% of profit = £2K

Effect: Aligns rep with profitability (prevent discounting to hit quota)

**Quota and performance metrics**

What is quota:

Target revenue each rep must close to earn commission

Example:
- Annual quota: £500K per rep
- Monthly quota: £41.7K per rep

At 100% of quota: Rep earns base + expected commission
- Base: £40K
- Commission: 10% × £500K = £50K (annual)
- At quota: Earn £90K

Quota setting:

Total company target: £10M revenue
Number of reps: 20
Quota per rep: £10M / 20 = £500K per rep

Adjustment for experience:
- New reps: 60-80% of full quota (ramp period)
- Experienced reps: 100-120% of full quota

Distribution of performance:

In a healthy sales team:
- Top 20% of reps: 120-150% of quota (overachievers)
- Middle 50% of reps: 80-120% of quota (solid performers)
- Bottom 20-30% of reps: <80% of quota (underperformers)

Target: 50-60% of reps hit quota
- If 90% hit quota: Quota is too low (not aspirational)
- If 30% hit quota: Quota is too high (demoralizing) or quality issues

**Aligning comp with business goals**

Problem: Wrong behaviors

Misaligned comp plan:

Company goal: Expand revenue in existing customers (NRR >120%)
Comp plan: Pure commission on new revenue (no commission on expansion)
Result: Reps ignore existing customers, chase new logos (misaligned)

Solution:

Revised comp plan:
- New revenue: 10% commission
- Expansion revenue: 15% commission (higher, aligns incentive)
- Churn as clawback: Lose commission if customer churns

Result: Reps prioritize expansion (higher commission), retain customers (avoid clawback)

Another example:

Company goal: Enterprise focus (£50K+ deals)
Comp plan: 10% commission on all deals (same rate)
Result: Rep sells 10 × £5K SMB deals instead of 1 × £50K enterprise deal (same commission, less work)

Solution:

Revised comp plan:
- SMB: 5% commission
- Enterprise: 15% commission
- Minimum deal size: £20K (won't pay commission on smaller deals)

Result: Reps focus on enterprise (higher commission, meets minimum)

**Comp plan design process**

Step 1: Define business goals

What are you trying to achieve?
- Grow revenue? (pure commission)
- Retain customers? (expansion revenue bonus, churn clawback)
- Improve margins? (commission on profit, not revenue)
- Focus on enterprise? (higher commission on large deals)

Step 2: Design comp structure

Decide:
- Base salary (£20K-£80K)
- Commission rate (5-20%)
- Bonus structure (if any)
- Quota

Example:
- Base: £40K
- Commission: 10% on new, 15% on expansion
- Bonus: £5K if company hits revenue target
- Quota: £500K annual

Step 3: Model comp costs

Calculate total compensation cost:

Assumptions:
- 20 sales reps
- Average rep hits 90% of quota (realistic)
- 90% hit quota = earn average commission
- 10% below quota = earn lower commission

Average rep revenue: £450K (90% of £500K quota)
Average rep commission: 10% × £450K = £45K
Average rep OTE: £40K base + £45K commission = £85K

Total comp cost for 20 reps:
- Base: 20 × £40K = £800K
- Commission: 20 × £45K = £900K
- Total: £1.7M

Sanity check:
- Total revenue target: £10M
- Total comp cost: £1.7M (17% of revenue)
- Industry target: 5-10% of revenue (this is high!)

Adjustment:
- If company can't afford 17%, reduce commission (6% vs 10%)
- Or reduce base (£30K vs £40K)
- Goal: Keep total comp <10% of revenue

Step 4: Communicate and test

Before implementing:
- Explain to sales team (clarity)
- Model examples (show what they can earn)
- Get feedback (realistic? Achievable?)
- Adjust if needed

Pilot with one team before full rollout

Step 5: Monitor and adjust

Track:
- Are reps earning as modeled? (if not, plan might be wrong)
- Are behaviors aligned? (are reps doing what we want?)
- Are we retaining reps? (is comp competitive?)
- Are we hitting revenue targets? (does comp plan work?)

Adjust annually based on:
- Market rate (are we competitive?)
- Company performance (can we afford it?)
- Desired behaviors (are reps behaving right?)

**Common comp plan mistakes**

Mistake 1: No clawback on churn

Problem: Rep sells customer, gets commission, customer churns in month 2
Result: Rep doesn't care about quality (already got commission)

Fix: Clawback if customer churns within 12 months (full or pro-rata)
Impact: Reps care about quality

Mistake 2: Commission on revenue, not profit

Problem: Rep sells customer at 20% discount (to hit commission)
Result: Deal is unprofitable or low-margin

Fix: Commission on profit (£50K deal, 40% margin = £20K profit × 10%)
Impact: Reps price deals profitably

Mistake 3: Quota too low

Problem: 95% of reps hit quota (too easy)
Result: Reps unmotivated (no stretch goal)

Fix: Adjust quota so 50-60% hit it (challenging but achievable)
Impact: Motivation for growth

Mistake 4: Comp plan too complex

Problem: Rep has to calculate commission on spreadsheet (confusing)
Result: Reps don't understand compensation (demotivating)

Fix: Keep simple (10% commission, no accelerators/clawbacks)
Impact: Transparency

Mistake 5: Comp doesn't align with strategy

Problem: Want land-and-expand, but comp only on new revenue
Result: Reps ignore expansion (no commission)

Fix: Design comp to reward expansion (higher commission rate)
Impact: Aligned behaviors

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "operating-expense-management-and-control", "customer-acquisition-strategy-and-marketing-roi", "sales-forecasting-and-pipeline-management", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "What's a typical sales compensation structure?", a: "Base salary + Commission on revenue. Example: £40K base + 10% commission on deals closed. OTE (On-Target Earnings) at quota: £40K + (10% × £500K quota) = £90K. Variations: High base (£60K) + low commission (5%) for stability, or low base (£20K) + high commission (15%) for motivation. Total comp typically 5-10% of revenue." },
      { q: "How do I design a commission structure that aligns with business goals?", a: "Define goals first: New revenue? Expansion revenue? Profitability? Then design: (1) Commission rates that reward desired behavior (higher rate on expansion if that's goal), (2) Clawback if customer churns (aligns with retention), (3) Commission on profit if profit matters (not just revenue). Example: Want expansion focus? 10% on new, 15% on expansion, clawback if churn." },
      { q: "What's a healthy quota attainment rate?", a: "Target: 50-60% of reps should hit quota (challenging but achievable). If 90%+ hit: Quota is too low (easy). If 30% hit: Quota too high (demoralizing) or execution problems. Monitor: Track monthly/quarterly to see if quota is right. Adjust annually based on market, company performance, and desired motivation level." }
    ],
    videoUrl: ""
  }
];

export default batch364Articles;