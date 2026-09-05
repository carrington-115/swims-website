import type { SectionImage, TableOfContentsItem } from './index';

// Declared as type aliases (not interfaces) so they carry an implicit index
// signature and therefore satisfy postgrest-js's `Record<string, unknown>`
// constraint on GenericTable.
export type BlogRow = {
  id: string;
  title: string;
  date_created: string;
  time_to_read: number;
  author: string;
  profile_image: string | null;
  name: string;
  description: string | null;
  slug: string;
  created_at: string;
  updated_at: string;
  user_id: string;
};

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

export type TableOfContentsRow = {
  id: string;
  blog_id: string;
  items: TableOfContentsItem[];
  created_at: string;
  updated_at: string;
};

// postgrest-js only applies this schema when it structurally matches its
// `GenericSchema` type, which requires `Relationships` on every table plus
// `Views` and `Functions`. Without them the whole schema silently degrades to
// `never`, which is what broke every .insert()/.update() call site.
export type Database = {
  public: {
    Tables: {
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
      table_of_contents: {
        Row: TableOfContentsRow;
        Insert: Omit<TableOfContentsRow, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Pick<TableOfContentsRow, 'items'>>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
  };
};
