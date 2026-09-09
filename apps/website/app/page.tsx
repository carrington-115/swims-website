import { LatestBlogsBand } from "@/components/sections/latest-blogs-band";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { PartnersStrip } from "@/components/sections/partners-strip";

import { subscribeToNewsletter } from "./_actions/newsletter";
import {
  DesignChallengeBand,
  DtrackerSurplusBand,
  PlatformTrackingBand,
} from "./_sections/home-bands";
import { HomeHero } from "./_sections/hero/home-hero";
import { WasteCrisis } from "./_sections/waste-crisis";

/*
 * ISR, because of the "Latest blogs" band: it fetches during the render, so
 * without this the page is baked at build time and the band shows whatever had
 * been published at deploy until the next one. Sixty seconds is the window a
 * new post can take to appear here; the band's own React Query cache refreshes
 * it in the browser sooner than that on a client-side navigation.
 */
export const revalidate = 60;

/**
 * Home page (Figma 3008:77 desktop, 3070:36669 mobile).
 *
 * Composition only: every band is a section component and the bands appear in
 * the order the two frames stack them.
 *
 * The "Latest blogs" band reads the Blogs API. It fetches and prefetches
 * itself, so this page stays what it was: composition only.
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
      <LatestBlogsBand />
      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
