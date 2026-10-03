import { ACCESS_SESSION_DAYS, FAMILY_ID_PATTERN } from "@/lib/config";
import { codeSignature } from "./code";
import type { AccessConfig, GateConfig } from "./env";
import { hmacSign, hmacVerify, sameText } from "./hmac";

// The cookie value proving a device unlocked the app:
// `v2.<expiry, unix seconds>.<family id>.<code fingerprint>.<signature>`,
// signed with `SESSION_SECRET`. The fingerprint is a keyed hash of the
// family's code signature, so the cookie stops working when the family id is
// put in `FAMILY_CODES_REVOKED`, when `FAMILY_CODE_SECRET` changes (every code
// changes with it) or when `SESSION_SECRET` changes. The cookie never holds
// the code or its signature. Web Crypto only, so it runs in the proxy and in
// route handlers alike.

const VERSION = "v2";

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(text: string): ArrayBuffer | null {
  try {
    const padded = text.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes.buffer;
  } catch {
    return null;
  }
}

// A keyed hash of the family's current code: the same while both secrets
// stay, different once either changes.
async function codeFingerprint(
  config: GateConfig,
  familyId: string,
): Promise<string> {
  const signature = await codeSignature(config.codeSecret, familyId);
  const digest = await hmacSign(
    config.sessionSecret,
    `family-code:${familyId}.${signature}`,
  );
  return Array.from(digest.slice(0, 8), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export function sessionMaxAgeSeconds(): number {
  return ACCESS_SESSION_DAYS * 24 * 60 * 60;
}

export async function issueSessionToken(
  config: GateConfig,
  familyId: string,
  nowMs: number = Date.now(),
): Promise<string> {
  const expires = Math.floor(nowMs / 1000) + sessionMaxAgeSeconds();
  const fingerprint = await codeFingerprint(config, familyId);
  const payload = `${VERSION}.${expires}.${familyId}.${fingerprint}`;
  return `${payload}.${base64Url(await hmacSign(config.sessionSecret, payload))}`;
}

// The family id the cookie was issued to, when the gate is on, the cookie is
// signed with today's secrets, not expired, and its family is not revoked;
// otherwise null. The only source of a family id on the server.
export async function resolveFamily(
  config: AccessConfig,
  token: string | undefined,
  nowMs: number = Date.now(),
): Promise<string | null> {
  if (config.mode !== "gate" || !token) return null;
  const parts = token.split(".");
  if (parts.length !== 5 || parts[0] !== VERSION) return null;
  const [, expiresText, familyId, fingerprint, signature] = parts as [
    string,
    string,
    string,
    string,
    string,
  ];
  const signatureBytes = fromBase64Url(signature);
  if (!signatureBytes) return null;
  const valid = await hmacVerify(
    config.sessionSecret,
    signatureBytes,
    `${VERSION}.${expiresText}.${familyId}.${fingerprint}`,
  );
  if (!valid) return null;
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires * 1000 <= nowMs) return null;
  if (!FAMILY_ID_PATTERN.test(familyId) || config.revoked.has(familyId)) {
    return null;
  }
  const current = await codeFingerprint(config, familyId);
  return sameText(current, fingerprint) ? familyId : null;
}
