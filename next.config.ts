import type { NextConfig } from "next";

const supabaseHost =
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/^https?:\/\//, "").replace(/\/.*$/, "") ||
  "supabase.co";

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: supabaseHost },
      // wildcard for any *.supabase.co project bucket
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default config;
