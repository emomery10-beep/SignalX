import { AcademyArticle } from "@/types/academy";

export const batch176Articles: AcademyArticle[] = [
  {
    slug: "international-expansion-and-multi-currency-operations",
    title: "International Expansion and Multi-Currency Operations: Going Global",
    description: "Master international expansion. Navigate currency, taxes, regulations, and build global operations.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Advanced",
    readTime: 8,
    keywords: [
      "international expansion",
      "multi-currency",
      "currency hedging",
      "foreign exchange",
      "global operations",
      "tax treaties",
      "VAT",
      "international sales",
      "market entry",
      "localization"
    ],
    keyTakeaways: [
      "Expansion timing: First market usually home country (UK/US). Next market: Geographically close (US → Canada), similar language/culture (US → Australia), or large opportunity (any → EU/Asia). Rule: Expand internationally only after domestic market working (proven model). Target: 20%+ of revenue from new market before expanding again.",
      "Currency and FX: Track in base currency (£), convert revenues at monthly spot rate (expense cash recognized at conversion rate). Hedging: If 30% revenue in euros, hedge 30% of exposure (lock in £/€ rate). Cost: 1-2% of hedged amount, but protects margin. Example: Lose 10% due to FX (£100K → £90K), hedge prevents that.",
      "Taxes: Each country different. US tax corp profit, EU typically VAT + corp tax. Research required: Treaty to avoid double-tax, local entity needed?, remote workforce tax implications. Hire local accountant. Tax planning: Structure (entity location) impacts taxes. Example: Ireland lower corp tax (12.5%) vs UK (25%), why many EU offices there."
    ],
    content: [
      {
        heading: "Planning International Expansion",
        body: `Evaluating markets and building global presence.

**Market Selection**

Factors to evaluate:

Size:
- Market size (£X billion opportunity)
- Growth (is market growing)
- Pricing acceptance (will they pay?)

Ease of entry:
- Language (English helpful, but translated?)
- Culture (are we aligned?)
- Competition (how many competitors)
- Regulations (easy to sell, or complex)

Company readiness:
- Product-market fit at home (proven model)
- Revenue at home (support expansion)
- Team capacity (can we handle new market)

Expansion sequence (typical):
- Home country (first)
- Adjacent market (geography/culture similar)
- Large market (US, EU)
- Niche market (specific need in country)

Example: UK SaaS company
- Year 1: UK only
- Year 2: Expand to US (large, English-speaking)
- Year 3: Expand to EU (large, close)
- Year 4: Australia (language, culture similar)

**Market Entry Strategy**

Option 1: Self-serve
- Translate website, product
- Local payment methods
- Minimal support
- Cost: £50-100K
- Risk: Product not localized, no local knowledge

Option 2: Partner with local reseller
- Partner sells your product
- Partner handles CS, localization
- You focus on product
- Cost: Partner margin (25-30%)
- Benefit: Local knowledge, de-risk

Option 3: Local entity + sales team
- Hire country manager, sales reps
- Local office (optional)
- Full local support
- Cost: £200-500K (year 1)
- Benefit: Control, market penetration

Typical path: Option 1 → Option 2 → Option 3 (as grow).

**Localization Checklist**

Before launch in new market:

☑ Language translation (not just English)
☑ Payment methods (local card, banks, wallets)
☑ Pricing in local currency
☑ Tax compliance (VAT registration)
☑ Legal review (local requirements)
☑ Customer support in local language/timezone
☑ Marketing (localized messaging)
☑ Hiring (local team or partner)

Missing any = failed expansion (customers won't use if not localized).

`
      },
      {
        heading: "Multi-Currency Operations",
        body: `Managing currency and FX risk.

**Currency Accounting**

Base currency: Currency you report in (typically home country).

Example: UK SaaS, base currency £.

Transactions:
- UK customer: £100 (no conversion)
- US customer: $150 (convert to £ at rate 1.3)
  - Recorded as: £115 (150 / 1.3)
- EU customer: €80 (convert to £ at rate 1.17)
  - Recorded as: £68 (80 / 1.17)

Monthly revenue: £100 + £115 + £68 = £283

Timing:
- Invoice date: Record at spot rate (if customer doesn't pay)
- Payment date: Record actual received amount

Example:
- Invoice Sept: $150 at 1.3 = £115 recorded
- Customer pays Nov: Rate now 1.2
- Actually receive: £125 (150 / 1.2)
- FX gain: £10 (£125 - £115)

Impacts profit (gains/losses go to P&L).

**FX Risk and Hedging**

FX risk: Fluctuating rates impact revenue.

Scenario:
- 30% of revenue in euros
- Year 1: £1M total, €300K revenue (at 1.17 = €300K/1.17 = £256K)
- Year 2: €300K revenue (at 1.10 = €300K/1.10 = £273K but rate weaker)

Wait, that's backwards. Let me recalculate:
- 1.17 = €1 = £0.85, so €300K = £255K
- 1.10 = €1 = £0.91, so €300K = £273K

Actually, if euro weakens (less euros per pound), revenue in pounds increases (if revenue is in euros).

Better example:
- You receive €300K revenue
- Rate 1.20 (strong): €300K / 1.20 = £250K
- Rate 1.00 (weak): €300K / 1.00 = £300K

Wait, that's backwards too.

Let me be clear:
- Exchange rate £/€ = 1.20 means 1 pound = 1.20 euros (or 1 euro = 0.83 pounds)
- You receive €300K
- Convert to pounds: €300K × 0.83 = £249K
- If rate moves to 1.10 (euro weaker)
- Convert to pounds: €300K × (1/1.10) = €300K × 0.91 = £273K

So if euro weakens, your pound-denominated revenue increases (good!).

Hedging:
- You expect €300K revenue next quarter
- Current rate: 1.20 (0.83 GBP/EUR)
- Lock in: Forward contract at 0.83
- Protect against: Euro weakening (0.78)
- Cost: 1-2% of hedged amount

When to hedge:
- >20% revenue in foreign currency
- Volatile currency (emerging market)
- Predictable revenue (contracts locked in)

Cost-benefit:
- Hedging cost: 1-2% per year
- Risk without: 5-10% FX loss possible
- ROI: Cheap insurance

`
      },
      {
        heading: "International Taxes",
        body: `Navigating global tax obligations.

**Types of Taxes**

Corporate income tax:
- Tax on company profits
- Varies by country (UK 25%, Ireland 12.5%, US 21%)

VAT (Value Added Tax):
- Tax on sales (like sales tax in US)
- Paid by customer, collected by company
- Varies: 20% UK, 21% US (no VAT, state sales tax instead), 19% Germany
- For SaaS: Often exempt (digital services) in some countries

Personal income tax:
- Tax on employee salaries
- Varies: UK 20%, US 37% federal

Payroll taxes:
- Employer contributions (national insurance/Social Security)
- Varies: UK 15%, US 15.3%

**Multi-Entity Strategy**

Option 1: Single entity (home country only)
- Easier, lower complexity
- Problem: High tax if operating in high-tax country
- Fine for small international revenue (<20%)

Option 2: Local entities (separate company per country)
- Separate legal entity per country
- Optimize tax (choose low-tax jurisdiction)
- Complexity: Multi-country accounting

Example:
- UK holding company (owns everything)
- US LLC (sells in US, taxed at 21%)
- EU GmbH (sells in EU, taxed at 19%)
- Ireland subsidiary (IP holder, taxed at 12.5%)

Benefit: Minimize taxes across entities.
Cost: More complex accounting, legal fees.

**Tax Treaties**

Tax treaty: Agreement between countries to avoid double-taxation.

Scenario without treaty:
- UK company, UK tax 25%
- US revenue, US tax 25%
- Total: 50% tax (taxed twice!)

With treaty:
- Foreign tax credit (offset US tax against UK tax)
- Total: 25% tax (one country takes credit)

Examples:
- US-UK treaty (double-tax avoidance agreement)
- US-EU treaties (varies by country)

Research: If expanding internationally, verify treaty with accountant.

**VAT/Sales Tax**

SaaS often exempt from VAT (digital services), but varies.

Example: Services taxable in most countries
- UK SaaS: 0% VAT (digital services exempt)
- US SaaS: 0-8% state sales tax (varies)
- Germany SaaS: 19% VAT (if not exempt)

Register for VAT if:
- Turnover exceeds threshold (£85K in UK)
- Operating in country (selling to local customers)

Process:
- Register with tax authority
- Charge VAT on invoices
- Collect VAT from customers
- Submit VAT return quarterly/monthly
- Pay collected VAT to government

Cost: Accounting costs for compliance.

`
      },
      {
        heading: "Building Global Operations",
        body: `Scaling across multiple countries.

**Remote vs Local Presence**

Remote team:
- Hire contractors globally
- No local office
- Cost: Low
- Control: Medium
- Tax complexity: High (contractor classification)

Local office:
- Small office (2-3 people)
- Local team (employees)
- Cost: Medium
- Control: High
- Tax complexity: Medium

Typical progression:
- Year 1-2: Remote contractors
- Year 2-3: Local manager (employee)
- Year 3+: Full local team

**Hiring Internationally**

Challenge: Different employment laws per country.

Options:
1. Hire as contractor (1099/contractor agreement)
   - Pro: Simple, low cost
   - Con: Misclassification risk (if looks like employee, tax authorities challenge)

2. Hire as employee (W-2/employment contract)
   - Pro: Clear, legal
   - Con: Payroll, benefits, taxes more complex

3. Employer of record (EOR) service
   - Example: Remote, Deel, Guidepoint
   - Pro: They handle employment, taxes, compliance
   - Con: Cost (2-5% of payroll)

Best: EOR for first few hires in new country (simplifies complexity).

**Global Finance Management**

Consolidation:
- Local entities report in local currency
- Convert to base currency monthly
- Consolidate into group financials

Cash management:
- Local accounts per country (needed for operations)
- Transfer excess cash to head office (periodic)
- Consider intercompany loans (tax efficient)

Complexity increases with countries (4+ countries = need dedicated finance).

`
      }
    ],
    relatedSlugs: [
      "unit-economics-ltv-cac-payback",
      "financial-forecasting-modeling",
      "exit-planning-and-m-and-a-preparation",
      "partnership-and-channel-strategy",
      "metrics-dashboard-design-kpi-tracking"
    ],
    faq: [
      {
        q: "When should I expand internationally?",
        a: "Only after product-market fit at home (proven model, sustainable growth). Target: Expand when home market 70%+ of capacity. First market: Geographically close or large opportunity. Target: 20%+ of revenue from new market before expanding again. Path: Self-serve → partner → local team (as grow)."
      },
      {
        q: "How do I handle multiple currencies?",
        a: "Record all transactions in base currency at spot rate (daily or monthly). Impacts revenue if rates fluctuate. Hedge: If >20% revenue in foreign currency, forward contract locks in rate (cost 1-2%, protects 5-10% FX loss). Track FX gains/losses (recorded on P&L)."
      },
      {
        q: "What taxes apply internationally?",
        a: "Corporate income tax (varies: 12.5% Ireland, 21% US, 25% UK). VAT (digital services often exempt). Payroll taxes (varies). Tax treaties avoid double-taxation. Strategy: Use tax treaties, consider multi-entity structure (optimize taxes). Hire local accountant in each country."
      },
      {
        q: "Should I hire local employees or contractors?",
        a: "Early: Contractors (simple, low cost). Growth: Local manager as employee. Scale: Full team. Use EOR service for first hires (handles employment, taxes, compliance for 2-5% of payroll). Avoid misclassification (contractor vs employee) - tax authorities challenge this."
      }
    ],
    videoUrl: ""
  }
];

export default batch176Articles;
