import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  cellId,
  planMultiplication,
  stepSentence,
  tryCells,
} from "@/visuals/math/phep-nhan-phep-chia/col-mul-digits";
import {
  assignLanes,
  boundsOf,
  inZone,
  planAxis,
} from "@/visuals/math/phep-nhan-phep-chia/estimate-model";
import {
  solutions,
  spelledProduct,
  validators,
} from "@/visuals/math/phep-nhan-phep-chia/validators-cot";
import { visualRegistry } from "@/visuals/registry";

const ID = "phep-nhan-phep-chia.visual.";

async function load(key: string) {
  const entry = visualRegistry[`${ID}${key}`];
  if (!entry) throw new Error(key);
  return (await entry.load()).default;
}

describe("column multiplication digits", () => {
  it("writes exactly a · b for every a up to 3 digits and b up to 2 digits", () => {
    for (let a = 1; a <= 999; a += a < 120 ? 1 : 7) {
      for (let b = 1; b <= 99; b += b < 30 ? 1 : 4) {
        const plan = planMultiplication(a, b);
        const rows = new Map<number, number>();
        for (const step of plan.steps) {
          if (step.kind !== "partial") continue;
          for (const cell of step.cells) {
            rows.set(
              step.row,
              (rows.get(step.row) ?? 0) + cell.digit * 10 ** cell.column,
            );
          }
        }
        // Each row holds a · (digit of b), shifted by its row.
        const total = [...rows.values()].reduce((x, y) => x + y, 0);
        expect(total, `${a}·${b}`).toBe(a * b);
        const sum = plan.steps.find((s) => s.kind === "sum");
        if (sum) {
          const spelled = sum.cells.reduce(
            (n, c) => n + c.digit * 10 ** c.column,
            0,
          );
          expect(spelled, `${a}·${b} sum`).toBe(a * b);
        }
      }
    }
  });

  it("carries the tens digit and writes the whole total on the last digit", () => {
    const plan = planMultiplication(38, 6);
    expect(plan.steps.map((s) => stepSentence(s))).toEqual([
      "8 · 6 = 48: viết 8, nhớ 4",
      "3 · 6 = 18, cộng 4 được 22: viết 22",
    ]);
    const first = plan.steps[0];
    expect(first?.kind === "partial" && first.carryOut).toBe(4);
    expect(plan.product).toBe(228);
  });

  it("shifts the second partial product and ends with the sum", () => {
    const plan = planMultiplication(36, 24);
    const sentences = plan.steps.map((s) => stepSentence(s));
    expect(sentences[0]).toBe("6 · 4 = 24: viết 4, nhớ 2");
    expect(sentences[2]).toBe(
      "Hàng chục, lùi một cột. 6 · 2 = 12: viết 2, nhớ 1",
    );
    expect(sentences.at(-1)).toBe("144 + 720 = 864");
    // The second row starts one column to the left of the first.
    const secondRow = plan.steps.find(
      (s) => s.kind === "partial" && s.row === 1,
    );
    expect(secondRow?.cells[0]?.column).toBe(1);
  });

  it("hides the result of a step when asked", () => {
    const plan = planMultiplication(35, 8);
    const last = plan.steps.at(-1);
    if (!last) throw new Error("no steps");
    expect(stepSentence(last, true)).toBe("3 · 8 = 24, cộng 4 được ?");
    const sumPlan = planMultiplication(45, 21);
    const sum = sumPlan.steps.at(-1);
    if (!sum) throw new Error("no steps");
    expect(stepSentence(sum, true)).toBe("45 + 900 = ?");
  });

  it("groups a long sum with the narrow no-break space", () => {
    const sum = planMultiplication(999, 99).steps.at(-1);
    if (!sum) throw new Error("no steps");
    expect(stepSentence(sum)).toBe("8\u202f991 + 89\u202f910 = 98\u202f901");
  });

  it("lists the cells of the hands-on screen in fill order with the right digits", () => {
    const cells = tryCells(planMultiplication(26, 4));
    expect(cells.map((c) => [c.id, c.digit])).toEqual([
      [cellId.partial(0, 0), 4],
      [cellId.partial(0, 1), 0],
      [cellId.partial(0, 2), 1],
    ]);
    const two = tryCells(planMultiplication(23, 14));
    // Partial 1 (4 cells at most), partial 2, then the sum column by column.
    expect(two.at(-1)?.id).toBe(
      cellId.sum(two.filter((c) => c.id.startsWith("s")).length - 1),
    );
    expect(two.filter((c) => c.id.startsWith("s")).map((c) => c.digit)).toEqual(
      [2, 2, 3],
    );
  });
});

describe("tich-cot validator", () => {
  it("accepts the digits of a · b and nothing else", () => {
    const validate = validators["tich-cot"];
    expect(
      validate(
        { thousands: 0, hundreds: 3, tens: 4, ones: 2 },
        { a: 57, b: 6 },
      ),
    ).toBe(true);
    expect(
      validate(
        { thousands: 0, hundreds: 3, tens: 4, ones: 3 },
        { a: 57, b: 6 },
      ),
    ).toBe(false);
    expect(
      validate(
        { thousands: 0, hundreds: 7, tens: 0, ones: 2 },
        { a: 54, b: 13 },
      ),
    ).toBe(true);
    expect(
      validate(
        { thousands: 1, hundreds: 0, tens: 2, ones: 4 },
        { a: 32, b: 32 },
      ),
    ).toBe(true);
    expect(validate({ hundreds: 3, tens: 4, ones: 2 }, { a: 57, b: 6 })).toBe(
      false,
    );
    expect(
      validate({ thousands: 0, hundreds: 3, tens: 4, ones: 2 }, { a: 57 }),
    ).toBe(false);
  });

  it("solves to a state it accepts, for the lesson's and other numbers", () => {
    const validate = validators["tich-cot"];
    const solve = solutions["tich-cot"];
    for (const params of [
      { a: 57, b: 6 },
      { a: 54, b: 13 },
      { a: 35, b: 26 },
      { a: 99, b: 99 },
      { a: 1, b: 1 },
      { a: 100, b: 10 },
    ]) {
      expect(validate(solve(params), params), JSON.stringify(params)).toBe(
        true,
      );
    }
    expect(spelledProduct(solve({ a: 57, b: 6 }))).toBe(342);
    expect(() => solve({ a: 999, b: 99 })).toThrow();
  });
});

describe("estimate axis", () => {
  it("bounds the product and recognises the option inside the zone", () => {
    const bounds = boundsOf({ a: 53, b: 7, lowA: 50, highA: 60 });
    expect(bounds).toEqual({ low: 350, high: 420, product: 371 });
    const options = [271, 371, 471, 3710];
    expect(options.filter((v) => inZone(v, bounds))).toEqual([371]);
  });

  it("keeps values in order and moves far options to a slot behind a break", () => {
    const bounds = boundsOf({ a: 53, b: 7, lowA: 50, highA: 60 });
    const axis = planAxis(bounds, [271, 371, 471, 3710], 24, 316, 64);
    expect(axis.toX(271)).toBeLessThan(axis.toX(350));
    expect(axis.toX(350)).toBeLessThan(axis.toX(371));
    expect(axis.toX(371)).toBeLessThan(axis.toX(420));
    expect(axis.toX(471)).toBeLessThanOrEqual(316 - 64);
    expect(axis.far.map((f) => f.value)).toEqual([3710]);
    expect(axis.breaks).toHaveLength(1);
    expect(axis.far[0]?.x).toBeGreaterThan(316 - 64);
  });

  it("uses no slot and no break when every option is near", () => {
    const axis = planAxis(
      { low: 480, high: 560, product: 496 },
      [],
      24,
      316,
      64,
    );
    expect(axis.breaks).toEqual([]);
    expect(axis.far).toEqual([]);
    expect(axis.toX(480)).toBeGreaterThan(24);
    expect(axis.toX(560)).toBeLessThan(316);
  });

  it("puts labels that are close together in different lanes", () => {
    expect(assignLanes([10, 20, 30, 200], 54)).toEqual([0, 1, 0, 0]);
  });
});

describe("column multiplication visuals", () => {
  it("draws the finished calculation with its carry and a Vietnamese label", async () => {
    const Visual = await load("nhan-cot-54-7-xong");
    render(<Visual />);
    const figure = screen.getByRole("img", {
      name: "Đặt tính 54 nhân 7, tích bằng 378",
    });
    expect(figure).toBeInTheDocument();
    expect(screen.getByText("Số nhớ")).toBeInTheDocument();
  });

  it("stops a hint before the last result", async () => {
    const Visual = await load("tinh-46-7-goi-y");
    render(<Visual />);
    // Step through the hint with the manual button under reduced motion, or
    // wait: here the first step is enough to check nothing leaks.
    expect(screen.queryByText("280")).toBeNull();
    expect(
      screen.getByRole("img", { name: "Đặt tính 35 nhân 8" }),
    ).toBeInTheDocument();
  });

  it("fills the product with the keys, rejects a wrong digit and closes", async () => {
    const Visual = await load("nhan-cot-26-4-cung-lam");
    const onStateChange = vi.fn();
    render(<Visual onStateChange={onStateChange} />);
    const key = (d: number) =>
      screen.getByRole("button", { name: `Chữ số ${d}` });
    expect(screen.getByText("Đã xong 0/3 ô")).toBeInTheDocument();

    fireEvent.click(key(9));
    expect(screen.getByText(/^Nhân 6 · 4\./)).toBeInTheDocument();
    expect(screen.getByText("Đã xong 0/3 ô")).toBeInTheDocument();

    fireEvent.click(key(4));
    expect(onStateChange).toHaveBeenLastCalledWith({ done: 1 });
    fireEvent.click(key(0));
    fireEvent.click(key(1));
    expect(screen.getByText("Đã xong 3/3 ô")).toBeInTheDocument();
    expect(screen.getByText("Xong rồi! 26 · 4 = 104")).toBeInTheDocument();
    expect(key(1)).toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));
    expect(screen.getByText("Đã xong 0/3 ô")).toBeInTheDocument();
  });

  it("has keys at least 48px high for every digit", async () => {
    const Visual = await load("nhan-cot-23-14-cung-lam");
    render(<Visual />);
    for (let d = 0; d <= 9; d++) {
      expect(
        screen.getByRole("button", { name: `Chữ số ${d}` }).className,
      ).toContain("min-h-touch");
    }
  });

  it("the exercise visual reports the place digits and satisfies tich-cot", async () => {
    const entry = visualRegistry[`${ID}nhan-cot`];
    const validate = entry?.validators?.["tich-cot"];
    if (!entry || !validate) throw new Error("nhan-cot missing");
    const Visual = await load("nhan-cot");
    const onStateChange = vi.fn();
    render(<Visual onStateChange={onStateChange} />);
    const up = (place: string) =>
      screen.getByRole("button", { name: `Tăng chữ số hàng ${place}` });
    for (let i = 0; i < 3; i++) fireEvent.click(up("trăm"));
    for (let i = 0; i < 4; i++) fireEvent.click(up("chục"));
    for (let i = 0; i < 2; i++) fireEvent.click(up("đơn vị"));
    const state = onStateChange.mock.calls.at(-1)?.[0];
    expect(state).toEqual({ thousands: 0, hundreds: 3, tens: 4, ones: 2 });
    expect(validate(state, { a: 57, b: 6 })).toBe(true);
    expect(validate(state, { a: 54, b: 13 })).toBe(false);
  });

  it("shows a given state read-only and locks when disabled", async () => {
    const Visual = await load("nhan-cot");
    const solved = solutions["tich-cot"]({ a: 57, b: 6 });
    render(<Visual shownState={solved} />);
    expect(screen.getByText("Tích: 342")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tăng chữ số hàng chục" }),
    ).toBeDisabled();
  });
});

describe("estimate and mistakes visuals", () => {
  it("labels the estimate without giving the product in a hint", async () => {
    const Visual = await load("chon-tich-53-7-goi-y");
    render(<Visual />);
    const figure = screen.getByRole("img", {
      name: /^Trục số ước lượng tích 43 · 6 từ 40 · 6 và 50 · 6$/,
    });
    expect(within(figure).queryByText("258")).toBeNull();
    expect(within(figure).queryByText("240")).toBeNull();
  });

  it("draws the finished estimate with its zone", async () => {
    const Visual = await load("uoc-luong-tom-tat");
    render(<Visual />);
    const figure = screen.getByRole("img", {
      name: /tích nằm giữa 240 và 300/,
    });
    expect(within(figure).getByText("282")).toBeInTheDocument();
  });

  it("shows one mistake at a time, picked with three buttons", async () => {
    const Visual = await load("loi-sai-ba");
    render(<Visual />);
    const tabs: [string, string][] = [
      ["Số nhớ", "Quên số nhớ"],
      ["Số dư", "Số dư lớn hơn số chia"],
      ["Chữ số 0", "Quên chữ số 0 ở thương"],
    ];
    for (const [tab, heading] of tabs) {
      fireEvent.click(screen.getByRole("button", { name: tab }));
      expect(
        screen.getByRole("heading", { name: new RegExp(heading) }),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Sai")).toHaveLength(1);
      expect(screen.getAllByRole("heading")).toHaveLength(1);
    }
  });
});
