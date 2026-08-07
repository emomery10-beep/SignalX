-- ============================================================
-- Migration: mark sector_trends as deprecated / superseded
--
-- sector_trends (008_consent_financial.sql) was an early design for
-- publishing anonymised sector benchmarks, documented at "sample_size
-- >= 5". It was superseded by market_benchmarks (018_pos.sql), which
-- is the table actually populated by the nightly cron
-- (app/api/cron/benchmarks/route.ts, PRIVACY_FLOOR = 3) and read by
-- app/api/cross-sector/route.ts and app/api/chat/route.ts.
--
-- Nothing in the application ever reads or writes sector_trends — it
-- is empty, dead code left over from the earlier design. Its stale
-- ">= 5" comment is what produced an apparent "≥3 vs ≥5 privacy floor"
-- discrepancy in review; there is no live discrepancy, since only the
-- market_benchmarks/PRIVACY_FLOOR=3 path is actually enforced anywhere.
--
-- This migration only documents that fact — it does not drop the
-- table. Physical removal is a separate, explicit decision (it's also
-- publicly SELECT-able via RLS, so dropping it removes a small,
-- currently-inert public attack surface too — worth doing, just not
-- silently as a side effect of this migration).
-- ============================================================

comment on table public.sector_trends is
  'DEPRECATED 2026-08-07 — superseded by public.market_benchmarks (see 018_pos.sql + app/api/cron/benchmarks/route.ts, PRIVACY_FLOOR=3). Nothing reads or writes this table. Not dropped yet — candidate for removal in a future migration once confirmed safe.';
