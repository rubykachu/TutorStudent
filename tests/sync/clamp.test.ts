import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { clampFutureTimes } from "@/sync/clamp";
import type { ChildDoc, HistoryDoc, ProfileDoc } from "@/sync/schema";

const SERVER_NOW = "2026-10-02T03:00:00.000Z";
const LIMIT = "2026-10-02T03:10:00.000Z";
const FAR = "2030-01-01T00:00:00.000Z";

function fixture<T>(name: string): T {
  return JSON.parse(
    readFileSync(path.join(__dirname, "fixtures", name), "utf8"),
  ) as T;
}

// Every ISO time string in a value, with its path.
function times(value: unknown, at = ""): [string, string][] {
  if (typeof value === "string") {
    return /^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(value) ? [[at, value]] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((item) => times(item, `${at}[]`));
  }
  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, inner]) =>
      times(inner, at ? `${at}.${key}` : key),
    );
  }
  return [];
}

// Sets every time in a value to `to`, wherever it is.
function setAllTimes(value: unknown, to: string): unknown {
  if (typeof value === "string") {
    return /^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(value) ? to : value;
  }
  if (Array.isArray(value)) return value.map((item) => setAllTimes(item, to));
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, setAllTimes(v, to)]),
    );
  }
  return value;
}

// The one time the server leaves alone: a card's schedule.
const KEPT = ["cards[].due"];

describe("clampFutureTimes", () => {
  it.each([
    ["profile", "profile-v1.json"],
    ["child", "child-v1.json"],
    ["history", "history-v1.json"],
  ] as const)(
    "leaves no %s time past the limit except a card's due date",
    (kind, file) => {
      const doc = setAllTimes(fixture(file), FAR) as never;
      const { doc: clamped, changed } = clampFutureTimes(
        kind,
        doc,
        LIMIT,
        SERVER_NOW,
      );
      expect(changed).toBe(true);
      const late = times(clamped).filter(([, time]) => time > LIMIT);
      for (const [where] of late) expect(KEPT).toContain(where);
      // Every time field of the fixture is covered: the sweep found some.
      expect(times(clamped).length).toBeGreaterThan(0);
    },
  );

  it("changes nothing, and says so, for a doc with no future time", () => {
    const doc = fixture<ChildDoc>("child-v1.json");
    const result = clampFutureTimes(
      "child",
      doc,
      "2999-01-01T00:00:00.000Z",
      SERVER_NOW,
    );
    expect(result.changed).toBe(false);
    expect(result.doc).toEqual(doc);
  });

  it("treats the limit itself as allowed and a millisecond later as too late", () => {
    const base = fixture<HistoryDoc>("history-v1.json");
    const make = (at: string) => ({
      ...base,
      attempts: base.attempts.map((a) => ({ ...a, at })),
    });
    expect(
      clampFutureTimes("history", make(LIMIT), LIMIT, SERVER_NOW).changed,
    ).toBe(false);
    const late = clampFutureTimes(
      "history",
      make("2026-10-02T03:10:00.001Z"),
      LIMIT,
      SERVER_NOW,
    );
    expect(late.changed).toBe(true);
    expect(late.doc.attempts[0]?.at).toBe(SERVER_NOW);
  });

  it("does not mutate its input", () => {
    const doc = setAllTimes(
      fixture<ProfileDoc>("profile-v1.json"),
      FAR,
    ) as ProfileDoc;
    const copy = structuredClone(doc);
    clampFutureTimes("profile", doc, LIMIT, SERVER_NOW);
    expect(doc).toEqual(copy);
  });
});
