import type { NextConfig } from "next";
import { WORKER_PATH } from "./src/offline/config";

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

const YEAR_SECONDS = 365 * 24 * 60 * 60;

// Files of `public/` get `max-age=0` from Next, so every sound and lesson
// file would be asked for again on each load. `private` because every request
// passes the family-code gate: only the child's browser keeps them.
const CACHE_HEADERS = [
  {
    // A clip's URL carries its hash (`soundUrl`), so a changed clip is a new
    // URL and the old one can be kept for good.
    source: "/sounds/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: `private, max-age=${YEAR_SECONDS}, immutable`,
      },
    ],
  },
  {
    // The service worker script is fetched afresh on every update check, so a
    // fixed worker is replaced on the next launch: a cached copy would delay
    // it by the cache's age.
    source: WORKER_PATH,
    headers: [{ key: "Cache-Control", value: "no-cache" }],
  },
  {
    // Lesson files keep their names across builds: served from cache for a
    // minute, then from cache while the browser checks for a new one.
    source: "/content/:path*",
    headers: [
      {
        key: "Cache-Control",
        value: "private, max-age=60, stale-while-revalidate=86400",
      },
    ],
  },
];

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
      ...CACHE_HEADERS,
    ];
  },
};

export default nextConfig;
