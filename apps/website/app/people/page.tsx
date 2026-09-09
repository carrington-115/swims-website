import { LatestBlogsBand } from "@/components/sections/latest-blogs-band";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { TeamGrid } from "@/components/sections/team-grid";
import { pageMetadata } from "@/lib/seo";
import { team } from "@/lib/team";

import { subscribeToNewsletter } from "../_actions/newsletter";

export const metadata = pageMetadata({
  title: "Our people",
  description:
    "The people building SWIMS: the founders and directors behind DTRACKER and the platform that makes Africa's waste visible.",
  path: "/people",
});

/*
 * ISR, because of the "Latest blogs" band: it fetches during the render, so
 * without this the page is baked at build time and the band shows whatever had
 * been published at deploy until the next one. Sixty seconds is the window a
 * new post can take to appear here; the band's own React Query cache refreshes
 * it in the browser sooner than that on a client-side navigation.
 */
export const revalidate = 60;

/**
 * People (Figma 3040:4780 team, 3046:5002 blogs, 3046:5026 newsletter,
 * 3046:5034 footer -- the footer is the site's, drawn by the root layout).
 *
 * Composition only: every band already exists in `components/sections/`, and
 * the roster comes from `lib/team.ts`. Because the team band opens the page it
 * carries the `h1`; each card links to `/people/<slug>`, which the layout's
 * `@modal` slot intercepts and shows as a popup.
 */
export default function People() {
  return (
    <>
      <TeamGrid people={team} headingLevel={1} />

      <LatestBlogsBand />

      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
