import type { Metadata } from "next";

import { CtaBand } from "@/components/sections/cta-band";
import { LatestBlogsBand } from "@/components/sections/latest-blogs-band";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { Button } from "@/components/ui/button";
import { PhoneIncomingIcon } from "@/components/ui/icons";

import { subscribeToNewsletter } from "../../_actions/newsletter";
import {
  DashboardBand,
  DroneBand,
  SensorBand,
} from "./_sections/platform-bands";
import { PlatformHero } from "./_sections/platform-hero";

export const metadata: Metadata = {
  title: "SWIMS Platform",
  description:
    "Bin-level IoT sensors, drone and satellite monitoring, and one dashboard that turns a city's waste flows into decisions its institutions can act on.",
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
 * SWIMS Platform page (Figma 3049:35583, 3063:35618, 3063:35617, 3063:35623,
 * 3063:35631).
 *
 * Hero, the three capability bands, the request-service call to action, then
 * the two shared bands every page closes with. The footer comes from
 * `app/layout.tsx`.
 *
 * The closing band's heading and body do not come from the frame. Figma still
 * carries the DTRACKER page's copy there -- "Ready to start earning more? /
 * Download DTRACKER on iOS or Android and join 100+ collectors" -- which
 * addresses collectors downloading an app, on a page selling business
 * intelligence to institutions, and contradicts its own button. The button is
 * the frame's; the words above it are written to match it. Swap them back here
 * if the frame is right and the button is wrong.
 */
export default function PlatformPage() {
  return (
    <>
      <PlatformHero />
      <SensorBand />
      <DroneBand />
      <DashboardBand />

      <CtaBand
        headingId="request-service-heading"
        heading="Ready to see your city's waste data?"
        body="Tell us what you need to measure and we will show you what the platform already tracks, from bin-level sensors to city-wide dashboards."
        action={
          <Button
            href="/contact?enquiry=platform"
            shape="square"
            className="gap-3 px-3"
          >
            <PhoneIncomingIcon className="size-6 shrink-0" />
            Request our services today
          </Button>
        }
      />

      <LatestBlogsBand />
      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
