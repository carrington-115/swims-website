# Component standard

How every React component in `apps/website` is built. This is the contract —
code that does not follow it should be changed, not worked around.

Stack: Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4,
`class-variance-authority` for variants, `clsx` + `tailwind-merge` via
`@/lib/cn`.

## 1. Where things live

```
apps/website/
  app/                  routes only: page.tsx, layout.tsx, error.tsx, route.ts
    globals.css         design tokens (@theme) -- the styling source of truth
    <route>/_sections/  sections used by exactly one route
  components/
    ui/                 reusable primitives: Button, Card, Badge, Input
    layout/             Container, Section, SiteHeader, SiteFooter, Nav
    sections/           page bands reused across routes: Hero, Newsletter
    media/              SiteImage and anything else that renders visual assets
  lib/                  framework-free helpers (cn, formatters, api clients)
  assets/               images + the image registry (see IMAGES.md)
  docs/                 this file, IMAGES.md, FIGMA.md
```

The ladder is one-directional: `app/` → `sections/` → `layout/` + `ui/` +
`media/` → `lib/`. A `ui` component never imports a section; a section never
imports a route.

Promotion rule: build a component inside `app/<route>/_sections/` first. The
moment a second route needs it, move it to `components/sections/`. The moment
two sections need the same piece, move that piece to `components/ui/`.

## 2. Naming and file layout

- Files are **kebab-case**: `site-image.tsx`, `newsletter-signup.tsx`.
- Exports are **PascalCase named exports**. No default exports outside `app/`
  (Next.js requires them for pages and layouts).
- One component per file. A small private subcomponent may share the file if it
  is not exported.
- No barrel `index.ts` files — import the file directly. Barrels defeat
  tree-shaking and blur the server/client boundary.
- Imports use the `@/` alias (`@/components/ui/button`), never `../../..`.

File order, top to bottom: imports → types → variants (`cva`) → component →
private helpers.

## 3. Props

```tsx
type CardProps = ComponentPropsWithoutRef<"article"> & {
  title: string;
  eyebrow?: string;
};

export function Card({ title, eyebrow, className, ...props }: CardProps) {
  return <article className={cn("rounded-card bg-surface p-6", className)} {...props} />;
}
```

- Type props with a local `type`, not an `interface`, and extend
  `ComponentPropsWithoutRef<"tag">` so callers keep `id`, `aria-*` and events.
- Always accept `className` and merge it through `cn` — last class wins.
- Always spread `...props` onto the root element.
- Prefer explicit string-union props (`tone="muted"`) over booleans that
  multiply (`isMuted`, `isDark`).
- No `React.FC`. Destructure props in the signature with defaults.
- Content comes in as props. A component never reaches for global state or
  fetches its own data — see [§4.1](#41-sections-backed-by-the-blogs-api) for
  the one shape that fetches, and note that even there the component doing the
  drawing still only takes props.

## 4. Server and client

Components are **server components by default**. Add `"use client"` only when
the file itself needs state, effects, refs or browser events — carousels,
menus, forms.

- Push `"use client"` to the smallest leaf. A client carousel receives its
  slides as already-rendered `children` from a server section.
- Never mark `layout.tsx` or `page.tsx` as a client component.
- Data fetching happens in the route (`page.tsx`) and flows down as props —
  except for the Blogs API, below.

### 4.1 Sections backed by the Blogs API

Blog content is the only live data the site reads, and it is read with
[TanStack Query](https://tanstack.com/query) so a listing can be cached,
refetched and shown loading. That needs a hook, and a hook needs a client
component — which would otherwise collide with every rule above.

It is split three ways instead, and every data-backed section follows the same
shape:

| Piece | Kind | Job |
| --- | --- | --- |
| `<thing>.tsx` | server | Draws it. Takes `posts`, `isLoading`, `error` as props. Fetches nothing, exactly as §3 requires. |
| `<thing>-feed.tsx` | `"use client"` | One `useQuery`, maps the result onto view models, renders the presentational half. Holds no markup of its own. |
| `<thing>-band.tsx` | server | `prefetchQuery` + `HydrationBoundary` around the feed, so the section is server-rendered and the browser does not refetch it. |

Worked example: `components/sections/latest-blogs.tsx` (draws),
`latest-blogs-feed.tsx` (fetches), `latest-blogs-band.tsx` (prefetches). A route
renders `<LatestBlogsBand />` and knows nothing about any of it.

The rest of the rules:

- **Queries are declared once**, in `lib/blog-queries.ts`, and both halves use
  the same `queryOptions`. A prefetch under a different key than the one the
  hook subscribes to is invisible — it just quietly refetches.
- **Never export a query from a `"use client"` file.** Next turns every export
  of one into a client reference, so a server component importing it gets a
  proxy rather than the object.
- **Prefetch with `await`.** Unawaited, the state is dehydrated while the query
  is still pending and the section ships empty.
- **A route that renders a prefetching section needs `export const revalidate`**,
  or the fetch is baked into the static build and the section shows whatever was
  published at deploy time.
- **Skeletons come from `components/ui/blog-card-skeleton.tsx`** and match the
  height of what they stand in for. A placeholder of the wrong height moves the
  page under the reader at the moment they start looking at it.
- **Drive the skeleton from `isPending`, not `isFetching`**, so a background
  refresh does not throw placeholders over content that is already correct.

## 5. Styling

- **Tokens only.** Every colour, radius, shadow and gutter comes from `@theme`
  in `app/globals.css` (`bg-primary`, `text-ink-muted`, `rounded-card`,
  `shadow-card`, `px-gutter`). A raw hex value or an arbitrary
  `bg-[#1E952E]` in a component is a bug — add the token instead.
- **Variants with `cva`**, exported next to the component so other components
  can reuse the class string. See `components/ui/button.tsx`.
- **Mobile first.** Write the phone styles unprefixed and layer the
  breakpoints on top. Declared in `@theme`, so they are the same numbers in
  Figma and in code:

  | Prefix | Min width | Used for |
  | --- | --- | --- |
  | (none) | 0 | phone -- the base layer |
  | `sm:` | 640px | large phone |
  | `md:` | 768px | tablet |
  | `lg:` | 1024px | desktop; the collapse menu gains its feature image here |
  | `xl:` | 1280px | wide desktop |
  | `2xl:` | 1440px | the Figma desktop frame width |
- Layout comes from `Container` (max width + gutter) and `Section` (vertical
  rhythm + background tone). Do not hand-roll page padding.
- No CSS modules, no styled-components, no inline `style` except for dynamic
  values that cannot be expressed as a class (e.g. a CSS variable).

## 6. Images

Through the registry and `SiteImage` only — see [IMAGES.md](./IMAGES.md).

## 7. Accessibility

- One `<h1>` per page; heading levels never skip.
- Semantic elements: `<nav>`, `<main>`, `<section>` with `aria-labelledby`,
  `<button>` for actions and `<Link>` for navigation.
- Every interactive element is keyboard reachable and keeps a visible focus
  ring (`focus-visible:outline-primary`); never `outline-none` without a
  replacement.
- Body text meets 4.5:1 contrast. Text over photography carries its contrast
  from the overlay -- `.hero-scrim` or a `bg-overlay-*` plate -- not from a
  text shadow.
- Animation respects `prefers-reduced-motion` — the global rule in
  `globals.css` handles CSS transitions; JS-driven motion must check it.

## 8. Definition of done

Before a component is considered finished:

- [ ] Renders correctly at 375px, 768px, 1280px and 1920px.
- [ ] `pnpm --filter website lint` and `pnpm typecheck` pass; no `any`, no
      `@ts-expect-error` without a reason comment.
- [ ] Keyboard-navigable with visible focus.
- [ ] Images come from the registry with real alt text.
- [ ] No raw colour values; all spacing on the token scale.
- [ ] `"use client"` present only if genuinely needed.

## Reference implementations

| File | Shows |
| --- | --- |
| `components/ui/button.tsx` | `cva` variants, polymorphic button/link, `cn` merge |
| `components/layout/container.tsx` | polymorphic `as` prop, layout tokens |
| `components/layout/section.tsx` | string-union variants without `cva` |
| `components/media/site-image.tsx` | registry-driven images, focal crops |
| `components/sections/latest-blogs-band.tsx` | §4.1: prefetch + hydrate around a client feed |
| `components/sections/latest-blogs.tsx` | §4.1: the presentational half, props only |
| `components/layout/site-header.tsx` | server shell delegating all state to one client leaf |
| `components/layout/site-menu.tsx` | dialog semantics, focus trap, scroll lock, enter/exit animation |

## Colour tokens

| Token | Utility | Value |
| --- | --- | --- |
| `--color-primary` | `bg-primary`, `text-primary` | `#1E952E` (scale `primary-50`..`primary-900`) |
| `--color-secondary` | `bg-secondary` | `#38A176` (scale `secondary-50`..`secondary-900`) |
| `--color-tertiary` | `bg-tertiary` | `#333333` (scale `tertiary-50`..`tertiary-900`) |
| `--color-ink` | `text-ink` | body copy, `#333333` |
| `--color-ink-strong` | `text-ink-strong` | headings |
| `--color-ink-muted` | `text-ink-muted` | captions, descriptions |
| `--color-on-surface` | `text-on-surface` | Figma "on surface", `#1A1C18` -- header and menu ink |
| `--color-surface` | `bg-surface` | page background |
| `--color-surface-muted` | `bg-surface-muted` | alternating bands, hover fills |
| `--color-line` | `border-line` | hairlines and dividers |

Layout tokens, all taken from the Figma frames (390 mobile, 1440 desktop):

| Token | Utility | Value |
| --- | --- | --- |
| `--spacing-gutter` / `-lg` | `px-gutter` / `lg:px-gutter-lg` | 16px / 60px page padding |
| `--container-content` | `max-w-content` | 1440px shell -- with the gutters this gives Figma's 358 / 1320 content width |
| `--spacing-header` / `-lg` | `h-header` / `lg:h-header-lg` | 72px / 78px header -- desktop is half the 155px the frame draws |
| `--spacing-logo` / `-lg` | `h-logo` / `lg:h-logo-lg` | 38px / 44px wordmark |
| `--spacing-menu-icon` / `-lg` | `size-menu-icon` / `lg:size-menu-icon-lg` | 48px / 40px menu + close glyph |

The header is sticky. Its three sizes move together: shrinking `--spacing-header`
without the other two leaves the wordmark taller than the bar.

Type tokens: `--font-display` (Poppins, the Figma display face) and
`text-menu` / `lg:text-menu-lg` (36px / 57px collapse-menu links).

Motion: the collapse-menu choreography is a `.menu-panel` block in the
`@layer components` section of `globals.css`, driven by the `data-state`
attribute the menu writes. Keyframes live in `@theme` next to it.
