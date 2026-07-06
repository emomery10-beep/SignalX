-- Pending Shopify installs
-- Stores access tokens for merchants who installed the app from the Shopify App Store
-- before creating an AskBiz account. Linked when they sign in or register.

create table if not exists public.pending_shopify_installs (
  shop_domain   text primary key,
  access_token  text not null,          -- AES-256-GCM encrypted
  shop_name     text,
  installed_at  timestamptz default now(),
  linked_at     timestamptz,            -- set when a user links their account
  user_id       uuid references auth.users on delete set null
);

-- Allow service role full access; no RLS needed (service role only)
alter table public.pending_shopify_installs enable row level security;

-- Only the service role (backend) can read/write this table
drop policy if exists "service role only" on public.pending_shopify_installs;
create policy "service role only" on public.pending_shopify_installs
  as permissive for all
  to service_role
  using (true)
  with check (true);
