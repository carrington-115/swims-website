import { getSupabaseAdmin } from '../config/supabase';
import type { Blog, CreateBlogRequest, UpdateBlogRequest } from '../types';
import type { BlogRow } from '../types/supabase';

function mapBlogRow(row: BlogRow): Blog {
  return {
    id: row.id,
    title: row.title,
    dateCreated: row.date_created,
    timeToRead: row.time_to_read,
    author: row.author,
    profileImage: row.profile_image,
    name: row.name,
    description: row.description,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
  };
}

function toInsertRow(
  input: CreateBlogRequest & { userId: string; slug: string },
): Omit<BlogRow, 'id' | 'created_at' | 'updated_at'> {
  return {
    title: input.title,
    date_created: new Date().toISOString(),
    time_to_read: input.timeToRead,
    author: input.author,
    profile_image: input.profileImage || null,
    name: input.name,
    description: input.description || null,
    slug: input.slug,
    user_id: input.userId,
  };
}

// Must exclude id/user_id: postgrest rejects them as excess properties on an
// update, and neither is ever client-updatable.
type BlogUpdate = Partial<Omit<BlogRow, 'id' | 'user_id'>>;

function toUpdateRow(input: UpdateBlogRequest): BlogUpdate {
  const result: BlogUpdate = {};

  if (input.title) result.title = input.title;
  if (input.timeToRead) result.time_to_read = input.timeToRead;
  if (input.author) result.author = input.author;
  if (input.profileImage !== undefined) result.profile_image = input.profileImage;
  if (input.name) result.name = input.name;
  if (input.description !== undefined) result.description = input.description;
  if (input.slug) result.slug = input.slug;

  return result;
}

export async function findPublished(opts: {
  limit: number;
  offset: number;
}): Promise<{ rows: Blog[]; total: number }> {
  const { data, count, error } = await getSupabaseAdmin()
    .from('blogs')
    .select('*', { count: 'exact' })
    // A stable total order is required, otherwise Postgres may return rows in a
    // different order per request and paging skips/duplicates rows.
    .order('date_created', { ascending: false })
    .order('id', { ascending: false })
    .range(opts.offset, opts.offset + opts.limit - 1);

  if (error) throw error;

  return {
    rows: (data || []).map(mapBlogRow),
    total: count || 0,
  };
}

export async function findById(id: string): Promise<Blog | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapBlogRow(data) : null;
}

export async function findBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapBlogRow(data) : null;
}

export async function slugExists(slug: string): Promise<boolean> {
  const { count, error } = await getSupabaseAdmin()
    .from('blogs')
    .select('*', { count: 'exact', head: true })
    .eq('slug', slug);

  if (error) throw error;
  return (count || 0) > 0;
}

export async function create(
  input: CreateBlogRequest & { userId: string; slug: string },
): Promise<Blog> {
  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .insert(toInsertRow(input))
    .select()
    .single();

  if (error) throw error;
  return mapBlogRow(data);
}

export async function update(id: string, input: UpdateBlogRequest): Promise<Blog> {
  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .update(toUpdateRow(input))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapBlogRow(data);
}

export async function remove(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from('blogs').delete().eq('id', id);

  if (error) throw error;
}
