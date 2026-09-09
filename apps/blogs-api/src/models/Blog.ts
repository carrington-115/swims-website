import { getSupabaseAdmin } from '../config/supabase';
import type {
  Blog,
  BlogCategoryId,
  BlogStatus,
  CreateBlogRequest,
  UpdateBlogRequest,
} from '../types';
import type { BlogRowWithAuthor } from '../types/supabase';
import { mapAuthorRow } from './Author';

/**
 * Every read embeds the author. `blogs.user_id` is a foreign key onto
 * `authors`, which is what lets PostgREST resolve the embed in one round trip.
 */
const SELECT_WITH_AUTHOR = '*, author:authors!blogs_user_id_fkey(*)';

function mapBlogRow(row: BlogRowWithAuthor): Blog {
  return {
    id: row.id,
    title: row.title,
    dateCreated: row.date_created,
    timeToRead: row.time_to_read,
    // The foreign key is `not null`, so the embed is only ever absent if a
    // caller selected without it -- a programming error, not a data state.
    author: row.author
      ? mapAuthorRow(row.author)
      : { id: row.user_id, name: 'Unknown author', email: null, avatarUrl: null },
    name: row.name,
    description: row.description,
    category: row.category,
    coverImage: row.cover_image,
    status: row.status,
    publishedAt: row.published_at,
    slug: row.slug,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    userId: row.user_id,
  };
}

// Must exclude id/user_id: postgrest rejects them as excess properties on an
// update, and neither is ever client-updatable.
type BlogUpdate = Partial<Omit<BlogRowWithAuthor, 'id' | 'user_id' | 'author'>>;

function toUpdateRow(input: UpdateBlogRequest, current: Blog): BlogUpdate {
  const result: BlogUpdate = {};

  if (input.title) result.title = input.title;
  if (input.timeToRead) result.time_to_read = input.timeToRead;
  if (input.name) result.name = input.name;
  if (input.description !== undefined) result.description = input.description;
  if (input.category !== undefined) result.category = input.category;
  if (input.coverImage !== undefined) result.cover_image = input.coverImage;
  if (input.slug) result.slug = input.slug;

  if (input.status && input.status !== current.status) {
    result.status = input.status;

    // Stamped the first time a blog goes live and kept from then on, so that
    // unpublishing and republishing does not rewrite the date it was first
    // read. `date_created` is when the row appeared; this is when it went out.
    if (input.status === 'published' && !current.publishedAt) {
      result.published_at = new Date().toISOString();
    }
  }

  return result;
}

export type FindManyOptions = {
  limit: number;
  offset: number;
  /** Filters to exactly one category. Validated against the known set upstream. */
  category?: BlogCategoryId;
  q?: string;
  /** Omit for every status. The public listing always passes `published`. */
  status?: BlogStatus;
  /** Restricts to one author. The public listing does not set it. */
  userId?: string;
};

export async function findMany(
  opts: FindManyOptions,
): Promise<{ rows: Blog[]; total: number }> {
  let query = getSupabaseAdmin()
    .from('blogs')
    .select(SELECT_WITH_AUTHOR, { count: 'exact' });

  if (opts.status) query = query.eq('status', opts.status);
  if (opts.category) query = query.eq('category', opts.category);
  if (opts.userId) query = query.eq('user_id', opts.userId);

  if (opts.q) {
    // `or` takes a PostgREST filter string, in which a comma separates the
    // branches -- so one in the search term would be read as syntax. Commas and
    // the wildcards are stripped rather than escaped, there being no escape
    // syntax for them in that grammar.
    const term = opts.q.replace(/[,()*]/g, ' ').trim();
    if (term) query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`);
  }

  const { data, count, error } = await query
    // A stable total order is required, otherwise Postgres may return rows in a
    // different order per request and paging skips/duplicates rows.
    .order('date_created', { ascending: false })
    .order('id', { ascending: false })
    .range(opts.offset, opts.offset + opts.limit - 1);

  if (error) throw error;

  return {
    rows: ((data ?? []) as unknown as BlogRowWithAuthor[]).map(mapBlogRow),
    total: count || 0,
  };
}

export async function findById(id: string): Promise<Blog | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .select(SELECT_WITH_AUTHOR)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapBlogRow(data as unknown as BlogRowWithAuthor) : null;
}

export async function findBySlug(slug: string): Promise<Blog | null> {
  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .select(SELECT_WITH_AUTHOR)
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? mapBlogRow(data as unknown as BlogRowWithAuthor) : null;
}

export async function slugExists(slug: string): Promise<boolean> {
  const { count, error } = await getSupabaseAdmin()
    .from('blogs')
    .select('id', { count: 'exact', head: true })
    .eq('slug', slug);

  if (error) throw error;
  return (count || 0) > 0;
}

/**
 * Creates a blog and all of its sections as one unit, returning the new id.
 *
 * Goes through the `create_blog_with_sections` Postgres function because the
 * Supabase client has no transaction: issued as separate inserts, a failure
 * partway through would leave a blog with some of its sections and no way for
 * the caller to know which.
 */
export async function createWithSections(
  input: CreateBlogRequest & { userId: string; slug: string; name: string },
): Promise<string> {
  const { data, error } = await getSupabaseAdmin().rpc('create_blog_with_sections', {
    p_user_id: input.userId,
    p_blog: {
      title: input.title,
      time_to_read: input.timeToRead,
      name: input.name,
      description: input.description ?? null,
      category: input.category ?? null,
      cover_image: input.coverImage ?? null,
      status: input.status ?? 'draft',
      slug: input.slug,
    },
    p_sections: (input.sections ?? []).map(section => ({
      title: section.title,
      content: section.content ?? null,
      images: section.images ?? null,
      image_only: section.imageOnly ?? null,
    })),
  });

  if (error) throw error;
  return data as string;
}

export async function update(id: string, input: UpdateBlogRequest, current: Blog): Promise<Blog> {
  const patch = toUpdateRow(input, current);

  // An empty patch is a no-op update in Postgres but an error in PostgREST,
  // which rejects an empty body. Return what is already there.
  if (Object.keys(patch).length === 0) return current;

  const { data, error } = await getSupabaseAdmin()
    .from('blogs')
    .update(patch)
    .eq('id', id)
    .select(SELECT_WITH_AUTHOR)
    .single();

  if (error) throw error;
  return mapBlogRow(data as unknown as BlogRowWithAuthor);
}

export async function remove(id: string): Promise<void> {
  const { error } = await getSupabaseAdmin().from('blogs').delete().eq('id', id);

  if (error) throw error;
}
