import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CosmosBackground } from "@/components/cosmos-background";

describe("CosmosBackground", () => {
  it("is decoration only: behind the page, hidden, no tap, no text, nothing focusable", () => {
    const { container } = render(<CosmosBackground />);
    const root = container.querySelector("[data-cosmos]");
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("pointer-events-none", "fixed", "-z-10");
    expect(root?.textContent).toBe("");
    expect(root?.querySelectorAll("a, button, input, [tabindex]")).toHaveLength(
      0,
    );
  });
});
