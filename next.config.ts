import type { NextConfig } from "next";

// Lets an iPad on the home network load the dev server by LAN IP or mDNS name.
// Each "*" matches exactly one hostname label (one IPv4 octet).
const PRIVATE_LAN_ORIGINS = [
  "10.*.*.*",
  "192.168.*.*",
  ...Array.from({ length: 16 }, (_, i) => `172.${16 + i}.*.*`),
  "*.local",
];

const nextConfig: NextConfig = {
  allowedDevOrigins: PRIVATE_LAN_ORIGINS,
};

export default nextConfig;
