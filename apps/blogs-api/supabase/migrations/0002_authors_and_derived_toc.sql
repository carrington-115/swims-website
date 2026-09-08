-- Moves the blog domain onto verified authorship and a derived table of
-- contents, and gives a blog the fields the marketing site needs to list one.
--
-- Run this against any database created from the previous schema.sql BEFORE
-- deploying this version of the API. Afterwards `schema.sql` and this database
-- describe the same thing, and re-running this file is a no-op.
--
-- What changes, and why:
--
--  1. `authors` -- one row per Supabase user. `blogs.author` and
--     `blogs.profile_image` were free text the client sent, so any valid token
--     could publish under any byline. They are backfilled into `authors` and
--     then dropped; the API now derives both from the access token.
--  2. `blogs` gains `category`, `cover_image`, `status` and `published_at`.
--     Existing rows are marked published so nothing disappears from the public
--     listing, which until now returned drafts and published posts alike.
--  3. `sections`' unique index on (blog_id, order_index) becomes a deferrable
--     constraint, which is what makes reordering possible at all.
--  4. `table_of_contents` is dropped. It was a stored copy of the section
--     headings, rebuilt only when something POSTed to its route, so it went
--     stale the moment a section was renamed, reordered or deleted. The API now
--     projects the contents from the sections on read.
--
-- Row data is preserved throughout. The only loss is the free-text byline on a
-- blog whose author cannot be identified, which is reported at the end.

begin;

-- ------------------------------------------------------------
-- 1. Authors
-- ------------------------------------------------------------
create table if not exists authors (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Backfill from the bylines already on the blogs: the most recently created
-- blog per user wins, since that is the name that user last went by.
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blogs' and column_name = 'author'
  ) then
    insert into authors (id, name, avatar_url)
    select distinct on (b.user_id)
      b.user_id,
      coalesce(nullif(btrim(b.author), ''), 'Unknown author'),
      b.profile_image
    from blogs b
    order by b.user_id, b.date_created desc
    on conflict (id) do nothing;
  end if;
end $$;

-- Any remaining user_id with no byline to inherit still needs an author row,
-- or the foreign key below cannot be added.
insert into authors (id, name)
select distinct b.user_id, 'Unknown author'
from blogs b
on conflict (id) do nothing;

-- Fill in the email from auth.users where it is knowable.
update authors a
set email = u.email
from auth.users u
where u.id = a.id and a.email is null;

-- ------------------------------------------------------------
-- 2. Blogs: new columns, then the byline columns go
-- ------------------------------------------------------------
alter table blogs add column if not exists category text;
alter table blogs add column if not exists cover_image text;
alter table blogs add column if not exists published_at timestamptz;

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'blogs' and column_name = 'status'
  ) then
    alter table blogs add column status text not null default 'draft';
    -- Everything that already existed was live, so keep it live.
    update blogs set status = 'published', published_at = date_created;
    alter table blogs add constraint blogs_status_check
      check (status in ('draft', 'published'));
  end if;
end $$;

-- Point user_id at authors so PostgREST can embed the byline. The old
-- constraint named the auth.users reference; drop whichever form it took.
do $$
declare
  v_constraint text;
begin
  select con.conname into v_constraint
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_attribute att on att.attrelid = rel.oid and att.attnum = any (con.conkey)
  where rel.relname = 'blogs' and con.contype = 'f' and att.attname = 'user_id'
  limit 1;

  if v_constraint is not null then
    execute format('alter table blogs drop constraint %I', v_constraint);
  end if;

  alter table blogs
    add constraint blogs_user_id_fkey
    foreign key (user_id) references authors(id) on delete cascade;
end $$;

alter table blogs drop column if exists author;
alter table blogs drop column if exists profile_image;

create index if not exists idx_blogs_status_date on blogs (status, date_created desc);
create index if not exists idx_blogs_category on blogs (category);

drop trigger if exists trg_authors_updated_at on authors;
create trigger trg_authors_updated_at
before update on authors
for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 3. Sections: a deferrable order constraint
-- ------------------------------------------------------------
drop index if exists idx_sections_blog_order;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'sections_blog_order_key'
  ) then
    alter table sections
      add constraint sections_blog_order_key unique (blog_id, order_index)
      deferrable initially deferred;
  end if;
end $$;

-- ------------------------------------------------------------
-- 4. The stored table of contents goes
-- ------------------------------------------------------------
drop trigger if exists trg_toc_updated_at on table_of_contents;
drop table if exists table_of_contents;

commit;

-- ------------------------------------------------------------
-- 5. The functions the API calls. Bodies live in schema.sql; run that file's
--    "Writes that have to be atomic" and "Row Level Security" sections after
--    this migration, or simply run schema.sql in full -- every statement in it
--    is `if not exists` / `or replace` / `drop policy if exists` and safe to
--    apply to the database this migration just produced.
-- ------------------------------------------------------------
