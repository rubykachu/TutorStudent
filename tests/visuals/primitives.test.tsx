import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BeadGroup } from "@/visuals/shared/bead-group";
import { DotGrid } from "@/visuals/shared/dot-grid";
import { Highlight } from "@/visuals/shared/highlight";
import { DECORATIVE_ATTR } from "@/visuals/shared/markers";

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
