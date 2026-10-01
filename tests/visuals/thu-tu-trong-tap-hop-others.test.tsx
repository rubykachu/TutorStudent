import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VISUAL_STEP_MS } from "@/lib/config";
import { Bars } from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/bars";
import { barsRegions } from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/bars-logic";
import { Digits } from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/digits";
import { Signs } from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/signs";
import Sticker from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/sticker";
import type {
  BarsSpec,
  DigitsSpec,
  SignsSpec,
} from "@/visuals/math/thu-tu-trong-tap-hop-cac-so-tu-nhien/types";
import { RegionProvider } from "@/visuals/shared/region";

afterEach(() => {
  vi.useRealTimers();
});

// Plays a StepPlayer visual to its last step, one act per step.
function playToEnd(steps: number) {
  for (let i = 0; i < steps; i++) {
    act(() => {
      vi.advanceTimersByTime(VISUAL_STEP_MS);
    });
  }
}

const DAYS = [
  "Thứ hai",
  "Thứ ba",
  "Thứ tư",
  "Thứ năm",
  "Thứ sáu",
  "Thứ bảy",
  "Chủ nhật",
];
const VALUES = [12, 7, 15, 9, 20, 4, 11];

const BARS: BarsSpec = {
  items: DAYS.map((label, i) => ({ label, value: VALUES[i] ?? 0 })),
  max: 20,
  gridEvery: 5,
  values: "all",
  marks: [
    { index: 5, color: "blue", tag: "Ít nhất" },
    { index: 4, color: "violet", tag: "Nhiều nhất" },
  ],
  unit: "quyển",
  mode: "still",
  label: "Số quyển sách cho mượn mỗi ngày trong tuần",
};

function values(container: HTMLElement): string[] {
  return [...container.querySelectorAll("text")].map(
    (t) => t.textContent ?? "",
  );
}

describe("barsRegions", () => {
  it("lists b0, b1, … in the order of the items", () => {
    expect(barsRegions(BARS)).toEqual([
      "b0",
      "b1",
      "b2",
      "b3",
      "b4",
      "b5",
      "b6",
    ]);
    expect(barsRegions({ ...BARS, items: BARS.items.slice(0, 3) })).toEqual([
      "b0",
      "b1",
      "b2",
    ]);
  });
});

describe("Bars", () => {
  it("still draws every bar with its number, the axis and the legend", () => {
    const { container } = render(<Bars spec={BARS} />);
    expect(screen.getByRole("img", { name: BARS.label })).toBeInTheDocument();
    const texts = values(container);
    for (const value of VALUES) expect(texts).toContain(String(value));
    for (const tick of [0, 5, 10, 15, 20])
      expect(texts).toContain(String(tick));
    expect(screen.getByText("Ít nhất")).toBeInTheDocument();
    expect(screen.getByText("Nhiều nhất")).toBeInTheDocument();
    expect(screen.getByText("Đơn vị: quyển")).toBeInTheDocument();
  });

  it("makes a taller bar for a bigger number", () => {
    const { container } = render(
      <Bars spec={{ ...BARS, marks: [], values: "none" }} />,
    );
    const heights = [
      ...container.querySelectorAll("rect[rx='3'][class*='fill-muted']"),
    ].map((bar) => Number(bar.getAttribute("height")));
    expect(heights).toHaveLength(7);
    expect(heights[4]).toBeGreaterThan(heights[0] ?? 0);
    expect(heights[0]).toBeGreaterThan(heights[1] ?? 0);
    expect(heights[5]).toBeLessThan(heights[3] ?? 0);
  });

  it("writes only the listed bars' numbers", () => {
    const { container } = render(
      <Bars spec={{ ...BARS, values: [0], marks: [] }} />,
    );
    const texts = values(container);
    expect(texts).toContain("12");
    expect(texts).not.toContain("9");
  });

  it("steps: adds a bar per step and ends on all of them", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Bars spec={{ ...BARS, mode: "steps", marks: [] }} />,
    );
    expect(
      container.querySelector("[data-steps]")?.getAttribute("data-steps"),
    ).toBe("7");
    playToEnd(7);
    expect(
      container.querySelector("[data-step]")?.getAttribute("data-step"),
    ).toBe("6");
  });

  it("hint: never draws the last bar or its number", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Bars spec={{ ...BARS, mode: "hint", marks: [] }} />,
    );
    playToEnd(10);
    expect(
      container.querySelector("[data-step]")?.getAttribute("data-step"),
    ).toBe("5");
    const texts = values(container);
    expect(texts).toContain("?");
    expect(texts).not.toContain("11");
    expect(texts).toContain("20");
  });

  it("tap: draws a region per bar in the order of the items", () => {
    const { container } = render(
      <Bars spec={{ ...BARS, tap: true, mode: "steps" }} />,
    );
    const ids = [...container.querySelectorAll("[data-region]")].map((g) =>
      g.getAttribute("data-region"),
    );
    expect(ids).toEqual(barsRegions(BARS));
  });

  it("tap: makes each bar a button inside an exercise", () => {
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
        <Bars spec={{ ...BARS, tap: true, marks: [] }} />
      </RegionProvider>,
    );
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(7);
    fireEvent.click(buttons[4] as Element);
    expect(onToggle).toHaveBeenCalledWith("b4");
  });

  it("keeps every bar at least 12 units apart and 48px wide to tap", () => {
    const { container } = render(<Bars spec={{ ...BARS, tap: true }} />);
    const hits = [
      ...container.querySelectorAll("[data-region] rect[fill='transparent']"),
    ];
    expect(hits).toHaveLength(7);
    const box = hits.map((r) => ({
      x: Number(r.getAttribute("x")),
      w: Number(r.getAttribute("width")),
    }));
    for (let i = 1; i < box.length; i++) {
      const prev = box[i - 1];
      const cur = box[i];
      expect(
        (cur?.x ?? 0) - ((prev?.x ?? 0) + (prev?.w ?? 0)),
      ).toBeGreaterThanOrEqual(12 - 1e-6);
    }
    // The selection ring adds 20px to the width on screen (viewBox width 330
    // at the narrowest phone frame of about 358px).
    expect(((box[0]?.w ?? 0) * 358) / 330 + 20).toBeGreaterThanOrEqual(48);
  });
});

const SIGNS: [SignsSpec["sign"], string, string, string][] = [
  ["<", "3", "8", "3 nhỏ hơn 8"],
  [">", "9", "4", "9 lớn hơn 4"],
  ["≤", "5", "5", "5 nhỏ hơn hoặc bằng 5"],
  ["≥", "7", "6", "7 lớn hơn hoặc bằng 6"],
  ["=", "7", "7", "7 bằng 7"],
];

describe("Signs", () => {
  it.each(SIGNS)(
    "still draws %s with its reading",
    (sign, left, right, reading) => {
      const { container } = render(
        <Signs spec={{ left, right, sign, mode: "still", label: "So sánh" }} />,
      );
      expect(container.textContent).toContain(reading);
      expect(container.querySelector("polyline, line")).not.toBeNull();
    },
  );

  it("points the sign at the smaller number", () => {
    const point = (sign: SignsSpec["sign"], left: string, right: string) => {
      const { container, unmount } = render(
        <Signs spec={{ left, right, sign, mode: "still", label: "So sánh" }} />,
      );
      const points = (
        container.querySelector("polyline")?.getAttribute("points") ?? ""
      )
        .split(" ")
        .map((p) => Number(p.split(",")[0]));
      unmount();
      return points;
    };
    const [back, tip] = point("<", "3", "8");
    expect(tip).toBeLessThan(back ?? 0);
    const [backR, tipR] = point(">", "9", "4");
    expect(tipR).toBeGreaterThan(backR ?? 0);
  });

  it("colours the smaller number blue and the bigger violet, never an equal pair", () => {
    const small = render(
      <Signs
        spec={{ left: "3", right: "8", sign: "<", mode: "still", label: "a" }}
      />,
    );
    const texts = [...small.container.querySelectorAll("text")];
    expect(texts[0]?.getAttribute("class")).toContain("fill-concept-blue");
    expect(texts[1]?.getAttribute("class")).toContain("fill-concept-violet");
    small.unmount();
    const equal = render(
      <Signs
        spec={{ left: "5", right: "5", sign: "≤", mode: "still", label: "a" }}
      />,
    );
    expect(equal.container.innerHTML).not.toContain("concept-");
  });

  it("draws a number with a narrow space as given", () => {
    const { container } = render(
      <Signs
        spec={{
          left: "40 982",
          right: "41 000",
          sign: "<",
          mode: "still",
          label: "a",
        }}
      />,
    );
    expect(container.textContent).toContain("40 982");
  });

  it("steps: shows ? first, then the sign and its reading", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Signs
        spec={{ left: "3", right: "8", sign: "<", mode: "steps", label: "a" }}
      />,
    );
    playToEnd(2);
    expect(
      container.querySelector("[data-step]")?.getAttribute("data-step"),
    ).toBe("1");
    expect(container.textContent).toContain("3 nhỏ hơn 8");
  });

  it.each(SIGNS)(
    "hint never contains the sign %s or its reading",
    (sign, left, right) => {
      const { container } = render(
        <Signs spec={{ left, right, sign, mode: "hint", label: "So sánh" }} />,
      );
      expect(container.querySelector("polyline")).toBeNull();
      expect(container.querySelector("line")).toBeNull();
      expect(container.textContent).toContain("?");
      expect(container.textContent).not.toMatch(/hơn|bằng/);
      expect(container.innerHTML).not.toContain("concept-");
    },
  );
});

function digitsOf(spec: DigitsSpec) {
  return render(<Digits spec={spec} />);
}

describe("Digits", () => {
  const diffLength: DigitsSpec = {
    a: "40982",
    b: "9871",
    mode: "still",
    label: "Hai số",
  };
  const sameLength: DigitsSpec = {
    a: "40982",
    b: "41000",
    mode: "still",
    label: "Hai số",
  };

  it("counts the digits of both numbers and right-aligns them", () => {
    const { container } = digitsOf(diffLength);
    expect(container.textContent).toContain("5 chữ số");
    expect(container.textContent).toContain("4 chữ số");
    const boxes = [...container.querySelectorAll("rect[rx='8']")];
    expect(boxes).toHaveLength(9);
    const xs = (from: number, n: number) =>
      boxes.slice(from, from + n).map((r) => Number(r.getAttribute("x")));
    // The last digits of both rows sit in the same column.
    expect(xs(0, 5)[4]).toBe(xs(5, 4)[3]);
    // The shorter number leaves the left place empty.
    expect(xs(5, 4)[0]).toBeGreaterThan(xs(0, 5)[0] ?? 0);
  });

  it("groups digits in threes with a gap", () => {
    const { container } = digitsOf(diffLength);
    const xs = [...container.querySelectorAll("rect[rx='8']")]
      .slice(0, 5)
      .map((r) => Number(r.getAttribute("x")));
    const steps = xs.slice(1).map((x, i) => x - (xs[i] ?? 0));
    // Gap between "40" and "982" only.
    expect(steps[1]).toBeGreaterThan(steps[0] ?? 0);
    expect(steps[0]).toBe(steps[2]);
    expect(steps[2]).toBe(steps[3]);
  });

  it("different counts: the longer number is violet, the verdict is in words", () => {
    const { container } = digitsOf(diffLength);
    expect(container.textContent).toContain("Nhiều chữ số hơn thì lớn hơn");
    expect(container.textContent).toContain("40 982lớn hơn9 871");
    expect(
      container.querySelector("rect.fill-concept-violet\\/15"),
    ).not.toBeNull();
    expect(
      container.querySelector("rect.fill-concept-blue\\/15"),
    ).not.toBeNull();
  });

  it("same count: walks the pairs and stops at the first that differs", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Digits spec={{ ...sameLength, mode: "steps" }} />,
    );
    // The pair at place 1 differs: the counts, one equal pair, the pair that differs, the verdict.
    expect(
      container.querySelector("[data-steps]")?.getAttribute("data-steps"),
    ).toBe("4");
    playToEnd(5);
    expect(container.textContent).toContain(
      "Cặp đầu tiên khác nhau cho biết số nào lớn hơn",
    );
    expect(container.textContent).toContain("40 982nhỏ hơn41 000");
  });

  it("same count: still draws the equal pairs dimmed and the differing pair coloured", () => {
    const { container } = digitsOf(sameLength);
    expect(container.querySelectorAll("g[opacity='0.35']")).toHaveLength(2);
    expect(
      container.querySelectorAll("rect.fill-concept-blue\\/15"),
    ).toHaveLength(1);
    expect(
      container.querySelectorAll("rect.fill-concept-violet\\/15"),
    ).toHaveLength(1);
  });

  it("hint with different counts stops after the counts and shows no verdict", () => {
    const { container } = digitsOf({ ...diffLength, mode: "hint" });
    expect(container.textContent).toContain("5 chữ số");
    expect(container.textContent).not.toMatch(/nhỏ hơn|lớn hơn|bằng/);
    expect(container.innerHTML).not.toContain("concept-");
    expect(container.querySelector("[data-step-player]")).toBeNull();
  });

  it("hint with the same count stops before the first pair that differs", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Digits spec={{ ...sameLength, mode: "hint" }} />,
    );
    expect(
      container.querySelector("[data-steps]")?.getAttribute("data-steps"),
    ).toBe("2");
    playToEnd(5);
    expect(
      container.querySelector("[data-step]")?.getAttribute("data-step"),
    ).toBe("1");
    expect(container.textContent).not.toMatch(
      /nhỏ hơn|lớn hơn|bằng|Cặp đầu tiên/,
    );
    expect(container.innerHTML).not.toContain("concept-");
    expect(container.textContent).toContain("?");
  });
});

describe("Sticker", () => {
  it("renders a labelled image", () => {
    render(<Sticker />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "aria-label",
      expect.stringContaining("tia số"),
    );
  });
});
