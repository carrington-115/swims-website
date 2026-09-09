# SEO and share previews

What a link to this site looks like when it is shared, and what a crawler makes
of it. Read this before touching page metadata.

## The one rule

**Every page's metadata comes from `pageMetadata()` in `lib/seo.ts`.** Never
hand-write a `metadata` object with a title and a description and stop there:
that is what shipped grey, pictureless links in the first place.

```tsx
export const metadata = pageMetadata({
  title: "Why SWIMS",          // no "| SWIMS" -- the layout template adds it
  description: "…",
  path: "/why-us",             // root-relative; metadataBase makes it absolute
});
```

For a route with dynamic content, call it from `generateMetadata` and pass what
the record already knows — see `app/blog/[slug]/page.tsx`.

## Why `pageMetadata` owns the image

`app/opengraph-image.tsx` is inherited by a route **only if that route says
nothing about `openGraph` at all**. Every page has to declare `openGraph` (for
`og:url` and `og:type`), and declaring it replaces the parent's — image
included. `/why-us` shipped a card with a title, a description and no picture
until `pageMetadata` started naming the site card itself.

So: `pageMetadata` attaches the site card by default, and the two routes that
draw their own pass `hasOwnCard: true`.

## The cards

| File | Covers | When it renders |
| --- | --- | --- |
| `app/opengraph-image.tsx` | every page without its own | build |
| `app/blog/[slug]/opengraph-image.tsx` | one post: cover, category, title, byline | request |
| `app/people/[slug]/opengraph-image.tsx` | one member: portrait, name, role | build |

Shared pieces are in `app/_og/card.tsx`. Two site rules are suspended in these
files, and only these files:

- **Raw hex, not tokens.** satori never loads `globals.css` and resolves no CSS
  variables. `BRAND` in `card.tsx` copies the `@theme` values; change a brand
  colour there and change it here.
- **Inline styles, not Tailwind.** No Tailwind pass runs over this JSX. satori
  supports a flexbox subset: any element with more than one child needs an
  explicit `display: flex`, and there is no grid.

Fonts come from `assets/fonts/Poppins-{Regular,SemiBold}.ttf`, read as bytes.
The `next/font/google` instance in `app/layout.tsx` cannot be reused — it yields
a class name for a browser, not a font file — and the files must be `.ttf`,
because satori cannot decompress woff2.

### Post covers can be undrawable

The dashboard accepts JPEG, PNG, WebP, AVIF, GIF and SVG. The rasteriser behind
`ImageResponse` reads PNG, JPEG and GIF. Handed a WebP, satori **throws**, the
image route answers 500, and the platform that asked caches "this post has no
image" — worse than a plain card.

`fetchImageAsDataUri` in `app/_og/card.tsx` therefore sniffs magic bytes and
returns `null` for anything else, and the card falls back to the brand
background. A post whose cover is WebP or AVIF still gets a card; it just does
not get its photograph on it. If that starts mattering, the fix is a converter
in that one function, not a change to the card.

## Crawlability

- `app/sitemap.ts` — static routes, the team slugs, and every published post,
  paged 100 at a time. If the Blogs API is unreachable it logs and returns the
  rest: a 500 sitemap reads as "no sitemap", a short one does not. Revalidates
  hourly.
- `app/robots.ts` — allows everything on production and **disallows everything
  everywhere else**, so previews do not compete with production in the index.
- `lib/site.ts` — the absolute origin, from `NEXT_PUBLIC_SITE_URL`, else
  Vercel's production domain, else the deployment, else localhost.

## Structured data

`lib/json-ld.tsx` builds it; pages render `<JsonLd data={…} />`. Organization
and WebSite on the home page, BlogPosting and a breadcrumb on a post, Person and
a breadcrumb on a profile.

The rule that matters: **never state something the page does not show.** Markup
that disagrees with the visible page is how a site loses rich results
altogether, which is why the post page renders none of it when the fetch failed.

## Checking your work

`next dev` is no use for this — its HTML is a shell and the content arrives as a
streamed payload, so tags and JSON-LD look missing when they are not. Build
first:

```sh
pnpm --filter website build
# static routes: read the prerendered HTML directly
grep -o '<meta property="og:[^>]*>' .next/server/app/why-us.html

# dynamic routes: serve the build
pnpm --filter website exec next start -p 3100
curl -s localhost:3100/blog/<slug> | grep -o '<meta property="og:[^>]*>'
```

Open `/opengraph-image`, `/blog/<slug>/opengraph-image` and
`/people/<slug>/opengraph-image` in a browser and look at them. Then, once
deployed, run the real thing through the Facebook Sharing Debugger, the LinkedIn
Post Inspector, the X Card Validator, and the Google Rich Results Test.
