# SWIMS monorepo

pnpm workspace + Turborepo. Node >= 20, pnpm 10.27.

```
apps/
  website/      Next.js 16 marketing site  -> apps/website/AGENTS.md
  dashboard/    Next.js 16 blogs dashboard -> apps/dashboard/AGENTS.md
  blogs-api/    Express + Supabase API     -> apps/blogs-api/README.md
packages/
  api-client/     typed client for blogs-api
  schemas/        shared zod schemas / types
  eslint-config/  @swims/eslint-config -> ./next, ./node
  tsconfig/       base.json, nextjs.json, node.json, library.json
```

## Commands

Run from the repo root; Turborepo fans out to every workspace.

```sh
pnpm dev                      # all apps
pnpm --filter website dev     # one app
pnpm build
pnpm lint
pnpm typecheck
pnpm check                    # typecheck + lint + build
```

Add a dependency to one app: `pnpm --filter website add <pkg>`.

## Conventions

- TypeScript strict everywhere; app tsconfigs extend `packages/tsconfig`.
- Shared code goes in `packages/`, never imported across `apps/` boundaries.
- Never edit `dist/`, `.next/` or `.turbo/`.

## Website: read before writing UI code

The marketing site has a written standard. Follow it rather than improvising:

| Doc | Covers |
| --- | --- |
| `apps/website/docs/COMPONENTS.md` | Component architecture, props, styling, server/client split, definition of done |
| `apps/website/docs/IMAGES.md` | Image catalogue, the registry, alt text, overlays, size budget |
| `apps/website/docs/FIGMA.md` | Figma MCP setup and how designs become components |

Image assets live in `apps/website/assets/` and are always used through the
registry at `apps/website/assets/images.ts` — see `apps/website/docs/IMAGES.md`.

Design tokens live in `apps/website/app/globals.css`. Components use tokens, not
raw colour or spacing values.

## MCP

`.mcp.json` configures the Figma Dev Mode MCP server
(`http://127.0.0.1:3845/mcp`). It needs the Figma desktop app running with
**Preferences → Enable local MCP server**. Setup and usage:
`apps/website/docs/FIGMA.md`.
