// HMAC-SHA256 through Web Crypto, shared by the family codes and the session
// cookie. Web Crypto runs in the proxy, in route handlers and in Node scripts
// alike.

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

function toBuffer(text: string): ArrayBuffer {
  const bytes = encoder.encode(text);
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

export async function hmacSign(
  secret: string,
  message: string,
): Promise<Uint8Array> {
  return new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      await hmacKey(secret, "sign"),
      toBuffer(message),
    ),
  );
}

// Checks a full signature in constant time (Web Crypto compares it).
export async function hmacVerify(
  secret: string,
  signature: ArrayBuffer,
  message: string,
): Promise<boolean> {
  return crypto.subtle.verify(
    "HMAC",
    await hmacKey(secret, "verify"),
    signature,
    toBuffer(message),
  );
}

// True when both texts are equal, taking the same time wherever they differ.
export function sameText(a: string, b: string): boolean {
  let diff = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let i = 0; i < length; i++) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}
