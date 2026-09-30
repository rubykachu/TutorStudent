import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  PARENT_PIN_HASH_ITERATIONS,
  PARENT_PIN_LOCK_MINUTES,
  PARENT_PIN_MAX_FAILS,
} from "@/lib/config";
import { DEVICE_SCOPE, getSetting, setSetting, TutorDb } from "@/progress/db";
import {
  afterWrongPin,
  hashPin,
  isLocked,
  isValidPin,
  NO_LOCK,
  PARENT_PIN_KEY,
  PARENT_PIN_LOCK_KEY,
  readPinState,
  savePin,
  tryUnlock,
  verifyPin,
} from "@/progress/parent-pin";

const MINUTE = 60_000;
const START = new Date("2026-09-30T02:00:00Z");
const at = (minutes: number) => new Date(START.getTime() + minutes * MINUTE);
// Low round count for the pure hash tests; the stored PIN uses the config.
const FAST = 10;
const SALT = new Uint8Array(16).fill(7);

describe("isValidPin", () => {
  it("accepts 4 to 6 digits only", () => {
    expect(isValidPin("1234")).toBe(true);
    expect(isValidPin("123456")).toBe(true);
    expect(isValidPin("123")).toBe(false);
    expect(isValidPin("1234567")).toBe(false);
    expect(isValidPin("12a4")).toBe(false);
    expect(isValidPin(" 1234")).toBe(false);
    expect(isValidPin("")).toBe(false);
  });
});

describe("hashPin and verifyPin", () => {
  it("verifies the same PIN and rejects any other", () => {
    const stored = hashPin("2468", SALT, FAST);
    expect(stored).toEqual({
      salt: "07".repeat(16),
      iterations: FAST,
      hash: expect.stringMatching(/^[0-9a-f]{64}$/),
    });
    expect(verifyPin("2468", stored)).toBe(true);
    expect(verifyPin("2469", stored)).toBe(false);
    expect(verifyPin("24680", stored)).toBe(false);
    expect(verifyPin("abcd", stored)).toBe(false);
  });

  it("never stores the PIN itself and salts every hash", () => {
    const a = hashPin("2468", undefined, FAST);
    const b = hashPin("2468", undefined, FAST);
    expect(JSON.stringify(a)).not.toContain("2468");
    expect(a.salt).not.toBe(b.salt);
    expect(a.hash).not.toBe(b.hash);
    expect(hashPin("2468").iterations).toBe(PARENT_PIN_HASH_ITERATIONS);
  });

  it("refuses to hash an invalid PIN", () => {
    expect(() => hashPin("12", SALT, FAST)).toThrow();
  });
});

describe("the wrong-PIN lock", () => {
  it("counts wrong PINs and locks on the last allowed one", () => {
    let lock = NO_LOCK;
    for (let i = 1; i < PARENT_PIN_MAX_FAILS; i++) {
      lock = afterWrongPin(lock, at(i));
      expect(lock).toEqual({ fails: i, lockedUntil: null });
      expect(isLocked(lock, at(i))).toBe(false);
    }
    lock = afterWrongPin(lock, at(10));
    expect(lock).toEqual({
      fails: 0,
      lockedUntil: at(10 + PARENT_PIN_LOCK_MINUTES).toISOString(),
    });
    expect(isLocked(lock, at(10))).toBe(true);
    expect(isLocked(lock, at(10 + PARENT_PIN_LOCK_MINUTES - 1))).toBe(true);
    expect(isLocked(lock, at(10 + PARENT_PIN_LOCK_MINUTES))).toBe(false);
  });

  it("starts counting again once a lock has passed", () => {
    const expired = { fails: 3, lockedUntil: at(-1).toISOString() };
    expect(afterWrongPin(expired, at(0))).toEqual({
      fails: 4,
      lockedUntil: null,
    });
    const active = { fails: 2, lockedUntil: at(5).toISOString() };
    expect(afterWrongPin(active, at(0))).toEqual({
      fails: 1,
      lockedUntil: null,
    });
  });
});

describe("the stored PIN", () => {
  let db: TutorDb;

  beforeEach(() => {
    db = new TutorDb(`parent-pin-${Math.random()}`);
  });

  afterEach(async () => {
    await db.delete();
  });

  it("has no PIN on a new device", async () => {
    expect(await readPinState(db)).toEqual({ hash: null, lock: NO_LOCK });
    expect(await tryUnlock(db, "1234", START)).toEqual({ status: "no_pin" });
  });

  it("saves the hash in the device settings and unlocks with the PIN", async () => {
    await savePin(db, "1357");
    const raw = await getSetting(db, DEVICE_SCOPE, PARENT_PIN_KEY);
    expect(typeof raw).toBe("string");
    expect(String(raw)).not.toContain("1357");
    expect(await tryUnlock(db, "1357", START)).toEqual({ status: "ok" });
  });

  it("locks after five wrong PINs, even for the right one, until the lock passes", async () => {
    await savePin(db, "1357");
    for (let i = 1; i < PARENT_PIN_MAX_FAILS; i++) {
      expect(await tryUnlock(db, "0000", at(i))).toEqual({
        status: "wrong",
        attemptsLeft: PARENT_PIN_MAX_FAILS - i,
      });
    }
    const until = at(5 + PARENT_PIN_LOCK_MINUTES);
    expect(await tryUnlock(db, "0000", at(5))).toEqual({
      status: "locked",
      until,
    });
    // The lock is stored, so a reload (a fresh read) still sees it.
    expect(isLocked((await readPinState(db)).lock, at(6))).toBe(true);
    expect(await tryUnlock(db, "1357", at(6))).toEqual({
      status: "locked",
      until,
    });
    expect(await tryUnlock(db, "1357", until)).toEqual({ status: "ok" });
    expect((await readPinState(db)).lock).toEqual(NO_LOCK);
  });

  it("clears the wrong-PIN count after a correct PIN", async () => {
    await savePin(db, "1357");
    await tryUnlock(db, "0000", at(1));
    await tryUnlock(db, "0000", at(2));
    await tryUnlock(db, "1357", at(3));
    expect(await tryUnlock(db, "0000", at(4))).toEqual({
      status: "wrong",
      attemptsLeft: PARENT_PIN_MAX_FAILS - 1,
    });
  });

  it("reads damaged settings as not set rather than failing", async () => {
    await setSetting(db, DEVICE_SCOPE, PARENT_PIN_KEY, "{not json");
    await setSetting(db, DEVICE_SCOPE, PARENT_PIN_LOCK_KEY, 42);
    expect(await readPinState(db)).toEqual({ hash: null, lock: NO_LOCK });
    await setSetting(db, DEVICE_SCOPE, PARENT_PIN_KEY, '{"salt":"x"}');
    expect((await readPinState(db)).hash).toBeNull();
  });
});
