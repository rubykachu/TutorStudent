import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { VISUAL_STEP_MS } from "@/lib/config";
import { FactFamily, FindX } from "@/visuals/math/phep-cong-phep-tru/find";
import {
  pairRound,
  shiftRound,
  solvePairRound,
  solveShiftRound,
} from "@/visuals/math/phep-cong-phep-tru/pair-validators";
import { PairTry, Regroup } from "@/visuals/math/phep-cong-phep-tru/regroup";
import { Shift, ShiftTry } from "@/visuals/math/phep-cong-phep-tru/shift";
import type { StepsMode } from "@/visuals/math/phep-cong-phep-tru/types";

const MODES: StepsMode[] = ["still", "full", "hint"];
const PAIR_PARAMS = { unit: 100, n0: 34, n1: 268, n2: 66 };

describe("pairRound", () => {
  it("accepts exactly two picks with a round sum", () => {
    expect(pairRound({ pick0: 1, pick1: 0, pick2: 1 }, PAIR_PARAMS)).toBe(true);
  });

  it("rejects a pair whose sum is not round", () => {
    expect(pairRound({ pick0: 1, pick1: 1, pick2: 0 }, PAIR_PARAMS)).toBe(
      false,
    );
  });

  it("rejects three picks, one pick and none", () => {
    expect(pairRound({ pick0: 1, pick1: 1, pick2: 1 }, PAIR_PARAMS)).toBe(
      false,
    );
    expect(pairRound({ pick0: 1 }, PAIR_PARAMS)).toBe(false);
    expect(pairRound({}, PAIR_PARAMS)).toBe(false);
  });

  it("solves to the first round pair, which it accepts", () => {
    const solved = solvePairRound(PAIR_PARAMS);
    expect(solved).toEqual({ pick0: 1, pick2: 1 });
    expect(pairRound(solved, PAIR_PARAMS)).toBe(true);
    const tens = { unit: 10, n0: 35, n1: 37, n2: 39, n3: 41, n4: 43 };
    expect(solvePairRound(tens)).toEqual({ pick1: 1, pick4: 1 });
    expect(pairRound(solvePairRound(tens), tens)).toBe(true);
  });
});

describe("shiftRound", () => {
  const params = { a: 38, b: 47, unit: 10 };

  it("accepts k that makes the second number round and leaves the first", () => {
    expect(shiftRound({ k: 3 }, params)).toBe(true);
    expect(shiftRound({ k: 2 }, params)).toBe(false);
    expect(shiftRound({ k: 0 }, params)).toBe(false);
    expect(shiftRound({ k: 1.5 }, params)).toBe(false);
    expect(shiftRound({}, params)).toBe(false);
    expect(shiftRound({ k: 5 }, { a: 5, b: 45, unit: 10 })).toBe(false);
  });

  it("solves to a k it accepts, and to a full unit when already round", () => {
    expect(solveShiftRound(params)).toEqual({ k: 3 });
    expect(shiftRound(solveShiftRound(params), params)).toBe(true);
    expect(solveShiftRound({ a: 38, b: 50, unit: 10 })).toEqual({ k: 10 });
  });
});

describe("PairTry", () => {
  it("reports the picks and shows the sum with its badge", () => {
    const onStateChange = vi.fn();
    render(
      <PairTry
        numbers={[21, 40, 79]}
        unit={100}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("Chọn hai số có tổng tròn trăm.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "21" }));
    expect(onStateChange).toHaveBeenLastCalledWith({
      pick0: 1,
      pick1: 0,
      pick2: 0,
    });
    fireEvent.click(screen.getByRole("button", { name: "40" }));
    expect(screen.getByText("Chưa tròn")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "40" }));
    fireEvent.click(screen.getByRole("button", { name: "79" }));
    expect(onStateChange).toHaveBeenLastCalledWith({
      pick0: 1,
      pick1: 0,
      pick2: 1,
    });
    expect(screen.getByText("Tròn trăm", { exact: false })).toBeVisible();
    expect(screen.getByText("Đúng rồi.")).toBeVisible();
  });

  it("asks for exactly two when three are picked", () => {
    render(<PairTry numbers={[21, 40, 79]} unit={10} />);
    for (const name of ["21", "40", "79"]) {
      fireEvent.click(screen.getByRole("button", { name }));
    }
    expect(screen.getByText("Chọn đúng hai số.")).toBeVisible();
  });

  it("draws shownState read only and locks when disabled", () => {
    render(
      <PairTry
        numbers={[21, 40, 79]}
        unit={100}
        shownState={{ pick0: 1, pick2: 1 }}
      />,
    );
    const first = screen.getByRole("button", { name: "21" });
    expect(first).toHaveAttribute("aria-pressed", "true");
    expect(first).toBeDisabled();
  });
});

describe("ShiftTry", () => {
  it("reports { k } and meets shiftRound for 38 + 47 at k = 3", () => {
    const onStateChange = vi.fn();
    render(<ShiftTry a={38} b={47} unit={10} onStateChange={onStateChange} />);
    const up = screen.getByRole("button", { name: "Tăng số chuyển" });
    fireEvent.click(up);
    fireEvent.click(up);
    expect(onStateChange).toHaveBeenLastCalledWith({ k: 2 });
    expect(screen.getByText("Chưa tròn")).toBeVisible();
    fireEvent.click(up);
    const last = onStateChange.mock.lastCall?.[0];
    expect(last).toEqual({ k: 3 });
    expect(shiftRound(last, { a: 38, b: 47, unit: 10 })).toBe(true);
    expect(screen.getByText("Đúng rồi.")).toBeVisible();
    expect(screen.getByText("Tròn chục", { exact: false })).toBeVisible();
  });

  it("locks the stepper when disabled", () => {
    render(<ShiftTry a={38} b={47} unit={10} disabled />);
    expect(
      screen.getByRole("button", { name: "Tăng số chuyển" }),
    ).toBeDisabled();
  });
});

describe("pictures render in every mode", () => {
  it.each(MODES)("Regroup, %s", (mode) => {
    const { container, unmount } = render(
      <Regroup numbers={[34, 268, 66]} groups={[[0, 2]]} mode={mode} />,
    );
    expect(container.textContent).not.toContain("…");
    unmount();
    render(
      <Regroup
        numbers={[35, 37, 39, 41, 43]}
        groups={[
          [1, 4],
          [2, 3],
        ]}
        mode={mode}
      />,
    );
  });

  it.each(MODES)("Shift, %s", (mode) => {
    for (const props of [
      { op: "add", a: 38, b: 47, delta: 2 },
      { op: "add", a: 38, b: 47, delta: -2 },
      { op: "sub", a: 55, b: 18, delta: 2 },
      { op: "sub", a: 55, b: 18, delta: -3 },
    ] as const) {
      const { unmount } = render(<Shift {...props} mode={mode} />);
      unmount();
    }
  });

  it.each(MODES)("FindX, %s", (mode) => {
    for (const form of ["add", "subLeft", "subRight"] as const) {
      const { unmount } = render(
        <FindX
          form={form}
          a={135}
          t={form === "add" ? 420 : 285}
          mode={mode}
        />,
      );
      unmount();
    }
    render(<FactFamily total={100} p1={35} p2={65} mode={mode} />);
  });
});

// Lets the step player run through every step on its own.
function playToEnd() {
  for (let i = 0; i < 5; i++) {
    act(() => {
      vi.advanceTimersByTime(VISUAL_STEP_MS);
    });
  }
}

describe("hint mode never shows the answer", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("Regroup keeps the total as ?", () => {
    render(<Regroup numbers={[34, 268, 66]} groups={[[0, 2]]} mode="hint" />);
    playToEnd();
    const text = document.body.textContent ?? "";
    expect(text).toContain("268+100=?");
    expect(text).not.toContain("368");
  });

  it("Shift keeps the result as ?", () => {
    render(<Shift op="sub" a={55} b={18} delta={2} mode="hint" />);
    playToEnd();
    const text = document.body.textContent ?? "";
    expect(text).toContain("57−20=?");
    expect(text).not.toContain("37");
  });

  it("FindX keeps x as ?", () => {
    render(<FindX form="add" a={135} t={420} mode="hint" />);
    playToEnd();
    const text = document.body.textContent ?? "";
    expect(text).toContain("x =420−135");
    expect(text).not.toContain("285");
  });

  it("FactFamily leaves the last subtraction's result as ?", () => {
    render(<FactFamily total={100} p1={35} p2={65} mode="hint" />);
    playToEnd();
    const text = document.body.textContent ?? "";
    expect(text).toContain("100−35=65");
    expect(text).toContain("100−65=?");
  });
});

describe("still mode shows everything", () => {
  it("Regroup prints the sums and the total", () => {
    render(<Regroup numbers={[34, 268, 66]} groups={[[0, 2]]} mode="still" />);
    expect(screen.getByText("368")).toBeInTheDocument();
    expect(screen.getAllByText("100").length).toBeGreaterThan(0);
  });

  it("FindX prints x", () => {
    render(<FindX form="add" a={135} t={420} mode="still" />);
    expect(document.body.textContent).toContain("285");
  });
});
