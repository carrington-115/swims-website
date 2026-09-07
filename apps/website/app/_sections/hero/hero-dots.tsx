import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

import { HeroNavArrow } from "./hero-nav-arrow";

type HeroDotsProps = Omit<ComponentPropsWithoutRef<"div">, "onSelect"> & {
  labels: readonly string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  /**
   * Whether the slider is advancing on its own. The active pill doubles as the
   * countdown, so it only animates while autoplay is running.
   */
  autoplaying: boolean;
};

/**
 * Phone slide picker (Figma 3070:36693): small dots, with the current slide
 * drawn as a wide pill that fills as the slide plays out.
 *
 * The step arrows either side are not in the phone frame -- Figma only draws
 * them on desktop -- but the phone view needs the same explicit control, so it
 * borrows the desktop disc and keeps the row centred.
 *
 * Rendered inside the client slider, so it holds no state of its own.
 */
export function HeroDots({
  labels,
  activeIndex,
  onSelect,
  onPrevious,
  onNext,
  autoplaying,
  className,
  ...props
}: HeroDotsProps) {
  return (
    <div
      className={cn(
        "absolute bottom-9.5 left-1/2 flex -translate-x-1/2 items-center gap-4 lg:hidden",
        className,
      )}
      {...props}
    >
      <HeroNavArrow direction="previous" onClick={onPrevious} />

      <div className="flex items-center gap-0.5">
        {labels.map((label, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onSelect(index)}
              aria-label={label}
              aria-current={isActive}
              className={cn(
                "relative h-2 shrink-0 overflow-hidden rounded-pill after:absolute after:-inset-2 after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white",
                isActive ? "w-10 bg-white/40" : "w-2 bg-white/50",
              )}
            >
              {isActive ? (
                <span
                  /* Remounts on every slide change so the countdown restarts. */
                  key={activeIndex}
                  className={cn(
                    "absolute inset-y-0 left-0 rounded-pill bg-white",
                    autoplaying ? "hero-progress" : "w-full",
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <HeroNavArrow direction="next" onClick={onNext} />
    </div>
  );
}
