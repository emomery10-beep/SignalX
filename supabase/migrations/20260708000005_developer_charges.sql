-- ============================================================
-- Phase 3 of the developer platform: billing-on-behalf-of, the Shopify
-- ApplicationCharge pattern — a developer creates a charge, the merchant
-- approves it, AskBiz collects payment, and (eventually) pays the developer
-- their share. See supabase/migrations/20260708000004_outbound_webhooks.sql
-- for the sibling Phase 2 piece.
--
-- IMPORTANT SCOPE LIMITATION, stated plainly rather than silently assumed
-- away: this migration builds charge REQUEST, APPROVAL, and COLLECTION
-- (money flows merchant -> AskBiz, via the same Stripe Checkout pattern
-- already used for POS-seat billing — app/api/billing/create-checkout-
-- session/route.ts). It does NOT build automatic developer PAYOUT
-- (AskBiz -> developer). That requires Stripe Connect (a distinct Stripe
-- product for multi-party marketplace payouts) or an equivalent, and no
-- such integration exists anywhere in this codebase today — grepped for
-- stripe.accounts / application_fee / Connect and found nothing. Building
-- fake payout automation without that infrastructure would mean silently
-- pretending money moves when it doesn't. Instead, developer_payouts_ledger
-- tracks what's OWED per developer as a running balance for manual
-- reconciliation (bank transfer, etc.) until Stripe Connect (or similar) is
-- actually integrated — a separate, scoped follow-up.
--
-- Also note: this charge flow identifies the merchant to bill by email at
-- charge-creation time, not through a persistent "app installed on this
-- merchant" grant — because that grant model (OAuth app installs across
-- many merchants) is Phase 4, not built yet. Each charge is a one-off
-- authorization, not a standing permission.
-- ============================================================

create table if not exists public.developer_charges (
  id                    uuid primary key default gen_random_uuid(),
  key_id                uuid not null references public.api_keys(id) on delete cascade,
  merchant_email        text not null,
  merchant_user_id      uuid references auth.users(id) on delete set null,  -- resolved on approval
  amount_cents          integer not null check (amount_cents > 0),
  currency              text not null default 'gbp',
  description           text not null,
  status                text not null default 'pending'
                          check (status in ('pending', 'approved', 'declined', 'expired', 'failed')),
  platform_fee_percent  numeric not null default 15,   -- snapshot at creation time; see plan doc for why flat-from-dollar-one rather than Shopify's $1M threshold
  confirmation_token    text not null unique,
  stripe_checkout_session_id text,
  created_at            timestamptz not null default now(),
  approved_at           timestamptz,
  expires_at            timestamptz not null default (now() + interval '7 days')
);
create index if not exists developer_charges_key_id_idx on public.developer_charges(key_id);
create index if not exists developer_charges_merchant_email_idx on public.developer_charges(merchant_email);
create index if not exists developer_charges_token_idx on public.developer_charges(confirmation_token);

alter table public.developer_charges enable row level security;
-- The developer (via their key's owner) can read charges they created.
-- The merchant being charged can also read+update (approve/decline) rows
-- addressed to their own verified email — matched by email since
-- merchant_user_id is null until approval.
drop policy if exists "developer_charges_creator_select" on public.developer_charges;
create policy "developer_charges_creator_select" on public.developer_charges for select
  using (
    exists (select 1 from public.api_keys where api_keys.id = developer_charges.key_id and api_keys.user_id = auth.uid())
    or merchant_email = (auth.jwt() ->> 'email')
  );
-- Deliberately narrow: a merchant can only ever self-service DECLINE a
-- charge via this policy. Approval is never client-writable — it only
-- happens server-side (service role, bypassing RLS) after the Stripe
-- webhook confirms real payment. Without the status='declined' restriction
-- here, a merchant could PATCH status='approved' directly via PostgREST
-- and receive the charge's benefit without ever paying.
drop policy if exists "developer_charges_merchant_decline" on public.developer_charges;
create policy "developer_charges_merchant_decline" on public.developer_charges for update
  using (merchant_email = (auth.jwt() ->> 'email') and status = 'pending')
  with check (merchant_email = (auth.jwt() ->> 'email') and status = 'declined');

create table if not exists public.developer_payouts_ledger (
  id                  uuid primary key default gen_random_uuid(),
  key_id              uuid not null references public.api_keys(id) on delete cascade,
  charge_id           uuid not null references public.developer_charges(id) on delete cascade,
  developer_share_cents integer not null check (developer_share_cents >= 0),
  status              text not null default 'owed' check (status in ('owed', 'paid')),
  created_at          timestamptz not null default now(),
  paid_at             timestamptz
);
create index if not exists developer_payouts_ledger_key_id_idx on public.developer_payouts_ledger(key_id);

alter table public.developer_payouts_ledger enable row level security;
drop policy if exists "developer_payouts_ledger_owner_select" on public.developer_payouts_ledger;
create policy "developer_payouts_ledger_owner_select" on public.developer_payouts_ledger for select
  using (exists (select 1 from public.api_keys where api_keys.id = developer_payouts_ledger.key_id and api_keys.user_id = auth.uid()));
