import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { blogKeys, isNotFound } from "@/lib/blog-queries";
import { blogsApi } from "@/lib/blogs-api";
import { getQueryClient } from "@/lib/query-client";

import { subscribeToNewsletter } from "../../_actions/newsletter";
import { BlogArticleView } from "../_sections/blog-article-view";

/**
 * The post, fetched at most once per request.
 *
 * `generateMetadata` and the page body both need it, and Next runs them as
 * separate passes -- `cache` is what stops that being two calls to the API for
 * one page view. It memoises on the argument for the lifetime of the request
 * only, so it never serves one visitor's post to another.
 */
const getPost = cache((slug: string) => blogsApi.blogs.getBySlug(slug));

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getPost(slug);
    return {
      title: post.title,
      description: post.description ?? undefined,
    };
  } catch {
    // Including a genuine 404. The page below turns that into a 404 response;
    // metadata's only job is not to break the render on the way there.
    return {};
  }
}

/**
 * One post (Figma 3152:307).
 *
 * Fetched here and seeded straight into the React Query cache rather than
 * prefetched through it, because `getPost` has already been called by
 * `generateMetadata` in this same request -- going through `prefetchQuery`
 * would ask the API a second time for something already in hand.
 *
 * A missing post is a real 404 response, decided on the server, so a dead link
 * is not a 200 with an apology on it. Any other failure is left to
 * `BlogArticleView`: the query lands on the client with nothing cached, and it
 * says so there rather than taking the whole route down.
 *
 * There is no `generateStaticParams`. Posts are published from the dashboard at
 * any time, so the set of slugs is not known at build time; the route renders on
 * demand and the prefetched markup is what a crawler sees.
 */
export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const queryClient = getQueryClient();

  try {
    queryClient.setQueryData(blogKeys.detail(slug), await getPost(slug));
  } catch (error) {
    if (isNotFound(error)) notFound();
    // Anything else falls through with an empty cache on purpose.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BlogArticleView slug={slug} />

      <NewsletterSignup action={subscribeToNewsletter} />
    </HydrationBoundary>
  );
}
