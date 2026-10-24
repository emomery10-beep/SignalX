-- Dated history of a factory's cost rates (labour / electricity / overhead per day). Until now the single row in
-- pos_factory_cost_settings applied to ALL history, so changing a rate silently re-costed every past period. With
-- history, each past day is costed at the rates in force on that day (lib/factory-unit-cost, lib/cfo-snapshot).
--   * effective_from = the factory-local day the rates took effect
--   * existing settings are seeded as the baseline (effective_from 2000-01-01), so nothing changes today
CREATE TABLE IF NOT EXISTS public.pos_factory_cost_rate_history (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id         uuid        NOT NULL REFERENCES public.pos_locations(id) ON DELETE CASCADE,
  effective_from      date        NOT NULL,
  staff_per_day       numeric     NOT NULL DEFAULT 0,
  electricity_per_day numeric     NOT NULL DEFAULT 0,
  overhead            numeric     NOT NULL DEFAULT 0,
  changed_by          uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (location_id, effective_from)
);
CREATE INDEX IF NOT EXISTS pos_factory_cost_rate_history_owner_idx ON public.pos_factory_cost_rate_history (owner_id, location_id, effective_from);
ALTER TABLE public.pos_factory_cost_rate_history ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "owner_all_factory_cost_rate_history" ON public.pos_factory_cost_rate_history;
CREATE POLICY "owner_all_factory_cost_rate_history" ON public.pos_factory_cost_rate_history FOR ALL USING (owner_id = auth.uid());

INSERT INTO public.pos_factory_cost_rate_history (owner_id, location_id, effective_from, staff_per_day, electricity_per_day, overhead)
SELECT owner_id, location_id, DATE '2000-01-01', staff_per_day, electricity_per_day, COALESCE(overhead, 0)
FROM public.pos_factory_cost_settings
ON CONFLICT (location_id, effective_from) DO NOTHING;
