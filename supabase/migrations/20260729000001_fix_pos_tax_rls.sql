-- ============================================================
-- AskBiz Migration — fix missing RLS on POS tax automation tables
-- Migration 027 created these tables with an owner_id column but
-- never enabled RLS, leaving them fully public via PostgREST
-- (flagged by Supabase Security Advisor: rls_disabled_in_public,
-- sensitive_columns_exposed on pos_location_tax_settings.tax_id).
-- ============================================================

alter table public.pos_tax_rules            enable row level security;
alter table public.pos_item_tax_codes       enable row level security;
alter table public.pos_tax_audit_log        enable row level security;
alter table public.pos_location_tax_settings enable row level security;

drop policy if exists "Owner manages tax rules" on public.pos_tax_rules;
create policy "Owner manages tax rules"
  on public.pos_tax_rules for all using (auth.uid() = owner_id);

drop policy if exists "Owner manages item tax codes" on public.pos_item_tax_codes;
create policy "Owner manages item tax codes"
  on public.pos_item_tax_codes for all using (auth.uid() = owner_id);

drop policy if exists "Owner manages tax audit log" on public.pos_tax_audit_log;
create policy "Owner manages tax audit log"
  on public.pos_tax_audit_log for all using (auth.uid() = owner_id);

drop policy if exists "Owner manages location tax settings" on public.pos_location_tax_settings;
create policy "Owner manages location tax settings"
  on public.pos_location_tax_settings for all using (auth.uid() = owner_id);
