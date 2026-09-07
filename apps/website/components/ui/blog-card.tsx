import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

/** One post as a card needs it. Whatever fetches posts maps onto this. */
export type BlogCardPost = {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  cover: SiteImageAsset;
};

type BlogCardProps = Omit<ComponentPropsWithoutRef<"article">, "id"> & {
  post: BlogCardPost;
  /** `sizes` for the cover, since the card is always narrower than the viewport. */
  sizes?: string;
};

/**
 * A post in a listing (Figma 3024:3672 desktop, 3070:36977 mobile): cover on
 * top, then title and excerpt.
 *
 * The title is the only link, but it is stretched over the whole card so the
 * cover is clickable too and screen readers still announce one link with the
 * post's name.
 */
export function BlogCard({
  post,
  sizes = "(min-width: 1024px) 25vw, 50vw",
  className,
  ...props
}: BlogCardProps) {
  return (
    <article
      className={cn("group relative flex flex-col gap-3.25", className)}
      {...props}
    >
      <div className="relative aspect-[297/179] w-full overflow-hidden">
        <SiteImage image={post.cover} alt="" cover sizes={sizes} />
      </div>

      <div className="flex flex-col">
        <h3 className="truncate font-display text-xs font-medium text-ink-strong lg:overflow-visible lg:text-lg lg:whitespace-normal">
          <Link
            href={post.href}
            className="rounded-sm before:absolute before:inset-0 before:content-[''] group-hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-6 text-2xs text-ink-muted lg:text-base">
          {post.excerpt}
        </p>
      </div>
    </article>
  );
}
