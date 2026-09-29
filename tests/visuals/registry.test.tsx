import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { visualRegistry } from "@/visuals/registry";

describe("visualRegistry", () => {
  it.each(Object.keys(visualRegistry))("%s loads and renders", async (id) => {
    const entry = visualRegistry[id];
    if (!entry) throw new Error(id);
    const { default: Visual } = await entry.load();
    const { container } = render(<Visual />);
    expect(container.firstChild).not.toBeNull();
  });

  it("declares exactly the regions a tappable visual renders", async () => {
    for (const entry of Object.values(visualRegistry)) {
      if (!entry.regions) continue;
      const { default: Visual } = await entry.load();
      const { container, unmount } = render(<Visual />);
      const rendered = [...container.querySelectorAll("[data-region]")].map(
        (el) => el.getAttribute("data-region"),
      );
      expect(rendered).toEqual([...entry.regions]);
      unmount();
    }
  });

  it("the dot counter reports its state and satisfies count-equals", async () => {
    const entry = visualRegistry["fixture.visual.dot-counter"];
    const validate = entry?.validators?.["count-equals"];
    if (!entry || !validate) throw new Error("dot counter missing");
    const { default: DotCounter } = await entry.load();
    const onStateChange = vi.fn();
    render(<DotCounter onStateChange={onStateChange} />);

    const add = screen.getByRole("button", { name: "Thêm một chấm" });
    fireEvent.click(add);
    fireEvent.click(add);
    fireEvent.click(screen.getByRole("button", { name: "Bớt một chấm" }));

    expect(onStateChange).toHaveBeenLastCalledWith({ count: 1 });
    expect(validate({ count: 1 }, { count: 1 })).toBe(true);
    expect(validate({ count: 2 }, { count: 1 })).toBe(false);
    expect(validate({}, { count: 1 })).toBe(false);
  });

  it("solves only with validators of the same id, which accept the solution", () => {
    const samples: Record<string, Record<string, number>[]> = {
      "count-equals": [{ count: 0 }, { count: 6 }],
      "square-of": [{ n: 1 }, { n: 3 }],
      "so-hat": [{ grains: 1 }, { grains: 16 }],
      "luy-thua-la": [{ base: 5, exponent: 3 }],
      "tong-so-mu": [{ total: 2 }, { total: 5 }, { total: 10 }],
      "hieu-so-mu": [{ rest: 0 }, { rest: 5 }],
    };
    for (const entry of Object.values(visualRegistry)) {
      for (const [id, solve] of Object.entries(entry.solutions ?? {})) {
        const validate = entry.validators?.[id];
        expect(validate, id).toBeDefined();
        for (const params of samples[id] ?? []) {
          expect(validate?.(solve(params), params), id).toBe(true);
        }
      }
    }
  });

  it("the dot square reports the box around its dots and satisfies square-of", async () => {
    const entry = visualRegistry["fixture.visual.dot-square"];
    const validate = entry?.validators?.["square-of"];
    if (!entry || !validate) throw new Error("dot square missing");
    const { default: DotSquare } = await entry.load();
    const onStateChange = vi.fn();
    render(<DotSquare onStateChange={onStateChange} />);
    const cell = (row: number, column: number) =>
      screen.getByRole("button", { name: `Hàng ${row}, cột ${column}` });

    fireEvent.click(cell(2, 2));
    fireEvent.click(cell(2, 3));
    fireEvent.click(cell(3, 2));
    fireEvent.click(cell(3, 3));
    expect(onStateChange).toHaveBeenLastCalledWith({
      count: 4,
      width: 2,
      height: 2,
    });
    expect(validate({ count: 4, width: 2, height: 2 }, { n: 2 })).toBe(true);
    // Four dots in a 2 × 2 box with one moved out is not a square.
    fireEvent.click(cell(3, 3));
    fireEvent.click(cell(4, 4));
    expect(onStateChange).toHaveBeenLastCalledWith({
      count: 4,
      width: 3,
      height: 3,
    });
    for (const cells of [
      [2, 2],
      [2, 3],
      [3, 2],
      [4, 4],
    ] as const) {
      fireEvent.click(cell(cells[0], cells[1]));
    }
    expect(onStateChange).toHaveBeenLastCalledWith({
      count: 0,
      width: 0,
      height: 0,
    });
    expect(validate({ count: 4, width: 2, height: 2 }, {})).toBe(false);
  });
});
