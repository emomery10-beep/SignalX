-- ============================================================
-- Sandbox / test-mode API keys — Phase 1 of the developer-platform
-- gap-audit follow-up (127-item audit, this session). Today every API key
-- is a live key: a developer's first /whatsapp/send call sends a real
-- message, their first /scan debits their real wallet, their first
-- /charges call can end in a real Stripe payment. There is nowhere safe
-- to try the API before shipping against it. This migration adds the
-- schema for a test/live distinction; the app-layer enforcement (early
-- returns before any real external call, in scan/whatsapp/send/charges)
-- ships alongside it in the same PR — see lib/api-v1-auth.ts and the
-- three route handlers.
--
-- key_env lives on api_keys (the source of truth) and is mirrored onto
-- developer_charges at charge-creation time (denormalized on purpose —
-- the approve route and the Stripe webhook both need to branch on it
-- without an extra join back to api_keys). developer_connections gets no
-- column: test-env keys are rejected before a connections row can ever
-- be created (app/api/v1/connections/route.ts), so there's nothing to
-- tag.
--
-- The developer_charges guard constraint below is the hard stop for the
-- money path: even a future bug that mistakenly calls
-- stripe.checkout.sessions.create for a test-env charge cannot persist a
-- session id against that row, and the Stripe webhook only ever acts on
-- rows that carry one. Combined with the approve route's structural split
-- (simulateTestApproval() as a fully separate function from the real
-- Stripe-calling code — not an if/else around the same call site), a test
-- charge is enforced as unable to reach Stripe at two independent layers,
-- not just one `if`.
-- ============================================================

alter table public.api_keys
  add column if not exists key_env text not null default 'live'
    check (key_env in ('live', 'test'));

alter table public.developer_charges
  add column if not exists key_env text not null default 'live'
    check (key_env in ('live', 'test'));

-- The hard guard: a test-env charge can never carry a real Stripe
-- Checkout session id. Existing rows are all key_env='live' (the column
-- default just added) with whatever stripe_checkout_session_id they
-- already have, so this constraint is satisfied by every existing row
-- without a backfill.
alter table public.developer_charges drop constraint if exists developer_charges_test_no_stripe_session;
alter table public.developer_charges
  add constraint developer_charges_test_no_stripe_session
    check (key_env <> 'test' or stripe_checkout_session_id is null);

create index if not exists api_keys_key_env_idx on public.api_keys(key_env);
