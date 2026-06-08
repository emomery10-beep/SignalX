import { AcademyArticle } from "@/types/academy";

export const batch272Articles: AcademyArticle[] = [
  {
    slug: "founder-compensation-and-equity-structure",
    title: "Founder Compensation and Equity Structure: Aligning Incentives",
    description: "Master founder compensation. Structure equity, align incentives, manage cap table.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["founder compensation", "equity", "founder equity", "vesting", "cap table", "stock options", "founder incentives"],
    keyTakeaways: [
      "Founder equity: Typical split depends on contributions. Co-founder (contributed equally): 50/50. Founder (full-time) + advisor (part-time): 80/20. Solo founder (everyone else joins): 60% founder, 40% employee pool. Critical: Vesting (4-year vest, 1-year cliff) = ensures alignment (if founder leaves early, company gets equity back). Cost: None (paper transaction). Benefit: Founders stay committed (equity worthless if leave early), protects company (no free option for founder to bail). Example: Co-founders (50/50), then hire employees (take from employee pool 20-40%). At exit, founders own 60-70% (remainder diluted by investment rounds).",
      "Salary vs equity: Early stage (pre-revenue): Founder salary £0-50K (bootstrap, low salary), high equity (0.5-2%). Growth stage (£1-5M): Salary £100-150K, equity 0.5-2% (vested). Mature (£10M+): Salary £200-300K, equity 0.1-0.5% (highly diluted by this point). Calculate: IRR (internal rate of return) targets. Early-stage typical: 3-10% IRR needed to justify risk (equity = bet on future value). Cost-benefit: Lower salary + high equity = founder pays for company growth upfront (but owns more), higher salary + low equity = founder paid now (less risk, but owns less).",
      "Cap table management: Track ownership (who owns what %, how much dilution). Monitor: Each funding round dilutes founders (Series A £5M on £20M post = 25% dilution). Hiring: Employee option pool (usually 10-20% set aside at Series A). At exit: Founders own much less (fully diluted 20-40% typical if raised multiple rounds). Important: Keep cap table clean (proper vesting, no ghost equity). Cost: Cap table management tool (Carta, Pulley £0-500/month). Benefit: Clear ownership, easy investor management, transparent for employees."
    ],
    content: [
      {
        heading: "Founder Equity and Compensation Structure",
        body: `Aligning founder incentives.

**Founder equity splits**

Initial allocation (founding):
- Co-founders (equal contribution): 50/50 split
- Founder (full-time) + advisor (part-time): 80/20 split
- Solo founder: 100%, employees take from option pool later

Example cap table (founding):
| Person | Equity % | Notes |
|---|---|---|
| Founder A | 50% | Co-founder, equal contribution |
| Founder B | 50% | Co-founder, equal contribution |
| Employee pool | 0% | Set aside later at Series A |
| Unallocated | 0% | For future hires, investors |

**Vesting schedule**

Standard: 4-year vest, 1-year cliff

Example:
- Grant: 1,000,000 shares (50% of company)
- Vesting: 4 years = 250,000/year = 20,833/month
- Cliff: 1 year (must stay 1 year to vest any)

Timeline:
- Year 1: Vest 25% (250K shares) after 1 year
- Year 2: Vest 50% (500K shares total)
- Year 3: Vest 75% (750K shares total)
- Year 4: Vest 100% (1M shares, fully vested)

Cliff benefit:
- If founder leaves month 11: Vests 0 shares (cliff not crossed)
- If founder leaves month 13: Vests 250K shares (cliff crossed)
- Protects company (no free equity for early departure)

**Founder salary vs equity**

Trade-offs:

Early stage (pre-revenue):
- Salary: £0-30K (bootstrap, low runway)
- Equity: 0.5-2% (per founder, after vesting)
- Risk: High (no customers, no money)
- Upside: High (small equity is large % at exit)

Growth stage (£1-5M ARR):
- Salary: £100-150K (market rate for CEO)
- Equity: 0.5-2% (diluted by fundraising)
- Risk: Medium (product-market fit proven)
- Upside: Medium (equity diluted, but company scaled)

Scaling stage (£10M+ ARR):
- Salary: £200-300K (market rate + bonus)
- Equity: 0.1-0.5% (heavily diluted)
- Risk: Low (business proven, profitable likely)
- Upside: Lower (equity heavily diluted)

IRR calculation:
- Early equity (0.5%, £1B exit) = £5M value, £0-50K salary/year = high IRR (30-50%)
- Growth equity (1%, £500M exit) = £5M value, £150K salary/year = medium IRR (20-30%)
- Mature equity (0.2%, £2B exit) = £4M value, £250K salary/year = lower IRI (10-15%)

**Cap table management**

Tracking ownership:
| Party | Shares | % | Notes |
|---|---|---|---|
| Founder A | 500K | 50% | Vesting 4yr/1yr cliff |
| Founder B | 500K | 50% | Vesting 4yr/1yr cliff |
| Series A investors | TBD | 25% (post-dilution) | At fundraising |
| Employee pool | 100K | 10% | Set aside for hiring |
| Unallocated | TBD | 15% | Future fundraising |

Dilution tracking:
- Pre-Series A: Founders own 100%
- Post-Series A (£5M on £20M post): Founders diluted to 75%
- Post-Series B (£10M on £50M post): Founders diluted to 50%
- At exit (£500M valuation): Founders own 30-50% depending on later rounds

Clean cap table requirements:
- Proper founder vesting (4yr/1yr standard)
- Option pool (10-20% at Series A)
- No ghost equity (all grants documented)
- Clear documents (stock agreements, option plan)

Tools: Carta, Pulley (cap table management)

**Founder retention strategies**

Problem: Founder burnout (long hours, stress, dilution)
Solution:
1. Adequate salary (market rate, not bootstrap forever)
2. Regular vesting milestones (celebrate progress)
3. Board seat (control, voice in decisions)
4. Secondary liquidity (sell small amount, take profit before exit)

Clawback prevention:
- If founder leaves early, company can repurchase unvested shares (cliff protects)
- If founder leaves after vesting, shares belong to founder (can't take back)
- Example: Founder leaves after 2.5 years = forfeits 1.5 years of vesting (50% equity)

`
      }
    ],
    relatedSlugs: ["organizational-structure-and-team-design", "hiring-and-talent-acquisition-strategy", "financial-planning-and-budgeting"],
    faq: [
      { q: "How should founders split equity?", a: "Equal contribution: 50/50. Unequal: Adjust based on role (full-time vs part-time), expertise, network. Critical: All vesting 4 years with 1-year cliff (ensures alignment, protects company)." },
      { q: "What salary should founders take?", a: "Early stage: £0-50K (bootstrap). Growth: £100-150K (market rate). Mature: £200-300K (market + bonus). Balance: Lower salary + higher equity early (higher upside), higher salary + lower equity later (less risk)." },
      { q: "How do I manage dilution?", a: "Track cap table (each round dilutes founders). Expected: Founders own 30-50% at exit (diluted by Series A, B, C). Manage: Keep employee pool 10-20%, avoid excessive rounds. Plan: Founders should expect to own less over time (trade-off for growth)." }
    ],
    videoUrl: ""
  }
];

export default batch272Articles;