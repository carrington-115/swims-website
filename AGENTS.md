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

## Ports

Each app pins its own port. These are not defaults to drift from -- several
things reference them and cannot discover them at runtime.

| Port | App | Pinned in |
| --- | --- | --- |
| 3000 | `apps/website` | `next dev -p 3000` |
| 3001 | `apps/dashboard` | `next dev -p 3001` |
| 3002 | `apps/blogs-api` | `DEFAULT_PORT` in `src/env.ts` (`PORT` overrides, for hosts that assign one) |

What breaks if one moves: the API's `CORS_ORIGINS` allowlist (3000 and 3001),
the dashboard's `BLOGS_API_URL` (3002), and Supabase Auth's `site_url` and
redirect allow-list, which must name the dashboard exactly.

`next dev` without `-p` silently takes the next free port instead of failing,
which is how the website once landed on 3002 and collided with the API. With
the port pinned, a clash is a loud failure rather than a service quietly
answering on the wrong address.

`pnpm dev` runs `scripts/check-ports.mjs` first (as `predev`). Turbo tears down
its own children when a task fails, but not a dev server orphaned by an earlier
run or by a closed terminal -- otherwise that shows up as a bare `EADDRINUSE`
from whichever app lost the race.

The script stops orphans **belonging to this repo** and says so: one of this
repo's dev servers holding one of this repo's dev ports is stale by definition
when you are asking for a fresh set. Anything else on those ports is reported
and left alone, and the run stops. `SKIP_PORT_CLEANUP=1 pnpm dev` reports
without stopping anything.

## Commands

Run from the repo root; Turborepo fans out to every workspace.

```sh
pnpm dev                      # all apps, each on its own port
pnpm --filter website dev     # one app
pnpm build
pnpm lint
pnpm typecheck
pnpm check                    # typecheck + lint + build
```

Add a dependency to one app: `pnpm --filter website add <pkg>`.

## Deployment

Three Vercel projects, one per app, deployed by `.github/workflows/deploy.yml`:
one `pnpm check` across the workspace, then a build and upload per app. `main`
releases, a pull request previews.

The steps to connect a fresh Vercel account -- root directories, environment
variables, the CORS and domain wiring between the three, Supabase Auth -- are in
`docs/DEPLOYMENT.md`.

The API runs as a function there rather than a process: `src/app.ts` is the
Express wiring, `src/server.ts` binds a port for every other host, and
`api/index.ts` is Vercel's entry. Only one of the last two runs.

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
