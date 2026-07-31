-- ============================================================
-- pos_payments: two independent fixes, same table, found together
-- during a data-eng audit of the POS section (2026-07-31).
--
-- 1) CHECK constraints block real WaafiPay/EVC Plus payments.
--    pos-askbiz's own migration (20260605000001_pos_payments.sql)
--    shipped `payment_method in ('mpesa','card','apple_pay','google_pay')`
--    and `provider in ('paystack','stripe')`. But
--    app/api/pos/payment/evc-plus/route.ts (built later, for the
--    Somalia WaafiPay rail) inserts payment_method one of
--    'evc_plus'/'waafi'/'zaad'/'sahal' and provider 'waafipay' —
--    none of which satisfy either constraint. The WaafiPay charge
--    itself (initiateWaafiPurchase) happens BEFORE this insert, so
--    money can move while AskBiz's own payment record silently fails
--    to be created — breaking receipt tracking/reconciliation and
--    surfacing a generic 500 to the cashier despite the customer
--    having already been charged. This was flagged as a tangential,
--    unconfirmed suspicion in an earlier session (see
--    pos-unified-data-conflict-bug memory) and is confirmed here by
--    reading the actual insert + constraint definitions together.
--    google_pay is dropped from the allow-list — grepped every
--    pos_payments insert site in both apps, nothing writes it.
--
-- 2) `amount numeric` (no precision/scale) — bare/unbounded, unlike
--    newer money columns elsewhere in the schema (numeric(12,2)).
--    Guarded: aborts instead of silently rounding if any existing
--    row already has more than 2 decimal places, which a numeric(12,2)
--    cast would otherwise truncate without warning.
-- ============================================================

-- ── 1. Widen payment_method / provider to the real live value set ──
DO $$
DECLARE
  v_conname text;
BEGIN
  SELECT conname INTO v_conname FROM pg_constraint
  WHERE conrelid = 'public.pos_payments'::regclass
    AND pg_get_constraintdef(oid) ILIKE '%payment_method%';
  IF v_conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.pos_payments DROP CONSTRAINT %I', v_conname);
  END IF;
END $$;

ALTER TABLE public.pos_payments
  ADD CONSTRAINT pos_payments_payment_method_check
  CHECK (payment_method IN ('mpesa', 'card', 'apple_pay', 'evc_plus', 'waafi', 'zaad', 'sahal'));

DO $$
DECLARE
  v_conname text;
BEGIN
  SELECT conname INTO v_conname FROM pg_constraint
  WHERE conrelid = 'public.pos_payments'::regclass
    AND pg_get_constraintdef(oid) ILIKE '%provider%' AND pg_get_constraintdef(oid) ILIKE '%CHECK%';
  IF v_conname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.pos_payments DROP CONSTRAINT %I', v_conname);
  END IF;
END $$;

ALTER TABLE public.pos_payments
  ADD CONSTRAINT pos_payments_provider_check
  CHECK (provider IN ('paystack', 'stripe', 'waafipay'));

-- ── 2. Precision/scale on amount ─────────────────────────────────
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.pos_payments WHERE amount IS NOT NULL AND scale(amount) > 2
  ) THEN
    RAISE EXCEPTION 'pos_payments.amount has rows with >2 decimal places — resolve manually before applying numeric(12,2), a cast would silently round them';
  END IF;
END $$;

ALTER TABLE public.pos_payments
  ALTER COLUMN amount TYPE numeric(12,2);
