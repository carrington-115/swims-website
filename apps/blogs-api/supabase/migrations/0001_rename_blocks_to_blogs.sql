-- Renames the "block" domain to "blog" across the schema: table, columns,
-- indexes, constraints, the updated_at trigger, and the RLS policy names.
--
-- Run this against any database created from the pre-rename schema.sql BEFORE
-- deploying the renamed API -- the API now selects from `blogs` and reads
-- `blog_id`, so it returns errors against the old names.
--
-- Every step checks the old name still exists first, so re-running is a no-op
-- and a database created from the current schema.sql is left untouched.
--
-- Row data is not touched: these are catalog renames, so no rewrite and no
-- downtime beyond the lock each statement takes.

begin;

-- 1. The table itself.
do $$
begin
  if to_regclass('public.blocks') is not null and to_regclass('public.blogs') is null then
    alter table public.blocks rename to blogs;
  end if;
end $$;

-- 2. The foreign-key columns on the two child tables.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'sections' and column_name = 'block_id'
  ) then
    alter table public.sections rename column block_id to blog_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'table_of_contents' and column_name = 'block_id'
  ) then
    alter table public.table_of_contents rename column block_id to blog_id;
  end if;
end $$;

-- 3. Indexes. Renaming a constraint-backing index renames the constraint with
--    it, which is why blogs_pkey and blogs_slug_key are handled here.
do $$
declare
  r record;
begin
  for r in select * from (values
    ('idx_blocks_slug',          'idx_blogs_slug'),
    ('idx_blocks_user_id',       'idx_blogs_user_id'),
    ('idx_sections_block_id',    'idx_sections_blog_id'),
    ('idx_sections_block_order', 'idx_sections_blog_order'),
    ('idx_toc_block_id',         'idx_toc_blog_id'),
    ('blocks_pkey',              'blogs_pkey'),
    ('blocks_slug_key',          'blogs_slug_key')
  ) as t(old_name, new_name)
  loop
    if to_regclass('public.' || r.old_name) is not null
       and to_regclass('public.' || r.new_name) is null then
      execute format('alter index public.%I rename to %I', r.old_name, r.new_name);
    end if;
  end loop;
end $$;

-- 4. Constraints that carry no index of their own.
do $$
declare
  r record;
begin
  for r in select * from (values
    ('blogs',             'blocks_time_to_read_check',      'blogs_time_to_read_check'),
    ('blogs',             'blocks_user_id_fkey',            'blogs_user_id_fkey'),
    ('sections',          'sections_block_id_fkey',         'sections_blog_id_fkey'),
    ('table_of_contents', 'table_of_contents_block_id_fkey','table_of_contents_blog_id_fkey')
  ) as t(tbl, old_name, new_name)
  loop
    if exists (
      select 1 from pg_constraint c
      join pg_class rel on rel.oid = c.conrelid
      join pg_namespace n on n.oid = rel.relnamespace
      where n.nspname = 'public' and rel.relname = r.tbl and c.conname = r.old_name
    ) then
      execute format('alter table public.%I rename constraint %I to %I', r.tbl, r.old_name, r.new_name);
    end if;
  end loop;
end $$;

-- 5. The updated_at trigger.
do $$
begin
  if exists (
    select 1 from pg_trigger t
    join pg_class rel on rel.oid = t.tgrelid
    join pg_namespace n on n.oid = rel.relnamespace
    where n.nspname = 'public' and rel.relname = 'blogs' and t.tgname = 'trg_blocks_updated_at'
  ) then
    alter trigger trg_blocks_updated_at on public.blogs rename to trg_blogs_updated_at;
  end if;
end $$;

-- 6. Policy names. The policy *expressions* need no edit: Postgres stores them
--    as parse trees, so the column rename in step 2 already rewrote every
--    reference to block_id.
do $$
declare
  r record;
begin
  for r in select * from (values
    ('blogs',             'Public can read blocks',              'Public can read blogs'),
    ('blogs',             'Owners can insert their own blocks',  'Owners can insert their own blogs'),
    ('blogs',             'Owners can update their own blocks',  'Owners can update their own blogs'),
    ('blogs',             'Owners can delete their own blocks',  'Owners can delete their own blogs'),
    ('sections',          'Owners can manage sections of their blocks', 'Owners can manage sections of their blogs'),
    ('table_of_contents', 'Owners can manage toc of their blocks',      'Owners can manage toc of their blogs')
  ) as t(tbl, old_name, new_name)
  loop
    if exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = r.tbl and policyname = r.old_name
    ) then
      execute format('alter policy %I on public.%I rename to %I', r.old_name, r.tbl, r.new_name);
    end if;
  end loop;
end $$;

commit;
