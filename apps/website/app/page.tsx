import { LatestBlogs } from "@/components/sections/latest-blogs";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { PartnersStrip } from "@/components/sections/partners-strip";

import { subscribeToNewsletter } from "./_actions/newsletter";
import {
  DesignChallengeBand,
  DtrackerSurplusBand,
  PlatformTrackingBand,
} from "./_sections/home-bands";
import { HomeHero } from "./_sections/hero/home-hero";
import { latestPosts } from "./_sections/latest-posts";
import { WasteCrisis } from "./_sections/waste-crisis";

/**
 * Home page (Figma 3008:77 desktop, 3070:36669 mobile).
 *
 * Composition only: every band is a section component and the bands appear in
 * the order the two frames stack them. The blog posts are the placeholder set
 * in `_sections/latest-posts.ts` until `blogs-api` is wired up.
 */
export default function Home() {
  return (
    <>
      <HomeHero />
      <WasteCrisis />
      <PartnersStrip />
      <DesignChallengeBand />
      <DtrackerSurplusBand />
      <PlatformTrackingBand />
      <LatestBlogs posts={latestPosts} />
      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
