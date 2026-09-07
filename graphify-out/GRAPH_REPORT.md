# Graph Report - updated-website  (2026-09-07)

## Corpus Check
- 140 files · ~187,196 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 947 nodes · 1509 edges · 59 communities (47 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.73)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f48bcd60`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- blogController.ts
- icons.tsx
- env
- getSupabaseAdmin
- devDependencies
- blogs-api/package.json
- api-client/package.json
- schemas/package.json
- devDependencies
- api.ts
- compilerOptions
- compilerOptions
- compilerOptions
- package.json
- images.ts
- eslint-config/package.json
- compilerOptions
- site-image.tsx
- dtracker-hero.tsx
- compilerOptions
- compilerOptions
- section.tsx
- hero-banner.tsx
- client.ts
- backed-by.tsx
- platform/page.tsx
- tsconfig/package.json
- api-client/tsconfig.json
- schemas/tsconfig.json
- compilerOptions
- express.d.ts
- dashboard/eslint.config.mjs
- dashboard/postcss.config.mjs
- website/eslint.config.mjs
- website/postcss.config.mjs
- .mcp.json
- Component standard
- Authenticated (Requires Bearer token)
- why-us/page.tsx
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
- cn
- container.tsx
- partners/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 74 edges
2. `getSupabaseAdmin()` - 21 edges
3. `Section()` - 19 edges
4. `images` - 18 edges
5. `Container()` - 18 edges
6. `SiteImage()` - 18 edges
7. `compilerOptions` - 17 edges
8. `compilerOptions` - 16 edges
9. `compilerOptions` - 16 edges
10. `Button()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `requireOwnedBlog()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `listBlogs()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `getBlogById()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `getBlogById()` --references--> `Section`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/section.ts
- `getBlogById()` --references--> `TableOfContents`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/toc.ts

## Import Cycles
- None detected.

## Communities (59 total, 12 thin omitted)

### Community 0 - "blogController.ts"
Cohesion: 0.08
Nodes (44): app, server, getSupabaseAuth(), createBlog(), createBlogSchema, createSection(), createSectionSchema, deleteBlog() (+36 more)

### Community 1 - "icons.tsx"
Cohesion: 0.06
Nodes (36): geistMono, geistSans, metadata, poppins, stats, WasteCrisis(), FooterNavColumn(), FooterNavColumnProps (+28 more)

### Community 2 - "env"
Cohesion: 0.06
Nodes (36): ^build, CORS_ORIGINS, .env, **/.env.*local, !.next/cache/**, NEXT_PUBLIC_BLOGS_API_URL, NODE_ENV, PORT (+28 more)

### Community 3 - "getSupabaseAdmin"
Cohesion: 0.09
Nodes (34): clientOptions, getSupabaseAdmin(), getSupabaseEnv(), SupabaseEnv, supabaseEnvSchema, BlogUpdate, create(), findById() (+26 more)

### Community 4 - "devDependencies"
Cohesion: 0.05
Nodes (40): dependencies, class-variance-authority, clsx, next, react, react-dom, tailwind-merge, devDependencies (+32 more)

### Community 5 - "blogs-api/package.json"
Cohesion: 0.05
Nodes (39): dependencies, cors, dotenv, express, express-rate-limit, @supabase/supabase-js, @swims/schemas, zod (+31 more)

### Community 6 - "api-client/package.json"
Cohesion: 0.06
Nodes (34): dependencies, @swims/schemas, devDependencies, eslint, rimraf, @swims/eslint-config, @swims/tsconfig, tsup (+26 more)

### Community 7 - "schemas/package.json"
Cohesion: 0.06
Nodes (34): dependencies, zod, devDependencies, eslint, rimraf, @swims/eslint-config, @swims/tsconfig, tsup (+26 more)

### Community 8 - "devDependencies"
Cohesion: 0.06
Nodes (33): dependencies, next, react, react-dom, devDependencies, eslint, eslint-config-next, tailwindcss (+25 more)

### Community 9 - "api.ts"
Cohesion: 0.07
Nodes (24): ApiResponse, BlogResponse, blogResponseSchema, PaginatedResponse, blogSchema, CreateBlogRequest, createBlogSchema, ListBlogsQuery (+16 more)

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
Nodes (21): description, devDependencies, rimraf, turbo, typescript, engines, node, rimraf (+13 more)

### Community 14 - "images.ts"
Cohesion: 0.17
Nodes (10): brand, dtracker, home, menu, partners, photography, platform, products (+2 more)

### Community 15 - "eslint-config/package.json"
Cohesion: 0.10
Nodes (19): dependencies, eslint-config-next, typescript-eslint, exports, ./next, ./node, files, eslint (+11 more)

### Community 16 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+10 more)

### Community 17 - "site-image.tsx"
Cohesion: 0.18
Nodes (12): SiteImage, SiteImage(), SiteImageProps, HeroBackdropProps, defaultProducts, ProductHighlights(), ProductHighlightsProps, LogoWall() (+4 more)

### Community 18 - "dtracker-hero.tsx"
Cohesion: 0.33
Nodes (5): DtrackerHero(), AppStoreButtons(), AppStoreButtonsProps, AppStoreIcon(), PlayStoreIcon()

### Community 19 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, lib, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns, noUnusedLocals, noUnusedParameters (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, isolatedModules, lib, module, moduleResolution, noEmit, target (+7 more)

### Community 21 - "section.tsx"
Cohesion: 0.20
Nodes (9): Section(), SectionProps, spacings, tones, CtaBand(), CtaBandProps, CtaBandTone, FeatureBandProps (+1 more)

### Community 22 - "hero-banner.tsx"
Cohesion: 0.10
Nodes (24): heroSlides, HeroDots(), HeroDotsProps, HeroNavArrow(), HeroNavArrowProps, HeroSlide(), HeroSlideProps, HeroSlider() (+16 more)

### Community 23 - "client.ts"
Cohesion: 0.31
Nodes (6): BlogsClient, createBlogsClient(), BlogsApiError, BlogsClientOptions, FetchLike, RequestOptions

### Community 24 - "backed-by.tsx"
Cohesion: 0.18
Nodes (11): BackedByCta, BackedByProps, NewsletterForm(), NewsletterFormProps, newsletterInitialState, NewsletterState, NewsletterSignupProps, Button() (+3 more)

### Community 25 - "platform/page.tsx"
Cohesion: 0.08
Nodes (26): geistMono, geistSans, metadata, nextConfig, subscribeToNewsletter(), metadata, DownloadCta(), DirectPaymentBand() (+18 more)

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
Cohesion: 0.50
Nodes (3): Express, Locals, Request

### Community 41 - "Component standard"
Cohesion: 0.06
Nodes (33): Commands, Layout, Non-negotiables, Read before writing UI code, SWIMS website, This is NOT the Next.js you know, 1. Where things live, 2. Naming and file layout (+25 more)

### Community 42 - "Authenticated (Requires Bearer token)"
Cohesion: 0.07
Nodes (28): API Endpoints, Architecture, Authenticated (Requires Bearer token), Authentication, Build & Production, CORS, Create Blog, Create Section (+20 more)

### Community 43 - "why-us/page.tsx"
Cohesion: 0.21
Nodes (12): latestPosts, backers, collectorBenefits, founder, founderParagraphs, heroHeading, team, metadata (+4 more)

### Community 44 - "SWIMS monorepo"
Cohesion: 0.33
Nodes (5): Commands, Conventions, MCP, SWIMS monorepo, Website: read before writing UI code

### Community 45 - "dashboard/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 46 - "website/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 56 - "cn"
Cohesion: 0.15
Nodes (19): FounderMessage(), FounderMessageProps, LatestBlogsProps, PartnersStrip(), TeamGrid(), TeamGridProps, BlogCard(), BlogCardPost (+11 more)

### Community 57 - "container.tsx"
Cohesion: 0.23
Nodes (9): Container(), ContainerProps, SiteLogo(), SiteLogoProps, isActive(), SiteMenu(), defaultLogos, PartnersStripCta (+1 more)

### Community 58 - "partners/page.tsx"
Cohesion: 0.24
Nodes (8): heroBody, heroHeading, partnerLogos, wallHeading, metadata, BackedBy(), PageHero(), PageHeroProps

## Knowledge Gaps
- **484 isolated node(s):** `figma`, `name`, `version`, `private`, `description` (+479 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `platform/page.tsx` to `env`, `icons.tsx`, `partners/page.tsx`, `why-us/page.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `icons.tsx`, `why-us/page.tsx`, `site-image.tsx`, `dtracker-hero.tsx`, `section.tsx`, `hero-banner.tsx`, `backed-by.tsx`, `container.tsx`, `partners/page.tsx`, `platform/page.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `outputs` connect `env` to `platform/page.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `figma`, `name`, `version` to the rest of the system?**
  _484 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `blogController.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08220211161387632 - nodes in this community are weakly interconnected._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06236786469344609 - nodes in this community are weakly interconnected._
- **Should `env` be split into smaller, more focused modules?**
  _Cohesion score 0.05855855855855856 - nodes in this community are weakly interconnected._