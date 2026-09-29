// FNV-1a: a stable 32-bit seed from an exercise id.
function hashSeed(text: string): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

// mulberry32: tiny seeded PRNG, good enough to scramble a handful of items.
function random(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The same exercise always starts from the same scramble (server and client
// render agree, and a retype starts where the first try did), and never from
// the solved order, which would be a free answer.
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const next = random(hashSeed(seed));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  const unchanged = out.every((item, index) => item === items[index]);
  // Rotating by one moves every item when all items are distinct.
  return unchanged && out.length > 1 ? [...out.slice(1), out[0]] : out;
}
