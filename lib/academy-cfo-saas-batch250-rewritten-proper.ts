import { AcademyArticle } from "@/types/academy";

export const batch250Articles: AcademyArticle[] = [
  {
    slug: "building-sustainable-company-culture-and-values",
    title: "Building Sustainable Company Culture and Values: Creating Company Identity",
    description: "Master culture. Define values, hire for fit, measure culture impact.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["culture", "company values", "culture building", "values", "team culture", "cultural fit", "employee engagement", "organizational culture"],
    keyTakeaways: [
      "Culture fundamentals: Culture = how you make decisions, treat people, solve problems. Explicit culture (written values) vs implicit (how people actually behave). Strong culture: Everyone aligned on what's important (speed, customer obsession, ownership, excellence). Hiring: Culture fit matters as much as skill (can teach skills, hard to change values). Example: Value speed = hire people who move fast, make decisions. Value customer obsession = hire people who talk to customers. Cost: Culture-building takes time (annual offsites, value alignment, hiring discipline). Benefit: Low turnover (people stay longer), better decisions (aligned), higher engagement (eNPS 50+ = strong culture). Impact on metrics: High culture → low churn (people want to stay), high NRR (aligned on customer value), high productivity (less politics, clearer decisions).",
      "Value definition: Identify 3-5 core values (customer obsession, bias for action, ownership, excellence, learning). Define each (what does ownership mean to us? = make decisions, own outcomes, don't blame). Example: Google (innovation, focus, integrity). Salesforce (trust, customer success, innovation, equality). Airbnb (belonging, creativity, integrity). For SaaS: (customer obsession, speed, ownership, data-driven, learning). Cost: Offsites (£10-20K/year), HR time, discipline. Benefit: Alignment (everyone knows what matters), hiring (cultural fit screen), retention (people aligned, want to stay).",
      "Measuring culture: eNPS (employee net promoter score, -100 to 100, target 50+). Pulse surveys (monthly, 5 questions: engagement, growth, alignment, fairness, likelihood to recommend). Turnover (track by department, target <10% annually). Glassdoor rating (reflects culture externally). Link to metrics: High eNPS → low churn, high retention, high NRR. Cost: Surveys (free tools like Lattice, Officevibe), remediation varies. Benefit: Culture drives engagement → engagement drives retention → retention drives unit economics. 10% lower turnover = saves £500K+ on recruiting + productivity loss."
    ],
    content: [
      {
        heading: "Building a Strong Company Culture",
        body: `Creating alignment and engagement.

**Defining company values**

Core values (3-5 essential principles):

Example SaaS values:
1. Customer obsession: Make decisions thinking long-term customer value
   - Decision rule: When uncertain, choose customer benefit over company convenience
   - Example: 10% of customers want feature → prioritize if helps majority

2. Bias for action: Move fast, decide with 70% info, learn by doing
   - Decision rule: Waiting for perfect data costs more than learning
   - Example: Launch feature to 10% first, measure, expand

3. Ownership: Own outcomes, don't blame
   - Decision rule: Take responsibility for results (succeed or learn)
   - Example: If miss target, ask "what could I have done differently?"

4. Data-driven: Decisions based on data, not opinions
   - Decision rule: Gut feel isn't enough, need data to confirm
   - Example: Feature requests need usage data to prioritize

5. Learning: Continuous improvement, admit mistakes, growth mindset
   - Decision rule: Feedback is gift, failure is learning opportunity
   - Example: Code review finds bug → thank reviewer, fix, improve

**Cultural hiring**

Assess cultural fit:

Interview questions:
- "Tell me about a time you owned a project and it failed. What did you learn?"
  - Look for: Accountability, learning, honesty
- "How do you approach decisions with incomplete information?"
  - Look for: Bias for action, comfort with ambiguity
- "Describe your relationship with data. How do you use it in decisions?"
  - Look for: Data-driven mindset, curiosity

Red flags:
- Blames others for failures (lack of ownership)
- Slow to decide, perfectionist (not bias for action)
- Ignores customer feedback (not customer-obsessed)

Hiring rubric:
| Value | Interview question | Green (hire) | Red (don't hire) |
|---|---|---|---|
| Ownership | Failure story | Took accountability | Blamed others |
| Action bias | Decision process | Moved with incomplete info | Waited for perfect data |
| Customer | Customer interaction | Regularly talks to customers | Doesn't know customer needs |

**Measuring culture**

eNPS (Employee Net Promoter Score):
- Question: "How likely to recommend company as place to work?" (0-10 scale)
- Calculation: % promoters (9-10) - % detractors (0-6)
- Target: 50+ (strong culture), 30-50 (okay), <30 (problem)

Example:
- 50 employees survey
- 30 promoters (60%)
- 10 detractors (20%)
- eNPS: 60% - 20% = 40 (good)

Pulse survey (monthly, 5 questions):
1. "Do you feel engaged?" (1-5)
2. "Do you see growth opportunities?" (1-5)
3. "Are decisions aligned with our values?" (1-5)
4. "Do you feel fairly compensated?" (1-5)
5. "Would you recommend us as employer?" (1-5)

Track trends:
- If engagement dropping, diagnose why (survey comments)
- If growth perception low, plan career paths
- If values misalignment, reinforce culture

Turnover:
- Target: <10% annual (healthy)
- Track by department (is one team problem?)
- Exit interviews: Why leaving? (learn patterns)

**Connecting culture to metrics**

Impact on unit economics:
- Strong culture → higher engagement
- Higher engagement → lower turnover
- Lower turnover → lower recruiting cost + better productivity
- Better productivity → lower CAC (more efficient sales), higher NRR (more focused product)

Example:
- Turnover: 15% → 10% (5% improvement)
- 20-person team, £100K per person hiring cost = £100K savings
- Productivity: 10% improvement = 2 FTE (£200K value)
- Total: £300K value from culture improvement (very high ROI)

Culture impact on sales:
- Strong customer obsession culture → better product-market fit
- Better fit → higher retention (lower churn)
- Lower churn → higher LTV (25% improvement = £100K+ value)

`
      }
    ],
    relatedSlugs: ["organizational-structure-and-team-design", "hiring-and-talent-acquisition-strategy", "strategic-planning-and-quarterly-goal-setting"],
    faq: [
      { q: "What values should my company have?", a: "3-5 core values. Typical SaaS: customer obsession (decisions prioritize customer), bias for action (move fast, learn by doing), ownership (own outcomes), data-driven (decisions on data), learning (continuous improvement). Define each (what does it mean?). Use in hiring (cultural fit), decisions (which option aligns with values?), feedback (reinforce values)." },
      { q: "How do I measure culture?", a: "eNPS (employee net promoter score, target 50+). Pulse surveys (monthly, 5 questions). Turnover (target <10% annually). Glassdoor (reflects culture externally). Track trends: If eNPS dropping, diagnose (engagement survey, feedback). If turnover high, exit interviews (why leaving?)." },
      { q: "How does culture impact metrics?", a: "Strong culture → higher engagement → lower turnover (save £500K on recruiting + productivity). Engagement → better decisions (aligned on customer obsession, bias for action) → better product → higher retention (lower churn), higher NRR (more expansion). Total impact: 20% improvement in churn + NRR = £1M+ value for mid-size SaaS." }
    ],
    videoUrl: ""
  }
];

export default batch250Articles;