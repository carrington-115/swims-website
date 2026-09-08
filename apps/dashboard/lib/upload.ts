import { createClient } from '@/lib/supabase/client';

/** The bucket blog artwork lives in. Created in the Supabase dashboard. */
export const BUCKET = 'swims_blog_dashboard';

/** Mirrors `allowed_mime_types` on the bucket, so the browser refuses first. */
export const ACCEPTED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
  'image/svg+xml',
] as const;

/** Mirrors the bucket's `file_size_limit`. */
export const MAX_BYTES = 5 * 1024 * 1024;

export const ACCEPT_ATTRIBUTE = ACCEPTED_TYPES.join(',');

function extensionFor(file: File): string {
  const fromName = file.name.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{1,5}$/.test(fromName)) return fromName;

  // A file dropped from the clipboard often has no useful name.
  return file.type === 'image/svg+xml' ? 'svg' : (file.type.split('/')[1] ?? 'bin');
}

export function describeSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Uploads one image and returns its public URL.
 *
 * Straight from the browser to Supabase Storage rather than through this app:
 * the file never passes through a Next server action, which would mean holding
 * the whole thing in memory and re-uploading it.
 *
 * The key is `<user-id>/<random>.<ext>`. The user id prefix is what the storage
 * policy checks -- one author cannot overwrite another's image by guessing a
 * name -- and the random stem means two files called `photo.jpg` do not
 * collide.
 */
export async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new Error(
      `That file is ${describeSize(file.size)}. The limit is ${describeSize(MAX_BYTES)}.`,
    );
  }

  if (!ACCEPTED_TYPES.includes(file.type as (typeof ACCEPTED_TYPES)[number])) {
    throw new Error(`${file.type || 'That file type'} is not an accepted image format.`);
  }

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('Your session expired. Sign in again.');

  const key = `${user.id}/${crypto.randomUUID()}.${extensionFor(file)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
    contentType: file.type,
    // Names are random, so a collision is a bug rather than a re-upload.
    upsert: false,
  });

  if (error) {
    // The most likely cause by far, and the least self-evident from the raw
    // message, is the bucket's own policies.
    throw new Error(
      `Upload failed: ${error.message}. If this says the row violates a policy, ` +
        'apply apps/blogs-api/supabase/storage.sql.',
    );
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(key);

  return publicUrl;
}
