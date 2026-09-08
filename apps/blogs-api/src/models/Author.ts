import { getSupabaseAdmin } from '../config/supabase';
import type { Author } from '../types';
import type { AuthedUser } from '../types/express';
import type { AuthorRow } from '../types/supabase';

export function mapAuthorRow(row: AuthorRow): Author {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatar_url,
  };
}

/**
 * The display name to credit, in the order the sources are worth trusting:
 * whatever the user set as a full name, then a provider's `name`, then the
 * local part of their email, then the id so the column is never empty.
 */
function displayName(user: AuthedUser): string {
  const candidates = [user.metadata.full_name, user.metadata.name, user.metadata.user_name];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }

  const localPart = user.email?.split('@')[0];
  return localPart?.trim() || user.id;
}

function avatarUrl(user: AuthedUser): string | null {
  const candidates = [user.metadata.avatar_url, user.metadata.picture];

  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
  }

  return null;
}

/**
 * Writes the author row for the account behind the access token.
 *
 * Called on every authenticated write rather than once at sign-up, so a name or
 * avatar changed in Supabase shows up on the next post without a separate sync.
 * Blogs reference this row, so it also has to exist before a blog can be
 * inserted at all -- `blogs.user_id` is a foreign key onto it.
 */
export async function upsertFromUser(user: AuthedUser): Promise<Author> {
  const { data, error } = await getSupabaseAdmin()
    .from('authors')
    .upsert(
      {
        id: user.id,
        name: displayName(user),
        email: user.email,
        avatar_url: avatarUrl(user),
      },
      { onConflict: 'id' },
    )
    .select()
    .single();

  if (error) throw error;
  return mapAuthorRow(data);
}

export async function findById(id: string): Promise<Author | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('authors')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapAuthorRow(data) : null;
}
