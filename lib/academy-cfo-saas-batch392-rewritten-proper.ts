import { AcademyArticle } from "@/types/academy";

export const batch392Articles: AcademyArticle[] = [
  {
    slug: "saas-vertical-vs-horizontal-economics",
    title: "Vertical vs Horizontal SaaS Economics: Choosing Your Market Strategy",
    description: "Master vertical and horizontal SaaS economics. Compare market approaches, unit economics, and growth strategies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["vertical SaaS", "horizontal SaaS", "market strategy", "TAM", "industry-specific"],
    keyTakeaways: [
      "Horizontal SaaS economics: Broad market (all industries). Larger TAM (£10B+), but more competition. Unit economics: Higher CAC (£5-15K, competitive market), moderate ARPU (£200-2K/month), moderate churn (8-15% annual). Examples: Slack, HubSpot, Notion. Key metric: Market share in crowded category. Growth strategy: Product-led growth, brand marketing, outbound sales. Requires significant capital to win category (often £50M+ raised).",
      "Vertical SaaS economics: Industry-specific (dental, construction, restaurants). Smaller TAM (£500M-5B), but less competition. Unit economics: Lower CAC (£1-5K, focused market), higher ARPU (£500-5K/month, industry-critical), lower churn (5-10% annual, high switching costs). Examples: Procore (construction), Veeva (pharma), Toast (restaurants). Key metric: Industry penetration rate. Growth strategy: Industry events, word-of-mouth, partnerships. Can reach profitability faster with less capital.",
      "Financial comparison: Vertical SaaS typically wins on efficiency. Comparison at £10M ARR: Vertical — 25% S&M spend, 85% gross margin, 6% annual churn, 5:1 LTV:CAC, 35% operating margin. Horizontal — 45% S&M spend, 78% gross margin, 12% annual churn, 3:1 LTV:CAC, -5% operating margin. Vertical reaches profitability at £5-10M ARR. Horizontal may need £30-50M ARR. But horizontal has 5-10x larger exit potential (larger TAM)."
    ],
    content: [
      {
        heading: "Comparing Vertical and Horizontal SaaS Business Models",
        body: `Understanding which market strategy best fits your company economics.

**Horizontal SaaS characteristics**

Definition: Software solving a problem across all industries

Examples:
- CRM (Salesforce, HubSpot)
- Communication (Slack, Teams)
- Project management (Asana, Monday)
- HR (BambooHR, Personio)
- Accounting (Xero, QuickBooks)

Financial profile:

TAM: Large (£10B-100B+)
Competition: High (5-20+ well-funded competitors)
Winner-take-most dynamics: Top 2-3 players capture 60-80% of market

Unit economics:

| Metric | Horizontal SaaS | Range |
|---|---|---|
| ARPU | £200-2K/month | Wide range |
| CAC | £5-15K | High (competitive) |
| Annual churn | 8-15% | Moderate-high |
| Gross margin | 75-82% | Standard SaaS |
| S&M as % revenue | 35-55% | High |
| LTV:CAC | 2.5-4:1 | Moderate |
| CAC payback | 15-24 months | Long |

Growth levers:
- Product-led growth (freemium, viral)
- Brand marketing (awareness in crowded market)
- Channel partnerships (resellers, consultants)
- International expansion (large addressable market)
- Multi-product (expand wallet share)

Funding requirements:
- Typically raise £30-100M+ to win category
- Need to outspend competitors on S&M
- Product R&D investment is substantial
- Path to profitability: £30-50M+ ARR

Example P&L at £10M ARR:

| Line item | Amount | % revenue |
|---|---|---|
| Revenue | £10,000K | 100% |
| COGS | -£2,000K | -20% |
| Gross profit | £8,000K | 80% |
| R&D | -£2,500K | -25% |
| S&M | -£4,500K | -45% |
| G&A | -£1,500K | -15% |
| Operating loss | -£500K | -5% |

Rule of 40: 50% growth + (-5%) margin = 45% (above 40 ✓)

**Vertical SaaS characteristics**

Definition: Software built for a specific industry

Examples:
- Construction: Procore, PlanGrid
- Healthcare: Veeva, Athenahealth
- Real estate: AppFolio, Buildium
- Restaurants: Toast, Square for Restaurants
- Legal: Clio, PracticePanther
- Dental: Dentally, Software of Excellence

Financial profile:

TAM: Moderate (£500M-10B)
Competition: Low (2-5 focused competitors)
Winner-take-all dynamics: Often 1-2 dominant players per vertical

Unit economics:

| Metric | Vertical SaaS | Range |
|---|---|---|
| ARPU | £500-5K/month | Higher (mission-critical) |
| CAC | £1-5K | Lower (focused market) |
| Annual churn | 5-10% | Lower (switching costs) |
| Gross margin | 80-88% | Higher (deep integration) |
| S&M as % revenue | 15-30% | Lower (focused) |
| LTV:CAC | 4-8:1 | Higher |
| CAC payback | 8-15 months | Shorter |

Growth levers:
- Industry conferences and events
- Word-of-mouth (tight community)
- Industry association partnerships
- Referral programmes
- Vertical content marketing (industry blog)
- Strategic integrations with industry tools

Funding requirements:
- Can reach profitability with £5-20M raised
- Less competitive spending required
- Focused R&D (one industry to serve)
- Path to profitability: £5-15M ARR

Example P&L at £10M ARR:

| Line item | Amount | % revenue |
|---|---|---|
| Revenue | £10,000K | 100% |
| COGS | -£1,500K | -15% |
| Gross profit | £8,500K | 85% |
| R&D | -£2,000K | -20% |
| S&M | -£2,500K | -25% |
| G&A | -£1,000K | -10% |
| Operating profit | £3,000K | 30% |

Rule of 40: 30% growth + 30% margin = 60% (well above 40 ✓)

**Side-by-side comparison**

| Factor | Horizontal | Vertical |
|---|---|---|
| TAM | £10B-100B+ | £500M-10B |
| Competition | High | Low |
| ARPU | Lower | Higher |
| CAC | Higher | Lower |
| Churn | Higher | Lower |
| Gross margin | 75-82% | 80-88% |
| S&M spend | 35-55% of rev | 15-30% of rev |
| LTV:CAC | 2.5-4:1 | 4-8:1 |
| Path to profit | £30-50M ARR | £5-15M ARR |
| Exit multiple | 8-20x ARR | 6-15x ARR |
| Exit size potential | £500M-50B | £100M-5B |
| Capital required | £30-100M+ | £5-30M |
| Product complexity | Broad features | Deep domain |
| Sales cycle | Varies | Industry-specific |
| Switching costs | Moderate | High |

**Choosing your strategy**

Choose horizontal if:
- Solving a universal problem (every business has it)
- Product has viral/network effects
- Team has category marketing expertise
- Can raise significant capital (£30M+)
- Want massive exit potential (£1B+)
- Technical differentiation is strong

Choose vertical if:
- Team has deep industry expertise
- Industry is underserved by software
- Customers will pay premium for industry-specific features
- Prefer faster path to profitability
- Capital efficient (bootstrapping or modest raises)
- Regulatory complexity creates moat

**Vertical SaaS expansion strategies**

Growing beyond initial TAM:

Strategy 1: Adjacent vertical expansion
- Start in dental, expand to optometry, veterinary
- Leverage similar workflows and regulatory knowledge
- Example: £500M dental TAM + £300M optometry + £200M veterinary = £1B TAM
- Risk: Each vertical requires industry-specific knowledge

Strategy 2: Vertical platform (multi-product)
- Start with practice management, add billing, add patient engagement
- Capture more of customer's spend
- Example: Practice management £200/month → Full suite £800/month (4x ARPU)
- Lower risk: Same customer, more products

Strategy 3: Embedded fintech
- Add payments processing (2-3% of transactions)
- Add lending (industry-specific loans)
- Add payroll
- Example: Toast earns 80% of revenue from payments, not software
- Expands TAM dramatically

Strategy 4: Data and marketplace
- Aggregate industry data (benchmarking)
- Build marketplace (suppliers, job board)
- Monetise with data products and marketplace fees
- Example: Industry benchmarks subscription £500/month
- Adds recurring revenue with minimal COGS

**Financial modelling for each approach**

Horizontal 5-year model:

| Year | ARR | Growth | S&M % | Op margin | Cash required |
|---|---|---|---|---|---|
| 1 | £2M | 150% | 60% | -40% | £5M |
| 2 | £5M | 150% | 55% | -30% | £12M |
| 3 | £10M | 100% | 45% | -5% | £20M |
| 4 | £18M | 80% | 40% | 5% | £5M |
| 5 | £30M | 67% | 35% | 15% | £0 |

Total capital: £42M
Profitable: Year 4 (£18M ARR)

Vertical 5-year model:

| Year | ARR | Growth | S&M % | Op margin | Cash required |
|---|---|---|---|---|---|
| 1 | £1M | 200% | 30% | -20% | £1.5M |
| 2 | £3M | 200% | 25% | 0% | £2M |
| 3 | £6M | 100% | 22% | 15% | £0 |
| 4 | £10M | 67% | 20% | 25% | £0 |
| 5 | £15M | 50% | 18% | 32% | £0 |

Total capital: £3.5M
Profitable: Year 2-3 (£3-6M ARR)

Capital efficiency:
- Horizontal: £42M raised for £30M ARR = £1.40 raised per £1 ARR
- Vertical: £3.5M raised for £15M ARR = £0.23 raised per £1 ARR
- Vertical is 6x more capital efficient

Exit comparison (at year 5):
- Horizontal: £30M ARR × 12x = £360M exit, £42M raised = 8.6x return
- Vertical: £15M ARR × 10x = £150M exit, £3.5M raised = 42.9x return

Founder ownership:
- Horizontal: Multiple rounds, founder owns ~15-20%: £54-72M
- Vertical: 1-2 rounds, founder owns ~50-60%: £75-90M

Vertical often better for founder economics despite smaller exit

`
      }
    ],
    relatedSlugs: ["enterprise-vs-smb-economics-segment-strategy", "saas-metrics-benchmarking-and-peer-comparison", "saas-pricing-strategy-and-monetisation", "customer-acquisition-strategy-and-marketing-roi", "saas-unit-economics-deep-dive"],
    faq: [
      { q: "What is vertical SaaS and why does it have better unit economics?", a: "Vertical SaaS is industry-specific software (dental, construction, restaurants). Better economics because: Lower CAC (focused marketing to defined audience), higher ARPU (mission-critical, premium pricing), lower churn (high switching costs, deep integration). LTV:CAC typically 4-8:1 vs 2.5-4:1 for horizontal. Reaches profitability at £5-15M ARR vs £30-50M for horizontal. Trade-off: Smaller TAM limits exit size." },
      { q: "How do I choose between vertical and horizontal?", a: "Choose vertical if: Deep industry expertise, industry is underserved, customers pay premium for specialisation, want faster profitability, capital efficient. Choose horizontal if: Solving universal problem, product has viral effects, can raise £30M+, want £1B+ exit potential. Vertical: £3.5M capital → £15M ARR → £150M exit (42x return). Horizontal: £42M capital → £30M ARR → £360M exit (8.6x return). Vertical often better for founder economics." },
      { q: "How can vertical SaaS companies grow beyond their initial TAM?", a: "Four strategies: (1) Adjacent verticals (dental → optometry → veterinary), (2) Multi-product (add billing, patient engagement to practice management — 4x ARPU), (3) Embedded fintech (add payments, lending — Toast earns 80% from payments), (4) Data and marketplace (benchmarking, supplier marketplace). Multi-product is lowest risk. Embedded fintech has highest revenue potential. Each strategy can 2-5x your effective TAM." }
    ],
    videoUrl: ""
  }
];

export default batch392Articles;
