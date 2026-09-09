# Graph Report - updated-website  (2026-09-09)

## Corpus Check
- 209 files · ~230,841 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1265 nodes · 2235 edges · 84 communities (68 shown, 16 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 16 edges (avg confidence: 0.74)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eafe561d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- blogController.ts
- blog-form.tsx
- env
- section.tsx
- dependencies
- blogs-api/package.json
- api-client/package.json
- schemas/package.json
- devDependencies
- api.ts
- compilerOptions
- compilerOptions
- compilerOptions
- package.json
- newsletter-signup.tsx
- eslint-config/package.json
- compilerOptions
- website/lib/cn.ts
- server.ts
- compilerOptions
- compilerOptions
- dtracker-hero.tsx
- getSupabaseAdmin
- client.ts
- icons.tsx
- .next/**
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
- blogs-list.tsx
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
- blog-view.ts
- dtracker/page.tsx
- cn
- @types/react
- platform/page.tsx
- site-footer.tsx
- blog.ts
- check-ports.mjs
- blogsApi
- category.ts
- blog/[slug]/page.tsx
- website/app/layout.tsx
- dashboard/app/layout.tsx
- section.ts
- scripts
- schemas/src/index.ts
- dashboard/package.json
- proxy.ts
- blog/page.tsx
- react-dom
- actions.ts
- upload.ts
- website/lib/blog-queries.ts
- tailwind-merge
- tailwindcss

## God Nodes (most connected - your core abstractions)
1. `cn()` - 92 edges
2. `Container()` - 24 edges
3. `Section()` - 24 edges
4. `getSupabaseAdmin()` - 23 edges
5. `images` - 20 edges
6. `SiteImage()` - 19 edges
7. `compilerOptions` - 17 edges
8. `cn()` - 17 edges
9. `.next/**` - 17 edges
10. `compilerOptions` - 16 edges

## Surprising Connections (you probably didn't know these)
- `createBlog()` --references--> `Author`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/author.ts
- `requireOwnedBlog()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `withSections()` --references--> `Section`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/section.ts
- `resolveSlug()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `listBlogs()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts

## Import Cycles
- None detected.

## Communities (84 total, 16 thin omitted)

### Community 0 - "blogController.ts"
Cohesion: 0.09
Nodes (43): allowedOrigins, app, port, server, getSupabaseAuth(), assertReadable(), createBlog(), createSection() (+35 more)

### Community 1 - "blog-form.tsx"
Cohesion: 0.13
Nodes (23): AuthFormProps, copy, Alert(), AlertProps, Button(), ButtonLink(), ButtonLinkProps, ButtonProps (+15 more)

### Community 2 - "env"
Cohesion: 0.06
Nodes (38): ^build, CORS_ORIGINS, .env, **/.env.*local, !.next/cache/**, NEXT_PUBLIC_BLOGS_API_URL, NODE_ENV, PORT (+30 more)

### Community 3 - "section.tsx"
Cohesion: 0.12
Nodes (24): BlogArticle(), BlogArticleProps, BlogArticleSkeleton(), Container(), ContainerProps, Section(), SectionProps, spacings (+16 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (46): dependencies, class-variance-authority, clsx, next, react, react-dom, @swims/api-client, @swims/schemas (+38 more)

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
Nodes (17): devDependencies, eslint, eslint-config-next, @swims/eslint-config, @swims/tsconfig, @tailwindcss/postcss, @types/node, @types/react-dom (+9 more)

### Community 9 - "api.ts"
Cohesion: 0.15
Nodes (10): ApiResponse, BlogResponse, blogResponseSchema, PaginatedResponse, blogSchema, sectionSchema, TableOfContents, TableOfContentsItem (+2 more)

### Community 10 - "compilerOptions"
Cohesion: 0.07
Nodes (28): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+20 more)

### Community 11 - "compilerOptions"
Cohesion: 0.06
Nodes (30): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+22 more)

### Community 12 - "compilerOptions"
Cohesion: 0.08
Nodes (23): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, lib, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns (+15 more)

### Community 13 - "package.json"
Cohesion: 0.09
Nodes (22): description, devDependencies, rimraf, turbo, typescript, engines, node, rimraf (+14 more)

### Community 14 - "newsletter-signup.tsx"
Cohesion: 0.15
Nodes (14): NewsletterForm(), NewsletterFormProps, newsletterInitialState, NewsletterState, NewsletterSignupProps, AppStoreButtons(), AppStoreButtonsProps, Button() (+6 more)

### Community 15 - "eslint-config/package.json"
Cohesion: 0.10
Nodes (19): dependencies, eslint-config-next, typescript-eslint, exports, ./next, ./node, files, eslint (+11 more)

### Community 16 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+10 more)

### Community 17 - "website/lib/cn.ts"
Cohesion: 0.11
Nodes (23): brand, dtracker, home, menu, partners, photography, platform, products (+15 more)

### Community 18 - "server.ts"
Cohesion: 0.24
Nodes (10): AppLayout(), SignOutButton(), SwimsLogo(), required(), supabasePublishableKey(), supabaseUrl(), createClient(), createClient() (+2 more)

### Community 19 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, lib, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns, noUnusedLocals, noUnusedParameters (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, isolatedModules, lib, module, moduleResolution, noEmit, target (+7 more)

### Community 21 - "dtracker-hero.tsx"
Cohesion: 0.14
Nodes (19): heroSlides, HeroSlide(), HeroSlideProps, HeroSlider(), HeroSliderProps, HomeHero(), HeroBackdrop(), HeroBackdropProps (+11 more)

### Community 22 - "getSupabaseAdmin"
Cohesion: 0.06
Nodes (57): clientOptions, getSupabaseAdmin(), assertNotPublishable(), firstSet(), getCorsOrigins(), getPort(), getSupabaseEnv(), KEY_ALIASES (+49 more)

### Community 23 - "client.ts"
Cohesion: 0.31
Nodes (6): BlogsClient, createBlogsClient(), BlogsApiError, BlogsClientOptions, FetchLike, RequestOptions

### Community 24 - "icons.tsx"
Cohesion: 0.06
Nodes (45): InterceptedPersonPage(), PersonProfile(), PersonProfileProps, ProfileModal(), ProfileModalProps, generateMetadata(), PersonPage(), HeroNavArrowProps (+37 more)

### Community 25 - ".next/**"
Cohesion: 0.13
Nodes (8): BlogForm(), metadata, AuthForm(), metadata, metadata, nextConfig, nextConfig, .next/**

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
Cohesion: 0.05
Nodes (36): Commands, Layout, Non-negotiables, Read before writing UI code, SWIMS website, This is NOT the Next.js you know, 1. Where things live, 2. Naming and file layout (+28 more)

### Community 42 - "Quick Start"
Cohesion: 0.09
Nodes (21): A note on Node 20, API, Architecture, Authenticated, Authorship is not something a client can set, Categories are a closed set, Check the connection, Create a blog (+13 more)

### Community 43 - "blogs-list.tsx"
Cohesion: 0.24
Nodes (11): BlogsList(), formatDate(), metadata, blogKeys, DashboardApiError, deleteBlog(), LIST_LIMIT, MyBlogsFilters (+3 more)

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
Cohesion: 0.11
Nodes (23): heroBody, heroHeading, partnerLogos, wallHeading, metadata, backers, collectorBenefits, founder (+15 more)

### Community 57 - "blog-view.ts"
Cohesion: 0.31
Nodes (12): ArticlePost, ArticleSection, authorOf(), coverOf(), excerptFrom(), formatDate(), MONTHS, publishDate() (+4 more)

### Community 58 - "dtracker/page.tsx"
Cohesion: 0.24
Nodes (9): metadata, revalidate, DownloadCta(), DirectPaymentBand(), LiveMapBand(), PickupScheduleBand(), SecureSetupBand(), TrackEarningsBand() (+1 more)

### Community 61 - "cn"
Cohesion: 0.10
Nodes (26): AgentPromoCard(), BlogIndex(), BlogIndexProps, CategoryFilter(), CategoryFilterProps, TableOfContents(), TableOfContentsProps, HeroDots() (+18 more)

### Community 63 - "platform/page.tsx"
Cohesion: 0.11
Nodes (17): subscribeToNewsletter(), revalidate, metadata, revalidate, metadata, revalidate, DashboardBand(), DroneBand() (+9 more)

### Community 64 - "site-footer.tsx"
Cohesion: 0.24
Nodes (7): FooterNavColumn(), FooterNavColumnProps, SiteFooter(), SiteFooterProps, SiteLogo(), SiteLogoProps, SocialLinks()

### Community 65 - "blog.ts"
Cohesion: 0.18
Nodes (10): BlogStatus, blogStatusSchema, CreateBlogRequest, createBlogSchema, ListBlogsQuery, listBlogsQuerySchema, ListMyBlogsQuery, listMyBlogsQuerySchema (+2 more)

### Community 66 - "check-ports.mjs"
Cohesion: 0.13
Nodes (12): belongsToThisRepo(), commandLine(), commands, foreign, lines, normalise(), occupied, ours (+4 more)

### Community 67 - "blogsApi"
Cohesion: 0.51
Nodes (7): DELETE(), PATCH(), GET(), errorResponse(), requireUser(), blogsApi(), blogsApiUrl()

### Community 68 - "category.ts"
Cohesion: 0.24
Nodes (9): BLOG_CATEGORIES, BLOG_CATEGORY_IDS, BLOG_CATEGORY_LABELS, BlogCategory, BlogCategoryId, blogCategoryLabel(), blogCategorySchema, findBlogCategory() (+1 more)

### Community 69 - "blog/[slug]/page.tsx"
Cohesion: 0.27
Nodes (9): BlogArticleView(), BlogPostPage(), generateMetadata(), getPost, blogDetailQuery(), blogKeys, isNotFound(), blogsApi (+1 more)

### Community 70 - "website/app/layout.tsx"
Cohesion: 0.23
Nodes (8): geistMono, geistSans, metadata, poppins, SiteHeader(), QueryProvider(), getQueryClient(), makeQueryClient()

### Community 71 - "dashboard/app/layout.tsx"
Cohesion: 0.25
Nodes (7): BlogsPage(), geistMono, geistSans, metadata, QueryProvider(), getQueryClient(), makeQueryClient()

### Community 72 - "section.ts"
Cohesion: 0.22
Nodes (8): CreateSectionRequest, createSectionSchema, ReorderSectionsRequest, reorderSectionsSchema, SectionImage, sectionImageSchema, UpdateSectionRequest, updateSectionSchema

### Community 73 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, typecheck

### Community 74 - "schemas/src/index.ts"
Cohesion: 0.25
Nodes (5): Author, authorSchema, idParamSchema, sectionIdParamSchema, slugParamSchema

### Community 75 - "dashboard/package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

### Community 77 - "blog/page.tsx"
Cohesion: 0.36
Nodes (7): BlogPage(), metadata, BlogList(), BlogListProps, describe(), BlogListFilters, blogListQuery()

### Community 79 - "actions.ts"
Cohesion: 0.39
Nodes (6): ActionState, createBlog(), imagesFor(), message(), requireUser(), MAX_SECTION_IMAGES

### Community 80 - "upload.ts"
Cohesion: 0.38
Nodes (6): ACCEPT_ATTRIBUTE, ACCEPTED_TYPES, BUCKET, extensionFor(), MAX_BYTES, uploadImage()

### Community 81 - "website/lib/blog-queries.ts"
Cohesion: 0.62
Nodes (4): LatestBlogsBand(), LatestBlogsFeed(), LATEST_COUNT, latestBlogsQuery()

## Knowledge Gaps
- **562 isolated node(s):** `figma`, `name`, `version`, `private`, `description` (+557 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `env`, `blog/[slug]/page.tsx`, `website/app/layout.tsx`, `dashboard/app/layout.tsx`, `blogs-list.tsx`, `blog/page.tsx`, `why-us/page.tsx`, `icons.tsx`, `dtracker/page.tsx`, `platform/page.tsx`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `site-footer.tsx`, `section.tsx`, `newsletter-signup.tsx`, `website/lib/cn.ts`, `dtracker-hero.tsx`, `icons.tsx`, `why-us/page.tsx`, `platform/page.tsx`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Why does `outputs` connect `env` to `.next/**`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `figma`, `name`, `version` to the rest of the system?**
  _562 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `blogController.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09014675052410902 - nodes in this community are weakly interconnected._
- **Should `blog-form.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13257575757575757 - nodes in this community are weakly interconnected._
- **Should `env` be split into smaller, more focused modules?**
  _Cohesion score 0.0553306342780027 - nodes in this community are weakly interconnected._