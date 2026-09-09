import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/site";

/**
 * One page's metadata, complete.
 *
 * Every route used to export a bare `{ title, description }`, which is why a
 * shared link arrived as a grey rectangle: without `og:` tags there is nothing
 * for a scraper to build a card from. Rather than repeat six tags per page and
 * let them drift, each page calls this and gets the whole set.
 *
 * It does not take a title suffix: `app/layout.tsx` holds the `"%s | SWIMS"`
 * template, which Next applies to the document title. `og:title` is left as the
 * plain title because the card renders `og:site_name` beside it -- "Why SWIMS |
 * SWIMS" is what happens when both are applied.
 *
 * It does take responsibility for the image, which is subtler than it looks.
 * `app/opengraph-image.tsx` is only inherited by a route that says nothing
 * about `openGraph` at all; declaring the object here -- which every page needs
 * to, for the url and the type -- replaces the parent's, image included. So
 * `/why-us` shipped a card with a title, a description and no picture, which is
 * a grey link with extra steps.
 */
export type PageMetadataInput = {
  /** Without the site suffix: "Why SWIMS", not "Why SWIMS | SWIMS". */
  title: string;
  description: string;
  /** Root-relative, no origin: "/why-us". Resolved against `metadataBase`. */
  path: string;
  /**
   * `website` for pages, `article` for posts, `profile` for a person. It
   * decides which extra tags a scraper looks for, and LinkedIn in particular
   * renders an article differently from a page.
   */
  type?: "website" | "article" | "profile";
  /**
   * Only meaningful with `type: "article"`. These are what turn a card from a
   * link with a picture into something that says who wrote it and when -- the
   * difference between a shared post looking like a page and looking like
   * journalism.
   */
  article?: {
    /** ISO 8601. Omitted rather than guessed when a post has no publish date. */
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    /** The category, as a human label rather than its id. */
    section?: string;
  };
  /**
   * Set on the routes that ship their own `opengraph-image.tsx` -- the blog
   * post and the person profile. Their card is drawn from the post or the
   * member, and naming the site-wide one here would override the file
   * convention with a generic picture.
   */
  hasOwnCard?: boolean;
};

/** The card at `app/opengraph-image.tsx`, addressed the way a scraper must. */
const SITE_CARD = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "SWIMS — smart waste management for Africa",
} as const;

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
  article,
  hasOwnCard = false,
}: PageMetadataInput): Metadata {
  const images = hasOwnCard ? {} : { images: [SITE_CARD] };

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      ...images,
      ...(type === "article" && article ? article : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...images,
    },
  };
}
