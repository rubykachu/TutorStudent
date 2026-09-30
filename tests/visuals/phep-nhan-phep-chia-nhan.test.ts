import { describe, expect, it } from "vitest";
import {
  areaModel,
  classifySplit,
  productSum,
  splitGroup,
  writtenParts,
} from "@/visuals/math/phep-nhan-phep-chia/logic-nhan";
import {
  solutions,
  validators,
} from "@/visuals/math/phep-nhan-phep-chia/validators-nhan";

describe("luoi validator", () => {
  const params = { rows: 4, cols: 7 };

  it("accepts only the grid with the asked rows and columns", () => {
    expect(validators.luoi({ rows: 4, cols: 7 }, params)).toBe(true);
    expect(validators.luoi({ rows: 7, cols: 4 }, params)).toBe(false);
    expect(validators.luoi({ rows: 4, cols: 6 }, params)).toBe(false);
    expect(validators.luoi({}, params)).toBe(false);
    expect(validators.luoi({ rows: 4, cols: 7 }, {})).toBe(false);
  });

  it("solves to a state the validator accepts", () => {
    expect(validators.luoi(solutions.luoi(params), params)).toBe(true);
    expect(solutions.luoi({ rows: 3, cols: 5 })).toEqual({ rows: 3, cols: 5 });
  });
});

describe("split of a factor", () => {
  it("calls tens and ones the easy split, whichever number comes first", () => {
    expect(classifySplit(12, 10)).toEqual({ kind: "tensOnes" });
    expect(classifySplit(12, 2)).toEqual({ kind: "tensOnes" });
  });

  it("names the hard factor of any other split", () => {
    expect(classifySplit(12, 5)).toEqual({ kind: "hard", hardFactor: 7 });
    expect(classifySplit(12, 0)).toEqual({ kind: "hard", hardFactor: 12 });
    expect(classifySplit(12, 6)).toEqual({ kind: "hard", hardFactor: 6 });
  });
});

describe("area model", () => {
  it("lays positive parts side by side and adds their products", () => {
    const model = areaModel(3, [10, 2]);
    expect(model.columns).toBe(12);
    expect(model.total).toBe(36);
    expect(model.strips.map((s) => s.product)).toEqual([30, 6]);
    expect(productSum(model.strips)).toBe("30 + 6");
  });

  it("cuts a taken-away part off the right end of the whole", () => {
    const model = areaModel(12, [20, -1]);
    expect(model.columns).toBe(20);
    expect(model.total).toBe(228);
    expect(model.strips).toMatchObject([
      { kind: "keep", start: 0, width: 19, written: 20, product: 240 },
      { kind: "drop", start: 19, width: 1, written: 1, product: 12 },
    ]);
    expect(productSum(model.strips)).toBe("240 − 12");
    expect(writtenParts([20, -1])).toBe("20 − 1");
  });

  it("rejects a taken-away part as wide as the whole", () => {
    expect(() => areaModel(3, [2, -2])).toThrow();
  });
});

describe("parenthesised group", () => {
  it("splits a line around its brackets", () => {
    expect(splitGroup("= 11 · (4 · 25)")).toEqual([
      { text: "= 11 · ", group: false },
      { text: "(4 · 25)", group: true },
    ]);
    expect(splitGroup("= 11 · 100")).toEqual([
      { text: "= 11 · 100", group: false },
    ]);
  });
});
