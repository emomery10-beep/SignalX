-- Migration 010: Shareable Insight Links
-- Creates a public-readable shared_insights table with short IDs

create table if not exists public.shared_insights (
  id            text primary key default substr(md5(random()::text), 1, 8),
  user_id       uuid references auth.users(id) on delete set null,
  question      text not null,
  answer_text   text not null,
  insight_header text,
  kpi_cards     jsonb,
  chart_type    text,
  chart_labels  jsonb,
  chart_values  jsonb,
  chart_label   text,
  recommendations jsonb,
  view_count    integer default 0,
  created_at    timestamptz default now(),
  expires_at    timestamptz default (now() + interval '90 days')
);

-- Public read access (no auth needed for viewing shared links)
alter table public.shared_insights enable row level security;

create policy "Public can view shared insights"
  on public.shared_insights for select
  using (true);

create policy "Authenticated users can insert"
  on public.shared_insights for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Increment view count function
create or replace function public.increment_insight_views(insight_id text)
returns void language plpgsql security definer as $$
begin
  update public.shared_insights
  set view_count = view_count + 1
  where id = insight_id;
end;
$$;

-- Index for fast lookup
create index if not exists shared_insights_created_at_idx on public.shared_insights(created_at desc);
