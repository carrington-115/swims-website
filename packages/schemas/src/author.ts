import { z } from "zod";

/**
 * The person a blog is credited to.
 *
 * Derived from the Supabase user on the access token, never from the request
 * body -- a byline that the client could set is a byline that can lie about who
 * wrote the post. The API upserts this row on every authenticated write, so it
 * tracks whatever the user last set in their Supabase profile.
 */
export const authorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().nullable(),
  avatarUrl: z.string().nullable(),
});

export type Author = z.infer<typeof authorSchema>;
