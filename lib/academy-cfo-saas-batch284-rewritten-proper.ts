import { AcademyArticle } from "@/types/academy";

export const batch284Articles: AcademyArticle[] = [
  {
    slug: "benchmarking-and-competitive-analysis",
    title: "Benchmarking and Competitive Analysis: How You Stack Up",
    description: "Master benchmarking. Compare metrics, identify gaps, improve performance.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["benchmarking", "competitive analysis", "metrics comparison", "performance benchmarks", "industry standards"],
    keyTakeaways: [
      "Benchmarking types: Against competitors (direct comparison), industry averages (SaaS norms), own history (quarter-over-quarter improvement). Cost: Research (analyst reports £5-10K), time (collecting data). Benefit: Identify gaps (where underperforming), improvement targets (realistic goals), competitive positioning (how position relative to peers). Example: Your churn 3% vs competitor 1% = gap, investigate why (product, onboarding, support quality). Target: Match or beat best-in-class (1-2% churn typical for mature SaaS).",
      "Metrics to benchmark: CAC (how compare to peers?), LTV (customer lifetime value), payback (months to recover CAC), NRR (expansion), churn (monthly %), magic number (efficiency), gross margin (profitability). SaaS averages by stage: Growth (£1-10M ARR): CAC £2-5K, LTV £30-100K, payback 8-12 months, NRR 110-120%, churn 2-3%. Scaling (£10-50M): CAC £3-8K, LTV £100-300K, payback 6-10 months, NRR 120-130%, churn <2%. Use for: Setting targets (aim for benchmark or better), identifying investment priorities (if CAC high, optimize marketing), understanding unit economics (realistic expectations).",
      "Improvement approach: Identify gap (where underperform), root cause analysis (why gap exists?), action plan (how improve?), track progress (measure improvement). Example: Churn 3% vs 1% benchmark. Root cause: Onboarding weak (customers don't realize value). Action: Improve onboarding, add success playbook. Track: Churn improvement over next 3 months (goal: 2% month 3, 1% month 6). Cost: Investment in improvement (CS team, product features). Benefit: Close gap, improve competitiveness, increase profitability."
    ],
    content: [
      {
        heading: "Benchmarking Performance and Metrics",
        body: `Comparing your company to peers and standards.

**Key SaaS benchmarks by stage**

Growth stage (£1-10M ARR):
| Metric | Benchmark | Why matters |
|---|---|---|
| CAC | £2-5K | Cost-efficient acquisition |
| LTV | £30-100K | Revenue sufficient for payback |
| Payback | 8-12 months | Timeline to recoup acquisition cost |
| NRR | 110-120% | Growth from existing customers |
| Monthly churn | 2-3% | Acceptable for early stage |
| Gross margin | 60-70% | Profitability on product |
| Magic number | >0.75 | Efficient growth |

Scaling stage (£10-50M ARR):
| Metric | Benchmark | Why matters |
|---|---|---|
| CAC | £3-8K | Consistent, higher ACV justifies |
| LTV | £100-300K | Higher customer value |
| Payback | 6-10 months | Faster payback, better efficiency |
| NRR | 120-130% | Strong expansion revenue |
| Monthly churn | <2% | Mature product, sticky |
| Gross margin | 70-80% | Better economics |
| Magic number | >1.0 | Highly efficient growth |

**Benchmarking exercise**

Step 1: Collect your metrics (last 12 months)
- CAC: £ to acquire customer (from marketing/sales spend)
- LTV: Expected lifetime value (ARPU × gross margin × lifetime months)
- Payback: CAC / (ARPU × gross margin)
- NRR: (ARR start - churn + expansion) / ARR start
- Churn: Monthly % of customers lost
- Magic number: (£ revenue growth) / (£ sales + marketing spend)

Step 2: Compare to benchmarks
- Your CAC £2K vs benchmark £2-5K = within range (good)
- Your churn 4% vs benchmark 2-3% = above range (problem)
- Your payback 14 months vs benchmark 8-12 months = too long (issue)

Step 3: Identify gaps
| Metric | Your | Benchmark | Gap | Priority |
|---|---|---|---|---|
| CAC | £2K | £2-5K | Good | Low |
| Churn | 4% | 2-3% | High | High |
| Payback | 14 mo | 8-12 mo | High | High |
| NRR | 105% | 110-120% | Medium | Medium |

Step 4: Root cause analysis
- High churn (4% vs 2-3%): Why? Customer success issue? Product quality? Onboarding?
- Long payback (14 vs 8-12): Why? High CAC? Low ARPU? High churn extends payback?

Step 5: Action plan
- Churn: Improve onboarding (CS investment), add success playbook
- Payback: Either reduce CAC (marketing efficiency) or increase ARPU (pricing, expansion)
- Timeline: 3-month improvement plan (measure progress monthly)

**Competitive benchmarking**

vs direct competitors:
- Public company data (annual reports, SEC filings)
- Pitch decks (leaked, shared in forums)
- Customer feedback (what alternatives considered?)
- Sales intel (win/loss analysis by competitor)

Example competitive data:
| Metric | You | Competitor A | Competitor B |
|---|---|---|---|
| Churn | 4% | 2% | 1.5% |
| NRR | 105% | 125% | 135% |
| CAC payback | 14 mo | 8 mo | 6 mo |
| Pricing (SMB) | £50/mo | £60/mo | £40/mo |

Interpretation:
- Competitor B best efficiency (payback 6 mo), lowest price
- Competitor A strong expansion (NRR 125%), mid pricing
- You: Worse churn, weaker expansion, longer payback

Improvement targets:
- Match Competitor B on payback (reduce CAC or increase ARPU)
- Match Competitor A on NRR (improve expansion)
- Differentiate on other dimensions (product quality, support)

**Benchmarking cadence and use**

Quarterly:
- Collect internal metrics
- Compare to benchmarks
- Identify trends (improving or worsening?)
- Action: Adjust strategy if gaps growing

Annual:
- Deep competitive analysis
- Identify strategic positioning (leader, follower, niche?)
- Long-term improvement plan (3-year targets)

Use for:
- Goal setting (realistic targets based on benchmarks)
- Investor communication (showing relative performance)
- Hiring (competitive comp, equity packages vs peers)
- Strategy (where to focus improvement efforts)

`
      }
    ],
    relatedSlugs: ["competitive-intelligence-and-market-monitoring", "metrics-dashboard-design-kpi-tracking", "unit-economics-ltv-cac-payback"],
    faq: [
      { q: "What metrics should I benchmark?", a: "Key: CAC, LTV, payback, NRR, churn, gross margin, magic number. Compare: Your metrics vs industry benchmarks vs direct competitors. Frequency: Quarterly (track trend), annual (deep analysis). Use: Identify gaps, set improvement targets, gauge competitive position." },
      { q: "How do I find benchmark data?", a: "Sources: Analyst reports (Gartner £1-10K), public company filings (SEC), pitch decks (leaked), customer feedback (win/loss), industry surveys. Pay: Some costs (reports), some free (public filings, surveys). Effort: Research time to compile data." },
      { q: "What should I do if I'm below benchmark?", a: "1. Identify gap (how far behind?). 2. Root cause (why gap exists?). 3. Action plan (how improve?). 4. Track progress (measure monthly). Example: Churn 4% vs 2% benchmark = improve onboarding (CS investment), target 2% in 6 months." }
    ],
    videoUrl: ""
  }
];

export default batch284Articles;