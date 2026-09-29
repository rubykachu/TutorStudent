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

  it("lets a hint light up a coloured part by its id", () => {
    const { container } = render(
      <Formula
        tex="\htmlId{co-so}{\concept{blue}{2}}^{3}"
        highlight={[{ id: "co-so", strong: false }]}
      />,
    );
    expect(container.querySelector("#co-so")).toHaveClass("bg-highlight");
  });

  it("marks itself for the formula typography in globals.css", () => {
    const { container } = render(<Formula tex="2^5" />);
    expect(container.firstElementChild).toHaveClass("formula");
  });
});
