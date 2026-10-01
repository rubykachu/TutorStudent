// A family code as the family types it: "Sao-Bien 4k7m" and "saobien4k7m" are
// the same code, so a tablet keyboard that capitalises the first letter or a
// parent who reads it out with dashes never causes a wrong code.
export function normalizeCode(input: string): string {
  return input
    .normalize("NFC")
    .toLowerCase()
    .replace(/[\s-]+/g, "");
}

// The normalised code among `normalizedCodes` that `input` matches, if any.
export function matchCode(
  normalizedInput: string,
  normalizedCodes: readonly string[],
): string | null {
  let found: string | null = null;
  for (const code of normalizedCodes) {
    // Every code is compared, so the time taken does not say which one is near.
    if (sameText(code, normalizedInput)) found = code;
  }
  return found;
}

function sameText(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
