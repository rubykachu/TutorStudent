import {
  ACCESS_MIN_CODE_LENGTH,
  ACCESS_MIN_SECRET_LENGTH,
  FAMILY_ID_PATTERN,
} from "@/lib/config";
import { normalizeCode } from "./code";

// What the server environment says about the family-code gate.
// - `open`: no codes and not a production server (local dev, tests): no gate.
// - `gate`: codes and secret are valid: every page and file needs the cookie.
// - `closed`: production without a valid setup, or a half-set one: nothing is
//   served, so a missing variable can never leave the app open to anyone.
export type AccessConfig =
  | { mode: "open" }
  | {
      mode: "gate";
      secret: string;
      // Every accepted code, normalised, each once.
      codes: string[];
      // The family id of each code that was written as `<familyId>:<code>`; a
      // code written bare opens the gate but names no family.
      families: ReadonlyMap<string, string>;
    }
  | { mode: "closed"; reason: string };

type Env = Record<string, string | undefined>;

export type FamilyCodeEntry = { familyId: string | null; code: string };

// `FAMILY_CODES`: comma-separated entries, `<familyId>:<code>` or a bare
// `<code>`. The entry is split at its first `:` before the code is
// normalised, so a code keeps its fingerprint (and every cookie issued for it
// stays valid) when it gains a family id. Returns the entries, or the reason
// the list cannot be used. A family may have several entries; one code under
// two family ids is refused, because a cookie must resolve to one family.
export function parseFamilyCodes(
  raw: string | undefined,
): { entries: FamilyCodeEntry[] } | { error: string } {
  const entries: FamilyCodeEntry[] = [];
  const owner = new Map<string, string | null>();
  for (const text of (raw ?? "").split(",")) {
    const colon = text.indexOf(":");
    const name = colon < 0 ? null : text.slice(0, colon).trim();
    const code = normalizeCode(colon < 0 ? text : text.slice(colon + 1));
    if (name === null && code.length === 0) continue;
    if (name !== null && !FAMILY_ID_PATTERN.test(name)) {
      return {
        error: `every family name in FAMILY_CODES must match ${FAMILY_ID_PATTERN}`,
      };
    }
    if (code.length > 0 && name !== null) {
      const known = owner.get(code);
      if (known != null && known !== name) {
        return { error: "one family code is listed under two family names" };
      }
    }
    // A named entry wins over the same code listed bare.
    if (name !== null || !owner.has(code)) owner.set(code, name);
    entries.push({ familyId: name, code });
  }
  return { entries };
}

// `FAMILY_CODES` (see `parseFamilyCodes`). `SESSION_SECRET`: signs the cookie.
export function readAccessConfig(
  env: Env = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): AccessConfig {
  const parsed = parseFamilyCodes(env.FAMILY_CODES);
  if ("error" in parsed) return { mode: "closed", reason: parsed.error };
  const rawCodes = parsed.entries.map((entry) => entry.code);
  const secret = env.SESSION_SECRET ?? "";

  if (rawCodes.length === 0 && secret === "") {
    return nodeEnv === "production"
      ? {
          mode: "closed",
          reason: "FAMILY_CODES and SESSION_SECRET are not set",
        }
      : { mode: "open" };
  }
  if (rawCodes.length === 0) {
    return { mode: "closed", reason: "FAMILY_CODES is not set" };
  }
  if (secret.length < ACCESS_MIN_SECRET_LENGTH) {
    return {
      mode: "closed",
      reason: `SESSION_SECRET needs at least ${ACCESS_MIN_SECRET_LENGTH} characters`,
    };
  }
  if (rawCodes.some((code) => code.length < ACCESS_MIN_CODE_LENGTH)) {
    return {
      mode: "closed",
      reason: `every family code needs at least ${ACCESS_MIN_CODE_LENGTH} characters (spaces and dashes do not count)`,
    };
  }
  const families = new Map<string, string>();
  for (const { familyId, code } of parsed.entries) {
    if (familyId !== null) families.set(code, familyId);
  }
  return { mode: "gate", secret, codes: [...new Set(rawCodes)], families };
}
