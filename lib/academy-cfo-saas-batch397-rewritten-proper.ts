import { AcademyArticle } from "@/types/academy";

export const batch397Articles: AcademyArticle[] = [
  {
    slug: "saas-geographic-expansion-economics",
    title: "Geographic Expansion Economics: Growing SaaS Into New Markets",
    description: "Master geographic expansion. Evaluate market entry costs, localisation economics, and international growth strategies.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["geographic expansion", "international growth", "market entry", "localisation", "global SaaS"],
    keyTakeaways: [
      "Market entry cost analysis: Entering a new market costs £100-500K in year 1 (depending on approach). Components: (1) Localisation (translation, currency, compliance): £30-100K, (2) Local team (1-3 hires or EOR): £100-250K, (3) Marketing (local campaigns, events): £30-100K, (4) Legal and compliance: £20-50K. Break-even: Typically 18-36 months per market. Target: New market should contribute 10-20% of ARR within 3 years. ROI: Best markets pay back in <24 months.",
      "Market prioritisation framework: Score markets on: (1) Market size (TAM in target segment), (2) Competition (less = better), (3) Cultural fit (English-speaking markets easier), (4) Payment infrastructure (credit card adoption), (5) Regulatory complexity (GDPR already handled for EU), (6) Existing customer demand (inbound from market). Typical expansion path for UK SaaS: UK → US → EU (DACH) → ANZ → Rest of world. US is usually highest-ROI expansion due to 5-10x UK market size.",
      "Localisation economics: Product localisation (translation, currency, date formats): £20-50K. Marketing localisation (website, content, SEO): £15-30K/market. Sales localisation (local number, local payment methods): £10-20K. Support localisation (local language support): £30-50K/year per language. Decision: Only fully localise for markets with >£500K revenue potential in 2 years. For smaller markets: English-only with local payment methods. Each language adds 20-30% support cost."
    ],
    content: [
      {
        heading: "Planning and Executing Geographic Expansion for SaaS",
        body: `Making data-driven decisions about when and where to expand internationally.

**Market entry decision framework**

When to expand internationally:

Prerequisites:
- Product-market fit in home market (NRR >100%)
- Repeatable sales process (proven playbook)
- £3-5M+ ARR (enough foundation to fund expansion)
- Cash runway >18 months (expansion is expensive)
- Team capacity (can't be at breaking point domestically)

Expansion triggers:
- Significant inbound demand from new market (>10% of leads)
- Home market growth slowing (market saturation)
- Competitor entering your markets internationally
- Strategic investor with international network
- Enterprise customer requiring local presence

**Market scoring and prioritisation**

Score each market (1-5 scale):

| Factor | Weight | US | Germany | France | Australia |
|---|---|---|---|---|---|
| Market size | 25% | 5 | 4 | 3 | 3 |
| Competition | 15% | 2 | 3 | 4 | 4 |
| Language/culture fit | 15% | 5 | 2 | 2 | 5 |
| Existing demand | 20% | 4 | 3 | 2 | 3 |
| Regulatory ease | 10% | 3 | 3 | 3 | 4 |
| Payment infrastructure | 15% | 5 | 4 | 4 | 5 |
| Weighted score | 100% | 4.1 | 3.2 | 2.8 | 3.7 |

Priority: US (4.1) → Australia (3.7) → Germany (3.2) → France (2.8)

Typical UK SaaS expansion sequence:

Phase 1: English-speaking markets
- US (5-10x larger market)
- Australia/New Zealand
- Canada
- Advantage: No language barrier, similar business culture

Phase 2: Northern Europe
- Germany, Netherlands, Nordics
- English widely spoken in business
- Strong SaaS buying culture
- GDPR already handled

Phase 3: Rest of Europe
- France, Spain, Italy
- Language localisation required
- Different business cultures

Phase 4: Asia-Pacific
- Singapore, Japan, India
- Significant localisation needed
- Different regulatory environments

**Go-to-market approaches by market**

Approach 1: Remote selling (lowest cost)

How:
- Sell from home market into new geography
- Digital marketing targeting new market
- Video sales calls (no local team)

Cost: £20-50K/year
Best for: English-speaking markets, self-serve products
Limitations: No local presence, limited enterprise sales

Example budget:
| Item | Annual cost |
|---|---|
| Local digital marketing | £15K |
| Local phone number (virtual) | £500 |
| Local payment methods | £2K |
| Legal (local T&Cs) | £5K |
| Total | £22.5K |

Approach 2: Local sales rep (medium cost)

How:
- Hire 1-2 local sales reps (or use EOR)
- Local phone, local events
- Supported by central marketing

Cost: £100-200K/year
Best for: Mid-market deals, established product-market fit
Limitations: Limited support coverage

Example budget:
| Item | Annual cost |
|---|---|
| Local sales rep (EOR) | £80K salary + £15K EOR |
| Local marketing | £30K |
| Travel | £15K |
| Events | £10K |
| Legal/compliance | £10K |
| Total | £160K |

Break-even:
- Need: £160K in new ARR to break even
- At £20K ACV: 8 new customers in year 1
- At £10K ACV: 16 new customers in year 1
- Achievable if product-market fit exists

Approach 3: Full local operation (highest cost)

How:
- Local subsidiary
- Local team (sales, support, CS)
- Full localisation
- Local marketing

Cost: £300-500K+/year
Best for: Enterprise markets, regulatory requirements
Limitations: Expensive, complex to manage

Example budget:
| Item | Annual cost |
|---|---|
| Local entity setup | £10K (one-time) |
| Local team (5 people) | £300K |
| Office | £30K |
| Marketing | £50K |
| Compliance | £20K |
| Total | £410K |

Break-even:
- Need: £410K in new ARR
- At £30K ACV: 14 new enterprise customers
- Typically: 24-36 months to break even

**Product localisation economics**

Must-have (for any market entry):

| Item | Cost | Timeline |
|---|---|---|
| Local currency pricing | £5-10K | 2-4 weeks |
| Local payment methods | £5-10K | 2-4 weeks |
| Date/time/number formatting | £5-10K | 2-4 weeks |
| Local invoicing compliance | £5-10K | 2-4 weeks |
| Total must-have | £20-40K | 1-2 months |

Nice-to-have (when revenue justifies):

| Item | Cost | Revenue trigger |
|---|---|---|
| Full UI translation | £20-40K/language | >£200K revenue from market |
| Local content/blog | £15-30K/year | >£300K revenue |
| Local help docs | £10-20K/language | >£200K revenue |
| Local support team | £30-50K/year | >£500K revenue |
| Total nice-to-have | £75-140K | |

Translation cost benchmarks:
- Professional translation: £0.08-0.15 per word
- SaaS UI: 50,000-100,000 words = £4-15K per language
- Documentation: 100,000-200,000 words = £8-30K per language
- Marketing website: 20,000-50,000 words = £1.6-7.5K per language

AI-assisted translation: 50-70% cost reduction
- Machine translate + human review: £0.03-0.06 per word
- Quality: 85-95% of full human translation
- Best for: Documentation, help articles
- Not recommended for: Marketing copy, legal documents

**International pricing strategy**

Pricing by market:

Options:
1. Same price globally (simplest)
2. PPP-adjusted pricing (purchasing power parity)
3. Market-based pricing (different per country)

PPP-adjusted example:

Base price (UK): £100/month

| Market | PPP factor | Local price | In GBP |
|---|---|---|---|
| US | 1.3x | $130/mo | ~£100 |
| Germany | 1.0x | €115/mo | ~£100 |
| India | 0.3x | ₹3,000/mo | ~£30 |
| Brazil | 0.4x | R$250/mo | ~£40 |
| Japan | 0.9x | ¥15,000/mo | ~£90 |

Arguments for PPP pricing:
- Maximises addressable market in developing economies
- Higher conversion in price-sensitive markets
- Prevents grey market (buying through cheaper countries)

Arguments against:
- Revenue per customer is lower
- Support costs are the same
- Arbitrage risk (VPN to get lower price)
- Harder to manage

Best practice:
- Developed markets: Full pricing (or slight local adjustment)
- Developing markets: 30-60% discount (PPP-adjusted)
- Enterprise: Always local market pricing (negotiated)

**Measuring international expansion success**

KPIs per market:

| Metric | Month 3 | Month 6 | Month 12 | Month 24 |
|---|---|---|---|---|
| Local ARR | £20K | £80K | £250K | £600K |
| Customers | 5 | 15 | 40 | 80 |
| Local team cost | £40K/qtr | £40K/qtr | £80K/qtr | £120K/qtr |
| Market contribution | -£120K | -£40K | +£90K | +£280K |
| CAC (local) | £8K | £6K | £5K | £4K |
| Churn (local) | 3% | 2.5% | 2% | 1.8% |

Milestones:
- Month 6: First 10 customers (validates market)
- Month 12: £200K+ ARR (justifies investment)
- Month 18: Cash-flow positive market
- Month 24: Market contributes to company growth

Kill criteria (when to exit market):
- Month 12: <£50K ARR (no product-market fit)
- Month 18: <£150K ARR (slow adoption)
- Month 24: Not cash-flow positive locally

When to kill: Exit quickly, redeploy resources to higher-potential markets

**International team management**

Remote international teams:

Challenges:
- Time zone differences (UK-US = 5-8 hours)
- Cultural differences in work style
- Communication gaps
- Isolation from HQ

Best practices:
- Overlap hours: Require 3-4 hours of overlap with HQ
- Regular cadence: Weekly video calls with home team
- Documentation: Everything written (async-first culture)
- Visit: Quarterly in-person visits (budget £3-5K per trip)
- Local leadership: Hire local manager early (not just individual contributors)

Cost comparison (UK-based employee vs US-based):

| Cost item | UK (London) | US (San Francisco) | US (Austin) |
|---|---|---|---|
| Senior engineer salary | £90K | $160K (£123K) | $130K (£100K) |
| Employer taxes | £12K | $12K (£9K) | $10K (£8K) |
| Benefits | £8K | $20K (£15K) | $15K (£12K) |
| Office (per person) | £6K | $12K (£9K) | $6K (£5K) |
| Total | £116K | £156K | £125K |

US (SF) is 34% more expensive than London
US (Austin) is 8% more expensive than London
Consider: UK engineering + US sales (cost-optimised)

`
      }
    ],
    relatedSlugs: ["saas-international-expansion-finance", "customer-acquisition-strategy-and-marketing-roi", "saas-pricing-strategy-and-monetisation", "hiring-and-team-building-economics", "financial-planning-and-budgeting"],
    faq: [
      { q: "How much does it cost to enter a new market?", a: "Depends on approach. Remote selling: £20-50K/year (digital marketing, no local team). Local sales rep (via EOR): £100-200K/year. Full local operation: £300-500K+/year. Break-even: 18-36 months typically. Must-have localisation (currency, payments, formatting): £20-40K. Full localisation (translation, local content): additional £75-140K. Start with remote selling, graduate to local rep when revenue justifies." },
      { q: "Which markets should a UK SaaS company enter first?", a: "Score markets on: market size, competition, language fit, existing demand, regulatory ease, payment infrastructure. Typical path: US first (5-10x larger market, English-speaking), then Australia/NZ, then Northern Europe (Germany, Netherlands), then rest of EU, then APAC. US is highest ROI for most UK SaaS companies. Only expand when you have PMF at home (NRR >100%) and £3-5M+ ARR." },
      { q: "When should I fully localise my product?", a: "Revenue triggers: Local currency + payments (must-have for any market, £20-40K). Full UI translation: When market generates >£200K revenue. Local content/blog: >£300K revenue. Local support team: >£500K revenue. For smaller markets: English-only with local payments. AI-assisted translation reduces cost 50-70%. Don't fully localise until you've validated PMF in the market with English-speaking early adopters." }
    ],
    videoUrl: ""
  }
];

export default batch397Articles;
