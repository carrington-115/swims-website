import type { ComponentPropsWithoutRef } from 'react';

import { cn } from '@/lib/cn';

/**
 * One shimmering placeholder block.
 *
 * `aria-hidden`, and never announced on its own: a skeleton is a picture of
 * content that has not arrived. The status is carried once, by the region
 * around a whole set of them, so a screen reader hears "loading your blogs"
 * rather than a dozen anonymous boxes.
 *
 * `motion-reduce` flattens the pulse -- a looping animation is the kind a
 * vestibular disorder reacts to, and the block still reads as a placeholder.
 */
export function Skeleton({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-field bg-canvas motion-reduce:animate-none', className)}
      {...props}
    />
  );
}
