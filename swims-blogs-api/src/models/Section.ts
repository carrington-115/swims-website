import { supabaseAdmin } from '../config/supabase';
import type { Section, CreateSectionRequest, UpdateSectionRequest } from '../types';
import type { SectionRow } from '../types/supabase';

function mapSectionRow(row: SectionRow): Section {
  return {
    id: row.id,
    blockId: row.block_id,
    title: row.title,
    content: row.content,
    images: row.images,
    imageOnly: row.image_only,
    orderIndex: row.order_index,
    createdAt: row.created_at,
  };
}

function toInsertRow(
  input: CreateSectionRequest & { blockId: string; orderIndex: number },
): Omit<SectionRow, 'id' | 'created_at'> {
  return {
    block_id: input.blockId,
    title: input.title,
    content: input.content || null,
    images: input.images || null,
    image_only: input.imageOnly || null,
    order_index: input.orderIndex,
  };
}

// id/block_id are not updatable and postgrest rejects them as excess properties.
type SectionUpdate = Partial<Omit<SectionRow, 'id' | 'block_id'>>;

function toUpdateRow(input: UpdateSectionRequest): SectionUpdate {
  const result: SectionUpdate = {};

  if (input.title) result.title = input.title;
  if (input.content !== undefined) result.content = input.content;
  if (input.images !== undefined) result.images = input.images;
  if (input.imageOnly !== undefined) result.image_only = input.imageOnly;
  if (input.orderIndex !== undefined) result.order_index = input.orderIndex;

  return result;
}

export async function findByBlockId(blockId: string): Promise<Section[]> {
  const { data, error } = await supabaseAdmin
    .from('sections')
    .select('*')
    .eq('block_id', blockId)
    .order('order_index', { ascending: true });

  if (error) throw error;
  return (data || []).map(mapSectionRow);
}

export async function findById(id: string): Promise<Section | null> {
  const { data, error } = await supabaseAdmin
    .from('sections')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapSectionRow(data) : null;
}

export async function getNextOrderIndex(blockId: string): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('sections')
    .select('order_index')
    .eq('block_id', blockId)
    .order('order_index', { ascending: false })
    .limit(1);

  if (error) throw error;
  return (data?.[0]?.order_index ?? -1) + 1;
}

export async function create(
  input: CreateSectionRequest & { blockId: string; orderIndex: number },
): Promise<Section> {
  const { data, error } = await supabaseAdmin
    .from('sections')
    .insert(toInsertRow(input))
    .select()
    .single();

  if (error) throw error;
  return mapSectionRow(data);
}

export async function update(id: string, input: UpdateSectionRequest): Promise<Section> {
  const { data, error } = await supabaseAdmin
    .from('sections')
    .update(toUpdateRow(input))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return mapSectionRow(data);
}

export async function remove(id: string): Promise<void> {
  const { error } = await supabaseAdmin.from('sections').delete().eq('id', id);

  if (error) throw error;
}
