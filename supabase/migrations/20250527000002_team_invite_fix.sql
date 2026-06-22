-- Comprehensive fix for team_members table
-- The production table was created from an older migration (002)
-- but the API expects the schema from (012). This reconciles them.

-- 1. Add all missing columns
alter table public.team_members
  add column if not exists name text,
  add column if not exists accepted_at timestamptz,
  add column if not exists org_id uuid,
  add column if not exists invite_token text unique,
  add column if not exists invite_expires_at timestamptz;

-- 2. Backfill org_id from team_id if needed
do $$
begin
  execute 'update public.team_members set org_id = team_id where org_id is null and team_id is not null';
exception when undefined_column then
  null;
end $$;

-- 3. Create indexes
create index if not exists team_members_org on public.team_members(org_id, status);
create index if not exists team_members_user on public.team_members(user_id);
create index if not exists team_members_token on public.team_members(invite_token);

-- 4. Drop old restrictive check constraints (old migration only allowed owner|editor|viewer)
alter table public.team_members drop constraint if exists team_members_role_check;
alter table public.team_members drop constraint if exists team_members_status_check;

-- 5. Add unique constraint for upsert support
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'team_members_org_email_unique'
  ) then
    alter table public.team_members
      add constraint team_members_org_email_unique unique (org_id, email);
  end if;
end $$;

-- 6. Update RLS policy to include org_id
drop policy if exists "Users see their team" on public.team_members;
create policy "Users see their team" on public.team_members
  for all using (auth.uid() = org_id or auth.uid() = user_id);
