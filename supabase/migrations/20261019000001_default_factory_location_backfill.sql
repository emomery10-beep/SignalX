-- Every manufacturer needs a factory location: production, stock, the CFO and Intelligence all read a factory's
-- captures through it (kind = 'factory'). New accounts now get one automatically (lib/ensure-factory-location.ts);
-- this gives the manufacturers who registered earlier the same, from their own registration answers.
insert into public.pos_locations (owner_id, name, kind, factory_type)
select p.id, 'Main factory', 'factory', coalesce(p.factory_type, 'other')
from public.profiles p
where (p.business_type = 'manufacturer' or p.factory_type is not null)
  and not exists (select 1 from public.pos_locations l where l.owner_id = p.id and l.kind = 'factory')
on conflict do nothing;

-- Captures logged before a factory existed belong to the owner's one factory (only when there is exactly one).
update public.pos_factory_captures c
   set location_id = f.id
  from (
    select owner_id, min(id::text)::uuid as id
      from public.pos_locations
     where kind = 'factory' and is_active
     group by owner_id
    having count(*) = 1
  ) f
 where c.owner_id = f.owner_id and c.location_id is null;
