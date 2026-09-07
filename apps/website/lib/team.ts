import { images } from "@/assets/images";
import type { Person } from "@/components/ui/person-card";
import type { SocialLink } from "@/lib/navigation";

/**
 * The SWIMS team, in one place.
 *
 * Both the People page (Figma 3040:4780, with the profile popup at 3138:251)
 * and the Why Us team band read from here, so a hire or a title change is a
 * one-line edit. It sits in `lib/` next to `navigation.ts` for the same reason:
 * it is site data, not page copy, and two routes need it.
 *
 * `id` doubles as the URL slug -- `/people/<id>` is the member's profile.
 */

export type TeamMember = Person & {
  /**
   * Profile paragraphs, shown in the popup and on the standalone profile page.
   *
   * TODO(content): only the founder's bio exists in the design. The other three
   * are deliberately empty rather than invented -- the profile renders without
   * a bio until real copy is supplied.
   */
  bio: readonly string[];
  /**
   * The member's own profiles, drawn as the icon row under their role.
   *
   * TODO(content): the design shows LinkedIn, Instagram, GitHub and X for the
   * founder but carries no URLs. Left empty rather than guessed; the row is
   * omitted while it is.
   */
  socials: readonly SocialLink[];
};

export const team: readonly TeamMember[] = [
  {
    id: "fru-mark-carrington-chei",
    name: "Fru-Mark Carrington Chei",
    role: "Founder & CEO",
    portrait: images.team.ceo,
    href: "/people/fru-mark-carrington-chei",
    bio: [
      "Fru (Mark) Carrington Chei is an Electrical and Computer Science Engineering major at Integral University. He founded SWIMS, a venture in Cameroon building smart solutions for waste management in African communities. During his Mercedes-Benz fellowship, he investigated how fast-growing cities are formalising informal waste workers and proposed a model at SWIMS that scaled to two Cameroonian cities. His research at Integral University combines LLMs and IoT to make precision agriculture accessible in developing countries.",
    ],
    socials: [],
  },
  {
    id: "ntoh-epotie-alida",
    name: "Ntoh Epotie Alida",
    role: "Cofounder & COO",
    portrait: images.team.coo,
    href: "/people/ntoh-epotie-alida",
    bio: [],
    socials: [],
  },
  {
    id: "tardzenyuy-brian-harris",
    name: "Tardzenyuy Brian Harris",
    role: "Co-founder & Marketing director",
    portrait: images.team.cmo,
    href: "/people/tardzenyuy-brian-harris",
    bio: [],
    socials: [],
  },
  {
    id: "arrey-etta-bessong",
    name: "Arrey-Etta Bessong",
    role: "Co-founder & technology systems director",
    portrait: images.team.cto,
    href: "/people/arrey-etta-bessong",
    bio: [],
    socials: [],
  },
];

/** The member behind a `/people/<slug>` URL, or `undefined` for an unknown one. */
export function findTeamMember(slug: string): TeamMember | undefined {
  return team.find((member) => member.id === slug);
}
