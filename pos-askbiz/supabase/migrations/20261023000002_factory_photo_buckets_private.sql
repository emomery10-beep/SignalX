-- Factory photos live in PRIVATE buckets and are served through short-lived signed URLs.
-- Creating a bucket that already exists is a no-op: an existing bucket's visibility is NOT changed here,
-- because rows written by older code hold public URLs. Check Storage > each bucket in the dashboard and
-- make it private only after scripts/factory-photos-migrate.mjs has converted the old rows.
INSERT INTO storage.buckets (id, name, public) VALUES
  ('factory-captures', 'factory-captures', false),
  ('factory-batch-events', 'factory-batch-events', false),
  ('factory-quality-photos', 'factory-quality-photos', false),
  ('factory-shift-photos', 'factory-shift-photos', false),
  ('factory-downtime-photos', 'factory-downtime-photos', false),
  ('factory-waybill-photos', 'factory-waybill-photos', false)
ON CONFLICT (id) DO NOTHING;
