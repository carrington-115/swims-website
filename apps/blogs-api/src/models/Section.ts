import { getSupabaseAdmin } from '../config/supabase';
import type { Section, CreateSectionRequest, UpdateSectionRequest } from '../types';
import type { SectionRow } from '../types/supabase';

function mapSectionRow(row: SectionRow): Section {
  return {
    id: row.id,
    blogId: row.blog_id,
    title: row.title,
    content: row.content,
    images: row.images,
    imageOnly: row.image_only,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  };
}

function toInsertRow(
  input: CreateSectionRequest & { blogId: string; orderIndex: number },
): Omit<SectionRow, 'id' | 'created_at'> {
  return {
    blog_id: input.blogId,
    title: input.title,
    content: input.content || null,
    images: input.images || null,
    image_only: input.imageOnly || null,
    order_index: input.orderIndex,
  };
}

// id/blog_id are not updatable and postgrest rejects them as excess properties.
type SectionUpdate = Partial<Omit<SectionRow, 'id' | 'blog_id'>>;

function toUpdateRow(input: UpdateSectionRequest): SectionUpdate {
  const result: SectionUpdate = {};

  if (input.title) result.title = input.title;
  if (input.content !== undefined) result.content = input.content;
  if (input.images !== undefined) result.images = input.images;
  if (input.imageOnly !== undefined) result.image_only = input.imageOnly;
  if (input.orderIndex !== undefined) result.order_index = input.orderIndex;

  return result;
}

export async function findByBlogId(blogId: string): Promise<Section[]> {
  const { data, error } = await getSupabaseAdmin()
    .from('sections')
    .select('*')
    .eq('blog_id', blogId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapSectionRow);
}

export async function findById(id: string): Promise<Section | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('sections')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapSectionRow(data) : null;
}

export async function getNextOrderIndex(blogId: string): Promise<number> {
  const { data, error } = await getSupabaseAdmin()
    .from('sections')
    .select('order_index')
    .eq('blog_id', blogId)
    .order('order_index', { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.order_index ?? -1) + 1;
}

export async function create(
  input: CreateSectionRequest & { blogId: string; orderIndex: number },
): Promise<Section> {
  const { data, error } = await getSupabaseAdmin()
    .from('sections')
    .insert(toInsertRow(input))
    .select()
    .single();

  if (error) throw error;
  return mapSectionRow(data);
}

export async function update(id: string, input: UpdateSectionRequest): Promise<Section> {
  const { data, error } = await getSupabaseAdmin()
    .from('sections')
    .update(toUpdateRow(input))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapSectionRow(data);
}

export async function remove(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from('sections').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Rewrites the order of a blog's sections from the complete list of its ids.
 *
 * Goes through the `reorder_sections` Postgres function: `order_index` is
 * unique per blog, so any sequence of single-row updates collides with a row it
 * is trying to trade places with. The function does it in one statement against
 * a deferred constraint, and rejects a list that is not exactly the blog's
 * sections (a partial one would leave holes or duplicate an index).
 */
export async function reorder(blogId: string, sectionIds: string[]): Promise<void> {
  const { error } = await getSupabaseAdmin().rpc('reorder_sections', {
    p_blog_id: blogId,
    p_section_ids: sectionIds,
  });

  if (error) throw error;
}
