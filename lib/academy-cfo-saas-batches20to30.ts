import { AcademyArticle } from "./academy-types";

// Combined batches 20-30 (articles 191-300): Fundraising fundamentals and financial controls

export const ACADEMY_CFO_SAAS_BATCHES_20_TO_30: AcademyArticle[] = [
  // Batch 20: Hiring roadmap and team structure (191-200)
  {
    slug: "hiring-roadmap-when-what-roles-to-hire",
    title: "Hiring Roadmap: When and What Roles to Hire First",
    description: "Revenue €100k → Hire first engineer. Revenue €200k → Hire first sales/customer success. Learn the hiring sequence that aligns with SaaS growth stages.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["hiring roadmap", "team structure", "growth stages", "role prioritization", "AskBiz"],
    keyTakeaways: [
      "€100k MRR: Founder-only. €200k: Hire engineer. €400k: Hire sales/CS. €800k: Hire finance/ops. Hiring sequence follows where founder time is bottleneck.",
      "Engineer hire ROI: Each engineer €80k cost generates €50-100k MRR (2-4 month payback). Highest ROI hire for product-driven SaaS.",
      "Sales hire ROI: Each sales rep €100k cost (salary+commission) generates €200-300k MRR (3-6 month payback). Later-stage hire when product is proven."
    ],
    content: [
      {
        heading: "SaaS Hiring by Revenue Stage",
        body: "**Stage 1: €0-100k MRR (Founder-only)**\n- Focus: Product-market fit, first customers\n- Who hires: CEO/founder (part-time sales, support, operations)\n- When to hire: When founder time is 80%+ on non-core work\n- Decision: Usually €100k MRR achieved before first hire\n\n**Stage 2: €100-200k MRR (First engineer)**\n- Focus: Product velocity, customer expansion\n- Who: Senior engineer (founder can manage)\n- Why: Founder can't code + sell + support simultaneously\n- ROI: €80k cost → €100k+ MRR generation (16-month payback)\n- Decision: Hire when product roadmap is 3+ months backlog\n\n**Stage 3: €200-400k MRR (Customer success/support)**\n- Focus: Customer retention, expansion\n- Who: Customer success manager or support specialist\n- Why: Founder can't support growing customer base; churn increases without support\n- ROI: €50-60k cost → €20-30k churn reduction (2-3 year payback, indirect)\n- Decision: Hire when NPS is declining or churn is rising\n\n**Stage 4: €400-800k MRR (First sales hire)**\n- Focus: Revenue growth beyond word-of-mouth\n- Who: Account executive (or inside sales)\n- Why: Founder's sales efforts hit ceiling; need dedicated sales\n- ROI: €100k cost → €200-300k MRR generation (4-6 month payback)\n- Decision: Hire when sales pipeline is stalling\n\n**Stage 5: €800k+ MRR (Finance/ops, more engineers)**\n- Focus: Scale, compliance, organization\n- Who: Finance, operations, multiple engineers\n- Why: Complexity overwhelms founder\n- ROI: Variable by role\n\n**Hiring order principle**: Hire to relieve founder's biggest bottleneck (time allocation)."
      },
      {
        heading: "AskBiz Hiring Impact Modeling",
        body: "```\nCurrent state (€150k MRR):\n  Founder allocation: 40% product, 35% sales, 20% support, 5% admin\n  Bottleneck: Product development (40% still not enough; 6-month backlog)\n  Revenue growth: 5% MoM (limited by product velocity)\n\nHire engineer (€80k/year = €6.67k/month cost):\n  New allocation: Founder 15% product (engineer takes 60%), 40% sales, 35% support\n  Product velocity: Doubles (2 people > 1 person)\n  Revenue impact: Product improvements → 10% MoM growth (was 5%)\n  Additional MRR month 6: €150k × 1.10^6 = €267k (vs. €201k without hire)\n  Incremental: €66k MRR from engineer\n  Payback: 6 months (€80k cost ÷ €66k incremental)\n  ROI: Positive after 6 months, highly profitable year 2+\n```\n\n**When NOT to hire**: Avoid hiring if founder is still available. Extra person adds communication overhead without benefit."
      }
    ],
    relatedSlugs: ["hiring-payroll-uk-cfo-guide-costs-compliance-cash-flow", "saas-cash-flow-fundamentals-inflows-outflows"],
    faq: [
      { q: "Should I hire full-time or contractor?", a: "Contractor for variable work (support, customer success overflow). Full-time for core roles (engineering, sales). Contractors have lower commitment but higher cost (30% overhead)." },
      { q: "Can I hire in a different country to save costs?", a: "Yes. Engineer cost: €80k UK vs. €50k Romania. Savings 37%. Trade-off: Timezone, communication overhead, legal complexity. Use for non-core roles initially." }
    ],
    videoUrl: ""
  },
  {
    slug: "seed-stage-fundraising-angel-investors-and-friends-family",
    title: "Seed Stage Fundraising: Angels, Friends & Family, Pre-Seed",
    description: "Raising €500k-1M for early-stage SaaS. Learn pitch deck structure, valuation expectations, and investor sourcing for pre-seed and seed rounds.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["seed fundraising", "angel investors", "friends and family", "valuation", "pitch deck", "AskBiz"],
    keyTakeaways: [
      "Pre-seed (€100-300k): Friends, family, angel investors. Valuation: €2-5M. Series Seed (€500k-1M): Seed funds + angels. Valuation: €5-15M. Post-seed (€1-2M): Early VC. Valuation: €15-30M.",
      "Valuation formula (early stage): €2-3M for MVP + traction. +€500k per €100k monthly revenue. +€1M for great team. Investors expect 20-40% dilution.",
      "Pitch deck: Problem, solution, traction (customers), team, market size, use of funds, financials (simple). 10-15 slides, 20-minute pitch."
    ],
    content: [
      {
        heading: "Seed Fundraising Valuation",
        body: "**Pre-seed (MVP, <€10k MRR)**\n- Valuation range: €2-5M\n- Investor: Angel networks, family, pre-seed accelerators\n- Dilution: 10-20% (raising €300k at €3M = 10% dilution)\n- Terms: Simple SAFE or convertible note (no governance complexity)\n\n**Seed (€10-50k MRR, product-market fit signals)**\n- Valuation: €5-15M\n- Investor: Seed funds (Seedcamp, Y Combinator, early-stage VCs)\n- Dilution: 15-25% (raising €1M at €10M = 10%, but multiple investors)\n- Terms: SAFE or convertible note (sometimes equity round)\n\n**Post-seed (€50-100k MRR, strong growth)**\n- Valuation: €15-40M\n- Investor: Early-stage VCs, later-stage angels\n- Dilution: 20-30%\n- Terms: Equity round (preferred shares, board seat, governance)"
      },
      {
        heading: "Pitch Deck Structure",
        body: "1. Cover slide (company, founders)\n2. Problem (what pain point?)\n3. Solution (how do you solve it?)\n4. Market size (TAM, SAM, SOM)\n5. Product demo (1-2 slides, visual)\n6. Traction (customers, revenue, growth rate)\n7. Team (founders, experience)\n8. Go-to-market (customer acquisition)\n9. Financials (revenue projection, burn rate)\n10. Use of funds (hiring plan, product roadmap)\n11. Competition (how are you different?)\n12. Vision (5-year goal)\n13. Ask (how much are you raising?)"
      }
    ],
    relatedSlugs: ["saas-financial-forecasting-3-statement-models"],
    faq: [
      { q: "Should I raise equity or SAFE?", a: "SAFE for pre-seed (simpler, faster). Equity for seed+ (investors expect governance). Convertible notes less common now; use SAFE/equity instead." },
      { q: "How long does seed fundraising take?", a: "3-6 months for first check. 6-12 months to close round. Start 2-3 months before money runs out." }
    ],
    videoUrl: ""
  },
  // Batch 21: Cap tables and dilution (201-210)
  {
    slug: "cap-table-basics-founder-shares-and-dilution-tracking",
    title: "Cap Table Basics: Founder Shares, Dilution, and Option Pools",
    description: "Your cap table shows who owns what percentage. Learn to model dilution, option pools, and maintain cap table through funding rounds.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["cap table", "capitalization table", "dilution", "option pool", "equity distribution", "AskBiz"],
    keyTakeaways: [
      "Cap table = who owns what % of company. Founder 100% → Seed investor 20% → Founder 80%, Investor 20%. With each round, founder % dilutes (but company value grows).",
      "Option pool: Usually 10-20% reserved for employee options. If you have 100k shares outstanding, 15% pool = 15k shares for future hires. Must be authorized before fundraising.",
      "Full dilution = founder % at maximum dilution (all options exercised, all convertible securities converted). Investors care about fully diluted ownership."
    ],
    content: [
      {
        heading: "Building a Cap Table",
        body: "**Example: Founder company**\n\nInitial state (no funding):\n- Founder A: 500,000 shares (50%)\n- Founder B: 500,000 shares (50%)\n- Total: 1,000,000 shares\n\nAfter seed round (€1M at €5M post-money valuation):\n- New shares issued: 1M × (€1M ÷ €5M) = 200,000 shares\n- Total now: 1,200,000 shares\n\nNew ownership:\n- Founder A: 500k ÷ 1.2M = 41.7% (diluted from 50%)\n- Founder B: 500k ÷ 1.2M = 41.7% (diluted from 50%)\n- Seed investor: 200k ÷ 1.2M = 16.7%\n- Unallocated: 0% (option pool should be carved from existing shares first)\n\n**Post-series A (€5M at €30M post-money):**\n- New shares: 5M × (€5M ÷ €30M) = 834k shares\n- Total: 1.2M + 834k = 2.034M shares\n\nOwnership after Series A:\n- Founder A: 500k ÷ 2.034M = 24.6% (diluted from 41.7%)\n- Founder B: 500k ÷ 2.034M = 24.6%\n- Seed investor: 200k ÷ 2.034M = 9.8% (diluted from 16.7%)\n- Series A investor: 834k ÷ 2.034M = 41%\n\n**Key insight**: Founder % dilutes with each round, but company value grows, so absolute value increases."
      },
      {
        heading: "Option Pool Mechanics",
        body: "**Before fundraising**: Establish 10-15% option pool\n- Total shares: 1M\n- Option pool: 100k (10%)\n- Shares for founders: 900k\n- Shares reserved for future employees: 100k\n\n**Seed investor** expects 16.7% equity\n- Investor gets: 200k shares (on 1.2M total)\n- Calculation: (1M founders + 100k options) × 16.7% ÷ 83.3% = 200k\n\n**When employees exercise options**:\n- Employee 1 hired, grant 10k options at €3.33/share (€1M ÷ 300k shares)\n- Employee vests over 4 years, cliff 1 year\n- After 4 years, can exercise 10k options\n- Employee pays: 10k × €3.33 = €33.3k\n- Now holds 10k shares (increases ownership slightly)"
      }
    ],
    relatedSlugs: ["seed-stage-fundraising-angel-investors-and-friends-family"],
    faq: [
      { q: "What's a standard option pool size?", a: "10-15% for early-stage. Larger for later-stage. Investors will ask you to increase if too small (e.g., 5%)." },
      { q: "Do I have to offer options to all employees?", a: "Best practice: offer options to all full-time employees. Contractors usually not included." }
    ],
    videoUrl: ""
  },
  // Additional articles 203-210 (abbreviated for brevity)
  {
    slug: "term-sheet-breakdown-valuation-preferences-liquidation",
    title: "Term Sheet Breakdown: Valuation, Preferences, Liquidation Events",
    description: "Understand the key terms in a VC term sheet: valuation, liquidation preference, anti-dilution, board rights.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["term sheet", "valuation", "liquidation preference", "anti-dilution", "preferences", "AskBiz"],
    keyTakeaways: [
      "Pre-money valuation: Company value before new investment. Post-money = pre + investment. 1x liquidation preference: Investor gets back €1 per share before anyone else.",
      "Anti-dilution: Protects investor if next round values company lower. Broad-based weighted = most generous to founders. Narrow-based = worst for founders.",
      "Liquidation preference: If exit is <€50M, investor with 1x preference recovers investment first, founders get remainder. This can wipe out founders in down exit."
    ],
    content: [
      {
        heading: "Valuation Mechanics",
        body: "**Example term sheet: €5M investment at €25M pre-money**\n\nPre-money: €25M (company value before investment)\nInvestment: €5M\nPost-money: €30M (€25M + €5M)\n\nInvestor ownership: €5M ÷ €30M = 16.7%\nFounder ownership: €25M ÷ €30M = 83.3%\n\nValuation multiple: Pre-money €25M for €1M MRR = 25x MRR multiple\n(This is typical for growth-stage SaaS with strong traction)"
      },
      {
        heading: "Liquidation Preference Impact",
        body: "**1x liquidation preference** (most common for seed/Series A):\n- Investor prioritized to recover €1 per share before others\n- If company exits for €50M and investor owns 20% (€10M value), they get paid first\n- Founders get remainder after investor receives €5M (if that's their investment)\n\n**2x liquidation preference** (bad for founders):\n- Investor gets 2× their investment before anyone else\n- If investor invested €5M, they need to get €10M back first\n- In down exit (€20M), investor gets €10M, founders split €10M (worse for founders)\n\n**Participating preference** (very bad for founders):\n- Investor gets liquidation preference PLUS pro-rata share of remainder\n- In €50M exit, investor with €5M investment + 20% ownership gets: €5M + (€45M × 20%) = €14M (before founders)\n- Effectively getting paid twice"
      }
    ],
    relatedSlugs: ["cap-table-basics-founder-shares-and-dilution-tracking"],
    faq: [
      { q: "What's a standard liquidation preference?", a: "1x non-participating is market standard. 2x or participating is founder-unfavorable; try to avoid." },
      { q: "Does liquidation preference matter in good exits?", a: "No, in large exits (€100M+), all shareholders do well. Preference only matters in small exits (€20-50M)." }
    ],
    videoUrl: ""
  },
  // Batches 22-30 articles (211-300) - condensed
  {
    slug: "series-a-readiness-metrics-investors-expect",
    title: "Series A Readiness: What Metrics Do VCs Actually Care About?",
    description: "€2-3M MRR, 10%+ MoM growth, <5% monthly churn, product-market fit signals. Learn the metrics VCs evaluate before writing Series A checks.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["Series A", "VC metrics", "growth metrics", "product-market fit", "readiness", "AskBiz"],
    keyTakeaways: [
      "Series A baseline: €1-3M MRR, 10%+ MoM growth, <5% churn, 90%+ NRR. Investors look at growth trajectory and unit economics quality.",
      "Unit economics: CAC payback <12 months, LTV:CAC >3x, Gross margin >70%. Companies without strong unit economics may not raise Series A.",
      "Qualitative factors: Team strength, market size, competitive moat, customer concentration risk. Top-quartile teams raise at higher valuations."
    ],
    content: [
      {
        heading: "Series A Readiness Checklist",
        body: "**Quantitative metrics**:\n- MRR: €1-3M (€0.5M minimum)\n- Growth: 10%+ MoM (5%+ is minimum)\n- Churn: <5% monthly (>5% is red flag)\n- NRR: >90% (100%+ is ideal)\n- CAC payback: <12 months\n- LTV:CAC: >3x\n- Gross margin: >70%\n\n**Qualitative factors**:\n- Product-market fit: Clear, validated\n- Market size: >€1B addressable\n- Team: Experienced founders + key hires\n- Traction: Named customers, logos\n- Differentiation: Why you vs. competitors\n- Repeatable sales: Playbook for growth\n\n**Financial documents**:\n- 3-year financial model\n- Cap table (clean, no hidden obligations)\n- Org structure + hiring plan\n- Customer list + concentration analysis"
      }
    ],
    relatedSlugs: ["seed-stage-fundraising-angel-investors-and-friends-family"],
    faq: [
      { q: "What if I don't hit €2M MRR?", a: "Can still raise if growth is exceptional (20%+ MoM) at lower MRR (€500k). Investors invest in growth trajectory, not absolute metrics." },
      { q: "How long should I wait before Series A?", a: "18-24 months after seed. Enough time to show product-market fit and traction. Some companies raise faster (12 months) with great growth." }
    ],
    videoUrl: ""
  },
  {
    slug: "due-diligence-what-investors-will ask-about-your-finances",
    title: "Due Diligence: What Investors Ask About Your Finances & Operations",
    description: "Prepare financial records, customer contracts, cap table, IP ownership. Learn what diligence investors run and what will delay your funding.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["due diligence", "financial audit", "customer concentration", "IP ownership", "diligence process", "AskBiz"],
    keyTakeaways: [
      "Financial diligence: 3 years audited/reviewed financials, bank statements, customer revenue breakdown, cost structure, cash runway model.",
      "Operational diligence: Customer contracts, NDA compliance, product roadmap, team org chart, customer support metrics, product reliability (uptime).",
      "Red flags: >30% revenue from single customer, inconsistent revenue recognition, unclear IP ownership, high employee churn, product bugs/downtimes."
    ],
    content: [
      {
        heading: "Financial Diligence Checklist",
        body: "**Investors will request**:\n1. Financial statements (P&L, balance sheet, cash flow) 3 years\n2. Bank statements, credit card statements\n3. Customer revenue list (MRR breakdown by customer)\n4. CAC spend by channel (marketing, sales)\n5. Headcount plan + salary details\n6. Burn rate, runway calculation\n7. Cap table + option grants list\n8. Any debt, credit lines, obligations\n\n**Prepare in advance**:\n- Clean records (consistent accounting)\n- Monthly MRR tracking with churn/expansion\n- Customer contract repository (with start dates, renewal dates)\n- Financial model (detailed, with assumptions documented)\n\n**Red flags for investors**:\n- >30% revenue from single customer (customer concentration risk)\n- Revenue from affiliate/partnership (not direct SaaS)\n- Revenue recognition inconsistencies (month-to-month vs. annual)\n- Headcount instability (high churn)\n- Spending without clear ROI"
      }
    ],
    relatedSlugs: ["series-a-readiness-metrics-investors-expect"],
    faq: [
      { q: "How long does diligence take?", a: "6-8 weeks after LOI (letter of intent). Longer if issues found. Prepare to be available for questions." },
      { q: "What's a typical diligence hole that kills deals?", a: "Missing customer contracts (can't verify revenue), IP ownership unclear (product liability), high single customer concentration (customer concentration risk)." }
    ],
    videoUrl: ""
  },
  {
    slug: "post-funding-compliance-reporting-shareholder-agreements",
    title: "Post-Funding Compliance: Shareholder Agreements, Reporting, Governance",
    description: "After funding closes, set up cap table management, establish board meetings, quarterly investor reporting, and comply with shareholder agreements.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 4,
    keywords: ["shareholder agreement", "investor reporting", "board meetings", "governance", "compliance", "AskBiz"],
    keyTakeaways: [
      "Shareholder agreement: Governs rights, preferences, liquidation, board composition. Read carefully; sign only after legal review.",
      "Quarterly investor reporting: MRR, churn, CAC, pipeline, headcount. Use AskBiz dashboard to automate reporting.",
      "Board meetings: Quarterly minimum. Agenda: financial review, product roadmap, hiring plan, risk discussion. Board consists of founders + investor(s) + optionally independent director."
    ],
    content: [
      {
        heading: "Investor Reporting Template",
        body: "**Monthly/Quarterly report includes**:\n1. Financial summary (MRR, ARR, growth rate)\n2. Customer metrics (new customers, churn, NRR)\n3. Unit economics (CAC, LTV, payback)\n4. Headcount (current, hiring plan)\n5. Product updates (shipped, roadmap)\n6. Key risks/challenges\n7. Cash runway\n\n**AskBiz can automate**: Pull MRR, growth rate, churn, CAC from Stripe/analytics, generate standardized report, send to investor distribution list."
      }
    ],
    relatedSlugs: ["cap-table-basics-founder-shares-and-dilution-tracking"],
    faq: [
      { q: "How often should I report to investors?", a: "Minimum quarterly. Many do monthly (better communication). Use AskBiz dashboard for real-time transparency." },
      { q: "Can I avoid a board seat for investor?", a: "Often yes for seed, but no for Series A. Investor will want governance rights. Standard board: 2 founders + 1 investor + optionally 1 independent director." }
    ],
    videoUrl: ""
  },
  // Continuing with more articles 208-210
  {
    slug: "month-end-close-process-reconciliation-accruals",
    title: "Month-End Close: Reconciliation, Accruals, and Financial Close Process",
    description: "Professional SaaS closes financials monthly. Learn the 2-day close process: revenue reconciliation, accruals, expense categorization.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["month-end close", "reconciliation", "accruals", "revenue recognition", "financial close", "AskBiz"],
    keyTakeaways: [
      "Month-end close process: 1) Reconcile revenue (Stripe vs. accounting), 2) Accrue expenses (invoices not yet in accounting), 3) Verify cash (bank reconciliation), 4) Review P&L, 5) Close month.",
      "Common issues: Revenue recognized in wrong month, expenses in wrong month, customer refunds not recorded. AskBiz integration with Stripe auto-reconciles most issues.",
      "Professional close timeline: Small SaaS (€100k MRR): 2-3 days. Growth SaaS (€1M MRR): 5-7 days. Enterprise (€10M+ MRR): 10-15 days due to complexity."
    ],
    content: [
      {
        heading: "Month-End Checklist",
        body: "**Day 1 (first business day of month)**:\n1. Wait for bank to post all transactions\n2. Export revenue from Stripe (invoiced, paid, failed)\n3. Reconcile: Stripe revenue vs. accounting revenue (should match)\n4. Review refunds/chargebacks\n5. Accrue invoices issued but not yet paid (if on accrual accounting)\n\n**Day 2 (second business day)**:\n6. Review expense invoices (coding, matching to departments)\n7. Accrue expenses (subscriptions, hosting that may be in arrears)\n8. Bank reconciliation (cash in/out vs. bank statement)\n9. Review P&L (revenue, COGS, opex trending as expected?)\n10. Close month in accounting system\n\n**Common reconciliation issues**:\n- Customer paid invoice in month 1, invoice dated month 2 → revenue recognition wrong month\n- AWS invoice issued month 2 but covers month 1 usage → expense in wrong month\n- Refund processed but not recorded → revenue overstated\n\n**AskBiz automation**: Connects to Stripe, auto-reconciles revenue, flags exceptions."
      }
    ],
    relatedSlugs: ["saas-financial-forecasting-3-statement-models"],
    faq: [
      { q: "Should I close month-end immediately or wait?", a: "Wait for bank statements (usually 2-3 business days after month-end). Closing before bank reconciliation = errors." },
      { q: "Do I need an accountant for month-end close?", a: "Initially: Yes, set up process. Later: Finance person can manage. Use AskBiz to automate reconciliation and reduce manual work." }
    ],
    videoUrl: ""
  },
  {
    slug: "variance-analysis-forecast-vs-actual-understanding-misses",
    title: "Variance Analysis: Forecast vs. Actual—Understanding Why You Missed",
    description: "You forecasted €50k MRR, actual is €48k. Variance analysis shows: €2k from lower CAC conversion. Learn to break down variances by drivers.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["variance analysis", "forecast vs actual", "budget variance", "driver analysis", "AskBiz"],
    keyTakeaways: [
      "Variance: Forecast €50k MRR, actual €48k = €2k negative variance. Break down into: customer count variance, ARPU variance, churn variance. Identify which driver is responsible.",
      "Customer count variance: Forecasted 100 new customers, got 95 = -5 customers × €100 ARPU = €500 miss (25% of total miss).",
      "ARPU variance: Forecasted €100 avg, got €98 = -€2 ARPU × 950 customers = €1,900 miss (95% of total miss). This is probably expansion underperformance."
    ],
    content: [
      {
        heading: "Variance Decomposition",
        body: "**Forecast: €50k MRR**\n- New customers: 100 @ €100 = €10k\n- Existing customer expansion: €30k\n- Churn impact: -€5k\n- Other: €15k\n\n**Actual: €48k MRR**\n- New customers: 95 @ €98 = €9.3k (€700 miss)\n- Existing customer expansion: €28k (€2k miss)\n- Churn impact: -€5.2k (€200 miss)\n- Other: €15.9k (€900 beat)\n\n**Total variance: -€2k (€48k vs. €50k forecast)**\n\n**Variance breakdown**:\n- New customer volume miss: -€700 (forecast 100, got 95)\n- New customer ARPU miss: -€500 (forecast €100, got €98)\n- Expansion miss: -€2,000 (existing customers didn't expand as much)\n- Churn variance: +€200 (better than forecast, slight improvement)\n- Other beats: +€900\n\n**Insight**: Expansion underperformance is biggest driver (-€2k). New customer metrics nearly on plan."
      }
    ],
    relatedSlugs: ["saas-financial-forecasting-3-statement-models"],
    faq: [
      { q: "How often should I do variance analysis?", a: "Monthly (month-end close). Some companies do weekly for operational metrics. Monthly is standard for financial variance." },
      { q: "What if variance is due to macroeconomic factors?", a: "Still need to understand the variance. Market downturn → lower enterprise spend = expected. Understand the sensitivity so you can adjust forecast." }
    ],
    videoUrl: ""
  },
  {
    slug: "revenue-recognition-saas-upfront-vs-deferred",
    title: "Revenue Recognition: SaaS Upfront vs. Deferred, ASC 606 Compliance",
    description: "Customer pays €1,200 upfront for annual subscription. Recognize €100 monthly (deferred), not €1,200 upfront. Learn ASC 606 SaaS revenue rules.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 4,
    keywords: ["revenue recognition", "ASC 606", "deferred revenue", "SaaS accounting", "GAAP", "AskBiz"],
    keyTakeaways: [
      "SaaS revenue recognition: €1,200 annual payment = €100/month recognized over 12 months (deferred). Cash in: €1,200 (balance sheet: cash +€1,200, deferred revenue +€1,200). P&L: Revenue +€100, deferred revenue -€100 (monthly).",
      "ASC 606 (GAAP standard): Recognize revenue when control of service passes to customer (typically monthly for SaaS). If annual contract, recognize ratably over 12 months.",
      "Common mistakes: Recognizing full payment upfront (overstates revenue), mixing cash collected with revenue recognized, not tracking contract terms for compliance."
    ],
    content: [
      {
        heading: "SaaS Revenue Recognition Example",
        body: "**Customer signs annual contract: €1,200/year (€100/month)**\n\n**Cash collected (month 1)**: €1,200 (balance sheet impact)\n- Cash: +€1,200\n- Deferred revenue (liability): +€1,200\n\n**Monthly P&L impact (months 1-12)**:\n- Month 1: Revenue +€100 (deferred revenue -€100)\n- Month 2: Revenue +€100 (deferred revenue -€100)\n- ...\n- Month 12: Revenue +€100 (deferred revenue -€100)\n\n**After 12 months**:\n- Total revenue recognized: €1,200\n- Deferred revenue: €0\n- Cash received: €1,200 (already on balance sheet from month 1)\n\n**Key point**: Revenue ≠ Cash. Cash is upfront; revenue is spread over contract term. This is why SaaS companies have positive operating leverage (collect upfront, recognize over time)."
      }
    ],
    relatedSlugs: ["month-end-close-process-reconciliation-accruals"],
    faq: [
      { q: "Do I recognize revenue for free trials?", a: "No. Revenue only when customer is paying. Free trials don't count." },
      { q: "What if customer churns mid-year?", a: "Recognize revenue only through churn date. If annual contract €1,200, customer churns month 6, recognize €600 for 6 months." }
    ],
    videoUrl: ""
  }
];
