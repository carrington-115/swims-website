import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { BlogResponse } from "@swims/schemas";
import { blogCategoryLabel } from "@swims/schemas";

import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { blogKeys, isNotFound } from "@/lib/blog-queries";
import { blogsApi } from "@/lib/blogs-api";
import { JsonLd, blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/json-ld";
import { getQueryClient } from "@/lib/query-client";
import { pageMetadata } from "@/lib/seo";

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

    /*
     * A post with no description still has to say something: the description is
     * what a scraper prints under the title, and an empty one leaves the card
     * with a headline and a blank line. The title is a poor summary but an
     * honest one, and it beats the site-wide fallback, which would describe
     * SWIMS rather than the post.
     */
    const description =
      post.description ?? `${post.title} — from the SWIMS blog.`;

    return pageMetadata({
      title: post.title,
      description,
      path: `/blog/${post.slug}`,
      type: "article",
      // The card is drawn from this post by `opengraph-image.tsx` next door.
      hasOwnCard: true,
      article: {
        // `publishedAt` is null on a draft; a draft is not reachable here, but
        // the type says it can be, so it is omitted rather than invented.
        publishedTime: post.publishedAt ?? undefined,
        modifiedTime: post.updatedAt,
        authors: [post.author.name],
        section: post.category ? blogCategoryLabel(post.category) : undefined,
      },
    });
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

  /*
   * Kept rather than only seeded into the cache: the structured data below is
   * built from it, and a crawler reads that from the server-rendered markup.
   * Same call either way -- `getPost` is memoised for the request.
   */
  let post: BlogResponse | null = null;

  try {
    post = await getPost(slug);
    queryClient.setQueryData(blogKeys.detail(slug), post);
  } catch (error) {
    if (isNotFound(error)) notFound();
    // Anything else falls through with an empty cache on purpose.
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/*
       * Only when the post is in hand. Markup describing a post the page could
       * not fetch would claim a headline and a date the reader never sees,
       * which is the one thing structured data must never do.
       */}
      {post ? (
        <>
          <JsonLd data={blogPostingJsonLd(post)} />
          <JsonLd
            data={breadcrumbJsonLd([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ])}
          />
        </>
      ) : null}

      <BlogArticleView slug={slug} />

      <NewsletterSignup action={subscribeToNewsletter} />
    </HydrationBoundary>
  );
}
