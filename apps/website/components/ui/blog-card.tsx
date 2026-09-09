import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { CoverImage, type CoverSource } from "@/components/media/cover-image";
import { cn } from "@/lib/cn";

/** One post as a card needs it. Whatever fetches posts maps onto this. */
export type BlogCardPost = {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  /** A registry entry, or the URL of a cover uploaded from the dashboard. */
  cover: CoverSource;
  /**
   * Byline drawn above the title. Only the listing frame carries one -- the
   * "Latest blogs" band leaves both this and `date` unset.
   *
   * `avatar` is optional on its own: an author who has set no picture still has
   * a name to print, and the circle is simply not drawn.
   */
  author?: { name: string; avatar?: CoverSource };
  /**
   * Already formatted for display, with the machine-readable value beside it.
   * The card neither parses nor localises a date.
   */
  date?: { label: string; dateTime: string };
};

/**
 * Which frame the card is drawn for. They are the same card with two type
 * scales, because the grids around them are not the same size.
 *
 * `band` is the "Latest blogs" strip (Figma 3024:3672): two-up on phones, so
 * the type drops a long way down there and six lines of excerpt fit.
 * `listing` is the blog index (3070:35957): one card per row on a phone, so it
 * keeps the desktop scale throughout and clamps the excerpt to the three lines
 * the frame's fixed 88px box shows.
 */
type BlogCardVariant = "band" | "listing";

type BlogCardProps = Omit<ComponentPropsWithoutRef<"article">, "id"> & {
  post: BlogCardPost;
  variant?: BlogCardVariant;
  /** `sizes` for the cover, since the card is always narrower than the viewport. */
  sizes?: string;
};

const variants = {
  band: {
    title:
      "truncate text-xs lg:overflow-visible lg:text-lg lg:whitespace-normal",
    excerpt: "line-clamp-6 text-2xs lg:text-base",
  },
  listing: {
    title: "text-lg",
    excerpt: "line-clamp-3 text-base",
  },
} as const satisfies Record<
  BlogCardVariant,
  { title: string; excerpt: string }
>;

/**
 * A post in a listing (Figma 3024:3672 desktop, 3070:36977 mobile): cover on
 * top, then an optional byline, then title and excerpt.
 *
 * The title is the only link, but it is stretched over the whole card so the
 * cover is clickable too and screen readers still announce one link with the
 * post's name. That is also why the byline is plain text: a second link inside
 * the stretched one would not be reachable.
 */
export function BlogCard({
  post,
  variant = "band",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  ...props
}: BlogCardProps) {
  const styles = variants[variant];

  return (
    <article
      className={cn("group relative flex flex-col gap-3.25", className)}
      {...props}
    >
      <div className="relative aspect-[297/179] w-full overflow-hidden">
        <CoverImage cover={post.cover} sizes={sizes} />
      </div>

      {post.author || post.date ? (
        <div className="flex items-center justify-between gap-2 text-base text-ink-strong">
          {post.author ? (
            <span className="flex min-w-0 items-center gap-1.25">
              {post.author.avatar ? (
                <span className="relative size-7.5 shrink-0 overflow-hidden rounded-full">
                  <CoverImage cover={post.author.avatar} sizes="30px" />
                </span>
              ) : null}
              <span className="truncate">{post.author.name}</span>
            </span>
          ) : null}
          {post.date ? (
            <time dateTime={post.date.dateTime} className="shrink-0">
              {post.date.label}
            </time>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-col">
        <h3
          className={cn(
            "font-display font-medium text-ink-strong",
            styles.title,
          )}
        >
          <Link
            href={post.href}
            className="rounded-sm before:absolute before:inset-0 before:content-[''] group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {post.title}
          </Link>
        </h3>
        <p className={cn("text-ink-muted", styles.excerpt)}>{post.excerpt}</p>
      </div>
    </article>
  );
}
