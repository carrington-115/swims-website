import { images } from "@/assets/images";
import { FeatureBand } from "@/components/sections/feature-band";

/**
 * The five feature bands of the DTRACKER page, in the order the Figma frames
 * stack them.
 *
 * Desktop frames: 3049:5210, 3049:5238, 3049:5244, 3049:35466, 3049:35465.
 * Mobile frames:  3076:37807, 3076:37825, 3076:37841, 3076:37854, 3076:37861.
 *
 * Each is a `FeatureBand` with no call to action -- the page collects its two
 * buttons at the bottom in `DownloadCta` rather than repeating one per band.
 * Every mockup is a single flat render that already contains the whole
 * composition Figma draws: the phone, its crop, and any badge or second handset
 * floated over it. Nothing here overlays anything.
 *
 * Both frame sets run the phone off the bottom edge of the band, so all five
 * use `mediaAlign="bottom"`: the band drops its bottom padding at every width
 * and the mockup -- already cropped in the asset -- finishes flush with the
 * band's own bottom. On desktop the copy stays centred beside it; on phones it
 * sits above it.
 *
 * The media width, the copy width and the gap between them are the Figma
 * frame's own numbers rather than one shared pair -- the bands genuinely differ
 * (a 490px copy column beside a tight crop, a 559px one beside a mockup that
 * carries its own whitespace), and forcing them to match is what left the
 * columns misaligned. The mobile gap is per-band for the same reason: it runs
 * from 20px under the setup band's copy to 95px under the payment band's.
 *
 * The mobile frames set their own type scale, 30/18 rather than the 24/16 the
 * home page uses, hence `typeScale="lg"` on all five.
 */

/**
 * "Easy and Secured Setup" (3049:5210 desktop, 3076:37807 mobile). The mockup
 * carries the shield badge.
 */
export function SecureSetupBand() {
  return (
    <FeatureBand
      headingId="secure-setup-heading"
      mediaAlign="bottom"
      typeScale="lg"
      tone="tertiary"
      heading="Easy and Secured Setup"
      body="No paperwork delays. No rejection. DTRACKER's streamlined verification gives you legal standing as a waste collector, building your reputation and giving households confidence in your service."
      image={images.dtracker.security}
      mediaClassName="w-full max-w-108 lg:w-108"
      copyClassName="lg:w-122.5"
      gapClassName="gap-5 lg:gap-25"
      sizes="(min-width: 1024px) 432px, 100vw"
    />
  );
}

/** "Choose your pickup schedule" (3049:5238 desktop, 3076:37825 mobile). */
export function PickupScheduleBand() {
  return (
    <FeatureBand
      headingId="pickup-schedule-heading"
      mediaAlign="bottom"
      typeScale="lg"
      tone="surface-accent"
      heading="Choose your pickup schedule"
      body="One-time pickups. Weekly routes. Monthly plans. Customers request collection when they need it, you accept what fits your schedule — no pressure, full control over your time and earnings."
      image={images.dtracker.schedule}
      mediaClassName="w-full max-w-109.5 lg:w-109.5"
      copyClassName="lg:w-139.75"
      gapClassName="gap-12.5 lg:gap-25"
      sizes="(min-width: 1024px) 438px, 100vw"
    />
  );
}

/**
 * "See where the work is, 24/7" (3049:5244 desktop, 3076:37841 mobile). Green
 * plate, two overlaid phones.
 */
export function LiveMapBand() {
  return (
    <FeatureBand
      headingId="live-map-heading"
      mediaAlign="bottom"
      typeScale="lg"
      tone="secondary"
      heading="See where the work is, 24/7"
      body="Real-time map showing all collection requests in your service area. Accept the pickups that make sense for your route. Build your customer base one request at a time."
      image={images.dtracker.availability}
      mediaClassName="w-full max-w-136.75 lg:w-136.75"
      copyClassName="lg:w-122.5"
      gapClassName="gap-5.25 lg:gap-5.25"
      sizes="(min-width: 1024px) 547px, 100vw"
    />
  );
}

/**
 * "Set goals. Track earnings." (3049:35466 desktop, 3076:37854 mobile).
 *
 * The one band whose two frames draw different artwork: desktop is both
 * handsets tilted, 692px wide, which is illegible at the 358px phone width, so
 * the mobile frame swaps in a single upright earnings screen 308px wide and
 * centres it.
 */
export function TrackEarningsBand() {
  return (
    <FeatureBand
      headingId="track-earnings-heading"
      mediaAlign="bottom"
      typeScale="lg"
      tone="surface-accent"
      heading="Set goals. Track earnings. Grow your income."
      body="See exactly what you earned today, this week, this month. Set income targets. Watch your progress. Understand your business like a real entrepreneur — because that's what you are."
      image={images.dtracker.goals}
      mobileImage={images.dtracker.goalsMobile}
      mediaClassName="mx-auto w-full max-w-77 lg:mx-0 lg:w-173 lg:max-w-none"
      copyClassName="lg:w-139.75"
      gapClassName="gap-10 lg:gap-4.75"
      sizes="(min-width: 1024px) 692px, 0px"
      mobileSizes="(min-width: 1024px) 0px, 308px"
    />
  );
}

/**
 * "Direct payment. No waiting. No middleman." (3049:35465 desktop, 3076:37861
 * mobile). The mobile frame centres the handset rather than hanging it off the
 * copy's left edge.
 */
export function DirectPaymentBand() {
  return (
    <FeatureBand
      headingId="direct-payment-heading"
      mediaAlign="bottom"
      typeScale="lg"
      tone="tertiary"
      heading="Direct payment. No waiting. No middleman."
      body="MTN Mobile Money or Orange Money. Choose your preferred payment method. Get paid the same day you collect. Your money is yours to keep, immediately."
      image={images.dtracker.payment}
      mediaClassName="mx-auto w-full max-w-81 lg:mx-0 lg:w-81"
      copyClassName="lg:w-122.5"
      gapClassName="gap-24 lg:gap-23.75"
      sizes="(min-width: 1024px) 323px, 100vw"
    />
  );
}
