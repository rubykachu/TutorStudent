import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FeedbackSoundsProvider } from "@/lib/feedback-sounds";
import { JINGLE_ID } from "@/lib/sound-manifest";
import {
  tapRegions,
  VISUAL_SPECS,
} from "@/visuals/math/thu-tu-thuc-hien-phep-tinh/catalog";
import {
  calculations,
  expressionLines,
  expressionValue,
  nextOperation,
  operationIndices,
  parseExpression,
} from "@/visuals/math/thu-tu-thuc-hien-phep-tinh/expression";
import { TryIt } from "@/visuals/math/thu-tu-thuc-hien-phep-tinh/try-it";

function steps(source: string): string[] {
  return calculations(source).map(
    (c) => `${c.left}${c.sign}${c.right}=${c.result}`,
  );
}

describe("expression steps", () => {
  it("does the operations in the order the workbook's key example shows", () => {
    // 12 + 3 · 2⁵ : 4 − 3 = 33, one operation per line as the workbook's
    // correct solution writes it.
    expect(steps("12+3·2^5:4-3")).toEqual([
      "2^5=32",
      "3·32=96",
      "96:4=24",
      "12+24=36",
      "36-3=33",
    ]);
  });

  it("goes from left to right among equal-rank operations", () => {
    expect(steps("51-23+17+2-1")).toEqual([
      "51-23=28",
      "28+17=45",
      "45+2=47",
      "47-1=46",
    ]);
    expect(steps("120:3·5:4")).toEqual(["120:3=40", "40·5=200", "200:4=50"]);
  });

  it("works brackets from the inside out and drops a bracket once it holds one number", () => {
    const lines = expressionLines("3^2-5·[3·(4-1)-8]");
    const brackets = (i: number) =>
      lines[i]?.tokens.filter((t) => t.kind === "open").length;
    expect([brackets(0), brackets(1), brackets(2), brackets(3)]).toEqual([
      2, 1, 1, 0,
    ]);
    expect(steps("3^2-5·[3·(4-1)-8]")).toEqual([
      "4-1=3",
      "3·3=9",
      "9-8=1",
      "3^2=9",
      "5·1=5",
      "9-5=4",
    ]);
  });

  it("agrees with the answer key of the workbook exercises it mirrors", () => {
    const key: [string, number][] = [
      ["3+4+5-7", 5],
      ["2·3·4·5:6", 20],
      ["3·10^3+2·10^2+5·10", 3250],
      ["35-2·1^111+3·7·7^2", 1062],
      ["5·4^3+2·3-81·2+7", 171],
      ["2^5+2·{12+2·[3·(5-2)+1]+1}+1", 99],
      ["10·3^2+5·(1+2+3)", 120],
      ["2·4^2-3·4+120:15", 28],
    ];
    for (const [source, value] of key) {
      expect(expressionValue(source), source).toBe(value);
    }
  });

  it("rejects a result outside the natural numbers", () => {
    expect(() => expressionValue("3-5")).toThrow();
    expect(() => expressionValue("7:2")).toThrow();
  });

  it("numbers the tappable operations left to right", () => {
    const source = "2·(3+4)+5";
    expect(tapRegions(source)).toEqual(["op1", "op2", "op3"]);
    const tokens = parseExpression(source);
    expect(
      operationIndices(tokens).indexOf(nextOperation(tokens)?.index ?? -1),
    ).toBe(1);
  });

  it("only catalogues expressions that evaluate", () => {
    for (const spec of Object.values(VISUAL_SPECS)) {
      if ("source" in spec)
        expect(() => expressionLines(spec.source)).not.toThrow();
      if (spec.kind === "compare" && spec.wrongSource) {
        expect(() => expressionLines(spec.wrongSource as string)).not.toThrow();
      }
    }
  });
});

describe("TryIt", () => {
  function regionOf(name: string) {
    return screen.getByRole("button", { name });
  }
  const nextButton = () =>
    screen.getByRole("button", { name: /Tiếp theo|Xem kết quả/ });

  it("works out a tapped operation only when the rules put it next", () => {
    const onStateChange = vi.fn();
    render(<TryIt source="8+6·2" onStateChange={onStateChange} />);

    fireEvent.click(regionOf("Phép cộng"));
    expect(onStateChange).not.toHaveBeenCalled();
    expect(screen.getByText("Chưa phải. Thử phép khác.")).toBeTruthy();

    fireEvent.click(regionOf("Phép nhân"));
    fireEvent.click(nextButton());
    expect(onStateChange).toHaveBeenLastCalledWith({ done: 1 });
    fireEvent.click(regionOf("Phép cộng"));
    fireEvent.click(nextButton());
    expect(onStateChange).toHaveBeenLastCalledWith({ done: 2 });
    expect(screen.getByText("Xong rồi.")).toBeTruthy();
  });

  it("stays on a right tap, shows it is right and plays the jingle, then moves on only when the child taps", () => {
    const play = vi.fn();
    const onStateChange = vi.fn();
    render(
      <FeedbackSoundsProvider sounds={{ play, tap: vi.fn(), button: vi.fn() }}>
        <TryIt source="8+6·2" onStateChange={onStateChange} />
      </FeedbackSoundsProvider>,
    );

    fireEvent.click(regionOf("Phép nhân"));
    const status = screen.getByText(/Đúng rồi! 6 · 2 = 12/);
    expect(
      status
        .closest("[data-try-it-status]")
        ?.getAttribute("data-try-it-status"),
    ).toBe("correct");
    expect(play).toHaveBeenCalledWith([JINGLE_ID]);
    // Nothing advanced by itself: the tapped operation is marked right and
    // the other operations no longer take a tap.
    expect(onStateChange).not.toHaveBeenCalled();
    expect(regionOf("Phép nhân").getAttribute("data-revealed")).toBe("true");
    expect(regionOf("Phép cộng").getAttribute("aria-disabled")).toBe("true");

    fireEvent.click(nextButton());
    expect(onStateChange).toHaveBeenLastCalledWith({ done: 1 });
    expect(screen.queryByText(/Đúng rồi!/)).toBeNull();
  });

  it("starts over", () => {
    const onStateChange = vi.fn();
    render(<TryIt source="8+6·2" onStateChange={onStateChange} />);
    fireEvent.click(regionOf("Phép nhân"));
    fireEvent.click(nextButton());
    fireEvent.click(screen.getByRole("button", { name: "Làm lại" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ done: 0 });
    expect(regionOf("Phép nhân")).toBeTruthy();
  });
});
