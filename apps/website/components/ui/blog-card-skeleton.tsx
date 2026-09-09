import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/cn";

type BlogCardSkeletonProps = {
  /** Matches `BlogCard`'s variant, so the placeholder is the height of the card. */
  variant?: "band" | "listing";
  className?: string;
};

/**
 * A `BlogCard` before its post has arrived.
 *
 * Deliberately the same shape as the card it stands in for -- the same
 * aspect-ratio cover, the same number of text lines at the same scale -- so the
 * grid does not resize when the data lands. A placeholder of the wrong height
 * is worse than none: it moves the page under the reader at the exact moment
 * they start looking at it.
 */
export function BlogCardSkeleton({
  variant = "band",
  className,
}: BlogCardSkeletonProps) {
  const listing = variant === "listing";

  return (
    <div className={cn("flex flex-col gap-3.25", className)}>
      <Skeleton className="aspect-[297/179] w-full rounded-none" />

      {listing ? (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.25">
            <Skeleton className="size-7.5 shrink-0 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-14 shrink-0" />
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Skeleton className={cn("w-4/5", listing ? "h-5" : "h-3.5 lg:h-5")} />
        <Skeleton className={cn("w-full", listing ? "h-4" : "h-3 lg:h-4")} />
        <Skeleton className={cn("w-full", listing ? "h-4" : "h-3 lg:h-4")} />
        <Skeleton className={cn("w-2/3", listing ? "h-4" : "h-3 lg:h-4")} />
      </div>
    </div>
  );
}
