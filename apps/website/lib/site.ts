/**
 * Where this site lives, as an absolute origin.
 *
 * Canonical links, the sitemap and every share-preview image have to name a
 * full origin. A scraper has no page to resolve a relative path against: it
 * fetches the URL, reads the tags, and gives up on anything it cannot turn into
 * a request. So unlike `blogsApiUrl()` in `env.ts`, this value is not optional
 * decoration -- getting it wrong means the previews point somewhere that does
 * not exist.
 *
 * Resolved in order of how much the deployment actually knows:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` -- set it and it wins, always. This is the answer
 *     when the site is reached by a domain Vercel does not know it owns, or
 *     when a build needs to be pinned to production's identity.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` -- the project's *production* domain,
 *     which becomes the custom domain as soon as one is assigned. Crucially it
 *     is the same value in a preview build as in a production one, so a preview
 *     does not advertise itself as the canonical copy of the site.
 *  3. `VERCEL_URL` -- this exact deployment. Only reached on a Vercel build
 *     with no production domain yet.
 *  4. localhost, for `next dev`.
 *
 * Every caller here runs on the server -- metadata, the sitemap, the OG image
 * routes -- so `VERCEL_*` is readable and nothing needs a `NEXT_PUBLIC_` prefix
 * to survive into the browser.
 */

const LOCAL_ORIGIN = "http://localhost:3000";

export const SITE_NAME = "SWIMS";

/**
 * The site-wide description, and the fallback for any page that has not written
 * its own. It lives here rather than in `app/layout.tsx` so that the OG image
 * and the structured data can say the same thing the meta tags do.
 */
export const SITE_DESCRIPTION =
  "SWIMS formalises waste management in Africa: DTRACKER for collectors, and a data platform that makes every tonne visible.";

/**
 * Vercel supplies bare hostnames -- `swims.africa`, not `https://swims.africa`
 * -- and a value typed into a dashboard field tends to arrive with a trailing
 * slash. Both would produce a double slash or a relative URL further down.
 */
function normalise(value: string): string {
  const trimmed = value.trim();
  const withScheme = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
  return withScheme.replace(/\/+$/, "");
}

export function siteUrl(): string {
  /*
   * Written as whole literal `process.env.X` expressions on purpose: Next
   * inlines `NEXT_PUBLIC_*` at build time by substituting the exact text, so a
   * dynamic lookup would come back undefined. The rest are read at runtime and
   * only matter on Vercel.
   */
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return normalise(explicit);

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (production) return normalise(production);

  const deployment = process.env.VERCEL_URL;
  if (deployment) return normalise(deployment);

  return LOCAL_ORIGIN;
}

/**
 * A path made absolute against the origin above.
 *
 * For page metadata prefer passing the plain path to `pageMetadata` and letting
 * `metadataBase` resolve it -- that is Next's own mechanism and it cannot drift
 * from the canonical. This is for the places Next does not resolve anything:
 * the sitemap, and the JSON-LD `@id` and `url` fields.
 */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteUrl()).toString();
}

/**
 * True only on the production deployment.
 *
 * Previews are real, reachable URLs serving the same markup, so without this
 * they compete with production in the index and split its ranking signal.
 * `robots.ts` uses it to keep everything but production out of search results.
 */
export function isProductionDeployment(): boolean {
  // Undefined off Vercel, where `next start` on a server is a deliberate act.
  return (process.env.VERCEL_ENV ?? "production") === "production";
}
