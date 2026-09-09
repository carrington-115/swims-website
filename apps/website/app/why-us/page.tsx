import { images } from "@/assets/images";
import { BackedBy } from "@/components/sections/backed-by";
import { CollectorPitch } from "@/components/sections/collector-pitch";
import { FounderMessage } from "@/components/sections/founder-message";
import { LatestBlogsBand } from "@/components/sections/latest-blogs-band";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { PageHero } from "@/components/sections/page-hero";
import { ProductHighlights } from "@/components/sections/product-highlights";
import { TeamGrid } from "@/components/sections/team-grid";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/seo";

import { subscribeToNewsletter } from "../_actions/newsletter";
import {
  backers,
  collectorBenefits,
  founder,
  founderParagraphs,
  heroHeading,
  team,
} from "./_content";

export const metadata = pageMetadata({
  title: "Why SWIMS",
  description:
    "Informal waste systems are not a problem to replace, they are infrastructure to formalize. The team, the products and the case behind SWIMS.",
  path: "/why-us",
});

/*
 * ISR, because of the "Latest blogs" band: it fetches during the render, so
 * without this the page is baked at build time and the band shows whatever had
 * been published at deploy until the next one. Sixty seconds is the window a
 * new post can take to appear here; the band's own React Query cache refreshes
 * it in the browser sooner than that on a client-side navigation.
 */
export const revalidate = 60;

/**
 * Why Us (Figma 3025:4695 desktop, 3076:37272 mobile).
 *
 * Composition only: every band is a section from `components/sections/` and
 * every string comes from `_content.ts`. The product grid carries no props
 * because it already defaults to these three.
 */
export default function WhyUs() {
  return (
    <>
      <PageHero
        image={images.whyUs.hero}
        heading={heroHeading}
        action={
          <Button
            href="#founder-message"
            variant="onImageSolid"
            shape="square"
            className="gap-3 px-3"
          >
            Founder&apos;s message
            <ArrowDownIcon className="size-6" />
          </Button>
        }
      />

      <FounderMessage
        paragraphs={founderParagraphs}
        portrait={founder.portrait}
        name={founder.name}
        role={founder.role}
      />

      <TeamGrid people={team} />

      <BackedBy logos={backers} />

      <CollectorPitch benefits={collectorBenefits} />

      <ProductHighlights />

      <LatestBlogsBand />

      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
