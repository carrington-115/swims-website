import { images } from "@/assets/images";
import { FeatureBand } from "@/components/sections/feature-band";

/**
 * The five feature bands of the DTRACKER page, in the order the Figma frames
 * stack them (3049:5210, 3049:5238, 3049:5244, 3049:35466, 3049:35465).
 *
 * Each is a `FeatureBand` with no call to action -- the page collects its two
 * buttons at the bottom in `DownloadCta` rather than repeating one per band.
 * Every mockup is a single flat render that already contains the whole
 * composition Figma draws: the phone, its crop, and any badge or second handset
 * floated over it. Nothing here overlays anything.
 *
 * Every frame runs its phone off the bottom edge of the band, so all five use
 * `mediaAlign="bottom"`: the mockup is flush with the band's bottom and the
 * copy stays centred beside it.
 *
 * The media width, the copy width and the gap between them are the Figma
 * frame's own numbers rather than one shared pair -- the bands genuinely differ
 * (a 490px copy column beside a tight crop, a 559px one beside a mockup that
 * carries its own whitespace), and forcing them to match is what left the
 * columns misaligned.
 *
 * Figma only supplies desktop frames for this page. The phone layout is the one
 * `FeatureBand` already uses on the home page -- copy first, mockup under it,
 * media-left from `lg` -- rather than a guess at a bespoke mobile design.
 */

/** "Easy and Secured Setup" (3049:5210). The mockup carries the shield badge. */
export function SecureSetupBand() {
  return (
    <FeatureBand
      headingId="secure-setup-heading"
      mediaAlign="bottom"
      tone="tertiary"
      heading="Easy and Secured Setup"
      body="No paperwork delays. No rejection. DTRACKER's streamlined verification gives you legal standing as a waste collector, building your reputation and giving households confidence in your service."
      image={images.dtracker.security}
      mediaClassName="w-full max-w-108 lg:w-108"
      copyClassName="lg:w-122.5"
      gapClassName="lg:gap-25"
      sizes="(min-width: 1024px) 432px, 100vw"
    />
  );
}

/** "Choose your pickup schedule" (3049:5238). */
export function PickupScheduleBand() {
  return (
    <FeatureBand
      headingId="pickup-schedule-heading"
      mediaAlign="bottom"
      tone="surface-accent"
      heading="Choose your pickup schedule"
      body="One-time pickups. Weekly routes. Monthly plans. Customers request collection when they need it, you accept what fits your schedule — no pressure, full control over your time and earnings."
      image={images.dtracker.schedule}
      mediaClassName="w-full max-w-109.5 lg:w-109.5"
      copyClassName="lg:w-139.75"
      gapClassName="lg:gap-25"
      sizes="(min-width: 1024px) 438px, 100vw"
    />
  );
}

/** "See where the work is, 24/7" (3049:5244). Green plate, two overlaid phones. */
export function LiveMapBand() {
  return (
    <FeatureBand
      headingId="live-map-heading"
      mediaAlign="bottom"
      tone="secondary"
      heading="See where the work is, 24/7"
      body="Real-time map showing all collection requests in your service area. Accept the pickups that make sense for your route. Build your customer base one request at a time."
      image={images.dtracker.availability}
      mediaClassName="w-full max-w-136.75 lg:w-136.75"
      copyClassName="lg:w-122.5"
      gapClassName="lg:gap-5.25"
      sizes="(min-width: 1024px) 547px, 100vw"
    />
  );
}

/** "Set goals. Track earnings." (3049:35466). The render is both handsets. */
export function TrackEarningsBand() {
  return (
    <FeatureBand
      headingId="track-earnings-heading"
      mediaAlign="bottom"
      tone="surface-accent"
      heading="Set goals. Track earnings. Grow your income."
      body="See exactly what you earned today, this week, this month. Set income targets. Watch your progress. Understand your business like a real entrepreneur — because that's what you are."
      image={images.dtracker.goals}
      mediaClassName="w-full max-w-173 lg:w-173"
      copyClassName="lg:w-139.75"
      gapClassName="lg:gap-4.75"
      sizes="(min-width: 1024px) 692px, 100vw"
    />
  );
}

/** "Direct payment. No waiting. No middleman." (3049:35465). */
export function DirectPaymentBand() {
  return (
    <FeatureBand
      headingId="direct-payment-heading"
      mediaAlign="bottom"
      tone="tertiary"
      heading="Direct payment. No waiting. No middleman."
      body="MTN Mobile Money or Orange Money. Choose your preferred payment method. Get paid the same day you collect. Your money is yours to keep, immediately."
      image={images.dtracker.payment}
      mediaClassName="w-full max-w-81 lg:w-81"
      copyClassName="lg:w-122.5"
      gapClassName="lg:gap-23.75"
      sizes="(min-width: 1024px) 323px, 100vw"
    />
  );
}
