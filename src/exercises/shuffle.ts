// FNV-1a: a stable 32-bit number from a seed string.
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

// Seed for one attempt at an exercise. The nonce is made fresh for every
// attempt, so the same exercise asked again shows a new arrangement, while
// every render within one attempt (tiers, retype) shows the same one.
export function attemptSeed(exerciseId: string, nonce: string): string {
  return `${exerciseId}#${nonce}`;
}

export type ShuffleOptions<T> = {
  // What the child sees of an item; two items with the same key look the
  // same, so swapping them does not count as a change. Defaults to the item.
  key?: (item: T) => unknown;
  // Further arrangements to avoid, e.g. match pairs lined up row by row.
  accept?: (arrangement: readonly T[]) => boolean;
};

// Scrambles answer items so their authored position gives nothing away:
// content authors list the correct option first, match pairs side by side and
// order items solved. The result depends only on the seed, and never looks
// like the authored order when two or more items differ.
export function seededShuffle<T>(
  items: readonly T[],
  seed: string,
  { key = (item) => item, accept = () => true }: ShuffleOptions<T> = {},
): T[] {
  const next = random(hashSeed(seed));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  if (out.length < 2) return out;

  const authored = items.map(key);
  const looksAuthored = (arrangement: readonly T[]) =>
    arrangement.every((item, index) => Object.is(key(item), authored[index]));
  // Rotations of the scramble: at most one of them looks authored, and at
  // most one puts a given item at a given row, so a rejected scramble has an
  // acceptable rotation whenever there are three items or more.
  let fallback: T[] | null = null;
  for (let shift = 0; shift < out.length; shift++) {
    const rotated = [...out.slice(shift), ...out.slice(0, shift)];
    if (looksAuthored(rotated)) continue;
    if (accept(rotated)) return rotated;
    fallback ??= rotated;
  }
  // All items look alike, or no arrangement passes `accept`: not looking
  // authored wins over `accept`.
  return fallback ?? out;
}
