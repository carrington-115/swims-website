import type { ComponentPropsWithoutRef } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

type LogoWallProps = ComponentPropsWithoutRef<"ul"> & {
  logos: readonly SiteImageAsset[];
};

/**
 * Row of partner and investor marks (Figma 3040:4795).
 *
 * Figma gives every logo its own height because the source files carry
 * different amounts of padding. Here they share one box and `object-contain`
 * instead, which lines the row up on both edges and keeps each mark's aspect.
 * The row scrolls rather than wrapping on phones, as the frame draws it. From
 * `lg` it wraps instead: five 200px marks and their gaps fill the 1320px
 * content width exactly, so a sixth starts a second centred row (Figma
 * 3065:35761 wraps nine marks 5/4 this way). Shorter walls never reach the
 * wrap point and are unaffected.
 */
export function LogoWall({ logos, className, ...props }: LogoWallProps) {
  return (
    <ul
      className={cn(
        "flex w-full items-center gap-10 overflow-x-auto lg:flex-wrap lg:justify-center lg:overflow-visible",
        className,
      )}
      {...props}
    >
      {logos.map((logo) => (
        <li key={logo.src.src} className="shrink-0">
          <SiteImage
            image={logo}
            className="h-10 w-25 object-contain opacity-60 lg:h-20 lg:w-50"
            sizes="(min-width: 1024px) 200px, 100px"
          />
        </li>
      ))}
    </ul>
  );
}
