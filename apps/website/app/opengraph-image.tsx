import { ImageResponse } from "next/og";

import { SITE_DESCRIPTION } from "@/lib/site";

import {
  BRAND,
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgBrandRow,
  ogFonts,
} from "./_og/card";

/**
 * The card every route inherits.
 *
 * `opengraph-image` files cascade down the route tree, so this one answers for
 * the home page, the products, why-us, partners, the blog index -- everything
 * that does not put its own file in its own segment. The two that do are the
 * blog post and the person profile, because those are the links people actually
 * paste into a chat.
 *
 * Generated once at build: nothing here reads a request.
 */
export const alt = "SWIMS — smart waste management for Africa";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
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
          // The one flourish: a wash of brand green into the bottom-right corner,
          // so the card is not a white rectangle in a feed of white rectangles.
          // Linear rather than radial: satori's radial gradients band.
          backgroundImage: `linear-gradient(135deg, ${BRAND.surface} 0%, ${BRAND.surface} 52%, ${BRAND.primary500}26 100%)`,
        }}
      >
        <OgBrandRow />

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              fontFamily: "Poppins",
              fontWeight: 600,
              fontSize: 68,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              color: BRAND.primary900,
              maxWidth: 900,
            }}
          >
            Smart waste management for Africa
          </div>
          <div
            style={{
              fontFamily: "Poppins",
              fontWeight: 400,
              fontSize: 30,
              lineHeight: 1.4,
              color: BRAND.tertiary600,
              maxWidth: 880,
            }}
          >
            {SITE_DESCRIPTION}
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
