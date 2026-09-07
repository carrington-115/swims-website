import NextImage, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { cn } from "@/lib/cn";

type SiteImageProps = Omit<ImageProps, "src" | "alt" | "placeholder"> & {
  /** An entry from the image registry -- `images.<group>.<name>`. */
  image: SiteImageAsset;
  /**
   * Override the registry alt text. Only for images whose meaning changes with
   * context; pass `""` to mark this instance decorative.
   */
  alt?: string;
  /** Render as an absolutely positioned cover fill, honouring `image.focal`. */
  cover?: boolean;
};

/**
 * The only way the site renders an image.
 *
 * It reads `src`/`alt` from the registry, applies the recorded focal point when
 * the image is used as a cover fill, and keeps the blur placeholder and lazy
 * loading defaults consistent. See docs/IMAGES.md.
 */
export function SiteImage({
  image,
  alt,
  cover = false,
  className,
  style,
  sizes,
  ...props
}: SiteImageProps) {
  const focalStyle = cover
    ? ({
        "--focal-base": image.focal?.base ?? "center",
        "--focal-md": image.focal?.md ?? image.focal?.base ?? "center",
      } as CSSProperties)
    : undefined;

  return (
    <NextImage
      src={image.src}
      alt={alt ?? image.alt}
      /*
       * A blur placeholder is painted as a `background-image` on the <img>, so
       * on artwork with an alpha channel it shows through the transparent
       * parts as a pale box -- most visibly a white slab behind a cut-out phone
       * on a coloured band. Registry entries mark themselves `transparent` and
       * opt out; photographs keep the blur.
       */
      placeholder={
        image.src.blurDataURL && !image.transparent ? "blur" : undefined
      }
      fill={cover || undefined}
      sizes={sizes ?? (cover ? "100vw" : undefined)}
      className={cn(cover && "object-cover object-focal", className)}
      style={focalStyle ? { ...focalStyle, ...style } : style}
      {...props}
    />
  );
}
