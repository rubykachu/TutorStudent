import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { fromSpec } from "@/visuals/math/phep-nhan-phep-chia/examples";
import { packSteps } from "@/visuals/math/phep-nhan-phep-chia/pack-logic";

// One convention for "n groups of m": m · n, the number in each group first.
// Every picture of the lesson writes it this way.

function textOf(spec: Parameters<typeof fromSpec>[0]): string {
  const Visual = fromSpec(spec);
  const { container } = render(<Visual />);
  // The equals signs sit in their own nowrap spans: compare with one space.
  return (container.textContent ?? "").replace(/\s*=\s*/g, " = ");
}

describe("order of the factors in a product", () => {
  it("writes the size of a group before the number of groups", () => {
    const text = textOf({
      kind: "repeatAdd",
      groups: 4,
      size: 6,
      groupWord: "hộp",
      itemWord: "cái bánh",
      mode: "still",
    });
    expect(text).toContain("6 + 6 + 6 + 6");
    expect(text).toContain("6 · 4");
    expect(text).not.toContain("4 · 6");
  });

  it("writes the dots of a row before the number of rows, then swaps them", () => {
    const text = textOf({ kind: "swap", rows: 4, cols: 5, mode: "still" });
    expect(text).toContain("5 · 4 = 4 · 5 = 20");
  });

  it("stops a swap hint at the second factor of the turned product", () => {
    const text = textOf({ kind: "swap", rows: 4, cols: 6, mode: "hint" });
    expect(text).not.toContain("24");
  });

  it("writes the length of a hop before the number of hops", () => {
    const text = textOf({ kind: "skip", step: 7, hops: 8, mode: "still" });
    expect(text).toContain("7 · 8 = 56");
  });
});

describe("what a pack picture says", () => {
  it("uses the verb of the story for what each group holds", () => {
    const first = (perVerb: string) =>
      packSteps(50, 12, "up", "steps", {
        groupWord: "xe",
        itemWord: "học sinh",
        perVerb,
      })[0]?.caption;
    expect(first("chở")).toBe("Có 50 học sinh. Mỗi xe chở 12 học sinh.");
    expect(first("giá")).toBe("Có 50 học sinh. Mỗi xe giá 12 học sinh.");
  });
});
