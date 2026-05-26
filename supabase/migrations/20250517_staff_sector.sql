-- Add sector assignment and edit-count limit to pos_staff
alter table pos_staff
  add column if not exists sector text default 'retail',
  add column if not exists sector_edit_count int not null default 0;
