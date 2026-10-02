import { canonicalText, type DocKind, type DocOf } from "@/sync/schema";

// cyrb53: a 53-bit non-cryptographic string hash. Sync only needs "did this
// doc change since it was last sent", and `crypto.subtle` does not exist when
// the app is opened over plain http on the local network. A collision delays
// one sync until the next change.
function cyrb53(text: string): number {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    h1 = Math.imul(h1 ^ code, 2654435761);
    h2 = Math.imul(h2 ^ code, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

// 14 hex characters.
export function hashText(text: string): string {
  return cyrb53(text).toString(16).padStart(14, "0");
}

// Hash of a doc's canonical text: equal for two docs holding the same data
// whatever the order of their arrays.
export function docHash<K extends DocKind>(kind: K, doc: DocOf[K]): string {
  return hashText(canonicalText(kind, doc));
}
