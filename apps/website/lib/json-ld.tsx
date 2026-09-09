import type { BlogResponse } from "@swims/schemas";
import { blogCategoryLabel } from "@swims/schemas";

import { images } from "@/assets/images";
import { socialLinks } from "@/lib/navigation";
import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/site";
import type { TeamMember } from "@/lib/team";

/**
 * Structured data: the same facts the page states in prose, restated in the
 * vocabulary a search engine parses.
 *
 * Meta tags decide what a *shared* link looks like; this decides what a *found*
 * link looks like -- the byline and date under a result, the company panel, the
 * breadcrumb trail instead of a bare URL. Nothing here may claim anything the
 * page does not show: markup that disagrees with the visible page is what gets
 * a site's rich results turned off.
 *
 * Entities are given stable `@id`s so a post can point at its publisher rather
 * than describing SWIMS again on every page.
 */

type JsonLdNode = Record<string, unknown>;

const ORGANISATION_ID = absoluteUrl("/#organization");
const WEBSITE_ID = absoluteUrl("/#website");

/**
 * `</script>` inside a JSON string would close this tag early and hand the rest
 * of the payload to the HTML parser. Escaping the angle bracket keeps the JSON
 * identical to a parser and inert to the browser.
 */
function serialise(data: JsonLdNode): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: JsonLdNode }) {
  return (
    <script
      type="application/ld+json"
      // The content is built here from typed data, never from user input.
      dangerouslySetInnerHTML={{ __html: serialise(data) }}
    />
  );
}

/** SWIMS itself. Referenced by `@id` from every other node. */
export function organisationJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANISATION_ID,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    logo: absoluteUrl(images.brand.logo.src.src),
    // The accounts already listed in the footer, which is what makes them
    // verifiable rather than asserted.
    sameAs: socialLinks.map((link) => link.href),
  };
}

/**
 * The site as a searchable thing. `SearchAction` is what lets a result offer a
 * search box of its own; it points at the blog's existing `?q=` filter.
 */
export function webSiteJsonLd(): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    publisher: { "@id": ORGANISATION_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/blog?q={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function blogPostingJsonLd(post: BlogResponse): JsonLdNode {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    ...(post.description ? { description: post.description } : {}),
    ...(post.coverImage ? { image: [post.coverImage] } : {}),
    // Absent on a draft, and a draft is not reachable here -- but an invented
    // date is worse than none, and Google treats a wrong one as a reason to
    // distrust the rest.
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      ...(post.author.avatarUrl ? { image: post.author.avatarUrl } : {}),
    },
    publisher: { "@id": ORGANISATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    ...(post.category
      ? { articleSection: blogCategoryLabel(post.category) }
      : {}),
    // ISO 8601 duration: 6 minutes is PT6M.
    ...(post.timeToRead ? { timeRequired: `PT${post.timeToRead}M` } : {}),
  };
}

export function personJsonLd(member: TeamMember): JsonLdNode {
  const url = absoluteUrl(`/people/${member.id}`);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    url,
    name: member.name,
    jobTitle: member.role,
    ...(member.bio[0] ? { description: member.bio[0] } : {}),
    image: absoluteUrl(member.portrait.src.src),
    worksFor: { "@id": ORGANISATION_ID },
    // Empty today for three of the four; an empty `sameAs` says less than no
    // `sameAs`, so it is omitted rather than sent as [].
    ...(member.socials.length
      ? { sameAs: member.socials.map((link) => link.href) }
      : {}),
  };
}

/**
 * The trail shown in place of a raw URL under a result. Pass it the path from
 * the home page down, ending at the current page.
 */
export function breadcrumbJsonLd(
  trail: readonly { name: string; path: string }[],
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}
