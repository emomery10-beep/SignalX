import { AcademyArticle } from "@/types/academy";

export const batch358Articles: AcademyArticle[] = [
  {
    slug: "sales-forecasting-and-pipeline-management",
    title: "Sales Forecasting and Pipeline Management: Predicting Revenue Accurately",
    description: "Master sales forecasting. Build accurate pipeline, forecast revenue, track deal progression.",
    category: "AskBiz Tutorials",
    categorySlug: "askbiz-tutorials",
    difficulty: "Intermediate",
    readTime: 7,
    keywords: ["sales forecasting", "pipeline management", "revenue forecasting", "sales pipeline", "deal tracking"],
    keyTakeaways: [
      "Sales pipeline: Track deals (prospect → close). Stages: (1) Outreach (contacted), (2) Discovery (meeting scheduled), (3) Demo (product shown), (4) Proposal (pricing shared), (5) Negotiation (terms discussed), (6) Close (signed). Each stage has win % (outreach 5%, demo 25%, proposal 50%, close 90%+). Cost: CRM tool, sales manager time. ROI: High (accurate revenue forecasts, identify bottlenecks).",
      "Forecasting: Use pipeline * win % by stage. Example: £500K in proposal stage (50% win) = £250K expected. Add committed deals (90%+) for conservative forecast. Compare to target (on track?). Update monthly (which deals moving, which stuck?). Adjust win % based on data (demo usually 20%, but your product 30% = adjust). Benefit: Know revenue trajectory (make hiring/spending decisions).",
      "Pipeline hygiene: Clean data (no zombie deals), realistic stages (don't inflate), win % by stage tracked. Typical issue: Sales reps move deals through pipeline too fast (false confidence) or too slow (pessimism). Solution: Management review (are deals real?), stage-specific criteria (demo means customer saw product), track actual close rates. Cost: Weekly pipeline review. ROI: Accurate forecasts (no revenue surprises)."
    ],
    content: [
      {
        heading: "Building and Managing Sales Pipeline",
        body: `Creating systems for accurate revenue forecasting and pipeline visibility.

**Sales pipeline fundamentals**

Pipeline definition:
- All prospects at various stages of sales process
- Tracked in CRM (Salesforce, HubSpot, Pipedrive)
- Updated weekly by sales team
- Used to forecast revenue

Why pipeline matters:
- Predict revenue (is forecast achievable?)
- Identify bottlenecks (where deals get stuck)
- Track sales rep performance (who closes best?)
- Resource planning (hiring, spending decisions based on forecast)

Sales stages:

Stage 1: Outreach
- Activity: Sales development rep (SDR) contacts prospect
- Channel: Email, cold call, LinkedIn
- Duration: Variable
- Win %: 5% (most prospects don't engage)
- Typical: 1000 outreach → 50 meeting qualified

Stage 2: Discovery
- Activity: First meeting scheduled (call, video)
- Purpose: Understand prospect needs
- Duration: 1-2 weeks from outreach
- Win %: 10% (many prospects aren't fit)
- Typical: 50 discovery → 5 qualified opportunities

Stage 3: Demo/Product evaluation
- Activity: Product shown, prospect evaluates
- Duration: 2-4 weeks
- Win %: 25% (good fit, but alternatives)
- Typical: 5 demos → 1-2 proposals

Stage 4: Proposal
- Activity: Pricing shared, contract discussed
- Duration: 1-2 weeks
- Win %: 50% (serious prospects, negotiating)
- Typical: 2 proposals → 1 negotiation

Stage 5: Negotiation
- Activity: Terms discussed, final approval
- Duration: 2-4 weeks (contract review, approvals)
- Win %: 75% (usually close unless legal blocks)
- Typical: 1 negotiation → 0.75 close

Stage 6: Closed (won/lost)
- Activity: Signed or rejected
- Win %: 100% (or 0%)
- Typical: Record outcome

**Pipeline forecasting**

Basic forecast equation:

Revenue forecast = Sum(deal value × win % at stage)

Example:

| Stage | Deals | Avg value | Total value | Win % | Expected revenue |
|---|---|---|---|---|---|
| Outreach | 100 | £5K | £500K | 5% | £25K |
| Discovery | 20 | £15K | £300K | 10% | £30K |
| Demo | 5 | £30K | £150K | 25% | £37.5K |
| Proposal | 2 | £50K | £100K | 50% | £50K |
| Negotiation | 1 | £80K | £80K | 75% | £60K |
| **Total forecast** | | | | | **£202.5K** |

Target for month: £150K
Forecast: £202.5K
Status: On track (forecast exceeds target by 35%)

Adjusting win %:

Industry standard:
- Demo: 20% win
- Proposal: 50% win
- Negotiation: 75% win

Your data (track actual):
- Q2: 5 demos → 2 close = 40% (vs industry 20%)
- Q2: 2 proposals → 1 close = 50% (matches industry)

Adjustment: Use 40% for demo (your product is better)

Conservative forecast:
- Only count negotiation stage (75%+ win)
- Plus committed deals (customer said yes)
- Good for board reporting (underpromise, overdeliver)

Example conservative:
- Negotiation: £80K × 75% = £60K
- Committed: £50K × 100% = £50K
- Total conservative: £110K (vs total £202.5K)

Report both:
- Board: Conservative £110K (safe forecast)
- Leadership: Full pipeline £202.5K (upside scenario)

**Pipeline management systems**

CRM system:

Essential fields:
- Company name
- Contact person
- Deal size (£)
- Stage (dropdown: Outreach → Discovery → Demo → Proposal → Negotiation → Closed)
- Win probability (auto-calculated or manual)
- Expected close date
- Notes (what stage? Any blockers?)
- Sales rep owner
- Last activity date

Weekly review:

Sales manager review:
- Which deals moved (updated stage)?
- Which deals are stuck (no activity for 2 weeks)?
- New deals added?
- Any deals lost (record why)?

Example report:
- 10 new deals in outreach
- 3 deals moved from demo to proposal (good!)
- 1 deal stuck in discovery (call scheduled to unblock)
- 1 deal lost (budget approved, competitor cheaper)

Velocity analysis:

Track how long deals stay in each stage:

| Stage | Avg duration | Target | Status |
|---|---|---|---|
| Outreach | 2 weeks | 1 week | Slow (follow up more) |
| Discovery | 3 weeks | 2 weeks | Slow (demo faster) |
| Demo | 4 weeks | 2 weeks | Slow (demo decision slower) |
| Proposal | 2 weeks | 1 week | OK |
| Negotiation | 3 weeks | 2 weeks | Slow (legal delays) |

**Pipeline hygiene and accuracy**

Common pipeline sins:

Sin 1: Inflated deals
- Problem: Sales rep keeps deal in pipeline for months (not actually qualifying)
- Result: Forecast is wrong (promises revenue that won't happen)
- Fix: Stage-specific criteria (demo = customer viewed product, proposal = pricing provided)
- Verification: Manager asks "Did you demo last week? Do they know pricing?"

Sin 2: Zombie deals
- Problem: Deals stuck for 3+ months (no activity)
- Result: Inflates pipeline, false optimism
- Fix: Archive old deals (move to "lost" if no activity in 30 days)
- Verification: Last activity date in CRM (automated alert if >30 days)

Sin 3: Deals in wrong stage
- Problem: Prospect in discovery but pricing discussed (actually in proposal stage)
- Result: Win % wrong, forecast off
- Fix: Clear stage definitions (must have X before moving)
- Verification: Manager review (spot-check 10% of deals)

Sin 4: No activity tracking
- Problem: Can't tell if deal is advancing or stuck
- Result: Can't diagnose bottlenecks
- Fix: Require activity notes ("Met with CTO, discussed integrations, next call Tuesday")
- Verification: All deals have activity dated this week

Stage-specific criteria:

Discovery stage entry:
- MUST: Meeting scheduled
- MUST: Contact name and title
- Fail check: "Sent email" alone doesn't count

Demo stage entry:
- MUST: Demo completed (date + attendees)
- MUST: Product feedback captured
- Fail check: "Scheduled demo" doesn't count (only completed)

Proposal stage entry:
- MUST: Pricing shared
- MUST: Contract shared or discussed
- Fail check: "Verbally discussed price" without follow-up email

Negotiation stage entry:
- MUST: Contract sent to prospect
- MUST: Legal/procurement review in progress
- Fail check: "Waiting for legal" without formal submission

**Common forecasting mistakes**

Mistake 1: Trust sales reps without verification
- Problem: Sales rep says 90% close, but never met with decision maker
- Fix: Manager spot-checks deals (ask about decision makers, timeline, competition)
- Impact: More accurate forecast

Mistake 2: Same win % for all reps
- Problem: Rep A closes 70% of deals, Rep B closes 30%, but both say 50%
- Fix: Track close rates by rep, use rep-specific win % for forecast
- Impact: More accurate forecast, identify training needs

Mistake 3: Ignore deal velocity
- Problem: Deal in proposal for 6 months
- Result: Forecast says close this month, but won't
- Fix: Factor in velocity (proposal deals close in 2 weeks on average, so 6-month deal is stalled)
- Impact: Realistic close dates

Mistake 4: Don't update forecast monthly
- Problem: Forecast from January, now June, no update
- Result: Board surprised by revenue miss
- Fix: Monthly pipeline review (update forecast each month)
- Impact: Leadership prepared for reality

Mistake 5: No feedback loop
- Problem: Forecast £200K, actual £100K (what happened?)
- Result: Don't learn, repeat mistake next month
- Fix: Track deals lost and why (competitor, budget, decision delayed)
- Impact: Improve process (if losing to competitor, adjust positioning)

`
      }
    ],
    relatedSlugs: ["customer-acquisition-strategy-and-marketing-roi", "metrics-dashboard-design-kpi-tracking", "financial-planning-and-budgeting", "financial-modeling-and-forecasting-techniques", "annual-planning-and-strategy-execution"],
    faq: [
      { q: "How do I build an accurate sales forecast?", a: "Use pipeline data: Sum all deals by stage × win % for each stage. Example: £100K in demo (25% win) + £50K in proposal (50% win) = £37.5K + £25K = £62.5K forecast. Adjust win % based on actual data (track close rates by stage). Conservative forecast: Count only negotiation+ deals + committed. Update monthly as deals move." },
      { q: "What are the sales pipeline stages?", a: "Typical: (1) Outreach (5% win), (2) Discovery/qualified (10% win), (3) Demo (20-25% win), (4) Proposal (50% win), (5) Negotiation (75% win), (6) Closed. Each stage has entry criteria (discovery = meeting scheduled, demo = product shown, proposal = pricing shared). Update weekly in CRM." },
      { q: "How do I maintain pipeline hygiene?", a: "Set stage-specific criteria (no moving deals without proof). Remove zombie deals (>30 days no activity). Verify deals are real (manager spot-checks). Track activity (what happened this week?). Review closed deals monthly (why did we lose? What did we win?). Use CRM to track dates and last activity automatically." }
    ],
    videoUrl: ""
  }
];

export default batch358Articles;