import { describe, expect, it } from "vitest";
import { visibleHistory } from "@/sync/history";
import { mergeHistoryDocs } from "@/sync/merge";
import {
  canonicalDoc,
  emptyHistoryDoc,
  type HistoryDoc,
  type SyncAttempt,
  type SyncWriting,
} from "@/sync/schema";
import {
  at,
  CHILD,
  FAMILY,
  genHistoryDoc,
  genResets,
  MONTH,
  seeded,
} from "./generators";

const L = "l-one";
const OTHER = "l-two";

function attempt(id: string, lessonId: string, time: string): SyncAttempt {
  return {
    id,
    exerciseId: `${lessonId}.ex.q`,
    lessonId,
    cardIds: [],
    firstTryCorrect: true,
    wrongCount: 0,
    at: time,
    context: "practice",
  };
}

function writing(id: string, lessonId: string, time: string): SyncWriting {
  return {
    id,
    exerciseId: `${lessonId}.ex.viet`,
    text: id,
    checks: [],
    at: time,
  };
}

function history(parts: Partial<HistoryDoc> = {}): HistoryDoc {
  return { ...emptyHistoryDoc(FAMILY, CHILD, MONTH), ...parts };
}

describe("mergeHistoryDocs", () => {
  it("unions attempts and writings by id", () => {
    const a = history({
      attempts: [attempt("a1", L, at(1))],
      writings: [writing("w1", L, at(1))],
    });
    const b = history({
      attempts: [attempt("a1", L, at(1)), attempt("a2", L, at(2))],
      writings: [writing("w2", OTHER, at(2))],
    });
    const merged = mergeHistoryDocs(a, b);
    expect(merged.attempts.map((x) => x.id)).toEqual(["a1", "a2"]);
    expect(merged.writings.map((x) => x.id)).toEqual(["w1", "w2"]);
    expect(mergeHistoryDocs(b, a)).toEqual(merged);
  });

  it("never drops a record, whatever resets exist elsewhere", () => {
    const a = history({
      attempts: [attempt("a1", L, at(1))],
      writings: [writing("w1", L, at(1))],
    });
    const b = history({ attempts: [attempt("a2", L, at(2))] });
    const merged = mergeHistoryDocs(a, b);
    expect(merged.attempts).toHaveLength(2);
    expect(merged.writings).toHaveLength(1);
  });

  it("refuses docs of another child or month", () => {
    expect(() =>
      mergeHistoryDocs(history(), history({ month: "2026-09" })),
    ).toThrow();
    expect(() =>
      mergeHistoryDocs(history(), history({ childId: "f".repeat(32) })),
    ).toThrow();
  });

  it("returns the canonical form", () => {
    const merged = mergeHistoryDocs(
      history({ attempts: [attempt("a2", L, at(2)), attempt("a1", L, at(1))] }),
      history(),
    );
    expect(merged).toEqual(canonicalDoc("history", merged));
  });
});

describe("visibleHistory", () => {
  const doc = history({
    attempts: [
      attempt("before", L, at(4)),
      attempt("same", L, at(5)),
      attempt("after", L, at(6)),
      attempt("other", OTHER, at(1)),
    ],
    writings: [
      writing("w-before", L, at(5)),
      writing("w-after", L, at(7)),
      writing("w-other", OTHER, at(1)),
    ],
  });

  it("hides attempts and writings of a reset lesson at or before the reset", () => {
    const visible = visibleHistory(doc, { [L]: at(5) });
    expect(visible.attempts.map((a) => a.id)).toEqual(["after", "other"]);
    expect(visible.writings.map((w) => w.id)).toEqual(["w-after", "w-other"]);
  });

  it("changes nothing without resets, and never edits the stored doc", () => {
    const copy = structuredClone(doc);
    expect(visibleHistory(doc, {})).toEqual(doc);
    visibleHistory(doc, { [L]: at(9) });
    expect(doc).toEqual(copy);
  });
});

describe("history properties (seeded, generated docs)", () => {
  const CASES = 400;
  const make = (seed: number) => genHistoryDoc(seeded(seed));

  it("merge is commutative, associative and idempotent", () => {
    for (let i = 0; i < CASES; i++) {
      const [a, b, c] = [
        make(3 * i + 1),
        make(3 * i + 2),
        make(3 * i + 3),
      ] as const;
      expect(mergeHistoryDocs(a, b)).toEqual(mergeHistoryDocs(b, a));
      expect(mergeHistoryDocs(mergeHistoryDocs(a, b), c)).toEqual(
        mergeHistoryDocs(a, mergeHistoryDocs(b, c)),
      );
      expect(mergeHistoryDocs(a, a)).toEqual(canonicalDoc("history", a));
    }
  });

  it("is commutative and associative even when equal ids carry different content", () => {
    const messy = (seed: number) =>
      genHistoryDoc(seeded(seed), { conflicting: true });
    for (let i = 0; i < CASES; i++) {
      const [a, b, c] = [
        messy(3 * i + 1),
        messy(3 * i + 2),
        messy(3 * i + 3),
      ] as const;
      expect(mergeHistoryDocs(a, b)).toEqual(mergeHistoryDocs(b, a));
      expect(mergeHistoryDocs(mergeHistoryDocs(a, b), c)).toEqual(
        mergeHistoryDocs(a, mergeHistoryDocs(b, c)),
      );
    }
  });

  it("filtering before or after a merge gives the same visible history", () => {
    for (let i = 0; i < CASES; i++) {
      const a = make(2 * i + 1);
      const b = make(2 * i + 2);
      const resets = genResets(seeded(1000 + i));
      expect(visibleHistory(mergeHistoryDocs(a, b), resets)).toEqual(
        mergeHistoryDocs(visibleHistory(a, resets), visibleHistory(b, resets)),
      );
    }
  });
});
