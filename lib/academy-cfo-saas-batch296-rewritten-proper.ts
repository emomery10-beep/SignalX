import { AcademyArticle } from "@/types/academy";

export const batch296Articles: AcademyArticle[] = [
  {
    slug: "win-loss-analysis-and-competitive-intelligence",
    title: "Win/Loss Analysis and Competitive Intelligence: Learning From Sales Battles",
    description: "Master win/loss analysis. Understand losses, track competitors, improve strategy.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["win/loss analysis", "competitive intelligence", "lost deals", "competitive strategy", "sales intelligence"],
    keyTakeaways: [
      "Win/loss program: Interview customers who chose us (wins) vs those who didn't (losses) at decision point. Questions: Why us? Why not us? Who was competition? Why them? Cost: 30 min interviews, 10-20/quarter. Benefit: Understand positioning, competitive gaps, lost opportunities. Example: Lost 5/20 deals = 25% loss rate. If all to competitor A with better feature X → product roadmap priority = feature X.",
      "Loss root causes: Price (we expensive, competitor cheaper), features (missing must-haves), integration (API gaps), customer service (better support elsewhere), brand (more established), timing (chose to wait/DIY). Track patterns: If 50% losses to price → pricing strategy issue. If 50% to features → product roadmap issue. Cost: Analysis time (spreadsheet). Benefit: Clear prioritization of improvements.",
      "Competitive intelligence gathering: Sales intel (what are competitors saying?), win/loss insights (who are we losing to?), marketing analysis (positioning, messaging), analyst reports (market trends). Cost: Low (manual research, some paid reports). Benefit: Inform strategy (product roadmap, positioning, pricing). Action: Quarterly competitive review, strategic adjustments."
    ],
    content: [
      {
        heading: "Analyzing Wins and Losses to Improve Strategy",
        body: `Understanding customer decisions and competitive positioning.

**Building a win/loss program**

Program structure:
- Timing: Conduct interviews within 1-2 months of decision (memory fresh)
- Scope: Interview 10-20 customers per quarter (wins and losses combined)
- Format: 30-minute phone call, semi-structured questions
- Interviewer: Sales leader or product manager (not sales person)

Interview questions (wins):
1. Why did you choose us?
2. What was the deciding factor?
3. Who were the other options? (Competitor names)
4. What almost made you choose differently?
5. What features are most important to you?
6. How likely are you to renew in 12 months? (retention signal)
7. Any concerns post-purchase? (early churn indicators)

Interview questions (losses):
1. Why did you choose the other solution?
2. What was the deciding factor?
3. Our pricing: fair or expensive?
4. Our product: missing any critical features?
5. Our support: helpful or lacking?
6. Likelihood of revisiting us? (future opportunity)
7. Who else did you consider? (full competitive set)

Tracking:

| Deal | Outcome | Competitor | Reason | Theme | Segment |
|---|---|---|---|---|---|
| ABC Corp | Loss | CompetitorA | Missing feature X | Product gap | Enterprise |
| XYZ Inc | Win | CompetitorB | Better pricing | Price | SMB |
| Tech Co | Loss | CompetitorC | Better support | Service | Mid-market |
| Growth Ltd | Win | CompetitorA | Existing integration | Features | Growth |

Analysis:
- 5 losses out of 15 decisions = 33% loss rate
- Loss reasons: 2 feature gaps, 2 pricing, 1 support
- Competitor most common: CompetitorA (2 of 5 losses)
- Segment analysis: Enterprise mostly losses, SMB mostly wins

**Loss root cause analysis**

By category:

Product/features (40% typical):
- Missing critical feature (not in roadmap)
- Competitor has feature we don't
- Integration gaps (missing API, Zapier, etc.)
- Performance (slow, doesn't scale)
- User experience (not intuitive)
- Action: Add to product roadmap, prioritize

Pricing (30% typical):
- Too expensive (competitor 30-50% cheaper)
- No flex (rigid pricing, volume discounts)
- Not clear value ($10K for £3K ACV not justified)
- Action: Pricing strategy review, packaging, discounts

Service/support (15% typical):
- Slow response times
- Unhelpful support team
- No onboarding/CSM
- Competitor has better SLA
- Action: Improve support staffing, responsiveness

Brand/reputation (10% typical):
- Competitor more established/trusted
- We're unknown, risky
- Competitor has case studies in their industry
- Action: Build case studies, thought leadership

Other (5% typical):
- Timing (chose to wait, DIY first)
- Relationship (they already use competitor's tools)
- Strategic fit (looking for different solution type)
- Action: Stay in touch, revisit later

**Loss impact matrix**

| Category | % of Losses | ARR at Risk | Fix Complexity | Priority |
|---|---|---|---|---|
| Feature gaps | 40% | £50K (2 features avg) | 2-3 months | High |
| Pricing | 30% | £37K | 1 month | High |
| Support | 15% | £18K | 1 month | Medium |
| Brand | 10% | £12K | 6+ months | Low |
| Timing | 5% | £6K | Follow-up | Low |

Action:
1. Fix top feature gaps (£50K ARR, 3 months = worth it)
2. Revisit pricing (£37K ARR, 1 month = high priority)
3. Improve support (£18K ARR, 1 month = worth doing)
4. Brand building over time (long-term)
5. Timing deals: Set follow-up (recovery opportunity)

**Competitive intelligence framework**

Sources:

Internal (sales team):
- Sales team call notes (what do competitors offer?)
- Lost deal emails (why did we lose?)
- Win themes (what do we beat them on?)
- Cost: Minimal (use existing data)

Customer feedback:
- Win/loss interviews (see above)
- Customer interviews (how compared to alternatives?)
- Support tickets (complaints about missing features?)
- Usage data (feature adoption vs competitors' customers)

Competitive research:
- Website review (positioning, messaging, pricing)
- Pricing page analysis (pricing strategy, plans)
- Feature comparison (feature lists, roadmap if public)
- Marketing materials (ads, content, customer stories)

Analyst reports (paid):
- Gartner Magic Quadrant (positioning vs peers)
- Forrester Wave (capability matrix)
- Cost: £1-10K per report
- Value: Market landscape, capabilities

Intelligence gathering:

Tool-based:
- Blind: Glassdoor for insider employee insights
- PitchBook: Funding, growth stage info
- Crunchbase: Competitor funding, hiring trends
- LinkedIn: Competitor hiring (team growth)
- Cost: £0-500/month

Manual:
- Monitor their blog (product updates)
- Track job postings (what are they building?)
- Customer case studies (who do they serve?)
- LinkedIn company page (company size, growth)
- Cost: 2-4 hours per week

**Monthly competitive review**

Tracking:

| Competitor | Last 3 Losses | Strengths | Weaknesses | Our Strategy |
|---|---|---|---|---|
| CompetitorA | Price, features | Cheap, popular | No support | Differentiate on service |
| CompetitorB | Features | Feature-rich | Expensive | Offer alternative |
| CompetitorC | Timing | Established | Rigid | Emphasize flexibility |

Win/loss ratio by competitor:
| Competitor | Wins | Losses | Rate |
|---|---|---|---|
| CompetitorA | 2 | 5 | 28% win rate |
| CompetitorB | 3 | 2 | 60% win rate |
| CompetitorC | 4 | 1 | 80% win rate |

Strategy adjustments:
- CompetitorA: High loss rate (28%) → Product roadmap focus (features) + pricing review
- CompetitorB: Moderate loss rate (60%) → Maintain positioning, cost advantage
- CompetitorC: Low loss rate (80%) → Competitive advantage, maintain

Quarterly actions:
- Review win/loss trends
- Adjust positioning if needed
- Update competitive materials
- Brief sales team (stay aware)
- Adjust product roadmap (if patterns clear)

**Using win/loss for strategy**

Product roadmap:
- If 40% losses to feature X → add to roadmap (prioritize)
- If 5% losses to feature Y → deprioritize or skip
- Expected impact: Reduce loss rate 33% → 20-25%

Positioning:
- If winning on service → emphasize in marketing
- If losing on price → reposition as premium/quality
- If losing on features → emphasize integration/flexibility

Sales training:
- If losing to pricing objection → objection handling training
- If losing on features → demo strategy (emphasize strengths)
- If losing to competitor specific → competitive battle card training

Sales incentives:
- Add bonus for wins against specific competitor
- Add bonus for reducing losses in specific category
- Example: Beat CompetitorA in SMB segment → +2% commission

Annual impact:
- Win rate improvement: 65% → 75% (10% improvement)
- Lost ARR reduction: 20% → 10% of pipeline
- Market share gain: Overtake competitor with lower win rate
- Product improvements: Fewer feature gaps
- Cost: 10-20 hours per quarter → High ROI (£100K+ impact)

`
      }
    ],
    relatedSlugs: ["competitive-intelligence-and-market-monitoring", "sales-pipeline-management-and-forecasting", "product-roadmap-planning-and-prioritization", "customer-acquisition-playbooks-by-channel", "customer-acquisition-strategy-and-marketing-roi"],
    faq: [
      { q: "How do I run a win/loss program?", a: "Interview 10-20 customers/quarter within 1-2 months of decision. Questions: Why us (wins)? Why not us (losses)? Who was competition? Tracking: Categorize reasons (price, features, service). Analyze patterns (if 40% losses to feature X, add to roadmap). Impact: Inform product, positioning, sales strategy." },
      { q: "What should I do if we're losing lots of deals to a specific competitor?", a: "1. Analyze: Why are they winning? Features? Price? Service? 2. Root cause: Feature gap vs price issue vs positioning? 3. Strategy: Match/beat them on weakness (if features, add feature; if price, adjust pricing; if service, improve support). 4. Track: Monitor win rate change quarterly." },
      { q: "How can win/loss data improve my business strategy?", a: "Product: Add most-missed features to roadmap (reduce losses). Pricing: Adjust if losing to price (40% losses). Positioning: Emphasize wins (if winning on service, market that). Sales: Train on objections (why do we lose to specific objections?). Expected: Win rate improvement 5-10% (significant ARR impact)." }
    ],
    videoUrl: ""
  }
];

export default batch296Articles;