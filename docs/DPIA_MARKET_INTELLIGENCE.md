# Data Protection Impact Assessment — Market Intelligence Pipeline

**Prepared:** 2026-08-07 · **Status:** Draft — pending founder review and, before relying on it for a regulatory filing, review by Kenyan/Nigerian data-protection counsel.
**Scope:** `profiles.collective_opt_in` + `profiles.market_intelligence_opt_in` → `app/api/cron/benchmarks/route.ts` + `app/api/cron/market-intelligence/route.ts` → `market_benchmarks`, `global_product_catalogue`, `global_route_intelligence`.
**Why this DPIA exists:** Kenya's Data Protection Act 2019 (s.31) requires a DPIA before processing likely to cause high risk to data subjects, including large-scale automated processing and cross-border transfer. Nigeria's NDPA General Application and Implementation Directive 2025 auto-triggers a DPIA for financial-services processing and profiling. This pipeline is both: it profiles businesses by sector/region/size using their own transaction data, at platform scale, and (per [[data-value-two-directional]]) is intended to eventually support paid external access to aggregate signals. Related: [`docs/DISCLOSURE_LOG.md`](./DISCLOSURE_LOG.md), the consent audit trail added in migration `20260807000001_camera_logistics_consent.sql`.

---

## 1. Description of processing

### 1.1 What is collected, from whom
- **Data subjects:** AskBiz account holders (business owners/operators using the POS or main app), predominantly micro/small businesses in Kenya, Nigeria, and other African markets.
- **Source data:** transaction records (`pos_transactions`), profile fields (`region`, `business_type`, `sector_hints`, `pos_seat_count`, `plan`/`plan_id`), and unified sales events (`unified_data`).
- **Two independent opt-in flags gate this**, both on `profiles`:
  - `collective_opt_in` — feeds `market_benchmarks` (sector/region/business-size averages: margin, basket size, daily revenue, refund rate).
  - `market_intelligence_opt_in` — feeds `global_product_catalogue` (product-level price signals) and `global_route_intelligence` (shipping route performance).

### 1.2 What is produced and who can read it
- Nightly cron jobs (`cron/benchmarks`, `cron/market-intelligence`) bucket opted-in businesses by `sector × region × business_size` (benchmarks) or `product × channel × region` (product catalogue), average the metrics, and **only write a row if the bucket has at least `PRIVACY_FLOOR = 3` contributing businesses** — thin buckets are silently dropped, never published.
- Written rows contain no business name, no account identifier, no individual transaction — only the aggregate value, the dimension labels, and the contributing count (`sample_size`/`merchant_count`).
- `market_benchmarks` and `global_product_catalogue` are readable by any authenticated user (`auth.role() = 'authenticated'`) via RLS — i.e. every AskBiz user, opted-in or not, can read the aggregate output. There is currently no external (non-AskBiz-account) read path or paid-access tier built — the "external buyer pays" ambition in [[data-value-two-directional]] is a stated direction, not yet implemented.

### 1.3 Legal basis relied on
Consent (Kenya DPA s.30(1)(a); NDPA s.25; GDPR Art. 6(1)(a) as benchmark) — this is a profiling/commercial-use case, which Kenya's DPA specifically requires **express** consent for, not e.g. legitimate interest.

---

## 2. ⚠ Primary finding — the consent this relies on is not currently valid for new users

**`market_intelligence_opt_in` defaults to `true` for every profile created after migration `036_market_intelligence_default_on.sql`.** Migration 035 originally added the column as `default false` with an explicit comment — *"Explicit opt-in to contribute pricing data to the global intelligence pool"* — but migration 036 flipped the column default to `true` for new signups (existing users were left at their prior value). This is confirmed live in the current migration history; it is not hypothetical.

**Why this matters:** every consent standard this document benchmarks against — Kenya DPA's requirement of *express* consent for commercial use of personal data, GDPR's requirement of "a clear affirmative act" (Recital 32 explicitly disqualifies pre-ticked boxes and defaults as consent), and Nigeria's NDPA requirement of an affirmative statement — is failed by a system default that enrolls someone before they've acted at all. A user who never opens Settings → Compliance is, today, silently contributing their business's pricing/margin/sales data to a platform-wide aggregate. This is functionally the "pre-ticked checkbox" pattern GDPR's own explanatory text names as invalid, applied here to a business-data pipeline rather than an ad pipeline — but the underlying defect (a default standing in for a decision) is the same one this session's Meta research flagged as the single most consistently punished consent failure. Whether the individual business owner's data counts as "personal data" is not automatic — but for the sole-trader/micro-business population this product targets, the account holder and the business are frequently the same natural person, and DPA's definition of personal data is broad enough that this should be treated as personal data unless counsel confirms otherwise for a specific case.

**This was not fixed in this session.** Reverting the default is a real product decision, not a pure bug fix — flipping it back to opt-in-by-default will reduce the number of contributing businesses and directly affects the size/quality of the aggregate data the [[data-value-two-directional]] monetization plan depends on. That trade-off deserves an explicit decision, not a silent migration. **Recommendation: revert `market_intelligence_opt_in`'s default to `false` for new signups**, and consider a one-time, clearly-worded prompt at signup (a real consent screen, not a bundled checkbox — see the Jan 2023 Meta case in the companion research dossier) so the opt-in rate doesn't have to depend on someone finding a settings toggle. `collective_opt_in` should also be double-checked — it still defaults to `false` per `018_pos.sql` with no later override found this session, but re-verify if a future migration search turns one up.

---

## 3. Necessity & proportionality assessment

| Question | Assessment |
|---|---|
| Is the processing necessary for the stated purpose? | Yes for the aggregate-benchmark purpose (a business can't see "how do I compare to my sector" without pooling data across businesses) — no, the *default-on* enrollment is not necessary; an opt-in default achieves the same purpose for every business that would have said yes anyway. |
| Is less data collection possible? | The pipeline already aggregates before publishing and floors at 3 contributors — this is a reasonable minimization design once consent is fixed. |
| Is the retention period proportionate? | `market_benchmarks`/`global_product_catalogue` rows are keyed by `period` (YYYY-MM) with no automatic expiry found in this session — worth adding a retention policy (e.g. drop rows older than N months) as a follow-up; not fixed here. |
| Could the purpose be achieved with anonymization alone, without consent? | Arguably yes for the aggregate output itself (once floored at n≥3, the published row is anonymous) — but the *input* (raw transaction data feeding the aggregation) is still personal/business data being processed for a secondary purpose beyond running the POS, which is why consent is the right basis for the collection step even though the output is anonymous. |

---

## 4. Risk assessment

| Risk | Likelihood | Impact | Current mitigation | Residual risk |
|---|---|---|---|---|
| Default-on enrollment invalidates consent for new users (§2) | **Confirmed, live** | High — undermines the legal basis for the entire pipeline; a regulator finding this would likely treat it the same way Ireland's DPC treated Meta's Jan 2023 bundled-consent basis | None currently | **High — unresolved, flagged for founder decision** |
| Re-identification of a business from a published aggregate | Low–Medium | Medium | `PRIVACY_FLOOR = 3` (not 5 — see below) enforced at write time in both cron jobs; buckets below floor are dropped, not published | Medium in thin markets — a "restaurant, Somalia" bucket could plausibly still be identifiable even at n=3 if the sector/region/size combination is rare. Consider raising the floor for known-thin market×sector combinations, or suppressing region granularity below a country-level threshold. |
| Confusion from a second, disused table (`sector_trends`) implying a different (≥5) floor | Confirmed, historical | Low (no functional impact — nothing reads/writes it) | Migration `20260807000002_deprecate_sector_trends.sql` (this session) marks it deprecated | Low — resolved |
| Consent withdrawal not honored going forward | Low | Medium | Cron jobs re-query `collective_opt_in`/`market_intelligence_opt_in = true` fresh every run — a revoke takes effect on the next nightly run, not retroactively for already-published aggregate rows | Low-Medium — already-published historical aggregate rows aren't retracted when a contributor withdraws; consider whether that's acceptable (the row itself contains no identifying data once published) or whether a re-aggregation-on-withdrawal job is warranted |
| Consent not demonstrable server-side | Confirmed, historical | Medium | Fixed this session — `collective_opt_in`/`market_intelligence_opt_in` now route through the audited `/api/consent` → `update_consent()` path with `consent_log` entries on grant *and* revoke (migration `20260807000001`) | Low — resolved for toggles exercised after this fix ships; pre-fix opt-ins have no log entry (expected, not retroactively fabricatable) |
| Cross-border transfer of the underlying data | Confirmed | Medium | `dpa.json` §8 discloses transfers under SCCs/UK IDTA; Supabase/Anthropic/Vercel sub-processors listed | Low — appears adequately documented; not independently re-verified this session beyond reading the DPA text |

---

## 5. Mitigations — done this session vs. still open

**Done (2026-08-07):**
- `camera_consent`/`logistics_consent` now have real columns and are actually persisted (previously UI-only, always silently reset to "granted").
- `update_consent()` now logs grant *and* revoke for all 6 consent purposes, not just grants.
- `collective_opt_in`/`market_intelligence_opt_in` now go through the same audited path as the rest of consent, instead of an unaudited direct client write.
- `sector_trends` marked deprecated so its stale "≥5" comment stops being a source of confusion against the real, enforced `PRIVACY_FLOOR = 3`.
- `security-audit` route extended to check camera/logistics consent demonstrability and market-intelligence audit-log coverage going forward.
- A security review of this session's own changes (before anything was applied to production) caught that the first draft of the `update_consent()` rewrite would have created an *unprotected* second overload of that function — missing the ownership check and privilege lockdown the live version has — reachable directly via the public Supabase REST endpoint with just the anon key, which would have let anyone forge another user's consent state and consent_log entries. Fixed in the migration before it was ever run; see the migration file's own header for detail.

**Still open — requires a decision, not just engineering:**
1. **Revert `market_intelligence_opt_in`'s default to `false`** for new signups (§2) — highest-priority open item from this DPIA.
2. Decide a retention/expiry policy for `market_benchmarks`/`global_product_catalogue` rows.
3. Decide whether the re-identification floor (`PRIVACY_FLOOR = 3`) should be raised for known-thin market×sector combinations, or region granularity coarsened below a threshold.
4. If/when the "external buyer pays" tier from [[data-value-two-directional]] is built, this DPIA should be revisited before launch — a paying external buyer is a materially different processing purpose than "let AskBiz users see their own sector's benchmark," and Nigeria's GAID explicitly treats a purpose change as a fresh DPIA trigger.

---

## 6. Sign-off

This DPIA was drafted by an AI coding assistant grounded in the live codebase, not a template. It should be reviewed by the founder and, before being relied on for an ODPC/NDPC filing or cited in response to a regulator, by data-protection counsel licensed in Kenya and/or Nigeria — particularly the personal-data-vs-business-data question in §2, which is fact-specific and consequential.

| Role | Name | Date | Notes |
|---|---|---|---|
| Prepared by | Claude (AI assistant) | 2026-08-07 | Grounded in live schema/code, not a generic template |
| Reviewed by | _pending_ | | |
| Legal review | _pending_ | | Recommended before any ODPC/NDPC filing references this document |
