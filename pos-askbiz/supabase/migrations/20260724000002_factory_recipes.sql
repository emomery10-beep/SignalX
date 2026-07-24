-- ============================================================
-- Factory data model extension (1/8): Recipe / expected yield
-- ------------------------------------------------------------
-- Today there is no way to say "for product X, Y kg/litres of
-- input Z should typically yield W%". The Production log page
-- (app/factory/production/page.tsx) computes output/intake per
-- product_name client-side and colours it green/amber/red at
-- hardcoded 90%/70% thresholds — a naturally low-yield process
-- (sesame oil pressing, ~36-63% typical extraction) gets flagged
-- as a failure by that naive math.
--
-- pos_factory_recipes lets an owner record the expected yield
-- range for a given input → output pair, so a future revision of
-- the production page (or any other yield-aware view) can compare
-- actual output against a real expectation instead of a fixed
-- percentage. Nothing reads this table yet — it is additive
-- groundwork, not a behaviour change.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.pos_factory_recipes (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Free-text product names — pos_factory_captures.product_name is also
  -- free text (no product catalog FK exists for factory captures), so
  -- recipes match that same convention rather than inventing a new
  -- product identity concept.
  input_product_name  text        NOT NULL,
  input_unit          text,                    -- e.g. 'kg', 'litres'
  output_product_name text        NOT NULL,
  output_unit          text,

  -- Range is more honest than a single number for naturally variable
  -- processes (e.g. sesame oil 36-63%). expected_yield_pct is the
  -- nominal/target value a builder can show as a single headline figure;
  -- yield_min_pct/yield_max_pct are the acceptable band around it.
  expected_yield_pct  numeric     NOT NULL CHECK (expected_yield_pct > 0 AND expected_yield_pct <= 100),
  yield_min_pct       numeric     CHECK (yield_min_pct IS NULL OR (yield_min_pct > 0 AND yield_min_pct <= 100)),
  yield_max_pct       numeric     CHECK (yield_max_pct IS NULL OR (yield_max_pct > 0 AND yield_max_pct <= 100)),
  CHECK (yield_min_pct IS NULL OR yield_max_pct IS NULL OR yield_min_pct <= yield_max_pct),

  notes               text,
  is_active           boolean     NOT NULL DEFAULT true,

  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),

  -- One recipe per (input, output) pair per owner. A single output can
  -- still have multiple recipes if it's produced from more than one input.
  UNIQUE (owner_id, input_product_name, output_product_name)
);

CREATE INDEX IF NOT EXISTS pos_factory_recipes_owner_idx
  ON public.pos_factory_recipes (owner_id, is_active);
CREATE INDEX IF NOT EXISTS pos_factory_recipes_output_idx
  ON public.pos_factory_recipes (owner_id, output_product_name);

CREATE OR REPLACE FUNCTION public.set_factory_recipe_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_factory_recipe_updated_at ON public.pos_factory_recipes;
CREATE TRIGGER set_factory_recipe_updated_at
  BEFORE UPDATE ON public.pos_factory_recipes
  FOR EACH ROW EXECUTE FUNCTION public.set_factory_recipe_updated_at();

-- RLS — same pattern as pos_factory_captures (040_factory_captures.sql):
-- owner reads/writes their own rows via service role; POS staff access is
-- controlled at the API layer (resolvePosAuth + hasPermission).
ALTER TABLE public.pos_factory_recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_all_factory_recipes" ON public.pos_factory_recipes;
CREATE POLICY "owner_all_factory_recipes" ON public.pos_factory_recipes
  FOR ALL USING (owner_id = auth.uid());
