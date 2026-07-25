-- ── ADVERTISE INQUIRIES (anonymous lead capture → admin follow-up) ──────
-- Powers the floating "Advertise here" bubble on the public signin/signup
-- brand panel (app/(auth)/signin/page.tsx). Unlike business_spotlights (a
-- merchant's own self-serve submission, gated behind auth — see
-- 20260720000001_business_spotlights.sql), this captures a lightweight,
-- fully anonymous contact-me lead from anyone considering advertising, for
-- an admin to review and follow up on (app/api/admin/spotlight-inquiries).
-- If it goes ahead, the admin builds the real business_spotlights entry by
-- hand — this table never feeds the public carousel directly.
create table if not exists public.advertise_inquiries (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  phone        text not null,
  email        text not null,
  status       text not null default 'pending' check (status in ('pending', 'contacted', 'dismissed')),
  notes        text,
  submitted_at timestamptz not null default now(),
  reviewed_at  timestamptz,
  reviewed_by  uuid references auth.users(id),
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

alter table public.advertise_inquiries enable row level security;

-- No client policies at all, intentionally — this holds raw PII (name/
-- phone/email) from unauthenticated visitors with no owner to scope reads
-- to, unlike business_spotlights' owner/public-approved policies. Every
-- insert and every admin read/action goes through service-role API routes
-- (app/api/advertise-inquiry, app/api/admin/spotlight-inquiries).

create index if not exists idx_advertise_inquiries_status on public.advertise_inquiries (status, submitted_at);

drop trigger if exists set_advertise_inquiries_updated_at on public.advertise_inquiries;
create trigger set_advertise_inquiries_updated_at
  before update on public.advertise_inquiries
  for each row execute procedure public.set_updated_at();
