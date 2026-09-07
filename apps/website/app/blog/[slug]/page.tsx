import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NewsletterSignup } from "@/components/sections/newsletter-signup";

import { subscribeToNewsletter } from "../../_actions/newsletter";
import { blogPosts, findCategory, findPost } from "../_content";
import { BlogArticle } from "../_sections/blog-article";

/** One route per post, prerendered at build time. */
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) return {};

  return { title: post.title, description: post.excerpt };
}

/**
 * One post (Figma 3152:307).
 *
 * The head, the prose and the table of contents all come from `BlogArticle`;
 * the route's job is to find the post and 404 when there is not one. The frame
 * ends with the article, so the only thing after it is the newsletter band
 * every route on the site closes with. The footer comes from `app/layout.tsx`.
 */
export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = findPost(slug);
  if (!post) notFound();

  return (
    <>
      <BlogArticle post={post} category={findCategory(post.category)} />

      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
