-- Tag an expense to a part of the business so factory costs can be told apart from
-- retail and shared ones. 'shared' (the default) = not allocated, i.e. exactly how
-- every existing expense behaves today. Additive and safe: no existing row changes.
alter table cfo_expenses
  add column if not exists segment text not null default 'shared' check (segment in ('shared','retail','factory')),
  add column if not exists location_id uuid references pos_locations(id) on delete set null;

create index if not exists idx_cfo_expenses_segment on cfo_expenses(user_id, segment, location_id);
