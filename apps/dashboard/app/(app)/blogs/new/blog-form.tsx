'use client';

import { useActionState, useState } from 'react';
import { useFormStatus } from 'react-dom';

import { Alert } from '@/components/alert';
import { Button, ButtonLink } from '@/components/button';
import { Field, Input, Select, Textarea } from '@/components/field';
import { ImagePicker } from '@/components/image-picker';
import { MAX_SECTION_IMAGES } from '@/lib/limits';

import { createBlog, type ActionState } from '../../actions';

/** The categories the marketing site's blog index filters by. */
const CATEGORIES = [
  { value: '', label: 'None' },
  { value: 'company', label: 'Company' },
  { value: 'waste-management-in-africa', label: 'Waste management in Africa' },
  { value: 'global-waste-management', label: 'Global waste management' },
  { value: 'technology-in-waste-management', label: 'Technology in waste management' },
  { value: 'case-study', label: 'Case study' },
] as const;

function SubmitButton() {
  // `useFormStatus` has to live in a child of the <form>, not in the component
  // that renders it -- it reads the status of the nearest form above it.
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Saving…' : 'Save blog'}
    </Button>
  );
}

/**
 * One form that creates the whole post.
 *
 * Sections are rendered from a list of ids rather than a count, so removing the
 * middle one does not renumber the rest and lose what is typed in them. That id
 * is also what ties a section to its images: the picker posts
 * `section-<id>-image-url`, and a hidden `section-id` field per row gives the
 * action the ids in document order. Position in the form is the order, and the
 * API derives the table of contents from it.
 *
 * Images are already uploaded by the time this submits -- the picker sends each
 * file straight to Supabase Storage and keeps only the URL -- so the payload
 * here is small however many images a section carries.
 */
export function BlogForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(createBlog, { error: null });
  const [sectionIds, setSectionIds] = useState<number[]>([0]);
  const [nextId, setNextId] = useState(1);

  function addSection() {
    setSectionIds(ids => [...ids, nextId]);
    setNextId(id => id + 1);
  }

  function removeSection(id: number) {
    setSectionIds(ids => (ids.length === 1 ? ids : ids.filter(current => current !== id)));
  }

  return (
    <form action={formAction} className="flex flex-col gap-8">
      {state.error ? <Alert>{state.error}</Alert> : null}

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink-muted">Details</h2>

        <Field label="Title" htmlFor="title">
          <Input id="title" name="title" required placeholder="Lessons from…" />
        </Field>

        <Field label="Summary" htmlFor="description" hint="Shown on the blog index card.">
          <Textarea id="description" name="description" rows={3} />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Reading time" htmlFor="timeToRead" hint="In whole minutes.">
            <Input
              id="timeToRead"
              name="timeToRead"
              type="number"
              min={1}
              step={1}
              defaultValue={5}
              required
            />
          </Field>

          <Field label="Category" htmlFor="category">
            <Select id="category" name="category" defaultValue="">
              {CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <ImagePicker
          name="cover-image"
          label="Cover image"
          hint="Paste a URL or upload from this device. Optional."
          max={1}
          withAlt={false}
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-ink-muted">Sections</h2>
            <p className="text-xs text-ink-muted">
              Each becomes one entry in the post&rsquo;s table of contents, in this order.
            </p>
          </div>
          <Button type="button" variant="secondary" size="sm" onClick={addSection}>
            Add section
          </Button>
        </div>

        {sectionIds.map((id, index) => (
          <div
            key={id}
            className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-ink-muted">Section {index + 1}</span>
              {sectionIds.length > 1 ? (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSection(id)}>
                  Remove
                </Button>
              ) : null}
            </div>

            {/* Document order of these is the section order the action reads. */}
            <input type="hidden" name="section-id" value={id} />

            <Field label="Heading" htmlFor={`section-title-${id}`}>
              <Input
                id={`section-title-${id}`}
                name="section-title"
                placeholder="Where the waste actually goes"
              />
            </Field>

            <Field label="Body" htmlFor={`section-content-${id}`}>
              <Textarea id={`section-content-${id}`} name="section-content" rows={6} />
            </Field>

            <ImagePicker
              name={`section-${id}-image`}
              label="Images"
              hint={`Up to ${MAX_SECTION_IMAGES}, by URL or uploaded from this device.`}
              max={MAX_SECTION_IMAGES}
            />
          </div>
        ))}

        <p className="text-xs text-ink-muted">
          A section with no heading is skipped, so an empty one left at the bottom is harmless.
        </p>
      </section>

      <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink-muted">Publishing</h2>
        <Field
          label="Status"
          htmlFor="status"
          hint="A draft is only visible to you. Publishing puts it on the public site."
        >
          <Select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </Select>
        </Field>
      </section>

      <div className="flex items-center gap-3">
        <SubmitButton />
        <ButtonLink href="/" variant="secondary">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
