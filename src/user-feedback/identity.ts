import { hmacSign } from "@/access/hmac";

// Who and what sent a report, in the coarse form a report may carry.

// The household pseudonym: the first 12 hex of HMAC-SHA256 of the family id
// under the session key, with its own prefix so it never equals a value the
// cookie signs. Still personal data in the legal sense (the key links it back
// to a household), so it is never logged.
export async function familyPseudonym(
  sessionSecret: string,
  familyId: string,
): Promise<string> {
  const signature = await hmacSign(
    sessionSecret,
    `feedback-family:${familyId}`,
  );
  return Array.from(signature.slice(0, 6), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

// The deployed commit, first 7 characters of `APP_COMMIT_SHA` (set by
// `pnpm deploy:prod`), or `dev` when unset.
export function appVersion(
  env: Record<string, string | undefined> = process.env,
): string {
  const sha = (env.APP_COMMIT_SHA ?? "").trim().toLowerCase();
  return /^[0-9a-f]{7,40}$/.test(sha) ? sha.slice(0, 7) : "dev";
}
