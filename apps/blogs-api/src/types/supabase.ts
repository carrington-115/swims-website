import type { BlogCategoryId, SectionImage } from './index';

// Declared as type aliases (not interfaces) so they carry an implicit index
// signature and therefore satisfy postgrest-js's `Record<string, unknown>`
// constraint on GenericTable.
export type AuthorRow = {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogRow = {
  id: string;
  title: string;
  date_created: string;
  time_to_read: number;
  name: string;
  description: string | null;
  category: BlogCategoryId | null;
  cover_image: string | null;
  status: 'draft' | 'published';
  published_at: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

/**
 * A blog row with its author embedded. PostgREST returns the embed as an object
 * for a many-to-one foreign key, which `blogs.user_id -> authors.id` is.
 */
export type BlogRowWithAuthor = BlogRow & { author: AuthorRow | null };

export type SectionRow = {
  id: string;
  blog_id: string;
  title: string;
  content: string | null;
  images: SectionImage[] | null;
  image_only: string | null;
  order_index: number;
  created_at: string;
};

// postgrest-js only applies this schema when it structurally matches its
// `GenericSchema` type, which requires `Relationships` on every table plus
// `Views` and `Functions`. Without them the whole schema silently degrades to
// `never`, which is what broke every .insert()/.update() call site.
export type Database = {
  public: {
    Tables: {
      authors: {
        Row: AuthorRow;
        Insert: Omit<AuthorRow, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AuthorRow, 'id'>>;
        Relationships: [];
      };
      blogs: {
        Row: BlogRow;
        Insert: Omit<BlogRow, 'id' | 'created_at' | 'updated_at' | 'date_created'> & {
          date_created?: string;
        };
        Update: Partial<Omit<BlogRow, 'id' | 'user_id'>>;
        Relationships: [];
      };
      sections: {
        Row: SectionRow;
        Insert: Omit<SectionRow, 'id' | 'created_at'>;
        Update: Partial<Omit<SectionRow, 'id' | 'blog_id'>>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      create_blog_with_sections: {
        Args: { p_user_id: string; p_blog: unknown; p_sections: unknown };
        Returns: string;
      };
      reorder_sections: {
        Args: { p_blog_id: string; p_section_ids: string[] };
        Returns: undefined;
      };
    };
  };
};
