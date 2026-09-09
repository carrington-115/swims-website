import type { Metadata } from "next";

import { LatestBlogsBand } from "@/components/sections/latest-blogs-band";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";

import { subscribeToNewsletter } from "../../_actions/newsletter";
import {
  DirectPaymentBand,
  LiveMapBand,
  PickupScheduleBand,
  SecureSetupBand,
  TrackEarningsBand,
} from "./_sections/dtracker-bands";
import { DownloadCta } from "./_sections/download-cta";
import { DtrackerHero } from "./_sections/dtracker-hero";

export const metadata: Metadata = {
  title: "DTRACKER",
  description:
    "DTRACKER gives waste collectors verified standing, pickups on their own schedule, earnings they can track, and same-day mobile money payment with no middleman.",
};

/*
 * ISR, because of the "Latest blogs" band: it fetches during the render, so
 * without this the page is baked at build time and the band shows whatever had
 * been published at deploy until the next one. Sixty seconds is the window a
 * new post can take to appear here; the band's own React Query cache refreshes
 * it in the browser sooner than that on a client-side navigation.
 */
export const revalidate = 60;

/**
 * DTRACKER product page (Figma 3049:5210, 3049:5238, 3049:35466, 3049:35465,
 * 3049:35472).
 *
 * Opens with the page's own hero frame (3046:5156) -- not the home carousel's
 * DTRACKER slide, which is a different frame with a different headline and a
 * single download link -- then five feature bands, the download call to action,
 * and the two shared bands every page closes with. The footer comes from
 * `app/layout.tsx`.
 */
export default function DtrackerPage() {
  return (
    <>
      <DtrackerHero />
      <SecureSetupBand />
      <PickupScheduleBand />
      <LiveMapBand />
      <TrackEarningsBand />
      <DirectPaymentBand />
      <DownloadCta />
      <LatestBlogsBand />
      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
