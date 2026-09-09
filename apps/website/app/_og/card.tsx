import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The shared frame every share-preview card is drawn in.
 *
 * These images are rendered by satori (through `next/og`), not by a browser, so
 * two of the site's rules cannot apply here and are suspended deliberately:
 *
 * - **Raw hex instead of tokens.** satori resolves no CSS custom properties and
 *   never loads `globals.css`; a `var(--color-primary-500)` would render as
 *   nothing. The values below are copied from the `@theme` block and named after
 *   their tokens so the two can be compared by eye. Change one there, change it
 *   here.
 * - **Inline styles instead of Tailwind.** There is no Tailwind pass over this
 *   JSX. satori supports a flexbox subset only: every element with more than one
 *   child needs an explicit `display: flex`, and grid does not exist.
 *
 * 1200x630 is the size Facebook, LinkedIn, WhatsApp, Slack and X all crop from.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/** Copied from the `@theme` block in `app/globals.css`. */
export const BRAND = {
  primary500: "#1e952e",
  primary900: "#0b3311",
  tertiary600: "#333333",
  tertiary200: "#cccccc",
  surface: "#ffffff",
  surfaceMuted: "#f5f5f5",
} as const;

/**
 * Poppins, as bytes.
 *
 * The `next/font/google` instance in `app/layout.tsx` cannot be reused: it
 * hands back a class name for a browser to resolve, and satori needs the font
 * file itself. Hence the two `.ttf` files in `assets/fonts/` -- and `.ttf`
 * rather than the `.woff2` the browser gets, because satori cannot decompress
 * woff2. Without them the cards fall back to a generic sans and stop looking
 * like the site.
 *
 * Read once per process at module scope, so a cold start pays for it and the
 * cards themselves do not.
 */
const fontDir = join(process.cwd(), "assets", "fonts");

const [poppinsRegular, poppinsSemiBold] = await Promise.all([
  readFile(join(fontDir, "Poppins-Regular.ttf")),
  readFile(join(fontDir, "Poppins-SemiBold.ttf")),
]);

export const ogFonts = [
  { name: "Poppins", data: poppinsRegular, style: "normal", weight: 400 },
  { name: "Poppins", data: poppinsSemiBold, style: "normal", weight: 600 },
] as const;

/**
 * The SWIMS mark, inlined.
 *
 * satori fetches a remote `src` over the network, which at build time would
 * mean asking a server that is not running yet. A data URI has nothing to
 * fetch, and at 10KB it costs less than the request would.
 */
const logoBytes = await readFile(
  join(process.cwd(), "assets", "figma-images", "logo.png"),
);

export const logoDataUri = `data:image/png;base64,${logoBytes.toString("base64")}`;

/**
 * What the rasteriser behind `ImageResponse` can actually decode, identified by
 * magic bytes rather than by the `Content-Type` the server claimed.
 *
 * This list is shorter than the list of formats the dashboard accepts, which is
 * "JPEG, PNG, WebP, AVIF, GIF or SVG" (`apps/dashboard/lib/upload.ts`). A WebP
 * or AVIF cover handed to satori does not degrade -- it throws, the image route
 * answers 500, and the platform that asked caches "this post has no image".
 * Detecting it here costs that post its cover and keeps its card.
 */
const DECODABLE = [
  { name: "image/png", magic: [0x89, 0x50, 0x4e, 0x47] },
  { name: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  { name: "image/gif", magic: [0x47, 0x49, 0x46, 0x38] },
] as const;

function decodableType(bytes: Buffer): string | null {
  for (const { name, magic } of DECODABLE) {
    if (magic.every((byte, index) => bytes[index] === byte)) return name;
  }
  return null;
}

/**
 * A remote image as a data URI, or `null` if it cannot be drawn.
 *
 * Post covers live in Supabase Storage. Fetching them here rather than letting
 * satori do it is what makes every failure -- unreachable, slow, 404, or a
 * format the rasteriser cannot read -- come out as "draw the card without a
 * cover" instead of as a 500 on the image URL.
 */
export async function fetchImageAsDataUri(
  url: string,
  timeoutMs = 4000,
): Promise<string | null> {
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!response.ok) return null;

    const bytes = Buffer.from(await response.arrayBuffer());
    const type = decodableType(bytes);
    if (!type) return null;

    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

/**
 * The wordmark row that identifies every card as SWIMS.
 *
 * On a dark card the mark sits on a white disc. The logo is a green leaf, and
 * over the post card's dark green scrim it simply vanished -- the wordmark was
 * carrying the whole thing on its own. The disc is the smallest change that
 * keeps the mark legible on any background it may land on.
 */
export function OgBrandRow({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const onDarkBackground = tone === "light";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: onDarkBackground ? 72 : 56,
          height: onDarkBackground ? 72 : 56,
          borderRadius: 999,
          backgroundColor: onDarkBackground ? BRAND.surface : "transparent",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori has no next/image */}
        <img src={logoDataUri} width={56} height={56} alt="" />
      </div>
      <span
        style={{
          fontFamily: "Poppins",
          fontWeight: 600,
          fontSize: 34,
          letterSpacing: "0.06em",
          color: tone === "dark" ? BRAND.primary900 : BRAND.surface,
        }}
      >
        SWIMS
      </span>
    </div>
  );
}
