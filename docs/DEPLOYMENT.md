# Deployment

Three apps, three Vercel projects, one repository. GitHub Actions runs the
checks and the builds; Vercel receives finished output and serves it.

| App | Vercel Root Directory | What it becomes |
| --- | --- | --- |
| `apps/website` | `apps/website` | Next.js site — the marketing pages and the public blog |
| `apps/dashboard` | `apps/dashboard` | Next.js app — sign-in and blog authoring |
| `apps/blogs-api` | `apps/blogs-api` | One Node function; `api/index.ts` hands every request to Express |

The three depend on each other by URL, and the dependency is circular: the API's
CORS allowlist names the two frontends, and both frontends name the API. The
order below breaks that cycle by creating the projects first, when Vercel hands
out the `.vercel.app` domains, and filling in the variables second.

## What is already in the repository

- `.github/workflows/deploy.yml` — `pnpm check` across the whole workspace, then
  one deploy per app. `main` goes to production; a pull request gets a preview.
- `apps/*/vercel.json` — install and build commands per project, pinned so that
  Vercel builds through Turborepo and picks up `packages/*` rather than treating
  an app as if it stood alone.
- `apps/blogs-api/api/index.ts` — the serverless entry. On Vercel, Express is
  wiring rather than a server: `src/app.ts` builds the app, `src/server.ts`
  binds a port for every other host, and only one of the two ever runs.

Nothing in the repository holds a credential. Every environment variable is read
from the Vercel project at deploy time, so the only secret GitHub needs is a
token that says "deploy".

---

## 1. Create the three Vercel projects

For each app, in the Vercel dashboard: **Add New → Project**, import this
repository, and before deploying set

- **Root Directory** to the path in the table above. This is the one setting
  that cannot come from `vercel.json`, and everything else depends on it.
- **Framework Preset**: Next.js for the website and the dashboard, **Other** for
  `blogs-api`.
- Build and Install Command: leave **empty** — `vercel.json` supplies both.
- "Include files outside the root directory": leave **on** (the default). The
  apps import `packages/schemas` and `packages/api-client`; without it the build
  cannot see them.

Name them something recognisable in a deployment list — `swims-website`,
`swims-dashboard`, `swims-blogs-api`.

The import will try to deploy immediately and will probably fail, because no
environment variables exist yet. Ignore it; step 4 is the real first deploy.

### Automatic Git deployments are off

Each `vercel.json` sets `git.deploymentEnabled: false`, so Vercel does not build
on push. That is deliberate. The workflow already builds every app after one
shared `pnpm check`, and letting both run would mean two builds racing to
publish the same commit — only one of which was ever typechecked against the
other apps.

To go back to Vercel-driven deploys instead, remove that key from the three
`vercel.json` files and delete `.github/workflows/deploy.yml`.

## 2. Set the environment variables

Project → **Settings → Environment Variables**. Add each to **Production** and
**Preview** both, unless the table says otherwise.

The Supabase values are in the Supabase dashboard under **Project Settings → API
keys**. If production gets its own Supabase project, apply
`apps/blogs-api/supabase/schema.sql` to it first.

**`swims-blogs-api`**

| Variable | Value |
| --- | --- |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |
| `SUPABASE_SECRET_KEY` | `sb_secret_…` — bypasses row level security, server only |
| `CORS_ORIGINS` (Production) | `https://<website-domain>,https://<dashboard-domain>` |
| `CORS_ORIGINS` (Preview) | the same, plus `,https://*.vercel.app` |

Do not set `PORT`: Vercel owns the socket and the function never listens on one.
`NODE_ENV` is already `production` there.

The `*` stands for exactly one label and never for a dot, so it admits
`https://swims-website-git-branch.vercel.app` and refuses
`https://vercel.app.attacker.com`. It exists because a preview hostname changes
on every push and so cannot be listed ahead of time. Keep it out of Production,
where both real domains are known.

**`swims-dashboard`**

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_…` |
| `BLOGS_API_URL` | `https://<api-domain>` — server-side only, no `NEXT_PUBLIC_` |

**`swims-website`**

| Variable | Value |
| --- | --- |
| `NEXT_PUBLIC_BLOGS_API_URL` | `https://<api-domain>` |

Both `NEXT_PUBLIC_` values are inlined into the browser bundle at build time, so
changing one needs a redeploy, not a restart. Neither is a secret: the website
reads only published posts, and the dashboard's key is bound by row level
security.

## 3. Add the GitHub secrets

Repository → **Settings → Secrets and variables → Actions → New repository
secret**.

| Secret | Where it comes from |
| --- | --- |
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens → Create. Scope it to the team that owns the projects. |
| `VERCEL_ORG_ID` | Vercel → Team Settings → General → Team ID (a personal account uses the User ID). |
| `VERCEL_PROJECT_ID_WEBSITE` | Project → Settings → General → Project ID. |
| `VERCEL_PROJECT_ID_DASHBOARD` | The same, on the dashboard project. |
| `VERCEL_PROJECT_ID_BLOGS_API` | The same, on the API project. |

Or read the pair for a project at once by linking locally — this writes
`.vercel/project.json`, which is gitignored:

```sh
npx vercel link --cwd apps/website
cat apps/website/.vercel/project.json
```

## 4. Deploy

Push to `main`, or run the workflow by hand from the **Actions** tab. The run
does `pnpm check` once for the whole workspace, then builds and uploads the
three apps in parallel; each deployment URL appears in the run summary.

## 5. Point Supabase Auth at the dashboard

Supabase → **Authentication → URL Configuration**:

- **Site URL**: `https://<dashboard-domain>`
- **Redirect URLs**: add `https://<dashboard-domain>/**`, plus
  `https://<dashboard-project>-*.vercel.app/**` if sign-in should work on
  previews too.

Sign-in emails link back to whatever is configured here, so a stale Site URL
sends people to localhost from a production email.

## 6. Check it

```sh
curl https://<api-domain>/health
# {"success":true,"data":{"status":"ok"},…}

curl https://<api-domain>/api/blogs
# the published posts, or an empty list
```

`/health` deliberately does not touch Supabase, so a healthy `/health` beside a
failing `/api/blogs` means the credentials are wrong rather than the deployment.

Then, in a browser:

- the website's `/blog` lists posts, and a post page opens
- the dashboard redirects to `/login`, sign-in works, and the blog list loads

If the website's blog is empty while `curl` returns posts, it is CORS: the
browser was refused and `curl` was not. Compare `CORS_ORIGINS` against the exact
origin in the browser's network tab, scheme included.

---

## Custom domains

Vercel → Project → **Settings → Domains**. After adding one, update everything
that names the old address:

1. `CORS_ORIGINS` on the API — both frontends' new origins.
2. `BLOGS_API_URL` on the dashboard and `NEXT_PUBLIC_BLOGS_API_URL` on the
   website, if the API's domain changed.
3. Supabase's Site URL and redirect list, if the dashboard's domain changed.

Then redeploy the frontends, because those two `NEXT_PUBLIC_` values were baked
into their bundles.

## Rollback

Vercel → Project → **Deployments** → the last good one → **Promote to
Production**. It serves output that was already built, so it is immediate and
does not depend on the repository. Fix forward afterwards.

## Troubleshooting

**"No Output Directory named 'public' found after the Build completed".** A
project with its own build command is expected to leave static output behind,
and an API leaves none -- the deployment is a function, not a site. That is why
`apps/blogs-api/vercel.json` ends its build with `mkdir -p apps/blogs-api/public`
and declares `outputDirectory: "public"`: an empty directory satisfies the
check, and because it holds no files every path still falls through the rewrite
to the function.

**"Unexpected token '<' ... is not valid JSON" while uploading, then `Upload
aborted` over and over.** The upload endpoint answered one of the file requests
with an HTML error page, and the CLI cannot parse it. It shows up on the website
rather than the other two because it uploads a few hundred image files. The
deploy step passes `--archive=tgz`, which sends one tarball instead of a request
per file.

**`Module not found: @swims/schemas`.** Either the Root Directory is wrong or
"Include files outside the root directory" is off. All three builds run
`pnpm turbo run build --filter=…` from the repository root, which builds
`packages/*` first.

**Every visitor shares one rate-limit bucket.** That is what `trust proxy`
guards against, and `createApp()` enables it only when `VERCEL` is set. On
another host that puts a proxy in front, set the equivalent there.

**A preview's browser requests are refused by CORS.** The preview `CORS_ORIGINS`
needs the `https://*.vercel.app` entry from step 2 — and an environment variable
change only reaches deployments built after it.

## Another host

`apps/blogs-api` is an ordinary Node service anywhere else: `pnpm build`, then
`pnpm start`, which runs `src/server.ts` — the port binding, the EADDRINUSE
message and the SIGTERM handling that Vercel has no use for. Set `PORT` and the
same Supabase and `CORS_ORIGINS` variables. `api/index.ts` is Vercel's entry and
simply goes unused.
