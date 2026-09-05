# SWIMS Blogs API

A production-ready backend API for managing blog content ("Blogs") using Express.js, TypeScript, and Supabase.

## Quick Start

### Prerequisites
- Node.js ≥ 20
- pnpm 10.27.0
- Supabase project

### Installation

```bash
pnpm install
```

### Environment Setup

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your Supabase credentials to `.env.local`:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NODE_ENV=development
PORT=3000
FRONTEND_ORIGIN=http://localhost:3000
```

### Database Setup

For a new database:

1. Open Supabase SQL Editor
2. Copy the contents of `supabase/schema.sql`
3. Paste and run in the SQL Editor
4. Verify all tables (blogs, sections, table_of_contents) are created

For a database created before the blocks -> blogs rename, run
`supabase/migrations/0001_rename_blocks_to_blogs.sql` instead. It renames the
table, the `block_id` columns, and the indexes, constraints, trigger and policy
names in place, without touching row data. Run it *before* deploying this
version of the API, which reads only the new names. Re-running it is a no-op.

### Development

```bash
pnpm run dev
```

The server will start at `http://localhost:3000` and automatically reload on file changes.

### Build & Production

```bash
# Type check
pnpm run typecheck

# Build
pnpm run build

# Start production server
pnpm start
```

## API Endpoints

### Public (Read-only)

#### List Blogs
```
GET /api/blogs?limit=10&offset=0

Response:
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Blog title",
        "dateCreated": "2024-01-15T10:00:00Z",
        "timeToRead": 5,
        "author": "John Doe",
        "profileImage": "https://example.com/image.jpg",
        "name": "blog-name",
        "description": "Blog description",
        "slug": "blog-slug",
        "createdAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-15T10:00:00Z",
        "userId": "uuid"
      }
    ],
    "total": 50,
    "limit": 10,
    "offset": 0
  },
  "error": null,
  "timestamp": "2024-01-15T10:00:00Z"
}
```

#### Get Blog by ID
```
GET /api/blogs/:id

Returns blog with sections and table of contents.
```

#### Get Blog by Slug
```
GET /api/blogs/slug/:slug

Returns blog with sections and table of contents.
```

#### Get Blog Sections
```
GET /api/blogs/:id/sections

Returns array of sections for a blog.
```

#### Get Blog Table of Contents
```
GET /api/blogs/:id/table-of-contents

Returns table of contents for a blog, or null if not generated yet.
```

### Authenticated (Requires Bearer token)

#### Create Blog
```
POST /api/blogs
Authorization: Bearer <supabase_jwt_token>

Body:
{
  "title": "My Blog",
  "timeToRead": 5,
  "author": "John Doe",
  "name": "my-blog",
  "description": "Description",
  "profileImage": "https://example.com/image.jpg",
  "slug": "my-blog"  // optional, auto-generated from title if omitted
}

Response: 201 Created (blog object)
```

#### Update Blog
```
PUT /api/blogs/:id
Authorization: Bearer <supabase_jwt_token>

Body: (all fields optional)
{
  "title": "Updated title",
  "timeToRead": 10,
  ...
}

Response: 200 OK (updated blog object)
```

#### Delete Blog
```
DELETE /api/blogs/:id
Authorization: Bearer <supabase_jwt_token>

Response: 200 OK (null data)
```

#### Create Section
```
POST /api/blogs/:id/sections
Authorization: Bearer <supabase_jwt_token>

Body:
{
  "title": "Section Title",
  "content": "Section content",
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Image alt text",
      "caption": "Optional caption"
    }
  ],
  "imageOnly": "https://example.com/image.jpg",
  "orderIndex": 0  // optional, auto-appended if omitted
}

Response: 201 Created (section object)
```

#### Update Section
```
PUT /api/blogs/:id/sections/:sectionId
Authorization: Bearer <supabase_jwt_token>

Body: (all fields optional)
{
  "title": "Updated title",
  "content": "Updated content",
  ...
}

Response: 200 OK (updated section object)
```

#### Delete Section
```
DELETE /api/blogs/:id/sections/:sectionId
Authorization: Bearer <supabase_jwt_token>

Response: 200 OK (null data)
```

#### Generate/Update Table of Contents
```
POST /api/blogs/:id/table-of-contents
Authorization: Bearer <supabase_jwt_token>

Response: 200 OK (table of contents object)

Automatically generates TOC items from current sections.
```

## Authentication

Authentication uses Supabase Auth (GoTrue). Include a valid JWT bearer token in the `Authorization` header:

```
Authorization: Bearer <token>
```

To get a token, authenticate with Supabase Auth and use the returned JWT.

## Error Handling

All errors return the standard response envelope:

```json
{
  "success": false,
  "data": null,
  "error": "Error message",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Validation error
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not owner of resource)
- `404` - Not found
- `409` - Conflict (slug already taken)
- `500` - Server error

## Architecture

- **Models** (`src/models/`) - Data access layer with type mapping
- **Controllers** (`src/controllers/`) - Request handling and business logic
- **Middleware** (`src/middleware/`) - Authentication and error handling
- **Routes** (`src/routes/`) - API endpoint definitions
- **Types** (`src/types/`) - TypeScript interfaces and schemas
- **Config** (`src/config/`) - Supabase client configuration
- **Utils** (`src/utils/`) - Validation schemas and helper functions

## Rate Limiting

Write endpoints (POST/PUT/DELETE) are rate-limited to 100 requests per 15 minutes. Read endpoints are unlimited.

## CORS

By default, CORS is configured to accept requests from `http://localhost:3000` in development. Update `FRONTEND_ORIGIN` in `.env.local` to configure for production.
