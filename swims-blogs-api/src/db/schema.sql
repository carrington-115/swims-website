-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- Blocks table
create table if not exists blocks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_created timestamptz not null default now(),
  time_to_read integer not null check (time_to_read > 0),
  author text not null,
  profile_image text,
  name text not null,
  description text,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid not null references auth.users(id) on delete cascade
);

create index if not exists idx_blocks_slug on blocks (slug);
create index if not exists idx_blocks_user_id on blocks (user_id);

-- Sections table
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references blocks(id) on delete cascade,
  title text not null,
  content text,
  images jsonb,
  image_only text,
  order_index integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_sections_block_id on sections (block_id);
create unique index if not exists idx_sections_block_order on sections (block_id, order_index);

-- Table of contents table
create table if not exists table_of_contents (
  id uuid primary key default gen_random_uuid(),
  block_id uuid not null references blocks(id) on delete cascade,
  items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_toc_block_id on table_of_contents (block_id);

-- Updated_at trigger function
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger trg_blocks_updated_at
before update on blocks
for each row execute function set_updated_at();

create trigger trg_toc_updated_at
before update on table_of_contents
for each row execute function set_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================
alter table blocks enable row level security;
alter table sections enable row level security;
alter table table_of_contents enable row level security;

-- Blocks policies
create policy "Public can read blocks" on blocks for select using (true);
create policy "Owners can insert their own blocks" on blocks for insert with check (auth.uid() = user_id);
create policy "Owners can update their own blocks" on blocks for update using (auth.uid() = user_id);
create policy "Owners can delete their own blocks" on blocks for delete using (auth.uid() = user_id);

-- Sections policies
create policy "Public can read sections" on sections for select using (true);
create policy "Owners can manage sections of their blocks" on sections for all
  using (exists (select 1 from blocks b where b.id = sections.block_id and b.user_id = auth.uid()))
  with check (exists (select 1 from blocks b where b.id = sections.block_id and b.user_id = auth.uid()));

-- Table of contents policies
create policy "Public can read toc" on table_of_contents for select using (true);
create policy "Owners can manage toc of their blocks" on table_of_contents for all
  using (exists (select 1 from blocks b where b.id = table_of_contents.block_id and b.user_id = auth.uid()))
  with check (exists (select 1 from blocks b where b.id = table_of_contents.block_id and b.user_id = auth.uid()));
