-- Per-factory labour / electricity / overhead assumptions, so the Factory tab
-- and the CFO read ONE set of numbers. One row per factory location.
-- Starting values are country-specific and applied in code (lib/factory-cost-defaults.ts);
-- a missing row means "not set yet" (or the country default), never another country's rates.
create table if not exists pos_factory_cost_settings (
  location_id       uuid primary key references pos_locations(id) on delete cascade,
  owner_id          uuid not null references auth.users(id) on delete cascade,
  staff_per_day     numeric not null default 0 check (staff_per_day >= 0),
  electricity_per_day numeric not null default 0 check (electricity_per_day >= 0),
  overhead          numeric not null default 0 check (overhead >= 0),
  -- how electricity_per_day was worked out, so the editor can re-open it
  -- e.g. {"mode":"monthly_bill","monthly_bill":35000,"working_days":26}
  electricity_basis jsonb,
  updated_at        timestamptz not null default now()
);

create index if not exists idx_factory_cost_settings_owner on pos_factory_cost_settings(owner_id);

alter table pos_factory_cost_settings enable row level security;

drop policy if exists "Owner manages factory cost settings" on pos_factory_cost_settings;
create policy "Owner manages factory cost settings"
  on pos_factory_cost_settings for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

revoke all on pos_factory_cost_settings from anon;
