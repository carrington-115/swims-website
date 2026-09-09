import type { MetadataRoute } from "next";

import { blogsApi } from "@/lib/blogs-api";
import { absoluteUrl } from "@/lib/site";
import { team } from "@/lib/team";

/**
 * Every URL worth crawling, in one file.
 *
 * Rebuilt hourly rather than per request: posts are published from the
 * dashboard at any time, so a sitemap baked at deploy would go stale, and one
 * rebuilt on demand would let a crawler drive traffic to the Blogs API.
 */
export const revalidate = 3600;

/**
 * The hand-written routes. `priority` is a hint about relative importance
 * within this site -- not a ranking -- and `changeFrequency` says how often a
 * crawler should bother coming back.
 */
const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/why-us", priority: 0.8, changeFrequency: "monthly" },
  { path: "/products/dtracker", priority: 0.9, changeFrequency: "monthly" },
  { path: "/products/platform", priority: 0.9, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "daily" },
  { path: "/people", priority: 0.6, changeFrequency: "monthly" },
  { path: "/partners", priority: 0.6, changeFrequency: "monthly" },
] as const satisfies readonly {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[];

/** The API caps `limit` at 100, so a long archive is several requests. */
const PAGE_SIZE = 100;

async function publishedPosts() {
  const posts = [];
  let offset = 0;

  for (;;) {
    const page = await blogsApi.blogs.list({ limit: PAGE_SIZE, offset });
    posts.push(...page.data);

    offset += PAGE_SIZE;
    // The second test is the guard against a `total` that disagrees with the
    // rows actually returned -- without it that is an infinite loop.
    if (offset >= page.total || page.data.length === 0) break;
  }

  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const peopleEntries = team.map((member) => ({
    url: absoluteUrl(`/people/${member.id}`),
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  /*
   * A sitemap that throws is a 500, and a crawler reads that as "this site has
   * no sitemap" -- worse than one listing only the pages that never needed the
   * API. So an unreachable Blogs API costs the posts, not the file.
   */
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    postEntries = (await publishedPosts()).map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("[sitemap] could not list posts from the Blogs API:", error);
  }

  return [...staticEntries, ...peopleEntries, ...postEntries];
}
