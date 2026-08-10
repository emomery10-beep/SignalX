-- ============================================================
-- Factory captures: generic process-parameter reading
-- ------------------------------------------------------------
-- dairy.ts's pasteurize stage hint calls out a real gap: "worth recording
-- the actual temperature/time reached, not just 'done'" — a measured
-- critical-control-point value, not a quantity+unit of product. Several
-- other templates name similar measurable targets (rice_milling's soak/
-- dry moisture %, coffee's drying moisture %), so this is built generic
-- and free-form rather than hardcoded to dairy/temperature specifically —
-- any factory type (or 'other') can use it for whatever reading their own
-- process needs, with no per-type code branching required.
--
-- Deliberately NOT auto-detected/template-matched like holdRule — a
-- generic label+value+unit field the worker fills in directly is simpler,
-- needs no new matching library, and doesn't require a settled product
-- name to match against (pasteurization happens before dairy's yoghurt/
-- cheese/ghee-butter branch is even chosen, so there's nothing yet to
-- fuzzy-match a recipe against at the point this reading is taken).
-- ============================================================

ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS param_label text;
ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS param_value numeric;
ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS param_unit text;
