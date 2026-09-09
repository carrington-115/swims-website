import NextImage from "next/image";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

/**
 * Where a cover comes from: a registry entry, or a URL.
 *
 * Everything the site ships goes through the registry (docs/IMAGES.md) -- it is
 * what gives `next/image` the intrinsic size and the blur placeholder. A post's
 * cover is the one exception: authors upload it from the dashboard, so it lives
 * in Supabase Storage and is only ever a URL at build time.
 */
export type CoverSource = SiteImageAsset | string;

type CoverImageProps = {
  cover: CoverSource;
  /** Covers sit beside the title they belong to, so they are decorative by default. */
  alt?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
};

/**
 * A cover fill, from either source.
 *
 * Always `fill`, because an uploaded image has no intrinsic size to lay out
 * from -- the caller gives it an aspect-ratio box to fill, which is what the
 * frames draw anyway. No blur placeholder on the remote branch for the same
 * reason: there is nothing to generate one from without downloading the file at
 * build time.
 */
export function CoverImage({
  cover,
  alt = "",
  sizes,
  priority,
  className,
}: CoverImageProps) {
  if (typeof cover === "string") {
    return (
      <NextImage
        src={cover}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <SiteImage
      image={cover}
      alt={alt}
      cover
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
