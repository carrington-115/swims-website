import { getSupabaseAdmin } from '../config/supabase';
import type { TableOfContents, TableOfContentsItem } from '../types';
import type { TableOfContentsRow } from '../types/supabase';

function mapTocRow(row: TableOfContentsRow): TableOfContents {
  return {
    id: row.id,
    blogId: row.blog_id,
    items: row.items,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findByBlogId(blogId: string): Promise<TableOfContents | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('table_of_contents')
    .select('*')
    .eq('blog_id', blogId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapTocRow(data) : null;
}

export async function upsertForBlog(
  blogId: string,
  items: TableOfContentsItem[],
): Promise<TableOfContents> {
  // A single upsert against the unique index on blog_id. The previous
  // select-then-insert/update was racy: two concurrent calls could both see no
  // existing row and the second insert would fail the unique constraint.
  const { data, error } = await getSupabaseAdmin()
    .from('table_of_contents')
    .upsert({ blog_id: blogId, items }, { onConflict: 'blog_id' })
    .select()
    .single();

  if (error) throw error;
  return mapTocRow(data);
}

export async function remove(blogId: string): Promise<void> {
  const { error } = await getSupabaseAdmin()
    .from('table_of_contents')
    .delete()
    .eq('blog_id', blogId);

  if (error) throw error;
}
