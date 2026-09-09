import { queryOptions } from "@tanstack/react-query";
import type { BlogCategoryId } from "@swims/schemas";

import { blogsApi } from "@/lib/blogs-api";

/**
 * Every read of the Blogs API the website makes, defined once.
 *
 * Server components prefetch with exactly these options and client components
 * subscribe with them, so the key a page dehydrated is the key the browser
 * looks up -- a mismatch there is invisible, and shows up only as the client
 * refetching something it was already handed.
 */

export type BlogListFilters = {
  category?: BlogCategoryId;
  q?: string;
  limit?: number;
  offset?: number;
};

/**
 * Hierarchical, so a broad key invalidates everything under it:
 * `blogKeys.lists()` drops every filtered listing without naming one.
 */
export const blogKeys = {
  all: ["blogs"] as const,
  lists: () => [...blogKeys.all, "list"] as const,
  list: (filters: BlogListFilters) => [...blogKeys.lists(), filters] as const,
  details: () => [...blogKeys.all, "detail"] as const,
  detail: (slug: string) => [...blogKeys.details(), slug] as const,
};

/** How many posts the home page's four-up "Latest blogs" grid draws. */
export const LATEST_COUNT = 4;

/**
 * A page of published posts. `filters` is the key, so two components asking for
 * the same category and search share one request and one cache entry.
 */
export function blogListQuery(filters: BlogListFilters = {}) {
  return queryOptions({
    queryKey: blogKeys.list(filters),
    queryFn: ({ signal }) => blogsApi.blogs.list(filters, { signal }),
  });
}

/** The home page band. Named so the page and the band cannot ask for different pages. */
export function latestBlogsQuery() {
  return blogListQuery({ limit: LATEST_COUNT });
}

/**
 * One post with its sections and contents.
 *
 * A 404 is a real answer here -- the post does not exist -- so it must not be
 * retried; without this a missing slug costs an extra round trip before the
 * page can say so.
 */
export function blogDetailQuery(slug: string) {
  return queryOptions({
    queryKey: blogKeys.detail(slug),
    queryFn: ({ signal }) => blogsApi.blogs.getBySlug(slug, { signal }),
    retry: (failureCount, error) =>
      isNotFound(error) ? false : failureCount < 1,
  });
}

/** True for the API's "no such post", as opposed to a network or server fault. */
export function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status: unknown }).status === 404
  );
}
