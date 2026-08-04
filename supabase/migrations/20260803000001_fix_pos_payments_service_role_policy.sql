-- ============================================================
-- Security fix: pos_payments "Service role full access" policy
-- (065_pos_payments.sql) was created without `TO service_role`,
-- so USING (true) / WITH CHECK (true) applied to ALL roles —
-- RLS policies are OR'd together, meaning any authenticated user
-- could read and write every merchant's payment rows, not just
-- their own. service_role bypasses RLS entirely and never needed
-- this policy to exist for its own access; the fix is simply to
-- scope it correctly, matching the pattern already used elsewhere
-- (e.g. 20250602_pending_shopify_installs.sql).
-- ============================================================

drop policy if exists "Service role full access on pos_payments" on public.pos_payments;

create policy "Service role full access on pos_payments"
  on public.pos_payments
  as permissive
  for all
  to service_role
  using (true)
  with check (true);
