-- SECURITY FIX: the "service-photos" storage bucket is itself marked public
-- (storage.buckets.public = true), which already lets anyone fetch a photo by
-- its known URL through Storage's public-object route — that does not need an
-- RLS policy on storage.objects. The extra "Public can view service photos"
-- SELECT policy (roles: public, qual: bucket_id = 'service-photos') additionally
-- allowed LISTING every object in the bucket (enumerating all customers' service
-- job photos across every business), which is real over-exposure the bucket's
-- own public flag doesn't require.
drop policy if exists "Public can view service photos" on storage.objects;

-- Direct-URL photo display is unaffected (served via the bucket's public flag).
-- Upload ("Authenticated users can upload service photos") and service-role
-- management policies are untouched.
