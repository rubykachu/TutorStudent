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
