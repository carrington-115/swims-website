import type { ComponentPropsWithoutRef } from "react";

import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { PersonCard, type Person } from "@/components/ui/person-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";

type TeamGridProps = ComponentPropsWithoutRef<"section"> & {
  people: readonly Person[];
  heading?: string;
  /** `h1` when this band opens the page, as it does on People. */
  headingLevel?: 1 | 2;
};

/**
 * "Meet the team" (Figma 3040:4780 desktop, 3076:37309 mobile): portraits with
 * names and roles, two-up on phones and four-up from `lg`.
 */
export function TeamGrid({
  people,
  heading = "Meet the team",
  headingLevel = 2,
  className,
  ...props
}: TeamGridProps) {
  if (people.length === 0) return null;

  return (
    <Section
      spacing="md"
      aria-labelledby="team-heading"
      className={cn(className)}
      {...props}
    >
      <Container className="flex flex-col gap-5">
        <SectionHeading
          as={headingLevel === 1 ? "h1" : "h2"}
          id="team-heading"
          align="start"
          className="font-medium"
        >
          {heading}
        </SectionHeading>
        <ul className="grid grid-cols-2 gap-x-7 gap-y-8 lg:grid-cols-4">
          {people.map((person) => (
            <li key={person.id} className="flex">
              <PersonCard person={person} className="w-full" />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
