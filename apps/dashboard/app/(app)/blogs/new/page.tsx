import type { Metadata } from 'next';

import { BlogForm } from './blog-form';

export const metadata: Metadata = { title: 'New blog' };

export default function NewBlogPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">New blog</h1>
        <p className="text-sm text-ink-muted">
          Saved in one request — the post and all of its sections together.
        </p>
      </div>

      <BlogForm />
    </div>
  );
}
