import { supabaseAdmin } from '../config/supabase';
import type { TableOfContents, TableOfContentsItem } from '../types';
import type { TableOfContentsRow } from '../types/supabase';

function mapTocRow(row: TableOfContentsRow): TableOfContents {
  return {
    id: row.id,
    blockId: row.block_id,
    items: row.items,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function findByBlockId(blockId: string): Promise<TableOfContents | null> {
  const { data, error } = await supabaseAdmin
    .from('table_of_contents')
    .select('*')
    .eq('block_id', blockId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapTocRow(data) : null;
}

export async function upsertForBlock(
  blockId: string,
  items: TableOfContentsItem[],
): Promise<TableOfContents> {
  // A single upsert against the unique index on block_id. The previous
  // select-then-insert/update was racy: two concurrent calls could both see no
  // existing row and the second insert would fail the unique constraint.
  const { data, error } = await supabaseAdmin
    .from('table_of_contents')
    .upsert({ block_id: blockId, items }, { onConflict: 'block_id' })
    .select()
    .single();

  if (error) throw error;
  return mapTocRow(data);
}

export async function remove(blockId: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('table_of_contents')
    .delete()
    .eq('block_id', blockId);

  if (error) throw error;
}
