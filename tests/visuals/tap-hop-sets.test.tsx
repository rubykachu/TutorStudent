import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  pickMatches,
  solvePickMatches,
  solveXIsMember,
  xIsMember,
} from "@/visuals/math/tap-hop/set-validators";
import { visualRegistry } from "@/visuals/registry";

async function load(id: string) {
  const entry = visualRegistry[id];
  if (!entry) throw new Error(`${id} missing`);
  return (await entry.load()).default;
}

describe("pick validator", () => {
  const params = { i0: 1, i1: 0, i2: 1 };

  it("accepts exactly the asked items, untouched ones counting as outside", () => {
    expect(pickMatches({ i0: 1, i1: 0, i2: 1 }, params)).toBe(true);
    expect(pickMatches({ i0: 1, i2: 1 }, params)).toBe(true);
    expect(pickMatches({ i0: 1, i1: 1, i2: 1 }, params)).toBe(false);
    expect(pickMatches({}, params)).toBe(false);
  });

  it("solves to the asked state", () => {
    expect(pickMatches(solvePickMatches(params), params)).toBe(true);
  });
});

describe("x membership validator", () => {
  const inside = { want: 1, count: 3, e0: 1, e1: 3, e2: 5 };
  const outside = { ...inside, want: 0 };

  it("checks x against the listed elements", () => {
    expect(xIsMember({ x: 3 }, inside)).toBe(true);
    expect(xIsMember({ x: 4 }, inside)).toBe(false);
    expect(xIsMember({ x: 4 }, outside)).toBe(true);
    expect(xIsMember({ x: 5 }, outside)).toBe(false);
  });

  it("never accepts an x the child did not choose", () => {
    expect(xIsMember({}, inside)).toBe(false);
    expect(xIsMember({}, outside)).toBe(false);
  });

  it("solves to a state the validator accepts", () => {
    expect(solveXIsMember(inside)).toEqual({ x: 1 });
    expect(solveXIsMember(outside)).toEqual({ x: 2 });
    const zeroIsMember = { want: 0, count: 2, e0: 0, e1: 1 };
    expect(solveXIsMember(zeroIsMember)).toEqual({ x: 2 });
    expect(xIsMember(solveXIsMember(zeroIsMember), zeroIsMember)).toBe(true);
  });
});

describe("pick items visual", () => {
  it("moves an item into the box and back, reporting one key per item", async () => {
    const Pick = await load("tap-hop.visual.chon-do-dung");
    const onStateChange = vi.fn();
    render(<Pick onStateChange={onStateChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Bỏ thước vào hộp" }));
    expect(onStateChange).toHaveBeenLastCalledWith({
      i0: 1,
      i1: 0,
      i2: 0,
      i3: 0,
      i4: 0,
      i5: 0,
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Lấy thước ra khỏi hộp" }),
    );
    expect(onStateChange).toHaveBeenLastCalledWith({
      i0: 0,
      i1: 0,
      i2: 0,
      i3: 0,
      i4: 0,
      i5: 0,
    });
  });

  it("marks every toggle with the value it sets and locks when disabled", async () => {
    const Pick = await load("tap-hop.visual.chon-do-dung");
    const { container, rerender } = render(<Pick shownState={{ i0: 1 }} />);
    expect(
      container.querySelector("[data-state-set='i0=0']"),
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-state-set='i1=1']"),
    ).toBeInTheDocument();
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
    rerender(<Pick disabled />);
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });
});

describe("choose x visual", () => {
  it("names the verdict with the real number when it is shown", async () => {
    const Choose = await load("tap-hop.visual.chon-x-tu-do");
    const onStateChange = vi.fn();
    render(<Choose onStateChange={onStateChange} />);
    // Starts on x = 4, outside A = { 1 ; 2 ; 3 }.
    expect(screen.getByText("4 không thuộc A")).toBeInTheDocument();
    expect(screen.getByText(/∉/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Giảm x" }));
    fireEvent.click(screen.getByRole("button", { name: "Giảm x" }));
    expect(onStateChange).toHaveBeenLastCalledWith({ x: 2 });
    expect(screen.getByText("2 thuộc A")).toBeInTheDocument();
    expect(screen.getByText(/∈/)).toBeInTheDocument();
  });

  it("leaves the comparison to the child in the exercise visuals", async () => {
    for (const id of [
      "tap-hop.visual.chon-x-thuoc",
      "tap-hop.visual.chon-x-khong-thuoc",
    ]) {
      const Choose = await load(id);
      const onStateChange = vi.fn();
      const { container, unmount } = render(
        <Choose onStateChange={onStateChange} />,
      );
      fireEvent.click(screen.getByRole("button", { name: "Tăng x" }));
      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(container.textContent).not.toMatch(/∈|∉|thuộc/);
      unmount();
    }
  });

  it("draws the revealed answer and locks", async () => {
    const Choose = await load("tap-hop.visual.chon-x-thuoc");
    render(<Choose shownState={{ x: 4 }} />);
    expect(screen.getByRole("status")).toHaveTextContent("4");
    expect(screen.getByRole("button", { name: "Tăng x" })).toBeDisabled();
  });
});

describe("tap regions", () => {
  it("declares the regions in drawn order", () => {
    expect(visualRegistry["tap-hop.visual.hop-cham"]?.regions).toEqual([
      "but",
      "thuoc",
      "tay",
    ]);
    expect(visualRegistry["tap-hop.visual.cham-dau-hieu"]?.regions).toEqual([
      "phan-tu-mau",
      "vach-dung",
      "dau-hieu",
    ]);
  });
});
