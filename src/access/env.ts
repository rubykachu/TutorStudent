import { ACCESS_MIN_CODE_LENGTH, ACCESS_MIN_SECRET_LENGTH } from "@/lib/config";
import { normalizeCode } from "./code";

// What the server environment says about the family-code gate.
// - `open`: no codes and not a production server (local dev, tests): no gate.
// - `gate`: codes and secret are valid: every page and file needs the cookie.
// - `closed`: production without a valid setup, or a half-set one: nothing is
//   served, so a missing variable can never leave the app open to anyone.
export type AccessConfig =
  | { mode: "open" }
  | { mode: "gate"; secret: string; codes: string[] }
  | { mode: "closed"; reason: string };

type Env = Record<string, string | undefined>;

// `FAMILY_CODES`: comma-separated codes, one per family (adding or removing
// one never touches the others). `SESSION_SECRET`: signs the cookie.
export function readAccessConfig(
  env: Env = process.env,
  nodeEnv: string | undefined = process.env.NODE_ENV,
): AccessConfig {
  const rawCodes = (env.FAMILY_CODES ?? "")
    .split(",")
    .map((code) => normalizeCode(code))
    .filter((code) => code.length > 0);
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
  return { mode: "gate", secret, codes: [...new Set(rawCodes)] };
}
