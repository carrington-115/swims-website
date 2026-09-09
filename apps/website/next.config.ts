import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
     * Post covers and author avatars are uploaded from the dashboard into
     * Supabase Storage, so they are the only images the site renders from a URL
     * rather than the registry (docs/IMAGES.md). Narrowed to the public storage
     * path so this is not an open image proxy: `next/image` will optimise any
     * URL matching a pattern here, whoever asks.
     *
     * The hostname wildcard covers one label -- `<project-ref>.supabase.co` --
     * so the project can be swapped between environments without a build-time
     * variable, while anything outside supabase.co is still refused.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
