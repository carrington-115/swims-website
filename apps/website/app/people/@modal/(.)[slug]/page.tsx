import { notFound } from "next/navigation";

import { findTeamMember, team } from "@/lib/team";

import { PersonProfile } from "../../_sections/person-profile";
import { ProfileModal } from "../../_sections/profile-modal";

/** The same four routes `/people/[slug]` prerenders, so the popup is static too. */
export function generateStaticParams() {
  return team.map((member) => ({ slug: member.id }));
}

/** Ties the sheet's accessible name to the heading inside it. */
const HEADING_ID = "person-profile-heading";

/**
 * `/people/<slug>` intercepted (Figma 3138:251).
 *
 * Reached by clicking a card on the People page, this renders the member's
 * profile as a popup over the roster rather than navigating away. `@modal` is a
 * slot and not a route segment, so `(.)` -- same level -- is the right matcher
 * for the `[slug]` segment one directory up.
 *
 * Only the shell is a client component; the profile below it stays on the
 * server, exactly as `/people/[slug]` renders it.
 */
export default async function InterceptedPersonPage({
  params,
}: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const member = findTeamMember(slug);
  if (!member) notFound();

  return (
    <ProfileModal labelledBy={HEADING_ID}>
      <PersonProfile member={member} headingLevel={2} headingId={HEADING_ID} />
    </ProfileModal>
  );
}
