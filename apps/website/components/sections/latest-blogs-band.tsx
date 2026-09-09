import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { LatestBlogsFeed } from "@/components/sections/latest-blogs-feed";
import { latestBlogsQuery } from "@/lib/blog-queries";
import { getQueryClient } from "@/lib/query-client";

/**
 * "Latest blogs", ready to drop into any route.
 *
 * The prefetch lives here rather than in each of the five pages that end with
 * this band: a route should not have to know that the section fetches, and five
 * copies of the same two lines is five chances for one of them to be forgotten
 * and that page alone to ship a skeleton to crawlers.
 *
 * Awaited on purpose. Unawaited, the dehydrated state would be captured while
 * the query was still pending and the band would arrive empty, filling in only
 * once the browser had run the request again.
 *
 * The `HydrationBoundary` carries only this query's entry, and boundaries nest,
 * so a page that prefetches something of its own is unaffected.
 */
export async function LatestBlogsBand() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(latestBlogsQuery());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LatestBlogsFeed />
    </HydrationBoundary>
  );
}
