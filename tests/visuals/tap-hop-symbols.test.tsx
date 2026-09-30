import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  GLYPHS,
  type GlyphKey,
  TRACE_GLYPH,
  type TraceSymbol,
} from "@/visuals/math/tap-hop/glyphs";
import {
  datChamPhay,
  symbolTap,
  TheThuoc,
  tapNet,
  VeMoNgoac,
  VeThuoc,
} from "@/visuals/math/tap-hop/symbol-examples";
import {
  gapsFilled,
  solveGapsFilled,
  solveStrokesDone,
  strokesDone,
} from "@/visuals/math/tap-hop/symbol-validators";

describe("symbol validators", () => {
  it("accepts a mark only when every stroke is drawn", () => {
    expect(strokesDone({ n: 3 }, { total: 3 })).toBe(true);
    expect(strokesDone({ n: 2 }, { total: 3 })).toBe(false);
    expect(strokesDone({}, { total: 3 })).toBe(false);
    expect(strokesDone({ n: 3 }, {})).toBe(false);
    expect(strokesDone(solveStrokesDone({ total: 3 }), { total: 3 })).toBe(
      true,
    );
  });

  it("accepts a number row only when every gap holds a semicolon", () => {
    expect(gapsFilled({ g0: 1, g1: 1, g2: 1 }, { gaps: 3 })).toBe(true);
    expect(gapsFilled({ g0: 1, g1: 0, g2: 1 }, { gaps: 3 })).toBe(false);
    expect(gapsFilled({ g0: 1 }, { gaps: 3 })).toBe(false);
    expect(gapsFilled({ g0: 1 }, {})).toBe(false);
    expect(solveGapsFilled({ gaps: 3 })).toEqual({ g0: 1, g1: 1, g2: 1 });
    expect(gapsFilled(solveGapsFilled({ gaps: 3 }), { gaps: 3 })).toBe(true);
  });
});

describe("glyph data", () => {
  it("gives the traced marks the stroke counts the lesson teaches", () => {
    const counts = Object.fromEntries(
      (Object.keys(TRACE_GLYPH) as TraceSymbol[]).map((symbol) => [
        symbol,
        GLYPHS[TRACE_GLYPH[symbol]].strokes.length,
      ]),
    );
    expect(counts).toEqual({
      "ngoac-mo": 3,
      "ngoac-dong": 3,
      "cham-phay": 2,
      thuoc: 2,
      "khong-thuoc": 3,
    });
  });

  it("mirrors the open brace into the closing one", () => {
    const open = GLYPHS["ngoac-nhon-mo"].strokes[0]?.d;
    const close = GLYPHS["ngoac-nhon-dong"].strokes[0]?.d;
    expect(open).toBe("M 92 14 C 70 14 62 24 62 42 L 62 62");
    expect(close).toBe("M 28 14 C 50 14 58 24 58 42 L 58 62");
  });
});

describe("stroke explainers", () => {
  it("draws the brace in three steps named by stroke", () => {
    render(<VeMoNgoac />);
    expect(screen.getByText("Nét 1")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Mở ngoặc nhọn: đã vẽ 1 trên 3 nét/ }),
    ).toBeInTheDocument();
  });

  it("draws the membership sign in two steps", () => {
    const { container } = render(<VeThuoc />);
    expect(
      container.querySelector("[data-steps]")?.getAttribute("data-steps"),
    ).toBe("2");
  });
});

describe("tracing a mark", () => {
  it("lights one start dot at a time and reports the strokes drawn", () => {
    const Trace = tapNet("ngoac-mo");
    const onStateChange = vi.fn();
    render(<Trace onStateChange={onStateChange} />);
    expect(
      screen.getAllByRole("button", { name: /Chạm chấm số/ }),
    ).toHaveLength(1);
    for (const n of [1, 2, 3]) {
      fireEvent.click(
        screen.getByRole("button", {
          name: `Chạm chấm số ${n} để vẽ nét ${n}`,
        }),
      );
      expect(onStateChange).toHaveBeenLastCalledWith({ n });
    }
    expect(screen.queryByRole("button", { name: /Chạm chấm số/ })).toBeNull();
  });

  it("marks the lit dot with the state it sets, for the lesson walker", () => {
    const Trace = tapNet("ngoac-dong");
    const { container } = render(<Trace />);
    expect(container.querySelector("[data-state-set]")).toHaveAttribute(
      "data-state-set",
      "n=1",
    );
    fireEvent.click(screen.getByRole("button", { name: /Chạm chấm số 1/ }));
    expect(container.querySelector("[data-state-set]")).toHaveAttribute(
      "data-state-set",
      "n=2",
    );
  });

  it("starts over with the redraw button", () => {
    const Trace = tapNet("thuoc");
    const onStateChange = vi.fn();
    render(<Trace onStateChange={onStateChange} />);
    const redraw = screen.getByRole("button", { name: "Vẽ lại" });
    expect(redraw).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: /Chạm chấm số 1/ }));
    fireEvent.click(redraw);
    expect(onStateChange).toHaveBeenLastCalledWith({ n: 0 });
    expect(screen.getByRole("button", { name: /Chạm chấm số 1/ })).toBeTruthy();
  });

  it("shows a given state read-only, and locks when disabled", () => {
    const Trace = tapNet("ngoac-mo");
    const onStateChange = vi.fn();
    const { rerender } = render(
      <Trace shownState={{ n: 3 }} onStateChange={onStateChange} />,
    );
    expect(
      screen.getByRole("img", { name: /đã vẽ 3 trên 3 nét/ }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Chạm chấm số/ })).toBeNull();
    rerender(<Trace disabled onStateChange={onStateChange} />);
    expect(screen.queryByRole("button", { name: /Chạm chấm số/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Vẽ lại" })).toBeDisabled();
    expect(onStateChange).not.toHaveBeenCalled();
  });
});

describe("semicolon gaps", () => {
  it("has one gap fewer than numbers and toggles a semicolon in a gap", () => {
    const Row = datChamPhay(4);
    const onStateChange = vi.fn();
    render(<Row onStateChange={onStateChange} />);
    expect(screen.getAllByRole("button")).toHaveLength(3);
    const first = screen.getByRole("button", { name: "Ô trống giữa 1 và 2" });
    fireEvent.click(first);
    expect(onStateChange).toHaveBeenLastCalledWith({ g0: 1, g1: 0, g2: 0 });
    expect(first).toHaveAttribute("aria-pressed", "true");
    expect(first).toHaveAttribute("data-state-set", "g0=0");
    fireEvent.click(first);
    expect(onStateChange).toHaveBeenLastCalledWith({ g0: 0, g1: 0, g2: 0 });
  });

  it("shows a given state and ignores taps when locked", () => {
    const Row = datChamPhay(3);
    const onStateChange = vi.fn();
    render(<Row shownState={{ g0: 1, g1: 1 }} onStateChange={onStateChange} />);
    const gap = screen.getByRole("button", { name: "Ô trống giữa 2 và 3" });
    expect(gap).toHaveAttribute("aria-pressed", "true");
    expect(gap).toBeDisabled();
  });
});

describe("symbol tiles", () => {
  it("renders one region per key in the order given", () => {
    const keys: GlyphKey[] = ["phay", "cham", "cham-phay", "hai-cham"];
    const Tiles = symbolTap(keys);
    const { container } = render(<Tiles />);
    const rendered = [...container.querySelectorAll("[data-region]")].map(
      (el) => el.getAttribute("data-region"),
    );
    expect(rendered).toEqual(keys);
  });
});

describe("symbol cards", () => {
  it("names the mark, its reading and how to write it", () => {
    render(<TheThuoc />);
    expect(screen.getByText("Đọc: thuộc")).toBeInTheDocument();
    expect(screen.getByText("Viết: chữ C và gạch ngang")).toBeInTheDocument();
    expect(screen.getAllByRole("img", { name: "2 thuộc A" })).toHaveLength(1);
  });
});
