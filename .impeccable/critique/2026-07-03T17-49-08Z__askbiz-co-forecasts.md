---
target: askbiz.co/forecasts
total_score: 33
p0_count: 0
p1_count: 0
timestamp: 2026-07-03T17-49-08Z
slug: askbiz-co-forecasts
---
#### Design Health Score

Re-scored after 4 rounds of fixes (`$impeccable harden`, `$impeccable clarify`, `$impeccable polish` × 2, `$impeccable typeset`) against [app/(app)/forecasts/page.tsx](app/(app)/forecasts/page.tsx).

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Compare/What-If/PDF/Stats now surface failures via the same error banner/inline note as Run Forecast |
| 2 | Match System / Real World | 3 | R²/RMSE now carry plain-language hover tooltips; labels are still technical but explained |
| 3 | User Control and Freedom | 3 | Unchanged — tabs/scenarios freely switchable, no reset-config affordance |
| 4 | Consistency and Standards | 4 | Palette fully realigned to DESIGN.md tokens (`--acc`, `--acc2`, established green/red/warning) |
| 5 | Error Prevention | 3 | Unchanged — run button gating and text-column warning already solid |
| 6 | Recognition Rather Than Recall | 4 | Emoji replaced with labeled SVG icons (Method Guide) and plain-text tags (dataset select) |
| 7 | Flexibility and Efficiency | 2 | Unchanged — still no keyboard shortcuts or saved config |
| 8 | Aesthetic and Minimalist Design | 3 | Consistent palette + Method Guide now collapses once a user has run a forecast |
| 9 | Error Recovery | 4 | Silent `catch {}` blocks eliminated; every async action now reports failure |
| 10 | Help and Documentation | 3 | R²/RMSE tooltips added; Method Guide remains as inline teaching, now collapsible |
| **Total** | | **33/40** | **Good — solid foundation, minor areas remain** |

#### What Changed Since Last Run (21 → 33)

1. **Silent failures fixed** (`$impeccable harden`): `runComparison`, `runWhatIf`, `generatePdfReport`, `fetchStats` now route errors through visible UI instead of empty `catch {}` blocks.
2. **Jargon and KPI trust fixed** (`$impeccable clarify`): R²/RMSE get plain-language tooltips; TREND/ACCURACY cards visually demote (opacity + "Low confidence" tag) when data quality or R² is weak, instead of showing every stat at equal confidence.
3. **Color system realigned** (`$impeccable polish`): all hardcoded dark-canvas/off-token colors (teal, stray purple, indigo-on-non-AI-surfaces) replaced with DESIGN.md's documented `--acc` amber, `--acc2` violet, and the app's own established green/red/warning-amber status convention (confirmed via cross-file check, not invented). Primary button now matches the documented spec. Detector's layout-thrash finding fixed in the same pass.
4. **Emoji removed** (`$impeccable typeset`): dataset-type emoji (native `<select>` can't render SVG) replaced with translated `[POS]`/`[Store]` text tags; Method Guide emoji replaced with a small SVG icon set matching the app's existing thin-stroke icon language.
5. **Sidebar density reduced** (`$impeccable polish`): Method Guide is now a native `<details>`/`<summary>` disclosure, open by default for first-time users (no `result` yet) and collapsed by default for anyone who has already run a forecast this session.

#### Remaining Gaps (not addressed this round, lower priority)

- No keyboard shortcuts or saved/default config for repeat runs (Flexibility & Efficiency, score 2).
- No skeleton loading state for the initial uploads/datasets fetch.
- Only Method Guide was collapsed; Column Stats and Saved Forecasts panels still stack unconditionally (acceptable per product-register density permissions, but could be revisited if this sidebar grows further).

All changes type-check cleanly, the dev server builds and serves the route with zero console/server errors, and `detect.mjs` returns a clean pass (exit 0).
