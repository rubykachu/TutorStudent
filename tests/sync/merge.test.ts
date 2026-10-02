import { describe, expect, it } from "vitest";
import { SECTION_START } from "@/progress/db";
import { mergeChildDocs, mergeProfileDocs } from "@/sync/merge";
import {
  type ChildDoc,
  canonicalDoc,
  emptyChildDoc,
  emptyProfileDoc,
  type SyncCard,
  type SyncSection,
} from "@/sync/schema";
import {
  at,
  CHILD,
  FAMILY,
  genChildDoc,
  genProfileDoc,
  seeded,
} from "./generators";

const L = "l-one";
const OTHER = "l-two";

function doc(parts: Partial<ChildDoc> = {}): ChildDoc {
  return { ...emptyChildDoc(FAMILY, CHILD), ...parts };
}

function card(
  cardId: string,
  lastReviewAt: string,
  extra: Partial<SyncCard> = {},
): SyncCard {
  return {
    cardId,
    lessonId: cardId.split(".")[0] as string,
    due: at(30),
    stability: 2,
    difficulty: 5,
    scheduledDays: 1,
    learningSteps: 0,
    reps: 1,
    lapses: 0,
    state: 2,
    lastReviewAt,
    ...extra,
  };
}

function section(
  sectionId: string,
  parts: Partial<SyncSection> = {},
): SyncSection {
  return {
    sectionId,
    lessonId: sectionId.split(".")[0] as string,
    doneAt: null,
    position: { phase: "practice", index: 1 },
    updatedAt: at(1),
    ...parts,
  };
}

const doneSection = (sectionId: string, time: string): SyncSection =>
  section(sectionId, {
    doneAt: time,
    position: SECTION_START,
    updatedAt: time,
  });

describe("mergeChildDocs: cards", () => {
  const id = `${L}.card.a`;

  it("keeps the card with the later lastReviewAt, in either order", () => {
    const older = doc({ cards: [card(id, at(1), { reps: 9 })] });
    const newer = doc({ cards: [card(id, at(2), { reps: 1 })] });
    for (const merged of [
      mergeChildDocs(older, newer),
      mergeChildDocs(newer, older),
    ]) {
      expect(merged.cards).toEqual(newer.cards);
    }
  });

  it("on equal times keeps the card with more reps", () => {
    const few = doc({ cards: [card(id, at(2), { reps: 1 })] });
    const many = doc({ cards: [card(id, at(2), { reps: 4 })] });
    expect(mergeChildDocs(few, many).cards[0]?.reps).toBe(4);
    expect(mergeChildDocs(many, few).cards[0]?.reps).toBe(4);
  });

  it("on equal times and reps resolves by canonical text, the same in both orders", () => {
    const a = doc({ cards: [card(id, at(2), { stability: 1 })] });
    const b = doc({ cards: [card(id, at(2), { stability: 2 })] });
    expect(mergeChildDocs(a, b)).toEqual(mergeChildDocs(b, a));
    expect(mergeChildDocs(a, b).cards).toHaveLength(1);
  });

  it("keeps cards the other side lacks", () => {
    const a = doc({ cards: [card(`${L}.card.a`, at(1))] });
    const b = doc({ cards: [card(`${L}.card.b`, at(1))] });
    expect(mergeChildDocs(a, b).cards.map((c) => c.cardId)).toEqual([
      `${L}.card.a`,
      `${L}.card.b`,
    ]);
  });

  it("drops cards of a reset lesson at or before the reset, from each side", () => {
    const resetter = doc({ resets: { [L]: at(5) } });
    const holder = doc({
      cards: [
        card(`${L}.card.old`, at(4)),
        card(`${L}.card.same`, at(5)),
        card(`${L}.card.new`, at(6)),
        card(`${OTHER}.card.a`, at(1)),
      ],
    });
    for (const merged of [
      mergeChildDocs(resetter, holder),
      mergeChildDocs(holder, resetter),
    ]) {
      expect(merged.cards.map((c) => c.cardId)).toEqual([
        `${L}.card.new`,
        `${OTHER}.card.a`,
      ]);
    }
  });
});

describe("mergeChildDocs: sections", () => {
  const id = `${L}.section.a`;

  it("a finished section stays finished against a later in-progress position", () => {
    const done = doc({ sections: [doneSection(id, at(2))] });
    const progress = doc({
      sections: [
        section(id, {
          updatedAt: at(5),
          position: { phase: "check", index: 2 },
        }),
      ],
    });
    const merged = mergeChildDocs(done, progress).sections[0];
    expect(merged?.doneAt).toBe(at(2));
    expect(merged?.position).toEqual({ phase: "check", index: 2 });
    expect(merged?.updatedAt).toBe(at(5));
    expect(mergeChildDocs(progress, done)).toEqual(
      mergeChildDocs(done, progress),
    );
  });

  it("doneAt is the later of two completions", () => {
    const a = doc({ sections: [doneSection(id, at(2))] });
    const b = doc({ sections: [doneSection(id, at(4))] });
    expect(mergeChildDocs(a, b).sections[0]?.doneAt).toBe(at(4));
  });

  it("position comes from the record with the later updatedAt", () => {
    const early = doc({
      sections: [
        section(id, {
          updatedAt: at(1),
          position: { phase: "check", index: 1 },
        }),
      ],
    });
    const late = doc({
      sections: [
        section(id, {
          updatedAt: at(3),
          position: { phase: "recap", index: 0 },
        }),
      ],
    });
    expect(mergeChildDocs(early, late).sections[0]?.position).toEqual({
      phase: "recap",
      index: 0,
    });
    expect(mergeChildDocs(late, early).sections[0]?.position).toEqual({
      phase: "recap",
      index: 0,
    });
  });

  it("equal updatedAt resolves by canonical text of the position, in both orders", () => {
    const a = doc({
      sections: [section(id, { position: { phase: "check", index: 1 } })],
    });
    const b = doc({
      sections: [section(id, { position: { phase: "check", index: 2 } })],
    });
    expect(mergeChildDocs(a, b)).toEqual(mergeChildDocs(b, a));
  });

  it("a reset drops a completion and a position separately", () => {
    const resetter = doc({ resets: { [L]: at(5) } });
    const before = doc({
      sections: [
        doneSection(`${L}.section.a`, at(4)),
        doneSection(`${L}.section.same`, at(5)),
        section(`${L}.section.pos`, { updatedAt: at(3) }),
        doneSection(`${OTHER}.section.a`, at(1)),
      ],
    });
    const merged = mergeChildDocs(resetter, before);
    expect(merged.sections.map((s) => s.sectionId)).toEqual([
      `${OTHER}.section.a`,
    ]);
  });

  it("a completion before the reset goes, a position saved after it stays (in progress)", () => {
    const reset = doc({ resets: { [L]: at(6) } });
    const finishedEarly = doc({
      sections: [doneSection(`${L}.section.a`, at(5))],
    });
    const movedLater = doc({
      sections: [
        section(`${L}.section.a`, {
          updatedAt: at(8),
          position: { phase: "check", index: 3 },
        }),
      ],
    });
    const merged = mergeChildDocs(
      mergeChildDocs(finishedEarly, reset),
      movedLater,
    );
    expect(merged.sections).toEqual([
      section(`${L}.section.a`, {
        doneAt: null,
        updatedAt: at(8),
        position: { phase: "check", index: 3 },
      }),
    ]);
  });

  it("a completion after the reset survives the reset", () => {
    const merged = mergeChildDocs(
      doc({ resets: { [L]: at(5) } }),
      doc({ sections: [doneSection(`${L}.section.a`, at(7))] }),
    );
    expect(merged.sections[0]?.doneAt).toBe(at(7));
  });

  it("lifts a record that is done later than its position was saved", () => {
    const odd = section(`${L}.section.a`, {
      doneAt: at(5),
      updatedAt: at(2),
      position: { phase: "check", index: 1 },
    });
    expect(mergeChildDocs(doc({ sections: [odd] }), doc()).sections).toEqual([
      doneSection(`${L}.section.a`, at(5)),
    ]);
  });

  it("gives the same result in every order for done at 5, in progress at 8, reset at 6", () => {
    const sectionId = `${L}.section.a`;
    const b = doc({ sections: [doneSection(sectionId, at(5))] });
    const c = doc({
      sections: [
        section(sectionId, {
          updatedAt: at(8),
          position: { phase: "practice", index: 2 },
        }),
      ],
    });
    const a = doc({ resets: { [L]: at(6) } });
    const expected = canonicalDoc(
      "child",
      doc({
        resets: { [L]: at(6) },
        sections: [
          section(sectionId, {
            updatedAt: at(8),
            position: { phase: "practice", index: 2 },
          }),
        ],
      }),
    );
    const orders = [
      [a, b, c],
      [a, c, b],
      [b, a, c],
      [b, c, a],
      [c, a, b],
      [c, b, a],
    ] as const;
    for (const [x, y, z] of orders) {
      expect(mergeChildDocs(mergeChildDocs(x, y), z)).toEqual(expected);
      expect(mergeChildDocs(x, mergeChildDocs(y, z))).toEqual(expected);
    }
  });
});

describe("mergeChildDocs: stickers, days, months", () => {
  it("unions stickers by lesson, keeps the earliest time, and a reset never drops one", () => {
    const a = doc({ stickers: [{ lessonId: L, at: at(4) }] });
    const b = doc({
      stickers: [
        { lessonId: L, at: at(2) },
        { lessonId: OTHER, at: at(3) },
      ],
      resets: { [L]: at(9), [OTHER]: at(9) },
    });
    for (const merged of [mergeChildDocs(a, b), mergeChildDocs(b, a)]) {
      expect(merged.stickers).toEqual([
        { lessonId: L, at: at(2) },
        { lessonId: OTHER, at: at(3) },
      ]);
    }
  });

  it("unions activity days and history months, sorted, whatever the resets", () => {
    const a = doc({
      activityDays: ["2026-10-02", "2026-10-01"],
      historyMonths: ["2026-10"],
    });
    const b = doc({
      activityDays: ["2026-09-30", "2026-10-01"],
      historyMonths: ["2026-09"],
      resets: { [L]: at(9) },
    });
    const merged = mergeChildDocs(a, b);
    expect(merged.activityDays).toEqual([
      "2026-09-30",
      "2026-10-01",
      "2026-10-02",
    ]);
    expect(merged.historyMonths).toEqual(["2026-09", "2026-10"]);
    expect(mergeChildDocs(b, a)).toEqual(merged);
  });
});

describe("mergeChildDocs: overviewSeen and resets", () => {
  it("the later seen time wins, not the earliest", () => {
    const a = doc({ overviewSeen: { [L]: at(2) } });
    const b = doc({ overviewSeen: { [L]: at(4), [OTHER]: at(1) } });
    expect(mergeChildDocs(a, b).overviewSeen).toEqual({
      [L]: at(4),
      [OTHER]: at(1),
    });
  });

  it("a reset drops a mark made at or before it and keeps one made after", () => {
    const resets = { [L]: at(5), [OTHER]: at(5) };
    const merged = mergeChildDocs(
      doc({ resets }),
      doc({ overviewSeen: { [L]: at(5), [OTHER]: at(6) } }),
    );
    expect(merged.overviewSeen).toEqual({ [OTHER]: at(6) });
  });

  it("a mark made after a reset on one device beats the same device's older mark", () => {
    const merged = mergeChildDocs(
      doc({ overviewSeen: { [L]: at(2) } }),
      doc({ resets: { [L]: at(4) }, overviewSeen: { [L]: at(7) } }),
    );
    expect(merged.overviewSeen).toEqual({ [L]: at(7) });
  });

  it("resets keep the later time per lesson", () => {
    const merged = mergeChildDocs(
      doc({ resets: { [L]: at(2), [OTHER]: at(9) } }),
      doc({ resets: { [L]: at(4) } }),
    );
    expect(merged.resets).toEqual({ [L]: at(4), [OTHER]: at(9) });
  });
});

describe("mergeChildDocs: general", () => {
  it("refuses docs of different children or families", () => {
    expect(() =>
      mergeChildDocs(doc(), { ...doc(), childId: "f".repeat(32) }),
    ).toThrow();
    expect(() =>
      mergeChildDocs(doc(), { ...doc(), familyId: "other-family" }),
    ).toThrow();
  });

  it("returns the canonical form", () => {
    const merged = mergeChildDocs(
      doc({ activityDays: ["2026-10-02", "2026-10-01"] }),
      doc(),
    );
    expect(merged).toEqual(canonicalDoc("child", merged));
  });

  it("does not change its inputs", () => {
    const a = doc({
      cards: [card(`${L}.card.a`, at(1))],
      resets: { [L]: at(3) },
    });
    const copy = structuredClone(a);
    mergeChildDocs(a, doc({ cards: [card(`${L}.card.b`, at(5))] }));
    expect(a).toEqual(copy);
  });
});

describe("mergeProfileDocs", () => {
  const profile = (id: string, name: string, updatedAt: string) => ({
    id,
    name,
    avatar: "owl",
    grade: 6,
    series: {},
    createdAt: at(1),
    updatedAt,
  });
  const ID_A = "a".repeat(32);
  const ID_B = "b".repeat(32);

  it("unions profiles by id and keeps the later updatedAt", () => {
    const a = {
      ...emptyProfileDoc(FAMILY),
      profiles: [profile(ID_A, "Na", at(2))],
    };
    const b = {
      ...emptyProfileDoc(FAMILY),
      profiles: [profile(ID_A, "Na Na", at(4)), profile(ID_B, "Tí", at(1))],
    };
    for (const merged of [mergeProfileDocs(a, b), mergeProfileDocs(b, a)]) {
      expect(merged.profiles.map((p) => [p.id, p.name])).toEqual([
        [ID_A, "Na Na"],
        [ID_B, "Tí"],
      ]);
    }
  });

  it("breaks a tie by canonical text, the same in both orders", () => {
    const a = {
      ...emptyProfileDoc(FAMILY),
      profiles: [profile(ID_A, "Na", at(2))],
    };
    const b = {
      ...emptyProfileDoc(FAMILY),
      profiles: [profile(ID_A, "Nu", at(2))],
    };
    expect(mergeProfileDocs(a, b)).toEqual(mergeProfileDocs(b, a));
  });

  it("keeps two profiles with the same name and different ids", () => {
    const a = {
      ...emptyProfileDoc(FAMILY),
      profiles: [profile(ID_A, "Na", at(2))],
    };
    const b = {
      ...emptyProfileDoc(FAMILY),
      profiles: [profile(ID_B, "Na", at(3))],
    };
    expect(mergeProfileDocs(a, b).profiles).toHaveLength(2);
  });

  it("refuses docs of different families", () => {
    expect(() =>
      mergeProfileDocs(
        emptyProfileDoc("one-family"),
        emptyProfileDoc("two-family"),
      ),
    ).toThrow();
  });
});

const CASES = 400;

describe("merge properties (seeded, generated docs)", () => {
  function triples<T>(make: (seed: number) => T): [T, T, T][] {
    return Array.from({ length: CASES }, (_, i) => [
      make(3 * i + 1),
      make(3 * i + 2),
      make(3 * i + 3),
    ]);
  }

  const raw = (seed: number) => genChildDoc(seeded(seed), { settled: false });
  const settled = (seed: number) =>
    genChildDoc(seeded(seed), { settled: true });

  it("main doc: commutative, with records on both sides of resets", () => {
    for (const [a, b] of triples(raw)) {
      expect(mergeChildDocs(a, b)).toEqual(mergeChildDocs(b, a));
    }
  });

  it("main doc: associative", () => {
    for (const [a, b, c] of triples(raw)) {
      expect(mergeChildDocs(mergeChildDocs(a, b), c)).toEqual(
        mergeChildDocs(a, mergeChildDocs(b, c)),
      );
    }
  });

  it("main doc: idempotent, and merging with an older copy changes nothing", () => {
    for (const [a, b] of triples(settled)) {
      expect(mergeChildDocs(a, a)).toEqual(canonicalDoc("child", a));
      const ab = mergeChildDocs(a, b);
      expect(mergeChildDocs(ab, ab)).toEqual(ab);
      expect(mergeChildDocs(a, ab)).toEqual(ab);
    }
    for (const [a] of triples(raw)) {
      const once = mergeChildDocs(a, a);
      expect(mergeChildDocs(once, once)).toEqual(once);
    }
  });

  it("main doc: a settled doc stays valid input of the same shape", () => {
    for (const [a, b] of triples(settled)) {
      const merged = mergeChildDocs(a, b);
      // No record of a reset lesson at or before its reset survives.
      for (const c of merged.cards) {
        const r = merged.resets[c.lessonId];
        expect(r === undefined || c.lastReviewAt > r).toBe(true);
      }
      for (const s of merged.sections) {
        const r = merged.resets[s.lessonId];
        expect(r === undefined || s.updatedAt > r).toBe(true);
        expect(s.doneAt === null || r === undefined || s.doneAt > r).toBe(true);
      }
    }
  });

  it("profile doc: commutative, associative, idempotent", () => {
    const make = (seed: number) => genProfileDoc(seeded(seed));
    for (const [a, b, c] of triples(make)) {
      expect(mergeProfileDocs(a, b)).toEqual(mergeProfileDocs(b, a));
      expect(mergeProfileDocs(mergeProfileDocs(a, b), c)).toEqual(
        mergeProfileDocs(a, mergeProfileDocs(b, c)),
      );
      expect(mergeProfileDocs(a, a)).toEqual(canonicalDoc("profile", a));
    }
  });
});
