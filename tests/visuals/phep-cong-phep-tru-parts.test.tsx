import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VISUAL_STEP_MS } from "@/lib/config";
import {
  BarModel,
  EquationLabels,
  EquationTap,
  Sticker,
  Swap,
  ZeroWallet,
} from "@/visuals/math/phep-cong-phep-tru/parts";
import type { StepsMode } from "@/visuals/math/phep-cong-phep-tru/types";
import { RegionProvider } from "@/visuals/shared/region";

const MODES: StepsMode[] = ["still", "hint", "full"];

// Plays a StepPlayer visual to its last step.
function playToEnd(steps: number) {
  // One act per step: each step's timer is set only after the previous
  // step has rendered.
  for (let i = 0; i < steps; i++) {
    act(() => {
      vi.advanceTimersByTime(VISUAL_STEP_MS);
    });
  }
}

afterEach(() => {
  vi.useRealTimers();
});

describe("static pictures", () => {
  it("names the parts of an addition and of a subtraction", () => {
    const add = render(<EquationLabels op="add" a={13} b={29} />);
    expect(add.getByRole("img")).toBeInTheDocument();
    expect(add.container.textContent).toContain("Số hạng");
    expect(add.container.textContent).toContain("Tổng");
    add.unmount();
    const sub = render(<EquationLabels op="sub" a={42} b={13} />);
    for (const name of ["Số bị trừ", "Số trừ", "Hiệu"]) {
      expect(sub.container.textContent).toContain(name);
    }
  });

  it("shows n + 0, 0 + n and n − 0", () => {
    const { container } = render(<ZeroWallet n={7} />);
    expect(container.textContent).toContain("7+0=7");
    expect(container.textContent).toContain("0+7=7");
    expect(container.textContent).toContain("7−0=7");
  });

  it.each([
    [5, 5],
    [8, 8],
    [12, 8],
  ])("draws min(n, 8) slate coins per wallet for n = %i", (n, coins) => {
    const { container } = render(<ZeroWallet n={n} />);
    // Three wallets, each with `coins` coins and one dashed slot for 0.
    expect(
      container.querySelectorAll("circle.fill-concept-slate"),
    ).toHaveLength(3 * coins);
    expect(container.querySelectorAll("circle.fill-none")).toHaveLength(3);
    expect(container.innerHTML).not.toContain("fill-concept-amber");
  });

  it("renders the sticker", () => {
    const { getByRole } = render(<Sticker />);
    expect(getByRole("img")).toBeInTheDocument();
  });
});

describe("EquationTap", () => {
  it.each(["add", "sub"] as const)(
    "draws the %s equation as three regions in reading order",
    (op) => {
      const { container } = render(<EquationTap op={op} a={42} b={13} />);
      const ids = [...container.querySelectorAll("[data-region]")].map((el) =>
        el.getAttribute("data-region"),
      );
      expect(ids).toEqual(["first", "second", "result"]);
    },
  );

  it("uses no concept colours, so the colours answer nothing", () => {
    const { container } = render(<EquationTap op="add" a={13} b={29} />);
    expect(container.innerHTML).not.toContain("concept-");
  });

  it("makes each region a button when tappable", () => {
    const onToggle = vi.fn();
    const { getAllByRole } = render(
      <RegionProvider
        value={{
          selected: new Set(),
          revealed: new Set(),
          marks: new Map(),
          disabled: false,
          onToggle,
        }}
      >
        <EquationTap op="sub" a={42} b={13} />
      </RegionProvider>,
    );
    const buttons = getAllByRole("button");
    expect(buttons).toHaveLength(3);
    fireEvent.click(buttons[2] as Element);
    expect(onToggle).toHaveBeenCalledWith("result");
  });
});

describe.each(MODES)("BarModel and Swap in %s mode", (mode) => {
  it.each([
    ["add", 13, 29],
    ["sub", 42, 13],
  ] as const)("renders the %s bar model", (op, a, b) => {
    const { container } = render(<BarModel op={op} a={a} b={b} mode={mode} />);
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("renders the swap", () => {
    const { container } = render(<Swap a={13} b={29} mode={mode} />);
    expect(container.textContent).toContain("13");
  });
});

describe("hint mode keeps the answer back", () => {
  it("BarModel of 13 + 29 stops at step 1 and never shows 42", () => {
    vi.useFakeTimers();
    const { container } = render(
      <BarModel op="add" a={13} b={29} mode="hint" />,
    );
    playToEnd(3);
    expect(
      container.querySelector("[data-step]")?.getAttribute("data-step"),
    ).toBe("1");
    expect(container.textContent).not.toContain("42");
    expect(container.textContent).toContain("?");
  });

  it("BarModel of 71 − 29 never shows 42", () => {
    vi.useFakeTimers();
    const { container } = render(
      <BarModel op="sub" a={71} b={29} mode="hint" />,
    );
    playToEnd(3);
    expect(container.textContent).not.toContain("42");
  });

  it("full BarModel reaches the answer", () => {
    vi.useFakeTimers();
    const { container } = render(
      <BarModel op="add" a={13} b={29} mode="full" />,
    );
    playToEnd(3);
    expect(container.textContent).toContain("42");
  });

  it("Swap of 13 + 29 never shows 42 in hint mode, and does in full", () => {
    vi.useFakeTimers();
    const hint = render(<Swap a={13} b={29} mode="hint" />);
    playToEnd(4);
    expect(hint.container.textContent).not.toContain("42");
    hint.unmount();
    const full = render(<Swap a={13} b={29} mode="full" />);
    playToEnd(4);
    expect(full.container.textContent).toContain("42");
  });
});
