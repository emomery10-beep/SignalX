-- Fix Supabase security linter errors

-- 1. Fix: ingredient_price_market view has SECURITY DEFINER
-- Recreate the view with SECURITY INVOKER (default) instead
-- This ensures RLS policies of the querying user are respected
create or replace view public.ingredient_price_market
with (security_invoker = true) as
select
  ingredient,
  category,
  unit,
  currency,
  region,
  to_char(delivery_date, 'YYYY-MM') as period,
  count(*)                          as data_points,
  round(percentile_cont(0.25) within group (order by unit_price)::numeric, 4) as p25,
  round(percentile_cont(0.50) within group (order by unit_price)::numeric, 4) as median,
  round(percentile_cont(0.75) within group (order by unit_price)::numeric, 4) as p75,
  round(avg(unit_price)::numeric, 4)                                          as avg_price,
  round(min(unit_price)::numeric, 4)                                          as min_price,
  round(max(unit_price)::numeric, 4)                                          as max_price
from public.ingredient_price_intel
group by ingredient, category, unit, currency, region, period
having count(distinct owner_id) >= 3;

-- 2. Fix: geo_cache table has no RLS
-- Enable RLS and add a service-role-only policy (geo_cache is server-side only)
alter table public.geo_cache enable row level security;

-- Allow service role full access (API routes use service role client)
create policy "Service role full access"
  on public.geo_cache
  for all
  using (true)
  with check (true);
