---
target: askbiz.co/forecasts
total_score: 21
p0_count: 0
p1_count: 3
timestamp: 2026-07-03T16-08-01Z
slug: askbiz-co-forecasts
---
#### Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | `runForecast` gives spinner + text feedback; other async actions (compare, what-if, PDF) give no loading→failure signal |
| 2 | Match System / Real World | 1 | Raw stats jargon (R², RMSE, "holdout fit") shown to a self-declared non-technical SME audience with zero explanation |
| 3 | User Control and Freedom | 3 | Tabs and scenarios freely switchable; share modal closes on backdrop click; no explicit "reset config" affordance |
| 4 | Consistency and Standards | 1 | Page's actual palette (dark navy shell, raw hex teal/purple/indigo/amber in Chart.js) contradicts the documented DESIGN.md light "Founder's Terminal" system entirely |
| 5 | Error Prevention | 3 | Run button disabled until dataset+column chosen; proactive text-column warning |
| 6 | Recognition Rather Than Recall | 3 | Tabs and method guide are labeled and visible; emoji-prefixed dataset options are the one recall-unfriendly spot |
| 7 | Flexibility and Efficiency | 2 | No keyboard shortcuts; no saved/default config for repeat runs; compare-all-methods and overlay are decent power features |
| 8 | Aesthetic and Minimalist Design | 2 | 6 KPI cards + 5-6 stacked sidebar panels + tabs + chart + AI summary compete for attention with 4 saturated accent colors in play |
| 9 | Error Recovery | 1 | `runComparison`, `runWhatIf`, `generatePdfReport`, `fetchStats` all swallow errors in empty `catch {}` blocks — failures are silent |
| 10 | Help and Documentation | 2 | Method Guide card explains methods inline; no tooltip/glossary for R²/RMSE jargon |
| **Total** | | **21/40** | **Acceptable — significant improvements needed** |

#### Anti-Patterns Verdict

**LLM assessment**: This doesn't read as generic AI slop in the "templated SaaS hero" sense — it's a genuinely dense, custom-built analytics surface, not a stock component grid. But it fails a different way: it's internally inconsistent. Four saturated accents (teal `#1ed4ca`, purple `#9268f8`, indigo `#6366f1`, amber `#f5c55a`) all appear with roughly equal visual weight across the chart, buttons, and badges, with no single color reading as "the brand." The chart itself is built from hardcoded hex strings inside the Chart.js config, completely disconnected from the app's CSS custom-property token system — this page and the rest of the app are, color-wise, two different products stitched together. Emoji used as functional icons (🏪🛒📄 for dataset type, 🎯📈〰️🔄⚡ for method guide) is also a direct hit against this project's own documented anti-reference.

**Deterministic scan**: `detect.mjs` flagged 1 issue in `app/(app)/forecasts/page.tsx`: a **layout-transition antipattern** (warning severity) at line 516 — `transition: width` on the Data Quality progress bar. Animating `width` causes layout thrash; should animate `transform: scaleX()` from a `transform-origin: left` instead. No other automated findings in this file; this is a small, mechanical fix.

**Visual overlays**: Not available for this run — the target is a screenshot of the live production site (`askbiz.co`), not a session-controlled browser tab, so no injectable `[Human]` overlay could be produced. A local dev server was found running (port 3999) but wasn't used for live evidence — this is a static screenshot review, not a click-through session, and the local instance would need an authenticated session with real forecast data to reproduce the same state.

#### Overall Impression

This is a legitimately sophisticated feature — auto method selection, decomposition, what-if simulation, forecast overlays, anomaly detection — built by someone who clearly understands forecasting, not just charting. The problem is that the UI shows its work without curating it: every stat, every panel, every accent color gets equal billing, so the one number that actually matters (a low-confidence trend) looks exactly as trustworthy as a genuinely solid one. The biggest opportunity here isn't visual polish, it's honesty in the hierarchy — this screen needs to visually demote what it doesn't trust.

#### What's Working

- **Method Guide card** (in the sidebar) is a strong pattern: each forecasting method gets a one-line plain-language explanation of when to use it, right where the user is choosing. This is exactly the kind of inline teaching the product's "no data team" audience needs — do more of this elsewhere on the page.
- **Progressive disclosure on the config panel**: "Column to forecast" only appears after a dataset is picked, and the run button stays disabled until both are set. Good error prevention without extra copy.
- **Data Quality panel is honest about the data** — "6 outliers detected and smoothed," "high volatility — predictions will have wide confidence bands" is exactly the blunt-analyst tone the brand wants. The problem is this honesty doesn't propagate up to the KPI row (see Priority Issues).

#### Priority Issues

**[P1] Failed actions fail silently.** `runComparison`, `runWhatIf`, `generatePdfReport`, `fetchStats`, and `shareForecast`'s clipboard write all wrap their logic in `catch { /* ignore */ }` (`app/(app)/forecasts/page.tsx:262, 279, 355, 363, 370`). Only `runForecast` sets the `error` state that renders a visible banner. If the What-If or Compare API call fails, the button just stops spinning and nothing happens — no banner, no toast, no console-visible cue to the user. A user on a flaky connection (Riley, the stress-tester persona) will conclude the feature is broken, not that it errored.
**Why it matters**: This directly violates Nielsen's error-recovery heuristic and erodes trust in a product whose entire pitch is "give founders a decisive answer" — an answer that silently fails to arrive is worse than an error message.
**Fix**: Route every catch block through the same `setError`/banner mechanism `runForecast` already has (or a shared toast), so no async action can fail invisibly.
**Suggested command**: `$impeccable harden`

**[P1] Statistical jargon is shown raw to a self-declared non-technical audience.** The KPI row and PDF export both surface "R²," "RMSE," and "Holdout fit" with no inline explanation (`page.tsx:634-638`). PRODUCT.md is explicit that this audience is "operators, not analysts: no SQL, no data team" who "ask questions in plain English."
**Why it matters**: A founder who doesn't know what R² means has no way to judge whether `0.00` is bad (it is) — the number is decoration, not information, for exactly the user this product claims to serve.
**Fix**: Add a hover/tap tooltip on each technical KPI label with a one-line plain-language gloss ("R² — how well the model fits your past data; closer to 1 is better"), or swap the label itself for a plain-language equivalent with the technical term as a subtitle.
**Suggested command**: `$impeccable clarify`

**[P1] The most prominent number is also the least trustworthy one, and nothing signals that.** TREND reads "UP +2285.8%" in confident teal at the top of the KPI row, while the same forecast run carries R² 0.00, Accuracy 0%, Quality 70%, and an explicit "high volatility" warning buried in the sidebar. The visual hierarchy and the data hierarchy point in opposite directions.
**Why it matters**: This is the exact failure mode the brand promises to prevent ("Earn trust with specificity... vague claims dissolve trust"). A founder skimming the top row could make a real business decision off a number the app's own quality panel is quietly disowning.
**Fix**: Visually tie KPI confidence to data quality — dim, badge, or annotate any headline stat when quality score or R² falls below a threshold, instead of showing every KPI card at identical visual weight.
**Suggested command**: `$impeccable clarify`

**[P2] The page's live color system doesn't match the documented design system.** DESIGN.md specifies a light "cool blue-gray shell" (`#f2f3f5`) with terracotta amber (`#d08a59`) as the single interactive accent, and indigo (`#6366f1`) reserved exclusively for AI/Ask surfaces. This screen instead runs a dark navy shell with teal, purple, indigo, and amber all appearing as roughly equal-weight accents — and the chart colors are hardcoded hex strings inside the Chart.js config, bypassing the CSS custom-property tokens (`--tx`, `--sf`, etc.) entirely.
**Why it matters**: Either this page is running an undocumented second design system, or it drifted from the documented one over time — both are Consistency & Standards failures, and the indigo use on non-AI elements (scenario buttons) specifically breaks the documented "indigo is AI-only" rule.
**Fix**: Decide which is canonical. If a dark analytics theme is intentional for data-heavy surfaces, document it and route the chart colors through named tokens instead of literals. If not, bring this page back to the documented palette.
**Suggested command**: `$impeccable document` (if dark theme is intentional) or `$impeccable polish` (if not)

**[P2] Emoji used as functional UI markers.** Dataset options are prefixed with 🏪 (POS) / 🛒 (ecommerce) / 📄 (upload), and the Method Guide uses 🎯📈〰️🔄⚡ as method icons (`page.tsx:435, 442, 598-602`). PRODUCT.md's anti-references explicitly rule this out: "Overly playful: ...emoji-driven decoration — never."
**Why it matters**: Beyond the brand mismatch, emoji render inconsistently across OS/browser combinations and read as unpolished next to an otherwise data-serious interface.
**Fix**: Replace with a small consistent SVG icon set matching the rest of the app's icon language (the chart already uses custom SVG icons elsewhere on this same page, e.g. the empty-state icon).
**Suggested command**: `$impeccable typeset`

#### Persona Red Flags

**Jordan (First-Timer)**: Sees "R²," "RMSE," and "Holdout fit" with no explanation, and sees "TREND UP +2285.8%" rendered with the same confident styling as every other stat — nothing tells Jordan this number is unreliable. Per the persona's literal-interpretation tendency, Jordan takes the headline number at face value. This is the single highest-risk red flag on the page given the product's stated non-technical audience.

**Riley (Stress Tester)**: Triggering What-If, Compare, or PDF export against a failing API call produces a button that stops spinning with zero feedback — no error banner, no retry prompt, nothing distinguishing "it worked and did nothing" from "it silently failed." Riley would flag this as a feature that "appears to work but silently fails," the exact category this persona is built to catch.

**Amara — Solo Shopify Seller (project-specific, derived from PRODUCT.md's target audience)**: Amara runs her store alone, has no data team, and opens the app to make one decision fast. The sidebar stacks Configuration → Data Quality → Anomalies → Column Stats → Saved Forecasts → Method Guide, six dense panels in a 230px column, before she gets to anything actionable beyond "Run forecast." Combined with the jargon-heavy KPI row, the 4-minutes-to-answer promise in PRODUCT.md is hard to deliver here — she has to read past a lot of unexplained analyst language to reach a decision she can act on.

#### Minor Observations

- Data Quality bar animates `width` (`page.tsx:516`) — swap to `transform: scaleX()` to avoid layout thrash (detector-confirmed, low effort fix).
- The "ANOMALIES: 1 — Review flagged" KPI card has no click-through to the anomaly detail already present in the sidebar; a founder scanning top-down has no cue that clicking would help even though the answer is one scroll away.
- Sidebar information density (6 stacked cards) could shed weight by collapsing the static "Method Guide" behind a small "?" affordance for returning users who no longer need it every visit.

#### Questions to Consider

- Is the dark navy theme on this screen intentional (a deliberate "analytics mode" distinct from the rest of the app), or has it drifted from the documented light system over time?
- If a forecast comes back with R² near 0 and explicit high-volatility warnings, should the app even show a confident percentage-change headline, or would a founder be better served by a plain-language caveat instead ("not enough clean data yet for a reliable trend")?
- What would it look like if the KPI row itself changed appearance (not just the sidebar panel) when the underlying data quality is weak?
