# Images

Every image the website ships lives under `apps/website/assets/` and is reached
through the registry at `assets/images.ts`. Nothing renders `next/image`
directly except `components/media/site-image.tsx`.

```
apps/website/
  assets/
    images.ts                <- registry: src + alt + focal for every image
    figma-images/            <- UI art exported from Figma (mockups, logos, diagrams)
      logo.png
      phones-hero.png
      phones-mobile-hero.png
      menu/                  collectors-dumpsite.webp  (collapse-menu feature art)
      home/                  cmr-map.svg, iot-sensor.png, phone-1.png
      dtracker/              phone-24-7.png, phone-goals.png, phone-payment.png,
                             phone-schedule.png, phone-security.png
      why-us/                phone-2.png, dtracker-phones.webp,
                             phone-pickup.webp, phone-verification.webp
                             (hero.webp is the page hero)
      swims-platform/        drone.png, labelled-sensor.png, monitor.png
      product-images/        dtracker.png, swims-design-challenge.png
                             (data-intelligence.png is on disk but no longer
                             in the registry -- see below)
      team/                  ceo.png, cto.png, coo.png, cmo.png
      partners/              hero.webp (Partners page hero) +
                             9 partner + investor logos
    photography/             <- editorial photos (Pexels, CC0) -- see below
```

## Using an image

```tsx
import { images } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";

// Inline image -- width/height come from the static import.
<SiteImage image={images.home.phone} className="w-64" />

// Cover fill -- applies the focal crop recorded in the registry.
<div className="relative h-[300px] md:h-[560px]">
  <SiteImage image={images.photography.landfill} cover priority sizes="100vw" />
  <div className="absolute inset-0 bg-overlay-primary" />
</div>
```

Rules:

- **Never** hardcode a path (`/assets/...`) or write `alt` at the call site. Add
  the file to `assets/images.ts` with its alt text and use it from there.
- `priority` for above-the-fold images only (the first hero slide). Everything
  else lazy-loads by default; do not add `loading="lazy"` manually.
- Give `sizes` whenever `cover` is used inside a container narrower than the
  viewport, otherwise Next.js ships the 100vw candidate.
- Full-bleed art needs a `relative` parent with an explicit height, because
  `cover` renders as `fill`.

## Registry entry shape

```ts
{
  src: <static import>,
  alt: "[Subject] in [Location], representing [theme]",
  focal?: { base: "center 20%", md: "center center" },  // cover images only
}
```

`focal` is the crop point. `base` applies below 768px, `md` from 768px up;
`SiteImage` turns it into `object-position` via CSS variables, so a photo is
cropped the same way everywhere it appears.

## Alt text

Describe content, context and mood — crisis, hope, opportunity — and name the
place when it matters (Burundi, Nigeria, Cameroon). Pattern:

> [Subject] in [Location], representing [theme / why it matters]

Pass `alt=""` only for decoration that is already described by adjacent text.

## Editorial photography (pending download)

Four Pexels photos are specified but **not yet in the repo**. Download each at
1920px or larger, convert to WebP, save under `assets/photography/` with the
filename below, then move its entry from the commented block at the bottom of
`assets/images.ts` into the `photography` group.

| Registry key | Filename | Source (Pexels, CC0) | Used by |
| --- | --- | --- | --- |
| `photography.wasteCrisis` | `waste-crisis-burundi.webp` | https://www.pexels.com/photo/woman-standing-amid-piles-of-plastic-waste-in-burundi-38786320/ | Home hero, slide 1 |
| `photography.landfill` | `environmental-impact-burundi.webp` | https://www.pexels.com/photo/environmental-impact-waste-and-pollution-in-burundi-38786321/ | Home hero slide 3, **Why Us** page hero |
| `photography.rustyCans` | `garbage-dump-rusty-cans.webp` | https://www.pexels.com/photo/garbage-dump-full-of-rusty-cans-14688593/ | Home hero slide 4 |
| `photography.youthPath` | `youth-dirt-path-nigeria.webp` | https://www.pexels.com/photo/young-boy-walking-on-a-dirt-path-in-nigeria-29571172/ | Newsletter signup section |

Slide 2 of the home hero is the DTRACKER product shot, not a photo: use
`images.home.phonesHero` on desktop and `images.home.phonesHeroMobile` on
mobile.

### Home hero carousel

| # | Image | Story | Overlay |
| --- | --- | --- | --- |
| 1 | `photography.wasteCrisis` | Human impact — the invisible workers, the scale of the crisis | neutral, `bg-overlay-neutral` |
| 2 | `home.phonesHero` / `home.phonesHeroMobile` | The product: DTRACKER earnings, pickups, customer map | none; use `shadow-float` on the device |
| 3 | `photography.landfill` | Environmental crisis: methane, open dumping, climate cost | primary, `bg-overlay-primary` |
| 4 | `photography.rustyCans` | Waste as recoverable resource; the partnership opportunity | secondary, `bg-overlay-secondary` |

### Page heroes

| Page | Image | Heading | Subheading |
| --- | --- | --- | --- |
| Why Us | `whyUs.hero` | We believe informal waste systems are not a problem to replace, they're infrastructure to formalize. | -- (the frame carries no subheading) |
| Partner | `partners.hero` | Partner with us. Transform waste management | SWIMS connects collectors, institutions, and innovators to solve Africa's waste crisis together. If you're ready to move waste from invisible to coordinated — let's talk. |

Built pages render this through `components/sections/page-hero.tsx`, which owns
the geometry: `h-hero` (763px, the Figma frame), full bleed on phones and an
inset `rounded-card` from `lg`, under the shared `.hero-scrim`. Use it rather
than restating the numbers -- the row above only needs to name the image and the
words.

A row with a subheading passes it as `body`, which is also what picks the band's
second shape: a narrower copy column with a smaller headline, centred in the
frame from `lg` instead of sitting low. Without one the hero keeps the wide,
bottom-anchored shape Why Us uses. Both keep the copy low on phones, where the
scrim darkens from the bottom edge.

### Newsletter section

`photography.youthPath`, soft secondary-green tint (`bg-overlay-secondary`), `rounded-card`.
Desktop: 400–500px wide beside the form. Mobile: full width above the form, 250–300px tall.

- Heading: *Stay ahead of Africa's waste transformation*
- Body: *Get monthly insights on waste policy, DTRACKER updates, and stories from collectors building formal waste systems.*

## Overlays and text on images

Use the overlay tokens rather than ad-hoc rgba:

| Token | Utility | Value |
| --- | --- | --- |
| `--color-overlay-primary` | `bg-overlay-primary` | deep green `#0B3311` @ 45% |
| `--color-overlay-secondary` | `bg-overlay-secondary` | secondary `#38A176` @ 25% |
| `--color-overlay-neutral` | `bg-overlay-neutral` | black @ 35% |

Headline over a photo: 48–64px desktop, bold, white. Subheading 18–24px.
Add the `text-on-image` class for the text shadow — do not invent per-page
shadows.

## Budget

| Use | Format | Max width | Target weight |
| --- | --- | --- | --- |
| Hero, desktop | WebP | 1920px | 150–250 KB |
| Hero, mobile | WebP | 750px | 80–120 KB |
| Newsletter | WebP | 600px | 100–150 KB |
| Thumbnail / logo | WebP or PNG | 400px | 20–30 KB |

Next.js generates the responsive variants and serves modern formats, so a single
optimized WebP per image is enough — do not hand-author `srcset` or per-breakpoint
files. Check weights before committing:

```sh
find apps/website/assets -type f -size +250k
```

Breakpoints to test: 750px, 1024px, 1920px.

Turbopack cannot optimize AVIF source files -- it emits them untouched and warns
at build time. Ship WebP or PNG instead; `figma-images/partners/athena-vc-logo.avif`
is the one file still to convert.

## Licensing

Photography is from [Pexels](https://www.pexels.com) under CC0 — free for
commercial use, attribution not required. Figma exports and partner logos are
SWIMS-owned or used with permission; partner logos are trademarks of their
owners and may only be shown in partner listings.

## Retired artwork

`product-images/data-intelligence.png` is still in the repo but has no registry
entry: the "Data intelligence" product it illustrated was replaced by SWIMS
Platform, whose card uses the real dashboard shot at
`swims-platform/monitor.png` rather than that stock illustration. Delete the
file, or add an entry back, if the product returns.
