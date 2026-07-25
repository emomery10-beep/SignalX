-- ============================================================
-- Email campaign performance (Mailchimp + Klaviyo) — doesn't fit
-- unified_data or social_signals. help-content.ts's "Email Marketing
-- Analytics" section already describes both connectors sharing one
-- unified view, hence one shared table keyed by source_type.
-- Written by lib/sync/engine.ts's syncMailchimp() and syncKlaviyo().
-- ============================================================

create table if not exists public.email_campaigns (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users on delete cascade,
  source_id       uuid references public.connected_sources on delete cascade,
  source_type     text not null check (source_type in ('mailchimp', 'klaviyo')),
  campaign_id     text not null,
  campaign_name   text default '',
  sent_at         timestamptz,
  recipients      integer default 0,
  opens           integer default 0,
  open_rate       numeric default 0,
  clicks          integer default 0,
  click_rate      numeric default 0,
  unsubscribes    integer default 0,
  revenue         numeric default 0,
  currency        text default 'GBP',
  raw_data        jsonb,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  unique(user_id, source_type, campaign_id)
);

create index if not exists email_campaigns_user_sent_idx
  on public.email_campaigns(user_id, sent_at desc);

alter table public.email_campaigns enable row level security;

create policy "Users can view their own email campaigns"
  on public.email_campaigns for select
  using (auth.uid() = user_id);
