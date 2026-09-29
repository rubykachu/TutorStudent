import { describe, expect, it } from "vitest";
import { shuffleRight } from "@/exercises/match/pairs";
import { attemptSeed, seededShuffle } from "@/exercises/shuffle";
import type { Item } from "@/schema/content";

const IDS = ["mot", "hai", "ba", "bon", "nam", "sau"];
const SEEDS = Array.from({ length: 200 }, (_, n) =>
  attemptSeed("lesson.ex.a", `nonce-${n}`),
);

function items(ids: string[]): Item[] {
  return ids.map((id) => ({ id, content: { type: "text", text: id } }));
}

describe("seededShuffle", () => {
  it("is deterministic per seed", () => {
    const seed = attemptSeed("a.ex.b", "n1");
    expect(seededShuffle(IDS, seed)).toEqual(seededShuffle(IDS, seed));
  });

  it("gives separate attempts at one exercise different arrangements", () => {
    const shown = new Set(SEEDS.map((seed) => seededShuffle(IDS, seed).join()));
    expect(shown.size).toBeGreaterThan(50);
  });

  it("never returns the authored order", () => {
    for (let n = 2; n <= IDS.length; n++) {
      const authored = IDS.slice(0, n);
      for (const seed of SEEDS) {
        const out = seededShuffle(authored, seed);
        expect(out).not.toEqual(authored);
        expect([...out].sort()).toEqual([...authored].sort());
      }
    }
  });

  it("does not count swapping two look-alike items as a change", () => {
    const words = ["x", "x", "y"];
    for (const seed of SEEDS) {
      const out = seededShuffle([0, 1, 2], seed, {
        key: (index) => words[index],
      });
      expect(out.map((index) => words[index])).not.toEqual(words);
    }
  });

  it("keeps a single item, and items that all look alike, as they are", () => {
    expect(seededShuffle(["mot"], "s")).toEqual(["mot"]);
    expect(seededShuffle(["x", "x", "x"], "s")).toEqual(["x", "x", "x"]);
  });

  it("avoids arrangements `accept` rejects, but never falls back to the authored one", () => {
    const authored = IDS.slice(0, 4);
    for (const seed of SEEDS) {
      expect(
        seededShuffle(authored, seed, { accept: (out) => out[0] === "ba" })[0],
      ).toBe("ba");
      expect(
        seededShuffle(authored, seed, { accept: () => false }),
      ).not.toEqual(authored);
    }
  });
});

describe("shuffleRight", () => {
  const sideBySide = (
    left: string[],
    right: Item[],
    pairs: { left: string; right: string }[],
  ) =>
    pairs.every(
      (pair) =>
        left.indexOf(pair.left) ===
        right.findIndex((item) => item.id === pair.right),
    );

  it.each([
    ["two pairs and a distractor", ["l1", "l2"], ["r1", "r2", "rx"]],
    ["three pairs", ["l1", "l2", "l3"], ["r1", "r2", "r3"]],
    ["two pairs", ["l1", "l2"], ["r1", "r2"]],
  ])("never lines up every pair row by row: %s", (_, left, right) => {
    const exercise = {
      left: items(left),
      right: items(right),
      pairs: left.map((id, row) => ({ left: id, right: right[row] })),
    };
    for (const seed of SEEDS) {
      const out = shuffleRight(exercise, seed);
      expect(sideBySide(left, out, exercise.pairs)).toBe(false);
      expect(out.map((item) => item.id)).not.toEqual(right);
      expect(out.map((item) => item.id).sort()).toEqual([...right].sort());
    }
  });

  it("is deterministic per seed", () => {
    const exercise = {
      left: items(["l1", "l2"]),
      right: items(["r1", "r2", "rx"]),
      pairs: [
        { left: "l1", right: "r1" },
        { left: "l2", right: "r2" },
      ],
    };
    expect(shuffleRight(exercise, "s")).toEqual(shuffleRight(exercise, "s"));
  });
});
