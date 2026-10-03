import {
  FAMILY_CODE_ALPHABET,
  FAMILY_CODE_PREFIX,
  FAMILY_CODE_SIGNATURE_LENGTH,
  FAMILY_ID_PATTERN,
  FAMILY_ID_RANDOM_LENGTH,
} from "@/lib/config";
import { hmacSign, sameText } from "./hmac";

// Family codes: `<family id><signature>`, shown as `OWL4K7MQ-9QX2P8RT`.
// The family id is `OWL` plus a random part; the signature is
// HMAC-SHA256(FAMILY_CODE_SECRET, family id), its first 40 bits written in
// FAMILY_CODE_ALPHABET. No list of codes exists anywhere: the server checks a
// code by signing its family id again, and the generator script
// (`scripts/family-code.ts`) uses these same functions, so both always agree.

const ALPHABET_CLASS = `[${FAMILY_CODE_ALPHABET}]`;
const CODE_PATTERN = new RegExp(
  `^(${FAMILY_CODE_PREFIX}${ALPHABET_CLASS}{${FAMILY_ID_RANDOM_LENGTH}})(${ALPHABET_CLASS}{${FAMILY_CODE_SIGNATURE_LENGTH}})$`,
);

// Characters a parent may type between groups: spaces, the ASCII dash and the
// dashes a tablet keyboard puts in its place.
const SEPARATORS = /[\s\-‐-―]+/g;

// A code as the family types it: case, spaces and dashes do not count, and
// after the prefix the letters read like digits (O as 0, I and L as 1) are
// taken as those digits, as Crockford base32 reads them.
export function normalizeCode(input: string): string {
  const compact = input.normalize("NFKC").toUpperCase().replace(SEPARATORS, "");
  if (!compact.startsWith(FAMILY_CODE_PREFIX)) return compact;
  const rest = compact
    .slice(FAMILY_CODE_PREFIX.length)
    .replace(/O/g, "0")
    .replace(/[IL]/g, "1");
  return `${FAMILY_CODE_PREFIX}${rest}`;
}

// A family id as written in a setting or on the command line: case and
// surrounding spaces do not count. Null when it is not a family id.
export function normalizeFamilyId(input: string): string | null {
  const id = input.trim().toUpperCase();
  return FAMILY_ID_PATTERN.test(id) ? id : null;
}

// Bits to characters of FAMILY_CODE_ALPHABET, most significant bit first.
function base32(bytes: Uint8Array, length: number): string {
  let out = "";
  let buffer = 0;
  let bits = 0;
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 5 && out.length < length) {
      bits -= 5;
      out += FAMILY_CODE_ALPHABET[(buffer >> bits) & 31];
    }
    buffer &= (1 << bits) - 1;
    if (out.length === length) break;
  }
  return out;
}

// The signature part of the code of `familyId`.
export async function codeSignature(
  secret: string,
  familyId: string,
): Promise<string> {
  if (!FAMILY_ID_PATTERN.test(familyId)) throw new Error("not a family id");
  return base32(await hmacSign(secret, familyId), FAMILY_CODE_SIGNATURE_LENGTH);
}

// The code of `familyId` in the form handed to a family.
export async function familyCode(
  secret: string,
  familyId: string,
): Promise<string> {
  return `${familyId}-${await codeSignature(secret, familyId)}`;
}

// The family id of a typed code whose signature is right, or null.
export async function verifyFamilyCode(
  secret: string,
  input: string,
): Promise<string | null> {
  const match = CODE_PATTERN.exec(normalizeCode(input));
  if (!match) return null;
  const [, familyId, signature] = match as unknown as [string, string, string];
  const expected = await codeSignature(secret, familyId);
  return sameText(expected, signature) ? familyId : null;
}

// A new family id with a random part from the system's secure random source.
// 256 is a multiple of 32, so taking 5 bits of a byte keeps every character
// equally likely.
export function randomFamilyId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(FAMILY_ID_RANDOM_LENGTH));
  let id = FAMILY_CODE_PREFIX;
  for (const byte of bytes) id += FAMILY_CODE_ALPHABET[byte & 31];
  return id;
}
