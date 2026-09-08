'use client';

import { useId, useRef, useState } from 'react';

import { Alert } from '@/components/alert';
import { Button } from '@/components/button';
import { Input } from '@/components/field';
import { cn } from '@/lib/cn';
import { ACCEPT_ATTRIBUTE, MAX_BYTES, describeSize, uploadImage } from '@/lib/upload';

/** One picked image. `alt` is required by the API's section schema. */
export type PickedImage = {
  id: string;
  url: string;
  alt: string;
  /** True while this entry is still uploading. */
  uploading?: boolean;
};

type ImagePickerProps = {
  /** Field name for the hidden inputs that carry the result into the form. */
  name: string;
  label: string;
  hint?: string;
  /** How many images this picker accepts. */
  max: number;
  /** Whether each image collects alt text. Off for a single cover image. */
  withAlt?: boolean;
  className?: string;
};

function newId() {
  return crypto.randomUUID();
}

/**
 * Adds images either by pasting a URL or by uploading a file from the device.
 *
 * Both routes end in the same place -- a URL in a hidden input -- so the form
 * that contains this does not care which was used. A file goes straight to
 * Supabase Storage from the browser and comes back as a public URL; nothing is
 * held until submit, which is what keeps a five-image section from posting
 * twenty megabytes through a server action.
 *
 * The URL box is not a `type="url"` input inside the form on purpose: it is a
 * staging field, and marking it required-shaped would make the *outer* form
 * refuse to submit while it holds a half-typed address.
 */
export function ImagePicker({
  name,
  label,
  hint,
  max,
  withAlt = true,
  className,
}: ImagePickerProps) {
  const fieldId = useId();
  const fileInput = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<PickedImage[]>([]);
  const [urlDraft, setUrlDraft] = useState('');
  const [error, setError] = useState<string | null>(null);

  const full = images.length >= max;
  const remaining = max - images.length;

  function addUrl() {
    setError(null);
    const url = urlDraft.trim();
    if (!url) return;

    if (full) {
      setError(`That is the limit of ${max}.`);
      return;
    }

    try {
      // The API validates with z.string().url(); fail here instead of on save.
      new URL(url);
    } catch {
      setError('That does not look like a full URL. It needs the https:// too.');
      return;
    }

    setImages(current => [...current, { id: newId(), url, alt: '' }]);
    setUrlDraft('');
  }

  async function addFiles(files: FileList | null) {
    setError(null);
    if (!files || files.length === 0) return;

    const accepted = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      setError(
        `Only ${remaining} more ${remaining === 1 ? 'image' : 'images'} fit here, so the rest were skipped.`,
      );
    }

    // Placeholders first, so the count is right and the limit holds while
    // several uploads are still in flight.
    const pending = accepted.map(file => ({ id: newId(), file }));

    setImages(current => [
      ...current,
      ...pending.map(entry => ({ id: entry.id, url: '', alt: '', uploading: true })),
    ]);

    await Promise.all(
      pending.map(async entry => {
        try {
          const url = await uploadImage(entry.file);
          setImages(current =>
            current.map(image =>
              image.id === entry.id ? { ...image, url, uploading: false } : image,
            ),
          );
        } catch (err) {
          // Drop the placeholder rather than leaving a stuck row behind.
          setImages(current => current.filter(image => image.id !== entry.id));
          setError(err instanceof Error ? err.message : 'That upload failed.');
        }
      }),
    );
  }

  function remove(id: string) {
    setImages(current => current.filter(image => image.id !== id));
    setError(null);
  }

  function setAlt(id: string, alt: string) {
    setImages(current => current.map(image => (image.id === id ? { ...image, alt } : image)));
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div>
        <p className="text-sm font-medium text-ink">
          {label}{' '}
          <span className="font-normal text-ink-muted">
            ({images.length}/{max})
          </span>
        </p>
        {hint ? <p className="text-xs text-ink-muted">{hint}</p> : null}
      </div>

      {error ? <Alert>{error}</Alert> : null}

      {images.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {images.map(image => (
            <li
              key={image.id}
              className="flex flex-col gap-2 rounded-field border border-line bg-canvas p-2 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                {image.uploading ? (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface text-[10px] text-ink-muted">
                    …
                  </span>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element --
                     the URL is arbitrary and user-supplied, so it cannot be in
                     next.config's remotePatterns allowlist. */
                  <img
                    src={image.url}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded border border-line bg-surface object-cover"
                  />
                )}
                <span className="truncate text-xs text-ink-muted" title={image.url}>
                  {image.uploading ? 'Uploading…' : image.url}
                </span>
              </div>

              {withAlt && !image.uploading ? (
                <Input
                  aria-label="Alt text"
                  placeholder="Describe the image"
                  value={image.alt}
                  onChange={event => setAlt(image.id, event.target.value)}
                  className="sm:w-56"
                />
              ) : null}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(image.id)}
                aria-label={`Remove ${image.url || 'image'}`}
              >
                Remove
              </Button>

              {/* What the form actually posts. */}
              {!image.uploading ? (
                <>
                  <input type="hidden" name={`${name}-url`} value={image.url} />
                  {withAlt ? <input type="hidden" name={`${name}-alt`} value={image.alt} /> : null}
                </>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}

      {!full ? (
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            id={fieldId}
            type="text"
            inputMode="url"
            placeholder="Paste an image URL"
            value={urlDraft}
            onChange={event => setUrlDraft(event.target.value)}
            onKeyDown={event => {
              // Enter in this box means "add this URL", not "submit the blog".
              if (event.key === 'Enter') {
                event.preventDefault();
                addUrl();
              }
            }}
          />
          <div className="flex gap-2">
            <Button type="button" variant="secondary" size="md" onClick={addUrl}>
              Add URL
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => fileInput.current?.click()}
            >
              Upload
            </Button>
          </div>

          <input
            ref={fileInput}
            type="file"
            accept={ACCEPT_ATTRIBUTE}
            multiple={max > 1}
            className="hidden"
            onChange={event => {
              void addFiles(event.target.files);
              // Reset, so picking the same file twice still fires a change.
              event.target.value = '';
            }}
          />
        </div>
      ) : null}

      <p className="text-xs text-ink-muted">
        {full
          ? `Limit of ${max} reached. Remove one to add another.`
          : `Up to ${describeSize(MAX_BYTES)} each. JPEG, PNG, WebP, AVIF, GIF or SVG.`}
      </p>
    </div>
  );
}
