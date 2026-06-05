import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_7_ARTICLES_61_TO_70: AcademyArticle[] = [
  {
    slug: "cash-reserves-emergency-fund-saas-survival",
    title: "Cash Reserves & Emergency Funds: SaaS Survival Strategy",
    description: "Every SaaS needs a cash cushion. Learn how much to reserve and where to keep it.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 3,
    keywords: ["cash reserves", "emergency fund", "liquidity", "runway", "financial planning"],
    keyTakeaways: [
      "Keep 3–6 months of operating costs in cash reserves. For €100k/month burn, that's €300k–€600k liquid.",
      "Separate operating cash from reserve cash: operating is for daily expenses, reserve is untouchable for emergencies.",
      "A strong cash position lets you negotiate better with investors and suppliers. Run out of cash and you're desperate."
    ],
    content: [
      {
        heading: "How Much Reserve Do You Need?",
        body: "Rule of thumb: **3–6 months of operating costs in reserve.**\n\nFor a SaaS with €100k monthly costs:\n- 3-month reserve: €300k\n- 6-month reserve: €600k\n\nWhy this range?\n- **Below 3 months (€300k)**: Risky. Any surprise (unplanned cost, churn spike, market downturn) forces you into fundraising urgency or cost cuts.\n- **3–6 months**: Safe. You have time to respond to problems without panic. You can negotiate with investors (not desperate). You can invest in growth (knowing you have runway).\n- **Above 6 months (€600k)**: Safe but inefficient. If you have €600k sitting idle while burning €100k/month, you're not deploying capital for growth.\n\n**Scaling the reserve:**\nAs your burn rate grows, so does reserve requirement:\n- €30k/month burn: Keep €90k–€180k in reserve\n- €100k/month burn: Keep €300k–€600k\n- €300k/month burn: Keep €900k–€1.8M\n\nAt higher burn rates (growth/post-Series A), some CFOs argue for only 2–3 months (you can raise capital faster). At earlier stages, 6 months is safer."
      },
      {
        heading: "Where to Keep Your Reserve: Cash Placement Strategy",
        body: "Don't keep all cash in your operating bank account. Instead:\n\n**Tier 1: Operating Account (1 month of costs)**\n- Bank: Your main business checking account\n- Amount: €100k (for €100k/month burn)\n- Purpose: Daily operations, vendor payments, payroll\n- Access: Immediate (0–1 day)\n\n**Tier 2: High-Yield Savings (2–5 months of costs)**\n- Bank: High-yield savings account (4–5% APY)\n- Amount: €200k–€500k\n- Purpose: Reserve fund, earns interest\n- Access: 1–3 days\n\n**Tier 3: Money Market or Short-Term Bonds (optional for large balances)**\n- Account: Money market fund, short-term CD, or T-bills\n- Amount: €100k–€300k (if you have excess)\n- Purpose: Maximize yield on excess cash\n- Access: 3–7 days\n\n**Example allocation for €600k reserve:**\n- Operating account: €100k (immediate need)\n- High-yield savings: €400k (2–4 months reserve, 5% APY = €20k/year)\n- Money market: €100k (excess, higher yield)\n\nThe interest on €400k at 5% = €20k/year. That's worth the minimal effort to move money around.\n\n**Avoid**: Investing reserve in stocks, crypto, or illiquid assets. The goal is capital preservation, not growth. You might need this cash in days."
      },
      {
        heading: "When to Draw on Your Reserve (and When Not To)",
        body: "Your reserve should cover:\n- **Unplanned costs**: Server outage recovery (€50k), legal issue (€30k), security incident (€100k)\n- **Customer churn spike**: Unexpected churn reduces revenue, increasing your net burn\n- **Market downturn**: Conversion rates drop, churn rises, growth slows unexpectedly\n- **Hiring delays**: New hires' start date slips, but salary committed\n- **Supplier price increases**: AWS bill is 20% higher than forecast\n\nYour reserve should NOT cover:\n- **Planned investments**: New hires, marketing campaigns, office expansion (these should come from budget, not reserve)\n- **Seasonal variations**: If Q4 is predictably slow, that's not an \"emergency,\" it's normal\n- **Founder withdrawals or bonuses**: That's separate from the business reserve\n\n**Drawing decision framework**:\n1. **Will this issue resolve in 2–3 weeks?** Yes → Draw from reserve if needed. No → Investigate deeper.\n2. **Is this a one-time cost or structural?** One-time → Draw. Structural (costs now higher than before) → Rethink your budget and raise rates/cut costs.\n3. **Do I have other options?** Can you defer the cost? Negotiate payment terms? Scale back the scope? Explore those before drawing reserve.\n\n**Example**: You discover a security vulnerability costing €50k to fix. It's one-time, urgent, no alternative. Draw from reserve. Replenish in next 2–3 months from operating cash."
      },
      {
        heading: "Rebuilding Depleted Reserves",
        body: "If you've drawn heavily on your reserve, rebuild it systematically:\n\n**Goal**: Rebuild €300k reserve over 6 months (€50k per month set aside)\n\n**Mechanism**:\n- Each month, calculate operating cash flow (revenue − operating costs)\n- If positive, set aside 10–20% for reserve rebuilding\n- Example: €100k monthly revenue, €80k costs = €20k net cash. Set aside €2k–€4k for reserve.\n\n**Faster rebuild**:\n- Cut discretionary costs (marketing, travel, office perks) temporarily\n- Accelerate revenue (campaigns, pricing changes)\n- Extend payables (negotiate longer terms with vendors)\n- In combination, rebuild €300k reserve in 3–4 months instead of 6\n\n**Rebuilding as a discipline**:\nTreat reserve rebuilding like a fixed cost. \"Reserve contribution: €3k/month\" as a line item in your budget. If you've drawn €100k, commit to rebuilding over 12 months (€8.3k/month). This prevents you from spending the money elsewhere."
      }
    ],
    relatedSlugs: [
      "what-is-cash-runway-and-how-calculated",
      "saas-cash-flow-fundamentals-inflows-outflows",
      "contingency-planning-uk-saas-unplanned-costs"
    ],
    faq: [
      {
        q: "Should I keep my reserve in the same business account?",
        a: "No. Keep operating cash in your checking account, reserve in a separate high-yield savings account. This prevents accidentally spending reserve on normal operations."
      },
      {
        q: "Is 3 months enough reserve if I'm pre-Series A?",
        a: "Ideally 6 months. Pre-Series A, you can't raise capital quickly if you burn through reserves. Post-Series A with investor support, 3–4 months is acceptable."
      },
      {
        q: "Should I tell investors how much reserve I have?",
        a: "Yes, but frame it as \"prudent cash management.\" Investors want to see you're responsible with capital. A strong reserve shows discipline."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "saas-unit-economics-cac-ltv-payback-period",
    title: "SaaS Unit Economics: CAC, LTV, and Payback Period",
    description: "Unit economics determine whether your SaaS business is viable. Master these three metrics.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 4,
    keywords: ["CAC", "LTV", "unit economics", "payback period", "SaaS metrics", "profitability"],
    keyTakeaways: [
      "CAC (Customer Acquisition Cost) is the cost to acquire one customer. LTV (Lifetime Value) is the profit from that customer.",
      "The LTV:CAC ratio should be 3:1 or higher. If you pay €1,000 to acquire a customer, they should generate €3,000+ in profit.",
      "Payback period is how many months until a customer's contribution margin covers their CAC. Should be <12 months for growth-stage SaaS."
    ],
    content: [
      {
        heading: "CAC: Customer Acquisition Cost (Fully Loaded)",
        body: "CAC = Total Sales & Marketing Spend ÷ New Customers Acquired\n\n**Calculation**:\nTotal S&M spend includes:\n- Advertising (Google Ads, Facebook, LinkedIn)\n- Sales team salaries (fully loaded: salary + benefits + taxes)\n- Marketing team salaries\n- Tools (CRM, marketing automation, analytics)\n- Events and sponsorships\n- Contractor costs\n\nExample: €100k/month S&M spend, 50 new customers acquired\n**CAC = €100k ÷ 50 = €2,000 per customer**\n\n**CAC by acquisition channel**:\n- Organic search: €500 CAC (low cost, high intent)\n- Paid ads: €1,500 CAC (higher cost, moderate intent)\n- Sales-led (enterprise): €5,000+ CAC (high cost, high deal size)\n- Content marketing: €300–€800 CAC (very low cost, long tail)\n\n**What's a good CAC?**\nDepends on your LTV and business model:\n- If LTV is €10,000: CAC of €2,000–€3,000 is great (3:1 or better)\n- If LTV is €3,000: CAC of €1,000 is acceptable (3:1)\n- If LTV is €3,000 and CAC is €2,500: That's a problem (only 1.2:1)\n\n**Reducing CAC**:\n- Increase marketing efficiency (optimize ad spend, improve conversion rates)\n- Leverage organic channels (SEO, referrals, content)\n- Improve sales process (faster close, better qualification)\n- Partner with complementary products (lower cost than paid ads)\n\n**Tracking CAC by cohort**:\n- Track CAC for each acquisition cohort (customers acquired in Jan, Feb, etc.)\n- Compare CAC across channels and campaigns\n- Identify which channels/campaigns are most efficient\n- Double down on low-CAC channels, cut high-CAC channels"
      },
      {
        heading: "LTV: Lifetime Value (Profit, Not Revenue)",
        body: "LTV = (Annual Profit per Customer) ÷ Annual Churn Rate\n\nOr simpler:\n**LTV = ARPU × Gross Margin ÷ Monthly Churn Rate**\n\nWhere:\n- ARPU (Average Revenue Per User): €100/month for average customer\n- Gross Margin: 80% (typical for SaaS)\n- Monthly Churn: 2% (lose 2% of customers per month)\n\n**Example**:\n- ARPU: €100/month\n- Gross Margin: 80% = €80/month profit per customer\n- Monthly Churn: 2% = 0.02\n- **LTV = (€80) ÷ (0.02) = €4,000**\n\nThis means an average customer generates €4,000 in lifetime profit.\n\n**Interpreting LTV**:\n- If LTV is €4,000 and you spend €1,000 to acquire them (CAC €1,000), the ratio is 4:1. Healthy.\n- If churn improves from 2% to 1%, LTV doubles to €8,000. Huge value.\n- If ARPU grows from €100 to €150, LTV grows 50% to €6,000.\n\n**Increasing LTV** (ranked by impact):\n1. Reduce churn (biggest lever): 2% → 1% churn = 2x LTV\n2. Increase ARPU: €100 → €120 = 1.2x LTV\n3. Improve gross margin: 80% → 90% margin = 1.125x LTV\n\n**Cohort LTV**: Track LTV by acquisition cohort and channel. Customers from paid ads might have lower LTV than organic customers (paid ad customers churn faster). Track this."
      },
      {
        heading: "LTV:CAC Ratio (The Fundamental SaaS Metric)",
        body: "LTV ÷ CAC should be **3:1 or higher** for sustainable SaaS.\n\n**Why 3:1?**\n- You pay €1 in acquisition, you get €3 in lifetime profit\n- The €2 difference covers: corporate overhead, payroll for non-customer-facing roles, profit margin\n- Below 3:1 means you're not covering fixed costs\n\n**Real example**:\n- CAC: €2,000 (€100k S&M ÷ 50 customers)\n- LTV: €6,000 (€80/month profit ÷ 2% churn)\n- **Ratio: 3:1** ✓ Healthy\n\nBut if churn rises from 2% to 3%:\n- New LTV: €2,667 (€80 ÷ 3%)\n- **Ratio: 1.3:1** ✗ Unsustainable\n\nNow you must either:\n- Reduce CAC by 60% (improve marketing efficiency)\n- Reduce churn back to 2% (improve product/retention)\n- Increase ARPU (raise prices or upsell)\n\n**Tracking LTV:CAC**:\n- Monthly: Calculate for all new customers acquired\n- Quarterly: Review by cohort and channel\n- Identify problem channels (high CAC, low LTV)\n- Identify high-efficiency channels (low CAC, high LTV) and double down\n\n**Venture capital expectations**:\n- Series A: LTV:CAC should be 3:1+\n- Series B: 4:1+ (you've scaled and optimized)\n- Series C: 5:1+ (mature, efficient business)"
      },
      {
        heading: "CAC Payback Period (How Long Until You Recover Acquisition Cost)",
        body: "CAC Payback Period = CAC ÷ (Monthly Contribution Margin per Customer)\n\nWhere contribution margin = ARPU × Gross Margin\n\n**Example**:\n- CAC: €2,000\n- ARPU: €100/month\n- Gross Margin: 80% = €80/month contribution\n- **Payback Period = €2,000 ÷ €80 = 25 months**\n\nIt takes 25 months of this customer's contribution to recover the €2,000 acquisition cost.\n\n**Interpretation**:\n- **< 12 months**: Great. You recover acquisition cost in first year, then profit is pure upside.\n- **12–18 months**: Acceptable for high-LTV customers. Common in enterprise SaaS.\n- **> 24 months**: Concerning. Too long to wait for payback. Signals either high CAC or low ARPU.\n\n**Improving payback period**:\n1. Reduce CAC: More efficient marketing (biggest lever)\n2. Increase ARPU: Upsell, cross-sell, raise prices\n3. Improve gross margin: Reduce COGS (hosting, payment fees)\n\n**Venture capital expectations**:\n- Series A: <18 months\n- Series B: <12 months\n- Series C: <9 months\n\nVCs want to see you recovering CAC quickly so you can reinvest in growth."
      }
    ],
    relatedSlugs: [
      "eu-saas-benchmark-metrics-growth-stage",
      "understanding-4-cfo-metric-cards",
      "what-is-cash-runway-and-how-calculated"
    ],
    faq: [
      {
        q: "Should I include sales salaries in CAC calculation?",
        a: "Yes. Total S&M spend includes all costs: ads, salaries, tools, events. This is \"fully loaded CAC.\" Some companies calculate \"marginal CAC\" (just ads, not salaries) but that's misleading."
      },
      {
        q: "What if my CAC varies by channel?",
        a: "Track CAC separately by channel. Organic search might be €500, paid ads €2,000. Identify high-efficiency channels and cut low-efficiency ones."
      },
      {
        q: "How often should I recalculate LTV:CAC?",
        a: "Monthly for early-stage, quarterly for growth-stage. Changes in churn or CAC affect the ratio significantly. Review monthly to catch problems early."
      }
    ],
    videoUrl: ""
  }
];
