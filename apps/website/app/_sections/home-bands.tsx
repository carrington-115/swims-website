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
 * "Get 500% surplus on Monthly operations" (Figma 3022:3574 desktop, 3070:36931
 * mobile).
 *
 * Figma bleeds the phone off the left edge of the phone frame at roughly 1.6x
 * the screen width. It runs full bleed here instead -- edge to edge, whole --
 * which keeps the same "wider than the copy" reading without a fixed overhang
 * that has to be re-tuned for every screen between 320 and 430px.
 */
export function DtrackerSurplusBand() {
  return (
    <FeatureBand
      headingId="dtracker-surplus-heading"
      heading="Get 500% surplus on Monthly operations"
      body="Turn your work into income you can count on. Set weekly targets. Watch your earnings accumulate in real time. Build a customer base that depends on you, and pays you fairly for it. No middleman. No delays."
      cta={{ label: "Learn more", href: "/products/dtracker" }}
      image={images.home.phone}
      mediaClassName="-mx-gutter lg:mx-0 lg:w-82.5"
      sizes="(min-width: 1024px) 330px, 100vw"
    />
  );
}

/**
 * "SWIMS empower organizations with tools to track where and when" (Figma
 * 3024:3608 desktop, 3070:36940 mobile). The only band whose media leads on
 * phones.
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
      mediaClassName="w-66.5 max-w-full self-end lg:w-114 lg:self-auto"
      sizes="(min-width: 1024px) 456px, 266px"
    />
  );
}
