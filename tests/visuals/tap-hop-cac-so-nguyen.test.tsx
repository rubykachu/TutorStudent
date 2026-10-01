import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VISUAL_SPECS } from "@/visuals/math/tap-hop-cac-so-nguyen/catalog";
import { LineTap } from "@/visuals/math/tap-hop-cac-so-nguyen/line-tap";
import { LineTry } from "@/visuals/math/tap-hop-cac-so-nguyen/line-try";
import {
  datDiem,
  lineTapRegions,
  neighbour,
  solutions,
  solveDatDiem,
  validators,
} from "@/visuals/math/tap-hop-cac-so-nguyen/logic";
import {
  Scale,
  scaleHeight,
  scaleY,
} from "@/visuals/math/tap-hop-cac-so-nguyen/scale";
import { RegionProvider } from "@/visuals/shared/region";

const range = { from: -5, to: 5 } as const;

describe("the place-the-points exercise", () => {
  const params = { p0: -3, p1: 4 };

  it("accepts exactly the wanted values, negative ones included", () => {
    expect(datDiem({ p0: -3, p1: 4 }, params)).toBe(true);
    expect(datDiem({ p0: 3, p1: 4 }, params)).toBe(false);
    expect(datDiem({ p0: -3, p1: -4 }, params)).toBe(false);
  });

  it("rejects a missing or an extra point", () => {
    expect(datDiem({ p0: -3 }, params)).toBe(false);
    expect(datDiem({}, params)).toBe(false);
    expect(datDiem({ p0: -3, p1: 4, p2: 0 }, params)).toBe(false);
  });

  it("solves to a state the validator accepts", () => {
    const solved = solveDatDiem(params);
    expect(solved).toEqual({ p0: -3, p1: 4 });
    expect(validators["dat-diem"](solved, params)).toBe(true);
    expect(solutions["dat-diem"](params)).toEqual(solved);
  });

  it("moves a point one tick and stops at both ends", () => {
    expect(neighbour(range, 0, "down")).toBe(-1);
    expect(neighbour(range, 0, "up")).toBe(1);
    expect(neighbour(range, -5, "down")).toBe(-5);
    expect(neighbour(range, 5, "up")).toBe(5);
  });
});

describe("LineTry", () => {
  const spec = { ...range, label: "Trục số", names: ["A", "B"] };

  it("reports the opening state at once, every point on the origin", () => {
    const onStateChange = vi.fn();
    render(
      <LineTry
        spec={spec}
        params={{ p0: -3, p1: 4 }}
        onStateChange={onStateChange}
      />,
    );
    expect(onStateChange).toHaveBeenCalledWith({ p0: 0, p1: 0 });
  });

  it("moves a point one tick per press, left to a negative number", () => {
    const onStateChange = vi.fn();
    render(
      <LineTry
        spec={spec}
        params={{ p0: -3, p1: 4 }}
        onStateChange={onStateChange}
      />,
    );
    const leftA = screen.getByRole("button", {
      name: "Sang trái một vạch, điểm A",
    });
    for (let i = 0; i < 3; i++) fireEvent.click(leftA);
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: -3, p1: 0 });
    fireEvent.click(
      screen.getByRole("button", { name: "Sang phải một vạch, điểm A" }),
    );
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: -2, p1: 0 });
    fireEvent.click(
      screen.getByRole("button", { name: "Sang phải một vạch, điểm B" }),
    );
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: -2, p1: 1 });
  });

  it("shows the value of a point with the minus sign", () => {
    render(<LineTry spec={spec} params={{}} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Sang trái một vạch, điểm A" }),
    );
    expect(screen.getAllByText("−1").length).toBeGreaterThan(0);
  });

  it("stops at both ends of the line", () => {
    render(<LineTry spec={spec} params={{}} />);
    const left = screen.getByRole("button", {
      name: "Sang trái một vạch, điểm A",
    });
    for (let i = 0; i < 8; i++) fireEvent.click(left);
    expect(left).toBeDisabled();
  });

  it("marks each stepper with its key so the walk can drive it", () => {
    const { container } = render(<LineTry spec={spec} params={{}} />);
    expect(container.querySelector('[data-state-key="p0"]')).not.toBeNull();
    expect(
      container.querySelectorAll('[data-state-key="p1"] [data-state-step]'),
    ).toHaveLength(2);
  });

  it("draws the shown answer, locks and does not report a state", () => {
    const onStateChange = vi.fn();
    render(
      <LineTry
        spec={spec}
        params={{ p0: -3, p1: 4 }}
        shownState={{ p0: -3, p1: 4 }}
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Trục số: điểm A ở −3, điểm B ở 4",
    );
    expect(
      screen.getByRole("button", { name: "Sang phải một vạch, điểm A" }),
    ).toBeDisabled();
    expect(onStateChange).not.toHaveBeenCalled();
  });

  it("on a lesson screen counts the points set right, never in an exercise", () => {
    const guided = { ...spec, goal: [-2, 1], done: "A ở −2, B ở 1." };
    const first = render(<LineTry spec={guided} />);
    expect(screen.getByText("Đã đặt đúng 0/2 điểm")).toBeInTheDocument();
    const leftA = screen.getByRole("button", {
      name: "Sang trái một vạch, điểm A",
    });
    fireEvent.click(leftA);
    fireEvent.click(leftA);
    fireEvent.click(
      screen.getByRole("button", { name: "Sang phải một vạch, điểm B" }),
    );
    expect(screen.getByText("Đã đặt đúng 2/2 điểm")).toBeInTheDocument();
    expect(screen.getByText("A ở −2, B ở 1.")).toBeInTheDocument();
    first.unmount();

    render(<LineTry spec={guided} params={{ p0: -2, p1: 1 }} />);
    expect(screen.queryByText(/Đã đặt đúng/)).toBeNull();
  });
});

describe("LineTap", () => {
  const spec = {
    ...range,
    label: "Trục số",
    points: [
      { at: -3, name: "A" },
      { at: 3, name: "B" },
    ],
  };

  it("names a region after each point, in lower case", () => {
    expect(lineTapRegions(spec.points)).toEqual(["a", "b"]);
    const { container } = render(<LineTap spec={spec} />);
    expect(
      [...container.querySelectorAll("[data-region]")].map((el) =>
        el.getAttribute("data-region"),
      ),
    ).toEqual(["a", "b"]);
  });

  it("reports a tap on a point", () => {
    const onToggle = vi.fn();
    render(
      <RegionProvider
        value={{
          selected: new Set(),
          revealed: new Set(),
          marks: new Map(),
          disabled: false,
          onToggle,
        }}
      >
        <LineTap spec={spec} />
      </RegionProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Điểm A" }));
    expect(onToggle).toHaveBeenCalledWith("a");
  });
});

describe("Scale", () => {
  const spec = {
    theme: "thermometer",
    from: -5,
    to: 5,
    zero: "0 °C",
    label: "Nhiệt kế",
    marks: [
      { at: 3, text: "3 °C", color: "lime", step: 1 },
      { at: -3, text: "−3 °C", color: "pink", step: 2 },
    ],
    zones: [{ side: "up", tag: "Trên 0", color: "lime", step: 1 }],
    mode: "steps",
  } as const;

  it("puts higher numbers higher and zero in the middle", () => {
    expect(scaleY(spec, 5)).toBeLessThan(scaleY(spec, 0));
    expect(scaleY(spec, 0)).toBeLessThan(scaleY(spec, -5));
    expect(scaleY(spec, 0) - scaleY(spec, 5)).toBe(
      scaleY(spec, -5) - scaleY(spec, 0),
    );
    expect(scaleHeight(spec)).toBeGreaterThan(scaleY(spec, -5));
  });

  it("walks through its marks in steps mode", () => {
    render(<Scale spec={spec} />);
    expect(
      screen.getByRole("figure", { name: "Nhiệt kế" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Bước 1 trên 3")).toBeInTheDocument();
  });

  it("draws everything at once in still mode, the minus as a minus sign", () => {
    const { container } = render(<Scale spec={{ ...spec, mode: "still" }} />);
    expect(container.querySelector("[data-step-player]")).toBeNull();
    expect(container.textContent).toContain("−3 °C");
    expect(container.textContent).toContain("0 °C");
  });

  it("hides the last step in a hint", () => {
    const { container } = render(<Scale spec={{ ...spec, mode: "hint" }} />);
    expect(screen.getByText("Bước 1 trên 2")).toBeInTheDocument();
    const hidden = [...container.querySelectorAll(".invisible")].map(
      (el) => el.textContent,
    );
    expect(hidden.some((text) => text?.includes("−3 °C"))).toBe(true);
  });
});

describe("the catalog", () => {
  it("writes every negative number of a picture with the minus sign", () => {
    // TeX (`tex`) takes the hyphen; every other string is shown as text.
    const strings = (value: unknown, key = ""): string[] => {
      if (key === "tex") return [];
      if (typeof value === "string") return [value];
      if (Array.isArray(value)) return value.flatMap((v) => strings(v));
      if (typeof value === "object" && value !== null) {
        return Object.entries(value).flatMap(([k, v]) => strings(v, k));
      }
      return [];
    };
    for (const [key, item] of Object.entries(VISUAL_SPECS)) {
      for (const text of strings(item)) {
        expect(text, key).not.toMatch(/(^|\s)-\d/);
      }
    }
  });

  it("gives every tap picture one region per point and no duplicates", () => {
    for (const item of Object.values(VISUAL_SPECS)) {
      if (item.kind !== "lineTap") continue;
      const regions = lineTapRegions(item.points);
      expect(new Set(regions).size).toBe(regions.length);
    }
  });
});
