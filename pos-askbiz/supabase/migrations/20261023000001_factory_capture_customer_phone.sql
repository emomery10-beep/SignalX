-- A dispatch's customer phone was stored in buyer_name (a name column). Give it its own column.
-- Existing numbers are COPIED, not moved: buyer_name is left as it was so nothing is lost and the old
-- code path keeps working; a later cleanup can null buyer_name where it equals the phone.
ALTER TABLE public.pos_factory_captures ADD COLUMN IF NOT EXISTS customer_phone text;

UPDATE public.pos_factory_captures
SET customer_phone = regexp_replace(buyer_name, '\D', '', 'g')
WHERE customer_phone IS NULL
  AND type = 'dispatch'
  AND buyer_name IS NOT NULL
  AND buyer_name ~ '^\+?[0-9][0-9 ()-]{6,19}$';
