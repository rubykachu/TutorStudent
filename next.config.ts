import type { NextConfig } from "next";

// Lets an iPad on the home network load the dev server by LAN IP or mDNS name.
// Each "*" matches exactly one hostname label (one IPv4 octet).
const PRIVATE_LAN_ORIGINS = [
  "10.*.*.*",
  "192.168.*.*",
  ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
  "*.local",
];

// NEXT_PUBLIC_MEDIA_BASE_URL is baked into the browser code at build time, so a
// typo would ship broken video links: stop the build instead. Empty (media from
// public/media), a path, or a full URL; plain http only outside production.
function checkMediaBaseUrl(value: string | undefined): void {
  if (!value) return;
  const allowed =
    process.env.NODE_ENV === "production"
      ? /^(\/|https:\/\/[^/\s])/
      : /^(\/|https?:\/\/[^/\s])/;
  if (!allowed.test(value)) {
    throw new Error(
      `NEXT_PUBLIC_MEDIA_BASE_URL must be empty, a path like "/media" or a full https:// URL, got "${value}"`,
    );
  }
}
checkMediaBaseUrl(process.env.NEXT_PUBLIC_MEDIA_BASE_URL);

const nextConfig: NextConfig = {
  // A second dev server (the family-code e2e run) needs its own build folder:
  // two servers cannot share one.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  allowedDevOrigins: PRIVATE_LAN_ORIGINS,
  async headers() {
    // A private family app: no search engine indexes any page or file.
    return [
      {
        source: "/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
