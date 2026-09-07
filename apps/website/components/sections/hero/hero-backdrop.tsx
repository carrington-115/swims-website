import type { ComponentPropsWithoutRef } from "react";

import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

import type { HeroSlideContent } from "./hero-slide-content";

type HeroBackdropProps = ComponentPropsWithoutRef<"div"> & {
  slide: HeroSlideContent;
  /**
   * `slide` fills the carousel; `thumb` is the 164x95 miniature the desktop
   * picker shows. Same artwork either way -- the picker in Figma is literally a
   * scaled-down slide -- so only the framing changes.
   */
  size?: "slide" | "thumb";
  /** Set on the first slide so its photograph is not lazy-loaded. */
  priority?: boolean;
};

/**
 * Everything behind the copy on a hero slide.
 *
 * A photo slide is a cover image plus the `hero-scrim` gradient. The brand
 * slide is flat `bg-secondary` with the DTRACKER phone mockups floated in: one
 * rotated handset bleeding off the top-right on phones, the four-phone cluster
 * anchored bottom-right on desktop.
 */
export function HeroBackdrop({
  slide,
  size = "slide",
  priority = false,
  className,
  ...props
}: HeroBackdropProps) {
  const isThumb = size === "thumb";
  // The slide is full bleed at every breakpoint, so it is simply the viewport.
  const sizes = isThumb ? "164px" : "100vw";

  return (
    <div
      className={cn("absolute inset-0 -z-10 overflow-hidden", className)}
      {...props}
    >
      {slide.tone === "photo" ? (
        <>
          <SiteImage
            image={slide.image}
            alt=""
            cover
            sizes={sizes}
            priority={priority}
          />
          <div className="hero-scrim absolute inset-0" />
        </>
      ) : (
        <div className="absolute inset-0 bg-secondary">
          {/*
           * Phones. The thumbnail only has room for the cluster, so it reuses
           * the desktop art at any width.
           */}
          {slide.imageMobile && !isThumb ? (
            <SiteImage
              image={slide.imageMobile}
              alt=""
              priority={priority}
              sizes="325px"
              className="absolute top-[250px] left-[113.7%] w-[325px] max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-[32.47deg] lg:hidden"
            />
          ) : null}
          <div
            className={cn(
              "absolute right-0 bottom-0",
              isThumb ? "top-[16%] w-[49%]" : "top-[125px] hidden w-[48.6%] lg:block",
            )}
          >
            <SiteImage
              image={slide.image}
              alt=""
              fill
              priority={priority}
              sizes={isThumb ? "82px" : "49vw"}
              className="object-contain object-bottom"
            />
          </div>
        </div>
      )}
    </div>
  );
}
