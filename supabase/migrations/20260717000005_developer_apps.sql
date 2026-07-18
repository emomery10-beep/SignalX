-- ============================================================
-- Phase 3 of the developer platform: a named "app" entity, distinct from a
-- raw api_keys row. Today every api_keys row is BOTH the developer's
-- identity and the credential — there's no way to group multiple
-- keys/connections under one named, branded integration the way a merchant
-- sees "App XYZ wants access" on a real OAuth-style consent screen. This is
-- purely additive: app_id is nullable everywhere, so every existing key and
-- connection keeps working completely unchanged. Grouping under an app is
-- opt-in, not required.
-- ============================================================

create table if not exists public.developer_apps (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  name         text not null,
  logo_url     text,
  redirect_uri text,
  created_at   timestamptz not null default now()
);
create index if not exists developer_apps_user_id_idx on public.developer_apps(user_id);

alter table public.api_keys add column if not exists app_id uuid references public.developer_apps(id) on delete set null;
create index if not exists api_keys_app_id_idx on public.api_keys(app_id) where app_id is not null;

-- Denormalized from the key at connection-creation time (not a live join)
-- so the merchant consent screen in /connect/[token] can show "App XYZ
-- wants read_inventory" without an extra round-trip, and so it keeps
-- reflecting the app that actually requested it even if the key is later
-- moved to a different app or deleted. Added BEFORE the RLS policy below,
-- which references this column — a prior version of this migration had
-- these in the wrong order and failed to apply for exactly that reason.
alter table public.developer_connections add column if not exists app_id uuid references public.developer_apps(id) on delete set null;

alter table public.developer_apps enable row level security;
-- Mirrors api_keys' own RLS policy exactly (20260622000004_api_keys_and_usage_v1.sql).
drop policy if exists "developer_apps_owner_all" on public.developer_apps;
create policy "developer_apps_owner_all" on public.developer_apps for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- A merchant reviewing a connection request (app/connect/[token]) needs to
-- see the requesting app's name/logo, but they are NOT the app's owner —
-- without this, the owner-only policy above would silently block the
-- merchant consent screen from resolving app_id to a real name. Read-only,
-- and only for merchants who actually have a connection referencing this app.
drop policy if exists "developer_apps_connected_merchant_select" on public.developer_apps;
create policy "developer_apps_connected_merchant_select" on public.developer_apps for select
  using (
    exists (
      select 1 from public.developer_connections
      where developer_connections.app_id = developer_apps.id
        and developer_connections.merchant_email = (auth.jwt() ->> 'email')
    )
  );
