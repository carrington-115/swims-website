import type { MetadataRoute } from "next";

import { absoluteUrl, isProductionDeployment, siteUrl } from "@/lib/site";

/**
 * What crawlers may read, and where the map is.
 *
 * Preview deployments are refused outright. They serve the same pages on a real
 * URL, so left crawlable they compete with production for its own queries and
 * split the signal between two hostnames -- and a preview built from a branch
 * can advertise copy nobody has approved.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isProductionDeployment()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
    // Names the canonical hostname when the site answers on more than one.
    host: siteUrl(),
  };
}
