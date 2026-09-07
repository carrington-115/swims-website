import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { HeroNavArrow } from "./hero-nav-arrow";

type HeroThumbNavProps = Omit<ComponentPropsWithoutRef<"div">, "onSelect"> & {
  /** Server-rendered miniatures, one per slide, in slide order. */
  thumbnails: readonly ReactNode[];
  /** Slide names, used for the accessible name of each miniature. */
  labels: readonly string[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
};

/** Width of one miniature, in pixels. Two of them fit in the viewport. */
const THUMB_WIDTH = 164;
const VISIBLE_THUMBS = 2;

/**
 * Desktop slide picker (Figma 3013:173): a previous arrow, a strip of slide
 * miniatures clipped to two, and a next arrow. The strip slides so the current
 * slide leads, and the current miniature carries a white outline.
 *
 * Rendered inside the client slider, so it holds no state of its own.
 */
export function HeroThumbNav({
  thumbnails,
  labels,
  activeIndex,
  onSelect,
  onPrevious,
  onNext,
  className,
  ...props
}: HeroThumbNavProps) {
  const maxOffset = Math.max(thumbnails.length - VISIBLE_THUMBS, 0);
  const offset = Math.min(activeIndex, maxOffset);

  return (
    <div
      className={cn(
        "absolute right-15 bottom-11 hidden items-center gap-3 lg:flex",
        className,
      )}
      {...props}
    >
      <HeroNavArrow direction="previous" onClick={onPrevious} />

      <div className="w-82 overflow-hidden">
        <ul
          className="flex transition-transform duration-500 ease-out-soft"
          style={{ transform: `translateX(-${offset * THUMB_WIDTH}px)` }}
        >
          {thumbnails.map((thumbnail, index) => (
            <li key={index} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={index === activeIndex}
                className={cn(
                  "relative isolate block h-24 w-41 overflow-hidden transition-[outline-color] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  index === activeIndex &&
                    "outline-[2.5px] -outline-offset-[2.5px] outline-white",
                )}
              >
                <span className="sr-only">{labels[index]}</span>
                {thumbnail}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <HeroNavArrow direction="next" onClick={onNext} />
    </div>
  );
}
