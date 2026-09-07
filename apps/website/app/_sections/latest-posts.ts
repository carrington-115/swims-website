import { images } from "@/assets/images";
import type { BlogCardPost } from "@/components/ui/blog-card";

/**
 * Stand-in posts for the "Latest blogs" band.
 *
 * `blogs-api` is not wired into the website yet, so the home page renders the
 * copy and artwork the Figma frame uses. When the client is connected, drop
 * this file and map the API response onto `BlogCardPost` in `page.tsx` -- the
 * section itself already takes its posts as props.
 */
export const latestPosts: readonly BlogCardPost[] = [
  "bangalore-mwm",
  "collector-earnings",
  "sensor-pilot",
  "policy-brief",
].map((id) => ({
  id,
  title: "Lessons from Bangalores MWM ecosystem",
  excerpt:
    "A conversation with a Dr. Meenakshi Barath showed me how Bangalore's responsible waste management advocates push 3-way separation at home and promote recycling through",
  href: `/blog/${id}`,
  cover: images.home.blogPlaceholderCover,
}));
