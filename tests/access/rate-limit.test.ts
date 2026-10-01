import { describe, expect, it } from "vitest";
import { FailureLimiter } from "@/access/rate-limit";

const MINUTE = 60_000;

function limiter() {
  const clock = { now: 0 };
  return {
    clock,
    limiter: new FailureLimiter(3, 10 * MINUTE, () => clock.now),
  };
}

describe("FailureLimiter", () => {
  it("locks a client at the last allowed wrong code and says for how long", () => {
    const { limiter: l } = limiter();
    expect(l.fail("a")).toEqual({ locked: false });
    expect(l.fail("a")).toEqual({ locked: false });
    expect(l.fail("a")).toEqual({ locked: true, retryAfterSeconds: 600 });
    expect(l.state("a")).toEqual({ locked: true, retryAfterSeconds: 600 });
  });

  it("counts down and opens again when the lock ends", () => {
    const { clock, limiter: l } = limiter();
    for (let i = 0; i < 3; i++) l.fail("a");
    clock.now = 9 * MINUTE;
    expect(l.state("a")).toEqual({ locked: true, retryAfterSeconds: 60 });
    clock.now = 10 * MINUTE;
    expect(l.state("a")).toEqual({ locked: false });
    // A fresh window: one more wrong code does not lock again.
    expect(l.fail("a")).toEqual({ locked: false });
  });

  it("keeps clients apart", () => {
    const { limiter: l } = limiter();
    for (let i = 0; i < 3; i++) l.fail("a");
    expect(l.state("b")).toEqual({ locked: false });
  });

  it("forgets wrong codes older than the window", () => {
    const { clock, limiter: l } = limiter();
    l.fail("a");
    l.fail("a");
    clock.now = 10 * MINUTE;
    expect(l.fail("a")).toEqual({ locked: false });
    expect(l.fail("a")).toEqual({ locked: false });
  });

  it("clears a client after a right code", () => {
    const { limiter: l } = limiter();
    l.fail("a");
    l.fail("a");
    l.clear("a");
    expect(l.fail("a")).toEqual({ locked: false });
    expect(l.fail("a")).toEqual({ locked: false });
  });
});
