import { images } from "@/assets/images";
import type { CollectorBenefit } from "@/components/sections/collector-pitch";
import type { Person } from "@/components/ui/person-card";

/**
 * Copy for the Why Us page, transcribed from Figma 3025:4695 (desktop) and
 * 3076:37272 (mobile).
 *
 * Kept out of `page.tsx` so the route stays a list of sections, and out of the
 * sections themselves so they can be reused with other copy.
 */

export const heroHeading =
  "We believe informal waste systems are not a problem to replace, they're infrastructure to formalize.";

export const founderParagraphs: readonly string[] = [
  "Africa's waste isn't a crisis — it's a platform for change. Over 90% is managed by informal workers whose labor is invisible, unsupported, and undervalued. Meanwhile, 98% of the continent's waste infrastructure ignores technology entirely.",
  "At SWIMS, we see it differently. We're not fixing Africa's waste problem. We're unleashing its potential.",
  "We're legitimizing informal waste workers — giving collectors the tools, data, and formal recognition to build real livelihoods and communities that depend on them. Through DTRACKER, we've proven it works: collectors earn more, households get reliable service, and what was invisible becomes visible.",
  "We're also giving governments and organizations the intelligence they need. Real-time tracking. Data-driven decisions. The foundation to move from open dumping to coordinated systems. Because you can't formalize what you can't see.",
  "By 2035, we aim to reach 100,000 collectors across Sub-Saharan Africa — turning informal networks into formal infrastructure that works for communities, not against them.",
];

export const founder = {
  name: "Fru-Mark Carrington Chei",
  role: "Founder & CEO",
  portrait: images.team.ceo,
};

export const team: readonly Person[] = [
  {
    id: "fru-mark-carrington-chei",
    name: "Fru-Mark Carrington Chei",
    role: "Founder & CEO",
    portrait: images.team.ceo,
  },
  {
    id: "ntoh-epotie-alida",
    name: "Ntoh Epotie Alida",
    role: "Cofounder & COO",
    portrait: images.team.coo,
  },
  {
    id: "tardzenyuy-brian-harris",
    name: "Tardzenyuy Brian Harris",
    role: "Co-founder & Marketing director",
    portrait: images.team.cmo,
  },
  {
    id: "arrey-etta-bessong",
    name: "Arrey-Etta Bessong",
    role: "Co-founder & technology systems director",
    portrait: images.team.cto,
  },
];

/**
 * Two of the five logo slots in the Figma frame exported empty, so the row is
 * filled from the marks already in the registry.
 */
export const backers = [
  images.partners.microsoft,
  images.partners.bv,
  images.partners.athenaVc,
  images.partners.mitSolve,
  images.partners.ticSummit,
];

export const collectorBenefits: readonly CollectorBenefit[] = [
  {
    title: "Get steady customers",
    body: "Build your own regular route of homes and businesses that depend on you",
  },
  {
    title: "Get paid instantly",
    body: "No middleman. No delays. Direct payment every pickup",
  },
  {
    title: "Track your earnings",
    body: "See exactly how much you made, where it came from, and watch your income grow",
  },
  {
    title: "Earn credits",
    body: "Collect recyclables, build your reputation, convert credits to cash",
  },
  {
    title: "Grow your business",
    body: "The more reliable you are, the more customers you get",
  },
];
