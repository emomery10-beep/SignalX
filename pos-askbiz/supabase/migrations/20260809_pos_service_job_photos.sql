-- ============================================================
-- AskBiz Migration — unlimited repair-job progress photos.
--
-- Supersedes the fixed checkout_photo_url/replaced_part_photo_url slots
-- (still present, left alone, just unused by the new UI) with an
-- unlimited, append-only gallery: a technician can add photos any time a
-- job is 'in_progress' or 'completed', and a separate manual action shares
-- whatever hasn't been shared yet with the customer over WhatsApp in one
-- message (shared_at tracks what's already gone out, so re-sharing later
-- only picks up what's new — no re-sending the same photo twice).
-- ============================================================

create table if not exists public.pos_service_job_photos (
  id          uuid primary key default gen_random_uuid(),
  job_id      uuid not null references public.pos_service_jobs(id) on delete cascade,
  owner_id    uuid not null references auth.users(id) on delete cascade,
  photo_url   text not null,
  stage       text not null check (stage in ('in_progress', 'completed')),
  caption     text,
  created_by  uuid references public.pos_staff(id) on delete set null,
  created_at  timestamptz default now(),
  shared_at   timestamptz  -- null = not yet sent to the customer
);

alter table public.pos_service_job_photos enable row level security;

create policy "Owner manages service job photos"
  on public.pos_service_job_photos for all using (
    job_id in (select id from public.pos_service_jobs where owner_id = auth.uid())
  );

create index if not exists idx_service_job_photos_job     on public.pos_service_job_photos(job_id, created_at desc);
create index if not exists idx_service_job_photos_owner   on public.pos_service_job_photos(owner_id);
create index if not exists idx_service_job_photos_unshared on public.pos_service_job_photos(job_id) where shared_at is null;
