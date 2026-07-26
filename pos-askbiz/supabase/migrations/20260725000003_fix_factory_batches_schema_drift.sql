-- ============================================================
-- Fix pos_factory_batches / pos_factory_batch_events live-schema
-- drift caused by two independent migration histories racing
-- CREATE TABLE IF NOT EXISTS against the same production database.
--
-- Root's supabase/migrations/050_factory_batches.sql ran first, so
-- its shape stuck live: status enum ('active','completed','on_hold'),
-- event column named scanned_by, no UNIQUE(owner_id, batch_ref).
-- This repo's own 20260724000004_factory_batches.sql's CREATE TABLE
-- was therefore a silent no-op — only its later, unconditional
-- ADD COLUMN IF NOT EXISTS client_tx_id statements actually landed.
--
-- Root's parallel factory backend (app/api/pos/factory/{batch,
-- waybill,downtime,quality,shift}/route.ts in the root app, commit
-- 0e468d53, 2026-06-13) has zero callers anywhere in the monorepo —
-- confirmed by a repo-wide grep, only app/api/pos/factory/capture is
-- ever reached from root's own frontend. This app's own
-- app/api/pos/factory/batch/route.ts (used by app/factory/batch/
-- page.tsx) is the only real, frontend-connected consumer of
-- pos_factory_batches — and it writes status values 'intake' /
-- 'in_progress' / 'qc_pass' / 'qc_fail' / 'dispatch' and a
-- logged_by column, neither of which matches what's currently live.
-- Every real checkpoint scan has therefore been failing outright
-- (CHECK violation, then a missing-column error) — the table's 0
-- live rows reflect a 100% failure rate, not a lack of use.
--
-- The table is empty in production, so this is a pure schema
-- correction with no data to migrate. Root's dead migrations/routes
-- are intentionally left untouched — reconciling/removing them is a
-- separate scope decision, not made here.
-- ============================================================

-- ── pos_factory_batches ─────────────────────────────────────────
ALTER TABLE public.pos_factory_batches
  DROP CONSTRAINT IF EXISTS pos_factory_batches_status_check;

ALTER TABLE public.pos_factory_batches
  ALTER COLUMN status SET DEFAULT 'intake';

ALTER TABLE public.pos_factory_batches
  ADD CONSTRAINT pos_factory_batches_status_check
  CHECK (status IN ('intake', 'in_progress', 'qc_pass', 'qc_fail', 'dispatch'));

-- Uniqueness the app's find-or-create + 23505-retry logic
-- (app/api/pos/factory/batch/route.ts) already assumes exists, so
-- concurrent scans of a new batch_ref can't create duplicate rows.
ALTER TABLE public.pos_factory_batches
  ADD CONSTRAINT pos_factory_batches_owner_batch_ref_key UNIQUE (owner_id, batch_ref);

-- ── pos_factory_batch_events ─────────────────────────────────────
-- Rename to the column name the live route actually writes.
ALTER TABLE public.pos_factory_batch_events
  RENAME COLUMN scanned_by TO logged_by;

ALTER TABLE public.pos_factory_batch_events
  RENAME CONSTRAINT pos_factory_batch_events_scanned_by_fkey TO pos_factory_batch_events_logged_by_fkey;
