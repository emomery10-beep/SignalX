import { AcademyArticle } from "@/types/academy";
export const batch225Articles: AcademyArticle[] = [{ slug: "customer-feedback-loops-and-product-iteration", title: "Customer Feedback Loops and Product Iteration: Continuous Improvement Cycles", description: "Master feedback loops. Collect, analyze, iterate rapidly based on customer input.", category: "AskBiz Tutorials", categorySlug: "askbiz-tutorials", difficulty: "Intermediate", readTime: 7, keywords: ["feedback", "iteration", "customer feedback", "continuous improvement", "product cycle", "rapid iteration", "user research", "learning loops"], keyTakeaways: ["Feedback sources: Support (complaints = issues), surveys (NPS, CSAT, feature satisfaction), usage analytics (features adopted), interviews (deep dive), community (forums, Slack). Frequency: Weekly check-in (support trends), monthly analysis (aggregate patterns), quarterly deep dive (customer interviews). Example: Support gets 10 requests for feature X = high signal. NPS question \"Why?\" respondents mention feature X = confirms need.", "Iteration cycle: Hypothesis (\"If improve X, reduce churn 2%\") → Design (how to improve) → Build (1-2 week sprint) → Launch (limited rollout) → Measure (track impact) → Learn (did it work?). Cycle time: 2-3 weeks (hypothesis to launch). Velocity: Ship 4 iterations per quarter (12 annually). Wins: If 25% win, that's 3 improvements per quarter (high impact). ROI: Cost (dev time) vs benefit (improvement × LTV), usually 100x+ ROI.", "Feedback infrastructure: Tools (Canny, ProductBoard for organizing requests), dashboard (see top requests, track status), transparency (show customers what's being built and why). Culture: Product team reviews feedback weekly (builds customer empathy), ship updates (close the loop, \"You requested X, we shipped it\"). Benefit: Customers feel heard (NPS improves), product better aligned (less wasted effort on wrong features)."],
    content: [{ heading: "Building Effective Feedback Loops", body: `**Feedback collection**

Weekly check-ins:
- Support tickets (automated, email summary)
- Top issues: Common problems, frustrations
- Feature requests: What customers ask for
- Action: Escalate urgent issues, track trends

Monthly analysis:
- Aggregate feedback (all sources)
- Bucket by theme (feature X mentioned 15 times)
- Rank by frequency + impact (churn risk, CAC reduction, NPS improvement)
- Prioritize top 3 themes for product focus

Quarterly deep dives:
- Customer interviews (10-15 customers)
- Ask open-ended (\"What would make you happier?\")
- Uncover implicit needs (not just explicit requests)
- Validate themes from monthly analysis

**Iteration cycle**

Sprint structure (2 weeks):
1. Hypothesis (Monday): \"Improve onboarding → 5% conversion lift\"
2. Design (Tuesday-Wednesday): Wireframes, spec
3. Build (Thursday-Friday+): Implementation
4. QA (Monday): Testing, edge cases
5. Launch (Tuesday): Limited rollout (10% users)
6. Measure (Tuesday-Friday): Track metrics
7. Decide (Friday): Keep, iterate, or revert

**Feedback tool example (Canny)**

Track: Feature requests (customer input)
Prioritize: Voting system (customers vote on requests)
Update: Roadmap transparency (show when shipping)
Close loop: Announce \"you requested X, shipping now\"

Impact:
- Transparency (customers see requests being considered)
- Prioritization (vote shows true customer need)
- Engagement (customers feel heard)
- NPS improvement (feels like product built for them)

`}],
    relatedSlugs: ["customer-advisory-board-and-voice-of-customer", "product-roadmap-planning-and-prioritization", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How do I collect customer feedback?", a: "Sources: Support (issues/requests), surveys (NPS, satisfaction), usage (analytics), interviews (deep dive). Frequency: Weekly check (support trends), monthly aggregation, quarterly interviews. Track: Canny or ProductBoard (tool). Analyze: Bucket by theme, rank by frequency + impact." },
      { q: "What's a good iteration cycle?", a: "2-3 week cycle: Hypothesis → Design → Build (1-2 weeks) → Launch (limited) → Measure → Learn. Ship 4 cycles per quarter (12 improvements annually). Success rate: If 25% are wins = 3 improvements/quarter. ROI: Usually 100x+ (improvement × LTV)." }
    ],
    videoUrl: "" }];
export default batch225Articles;
