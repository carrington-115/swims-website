import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SWIMS Blogs",
    template: "%s · SWIMS Blogs",
  },
  description: "Write and publish posts for the SWIMS blog.",
  /*
   * Never in search results. Everything behind the proxy needs a session, but
   * `/login` and `/signup` answer to anyone -- so without this the dashboard's
   * sign-in form is indexable, and it competes with the marketing site for the
   * SWIMS name while offering a visitor nothing they can use.
   */
  robots: { index: false, follow: false, nocache: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
