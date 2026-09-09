import { ImageResponse } from "next/og";
import { blogCategoryLabel } from "@swims/schemas";

import { blogsApi } from "@/lib/blogs-api";

import {
  BRAND,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgBrandRow,
  fetchImageAsDataUri,
  ogFonts,
} from "../../_og/card";

/**
 * The card for one post.
 *
 * This is the link that actually gets shared, so it carries what a reader
 * decides on: the category, the headline, who wrote it and how long it takes.
 *
 * Rendered per request rather than at build, because posts are published from
 * the dashboard at any time and the set of slugs is not known when the site is
 * built -- the same reason `page.tsx` has no `generateStaticParams`.
 *
 * `alt` has to be a static export, so it describes the card rather than the
 * post. The post's own title is in `og:title` beside it.
 */
export const alt = "A post on the SWIMS blog";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Long enough for a real headline, short enough that it cannot overrun. */
function clamp(value: string, max: number): string {
  return value.length <= max ? value : `${value.slice(0, max - 1).trimEnd()}…`;
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  /*
   * Every failure here -- an unreachable API, a deleted post, a cover that will
   * not load -- degrades to a plainer card rather than an error. A 500 on this
   * URL is not "no picture this time", it is a scraper deciding the page has no
   * image at all, and that verdict gets cached by the platform that asked.
   */
  const post = await blogsApi.blogs.getBySlug(slug).catch(() => null);
  const cover = post?.coverImage
    ? await fetchImageAsDataUri(post.coverImage)
    : null;

  const title = post ? clamp(post.title, 95) : "The SWIMS blog";
  const category = post?.category ? blogCategoryLabel(post.category) : null;

  const byline = [
    post?.author.name,
    post?.timeToRead ? `${post.timeToRead} min read` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BRAND.primary900,
        }}
      >
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element -- satori has no next/image
          <img
            src={cover}
            alt=""
            width={OG_SIZE.width}
            height={OG_SIZE.height}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : null}

        {/*
         * The scrim. Text over an unknown photograph is unreadable half the
         * time, and these covers are uploaded by whoever writes the post -- so
         * the card darkens the left side it writes on rather than hoping.
         */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage: cover
              ? "linear-gradient(90deg, rgba(11,51,17,0.95) 0%, rgba(11,51,17,0.86) 52%, rgba(11,51,17,0.55) 100%)"
              : `linear-gradient(135deg, ${BRAND.primary900} 0%, #14611f 100%)`,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 72,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {category ? (
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  padding: "10px 22px",
                  borderRadius: 999,
                  backgroundColor: BRAND.primary500,
                  fontFamily: "Poppins",
                  fontWeight: 600,
                  fontSize: 24,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: BRAND.surface,
                }}
              >
                {category}
              </div>
            ) : null}

            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: title.length > 60 ? 58 : 68,
                lineHeight: 1.14,
                letterSpacing: "-0.02em",
                color: BRAND.surface,
                maxWidth: 860,
              }}
            >
              {title}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: 28,
                color: BRAND.tertiary200,
              }}
            >
              {byline}
            </div>
            <OgBrandRow tone="light" />
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [...ogFonts] },
  );
}
