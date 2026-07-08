-- ============================================================
-- Phase 4 of the developer platform, scoped down from full OAuth app
-- installs (the original plan's Phase 4) to something far lower-risk: a
-- persistent, revocable CONNECTION between one developer API key and many
-- merchants, each of whom explicitly approves. Full OAuth would mean
-- rewriting RLS across every owner-scoped table in the schema (inventory,
-- pos_transactions, purchase_orders, ...) to understand "app X, acting for
-- merchant Y, with scopes Z" — a genuine schema/security redesign. This
-- instead reuses the exact pattern Phase 3 (developer_charges) already
-- proved out: identify the merchant by email, they approve via a hosted
-- confirmation page, and the connection becomes a durable row instead of a
-- one-off authorization.
--
-- What this unlocks concretely: a developer's key can now request access to
-- MANY merchants (one connection row each), and endpoints that accept an
-- optional merchant_id (see app/api/v1/scan/route.ts) validate an active
-- connection before scoping data to that merchant instead of the key's own
-- owner. That is real multi-tenancy for the read paths that adopt it — it
-- is NOT a blanket grant across every table/endpoint; each endpoint has to
-- explicitly check the connection, same as /api/v1/scan does here.
--
-- Unlike developer_charges' approval step, connecting has no payment
-- involved, so — unlike that flow — the merchant can safely approve/revoke
-- directly via RLS-permitted client writes; there's no "approve without
-- paying" exploit to guard against here.
-- ============================================================

create table if not exists public.developer_connections (
  id                 uuid primary key default gen_random_uuid(),
  key_id             uuid not null references public.api_keys(id) on delete cascade,
  merchant_email     text not null,
  merchant_user_id   uuid references auth.users(id) on delete cascade,
  status             text not null default 'pending'
                       check (status in ('pending', 'active', 'revoked', 'expired')),
  confirmation_token text not null unique,
  created_at         timestamptz not null default now(),
  approved_at        timestamptz,
  revoked_at         timestamptz,
  expires_at         timestamptz not null default (now() + interval '7 days')
);
create index if not exists developer_connections_key_id_idx on public.developer_connections(key_id);
create index if not exists developer_connections_merchant_user_id_idx on public.developer_connections(merchant_user_id);
create index if not exists developer_connections_token_idx on public.developer_connections(confirmation_token);
-- One active connection per (key, merchant) — re-approving after a revoke
-- creates a fresh row rather than reactivating the old one, so the
-- audit trail of "was this ever revoked" is never overwritten.
create unique index if not exists developer_connections_active_unique
  on public.developer_connections(key_id, merchant_user_id)
  where status = 'active';

alter table public.developer_connections enable row level security;

drop policy if exists "developer_connections_creator_select" on public.developer_connections;
create policy "developer_connections_creator_select" on public.developer_connections for select
  using (
    exists (select 1 from public.api_keys where api_keys.id = developer_connections.key_id and api_keys.user_id = auth.uid())
    or merchant_email = (auth.jwt() ->> 'email')
  );

-- Merchant can approve (pending -> active, claiming merchant_user_id as
-- themselves) or decline (pending -> revoked), and can revoke an
-- already-active connection at any time. No path lets them set
-- merchant_user_id to anyone but themselves, or move status backwards from
-- revoked to active.
drop policy if exists "developer_connections_merchant_update" on public.developer_connections;
create policy "developer_connections_merchant_update" on public.developer_connections for update
  using (
    merchant_email = (auth.jwt() ->> 'email')
    and status in ('pending', 'active')
  )
  with check (
    merchant_email = (auth.jwt() ->> 'email')
    and (
      -- Approving MUST claim merchant_user_id as the caller — an active
      -- connection with a null merchant_user_id would silently break every
      -- endpoint that looks up access by merchant_user_id (see
      -- app/api/v1/scan/route.ts), so this isn't optional the way it was
      -- in the first draft of this policy.
      (status = 'active' and merchant_user_id = auth.uid())
      -- Declining (from pending) or disconnecting (from active) doesn't
      -- need merchant_user_id to be anything in particular.
      or status = 'revoked'
    )
  );
