import { AcademyArticle } from "@/types/academy";

export const batch306Articles: AcademyArticle[] = [
  {
    slug: "currency-management-and-international-pricing",
    title: "Currency Management and International Pricing: Global Revenue Strategy",
    description: "Master international pricing. Handle currencies, optimize for global markets.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["currency", "international pricing", "FX risk", "multi-currency", "global pricing"],
    keyTakeaways: [
      "International revenue challenge: Global customers pay in different currencies (USD, EUR, GBP, JPY, etc.). Risk: Exchange rate fluctuation (GBP strengthens, EUR weakens = revenue varies). Example: £1M EUR revenue, EUR drops 10% vs GBP = £90K loss in GBP equivalent. Solution: Hedge (fix exchange rate), price in local currency (customers prefer), natural hedges (costs in multiple currencies). Cost: Hedging (0-2% cost), FX management time. Benefit: Revenue predictability, customer preference, global expansion.",
      "Pricing strategy: Fixed (price in single currency, customers pay equivalent in local), dynamic (adjust prices by currency daily/weekly based on FX), local (set separate prices by country/currency optimized for each market). Example: Fixed = charge £3000/month in GBP globally (easy, but EUR customer pays variable €3300-4000 depending on exchange rate). Dynamic = charge customer's local currency, adjust GBP price weekly to maintain value (more complex, better experience). Cost: Complexity, FX management. Benefit: Customer preference, local market optimization.",
      "Tax and compliance: VAT (EU), GST (Australia), sales tax (US varies by state). Complicate: Different rates by country, digital services taxed differently. Solution: Tax automation tool (Stripe Tax, Avalara), calculate tax on invoice. Cost: Tax tool (£100-500/month). Benefit: Compliance (avoid fines), customer clarity (tax shown separately). Timeline: 1-2 weeks to implement."
    ],
    content: [
      {
        heading: "Managing Multi-Currency and International Revenue",
        body: `Optimizing global pricing and currency strategy.

**Currency and FX fundamentals**

What is FX risk?
- Revenue: Earn in foreign currency (EUR, JPY, AUD)
- Convert: Must convert to home currency (GBP, USD) for reporting
- Rate fluctuates: EUR/GBP ratio changes daily (1% swings common)
- Impact: Revenue in GBP terms varies even if customer pays same in EUR

Example:
- Customer: Pays €3000/month (fixed in EUR)
- Company (GBP-based): Recognizes £2700/month (at €1.11 = £1)
- Month 1: €1.11 = £1, recognize £2700
- Month 2: €1.05 = £1, recognize £2857 (5% more GBP)
- Month 3: €1.15 = £1, recognize £2609 (3% less GBP)
- Variance: ±6% even though customer pays constant €3000

Cumulative impact (12 months):
- If EUR weakens 10% over year: £32,400 → £29,160 (£3,240 loss)
- If company has 20 EUR customers: £3,240 × 20 = £64,800 potential loss

**Pricing models**

Model 1: Single currency (fixed)
- Company: Prices in GBP (example)
- Global customers: Pay GBP equivalent
- Mechanics:
  - Software charges customer £3000/month (GBP)
  - EUR customer pays €3330 (at €1.11/£1)
  - USD customer pays $3900 (at $1.30/£1)

Pros:
- Simple (one price)
- No FX management
- Revenue predictable (GBP terms)

Cons:
- Customer friction (paying in foreign currency)
- Conversion fees (customer bank charges 2-3%)
- Uncompetitive (local competitors price in local currency)
- Demand sensitive (high price in weak-currency countries)

Best for: Small companies, early stage, niche customers
Risk: Lost revenue in price-sensitive markets

Model 2: Multi-currency (dynamic)
- Company: Prices in local currency for each market
- Mechanics:
  - Customer in UK: Charges £3000/month (GBP)
  - Customer in EU: Charges €3330/month (EUR)
  - Customer in US: Charges $3900/month (USD)
  - Exchange rates fixed (updated weekly/monthly, not daily)

Pros:
- Customer preference (pay in local currency)
- Competitive (matches local competitor pricing)
- No customer friction (familiar currency)
- Can optimize per market (charge more in wealthy regions)

Cons:
- Complexity (manage pricing in multiple currencies)
- FX volatility (if update prices infrequently)
- Translation costs (maintain pricing in many currencies)
- Integration (billing system must support multi-currency)

Best for: Growth-stage companies, global expansion
Complexity: Medium (tooling exists, Stripe handles multi-currency easily)

Model 3: Local optimization
- Company: Sets separate prices by market (not just different currencies)
- Mechanics:
  - UK: £3000/month
  - EU: €3000/month (different amount than GBP equivalent, optimized for market)
  - US: $4500/month (premium for largest market)
  - India: ₹150,000/month (price-optimized for affordability)

Pros:
- Market optimization (charge what market will bear)
- Revenue maximization (wealthy markets pay more)
- Competitive (set prices based on local market)
- Demand management (adjust prices for demand)

Cons:
- Complexity (maintain separate pricing matrix)
- Fairness perception (different customers pay different per-unit rates)
- Cannibalizing (low-price customer market accessible to high-price countries)
- Alignment challenges (team in high-price market may resent lower pricing elsewhere)

Best for: Mature companies, global market expansion
Data needed: Willingness to pay by market, competitor pricing, purchase power parity

**Managing FX risk**

Hedging (lock in exchange rate):

Forward contract:
- Mechanism: Lock in FX rate for future date (e.g., 90 days out)
- Example: €1M revenue expected in 90 days, lock in €1.12 = £1 (get £892,857 locked)
- Cost: 0-0.5% (small fee to bank)
- Benefit: Certainty (know GBP revenue 90 days out)
- Use: Large contracts (>€100K), important for forecasting

Options contract:
- Mechanism: Buy right to exchange at set rate (but not obligated)
- Example: Option to sell €1M at €1.12 = £1, but can do better if rate moves
- Cost: 1-2% (more expensive than forward, but has upside)
- Benefit: Asymmetric (protect downside, keep upside)
- Use: Uncertain revenue, want protection without capping upside

Natural hedge (costs in multiple currencies):
- Example: Company has EU office, pays staff in EUR
- Benefit: EUR revenue balanced by EUR costs (natural offset)
- Impact: Reduces net FX exposure
- Best: When costs and revenues roughly match by currency

Multi-currency cash management:
- Strategy: Hold cash in multiple currencies (don't convert immediately)
- Benefit: Use EUR cash to pay EUR-denominated costs (avoid conversion)
- Mechanics: Spend from EUR account for EU costs, GBP for UK costs
- Impact: Reduce conversion costs (2-3% per conversion avoided)

Decision framework (hedge or not?):

| Factor | Hedge | Don't hedge |
|---|---|---|
| Revenue in currency | >£100K | <£20K |
| Contract duration | Long-term (1+ year) | Short-term (<3 months) |
| Volatility tolerance | Low (need certainty) | High (can absorb swings) |
| Costs in currency | No (no offset) | Yes (natural hedge) |
| Company stage | Mature (planning focus) | Early (growth focus) |

Example: £500K EUR revenue over 12 months
- Decide: Hedge 50% (cover half exposure)
- Mechanism: Forward contracts for 50% (€250K locked at €1.12)
- Benefit: 50% certainty (€250K = £223K locked), 50% upside (€250K floats)
- Cost: 0.25% on hedged amount (€625)
- Impact: Reduces risk 50%, costs £625

**Multi-currency billing**

Implementation (Stripe example):
- Create prices in multiple currencies (USD, EUR, GBP, JPY)
- Customer selects currency (auto-detect by IP or user choice)
- Charge in customer's currency
- Conversion: Stripe handles FX (2.5-3% fee typically)
- Reporting: Convert back to home currency for accounting

Pricing management:
- Set anchor price (GBP £3000)
- Set ratios (EUR = 1.10×, USD = 1.30×, JPY = 160×)
- Auto-calculate other currencies
- Review quarterly (if FX rates shift >5%, adjust)

Example pricing matrix:

| Currency | Annual Price | Monthly | Exchange Rate |
|---|---|---|---|
| GBP | £3000 | £250 | 1.00 |
| EUR | €3300 | €275 | 1.10 |
| USD | $3900 | $325 | 1.30 |
| JPY | ¥480,000 | ¥40,000 | 160 |
| AUD | A$4950 | A$412.50 | 1.65 |

Update process (quarterly):
- Get current rates (ECB, XE, OANDA)
- Recalculate prices (keep anchor price fixed, adjust ratios)
- Update billing system (Stripe, Zuora, etc.)
- Cost: 2 hours quarterly = minimal

**Tax implications**

VAT (EU):
- Rate: 17-27% (varies by country)
- Rule: Software normally VAT-applicable
- Mechanism: Charge customer VAT (€3300 + €627 VAT = €3927 total)
- Filing: File EU VAT return monthly/quarterly (by country)
- Tool: Stripe Tax, Taxjar (automate)
- Cost: £100-300/month

US sales tax:
- Rate: 0-10% (varies by state)
- Rule: Digital products often exempt (but varies)
- Mechanism: Vary by customer state
- Filing: File by state (complex, 50+ jurisdictions)
- Tool: TaxJar, Avalara (automate)
- Cost: £200-500/month

GST (Australia, NZ):
- Rate: 10%
- Rule: Digital services need GST
- Mechanism: Collect from customers, remit to government
- Cost: Included in tax tools above

Implementation:
- Use Stripe Tax or TaxJar (auto-calculate by customer location)
- Invoice shows tax clearly (builds trust)
- Quarterly filings (by jurisdiction)
- Cost: £300-1000/month (total for all jurisdictions)
- Time: 1-2 weeks setup, 2 hours/month maintenance

**Pricing strategy by market**

Market 1: Developed market (US, UK, EU)
- Price point: High (wealthy, will pay premium)
- Currency: Multi-currency (customers prefer)
- Tax: Full compliance (collect VAT/sales tax)
- Strategy: Premium positioning

Market 2: Developing market (India, Southeast Asia)
- Price point: Low (price-sensitive, use PPP)
- Currency: Could be local (but USD sometimes preferred)
- Tax: Varies (sometimes less formal)
- Strategy: Volume play (many users, lower price)

Example pricing by market:

| Market | Annual Price | USD Equiv | Per Capita GDP | Price/GDP |
|---|---|---|---|---|
| US | $3900 | $3900 | $70K | 0.055% |
| UK | £3000 | $3900 | $46K | 0.085% |
| EU | €3300 | $3630 | $38K | 0.096% |
| India | ₹150K | $1800 | $2.4K | 0.75% |
| Brazil | R$18K | $3600 | $8.8K | 0.41% |

Observation:
- Wealthy markets: ~0.06% of GDP per capita
- Developing: ~0.75% of GDP per capita (still affordable)
- Ratio: 12x difference (not 50x, affords accessibility in developing countries)

**Monitoring and optimization**

Dashboard:

| Metric | Target | Current | Action |
|---|---|---|---|
| Avg selling price | £3000 | £2900 | Raising prices? |
| Revenue by currency | 50% GBP, 30% EUR, 20% USD | 45% GBP, 40% EUR, 15% USD | EUR growing |
| FX impact | <2% | 3% | Consider hedging |
| Tax compliance | 100% | 98% | Missing state? |

Monthly/quarterly:
- Analyze: Revenue by currency (growth by market)
- Identify: FX swings (hedge if >5% variance)
- Optimize: Pricing by market (adjust if needed)
- Compliance: Tax filings on-time

Annual planning:
- Review: Pricing by market (competitor analysis)
- Adjust: Prices for new year (if FX rates shifted >10%)
- Strategy: New market entry (pricing strategy for market)

`
      }
    ],
    relatedSlugs: ["pricing-strategy-and-price-optimization", "international-expansion-and-localization", "financial-planning-and-budgeting", "compliance-and-regulatory-considerations", "subscription-billing-models-and-pricing-architecture"],
    faq: [
      { q: "Should I price in my home currency or local currencies?", a: "Home currency (simple, less work): Good for early stage. Local currencies (customer preferred): Better for growth/global. Multi-currency (best): Customer chooses payment currency, system converts. Recommendation: Start single-currency, expand to multi-currency at 30%+ international revenue. Use Stripe (handles 135+ currencies easily)." },
      { q: "How do I handle currency fluctuations?", a: "Options: (1) Don't hedge (absorb variance), (2) Forward contracts (lock rate for future date, cost 0-0.5%), (3) Natural hedges (costs in same currency offset), (4) Dynamic pricing (adjust prices frequently). Recommendation: Hedge if >£100K in single foreign currency, or >20% of revenue exposed. For <10% exposure, natural variance acceptable." },
      { q: "What's needed for international tax compliance?", a: "VAT (EU 17-27%), US sales tax (varies by state), GST (Australia 10%). Use Stripe Tax or TaxJar (auto-calculate by customer location, £200-500/month). Collect from customers, file quarterly/monthly by jurisdiction. Setup: 1-2 weeks. Ongoing: 2 hrs/month. Non-compliance risk: Fines, back taxes (significant), so automate this." }
    ],
    videoUrl: ""
  }
];

export default batch306Articles;