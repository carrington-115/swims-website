import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { images } from "@/assets/images";
import { findTeamMember, team } from "@/lib/team";

import {
  BRAND,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgBrandRow,
  ogFonts,
} from "../../_og/card";

/**
 * The card for one team member.
 *
 * Generated at build for the four slugs `generateStaticParams` already
 * enumerates in `page.tsx`, so a shared profile costs nothing at request time.
 */
export const alt = "A member of the SWIMS team";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export function generateStaticParams() {
  return team.map((member) => ({ slug: member.id }));
}

/**
 * The portrait, as bytes rather than as a URL.
 *
 * The registry hands back a `StaticImageData` whose `src` is a `/_next/static/`
 * path -- an address served by a server that is not running while these cards
 * are being generated. satori needs the file itself, so the file has to be
 * found on disk.
 *
 * The key in `images.team` is the basename of the file it imports
 * (`ceo` -> `assets/figma-images/team/ceo.png`), so matching the member's
 * portrait back to its registry entry by identity gives the filename without
 * repeating the mapping anywhere. If that ever stops holding, this returns null
 * and the card is drawn without a portrait rather than failing.
 */
async function readPortrait(
  portrait: (typeof team)[number]["portrait"],
): Promise<string | null> {
  const entry = Object.entries(images.team).find(
    ([, image]) => image === portrait,
  );
  if (!entry) return null;

  try {
    const bytes = await readFile(
      join(process.cwd(), "assets", "figma-images", "team", `${entry[0]}.png`),
    );
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const member = findTeamMember(slug);
  const portrait = member ? await readPortrait(member.portrait) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          backgroundColor: BRAND.surface,
          backgroundImage: `linear-gradient(225deg, ${BRAND.surface} 0%, ${BRAND.surface} 52%, ${BRAND.primary500}26 100%)`,
        }}
      >
        <OgBrandRow />

        <div style={{ display: "flex", alignItems: "center", gap: 56 }}>
          {portrait ? (
            // eslint-disable-next-line @next/next/no-img-element -- satori has no next/image
            <img
              src={portrait}
              alt=""
              width={280}
              height={280}
              style={{
                width: 280,
                height: 280,
                borderRadius: 999,
                objectFit: "cover",
                border: `8px solid ${BRAND.primary500}`,
              }}
            />
          ) : null}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              maxWidth: portrait ? 700 : 1000,
            }}
          >
            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: 60,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: BRAND.primary900,
              }}
            >
              {member?.name ?? "The SWIMS team"}
            </div>
            <div
              style={{
                fontFamily: "Poppins",
                fontWeight: 400,
                fontSize: 34,
                color: BRAND.tertiary600,
              }}
            >
              {member?.role ?? "Building formal waste systems in Africa"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            height: 12,
            borderRadius: 999,
            backgroundColor: BRAND.primary500,
          }}
        />
      </div>
    ),
    { ...size, fonts: [...ogFonts] },
  );
}
