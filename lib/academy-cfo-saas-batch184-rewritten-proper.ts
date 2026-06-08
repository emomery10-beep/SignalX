import { AcademyArticle } from "@/types/academy";

export const batch184Articles: AcademyArticle[] = [
  {
    slug: "product-roadmap-planning-and-prioritization",
    title: "Product Roadmap Planning and Prioritization: Building the Right Product",
    description: "Master product planning. Prioritize features, plan roadmap, and balance growth with stability.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: [
      "product roadmap",
      "feature prioritization",
      "product strategy",
      "roadmap planning",
      "feature requests",
      "product decisions",
      "prioritization framework",
      "product development",
      "feature impact",
      "roadmap communication"
    ],
    keyTakeaways: [
      "Prioritization framework: Impact × Effort. Example: Feature improves churn 1%, takes 2 weeks = (£100K LTV impact) / 2 weeks = £50K value per week. vs Feature adds £5K revenue potential, takes 2 weeks = £2.5K value per week. First feature 20x higher ROI. Always prioritize (impact / effort).",
      "Roadmap categories: (1) Must-have (bugs, performance, critical features for existing customers). (2) Growth (new features attracting new customers). (3) Efficiency (technical debt, making team faster). Balance: 50% must-have + bugs, 30% growth, 20% efficiency. Avoid: Only growth (product becomes unstable). Only maintenance (falls behind competitors).",
      "Communication: Share roadmap quarterly, transparent about why (trade-offs). Example: \"We're delaying feature X (customers requested) because churn rising (must-have)\" > hiding decisions. Involve customers: Feature requests from customers, gather feedback, build together. Shows customers you listen."
    ],
    content: [
      {
        heading: "Prioritization Frameworks",
        body: `Methods to decide what to build.

**Impact vs Effort Matrix**

Plot features: Y-axis = Impact (revenue, churn reduction), X-axis = Effort (time to build)

High Impact, Low Effort (Build First):
- Fix critical bug (high impact, 1 week effort) → £100K churn saved
- Improve onboarding (high impact on retention, 2 weeks) → 1% churn save = £50K

High Impact, High Effort (Plan):
- Build new product line (£1M new revenue, 6 months)
- Enterprise feature (close £500K deal, 2 months)
- Plan for next quarter, not now

Low Impact, Low Effort (Nice to have):
- UI polish (week effort, minor satisfaction improvement)
- Add new integration (2 weeks, few customers want)

Low Impact, High Effort (Avoid):
- Rebuild in new language (6 months, no business value)
- Complex feature nobody wants (3 months, zero adoption)

Example scoring:

| Feature | Impact (Revenue/Churn Save) | Effort (Weeks) | Impact/Effort Ratio |
|---------|---|---|---|
| Bug fix | £100K (churn) | 1 | 100x |
| Onboarding | £50K (churn) | 2 | 25x |
| New integration | £10K | 2 | 5x |
| Growth feature | £200K (new customers) | 8 | 25x |

Priority: Bug fix (100x) → Growth feature (25x) → Onboarding (25x) → Integration (5x)

**RICE Scoring**

Reach × Impact × Confidence / Effort = Score

Reach: How many customers/users affected?
Impact: How much value per customer?
Confidence: How sure are you? (%)
Effort: Time to build (weeks)

Example:

Feature A (Bug fix):
- Reach: 1,000 customers (affects everyone eventually)
- Impact: 5 (severity, churn risk)
- Confidence: 95% (confirmed by support)
- Effort: 1 week
- Score: (1,000 × 5 × 0.95) / 1 = 4,750

Feature B (Growth feature):
- Reach: 10,000 new customers (potential)
- Impact: 3 (moderate improvement in adoption)
- Confidence: 40% (we think it helps)
- Effort: 8 weeks
- Score: (10,000 × 3 × 0.4) / 8 = 1,500

Result: Feature A (bug fix) scores higher despite smaller reach (higher confidence, lower effort).

`
      },
      {
        heading: "Roadmap Planning",
        body: `Building quarterly and annual plans.

**Roadmap Categories**

Must-have (50%):
- Bug fixes (stability)
- Performance improvements (speed)
- Security/compliance (required)
- Technical debt (making team productive)
- Retention features (stop churn)

Growth (30%):
- New features (attract new customers)
- Competitive parity (match competitors)
- New integrations (customer needs)

Efficiency (20%):
- Code quality improvements
- Infrastructure optimization
- Developer experience (make team faster)
- Process improvements

Balance: This mix prevents stagnation (only maintenance) and instability (only new features).

**Quarterly Roadmap Example**

Q1 (12 weeks):
- Must-have (6 weeks): Fix critical bugs (3), performance (2), security audit (1)
- Growth (3.6 weeks): New integrations (2), competitive feature (1.6)
- Efficiency (2.4 weeks): Refactor database (1.5), improve deployment (0.9)

Q2-Q4: Repeat based on priorities.

**Capacity Planning**

Team bandwidth:
- Total: 12 weeks × team size
- Example: 5 engineers × 12 weeks = 60 engineer-weeks

Allocate:
- Must-have: 30 weeks (50%)
- Growth: 18 weeks (30%)
- Efficiency: 12 weeks (20%)

Track actual vs planned:
- If bugs exceed 30%, shift from growth to must-have

`
      },
      {
        heading: "Feature Requests and Customer Input",
        body: `Balancing customer needs with strategic priorities.

**Feature Request Process**

Collect:
- Sales: Customers requesting (buying signal)
- Support: Customers struggling (pain point)
- Usage: Feature data (actual needs)
- Surveys: Customer interviews (confirmation)

Prioritize:
- How many customers want? (reach)
- How much would it improve retention? (impact)
- Confidence in addressing? (certainty)
- Effort to build? (resources)

Act:
- Top requests: In roadmap
- Medium requests: Next quarter planning
- Low requests: Backlog (revisit next year)

Example:
- 500 customers request feature X (high reach)
- Impacts 10% of churn reduction (high impact)
- Need 4 weeks to build (medium effort)
- Score: High priority → Q2 roadmap

Communication:
- "We heard your request for X"
- "Adding to Q2 roadmap"
- "Timeline: Q2"

**Competitive Monitoring**

Track competitor features:
- Quarterly check (what did competitors launch?)
- Assess: Do we need parity?
- Decide: Copy, improve, or differentiate

Example:
- Competitor launched feature X
- 100 customers asked for it (pressure)
- But our differentiation is Y (don't copy)
- Decision: Build our own version of X, better than theirs
- Result: Q3 roadmap

Balance: Don't just copy competitors. Differentiate where possible.

`
      }
    ],
    relatedSlugs: [
      "competitive-analysis-and-market-positioning",
      "product-market-fit-and-validation",
      "metrics-dashboard-design-kpi-tracking",
      "unit-economics-ltv-cac-payback",
      "customer-success-metrics-and-program-design"
    ],
    faq: [
      {
        q: "How do I prioritize features?",
        a: "Use Impact/Effort matrix: (Business value) / (Time to build). Example: £100K churn save / 1 week = 100x ROI. vs £5K revenue / 2 weeks = 2.5x ROI. Always prioritize high ROI features first. Use RICE scoring: (Reach × Impact × Confidence) / Effort."
      },
      {
        q: "What should my roadmap mix be?",
        a: "50% must-have (bugs, stability, retention), 30% growth (new features, competitive), 20% efficiency (technical debt, performance). Don't go all growth (product becomes unstable). Don't go all maintenance (falls behind). Balance keeps product healthy and competitive."
      },
      {
        q: "How do I handle customer feature requests?",
        a: "Collect from: Sales (buying signals), support (pain points), usage data (actual needs), surveys. Prioritize: Impact × Reach / Effort. Top requests: Roadmap. Medium: Next quarter. Low: Backlog. Communicate transparently: Why you're building X, timeline, trade-offs. Shows customers you listen."
      },
      {
        q: "How do I plan capacity?",
        a: "Total engineer-weeks: Team size × weeks per quarter. Allocate: 50% must-have, 30% growth, 20% efficiency. If bugs exceed budget, shift from growth to must-have. Track actual vs plan monthly. Adjust roadmap if capacity changes (hire, leave, priorities shift)."
      }
    ],
    videoUrl: ""
  }
];

export default batch184Articles;
