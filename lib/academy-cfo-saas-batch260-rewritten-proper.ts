import { AcademyArticle } from "@/types/academy";

export const batch260Articles: AcademyArticle[] = [
  {
    slug: "market-sizing-and-tam-analysis",
    title: "Market Sizing and TAM Analysis: Understanding Your Market Opportunity",
    description: "Master market sizing. Calculate TAM, SAM, SOM, validate market opportunity.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["TAM", "market sizing", "market analysis", "SAM", "SOM", "addressable market", "market opportunity", "growth potential"],
    keyTakeaways: [
      "TAM/SAM/SOM framework: TAM (Total addressable market = all customers who could use product), SAM (Serviceable addressable market = customers you can realistically reach), SOM (Serviceable obtainable market = customers you expect to capture). Example: Email app. TAM = all office workers (£500B/year), SAM = US/EU office workers (£100B), SOM = enterprise customers you can reach (£10B). Goal: Show growing SOM over time (path to £1B+ potential). Investors check: Is market big enough (>£1B), growing (>20% annually), addressable (can you reach them?). Cost: Market research £5-20K. ROI: Validate opportunity before investing in product (avoid building in shrinking market).",
      "Top-down vs bottom-up TAM: Top-down (start with industry size, subtract competitors) = fast, less accurate. Bottom-up (sum customer segments, forecast) = slow, more accurate. Example: Top-down Email. Global email market £50B → SaaS portion 20% = £10B → capture 1% = £100M potential. Bottom-up: 1M office workers × 5 use emails = 5M users × £100 annual = £500M market. Both needed: Top-down validates scale, bottom-up validates path. Typically: Top-down 2-3x bottom-up (conservative estimate better for reality).",
      "Market validation: Talk to customers (1-2% of TAM buying?) = proof market exists. TAM too small if: <£100M (hard to build big company). TAM growing? >20% annual = healthy. TAM competitive? If 10+ competitors, differentiate on product/positioning. Expansion: Can you expand TAM over time? Land and expand (start SMB, move to enterprise). New verticals (start finance, expand healthcare). Messaging: Internal (use TAM/SAM/SOM for planning), external (investors see big market as investment positive). Reality check: Most companies capture 5-10% of addressable market (pie splits among many players)."
    ],
    content: [
      {
        heading: "Market Sizing and Opportunity Analysis",
        body: `Validating market opportunity.

**TAM/SAM/SOM framework**

Definitions:
- TAM (Total Addressable Market): All potential customers globally
- SAM (Serviceable Addressable Market): Customers you can realistically reach (geography, segment)
- SOM (Serviceable Obtainable Market): Customers you expect to capture (realistic forecast)

Example: CRM for small business
- TAM: All small businesses globally (£500B estimated SaaS potential)
- SAM: Small businesses in US/EU (£100B SaaS potential)
- SOM (year 5): Your market share 5% (£5B potential)

Visual: TAM (entire pie) → SAM (pie slice you target) → SOM (bite of slice)

Why matters:
- Investors: Market must be big enough (>£1B) to justify investment
- Planning: SAM = realistic market to pursue first, SOM = path to scale
- Focus: Know SAM to target marketing efficiently
- Exit: SOM × average price = revenue potential (Series C/exit valuation)

Example sizing:
| Market | Size | Growth |
|---|---|---|
| TAM (all CRM) | £500B | 15% YoY |
| SAM (SMB CRM, US/EU) | £100B | 20% YoY |
| SOM (Year 5 market share 5%) | £5B | 20% YoY |

**Top-down vs bottom-up TAM**

Top-down (industry data):
- Start: Industry report (Gartner, Forrester)
- Example: CRM market £50B → SaaS portion 40% (£20B) → SMB portion 30% (£6B)
- Pros: Fast, uses market research
- Cons: Often wrong (industry estimates too broad)

Bottom-up (customer-based):
- Start: Total addressable customer population
- Example: 5M small businesses in US → 80% use CRM (4M) → 50% could use new SaaS (2M) → average price £2K = £4B market
- Pros: More grounded in reality
- Cons: Slow, requires assumptions

Combined approach:
- Calculate both (top-down and bottom-up)
- Compare: If >2x difference, investigate (which assumptions wrong?)
- Use: Top-down (investor check), bottom-up (product planning)

Typical result:
- Top-down: £10B market
- Bottom-up: £5B market
- Likely reality: £5-7B (conservative estimate usually right)

**Market validation checklist**

Is market big enough?
- TAM: >£1B potential (avoid niche <£100M)
- SAM: >£100M addressable in your focus area
- Growth: >20% annual growth (avoid declining markets)

Can you reach market?
- Go-to-market (can you reach customers? sales process?)
- Competition (how many competitors? differentiation?)
- Timing (market ready for solution? too early?)

Validate with customers:
- Talk to 30-50 potential customers (not existing customers, new market)
- Ask: Would you buy? What price? When?
- Goal: 10%+ say "yes, would buy" = market exists

Example validation:
- TAM research: £10B email market
- Interview 40 office managers: 15 (37%) say interested in new email solution
- Price point: Average willing to pay £30/month = £4.3B addressable (37% of TAM)
- Decision: Market validated, pursue

Avoid pitfalls:
- Too small TAM: <£100M (hard to build £1B+ company, not attractive to VCs)
- Too crowded: 20+ competitors, no clear differentiation (Commoditized)
- Declining: Market shrinking (avoid)
- Too early: Market not ready (timing risk)
- Too late: Market mature, hard to enter (commoditized pricing)

**Expansion strategies**

Land and expand:
- Start: One segment (SMB, one vertical)
- Expand: Move upmarket (SMB → mid-market → enterprise)
- Timing: After product-market fit in first segment
- Example: Start £2K/year SMB, expand to £10K/year mid-market

New verticals:
- Start: Finance vertical
- Expand: Healthcare, manufacturing, retail (same product, different industry)
- Benefits: Broader TAM, diversify revenue
- Cost: Vertical-specific marketing, maybe product customization

Geographic expansion:
- Start: US market
- Expand: EU, APAC (same product, translated)
- Benefits: Broader TAM, new growth avenue
- Cost: Localization, maybe regional teams

`
      }
    ],
    relatedSlugs: ["financial-planning-and-budgeting", "strategic-planning-and-quarterly-goal-setting", "customer-acquisition-strategy-and-marketing-roi"],
    faq: [
      { q: "How do I calculate TAM/SAM/SOM?", a: "TAM: Industry research (total potential market). SAM: Focus area (geography, segment) within TAM. SOM: Your realistic capture (typically 5-10% of SAM). Example: TAM £100B, SAM £10B, SOM (5% capture) £500M. Both top-down (industry data) and bottom-up (customer count) approaches useful." },
      { q: "What's a good TAM size?", a: "Good: >£1B (big enough for big company). Acceptable: £500M-1B (medium opportunity). Avoid: <£100M (hard to build large company). Growth: Should be growing >20% annual (avoid declining markets). Check: What can you realistically capture? (SOM typically 5-10% of SAM)." },
      { q: "How do I validate market opportunity?", a: "1. Research TAM (industry reports). 2. Calculate SAM (your addressable segment). 3. Interview 40-50 potential customers (would they buy?). 4. Price discovery (what would they pay?). 5. Calculate realistic SOM (5-10% of SAM). Red flags: <10% interested, willing to pay low price, >10 competitors, declining market." }
    ],
    videoUrl: ""
  }
];

export default batch260Articles;