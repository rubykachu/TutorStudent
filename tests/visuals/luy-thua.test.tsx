import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatInteger } from "@/lib/number-format";
import {
  boardState,
  grainsEqual,
  grainsOn,
} from "@/visuals/math/luy-thua/grains";
import {
  exponentDifference,
  exponentSum,
  solveExponentDifference,
  solveExponentSum,
} from "@/visuals/math/luy-thua/validators";
import { visualRegistry } from "@/visuals/registry";

describe("chessboard grains", () => {
  it("doubles from one grain and stays exact on the last square", () => {
    expect(grainsOn(1)).toBe(BigInt(1));
    expect(grainsOn(5)).toBe(BigInt(16));
    expect(formatInteger(grainsOn(64))).toBe("9 223 372 036 854 775 808");
    expect(boardState(64)).toEqual({ square: 64 });
  });

  it("accepts only the square with the asked number of grains", () => {
    expect(grainsEqual({ square: 5, grains: 16 }, { grains: 16 })).toBe(true);
    expect(grainsEqual({ square: 4, grains: 8 }, { grains: 16 })).toBe(false);
    expect(grainsEqual({}, { grains: 16 })).toBe(false);
  });

  it("walks the board with the buttons and reports the square", async () => {
    const entry = visualRegistry["luy-thua.visual.ban-co"];
    if (!entry) throw new Error("chessboard missing");
    const { default: BanCo } = await entry.load();
    const onStateChange = vi.fn();
    render(<BanCo onStateChange={onStateChange} />);
    const next = screen.getByRole("button", { name: "Ô sau" });
    for (let i = 0; i < 4; i++) fireEvent.click(next);
    expect(onStateChange).toHaveBeenLastCalledWith({ square: 5, grains: 16 });
    expect(screen.getByText("= 16 hạt")).toBeInTheDocument();
  });
});

describe("exponent builders", () => {
  it("accept any split of the exponent sum", () => {
    expect(exponentSum({ m: 1, n: 4 }, { total: 5 })).toBe(true);
    expect(exponentSum({ m: 2, n: 2 }, { total: 5 })).toBe(false);
    expect(solveExponentSum({ total: 7 })).toEqual({ m: 3, n: 4 });
  });

  it("accept a quotient only when the dividend's exponent is not smaller", () => {
    expect(exponentDifference({ m: 3, n: 3 }, { rest: 0 })).toBe(true);
    expect(exponentDifference({ m: 2, n: 4 }, { rest: -2 })).toBe(false);
    expect(solveExponentDifference({ rest: 5 })).toEqual({ m: 6, n: 1 });
  });

  it("keeps the divisor's exponent within the dividend's", async () => {
    const entry = visualRegistry["luy-thua.visual.bot-luy-thua"];
    if (!entry) throw new Error("divider missing");
    const { default: Divider } = await entry.load();
    const onStateChange = vi.fn();
    render(<Divider onStateChange={onStateChange} />);
    const lowerFirst = screen.getByRole("button", {
      name: "Giảm số mũ thứ nhất",
    });
    for (let i = 0; i < 3; i++) fireEvent.click(lowerFirst);
    expect(onStateChange).toHaveBeenLastCalledWith({ m: 1, n: 1 });
    expect(
      screen.getByRole("button", { name: "Tăng số mũ thứ hai" }),
    ).toBeDisabled();
  });
});
