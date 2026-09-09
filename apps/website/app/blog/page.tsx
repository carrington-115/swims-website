import type { Metadata } from "next";
import { isBlogCategory } from "@swims/schemas";

import { NewsletterSignup } from "@/components/sections/newsletter-signup";

import { subscribeToNewsletter } from "../_actions/newsletter";
import { blogCategories, blogPosts, filterPosts } from "./_content";
import { BlogIndex } from "./_sections/blog-index";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Waste policy, DTRACKER releases, and field notes from the collectors and cities building formal waste systems across Africa.",
};

/**
 * Blog index (Figma 3146:301).
 *
 * The listing does the filtering here rather than in the browser: `?category=`
 * and `?q=` come off the URL, the post list is narrowed before it is rendered,
 * and the section is handed what is left. Posts are the stand-ins in
 * `_content.ts` until `blogs-api` is wired up.
 *
 * The newsletter band closes the page, as it does on every other route; the
 * footer comes from `app/layout.tsx`.
 */
export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const { category, q } = await searchParams;

  // A repeated query string (`?q=a&q=b`) parses as an array. Take the first.
  const activeCategory = Array.isArray(category) ? category[0] : category;
  const query = Array.isArray(q) ? q[0] : q;

  // An unknown `?category=` filters nothing rather than emptying the page.
  // `isBlogCategory` is the same check the API applies to its own
  // `?category=`, so the rail, the URL and the listing agree on what exists.
  const known = isBlogCategory(activeCategory) ? activeCategory : undefined;

  const posts = filterPosts(blogPosts, { category: known, query });

  return (
    <>
      <BlogIndex
        posts={posts}
        categories={blogCategories}
        activeCategory={known}
        query={query}
      />

      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
