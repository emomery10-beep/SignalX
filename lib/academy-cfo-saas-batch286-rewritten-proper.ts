import { AcademyArticle } from "@/types/academy";

export const batch286Articles: AcademyArticle[] = [
  {
    slug: "cash-runway-and-burn-rate-management",
    title: "Cash Runway and Burn Rate Management: Know Your Runway",
    description: "Master runway management. Calculate burn, extend runway, plan fundraising based on runway.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["cash runway", "burn rate", "cash management", "fundraising timeline", "runway extension", "burn analysis"],
    keyTakeaways: [
      "Burn rate calculation: (Cash spent - Cash earned) / Month = Monthly burn. Example: £500K cash, £50K revenue, £100K expenses = £50K net monthly burn. Runway: £500K / £50K = 10 months. Impact: Low runway (< 6 months) = immediate fundraising pressure. High runway (12+ months) = time to optimize. Cost: Tracking (simple spreadsheet). Benefit: Know when money runs out, plan ahead. Critical: Update monthly, monitor weekly when runway < 12 months.",
      "Runway extension strategies: (1) Reduce burn (cut costs, kill low-ROI initiatives), (2) Increase revenue (faster sales, price increases, new channels), (3) Raise capital (fundraising, investor support), (4) Combination (most effective). Example: £50K monthly burn + 10-month runway. Options: Reduce to £35K burn (14 months runway), increase revenue £20K/month (break even sooner), raise £500K seed (24+ month runway). Reality: Usually combination (cut 20%, grow 30%, raise £300K = 20+ months).",
      "Runway scenarios and planning: Conservative (assume revenue flat, spend stays). Moderate (assume 10% monthly growth, 5% monthly spend growth). Optimistic (assume 20% growth, 10% growth spend). Plan for worst case (conservative). Example: 10-month runway with £50K burn. Conservative: still need fundraising in 10 months. Moderate: might extend to 15 months. Optimistic: might hit breakeven. Strategy: Plan fundraising 12 months before money runs out (allows 6-month process + buffer). Start conversations at 18 months of runway."
    ],
    content: [
      {
        heading: "Managing Cash and Calculating Runway",
        body: `Planning for cash sustainability.

**Understanding burn rate**

Definition:
- Gross burn: Total monthly expenses (before revenue)
- Net burn: Monthly expenses minus revenue (what actually drains cash)
- Example: £200K expenses, £50K revenue = £150K net monthly burn

Calculating runway:
- Runway (months) = Current cash / Monthly net burn
- Example: £600K cash, £100K net burn = 6 months runway
- Critical point: <6 months runway = urgent, >12 months = comfortable

Monthly tracking:
| Month | Revenue | Expenses | Net Burn | Cash Left | Runway |
|---|---|---|---|---|---|
| Month 1 | £50K | £200K | (£150K) | £450K | 3 months |
| Month 2 | £60K | £210K | (£150K) | £300K | 2 months |
| Month 3 | £70K | £220K | (£150K) | £150K | 1 month |

Red flags:
- Runway < 6 months without funding plan = crisis
- Burn rate accelerating = unsustainable
- Revenue flat while burn growing = problem
- No fundraising plan when runway = 12 months = late

**Burn rate optimization**

Where to cut (prioritize):
1. Salaries and headcount (50-60% of spend typically)
2. Infrastructure and hosting (10-15%)
3. Third-party software (5-10%)
4. Marketing and customer acquisition (10-15%)
5. Overhead (5-10%)

Balanced approach:
- Cut 20-30% burn without destroying growth
- Example: From £150K/month to £110K/month
  - Eliminate: 2 hires delayed (£40K)
  - Reduce: Marketing by 50% (£15K)
  - Optimize: Software subscriptions (£5K)
  - Result: £30K burn reduction

Growth levers (increase revenue):
- Sales productivity: More customers faster
- Pricing: Higher average deal size
- Expansion: Upsell to existing customers
- Efficiency: Better CAC payback

Example growth impact:
- Current: £50K MRR, 40% growth (£20K/month growth)
- If accelerate to 60% growth (£30K/month growth)
- Cash impact: Extends runway by 3+ months if burn stays flat

**Runway planning framework**

Timeline:
- 24+ months: Comfortable (can invest, grow)
- 18-24 months: Plan fundraising (start conversations)
- 12-18 months: Active fundraising (in process)
- 6-12 months: Urgent (close or extend drastically)
- <6 months: Crisis (drastic action needed)

Planning decision tree:
1. Current runway: 10 months
2. Fundraising timeline: 3-6 months
3. Buffer needed: 3-6 months (contingency)
4. Action point: Start fundraising now if 10 months (allows 3-month process, 3-month buffer)
5. Alternative: Cut burn to extend runway (buy time)

**Scenario modeling**

Conservative scenario (no growth):
- Revenue stays flat
- Expenses stay flat
- Runway: As calculated (6 months if £600K cash, £100K burn)
- Plan: Must fundraise before month 6

Moderate scenario (growth):
- Revenue grows 10% monthly (£50K → £55K → £60K...)
- Expenses grow 5% monthly (staff hires slow)
- Runway: Extends, potentially 9-12 months
- Plan: Fundraising still critical at 12 months

Optimistic scenario:
- Revenue grows 20% monthly
- Expenses grow 3% monthly
- Runway: Could hit 18+ months or breakeven
- Plan: Can be more selective with funding

Example model:

| Month | Revenue | Growth | Expenses | Burn | Cumulative Burn | Cash Left | Runway |
|---|---|---|---|---|---|---|---|
| 0 | £50K | - | £200K | (£150K) | - | £600K | 4 mo |
| 1 | £55K | 10% | £210K | (£155K) | (£155K) | £445K | 2.9 mo |
| 2 | £60K | 10% | £220K | (£160K) | (£315K) | £285K | 1.8 mo |
| 3 | £66K | 10% | £231K | (£165K) | (£480K) | £120K | 0.7 mo |

Conclusion: Even with moderate growth, runway extends only to 3-4 months. Need fundraising now.

**Action plan**

Weekly monitoring:
- Cash balance (verify bank)
- Revenue (pace vs forecast)
- Expenses (any surprises?)
- Runway (update calculation)

Monthly review:
- Detailed P&L (vs plan)
- Burn trend (accelerating or decelerating?)
- Runway forecast (next quarter)
- Decisions: Continue current pace? Cut? Grow faster?

Quarterly planning:
- Scenario analysis (conservative, moderate, optimistic)
- Fundraising plan (if needed)
- Hiring plan (impacts burn)
- Revenue targets (impact on runway)

When runway < 12 months:
- Start investor conversations (warm intros)
- Prepare materials (deck, financials)
- Set fundraising target (how much, what valuation)
- Plan B: If fundraising fails, how cut burn to breakeven?

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "cash-flow-management-and-working-capital", "advanced-financial-modeling-and-forecasting", "scenario-planning-and-sensitivity-analysis", "risk-management-and-contingency-planning"],
    faq: [
      { q: "How do I calculate my runway?", a: "Runway = Current cash / Monthly net burn. Net burn = Monthly expenses - Monthly revenue. Example: £500K cash, £100K/month burn = 5 months runway. Update monthly and start fundraising planning when runway < 12 months." },
      { q: "What's a healthy burn rate?", a: "Depends on stage. Early stage (pre-product): Can burn heavily (raising capital). Growth (product-market fit): Burn should decrease as revenue grows. Goal: Decreasing burn rate month-over-month (more efficient). Watch: Burn rate acceleration = red flag." },
      { q: "How do I extend my runway?", a: "Options: (1) Reduce burn (cut costs 20-30%), (2) Increase revenue (sales or pricing), (3) Raise capital (fundraising), (4) Combination (most effective). Plan 12 months before money runs out. If <6 months runway, need immediate action." }
    ],
    videoUrl: ""
  }
];

export default batch286Articles;