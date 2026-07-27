# Academy — content-freshness + full translation progress tracker

Cross-session source of truth for the Academy update program (plan:
`~/.claude/plans/adaptive-discovering-ullman.md`, approved 2026-07-25). This file is the
thing to read first when resuming this work in a new session — it survives across
sessions; TaskCreate/TaskList do not.

**Baseline measured 2026-07-25:** 484 `lib/academy-*.ts` files, 26 categories, ~1,673
articles, 1,811,313 words. Target: all content current with shipped product features,
translated into all 7 active locales (`es, fr, de, nl, ar, sw, so`).

**Baseline correction, 2026-07-26 (Milestone 3 kickoff):** the original category count only
matched double-quoted `category: "..."` fields. There's a second set of 295 articles using
single-quoted `category: '...'` across 28 files, missed by that grep: 200 more under
"Point of Sale & Retail", 30 more "International Trade", 25 more "AskBiz Tutorials", 10 each
more "SaaS & Subscription Metrics"/"HR & People"/"Financial Intelligence"/"Currency & FX".
Sampled one (`quantum-computing-combinatorial-pos-optimization`) — same character as the
"AskBiz Tutorials" bulk: dense academic-jargon pSEO, not genuine product education (e.g.
"Quantum Computing Applications for Combinatorial Optimization Problems in Point-of-Sale
Operations"). True total is **~1,980 articles**, not 1,673 — word-count baseline (1.81M,
measured via `wc -w` which doesn't care about quote style) is unaffected. These 295 route
into Wave B/C's dedup-audit treatment, NOT the Milestone 3 pilot — confirmed the pilot's
"Point of Sale & Retail" (39) is the genuinely hand-written, double-quoted, practical set
living in `lib/academy-content.ts` (What Is a POS System, Processing a Sale, Camera
Scanning, Refunds, VAT, Multi-Branch, Repair workflows, etc.) — untouched by this discovery.

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
| sw | ✅ locked (reuse) | reused from prior POS/UI translation; confirmed in Milestone 3 |
| so | ✅ locked (reuse) | reused from prior UI translation; confirmed in Milestone 3 |
| es | ✅ locked (new) | established Milestone 3, 59 core terms, verified across all 51 articles |
| fr | ✅ locked (new) | established Milestone 3 batches 1-2, ready for batches 3-4 retry |
| de | ✅ locked (new) | established Milestone 3, verified across all 51 articles |
| nl | ✅ locked (new) | established Milestone 3, verified across all 51 articles |
| ar | ✅ locked (new) | established Milestone 3, verified across 45/51 articles (6 missing from batch4) |

---

## Wave A — POS + product cluster (pilot, Milestone 3, PARTIAL 2026-07-27)

**Status:** 4/7 languages complete (es/de/nl/sw fully wired with all 51 articles); 3/7 partial.
Typecheck + build passed. 28 batch files created, 7 index files updated, changes committed locally.
Ready for next steps; missing articles from ar/fr/so need retry or investigation.

Source: `Point of Sale & Retail` (39 articles) + Milestone 1's 12 new articles (confirmed —
commit e918cb95) = 51 total. `POS kwa Kiswahili` (6) and `POS af-Soomaali` (6) are already
native sw/so content — not translation targets, just verify they still read correctly once
the language switcher exists.

| Locale | Status | Articles done / total |
|---|---|---|
| es | ✅ done | 51 / 51 |
| de | ✅ done | 51 / 51 |
| nl | ✅ done | 51 / 51 |
| sw | ✅ done | 51 / 51 |
| ar | ⚠️ partial | 45 / 51 (batch4 incomplete: 6 missing connect-* + purchase-orders articles) |
| fr | ⚠️ partial | 26 / 51 (batch3-4 failed; batches 1-2 done) |
| so | ⚠️ partial | 39 / 51 (batch4 never created; batches 1-3 done) |

## Wave B — "AskBiz Tutorials" category (~857 articles, was 832 + 25 single-quoted found 2026-07-26)

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

## Wave C — remaining generic-business categories (~1,060 articles: 790 original + 70 more
single-quoted International Trade/SaaS/HR/Financial Intelligence/Currency & FX + 200
single-quoted "Point of Sale & Retail" pSEO articles that don't belong in Wave A's genuine
POS cluster — exact split TBD by Wave B's own dedup audit, run the same audit against these
200 before committing to translate them)

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
