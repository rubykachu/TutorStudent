import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VISUAL_SPECS } from "@/visuals/math/phep-cong-phep-tru-so-nguyen/catalog";
import {
  HopTry,
  walkedText,
} from "@/visuals/math/phep-cong-phep-tru-so-nguyen/hop-try";
import {
  hopRange,
  labelsFor,
  minApart,
  minApartNamed,
  positionsOf,
} from "@/visuals/math/phep-cong-phep-tru-so-nguyen/logic";

describe("positionsOf", () => {
  it("adds each hop to the one before: right for positive, left for negative", () => {
    expect(positionsOf(-3, [5])).toEqual([-3, 2]);
    expect(positionsOf(5, [-3, -4])).toEqual([5, 2, -2]);
    expect(positionsOf(0, [])).toEqual([0]);
  });
});

describe("hopRange", () => {
  it("shows at least -5 to 5 and widens for a longer walk", () => {
    expect(hopRange([-3, 2])).toEqual({ from: -5, to: 5 });
    expect(hopRange([7, -3])).toEqual({ from: -8, to: 8 });
  });
});

describe("labelsFor", () => {
  it("labels every tick while the line is wide enough", () => {
    expect(labelsFor({ from: -5, to: 5 }, [2])).toBeUndefined();
  });

  it("keeps only the landmarks that stand clear of a marked tick", () => {
    const range = { from: -10, to: 10 };
    const labels = labelsFor(range, [4, -3]);
    expect(labels).toBeDefined();
    expect(labels).not.toContain(5);
    expect(labels).toContain(0);
    expect(labels).toContain(-5);
  });
});

describe("the catalog", () => {
  const lines = Object.entries(VISUAL_SPECS).filter(
    ([, spec]) => spec.kind === "line",
  );

  it("keeps the numbers and names of every walk apart so they never touch", () => {
    for (const [key, spec] of lines) {
      if (spec.kind !== "line") continue;
      // A hint never draws its last step, so its result point is not there.
      const last = Math.max(0, ...(spec.layers ?? []).map((l) => l.step ?? 0));
      const points = (spec.layers ?? [])
        .filter((layer) => layer.type === "point")
        .filter((layer) => spec.mode !== "hint" || (layer.step ?? 0) !== last)
        .sort((a, b) => a.at - b.at);
      for (let i = 1; i < points.length; i++) {
        const before = points[i - 1];
        const after = points[i];
        if (!before || !after || before.at === after.at) continue;
        const named = before.name !== undefined && after.name !== undefined;
        const needed = named ? minApartNamed(spec) : minApart(spec);
        expect(
          after.at - before.at,
          `${key}: points ${before.at}, ${after.at}`,
        ).toBeGreaterThanOrEqual(needed);
      }
    }
  });

  it("keeps every walk the child makes inside the line", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (spec.kind !== "hopTry") continue;
      const inside = (tick: number) => tick >= spec.from && tick <= spec.to;
      expect(inside(spec.start), key).toBe(true);
      if (spec.goal !== undefined) expect(inside(spec.goal), key).toBe(true);
    }
  });
});

describe("HopTry", () => {
  const spec = {
    from: -6,
    to: 6,
    label: "Trục số",
    start: 1,
    goal: -3,
  } as const;

  it("reports the start tick at once", () => {
    const onStateChange = vi.fn();
    render(
      <HopTry spec={spec} params={{ p0: -3 }} onStateChange={onStateChange} />,
    );
    expect(onStateChange).toHaveBeenCalledWith({ p0: 1 });
  });

  it("walks one tick per press, left past zero to a negative number", () => {
    const onStateChange = vi.fn();
    render(
      <HopTry spec={spec} params={{ p0: -3 }} onStateChange={onStateChange} />,
    );
    const left = screen.getByRole("button", { name: /Sang trái/ });
    for (let i = 0; i < 4; i++) fireEvent.click(left);
    expect(onStateChange).toHaveBeenLastCalledWith({ p0: -3 });
    expect(screen.getByText("Đã đi sang trái 4 đơn vị")).toBeInTheDocument();
  });

  it("stops at both ends of the line", () => {
    render(<HopTry spec={{ ...spec, start: 6 }} params={{ p0: 0 }} />);
    expect(screen.getByRole("button", { name: /Sang phải/ })).toBeDisabled();
  });

  it("shows the state it is given and locks", () => {
    render(<HopTry spec={spec} params={{ p0: -3 }} shownState={{ p0: -3 }} />);
    expect(screen.getByRole("button", { name: /Sang trái/ })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent(/−3/);
  });
});

describe("walkedText", () => {
  it("names the way and the length of the walk", () => {
    expect(walkedText(1, 1)).toBe("Chưa đi bước nào");
    expect(walkedText(1, 4)).toBe("Đã đi sang phải 3 đơn vị");
    expect(walkedText(1, -3)).toBe("Đã đi sang trái 4 đơn vị");
  });
});
