import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import type { BlogCategory } from "@swims/schemas";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BlogCard, type BlogCardPost } from "@/components/ui/blog-card";
import { BlogCardSkeleton } from "@/components/ui/blog-card-skeleton";
import { SearchIcon, TuneIcon } from "@/components/ui/icons";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

import { CategoryFilter } from "./category-filter";

type BlogIndexProps = ComponentPropsWithoutRef<"section"> & {
  posts: readonly BlogCardPost[];
  categories: readonly BlogCategory[];
  /** The category currently filtered on; unset is "All". */
  activeCategory?: string;
  /** What the search field is filtering on, so it survives a category change. */
  query?: string;
  /** Draws the grid as placeholders. `posts` is ignored while this is set. */
  isLoading?: boolean;
  /** Shown in place of the grid when the listing could not be read at all. */
  error?: string | null;
};

/** Cover widths: 270px in the frame, half the viewport at `sm`, all of it below. */
const coverSizes =
  "(min-width: 1024px) 270px, (min-width: 640px) calc(50vw - 2rem), calc(100vw - 2rem)";

/**
 * Placeholders drawn while a listing loads. One full three-column row plus
 * three, which is enough to fill the fold on a laptop without promising a
 * second screenful of posts that may not exist.
 */
const PLACEHOLDER_COUNT = 6;

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
 * loses its divider and its category list, keeping only the search field above
 * the grid, and the grid drops to two columns and then one. The categories move
 * behind the field's filter glyph as a dropdown -- see `CategoryFilter` -- so
 * the phone spends its width on posts rather than on a wrapped filter row.
 *
 * Presentational: posts, the loading flag and any error come in as props, and
 * `BlogList` beside this file is the half that fetches them. The rail and the
 * search field stay outside that -- they are the controls, and they must not
 * blink out while the results they control are being refetched.
 */
export function BlogIndex({
  posts,
  categories,
  activeCategory,
  query,
  isLoading = false,
  error = null,
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
      // The listing opens on the search field rather than a heading, so the
      // section's usual phone top padding leaves it stranded under the header.
      className={cn("pt-8 lg:pt-24", className)}
      {...props}
    >
      <Container className="flex flex-col gap-8 lg:flex-row lg:gap-6.75">
        <div className="flex flex-col gap-5 lg:w-92.75 lg:shrink-0 lg:border-r lg:border-outline lg:pr-10">
          <form
            action="/blog"
            role="search"
            className="flex items-center justify-between gap-2.5 rounded-pill bg-tertiary-100 px-5 py-3 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary"
          >
            <span className="flex min-w-0 flex-1 items-center gap-2.5">
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
            </span>

            {/*
             * The filter glyph the frame ends the field with. Below `lg` it
             * opens the categories; from `lg` up the rail already lists them
             * underneath, so there it stays the decorative glyph Figma draws.
             */}
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              query={query}
              className="lg:hidden"
            />
            <TuneIcon className="hidden size-6 shrink-0 text-on-surface lg:block" />

            {/* Searching inside a category stays inside it. */}
            {activeCategory ? (
              <input type="hidden" name="category" value={activeCategory} />
            ) : null}
          </form>

          <nav aria-label="Filter posts by category" className="hidden lg:block">
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

          {isLoading ? (
            <div
              role="status"
              aria-label="Loading posts"
              className="grid grid-cols-1 gap-x-8.25 gap-y-5.75 sm:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
                <BlogCardSkeleton
                  key={index}
                  variant="listing"
                  className="w-full p-3"
                />
              ))}
            </div>
          ) : error ? (
            /*
             * A failed listing says so rather than claiming there is nothing to
             * read -- "no posts match" would be a lie about the archive, and
             * would send the reader off looking for a different search.
             */
            <p role="alert" className="py-10 text-base text-ink-muted">
              {error}
            </p>
          ) : posts.length === 0 ? (
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
