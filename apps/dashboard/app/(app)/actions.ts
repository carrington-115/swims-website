'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createBlogSchema } from '@swims/schemas';

import { BlogsApiError, blogsApi } from '@/lib/blogs-api';
import { MAX_SECTION_IMAGES } from '@/lib/limits';
import { getUser } from '@/lib/supabase/server';

export type ActionState = { error: string | null };

/**
 * Every action re-checks the user against Supabase rather than trusting the
 * cookie the proxy read. The proxy is an optimistic redirect; this is the
 * boundary.
 */
async function requireUser() {
  const user = await getUser();
  if (!user) redirect('/login');
  return user;
}

function message(err: unknown): string {
  if (err instanceof BlogsApiError) {
    return err.status === 0
      ? 'Could not reach the Blogs API. Is it running on the port in BLOGS_API_URL?'
      : err.message;
  }
  return err instanceof Error ? err.message : 'Something went wrong.';
}

/**
 * Pulls one section's images back out of the flat form body.
 *
 * `ImagePicker` posts `section-<id>-image-url` and `-image-alt` as repeated
 * fields, which is the only shape a form can express for a list. The two arrays
 * are positional, so they zip by index.
 */
function imagesFor(formData: FormData, prefix: string) {
  const urls = formData.getAll(`${prefix}-url`).map(String);
  const alts = formData.getAll(`${prefix}-alt`).map(String);

  return urls
    .map((url, index) => ({ url: url.trim(), alt: (alts[index] ?? '').trim() }))
    .filter(image => image.url.length > 0)
    .slice(0, MAX_SECTION_IMAGES);
}

/**
 * Creates a blog and all of its sections in one request.
 *
 * The form is flat, so sections arrive as parallel `section-id[]`,
 * `section-title[]` and `section-content[]` fields and are zipped back into the
 * nested array the API takes. The id is what ties a row to its own images.
 * Order is document order, and the API derives the table of contents from it.
 *
 * Images are already in Supabase Storage by this point -- the picker uploads on
 * selection -- so what arrives here is only ever a URL.
 */
export async function createBlog(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const ids = formData.getAll('section-id').map(String);
  const titles = formData.getAll('section-title').map(String);
  const contents = formData.getAll('section-content').map(String);

  const sections = ids
    .map((id, index) => ({
      title: (titles[index] ?? '').trim(),
      content: (contents[index] ?? '').trim(),
      images: imagesFor(formData, `section-${id}-image`),
    }))
    // A blank row is someone who added a section and changed their mind, not an
    // error worth stopping the whole save for.
    .filter(section => section.title.length > 0)
    .map(section => ({
      title: section.title,
      ...(section.content ? { content: section.content } : {}),
      ...(section.images.length > 0 ? { images: section.images } : {}),
    }));

  const [coverImage] = formData.getAll('cover-image-url').map(value => String(value).trim());

  const raw = {
    title: String(formData.get('title') ?? '').trim(),
    timeToRead: Number(formData.get('timeToRead')),
    description: String(formData.get('description') ?? '').trim() || undefined,
    category: String(formData.get('category') ?? '').trim() || undefined,
    coverImage: coverImage || undefined,
    status: formData.get('status') === 'published' ? ('published' as const) : ('draft' as const),
    ...(sections.length > 0 ? { sections } : {}),
  };

  // Parsed here as well as in the API so a mistake is caught before a round
  // trip, and reported against the field that caused it.
  const parsed = createBlogSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue.path.join('.') || 'form';
    return { error: `${field}: ${issue.message}` };
  }

  let slug: string;
  try {
    const blog = await blogsApi().blogs.create(parsed.data);
    slug = blog.slug;
  } catch (err) {
    return { error: message(err) };
  }

  // Outside the try: `redirect` works by throwing, so catching around it would
  // swallow the navigation and report it as a failure.
  //
  // The revalidate still matters with the listing on React Query: it forces the
  // server render of `/` that the redirect lands on to re-read the API, and the
  // fresher data hydrates over whatever the browser had cached -- so the blog
  // just created cannot be missing from the list it arrives at.
  revalidatePath('/');
  redirect(`/?created=${encodeURIComponent(slug)}`);
}

/*
 * Publish, unpublish and delete are not here. They are React Query mutations in
 * `blogs-list.tsx`, going through the `/api/blogs/:id` handler, so a row can
 * show its own progress and report its own failure -- a server action can do
 * neither without re-rendering the whole page. Creating a blog stays an action:
 * it is a form submission that ends in a redirect, which is what actions are
 * good at.
 */
