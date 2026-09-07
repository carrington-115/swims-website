import type { Metadata } from "next";

import { LatestBlogs } from "@/components/sections/latest-blogs";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { TeamGrid } from "@/components/sections/team-grid";
import { team } from "@/lib/team";

import { subscribeToNewsletter } from "../_actions/newsletter";
import { latestPosts } from "../_sections/latest-posts";

export const metadata: Metadata = {
  title: "Our people",
  description:
    "The people building SWIMS: the founders and directors behind DTRACKER and the platform that makes Africa's waste visible.",
};

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

      <LatestBlogs posts={latestPosts} />

      <NewsletterSignup action={subscribeToNewsletter} />
    </>
  );
}
