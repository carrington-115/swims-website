import { type NextRequest, NextResponse } from 'next/server';
import { updateBlogSchema } from '@swims/schemas';

import { errorResponse, requireUser } from '@/lib/api-route';
import { blogsApi } from '@/lib/blogs-api';

/**
 * Edits one blog -- in practice the publish/unpublish toggle on the listing.
 *
 * Ownership is not checked here. The Blogs API answers 403 for a blog the token
 * does not own, and `errorResponse` passes that status straight through, so
 * there is one place that decides it rather than two that can disagree.
 */
export async function PATCH(request: NextRequest, ctx: RouteContext<'/api/blogs/[id]'>) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Expected a JSON body.' }, { status: 400 });
  }

  const parsed = updateBlogSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: `${issue.path.join('.') || 'body'}: ${issue.message}` },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await blogsApi().blogs.update(id, parsed.data));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(_request: NextRequest, ctx: RouteContext<'/api/blogs/[id]'>) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const { id } = await ctx.params;

  try {
    await blogsApi().blogs.remove(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
