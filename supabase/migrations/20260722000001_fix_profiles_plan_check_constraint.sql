-- profiles.plan's check constraint predates the free/enterprise tiers introduced
-- by the plans table (005_billing.sql) and still only allows starter/growth/business.
-- Admin change_plan writes plan and plan_id together in one UPDATE, so setting
-- plan_id to 'free' or 'enterprise' fails the whole row on profiles_plan_check.
alter table public.profiles drop constraint if exists profiles_plan_check;
alter table public.profiles add constraint profiles_plan_check
  check (plan in ('free', 'starter', 'growth', 'business', 'enterprise'));
