import { images } from "@/assets/images";
import type { BlogCardPost } from "@/components/ui/blog-card";

/**
 * Copy and stand-in posts for the blog index (Figma 3146:301).
 *
 * `blogs-api` is not wired into the website yet, so this is the frame's own
 * placeholder card repeated the fifteen times it draws it, with the categories
 * spread across the set so the sidebar filter has something to do. When the
 * client is connected, delete this file and map the API response onto
 * `BlogCardPost` in `page.tsx` -- the section already takes its posts as props.
 *
 * The "Latest blogs" band has its own stand-ins in `app/_sections`; both go at
 * the same time.
 */

/** One entry in the sidebar filter. `id` is what `?category=` carries. */
export type BlogCategory = { id: string; label: string };

/**
 * The five categories the frame lists, in its order. "All" is not one of them
 * -- it is the absence of a filter, so it carries no id and no query.
 */
export const blogCategories: readonly BlogCategory[] = [
  { id: "company", label: "Company" },
  { id: "waste-management-in-africa", label: "Waste management in Africa" },
  { id: "global-waste-management", label: "Global waste management" },
  {
    id: "technology-in-waste-management",
    label: "Technology in waste management",
  },
  { id: "case-study", label: "Case study" },
];

export type BlogPost = BlogCardPost & { category: BlogCategory["id"] };

const author = {
  name: "Fru-Mark Carrington Chei",
  avatar: images.team.ceo,
};

/** 02/01/26 in the frame; dd/mm/yy, so 2 January 2026. */
const date = { label: "02/01/26", dateTime: "2026-01-02" };

export const blogPosts: readonly BlogPost[] = Array.from(
  { length: 15 },
  (_, index) => {
    const category = blogCategories[index % blogCategories.length];
    const id = `bangalore-mwm-${index + 1}`;

    return {
      id,
      title: "Lessons from Bangalores MWM ecosystem",
      excerpt:
        "A conversation with a Dr. Meenakshi Barath showed me how Bangalore's responsible waste management advocates push 3-way separation at home and promote recycling through",
      href: `/blog/${id}`,
      cover: images.home.blogPlaceholderCover,
      author,
      date,
      category: category.id,
    };
  },
);

/**
 * The posts a request should show. Both filters are optional and combine:
 * `category` matches exactly, `query` is a case-insensitive substring of the
 * title or the excerpt.
 *
 * Here so the route can filter before it renders -- the section is a server
 * component and takes the posts it is given.
 */
export function filterPosts(
  posts: readonly BlogPost[],
  { category, query }: { category?: string; query?: string },
): readonly BlogPost[] {
  const needle = query?.trim().toLowerCase();

  return posts.filter((post) => {
    if (category && post.category !== category) return false;
    if (!needle) return true;

    return (
      post.title.toLowerCase().includes(needle) ||
      post.excerpt.toLowerCase().includes(needle)
    );
  });
}
