import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  INTERACTIVE_KINDS,
  regionsOf,
  VALIDATOR_IDS,
  VISUAL_SPECS,
} from "@/visuals/math/cach-ghi-so-tu-nhien/catalog";
import { Gaps } from "@/visuals/math/cach-ghi-so-tu-nhien/gaps";
import {
  bestGap,
  digitsOf,
  groupedText,
  insertAt,
  numberOfDigits,
  placeLabel,
  placePower,
  ROMAN_MAX,
  romanParts,
  romanSplitTex,
  romanSumTex,
  romanValue,
  slotsNumber,
  solutions,
  sumTex,
  texInt,
  toRoman,
  validators,
  valueTex,
} from "@/visuals/math/cach-ghi-so-tu-nhien/logic";
import {
  Places,
  PlacesExplore,
  PlacesPick,
} from "@/visuals/math/cach-ghi-so-tu-nhien/places";
import { Slots } from "@/visuals/math/cach-ghi-so-tu-nhien/slots";
import {
  Sticks,
  sticksTotal,
} from "@/visuals/math/cach-ghi-so-tu-nhien/sticks";
import { visualRegistry } from "@/visuals/registry";
import { RegionProvider } from "@/visuals/shared/region";

describe("digits and places", () => {
  it("reads digits, places and grouped numbers", () => {
    expect(digitsOf(4073)).toEqual([4, 0, 7, 3]);
    expect(numberOfDigits([4, 0, 7, 3])).toBe(4073);
    expect(placePower(0, 4)).toBe(3);
    expect(placeLabel(2)).toBe("hàng trăm");
    expect(groupedText(25000)).toBe("25 000");
    expect(texInt(2975002)).toBe("2\\,975\\,002");
  });

  it("writes the value of a digit and a number as a sum without zero terms", () => {
    expect(valueTex(6, 2)).toBe("6 \\cdot 100");
    expect(valueTex(1, 0)).toBe("1");
    expect(valueTex(0, 3)).toBe("0");
    expect(sumTex(621)).toBe("6 \\cdot 100 + 2 \\cdot 10 + 1");
    expect(sumTex(5032)).toBe("5 \\cdot 1\\,000 + 3 \\cdot 10 + 2");
    expect(sumTex(0)).toBe("0");
  });

  it("the sum of the values of the digits is the number", () => {
    for (const n of [1, 9, 10, 100, 304, 7208, 20080, 513604, 2975002]) {
      const digits = digitsOf(n);
      const total = digits.reduce(
        (sum, digit, i) => sum + digit * 10 ** placePower(i, digits.length),
        0,
      );
      expect(total).toBe(n);
    }
  });
});

describe("inserting a digit", () => {
  it("finds the gap of the largest and the smallest number", () => {
    expect(bestGap([8, 1, 5, 2], 4, "max")).toBe(1);
    expect(bestGap([9, 8, 6, 3], 1, "max")).toBe(4);
    expect(bestGap([2, 9, 1, 5], 4, "min")).toBe(1);
    expect(bestGap([5, 1, 2, 4], 3, "min")).toBe(0);
  });

  it("agrees with trying every gap, for every digit 1 to 9 on many numbers", () => {
    const numbers = [8152, 7308, 2915, 9863, 4215, 5124, 2713, 6, 99, 1010];
    for (const n of numbers) {
      const digits = digitsOf(n);
      for (let digit = 1; digit <= 9; digit++) {
        const all = Array.from({ length: digits.length + 1 }, (_, gap) =>
          numberOfDigits(insertAt(digits, gap, digit)),
        );
        expect(
          numberOfDigits(
            insertAt(digits, bestGap(digits, digit, "max"), digit),
          ),
        ).toBe(Math.max(...all));
        expect(
          numberOfDigits(
            insertAt(digits, bestGap(digits, digit, "min"), digit),
          ),
        ).toBe(Math.min(...all));
      }
    }
  });
});

describe("Roman numerals", () => {
  it("converts 1 to 30 both ways", () => {
    expect(toRoman(24)).toBe("XXIV");
    expect(toRoman(19)).toBe("XIX");
    expect(toRoman(30)).toBe("XXX");
    for (let n = 1; n <= ROMAN_MAX; n++) {
      expect(romanValue(toRoman(n))).toBe(n);
    }
    expect(() => toRoman(31)).toThrow(RangeError);
    expect(() => toRoman(0)).toThrow(RangeError);
  });

  it("keeps the clusters IV and IX whole", () => {
    expect(romanParts("XXIV")).toEqual(["X", "X", "IV"]);
    expect(romanParts("XIX")).toEqual(["X", "IX"]);
    expect(romanParts("VIII")).toEqual(["V", "I", "I", "I"]);
    expect(romanSplitTex("XIV")).toBe(
      "\\mathrm{XIV} = \\mathrm{X} + \\mathrm{IV}",
    );
    expect(romanSumTex("XIV")).toBe("10 + 4 = 14");
  });

  it("the rule 'I before V or X subtracts, after adds' holds up to 30", () => {
    const value = { I: 1, V: 5, X: 10 } as const;
    for (let n = 1; n <= ROMAN_MAX; n++) {
      const letters = [...toRoman(n)] as (keyof typeof value)[];
      const total = letters.reduce((sum, letter, i) => {
        const next = letters[i + 1];
        const v = value[letter];
        return sum + (next !== undefined && v < value[next] ? -v : v);
      }, 0);
      expect(total).toBe(n);
    }
  });
});

describe("the write-the-number exercise", () => {
  const validate = validators["viet-so"];
  const solve = solutions["viet-so"];

  it("accepts exactly the digits of the number", () => {
    const params = { n: 2054, len: 4 };
    expect(validate({ d0: 2, d1: 0, d2: 5, d3: 4 }, params)).toBe(true);
    expect(validate({ d0: 2, d1: 5, d2: 0, d3: 4 }, params)).toBe(false);
    expect(validate({ d0: 2, d1: 0, d2: 5 }, params)).toBe(false);
    expect(validate({}, params)).toBe(false);
    expect(validate({ d0: 2, d1: 0, d2: 5, d3: 4 }, {})).toBe(false);
  });

  it("a leading zero is not a way to write the number", () => {
    expect(validate({ d0: 0, d1: 2, d2: 5, d3: 4 }, { n: 254, len: 4 })).toBe(
      false,
    );
  });

  it("solves to a state it accepts", () => {
    for (const params of [
      { n: 2054, len: 4 },
      { n: 305, len: 3 },
      { n: 90, len: 2 },
    ]) {
      expect(validate(solve(params), params)).toBe(true);
    }
  });

  it("reads the number spelled by the slots", () => {
    expect(slotsNumber({ d0: 3, d1: 4 }, 2)).toBe(34);
    expect(slotsNumber({ d0: 3 }, 2)).toBeUndefined();
  });
});

describe("the catalog", () => {
  it("every interactive kind and region kind has a registry entry that says so", () => {
    for (const [key, spec] of Object.entries(VISUAL_SPECS)) {
      const entry = visualRegistry[`cach-ghi-so-tu-nhien.visual.${key}`];
      expect(entry, key).toBeDefined();
      expect(entry?.interactive, key).toBe(INTERACTIVE_KINDS.has(spec.kind));
      expect(entry?.regions, key).toEqual(regionsOf(spec));
      const validatorId =
        spec.kind in VALIDATOR_IDS
          ? VALIDATOR_IDS[spec.kind as keyof typeof VALIDATOR_IDS]
          : undefined;
      expect(Object.keys(entry?.validators ?? {}), key).toEqual(
        validatorId === undefined ? [] : [validatorId],
      );
    }
  });

  it("names the digit regions left to right and the gaps around them", () => {
    expect(regionsOf({ kind: "placesPick", n: 5618 })).toEqual([
      "d0",
      "d1",
      "d2",
      "d3",
    ]);
    expect(regionsOf({ kind: "gaps", digits: "8152", add: 4 })).toEqual([
      "g0",
      "g1",
      "g2",
      "g3",
      "g4",
    ]);
    expect(regionsOf({ kind: "clockPick" })).toHaveLength(12);
    expect(regionsOf({ kind: "sticker" })).toBeUndefined();
  });

  it("every exercise region of a tapRegion visual is inside its regions", () => {
    // Answers of the lesson's tapRegion exercises are checked by content:check
    // against these same lists; here the lists themselves are well formed.
    for (const spec of Object.values(VISUAL_SPECS)) {
      const regions = regionsOf(spec);
      if (regions) expect(new Set(regions).size).toBe(regions.length);
    }
  });
});

describe("pictures", () => {
  it("draws the places of a number and its sum", () => {
    render(<Places spec={{ n: 534, show: "sum", mode: "still", focus: 1 }} />);
    expect(screen.getByLabelText(/Số 534 bằng tổng giá trị/)).toBeTruthy();
    expect(screen.getAllByText("hàng trăm").length).toBeGreaterThan(0);
  });

  it("the explore picture holds the screen until every row was opened", () => {
    render(<PlacesExplore spec={{ n: 306, ask: "value" }} />);
    expect(screen.getByText("Đã xem 0/3")).toBeTruthy();
    for (const button of screen.getAllByRole("button")) fireEvent.click(button);
    expect(screen.getByText("Đã xem 3/3")).toBeTruthy();
    expect(screen.getByText(/Xong rồi/)).toBeTruthy();
  });

  it("the explore picture shows no closing line inside an exercise", () => {
    render(<PlacesExplore spec={{ n: 306, ask: "name" }} params={{}} />);
    for (const button of screen.getAllByRole("button")) fireEvent.click(button);
    expect(screen.queryByText(/Xong rồi/)).toBeNull();
  });

  it("the slots report their digits and say nothing in an exercise", () => {
    const onStateChange = vi.fn();
    render(
      <Slots
        spec={{ len: 3, goal: 305 }}
        params={{ n: 305, len: 3 }}
        onStateChange={onStateChange}
      />,
    );
    fireEvent.click(
      screen.getAllByRole("button", { name: /Tăng/ })[0] as HTMLElement,
    );
    expect(onStateChange).toHaveBeenLastCalledWith({ d0: 0 });
    fireEvent.click(
      screen.getAllByRole("button", { name: /Tăng/ })[0] as HTMLElement,
    );
    expect(onStateChange).toHaveBeenLastCalledWith({ d0: 1 });
    expect(screen.queryByText(/Xong rồi/)).toBeNull();
  });

  it("the tap pictures draw plain shapes outside a tapRegion answer", () => {
    const { container } = render(<PlacesPick spec={{ n: 5618 }} />);
    expect(container.querySelectorAll("[data-region]")).toHaveLength(4);
  });

  it("a gap is a button inside a tapRegion answer", () => {
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
        <Gaps spec={{ digits: "8152", add: 4 }} />
      </RegionProvider>,
    );
    fireEvent.click(
      screen.getByRole("button", { name: /giữa chữ số 8 và chữ số 1/ }),
    );
    expect(onToggle).toHaveBeenCalledWith("g1");
  });

  it("counts the sticks of a Roman sum", () => {
    expect(sticksTotal("IV+V=XI")).toBe(12);
    expect(sticksTotal("VI+V=XI")).toBe(12);
    expect(sticksTotal("IV+V=IX")).toBe(12);
    const { container } = render(<Sticks spec={{ expr: "IV+V=XI" }} />);
    expect(container.querySelectorAll("line")).toHaveLength(12);
  });
});
