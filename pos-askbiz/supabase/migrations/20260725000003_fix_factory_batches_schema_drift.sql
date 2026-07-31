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
--
-- NOTE: this fix was originally applied directly to production via
-- the Management API on 2026-07-25 (verified live via
-- information_schema/pg_constraint at the time), but the migration
-- file capturing it was committed only on an unmerged branch
-- (claude/unruffled-wozniak-d5a734, commit fd45bec3) and never made
-- it into main — found 2026-07-31 while auditing this exact table
-- for the data-eng gap analysis. Ported here, rewritten to be
-- replay-safe (guarded against already-applied state), so main's
-- tracked history matches live reality and a fresh local replay
-- (`supabase db reset`) produces the same schema as production.
-- Since production already has this fix, re-applying this file
-- there should be a no-op; it has NOT been re-applied live as part
-- of this porting — confirm current live state before assuming
-- either way.
-- ============================================================

-- ── pos_factory_batches ─────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_batches_status_check'
      AND conrelid = 'public.pos_factory_batches'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_batches
      DROP CONSTRAINT pos_factory_batches_status_check;
  END IF;
END $$;

ALTER TABLE public.pos_factory_batches
  ALTER COLUMN status SET DEFAULT 'intake';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_batches_status_check'
      AND conrelid = 'public.pos_factory_batches'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_batches
      ADD CONSTRAINT pos_factory_batches_status_check
      CHECK (status IN ('intake', 'in_progress', 'qc_pass', 'qc_fail', 'dispatch'));
  END IF;
END $$;

-- Uniqueness the app's find-or-create + 23505-retry logic
-- (app/api/pos/factory/batch/route.ts) already assumes exists, so
-- concurrent scans of a new batch_ref can't create duplicate rows.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_batches_owner_batch_ref_key'
      AND conrelid = 'public.pos_factory_batches'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_batches
      ADD CONSTRAINT pos_factory_batches_owner_batch_ref_key UNIQUE (owner_id, batch_ref);
  END IF;
END $$;

-- ── pos_factory_batch_events ─────────────────────────────────────
-- Rename to the column name the live route actually writes. Guarded
-- since a replay against an already-fixed DB (or a fresh local DB
-- created straight from this app's own 20260724000004 migration,
-- which never used scanned_by at all) won't have scanned_by to rename.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'pos_factory_batch_events'
      AND column_name = 'scanned_by'
  ) THEN
    ALTER TABLE public.pos_factory_batch_events
      RENAME COLUMN scanned_by TO logged_by;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'pos_factory_batch_events_scanned_by_fkey'
      AND conrelid = 'public.pos_factory_batch_events'::regclass
  ) THEN
    ALTER TABLE public.pos_factory_batch_events
      RENAME CONSTRAINT pos_factory_batch_events_scanned_by_fkey TO pos_factory_batch_events_logged_by_fkey;
  END IF;
END $$;
