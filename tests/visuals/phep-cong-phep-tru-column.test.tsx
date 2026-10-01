import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Column, ColumnTry } from "@/visuals/math/phep-cong-phep-tru/column";
import {
  columnModel,
  columnStep,
  expectedColumn,
  solveColumnStep,
} from "@/visuals/math/phep-cong-phep-tru/column-validators";
import type { StepsMode } from "@/visuals/math/phep-cong-phep-tru/types";

describe("expectedColumn", () => {
  it("follows a carry chain of an addition", () => {
    // 958 + 467 = 1425
    expect(expectedColumn("add", 958, 467, 0)).toEqual({ digit: 5, carry: 1 });
    expect(expectedColumn("add", 958, 467, 1)).toEqual({ digit: 2, carry: 1 });
    expect(expectedColumn("add", 958, 467, 2)).toEqual({ digit: 4, carry: 1 });
  });

  it("puts the last carry in front as a new leading digit", () => {
    expect(expectedColumn("add", 958, 467, 3)).toEqual({ digit: 1, carry: 0 });
    expect(expectedColumn("add", 123, 45, 3)).toEqual({ digit: 0, carry: 0 });
  });

  it("handles numbers of different length", () => {
    // 356 + 78 = 434
    expect(expectedColumn("add", 356, 78, 2)).toEqual({ digit: 4, carry: 0 });
  });

  it("follows a borrow chain of a subtraction", () => {
    // 532 − 247 = 285
    expect(expectedColumn("sub", 532, 247, 0)).toEqual({ digit: 5, carry: 1 });
    expect(expectedColumn("sub", 532, 247, 1)).toEqual({ digit: 8, carry: 1 });
    expect(expectedColumn("sub", 532, 247, 2)).toEqual({ digit: 2, carry: 0 });
  });

  it("borrows across a zero", () => {
    // 703 − 268 = 435
    expect(expectedColumn("sub", 703, 268, 0)).toEqual({ digit: 5, carry: 1 });
    expect(expectedColumn("sub", 703, 268, 1)).toEqual({ digit: 3, carry: 1 });
    expect(expectedColumn("sub", 703, 268, 2)).toEqual({ digit: 4, carry: 0 });
  });

  it("rejects a subtraction with a smaller first number", () => {
    expect(() => columnModel("sub", 3, 5)).toThrow(RangeError);
  });
});

describe("column validators", () => {
  it("accept only the digit and carry of the params", () => {
    expect(columnStep({ digit: 5, carry: 1 }, { digit: 5, carry: 1 })).toBe(
      true,
    );
    expect(columnStep({ digit: 5, carry: 0 }, { digit: 5, carry: 1 })).toBe(
      false,
    );
    expect(solveColumnStep({ digit: 2, carry: 0 })).toEqual({
      digit: 2,
      carry: 0,
    });
  });
});

describe("ColumnTry", () => {
  it("reports digit and carry and satisfies the validator", () => {
    const onStateChange = vi.fn();
    render(
      <ColumnTry
        op="add"
        a={958}
        b={467}
        column={0}
        params={{}}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("Chọn chữ số viết và số nhớ.")).toBeInTheDocument();
    const up = screen.getByRole("button", { name: "Tăng chữ số viết" });
    for (let i = 0; i < 5; i++) fireEvent.click(up);
    fireEvent.click(screen.getByRole("button", { name: "Tăng số nhớ" }));
    const state = onStateChange.mock.lastCall?.[0];
    expect(state).toEqual({ digit: 5, carry: 1 });
    expect(columnStep(state, expectedColumn("add", 958, 467, 0))).toBe(true);
    expect(screen.getByText("Đúng rồi.")).toBeInTheDocument();
  });

  it("includes the borrow coming into a subtraction column", () => {
    const onStateChange = vi.fn();
    render(
      <ColumnTry
        op="sub"
        a={703}
        b={268}
        column={1}
        params={{}}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("0 không bớt được 1")).toBeInTheDocument();
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByRole("button", { name: "Tăng chữ số viết" }));
    }
    fireEvent.click(screen.getByRole("button", { name: "Tăng số mượn" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ digit: 3, carry: 1 });
    expect(screen.getByText("Đúng rồi.")).toBeInTheDocument();
  });

  it("keeps the working digit as ? until the child changes something", () => {
    render(<ColumnTry op="add" a={58} b={27} column={0} />);
    const grid = screen.getByRole("img");
    expect(grid.textContent).toContain("?");
    expect(grid.querySelector(".text-concept-amber")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Tăng chữ số viết" }));
    expect(grid.querySelector(".text-concept-amber")?.textContent).toBe("1");
  });

  it("shows a given state read only", () => {
    render(
      <ColumnTry
        op="add"
        a={58}
        b={27}
        column={0}
        params={{}}
        shownState={{ digit: 5, carry: 1 }}
      />,
    );
    expect(screen.getByRole("button", { name: "Tăng số nhớ" })).toBeDisabled();
    expect(screen.getByText("Đúng rồi.")).toBeInTheDocument();
  });
});

describe("Column borrow chips", () => {
  it("shows -1 +10 on a place that lends and borrows, +10 on one that only borrows", () => {
    // 532 − 247: units borrow only, tens lend and borrow, hundreds only lend.
    render(<Column op="sub" a={532} b={247} mode="still" />);
    expect(screen.getByText("+10")).toBeInTheDocument();
    expect(screen.getByText("−1 +10")).toBeInTheDocument();
  });
});

describe("Column", () => {
  const modes: StepsMode[] = ["still", "full", "hint"];
  const cases = [
    { op: "add", a: 958, b: 467 },
    { op: "add", a: 356, b: 78 },
    { op: "sub", a: 532, b: 247 },
    { op: "sub", a: 703, b: 268 },
    { op: "sub", a: 532, b: 530 },
  ] as const;

  it.each(cases.flatMap((c) => modes.map((mode) => ({ ...c, mode }))))(
    "renders $op $a $b in mode $mode",
    ({ op, a, b, mode }) => {
      render(<Column op={op} a={a} b={b} mode={mode} />);
      expect(screen.getAllByRole("img").length).toBeGreaterThan(0);
    },
  );

  it("has one step per place plus the numbers set out", () => {
    expect(columnModel("add", 958, 467).active + 1).toBe(4);
    expect(columnModel("sub", 532, 530).active + 1).toBe(2);
  });

  it("shows the answer in still mode and leaves it as ? in hint mode", () => {
    const still = render(<Column op="add" a={958} b={467} mode="still" />);
    expect(still.container.textContent).toContain("1425");
    still.unmount();
    const hint = render(<Column op="add" a={958} b={467} mode="hint" />);
    expect(hint.container.textContent).not.toContain("1425");
  });
});
