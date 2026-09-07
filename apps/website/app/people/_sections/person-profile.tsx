import { SiteImage } from "@/components/media/site-image";
import { SocialLinks } from "@/components/ui/social-links";
import { cn } from "@/lib/cn";
import type { TeamMember } from "@/lib/team";

type PersonProfileProps = {
  member: TeamMember;
  /** `h1` on the standalone profile page; `h2` inside the popup. */
  headingLevel?: 1 | 2;
  /** Ties the popup's `aria-labelledby` to the member's name. */
  headingId?: string;
  className?: string;
};

/**
 * One team member's profile (Figma 3138:251): the portrait column on the left
 * with the name, role and their own social marks under it, and the biography
 * beside it.
 *
 * Rendered by both `/people/[slug]` and the popup that intercepts it, so the
 * two can never drift. It is a plain server component -- the popup's dialog
 * behaviour lives in `profile-modal.tsx`, which takes this as `children`.
 *
 * The frame stacks the two columns on a phone; from `lg` it draws the portrait
 * at 324px and the copy at 972px, which is what the widths below are.
 */
export function PersonProfile({
  member,
  headingLevel = 1,
  headingId,
  className,
}: PersonProfileProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <div
      className={cn(
        "flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-6",
        className,
      )}
    >
      <figure className="flex w-full max-w-81 flex-col gap-2.5 lg:w-81 lg:shrink-0">
        <div className="relative aspect-[840/898] w-full overflow-hidden">
          <SiteImage
            image={member.portrait}
            cover
            priority
            sizes="(min-width: 1024px) 324px, 100vw"
          />
        </div>
        <figcaption className="flex flex-col">
          <Heading
            id={headingId}
            className="font-display text-xl font-semibold text-ink lg:text-2xl"
          >
            {member.name}
          </Heading>
          <p className="text-base text-ink-muted lg:text-xl">{member.role}</p>
        </figcaption>

        {member.socials.length > 0 ? (
          <SocialLinks links={member.socials} owner={member.name} />
        ) : null}
      </figure>

      {member.bio.length > 0 ? (
        <div className="flex flex-col gap-4 lg:w-243 lg:gap-6">
          {member.bio.map((paragraph) => (
            <p
              key={paragraph.slice(0, 40)}
              /* Figma sets the biography at 40px; `text-4xl` is the nearest
               * step on the type scale, and `leading-tight` restores the
               * frame's "normal" leading, which the scale tightens. */
              className="text-base leading-relaxed text-ink lg:text-4xl lg:leading-tight"
            >
              {paragraph}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
