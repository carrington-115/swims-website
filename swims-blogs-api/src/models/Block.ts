import { supabaseAdmin } from '../config/supabase';
import type { Block, CreateBlockRequest, UpdateBlockRequest } from '../types';
import type { BlockRow } from '../types/supabase';

function mapBlockRow(row: BlockRow): Block {
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
  input: CreateBlockRequest & { userId: string; slug: string },
): Omit<BlockRow, 'id' | 'created_at' | 'updated_at'> {
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
type BlockUpdate = Partial<Omit<BlockRow, 'id' | 'user_id'>>;

function toUpdateRow(input: UpdateBlockRequest): BlockUpdate {
  const result: BlockUpdate = {};

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
}): Promise<{ rows: Block[]; total: number }> {
  const { data, count, error } = await supabaseAdmin
    .from('blocks')
    .select('*', { count: 'exact' })
    // A stable total order is required, otherwise Postgres may return rows in a
    // different order per request and paging skips/duplicates rows.
    .order('date_created', { ascending: false })
    .order('id', { ascending: false })
    .range(opts.offset, opts.offset + opts.limit - 1);

  if (error) throw error;

  return {
    rows: (data || []).map(mapBlockRow),
    total: count || 0,
  };
}

export async function findById(id: string): Promise<Block | null> {
  const { data, error } = await supabaseAdmin
    .from('blocks')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapBlockRow(data) : null;
}

export async function findBySlug(slug: string): Promise<Block | null> {
  const { data, error } = await supabaseAdmin
    .from('blocks')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapBlockRow(data) : null;
}

export async function slugExists(slug: string): Promise<boolean> {
  const { count, error } = await supabaseAdmin
    .from('blocks')
    .select('*', { count: 'exact', head: true })
    .eq('slug', slug);

  if (error) throw error;
  return (count || 0) > 0;
}

export async function create(
  input: CreateBlockRequest & { userId: string; slug: string },
): Promise<Block> {
  const { data, error } = await supabaseAdmin
    .from('blocks')
    .insert(toInsertRow(input))
    .select()
    .single();

  if (error) throw error;
  return mapBlockRow(data);
}

export async function update(id: string, input: UpdateBlockRequest): Promise<Block> {
  const { data, error } = await supabaseAdmin
    .from('blocks')
    .update(toUpdateRow(input))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapBlockRow(data);
}

export async function remove(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('blocks').delete().eq('id', id);

  if (error) throw error;
}
