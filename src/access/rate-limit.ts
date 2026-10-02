// Counts wrong codes per client and locks a client out after too many within
// one window. Kept in memory: a serverless instance that restarts forgets it,
// which only means a few more guesses, never a wrong "unlocked".

export type LimitState =
  | { locked: false }
  | { locked: true; retryAfterSeconds: number };

type Entry = { fails: number; windowStart: number; lockedUntil: number };

// Entries kept before stale ones are swept out, so addresses that tried once
// and never came back do not pile up.
const SWEEP_AT = 500;

export class FailureLimiter {
  private readonly entries = new Map<string, Entry>();

  // `maxFails` wrong codes within `windowMs` lock the client for `windowMs`.
  constructor(
    private readonly maxFails: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  state(key: string): LimitState {
    const entry = this.entries.get(key);
    const now = this.now();
    if (!entry || entry.lockedUntil <= now) return { locked: false };
    return {
      locked: true,
      retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
    };
  }

  // Records a wrong code and returns the state after it.
  fail(key: string): LimitState {
    const now = this.now();
    if (this.entries.size >= SWEEP_AT) this.sweep(now);
    const current = this.entries.get(key);
    const fresh = !current || now - current.windowStart >= this.windowMs;
    const fails = fresh ? 1 : current.fails + 1;
    this.entries.set(key, {
      fails,
      windowStart: fresh ? now : current.windowStart,
      lockedUntil: fails >= this.maxFails ? now + this.windowMs : 0,
    });
    return this.state(key);
  }

  clear(key: string): void {
    this.entries.delete(key);
  }

  private sweep(now: number): void {
    for (const [key, entry] of this.entries) {
      if (
        now - entry.windowStart >= this.windowMs &&
        entry.lockedUntil <= now
      ) {
        this.entries.delete(key);
      }
    }
  }
}

export type RateDecision =
  | { allowed: true }
  | { allowed: false; retryAfterSeconds: number };

type Window = { count: number; start: number };

// Allows `max` requests per key within each `windowMs` window (counting every
// request, not only failures). Kept in memory like `FailureLimiter`: it slows
// a runaway client down on one instance; it is not a shared quota.
export class RequestLimiter {
  private readonly windows = new Map<string, Window>();

  constructor(
    private readonly max: number,
    private readonly windowMs: number,
    private readonly now: () => number = Date.now,
  ) {}

  // Counts one request for `key` and says whether it is within the limit.
  hit(key: string): RateDecision {
    const now = this.now();
    if (this.windows.size >= SWEEP_AT) this.sweep(now);
    const current = this.windows.get(key);
    const window =
      current && now - current.start < this.windowMs
        ? current
        : { count: 0, start: now };
    window.count += 1;
    this.windows.set(key, window);
    if (window.count <= this.max) return { allowed: true };
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((window.start + this.windowMs - now) / 1000),
      ),
    };
  }

  private sweep(now: number): void {
    for (const [key, window] of this.windows) {
      if (now - window.start >= this.windowMs) this.windows.delete(key);
    }
  }
}
