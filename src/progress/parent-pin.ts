import { z } from "zod";
import {
  PARENT_PIN_HASH_ITERATIONS,
  PARENT_PIN_LOCK_MINUTES,
  PARENT_PIN_MAX_FAILS,
  PARENT_PIN_MAX_LENGTH,
  PARENT_PIN_MIN_LENGTH,
} from "@/lib/config";
import {
  DEVICE_SCOPE,
  getSetting,
  setSetting,
  type TutorDb,
} from "@/progress/db";
import {
  equalBytes,
  fromHex,
  pbkdf2Sha256,
  toHex,
} from "@/progress/parent-crypto";

// The parent page PIN while progress is local to this device: its hash and
// the wrong-PIN lock live in the device settings, next to the progress they
// guard, so clearing the app's data (the documented "forgot PIN" path) removes
// both together. Once family sync exists the PIN moves to the server.

export const PARENT_PIN_KEY = "parentPin";
export const PARENT_PIN_LOCK_KEY = "parentPinLock";

const SALT_BYTES = 16;
const HASH_BYTES = 32;
const MS_PER_MINUTE = 60_000;

const PIN_PATTERN = new RegExp(
  `^\\d{${PARENT_PIN_MIN_LENGTH},${PARENT_PIN_MAX_LENGTH}}$`,
);

export function isValidPin(pin: string): boolean {
  return PIN_PATTERN.test(pin);
}

// Settings hold scalars, so both records are stored as JSON strings and
// validated on the way back: a damaged value reads as "not set".
const PinHashSchema = z.object({
  salt: z.string().regex(/^[0-9a-f]+$/),
  iterations: z.int().positive(),
  hash: z.string().regex(/^[0-9a-f]+$/),
});
export type PinHash = z.infer<typeof PinHashSchema>;

const PinLockSchema = z.object({
  fails: z.int().nonnegative(),
  lockedUntil: z.iso.datetime().nullable(),
});
export type PinLock = z.infer<typeof PinLockSchema>;

export const NO_LOCK: PinLock = { fails: 0, lockedUntil: null };

const encoder = new TextEncoder();

function derive(pin: string, salt: Uint8Array, iterations: number): Uint8Array {
  return pbkdf2Sha256(encoder.encode(pin), salt, iterations, HASH_BYTES);
}

export function hashPin(
  pin: string,
  salt: Uint8Array = crypto.getRandomValues(new Uint8Array(SALT_BYTES)),
  iterations: number = PARENT_PIN_HASH_ITERATIONS,
): PinHash {
  if (!isValidPin(pin))
    throw new Error(
      `PIN must be ${PARENT_PIN_MIN_LENGTH} to ${PARENT_PIN_MAX_LENGTH} digits`,
    );
  return {
    salt: toHex(salt),
    iterations,
    hash: toHex(derive(pin, salt, iterations)),
  };
}

export function verifyPin(pin: string, stored: PinHash): boolean {
  if (!isValidPin(pin)) return false;
  const actual = derive(pin, fromHex(stored.salt), stored.iterations);
  return equalBytes(actual, fromHex(stored.hash));
}

export function isLocked(lock: PinLock, now: Date): boolean {
  return (
    lock.lockedUntil !== null && Date.parse(lock.lockedUntil) > now.getTime()
  );
}

// A wrong PIN adds to the count; the last allowed one locks the page for
// PARENT_PIN_LOCK_MINUTES and starts the count again for after the lock.
export function afterWrongPin(lock: PinLock, now: Date): PinLock {
  const fails = (isLocked(lock, now) ? 0 : lock.fails) + 1;
  if (fails < PARENT_PIN_MAX_FAILS) return { fails, lockedUntil: null };
  const until = new Date(
    now.getTime() + PARENT_PIN_LOCK_MINUTES * MS_PER_MINUTE,
  );
  return { fails: 0, lockedUntil: until.toISOString() };
}

function parseJson<T>(value: unknown, schema: z.ZodType<T>): T | null {
  if (typeof value !== "string") return null;
  try {
    const parsed = schema.safeParse(JSON.parse(value));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export type PinState = { hash: PinHash | null; lock: PinLock };

export async function readPinState(db: TutorDb): Promise<PinState> {
  const [hash, lock] = await Promise.all([
    getSetting(db, DEVICE_SCOPE, PARENT_PIN_KEY),
    getSetting(db, DEVICE_SCOPE, PARENT_PIN_LOCK_KEY),
  ]);
  return {
    hash: parseJson(hash, PinHashSchema),
    lock: parseJson(lock, PinLockSchema) ?? NO_LOCK,
  };
}

async function writeLock(db: TutorDb, lock: PinLock): Promise<void> {
  await setSetting(db, DEVICE_SCOPE, PARENT_PIN_LOCK_KEY, JSON.stringify(lock));
}

// First visit only: the caller has already had the PIN typed twice.
export async function savePin(db: TutorDb, pin: string): Promise<void> {
  const hash = hashPin(pin);
  await db.transaction("rw", db.settings, async () => {
    await setSetting(db, DEVICE_SCOPE, PARENT_PIN_KEY, JSON.stringify(hash));
    await writeLock(db, NO_LOCK);
  });
}

export type UnlockResult =
  | { status: "ok" }
  | { status: "wrong"; attemptsLeft: number }
  | { status: "locked"; until: Date }
  | { status: "no_pin" };

// Checks a typed PIN against the stored hash and keeps the wrong-PIN count
// on the device, so reloading the page neither resets it nor lifts a lock.
export async function tryUnlock(
  db: TutorDb,
  pin: string,
  now: Date,
): Promise<UnlockResult> {
  const { hash, lock } = await readPinState(db);
  if (!hash) return { status: "no_pin" };
  if (isLocked(lock, now) && lock.lockedUntil) {
    return { status: "locked", until: new Date(lock.lockedUntil) };
  }
  if (verifyPin(pin, hash)) {
    await writeLock(db, NO_LOCK);
    return { status: "ok" };
  }
  const next = afterWrongPin(lock, now);
  await writeLock(db, next);
  if (next.lockedUntil) {
    return { status: "locked", until: new Date(next.lockedUntil) };
  }
  return { status: "wrong", attemptsLeft: PARENT_PIN_MAX_FAILS - next.fails };
}
