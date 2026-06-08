import { AcademyArticle } from "@/types/academy";

export const batch300Articles: AcademyArticle[] = [
  {
    slug: "self-service-onboarding-design-and-optimization",
    title: "Self-Service Onboarding Design and Optimization: First Value in Minutes",
    description: "Master onboarding UX. Streamline setup, reduce friction, drive early engagement.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["onboarding", "user onboarding", "onboarding flow", "product setup", "first-time user experience"],
    keyTakeaways: [
      "Onboarding goals: Get user to aha moment (first value) in <1 day ideally. Aha moment = user realizes product value for them. Cost: Design time (2-4 weeks for great onboarding), hosting. Benefit: Higher activation rate (% who complete setup), faster conversion (reach value faster = convert faster), better retention (immediate value = less churn). Example: Onboarding time 30 min → 5 min = activation rate 40% → 70% = 30% improvement.",
      "Best practices: (1) Streamline to critical path (3-5 essential steps, cut non-essentials), (2) Smart defaults (pre-fill common configs, skip decisions), (3) Guided tours (show where things are), (4) Progress indication (show % done), (5) Skip option (allow experts to bypass), (6) Early value (show data/results early, not at end). Cost: 2-4 weeks design + build. Benefit: 50-100% activation improvement.",
      "Measurement and iteration: Track completion rate (% completing each step), time per step (identify slowdowns), drop-off (where do people quit?), post-onboarding engagement (do they use product?). Test variations (sequential flow vs. parallel, skip option vs. required). Cost: Analytics setup, testing iteration time. Benefit: Compound effect (each optimization 10% = multiple stacked = 50%+ total improvement)."
    ],
    content: [
      {
        heading: "Building an Effective Self-Service Onboarding Flow",
        body: `Designing the first-time user experience.

**Onboarding fundamentals**

Goals:
1. Setup (user configures product for them)
2. First value (user sees initial results/benefit)
3. Engagement (user wants to return, use regularly)
4. Conversion (user decides product is valuable, upgrades)

Timeline:
- Ideal: Aha moment in <1 day (faster = better)
- Acceptable: <7 days
- Problem: >14 days (too long, user forgets)

Example user journey:

Day 1:
- Signup (2 min) → First login
- Onboarding start (5 min) → Setup begins
- Connect data (10 min) → First data loaded
- See dashboard (5 min) → Aha moment! (first value)
- Total: 22 minutes to value

vs. Poor onboarding:

Day 1:
- Signup → Login
- 15-step setup wizard (45 min) → Tedious
- Still not seeing data (wait for processing) → Frustration
- Day 2: Come back, still confused
- Total: 2+ days, might not return

Impact:
- Good onboarding: 70% activation, 5% conversion
- Poor onboarding: 30% activation, 1% conversion
- Better: 140% more activations, 500% more conversions

**Designing the critical path**

Step 1: Identify essential actions
- What's minimum needed for user to see value?
- Example SaaS: (1) Connect data, (2) Select metrics, (3) View report = value achieved

Remove non-essentials:
- Company details (can fill later)
- Invitation of team members (can skip, add solo)
- Settings/preferences (use smart defaults)

Result: 3-5 essential steps (cut from 15 steps)

Step 2: Simplify each step
- Before: "Which data source? We support 50+ sources"
  - User paralyzed (too many choices)
  - After: "We detected your email provider. Connect Gmail? [Yes/No]"
  - User clicks (2 seconds)

- Before: "Enter your company revenue, growth rate, ACV, unit economics"
  - User thinks (5 min)
  - After: Smart defaults, "Edit if needed"
  - User skips (10 sec) or tweaks (1 min)

Step 3: Smart defaults
- Detect context (company size from signup?)
- Pre-fill common values (default metrics for their industry?)
- Show results immediately (don't wait for user)
- Let user edit (expert path)

Example progression:

Rigid approach:
1. "Select 5 metrics you want to track" (user paralyzed, 5 min)
2. "Configure 10 settings" (user confused, 10 min)
3. "Finally, see results" (user fatigued, might leave)
Total: 15 min, 40% completion

Smart defaults approach:
1. "Here are metrics for SaaS" (auto-selected, 0 min)
2. "Review settings" (already done, skip option, 1 min or skip)
3. "See your dashboard" (immediate value, 1 min)
Total: 2 min, 80% completion

**Onboarding UI patterns**

Modal/wizard (guided step-by-step):
- Pros: Clear progression, can't miss steps
- Cons: Feels restrictive, can't explore
- Best for: Complex products, first-time only

Sidebar checklist (show progress, allow exploration):
- Pros: User can explore freely, see progress
- Cons: Might forget steps, get lost
- Best for: Medium complexity, guided but flexible

In-app guides (contextual, point-to-place):
- Pros: Non-intrusive, shows exactly where things are
- Cons: Easy to miss, scattered learning
- Best for: Simple products, specific features

Progressive disclosure (reveal complexity over time):
- Pros: Simple start, advanced features available later
- Cons: User might not know features exist
- Best for: Feature-rich products, staggered learning

Recommended: Sidebar checklist + in-app guides (hybrid)
- Start with essential steps (visible checklist)
- Let user explore (not locked)
- Show contextual help (point-to-place)
- Skip available (expert path)

**Example onboarding flow**

Product: Revenue analytics SaaS

Step 1: "Connect your data" (3 min)
- Detect email provider
- "Connect Gmail? [Yes/No]"
- System pulls calendar/email data
- Result: Data connected ✓

Step 2: "Select your metrics" (2 min)
- Auto-suggest metrics for SaaS (ARR, churn, NRR)
- Show descriptions ("Net Revenue Retention: expansion revenue")
- "Use suggested? [Yes/Customize]"
- Result: Metrics selected ✓

Step 3: "View your dashboard" (1 min)
- Auto-generated dashboard appears
- Show current month data
- "Your metrics: ARR £5M, Churn 2%, NRR 115%"
- Result: First value shown ✓

Step 4: "Next steps" (optional)
- "Invite team members"
- "Set up alerts"
- "Connect to Slack"
- Non-blocking, user can skip

Total time: 6 minutes to value
Completion: 80% (vs. 40% with old 15-step flow)

**Measuring onboarding effectiveness**

Metrics to track:

| Metric | Calc | Target | Current |
|---|---|---|---|
| Signup to onboarding | % starting | >80% | 75% |
| Step 1 completion | % completing | >90% | 85% |
| Step 2 completion | % completing | >85% | 70% |
| Step 3 completion | % completing | >80% | 60% |
| Overall completion | % finishing | >75% | 45% |
| Time to completion | Average min | <10 min | 18 min |

Insights:
- Step 2 has biggest drop (70% vs 85% target) = biggest issue
- Overall completion below target (45% vs 75%)
- Time too long (18 min vs 10 min target)

Actions:
1. Analyze step 2 (which part is hard?)
2. Simplify or add smart defaults (reduce time + friction)
3. A/B test (current vs. simplified)
4. Measure improvement (target 70% completion)

Drop-off analysis:

| Step | Start | Complete | Drop | Issue |
|---|---|---|---|---|
| 1 (data connect) | 100 | 85 | 15% | Hard to connect? Unclear? |
| 2 (metrics) | 85 | 70 | 15% | Too many choices? Confusing? |
| 3 (dashboard) | 70 | 60 | 10% | Takes too long to load? Not clear? |
| 4 (next steps) | 60 | 45 | 15% | Too many options? Unclear value? |

Action plan:
- Step 1: Simplify connection flow
- Step 2: Auto-select, show "Customize if needed"
- Step 3: Optimize dashboard load time
- Step 4: Make skippable (non-blocking)

Post-onboarding engagement:

| Cohort | Completed onboarding | DAU 7 days | Converted | Notes |
|---|---|---|---|---|
| A (old flow) | 45% | 40% | 2% | Poor engagement |
| B (new flow) | 70% | 65% | 5% | Better |

Correlation: Completion → engagement (strong)
Action: Prioritize fixing onboarding (drives downstream metrics)

**A/B testing onboarding**

Test 1: Sequential vs. parallel

Sequential (current):
- Step 1, then step 2, then step 3

Parallel (alternative):
- All 3 steps visible, user chooses order

Result:
- Sequential: 60% completion, 18 min average
- Parallel: 65% completion, 12 min average
- Winner: Parallel (faster, higher completion)

Test 2: Smart defaults vs. open choice

Smart defaults:
- "We recommend X, Y, Z" (pre-selected)

Open choice:
- "Select from A-Z" (user chooses)

Result:
- Smart: 80% completion, 5 min
- Open: 50% completion, 15 min
- Winner: Smart defaults (significantly better)

Test 3: Skip option

With skip:
- "Skip this step [Link]"

Without skip:
- Required step

Result:
- With skip: 70% completion overall, 65% complete all
- Without: 60% completion, 55% complete all
- Winner: Skip option available (gives control, increases completion)

**Iteration roadmap**

Month 1: Diagnose
- Map current flow (every step)
- Measure each step (completion, time)
- Identify biggest drop-offs
- Survey users ("What was confusing?")

Month 2: Redesign
- Remove non-essentials (cut 15 → 5 steps)
- Add smart defaults (reduce decisions)
- Simplify language (clearer labels)
- Test with 5 users (informal usability)

Month 3: A/B test
- Launch new flow (50% users)
- Measure metrics (completion, time, conversion)
- Analyze results (what worked?)
- Roll out winner (100%)

Expected impact:
- Month 1 (current): 45% completion, 18 min, 2% conversion
- Month 2 (redesigned): 65% completion, 8 min, 4% conversion
- Month 3 (optimized): 75% completion, 5 min, 6% conversion
- Total improvement: 67% more users to value, 3x faster to value, 3x better conversion

**Common onboarding mistakes**

Mistake: Everything is required
- Fix: Only critical path required, rest optional

Mistake: Too many decisions
- Fix: Smart defaults, "Edit if needed"

Mistake: No skip option
- Fix: Allow experts to skip

Mistake: Waiting for data (slow APIs)
- Fix: Show placeholder/sample data while loading

Mistake: No progress indication
- Fix: Show "Step 1 of 3" and checkmarks

Mistake: Expecting all users same path
- Fix: Personalize (SMB vs. Enterprise, first-time vs. experienced)

Mistake: Onboarding ends, no follow-up
- Fix: Email sequence, tips, feature announcements post-onboarding

`
      }
    ],
    relatedSlugs: ["product-market-fit-assessment-and-validation", "free-trial-conversion-optimization", "feature-adoption-and-usage-metrics", "customer-success-metrics-and-program-design", "metrics-dashboard-design-kpi-tracking"],
    faq: [
      { q: "How long should onboarding take?", a: "Ideal: <1 day to first value (aha moment). Realistic: 5-30 min for setup, then immediate value. Benchmark: Good SaaS 5-15 min to aha moment. Poor: >30 min (too long, user forgets). Measure: Time per step + completion rate. Improve: Reduce steps, add smart defaults, show value early." },
      { q: "What's the critical path for onboarding?", a: "Only 3-5 essential steps: (1) Signup, (2) Connect/configure minimum, (3) Show first value/result. Everything else (team invite, preferences, settings) is nice-to-have and should be optional or skippable. Test: Current flow takes 15+ steps? Cut to 5. Remove: Things that don't help user see immediate value." },
      { q: "How do I improve onboarding completion?", a: "Measure current: % completing each step, where do people drop off? Then: Simplify steps, add smart defaults, show progress, make skip available. A/B test: Old vs. new flow. Common wins: Reduce steps 15→5 (30% completion gain), add smart defaults (20% gain), show value early (25% gain). Compound effect: 75%+ completion possible." }
    ],
    videoUrl: ""
  }
];

export default batch300Articles;