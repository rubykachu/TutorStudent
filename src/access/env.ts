import { ACCESS_MIN_SECRET_LENGTH } from "@/lib/config";
import { normalizeFamilyId } from "./code";

// What the server environment says about the family-code gate.
// - `open`: no secret and not a production server (local dev, tests): no gate.
// - `gate`: both secrets are valid: every page and file needs the cookie.
// - `closed`: production without a valid setup, or a half-set one: nothing is
//   served, so a missing variable can never leave the app open to anyone.
export type GateConfig = {
  mode: "gate";
  // Signs the `tutor_family` cookie.
  sessionSecret: string;
  // Signs the family codes (`src/access/code.ts`).
  codeSecret: string;
  // Family ids whose codes and cookies no longer open the app.
  revoked: ReadonlySet<string>;
};

export type AccessConfig =
  | { mode: "open" }
  | GateConfig
  | { mode: "closed"; reason: string };

type Env = Record<string, string | undefined>;

// `FAMILY_CODE_SECRET`, the key every family code is signed with. Read here
// for the server, the code generator and the deploy smoke check alike.
export function readFamilyCodeSecret(
  env: Env,
): { secret: string } | { error: string } {
  const secret = env.FAMILY_CODE_SECRET ?? "";
  if (secret === "") return { error: "FAMILY_CODE_SECRET is not set" };
  if (secret.length < ACCESS_MIN_SECRET_LENGTH) {
    return {
      error: `FAMILY_CODE_SECRET needs at least ${ACCESS_MIN_SECRET_LENGTH} characters`,
    };
  }
  return { secret };
}

// `FAMILY_CODES_REVOKED`: comma-separated family ids, any case. One entry that
// is not a family id makes the whole list unusable, so a typo never leaves a
// family that was meant to be cut off still able to enter.
export function parseRevokedFamilies(
  raw: string | undefined,
): { ids: string[] } | { error: string } {
  const ids = new Set<string>();
  for (const text of (raw ?? "").split(",")) {
    if (text.trim() === "") continue;
    const id = normalizeFamilyId(text);
    if (id === null) {
      return {
        error: "every entry of FAMILY_CODES_REVOKED must be a family id",
      };
    }
    ids.add(id);
  }
  return { ids: [...ids] };
}

// `SESSION_SECRET` signs the cookie and `FAMILY_CODE_SECRET` the codes, each
// at least ACCESS_MIN_SECRET_LENGTH characters and not the same text, so the
// cookie key can be changed without changing every family's code.
export function readAccessConfig(
  env: Env = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): AccessConfig {
  const sessionSecret = env.SESSION_SECRET ?? "";
  const codeSecretSet = (env.FAMILY_CODE_SECRET ?? "") !== "";

  if (sessionSecret === "" && !codeSecretSet) {
    return nodeEnv === "production"
      ? {
          mode: "closed",
          reason: "FAMILY_CODE_SECRET and SESSION_SECRET are not set",
        }
      : { mode: "open" };
  }
  const code = readFamilyCodeSecret(env);
  if ("error" in code) return { mode: "closed", reason: code.error };
  if (sessionSecret === "") {
    return { mode: "closed", reason: "SESSION_SECRET is not set" };
  }
  if (sessionSecret.length < ACCESS_MIN_SECRET_LENGTH) {
    return {
      mode: "closed",
      reason: `SESSION_SECRET needs at least ${ACCESS_MIN_SECRET_LENGTH} characters`,
    };
  }
  if (sessionSecret === code.secret) {
    return {
      mode: "closed",
      reason: "FAMILY_CODE_SECRET must differ from SESSION_SECRET",
    };
  }
  const revoked = parseRevokedFamilies(env.FAMILY_CODES_REVOKED);
  if ("error" in revoked) return { mode: "closed", reason: revoked.error };
  return {
    mode: "gate",
    sessionSecret,
    codeSecret: code.secret,
    revoked: new Set(revoked.ids),
  };
}
