import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  VALIDATOR_IDS,
  VISUAL_SPECS,
} from "@/visuals/math/dau-hieu-chia-het/catalog";
import { DigitBox } from "@/visuals/math/dau-hieu-chia-het/digit-box";
import { DigitSum } from "@/visuals/math/dau-hieu-chia-het/digit-sum";
import { Digits } from "@/visuals/math/dau-hieu-chia-het/digits";
import { EndDigits } from "@/visuals/math/dau-hieu-chia-het/end-digits";
import {
  digitSum,
  digitsOf,
  divisible,
  endingDigitsFor,
  fittingDigits,
  listDivisors,
  solutions,
  sumTex,
  texInt,
  validators,
  verdictTex,
} from "@/visuals/math/dau-hieu-chia-het/logic";
import Sticker from "@/visuals/math/dau-hieu-chia-het/sticker";
import { visualRegistry } from "@/visuals/registry";

describe("divisibility-sign helpers", () => {
  it("splits a number into digits and sums them", () => {
    expect(digitsOf(4326)).toEqual([4, 3, 2, 6]);
    expect(digitSum(4326)).toBe(15);
    expect(divisible(15, 3)).toBe(true);
    expect(divisible(14, 3)).toBe(false);
  });

  it("lists the last digits that make a number divisible", () => {
    expect(endingDigitsFor(2)).toEqual([0, 2, 4, 6, 8]);
    expect(endingDigitsFor(5)).toEqual([0, 5]);
  });

  it("finds the digits that fit the box, with or without digits around it", () => {
    expect(fittingDigits(43, 0, 0, [2])).toEqual([0, 2, 4, 6, 8]);
    expect(fittingDigits(0, 5, 1, [2, 5])).toEqual([]);
    expect(fittingDigits(1, 0, 1, [2, 5])).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(fittingDigits(0, 6, 1, [3])).toEqual([0, 3, 6, 9]);
    // `after` keeps its leading zero through afterLen: 3_05 -> 3d05.
    expect(fittingDigits(3, 5, 2, [5])).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("writes numbers and verdicts in TeX", () => {
    expect(texInt(4326)).toBe("4\\,326");
    expect(texInt(326)).toBe("326");
    expect(verdictTex(4326, 2)).toBe("4\\,326 \\chiahet 2");
    expect(verdictTex(25, 2, "amber")).toBe(
      "\\concept{amber}{25} \\khongchiahet 2",
    );
    expect(sumTex(4326, "amber")).toBe("4 + 3 + 2 + 6 = \\concept{amber}{15}");
    expect(listDivisors([2, 5])).toBe("2 và 5");
    expect(listDivisors([2, 3, 5])).toBe("2, 3 và 5");
    expect(listDivisors([2])).toBe("2");
  });

  it("accepts a digit that makes the number divisible (or not) as asked, and solves it", () => {
    const fits = validators["chia-het"];
    const base = { before: 43, after: 0, afterLen: 0, divisor: 2, divisor2: 0 };
    expect(fits({ d: 6 }, { ...base, fits: 1 })).toBe(true);
    expect(fits({ d: 7 }, { ...base, fits: 1 })).toBe(false);
    expect(fits({ d: 7 }, { ...base, fits: 0 })).toBe(true);
    expect(fits({}, { ...base, fits: 1 })).toBe(false);
    expect(fits({ d: 0 }, { fits: 1 })).toBe(false);
    for (const params of [
      { ...base, fits: 1 },
      { ...base, fits: 0 },
      { before: 0, after: 0, afterLen: 1, divisor: 2, divisor2: 5, fits: 1 },
      { before: 0, after: 4, afterLen: 2, divisor: 5, divisor2: 0, fits: 0 },
      { before: 12, after: 0, afterLen: 1, divisor: 3, divisor2: 0, fits: 1 },
    ]) {
      const { d } = solutions["chia-het"](params);
      expect(fits({ d }, params), JSON.stringify(params)).toBe(true);
    }
    expect(solutions["chia-het"]({ ...base, fits: 1 })).toEqual({ d: 0 });
    expect(solutions["chia-het"]({ ...base, fits: 0 })).toEqual({ d: 1 });
    // No digit satisfies it: the solver falls back to the first digit.
    expect(
      solutions["chia-het"]({ ...base, divisor: 1, divisor2: 0, fits: 0 }),
    ).toEqual({ d: 0 });
  });
});

describe("DigitBox", () => {
  it("shows the live verdict, progress and a closing line on a lesson screen", () => {
    const onStateChange = vi.fn();
    render(
      <DigitBox
        before="43"
        after=""
        divisors={[2]}
        goal
        onStateChange={onStateChange}
      />,
    );
    expect(screen.getByText("chia hết cho 2")).toBeInTheDocument();
    expect(screen.getByText("Đã tìm 1/5 chữ số")).toBeInTheDocument();
    const up = screen.getByRole("button", { name: "Tăng chữ số ở ô trống" });
    fireEvent.click(up);
    expect(onStateChange).toHaveBeenLastCalledWith({ d: 1 });
    expect(screen.getByText("không chia hết cho 2")).toBeInTheDocument();
    expect(screen.getByText("Đã tìm 1/5 chữ số")).toBeInTheDocument();
    for (let i = 0; i < 7; i++) fireEvent.click(up);
    expect(screen.getByText("Đã tìm 5/5 chữ số")).toBeInTheDocument();
    expect(screen.getByText("Bạn đã tìm đủ các chữ số.")).toBeInTheDocument();
  });

  it("names both divisors in the verdict", () => {
    render(<DigitBox before="12" after="" divisors={[2, 5]} goal />);
    expect(screen.getByText("chia hết cho cả 2 và 5")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Tăng chữ số ở ô trống" }),
    );
    expect(
      screen.getByText("không chia hết cho cả 2 và 5"),
    ).toBeInTheDocument();
  });

  it("draws the task's own numbers and reveals no verdict or progress in an exercise", () => {
    render(
      <DigitBox
        before="43"
        after=""
        divisors={[2]}
        goal
        params={{
          before: 7,
          after: 5,
          afterLen: 2,
          divisor: 5,
          divisor2: 0,
          fits: 1,
        }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Số 7005, chữ số ở ô trống là 0" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/chia hết cho/)).toBeNull();
    expect(screen.queryByText(/Đã tìm/)).toBeNull();
    expect(screen.queryByText(/Bạn đã tìm đủ/)).toBeNull();
  });

  it("draws a number with no digits before the box, and the revealed answer read-only", () => {
    const onStateChange = vi.fn();
    render(
      <DigitBox
        before="43"
        after=""
        divisors={[2]}
        goal={false}
        params={{ before: 0, after: 4, afterLen: 1, divisor: 2, divisor2: 0 }}
        shownState={{ d: 3 }}
        onStateChange={onStateChange}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Số 34, chữ số ở ô trống là 3" }),
    ).toBeInTheDocument();
    const up = screen.getByRole("button", { name: "Tăng chữ số ở ô trống" });
    expect(up).toBeDisabled();
    expect(onStateChange).not.toHaveBeenCalled();
  });

  it("locks when disabled", () => {
    render(<DigitBox before="1" after="" divisors={[2]} goal disabled />);
    expect(
      screen.getByRole("button", { name: "Giảm chữ số ở ô trống" }),
    ).toBeDisabled();
  });
});

describe("digit pictures", () => {
  it("shows every step of a digits picture on a still", () => {
    const { container } = render(
      <Digits spec={{ kind: "digits", n: 4326, divisor: 2, mode: "still" }} />,
    );
    expect(screen.getByText("Chữ số tận cùng")).toBeInTheDocument();
    expect(screen.getByText("tận cùng 6")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-shape='pentagon']")).toHaveLength(
      3,
    );
    expect(container.querySelector(".katex")).not.toBeNull();
  });

  it("draws only the tiles at the first step and no verdict row with divisor 0", () => {
    const { container } = render(
      <Digits spec={{ kind: "digits", n: 4326, divisor: 0, mode: "still" }} />,
    );
    expect(screen.getByText("Chữ số tận cùng")).toBeInTheDocument();
    expect(container.querySelector(".katex")).toBeNull();
  });

  it("stops a hint before the verdict", () => {
    render(
      <Digits spec={{ kind: "digits", n: 4326, divisor: 2, mode: "hint" }} />,
    );
    expect(screen.queryByText("tận cùng 6")).toBeNull();
    expect(
      screen.getByLabelText(/có chia hết cho 2 không/),
    ).toBeInTheDocument();
  });

  it("draws one row per divisor plus a row for both, filled where the digit fits", () => {
    const { container } = render(
      <EndDigits spec={{ kind: "endDigits", divisors: [2, 5] }} />,
    );
    expect(
      screen.getByText("Tận cùng tô màu thì chia hết cho 2"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tận cùng tô màu thì chia hết cho 5"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Tận cùng tô màu thì chia hết cho cả 2 và 5"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "Tận cùng tô màu thì chia hết cho cả 2 và 5: tận cùng là 0",
      }),
    ).toBeInTheDocument();
    // 5 + 2 + 1 tiles carry the concept mark (plus the legend's).
    expect(container.querySelectorAll("[data-shape='pentagon']")).toHaveLength(
      9,
    );
  });

  it("has no row for both with a single divisor", () => {
    render(<EndDigits spec={{ kind: "endDigits", divisors: [5] }} />);
    expect(screen.queryByText(/chia hết cho cả/)).toBeNull();
  });

  it("draws the sum line and both verdicts of a digit sum on a still", () => {
    const { container } = render(
      <DigitSum
        spec={{ kind: "digitSum", n: 4326, divisor: 3, mode: "still" }}
      />,
    );
    expect(container.querySelectorAll(".katex")).toHaveLength(3);
    expect(container.textContent).toContain("Tổng các chữ số");
  });

  it("draws only the sum with divisor 0, and a hint without the last verdict", () => {
    const sumOnly = render(
      <DigitSum
        spec={{ kind: "digitSum", n: 4326, divisor: 0, mode: "still" }}
      />,
    );
    expect(sumOnly.container.querySelectorAll(".katex")).toHaveLength(1);
    sumOnly.unmount();
    render(
      <DigitSum
        spec={{ kind: "digitSum", n: 4326, divisor: 3, mode: "hint" }}
      />,
    );
    expect(screen.getByLabelText(/cộng các chữ số/)).toBeInTheDocument();
  });

  it("labels the sticker as a divisibility medal", () => {
    render(<Sticker />);
    expect(
      screen.getByRole("img", { name: /Huy chương dấu hiệu chia hết/ }),
    ).toBeInTheDocument();
  });
});

describe("the lesson catalog", () => {
  it("gives every interactive kind the validator its exercises use", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (!(spec.kind in VALIDATOR_IDS)) continue;
      const id = `dau-hieu-chia-het.visual.${key}`;
      const validatorId =
        VALIDATOR_IDS[spec.kind as keyof typeof VALIDATOR_IDS];
      expect(visualRegistry[id]?.validators?.[validatorId], id).toBeDefined();
      expect(visualRegistry[id]?.solutions?.[validatorId], id).toBeDefined();
    }
  });

  it("has one entry per spec, interactive only for the kinds the child acts on", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      const entry = visualRegistry[`dau-hieu-chia-het.visual.${key}`];
      expect(entry?.interactive, key).toBe(
        spec.kind === "chips" || spec.kind === "digitBox",
      );
    }
  });
});
