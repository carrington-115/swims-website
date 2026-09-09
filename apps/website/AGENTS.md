<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# SWIMS website

Marketing site: Next.js 16 App Router, React 19, Tailwind CSS v4, TypeScript strict.

## Read before writing UI code

- [docs/COMPONENTS.md](./docs/COMPONENTS.md) — the component standard: folder
  ladder, naming, props, styling with tokens, server/client split, definition of
  done. Follow it; do not improvise a second pattern.
- [docs/IMAGES.md](./docs/IMAGES.md) — every image the site ships, the registry
  that exposes them, alt text, overlays and the size budget.
- [docs/FIGMA.md](./docs/FIGMA.md) — Figma MCP setup and how a frame becomes
  components.
- [docs/SEO.md](./docs/SEO.md) — page metadata, the share-preview cards,
  sitemap and robots, structured data. Every page's metadata comes from
  `pageMetadata()` in `lib/seo.ts`; never hand-write a bare title and
  description.

## Layout

```
app/          routes only (page.tsx, layout.tsx); globals.css holds the tokens
components/   ui/ layout/ sections/ media/   (see docs/COMPONENTS.md)
lib/          cn() and other framework-free helpers
assets/       images + images.ts registry    (see docs/IMAGES.md)
              fonts/ holds the .ttf files the OG cards rasterise with
docs/         the four docs above
```

## Non-negotiables

- Images: `import { images } from "@/assets/images"` and render them with
  `<SiteImage>`. Never a raw path, never an inline `alt`.
- Colours, radii, shadows and gutters come from `@theme` in `app/globals.css`.
  No raw hex, no arbitrary `bg-[#...]`. The one exception is `app/_og/`, which
  is rasterised by satori rather than a browser and resolves no CSS variables
  — see [docs/SEO.md](./docs/SEO.md).
- Server components by default; `"use client"` only on the leaf that needs it.
- Merge an incoming `className` through `cn` from `@/lib/cn`.
- Named exports, kebab-case filenames, `@/` imports, no barrel files.
- Nav links live in `lib/navigation.ts`. Edit that file, not the header, the
  collapse menu or the footer.

## Commands

```sh
pnpm --filter website dev
pnpm --filter website build
pnpm --filter website lint
```
