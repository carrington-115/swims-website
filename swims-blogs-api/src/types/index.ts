declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
    interface Locals {
      // Validated/coerced query params. Express 5 defines req.query as a
      // getter-only accessor, so parsed values cannot be written back onto the
      // request and are carried here instead.
      validatedQuery?: unknown;
    }
  }
}

export interface SectionImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface Block {
  id: string;
  title: string;
  dateCreated: string;
  timeToRead: number;
  author: string;
  profileImage: string | null;
  name: string;
  description: string | null;
  slug: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Section {
  id: string;
  blockId: string;
  title: string;
  content: string | null;
  images: SectionImage[] | null;
  imageOnly: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface TableOfContentsItem {
  id: string;
  title: string;
  sectionId: string;
  level: number;
}

export interface TableOfContents {
  id: string;
  blockId: string;
  items: TableOfContentsItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BlockResponse extends Block {
  sections: Section[];
  tableOfContents: TableOfContents | null;
}

export interface CreateBlockRequest {
  title: string;
  timeToRead: number;
  author: string;
  profileImage?: string;
  name: string;
  description?: string;
  slug?: string;
}

export type UpdateBlockRequest = Partial<CreateBlockRequest>;

export interface CreateSectionRequest {
  title: string;
  content?: string;
  images?: SectionImage[];
  imageOnly?: string;
  orderIndex?: number;
}

export type UpdateSectionRequest = Partial<CreateSectionRequest>;

export interface AuthToken {
  userId: string;
  email?: string;
  role?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  timestamp: string;
}
