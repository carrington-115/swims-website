import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { ArrowLeftSolidIcon } from "@/components/ui/icons";
import { findTeamMember, team } from "@/lib/team";

import { PersonProfile } from "../_sections/person-profile";

/** One route per member, prerendered at build time. */
export function generateStaticParams() {
  return team.map((member) => ({ slug: member.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/people/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const member = findTeamMember(slug);
  if (!member) return {};

  return {
    title: member.name,
    description: member.bio[0] ?? `${member.name}, ${member.role} at SWIMS.`,
  };
}

/**
 * A team member's profile as a page of its own (Figma 3138:251).
 *
 * This is what `/people/<slug>` renders on a shared link or a refresh. Reached
 * from the People page instead, the same URL is intercepted by
 * `@modal/(.)[slug]` and the identical `PersonProfile` appears as a popup.
 */
export default async function PersonPage({
  params,
}: PageProps<"/people/[slug]">) {
  const { slug } = await params;
  const member = findTeamMember(slug);
  if (!member) notFound();

  return (
    <Section spacing="md">
      <Container className="flex flex-col gap-8 lg:gap-14">
        <PersonProfile member={member} />

        <Button href="/people" variant="outline" shape="square" className="self-start px-3">
          <ArrowLeftSolidIcon className="size-5" />
          All of the team
        </Button>
      </Container>
    </Section>
  );
}
