import { AcademyArticle } from "./academy-types";

export const ACADEMY_CFO_SAAS_BATCH_4_REWRITTEN: AcademyArticle[] = [
  {
    slug: "saaS-pricing-strategy-value-based-vs-cost-based",
    title: "SaaS Pricing Strategy: Value-Based vs. Cost-Based Pricing",
    description: "Most SaaS founders underprice. Learn value-based pricing (price based on customer value, not cost) and increase revenue 30-50% without changing product.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["pricing strategy", "value-based pricing", "SaaS pricing", "price optimization"],
    keyTakeaways: [
      "Cost-based pricing (cost + markup) leaves money on the table. Value-based pricing (what customer saves/earns) captures more value.",
      "Most SaaS can raise prices 20-30% with <5% churn. Many raise 50%+ because they were wildly underpriced.",
      "Price anchoring: First price customers see sticks in their mind. Price high; you can discount. Price low; hard to raise later."
    ],
    content: [
      {
        heading: "Cost-Based vs. Value-Based: The £30k Difference",
        body: "**Cost-based pricing (wrong approach):**\n- Build SaaS, costs £5k/month to operate\n- How many customers can we support? 100 customers\n- Cost per customer: £50/month\n- Add 50% markup: Price = £75/month\n- Revenue: 100 × £75 × 12 = £90,000/year\n- Problem: You're pricing based on cost, not value\n\n**Value-based pricing (right approach):**\n- Your SaaS helps accountants save time. How much time?\n- Typical accountant bill rate: £150/hour\n- Your SaaS saves 5 hours per month\n- Value to customer: 5 hours × £150 = £750/month\n- Price at 20% of value: £150/month\n- Revenue: 100 × £150 × 12 = £180,000/year\n- Difference: £90,000 more revenue, same product\n\nThe customer still saves £600/month (£750 value - £150 price = £600 benefit). You capture more value. Everyone wins.\n\n**Why founders underprice:**\n- Imposter syndrome (\"my product isn't worth that\")\n- Lack of data on customer value\n- Fear of losing customers\n- Comparing to competitors instead of customer value\n\nThe fix: Calculate what customers actually save/earn, then price at 20-30% of that value."
      },
      {
        heading: "How to Calculate Customer Value",
        body: "**Method 1: Time saved × hourly rate**\n- Your product saves customer 10 hours/month\n- Customer hourly rate: £100/hour\n- Monthly value: £1,000\n- Price: £200/month (20% of value)\n\n**Method 2: Revenue gained × profit margin**\n- Your product helps e-commerce store increase sales by £50k/month\n- Profit margin: 20%\n- Monthly value: £50k × 0.20 = £10,000\n- Price: £2,000/month (20% of value)\n\n**Method 3: Cost avoided**\n- Your product replaces hiring (would cost £4,000/month for contractor)\n- Monthly value: £4,000\n- Price: £800/month (20% of value)\n\nMost SaaS fit one of these categories. Calculate and you'll be shocked how much value you're creating (and how much you're leaving on the table by underpricing)."
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-complete-guide",
      "growth-stage-saas-cfo-metrics-checklist"
    ],
    faq: [
      {
        q: "Will raising prices cause customer churn?",
        a: "For existing customers: Usually <5% churn if you raise prices gradually (grand-fathering existing customers at old price, new price for new customers). For new customers: Raising prices often DECREASES churn (higher price signals better quality). Try it—most founders find <2% price sensitivity."
      },
      {
        q: "What if I have low-price and high-price tiers?",
        a: "Good strategy. Low tier (£50-100) attracts SMBs. High tier (£500-1000) targets enterprises. Your value-based pricing changes per tier. Enterprise customers get 10x value, so 10x price is justified."
      },
      {
        q: "Should I match competitor pricing?",
        a: "No. Competitors might be underpriced too. Focus on your customer's value, not competitor pricing. If competitors are cheaper and customers still choose you, you have strong value prop and can price higher."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "customer-expansion-revenue-upselling-upsells",
    title: "Customer Expansion Revenue: Upselling Existing Customers for 50% Revenue Growth",
    description: "Expanding revenue from existing customers is 5x cheaper than acquiring new ones. Learn how to structure upsells and maximize expansion revenue.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 6,
    keywords: ["expansion revenue", "upselling", "customer growth", "NRR"],
    keyTakeaways: [
      "Expansion revenue (upsells, upgrades, add-ons) is 5-10x cheaper to generate than new customer acquisition. Most high-growth SaaS gets 30-50% of revenue from existing customers.",
      "Upsell opportunities happen 3-6 months after purchase when customers understand value and hit usage limits. Time them right.",
      "Net Revenue Retention >110% comes from expansion revenue. This is how high-growth SaaS achieves exponential growth without exponential CAC."
    ],
    content: [
      {
        heading: "Expansion Revenue Levers: Five Ways to Grow Customer Spend",
        body: "**1. Feature-based upsells (most common)**\n- Customer on Basic tier (£50/month) hits user limit\n- Offer Professional tier (£200/month) with unlimited users\n- 30% of Basic customers upgrade within 6 months\n- Cost to sell: £0 (no sales reps needed)\n- Revenue increase: £4,500/month (on 100 customers)\n\n**2. Usage-based pricing (transparent expansion)**\n- Customer pays £100/month base + £2 per API call over 100k\n- As customer grows, bill increases automatically\n- Customer sees value, doesn't feel nickel-and-dimed\n- Cost to sell: £0 (automatic)\n- Revenue increase: Variable (depends on customer growth)\n\n**3. Seats/user pricing**\n- Customer starts with 5 users at £30/user/month = £150\n- Customer grows to 20 users = £600/month\n- No upsell pitch needed; expansion is automatic as customer grows\n- Cost to sell: £0\n- Revenue increase: Scales with customer success\n\n**4. Add-on modules**\n- Customer on base product (£100/month)\n- Offer analytics add-on (£50/month), automation add-on (£75/month)\n- Customer buys 1-2 add-ons over 6 months\n- Cost to sell: Low (in-app upsell, no sales team)\n- Revenue increase: 20-30% of customers buy add-ons = +5-10% MRR\n\n**5. Professional services (highest margin)**\n- Customer buys SaaS (£200/month)\n- Offer custom implementation (£10k one-time), training (£5k), ongoing support (£500/month)\n- High-value customers buy ~50% of the time\n- Cost to sell: Sales rep (~£50k salary, handles ~20 customers) = £2.5k per deal\n- Margin: 60-70% after delivery costs\n- Revenue increase: £15k per implementing customer"
      },
      {
        heading: "Expansion Revenue Economics",
        body: "**Customer 1 (no expansion):**\n- Month 1: Sign at £100/month\n- Month 1-12: Stay at £100/month\n- Month 12 LTV: £1,200\n\n**Customer 2 (with expansion):**\n- Month 1: Sign at £100/month\n- Month 4: Upgrade to £250/month (upsell)\n- Month 7: Add professional services (£10k one-time)\n- Month 10: Add premium support (£100/month more)\n- Month 12 revenue: £100 + £100 + £250 + £250 + (£10k ÷ 12) + £100 = £1,950\n- Month 12 LTV: £1,950 (62% higher)\n\nThis is why NRR matters. Customer 2 generates NRR > 100% ($250 end-of-year / $100 start = 2.5x, massively above 100%).\n\n**Scale this across 100 customers:**\n- 100 customers with zero expansion: 100 × £100 = £10k MRR (£120k ARR)\n- 100 customers with 30% upgrading to £250 (30 customers), 20% buying add-ons (20 customers): \n  - 70 customers at £100 = £7k\n  - 30 customers at £250 = £7.5k\n  - 20 customers × £50 add-on = £1k\n  - Total: £15.5k MRR (30% growth from same customers, no CAC)\n\nExpansion revenue is the highest-ROI growth lever."
      }
    ],
    relatedSlugs: [
      "saas-unit-economics-complete-guide",
      "net-revenue-retention-nrr-expansion",
      "growth-stage-saas-cfo-metrics-checklist"
    ],
    faq: [
      {
        q: "When should I introduce upsell offers?",
        a: "After customer achieves value (usually 3-6 months in). If you upsell too early, customers churn. Wait until they're engaged and seeing ROI, then offer higher-tier solutions."
      },
      {
        q: "Should I offer annual discounts to lock in expansion revenue?",
        a: "No. Annual discounts lock in your revenue but eliminate upsell opportunities (customer can't upgrade mid-contract easily). Use month-to-month or quarterly billing to allow expansion. The small amount of churn risk is offset by higher expansion revenue."
      },
      {
        q: "How much of my revenue should come from expansion?",
        a: "High-growth SaaS: 30-50% of new revenue comes from expansion. Healthy SaaS: 20-30%. Low-growth SaaS: <10%. If you're below 10%, you're not maximizing expansion opportunities."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "customer-retention-reducing-churn-permanently",
    title: "Customer Retention: Why Reducing Churn 1% Beats Acquiring 100 New Customers",
    description: "Churn is your biggest lever. 1% churn reduction = 8-10% revenue growth. Focus here before acquisition.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 5,
    keywords: ["churn reduction", "retention", "customer success", "LTV"],
    keyTakeaways: [
      "Reducing monthly churn from 5% to 4% (just 1%) = 25% increase in customer LTV (longer customer lifetime). This compounds into massive revenue growth.",
      "High-growth SaaS focuses on retention before acquisition. A profitable acquisition machine is meaningless if customers leave after 3 months.",
      "Churn happens for three reasons: (1) product not meeting needs, (2) customer success issues (lack of onboarding/support), (3) economics (too expensive). Fix the right one."
    ],
    content: [
      {
        heading: "Churn Math: Why 1% Reduction Changes Everything",
        body: "**Company A: 5% monthly churn**\n- MRR: £100k\n- Lost customers: £5k MRR\n- Monthly LTV per customer: (£100 ÷ 0.05) = £2,000\n- Annual LTV per customer: £2,000 × 12 = £24,000\n\n**Company B: 4% monthly churn (1% better)**\n- MRR: £100k (same starting point)\n- Lost customers: £4k MRR\n- Monthly LTV per customer: (£100 ÷ 0.04) = £2,500\n- Annual LTV per customer: £2,500 × 12 = £30,000\n\nDifference: £6,000 higher LTV just by keeping customers 8% longer on average.\n\nNow scale to 1,000 customer company:\n- Company A: 1,000 customers × £24k LTV = £24M total customer value\n- Company B: 1,000 customers × £30k LTV = £30M total customer value\n\nCompany B is worth £6M more just from 1% churn reduction. For comparison, acquiring 100 new customers might add £200k in annual revenue (1,000 customers × 20% growth = 200 customers acquired, but only 100 net after churn). The churn reduction is way more impactful."
      }
    ],
    relatedSlugs: [
      "saas-cohort-analysis-retention-curves",
      "net-revenue-retention-nrr-expansion",
      "growth-stage-saas-cfo-metrics-checklist"
    ],
    faq: [
      {
        q: "What causes churn?",
        a: "Three categories: (1) Product - customer didn't achieve desired outcome. (2) Support - customer needed help and didn't get it. (3) Economics - customer found cheaper alternative. Survey churned customers to learn which. Then fix the root cause."
      },
      {
        q: "Should I focus on churn or new customers first?",
        a: "Focus on retention first. If churn is >5%, you're losing more than you gain. Get to <3% churn, then focus on acquisition growth. A leaky bucket doesn't fill faster if you pour harder."
      },
      {
        q: "How do I measure churn accurately?",
        a: "Monthly churn = (MRR lost to cancellations and downgrades) ÷ (starting MRR). Track weekly to catch trends early. Calculate separately by cohort to see if newer cohorts churn faster (product is getting worse) or slower (product is improving)."
      }
    ],
    videoUrl: ""
  },
  {
    slug: "financial-forecasting-scenario-planning-saas",
    title: "Financial Forecasting: Scenario Planning for Growth, Downturns, and Everything Between",
    description: "Point forecasts are wrong. Model three scenarios (base, upside, downside) and update them monthly. This guides hiring, fundraising, and risk management.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 6,
    keywords: ["forecasting", "scenario planning", "financial planning", "projections"],
    keyTakeaways: [
      "Point forecasts (single prediction) are wrong 70% of the time. Scenario planning (base/upside/downside) prepares you for multiple outcomes.",
      "Base case: Your realistic expectation (50th percentile). Upside: Things go better than expected (25th percentile). Downside: Things go worse (75th percentile).",
      "Update forecasts monthly with new data. If you're tracking to upside, celebrate and plan more aggressive. If tracking to downside, cut costs and adjust plans."
    ],
    content: [
      {
        heading: "Three-Scenario Forecasting Model",
        body: "**Month 1 forecast:**\n\n**Base case (most likely):**\n- Growth: 8% MoM\n- Month 12 MRR: £137k (from £100k)\n- Probability: 50%\n\n**Upside (things go better):**\n- Growth: 15% MoM (major product launch, new market)\n- Month 12 MRR: £172k\n- Probability: 25%\n\n**Downside (things go worse):**\n- Growth: 3% MoM (market slowdown, major churn)\n- Month 12 MRR: £112k\n- Probability: 25%\n\n**What this means:**\n- 50% chance you hit £137k (base)\n- 25% chance you exceed £137k (upside)\n- 25% chance you underperform (downside)\n- Plan hiring/spending for base case\n- Maintain flexibility to accelerate (upside) or cut (downside)\n\n**Month 4 update (after 3 months of data):**\n\nYou're tracking to 12% MoM growth (above base, below upside). Revise:\n\n**New base: 12% growth (was 8%)**\n- Probability: 50%\n- Reasoning: Q1 data shows stronger growth than expected\n\n**New upside: 18% growth**\n- Probability: 25%\n\n**New downside: 8% growth**\n- Probability: 25%\n\nImplication: Your base assumption was too conservative. Hiring plans should accelerate. Runway expectations should extend."
      }
    ],
    relatedSlugs: [
      "burn-rate-runway-how-long-can-you-operate",
      "understanding-4-cfo-metric-cards"
    ],
    faq: [
      {
        q: "How detailed should my forecast be?",
        a: "Start simple: MRR, burn rate, runway for 12 months. Add detail as you scale: customer cohorts, CAC by channel, expenses by category. But never forecast beyond 12 months with confidence (too much changes)."
      },
      {
        q: "Should I update forecasts monthly or quarterly?",
        a: "Monthly. More frequent and you're chasing noise. Less frequent and you miss important trends. Monthly gives you quarterly perspective with monthly adjustments."
      },
      {
        q: "What if my actual numbers are between base and upside?",
        a: "Revise your scenarios. Base case should have ~50% probability of being hit/exceeded. If you're consistently in upside, upside becomes new base. Adjust and re-plan."
      }
    ],
    videoUrl: ""
  }
];
