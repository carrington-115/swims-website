# Graph Report - updated-website  (2026-09-07)

## Corpus Check
- 148 files · ~201,160 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 974 nodes · 1594 edges · 58 communities (46 shown, 12 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ec99da0c`
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
- hero-banner.tsx
- hero-slider.tsx
- compilerOptions
- compilerOptions
- site-image.tsx
- section.tsx
- client.ts
- newsletter-signup.tsx
- why-us/page.tsx
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

## God Nodes (most connected - your core abstractions)
1. `cn()` - 76 edges
2. `getSupabaseAdmin()` - 21 edges
3. `Container()` - 20 edges
4. `Section()` - 20 edges
5. `images` - 19 edges
6. `SiteImage()` - 19 edges
7. `compilerOptions` - 17 edges
8. `compilerOptions` - 16 edges
9. `Button()` - 16 edges
10. `compilerOptions` - 16 edges

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

## Communities (58 total, 12 thin omitted)

### Community 0 - "blogController.ts"
Cohesion: 0.08
Nodes (44): app, server, getSupabaseAuth(), createBlog(), createBlogSchema, createSection(), createSectionSchema, deleteBlog() (+36 more)

### Community 1 - "icons.tsx"
Cohesion: 0.05
Nodes (51): geistMono, geistSans, metadata, poppins, InterceptedPersonPage(), PersonProfile(), PersonProfileProps, ProfileModal() (+43 more)

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
Cohesion: 0.09
Nodes (22): heroBody, heroHeading, partnerLogos, wallHeading, metadata, brand, dtracker, home (+14 more)

### Community 15 - "eslint-config/package.json"
Cohesion: 0.10
Nodes (19): dependencies, eslint-config-next, typescript-eslint, exports, ./next, ./node, files, eslint (+11 more)

### Community 16 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+10 more)

### Community 17 - "hero-banner.tsx"
Cohesion: 0.16
Nodes (16): heroSlides, HeroSlide(), HeroSlideProps, HeroSlider(), HeroBackdrop(), HeroBackdropProps, HeroBanner(), HeroBannerProps (+8 more)

### Community 18 - "hero-slider.tsx"
Cohesion: 0.22
Nodes (9): HeroDots(), HeroDotsProps, HeroNavArrow(), HeroNavArrowProps, HeroSliderProps, HeroThumbNav(), HeroThumbNavProps, ArrowLeftSolidIcon() (+1 more)

### Community 19 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, lib, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns, noUnusedLocals, noUnusedParameters (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, isolatedModules, lib, module, moduleResolution, noEmit, target (+7 more)

### Community 21 - "site-image.tsx"
Cohesion: 0.26
Nodes (8): SiteImage, SiteImage(), SiteImageProps, FeatureBandProps, FeatureBandTone, FounderMessage(), FounderMessageProps, LogoWallProps

### Community 22 - "section.tsx"
Cohesion: 0.12
Nodes (22): stats, Container(), ContainerProps, Section(), SectionProps, spacings, tones, CollectorPitch() (+14 more)

### Community 23 - "client.ts"
Cohesion: 0.31
Nodes (6): BlogsClient, createBlogsClient(), BlogsApiError, BlogsClientOptions, FetchLike, RequestOptions

### Community 24 - "newsletter-signup.tsx"
Cohesion: 0.25
Nodes (8): NewsletterForm(), NewsletterFormProps, newsletterInitialState, NewsletterState, NewsletterSignupProps, Input(), InputProps, inputVariants

### Community 25 - "why-us/page.tsx"
Cohesion: 0.06
Nodes (41): geistMono, geistSans, metadata, nextConfig, subscribeToNewsletter(), metadata, metadata, DownloadCta() (+33 more)

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
Nodes (34): Commands, Layout, Non-negotiables, Read before writing UI code, SWIMS website, This is NOT the Next.js you know, 1. Where things live, 2. Naming and file layout (+26 more)

### Community 42 - "Authenticated (Requires Bearer token)"
Cohesion: 0.07
Nodes (28): API Endpoints, Architecture, Authenticated (Requires Bearer token), Authentication, Build & Production, CORS, Create Blog, Create Section (+20 more)

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
Cohesion: 0.17
Nodes (17): BackedBy(), BackedByCta, BackedByProps, LatestBlogsProps, TeamGrid(), TeamGridProps, BlogCard(), BlogCardPost (+9 more)

## Knowledge Gaps
- **487 isolated node(s):** `figma`, `name`, `version`, `private`, `description` (+482 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `why-us/page.tsx` to `icons.tsx`, `env`, `images.ts`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `icons.tsx`, `images.ts`, `hero-banner.tsx`, `hero-slider.tsx`, `site-image.tsx`, `section.tsx`, `newsletter-signup.tsx`, `why-us/page.tsx`?**
  _High betweenness centrality (0.022) - this node is a cross-community bridge._
- **Why does `outputs` connect `env` to `why-us/page.tsx`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **What connects `figma`, `name`, `version` to the rest of the system?**
  _487 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `blogController.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08220211161387632 - nodes in this community are weakly interconnected._
- **Should `icons.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05267778753292362 - nodes in this community are weakly interconnected._
- **Should `env` be split into smaller, more focused modules?**
  _Cohesion score 0.05855855855855856 - nodes in this community are weakly interconnected._