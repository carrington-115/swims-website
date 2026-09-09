"use client";

import { useQuery } from "@tanstack/react-query";

import { LatestBlogs } from "@/components/sections/latest-blogs";
import { LATEST_COUNT, latestBlogsQuery } from "@/lib/blog-queries";
import { toBandPost } from "@/lib/blog-view";

/**
 * The fetching half of the "Latest blogs" band, and the only client component
 * in it: `LatestBlogs` itself stays presentational.
 *
 * `LatestBlogsBand` prefetches this same query on the server, so on a cold load
 * the posts are already in the cache when this mounts and the skeleton is never
 * seen. It appears on a client-side navigation to a route whose band has gone
 * stale, which is the only time the section actually has to wait.
 *
 * An error renders nothing rather than an apology. The band is a pointer to the
 * archive at the foot of a marketing page; the blog is one click away in the
 * footer regardless, and a red box here because a listing call failed is worse
 * than the section quietly not being there.
 */
export function LatestBlogsFeed() {
  const { data, isPending, isError } = useQuery(latestBlogsQuery());

  if (isError) return null;

  return (
    <LatestBlogs
      isLoading={isPending}
      placeholderCount={LATEST_COUNT}
      posts={(data?.data ?? []).map(toBandPost)}
    />
  );
}
