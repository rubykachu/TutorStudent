import { createHash, createHmac, pbkdf2Sync } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  equalBytes,
  fromHex,
  hmacSha256,
  pbkdf2Sha256,
  sha256,
  toHex,
} from "@/progress/parent-crypto";

const text = (s: string) => new TextEncoder().encode(s);

function bytes(length: number, seed: number): Uint8Array {
  return Uint8Array.from({ length }, (_, i) => (i * 31 + seed * 7) & 0xff);
}

describe("sha256", () => {
  it("matches the FIPS 180-2 test vectors", () => {
    expect(toHex(sha256(text("")))).toBe(
      "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    );
    expect(toHex(sha256(text("abc")))).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
    expect(
      toHex(
        sha256(
          text("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq"),
        ),
      ),
    ).toBe("248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1");
  });

  it("matches Node's implementation around every padding boundary", () => {
    for (const length of [1, 55, 56, 63, 64, 65, 119, 120, 128, 1000]) {
      const input = bytes(length, length);
      expect(toHex(sha256(input))).toBe(
        createHash("sha256").update(input).digest("hex"),
      );
    }
  });
});

describe("hmacSha256", () => {
  it("matches RFC 4231 test case 2", () => {
    expect(
      toHex(hmacSha256(text("Jefe"), text("what do ya want for nothing?"))),
    ).toBe("5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843");
  });

  it("hashes keys longer than a block first, like Node", () => {
    const key = bytes(131, 3);
    const message = bytes(50, 9);
    expect(toHex(hmacSha256(key, message))).toBe(
      createHmac("sha256", key).update(message).digest("hex"),
    );
  });
});

describe("pbkdf2Sha256", () => {
  it("matches the RFC 7914 PBKDF2-HMAC-SHA256 vector", () => {
    expect(toHex(pbkdf2Sha256(text("passwd"), text("salt"), 1, 64))).toBe(
      "55ac046e56e3089fec1691c22544b605f94185216dde0465e68b9d57c20dacbc49ca9cccf179b645991664b39d77ef317c71b845b1e30bd509112041d3a19783",
    );
  });

  it("matches Node for several rounds and a key that is not a whole block", () => {
    const password = text("123456");
    const salt = bytes(16, 1);
    expect(toHex(pbkdf2Sha256(password, salt, 1000, 40))).toBe(
      pbkdf2Sync(password, salt, 1000, 40, "sha256").toString("hex"),
    );
  });

  it("refuses a round count below one", () => {
    expect(() => pbkdf2Sha256(text("1"), text("s"), 0, 32)).toThrow();
    expect(() => pbkdf2Sha256(text("1"), text("s"), 1.5, 32)).toThrow();
  });
});

describe("hex and comparison helpers", () => {
  it("round-trips bytes through hex", () => {
    const input = bytes(20, 5);
    expect(fromHex(toHex(input))).toEqual(input);
    expect(fromHex("")).toEqual(new Uint8Array());
  });

  it("rejects malformed hex", () => {
    expect(() => fromHex("abc")).toThrow();
    expect(() => fromHex("zz")).toThrow();
  });

  it("compares bytes by value and length", () => {
    expect(equalBytes(fromHex("0102"), fromHex("0102"))).toBe(true);
    expect(equalBytes(fromHex("0102"), fromHex("0103"))).toBe(false);
    expect(equalBytes(fromHex("0102"), fromHex("010203"))).toBe(false);
  });
});
