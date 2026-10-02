import { createHash } from "node:crypto";

// An ETag derived from the body (server-side stores only).
export function stableHash(body: string): string {
  return createHash("sha256").update(body).digest("hex").slice(0, 32);
}
