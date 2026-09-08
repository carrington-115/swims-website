import type { Section, TableOfContentsItem } from '../types';
import { generateSlug } from './validators';

/**
 * Builds a blog's table of contents from its sections.
 *
 * The contents used to be a stored row, rebuilt only when something POSTed to
 * `/table-of-contents`. That made it a second copy of the section headings that
 * nothing kept in step: rename a section and the stored contents still listed
 * the old heading, delete one and an entry was left pointing at nothing.
 *
 * Deriving it on read removes the second copy entirely. One entry per section,
 * in `order_index` order, always current by construction.
 *
 * Anchors are slugs rather than ids because they end up in the URL fragment.
 * Two sections may share a heading, so a repeat gets a numeric suffix -- the
 * anchor has to be unique within the page for `getElementById` to find the
 * right one.
 */
export function buildToc(sections: readonly Section[]): TableOfContentsItem[] {
  const seen = new Map<string, number>();

  return sections.map(section => {
    const base = generateSlug(section.title);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);

    return {
      sectionId: section.id,
      title: section.title,
      anchor: count === 0 ? base : `${base}-${count + 1}`,
      // Every section is a top-level heading. The field is here because the
      // frontend's contents component indents by level, and a section that
      // nests under another is a change to the model, not to this function.
      level: 1,
    };
  });
}
