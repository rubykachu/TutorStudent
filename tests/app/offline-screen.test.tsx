import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OfflineScreen } from "@/app/offline/offline-screen";

describe("OfflineScreen", () => {
  it("shows the owl gently moving beside the heading", () => {
    const { container } = render(<OfflineScreen />);
    expect(
      screen.getByRole("heading", { name: "Cần mạng để mở trang này" }),
    ).toBeVisible();
    expect(container.querySelector("[data-mascot-loop]")).not.toBeNull();
  });
});
