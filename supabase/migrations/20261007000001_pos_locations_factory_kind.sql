-- Branch kind: lets one owner run several factories (sesame, coconut, ...) that
-- are kept apart from retail branches. 'factory' branches are the only ones
-- the Factory tab lists; everything a factory records is tagged by location_id.
-- factory_type is per-factory (profiles.factory_type is per-owner and can't
-- describe two different factories).
alter table public.pos_locations
  add column if not exists kind text not null default 'branch',
  add column if not exists factory_type text;

alter table public.pos_locations drop constraint if exists pos_locations_kind_check;
alter table public.pos_locations
  add constraint pos_locations_kind_check check (kind in ('branch', 'factory'));

-- Existing factories (matched by the owner's actual factory branches).
update public.pos_locations set kind = 'factory', factory_type = 'sesame_oil'
 where id = 'a9f4e4ae-1116-43f4-aa91-6ee37b90669b';
update public.pos_locations set kind = 'factory', factory_type = 'coconut_oil'
 where id = '19bc2dd4-0187-460c-9cc5-11f80f9b868d';
