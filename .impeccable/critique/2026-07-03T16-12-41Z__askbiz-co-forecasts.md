---
target: askbiz.co/forecasts
total_score: 21
p0_count: 0
p1_count: 3
timestamp: 2026-07-03T16-12-41Z
slug: askbiz-co-forecasts
---
#### Design Health Score

No code changes detected in `app/(app)/forecasts/page.tsx` since the prior critique run (2026-07-03T16-08-01Z). Re-running the full assessment reproduces the identical result — findings below are carried forward unchanged, not re-derived.

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | `runForecast` gives spinner + text feedback; other async actions (compare, what-if, PDF) give none |
| 2 | Match System / Real World | 1 | Raw stats jargon (R², RMSE, "holdout fit") shown to a self-declared non-technical SME audience |
| 3 | User Control and Freedom | 3 | Tabs/scenarios freely switchable; no explicit "reset config" affordance |
| 4 | Consistency and Standards | 1 | Live palette contradicts the documented DESIGN.md system entirely |
| 5 | Error Prevention | 3 | Run button disabled until valid; proactive text-column warning |
| 6 | Recognition Rather Than Recall | 3 | Labels visible; emoji-prefixed dataset options are the weak spot |
| 7 | Flexibility and Efficiency | 2 | No shortcuts, no saved config; compare/overlay are decent power features |
| 8 | Aesthetic and Minimalist Design | 2 | 6 KPI cards + 5-6 stacked sidebar panels + 4 competing accent colors |
| 9 | Error Recovery | 1 | Several async actions swallow errors in empty `catch {}` blocks |
| 10 | Help and Documentation | 2 | Method Guide is good; no glossary for R²/RMSE |
| **Total** | | **21/40** | **Acceptable — unchanged, no fixes applied yet** |

#### Anti-Patterns Verdict

Unchanged from prior run: hardcoded Chart.js hex colors bypassing CSS tokens, four equal-weight saturated accents, emoji used as functional icons (🏪🛒📄🎯📈〰️🔄⚡).

#### Priority Issues

Unchanged — carried forward from the 2026-07-03T16-08-01Z run:
1. [P1] Silent failure on Compare/What-If/PDF/Stats (`page.tsx:262,279,355,363,370`)
2. [P1] Raw statistical jargon (R², RMSE, holdout fit) shown to a non-technical audience
3. [P1] TREND headline (+2285.8%) shown at full confidence despite R²=0.00 and a high-volatility warning
4. [P2] Live color system contradicts documented DESIGN.md (agreed direction: realign to DESIGN.md, dark theme is not intentional)
5. [P2] Emoji as functional UI markers

#### Minor Observations

Data Quality bar's `width` transition (layout thrash, detector-confirmed) still present at `page.tsx:516`.

#### Questions to Consider

No new questions — user has already confirmed scope (fix everything) and color-system direction (realign to DESIGN.md, not intentional).
