import { type NextRequest, NextResponse } from 'next/server';
import { listMyBlogsQuerySchema } from '@swims/schemas';

import { errorResponse, requireUser } from '@/lib/api-route';
import { blogsApi } from '@/lib/blogs-api';

/**
 * The signed-in author's blogs, drafts included.
 *
 * Proxies `/api/blogs/mine` on the Blogs API. The scoping to one author is done
 * there, from the token this forwards -- nothing in this request says whose
 * blogs to return, so a caller cannot ask for someone else's by changing it.
 *
 * A bad `?limit` or `?category` is a 400 from the schema rather than being
 * quietly clamped, which matches what the API itself would answer.
 */
export async function GET(request: NextRequest) {
  const { user, response } = await requireUser();
  if (!user) return response;

  const parsed = listMyBlogsQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams),
  );

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: `${issue.path.join('.') || 'query'}: ${issue.message}` },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(await blogsApi().blogs.listMine(parsed.data));
  } catch (error) {
    return errorResponse(error);
  }
}
