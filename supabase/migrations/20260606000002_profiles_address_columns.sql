-- Add business address columns to profiles so the settings form can persist
-- sender address used by parcel quotes and the logistics/intelligence dashboards.

alter table public.profiles
  add column if not exists business_name text,
  add column if not exists phone         text,
  add column if not exists address       text,
  add column if not exists town          text,
  add column if not exists county        text,
  add column if not exists postcode      text;
