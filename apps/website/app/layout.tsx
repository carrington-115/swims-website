import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { QueryProvider } from "@/components/query-provider";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  isProductionDeployment,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** The Figma display face. Exposed as the `--font-display` token. */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * The defaults every route inherits.
 *
 * `metadataBase` is the load-bearing line: without it Next emits relative
 * `og:image` and `canonical` URLs, which a scraper cannot resolve -- it has no
 * page to resolve them against -- so the card falls back to a bare link. With
 * it, pages pass plain paths to `pageMetadata` and Next makes them absolute.
 *
 * The `openGraph` and `twitter` blocks here are the floor, not the ceiling:
 * each page overrides title, description and url through `pageMetadata`, and
 * the image comes from the `opengraph-image` files down the route tree.
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "SWIMS",
    template: "%s | SWIMS",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: "/",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    /*
     * Preview deployments serve the same markup on a real, reachable URL, so
     * left alone they compete with production for the same queries. Vercel
     * already sends `x-robots-tag: noindex` on previews; this says the same
     * thing in the markup, where it survives being fetched by anything else.
     */
    index: isProductionDeployment(),
    follow: isProductionDeployment(),
    googleBot: {
      index: isProductionDeployment(),
      follow: isProductionDeployment(),
      // Without this Google shows a thumbnail at best, and often nothing.
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-card focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-fg"
          >
            Skip to content
          </a>
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
