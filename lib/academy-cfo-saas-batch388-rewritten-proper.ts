import { AcademyArticle } from "@/types/academy";

export const batch388Articles: AcademyArticle[] = [
  {
    slug: "saas-customer-success-economics",
    title: "Customer Success Economics: The Financial Case for CS Investment",
    description: "Master CS economics. Quantify CS ROI, optimise team structure, and prove the financial impact of retention.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["customer success", "CS economics", "retention ROI", "customer success team", "CS metrics"],
    keyTakeaways: [
      "CS ROI calculation: Customer success is an investment, not a cost centre. Formula: CS ROI = (Revenue retained by CS + Expansion driven by CS - CS team cost) / CS team cost. Example: CS team cost £300K/year. Revenue protected from churn: £800K (estimated churn without CS: 15%, with CS: 8%, delta on £5M ARR). Expansion driven: £200K. ROI: (£800K + £200K - £300K) / £300K = 2.3x return. Every £1 spent on CS returns £2.30.",
      "CS team sizing and structure: Ratio depends on segment. Enterprise: 1 CSM per 10-15 accounts (high-touch). Mid-market: 1 CSM per 30-50 accounts (medium-touch). SMB: 1 CSM per 100-200 accounts (low-touch, tech-assisted). Self-serve: No dedicated CSM (automated, pooled support). Cost per CSM: £40-60K (mid-level) + £5-10K tools. Example: 200 mid-market customers ÷ 40 accounts per CSM = 5 CSMs. Total CS cost: 5 × £55K = £275K. Revenue managed: £2M ARR. CS cost as % of managed revenue: 13.75%.",
      "CS-driven expansion: CSMs are the primary expansion revenue channel. Best practice: CSMs own expansion pipeline (or work closely with account managers). Target: 20-40% of new ARR from existing customers. Metrics: (1) Expansion rate per CSM, (2) Upsell conversion rate, (3) Cross-sell attachment rate, (4) Net revenue retention by CSM. Example: 5 CSMs each drive £40K expansion/year = £200K total. CSM comp: Consider expansion bonus (5-10% of expansion revenue generated)."
    ],
    content: [
      {
        heading: "Building a Financially Justified Customer Success Function",
        body: `Proving the ROI of customer success with hard numbers.

**The financial case for customer success**

CS as investment:

Without CS:
- ARR: £5M
- Annual churn: 15% (£750K lost)
- Expansion: 5% (£250K gained)
- Net revenue retention: 90%
- Year 2 ARR from existing: £4.5M

With CS (£300K investment):
- ARR: £5M
- Annual churn: 8% (£400K lost)
- Expansion: 9% (£450K gained)
- Net revenue retention: 101%
- Year 2 ARR from existing: £5.05M

Impact:
- Churn reduction: £350K saved
- Expansion increase: £200K gained
- Total impact: £550K
- CS cost: £300K
- Net ROI: £250K (83% return)

Compounding effect over 3 years:

| Year | Without CS (NRR 90%) | With CS (NRR 101%) | Difference |
|---|---|---|---|
| 1 | £5,000K | £5,000K | £0 |
| 2 | £4,500K | £5,050K | £550K |
| 3 | £4,050K | £5,100K | £1,050K |

Cumulative difference: £1.6M over 3 years from £300K annual investment

At 8x revenue multiple:
- Without CS: £4.05M × 8 = £32.4M valuation
- With CS: £5.1M × 8 = £40.8M valuation
- Valuation difference: £8.4M

**CS team sizing model**

Coverage model by segment:

Enterprise (>£50K ACV):
- Ratio: 1 CSM per 10-15 accounts
- Touch model: High-touch (weekly calls, QBRs, custom success plans)
- CSM level: Senior (£55-75K)
- Revenue managed per CSM: £500K-750K

Mid-market (£10-50K ACV):
- Ratio: 1 CSM per 30-50 accounts
- Touch model: Medium-touch (monthly calls, quarterly reviews)
- CSM level: Mid-level (£40-55K)
- Revenue managed per CSM: £600K-1M

SMB (£1-10K ACV):
- Ratio: 1 CSM per 100-200 accounts
- Touch model: Low-touch (automated + pooled CSM)
- CSM level: Junior + automation (£30-40K)
- Revenue managed per CSM: £300K-500K

Self-serve (<£1K ACV):
- Ratio: No dedicated CSM
- Touch model: Tech-touch (automated onboarding, in-app guidance)
- Investment: Product and tools
- Revenue managed: Automated

Example team sizing:

Company: £5M ARR
- 20 enterprise accounts (£2M ARR): 2 senior CSMs
- 100 mid-market accounts (£2M ARR): 3 mid-level CSMs
- 500 SMB accounts (£1M ARR): 2 junior CSMs + automation

Team:
| Role | Count | Salary | Total |
|---|---|---|---|
| CS Manager | 1 | £65K | £65K |
| Senior CSM (Enterprise) | 2 | £60K | £120K |
| Mid CSM (Mid-market) | 3 | £45K | £135K |
| Junior CSM (SMB) | 2 | £35K | £70K |
| Total | 8 | - | £390K |

Plus tools and overhead: £50K
Total CS cost: £440K
As % of ARR: 8.8%

Benchmark: CS cost should be 5-15% of managed ARR
- Below 5%: Under-invested (churn risk)
- 5-10%: Healthy
- 10-15%: Appropriate for enterprise-heavy
- Above 15%: Over-invested (look for efficiency)

**CS compensation structure**

Base + variable model:

| Level | Base | Variable | Total OTE | Variable structure |
|---|---|---|---|---|
| Junior CSM | £30K | £5K | £35K | 100% retention-based |
| Mid CSM | £40K | £10K | £50K | 50% retention, 50% expansion |
| Senior CSM | £55K | £15K | £70K | 40% retention, 40% expansion, 20% strategic |
| CS Manager | £60K | £20K | £80K | Team metrics |

Variable components:

Retention (prevent churn):
- Measured: Gross retention rate of managed accounts
- Target: >90% gross retention
- Payout: Full bonus if above target, reduced below

Expansion (grow revenue):
- Measured: Expansion ARR from managed accounts
- Target: Individual quota (e.g., £40K expansion/year)
- Payout: Commission on expansion (5-10% of expansion value)

Strategic (business impact):
- Measured: Case studies, references, NPS improvement
- Target: Qualitative goals
- Payout: Discretionary

Example payout:

Senior CSM managing £500K ARR:
- Retention target: >92% → Actual: 95% → Full retention bonus: £6K
- Expansion target: £40K → Actual: £55K → Commission: £55K × 8% = £4.4K + overachievement
- Strategic: 2 case studies completed → £2K
- Total variable: £12.4K (of £15K OTE)

**CS metrics framework**

Leading indicators (predict outcomes):

| Metric | Definition | Target | Action if below |
|---|---|---|---|
| Health score average | Weighted product engagement | >70/100 | Proactive outreach |
| Onboarding completion | % completing onboarding | >80% | Improve onboarding |
| Feature adoption | % using key features | >60% | Training campaigns |
| CSM meeting cadence | % of scheduled meetings held | >90% | CSM accountability |
| NPS/CSAT trend | Direction of satisfaction | Improving | Root cause analysis |
| Support ticket trend | Volume and severity | Stable/declining | Product quality |

Lagging indicators (measure outcomes):

| Metric | Definition | Target |
|---|---|---|
| Gross retention rate | Revenue retained (excl expansion) | >90% |
| Net revenue retention | Revenue retained + expansion | >110% |
| Expansion rate | Expansion ARR / starting ARR | >8% annual |
| Logo churn | Customers lost | <10% annual |
| Time to value | Days to first value realisation | <30 days |
| CSAT | Customer satisfaction score | >4.2/5 |

CS team productivity:

| Metric | Definition | Target |
|---|---|---|
| Revenue per CSM | Managed ARR per CSM | £400K-800K |
| Expansion per CSM | Expansion ARR per CSM/year | £30-60K |
| Retention per CSM | Gross retention of managed book | >90% |
| Activities per CSM | Meetings, emails, reviews per week | 15-25 |

**Proving CS ROI to the board**

Quarterly CS business review:

Slide 1: CS team investment and coverage
- Team size, cost, coverage ratios
- Year-over-year comparison

Slide 2: Retention impact
- Churn rate trend (attributable to CS)
- Revenue protected (ARR that would have churned without CS intervention)
- Example: 15 at-risk accounts (£300K ARR) saved this quarter

Slide 3: Expansion impact
- Expansion ARR driven by CS
- Upsell pipeline and conversion
- Example: £120K expansion closed, £200K pipeline

Slide 4: ROI calculation
- Revenue protected + expansion driven
- Less: CS team cost
- ROI ratio
- Example: (£300K + £120K) / £110K quarterly cost = 3.8x

Slide 5: Health trends
- Health score distribution
- At-risk account count and trend
- Forecast for next quarter

Attribution methodology:

Retention attribution:
- Track at-risk accounts (health score <40)
- Monitor CS interventions
- Track outcome (retained vs churned)
- Example: 20 at-risk accounts, CS intervened in 15, saved 12 (80% save rate)
- Revenue protected: 12 accounts × £25K average = £300K

Expansion attribution:
- CS-generated expansion pipeline
- CS-assisted expansion (identified by CSM, closed by sales)
- Direct attribution: CSM owned the upsell process
- Assisted attribution: CSM identified opportunity, sales closed

Combined:
- Direct CS impact: 60% of retention, 40% of expansion
- Assisted impact: 20% of retention, 30% of expansion
- Be conservative in attribution (builds credibility)

**Scaling CS with technology**

CS platform economics:

| Tool | Cost | Impact |
|---|---|---|
| Gainsight | £2-5K/mo | Health scoring, automation, workflows |
| Totango | £1-3K/mo | Customer health, playbooks |
| ChurnZero | £1-2K/mo | Real-time alerts, engagement |
| Vitally | £500-2K/mo | Analytics, automation |
| Planhat | £500-1.5K/mo | Health, revenue, workflows |

ROI of CS platform:
- Enables 1 CSM to manage 50% more accounts
- Automated health scoring saves 5 hours/CSM/week
- Playbook automation handles 30% of routine tasks
- Example: 5 CSMs can do the work of 7-8 without platform
- Savings: 2-3 CSM salaries (£80-135K) vs platform cost (£24-60K)
- Net savings: £50-100K/year

Tech-touch for SMB/self-serve:
- Automated onboarding sequences
- In-app health tracking
- Triggered email campaigns
- Self-serve expansion (upgrade in-app)
- Cost: £500-2K/month
- Replaces: 2-3 junior CSMs (£70-120K savings)

`
      }
    ],
    relatedSlugs: ["saas-churn-analysis-and-retention-strategy", "land-and-expand-strategy-expansion-revenue", "saas-unit-economics-deep-dive", "hiring-and-team-building-economics", "sales-compensation-and-incentive-structures"],
    faq: [
      { q: "How do I calculate the ROI of customer success?", a: "Formula: (Revenue retained by CS + Expansion driven by CS - CS cost) / CS cost. Example: CS team costs £300K. Without CS: 15% churn (£750K lost). With CS: 8% churn (£400K lost). Churn saved: £350K. Expansion driven: £200K. ROI: (£350K + £200K - £300K) / £300K = 83% return. Compounding over 3 years, NRR improvement adds £1.6M+ in retained revenue." },
      { q: "How many CSMs do I need?", a: "Depends on segment. Enterprise (>£50K ACV): 1 CSM per 10-15 accounts. Mid-market (£10-50K): 1 per 30-50 accounts. SMB (£1-10K): 1 per 100-200 accounts. Self-serve (<£1K): No dedicated CSM (automated). CS cost should be 5-15% of managed ARR. Example: £5M ARR across segments needs 7-8 CSMs totalling £390K + £50K tools = £440K (8.8% of ARR)." },
      { q: "Should CSMs be compensated on expansion revenue?", a: "Yes, with balanced structure. Recommended split: 40-50% retention-based (gross retention rate), 40-50% expansion-based (upsell/cross-sell revenue), 10-20% strategic (case studies, NPS). Commission on expansion: 5-10% of expansion value. Example: Senior CSM with £15K variable — £6K retention, £6K expansion, £3K strategic. This aligns CSMs with both protecting and growing revenue." }
    ],
    videoUrl: ""
  }
];

export default batch388Articles;
