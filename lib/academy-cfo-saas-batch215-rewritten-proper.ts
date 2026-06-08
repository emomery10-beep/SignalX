import { AcademyArticle } from "@/types/academy";

export const batch215Articles: AcademyArticle[] = [
  {
    slug: "building-and-managing-advisory-boards",
    title: "Building and Managing Advisory Boards: Leveraging External Expertise",
    description: "Master advisory boards. Recruit advisors, leverage expertise, and create mutual value.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["advisory board", "advisors", "mentor", "board", "expertise", "mentorship", "advisor equity", "strategic advice", "network", "connections"],
    keyTakeaways: [
      "Advisor selection: 3-5 advisors (board of directors different = formal governance). Profiles: (1) Industry expert (deep category knowledge), (2) Go-to-market (sales/marketing strategy), (3) Finance (capital, profitability), (4) Technical (architecture, scaling). Equity: £0.1-0.5% per advisor (vests 1 year, cliff 3 months). Cost: Low equity, high value (leverage expertise without expensive full-time hire). Time: 4 hours/quarter per advisor (phone calls, emails). Selection: Look for track record (have done it before), network (can make intros), credibility (customers will trust).",
      "Advisor agreement: Contract specifies: Equity grant (£0.2% over 1 year), vesting (cliff + monthly), role (advise on X), term (2 years, renewable), confidentiality (NDA). Benefits to advisor: Equity upside, network access, board seat (prestige). Benefits to company: Expert guidance, introductions, credibility (customers like when advisors are known). Avoid: Too many advisors (dilutes equity), advisors doing nothing (waste of equity), advisors competing (conflicts of interest).",
      "Management cadence: Quarterly calls (30-60 min, company update + advice request). Annual dinner (in-person, build relationships). Ad-hoc: Email for specific questions. Communication: Share monthly metrics, investor updates, ask for introductions/advice. Success: Intro that becomes customer (£10K+ value), strategic advice that impacts roadmap (avoid $1M mistake = value), network (hire through advisor referral = lower CAC). ROI: £0.2% equity (worth £20K at £10M valuation) for advice worth £200K+ = excellent return."
    ],
    content: [
      {
        heading: "Selecting and Recruiting Advisors",
        body: `Building an effective advisory team.

**Advisor profiles**

Industry expert:
- Deep knowledge of category/market
- Worked in space before (founder, executive)
- Value: Strategy, competitive intelligence, market trends
- Example: Recruited previous CFO from Fintech unicorn

Go-to-market (GTM) advisor:
- Sales/marketing expertise
- Built sales teams, launched products
- Value: Sales strategy, customer acquisition, pricing
- Example: Recruited VP Sales from competitor

Finance advisor:
- CFO or investor experience
- Understand fundraising, profitability, operations
- Value: Finance strategy, investor relations, operational efficiency
- Example: Recruited investor or CFO from similar-stage company

Technical/product advisor:
- Deep technical knowledge
- Built scalable systems
- Value: Architecture, technical decisions, hiring
- Example: Recruited CTO or principal engineer

**Recruitment process**

Approach:
- Warm intro (through network, investor, existing advisor)
- Cold email (if known expert, but lower response)
- Success rate: 20-30% of outreach convert to advisor

Pitch:
- "We're solving X problem (you're expert in)"
- "Would love to get your guidance (4 hours/quarter)"
- "Equity: £0.2% vesting over 1 year"
- "Board seat / prestige if interested"

Offer:
- Equity: £0.1-0.5% (depends on expertise, market rate)
- Term: 2 years (renewable)
- Vesting: 1-year vest, 3-month cliff (earn equity over time)
- Confidentiality: Sign NDA

**Managing conflicts**

Avoid:
- Advisors competing with you (conflict of interest)
- Too many advisors (dilutes equity, dilutes focus)
- Advisors who don't participate (waste of equity)
- Advisors tied to funding (perceived bias)

Include:
- Conflict of interest clause (in agreement)
- Non-solicitation (can't hire employees without agreement)
- Confidentiality (protect company info)

Example conflict:
- Advisor runs competing product
- Solution: Require they don't recruit your team, don't share your strategy with competitors
- Alternative: Don't recruit them (too risky)

`
      }
    ],
    relatedSlugs: ["board-governance-and-fiduciary-duties", "investor-relations-and-communications", "strategic-planning-and-quarterly-goal-setting"],
    faq: [
      {
        q: "How many advisors should I have?",
        a: "Typical: 3-5 advisors (different expertise). More = dilutes equity and focus. Structure: Industry expert, GTM, finance, technical = balanced. Equity: £0.2% each = 0.6-1% total advisory pool (reasonable, leaves room for future hires)."
      },
      {
        q: "What equity should I give advisors?",
        a: "Market rate: £0.1-0.5% per advisor. Depends: Track record, network, expertise. Vesting: 1-year total, 3-month cliff (they earn over time). Cheaper than hiring full-time (salary £100K = 0.5-1% equity, advisor gives similar value for £0.2%)."
      },
      {
        q: "How do I get value from advisors?",
        a: "Quarterly calls (30-60 min), specific questions. Track: Intros that became customers, strategic advice that impacted roadmap, network that helped hiring. Success: Advisor intro = £10K+ value, strategic advice avoiding £1M mistake = excellent ROI. Relationships: Annual dinner (in-person), show appreciation."
      },
      {
        q: "What if an advisor doesn't help?",
        a: "Give them 6 months to add value. If not engaged: They may not have capacity or wrong fit. Options: Ask for specific commitments, rotate to new advisor, let agreement expire. Document: Why they're not helpful, what you'd change for next advisor."
      }
    ],
    videoUrl: ""
  }
];

export default batch215Articles;
