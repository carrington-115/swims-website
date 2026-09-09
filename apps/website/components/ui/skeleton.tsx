import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

/**
 * One shimmering placeholder block.
 *
 * `aria-hidden`, and never announced: a skeleton is a picture of content that
 * is not there yet. The status is carried once, by the region around a whole
 * set of them, so a screen reader hears "loading posts" rather than fourteen
 * anonymous boxes.
 *
 * `motion-reduce` drops the pulse to a flat tone -- a looping animation is the
 * kind a vestibular disorder reacts to, and the block reads as a placeholder
 * without it.
 */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-sm bg-tertiary-100 motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}
