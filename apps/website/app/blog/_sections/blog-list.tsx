"use client";

import { useQuery } from "@tanstack/react-query";
import { BLOG_CATEGORIES, type BlogCategoryId } from "@swims/schemas";

import { blogListQuery, type BlogListFilters } from "@/lib/blog-queries";
import { toListingPost } from "@/lib/blog-view";

import { BlogIndex } from "./blog-index";

type BlogListProps = {
  category?: BlogCategoryId;
  query?: string;
};

/**
 * The fetching half of the blog index.
 *
 * The filters are still the URL -- `?category=` and `?q=` are read by the route
 * and passed down here -- so a filtered listing is a shareable link and the rail
 * stays a set of plain `Link`s that work without JavaScript. What React Query
 * adds is the cache underneath: going back to a category already visited paints
 * from memory instead of asking again, and the two listings the header and the
 * footer might both want are one request.
 *
 * `isPending` rather than `isFetching` drives the skeleton, so a filter change
 * that lands on a cached page swaps the posts without flashing placeholders
 * over content that is already correct.
 */
export function BlogList({ category, query }: BlogListProps) {
  const filters: BlogListFilters = {
    ...(category ? { category } : {}),
    ...(query ? { q: query } : {}),
  };

  const { data, isPending, isError, error } = useQuery(blogListQuery(filters));

  return (
    <BlogIndex
      posts={(data?.data ?? []).map(toListingPost)}
      categories={BLOG_CATEGORIES}
      activeCategory={category}
      query={query}
      isLoading={isPending}
      error={
        isError
          ? describe(error)
          : null
      }
    />
  );
}

/**
 * What to tell a reader when the listing could not be read.
 *
 * An unreachable API is the common case in development and says nothing useful
 * to a visitor, so both branches offer the same thing -- try again -- and only
 * the first admits it is a connection problem.
 */
function describe(error: unknown): string {
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status: unknown }).status
      : undefined;

  return status === 0
    ? "The blog could not be reached just now. Please try again in a moment."
    : "Something went wrong loading the posts. Please try again in a moment.";
}
