-- ============================================================
-- AskBiz Migration — repair intake condition photos.
-- pos_service_jobs previously only had singular intake_photo_url/
-- checkout_photo_url text columns, with no way to store the full
-- set of condition photos (front/back/screen/sides) captured
-- during intake. Those extra photos were uploaded via a separate,
-- fire-and-forget endpoint that silently overwrote rather than
-- appended — meaning only the last-uploaded extra photo actually
-- persisted, even online. This column makes the full set explicit
-- and lets the intake POST route store all of them inline in one
-- request (required for offline queueing).
-- ============================================================

alter table public.pos_service_jobs
  add column if not exists condition_photo_urls jsonb default '[]'::jsonb;
