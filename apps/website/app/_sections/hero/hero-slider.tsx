"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/lib/cn";

import { heroFrame } from "@/components/sections/hero/hero-frame";

import { HeroDots } from "./hero-dots";
import { HeroThumbNav } from "./hero-thumb-nav";

type HeroSliderProps = ComponentPropsWithoutRef<"div"> & {
  /** Server-rendered slides, in order. */
  slides: readonly ReactNode[];
  /** Server-rendered miniatures for the desktop picker, in the same order. */
  thumbnails: readonly ReactNode[];
  /** Slide names, in the same order, for the pickers' accessible names. */
  labels: readonly string[];
  /** How long a slide holds before advancing. `0` turns autoplay off. */
  interval?: number;
};

/** How far a gesture must travel horizontally before it counts as a swipe. */
const SWIPE_THRESHOLD = 48;

/**
 * The only client component in the hero.
 *
 * It owns which slide is showing and nothing else: the slides and the picker
 * miniatures arrive already rendered from the server section, so no image or
 * copy code is shipped to the browser. Slides cross-fade; the inactive ones
 * stay mounted but `inert`, which keeps their links out of the tab order and
 * their text out of the accessibility tree.
 *
 * Autoplay pauses on hover and on keyboard focus, and never starts at all when
 * the visitor prefers reduced motion.
 *
 * Slides can be stepped by the arrows in either picker, by the left and right
 * arrow keys, or by swiping. Swipe is touch and pen only -- a mouse drag would
 * fight text selection and the call to action on the slide.
 */
export function HeroSlider({
  slides,
  thumbnails,
  labels,
  interval = 7000,
  className,
  style,
  ...props
}: HeroSliderProps) {
  const total = slides.length;
  const swipeStart = useRef<{ x: number; y: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMotionAllowed(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const goTo = useCallback(
    (index: number) => setActiveIndex(((index % total) + total) % total),
    [total],
  );
  const goToPrevious = useCallback(
    () => goTo(activeIndex - 1),
    [goTo, activeIndex],
  );
  const goToNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);

  const autoplaying = motionAllowed && !paused && interval > 0 && total > 1;

  useEffect(() => {
    if (!autoplaying) return;
    const timer = window.setTimeout(
      () => setActiveIndex((index) => (index + 1) % total),
      interval,
    );
    return () => window.clearTimeout(timer);
  }, [autoplaying, interval, total, activeIndex]);

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToPrevious();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      goToNext();
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;

    // Only a decisive, mostly-horizontal gesture counts -- anything shorter or
    // steeper is the visitor scrolling the page, or tapping a control.
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;

    if (dx < 0) goToNext();
    else goToPrevious();
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="SWIMS highlights"
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => (swipeStart.current = null)}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      style={
        { "--hero-progress-duration": `${interval}ms`, ...style } as CSSProperties
      }
      className={cn(
        // `touch-pan-y` keeps vertical page scrolling with the browser while
        // handing us the horizontal gesture.
        heroFrame,
        "touch-pan-y",
        className,
      )}
      {...props}
    >
      <div className="absolute inset-0" aria-live={paused ? "polite" : "off"}>
        {slides.map((slide, index) => (
          <div
            key={index}
            inert={index !== activeIndex}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out-soft",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          >
            {slide}
          </div>
        ))}
      </div>

      <HeroThumbNav
        thumbnails={thumbnails}
        labels={labels}
        activeIndex={activeIndex}
        onSelect={goTo}
        onPrevious={goToPrevious}
        onNext={goToNext}
      />
      <HeroDots
        labels={labels}
        activeIndex={activeIndex}
        onSelect={goTo}
        onPrevious={goToPrevious}
        onNext={goToNext}
        autoplaying={autoplaying}
      />
    </div>
  );
}
