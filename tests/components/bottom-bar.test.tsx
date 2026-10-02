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

  it("turns into one compact row on a short viewport, keeping the secondary link its own width", () => {
    const { container } = render(
      <BottomBar>
        <button type="button">Bắt đầu học</button>
        <button type="button" data-bar-secondary>
          Xem các phần của bài
        </button>
      </BottomBar>,
    );
    const bar = container.querySelector("[data-bottom-bar]");
    // `short:` is a viewport under 500px tall (a phone held sideways).
    expect(bar).toHaveClass(
      "short:flex-row",
      "short:items-center",
      "short:pt-2",
      "short:[&>*]:flex-1",
      "short:[&>[data-bar-secondary]]:flex-none",
    );
    // The bottom padding clears the home indicator.
    expect(bar?.className).toContain("env(safe-area-inset-bottom)");
  });

  it("leaves the height to the bar on show while its screen is hidden", () => {
    const root = document.documentElement;
    const shown = render(
      <BottomBar>
        <button type="button">Tiếp</button>
      </BottomBar>,
    );
    root.style.setProperty(BOTTOM_BAR_HEIGHT_VAR, "80px");
    const hidden = render(
      <div hidden>
        <BottomBar>
          <button type="button">Kiểm tra</button>
        </BottomBar>
      </div>,
    );
    expect(root.style.getPropertyValue(BOTTOM_BAR_HEIGHT_VAR)).toBe("80px");
    hidden.unmount();
    shown.unmount();
  });
});
