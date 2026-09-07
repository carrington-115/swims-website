import Link from "next/link";

import { images } from "@/assets/images";
import { SiteImage } from "@/components/media/site-image";
import { cn } from "@/lib/cn";

/**
 * The card under the table of contents (Figma 3070:36440): a brand-green plate
 * inviting the reader to sign up as a collector, with the DTRACKER handset
 * running off the bottom of it.
 *
 * Figma exports this as one flat image with the words baked in. It is built as
 * markup instead so the heading is real text -- selectable, translatable, and
 * legible to a screen reader -- and so the plate takes the brand token rather
 * than a colour frozen into a PNG. The handset is the registry's own DTRACKER
 * shot; the export composites two floating cards over it that the registry has
 * no separate artwork for.
 */
export function AgentPromoCard({ className }: { className?: string }) {
  return (
    <Link
      href="/products/dtracker"
      className={cn(
        "relative block aspect-[1242/2208] overflow-hidden bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
    >
      <p className="absolute inset-x-0 top-[13%] px-5 text-center font-display text-xl leading-snug font-semibold text-white">
        Register as an agent and start earning
      </p>

      <SiteImage
        image={images.dtracker.heroPhone}
        alt=""
        sizes="145px"
        className="absolute top-[36%] left-1/2 w-[47%] max-w-none -translate-x-1/2"
      />
    </Link>
  );
}
