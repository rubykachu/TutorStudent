import { readdirSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";

// The Gemini API keys this machine may use, and how one request picks a key.
// Keys are read from the environment (GEMINI_API_KEY, one key, wins when set)
// or from every `api_key*` file in ~/.config/gemini/ (api_key, api_key_2,
// api_key_3, ...), so another key is one more file. Requests take the keys in
// turn; a key that hits a rate limit rests for the time the API asks while
// the others carry on; a key that hit its daily quota rests for the run.

export const KEY_DIR = path.join(os.homedir(), ".config", "gemini");
const KEY_FILE = /^api_key(_\d+)?$/;

// Key files in a stable order: `api_key`, then `api_key_2`, `api_key_3`, ...
function keyFiles(dir: string): string[] {
  const rank = (name: string) => Number(name.match(/_(\d+)$/)?.[1] ?? 1);
  return readdirSync(dir)
    .filter((name) => KEY_FILE.test(name))
    .sort((a, b) => rank(a) - rank(b));
}

export function readKeys(
  env: Record<string, string | undefined> = process.env,
  dir: string = KEY_DIR,
): string[] {
  const fromEnv = env.GEMINI_API_KEY?.trim();
  if (fromEnv) return [fromEnv];
  let files: string[] = [];
  try {
    files = keyFiles(dir);
  } catch {
    // reported below
  }
  const keys = files
    .map((name) => readFileSync(path.join(dir, name), "utf8").trim())
    .filter(Boolean);
  if (keys.length === 0) {
    throw new Error(
      `No Gemini API key: set GEMINI_API_KEY or put keys in ${dir}/api_key, api_key_2, ...`,
    );
  }
  return [...new Set(keys)];
}

// Every key is out of quota for the run (or the API kept failing): the build
// stops and is run again later; it never switches to another voice.
export class GeminiQuotaError extends Error {}

export type RawResponse = { status: number; body: string };

export type Clock = {
  now(): number;
  sleep(ms: number): Promise<void>;
};

export const SYSTEM_CLOCK: Clock = {
  now: () => Date.now(),
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};

// Seconds the API asks to wait before retrying, from its error body.
export function retryAfterS(body: string): number | undefined {
  const match = body.match(/"retryDelay":\s*"(\d+(?:\.\d+)?)s"/);
  return match ? Number(match[1]) : undefined;
}

// A rate limit that will not clear within the run: the per-day quota.
export function isDailyLimit(body: string): boolean {
  return body.includes("PerDay");
}

// Wait when the API gives no delay, doubling per consecutive limit.
const BASE_BACKOFF_S = 5;
const MAX_BACKOFF_S = 60;
// Times the whole pool may rest in one request before the build gives up (the
// narration build then reads with its fallback voice).
const MAX_POOL_WAITS = 3;
// Retries of a transient server error (500, 503) per request.
const MAX_SERVER_RETRIES = 3;

export class KeyPool {
  private cursor = 0;
  // Key index -> time (ms) it may be used again; Infinity for the run.
  private restingUntil = new Map<number, number>();
  private limits = new Map<number, number>();

  constructor(
    readonly keys: readonly string[],
    private readonly clock: Clock = SYSTEM_CLOCK,
  ) {
    if (keys.length === 0) throw new Error("KeyPool needs at least one key");
  }

  // The next key in turn that is not resting, or undefined.
  take(): { index: number; key: string } | undefined {
    const now = this.clock.now();
    for (let i = 0; i < this.keys.length; i++) {
      const index = (this.cursor + i) % this.keys.length;
      if ((this.restingUntil.get(index) ?? 0) <= now) {
        this.cursor = (index + 1) % this.keys.length;
        return { index, key: this.keys[index] as string };
      }
    }
    return undefined;
  }

  succeeded(index: number): void {
    this.limits.delete(index);
  }

  // The key hit a limit: rest it for the API's delay, or a doubling backoff;
  // for the rest of the run when it is the daily quota.
  limited(index: number, body: string): void {
    if (isDailyLimit(body)) {
      this.restingUntil.set(index, Number.POSITIVE_INFINITY);
      return;
    }
    const count = (this.limits.get(index) ?? 0) + 1;
    this.limits.set(index, count);
    const backoff = Math.min(MAX_BACKOFF_S, BASE_BACKOFF_S * 2 ** (count - 1));
    const seconds = retryAfterS(body) ?? backoff;
    this.restingUntil.set(index, this.clock.now() + (seconds + 1) * 1000);
  }

  // Milliseconds until the first resting key is free again, or undefined
  // when every key is out for the run.
  waitMs(): number | undefined {
    const free = this.keys.map((_, i) => this.restingUntil.get(i) ?? 0);
    const soonest = Math.min(...free);
    return Number.isFinite(soonest)
      ? Math.max(0, soonest - this.clock.now())
      : undefined;
  }
}

// Sends one request with the pool's keys: each attempt uses the next key; a
// 429 rests that key and moves on to another at once; when every key rests,
// waits for the first to be free again. Stops with GeminiQuotaError when no
// key can serve the request any more.
export async function sendWithKeys(
  pool: KeyPool,
  send: (key: string) => Promise<RawResponse>,
  options: { clock?: Clock; log?: (message: string) => void } = {},
): Promise<string> {
  const clock = options.clock ?? SYSTEM_CLOCK;
  const log = options.log ?? ((message) => console.log(message));
  let poolWaits = 0;
  let serverRetries = 0;
  for (;;) {
    const taken = pool.take();
    if (!taken) {
      const wait = pool.waitMs();
      if (wait === undefined || poolWaits >= MAX_POOL_WAITS) {
        throw new GeminiQuotaError(
          `Gemini quota is used up on all ${pool.keys.length} key(s). Run the build again later with the same voice: finished sentences are cached.`,
        );
      }
      poolWaits++;
      log(
        `gemini: every key is rate limited, waiting ${Math.ceil(wait / 1000)}s`,
      );
      await clock.sleep(wait);
      continue;
    }
    const response = await send(taken.key);
    if (response.status >= 200 && response.status < 300) {
      pool.succeeded(taken.index);
      return response.body;
    }
    if (response.status === 429) {
      pool.limited(taken.index, response.body);
      log(
        `gemini: key ${taken.index + 1}/${pool.keys.length} ${isDailyLimit(response.body) ? "is out of daily quota" : "is rate limited"}, trying another`,
      );
      continue;
    }
    if (response.status >= 500 && serverRetries < MAX_SERVER_RETRIES) {
      serverRetries++;
      await clock.sleep(2000 * 2 ** (serverRetries - 1));
      continue;
    }
    throw new Error(
      `Gemini TTS failed (${response.status}):\n${response.body.slice(0, 1000)}`,
    );
  }
}
