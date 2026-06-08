import { AcademyArticle } from "@/types/academy";

export const batch261Articles: AcademyArticle[] = [
  {
    slug: "building-and-managing-advisory-boards",
    title: "Building and Managing Advisory Boards: Leveraging External Expertise",
    description: "Master advisory boards. Recruit advisors, manage relationships, extract value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["advisory board", "advisors", "board management", "expert advisors", "advisor equity", "external expertise"],
    keyTakeaways: [
      "Advisor recruitment: Find domain experts (product, sales, market experts). Sources: Past colleagues, investor networks, founder friends, LinkedIn. Target: 5-7 advisors (avoid too many, hard to coordinate). Offer: Typically 0.25-1% equity (vesting 4 years), no salary (volunteer basis). Example: Former CMO of big tech = product marketing advisor. Former enterprise sales VP = go-to-market advisor. Value: Access to network, expertise, credibility (especially early). Cost: Equity only (no cash), time to coordinate. Benefit: Answer tough questions (should we pivot?), make introductions (investor/customer), hire recommendations (trust network).",
      "Advisor structure: Meeting schedule (quarterly in-person if possible, annual is minimum). Each advisor: Owns specific area (one sales advisor, one product, one finance). Relationship: Informal (no formal responsibilities, flexibility). Communication: Monthly email update (what building, help needed), quarterly call (deep dive on specific topic). Compensation: Small equity grant (0.25-0.5%), occasional swag, public credit (mention on website). Expectation-setting: Help is voluntary (don't expect immediate response), limited time commitment, alignment on vision.",
      "Value extraction: Ask for introductions (investors, customers, talent). Get feedback (product direction, market approach). Leverage network (expand reach). Avoid: Treating advisors as board members (different obligations), micromanaging (they volunteer), not following up (relationship dies). Cost: Time to maintain relationships (monthly emails, quarterly calls) = 5-10 hours/quarter. ROI: One investor introduction from advisor = worth 0.5% equity easily (introductions = fundraising success). One key hire from advisor network = worth 1% equity (talent is scarce)."
    ],
    content: [
      {
        heading: "Advisory Board Recruitment and Management",
        body: `Building a board of external experts.

**Advisor profiles and recruitment**

Ideal advisors:
- Domain expert (deep knowledge in your market)
- Network (knows investors, potential customers, talent)
- Experience (built company, scaled function, exited)
- Availability (time to help, not too busy)

Example advisor team:
| Area | Advisor profile | Why | Benefit |
|---|---|---|---|
| Product | Former head of product (big tech) | Know product strategy | Guide roadmap, hire advice |
| Sales | Former VP sales (B2B SaaS) | Know enterprise sales | GTM advice, customer intros |
| Finance | Former CFO (SaaS company) | Know SaaS unit economics | Financial modeling, investor prep |
| Market | Industry analyst (analyst firm) | Know market trends | Competitive insight, positioning |

Recruitment approach:
1. Identify person (best is someone you know)
2. Reach out: Personal email (not cold)
3. Quick call (30 min, explain vision)
4. Make offer: "Be our advisor on X, 0.5% equity vesting 4 years"
5. Formalize: Advisor agreement (what equity, vesting, responsibilities)

Sources:
- Past colleagues (trust, know them)
- Investor network (they often have advisors willing to help)
- Founder friends (mutual network)
- LinkedIn (search, warm intro better than cold)

Typical response rate:
- Warm introduction: 30-40% accept
- Cold outreach: 5-10% accept
- Target: 7-10 reaches to land 2-3 yes

**Advisor compensation and structure**

Equity grants:
- Early stage (pre-revenue): 0.5-1% per advisor (higher value)
- Growth (£1M+ revenue): 0.25-0.5% per advisor (lower value as company progresses)
- Total advisor pool: 5-7% of cap table (not too much, avoid dilution)

Vesting:
- 4-year vest, 1-year cliff (common)
- Example: 0.5% grant, 0.0125% vests monthly after year 1

No salary (volunteer basis):
- Equity only, no cash (early stage, cash critical)
- Occasional thank you (dinner, merchandise)
- Public credit (mention on website, LinkedIn)

Advisory agreement:
- Grant size (0.5%)
- Vesting terms (4 years, 1-year cliff)
- Status (non-voting director, not board member)
- Term (can terminate anytime, mutual)

**Managing advisor relationships**

Communication cadence:
- Monthly: Email update (what building, progress, asks)
- Quarterly: Call (15-30 min on specific topic)
- Annual: In-person if possible (dinner, relationship building)

Monthly email template:
- Update (2-3 key metrics: ARR, growth, churn)
- Progress (what shipped, what learned)
- Ask (specific help: intro to X, feedback on Y, advice on Z)
- Sentiment (excited, learning, planning for next quarter)

Quarterly call topics:
- Product strategy (should we build X? prioritize Y?)
- Go-to-market (customer feedback, competitive threat)
- Hiring (need VP sales, do you know anyone?)
- Fundraising (ready for Series A, who should we talk to?)

Value extraction:
1. Introductions: "Can you introduce us to investor X? Customer Y?"
2. Network: "Do you know anyone for CFO role? Customer in healthcare?"
3. Feedback: "What do you think of our positioning? Product direction?"
4. Validation: "Is this market big enough? Are we thinking about it right?"

Advisor lifecycle:
- Year 1: Active (lots of asks, relationship forming)
- Year 2-3: Steady (quarterly calls, occasional intros)
- Year 4+: Wind down (vesting complete, relationship maintenance)
- Post-vest: Can leave amicably or stay if mutually beneficial

`
      }
    ],
    relatedSlugs: ["investor-relations-and-communications", "hiring-and-talent-acquisition-strategy", "customer-advisory-board-and-voice-of-customer"],
    faq: [
      { q: "How many advisors should I have?", a: "5-7 advisors (manageable, good coverage). Too few (<3): Limited expertise, network. Too many (>10): Hard to coordinate, relationship diluted. Focus: Each advisor owns specific domain (1 product, 1 sales, 1 finance, etc.)." },
      { q: "What should I offer advisors?", a: "Equity: 0.25-1% (early stage higher, growth stage lower). Vesting: 4 years with 1-year cliff (standard). No salary (volunteer). Thank you: Public credit, occasional dinner. Expectation: Quarterly calls, monthly email, help with intros/feedback." },
      { q: "How do I get value from advisors?", a: "Monthly email update (progress, ask). Quarterly calls (specific topics). Ask for: Introductions (investors, customers, talent), feedback (product, market, positioning), validation (market opportunity, strategy). Leverage: Network (expand reach, credibility). Total time: 5-10 hours/quarter to maintain." }
    ],
    videoUrl: ""
  }
];

export default batch261Articles;