import { images } from "@/assets/images";
import { FeatureBand } from "@/components/sections/feature-band";

/**
 * The three media-and-copy bands the home page runs between the partner strip
 * and the blog listing. Each is a `FeatureBand`; only the tone, the media and
 * the way the two stack on phones change between them.
 *
 * They live here rather than in `page.tsx` because the copy is long enough to
 * bury the page's composition, and they are one file rather than three because
 * apart from their props they are the same band. The moment a second route
 * needs one of them, lift it into `components/sections/` on its own -- see
 * docs/COMPONENTS.md.
 */

/**
 * "The SWIMS Design Challenge Report" (Figma 3020:3539 desktop, 3070:36918
 * mobile). Cameroon in white on the brand green; the map follows the copy on
 * phones, as the mobile frame draws it.
 */
export function DesignChallengeBand() {
  return (
    <FeatureBand
      headingId="design-challenge-heading"
      tone="primary"
      heading="The SWIMS Design Challenge Report"
      body="Our design challenge reframed waste management, proving that sensitization isn't about fear, but about visibility and what becomes possible when informal systems get formal recognition."
      cta={{ label: "Read the article", href: "/products/design-challenge" }}
      image={images.home.cameroonMap}
      mediaClassName="w-77 max-w-full self-center lg:w-100 lg:self-auto"
      sizes="(min-width: 1024px) 400px, 308px"
    />
  );
}

/**
 * "Get 500% surplus on Monthly operations" (Figma 3022:3574 desktop, 3143:286
 * mobile).
 *
 * On phones the mobile frame centres the mockup in a 330x301 clipping frame
 * flush with the bottom of the band, so the handset runs off the page rather
 * than ending in mid-air -- hence the fixed height, the `overflow-hidden` and
 * the band dropping its own bottom padding. Desktop shows the whole mockup, so
 * both come back from `lg`. The button sits at the right edge on phones only,
 * which is the one thing this band does differently from the other two.
 */
export function DtrackerSurplusBand() {
  return (
    <FeatureBand
      headingId="dtracker-surplus-heading"
      heading="Get 500% surplus on Monthly operations"
      body="Turn your work into income you can count on. Set weekly targets. Watch your earnings accumulate in real time. Build a customer base that depends on you, and pays you fairly for it. No middleman. No delays."
      cta={{ label: "Learn more", href: "/products/dtracker" }}
      ctaAlign="end"
      image={images.home.phone}
      className="pb-0 lg:pb-24"
      mediaClassName="mx-auto h-75.25 w-82.5 max-w-full overflow-hidden lg:mx-0 lg:h-auto lg:overflow-visible"
      sizes="330px"
    />
  );
}

/**
 * "SWIMS empower organizations with tools to track where and when" (Figma
 * 3024:3608 desktop, 3070:36940 mobile). The only band whose media leads on
 * phones, where the mobile frame centres the sensor over the copy.
 */
export function PlatformTrackingBand() {
  return (
    <FeatureBand
      headingId="platform-tracking-heading"
      tone="tertiary"
      mediaFirst
      heading="SWIMS empower organizations with tools to track where and when"
      body="Integrate SWIMS devices, sensors, drones, vision cameras, for smart waste tracking in organizations and communities with big data analytics and AI experience."
      cta={{ label: "Learn more", href: "/products/platform" }}
      image={images.home.iotSensor}
      gapClassName="gap-5 lg:gap-25"
      mediaClassName="w-66.5 max-w-full self-center lg:w-114 lg:self-auto"
      sizes="(min-width: 1024px) 456px, 266px"
    />
  );
}
