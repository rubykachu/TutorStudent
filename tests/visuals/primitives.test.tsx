import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatInteger } from "@/lib/number-format";
import {
  BagBox,
  Bags,
  bagColumns,
  DotBlock,
  packBags,
} from "@/visuals/shared/bag-groups";
import { BeadGroup } from "@/visuals/shared/bead-group";
import { DotGrid } from "@/visuals/shared/dot-grid";
import { FormulaRow, Lines, Rows } from "@/visuals/shared/formula-rows";
import { Highlight } from "@/visuals/shared/highlight";
import {
  DECORATIVE_ATTR,
  STATE_KEY_ATTR,
  STATE_STEP_ATTR,
  STATE_VALUE_ATTR,
} from "@/visuals/shared/markers";
import { NumberStepper } from "@/visuals/shared/number-stepper";
import { Chips } from "@/visuals/shared/pick-chips";
import { Reveal } from "@/visuals/shared/reveal";

describe("DotGrid", () => {
  it("fills the first cells and leaves the rest as empty slots", () => {
    const { container } = render(
      <DotGrid rows={2} columns={5} filled={3} color="amber" label="Ba chấm" />,
    );
    expect(screen.getByRole("img", { name: "Ba chấm" })).toBeInTheDocument();
    expect(container.querySelectorAll(".fill-concept-amber")).toHaveLength(3);
    expect(container.querySelectorAll(".fill-none")).toHaveLength(7);
  });

  it("marks halos as decorative so they may sit under the dots", () => {
    const { container } = render(
      <DotGrid rows={1} columns={3} highlighted={[1]} label="Ba chấm" />,
    );
    const halos = container.querySelectorAll(`[${DECORATIVE_ATTR}]`);
    expect(halos).toHaveLength(3);
    expect(halos[1]).toHaveStyle({ opacity: "1" });
    expect(halos[0]).toHaveStyle({ opacity: "0" });
  });
});

describe("BeadGroup", () => {
  const groups = [
    { color: "blue", count: 3, text: "2" },
    { color: "blue", count: 2, text: "2" },
  ] as const;

  it("draws one bead per count with its label", () => {
    const { container } = render(
      <BeadGroup groups={groups} merged={false} label="Hạt" />,
    );
    expect(container.querySelectorAll("[data-bead]")).toHaveLength(5);
    expect(screen.getByRole("img", { name: "Hạt" }).textContent).toBe("22222");
  });

  it("shows one bar per group while split and a single bar when merged", () => {
    const bars = (merged: boolean) => {
      const { container, unmount } = render(
        <BeadGroup groups={groups} merged={merged} label="Hạt" />,
      );
      const visible = [
        ...container.querySelectorAll("[data-group-bar]"),
      ].filter((bar) => (bar as SVGElement).style.opacity !== "0");
      unmount();
      return visible.map((bar) => bar.getAttribute("data-group-bar"));
    };
    expect(bars(false)).toEqual(["", ""]);
    expect(bars(true)).toEqual(["merged"]);
  });
});

describe("Highlight", () => {
  it("keeps its content and shows the decorative ring only when active", async () => {
    const { container, rerender } = render(
      <Highlight active={false} color="violet">
        3
      </Highlight>,
    );
    const ring = container.querySelector(`[${DECORATIVE_ATTR}]`);
    expect(ring).toHaveClass("border-concept-violet");
    expect(ring).toHaveStyle({ opacity: "0" });
    expect(container.textContent).toBe("3");

    rerender(
      <Highlight active color="violet">
        3
      </Highlight>,
    );
    await waitFor(() =>
      expect(container.querySelector(`[${DECORATIVE_ATTR}]`)).toHaveStyle({
        opacity: "1",
      }),
    );
  });
});

describe("BeadGroup crossed", () => {
  it("marks the last beads as crossed out", () => {
    const { container } = render(
      <BeadGroup
        groups={[{ color: "blue", count: 5, text: "2" }]}
        merged
        crossed={3}
        label="Năm hạt"
      />,
    );
    const beads = [...container.querySelectorAll("[data-bead]")];
    expect(beads.map((b) => b.hasAttribute("data-crossed"))).toEqual([
      false,
      false,
      true,
      true,
      true,
    ]);
  });

  it("draws a crossed bead's number above its slash, in the text colour", () => {
    const { container } = render(
      <BeadGroup
        groups={[{ color: "blue", count: 2, text: "2" }]}
        merged
        crossed={1}
        label="Hai hạt"
      />,
    );
    const crossed = container.querySelector("[data-crossed]");
    const children = [...(crossed?.children ?? [])].map((c) => c.tagName);
    // Disc, then slash, then number on top.
    expect(children).toEqual(["g", "line", "text"]);
    const text = crossed?.querySelector("text");
    expect(text).toHaveClass("fill-foreground", "stroke-surface");
    expect(Number(text?.getAttribute("font-size"))).toBeGreaterThanOrEqual(20);
  });
});

describe("NumberStepper", () => {
  it("steps within its range and names its buttons after the label", () => {
    const onChange = vi.fn();
    render(
      <NumberStepper
        label="Cơ số"
        value={10}
        min={1}
        max={10}
        onChange={onChange}
      />,
    );
    expect(screen.getByRole("button", { name: "Tăng cơ số" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Giảm cơ số" }));
    expect(onChange).toHaveBeenCalledWith(9);
  });

  it("marks its value and buttons with the state key it reports", () => {
    const { container } = render(
      <NumberStepper
        label="Số mũ"
        value={3}
        min={1}
        max={6}
        onChange={() => {}}
        stateKey="exponent"
      />,
    );
    const root = container.querySelector(`[${STATE_KEY_ATTR}="exponent"]`);
    expect(root).toHaveAttribute(STATE_VALUE_ATTR, "3");
    expect(
      root?.querySelector(`[${STATE_STEP_ATTR}="up"]`),
    ).toHaveAccessibleName("Tăng số mũ");
    expect(
      root?.querySelector(`[${STATE_STEP_ATTR}="down"]`),
    ).toHaveAccessibleName("Giảm số mũ");
  });

  it("carries no state markers without a state key", () => {
    const { container } = render(
      <NumberStepper
        label="Số mũ"
        value={3}
        min={1}
        max={6}
        onChange={() => {}}
      />,
    );
    expect(container.querySelector(`[${STATE_KEY_ATTR}]`)).toBeNull();
    expect(container.querySelector(`[${STATE_STEP_ATTR}]`)).toBeNull();
  });
});

describe("formatInteger", () => {
  it("groups by three from four digits with a narrow no-break space", () => {
    expect(formatInteger(999)).toBe("999");
    expect(formatInteger(1024)).toBe("1 024");
    expect(formatInteger(1000000)).toBe("1 000 000");
  });
});

describe("Reveal", () => {
  it("shows a dimmed placeholder row until its step, then the row itself", () => {
    const { rerender } = render(
      <Reveal shown={false} placeholder={<span>? · 2 = ?</span>}>
        <span>4 · 2 = 8</span>
      </Reveal>,
    );
    expect(screen.getByText("? · 2 = ?").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(screen.queryByText("4 · 2 = 8")).toBeNull();
    rerender(
      <Reveal shown placeholder={<span>? · 2 = ?</span>}>
        <span>4 · 2 = 8</span>
      </Reveal>,
    );
    expect(screen.getByText("4 · 2 = 8")).toBeVisible();
    expect(screen.queryByText("? · 2 = ?")).toBeNull();
  });

  it("keeps a row without placeholder hidden but in place", () => {
    render(
      <Reveal shown={false}>
        <span>8 : 8 = 1</span>
      </Reveal>,
    );
    expect(screen.getByText("8 : 8 = 1").parentElement).toHaveClass(
      "invisible",
    );
  });
});

describe("FormulaRow, Rows and Lines", () => {
  it("draws a formula with its tag, and an aside in a dashed box", () => {
    const { container } = render(
      <>
        <FormulaRow
          row={{ tex: "6 \\chiahet 3", tag: { text: "tag", color: "teal" } }}
        />
        <FormulaRow row={{ tex: "12 = 3 \\cdot 4", aside: true }} />
      </>,
    );
    expect(screen.getByText("tag")).toBeInTheDocument();
    expect(screen.getByText("vì")).toBeInTheDocument();
    expect(container.querySelector("[data-shape='pentagon']")).not.toBeNull();
    expect(container.querySelectorAll(".katex")).toHaveLength(2);
  });

  it("stacks the rows with the legend of the colours", () => {
    render(
      <Rows
        spec={{
          label: "Hai dòng",
          rows: [{ tex: "1 + 1" }, { tex: "2 + 2", gapBefore: true }],
          legend: [{ color: "amber", name: "Tổng" }],
        }}
      />,
    );
    expect(
      screen.getByRole("figure", { name: "Hai dòng" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows every line on a still and keeps the last one out of a hint", () => {
    const rows = [{ tex: "1 + 1" }, { tex: "2 + 2" }, { tex: "3 + 3" }];
    const still = render(
      <Lines spec={{ label: "Ví dụ", rows, mode: "still" }} />,
    );
    expect(still.container.querySelectorAll(".katex")).toHaveLength(3);
    still.unmount();
    const hint = render(
      <Lines spec={{ label: "Gợi ý", rows, mode: "hint" }} />,
    );
    // Only the first line is on screen at step 0; the others are dimmed "?".
    expect(
      hint.container.querySelectorAll("[aria-hidden='true']").length,
    ).toBeGreaterThan(0);
  });
});

describe("bag groups", () => {
  it("packs items into bags and reports what is left", () => {
    expect(packBags(21, 7)).toEqual({ bags: 3, left: 0 });
    expect(packBags(26, 6)).toEqual({ bags: 4, left: 2 });
  });

  it("lays bags of the same size out in the same number of columns", () => {
    expect([1, 4, 5, 6, 7, 8, 9].map(bagColumns)).toEqual([
      1, 4, 3, 3, 4, 4, 5,
    ]);
  });

  it("draws one dot per item, and empty slots for the ones taken away", () => {
    const { container } = render(
      <DotBlock count={5} columns={3} color="blue" label="Năm chấm" gone={2} />,
    );
    expect(screen.getByRole("img", { name: "Năm chấm" })).toBeInTheDocument();
    expect(container.querySelectorAll(".fill-concept-blue")).toHaveLength(3);
    expect(container.querySelectorAll(".fill-none")).toHaveLength(2);
  });

  it("draws a bag, the left-over box and the pending box", () => {
    render(
      <>
        <BagBox count={3} size={3} tone="bag" label="Túi 1" />
        <BagBox count={2} size={3} tone="left" label="Còn thừa 2" />
        <BagBox count={1} size={3} tone="pending" label="Số còn thừa" />
      </>,
    );
    expect(screen.getByRole("img", { name: "Túi 1" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Còn thừa 2" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Số còn thừa" })).toHaveTextContent(
      "?",
    );
  });

  it("draws every bag and the left-over box of a still picture", () => {
    render(
      <Bags
        spec={{
          total: 14,
          size: 3,
          thing: "kẹo",
          unit: "cái",
          bag: "túi",
          mode: "still",
        }}
      />,
    );
    expect(
      screen.getByRole("img", { name: "Túi 4: 3 cái" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Còn thừa 2 cái" }),
    ).toBeInTheDocument();
  });
});

describe("Chips", () => {
  it("reports one key per chip and finishes when exactly the wanted chips are picked", () => {
    const onStateChange = vi.fn();
    render(
      <Chips
        items={["2", "3", "4"]}
        wants={[0, 2]}
        done="Xong rồi!"
        onStateChange={onStateChange}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ i0: 1, i1: 0, i2: 0 });
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    fireEvent.click(screen.getByRole("button", { name: "4" }));
    expect(screen.queryByText("Xong rồi!")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "3" }));
    expect(screen.getByText("Xong rồi!")).toBeInTheDocument();
    expect(screen.getByText("Đã chọn 2/2")).toBeInTheDocument();
  });

  it("draws each thousands separator as a gap of its own and keeps the character in the text", () => {
    const { container } = render(<Chips items={["2\u202f340", "75"]} />);
    expect(screen.getAllByRole("button")[0].textContent).toBe("2\u202f340");
    expect(container.querySelectorAll(".w-\\[0\\.25em\\]")).toHaveLength(1);
  });

  it("shows only a count and locks when the answer is shown", () => {
    render(<Chips items={["2", "3"]} shownState={{ i0: 1, i1: 0 }} />);
    expect(screen.getByText("Đã chọn 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeDisabled();
  });
});
