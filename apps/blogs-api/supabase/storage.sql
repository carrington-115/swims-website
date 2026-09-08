-- Storage policies for the blog image bucket.
--
-- The bucket `swims_blog_dashboard` is created in the Supabase dashboard
-- (Storage -> New bucket, public). This file grants the access to it, which a
-- new bucket has none of: RLS is on for `storage.objects` and a bucket with no
-- policies rejects every upload, including from a signed-in user.
--
-- Re-runnable: every policy is dropped first.
--
-- Layout inside the bucket is `<user-id>/<uuid>.<ext>`. Putting the owner's id
-- in the first path segment is what lets a policy check ownership with
-- `storage.foldername`, so one author cannot overwrite or delete another's
-- images by guessing a name.

begin;

-- Anyone may read. The bucket is public, so the CDN serves these anyway; the
-- policy is what makes a direct API read work too.
drop policy if exists "Public can read blog images" on storage.objects;
create policy "Public can read blog images" on storage.objects for select
  using (bucket_id = 'swims_blog_dashboard');

-- A signed-in author may upload, but only under their own id.
drop policy if exists "Authors can upload their own blog images" on storage.objects;
create policy "Authors can upload their own blog images" on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'swims_blog_dashboard'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authors can replace their own blog images" on storage.objects;
create policy "Authors can replace their own blog images" on storage.objects for update
  to authenticated
  using (
    bucket_id = 'swims_blog_dashboard'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Authors can delete their own blog images" on storage.objects;
create policy "Authors can delete their own blog images" on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'swims_blog_dashboard'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Limits belong on the bucket rather than only in the browser, which is the
-- one place a determined caller can ignore them.
update storage.buckets
set
  file_size_limit = 5242880, -- 5 MB
  allowed_mime_types = array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif',
    'image/svg+xml'
  ]
where id = 'swims_blog_dashboard';

commit;
