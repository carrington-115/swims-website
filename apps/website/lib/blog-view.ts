import type { Blog, BlogResponse, Section } from "@swims/api-client";

import { images } from "@/assets/images";
import type { CoverSource } from "@/components/media/cover-image";
import type { BlogCardPost } from "@/components/ui/blog-card";

/**
 * The API's blog shape, mapped onto what the sections render.
 *
 * The components were written against the Figma frames and take view models --
 * a formatted date, an excerpt, a cover -- not database rows. Mapping here
 * rather than in each section keeps that boundary: the API can grow a field
 * without every card learning about it, and a card can be re-cut without
 * touching the wire format.
 *
 * This file replaces the stand-in posts that used to live in
 * `app/blog/_content.ts` and `app/_sections/latest-posts.ts`.
 */

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
 * Both labels come off one timestamp, so a card and the post page can never
 * disagree about when something went out.
 *
 * Read in UTC, and hand-rolled rather than `Intl`, because this runs on the
 * server and again in the browser: a formatter that follows the machine's
 * locale or zone would produce two different strings for the same post and
 * React would report a hydration mismatch.
 */
function formatDate(iso: string) {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return { short: "", long: "", dateTime: "" };
  }

  const day = date.getUTCDate();
  const month = date.getUTCMonth();
  const year = date.getUTCFullYear();
  const pad = (value: number) => String(value).padStart(2, "0");

  return {
    short: `${pad(day)}/${pad(month + 1)}/${String(year).slice(2)}`,
    long: `${day} ${MONTHS[month]} ${year}`,
    dateTime: `${year}-${pad(month + 1)}-${pad(day)}`,
  };
}

/** When a post went out. Falls back to when the row appeared, for a draft. */
function publishDate(blog: Blog) {
  return formatDate(blog.publishedAt ?? blog.dateCreated);
}

/**
 * Blank lines separate paragraphs; a single newline is a wrap inside one.
 *
 * The editor is a plain textarea, so this is the only structure the prose
 * carries. A section with no content renders no paragraphs rather than one
 * empty `<p>`.
 */
export function toParagraphs(content: string | null): readonly string[] {
  if (!content) return [];

  return content
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

/**
 * What a card shows when the post has no summary: the opening of the body, cut
 * at a word so it does not end mid-syllable. Only the detail response carries
 * sections, so a listing card falls back to nothing and the excerpt is empty.
 */
function excerptFrom(blog: Blog, sections?: readonly Section[]): string {
  if (blog.description) return blog.description;

  const opening = toParagraphs(sections?.[0]?.content ?? null)[0];
  if (!opening) return "";

  if (opening.length <= 180) return opening;
  return `${opening.slice(0, opening.lastIndexOf(" ", 180)).trimEnd()}…`;
}

/**
 * The cover a card or the article head paints.
 *
 * A post's own `coverImage` is a URL in Supabase Storage; the registry
 * placeholder stands in when it has none, so a card is never a blank box. See
 * docs/IMAGES.md for why everything else on the site goes through the registry.
 */
function coverOf(blog: Blog): CoverSource {
  return blog.coverImage ?? images.home.blogPlaceholderCover;
}

/** The byline. `avatarUrl` is optional, and the card draws no circle without it. */
function authorOf(blog: Blog) {
  return {
    name: blog.author.name,
    ...(blog.author.avatarUrl ? { avatar: blog.author.avatarUrl } : {}),
  };
}

/** One post as the "Latest blogs" band draws it: cover, title, excerpt. */
export function toBandPost(blog: Blog): BlogCardPost {
  return {
    id: blog.id,
    title: blog.title,
    excerpt: excerptFrom(blog),
    href: `/blog/${blog.slug}`,
    cover: coverOf(blog),
  };
}

/** One post as the blog index draws it: the band card plus a byline and a date. */
export function toListingPost(blog: Blog): BlogCardPost {
  const date = publishDate(blog);

  return {
    ...toBandPost(blog),
    author: authorOf(blog),
    date: { label: date.short, dateTime: date.dateTime },
  };
}

/** One section of the article, with its anchor and its prose already split. */
export type ArticleSection = {
  /** The anchor the contents links to and the scroll spy watches. */
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export type ArticlePost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover: CoverSource;
  author: { name: string; avatar?: string };
  category: string | null;
  /** Long form, for the head's chip -- e.g. "2 January 2026". */
  publishedLabel: string;
  /** The machine-readable half of the same date. */
  publishedDateTime: string;
  /** As the chip prints it, e.g. "20 min". */
  readingTime: string;
  sections: readonly ArticleSection[];
};

/**
 * The full post.
 *
 * Anchors come from the API's `tableOfContents`, which is a projection of the
 * sections built on read -- so the rail and the body cannot drift, and two
 * sections sharing a heading still get distinct anchors. A section with no
 * entry (which the API does not produce) falls back to its own id.
 */
export function toArticle(blog: BlogResponse): ArticlePost {
  const date = publishDate(blog);
  const anchors = new Map(
    blog.tableOfContents.map((item) => [item.sectionId, item.anchor]),
  );

  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: excerptFrom(blog, blog.sections),
    cover: coverOf(blog),
    author: authorOf(blog),
    category: blog.category,
    publishedLabel: date.long,
    publishedDateTime: date.dateTime,
    readingTime: `${blog.timeToRead} min`,
    sections: blog.sections.map((section) => ({
      id: anchors.get(section.id) ?? section.id,
      title: section.title,
      paragraphs: toParagraphs(section.content),
    })),
  };
}
