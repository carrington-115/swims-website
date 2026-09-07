import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BlogCard } from "@/components/ui/blog-card";
import { SearchIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

import type { BlogCategory, BlogPost } from "../_content";

type BlogIndexProps = ComponentPropsWithoutRef<"section"> & {
  posts: readonly BlogPost[];
  categories: readonly BlogCategory[];
  /** The category currently filtered on; unset is "All". */
  activeCategory?: string;
  /** What the search field is filtering on, so it survives a category change. */
  query?: string;
};

/** Cover widths: 270px in the frame, half the viewport at `sm`, all of it below. */
const coverSizes =
  "(min-width: 1024px) 270px, (min-width: 640px) calc(50vw - 2rem), calc(100vw - 2rem)";

/**
 * The blog index (Figma 3146:301): a filter rail down the left, the "Blogs"
 * heading and a three-up grid of post cards to the right of it.
 *
 * Filtering runs through the URL rather than component state -- `?category=`
 * and `?q=` -- so the route can do the work on the server, a filtered list is
 * a shareable link, and the page needs no JavaScript to work. That is why the
 * search field is a plain GET form: it has no submit button in the frame, and
 * none is needed, because Enter submits it.
 *
 * Below `lg` the frame gives no layout, so the rail stops being a rail: it
 * loses its divider and sits above the grid with the categories wrapping in a
 * row, and the grid drops to two columns and then one.
 */
export function BlogIndex({
  posts,
  categories,
  activeCategory,
  query,
  className,
  ...props
}: BlogIndexProps) {
  const href = (category?: string) => ({
    pathname: "/blog",
    query: {
      ...(category ? { category } : {}),
      ...(query ? { q: query } : {}),
    },
  });

  return (
    <Section
      spacing="md"
      aria-labelledby="blog-index-heading"
      className={cn(className)}
      {...props}
    >
      <Container className="flex flex-col gap-8 lg:flex-row lg:gap-6.75">
        <div className="flex flex-col gap-5 lg:w-92.75 lg:shrink-0 lg:border-r lg:border-outline lg:pr-10">
          <form
            action="/blog"
            role="search"
            className="flex items-center gap-3 rounded-pill bg-tertiary-100 px-5 py-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
          >
            <SearchIcon className="size-6 shrink-0 text-ink" />
            <label htmlFor="blog-search" className="sr-only">
              Search blog posts
            </label>
            <input
              id="blog-search"
              type="search"
              name="q"
              defaultValue={query ?? ""}
              placeholder="Search"
              className="w-full min-w-0 bg-transparent text-base text-ink placeholder:text-ink focus-visible:outline-none"
            />
            {/* Searching inside a category stays inside it. */}
            {activeCategory ? (
              <input type="hidden" name="category" value={activeCategory} />
            ) : null}
          </form>

          <nav aria-label="Filter posts by category">
            <ul className="flex flex-wrap gap-x-4 gap-y-2.5 text-base lg:flex-col">
              {[{ id: undefined, label: "All" }, ...categories].map(
                ({ id, label }) => {
                  const active = id === activeCategory;

                  return (
                    <li key={id ?? "all"}>
                      <Link
                        href={href(id)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                          active
                            ? "font-medium text-on-surface"
                            : "text-ink hover:text-on-surface",
                        )}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                },
              )}
            </ul>
          </nav>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <SectionHeading
            as="h1"
            align="start"
            id="blog-index-heading"
            className="font-medium"
          >
            Blogs
          </SectionHeading>

          {posts.length === 0 ? (
            <p className="py-10 text-base text-ink-muted">
              No posts match that search yet.{" "}
              <Link
                href="/blog"
                className="underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                Show every post
              </Link>
              .
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-x-8.25 gap-y-5.75 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <li key={post.id} className="flex">
                  <BlogCard
                    post={post}
                    variant="listing"
                    sizes={coverSizes}
                    className="w-full p-3"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Container>
    </Section>
  );
}
