import type { ComponentPropsWithoutRef } from "react";

import { images } from "@/assets/images";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { SiteImage } from "@/components/media/site-image";
import { ProductCard, type Product } from "@/components/ui/product-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type ProductHighlightsProps = ComponentPropsWithoutRef<"section"> & {
  products?: readonly Product[];
  heading?: string;
};

/**
 * The three things SWIMS ships, in the order the frames draw them.
 *
 * Lives here rather than in a route's `_content.ts` because Why Us and Partners
 * render the identical band; a page that needs a different set passes its own.
 *
 * DTRACKER draws the wordmark on the brand-green panel instead of a
 * photograph, which is the one place the grid needs custom artwork -- hence
 * `art` rather than `image`.
 */
export const defaultProducts: readonly Product[] = [
  {
    id: "dtracker",
    title: "DTRACKER",
    href: "/products/dtracker",
    art: (
      <SiteImage
        image={images.brand.dtrackerLogo}
        alt=""
        className="absolute top-1/2 left-1/2 h-7.5 w-auto -translate-x-1/2 -translate-y-1/2 lg:h-15"
      />
    ),
    body: "The mobile app connecting informal waste collectors to households, eliminating middlemen, and enabling direct earning through transparent tracking and real-time payment — proven to increase collector income by 500% in pilot communities.",
  },
  {
    id: "swims-platform",
    title: "SWIMS Platform",
    href: "/products/platform",
    image: images.platform.monitor,
    body: "A data-informed platform combining IoT sensors, GPS tracking, and AI analytics to give governments and organizations real-time visibility into collection routes, volumes, and performer data — transforming invisible informal systems into formal, coordinated infrastructure.",
  },
  {
    id: "design-challenge",
    title: "SWIMS Design Challenge",
    href: "/products/design-challenge",
    image: images.products.designChallenge,
    body: "A continent-wide initiative engaging 300+ designers to create campaigns, posters, and concepts that shift perception — proving sensitization works through visibility and recognition, not fear, when informal collectors get formal spotlight.",
  },
];

/**
 * "Our top products and initiatives" (Figma 3040:4894 desktop, 3076:37460
 * mobile; 3065:35796 on Partners): the three things SWIMS ships, side by side.
 *
 * Two-up on phones, which leaves the third card on its own row exactly as the
 * phone frame draws it, and three-up from `lg`.
 */
export function ProductHighlights({
  products = defaultProducts,
  heading = "Our top products and initiatives",
  className,
  ...props
}: ProductHighlightsProps) {
  if (products.length === 0) return null;

  return (
    <Section
      spacing="md"
      aria-labelledby="product-highlights-heading"
      className={cn(className)}
      {...props}
    >
      <Container className="flex flex-col items-center gap-5">
        <SectionHeading
          id="product-highlights-heading"
          className="max-w-85 font-semibold lg:max-w-none"
        >
          {heading}
        </SectionHeading>

        <ul className="grid w-full grid-cols-2 gap-x-4 gap-y-5 lg:grid-cols-3 lg:gap-x-12">
          {products.map((product) => (
            <li key={product.id} className="flex">
              <ProductCard product={product} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
