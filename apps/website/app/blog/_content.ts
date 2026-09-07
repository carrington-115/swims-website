import { images } from "@/assets/images";
import type { BlogCardPost } from "@/components/ui/blog-card";

/**
 * Copy and stand-in posts for the blog index (Figma 3146:301) and the post
 * page (3152:307).
 *
 * `blogs-api` is not wired into the website yet, so this is the frames' own
 * placeholder card repeated the fifteen times the index draws it, with the
 * categories spread across the set so the sidebar filter has something to do.
 * When the client is connected, delete this file and map the API response onto
 * `BlogPost` in the routes -- `packages/schemas` already describes the shape it
 * arrives in (`blogSchema`, `sectionSchema`, `tableOfContentsSchema`), and the
 * sections here line up with it: a section is a title and its prose, and the
 * table of contents is derived from the sections rather than stored twice.
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

/**
 * One section of a post: the heading the table of contents lists, and the
 * prose under it. `id` is the anchor the contents links to and the scroll spy
 * watches, so it has to be unique within a post.
 */
export type BlogSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export type BlogPost = BlogCardPost & {
  category: BlogCategory["id"];
  /** Long form of `date`, for the post page's chip. */
  publishedLabel: string;
  /** As the chip prints it, e.g. "20 min". */
  readingTime: string;
  sections: readonly BlogSection[];
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Both labels come off one ISO date, so the card and the post page can never
 * disagree about when something was published. Hand-rolled rather than `Intl`
 * because a date-only string has no timezone and `Date` would give it one.
 */
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return {
    short: `${day}/${month}/${year.slice(2)}`,
    long: `${day} ${MONTHS[Number(month) - 1]} ${year}`,
  };
}

const author = {
  name: "Fru-Mark Carrington Chei",
  avatar: images.team.ceo,
};

/**
 * The eight headings the frame's table of contents lists, in its order. Note
 * that it lists the introduction twice; that is the placeholder as drawn, and
 * `sectionId` keeps the two anchors apart.
 */
const sectionTitles: readonly string[] = [
  "Introduction — The Question That Started It All",
  "The Problem I Thought I Understood",
  "Introduction — The Question That Started It All",
  "Meeting Hasiru Dala Innovations",
  "Learning from SWMRT Bangalore",
  'The Pivot — From "Engineer Around" to "Build On"',
  "What Visibility Actually Looks Like",
  "The Policy Piece — Why Tech Alone Fails",
];

const introParagraphs: readonly string[] = [
  "I arrived in Bangalore in early 2022, on a Mercedes-Benz fellowship, with a specific problem in mind: how to use technology to fix Africa's waste management crisis. I had spent months thinking about IoT sensors, mobile apps, data dashboards — all the tools that seemed like they could solve the invisible infrastructure problem I'd witnessed in Cameroon. I was convinced that the answer lay in engineering a better system from scratch, in building technology so elegant and efficient that it would revolutionize how waste was managed across the continent. But Bangalore had a different lesson waiting for me.",
  'During my fellowship, I visited two organizations that would fundamentally shift how I thought about this problem. At Hasiru Dala Innovations and the Swachh Mahagaraja Resource Team (SWMRT), I encountered waste management ecosystems that were already working — imperfectly, invisibly, but effectively. These weren\'t systems that needed replacement. They needed connection. That realization changed everything. It transformed my question from "How do I engineer a better waste system?" to "How do I connect and legitimize the systems that are already there?" That shift would become the foundation of SWIMS.',
];

const bodyParagraphs: readonly string[] = [
  "Before Bangalore, I was operating from a assumption that most technology entrepreneurs make: the informal system is broken, so we need to engineer something better. This logic had shaped how I initially thought about SWIMS. I imagined building apps that would essentially bypass informal collectors — creating formal collection networks, digital payment systems, algorithmic routing — all designed to work despite the informal sector, not with it. It's a seductive approach because it feels clean and controllable. You design the system you want, you deploy it, and if adoption is high enough, the old informal ways fade away.",
  "But this approach fails spectacularly in the African context, and I didn't fully understand why until I started asking the right questions in Bangalore. The informal waste management ecosystem in African cities isn't broken because the people running it lack intelligence or efficiency. It's broken because it's invisible. Collectors and waste pickers are disconnected from households who need them. They're disconnected from governments who can't coordinate or fund them. They're disconnected from markets where their materials could be recycled. And critically, they're disconnected from the data systems that would legitimize their work and allow them to build stable livelihoods. My assumption that informal systems = the problem was backwards. Invisibility was the problem. The informal system was already solving waste — it just needed to be seen.",
];

/** `Title — with "punctuation"` becomes `title-with-punctuation`. */
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildSections(): readonly BlogSection[] {
  const seen = new Map<string, number>();

  return sectionTitles.map((title, index) => {
    const base = slugify(title);
    const count = (seen.get(base) ?? 0) + 1;
    seen.set(base, count);

    return {
      id: count === 1 ? base : `${base}-${count}`,
      title,
      paragraphs: index === 0 ? introParagraphs : bodyParagraphs,
    };
  });
}

const sections = buildSections();
const published = formatDate("2026-01-02");

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
      date: { label: published.short, dateTime: "2026-01-02" },
      publishedLabel: published.long,
      readingTime: "20 min",
      category: category.id,
      sections,
    };
  },
);

export function findPost(id: string): BlogPost | undefined {
  return blogPosts.find((post) => post.id === id);
}

export function findCategory(id: string): BlogCategory | undefined {
  return blogCategories.find((category) => category.id === id);
}

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
