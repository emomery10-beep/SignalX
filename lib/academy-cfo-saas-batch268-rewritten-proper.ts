import { AcademyArticle } from "@/types/academy";

export const batch268Articles: AcademyArticle[] = [
  {
    slug: "marketing-automation-and-lead-nurturing",
    title: "Marketing Automation and Lead Nurturing: Automating Growth",
    description: "Master marketing automation. Build nurture sequences, score leads, improve conversion.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["marketing automation", "lead nurturing", "email sequences", "lead scoring", "nurture campaigns", "marketing workflows"],
    keyTakeaways: [
      "Marketing automation benefits: Nurture leads (educate via email while sales qualifies), score leads (identify ready-to-buy), improve conversions (keep prospects engaged), scale without headcount (tech does work). Example: 100 leads/month generated, 10% sales-qualified (10 SQLs). Without automation: Many leads lost (sales can't reach everyone). With automation: Nurture sequences keep prospects engaged, 25-30% convert (vs 10% without nurture). Benefit: 3x more SQLs from same lead volume (£100K+ annual value). Cost: Tool (HubSpot £400-2K/month), sequences (content creation £2-5K/month), implementation (1-2 weeks). ROI: 2-3x usually within 6 months.",
      "Lead scoring: Assign points for behaviors (visit website +5, download content +10, open email +1, request demo +50). Threshold: >100 points = sales-qualified lead (pass to sales). Example: Visitor +5, emails +3 opens = 8 points. Downloads whitepaper +10 = 18 points. Visits pricing page +5 = 23 points. Total 23 (not qualified). Next: Opens 5 more emails (+5) = 28. Views demo video (+5) = 33. Requests pricing call (+50) = 83. Downloads product data sheet (+10) = 93. Requests trial (+50) = 143 = qualified (pass to sales). Benefit: Sales focuses on hot leads (higher conversion), avoid cold outreach (waste of time).",
      "Nurture sequences: 3-5 email series (spaced 2-4 days apart), educational content (avoid hard sell initially), progressive personalization (learn about prospect, tailor). Example: Day 1 'Thanks for downloading' (welcome, ask about goals), Day 4 'How similar companies' (social proof, case studies), Day 7 'Feature deep-dive' (educate on product), Day 10 'ROI calculator' (show value), Day 14 'Book demo' (soft CTA). Frequency: Once per week optimal (more = unsubscribes, less = engagement dies). A/B test: Subject lines, content, CTA (improve each sequence). Cost: Content creation (£1-2K setup), ongoing maintenance (£500/month)."
    ],
    content: [
      {
        heading: "Marketing Automation and Lead Nurturing",
        body: `Automating the customer acquisition funnel.

**Lead scoring framework**

Behavioral scoring:
| Behavior | Points | Cumulative example |
|---|---|---|
| Website visit | +5 | 5 |
| Email open | +1 | 6 |
| Download whitepaper | +10 | 16 |
| Visit pricing page | +5 | 21 |
| Demo request | +50 | 71 |
| Trial signup | +50 | 121 |

Qualification threshold:
- 0-50 points: Not qualified (lead generation, educate)
- 50-100 points: Warming up (nurture, educational)
- 100+ points: Sales-qualified (pass to sales)

Firmographic scoring (company info):
- Company size (right size): +20 points
- Industry fit: +15 points
- Revenue size: +10 points (can afford product)
- Growth rate: +10 points (urgent need)

Total scoring:
- Behavioral: 0-100+ points (actions taken)
- Firmographic: 0-50+ points (company fit)
- Combined: 0-150+ points (holistic score)

Example qualification:
- Visitor: 5 points (website visit)
- Opens 5 emails: 5 points (engagement)
- Views demo video: 10 points
- Downloads case study: 10 points
- Request pricing: 25 points
- Company fit: 20 points (right size/industry)
- Total: 75 points (warming, nurture more)

Next engagement:
- Requests trial: +50 = 125 (sales-qualified, pass to sales)

**Nurture sequence design**

Email series (day-by-day):
| Day | Subject | Content | CTA |
|---|---|---|---|
| 1 | Thanks for downloading! | Welcome, what problem solving? | Take survey (learn about them) |
| 4 | How companies like yours | Social proof, case study | Read case study |
| 7 | Feature deep-dive: X | Education on key feature | Watch video (5 min) |
| 10 | See your ROI | ROI calculator tool | Calculate savings |
| 14 | Let's connect | Soft pitch (not pushy) | Book demo (if interested) |
| 21 | Last chance | Final email (if no engagement) | Contact us |

Content guidelines:
- Educational (avoid sales pitch initially)
- Personalized (use company name, reference behavior)
- Value-first (why should they care?)
- CTA clear (one per email, not multiple)

Frequency:
- 1 email per week = optimal (engage without annoy)
- 2+ per week = unsubscribe risk
- Less than 1/week = engagement dies

Segmentation:
- Segment 1: Downloaded whitepaper (educate on ROI)
- Segment 2: Watched demo (nurture on implementation)
- Segment 3: Trial user (onboarding, support, upsell)
- Different content for each segment (relevant)

**Automation setup and ROI**

Tools:
- HubSpot (all-in-one, £400-2K/month)
- Mailchimp (email only, £0-500/month)
- Klaviyo (e-commerce focused, £20-500/month)
- Marketo (enterprise, £1K+/month)

Setup:
1. Create lead scoring model (behavior + firmographic)
2. Build email sequences (3-5 emails, 1-2 weeks)
3. Set up triggers (download → sequence start)
4. A/B test (subject lines, content, CTAs)
5. Monitor (open rate, click rate, unsubscribe rate)

Cost-benefit:
- Setup: £2-5K (sequences, scoring rules, integrations)
- Ongoing: £500-2K/month (tool, content updates, monitoring)
- Benefit: 2-3x more sales-qualified leads from same lead volume

Example ROI:
- Current: 100 leads/month, 10% SQLs = 10 SQLs/month
- With automation: Same 100 leads, 25-30% nurture to SQL = 25-30 SQLs/month
- Improvement: 150-200% more SQLs from same marketing spend
- Additional revenue: 20 additional SQLs × 30% close rate × £50K ACV = £300K additional revenue
- Annual: £300K × 12 = £3.6M additional annual revenue
- Cost: £20K setup + £12K/year ongoing = £32K total cost
- ROI: £3.6M / £32K = 112x (outstanding)

`
      }
    ],
    relatedSlugs: ["customer-acquisition-strategy-and-marketing-roi", "metrics-dashboard-design-kpi-tracking", "testing-framework-and-ab-testing-methodology"],
    faq: [
      { q: "What leads should I nurture?", a: "Not sales-qualified (not ready to buy), but showing interest (visited website, downloaded content, attended webinar). Nurture with educational sequences until sales-qualified (score 100+, requested demo). Goal: Educate, build trust, move down funnel without sales outreach." },
      { q: "How do I set up lead scoring?", a: "Behavioral: Points for actions (email open +1, demo request +50). Firmographic: Points for company fit (right industry, size, growth). Threshold: >100 points = sales-qualified. Goal: Identify hot leads for sales to follow up." },
      { q: "What's a good nurture sequence?", a: "3-5 emails, 1-2 weeks apart, educational content, progressive personalization. Example: Day 1 (welcome), Day 4 (social proof), Day 7 (feature), Day 10 (ROI), Day 14 (demo CTA). Test: Subject lines, content, CTAs (improve each sequence). Frequency: 1x/week optimal." }
    ],
    videoUrl: ""
  }
];

export default batch268Articles;