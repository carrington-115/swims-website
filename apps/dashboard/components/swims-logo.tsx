import Image from 'next/image';

import { cn } from '@/lib/cn';

/**
 * The SWIMS mark.
 *
 * The file lives in this app's own `public/` rather than being imported from
 * `apps/website/assets` -- nothing crosses an apps/ boundary in this monorepo,
 * so the two copies are deliberate.
 *
 * The wordmark is part of the artwork, so the alt text is just the name; a
 * caller that puts a visible label beside it should pass `alt=""` instead.
 */
export function SwimsLogo({
  className,
  priority = false,
  alt = 'SWIMS',
}: {
  className?: string;
  priority?: boolean;
  alt?: string;
}) {
  return (
    <Image
      src="/swims-logo.png"
      alt={alt}
      width={158}
      height={63}
      priority={priority}
      className={cn('h-8 w-auto', className)}
    />
  );
}
