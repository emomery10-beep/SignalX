import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_8_REWRITTEN: AcademyArticle[] = [
  {
    slug: "accrual-vs-cash-accounting-saas-difference",
    title: "Accrual vs. Cash Accounting: Why SaaS Uses Accrual (And What It Means for Your Finances)",
    description: "SaaS invoices customers upfront for annual contracts, but recognizes revenue monthly. Learn accrual accounting and why it matters.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["accrual accounting", "cash accounting", "revenue recognition", "deferred revenue"],
    keyTakeaways: [
      "Accrual accounting: Revenue recognized when earned (monthly), not when cash received (upfront). A £12k annual contract = £1k revenue/month for 12 months.",
      "This creates deferred revenue liability (cash received upfront, revenue recognized later). Balance sheet shows both cash and liability.",
      "SaaS requires accrual accounting for accurate financial statements. Your profit margin depends on accrual basis, not cash basis."
    ],
    content: [
      {
        heading: "Accrual vs. Cash: The Difference",
        body: "**Cash accounting (wrong for SaaS):**\n\nCustomer pays £12k annual upfront.\n\nMonth 1 P&L:\n- Revenue: £12k (entire amount recognized when payment received)\n- Expenses: £1k\n- Profit: £11k\n\nMonth 2 P&L:\n- Revenue: £0 (no payment)\n- Expenses: £1k\n- Loss: -£1k\n\nMonths 3-12: Same as month 2 (loss each month)\n\nProblem: Your financials are crazy (huge profit month 1, losses months 2-12). Investors can't understand unit economics.\n\n**Accrual accounting (correct for SaaS):**\n\nCustomer pays £12k annual upfront.\n\nMonth 1 P&L:\n- Revenue: £1k (earned, not received)\n- Expenses: £1k\n- Profit: £0\n\nMonths 2-12: Same (£1k revenue, £1k expense)\n\nBalance sheet shows:\n- Cash: +£12k (received)\n- Deferred revenue liability: £12k (owed to customer as service delivery)\n- As months pass: Liability decreases £1k/month, revenue increases £1k/month\n\nResult: Smooth, predictable financials that show true unit economics."
      },
      {
        heading: "Why This Matters for Your Business",
        body: "**Implication 1: Cash ≠ Revenue**\n\nYou might have £100k in cash (from annual subscriptions prepaid), but only £50k in actual revenue (from 6 months of 12-month contracts). Cash-rich, revenue-poor.\n\nInvestors focus on revenue, not cash. Your £100k cash looks good until they ask: \"What's your revenue?\" \"£50k.\" Oops.\n\n**Implication 2: Deferred Revenue Is Real Liability**\n\nYou collected £100k cash, but owe £100k of service delivery. Your balance sheet must show both. This changes your financial ratios and makes you look less profitable (because you have to pay back the cash by delivering service).\n\n**Implication 3: Churn Affects Revenue, Not Cash**\n\nCustomer paid £12k annual upfront. At month 3, they churn.\n\nCash impact: Zero (already have the cash)\nRevenue impact: Significant. You've recognized 3 months × £1k = £3k revenue, but you owe 9 months of service that will never be delivered. You must reverse that revenue. Month 3 revenue drops.\n\nThis is why churn is so important in SaaS. It directly impacts your P&L, even if it doesn't impact cash."
      }
    ],
    relatedSlugs: [
      "cash-flow-vs-profit-why-you-need-both",
      "saas-unit-economics-complete-guide"
    ],
    faq: [
      {
        q: "How do I calculate deferred revenue?",
        a: "Deferred revenue = (total cash received from annual contracts) - (revenue recognized so far). Example: Collected £100k, recognized £30k revenue, deferred = £70k."
      },
      {
        q: "Does deferred revenue count as cash?",
        a: "Yes, it's cash on the balance sheet. But it's also a liability (you owe the customer service). Net cash = cash - deferred revenue liability shows your true liquid position."
      },
      {
        q: "What if customer churns mid-contract?",
        a: "You keep the cash, but you must reverse the revenue you recognized. Month 3 churn on 12-month contract = reverse 9 months of revenue you already recognized. This creates a revenue dip."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "saas-financial-ratios-what-investors-use",
    title: "SaaS Financial Ratios: What Investors Actually Look At (And Why)",
    description: "Investors use specific ratios to evaluate SaaS. Learn the top 5 and what healthy ranges look like.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 6,
    keywords: ["financial ratios", "investor metrics", "SaaS valuation", "benchmarks"],
    keyTakeaways: [
      "Top 5 ratios: Magic Number, Payback Period, Rule of 40, LTV:CAC, Burn Multiple. Know these cold.",
      "Magic number >0.75 is healthy (sales efficiency). <0.5 is a warning sign (marketing isn't efficient).",
      "Burn multiple (money raised ÷ annual burn) >2x is good. SaaS that burn £10M per year on £15M raised are unsustainable."
    ],
    content: [
      {
        heading: "5 Critical SaaS Ratios",
        body: "**1. Magic Number (Sales Efficiency)**\n\nFormula: (Q2 revenue - Q1 revenue) ÷ (Q1 S&M spend)\n\nWhat it shows: How much revenue you generate per pound of sales spend.\n\n>0.75 = healthy (£0.75 revenue per £1 sales spend)\n<0.5 = warning (inefficient marketing)\n\n**2. Payback Period (How Fast to Recover CAC)**\n\nFormula: CAC ÷ (ARPU × gross margin %)\n\nWhat it shows: Months to recover acquisition cost from customer gross profit.\n\n<6 months = excellent\n6-12 months = healthy\n>12 months = too long, customer lifetime too short\n\n**3. Rule of 40 (Growth + Profitability Balance)**\n\nFormula: Growth rate (%) + EBIT margin (%)\n\nWhat it shows: Are you balancing growth and profitability?\n\n>40 = sustainable\n<40 = unsustainable (burning too fast for growth rate)\n\n**4. LTV:CAC Ratio (Unit Economics)**\n\nFormula: LTV ÷ CAC\n\nWhat it shows: Is acquisition cost small compared to customer lifetime value?\n\n>3x = healthy\n>5x = excellent\n<3x = unsustainable\n\n**5. Burn Multiple (Capital Efficiency)**\n\nFormula: (Total capital raised) ÷ (Annual burn rate)\n\nWhat it shows: How many years of runway did you buy?\n\n2x = you have ~2 years of runway (healthy)\n<1.5x = short runway, will need to fundraise soon\n>3x = overfunded, should be more aggressive\n\n**Example SaaS evaluation:**\n```\nCompany X metrics:\n- Magic Number: 0.8 (healthy)\n- Payback: 8 months (good)\n- Rule of 40: 50% growth + (-5%) margin = 45 (excellent)\n- LTV:CAC: 6x (excellent)\n- Burn multiple: 2.5x (good)\n\nInvestor conclusion: This company has strong unit economics, good sales efficiency, balanced growth, and 2.5 years of runway. They're a good investment target.\n```"
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-complete-guide",
      "financial-forecasting-scenario-planning-saas"
    ],
    faq: [
      {
        q: "Which ratio is most important?",
        a: "LTV:CAC is foundational (are unit economics sustainable?). Then Rule of 40 (growth vs. profitability). Magic Number for efficiency. Together, they show if the business model works."
      },
      {
        q: "How do I benchmark my ratios against peers?",
        a: "Look at public SaaS companies' investor presentations. Benchmarks: Magic Number 0.5-1.2, Payback 6-18 months, Rule of 40 30-50, LTV:CAC 3-10x. Your stage and growth rate matter—scale-ups have different ratios than mature SaaS."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "saas-valuation-multiples-arr-revenue-metrics",
    title: "SaaS Valuation: Understanding ARR Multiples and What Your Company Should Be Worth",
    description: "SaaS companies are valued at multiples of ARR (annual recurring revenue). Learn the multiple and calculate your valuation.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 5,
    keywords: ["SaaS valuation", "ARR multiple", "company valuation", "exit value"],
    keyTakeaways: [
      "SaaS valuation formula: Enterprise Value = ARR × multiple. Multiples range 8-15x for Series A, 6-12x for Series B, 4-8x for mature.",
      "Growth rate drives multiple. 50%+ growth = 12-15x. 20-30% growth = 8-10x. <20% growth = 4-6x.",
      "ARR multiple is a shortcut; investors actually model DCF (discounted cash flow). But multiples are useful for quick valuation estimates."
    ],
    content: [
      {
        heading: "SaaS Valuation Examples",
        body: "**Example 1: Series A SaaS**\n- ARR: £1M\n- Growth: 80% YoY\n- Series A multiple: 12x (high growth)\n- Pre-money valuation: £1M × 12 = £12M\n\n**Example 2: Series B SaaS**\n- ARR: £5M\n- Growth: 40% YoY\n- Series B multiple: 8x\n- Pre-money valuation: £5M × 8 = £40M\n\n**Example 3: Growth-stage SaaS heading to IPO**\n- ARR: £50M\n- Growth: 25% YoY\n- Public SaaS multiple: 6-8x\n- Valuation: £50M × 7 = £350M\n\n**Why multiples vary:**\n- High growth (>50%): Market willing to pay premium because growth = future revenue\n- Medium growth (20-50%): Standard multiple (8-10x)\n- Low growth (<20%): Discount multiple (4-6x) because growth story is weak\n- Profitability: Profitable SaaS gets +1-2x multiple premium\n- Market expansion: SaaS in large TAM (total addressable market) get +1-2x premium\n- Competitive moat: Defensible product gets +1-2x premium\n\nAll of these factors determine your actual multiple within the range."
      }
    ],
    relatedSlugs: [
      "financial-modeling-templates-saas-founders",
      "series-a-prep-uk-cfo-requirements"
    ],
    faq: [
      {
        q: "Is ARR multiple valuation accurate?",
        a: "It's a shortcut. Investors actually model DCF (discounted cash flow), but they use ARR multiples as a sanity check. If your DCF is £12M but market multiple says £40M, something's off with your assumptions."
      },
      {
        q: "Can I negotiate the multiple?",
        a: "Yes, through traction. High growth, strong retention, large TAM, defensible product = higher multiple. If you're 50% growth, push for 12x. If you're 20% growth, expect 6-8x."
      },
      {
        q: "What's my company worth if it's not yet generating significant revenue?",
        a: "Pre-revenue/early-revenue SaaS valuations are more subjective (based on team, market size, competitive position, customer traction). Once you have £1M+ ARR, ARR multiples apply."
      }
    ],
    videoUrl: ""
  }
];
