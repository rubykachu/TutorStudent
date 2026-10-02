import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VISUAL_SPECS } from "@/visuals/math/phep-nhan-so-nguyen/catalog";
import { fromSpec } from "@/visuals/math/phep-nhan-so-nguyen/examples";
import {
  FactorTry,
  patternText,
  rowTex,
} from "@/visuals/math/phep-nhan-so-nguyen/factor-try";
import {
  JumpTry,
  walkedText,
} from "@/visuals/math/phep-nhan-so-nguyen/jump-try";
import {
  datThuaSo,
  solveDatThuaSo,
} from "@/visuals/math/phep-nhan-so-nguyen/logic";

describe("JumpTry", () => {
  const spec = {
    from: -8,
    to: 8,
    label: "Trục số",
    step: 3,
    start: 0,
    goal: -6,
  } as const;

  it("reports the start tick at once", () => {
    const onStateChange = vi.fn();
    render(<JumpTry spec={spec} params={{}} onStateChange={onStateChange} />);
    expect(onStateChange).toHaveBeenCalledWith({ p0: 0 });
  });

  it("names the buttons and shows the amount of a jump", () => {
    render(<JumpTry spec={spec} params={{}} />);
    const left = screen.getByRole("button", { name: "Sang trái 3 đơn vị" });
    const right = screen.getByRole("button", { name: "Sang phải 3 đơn vị" });
    expect(left).toHaveTextContent("−3");
    expect(right).toHaveTextContent("+3");
  });

  it("moves the point `step` ticks per press and counts the jumps", () => {
    const onStateChange = vi.fn();
    render(<JumpTry spec={spec} params={{}} onStateChange={onStateChange} />);
    const left = screen.getByRole("button", { name: /Sang trái/ });
    fireEvent.click(left);
    fireEvent.click(left);
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: -6 });
    expect(
      screen.getByText("Đã đi sang trái 2 lần, mỗi lần 3 đơn vị"),
    ).toBeInTheDocument();
  });

  it("clamps a jump at the ends of the line", () => {
    const onStateChange = vi.fn();
    render(
      <JumpTry
        spec={{ ...spec, step: 3, start: 6 }}
        params={{}}
        onStateChange={onStateChange}
      />,
    );
    const right = screen.getByRole("button", { name: /Sang phải/ });
    fireEvent.click(right);
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: 8 });
    expect(right).toBeDisabled();
  });

  it("shows the state it is given and locks", () => {
    render(<JumpTry spec={spec} params={{}} shownState={{ p0: -6 }} />);
    expect(screen.getByRole("button", { name: /Sang trái/ })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(/−6/);
  });

  it("words the walk", () => {
    expect(walkedText(0, 0, 3)).toBe("Chưa bấm lần nào");
    expect(walkedText(0, 6, 3)).toBe("Đã đi sang phải 2 lần, mỗi lần 3 đơn vị");
    expect(walkedText(2, -4, 2)).toBe(
      "Đã đi sang trái 3 lần, mỗi lần 2 đơn vị",
    );
  });
});

describe("FactorTry", () => {
  const spec = {
    label: "Bảng tích",
    first: 3,
    start: 3,
    min: -4,
    goal: -1,
  } as const;
  const down = () =>
    screen.getByRole("button", { name: "Giảm thừa số thứ hai 1 đơn vị" });
  const up = () =>
    screen.getByRole("button", { name: "Tăng thừa số thứ hai 1 đơn vị" });

  it("opens on one row and reports the start", () => {
    const onStateChange = vi.fn();
    render(<FactorTry spec={spec} params={{}} onStateChange={onStateChange} />);
    expect(onStateChange).toHaveBeenCalledWith({ n: 3 });
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
    expect(up()).toBeDisabled();
  });

  it("adds a row per press down and takes one away per press up", () => {
    const onStateChange = vi.fn();
    render(<FactorTry spec={spec} params={{}} onStateChange={onStateChange} />);
    fireEvent.click(down());
    fireEvent.click(down());
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(onStateChange).toHaveBeenLastCalledWith({ n: 1 });
    expect(
      screen.getByText("Mỗi lần thừa số thứ hai giảm 1, tích giảm 3"),
    ).toBeInTheDocument();
    fireEvent.click(up());
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(onStateChange).toHaveBeenLastCalledWith({ n: 2 });
  });

  it("stops at the smallest factor, with up to eight rows", () => {
    render(<FactorTry spec={spec} params={{}} />);
    for (let i = 0; i < 10; i++) {
      if (!(down() as HTMLButtonElement).disabled) fireEvent.click(down());
    }
    expect(screen.getAllByRole("listitem")).toHaveLength(8);
    expect(down()).toBeDisabled();
  });

  it("says the product grows when the first factor is negative", () => {
    render(<FactorTry spec={{ ...spec, first: -3 }} params={{}} />);
    fireEvent.click(down());
    expect(
      screen.getByText("Mỗi lần thừa số thứ hai giảm 1, tích tăng 3"),
    ).toBeInTheDocument();
  });

  it("shows the state it is given and locks", () => {
    render(<FactorTry spec={spec} params={{}} shownState={{ n: 1 }} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(down()).toBeDisabled();
    expect(up()).toBeDisabled();
  });

  it("writes negative numbers in brackets and colours the product by sign", () => {
    expect(rowTex(3, 3)).toBe("3 \\cdot 3 = \\concept{lime}{9}");
    expect(rowTex(3, -1)).toBe("3 \\cdot (-1) = \\concept{pink}{-3}");
    expect(rowTex(-3, 2)).toBe("(-3) \\cdot 2 = \\concept{pink}{-6}");
    expect(rowTex(3, 0)).toBe("3 \\cdot 0 = \\concept{slate}{0}");
    expect(rowTex(-3, -2)).toBe("(-3) \\cdot (-2) = \\concept{lime}{6}");
  });

  it("describes the step of the pattern", () => {
    expect(patternText(4)).toBe("Mỗi lần thừa số thứ hai giảm 1, tích giảm 4");
    expect(patternText(-2)).toBe("Mỗi lần thừa số thứ hai giảm 1, tích tăng 2");
  });
});

describe("datThuaSo", () => {
  it("accepts the table only on the wanted second factor", () => {
    expect(datThuaSo({ n: -1 }, { n: -1 })).toBe(true);
    expect(datThuaSo({ n: 0 }, { n: -1 })).toBe(false);
    expect(datThuaSo({}, { n: -1 })).toBe(false);
  });

  it("is satisfied by its solver", () => {
    for (const n of [-3, 0, 2]) {
      expect(datThuaSo(solveDatThuaSo({ n }), { n })).toBe(true);
    }
  });
});

describe("the catalog", () => {
  it.each(Object.entries(VISUAL_SPECS))("%s renders", (_key, spec) => {
    const Visual = fromSpec(spec);
    const { container } = render(<Visual />);
    expect(container.firstChild).not.toBeNull();
  });

  it("keeps every walk and table the child makes inside its range", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (spec.kind === "jumpTry") {
        const inside = (tick: number) => tick >= spec.from && tick <= spec.to;
        expect(inside(spec.start), key).toBe(true);
        if (spec.goal !== undefined) {
          expect(inside(spec.goal), key).toBe(true);
          expect(Math.abs((spec.goal - spec.start) % spec.step), key).toBe(0);
        }
      }
      if (spec.kind === "factorTry" && spec.goal !== undefined) {
        expect(spec.goal, key).toBeGreaterThanOrEqual(spec.min);
        expect(spec.goal, key).toBeLessThanOrEqual(spec.start);
      }
    }
  });
});
