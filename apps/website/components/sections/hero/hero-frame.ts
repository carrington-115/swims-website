/**
 * The shell every hero on the site draws itself in: the home carousel, the
 * standing photo hero on an interior page, and the single-panel banner on a
 * product page.
 *
 * A class string rather than a component because the three heroes need it on
 * different roots -- the carousel puts its own pointer and keyboard handlers on
 * this element -- and one of them is a client component. `buttonVariants` is
 * shared the same way.
 *
 * Geometry: full bleed, 90vh tall, square corners. The height is the
 * `--spacing-hero` token; changing it here changes every hero on the site at
 * once, including any page added later.
 *
 * `isolate` keeps the backdrop's negative z-index inside the frame, and
 * `overflow-hidden` crops artwork that runs past the edges -- which the
 * DTRACKER phone cluster and the carousel's photographs both do.
 */
export const heroFrame =
  "relative isolate h-hero w-full overflow-hidden";

/**
 * Where the copy sits inside that frame: low, against the leading edge, clear
 * of the slide pickers the carousel draws along the bottom.
 */
export const heroFrameCopy =
  "flex size-full flex-col justify-end px-gutter pb-25 lg:px-16 lg:pb-29";
