-- Enable pgcrypto for gen_random_uuid()
create extension if not exists pgcrypto;

-- ============================================================
-- Authors
-- ============================================================
-- One row per Supabase user who has written something. The API upserts it from
-- the access token on every authenticated write and never from a request body,
-- so a byline always names the account that actually made the post.
create table if not exists authors (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Blogs
-- ============================================================
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date_created timestamptz not null default now(),
  time_to_read integer not null check (time_to_read > 0),
  name text not null,
  description text,
  category text,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- References `authors`, not `auth.users`, for two reasons: an author row must
  -- exist before anything can be credited to it, and PostgREST can only embed
  -- `author:authors(*)` across a declared foreign key.
  user_id uuid not null references authors(id) on delete cascade
);

create index if not exists idx_blogs_slug on blogs (slug);
create index if not exists idx_blogs_user_id on blogs (user_id);
create index if not exists idx_blogs_status_date on blogs (status, date_created desc);
create index if not exists idx_blogs_category on blogs (category);

-- ============================================================
-- Sections
-- ============================================================
create table if not exists sections (
  id uuid primary key default gen_random_uuid(),
  blog_id uuid not null references blogs(id) on delete cascade,
  title text not null,
  content text,
  images jsonb,
  image_only text,
  order_index integer not null default 0,
  created_at timestamptz not null default now(),
  -- Deferred: a reorder rewrites every row's index in one statement and the
  -- intermediate states collide. An immediate constraint made reordering
  -- impossible -- swapping two sections failed on the first of the two writes.
  constraint sections_blog_order_key unique (blog_id, order_index)
    deferrable initially deferred
);

create index if not exists idx_sections_blog_id on sections (blog_id);

-- There is no table_of_contents table. The contents are a projection of the
-- sections, built on read by `buildToc` in the API, so a heading and its entry
-- cannot drift apart and a deleted section cannot leave an orphan entry.

-- ============================================================
-- updated_at
-- ============================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_authors_updated_at on authors;
create trigger trg_authors_updated_at
before update on authors
for each row execute function set_updated_at();

drop trigger if exists trg_blogs_updated_at on blogs;
create trigger trg_blogs_updated_at
before update on blogs
for each row execute function set_updated_at();

-- ============================================================
-- Writes that have to be atomic
-- ============================================================

-- Creates a blog and all of its sections as one unit. The Supabase JS client
-- cannot open a transaction, so a nested create issued as separate inserts
-- would leave a blog with half its sections behind whenever one of them failed.
--
-- Security invoker (the default) on purpose: the API calls this with the
-- service-role key, which bypasses RLS anyway, and leaving it invoker means the
-- same call made with an anon key is still policed by the policies below.
create or replace function create_blog_with_sections(
  p_user_id uuid,
  p_blog jsonb,
  p_sections jsonb
)
returns uuid
language plpgsql
set search_path = public
as $$
declare
  v_status text := coalesce(p_blog ->> 'status', 'draft');
  v_blog_id uuid;
begin
  insert into blogs (
    title, time_to_read, name, description, category,
    cover_image, status, published_at, slug, user_id
  )
  values (
    p_blog ->> 'title',
    (p_blog ->> 'time_to_read')::integer,
    p_blog ->> 'name',
    p_blog ->> 'description',
    p_blog ->> 'category',
    p_blog ->> 'cover_image',
    v_status,
    case when v_status = 'published' then now() end,
    p_blog ->> 'slug',
    p_user_id
  )
  returning id into v_blog_id;

  -- Ordinality is the order the client sent them in; any orderIndex on a nested
  -- section is ignored, because position in the array already says it.
  insert into sections (blog_id, title, content, images, image_only, order_index)
  select
    v_blog_id,
    item ->> 'title',
    item ->> 'content',
    case when jsonb_typeof(item -> 'images') = 'array' then item -> 'images' end,
    item ->> 'image_only',
    (ord - 1)::integer
  from jsonb_array_elements(coalesce(p_sections, '[]'::jsonb))
    with ordinality as t(item, ord);

  return v_blog_id;
end;
$$;

-- Rewrites the order of a blog's sections in one statement, against the
-- deferred unique constraint above. The id list must be exactly the blog's
-- sections: a partial list would leave holes or duplicate an index.
create or replace function reorder_sections(
  p_blog_id uuid,
  p_section_ids uuid[]
)
returns void
language plpgsql
set search_path = public
as $$
begin
  if (select count(*) from sections where blog_id = p_blog_id)
       <> coalesce(array_length(p_section_ids, 1), 0)
     or exists (
       select 1
       from unnest(p_section_ids) as wanted(id)
       where not exists (
         select 1 from sections s where s.id = wanted.id and s.blog_id = p_blog_id
       )
     )
  then
    raise exception 'section ids must be exactly the sections of this blog'
      using errcode = '23514';
  end if;

  update sections s
  set order_index = (t.ord - 1)::integer
  from unnest(p_section_ids) with ordinality as t(id, ord)
  where s.id = t.id;
end;
$$;

-- ============================================================
-- Row Level Security
-- ============================================================
-- These police direct browser access with the anon key. The API holds the
-- service-role key and bypasses them, so it enforces the same rules itself in
-- `requireOwnedBlog`.
alter table authors enable row level security;
alter table blogs enable row level security;
alter table sections enable row level security;

-- Authors
drop policy if exists "Public can read authors" on authors;
create policy "Public can read authors" on authors for select using (true);

drop policy if exists "Users can insert their own author row" on authors;
create policy "Users can insert their own author row" on authors for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own author row" on authors;
create policy "Users can update their own author row" on authors for update
  using (auth.uid() = id);

-- Blogs. A draft is readable only by its own author.
drop policy if exists "Public can read blogs" on blogs;
drop policy if exists "Public can read published blogs" on blogs;
create policy "Public can read published blogs" on blogs for select
  using (status = 'published' or auth.uid() = user_id);

drop policy if exists "Owners can insert their own blogs" on blogs;
create policy "Owners can insert their own blogs" on blogs for insert
  with check (auth.uid() = user_id);

drop policy if exists "Owners can update their own blogs" on blogs;
create policy "Owners can update their own blogs" on blogs for update
  using (auth.uid() = user_id);

drop policy if exists "Owners can delete their own blogs" on blogs;
create policy "Owners can delete their own blogs" on blogs for delete
  using (auth.uid() = user_id);

-- Sections follow their blog: readable when the blog is, writable by its owner.
drop policy if exists "Public can read sections" on sections;
drop policy if exists "Public can read sections of readable blogs" on sections;
create policy "Public can read sections of readable blogs" on sections for select
  using (exists (
    select 1 from blogs b
    where b.id = sections.blog_id
      and (b.status = 'published' or b.user_id = auth.uid())
  ));

drop policy if exists "Owners can manage sections of their blogs" on sections;
create policy "Owners can manage sections of their blogs" on sections for all
  using (exists (select 1 from blogs b where b.id = sections.blog_id and b.user_id = auth.uid()))
  with check (exists (select 1 from blogs b where b.id = sections.blog_id and b.user_id = auth.uid()));
