import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { formatInteger } from "@/lib/number-format";
import { BeadGroup } from "@/visuals/shared/bead-group";
import { DotGrid } from "@/visuals/shared/dot-grid";
import { Highlight } from "@/visuals/shared/highlight";
import {
  DECORATIVE_ATTR,
  STATE_KEY_ATTR,
  STATE_STEP_ATTR,
  STATE_VALUE_ATTR,
} from "@/visuals/shared/markers";
import { NumberStepper } from "@/visuals/shared/number-stepper";

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
