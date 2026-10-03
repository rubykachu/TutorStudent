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
      "cap-tron": [{ unit: 10, n0: 4, n1: 9, n2: 6 }],
      "them-bot-tron": [{ a: 38, b: 47, unit: 10 }],
      "cot-tinh": [{ digit: 5, carry: 1 }],
      chia: [{ total: 29, people: 6 }],
      "thuong-du": [{ dividend: 217, divisor: 15 }],
      "ve-xong": [{ total: 3 }],
      "du-cham-phay": [{ gaps: 3 }],
      "chon-dung": [{ i0: 1, i1: 0, i2: 1 }],
      "viet-so": [
        { n: 2054, len: 4 },
        { n: 305, len: 3 },
      ],
      "dat-diem": [{ p0: 7 }, { p0: 7, p1: 11 }],
      "dat-thua-so": [{ n: -2 }, { n: 0 }],
      "ve-tam-giac-deu": [{ side: 3 }, { side: 7 }],
      "ve-hinh-vuong": [{ side: 4 }],
      "ve-hinh-vuong-cheo": [{ side: 5 }],
      "ghep-luc-giac": [{ n: 6 }],
      "ve-hinh-chu-nhat": [{ a: 3, b: 5 }],
      "ve-hinh-thoi": [{ side: 4 }, { side: 5, angle: 60 }],
      "ve-binh-hanh-hai-canh": [{ a: 3, b: 4 }],
      "ve-binh-hanh-duong-cheo": [{ ab: 3, bc: 5, ac: 6 }],
      "ghep-hinh": [{ n: 3 }, { n: 8 }],
      "xep-gach": [{ perRow: 4, rows: 3 }],
      "gap-nhau": [
        { p: 4, q: 6, first: 1 },
        { p: 4, q: 5, first: 0 },
      ],
      tui: [
        { total: 24, fits: 1 },
        { total: 25, fits: 0 },
      ],
      "chia-het": [
        { before: 43, after: 0, afterLen: 0, divisor: 2, divisor2: 0, fits: 1 },
        { before: 43, after: 0, afterLen: 0, divisor: 2, divisor2: 0, fits: 0 },
        { before: 0, after: 0, afterLen: 1, divisor: 2, divisor2: 5, fits: 1 },
      ],
      "x-thuoc": [
        { want: 1, count: 3, e0: 2, e1: 4, e2: 6 },
        { want: 0, count: 3, e0: 0, e1: 1, e2: 2 },
      ],
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
