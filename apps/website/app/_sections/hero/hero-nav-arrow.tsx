import type { ComponentPropsWithoutRef } from "react";

import { ArrowLeftSolidIcon, ArrowRightSolidIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

type HeroNavArrowProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  direction: "previous" | "next";
};

/**
 * The white disc that steps the hero one slide, shared by both slide pickers:
 * the desktop miniature strip and the phone dot row.
 *
 * The disc is 24px, as Figma draws it, which is well under a comfortable touch
 * target -- so `after` widens the pointer and touch area to 48px without
 * changing the layout around it.
 */
export function HeroNavArrow({
  direction,
  className,
  ...props
}: HeroNavArrowProps) {
  const Icon =
    direction === "previous" ? ArrowLeftSolidIcon : ArrowRightSolidIcon;

  return (
    <button
      type="button"
      aria-label={direction === "previous" ? "Previous slide" : "Next slide"}
      className={cn(
        "relative grid size-6 shrink-0 place-items-center rounded-pill bg-white text-ink-strong transition-colors after:absolute after:-inset-3 after:content-[''] hover:bg-tertiary-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
        className,
      )}
      {...props}
    >
      <Icon className="size-6" />
    </button>
  );
}
