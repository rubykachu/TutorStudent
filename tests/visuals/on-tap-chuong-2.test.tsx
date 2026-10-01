import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  INTERACTIVE_KINDS,
  VALIDATOR_IDS,
  VISUAL_SPECS,
} from "@/visuals/math/on-tap-chuong-2/catalog";
import Sticker from "@/visuals/math/on-tap-chuong-2/sticker";
import { visualRegistry } from "@/visuals/registry";

// What each lesson screen asks the child to pick, written as the maths it
// rests on, so a wrong `wants` index cannot ship.
const PICK_RULES: Record<string, (item: string) => boolean> = {
  "chon-chia-9": (n) => Number(n) % 9 === 0,
  "chon-chia-235": (n) => [2, 3, 5].some((d) => Number(n) % d === 0),
  "chon-uoc-8": (n) => 8 % Number(n) === 0,
  "chon-bc-6-8": (n) => Number(n) % 6 === 0 && Number(n) % 8 === 0,
  "chon-tong-5": (sum) =>
    sum
      .split("+")
      .map(Number)
      .reduce((a, b) => a + b, 0) %
      5 ===
    0,
};

const chipSpecs = Object.entries(VISUAL_SPECS).flatMap(([key, spec]) =>
  spec.kind === "chips" ? [[key, spec] as const] : [],
);

describe("chapter II review pictures", () => {
  it("each pick screen's right chips follow from the maths", () => {
    for (const [key, rule] of Object.entries(PICK_RULES)) {
      const spec = VISUAL_SPECS[key];
      if (spec?.kind !== "chips") throw new Error(`${key} is not a chips spec`);
      const right = spec.items.flatMap((item, i) => (rule(item) ? [i] : []));
      expect(spec.wants, key).toEqual(right);
    }
  });

  it("only picks are interactive, and they reuse the shared validator", () => {
    expect([...INTERACTIVE_KINDS]).toEqual(["chips"]);
    expect(VALIDATOR_IDS.chips).toBe("chon-dung");
    for (const [key] of chipSpecs) {
      const entry = visualRegistry[`on-tap-chuong-2.visual.${key}`];
      expect(entry?.interactive, key).toBe(true);
      expect(entry?.validators?.["chon-dung"]).toBeTypeOf("function");
    }
  });

  it("formula rows are distinct, because they are the React keys", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (spec.kind !== "rows" && spec.kind !== "lines") continue;
      const tex = spec.rows.map((row) => row.tex);
      expect(new Set(tex).size, key).toBe(tex.length);
    }
  });

  it("the common divisor and common multiple pictures list what the maths gives", () => {
    const numbers = (key: string, row: number) => {
      const spec = VISUAL_SPECS[key];
      if (spec?.kind !== "rows") throw new Error(`${key} is not a rows spec`);
      return (spec.rows[row]?.tex.match(/\d+/g) ?? []).map(Number);
    };
    const divisorsOf = (n: number) =>
      Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);
    const common = divisorsOf(8).filter((d) => 12 % d === 0);
    expect(numbers("uc-8-12", 0)).toEqual(common);
    expect(numbers("uc-8-12", 1)).toEqual([Math.max(...common)]);
    // The first four common multiples of 6 and 9 are the multiples of 18.
    expect(numbers("bc-6-9", 0)).toEqual([18, 36, 54, 72]);
    expect(numbers("bc-6-9", 1)).toEqual([18]);
    expect(numbers("uc-bc-tom-tat", 0)).toEqual(common);
    expect(numbers("uc-bc-tom-tat", 2)).toEqual([18, 36, 54]);
  });

  it("the sticker names the chapter", () => {
    const { getByRole } = render(<Sticker />);
    expect(getByRole("img").getAttribute("aria-label")).toContain("chương hai");
  });
});
