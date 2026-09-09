-- Constrains `blogs.category` to the set the application defines.
--
-- The column was free text, so the enum in `packages/schemas` was the only
-- thing keeping a category from being invented at write time -- and only for
-- writes that went through the API. A row written any other way (psql, the
-- Supabase table editor, a direct anon-key insert under RLS) could carry a
-- value no filter on the marketing site would ever select, so the post was
-- reachable by slug and invisible in the listing.
--
-- Run this against any database created from the previous schema.sql BEFORE
-- deploying this version of the API, which now rejects an unknown
-- `?category=` with a 400 rather than an empty page. Re-running is a no-op.
--
-- Step 1 preserves the rows: anything outside the set becomes NULL
-- (uncategorised), which is what such a post already looked like on the site.
-- The values cleared are reported at the end so they can be re-assigned by
-- hand if any of them was a real category under an old name.

begin;

-- 1. Existing rows first -- the constraint below cannot be added while any row
--    violates it, and NOT VALID would only postpone the same failure.
update blogs
set category = null
where category is not null
  and category not in (
    'company',
    'waste-management-in-africa',
    'global-waste-management',
    'technology-in-waste-management',
    'case-study'
  );

-- 2. The constraint. NULL passes: a post need not have a category, and the
--    column stays nullable.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'blogs_category_check'
  ) then
    alter table blogs add constraint blogs_category_check
      check (category is null or category in (
        'company',
        'waste-management-in-africa',
        'global-waste-management',
        'technology-in-waste-management',
        'case-study'
      ));
  end if;
end $$;

commit;

-- Adding a category is a two-sided change: extend BLOG_CATEGORY_IDS in
-- packages/schemas/src/category.ts and drop-and-recreate this constraint with
-- the new value in it. A category added on only one side is either a value the
-- API accepts and the database rejects, or one the database holds and no
-- picker offers.
