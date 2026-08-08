-- ============================================================
-- AskBiz Migration — repair "replaced part" photo.
-- pos_service_jobs already has checkout_photo_url (photo of the
-- repaired device, shown to the customer at hand-off) but no column
-- for a photo of the part that was swapped out (e.g. the old broken
-- screen) — needed so the engineer can show the customer proof of
-- what was actually replaced when marking a job ready for collection.
-- ============================================================

alter table public.pos_service_jobs
  add column if not exists replaced_part_photo_url text;
