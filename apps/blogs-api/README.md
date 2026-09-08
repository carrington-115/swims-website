# SWIMS Blogs API

Express + TypeScript + Supabase backend for SWIMS blog content.

One authenticated `POST /api/blogs` creates a whole post: the blog, its
sections, and the credit to whoever wrote it. The table of contents is derived
from the sections on read, so it can never disagree with them.

## Quick Start

### Prerequisites

- Node.js >= 20
- pnpm 10.27.0
- A Supabase project

### Install

```bash
pnpm install
```

### Environment

```bash
cp .env.example .env
```

| Variable | Purpose |
| --- | --- |
| `SUPABASE_URL` | Project URL. |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…`. Safe to expose, bound by RLS. Used only to verify caller JWTs. |
| `SUPABASE_SECRET_KEY` | `sb_secret_…`. Bypasses RLS. Server-only — never commit it, never put it in a `NEXT_PUBLIC_` variable. |
| `PORT` | Defaults to `3002`. |
| `CORS_ORIGINS` | Comma-separated allowlist. Defaults to `http://localhost:3000,http://localhost:3001` — the website and the dashboard are separate origins, so this is a list, not one value. |

Both are in the Supabase dashboard under **Project Settings → API keys**.

**On the legacy keys.** Supabase's earlier JWT keys, `anon` and `service_role`,
are still accepted under their own names — `SUPABASE_ANON_KEY` and
`SUPABASE_SERVICE_ROLE_KEY` — so an older project keeps working. The roles are
identical: publishable replaces anon, secret replaces service_role. If both
spellings are set, the current names win. A project created today only issues
the new pair.

Putting the publishable key in the secret slot is refused at startup rather than
warned about: the API writes with that key on the assumption that it bypasses
row level security, so the wrong one there would connect, authenticate, and then
silently return nothing from every query.

Only the three Supabase values are required, and they are read on first use
inside a request rather than at startup, so a missing one is a logged 500 rather
than an unexplained crash on a serverless cold start.

### Database

**New database:** run `supabase/schema.sql` in the Supabase SQL editor, or
apply it from here:

```bash
pnpm --filter swims-blogs-api db:apply                    # schema.sql
pnpm --filter swims-blogs-api db:apply migrations/0002_authors_and_derived_toc.sql
```

`db:apply` needs a Supabase personal access token in `.env` as
`SUPABASE_ACCESS_TOKEN`, because the project API keys cannot issue DDL —
`sb_secret_…` is a PostgREST key and only reaches the REST layer. Create one at
<https://supabase.com/dashboard/account/tokens>. It is account-wide rather than
project-scoped, so it is worth revoking once the schema is in place; nothing
else in this app reads it.

**Database created before authors existed:** run
`supabase/migrations/0002_authors_and_derived_toc.sql` first, then `schema.sql`
to install the functions and policies. The migration backfills the `authors`
table from the free-text bylines already on your blogs, marks existing blogs
published, and drops `table_of_contents`. Both files are re-runnable.

**Database created before the blocks → blogs rename:** run
`supabase/migrations/0001_rename_blocks_to_blogs.sql` before either of the
above.

### Check the connection

```bash
pnpm --filter swims-blogs-api check:db
```

Reports, in the order the failures cascade: whether the environment is filled
in, whether the two keys are the right way round, whether the project answers,
whether the schema has been applied (all three tables, the new `blogs` columns,
both functions, and the old `table_of_contents` gone), and whether the
publishable key can verify a JWT — which is the whole of this API's
authentication. It never prints a key.

Run it before `requests.http`, and whenever a request fails in a way that smells
like configuration.

To see the schema the project actually has, rather than the one `schema.sql`
describes:

```bash
pnpm --filter swims-blogs-api schema
```

It reads PostgREST's OpenAPI document, so it reports what this API can see —
which is also what goes stale when the schema cache needs reloading. An empty
listing here next to populated tables in the SQL editor localises that exactly.

### A note on Node 20

`@supabase/supabase-js` builds a Realtime client whether or not you use one, and
that constructor throws on a runtime with no global `WebSocket` — which Node
gained in 22. This API subscribes to nothing, so `config/supabase.ts` hands
Realtime a placeholder transport and it is never constructed. That keeps Node 20
working; Node 22+ is still what `engines` asks for, and supabase-js now warns
that it will drop Node 20 in a future release.

### Run

```bash
pnpm run dev        # tsx watch, http://localhost:3002
pnpm run typecheck
pnpm run lint
pnpm run build && pnpm start
```

## The model

```
authors ──< blogs ──< sections
              │
              └── table of contents  (derived on read, not stored)
```

- **`authors`** — one row per Supabase user, upserted from the access token on
  every authenticated write. `blogs.user_id` is a foreign key onto it.
- **`blogs`** — a post's metadata: title, slug, category, cover image, reading
  time, and a `draft` / `published` status.
- **`sections`** — the body, in order. Each has a title, optional prose, and
  optional images.
- **table of contents** — one entry per section, built on the way out. There is
  no table and no route that writes one.

### Authorship is not something a client can set

`author` and `profileImage` used to be strings in the request body, which meant
any valid token could publish under any byline. They are gone. The API reads the
Supabase user off the token, upserts an `authors` row (name from
`user_metadata.full_name`, then `name`, then the email's local part; avatar from
`avatar_url` or `picture`), and embeds that row in every blog it returns.

Sending `author` in a create or update request is a **400**, not a silent
ignore.

### The table of contents cannot go stale

It used to be a stored row rebuilt only when something POSTed to
`/table-of-contents`. Rename a section and the stored contents kept the old
heading; delete one and an entry was left pointing at nothing.

Now the contents are a projection of the sections, computed per request:

```json
[
  {
    "sectionId": "uuid",
    "title": "Where the waste actually goes",
    "anchor": "where-the-waste-actually-goes",
    "level": 1
  }
]
```

`anchor` is the URL fragment the page links to, unique within a post — two
sections with the same heading get `-2`, `-3` suffixes.

## API

Every response uses the same envelope, successes and errors alike:

```json
{ "success": true, "data": {}, "error": null, "timestamp": "2024-01-15T10:00:00Z" }
```

### Public

A bearer token is optional on these. Send one and you also see your own drafts;
without one you see published blogs only.

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/health` | Liveness. Does not touch Supabase. |
| `GET` | `/api/blogs` | Published only. `?limit` `?offset` `?category` `?q`. |
| `GET` | `/api/blogs/:id` | Blog + sections + contents. |
| `GET` | `/api/blogs/slug/:slug` | Same, by slug. |
| `GET` | `/api/blogs/:id/sections` | Sections in order. |
| `GET` | `/api/blogs/:id/table-of-contents` | The derived contents. |

`GET /api/blogs` takes no `status`. It is unauthenticated, and a `?status=draft`
on it would hand every unfinished post to anyone who asked; drafts are reachable
through `/api/blogs/mine`.

### Authenticated

`Authorization: Bearer <supabase_jwt>`. Writes are rate-limited to 100 requests
per 15 minutes.

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/api/blogs/mine` | The caller's own blogs. Adds `?status=draft\|published`. |
| `POST` | `/api/blogs` | Creates the blog and its sections in one transaction. |
| `PUT` | `/api/blogs/:id` | Partial update. Publishing stamps `publishedAt`. |
| `DELETE` | `/api/blogs/:id` | Sections cascade. |
| `POST` | `/api/blogs/:id/sections` | Appends one section. |
| `PUT` | `/api/blogs/:id/sections/:sectionId` | Partial update. |
| `DELETE` | `/api/blogs/:id/sections/:sectionId` | |
| `PUT` | `/api/blogs/:id/sections/order` | Reorders from the full id list. |

#### Create a blog

```http
POST /api/blogs
Authorization: Bearer <token>

{
  "title": "Lessons from Bangalore's MWM ecosystem",
  "timeToRead": 8,
  "description": "What three-way separation taught us about collection routes.",
  "category": "waste-management-in-africa",
  "coverImage": "https://example.com/cover.jpg",
  "status": "draft",
  "sections": [
    { "title": "Where the waste goes", "content": "..." },
    {
      "title": "What collectors are paid for",
      "content": "...",
      "images": [{ "url": "https://…", "alt": "…", "caption": "…" }]
    }
  ]
}
```

`sections` is optional; `slug` is derived from the title when omitted, with a
numeric suffix if it is taken. `status` defaults to `draft`. `name` defaults to
the title.

**201** returns the blog with its `author` object, its `sections` in order, and
its `tableOfContents` — there is nothing to fetch afterwards.

Sections arrive in the order they are listed; any `orderIndex` on a nested
section is ignored, because position in the array already says it. The insert
runs inside a Postgres function, so a failure leaves no half-written blog
behind. The Supabase JS client cannot open a transaction, which is why the
function exists.

#### Reorder sections

```http
PUT /api/blogs/:id/sections/order
{ "sectionIds": ["uuid-c", "uuid-a", "uuid-b"] }
```

The complete list, not one section at a time: `order_index` is unique per blog,
so moving one section past another collides with the row it is trading places
with. The whole order is rewritten in one statement against a deferred
constraint. A list that is not exactly the blog's sections is a 400 — a partial
one would leave holes.

Returns the reordered sections and the contents that follow from them.

### Status codes

| Code | Meaning |
| --- | --- |
| `200` / `201` | Success. |
| `400` | Validation error, including an unknown field. |
| `401` | Missing, malformed or expired token. |
| `403` | Authenticated, but not the owner. |
| `404` | Not found — or a draft that is not yours. |
| `409` | Slug already taken. |
| `500` | Server error (logged in full, never echoed). |

## Validating a deployment

`requests.http` walks the whole surface top to bottom — create with sections,
the byline coming from the token, the contents following a renamed section,
reorder, the draft/published boundary, and the 401/403/400/409 paths. Open it in
the VS Code REST Client or JetBrains HTTP client, or read it as a list of curl
calls. Each request says what it is proving.

## Architecture

```
src/
  app.ts             express wiring, CORS allowlist, health, error handler
  env.ts             config, split by failure mode (see the file's own note)
  config/supabase.ts lazily memoised admin + anon clients
  routes/            endpoint definitions, validation middleware
  controllers/       request handling, ownership, response assembly
  models/            data access and snake_case <-> camelCase mapping
  middleware/        requireAuth, attachUser, errorHandler
  utils/             validators, slug, buildToc
  types/             re-exports of @swims/schemas + Postgres row types
supabase/
  schema.sql         the whole schema, re-runnable
  migrations/        forward migrations for existing databases
```

Request and response shapes come from **`@swims/schemas`**, which the website
and the dashboard type themselves from too, so a change to the model surfaces as
a type error rather than a runtime surprise. **`@swims/api-client`** is the
typed client for this API.

Row Level Security policies mirror the ownership rules for anything talking to
Supabase directly with the anon key. The API itself holds the service-role key
and bypasses them, so it enforces the same rules in `requireOwnedBlog`.
