import { queryOptions } from '@tanstack/react-query';
import type { Blog, ListMyBlogsQuery, PaginatedResponse, UpdateBlogRequest } from '@swims/schemas';

/**
 * Every read and write the dashboard's browser half makes.
 *
 * All of them go to this app's own `/api/blogs` handlers, never to the Blogs
 * API directly: same-origin, so no CORS, and the access token stays in an
 * httpOnly cookie the server reads on the way through. See `lib/api-route.ts`.
 *
 * The server prefetches these same keys through `lib/blogs-api.ts` instead --
 * a relative URL means nothing there. Different fetcher, same key, so the
 * hydrated entry is the one the browser then subscribes to.
 */

export type MyBlogsFilters = Partial<Pick<ListMyBlogsQuery, 'limit' | 'offset' | 'status' | 'category' | 'q'>>;

export const blogKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogKeys.all, 'list'] as const,
  list: (filters: MyBlogsFilters) => [...blogKeys.lists(), filters] as const,
};

/** How many blogs the listing asks for. Well past what one author will have. */
export const LIST_LIMIT = 100;

/**
 * Unwraps a handler response.
 *
 * The handlers answer `{ error }` with a real status on failure, so the status
 * is carried on the thrown error and the caller can tell an expired session
 * (401) from an unreachable API (502).
 */
async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new DashboardApiError(response.status, body?.error ?? response.statusText);
  }

  return (await response.json()) as T;
}

export class DashboardApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'DashboardApiError';
    this.status = status;
  }
}

export function myBlogsQuery(filters: MyBlogsFilters = { limit: LIST_LIMIT }) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined) search.set(key, String(value));
  }

  return queryOptions({
    queryKey: blogKeys.list(filters),
    queryFn: ({ signal }) =>
      request<PaginatedResponse<Blog>>(`/api/blogs?${search.toString()}`, { signal }),
  });
}

export function updateBlog(id: string, input: UpdateBlogRequest) {
  return request<Blog>(`/api/blogs/${id}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function deleteBlog(id: string) {
  return request<{ ok: true }>(`/api/blogs/${id}`, { method: 'DELETE' });
}
