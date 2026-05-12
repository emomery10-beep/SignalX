-- ============================================================
-- AskBiz Migration 022 — POS image recognition
-- Stores AI analysis of inventory images for analytics
-- ============================================================

-- Store image-based inventory recognition data for analytics
create table if not exists public.pos_image_recognition (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  products jsonb not null,  -- Array of {name, quantity, category, confidence}
  image_size integer,
  created_at timestamp default now()
);

-- Enable RLS
alter table public.pos_image_recognition enable row level security;

-- RLS policy: owner only
create policy "Owner manages image recognition"
  on public.pos_image_recognition for all using (auth.uid() = owner_id);

create index if not exists idx_pos_image_owner_created
  on public.pos_image_recognition(owner_id, created_at desc);

-- Also add optional image columns to pos_items for future image storage
alter table if exists public.pos_items
  add column if not exists image_url text;

alter table if exists public.pos_items
  add column if not exists recognized_by_ai boolean default false;
