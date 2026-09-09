import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { findBlogCategory } from "@swims/schemas";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { CoverImage } from "@/components/media/cover-image";
import { ChevronDownIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { ArticlePost } from "@/lib/blog-view";

import { AgentPromoCard } from "./agent-promo-card";
import { TableOfContents } from "./table-of-contents";

type BlogArticleProps = ComponentPropsWithoutRef<"section"> & {
  post: ArticlePost;
};

/** A pill chip from the head: hairline border, fully round, 12px of padding. */
const chip =
  "flex items-center gap-1.25 rounded-pill border border-tertiary-300 p-3 text-base text-ink-strong";

/**
 * A post, in full (Figma 3152:307).
 *
 * The head is the breadcrumb, the title and three chips over a full-width
 * cover. Under it the prose runs in one column with the table of contents in a
 * rail beside it, sticky from `lg` so the entry it highlights stays in view for
 * the whole article.
 *
 * The contents is derived from the sections rather than authored beside them,
 * so the rail and the body can never drift apart: one heading, one anchor, one
 * entry. Each section carries `scroll-mt` for the sticky header, so following
 * an entry lands the heading below it rather than under it.
 *
 * Below `lg` the frame gives no layout. The rail stops being a rail: the
 * wrapper goes `display: contents` so its two halves become items of the page's
 * own column and can be ordered independently -- the contents above the prose,
 * where it is a useful jump list, and the promo card below it, out of the way.
 */
export function BlogArticle({ post, className, ...props }: BlogArticleProps) {
  const items = post.sections.map(({ id, title }) => ({ id, title }));

  // The middle crumb. A post whose category is not one the site knows simply
  // has no crumb, rather than a link to a listing that would come back empty.
  const category = findBlogCategory(post.category);

  return (
    <Section spacing="md" className={cn(className)} {...props}>
      <Container className="flex flex-col gap-5.25">
        <header className="flex flex-col gap-10">
          <div className="flex flex-col gap-2.5 lg:w-195.25">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2.75 text-base">
                <li>
                  <Link
                    href="/blog"
                    className="text-tertiary-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Blog
                  </Link>
                </li>
                {category ? (
                  <li className="flex items-center gap-2.75">
                    <ChevronDownIcon className="size-4 -rotate-90 text-tertiary-300" />
                    <Link
                      href={{
                        pathname: "/blog",
                        query: { category: category.id },
                      }}
                      className="text-tertiary-300 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {category.label}
                    </Link>
                  </li>
                ) : null}
                <li className="flex items-center gap-2.75">
                  <ChevronDownIcon className="size-4 -rotate-90 text-tertiary-300" />
                  <span aria-current="page" className="text-ink">
                    {post.title}
                  </span>
                </li>
              </ol>
            </nav>

            <h1 className="font-display text-2xl font-medium text-ink-strong lg:text-4xl">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2.5 lg:gap-5">
              <p className={chip}>
                {post.author.avatar ? (
                  <span className="relative size-7.5 shrink-0 overflow-hidden rounded-full">
                    <CoverImage cover={post.author.avatar} sizes="30px" />
                  </span>
                ) : null}
                {post.author.name}
              </p>
              {post.publishedDateTime ? (
                <p className={chip}>
                  <time dateTime={post.publishedDateTime}>
                    {post.publishedLabel}
                  </time>
                </p>
              ) : null}
              <p className={chip}>{post.readingTime}</p>
            </div>
          </div>

          <div className="relative aspect-[1237/732] w-full overflow-hidden">
            <CoverImage cover={post.cover} priority sizes="100vw" />
          </div>
        </header>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-7.25">
          {/*
           * `contents` on phones so the two halves below can be ordered around
           * the prose; a real, sticky box from `lg`, where they are a rail.
           */}
          <div className="contents lg:sticky lg:top-22 lg:order-last lg:block lg:max-h-[calc(100dvh-6rem)] lg:w-75.75 lg:shrink-0 lg:overflow-y-auto">
            <TableOfContents items={items} className="order-first" />
            <AgentPromoCard className="order-last lg:mt-10" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {post.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                aria-labelledby={`${section.id}-heading`}
                className="flex scroll-mt-header flex-col gap-1.25 lg:scroll-mt-header-lg"
              >
                <h2
                  id={`${section.id}-heading`}
                  className="font-display text-base font-semibold text-ink-strong"
                >
                  {section.title}
                </h2>
                {/*
                 * The 5px gap belongs between the heading and the prose only.
                 * Consecutive paragraphs run together, as the frame sets them:
                 * the short last line of one is the break before the next.
                 */}
                <div className="text-base text-justify text-ink-strong">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={`${section.id}-p${index}`}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
