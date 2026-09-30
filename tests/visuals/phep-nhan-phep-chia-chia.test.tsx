import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VISUAL_SPECS } from "@/visuals/math/phep-nhan-phep-chia/catalog";
import { fromSpec } from "@/visuals/math/phep-nhan-phep-chia/examples";
import {
  buildFigure,
  digitsOf,
  divide,
  fillPlaces,
  openingSentence,
  progressEnd,
  readNumber,
  sentenceFor,
  walkEvent,
  walkLength,
} from "@/visuals/math/phep-nhan-phep-chia/long-division";
import {
  packResult,
  packSteps,
} from "@/visuals/math/phep-nhan-phep-chia/pack-logic";
import { remainderCheck } from "@/visuals/math/phep-nhan-phep-chia/rem-check";
import {
  MAX_ROUND_STEPS,
  shareSteps,
} from "@/visuals/math/phep-nhan-phep-chia/share-logic";
import {
  solutions,
  validators,
} from "@/visuals/math/phep-nhan-phep-chia/validators-chia";

describe("long division opening", () => {
  it("takes one digit when it reaches the divisor", () => {
    expect(openingSentence(divide(95, 4))).toBe(
      "Chia 95 cho 4 từng chữ số một.",
    );
  });

  it("takes the first two digits when one is smaller than the divisor", () => {
    expect(openingSentence(divide(268, 12))).toBe(
      "2 nhỏ hơn 12 nên lấy hai chữ số đầu: 26.",
    );
  });
});

describe("long division", () => {
  it.each([
    [154, 12, 12, 10],
    [268, 12, 22, 4],
    [163, 15, 10, 13],
    [217, 15, 14, 7],
    [95, 4, 23, 3],
    [87, 5, 17, 2],
    [367, 9, 40, 7],
    [5, 7, 0, 5],
    [0, 7, 0, 0],
    [100, 1, 100, 0],
    [999, 99, 10, 9],
  ])("%i : %i = %i dư %i", (dividend, divisor, quotient, remainder) => {
    const result = divide(dividend, divisor);
    expect(result.quotient).toBe(quotient);
    expect(result.remainder).toBe(remainder);
  });

  it("is exact for every dividend up to 3 digits and divisor 1 to 2 digits", () => {
    for (let dividend = 0; dividend <= 999; dividend += 7) {
      for (let divisor = 1; divisor <= 99; divisor += 3) {
        const result = divide(dividend, divisor);
        expect(result.quotient).toBe(Math.floor(dividend / divisor));
        expect(result.remainder).toBe(dividend % divisor);
        for (const step of result.steps) {
          expect(step.remainder).toBeLessThan(divisor);
        }
      }
    }
  });

  it("starts with the fewest digits that reach the divisor", () => {
    const result = divide(154, 12);
    expect(result.steps.map((s) => s.partial)).toEqual([15, 34]);
    expect(result.steps.map((s) => s.product)).toEqual([12, 24]);
    expect(result.steps[0]?.bring).toBe(4);
    expect(result.steps[1]?.bring).toBeUndefined();
  });

  it("keeps the zero of a quotient digit that does not fit", () => {
    const result = divide(163, 15);
    expect(result.steps.map((s) => s.quotientDigit)).toEqual([1, 0]);
    expect(result.steps[1]?.partial).toBe(13);
    expect(result.steps[1]?.product).toBe(0);
  });

  it("walks four events per digit, less the last bring down", () => {
    const division = divide(95, 4);
    expect(walkLength(division)).toBe(1 + 7 + 1);
    const sentences = Array.from(
      { length: walkLength(division) - 2 },
      (_, i) => {
        const { phase, step } = walkEvent(division, i + 1);
        return phase === "start" || phase === "end"
          ? ""
          : sentenceFor(division, phase, step);
      },
    );
    expect(sentences).toEqual([
      "Chia: 9 : 4 được 2",
      "Nhân: 2 · 4 = 8",
      "Trừ: 9 − 8 = 1",
      "Hạ: hạ chữ số 5, được 15",
      "Chia: 15 : 4 được 3",
      "Nhân: 3 · 4 = 12",
      "Trừ: 15 − 12 = 3",
    ]);
  });

  it("draws the finished figure with every digit in place", () => {
    const division = divide(154, 12);
    const figure = buildFigure(division, progressEnd(division));
    const text = (prefix: string) =>
      figure.cells
        .filter((c) => c.key.startsWith(prefix))
        .map((c) => c.text)
        .join("");
    expect(text("q")).toBe("12");
    expect(text("p0")).toBe("12");
    expect(text("p1")).toBe("24");
    expect(text("r1")).toBe("10");
    // The remainder 3 of the first round is joined by the brought 4.
    expect(text("r0")).toBe("3");
    expect(text("b0")).toBe("4");
    expect(figure.rows).toBe(5);
  });

  it("hides the zero remainder once a digit is brought down", () => {
    const division = divide(84, 4);
    const figure = buildFigure(division, progressEnd(division));
    expect(figure.cells.some((c) => c.key.startsWith("r0"))).toBe(false);
    expect(figure.cells.find((c) => c.key === "b0")?.text).toBe("4");
  });

  it("reads and writes digits by place", () => {
    expect(digitsOf(7, 2)).toEqual([0, 7]);
    expect(readNumber({ q1: 1, q0: 4, r1: 0, r0: 7 }, "q", 2)).toBe(14);
    expect(fillPlaces(217, 15)).toEqual({ quotient: 2, remainder: 2 });
    expect(fillPlaces(999, 1)).toEqual({ quotient: 3, remainder: 2 });
  });
});

describe("validators", () => {
  const chia = validators.chia;
  const thuongDu = validators["thuong-du"];

  it("chia accepts the quotient and the remainder of total : people", () => {
    const params = { total: 29, people: 6 };
    expect(chia({ q: 4, r: 5 }, params)).toBe(true);
    expect(chia({ q: 5, r: 5 }, params)).toBe(false);
    expect(chia({ q: 3, r: 11 }, params)).toBe(false);
    expect(chia({}, params)).toBe(false);
    expect(chia({ q: 0, r: 0 }, { total: 29 })).toBe(false);
    expect(solutions.chia(params)).toEqual({ q: 4, r: 5 });
    expect(chia(solutions.chia(params), params)).toBe(true);
  });

  it("thuong-du accepts the digits of the real quotient and remainder", () => {
    const params = { dividend: 217, divisor: 15 };
    expect(thuongDu({ q1: 1, q0: 4, r1: 0, r0: 7 }, params)).toBe(true);
    expect(thuongDu({ q1: 1, q0: 4, r1: 0, r0: 8 }, params)).toBe(false);
    expect(thuongDu({ q1: 1, q0: 5, r1: 0, r0: 7 }, params)).toBe(false);
    expect(thuongDu({}, params)).toBe(false);
    expect(solutions["thuong-du"](params)).toEqual({
      q1: 1,
      q0: 4,
      r1: 0,
      r0: 7,
    });
  });

  it("every solver answer is accepted by its validator", () => {
    for (const [total, people] of [
      [29, 6],
      [56, 8],
      [7, 9],
      [0, 3],
    ] as const) {
      const params = { total, people };
      expect(chia(solutions.chia(params), params)).toBe(true);
    }
    for (const [dividend, divisor] of [
      [217, 15],
      [154, 12],
      [163, 15],
      [999, 1],
      [5, 7],
      [367, 9],
      [100, 10],
    ] as const) {
      const params = { dividend, divisor };
      expect(thuongDu(solutions["thuong-du"](params), params)).toBe(true);
    }
  });
});

describe("sharing and packing steps", () => {
  it("deals round by round and sets the remainder apart", () => {
    const steps = shareSteps(23, 4, "steps");
    expect(steps.map((s) => s.rounds)).toEqual([0, 1, 2, 3, 4, 5, 5, 5]);
    expect(steps[2]?.caption).toBe("Vòng 2: mỗi bạn có 2 cái, còn 15 cái.");
    expect(steps.filter((s) => s.apart)).toHaveLength(2);
    expect(steps[6]?.caption).toContain("Số dư là 3");
    expect(steps.at(-1)?.result).toBe(true);
  });

  it("never shows the result in a hint", () => {
    for (const [total, people] of [
      [45, 9],
      [19, 4],
    ] as const) {
      const steps = shareSteps(total, people, "hint");
      expect(steps.some((s) => s.result || s.apart)).toBe(false);
      const { quotient } = { quotient: Math.floor(total / people) };
      expect(steps.at(-1)?.rounds).toBe(quotient - 1);
    }
  });

  it("groups rounds when there are many", () => {
    const steps = shareSteps(56, 2, "steps");
    expect(steps.length).toBeLessThanOrEqual(MAX_ROUND_STEPS + 3);
    expect(steps.at(-1)?.rounds).toBe(28);
  });

  it("packs with the decision sentences of both goals", () => {
    const up = packSteps(50, 12, "up", "steps", {
      groupWord: "xe",
      itemWord: "học sinh",
      perVerb: "chở",
    });
    expect(up.at(-1)?.caption).toBe("Còn 2 học sinh, cần thêm 1 xe. Cần 5 xe.");
    const down = packSteps(100, 12, "down", "steps", {
      groupWord: "quyển vở",
      itemWord: "nghìn đồng",
      perVerb: "giá",
    });
    expect(down.at(-1)?.caption).toBe(
      "Còn 4 nghìn đồng, chưa đủ mua thêm 1 quyển vở. Mua được 8 quyển vở.",
    );
    expect(packResult(150, 24, "up")).toEqual({
      full: 6,
      remainder: 6,
      answer: 7,
    });
  });

  it("hides the decision of a packing hint", () => {
    const steps = packSteps(38, 9, "up", "hint", {
      groupWord: "thùng",
      itemWord: "chai",
      perVerb: "chứa",
    });
    expect(steps.at(-1)?.caption).toContain("Cần ? thùng");
    expect(steps.at(-1)?.decided).toBe(false);
  });
});

describe("remainder check", () => {
  it("accepts a remainder smaller than the divisor that rebuilds the dividend", () => {
    expect(remainderCheck({ dividend: 367, divisor: 9, q: 40, r: 7 }).ok).toBe(
      true,
    );
    expect(remainderCheck({ dividend: 47, divisor: 9, q: 5, r: 2 }).ok).toBe(
      true,
    );
  });

  it("rejects a remainder that is not smaller than the divisor", () => {
    const check = remainderCheck({ dividend: 37, divisor: 5, q: 6, r: 7 });
    expect(check.holds).toBe(true);
    expect(check.ok).toBe(false);
  });

  it("agrees with the `ok` flag of every catalog item", () => {
    for (const spec of Object.values(VISUAL_SPECS)) {
      if (spec.kind === "remCheck") {
        expect(remainderCheck(spec).ok).toBe(spec.ok);
      }
    }
  });
});

describe("components", () => {
  it("builds a visual for every spec of these kinds", () => {
    const kinds = new Set([
      "share",
      "shareTry",
      "shareFill",
      "factFamily",
      "remCheck",
      "colDiv",
      "colDivTry",
      "colDivFill",
      "pack",
    ]);
    for (const spec of Object.values(VISUAL_SPECS)) {
      if (!kinds.has(spec.kind)) continue;
      const Visual = fromSpec(spec);
      const { container, unmount } = render(<Visual />);
      expect(container.querySelector("svg")).not.toBeNull();
      unmount();
    }
  });

  it("colDivTry locks right digits, rings a wrong one and finishes", () => {
    const Visual = fromSpec({ kind: "colDivTry", dividend: 75, divisor: 6 });
    const onStateChange = vi.fn();
    render(<Visual onStateChange={onStateChange} />);
    const press = (digit: number) =>
      fireEvent.click(screen.getByRole("button", { name: String(digit) }));
    expect(screen.getByText("Đã xong 0/6 bước")).toBeInTheDocument();
    // 75 : 6: quotient digit 1, product 6, difference 1, then 15 : 6 = 2,
    // product 12, difference 3.
    press(9);
    expect(
      screen.getByText(/Chưa đúng. Thử nhân số chia 6/),
    ).toBeInTheDocument();
    press(1);
    expect(screen.getByText("Đã xong 1/6 bước")).toBeInTheDocument();
    press(6);
    press(1);
    expect(screen.getByText("Đã xong 3/6 bước")).toBeInTheDocument();
    for (const digit of [2, 1, 2, 3]) press(digit);
    expect(onStateChange).toHaveBeenLastCalledWith({ done: 6 });
    expect(screen.getByText("Đã xong 6/6 bước")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "75 chia 6 bằng 12 dư 3" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Làm lại/ }));
    expect(screen.getByText("Đã xong 0/6 bước")).toBeInTheDocument();
  });

  it("shareTry stops dealing when fewer items remain than plates", () => {
    const Visual = fromSpec({ kind: "shareTry", total: 17, people: 5 });
    render(<Visual />);
    const deal = () =>
      fireEvent.click(screen.getByRole("button", { name: "Chia một vòng" }));
    deal();
    deal();
    expect(screen.getByText("Đã chia 2 vòng")).toBeInTheDocument();
    deal();
    expect(screen.queryByRole("button", { name: "Chia một vòng" })).toBeNull();
    expect(
      screen.getByText(
        "Còn 2 cái, ít hơn 5 bạn nên không chia tiếp được. Số dư là 2.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "17 chia 5 bằng 3 dư 2" }),
    ).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Chia lại/ }));
    expect(screen.getByText("Đã chia 0 vòng")).toBeInTheDocument();
  });

  it("shareFill reports { q, r } and follows shownState when locked", () => {
    const Visual = fromSpec({ kind: "shareFill" });
    const onStateChange = vi.fn();
    const { rerender } = render(
      <Visual
        onStateChange={onStateChange}
        {...{ params: { total: 29, people: 6 } }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Tăng mỗi bạn nhận" }));
    fireEvent.click(screen.getByRole("button", { name: "Tăng còn dư" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ q: 1, r: 1 });
    rerender(<Visual shownState={{ q: 4, r: 5 }} disabled />);
    expect(screen.getByRole("button", { name: "Tăng còn dư" })).toBeDisabled();
    expect(screen.getByRole("img", { name: /mỗi bạn 4 cái, còn dư 5 cái/ }));
  });

  it("colDivFill shows one stepper per quotient and remainder place", () => {
    const Visual = fromSpec({ kind: "colDivFill" });
    const onStateChange = vi.fn();
    render(
      <Visual
        onStateChange={onStateChange}
        {...{ params: { dividend: 217, divisor: 15 } }}
      />,
    );
    expect(screen.getAllByRole("group")).toHaveLength(4);
    fireEvent.click(screen.getByRole("button", { name: "Tăng thương: chục" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ q1: 1 });
    expect(
      screen.queryByRole("button", { name: "Tăng thương: trăm" }),
    ).toBeNull();
  });
});
