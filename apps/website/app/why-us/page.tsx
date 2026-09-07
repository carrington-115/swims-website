import type { Metadata } from "next";

import { images } from "@/assets/images";
import { BackedBy } from "@/components/sections/backed-by";
import { CollectorPitch } from "@/components/sections/collector-pitch";
import { FounderMessage } from "@/components/sections/founder-message";
import { LatestBlogs } from "@/components/sections/latest-blogs";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { PageHero } from "@/components/sections/page-hero";
import { ProductHighlights } from "@/components/sections/product-highlights";
import { TeamGrid } from "@/components/sections/team-grid";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon } from "@/components/ui/icons";

import { subscribeToNewsletter } from "../_actions/newsletter";
import { latestPosts } from "../_sections/latest-posts";
import {
  backers,
  collectorBenefits,
  founder,
  founderParagraphs,
  heroHeading,
  team,
} from "./_content";

export const metadata: Metadata = {
  title: "Why SWIMS",
  description:
    "Informal waste systems are not a problem to replace, they are infrastructure to formalize. The team, the products and the case behind SWIMS.",
};

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

      <LatestBlogs posts={latestPosts} />

      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
