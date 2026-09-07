import { images } from "@/assets/images";
import { FeatureBand } from "@/components/sections/feature-band";

/**
 * The three capability bands of the SWIMS Platform page, in the order the Figma
 * frames stack them (3063:35618, 3063:35617, 3063:35623).
 *
 * All three are `FeatureBand` with no call to action -- the page collects its
 * single button at the bottom in the request-service band rather than repeating
 * one per capability.
 *
 * The bands alternate sides the way the frames do: the sensor leads with copy,
 * the drone and the dashboard lead with the image. Media and copy widths are
 * each frame's own numbers rather than one shared pair.
 *
 * Figma only supplies desktop frames for this page. The phone layout is the one
 * `FeatureBand` already uses everywhere else -- copy first, image under it --
 * rather than a guess at a bespoke mobile design.
 */

/** "Real-Time Dustbin Level Sensors" (3063:35618). Copy left, sensor right. */
export function SensorBand() {
  return (
    <FeatureBand
      headingId="sensor-heading"
      tone="surface-primary"
      mediaSide="end"
      heading="Real-Time Dustbin Level Sensors"
      body="IoT sensors deployed at community and institutional collection points monitor waste levels in real time. No more overflowing bins on streets. No more wasted trips. Optimize collection frequency based on actual need, not guesswork."
      image={images.platform.sensor}
      mediaClassName="w-full lg:w-200"
      copyClassName="lg:w-140"
      gapClassName="lg:gap-5"
      sizes="(min-width: 1024px) 799px, 100vw"
    />
  );
}

/** "Drone Surveillance & Satellite Imagery" (3063:35617). Drone left. */
export function DroneBand() {
  return (
    <FeatureBand
      headingId="drone-heading"
      tone="surface-primary"
      heading="Drone Surveillance & Satellite Imagery"
      body="Real-time aerial monitoring shows exactly what's happening at dumpsites, collection areas, and city-wide waste flows. Detect illegal dumping. Track methane emissions. Plan infrastructure with precision. Satellite integration covers areas without on-ground access."
      image={images.platform.drone}
      mediaClassName="w-full lg:w-164"
      copyClassName="lg:w-140"
      gapClassName="lg:gap-5"
      sizes="(min-width: 1024px) 656px, 100vw"
    />
  );
}

/** "Data-Driven Desktop Dashboard" (3063:35623). Brand-green plate. */
export function DashboardBand() {
  return (
    <FeatureBand
      headingId="dashboard-heading"
      tone="primary"
      heading="Data-Driven Desktop Dashboard"
      body="Centralized visibility into collection routes, collector performance, waste volumes, and community participation. Make funding decisions, track compliance, and coordinate across departments — all from one interface built for decision-makers."
      image={images.platform.monitor}
      mediaClassName="w-full lg:w-130"
      copyClassName="lg:w-143"
      gapClassName="lg:gap-15"
      sizes="(min-width: 1024px) 519px, 100vw"
    />
  );
}
