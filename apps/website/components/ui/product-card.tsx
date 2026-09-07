import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SiteImage as SiteImageAsset } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

/** One product or initiative as a card needs it. */
export type Product = {
  id: string;
  title: string;
  body: string;
  href?: string;
  /** Artwork for the panel. Omit and pass `art` to draw something instead. */
  image?: SiteImageAsset;
  /** Rendered inside the brand-green panel in place of an image. */
  art?: ReactNode;
};

type ProductCardProps = Omit<ComponentPropsWithoutRef<"article">, "id"> & {
  product: Product;
  sizes?: string;
};

/**
 * A product or initiative (Figma 3040:4862): a brand-green panel above a title
 * and a paragraph.
 *
 * The panel is always `bg-secondary`, which shows through where the artwork is
 * a transparent logo -- that is how the DTRACKER card is drawn -- and sits
 * behind the photograph on the others.
 */
export function ProductCard({
  product,
  sizes = "(min-width: 1024px) 33vw, 50vw",
  className,
  ...props
}: ProductCardProps) {
  const heading = (
    <h3 className="font-display text-lg font-medium text-ink-strong lg:text-2xl">
      {product.href ? (
        <Link
          href={product.href}
          className="rounded-sm before:absolute before:inset-0 before:content-[''] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {product.title}
        </Link>
      ) : (
        product.title
      )}
    </h3>
  );

  return (
    <article
      className={cn("relative flex flex-col gap-2 lg:gap-4", className)}
      {...props}
    >
      <div className="relative h-30 w-full overflow-hidden bg-secondary lg:h-54">
        {product.image ? (
          <SiteImage image={product.image} cover sizes={sizes} />
        ) : (
          product.art
        )}
      </div>
      <div className="flex flex-col">
        {heading}
        <p className="text-xs text-ink-muted lg:text-base">{product.body}</p>
      </div>
    </article>
  );
}
