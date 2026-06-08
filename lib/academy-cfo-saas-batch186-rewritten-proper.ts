import { AcademyArticle } from "@/types/academy";

export const batch186Articles: AcademyArticle[] = [
  {
    slug: "funding-and-investment-rounds",
    title: "Funding and Investment Rounds: Raising Capital for Growth",
    description: "Master fundraising. Understand funding types, prepare for rounds, and negotiate terms.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "fundraising",
      "investment rounds",
      "venture capital",
      "seed funding",
      "Series A",
      "Series B",
      "funding terms",
      "valuation",
      "investor pitch",
      "capital raising"
    ],
    keyTakeaways: [
      "Funding rounds: Seed (£100K-500K, validate idea), Series A (£500K-3M, scale sales), Series B (£3M+, scale operations). Timing: Seed when product-market fit, Series A when £500K ARR + traction, Series B when £2M+ ARR + path to profitability. Too early = waste capital, too late = miss opportunity.",
      "Valuation: Seed typically 10-20x revenue multiple (or £1-5M cap table dependent). Series A 3-6x ARR (example: £500K ARR = £1.5-3M valuation). Series B 5-10x ARR (example: £2M ARR = £10-20M valuation). Negotiate: Have multiple offers, use competition to increase value.",
      "Fundraising timeline: 3-4 months typical (network → pitch → diligence → close). Prepare: Financial model, deck, traction metrics. Get warm intro from investor network (cold emails rarely work). Pitches to 20-30 investors, close 1-2. Assume 80% of talks don't lead to money."
    ],
    content: [
      {
        heading: "Types of Funding",
        body: `Understanding different capital sources.

**Equity Funding**

Seed round:
- Amount: £100K-500K
- Investors: Angel investors, seed funds
- Dilution: 10-20% of equity
- Timeline: 6-12 months to close
- Use: Validate product, hire first team, reach £100K ARR

Series A:
- Amount: £500K-3M
- Investors: VC firms
- Dilution: 20-30% (total now 30-50%)
- Timeline: 6-12 months to close
- Use: Scale sales, reach £1M+ ARR, hire team

Series B+:
- Amount: £3M+
- Investors: Growth-stage VCs
- Dilution: 15-25% (rounds get smaller as valuation bigger)
- Timeline: 3-6 months (faster, more competitive)
- Use: Scale operations, hire departments, path to profitability

**Debt Funding**

Bank loans:
- Amount: £100K-1M (based on revenue)
- Terms: Pay back over 3-5 years, interest 6-12%
- Pros: No dilution, keep equity
- Cons: Must be profitable/nearly profitable to qualify
- Typical: SaaS with £1M+ revenue, 30%+ margins

Venture debt:
- Amount: £200K-1M (usually alongside equity)
- Terms: Pay back over 3-4 years, interest 8-12%, plus warrant (small % equity)
- Pros: Extend runway without dilution
- Cons: Still must pay back (reduces path to profitability)

**Other Sources**

Revenue-based financing:
- Amount: £100K-1M based on revenue
- Repayment: % of monthly revenue (e.g., 2-5%) until cap repaid
- Pros: No dilution, tied to actual revenue (not growth target)
- Cons: Reduces near-term cash flow

Grants:
- Amount: £50K-200K (varies)
- Pros: Free money (no repayment or dilution)
- Cons: Restrictive (must use for specific purpose)

`
      },
      {
        heading: "Preparing for Fundraising",
        body: `Getting ready to raise capital.

**Traction Metrics**

Investors want to see:
- Revenue (£100K+ for seed, £500K+ for Series A)
- Growth rate (30%+ monthly ideal)
- Unit economics (CAC payback <12 months, LTV/CAC >3x)
- Churn rate (<2% healthy)
- Market opportunity (£1B+ market)

Ideal profile:
- £500K revenue, 30% monthly growth
- 2% churn, LTV/CAC 5x
- £10M+ addressable market
- Clear path to £100M revenue

Without ideal metrics:
- Strong founding team (previous exits, relevant experience)
- Unique technology (defensible IP, patents)
- Large customer (strategic validation)
- Strong advisors (credible guidance)

**Pitch Deck**

Standard 15-20 slide deck:
1. Problem (what problem does this solve)
2. Solution (your product)
3. Market size (TAM)
4. Product demo (show it works)
5. Traction (revenue, growth, customers)
6. Business model (how make money)
7. Competition (who's competing, why you win)
8. Team (founders, experience)
9. Use of funds (what you'll do with money)
10. Financial projections (5-year forward)
11-15. Additional info (advisors, press, roadmap)

**Financial Model**

3-year projections:
- Revenue (month by month year 1, quarterly year 2-3)
- COGS, Gross margin
- Operating expenses (by department)
- Cash burn/profitability
- Headcount plan

Example:
- Year 1: £1M revenue, -£500K cash burn
- Year 2: £3M revenue, -£200K cash burn
- Year 3: £8M revenue, +£1M profit

Key: Shows investor path to profitability and scale.

`
      },
      {
        heading: "Fundraising Process",
        body: `Steps to closing a round.

**Timeline: 3-4 Months**

Month 1: Preparation
- Finalize deck, model, metrics
- Build investor list (100+ targets)
- Get warm intros (cold emails fail)

Month 1-2: Pitch
- Schedule meetings (aim for 20-30)
- Pitch meetings (30-60 min)
- Q&A with investors

Month 2-3: Diligence
- Successful pitches lead to deeper conversations
- Provide data room (financials, contracts, tech docs)
- Reference calls (customers, advisors validate)
- Legal review (investor legal checks your cap table, IP, etc)

Month 3-4: Negotiation
- Finalize term sheet (valuation, dilution, terms)
- Close (sign docs, transfer funds)

**Metrics Investors Evaluate**

Technical due diligence:
- Is product scalable?
- Is tech defensible?
- Security/compliance checklist

Financial due diligence:
- Are financials accurate? (audited preferred)
- Churn sustainable?
- Unit economics real?
- Cap table clear (no hidden claims)?

Legal due diligence:
- IP clear (all founders own? no prior claims?)
- Contracts (customer, vendor, employee)
- Litigation (any pending lawsuits?)

**Negotiating Terms**

Valuation:
- Your ask: £2M (ambitious)
- Investor offer: £1M (conservative)
- Common landing: £1.5M (splitting difference)

Dilution:
- You raise £500K at £1.5M = 33% dilution
- You now own 67%, investor owns 33%
- Future rounds dilute both (A, B, C series)

Board seat:
- Series A+: Investors get board seat
- Means: Investor has say in major decisions
- Negotiate: What decisions need approval (salary, hiring, major purchases)

`
      }
    ],
    relatedSlugs: [
      "saas-valuation-and-multiples",
      "financial-forecasting-modeling",
      "exit-planning-and-m-and-a-preparation",
      "cap-table-management-and-dilution",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "When should I raise funding?",
        a: "Seed: Product-market fit, £100K revenue. Series A: £500K revenue, 30%+ growth. Series B: £2M+ revenue, clear path to profitability. Too early = waste capital (no traction to show). Too late = miss growth window (competitors ahead). Plan 3-4 months for round."
      },
      {
        q: "What valuation should I expect?",
        a: "Seed: 10-20x revenue multiple or fixed (£1-5M). Series A: 3-6x ARR (example £500K ARR = £1.5-3M). Series B: 5-10x ARR (example £2M ARR = £10-20M). Negotiate: Multiple offers increase value. Benchmark against similar companies."
      },
      {
        q: "What should my pitch deck include?",
        a: "Problem → Solution → Market size → Product demo → Traction (revenue, growth) → Business model → Competition → Team → Use of funds → Financials → Ask. 15-20 slides. Be clear, concise, compelling. Deck opens doors, traction closes deals."
      },
      {
        q: "What metrics do investors care about?",
        a: "Revenue (£500K+ for Series A), Growth rate (30%+ monthly), Unit economics (LTV/CAC >3x, payback <12 months), Churn (<2%), Market size (£1B+). Also: Team (credibility), Product (defensible), Traction (customers validate). Missing one (e.g., revenue) need to over-deliver on another (e.g., market size)."
      }
    ],
    videoUrl: ""
  }
];

export default batch186Articles;
