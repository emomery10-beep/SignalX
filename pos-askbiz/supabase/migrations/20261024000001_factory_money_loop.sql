-- Phase 2 "money loop" for the Factory: who bought, who supplied, who has paid.
--   * pos_factory_parties   — customers (dispatch buyers) and suppliers (farmers / traders) by name + phone
--   * pos_factory_payments  — money received against a dispatch ('in') or paid out for a delivery ('out')
--   * pos_factory_captures  — party_id, due_date
--   * pos_factory_waybills  — capture_id (the dispatch this load belongs to), delivered_at, received_by
-- A receivable is an approved, priced dispatch minus the 'in' payments against it; a payable is an
-- approved, priced raw-material delivery minus the 'out' payments. Nothing here changes existing rows.

CREATE TABLE IF NOT EXISTS public.pos_factory_parties (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id   uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind       text        NOT NULL CHECK (kind IN ('customer', 'supplier')),
  name       text        NOT NULL,
  phone      text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS pos_factory_parties_name_uq ON public.pos_factory_parties (owner_id, kind, lower(name));
ALTER TABLE public.pos_factory_parties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "owner_all_factory_parties" ON public.pos_factory_parties;
CREATE POLICY "owner_all_factory_parties" ON public.pos_factory_parties FOR ALL USING (owner_id = auth.uid());

ALTER TABLE public.pos_factory_captures
  ADD COLUMN IF NOT EXISTS party_id uuid REFERENCES public.pos_factory_parties(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS due_date date;

CREATE TABLE IF NOT EXISTS public.pos_factory_payments (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  location_id  uuid        REFERENCES public.pos_locations(id) ON DELETE SET NULL,
  capture_id   uuid        NOT NULL REFERENCES public.pos_factory_captures(id) ON DELETE CASCADE,
  party_id     uuid        REFERENCES public.pos_factory_parties(id) ON DELETE SET NULL,
  direction    text        NOT NULL CHECK (direction IN ('in', 'out')),
  amount       numeric     NOT NULL CHECK (amount > 0),
  method       text        NOT NULL DEFAULT 'cash' CHECK (method IN ('cash', 'mobile_money', 'bank', 'cheque', 'other')),
  reference    text,
  paid_at      timestamptz NOT NULL DEFAULT now(),
  recorded_by  uuid        REFERENCES public.pos_staff(id) ON DELETE SET NULL,
  client_tx_id text,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pos_factory_payments_owner_idx ON public.pos_factory_payments (owner_id, paid_at DESC);
CREATE INDEX IF NOT EXISTS pos_factory_payments_capture_idx ON public.pos_factory_payments (capture_id);
CREATE UNIQUE INDEX IF NOT EXISTS pos_factory_payments_tx_uq ON public.pos_factory_payments (owner_id, client_tx_id) WHERE client_tx_id IS NOT NULL;
ALTER TABLE public.pos_factory_payments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "owner_all_factory_payments" ON public.pos_factory_payments;
CREATE POLICY "owner_all_factory_payments" ON public.pos_factory_payments FOR ALL USING (owner_id = auth.uid());

ALTER TABLE public.pos_factory_waybills
  ADD COLUMN IF NOT EXISTS capture_id uuid REFERENCES public.pos_factory_captures(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS received_by text;
