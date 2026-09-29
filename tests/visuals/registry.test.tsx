import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { visualRegistry } from "@/visuals/registry";

describe("visualRegistry", () => {
  it.each(Object.keys(visualRegistry))("%s loads and renders", async (id) => {
    const entry = visualRegistry[id];
    if (!entry) throw new Error(id);
    const { default: Visual } = await entry.load();
    const { container } = render(<Visual />);
    expect(container.firstChild).not.toBeNull();
  });

  it("declares exactly the regions a tappable visual renders", async () => {
    for (const entry of Object.values(visualRegistry)) {
      if (!entry.regions) continue;
      const { default: Visual } = await entry.load();
      const { container, unmount } = render(<Visual />);
      const rendered = [...container.querySelectorAll("[data-region]")].map(
        (el) => el.getAttribute("data-region"),
      );
      expect(rendered).toEqual([...entry.regions]);
      unmount();
    }
  });

  it("the dot counter reports its state and satisfies count-equals", async () => {
    const entry = visualRegistry["fixture.visual.dot-counter"];
    const validate = entry?.validators?.["count-equals"];
    if (!entry || !validate) throw new Error("dot counter missing");
    const { default: DotCounter } = await entry.load();
    const onStateChange = vi.fn();
    render(<DotCounter onStateChange={onStateChange} />);

    const add = screen.getByRole("button", { name: "Thêm một chấm" });
    fireEvent.click(add);
    fireEvent.click(add);
    fireEvent.click(screen.getByRole("button", { name: "Bớt một chấm" }));

    expect(onStateChange).toHaveBeenLastCalledWith({ count: 1 });
    expect(validate({ count: 1 }, { count: 1 })).toBe(true);
    expect(validate({ count: 2 }, { count: 1 })).toBe(false);
    expect(validate({}, { count: 1 })).toBe(false);
  });
});
