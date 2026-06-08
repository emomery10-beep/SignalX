import { AcademyArticle } from "@/types/academy";

export const batch218Articles: AcademyArticle[] = [
  {
    slug: "international-expansion-and-localization",
    title: "International Expansion and Localization: Growing Globally",
    description: "Master global expansion. Enter new markets, handle currencies, and localize products.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["international", "localization", "global", "markets", "currencies", "expansion", "hiring", "regulations", "compliance", "multi-currency"],
    keyTakeaways: [
      "Market selection: Start US/UK (English-speaking, low localization cost). Then Europe (GDPR compliance required, £5-10K legal). Then Asia (higher growth, but language/regulatory complexity). Financial impact: US customers pay £10K ACV, EU same (language barrier minimal). Asia: Same or higher ACV, but longer sales cycle. Timing: After £2-5M ARR (focus on one market first). Cost: £50-100K per market (legal, compliance, hiring, marketing). Hiring: Local team needed (language, cultural understanding, sales effectiveness). Tax/compliance: VAT in EU (3-27% depending on country), local tax registration, withholding taxes.",
      "Localization strategy: Full localization (translate product, hire team) vs light localization (English product, hire sales team). Full: 6-9 months, £100K+. Light: 3-6 months, £50K. Example: EU full localization (German, French, Spanish versions), Asia light (English product, hire in-market sales). Product: Translate UI (3-6 months development), support materials, help docs. Payment: Handle local payment methods (China = Alipay/WeChat, India = UPI, EU = SEPA). Pricing: Different by country (willingness to pay varies, PPP adjustment).",
      "Operations complexity: Multi-currency accounting (convert to home currency, track FX impact), VAT/GST (compliance burden, 5-20% of revenue), withholding taxes (reduce payments to contractors, report to authorities), EOR services (easier in some countries, hire through third-party). Example: Hire engineer in Germany, contractor (1099) = no taxes you withhold. Employee = German employer taxes (42-45% additional cost to salary). EOR service = £2-3K/month per employee (includes taxes, legal). Cost-benefit: EOR expensive, but avoid legal risk and complexity. Plan: Start with contractors/partners, switch to employees/EOR as volume grows."
    ],
    content: [
      {
        heading: "Market Selection and Entry Strategy",
        body: `Choosing international markets to expand.

**Market prioritization**

Phase 1: English-speaking (UK, Canada, Australia)
- Advantage: No language barrier, similar regulatory environment (vs US)
- Ease: Launch in 1-2 months
- Cost: £20-30K
- Sales: Native salespeople not critical (can use US team)

Phase 2: Western Europe (Germany, France, Spain)
- Advantage: Large market, high purchasing power, GDPR compliance prerequisite (de-risks)
- Complexity: Multiple languages, complex VAT, different regulations per country
- Cost: £50-100K per country (full localization)
- Timeline: 6-9 months per country
- Hiring: Must hire local (language, cultural fit, sales effectiveness)

Phase 3: Asia (Singapore, India, Australia)
- Advantage: High growth markets, large TAM
- Complexity: Language, regulatory (China harder than India), long sales cycles
- Cost: £50-100K
- Timeline: 6-12 months

**Market entry approach**

Light localization (low cost, faster):
- Product: English only
- Team: Sales hire (English-speaking, local market knowledge)
- Cost: £30-50K
- Timeline: 3-4 months
- Risk: Limit market (lose non-English customers, 30-50% addressable market)

Full localization (high cost, higher potential):
- Product: Translated UI, support in local language
- Team: Full team (sales, CS, product)
- Cost: £100K+
- Timeline: 6-9 months
- Benefit: Capture full market, higher customer lifetime value

**Example market expansion plan**

Year 1: US (baseline), expand to UK
Year 2: Expand to EU (start Germany), launch Asia (Singapore)
Year 3: Scale existing, expand Canada, additional EU countries

Revenue by market (3-year plan):
| Market | Year 1 | Year 2 | Year 3 |
|---|---|---|---|
| US | £8M | £10M | £12M |
| UK | - | £1M | £2M |
| EU (Germany) | - | £0.5M | £2M |
| Asia (Singapore) | - | £0.2M | £1M |
| **Total** | **£8M** | **£11.7M** | **£17M** |

Cost of expansion:
- Year 1: 0 (focus on US)
- Year 2: £100K (UK + Germany infrastructure)
- Year 3: £200K (ongoing localization, support)

`
      }
    ],
    relatedSlugs: ["customer-data-privacy-and-gdpr-compliance", "international-expansion-and-multi-currency-operations", "vendor-management-and-procurement-strategy"],
    faq: [
      {
        q: "When should I expand internationally?",
        a: "Milestone: After £2-5M ARR (concentrate on one market first). Start: US or UK (English, easier). Then: Western Europe (GDPR compliance already required if EU customers). Then: Asia (high growth, but complexity). Cost: £50-100K per market. Benefit: New revenue, diversification (less US concentration)."
      },
      {
        q: "Do I need to translate my product for each language?",
        a: "Depends: Light localization (English product, hire sales team) = faster (3-4 months), cheaper (£30K). Full (translate UI, support) = slower (6-9 months), expensive (£100K+), but higher market capture. Start light, upgrade to full if market justified (revenue >£500K)."
      },
      {
        q: "How do I handle multiple currencies?",
        a: "Stripe/payment processor: Handle multi-currency automatically. Accounting: Convert all to home currency monthly, track FX impact (can be significant). Pricing: Adjust by country (willingness to pay, purchasing power). Example: £100/month in US = €100/month in EU (same in home currency)."
      },
      {
        q: "How do I hire in new countries?",
        a: "Options: (1) Employees (legally complex, taxes ~40-50% on salary), (2) Contractors (simpler legally, watch tax withholding), (3) EOR service (£2-3K/month, handles all legal/tax). Recommendation: Start with contractors, scale to EOR or employees as volume grows. Avoid: Direct employees early (complexity, cost)."
      }
    ],
    videoUrl: ""
  }
];

export default batch218Articles;
