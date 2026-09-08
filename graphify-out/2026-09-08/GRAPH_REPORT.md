# Graph Report - updated-website  (2026-09-08)

## Corpus Check
- 187 files · ~222,712 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1172 nodes · 2030 edges · 74 communities (59 shown, 15 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24b31d90`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- blogController.ts
- blog-form.tsx
- env
- cn
- devDependencies
- blogs-api/package.json
- api-client/package.json
- schemas/package.json
- devDependencies
- blog.ts
- compilerOptions
- compilerOptions
- compilerOptions
- package.json
- container.tsx
- eslint-config/package.json
- compilerOptions
- images.ts
- section.tsx
- compilerOptions
- compilerOptions
- website/lib/cn.ts
- getSupabaseAdmin
- client.ts
- app.ts
- Blog.ts
- tsconfig/package.json
- api-client/tsconfig.json
- schemas/tsconfig.json
- compilerOptions
- express.d.ts
- dependencies
- dashboard/postcss.config.mjs
- website/eslint.config.mjs
- website/postcss.config.mjs
- .mcp.json
- Component standard
- Quick Start
- config/supabase.ts
- SWIMS monorepo
- dashboard/README.md
- website/README.md
- components/sections
- dashboard/AGENTS.md
- photography/README.md
- layout/README.md
- media/README.md
- ui/README.md
- CLAUDE.md
- why-us/page.tsx
- icons.tsx
- show-schema.ts
- blog-article.tsx
- @types/react
- platform/page.tsx
- check-supabase.ts
- partners/page.tsx
- check-ports.mjs
- Author.ts
- blog/_content.ts
- scripts
- dashboard/package.json
- proxy.ts
- react-dom
- @types/node

## God Nodes (most connected - your core abstractions)
1. `cn()` - 86 edges
2. `getSupabaseAdmin()` - 23 edges
3. `Container()` - 22 edges
4. `Section()` - 22 edges
5. `images` - 21 edges
6. `SiteImage()` - 20 edges
7. `compilerOptions` - 17 edges
8. `.next/**` - 17 edges
9. `compilerOptions` - 16 edges
10. `Button()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `createWithSections()` --calls--> `getSupabaseAdmin()`  [EXTRACTED]
  apps/blogs-api/src/models/Blog.ts → apps/blogs-api/src/config/supabase.ts
- `remove()` --calls--> `getSupabaseAdmin()`  [EXTRACTED]
  apps/blogs-api/src/models/Blog.ts → apps/blogs-api/src/config/supabase.ts
- `slugExists()` --calls--> `getSupabaseAdmin()`  [EXTRACTED]
  apps/blogs-api/src/models/Blog.ts → apps/blogs-api/src/config/supabase.ts
- `requireOwnedBlog()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `withSections()` --references--> `Section`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/section.ts

## Import Cycles
- None detected.

## Communities (74 total, 15 thin omitted)

### Community 0 - "blogController.ts"
Cohesion: 0.12
Nodes (37): getSupabaseAuth(), assertReadable(), createBlog(), createSection(), deleteBlog(), deleteSection(), getBlogById(), getBlogBySlug() (+29 more)

### Community 1 - "blog-form.tsx"
Cohesion: 0.05
Nodes (57): ActionState, createBlog(), deleteBlog(), imagesFor(), message(), requireUser(), setBlogStatus(), BlogForm() (+49 more)

### Community 2 - "env"
Cohesion: 0.06
Nodes (38): ^build, CORS_ORIGINS, .env, **/.env.*local, !.next/cache/**, NEXT_PUBLIC_BLOGS_API_URL, NODE_ENV, PORT (+30 more)

### Community 3 - "cn"
Cohesion: 0.17
Nodes (16): BackedBy(), BackedByCta, BackedByProps, FounderMessage(), FounderMessageProps, LatestBlogs(), LatestBlogsProps, defaultLogos (+8 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (40): dependencies, class-variance-authority, clsx, next, react, react-dom, tailwind-merge, devDependencies (+32 more)

### Community 5 - "blogs-api/package.json"
Cohesion: 0.04
Nodes (47): dependencies, cors, dotenv, express, express-rate-limit, @supabase/supabase-js, @swims/schemas, zod (+39 more)

### Community 6 - "api-client/package.json"
Cohesion: 0.06
Nodes (34): dependencies, @swims/schemas, devDependencies, eslint, rimraf, @swims/eslint-config, @swims/tsconfig, tsup (+26 more)

### Community 7 - "schemas/package.json"
Cohesion: 0.06
Nodes (34): dependencies, zod, devDependencies, eslint, rimraf, @swims/eslint-config, @swims/tsconfig, tsup (+26 more)

### Community 8 - "devDependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint, eslint-config-next, @swims/eslint-config, @swims/tsconfig, tailwindcss, @tailwindcss/postcss, @types/react-dom (+9 more)

### Community 9 - "blog.ts"
Cohesion: 0.06
Nodes (33): ApiResponse, BlogResponse, blogResponseSchema, PaginatedResponse, Author, authorSchema, blogSchema, BlogStatus (+25 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 11 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 12 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns (+15 more)

### Community 13 - "package.json"
Cohesion: 0.09
Nodes (22): description, devDependencies, rimraf, turbo, typescript, engines, node, rimraf (+14 more)

### Community 14 - "container.tsx"
Cohesion: 0.19
Nodes (11): Container(), ContainerProps, SiteLogo(), SiteLogoProps, isActive(), SiteMenu(), CtaBand(), CtaBandProps (+3 more)

### Community 15 - "eslint-config/package.json"
Cohesion: 0.10
Nodes (19): dependencies, eslint-config-next, typescript-eslint, exports, ./next, ./node, files, eslint (+11 more)

### Community 16 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+10 more)

### Community 17 - "images.ts"
Cohesion: 0.09
Nodes (25): brand, dtracker, home, menu, partners, photography, platform, products (+17 more)

### Community 18 - "section.tsx"
Cohesion: 0.13
Nodes (18): DownloadCta(), Section(), SectionProps, spacings, tones, HeroBanner(), HeroBannerProps, heroFrame (+10 more)

### Community 19 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, lib, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns, noUnusedLocals, noUnusedParameters (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, isolatedModules, lib, module, moduleResolution, noEmit, target (+7 more)

### Community 21 - "website/lib/cn.ts"
Cohesion: 0.13
Nodes (18): heroSlides, HeroDots(), HeroDotsProps, HeroNavArrow(), HeroSlide(), HeroSlideProps, HeroSlider(), HeroSliderProps (+10 more)

### Community 22 - "getSupabaseAdmin"
Cohesion: 0.32
Nodes (12): getSupabaseAdmin(), create(), findByBlogId(), findById(), getNextOrderIndex(), mapSectionRow(), remove(), reorder() (+4 more)

### Community 23 - "client.ts"
Cohesion: 0.31
Nodes (6): BlogsClient, createBlogsClient(), BlogsApiError, BlogsClientOptions, FetchLike, RequestOptions

### Community 24 - "app.ts"
Cohesion: 0.13
Nodes (16): allowedOrigins, app, port, server, assertNotPublishable(), firstSet(), getCorsOrigins(), getPort() (+8 more)

### Community 25 - "Blog.ts"
Cohesion: 0.24
Nodes (11): BlogUpdate, createWithSections(), findById(), findBySlug(), findMany(), FindManyOptions, mapBlogRow(), remove() (+3 more)

### Community 26 - "tsconfig/package.json"
Cohesion: 0.20
Nodes (9): files, base.json, license, name, private, version, nextjs.json, node-app.json (+1 more)

### Community 27 - "api-client/tsconfig.json"
Cohesion: 0.22
Nodes (8): exclude, extends, include, dist, node_modules, src/**/*.ts, @swims/tsconfig/node-lib.json, tsup.config.ts

### Community 28 - "schemas/tsconfig.json"
Cohesion: 0.22
Nodes (8): exclude, extends, include, dist, node_modules, src/**/*.ts, @swims/tsconfig/node-lib.json, tsup.config.ts

### Community 29 - "compilerOptions"
Cohesion: 0.22
Nodes (8): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, resolveJsonModule, skipLibCheck, strict, display, $schema

### Community 30 - "express.d.ts"
Cohesion: 0.40
Nodes (4): AuthedUser, Express, Locals, Request

### Community 32 - "dependencies"
Cohesion: 0.12
Nodes (17): dependencies, clsx, next, react, @supabase/ssr, @supabase/supabase-js, @swims/api-client, @swims/schemas (+9 more)

### Community 41 - "Component standard"
Cohesion: 0.06
Nodes (34): Commands, Layout, Non-negotiables, Read before writing UI code, SWIMS website, This is NOT the Next.js you know, 1. Where things live, 2. Naming and file layout (+26 more)

### Community 42 - "Quick Start"
Cohesion: 0.10
Nodes (20): A note on Node 20, API, Architecture, Authenticated, Authorship is not something a client can set, Check the connection, Create a blog, Database (+12 more)

### Community 43 - "config/supabase.ts"
Cohesion: 0.22
Nodes (6): clientOptions, AuthorRow, BlogRow, BlogRowWithAuthor, Database, SectionRow

### Community 44 - "SWIMS monorepo"
Cohesion: 0.29
Nodes (6): Commands, Conventions, MCP, Ports, SWIMS monorepo, Website: read before writing UI code

### Community 45 - "dashboard/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 46 - "website/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 56 - "why-us/page.tsx"
Cohesion: 0.16
Nodes (16): backers, collectorBenefits, founder, founderParagraphs, heroHeading, team, metadata, images (+8 more)

### Community 57 - "icons.tsx"
Cohesion: 0.05
Nodes (49): geistMono, geistSans, metadata, poppins, InterceptedPersonPage(), PersonProfile(), PersonProfileProps, ProfileModal() (+41 more)

### Community 58 - "show-schema.ts"
Cohesion: 0.32
Nodes (7): EXPECTED_FUNCTIONS, EXPECTED_TABLES, main(), OpenApiDefinition, OpenApiDocument, OpenApiProperty, RETIRED_TABLES

### Community 61 - "blog-article.tsx"
Cohesion: 0.28
Nodes (6): AgentPromoCard(), BlogArticle(), BlogArticleProps, TableOfContents(), TableOfContentsProps, ChevronDownIcon()

### Community 63 - "platform/page.tsx"
Cohesion: 0.06
Nodes (35): geistMono, geistSans, metadata, nextConfig, subscribeToNewsletter(), metadata, metadata, DirectPaymentBand() (+27 more)

### Community 64 - "check-supabase.ts"
Cohesion: 0.43
Nodes (6): describeKey(), fail(), main(), pass(), Result, results

### Community 65 - "partners/page.tsx"
Cohesion: 0.33
Nodes (6): heroBody, heroHeading, partnerLogos, wallHeading, metadata, PageHero()

### Community 66 - "check-ports.mjs"
Cohesion: 0.29
Nodes (4): commands, lines, PORTS, taken

### Community 67 - "Author.ts"
Cohesion: 0.60
Nodes (5): avatarUrl(), displayName(), findById(), mapAuthorRow(), upsertFromUser()

### Community 69 - "blog/_content.ts"
Cohesion: 0.09
Nodes (28): author, blogCategories, BlogCategory, BlogPost, blogPosts, BlogSection, bodyParagraphs, buildSections() (+20 more)

### Community 73 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, typecheck

### Community 75 - "dashboard/package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

## Knowledge Gaps
- **543 isolated node(s):** `figma`, `name`, `version`, `private`, `description` (+538 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `platform/page.tsx` to `partners/page.tsx`, `blog-form.tsx`, `env`, `blog/_content.ts`, `why-us/page.tsx`, `icons.tsx`?**
  _High betweenness centrality (0.065) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `partners/page.tsx`, `blog/_content.ts`, `container.tsx`, `images.ts`, `section.tsx`, `website/lib/cn.ts`, `why-us/page.tsx`, `icons.tsx`, `blog-article.tsx`, `platform/page.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `outputs` connect `env` to `platform/page.tsx`?**
  _High betweenness centrality (0.015) - this node is a cross-community bridge._
- **What connects `figma`, `name`, `version` to the rest of the system?**
  _543 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `blogController.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11717171717171718 - nodes in this community are weakly interconnected._
- **Should `blog-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0533515731874145 - nodes in this community are weakly interconnected._
- **Should `env` be split into smaller, more focused modules?**
  _Cohesion score 0.0553306342780027 - nodes in this community are weakly interconnected._