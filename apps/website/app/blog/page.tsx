import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { isBlogCategory } from "@swims/schemas";

import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { blogListQuery } from "@/lib/blog-queries";
import { getQueryClient } from "@/lib/query-client";
import { pageMetadata } from "@/lib/seo";

import { subscribeToNewsletter } from "../_actions/newsletter";
import { BlogList } from "./_sections/blog-list";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Waste policy, DTRACKER releases, and field notes from the collectors and cities building formal waste systems across Africa.",
  path: "/blog",
});

/**
 * Blog index (Figma 3146:301).
 *
 * `?category=` and `?q=` come off the URL and become the query key, so the
 * listing is filtered by the API rather than in the browser -- the page asks for
 * the posts it is going to show, instead of pulling the whole archive down and
 * hiding most of it.
 *
 * The first page of results is prefetched here and hydrated into the client
 * cache, so a cold load and a crawler both get server-rendered posts. Moving
 * between categories after that is a client-side query against the same cache.
 */
export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const { category, q } = await searchParams;

  // A repeated query string (`?q=a&q=b`) parses as an array. Take the first.
  const activeCategory = Array.isArray(category) ? category[0] : category;
  const query = Array.isArray(q) ? q[0] : q;

  // An unknown `?category=` filters nothing rather than emptying the page. It
  // is also the same check the API applies to its own `?category=`, which is
  // stricter -- it answers 400 -- so filtering it out here keeps a hand-edited
  // URL a harmless listing rather than an error.
  const known = isBlogCategory(activeCategory) ? activeCategory : undefined;

  const filters = {
    ...(known ? { category: known } : {}),
    ...(query ? { q: query } : {}),
  };

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(blogListQuery(filters));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogList category={known} query={query} />

      <NewsletterSignup action={subscribeToNewsletter} />
    </HydrationBoundary>
  );
}
