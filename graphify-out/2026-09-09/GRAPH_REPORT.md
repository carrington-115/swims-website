# Graph Report - updated-website  (2026-09-08)

## Corpus Check
- 187 files · ~223,150 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1182 nodes · 2042 edges · 78 communities (63 shown, 15 thin omitted)
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
- blog-index.tsx
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
- newsletter-signup.tsx
- eslint-config/package.json
- compilerOptions
- images.ts
- section.tsx
- compilerOptions
- compilerOptions
- hero-banner.tsx
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
- platform/page.tsx
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
- people/[slug]/page.tsx
- cn
- cn
- @types/react
- app/page.tsx
- site-footer.tsx
- server.ts
- check-ports.mjs
- (app)/page.tsx
- image-picker.tsx
- blog/_content.ts
- website/app/layout.tsx
- site-menu.tsx
- hero-nav-arrow.tsx
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
- `requireOwnedBlog()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `withSections()` --references--> `Section`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/section.ts
- `resolveSlug()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `listBlogs()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts
- `listMyBlogs()` --references--> `Blog`  [EXTRACTED]
  apps/blogs-api/src/controllers/blogController.ts → packages/schemas/src/blog.ts

## Import Cycles
- None detected.

## Communities (78 total, 15 thin omitted)

### Community 0 - "blogController.ts"
Cohesion: 0.09
Nodes (43): allowedOrigins, app, port, server, getSupabaseAuth(), assertReadable(), createBlog(), createSection() (+35 more)

### Community 1 - "blog-form.tsx"
Cohesion: 0.18
Nodes (14): ActionState, createBlog(), deleteBlog(), imagesFor(), message(), requireUser(), setBlogStatus(), BlogForm() (+6 more)

### Community 2 - "env"
Cohesion: 0.06
Nodes (35): ^build, CORS_ORIGINS, .env, **/.env.*local, NEXT_PUBLIC_BLOGS_API_URL, NODE_ENV, PORT, SUPABASE_ANON_KEY (+27 more)

### Community 3 - "blog-index.tsx"
Cohesion: 0.17
Nodes (12): BlogCategory, BlogPost, BlogIndex(), BlogIndexProps, CategoryFilter(), LatestBlogsProps, BlogCard(), BlogCardPost (+4 more)

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

### Community 14 - "newsletter-signup.tsx"
Cohesion: 0.25
Nodes (8): NewsletterForm(), NewsletterFormProps, newsletterInitialState, NewsletterState, NewsletterSignupProps, Input(), InputProps, inputVariants

### Community 15 - "eslint-config/package.json"
Cohesion: 0.10
Nodes (19): dependencies, eslint-config-next, typescript-eslint, exports, ./next, ./node, files, eslint (+11 more)

### Community 16 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, incremental, isolatedModules, jsx, lib, module, moduleResolution (+10 more)

### Community 17 - "images.ts"
Cohesion: 0.08
Nodes (27): heroBody, heroHeading, partnerLogos, wallHeading, metadata, brand, dtracker, home (+19 more)

### Community 18 - "section.tsx"
Cohesion: 0.16
Nodes (13): stats, Container(), ContainerProps, Section(), SectionProps, spacings, tones, CtaBand() (+5 more)

### Community 19 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, lib, module, moduleResolution, noFallthroughCasesInSwitch, noImplicitReturns, noUnusedLocals, noUnusedParameters (+7 more)

### Community 20 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, declaration, isolatedModules, lib, module, moduleResolution, noEmit, target (+7 more)

### Community 21 - "hero-banner.tsx"
Cohesion: 0.12
Nodes (22): heroSlides, HeroDots(), HeroDotsProps, HeroNavArrow(), HeroSlide(), HeroSlideProps, HeroSlider(), HeroSliderProps (+14 more)

### Community 22 - "getSupabaseAdmin"
Cohesion: 0.06
Nodes (57): clientOptions, getSupabaseAdmin(), assertNotPublishable(), firstSet(), getPort(), getSupabaseEnv(), isProduction(), KEY_ALIASES (+49 more)

### Community 23 - "client.ts"
Cohesion: 0.31
Nodes (6): BlogsClient, createBlogsClient(), BlogsApiError, BlogsClientOptions, FetchLike, RequestOptions

### Community 24 - "icons.tsx"
Cohesion: 0.13
Nodes (18): CategoryFilterProps, AppStoreIcon(), ArrowDownIcon(), base, CheckIcon(), FacebookIcon(), GitHubIcon(), IconProps (+10 more)

### Community 25 - ".next/**"
Cohesion: 0.11
Nodes (12): AuthForm(), metadata, metadata, geistMono, geistSans, metadata, nextConfig, nextConfig (+4 more)

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

### Community 43 - "platform/page.tsx"
Cohesion: 0.18
Nodes (13): metadata, DashboardBand(), DroneBand(), SensorBand(), PlatformHero(), FeatureBand(), FeatureBandProps, FeatureBandTone (+5 more)

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
Cohesion: 0.24
Nodes (11): backers, collectorBenefits, founder, founderParagraphs, heroHeading, team, metadata, images (+3 more)

### Community 57 - "people/[slug]/page.tsx"
Cohesion: 0.21
Nodes (10): InterceptedPersonPage(), PersonProfile(), PersonProfileProps, ProfileModal(), ProfileModalProps, generateMetadata(), PersonPage(), findTeamMember() (+2 more)

### Community 58 - "cn"
Cohesion: 0.20
Nodes (11): AuthFormProps, copy, Alert(), AlertProps, Field(), FieldProps, Input(), Select() (+3 more)

### Community 61 - "cn"
Cohesion: 0.13
Nodes (23): AgentPromoCard(), BlogArticle(), BlogArticleProps, TableOfContents(), TableOfContentsProps, SiteLogo(), SiteLogoProps, SiteImage() (+15 more)

### Community 63 - "app/page.tsx"
Cohesion: 0.20
Nodes (9): metadata, DesignChallengeBand(), DtrackerSurplusBand(), PlatformTrackingBand(), latestPosts, WasteCrisis(), LatestBlogs(), NewsletterSignup() (+1 more)

### Community 64 - "site-footer.tsx"
Cohesion: 0.17
Nodes (12): FooterNavColumn(), FooterNavColumnProps, SiteFooterProps, CopyrightIcon(), SocialLinks(), footerNav, NavGroup, NavItem (+4 more)

### Community 65 - "server.ts"
Cohesion: 0.33
Nodes (9): AppLayout(), SignOutButton(), Button(), required(), supabasePublishableKey(), supabaseUrl(), createClient(), createClient() (+1 more)

### Community 66 - "check-ports.mjs"
Cohesion: 0.13
Nodes (12): belongsToThisRepo(), commandLine(), commands, foreign, lines, normalise(), occupied, ours (+4 more)

### Community 67 - "(app)/page.tsx"
Cohesion: 0.18
Nodes (10): BlogsPage(), formatDate(), metadata, ButtonLink(), ButtonLinkProps, ButtonProps, Size, sizes (+2 more)

### Community 68 - "image-picker.tsx"
Cohesion: 0.26
Nodes (10): ImagePicker(), ImagePickerProps, PickedImage, ACCEPT_ATTRIBUTE, ACCEPTED_TYPES, BUCKET, describeSize(), extensionFor() (+2 more)

### Community 69 - "blog/_content.ts"
Cohesion: 0.08
Nodes (29): subscribeToNewsletter(), author, blogCategories, blogPosts, BlogSection, bodyParagraphs, buildSections(), filterPosts() (+21 more)

### Community 70 - "website/app/layout.tsx"
Cohesion: 0.25
Nodes (6): geistMono, geistSans, metadata, poppins, SiteFooter(), SiteHeader()

### Community 71 - "site-menu.tsx"
Cohesion: 0.33
Nodes (6): isActive(), SiteMenu(), ChevronDownIcon(), CloseIcon(), MenuIcon(), mainNav

### Community 72 - "hero-nav-arrow.tsx"
Cohesion: 0.50
Nodes (3): HeroNavArrowProps, ArrowLeftSolidIcon(), ArrowRightSolidIcon()

### Community 73 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, start, typecheck

### Community 75 - "dashboard/package.json"
Cohesion: 0.40
Nodes (4): name, packageManager, private, version

## Knowledge Gaps
- **548 isolated node(s):** `figma`, `name`, `version`, `private`, `description` (+543 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **15 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `.next/**` connect `.next/**` to `blog-form.tsx`, `(app)/page.tsx`, `blog/_content.ts`, `website/app/layout.tsx`, `platform/page.tsx`, `images.ts`, `why-us/page.tsx`, `people/[slug]/page.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `cn()` connect `cn` to `site-footer.tsx`, `blog-index.tsx`, `website/app/layout.tsx`, `site-menu.tsx`, `hero-nav-arrow.tsx`, `platform/page.tsx`, `newsletter-signup.tsx`, `images.ts`, `section.tsx`, `hero-banner.tsx`, `icons.tsx`, `people/[slug]/page.tsx`, `why-us/page.tsx`, `app/page.tsx`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Why does `outputs` connect `.next/**` to `env`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **What connects `figma`, `name`, `version` to the rest of the system?**
  _548 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `blogController.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09014675052410902 - nodes in this community are weakly interconnected._
- **Should `env` be split into smaller, more focused modules?**
  _Cohesion score 0.06031746031746032 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._