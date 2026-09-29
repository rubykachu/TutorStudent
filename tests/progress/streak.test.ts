import { describe, expect, it } from "vitest";
import { vnDayKey } from "@/lib/time";
import { computeStreak } from "@/progress/streak";

// 2026-09-28 is a Monday; weeks run Monday–Sunday.
const MON = "2026-09-28";
const TUE = "2026-09-29";
const WED = "2026-09-30";
const THU = "2026-10-01";
const FRI = "2026-10-02";
const SAT = "2026-10-03";
const SUN = "2026-10-04";
const PREV_SAT = "2026-09-26";
const PREV_SUN = "2026-09-27";
const NEXT_MON = "2026-10-05";

describe("computeStreak", () => {
  it("is empty before the child ever studies", () => {
    expect(computeStreak([], WED)).toEqual({
      days: 0,
      studiedToday: false,
      restDaysLeft: 1,
    });
  });

  it("counts consecutive study days ending today", () => {
    expect(computeStreak([MON, TUE, WED], WED)).toEqual({
      days: 3,
      studiedToday: true,
      restDaysLeft: 1,
    });
  });

  it("keeps the streak while today is not studied yet", () => {
    expect(computeStreak([MON, TUE], WED)).toEqual({
      days: 2,
      studiedToday: false,
      restDaysLeft: 1,
    });
  });

  it("bridges one missed day per week with the rest day", () => {
    expect(computeStreak([MON, WED, THU], THU)).toEqual({
      days: 3,
      studiedToday: true,
      restDaysLeft: 0,
    });
  });

  it("uses the rest day for yesterday while today is still open", () => {
    expect(computeStreak([MON, TUE], THU)).toEqual({
      days: 2,
      studiedToday: false,
      restDaysLeft: 0,
    });
  });

  it("breaks on a second missed day in the same week", () => {
    expect(computeStreak([MON, WED, FRI], FRI).days).toBe(2);
    expect(computeStreak([MON, TUE], FRI).days).toBe(0);
  });

  it("gives every week its own rest day when crossing weeks", () => {
    // Saturday missed last week, Tuesday missed this week.
    const days = [PREV_SUN, MON, WED, THU, FRI, SAT, SUN];
    expect(computeStreak(["2026-09-25", ...days], SUN)).toEqual({
      days: 8,
      studiedToday: true,
      restDaysLeft: 0,
    });
    // A new week starts with a fresh rest day.
    expect(computeStreak(days, NEXT_MON)).toEqual({
      days: 7,
      studiedToday: false,
      restDaysLeft: 1,
    });
  });

  it("bridges two missed days in a row when they fall in different weeks", () => {
    expect(computeStreak([PREV_SAT, TUE], TUE).days).toBe(2);
  });

  it("follows Vietnam midnight, not UTC", () => {
    // 23:30 in Vietnam on Tuesday is still Tuesday there (16:30 UTC).
    const lateTuesday = vnDayKey(new Date("2026-09-29T16:30:00Z"));
    // 00:30 on Wednesday in Vietnam is still Tuesday in UTC.
    const earlyWednesday = vnDayKey(new Date("2026-09-29T17:30:00Z"));
    expect(lateTuesday).toBe(TUE);
    expect(earlyWednesday).toBe(WED);
    expect(computeStreak([MON, lateTuesday], earlyWednesday)).toMatchObject({
      days: 2,
      studiedToday: false,
    });
  });

  it("ignores study days recorded after today", () => {
    expect(computeStreak([MON, TUE, THU], TUE).days).toBe(2);
  });

  it("honours a different number of rest days", () => {
    expect(computeStreak([MON, THU], THU, 2)).toMatchObject({
      days: 2,
      restDaysLeft: 0,
    });
    expect(computeStreak([MON, THU], THU, 0).days).toBe(1);
  });
});
