import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BagTry } from "@/visuals/math/quan-he-chia-het-va-tinh-chat/bag-try";
import {
  VALIDATOR_IDS,
  VISUAL_SPECS,
} from "@/visuals/math/quan-he-chia-het-va-tinh-chat/catalog";
import {
  BAG_RANGE,
  divisorPairs,
  divisors,
  landings,
  solutions,
  validators,
} from "@/visuals/math/quan-he-chia-het-va-tinh-chat/logic";
import { visualRegistry } from "@/visuals/registry";

describe("divisibility helpers", () => {
  it("lists equal hops, divisors and divisor pairs", () => {
    expect(landings(6, 40)).toEqual([6, 12, 18, 24, 30, 36]);
    expect(divisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(divisorPairs(12)).toEqual([
      [1, 12],
      [2, 6],
      [3, 4],
    ]);
    expect(divisorPairs(16)).toEqual([
      [1, 16],
      [2, 8],
      [4, 4],
    ]);
  });

  it("accepts a bag size that fits (or leaves items) as asked, and solves it", () => {
    const fits = validators.tui;
    expect(fits({ size: 3 }, { total: 24, fits: 1 })).toBe(true);
    expect(fits({ size: 5 }, { total: 24, fits: 1 })).toBe(false);
    expect(fits({ size: 5 }, { total: 24, fits: 0 })).toBe(true);
    expect(fits({}, { total: 24, fits: 1 })).toBe(false);
    for (const total of [12, 24, 25, 21]) {
      for (const want of [0, 1]) {
        const { size } = solutions.tui({ total, fits: want });
        expect(size).toBeGreaterThanOrEqual(BAG_RANGE.min);
        expect(size).toBeLessThanOrEqual(BAG_RANGE.max);
        expect(fits({ size }, { total, fits: want })).toBe(true);
      }
    }
  });
});

describe("BagTry", () => {
  it("reports the bag size and ends on a closing line only when nothing is left", () => {
    const onStateChange = vi.fn();
    render(<BagTry total={21} goal onStateChange={onStateChange} />);
    expect(screen.getByText(/còn thừa 1/)).toBeInTheDocument();
    expect(screen.queryByText(/Xong rồi/)).toBeNull();
    const up = screen.getByRole("button", { name: "Tăng mỗi túi có" });
    fireEvent.click(up);
    expect(onStateChange).toHaveBeenLastCalledWith({ size: 3 });
    expect(
      screen.getByText(/Xong rồi! 21 cái vừa hết 7 túi 3 cái/),
    ).toBeInTheDocument();
    expect(screen.getByText("Đã thử 2 cỡ túi")).toBeInTheDocument();
  });

  it("draws the task's own total when params are given", () => {
    render(<BagTry total={21} goal={false} params={{ total: 25 }} />);
    expect(screen.getByText("25 cái kẹo, mỗi túi 2 cái")).toBeInTheDocument();
  });
});

describe("the lesson catalog", () => {
  it("gives every interactive kind the validator its exercises use", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (!(spec.kind in VALIDATOR_IDS)) continue;
      const id = `quan-he-chia-het-va-tinh-chat.visual.${key}`;
      const validatorId =
        VALIDATOR_IDS[spec.kind as keyof typeof VALIDATOR_IDS];
      expect(visualRegistry[id]?.validators?.[validatorId], id).toBeDefined();
      expect(visualRegistry[id]?.solutions?.[validatorId], id).toBeDefined();
    }
  });

  it("keeps the pick screens' chips within what the exercises param", () => {
    for (const spec of Object.values(VISUAL_SPECS)) {
      if (spec.kind !== "chips" || spec.wants === undefined) continue;
      expect(spec.wants.every((i) => i < spec.items.length)).toBe(true);
    }
  });
});
