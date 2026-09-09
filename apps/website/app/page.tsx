import { LatestBlogsBand } from "@/components/sections/latest-blogs-band";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { PartnersStrip } from "@/components/sections/partners-strip";
import { JsonLd, organisationJsonLd, webSiteJsonLd } from "@/lib/json-ld";
import { pageMetadata } from "@/lib/seo";

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

/*
 * The home page had no metadata of its own, so it inherited the bare "SWIMS"
 * default from the root layout -- the one page most likely to be shared, with
 * the least to say about itself. The title carries the proposition rather than
 * the brand, because the "| SWIMS" suffix is appended by the layout's template.
 */
export const metadata = pageMetadata({
  title: "Smart waste management for Africa",
  description:
    "SWIMS connects the collectors who already manage Africa's waste with the households, cities and institutions that need them: DTRACKER for collectors, and a data platform that makes every tonne visible.",
  path: "/",
});

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
      {/*
       * Declared here rather than in the root layout: these describe SWIMS and
       * the site as a whole, and repeating them on every page would say the
       * same thing seven times. The home page is the canonical place to assert
       * an organisation.
       */}
      <JsonLd data={organisationJsonLd()} />
      <JsonLd data={webSiteJsonLd()} />

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
