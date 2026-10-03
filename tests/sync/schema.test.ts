import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SYNC_MAX_PROFILES, SYNC_WRITING_MAX_CHARS } from "@/lib/config";
import {
  type ChildDoc,
  canonicalDoc,
  canonicalText,
  DOC_VERSION,
  type HistoryDoc,
  liftToVersion,
  type MigrationStep,
  migrateDoc,
  monthOfTime,
  type ProfileDoc,
  stableStringify,
} from "@/sync/schema";

function fixture<T>(name: string): T {
  return JSON.parse(
    readFileSync(join(process.cwd(), "tests/sync/fixtures", name), "utf8"),
  ) as T;
}

const child = () => fixture<ChildDoc>("child-v1.json");
const history = () => fixture<HistoryDoc>("history-v1.json");
const profile = () => fixture<ProfileDoc>("profile-v1.json");

describe("stored sample docs", () => {
  it("parse unchanged through migrateDoc", () => {
    expect(migrateDoc("child", child())).toEqual({ ok: true, doc: child() });
    expect(migrateDoc("history", history())).toEqual({
      ok: true,
      doc: history(),
    });
    expect(migrateDoc("profile", profile())).toEqual({
      ok: true,
      doc: profile(),
    });
  });
});

describe("strictness", () => {
  it("rejects an unknown key at the top level and inside a record", () => {
    expect(migrateDoc("child", { ...child(), extra: 1 }).ok).toBe(false);
    const doc = child();
    expect(
      migrateDoc("child", {
        ...doc,
        cards: [{ ...doc.cards[0], extra: true }],
      }).ok,
    ).toBe(false);
    expect(migrateDoc("profile", { ...profile(), extra: 1 }).ok).toBe(false);
    expect(migrateDoc("history", { ...history(), extra: 1 }).ok).toBe(false);
  });

  it("rejects a doc of another kind", () => {
    expect(migrateDoc("child", history()).ok).toBe(false);
    expect(migrateDoc("history", profile()).ok).toBe(false);
  });

  it("validates ids by pattern", () => {
    expect(migrateDoc("child", { ...child(), childId: "not-hex" }).ok).toBe(
      false,
    );
    expect(migrateDoc("child", { ...child(), familyId: "A" }).ok).toBe(false);
    expect(migrateDoc("child", { ...child(), familyId: "nha-minh" }).ok).toBe(
      false,
    );
    // The device's own family id, carried by backup files.
    expect(migrateDoc("child", { ...child(), familyId: "local" }).ok).toBe(
      true,
    );
    expect(migrateDoc("child", { ...child(), familyId: "../x1" }).ok).toBe(
      false,
    );
    const doc = child();
    expect(
      migrateDoc("child", {
        ...doc,
        stickers: [{ lessonId: "a/b", at: "2026-10-01T02:20:00.000Z" }],
      }).ok,
    ).toBe(false);
    expect(migrateDoc("child", { ...doc, historyMonths: ["2026-13"] }).ok).toBe(
      false,
    );
    expect(
      migrateDoc("child", { ...doc, activityDays: ["2026-10-32"] }).ok,
    ).toBe(false);
  });

  // The merge looks lesson ids up in plain objects; one of these names would
  // find a function there, and the merged doc would carry it into Dexie.
  it("refuses an id that is a name of Object.prototype, as a key or a value", () => {
    const at = "2026-10-01T02:20:00.000Z";
    const doc = child();
    for (const name of [
      "constructor",
      "toString",
      "valueOf",
      "hasOwnProperty",
    ]) {
      expect(
        migrateDoc("child", {
          ...doc,
          resets: JSON.parse(`{"${name}":"${at}"}`),
        }).ok,
      ).toBe(false);
      expect(
        migrateDoc("child", {
          ...doc,
          stickers: [{ lessonId: name, at }],
        }).ok,
      ).toBe(false);
    }
    expect(
      migrateDoc("child", { ...doc, resets: { "l-constructor": at } }).ok,
    ).toBe(true);
  });

  it("requires times in one fixed UTC format", () => {
    const doc = child();
    for (const bad of [
      "2026-10-01",
      "2026-10-01T02:20:00Z",
      "2026-10-01T09:20:00.000+07:00",
      "yesterday",
    ]) {
      expect(
        migrateDoc("child", {
          ...doc,
          stickers: [{ lessonId: "a", at: bad }],
        }).ok,
      ).toBe(false);
    }
  });

  it("bounds the number of profiles, a writing's length and the reset map", () => {
    const base = profile();
    const many = Array.from({ length: SYNC_MAX_PROFILES + 1 }, (_, i) => ({
      ...base.profiles[0],
      id: i.toString(16).padStart(32, "0"),
    }));
    expect(migrateDoc("profile", { ...base, profiles: many }).ok).toBe(false);
    expect(
      migrateDoc("profile", { ...base, profiles: many.slice(0, 12) }).ok,
    ).toBe(true);

    const doc = history();
    const writing = {
      ...doc.writings[0],
      text: "x".repeat(SYNC_WRITING_MAX_CHARS),
    };
    expect(migrateDoc("history", { ...doc, writings: [writing] }).ok).toBe(
      true,
    );
    expect(
      migrateDoc("history", {
        ...doc,
        writings: [{ ...writing, text: `${writing.text}x` }],
      }).ok,
    ).toBe(false);
  });
});

describe("versions", () => {
  it("reports a doc newer than the code as too-new, not as current", () => {
    expect(
      migrateDoc("child", { ...child(), version: DOC_VERSION + 1 }),
    ).toEqual({ ok: false, reason: "too-new", version: DOC_VERSION + 1 });
    // Even when it also carries fields this code does not know.
    expect(
      migrateDoc("history", { ...history(), version: 9, newField: [] }),
    ).toEqual({ ok: false, reason: "too-new", version: 9 });
  });

  it("reports a missing or nonsensical version as invalid", () => {
    for (const version of [undefined, 0, -1, 1.5, "1"]) {
      const result = migrateDoc("child", { ...child(), version });
      expect(result).toMatchObject({ ok: false, reason: "invalid" });
    }
    expect(migrateDoc("child", null)).toMatchObject({ reason: "invalid" });
    expect(migrateDoc("child", [])).toMatchObject({ reason: "invalid" });
  });

  it("lifts an older doc one step at a time and stamps each version", () => {
    const seen: number[] = [];
    const steps: MigrationStep[] = [
      (raw) => {
        seen.push(raw.version as number);
        return { ...raw, renamed: raw.old };
      },
      (raw) => {
        seen.push(raw.version as number);
        return { ...raw, last: true };
      },
    ];
    expect(liftToVersion({ version: 1, old: "x" }, steps, 3)).toEqual({
      ok: true,
      doc: { version: 3, old: "x", renamed: "x", last: true },
    });
    expect(seen).toEqual([1, 2]);
    expect(liftToVersion({ version: 2 }, steps, 3)).toEqual({
      ok: true,
      doc: { version: 3, last: true },
    });
  });

  it("fails when a step is missing", () => {
    expect(liftToVersion({ version: 1 }, [], 2)).toMatchObject({
      ok: false,
      reason: "invalid",
    });
  });
});

describe("history month", () => {
  it("fails a record whose Vietnam month differs from the doc's", () => {
    const doc = history();
    // 17:00 UTC on 31 Oct is already 1 Nov in Vietnam.
    const lateOctober = "2026-10-31T17:00:00.000Z";
    expect(monthOfTime(lateOctober)).toBe("2026-11");
    const attempt = { ...doc.attempts[0], at: lateOctober };
    expect(migrateDoc("history", { ...doc, attempts: [attempt] }).ok).toBe(
      false,
    );
    expect(
      migrateDoc("history", {
        ...doc,
        month: "2026-11",
        attempts: [attempt],
        writings: [],
      }).ok,
    ).toBe(true);
    const writing = { ...doc.writings[0], at: "2026-09-30T16:59:59.999Z" };
    expect(migrateDoc("history", { ...doc, writings: [writing] }).ok).toBe(
      false,
    );
  });
});

describe("canonical form", () => {
  function reversed<T extends Record<string, unknown>>(doc: T): T {
    const copy: Record<string, unknown> = {};
    for (const key of Object.keys(doc).reverse()) {
      const value = doc[key];
      copy[key] = Array.isArray(value) ? [...value].reverse() : value;
    }
    return copy as T;
  }

  it("is the same whatever the order of the arrays and keys", () => {
    const doc = child();
    doc.cards.push({
      ...doc.cards[0],
      cardId: "boi-chung-boi-chung-nho-nhat.card.a",
    });
    expect(canonicalText("child", reversed(doc))).toBe(
      canonicalText("child", doc),
    );
    expect(canonicalText("history", reversed(history()))).toBe(
      canonicalText("history", history()),
    );
    expect(canonicalText("profile", reversed(profile()))).toBe(
      canonicalText("profile", profile()),
    );
  });

  it("sorts every array by its key", () => {
    const doc = child();
    doc.activityDays = ["2026-10-02", "2026-09-01"];
    const sorted = canonicalDoc("child", doc);
    expect(sorted.activityDays).toEqual(["2026-09-01", "2026-10-02"]);
    expect(
      canonicalDoc("profile", profile()).profiles.map((p) => p.name),
    ).toEqual(["Na", "Bống"]);
  });

  it("differs when the data differs", () => {
    const doc = child();
    const other = child();
    other.resets = {
      "boi-chung-boi-chung-nho-nhat": "2026-10-02T00:00:00.000Z",
    };
    expect(canonicalText("child", other)).not.toBe(canonicalText("child", doc));
  });

  it("writes object keys in alphabetical order at every depth", () => {
    expect(stableStringify({ b: { d: 1, c: [{ z: 1, a: 2 }] }, a: null })).toBe(
      '{"a":null,"b":{"c":[{"a":2,"z":1}],"d":1}}',
    );
  });
});
