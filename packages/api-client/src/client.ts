import type {
  ApiResponse,
  Blog,
  BlogResponse,
  CreateBlogRequest,
  CreateSectionRequest,
  ListBlogsQuery,
  ListMyBlogsQuery,
  PaginatedResponse,
  Section,
  TableOfContents,
  UpdateBlogRequest,
  UpdateSectionRequest,
} from "@swims/schemas";
import { BlogsApiError } from "./errors";
import type { BlogsClientOptions, FetchLike, RequestOptions } from "./types";

function buildQuery(
  params: Record<string, string | number | undefined>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function createBlogsClient(options: BlogsClientOptions) {
  const baseUrl = options.baseUrl.replace(/\/+$/, "");
  const fetchImpl: FetchLike =
    options.fetch ?? ((input, init) => globalThis.fetch(input, init));

  async function request<T>(
    path: string,
    init: { method?: string; body?: unknown } & RequestOptions = {},
  ): Promise<T> {
    const { method = "GET", body, ...rest } = { ...options.defaultOptions, ...init };
    const headers = new Headers(rest.headers);

    if (body !== undefined && !headers.has("content-type")) {
      headers.set("content-type", "application/json");
    }

    const token = await options.getAccessToken?.();
    if (token) headers.set("authorization", `Bearer ${token}`);

    let response: Response;
    try {
      response = await fetchImpl(`${baseUrl}${path}`, {
        ...(rest as RequestInit),
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch (cause) {
      throw new BlogsApiError(
        0,
        `Could not reach the Blogs API at ${baseUrl}. Is it running, and is this origin allowed by CORS_ORIGINS?`,
        { cause },
      );
    }

    // Every route is meant to return the envelope, but a proxy or a crash can
    // produce HTML or an empty body -- fall back to the status text rather than
    // throwing an opaque JSON parse error.
    let payload: ApiResponse<T> | null = null;
    try {
      payload = (await response.json()) as ApiResponse<T>;
    } catch {
      payload = null;
    }

    if (!response.ok || !payload?.success) {
      throw new BlogsApiError(
        response.status,
        payload?.error ?? response.statusText ?? "Blogs API request failed",
      );
    }

    return payload.data as T;
  }

  return {
    /** Liveness probe. Does not touch Supabase. */
    health(opts?: RequestOptions) {
      return request<{ status: string }>("/health", opts);
    },

    blogs: {
      /** Published blogs only. Drafts are reachable through `listMine`. */
      list(query: Partial<ListBlogsQuery> = {}, opts?: RequestOptions) {
        return request<PaginatedResponse<Blog>>(
          `/api/blogs${buildQuery({
            limit: query.limit,
            offset: query.offset,
            category: query.category,
            q: query.q,
          })}`,
          opts,
        );
      },
      /** The signed-in author's own blogs, drafts included. Needs a token. */
      listMine(query: Partial<ListMyBlogsQuery> = {}, opts?: RequestOptions) {
        return request<PaginatedResponse<Blog>>(
          `/api/blogs/mine${buildQuery({
            limit: query.limit,
            offset: query.offset,
            category: query.category,
            q: query.q,
            status: query.status,
          })}`,
          opts,
        );
      },
      get(id: string, opts?: RequestOptions) {
        return request<BlogResponse>(`/api/blogs/${id}`, opts);
      },
      getBySlug(slug: string, opts?: RequestOptions) {
        return request<BlogResponse>(
          `/api/blogs/slug/${encodeURIComponent(slug)}`,
          opts,
        );
      },
      /**
       * Creates a blog and, with `input.sections`, its whole body in one
       * request. Returns the blog with its sections and table of contents, so
       * there is nothing to fetch back afterwards.
       *
       * The byline is not part of `input`: the API credits the account on the
       * access token.
       */
      create(input: CreateBlogRequest, opts?: RequestOptions) {
        return request<BlogResponse>("/api/blogs", {
          ...opts,
          method: "POST",
          body: input,
        });
      },
      update(id: string, input: UpdateBlogRequest, opts?: RequestOptions) {
        return request<Blog>(`/api/blogs/${id}`, { ...opts, method: "PUT", body: input });
      },
      remove(id: string, opts?: RequestOptions) {
        return request<null>(`/api/blogs/${id}`, { ...opts, method: "DELETE" });
      },
    },

    sections: {
      list(blogId: string, opts?: RequestOptions) {
        return request<Section[]>(`/api/blogs/${blogId}/sections`, opts);
      },
      create(blogId: string, input: CreateSectionRequest, opts?: RequestOptions) {
        return request<Section>(`/api/blogs/${blogId}/sections`, {
          ...opts,
          method: "POST",
          body: input,
        });
      },
      update(
        blogId: string,
        sectionId: string,
        input: UpdateSectionRequest,
        opts?: RequestOptions,
      ) {
        return request<Section>(`/api/blogs/${blogId}/sections/${sectionId}`, {
          ...opts,
          method: "PUT",
          body: input,
        });
      },
      remove(blogId: string, sectionId: string, opts?: RequestOptions) {
        return request<null>(`/api/blogs/${blogId}/sections/${sectionId}`, {
          ...opts,
          method: "DELETE",
        });
      },
      /**
       * Sets a new order from the complete list of the blog's section ids, and
       * returns the sections in it with the contents that follow.
       *
       * A whole list rather than one section at a time because `orderIndex` is
       * unique per blog: moving one section past another collides with it.
       */
      reorder(blogId: string, sectionIds: string[], opts?: RequestOptions) {
        return request<{ sections: Section[]; tableOfContents: TableOfContents }>(
          `/api/blogs/${blogId}/sections/order`,
          { ...opts, method: "PUT", body: { sectionIds } },
        );
      },
    },

    toc: {
      /**
       * The blog's table of contents.
       *
       * There is no `rebuild`: the contents are derived from the sections on
       * every read, so they are always current and there is nothing to
       * regenerate. `blogs.get` already carries them.
       */
      get(blogId: string, opts?: RequestOptions) {
        return request<TableOfContents>(
          `/api/blogs/${blogId}/table-of-contents`,
          opts,
        );
      },
    },
  };
}

export type BlogsClient = ReturnType<typeof createBlogsClient>;
