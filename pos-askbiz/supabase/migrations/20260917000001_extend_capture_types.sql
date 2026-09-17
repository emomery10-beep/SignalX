-- Extend pos_factory_captures.type to include intake_arrival and intake_feed
-- These types were added to the API but blocked by the CHECK constraint

ALTER TABLE public.pos_factory_captures
  DROP CONSTRAINT pos_factory_captures_type_check;

ALTER TABLE public.pos_factory_captures
  ADD CONSTRAINT pos_factory_captures_type_check
  CHECK (type IN ('intake', 'intake_arrival', 'intake_feed', 'output', 'wastage', 'dispatch', 'packaging'));
