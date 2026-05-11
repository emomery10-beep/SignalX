-- ============================================================
-- AskBiz Migration 019 — Compliance fields
-- Adds ICO number, VAT number to profiles
-- ============================================================

alter table public.profiles
  add column if not exists ico_number  text,
  add column if not exists vat_number  text;
