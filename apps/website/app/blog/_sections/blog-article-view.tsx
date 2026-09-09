"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { blogDetailQuery, isNotFound } from "@/lib/blog-queries";
import { toArticle } from "@/lib/blog-view";

import { BlogArticle } from "./blog-article";
import { BlogArticleSkeleton } from "./blog-article-skeleton";

/**
 * The fetching half of the post page.
 *
 * The route prefetches this same query, so on a cold load the article is
 * server-rendered and the skeleton never appears. It is what a reader sees
 * coming from the index on a client-side navigation, before the post is in the
 * cache.
 *
 * A 404 is not handled here: the route already asked the API for the post while
 * rendering, and answered with a real 404 page if there was none. Reaching this
 * branch means the post was deleted between that render and this one, so the
 * message says exactly that rather than pretending the URL was always wrong.
 */
export function BlogArticleView({ slug }: { slug: string }) {
  const { data, isPending, isError, error } = useQuery(blogDetailQuery(slug));

  if (isPending) return <BlogArticleSkeleton />;

  if (isError) {
    return (
      <Section spacing="md">
        <Container className="flex flex-col items-start gap-3 py-10">
          <h1 className="font-display text-2xl font-medium text-ink-strong">
            {isNotFound(error) ? "That post is no longer here" : "This post could not be loaded"}
          </h1>
          <p role="alert" className="text-base text-ink-muted">
            {isNotFound(error)
              ? "It may have been unpublished while you were reading."
              : "Something went wrong fetching it. Please try again in a moment."}
          </p>
          <Link
            href="/blog"
            className="text-base underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Back to all posts
          </Link>
        </Container>
      </Section>
    );
  }

  return <BlogArticle post={toArticle(data)} />;
}
