-- ============================================================
-- Factory captures: shelf-life decay window
-- ------------------------------------------------------------
-- The mirror image of the hold feature (20260809000002): instead of "not
-- sellable until N days pass" (curing, regulatory clearance), some factory
-- output degrades and becomes unsellable AFTER a short window passes.
-- bakery.ts's own sourceNote is explicit: "Unsold bakery stock typically
-- ages out within about 24 hours... plan alerts and markdowns around a
-- same-day sell-through window."
--
-- A single nullable column, not a child table like capture_holds — unlike
-- concrete_blocks' real 2-milestone cure, nothing in the 12 templates
-- researched needs more than one decay deadline per capture, so a table
-- built for N-per-capture would be complexity this problem doesn't have.
-- ============================================================

ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS expires_at timestamptz;

CREATE INDEX IF NOT EXISTS pos_factory_captures_expires_idx
  ON public.pos_factory_captures (owner_id, expires_at)
  WHERE expires_at IS NOT NULL;
