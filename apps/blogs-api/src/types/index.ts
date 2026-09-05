/**
 * The domain model now lives in @swims/schemas, so the API, the website and the
 * dashboard all describe a blog the same way. This module re-exports it to
 * keep the existing `from '../types'` imports working.
 */
export type {
  ApiResponse,
  Blog,
  BlogResponse,
  CreateBlogRequest,
  CreateSectionRequest,
  ListBlogsQuery,
  PaginatedResponse,
  Section,
  SectionImage,
  TableOfContents,
  TableOfContentsItem,
  UpdateBlogRequest,
  UpdateSectionRequest,
} from '@swims/schemas';
