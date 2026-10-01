import { ACCESS_SESSION_DAYS } from "@/lib/config";

// The cookie value proving a device unlocked the app:
// `v1.<expiry, unix seconds>.<code fingerprint>.<signature>`.
// The fingerprint is a keyed hash of the code that was entered, so removing
// that code from `FAMILY_CODES` stops its cookies while other families keep
// theirs, and changing `SESSION_SECRET` stops every cookie. The cookie never
// holds the code itself. Web Crypto only, so it runs in the proxy and in
// route handlers alike.

const VERSION = "v1";
const encoder = new TextEncoder();

async function hmacKey(secret: string, usage: "sign" | "verify") {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    [usage],
  );
}

function toBytes(text: string): ArrayBuffer {
  const bytes = encoder.encode(text);
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

function base64Url(buffer: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(buffer)) {
    binary += String.fromCharCode(byte);
  }
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

async function sign(secret: string, message: string): Promise<ArrayBuffer> {
  return crypto.subtle.sign(
    "HMAC",
    await hmacKey(secret, "sign"),
    toBytes(message),
  );
}

// A keyed hash of a normalised code: stable for the same code and secret.
export async function codeFingerprint(
  secret: string,
  normalizedCode: string,
): Promise<string> {
  const digest = new Uint8Array(
    await sign(secret, `family-code:${normalizedCode}`),
  );
  return Array.from(digest.slice(0, 8), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

export function sessionMaxAgeSeconds(): number {
  return ACCESS_SESSION_DAYS * 24 * 60 * 60;
}

export async function issueSessionToken(
  secret: string,
  normalizedCode: string,
  nowMs: number = Date.now(),
): Promise<string> {
  const expires = Math.floor(nowMs / 1000) + sessionMaxAgeSeconds();
  const fingerprint = await codeFingerprint(secret, normalizedCode);
  const payload = `${VERSION}.${expires}.${fingerprint}`;
  return `${payload}.${base64Url(await sign(secret, payload))}`;
}

// True when the token is signed with `secret`, not expired, and made from one
// of the codes still in `normalizedCodes`.
export async function verifySessionToken(
  secret: string,
  normalizedCodes: readonly string[],
  token: string | undefined,
  nowMs: number = Date.now(),
): Promise<boolean> {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== VERSION) return false;
  const [, expiresText, fingerprint, signature] = parts;
  const signatureBytes = fromBase64Url(signature);
  if (!signatureBytes) return false;
  const valid = await crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret, "verify"),
    signatureBytes,
    toBytes(`${VERSION}.${expiresText}.${fingerprint}`),
  );
  if (!valid) return false;
  const expires = Number(expiresText);
  if (!Number.isFinite(expires) || expires * 1000 <= nowMs) return false;
  for (const code of normalizedCodes) {
    if ((await codeFingerprint(secret, code)) === fingerprint) return true;
  }
  return false;
}
