import type { ComponentPropsWithoutRef } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { BlogCard, type BlogCardPost } from "@/components/ui/blog-card";
import { BlogCardSkeleton } from "@/components/ui/blog-card-skeleton";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type LatestBlogsProps = ComponentPropsWithoutRef<"section"> & {
  posts: readonly BlogCardPost[];
  /** Draws the grid as placeholders. `posts` is ignored while this is set. */
  isLoading?: boolean;
  /** How many placeholders to draw, i.e. how many posts were asked for. */
  placeholderCount?: number;
  heading?: string;
  /** Text and destination of the button under the grid. */
  cta?: { label: string; href: string };
};

/**
 * "Latest blogs" band (Figma 3024:3705 desktop, 3070:36974 mobile): a quiet
 * heading, a row of post cards, and a link to the full archive.
 *
 * Two-up on phones and four-up from `lg`, which is what the two frames draw.
 * Posts come in as props -- the section never fetches. `LatestBlogsBand` in
 * `app/_sections` is the half that does.
 *
 * The band disappears entirely when there are no posts and nothing is on its
 * way. It is a pointer to the archive, not a promise the home page makes: an
 * empty grid under a "Latest blogs" heading reads as something broken, whereas
 * the section simply not being there reads as nothing at all.
 */
export function LatestBlogs({
  posts,
  isLoading = false,
  placeholderCount = 4,
  heading = "Latest blogs",
  cta = { label: "Go to all blogs", href: "/blog" },
  className,
  ...props
}: LatestBlogsProps) {
  if (!isLoading && posts.length === 0) return null;

  return (
    <Section
      spacing="md"
      aria-labelledby="latest-blogs-heading"
      className={cn(className)}
      {...props}
    >
      <Container className="flex flex-col items-center gap-5">
        <SectionHeading id="latest-blogs-heading">{heading}</SectionHeading>

        {isLoading ? (
          <div
            role="status"
            aria-label="Loading the latest posts"
            className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5.75"
          >
            {Array.from({ length: placeholderCount }, (_, index) => (
              <BlogCardSkeleton key={index} className="w-full" />
            ))}
          </div>
        ) : (
          <ul className="grid w-full grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5.75">
            {posts.map((post) => (
              <li key={post.id} className="flex">
                <BlogCard post={post} className="w-full" />
              </li>
            ))}
          </ul>
        )}

        <Button href={cta.href} shape="square" className="px-3">
          {cta.label}
        </Button>
      </Container>
    </Section>
  );
}
