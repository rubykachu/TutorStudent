import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { BOTTOM_BAR_HEIGHT_VAR, BottomBar } from "@/components/bottom-bar";

describe("BottomBar", () => {
  it("publishes its height for the document's scroll-padding", () => {
    const { container, unmount } = render(
      <BottomBar>
        <button type="button">Kiểm tra</button>
      </BottomBar>,
    );
    const root = document.documentElement;
    expect(root.style.getPropertyValue(BOTTOM_BAR_HEIGHT_VAR)).toMatch(/px$/);
    // Full-width surface with a hairline top edge, kept in the thumb zone.
    expect(container.querySelector("[data-bottom-bar]")).toHaveClass(
      "bar-surface",
      "sticky",
      "bottom-0",
    );
    unmount();
    expect(root.style.getPropertyValue(BOTTOM_BAR_HEIGHT_VAR)).toBe("");
  });
});
