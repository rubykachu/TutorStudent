import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BcLists } from "@/visuals/math/boi-chung-boi-chung-nho-nhat/bc-lists";
import { BcnnTable } from "@/visuals/math/boi-chung-boi-chung-nho-nhat/bcnn-table";
import {
  INTERACTIVE_KINDS,
  VALIDATOR_IDS,
  VISUAL_SPECS,
} from "@/visuals/math/boi-chung-boi-chung-nho-nhat/catalog";
import {
  commonMultiples,
  exponentOf,
  gcd,
  largestExponent,
  lcm,
  lcmOf,
  meets,
  multiplesUpTo,
  primePowers,
  primesOf,
  ROUND_RANGE,
  solutions,
  texPower,
  validators,
} from "@/visuals/math/boi-chung-boi-chung-nho-nhat/logic";
import { MeetTry } from "@/visuals/math/boi-chung-boi-chung-nho-nhat/meet-try";
import { visualRegistry } from "@/visuals/registry";

describe("multiple helpers", () => {
  it("finds gcd, lcm and multiples", () => {
    expect(gcd(12, 18)).toBe(6);
    expect(lcm(6, 8)).toBe(24);
    expect(lcmOf([4, 6, 10])).toBe(60);
    expect(multiplesUpTo(8, 40)).toEqual([8, 16, 24, 32, 40]);
    expect(commonMultiples([6, 8], 50)).toEqual([24, 48]);
  });

  it("factorises and reads exponents", () => {
    expect(primePowers(72)).toEqual([
      [2, 3],
      [3, 2],
    ]);
    expect(exponentOf(18, 2)).toBe(1);
    expect(exponentOf(18, 5)).toBe(0);
    expect(primesOf([12, 18, 10])).toEqual([2, 3, 5]);
    expect(largestExponent([12, 18], 3)).toBe(2);
    expect(texPower(2, 1)).toBe("\\concept{sky}{2}");
    expect(texPower(2, 3)).toBe("\\concept{sky}{2}^{\\concept{violet}{3}}");
  });

  it("the prime-power rule gives the lcm for every pair up to 40", () => {
    for (let a = 1; a <= 40; a++) {
      for (let b = 1; b <= 40; b++) {
        const primes = primesOf([a, b]);
        const byPrimes = primes.reduce(
          (product, p) => product * p ** largestExponent([a, b], p),
          1,
        );
        expect(byPrimes).toBe(lcm(a, b));
        expect((a * b) / gcd(a, b)).toBe(lcm(a, b));
      }
    }
  });
});

describe("the rounds exercise", () => {
  const validate = validators["gap-nhau"];
  const solve = solutions["gap-nhau"];

  it("accepts only rounds that reach the same place", () => {
    expect(validate({ a: 5, b: 4 }, { p: 4, q: 5, first: 1 })).toBe(true);
    expect(validate({ a: 4, b: 3 }, { p: 5, q: 4, first: 1 })).toBe(false);
    expect(validate({ a: 1, b: 1 }, { p: 4, q: 5, first: 0 })).toBe(false);
  });

  it("wants the first place when asked, any shared place otherwise", () => {
    // 40 is a shared place of 4 and 5 but not the first one (20).
    const rounds = { a: 10, b: 8 };
    expect(meets(rounds, { p: 4, q: 5, first: false })).toBe(true);
    expect(meets(rounds, { p: 4, q: 5, first: true })).toBe(false);
  });

  it("never passes a state the child has not set", () => {
    expect(validate({}, { p: 4, q: 5, first: 0 })).toBe(false);
    expect(validate({ a: 2 }, { p: 4, q: 5, first: 0 })).toBe(false);
  });

  it("solves every pair the screens use with rounds inside the range", () => {
    const pairs = Object.values(VISUAL_SPECS).flatMap((spec) =>
      spec.kind === "meetTry" ? [spec.numbers] : [],
    );
    expect(pairs.length).toBeGreaterThan(0);
    for (const [p, q] of [...pairs, [4, 5], [6, 8], [3, 7]]) {
      const params = { p: p ?? 0, q: q ?? 0, first: 1 };
      const state = solve(params);
      expect(validate(state, params)).toBe(true);
      expect(state.a).toBeLessThanOrEqual(ROUND_RANGE.max);
      expect(state.b).toBeLessThanOrEqual(ROUND_RANGE.max);
    }
  });
});

describe("catalog", () => {
  it("every multiples picture shows the shared multiples and, when asked, the least one", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (spec.kind !== "bcLists") continue;
      const steps = spec.rows.map((row) => row.step);
      const shared = commonMultiples(steps, spec.upTo);
      if (spec.mode !== "hint") {
        expect(shared.length, key).toBeGreaterThan(0);
      }
      if (spec.least) {
        expect(shared[0], key).toBe(lcmOf(steps));
      }
    }
  });

  it("every prime table has columns to compare", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (spec.kind !== "bcnnTable") continue;
      expect(spec.numbers.length, key).toBeGreaterThanOrEqual(2);
      expect(primesOf(spec.numbers).length, key).toBeGreaterThanOrEqual(2);
    }
  });

  it("rows of a worked example differ, so each can be a React key", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      if (spec.kind !== "lines" && spec.kind !== "rows") continue;
      const texts = spec.rows.map((row) => row.tex);
      expect(new Set(texts).size, key).toBe(texts.length);
    }
  });

  it("every pick screen chooses chips that exist, and the registry marks the interactive ones", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      const entry =
        visualRegistry[`boi-chung-boi-chung-nho-nhat.visual.${key}`];
      expect(entry, key).toBeDefined();
      expect(entry?.interactive, key).toBe(INTERACTIVE_KINDS.has(spec.kind));
      if (spec.kind === "chips") {
        for (const index of spec.wants ?? []) {
          expect(spec.items[index], key).toBeDefined();
        }
      }
      if (spec.kind in VALIDATOR_IDS) {
        const id = VALIDATOR_IDS[spec.kind as keyof typeof VALIDATOR_IDS];
        expect(entry?.validators?.[id], key).toBeDefined();
      }
    }
  });
});

describe("pictures", () => {
  const lists = VISUAL_SPECS["bc-6-8"];
  const table = VISUAL_SPECS["bang-12-18-xong"];

  it("draws the shared multiples of the finished list picture", () => {
    if (lists?.kind !== "bcLists") throw new Error("bc-6-8");
    render(<BcLists spec={{ ...lists, mode: "still" }} />);
    expect(
      screen.getByRole("img", { name: "BC(6, 8): 24, 48" }),
    ).toBeInTheDocument();
  });

  it("draws the largest exponents of the finished prime table", () => {
    if (table?.kind !== "bcnnTable") throw new Error("bang-12-18-xong");
    render(<BcnnTable spec={table} />);
    expect(screen.getByText("Số mũ lớn nhất")).toBeInTheDocument();
    expect(screen.getByText("Bội chung nhỏ nhất")).toBeInTheDocument();
  });
});

describe("MeetTry", () => {
  const spec = VISUAL_SPECS["gap-3-4"];

  it("reports the rounds as the child counts and says when the first shared place is reached", () => {
    if (spec?.kind !== "meetTry") throw new Error("gap-3-4");
    const onStateChange = vi.fn();
    render(<MeetTry spec={spec} onStateChange={onStateChange} />);
    const upA = screen.getByRole("button", { name: "Tăng xe a đã chạy" });
    const upB = screen.getByRole("button", { name: "Tăng xe b đã chạy" });
    for (let i = 0; i < 3; i++) fireEvent.click(upA);
    for (let i = 0; i < 2; i++) fireEvent.click(upB);
    expect(onStateChange).toHaveBeenLastCalledWith({ a: 4, b: 3 });
    expect(
      screen.getByText(/Xong rồi! Lần đầu cả hai cùng ở 12 phút/),
    ).toBeInTheDocument();
  });

  it("reports the opening state of an exercise at once and draws the exercise's own numbers", () => {
    if (spec?.kind !== "meetTry") throw new Error("gap-3-4");
    const onStateChange = vi.fn();
    render(
      <MeetTry
        spec={{ ...spec, goal: undefined }}
        params={{ p: 4, q: 5, first: 1 }}
        onStateChange={onStateChange}
      />,
    );
    expect(onStateChange).toHaveBeenCalledWith({ a: 1, b: 1 });
    expect(screen.getByText("Mỗi chuyến là 4 phút")).toBeInTheDocument();
    expect(screen.getByText("Mỗi chuyến là 5 phút")).toBeInTheDocument();
  });

  it("draws the answer the exercise reveals and locks the buttons", () => {
    if (spec?.kind !== "meetTry") throw new Error("gap-3-4");
    render(<MeetTry spec={spec} shownState={{ a: 4, b: 3 }} />);
    expect(screen.getByText("Cả hai cùng ở 12 phút")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tăng xe a đã chạy" }),
    ).toBeDisabled();
  });
});
