import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Formula } from "@/components/blocks/formula";

describe("Formula", () => {
  it("paints \\concept parts in their concept colour", () => {
    const { container } = render(
      <Formula tex="\concept{blue}{2}^{\concept{violet}{5}}" />,
    );
    const base = container.querySelector('[data-concept="blue"]');
    const exponent = container.querySelector('[data-concept="violet"]');
    expect(base).toHaveClass("text-concept-blue");
    expect(base?.textContent).toBe("2");
    expect(exponent).toHaveClass("text-concept-violet");
  });

  it("keeps other HTML data attributes untrusted", () => {
    const { container } = render(
      <Formula tex="\htmlData{concept=red}{2} + \htmlData{onclick=x}{3}" />,
    );
    expect(container.querySelector("[data-concept]")).toBeNull();
    expect(container.querySelector("[data-onclick]")).toBeNull();
  });

  it("outlines a hinted part in its concept colour, never with the highlight fill", () => {
    const { container, rerender } = render(
      <Formula
        tex="\htmlId{co-so}{\concept{blue}{2}}^{3}"
        highlight={[{ id: "co-so", color: "blue", strong: false }]}
      />,
    );
    const part = container.querySelector("#co-so");
    expect(part).toHaveAttribute("data-highlighted");
    expect(part).toHaveClass("outline-3", "outline-concept-blue");
    expect(part).not.toHaveClass("bg-highlight");

    rerender(
      <Formula
        tex="\htmlId{co-so}{\concept{blue}{2}}^{3}"
        highlight={[{ id: "co-so", color: "slate", strong: true }]}
      />,
    );
    expect(part).toHaveClass("outline-5", "outline-concept-slate");
    expect(part).not.toHaveClass("outline-3", "outline-concept-blue");
    expect(part).toHaveAttribute("data-highlight-strong");
  });

  it("marks itself for the formula typography in globals.css", () => {
    const { container } = render(<Formula tex="2^5" />);
    expect(container.firstElementChild).toHaveClass("formula");
  });
});
