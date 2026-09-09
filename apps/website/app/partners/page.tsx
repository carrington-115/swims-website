import { images } from "@/assets/images";
import { BackedBy } from "@/components/sections/backed-by";
import { PageHero } from "@/components/sections/page-hero";
import { ProductHighlights } from "@/components/sections/product-highlights";
import { Button } from "@/components/ui/button";
import { pageMetadata } from "@/lib/seo";

import { heroBody, heroHeading, partnerLogos, wallHeading } from "./_content";

export const metadata = pageMetadata({
  title: "Our Partners",
  description:
    "SWIMS connects collectors, institutions, and innovators to solve Africa's waste crisis together. The organisations backing us, and the products they back.",
  path: "/partners",
});

/**
 * Partners (Figma 3065:35738 hero, 3065:35757 wall, 3065:35796 products).
 *
 * Composition only: every band is a section from `components/sections/` and
 * every string comes from `_content.ts`. The product grid is the same one Why
 * Us renders, so it takes no props.
 */
export default function Partners() {
  return (
    <>
      <PageHero
        image={images.partners.hero}
        heading={heroHeading}
        body={heroBody}
        action={
          <Button
            href="/contact"
            variant="onImageSolid"
            shape="square"
            className="px-3"
          >
            Become a partner
          </Button>
        }
      />

      <BackedBy
        id="become-a-partner"
        heading={wallHeading}
        body={null}
        logos={partnerLogos}
        logoLayout="grid"
        ctas={[{ label: "Become a partner", href: "/contact" }]}
      />

      <ProductHighlights />
    </>
  );
}
