import type { ComponentPropsWithoutRef, CSSProperties } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

type LogoWallProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  logos: readonly SiteImageAsset[];
  /**
   * How the marks are laid out.
   *
   * `marquee` is the default and what every band outside the Partners page
   * uses: one row sliding sideways for as long as the band is on screen.
   * `grid` is the Partners page's own wall, where the marks are the content of
   * the page rather than a passing mention, so they hold still and can be read
   * -- three columns on phones, five from `lg`.
   */
  layout?: "marquee" | "grid";
  /** Accessible name for the wall. */
  label?: string;
};

/**
 * Seconds of travel per mark. The component multiplies it by the number of
 * marks so a nine-logo wall and a five-logo strip move at the same speed rather
 * than the longer one racing to finish in a fixed duration.
 */
const secondsPerLogo = 4;

/**
 * The most marks that are ever on screen at once: the narrowest mark box and
 * its gap (100px + 40px on phones) against the widest row the site draws (the
 * 1440px shell less its two 60px gutters). The marquee renders enough copies of
 * the list that the ones still to the right of the shift keep the row full, so
 * the loop never resets onto empty space.
 */
const marksPerRow = 8;

/*
 * Figma gives every logo its own height because the source files carry
 * different amounts of padding. Here they share one box and `object-contain`
 * instead, which lines the row up on both edges and keeps each mark's aspect.
 */
const logoClass = "h-10 object-contain opacity-60 lg:h-20";
const logoSizes = "(min-width: 1024px) 200px, 100px";

/**
 * Wall of partner and investor marks (Figma 3040:4795 the strip, 3065:35761 the
 * Partners page wall).
 *
 * Two layouts, because the marks do two different jobs. On the Partners page
 * they are the point of the section, so `layout="grid"` sits them still in a
 * 3-column grid that becomes 5 columns on desktop. Everywhere else -- the home
 * strip, the Why Us band -- they are a credential in passing, and the default
 * marquee keeps the whole set visible in a band that is only a few rows tall
 * without asking anyone to scroll sideways.
 */
export function LogoWall({
  logos,
  layout = "marquee",
  label = "Partner and investor logos",
  className,
  style,
  ...props
}: LogoWallProps) {
  if (layout === "grid") {
    return (
      <div className={cn("w-full", className)} {...props}>
        <ul
          aria-label={label}
          className="grid grid-cols-3 items-center gap-x-6 gap-y-8 lg:grid-cols-5 lg:gap-x-10 lg:gap-y-12"
        >
          {logos.map((logo) => (
            <li key={logo.src.src} className="flex justify-center">
              <SiteImage
                image={logo}
                sizes={logoSizes}
                className={cn(logoClass, "w-full max-w-25 lg:max-w-50")}
              />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  /*
   * The trailing gap belongs to each copy, not to the track between them --
   * see the `.logo-marquee` note in globals.css for why the seam depends on it.
   */
  const copyClass = "flex shrink-0 items-center gap-10 pr-10";
  const marks = logos.map((logo) => (
    <li key={logo.src.src} className="shrink-0">
      <SiteImage
        image={logo}
        sizes={logoSizes}
        className={cn(logoClass, "w-25 lg:w-50")}
      />
    </li>
  ));

  const copies = Math.max(2, Math.ceil(marksPerRow / logos.length) + 1);

  return (
    <div
      /*
       * The tab stop is the keyboard's way to pause the row (the CSS pauses on
       * `:focus-within`), and the only way to scroll it once a reduced-motion
       * preference turns it back into a plain scroller.
       */
      tabIndex={0}
      role="group"
      aria-label={label}
      className={cn(
        "logo-marquee w-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        className,
      )}
      style={
        {
          "--logo-marquee-duration": `${logos.length * secondsPerLogo}s`,
          "--logo-marquee-shift": `calc(-100% / ${copies})`,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <div className="logo-marquee-track flex w-max">
        <ul className={copyClass}>{marks}</ul>
        {/* Every copy after the first is what the loop lands on: decoration. */}
        {Array.from({ length: copies - 1 }, (_, copy) => (
          <ul key={copy} className={copyClass} aria-hidden data-marquee-clone>
            {marks}
          </ul>
        ))}
      </div>
    </div>
  );
}
