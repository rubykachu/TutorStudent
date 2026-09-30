// SHA-256, HMAC-SHA256 and PBKDF2-HMAC-SHA256 in plain TypeScript.
//
// WebCrypto's `crypto.subtle` exists only in secure contexts (https or
// localhost), and the app is also opened over plain http on the home LAN, so
// the parent PIN hash cannot rely on it. One implementation is used everywhere
// so a PIN set on one origin verifies the same way on every other.

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const INITIAL_STATE = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c,
  0x1f83d9ab, 0x5be0cd19,
];

const BLOCK_BYTES = 64;
const DIGEST_BYTES = 32;

function rotr(x: number, n: number): number {
  return (x >>> n) | (x << (32 - n));
}

// Runs the compression function over every 64-byte block of `data`, which
// must already be padded to a whole number of blocks.
// Message schedule scratch space, reused: the hash is synchronous.
const w = new Uint32Array(64);

function compress(state: Uint32Array, data: Uint8Array): void {
  for (let offset = 0; offset < data.length; offset += BLOCK_BYTES) {
    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4;
      w[i] =
        ((data[j] ?? 0) << 24) |
        ((data[j + 1] ?? 0) << 16) |
        ((data[j + 2] ?? 0) << 8) |
        (data[j + 3] ?? 0);
    }
    for (let i = 16; i < 64; i++) {
      const w15 = w[i - 15] ?? 0;
      const w2 = w[i - 2] ?? 0;
      const s0 = rotr(w15, 7) ^ rotr(w15, 18) ^ (w15 >>> 3);
      const s1 = rotr(w2, 17) ^ rotr(w2, 19) ^ (w2 >>> 10);
      w[i] = ((w[i - 16] ?? 0) + s0 + (w[i - 7] ?? 0) + s1) | 0;
    }
    let a = state[0] ?? 0;
    let b = state[1] ?? 0;
    let c = state[2] ?? 0;
    let d = state[3] ?? 0;
    let e = state[4] ?? 0;
    let f = state[5] ?? 0;
    let g = state[6] ?? 0;
    let h = state[7] ?? 0;
    for (let i = 0; i < 64; i++) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + s1 + ch + (K[i] ?? 0) + (w[i] ?? 0)) | 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) | 0;
      h = g;
      g = f;
      f = e;
      e = (d + t1) | 0;
      d = c;
      c = b;
      b = a;
      a = (t1 + t2) | 0;
    }
    state[0] = (state[0] ?? 0) + a;
    state[1] = (state[1] ?? 0) + b;
    state[2] = (state[2] ?? 0) + c;
    state[3] = (state[3] ?? 0) + d;
    state[4] = (state[4] ?? 0) + e;
    state[5] = (state[5] ?? 0) + f;
    state[6] = (state[6] ?? 0) + g;
    state[7] = (state[7] ?? 0) + h;
  }
}

export function sha256(message: Uint8Array): Uint8Array {
  return finish(new Uint32Array(INITIAL_STATE), 0, message);
}

// Hashes `message` on from `state`, which has already absorbed `prefixBytes`
// bytes (whole blocks), and returns the digest. `state` is consumed.
function finish(
  state: Uint32Array,
  prefixBytes: number,
  message: Uint8Array,
): Uint8Array {
  // Message, a 0x80 byte, zero padding, then the total bit length as 64 bits.
  const paddedLength =
    Math.ceil((message.length + 9) / BLOCK_BYTES) * BLOCK_BYTES;
  const padded = new Uint8Array(paddedLength);
  padded.set(message);
  padded[message.length] = 0x80;
  const view = new DataView(padded.buffer);
  const bits = (prefixBytes + message.length) * 8;
  view.setUint32(paddedLength - 8, Math.floor(bits / 2 ** 32));
  view.setUint32(paddedLength - 4, bits >>> 0);

  compress(state, padded);
  const digest = new Uint8Array(DIGEST_BYTES);
  const out = new DataView(digest.buffer);
  state.forEach((word, i) => {
    out.setUint32(i * 4, word);
  });
  return digest;
}

function concat(...parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

// HMAC under one key. The padded key blocks are absorbed once up front, so
// every message after that costs two compressions fewer, which halves the
// work of a PBKDF2 round.
function keyedHmac(key: Uint8Array): (message: Uint8Array) => Uint8Array {
  const block = new Uint8Array(BLOCK_BYTES);
  block.set(key.length > BLOCK_BYTES ? sha256(key) : key);
  const inner = new Uint32Array(INITIAL_STATE);
  const outer = new Uint32Array(INITIAL_STATE);
  compress(
    inner,
    block.map((byte) => byte ^ 0x36),
  );
  compress(
    outer,
    block.map((byte) => byte ^ 0x5c),
  );
  return (message) =>
    finish(
      outer.slice(),
      BLOCK_BYTES,
      finish(inner.slice(), BLOCK_BYTES, message),
    );
}

export function hmacSha256(key: Uint8Array, message: Uint8Array): Uint8Array {
  return keyedHmac(key)(message);
}

// RFC 8018 PBKDF2 with HMAC-SHA256 as the pseudo-random function.
export function pbkdf2Sha256(
  password: Uint8Array,
  salt: Uint8Array,
  iterations: number,
  keyLength: number,
): Uint8Array {
  if (!Number.isInteger(iterations) || iterations < 1) {
    throw new Error(
      `PBKDF2 needs a positive iteration count, not ${iterations}`,
    );
  }
  const prf = keyedHmac(password);
  const key = new Uint8Array(keyLength);
  const blocks = Math.ceil(keyLength / DIGEST_BYTES);
  for (let index = 1; index <= blocks; index++) {
    const counter = new Uint8Array(4);
    new DataView(counter.buffer).setUint32(0, index);
    let u = prf(concat(salt, counter));
    const t = u.slice();
    for (let i = 1; i < iterations; i++) {
      u = prf(u);
      for (let j = 0; j < DIGEST_BYTES; j++) t[j] = (t[j] ?? 0) ^ (u[j] ?? 0);
    }
    key.set(
      t.subarray(
        0,
        Math.min(DIGEST_BYTES, keyLength - (index - 1) * DIGEST_BYTES),
      ),
      (index - 1) * DIGEST_BYTES,
    );
  }
  return key;
}

export function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

export function fromHex(hex: string): Uint8Array {
  if (!/^(?:[0-9a-f]{2})*$/i.test(hex)) {
    throw new Error("Expected an even-length hex string");
  }
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

// Compares every byte even after a mismatch, so timing says nothing about
// how much of a guess was right.
export function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}
