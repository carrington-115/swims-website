import type { Metadata } from 'next';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { LIST_LIMIT, blogKeys } from '@/lib/blog-queries';
import { blogsApi } from '@/lib/blogs-api';
import { getQueryClient } from '@/lib/query-client';

import { BlogsList } from './blogs-list';

export const metadata: Metadata = { title: 'Your blogs' };

/**
 * The listing route.
 *
 * Reads `/api/blogs/mine` -- the only route that returns drafts, and one that
 * scopes them to the token holder -- and seeds the result into the React Query
 * cache under the key `BlogsList` subscribes to, so the rows are
 * server-rendered and the browser takes over without asking again.
 *
 * The server calls the Blogs API directly rather than this app's own
 * `/api/blogs` handler: a relative URL means nothing here, and going out to our
 * own origin only to come back in would be a second round trip for data this
 * process can already fetch. The handler exists for the browser, which must not
 * hold a token.
 *
 * A failure is deliberately not caught. The cache is left empty, `BlogsList`
 * mounts, asks through the handler and reports whatever comes back -- so one
 * component renders the error rather than two that word it differently.
 */
export default async function BlogsPage({ searchParams }: PageProps<'/'>) {
  const { created } = await searchParams;
  const justCreated = Array.isArray(created) ? created[0] : created;

  const queryClient = getQueryClient();

  try {
    queryClient.setQueryData(
      blogKeys.list({ limit: LIST_LIMIT }),
      await blogsApi().blogs.listMine({ limit: LIST_LIMIT }),
    );
  } catch {
    // Left to the client. See above.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogsList justCreated={justCreated} />
    </HydrationBoundary>
  );
}
