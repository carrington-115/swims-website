import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type SectionHeadingProps = ComponentPropsWithoutRef<"h2"> & {
  /** `h2` for a band inside a page; `h1` only when the section is the page. */
  as?: "h1" | "h2";
  align?: "center" | "start";
};

/**
 * The heading that titles a page band -- "Latest blogs" and its siblings
 * (Figma 3024:3665 desktop, 3070:36975 mobile).
 *
 * Poppins at its regular weight, not semibold: the Figma bands are titled
 * quietly and let the cards underneath carry the emphasis.
 */
export function SectionHeading({
  as: Component = "h2",
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <Component
      className={cn(
        "font-display text-2xl font-normal text-ink-strong lg:text-4xl",
        align === "center" ? "text-center" : "text-start",
        className,
      )}
      {...props}
    />
  );
}
