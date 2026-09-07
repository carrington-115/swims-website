# components/sections

One file per band of a page: `hero.tsx`, `impact-stats.tsx`, `newsletter-signup.tsx`.

Rules:

- A section owns its layout and copy, and renders `<Section>` (components/layout)
  as its root plus `<Container>` for horizontal alignment.
- A section reads no data of its own. The route (`app/**/page.tsx`) fetches and
  passes it down as props, so sections stay renderable in isolation.
- Anything reused by two or more sections moves down into `components/ui`.
- Page-specific sections that will never be reused may live next to the route
  instead (`app/why-us/_sections/`); move them here once a second page needs them.

## What is here

| File | Band |
| --- | --- |
| `partners-strip.tsx` | "Backed by" -- heading, logo row, partner CTAs. Every page that needs social proof renders this; the marks and buttons are props. |
| `page-hero.tsx` | The standing hero of an interior page: photograph, headline and one action. Two shapes -- wide and bottom-anchored, or, when a `body` standfirst is passed, a narrower column centred in the frame (Why Us and Partners respectively). |
| `backed-by.tsx` | Partner and investor wall -- heading, `LogoWall`, partner CTAs. Heading, standfirst (`null` to drop it), marks and buttons are all props, so Why Us and Partners share it. |
| `product-highlights.tsx` | "Our top products and initiatives". Defaults to the three SWIMS ships (`defaultProducts`, including the DTRACKER wordmark panel), so a page that wants them renders it bare. |
| `feature-band.tsx` | One piece of media beside a heading, a paragraph and an optional CTA. `tone` picks the background and the ink and button that go with it. The home page uses three tones with buttons; the DTRACKER page uses two without. |
| `hero/` | `hero-banner.tsx` renders one hero panel on its own, for a page with no carousel. `hero-backdrop.tsx` and `hero-copy.tsx` are the panel's two halves, shared with the home carousel in `app/_sections/hero/`. `hero-slide-content.ts` holds the panel type and the DTRACKER panel, which both routes render. |
| `latest-blogs.tsx` | Post cards plus a link to the archive. |
| `newsletter-signup.tsx` | Subscribe copy, the form and its photograph. |

See ../../docs/COMPONENTS.md.
