'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blogCategoryLabel, type Blog } from '@swims/schemas';
import { useState } from 'react';

import { Alert } from '@/components/alert';
import { Button, ButtonLink } from '@/components/button';
import { Skeleton } from '@/components/skeleton';
import {
  LIST_LIMIT,
  blogKeys,
  deleteBlog,
  myBlogsQuery,
  updateBlog,
} from '@/lib/blog-queries';

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

/** One row's worth of placeholder, at the height the real row settles at. */
function RowSkeleton() {
  return (
    <li className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-72" />
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </li>
  );
}

/**
 * Everything the signed-in author has written, drafts included.
 *
 * The page prefetches this on the server and hydrates it, so a cold load paints
 * the rows straight away. The skeleton is for the case that actually waits: a
 * client-side navigation back here after the cache has gone, or a reload while
 * the API is slow to answer.
 *
 * Publish and delete are mutations rather than server actions so a row can
 * report its own progress -- the button that was pressed says what it is doing,
 * and only that row's buttons are disabled. Both invalidate the listing rather
 * than editing the cache by hand: the API decides `publishedAt`, and guessing it
 * here would put a date on screen that the next read contradicts.
 */
export function BlogsList({ justCreated }: { justCreated?: string }) {
  const queryClient = useQueryClient();
  const [actionError, setActionError] = useState<string | null>(null);

  const { data, isPending, isError, error } = useQuery(
    myBlogsQuery({ limit: LIST_LIMIT }),
  );

  const invalidate = () => queryClient.invalidateQueries({ queryKey: blogKeys.lists() });

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Blog['status'] }) =>
      updateBlog(id, { status }),
    onSuccess: invalidate,
    onError: (err: Error) => setActionError(err.message),
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: invalidate,
    onError: (err: Error) => setActionError(err.message),
  });

  const blogs = data?.data ?? [];

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

      {justCreated ? <Alert tone="success">Created &ldquo;{justCreated}&rdquo;.</Alert> : null}
      {isError ? <Alert>{error.message}</Alert> : null}
      {actionError ? <Alert>{actionError}</Alert> : null}

      {isPending ? (
        <ul role="status" aria-label="Loading your blogs" className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <RowSkeleton key={index} />
          ))}
        </ul>
      ) : null}

      {!isPending && !isError && blogs.length === 0 ? (
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
          {blogs.map(blog => {
            /*
             * Scoped to this row. Every row shares one mutation hook each, so
             * `setStatus.isPending` on its own would put every button in the
             * list into a pending state at once.
             */
            const publishing = setStatus.isPending && setStatus.variables?.id === blog.id;
            const deleting = remove.isPending && remove.variables === blog.id;
            const busy = publishing || deleting;

            return (
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
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={busy}
                    onClick={() => {
                      setActionError(null);
                      setStatus.mutate({
                        id: blog.id,
                        status: blog.status === 'published' ? 'draft' : 'published',
                      });
                    }}
                  >
                    {publishing
                      ? 'Saving…'
                      : blog.status === 'published'
                        ? 'Unpublish'
                        : 'Publish'}
                  </Button>

                  <Button
                    variant="danger"
                    size="sm"
                    disabled={busy}
                    onClick={() => {
                      setActionError(null);
                      remove.mutate(blog.id);
                    }}
                  >
                    {deleting ? 'Deleting…' : 'Delete'}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
