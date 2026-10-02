import { afterEach, describe, expect, it } from "vitest";
import {
  getClockOffset,
  now,
  setClockOffset,
  setNowForTesting,
  vnDayKey,
} from "@/lib/time";

describe("now", () => {
  afterEach(() => setNowForTesting(null));

  it("returns the real clock by default", () => {
    const before = Date.now();
    const value = now().getTime();
    expect(value).toBeGreaterThanOrEqual(before);
    expect(value).toBeLessThanOrEqual(Date.now());
  });

  it("returns the test override until it is cleared", () => {
    const fixed = new Date("2026-03-01T00:00:00Z");
    setNowForTesting(() => fixed);
    expect(now()).toBe(fixed);
    setNowForTesting(null);
    expect(now()).not.toBe(fixed);
  });
});

describe("now with a clock offset", () => {
  afterEach(() => {
    setClockOffset(0);
    setNowForTesting(null);
  });

  it("is 0 until a sync measures one", () => {
    expect(getClockOffset()).toBe(0);
  });

  it("adds the offset to the device clock", () => {
    setClockOffset(3_600_000);
    const shifted = now().getTime() - Date.now();
    expect(Math.abs(shifted - 3_600_000)).toBeLessThan(2_000);
    setClockOffset(-60_000);
    expect(Math.abs(now().getTime() - Date.now() + 60_000)).toBeLessThan(2_000);
  });

  it("lets the test override win over the offset", () => {
    const fixed = new Date("2026-03-01T00:00:00Z");
    setClockOffset(3_600_000);
    setNowForTesting(() => fixed);
    expect(now()).toBe(fixed);
  });
});

describe("vnDayKey", () => {
  it("rolls over to the next day at Vietnam midnight, not UTC midnight", () => {
    expect(vnDayKey(new Date("2026-01-01T16:59:59Z"))).toBe("2026-01-01");
    expect(vnDayKey(new Date("2026-01-01T17:00:00Z"))).toBe("2026-01-02");
    expect(vnDayKey(new Date("2026-01-01T17:30:00Z"))).toBe("2026-01-02");
  });

  it("zero-pads month and day", () => {
    expect(vnDayKey(new Date("2026-03-04T03:00:00Z"))).toBe("2026-03-04");
  });
});
