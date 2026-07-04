-- ============================================================
-- Product photos for inventory items
-- The low-literacy setup flow uses the photo as the product's
-- visual identity (a vendor who can't read recognises their
-- items by picture). Migration 022 added image_url to pos_items
-- (receipt lines) only — inventory itself never had one.
-- ============================================================

alter table public.inventory add column if not exists image_url text;

-- Public bucket, deliberately: product photos are not sensitive, and
-- image_url is consumed via plain <img> tags across the POS UI (same
-- consumption pattern as service-photos' getPublicUrl). Files are
-- namespaced per owner: product-photos/{owner_id}/{timestamp}.jpg
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-photos', 'product-photos', true)
ON CONFLICT (id) DO NOTHING;
