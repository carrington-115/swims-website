import type { Metadata } from 'next';
import { blogCategoryLabel, type Blog } from '@swims/schemas';

import { Alert } from '@/components/alert';
import { Button, ButtonLink } from '@/components/button';
import { BlogsApiError, blogsApi } from '@/lib/blogs-api';

import { deleteBlog, setBlogStatus } from './actions';

export const metadata: Metadata = { title: 'Your blogs' };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatusPill({ status }: { status: Blog['status'] }) {
  const published = status === 'published';
  return (
    <span
      className={
        published
          ? 'rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700'
          : 'rounded-full bg-canvas px-2 py-0.5 text-xs font-medium text-ink-muted'
      }
    >
      {published ? 'Published' : 'Draft'}
    </span>
  );
}

/**
 * Everything the signed-in author has written, drafts included.
 *
 * Reads `/api/blogs/mine`, which is the only route that returns drafts, and
 * scopes them to the token holder server-side.
 */
export default async function BlogsPage({ searchParams }: PageProps<'/'>) {
  const { created } = await searchParams;
  const justCreated = Array.isArray(created) ? created[0] : created;

  let blogs: Blog[] = [];
  let error: string | null = null;

  try {
    const page = await blogsApi().blogs.listMine({ limit: 100 });
    blogs = page.data;
  } catch (err) {
    error =
      err instanceof BlogsApiError && err.status === 0
        ? 'Could not reach the Blogs API. Start it with `pnpm --filter swims-blogs-api dev`.'
        : err instanceof Error
          ? err.message
          : 'Could not load your blogs.';
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Your blogs</h1>
          <p className="text-sm text-ink-muted">Drafts are only visible to you.</p>
        </div>
        <ButtonLink href="/blogs/new" className="shrink-0">
          New blog
        </ButtonLink>
      </div>

      {justCreated ? <Alert tone="success">Created “{justCreated}”.</Alert> : null}
      {error ? <Alert>{error}</Alert> : null}

      {!error && blogs.length === 0 ? (
        <div className="rounded-card border border-dashed border-line bg-surface p-10 text-center">
          <p className="font-medium">Nothing here yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            Your first blog will show up here, draft or published.
          </p>
          <ButtonLink href="/blogs/new" className="mt-4">
            Write one
          </ButtonLink>
        </div>
      ) : null}

      {blogs.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {blogs.map(blog => (
            <li
              key={blog.id}
              className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-medium">{blog.title}</h2>
                  <StatusPill status={blog.status} />
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {formatDate(blog.dateCreated)} · {blog.timeToRead} min read
                  {blog.category ? ` · ${blogCategoryLabel(blog.category)}` : ''}
                  {` · /${blog.slug}`}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <form action={setBlogStatus}>
                  <input type="hidden" name="id" value={blog.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={blog.status === 'published' ? 'draft' : 'published'}
                  />
                  <Button type="submit" variant="secondary" size="sm">
                    {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                  </Button>
                </form>

                <form action={deleteBlog}>
                  <input type="hidden" name="id" value={blog.id} />
                  <Button type="submit" variant="danger" size="sm">
                    Delete
                  </Button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
