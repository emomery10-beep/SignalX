# Academy — content-freshness + full translation progress tracker

Cross-session source of truth for the Academy update program (plan:
`~/.claude/plans/adaptive-discovering-ullman.md`, approved 2026-07-25). This file is the
thing to read first when resuming this work in a new session — it survives across
sessions; TaskCreate/TaskList do not.

**Baseline measured 2026-07-25:** 484 `lib/academy-*.ts` files, 26 categories, ~1,673
articles, 1,811,313 words. Target: all content current with shipped product features,
translated into all 7 active locales (`es, fr, de, nl, ar, sw, so`).

---

## Architecture status

| Step | Status | Notes |
|---|---|---|
| Milestone 0 — this tracker | ✅ done | |
| Milestone 1 — English content-freshness update | ✅ done (commit e918cb95) | 12 new AskBiz Tutorials articles + 4 stale articles corrected (PO "coming soon", 2x false SMS-delivery claims, Factory description). Typecheck/build clean, 2 pages browser-verified. Pushed. |
| Milestone 2 — `lib/academy-i18n/<locale>/` overlay + `getLocalizedArticle()` | ✅ done (commit a0f4a617) | Ships as a no-op — English fallback everywhere, 0 translated content yet. Browser-verified: hreflang (9 links incl. x-default), schema `inLanguage`, RTL (`dir="rtl"`/`lang="ar"`), 11,620 locale-prefixed academy sitemap URLs. Pushed. |
| Language switcher + RTL polish on Academy pages | ✅ done (commit a0f4a617) | `<LanguageToggle compact/>` added inline to all 8 Academy route surfaces (layout.tsx is metadata-only, no shared header — deliberate deviation, documented). RTL logical-property fixes applied. |
| hreflang / sitemap / schema.org per locale for Academy | ✅ done (commit a0f4a617) | Mirrors the `/so` pattern via `localePath()`, generalized to all `ACTIVE_LOCALES`. |

**Note:** a concurrent `vercel` deploy in this same worktree ran `git stash -u` mid-Milestone-2 (stash message: "protecting from vercel CLI deploy") — correctly protected the changes, recovered via `git stash pop`, nothing lost. A separate unrelated merge conflict (on `app/(app)/intelligence/page.tsx` and `lib/voiceRoutes.ts`, not Academy files) blocked this tracker's own commit once; both Milestone 1 and 2 commits are now confirmed pushed and live on `origin/main`.

## Glossaries (lock once per language, reuse across every wave)

| Locale | Glossary status | Source |
|---|---|---|
| sw | ✅ locked (reuse) | established for POS/UI translation — see memory `pos-askbiz-swahili`, `i18n-foundation-progress` |
| so | ✅ locked (reuse) | established for UI translation — see memory `somali-locale-build` |
| es | ⬜ not yet locked | to be established during Milestone 3 (Wave A) |
| fr | ⬜ not yet locked | to be established during Milestone 3 (Wave A) |
| de | ⬜ not yet locked | to be established during Milestone 3 (Wave A) |
| nl | ⬜ not yet locked | to be established during Milestone 3 (Wave A) |
| ar | ⬜ not yet locked | to be established during Milestone 3 (Wave A) — RTL, needs extra layout QA |

---

## Wave A — POS + product cluster (pilot, Milestone 3)

Source: `Point of Sale & Retail` (39 articles) + Milestone 1's 12 new articles (confirmed —
commit e918cb95) = 51 total. `POS kwa Kiswahili` (6) and `POS af-Soomaali` (6) are already
native sw/so content — not translation targets, just verify they still read correctly once
the language switcher exists.

| Locale | Status | Articles done / total |
|---|---|---|
| es | ⬜ not started | 0 / 51 |
| fr | ⬜ not started | 0 / 51 |
| de | ⬜ not started | 0 / 51 |
| nl | ⬜ not started | 0 / 51 |
| ar | ⬜ not started | 0 / 51 |
| sw | ⬜ not started | 0 / 51 |
| so | ⬜ not started | 0 / 51 |

## Wave B — "AskBiz Tutorials" category (832 articles)

Starts with a redundancy/dedup audit (batch files run at least `batch11`...`batch38` —
likely combinatorial). Per-batch-file breakdown to be filled in once that audit runs.

| Locale | Status | Articles done / total |
|---|---|---|
| es | ⬜ not started | 0 / 832 |
| fr | ⬜ not started | 0 / 832 |
| de | ⬜ not started | 0 / 832 |
| nl | ⬜ not started | 0 / 832 |
| ar | ⬜ not started | 0 / 832 |
| sw | ⬜ not started | 0 / 832 |
| so | ⬜ not started | 0 / 832 |

## Wave C — remaining 22 generic-business categories (790 articles)

Funding & Investment (60), Business Strategy & Growth (60), eCommerce Intelligence (50),
Tax & Compliance (50), Inventory & Supply Chain (50), Financial Intelligence (50), Retail &
Physical Commerce (40), Pricing Strategy (40), Marketing Intelligence (40), HR & People
(40), Sales Intelligence (30), SaaS & Subscription Metrics (30), Operations & Productivity
(30), Customer Intelligence (30), AI & Data (30), Sustainability & ESG (20), Legal &
Contracts for SMEs (20), International Trade (20), Financial Forecasting (20), Customer
Support Metrics (20), Currency & FX (20), Competitor & Market Intelligence (20), Business
Intelligence Basics (20).

| Locale | Status | Articles done / total |
|---|---|---|
| es | ⬜ not started | 0 / 790 |
| fr | ⬜ not started | 0 / 790 |
| de | ⬜ not started | 0 / 790 |
| nl | ⬜ not started | 0 / 790 |
| ar | ⬜ not started | 0 / 790 |
| sw | ⬜ not started | 0 / 790 |
| so | ⬜ not started | 0 / 790 |

---

## How to resume in a new session

1. Read this file top to bottom — the first ⬜ row is the next unit of work.
2. Read the plan file (`~/.claude/plans/adaptive-discovering-ullman.md`) for the full
   architecture/verification rationale.
3. If a `Workflow` run was interrupted mid-wave, check whether its `runId` is still
   resumable (`Workflow({scriptPath, resumeFromRunId})`) before re-running from scratch —
   completed agents in that run are cached.
4. After finishing a unit, update its row here (⬜ → ✅, fill in the count), commit locally
   (do not push — see memory `no-push-until-complete`), and report to the user before
   starting the next unit.
